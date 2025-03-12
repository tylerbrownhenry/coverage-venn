import { IstanbulCoverageAnalyzer } from '../istanbul';

describe('IstanbulCoverageAnalyzer', () => {
  let analyzer: IstanbulCoverageAnalyzer;

  beforeEach(() => {
    analyzer = new IstanbulCoverageAnalyzer();
  });

  it('should analyze coverage data', async () => {
    // Create a proper mock for CoverageMap
    const coverageMap = {
      files: () => ['src/components/Button.tsx'],
      fileCoverageFor: (filePath: string) => ({
        toSummary: () => ({
          statements: { pct: 80, covered: 80, total: 100 },
          branches: { pct: 70, covered: 70, total: 100 },
          functions: { pct: 90, covered: 9, total: 10 },
          lines: { pct: 85, covered: 85, total: 100 }
        })
      })
    };

    const result = await analyzer.analyze(coverageMap as any);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].path).toBe('src/components/Button.tsx');
    expect(result[0].statements).toBe(80);
    expect(result[0].branches).toBe(70);
  });
});
