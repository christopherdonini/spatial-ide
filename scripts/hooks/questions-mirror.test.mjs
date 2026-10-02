import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
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

// ---- The round mirror as a PreToolUse hook (ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md, §3, §4) ----
// Every test below spawns the shipped CLI in hook mode. The child's environment is built explicitly:
// no Telegram token, no chat id, no CLAUDE_CODE_REMOTE, and dry-run except where a test removes it,
// so no test reaches the network. Every test project is a fresh os.tmpdir() directory removed by t.after.

const repoRoot = path.resolve(here, '..', '..');
const hookScript = path.join(here, 'questions-mirror.mjs');
const fixture = JSON.parse(fs.readFileSync(path.join(here, 'fixtures', 'pretooluse-askuserquestion.json'), 'utf8'));
const DRY_LINE = '[telegram dry-run] would send:';

function childEnv({ dryRun = true, extra = {} } = {}) {
  const env = {};
  for (const k of ['PATH', 'Path', 'SystemRoot', 'SYSTEMROOT', 'TEMP', 'TMP', 'TMPDIR']) {
    if (process.env[k] !== undefined) env[k] = process.env[k];
  }
  if (dryRun) env.CUSTODIAN_TELEGRAM_DRY_RUN = '1';
  return { ...env, ...extra };
}
function hookProject(t, { rounds = ['round-7.md'], lease = 'lease: fixture-session refreshed: 2026-10-02T00:00:00.000Z\n' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'round-mirror-hook-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'state', 'questions'), { recursive: true });
  for (const name of rounds) fs.writeFileSync(path.join(dir, 'state', 'questions', name), 'x\n', 'utf8');
  if (lease !== null) fs.writeFileSync(path.join(dir, 'CUSTODIAN-LEASE'), lease, 'utf8');
  return dir;
}
function runHook(dir, input, env = childEnv()) {
  const stdin = typeof input === 'string' ? input : JSON.stringify(input);
  return spawnSync(process.execPath, [hookScript, '--hook'], {
    input: stdin,
    encoding: 'utf8',
    env: { ...env, CLAUDE_PROJECT_DIR: dir },
  });
}
const roundFiles = (dir) => fs.readdirSync(path.join(dir, 'state', 'questions')).sort();
const countDry = (stderr) => stderr.split(DRY_LINE).length - 1;
const assertQuiet = (r) => assert.deepEqual({ status: r.status, stdout: r.stdout }, { status: 0, stdout: '' });
const callOf = (questions) => ({ ...fixture, tool_input: { questions } });

// S1's expected body: the fixture's four items, written out by hand.
const S1_ITEMS = [
  [
  "1. Item 5. F — AUTONOMY.md section 0's reading order gains state/directives/ (newest first), after DECISIONS-PENDING.md. The source is your line in state/directives/2026-09-29-directives-not-duplicated-and-holds-check.md. It would be a dated amendment appended at the end of AUTONOMY.md.",
  "  (1) Adopt (Recommended) — A dated amendment appended at the end of AUTONOMY.md adds state/directives/ (newest first) after DECISIONS-PENDING.md in section 0's reading order.",
  "  (2) Hold — Section 0's reading order stays as it is."
  ],
  [
  "2. Item 6. PORTABILITY section 7, decision 1 — runner minutes. PORT-1 adds a Linux job to every product push, and PORT-2 adds macOS. Standard GitHub-hosted runners have been free for public repositories, but check Settings → Billing before relying on it.",
  "  (1) PORT-1 now (Recommended) — PORT-1 now, PORT-2 after PORT-1 is green (PORTABILITY's recommendation).",
  "  (2) Approve both now — PORT-1 and PORT-2 are both approved now.",
  "  (3) Hold both — Neither runner job is added yet."
  ],
  [
  "3. Item 7. PORTABILITY section 7, decision 2 — support profiles to target. The recommendation: Windows 10/11 x64 (the reference, unchanged); macOS 14 or later on Apple Silicon for CI, plus the 2019 Intel MacBook for L2 and L3; Linux Ubuntu 24.04 x64 with WebKitGTK 4.1. Other distributions and architectures are not claimed.",
  "  (1) Adopt these (Recommended) — Adopt these profiles (PORTABILITY's recommendation).",
  "  (2) Hold — Hold; decide with PORT-1's results."
  ],
  [
  "4. Item 8. RED LINE (what CI installs) — PORTABILITY section 7, decision 3 — CI system packages for the Linux shell build (PORT-3): WebKitGTK and its build dependencies, installed in the runner only. They are not product dependencies, but they change what CI installs. PORTABILITY gives no recommendation.",
  "  (1) Approve, runner only — Installed by the PORT-3 workflow, never added to the repository's product dependencies.",
  "  (2) Hold until green — Hold until PORT-1 and PORT-2 are green."
  ]
];
const S1_HEADER = (date) =>
  `Question round 8 — ${date} (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: 4. AskUserQuestion is the answer channel; this mirror is read-and-copy.`;
const S1_BODY = (date) => `${S1_HEADER(date)}\n\n---\n\n${S1_ITEMS.map((l) => l.join('\n')).join('\n\n---\n\n')}\n`;

// RECORDED MUTATION: M1 pending (to be recorded when the hook mode lands)
test('the_hook_writes_the_calls_own_questions_and_options_as_the_round_file', (t) => {
  const dir = hookProject(t);
  const r = runHook(dir, fixture);
  assertQuiet(r);
  assert.deepEqual(roundFiles(dir), ['round-7.md', 'round-8.md']);
  const text = fs.readFileSync(path.join(dir, 'state', 'questions', 'round-8.md'), 'utf8');
  const date = /^Question round 8 — (\d{4}-\d{2}-\d{2}) \(custodian/.exec(text)?.[1];
  assert.ok(date, 'the header carries a UTC date');
  assert.equal(text, S1_BODY(date));
  assert.equal(countDry(r.stderr), 1);
});

// RECORDED MUTATION: M2 pending (to be recorded when the hook mode lands)
test('the_header_lists_the_red_line_items_by_number', (t) => {
  const dir = hookProject(t);
  const plain = { question: 'First?', options: [{ label: 'a' }] };
  assertQuiet(runHook(dir, callOf([plain, { question: 'RED LINE second?', options: [{ label: 'b' }] }])));
  const first = fs.readFileSync(path.join(dir, 'state', 'questions', 'round-8.md'), 'utf8');
  assert.match(first, /2 items, asked in one call\. RED LINE items: 2\. /);
  assertQuiet(runHook(dir, callOf([plain, { question: 'Item 2. RED LINE second?', options: [{ label: 'b' }] }])));
  const second = fs.readFileSync(path.join(dir, 'state', 'questions', 'round-9.md'), 'utf8');
  assert.match(second, /2 items, asked in one call\. RED LINE items: 2\. /);
  assertQuiet(runHook(dir, callOf([plain])));
  const none = fs.readFileSync(path.join(dir, 'state', 'questions', 'round-10.md'), 'utf8');
  assert.match(none, /1 item, asked in one call\. RED LINE items: none\. /);
});

// RECORDED MUTATION: M3 pending (to be recorded when the hook mode lands)
test('the_next_round_number_is_one_more_than_the_highest_round_file', (t) => {
  const dir = hookProject(t, { rounds: ['round-2.md', 'round-9.md', 'round-10.md', 'round-3-draft.md', '.gitkeep'] });
  assertQuiet(runHook(dir, fixture));
  assert.deepEqual(roundFiles(dir), ['.gitkeep', 'round-10.md', 'round-11.md', 'round-2.md', 'round-3-draft.md', 'round-9.md']);
});

// RECORDED MUTATION: M4 pending (to be recorded when the hook mode lands)
test('a_second_call_writes_a_second_round_and_sends_a_second_message', (t) => {
  const dir = hookProject(t);
  const first = runHook(dir, fixture);
  const second = runHook(dir, fixture);
  assertQuiet(first);
  assertQuiet(second);
  assert.deepEqual(roundFiles(dir), ['round-7.md', 'round-8.md', 'round-9.md']);
  assert.equal(countDry(first.stderr), 1);
  assert.equal(countDry(second.stderr), 1);
});

// RECORDED MUTATION: M5 pending (to be recorded when the hook mode lands)
test('a_call_inside_a_subagent_writes_and_sends_nothing', (t) => {
  const dir = hookProject(t);
  const r = runHook(dir, { ...fixture, agent_id: 'a1' });
  assert.deepEqual({ status: r.status, stdout: r.stdout, stderr: r.stderr }, { status: 0, stdout: '', stderr: '' });
  assert.deepEqual(roundFiles(dir), ['round-7.md']);
  // A null or empty agent_id is not a subagent.
  assertQuiet(runHook(dir, { ...fixture, agent_id: null }));
  assertQuiet(runHook(dir, { ...fixture, agent_id: '' }));
  assert.deepEqual(roundFiles(dir), ['round-7.md', 'round-8.md', 'round-9.md']);
});

// RECORDED MUTATION: M6 pending (to be recorded when the hook mode lands)
test('a_session_without_the_lease_writes_and_sends_nothing', (t) => {
  const cases = [
    null,
    'lease: another-session refreshed: 2026-10-02T00:00:00.000Z\n',
    'relinquished: fixture-session at 2026-10-02T00:00:00.000Z\n',
  ];
  for (const lease of cases) {
    const dir = hookProject(t, { lease });
    const r = runHook(dir, fixture);
    assert.deepEqual({ lease, status: r.status, stdout: r.stdout, stderr: r.stderr }, { lease, status: 0, stdout: '', stderr: '' });
    assert.deepEqual(roundFiles(dir), ['round-7.md']);
  }
});

// RECORDED MUTATION: M7 pending (to be recorded when the hook mode lands)
test('a_cloud_session_call_writes_and_sends_nothing', (t) => {
  const dir = hookProject(t);
  const r = runHook(dir, fixture, childEnv({ extra: { CLAUDE_CODE_REMOTE: 'true' } }));
  assert.deepEqual({ status: r.status, stdout: r.stdout, stderr: r.stderr }, { status: 0, stdout: '', stderr: '' });
  assert.deepEqual(roundFiles(dir), ['round-7.md']);
});

// RECORDED MUTATION: M8 pending (to be recorded when the hook mode lands)
test('a_failed_send_still_exits_zero_with_empty_stdout', (t) => {
  const dir = hookProject(t);
  const r = runHook(dir, fixture, childEnv({ dryRun: false }));
  assertQuiet(r);
  assert.deepEqual(roundFiles(dir), ['round-7.md', 'round-8.md']);
  const lines = r.stderr.split('\n').filter((l) => l !== '');
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^telegram: CUSTODIAN_TELEGRAM_BOT_TOKEN or CUSTODIAN_TELEGRAM_CHAT_ID is not set in the environment; no-op\.$/);
  assert.equal(lines[1], 'questions-mirror: round 8 send failed (mode=message); the round file is kept for a re-send.');
});

// RECORDED MUTATION: M9 pending (to be recorded when the hook mode lands)
test('a_hook_input_that_is_not_json_exits_zero_and_writes_nothing', (t) => {
  const dir = hookProject(t);
  const r = runHook(dir, 'not json');
  assertQuiet(r);
  assert.equal(r.stderr, 'questions-mirror: hook input is not JSON; no round written.\n');
  assert.deepEqual(roundFiles(dir), ['round-7.md']);
});

// RECORDED MUTATION: M10 pending (to be recorded when the hook mode lands)
test('a_call_with_a_malformed_question_writes_no_round_file', (t) => {
  const dir = hookProject(t);
  const good = { question: 'Q?', options: [{ label: 'a' }] };
  const bad = [
    [],
    [{ options: [{ label: 'a' }] }],
    [{ question: 'Q?', options: [{ description: 'no label' }] }],
    [{ question: 'Q?', options: [{ label: 'a', description: 7 }] }],
    [good, { question: 'Q2?', options: 'not an array' }],
  ];
  for (const questions of bad) {
    const r = runHook(dir, callOf(questions));
    assertQuiet(r);
    assert.equal(r.stderr, 'questions-mirror: hook input carries no well-formed questions; no round written.\n', JSON.stringify(questions));
  }
  assert.deepEqual(roundFiles(dir), ['round-7.md']);
});

// RECORDED MUTATION: M11 pending (to be recorded when the hook mode lands)
test('the_settings_command_mirrors_a_recorded_askuserquestion_payload', (t) => {
  const settings = JSON.parse(fs.readFileSync(path.join(repoRoot, '.claude', 'settings.json'), 'utf8'));
  const entries = settings.hooks.PreToolUse;
  assert.equal(entries.length, 1);
  assert.equal(entries[0].matcher, 'AskUserQuestion');
  assert.equal(entries[0].hooks.length, 1);
  assert.equal(entries[0].hooks[0].type, 'command');
  assert.equal(entries[0].hooks[0].timeout, 20);
  const command = entries[0].hooks[0].command;
  // The command locates the script under $CLAUDE_PROJECT_DIR, so the test project carries the
  // scripts the hook imports, copied from the repository.
  const dir = hookProject(t);
  for (const rel of ['hooks/questions-mirror.mjs', 'hooks/telegram.mjs', 'hooks/cloud.mjs', 'hooks/stop-queue.mjs', 'plan/plan.mjs', 'plan/yamlSubset.mjs']) {
    fs.mkdirSync(path.dirname(path.join(dir, 'scripts', rel)), { recursive: true });
    fs.copyFileSync(path.join(repoRoot, 'scripts', rel), path.join(dir, 'scripts', rel));
  }
  const shell = process.platform === 'win32'
    ? path.resolve(execFileSync('git', ['--exec-path'], { encoding: 'utf8' }).trim(), '..', '..', '..', 'bin', 'bash.exe')
    : '/bin/sh';
  const r = spawnSync(shell, ['-c', command], {
    input: JSON.stringify(fixture),
    encoding: 'utf8',
    env: { ...childEnv(), CLAUDE_PROJECT_DIR: dir },
  });
  assertQuiet(r);
  assert.deepEqual(roundFiles(dir), ['round-7.md', 'round-8.md']);
  const text = fs.readFileSync(path.join(dir, 'state', 'questions', 'round-8.md'), 'utf8');
  const date = /^Question round 8 — (\d{4}-\d{2}-\d{2}) \(custodian/.exec(text)?.[1];
  assert.equal(text, S1_BODY(date));
  assert.equal(countDry(r.stderr), 1);
});

// RECORDED MUTATION: M12 pending (to be recorded when the hook mode lands)
test('the_outcome_line_records_the_round_the_mode_and_the_send_result', (t) => {
  const dir = hookProject(t);
  assertQuiet(runHook(dir, fixture, childEnv({ dryRun: false })));
  assertQuiet(runHook(dir, fixture));
  const lines = fs.readFileSync(path.join(dir, '.claude', 'state', 'round-mirror.jsonl'), 'utf8').split('\n').filter((l) => l !== '');
  assert.equal(lines.length, 2);
  const rows = lines.map((l) => JSON.parse(l));
  for (const row of rows) {
    assert.deepEqual(Object.keys(row), ['at', 'round', 'file', 'mode', 'ok']);
    assert.match(row.at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  }
  assert.deepEqual(rows.map(({ round, file, mode, ok }) => ({ round, file, mode, ok })), [
    { round: 8, file: 'state/questions/round-8.md', mode: 'message', ok: false },
    { round: 9, file: 'state/questions/round-9.md', mode: 'message', ok: true },
  ]);
});

// RECORDED MUTATION: M13 pending (to be recorded when the hook mode lands)
test('a_round_over_4096_characters_is_sent_as_a_document_from_the_hook', (t) => {
  const dir = hookProject(t);
  const r = runHook(dir, callOf([{ question: 'Long?', options: [{ label: 'a', description: 'd'.repeat(4200) }] }]));
  assertQuiet(r);
  assert.deepEqual(roundFiles(dir), ['round-7.md', 'round-8.md']);
  const lines = r.stderr.split('\n').filter((l) => l !== '');
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^\[telegram dry-run\] would send: Question round 8 — \d+ items?; full text attached/);
  assert.match(lines[1], /^\[telegram dry-run\] would send document: .*round-8\.md /);
});
