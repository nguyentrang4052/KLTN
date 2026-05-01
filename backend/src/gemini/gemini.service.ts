import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsonrepair } from 'jsonrepair';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private readonly genAI: GoogleGenerativeAI;
    private readonly model = 'gemini-3-flash-preview';

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) throw new Error('GEMINI_API_KEY not found');
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async analyzeCV(cvText: string, retryCount = 0): Promise<any> {
        try {
            this.logger.log(`Analyzing CV (${cvText.length} chars), attempt ${retryCount + 1}`);

            const generativeModel = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: 0.3, // Tăng để extraction tốt hơn
                    maxOutputTokens: 8192, // Tăng cho CV dài
                }
            });

            // === SYSTEM INSTRUCTION: Định nghĩa vai trò và format ===
            const systemInstruction = `You are an expert CV parser with 10 years of experience. Your task is to extract ALL possible information from CV text and return strictly valid JSON.

EXTRACTION RULES:
1. Read the CV text carefully. Extract EVERY experience, education entry, skill, certification, award, and activity.
2. NEVER return empty arrays [] if the CV contains relevant information.
3. If a section exists in CV but you can't parse details, return at least one object with available fields.
4. For skills: group by category (Technical, Languages, Soft Skills, Tools, etc.). If no category, use "General".
5. For experiences: extract company, position, duration (exact text), and full description.
6. For education: extract institution, degree, field of study, year/duration, GPA if available.
7. For activities: extract organization, role, duration, description.
8. For awards: extract title, issuer, year, description.
9. For certifications: extract name, issuer, year, credential ID if available.
10. summary: Write a 2-3 sentence professional summary based on the CV content.
11. personalInfo: Extract full name, email, phone, address, LinkedIn, portfolio/website.

LANGUAGE RULES (CRITICAL):
- Preserve the EXACT ORIGINAL LANGUAGE of the CV content
- If CV is in Vietnamese, ALL extracted text must be in Vietnamese (keep diacritics: á, à, ả, ã, ạ, â, ă, đ, ê, ô, ơ, ư, etc.)
- If CV is in English, ALL extracted text must be in English
- NEVER translate content from one language to another
- Keep company names, school names, addresses, descriptions in original form
- Summary must be written in the SAME LANGUAGE as the CV

JSON RULES:
- Return ONLY raw JSON, no markdown, no explanation
- Use null for missing scalar fields, never omit the field
- Arrays must contain objects if data exists, [] only if truly empty
- No trailing commas
- All strings use double quotes
- Escape internal quotes with backslash`;

            // === USER PROMPT: CV text + few-shot example ===
            const userPrompt = `Extract all information from this CV into JSON. Here is an example of expected output for a typical CV:

EXAMPLE OUTPUT FORMAT:
{
  "personalInfo": {
    "fullName": "Nguyen Van A",
    "email": "nguyenvana@email.com",
    "phone": "+84 123 456 789",
    "address": "Ho Chi Minh City, Vietnam",
    "linkedin": "linkedin.com/in/nguyenvana",
    "portfolio": "nguyenvana.github.io"
  },
  "experiences": [
    {
      "company": "Tech Corp Vietnam",
      "position": "Senior Software Engineer",
      "duration": "03/2022 - Present",
      "description": "Develop microservices using Node.js and NestJS. Lead team of 5 engineers. Implement CI/CD pipeline with GitHub Actions."
    },
    {
      "company": "Startup XYZ",
      "position": "Backend Developer",
      "duration": "06/2020 - 02/2022",
      "description": "Built REST APIs with Express.js. Managed PostgreSQL databases. Integrated payment gateways."
    }
  ],
  "education": [
    {
      "institution": "University of Science",
      "degree": "Bachelor of Science",
      "year": "2016 - 2020",
      "gpa": "3.6/4.0"
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "items": "JavaScript, TypeScript, Python, Java"
    },
    {
      "category": "Frameworks & Tools",
      "items": "NestJS, React, Docker, Kubernetes, AWS"
    }
  ],
  "activities": [
    {
      "organization": "GDG Vietnam",
      "role": "Speaker",
      "duration": "2023 - Present",
      "description": "Speak at monthly tech meetups about backend development"
    }
  ],
  "awards": [
    {
      "title": "Best Employee of the Year",
      "issuer": "Tech Corp Vietnam",
      "year": "2023",
      "description": "Recognized for outstanding performance and leadership"
    }
  ],
  "certifications": [
    {
      "name": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "year": "2022",
      "score": "Credential ID: AWS-123456"
    }
  ],
  "summary": "Senior Software Engineer with 4+ years of experience in backend development. Expert in Node.js, NestJS, and cloud infrastructure. Strong leadership skills with experience managing engineering teams."
}

NOW EXTRACT FROM THIS CV:
${cvText}

Return ONLY valid JSON. Ensure all sections from the CV are captured.`;

            const chat = generativeModel.startChat({
                systemInstruction: {
                    role: 'system',
                    parts: [{ text: systemInstruction }],
                },
                history: [],
            });

            const result = await chat.sendMessage(userPrompt);
            const response = await result.response;
            const text = response.text();

            // === LOG RAW RESPONSE ĐỂ DEBUG ===
            this.logger.log(`Raw Gemini response (${text.length} chars):`);
            this.logger.debug(text.substring(0, 2000)); // Log 2000 chars đầu

            return this.extractJsonFromResponse(text);

        } catch (error: any) {
            this.logger.error(`analyzeCV error: ${error.message}`, error.stack);

            // Retry với prompt đơn giản hơn nếu lỗi JSON
            if (error?.message?.includes('JSON') || error?.message?.includes('Unexpected token')) {
                this.logger.warn(`JSON parse error, retrying with simpler prompt...`);
                if (retryCount < 2) {
                    return this.analyzeCVSimple(cvText, retryCount + 1);
                }
            }

            // Retry nếu rate limit / service unavailable
            const statusCode = error?.status || error?.response?.status ||
                (error?.message?.includes('503') ? 503 : null) ||
                (error?.message?.includes('429') ? 429 : null);

            if ((statusCode === 503 || statusCode === 429) && retryCount < 2) {
                const delayMs = 3000 * (retryCount + 1);
                await this.delay(delayMs);
                return this.analyzeCV(cvText, retryCount + 1);
            }

            throw new HttpException(
                `Gemini API Error: ${error?.message || 'Unknown error'}`,
                statusCode === 503 ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.BAD_REQUEST,
            );
        }
    }

    /**
     * Fallback: Dùng prompt đơn giản hơn khi JSON bị lỗi
     */
    private async analyzeCVSimple(cvText: string, retryCount: number): Promise<any> {
        this.logger.log(`Simple extraction attempt ${retryCount}`);

        const generativeModel = this.genAI.getGenerativeModel({
            model: this.model,
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8192,
            }
        });

        const prompt = `Extract CV information and return valid JSON. Be extremely careful with syntax.

CV TEXT:
${cvText}

You MUST return this exact structure with real extracted values (use null if missing, but try to extract everything):
{"personalInfo":{"fullName":null,"email":null,"phone":null,"address":null,"linkedin":null,"portfolio":null},"experiences":[{"company":null,"position":null,"duration":null,"description":null}],"education":[{"institution":null,"degree":null,"year":null,"gpa":null}],"skills":[{"category":null,"items":null}],"activities":[{"organization":null,"role":null,"duration":null,"description":null}],"awards":[{"title":null,"issuer":null,"year":null,"description":null}],"certifications":[{"name":null,"issuer":null,"year":null,"score":null}],"summary":""}

CRITICAL: 
- Fill in REAL values from the CV above, do not return all null
- If there are multiple items in a section, return ALL of them as array objects
- Ensure valid JSON: no trailing commas, all quotes closed`;

        const result = await generativeModel.generateContent(prompt);
        const text = result.response.text();

        this.logger.log(`Simple mode raw response: ${text.substring(0, 1000)}`);

        return this.extractJsonFromResponse(text);
    }

    async analyzeCVWithVerification(cvText: string): Promise<any> {
        try {
            this.logger.log(`Verification analysis with model: ${this.model}`);

            const generativeModel = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 8192,
                }
            });

            const prompt = `You are an expert CV parser. Extract ALL information from this CV and return ONLY valid JSON.

REQUIREMENTS:
- Extract every single experience, education, skill, certification, award, activity
- Do not summarize or skip items - list them all
- For skills: group by category and list all items
- For experiences: include all positions with full descriptions
- For education: include all degrees and institutions
- summary: generate a professional summary based on the CV

LANGUAGE RULES (CRITICAL):
- Preserve the EXACT ORIGINAL LANGUAGE of the CV
- If CV is in Vietnamese, ALL text must be in Vietnamese (keep diacritics)
- If CV is in English, ALL text must be in English
- NEVER translate between languages
- Summary MUST be in the same language as the CV

JSON STRUCTURE:
{
  "personalInfo": {"fullName":"","email":"","phone":"","address":"","linkedin":"","portfolio":""},
  "experiences": [{"company":"","position":"","duration":"","description":""}],
  "education": [{"institution":"","degree":"","year":"","gpa":""}],
  "skills": [{"category":"","items":""}],
  "activities": [{"organization":"","role":"","duration":"","description":""}],
  "awards": [{"title":"","issuer":"","year":"","description":""}],
  "certifications": [{"name":"","issuer":"","year":"","score":""}],
  "summary": ""
}

CRITICAL: 
- Return ONLY JSON, no markdown, no explanation
- No trailing commas
- All fields must be present
- Escape quotes inside strings with backslash

CV Content:
${cvText}`;
            const result = await generativeModel.generateContent(prompt);
            const text = result.response.text();

            this.logger.log(`Response length: ${text.length}`);
            this.logger.debug(`Raw response: ${text.substring(0, 2000)}`);

            return this.extractJsonFromResponse(text);

        } catch (error: any) {
            this.logger.error('Gemini API Error:', error);
            throw new HttpException(
                `Gemini API Error: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async extractTextFromImage(imageInput: string | Buffer, retryCount = 0): Promise<string> {
        try {
            this.logger.log(`OCR attempt ${retryCount + 1}`);

            let imageData: { mimeType: string; data: string };

            if (Buffer.isBuffer(imageInput)) {
                imageData = { mimeType: 'image/png', data: imageInput.toString('base64') };
            } else {
                imageData = { mimeType: 'image/png', data: imageInput };
            }

            const model = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: { temperature: 0 }
            });

            const result = await model.generateContent([
                'Extract all text from this CV image. Preserve Vietnamese diacritics and formatting. Return only the extracted text with proper line breaks.',
                { inlineData: imageData }
            ]);

            const text = result.response.text();
            this.logger.log(`OCR result: ${text.length} chars`);
            return text;

        } catch (error: any) {
            if ((error.status === 503 || error.status === 429) && retryCount < 2) {
                await this.delay(2000 * (retryCount + 1));
                return this.extractTextFromImage(imageInput, retryCount + 1);
            }
            throw error;
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private extractJsonFromResponse(text: string): any {
        // Bước 1: Làm sạch
        let cleaned = text
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/gi, '')
            .trim();

        // Bước 2: Tìm JSON object (tìm cặp ngoặc nhọn ngoài cùng)
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        // Bước 3: Thử parse
        try {
            return JSON.parse(cleaned);
        } catch (parseError: any) {
            this.logger.warn(`JSON parse failed: ${parseError.message}`);

            // Bước 4: Thử jsonrepair
            try {
                const repaired = jsonrepair(cleaned);
                this.logger.log('JSON repaired with jsonrepair');
                return JSON.parse(repaired);
            } catch {
                // Bước 5: Thử sửa lỗi thủ công
                const manualFixed = this.manualJsonFix(cleaned);
                try {
                    return JSON.parse(manualFixed);
                } catch {
                    this.logger.error(`All JSON repair failed. Raw (first 800 chars):\n${text.substring(0, 800)}`);
                    throw new Error(`Cannot extract valid JSON: ${parseError.message}`);
                }
            }
        }
    }

    /**
     * Sửa lỗi JSON thủ công phổ biến
     */
    private manualJsonFix(text: string): string {
        let fixed = text;

        // 1. Xóa trailing commas trước ] hoặc }
        fixed = fixed.replace(/,\s*([\]\}])/g, '$1');

        // 2. Xóa trailing commas cuối object trước khi đóng
        fixed = fixed.replace(/,(\s*\})/g, '$1');

        // 3. Thêm dấu phẩy giữa các elements nếu thiếu
        fixed = fixed.replace(/("\s*)\}(\s*\{)/g, '$1},$2');
        fixed = fixed.replace(/("\s*)\](\s*\[)/g, '$1],$2');
        fixed = fixed.replace(/("\s*)\}(\s*")/g, '$1},$2'); // }, "key"
        fixed = fixed.replace(/("\s*)\](\s*")/g, '$1],$2'); // ], "key"

        // 4. Sửa các trường hợp thiếu value sau dấu :
        fixed = fixed.replace(/"(\w+)":\s*([}\]],)/g, '"$1": null,$2');
        fixed = fixed.replace(/"(\w+)":\s*}$/g, '"$1": null}');

        // 5. Đảm bảo đóng đủ brackets
        const openBraces = (fixed.match(/\{/g) || []).length;
        const closeBraces = (fixed.match(/\}/g) || []).length;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;

        if (openBraces > closeBraces) {
            fixed += '}'.repeat(openBraces - closeBraces);
        }
        if (openBrackets > closeBrackets) {
            fixed += ']'.repeat(openBrackets - closeBrackets);
        }

        return fixed;
    }


    // ... existing code ...

    /**
     * Dịch toàn bộ CV object sang ngôn ngữ đích
     */
    async translateCV(cvData: any, targetLang: 'en' | 'vi'): Promise<any> {
        const prompt = `
Bạn là chuyên gia dịch thuật CV. Hãy dịch toàn bộ nội dung CV sau từ ngôn ngữ gốc sang ${targetLang === 'en' ? 'TIẾNG ANH' : 'TIẾNG VIỆT'}.

QUY TẮC:
- Giữ nguyên cấu trúc JSON.
- Dịch tất cả các trường văn bản (fullName, summary, company, position, description, institution, degree, skills items, v.v.).
- Không dịch tên riêng, tên công ty, địa chỉ email, số điện thoại, link.
- Bảo toàn định dạng danh sách kỹ năng (dấu phẩy, xuống dòng).
- Trả về JSON hợp lệ, không markdown.

CV gốc:
${JSON.stringify(cvData, null, 2)}

JSON đã dịch:
`;

        const response = await this.generateContent(prompt);
        return this.extractJsonFromResponse(response);
    }

    /**
     * Gợi ý cải thiện CV dựa trên prompt của user
     */
    async suggestCVImprovements(cvData: any, userPrompt: string, section?: string): Promise<any> {
        let sectionInstruction = '';
        if (section) {
            sectionInstruction = `Chỉ tập trung cải thiện phần "${section}" của CV. Giữ nguyên các phần khác.`;
        } else {
            sectionInstruction = `Đề xuất cải thiện tổng thể cho CV, bao gồm Summary, Skills, Experiences (bullet points), Education (nếu cần).`;
        }

        const prompt = `
Bạn là chuyên gia tư vấn viết CV. Dựa trên yêu cầu của người dùng và nội dung CV hiện tại, hãy đưa ra các đề xuất chỉnh sửa.

Yêu cầu của người dùng:
${userPrompt}

${sectionInstruction}

CV hiện tại:
${JSON.stringify(cvData, null, 2)}

Hãy trả về JSON theo cấu trúc sau (chỉ chứa các trường cần thay đổi, không cần thiết trả về toàn bộ CV):
{
  "summary": "string (mục tiêu nghề nghiệp mới, nếu có đề xuất)",
  "skills": [
    { "category": "Technical Skills", "items": "React, Node.js, ..." }
  ],
  "experiences": [
    {
      "company": "Tên công ty",
      "position": "Chức vụ",
      "duration": "Thời gian",
      "description": "Mô tả cải tiến (viết lại thành bullet points có số liệu)"
    }
  ],
  "education": [ ... ],
  "suggestions": "Lời khuyên bổ sung (string)"
}

Chỉ trả về JSON, không markdown, không giải thích thêm.
`;

        const response = await this.generateContent(prompt);
        return this.extractJsonFromResponse(response);
    }

    // Helper nhỏ gọi Gemini
    private async generateContent(prompt: string): Promise<string> {
        const model = this.genAI.getGenerativeModel({
            model: this.model,
            generationConfig: { temperature: 0.3, maxOutputTokens: 8192 }
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
}