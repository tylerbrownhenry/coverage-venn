export interface ProjectConfig {
    excludeTestPatterns: string[];
    customMappings: Record<string, string[]>;
    confidenceThreshold: number;
}
export declare const projectConfigs: Record<string, ProjectConfig>;
export declare function getProjectConfig(projectName: string): ProjectConfig;
