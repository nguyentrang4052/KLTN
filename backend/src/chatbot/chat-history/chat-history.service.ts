import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { SaveMessageDto } from "src/chatbot/chat-history/dto/save-message.dto";

@Injectable()
export class ChatHistoryService {
    constructor(private prisma: PrismaService) { }

    async findSessionByUser(userID: number) {
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

    async createSession(dto: CreateSessionDto & { userID: number }) {
        const session = await this.prisma.chatSession.create({
            data: {
                userID: dto.userID,
                title: dto.title?.trim() || "New Chat",
                isPinned: false,
            },
        });
        return session;
    }

    async findMessagesBySession(sessionID: number) {
        const session = await this.prisma.chatSession.findUnique({
            where: { id: sessionID },
        });
        if (!session) {
            throw new NotFoundException(`Session ${sessionID} not found`);
        }

        const messages = await this.prisma.chatMessage.findMany({
            where: { sessionID },
            orderBy: { createdAt: "asc" },
        });
        return messages;

    }

    async saveMessage(dto: SaveMessageDto) {
        const session = await this.prisma.chatSession.findUnique({
            where: { id: dto.sessionID },
        });
        if (!session) {
            throw new NotFoundException(`Session ${dto.sessionID} not found`);
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
                // Lấy nội dung message để làm title
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

    async deleteSession(sessionID: number) {
        try {
            await this.prisma.chatSession.delete({
                where: { id: sessionID },
            });
            return { success: true };
        } catch (error) {
            throw new NotFoundException(`Session ${sessionID} not found`);
        }
    }

    async renameSession(sessionID: number, newTitle: string, userID: number) {
        // Check if session exists and belongs to user
        const session = await this.prisma.chatSession.findFirst({
            where: { id: sessionID, userID },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
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

    async pinSession(sessionID: number, isPinned: boolean, userID: number) {
        // Check if session exists and belongs to user
        const session = await this.prisma.chatSession.findFirst({
            where: { id: sessionID, userID },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
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
}
