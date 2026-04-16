import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import { UpdateEmailPreferenceDto } from './../dto/send-notification-by-email/update-email-preference.dto'
@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private notificationsService: NotificationsService) { }

  // Lấy tất cả notifications của user
  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotifications(@Request() req) {
    const userId = req.user?.userId || req.user?.sub;
    return this.notificationsService.getUserNotifications(Number(userId));
  }

  // Đánh dấu đã đọc
  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = req.user?.sub;
    return this.notificationsService.markAsRead(id, Number(userId));  // Thêm userId
  }

  // Email preference
  @Get('email-preference')
  @UseGuards(JwtAuthGuard)
  async getEmailPreference(@Request() req) {
    const userId = req.user?.userId || req.user?.sub;
    return this.notificationsService.getEmailPreference(Number(userId));
  }

  @Put('email-preference')
  @UseGuards(JwtAuthGuard)
  async updateEmailPreference(@Request() req, @Body() dto: UpdateEmailPreferenceDto) {
    const userId = req.user?.userId || req.user?.sub;
    return this.notificationsService.updateEmailPreference(Number(userId), dto.emailNotificationsEnabled);
  }
}