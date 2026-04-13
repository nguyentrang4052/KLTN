import { Module } from '@nestjs/common';
import { CvAnalyzerController } from './cv-analyzer.controller';
import { CvAnalyzerService } from './cv-analyzer.service';
import { GeminiModule } from '../gemini/gemini.module'; // Thay thế OpenRouterModule

@Module({
  imports: [GeminiModule], // Thay đổi ở đây
  controllers: [CvAnalyzerController],
  providers: [CvAnalyzerService],
})
export class CvAnalyzerModule {}