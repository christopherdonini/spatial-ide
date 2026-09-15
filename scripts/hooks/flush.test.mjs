import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  SESSION_CONTINUITY_FIELDS,
  BLOCK_HEADING,
  blockFieldLabels,
  findBlockRange,
  updateBlockFields,
  parseArgs,
  cutStatePath,
} from './flush.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, '..', '..');
const CLI = path.join(here, 'flush.mjs');

// A minimal but faithful block: the real field labels, a heading before and after so the range
// logic has boundaries to find.
function fixtureBlock(overrides = {}) {
  const values = {
    flushed_at: '2026-09-15T00:00:00Z',
    tip: 'abc1234',
    branches: 'main',
    position: 'a position sentence',
    'half-made judgments': 'none',
    'intended sequencing (next session)': 'do the next thing',
    'unreported findings': 'none',
    'in-flight gate states': 'none',
    ...overrides,
  };
  const body = SESSION_CONTINUITY_FIELDS.map((f) => `${f}: ${values[f]}`).join('\n');
  return `# Top\n\nsome preamble\n\n${BLOCK_HEADING}\n${body}\n\n## Ledger\n\n- an entry\n`;
}

// THE field-name test the human asked for (2026-09-15): the writer's field list must equal the
// labels in the REAL state/CUT-STATE.md block. This is what would have caught `intended sequencing
// (next)` vs `intended sequencing (next session)` at test time instead of at flush time.
//
// The block carries one deliberate non-field line after the fields — `Previous ledger: <path>`, a
// reference, not a flush field the writer ever targets. It is excluded by name so that adding a
// REAL field still fails this test until SESSION_CONTINUITY_FIELDS is updated to match.
const KNOWN_NON_FIELD_LINES = ['Previous ledger'];

test('flush: SESSION_CONTINUITY_FIELDS equals the field labels in the real state/CUT-STATE.md block', () => {
  const text = fs.readFileSync(cutStatePath(REPO_ROOT), 'utf8');
  const actual = blockFieldLabels(text).filter((l) => !KNOWN_NON_FIELD_LINES.includes(l));
  assert.deepEqual(
    actual,
    SESSION_CONTINUITY_FIELDS,
    `the block's field labels drifted from SESSION_CONTINUITY_FIELDS.\n  block:  ${JSON.stringify(actual)}\n  writer: ${JSON.stringify(SESSION_CONTINUITY_FIELDS)}`,
  );
  // And every canonical field is present exactly once (the writer's own all-or-nothing matcher).
  const all = Object.fromEntries(SESSION_CONTINUITY_FIELDS.map((f) => [f, 'SENTINEL']));
  assert.doesNotThrow(() => updateBlockFields(text, all), 'a canonical field is missing or duplicated in the real block');
});

test('flush: a zero-field update is an error, never a silent no-op', () => {
  assert.throws(() => updateBlockFields(fixtureBlock(), {}), /zero fields/);
});

test('flush: an unknown label is rejected — the exact incident typo does not slip through', () => {
  // The 2026-09-15 regression: this key matched zero lines and was silently skipped. It must throw.
  assert.throws(
    () => updateBlockFields(fixtureBlock(), { 'intended sequencing (next)': 'x' }),
    /is not a SESSION-CONTINUITY field/,
  );
  // And the correct key works.
  const out = updateBlockFields(fixtureBlock(), { 'intended sequencing (next session)': 'REPLACED' });
  assert.match(out, /^intended sequencing \(next session\): REPLACED$/m);
});

test('flush: a known field is replaced exactly once, nothing else touched', () => {
  const before = fixtureBlock();
  const after = updateBlockFields(before, { position: 'NEW POSITION' });
  assert.match(after, /^position: NEW POSITION$/m);
  // Every other line is byte-identical.
  const b = before.split('\n');
  const a = after.split('\n');
  assert.equal(a.length, b.length);
  for (let i = 0; i < b.length; i++) {
    if (b[i].startsWith('position: ')) continue;
    assert.equal(a[i], b[i], `line ${i} changed unexpectedly`);
  }
});

