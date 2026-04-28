import { IsOptional, IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class PersonalInfoDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    linkedin?: string;

    @IsOptional()
    @IsString()
    portfolio?: string;
}

class ExperienceDto {
    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsString()
    duration?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

class SkillDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    items?: string;
}

export class MapFromLocalCvDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PersonalInfoDto)
    personalInfo?: PersonalInfoDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExperienceDto)
    experiences?: ExperienceDto[];

    @IsOptional()
    @IsArray()
    education?: any[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SkillDto)
    skills?: (string | SkillDto)[];

    @IsOptional()
    @IsString()
    summary?: string;
}