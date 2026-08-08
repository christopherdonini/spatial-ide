#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * **The browser-probe layout arm** — `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` A2 and A2.1.
 *
 * One question: the producer-side pass found exactly one measured layout win — at the 1/64 viewport
 * the clustered file reads 12,870,243 B against 25,146,407 B and beats its control 45–47 of 49 on
 * time to first batch, a difference of **1.3 ms**. Does it survive to a pixel?
 *
 * ## Why this exists beside `run-slice-probe.mjs` rather than inside it
 *
 * A2.1 item 1 requires layouts to interleave **within** each viewport × compositor block, and
 * `slice-host` serves **one dataset per process**. `run-slice-probe.mjs` starts one host and loops
 * trials under it, which is right for one file and cannot counterbalance three. So this script
 * restarts the host per trial and rotates the layout by repetition index.
 *
 * **The duplication is real and is recorded as owed rather than hidden**: the canary, the
 * admissibility function and the percentile helper below are the same instruments
 * `run-slice-probe.mjs` carries, and two copies can disagree. They are copied rather than extracted
 * because extracting them would edit the instrument that produced the second and third sections'
 * numbers, and this cut does not re-run those. `kernel/tests/support/mod.rs` made the same call for
 * the same reason and wrote it down.
 *
 * ## What it may not do
 *
 * - **It scores no gate.** B1's gate was decided producer-side and is closed (A2).
 * - **It generates no fixture.** A2.1 item 3: the layout arms are the night's existing artifacts, and
 *   a file produced to be measured by the instrument that will measure it is the confound this cut
 *   spent its most expensive lesson on. This script **refuses** a `--files` entry that is absent.
 * - **Full payload is printed beside first pixels in every cell** and never one without the other.
 * - **A difference below `RESOLVABLE_MS` is `not-resolvable-by-this-instrument`** — not "no effect"
 *   and not a win. Declared in A2.1 before any trial ran, and applied here mechanically.
 *
 * Usage (from the repository root):
 *   node kernel/scripts/run-probe-layout-ab.mjs \
 *     --files 'S=target/…/parcels-145mb.parquet;C=…-duckdb-raster.parquet;H=…-hilbert16.parquet' \
 *     --viewports 'quarter=2600000,1200000,2606340,1206340;1-64=2600000,1200000,2601580,1201580' \
 *     --extent 2600000,1200000,2612680,1212680 \
 *     --out-prefix target/slice-evidence/first-batch/probe --trials 7 [--headed]
 */

import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(name);

const repoRoot = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
  '..',
);
const headed = flag('--headed');
const mode = headed ? 'headed' : 'headless';
const trials = Number(arg('--trials', '7'));
const timeoutMs = arg('--timeout', '300000');
const outPrefix = resolve(repoRoot, arg('--out-prefix', 'target/slice-evidence/first-batch/probe'));
const extentArg = arg('--extent', null);
const extentCrs = arg('--extent-crs', 'EPSG:2056');

/**
 * **The resolvability floor, from A2.1 item 2, declared before any probe number existed.**
 *
 * The third section recorded up to **29 ms** of between-attempt dispersion on a first-pixels p50,
 * across attempts of the same cell on the same tree. Any difference smaller than that is reported as
 * unresolvable by this instrument — which is neither "no effect" nor a win, because at that scale
 * this instrument supports neither.
 */
const RESOLVABLE_MS = 29;

const files = (arg('--files', '') ?? '')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((pair) => {
    const i = pair.indexOf('=');
    const id = pair.slice(0, i);
    const path = resolve(repoRoot, pair.slice(i + 1));
    // A2.1 item 3: existing artifacts only. Refuse rather than generate.
    if (!existsSync(path)) {
      console.error(
        `refused: --files names ${id} at ${path}, which does not exist. This phase measures the ` +
          `run of record's own files and generates nothing (amendment A2.1 item 3).`,
      );
      process.exit(2);
    }
    return { id, path };
  });
if (files.length < 2) {
  console.error('--files needs at least two layouts to compare, as `id=path;id=path`');
  process.exit(2);
}

const viewports = (arg('--viewports', '') ?? '')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((pair) => {
    const i = pair.indexOf('=');
    return { name: pair.slice(0, i), bbox: pair.slice(i + 1) || null };
  });
if (!viewports.length) {
  console.error('--viewports needs at least one `name=xmin,ymin,xmax,ymax`');
  process.exit(2);
}

