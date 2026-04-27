import { Body, Controller, Post, Delete, Get, UseGuards } from '@nestjs/common';
import { JobAlertService } from './job-alert.service';
import { CreateAlertDto, RemoveAlertDto } from '../dto/alert-job.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';

@Controller('job-alerts')
export class JobAlertController {
  constructor(private readonly jobAlertService: JobAlertService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createAlert(@GetUser() user: JwtUser, @Body() dto: CreateAlertDto) {
    return this.jobAlertService.createAlert(user.sub, dto.keyword);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  removeAlert(@GetUser() user: JwtUser, @Body() dto: RemoveAlertDto) {
    return this.jobAlertService.unsubscribe(user.sub, dto.keyword);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAlerts(@GetUser() user: JwtUser) {
    return this.jobAlertService.getAlertsByAccount(user.sub);
  }
}
