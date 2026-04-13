import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import {
  CreateIndustryDto,
  UpdateIndustryDto,
  CreateSkillDto,
  UpdateSkillDto,
  CreatePackageDto,
  UpdatePackageDto,
} from '../dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── DASHBOARD ───────────────────────────────────────────
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('recent-users')
  getRecentUsers() {
    return this.adminService.getRecentUsers();
  }

  // ─── USERS ───────────────────────────────────────────────
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.toggleStatus(id);
  }

  // ─── INDUSTRIES ──────────────────────────────────────────
  @Get('industries')
  getIndustries() {
    return this.adminService.getIndustries();
  }

  @Post('industries')
  createIndustry(@Body() dto: CreateIndustryDto) {
    return this.adminService.createIndustry(dto);
  }

  @Put('industries/:id')
  updateIndustry(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIndustryDto,
  ) {
    return this.adminService.updateIndustry(id, dto);
  }

  @Delete('industries/:id')
  deleteIndustry(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteIndustry(id);
  }

  // ─── SKILLS ──────────────────────────────────────────────
  @Get('skills')
  getAllSkills() {
    return this.adminService.getAllSkills();
  }

  @Post('skills')
  createSkill(@Body() dto: CreateSkillDto) {
    return this.adminService.createSkill(dto);
  }

  @Put('skills/:id')
  updateSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.adminService.updateSkill(id, dto);
  }

  @Delete('skills/:id')
  deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteSkill(id);
  }

  // ─── PACKAGES ────────────────────────────────────────────
  @Get('packages')
  getPackages() {
    return this.adminService.getPackages();
  }

  @Post('packages')
  createPackage(@Body() dto: CreatePackageDto) {
    return this.adminService.createPackage(dto);
  }

  @Get('platforms')
  getPlatforms() {
    return this.adminService.getPlatforms();
  }

  @Get('industries/by-platform')
  getIndustriesByPlatform(@Query('platform') platform?: string) {
    return this.adminService.getIndustriesByPlatform(platform);
  }

  @Get('refunds')
  getRefunds(@Query('status') status?: string) {
    return this.adminService.getRefundRequests(status);
  }

  @Put('packages/:id')
  updatePackage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePackageDto,
  ) {
    return this.adminService.updatePackage(id, dto);
  }

  @Delete('packages/:id')
  deletePackage(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deletePackage(id);
  }

  @Patch('refunds/:id/resolve')
  resolveRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { action: 'approved' | 'rejected'; note?: string },
  ) {
    return this.adminService.resolveRefund(id, body.action, body.note);
  }
}
