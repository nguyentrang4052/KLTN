import { Controller, Get, Query } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { QueryIndustriesDto } from '../dto/industries.dto';

@Controller('industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Get()
  getIndustries(@Query() dto: QueryIndustriesDto) {
    return this.industriesService.getIndustries(dto);
  }

  @Get('with-count')
  getIndustriesWithCount() {
    return this.industriesService.getIndustriesWithCount();
  }
}
