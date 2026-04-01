import { Body, Controller, Post, Delete, Get, Query } from '@nestjs/common';
import { JobAlertService } from './job-alert.service';
import { CreateAlertDto, RemoveAlertDto } from '../dto/alert-job.dto';

@Controller('job-alerts')
export class JobAlertController {
  constructor(private readonly jobAlertService: JobAlertService) {}

  @Post()
  async createAlert(@Body() dto: CreateAlertDto) {
    return this.jobAlertService.createAlert(dto);
  }

  @Delete()
  async removeAlert(@Body() dto: RemoveAlertDto) {
    return this.jobAlertService.unsubscribe(dto);
  }

  @Get()
  getAlerts(@Query('email') email: string) {
    return this.jobAlertService.getAlertsByEmail(email);
  }
}
