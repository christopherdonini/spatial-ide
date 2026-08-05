#!/usr/bin/env node
/**
 * Runs the whole slice under measurement: `slice-host` (release) + the browser probe + a memory
 * sampler on the host process.
 *
 * Why this exists as a script rather than as steps in a document: the producer-only memory figure
 * requires the producer to be its **own process**, which the in-process Rust harness
 * (`kernel/tests/slice_budgets.rs`) cannot give — there both ends share one process and one set of
 * counters. Here the host is the producer and the browser is the consumer, so
 * `PrivateMemorySize64` for the host process is a producer figure and says so.
 *
 * What it does NOT establish:
 *   - No throughput claim, and nothing here may cite ADR-012 (its open risk 3).
 *   - No frame-time figure. The 2D canvas probe is not the renderer module; see RESULTS.md.
 *   - Headless is the default and it changes the compositor path. The artifact records which ran.
 *
 * Usage (from the repository root):
 *   node kernel/scripts/run-slice-probe.mjs \
 *     --data target/fixtures/polygons-100k.parquet \
 *     --out-prefix target/slice-evidence/polygons-100k [--headed] [--timeout 300000]
 */

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(name);

const repoRoot = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '..');
const data = resolve(repoRoot, arg('--data', 'target/fixtures/polygons-100k.parquet'));
const outPrefix = resolve(repoRoot, arg('--out-prefix', 'target/slice-evidence/slice-probe'));
const timeoutMs = arg('--timeout', '300000');
const headed = flag('--headed');

const hostBin = join(repoRoot, 'target', 'release', process.platform === 'win32' ? 'slice-host.exe' : 'slice-host');
if (!existsSync(hostBin)) {
  console.error(`no release host at ${hostBin} — build it first:\n  cargo build --release -p spatial-kernel --bin slice-host`);
  process.exit(2);
}
if (!existsSync(data)) {
  console.error(`no dataset at ${data}`);
  process.exit(2);
}

const assets = join(repoRoot, 'frontends', 'canvas-probe', 'dist');
if (!existsSync(join(assets, 'app.js'))) {
  console.error(`no consumer bundle at ${assets} — build it first:\n  cd frontends/canvas-probe && npm install && npm run build`);
  process.exit(2);
}

// ---------------------------------------------------------------------------------------------

const host = spawn(hostBin, ['--data', data, '--assets', assets], { stdio: ['ignore', 'pipe', 'pipe'] });
let hostOut = '';
let hostErr = '';
host.stdout.on('data', (d) => (hostOut += d.toString()));
host.stderr.on('data', (d) => (hostErr += d.toString()));

const launchUrl = await new Promise((resolveUrl, rejectUrl) => {
  const deadline = Date.now() + 30_000;
  const tick = setInterval(() => {
    const m = hostOut.match(/^open\s*:\s*(\S+)$/m);
    if (m) {
      clearInterval(tick);
      resolveUrl(m[1]);
    } else if (Date.now() > deadline || host.exitCode !== null) {
      clearInterval(tick);
      // `hostOut` may already hold a launch URL, and therefore the credential — the token is not
      // yet in scope here to redact with, so the captured streams are deliberately not echoed.
      rejectUrl(
        new Error(
          'the host never printed a URL within 30 s ' +
            `(stdout ${hostOut.length} B, stderr ${hostErr.length} B, both withheld: they may ` +
            'contain the session credential)',
        ),
      );
    }
  }, 100);
});

