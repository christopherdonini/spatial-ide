#!/usr/bin/env node
// scripts/hooks/notify-telegram.mjs — the Notification hook (human's second directive, item 16a).
//
// Verified Notification contract, quoted in scripts/hooks/README.md from the saved reference
// (hooks.md, section "### Notification" / "#### Notification input", fetched alongside Appendix B
// on 2026-09-13): "In addition to the common input fields, Notification hooks receive `message`
// with the notification text, an optional `title`, and `notification_type` indicating which type
// fired." The exit-code table's own row for Notification reads "Exit code and stderr are
// ignored" — so this hook always exits 0 and decides nothing; it exists purely for the side
// effect of forwarding the notification to Telegram.
//
// Matcher (settings.json): the two quota types only, quota_auto_resume_stale and
// quota_auto_resume_disabled (AUTONOMY.md §38 (iv)). This script has no type list of its own: it
// forwards whatever notification the matcher lets through.
//
// Message text: "<notification type>: <title/message>" plus the cwd's basename.
//
// Sent via sendTelegramDeduped (telegram.mjs), not the bare send, keyed on notification_type + the
// message's own head (not the full text, so near-duplicate re-notifications of the same
// long-running wait collapse into one every ten minutes, per DEDUPE_WINDOW_MS). A failed send
// never changes anything: this hook's exit code and stderr are ignored.

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isCloudSession } from './cloud.mjs';
import { sendTelegramDeduped } from './telegram.mjs';

const DEDUPE_HEAD_LENGTH = 80;

export function buildMessage(input) {
  const cwdBase = path.basename(input.cwd || process.cwd());
  const label = input.title ? `${input.title} — ${input.message}` : input.message;
  return `${input.notification_type}: ${label} (${cwdBase})`;
}

/** type + message head, so distinct waits of the same type still get their own dedupe bucket. */
export function dedupeKey(input) {
  const head = String(input.message ?? '').slice(0, DEDUPE_HEAD_LENGTH);
  return `notification:${input.notification_type}:${head}`;
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
  } catch (e) {
    console.error(`notify-telegram: could not parse stdin JSON (${e.message}); nothing to send.`);
    process.exit(0);
    return;
  }

  try {
    await sendTelegramDeduped(dedupeKey(input), buildMessage(input), { projectRoot: resolveProjectRoot(input) });
  } catch (e) {
    // Notification hooks decide nothing regardless (exit code and stderr are ignored for this event).
    console.error(`notify-telegram: send failed (${e.message}).`);
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (isCloudSession()) process.exit(0); // the custodian's hook, inert in a cloud session (cloud.mjs)
  main();
}
