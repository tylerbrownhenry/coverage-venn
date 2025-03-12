export interface RuntimeAnalyzer {
  analyze(logs: ComponentCall[]): Promise<RuntimeCoverage[]>;
}

export interface ComponentCall {
  componentId: string;
  timestamp: number;
  testContext?: string;
}

export interface RuntimeCoverage {
  component: string;
  renders: number;
  testContexts: string[];
}

export class RuntimeUsageAnalyzer implements RuntimeAnalyzer {
  async analyze(logs: ComponentCall[]): Promise<RuntimeCoverage[]> {
    return [];
  }
}
