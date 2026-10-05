// The repeat-runner's tests (EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md sections 3 and 4, R1 to R4), run
// by `node --test scripts/evidence/repeat.test.mjs`. Fixtures live in a folder made under os.tmpdir()
// and removed after the tests, never in the repository. There is no process.platform branch: every
// child is `process.execPath` running a small script, so the same text runs on Windows and on Linux.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RUNNER = fileURLToPath(new URL('./repeat.mjs', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'repeat-runner-'));
after(() => rmSync(dir, { recursive: true, force: true }));

// A child that counts its own starts in a file and exits with the code listed for that start (0 past
// the list): `node counter.mjs <counter file> <code>...`.
const COUNTER = join(dir, 'counter.mjs');
writeFileSync(
  COUNTER,
  [
    "import { readFileSync, writeFileSync, existsSync } from 'node:fs';",
    'const [file, ...codes] = process.argv.slice(2);',
    "const seen = existsSync(file) ? Number(readFileSync(file, 'utf8')) : 0;",
    'writeFileSync(file, String(seen + 1));',
    'process.exit(Number(codes[seen] ?? 0));',
    '',
  ].join('\n'),
);

// A child that prints its arguments as one JSON line.
const ECHO = join(dir, 'echo.mjs');
writeFileSync(ECHO, 'console.log(JSON.stringify(process.argv.slice(2)));\n');

function runner(...args) {
  const ran = spawnSync(process.execPath, [RUNNER, ...args], { encoding: 'utf8' });
  assert.equal(ran.error, undefined);
  return ran;
}

const lines = (text) => text.split('\n').filter((l) => l !== '');
const started = (file) => (existsSync(file) ? Number(readFileSync(file, 'utf8')) : 0);

test('the runner runs the command n times in order, reports each exit and never stops early', () => {
  const file = join(dir, 'rf1.count');
  const ran = runner('3', '--', process.execPath, COUNTER, file, '0', '3', '0');
  assert.deepEqual(lines(ran.stdout), ['run 1/3 exit=0', 'run 2/3 exit=3', 'run 3/3 exit=0', 'summary runs=3 failed=1']);
  assert.equal(ran.status, 1);
  assert.equal(started(file), 3);

  const clean = join(dir, 'rf1-clean.count');
  const ok = runner('2', '--', process.execPath, COUNTER, clean);
  assert.deepEqual(lines(ok.stdout), ['run 1/2 exit=0', 'run 2/2 exit=0', 'summary runs=2 failed=0']);
  assert.equal(ok.status, 0);
  assert.equal(started(clean), 2);
});

test('the runner passes the arguments after the separator to the command unchanged, with no shell', () => {
  const args = ['a b', '$HOME', '%PATH%', '*', '', '--', '--flag=1'];
  const ran = runner('1', '--', process.execPath, ECHO, ...args);
  const [echoed, ...rest] = lines(ran.stdout);
  assert.deepEqual(JSON.parse(echoed), args);
  assert.deepEqual(rest, ['run 1/1 exit=0', 'summary runs=1 failed=0']);
  assert.equal(ran.status, 0);
});

test('a command that cannot start counts as a failed run and the runner carries on', () => {
  const ran = runner('2', '--', 'no-such-command-for-the-repeat-runner-test');
  assert.deepEqual(lines(ran.stdout), [
    'run 1/2 exit=spawn-error:ENOENT',
    'run 2/2 exit=spawn-error:ENOENT',
    'summary runs=2 failed=2',
  ]);
  assert.equal(ran.status, 1);
});

test('a malformed call runs nothing and exits 2', () => {
  const file = join(dir, 'rf4.count');
  const child = [process.execPath, COUNTER, file];
  const calls = [
    ['0', '--', ...child],
    ['x', '--', ...child],
    ['3.0', '--', ...child],
    ['-1', '--', ...child],
    ['3', ...child],
    ['3', '--'],
    [],
  ];
  for (const call of calls) {
    const ran = runner(...call);
    assert.equal(ran.status, 2, `exit for [${call.join(' ')}]`);
    assert.equal(ran.stdout, '');
    assert.equal(lines(ran.stderr).length, 1);
    assert.match(ran.stderr, /^usage: /);
  }
  assert.equal(existsSync(file), false);
});
