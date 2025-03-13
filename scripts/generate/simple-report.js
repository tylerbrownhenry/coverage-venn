console.log("Generating simple report..."); const fs = require("fs"); const path = require("path"); const COVERAGE_ANALYSIS_DIR = path.resolve(process.cwd(), "../..", "coverage-analysis"); const OUTPUT_DIR = path.resolve(process.cwd(), "coverage-project"); const COMPONENT_COVERAGE_PATH = path.resolve(COVERAGE_ANALYSIS_DIR, "project-component-coverage.json"); const HTML_OUTPUT_PATH = path.resolve(OUTPUT_DIR, "simple-report.html"); try { const componentCoverage = JSON.parse(fs.readFileSync(COMPONENT_COVERAGE_PATH, "utf8")); console.log(`Read ${componentCoverage.length} components`); const html = `<!DOCTYPE html><html><head><title>Simple Report</title></head><body><h1>Simple Report</h1><p>Generated at: ${new Date().toISOString()}</p><p>Components: ${componentCoverage.length}</p><ul>${componentCoverage.map(c => `<li>${c.name || path.basename(c.path)} - Coverage: ${(c.coverage * 100).toFixed(1)}%</li>`).join("")}</ul></body></html>`; if (!fs.existsSync(OUTPUT_DIR)) { fs.mkdirSync(OUTPUT_DIR, { recursive: true }); } fs.writeFileSync(HTML_OUTPUT_PATH, html); console.log("Simple report generated at:", HTML_OUTPUT_PATH); } catch (error) { console.error("Error generating report:", error); }
