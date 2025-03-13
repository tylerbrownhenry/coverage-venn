const fs = require('fs'); const file = 'coverage-project/coverage.html'; let content = fs.readFileSync(file, 'utf8');
// Fix comment regex pattern
content = content.replace(/highlightedContent = highlightedContent\.replace\(\/\/\/\(\.\*\?\)\$\/gm/g, "highlightedContent = highlightedContent.replace(/\/\/(.*)$/gm");
// Fix multi-line comment regex pattern
content = content.replace(/highlightedContent = highlightedContent\.replace\(\/\/\*\[sS\]\*\?\*\/\/g/g, "highlightedContent = highlightedContent.replace(/\/\*[\s\S]*?\*\//g");
// Fix function regex pattern
content = content.replace(/highlightedContent = highlightedContent\.replace\(\(function\)s\+\(\[a-zA-Z0-9_\]\+\)\/g/g, "highlightedContent = highlightedContent.replace(/\b(function)\s+([a-zA-Z0-9_]+)/g");
// Fix method regex pattern
content = content.replace(/highlightedContent = highlightedContent\.replace\(\/\.\(\[a-zA-Z0-9_\]\+\)\(\/g/g, "highlightedContent = highlightedContent.replace(/\.([a-zA-Z0-9_]+)\(/g");
fs.writeFileSync(file, content); console.log('Fixed HTML file');
