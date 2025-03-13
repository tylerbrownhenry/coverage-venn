const fs = require('fs');

// Read the HTML file
const htmlPath = 'coverage-project/coverage.html';
const html = fs.readFileSync(htmlPath, 'utf8');

// Find the function definition and its closing bracket
const funcStartRegex = /function applySyntaxHighlighting\(\) \{/;
const funcEndRegex = /\}\s*\/\/ Call syntax highlighting/;

// Create a pattern to match the entire function
const pattern = new RegExp(`(${funcStartRegex.source}[\\s\\S]*?${funcEndRegex.source})`);

// Fixed version of the function
const fixedFunction = `function applySyntaxHighlighting() {
      // Get all code containers
      const codeBlocks = document.querySelectorAll('.code-container .line-content, .test-file .line-content');
      
      // Process each code block
      codeBlocks.forEach(function(block) {
        if (!block || !block.textContent) return;
        
        // Store original content
        const originalContent = block.innerHTML;
        
        // Apply syntax highlighting
        let highlightedContent = originalContent;
        
        try {
          // Keywords
          highlightedContent = highlightedContent.replace(/\\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|new|try|catch|finally|throw|typeof|instanceof|in|of|class|extends|super|import|export|from|as|async|await|yield|this|true|false|null|undefined)\\b/g, 
            '<span class="keyword">$1</span>');
          
          // Strings
          highlightedContent = highlightedContent.replace(/(['"])(.*?)(['"])/g, 
            '<span class="string">$1$2$3</span>');
          
          // Comments
          highlightedContent = highlightedContent.replace(/\\/\\/(.*?)$/gm, 
            '<span class="comment">//$1</span>');
          
          // Multi-line comments
          highlightedContent = highlightedContent.replace(/\\/\\*([\\s\\S]*?)\\*\\//g, 
            '<span class="comment">/*$1*/</span>');
          
          // Functions and methods
          highlightedContent = highlightedContent.replace(/\\b(function)\\s+([a-zA-Z0-9_]+)/g, 
            '<span class="keyword">$1</span> <span class="function">$2</span>');
          
          // Method calls
          highlightedContent = highlightedContent.replace(/\\.([a-zA-Z0-9_]+)\\(/g, 
            '.<span class="method">$1</span>(');
          
          // Testing library methods
          highlightedContent = highlightedContent.replace(/\\b(describe|it|test|expect|beforeEach|afterEach|beforeAll|afterAll|mock|jest|render|screen|fireEvent|waitFor)\\b/g,
            '<span class="test-method">$1</span>');
        } catch (e) {
          console.error('Error applying syntax highlighting:', e);
        }
        
        // Apply the highlighted content
        block.innerHTML = highlightedContent;
      });
    }
    
    // Call syntax highlighting`;

const fixedHtml = html.replace(pattern, fixedFunction);

// Write the fixed HTML back to the file
fs.writeFileSync(htmlPath, fixedHtml, 'utf8');

console.log('HTML file fixed with complete function replacement!'); 