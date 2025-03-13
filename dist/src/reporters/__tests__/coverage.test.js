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
const coverage_1 = require("../coverage");
const fs = __importStar(require("fs/promises"));
jest.mock('fs/promises');
describe('CoverageReportGenerator', () => {
    let generator;
    beforeEach(() => {
        generator = new coverage_1.CoverageReportGenerator('test-coverage');
        jest.resetAllMocks();
    });
    it('should generate coverage report', async () => {
        const mockCoverage = [
            {
                path: 'src/components/Button.tsx',
                coverage: {
                    unit: 80,
                    e2e: 60,
                    visual: 100,
                    runtime: 75
                },
                testIds: ['root_button'],
                tags: ['@root_button']
            }
        ];
        const report = await generator.generateReport(mockCoverage);
        expect(report.summary.total).toBe(1);
        expect(report.summary.covered).toBe(1);
        expect(report.components).toHaveLength(1);
        expect(fs.writeFile).toHaveBeenCalledTimes(2); // JSON and HTML
    });
});
