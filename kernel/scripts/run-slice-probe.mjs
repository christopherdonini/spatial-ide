#!/usr/bin/env node
/**
 * Runs the whole slice under measurement: `slice-host` (release) + the browser probe + a memory
 * sampler on the host process.
 *
 * ## What changed, and why it had to
 *
 * This driver used to take **one page load per compositor path** and its artifacts self-declared
 * `"status": "hypothesis-forming, NOT a preregistered measurement"`. An instrument in that state can
 * report a budget *missed* — one sample over the line is enough to fail it — but it can never
 * license a *met*. `kernel/PROBE-PREREGISTRATION.md` was committed before this file was written; it
 * declares the sample count, the meaning of every segment, and the invalidators, and this driver
 * enforces the invalidators rather than describing them.
 *
 * What it now does:
 *   - **n trials per cell**, cell = (compositor path x query viewport x pre-warm setting); each
 *     trial is its own page load in its own browser process.
 *   - **Segments**, per `PROBE-PREREGISTRATION.md` §1a: query start -> OPEN -> first bytes ->
 *     decoded -> first pixels, and full-payload always beside first-pixels.
 *   - **p50/p95 by nearest rank with every raw sample in the artifact.** At n = 7 the nearest-rank
 *     p95 *is* the maximum sample, and the artifact says so rather than leaving it implied.
 *   - **A four-point canary** (start / mid / end / settled after 20 s idle), min of 3, with the raw
 *     spread disclosed — the declared threshold is 10 % across the four minima.
 *   - **A tree pin comparison** before and after the trials, when `--pin` is given.
 *
 * Why this is a script rather than steps in a document: the producer-only memory figure requires the
 * producer to be its **own process**, which the in-process Rust harness cannot give — there both
 * ends share one process and one set of counters.
 *
 * What it still does NOT establish:
 *   - No throughput claim, and nothing here may cite ADR-012 (its open risk 3).
 *   - No frame-time figure. The 2D canvas probe is not the renderer module; see RESULTS.md.
 *   - No between-session comparison. This machine drifts between sessions asymmetrically.
 *   - Nothing about macOS or Linux.
 *
 * Usage (from the repository root):
 *   node kernel/scripts/run-slice-probe.mjs \
 *     --data target/fixtures/slice-budgets/polygons-100k.parquet \
 *     --out-prefix target/slice-evidence/polygons-100k \
 *     --extent 2600000,1200000,2612680,1212680 \
 *     --viewports 'full=;quarter=2600000,1200000,2606340,1206340' \
 *     --trials 7 [--headed] [--no-prewarm] [--pin target/slice-evidence/tree-pin-before.json]
 */

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
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
const prewarm = !flag('--no-prewarm');
const trials = Number(arg('--trials', '7'));
const pinFile = arg('--pin', null);

/**
 * `name=xmin,ymin,xmax,ymax` pairs separated by `;`. An empty bbox means **no bbox on the request**,
 * i.e. the whole file. These are the *query* viewports; the display extent is `--extent` and is held
 * fixed across all of them, so only the query changes and the draw transform does not.
 */
const viewports = (arg('--viewports', 'full=') ?? 'full=')
  .split(';')
  .filter(Boolean)
  .map((spec) => {
    const eq = spec.indexOf('=');
    const name = spec.slice(0, eq >= 0 ? eq : spec.length).trim();
    const bbox = eq >= 0 ? spec.slice(eq + 1).trim() : '';
    return { name, bbox: bbox || null };
  });

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
// Instruments
// ---------------------------------------------------------------------------------------------

/**
 * The canary: a fixed, transport-insensitive integer loop touching no socket, no browser and no
 * database. Its only job is to answer "was this machine itself while the numbers were taken".
 *
 * **It is its own instrument and is comparable only with itself.** It is deliberately not compared
 * with the Rust harness's 400 M-iteration canary — a different language, a different loop, a
 * different scale — and no ratio between the two means anything.
 */
