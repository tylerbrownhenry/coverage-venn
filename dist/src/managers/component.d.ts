export interface ComponentManager {
    scanHierarchy(): Promise<Map<string, ComponentNode>>;
    trackChanges(): Promise<void>;
    validateTags(): Promise<void>;
}
export interface ComponentNode {
    path: string;
    children: string[];
    testIds: string[];
    name: string;
}
export declare class ComponentHierarchyManager implements ComponentManager {
    private scanner;
    private hashTracker;
    private browserStackManager;
    private tagManager;
    private coverageReporter;
    private config;
    constructor();
    scanHierarchy(): Promise<Map<string, ComponentNode>>;
    private trackComponentFiles;
    private processHierarchy;
    trackChanges(): Promise<void>;
    validateTags(): Promise<void>;
}
