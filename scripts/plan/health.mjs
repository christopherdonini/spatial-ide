#!/usr/bin/env node
// scripts/plan/health.mjs — writes site/data/health.json (AUTONOMY.md §5's health strip, §15's
// "Daily health strip"). Node's standard library only.
//
// Fields: CI on main (the badge URL, and `gh run list --branch main --limit 1` conclusion when
// available), drift (runs verify.mjs in --offline mode and records pass/fail), disk free
// (PowerShell `(Get-PSDrive C).Free` on Windows, `df` elsewhere), stray processes (count of
// cargo, node, spatial-ide-shell processes — names only, never kills), open-PR ages
// (`gh pr list --json number,createdAt`), waiting-on-human ages (from the plan's dates.opened).
// Timestamped.
//
// Usage:
//   node scripts/plan/health.mjs [--plan <path>] [--out-dir <site-dir>] [--offline]

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlan, deriveStates } from './plan.mjs';
import { runVerify, ghRepoSlug } from './verify.mjs';
import { CI_BADGE_WORKFLOW } from './site.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

const STRAY_PROCESS_NAMES = ['cargo', 'node', 'spatial-ide-shell'];

/** PowerShell `(Get-PSDrive C).Free` on Windows, `df` elsewhere -- never throws. */
export function diskFree() {
  try {
    if (process.platform === 'win32') {
      const out = execFileSync('powershell', ['-NoProfile', '-Command', '(Get-PSDrive C).Free'], {
        encoding: 'utf8',
      }).trim();
      const bytes = Number(out);
      return Number.isFinite(bytes) ? { bytes, drive: 'C' } : { raw: out, drive: 'C' };
    }
    const out = execFileSync('df', ['-k', '.'], { encoding: 'utf8' });
    return { raw: out.trim() };
  } catch (e) {
    return { error: e.message };
  }
}

/** Count of cargo/node/spatial-ide-shell processes by name only -- never kills anything. */
export function strayProcessCount() {
  try {
    let names;
    if (process.platform === 'win32') {
      const out = execFileSync('tasklist', ['/FO', 'CSV', '/NH'], { encoding: 'utf8' });
      names = out
        .split(/\r?\n/)
        .map((line) => {
          const m = line.match(/^"([^"]+)"/);
          return m ? m[1].replace(/\.exe$/i, '').toLowerCase() : null;
        })
        .filter(Boolean);
    } else {
      const out = execFileSync('ps', ['-A', '-o', 'comm='], { encoding: 'utf8' });
      names = out
        .split(/\r?\n/)
        .map((l) => path.basename(l.trim()).toLowerCase())
        .filter(Boolean);
    }
    const byName = {};
    for (const target of STRAY_PROCESS_NAMES) {
      byName[target] = names.filter((n) => n === target.toLowerCase()).length;
    }
    const total = Object.values(byName).reduce((a, b) => a + b, 0);
    return { total, by_name: byName };
  } catch (e) {
    return { error: e.message };
  }
}

/** CI on main: the badge URL always; the latest run's conclusion when `gh` is reachable. */
export function ciInfo(repoRoot, slug, { offline = false } = {}) {
  const badgeUrl = slug
    ? `https://github.com/${slug}/actions/workflows/${CI_BADGE_WORKFLOW}/badge.svg?branch=main`
    : null;
  if (offline || !slug) {
    return { badge_url: badgeUrl, conclusion: null, note: offline ? 'offline: gh run list skipped' : 'no repo slug found' };
  }
  try {
    const out = execFileSync(
      'gh',
      ['run', 'list', '--branch', 'main', '--workflow', CI_BADGE_WORKFLOW, '--limit', '1', '--json', 'conclusion,status,headSha,createdAt'],
      { cwd: repoRoot, encoding: 'utf8' },
    );
    const runs = JSON.parse(out);
    const latest = runs[0] ?? null;
    return {
      badge_url: badgeUrl,
      conclusion: latest?.conclusion ?? null,
      status: latest?.status ?? null,
      head_sha: latest?.headSha ?? null,
      created_at: latest?.createdAt ?? null,
    };
  } catch (e) {
    return { badge_url: badgeUrl, conclusion: null, error: e.message };
  }
}

/** Open PRs and their ages, via `gh pr list --json number,createdAt`. */
export function openPrAges(repoRoot, { offline = false, now = new Date() } = {}) {
  if (offline) return { note: 'offline: gh pr list skipped', items: [] };
  try {
    const out = execFileSync('gh', ['pr', 'list', '--json', 'number,createdAt'], { cwd: repoRoot, encoding: 'utf8' });
    const prs = JSON.parse(out);
    return {
      items: prs.map((pr) => ({
        number: pr.number,
        created_at: pr.createdAt,
        age_days: Math.floor((now.getTime() - new Date(pr.createdAt).getTime()) / 86400000),
      })),
    };
  } catch (e) {
    return { error: e.message, items: [] };
  }
}

/** Waiting-on-human items with their age (from the plan's own dates.opened). */
export function computeWaitingAges(plan, { now = new Date() } = {}) {
  const { waitingOnHuman } = deriveStates(plan);
  return waitingOnHuman.map((n) => {
    const openedRaw = n.dates?.opened ?? null;
    const opened = openedRaw ? new Date(openedRaw) : null;
    const ageDays = opened && !Number.isNaN(opened.getTime()) ? Math.floor((now.getTime() - opened.getTime()) / 86400000) : null;
    return { id: n.id, kind: n.needs_human.kind, minutes: n.needs_human.minutes, opened: openedRaw, age_days: ageDays };
  });
}

/**
 * Assembles the full health.json payload. Every field beyond `generated_at`/`drift`/
 * `waiting_on_human` accepts a precomputed override, so tests can inject deterministic values
 * instead of hitting the real OS/gh.
 */
export function buildHealthData(plan, opts = {}) {
  const { repoRoot, planPath, siteDir, now = new Date(), offline = false, slug } = opts;
  const driftResult = runVerify({ planPath, repoRoot, siteDir, offline: true }); // §6: verify runs --offline here
  return {
    generated_at: now.toISOString(),
    ci: opts.ci ?? ciInfo(repoRoot, slug, { offline }),
    drift: { ok: driftResult.ok, failures: driftResult.failures },
    disk_free: opts.disk ?? diskFree(),
    stray_processes: opts.strayProcesses ?? strayProcessCount(),
    open_prs: opts.openPrs ?? openPrAges(repoRoot, { offline, now }),
    waiting_on_human: computeWaitingAges(plan, { now }),
  };
}

function parseArgs(argv) {
  const args = { plan: null, outDir: null, offline: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--plan') args.plan = argv[++i];
    else if (a === '--out-dir') args.outDir = argv[++i];
    else if (a === '--offline') args.offline = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const planPath = args.plan ?? path.join(REPO_ROOT, 'PLAN.yaml');
  const siteDir = args.outDir ?? path.join(path.dirname(planPath), 'site');
  const repoRoot = REPO_ROOT;

  const plan = loadPlan(planPath);
  const slug = ghRepoSlug(repoRoot);
  const health = buildHealthData(plan, { repoRoot, planPath, siteDir, offline: args.offline, slug });

  const outPath = path.join(siteDir, 'data', 'health.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(health, null, 2)}\n`, 'utf8');
  console.log(`wrote ${outPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
