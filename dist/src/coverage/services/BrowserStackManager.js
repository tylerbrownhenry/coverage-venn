"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStackManager = void 0;
const BrowserStackService_1 = require("./BrowserStackService");
const TestMetadataService_1 = require("../../test-management/services/TestMetadataService");
class BrowserStackManager {
    constructor(config, baseDir) {
        // Only initialize if enabled and required fields are present
        this.service = config.enabled && config.username && config.accessKey ?
            new BrowserStackService_1.BrowserStackService({
                enabled: true,
                username: config.username,
                accessKey: config.accessKey,
                projectName: config.projectName || 'Default Project'
            }) : null;
        this.metadataService = new TestMetadataService_1.TestMetadataService(baseDir);
    }
    async syncTestResults(coverage) {
        // Skip BrowserStack sync if disabled
        if (!this.service) {
            console.log('BrowserStack integration disabled, skipping sync');
            return;
        }
        try {
            const sessions = await this.service.getSessions();
            await this.metadataService.loadMetadata();
            for (const session of sessions) {
                const relatedComponents = coverage.filter(comp => comp.tags.some(tag => session.name.includes(tag)));
                await this.service.addTags(session.id, relatedComponents.map(comp => comp.path));
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
        }
        catch (error) {
            console.warn('Error syncing with BrowserStack:', error);
            // Continue execution without failing
        }
    }
    async updateSessionMetadata(sessionId, coverage) {
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
        }
        catch (error) {
            console.warn('Error updating BrowserStack metadata:', error);
            // Continue execution without failing
        }
    }
}
exports.BrowserStackManager = BrowserStackManager;
