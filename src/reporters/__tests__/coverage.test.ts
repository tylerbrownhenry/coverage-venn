import { CoverageReportGenerator } from '../coverage';
import { ComponentCoverage } from '../../types';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('CoverageReportGenerator', () => {
  let generator: CoverageReportGenerator;

  beforeEach(() => {
    generator = new CoverageReportGenerator('test-coverage');
    jest.resetAllMocks();
  });

  it('should generate coverage report', async () => {
    const mockCoverage: ComponentCoverage[] = [
      {
        path: 'src/components/Button.tsx',
        coverage: {
          unit: 80,
          e2e: 60,
          visual: 100,
          runtime: 75
        },
        testIds: ['root_button'],
        tags: ['@root_button']
      }
    ];

    const report = await generator.generateReport(mockCoverage);

    expect(report.summary.total).toBe(1);
    expect(report.summary.covered).toBe(1);
    expect(report.components).toHaveLength(1);
    expect(fs.writeFile).toHaveBeenCalledTimes(2); // JSON and HTML
  });
});
