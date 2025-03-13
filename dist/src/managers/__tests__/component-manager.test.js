"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_manager_1 = require("../component-manager");
const ComponentHierarchyScanner_1 = require("../../scanners/ComponentHierarchyScanner");
const HashTrackingManager_1 = require("../HashTrackingManager");
const BrowserStackManager_1 = require("../BrowserStackManager");
const TagManager_1 = require("../TagManager");
const coverage_1 = require("../../reporters/coverage");
const config_1 = require("../../utils/config");
// Mocks
jest.mock('../../scanners/ComponentHierarchyScanner');
jest.mock('../HashTrackingManager');
jest.mock('../BrowserStackManager');
jest.mock('../TagManager');
jest.mock('../../reporters/coverage');
jest.mock('../../utils/config');
describe('ComponentHierarchyManager', () => {
    let manager;
    let mockScanner;
    let mockHashTracker;
    let mockBrowserStackManager;
    let mockTagManager;
    let mockCoverageReporter;
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        // Setup getConfig mock
        config_1.getConfig.mockReturnValue({
            rootDir: 'src/components',
            browserstack: {
                username: 'test-user',
                apiKey: 'test-key'
            },
            coverage: {
                output: 'test-coverage'
            }
        });
        // Create the manager
        manager = new component_manager_1.ComponentHierarchyManager();
        // Get mock instances
        mockScanner = ComponentHierarchyScanner_1.ComponentHierarchyScanner.prototype;
        mockHashTracker = HashTrackingManager_1.HashTrackingManager.prototype;
        mockBrowserStackManager = BrowserStackManager_1.BrowserStackManager.prototype;
        mockTagManager = TagManager_1.TagManager.prototype;
        mockCoverageReporter = coverage_1.CoverageReportGenerator.prototype;
    });
    describe('scanHierarchy', () => {
        it('should scan the component directory and process the hierarchy', async () => {
            // Arrange
            const mockHierarchy = new Map([
                ['Button', {
                        name: 'Button',
                        path: 'src/components/Button.tsx',
                        children: ['Icon'],
                        testIds: ['button_primary', 'button_secondary']
                    }],
                ['Icon', {
                        name: 'Icon',
                        path: 'src/components/Icon.tsx',
                        children: [],
                        testIds: ['icon_default']
                    }]
            ]);
            mockScanner.scanDirectory.mockResolvedValue(mockHierarchy);
            mockTagManager.loadTags.mockResolvedValue(undefined);
            mockTagManager.registerTag.mockResolvedValue(undefined);
            mockBrowserStackManager.syncTestResults.mockResolvedValue(undefined);
            mockCoverageReporter.generateReport.mockResolvedValue(undefined);
            mockHashTracker.trackFile.mockResolvedValue(undefined);
            // Act
            const result = await manager.scanHierarchy();
            // Assert
            expect(mockScanner.scanDirectory).toHaveBeenCalledWith('src/components');
            expect(mockHashTracker.trackFile).toHaveBeenCalledTimes(2);
            expect(mockHashTracker.trackFile).toHaveBeenCalledWith('src/components/Button.tsx', ['Button']);
            expect(mockHashTracker.trackFile).toHaveBeenCalledWith('src/components/Icon.tsx', ['Icon']);
            expect(mockTagManager.loadTags).toHaveBeenCalled();
            expect(mockTagManager.registerTag).toHaveBeenCalledTimes(2);
            expect(mockBrowserStackManager.syncTestResults).toHaveBeenCalled();
            expect(mockCoverageReporter.generateReport).toHaveBeenCalled();
            expect(result).toBe(mockHierarchy);
        });
    });
    describe('trackChanges', () => {
        it('should be implemented in the future', async () => {
            // This is a placeholder test for a method to be implemented
            await manager.trackChanges();
            // No assertions since method is empty, but it should resolve
        });
    });
    describe('validateTags', () => {
        it('should be implemented in the future', async () => {
            // This is a placeholder test for a method to be implemented
            await manager.validateTags();
            // No assertions since method is empty, but it should resolve
        });
    });
});
