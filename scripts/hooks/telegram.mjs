// scripts/hooks/telegram.mjs
//
// Telegram alerts (the human's second directive, item 16): "Telegram alerts via a Notification
// hook (and the Stop hook when blocking on me): one message per blocking event; bot token in an
// env var only, never in the tree. AskUserQuestion stays the answer channel."
//
// sendTelegram(text): POST https://api.telegram.org/bot<TOKEN>/sendMessage (JSON body chat_id,
// text, plain text <= 4096 chars) with Node's `https` module only -- no dependency is added.
// Token: CUSTODIAN_TELEGRAM_BOT_TOKEN. Chat id: CUSTODIAN_TELEGRAM_CHAT_ID. Both environment
// only -- never read from any file, never logged. Unset -> no-op with one stderr line. 8-second
// timeout. A failure never changes a hook's decision (callers must not let a rejected promise or
// a slow network stall a hook's own exit).
//
// CUSTODIAN_TELEGRAM_DRY_RUN=1 writes the would-be message to stderr instead of sending, for
// tests and for local dry runs.
//
// sendTelegramDeduped(key, text, opts): "one message per blocking event" -- suppresses a second
// send for the same key within a 10-minute window, recorded in
// <project root>/.claude/state/telegram-sent.json (gitignored; the same convention scripts/hooks
// use for their other per-session/per-day state).

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

const MAX_TEXT_LENGTH = 4096;
const TIMEOUT_MS = 8000;
export const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

/** Sends one Telegram message. Never throws; resolves with a result object describing what happened. */
export function sendTelegram(text) {
  const token = process.env.CUSTODIAN_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.CUSTODIAN_TELEGRAM_CHAT_ID;
  const dryRun = process.env.CUSTODIAN_TELEGRAM_DRY_RUN === '1';
  const truncated = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text;

  if (dryRun) {
    console.error(`[telegram dry-run] would send: ${truncated}`);
    return Promise.resolve({ ok: true, dryRun: true });
  }
  if (!token || !chatId) {
    console.error(
      'telegram: CUSTODIAN_TELEGRAM_BOT_TOKEN or CUSTODIAN_TELEGRAM_CHAT_ID is not set in the environment; no-op.',
    );
    return Promise.resolve({ ok: false, skipped: true });
  }

  const body = JSON.stringify({ chat_id: chatId, text: truncated });

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let req;
    try {
      req = https.request(
        {
          hostname: 'api.telegram.org',
          path: `/bot${token}/sendMessage`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
          timeout: TIMEOUT_MS,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            const ok = res.statusCode >= 200 && res.statusCode < 300;
            if (!ok) {
              console.error(`telegram: send failed (HTTP ${res.statusCode}); a failure never changes a hook's decision.`);
            }
            finish({ ok, status: res.statusCode, body: data });
          });
        },
      );
    } catch (e) {
      console.error(`telegram: send failed (${e.message}); a failure never changes a hook's decision.`);
      finish({ ok: false, error: e.message });
      return;
    }

    req.on('timeout', () => {
      req.destroy(new Error('telegram request timed out'));
    });
    req.on('error', (err) => {
      console.error(`telegram: send failed (${err.message}); a failure never changes a hook's decision.`);
      finish({ ok: false, error: err.message });
    });
    req.write(body);
    req.end();
  });
}

function telegramStatePath(projectRoot) {
  return path.join(projectRoot, '.claude', 'state', 'telegram-sent.json');
}

function readSentMap(projectRoot) {
  try {
    return JSON.parse(fs.readFileSync(telegramStatePath(projectRoot), 'utf8'));
  } catch {
    return {};
  }
}

function writeSentMap(projectRoot, map) {
  const p = telegramStatePath(projectRoot);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(map, null, 2), 'utf8');
}

/**
 * Sends `text` under dedupe key `key`, unless the same key sent within the last
 * `windowMs` (default DEDUPE_WINDOW_MS). Returns { ok, deduped } — never throws.
 */
export async function sendTelegramDeduped(key, text, { projectRoot = process.cwd(), windowMs = DEDUPE_WINDOW_MS, now = Date.now() } = {}) {
  let sent;
  try {
    sent = readSentMap(projectRoot);
  } catch {
    sent = {};
  }
  const last = sent[key];
  if (typeof last === 'number' && now - last < windowMs) {
    return { ok: false, deduped: true };
  }
  // Record before sending, so a slow send can't race a second trigger into a duplicate.
  try {
    writeSentMap(projectRoot, { ...sent, [key]: now });
  } catch (e) {
    console.error(`telegram: could not write the dedupe state file (${e.message}); sending anyway.`);
  }
  const result = await sendTelegram(text);
  return { ...result, deduped: false };
}
