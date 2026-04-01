import { Module } from '@nestjs/common';
import { JobAlertService } from './job-alert.service';
import { JobAlertController } from './job-alert.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [JobAlertController],
  providers: [JobAlertService, PrismaService],
})
export class JobAlertModule {}
