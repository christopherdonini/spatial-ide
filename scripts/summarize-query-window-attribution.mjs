#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * **Summarizer for the query-window attribution pass.** Reads
 * `target/slice-evidence/query-window-attribution/query-window-attribution.json` and prints the
 * tables `kernel/RESULTS.md`'s eighth section is built from.
 *
 * Committed for the same reason `scripts/summarize-first-batch.mjs` is: a results-section table has
 * to be reproducible from the artifact rather than transcribed by hand.
 *
 * ## It scores. It does not decide.
 *
 * The scoring rule is `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md` §5 and the decision rule
 * is its §6; this script applies both and has no rules of its own. In particular §5's dominance
 * figure is **the p50 of each trial's own segment-share**, never a ratio of the segments' p50s — the
 * two are computed and printed side by side so neither is mistaken for the other.
 *
 * ## Admissibility before any timing
 *
 * A viewport whose trials disagree about the row count, whose `dropped_records` is ever nonzero, or
 * whose additivity did not hold (checked in the harness itself — an inadmissible trial is recorded
 * with an `error`, never with numeric fields) is flagged before any segment number is printed.
 *
 * Run: `node scripts/summarize-query-window-attribution.mjs [path-to-query-window-attribution.json]`
 */

import { readFileSync } from 'node:fs';

const path =
  process.argv[2] ?? 'target/slice-evidence/query-window-attribution/query-window-attribution.json';
const art = JSON.parse(readFileSync(path, 'utf8'));

const predicted = new Map(art.predicted_rows.map((p) => [p.view, p.rows]));

const LEAVES = ['producer_handoff', 'statement_prepare', 'param_assembly', 'bind_and_execute', 'first_fetch'];
const REPORTED_NOT_SCORED = ['lease_bind'];
const COMPOSITES = ['query', 'lease_to_first_row'];
const VIEWS = ['whole', 'near-quarter', '1-64'];
const GATE_VIEW = 'near-quarter';
const DOMINANCE_THRESHOLD = 0.40;

// ---- group trials by viewport, keeping errors rather than dropping them -------------------------

const byView = new Map(VIEWS.map((v) => [v, []]));
for (const row of art.trials) {
  const t = row.trial;
  const key = t.view ?? '(unattributable)';
  if (!byView.has(key)) byView.set(key, []);
  byView.get(key).push({ rep: row.rep, ...t });
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const sorted = (a) => [...a].sort((x, y) => x - y);
/** Nearest-rank percentile, same estimator `summarize-first-batch.mjs` uses. At n = 7 the p95 **is**
 * the maximum sample, and that is stated rather than smoothed over. */
const pct = (a, p) => {
  if (!a.length) return null;
  const s = sorted(a);
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1))];
};
const fmt = (v, d = 3) => (v === null || v === undefined ? '—' : v.toFixed(d));
const fmtPct = (v) => (v === null || v === undefined ? '—' : `${(v * 100).toFixed(1)}%`);

/** §admissibility: reasons a viewport's trials are NOT admissible, applied before any timing. */
function admissibility(view, trials) {
  const reasons = [];
  const errored = trials.filter((t) => t.error);
  const ok = trials.filter((t) => !t.error);
  if (errored.length) reasons.push(`${errored.length} errored trial(s): ${errored.map((t) => t.error).join('; ')}`);
  if (!ok.length) return { reasons: reasons.length ? reasons : ['no successful trial'], ok };

  if (ok.length < 7) reasons.push(`n = ${ok.length}, floor is 7`);

  const rows = new Set(ok.map((t) => t.rows));
  if (rows.size > 1) reasons.push(`row count varies across trials: ${[...rows].join(', ')}`);
  const want = predicted.get(view);
  if (want !== undefined && !rows.has(want)) {
    reasons.push(`rows ${[...rows][0]} != registered prediction ${want}`);
  }
  const dropped = new Set(ok.map((t) => t.dropped_records));
  if ([...dropped].some((d) => d !== 0)) {
    reasons.push(`dropped_records nonzero in at least one trial: ${[...dropped].join(', ')} — preregistration §1 requires zero, asserted not assumed`);
  }
  const plans = new Set(ok.map((t) => t.filter_plan));
  if (plans.size > 1) reasons.push(`filter_plan varies: ${[...plans].join(', ')}`);
  return { reasons, ok };
}

// ---- per-viewport segment stats -------------------------------------------------------------------

