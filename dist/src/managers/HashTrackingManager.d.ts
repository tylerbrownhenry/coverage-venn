interface FileHash {
    path: string;
    hash: string;
    lastUpdated: Date;
    relatedComponents: string[];
}
export declare class HashTrackingManager {
    private hashStore;
    private storePath;
    constructor(storePath?: string);
    trackFile(filePath: string, relatedComponents?: string[]): Promise<FileHash>;
    hasFileChanged(filePath: string): Promise<boolean>;
    getChangedFiles(): Promise<FileHash[]>;
    private persistStore;
    private loadStore;
}
export {};
