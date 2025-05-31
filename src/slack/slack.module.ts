import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { SlackThread } from './entities/slack-thread.entity';
import { IssuesModule } from '../issues/issues.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SlackThread]),
    forwardRef(() => IssuesModule),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [SlackController],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {} 