import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { JobsService } from './jobs.service';
import { QueryJobsDto } from '../dto/jobs.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../guards/optional-jwt';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

interface RequestWithUser extends Request {
  user?: JwtUser;
}

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  getJobs(@Query() dto: QueryJobsDto, @Req() req: RequestWithUser) {
    return this.jobsService.getJobs(dto, req.user?.sub ?? undefined);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getUserStats(@GetUser() user: JwtUser) {
    return this.jobsService.getUserStats(user.sub);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@GetUser() user: JwtUser) {
    await this.jobsService.computeAndSaveRecommendations(user.sub);
    return this.jobsService.getRecommendations(user.sub);
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  getSavedJobs(@GetUser() user: JwtUser) {
    return this.jobsService.getSavedJobs(user.sub);
  }

  @Get('filter-options')
  getFilterOptions() {
    return this.jobsService.getFilterOptions();
  }

  @Get('trending-keywords')
  getTrendingKeywords() {
    return this.jobsService.getTrendingKeywords();
  }

  @Get('top-companies')
  getTopCompanies() {
    return this.jobsService.getTopHiringCompanies();
  }

  @Get(':id')
  getJobById(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.getJobById(id);
  }

  @Post(':id/track')
  @UseGuards(JwtAuthGuard)
  trackBehavior(
    @Param('id', ParseIntPipe) jobID: number,
    @Body('action') action: string,
    @GetUser() user: JwtUser,
  ) {

    const allowedActions = ['view', 'save', 'apply', 'click'];
    const validAction = allowedActions.includes(action) ? action : 'view';
    return this.jobsService.logUserBehavior(user.sub, jobID, validAction);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':jobID/save')
  saveJob(
    @Param('jobID', ParseIntPipe) jobID: number,
    @GetUser() user: JwtUser,
  ) {
    return this.jobsService.saveJob(user.sub, jobID);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':jobID/save')
  unsaveJob(
    @Param('jobID', ParseIntPipe) jobID: number,
    @GetUser() user: JwtUser,
  ) {
    return this.jobsService.unsaveJob(user.sub, jobID);
  }
}
