#!/usr/bin/env node
"use strict";
/**
 * This script helps find broken imports after reorganization.
 * Run it to locate files that may need import path fixes.
 */
const { execSync } = require('child_process');
const path = require('path');
const ROOT_DIR = path.resolve(__dirname, '..');
try {
    console.log('Checking for broken imports...');
    const result = execSync('grep -r "from \'" --include="*.ts" --include="*.tsx" src/');
    console.log(result.toString());
}
catch (error) {
    console.error('Error checking imports:', error.message);
}
