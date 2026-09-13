import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { YamlSubsetError } from './yamlSubset.mjs';
import {
  loadPlan,
  validatePlan,
  deriveStates,
  deriveStatusMap,
  nodeComparator,
  indexById,
  prioritiesApproved,
  computePlanHash,
  PlanFileMissingError,
  PlanValidationError,
} from './plan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(here, 'fixtures', name);

test('loadPlan throws PlanFileMissingError for a nonexistent file', () => {
  assert.throws(() => loadPlan(fixture('does-not-exist.yaml')), PlanFileMissingError);
});

test('loadPlan throws YamlSubsetError for a file outside the declared subset', () => {
  assert.throws(() => loadPlan(fixture('invalid-outside-subset.yaml')), YamlSubsetError);
});

test('loadPlan loads the two-node fixture and attaches _meta', () => {
  const plan = loadPlan(fixture('two-nodes.yaml'));
  assert.equal(plan.nodes.length, 2);
  assert.equal(plan._meta.path, fixture('two-nodes.yaml'));
  assert.equal(plan._meta.hash, computePlanHash(plan._meta.text));
  assert.equal(plan._meta.hash.length, 64);
});

test('loadPlan loads the broader valid fixture with no errors', () => {
  const plan = loadPlan(fixture('valid-plan.yaml'));
  assert.equal(plan.nodes.length, 11);
});

test('prioritiesApproved reads the top-level flag, defaulting false', () => {
  assert.equal(prioritiesApproved(loadPlan(fixture('two-nodes.yaml'))), true);
  assert.equal(prioritiesApproved(loadPlan(fixture('valid-plan.yaml'))), false);
  assert.equal(prioritiesApproved({}), false);
});

test('validatePlan rejects a dependency cycle', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-cycle.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  assert.ok(caught.errors.some((e) => e.includes('dependency cycle')));
});

test('validatePlan rejects a non-kebab-case id', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-bad-id.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  assert.ok(caught.errors.some((e) => e.includes('kebab-case')));
});

test('validatePlan rejects done without evidence', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-missing-evidence.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  assert.ok(caught.errors.some((e) => e.includes('evidence')));
});

test('validatePlan rejects felt_verdict done without a verdict cite', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-felt-verdict.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  assert.ok(caught.errors.some((e) => e.includes('felt_verdict')));
});

test('validatePlan rejects dangling lane/phase/depends_on and bad enums in one pass', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-unknown-refs.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  const joined = caught.errors.join('\n');
  assert.match(joined, /lane "nonexistent-lane" does not exist/);
  assert.match(joined, /phase "nonexistent-phase" does not exist/);
  assert.match(joined, /depends_on "nonexistent-node" does not exist/);
  assert.match(joined, /status "sideways" is not one of the six/);
  assert.match(joined, /needs_human\.kind "maybe" is not one of/);
});

test('validatePlan rejects needs_human.kind != none with no minutes', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-missing-minutes.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  assert.ok(caught.errors.some((e) => e.includes('needs_human.minutes must be present')));
});

test('validatePlan rejects in-progress with no branch/PR evidence (reviewer finding 10)', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-in-progress-no-evidence.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  assert.ok(caught.errors.some((e) => e.includes('in-progress') && e.includes('neither a branch')));
});

test('validatePlan accepts in-progress with a PR pointer, not only a branch', () => {
  const plan = { ...loadPlan(fixture('valid-plan.yaml')) };
  const mutated = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-inprogress' ? { ...n, evidence: { pr: 46 } } : n)),
  };
  assert.deepEqual(validatePlan(mutated), []);
});

test('validatePlan rejects a missing "gate" field (reviewer finding 10)', () => {
  let caught;
  try {
    loadPlan(fixture('invalid-missing-gate.yaml'));
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof PlanValidationError);
  assert.ok(caught.errors.some((e) => e.includes('"gate" must be present')));
});

