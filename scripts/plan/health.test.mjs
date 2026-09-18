import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlan } from './plan.mjs';
import {
  buildHealthData,
  computeWaitingAges,
  medianOpenedToDone,
  gateFirstPassRate,
  readGateLog,
  recordRoundCounts,
} from './health.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(here, 'fixtures');
const repoRoot = path.resolve(here, '..', '..');

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

test('computeWaitingAges reports days since dates.opened for each waiting-on-human node', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  const now = new Date('2026-09-20T00:00:00Z'); // seven days after the fixture's 2026-09-13 opened dates
  const ages = computeWaitingAges(plan, { now });
  const byId = Object.fromEntries(ages.map((a) => [a.id, a]));
  assert.equal(byId['n-waiting-sight'].age_days, 7);
  assert.equal(byId['n-waiting-sight'].kind, 'sight');
  assert.equal(byId['n-waiting-sight'].minutes, 15);
  assert.equal(byId['n-waiting-click'].age_days, 7);
});

test('buildHealthData assembles machine facts only — generated_at, source, drift, injected OS fields', () => {
  const dir = makeTempDir('health-build-');
  const planPath = path.join(dir, 'PLAN.yaml');
  fs.copyFileSync(path.join(fixturesDir, 'valid-plan.yaml'), planPath);
  const plan = loadPlan(planPath);

  const fakeDisk = { drives: [{ drive: 'C', bytes: 123456789, total: 999 }] };
  const fakeStray = { total: 2, by_name: { cargo: 1, node: 1, 'spatial-ide-shell': 0 } };

  const now = new Date('2026-09-13T12:00:00Z');
  const health = buildHealthData(plan, {
    repoRoot,
    planPath,
    siteDir: path.join(dir, 'site'),
    now,
    disk: fakeDisk,
    strayProcesses: fakeStray,
    gateLog: null,
  });

  assert.equal(health.generated_at, now.toISOString());
  assert.equal(health.source, "the custodian's machine");
  assert.equal(health.disk_free, fakeDisk);
  assert.equal(health.stray_processes, fakeStray);
  assert.equal(typeof health.drift.ok, 'boolean');
  assert.ok(Array.isArray(health.drift.failures));
  assert.ok(Array.isArray(health.waiting_on_human));
  assert.ok(health.waiting_on_human.some((w) => w.id === 'n-waiting-sight'));
  // Both governance metrics are assembled; an absent gate log reports itself, never a fake rate.
  assert.equal(typeof health.median_opened_to_done.n, 'number');
  assert.deepEqual(health.gate_first_pass, { present: false });
});

test('health.mjs carries no build-time facts: CI, open PRs and the latest release are not its business', () => {
  const dir = makeTempDir('health-shape-');
  const planPath = path.join(dir, 'PLAN.yaml');
  fs.copyFileSync(path.join(fixturesDir, 'valid-plan.yaml'), planPath);
  const plan = loadPlan(planPath);
  const health = buildHealthData(plan, {
    repoRoot,
    planPath,
    siteDir: path.join(dir, 'site'),
    disk: {},
    strayProcesses: {},
  });
  assert.deepEqual(Object.keys(health), [
    'generated_at',
    'source',
    'drift',
    'disk_free',
    'stray_processes',
    'waiting_on_human',
    'median_opened_to_done',
    'gate_first_pass',
    'record_rounds',
  ]);
});

test('buildHealthData drift.ok is false when the queue has not been generated', () => {
  const dir = makeTempDir('health-drift-');
  const planPath = path.join(dir, 'PLAN.yaml');
  fs.copyFileSync(path.join(fixturesDir, 'two-nodes.yaml'), planPath);
  const plan = loadPlan(planPath);
  const health = buildHealthData(plan, {
    repoRoot,
    planPath,
    siteDir: path.join(dir, 'site'),
    disk: {},
    strayProcesses: {},
  });
  assert.equal(health.drift.ok, false);
});

// ------------------------------------------------------------- median opened->done (day resolution)

test('medianOpenedToDone: median of (done - opened) in whole days over done nodes with both dates', () => {
  const plan = {
    nodes: [
      { status: 'done', dates: { opened: '2026-09-01', done: '2026-09-03' } }, // 2 days
      { status: 'done', dates: { opened: '2026-09-01', done: '2026-09-05' } }, // 4 days
      { status: 'done', dates: { opened: '2026-09-01', done: '2026-09-10' } }, // 9 days
      { status: 'done', dates: { opened: '2026-09-01', done: null } }, // no done: excluded
      { status: 'ready', dates: { opened: '2026-09-01', done: '2026-09-02' } }, // not done: excluded
    ],
  };
  assert.deepEqual(medianOpenedToDone(plan), { days: 4, n: 3 });
});

