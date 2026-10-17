import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { extractSessionContinuityBlock, buildOutput, READING_ORDER } from './session-resume.mjs';
import {
  SESSION_CONTINUITY_FIELDS,
  BLOCK_HEADING,
  BLOCK_CAP_BYTES,
  BlockCapError,
  blockSizes,
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

// --- the block's cap (the human's governance direction, piece B; C1 to C7) -----------------------------------------
//
// RECORDED MUTATION, each applied alone at ea69f46c4fc2 and reverted; the named test failed:
// MC1 the cap compared with `>=` -> C1. MC2 the check removed -> C2 (C3, C4, C6, C7 too: they need a refusal).
// MC3 the size counted as string length -> C3 (C4, C5, C6, C7 too). MC4 the field sizes counted as string length,
// so the largest by characters is named -> C4 only. MC5 the size measured over findBlockRange's untrimmed lines
// -> C5 (C2 too). MC6 the scratch file written with the block cut to 6,144 bytes -> C6 only. MC7 the
// inside-repository check removed -> C7 only. C1 to C7 are the tests below, in order.

// The `position` value that makes the fixture's block exactly `bytes` UTF-8 bytes (ASCII fill).
function positionFor(bytes) {
  const one = blockSizes(updateBlockFields(fixtureBlock(), { position: 'x' })).blockBytes;
  return 'x'.repeat(bytes - one + 1);
}
const refusal = (text, updates) => {
  try {
    updateBlockFields(text, updates);
  } catch (e) {
    return e;
  }
  return null;
};

test('flush: a block of exactly 6,144 UTF-8 bytes is written', () => {
  const out = updateBlockFields(fixtureBlock(), { position: positionFor(BLOCK_CAP_BYTES) });
  assert.equal(blockSizes(out).blockBytes, 6144);
});

test('flush: a block of 6,145 bytes is refused with BlockCapError', () => {
  const e = refusal(fixtureBlock(), { position: positionFor(BLOCK_CAP_BYTES + 1) });
  assert.ok(e instanceof BlockCapError, String(e));
  assert.match(e.message, /would be 6145 bytes \(UTF-8\), over the cap of 6144/);
  assert.equal(Buffer.byteLength(e.block, 'utf8'), 6145);
});

test('flush: a non-ASCII block under the cap in characters and over it in UTF-8 bytes is refused', () => {
  const text = fixtureBlock({ position: 'é'.repeat(3100) });
  const block = extractSessionContinuityBlock(text);
  assert.ok(block.length < 6144 && Buffer.byteLength(block, 'utf8') > 6144);
  assert.ok(refusal(fixtureBlock(), { position: 'é'.repeat(3100) }) instanceof BlockCapError);
});

test("flush: the refusal names the largest field by UTF-8 bytes and every field's size", () => {
  // position has the most characters, branches the most bytes
  const values = { flushed_at: '2026-09-15T00:00:00Z', tip: 'abc1234', branches: 'é'.repeat(2000), position: 'x'.repeat(3000),
    'half-made judgments': 'none', 'intended sequencing (next session)': 'do the next thing', 'unreported findings': 'none', 'in-flight gate states': 'none' };
  const e = refusal(fixtureBlock(), values);
  assert.ok(e instanceof BlockCapError, String(e));
  const size = (f) => `${f} ${Buffer.byteLength(`${f}: ${values[f]}`, 'utf8')}`;
  assert.match(e.message, new RegExp(`Largest field: "branches", ${Buffer.byteLength(`branches: ${values.branches}`, 'utf8')} bytes\.`));
  assert.ok(e.message.endsWith(`Field sizes: ${SESSION_CONTINUITY_FIELDS.map(size).join(', ')}.`), e.message);
});

test("flush: the cap measures the block session-resume prints, for the real ledger's shape", () => {
  const real = fs.readFileSync(cutStatePath(REPO_ROOT), 'utf8');
  const next = updateBlockFields(real, Object.fromEntries(SESSION_CONTINUITY_FIELDS.map((f) => [f, 'SENTINEL'])));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'spatial-flush-c5-'));
  try {
    fs.mkdirSync(path.join(dir, 'state'));
    fs.writeFileSync(path.join(dir, 'state', 'CUT-STATE.md'), next, 'utf8');
    const out = buildOutput(dir);
    const printed = out.slice(READING_ORDER.length + 2, out.lastIndexOf('\n\nResume facts:'));
    assert.equal(blockSizes(next).blockBytes, Buffer.byteLength(printed, 'utf8'));
    assert.ok(blockSizes(next).blockBytes > 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// The CLI with the temporary folder redirected (Node's own resolution: TMPDIR, TEMP and TMP).
function runRefusal(target, tmp) {
  const over = ['--field', 'flushed_at=2026-09-15T00:00:00Z', '--field', 'tip=abc1234', '--field', `position=${'é'.repeat(3100)}`];
  return spawnSync(process.execPath, [CLI, '--file', target, ...over], {
    encoding: 'utf8',
    env: { ...process.env, TMPDIR: tmp, TEMP: tmp, TMP: tmp },
  });
}
const inside = (parent, child) => {
  const rel = path.relative(fs.realpathSync.native(parent), child);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
};

test('flush CLI: a refused block leaves the file byte-identical and is written whole to the scratch file the refusal names', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'spatial-flush-c6-'));
  try {
    const target = path.join(dir, 'CUT-STATE.md');
    const tmp = path.join(dir, 'tmp');
    fs.mkdirSync(tmp);
    fs.writeFileSync(target, fixtureBlock(), 'utf8');
    const before = fs.readFileSync(target);
    const r = runRefusal(target, tmp);
    assert.equal(r.status, 1, r.stderr);
    assert.ok(fs.readFileSync(target).equals(before), 'a refused flush must leave the file byte-identical');
    const named = /written whole to (.+)\.\s*$/.exec(r.stderr)?.[1];
    assert.ok(named, r.stderr);
    assert.ok(inside(tmp, named) && !inside(REPO_ROOT, named), named);
    const refused = refusal(fixtureBlock(), { flushed_at: '2026-09-15T00:00:00Z', tip: 'abc1234', position: 'é'.repeat(3100) });
    assert.ok(Buffer.byteLength(refused.block, 'utf8') > 6144);
    assert.ok(fs.readFileSync(named).equals(Buffer.from(`${refused.block}\n`, 'utf8')), 'the scratch file holds the whole block and one newline');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('flush CLI: a temporary folder inside the repository gets no scratch file and the refusal says so', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'spatial-flush-c7-'));
  try {
    execFileSync('git', ['init', '-q'], { cwd: dir });
    const target = path.join(dir, 'CUT-STATE.md');
    const tmp = path.join(dir, 'tmp');
    fs.mkdirSync(tmp);
    fs.writeFileSync(target, fixtureBlock(), 'utf8');
    const before = fs.readFileSync(target);
    const r = runRefusal(target, tmp);
    assert.equal(r.status, 1, r.stderr);
    assert.match(r.stderr, /The file is unchanged; no scratch file was written \(/);
    assert.ok(!fs.existsSync(path.join(tmp, 'spatial-ide-flush-refused')), 'no scratch folder inside the repository');
    assert.ok(fs.readFileSync(target).equals(before));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
