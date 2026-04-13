// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   Query,
//   BadRequestException,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CvAnalyzerService } from './cv-analyzer.service';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { CVAnalysisResultDto } from './dto/cv-analysis-result.dto';

// @Controller('cv-analyzer')
// export class CvAnalyzerController {
//   constructor(private readonly cvAnalyzerService: CvAnalyzerService) {}

//   @Post('analyze')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
//         if (allowedMimes.includes(file.mimetype)) {
//           cb(null, true);
//         } else {
//           cb(new BadRequestException('Only PDF, PNG, JPG files are allowed'), false);
//         }
//       },
//       limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB limit
//       },
//     }),
//   )
//   async analyzeCV(
//     @UploadedFile() file: Express.Multer.File,
//     @Query('verify') verify?: string, // ?verify=true để bật 2-turn reasoning
//   ): Promise<CVAnalysisResultDto> {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }

//     try {
//       const result = await this.cvAnalyzerService.analyzeCV(
//         file.path,
//         file.mimetype,
//         verify === 'true',
//       );
      
//       return result;
//     } finally {
//       // Cleanup uploaded file sau khi xử lý
//       const fs = await import('fs/promises');
//       await fs.unlink(file.path).catch(() => {});
//     }
//   }
// }



import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; // Thay đổi từ FileInterceptor
import { CvAnalyzerService } from './cv-analyzer.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('cv-analyzer')
export class CvAnalyzerController {
  constructor(private readonly cvAnalyzerService: CvAnalyzerService) {}

  @Post('analyze')
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
    @UploadedFiles() files: Express.Multer.File[], // Thay đổi từ UploadedFile sang UploadedFiles (mảng)
    @Query('verify') verify?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      // Gọi service với mảng files
      const result = await this.cvAnalyzerService.analyzeMultipleCVs(
        files,
        verify === 'true',
      );
      
      return {
        success: true,
        fileCount: files.length,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}