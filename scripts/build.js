const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  try {
    // Ensure dist directory exists
    const distDir = path.join(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Build main CLI and bundle all dependencies
    await esbuild.build({
      entryPoints: [path.join(__dirname, '../src/cli.ts')],
      bundle: true, // Bundle all dependencies
      platform: 'node',
      target: 'node14',
      outfile: path.join(distDir, 'cli.js'),
      format: 'cjs',
      sourcemap: true,
      external: ['@babel/core', '@babel/parser', '@babel/traverse', '@babel/types'], // Keep these as external deps
    });

    // Build the rest of the source files
    await esbuild.build({
      entryPoints: [
        path.join(__dirname, '../src/index.ts'),
        ...getAllFiles(path.join(__dirname, '../src')).filter(f => !f.endsWith('cli.ts')),
      ],
      bundle: false,
      platform: 'node',
      target: 'node14',
      outdir: distDir,
      format: 'cjs',
      sourcemap: true,
    });

    // Create the CLI executable
    const cliContent = `#!/usr/bin/env node
require('./cli.js');`;
    
    fs.writeFileSync(path.join(distDir, 'coverage-venn'), cliContent);
    fs.chmodSync(path.join(distDir, 'coverage-venn'), '755');

    // Copy package.json with only required dependencies
    const pkg = require('../package.json');
    const distPkg = {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      main: 'index.js',
      bin: {
        'coverage-venn': './coverage-venn'
      },
      dependencies: {
        '@babel/core': pkg.dependencies['@babel/core'],
        '@babel/parser': pkg.dependencies['@babel/parser'],
        '@babel/traverse': pkg.dependencies['@babel/traverse'],
        '@babel/types': pkg.dependencies['@babel/types']
      }
    };
    fs.writeFileSync(
      path.join(distDir, 'package.json'),
      JSON.stringify(distPkg, null, 2)
    );

    // Create default config files
    const defaultConfig = {
      manager: {
        rootDir: 'src/components',
        tracking: {
          hashStoreFile: '.hash-store.json',
          tagStoreFile: '.tag-store.json'
        }
      },
      browserStack: {
        enabled: false
      }
    };
    fs.writeFileSync(
      path.join(distDir, 'default-config.json'),
      JSON.stringify(defaultConfig, null, 2)
    );

    // Create README for the dist
    const readmeContent = `# Coverage Venn Distribution

This is a standalone distribution of Coverage Venn.

## Setup
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

## Usage
Run the CLI:
\`\`\`bash
./coverage-venn scan <directory> [options]
\`\`\`

Options:
- \`-o, --output <path>\`: Output path for coverage report
- \`-c, --config <path>\`: Path to config file (defaults to ./default-config.json)
`;

    fs.writeFileSync(path.join(distDir, 'README.md'), readmeContent);

    console.log('Build completed successfully!');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

function getAllFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

build(); 