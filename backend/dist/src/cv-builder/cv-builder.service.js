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
exports.CvBuilderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CvBuilderService = class CvBuilderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByUser(userID) {
        return this.prisma.cVBuilder.findMany({
            where: { userID },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getById(id, userID) {
        return this.prisma.cVBuilder.findFirst({
            where: { id, userID },
        });
    }
    async create(userID, body) {
        return this.prisma.cVBuilder.create({
            data: {
                userID,
                name: body.name || 'Untitled CV',
                templateId: body.templateId || 'default',
                data: body.data || {},
            },
        });
    }
    async update(id, userID, body) {
        const existing = await this.prisma.cVBuilder.findFirst({
            where: { id, userID },
        });
        if (!existing)
            return null;
        return this.prisma.cVBuilder.update({
            where: { id },
            data: {
                name: body.name ?? existing.name,
                templateId: body.templateId ?? existing.templateId,
                data: body.data ?? existing.data,
            },
        });
    }
    async delete(id, userID) {
        const existing = await this.prisma.cVBuilder.findFirst({
            where: { id, userID },
        });
        if (!existing)
            return false;
        await this.prisma.cVBuilder.delete({
            where: { id },
        });
        return true;
    }
};
exports.CvBuilderService = CvBuilderService;
exports.CvBuilderService = CvBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CvBuilderService);
//# sourceMappingURL=cv-builder.service.js.map