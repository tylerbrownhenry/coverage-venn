import { FileHasher } from '../../shared/utils/FileHasher';
import * as path from 'path';
import * as fs from 'fs/promises';

interface FileHash {
  path: string;
  hash: string;
  lastUpdated: Date;
  relatedComponents: string[];
}

export class HashTrackingManager {
  private hashStore: Map<string, FileHash> = new Map();
  private storePath: string;

  constructor(storePath: string = '.hash-store.json') {
    this.storePath = storePath;
  }

  async trackFile(filePath: string, relatedComponents: string[] = []): Promise<FileHash> {
    const hash = await FileHasher.hashFile(filePath);
    const fileHash: FileHash = {
      path: filePath,
      hash,
      lastUpdated: new Date(),
      relatedComponents
    };

    this.hashStore.set(filePath, fileHash);
    await this.persistStore();
    return fileHash;
  }

  async hasFileChanged(filePath: string): Promise<boolean> {
    const currentHash = await FileHasher.hashFile(filePath);
    const storedHash = this.hashStore.get(filePath);
    return !storedHash || storedHash.hash !== currentHash;
  }

  async getChangedFiles(): Promise<FileHash[]> {
    const changedFiles: FileHash[] = [];
    
    for (const [filePath, stored] of this.hashStore) {
      if (await this.hasFileChanged(filePath)) {
        changedFiles.push(stored);
      }
    }

    return changedFiles;
  }

  private async persistStore(): Promise<void> {
    const storeData = JSON.stringify(Array.from(this.hashStore.entries()), null, 2);
    await fs.writeFile(this.storePath, storeData);
  }

  private async loadStore(): Promise<void> {
    try {
      const data = await fs.readFile(this.storePath, 'utf-8');
      this.hashStore = new Map(JSON.parse(data));
    } catch (error) {
      this.hashStore = new Map();
    }
  }
}
