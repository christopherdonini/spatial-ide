#!/usr/bin/env node
// scripts/plan/site.mjs
//
// Generates the landing page (AUTONOMY.md §5) from PLAN.yaml (+ site/data/health.json and
// site/data/build-health.json, each if present): site/index.html (self-contained: inline CSS/JS;
// the only external resources are the GitHub workflow badge image and hyperlinks),
// site/data/plan.json, site/.nojekyll. Node's standard library only.
//
// The health strip has two sources and never mixes them (the human, 2026-09-14): build-time facts
// (CI, open PRs, latest release) come from GitHub's API inside the Pages build, via
// buildHealth.mjs -> site/data/build-health.json (gitignored); machine facts (drift, disk, stray
// processes, waiting-on-human) come from health.mjs -> site/data/health.json. The drift check
// always renders with the build facts ABSENT, so it never depends on that file.
//
// Usage:
//   node scripts/plan/site.mjs [--plan <path>] [--out-dir <dir>] [--repo <owner/repo>] [--check]

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlan, deriveStates, indexById, prioritiesApproved, NEEDS_HUMAN_ORDER } from './plan.mjs';
import { formatEvidence } from './queue.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

// "CI on main" is the WHOLE product suite, not one workflow of it. Reading a single workflow was a
// false-green hazard (2026-09-15: the strip read product-ci-rust.yml = green and reported CI
// "success" while product-ci-shell.yml was red on main). A red on ANY product workflow is a red for
// the suite, so the strip reads all three and reports the worst, naming which one is red.
export const PRODUCT_CI_WORKFLOWS = ['product-ci-rust.yml', 'product-ci-viewer.yml', 'product-ci-shell.yml'];
const DEFAULT_REPO_SLUG = 'christopherdonini/spatial-ide';

// A duration, rate, or percentage pattern in a title/summary, per §5: "The generator refuses a
// node whose summary or title contains a duration, rate or percentage unless the node carries
// measurement: {results: <tracked RESULTS.md anchor>, row: '<docs/08 row>'}."
const METRIC_RE = /\d+(\.\d+)?\s*(ms|milliseconds?|secs?|seconds?|mins?|minutes?|hrs?|hours?|fps|%|x\b)/i;

export class SiteMetricViolationError extends Error {
  constructor(violations) {
    super(
      `site.mjs: refusing generation — a duration/rate/percentage pattern without a measurement field:\n${violations
        .map((v) => `  - node "${v.id}" (${v.field}): "${v.text}"`)
        .join('\n')}`,
    );
    this.name = 'SiteMetricViolationError';
    this.violations = violations;
  }
}

export function findMetricViolations(plan) {
  const violations = [];
  for (const node of plan.nodes ?? []) {
    for (const field of ['title', 'summary']) {
      const text = node[field];
      if (typeof text !== 'string' || !METRIC_RE.test(text)) continue;
      const m = node.measurement;
      const ok =
        m &&
        typeof m.results === 'string' &&
        m.results.length > 0 &&
        typeof m.row === 'string' &&
        m.row.length > 0;
      if (!ok) violations.push({ id: node.id, field, text });
    }
  }
  return violations;
}

/** JSON for embedding inside an inline <script> tag: `</script` in a string value must not be
 * able to close the tag early. */
function safeJsonForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

function evidenceLink(evidence, repoSlug) {
  if (!evidence) return '';
  if (evidence.pr !== undefined) {
    return `<a href="https://github.com/${repoSlug}/pull/${evidence.pr}">PR #${evidence.pr}</a>`;
  }
  if (evidence.adr !== undefined) {
    const file = findAdrFile(evidence.adr);
    return file
      ? `<a href="https://github.com/${repoSlug}/blob/main/docs/adr/${file}">${esc(evidence.adr)}</a>`
      : esc(evidence.adr);
  }
  if (evidence.tag !== undefined) {
    return `<a href="https://github.com/${repoSlug}/releases/tag/${encodeURIComponent(evidence.tag)}">tag ${esc(evidence.tag)}</a>`;
  }
  if (evidence.release !== undefined) {
    return `<a href="https://github.com/${repoSlug}/releases/tag/${encodeURIComponent(evidence.release)}">release ${esc(evidence.release)}</a>`;
  }
  if (evidence.commit !== undefined) {
    return `<a href="https://github.com/${repoSlug}/commit/${encodeURIComponent(evidence.commit)}">commit ${esc(evidence.commit)}</a>`;
  }
  if (evidence.path !== undefined) {
    const [filePath] = evidence.path.split('#');
    return `<a href="https://github.com/${repoSlug}/blob/main/${filePath}">${esc(evidence.path)}</a>`;
  }
  if (evidence.log !== undefined) return esc(evidence.log);
  if (evidence.branch !== undefined) {
    return `<a href="https://github.com/${repoSlug}/tree/${encodeURIComponent(evidence.branch)}">branch ${esc(evidence.branch)}</a>`;
  }
  return esc(formatEvidence(evidence));
}

function findAdrFile(adrId) {
  const dir = path.join(REPO_ROOT, 'docs', 'adr');
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir).find((f) => f === `${adrId}.md` || f.startsWith(`${adrId}-`)) ?? null;
}

const ROW_HEIGHT = 46; // fixed row height assumption for the same-lane SVG dependency arrows

