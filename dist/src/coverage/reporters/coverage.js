"use strict";
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
exports.CoverageReportGenerator = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const html_1 = require("./templates/html");
class CoverageReportGenerator {
    constructor(outputDir = 'coverage') {
        this.outputDir = outputDir;
    }
    async generateReport(coverage) {
        const summary = this.calculateSummary(coverage);
        const report = {
            summary,
            components: this.sortComponents(coverage),
            timestamp: new Date().toISOString(),
            metadata: await this.getMetadata()
        };
        await this.saveReport(report);
        return report;
    }
    calculateSummary(components) {
        const total = components.length;
        const covered = components.filter(c => Object.values(c.coverage).every((v) => v !== undefined && v > 0)).length;
        return {
            total,
            covered,
            percentage: (covered / total) * 100
        };
    }
    sortComponents(components) {
        return [...components].sort((a, b) => {
            // Sort by coverage percentage descending
            const aAvg = this.getAverageCoverage(a);
            const bAvg = this.getAverageCoverage(b);
            return bAvg - aAvg;
        });
    }
    getAverageCoverage(component) {
        const values = Object.values(component.coverage).filter((v) => v !== undefined);
        if (values.length === 0)
            return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    async getMetadata() {
        try {
            return {
                branch: process.env.GIT_BRANCH,
                commit: process.env.GIT_COMMIT,
                buildId: process.env.BUILD_ID
            };
        }
        catch {
            return {};
        }
    }
    async saveReport(report) {
        await fs.mkdir(this.outputDir, { recursive: true });
        // Save JSON report
        await fs.writeFile(path.join(this.outputDir, 'coverage.json'), JSON.stringify(report, null, 2));
        // Generate and save HTML report
        const html = (0, html_1.generateHtmlReport)(report);
        await fs.writeFile(path.join(this.outputDir, 'coverage.html'), html);
    }
}
exports.CoverageReportGenerator = CoverageReportGenerator;
