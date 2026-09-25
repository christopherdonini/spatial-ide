// scripts/hooks/cloud.test.mjs — HOOKS-CLOUD-INERT-PREREGISTRATION.md's dry runs: cloud.mjs's marker set, and unset.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { isCloudSession } from './cloud.mjs';
import { READING_ORDER } from './session-resume.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const twoNodesPlan = path.join(here, '..', 'plan', 'fixtures', 'two-nodes.yaml');

// Local: no marker, no Telegram credentials, Telegram in dry-run mode.
function localEnv(extra = {}) {
  const env = { ...process.env, CUSTODIAN_TELEGRAM_DRY_RUN: '1' };
  for (const k of ['CLAUDE_CODE_REMOTE', 'CUSTODIAN_TELEGRAM_BOT_TOKEN', 'CUSTODIAN_TELEGRAM_CHAT_ID', 'CUSTODIAN_STOP_HOOK']) delete env[k];
  return { ...env, ...extra };
}
// Cloud: as local, with the marker set and no dry-run flag (a cloud session has neither token nor flag).
function cloudEnv(extra = {}) {
  const env = localEnv({ ...extra, CLAUDE_CODE_REMOTE: 'true' });
  delete env.CUSTODIAN_TELEGRAM_DRY_RUN;
  return env;
}
function tempDir(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function writeCutState(dir, text) {
  fs.mkdirSync(path.join(dir, 'state'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'state', 'CUT-STATE.md'), text, 'utf8');
}
function runHook(script, input, env) {
  return spawnSync(process.execPath, [path.join(here, script)], { input: JSON.stringify(input), encoding: 'utf8', env });
}
const assertSilent = (r) => assert.deepEqual({ status: r.status, stdout: r.stdout, stderr: r.stderr }, { status: 0, stdout: '', stderr: '' });
// The shell Claude Code runs command hooks in: Git Bash on Windows (scripts/hooks/README.md), sh elsewhere.
function hookShell() {
  if (process.platform !== 'win32') return '/bin/sh';
  return path.resolve(execFileSync('git', ['--exec-path'], { encoding: 'utf8' }).trim(), '..', '..', '..', 'bin', 'bash.exe');
}

// RECORDED MUTATION: a Stop hook command running the unguarded questions-mirror.mjs added to
// .claude/settings.json -> each_settings_hook_command_exits_silently_under_the_cloud_marker fails:
// "status: 1" and "stderr: 'questions-mirror: usage: ...'" where status 0 and empty stderr are expected.
test('each_settings_hook_command_exits_silently_under_the_cloud_marker', () => {
  const settings = JSON.parse(fs.readFileSync(path.join(repoRoot, '.claude', 'settings.json'), 'utf8'));
  const commands = Object.values(settings.hooks).flat().flatMap((matcher) => matcher.hooks.map((h) => h.command));
  assert.ok(commands.length >= 4, `expected the custodian's hooks, found ${commands.length}`);
  for (const command of commands) {
    const result = spawnSync(hookShell(), ['-c', command], { input: '{}', encoding: 'utf8', env: cloudEnv({ CLAUDE_PROJECT_DIR: repoRoot }) });
    assert.deepEqual({ command, status: result.status, stdout: result.stdout, stderr: result.stderr }, { command, status: 0, stdout: '', stderr: '' });
  }
});

// RECORDED MUTATION: stop-queue.mjs's guard line deleted -> the_stop_hook_is_silent_in_the_cloud_and_unchanged_locally
// fails: stdout '{"decision":"block","reason":"next: two-nodes-ready ...' where '' is expected.
test('the_stop_hook_is_silent_in_the_cloud_and_unchanged_locally', (t) => {
  const dir = tempDir(t, 'cloud-stop-');
  const input = { session_id: 'cloud-stop', cwd: dir, hook_event_name: 'Stop', stop_hook_active: false, background_tasks: [], session_crons: [] };
  const env = { CLAUDE_PROJECT_DIR: dir, CUSTODIAN_PLAN_PATH: twoNodesPlan };
  assertSilent(runHook('stop-queue.mjs', input, cloudEnv(env)));
  const local = runHook('stop-queue.mjs', input, localEnv(env));
  assert.equal(local.status, 0);
  assert.equal(JSON.parse(local.stdout).decision, 'block');
});

// RECORDED MUTATION: precompact-flush.mjs's guard line deleted -> the_precompact_hook_is_silent_in_the_cloud_and_unchanged_locally
// fails: "status: 2" and stderr 'block: no SESSION-CONTINUITY block with both flushed_at and tip ...'.
test('the_precompact_hook_is_silent_in_the_cloud_and_unchanged_locally', (t) => {
  const dir = tempDir(t, 'cloud-precompact-');
  writeCutState(dir, '# CUT-STATE\n\nNo continuity block.\n');
  const input = { session_id: 'cloud-precompact', hook_event_name: 'PreCompact', trigger: 'manual', custom_instructions: null, cwd: dir };
  assertSilent(runHook('precompact-flush.mjs', input, cloudEnv({ CLAUDE_PROJECT_DIR: dir })));
  const local = runHook('precompact-flush.mjs', input, localEnv({ CLAUDE_PROJECT_DIR: dir }));
  assert.equal(local.status, 2);
  assert.match(local.stderr, /PRE-COMPACTION FLUSH REQUIRED/);
});

// RECORDED MUTATION: session-resume.mjs's guard line deleted -> the_session_resume_hook_is_silent_in_the_cloud_and_unchanged_locally
// fails: stdout 'Reading order after a compaction or a new session (AUTONOMY.md §0): ...' where '' is expected.
test('the_session_resume_hook_is_silent_in_the_cloud_and_unchanged_locally', (t) => {
  const dir = tempDir(t, 'cloud-resume-');
  writeCutState(dir, '# CUT-STATE\n\n## SESSION-CONTINUITY\ntip: abc123\n');
  const input = { session_id: 'cloud-resume', hook_event_name: 'SessionStart', source: 'startup', cwd: dir };
  assertSilent(runHook('session-resume.mjs', input, cloudEnv({ CLAUDE_PROJECT_DIR: dir })));
  const local = runHook('session-resume.mjs', input, localEnv({ CLAUDE_PROJECT_DIR: dir }));
  assert.equal(local.status, 0);
  assert.ok(local.stdout.includes(READING_ORDER));
  assert.match(local.stdout, /tip: abc123/);
});

// RECORDED MUTATION: notify-telegram.mjs's guard line deleted -> the_notification_hook_is_silent_in_the_cloud_and_unchanged_locally
// fails: stderr 'telegram: CUSTODIAN_TELEGRAM_BOT_TOKEN or CUSTODIAN_TELEGRAM_CHAT_ID is not set ...; no-op.' where '' is expected.
test('the_notification_hook_is_silent_in_the_cloud_and_unchanged_locally', (t) => {
  const dir = tempDir(t, 'cloud-notify-');
  const input = { session_id: 'cloud-notify', hook_event_name: 'Notification', notification_type: 'idle_prompt', message: 'Claude is waiting for your input', cwd: dir };
  assertSilent(runHook('notify-telegram.mjs', input, cloudEnv({ CLAUDE_PROJECT_DIR: dir })));
  const local = runHook('notify-telegram.mjs', input, localEnv({ CLAUDE_PROJECT_DIR: dir }));
  assert.equal(local.status, 0);
  assert.match(local.stderr, /\[telegram dry-run\] would send: .*Claude is waiting for your input/);
});

// RECORDED MUTATION: cloud.mjs's comparison loosened to Boolean(env[CLOUD_SESSION_MARKER]) ->
// the_cloud_marker_is_only_the_value_true fails: "AssertionError [ERR_ASSERTION]: CLAUDE_CODE_REMOTE=false".
test('the_cloud_marker_is_only_the_value_true', () => {
  assert.equal(isCloudSession({ CLAUDE_CODE_REMOTE: 'true' }), true);
  for (const value of [undefined, '', 'false', '1', 'TRUE']) {
    assert.equal(isCloudSession({ CLAUDE_CODE_REMOTE: value }), false, `CLAUDE_CODE_REMOTE=${value}`);
  }
});
