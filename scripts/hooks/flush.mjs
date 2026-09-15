#!/usr/bin/env node
// scripts/hooks/flush.mjs — the flush WRITER (AUTONOMY.md §7's companion to precompact-flush.mjs).
//
// ## Why this exists (the 2026-09-15 silent-flush incident)
//
// The SESSION-CONTINUITY block at the top of state/CUT-STATE.md had been written by ad-hoc inline
// scripts each flush. One such script targeted the field `intended sequencing (next)` while the
// block's actual label is `intended sequencing (next session)`: the regex matched ZERO lines, the
// field went unwritten, and the flush was treated as a success — a stale block that the PreCompact
// hook then had to catch. The human, 2026-09-15: "a flush that writes no field is an error, never a
// success; add a test for its field names." This module is that guarantee, in one committed,
// tested place instead of a fresh throwaway each time.
//
// ## The contract
//
// `updateBlockFields(text, updates)` is all-or-nothing and FAILS LOUD:
//   - `updates` with zero keys throws — a flush with no field written is an error, never a no-op.
//   - a key that is not one of SESSION_CONTINUITY_FIELDS throws (this is what rejects the exact
//     `intended sequencing (next)` typo that caused the incident).
//   - a known key whose `<label>:` line is not present EXACTLY ONCE in the block throws.
//   - a value carrying a newline throws (the block is line-addressed; a multi-line value would
//     corrupt the block silently).
// Any throw means NOTHING is written: the CLI catches it, prints it, and exits non-zero. There is
// no path by which a requested field is silently skipped.
//
// SESSION_CONTINUITY_FIELDS is the single source of truth for the block's field labels, and
// flush.test.mjs asserts it equals the labels in the real state/CUT-STATE.md block — so a rename on
// either side (the block or this list) fails a test rather than a 3 a.m. flush before compaction.
//
// CLI:
//   node scripts/hooks/flush.mjs --json <path>     # {label: value, ...}; unknown labels rejected
//   node scripts/hooks/flush.mjs --field 'position=...' --field 'tip=...'
// `flushed_at` defaults to now (ISO-8601 UTC) and `tip` to `git rev-parse HEAD` when omitted, so a
// caller supplies only the prose fields. Reads and rewrites state/CUT-STATE.md in place.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const BLOCK_HEADING = '## SESSION-CONTINUITY';

// The canonical field labels, in block order. THE source of truth; flush.test.mjs pins it to the
// real block. `flushed_at` and `tip` are the two precompact-flush.mjs reads; the rest are prose.
export const SESSION_CONTINUITY_FIELDS = [
  'flushed_at',
  'tip',
  'branches',
  'position',
  'half-made judgments',
  'intended sequencing (next session)',
  'unreported findings',
  'in-flight gate states',
];

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

export function cutStatePath(projectRoot = REPO_ROOT) {
  return path.join(projectRoot, 'state', 'CUT-STATE.md');
}

/** [startLine, endLineExclusive) of the SESSION-CONTINUITY block, or null. Heading to next heading. */
export function findBlockRange(lines) {
  const start = lines.findIndex((l) => l.trim() === BLOCK_HEADING);
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return { start, end };
}

/** The field labels actually present in the block, in order (each `^<label>: ` line, once). */
export function blockFieldLabels(text) {
  const lines = text.split(/\r\n|\r|\n/);
  const range = findBlockRange(lines);
  if (!range) return [];
  const labels = [];
  for (let i = range.start + 1; i < range.end; i++) {
    const m = lines[i].match(/^([A-Za-z][^:\n]*?):\s/);
    if (m) labels.push(m[1]);
  }
  return labels;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply `updates` ({label: value}) to the SESSION-CONTINUITY block. All-or-nothing; throws (writing
 * nothing) on any of: zero updates, an unknown label, a label whose line is not present exactly
 * once, or a value containing a newline. Returns the rewritten text.
 */
export function updateBlockFields(text, updates) {
  const keys = Object.keys(updates);
  if (keys.length === 0) {
    throw new Error('flush: refusing to write — zero fields given (a flush with no field is an error, never a success)');
  }

  const known = new Set(SESSION_CONTINUITY_FIELDS);
  for (const key of keys) {
    if (!known.has(key)) {
      throw new Error(
        `flush: "${key}" is not a SESSION-CONTINUITY field. Known fields: ${SESSION_CONTINUITY_FIELDS.join(', ')}`,
      );
    }
    const value = updates[key];
    if (typeof value !== 'string') {
      throw new Error(`flush: value for "${key}" must be a string, got ${typeof value}`);
    }
    if (/[\r\n]/.test(value)) {
      throw new Error(`flush: value for "${key}" contains a newline; the block is line-addressed and a value must be one line`);
    }
  }

  const lines = text.split('\n');
  const range = findBlockRange(lines);
  if (!range) {
    throw new Error(`flush: no ${BLOCK_HEADING} block found in the text`);
  }

  // First locate every target line and verify each label matches exactly once. Only after every
  // check passes do we mutate — so a failure leaves `lines` untouched and the caller writes nothing.
  const lineForKey = {};
  for (const key of keys) {
    const re = new RegExp(`^${escapeRegExp(key)}:\\s`);
    const hits = [];
    for (let i = range.start + 1; i < range.end; i++) {
      if (re.test(lines[i])) hits.push(i);
    }
    if (hits.length !== 1) {
      throw new Error(
        `flush: field "${key}" appears ${hits.length} times in the block (expected exactly 1) — the block's labels may have changed; see SESSION_CONTINUITY_FIELDS`,
      );
    }
    lineForKey[key] = hits[0];
  }

  for (const key of keys) {
    lines[lineForKey[key]] = `${key}: ${updates[key]}`;
  }
  return lines.join('\n');
}

function tryGit(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function parseArgs(argv) {
  const updates = {};
  let jsonPath = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') {
      jsonPath = argv[++i];
      if (jsonPath === undefined) throw new Error('--json needs a path');
    } else if (a === '--field') {
      const kv = argv[++i];
      if (kv === undefined) throw new Error('--field needs label=value');
      const eq = kv.indexOf('=');
      if (eq === -1) throw new Error(`--field "${kv}" is not label=value`);
      updates[kv.slice(0, eq)] = kv.slice(eq + 1);
    } else {
      throw new Error(`unknown argument: ${a}`);
    }
  }
  return { updates, jsonPath };
}

function main() {
  const { updates, jsonPath } = parseArgs(process.argv.slice(2));
  let all = { ...updates };
  if (jsonPath) {
    const fromFile = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    all = { ...fromFile, ...all }; // explicit --field overrides the file
  }

  // Convenience defaults: a caller supplies only the prose fields.
  if (all.flushed_at === undefined) {
    all.flushed_at = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
  if (all.tip === undefined) {
    const head = tryGit(['rev-parse', 'HEAD'], REPO_ROOT);
    if (head) all.tip = head;
    else delete all.tip; // no git → don't invent a tip; updateBlockFields still writes the rest
  }

  const p = cutStatePath();
  const text = fs.readFileSync(p, 'utf8');
  const next = updateBlockFields(text, all); // throws (writing nothing) on any problem
  fs.writeFileSync(p, next, 'utf8');
  console.log(`flush: wrote ${Object.keys(all).length} field(s) into ${BLOCK_HEADING} of ${p}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    // Thrown messages already carry the `flush:` prefix; a non-flush error (e.g. a bad JSON file)
    // is prefixed here so every failure line is attributable.
    console.error(e.message.startsWith('flush:') ? e.message : `flush: ${e.message}`);
    process.exitCode = 1;
  }
}
