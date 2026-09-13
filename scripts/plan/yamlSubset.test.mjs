import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseYamlSubset, YamlSubsetError } from './yamlSubset.mjs';

function assertRejectsAtLine(text, line) {
  let caught;
  try {
    parseYamlSubset(text);
  } catch (e) {
    caught = e;
  }
  assert.ok(caught instanceof YamlSubsetError, 'expected a YamlSubsetError to be thrown');
  assert.equal(caught.line, line);
  return caught;
}

test('parses top-level scalars', () => {
  const v = parseYamlSubset('version: 1\nactive: true\ninactive: false\nnothing: null\nname: shell\n');
  assert.deepEqual(v, { version: 1, active: true, inactive: false, nothing: null, name: 'shell' });
});

test('parses a double-quoted string with JSON escapes', () => {
  const v = parseYamlSubset('title: "Filter-and-hover polish (entries 87, 88, 89)"\n');
  assert.equal(v.title, 'Filter-and-hover polish (entries 87, 88, 89)');
  const v2 = parseYamlSubset('note: "line\\nbreak and a \\"quote\\""\n');
  assert.equal(v2.note, 'line\nbreak and a "quote"');
});

test('parses flow lists and flow maps of scalars', () => {
  const v = parseYamlSubset('depends_on: [land-45, other-node]\nneeds_human: {kind: none, minutes: 0}\n');
  assert.deepEqual(v.depends_on, ['land-45', 'other-node']);
  assert.deepEqual(v.needs_human, { kind: 'none', minutes: 0 });
});

test('parses block lists of flow maps (lanes/phases shape)', () => {
  const v = parseYamlSubset(
    [
      'lanes:',
      '  - {id: shell, title: "Shell", priority: 1}',
      '  - {id: engine, title: "Engine", priority: 2}',
    ].join('\n'),
  );
  assert.deepEqual(v.lanes, [
    { id: 'shell', title: 'Shell', priority: 1 },
    { id: 'engine', title: 'Engine', priority: 2 },
  ]);
});

test('parses block lists of maps spanning multiple lines (node shape)', () => {
  const text = [
    'nodes:',
    '  - id: polish-87-88-89',
    '    title: "Filter-and-hover polish (entries 87, 88, 89)"',
    '    kind: task',
    '    lane: shell',
    '    phase: prototype',
    '    status: in-progress',
    '    order: 2',
    '    depends_on: [land-45]',
    '    needs_human: {kind: none, minutes: 0}',
    '    gate: frontends/shell/POLISH-87-88-89-PREREGISTRATION.md',
    '    evidence: null',
    '    budget_minutes: 240',
    '    generation: 1',
    '    felt_verdict: false',
    '    entries: [87, 88, 89]',
    '    summary: "one line, no numbers unless docs/08-measured"',
    '    dates: {opened: 2026-09-13, done: null}',
  ].join('\n');
  const v = parseYamlSubset(text);
  assert.equal(v.nodes.length, 1);
  const n = v.nodes[0];
  assert.equal(n.id, 'polish-87-88-89');
  assert.equal(n.status, 'in-progress');
  assert.deepEqual(n.depends_on, ['land-45']);
  assert.deepEqual(n.needs_human, { kind: 'none', minutes: 0 });
  assert.equal(n.evidence, null);
  assert.equal(n.budget_minutes, 240);
  assert.deepEqual(n.entries, [87, 88, 89]);
  assert.deepEqual(n.dates, { opened: '2026-09-13', done: null });
});

test('comments are stripped, blank lines ignored', () => {
  const v = parseYamlSubset(
    ['# a full-line comment', '', 'version: 1 # trailing comment', ''].join('\n'),
  );
  assert.deepEqual(v, { version: 1 });
});

test('a hash inside a quoted string is not a comment', () => {
  const v = parseYamlSubset('cite: "docs/07_Roadmap.md ## Prototype"\n');
  assert.equal(v.cite, 'docs/07_Roadmap.md ## Prototype');
});

test('rejects tabs with a line number', () => {
  assertRejectsAtLine('version: 1\n\tkey: 2\n', 2);
});

test('rejects odd indentation with a line number', () => {
  assertRejectsAtLine('lanes:\n   - {id: shell, title: "Shell", priority: 1}\n', 2);
});

test('rejects anchors with a line number', () => {
  assertRejectsAtLine('key: &anchor value\n', 1);
});

test('rejects aliases with a line number', () => {
  assertRejectsAtLine('key: *anchor\n', 1);
});

test('rejects tags with a line number', () => {
  assertRejectsAtLine('key: !!str value\n', 1);
});

test('rejects multi-line block scalars with a line number', () => {
  assertRejectsAtLine('summary: |\n  a block scalar\n  spanning lines\n', 1);
});

test('rejects nested flow inside a flow list', () => {
  assertRejectsAtLine('evidence: [{pr: 45}]\n', 1);
});

test('rejects nested flow inside a flow map', () => {
  assertRejectsAtLine('needs_human: {kind: none, extra: [1, 2]}\n', 1);
});

test('rejects document markers', () => {
  assertRejectsAtLine('---\nversion: 1\n', 1);
});

test('rejects a malformed line that is neither a list nor a key:value', () => {
  assertRejectsAtLine('version: 1\njust some words\n', 2);
});

test('rejects a duplicate key', () => {
  assertRejectsAtLine('key: 1\nkey: 2\n', 2);
});

test('rejects an unterminated double-quoted string', () => {
  assertRejectsAtLine('title: "unterminated\n', 1);
});

test('parses evidence pointer shapes used by the plan', () => {
  const v = parseYamlSubset(
    [
      'a: {pr: 45}',
      'b: {adr: "ADR-028"}',
      'c: {tag: "v0.1.0"}',
      'd: {commit: "36f7f09"}',
      'e: {path: "kernel/RESULTS.md#ninth-section"}',
    ].join('\n'),
  );
  assert.deepEqual(v.a, { pr: 45 });
  assert.deepEqual(v.b, { adr: 'ADR-028' });
  assert.deepEqual(v.e, { path: 'kernel/RESULTS.md#ninth-section' });
});