const summary = [];
for (const view of VIEWS) {
  const trials = byView.get(view) ?? [];
  const { reasons, ok } = admissibility(view, trials);

  const segStats = {};
  for (const seg of [...LEAVES, ...REPORTED_NOT_SCORED, ...COMPOSITES]) {
    const ms = ok.map((t) => num(t[`${seg}_ms`])).filter((v) => v !== null);
    const ns = ok.map((t) => num(t[`${seg}_ns`])).filter((v) => v !== null);
    segStats[seg] = { ms, ns, p50: pct(ms, 50), p95: pct(ms, 95) };
  }

  // §5: per-trial share of `lease_to_first_row`, for each leaf — the p50 of the shares, **not**
  // `p50(segment) / p50(window)`. Both are computed; only the first is the registered dominance
  // figure.
  const shareStats = {};
  for (const seg of LEAVES) {
    const shares = ok
      .map((t) => {
        const s = num(t[`${seg}_ns`]);
        const w = num(t.lease_to_first_row_ns);
        return s !== null && w !== null && w > 0 ? s / w : null;
      })
      .filter((v) => v !== null);
    shareStats[seg] = {
      p50_of_shares: pct(shares, 50),
      ratio_of_p50s: segStats[seg].p50 !== null && segStats.lease_to_first_row.p50
        ? segStats[seg].p50 / segStats.lease_to_first_row.p50
        : null,
    };
  }

  summary.push({
    view,
    n: ok.length,
    admissible: reasons.length === 0,
    reasons,
    rows: ok[0]?.rows ?? null,
    filter_plan: ok[0]?.filter_plan ?? null,
    reused_connection: [...new Set(ok.map((t) => t.reused_connection))],
    segStats,
    shareStats,
  });
}

const byViewLabel = new Map(summary.map((s) => [s.view, s]));

// ---- output ------------------------------------------------------------------------------------

const out = [];
const say = (s = '') => out.push(s);

say(`# query-window attribution — summary`);
say();
say(`preregistration: ${art.preregistration}`);
say(`hardware: ${art.hardware}`);
say(`media: ${art.media}`);
say(`fixture: ${art.fixture_bytes.toLocaleString('en-US')} bytes, sha256 \`${art.fixture_sha256.slice(0, 16)}…\``);
say();
say(`scope: ${art.scope}`);
say();

say(`## canary — every phase, and whether it held`);
say();
say(`| phase | spread | within 10% |`);
say(`|---|---|---|`);
for (const c of art.canary_spreads) {
  say(`| ${c.phase} | ${(c.spread * 100).toFixed(1)}% | ${c.within ? 'yes' : '**NO**'} |`);
}
const anyOver = art.canary_spreads.some((c) => !c.within);
say();
say(anyOver
  ? '**At least one phase exceeded the declared 10% canary spread. Every number in that phase is recorded, not established.**'
  : 'Every phase held the declared 10% bound.');

say();
say(`## admissibility — checked before any timing`);
say();
const bad = summary.filter((s) => !s.admissible);
if (!bad.length) say('None. Every viewport reached n >= 7 with one row count, `dropped_records: 0` in every trial, and one filter plan.');
else {
  say(`| viewport | n | reasons |`);
  say(`|---|---|---|`);
  for (const s of bad) say(`| \`${s.view}\` | ${s.n} | ${s.reasons.join('; ')} |`);
}

say();
say(`## segment decomposition, p50 / p95 (ms), per viewport`);
say();
say(`| viewport | n | producer_handoff | statement_prepare | param_assembly | bind_and_execute | first_fetch | query (composite) | lease_to_first_row (composite) | lease_bind (reported, not scored) |`);
say(`|---|---|---|---|---|---|---|---|---|---|`);
for (const s of summary) {
  const cell = (seg) => `${fmt(s.segStats[seg]?.p50)} / ${fmt(s.segStats[seg]?.p95)}`;
  say(
    `| ${s.view} | ${s.n} | ${cell('producer_handoff')} | ${cell('statement_prepare')} | ${cell('param_assembly')} | ${cell('bind_and_execute')} | ${cell('first_fetch')} | ${cell('query')} | ${cell('lease_to_first_row')} | ${cell('lease_bind')} |`
  );
}
say();
say('**`query` and `lease_to_first_row` are composites of the leaf segments beside them, never a sixth and seventh independent sample — see `SPAN_LEASE_TO_FIRST_ROW`\'s doc in `engine/src/trace.rs`. They are never summed with the leaves.**');

