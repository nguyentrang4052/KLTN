// src/cv-analyzer/pdf-to-image.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { pdf } from 'pdf-to-img';

@Injectable()
export class PdfToImageService {
    private readonly logger = new Logger(PdfToImageService.name);

    async convert(pdfBuffer: Buffer): Promise<Buffer[]> {
        this.logger.log('Converting PDF to images...');

        try {
            const document = await pdf(pdfBuffer, { 
                scale: 2.0, // 2x DPI
            });

            const images: Buffer[] = [];
            let pageNum = 0;

            for await (const image of document) {
                pageNum++;
                images.push(image);
                this.logger.log(`Page ${pageNum}: ${(image.length / 1024).toFixed(1)} KB`);
            }

            this.logger.log(`PDF converted to ${images.length} image(s)`);
            return images;

        } catch (error: any) {
            this.logger.error('PDF conversion failed:', error.message);
            throw error;
        }
    }
}