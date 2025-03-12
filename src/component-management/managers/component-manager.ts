import { ComponentHierarchyScanner } from '../scanners/ComponentHierarchyScanner';
import { HashTrackingManager } from './HashTrackingManager';
import { BrowserStackManager } from '../../coverage/services/BrowserStackManager';
import { TagManager } from '../../shared/tags/TagManager';
import { CoverageReportGenerator } from '../../coverage/reporters/coverage';
import { ComponentCoverage as CoreComponentCoverage } from '../../core/types';
import { ComponentCoverage } from '../../coverage/types';
import { getConfig } from '../../core/config';

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

export class ComponentHierarchyManager implements ComponentManager {
  private scanner: ComponentHierarchyScanner;
  private hashTracker: HashTrackingManager;
  private browserStackManager: BrowserStackManager;
  private tagManager: TagManager;
  private coverageReporter: CoverageReportGenerator;
  private config: any;

  constructor() {
    const config = getConfig('manager', {
      required: false,
      configPath: process.env.MANAGER_CONFIG_PATH
    });
    
    // Ensure browserStack config exists with default values
    const browserStackConfig = config.browserStack || { enabled: false };
    
    this.scanner = new ComponentHierarchyScanner();
    this.hashTracker = new HashTrackingManager(config.tracking?.hashStoreFile || '.hash-store.json');
    this.tagManager = new TagManager(config.tracking?.tagStoreFile || '.tag-store.json');
    this.browserStackManager = new BrowserStackManager(browserStackConfig, config.baseDir || '.');
    this.coverageReporter = new CoverageReportGenerator(config.coverage?.reportDir || 'coverage');
    this.config = config || {};
  }

  async scanHierarchy(): Promise<Map<string, ComponentNode>> {
    // Use a default rootDir if not specified in config
    const rootDir = this.config?.rootDir || 'src/components';
    console.log('Scanning directory:', rootDir);
    const hierarchy = await this.scanner.scanDirectory(rootDir);
    await this.trackComponentFiles(hierarchy);
    await this.processHierarchy(hierarchy);
    return hierarchy;
  }

  private async trackComponentFiles(hierarchy: Map<string, any>): Promise<void> {
    for (const [name, component] of hierarchy) {
      await this.hashTracker.trackFile(component.path, [name]);
    }
  }

  private async processHierarchy(hierarchy: Map<string, ComponentNode>): Promise<void> {
    await this.tagManager.loadTags();

    // Create core coverage data
    const coreCoverageData: CoreComponentCoverage[] = Array.from(hierarchy.values()).map(component => ({
      path: component.path,
      coverage: {
        unit: 0,
        e2e: 0,
        visual: 0,
        runtime: 0
      },
      testIds: component.testIds || [],
      tags: []
    }));

    // Convert to coverage reporter format
    const coverageData: ComponentCoverage[] = coreCoverageData.map(c => ({
      name: c.path.split('/').pop() || 'unknown',
      path: c.path,
      coverage: {
        statements: c.coverage.unit,
        branches: c.coverage.e2e,
        functions: c.coverage.visual,
        lines: c.coverage.runtime
      },
      coveredBy: [],
      metadata: {
        testIds: c.testIds,
        tags: c.tags
      }
    }));

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

    await this.browserStackManager.syncTestResults(coreCoverageData);
    await this.coverageReporter.generateReport(coverageData);
  }

  async trackChanges(): Promise<void> {
    // Implement change tracking
  }

  async validateTags(): Promise<void> {
    // Implement tag validation
  }
} 