// The probe has no metadata endpoint (there is no control plane in this slice), so the dataset's
// extent is handed to it. The fixture tiles a ceil(sqrt(features)) grid of 40 m cells from the
// LV95 origin the generator declares.
/// The session credential, so it can be redacted out of anything this script writes. It lives in
/// the launch URL's fragment, which browsers never transmit — but this script also captures the
/// host's stdout, where that URL was printed.
const token = new URL(launchUrl).hash.replace(/^#/, '');

const extentArg = arg('--extent', null);
// The extent's CRS travels with the extent. ADR-010 rule 1: these are authoritative project-CRS
// coordinates, and they may cross a boundary only carrying CRS identity — the consumer refuses any
// batch whose envelope names a different one rather than drawing it into the wrong frame.
const extentCrs = arg('--extent-crs', 'EPSG:2056');
const url = (() => {
  const u = new URL(launchUrl);
  if (extentArg) {
    const [xmin, ymin, xmax, ymax] = extentArg.split(',');
    u.searchParams.set('xmin', xmin);
    u.searchParams.set('ymin', ymin);
    u.searchParams.set('xmax', xmax);
    u.searchParams.set('ymax', ymax);
  }
  u.searchParams.set('extent_crs', extentCrs);
  return u.toString();
})();

console.log(`host pid ${host.pid}, serving ${data}`);

// ---- the memory sampler, on the producer's own process ---------------------------------------

const samplerScript = join(repoRoot, 'kernel', 'scripts', 'sample-process-memory.ps1');
const sampler = spawn(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', samplerScript, '-TargetPid', String(host.pid), '-IntervalMs', '50'],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);
const samples = [];
let samplerBuf = '';
sampler.stdout.on('data', (d) => {
  samplerBuf += d.toString();
  const lines = samplerBuf.split(/\r?\n/);
  samplerBuf = lines.pop() ?? '';
  for (const line of lines) {
    const [ms, priv, ws] = line.trim().split(',').map(Number);
    if (Number.isFinite(ms) && Number.isFinite(priv)) samples.push({ ms, priv, ws });
  }
});

/** Baseline: the host has opened the dataset and is serving, but nothing has been streamed yet. */
await new Promise((r) => setTimeout(r, 1500));
const baselineCount = samples.length;
const baseline = samples.length
  ? {
      private_commit_bytes: Math.max(...samples.map((s) => s.priv)),
      working_set_bytes: Math.max(...samples.map((s) => s.ws)),
      samples: samples.length,
    }
  : null;
const probeStartedAt = Date.now();

// ---- the browser probe -----------------------------------------------------------------------

const probeOut = `${outPrefix}-canvas-probe${headed ? '-headed' : '-headless'}.json`;
const probeArgs = ['scripts/run-probe.mjs', '--url', url, '--out', probeOut, '--timeout', String(timeoutMs)];
if (headed) probeArgs.push('--headed');

const probe = spawn('node', probeArgs, {
  cwd: join(repoRoot, 'frontends', 'canvas-probe'),
  stdio: 'inherit',
});
const probeCode = await new Promise((r) => probe.on('exit', r));

// ---- stop everything and account for what was sampled ----------------------------------------

sampler.kill();
host.kill();
await new Promise((r) => setTimeout(r, 400));

const during = samples.slice(baselineCount);
const peak = during.length
  ? {
      private_commit_bytes: Math.max(...during.map((s) => s.priv)),
      working_set_bytes: Math.max(...during.map((s) => s.ws)),
      samples: during.length,
    }
  : null;

const artifact = {
  kind: 'producer-process memory during a browser-consumer run',
  status: 'in-situ, within-session, hypothesis-forming for anything comparative',
  comparison_scope:
    'within-session only — the machine drifts between sessions asymmetrically (bake-off README §21 Q1 / §22.1)',
  throughput_claim: 'none; no figure here is a transport throughput result and none may cite ADR-012',
  what_this_process_is:
    'slice-host: the PRODUCER only. The consumer is a separate browser process and its memory is not summed here (WebView2/Chromium child-process totals are a declared gap, not an oversight).',
  counters: {
    private_commit: 'System.Diagnostics.Process.PrivateMemorySize64 (Windows private bytes)',
    working_set: 'System.Diagnostics.Process.WorkingSet64',
    interval_ms: 50,
    outside_these_counters:
      "DuckDB's own streaming buffer IS inside these OS counters but outside the producer-resident payload counter reported by kernel/tests/slice_budgets.rs; the two answer different questions",
  },
  dataset: data,
  headless: !headed,
  compositor_note: headed
    ? 'windowed run'
    : 'headless run — the compositor and GPU path differ from a windowed session, so pixel timings are indicative only',
  baseline_before_any_stream: baseline,
  peak_during_probe: peak,
  probe_wall_ms: Date.now() - probeStartedAt,
  probe_exit_code: probeCode,
  probe_artifact: probeOut,
  // The host prints its launch URL, whose fragment is the session credential. Dropping every line
  // containing a '#' filtered on the *shape* the host happens to print today: change that format
  // and the credential lands in this artifact. Redact the token itself instead, and refuse to write
  // if it survives — the rule `frontends/canvas-probe/scripts/run-probe.mjs` already follows.
  host_stdout: hostOut.split('\n').map((l) => (token ? l.replaceAll(token, '<redacted>') : l)),
};

const memOut = `${outPrefix}-host-memory${headed ? '-headed' : '-headless'}.json`;
mkdirSync(dirname(memOut), { recursive: true });
const memText = JSON.stringify(artifact, null, 2) + '\n';
if (token && memText.includes(token)) {
  console.error('refusing to write an artifact containing the session credential');
  process.exit(1);
}
writeFileSync(memOut, memText);
console.log(`wrote ${memOut}`);
console.log(JSON.stringify({ baseline, peak, probe_exit_code: probeCode }, null, 2));
process.exit(probeCode === 0 ? 0 : 1);
