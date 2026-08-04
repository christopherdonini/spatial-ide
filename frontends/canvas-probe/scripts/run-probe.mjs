#!/usr/bin/env node
/**
 * Drives the probe in a real Chromium/WebView2-class browser and captures its record.
 *
 * Why a driver at all: the in-process Rust tests already pin every hard requirement, but they run a
 * Rust client. The one thing only a browser exercises is the receive path the bake-off's N=2
 * mechanism diagnostic could only reach "by elimination" (§20.8) — so this exists to put the real
 * consumer in front of the real payload shape, not to produce a benchmark.
 *
 * Everything it records is **hypothesis-forming, within-session, and not citable in ADR-012**.
 *
 * Usage:
 *   node scripts/run-probe.mjs --url "http://127.0.0.1:PORT/#TOKEN" [--out ../../target/slice-evidence/canvas-probe.json]
 *   node scripts/run-probe.mjs --url ... --headed     (a visible window instead of headless)
 *
 * The credential is passed on the command line and lands in the browser's URL **fragment**, which is
 * never transmitted, and it is scrubbed out of the artifact before that is written.
 *
 * **Two residuals this creates anyway, named rather than implied** (`docs/09`; the same disclosure
 * ADR-012's threat model made for its own `launch-url.txt`): the URL is an argument to `msedge.exe`
 * and to `node`, readable by any process running as the same user; and Edge records visited URLs,
 * fragment included, in the throwaway profile below — whose deletion afterwards is **best-effort**,
 * because the browser may still hold a lock. Adequate for a development probe on a loopback session
 * token with a process lifetime; **not** a pattern for a production credential path.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import WebSocket from 'ws';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(name);

const url = arg('--url');
if (!url) {
  console.error('--url "http://127.0.0.1:PORT/#TOKEN" is required');
  process.exit(2);
}
const outPath = arg('--out', '../../target/slice-evidence/canvas-probe.json');
const timeoutMs = Number(arg('--timeout', '120000'));
/**
 * `xmin,ymin,xmax,ymax` in the dataset's CRS. Forwarded to the page, which has no way to ask for it:
 * this slice has no control plane, so a probe pointed at the wrong window draws a clipped view and
 * looks like a broken stream. `make-fixture` prints the fixture's extent in exactly this shape.
 */
const extent = arg('--extent');

/**
 * Edge ships either as `Edge/Application` or, on this machine, as versioned `EdgeCore/<version>`
 * directories. The versioned layout is searched newest-first so the record names the build that
 * actually ran — bake-off README §21 Q9 records "the exact browser build reaches no artifact" as an
 * open defect, and guessing the path is how that happens.
 */
function findEdge() {
  const fixed = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].find((p) => existsSync(p));
  if (fixed) return fixed;
  for (const root of ['C:/Program Files (x86)/Microsoft/EdgeCore', 'C:/Program Files/Microsoft/EdgeCore']) {
    if (!existsSync(root)) continue;
    const versions = readdirSync(root)
      .filter((d) => /^\d+\./.test(d))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    for (const v of versions) {
      const candidate = join(root, v, 'msedge.exe');
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}
const browserPath = arg('--browser', findEdge());
if (!browserPath) {
  console.error('no Edge binary found; pass --browser <path>');
  process.exit(2);
}

const profile = join(tmpdir(), `canvas-probe-${process.pid}`);
mkdirSync(profile, { recursive: true });

const browserArgs = [
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
];
if (!flag('--headed')) browserArgs.push('--headless=new', '--disable-gpu-vsync');

let pageUrl = url;
if (extent) {
  const [xmin, ymin, xmax, ymax] = extent.split(',').map((v) => v.trim());
  const u = new URL(url);
  u.search = new URLSearchParams({ xmin, ymin, xmax, ymax }).toString();
  pageUrl = u.toString();
}
browserArgs.push(pageUrl);

const child = spawn(browserPath, browserArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
let stderr = '';
child.stderr.on('data', (d) => (stderr += d.toString()));

/** The DevTools endpoint the browser writes into its profile once it is listening. */
async function devtoolsEndpoint() {
  const file = join(profile, 'DevToolsActivePort');
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (existsSync(file)) {
      const [port, path] = readFileSync(file, 'utf8').trim().split('\n');
      if (port && path) return `ws://127.0.0.1:${port}${path}`;
    }
    await sleep(100);
  }
  throw new Error(`browser never reported a debugging endpoint. stderr:\n${stderr}`);
}

function rpc(ws) {
  let next = 1;
  const pending = new Map();
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  });
  return (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = next++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
}

const endpoint = await devtoolsEndpoint();
const ws = new WebSocket(endpoint, { perMessageDeflate: false });
await new Promise((r, j) => {
  ws.once('open', r);
  ws.once('error', j);
});
const send = rpc(ws);

const { targetInfos } = await send('Target.getTargets');
const page = targetInfos.find((t) => t.type === 'page');
if (!page) throw new Error('no page target');
const { sessionId } = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true });

const evaluate = async (expression) => {
  const r = await send(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: false },
    sessionId,
  );
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};

// Poll for the probe's own completion marker rather than guessing at a fixed wait.
const deadline = Date.now() + timeoutMs;
let results = null;
while (Date.now() < deadline) {
  results = await evaluate('window.__sliceResults ? JSON.stringify(window.__sliceResults) : null')
    .then((v) => (v ? JSON.parse(v) : null))
    .catch(() => null);
  if (results && (results.done || results.failure)) break;
  await sleep(250);
}

const probeLog = await evaluate('JSON.stringify(window.__probeLog ?? [])')
  .then((v) => JSON.parse(v))
  .catch(() => []);
const userAgent = await evaluate('navigator.userAgent').catch(() => 'unknown');

ws.close();

// **Kill the process tree, not just the parent.** On Windows a browser's renderer, GPU and utility
// processes survive `child.kill()` and linger indefinitely — an earlier version of this script left
// eighteen headless processes running on the machine. `taskkill /T` takes the children with it.
try {
  spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
} catch {
  child.kill();
}
await sleep(500);
try {
  rmSync(profile, { recursive: true, force: true });
} catch {
  /* the browser may still hold a lock; the profile is in the OS temp directory either way, and the
     README records that this cleanup is best-effort rather than pretending otherwise */
}

if (!results) {
  console.error('the probe produced no record before the timeout');
  console.error(probeLog.join('\n'));
  process.exit(1);
}

const artifact = {
  kind: 'in-situ browser probe',
  status: 'hypothesis-forming, NOT a preregistered measurement',
  admissibility:
    'may not be cited in ADR-012 and may not re-open it; raw material for the reserved ADR-014',
  comparison_scope:
    'within-session only — the machine drifts between sessions asymmetrically (bake-off README §21 Q1 / §22.1)',
  throughput_claim: 'none; no figure here is a transport throughput result',
  browser: { userAgent, headless: !flag('--headed') },
  note: flag('--headed')
    ? 'windowed run'
    : 'headless run — the compositor and GPU path differ from a windowed session, so pixel timings are indicative only',
  results,
  log: probeLog,
};

// The credential appears in no artifact: it is stripped before anything is written (docs/09).
const token = new URL(url).hash.replace(/^#/, '');
const text = JSON.stringify(artifact, null, 2).replaceAll(token, '<redacted>');
if (token && text.includes(token)) {
  console.error('refusing to write an artifact containing the session credential');
  process.exit(1);
}
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, text + '\n');
console.log(`wrote ${outPath}`);
console.log(JSON.stringify(results, null, 2));
process.exit(results.failure ? 1 : 0);
