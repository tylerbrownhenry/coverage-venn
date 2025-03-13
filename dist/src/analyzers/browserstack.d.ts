export interface BrowserStackAnalyzer {
    analyze(sessionIds: string[]): Promise<TestCoverage[]>;
}
export interface TestCoverage {
    sessionId: string;
    components: string[];
    duration: number;
    status: 'passed' | 'failed';
}
export declare class BrowserStackTestAnalyzer implements BrowserStackAnalyzer {
    analyze(sessionIds: string[]): Promise<TestCoverage[]>;
}
