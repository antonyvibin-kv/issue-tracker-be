import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Issue, IssueStatus } from './issue.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class IssueHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Issue, issue => issue.history)
  issue: Issue;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'varchar', nullable: true })
  oldStatus: IssueStatus;

  @Column({ type: 'varchar', nullable: true })
  newStatus: IssueStatus;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
} 