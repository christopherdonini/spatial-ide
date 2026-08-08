#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * **Summarizer for the factorial first-batch/pruning pass.** Reads
 * `target/slice-evidence/first-batch/first-batch.json` and prints the tables `kernel/RESULTS.md`'s
 * seventh section is built from.
 *
 * Committed because the tables in a results section have to be reproducible from the artifact
 * rather than transcribed by hand — the same reason the harness itself is committed.
 *
 * ## It scores. It does not decide.
 *
 * The verdict rules are in `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` §8 and this script
 * applies them; it does not have any of its own. In particular "beat" is **p50 lower AND ≥ 42 of 49
 * pairwise comparisons** at n = 7 vs 7, which is the third section's own practice, and a p50 delta
 * alone is never reported as a pass.
 *
 * ## Admissibility is applied before any timing is printed
 *
 * A cell whose trials disagree about the row count, the filter plan, the cut policy or the wire fold
 * is **inadmissible**, and that is a finding ahead of every number in it (§7). Off-declaration
 * trials are *observations* and are never promoted into a cell's statistics.
 *
 * Run: `node scripts/summarize-first-batch.mjs [path-to-first-batch.json]`
 */

import { readFileSync } from 'node:fs';

const path =
  process.argv[2] ?? 'target/slice-evidence/first-batch/first-batch.json';
const art = JSON.parse(readFileSync(path, 'utf8'));

const predicted = new Map(art.predicted_rows.map((p) => [p.viewport, p.rows]));

// ---- cells ---------------------------------------------------------------------------------

/** Trials grouped by cell label, errors kept rather than dropped. */
const cells = new Map();
for (const row of art.trials) {
  const t = row.trial;
  const key = t.cell ?? '(unattributable)';
  if (!cells.has(key)) cells.set(key, []);
  cells.get(key).push({ rep: row.rep, ...t });
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const sorted = (a) => [...a].sort((x, y) => x - y);
/** Nearest-rank percentile. At n = 7 the p95 **is** the maximum sample, and that is stated. */
const pct = (a, p) => {
  if (!a.length) return null;
  const s = sorted(a);
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1))];
};
const fmt = (v, d = 1) => (v === null || v === undefined ? '—' : v.toFixed(d));

function parseCell(label) {
  const [file, plan, batch, view, traced] = label.split('|');
  return { file, plan, batch, view, traced: traced === 'traced' };
}

/** §7's admissibility, applied to one cell. Returns the reasons it is NOT admissible. */
function admissibility(label, trials) {
  const c = parseCell(label);
  const reasons = [];
  const errored = trials.filter((t) => t.error);
  const ok = trials.filter((t) => !t.error);
  if (errored.length) reasons.push(`${errored.length} errored trial(s)`);
  if (!ok.length) return { reasons: ['no successful trial'], ok };

  // **§7 makes `n` an admissibility criterion, not a scoring one, and this is where it belongs.**
  // An earlier revision checked it only inside `beats()`, which meant a short cell was reported as
  // admissible and then quietly declined to score — two different statements to a reader.
  const wantN = !c.traced ? 7 : c.view.includes('quarter') ? 7 : 3;
  if (ok.length !== wantN) reasons.push(`n = ${ok.length}, declared ${wantN}`);

  const rows = new Set(ok.map((t) => t.rows));
  if (rows.size > 1) reasons.push(`row count varies: ${[...rows].join(', ')}`);
  const want = predicted.get(c.view);
  if (want !== undefined && !rows.has(want)) {
    reasons.push(`rows ${[...rows][0]} != predicted ${want}`);
  }
  const folds = new Set(ok.map((t) => t.wire_fold));
  if (folds.size > 1) reasons.push(`wire bytes differ across trials: ${folds.size} distinct folds`);
  const plans = new Set(ok.map((t) => t.filter_plan?.name));
  if (plans.size > 1) reasons.push(`filter_plan varies: ${[...plans].join(', ')}`);
  const cut = new Set(ok.map((t) => t.cut_policy));
  if (cut.size > 1) reasons.push(`cut policy varies: ${[...cut].join(', ')}`);
  const wantCut = c.batch === 'budgeted' ? 'time-budgeted-first-batch' : 'size-only';
  if (!cut.has(wantCut)) reasons.push(`cut policy ${[...cut][0]} != declared ${wantCut}`);
  return { reasons, ok };
}

