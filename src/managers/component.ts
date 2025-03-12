import { ComponentHierarchyScanner } from '../scanners/ComponentHierarchyScanner';
import { HashTrackingManager } from './HashTrackingManager';
import { BrowserStackManager } from './BrowserStackManager';
import { TagManager } from './TagManager';
import { CoverageReportGenerator } from '../reporters/coverage';
import { ComponentCoverage } from '../types';
import { getConfig } from '../utils/config';  // Fix import path

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
    this.scanner = new ComponentHierarchyScanner();
    this.hashTracker = new HashTrackingManager();
    
    this.config = getConfig('manager', {
      required: true,
      configPath: process.env.MANAGER_CONFIG_PATH
    });

    this.browserStackManager = new BrowserStackManager(
      this.config.browserstack,
      process.cwd()
    );
    
    this.tagManager = new TagManager(process.cwd());
    this.coverageReporter = new CoverageReportGenerator(this.config.coverage.output || 'coverage-reports');
  }

  async scanHierarchy(): Promise<Map<string, ComponentNode>> {
    const rootDir = this.config.rootDir || 'src/components';
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

    const coverageData: ComponentCoverage[] = Array.from(hierarchy.values()).map(component => ({
      path: component.path,
      coverage: {
        unit: 0,
        e2e: 0,
        visual: 0,
        runtime: 0
      },
      testIds: component.testIds,
      tags: [`@root_${component.name.toLowerCase()}`]
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

    await this.browserStackManager.syncTestResults(coverageData);
    await this.coverageReporter.generateReport(coverageData);
  }

  async trackChanges(): Promise<void> {
    // Implement change tracking
  }

  async validateTags(): Promise<void> {
    // Implement tag validation
  }
}
