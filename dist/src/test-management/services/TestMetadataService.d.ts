export interface TestMetadata {
    id: string;
    name: string;
    components: string[];
    tags: string[];
    lastRun?: Date;
    duration?: number;
    browserstack?: {
        sessionId: string;
        buildId: string;
    };
    coverage?: {
        components: Record<string, number>;
        timestamp: string;
    };
}
export declare class TestMetadataService {
    private metadataPath;
    private metadata;
    constructor(baseDir: string);
    loadMetadata(): Promise<void>;
    saveMetadata(): Promise<void>;
    updateTestMetadata(id: string, metadata: Partial<TestMetadata>): Promise<void>;
    getTestMetadata(id: string): Promise<TestMetadata | undefined>;
}