const summary = [];
for (const [label, trials] of cells) {
  const { reasons, ok } = admissibility(label, trials);
  const fb = ok.map((t) => num(t.first_batch_ms)).filter((v) => v !== null);
  const tot = ok.map((t) => num(t.total_ms)).filter((v) => v !== null);
  const io = ok.map((t) => num(t.read_bytes)).filter((v) => v !== null);
  const cuts = {};
  for (const t of ok) for (const [k, v] of Object.entries(t.cuts ?? {})) cuts[k] = (cuts[k] ?? 0) + v;
  summary.push({
    label,
    ...parseCell(label),
    n: ok.length,
    admissible: reasons.length === 0,
    reasons,
    rows: ok[0]?.rows ?? null,
    plan_name: ok[0]?.filter_plan?.name ?? null,
    plan_detail: ok[0]?.filter_plan ?? null,
    fb,
    fb_p50: pct(fb, 50),
    fb_p95: pct(fb, 95),
    tot_p50: pct(tot, 50),
    io_p50: pct(io, 50),
    payload: ok[0]?.payload_bytes ?? null,
    index_ms: pct(ok.map((t) => num(t.index_build_ms)).filter((v) => v !== null), 50),
    cuts,
    trace: ok.find((t) => t.trace)?.trace ?? null,
  });
}

const byLabel = new Map(summary.map((s) => [s.label, s]));
const find = (file, plan, batch, view, traced = false) =>
  byLabel.get(`${file}|${plan}|${batch}|${view}|${traced ? 'traced' : 'untraced'}`);

// ---- §8's "beat": p50 lower AND >= 42 of 49 pairwise -----------------------------------------

/**
 * Pairwise rank separation. `wins` counts pairs where a candidate sample is strictly below a
 * baseline sample. **Not a p50 delta** — §8 requires both.
 */
function pairwise(cand, base) {
  let wins = 0;
  for (const a of cand) for (const b of base) if (a < b) wins++;
  return { wins, of: cand.length * base.length };
}
const GATE_WINS = 42;
const GATE_OF = 49;

function beats(cand, base) {
  if (!cand || !base || !cand.admissible || !base.admissible) {
    return { verdict: 'unmeasured', note: 'a cell in the pair is inadmissible' };
  }
  if (cand.n !== 7 || base.n !== 7) {
    return { verdict: 'unmeasured', note: `n = ${cand.n} vs ${base.n}, below the declared floor of 7` };
  }
  // A trial that produced no batch has no first-batch time, and a cell short of 7 *timings* is
  // short of the floor even when it has 7 successful trials. Checked separately, because the two
  // counts can differ and only one of them is what the gate is scored on.
  if (cand.fb.length !== 7 || base.fb.length !== 7) {
    return {
      verdict: 'unmeasured',
      note: `first-batch samples ${cand.fb.length} vs ${base.fb.length}, below the declared floor of 7`,
    };
  }
  const p = pairwise(cand.fb, base.fb);
  const p50ok = cand.fb_p50 < base.fb_p50;
  const rankok = p.wins >= GATE_WINS;
  return {
    verdict: p50ok && rankok ? 'BEATS' : 'does not beat',
    p50: `${fmt(cand.fb_p50)} vs ${fmt(base.fb_p50)}`,
    rank: `${p.wins}/${p.of}`,
    note: p50ok && rankok ? '' : !p50ok ? 'p50 not lower' : `rank separation ${p.wins}/${p.of} < ${GATE_WINS}/${GATE_OF}`,
  };
}

// ---- output ------------------------------------------------------------------------------------

const out = [];
const say = (s = '') => out.push(s);

say(`# first-batch factorial — summary`);
say();
say(`preregistration: ${art.preregistration}`);
say(`hardware: ${art.hardware}`);
say(`media: ${art.media}`);
say();
say(`## fixtures`);
say();
say(`| id | bytes | row groups | B2 admissibility | sha256 |`);
say(`|---|---|---|---|---|`);
for (const f of art.fixtures) {
  say(`| \`${f.id}\` | ${f.bytes.toLocaleString('en-US')} | ${f.row_groups} | ${f.b2_admissible} | \`${f.sha256.slice(0, 16)}…\` |`);
}
say();
say(`## canary — every phase, and whether it held`);
say();
say(`| phase | spread | within 10 % |`);
say(`|---|---|---|`);
for (const c of art.canary_spreads) {
  say(`| ${c.phase} | ${(c.spread * 100).toFixed(1)} % | ${c.within ? 'yes' : '**NO**'} |`);
}
const anyOver = art.canary_spreads.some((c) => !c.within);
say();
say(anyOver
  ? '**At least one phase exceeded the declared 10 % canary spread. Every number in that phase is recorded, not established.**'
  : 'Every phase held the declared 10 % bound.');

