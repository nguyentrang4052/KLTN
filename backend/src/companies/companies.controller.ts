import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { QueryCompaniesDto } from '../dto/companies.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getCompanies(@Query() dto: QueryCompaniesDto) {
    return this.companiesService.getCompanies(dto);
  }

  @Get('top')
  getTopCompanies() {
    return this.companiesService.getTopCompanies();
  }

  @Get('locations')
  getLocations() {
    return this.companiesService.getLocations();
  }

  @Get('sizes')
  getSizes() {
    return this.companiesService.getSizes();
  }

  @Get(':id')
  getCompanyById(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.getCompanyById(id);
  }
}
