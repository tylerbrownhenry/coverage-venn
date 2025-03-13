"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHierarchyManager = void 0;
const ComponentHierarchyScanner_1 = require("../scanners/ComponentHierarchyScanner");
const HashTrackingManager_1 = require("./HashTrackingManager");
const BrowserStackManager_1 = require("../../coverage/services/BrowserStackManager");
const TagManager_1 = require("../../shared/tags/TagManager");
const coverage_1 = require("../../coverage/reporters/coverage");
const config_1 = require("../../core/config");
class ComponentHierarchyManager {
    constructor() {
        const config = (0, config_1.getConfig)('manager', {
            required: false,
            configPath: process.env.MANAGER_CONFIG_PATH
        });
        // Ensure browserStack config exists with default values
        const browserStackConfig = config.browserStack || { enabled: false };
        this.scanner = new ComponentHierarchyScanner_1.ComponentHierarchyScanner();
        this.hashTracker = new HashTrackingManager_1.HashTrackingManager(config.tracking?.hashStoreFile || '.hash-store.json');
        this.tagManager = new TagManager_1.TagManager(config.tracking?.tagStoreFile || '.tag-store.json');
        this.browserStackManager = new BrowserStackManager_1.BrowserStackManager(browserStackConfig, config.baseDir || '.');
        this.coverageReporter = new coverage_1.CoverageReportGenerator(config.coverage?.reportDir || 'coverage');
        this.config = config || {};
    }
    async scanHierarchy() {
        // Use a default rootDir if not specified in config
        const rootDir = this.config?.rootDir || 'src/components';
        console.log('Scanning directory:', rootDir);
        const hierarchy = await this.scanner.scanDirectory(rootDir);
        await this.trackComponentFiles(hierarchy);
        await this.processHierarchy(hierarchy);
        return hierarchy;
    }
    async trackComponentFiles(hierarchy) {
        for (const [name, component] of hierarchy) {
            await this.hashTracker.trackFile(component.path, [name]);
        }
    }
    async processHierarchy(hierarchy) {
        await this.tagManager.loadTags();
        // Create core coverage data
        const coreCoverageData = Array.from(hierarchy.values()).map(component => ({
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
        const coverageData = coreCoverageData.map(c => ({
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
                relationships: component.children.map((childName) => `@root_${childName.toLowerCase()}`),
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
    async trackChanges() {
        // Implement change tracking
    }
    async validateTags() {
        // Implement tag validation
    }
}
exports.ComponentHierarchyManager = ComponentHierarchyManager;
