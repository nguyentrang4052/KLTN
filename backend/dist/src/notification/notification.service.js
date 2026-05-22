"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notification_gateway_1 = require("../websocket-gateway/notification.gateway");
let NotificationService = class NotificationService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async create(dto) {
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
    async getByUser(userID, onlyUnread = false) {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        return this.prisma.notification.findMany({
            where: {
                userID,
                deletedAt: null,
                createdAt: { gte: twoMonthsAgo },
                ...(onlyUnread ? { isRead: false } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    async countUnread(userID) {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        return this.prisma.notification.count({
            where: {
                userID,
                isRead: false,
                deletedAt: null,
                createdAt: { gte: twoMonthsAgo },
            },
        });
    }
    async markAsRead(userID, id) {
        return this.prisma.notification.updateMany({
            where: { id, userID },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async markAllAsRead(userID) {
        return this.prisma.notification.updateMany({
            where: { userID, isRead: false, deletedAt: null },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async deleteOne(userID, id) {
        return this.prisma.notification.updateMany({
            where: { id, userID },
            data: { deletedAt: new Date() },
        });
    }
    async createIfNotExists(dto) {
        const { dedupeKey, ...rest } = dto;
        const existing = await this.prisma.notification.findUnique({
            where: { dedupeKey },
        });
        if (existing && existing.deletedAt === null)
            return null;
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
    async getEmailPref(accountID) {
        const acc = await this.prisma.account.findUnique({
            where: { accountID },
            select: { emailNotification: true },
        });
        return { emailNotification: acc?.emailNotification ?? true };
    }
    async updateEmailPref(accountID, emailNotification) {
        return this.prisma.account.update({
            where: { accountID },
            data: { emailNotification },
            select: { emailNotification: true },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_gateway_1.NotificationGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_gateway_1.NotificationGateway])
], NotificationService);
//# sourceMappingURL=notification.service.js.map