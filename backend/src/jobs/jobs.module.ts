import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { AIRecommendationService } from './ai-job-recommendation.service';
import { RecommendationCron } from './recommendation.cron';
import { GeminiModule } from '../gemini/gemini.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JobsGateway } from '../websocket-gateway/jobs.gateway';

@Module({
  imports: [PrismaModule, ConfigModule, GeminiModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    AIRecommendationService,
    RecommendationCron,
    JobsGateway,
  ],
  exports: [JobsService, AIRecommendationService, JobsGateway],
})
export class JobsModule {}