// ---- instruments copied from `run-slice-probe.mjs` (see the header on the duplication) ----------

/**
 * **Number arithmetic, not `BigInt`, and the iteration count is a tenth of the first attempt's.**
 *
 * The invalidated headless attempt used a 40 M-iteration `BigInt` loop, which cost **4.7 s per
 * sample** and 14 s per canary point. A canary that expensive is a load on the machine it is
 * measuring. This is the same shape at a cost of roughly half a second, which is enough to detect
 * drift and cheap enough not to cause it.
 *
 * **The constant changed between the invalidated attempt and the re-run, and no number crosses
 * between them** — the attempt produced no admissible cell, so there is nothing to carry.
 */
function canaryMs(iters = 20_000_000) {
  const t = process.hrtime.bigint();
  let acc = 0;
  for (let i = 0; i < iters; i++) acc = (acc + (((i << 7) | (i >>> 25)) ^ 0x9e3779b9)) | 0;
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  if (acc === 123) console.log('');
  return ms;
}
function canaryPoint(label) {
  const samples = [canaryMs(), canaryMs(), canaryMs()];
  const min = Math.min(...samples);
  console.log(`canary [${label}] min ${min.toFixed(1)} ms  (${samples.map((v) => v.toFixed(1)).join(', ')})`);
  return { label, samples, min };
}
function pct(values, p) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1))];
}

/** `PROBE-PREREGISTRATION.md` §2's invalidators, enforced rather than described. */
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
  if (inside.some((v) => v === null || v === undefined)) reasons.push('a segment was not recorded');
  else {
    if (inside.some((v) => v < 0)) reasons.push('a negative segment');
    const sum = inside.reduce((a, b) => a + b, 0);
    const fp = seg.first_pixels_after_query_start_ms;
    if (fp === null || fp === undefined) reasons.push('no first-pixels instant');
    else if (Math.abs(sum - fp) > 0.5) reasons.push(`segments do not sum: ${sum.toFixed(3)} vs ${fp.toFixed(3)}`);
  }
  if (seg.full_payload_after_query_start_ms != null && seg.first_pixels_after_query_start_ms != null) {
    if (seg.full_payload_after_query_start_ms < seg.first_pixels_after_query_start_ms) {
      reasons.push('full payload lands before first pixels');
    }
  }
  return reasons;
}

function sha256(path) {
  const h = createHash('sha256');
  h.update(readFileSync(path));
  return h.digest('hex');
}

/**
 * **Remove the browser profiles each trial leaves behind — a defect this script shipped without and
 * that was found in use, not in review.**
 *
 * `run-probe.mjs` creates `canvas-probe-<pid>` under the temp directory per page load and does not
 * remove it. At ~31 MB a profile and 84 page loads that is ~2.6 GB, and
 * `kernel/RESULTS.md`'s second section records the probe **filling the disk during its own
 * measurement** — an instrument consuming the resource it is measuring on. `run-slice-probe.mjs`
 * sweeps for exactly this reason; this script did not, and the first headless block leaked 34
 * profiles before it was noticed. Swept between viewport blocks and again at the end.
 *
 * **Removing the directory is not enough, and that is the finding.** The browser holds its profile
 * open, so `rmSync` fails with EPERM while the process lives — and headless Edge leaves child
 * processes behind after the parent is killed. The first headless block ended with **459** live
 * `msedge.exe` processes holding 44 profiles, and its canary drifted **53 %** against a declared
 * 10 % bound: an instrument that loaded the machine it was measuring, which is the second section's
 * own recorded failure recurring in a new place. So the browsers are killed **by profile match**
 * first, then the directories are removed.
 *
 * **Killed by command-line match, never by image name.** `taskkill /IM msedge.exe` would close the
 * operator's own browser, and the operator is sitting at this machine keeping a window visible for
 * the headed block.
 */
function killLeakedBrowsers() {
  const ps =
    "Get-CimInstance Win32_Process -Filter \"Name='msedge.exe'\" | " +
    "Where-Object { $_.CommandLine -like '*canvas-probe-*' } | " +
    'ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {} }';
  try {
    execFileSync('powershell', ['-NoProfile', '-Command', ps], { stdio: 'ignore', timeout: 30_000 });
  } catch {
    /* a kill that finds nothing is the normal case */
  }
}

