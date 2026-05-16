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
import { AIRecommendationService } from './ai-job-recommendation.service';
import { QueryJobsDto } from '../dto/jobs.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../guards/optional-jwt';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { JobsGateway } from 'src/websocket-gateway/jobs.gateway';
import { SubscriptionService } from '../subscription/subscription.service';

interface RequestWithUser extends Request {
  user?: JwtUser;
}

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly aiRecommendation: AIRecommendationService,
    private readonly jobsGateway: JobsGateway,
    private readonly subscriptionService: SubscriptionService,
  ) { }

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
    return this.jobsService.getRecommendations(user.sub, false);
  }

  @Post('recommendations/refresh')
  @UseGuards(JwtAuthGuard)
  async refreshRecommendations(@GetUser() user: JwtUser) {
    const hasChanged =
      await this.aiRecommendation.computeAndSaveRecommendations(user.sub);

    const result = await this.jobsService.getRecommendations(
      user.sub,
      hasChanged,
    );

    return {
      ...result,
      hasChanged,
      message: hasChanged
        ? 'Đã cập nhật đề xuất mới!'
        : 'Không có đề xuất mới. Hãy cập nhật thêm kỹ năng hoặc xem thêm việc làm để AI học được sở thích của bạn.',
    };
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  getSavedJobs(@Query() dto: QueryJobsDto, @GetUser() user: JwtUser) {
    return this.jobsService.getSavedJobs(dto, user.sub);
  }

  @Get('filter-by-source')
  getFilterBySource(@Query('source') source?: string) {
    return this.jobsService.getFilterOptionsBySource(source);
  }

  @Get('filter-options')
  getFilterOptions() {
    return this.jobsService.getFilterOptions();
  }

  @Get('trending-keywords')
  getTrendingKeywords() {
    return this.jobsService.getTrendingKeywords();
  }

  @Post('search-history')
  @UseGuards(OptionalJwtGuard)
  async saveSearchHistory(
    @Body('keyword') keyword: string,
    @Req() req: RequestWithUser,
  ) {
    if (!keyword?.trim() || !req.user?.sub) return;
    await this.jobsService.saveSearchHistory(req.user.sub, keyword.trim());
  }

  @Get('search-history')
  @UseGuards(JwtAuthGuard)
  async getSearchHistory(@GetUser() user: JwtUser) {
    return this.jobsService.getSearchHistory(user.sub);
  }

  @Get('search-suggestions')
  async getSearchSuggestions(@Query('q') q: string) {
    return this.jobsService.getSearchSuggestions(q);
  }

  @Post('internal/broadcast-new-jobs')
  broadcastNewJobs(
    @Body('count') count: number,
    @Body('secret') secret: string,
  ) {
    if (secret !== process.env.INTERNAL_SECRET) return;
    this.jobsGateway.broadcastNewJobs(count);
    return { ok: true };
  }

  @Get('industry-trends')
  getIndustryTrends() {
    return this.jobsService.getIndustryTrends();
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

  @Get(':id/match')
  @UseGuards(JwtAuthGuard)
  getJobMatch(
    @Param('id', ParseIntPipe) jobID: number,
    @GetUser() user: JwtUser,
  ) {
    return this.jobsService.getJobMatchPreview(user.sub, jobID);
  }

  @Post(':id/match/check')
  @UseGuards(JwtAuthGuard)
  async checkJobMatchDetail(
    @Param('id', ParseIntPipe) jobID: number,
    @GetUser() user: JwtUser,
  ) {
    await this.subscriptionService.checkAndConsumeQuota(
      user.sub,
      'cvMatchCheck',
    );
    return this.jobsService.getJobMatchDetail(user.sub, jobID);
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
