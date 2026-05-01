import { IsObject, IsOptional, IsString } from 'class-validator';

export class SuggestCVDto {
    @IsString()
    prompt!: string;

    @IsOptional()
    @IsString()
    section?: string; // 'summary' | 'skills' | 'experiences' | 'education' ...

    @IsObject()
    cvData: any;
}