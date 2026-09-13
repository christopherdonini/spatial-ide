// scripts/plan/plan.mjs
//
// PLAN.yaml loading, validation, and derivation (AUTONOMY.md §1, §2, §3, §10).
// Node's standard library only.

import fs from 'node:fs';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { parseYamlSubset, YamlSubsetError } from './yamlSubset.mjs';

export { YamlSubsetError };

export const STATUSES = ['done', 'in-progress', 'ready', 'blocked', 'proposed', 'unscheduled'];
export const NEEDS_HUMAN_KINDS = ['none', 'sight', 'ruling', 'sitting', 'click'];
export const NON_QUEUED_STATUSES = ['done', 'in-progress', 'proposed', 'unscheduled'];
// AUTONOMY.md §4/§10: "Waiting on the human" groups in this order (click first).
export const NEEDS_HUMAN_ORDER = ['click', 'sight', 'ruling', 'sitting'];

const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Thrown by loadPlan when the plan file does not exist. */
export class PlanFileMissingError extends Error {
  constructor(path) {
    super(`plan file not found: ${path}`);
    this.name = 'PlanFileMissingError';
    this.path = path;
  }
}

/** Thrown by loadPlan when the parsed plan fails structural validation. */
export class PlanValidationError extends Error {
  constructor(errors, path) {
    super(`plan validation failed (${path ?? '<plan>'}):\n${errors.map((e) => `  - ${e}`).join('\n')}`);
    this.name = 'PlanValidationError';
    this.errors = errors;
    this.path = path;
  }
}

