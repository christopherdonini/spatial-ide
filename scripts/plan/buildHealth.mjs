#!/usr/bin/env node
// scripts/plan/buildHealth.mjs — the build-time half of the landing page's health strip
// (AUTONOMY.md §5, §15). The human, 2026-09-14: read GitHub's API at Pages build time, not `gh`
// on the dev machine. Machine facts (disk, stray processes, drift) stay in health.mjs, on their
// own dated line; nothing here mixes with them.
//
// Three facts, read with Node's global fetch (standard library only — no dependency):
//   ci             — the latest product-ci workflow run on main (conclusion, status, sha, url)
//   open_prs       — open pull requests: count and the oldest one's age
//   latest_release — the newest published release, pre-releases included (the list endpoint, not
//                    releases/latest, which excludes them; null when there is none)
//
// A fact that cannot be read carries {error: "<HTTP status or message>"} and the page renders
// that text — never a bare "unknown". Each fact records whether it was read with the token or
// anonymously (`auth`): the repository is public, so a 403 with a token is retried once without
// one, which keeps a narrowly-scoped Actions token from blanking the strip.
//
// Output: site/data/build-health.json — generated only inside the Pages build, never committed
// (.gitignore). site.mjs reads it when present; its drift check never does.
//
// Usage:
//   node scripts/plan/buildHealth.mjs [--out-dir <site-dir>] [--repo owner/name]
//
// Exit 0 even when facts carry errors (the page reports them); exit 1 only on a write failure or
// a bad argument.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ghRepoSlug } from './verify.mjs';
import { PRODUCT_CI_WORKFLOWS } from './site.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

const API_BASE = 'https://api.github.com';
const USER_AGENT = 'spatial-ide-plan-tooling (scripts/plan/buildHealth.mjs)';

export const SOURCE_LABEL = 'GitHub API at Pages build time';

function apiHeaders(token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': USER_AGENT,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function isOk(res) {
  return typeof res.status === 'number' && res.status >= 200 && res.status < 300;
}

/**
 * One GET. Returns {body, auth} on success, {notFound: true, auth} on 404, {error, auth}
 * otherwise. A 403 answered to a token is retried once anonymously (the repository is public).
 */
async function apiGet(fetchImpl, url, token) {
  let auth = token ? 'token' : 'anonymous';
  let res;
  try {
    res = await fetchImpl(url, { headers: apiHeaders(token) });
  } catch (e) {
    return { error: e.message, auth };
  }
  if (res.status === 403 && token) {
    auth = 'anonymous';
    try {
      res = await fetchImpl(url, { headers: apiHeaders(null) });
    } catch (e) {
      return { error: e.message, auth };
    }
  }
  if (res.status === 404) return { notFound: true, auth };
  if (!isOk(res)) {
    const status = res.statusText ? `HTTP ${res.status} ${res.statusText}` : `HTTP ${res.status}`;
    return { error: status, auth };
  }
  try {
    return { body: await res.json(), auth };
  } catch (e) {
    return { error: `invalid JSON in the response: ${e.message}`, auth };
  }
}

// A failing terminal conclusion. Any of these on any product workflow makes the suite red.
const FAILING_CONCLUSIONS = new Set(['failure', 'timed_out', 'startup_failure', 'cancelled', 'action_required']);

/** The latest run of one workflow on main. */
async function oneWorkflowRun(fetchImpl, slug, token, workflow) {
  const url = `${API_BASE}/repos/${slug}/actions/workflows/${encodeURIComponent(workflow)}/runs?branch=main&per_page=1`;
  const r = await apiGet(fetchImpl, url, token);
  if (r.error) return { workflow, error: r.error, auth: r.auth };
  if (r.notFound) return { workflow, error: 'HTTP 404 (no such workflow on this repository)', auth: r.auth };
  const run = (r.body?.workflow_runs ?? [])[0] ?? null;
  if (!run) {
    return { workflow, auth: r.auth, conclusion: null, status: null, head_sha: null, created_at: null, html_url: null, note: 'no run on main yet' };
  }
  return {
    workflow,
    auth: r.auth,
    conclusion: run.conclusion ?? null,
    status: run.status ?? null,
    head_sha: run.head_sha ?? null,
    created_at: run.created_at ?? null,
    html_url: run.html_url ?? null,
  };
}

