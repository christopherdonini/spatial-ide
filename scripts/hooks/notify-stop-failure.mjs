#!/usr/bin/env node
// scripts/hooks/notify-stop-failure.mjs — the StopFailure hook (the human's approval of
// ADV-2026-11-18-06, items 1 and 2: state/directives/2026-11-18-the-humans-message-adv-2026-11-18-06-approved-a-stop-failure-hook-that-tells-the-human-when-a-turn-ends-on-a-service-error.md;
// the form: governance/forms/scripts/STOP-FAILURE-ALARM-PREREGISTRATION.md).
//
// The event, from the hooks reference's StopFailure section: "Runs instead of [Stop](#stop) when the turn ends due to an API error."
// The same section says the hook's output and exit code are ignored, so this script decides
// nothing and always exits 0. It reads the hook's JSON from stdin and sends one Telegram message
// through sendTelegramDeduped (telegram.mjs, its ten-minute window), keyed on the error type.
//
// The message states that the session stopped on an error, the `error` value, the `error_details`
// value when present, and the basename of cwd. It never carries last_assistant_message, nor any
// other field, because the approval's item 2 says: "It does not send the last assistant message, because that text can carry my account link."
// It reads no token variable itself (telegram.mjs does, from the environment only) and prints none.
// In a cloud session it exits at once (cloud.mjs), as notify-telegram.mjs does.

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isCloudSession } from './cloud.mjs';
import { sendTelegramDeduped } from './telegram.mjs';

export function buildMessage(input) {
  const cwdBase = path.basename(input.cwd || process.cwd());
  const details = input.error_details ? ` — ${input.error_details}` : '';
  return `Session stopped on an error: ${input.error ?? 'unknown'}${details} (${cwdBase})`;
}

/** The error type alone, so a run of the same error collapses into one message per window. */
export function dedupeKey(input) {
  return `stop-failure:${input.error ?? 'unknown'}`;
}

function resolveProjectRoot(input) {
  return process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd();
}

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

async function main() {
  let input = {};
  try {
    const raw = await readStdin();
    input = raw.trim() ? JSON.parse(raw) : {};
    if (input === null || typeof input !== 'object') input = {};
  } catch (e) {
    console.error(`notify-stop-failure: could not parse stdin JSON (${e.message}); nothing to send.`);
    process.exit(0);
    return;
  }

  try {
    await sendTelegramDeduped(dedupeKey(input), buildMessage(input), { projectRoot: resolveProjectRoot(input) });
  } catch (e) {
    console.error(`notify-stop-failure: send failed (${e.message}).`);
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (isCloudSession()) process.exit(0); // the custodian's hook, inert in a cloud session (cloud.mjs)
  main();
}
