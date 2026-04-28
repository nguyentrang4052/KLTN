import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export enum ChatRole {
    user = "user",
    assistant = "assistant",
}

export class SaveMessageDto {

    @IsNumber()
    sessionID!: number;

    @IsEnum(ChatRole)
    role!: ChatRole;

    @IsString()
    content!: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    metadata?: Record<string, any>;
}