/**
 * "CI on main" across the WHOLE product suite (PRODUCT_CI_WORKFLOWS), not one workflow. Reading a
 * single workflow was a false-green hazard: the strip once reported CI "success" (product-ci-rust)
 * while product-ci-shell was red. A red on ANY product workflow is a red for the suite. The
 * aggregate `conclusion` is the worst of the three; `workflows` carries the per-workflow detail so
 * the strip can name which one is red. Top-level fields point at the representative run (the first
 * failing one, else the newest), keeping the pre-composite fields (`conclusion`, `html_url`, ...)
 * populated for any older reader.
 */
export async function ciFact(fetchImpl, slug, token) {
  const workflows = [];
  for (const wf of PRODUCT_CI_WORKFLOWS) {
    // Sequential, not Promise.all: apiGet's own 403-anonymous retry already keeps this cheap, and a
    // handful of serial GETs at Pages-build time is not worth the concurrency surface.
    workflows.push(await oneWorkflowRun(fetchImpl, slug, token, wf));
  }

  const failing = workflows.filter((w) => FAILING_CONCLUSIONS.has(w.conclusion));
  const errored = workflows.filter((w) => w.error);
  const running = workflows.filter((w) => !w.error && w.conclusion == null && w.status && w.status !== 'completed');
  const noRun = workflows.filter((w) => !w.error && w.conclusion == null && (!w.status || w.status === 'completed'));
  const succeeded = workflows.filter((w) => w.conclusion === 'success');

  let conclusion;
  if (failing.length > 0) conclusion = 'failure';
  else if (errored.length > 0) conclusion = 'unknown'; // cannot claim success while a workflow is unreadable
  else if (running.length > 0) conclusion = 'in_progress';
  else if (noRun.length > 0) conclusion = null; // has a run for some, none for others
  else if (succeeded.length === workflows.length) conclusion = 'success';
  // A non-success terminal that is not itself failing (neutral/skipped/stale). The `?? 'unknown'`
  // tail is unreachable given the filters above, but it must NEVER default to 'success' — success is
  // only ever set when every workflow succeeded.
  else conclusion = workflows.find((w) => w.conclusion !== 'success')?.conclusion ?? 'unknown';

  // Representative run for the top-level convenience fields: the first failing one (so a reader that
  // only looks at html_url still lands on the red run), else the newest by created_at.
  const rep =
    failing[0] ??
    [...workflows]
      .filter((w) => w.created_at)
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0] ??
    workflows[0];

  const auths = new Set(workflows.map((w) => w.auth));
  return {
    auth: auths.size === 1 ? [...auths][0] : 'mixed',
    conclusion,
    status: rep?.status ?? null,
    head_sha: rep?.head_sha ?? null,
    created_at: rep?.created_at ?? null,
    html_url: rep?.html_url ?? null,
    workflows,
    ...(errored.length === workflows.length ? { error: errored[0].error } : {}),
  };
}

/** Open PRs: how many, and the oldest one's age in days. */
export async function openPrsFact(fetchImpl, slug, token, now) {
  const url = `${API_BASE}/repos/${slug}/pulls?state=open&per_page=100`;
  const r = await apiGet(fetchImpl, url, token);
  if (r.error) return { error: r.error, auth: r.auth };
  if (r.notFound) return { error: 'HTTP 404 (no such repository)', auth: r.auth };
  const prs = Array.isArray(r.body) ? r.body : [];
  let oldest = null;
  for (const pr of prs) {
    if (!oldest || String(pr.created_at ?? '') < String(oldest.created_at ?? '')) oldest = pr;
  }
  const created = oldest ? new Date(oldest.created_at) : null;
  return {
    auth: r.auth,
    count: prs.length,
    oldest: oldest
      ? {
          number: oldest.number ?? null,
          created_at: oldest.created_at ?? null,
          age_days:
            created && !Number.isNaN(created.getTime())
              ? Math.floor((now.getTime() - created.getTime()) / 86400000)
              : null,
          html_url: oldest.html_url ?? null,
        }
      : null,
  };
}