function renderAheadArrows(aheadNodes) {
  const indexOf = new Map(aheadNodes.map((n, i) => [n.id, i]));
  const svgLines = [];
  const crossNotes = new Map(); // nodeId -> [textual note, ...]
  for (const node of aheadNodes) {
    for (const dep of node.depends_on ?? []) {
      if (indexOf.has(dep)) {
        const fromY = indexOf.get(dep) * ROW_HEIGHT + ROW_HEIGHT / 2;
        const toY = indexOf.get(node.id) * ROW_HEIGHT + ROW_HEIGHT / 2;
        svgLines.push(
          `<line x1="8" y1="${fromY}" x2="8" y2="${toY}" class="dep-arrow" marker-end="url(#arrowhead)" />`,
        );
      } else {
        if (!crossNotes.has(node.id)) crossNotes.set(node.id, []);
        crossNotes.get(node.id).push(dep);
      }
    }
  }
  const height = Math.max(aheadNodes.length * ROW_HEIGHT, ROW_HEIGHT);
  const svg =
    aheadNodes.length === 0
      ? ''
      : `<svg class="dep-svg" width="16" height="${height}" aria-hidden="true">` +
        `<defs><marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" /></marker></defs>` +
        svgLines.join('') +
        `</svg>`;
  return { svg, crossNotes };
}

/** Estimated minutes, or 0 when a node carries no usable estimate (DRAFT-4 bug 5: never "0 min"). */
function estimatedMinutes(needs) {
  const m = needs?.minutes;
  return typeof m === 'number' && m > 0 ? m : 0;
}

/**
 * The need-type chip (DRAFT-4 bug 3): its own element, never concatenated onto the title. A
 * zero or absent estimate reads "unestimated", never "0 min".
 */
function needChip(needs) {
  if (!needs || needs.kind === 'none') return '';
  const minutes = estimatedMinutes(needs);
  const text = minutes > 0 ? `${needs.kind} · ${minutes} min` : `${needs.kind} · unestimated`;
  const aria = minutes > 0 ? `needs a ${needs.kind}, about ${minutes} minutes` : `needs a ${needs.kind}, unestimated`;
  return ` <span class="chip chip-need" aria-label="${esc(aria)}">${esc(text)}</span>`;
}

/** "(<sum> min estimated; <k> unestimated)" — and nothing at all when there is nothing to total. */
function needTotalLabel(nodes) {
  const minutes = nodes.map((n) => estimatedMinutes(n.needs_human));
  const sum = minutes.reduce((a, b) => a + b, 0);
  const unestimated = minutes.filter((m) => m === 0).length;
  const parts = [];
  if (sum > 0) parts.push(`${sum} min estimated`);
  if (unestimated > 0) parts.push(`${unestimated} unestimated`);
  if (parts.length === 0) return '';
  return ` <span class="total">(${esc(parts.join('; '))})</span>`;
}

/**
 * A done node's date, labelled by what the evidence actually dates (DRAFT-4 bug 5): a release or
 * tag dates the evidence, not the work; a PR/commit/path/ADR/log is when the work landed.
 */
function doneDateLabel(node) {
  const date = node.dates?.done;
  if (!date) return '';
  const e = node.evidence ?? {};
  const kind = e.release !== undefined || e.tag !== undefined ? 'evidence dated' : 'landed';
  return ` <span class="date">${kind} ${esc(date)}</span>`;
}

/** Cross-lane "after:" note: the dependency's title, linked to its anchor; its id only if unknown. */
function crossNoteHtml(crossNotes, byId) {
  if (crossNotes.length === 0) return '';
  const parts = crossNotes.map((depId) => {
    const dep = byId?.get(depId);
    return dep
      ? `<a href="#node-${esc(depId)}" title="${esc(depId)}">${esc(dep.title)}</a>`
      : esc(depId);
  });
  return `<div class="cross-note">after: ${parts.join(', ')}</div>`;
}

function renderNodeBox(node, { showCheckmark = false, ambition = false, crossNotes = [], byId } = {}) {
  const classes = ['node-box'];
  if (ambition) classes.push('ambition');
  if (node.status === 'blocked' && node.needs_human && node.needs_human.kind !== 'none') {
    classes.push('blocked-human');
  }
  const mark = showCheckmark ? '<span class="check" aria-hidden="true">&#10003;</span> ' : '';
  // DRAFT-4 bug 4: the id is metadata — the anchor and the title attribute carry it, never the
  // visible label.
  return (
    `<div class="${classes.join(' ')}" id="node-${esc(node.id)}" title="${esc(node.id)}">` +
    `${mark}${esc(node.title)}` +
    `${needChip(node.needs_human)}` +
    crossNoteHtml(crossNotes, byId) +
    `</div>`
  );
}

