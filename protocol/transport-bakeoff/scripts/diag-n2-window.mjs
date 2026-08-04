#!/usr/bin/env node
/**
 * MECHANISM DIAGNOSTIC — not a block of record, not admissible under §19.9.
 *
 * §19.7 fixes N=2 at batch size M, so the Phase-3 record contains exactly one concurrency point and
 * cannot say *why* Candidate A's aggregate throughput is flat from N=1 to N=2. Two mechanisms are
 * consistent with the recorded block and predict opposite things:
 *
 *   H_credit  — A's producer is permitted only `maxInflightBatches` (4) batches per stream, so the
 *               bytes it may run ahead is 4 x batch: 0.98 MB at S, 9.75 MB at M, 48.75 MB at L.
 *               If A's N=2 ceiling comes from that window emptying while the shared JS main thread
 *               services the other stream, A's N=2 aggregate must rise steeply with batch size.
 *   H_delivery— A's ceiling is in WebView2's own WebSocket receive path, which is opaque and
 *               per-renderer. Then A's N=2 aggregate is ~flat across batch size, exactly as its
 *               N=1 throughput already is (500 / 542 / 474 MB/s at S / M / L).
 *
 * The instrument is UNMODIFIED — this only invokes the committed release binary at a batch size
 * §19.7 did not schedule for N=2. Artifacts land in a separate directory so they can never be
 * mistaken for §19's blocks of record.
 *
 *   node scripts/diag-n2-window.mjs S|M|L
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const cfg = (process.argv[2] ?? '').toUpperCase();
if (!['S', 'M', 'L'].includes(cfg)) {
  console.error('usage: node scripts/diag-n2-window.mjs S|M|L');
  process.exit(2);
}

const exe = join(root, 'target', 'release', 'transport-bakeoff.exe');
if (!existsSync(exe)) {
  console.error(`missing ${exe} — run: cargo build --release`);
  process.exit(2);
}
const outDir = join(root, 'results', 'phase3-diagnostic');
mkdirSync(outDir, { recursive: true });

/**
 * §19.7 wants a fresh browser per block; a reused window is §8's "background tab" hazard. Kill ONLY
 * the Edge processes running out of this diagnostic's isolated profile — `taskkill /IM msedge.exe`
 * would take the operator's own browsing session with it, which no measurement is worth.
 */
function killOurEdge(label) {
  const profile = join(outDir, 'edge-profile');
  const ps = `Get-CimInstance Win32_Process -Filter "name='msedge.exe'" | Where-Object { $_.CommandLine -like '*${profile.replace(/\\/g, '\\\\')}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`;
  const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], { encoding: 'utf8' });
  console.log(`[diag] ${label}: isolated-profile Edge processes terminated (rc ${r.status})`);
}

killOurEdge('pre-launch');
await new Promise((r) => setTimeout(r, 1500));

console.log(`[diag] N=2 at batch size ${cfg} — mechanism diagnostic, NOT a block of record`);
const started = Date.now();
const child = spawn(
  exe,
  ['--phase2', '--config', cfg, '--phase3', '--n2', '--launch', '--out-dir', outDir],
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
);

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

const deadline = started + 600_000;
while (!reportPath && Date.now() < deadline && child.exitCode === null) {
  await new Promise((r) => setTimeout(r, 500));
}
await new Promise((r) => setTimeout(r, 1000));
try {
  spawnSync('taskkill', ['/PID', String(child.pid), '/F', '/T']);
} catch {
  /* already gone */
}

killOurEdge('post-run');
const elapsed = ((Date.now() - started) / 1000).toFixed(1);
if (!reportPath) {
  console.error(`[diag] NO REPORT after ${elapsed}s`);
  process.exit(1);
}
console.log(`[diag] ${cfg} done in ${elapsed}s -> ${reportPath}`);
