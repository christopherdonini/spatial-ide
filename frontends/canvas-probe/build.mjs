#!/usr/bin/env node
// Bundles the probe into `dist/`, which is what `slice-host --assets` serves.
//
// Bundled rather than served as loose modules for one reason: `apache-arrow` is a package, and the
// server deliberately serves exactly two filenames (`index.html`, `app.js`) from a whitelist rather
// than becoming a general static file server on a listening socket.

import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outfile: 'dist/app.js',
  sourcemap: true,
  logLevel: 'info',
});

copyFileSync('index.html', 'dist/index.html');
console.log('dist/index.html + dist/app.js');