say();
say(`## inadmissible cells — reported before any timing`);
say();
const bad = summary.filter((s) => !s.admissible);
if (!bad.length) say('None. Every cell reached its declared n with one row count, one plan, one cut policy and one wire fold.');
else {
  say(`| cell | n | reasons |`);
  say(`|---|---|---|`);
  for (const s of bad) say(`| \`${s.label}\` | ${s.n} | ${s.reasons.join('; ')} |`);
}

say();
say(`## every cell`);
say();
say(`| file | plan | batch | viewport | traced | n | rows | plan observed | first batch p50 / p95 | total p50 | read bytes p50 | cuts |`);
say(`|---|---|---|---|---|---|---|---|---|---|---|---|`);
for (const s of summary.sort((a, b) => a.label.localeCompare(b.label))) {
  const cuts = Object.entries(s.cuts).map(([k, v]) => `${k}:${v}`).join(' ');
  say(
    `| ${s.file} | ${s.plan} | ${s.batch} | ${s.view} | ${s.traced ? 'y' : 'n'} | ${s.n} | ${s.rows ?? '—'} | ${s.plan_name ?? '—'} | ${fmt(s.fb_p50)} / ${fmt(s.fb_p95)} | ${fmt(s.tot_p50)} | ${s.io_p50 === null ? '—' : s.io_p50.toLocaleString('en-US')} | ${cuts} |`
  );
}

say();
say(`## the gates`);
say();
say(`"Beat" = p50 lower **and** ≥ ${GATE_WINS}/${GATE_OF} pairwise, per §8. n = 7 vs 7.`);
say();

say(`### Lever A — the time budget`);
say();
say(`| file | plan | viewport | budgeted vs size-only | p50 | rank | budget cuts observed |`);
say(`|---|---|---|---|---|---|---|`);
for (const file of ['S-arrow-raster', 'C-duckdb-raster', 'H-duckdb-hilbert16']) {
  for (const plan of ['scan-only', 'row-groups']) {
    for (const view of ['whole', 'near-quarter', 'far-quarter', '1-64']) {
      const cand = find(file, plan, 'budgeted', view);
      const base = find(file, plan, 'size-only', view);
      if (!cand || !base) continue;
      const r = beats(cand, base);
      say(`| ${file} | ${plan} | ${view} | **${r.verdict}** | ${r.p50 ?? '—'} | ${r.rank ?? '—'} | ${cand.cuts['time-budget'] ?? 0} |`);
    }
  }
}
const budgetFired = summary.reduce((a, s) => a + (s.cuts['time-budget'] ?? 0), 0);
say();
say(`**Total \`time-budget\` cuts across every trial in the pass: ${budgetFired}.**`);

say();
say(`### Lever B1 — clustered layout, against the writer control`);
say();
say(`Compared against \`C-duckdb-raster\`, **never** against \`S-arrow-raster\` — §2.`);
say();
say(`| batch | viewport | H vs C | p50 | rank | read bytes H / C |`);
say(`|---|---|---|---|---|---|`);
for (const batch of ['size-only', 'budgeted']) {
  for (const view of ['whole', 'near-quarter', 'far-quarter', '1-64']) {
    const h = find('H-duckdb-hilbert16', 'scan-only', batch, view);
    const c = find('C-duckdb-raster', 'scan-only', batch, view);
    if (!h || !c) continue;
    const r = beats(h, c);
    say(`| ${batch} | ${view} | **${r.verdict}** | ${r.p50 ?? '—'} | ${r.rank ?? '—'} | ${h.io_p50?.toLocaleString('en-US') ?? '—'} / ${c.io_p50?.toLocaleString('en-US') ?? '—'} |`);
  }
}

say();
say(`### The writer confound, priced`);
say();
say(`\`C\` against \`S\` is the same rows in the same order from a different parquet writer. This is the`);
say(`size of the effect that would have been attributed to layout had the control not been written.`);
say();
say(`| batch | viewport | C vs S | p50 | rank |`);
say(`|---|---|---|---|---|`);
for (const batch of ['size-only', 'budgeted']) {
  for (const view of ['whole', 'near-quarter', 'far-quarter', '1-64']) {
    const c = find('C-duckdb-raster', 'scan-only', batch, view);
    const s = find('S-arrow-raster', 'scan-only', batch, view);
    if (!c || !s) continue;
    const r = beats(c, s);
    say(`| ${batch} | ${view} | ${r.verdict} | ${r.p50 ?? '—'} | ${r.rank ?? '—'} |`);
  }
}

