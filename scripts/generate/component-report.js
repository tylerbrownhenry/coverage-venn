console.log("Generating component report..."); const fs = require("fs"); const path = require("path"); const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd(); console.log("PROJECT_ROOT:", PROJECT_ROOT); const COVERAGE_DIR = path.resolve(process.cwd(), "../../coverage"); const COVERAGE_ANALYSIS_DIR = path.resolve(process.cwd(), "../../coverage-analysis"); const OUTPUT_DIR = path.resolve(process.cwd(), "../../coverage-project"); console.log("COVERAGE_ANALYSIS_DIR:", COVERAGE_ANALYSIS_DIR); console.log("COVERAGE_ANALYSIS_DIR exists:", fs.existsSync(COVERAGE_ANALYSIS_DIR)); const COVERAGE_SOURCE = process.env.COVERAGE_SOURCE || "standard"; console.log("COVERAGE_SOURCE:", COVERAGE_SOURCE); const COMPONENT_COVERAGE_PATH = COVERAGE_SOURCE === "project" ? path.resolve(COVERAGE_ANALYSIS_DIR, "project-component-coverage.json") : path.resolve(COVERAGE_DIR, "component-coverage.json"); console.log("COMPONENT_COVERAGE_PATH:", COMPONENT_COVERAGE_PATH); console.log("COMPONENT_COVERAGE_PATH exists:", fs.existsSync(COMPONENT_COVERAGE_PATH)); try { const componentCoverage = JSON.parse(fs.readFileSync(COMPONENT_COVERAGE_PATH, "utf8")); console.log(`Read ${componentCoverage.length} components`); const HTML_OUTPUT_PATH = path.resolve(OUTPUT_DIR, "component-report.html"); if (!fs.existsSync(OUTPUT_DIR)) { fs.mkdirSync(OUTPUT_DIR, { recursive: true }); } const html = `<!DOCTYPE html><html><head><title>Component Report</title></head><body><h1>Component Report</h1><p>Generated at: ${new Date().toISOString()}</p><p>Components: ${componentCoverage.length}</p><ul>${componentCoverage.map(c => `<li>${c.name || path.basename(c.path)} - Coverage: ${(c.coverage * 100).toFixed(1)}%</li>`).join("")}</ul></body></html>`; fs.writeFileSync(HTML_OUTPUT_PATH, html); console.log("Component report generated at:", HTML_OUTPUT_PATH); } catch (error) { console.error("Error generating component report:", error); }
