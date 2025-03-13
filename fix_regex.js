const fs = require('fs'); const filePath = 'coverage-project/coverage.html'; let html = fs.readFileSync(filePath, 'utf8');
html = html.replace(/('\([^'\]\|\.\)\*')/g, "'[^']*'");
html = html.replace(/("\([^"\]\|\.\)\*")/g, '"[^"]*"');
fs.writeFileSync(filePath, html); console.log('File updated successfully.');
