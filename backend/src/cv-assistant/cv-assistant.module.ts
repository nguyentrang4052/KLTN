import { Module } from '@nestjs/common';
import { GeminiModule } from '../gemini/gemini.module';
import { CvAssistantController } from './cv-assistant.controller';

@Module({
  imports: [GeminiModule],
  controllers: [CvAssistantController],
})
export class CvAssistantModule {}