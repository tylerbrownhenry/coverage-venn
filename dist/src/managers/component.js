"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHierarchyManager = void 0;
const ComponentHierarchyScanner_1 = require("../scanners/ComponentHierarchyScanner");
const HashTrackingManager_1 = require("./HashTrackingManager");
const BrowserStackManager_1 = require("./BrowserStackManager");
const TagManager_1 = require("./TagManager");
const coverage_1 = require("../reporters/coverage");
const config_1 = require("../utils/config"); // Fix import path
class ComponentHierarchyManager {
    constructor() {
        this.scanner = new ComponentHierarchyScanner_1.ComponentHierarchyScanner();
        this.hashTracker = new HashTrackingManager_1.HashTrackingManager();
        this.config = (0, config_1.getConfig)('manager', {
            required: true,
            configPath: process.env.MANAGER_CONFIG_PATH
        });
        this.browserStackManager = new BrowserStackManager_1.BrowserStackManager(this.config.browserstack, process.cwd());
        this.tagManager = new TagManager_1.TagManager(process.cwd());
        this.coverageReporter = new coverage_1.CoverageReportGenerator(this.config.coverage.output || 'coverage-reports');
    }
    async scanHierarchy() {
        const rootDir = this.config.rootDir || 'src/components';
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
        const coverageData = Array.from(hierarchy.values()).map(component => ({
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
                relationships: component.children.map((childName) => `@root_${childName.toLowerCase()}`),
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
    async trackChanges() {
        // Implement change tracking
    }
    async validateTags() {
        // Implement tag validation
    }
}
exports.ComponentHierarchyManager = ComponentHierarchyManager;
