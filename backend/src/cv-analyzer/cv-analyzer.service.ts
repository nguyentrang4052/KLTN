import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { PdfToImageService } from './pdf-to-image.service';
import { CVAnalysisRepository } from './cv-analysis.repository';
import { RedisService } from '../redis/redis.service';
import { FileConverterUtil } from './utils/file-converter.util';
import { CVAnalysisResultDto } from './dto/cv-analysis-result.dto';
import * as fs from 'fs/promises';
import { createHash } from 'crypto';

@Injectable()
export class CvAnalyzerService {
    private readonly logger = new Logger(CvAnalyzerService.name);
    private readonly CACHE_TTL = 7 * 24 * 60 * 60; // 7 ngày
    prisma: any;

    constructor(
        private readonly geminiService: GeminiService,
        private readonly pdfToImageService: PdfToImageService,
        private readonly cvAnalysisRepository: CVAnalysisRepository,
        private readonly redisService: RedisService,
    ) { }

    async analyzeMultipleCVs(
        files: Express.Multer.File[],
        userID: number,
        enableVerification = true,
    ): Promise<any> {
        try {
            this.logger.log(`Processing ${files.length} files...`);
            const results: any[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.logger.log(`File ${i + 1}/${files.length}: ${file.originalname}`);

                try {
                    const fileBuffer = await fs.readFile(file.path);
                    const fileHash = createHash('sha256').update(fileBuffer).digest('hex');

                    // === BƯỚC 1: KIỂM TRA REDIS CACHE ===
                    const redisKey = `cv:analysis:${fileHash}`;
                    const cachedRedis = await this.redisService.get(redisKey);

                    if (cachedRedis) {
                        this.logger.log(`✓ Redis HIT: ${file.originalname}`);
                        const parsed = JSON.parse(cachedRedis);
                        results.push({
                            filename: file.originalname,
                            fromCache: true,
                            cacheType: 'redis',
                            hash: fileHash.substring(0, 8),
                            data: parsed,
                        });
                        // Lưu DB nếu chưa có
                        const existingDb = await this.cvAnalysisRepository.findByFileHash(fileHash);
                        if (!existingDb) {
                            await this.cvAnalysisRepository.create(userID, fileHash, file.originalname, parsed);
                        }
                        await fs.unlink(file.path).catch(() => { });
                        continue;
                    }

                    // === BƯỚC 2: KIỂM TRA DATABASE CACHE ===
                    const cachedDb = await this.cvAnalysisRepository.findByFileHash(fileHash);
                    if (cachedDb) {
                        this.logger.log(`✓ Database HIT: ${file.originalname}`);
                        const dto = cachedDb.result as CVAnalysisResultDto;
                        // Lưu Redis để lần sau nhanh hơn
                        await this.redisService.set(redisKey, JSON.stringify(dto), this.CACHE_TTL);
                        results.push({
                            filename: file.originalname,
                            fromCache: true,
                            cacheType: 'database',
                            hash: fileHash.substring(0, 8),
                            data: dto,
                        });
                        await fs.unlink(file.path).catch(() => { });
                        continue;
                    }

                    // === BƯỚC 3: PHÂN TÍCH MỚI (GỌI GEMINI) ===
                    this.logger.log(`✗ Cache MISS: ${file.originalname} → Calling Gemini API...`);
                    const analyzed = await this.analyzeSingleFile(file, fileBuffer, enableVerification);

                    // Lưu Redis
                    await this.redisService.set(redisKey, JSON.stringify(analyzed), this.CACHE_TTL);
                    this.logger.log(`  → Saved to Redis cache`);

                    // Lưu Database
                    const saved = await this.cvAnalysisRepository.create(userID, fileHash, file.originalname, analyzed);
                    this.logger.log(`  → Saved to Database (id: ${saved.id})`);

                    results.push({
                        filename: file.originalname,
                        fromCache: false,
                        hash: fileHash.substring(0, 8),
                        data: analyzed,
                        savedId: saved.id,
                    });

                } catch (error: any) {
                    this.logger.error(`Failed ${file.originalname}:`, error.message);
                    results.push({
                        filename: file.originalname,
                        error: error.message,
                    });
                } finally {
                    await fs.unlink(file.path).catch(() => { });
                }
            }

            if (results.every(r => r.error)) {
                throw new Error('Could not extract text from any file.');
            }

            return {
                success: true,
                fileCount: results.length,
                files: results,
            };

        } catch (error: any) {
            for (const f of files) {
                await fs.unlink(f.path).catch(() => { });
            }
            throw new Error(`CV Analysis failed: ${error.message}`);
        }
    }

