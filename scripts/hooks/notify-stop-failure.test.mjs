import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { buildMessage, dedupeKey } from './notify-stop-failure.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, 'notify-stop-failure.mjs');
const fixtureRaw = fs.readFileSync(path.join(here, 'fixtures', 'stop-failure-input.json'), 'utf8');
const fixture = JSON.parse(fixtureRaw);
const DRY = '[telegram dry-run] would send: ';

// Every run is a child process; no run can reach Telegram: dry run on, token and chat id deleted.
function run(t, stdin, extraEnv = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notify-stop-failure-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  const env = { ...process.env, CUSTODIAN_TELEGRAM_DRY_RUN: '1', CLAUDE_PROJECT_DIR: dir, ...extraEnv };
  delete env.CUSTODIAN_TELEGRAM_BOT_TOKEN;
  delete env.CUSTODIAN_TELEGRAM_CHAT_ID;
  if (!('CLAUDE_CODE_REMOTE' in extraEnv)) delete env.CLAUDE_CODE_REMOTE;
  const r = spawnSync(process.execPath, [script], { input: stdin, encoding: 'utf8', env });
  const sends = r.stderr.split('\n').filter((l) => l.startsWith(DRY)).map((l) => l.slice(DRY.length));
  return { r, sends };
}

test('stop-failure: the message holds the error type, the error details and the folder basename', (t) => {
  const withCwd = JSON.stringify({ ...fixture, cwd: '/some/where/spatial-ide' });
  const { r, sends } = run(t, withCwd);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(sends.length, 1, r.stderr);
  assert.equal(sends[0], 'Session stopped on an error: rate_limit — 429 Too Many Requests (spatial-ide)');
  assert.equal(buildMessage(fixture), 'Session stopped on an error: rate_limit — 429 Too Many Requests (...)');
});

test('stop-failure: the dedupe key holds the error type', () => {
  assert.equal(dedupeKey(fixture), 'stop-failure:rate_limit');
  assert.notEqual(dedupeKey({ ...fixture, error: 'server_error' }), dedupeKey(fixture));
});

test('stop-failure: no text the script sends holds last_assistant_message', (t) => {
  assert.ok(fixture.last_assistant_message.length > 0);
  const { r, sends } = run(t, fixtureRaw);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(sends.length, 1, r.stderr);
  for (const s of sends) assert.equal(s.includes(fixture.last_assistant_message), false, s);
  assert.equal(buildMessage(fixture).includes(fixture.last_assistant_message), false);
  assert.equal(dedupeKey(fixture).includes(fixture.last_assistant_message), false);
});

test('stop-failure: bad stdin exits 0 and sends nothing', (t) => {
  const { r, sends } = run(t, '{not json');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(sends.length, 0);
});

test('stop-failure: in a cloud session the child exits 0 and prints no dry-run line', (t) => {
  const { r, sends } = run(t, fixtureRaw, { CLAUDE_CODE_REMOTE: 'true' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(sends.length, 0);
  assert.equal(r.stderr.includes('[telegram dry-run]'), false);
});
