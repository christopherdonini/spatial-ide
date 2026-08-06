#!/usr/bin/env node
/**
 * Drive a published bundle in a real browser and report what the viewer did.
 *
 * The acceptance checklist asks for things only a browser can answer — does a visibly styled result
 * render, does hover resolve, does a corrupted asset produce its **named** failure state — and the
 * honest way to answer them is to load the bundle and read the page, not to assert about the code
 * that would have loaded it.
 *
 * ## What it reports, and what it does not
 *
 * It reports **facts the page states about itself**: the status line, the failure banner's state and
 * asset, the legend rows, the provenance block, and the result of driving the hover handler over a
 * grid of canvas points. It does **not** report a frame time, a load time, or any other number that
 * could be read as a performance figure — this cut measures nothing and claims nothing.
 *
 * ## An instrument, not part of the bundle
 *
 * It lives in `scripts/`, never in `dist/`, so nothing here can end up inside a published bundle.
 * It writes a JSON artifact so a run is re-readable rather than a screenshot someone described.
 *
 * ```text
 * node scripts/run-acceptance.mjs --url http://127.0.0.1:8731/viewer/index.html \
 *      --out ../../target/acceptance/viewer.json [--expect-failure asset-hash-mismatch] [--headed]
 * ```
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { WebSocket } from 'ws';

const argv = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const flag = (name) => argv.includes(name);

const url = arg('--url');
const out = arg('--out');
const expectFailure = arg('--expect-failure');
const timeoutMs = Number(arg('--timeout-ms', '180000'));
if (!url) {
  console.error('--url is required');
  process.exit(2);
}

/**
 * A Chromium-family browser, wherever this machine keeps one.
 *
 * Edge ships either as `Edge/Application` or as a versioned `EdgeCore/<version>`; Chrome is checked
 * too, because the acceptance only needs *a* browser and refusing to find one that is present would
 * make the run depend on which is installed.
 */
