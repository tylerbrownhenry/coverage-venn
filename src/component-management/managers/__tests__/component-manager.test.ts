import { ComponentHierarchyManager, ComponentNode } from '../component-manager';
import { ComponentHierarchyScanner } from '../../scanners/ComponentHierarchyScanner';
import { HashTrackingManager } from '../HashTrackingManager';
import { BrowserStackManager } from '../../../coverage/services/BrowserStackManager';
import { TagManager } from '../../../shared/tags/TagManager';
import { CoverageReportGenerator } from '../../../coverage/reporters/coverage';
import { getConfig } from '../../../core/config';

// Mocks
jest.mock('../../scanners/ComponentHierarchyScanner');
jest.mock('../HashTrackingManager');
jest.mock('../../../coverage/services/BrowserStackManager');
jest.mock('../../../shared/tags/TagManager');
jest.mock('../../../coverage/reporters/coverage');
jest.mock('../../../core/config');

describe('ComponentHierarchyManager', () => {
  let manager: ComponentHierarchyManager;
  let mockScanner: jest.Mocked<ComponentHierarchyScanner>;
  let mockHashTracker: jest.Mocked<HashTrackingManager>;
  let mockBrowserStackManager: jest.Mocked<BrowserStackManager>;
  let mockTagManager: jest.Mocked<TagManager>;
  let mockCoverageReporter: jest.Mocked<CoverageReportGenerator>;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup getConfig mock
    (getConfig as jest.Mock).mockReturnValue({
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
    manager = new ComponentHierarchyManager();
    
    // Get mock instances
    mockScanner = ComponentHierarchyScanner.prototype as jest.Mocked<ComponentHierarchyScanner>;
    mockHashTracker = HashTrackingManager.prototype as jest.Mocked<HashTrackingManager>;
    mockBrowserStackManager = BrowserStackManager.prototype as jest.Mocked<BrowserStackManager>;
    mockTagManager = TagManager.prototype as jest.Mocked<TagManager>;
    mockCoverageReporter = CoverageReportGenerator.prototype as jest.Mocked<CoverageReportGenerator>;
  });
  
  describe('scanHierarchy', () => {
    it('should scan the component directory and process the hierarchy', async () => {
      // Arrange
      const mockHierarchy = new Map<string, ComponentNode>([
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
      // await manager.trackChanges();
      // No assertions since method is empty, but it should resolve
    });
  });
  
  describe('validateTags', () => {
    it('should be implemented in the future', async () => {
      // This is a placeholder test for a method to be implemented
      // await manager.validateTags();
      // No assertions since method is empty, but it should resolve
    });
  });
}); 