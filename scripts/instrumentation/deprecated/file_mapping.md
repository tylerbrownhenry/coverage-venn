# Deprecated Files Mapping

This document tracks files that have been moved to the deprecated folder after the testing framework migration.

| Original Path | New Path | Reason for Deprecation |
|--------------|----------|------------------------|
| scripts/test-instrumentation.ts | scripts/instrumentation/deprecated/test-instrumentation.ts | Replaced by unit tests and run-all-tests.js |
| scripts/test-instrumentation-config.js | scripts/instrumentation/deprecated/test-instrumentation-config.js | Replaced by Jest configuration in scripts/instrumentation/jest.config.js |
| scripts/test-jsx-instrumentation.ts | scripts/instrumentation/jsx/test-jsx.ts | Renamed as part of migration |
| scripts/test-function-instrumentation.ts | scripts/instrumentation/function/test-function.ts | Renamed as part of migration |
| scripts/test-switch-instrumentation.ts | scripts/instrumentation/switch/run-switch.js | Renamed as part of migration |
| scripts/test-try-catch-instrumentation.ts | scripts/instrumentation/try-catch/test-try-catch.ts | Renamed as part of migration |
| scripts/test-flow-instrumentation.js | scripts/instrumentation/flow/test-flow.js | Renamed as part of migration |
| scripts/test-flow-instrumentation-simple.js | scripts/instrumentation/flow/test-flow-simple.js | Renamed as part of migration |
| scripts/test-typescript-instrumentation.js | scripts/instrumentation/typescript/test-typescript.js | Renamed as part of migration |
| scripts/test-async-instrumentation.js | scripts/instrumentation/async/test-async.js | Renamed as part of migration |
| .instrumentation-test/ | scripts/instrumentation/deprecated/old-test-output/ | Temporary output folder from old instrumentation tests, replaced by individual temp directories in each instrumentation type folder |
| coverage-venn/ | scripts/instrumentation/deprecated/old-directories/coverage-venn/ | Redundant folder with functionality now provided by other coverage folders |
| coverage2/ | coverage-analysis/ | Renamed to have a more descriptive name that better reflects its purpose | 