    async mapCVToProfile(cvAnalysisId: number, userId: number) {
        this.logger.log(`User ${userId} mapping CV ${cvAnalysisId} to profile`);
        return this.cvAnalysisRepository.mapToUserProfile(cvAnalysisId, userId);
    }

    async getUserCVHistory(userId: number) {
        return this.cvAnalysisRepository.findByUser(userId);
    }

    // === PRIVATE METHODS (giữ nguyên từ code cũ) ===

    private async analyzeSingleFile(
        file: Express.Multer.File,
        fileBuffer: Buffer,
        enableVerification: boolean
    ): Promise<CVAnalysisResultDto> {
        let combinedText = '';

        if (file.mimetype === 'application/pdf') {
            const fileData = await FileConverterUtil.convertFile(file.path, file.mimetype);

            if (fileData.type === 'text' && fileData.content && fileData.content.length > 100) {
                if (!this.isVietnameseTextGarbled(fileData.content)) {
                    this.logger.log(`Using native PDF text: ${fileData.content.length} chars`);
                    combinedText = fileData.content;
                } else {
                    this.logger.warn(`Text garbled, converting PDF to images for Vision OCR...`);
                    const images = await this.pdfToImageService.convert(fileBuffer);
                    for (let j = 0; j < images.length; j++) {
                        this.logger.log(`OCR page ${j + 1}/${images.length}...`);
                        const pageText = await this.geminiService.extractTextFromImage(images[j]);
                        combinedText += `\n\n=== PAGE ${j + 1} [Vision OCR] ===\n${pageText}`;
                    }
                }
            } else {
                this.logger.warn(`No text extracted, converting PDF to images...`);
                const images = await this.pdfToImageService.convert(fileBuffer);
                for (let j = 0; j < images.length; j++) {
                    const pageText = await this.geminiService.extractTextFromImage(images[j]);
                    combinedText += `\n\n=== PAGE ${j + 1} [Vision OCR] ===\n${pageText}`;
                }
            }

        } else {
            this.logger.log(`Processing image...`);
            const imageText = await this.geminiService.extractTextFromImage(fileBuffer);
            combinedText = `\n\n=== IMAGE ===\n${imageText}`;
        }

        if (!combinedText.trim()) {
            throw new Error('No text extracted from file.');
        }

        this.logger.log(`Combined text: ${combinedText.length} chars`);

        const extractedData = enableVerification
            ? await this.geminiService.analyzeCVWithVerification(combinedText)
            : await this.geminiService.analyzeCV(combinedText);

        return this.validateAndFormatResult(extractedData);
    }

    private isVietnameseTextGarbled(text: string): boolean {
        if (!text || text.length < 50) return false;

        const whitespaceRatio = (text.match(/\s/g) || []).length / text.length;
        const tokens = text.split(/\s+/).filter(t => t.length > 0);
        const shortUpperTokens = tokens.filter(t => t.length <= 2 && /^[A-ZĐ]$/.test(t)).length;
        const shortUpperRatio = tokens.length > 0 ? shortUpperTokens / tokens.length : 0;
        const gCount = (text.match(/\bG\b/g) || []).length;
        const gRatio = tokens.length > 0 ? gCount / tokens.length : 0;

        const isGarbled = whitespaceRatio > 0.35 || shortUpperRatio > 0.30 || gRatio > 0.10;

        if (isGarbled) {
            this.logger.warn(`Garbled: whitespace=${(whitespaceRatio * 100).toFixed(0)}%, shortUpper=${(shortUpperRatio * 100).toFixed(0)}%, gRatio=${(gRatio * 100).toFixed(0)}%`);
        }

        return isGarbled;
    }

