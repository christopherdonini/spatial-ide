// E2E TEST SURFACE (e2e/README.md) -- Node-side half. Plain ESM, node builtins + playwright-core
// only (no browser download: this drives the app's own WebView2 over CDP, never a Playwright-
// managed browser).
//
// The CDP port is opt-in strictly by this module generating a gitignored Tauri config overlay
// (`writeConfigOverlay` below -- e2e/out/ is gitignored, docs/09) and passing it to `tauri dev
// --config <path>` only when *it* spawns the app: nothing here, and nothing in the app itself,
// turns the port on by default, and a packaged `tauri build` never sees this file, since it never
// exists until a launch generates it.
//
// `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` is deliberately NOT used -- it is documented-ineffective
// under wry: `~/.cargo/registry/src/*/wry-0.55.1/src/webview2/mod.rs` lines 285-330 show wry
// *always* calls `options.set_additional_browser_arguments(...)` itself (the app's own
// `additionalBrowserArgs` config if set, wry's own defaults otherwise), and WebView2 ignores the
// env var whenever a host sets that option programmatically like this -- confirmed live: the
// running `msedgewebview2.exe` carried wry's own default args but never the env var's. The Tauri-2
// window-config key `additionalBrowserArgs` is the seam that actually reaches the browser process
// (same finding recorded in `spikes/adr-003-crs-rendering/README.md`'s "Remote debugging"
// paragraph); see `writeConfigOverlay` for why the overlay must repeat wry's own default args
// alongside it.

import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const CDP_PORT = Number(process.env.SPATIAL_E2E_CDP_PORT ?? 9223);

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(SHELL_DIR, "e2e", "out");
const APP_URL_PREFIX = "http://localhost:5180"; // vite.config.ts's fixed dev-server port

// wry's own defaults (`webview2/mod.rs`, see the file-top comment) -- `additionalBrowserArgs`
// *replaces* whatever wry would have passed, so any config that sets it must repeat these or
// silently lose them (re-enabling the Edge WebView2 "OOUI" overlays, re-requiring a user gesture
// for autoplay) as an unrelated side effect of turning on a debug port.
const WRY_DEFAULT_BROWSER_ARGS =
  "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --autoplay-policy=no-user-gesture-required";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cdpIsUp(cdpUrl) {
  try {
    const res = await fetch(`${cdpUrl}/json/version`);
    return res.ok;
  } catch {
    return false; // nothing listening yet, or the app hasn't opened the port yet -- not fatal here
  }
}

async function waitForCdpUp(cdpUrl, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await cdpIsUp(cdpUrl)) return true;
    await sleep(500);
  }
  return false;
}

/** The app's own page among whatever WebView2 exposes over CDP (devtools frames, workers, and any
 * other browser chrome besides). Polls rather than trusting the first page found -- immediately
 * after the port opens the app's own navigation to `APP_URL_PREFIX` may not have landed yet. */
async function findAppPage(browser) {
  const start = Date.now();
  while (Date.now() - start < 60_000) {
    const pages = browser.contexts().flatMap((ctx) => ctx.pages());
    const match = pages.find((p) => p.url().startsWith(APP_URL_PREFIX));
    if (match) return match;
    await sleep(300);
  }
  const urls = browser.contexts().flatMap((ctx) => ctx.pages().map((p) => p.url()));
  throw new Error(
    `findAppPage: no page with URL starting with "${APP_URL_PREFIX}" appeared within 60s. ` +
      `Pages seen: ${urls.length ? urls.join(", ") : "(none)"}`
  );
}

/**
 * Generates `e2e/out/tauri.e2e.conf.json`, merged over the real config via `tauri dev --config
 * <path>` -- the only place the debug-port flag ever exists on disk, and only for the lifetime of
 * one launch (regenerated fresh every call, gitignored, never referenced by `tauri.conf.json`
 * itself). Copies `app.windows[0]` from the real config rather than inventing a window object, so
 * title/width/height stay whatever the base config says instead of drifting out of sync with it.
 */
