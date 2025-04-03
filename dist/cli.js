#!/usr/bin/env node
"use strict";
var import_commander = require("commander");
var import_component_manager = require("./component-management/managers/component-manager");
var import_coverage = require("./coverage/reporters/coverage");
const program = new import_commander.Command();
program.name("coverage-venn").description("Component coverage analysis and visualization tool").version("1.0.0");
program.command("scan").description("Scan a directory for component coverage analysis").argument("<directory>", "Directory to scan").option("-o, --output <path>", "Output path for coverage report", "./coverage-report.json").option("-c, --config <path>", "Path to config file").action(async (directory, options) => {
  try {
    if (options.config) {
      process.env.MANAGER_CONFIG_PATH = options.config;
    }
    console.log(`Scanning directory: ${directory}`);
    const hierarchyManager = new import_component_manager.ComponentHierarchyManager();
    const reportGenerator = new import_coverage.CoverageReportGenerator(options.output);
    const hierarchy = await hierarchyManager.scanHierarchy();
    const coverageData = Array.from(hierarchy.values()).map((component) => ({
      path: component.path,
      coverage: {
        unit: 0,
        // These would be populated by actual coverage data
        e2e: 0,
        visual: 0,
        runtime: 0
      },
      testIds: component.testIds,
      tags: []
      // Would be populated by tag manager
    }));
    const report = await reportGenerator.generateReport(coverageData);
    await reportGenerator.saveReport(report);
    console.log("Coverage analysis complete!");
    console.log(`Report saved to: ${options.output}`);
    console.log(`Total components: ${report.summary.total}`);
    console.log(`Coverage: ${report.summary.percentage.toFixed(2)}%`);
  } catch (error) {
    console.error("Error during scan:", error);
    process.exit(1);
  }
});
program.parse();
//# sourceMappingURL=cli.js.map
