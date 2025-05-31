import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IssueStatus, IssuePriority } from '../entities/issue.entity';

export class CreateIssueDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @IsUUID()
  reporterId: string;
} 