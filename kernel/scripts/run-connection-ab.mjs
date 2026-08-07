#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * **The reused-connection S2 cell: reuse-off against reuse-on, interleaved, in one session.**
 *
 * ## Why this is a second driver rather than a flag on `run-slice-probe.mjs`
 *
 * `kernel/scripts/run-slice-probe.mjs` is the instrument that produced the one established cell in
 * `kernel/RESULTS.md` (headless, no pre-warm, whole file, n = 7). It is left **byte-identical** so
 * that cell stays reproducible by the thing that produced it. This driver runs a different
 * procedure — one host process per trial, two connection modes interleaved — and a procedure change
 * hidden behind a flag on a shared instrument is how a cell quietly stops describing what its name
 * says. The canary, admission, disk-guard and pin logic below are deliberately the same rules,
 * restated here rather than shared, and that duplication is the cost of not touching the other one.
 *
 * `frontends/canvas-probe` and its `run-probe.mjs` are used **unchanged**: `t_query_start` and
 * `t_open` are defined and placed exactly where `kernel/PROBE-PREREGISTRATION.md` §1a puts them,
 * and this pass moves neither. That is one of the two cut-specific invalidators.
 *
 * ## What it can and cannot establish
 *
 * **It measures connection *preparation at open*, not reuse across streams.** One host per trial and
 * one solo stream per page load means no browser trial ever runs on a connection a previous
 * *stream* used. What reuse-on buys here is that a configured connection existed before
 * `t_query_start`; reuse across streams is established by `engine/tests/connection_reuse.rs`, in
 * process, and not by this cell. The results write-up must say so in those words.
 *
 * **No figure here may be compared with the 92.6 ms S2 already in `RESULTS.md`.** Three independent
 * reasons: a different session, a different product tree, and a different procedure (that figure
 * came from one host serving every trial).
 *
 * Usage, from the repository root:
 *   node kernel/scripts/run-connection-ab.mjs \
 *     --data target/fixtures/slice-budgets/polygons-100k.parquet \
 *     --out-prefix target/slice-evidence/connection-ab/polygons-100k \
 *     --extent 2600000,1200000,2612680,1212680 \
 *     --trials-per-mode 7 --pin target/slice-evidence/connection-ab/tree-pin-before.json
 */

import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

const repoRoot = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
  '..',
);
const data = resolve(repoRoot, arg('--data', 'target/fixtures/slice-budgets/polygons-100k.parquet'));
const outPrefix = resolve(repoRoot, arg('--out-prefix', 'target/slice-evidence/connection-ab/run'));
const timeoutMs = arg('--timeout', '300000');
const trialsPerMode = Number(arg('--trials-per-mode', '7'));
const pinFile = arg('--pin', null);
const expectRows = arg('--expect-rows', null) === null ? null : Number(arg('--expect-rows'));
const extentArg = arg('--extent', null);
const extentCrs = arg('--extent-crs', 'EPSG:2056');

/**
 * **The interleaving, declared before the run and not derived from any result.**
 *
 * Seven trials per mode. Rerunning reuse-on alone would produce a new absolute S2 and no defensible
 * delta; running all of one mode and then all of the other would confound the mode with time and
 * order drift on a machine this repository has already caught drifting mid-session. This sequence
 * is balanced across both halves of the run and never lets either mode own a contiguous third of
 * it.
 */
const SEQUENCE = ['off', 'on', 'on', 'off', 'off', 'on', 'on', 'off', 'off', 'on', 'on', 'off', 'off', 'on'];
const MODE_FLAG = { off: 'fresh', on: 'reuse' };

if (SEQUENCE.filter((m) => m === 'off').length !== trialsPerMode ||
    SEQUENCE.filter((m) => m === 'on').length !== trialsPerMode) {
  console.error(
    `the declared sequence carries ${SEQUENCE.filter((m) => m === 'off').length} off / ` +
      `${SEQUENCE.filter((m) => m === 'on').length} on trials, but --trials-per-mode is ` +
      `${trialsPerMode}. The sequence is preregistered; change it there, in the open, or leave it.`,
  );
  process.exit(2);
}

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
// Instruments — the same rules as the established driver, restated
// ---------------------------------------------------------------------------------------------

