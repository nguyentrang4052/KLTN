"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CvAnalyzerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvAnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const gemini_service_1 = require("../gemini/gemini.service");
const pdf_to_image_service_1 = require("./pdf-to-image.service");
const cv_analysis_repository_1 = require("./cv-analysis.repository");
const redis_service_1 = require("../redis/redis.service");
const file_converter_util_1 = require("./utils/file-converter.util");
const fs = __importStar(require("fs/promises"));
const crypto_1 = require("crypto");
let CvAnalyzerService = CvAnalyzerService_1 = class CvAnalyzerService {
    geminiService;
    pdfToImageService;
    cvAnalysisRepository;
    redisService;
    logger = new common_1.Logger(CvAnalyzerService_1.name);
    CACHE_TTL = 7 * 24 * 60 * 60;
    prisma;
    constructor(geminiService, pdfToImageService, cvAnalysisRepository, redisService) {
        this.geminiService = geminiService;
        this.pdfToImageService = pdfToImageService;
        this.cvAnalysisRepository = cvAnalysisRepository;
        this.redisService = redisService;
    }
    async analyzeMultipleCVs(files, userID, enableVerification = true) {
        try {
            this.logger.log(`Processing ${files.length} files...`);
            const results = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.logger.log(`File ${i + 1}/${files.length}: ${file.originalname}`);
                try {
                    const fileBuffer = await fs.readFile(file.path);
                    const fileHash = (0, crypto_1.createHash)('sha256').update(fileBuffer).digest('hex');
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
                        const existingDb = await this.cvAnalysisRepository.findByFileHash(fileHash);
                        if (!existingDb) {
                            await this.cvAnalysisRepository.create(userID, fileHash, file.originalname, parsed);
                        }
                        await fs.unlink(file.path).catch(() => { });
                        continue;
                    }
                    const cachedDb = await this.cvAnalysisRepository.findByFileHash(fileHash);
                    if (cachedDb) {
                        this.logger.log(`✓ Database HIT: ${file.originalname}`);
                        const dto = cachedDb.result;
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
                    this.logger.log(`✗ Cache MISS: ${file.originalname} → Calling Gemini API...`);
                    const analyzed = await this.analyzeSingleFile(file, fileBuffer, enableVerification);
                    await this.redisService.set(redisKey, JSON.stringify(analyzed), this.CACHE_TTL);
                    this.logger.log(`  → Saved to Redis cache`);
                    const saved = await this.cvAnalysisRepository.create(userID, fileHash, file.originalname, analyzed);
                    this.logger.log(`  → Saved to Database (id: ${saved.id})`);
                    results.push({
                        filename: file.originalname,
                        fromCache: false,
                        hash: fileHash.substring(0, 8),
                        data: analyzed,
                        savedId: saved.id,
                    });
                }
                catch (error) {
                    this.logger.error(`Failed ${file.originalname}:`, error.message);
                    results.push({
                        filename: file.originalname,
                        error: error.message,
                    });
                }
                finally {
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
        }
        catch (error) {
            for (const f of files) {
                await fs.unlink(f.path).catch(() => { });
            }
            throw new Error(`CV Analysis failed: ${error.message}`);
        }
    }
    async mapCVToProfile(cvBuilderId, userId) {
        this.logger.log(`User ${userId} mapping CV ${cvBuilderId} to profile`);
        return this.cvAnalysisRepository.mapToUserProfile(cvBuilderId, userId);
    }
    async getUserCVHistory(userId) {
        return this.cvAnalysisRepository.findByUser(userId);
    }
    async analyzeSingleFile(file, fileBuffer, enableVerification) {
        let combinedText = '';
        if (file.mimetype === 'application/pdf') {
            const fileData = await file_converter_util_1.FileConverterUtil.convertFile(file.path, file.mimetype);
            if (fileData.type === 'text' && fileData.content && fileData.content.length > 100) {
                if (!this.isVietnameseTextGarbled(fileData.content)) {
                    this.logger.log(`Using native PDF text: ${fileData.content.length} chars`);
                    combinedText = fileData.content;
                }
                else {
                    this.logger.warn(`Text garbled, converting PDF to images for Vision OCR...`);
                    const images = await this.pdfToImageService.convert(fileBuffer);
                    for (let j = 0; j < images.length; j++) {
                        this.logger.log(`OCR page ${j + 1}/${images.length}...`);
                        const pageText = await this.geminiService.extractTextFromImage(images[j]);
                        combinedText += `\n\n=== PAGE ${j + 1} [Vision OCR] ===\n${pageText}`;
                    }
                }
            }
            else {
                this.logger.warn(`No text extracted, converting PDF to images...`);
                const images = await this.pdfToImageService.convert(fileBuffer);
                for (let j = 0; j < images.length; j++) {
                    const pageText = await this.geminiService.extractTextFromImage(images[j]);
                    combinedText += `\n\n=== PAGE ${j + 1} [Vision OCR] ===\n${pageText}`;
                }
            }
        }
        else {
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
    isVietnameseTextGarbled(text) {
        if (!text || text.length < 50)
            return false;
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
    validateAndFormatResult(data) {
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
    async mapLocalCVToProfile(cvData, userId) {
        this.logger.log(`User ${userId} mapping local CV to profile`);
        const { personalInfo = {}, experiences = [], skills = [], summary = '' } = cvData;
        let inferredCareer = {
            jobTitle: '',
            experienceYear: '',
            careerLevel: '',
        };
        try {
            const cvText = [
                summary && `Mục tiêu: ${summary}`,
                experiences.length > 0 && `Kinh nghiệm:\n${experiences.map(e => `- ${e.position || ''} tại ${e.company || ''} (${e.duration || ''}): ${e.description || ''}`).join('\n')}`,
                skills.length > 0 && `Kỹ năng: ${skills.map((s) => typeof s === 'string' ? s : `${s.category || ''}: ${s.items || ''}`).join(', ')}`,
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
                const jsonMatch = JSON.stringify(raw).match(/\{[^{}]*"jobTitle"[^{}]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    inferredCareer = {
                        jobTitle: parsed.jobTitle || '',
                        experienceYear: parsed.experienceYear || '',
                        careerLevel: parsed.careerLevel || '',
                    };
                }
                else if (raw && typeof raw === 'object') {
                    inferredCareer = {
                        jobTitle: raw.jobTitle || '',
                        experienceYear: raw.experienceYear || '',
                        careerLevel: raw.careerLevel || '',
                    };
                }
            }
        }
        catch (err) {
            this.logger.warn(`Gemini inference failed, using rule-based fallback: ${err.message}`);
            inferredCareer = this.inferCareerRuleBased(experiences, skills);
        }
        return this.cvAnalysisRepository.mapLocalDataToUserProfile(userId, {
            fullName: personalInfo.fullName || undefined,
            phone: personalInfo.phone || undefined,
            address: personalInfo.address || undefined,
            jobTitle: inferredCareer.jobTitle || undefined,
            experienceYear: inferredCareer.experienceYear || undefined,
            careerLevel: inferredCareer.careerLevel || undefined,
        });
    }
    inferCareerRuleBased(experiences, skills) {
        const count = experiences.length;
        const jobTitle = experiences[0]?.position || '';
        let experienceYear = 'Chưa có kinh nghiệm';
        if (count === 1)
            experienceYear = '1-2 năm';
        else if (count === 2)
            experienceYear = '2-3 năm';
        else if (count >= 3 && count <= 4)
            experienceYear = '3-5 năm';
        else if (count > 4)
            experienceYear = 'Trên 5 năm';
        let careerLevel = 'Junior';
        if (count === 0)
            careerLevel = 'Intern';
        else if (count === 1)
            careerLevel = 'Junior';
        else if (count === 2)
            careerLevel = 'Middle';
        else if (count >= 3)
            careerLevel = 'Senior';
        return { jobTitle, experienceYear, careerLevel };
    }
    async getCVById(cvId, userId) {
        const cv = await this.cvAnalysisRepository.findById(cvId);
        if (!cv || cv.userID !== userId) {
            throw new Error('CV not found');
        }
        return cv;
    }
};
exports.CvAnalyzerService = CvAnalyzerService;
exports.CvAnalyzerService = CvAnalyzerService = CvAnalyzerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_service_1.GeminiService,
        pdf_to_image_service_1.PdfToImageService,
        cv_analysis_repository_1.CVAnalysisRepository,
        redis_service_1.RedisService])
], CvAnalyzerService);
//# sourceMappingURL=cv-analyzer.service.js.map