import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { CrawlModule } from './crawl/crawl.module';
import { JobsModule } from './jobs/jobs.module';
import { IndustriesModule } from './industries/industries.module';
import { CompaniesModule } from './companies/companies.module';
import { ProfileModule } from './profile/profile.module';
import { JobAlertModule } from './job-alert/job-alert.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CrawlModule,
    CommonModule,
    AuthModule,
    JobsModule,
    IndustriesModule,
    CompaniesModule,
    ProfileModule,
    JobAlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
