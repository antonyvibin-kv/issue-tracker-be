import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IssueHistory } from './issue-history.entity';
import { SlackThread } from '../../slack/entities/slack-thread.entity';

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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', default: IssueStatus.OPEN })
  status: IssueStatus;

  @Column({ type: 'varchar', default: IssuePriority.MEDIUM })
  priority: IssuePriority;

  @ManyToOne(() => User, user => user.assignedIssues)
  assignee: User;

  @ManyToOne(() => User, user => user.reportedIssues)
  reporter: User;

  @OneToMany(() => IssueHistory, history => history.issue)
  history: IssueHistory[];

  @OneToMany(() => SlackThread, thread => thread.issue)
  slackThreads: SlackThread[];

  @Column({ default: false })
  isPoked: boolean;

  @Column({ nullable: true })
  lastPokedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 