const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: true,
    outfile: './main.js',
    platform: 'node',
    format: 'cjs',
    target: ['node18'],
    external: ['obsidian', 'typescript'],
  })
  .catch(() => process.exit(1));
