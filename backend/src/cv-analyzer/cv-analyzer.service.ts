// import { Injectable, Logger } from '@nestjs/common';
// import { GeminiService } from '../gemini/gemini.service';
// import { FileConverterUtil, FileConverterResult } from './utils/file-converter.util';
// import { CVAnalysisResultDto } from './dto/cv-analysis-result.dto';

// @Injectable()
// export class CvAnalyzerService {
//     private readonly logger = new Logger(CvAnalyzerService.name);

//     constructor(private readonly geminiService: GeminiService) { }

//     async analyzeCV(
//         filePath: string,
//         mimetype: string,
//         enableVerification = true,
//     ): Promise<CVAnalysisResultDto> {
//         try {
//             // 1. Convert file (text nếu PDF, base64 nếu ảnh)
//             const fileData = await FileConverterUtil.convertFile(filePath, mimetype);

//             // 2. Xử lý tùy theo loại file
//             let cvText: string;

//             if (fileData.type === 'text') {
//                 // PDF text-based
//                 cvText = fileData.content;
//                 this.logger.log(`PDF text extracted, length: ${cvText.length}`);
//             } else {
//                 // Ảnh PNG/JPG - dùng Gemini Vision để OCR
//                 this.logger.log('Processing image CV with Gemini Vision...');
//                 cvText = await this.extractTextFromImage(fileData.content);
//                 this.logger.log(`Image OCR completed, text length: ${cvText.length}`);
//             }

//             // Kiểm tra text có rỗng không
//             if (!cvText || cvText.trim().length === 0) {
//                 throw new Error('Could not extract text from CV. Please ensure the file is clear and contains readable text.');
//             }

//             // 3. Gọi Gemini để phân tích
//             let extractedData: any;

//             if (enableVerification) {
//                 // Dùng 2-turn analysis (chính xác hơn)
//                 this.logger.log('Starting CV analysis with verification...');
//                 extractedData = await this.geminiService.analyzeCVWithVerification(cvText);
//             } else {
//                 // Single turn (nhanh hơn)
//                 this.logger.log('Starting CV analysis...');
//                 extractedData = await this.geminiService.analyzeCV(cvText);
//             }

//             // 4. Validate và trả về kết quả
//             return this.validateAndFormatResult(extractedData);

//         } catch (error: any) {
//             this.logger.error('CV Analysis failed:', error);
//             throw new Error(`Failed to analyze CV: ${error.message}`);
//         }
//     }

//     /**
//      * Dùng Gemini Vision để OCR text từ ảnh CV
//      */
//     private async extractTextFromImage(base64Image: string): Promise<string> {
//         try {
//             // Gọi Gemini Vision API để extract text từ ảnh
//             const result = await this.geminiService.extractTextFromImage(base64Image);
//             return result;
//         } catch (error: any) {
//             this.logger.error('OCR failed:', error);
//             throw new Error(`OCR extraction failed: ${error.message}`);
//         }
//     }

//     /**
//      * Validate và format kết quả trả về
//      */
//     private validateAndFormatResult(data: any): CVAnalysisResultDto {
//         // Đảm bảo cấu trúc đúng, nếu thiếu field nào thì gán giá trị mặc định
//         const result: CVAnalysisResultDto = {
//             personalInfo: {
//                 fullName: data.personalInfo?.fullName || '',
//                 email: data.personalInfo?.email || '',
//                 phone: data.personalInfo?.phone || '',
//                 address: data.personalInfo?.address || '',
//                 linkedin: data.personalInfo?.linkedin || '',
//                 portfolio: data.personalInfo?.portfolio || '',
//             },
//             experiences: Array.isArray(data.experiences) ? data.experiences : [],
//             education: Array.isArray(data.education) ? data.education : [],
//             skills: Array.isArray(data.skills) ? data.skills : [],
//             activities: Array.isArray(data.activities) ? data.activities : [],
//             awards: Array.isArray(data.awards) ? data.awards : [],
//             certifications: Array.isArray(data.certifications) ? data.certifications : [],
//             summary: data.summary || '',
//         };

//         return result;
//     }
// }



import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { FileConverterUtil } from './utils/file-converter.util';
import { CVAnalysisResultDto } from './dto/cv-analysis-result.dto';
import * as fs from 'fs/promises';

@Injectable()
export class CvAnalyzerService {
    private readonly logger = new Logger(CvAnalyzerService.name);

    constructor(private readonly geminiService: GeminiService) { }

    /**
     * Xử lý nhiều file (PDF/Images) và gộp lại thành 1 CV analysis
     */
    async analyzeMultipleCVs(
        files: Express.Multer.File[],
        enableVerification = true,
    ): Promise<CVAnalysisResultDto> {
        try {
            this.logger.log(`Processing ${files.length} files...`);

            let combinedText = '';
            const processedFiles: string[] = [];

            // Xử lý từng file và gộp text
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.logger.log(`Processing file ${i + 1}/${files.length}: ${file.originalname}`);

                try {
                    const fileData = await FileConverterUtil.convertFile(file.path, file.mimetype);

                    if (fileData.type === 'text') {
                        // PDF text-based
                        combinedText += `\n\n=== PAGE ${i + 1} ===\n${fileData.content}`;
                    } else {
                        // Image (PNG/JPG) - dùng OCR
                        this.logger.log(`Extracting text from image ${i + 1}...`);
                        const imageText = await this.geminiService.extractTextFromImage(fileData.content);
                        combinedText += `\n\n=== PAGE ${i + 1} ===\n${imageText}`;
                    }

                    processedFiles.push(file.originalname);
                } catch (fileError: any) {
                    this.logger.error(`Failed to process ${file.originalname}:`, fileError.message);
                    // Tiếp tục xử lý file khác, không dừng lại
                } finally {
                    // Cleanup file ngay sau khi xử lý
                    await fs.unlink(file.path).catch(() => { });
                }
            }

            // Kiểm tra nếu không có text nào được extract
            if (!combinedText.trim()) {
                throw new Error('Could not extract text from any of the uploaded files.');
            }

            this.logger.log(`Combined text from ${processedFiles.length} files. Total length: ${combinedText.length}`);

            // Phân tích toàn bộ text đã gộp
            let extractedData: any;

            if (enableVerification) {
                extractedData = await this.geminiService.analyzeCVWithVerification(combinedText);
            } else {
                extractedData = await this.geminiService.analyzeCV(combinedText);
            }

            return this.validateAndFormatResult(extractedData);

        } catch (error: any) {
            this.logger.error('CV Analysis failed:', error);
            // Cleanup tất cả files nếu chưa xóa
            for (const file of files) {
                await fs.unlink(file.path).catch(() => { });
            }
            throw new Error(`Failed to analyze CV: ${error.message}`);
        }
    }

    /**
     * Validate và format kết quả trả về
     */
    private validateAndFormatResult(data: any): CVAnalysisResultDto {
        const result: CVAnalysisResultDto = {
            personalInfo: {
                fullName: data.personalInfo?.fullName || '',
                email: data.personalInfo?.email || '',
                phone: data.personalInfo?.phone || '',
                address: data.personalInfo?.address || '',
                linkedin: data.personalInfo?.linkedin || '',
                portfolio: data.personalInfo?.portfolio || '',
            },
            experiences: Array.isArray(data.experiences) ? data.experiences : [],
            education: Array.isArray(data.education) ? data.education : [],
            skills: Array.isArray(data.skills) ? data.skills : [],
            activities: Array.isArray(data.activities) ? data.activities : [],
            awards: Array.isArray(data.awards) ? data.awards : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            summary: data.summary || '',
        };

        return result;
    }
}