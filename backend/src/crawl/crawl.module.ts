import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrawlController } from './crawl.controller';
import { CrawlService } from './crawl.service';
import { JobsModule } from '../jobs/jobs.module'; 

@Module({
  imports: [
    ConfigModule,
    JobsModule, // Import để dùng JobsService trong CrawlController
  ],
  controllers: [CrawlController],
  providers: [CrawlService],
  exports: [CrawlService],
})
export class CrawlModule {}