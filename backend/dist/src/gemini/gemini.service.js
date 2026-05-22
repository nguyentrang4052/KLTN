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
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const jsonrepair_1 = require("jsonrepair");
let GeminiService = GeminiService_1 = class GeminiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GeminiService_1.name);
        this.model = 'gemini-2.5-flash';
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey)
            throw new Error('GEMINI_API_KEY not found');
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    hasVietnameseDiacritics(text) {
        const vietnameseChars = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
        return vietnameseChars.test(text);
    }
    detectCvLanguage(cvData) {
        const stack = [cvData];
        while (stack.length) {
            const item = stack.pop();
            if (typeof item === 'string') {
                if (this.hasVietnameseDiacritics(item))
                    return 'vi';
            }
            else if (item && typeof item === 'object') {
                for (const val of Object.values(item)) {
                    stack.push(val);
                }
            }
        }
        return 'en';
    }
    removeVietnameseDiacritics(str) {
        const map = {
            'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd', 'Đ': 'D'
        };
        return str.replace(/[^A-Za-z0-9\s]/g, ch => map[ch] || ch);
    }
    removeDiacriticsFromNames(cvData, targetLang, sourceLang) {
        if (targetLang !== 'en' || sourceLang !== 'vi')
            return cvData;
        const nameFields = ['fullName', 'company', 'institution', 'issuer', 'organization'];
        const clone = JSON.parse(JSON.stringify(cvData));
        const processObject = (obj) => {
            if (!obj || typeof obj !== 'object')
                return;
            for (const key of Object.keys(obj)) {
                if (nameFields.includes(key) && typeof obj[key] === 'string') {
                    obj[key] = this.removeVietnameseDiacritics(obj[key]);
                }
                else if (Array.isArray(obj[key])) {
                    obj[key].forEach((item) => processObject(item));
                }
                else if (typeof obj[key] === 'object') {
                    processObject(obj[key]);
                }
            }
        };
        processObject(clone);
        return clone;
    }
    async analyzeCV(cvText, retryCount = 0) {
        try {
            this.logger.log(`Analyzing CV (${cvText.length} chars), attempt ${retryCount + 1}`);
            const generativeModel = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 8192,
                }
            });
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
            this.logger.log(`Raw Gemini response (${text.length} chars):`);
            this.logger.debug(text.substring(0, 2000));
            return this.extractJsonFromResponse(text);
        }
        catch (error) {
            this.logger.error(`analyzeCV error: ${error.message}`, error.stack);
            if (error?.message?.includes('JSON') || error?.message?.includes('Unexpected token')) {
                this.logger.warn(`JSON parse error, retrying with simpler prompt...`);
                if (retryCount < 2) {
                    return this.analyzeCVSimple(cvText, retryCount + 1);
                }
            }
            const statusCode = error?.status || error?.response?.status ||
                (error?.message?.includes('503') ? 503 : null) ||
                (error?.message?.includes('429') ? 429 : null);
            if ((statusCode === 503 || statusCode === 429) && retryCount < 2) {
                const delayMs = 3000 * (retryCount + 1);
                await this.delay(delayMs);
                return this.analyzeCV(cvText, retryCount + 1);
            }
            throw new common_1.HttpException(`Gemini API Error: ${error?.message || 'Unknown error'}`, statusCode === 503 ? common_1.HttpStatus.SERVICE_UNAVAILABLE : common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async analyzeCVSimple(cvText, retryCount) {
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
    async analyzeCVWithVerification(cvText) {
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
        }
        catch (error) {
            this.logger.error('Gemini API Error:', error);
            throw new common_1.HttpException(`Gemini API Error: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async extractTextFromImage(imageInput, retryCount = 0) {
        try {
            this.logger.log(`OCR attempt ${retryCount + 1}`);
            let imageData;
            if (Buffer.isBuffer(imageInput)) {
                imageData = { mimeType: 'image/png', data: imageInput.toString('base64') };
            }
            else {
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
        }
        catch (error) {
            if ((error.status === 503 || error.status === 429) && retryCount < 2) {
                await this.delay(2000 * (retryCount + 1));
                return this.extractTextFromImage(imageInput, retryCount + 1);
            }
            throw error;
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    extractFirstJsonObject(text) {
        let start = text.indexOf('{');
        if (start === -1)
            return null;
        let depth = 0;
        for (let i = start; i < text.length; i++) {
            if (text[i] === '{')
                depth++;
            if (text[i] === '}')
                depth--;
            if (depth === 0) {
                return text.substring(start, i + 1);
            }
        }
        return null;
    }
    extractJsonFromResponse(text) {
        let cleaned = text
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/gi, '')
            .trim();
        const firstJson = this.extractFirstJsonObject(cleaned);
        if (firstJson) {
            cleaned = firstJson;
        }
        else {
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (match)
                cleaned = match[0];
        }
        try {
            return JSON.parse(cleaned);
        }
        catch (parseError) {
            this.logger.warn(`JSON parse failed: ${parseError.message}`);
            try {
                const repaired = (0, jsonrepair_1.jsonrepair)(cleaned);
                this.logger.log('JSON repaired with jsonrepair');
                return JSON.parse(repaired);
            }
            catch {
                const manualFixed = this.manualJsonFix(cleaned);
                try {
                    return JSON.parse(manualFixed);
                }
                catch (finalError) {
                    this.logger.error(`All JSON repair failed. Raw (first 800 chars):\n${text.substring(0, 800)}`);
                    return {};
                }
            }
        }
    }
    manualJsonFix(text) {
        let fixed = text;
        fixed = fixed.replace(/,\s*([\]\}])/g, '$1');
        fixed = fixed.replace(/,(\s*\})/g, '$1');
        fixed = fixed.replace(/("\s*)\}(\s*\{)/g, '$1},$2');
        fixed = fixed.replace(/("\s*)\](\s*\[)/g, '$1],$2');
        fixed = fixed.replace(/("\s*)\}(\s*")/g, '$1},$2');
        fixed = fixed.replace(/("\s*)\](\s*")/g, '$1],$2');
        fixed = fixed.replace(/"(\w+)":\s*([}\]],)/g, '"$1": null,$2');
        fixed = fixed.replace(/"(\w+)":\s*}$/g, '"$1": null}');
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
    async translateCV(cvData, targetLang, sectionTitles) {
        const sourceLang = this.detectCvLanguage(cvData);
        const cleanedData = this.removeAvatarField(cvData);
        const fullData = { ...cleanedData };
        if (sectionTitles)
            fullData._sectionTitles = sectionTitles;
        const langName = (lang) => lang === 'en' ? 'English' : 'Vietnamese';
        const prompt = `Dịch CV từ ${langName(sourceLang)} sang ${langName(targetLang)}.

        Yêu cầu:
        - Giữ nguyên cấu trúc JSON.
        - Dịch tất cả các trường văn bản (summary, position, company, description, degree, institution, category, items, portfolio, ...).
        - Đặc biệt dịch object "_sectionTitles" (tiêu đề các phần).
        - Không dịch: email, số điện thoại, link, avatar.
        - Nếu dịch từ Tiếng Việt sang Tiếng Anh: hãy loại bỏ dấu tiếng Việt ở tên riêng (người, công ty, trường học, tổ chức, ...). Ví dụ: "Nguyễn Văn A" -> "Nguyen Van A".
        - Nếu dịch từ Tiếng Anh sang Tiếng Việt: giữ nguyên tên riêng (không thêm dấu).
        - Trả về JSON hợp lệ, không giải thích thêm.

Dữ liệu cần dịch:
${JSON.stringify(fullData, null, 2)}

Kết quả (chỉ JSON):`;
        const response = await this.generateContent(prompt);
        let translated = this.extractJsonFromResponse(response);
        if (!translated || Object.keys(translated).length === 0) {
            return { cvData, sectionTitles };
        }
        if (sourceLang === 'vi' && targetLang === 'en') {
            translated = this.removeDiacriticsFromNames(translated, targetLang, sourceLang);
        }
        let translatedSectionTitles;
        if (translated._sectionTitles && typeof translated._sectionTitles === 'object') {
            translatedSectionTitles = translated._sectionTitles;
            delete translated._sectionTitles;
        }
        const restoredCvData = this.restoreAvatarField(cvData, translated);
        const mergedCvData = this.mergeMissingFields(cvData, restoredCvData);
        let mergedSectionTitles = sectionTitles ? { ...sectionTitles } : {};
        if (translatedSectionTitles) {
            mergedSectionTitles = { ...mergedSectionTitles, ...translatedSectionTitles };
        }
        return { cvData: mergedCvData, sectionTitles: mergedSectionTitles };
    }
    removeAvatarField(data) {
        const cleaned = JSON.parse(JSON.stringify(data));
        if (cleaned.personalInfo && cleaned.personalInfo.avatar) {
            delete cleaned.personalInfo.avatar;
            this.logger.debug('Removed avatar field before translation');
        }
        return cleaned;
    }
    restoreAvatarField(original, translated) {
        const restored = JSON.parse(JSON.stringify(translated));
        if (original.personalInfo && original.personalInfo.avatar) {
            if (!restored.personalInfo)
                restored.personalInfo = {};
            restored.personalInfo.avatar = original.personalInfo.avatar;
            this.logger.debug('Restored avatar field after translation');
        }
        return restored;
    }
    mergeMissingFields(original, translated) {
        if (!translated || typeof translated !== 'object' || Array.isArray(translated)) {
            this.logger.warn('Translated data is invalid, using original data');
            return original;
        }
        if (Object.keys(translated).length === 0) {
            this.logger.warn('Translated data is empty, using original data');
            return original;
        }
        const merged = JSON.parse(JSON.stringify(original));
        const deepMerge = (target, source, path = '') => {
            if (!source || typeof source !== 'object')
                return;
            for (const key of Object.keys(source)) {
                const currentPath = path ? `${path}.${key}` : key;
                const sourceValue = source[key];
                const targetValue = target[key];
                if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
                    if (!targetValue || typeof targetValue !== 'object') {
                        target[key] = {};
                    }
                    deepMerge(target[key], sourceValue, currentPath);
                }
                else if (Array.isArray(sourceValue)) {
                    target[key] = sourceValue;
                }
                else {
                    if (sourceValue !== undefined && sourceValue !== null) {
                        target[key] = sourceValue;
                    }
                }
                if (targetValue !== undefined && sourceValue === undefined) {
                    this.logger.debug(`Field "${currentPath}" missing in translated, kept from original`);
                }
            }
        };
        deepMerge(merged, translated);
        for (const key of Object.keys(translated)) {
            if (!merged.hasOwnProperty(key)) {
                merged[key] = translated[key];
                this.logger.warn(`Extra field "${key}" added by translation, kept as is.`);
            }
        }
        return merged;
    }
    async suggestCVImprovements(cvData, userPrompt, section) {
        const cvLanguage = this.detectCvLanguage(cvData);
        let sectionInstruction = '';
        if (section) {
            sectionInstruction = cvLanguage === 'vi'
                ? `Chỉ tập trung cải thiện phần "${section}" của CV. Giữ nguyên các phần khác.`
                : `Focus only on improving the section "${section}". Keep other parts unchanged.`;
        }
        else {
            sectionInstruction = cvLanguage === 'vi'
                ? `Đề xuất cải thiện tổng thể cho CV, bao gồm Summary, Skills, Experiences (bullet points), Education (nếu cần).`
                : `Suggest overall improvements for the CV, including Summary, Skills, Experiences (bullet points), Education (if needed).`;
        }
        const languageInstruction = cvLanguage === 'vi'
            ? `QUAN TRỌNG: CV hiện tại bằng TIẾNG VIỆT. Bạn PHẢI trả lời bằng TIẾNG VIỆT, giữ nguyên dấu tiếng Việt. Tất cả các đề xuất (summary, skills, experiences, ...) đều phải viết bằng TIẾNG VIỆT.`
            : `IMPORTANT: The current CV is in ENGLISH. You MUST answer in ENGLISH. All suggestions (summary, skills, experiences, ...) must be written in ENGLISH.`;
        const prompt = cvLanguage === 'vi'
            ? `
Bạn là chuyên gia tư vấn viết CV chuyên nghiệp. Dựa trên yêu cầu của người dùng và nội dung CV hiện tại, hãy đưa ra các đề xuất chỉnh sửa.

Yêu cầu của người dùng:
${userPrompt}

${sectionInstruction}

${languageInstruction}

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
  "certifications": [ ... ],
  "awards": [ ... ],
  "activities": [ ... ],
  "suggestions": "Lời khuyên bổ sung (string)"
}

Chỉ trả về JSON, không markdown, không giải thích thêm.
`
            : `
You are a professional CV writing consultant. Based on the user's request and the current CV content, provide improvement suggestions.

User request:
${userPrompt}

${sectionInstruction}

${languageInstruction}

Current CV:
${JSON.stringify(cvData, null, 2)}

Return JSON with the following structure (only fields that need changes):
{
  "summary": "new professional summary",
  "skills": [
    { "category": "Technical Skills", "items": "React, Node.js, ..." }
  ],
  "experiences": [
    {
      "company": "Company name",
      "position": "Job title",
      "duration": "Time period",
      "description": "Improved description with bullet points and metrics"
    }
  ],
  "education": [ ... ],
  "certifications": [ ... ],
  "awards": [ ... ],
  "activities": [ ... ],
  "suggestions": "Additional advice (string)"
}

Return ONLY valid JSON, no markdown, no explanation.
`;
        const response = await this.generateContent(prompt);
        return this.extractJsonFromResponse(response);
    }
    async generateContent(prompt) {
        const model = this.genAI.getGenerativeModel({
            model: this.model,
            generationConfig: { temperature: 0.3, maxOutputTokens: 8192 }
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
    async scoreJobs(prompt) {
        try {
            this.logger.log(`Scoring jobs with model: ${this.model}`);
            const generativeModel = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 8192,
                },
            });
            const result = await generativeModel.generateContent(prompt);
            const text = result.response.text();
            this.logger.log('Job scoring response received');
            return this.extractJsonFromResponse(text);
        }
        catch (error) {
            const statusCode = error?.status ||
                error?.response?.status ||
                (error?.message?.includes('503') ? 503 : null) ||
                (error?.message?.includes('429') ? 429 : null);
            this.logger.error('Gemini scoreJobs error:', {
                statusCode,
                message: error?.message,
            });
            throw new common_1.HttpException(`Gemini API Error: ${error?.message || 'Unknown error'}`, statusCode === 503
                ? common_1.HttpStatus.SERVICE_UNAVAILABLE
                : common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map