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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ChatHistoryService = class ChatHistoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findSessionByUser(userID) {
        const sessions = await this.prisma.chatSession.findMany({
            where: { userID },
            orderBy: [{ isPinned: 'desc' },
                { createdAt: "desc" },
            ],
            select: {
                id: true,
                userID: true,
                title: true,
                isPinned: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return sessions;
    }
    async createSession(dto) {
        const session = await this.prisma.chatSession.create({
            data: {
                userID: dto.userID,
                title: dto.title?.trim() || "New Chat",
                isPinned: false,
            },
        });
        return session;
    }
    async findMessagesBySession(sessionID) {
        const session = await this.prisma.chatSession.findUnique({
            where: { id: sessionID },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session ${sessionID} not found`);
        }
        const messages = await this.prisma.chatMessage.findMany({
            where: { sessionID },
            orderBy: { createdAt: "asc" },
        });
        return messages;
    }
    async saveMessage(dto) {
        const session = await this.prisma.chatSession.findUnique({
            where: { id: dto.sessionID },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session ${dto.sessionID} not found`);
        }
        const { sessionID, role, content, type, metadata } = dto;
        const message = await this.prisma.chatMessage.create({
            data: {
                sessionID,
                role,
                content: content || '',
                type: type || 'text',
                metadata: metadata || {},
            },
        });
        if (role === 'user') {
            const messageCount = await this.prisma.chatMessage.count({
                where: { sessionID, role: 'user' },
            });
            if (messageCount === 1) {
                let newTitle = dto.content.trim();
                if (newTitle.length > 50) {
                    newTitle = newTitle.substring(0, 47) + '...';
                }
                await this.prisma.chatSession.update({
                    where: { id: sessionID },
                    data: {
                        title: newTitle,
                        updatedAt: new Date(),
                    },
                });
            }
        }
        return message;
    }
    async deleteSession(sessionID) {
        try {
            await this.prisma.chatSession.delete({
                where: { id: sessionID },
            });
            return { success: true };
        }
        catch (error) {
            throw new common_1.NotFoundException(`Session ${sessionID} not found`);
        }
    }
    async renameSession(sessionID, newTitle, userID) {
        const session = await this.prisma.chatSession.findFirst({
            where: { id: sessionID, userID },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        const updated = await this.prisma.chatSession.update({
            where: { id: sessionID },
            data: {
                title: newTitle,
                updatedAt: new Date(),
            },
        });
        return { success: true, session: updated };
    }
    async pinSession(sessionID, isPinned, userID) {
        const session = await this.prisma.chatSession.findFirst({
            where: { id: sessionID, userID },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        const updated = await this.prisma.chatSession.update({
            where: { id: sessionID },
            data: {
                isPinned,
                updatedAt: new Date(),
            },
        });
        return { success: true, session: updated };
    }
};
exports.ChatHistoryService = ChatHistoryService;
exports.ChatHistoryService = ChatHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatHistoryService);
//# sourceMappingURL=chat-history.service.js.map