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
var index_exports = {};
__export(index_exports, {
  BrowserStackConfig: () => import_BrowserStackManager2.BrowserStackConfig,
  BrowserStackManager: () => import_BrowserStackManager.BrowserStackManager,
  ComponentCoverage: () => import_types.ComponentCoverage,
  ComponentHierarchyManager: () => import_component_manager.ComponentHierarchyManager,
  ComponentNode: () => import_component_manager2.ComponentNode,
  CoverageReport: () => import_coverage2.CoverageReport,
  CoverageReportGenerator: () => import_coverage.CoverageReportGenerator,
  TagManager: () => import_TagManager.TagManager
});
module.exports = __toCommonJS(index_exports);
var import_component_manager = require("./component-management/managers/component-manager");
var import_BrowserStackManager = require("./coverage/services/BrowserStackManager");
var import_coverage = require("./coverage/reporters/coverage");
var import_TagManager = require("./shared/tags/TagManager");
var import_component_manager2 = require("./component-management/managers/component-manager");
var import_BrowserStackManager2 = require("./coverage/services/BrowserStackManager");
var import_coverage2 = require("./coverage/reporters/coverage");
var import_types = require("./types");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrowserStackConfig,
  BrowserStackManager,
  ComponentCoverage,
  ComponentHierarchyManager,
  ComponentNode,
  CoverageReport,
  CoverageReportGenerator,
  TagManager
});
//# sourceMappingURL=index.js.map
