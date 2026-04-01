import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, UpdateUserProfileDto } from '../dto/profile.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@GetUser() user: JwtUser) {
    return this.profileService.getProfileByAccountID(user.sub);
  }

  @Get('skills/all')
  getAllSkills() {
    return this.profileService.getAllSkills();
  }

  @Get(':userID')
  getProfile(@Param('userID', ParseIntPipe) userID: number) {
    return this.profileService.getProfile(userID);
  }

  @Put(':userID')
  updateProfile(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userID, dto);
  }

  @Post(':userID/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param('userID') userID: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateAvatar(Number(userID), file);
  }

  @Delete(':userID/avatar')
  @UseGuards(JwtAuthGuard)
  removeAvatar(@Param('userID', ParseIntPipe) userID: number) {
    return this.profileService.removeAvatar(userID);
  }

  @Put(':userID/user-profile')
  updateUserProfile(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.profileService.updateUserProfile(userID, dto);
  }

  @Get(':userID/skills')
  getSkills(@Param('userID', ParseIntPipe) userID: number) {
    return this.profileService.getSkills(userID);
  }

  @Post(':userID/skills/:skillID')
  addSkill(
    @Param('userID', ParseIntPipe) userID: number,
    @Param('skillID', ParseIntPipe) skillID: number,
  ) {
    return this.profileService.addSkill(userID, skillID);
  }

  @Delete(':userID/skills/:skillID')
  removeSkill(
    @Param('userID', ParseIntPipe) userID: number,
    @Param('skillID', ParseIntPipe) skillID: number,
  ) {
    return this.profileService.removeSkill(userID, skillID);
  }

  @Get(':userID/stats')
  getStats(@Param('userID', ParseIntPipe) userID: number) {
    return this.profileService.getStats(userID);
  }
}