function sweepProfiles() {
  killLeakedBrowsers();
  let removed = 0;
  let failed = 0;
  for (const e of readdirSync(tmpdir(), { withFileTypes: true })) {
    if (!e.isDirectory() || !/^canvas-probe-\d+$/.test(e.name)) continue;
    try {
      rmSync(join(tmpdir(), e.name), { recursive: true, force: true });
      removed += 1;
    } catch {
      failed += 1;
    }
  }
  if (removed || failed) console.log(`  swept ${removed} browser profile(s)${failed ? `, ${failed} still held` : ''}`);
  return { removed, failed };
}

// ---- host lifecycle: one per trial, because layouts interleave ----------------------------------

const hostBin = join(repoRoot, 'target', 'release', 'slice-host.exe');
const assets = join(repoRoot, 'frontends', 'canvas-probe', 'dist');
if (!existsSync(hostBin)) {
  console.error(`no slice-host at ${hostBin}; build with: cargo build --release --bin slice-host`);
  process.exit(2);
}

/**
 * **Refuse a page bundle older than the source it is built from.**
 *
 * `frontends/canvas-probe/dist/` is a **gitignored build artifact**, so nothing in the repository
 * makes it track `src/`. The first headless attempt ran against a bundle two days stale, and the
 * page silently ignored **both** `scenario=solo` and `bbox`: every trial streamed the whole 100 000
 * rows under the supersede scenario while being filed as a quarter-viewport solo trial. It did not
 * error, it did not warn, and the timings it produced looked entirely plausible.
 *
 * A staleness check is one `statSync` and it removes the whole class. The row-count assertion below
 * is the second line of defence, and it is what would have caught this one had the check existed and
 * been bypassed.
 */
{
  const bundle = join(assets, 'app.js');
  const src = join(repoRoot, 'frontends', 'canvas-probe', 'src', 'main.ts');
  if (!existsSync(bundle)) {
    console.error(`no probe bundle at ${bundle}; build with: cd frontends/canvas-probe && npm run build`);
    process.exit(2);
  }
  if (existsSync(src) && statSync(bundle).mtimeMs < statSync(src).mtimeMs) {
    console.error(
      `refused: ${bundle} is older than ${src}. A stale bundle silently ignores the scenario and ` +
        `the bbox and produces plausible timings for the wrong query — the failure that invalidated ` +
        `this phase's first attempt. Rebuild: cd frontends/canvas-probe && npm run build`,
    );
    process.exit(2);
  }
}

