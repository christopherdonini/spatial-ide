#!/usr/bin/env node
/**
 * Phase 3 block runner (README §19).
 *
 * One invocation = one configuration = ONE block of 10 pairs (20 timed runs), plus the two untimed
 * verification transfers §19.5 requires. Committed rather than run by hand for the same reason
 * `run-phase2.mjs` is: §8 makes "different machine state between adapters" inadmissible, and an
 * ad-hoc manual sequence is exactly where that creeps in.
 *
 * **It does not read, filter, judge, or retry a block.** Admissibility is decided from the artifact
 * against §8, §16.8 and §19.8 — never here. §19.7 allows a block to be replaced **whole, at most
 * once**; that second attempt is a second invocation, deliberately, so a retry is always a visible
 * operator act rather than something a loop did quietly.
 *
 * Usage:  node scripts/run-phase3.mjs S|M|L|N2 [--timeout-s 1800]
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const arg = (process.argv[2] ?? '').toUpperCase();
if (!['S', 'M', 'L', 'N2'].includes(arg)) {
  console.error('usage: node scripts/run-phase3.mjs S|M|L|N2 [--timeout-s 1800]');
  process.exit(2);
}
// §19.7: N=2 runs at batch size M, so the concurrency delta is attributable by comparison with the
// M block rather than confounded with a batch-size change.
const config = arg === 'N2' ? 'M' : arg;
const n2 = arg === 'N2';

const tIdx = process.argv.indexOf('--timeout-s');
const timeoutMs = (tIdx > 0 ? Number(process.argv[tIdx + 1]) : 1800) * 1000;

const exe = join(root, 'target', 'release', 'transport-bakeoff.exe');
if (!existsSync(exe)) {
  console.error(`missing ${exe} — run: cargo build --release`);
  process.exit(2);
}

/** A reused Edge window opens a background tab; §8 makes that run inadmissible. Start clean. */
function killEdge(label) {
  const r = spawnSync('taskkill', ['/IM', 'msedge.exe', '/F', '/T'], { encoding: 'utf8' });
  const killed = (r.stdout ?? '').includes('SUCCESS');
  console.log(`[run-phase3] ${label}: edge ${killed ? 'terminated' : 'not running'}`);
}

killEdge('pre-launch');
await new Promise((r) => setTimeout(r, 1500));

// §19.7's restart policy: a fresh server process and a fresh browser profile per configuration
// block, and no restart *within* a block — a mid-block restart is itself an order effect.
console.log(
  `[run-phase3] ${arg} — fresh process; block = 10 pairs (20 timed runs)` +
    (n2 ? ' at N=2, batch size M' : `, batch size ${config}`),
);
const started = Date.now();
const serverArgs = ['--phase2', '--config', config, '--phase3', '--launch'];
if (n2) serverArgs.push('--n2');
const child = spawn(exe, serverArgs, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });

let reportPath = null;
let buf = '';
const onData = (d) => {
  const s = d.toString();
  process.stdout.write(s);
  buf += s;
  const m = buf.match(/report written: (.+\.json)/);
  if (m && !reportPath) reportPath = m[1].trim();
};
child.stdout.on('data', onData);
child.stderr.on('data', onData);

const deadline = started + timeoutMs;
while (!reportPath && Date.now() < deadline && child.exitCode === null) {
  await new Promise((r) => setTimeout(r, 500));
}

await new Promise((r) => setTimeout(r, 1000));
try {
  spawnSync('taskkill', ['/PID', String(child.pid), '/F', '/T']);
} catch {
  /* already gone */
}
killEdge('post-run');

const elapsed = ((Date.now() - started) / 1000).toFixed(1);
if (!reportPath) {
  console.error(`[run-phase3] NO REPORT after ${elapsed}s — this attempt produced no artifact.`);
  process.exit(1);
}
console.log(`[run-phase3] ${arg} done in ${elapsed}s`);
console.log(`[run-phase3] artifact: ${reportPath}`);
