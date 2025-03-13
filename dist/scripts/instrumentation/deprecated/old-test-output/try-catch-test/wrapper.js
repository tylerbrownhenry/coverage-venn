"use strict";
// First, load and set up the coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');
global.COVERAGE_TRACKER = COVERAGE_TRACKER;
// Now load the instrumented code
require('./instrumented-try-catch-test');
