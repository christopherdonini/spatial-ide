#!/usr/bin/env node
// scripts/plan/health.mjs — writes site/data/health.json: the **machine facts** half of the
// landing page's health strip (AUTONOMY.md §5, §15). Node's standard library only.
//
// Machine facts only, and they say so (`source: "the custodian's machine"`): drift (runs
// verify.mjs in --offline mode and records pass/fail), disk free (PowerShell `(Get-PSDrive C).Free`
// and D on Windows — both drives, the human 2026-09-14 "the health strip reports both drives"; `df`
// elsewhere), stray processes (count of cargo, node, spatial-ide-shell processes — names only,
// never kills), waiting-on-human ages (from the plan's dates.opened). Two governance metrics (the
// human 2026-09-14: "median ready->done hours and gate first-pass rate"): median opened->done
// (the plan carries dates, not timestamps, so this is DAY resolution, and is labelled as such — it
// is NOT hours, and is not stored under an "hours" name that would misstate it) and the gate
// first-pass rate (from state/gate-log.json, a tracked custodian-appended log). Timestamped.
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

// Drives reported on Windows. D: is optional: if it is absent, it is omitted (not an error) —
// `Get-PSDrive -ErrorAction SilentlyContinue` returns nothing for a drive that does not exist.
const WINDOWS_DRIVES = ['C', 'D'];

/**
 * Disk free, per drive. On Windows, `(Get-PSDrive <n>).Free` and `.Used + .Free` for each of C:
 * and D: (the human, 2026-09-14: "the health strip reports both drives"); a drive that is not
 * present is omitted, never an error. Elsewhere, the repo filesystem's `df` line, unchanged.
 * Shape: `{ drives: [{drive, bytes, total}, ...] }` on Windows, `{ raw }` on `df`, `{ error }` on
 * failure. Never throws.
 */
export function diskFree() {
  try {
    if (process.platform === 'win32') {
      // One PowerShell call lists every present drive as "<name>\t<free>\t<total>"; an absent
      // drive contributes no line (SilentlyContinue), so D: simply drops out on machines without it.
      const script = WINDOWS_DRIVES.map(
        (n) =>
          `$d=Get-PSDrive ${n} -ErrorAction SilentlyContinue; if ($d) { "${n}\`t$($d.Free)\`t$($d.Used + $d.Free)" }`,
      ).join('; ');
      const out = execFileSync('powershell', ['-NoProfile', '-Command', script], {
        encoding: 'utf8',
      }).trim();
      const drives = [];
      for (const line of out.split(/\r?\n/)) {
        const [drive, freeStr, totalStr] = line.split('\t');
        if (!drive) continue;
        const bytes = Number(freeStr);
        const total = Number(totalStr);
        drives.push({
          drive,
          bytes: Number.isFinite(bytes) ? bytes : null,
          total: Number.isFinite(total) ? total : null,
        });
      }
      return { drives };
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

/**
 * Median opened->done over `done` nodes that carry BOTH `dates.opened` and `dates.done`. Pure.
 *
 * The plan records DATES, not timestamps, so the difference is whole (or half, when the count is
 * even) days and is reported that way — labelled "day resolution". The human asked for "median
 * ready->done hours"; the plan has no finer source than a date, and inventing one would be a
 * fabricated number, so this reports opened->done in days and says exactly that. `days` is null
 * when no node qualifies.
 */
export function medianOpenedToDone(plan) {
  const dayMs = 86400000;
  const diffs = [];
  for (const node of plan?.nodes ?? []) {
    if (node.status !== 'done') continue;
    const opened = node.dates?.opened;
    const done = node.dates?.done;
    if (!opened || !done) continue;
    const ot = Date.parse(`${opened}T00:00:00Z`);
    const dt = Date.parse(`${done}T00:00:00Z`);
    if (Number.isNaN(ot) || Number.isNaN(dt)) continue;
    diffs.push((dt - ot) / dayMs);
  }
  diffs.sort((a, b) => a - b);
  const n = diffs.length;
  if (n === 0) return { days: null, n: 0 };
  const mid = Math.floor(n / 2);
  const median = n % 2 === 1 ? diffs[mid] : (diffs[mid - 1] + diffs[mid]) / 2;
  return { days: median, n };
}

/**
 * Gate first-pass rate over a gate log (array of `{node, gate, attempt, verdict, date}`). Pure.
 *
 * For each node, its FIRST recorded gate attempt across all of that node's gates — earliest by
 * date, then by attempt, then by log order — decides: the node "passed first" iff that first
 * attempt's verdict is "PASS". Rate = (# nodes that passed first) / (# nodes with any record);
 * null when the log is empty. Reports the N alongside, never a bare rate.
 */
export function gateFirstPassRate(log) {
  const entries = Array.isArray(log) ? log : [];
  const firstByNode = new Map(); // node -> {entry, index}
  const rank = (e, i) => [e.date ?? '', typeof e.attempt === 'number' ? e.attempt : Infinity, i];
  const earlier = (a, b) => {
    for (let k = 0; k < a.length; k++) {
      if (a[k] < b[k]) return true;
      if (a[k] > b[k]) return false;
    }
    return false;
  };
  entries.forEach((e, i) => {
    if (!e || typeof e.node !== 'string') return;
    const prev = firstByNode.get(e.node);
    if (!prev || earlier(rank(e, i), rank(prev.entry, prev.index))) {
      firstByNode.set(e.node, { entry: e, index: i });
    }
  });
  const nodes = firstByNode.size;
  const firstPass = [...firstByNode.values()].filter(({ entry }) => entry.verdict === 'PASS').length;
  return { nodes, first_pass: firstPass, rate: nodes === 0 ? null : firstPass / nodes };
}

export const GATE_LOG_PATH = path.join(REPO_ROOT, 'state', 'gate-log.json');

/**
 * Reads `state/gate-log.json`. Returns `null` when the file is ABSENT (the strip then says "no gate
 * log yet"); an array (possibly empty) when present; and a `[]` for a present-but-corrupt file so
 * one bad edit degrades to "no records", never a thrown build.
 */
export function readGateLog(logPath = GATE_LOG_PATH) {
  if (!fs.existsSync(logPath)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const MACHINE_SOURCE_LABEL = "the custodian's machine";

/**
 * Assembles the full health.json payload — machine facts only. `disk_free`/`stray_processes`
 * accept a precomputed override, so tests can inject deterministic values instead of hitting the
 * real OS; `gateLog` accepts a precomputed log (or explicit `null` for "absent") likewise.
 */
export function buildHealthData(plan, opts = {}) {
  const { repoRoot, planPath, siteDir, now = new Date() } = opts;
  const driftResult = runVerify({ planPath, repoRoot, siteDir, offline: true }); // §6: verify runs --offline here
  const gateLog = opts.gateLog !== undefined ? opts.gateLog : readGateLog();
  const gateFirstPass = gateLog === null ? { present: false } : { present: true, ...gateFirstPassRate(gateLog) };
  return {
    generated_at: now.toISOString(),
    source: MACHINE_SOURCE_LABEL,
    drift: { ok: driftResult.ok, failures: driftResult.failures },
    disk_free: opts.disk ?? diskFree(),
    stray_processes: opts.strayProcesses ?? strayProcessCount(),
    waiting_on_human: computeWaitingAges(plan, { now }),
    median_opened_to_done: medianOpenedToDone(plan),
    gate_first_pass: gateFirstPass,
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