function findBrowser() {
  const direct = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  ];
  for (const p of direct) if (existsSync(p)) return p;
  for (const root of ['C:/Program Files (x86)/Microsoft/EdgeCore', 'C:/Program Files/Microsoft/EdgeCore']) {
    if (!existsSync(root)) continue;
    const versions = readdirSync(root).sort().reverse();
    for (const v of versions) {
      const candidate = join(root, v, 'msedge.exe');
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

const browserPath = arg('--browser', findBrowser());
if (!browserPath) {
  console.error('no Edge binary found; pass --browser <path>');
  process.exit(2);
}

const profile = join(process.env.TEMP ?? '/tmp', `bundle-viewer-acceptance-${Date.now()}`);
mkdirSync(profile, { recursive: true });

const browserArgs = [
  // Port 0: the browser picks, and tells us which in `DevToolsActivePort`. Asking for a specific
  // port is what produced the second bug in this driver — see `devtoolsEndpoint`.
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  'about:blank',
];
if (!flag('--headed')) browserArgs.push('--headless=new');

const browser = spawn(browserPath, browserArgs, { stdio: ['ignore', 'pipe', 'pipe'], detached: true });

/**
 * Find the devtools endpoint by reading **`DevToolsActivePort` from the profile directory**.
 *
 * Two earlier versions of this function were wrong, and both failures are worth recording because
 * each reported something confidently false.
 *
 * 1. **Waiting for `DevTools listening on ws://…` on the launched process's stderr.** The launcher
 *    exits immediately and a detached child does the work — the same shape `kernel/RESULTS.md`
 *    records for its own browser instrument ("Edge's child processes outlive the pid being
 *    polled"). So the parent's stderr never carries the line, the parent's exit fires, and the
 *    driver reported **"browser exited early"** about a browser that was serving requests fine.
 * 2. **Polling a fixed port that was passed with `--remote-debugging-port`.** The browser does not
 *    guarantee it binds the requested port; on this machine it took 7142 while 9411 was asked for.
 *    The driver then reported **"no devtools endpoint"** about a browser that was listening on a
 *    port it had written down.
 *
 * `DevToolsActivePort` is the browser's own statement of where it is listening, written into the
 * profile it was given. Reading it asks the browser rather than guessing at it, which is why the
 * launch now asks for port 0 and lets it choose.
 */
async function devtoolsEndpoint() {
  const portFile = join(profile, 'DevToolsActivePort');
  const deadline = Date.now() + 30000;
  for (;;) {
    if (existsSync(portFile)) {
      // Two lines: the port, then the browser's websocket path.
      const [portLine, wsPath] = readFileSync(portFile, 'utf8').split('\n');
      const chosen = Number(portLine.trim());
      if (chosen > 0 && wsPath) {
        try {
          const r = await fetch(`http://127.0.0.1:${chosen}/json/version`);
          if (r.ok) {
            const v = await r.json();
            return { ws: v.webSocketDebuggerUrl ?? `ws://127.0.0.1:${chosen}${wsPath.trim()}`, product: v.Browser };
          }
        } catch {
          // Written but not serving yet.
        }
      }
    }
    if (Date.now() > deadline) {
      throw new Error(`the browser did not write a usable DevToolsActivePort in ${profile} within 30 s`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

let nextId = 1;
function rpc(socket, method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const onMessage = (raw) => {
      const msg = JSON.parse(String(raw));
      if (msg.id !== id) return;
      socket.off('message', onMessage);
      if (msg.error) reject(new Error(`${method}: ${msg.error.message}`));
      else resolve(msg.result);
    };
    socket.on('message', onMessage);
    socket.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

/** Everything the page says about itself, read from the DOM rather than inferred. */
const READ_PAGE = `(() => {
  const text = (id) => (document.getElementById(id)?.textContent ?? '').replace(/\\s+/g, ' ').trim();
  const banner = document.getElementById('banner');
  const legend = [...document.querySelectorAll('#legend .legend-row')].map((r) =>
    r.textContent.replace(/\\s+/g, ' ').trim(),
  );
  return {
    status: text('status'),
    bannerVisible: banner ? !banner.hidden : false,
    banner: banner && !banner.hidden ? banner.textContent.replace(/\\s+/g, ' ').trim() : null,
    legend,
    crs: text('crs'),
    identity: text('identity'),
    grade: text('grade'),
    boundsBasis: text('bounds-basis'),
    license: text('license'),
    log: text('log'),
  };
})()`;

/**
 * Drive the hover handler over a grid and report what it resolved.
 *
 * Synthesised mouse events rather than a real cursor: the property under test is that the handler
 * resolves a feature through its stable id, and a synthetic event exercises exactly that path.
 */
const PROBE_HOVER = `(() => {
  const canvas = document.getElementById('map');
  if (!canvas) return { probes: 0, resolved: 0, samples: [] };
  const rect = canvas.getBoundingClientRect();
  const samples = [];
  let probes = 0;
  for (let gx = 0; gx < 16; gx++) {
    for (let gy = 0; gy < 16; gy++) {
      probes++;
      const x = 20 + gx * (rect.width - 40) / 15;
      const y = 20 + gy * (rect.height - 40) / 15;
      canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: rect.left + x, clientY: rect.top + y, bubbles: true,
      }));
      const panel = document.getElementById('hover');
      const id = panel?.querySelector('.hover-id')?.textContent ?? null;
      if (id) {
        samples.push({
          id: id.replace('id ', ''),
          attributes: panel.textContent.replace(/\\s+/g, ' ').replace(id, '').trim(),
        });
      }
    }
  }
  return { probes, resolved: samples.length, samples: samples.slice(0, 8) };
})()`;

const artifact = {
  url,
  expect_failure: expectFailure,
  // Deliberately no timing of any kind: this cut measures nothing, and a duration in an artifact
  // invites exactly the citation the write-up is forbidden to make.
  browser: null,
  page: null,
  hover: null,
  console_errors: [],
  verdict: null,
};

try {
  const endpoint = await devtoolsEndpoint();
  artifact.browser = endpoint.product;
  const socket = new WebSocket(endpoint.ws);
  await new Promise((resolve, reject) => {
    socket.once('open', resolve);
    socket.once('error', reject);
  });

  const { targetId } = await rpc(socket, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await rpc(socket, 'Target.attachToTarget', { targetId, flatten: true });

  await rpc(socket, 'Runtime.enable', {}, sessionId);
  await rpc(socket, 'Log.enable', {}, sessionId);
  socket.on('message', (raw) => {
    const msg = JSON.parse(String(raw));
    if (msg.method === 'Runtime.exceptionThrown') {
      artifact.console_errors.push(msg.params.exceptionDetails.text ?? 'exception');
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      artifact.console_errors.push(msg.params.entry.text);
    }
  });

  await rpc(socket, 'Page.enable', {}, sessionId);
  await rpc(socket, 'Page.navigate', { url }, sessionId);

  const evaluate = async (expression) => {
    const r = await rpc(
      socket,
      'Runtime.evaluate',
      { expression, returnByValue: true, awaitPromise: true },
      sessionId,
    );
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };

  // Settle: either every partition is verified, or the banner is up. Polling the page's own
  // statements rather than a fixed sleep — a sleep would silently pass a viewer that never finished.
  const deadline = Date.now() + timeoutMs;
  let page = null;
  for (;;) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      page = await evaluate(READ_PAGE);
    } catch {
      page = null;
    }
    if (page) {
      const done = /^(\d+)\/(\1) partitions verified/.test(page.status) || page.bannerVisible;
      if (done) break;
    }
    if (Date.now() > deadline) {
      throw new Error(`the viewer did not settle within ${timeoutMs} ms; last status: ${page?.status}`);
    }
  }

  artifact.page = page;
  if (!page.bannerVisible) artifact.hover = await evaluate(PROBE_HOVER);

  // The verdict is a comparison against what was asked for, so a run cannot be read as a pass just
  // because it produced output.
  if (expectFailure) {
    const named = page.bannerVisible && page.banner.includes(expectFailure);
    artifact.verdict = named ? 'expected-failure-state-observed' : 'WRONG-OR-MISSING-FAILURE-STATE';
  } else {
    const rendered = !page.bannerVisible && /partitions verified/.test(page.status);
    const hovered = (artifact.hover?.resolved ?? 0) > 0;
    artifact.verdict =
      rendered && hovered ? 'rendered-and-hover-resolved' : 'DID-NOT-RENDER-OR-HOVER-FAILED';
  }

  // **Closed through the protocol, not by killing a pid.** The launched process is a launcher whose
  // child does the work, so `kill()` on it reaches nothing — the same shape as the profile-cleanup
  // leak `kernel/RESULTS.md` records against its own browser instrument.
  try {
    await rpc(socket, 'Browser.close');
  } catch {
    // Already gone.
  }
  socket.close();
} catch (e) {
  artifact.verdict = `DRIVER-ERROR: ${e.message}`;
} finally {
  browser.unref();
}

if (out) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(artifact, null, 2));
}
console.log(JSON.stringify(artifact, null, 2));
process.exit(artifact.verdict?.startsWith('DRIVER-ERROR') || /^(WRONG|DID-NOT)/.test(artifact.verdict) ? 1 : 0);
