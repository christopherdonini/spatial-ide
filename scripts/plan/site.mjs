#!/usr/bin/env node
// scripts/plan/site.mjs
//
// Generates the landing page (AUTONOMY.md §5) from PLAN.yaml (+ site/data/health.json, if
// present): site/index.html (self-contained: inline CSS/JS; the only external resources are the
// GitHub workflow badge image and hyperlinks), site/data/plan.json, site/.nojekyll.
// Node's standard library only.
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

// Judgment call, not fixed by AUTONOMY.md: which workflow's badge stands for "CI on main" on the
// landing page. product-ci-rust.yml is the kernel/engine suite every module ultimately depends
// on; swap this constant if the human wants a different primary indicator (e.g.
// governance-ci.yml, or a composite of all product workflows). health.mjs records the actual run
// conclusion independently of which badge is shown here.
export const CI_BADGE_WORKFLOW = 'product-ci-rust.yml';
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

function humanKindLabel(kind, minutes) {
  return `${esc(kind)} (${minutes} min)`;
}

function renderNodeBox(node, { showCheckmark = false, ambition = false, crossNotes = [] } = {}) {
  const classes = ['node-box'];
  if (ambition) classes.push('ambition');
  if (node.status === 'blocked' && node.needs_human && node.needs_human.kind !== 'none') {
    classes.push('blocked-human');
  }
  const mark = showCheckmark ? '<span class="check" aria-hidden="true">&#10003;</span> ' : '';
  const humanBadge =
    node.needs_human && node.needs_human.kind !== 'none'
      ? `<span class="badge badge-human">${humanKindLabel(node.needs_human.kind, node.needs_human.minutes)}</span>`
      : '';
  const crossNote =
    crossNotes.length > 0
      ? `<div class="cross-note">after: ${crossNotes.map((d) => esc(d)).join(', ')}</div>`
      : '';
  return (
    `<div class="${classes.join(' ')}" id="node-${esc(node.id)}">` +
    `${mark}<span class="node-id">${esc(node.id)}</span> — ${esc(node.title)}` +
    `${humanBadge}` +
    crossNote +
    `</div>`
  );
}

function renderLane(lane, nodesInLane, { repoSlug }) {
  const done = nodesInLane
    .filter((n) => n.status === 'done')
    .sort((a, b) => (a.dates?.done ?? '').localeCompare(b.dates?.done ?? '') || a.id.localeCompare(b.id));
  const ahead = nodesInLane
    .filter((n) => ['ready', 'in-progress', 'blocked', 'proposed'].includes(n.status))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));
  const unscheduled = nodesInLane.filter((n) => n.status === 'unscheduled');

  const allUnscheduled = nodesInLane.length > 0 && nodesInLane.every((n) => n.status === 'unscheduled');

  const doneHtml = done
    .map((n) => {
      const date = n.dates?.done ? ` <span class="date">(${esc(n.dates.done)})</span>` : '';
      return `<div class="node-box done"><span class="check" aria-hidden="true">&#10003;</span> <span class="node-id">${esc(n.id)}</span> — ${esc(n.title)}${date} ${evidenceLink(n.evidence, repoSlug)}</div>`;
    })
    .join('\n');

  const { svg, crossNotes } = renderAheadArrows(ahead);
  const aheadHtml = ahead
    .map((n) => renderNodeBox(n, { crossNotes: crossNotes.get(n.id) ?? [] }))
    .join('\n');

  const unscheduledHtml = unscheduled
    .map(
      (n) =>
        `<div class="node-box ambition"><span class="node-id">${esc(n.id)}</span> — ${esc(n.title)} <span class="phase-cite">${esc(n.phase)}</span></div>`,
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
  const total = waitingOnHuman.reduce((sum, n) => sum + (n.needs_human.minutes ?? 0), 0);
  const items = waitingOnHuman
    .map(
      (n) =>
        `<li><strong>${esc(n.id)}</strong> — ${esc(n.title)} — ${humanKindLabel(n.needs_human.kind, n.needs_human.minutes)}</li>`,
    )
    .join('\n');
  return `
  <section class="panel" id="waiting-on-you">
    <h2>Waiting on you <span class="total">(${total} min total)</span></h2>
    <ul>${items || '<li class="empty">(nothing)</li>'}</ul>
  </section>`;
}

