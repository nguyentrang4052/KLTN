import { Module } from '@nestjs/common';
import { IndustriesController } from './industies.controller';
import { IndustriesService } from './industries.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IndustriesController],
  providers: [IndustriesService],
})
export class IndustriesModule {}
