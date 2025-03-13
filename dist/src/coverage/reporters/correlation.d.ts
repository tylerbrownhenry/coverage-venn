export interface CorrelationReport {
    components: string[];
    steps: string[];
    relationships: Map<string, Set<string>>;
}
export declare class CorrelationReporter {
    generateReport(): Promise<CorrelationReport>;
}
