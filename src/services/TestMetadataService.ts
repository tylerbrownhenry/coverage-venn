import * as fs from 'fs/promises';
import * as path from 'path';

export interface TestMetadata {
  id: string;
  name: string;
  components: string[];
  tags: string[];
  lastRun?: Date;
  duration?: number;
  browserstack?: {
    sessionId: string;
    buildId: string;
  };
  coverage?: {
    components: Record<string, number>;
    timestamp: string;
  };
}

export class TestMetadataService {
  private metadataPath: string;
  private metadata: Map<string, TestMetadata> = new Map();

  constructor(baseDir: string) {
    this.metadataPath = path.join(baseDir, '.test-metadata.json');
  }

  async loadMetadata(): Promise<void> {
    try {
      const data = await fs.readFile(this.metadataPath, 'utf-8');
      this.metadata = new Map(JSON.parse(data));
    } catch {
      this.metadata = new Map();
    }
  }

  async saveMetadata(): Promise<void> {
    const data = JSON.stringify(Array.from(this.metadata.entries()), null, 2);
    await fs.writeFile(this.metadataPath, data);
  }

  async updateTestMetadata(id: string, metadata: Partial<TestMetadata>): Promise<void> {
    const defaultMetadata: TestMetadata = {
      id,
      name: id,
      components: [],
      tags: []
    };

    const existing = this.metadata.get(id) || defaultMetadata;
    const updated = {
      ...existing,
      ...metadata,
      // Ensure required properties are always defined
      id: metadata.id || existing.id,
      name: metadata.name || existing.name,
      components: metadata.components || existing.components,
      tags: metadata.tags || existing.tags
    } satisfies TestMetadata;

    this.metadata.set(id, updated);
    await this.saveMetadata();
  }

  async getTestMetadata(id: string): Promise<TestMetadata | undefined> {
    return this.metadata.get(id);
  }
}