function formatDiskFree(disk) {
  if (!disk) return 'unknown';
  if (disk.error) return `error: ${disk.error}`;
  if (typeof disk.bytes === 'number') {
    const gb = disk.bytes / 1024 ** 3;
    return `${gb.toFixed(1)} GB free${disk.drive ? ` (drive ${disk.drive})` : ''}`;
  }
  if (disk.raw) return disk.raw.split(/\r?\n/)[0]; // first line only -- `df` output can be wide
  return 'unknown';
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

function formatOpenPrs(openPrs) {
  if (!openPrs) return 'unknown';
  if (openPrs.error) return `error: ${openPrs.error}`;
  const items = openPrs.items ?? [];
  if (items.length === 0) return openPrs.note ? openPrs.note : '0 open';
  const oldest = oldestBy(items, 'age_days');
  return `${items.length} open, oldest ${oldest.age_days ?? '?'} d (#${oldest.number})`;
}

function formatWaitingOnHuman(waiting) {
  const items = Array.isArray(waiting) ? waiting : [];
  if (items.length === 0) return '0 waiting';
  const withAge = items.filter((n) => typeof n.age_days === 'number');
  if (withAge.length === 0) return `${items.length} waiting (age unknown)`;
  const oldest = oldestBy(withAge, 'age_days');
  return `${items.length} waiting, oldest ${oldest.age_days} d (${oldest.id})`;
}

function renderHealthStrip(health) {
  if (!health) {
    return `<section class="panel health-strip"><h2>Health</h2><p class="empty">no site/data/health.json yet — never refreshed</p></section>`;
  }
  // Six rows (§5/§15): CI on main, drift, disk free, stray processes, open-PR age, waiting-on-human age.
  const rows = [
    ['CI on main', health.ci?.conclusion ?? 'unknown'],
    ['Drift', health.drift?.ok === true ? 'clean' : health.drift?.ok === false ? 'DRIFT' : 'unknown'],
    ['Disk free', formatDiskFree(health.disk_free)],
    ['Stray processes', formatStrayProcesses(health.stray_processes)],
    ['Open PRs', formatOpenPrs(health.open_prs)],
    ['Waiting on human', formatWaitingOnHuman(health.waiting_on_human)],
  ];
  const rowsHtml = rows.map(([k, v]) => `<div class="health-row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('\n');
  return `
  <section class="panel health-strip">
    <h2>Health <span class="refreshed">refreshed ${esc(health.generated_at ?? 'unknown')}</span></h2>
    ${rowsHtml}
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
.node-id { font-family: ui-monospace, monospace; font-size: 0.8rem; }
.check { color: #292; }
.badge { display: inline-block; font-size: 0.72rem; border-radius: 4px; padding: 0 5px; margin-left: 6px; }
.badge-human { background: #fde8c0; color: #664400; }
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
.refreshed { font-weight: normal; color: #889; font-size: 0.78rem; }
.seeded-note { background: #fde8c0; border: 1px solid #e0a030; border-radius: 6px; padding: 6px 10px; font-size: 0.85rem; margin-bottom: 12px; }
@media (max-width: 480px) {
  body { padding: 8px; }
  .panels { grid-template-columns: 1fr; }
  .lane-columns { grid-template-columns: 1fr; }
}
`;

function renderHtml(plan, health, { repoSlug, generatedAt }) {
  const violations = findMetricViolations(plan);
  if (violations.length > 0) throw new SiteMetricViolationError(violations);

  const lanes = [...(plan.lanes ?? [])].sort((a, b) => a.priority - b.priority);
  const nodesByLane = new Map(lanes.map((l) => [l.id, []]));
  for (const n of plan.nodes ?? []) {
    if (!nodesByLane.has(n.lane)) nodesByLane.set(n.lane, []);
    nodesByLane.get(n.lane).push(n);
  }
  const { waitingOnHuman } = deriveStates(plan);

  const badgeUrl = `https://github.com/${repoSlug}/actions/workflows/${CI_BADGE_WORKFLOW}/badge.svg?branch=main`;
  const seededNote = prioritiesApproved(plan)
    ? ''
    : `<div class="seeded-note">Seeded, pending approval: lane priorities below are the seeded order from the directive, not yet approved (AUTONOMY.md §2, §4).</div>`;

  const laneHtml = lanes.map((lane) => renderLane(lane, nodesByLane.get(lane.id) ?? [], { repoSlug })).join('\n');

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
  <a href="https://github.com/${repoSlug}/actions/workflows/${CI_BADGE_WORKFLOW}"><img src="${badgeUrl}" alt="CI on main" /></a>
  <a href="https://github.com/${repoSlug}">repository</a>
</header>
${seededNote}
<div class="panels">
${renderWaitingOnYou(waitingOnHuman)}
<section class="panel" id="shipped-since-last-visit">
  <h2>Shipped since your last visit</h2>
  <ul id="shipped-list"><li class="empty">loading…</li></ul>
</section>
</div>
${renderHealthStrip(health)}
<main>
${laneHtml}
</main>
<script id="plan-data" type="application/json">${safeJsonForScript(planData)}</script>
<script>
(function () {
  var data = JSON.parse(document.getElementById('plan-data').textContent);
  var STORAGE_KEY = 'spatial-ide-custodian-last-visit';
  var now = new Date();
  var lastVisitRaw = null;
  try { lastVisitRaw = localStorage.getItem(STORAGE_KEY); } catch (e) { /* localStorage unavailable */ }
  var since;
  if (lastVisitRaw) {
    since = new Date(lastVisitRaw);
  } else {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // first visit: last seven days
  }
  var shipped = (data.done_nodes || []).filter(function (n) {
    return n.dates && n.dates.done && new Date(n.dates.done) >= since;
  });
  var list = document.getElementById('shipped-list');
  list.innerHTML = '';
  if (shipped.length === 0) {
    var li = document.createElement('li');
    li.className = 'empty';
    li.textContent = '(nothing since your last visit)';
    list.appendChild(li);
  } else {
    shipped.forEach(function (n) {
      var li = document.createElement('li');
      li.textContent = n.id + ' — ' + n.title + ' (' + n.dates.done + ')';
      list.appendChild(li);
    });
  }
  try { localStorage.setItem(STORAGE_KEY, now.toISOString()); } catch (e) { /* localStorage unavailable */ }
})();
</script>
</body>
</html>
`;
}

/** Pure: builds { html, planJson } from an already-loaded plan and optional health object. */
export function renderSite(plan, health, options = {}) {
  const repoSlug = options.repoSlug ?? DEFAULT_REPO_SLUG;
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const html = renderHtml(plan, health, { repoSlug, generatedAt });
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

function readHealth(outDir) {
  const p = path.join(outDir, 'data', 'health.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
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
  let html, planJson;
  try {
    ({ html, planJson } = renderSite(plan, health, { repoSlug }));
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
    if (committed !== fresh) problems.push(`${indexPath} differs from a fresh generation`);
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
  const { html, planJson } = renderSite(plan, health, { repoSlug });

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
