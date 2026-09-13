#!/usr/bin/env node
// scripts/plan/docsOnly.mjs <base> <head>
//
// AUTONOMY.md §9's mechanical docs-only verdict: a PR the custodian may merge itself. Verifies
// MECHANICALLY that every changed path between <base> and <head> is documentation (*.md anywhere,
// docs/**, site/** generated, CUSTODIAN-QUEUE.*), that no ADR Status line changes, that no code
// path changes (*.rs *.ts *.tsx *.mjs *.js *.json *.yml *.yaml *.toml *.html *.css, Cargo.lock,
// lockfiles) -- except the one named exception, PLAN.yaml itself, which may change docs-only PR
// but only if it changes no lane priority and no felt_verdict node's status.
//
// This script does NOT check CI or drift -- §9 also requires "CI and the drift checks are
// green", which is the custodian's own separate check before calling this one.
//
// Exit 0: docs-only, safe to merge under delegation. Exit 1: the offending paths are listed.
// Node's standard library only.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseYamlSubset } from './yamlSubset.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

const CODE_EXTENSIONS = new Set([
  '.rs',
  '.ts',
  '.tsx',
  '.mjs',
  '.js',
  '.json',
  '.yml',
  '.yaml',
  '.toml',
  '.html',
  '.css',
]);
const LOCKFILE_NAMES = new Set([
  'Cargo.lock',
  'package-lock.json',
  'npm-shrinkwrap.json',
  'pnpm-lock.yaml',
  'yarn.lock',
]);
const NAMED_EXCEPTIONS = new Set(['PLAN.yaml', 'CUSTODIAN-QUEUE.json']);
const STATUS_LINE_RE = /^(?:\*\*Status:\*\*|Status:)(.*)$/m;

function gitDiffNames(repoRoot, base, head) {
  const out = execFileSync('git', ['diff', '--name-only', `${base}`, `${head}`], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return out.split('\n').map((l) => l.trim()).filter(Boolean);
}

function gitShow(repoRoot, ref, filePath) {
  try {
    return execFileSync('git', ['show', `${ref}:${filePath}`], { cwd: repoRoot, encoding: 'utf8' });
  } catch {
    return null; // does not exist at that ref (added, or deleted)
  }
}

function isDocumentationPath(p) {
  if (p.endsWith('.md')) return true;
  if (p.startsWith('docs/')) return true;
  if (p.startsWith('site/')) return true; // generated
  if (p === 'CUSTODIAN-QUEUE.md' || p === 'CUSTODIAN-QUEUE.json') return true;
  if (p === 'PLAN.yaml') return true; // subject to its own extra check below
  return false;
}

function isCodePath(p) {
  const base = path.basename(p);
  if (LOCKFILE_NAMES.has(base)) return true;
  const ext = path.extname(p);
  return CODE_EXTENSIONS.has(ext);
}

/** Reports offending paths and reasons for <base>..<head> in repoRoot. Pure, no process.exit. */
export function checkDocsOnly(repoRoot, base, head) {
  const offending = [];
  const changed = gitDiffNames(repoRoot, base, head);

  for (const p of changed) {
    const doc = isDocumentationPath(p);
    const code = isCodePath(p);
    const exempted = NAMED_EXCEPTIONS.has(p) || p.startsWith('site/');
    if (!doc) {
      offending.push(`${p}: not a documentation path`);
      continue;
    }
    if (code && !exempted) {
      offending.push(`${p}: a code path (${path.extname(p) || path.basename(p)})`);
      continue;
    }
  }

  // No ADR Status line changes, for any touched ADR file.
  for (const p of changed) {
    if (!(p.startsWith('docs/adr/') && p.endsWith('.md'))) continue;
    const baseText = gitShow(repoRoot, base, p);
    const headText = gitShow(repoRoot, head, p);
    if (baseText === null || headText === null) {
      offending.push(`${p}: ADR added or deleted — not a mechanical docs-only change`);
      continue;
    }
    const baseStatus = baseText.match(STATUS_LINE_RE)?.[1]?.trim();
    const headStatus = headText.match(STATUS_LINE_RE)?.[1]?.trim();
    if (baseStatus !== headStatus) {
      offending.push(`${p}: ADR Status line changed ("${baseStatus}" -> "${headStatus}")`);
    }
  }

  // PLAN.yaml: no lane priority change, no felt_verdict node's status change.
  if (changed.includes('PLAN.yaml')) {
    const baseText = gitShow(repoRoot, base, 'PLAN.yaml');
    const headText = gitShow(repoRoot, head, 'PLAN.yaml');
    if (baseText === null || headText === null) {
      offending.push('PLAN.yaml: added or deleted — not a mechanical docs-only change');
    } else {
      try {
        const basePlan = parseYamlSubset(baseText, `${base}:PLAN.yaml`);
        const headPlan = parseYamlSubset(headText, `${head}:PLAN.yaml`);
        offending.push(...diffPlanForDelegationLimits(basePlan, headPlan));
      } catch (e) {
        offending.push(`PLAN.yaml: could not be parsed for the delegation check (${e.message})`);
      }
    }
  }

  return offending;
}

function diffPlanForDelegationLimits(basePlan, headPlan) {
  const offending = [];
  const baseLanes = new Map((basePlan.lanes ?? []).map((l) => [l.id, l]));
  for (const lane of headPlan.lanes ?? []) {
    const before = baseLanes.get(lane.id);
    if (before && before.priority !== lane.priority) {
      offending.push(
        `PLAN.yaml: lane "${lane.id}" priority changed (${before.priority} -> ${lane.priority}) — only the human changes lane priorities`,
      );
    }
  }
  const baseNodes = new Map((basePlan.nodes ?? []).map((n) => [n.id, n]));
  for (const node of headPlan.nodes ?? []) {
    const before = baseNodes.get(node.id);
    if (!before) continue;
    const feltEither = before.felt_verdict === true || node.felt_verdict === true;
    if (feltEither && before.status !== node.status) {
      offending.push(
        `PLAN.yaml: node "${node.id}" (felt_verdict) status changed (${before.status} -> ${node.status}) — only the human marks a felt-verdict node done`,
      );
    }
  }
  return offending;
}

function main() {
  const [base, head] = process.argv.slice(2);
  if (!base || !head) {
    console.error('usage: node scripts/plan/docsOnly.mjs <base> <head>');
    process.exitCode = 1;
    return;
  }
  const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: here,
    encoding: 'utf8',
  }).trim();

  const offending = checkDocsOnly(repoRoot, base, head);
  if (offending.length > 0) {
    console.error(`docsOnly: NOT eligible for delegation (${offending.length} offending path(s)):`);
    for (const o of offending) console.error(`  - ${o}`);
    process.exitCode = 1;
    return;
  }
  console.log(`docsOnly: eligible for delegation — ${base}..${head} is mechanically docs-only.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
