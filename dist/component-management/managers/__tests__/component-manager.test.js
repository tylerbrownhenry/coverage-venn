"use strict";
var import_component_manager = require("../component-manager");
var import_ComponentHierarchyScanner = require("../../scanners/ComponentHierarchyScanner");
var import_HashTrackingManager = require("../HashTrackingManager");
var import_BrowserStackManager = require("../../../coverage/services/BrowserStackManager");
var import_TagManager = require("../../../shared/tags/TagManager");
var import_coverage = require("../../../coverage/reporters/coverage");
var import_config = require("../../../core/config");
jest.mock("../../scanners/ComponentHierarchyScanner");
jest.mock("../HashTrackingManager");
jest.mock("../../../coverage/services/BrowserStackManager");
jest.mock("../../../shared/tags/TagManager");
jest.mock("../../../coverage/reporters/coverage");
jest.mock("../../../core/config");
describe("ComponentHierarchyManager", () => {
  let manager;
  let mockScanner;
  let mockHashTracker;
  let mockBrowserStackManager;
  let mockTagManager;
  let mockCoverageReporter;
  beforeEach(() => {
    jest.clearAllMocks();
    import_config.getConfig.mockReturnValue({
      rootDir: "src/components",
      browserstack: {
        username: "test-user",
        apiKey: "test-key"
      },
      coverage: {
        output: "test-coverage"
      }
    });
    manager = new import_component_manager.ComponentHierarchyManager();
    mockScanner = import_ComponentHierarchyScanner.ComponentHierarchyScanner.prototype;
    mockHashTracker = import_HashTrackingManager.HashTrackingManager.prototype;
    mockBrowserStackManager = import_BrowserStackManager.BrowserStackManager.prototype;
    mockTagManager = import_TagManager.TagManager.prototype;
    mockCoverageReporter = import_coverage.CoverageReportGenerator.prototype;
  });
  describe("scanHierarchy", () => {
    it("should scan the component directory and process the hierarchy", async () => {
      const mockHierarchy = /* @__PURE__ */ new Map([
        ["Button", {
          name: "Button",
          path: "src/components/Button.tsx",
          children: ["Icon"],
          testIds: ["button_primary", "button_secondary"]
        }],
        ["Icon", {
          name: "Icon",
          path: "src/components/Icon.tsx",
          children: [],
          testIds: ["icon_default"]
        }]
      ]);
      mockScanner.scanDirectory.mockResolvedValue(mockHierarchy);
      mockTagManager.loadTags.mockResolvedValue(void 0);
      mockTagManager.registerTag.mockResolvedValue(void 0);
      mockBrowserStackManager.syncTestResults.mockResolvedValue(void 0);
      mockCoverageReporter.generateReport.mockResolvedValue(void 0);
      mockHashTracker.trackFile.mockResolvedValue(void 0);
      const result = await manager.scanHierarchy();
      expect(mockScanner.scanDirectory).toHaveBeenCalledWith("src/components");
      expect(mockHashTracker.trackFile).toHaveBeenCalledTimes(2);
      expect(mockHashTracker.trackFile).toHaveBeenCalledWith("src/components/Button.tsx", ["Button"]);
      expect(mockHashTracker.trackFile).toHaveBeenCalledWith("src/components/Icon.tsx", ["Icon"]);
      expect(mockTagManager.loadTags).toHaveBeenCalled();
      expect(mockTagManager.registerTag).toHaveBeenCalledTimes(2);
      expect(mockBrowserStackManager.syncTestResults).toHaveBeenCalled();
      expect(mockCoverageReporter.generateReport).toHaveBeenCalled();
      expect(result).toBe(mockHierarchy);
    });
  });
  describe("trackChanges", () => {
    it("should be implemented in the future", async () => {
    });
  });
  describe("validateTags", () => {
    it("should be implemented in the future", async () => {
    });
  });
});
//# sourceMappingURL=component-manager.test.js.map
