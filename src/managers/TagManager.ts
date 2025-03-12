import * as fs from 'fs/promises';
import * as path from 'path';

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

export class TagManager {
  private tags: Map<string, TagDefinition> = new Map();
  private readonly tagStorePath: string;

  constructor(baseDir: string) {
    this.tagStorePath = path.join(baseDir, '.tag-store.json');
  }

  async loadTags(): Promise<void> {
    try {
      const data = await fs.readFile(this.tagStorePath, 'utf-8');
      this.tags = new Map(JSON.parse(data));
    } catch {
      this.tags = new Map();
    }
  }

  async saveTags(): Promise<void> {
    const data = JSON.stringify(Array.from(this.tags.entries()), null, 2);
    await fs.writeFile(this.tagStorePath, data);
  }

  async registerTag(tag: TagDefinition): Promise<void> {
    this.validateTag(tag);
    this.tags.set(tag.name, {
      ...tag,
      metadata: {
        ...tag.metadata,
        updatedAt: new Date().toISOString()
      }
    });
    await this.saveTags();
  }

  async updateRelationships(tagName: string, relationships: string[]): Promise<void> {
    const tag = this.tags.get(tagName);
    if (!tag) throw new Error(`Tag ${tagName} not found`);

    tag.relationships = relationships;
    tag.metadata.updatedAt = new Date().toISOString();
    await this.saveTags();
  }

  async getTagsByComponent(componentPath: string): Promise<TagDefinition[]> {
    return Array.from(this.tags.values())
      .filter(tag => tag.components.includes(componentPath));
  }

  async getRelatedTags(tagName: string): Promise<TagDefinition[]> {
    const tag = this.tags.get(tagName);
    if (!tag) return [];

    return Array.from(this.tags.values())
      .filter(t => tag.relationships.includes(t.name));
  }

  private validateTag(tag: TagDefinition): void {
    if (!tag.name.startsWith('@')) {
      throw new Error('Tag name must start with @');
    }

    if (!/^@[a-z_]+/.test(tag.name)) {
      throw new Error('Tag name must use lowercase and underscores');
    }

    if (tag.components.length === 0) {
      throw new Error('Tag must be associated with at least one component');
    }
  }
}
