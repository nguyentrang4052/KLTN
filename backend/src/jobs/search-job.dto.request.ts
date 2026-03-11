import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchJobRequestDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  industryID?: number;

  @IsOptional()
  @IsArray()
  skillIDs?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  experienceYear?: number;

  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit: number = 10;
}