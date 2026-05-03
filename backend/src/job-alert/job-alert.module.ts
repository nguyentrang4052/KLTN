import { Module } from '@nestjs/common';
import { JobAlertService } from './job-alert.service';
import { JobAlertController } from './job-alert.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, MailModule, NotificationModule],
  providers: [JobAlertService],
  controllers: [JobAlertController],
})
export class JobAlertModule {}
