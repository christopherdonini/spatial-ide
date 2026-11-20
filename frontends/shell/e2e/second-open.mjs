#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- E-SECOND and E-CRASH-UNLOCK of B2 piece 1c (B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 54 items 6 and 8 (c); Amendment 66 item 5):
// two app processes at once on one machine store. App A is the suites' own launch; app B is the debug exe that A's launch built, started while A is up (`attachSecondApp` in `lib.mjs`).
// Both reopen through the DEV hook `e2eOpenProjectFolder`, whose answer `admitted` is the kernel's `opened`.
//
// **E-SECOND.** A saves a project into folder P; B's reopen of P is refused as `skp.project_open_elsewhere` with S9's other-window place and its run ended; A opens another file; B then
// reopens P every 250 ms for at most 40 tries (10 s) until `admitted`. Each refused try must show S9's other-window place. At the bound the step fails by name with the last code, and says whether
// the line `close_dataset` writes when its release thread does not start is in A's log (`e2e/out/app.log`, from the byte where this run's launch began), or that no log could be read.
// **E-CRASH-UNLOCK.** B opens another file, A reopens P, A's process tree is killed (`session.stop()`, which ends in `taskkill /T /F`), and B reopens P: `admitted` within the same bound.
// The tries and elapsed milliseconds are printed as evidence, never a measurement claim (docs/08; ADR-018).
//
// **The store is a scratch folder,** as `project.mjs` does: `LOCALAPPDATA` is set before the launch; the suite launches its own app, refuses one already listening, and removes what it made.
//
// RECORDED MUTATIONS: entries are added by the commit that observes them.

import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-second-"));
const FOLDER_P = mkdtempSync(join(TEMP_BASE, "spatial-second-p-"));
const WV2_B = mkdtempSync(join(TEMP_BASE, "spatial-second-wv2b-"));
process.env.LOCALAPPDATA = SCRATCH;

const lib = await import("./lib.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_LOG = join(HERE, "out", "app.log");
const NOTICES_SOURCE = join(HERE, "..", "src", "project", "reopenNotices.ts");
const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";
const RELEASE_LINE = "the project lock's release thread did not start";
const HOOKS = ["openPath", "e2eSaveProjectToFolder", "e2eOpenProjectFolder"];
const TRIES = 40;
const TRY_MS = 250;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hook = (page, name, arg) => page.evaluate(([n, a]) => window.__SPATIAL_E2E__[n](a), [name, arg]);

function otherWindowNotice() {
  const found = /export const OPEN_ELSEWHERE_OTHER_NOTICE =\s*("(?:[^"\\]|\\.)*");/.exec(readFileSync(NOTICES_SOURCE, "utf8"));
  if (found === null) throw new Error(`${NOTICES_SOURCE} holds no exported OPEN_ELSEWHERE_OTHER_NOTICE constant`);
  return JSON.parse(found[1]);
}

async function ready(page, what) {
  const start = Date.now();
  while (Date.now() - start < 90_000) {
    const ok = await page.evaluate((hooks) => document.querySelector(".app-header") !== null && hooks.every((h) => typeof window.__SPATIAL_E2E__?.[h] === "function"), HOOKS).catch(() => false);
    if (ok) return;
    await sleep(300);
  }
  throw new Error(`${what}: the app header and the hooks ${HOOKS.join(", ")} were not there within 90000ms`);
}

/** Opens `path` in `page`, and waits for the Save control and the first pixels. */
async function openFile(page, path, what) {
  const outcome = await hook(page, "openPath", path);
  if (outcome.kind !== "admitted") throw new Error(`openPath(${what}) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  await page.waitForSelector("button.save-project", { timeout: 60_000 });
  for (let i = 0; i < 120; i++) {
    if ((await page.evaluate(async () => (await window.__SPATIAL_E2E__.capturePixels([])).nonBackgroundCount).catch(() => 0)) > 0) return;
    await sleep(500);
  }
  throw new Error(`${what}: no first pixels within 60000ms`);
}

/** The refusal block as the page shows it. */
const shown = (page) =>
  page.evaluate(() => ({
    code: document.querySelector(".admission-panel .admission-refusal-code")?.textContent ?? null,
    owner: document.querySelector(".admission-panel .admission-refusal-owner")?.textContent ?? null,
    running: document.querySelector(".admission-open-cancel") !== null || document.querySelector(".admission-open-liveness") !== null,
  }));

/** One reopen of P through the hook. A refusal must be S9's other-window place with its run ended. */
async function tryOpen(page, other) {
  const answer = await hook(page, "e2eOpenProjectFolder", FOLDER_P);
  if (answer === "admitted") return { answer };
  const at = await shown(page);
  if (answer !== "skp.project_open_elsewhere" || at.code !== answer || at.owner !== other || at.running) {
    throw new Error(`a refused try answered ${answer} and the page shows ${JSON.stringify(at)}, expected skp.project_open_elsewhere, S9's other-window place ${JSON.stringify(other)} and the run ended`);
  }
  return { answer };
}

