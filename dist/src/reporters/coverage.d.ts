import { ComponentCoverage } from '../types';
export interface CoverageReporter {
    generateReport(coverage: ComponentCoverage[]): Promise<Report>;
}
export interface Report {
    summary: {
        total: number;
        covered: number;
        percentage: number;
    };
    components: ComponentCoverage[];
    timestamp: string;
    metadata: {
        branch?: string;
        commit?: string;
        buildId?: string;
    };
}
export declare class CoverageReportGenerator implements CoverageReporter {
    private outputDir;
    constructor(outputDir?: string);
    generateReport(coverage: ComponentCoverage[]): Promise<Report>;
    private calculateSummary;
    private sortComponents;
    private getAverageCoverage;
    private getMetadata;
    private saveReport;
}