test('flush: a field missing from the block throws (not present exactly once)', () => {
  // A block that lost the `tip` line: updating tip must throw, not silently miss.
  const noTip = fixtureBlock().replace(/^tip: .*$\n/m, '');
  assert.throws(() => updateBlockFields(noTip, { tip: 'deadbeef' }), /appears 0 times/);
});

test('flush: a duplicated field line throws (ambiguous, expected exactly 1)', () => {
  const dupe = fixtureBlock().replace(/^(position: .*)$/m, '$1\nposition: second one');
  assert.throws(() => updateBlockFields(dupe, { position: 'x' }), /appears 2 times/);
});

test('flush: a multi-line value is refused (the block is line-addressed)', () => {
  assert.throws(() => updateBlockFields(fixtureBlock(), { position: 'line one\nline two' }), /contains a newline/);
});

test('flush: applies several fields at once, all-or-nothing', () => {
  const out = updateBlockFields(fixtureBlock(), {
    flushed_at: '2026-09-15T12:00:00Z',
    tip: 'feed1234',
    position: 'multi-field position',
  });
  assert.match(out, /^flushed_at: 2026-09-15T12:00:00Z$/m);
  assert.match(out, /^tip: feed1234$/m);
  assert.match(out, /^position: multi-field position$/m);
  // A batch that includes ONE bad field writes none of them (the return value is discarded on throw).
  assert.throws(
    () => updateBlockFields(fixtureBlock(), { position: 'ok', 'bogus field': 'x' }),
    /is not a SESSION-CONTINUITY field/,
  );
});

test('flush: findBlockRange finds the block between headings', () => {
  const lines = fixtureBlock().split('\n');
  const range = findBlockRange(lines);
  assert.ok(range);
  assert.equal(lines[range.start].trim(), BLOCK_HEADING);
  assert.equal(lines[range.end].trim(), '## Ledger');
});

test('flush: parseArgs reads --file, --json and repeated --field', () => {
  const { updates, jsonPath, file } = parseArgs([
    '--file', 'x/CUT-STATE.md',
    '--json', 'j.json',
    '--field', 'position=a',
    '--field', 'unreported findings=b=c', // value may contain '='
  ]);
  assert.equal(file, 'x/CUT-STATE.md');
  assert.equal(jsonPath, 'j.json');
  assert.deepEqual(updates, { position: 'a', 'unreported findings': 'b=c' });
  assert.throws(() => parseArgs(['--field', 'no-equals']), /is not label=value/);
  assert.throws(() => parseArgs(['--bogus']), /unknown argument/);
});

test('flush CLI: --file round-trip writes the field; the incident typo exits non-zero and writes nothing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'spatial-flush-cli-'));
  const target = path.join(dir, 'CUT-STATE.md');
  const original = fixtureBlock();
  fs.writeFileSync(target, original, 'utf8');

  // Happy path: an explicit field is written (flushed_at/tip auto-fill too, but we assert position).
  const ok = spawnSync(process.execPath, [CLI, '--file', target, '--field', 'position=CLI WROTE THIS'], {
    encoding: 'utf8',
  });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(fs.readFileSync(target, 'utf8'), /^position: CLI WROTE THIS$/m);

  // Fail-loud path: the exact incident typo. Non-zero exit AND the file is left exactly as it was.
  const before = fs.readFileSync(target, 'utf8');
  const bad = spawnSync(process.execPath, [CLI, '--file', target, '--field', 'intended sequencing (next)=x'], {
    encoding: 'utf8',
  });
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /is not a SESSION-CONTINUITY field/);
  assert.equal(fs.readFileSync(target, 'utf8'), before, 'a rejected flush must not modify the file');

  fs.rmSync(dir, { recursive: true, force: true });
});
