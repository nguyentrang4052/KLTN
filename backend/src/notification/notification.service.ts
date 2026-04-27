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
  ) {}

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
      where: { userID, ...(onlyUnread ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async countUnread(userID: number) {
    return this.prisma.notification.count({
      where: { userID, isRead: false },
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
      where: { userID, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async deleteOne(userID: number, id: number) {
    return this.prisma.notification.deleteMany({
      where: { id, userID },
    });
  }

  async createIfNotExists(dto: CreateNotificationDto & { dedupeKey: string }) {
    const { dedupeKey, ...rest } = dto;
    const existing = await this.prisma.notification.findFirst({
      where: {
        userID: rest.userID,
        type: rest.type,
        metadata: { path: ['dedupeKey'], equals: dedupeKey },
      },
      });

    if (existing) return null;

    return this.create({
      ...rest,
      metadata: { ...rest.metadata, dedupeKey },
    });
  }
}
