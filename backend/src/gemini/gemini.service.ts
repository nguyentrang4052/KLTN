// import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { GoogleGenerativeAI, Content } from '@google/generative-ai';

// @Injectable()
// export class GeminiService {
//     private readonly logger = new Logger(GeminiService.name);
//     private readonly genAI: GoogleGenerativeAI;
//     private readonly model = 'gemini-2.5-flash';

//     constructor(private readonly configService: ConfigService) {
//         const apiKey = this.configService.get<string>('GEMINI_API_KEY');
//         if (!apiKey) {
//             throw new Error('GEMINI_API_KEY not found in environment variables');
//         }
//         this.genAI = new GoogleGenerativeAI(apiKey);
//     }

//     async analyzeCV(cvText: string): Promise<any> {
//         try {
//             const generativeModel = this.genAI.getGenerativeModel({
//                 model: this.model,
//                 generationConfig: {
//                     temperature: 0.1,
//                     maxOutputTokens: 4000,
//                 }
//             });

//             const systemPrompt = `You are a professional CV analyzer. Extract information from the CV and return ONLY a valid JSON object with this exact structure:
// {
//   "personalInfo": {
//     "fullName": "string",
//     "email": "string", 
//     "phone": "string",
//     "address": "string",
//     "linkedin": "string",
//     "portfolio": "string"
//   },
//   "experiences": [
//     {
//       "company": "string",
//       "position": "string",
//       "duration": "string",
//       "description": "string"
//     }
//   ],
//   "education": [
//     {
//       "institution": "string",
//       "degree": "string",
//       "year": "string"
//     }
//   ],
//   "skills": [
//     {
//       "category": "string",
//       "items": "string"
//     }
//   ],
//   "activities": [
//     {
//       "organization": "string",
//       "role": "string",
//       "duration": "string",
//       "description": "string"
//     }
//   ],
//   "awards": [
//     {
//       "title": "string",
//       "issuer": "string",
//       "year": "string",
//       "description": "string"
//     }
//   ],
//   "certifications": [
//     {
//       "name": "string",
//       "issuer": "string",
//       "year": "string",
//     }
//   ],
//   "summary": "string - brief summary of the candidate"
// }

// Rules:
// - Return ONLY the JSON, no markdown formatting (no \`\`\`json), no explanation text
// - Use null or empty string for missing fields
// - Ensure valid JSON syntax
// - Be precise with dates and contact information`;

//             const chat = generativeModel.startChat({
//                 history: [
//                     {
//                         role: 'user',
//                         parts: [{ text: systemPrompt }],
//                     },
//                     {
//                         role: 'model',
//                         parts: [{ text: 'I understand. I will extract CV information and return only valid JSON without any markdown formatting or explanation.' }],
//                     },
//                 ],
//             });

//             this.logger.log('Sending CV to Gemini for analysis...');

//             const result = await chat.sendMessage(
//                 `Extract information from this CV into JSON format:\n\n${cvText}`
//             );

//             const response = await result.response;
//             const text = response.text();

//             this.logger.log('Gemini response received, parsing JSON...');

//             // Parse JSON từ response
//             return this.extractJsonFromResponse(text);

//         } catch (error: any) {
//             this.logger.error('Gemini API Error:', error);
//             throw new HttpException(
//                 `Gemini API Error: ${error.message}`,
//                 HttpStatus.BAD_REQUEST,
//             );
//         }
//     }

//     /**
//      * Multi-turn analysis với verification (tương tự reasoning của OpenRouter)
//      */
//     async analyzeCVWithVerification(cvText: string): Promise<any> {
//         try {
//             const generativeModel = this.genAI.getGenerativeModel({
//                 model: this.model,
//                 generationConfig: {
//                     temperature: 0.1,
//                     maxOutputTokens: 4000,
//                 }
//             });

