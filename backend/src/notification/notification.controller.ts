import {
  Controller, Get, Patch, Delete,
  Param, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private prisma: PrismaService,
  ) {}

  private async resolveUserID(accountID: number) {
    const user = await this.prisma.user.findFirst({ where: { accountID } });
    if (!user) throw new Error('User not found');
    return user.userID;
  }

  @Get()
  async getAll(
    @GetUser() auth: JwtUser,
    @Query('unread') unread?: string,
  ) {
    const userID = await this.resolveUserID(auth.sub);
    return this.notificationService.getByUser(userID, unread === 'true');
  }

  @Get('unread-count')
  async unreadCount(@GetUser() auth: JwtUser) {
    const userID = await this.resolveUserID(auth.sub);
    const count = await this.notificationService.countUnread(userID);
    return { count };
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  async markRead(
    @GetUser() auth: JwtUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userID = await this.resolveUserID(auth.sub);
    await this.notificationService.markAsRead(userID, id);
    return { success: true };
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllRead(@GetUser() auth: JwtUser) {
    const userID = await this.resolveUserID(auth.sub);
    await this.notificationService.markAllAsRead(userID);
    return { success: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOne(
    @GetUser() auth: JwtUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userID = await this.resolveUserID(auth.sub);
    await this.notificationService.deleteOne(userID, id);
    return { success: true };
  }
}