function renderLane(lane, nodesInLane, { repoSlug, byId }) {
  const done = nodesInLane
    .filter((n) => n.status === 'done')
    .sort((a, b) => (a.dates?.done ?? '').localeCompare(b.dates?.done ?? '') || a.id.localeCompare(b.id));
  const ahead = nodesInLane
    .filter((n) => ['ready', 'in-progress', 'blocked', 'proposed'].includes(n.status))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));
  const unscheduled = nodesInLane.filter((n) => n.status === 'unscheduled');

  const allUnscheduled = nodesInLane.length > 0 && nodesInLane.every((n) => n.status === 'unscheduled');

  const doneHtml = done
    .map(
      (n) =>
        `<div class="node-box done" id="node-${esc(n.id)}" title="${esc(n.id)}"><span class="check" aria-hidden="true">&#10003;</span> ${esc(n.title)}${doneDateLabel(n)} ${evidenceLink(n.evidence, repoSlug)}</div>`,
    )
    .join('\n');

  const { svg, crossNotes } = renderAheadArrows(ahead);
  const aheadHtml = ahead
    .map((n) => renderNodeBox(n, { crossNotes: crossNotes.get(n.id) ?? [], byId }))
    .join('\n');

  const unscheduledHtml = unscheduled
    .map(
      (n) =>
        `<div class="node-box ambition" id="node-${esc(n.id)}" title="${esc(n.id)}">${esc(n.title)} <span class="phase-cite">${esc(n.phase)}</span></div>`,
    )
    .join('\n');

  return `
  <section class="lane${allUnscheduled ? ' lane-ambition' : ''}">
    <h2>${esc(lane.title)}${allUnscheduled ? ' <span class="ambition-tag">ambition</span>' : ''}</h2>
    <div class="lane-columns">
      <div class="col col-done">
        <h3>Built so far</h3>
        ${doneHtml || '<p class="empty">(nothing landed yet)</p>'}
      </div>
      <div class="col col-ahead">
        <h3>Ahead</h3>
        <div class="ahead-wrap">
          ${svg}
          <div class="ahead-list">${aheadHtml || '<p class="empty">(nothing queued)</p>'}</div>
        </div>
        ${unscheduledHtml}
      </div>
    </div>
  </section>`;
}

function renderWaitingOnYou(waitingOnHuman) {
  const items = waitingOnHuman
    .map(
      (n) =>
        `<li title="${esc(n.id)}"><a href="#node-${esc(n.id)}">${esc(n.title)}</a>${needChip(n.needs_human)}</li>`,
    )
    .join('\n');
  return `
  <section class="panel" id="waiting-on-you">
    <h2>Waiting on you${needTotalLabel(waitingOnHuman)}</h2>
    <ul>${items || '<li class="empty">(nothing)</li>'}</ul>
  </section>`;
}

