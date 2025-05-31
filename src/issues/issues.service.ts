import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { IssueHistory } from './entities/issue-history.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
    @InjectRepository(IssueHistory)
    private issueHistoryRepository: Repository<IssueHistory>,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const reporter = await this.usersService.findOne(createIssueDto.reporterId);
    const assignee = createIssueDto.assigneeId
      ? await this.usersService.findOne(createIssueDto.assigneeId)
      : null;

    const issue = this.issuesRepository.create({
      ...createIssueDto,
      reporter,
      assignee,
    });

    const savedIssue = await this.issuesRepository.save(issue);

    // Create initial history entry
    await this.issueHistoryRepository.save({
      issue: savedIssue,
      user: reporter,
      newStatus: savedIssue.status,
    });

    // Notify assignee if exists
    if (assignee) {
      await this.notificationsService.notifyNewIssue(assignee, savedIssue);
    }

    return savedIssue;
  }

  async findAll(): Promise<Issue[]> {
    return this.issuesRepository.find({
      relations: ['reporter', 'assignee'],
    });
  }

  async findOne(id: string): Promise<Issue> {
    const issue = await this.issuesRepository.findOne({
      where: { id },
      relations: ['reporter', 'assignee', 'history', 'slackThreads'],
    });

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return issue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const issue = await this.findOne(id);
    const oldStatus = issue.status;

    if (updateIssueDto.assigneeId) {
      issue.assignee = await this.usersService.findOne(updateIssueDto.assigneeId);
    }

    Object.assign(issue, updateIssueDto);
    const updatedIssue = await this.issuesRepository.save(issue);

    // Create history entry if status changed
    if (updateIssueDto.status && updateIssueDto.status !== oldStatus) {
      await this.issueHistoryRepository.save({
        issue: updatedIssue,
        user: issue.assignee,
        oldStatus,
        newStatus: updateIssueDto.status,
      });

      // Notify status change
      if (issue.assignee) {
        await this.notificationsService.notifyStatusChange(
          issue.assignee,
          updatedIssue,
          oldStatus,
        );
      }
    }

    return updatedIssue;
  }

  async poke(id: string): Promise<Issue> {
    const issue = await this.findOne(id);

    if (!issue.assignee) {
      throw new NotFoundException('Issue has no assignee to poke');
    }

    issue.isPoked = true;
    issue.lastPokedAt = new Date();

    const updatedIssue = await this.issuesRepository.save(issue);

    // Send poke notification
    await this.notificationsService.notifyPoke(issue.assignee, updatedIssue);

    return updatedIssue;
  }
} 