const CANARY_ITERS = 200_000_000;
function canaryMs() {
  const t = process.hrtime.bigint();
  let acc = 1;
  for (let i = 0; i < CANARY_ITERS; i++) acc = (Math.imul(acc ^ i, 2654435761) + (i >>> 3)) | 0;
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  // Keep the accumulator live so the loop cannot be eliminated.
  if (acc === 0.5) console.log('unreachable');
  return ms;
}
/**
 * Settle before every canary point.
 *
 * Every trial ends by `taskkill /T`-ing a browser process tree, and the run ends by killing the
 * host and the sampler. A canary reading taken while that teardown is still in flight measures the
 * teardown. In the first headless attempt the *end* point read 367 ms against a 226 ms start — it
 * was taken immediately after `host.kill()` — and invalidated an otherwise clean set of trials.
 * This is an instrument correction (`kernel/PROBE-PREREGISTRATION.md` amendment A5); the 10 %
 * threshold is unchanged.
 */
const CANARY_SETTLE_MS = 3000;
async function canaryPoint(label) {
  await new Promise((r) => setTimeout(r, CANARY_SETTLE_MS));
  // Discarded warm-up. A reading taken on a CPU that has been idle measures how fast the governor
  // ramps, not how fast the machine is; see kernel/PROBE-PREREGISTRATION.md amendment A4.
  canaryMs();
  const raw = [canaryMs(), canaryMs(), canaryMs()];
  const min = Math.min(...raw);
  console.log(`canary [${label}] min ${min.toFixed(1)} ms  raw ${raw.map((v) => v.toFixed(1)).join(', ')}`);
  return { label, raw_ms: raw, min_ms: min };
}

/** Nearest rank over a sorted copy — the same sort-and-index method every earlier figure used. */
function pct(values, p) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const rank = Math.ceil(p * s.length);
  return s[Math.min(Math.max(rank, 1), s.length) - 1];
}
const summarize = (values) =>
  values.length
    ? {
        n: values.length,
        p50_ms: Number(pct(values, 0.5).toFixed(3)),
        p95_ms: Number(pct(values, 0.95).toFixed(3)),
        min_ms: Number(Math.min(...values).toFixed(3)),
        max_ms: Number(Math.max(...values).toFixed(3)),
        samples_ms: values.map((v) => Number(v.toFixed(3))),
      }
    : { n: 0, note: 'no admissible trial' };

