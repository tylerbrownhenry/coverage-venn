import { CoverageMap } from 'istanbul-lib-coverage';
export interface IstanbulAnalyzer {
    analyze(coverageMap: CoverageMap): Promise<ComponentCoverage[]>;
}
export interface ComponentCoverage {
    path: string;
    coverage: number;
    statements: number;
    branches: number;
    functions?: number;
    lines?: number;
}
export declare class IstanbulCoverageAnalyzer implements IstanbulAnalyzer {
    private componentPatterns;
    private excludePatterns;
    constructor(componentPatterns?: RegExp[], excludePatterns?: RegExp[]);
    analyze(coverageMap: CoverageMap): Promise<ComponentCoverage[]>;
    private calculateOverallCoverage;
    private normalizePath;
}
