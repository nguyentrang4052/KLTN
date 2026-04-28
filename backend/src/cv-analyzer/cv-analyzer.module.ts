import { Module } from '@nestjs/common';
import { CvAnalyzerController } from './cv-analyzer.controller';
import { CvAnalyzerService } from './cv-analyzer.service';
import { GeminiModule } from '../gemini/gemini.module'; 
import { PdfToImageService } from './pdf-to-image.service';
import { CVAnalysisRepository } from './cv-analysis.repository';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from '../../prisma/prisma.module';


@Module({
  imports: [GeminiModule, RedisModule, PrismaModule], // Thay đổi ở đây
  controllers: [CvAnalyzerController],
  providers: [CvAnalyzerService, PdfToImageService, CVAnalysisRepository],
})
export class CvAnalyzerModule {}