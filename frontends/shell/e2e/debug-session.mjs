#!/usr/bin/env node
// E2E TEST SURFACE (e2e/README.md) -- CLI entry point: admits a fixture through the real admission
// path, lets the canvas settle, and reads pixels back. An instrument, not a test -- exit 0 means it
// ran to completion, never a claim that anything rendered (see the "E2E-verified" note in the
// README: what counts as a *pass* is for whoever reads the printed report and the JSON alongside
// it, not this script).

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "out");

const DEFAULT_FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture";

// The fixed set `renderTrace.ts` actually emits -- kept as a literal list (not derived from
// whatever happens to show up in one run) so a subtag that stops firing shows up as a zero, not a
// silently absent row.
const RENDER_TRACE_SUBTAGS = [
  "describe.extent",
  "viewport_query",
  "batch",
  "layers",
  "view-state",
  "pre-offset",
  "post-offset",
];

function subtagOf(text) {
  // Every renderTrace.ts call is `console.debug(PREFIX, subtag, ...)`; both are plain strings, so
  // Playwright's ConsoleMessage.text() carries them verbatim regardless of how later object
  // arguments get previewed -- no need for the async args()/jsonValue() round trip to get this.
  const m = /^\[render-trace\]\s+(\S+)/.exec(text);
  return m ? m[1] : null;
}

async function waitForHook(page, timeoutMs = 10_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const has = await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function");
    if (has) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
}

function gridRegions() {
  const regions = [];
  for (let gy = 0; gy < 3; gy++) {
    for (let gx = 0; gx < 3; gx++) {
      regions.push({ x: gx / 3, y: gy / 3, w: 1 / 3, h: 1 / 3 });
    }
  }
  return regions;
}