test('deriveStates on the two-node fixture: one ready, one waiting on human', () => {
  const plan = loadPlan(fixture('two-nodes.yaml'));
  const { ready, waitingOnHuman, blockedOnDeps } = deriveStates(plan);
  assert.deepEqual(ready.map((n) => n.id), ['two-nodes-ready']);
  assert.deepEqual(waitingOnHuman.map((n) => n.id), ['two-nodes-human-blocked']);
  assert.equal(blockedOnDeps.length, 0);
});

test('deriveStates on two-nodes-human-only: nothing ready, one waiting on human', () => {
  const plan = loadPlan(fixture('two-nodes-human-only.yaml'));
  const { ready, waitingOnHuman, blockedOnDeps } = deriveStates(plan);
  assert.equal(ready.length, 0);
  assert.deepEqual(waitingOnHuman.map((n) => n.id), ['two-nodes-human-blocked']);
  assert.equal(blockedOnDeps.length, 0);
});

test('deriveStates orders the ready set by lane priority, then order, then id', () => {
  const plan = loadPlan(fixture('valid-plan.yaml'));
  const { ready } = deriveStates(plan);
  // shell (priority 1) before engine (priority 2); within engine, order 1 before order 2.
  assert.deepEqual(ready.map((n) => n.id), ['n-ready-b', 'n-ready-c', 'n-ready-a']);
});

test('deriveStates smallFirst orders the ready set by budget_minutes ascending', () => {
  const plan = loadPlan(fixture('valid-plan.yaml'));
  const { ready } = deriveStates(plan, { smallFirst: true });
  assert.deepEqual(ready.map((n) => n.id), ['n-ready-c', 'n-ready-b', 'n-ready-a']);
});

test('deriveStates separates blocked-on-deps from waiting-on-human, and excludes terminal statuses', () => {
  const plan = loadPlan(fixture('valid-plan.yaml'));
  const { blockedOnDeps, waitingOnHuman, ready } = deriveStates(plan);
  assert.deepEqual(
    blockedOnDeps.map((b) => b.node.id),
    ['n-blocked-dep'],
  );
  assert.deepEqual(blockedOnDeps[0].blockedBy, ['n-inprogress']);
  assert.deepEqual(
    waitingOnHuman.map((n) => n.id).sort(),
    ['n-waiting-click', 'n-waiting-sight'],
  );
  for (const id of ['n-done', 'n-felt-done', 'n-inprogress', 'n-proposed', 'n-unscheduled']) {
    assert.ok(!ready.some((n) => n.id === id));
    assert.ok(!waitingOnHuman.some((n) => n.id === id));
    assert.ok(!blockedOnDeps.some((b) => b.node.id === id));
  }
});

test('deriveStatusMap maps ready/blocked derived statuses', () => {
  const plan = loadPlan(fixture('valid-plan.yaml'));
  const map = deriveStatusMap(plan);
  assert.equal(map.get('n-ready-a'), 'ready');
  assert.equal(map.get('n-blocked-dep'), 'blocked');
  assert.equal(map.get('n-waiting-sight'), 'blocked');
  assert.equal(map.has('n-done'), false);
  assert.equal(map.has('n-proposed'), false);
});

test('nodeComparator and indexById are usable directly', () => {
  const plan = loadPlan(fixture('valid-plan.yaml'));
  const lanes = indexById(plan.lanes);
  assert.equal(lanes.get('shell').priority, 1);
  const cmp = nodeComparator(plan);
  const a = plan.nodes.find((n) => n.id === 'n-ready-b');
  const b = plan.nodes.find((n) => n.id === 'n-ready-a');
  assert.ok(cmp(a, b) < 0); // shell (1) before engine (2)
});

test('validatePlan returns [] for an already-parsed valid plan object', () => {
  const plan = loadPlan(fixture('valid-plan.yaml'));
  assert.deepEqual(validatePlan(plan), []);
});