//             // Turn 1: Initial extraction
//             const prompt1 = `You are a professional CV analyzer. Extract information from this CV and return ONLY valid JSON with this structure:
// {
//   "personalInfo": {"fullName": "", "email": "", "phone": "", "address": "", "linkedin": "", "portfolio": ""},
//   "experiences": [{"company": "", "position": "", "duration": "", "description": ""}],
//   "education": [{"institution": "", "degree": "", "year": ""}],
//   "skills": [{"category": "", "items": ""}],
//   "activities": [{"organization": "", "role": "", "duration": "", "description": ""}],
//   "awards": [{"title": "", "issuer": "", "year": "", "description": ""}],
//   "certifications": [{"name": "", "issuer": "", "year": ""}],
//   "summary": ""
// }

// CV Content:
// ${cvText}

// Return ONLY JSON, no markdown, no explanation.`;

//             this.logger.log('Turn 1: Initial extraction...');
//             const result1 = await generativeModel.generateContent(prompt1);
//             const response1 = result1.response.text();

//             // Turn 2: Verification và correction
//             const prompt2 = `Review this JSON extraction from a CV. Fix any errors in dates, emails, phone numbers. Return ONLY the corrected JSON without any explanation.

// Previous extraction:
// ${response1}

// Return corrected JSON only:`;

//             this.logger.log('Turn 2: Verification...');
//             const result2 = await generativeModel.generateContent(prompt2);
//             const response2 = result2.response.text();

//             return this.extractJsonFromResponse(response2);

//         } catch (error: any) {
//             this.logger.error('Gemini API Error:', error);
//             throw new HttpException(
//                 `Gemini API Error: ${error.message}`,
//                 HttpStatus.BAD_REQUEST,
//             );
//         }
//     }

//     private extractJsonFromResponse(text: string): any {
//         try {
//             // Thử parse trực tiếp
//             return JSON.parse(text);
//         } catch {
//             // Nếu fail, thử extract từ markdown code block
//             const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
//             if (jsonMatch) {
//                 return JSON.parse(jsonMatch[1]);
//             }
//             // Thử tìm JSON object trong text
//             const objectMatch = text.match(/\{[\s\S]*\}/);
//             if (objectMatch) {
//                 return JSON.parse(objectMatch[0]);
//             }
//             throw new Error('Cannot extract JSON from response');
//         }
//     }

//     // Thêm vào gemini.service.ts
//     async extractTextFromImage(base64Image: string): Promise<string> {
//         const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

//         const result = await model.generateContent([
//             'Extract all text from this CV image. Return only the extracted text without any explanation or formatting.',
//             {
//                 inlineData: {
//                     mimeType: 'image/png',
//                     data: base64Image
//                 }
//             }
//         ]);

//         return result.response.text();
//     }
// }




