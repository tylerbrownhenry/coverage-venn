export interface ComponentNode {
    name: string;
    path: string;
    children: string[];
    parents: string[];
    imports: string[];
    testIds: string[];
}
export declare class ComponentHierarchyScanner {
    private componentMap;
    private validator;
    private config;
    constructor();
    scanDirectory(rootDir: string): Promise<Map<string, ComponentNode>>;
    private findComponentFiles;
    private isComponentFile;
    private analyzeComponent;
    private buildRelationships;
    private isCustomComponent;
}
