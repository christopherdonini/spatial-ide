// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/movedMap.mjs -- the shared resolution of governance piece F's move map (the form
// scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md, section 2.3), used by
// verify-cites, verify-quotes, verify and site. governance/MOVED.tsv holds one row per rename of a
// moves-only commit: `old<TAB>new<TAB>commit`. A tree with no such file has an empty map, and every
// caller then behaves exactly as it did before the map existed. Node's standard library only.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const MOVED_REL = 'governance/MOVED.tsv';
export const MOVED_HEADER = 'old\tnew\tcommit';

const COMMIT_RE = /^[0-9a-f]{40}$/;
const HAS_EXT_RE = /\.[A-Za-z0-9]+$/;

/** Rows `{ old, new, commit }` in byte order of the old path (ties: new, then commit). */
export function sortRows(rows) {
  const b = (s) => Buffer.from(s, 'utf8');
  return [...rows].sort((x, y) => Buffer.compare(b(x.old), b(y.old)) || Buffer.compare(b(x.new), b(y.new)) || Buffer.compare(b(x.commit), b(y.commit)));
}

export function formatMovedTsv(rows) {
  return MOVED_HEADER + '\n' + sortRows(rows).map((r) => `${r.old}\t${r.new}\t${r.commit}\n`).join('');
}

/** Parses the file's text. Throws an Error naming the line on any malformed byte. */
export function parseMovedTsv(text) {
  if (text.includes('\r')) throw new Error(`${MOVED_REL}: holds a CR (LF only)`);
  const lines = text.split('\n');
  if (lines.pop() !== '') throw new Error(`${MOVED_REL}: does not end with a newline`);
  if (lines[0] !== MOVED_HEADER) throw new Error(`${MOVED_REL}: line 1 is not the header "old<TAB>new<TAB>commit"`);
  return lines.slice(1).map((l, i) => {
    const c = l.split('\t');
    if (c.length !== 3 || !c[0] || !c[1] || !COMMIT_RE.test(c[2])) throw new Error(`${MOVED_REL}: line ${i + 2} is not "old<TAB>new<TAB>40-hex commit"`);
    return { old: c[0], new: c[1], commit: c[2] };
  });
}

export function buildMovedMap(rows) {
  const byOld = new Map();
  const byNew = new Map();
  for (const r of rows) {
    if (!byOld.has(r.old)) byOld.set(r.old, r);
    if (!byNew.has(r.new)) byNew.set(r.new, r);
  }
  return { rows, byOld, byNew };
}

/** The map of a checkout: empty when governance/MOVED.tsv is absent. */
export function loadMovedMap(root) {
  const p = path.join(root, MOVED_REL);
  return buildMovedMap(fs.existsSync(p) ? parseMovedTsv(fs.readFileSync(p, 'utf8')) : []);
}

/** The rows from `rel` onward (a file moved twice has two). */
export function chainFrom(map, rel) {
  const chain = [];
  const seen = new Set();
  for (let cur = rel; map.byOld.has(cur) && !seen.has(cur); cur = chain[chain.length - 1].new) {
    seen.add(cur);
    chain.push(map.byOld.get(cur));
  }
  return chain;
}

/** Where a path written as an old path lives now; any other path comes back unchanged. */
export function currentPath(map, rel) {
  const chain = chainFrom(map, rel);
  return chain.length ? chain[chain.length - 1].new : rel;
}

/** Where a moved file lived before its first move; any other path comes back unchanged. */
export function originPath(map, rel) {
  const seen = new Set();
  let cur = rel;
  while (map.byNew.has(cur) && !seen.has(cur)) {
    seen.add(cur);
    cur = map.byNew.get(cur).old;
  }
  return cur;
}

/**
 * Resolves a cite's path through the map, before any exact or suffix tier. A path as written (`./`
 * stripped) that equals an old path, or whose citing-directory-relative form does, names the moved
 * file; a moved citing file is read relative to its pre-move folder. `exact` is true when today's
 * resolver would have called the match confident (a path with a slash, or the citing-directory-relative
 * form); a bare name written from another folder stays loose. Returns { chain, row, path, exact } or null.
 */
export function resolveMoved(map, pathRaw, citingRel) {
  if (map.rows.length === 0) return null;
  const p = pathRaw.replace(/^\.\//, '');
  const origin = originPath(map, citingRel);
  const slash = origin.lastIndexOf('/');
  const rel = path.posix.normalize((slash >= 0 ? origin.slice(0, slash + 1) : '') + p);
  const tries = [];
  if (p.includes('/')) tries.push([p, true]);
  tries.push([rel, true]);
  if (!p.includes('/')) tries.push([p, false]);
  for (const [cand, exact] of tries) {
    for (const c of HAS_EXT_RE.test(cand) ? [cand] : [cand, cand + '.md']) {
      const chain = chainFrom(map, c);
      if (chain.length) return { chain, row: chain[0], path: chain[chain.length - 1].new, exact };
    }
  }
  return null;
}

/** `git merge-base --is-ancestor a b`; an unreadable commit is not an ancestor. */
export function isAncestor(root, a, b) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', a, b], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** The path a cite to the moved file names at `rev`: the newest row whose move commit is an ancestor of rev, else the oldest old path. */
export function pathAtRev(root, hit, rev) {
  if (rev === 'HEAD') return hit.path;
  for (let i = hit.chain.length - 1; i >= 0; i--) if (isAncestor(root, hit.chain[i].commit, rev)) return hit.chain[i].new;
  return hit.chain[0].old;
}

/**
 * The post-move rule's question (OPEN-5 A): was the citing line written after the row's move? Blame runs
 * (`git blame --porcelain -L n,n`) only on citing files changed since the move commit or in the working
 * tree; a line is after the move when it is uncommitted or its commit has the move commit as an ancestor.
 * Results are cached per file.
 */
export function postMoveChecker(root) {
  const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });
  const changed = new Map();
  const blamed = new Map();
  const changedSince = (commit) => {
    if (!changed.has(commit)) {
      let out;
      try {
        out = git(['diff', '--name-only', '-z', commit, 'HEAD']) + git(['diff', '--name-only', '-z', 'HEAD']);
      } catch {
        throw new Error(`${MOVED_REL} names commit ${commit.slice(0, 12)}, which git cannot read here (a shallow clone?)`);
      }
      changed.set(commit, new Set(out.split('\0').filter(Boolean)));
    }
    return changed.get(commit);
  };
  const commitOfLine = (file, n) => {
    const key = `${file}\0${n}`;
    if (!blamed.has(key)) {
      let out;
      try {
        out = git(['blame', '--porcelain', '-L', `${n},${n}`, '--', file]);
      } catch {
        throw new Error(`git blame failed for ${file}:${n}`);
      }
      blamed.set(key, out.slice(0, 40));
    }
    return blamed.get(key);
  };
  return {
    writtenAfter(row, citingRel, line) {
      if (!changedSince(row.commit).has(citingRel)) return false;
      const sha = commitOfLine(citingRel, line);
      return /^0{40}$/.test(sha) || isAncestor(root, row.commit, sha);
    },
  };
}
