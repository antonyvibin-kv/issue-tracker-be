import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Issue } from '../../issues/entities/issue.entity';

export enum UserRole {
  DEVELOPER = 'developer',
  CLIENT = 'client'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: UserRole.DEVELOPER })
  role: UserRole;

  @Column({ nullable: true })
  slackUserId: string;

  @Column({ nullable: true })
  slackWorkspaceId: string;

  @OneToMany(() => Issue, issue => issue.assignee)
  assignedIssues: Issue[];

  @OneToMany(() => Issue, issue => issue.reporter)
  reportedIssues: Issue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 