say();
say(`## dominance, per §5 — p50-of-shares is the registered figure; ratio-of-p50s is reported alongside, never conflated with it`);
say();
say(`| viewport | segment | p50 of per-trial shares | ratio of p50s | >= 40%? |`);
say(`|---|---|---|---|---|`);
for (const s of summary) {
  for (const seg of LEAVES) {
    const share = s.shareStats[seg];
    const over = share.p50_of_shares !== null && share.p50_of_shares >= DOMINANCE_THRESHOLD;
    say(`| ${s.view} | ${seg} | ${fmtPct(share.p50_of_shares)} | ${fmtPct(share.ratio_of_p50s)} | ${over ? '**yes**' : 'no'} |`);
  }
}

say();
say(`## the decision rule (§6), applied mechanically to the gate viewport (\`${GATE_VIEW}\`)`);
say();
const gate = byViewLabel.get(GATE_VIEW);
if (!gate || !gate.admissible) {
  say(`**Gate viewport \`${GATE_VIEW}\` is not admissible — the decision rule cannot be applied.** ${gate ? gate.reasons.join('; ') : 'no data'}`);
} else {
  const dominant = LEAVES
    .map((seg) => ({ seg, share: gate.shareStats[seg].p50_of_shares }))
    .filter((x) => x.share !== null && x.share >= DOMINANCE_THRESHOLD)
    .sort((a, b) => b.share - a.share);
  if (!dominant.length) {
    say(`**No leaf segment reaches the declared ${(DOMINANCE_THRESHOLD * 100).toFixed(0)}% threshold at the gate viewport.**`);
    say();
    say('Per §6: **"Attribution complete, no single lever justified." Phase 2 is skipped.** A legitimate end state, not a failure.');
  } else {
    const winner = dominant[0];
    say(`**\`${winner.seg}\` dominates at ${fmtPct(winner.share)} of \`lease_to_first_row\` (p50 of per-trial shares) at the gate viewport.**`);
    say();
    const consequence = {
      statement_prepare: '**Phase 2 proceeds** — the prepared-statement-reuse lever, subject to the architect\'s D10–D13 corrections and the declared warm-connection protocol for Phase 3 (D13).',
      bind_and_execute: '**Not** the prepared-statement lever — it cannot reach this segment. Recorded as a finding; the architect proposes a lever for this segment as its own preregistered phase.',
      first_fetch: '**Not** the prepared-statement lever. Recorded as a finding; a lever for this segment is a separate preregistered phase.',
      producer_handoff: '**Not** the prepared-statement lever. A thread-handoff lever is a different design with its own gate — a separate preregistered phase.',
    }[winner.seg];
    say(consequence);
  }
}

say();
say(`## the registered prediction (§6), checked against what actually ran`);
say();
say('Predicted before any trial ran: `statement_prepare` under 5% of `lease_to_first_row` at every viewport, `bind_and_execute` dominant.');
say();
say(`| viewport | statement_prepare share (p50 of shares) | under 5%? | bind_and_execute share (p50 of shares) | dominant? |`);
say(`|---|---|---|---|---|`);
for (const s of summary) {
  const sp = s.shareStats.statement_prepare?.p50_of_shares;
  const be = s.shareStats.bind_and_execute?.p50_of_shares;
  say(`| ${s.view} | ${fmtPct(sp)} | ${sp !== null && sp < 0.05 ? 'yes' : 'no'} | ${fmtPct(be)} | ${be !== null && be >= DOMINANCE_THRESHOLD ? 'yes' : 'no'} |`);
}

say();
say(`## \`lease_bind\` — reported per §8, never eligible to win the decision rule above`);
say();
say(`| viewport | p50 ms | p95 ms | share of \`sql_built\` -> \`first_source_row\` (informational only) |`);
say(`|---|---|---|---|`);
for (const s of summary) {
  const lb = s.segStats.lease_bind;
  const ltfr = s.segStats.lease_to_first_row;
  const total = lb.p50 !== null && ltfr.p50 !== null ? lb.p50 + ltfr.p50 : null;
  const share = total && total > 0 ? lb.p50 / total : null;
  say(`| ${s.view} | ${fmt(lb.p50)} | ${fmt(lb.p95)} | ${fmtPct(share)} |`);
}
say();
say(`\`reused_connection\` was ${[...new Set(summary.flatMap((s) => s.reused_connection))].join(', ')} across every admissible trial — every trial in this pass opens \`Dataset\` (which primes the pool) before streaming, so \`lease_bind\` here never contains a fresh connection-open cost. See the artifact's own \`"scope"\` field.`);

console.log(out.join('\n'));
