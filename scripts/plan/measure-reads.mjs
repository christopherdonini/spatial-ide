#!/usr/bin/env node
// scripts/plan/measure-reads.mjs - two byte counts at a git rev (the form is
// scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md, section 2 item 3; piece A of the
// governance-search-ignore-historical node).
//
//   routine <rev>  writes the routine read to stdout (part 1, part 2, part 3) and its figures to stderr
//   corpus <rev>   reads `rg --files` output on stdin and sums the committed sizes of those paths
//
// Both figures are UTF-8 bytes, never tokens. The script never starts ripgrep. Exit 0, or 2 on any
// refusal, and a refusal writes nothing to stdout. After the baseline run this file's bytes are not
// edited (form, section 2 item 7 (a)).

import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { extractSessionContinuityBlock } from '../hooks/session-resume.mjs';
import { parseSessionContinuity } from '../hooks/precompact-flush.mjs';

const WINDOW_HOURS = 168; // OPEN-1 (A), the human's ruling (form, Amendment 1)
const MAX_BUFFER = 64 * 1024 * 1024;
const ENTRY = /^- (\d{4}-\d\d-\d\dT\d\d:\d\dZ) - /;
const ANY_HEADING = /^#{1,6}\s/;
const LEVEL_2 = /^## /;

class Refusal extends Error {}

const must = (value, what) => {
  if (value === null || value === undefined) throw new Refusal(`missing ${what}`);
  return value;
};
const bytes = (s) => Buffer.byteLength(s, 'utf8');
const toLines = (text) => text.split(/\r\n|\r|\n/);

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', maxBuffer: MAX_BUFFER, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    throw new Refusal(`git ${args[0]} failed: ${String(e.stderr ?? e.message).trim()}`);
  }
}

/** The lines of the section opened by the line whose trimmed text is `title`, or null. */
function section(lines, title, endRe, withHeading) {
  const i = lines.findIndex((l) => l.trim() === title);
  if (i === -1) return null;
  let end = lines.length;
  for (let j = i + 1; j < lines.length; j++) {
    if (endRe.test(lines[j])) {
      end = j;
      break;
    }
  }
  return lines.slice(withHeading ? i : i + 1, end);
}

function dropTrailingEmpty(lines) {
  const out = [...lines];
  while (out.length && out[out.length - 1].trim() === '') out.pop();
  return out;
}

function routine(rev) {
  const cutState = toLines(git(['show', `${rev}:state/CUT-STATE.md`])).join('\n');
  const pending = toLines(git(['show', `${rev}:DECISIONS-PENDING.md`])).join('\n');

  const p1 = must(extractSessionContinuityBlock(cutState), 'SESSION-CONTINUITY block');
  const flushed = Date.parse(must(parseSessionContinuity(cutState)?.flushedAt, 'flushed_at'));
  if (Number.isNaN(flushed)) throw new Refusal('unparseable flushed_at');

  const ledger = must(section(toLines(cutState), '## Ledger', ANY_HEADING, false), '## Ledger');
  const entries = [];
  for (const line of ledger) {
    const m = ENTRY.exec(line);
    if (m) entries.push({ at: Date.parse(m[1]), lines: [line] });
    else if (entries.length) entries[entries.length - 1].lines.push(line);
  }
  const from = flushed - WINDOW_HOURS * 3600 * 1000;
  const kept = entries.filter((e) => e.at >= from);
  const p2 = dropTrailingEmpty(kept.flatMap((e) => e.lines)).join('\n');

  const p3 = dropTrailingEmpty(must(section(toLines(pending), '## Pending', LEVEL_2, true), '## Pending')).join('\n');

  const out = `${p1}\n\n${p2}\n\n${p3}\n`;
  const note =
    `measure-reads: routine ${rev} block=${bytes(p1)} ledger=${bytes(p2)} entries=${kept.length} ` +
    `window_from=${new Date(from).toISOString()} outside_window=${entries.length - kept.length} ` +
    `pending=${bytes(p3)} total=${bytes(out)}`;
  return { out, note };
}

function corpus(rev) {
  let input;
  try {
    input = fs.readFileSync(0, 'utf8');
  } catch (e) {
    throw new Refusal(`cannot read stdin: ${e.message}`);
  }
  const listed = new Set(
    input
      .split(/\r?\n/)
      .filter((l) => l !== '')
      .map((l) => l.replaceAll('\\', '/')),
  );
  if (listed.size === 0) throw new Refusal('empty path list');
  const sizes = new Map();
  for (const record of git(['ls-tree', '-r', '-l', '-z', rev]).split('\0')) {
    const m = /^\d+ blob [0-9a-f]+ +(\d+)\t([^]*)$/.exec(record);
    if (m) sizes.set(m[2], Number(m[1]));
  }
  let sum = 0;
  for (const p of listed) {
    if (!sizes.has(p)) throw new Refusal(`path not in ${rev}: ${p}`);
    sum += sizes.get(p);
  }
  return {
    out: `measure-reads: corpus ${rev} files=${listed.size} bytes=${sum}\n`,
    note: `tracked_not_listed=${sizes.size - listed.size}`,
  };
}

const [cmd, rev, ...extra] = process.argv.slice(2);
try {
  if (!['routine', 'corpus'].includes(cmd) || !rev || rev.startsWith('-') || extra.length) {
    throw new Refusal('usage: measure-reads.mjs routine <rev> | corpus <rev> (paths on stdin)');
  }
  const r = cmd === 'routine' ? routine(rev) : corpus(rev);
  process.stdout.write(r.out);
  process.stderr.write(`${r.note}\n`);
} catch (e) {
  process.stderr.write(`measure-reads: refused: ${e.message}\n`);
  process.exitCode = 2;
}