/**
 * A fixed, transport-insensitive integer loop touching no socket, no browser and no database. Its
 * only job is to answer "was this machine itself while the numbers were taken".
 *
 * **Comparable only with itself.** Not with the Rust harness's canary, and not with a reading from
 * another session — the same instrument read 129.4-136.5 ms in one session and 68.6 ms in another.
 */
const CANARY_ITERS = 200_000_000;
function canaryMs() {
  const t = process.hrtime.bigint();
  let acc = 1;
  for (let i = 0; i < CANARY_ITERS; i++) acc = (Math.imul(acc ^ i, 2654435761) + (i >>> 3)) | 0;
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  if (acc === 0.5) console.log('unreachable');
  return ms;
}
/** Settle first: a reading taken while a browser process tree is still dying measures the teardown. */
const CANARY_SETTLE_MS = 3000;
async function canaryPoint(label) {
  await new Promise((r) => setTimeout(r, CANARY_SETTLE_MS));
  canaryMs(); // discarded warm-up: an idle CPU's first reading measures the governor ramping
  const raw = [canaryMs(), canaryMs(), canaryMs()];
  const min = Math.min(...raw);
  console.log(`canary [${label}] min ${min.toFixed(1)} ms  raw ${raw.map((v) => v.toFixed(1)).join(', ')}`);
  return { label, raw_ms: raw, min_ms: min };
}

function freeBytes() {
  try {
    return Number(
      execFileSync('powershell', ['-NoProfile', '-Command', '(Get-PSDrive C).Free'], { encoding: 'utf8' }).trim(),
    );
  } catch {
    return null;
  }
}
function sweepLeakedProfiles() {
  let removed = 0;
  let resisted = 0;
  for (const e of readdirSync(tmpdir(), { withFileTypes: true })) {
    if (!e.isDirectory() || !e.name.startsWith('canvas-probe-')) continue;
    try {
      rmSync(join(tmpdir(), e.name), { recursive: true, force: true });
      removed += 1;
    } catch {
      resisted += 1;
    }
  }
  return { removed, resisted };
}

/** Nearest rank over a sorted copy — the method every earlier figure in this repository used. */
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

/**
 * Declared invalidators 4-8, enforced rather than described. A trial that fails one is **dropped,
 * counted and reported as dropped** — never repaired, never quietly averaged in.
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
  if (expectRows !== null && rec.rows !== expectRows) reasons.push(`rows ${rec.rows} != expected ${expectRows}`);
  return reasons;
}

// ---------------------------------------------------------------------------------------------
// One host per trial
// ---------------------------------------------------------------------------------------------

/**
 * **Restarted for every trial in both modes, deliberately.**
 *
 * The connection mode is a host-level setting, so interleaving needs a restart at every mode
 * switch. Restarting only at switches would give the two modes different treatments — some trials
 * on a fresh process, some on a warm one — and the difference would be confounded with the thing
 * being measured. Restarting every time makes the restart a constant.
 */
