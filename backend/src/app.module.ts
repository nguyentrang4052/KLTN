import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { IndustriesModule } from './industries/industries.module';
import { CompaniesModule } from './companies/companies.module';
import { ProfileModule } from './profile/profile.module';
import { JobAlertModule } from './job-alert/job-alert.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingModule } from './setting/setting.module';
import { CvAnalyzerModule } from './cv-analyzer/cv-analyzer.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AdminModule } from './admin/admin.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ChatbotModule } from './chatbot/chatbot.module';
import { RedisModule } from './redis/redis.module';
import { ChatHistoryModule } from './chatbot/chat-history.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    JobsModule,
    IndustriesModule,
    CompaniesModule,
    ProfileModule,
    SettingModule,
    JobAlertModule,
    CvAnalyzerModule,
    SubscriptionModule,
    AdminModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 3600, // 1 giờ (giây)
        }),
      }),
    }),
    ChatbotModule,
    RedisModule,
    ChatHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