/**
 * The latest published release, or null when the repository has none.
 *
 * The list endpoint, not `releases/latest`: GitHub's "latest" excludes pre-releases, and this
 * repository's only release (v0.1.0, published 2026-09-13) IS one — `releases/latest` answers 404
 * and the page would say "none published", which is false. The list is newest first and includes
 * pre-releases; drafts are skipped (they are not published). HTTP 404 still means null: a
 * repository with releases disabled has none either.
 */
export async function latestReleaseFact(fetchImpl, slug, token) {
  const url = `${API_BASE}/repos/${slug}/releases?per_page=5`;
  const r = await apiGet(fetchImpl, url, token);
  if (r.notFound) return null; // a repository with no releases is not an error
  if (r.error) return { error: r.error, auth: r.auth };
  const releases = Array.isArray(r.body) ? r.body : [];
  const latest = releases.find((rel) => rel && rel.draft === false) ?? null;
  if (!latest) return null;
  return {
    auth: r.auth,
    tag_name: latest.tag_name ?? null,
    published_at: latest.published_at ?? null,
    html_url: latest.html_url ?? null,
    prerelease: latest.prerelease === true,
  };
}

/** The whole payload. `fetch` is injectable so tests never touch the network. */
export async function buildHealthData({ fetch: fetchImpl = globalThis.fetch, now = new Date(), slug, token = null } = {}) {
  if (!slug) {
    throw new Error('buildHealth.mjs: no repository slug — set GITHUB_REPOSITORY or pass --repo owner/name');
  }
  if (typeof fetchImpl !== 'function') {
    throw new Error('buildHealth.mjs: no fetch available (Node 18+ provides it globally)');
  }
  const ci = await ciFact(fetchImpl, slug, token);
  const openPrs = await openPrsFact(fetchImpl, slug, token, now);
  const latestRelease = await latestReleaseFact(fetchImpl, slug, token);
  return {
    built_at: now.toISOString(),
    source: SOURCE_LABEL,
    repo: slug,
    ci,
    open_prs: openPrs,
    latest_release: latestRelease,
  };
}

/**
 * The lines the CLI prints. Exported so a test can assert mechanically that the token appears in
 * neither the payload nor the log — the only two places this script could leak it.
 */
/** The CI line for the log: the suite conclusion, plus the names of any non-green workflows. */
function ciSummary(ci) {
  if (ci.error && !Array.isArray(ci.workflows)) return ci.error;
  const overall = ci.conclusion ?? ci.note ?? 'null';
  if (!Array.isArray(ci.workflows)) return overall;
  const notGreen = ci.workflows.filter((w) => w.conclusion !== 'success');
  if (notGreen.length === 0) return `${overall} (${ci.workflows.length}/${ci.workflows.length} green)`;
  const named = notGreen.map((w) => `${w.workflow}=${w.error ? 'unreadable' : (w.conclusion ?? w.status ?? w.note ?? 'unknown')}`);
  return `${overall} [${named.join(', ')}]`;
}

export function summaryLines(data) {
  return [
    `  ci: ${ciSummary(data.ci)} (read ${data.ci.auth})`,
    `  open PRs: ${data.open_prs.error ?? data.open_prs.count} (read ${data.open_prs.auth})`,
    `  latest release: ${
      data.latest_release === null
        ? 'none published'
        : (data.latest_release.error ??
          `${data.latest_release.tag_name}${data.latest_release.prerelease ? ' (pre-release)' : ''}`)
    }`,
  ];
}

function parseArgs(argv) {
  const args = { outDir: null, repo: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out-dir') args.outDir = argv[++i];
    else if (a === '--repo') args.repo = argv[++i];
    else throw new Error(`unknown argument: ${a}`);
  }
  if (args.outDir === undefined || args.repo === undefined) throw new Error('an option is missing its value');
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = args.outDir ?? path.join(REPO_ROOT, 'site');
  const slug = args.repo ?? process.env.GITHUB_REPOSITORY ?? ghRepoSlug(REPO_ROOT);
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null;

  const data = await buildHealthData({ slug, token });

  const outPath = path.join(outDir, 'data', 'build-health.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`wrote ${outPath}`);
  for (const line of summaryLines(data)) console.log(line);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
}
