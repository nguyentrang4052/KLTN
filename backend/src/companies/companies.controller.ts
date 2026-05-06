import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CompaniesService } from './companies.service';
import { QueryCompaniesDto } from '../dto/companies.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../guards/optional-jwt';

interface RequestWithUser extends Request {
  user?: JwtUser;
}

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

  @Get('suggestions')
  getSuggestions(@Query('q') q: string) {
    return this.companiesService.getCompanySuggestions(q);
  }

  @Post('search-history')
  @UseGuards(OptionalJwtGuard)
  async saveSearchHistory(
    @Body('keyword') keyword: string,
    @Req() req: RequestWithUser,
  ) {
    if (!keyword?.trim() || !req.user?.sub) return;
    await this.companiesService.saveCompanySearchHistory(
      req.user.sub,
      keyword.trim(),
    );
  }

  @Get('search-history')
  @UseGuards(JwtAuthGuard)
  async getSearchHistory(@GetUser() user: JwtUser) {
    return this.companiesService.getCompanySearchHistory(user.sub);
  }

  @Get(':id')
  getCompanyById(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.getCompanyById(id);
  }
}
