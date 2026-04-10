/* eslint-disable @typescript-eslint/no-var-requires */
import sharp from 'sharp';
import * as fs from 'fs/promises';
const PDFParser = require('pdf2json');

export interface FileConverterResult {
    type: 'image' | 'text';
    content: string;
    mimeType: string;
}

export class FileConverterUtil {
    static async convertFile(
        filePath: string,
        mimetype: string,
    ): Promise<FileConverterResult> {
        if (mimetype === 'application/pdf') {
            // Dùng pdf2json để extract text
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
            const imageBuffer = await sharp(filePath)
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

    private static extractTextFromPDF(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();

            pdfParser.on('pdfParser_dataError', (errData: any) => {
                reject(new Error(errData.parserError || 'PDF parse error'));
            });

            pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
                try {
                    let text = '';

                    // Parse từng page và text items
                    if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
                        for (const page of pdfData.Pages) {
                            if (page.Texts && Array.isArray(page.Texts)) {
                                for (const textItem of page.Texts) {
                                    if (textItem.R && Array.isArray(textItem.R)) {
                                        for (const r of textItem.R) {
                                            // Decode URI component vì text được encode
                                            const decoded = decodeURIComponent(r.T || '');
                                            text += decoded + ' ';
                                        }
                                    }
                                }
                                text += '\n'; // Xuống dòng sau mỗi page
                            }
                        }
                    }

                    console.log('Extracted text length:', text.length);
                    resolve(text.trim());
                } catch (e) {
                    reject(e);
                }
            });

            pdfParser.loadPDF(filePath);
        });
    }
}