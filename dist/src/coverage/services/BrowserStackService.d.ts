export interface BrowserStackConfig {
    enabled: boolean;
    username: string;
    accessKey: string;
    projectName: string;
}
export interface BrowserStackSession {
    id: string;
    name: string;
    status: 'passed' | 'failed';
    browser: string;
    duration: number;
    tags: string[];
    buildId: string;
    build_id?: string;
}
export declare class BrowserStackService {
    private config;
    private baseUrl;
    private auth;
    constructor(config: BrowserStackConfig);
    getSessions(): Promise<BrowserStackSession[]>;
    updateSession(sessionId: string, data: Partial<BrowserStackSession>): Promise<void>;
    addTags(sessionId: string, tags: string[]): Promise<void>;
    private request;
}
