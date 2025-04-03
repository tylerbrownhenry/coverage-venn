import * as fs from 'fs/promises';
import * as path from 'path';

interface Tag {
  name: string;
  components: string[];
  relationships: string[];
  category: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

export class TagManager {
  private tagStorePath: string;
  private tags: Map<string, Tag>;

  constructor(tagStorePath: string) {
    this.tagStorePath = tagStorePath;
    this.tags = new Map();
  }

  async loadTags(): Promise<void> {
    try {
      // In a real implementation, we would load from this.tagStorePath
      console.log('Loading tags from:', this.tagStorePath);
    } catch (error) {
      console.error('Failed to load tags:', error);
      // Initialize with empty map if file doesn't exist
      this.tags = new Map();
    }
  }

  async registerTag(tag: Tag): Promise<void> {
    this.tags.set(tag.name, tag);
    await this.saveTags();
  }

  async saveTags(): Promise<void> {
    try {
      // In a real implementation, we would save to this.tagStorePath
      console.log('Saving tags to:', this.tagStorePath);
    } catch (error) {
      console.error('Failed to save tags:', error);
    }
  }

  getTag(name: string): Tag | undefined {
    return this.tags.get(name);
  }

  getAllTags(): Tag[] {
    return Array.from(this.tags.values());
  }

  getTagsByComponent(componentPath: string): Tag[] {
    return Array.from(this.tags.values())
      .filter(tag => tag.components.includes(componentPath));
  }

  async updateRelationships(tagName: string, relationships: string[]): Promise<void> {
    const tag = this.tags.get(tagName);
    if (!tag) throw new Error(`Tag ${tagName} not found`);

    tag.relationships = relationships;
    tag.metadata.updatedAt = new Date().toISOString();
    await this.saveTags();
  }

  getRelatedTags(tagName: string): Tag[] {
    const tag = this.tags.get(tagName);
    if (!tag) return [];

    return Array.from(this.tags.values())
      .filter(t => tag.relationships.includes(t.name));
  }

  private validateTag(tag: Tag): void {
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
