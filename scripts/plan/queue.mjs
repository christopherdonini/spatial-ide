#!/usr/bin/env node
// scripts/plan/queue.mjs
//
// Generates CUSTODIAN-QUEUE.md and CUSTODIAN-QUEUE.json from PLAN.yaml (AUTONOMY.md §2).
// Node's standard library only.
//
// Usage:
//   node scripts/plan/queue.mjs [--plan <path>] [--out-dir <dir>] [--check]
//
// --check regenerates in memory and exits 1 (listing what differs) if the committed
// CUSTODIAN-QUEUE.md/.json differ from a fresh generation -- the drift check §6 requires.
// The header's generation timestamp is normalized out of the comparison (see
// normalizeGeneratedTimestamp below): only real content drift fails the check.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  loadPlan,
  deriveStates,
  indexById,
  prioritiesApproved,
  NEEDS_HUMAN_ORDER,
} from './plan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

export function formatEvidence(evidence) {
  if (evidence === null || evidence === undefined) return 'none';
  if (evidence.pr !== undefined) return `PR #${evidence.pr}`;
  if (evidence.adr !== undefined) return evidence.adr;
  if (evidence.tag !== undefined) return `tag \`${evidence.tag}\``;
  if (evidence.release !== undefined) return `release \`${evidence.release}\``;
  if (evidence.commit !== undefined) return `commit \`${evidence.commit}\``;
  if (evidence.path !== undefined) return `\`${evidence.path}\``;
  if (evidence.log !== undefined) return `log \`${evidence.log}\``;
  if (evidence.branch !== undefined) return `branch \`${evidence.branch}\``;
  return JSON.stringify(evidence);
}

function nodeSummary(node) {
  return {
    id: node.id,
    title: node.title,
    lane: node.lane,
    phase: node.phase,
    status: node.status,
    order: node.order,
    budget_minutes: node.budget_minutes,
    needs_human: node.needs_human,
    evidence: node.evidence,
    dates: node.dates,
    summary: node.summary,
  };
}

/** Builds the queue's JSON structure (the JSON and Markdown outputs carry the same content). */
export function buildQueue(plan, { generatedAt = new Date().toISOString() } = {}) {
  const lanes = indexById(plan.lanes);
  const { ready, waitingOnHuman, blockedOnDeps } = deriveStates(plan);

  const byKind = Object.fromEntries(NEEDS_HUMAN_ORDER.map((k) => [k, []]));
  let waitingTotalMinutes = 0;
  for (const node of waitingOnHuman) {
    const kind = node.needs_human.kind;
    (byKind[kind] ??= []).push(nodeSummary(node));
    waitingTotalMinutes += node.needs_human.minutes ?? 0;
  }

  const inProgress = plan.nodes
    .filter((n) => n.status === 'in-progress')
    .sort((a, b) => (lanes.get(a.lane)?.priority ?? 1e9) - (lanes.get(b.lane)?.priority ?? 1e9));

  const proposed = plan.nodes.filter((n) => n.status === 'proposed');
  const unscheduled = plan.nodes.filter((n) => n.status === 'unscheduled');

  return {
    generated_at: generatedAt,
    plan_hash: plan._meta.hash,
    priorities_approved: prioritiesApproved(plan),
    next: ready.length > 0 ? nodeSummary(ready[0]) : null,
    ready: ready.map(nodeSummary),
    waiting_on_human: {
      total_minutes: waitingTotalMinutes,
      by_kind: Object.fromEntries(
        NEEDS_HUMAN_ORDER.map((k) => [k, byKind[k].map((n) => n)]),
      ),
    },
    blocked_on_dependencies: blockedOnDeps.map(({ node, blockedBy }) => ({
      ...nodeSummary(node),
      blocked_by: blockedBy,
    })),
    in_progress: inProgress.map((n) => ({ ...nodeSummary(n), evidence_label: formatEvidence(n.evidence) })),
    proposed: proposed.map(nodeSummary),
    unscheduled: unscheduled.map(nodeSummary),
  };
}

const GENERATED_LINE_RE = /^Generated from `PLAN\.yaml` \(sha256 `[0-9a-f]+`\) at `.*`\.$/m;
const GENERATED_LINE_PLACEHOLDER =
  'Generated from `PLAN.yaml` (sha256 `<hash>`) at `<generated-time>`.';

