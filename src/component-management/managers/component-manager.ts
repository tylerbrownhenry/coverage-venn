import { ComponentHierarchyScanner } from '../scanners/ComponentHierarchyScanner';
import { HashTrackingManager } from './HashTrackingManager';
import { TagManager } from '../../shared/tags/TagManager';
import { getConfig } from '../../core/config';

export interface ComponentManager {
  scanHierarchy(): Promise<Map<string, ComponentNode>>;
}

export interface ComponentNode {
  path: string;
  children: string[];
  testIds: string[];
  name: string;
}

export class ComponentHierarchyManager implements ComponentManager {
  private scanner: ComponentHierarchyScanner;
  private hashTracker: HashTrackingManager;
  private tagManager: TagManager;
  private config: any;

  constructor() {
    console.log('Initializing ComponentHierarchyManager');
    const config = getConfig('manager', {
      required: false,
      configPath: process.env.MANAGER_CONFIG_PATH
    });
    
    // Ensure browserStack config exists with default values
    const browserStackConfig = config.browserStack || { enabled: false };
    
    this.scanner = new ComponentHierarchyScanner();
    this.hashTracker = new HashTrackingManager(config.tracking?.hashStoreFile || '.hash-store.json');
    this.tagManager = new TagManager(config.tracking?.tagStoreFile || '.tag-store.json');
    this.config = config || {};
  }

  async scanHierarchy(): Promise<Map<string, ComponentNode>> {
    console.log('Scanning hierarchy');
    // Use a default rootDir if not specified in config
    const rootDir = this.config?.rootDir || 'src/components';
    console.log('Scanning directory:', rootDir);
    const hierarchy = await this.scanner.scanDirectory(rootDir);
    await this.trackComponentFiles(hierarchy);
    await this.processHierarchy(hierarchy);
    return hierarchy;
  }

  private async trackComponentFiles(hierarchy: Map<string, any>): Promise<void> {
    console.log('Tracking component files:', hierarchy);
    for (const [name, component] of hierarchy) {
      await this.hashTracker.trackFile(component.path, [name]);
    }
  }

  private async processHierarchy(hierarchy: Map<string, ComponentNode>): Promise<void> {
    console.log('Processing hierarchy:', hierarchy);
    await this.tagManager.loadTags();


    for (const [name, component] of hierarchy) {
      await this.tagManager.registerTag({
        name: `@root_${name.toLowerCase()}`,
        components: [component.path],
        relationships: component.children.map((childName: string) => 
          `@root_${childName.toLowerCase()}`
        ),
        category: 'component',
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }
  }
} 