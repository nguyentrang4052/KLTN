import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { AIRecommendationService } from './ai-job-recommendation.service';
// import { RecommendationCron } from './recommendation.cron';
import { GeminiModule } from '../gemini/gemini.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JobsGateway } from '../websocket-gateway/jobs.gateway';
import { ActiveUsersGateway } from '../websocket-gateway/active-users.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    GeminiModule,
    SubscriptionModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [JobsController],
  providers: [
    JobsService,
    AIRecommendationService,
    // RecommendationCron,
    JobsGateway,
    ActiveUsersGateway,
  ],
  exports: [JobsService, AIRecommendationService, JobsGateway],
})
export class JobsModule {}
