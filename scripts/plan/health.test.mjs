import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlan } from './plan.mjs';
import { buildHealthData, computeWaitingAges } from './health.mjs';

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

  const fakeDisk = { bytes: 123456789 };
  const fakeStray = { total: 2, by_name: { cargo: 1, node: 1, 'spatial-ide-shell': 0 } };

  const now = new Date('2026-09-13T12:00:00Z');
  const health = buildHealthData(plan, {
    repoRoot,
    planPath,
    siteDir: path.join(dir, 'site'),
    now,
    disk: fakeDisk,
    strayProcesses: fakeStray,
  });

  assert.equal(health.generated_at, now.toISOString());
  assert.equal(health.source, "the custodian's machine");
  assert.equal(health.disk_free, fakeDisk);
  assert.equal(health.stray_processes, fakeStray);
  assert.equal(typeof health.drift.ok, 'boolean');
  assert.ok(Array.isArray(health.drift.failures));
  assert.ok(Array.isArray(health.waiting_on_human));
  assert.ok(health.waiting_on_human.some((w) => w.id === 'n-waiting-sight'));
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
