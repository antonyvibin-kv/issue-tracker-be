import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Issue } from '../../issues/entities/issue.entity';

@Entity()
export class SlackThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Issue, issue => issue.slackThreads)
  issue: Issue;

  @Column()
  channelId: string;

  @Column()
  threadTs: string;

  @Column({ nullable: true })
  messageTs: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 