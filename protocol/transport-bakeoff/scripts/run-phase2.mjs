#!/usr/bin/env node
/**
 * Phase 2 block runner (README §16).
 *
 * One invocation = one configuration = ONE counterbalanced 12-run block. Committed rather than run
 * by hand so a block is reproducible and so the operator sequence cannot silently drift between
 * configurations — the harness's own §8 makes "different machine state between adapters" and
 * "unequal instrumentation" inadmissible, and an ad-hoc manual sequence is where that creeps in.
 *
 * What it does, in order:
 *   1. Kills any running Edge, because a reused window opens the page as a BACKGROUND tab, which
 *      suspends rAF and throttles timers — §8 makes such a run inadmissible.
 *   2. Starts the release binary with --phase2 --config <S|M|L> --launch.
 *   3. Streams the harness's stdout through, and waits for the "report written" line.
 *   4. Kills the server and Edge, and prints the artifact path.
 *
 * It does NOT read, filter, judge, or retry a block. Whether a block is admissible is decided from
 * the artifact against §8/§16.8, never by this script.
 *
 * Usage:  node scripts/run-phase2.mjs S|M|L [--timeout-s 900]
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const config = (process.argv[2] ?? '').toUpperCase();
if (!['S', 'M', 'L'].includes(config)) {
  console.error('usage: node scripts/run-phase2.mjs S|M|L [--timeout-s 900]');
  process.exit(2);
}
const tIdx = process.argv.indexOf('--timeout-s');
const timeoutMs = (tIdx > 0 ? Number(process.argv[tIdx + 1]) : 900) * 1000;

const exe = join(root, 'target', 'release', 'transport-bakeoff.exe');
if (!existsSync(exe)) {
  console.error(`missing ${exe} — run: cargo build --release`);
  process.exit(2);
}

/** A reused Edge window opens a background tab; §8 makes that run inadmissible. Start clean. */
function killEdge(label) {
  const r = spawnSync('taskkill', ['/IM', 'msedge.exe', '/F', '/T'], { encoding: 'utf8' });
  const killed = (r.stdout ?? '').includes('SUCCESS');
  console.log(`[run-phase2] ${label}: edge ${killed ? 'terminated' : 'not running'}`);
}

killEdge('pre-launch');
await new Promise((r) => setTimeout(r, 1500));

console.log(`[run-phase2] config ${config} — starting server, block = ABBA BAAB ABBA (12 runs)`);
const started = Date.now();
const child = spawn(exe, ['--phase2', '--config', config, '--launch'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
});

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

// Give the harness a moment to finish flushing, then take everything down.
await new Promise((r) => setTimeout(r, 1000));
try {
  spawnSync('taskkill', ['/PID', String(child.pid), '/F', '/T']);
} catch {
  /* already gone */
}
killEdge('post-run');

const elapsed = ((Date.now() - started) / 1000).toFixed(1);
if (!reportPath) {
  console.error(`[run-phase2] NO REPORT after ${elapsed}s — this attempt produced no artifact.`);
  process.exit(1);
}
console.log(`[run-phase2] config ${config} done in ${elapsed}s`);
console.log(`[run-phase2] artifact: ${reportPath}`);
