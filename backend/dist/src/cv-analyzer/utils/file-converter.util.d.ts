export interface FileConverterResult {
    type: 'image' | 'text';
    content: string;
    mimeType: string;
}
export declare class FileConverterUtil {
    static convertFile(filePath: string, mimetype: string): Promise<FileConverterResult>;
    private static extractTextFromPDF;
}
