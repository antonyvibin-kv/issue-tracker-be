import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IssueStatus, IssuePriority } from '../entities/issue.entity';

export class UpdateIssueDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
} 