const fs = require('fs'); const path = process.argv[2] || 'coverage-project/coverage.html'; let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\/'\(\[\^'\\]\|\\.\)\\*\'\//g, "/'[^']*'/");
content = content.replace(/\"\(\[\^\"\\\]\|\\\.\)\\*\"\//g, '/"[^"]*"/\');
fs.writeFileSync(path, content); console.log('Fixed regex patterns in', path);