async function startHost(mode) {
  const host = spawn(hostBin, ['--data', data, '--assets', assets, '--duckdb-connections', MODE_FLAG[mode]], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const state = { out: '', err: '' };
  host.stdout.on('data', (d) => (state.out += d.toString()));
  host.stderr.on('data', (d) => (state.err += d.toString()));

  const startedAt = Date.now();
  const launchUrl = await new Promise((ok, fail) => {
    const deadline = Date.now() + 30_000;
    const tick = setInterval(() => {
      const m = state.out.match(/^open\s*:\s*(\S+)$/m);
      if (m) {
        clearInterval(tick);
        ok(m[1]);
      } else if (Date.now() > deadline || host.exitCode !== null) {
        clearInterval(tick);
        // `state.out` may already hold the launch URL and therefore the credential; the token is
        // not in scope yet to redact with, so the captured streams are deliberately not echoed.
        fail(new Error(`the host never printed a URL within 30 s (mode ${mode}); streams withheld: they may carry the session credential`));
      }
    }, 50);
  });
  return { host, state, launchUrl, ready_ms: Date.now() - startedAt };
}

async function stopHost(h) {
  h.host.kill();
  await new Promise((r) => {
    if (h.host.exitCode !== null) return r();
    const deadline = Date.now() + 10_000;
    const tick = setInterval(() => {
      if (h.host.exitCode !== null || Date.now() > deadline) {
        clearInterval(tick);
        r();
      }
    }, 25);
  });
}

/**
 * The producer's own account of what the query ran on.
 *
 * **This, not the flag, is what discharges the "prove which mode ran" invalidator.** A flag records
 * what was asked for. `physical`/`lease`/`already_configured` record what happened.
 */
function connectionFactsFrom(stdout) {
  const line = stdout.match(/^connection\s*:\s*(.+)$/m);
  if (!line) return null;
  const kv = {};
  for (const pair of line[1].trim().split(/\s+/)) {
    const eq = pair.indexOf('=');
    if (eq > 0) kv[pair.slice(0, eq)] = pair.slice(eq + 1);
  }
  return {
    mode: kv.mode ?? null,
    physical_id: kv.physical === undefined ? null : Number(kv.physical),
    lease_generation: kv.lease === undefined ? null : Number(kv.lease),
    already_configured: kv.already_configured === 'true',
  };
}

function urlFor(launchUrl) {
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
  // The established cell: no pre-warm, whole-file query (no bbox on the request), headless.
  u.searchParams.set('prewarm', '0');
  return u.toString();
}

// ---------------------------------------------------------------------------------------------

const MIN_FREE_BYTES = 3 * 1024 * 1024 * 1024;
const freeAtStart = freeBytes();
const sweptBefore = sweepLeakedProfiles();
if (freeAtStart !== null && freeAtStart < MIN_FREE_BYTES) {
  console.error(
    `refusing to run: ${(freeAtStart / 2 ** 30).toFixed(2)} GiB free, below the declared ` +
      `${(MIN_FREE_BYTES / 2 ** 30).toFixed(0)} GiB headroom. A run that fills the disk part-way ` +
      'degrades every timing after that point and cannot say which ones.',
  );
  process.exit(2);
}

const canaryStart = await canaryPoint('start');
const pinBefore = await pinCompare('before the trials');

const trialDir = `${outPrefix}-trials-connection-ab`;
mkdirSync(trialDir, { recursive: true });

console.log(
  `connection A/B: ${SEQUENCE.length} trials, ${trialsPerMode} per mode, one host per trial\n` +
    `sequence: ${SEQUENCE.join(', ')}`,
);

const trials = [];
let canaryMid = null;

for (let i = 0; i < SEQUENCE.length; i++) {
  const mode = SEQUENCE[i];
  const out = join(trialDir, `${String(i).padStart(2, '0')}-${mode}.json`);

  let h = null;
  let entry = {
    index: i,
    mode,
    duckdb_connections_flag: MODE_FLAG[mode],
    artifact: out,
  };
  try {
    h = await startHost(mode);
    entry.host_ready_ms = h.ready_ms;
    const token = new URL(h.launchUrl).hash.replace(/^#/, '');

    const probe = spawn(
      'node',
      [
        'scripts/run-probe.mjs',
        '--url', urlFor(h.launchUrl),
        '--out', out,
        '--timeout', String(timeoutMs),
        '--preregistered', 'kernel/PROBE-PREREGISTRATION.md',
      ],
      { cwd: join(repoRoot, 'frontends', 'canvas-probe'), stdio: ['ignore', 'ignore', 'inherit'] },
    );
    const code = await new Promise((r) => probe.on('exit', r));

    // The stream ends when the page closes; the producer reports its connection facts on the way
    // out. Wait for that line rather than racing the kill — a missing line is invalidator 14 for
    // this trial, and must not be manufactured by killing too early.
    let facts = null;
    const factsDeadline = Date.now() + 5000;
    while (Date.now() < factsDeadline) {
      facts = connectionFactsFrom(h.state.out);
      if (facts) break;
      await new Promise((r) => setTimeout(r, 50));
    }
    entry.connection = facts;
    entry.host_stdout = h.state.out
      .split('\n')
      .map((l) => (token ? l.replaceAll(token, '<redacted>') : l))
      .filter((l) => l.startsWith('connection') || l.startsWith('duckdb conns'));

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
    // **Cut-specific invalidator 14**, per trial: an artifact that cannot say which connection mode
    // actually ran establishes nothing about connection mode.
    // The producer names the mode the way the engine does (`reuse`/`fresh`); this driver names it
    // the way the sequence does (`on`/`off`). Comparing them without the translation would fire
    // invalidator 14 on every trial and look like a real finding.
    if (!facts) reasons.push('the producer reported no connection facts');
    else if (facts.mode !== MODE_FLAG[mode]) {
      reasons.push(`producer reported mode ${facts.mode}, expected ${MODE_FLAG[mode]}`);
    }

    Object.assign(entry, {
      terminal: rec?.terminal?.kind ?? null,
      batches: rec?.batches ?? null,
      rows: rec?.rows ?? null,
      vertices: rec?.vertices ?? null,
      payload_bytes: rec?.payloadBytes ?? null,
      first_batch_bytes: rec?.firstBatchBytes ?? null,
      json_frames_seen: rec?.jsonFramesSeen ?? null,
      segments: seg,
    });
    if (reasons.length) {
      entry.dropped_because = reasons;
      console.log(`  trial ${i} [${mode}]: DROPPED — ${reasons.join('; ')}`);
    } else {
      console.log(
        `  trial ${i} [${mode}]: S2 ${seg.s2_query_start_to_open_ms.toFixed(1)} ms, ` +
          `first pixels ${seg.first_pixels_after_query_start_ms.toFixed(1)} ms, ` +
          `full payload ${seg.full_payload_after_query_start_ms?.toFixed(1)} ms, ${rec.rows} rows, ` +
          `physical ${facts.physical_id} lease ${facts.lease_generation} configured ${facts.already_configured}`,
      );
    }
  } catch (e) {
    entry.dropped_because = [`trial failed: ${e.message}`];
    console.log(`  trial ${i} [${mode}]: DROPPED — ${e.message}`);
  } finally {
    if (h) await stopHost(h);
  }
  trials.push(entry);

  if (canaryMid === null && i + 1 >= Math.floor(SEQUENCE.length / 2)) canaryMid = await canaryPoint('mid');
}

// ---- account for the run --------------------------------------------------------------------

const sweptAfter = sweepLeakedProfiles();
const freeAtEnd = freeBytes();
if (sweptAfter.removed || sweptAfter.resisted) {
  console.error(`swept ${sweptAfter.removed} leaked browser profile(s), ${sweptAfter.resisted} resisted removal`);
}

const canaryEnd = await canaryPoint('end');
await new Promise((r) => setTimeout(r, 20_000));
const canarySettled = await canaryPoint('settled — after 20 s idle');
const pinAfter = await pinCompare('after the trials');

const canaryPoints = [canaryStart, canaryMid, canaryEnd, canarySettled].filter(Boolean);
const canaryMinima = canaryPoints.map((c) => c.min_ms);
const canaryAllRaw = canaryPoints.flatMap((c) => c.raw_ms);
const spread = (v) => (v.length ? (Math.max(...v) - Math.min(...v)) / Math.min(...v) : null);

const SEGMENTS = [
  ['s1_scenario_to_query_start', 's1_scenario_to_query_start_ms'],
  ['s2_query_start_to_open', 's2_query_start_to_open_ms'],
  ['s3_open_to_first_bytes', 's3_open_to_first_bytes_ms'],
  ['s4_first_bytes_to_decoded', 's4_first_bytes_to_decoded_ms'],
  ['s5_decoded_to_first_pixels', 's5_decoded_to_first_pixels_ms'],
  ['first_pixels_after_query_start', 'first_pixels_after_query_start_ms'],
  ['full_payload_after_query_start', 'full_payload_after_query_start_ms'],
];

function cellFor(mode) {
  const admitted = trials.filter((t) => t.mode === mode && !t.dropped_because);
  const dropped = trials.filter((t) => t.mode === mode && t.dropped_because);
  const summary = {};
  for (const [name, key] of SEGMENTS) {
    summary[name] = summarize(admitted.map((t) => t.segments[key]).filter((v) => v !== null && v !== undefined));
  }
  return {
    mode,
    duckdb_connections_flag: MODE_FLAG[mode],
    admitted: admitted.length,
    dropped: dropped.length,
    dropped_detail: dropped.map((t) => ({ index: t.index, why: t.dropped_because })),
    rows: [...new Set(admitted.map((t) => t.rows))],
    batches: [...new Set(admitted.map((t) => t.batches))],
    payload_bytes: [...new Set(admitted.map((t) => t.payload_bytes))],
    first_batch_bytes: [...new Set(admitted.map((t) => t.first_batch_bytes))],
    json_frames_seen: [...new Set(admitted.map((t) => t.json_frames_seen))],
    producer_connection_facts: {
      physical_ids: [...new Set(admitted.map((t) => t.connection?.physical_id))],
      lease_generations: [...new Set(admitted.map((t) => t.connection?.lease_generation))],
      already_configured: [...new Set(admitted.map((t) => t.connection?.already_configured))],
      note:
        'producer-side facts on the producer\'s own clock and counters. They are supporting evidence for WHICH mode ran; they are never subtracted from the browser segments above.',
    },
    summary,
  };
}

const off = cellFor('off');
const on = cellFor('on');

/** Signed delta, reuse-on minus reuse-off. Negative means reuse-on was faster. */
const delta = {};
for (const [name] of SEGMENTS) {
  const a = off.summary[name];
  const b = on.summary[name];
  delta[name] =
    a.n && b.n
      ? { p50_ms: Number((b.p50_ms - a.p50_ms).toFixed(3)), p95_ms: Number((b.p95_ms - a.p95_ms).toFixed(3)) }
      : { note: 'not established: one or both cells admitted no trial' };
}

const bothCellsAdmitted = off.admitted >= 1 && on.admitted >= 1;
const dropsWithinBudget = off.dropped <= 1 && on.dropped <= 1;
const canaryHeld = spread(canaryMinima) !== null && spread(canaryMinima) <= 0.1;
const pinHeld = (!pinBefore.checked || pinBefore.unchanged) && (!pinAfter.checked || pinAfter.unchanged);
const modesProven =
  off.admitted > 0 &&
  on.admitted > 0 &&
  off.producer_connection_facts.already_configured.every((v) => v === false) &&
  on.producer_connection_facts.already_configured.every((v) => v === true);

const artifact = {
  kind: 'preregistered reuse-off / reuse-on S2 contrast, interleaved, one session',
  preregistration:
    'kernel/PROBE-PREREGISTRATION.md, amendment A7, committed before this instrument was run and before any result of this pass was looked at',
  status: 'preregistered, within-session, release build',
  what_this_measures:
    'connection PREPARATION AT OPEN, not reuse across streams. One host process per trial and one solo stream per page load means no browser trial here runs on a connection a previous stream used; what reuse-on buys in this cell is that a configured connection existed before t_query_start. Reuse across streams is established by engine/tests/connection_reuse.rs, in process, and not by this cell.',
  comparison_scope:
    'within-session only. No figure here may be compared with any number from any earlier session, including the 92.6 ms S2 already in kernel/RESULTS.md — that figure came from a different session, a different product tree, and a different procedure (one host serving every trial).',
  procedure:
    'one slice-host process per trial in BOTH modes, so the restart is a constant rather than a treatment; modes interleaved on a preregistered sequence; headless; pre-warm off; whole-file query (no bbox); one solo stream per page load.',
  sequence: SEQUENCE,
  trials_per_mode: trialsPerMode,
  throughput_claim:
    'none; byte totals and durations are recorded side by side and are never divided, and nothing here may cite ADR-012',
  percentile_method: 'nearest rank (sort and index); every raw sample is in this artifact',
  percentile_caveat: `at n = ${trialsPerMode} the nearest-rank p95 IS the maximum sample`,
  index_in_path:
    'NO, and now structurally so: slice-host never calls build_index, and the product planner no longer consults the index at all. Every trial ran WholeFile.',
  dataset: data,
  cells: { off, on },
  delta_on_minus_off: delta,
  canary: {
    instrument: `fixed integer loop, ${CANARY_ITERS} iterations, min of 3 per point; touches no socket, no browser and no database`,
    comparable_only_with_itself: 'a JS canary; NOT comparable with the Rust harness canary, and no ratio between them means anything',
    points: canaryPoints,
    spread_across_minima: spread(canaryMinima),
    spread_across_all_raw_readings: spread(canaryAllRaw),
    declared_threshold: 0.1,
    verdict: canaryHeld
      ? 'the session held: spread across the four minima is within the declared 10 %'
      : 'INVALIDATED — spread across the four minima exceeded the declared 10 %',
  },
  tree_pin: { before: pinBefore, after: pinAfter },
  disk: {
    free_bytes_at_start: freeAtStart,
    free_bytes_at_end: freeAtEnd,
    declared_minimum_headroom_bytes: MIN_FREE_BYTES,
    leaked_profiles_swept_before: sweptBefore,
    leaked_profiles_swept_after: sweptAfter,
  },
  cut_specific_invalidators: {
    fourteen_mode_provable_from_the_artifact: modesProven
      ? 'clear: every admitted reuse-off trial reports a connection that was NOT already configured, and every admitted reuse-on trial reports one that WAS'
      : 'FIRED — the artifact cannot prove which DuckDB connection mode actually ran; no S2 delta is established',
    fifteen_t_open_semantics_unchanged:
      'clear: frontends/canvas-probe and kernel/scripts/run-slice-probe.mjs are untouched by this cut; t_query_start and t_open are defined and placed exactly as PROBE-PREREGISTRATION.md §1a states',
  },
  verdict:
    canaryHeld && pinHeld && bothCellsAdmitted && dropsWithinBudget && modesProven
      ? 'ESTABLISHED — every declared invalidator is clear'
      : 'NOT ESTABLISHED — see canary, tree_pin, dropped counts and cut_specific_invalidators',
  trials,
};

const outFile = `${outPrefix}-connection-ab.json`;
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(artifact, null, 2) + '\n');
console.log(`wrote ${outFile}`);

for (const cell of [off, on]) {
  console.log(
    `${cell.mode.padEnd(3)}: S2 p50 ${cell.summary.s2_query_start_to_open.p50_ms} / p95 ${cell.summary.s2_query_start_to_open.p95_ms} ms · ` +
      `first pixels p50 ${cell.summary.first_pixels_after_query_start.p50_ms} ms · ` +
      `full payload p50 ${cell.summary.full_payload_after_query_start.p50_ms} ms ` +
      `(admitted ${cell.admitted}, dropped ${cell.dropped})`,
  );
}
console.log(`S2 delta (on - off): p50 ${delta.s2_query_start_to_open.p50_ms ?? 'n/a'} ms, p95 ${delta.s2_query_start_to_open.p95_ms ?? 'n/a'} ms`);
console.log(artifact.canary.verdict);
console.log(artifact.verdict);

// **A run that is not reportable must fail, not merely say so in a file nobody opens.**
process.exit(canaryHeld && pinHeld && bothCellsAdmitted && dropsWithinBudget && modesProven ? 0 : 1);