async function main() {
  // A 2026-08-12 run hung ~16h after printing its final line: the harness relied on natural
  // event-loop exit while attachOrLaunch's spawned child kept handles open (see lib.mjs). This
  // whole-script watchdog is the backstop for that class of bug, and for anything else in this
  // file that ends up wedged for a reason nobody anticipated -- notably `page.evaluate()` calls
  // below have no timeout option of their own. Unref'd so the timer itself never keeps the
  // process alive; it only fires if something *else* is already keeping the loop from going idle.
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 600_000);
  const watchdog = setTimeout(() => {
    console.error("debug-session: SPATIAL_E2E_DEADLINE_MS (default 600000) exceeded -- presumed hung, failing loudly");
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  const fixturePath = process.argv[2] ?? DEFAULT_FIXTURE;
  if (!existsSync(fixturePath)) {
    console.error(`debug-session: fixture not found: ${fixturePath}`);
    console.error(`Regenerate the manual-walkthrough fixtures with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return;
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`debug-session: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);

  try {
    const hookReady = await waitForHook(page);
    if (!hookReady) {
      throw new Error(
        "window.__SPATIAL_E2E__.openPath never appeared. Either this is not a dev build " +
          "(the E2E hooks are gated on import.meta.env.DEV and compiled out of production -- run " +
          "via `npm run tauri dev`/`vite dev`, not a built bundle), or AdmissionPanel never mounted."
      );
    }

    console.log(`Admitting fixture: ${fixturePath}`);
    const admissionOutcome = await page.evaluate(
      (path) => window.__SPATIAL_E2E__.openPath(path),
      fixturePath
    );
    console.log("Admission outcome:", JSON.stringify(admissionOutcome));

    const settle = await waitForSettle(() => consoleHandle.renderTrace());
    console.log(
      `Render-trace settle: ${settle.settled ? "settled" : "TIMED OUT waiting to settle"} at ${settle.count} entries`
    );
    if (!settle.settled) {
      // waitForSettle deliberately resolves rather than rejects on timeout (it's an instrument,
      // not a pass/fail gate) -- but a silent fall-through here would bury a real finding under
      // the rest of the report. Make it impossible to miss.
      console.error(
        "debug-session: WARNING -- render-trace never settled within its timeout; pixel capture and " +
          "subtag counts below may reflect a canvas that was still mid-render."
      );
    }

    const pixelsOverall = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
    const pixelsGrid = await page.evaluate(
      (regions) => window.__SPATIAL_E2E__.capturePixels(regions),
      gridRegions()
    );

    const trace = consoleHandle.renderTrace();
    const subtagCounts = Object.fromEntries(RENDER_TRACE_SUBTAGS.map((tag) => [tag, 0]));
    for (const entry of trace) {
      const tag = subtagOf(entry.text);
      if (tag && tag in subtagCounts) subtagCounts[tag]++;
    }
    const lastLineFor = (tag) => trace.slice().reverse().find((e) => subtagOf(e.text) === tag)?.text ?? null;
    const lastLayersLine = lastLineFor("layers");
    const lastViewStateLine = lastLineFor("view-state");
    const errors = consoleHandle.errors();

    const fractionOf = (summary) => (summary.totalPixels > 0 ? summary.nonBackgroundCount / summary.totalPixels : 0);
    const overallFraction = fractionOf(pixelsOverall);
    const gridFractions = pixelsGrid.regions.map(fractionOf);

    console.log("");
    console.log("== render-trace subtag counts ==");
    for (const tag of RENDER_TRACE_SUBTAGS) {
      console.log(`  ${tag}: ${subtagCounts[tag]}`);
    }
    console.log("");
    console.log(`Last layers line:     ${lastLayersLine ?? "(none)"}`);
    console.log(`Last view-state line: ${lastViewStateLine ?? "(none)"}`);
    console.log("");
    console.log(`Pixel non-background fraction (overall): ${(overallFraction * 100).toFixed(2)}%`);
    console.log("Pixel non-background fraction (3x3 grid, row-major top-to-bottom):");
    for (let gy = 0; gy < 3; gy++) {
      const row = gridFractions.slice(gy * 3, gy * 3 + 3).map((f) => `${(f * 100).toFixed(1)}%`);
      console.log(`  [${row.join(", ")}]`);
    }
    console.log("");
    console.log(`Errors observed: ${errors.length}`);
    for (const e of errors) {
      console.log(`  [${e.kind}] ${e.text}`);
    }

    mkdirSync(OUT_DIR, { recursive: true });
    const reportPath = join(OUT_DIR, `debug-session-${Date.now()}.json`);
    writeFileSync(
      reportPath,
      JSON.stringify(
        {
          fixturePath,
          admissionOutcome,
          settle,
          renderTraceSubtagCounts: subtagCounts,
          lastLayersLine,
          lastViewStateLine,
          pixelSummary: { overall: pixelsOverall, grid: pixelsGrid },
          errors,
          renderTrace: trace,
          allConsoleEntries: consoleHandle.entries,
        },
        null,
        2
      )
    );
    console.log("");
    console.log(`Full report: ${reportPath}`);
    process.exitCode = 0;
  } catch (e) {
    console.error(`debug-session: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    consoleHandle.dispose();
    // Disconnects only -- never `session.stop()` here, on success or failure: a launched app stays
    // up for further interactive use, and an attached-to app was never ours to stop.
    await browser.close().catch(() => {});
    console.log(
      launched
        ? `This run launched the app; it stays RUNNING on CDP port ${CDP_PORT} for further interactive use.`
        : `Attached to an already-running app on CDP port ${CDP_PORT}; leaving it running.`
    );

    // Natural event-loop exit cannot be trusted here (the 2026-08-12 ~16h hang, see lib.mjs and
    // the watchdog above): attachOrLaunch's launched child is deliberately detached and unref'd so
    // it can outlive this process, and even an attach-only session can leave Node/Playwright
    // internal handles around. Flush stdout, then exit explicitly with whatever code the run
    // already decided on.
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
