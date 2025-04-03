#!/usr/bin/env node
import { Command } from 'commander';
import { ComponentHierarchyManager } from './component-management/managers/component-manager';
import { CoverageReportGenerator } from './coverage/reporters/coverage';
import path from 'path';
import fs from 'fs';

const program = new Command();

program
  .name('coverage-venn')
  .description('Component coverage analysis and visualization tool')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan a directory for component coverage analysis')
  .argument('<directory>', 'Directory to scan')
  .option('-o, --output <path>', 'Output path for coverage report', './coverage-report.json')
  .option('-c, --config <path>', 'Path to config file', './default-config.json')
  .action(async (directory: string, options: { output: string; config: string }) => {
    try {
      // Load config
      let config;
      try {
        const configPath = path.resolve(process.cwd(), options.config);
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('Using config from:', configPath);
      } catch (error) {
        console.warn('Failed to load config, using defaults:', error.message);
        const defaultConfigPath = path.join(__dirname, 'default-config.json');
        config = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
      }

      // Set environment variables
      process.env.MANAGER_CONFIG_PATH = options.config;

      console.log(`Scanning directory: ${directory}`);
      
      // Initialize managers with config
      const hierarchyManager = new ComponentHierarchyManager();
      const reportGenerator = new CoverageReportGenerator(options.output);

      // Override rootDir from command line argument
      config.manager.rootDir = directory;

      // Scan hierarchy
      const hierarchy = await hierarchyManager.scanHierarchy();
      
      // Generate coverage data
      const coverageData = Array.from(hierarchy.values()).map(component => ({
        path: component.path,
        coverage: {
          unit: 0, // These would be populated by actual coverage data
          e2e: 0,
          visual: 0,
          runtime: 0
        },
        testIds: component.testIds,
        tags: [] // Would be populated by tag manager
      }));

      // Generate and save report
      const report = await reportGenerator.generateReport(coverageData);
      await reportGenerator.saveReport(report);

      console.log('Coverage analysis complete!');
      console.log(`Report saved to: ${options.output}`);
      console.log(`Total components: ${report.summary.total}`);
      console.log(`Coverage: ${report.summary.percentage.toFixed(2)}%`);
    } catch (error) {
      console.error('Error during scan:', error);
      process.exit(1);
    }
  });

program.parse(); 