import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  ConfirmPaymentDto,
  CreateSubscriptionDto,
  RefundDto,
} from '../dto/subscription.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionService.getAllPlans();
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  seed() {
    return this.subscriptionService.seedPlans();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  getCurrent(@GetUser() user: JwtUser) {
    return this.subscriptionService.getCurrentSubscription(user.sub);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(@GetUser() user: JwtUser) {
    return this.subscriptionService.getPaymentHistory(user.sub);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  subscribe(@GetUser() user: JwtUser, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.subscribe(user.sub, dto);
  }

  @Post('confirm-payment')
  @HttpCode(HttpStatus.OK)
  confirmPayment(@Body() dto: ConfirmPaymentDto) {
    return this.subscriptionService.confirmPayment(dto);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  requestRefund(@GetUser() user: JwtUser, @Body() dto: RefundDto) {
    return this.subscriptionService.requestRefund(user.sub, dto);
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  cancel(@GetUser() user: JwtUser) {
    return this.subscriptionService.cancelSubscription(user.sub);
  }

  @Get('quota')
  @UseGuards(JwtAuthGuard)
  getQuota(@GetUser() user: JwtUser) {
    return this.subscriptionService.getUserQuota(user.sub);
  }

  @Post('quota/consume/:feature')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  consumeQuota(
    @GetUser() user: JwtUser,
    @Param('feature') feature: 'cvAnalysis' | 'cvMatchCheck',
  ) {
    return this.subscriptionService.checkAndConsumeQuota(user.sub, feature);
  }
}
