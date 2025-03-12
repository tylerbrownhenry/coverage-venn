
// CodeMirror and Interactive Source Code Functions

// Function to toggle line highlighting
function toggleLineHighlight(cm, line) {
  if (!cm) return;
  
  const info = cm.lineInfo(line);
  if (!info) return;
  
  if (info.bgClass === 'CodeMirror-highlighted') {
    cm.removeLineClass(line, 'background', 'CodeMirror-highlighted');
  } else {
    cm.addLineClass(line, 'background', 'CodeMirror-highlighted');
  }
}

// Function to show code tooltip
function showCodeTooltip(event, message) {
  // Remove any existing tooltips
  hideCodeTooltip();
  
  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'source-tooltip';
  tooltip.textContent = message;
  tooltip.id = 'source-tooltip';
  
  // Position tooltip near the cursor
  tooltip.style.left = (event.pageX + 10) + 'px';
  tooltip.style.top = (event.pageY - 40) + 'px';
  
  // Add to document
  document.body.appendChild(tooltip);
  
  // Show tooltip
  tooltip.style.display = 'block';
  
  // Set timeout to hide after 2 seconds
  setTimeout(hideCodeTooltip, 2000);
}

// Function to hide code tooltip
function hideCodeTooltip() {
  const tooltip = document.getElementById('source-tooltip');
  if (tooltip) {
    document.body.removeChild(tooltip);
  }
}

// Function to copy line text to clipboard
function copyLineToClipboard(cm, line) {
  if (!cm) return;
  
  const lineText = cm.getLine(line);
  if (!lineText) return;
  
  navigator.clipboard.writeText(lineText.trim())
    .then(() => {
      const coords = cm.charCoords({line: line, ch: 0}, 'page');
      const event = { pageX: coords.left, pageY: coords.top };
      showCodeTooltip(event, 'Line ' + (line + 1) + ' copied to clipboard');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
}

// Function to enhance source code with CodeMirror
function enhanceSourceCode() {
  if (typeof CodeMirror === 'undefined') {
    console.error('CodeMirror is not available');
    return;
  }
  
  const sourceContainers = document.querySelectorAll('.source-container');
  
  sourceContainers.forEach((container, containerIndex) => {
    const sourceContent = container.querySelector('.source-content');
    if (!sourceContent) return;
    
    const pre = sourceContent.querySelector('pre');
    if (!pre) return;
    
    // Extract source code from the pre element
    const sourceCode = pre.textContent || '';
    const spans = pre.querySelectorAll('span');
    
    // Create a map of covered and uncovered lines
    const coveredLines = [];
    const uncoveredLines = [];
    
    spans.forEach((span, index) => {
      if (span.classList.contains('source-line-covered')) {
        coveredLines.push(index);
      } else if (span.classList.contains('source-line')) {
        uncoveredLines.push(index);
      }
    });
    
    // Get language from file extension
    const pathElement = container.closest('.component')?.querySelector('.file-path');
    const filePath = pathElement ? pathElement.textContent : '';
    const fileExtension = filePath.split('.').pop();
    let mode = 'javascript'; // Default
    
    // Map file extensions to CodeMirror modes
    switch(fileExtension) {
      case 'js':
        mode = 'javascript';
        break;
      case 'ts':
        mode = 'text/typescript';
        break;
      case 'jsx':
        mode = 'jsx';
        break;
      case 'tsx':
        mode = 'text/typescript-jsx';
        break;
      case 'html':
        mode = 'htmlmixed';
        break;
      case 'css':
        mode = 'css';
        break;
      default:
        mode = 'javascript';
    }
    
    // Add ID to container for reference
    container.id = container.id || 'source-container-' + containerIndex;
    
    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'source-toolbar';
    
    // Add file path
    const filePathDiv = document.createElement('div');
    filePathDiv.className = 'file-path';
    filePathDiv.textContent = filePath || 'Source Code';
    toolbar.appendChild(filePathDiv);
    
    // Add toolbar actions
    const actions = document.createElement('div');
    actions.className = 'toolbar-actions';
    
    // Add fold all button
    const foldAllBtn = document.createElement('button');
    foldAllBtn.textContent = 'Fold All';
    foldAllBtn.onclick = () => {
      if (cmInstance && cmInstance.operation) {
        cmInstance.operation(() => {
          for (let i = 0; i < cmInstance.lineCount(); i++) {
            if (cmInstance.getLine(i).trim().endsWith('{')) {
              cmInstance.foldCode({line: i, ch: 0});
            }
          }
        });
      }
    };
    actions.appendChild(foldAllBtn);
    
    // Add unfold all button
    const unfoldAllBtn = document.createElement('button');
    unfoldAllBtn.textContent = 'Unfold All';
    unfoldAllBtn.onclick = () => {
      if (cmInstance && cmInstance.operation) {
        cmInstance.operation(() => {
          for (let i = 0; i < cmInstance.lineCount(); i++) {
            cmInstance.unfold({line: i, ch: 0});
          }
        });
      }
    };
    actions.appendChild(unfoldAllBtn);
    
    toolbar.appendChild(actions);
    
    // Insert toolbar before source content
    sourceContent.parentNode.insertBefore(toolbar, sourceContent);
    
    // Clear existing content
    sourceContent.innerHTML = '';
    
    // Create textarea for CodeMirror
    const textarea = document.createElement('textarea');
    textarea.value = sourceCode;
    sourceContent.appendChild(textarea);
    
    // Initialize CodeMirror
    const cmInstance = CodeMirror.fromTextArea(textarea, {
      mode: mode,
      theme: 'default',
      lineNumbers: true,
      readOnly: true,
      lineWrapping: false,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Ctrl-Q': function(cm) {
          cm.foldCode(cm.getCursor());
        }
      }
    });
    
    // Add line classes for coverage
    cmInstance.operation(() => {
      // Add covered line classes
      coveredLines.forEach(lineNum => {
        cmInstance.addLineClass(lineNum, 'background', 'covered-line');
      });
      
      // Add uncovered line classes
      uncoveredLines.forEach(lineNum => {
        cmInstance.addLineClass(lineNum, 'background', 'uncovered-line');
      });
    });
    
    // Add click and dblclick event handlers to lines
    cmInstance.on('gutterClick', (cm, line, gutter, event) => {
      toggleLineHighlight(cm, line);
      const coords = cm.charCoords({line: line, ch: 0}, 'page');
      showCodeTooltip({pageX: coords.left, pageY: coords.top}, 'Line ' + (line + 1));
    });
    
    cmInstance.on('dblclick', (cm, event) => {
      const pos = cm.coordsChar({
        left: event.clientX,
        top: event.clientY
      });
      
      if (pos.line !== undefined) {
        copyLineToClipboard(cm, pos.line);
      }
    });
    
    // Refresh the editor to ensure proper rendering
    setTimeout(() => {
      cmInstance.refresh();
    }, 100);
  });
}

// Add event listener to enhance source code when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add CodeMirror dependency
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/codemirror.min.js', function() {
    // Load additional CodeMirror modes and addons
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/mode/javascript/javascript.min.js', function() {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/mode/jsx/jsx.min.js', function() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/mode/htmlmixed/htmlmixed.min.js', function() {
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/mode/xml/xml.min.js', function() {
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/mode/css/css.min.js', function() {
              loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/addon/fold/foldcode.min.js', function() {
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/addon/fold/foldgutter.min.js', function() {
                  loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/addon/fold/brace-fold.min.js', function() {
                    enhanceSourceCode();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Helper function to load scripts dynamically
function loadScript(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

// Helper function to load stylesheets dynamically
function loadStylesheet(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}
