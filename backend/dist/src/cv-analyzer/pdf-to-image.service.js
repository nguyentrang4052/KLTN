"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PdfToImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfToImageService = void 0;
const common_1 = require("@nestjs/common");
const pdf_to_img_1 = require("pdf-to-img");
let PdfToImageService = PdfToImageService_1 = class PdfToImageService {
    logger = new common_1.Logger(PdfToImageService_1.name);
    async convert(pdfBuffer) {
        this.logger.log('Converting PDF to images...');
        try {
            const document = await (0, pdf_to_img_1.pdf)(pdfBuffer, {
                scale: 2.0,
            });
            const images = [];
            let pageNum = 0;
            for await (const image of document) {
                pageNum++;
                images.push(image);
                this.logger.log(`Page ${pageNum}: ${(image.length / 1024).toFixed(1)} KB`);
            }
            this.logger.log(`PDF converted to ${images.length} image(s)`);
            return images;
        }
        catch (error) {
            this.logger.error('PDF conversion failed:', error.message);
            throw error;
        }
    }
};
exports.PdfToImageService = PdfToImageService;
exports.PdfToImageService = PdfToImageService = PdfToImageService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfToImageService);
//# sourceMappingURL=pdf-to-image.service.js.map