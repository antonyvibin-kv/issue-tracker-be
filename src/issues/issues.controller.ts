import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { Issue } from './entities/issue.entity';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiResponse({ status: 201, description: 'The issue has been successfully created.', type: Issue })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createIssueDto: CreateIssueDto): Promise<Issue> {
    return this.issuesService.create(createIssueDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all issues' })
  @ApiResponse({ status: 200, description: 'List of all issues.', type: [Issue] })
  findAll(): Promise<Issue[]> {
    return this.issuesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific issue by ID' })
  @ApiParam({ name: 'id', description: 'Issue ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'The issue has been found.', type: Issue })
  @ApiResponse({ status: 404, description: 'Issue not found.' })
  findOne(@Param('id') id: string): Promise<Issue> {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an issue' })
  @ApiParam({ name: 'id', description: 'Issue ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'The issue has been successfully updated.', type: Issue })
  @ApiResponse({ status: 404, description: 'Issue not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Post(':id/poke')
  @ApiOperation({ summary: 'Poke an issue to notify assignee' })
  @ApiParam({ name: 'id', description: 'Issue ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'The issue has been successfully poked.', type: Issue })
  @ApiResponse({ status: 404, description: 'Issue not found.' })
  poke(@Param('id') id: string): Promise<Issue> {
    return this.issuesService.poke(id);
  }
} 