say();
say(`### Lever B2 — row-group pruning, and whether it excluded any IO`);
say();
say(`The gate viewport is **far-quarter** (§8). A plan is not evidence: the read-volume column is.`);
say();
say(`| batch | viewport | plan observed | kept/total | B2 vs ScanOnly | p50 | rank | read bytes B2 / scan | index build p50 |`);
say(`|---|---|---|---|---|---|---|---|---|`);
for (const batch of ['size-only', 'budgeted']) {
  for (const view of ['whole', 'near-quarter', 'far-quarter', '1-64']) {
    const b2 = find('S-arrow-raster', 'row-groups', batch, view);
    const so = find('S-arrow-raster', 'scan-only', batch, view);
    if (!b2 || !so) continue;
    const r = beats(b2, so);
    const d = b2.plan_detail ?? {};
    const kept = d.kept !== undefined ? `${d.kept}/${d.total}` : d.total !== undefined ? `—/${d.total}` : '—';
    say(
      `| ${batch} | ${view} | ${b2.plan_name} | ${kept} | **${r.verdict}** | ${r.p50 ?? '—'} | ${r.rank ?? '—'} | ${b2.io_p50?.toLocaleString('en-US') ?? '—'} / ${so.io_p50?.toLocaleString('en-US') ?? '—'} | ${fmt(b2.index_ms, 1)} ms |`
    );
  }
}

say();
say(`### How much DuckDB already prunes, with no index in the path`);
say();
say(`The baseline the whole pass rests on: read volume of a plain \`ScanOnly\` query as a share of the`);
say(`file. Nothing was injected and nothing was built.`);
say();
say(`| file | viewport | read bytes | file bytes | share |`);
say(`|---|---|---|---|---|`);
for (const f of art.fixtures) {
  for (const view of ['whole', 'near-quarter', 'far-quarter', '1-64']) {
    const c = find(f.id, 'scan-only', 'size-only', view);
    if (!c || c.io_p50 === null) continue;
    say(`| ${f.id} | ${view} | ${c.io_p50.toLocaleString('en-US')} | ${f.bytes.toLocaleString('en-US')} | ${((c.io_p50 / f.bytes) * 100).toFixed(1)} % |`);
  }
}

say();
say(`### Traced twins — the segment decomposition`);
say();
say(`**Untraced cells carry every verdict — all of them, including the quarter viewports. §5 is`);
say(`unambiguous: "Untraced carries the verdict; traced supplies the decomposition."** No row below is`);
say(`verdict-bearing. \`dropped\` prints beside each, and **only** \`query\` and \`source_to_first_batch\``);
say(`are derivable from a trace that dropped.`);
say();
say(`**Each row is ONE representative trial, not a summary of the cell.** The aggregate over all`);
say(`traced trials is printed under the table; an earlier draft of the seventh section read these`);
say(`single samples as if they were per-cell ranges.`);
say();
say(`| cell | trials in cell | dropped | query ms | source→first batch ms | untraced first-batch p50 |`);
say(`|---|---|---|---|---|---|`);
for (const s of summary.filter((x) => x.traced).sort((a, b) => a.label.localeCompare(b.label))) {
  const twin = byLabel.get(s.label.replace('|traced', '|untraced'));
  const t = s.trace ?? {};
  say(
    `| ${s.file} / ${s.plan} / ${s.batch} / ${s.view} | ${s.n} | ${t.dropped ?? '—'} | ${fmt(t.query_ms)} | ${fmt(t.source_to_first_batch_ms)} | ${fmt(twin?.fb_p50)} |`
  );
}

// The aggregate the section must quote, over EVERY traced trial rather than one per cell.
{
  const all = art.trials.map((r) => r.trial).filter((t) => t.trace && !t.error);
  const q = all.map((t) => t.trace.query_ms).filter((v) => v !== null && v !== undefined);
  const sf = all
    .map((t) => t.trace.source_to_first_batch_ms)
    .filter((v) => v !== null && v !== undefined);
  const drops = all.map((t) => t.trace.dropped);
  say();
  say(`**Over all ${all.length} traced trials:**`);
  say();
  say(`| segment | min | p50 | max | trials above 0.1 ms |`);
  say(`|---|---|---|---|---|`);
  say(`| \`query\` | ${fmt(Math.min(...q), 3)} | ${fmt(pct(q, 50), 3)} | ${fmt(Math.max(...q), 3)} | — |`);
  say(
    `| \`source_to_first_batch\` | ${fmt(Math.min(...sf), 3)} | ${fmt(pct(sf, 50), 3)} | ${fmt(Math.max(...sf), 3)} | ${sf.filter((v) => v > 0.1).length} / ${sf.length} |`
  );
  say();
  say(`\`dropped_records\`: max ${Math.max(...drops)} across every traced trial.`);
}

console.log(out.join('\n'));
