import {
  Controller,
  Post,
  Get,
  Request,
  Param,
  UploadedFiles,
  UseInterceptors,
  Query,
  BadRequestException,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; // Thay đổi từ FileInterceptor
import { CvAnalyzerService } from './cv-analyzer.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MapFromLocalCvDto } from './dto/map-from-local-cv.dto';

@Controller('cv-analyzer')
export class CvAnalyzerController {
  constructor(private readonly cvAnalyzerService: CvAnalyzerService) { }

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, { // 'files' là field name, 10 là max file count
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF, PNG, JPG files are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
    }),
  )

  async analyzeCV(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('verify') verify?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const result = await this.cvAnalyzerService.analyzeMultipleCVs(
      files,
      req.user.sub,
      verify !== 'false',
    );

    return {
      success: true,
      ...result,
    };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Request() req) {
    const histories = await this.cvAnalyzerService.getUserCVHistory(req.user.sub);
    return {
      success: true,
      count: histories.length,
      data: histories.map(h => ({
        id: h.id,
        filename: h.filename,
        fullName: (h.result as any)?.personalInfo?.fullName || '',
        createdAt: h.createdAt,
      })),
    };
  }


  // ─── Map CV đã phân tích → profile (CẢI THIỆN: trả đủ field) ───────────
  @Post('map-to-profile/:cvBuilderId')
  @UseGuards(JwtAuthGuard)
  async mapToProfile(
    @Request() req,
    @Param('cvBuilderId') cvBuilderId: number,
  ) {
    const mapped = await this.cvAnalyzerService.mapCVToProfile(
      cvBuilderId,
      req.user.sub,
    );
    return {
      success: true,
      message: 'Profile updated from CV Builder',
      data: mapped,
    };
  }


  @Post('map-from-local')
  @UseGuards(JwtAuthGuard)
  async mapFromLocalCV(
    @Request() req,
    @Body() body: MapFromLocalCvDto,
  ) {
    const profile = await this.cvAnalyzerService.mapLocalCVToProfile(
      body,
      req.user.sub,
    );
    return {
      success: true,
      message: 'Profile updated from local CV data',
      data: {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        jobTitle: profile.jobTitle,
        experienceYear: profile.experienceYear,
        careerLevel: profile.careerLevel,
      },
    };
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  async getCVDetail(
    @Request() req,
    @Param('id') id: string,
  ) {
    const cv = await this.cvAnalyzerService.getCVById(parseInt(id), req.user.sub);
    if (!cv) {
      throw new BadRequestException('CV not found');
    }
    return {
      success: true,
      data: cv,
    };
  }
}