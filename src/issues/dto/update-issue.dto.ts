import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IssueStatus, IssuePriority } from '../entities/issue.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIssueDto {
  @ApiProperty({ 
    description: 'The title of the issue',
    example: 'Fix login button',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ 
    description: 'Detailed description of the issue',
    example: 'The login button on the homepage is not responding to clicks',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Current status of the issue',
    enum: IssueStatus,
    example: IssueStatus.IN_PROGRESS,
    required: false
  })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @ApiProperty({ 
    description: 'Priority level of the issue',
    enum: IssuePriority,
    example: IssuePriority.HIGH,
    required: false
  })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @ApiProperty({ 
    description: 'UUID of the user assigned to handle the issue',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;
} 