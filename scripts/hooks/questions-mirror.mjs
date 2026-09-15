#!/usr/bin/env node
// scripts/hooks/questions-mirror.mjs — the question-round Telegram mirror.
//
// Authority (the human, 2026-09-14, AUTONOMY.md Appendix A3, verbatim): "Question rounds get a
// Telegram mirror. Before the first AskUserQuestion of a round, write the full round — every
// question set, verbatim: item number, red-line marker, the digest text, the numbered options with
// their descriptions — to state/questions/round-<n>.md and send it through the Telegram script as
// ONE message; if it exceeds Telegram's 4096-character limit, send the file as a document
// (sendDocument) with a short summary message above it. Plain text, no markdown formatting
// (escaping breaks copy-paste); each item separated by a blank line and a --- rule so it forwards
// cleanly. AskUserQuestion stays the answer channel; Telegram is read-and-copy only, never read for
// answers. Item order in Telegram = the order the prompts will ask."
//
// CLI: node scripts/hooks/questions-mirror.mjs <round-file>
//   <= 4096 chars -> sendMessage(contents) as ONE plain-text message.
//   >  4096 chars -> sendMessage(<summary>) then sendDocument(<round-file>, <same summary>).
//   Exit 0 on success; exit 1 (with a clear stderr line) on a missing file, missing env, or an API
//   error.
//
// Node standard library only. Telegram is a read-and-copy mirror: this never reads Telegram for
// answers, and never sends via markdown parse_mode (plain text, per the directive above).

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { sendMessage, sendDocument } from './telegram.mjs';

// Telegram's message limit is 4096 characters. We measure the message text with [...text].length
// (Unicode code points) rather than text.length (UTF-16 code units): code points match Telegram's
// own "characters" semantics, so a round that Telegram would accept as one message is never pushed
// onto the document path by a surrogate-pair miscount. For plain UTF-8 the file's byte length and
// the code-point count of its contents are the same text; the boundary is measured on that text.
export const TELEGRAM_MAX_CHARS = 4096;

/** Round number from a `round-<n>.md` filename; `?` if the name does not carry one. */
export function extractRoundNumber(file) {
  const m = path.basename(file).match(/round-(\d+)/i);
  return m ? m[1] : '?';
}

/** Item count = the `---` separator rules (one between each pair of items) + 1; a fileful of one
 * item has no rule. Best-effort, for the summary line only. */
export function countItems(text) {
  const rules = (text.match(/^---\s*$/gm) || []).length;
  return rules > 0 ? rules + 1 : 1;
}

/** The short message that sits above the attached document (also reused as the document caption). */
export function buildSummary(file, text) {
  return `Question round ${extractRoundNumber(file)} — ${countItems(text)} items; full text attached (copy-paste ready)`;
}

/**
 * Pure-ish core: reads the round file, decides message-vs-document on the 4096 code-point boundary,
 * and drives the injected senders. Dependencies (sendMessage, sendDocument, readFile) are injected
 * so a test can supply fakes and never touch the network. Returns
 * { mode, ok, results, summary? }; `ok` is the AND of every send's own `ok`. Throws only if
 * `readFile` throws (a missing/unreadable file), which the CLI turns into exit 1.
 */
export async function mirrorRound({ file, sendMessage: send, sendDocument: sendDoc, readFile }) {
  const text = readFile(file);
  const length = [...text].length; // code points — see TELEGRAM_MAX_CHARS note above.

  if (length <= TELEGRAM_MAX_CHARS) {
    const result = await send(text);
    return { mode: 'message', ok: result?.ok === true, results: [result] };
  }

  const summary = buildSummary(file, text);
  const messageResult = await send(summary);
  const documentResult = await sendDoc(file, summary);
  return {
    mode: 'document',
    ok: messageResult?.ok === true && documentResult?.ok === true,
    summary,
    results: [messageResult, documentResult],
  };
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('questions-mirror: usage: node scripts/hooks/questions-mirror.mjs <round-file>');
    process.exit(1);
    return;
  }

  let outcome;
  try {
    outcome = await mirrorRound({
      file,
      sendMessage,
      sendDocument,
      readFile: (f) => fs.readFileSync(f, 'utf8'),
    });
  } catch (e) {
    console.error(`questions-mirror: could not read the round file '${file}' (${e.message}).`);
    process.exit(1);
    return;
  }

  if (!outcome.ok) {
    console.error(
      `questions-mirror: send failed (mode=${outcome.mode}); missing token/chat id or an API error — see the telegram line above.`,
    );
    process.exit(1);
    return;
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
