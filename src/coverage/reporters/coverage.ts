import * as fs from 'fs/promises';
import * as path from 'path';
import { ComponentCoverage } from '../types';
import { generateHtmlReport } from './templates/html';

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

export class CoverageReportGenerator implements CoverageReporter {
  constructor(private outputDir: string = 'coverage') {}

  async generateReport(coverage: ComponentCoverage[]): Promise<Report> {
    const summary = this.calculateSummary(coverage);
    const report: Report = {
      summary,
      components: this.sortComponents(coverage),
      timestamp: new Date().toISOString(),
      metadata: await this.getMetadata()
    };

    await this.saveReport(report);
    return report;
  }

  private calculateSummary(components: ComponentCoverage[]): Report['summary'] {
    const total = components.length;
    const covered = components.filter(c => 
      Object.values(c.coverage).every((v: number | undefined) => v !== undefined && v > 0)
    ).length;

    return {
      total,
      covered,
      percentage: (covered / total) * 100
    };
  }

  private sortComponents(components: ComponentCoverage[]): ComponentCoverage[] {
    return [...components].sort((a, b) => {
      // Sort by coverage percentage descending
      const aAvg = this.getAverageCoverage(a);
      const bAvg = this.getAverageCoverage(b);
      return bAvg - aAvg;
    });
  }

  private getAverageCoverage(component: ComponentCoverage): number {
    const values = Object.values(component.coverage).filter((v): v is number => v !== undefined);
    if (values.length === 0) return 0;
    return values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
  }

  private async getMetadata(): Promise<Report['metadata']> {
    try {
      return {
        branch: process.env.GIT_BRANCH,
        commit: process.env.GIT_COMMIT,
        buildId: process.env.BUILD_ID
      };
    } catch {
      return {};
    }
  }

  private async saveReport(report: Report): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Save JSON report
    await fs.writeFile(
      path.join(this.outputDir, 'coverage.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate and save HTML report
    const html = generateHtmlReport(report);
    await fs.writeFile(
      path.join(this.outputDir, 'coverage.html'),
      html
    );
  }
}
