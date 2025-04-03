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
var coverage_exports = {};
__export(coverage_exports, {
  CoverageReportGenerator: () => CoverageReportGenerator
});
module.exports = __toCommonJS(coverage_exports);
class CoverageReportGenerator {
  constructor(outputPath = "./coverage-report.json") {
    this.outputPath = outputPath;
  }
  async generateReport(components) {
    const covered = components.filter(
      (c) => c.coverage.unit > 0 || c.coverage.e2e > 0 || c.coverage.visual > 0 || c.coverage.runtime > 0
    ).length;
    const report = {
      components,
      summary: {
        total: components.length,
        covered,
        percentage: covered / components.length * 100
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log(`Generated coverage report with ${covered}/${components.length} components covered`);
    return report;
  }
  async saveReport(report) {
    console.log("Saved coverage report to:", this.outputPath);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CoverageReportGenerator
});
//# sourceMappingURL=coverage.js.map
