import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('commands')
  async handleCommand(
    @Body() body: any,
    @Headers('x-slack-signature') signature: string,
    @Headers('x-slack-request-timestamp') timestamp: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req.rawBody;
    await this.slackService.verifySlackRequest(signature, timestamp, rawBody);
    return this.slackService.handleCommand(body);
  }

  @Post('interactions')
  async handleInteraction(
    @Body() body: any,
    @Headers('x-slack-signature') signature: string,
    @Headers('x-slack-request-timestamp') timestamp: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req.rawBody;
    await this.slackService.verifySlackRequest(signature, timestamp, rawBody);
    return this.slackService.handleInteraction(body);
  }
} 