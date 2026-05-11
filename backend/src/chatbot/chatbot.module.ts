import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 600000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    }),
    ConfigModule,
    SubscriptionModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
