// extract.mjs — builds the gate dataset from tracked files and git history; writes data/*.json.
//
//   node state/consults/cloud/gate-analytics/scripts/extract.mjs [--rev <commit>]
//
// Inputs (all read at the working tree; the git history must be complete, not shallow):
//   state/gate-log.json            one row per gate attempt (node, gate, attempt, verdict, date, note, record)
//   state/consults/gates/*.md      the filed gate reports; a row names its report in its note
//   governance/PLAN.yaml           lane, form path (gate:), PR (evidence.pr) per node
//   governance/forms/**            the preregistration forms: kind, declared line budget, drafter
//   git history of main            the form's first commit; the PR's merge commit
// Outputs: data/entries.json, data/findings.json, data/pieces.json, data/meta.json.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { read, git, listDir, walk, exists, OUT, ROOT, basename } from './lib.mjs';
import { parseReport, classify, PROPORTIONAL_FROM } from './parse-report.mjs';
import { loadPlan } from '../../../../../scripts/plan/plan.mjs';

const REV = (() => {
  const i = process.argv.indexOf('--rev');
  return i > 0 ? process.argv[i + 1] : 'HEAD';
})();

// ---------------------------------------------------------------- gate log
const log = JSON.parse(read('state/gate-log.json'));
const entries = log.map((e, idx) => {
  const note = e.note || '';
  const report = (/state\/consults\/gates\/([\w.-]+\.md)/.exec(note) || [])[1] || null;
  const prs = [...new Set([...note.matchAll(/PR #(\d+)/g)].map((m) => +m[1]))];
  const gen = (/node:[\w.-]+@g(\d+)/.exec(note) || [])[1];
  return {
    idx,
    node: e.node,
    gate: e.gate,
    attempt: e.attempt,
    verdict: e.verdict,
    date: e.date,
    record: !!e.record || /record round|record-correction|record fidelity/i.test(note.slice(0, 400)),
    report,
    prs,
    firstPr: prs[0] ?? null,
    generation: gen ? +gen : null,
  };
});

// Episodes ("counts"): within a node, a gate's attempt number restarts at a fresh count (a re-scope, a new
// generation, a new PR). An entry starts a new episode when its attempt is not above that gate's last attempt in
// the current episode.
const byNode = new Map();
for (const e of entries) {
  if (!byNode.has(e.node)) byNode.set(e.node, []);
  byNode.get(e.node).push(e);
}
for (const list of byNode.values()) {
  let ep = 1;
  let last = {};
  for (const e of list) {
    if (e.verdict === 'VOID') { e.episode = ep; continue; }
    if (last[e.gate] != null && e.attempt <= last[e.gate]) { ep += 1; last = {}; }
    last[e.gate] = e.attempt;
    e.episode = ep;
  }
}
// A correction round: round k (k >= 2) of an episode, entered after a FAIL at round k-1 of the same episode.
for (const list of byNode.values()) {
  const live = list.filter((e) => e.verdict !== 'VOID');
  for (const e of live) {
    e.correction = e.attempt >= 2 && live.some((x) => x.episode === e.episode && x.attempt === e.attempt - 1 && x.verdict === 'FAIL');
  }
}

// ---------------------------------------------------------------- reports and findings
const reportFiles = listDir('state/consults/gates').filter((f) => f.endsWith('.md')).sort();
const entryByReport = new Map(entries.filter((e) => e.report).map((e) => [e.report, e]));
const findings = [];
const reportStats = [];
for (const f of reportFiles) {
  const e = entryByReport.get(f);
  const text = read(`state/consults/gates/${f}`);
  const date = e?.date || f.slice(0, 10);
  const { findings: fs, reportUsesClasses, fallbackUsed, verdictLineUsed } = parseReport(text, { date: f.slice(0, 10), verdict: e?.verdict ?? null });
  reportStats.push({ report: f, entry: e?.idx ?? null, verdict: e?.verdict ?? null, findings: fs.length, reportUsesClasses, fallbackUsed, verdictLineUsed, bytes: text.length });
  for (const x of fs) {
    const inferred = x.cls ? null : classify(x.title, x.text);
    findings.push({
      report: f,
      entry: e?.idx ?? null,
      node: e?.node ?? null,
      gate: e?.gate ?? (/-(architect|reviewer)(?:[-.]|$)/.exec(f) || [])[1] ?? null,
      verdict: e?.verdict ?? null,
      date,
      era: f.slice(0, 10) >= PROPORTIONAL_FROM ? 'proportional' : 'before',
      label: x.label,
      prefix: x.prefix,
      severity: x.severity,
      statedClass: x.cls,
      statedHow: x.how,
      inferredClass: inferred,
      // the inferred rule is also run on stated findings, to measure its agreement
      ruleClass: classify(x.title, x.text),
      cls: x.cls || inferred,
      underPass: !!x.underPass,
      fallback: !!x.fallback,
      title: x.title.slice(0, 240),
    });
  }
}

// ---------------------------------------------------------------- PLAN
const plan = loadPlan(join(ROOT, 'governance/PLAN.yaml'));
const planNodes = new Map(plan.nodes.map((n) => [n.id, n]));

// ---------------------------------------------------------------- forms
const formFiles = walk('governance/forms').filter((p) => p.endsWith('.md'));
const formByStem = new Map();
for (const p of formFiles) {
  const stem = basename(p).replace(/-PREREGISTRATION\.md$/i, '').replace(/\.md$/, '').toLowerCase();
  if (!formByStem.has(stem)) formByStem.set(stem, p);
}
const PREFIXES = ['engine-', 'kernel-', 'shell-', 'governance-', 'publish-', 'skp-', 'data-plane-', 'frontends-', 'tools-', 'scripts-', 'renderer-', 'protocol-'];
function findForm(node) {
  const n = planNodes.get(node);
  if (n && typeof n.gate === 'string' && n.gate !== 'none' && exists(n.gate) && /PREREGISTRATION/i.test(n.gate)) return { path: n.gate, how: 'PLAN gate' };
  const cands = [node];
  for (const p of PREFIXES) if (node.startsWith(p)) cands.push(node.slice(p.length));
  for (const c of cands) if (formByStem.has(c)) return { path: formByStem.get(c), how: 'name match' };
  return { path: null, how: null };
}

// A figure: not a section number (§21c), not followed by a letter.
const NUM = '(?<![§\\d.,])(\\d{1,3}(?:,\\d{3})+|\\d+)(?![\\d,]*[a-zA-Z(])';
const BUDGET_PATTERNS = [
  new RegExp(`line budget[^0-9\\n]{0,40}${NUM}`, 'i'),
  new RegExp(`(?:at most|≤|<=|up to|no more than|within)\\s*${NUM}\\s*(?:changed |non-generated |insertions plus deletions |product |code |inserted |)*lines?`, 'i'),
  new RegExp(`budget[^0-9\\n]{0,30}${NUM}\\s*(?:changed |non-generated )*lines?`, 'i'),
  new RegExp(`${NUM}\\s*(?:changed |non-generated )*lines? (?:budget|ceiling|cap)`, 'i'),
  new RegExp(`(?:at most|≤|<=|up to)\\s*${NUM}\\s*(?:insertions|changed)`, 'i'),
];
// A §7 table with a "Lines" column: its total row, else the sum of its rows.
function tableBudget(text) {
  const tables = [];
  let curT = null;
  for (const l of text.split('\n')) {
    if (/^\s*\|/.test(l)) { if (!curT) tables.push((curT = [])); curT.push(l.trim()); } else curT = null;
  }
  const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
  for (const rows of tables) {
    if (rows.length < 3) continue;
    const hdr = cells(rows[0]);
    let col = hdr.findIndex((c) => /lines/i.test(c));
    if (col < 0) col = hdr.findIndex((c) => /ceiling|budget/i.test(c));
    if (col < 0) continue;
    let sum = 0, any = false, total = null;
    for (const r of rows.slice(2)) {
      const c = cells(r);
      const v = /(\d{1,3}(?:,\d{3})+|\d+)/.exec(c[col] || '');
      if (!v) continue;
      const n = +v[1].replace(/,/g, '');
      if (/total/i.test(c[0] || '')) total = n;
      else { sum += n; any = true; }
    }
    if (total != null) return { n: total, total: true };
    if (any) return { n: sum, total: false };
  }
  return null;
}
const GENERIC = new RegExp(`${NUM}\\s*(?:changed |non-generated |product |code |)*lines\\b`, 'i');
// Order: a budget table's total row; the budget phrases; a budget table's row sum; any "<n> lines".
function firstBudget(text) {
  const t = tableBudget(text);
  if (t?.total) return t.n;
  for (const re of BUDGET_PATTERNS) {
    const m = re.exec(text);
    if (m) return +m[1].replace(/,/g, '');
  }
  if (t) return t.n;
  const g = GENERIC.exec(text);
  return g ? +g[1].replace(/,/g, '') : null;
}
function formFacts(path) {
  const text = read(path);
  const lines = text.split('\n');
  const head = lines.slice(0, 40).join('\n');
  const fiveLine = /five-line/i.test(lines[0]) || (/^Authority:/m.test(head) && /^Scope:/m.test(head) && /^Out-of-scope:/m.test(head));
  let declared = null, declaredFrom = null;
  if (fiveLine) {
    const scope = lines.find((l) => /^Scope:/.test(l)) || '';
    declared = firstBudget(scope);
    declaredFrom = declared != null ? 'Scope line' : null;
  }
  if (declared == null) {
    const i = lines.findIndex((l) => /^#{2,3}\s*§?\s*7[.\s:]/.test(l) && /declared|ceiling|budget|values/i.test(l));
    if (i >= 0) {
      let j = i + 1;
      while (j < lines.length && !/^#{2}\s|^#{3}\s*§?\s*8[.\s]/.test(lines[j])) j++;
      declared = firstBudget(lines.slice(i, j).join('\n'));
      if (declared != null) declaredFrom = '§7';
    }
  }
  if (declared == null) {
    // the form's text before §10 (amendments come after; an amendment's figure is not the declared one)
    const k = lines.findIndex((l) => /^#{2,3}\s*§?\s*10[.\s]|^#{2,3}\s*Amendment/i.test(l));
    declared = firstBudget(lines.slice(0, k > 0 ? k : lines.length).join('\n'));
    if (declared != null) declaredFrom = 'form text before §10';
  }
  const top = lines.slice(0, 30).join(' ');
  let drafter = 'not stated';
  if (/lead-data's draft|from lead-data's|drafted by:?\**:?\s*lead-data/i.test(top)) drafter = 'lead-data';
  else if (/architect's draft|drafted by:?\**:?\s*(?:the )?architect|architect drafts|the architect agent/i.test(top)) drafter = 'architect';
  else if (/drafted by:?\**:?\s*(?:the )?custodian|custodian's draft/i.test(top)) drafter = 'custodian';
  return { kind: fiveLine ? 'five-line' : 'full', declared, declaredFrom, drafter };
}

function firstCommit(path) {
  const out = git(['log', REV, '--follow', '--diff-filter=A', '--format=%H%x09%cI', '--', path]).trim().split('\n').filter(Boolean);
  if (!out.length) return null;
  const [sha, when] = out[out.length - 1].split('\t');
  return { sha, when };
}

// ---------------------------------------------------------------- merges
const merges = new Map();
for (const line of git(['log', REV, '--first-parent', '--merges', '--format=%H%x09%cI%x09%s']).split('\n')) {
  const [sha, when, subject] = line.split('\t');
  const m = /Merge pull request #(\d+)/.exec(subject || '');
  if (m && !merges.has(+m[1])) merges.set(+m[1], { sha, when });
}

// ---------------------------------------------------------------- pieces
const pieces = [];
for (const [node, list] of byNode) {
  const live = list.filter((e) => e.verdict !== 'VOID');
  const n = planNodes.get(node);
  const form = findForm(node);
  const facts = form.path ? formFacts(form.path) : { kind: null, declared: null, declaredFrom: null, drafter: null };
  const fc = form.path ? firstCommit(form.path) : null;
  const prSet = new Set(list.flatMap((e) => e.prs));
  if (n?.evidence?.pr != null) prSet.add(+n.evidence.pr);
  const merged = [...prSet].filter((p) => merges.has(p)).map((p) => ({ pr: p, ...merges.get(p) }));
  merged.sort((a, b) => a.when.localeCompare(b.when));
  const lastMerge = merged.length ? merged[merged.length - 1] : null;
  const firstPass = {};
  for (const g of ['reviewer', 'architect', 'tester']) {
    const first = live.find((e) => e.gate === g);
    if (first) firstPass[g] = { verdict: first.verdict, attempt: first.attempt, idx: first.idx };
  }
  const nf = findings.filter((x) => x.node === node);
  const count = (pred) => nf.filter(pred).length;
  const episodes = Math.max(...live.map((e) => e.episode));
  const corr = new Set(live.filter((e) => e.correction).map((e) => `${e.episode}:${e.attempt}`));
  const corrRecord = new Set(live.filter((e) => e.correction && e.record).map((e) => `${e.episode}:${e.attempt}`));
  const days = fc && lastMerge ? (Date.parse(lastMerge.when) - Date.parse(fc.when)) / 86400000 : null;
  pieces.push({
    node,
    inPlan: !!n,
    lane: n?.lane ?? '(not a PLAN node)',
    status: n?.status ?? null,
    firstDate: live[0]?.date ?? list[0].date,
    month: (live[0]?.date ?? list[0].date).slice(0, 7),
    gates: [...new Set(live.map((e) => e.gate))].sort(),
    attempts: live.length,
    reports: list.filter((e) => e.report).length,
    episodes,
    correctionRounds: corr.size,
    recordCorrectionRounds: corrRecord.size,
    endedPassed: (() => {
      // the last episode's last attempt of every gate it ran passed
      const lastEp = live.filter((e) => e.episode === episodes);
      const lastBy = {};
      for (const e of lastEp) lastBy[e.gate] = e;
      return Object.values(lastBy).every((e) => e.verdict !== 'FAIL');
    })(),
    firstPass,
    findings: {
      // a finding: an item raised as blocking, must-fix or should-fix (notes and nits are not findings, AUTONOMY §22)
      C: count((x) => x.cls === 'C' && ['BLOCK', 'MUSTFIX', 'SHOULD'].includes(x.severity)),
      E: count((x) => x.cls === 'E' && ['BLOCK', 'MUSTFIX', 'SHOULD'].includes(x.severity)),
      D: count((x) => x.cls === 'D' && ['BLOCK', 'MUSTFIX', 'SHOULD'].includes(x.severity)),
      blocking: count((x) => x.severity === 'BLOCK'),
      inferred: count((x) => !x.statedClass && x.severity !== 'NOTE'),
      notes: count((x) => x.severity === 'NOTE'),
    },
    form: form.path,
    formHow: form.how,
    formKind: facts.kind,
    declaredLines: facts.declared,
    declaredFrom: facts.declaredFrom,
    drafter: facts.drafter,
    formCommit: fc,
    prs: [...prSet].sort((a, b) => a - b),
    merged: merged.map((m) => m.pr),
    lastMerge,
    daysFormToMerge: days,
  });
}

// ---------------------------------------------------------------- write
mkdirSync(join(OUT, 'data'), { recursive: true });
const head = git(['rev-parse', REV]).trim();
const meta = {
  rev: head,
  generated: 'by scripts/extract.mjs; re-run to regenerate',
  gateLogRows: log.length,
  reportsFiled: reportFiles.length,
  reportsReferenced: entryByReport.size,
  findings: findings.length,
  pieces: pieces.length,
  proportionalFrom: PROPORTIONAL_FROM,
};
const w = (name, obj) => writeFileSync(join(OUT, 'data', name), `${JSON.stringify(obj, null, 1)}\n`);
w('entries.json', entries);
w('findings.json', findings);
w('pieces.json', pieces);
w('reports.json', reportStats);
w('meta.json', meta);
console.log(JSON.stringify(meta));
