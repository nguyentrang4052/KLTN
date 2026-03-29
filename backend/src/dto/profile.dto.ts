import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsInt() @Type(() => Number) birthYear?: number;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() address?: string;
}

export class UpdateUserProfileDto {
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsString() experienceYear?: string;
  @IsOptional() @IsString() careerLevel?: string;
  @IsOptional() @IsString() expectedSalary?: string;
  @IsOptional() @IsString() workingType?: string;
  @IsOptional() @IsInt() @Type(() => Number) industryId?: number;
}
