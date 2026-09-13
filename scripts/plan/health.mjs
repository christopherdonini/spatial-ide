#!/usr/bin/env node
// scripts/plan/health.mjs — writes site/data/health.json: the **machine facts** half of the
// landing page's health strip (AUTONOMY.md §5, §15). Node's standard library only.
//
// Machine facts only, and they say so (`source: "the custodian's machine"`): drift (runs
// verify.mjs in --offline mode and records pass/fail), disk free (PowerShell `(Get-PSDrive C).Free`
// on Windows, `df` elsewhere), stray processes (count of cargo, node, spatial-ide-shell processes
// — names only, never kills), waiting-on-human ages (from the plan's dates.opened). Timestamped.
//
// CI on main, open PRs and the latest release are NOT read here: they are build-time facts, read
// from GitHub's API inside the Pages build by buildHealth.mjs (the human, 2026-09-14: "read
// GitHub's API at Pages build time, not gh on the dev machine"). The strip renders the two groups
// separately, each with its own timestamp; no row ever mixes the two sources.
//
// Usage:
//   node scripts/plan/health.mjs [--plan <path>] [--out-dir <site-dir>]

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlan, deriveStates } from './plan.mjs';
import { runVerify } from './verify.mjs';

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

export const MACHINE_SOURCE_LABEL = "the custodian's machine";

/**
 * Assembles the full health.json payload — machine facts only. `disk_free`/`stray_processes`
 * accept a precomputed override, so tests can inject deterministic values instead of hitting the
 * real OS.
 */
export function buildHealthData(plan, opts = {}) {
  const { repoRoot, planPath, siteDir, now = new Date() } = opts;
  const driftResult = runVerify({ planPath, repoRoot, siteDir, offline: true }); // §6: verify runs --offline here
  return {
    generated_at: now.toISOString(),
    source: MACHINE_SOURCE_LABEL,
    drift: { ok: driftResult.ok, failures: driftResult.failures },
    disk_free: opts.disk ?? diskFree(),
    stray_processes: opts.strayProcesses ?? strayProcessCount(),
    waiting_on_human: computeWaitingAges(plan, { now }),
  };
}

function parseArgs(argv) {
  const args = { plan: null, outDir: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--plan') args.plan = argv[++i];
    else if (a === '--out-dir') args.outDir = argv[++i];
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
  const health = buildHealthData(plan, { repoRoot, planPath, siteDir });

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