    private validateAndFormatResult(data: any): CVAnalysisResultDto {
        return {
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
    }

    // ═══════════════════════════════════════════════════════
    // cv-analyzer.service.ts  –  PHẦN THÊM VÀO
    // Thêm method mapLocalCVToProfile vào class CvAnalyzerService
    // (giữ nguyên toàn bộ code cũ, chỉ append method này)
    // ═══════════════════════════════════════════════════════

    /**
     * Map CV tự tạo (từ localStorage/EditorScreen) → UserProfile.
     *
     * Chiến lược:
     * 1. Ghép toàn bộ data CV thành text
     * 2. Gọi Gemini để suy luận jobTitle / experienceYear / careerLevel
     * 3. Cập nhật User + UserProfile trong DB
     */
    async mapLocalCVToProfile(
        cvData: {
            personalInfo?: {
                fullName?: string;
                phone?: string;
                address?: string;
                email?: string;
                linkedin?: string;
                portfolio?: string;
            };
            experiences?: Array<{
                company?: string;
                position?: string;
                duration?: string;
                description?: string;
            }>;
            education?: any[];
            skills?: any[];
            summary?: string;
        },
        userId: number,
    ) {
        this.logger.log(`User ${userId} mapping local CV to profile`);

        const { personalInfo = {}, experiences = [], skills = [], summary = '' } = cvData;

        // ── Bước 1: Suy luận career info từ CV ──────────────────────────────
        let inferredCareer = {
            jobTitle: '',
            experienceYear: '',
            careerLevel: '',
        };

        try {
            // Tạo text tóm tắt để đưa cho Gemini
            const cvText = [
                summary && `Mục tiêu: ${summary}`,
                experiences.length > 0 && `Kinh nghiệm:\n${experiences.map(e =>
                    `- ${e.position || ''} tại ${e.company || ''} (${e.duration || ''}): ${e.description || ''}`
                ).join('\n')}`,
                skills.length > 0 && `Kỹ năng: ${skills.map((s: any) =>
                    typeof s === 'string' ? s : `${s.category || ''}: ${s.items || ''}`
                ).join(', ')}`,
            ].filter(Boolean).join('\n\n');

            if (cvText.trim()) {
                const prompt = `
Dựa vào nội dung CV sau, hãy suy luận và trả về JSON với các trường:
- jobTitle: chức danh công việc phù hợp nhất (ví dụ: "Frontend Developer")
- experienceYear: tổng năm kinh nghiệm (chọn 1 trong: "Chưa có kinh nghiệm", "Dưới 1 năm", "1-2 năm", "2-3 năm", "3-5 năm", "Trên 5 năm")
- careerLevel: cấp bậc (chọn 1 trong: "Intern", "Junior", "Middle", "Senior", "Lead", "Manager")

Chỉ trả về JSON, không giải thích thêm.

CV:
${cvText}
        `.trim();

                const raw = await this.geminiService.analyzeCV(prompt);

                // Parse JSON từ response
                const jsonMatch = JSON.stringify(raw).match(/\{[^{}]*"jobTitle"[^{}]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    inferredCareer = {
                        jobTitle: parsed.jobTitle || '',
                        experienceYear: parsed.experienceYear || '',
                        careerLevel: parsed.careerLevel || '',
                    };
                } else if (raw && typeof raw === 'object') {
                    inferredCareer = {
                        jobTitle: (raw as any).jobTitle || '',
                        experienceYear: (raw as any).experienceYear || '',
                        careerLevel: (raw as any).careerLevel || '',
                    };
                }
            }
        } catch (err: any) {
            // Nếu Gemini lỗi → fallback rule-based
            this.logger.warn(`Gemini inference failed, using rule-based fallback: ${err.message}`);
            inferredCareer = this.inferCareerRuleBased(experiences, skills);
        }

        // ── Bước 2: Cập nhật DB ──────────────────────────────────────────────
        return this.cvAnalysisRepository.mapLocalDataToUserProfile(userId, {
            // Personal info (chỉ điền nếu field đang trống)
            fullName: personalInfo.fullName || undefined,
            phone: personalInfo.phone || undefined,
            address: personalInfo.address || undefined,
            // Career info
            jobTitle: inferredCareer.jobTitle || undefined,
            experienceYear: inferredCareer.experienceYear || undefined,
            careerLevel: inferredCareer.careerLevel || undefined,
        });
    }

    /**
* Fallback rule-based khi Gemini không khả dụng.
* Đếm số lượng kinh nghiệm để suy luận.
*/
    private inferCareerRuleBased(
        experiences: any[],
        skills: any[],
    ): { jobTitle: string; experienceYear: string; careerLevel: string } {
        const count = experiences.length;

        // Suy luận jobTitle từ position đầu tiên
        const jobTitle = experiences[0]?.position || '';

        // Suy luận experienceYear từ số lượng job
        let experienceYear = 'Chưa có kinh nghiệm';
        if (count === 1) experienceYear = '1-2 năm';
        else if (count === 2) experienceYear = '2-3 năm';
        else if (count >= 3 && count <= 4) experienceYear = '3-5 năm';
        else if (count > 4) experienceYear = 'Trên 5 năm';

        // Suy luận careerLevel
        let careerLevel = 'Junior';
        if (count === 0) careerLevel = 'Intern';
        else if (count === 1) careerLevel = 'Junior';
        else if (count === 2) careerLevel = 'Middle';
        else if (count >= 3) careerLevel = 'Senior';

        return { jobTitle, experienceYear, careerLevel };
    }

    async getCVById(cvId: number, userId: number) {
        const cv = await this.cvAnalysisRepository.findById(cvId);
        if (!cv || cv.userID !== userId) {
            throw new Error('CV not found');
        }
        return cv;
    }

}