test('medianOpenedToDone: an even count averages the two middle day-diffs; none qualifying is null', () => {
  const even = {
    nodes: [
      { status: 'done', dates: { opened: '2026-09-01', done: '2026-09-03' } }, // 2
      { status: 'done', dates: { opened: '2026-09-01', done: '2026-09-06' } }, // 5
    ],
  };
  assert.deepEqual(medianOpenedToDone(even), { days: 3.5, n: 2 });
  assert.deepEqual(medianOpenedToDone({ nodes: [] }), { days: null, n: 0 });
});

// -------------------------------------------------------------------------- gate first-pass rate

test('gateFirstPassRate: first-attempt PASS counts; a fail-then-pass node does not; empty is null', () => {
  const log = [
    { node: 'a', gate: 'g1', attempt: 1, verdict: 'PASS', date: '2026-09-10' },
    { node: 'b', gate: 'g1', attempt: 1, verdict: 'FAIL', date: '2026-09-10' },
    { node: 'b', gate: 'g1', attempt: 2, verdict: 'PASS', date: '2026-09-11' },
  ];
  assert.deepEqual(gateFirstPassRate(log), { nodes: 2, first_pass: 1, rate: 0.5 });
  assert.deepEqual(gateFirstPassRate([]), { nodes: 0, first_pass: 0, rate: null });
  assert.deepEqual(gateFirstPassRate(undefined), { nodes: 0, first_pass: 0, rate: null });
});

test('gateFirstPassRate: the FIRST attempt is decided by date, not log order', () => {
  // The passing later attempt is listed first; the earlier failing attempt must still win.
  const log = [
    { node: 'x', gate: 'g2', attempt: 2, verdict: 'PASS', date: '2026-09-12' },
    { node: 'x', gate: 'g1', attempt: 1, verdict: 'FAIL', date: '2026-09-11' },
  ];
  assert.deepEqual(gateFirstPassRate(log), { nodes: 1, first_pass: 0, rate: 0 });
});

// ---------------------------------------------------- record-round counts per node (2026-09-18 #4)

// RECORDED MUTATION: changed the `Set` dedup in recordRoundCounts to a plain per-record counter
// (`byNode[e.node] = (byNode[e.node] ?? 0) + 1` on every matching record, no attempt de-duplication)
// -- observed failure: `assert.deepEqual` reported `{ byNode: { a: 2 }, total: 2 }` vs the expected
// `{ byNode: { a: 1 }, total: 1 }`, since attempt 1's two gate records (architect, reviewer) were
// each counted. Reverted after observing the failure.
test('recordRoundCounts: an attempt gated twice (both gates record: true) counts once for its node', () => {
  const log = [
    { node: 'a', gate: 'architect', attempt: 1, verdict: 'FAIL', record: true, date: '2026-09-17' },
    { node: 'a', gate: 'reviewer', attempt: 1, verdict: 'FAIL', record: true, date: '2026-09-17' },
  ];
  assert.deepEqual(recordRoundCounts(log), { byNode: { a: 1 }, total: 1 });
});

// RECORDED MUTATION: removed the `e.record !== true` guard so every gate record counts -- observed
// failure: `assert.deepEqual` reported `{ byNode: { b: 1 }, total: 1 }` vs the expected `{ byNode:
// {}, total: 0 }`, since node "b"'s untagged record was counted. Reverted after observing the failure.
test('recordRoundCounts: a node whose gate records carry no record: true field counts zero (absent from byNode)', () => {
  const log = [{ node: 'b', gate: 'reviewer', attempt: 1, verdict: 'PASS', date: '2026-09-10' }];
  assert.deepEqual(recordRoundCounts(log), { byNode: {}, total: 0 });
});

test('readGateLog: absent file is null (the strip then says "no gate log yet"); a bad file is []', () => {
  const dir = makeTempDir('gate-log-');
  assert.equal(readGateLog(path.join(dir, 'nope.json')), null);
  const bad = path.join(dir, 'bad.json');
  fs.writeFileSync(bad, '{ not json', 'utf8');
  assert.deepEqual(readGateLog(bad), []);
  const good = path.join(dir, 'good.json');
  fs.writeFileSync(good, JSON.stringify([{ node: 'a', gate: 'g', attempt: 1, verdict: 'PASS', date: '2026-09-10' }]), 'utf8');
  assert.equal(readGateLog(good).length, 1);
});
