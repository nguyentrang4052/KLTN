import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GeminiService } from '../gemini/gemini.service';
import { TranslateCVDto } from './dto/translate-cv.dto';
import { SuggestCVDto } from './dto/suggest-cv.dto';

@Controller('cv-assistant')
@UseGuards(JwtAuthGuard)
export class CvAssistantController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('translate')
  async translateCV(@Body() dto: TranslateCVDto) {
    const translated = await this.geminiService.translateCV(dto.cvData, dto.targetLang, dto.sectionTitles);
    return { success: true, data: translated };
  }

  @Post('suggest')
  async suggestImprovements(@Body() dto: SuggestCVDto, @Request() req) {
    // Lưu ý: cần lấy CV data hiện tại của user? Ở đây client gửi lên toàn bộ cvData.
    // Nếu muốn bảo mật hơn, có thể lưu CV trong DB và chỉ gửi id.
    const { cvData, prompt, section } = dto;
    const suggestions = await this.geminiService.suggestCVImprovements(cvData, prompt, section);
    return { success: true, data: suggestions };
  }
}