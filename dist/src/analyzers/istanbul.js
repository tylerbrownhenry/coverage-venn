"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IstanbulCoverageAnalyzer = void 0;
class IstanbulCoverageAnalyzer {
    constructor(componentPatterns = [/.*\/(components|containers)\/.*\.(tsx|jsx)$/], excludePatterns = [/.*\/__tests__\/.*/, /.*\.test\.(tsx|jsx|ts|js)$/]) {
        this.componentPatterns = componentPatterns;
        this.excludePatterns = excludePatterns;
    }
    async analyze(coverageMap) {
        if (!coverageMap) {
            console.warn('No coverage map provided to IstanbulCoverageAnalyzer');
            return [];
        }
        const result = [];
        for (const filePath of coverageMap.files()) {
            // Skip files that match exclude patterns
            if (this.excludePatterns.some(pattern => pattern.test(filePath))) {
                continue;
            }
            // Only include files that match component patterns (if specified)
            if (this.componentPatterns.length > 0 &&
                !this.componentPatterns.some(pattern => pattern.test(filePath))) {
                continue;
            }
            const coverage = coverageMap.fileCoverageFor(filePath);
            const summary = coverage.toSummary();
            // Calculate overall coverage as an average of all metrics
            const overallCoverage = this.calculateOverallCoverage(summary);
            result.push({
                path: filePath,
                coverage: overallCoverage,
                statements: summary.statements.pct,
                branches: summary.branches.pct,
                functions: summary.functions.pct,
                lines: summary.lines.pct
            });
        }
        // Sort by path for consistent results
        return result.sort((a, b) => a.path.localeCompare(b.path));
    }
    // Calculate overall coverage as an average of all metrics
    calculateOverallCoverage(summary) {
        const metrics = [
            summary.statements.pct,
            summary.branches.pct,
            summary.functions.pct,
            summary.lines.pct
        ];
        const validMetrics = metrics.filter(m => !isNaN(m) && m !== undefined);
        if (validMetrics.length === 0)
            return 0;
        const sum = validMetrics.reduce((acc, val) => acc + val, 0);
        return sum / validMetrics.length;
    }
    // Helper method to filter and normalize paths
    normalizePath(filePath) {
        return filePath.replace(/\\/g, '/');
    }
}
exports.IstanbulCoverageAnalyzer = IstanbulCoverageAnalyzer;
