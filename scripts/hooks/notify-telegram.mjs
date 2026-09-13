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
// Matcher (settings.json): the five types where Claude is blocked on the human (item 16a):
// permission_prompt, idle_prompt, agent_needs_input, quota_auto_resume_stale,
// quota_auto_resume_disabled.
//
// Message text: "<notification type>: <title/message>" plus the cwd's basename.

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { sendTelegram } from './telegram.mjs';

export function buildMessage(input) {
  const cwdBase = path.basename(input.cwd || process.cwd());
  const label = input.title ? `${input.title} — ${input.message}` : input.message;
  return `${input.notification_type}: ${label} (${cwdBase})`;
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
    await sendTelegram(buildMessage(input));
  } catch (e) {
    // Notification hooks decide nothing regardless (exit code and stderr are ignored for this event).
    console.error(`notify-telegram: send failed (${e.message}).`);
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