function gb(bytes) {
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function formatDiskFree(disk) {
  if (!disk) return 'unknown';
  if (disk.error) return `error: ${disk.error}`;
  // New shape: one entry per present drive (C:, and D: when the machine has it). "C: N GB, D: M GB".
  if (Array.isArray(disk.drives)) {
    const parts = disk.drives
      .filter((d) => d && typeof d.bytes === 'number')
      .map((d) => `${d.drive}: ${gb(d.bytes)}`);
    return parts.length > 0 ? parts.join(', ') : 'unknown';
  }
  // Back-compat: the earlier single-drive shape.
  if (typeof disk.bytes === 'number') {
    return `${gb(disk.bytes)} free${disk.drive ? ` (drive ${disk.drive})` : ''}`;
  }
  if (disk.raw) return disk.raw.split(/\r?\n/)[0]; // first line only -- `df` output can be wide
  return 'unknown';
}

/**
 * Median opened->done, labelled at the resolution it actually has: the plan carries dates, so this
 * is days, and the row says so. Never claims hours.
 */
function formatMedianOpenedToDone(m) {
  if (!m || typeof m.days !== 'number') return 'no dated done nodes yet';
  const unit = m.days === 1 ? 'day' : 'days';
  return `${m.days} ${unit} (day resolution, ${m.n} node${m.n === 1 ? '' : 's'})`;
}

/**
 * Gate first-pass rate, an operational governance count (not a docs/08 perf number): the fraction
 * of nodes whose first recorded gate attempt passed, with the N. Absent log -> "no gate log yet".
 */
function formatGateFirstPass(g) {
  if (!g || g.present === false) return 'no gate log yet';
  if (!g.nodes) return 'no gate records yet';
  const pct = Math.round((g.rate ?? 0) * 100);
  return `${g.first_pass}/${g.nodes} nodes passed first gate (${pct}%)`;
}

/**
 * Record-round count per piece (the human's 2026-09-18 directive, point 4;
 * `state/directives/2026-09-18-record-cap.md`), beside the gate first-pass line: each node with a
 * non-zero count, the total, and the zero target stated. A node with zero is not listed (its count
 * is simply absent from `byNode`, and this also drops any zero that slips through). Absent log ->
 * "no gate log yet", same wording as the first-pass row.
 */
function formatRecordRounds(rr) {
  if (!rr || rr.present === false) return 'no gate log yet';
  const entries = Object.entries(rr.byNode ?? {})
    .filter(([, n]) => n > 0)
    .sort((a, b) => a[0].localeCompare(b[0]));
  const total = rr.total ?? 0;
  if (entries.length === 0) return `none (total ${total}, target 0)`;
  const parts = entries.map(([node, n]) => `${node}: ${n}`);
  return `${parts.join(', ')} (total ${total}, target 0)`;
}

function formatStrayProcesses(stray) {
  if (!stray) return 'unknown';
  if (stray.error) return `error: ${stray.error}`;
  if (typeof stray.total === 'number') {
    const byName = stray.by_name
      ? Object.entries(stray.by_name)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : '';
    return `${stray.total} total${byName ? ` (${byName})` : ''}`;
  }
  return 'unknown';
}

function oldestBy(items, ageField) {
  return items.reduce((a, b) => ((a[ageField] ?? -1) >= (b[ageField] ?? -1) ? a : b));
}

/**
 * Waiting-on-human, machine side. The id is metadata here too (DRAFT-4 bug 4): the oldest item
 * shows its TITLE, linked to its anchor, with the id in a title attribute; an id the plan no
 * longer knows falls back to the id itself, which is then the only honest thing to print.
 */
function waitingOnHumanValueHtml(waiting, byId) {
  const items = Array.isArray(waiting) ? waiting : [];
  if (items.length === 0) return esc('0 waiting');
  const withAge = items.filter((n) => typeof n.age_days === 'number');
  if (withAge.length === 0) return esc(`${items.length} waiting (age unknown)`);
  const oldest = oldestBy(withAge, 'age_days');
  const node = byId?.get(oldest.id);
  const who = node
    ? `<a href="#node-${esc(oldest.id)}" title="${esc(oldest.id)}">${esc(node.title)}</a>`
    : esc(oldest.id);
  return `${esc(`${items.length} waiting, oldest ${oldest.age_days} d (`)}${who}${esc(')')}`;
}

/**
 * An href built from a value this repository did not write (the GitHub API's own `html_url`s)
 * is emitted only when it is an https:// URL; anything else renders as escaped text with no
 * link, so a hostile or malformed value can never become a javascript: target.
 */
function externalLink(url, text) {
  const safe = typeof url === 'string' && url.startsWith('https://');
  return safe ? `<a href="${esc(url)}">${esc(text)}</a>` : esc(text);
}

/**
 * CI on main across the whole product suite. The strip must never read "success" while any product
 * workflow is red, so the worst-of the workflows is shown and any non-green workflow is named and
 * linked to its run. Falls back to the pre-composite single-fact shape if `workflows` is absent.
 */
function ciValueHtml(ci) {
  if (!ci) return esc('not read');
  if (ci.error && !Array.isArray(ci.workflows)) return esc(`error: ${ci.error}`);

  const workflows = Array.isArray(ci.workflows) ? ci.workflows : null;
  if (!workflows) {
    // Legacy single-fact shape.
    const label = ci.conclusion ?? ci.status ?? ci.note ?? 'no conclusion recorded';
    return externalLink(ci.html_url, label);
  }

  const shortName = (wf) => String(wf.workflow ?? '').replace(/^product-ci-|\.yml$/g, '') || wf.workflow;
  // A workflow is "not green" if it failed, errored, is still running, or has no run yet.
  const notGreen = workflows.filter((w) => w.conclusion !== 'success');
  if (notGreen.length === 0) {
    return esc(`all green (${workflows.length}/${workflows.length})`);
  }
  // Name each non-green workflow with its state, linked to its run when there is one.
  const parts = notGreen.map((w) => {
    const state = w.error ? 'unreadable' : (w.conclusion ?? w.status ?? w.note ?? 'unknown');
    return externalLink(w.html_url, `${shortName(w)}: ${state}`);
  });
  const headline = ci.conclusion === 'failure' ? 'FAILURE' : (ci.conclusion ?? 'not all green');
  return `${esc(headline)} — ${parts.join(', ')}`;
}

function openPrsValueHtml(openPrs) {
  if (!openPrs) return esc('not read');
  if (openPrs.error) return esc(`error: ${openPrs.error}`);
  if (!openPrs.count) return esc('0 open');
  const oldest = openPrs.oldest;
  const text = oldest
    ? `${openPrs.count} open, oldest ${oldest.age_days ?? '?'} d (#${oldest.number})`
    : `${openPrs.count} open`;
  return externalLink(oldest?.html_url, text);
}

function latestReleaseValueHtml(release) {
  if (release === null || release === undefined) return esc('none published yet');
  if (release.error) return esc(`error: ${release.error}`);
  const date = release.published_at ? String(release.published_at).slice(0, 10) : 'date unknown';
  // A pre-release is published and says so; calling it "none published" would be false, calling it
  // a release without the qualifier would overstate it.
  const text = `${release.tag_name ?? 'unnamed'} (${release.prerelease ? 'pre-release, ' : ''}${date})`;
  return externalLink(release.html_url, text);
}

function healthRowsHtml(rows) {
  return rows
    .map(([label, valueHtml]) => `<div class="health-row"><span>${esc(label)}</span><span>${valueHtml}</span></div>`)
    .join('\n');
}

/**
 * Two labelled groups, each with its own timestamp (DRAFT-4 bug 1; the human, 2026-09-14): the
 * build-time facts come from GitHub's API inside the Pages build (buildHealth.mjs), the machine
 * facts from the custodian's machine (health.mjs). No row ever mixes the two.
 */
function renderHealthStrip(health, buildHealth, byId, governanceBaselineCount) {
  let buildGroup;
  if (buildHealth?.unreadable) {
    // A corrupt file is not an absent one: saying "generated outside that build" here would be
    // false in exactly the build that wrote the file.
    buildGroup =
      `<h3 class="health-source">From GitHub's API at Pages build time</h3>\n` +
      `<p class="empty">build-health.json unreadable: ${esc(buildHealth.unreadable)}</p>`;
  } else if (buildHealth) {
    buildGroup =
      `<h3 class="health-source">From GitHub's API at Pages build time — built ${esc(buildHealth.built_at ?? 'unknown')}</h3>\n` +
      healthRowsHtml([
        ['CI on main', ciValueHtml(buildHealth.ci)],
        ['Open PRs', openPrsValueHtml(buildHealth.open_prs)],
        ['Latest release', latestReleaseValueHtml(buildHealth.latest_release)],
      ]);
  } else {
    buildGroup =
      `<h3 class="health-source">From GitHub's API at Pages build time</h3>\n` +
      `<p class="empty">CI on main, open PRs and the latest release are read from GitHub's API in the Pages build; this copy was generated outside that build.</p>`;
  }

  const machineGroup = health
    ? `<h3 class="health-source">From the custodian's machine — refreshed ${esc(health.generated_at ?? 'unknown')}</h3>\n` +
      healthRowsHtml([
        ['Drift', esc(health.drift?.ok === true ? 'clean' : health.drift?.ok === false ? 'DRIFT' : 'unknown')],
        ['Disk free', esc(formatDiskFree(health.disk_free))],
        ['Stray processes', esc(formatStrayProcesses(health.stray_processes))],
        ['Waiting on human', waitingOnHumanValueHtml(health.waiting_on_human, byId)],
        ['Median opened→done', esc(formatMedianOpenedToDone(health.median_opened_to_done))],
        ['Gate first-pass', esc(formatGateFirstPass(health.gate_first_pass))],
        ['Record rounds per piece', esc(formatRecordRounds(health.record_rounds))],
      ])
    : `<h3 class="health-source">From the custodian's machine</h3>\n` +
      `<p class="empty">no site/data/health.json yet — never refreshed</p>`;

  // A third source, always rendered, never mixed into the other two (AUTONOMY.md:231, the human,
  // 2026-09-14: "No row mixes the two." -- this is a third, clearly labelled one, not a mixed one): the
  // verify-quotes baseline entry count is a fact read directly from this repository's own tracked file,
  // not from health.mjs's machine refresh or GitHub's API build. Round 11's ratchet condition (c): "the
  // baseline count is a line on the health strip, so a number that never shrinks is visible."
  // A malformed baseline (exists, but invalid JSON or the wrong shape) is a FAULT, not an absent row --
  // round-12 fix round item (e): "a malformed baseline renders a visible fault on the health strip, not
  // an absent row." `null` (the file was never created) still reads "unknown", the pre-existing case.
  const governanceCountText =
    governanceBaselineCount === null
      ? 'unknown'
      : governanceBaselineCount === 'malformed'
        ? 'FAULT — verify-quotes.baseline.json does not parse to { entries: [...] }'
        : String(governanceBaselineCount);
  const governanceGroup =
    `<h3 class="health-source">From this repository's own tracked files</h3>\n` +
    healthRowsHtml([['verify-quotes baseline entries', esc(governanceCountText)]]);

  return `
  <section class="panel health-strip">
    <h2>Health</h2>
    ${buildGroup}
    ${machineGroup}
    ${governanceGroup}
  </section>`;
}

const SHIPPED_WINDOW_DAYS = 7;

function shiftDays(isoDate, delta) {
  const t = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(t)) return isoDate;
  return new Date(t + delta * 86400000).toISOString().slice(0, 10);
}

/**
 * The static "shipped recently" list (DRAFT-4 bug 2): the window is measured from the NEWEST
 * `dates.done` in the plan, never from the wall clock — the page must render the same bytes on
 * every run or the drift check would fail a day later for no reason. The inline JS narrows this
 * list to the viewer's last visit when it runs; when it does not, this is what the page says.
 */
export function shippedRecently(plan) {
  const done = (plan.nodes ?? []).filter(
    (n) => n.status === 'done' && typeof n.dates?.done === 'string' && n.dates.done.length > 0,
  );
  if (done.length === 0) return { newest: null, nodes: [] };
  const newest = done.reduce((a, b) => (a.dates.done >= b.dates.done ? a : b)).dates.done;
  const cutoff = shiftDays(newest, -SHIPPED_WINDOW_DAYS);
  const nodes = done
    .filter((n) => n.dates.done >= cutoff)
    .sort((a, b) => b.dates.done.localeCompare(a.dates.done) || a.id.localeCompare(b.id));
  return { newest, nodes };
}

function renderShipped(plan, repoSlug) {
  const { newest, nodes } = shippedRecently(plan);
  const heading = newest
    ? `Shipped in the ${SHIPPED_WINDOW_DAYS} days to ${esc(newest)}`
    : 'Shipped recently';
  const items = nodes
    .map(
      (n) =>
        `<li title="${esc(n.id)}"><a href="#node-${esc(n.id)}">${esc(n.title)}</a> <span class="date">(${esc(n.dates.done)})</span> ${evidenceLink(n.evidence, repoSlug)}</li>`,
    )
    .join('\n');
  return `
<section class="panel" id="shipped-since-last-visit">
  <h2 id="shipped-heading">${heading}</h2>
  <ul id="shipped-list">${items || '<li class="empty">(nothing with a recorded date yet)</li>'}</ul>
</section>`;
}

const CSS = `
:root { color-scheme: light dark; --gap: 12px; }
* { box-sizing: border-box; }
body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 0; padding: 16px; max-width: 1200px; margin-inline: auto; line-height: 1.4; }
h1 { font-size: 1.4rem; }
h2 { font-size: 1.05rem; margin: 0 0 8px; }
h3 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.03em; color: #667; margin: 0 0 6px; }
header { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 16px; }
.panels { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); margin-bottom: 20px; }
.panel { border: 1px solid #ccd; border-radius: 8px; padding: 10px 14px; }
.lane { border: 1px solid #ccd; border-radius: 8px; padding: 10px 14px; margin-bottom: var(--gap); }
.lane-ambition { opacity: 0.6; background: repeating-linear-gradient(45deg, transparent, transparent 10px, #8881 10px, #8881 20px); }
.ambition-tag { font-size: 0.7rem; text-transform: uppercase; color: #778; border: 1px solid #99a; border-radius: 4px; padding: 1px 6px; }
.lane-columns { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); }
.node-box { border: 1px solid #dde; border-radius: 6px; padding: 6px 8px; margin-bottom: 6px; font-size: 0.9rem; position: relative; }
.node-box.done { border-color: #9c9; }
.node-box.ambition { border-style: dashed; color: #778; }
.node-box.blocked-human { border-color: #e0a030; }
.check { color: #292; }
.chip { display: inline-block; font-size: 0.72rem; border-radius: 4px; padding: 0 5px; white-space: nowrap; }
.chip-need { background: #fde8c0; color: #664400; }
.cross-note { font-size: 0.72rem; color: #889; }
.phase-cite { font-size: 0.72rem; color: #889; margin-left: 6px; }
.date { color: #889; font-size: 0.8rem; }
.ahead-wrap { display: flex; gap: 4px; }
.dep-svg { flex: none; }
.dep-arrow { stroke: #99a; stroke-width: 1.5; }
.ahead-list { flex: 1; }
.empty { color: #99a; font-style: italic; margin: 0; }
.total { font-weight: normal; color: #889; font-size: 0.85rem; }
.health-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 2px 0; border-top: 1px solid #eef; }
.health-source { font-size: 0.72rem; text-transform: none; letter-spacing: normal; color: #667; margin: 10px 0 2px; }
.refreshed { font-weight: normal; color: #889; font-size: 0.78rem; }
.seeded-note { background: #fde8c0; border: 1px solid #e0a030; border-radius: 6px; padding: 6px 10px; font-size: 0.85rem; margin-bottom: 12px; }
@media (max-width: 480px) {
  body { padding: 8px; }
  .panels { grid-template-columns: 1fr; }
  .lane-columns { grid-template-columns: 1fr; }
}
`;

function renderHtml(plan, health, { repoSlug, generatedAt, buildHealth = null, governanceBaselineCount = null }) {
  const violations = findMetricViolations(plan);
  if (violations.length > 0) throw new SiteMetricViolationError(violations);

  const lanes = [...(plan.lanes ?? [])].sort((a, b) => a.priority - b.priority);
  const nodesByLane = new Map(lanes.map((l) => [l.id, []]));
  for (const n of plan.nodes ?? []) {
    if (!nodesByLane.has(n.lane)) nodesByLane.set(n.lane, []);
    nodesByLane.get(n.lane).push(n);
  }
  const { waitingOnHuman } = deriveStates(plan);

  // One badge per product workflow — a single badge would show green while another workflow is red.
  const ciBadges = PRODUCT_CI_WORKFLOWS.map(
    (wf) =>
      `<a href="https://github.com/${repoSlug}/actions/workflows/${wf}"><img src="https://github.com/${repoSlug}/actions/workflows/${wf}/badge.svg?branch=main" alt="${wf} on main" /></a>`,
  ).join('\n  ');
  const seededNote = prioritiesApproved(plan)
    ? ''
    : `<div class="seeded-note">Seeded, pending approval: lane priorities below are the seeded order from the directive, not yet approved (AUTONOMY.md §2, §4).</div>`;

  const byId = indexById(plan.nodes ?? []);
  const laneHtml = lanes
    .map((lane) => renderLane(lane, nodesByLane.get(lane.id) ?? [], { repoSlug, byId }))
    .join('\n');

  const planData = {
    generated_at: generatedAt,
    plan_hash: plan._meta.hash,
    priorities_approved: prioritiesApproved(plan),
    done_nodes: (plan.nodes ?? [])
      .filter((n) => n.status === 'done')
      .map((n) => ({ id: n.id, title: n.title, lane: n.lane, dates: n.dates })),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Spatial IDE — custodian's plan</title>
<style>${CSS}</style>
</head>
<body>
<header>
  <h1>Spatial IDE — custodian's plan</h1>
  ${ciBadges}
  <a href="https://github.com/${repoSlug}">repository</a>
</header>
${seededNote}
<div class="panels">
${renderWaitingOnYou(waitingOnHuman)}
${renderShipped(plan, repoSlug)}
</div>
${renderHealthStrip(health, buildHealth, byId, governanceBaselineCount)}
<main>
${laneHtml}
</main>
<script id="plan-data" type="application/json">${safeJsonForScript(planData)}</script>
<script>
// Progressive enhancement only: the list and heading above are already true without JS. This
// narrows them to the viewer's own last visit, and only if everything below succeeds.
(function () {
  var STORAGE_KEY = 'spatial-ide-custodian-last-visit';
  function todayLocal() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  var lastVisitRaw = null;
  try { lastVisitRaw = localStorage.getItem(STORAGE_KEY); } catch (e) { lastVisitRaw = null; }
  try {
    // Calendar days, inclusive of the last-visit day: comparing a date-only value with an instant
    // hid anything that landed on the day of the visit itself. A first visit changes nothing.
    if (lastVisitRaw && lastVisitRaw.length >= 10) {
      var lastDay = lastVisitRaw.slice(0, 10);
      var data = JSON.parse(document.getElementById('plan-data').textContent);
      var shipped = (data.done_nodes || []).filter(function (n) {
        return n.dates && typeof n.dates.done === 'string' && n.dates.done >= lastDay;
      });
      shipped.sort(function (a, b) {
        return a.dates.done < b.dates.done ? 1 : a.dates.done > b.dates.done ? -1 : 0;
      });
      var list = document.getElementById('shipped-list');
      var heading = document.getElementById('shipped-heading');
      var fresh = document.createDocumentFragment();
      if (shipped.length === 0) {
        var none = document.createElement('li');
        none.className = 'empty';
        none.textContent = '(nothing since your last visit)';
        fresh.appendChild(none);
      } else {
        shipped.forEach(function (n) {
          var li = document.createElement('li');
          li.title = n.id;
          var a = document.createElement('a');
          a.href = '#node-' + n.id;
          a.textContent = n.title;
          li.appendChild(a);
          li.appendChild(document.createTextNode(' (' + n.dates.done + ')'));
          fresh.appendChild(li);
        });
      }
      list.innerHTML = '';
      list.appendChild(fresh);
      heading.textContent = 'Shipped since your last visit (' + lastDay + ')';
    }
  } catch (e) { /* leave the generated list and heading exactly as they are */ }
  try { localStorage.setItem(STORAGE_KEY, todayLocal()); } catch (e) { /* localStorage unavailable */ }
})();
</script>
</body>
</html>
`;
}

/**
 * Pure: builds { html, planJson } from an already-loaded plan, the optional machine-facts health
 * object, and (via `options.buildHealth`) the optional build-time facts, and (via
 * `options.governanceBaselineCount`) the verify-quotes baseline's entry count.
 */
export function renderSite(plan, health, options = {}) {
  const repoSlug = options.repoSlug ?? DEFAULT_REPO_SLUG;
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const buildHealth = options.buildHealth ?? null;
  const governanceBaselineCount = options.governanceBaselineCount ?? null;
  const html = renderHtml(plan, health, { repoSlug, generatedAt, buildHealth, governanceBaselineCount });
  const planJson = `${JSON.stringify(
    {
      generated_at: generatedAt,
      plan_hash: plan._meta.hash,
      priorities_approved: prioritiesApproved(plan),
      lanes: plan.lanes,
      phases: plan.phases,
      nodes: plan.nodes,
    },
    null,
    2,
  )}\n`;
  return { html, planJson };
}

// RECORD-CAP FIX (round 15, item 3, "the site.mjs regression"; state/gate-log.json record 68, B4):
// this function's catch branch briefly returned the string 'malformed' instead of `null`, a change
// meant for readVerifyQuotesBaselineCount's OWN parsing (below) but landed here instead, on this
// function's only caller, readHealth. renderHealthStrip's `health ? … : …` ternary treats any truthy
// value -- including the string 'malformed' -- as a populated health object: `health.generated_at`,
// `health.drift?.ok`, etc. all read `undefined` on a string, so a corrupt health.json rendered a
// fully-populated-looking "From the custodian's machine — refreshed unknown" panel with every row
// reading "unknown", indistinguishable from a genuine (if stale) refresh -- a fabricated panel, not a
// disclosed fault. Reverted to the parsed form: a corrupt file reads the same as an absent one (`null`),
// which is what this function returned before that change and what readHealth's only caller,
// renderHealthStrip, already handles correctly (the "no site/data/health.json yet" branch).
function readJsonIfPresent(p) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * `site/data/health.json` if present and parseable; `null` if absent OR corrupt (see the comment on
 * readJsonIfPresent above for why corrupt is not distinguished from absent here). Exported so a test
 * can call it directly against a scratch `outDir`, the same pattern `readBuildHealth` below already
 * uses -- its only real callers remain `checkSiteDrift` and `main()`, both in this file.
 */
export function readHealth(outDir) {
  return readJsonIfPresent(path.join(outDir, 'data', 'health.json'));
}

const VERIFY_QUOTES_BASELINE_REL = 'scripts/plan/verify-quotes.baseline.json';

/**
 * The verify-quotes baseline's entry count -- round 11's ratchet condition (c) (DECISIONS-PENDING.md,
 * "RULED 2026-09-17, round 11"): "the baseline count is a line on the health strip, so a number that
 * never shrinks is visible." A repo-tracked fact, unlike health.json/build-health.json: available
 * identically at generation time and at `--check` drift-recomputation time, so reading it directly
 * (relative to `root`, not `outDir`) never causes drift between the two. Reads the `{ $doc, entries }`
 * shape verify-quotes.mjs's own `loadBaseline` reads (kept in sync by hand, not by import, to keep this
 * script's own stdlib-only, dependency-free stance) -- the pre-round-11 bare-array shape never shipped
 * on `main` and is dropped here too (round-12 fix round item (e), mirroring verify-quotes.mjs's own
 * removal). Returns: a number when the file parses to that shape; the string `'malformed'` when the
 * file EXISTS but does not (invalid JSON, or the wrong shape) -- a fault, distinct from absence, so it
 * renders as one rather than silently reading the same as "the file was never created" (round-12 fix
 * round item (e)); `null` only when the file does not exist at all. Sums `entries.length` with
 * `hashEntries.length` when the latter is present (round 15, item 3's hash-finding baseline route,
 * state/gate-log.json records 66 and 68 -- verify-quotes.mjs's own `loadHashBaseline` reads the same
 * sibling key; an absent `hashEntries` counts as zero, so every baseline.json before this round still
 * reads exactly as it did): one debt number, the whole known baseline, not only the quote half of it.
 */
export function readVerifyQuotesBaselineCount(root) {
  const p = path.join(root, VERIFY_QUOTES_BASELINE_REL);
  if (!fs.existsSync(p)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!Array.isArray(parsed?.entries)) return 'malformed';
    const hashEntries = parsed.hashEntries;
    if (hashEntries !== undefined && !Array.isArray(hashEntries)) return 'malformed';
    return parsed.entries.length + (hashEntries?.length ?? 0);
  } catch {
    return 'malformed';
  }
}

/**
 * The build-time facts, written by buildHealth.mjs inside the Pages build only (gitignored, never
 * committed). Generation reads it when it happens to be there; `checkSiteDrift` never does — the
 * committed page is compared against a generation with the build facts absent, so the drift check
 * can never depend on a file that exists on one machine and not another.
 */
export function readBuildHealth(outDir) {
  const p = path.join(outDir, 'data', 'build-health.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    // Not the same as absent: the page says so rather than claiming it was generated outside the
    // Pages build, which would be false in exactly the build that wrote this file.
    return { unreadable: e.message };
  }
}

const GENERATED_AT_RE = /"generated_at":\s*"[^"]*"/;

function normalizeHtmlTimestamp(html) {
  // The inline plan-data script embeds generated_at; strip it for the drift comparison.
  return html.replace(GENERATED_AT_RE, '"generated_at": "<generated-time>"');
}

/** Regenerates in memory and compares to the committed site/. Returns { ok, problems }. */
export function checkSiteDrift({ planPath, outDir, repoSlug }) {
  const plan = loadPlan(planPath);
  const health = readHealth(outDir);
  // Unlike buildHealth (Pages-build-only, gitignored), the baseline is a repo-tracked file: reading it
  // fresh here gives the same value it had at generation time, so it never causes drift by itself.
  const governanceBaselineCount = readVerifyQuotesBaselineCount(REPO_ROOT);
  let html, planJson;
  try {
    // buildHealth stays absent here on purpose (see readBuildHealth).
    ({ html, planJson } = renderSite(plan, health, { repoSlug, buildHealth: null, governanceBaselineCount }));
  } catch (e) {
    if (e instanceof SiteMetricViolationError) return { ok: false, problems: [e.message] };
    throw e;
  }

  const problems = [];
  const indexPath = path.join(outDir, 'index.html');
  const planJsonPath = path.join(outDir, 'data', 'plan.json');
  const nojekyllPath = path.join(outDir, '.nojekyll');

  if (!fs.existsSync(indexPath)) {
    problems.push(`${indexPath} does not exist`);
  } else {
    const committed = normalizeHtmlTimestamp(fs.readFileSync(indexPath, 'utf8'));
    const fresh = normalizeHtmlTimestamp(html);
    if (committed !== fresh) {
      // Reviewer should-fix 8 (VERIFY-QUOTES-PREREGISTRATION.md Amendment 7): this diff can come from
      // PLAN.yaml OR from scripts/plan/verify-quotes.baseline.json's own entry count (governanceGroup,
      // above) changing without `node scripts/plan/site.mjs` re-run -- named here so the diagnosis does
      // not stop at PLAN.yaml.
      problems.push(`${indexPath} differs from a fresh generation (PLAN.yaml, or verify-quotes.baseline.json's entry count, changed without regenerating site/)`);
    }
  }
  if (!fs.existsSync(planJsonPath)) {
    problems.push(`${planJsonPath} does not exist`);
  } else {
    const committed = JSON.parse(fs.readFileSync(planJsonPath, 'utf8'));
    const fresh = JSON.parse(planJson);
    committed.generated_at = fresh.generated_at = null;
    if (JSON.stringify(committed) !== JSON.stringify(fresh)) {
      problems.push(`${planJsonPath} differs from a fresh generation`);
    }
  }
  if (!fs.existsSync(nojekyllPath)) {
    problems.push(`${nojekyllPath} does not exist`);
  }

  return { ok: problems.length === 0, problems };
}

function gitRepoSlug() {
  try {
    const url = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    const m = url.match(/[:/]([^/:]+\/[^/]+?)(\.git)?$/);
    return m ? m[1] : DEFAULT_REPO_SLUG;
  } catch {
    return DEFAULT_REPO_SLUG;
  }
}

function parseArgs(argv) {
  const args = { plan: null, outDir: null, repo: null, check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--plan') args.plan = argv[++i];
    else if (a === '--out-dir') args.outDir = argv[++i];
    else if (a === '--repo') args.repo = argv[++i];
    else if (a === '--check') args.check = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const planPath = args.plan ?? path.join(REPO_ROOT, 'PLAN.yaml');
  const outDir = args.outDir ?? path.join(path.dirname(planPath), 'site');
  const repoSlug = args.repo ?? gitRepoSlug();

  if (args.check) {
    const { ok, problems } = checkSiteDrift({ planPath, outDir, repoSlug });
    if (!ok) {
      console.error('site.mjs --check: drift detected:');
      for (const p of problems) console.error(`  - ${p}`);
      process.exitCode = 1;
      return;
    }
    console.log('site.mjs --check: site/ is current.');
    return;
  }

  const plan = loadPlan(planPath);
  const health = readHealth(outDir);
  const buildHealth = readBuildHealth(outDir);
  const governanceBaselineCount = readVerifyQuotesBaselineCount(REPO_ROOT);
  const { html, planJson } = renderSite(plan, health, { repoSlug, buildHealth, governanceBaselineCount });

  fs.mkdirSync(path.join(outDir, 'data'), { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(outDir, 'data', 'plan.json'), planJson, 'utf8');
  if (!fs.existsSync(path.join(outDir, '.nojekyll'))) {
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');
  }
  console.log(`wrote ${path.join(outDir, 'index.html')}`);
  console.log(`wrote ${path.join(outDir, 'data', 'plan.json')}`);
  console.log(`wrote ${path.join(outDir, '.nojekyll')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
