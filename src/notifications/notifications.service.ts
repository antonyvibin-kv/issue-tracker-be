import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { User } from '../users/entities/user.entity';
import { Issue, IssueStatus } from '../issues/entities/issue.entity';

@Injectable()
export class NotificationsService {
  private slackClient: WebClient;

  constructor(private configService: ConfigService) {
    this.slackClient = new WebClient(this.configService.get('SLACK_BOT_TOKEN'));
  }

  async notifyNewIssue(assignee: User, issue: Issue): Promise<void> {
    if (!assignee.slackUserId) return;

    await this.slackClient.chat.postMessage({
      channel: assignee.slackUserId,
      text: `You have been assigned to a new issue: ${issue.title}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Issue Assigned*\n*Title:* ${issue.title}\n*Description:* ${issue.description}\n*Priority:* ${issue.priority}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Issue',
                emoji: true,
              },
              url: `${this.configService.get('FRONTEND_URL')}/issues/${issue.id}`,
            },
          ],
        },
      ],
    });
  }

  async notifyStatusChange(
    assignee: User,
    issue: Issue,
    oldStatus: IssueStatus,
  ): Promise<void> {
    if (!assignee.slackUserId) return;

    await this.slackClient.chat.postMessage({
      channel: assignee.slackUserId,
      text: `Issue status updated: ${issue.title}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Issue Status Updated*\n*Title:* ${issue.title}\n*Old Status:* ${oldStatus}\n*New Status:* ${issue.status}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Issue',
                emoji: true,
              },
              url: `${this.configService.get('FRONTEND_URL')}/issues/${issue.id}`,
            },
          ],
        },
      ],
    });
  }

  async notifyPoke(assignee: User, issue: Issue): Promise<void> {
    if (!assignee.slackUserId) return;

    await this.slackClient.chat.postMessage({
      channel: assignee.slackUserId,
      text: `You have been poked about an issue: ${issue.title}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Issue Poke*\n*Title:* ${issue.title}\n*Description:* ${issue.description}\n*Status:* ${issue.status}\n*Priority:* ${issue.priority}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Issue',
                emoji: true,
              },
              url: `${this.configService.get('FRONTEND_URL')}/issues/${issue.id}`,
            },
          ],
        },
      ],
    });
  }
} 