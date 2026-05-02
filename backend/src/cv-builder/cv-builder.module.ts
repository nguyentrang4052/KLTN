import { Module } from '@nestjs/common';
import { CvBuilderController } from './cv-builder.controller';
import { CvBuilderService } from './cv-builder.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CvBuilderController],
  providers: [CvBuilderService],
  exports: [CvBuilderService],
})
export class CvBuilderModule {}