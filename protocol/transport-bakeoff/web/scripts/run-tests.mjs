// Bundles and runs the TS regression suite under node. esbuild is already a dev dependency, so
// this needs no new tooling.
import { build } from 'esbuild';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = join(tmpdir(), `bakeoff-regression-${process.pid}.mjs`);
await build({
  entryPoints: ['src/regression.test.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  outfile: out,
  logLevel: 'error',
});
await import(pathToFileURL(out).href);
