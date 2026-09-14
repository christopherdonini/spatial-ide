import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { mirrorRound, buildSummary } from './questions-mirror.mjs';
import { buildMultipartBody } from './telegram.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

// No test here performs real network I/O: mirrorRound gets injected fakes, and the one CLI test
// runs the missing-file path (which fails before any send) with dry-run set as a belt-and-braces.
process.env.CUSTODIAN_TELEGRAM_DRY_RUN = '1';
delete process.env.CUSTODIAN_TELEGRAM_BOT_TOKEN;
delete process.env.CUSTODIAN_TELEGRAM_CHAT_ID;

// Mutation killed: `length <= MAX` -> `length < MAX` (a round of exactly 4096 code points would be
// wrongly pushed onto the document path). The exact-boundary text pins the `<=`.
test('questions-mirror: a round of exactly 4096 chars sends one message and no document', async () => {
  const calls = { message: [], document: [] };
  const text = 'x'.repeat(4096);
  const out = await mirrorRound({
    file: 'state/questions/round-3.md',
    readFile: () => text,
    sendMessage: async (t) => {
      calls.message.push(t);
      return { ok: true };
    },
    sendDocument: async (f, c) => {
      calls.document.push([f, c]);
      return { ok: true };
    },
  });
  assert.equal(out.mode, 'message');
  assert.equal(calls.message.length, 1);
  assert.equal(calls.document.length, 0);
  assert.equal(calls.message[0], text);
});

// Mutation killed: the document send is dropped / the two sends are reversed. Requiring exactly two
// calls in [message, document] order kills both "skip sendDocument" and "sendDocument before the
// summary".
test('questions-mirror: a round over 4096 sends the summary message THEN the document', async () => {
  const order = [];
  const out = await mirrorRound({
    file: 'state/questions/round-7.md',
    readFile: () => 'x'.repeat(4097),
    sendMessage: async (t) => {
      order.push(['message', t]);
      return { ok: true };
    },
    sendDocument: async (f, c) => {
      order.push(['document', f, c]);
      return { ok: true };
    },
  });
  assert.equal(out.mode, 'document');
  assert.equal(order.length, 2);
  assert.equal(order[0][0], 'message');
  assert.equal(order[1][0], 'document');
  assert.equal(order[0][1], 'Question round 7 — 1 items; full text attached (copy-paste ready)');
  assert.equal(order[1][1], 'state/questions/round-7.md');
  assert.equal(order[1][2], order[0][1]); // the caption is the same summary as the message above it
});

// Mutation killed: swallow the read error and exit 0. The CLI must surface a missing round file as
// exit 1 with a clear stderr line.
test('questions-mirror CLI: a missing round file exits 1 with a clear stderr line', () => {
  const scriptPath = path.join(here, 'questions-mirror.mjs');
  const missing = path.join(os.tmpdir(), 'questions-mirror-no-such-round-file.md');
  const result = spawnSync(process.execPath, [scriptPath, missing], {
    encoding: 'utf8',
    env: { ...process.env, CUSTODIAN_TELEGRAM_DRY_RUN: '1' },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /questions-mirror: could not read the round file/);
});

// Mutation killed: drop the `filename="..."` attribute from the document part's Content-Disposition
// (Telegram would then reject or mis-name the upload). Also pins the boundary framing and the raw
// bytes surviving verbatim.
test('questions-mirror: buildMultipartBody carries the boundary, filename, and raw file bytes', () => {
  const boundary = 'TestBoundary123';
  const fileBuffer = Buffer.from('item 1\n\n---\n\nitem 2\n', 'utf8');
  const body = buildMultipartBody({ boundary, chatId: '42', caption: 'a caption', filename: 'round-9.md', fileBuffer });
  const str = body.toString('utf8');
  assert.ok(str.startsWith(`--${boundary}\r\n`), 'opening boundary present');
  assert.ok(str.endsWith(`--${boundary}--\r\n`), 'closing boundary present');
  assert.ok(str.includes('name="chat_id"'), 'chat_id field present');
  assert.ok(str.includes('name="caption"'), 'caption field present');
  assert.ok(str.includes('filename="round-9.md"'), 'filename present in the document part');
  assert.ok(body.includes(fileBuffer), 'raw file bytes present as a contiguous slice');
  assert.equal(buildSummary('state/questions/round-9.md', 'one\n\n---\n\ntwo'), 'Question round 9 — 2 items; full text attached (copy-paste ready)');
});
