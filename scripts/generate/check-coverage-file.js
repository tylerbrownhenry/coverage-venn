console.log("Checking coverage.html"); const fs = require("fs"); const path = require("path"); const filePath = path.resolve(__dirname, "../../coverage-project/coverage.html"); const stats = fs.statSync(filePath); console.log("File:", filePath); console.log("Last modified:", stats.mtime); console.log("Size:", stats.size, "bytes");
