export interface FeatureFile {
  path: string;
  content: string;
  tags: string[];
  scenarios: Scenario[];
}

export interface Scenario {
  name: string;
  tags: string[];
  steps: string[];
}

export interface ComponentCoverage {
  path: string;
  coverage: {
    unit: number;
    e2e: number;
    visual: number;
    runtime: number;
  };
  testIds: string[];
  tags: string[];
}
