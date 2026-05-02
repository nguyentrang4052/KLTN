import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    ParseIntPipe,
    NotFoundException,
} from '@nestjs/common';
import { CvBuilderService } from './cv-builder.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('cv-builder')
@UseGuards(JwtAuthGuard)
export class CvBuilderController {
    constructor(private readonly cvBuilderService: CvBuilderService) { }

    // 🔹 Lấy danh sách CV của user
    @Get('list')
    async getMyCVs(@Req() req: any) {
        return this.cvBuilderService.getByUser(req.user.sub);
    }

    // 🔹 Lấy chi tiết 1 CV
    @Get('detail/:id')
    async getDetail(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const cv = await this.cvBuilderService.getById(id, req.user.sub);
        if (!cv) throw new NotFoundException('CV not found');
        return cv;
    }

    // 🔹 Tạo CV mới
    @Post('create')
    async create(@Req() req: any, @Body() body: any) {
        return this.cvBuilderService.create(req.user.sub, body);
    }

    // 🔹 Update CV
    @Put('update/:id')
    async update(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
    ) {
        const updated = await this.cvBuilderService.update(
            id,
            req.user.sub,
            body,
        );
        if (!updated) throw new NotFoundException('CV not found or not yours');
        return updated;
    }

    // 🔹 Xoá CV
    @Delete('delete/:id')
    async delete(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const deleted = await this.cvBuilderService.delete(id, req.user.sub);
        if (!deleted) throw new NotFoundException('CV not found or not yours');
        return { success: true };
    }
}