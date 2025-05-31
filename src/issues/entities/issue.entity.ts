import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IssueHistory } from './issue-history.entity';
import { SlackThread } from '../../slack/entities/slack-thread.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity()
export class Issue {
  @ApiProperty({ description: 'The unique identifier of the issue', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The title of the issue', example: 'Fix login button' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Detailed description of the issue', example: 'The login button on the homepage is not responding to clicks' })
  @Column('text')
  description: string;

  @ApiProperty({ 
    description: 'Current status of the issue',
    enum: IssueStatus,
    example: IssueStatus.OPEN,
    default: IssueStatus.OPEN
  })
  @Column({ type: 'varchar', default: IssueStatus.OPEN })
  status: IssueStatus;

  @ApiProperty({ 
    description: 'Priority level of the issue',
    enum: IssuePriority,
    example: IssuePriority.MEDIUM,
    default: IssuePriority.MEDIUM
  })
  @Column({ type: 'varchar', default: IssuePriority.MEDIUM })
  priority: IssuePriority;

  @ApiProperty({ description: 'User assigned to handle the issue', type: () => User })
  @ManyToOne(() => User, user => user.assignedIssues)
  assignee: User;

  @ApiProperty({ description: 'User who reported the issue', type: () => User })
  @ManyToOne(() => User, user => user.reportedIssues)
  reporter: User;

  @ApiProperty({ description: 'History of changes made to the issue', type: () => [IssueHistory] })
  @OneToMany(() => IssueHistory, history => history.issue)
  history: IssueHistory[];

  @ApiProperty({ description: 'Associated Slack thread messages', type: () => [SlackThread] })
  @OneToMany(() => SlackThread, thread => thread.issue)
  slackThreads: SlackThread[];

  @ApiProperty({ description: 'Whether the issue has been poked', example: false, default: false })
  @Column({ default: false })
  isPoked: boolean;

  @ApiProperty({ description: 'Timestamp of the last poke', nullable: true })
  @Column({ nullable: true })
  lastPokedAt: Date;

  @ApiProperty({ description: 'Timestamp when the issue was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the issue was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
} 