/** Renders the Markdown view. Section order follows AUTONOMY.md §2 exactly. */
export function renderMarkdown(queue) {
  const lines = [];
  lines.push('# CUSTODIAN-QUEUE');
  lines.push('');
  lines.push(
    `Generated from \`PLAN.yaml\` (sha256 \`${queue.plan_hash}\`) at \`${queue.generated_at}\`.`,
  );
  if (!queue.priorities_approved) {
    lines.push('');
    lines.push(
      '**Seeded, pending approval.** Lane priorities below are the seeded order from the directive; ' +
        'they have not yet been approved by the human (AUTONOMY.md §2, §4 — the first AskUserQuestion).',
    );
  }
  lines.push('');

  lines.push('## 1. Next');
  lines.push('');
  if (queue.next) {
    lines.push(`- **${queue.next.id}** — ${queue.next.title} (lane \`${queue.next.lane}\`)`);
  } else {
    lines.push('- (nothing ready)');
  }
  lines.push('');

  lines.push('## 2. Ready');
  lines.push('');
  if (queue.ready.length === 0) {
    lines.push('- (none)');
  } else {
    for (const n of queue.ready) {
      lines.push(
        `- **${n.id}** — ${n.title} (lane \`${n.lane}\`, order ${n.order}, budget ${n.budget_minutes} min)`,
      );
    }
  }
  lines.push('');

  lines.push(`## 3. Waiting on the human (total: ${queue.waiting_on_human.total_minutes} min)`);
  lines.push('');
  let anyWaiting = false;
  for (const kind of NEEDS_HUMAN_ORDER) {
    const items = queue.waiting_on_human.by_kind[kind];
    if (!items || items.length === 0) continue;
    anyWaiting = true;
    lines.push(`### ${kind}`);
    lines.push('');
    for (const n of items) {
      lines.push(`- **${n.id}** — ${n.title} (${n.needs_human.minutes} min)`);
    }
    lines.push('');
  }
  if (!anyWaiting) {
    lines.push('- (none)');
    lines.push('');
  }

  lines.push('## 4. Blocked on dependencies');
  lines.push('');
  if (queue.blocked_on_dependencies.length === 0) {
    lines.push('- (none)');
  } else {
    for (const n of queue.blocked_on_dependencies) {
      lines.push(`- **${n.id}** — ${n.title} — blocked by: ${n.blocked_by.join(', ')}`);
    }
  }
  lines.push('');

  lines.push('## 5. In progress');
  lines.push('');
  if (queue.in_progress.length === 0) {
    lines.push('- (none)');
  } else {
    for (const n of queue.in_progress) {
      lines.push(`- **${n.id}** — ${n.title} — evidence: ${n.evidence_label}`);
    }
  }
  lines.push('');

  lines.push('## 6. Proposed / unscheduled');
  lines.push('');
  lines.push('### Proposed');
  lines.push('');
  if (queue.proposed.length === 0) {
    lines.push('- (none)');
  } else {
    for (const n of queue.proposed) {
      lines.push(`- **${n.id}** — ${n.title} (phase \`${n.phase}\`) — never queued until placed`);
    }
  }
  lines.push('');
  lines.push('### Unscheduled');
  lines.push('');
  if (queue.unscheduled.length === 0) {
    lines.push('- (none)');
  } else {
    for (const n of queue.unscheduled) {
      lines.push(`- **${n.id}** — ${n.title} (phase \`${n.phase}\`) — ambition, never queued`);
    }
  }
  lines.push('');

  return lines.join('\n');
}

export function normalizeGeneratedTimestamp(markdown) {
  return markdown.replace(GENERATED_LINE_RE, GENERATED_LINE_PLACEHOLDER);
}

function parseArgs(argv) {
  const args = { plan: null, outDir: null, check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--plan') args.plan = argv[++i];
    else if (a === '--out-dir') args.outDir = argv[++i];
    else if (a === '--check') args.check = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

/**
 * Regenerates the queue from `planPath` in memory and compares it against the committed
 * CUSTODIAN-QUEUE.md/.json in `outDir`. Returns { ok, problems }. Used by both `--check` here
 * and by verify.mjs's own drift check (§6), which calls this directly rather than shelling out.
 */
export function checkQueueDrift({ planPath, outDir }) {
  const mdPath = path.join(outDir, 'CUSTODIAN-QUEUE.md');
  const jsonPath = path.join(outDir, 'CUSTODIAN-QUEUE.json');
  const plan = loadPlan(planPath);
  const queue = buildQueue(plan);
  const markdown = renderMarkdown(queue);
  const json = `${JSON.stringify(queue, null, 2)}\n`;

  const problems = [];
  if (!fs.existsSync(mdPath)) {
    problems.push(`${mdPath} does not exist`);
  } else {
    const committed = normalizeGeneratedTimestamp(fs.readFileSync(mdPath, 'utf8'));
    const fresh = normalizeGeneratedTimestamp(markdown);
    if (committed !== fresh) problems.push(`${mdPath} differs from a fresh generation`);
  }
  if (!fs.existsSync(jsonPath)) {
    problems.push(`${jsonPath} does not exist`);
  } else {
    const committed = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const fresh = JSON.parse(json);
    committed.generated_at = fresh.generated_at = null; // timestamp-only drift is not real drift
    if (JSON.stringify(committed) !== JSON.stringify(fresh)) {
      problems.push(`${jsonPath} differs from a fresh generation`);
    }
  }
  return { ok: problems.length === 0, problems };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const planPath = args.plan ?? path.join(REPO_ROOT, 'PLAN.yaml');
  const outDir = args.outDir ?? path.dirname(planPath);
  const mdPath = path.join(outDir, 'CUSTODIAN-QUEUE.md');
  const jsonPath = path.join(outDir, 'CUSTODIAN-QUEUE.json');

  if (args.check) {
    const { ok, problems } = checkQueueDrift({ planPath, outDir });
    if (!ok) {
      console.error('queue.mjs --check: drift detected:');
      for (const p of problems) console.error(`  - ${p}`);
      process.exitCode = 1;
      return;
    }
    console.log('queue.mjs --check: CUSTODIAN-QUEUE.md/.json are current.');
    return;
  }

  const plan = loadPlan(planPath);
  const queue = buildQueue(plan);
  const markdown = renderMarkdown(queue);
  const json = `${JSON.stringify(queue, null, 2)}\n`;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(mdPath, markdown, 'utf8');
  fs.writeFileSync(jsonPath, json, 'utf8');
  console.log(`wrote ${mdPath}`);
  console.log(`wrote ${jsonPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
