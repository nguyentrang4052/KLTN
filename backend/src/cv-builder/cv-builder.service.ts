import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CvBuilderService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Lấy tất cả CV của user
  async getByUser(userID: number) {
    return this.prisma.cVBuilder.findMany({
      where: { userID },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // 🔹 Lấy 1 CV theo id + user
  async getById(id: number, userID: number) {
    return this.prisma.cVBuilder.findFirst({
      where: { id, userID },
    });
  }

  // 🔹 Tạo CV
  async create(userID: number, body: any) {
    return this.prisma.cVBuilder.create({
      data: {
        userID,
        name: body.name || 'Untitled CV',
        templateId: body.templateId || 'default',
        data: body.data || {},
      },
    });
  }

  // 🔹 Update CV (chỉ update nếu đúng user)
  async update(id: number, userID: number, body: any) {
    const existing = await this.prisma.cVBuilder.findFirst({
      where: { id, userID },
    });

    if (!existing) return null;

    return this.prisma.cVBuilder.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        templateId: body.templateId ?? existing.templateId,
        data: body.data ?? existing.data,
      },
    });
  }

  // 🔹 Xoá CV (chỉ xoá của user)
  async delete(id: number, userID: number) {
    const existing = await this.prisma.cVBuilder.findFirst({
      where: { id, userID },
    });

    if (!existing) return false;

    await this.prisma.cVBuilder.delete({
      where: { id },
    });

    return true;
  }
}