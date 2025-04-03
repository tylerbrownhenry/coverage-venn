"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var component_manager_exports = {};
__export(component_manager_exports, {
  ComponentHierarchyManager: () => ComponentHierarchyManager
});
module.exports = __toCommonJS(component_manager_exports);
var import_ComponentHierarchyScanner = require("../scanners/ComponentHierarchyScanner");
var import_HashTrackingManager = require("./HashTrackingManager");
var import_TagManager = require("../../shared/tags/TagManager");
var import_config = require("../../core/config");
class ComponentHierarchyManager {
  constructor() {
    var _a, _b;
    console.log("Initializing ComponentHierarchyManager");
    const config = (0, import_config.getConfig)("manager", {
      required: false,
      configPath: process.env.MANAGER_CONFIG_PATH
    });
    const browserStackConfig = config.browserStack || { enabled: false };
    this.scanner = new import_ComponentHierarchyScanner.ComponentHierarchyScanner();
    this.hashTracker = new import_HashTrackingManager.HashTrackingManager(((_a = config.tracking) == null ? void 0 : _a.hashStoreFile) || ".hash-store.json");
    this.tagManager = new import_TagManager.TagManager(((_b = config.tracking) == null ? void 0 : _b.tagStoreFile) || ".tag-store.json");
    this.config = config || {};
  }
  async scanHierarchy() {
    var _a;
    console.log("Scanning hierarchy");
    const rootDir = ((_a = this.config) == null ? void 0 : _a.rootDir) || "src/components";
    console.log("Scanning directory:", rootDir);
    const hierarchy = await this.scanner.scanDirectory(rootDir);
    await this.trackComponentFiles(hierarchy);
    await this.processHierarchy(hierarchy);
    return hierarchy;
  }
  async trackComponentFiles(hierarchy) {
    console.log("Tracking component files:", hierarchy);
    for (const [name, component] of hierarchy) {
      await this.hashTracker.trackFile(component.path, [name]);
    }
  }
  async processHierarchy(hierarchy) {
    console.log("Processing hierarchy:", hierarchy);
    await this.tagManager.loadTags();
    for (const [name, component] of hierarchy) {
      await this.tagManager.registerTag({
        name: `@root_${name.toLowerCase()}`,
        components: [component.path],
        relationships: component.children.map(
          (childName) => `@root_${childName.toLowerCase()}`
        ),
        category: "component",
        metadata: {
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ComponentHierarchyManager
});
//# sourceMappingURL=component-manager.js.map