function writeConfigOverlay() {
  const baseConfigPath = join(SHELL_DIR, "src-tauri", "tauri.conf.json");
  const baseConfig = JSON.parse(readFileSync(baseConfigPath, "utf8"));
  const baseWindow = baseConfig.app?.windows?.[0];
  if (!baseWindow) {
    throw new Error(`writeConfigOverlay: ${baseConfigPath} has no app.windows[0] to overlay onto`);
  }
  const overlayWindow = {
    ...baseWindow,
    additionalBrowserArgs: `${WRY_DEFAULT_BROWSER_ARGS} --remote-debugging-port=${CDP_PORT}`,
  };
  const overlay = { app: { windows: [overlayWindow] } };

  mkdirSync(OUT_DIR, { recursive: true });
  const overlayPath = join(OUT_DIR, "tauri.e2e.conf.json");
  writeFileSync(overlayPath, JSON.stringify(overlay, null, 2));
  return overlayPath;
}

function killTree(pid) {
  return new Promise((resolve) => {
    if (process.platform === "win32") {
      const k = spawn("taskkill", ["/T", "/F", "/PID", String(pid)], { stdio: "ignore" });
      // taskkill itself has no built-in bound; without one, a wedged taskkill would hang whatever
      // awaited this Promise (attachOrLaunch's failure path) indefinitely -- fail loudly instead.
      const settle = (outcome) => {
        clearTimeout(timer);
        if (outcome === "timeout") {
          console.error(`killTree: taskkill for pid ${pid} did not exit within 10s -- giving up (best-effort)`);
        }
        resolve();
      };
      const timer = setTimeout(() => settle("timeout"), 10_000);
      k.on("exit", () => settle("exit"));
      k.on("error", () => settle("error")); // best-effort: the process may already be gone
    } else {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // already gone
      }
      resolve();
    }
  });
}

/**
 * Attaches to an app already listening on `CDP_PORT` (a previous run of this script, or an
 * operator-launched instance started the same way -- e.g. `tauri dev --config
 * e2e/out/tauri.e2e.conf.json`), or spawns one. Spawning is the only path that ever generates the
 * config overlay (`writeConfigOverlay`) -- the security posture this repo commits to (docs/09,
 * e2e/README.md) is that nothing else ever turns the debug port on.
 */
export async function attachOrLaunch({ timeoutMs = 300_000 } = {}) {
  const cdpUrl = `http://127.0.0.1:${CDP_PORT}`;

  let browser = null;
  // A short timeout here: this probe exists to make repeated interactive runs fast (reuse the
  // still-running app), not to wait out a slow launch -- that wait happens below, only once we
  // know we are the one doing the launching.
  try {
    browser = await chromium.connectOverCDP(cdpUrl, { timeout: 2000 });
  } catch {
    browser = null;
  }

  if (browser) {
    const page = await findAppPage(browser);
    return { browser, page, launched: false, stop: () => stopSession(browser, false, null) };
  }

  const overlayPath = writeConfigOverlay();
  // `detached: true` + `child.unref()` exist for one reason: a 2026-08-12 run left node.exe hung
  // ~16h after printing its final line, because this spawn was neither detached nor unref'd -- the
  // parent's event loop held the child's process handle open forever (the launched app is *meant*
  // to keep running after this CLI exits, so that handle was never going to close on its own).
  //
  // stdio is a raw fd from `fs.openSync`, not a `.pipe()`'d WriteStream, for the same reason:
  // verified empirically that `.pipe()`d stdio keeps the parent's event loop pinned open
  // regardless of `child.unref()` (Node only unrefs the child's process handle, not the
  // separately-ref'd pipe handles) -- and, worse, that once the parent goes away anyway (natural
  // exit or `process.exit()`), the pipe's read end closes with it, so the very next write from the
  // child hits a broken pipe: an equivalent detached `shell: true` child observed under this exact
  // spawn shape died silently mid-script the instant its parent exited, before producing any
  // further output. A raw fd handed to `stdio` is duplicated into the child's own handle table by
  // the OS at spawn time -- independent of the parent process's lifetime or its event loop -- so
  // app.log keeps receiving output for as long as the app runs, and the parent can exit (natural
  // or forced) without any risk of severing the app's own stdout/stderr.
  //
  // `shell: process.platform === "win32"` is unchanged: switching to spawning `npx.cmd` directly
  // with `shell: false` was tried and rejected -- Node (>=18.20/20.11/21.6, CVE-2024-27980) throws
  // `EINVAL` spawning a `.cmd` file with `shell: false` at all, so that path never even reaches a
  // detach question. `windowsHide: true` is added regardless, since `detached: true` on Windows
  // documents that a detached child gets its own console window absent it.
  const logFd = openSync(join(OUT_DIR, "app.log"), "a");
  const child = spawn("npx", ["tauri", "dev", "--config", overlayPath], {
    cwd: SHELL_DIR,
    shell: process.platform === "win32",
    env: process.env,
    detached: true,
    windowsHide: true,
    stdio: ["ignore", logFd, logFd],
  });
  // `spawn` itself can fail asynchronously (e.g. `npx` not on PATH) -- a `ChildProcess` is an
  // `EventEmitter`, and an `'error'` event with no listener throws out of whatever happened to be
  // running when Node gets around to emitting it, not out of this function. Racing this promise
  // against `waitForCdpUp` below is what turns that into the same named, waited-for failure the
  // timeout path already produces, instead of an unrelated crash or (worse) a silent 300s hang
  // waiting on a CDP port nothing is ever going to open.
  const spawnErrorPromise = new Promise((_resolve, reject) => {
    child.on("error", (err) => {
      reject(
        new Error(`attachOrLaunch: failed to spawn "npx tauri dev": ${err.message} -- see e2e/out/app.log`)
      );
    });
  });
  child.unref();

  const up = await Promise.race([waitForCdpUp(cdpUrl, timeoutMs), spawnErrorPromise]);
  if (!up) {
    await killTree(child.pid);
    throw new Error(
      `attachOrLaunch: ${cdpUrl}/json/version never came up within ${timeoutMs}ms -- see e2e/out/app.log`
    );
  }

  browser = await chromium.connectOverCDP(cdpUrl);
  const page = await findAppPage(browser);
  return { browser, page, launched: true, stop: () => stopSession(browser, true, child) };
}

