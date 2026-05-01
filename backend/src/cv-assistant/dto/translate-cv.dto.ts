import { IsEnum, IsObject } from 'class-validator';

export class TranslateCVDto {
  @IsEnum(['en', 'vi'])
  targetLang!: 'en' | 'vi';

  @IsObject()
  cvData: any; // cấu trúc giống CVAnalysisResultDto
}
