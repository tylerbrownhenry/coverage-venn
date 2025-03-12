import { BrowserStackService, BrowserStackConfig } from './BrowserStackService';
import { TestMetadataService } from '../../test-management/services/TestMetadataService';
import { ComponentCoverage } from '../../core/types';

export class BrowserStackManager {
  private service: BrowserStackService | null;
  private metadataService: TestMetadataService;

  constructor(config: Partial<BrowserStackConfig>, baseDir: string) {
    // Only initialize if enabled and required fields are present
    this.service = config.enabled && config.username && config.accessKey ? 
      new BrowserStackService({
        enabled: true,
        username: config.username,
        accessKey: config.accessKey,
        projectName: config.projectName || 'Default Project'
      }) : null;

    this.metadataService = new TestMetadataService(baseDir);
  }

  async syncTestResults(coverage: ComponentCoverage[]): Promise<void> {
    // Skip BrowserStack sync if disabled
    if (!this.service) {
      console.log('BrowserStack integration disabled, skipping sync');
      return;
    }

    try {
      const sessions = await this.service.getSessions();
      await this.metadataService.loadMetadata();
      
      for (const session of sessions) {
        const relatedComponents = coverage.filter(comp => 
          comp.tags.some(tag => session.name.includes(tag))
        );

        await this.service.addTags(session.id, 
          relatedComponents.map(comp => comp.path)
        );

        await this.metadataService.updateTestMetadata(session.id, {
          name: session.name,
          components: relatedComponents.map(comp => comp.path),
          tags: relatedComponents.flatMap(comp => comp.tags),
          lastRun: new Date(),
          duration: session.duration,
          browserstack: {
            sessionId: session.id,
            buildId: session.buildId || session.id // Fallback to session.id if buildId is not available
          },
          coverage: {
            components: relatedComponents.reduce((acc, comp) => ({
              ...acc,
              [comp.path]: comp.coverage.e2e
            }), {}),
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      console.warn('Error syncing with BrowserStack:', error);
      // Continue execution without failing
    }
  }

  async updateSessionMetadata(sessionId: string, coverage: ComponentCoverage): Promise<void> {
    if (!this.service) {
      console.log('BrowserStack integration disabled, skipping metadata update');
      return;
    }

    try {
      await this.service.updateSession(sessionId, {
        tags: [
          ...coverage.tags,
          `coverage:${Math.floor(coverage.coverage.e2e)}%`
        ]
      });
    } catch (error) {
      console.warn('Error updating BrowserStack metadata:', error);
      // Continue execution without failing
    }
  }
}
