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
// After the block it prints one line of machine facts: the age of the block in minutes, the commits
// HEAD is past the tip the block names, and the modified tracked files; `unknown` for any fact it
// cannot read.
//
// Never throws to the shell: prints what it can and exits 0 even if state/CUT-STATE.md is
// missing or unparseable.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { isCloudSession } from './cloud.mjs';
import { parseSessionContinuity } from './precompact-flush.mjs';

export const READING_ORDER = `Reading order after a compaction or a new session (AUTONOMY.md §0):
1. state/CUT-STATE.md — its SESSION-CONTINUITY block first (position, tip hash, half-made judgments, intended sequencing), then the ledger's last entries.
2. CUSTODIAN-QUEUE.md — the generated ready set and the waiting-on-human list.
3. DECISIONS-PENDING.md — the RULED blocks (newest first) and the open entries.
4. state/directives/ — the human's instructions, recorded verbatim, newest first.
5. PRECEDENTS.md — before raising any question.
6. AUTONOMY.md for the mechanics; AI_DEVELOPMENT.md for the role, the red lines and the accumulated lessons.`;

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

const RESUME_GIT_TIMEOUT_MS = 2000; // per git call; two calls plus the stdin wait stay under the entry timeout
const TIP_GUARD = /^[0-9a-f]{7,40}$/;

// Real git, argument array, no shell; null on any failure. The output is not trimmed.
function resumeGit(args, projectRoot) {
  try {
    return execFileSync('git', args, {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: RESUME_GIT_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

function resumeLine(projectRoot, parsed) {
  let age = 'unknown';
  let past = 'unknown';
  let modified = 'unknown';
  try {
    if (parsed?.flushedAt) {
      const flushed = new Date(parsed.flushedAt).getTime();
      if (!Number.isNaN(flushed)) age = String(Math.floor((Date.now() - flushed) / 60000));
    }
    if (parsed?.tip && TIP_GUARD.test(parsed.tip)) {
      const out = resumeGit(['rev-list', '--count', `${parsed.tip}..HEAD`], projectRoot);
      if (out !== null && /^\d+$/.test(out.trim())) past = out.trim();
    }
    const status = resumeGit(['status', '--porcelain'], projectRoot);
    if (status !== null) {
      modified = String(status.split(/\r\n|\r|\n/).filter((l) => l.trim() !== '' && !l.startsWith('??')).length);
    }
  } catch {
    // a fact not yet read stays unknown
  }
  return `Resume facts: block_age_min=${age} commits_past_tip=${past} modified_tracked_files=${modified}`;
}

export function buildOutput(projectRoot) {
  const p = cutStatePath(projectRoot);
  let block = null;
  let note = null;
  let parsed = null;
  try {
    const text = fs.readFileSync(p, 'utf8');
    block = extractSessionContinuityBlock(text);
    parsed = parseSessionContinuity(text);
    if (block === null) note = `(${p} has no SESSION-CONTINUITY block)`;
  } catch (e) {
    note = `(${p} could not be read: ${e.message})`;
  }
  const parts = [READING_ORDER];
  parts.push(block ?? note ?? '(no SESSION-CONTINUITY block found)');
  parts.push(resumeLine(projectRoot, parsed));
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
  if (isCloudSession()) process.exit(0); // the custodian's hook, inert in a cloud session (cloud.mjs)
  main();
}
