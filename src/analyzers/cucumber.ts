import { FeatureFile } from '../types';

export interface CucumberAnalyzer {
  analyze(featureFiles: FeatureFile[]): Promise<ComponentCoverage[]>;
}

export interface ComponentCoverage {
  component: string;
  scenarios: number;
  steps: number;
  tags: string[];
}

export class CucumberCoverageAnalyzer implements CucumberAnalyzer {
  async analyze(featureFiles: FeatureFile[]): Promise<ComponentCoverage[]> {
    return [];
  }
}
