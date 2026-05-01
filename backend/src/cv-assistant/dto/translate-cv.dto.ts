import { IsEnum, IsObject, IsOptional } from 'class-validator';

export class TranslateCVDto {
  @IsEnum(['en', 'vi'])
  targetLang!: 'en' | 'vi';

  @IsObject()
  cvData: any; // cấu trúc giống CVAnalysisResultDto

   @IsOptional()
  @IsObject()
  sectionTitles?: Record<string, string>;
}
