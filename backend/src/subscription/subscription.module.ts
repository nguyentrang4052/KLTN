import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, ConfigModule, MailModule, NotificationModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
