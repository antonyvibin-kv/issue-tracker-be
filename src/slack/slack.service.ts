import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import { SlackThread } from './entities/slack-thread.entity';
import { IssuesService } from '../issues/issues.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SlackService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(SlackThread)
    private slackThreadRepository: Repository<SlackThread>,
    private issuesService: IssuesService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async verifySlackRequest(
    signature: string,
    timestamp: string,
    rawBody: Buffer,
  ): Promise<void> {
    const signingSecret = this.configService.get<string>('SLACK_SIGNING_SECRET');
    const time = Math.floor(Date.now() / 1000);
    const fiveMinutesAgo = time - 60 * 5;

    if (parseInt(timestamp) < fiveMinutesAgo) {
      throw new UnauthorizedException('Request is too old');
    }

    const sigBasestring = `v0:${timestamp}:${rawBody.toString()}`;
    const mySignature = `v0=${createHmac('sha256', signingSecret)
      .update(sigBasestring)
      .digest('hex')}`;

    if (mySignature !== signature) {
      throw new UnauthorizedException('Invalid signature');
    }
  }

  async handleCommand(body: any): Promise<any> {
    const { command, text, user_id, team_id, channel_id, response_url } = body;

    switch (command) {
      case '/report-issue':
        return this.handleReportIssue(
          text,
          user_id,
          team_id,
          channel_id,
          response_url,
        );
      default:
        return {
          response_type: 'ephemeral',
          text: 'Unknown command',
        };
    }
  }

  async handleInteraction(body: any): Promise<any> {
    const payload = JSON.parse(body.payload);
    const { type, actions, user, team } = payload;

    switch (type) {
      case 'block_actions':
        return this.handleBlockActions(actions, user, team);
      default:
        return {
          response_type: 'ephemeral',
          text: 'Unknown interaction type',
        };
    }
  }

  private async handleReportIssue(
    text: string,
    userId: string,
    teamId: string,
    channelId: string,
    responseUrl: string,
  ): Promise<any> {
    const user = await this.usersService.findBySlackId(userId, teamId);
    if (!user) {
      return {
        response_type: 'ephemeral',
        text: 'You need to be registered to report issues. Please contact your administrator.',
      };
    }

    const [title, ...descriptionParts] = text.split('\n');
    const description = descriptionParts.join('\n');

    const issue = await this.issuesService.create({
      title,
      description,
      reporterId: user.id,
    });

    const thread = await this.slackThreadRepository.save({
      issue,
      channelId,
      threadTs: new Date().toISOString(),
      isActive: true,
    });

    return {
      response_type: 'in_channel',
      text: `Issue created: ${issue.title}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Issue Created*\n*Title:* ${issue.title}\n*Description:* ${issue.description}\n*Status:* ${issue.status}\n*Priority:* ${issue.priority}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Update Status',
                emoji: true,
              },
              value: issue.id,
              action_id: 'update_status',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Poke Assignee',
                emoji: true,
              },
              value: issue.id,
              action_id: 'poke_assignee',
            },
          ],
        },
      ],
    };
  }

  private async handleBlockActions(
    actions: any[],
    user: any,
    team: any,
  ): Promise<any> {
    const action = actions[0];
    const issueId = action.value;

    switch (action.action_id) {
      case 'update_status':
        return this.handleStatusUpdate(issueId, user, team);
      case 'poke_assignee':
        return this.handlePokeAssignee(issueId, user, team);
      default:
        return {
          response_type: 'ephemeral',
          text: 'Unknown action',
        };
    }
  }

  private async handleStatusUpdate(
    issueId: string,
    user: any,
    team: any,
  ): Promise<any> {
    const issue = await this.issuesService.findOne(issueId);
    const slackUser = await this.usersService.findBySlackId(user.id, team.id);

    if (!slackUser) {
      return {
        response_type: 'ephemeral',
        text: 'You need to be registered to update issues.',
      };
    }

    return {
      response_type: 'ephemeral',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Select new status:',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'static_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select status',
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'Open',
                    emoji: true,
                  },
                  value: 'open',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'In Progress',
                    emoji: true,
                  },
                  value: 'in_progress',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Resolved',
                    emoji: true,
                  },
                  value: 'resolved',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Closed',
                    emoji: true,
                  },
                  value: 'closed',
                },
              ],
              action_id: 'status_select',
            },
          ],
        },
      ],
    };
  }

  private async handlePokeAssignee(
    issueId: string,
    user: any,
    team: any,
  ): Promise<any> {
    const issue = await this.issuesService.findOne(issueId);
    const slackUser = await this.usersService.findBySlackId(user.id, team.id);

    if (!slackUser) {
      return {
        response_type: 'ephemeral',
        text: 'You need to be registered to poke assignees.',
      };
    }

    if (!issue.assignee) {
      return {
        response_type: 'ephemeral',
        text: 'This issue has no assignee to poke.',
      };
    }

    await this.issuesService.poke(issueId);

    return {
      response_type: 'ephemeral',
      text: `Poked ${issue.assignee.name} about this issue.`,
    };
  }
} 