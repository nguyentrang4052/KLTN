import { IsOptional, IsString } from 'class-validator';

export class QueryIndustriesDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
