import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryJobsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) return value as string[];
    return value ? [String(value)] : [];
  })
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  industryId?: number;

  @IsOptional()
  @IsIn(['match', 'newest', 'salary', 'deadline'])
  sort?: string = 'newest';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 9;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMax?: number;
}