async function withHost(dataPath, fn) {
  const host = spawn(hostBin, ['--data', dataPath, '--assets', assets], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let out = '';
  host.stdout.on('data', (d) => (out += d.toString()));
  host.stderr.on('data', () => {});
  try {
    const url = await new Promise((res, rej) => {
      const deadline = Date.now() + 30_000;
      const tick = setInterval(() => {
        const m = out.match(/^open\s*:\s*(\S+)$/m);
        if (m) {
          clearInterval(tick);
          res(m[1]);
        } else if (Date.now() > deadline || host.exitCode !== null) {
          clearInterval(tick);
          // Never echoed: the captured stream may hold the session credential.
          rej(new Error('the host never printed a URL within 30 s'));
        }
      }, 50);
    });
    return await fn(url);
  } finally {
    host.kill();
    await new Promise((r) => setTimeout(r, 150));
  }
}

function urlFor(launchUrl, viewport) {
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
  if (viewport.bbox) {
    u.searchParams.set('bbox', viewport.bbox);
    u.searchParams.set('bbox_crs', extentCrs);
  }
  return u.toString();
}

// ---- the trials ---------------------------------------------------------------------------------

const trialDir = `${outPrefix}-trials-${mode}`;
mkdirSync(trialDir, { recursive: true });

const fixtures = files.map((f) => ({
  id: f.id,
  path: f.path,
  bytes: statSync(f.path).size,
  sha256: sha256(f.path),
}));
for (const f of fixtures) console.log(`fixture ${f.id} — ${f.bytes} bytes, sha256 ${f.sha256}`);

console.log(
  `${mode}: ${viewports.length} viewport(s) x ${files.length} layouts x ${trials} trials = ` +
    `${viewports.length * files.length * trials} page loads, layouts interleaved within each block`,
);

const canaries = [canaryPoint(`${mode}-start`)];
const cells = new Map();
const key = (fileId, vp) => `${fileId}|${vp}`;

for (const viewport of viewports) {
  for (let r = 0; r < trials; r++) {
    // A2.1 item 1: rotate the layout by repetition index, so no layout systematically occupies the
    // warm or the cold end of a block. A committed rotation, never a runtime shuffle.
    for (let k = 0; k < files.length; k++) {
      const f = files[(k + r) % files.length];
      const out = join(trialDir, `${f.id}-${viewport.name}-${String(r).padStart(2, '0')}.json`);
      const code = await withHost(f.path, async (launchUrl) => {
        const probeArgs = [
          'scripts/run-probe.mjs',
          '--url', urlFor(launchUrl, viewport),
          '--out', out,
          '--timeout', String(timeoutMs),
          '--preregistered', 'kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md#A2',
        ];
        if (headed) probeArgs.push('--headed');
        const probe = spawn('node', probeArgs, {
          cwd: join(repoRoot, 'frontends', 'canvas-probe'),
          stdio: ['ignore', 'ignore', 'inherit'],
        });
        return await new Promise((res) => probe.on('exit', res));
      });

      // Per trial, not per block: 459 processes accumulated over one block last time, and the
      // damage is done long before the block ends.
      sweepProfiles();

      const cellKey = key(f.id, viewport.name);
      if (!cells.has(cellKey)) {
        cells.set(cellKey, {
          layout: f.id,
          viewport: viewport.name,
          query_bbox: viewport.bbox,
          compositor: mode,
          trials_declared: trials,
          trials: [],
          dropped: [],
        });
      }
      const cell = cells.get(cellKey);
      // **`results.trial` and `results.segments`, not the top level.** `run-probe.mjs` writes a
      // wrapper — kind / status / browser / results / log — and the trial record lives under
      // `results`. An earlier revision of this script read the top level, found `undefined`, and
      // dropped every trial while the page loads themselves were fine. Mirrored from
      // `run-slice-probe.mjs`, which is the copy that was already right.
      let artifact = null;
      if (code === 0 && existsSync(out)) {
        try {
          artifact = JSON.parse(readFileSync(out, 'utf8'));
        } catch (e) {
          artifact = null;
        }
      }
      const rec = artifact?.results?.trial ?? null;
      const seg = artifact?.results?.segments ?? null;
      const reasons = code !== 0
        ? [`probe exited ${code}`]
        : seg
          ? admit(rec, seg)
          : ['the probe produced no segment record — the page did not run the solo scenario'];
      if (reasons.length) {
        cell.dropped.push({ rep: r, reasons });
        console.log(`  drop ${f.id}/${viewport.name}/${r}: ${reasons.join('; ')}`);
      } else {
        cell.trials.push({ rep: r, ...seg, rows: rec.rows, batches: rec.batches, payload_bytes: rec.payloadBytes });
        console.log(
          `  ${f.id}/${viewport.name}/${r}: first pixels ${seg.first_pixels_after_query_start_ms?.toFixed(1)} ms, ` +
            `full payload ${seg.full_payload_after_query_start_ms?.toFixed(1)} ms`,
        );
      }
    }
  }
  sweepProfiles();
  canaries.push(canaryPoint(`${mode}-after-${viewport.name}`));
}
canaries.push(canaryPoint(`${mode}-end`));
const swept = sweepProfiles();

// ---- summary ------------------------------------------------------------------------------------

/**
 * **The rows a viewport must select, asserted rather than noted.**
 *
 * The first attempt at this phase ran with a two-day-stale `dist/` bundle that ignored both
 * `scenario` and `bbox`: every trial streamed the whole 100 000 rows under the supersede scenario
 * while being filed as a quarter-viewport solo trial. Nothing in the instrument noticed, because
 * nothing checked what came back. This does.
 */
const EXPECTED_ROWS = { quarter: 25281, '1-64': 1600, whole: 100000 };

const summary = [...cells.values()].map((c) => {
  const fp = c.trials.map((t) => t.first_pixels_after_query_start_ms).filter((v) => v != null);
  const full = c.trials.map((t) => t.full_payload_after_query_start_ms).filter((v) => v != null);
  const seg = (k) => c.trials.map((t) => t[k]).filter((v) => v != null);
  return {
    ...c,
    admitted: c.trials.length,
    // Full payload is beside first pixels here and in every table derived from this file.
    first_pixels_ms: { p50: pct(fp, 50), p95: pct(fp, 95), samples: fp },
    full_payload_ms: { p50: pct(full, 50), p95: pct(full, 95), samples: full },
    s2_p50: pct(seg('s2_query_start_to_open_ms'), 50),
    s3_p50: pct(seg('s3_open_to_first_bytes_ms'), 50),
    s4_p50: pct(seg('s4_first_bytes_to_decoded_ms'), 50),
    s5_p50: pct(seg('s5_decoded_to_first_pixels_ms'), 50),
    rows: [...new Set(c.trials.map((t) => t.rows))],
    rows_expected: EXPECTED_ROWS[c.viewport] ?? null,
    rows_as_declared:
      EXPECTED_ROWS[c.viewport] === undefined
        ? null
        : c.trials.length > 0 && c.trials.every((t) => t.rows === EXPECTED_ROWS[c.viewport]),
  };
});

for (const c of summary) {
  if (c.rows_as_declared === false) {
    console.error(
      `INSTRUMENT FAILURE: ${c.layout}/${c.viewport} returned rows ${JSON.stringify(c.rows)} ` +
        `against the declared ${c.rows_expected}. The page did not run the window this cell names, ` +
        `so no timing in it means anything. Phase stopped.`,
    );
    process.exitCode = 3;
  }
}

/**
 * A2.1 item 2, applied mechanically. A difference below the declared floor is **not** reported as an
 * effect in either direction, and the wording was fixed before any of these numbers existed.
 */
function compare(aId, bId, viewport) {
  const a = summary.find((c) => c.layout === aId && c.viewport === viewport);
  const b = summary.find((c) => c.layout === bId && c.viewport === viewport);
  if (!a || !b || a.admitted < trials || b.admitted < trials) {
    return { pair: `${aId}-${bId}`, viewport, verdict: 'unmeasured', note: 'a cell is short of its declared n' };
  }
  const d = a.first_pixels_ms.p50 - b.first_pixels_ms.p50;
  return {
    pair: `${aId}-${bId}`,
    viewport,
    delta_first_pixels_p50_ms: d,
    resolvable_floor_ms: RESOLVABLE_MS,
    verdict:
      Math.abs(d) < RESOLVABLE_MS
        ? 'not-resolvable-by-this-instrument'
        : d < 0
          ? `${aId} faster by ${Math.abs(d).toFixed(1)} ms`
          : `${bId} faster by ${Math.abs(d).toFixed(1)} ms`,
  };
}

const comparisons = [];
for (const v of viewports) {
  if (files.some((f) => f.id === 'H') && files.some((f) => f.id === 'C')) {
    comparisons.push(compare('H', 'C', v.name));
  }
  if (files.some((f) => f.id === 'C') && files.some((f) => f.id === 'S')) {
    comparisons.push(compare('C', 'S', v.name));
  }
}

const spread = (() => {
  const mins = canaries.map((c) => c.min);
  return (Math.max(...mins) - Math.min(...mins)) / Math.min(...mins);
})();

const artifact = {
  preregistration: 'kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md#A2',
  scope:
    'the browser-probe layout arm. Scores NO gate: B1 was decided producer-side and is closed. ' +
    'Says nothing about lever A or lever B2, neither of which this path can reach. No comparison ' +
    'with the third section, and none with the producer-side first-batch figures.',
  compositor: mode,
  trials_declared: trials,
  resolvable_floor_ms: RESOLVABLE_MS,
  resolvable_floor_source:
    "kernel/RESULTS.md third section: up to 29 ms between-attempt dispersion on a first-pixels p50. " +
    'Declared in amendment A2.1 before any probe trial ran.',
  percentile_method: 'nearest rank; at n = 7 the p95 IS the maximum sample',
  fixtures,
  canaries,
  canary_spread: spread,
  canary_within_10pct: spread <= 0.1,
  cells: summary,
  comparisons,
  profiles_swept: swept,
};

const outFile = `${outPrefix}-${mode}.json`;
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(artifact, null, 2));

console.log(`\ncanary spread ${(spread * 100).toFixed(1)} % ${spread <= 0.1 ? 'OK' : '**OVER**'}`);
for (const c of comparisons) {
  console.log(`  ${c.pair} @ ${c.viewport}: ${c.verdict}${c.delta_first_pixels_p50_ms != null ? ` (Δp50 ${c.delta_first_pixels_p50_ms.toFixed(1)} ms)` : ''}`);
}
console.log(`→ ${outFile}`);
