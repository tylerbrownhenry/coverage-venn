export declare class FileHasher {
    static hashFile(filePath: string): Promise<string>;
    static hashContent(content: string): Promise<string>;
}