async function stopSession(browser, launched, child) {
  // `Browser.close()` on a CDP-attached browser disconnects rather than closing the real browser
  // process (Playwright's own documented behavior for `connectOverCDP`) -- safe to call
  // unconditionally. Only `launched` sessions get the process tree killed below; an
  // already-running app this call merely attached to is left up for further interactive use.
  await browser.close().catch(() => {});
  if (launched && child) {
    await killTree(child.pid);
  }
}

/** Subscribes to `page`'s console/pageerror streams for the lifetime of the session. Every entry
 * is kept (not just render-trace lines) so a report can show the full console alongside the
 * filtered view -- `debug-session.mjs`'s report does both. */
export function attachConsole(page) {
  const entries = [];

  const onConsole = (msg) => {
    entries.push({ kind: "console", type: msg.type(), text: msg.text(), at: Date.now() });
  };
  const onPageError = (err) => {
    entries.push({ kind: "pageerror", type: "pageerror", text: err?.message ?? String(err), at: Date.now() });
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  return {
    entries,
    renderTrace: () => entries.filter((e) => e.text.includes("[render-trace]")),
    errors: () => entries.filter((e) => e.type === "error" || e.kind === "pageerror"),
    dispose: () => {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
    },
  };
}

/**
 * Resolves once `traceFn()`'s length has been unchanged for `quietMs` (`{settled: true, count}`),
 * or after `timeoutMs` regardless (`{settled: false, count}`). Never rejects: a canvas that never
 * settles is a finding for the caller to report, not a harness failure.
 */
export async function waitForSettle(traceFn, { quietMs = 3000, timeoutMs = 45_000 } = {}) {
  const POLL_MS = 200;
  const start = Date.now();
  let lastCount = traceFn().length;
  let lastChangeAt = start;

  while (true) {
    await sleep(POLL_MS);
    const count = traceFn().length;
    const now = Date.now();
    if (count !== lastCount) {
      lastCount = count;
      lastChangeAt = now;
    }
    if (now - lastChangeAt >= quietMs) {
      return { settled: true, count: lastCount };
    }
    if (now - start >= timeoutMs) {
      return { settled: false, count: lastCount };
    }
  }
}
