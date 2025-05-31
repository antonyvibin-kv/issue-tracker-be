import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { Issue } from './entities/issue.entity';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(@Body() createIssueDto: CreateIssueDto): Promise<Issue> {
    return this.issuesService.create(createIssueDto);
  }

  @Get()
  findAll(): Promise<Issue[]> {
    return this.issuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Issue> {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Post(':id/poke')
  poke(@Param('id') id: string): Promise<Issue> {
    return this.issuesService.poke(id);
  }
} 