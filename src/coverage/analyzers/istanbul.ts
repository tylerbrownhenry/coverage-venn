import { CoverageMap, CoverageSummary } from 'istanbul-lib-coverage';
import * as path from 'path';

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

export class IstanbulCoverageAnalyzer implements IstanbulAnalyzer {
  constructor(
    private componentPatterns: RegExp[] = [/.*\/(components|containers)\/.*\.(tsx|jsx)$/],
    private excludePatterns: RegExp[] = [/.*\/__tests__\/.*/, /.*\.test\.(tsx|jsx|ts|js)$/]
  ) {}

  async analyze(coverageMap: CoverageMap): Promise<ComponentCoverage[]> {
    if (!coverageMap) {
      console.warn('No coverage map provided to IstanbulCoverageAnalyzer');
      return [];
    }

    const result: ComponentCoverage[] = [];

    for (const filePath of coverageMap.files()) {
      // Skip files that match exclude patterns
      if (this.excludePatterns.some(pattern => pattern.test(filePath))) {
        continue;
      }
      
      // Only include files that match component patterns (if specified)
      if (this.componentPatterns.length > 0 && 
          !this.componentPatterns.some(pattern => pattern.test(filePath))) {
        continue;
      }

      const coverage = coverageMap.fileCoverageFor(filePath);
      const summary = coverage.toSummary();
      
      // Calculate overall coverage as an average of all metrics
      const overallCoverage = this.calculateOverallCoverage(summary);
      
      result.push({
        path: filePath,
        coverage: overallCoverage,
        statements: summary.statements.pct,
        branches: summary.branches.pct,
        functions: summary.functions.pct,
        lines: summary.lines.pct
      });
    }

    // Sort by path for consistent results
    return result.sort((a, b) => a.path.localeCompare(b.path));
  }

  // Calculate overall coverage as an average of all metrics
  private calculateOverallCoverage(summary: CoverageSummary): number {
    const metrics = [
      summary.statements.pct,
      summary.branches.pct,
      summary.functions.pct,
      summary.lines.pct
    ];
    
    const validMetrics = metrics.filter(m => !isNaN(m) && m !== undefined);
    if (validMetrics.length === 0) return 0;
    
    const sum = validMetrics.reduce((acc, val) => acc + val, 0);
    return sum / validMetrics.length;
  }

  // Helper method to filter and normalize paths
  private normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/');
  }
}