async function pinCompare(when) {
  if (!pinFile) return { when, checked: false };
  return new Promise((r) => {
    const p = spawn('node', [join(repoRoot, 'kernel', 'scripts', 'pin-tree.mjs'), '--compare', pinFile], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    p.stdout.on('data', (d) => (out += d.toString()));
    p.stderr.on('data', (d) => (out += d.toString()));
    p.on('exit', (code) => {
      if (code !== 0) console.error(`TREE MOVED (${when}):\n${out}`);
      r({ when, checked: true, unchanged: code === 0, detail: out.trim() });
    });
  });
}

// ---------------------------------------------------------------------------------------------

const canaryStart = await canaryPoint('start');
const pinBefore = await pinCompare('before the trials');

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

/// The session credential, so it can be redacted out of anything this script writes. It lives in
/// the launch URL's fragment, which browsers never transmit — but this script also captures the
/// host's stdout, where that URL was printed.
const token = new URL(launchUrl).hash.replace(/^#/, '');

// The probe has no metadata endpoint (there is no control plane in this slice), so the dataset's
// display extent is handed to it. The extent's CRS travels with the extent. ADR-010 rule 1: these
// are authoritative project-CRS coordinates, and they may cross a boundary only carrying CRS
// identity — the consumer refuses any batch whose envelope names a different one rather than
// drawing it into the wrong frame.
const extentArg = arg('--extent', null);
const extentCrs = arg('--extent-crs', 'EPSG:2056');

function urlFor(viewport) {
  const u = new URL(launchUrl);
  if (extentArg) {
    const [xmin, ymin, xmax, ymax] = extentArg.split(',');
    u.searchParams.set('xmin', xmin);
    u.searchParams.set('ymin', ymin);
    u.searchParams.set('xmax', xmax);
    u.searchParams.set('ymax', ymax);
  }
  u.searchParams.set('extent_crs', extentCrs);
  u.searchParams.set('scenario', 'solo');
  if (!prewarm) u.searchParams.set('prewarm', '0');
  if (viewport.bbox) {
    u.searchParams.set('bbox', viewport.bbox);
    u.searchParams.set('bbox_crs', extentCrs);
  }
  return u.toString();
}

console.log(
  `host pid ${host.pid}, serving ${data}\n` +
    `cells: ${viewports.map((v) => v.name).join(', ')} x ${headed ? 'headed' : 'headless'} ` +
    `x prewarm=${prewarm}, ${trials} trials each`,
);

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

// ---- the trials ------------------------------------------------------------------------------

const mode = headed ? 'headed' : 'headless';
const trialDir = `${outPrefix}-trials-${mode}${prewarm ? '' : '-noprewarm'}`;
mkdirSync(trialDir, { recursive: true });

/**
 * Declared invalidators, enforced here rather than described (`PROBE-PREREGISTRATION.md` §2).
 *
 * A trial that fails one of these is **dropped, counted and reported as dropped**. It is never
 * repaired, and it is never quietly averaged in.
 */
function admit(rec, seg) {
  const reasons = [];
  if (!rec) return ['no record'];
  if (rec.terminal?.kind !== 'Completed') reasons.push(`terminal ${rec.terminal?.kind ?? 'none'}`);
  const inside = [
    seg.s2_query_start_to_open_ms,
    seg.s3_open_to_first_bytes_ms,
    seg.s4_first_bytes_to_decoded_ms,
    seg.s5_decoded_to_first_pixels_ms,
  ];
  if (inside.some((v) => v === null)) reasons.push('a segment was not recorded');
  else {
    if (inside.some((v) => v < 0)) reasons.push('a negative segment');
    const sum = inside.reduce((a, b) => a + b, 0);
    const fp = seg.first_pixels_after_query_start_ms;
    if (fp === null) reasons.push('no first-pixels instant');
    else if (Math.abs(sum - fp) > 0.5) reasons.push(`segments do not sum: ${sum.toFixed(3)} vs ${fp.toFixed(3)}`);
  }
  if (seg.full_payload_after_query_start_ms !== null && seg.first_pixels_after_query_start_ms !== null) {
    if (seg.full_payload_after_query_start_ms < seg.first_pixels_after_query_start_ms) {
      reasons.push('full payload lands before first pixels');
    }
  }
  return reasons;
}

const cells = [];
let canaryMid = null;
const totalTrials = viewports.length * trials;
let trialsRun = 0;

for (const viewport of viewports) {
  const cell = {
    viewport: viewport.name,
    query_bbox: viewport.bbox,
    compositor: mode,
    prewarm,
    trials_declared: trials,
    trials: [],
    dropped: [],
  };
  for (let i = 0; i < trials; i++) {
    const out = join(trialDir, `${viewport.name}-${String(i).padStart(2, '0')}.json`);
    const probeArgs = [
      'scripts/run-probe.mjs',
      '--url', urlFor(viewport),
      '--out', out,
      '--timeout', String(timeoutMs),
      '--preregistered', 'kernel/PROBE-PREREGISTRATION.md',
    ];
    if (headed) probeArgs.push('--headed');
    const probe = spawn('node', probeArgs, { cwd: join(repoRoot, 'frontends', 'canvas-probe'), stdio: ['ignore', 'ignore', 'inherit'] });
    const code = await new Promise((r) => probe.on('exit', r));

    let artifact = null;
    try {
      artifact = JSON.parse(readFileSync(out, 'utf8'));
    } catch {
      /* handled below as a dropped trial */
    }
    const rec = artifact?.results?.trial ?? null;
    const seg = artifact?.results?.segments ?? null;
    const reasons = seg ? admit(rec, seg) : ['the probe produced no segment record'];
    if (code !== 0) reasons.push(`probe exit ${code}`);

    const entry = {
      trial: i,
      artifact: out,
      terminal: rec?.terminal?.kind ?? null,
      batches: rec?.batches ?? null,
      rows: rec?.rows ?? null,
      vertices: rec?.vertices ?? null,
      payload_bytes: rec?.payloadBytes ?? null,
      first_batch_bytes: rec?.firstBatchBytes ?? null,
      json_frames_seen: rec?.jsonFramesSeen ?? null,
      reassembly_copies: rec?.reassemblyCopies ?? null,
      batches_sharing_wire_buffer: rec?.batchesSharingWireBuffer ?? null,
      coord_byte_offsets: rec?.coordByteOffsets ?? null,
      segments: seg,
    };
    if (reasons.length) {
      entry.dropped_because = reasons;
      cell.dropped.push(entry);
      console.log(`  ${viewport.name} trial ${i}: DROPPED — ${reasons.join('; ')}`);
    } else {
      cell.trials.push(entry);
      console.log(
        `  ${viewport.name} trial ${i}: first pixels ${seg.first_pixels_after_query_start_ms.toFixed(1)} ms, ` +
          `full payload ${seg.full_payload_after_query_start_ms?.toFixed(1)} ms, ${rec.rows} rows`,
      );
    }

    trialsRun += 1;
    if (canaryMid === null && trialsRun >= Math.floor(totalTrials / 2)) canaryMid = await canaryPoint('mid');
  }

  const pick = (k) => cell.trials.map((t) => t.segments[k]).filter((v) => v !== null && v !== undefined);
  cell.summary = {
    first_pixels_after_query_start: summarize(pick('first_pixels_after_query_start_ms')),
    full_payload_after_query_start: summarize(pick('full_payload_after_query_start_ms')),
    s1_scenario_to_query_start: summarize(pick('s1_scenario_to_query_start_ms')),
    s2_query_start_to_open: summarize(pick('s2_query_start_to_open_ms')),
    s3_open_to_first_bytes: summarize(pick('s3_open_to_first_bytes_ms')),
    s4_first_bytes_to_decoded: summarize(pick('s4_first_bytes_to_decoded_ms')),
    s5_decoded_to_first_pixels: summarize(pick('s5_decoded_to_first_pixels_ms')),
    rows: [...new Set(cell.trials.map((t) => t.rows))],
    batches: [...new Set(cell.trials.map((t) => t.batches))],
    payload_bytes: [...new Set(cell.trials.map((t) => t.payload_bytes))],
    first_batch_bytes: [...new Set(cell.trials.map((t) => t.first_batch_bytes))],
    json_frames_seen: [...new Set(cell.trials.map((t) => t.json_frames_seen))],
    admitted: cell.trials.length,
    dropped: cell.dropped.length,
  };
  cells.push(cell);
}

// ---- stop everything and account for what was sampled ----------------------------------------

sampler.kill();
host.kill();
await new Promise((r) => setTimeout(r, 400));

const canaryEnd = await canaryPoint('end');
await new Promise((r) => setTimeout(r, 20_000));
const canarySettled = await canaryPoint('settled — after 20 s idle');
const pinAfter = await pinCompare('after the trials');

const during = samples.slice(baselineCount);
const peak = during.length
  ? {
      private_commit_bytes: Math.max(...during.map((s) => s.priv)),
      working_set_bytes: Math.max(...during.map((s) => s.ws)),
      samples: during.length,
    }
  : null;

const canaryPoints = [canaryStart, canaryMid, canaryEnd, canarySettled].filter(Boolean);
const canaryMinima = canaryPoints.map((c) => c.min_ms);
const canaryAllRaw = canaryPoints.flatMap((c) => c.raw_ms);
const spread = (v) => (v.length ? (Math.max(...v) - Math.min(...v)) / Math.min(...v) : null);

const artifact = {
  kind: 'preregistered first-pixels trials + producer-process memory',
  preregistration: 'kernel/PROBE-PREREGISTRATION.md, committed before this instrument was built and before any result of this pass was looked at',
  status: 'preregistered, within-session, release build',
  comparison_scope:
    'within-session only — the machine drifts between sessions asymmetrically (bake-off README §21 Q1 / §22.1). No figure here may be compared with any number from any earlier session, including the ones already in kernel/RESULTS.md.',
  throughput_claim: 'none; byte totals and durations are recorded side by side and are never divided, and nothing here may cite ADR-012',
  percentile_method: 'nearest rank (sort and index) over the admitted trials; every raw sample is in this artifact',
  percentile_caveat: `at n = ${trials} the nearest-rank p95 IS the maximum sample; it is reported as p95 for consistency with the method used elsewhere in this repository and is the maximum`,
  index_in_path:
    'NO. slice-host never calls Dataset::build_index, so every trial here ran ScanOnly (with a bbox) or WholeFile (without one). The index segment is structurally absent on this path, not zero.',
  what_this_process_is:
    'slice-host: the PRODUCER only. The consumer is a separate browser process and its memory is not summed here (WebView2/Chromium child-process totals are a declared gap, not an oversight).',
  counters: {
    private_commit: 'System.Diagnostics.Process.PrivateMemorySize64 (Windows private bytes)',
    working_set: 'System.Diagnostics.Process.WorkingSet64',
    interval_ms: 50,
    peak_scope: 'peak over the WHOLE run of all trials in this invocation, not one stream',
    outside_these_counters:
      "DuckDB's own streaming buffer IS inside these OS counters but outside the producer-resident payload counter reported by the Rust harness; the two answer different questions",
  },
  dataset: data,
  headless: !headed,
  prewarm,
  compositor_note: headed
    ? 'windowed run'
    : 'headless run — the compositor and GPU path differ from a windowed session, so pixel timings are indicative only',
  canary: {
    instrument: `fixed integer loop, ${CANARY_ITERS} iterations, min of 3 per point; touches no socket, no browser and no database`,
    comparable_only_with_itself: 'this is a JS canary; it is NOT comparable with the Rust harness canary and no ratio between them means anything',
    points: canaryPoints,
    spread_across_minima: spread(canaryMinima),
    spread_across_all_raw_readings: spread(canaryAllRaw),
    declared_threshold: 0.1,
    verdict:
      spread(canaryMinima) === null
        ? 'not taken'
        : spread(canaryMinima) > 0.1
          ? 'INVALIDATED — spread across the four minima exceeded the declared 10 %'
          : 'the session held: spread across the four minima is within the declared 10 %',
  },
  tree_pin: { before: pinBefore, after: pinAfter },
  baseline_before_any_stream: baseline,
  peak_during_probe: peak,
  probe_wall_ms: Date.now() - probeStartedAt,
  cells,
  // The host prints its launch URL, whose fragment is the session credential. Dropping every line
  // containing a '#' filtered on the *shape* the host happens to print today: change that format
  // and the credential lands in this artifact. Redact the token itself instead, and refuse to write
  // if it survives — the rule `frontends/canvas-probe/scripts/run-probe.mjs` already follows.
  host_stdout: hostOut.split('\n').map((l) => (token ? l.replaceAll(token, '<redacted>') : l)),
};

const memOut = `${outPrefix}-probe-${mode}${prewarm ? '' : '-noprewarm'}.json`;
mkdirSync(dirname(memOut), { recursive: true });
const memText = JSON.stringify(artifact, null, 2) + '\n';
if (token && memText.includes(token)) {
  console.error('refusing to write an artifact containing the session credential');
  process.exit(1);
}
writeFileSync(memOut, memText);
console.log(`wrote ${memOut}`);
for (const cell of cells) {
  console.log(
    `${cell.viewport}: first pixels p50 ${cell.summary.first_pixels_after_query_start.p50_ms} ms / ` +
      `p95 ${cell.summary.first_pixels_after_query_start.p95_ms} ms · full payload p50 ` +
      `${cell.summary.full_payload_after_query_start.p50_ms} ms (admitted ${cell.summary.admitted}, dropped ${cell.summary.dropped})`,
  );
}
console.log(artifact.canary.verdict);

// **A run that is not reportable must fail, not merely say so in a file nobody opens.** The first
// headless attempt exited 0 with an invalidated canary; the artifact said "INVALIDATED" and the
// shell said success.
const anyAdmitted = cells.some((c) => c.trials.length > 0);
const canaryHeld = spread(canaryMinima) !== null && spread(canaryMinima) <= 0.1;
const pinHeld = (!pinBefore.checked || pinBefore.unchanged) && (!pinAfter.checked || pinAfter.unchanged);
process.exit(anyAdmitted && canaryHeld && pinHeld ? 0 : 1);
