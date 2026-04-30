import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { CreateNotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private gateway: NotificationGateway,
  ) { }

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userID: dto.userID,
        type: dto.type,
        title: dto.title,
        body: dto.body,
        metadata: dto.metadata ?? {},
      },
    });

    this.gateway.sendToUser(dto.userID, 'notification', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      isRead: false,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
    });

    return notification;
  }

  async getByUser(userID: number, onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: {
        userID,
        deletedAt: null,
        ...(onlyUnread ? { isRead: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async countUnread(userID: number) {
    return this.prisma.notification.count({
      where: { userID, isRead: false, deletedAt: null },
    });
  }

  async markAsRead(userID: number, id: number) {
    return this.prisma.notification.updateMany({
      where: { id, userID },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userID: number) {
    return this.prisma.notification.updateMany({
      where: { userID, isRead: false, deletedAt: null },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async deleteOne(userID: number, id: number) {
    return this.prisma.notification.updateMany({
      where: { id, userID },
      data: { deletedAt: new Date() },
    });
  }

  async createIfNotExists(dto: CreateNotificationDto & { dedupeKey: string }) {
    const { dedupeKey, ...rest } = dto;

    const existing = await this.prisma.notification.findUnique({
      where: { dedupeKey },
    });

    if (existing && existing.deletedAt === null) return null;

    if (existing && existing.deletedAt !== null) {
      await this.prisma.notification.delete({ where: { id: existing.id } });
    }

    const notification = await this.prisma.notification.create({
      data: {
        userID: rest.userID,
        type: rest.type,
        title: rest.title,
        body: rest.body,
        metadata: rest.metadata ?? {},
        dedupeKey,
      },
    });

    this.gateway.sendToUser(rest.userID, 'notification', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      isRead: false,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
    });

    return notification;
  }

  async getEmailPref(accountID: number) {
    const acc = await this.prisma.account.findUnique({
      where: { accountID },
      select: { emailNotification: true },
    });
    return { emailNotification: acc?.emailNotification ?? true };
  }

  async updateEmailPref(accountID: number, emailNotification: boolean) {
    return this.prisma.account.update({
      where: { accountID },
      data: { emailNotification },
      select: { emailNotification: true },
    });
  }
}
