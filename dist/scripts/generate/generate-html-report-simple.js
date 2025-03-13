"use strict";
/**
 * Simplified HTML Report Generator
 *
 * This script generates an HTML report of component coverage analysis,
 * using an external HTML template file to avoid TypeScript template issues.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// Determine coverage source from environment variable
const COVERAGE_SOURCE = process.env.COVERAGE_SOURCE || 'mock';
// Define paths based on coverage source
const OUTPUT_DIR = COVERAGE_SOURCE === 'project'
    ? path.resolve(process.cwd(), 'coverage-project')
    : path.resolve(process.cwd(), 'coverage-mock');
const COMPONENT_COVERAGE_PATH = COVERAGE_SOURCE === 'project'
    ? path.resolve(process.cwd(), 'coverage-analysis', 'project-component-coverage.json')
    : path.resolve(process.cwd(), 'reports', 'mock-analysis.json');
const CORRELATION_PATH = COVERAGE_SOURCE === 'project'
    ? path.resolve(process.cwd(), 'coverage-analysis', 'project-test-component-correlation.json')
    : path.resolve(process.cwd(), 'reports', 'mock-test-component-correlation.json');
const HTML_OUTPUT_PATH = path.resolve(OUTPUT_DIR, 'coverage.html');
const TEMPLATE_PATH = path.resolve(__dirname, 'report-template.html');
async function main() {
    try {
        console.log(`Generating HTML report for ${COVERAGE_SOURCE} data...`);
        // Ensure output directory exists
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        // Load component coverage data
        let componentData = [];
        try {
            const coverageContent = await fs.readFile(COMPONENT_COVERAGE_PATH, 'utf8');
            componentData = JSON.parse(coverageContent);
            console.log(`Loaded coverage data for ${componentData.length} components.`);
        }
        catch (error) {
            console.warn(`Could not load component coverage data from ${COMPONENT_COVERAGE_PATH}`);
            console.warn('Will proceed with empty component data.');
        }
        // Load correlation data (if available)
        try {
            const correlationContent = await fs.readFile(CORRELATION_PATH, 'utf8');
            const correlationData = JSON.parse(correlationContent);
            // Enrich component data with test counts
            if (correlationData && componentData.length > 0) {
                for (const component of componentData) {
                    const correlatedComponent = correlationData.find((c) => c.path === component.path);
                    if (correlatedComponent) {
                        component.tests = correlatedComponent.correlatedTests?.length || 0;
                    }
                }
                console.log(`Enhanced component data with correlation information.`);
            }
        }
        catch (error) {
            console.warn(`Could not load correlation data from ${CORRELATION_PATH}`);
            console.warn('Will proceed without test correlation information.');
        }
        // Load HTML template
        const templateContent = await fs.readFile(TEMPLATE_PATH, 'utf8');
        // Generate table rows
        const timestamp = new Date().toLocaleString();
        const tableRows = componentData.map(item => {
            const coverageClass = getCoverageClass(item.coverage);
            return `<tr>
        <td>${item.name || ''}</td>
        <td>${item.path || ''}</td>
        <td class="${coverageClass}">${item.coverage ? item.coverage.toFixed(1) + '%' : '0%'}</td>
        <td>${item.tests || 0}</td>
        <td>${item.metrics?.statements ? item.metrics.statements.toFixed(1) + '%' : 'N/A'}</td>
        <td>${item.metrics?.branches ? item.metrics.branches.toFixed(1) + '%' : 'N/A'}</td>
        <td>${item.metrics?.functions ? item.metrics.functions.toFixed(1) + '%' : 'N/A'}</td>
        <td>${item.metrics?.lines ? item.metrics.lines.toFixed(1) + '%' : 'N/A'}</td>
      </tr>`;
        }).join('\n');
        // Replace placeholders in template
        const html = templateContent
            .replace('{{timestamp}}', timestamp)
            .replace('{{tableRows}}', tableRows);
        // Write the HTML report
        await fs.writeFile(HTML_OUTPUT_PATH, html, 'utf8');
        console.log(`HTML report generated successfully: ${HTML_OUTPUT_PATH}`);
    }
    catch (error) {
        console.error('Error generating HTML report:', error);
        process.exit(1);
    }
}
// Helper function to determine coverage class
function getCoverageClass(coverage) {
    if (coverage >= 80)
        return 'high';
    if (coverage >= 50)
        return 'medium';
    return 'low';
}
main();
