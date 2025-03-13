"use strict";
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const scriptsDir = __dirname;
// Define the files and their import adjustments
const fileImportFixes = [
    {
        file: 'analysis/analyze/analyze-mock-coverage.ts',
        replacements: [
            {
                oldImport: '../src/analyzers/istanbul',
                newImport: '../../../src/analyzers/istanbul'
            }
        ]
    },
    {
        file: 'analysis/correlate/correlate-coverage.ts',
        replacements: [
            {
                oldImport: '../src/scanners/ComponentHierarchyScanner',
                newImport: '../../../src/scanners/ComponentHierarchyScanner'
            }
        ]
    },
    {
        file: 'generate/generate-html-report.ts',
        replacements: [
            {
                oldImport: '../export/export-coverage',
                newImport: '../export/export-coverage'
            }
        ]
    }
    // Add more file updates as needed
];
// Helper function to update imports in a file
function updateImportsInFile(filePath, replacements) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        for (const replacement of replacements) {
            const oldImportPattern = new RegExp(`from ['"](${replacement.oldImport})['"]`, 'g');
            const oldRequirePattern = new RegExp(`require\\(['"](${replacement.oldImport})['"]\\)`, 'g');
            if (oldImportPattern.test(content) || oldRequirePattern.test(content)) {
                content = content.replace(oldImportPattern, `from '${replacement.newImport}'`);
                content = content.replace(oldRequirePattern, `require('${replacement.newImport}')`);
                hasChanges = true;
            }
        }
        if (hasChanges) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated imports in ${filePath}`);
            return true;
        }
        else {
            console.log(`No matching imports found in ${filePath}`);
            return false;
        }
    }
    else {
        console.log(`File not found: ${filePath}`);
        return false;
    }
}
// Fix imports in files
console.log('Fixing imports in moved files...');
for (const fix of fileImportFixes) {
    const filePath = path.join(scriptsDir, fix.file);
    updateImportsInFile(filePath, fix.replacements);
}
// Helper function to scan a file for relative imports and suggest updates
function scanFileForRelativeImports(filePath, rootDir, currentDir) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativeImports = [];
        // Find all relative imports
        const importRegex = /from ['"](\.\/.+?)['"]/g;
        const requireRegex = /require\(['"](\.\/.+?)['"]\)/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            relativeImports.push(match[1]);
        }
        while ((match = requireRegex.exec(content)) !== null) {
            relativeImports.push(match[1]);
        }
        if (relativeImports.length > 0) {
            console.log(`\nFound ${relativeImports.length} relative imports in ${filePath}`);
            // Calculate relative path from current file to root
            const relativeToRoot = path.relative(currentDir, rootDir) || '.';
            console.log('Imports:', relativeImports);
            console.log('Suggested updates:');
            for (const importPath of relativeImports) {
                const importedFile = path.basename(importPath);
                console.log(`  - "${importPath}" might need to be updated based on its new location`);
            }
        }
        return relativeImports;
    }
    catch (err) {
        console.error(`Error scanning file ${filePath}:`, err);
        return [];
    }
}
// Scan for relative imports in specific files
console.log('\nScanning critical files for other imports that might need updating...');
const filesToScan = [
    'analysis/correlate/correlate-coverage.ts',
    'generate/generate-html-report.ts',
    'run/run-instrumented-coverage.ts'
];
for (const file of filesToScan) {
    const filePath = path.join(scriptsDir, file);
    if (fs.existsSync(filePath)) {
        scanFileForRelativeImports(filePath, scriptsDir, path.dirname(filePath));
    }
}
console.log('\nImport fixing complete!');
console.log('NOTE: Some imports may still need manual adjustment.');
console.log('Check for any errors when running scripts from their new locations.');
console.log('\nIf you continue to encounter import errors, you may need to update the imports manually or add them to this script.');