/** sha256 hex digest of raw plan text — used for the queue/health headers and the drift check. */
export function computePlanHash(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Reads and parses `path` under the declared YAML subset, then validates it.
 * Throws PlanFileMissingError, YamlSubsetError, or PlanValidationError.
 * Returns the parsed plan object plus `_meta.hash`/`_meta.path`/`_meta.text`.
 */
export function loadPlan(path) {
  let text;
  try {
    text = fs.readFileSync(path, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') throw new PlanFileMissingError(path);
    throw e;
  }
  const data = parseYamlSubset(text, path);
  const errors = validatePlan(data);
  if (errors.length > 0) throw new PlanValidationError(errors, path);
  const plan = { ...data };
  Object.defineProperty(plan, '_meta', {
    value: { path, text, hash: computePlanHash(text) },
    enumerable: false,
  });
  return plan;
}

/** Structural validation per AUTONOMY.md §1. Returns an array of human-readable error strings. */
export function validatePlan(plan) {
  const errors = [];
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    return ['plan root must be a map'];
  }
  if (!Array.isArray(plan.lanes)) errors.push('"lanes" must be a block list');
  if (!Array.isArray(plan.phases)) errors.push('"phases" must be a block list');
  if (!Array.isArray(plan.nodes)) errors.push('"nodes" must be a block list');
  if (errors.length > 0) return errors;

  const laneIds = new Set();
  for (const lane of plan.lanes) {
    if (!lane || !lane.id) {
      errors.push('a lane is missing "id"');
      continue;
    }
    if (laneIds.has(lane.id)) errors.push(`duplicate lane id "${lane.id}"`);
    laneIds.add(lane.id);
    if (typeof lane.priority !== 'number') errors.push(`lane "${lane.id}": "priority" must be a number`);
  }

  const phaseIds = new Set();
  for (const phase of plan.phases) {
    if (!phase || !phase.id) {
      errors.push('a phase is missing "id"');
      continue;
    }
    if (phaseIds.has(phase.id)) errors.push(`duplicate phase id "${phase.id}"`);
    phaseIds.add(phase.id);
  }

  const nodeIds = new Set();
  for (const node of plan.nodes) {
    if (!node || !node.id) {
      errors.push('a node is missing "id"');
      continue;
    }
    if (nodeIds.has(node.id)) {
      errors.push(`duplicate node id "${node.id}"`);
      continue;
    }
    nodeIds.add(node.id);
    if (!KEBAB_RE.test(node.id)) errors.push(`node "${node.id}": id is not kebab-case`);
  }

  for (const node of plan.nodes) {
    if (!node || !node.id) continue;
    const tag = `node "${node.id}"`;

    if (!laneIds.has(node.lane)) errors.push(`${tag}: lane "${node.lane}" does not exist`);
    if (!phaseIds.has(node.phase)) errors.push(`${tag}: phase "${node.phase}" does not exist`);

    for (const dep of node.depends_on ?? []) {
      if (!nodeIds.has(dep)) errors.push(`${tag}: depends_on "${dep}" does not exist`);
    }

    if (!STATUSES.includes(node.status)) {
      errors.push(`${tag}: status "${node.status}" is not one of the six (${STATUSES.join(', ')})`);
    }

    const needsHuman = node.needs_human;
    const kind = needsHuman && needsHuman.kind;
    if (!NEEDS_HUMAN_KINDS.includes(kind)) {
      errors.push(`${tag}: needs_human.kind "${kind}" is not one of ${NEEDS_HUMAN_KINDS.join(', ')}`);
    } else if (kind !== 'none') {
      const minutes = needsHuman.minutes;
      if (typeof minutes !== 'number' || !(minutes >= 0)) {
        errors.push(`${tag}: needs_human.minutes must be present (a non-negative number) when kind is "${kind}"`);
      }
    }

    if (node.status === 'done') {
      if (node.evidence === null || node.evidence === undefined) {
        errors.push(`${tag}: status is "done" but "evidence" is missing`);
      }
      if (node.felt_verdict === true) {
        const verdict = node.verdict;
        if (!verdict || verdict.by !== 'human' || !verdict.cite) {
          errors.push(
            `${tag}: felt_verdict done requires verdict.by "human" and a verdict.cite (DECISIONS-PENDING.md RULED block)`,
          );
        }
      }
    }
  }

  errors.push(...findDependencyCycles(plan.nodes, nodeIds));

  return errors;
}

function findDependencyCycles(nodes, nodeIds) {
  const errors = [];
  const byId = new Map(nodes.filter((n) => n && n.id).map((n) => [n.id, n]));
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map([...byId.keys()].map((id) => [id, WHITE]));

  function visit(id, stack) {
    if (!nodeIds.has(id) || color.get(id) === BLACK) return;
    if (color.get(id) === GRAY) {
      errors.push(`dependency cycle: ${[...stack, id].join(' -> ')}`);
      return;
    }
    color.set(id, GRAY);
    stack.push(id);
    for (const dep of byId.get(id).depends_on ?? []) {
      visit(dep, stack);
    }
    stack.pop();
    color.set(id, BLACK);
  }

  for (const id of byId.keys()) visit(id, []);
  return errors;
}

/** Map from lane id -> lane record, for lookups. */
export function indexById(list) {
  return new Map((list ?? []).filter((x) => x && x.id).map((x) => [x.id, x]));
}

/**
 * A comparator ordering nodes by lane priority, then `order`, then `id` —
 * the ordering AUTONOMY.md §2 specifies for the Ready section (and reused
 * for In progress / Proposed / Unscheduled).
 */
export function nodeComparator(plan) {
  const lanes = indexById(plan.lanes);
  return (a, b) => {
    const pa = lanes.get(a.lane)?.priority ?? Number.MAX_SAFE_INTEGER;
    const pb = lanes.get(b.lane)?.priority ?? Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    const oa = a.order ?? 0;
    const ob = b.order ?? 0;
    if (oa !== ob) return oa - ob;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
}

/**
 * Re-derives, live, which non-terminal nodes (status not done/in-progress/proposed/unscheduled)
 * are ready, waiting on the human, or blocked on unmet dependencies (AUTONOMY.md §1's status
 * table and §2's queue sections). Nodes recorded as "blocked" are re-examined exactly like nodes
 * recorded as "ready" — the recorded value is not trusted; only depends_on and needs_human are.
 *
 * `smallFirst` (§10): when true, the ready set is ordered by budget_minutes ascending (ties broken
 * by the usual lane/order/id comparator) instead of by lane/order/id — "near the daily cap: prefer
 * small nodes."
 */
export function deriveStates(plan, options = {}) {
  const { smallFirst = false } = options;
  const cmp = nodeComparator(plan);
  const doneIds = new Set(plan.nodes.filter((n) => n.status === 'done').map((n) => n.id));

  const ready = [];
  const waitingOnHuman = [];
  const blockedOnDeps = [];

  for (const node of plan.nodes) {
    if (NON_QUEUED_STATUSES.includes(node.status)) continue;

    const blockedBy = (node.depends_on ?? []).filter((dep) => !doneIds.has(dep));
    if (blockedBy.length > 0) {
      blockedOnDeps.push({ node, blockedBy });
      continue;
    }
    if (node.needs_human && node.needs_human.kind !== 'none') {
      waitingOnHuman.push(node);
      continue;
    }
    ready.push(node);
  }

  const readySorted = smallFirst
    ? [...ready].sort((a, b) => (a.budget_minutes - b.budget_minutes) || cmp(a, b))
    : [...ready].sort(cmp);

  waitingOnHuman.sort(cmp);
  blockedOnDeps.sort((a, b) => cmp(a.node, b.node));

  return { ready: readySorted, waitingOnHuman, blockedOnDeps };
}

/**
 * Map from node id -> the *derived* recorded status ("ready" or "blocked") for every node
 * eligible for derivation (i.e. not done/in-progress/proposed/unscheduled). Used by verify.mjs's
 * status-agreement check (§6).
 */
export function deriveStatusMap(plan) {
  const { ready, waitingOnHuman, blockedOnDeps } = deriveStates(plan);
  const map = new Map();
  for (const n of ready) map.set(n.id, 'ready');
  for (const n of waitingOnHuman) map.set(n.id, 'blocked');
  for (const { node } of blockedOnDeps) map.set(node.id, 'blocked');
  return map;
}

/** true when PLAN.yaml's lane priorities have been approved by the human (§2's header note). */
export function prioritiesApproved(plan) {
  return plan.priorities_approved === true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = process.argv[2] ?? 'PLAN.yaml';
  try {
    const plan = loadPlan(path);
    const { ready, waitingOnHuman, blockedOnDeps } = deriveStates(plan);
    console.log(
      `${path}: ok — ${plan.nodes.length} nodes, ${ready.length} ready, ${waitingOnHuman.length} waiting on human, ${blockedOnDeps.length} blocked on deps`,
    );
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
