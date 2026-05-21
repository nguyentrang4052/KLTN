"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileConverterUtil = void 0;
const sharp_1 = __importDefault(require("sharp"));
const PDFParser = require('pdf2json');
class FileConverterUtil {
    static async convertFile(filePath, mimetype) {
        if (mimetype === 'application/pdf') {
            const text = await this.extractTextFromPDF(filePath);
            console.log('PDF text extracted, length:', text.length);
            console.log('First 500 chars:', text.substring(0, 500));
            if (!text || text.trim().length === 0) {
                throw new Error('PDF appears to be a scanned image without text. Please use a text-based PDF or convert to PNG/JPG first.');
            }
            return {
                type: 'text',
                content: text,
                mimeType: 'text/plain',
            };
        }
        else if (mimetype.startsWith('image/')) {
            const imageBuffer = await (0, sharp_1.default)(filePath)
                .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
                .png()
                .toBuffer();
            return {
                type: 'image',
                content: imageBuffer.toString('base64'),
                mimeType: 'image/png',
            };
        }
        else {
            throw new Error('Unsupported file type. Only PDF, PNG, JPG allowed.');
        }
    }
    static extractTextFromPDF(filePath) {
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();
            pdfParser.on('pdfParser_dataError', (errData) => {
                reject(new Error(errData.parserError || 'PDF parse error'));
            });
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
                try {
                    let text = '';
                    if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
                        for (const page of pdfData.Pages) {
                            if (page.Texts && Array.isArray(page.Texts)) {
                                for (const textItem of page.Texts) {
                                    if (textItem.R && Array.isArray(textItem.R)) {
                                        for (const r of textItem.R) {
                                            const decoded = decodeURIComponent(r.T || '');
                                            text += decoded + ' ';
                                        }
                                    }
                                }
                                text += '\n';
                            }
                        }
                    }
                    console.log('Extracted text length:', text.length);
                    resolve(text.trim());
                }
                catch (e) {
                    reject(e);
                }
            });
            pdfParser.loadPDF(filePath);
        });
    }
}
exports.FileConverterUtil = FileConverterUtil;
//# sourceMappingURL=file-converter.util.js.map