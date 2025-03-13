const fs = require('fs'); const file = 'coverage-project/coverage.html'; const content = fs.readFileSync(file, 'utf8');
const fixed = content.replace(/'\(\[\^'\\]\|\\.\)\*'/g, "'[^']*'").replace(/"\(\[\^"\\]\|\\.\)\*"/g, '"[^"]*"');
fs.writeFileSync(file, fixed); console.log('Fixed HTML file');
