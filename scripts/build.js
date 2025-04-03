const esbuild = require('esbuild');
const path = require('path');

async function build() {
  try {
    const result = await esbuild.build({
      entryPoints: [path.join(__dirname, '../src/cli.ts')],
      bundle: true,
      platform: 'node',
      target: 'node14',
      outfile: path.join(__dirname, '../bin/coverage-venn'),
      format: 'cjs',
      banner: {
        js: '#!/usr/bin/env node',
      },
    });

    console.log('Build completed successfully!');
    
    // Make the output file executable
    const fs = require('fs');
    fs.chmodSync(path.join(__dirname, '../bin/coverage-venn'), '755');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 