import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private readonly genAI: GoogleGenerativeAI;

    // Danh sách model theo thứ tự ưu tiên
    private readonly model = 'gemini-2.5-flash';

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not found in environment variables');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async analyzeCV(cvText: string, retryCount = 0): Promise<any> {


        try {
            this.logger.log(`Analyzing with model: ${this.model} (attempt ${retryCount + 1})`);

            const generativeModel = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 4000,
                }
            });

            const systemPrompt = `You are a professional CV analyzer. Extract information from the CV and return ONLY a valid JSON object with this exact structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string", 
    "phone": "string",
    "address": "string",
    "linkedin": "string",
    "portfolio": "string"
  },
  "experiences": [
    {
      "company": "string",
      "position": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string",
      "gpa": "string",
    }
  ],
  "skills": [
    {
      "category": "string",
      "items": "string"
    }
  ],
  "activities": [
    {
      "organization": "string",
      "role": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "awards": [
    {
      "title": "string",
      "issuer": "string",
      "year": "string",
      "description": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string",
      "score": "string"
    }
  ],
  "summary": "string - brief summary of the candidate"
}

Rules:
- Return ONLY the JSON, no markdown formatting (no \`\`\`json), no explanation text
- Use null or empty string for missing fields
- Ensure valid JSON syntax
- Be precise with dates and contact information

Education:
- Extract GPA if explicitly mentioned
- GPA examples: "3.6/4.0", "8.5/10", "Distinction", "First Class"
- Do NOT infer or calculate GPA

Certifications:
- Extract score/grade if explicitly mentioned
- Examples:
  - "TOEIC 850" → score = "850"
  - "IELTS 7.5" → score = "7.5"
  - "AWS Certified - 820/1000" → score = "820/1000"
  - "Passed" → score = "Passed"
- Extract credentialId only if explicitly present
- Extract credentialUrl only if explicitly present
- Do NOT hallucinate IDs or scores

Activities:
- Include extracurricular, volunteering, clubs, organizations

Awards:
- Include honors, achievements, scholarships, competitions`;

            const chat = generativeModel.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }],
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'I understand. I will extract CV information and return only valid JSON without any markdown formatting or explanation.' }],
                    },
                ],
            });

            const result = await chat.sendMessage(
                `Extract information from this CV into JSON format:\n\n${cvText}`
            );

            const response = await result.response;
            const text = response.text();

            this.logger.log(`Analysis successful with ${this.model}`);

            return this.extractJsonFromResponse(text);

        } catch (error: any) {
            // Lỗi 503 (Service Unavailable) hoặc 429 (Rate Limit) -> retry hoặc chuyển model
            if ((error.status === 503 || error.status === 429) && retryCount < 2) {
                this.logger.warn(`${this.model} overloaded, waiting 3s and retrying...`);
                await this.delay(3000);
                return this.analyzeCV(cvText, retryCount + 1);
            } throw new HttpException(
                `Gemini API Error: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );

        }
    }

    /**
     * Multi-turn analysis với verification (tương tự reasoning của OpenRouter)
     */
    async analyzeCVWithVerification(cvText: string): Promise<any> {
       
        try {
            this.logger.log(`Verification with model: ${this.model}`);

            const generativeModel = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 4000,
                }
            });

            // Turn 1: Initial extraction
            const prompt1 = `You are a professional CV analyzer. Extract information from this CV and return ONLY valid JSON with this structure:
{
  "personalInfo": {"fullName": "", "email": "", "phone": "", "address": "", "linkedin": "", "portfolio": ""},
  "experiences": [{"company": "", "position": "", "duration": "", "description": ""}],
  "education": [{"institution": "", "degree": "", "year": "","gpa":""}],
  "skills": [{"category": "", "items": ""}],
  "activities": [{"organization": "", "role": "", "duration": "", "description": ""}],
  "awards": [{"title": "", "issuer": "", "year": "", "description": ""}],
  "certifications": [{"name": "", "issuer": "", "year": "","score":""}],
  "summary": ""
}

CV Content:
${cvText}

Return ONLY JSON, no markdown, no explanation.`;

            const result1 = await generativeModel.generateContent(prompt1);
            const response1 = result1.response.text();

            // Turn 2: Verification và correction
            const prompt2 = `Review this JSON extraction from a CV. Fix any errors in dates, emails, phone numbers. Return ONLY the corrected JSON without any explanation.

Previous extraction:
${response1}

Return corrected JSON only:`;

            const result2 = await generativeModel.generateContent(prompt2);
            const response2 = result2.response.text();

            return this.extractJsonFromResponse(response2);

        } catch (error: any) {
            this.logger.error('Gemini API Error:', error);
            throw new HttpException(
                `Gemini API Error: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async extractTextFromImage(base64Image: string, retryCount = 0): Promise<string> {


        try {
            this.logger.log(`OCR with model: ${this.model} (attempt ${retryCount + 1})`);

            const model = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: { temperature: 0 }
            });

            const result = await model.generateContent([
                'Extract all text from this CV image. Return only the extracted text without any explanation or formatting.',
                {
                    inlineData: {
                        mimeType: 'image/png',
                        data: base64Image
                    }
                }
            ]);

            return result.response.text();

        } catch (error: any) {
            // Retry nếu lỗi 503/429
            if ((error.status === 503 || error.status === 429) && retryCount < 2) {
                this.logger.warn(`${this.model} OCR overloaded, waiting 2s and retrying...`);
                await this.delay(2000);
                return this.extractTextFromImage(base64Image, retryCount + 1);
            }

            throw error;
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private extractJsonFromResponse(text: string): any {
        try {
            return JSON.parse(text);
        } catch {
            const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }
            const objectMatch = text.match(/\{[\s\S]*\}/);
            if (objectMatch) {
                return JSON.parse(objectMatch[0]);
            }
            throw new Error('Cannot extract JSON from response');
        }
    }
}