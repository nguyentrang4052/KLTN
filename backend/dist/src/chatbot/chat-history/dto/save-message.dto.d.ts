export declare enum ChatRole {
    user = "user",
    assistant = "assistant"
}
export declare class SaveMessageDto {
    sessionID: number;
    role: ChatRole;
    content: string;
    type?: string;
    metadata?: Record<string, any>;
}
