// Auto-generated project configuration
export interface ProjectConfig {
  excludeTestPatterns: string[];
  customMappings: Record<string, string[]>;
  confidenceThreshold: number;
}

export const projectConfigs: Record<string, ProjectConfig> = {
  "jogger": {
    "excludeTestPatterns": [
      "__mocks__/**",
      "**/*.mock.*",
      "**/mock-*/**",
      "**/App.test.tsx",
      "__mocks__/src/__tests__/App.test.tsx"
    ],
    "customMappings": {
      "src/contexts/MachineContext.tsx": []
    },
    "confidenceThreshold": 0.7
  },
  "default": {
    "excludeTestPatterns": [],
    "customMappings": {},
    "confidenceThreshold": 0.6
  }
};

export function getProjectConfig(projectName: string): ProjectConfig {
  return projectConfigs[projectName] || projectConfigs.default;
}
