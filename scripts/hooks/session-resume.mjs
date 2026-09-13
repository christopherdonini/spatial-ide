#!/usr/bin/env node
// scripts/hooks/session-resume.mjs — the SessionStart hook (AUTONOMY.md §7), matchers `compact`
// and `resume`.
//
// Verified contract (Appendix B / guide, quoted in scripts/hooks/README.md): "Claude Code adds
// stdout it treats as plain text to Claude's context" for SessionStart; "Since plain stdout
// already reaches Claude for this event, a hook that only loads context can print to stdout
// directly without building JSON." Guide: "Use a SessionStart hook with a compact matcher to
// re-inject critical context after every compaction." This is the documented re-injection path;
// prints §0's reading order and the SESSION-CONTINUITY block verbatim.
//
// PATHS (human's second directive, item 17): reads state/CUT-STATE.md, not the old root path.
//
// Never throws to the shell: prints what it can and exits 0 even if state/CUT-STATE.md is
// missing or unparseable.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const READING_ORDER = `Reading order after a compaction or a new session (AUTONOMY.md §0):
1. state/CUT-STATE.md — its SESSION-CONTINUITY block first (position, tip hash, half-made judgments, intended sequencing), then the ledger's last entries.
2. CUSTODIAN-QUEUE.md — the generated ready set and the waiting-on-human list.
3. DECISIONS-PENDING.md — the RULED blocks (newest first) and the open entries.
4. PRECEDENTS.md — before raising any question.
5. AUTONOMY.md for the mechanics; AI_DEVELOPMENT.md for the role, the red lines and the accumulated lessons.`;

function resolveProjectRoot(input) {
  return process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd();
}

function cutStatePath(projectRoot) {
  return path.join(projectRoot, 'state', 'CUT-STATE.md');
}

/** Extracts the `## SESSION-CONTINUITY` section verbatim (heading through the next heading or EOF). */
export function extractSessionContinuityBlock(text) {
  const lines = text.split(/\r\n|\r|\n/);
  const idx = lines.findIndex((l) => l.trim() === '## SESSION-CONTINUITY');
  if (idx === -1) return null;
  let end = lines.length;
  for (let i = idx + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(idx, end).join('\n').trim();
}

export function buildOutput(projectRoot) {
  const p = cutStatePath(projectRoot);
  let block = null;
  let note = null;
  try {
    const text = fs.readFileSync(p, 'utf8');
    block = extractSessionContinuityBlock(text);
    if (block === null) note = `(${p} has no SESSION-CONTINUITY block)`;
  } catch (e) {
    note = `(${p} could not be read: ${e.message})`;
  }
  const parts = [READING_ORDER];
  parts.push(block ?? note ?? '(no SESSION-CONTINUITY block found)');
  return `${parts.join('\n\n')}\n`;
}

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
    // SessionStart does not require input; do not hang if stdin is never closed by the caller.
    setTimeout(() => resolve(data), 500).unref?.();
  });
}

async function main() {
  let input = {};
  try {
    const raw = await readStdin();
    input = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    input = {};
  }
  try {
    process.stdout.write(buildOutput(resolveProjectRoot(input)));
  } catch (e) {
    console.error(`session-resume: unexpected error (${e.message}); printing the reading order only.`);
    process.stdout.write(`${READING_ORDER}\n`);
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
