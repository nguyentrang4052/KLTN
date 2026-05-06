import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationService } from './notification.service';
import { NotificationGateway } from '../websocket-gateway/notification.gateway';
import { NotificationController } from './notification.controller';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    MailModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationScheduler, NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
