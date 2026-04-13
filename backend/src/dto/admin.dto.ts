import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIndustryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên lĩnh vực không được để trống.' })
  name: string;
}

export class UpdateIndustryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên lĩnh vực không được để trống.' })
  name: string;
}

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên kỹ năng không được để trống.' })
  name: string;

  @Type(() => Number)
  @IsNumber()
  industryId: number;
}

export class UpdateSkillDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên kỹ năng không được để trống.' })
  name: string;

  @Type(() => Number)
  @IsNumber()
  industryId: number;
}

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên gói không được để trống.' })
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  yearlyPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dailyJobSuggestions: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cvAnalysis: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  compatibilityCheck: number;
}

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  yearlyPrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dailyJobSuggestions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cvAnalysis?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  compatibilityCheck?: number;
}
