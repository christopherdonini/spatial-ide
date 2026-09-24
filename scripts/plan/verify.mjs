#!/usr/bin/env node
// scripts/plan/verify.mjs — AUTONOMY.md §6, "the ADR-index pattern": plan statuses must agree
// with what the repo can verify, or CI fails. Exit 1 with every failure listed.
//
// 1. PLAN.yaml parses under the subset; ids unique; every depends_on/lane/phase exists; no
//    cycles (loadPlan's own validation, plan.mjs).
// 2. Status agreement: recorded ready/blocked equal the derivation; done has verifying evidence
//    (PR merged via `gh api`, ADR file Accepted, tag present, release present, commit on main,
//    tracked path present); felt_verdict done carries verdict.by "human" and a DECISIONS-PENDING
//    RULED cite that exists.
// 3. Generated files are current: regenerating CUSTODIAN-QUEUE.md/.json and site/ produces no
//    diff (the drift check queue.mjs/site.mjs already implement).
//
// --offline skips GitHub calls (PR merged-state, `gh release view`) and says so per finding.
// Node's standard library only.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlan, deriveStatusMap } from './plan.mjs';
import { checkQueueDrift } from './queue.mjs';
import { checkSiteDrift } from './site.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

function tryGit(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export function ghRepoSlug(repoRoot) {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  const url = tryGit(['remote', 'get-url', 'origin'], repoRoot);
  if (!url) return null;
  const m = url.match(/[:/]([^/:]+\/[^/]+?)(\.git)?$/);
  return m ? m[1] : null;
}

function ghApiPrMerged(repoRoot, slug, pr) {
  try {
    const out = execFileSync('gh', ['api', `repos/${slug}/pulls/${pr}`], { cwd: repoRoot, encoding: 'utf8' });
    const data = JSON.parse(out);
    return { ok: data.merged === true, detail: `state=${data.state} merged=${data.merged}` };
  } catch (e) {
    return { ok: false, detail: e.message };
  }
}

function ghReleaseView(repoRoot, name) {
  try {
    execFileSync('gh', ['release', 'view', name], { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'] });
    return true;
  } catch {
    return false;
  }
}

function gitTagExists(repoRoot, tag) {
  const out = tryGit(['tag', '--list', tag], repoRoot);
  return out === tag;
}

/**
 * "commit on main" (§6). Prefers `origin/main`; falls back to a local `main` when the remote ref
 * is absent (e.g. a checkout with no remote configured). When neither resolves, names the shallow
 * clone as the likely cause rather than reporting a false "not an ancestor" — actions/checkout@v4
 * defaults to a depth-1, tagless, branchless clone that has neither ref until `fetch-depth: 0` is
 * set (reviewer finding 1; CI run 34783672136 failed exactly this way).
 */
export function commitOnMain(repoRoot, commit) {
  const ref = ['origin/main', 'main'].find((candidate) => tryGit(['rev-parse', '--verify', candidate], repoRoot) !== null);
  if (!ref) {
    return {
      ok: false,
      reason: `neither origin/main nor main resolves (shallow clone: run with fetch-depth 0) — cannot check commit "${commit}"`,
    };
  }
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', commit, ref], { cwd: repoRoot, stdio: 'ignore' });
    return { ok: true, reason: null };
  } catch {
    return { ok: false, reason: `commit "${commit}" is not an ancestor of ${ref}` };
  }
}

function trackedPathExists(repoRoot, filePath) {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', filePath], { cwd: repoRoot, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const PATHSPEC_MAGIC_RE = /[*?[\]]|^:\(/;

// A node "gate" (AUTONOMY.md:44) must name one tracked regular file. `git ls-files
// --error-unmatch` accepts a directory, ".", or a glob and still exits 0 (each returns every
// contained/matched path), so a directory or glob gate would otherwise pass. This rejects
// pathspec magic up front and then requires exactly one matched path equal to the literal input.
function trackedGateFileExists(repoRoot, filePath) {
  if (typeof filePath !== 'string' || filePath === '' || path.isAbsolute(filePath) || PATHSPEC_MAGIC_RE.test(filePath)) {
    return false;
  }
  try {
    const out = execFileSync('git', ['ls-files', '--error-unmatch', '--', filePath], { cwd: repoRoot, encoding: 'utf8' });
    const matches = out.split('\n').filter(Boolean);
    return matches.length === 1 && matches[0] === filePath;
  } catch {
    return false;
  }
}

const ADR_STATUS_LINE_RE = /^(?:\*\*Status:\*\*|Status:)(.*)$/m;

export function adrStatusAccepted(repoRoot, adrId) {
  const dir = path.join(repoRoot, 'docs', 'adr');
  if (!fs.existsSync(dir)) return { ok: false, reason: 'docs/adr does not exist' };
  const file = fs.readdirSync(dir).find((f) => f === `${adrId}.md` || f.startsWith(`${adrId}-`));
  if (!file) return { ok: false, reason: `no file for ${adrId} in docs/adr` };
  const text = fs.readFileSync(path.join(dir, file), 'utf8');
  const m = text.match(ADR_STATUS_LINE_RE);
  if (!m) return { ok: false, reason: `${file} has no Status line` };
  const statusText = m[1].trim();
  const ok = /Accepted/.test(statusText);
  return { ok, reason: ok ? null : `${file}'s Status line does not read Accepted: "${statusText}"` };
}

export function verdictCiteExists(repoRoot, cite) {
  const prefix = 'DECISIONS-PENDING.md ';
  // A felt verdict is recorded verbatim either in a DECISIONS-PENDING RULED block or, for a
  // release's sitting results, in that release's record (`RELEASE-<version>.md Amendment N`,
  // where the human's walkthrough verdicts were quoted verbatim before the plan existed).
  const rel = typeof cite === 'string' ? /^(RELEASE-[0-9][^ ]*\.md) Amendment (\d+)\b/.exec(cite) : null;
  if (rel) {
    const rp = path.join(repoRoot, rel[1]);
    if (!fs.existsSync(rp)) return { ok: false, reason: `verdict.cite "${cite}": ${rel[1]} does not exist` };
    const text = fs.readFileSync(rp, 'utf8');
    const has = new RegExp('Amendment ' + rel[2] + '(?![0-9])').test(text);
    return has ? { ok: true, reason: null } : { ok: false, reason: `verdict.cite "${cite}": Amendment ${rel[2]} not found in ${rel[1]}` };
  }
  if (typeof cite !== 'string' || !cite.startsWith(prefix)) {
    return { ok: false, reason: `verdict.cite "${cite}" does not start with "DECISIONS-PENDING.md " or "RELEASE-<version>.md Amendment N"` };
  }
  const needle = cite.slice(prefix.length);
  const p = path.join(repoRoot, 'DECISIONS-PENDING.md');
  if (!fs.existsSync(p)) return { ok: false, reason: 'DECISIONS-PENDING.md does not exist' };
  const text = fs.readFileSync(p, 'utf8');
  const ok = text.includes(needle);
  return { ok, reason: ok ? null : `DECISIONS-PENDING.md does not contain "${needle}"` };
}

/** Verifies one node's evidence pointer. Returns an array of failure strings (empty = verified). */
export function verifyEvidence(node, { repoRoot, offline, slug }) {
  const evidence = node.evidence;
  const tag = `node "${node.id}"`;
  if (evidence === null || evidence === undefined) {
    return [`${tag}: status is done but evidence is missing`];
  }

  if (evidence.pr !== undefined) {
    if (offline) return []; // skipped, not failed -- the top-level --offline note covers this
    if (!slug) return [`${tag}: evidence {pr: ${evidence.pr}} could not be checked (no repo slug found)`];
    const result = ghApiPrMerged(repoRoot, slug, evidence.pr);
    return result.ok ? [] : [`${tag}: PR #${evidence.pr} is not merged (${result.detail})`];
  }
  if (evidence.adr !== undefined) {
    const result = adrStatusAccepted(repoRoot, evidence.adr);
    return result.ok ? [] : [`${tag}: ${result.reason}`];
  }
  if (evidence.tag !== undefined) {
    return gitTagExists(repoRoot, evidence.tag) ? [] : [`${tag}: git tag "${evidence.tag}" does not exist`];
  }
  if (evidence.release !== undefined) {
    if (offline) return []; // skipped, not failed -- the top-level --offline note covers this
    return ghReleaseView(repoRoot, evidence.release)
      ? []
      : [`${tag}: release "${evidence.release}" was not found (gh release view)`];
  }
  if (evidence.commit !== undefined) {
    const result = commitOnMain(repoRoot, evidence.commit);
    return result.ok ? [] : [`${tag}: ${result.reason}`];
  }
  if (evidence.path !== undefined) {
    const [filePath] = evidence.path.split('#');
    return trackedPathExists(repoRoot, filePath) ? [] : [`${tag}: path "${filePath}" is not a tracked file`];
  }
  if (evidence.log !== undefined) {
    // §1: "a pointer into an untracked directory does not verify" -- the log must be archived (§12).
    return trackedPathExists(repoRoot, evidence.log)
      ? []
      : [`${tag}: log "${evidence.log}" is not a tracked (archived, §12) path`];
  }
  if (evidence.branch !== undefined) {
    return [`${tag}: {branch: ...} is in-progress evidence, not a valid "done" evidence pointer`];
  }
  return [`${tag}: evidence has no recognized pointer shape (${JSON.stringify(evidence)})`];
}

/** Runs every §6 check against an already-loaded plan. Returns an array of failure strings. */
export function verifyStatusAgreement(plan, { repoRoot, offline, slug }) {
  const failures = [];
  const derived = deriveStatusMap(plan);

  for (const node of plan.nodes) {
    if (derived.has(node.id) && derived.get(node.id) !== node.status) {
      failures.push(
        `node "${node.id}": recorded status "${node.status}" does not agree with the derivation ("${derived.get(node.id)}")`,
      );
    }

    // The gate field (AUTONOMY.md:44) names a preregistration path, or "none" for docs nodes.
    // plan.mjs only checks the field is a non-empty string; a path that names a file only present
    // on the node's own branch (not on the tree being verified), or a directory/glob pathspec
    // rather than one file, must fail here, or a node can be set in-progress/ready against a
    // preregistration nobody can actually read (found by the record-round-count gate, 2026-09-18).
    if ((node.status === 'in-progress' || node.status === 'ready') && node.gate !== 'none') {
      if (!trackedGateFileExists(repoRoot, node.gate)) {
        failures.push(`node "${node.id}": gate "${node.gate}" is not a tracked file`);
      }
    }

    if (node.status === 'done') {
      failures.push(...verifyEvidence(node, { repoRoot, offline, slug }));
      if (node.felt_verdict === true) {
        const verdict = node.verdict;
        if (!verdict || verdict.by !== 'human' || !verdict.cite) {
          failures.push(`node "${node.id}": felt_verdict done requires verdict.by "human" and a verdict.cite`);
        } else {
          const result = verdictCiteExists(repoRoot, verdict.cite);
          if (!result.ok) failures.push(`node "${node.id}": ${result.reason}`);
        }
      }
    }
  }

  return failures;
}

function parseArgs(argv) {
  const args = { plan: null, siteDir: null, offline: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--plan') args.plan = argv[++i];
    else if (a === '--site-dir') args.siteDir = argv[++i];
    else if (a === '--offline') args.offline = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

export function runVerify({ planPath, repoRoot, siteDir, offline }) {
  const failures = [];
  const notes = [];
  if (offline) notes.push('--offline: PR-merged and release-published checks were skipped.');

  let plan;
  try {
    plan = loadPlan(planPath);
  } catch (e) {
    return { ok: false, failures: [e.message], notes };
  }

  const slug = ghRepoSlug(repoRoot);
  failures.push(...verifyStatusAgreement(plan, { repoRoot, offline, slug }));

  const queueDrift = checkQueueDrift({ planPath, outDir: path.dirname(planPath) });
  if (!queueDrift.ok) failures.push(...queueDrift.problems.map((p) => `queue drift: ${p}`));

  const resolvedSiteDir = siteDir ?? path.join(path.dirname(planPath), 'site');
  const siteDrift = checkSiteDrift({ planPath, outDir: resolvedSiteDir, repoSlug: slug ?? undefined });
  if (!siteDrift.ok) failures.push(...siteDrift.problems.map((p) => `site drift: ${p}`));

  return { ok: failures.length === 0, failures, notes };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const planPath = args.plan ?? path.join(REPO_ROOT, 'PLAN.yaml');
  const repoRoot = REPO_ROOT;
  const { ok, failures, notes } = runVerify({ planPath, repoRoot, siteDir: args.siteDir, offline: args.offline });

  for (const n of notes) console.error(n);
  if (!ok) {
    console.error(`verify:plan FAIL — ${failures.length} issue(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exitCode = 1;
    return;
  }
  console.log(`verify:plan PASS — ${planPath} agrees with the repository.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