/** The first `admitted` within the bound; the tries and the elapsed milliseconds are returned as evidence. */
async function pollOpen(page, other) {
  const start = Date.now();
  let last = null;
  for (let tries = 1; tries <= TRIES; tries++) {
    last = (await tryOpen(page, other)).answer;
    if (last === "admitted") return { tries, ms: Date.now() - start };
    await sleep(TRY_MS);
  }
  const err = new Error(`B was still refused after ${TRIES} tries (${Date.now() - start}ms); the last code was ${last}`);
  err.atBound = true;
  throw err;
}

/** What A's log lets the suite say about the release thread's failure line: the bytes this run could read (from the byte where its launch began, cut as bytes and then decoded), and "not in A's log" only of bytes it read. */
function releaseLineIn(fromByte) {
  try {
    const bytes = readFileSync(APP_LOG).subarray(fromByte);
    if (bytes.length === 0) return `${APP_LOG} gave 0 bytes: the log is empty, so the suite cannot tell from it whether the line "${RELEASE_LINE}" was written`;
    const found = bytes.toString("utf8").includes(RELEASE_LINE);
    return `${APP_LOG} gave ${bytes.length} bytes: the line "${RELEASE_LINE}" is ${found ? "in" : "not in"} those bytes`;
  } catch (e) {
    return `no log could be read (${APP_LOG}: ${e.message})`;
  }
}

function dropFolders() {
  for (const path of [FOLDER_P, WV2_B, SCRATCH]) {
    try {
      rmSync(path, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
    } catch (e) {
      console.error(`second-open: could not remove ${path}: ${e.message}`);
    }
  }
}

async function main() {
  if (!existsSync(FIXTURE)) {
    console.error(`second-open: fixture not found: ${FIXTURE}\nRegenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return dropFolders();
  }
  if (typeof lib.attachSecondApp !== "function") {
    console.error("second-open: lib.mjs exports no attachSecondApp, the launcher for app B");
    process.exitCode = 1;
    return dropFolders();
  }
  const other = otherWindowNotice();
  const logFrom = existsSync(APP_LOG) ? statSync(APP_LOG).size : 0;
  let a = null;
  let b = null;
  try {
    mkdirSync(join(HERE, "out"), { recursive: true });
    a = await lib.attachOrLaunch();
    if (!a.launched) throw new Error(`an app is already listening on CDP port ${lib.CDP_PORT}, started with another LOCALAPPDATA; stop it (and its process tree) and run again.`);
    await ready(a.page, "app A");
    b = await lib.attachSecondApp(WV2_B);
    await ready(b.page, "app B");
    console.log(`second-open: A and B are up; store ${SCRATCH}; project folder ${FOLDER_P}`);

    const data = join(FOLDER_P, "parcels.parquet");
    copyFileSync(FIXTURE, data);
    await openFile(a.page, data, "A: the copy in folder P");
    const saved = await hook(a.page, "e2eSaveProjectToFolder", FOLDER_P);
    if (saved !== "asked") throw new Error(`A's e2eSaveProjectToFolder answered ${JSON.stringify(saved)}, expected "asked"`);

    // E-SECOND
    try {
      const first = await tryOpen(b.page, other);
      if (first.answer === "admitted") throw new Error("B's first reopen of P was admitted while A holds P, expected skp.project_open_elsewhere");
      await openFile(a.page, FIXTURE, "A: another file");
      const { tries, ms } = await pollOpen(b.page, other);
      console.log(`[E-SECOND] PASS: B's first try was refused as skp.project_open_elsewhere with S9's other-window place; after A opened another file B's reopen was admitted on try ${tries} (${ms}ms; evidence, not a measurement)`);
    } catch (e) {
      throw new Error(`E-SECOND: ${e.message}${e.atBound ? `; ${releaseLineIn(logFrom)}` : ""}`);
    }

    // E-CRASH-UNLOCK
    try {
      await openFile(b.page, FIXTURE, "B: another file"); // B lets P go
      const own = await pollOpen(a.page, other);
      console.log(`[E-CRASH-UNLOCK] A reopened P on try ${own.tries} (${own.ms}ms); killing A's process tree`);
      await a.stop();
      a = null;
      const { tries, ms } = await pollOpen(b.page, other);
      console.log(`[E-CRASH-UNLOCK] PASS: B's reopen of P was admitted on try ${tries} (${ms}ms; evidence, not a measurement) after A's process tree was killed`);
    } catch (e) {
      throw new Error(`E-CRASH-UNLOCK: ${e.message}`);
    }
  } catch (e) {
    console.error(`second-open: FAIL ${e?.message ?? String(e)}`);
    process.exitCode = 1;
  } finally {
    await b?.stop().catch(() => {});
    await a?.stop().catch(() => {});
    dropFolders();
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
