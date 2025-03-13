#!/usr/bin/env node
"use strict";
/**
 * This script reorganizes the project structure according to the proposed
 * domain-based organization in docs/PROPOSED_STRUCTURE.md.
 *
 * It will:
 * 1. Create the new directory structure
 * 2. Move files to their new locations
 * 3. Update imports in key files
 *
 * Important: This is a starting point. You'll need to review and fix
 * remaining import statements manually. Consider this a helper, not
 * a complete solution.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DRY_RUN = process.argv.includes('--dry-run');
// File mapping from old to new paths
const FILE_MAPPING = [
    // Core files
    { from: 'src/types/index.ts', to: 'src/core/types.ts' },
    { from: 'src/utils/config.ts', to: 'src/core/config.ts' },
    // Coverage area
    { from: 'src/analyzers/istanbul.ts', to: 'src/coverage/analyzers/istanbul.ts' },
    { from: 'src/analyzers/cucumber.ts', to: 'src/coverage/analyzers/cucumber.ts' },
    { from: 'src/analyzers/browserstack.ts', to: 'src/coverage/analyzers/browserstack.ts' },
    { from: 'src/managers/BrowserStackManager.ts', to: 'src/coverage/services/BrowserStackManager.ts' },
    { from: 'src/services/BrowserStackService.ts', to: 'src/coverage/services/BrowserStackService.ts' },
    { from: 'src/reporters/coverage.ts', to: 'src/coverage/reporters/coverage.ts' },
    { from: 'src/reporters/correlation.ts', to: 'src/coverage/reporters/correlation.ts' },
    { from: 'src/reporters/visualization.ts', to: 'src/coverage/reporters/visualization.ts' },
    // Move all instrumentation subdirectories
    // This is handled separately below
    // Component Management
    { from: 'src/scanners/ComponentHierarchyScanner.ts', to: 'src/component-management/scanners/ComponentHierarchyScanner.ts' },
    { from: 'src/managers/component-manager.ts', to: 'src/component-management/managers/component-manager.ts' },
    { from: 'src/managers/component.ts', to: 'src/component-management/managers/component.ts' },
    { from: 'src/managers/HashTrackingManager.ts', to: 'src/component-management/managers/HashTrackingManager.ts' },
    { from: 'src/validators/TestIdValidator.ts', to: 'src/component-management/validators/TestIdValidator.ts' },
    { from: 'src/validators/TestIdGenerator.ts', to: 'src/component-management/validators/TestIdGenerator.ts' },
    // Test Management
    { from: 'src/managers/test-manager.ts', to: 'src/test-management/managers/test-manager.ts' },
    { from: 'src/managers/test.ts', to: 'src/test-management/managers/test.ts' },
    { from: 'src/services/TestMetadataService.ts', to: 'src/test-management/services/TestMetadataService.ts' },
    { from: 'src/test-utils/index.ts', to: 'src/test-management/utils/index.ts' },
    // Shared utilities
    { from: 'src/utils/FileHasher.ts', to: 'src/shared/utils/FileHasher.ts' },
    { from: 'src/managers/TagManager.ts', to: 'src/shared/tags/TagManager.ts' },
];
// New directory structure to create
const DIRECTORIES = [
    'src/core',
    'src/coverage/analyzers',
    'src/coverage/reporters',
    'src/coverage/services',
    'src/component-management/scanners',
    'src/component-management/managers',
    'src/component-management/validators',
    'src/component-management/services',
    'src/test-management/managers',
    'src/test-management/services',
    'src/test-management/utils',
    'src/shared/utils',
    'src/shared/tags',
];
// Special directory that should be moved as a whole
const SPECIAL_DIRS = [
    { from: 'src/instrumentation', to: 'src/coverage/instrumentation' },
];
// First create all the directories
function createDirectories() {
    console.log('Creating new directory structure...');
    DIRECTORIES.forEach(dir => {
        const fullPath = path.join(ROOT_DIR, dir);
        if (!fs.existsSync(fullPath)) {
            console.log(`Creating directory: ${dir}`);
            if (!DRY_RUN) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
        }
    });
}
// Move files according to the mapping
function moveFiles() {
    console.log('\nMoving files to new locations...');
    FILE_MAPPING.forEach(mapping => {
        const fromPath = path.join(ROOT_DIR, mapping.from);
        const toPath = path.join(ROOT_DIR, mapping.to);
        if (fs.existsSync(fromPath)) {
            console.log(`Moving: ${mapping.from} -> ${mapping.to}`);
            if (!DRY_RUN) {
                // Make sure target directory exists
                const toDir = path.dirname(toPath);
                if (!fs.existsSync(toDir)) {
                    fs.mkdirSync(toDir, { recursive: true });
                }
                // Copy file
                fs.copyFileSync(fromPath, toPath);
            }
        }
        else {
            console.log(`Warning: Source file not found: ${mapping.from}`);
        }
    });
    // Handle special directories
    SPECIAL_DIRS.forEach(dir => {
        const fromPath = path.join(ROOT_DIR, dir.from);
        const toPath = path.join(ROOT_DIR, dir.to);
        if (fs.existsSync(fromPath)) {
            console.log(`Moving directory: ${dir.from} -> ${dir.to}`);
            if (!DRY_RUN) {
                // Create target directory if it doesn't exist
                if (!fs.existsSync(toPath)) {
                    fs.mkdirSync(toPath, { recursive: true });
                }
                // Use shell command to copy directory with all contents
                execSync(`cp -R ${fromPath}/* ${toPath}/`);
            }
        }
    });
}
// Update imports in a file to reflect the new structure
function updateImports(filePath, importUpdates) {
    if (DRY_RUN)
        return;
    const fullPath = path.join(ROOT_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
        console.log(`Warning: Cannot update imports in non-existent file: ${filePath}`);
        return;
    }
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    importUpdates.forEach(update => {
        const { from, to } = update;
        const regex = new RegExp(`from\\s+['"]${from}['"]`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `from '${to}'`);
            modified = true;
            console.log(`  Updated import: ${from} -> ${to}`);
        }
    });
    if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in ${filePath}`);
    }
}
// Update some key imports
function updateKeyImports() {
    console.log('\nUpdating imports in key files...');
    // Example of updating imports in a few key files
    // You'll need to add more as needed
    // Update BrowserStackManager imports
    updateImports('src/coverage/services/BrowserStackManager.ts', [
        { from: '../services/BrowserStackService', to: './BrowserStackService' },
        { from: '../services/TestMetadataService', to: '../../test-management/services/TestMetadataService' },
        { from: '../types', to: '../../core/types' },
    ]);
    // Update HashTrackingManager imports
    updateImports('src/component-management/managers/HashTrackingManager.ts', [
        { from: '../utils/FileHasher', to: '../../shared/utils/FileHasher' },
    ]);
    // Update component-manager imports
    updateImports('src/component-management/managers/component-manager.ts', [
        { from: '../scanners/ComponentHierarchyScanner', to: '../scanners/ComponentHierarchyScanner' },
    ]);
    // Update TestIdGenerator imports
    updateImports('src/component-management/validators/TestIdGenerator.ts', [
        { from: './TestIdValidator', to: './TestIdValidator' },
    ]);
}
// Generate a script to help locate import issues
function generateImportFixScript() {
    console.log('\nGenerating import fix helper script...');
    const scriptContent = `#!/usr/bin/env node

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
} catch (error) {
  console.error('Error checking imports:', error.message);
}
`;
    const scriptPath = path.join(ROOT_DIR, 'scripts', 'find-broken-imports.js');
    if (!DRY_RUN) {
        fs.writeFileSync(scriptPath, scriptContent);
        fs.chmodSync(scriptPath, '755');
        console.log('Created helper script: scripts/find-broken-imports.js');
    }
    else {
        console.log('Would create helper script: scripts/find-broken-imports.js');
    }
}
// Main function
function main() {
    console.log('Starting project restructuring...');
    if (DRY_RUN) {
        console.log('*** DRY RUN MODE - No changes will be made ***');
    }
    createDirectories();
    moveFiles();
    updateKeyImports();
    generateImportFixScript();
    console.log('\nRestructuring completed!');
    if (!DRY_RUN) {
        console.log('\nNext steps:');
        console.log('1. Run TypeScript compiler to find broken imports: tsc --noEmit');
        console.log('2. Use scripts/find-broken-imports.js to help locate issues');
        console.log('3. Fix remaining import issues manually');
        console.log('4. Run tests to verify everything still works');
        console.log('5. Update documentation and build scripts as needed');
    }
}
main();
