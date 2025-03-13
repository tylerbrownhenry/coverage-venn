import { BrowserStackConfig } from '../services/BrowserStackService';
import { ComponentCoverage } from '../types';
export declare class BrowserStackManager {
    private service;
    private metadataService;
    constructor(config: Partial<BrowserStackConfig>, baseDir: string);
    syncTestResults(coverage: ComponentCoverage[]): Promise<void>;
    updateSessionMetadata(sessionId: string, coverage: ComponentCoverage): Promise<void>;
}
