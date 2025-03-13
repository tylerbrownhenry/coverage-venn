export interface TagDefinition {
    name: string;
    components: string[];
    relationships: string[];
    category: 'component' | 'feature' | 'test' | 'custom';
    metadata: {
        description?: string;
        deprecated?: boolean;
        createdAt: string;
        updatedAt: string;
    };
}
export declare class TagManager {
    private tags;
    private readonly tagStorePath;
    constructor(baseDir: string);
    loadTags(): Promise<void>;
    saveTags(): Promise<void>;
    registerTag(tag: TagDefinition): Promise<void>;
    updateRelationships(tagName: string, relationships: string[]): Promise<void>;
    getTagsByComponent(componentPath: string): Promise<TagDefinition[]>;
    getRelatedTags(tagName: string): Promise<TagDefinition[]>;
    private validateTag;
}
