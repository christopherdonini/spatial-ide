#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- HEADER'/ECHO'/TWOCMD'/HEXLIM'/REFUSAL'/CLASSB'/CLASSC'/
// GROUP'/UNCLASS'/COPYTRUNC'/REGRESS' for NEXT-CUT.md's action-console cut, phase P5. Sibling to
// regression.mjs/admission-remediation.mjs/filter-panel.mjs/style.mjs/publish.mjs -- same
// attach-or-launch path (lib.mjs's attachOrLaunch), same in-page hooks (src/e2e-test-surface.ts:
// openPath, crsCatalog, queryWithFilter, publishPrepareWithDestination), same **E2E-verified**
// evidence-class limit (e2e/README.md).
//
// **What this suite proves, and how**: NEXT-CUT.md's own spine -- "the console composes no
// command text; its only source is the object skp/client.ts::call() hands to invoke" -- is a
// display-truth claim ABOUT THE UI, not about the recorder module in isolation (that half is
// already covered by console/*.test.ts, run under `npm run test`). Every assertion below reads the
// REAL RENDERED DOM (`.console-entry-class-a/-b/-c`, `.console-request-text`, `.console-refusal`,
// …) produced by real user-reachable actions (a real openPath admission, a real mouse pan, a real
// style-panel input, the dev-only publish destination seam) -- never the `consoleRecorder`
// singleton read directly (this file has no import of anything under `src/console/`), because
// doing so would prove something *about the module*, not about what an operator actually sees.
//
// **Grouping technique (GROUP')**: `consoleViewModel.ts`'s `groupConsecutiveEntries` coalesces only
// CONSECUTIVE same-kind-same-name entries. Re-aimed (E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md
// section 2.3): the shipped arm is the candidate arm, where tile queries and session-log lines are also
// recorded, so GROUP' no longer counts new group headers. It asserts the group by what the entries are:
// exactly 3 residential UNTILED `viewport_query` rows (`bbox` null, the primary attempt of each Apply),
// all in one `.console-group`, found by a bounded poll, and the group's `×N` header equal to its rows.
// REFUSAL' polls with a declared bound for the same reason (the refused entry reaches the DOM after the
// hook returns). Neither suite step pins an arm: `main` reads the arm back and stops unless it is the
// shipped one.
//
// Fixture: `filter-zoned.parquet` (2,000 features, declares CRS + native identity -- admits
// cleanly, already used by filter.mjs/filter-panel.mjs/publish.mjs) -- regenerate: `cargo test -p
// spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored
// --nocapture`. Reused for every step below: NEXT-CUT.md's "one-click-two-commands" truth (TWOCMD')
// is about ONE openPath call producing two class-A entries, so this suite only ever opens a dataset
// once.
//
// `waitForMountReady`/`withTimeout`/`sleep` are duplicated from regression.mjs/admission-remediation.mjs
// rather than imported -- this workspace's own established sibling-file convention.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SHELL_DIR = join(HERE, "..");
const REPO_ROOT = join(SHELL_DIR, "..", "..");
const OUT_DIR = join(HERE, "out");
const PUBLISH_OUT_DIR = join(REPO_ROOT, "target", "e2e-publish-out");

const FIXTURE_SMALL = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_FIXTURE =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

// Mirrors `console/recorder.ts`'s own constants -- duplicated per this workspace's sibling-file
// convention (see admission-remediation.mjs's own top comment for the same pattern with
// `MAX_CRS_DEFINITION_BYTES`). Both are load-bearing for COPYTRUNC's own arithmetic below.
const MAX_ENTRY_RENDER_BYTES = 80_000;
// REFUSAL'/GROUP' polls (section 7 of the re-aim form): a CEILING on waiting and the poll's mechanism,
// not latency claims (ADR-018). MAX_CONSOLE_ENTRIES mirrors `console/recorder.ts`'s ring size (the
// sibling-file convention; this file imports nothing from `src/console/`), for GROUP''s capacity check.
const CONSOLE_POLL_BOUND_MS = 5000;
const CONSOLE_POLL_INTERVAL_MS = 100;
const MAX_CONSOLE_ENTRIES = 256;
// The arm this suite runs on is the one that ships (`residency/residencyArm.ts`); nothing here sets one.
const SHIPPED_ARM = "candidate";
// Mirrors `crsAssertionState.ts`'s/`engine::crs::MAX_CRS_DEFINITION_BYTES` -- the REAL
// `CrsAssertionForm` refuses to even enable Submit past this (admission-remediation.mjs's
// OVERBOUND' step proves that client-side gate); the kernel refuses the wire request past it too.
const MAX_CRS_DEFINITION_BYTES = 65_536;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function utf8ByteLength(text) {
  return new TextEncoder().encode(text).length;
}

/** Bounds one step's whole async body -- identical to every sibling suite's own helper. */
function withTimeout(promise, ms, stepId) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`${stepId}: timed out after ${ms}ms`));
    }, ms);
    Promise.resolve(promise).then(
      (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

const MOUNT_READY_TIMEOUT_MS = 90_000;

/** Same gate every sibling suite uses before its first step -- see regression.mjs's own doc comment
 * for the 2026-08-12 fresh-launch race this closes. */
async function waitForMountReady(page, timeoutMs = MOUNT_READY_TIMEOUT_MS) {
  const start = Date.now();
  let lastHeader = null;
  let lastHookPresent = false;
  let lastEvalError = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const info = await page.evaluate(() => ({
        header: document.querySelector(".app-header")?.textContent ?? null,
        hookPresent:
          typeof window.__SPATIAL_E2E__?.openPath === "function" &&
          typeof window.__SPATIAL_E2E__?.crsCatalog === "function",
      }));
      lastHeader = info.header;
      lastHookPresent = info.hookPresent;
      lastEvalError = null;
      if (lastHeader !== null && lastHookPresent) {
        return { readyAfterMs: Date.now() - start };
      }
    } catch (e) {
      lastEvalError = e?.message ?? String(e);
    }
    await sleep(300);
  }

  const missing = [];
  if (lastHeader === null) missing.push(".app-header non-null");
  if (!lastHookPresent) missing.push("window.__SPATIAL_E2E__.openPath/crsCatalog present");
  throw new Error(
    `mount-readiness gate: timed out after ${timeoutMs}ms waiting for ${missing.join(" and ")}. page url=${page.url()}` +
      (lastEvalError ? `, last evaluate error=${lastEvalError}` : "")
  );
}

// ---------------------------------------------------------------------------------------
// Console DOM helpers -- every one of these reads the RENDERED panel, never the recorder module.
// ---------------------------------------------------------------------------------------

async function ensureConsoleExpanded(page) {
  await page.evaluate(() => {
    const btn = document.querySelector(".console-disclosure");
    if (btn && btn.getAttribute("aria-expanded") !== "true") btn.click();
  });
}

async function ensureConsoleCollapsed(page) {
  await page.evaluate(() => {
    const btn = document.querySelector(".console-disclosure");
    if (btn && btn.getAttribute("aria-expanded") === "true") btn.click();
  });
}

/** Clicks every currently-collapsed `×N` group header (I8) so the real, individual entries behind
 * it are in the DOM to read. One pass suffices: expanding a group never creates a new one. Safe to
 * call repeatedly (already-expanded headers are skipped by the `[aria-expanded="false"]` selector).
 * The `await page.evaluate(...)` itself is what guarantees React's own commit has landed by the
 * time this resolves -- same reasoning regression.mjs's `REOPEN'` step documents (a CDP round trip
 * cannot resolve before at least one full microtask checkpoint on the page has passed). */
/**
 * Waits for two consecutive `requestAnimationFrame` ticks in-page -- the standard technique for
 * "any single already-pending coalesced callback has definitely fired by now" (reviewer gate S1,
 * action-console P7 fixes made the expanded console's own sync `coalesceOncePerFrame`-driven, at
 * most once per frame rather than synchronous-on-notify; a read immediately after an action that
 * triggers a NEW recorder entry can otherwise race a still-pending coalesced frame). One rAF alone
 * is not quite enough to guarantee THIS callback (scheduled via `requestAnimationFrame` from
 * inside a React event handler) has already run by the time ours fires, since ordering between two
 * independently-scheduled rAF callbacks within the same frame is not guaranteed either way; two
 * ticks removes that ambiguity entirely.
 */
async function waitForNextConsoleFrame(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined))))
  );
}

/**
 * Expands every currently-collapsed `.console-group-header`. Reviewer gate S5 (action-console P7
 * fixes) made this click itself a recorded class-C action (`console.toggleGroupExpanded` --
 * reflexivity is the point), so this helper now waits for that recording's own coalesced DOM
 * effect to settle (`waitForNextConsoleFrame` above) before returning -- every existing caller
 * already treats this function as "the DOM now reflects every group expanded", which was true
 * unconditionally before S1/S5 and needs this wait to stay true now.
 */
async function expandAllGroups(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click());
  });
  await waitForNextConsoleFrame(page);
}

/** Every rendered class-A row, oldest first, after expanding every group -- the recorder's own
 * `entries()` is never read directly (this file imports nothing from `src/console/`). */
async function readClassAEntries(page) {
  await expandAllGroups(page);
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".console-entry-class-a")).map((el) => {
      const pre = el.querySelector(".console-request-text");
      return {
        header: el.querySelector(".console-entry-header")?.textContent ?? null,
        label: el.querySelector(".console-entry-label")?.textContent ?? null,
        requestText: pre?.textContent ?? null,
        truncated: pre?.classList.contains("console-request-truncated") ?? false,
        truncatedReason: el.querySelector(".console-truncated-reason")?.textContent ?? null,
        outcome: el.querySelector(".console-outcome")?.textContent ?? null,
        refusalCode: el.querySelector(".console-refusal .admission-refusal-code")?.textContent ?? null,
        refusalMessage: el.querySelector(".console-refusal .admission-refusal-message")?.textContent ?? null,
        hasCopyButton: el.querySelector(".console-copy-button") !== null,
      };
    })
  );
}

/** Polls `read()` until `done(value)` holds or `CONSOLE_POLL_BOUND_MS` elapses. Returns the last value. */
async function pollConsole(read, done) {
  const start = Date.now();
  while (true) {
    const last = await read();
    if (done(last)) return { ok: true, last };
    if (Date.now() - start >= CONSOLE_POLL_BOUND_MS) return { ok: false, last };
    await sleep(CONSOLE_POLL_INTERVAL_MS);
  }
}

/** The console disclosure's label, parsed: `Console — N actions (D dropped)`; `total` = count + dropped. */
async function readConsoleLabel(page) {
  const text = await page.evaluate(() => document.querySelector(".console-disclosure")?.textContent ?? "");
  const m = /Console — (\d+) actions?(?: \((\d+) dropped\))?/.exec(text);
  const count = m ? Number(m[1]) : null;
  const dropped = m && m[2] ? Number(m[2]) : 0;
  return { text, count, dropped, total: count === null ? null : count + dropped };
}

/** Every rendered console row in DOM order after expanding every group: its kind (a/b/c), label, request
 * text (class A) and the index of its enclosing `.console-group` (null when it stands alone). */
async function readRowsWithGroups(page) {
  await expandAllGroups(page);
  return page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll(".console-group"));
    return Array.from(document.querySelectorAll(".console-entry")).map((el) => {
      const g = el.closest(".console-group");
      const kind = ["a", "b", "c"].find((k) => el.classList.contains(`console-entry-class-${k}`)) ?? "unclassified";
      return {
        kind,
        label:
          kind === "a"
            ? (el.querySelector(".console-entry-header")?.textContent ?? null)
            : (el.querySelector(".console-entry-prose")?.textContent ?? "").slice(0, 48),
        requestText: el.querySelector(".console-request-text")?.textContent ?? null,
        group: g ? groups.indexOf(g) : null,
        groupHeader: g?.querySelector(".console-group-header")?.textContent ?? null,
      };
    });
  });
}

const RESIDENTIAL_PREDICATE = "zone = 'residential'";

/** The class-A `viewport_query` rows whose parsed request has `bbox === null` and the residential predicate:
 * the primary attempt of an Apply (`App.tsx::applyFilter`); tile queries and the recovery re-issue carry a bbox. */
function residentialUntiledRows(rows) {
  return rows.filter((r) => {
    if (r.kind !== "a" || r.label !== "viewport_query" || r.requestText === null) return false;
    try {
      const q = JSON.parse(r.requestText);
      return q.bbox === null && q.filter?.predicate === RESIDENTIAL_PREDICATE;
    } catch {
      return false;
    }
  });
}

function callOpenPath(page, path, opts) {
  return page.evaluate(({ p, o }) => window.__SPATIAL_E2E__.openPath(p, o), { p: path, o: opts });
}

// ---------------------------------------------------------------------------------------
// Steps.
// ---------------------------------------------------------------------------------------

/**
 * `HEADER'`: expand the drawer -> `.console-standing-header` present, contains all three required
 * phrases (I9's own "said once at the top" claim, `consoleViewModel.ts`'s `CONSOLE_STANDING_HEADER`).
 * Collapse -> the header (and the whole `.console-entries` subtree it lives in) is absent from the
 * DOM entirely, not merely hidden -- the closed-console invariant (I9: zero per-entry DOM work).
 * Leaves the drawer EXPANDED on return -- every later step in this file reads the DOM directly and
 * needs it open.
 */
async function stepHeader(page) {
  await ensureConsoleCollapsed(page);
  const collapsedHeaderPresent = await page.evaluate(() => document.querySelector(".console-standing-header") !== null);
  if (collapsedHeaderPresent) throw new Error("HEADER': .console-standing-header present while the drawer was collapsed");

  await ensureConsoleExpanded(page);
  const headerText = await page.evaluate(() => document.querySelector(".console-standing-header")?.textContent ?? null);
  if (headerText === null) throw new Error("HEADER': .console-standing-header not present after expanding the drawer");
  const requiredPhrases = ["one transport binding", "session-scoped", "not a script you can run"];
  const missing = requiredPhrases.filter((phrase) => !headerText.includes(phrase));
  if (missing.length > 0) {
    throw new Error(`HEADER': standing header missing phrase(s) ${JSON.stringify(missing)}. Actual: ${JSON.stringify(headerText)}`);
  }

  await ensureConsoleCollapsed(page);
  const headerAbsentAfterCollapse = await page.evaluate(() => document.querySelector(".console-standing-header") === null);
  if (!headerAbsentAfterCollapse) throw new Error("HEADER': .console-standing-header still present after re-collapsing the drawer");

  await ensureConsoleExpanded(page); // leave expanded -- every step below reads the DOM directly
  return `expanded: standing header present with all 3 required phrases; collapsed: header (and .console-entries) absent from the DOM entirely (I9)`;
}

/**
 * `ECHO'`: openPath(filter-zoned.parquet, no opts) -> the console gains class-A entries. The
 * open_dataset entry's `.console-request-text` parses as JSON; deep-key-check against exactly
 * {skp, path, cancel_key, crs_assertion, identity} (the fixture-derived key set: `OpenDatasetRequest`,
 * `skp/types.ts`); `crs_assertion`/`identity` are explicit `null` for a plain open (never omitted --
 * `skp/client.ts::openDataset`'s own discipline). Self-consistency, no hard-coded version: the
 * entry's OWN label version token must equal the parsed request's OWN `skp` field.
 */
async function stepEcho(page, ctx) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_SMALL);
  if (outcome.kind !== "admitted") {
    throw new Error(`ECHO': openPath(${FIXTURE_SMALL}) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  }

  const entries = await readClassAEntries(page);
  const openEntries = entries.filter((e) => e.header === "open_dataset");
  const last = openEntries[openEntries.length - 1];
  if (!last) throw new Error("ECHO': no open_dataset class-A entry found in the DOM after openPath");
  if (last.truncated || last.requestText === null) {
    throw new Error(`ECHO': open_dataset entry unexpectedly truncated or empty: ${JSON.stringify(last)}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(last.requestText);
  } catch (e) {
    throw new Error(`ECHO': .console-request-text did not parse as JSON: ${e.message}\nText: ${last.requestText}`);
  }
  const actualKeys = Object.keys(parsed).sort();
  const expectedKeys = ["cancel_key", "crs_assertion", "identity", "path", "skp"].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
    throw new Error(`ECHO': key set mismatch. Expected ${JSON.stringify(expectedKeys)}, got ${JSON.stringify(actualKeys)}`);
  }
  if (parsed.crs_assertion !== null) throw new Error(`ECHO': crs_assertion was not explicit null: ${JSON.stringify(parsed.crs_assertion)}`);
  if (parsed.identity !== null) throw new Error(`ECHO': identity was not explicit null: ${JSON.stringify(parsed.identity)}`);

  const labelMatch = /^SKP (\S+) · control plane$/.exec(last.label ?? "");
  if (!labelMatch) throw new Error(`ECHO': .console-entry-label did not match the expected shape. Actual: ${JSON.stringify(last.label)}`);
  if (labelMatch[1] !== parsed.skp) {
    throw new Error(`ECHO': label version token "${labelMatch[1]}" !== the entry's OWN parsed "skp" field "${parsed.skp}"`);
  }

  ctx.echoSkpVersion = parsed.skp;
  return (
    `open_dataset request parses as JSON with exactly {skp, path, cancel_key, crs_assertion, identity}; ` +
    `crs_assertion/identity explicit null; label version "${labelMatch[1]}" === the entry's own parsed skp ` +
    `field (self-consistent, no hard-coded version anywhere in this suite)`
  );
}

/**
 * `TWOCMD'`: after the ONE openPath call ECHO' already performed, the console shows BOTH
 * open_dataset AND describe entries (the one-click-two-commands truth Part J's J1 judges). No new
 * openPath here -- this step only re-reads the DOM state ECHO' already produced. describe's own
 * request parses with exactly {skp, dataset} (`DescribeRequest`, `skp/types.ts`).
 */
async function stepTwoCmd(page) {
  const entries = await readClassAEntries(page);
  const hasOpen = entries.some((e) => e.header === "open_dataset");
  if (!hasOpen) throw new Error("TWOCMD': no open_dataset entry present (ECHO' should have produced one)");

  const describeEntries = entries.filter((e) => e.header === "describe");
  const last = describeEntries[describeEntries.length - 1];
  if (!last) throw new Error("TWOCMD': no describe entry present from the SAME openPath call");
  if (last.truncated || last.requestText === null) {
    throw new Error(`TWOCMD': describe entry unexpectedly truncated or empty: ${JSON.stringify(last)}`);
  }
  const parsed = JSON.parse(last.requestText);
  const actualKeys = Object.keys(parsed).sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(["dataset", "skp"])) {
    throw new Error(`TWOCMD': describe key set mismatch. Got ${JSON.stringify(actualKeys)}`);
  }
  return `both open_dataset AND describe entries present from the ONE openPath call; describe's request parses with exactly {skp, dataset}`;
}

/**
 * `HEXLIM'`: a real mouse pan (the same gesture regression.mjs's own A5'/A6' drive) issues a real
 * `viewport_query` with a non-null bbox -- the newest such entry's parsed text: bbox members are
 * 16-lowercase-hex strings (`HexF64`, `skp/codec.ts`); `limit` is a string of digits or `null`
 * (`skp/client.ts::viewportQuery` always sends `null` for a pan/zoom-driven query in this cut, but
 * this asserts the allowed SHAPE, not the specific value). Also asserts from the RAW pretty-printed
 * text that each hex value survives quoted verbatim (I5: no scalar prettified inside copy text).
 */
async function stepHexlim(page, consoleHandle) {
  const rect = await page.evaluate(() => {
    const el = document.querySelector(".working-canvas");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
  if (!rect) throw new Error("HEXLIM': .working-canvas not found");
  const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 90, center.y + 45, { steps: 8 });
  await page.mouse.up();
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });

  const entries = await readClassAEntries(page);
  const vqEntries = entries.filter((e) => e.header === "viewport_query");
  const last = vqEntries[vqEntries.length - 1];
  if (!last) throw new Error("HEXLIM': no viewport_query class-A entry found after panning");
  if (last.truncated || last.requestText === null) {
    throw new Error(`HEXLIM': viewport_query entry unexpectedly truncated or empty: ${JSON.stringify(last)}`);
  }

  const parsed = JSON.parse(last.requestText);
  const actualKeys = Object.keys(parsed).sort();
  // skp/0.6 added `columns`, always present (`protocol/skp/SKP-V0.md`); the shell's client sends `null`.
  // Its value is not asserted here, only the key list.
  const expectedKeys = ["bbox", "bbox_crs", "columns", "dataset", "filter", "limit", "skp"].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
    throw new Error(`HEXLIM': key set mismatch. Expected ${JSON.stringify(expectedKeys)}, got ${JSON.stringify(actualKeys)}`);
  }

  const hex16 = /^[0-9a-f]{16}$/;
  let bboxNote;
  if (parsed.bbox === null) {
    bboxNote = "bbox null (no non-null hex members to check this run)";
  } else {
    for (const key of ["xmin", "ymin", "xmax", "ymax"]) {
      const value = parsed.bbox[key];
      if (typeof value !== "string" || !hex16.test(value)) {
        throw new Error(`HEXLIM': bbox.${key} is not a 16-lowercase-hex string: ${JSON.stringify(value)}`);
      }
      if (!last.requestText.includes(`"${value}"`)) {
        throw new Error(`HEXLIM': raw text does not contain bbox.${key}'s value quoted verbatim ("${value}") -- prettification suspected`);
      }
    }
    bboxNote = `bbox 4x16-lowercase-hex (xmin=${parsed.bbox.xmin}, ymin=${parsed.bbox.ymin}, xmax=${parsed.bbox.xmax}, ymax=${parsed.bbox.ymax}), each verified quoted verbatim in the raw text`;
  }

  if (parsed.limit !== null && !/^[0-9]+$/.test(parsed.limit)) {
    throw new Error(`HEXLIM': limit is neither null nor a digits-only string: ${JSON.stringify(parsed.limit)}`);
  }

  return `after a real pan: ${bboxNote}; limit=${JSON.stringify(parsed.limit)} (digits-string-or-null, both allowed)`;
}

/**
 * `REFUSAL'`: an invalid predicate through `queryWithFilter` (`skp.filter_unknown_column`, the same
 * predicate filter.mjs/filter-panel.mjs already establish triggers this refusal) -> the class-A
 * viewport_query entry's `.console-outcome` reads "refused"; `.console-refusal` shows the SAME
 * typed code and verbatim message `queryWithFilter`'s own returned outcome carries -- compared to
 * that live value, never a hard-coded literal.
 */
async function stepRefusal(page) {
  const predicate = "bogus_column_xyz = 1";
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.queryWithFilter(p), predicate);
  if (outcome.kind !== "refused") {
    throw new Error(`REFUSAL': queryWithFilter("${predicate}") returned ${JSON.stringify(outcome)}, expected {kind:"refused"}`);
  }

  // The refused entry reaches the DOM after the hook returns (the candidate arm), so poll for it with a
  // declared bound: a refused `viewport_query` row whose refusal block is rendered. Not a fixed sleep.
  const refusedRows = (entries) => entries.filter((e) => e.header === "viewport_query" && e.outcome === "refused" && e.refusalCode !== null);
  const polled = await pollConsole(() => readClassAEntries(page), (entries) => refusedRows(entries).length > 0);
  if (!polled.ok) {
    const label = await readConsoleLabel(page);
    throw new Error(
      `REFUSAL': no refused viewport_query class-A entry with its refusal block within the declared bound ` +
        `(${CONSOLE_POLL_BOUND_MS}ms, polled every ${CONSOLE_POLL_INTERVAL_MS}ms); console label count=${label.count} dropped=${label.dropped}`
    );
  }
  const refusedVq = refusedRows(polled.last);
  const last = refusedVq[refusedVq.length - 1];
  if (last.refusalCode !== outcome.refusal.code) {
    throw new Error(`REFUSAL': DOM refusal code "${last.refusalCode}" !== queryWithFilter's own outcome.refusal.code "${outcome.refusal.code}"`);
  }
  if (last.refusalMessage !== outcome.refusal.message) {
    throw new Error(
      `REFUSAL': DOM refusal message not verbatim.\nDOM:      ${last.refusalMessage}\nOutcome:  ${outcome.refusal.message}`
    );
  }
  return `queryWithFilter("${predicate}") refused ${outcome.refusal.code}; .console-outcome reads "refused"; .console-refusal shows the SAME typed code + verbatim message the returned outcome itself carries (self-consistent)`;
}

/** A fresh, non-existent `<parent>/bundle` destination under its own freshly-created parent --
 * mirrors publish.mjs's own `freshDestination` helper (`resolve_destination` requires the parent to
 * exist and the destination itself not to). */
function freshDestination(label) {
  const parent = join(PUBLISH_OUT_DIR, `${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  mkdirSync(parent, { recursive: true });
  return join(parent, "bundle");
}

/**
 * `CLASSB'`: `publishPrepareWithDestination` (the dev seam) -> a class-B entry appears naming
 * `binding_publish_prepare_e2e_destination`. No `.console-copy-button` inside it; no `{` anywhere in
 * its rendered row text (I6: no JSON block, ADR-024's fence); its citation contains "not callable".
 * The destination path string itself appears NOWHERE in the console DOM (`.console-panel`'s own
 * `textContent`) -- the fence, proven at the UI, not merely asserted about the registry table.
 *
 * Checked in BOTH the raw form and its JSON-escaped form (`JSON.stringify(destination).slice(1,
 * -1)` -- reviewer gate S6, action-console P7 fixes): on Windows the destination contains `\`
 * separators, which read as literal characters in the raw path but as `\\` once JSON-escaped
 * (e.g. inside a `JSON.stringify`'d argument object some other display path might render); a raw
 * path is NOT a substring of its own escaped form (each `\` no longer matches the doubled `\\`),
 * so checking only the raw form could miss a leak that only ever appeared escaped.
 */
async function stepClassB(page) {
  const destination = freshDestination("console-classb");
  const destinationEscaped = JSON.stringify(destination).slice(1, -1);
  const outcome = await page.evaluate(
    ({ d }) => window.__SPATIAL_E2E__.publishPrepareWithDestination(d, "whole"),
    { d: destination }
  );
  if (outcome.status !== "prompt") {
    throw new Error(`CLASSB': publishPrepareWithDestination returned ${JSON.stringify(outcome)}, expected {status:"prompt"}`);
  }

  await expandAllGroups(page);
  const result = await page.evaluate(
    ({ command, destinationPath, destinationPathEscaped }) => {
      const entries = Array.from(document.querySelectorAll(".console-entry-class-b"));
      const matches = entries.filter((el) => (el.querySelector(".console-entry-prose")?.textContent ?? "").includes(command));
      const last = matches[matches.length - 1] ?? null;
      const panelText = document.querySelector(".console-panel")?.textContent ?? "";
      return {
        found: last !== null,
        prose: last?.querySelector(".console-entry-prose")?.textContent ?? null,
        citation: last?.querySelector(".console-entry-citation")?.textContent ?? null,
        hasCopyButton: last ? last.querySelector(".console-copy-button") !== null : false,
        entryHasBrace: last ? last.textContent.includes("{") : null,
        destinationLeakedRaw: panelText.includes(destinationPath),
        destinationLeakedEscaped: panelText.includes(destinationPathEscaped),
      };
    },
    { command: "binding_publish_prepare_e2e_destination", destinationPath: destination, destinationPathEscaped: destinationEscaped }
  );
  if (!result.found) throw new Error("CLASSB': no .console-entry-class-b entry naming binding_publish_prepare_e2e_destination found");
  if (result.hasCopyButton) throw new Error("CLASSB': a .console-copy-button was present inside the class-B entry");
  if (result.entryHasBrace) throw new Error(`CLASSB': the class-B entry row's rendered text contained "{". Full result: ${JSON.stringify(result)}`);
  if (result.citation === null || !result.citation.includes("not callable")) {
    throw new Error(`CLASSB': citation missing "not callable". Actual: ${JSON.stringify(result.citation)}`);
  }
  if (result.destinationLeakedRaw || result.destinationLeakedEscaped) {
    throw new Error(
      `CLASSB': the destination path "${destination}" appeared somewhere in .console-panel's own DOM text ` +
      `(raw: ${result.destinationLeakedRaw}, JSON-escaped: ${result.destinationLeakedEscaped})`
    );
  }
  return `publishPrepareWithDestination -> class-B entry names binding_publish_prepare_e2e_destination ("${result.prose}"); no copy button; no "{" anywhere in the row; citation contains "not callable"; destination path absent from the whole .console-panel DOM (checked raw and JSON-escaped)`;
}

/**
 * `CLASSC'`: a real style edit through the rendered `.style-panel` DOM (`style.mjs`'s own proven
 * `page.fill` technique for `type="color"`) -> a class-C entry appears with "no API equivalent"
 * language and an owner string containing "ADR-022"; no copy button (I6, and structurally
 * impossible anyway -- `ClassCRowViewModel` carries no field a copy button could read).
 *
 * Filtered to owner-contains-"ADR-022" BEFORE taking the last match (reviewer gate S5, S6,
 * action-console P7 fixes) -- not simply "the last class-C entry": `expandAllGroups` below clicks
 * every collapsed `.console-group-header`, and since S5 made `console.toggleGroupExpanded` itself
 * a recorded class-C action (reflexivity is the point), that click can add a LATER class-C entry
 * of its own (owner "docs/03..."), which a bare "last entry" selection would wrongly grab instead
 * of the style edit's own entry.
 */
async function stepClassC(page) {
  // RECORDED MUTATION (milestone 1 re-aim), OBSERVED AT 65391e79b048f51f3ca4d7b5eeac7533f5b64639: the owner of the `style.setFillColor` row in
  // src/console/surfaceRegistry.ts changed from "ADR-022 / ADR-023" to "docs/03". CLASSC' failed with "no .console-entry-class-c
  // entry with an ADR-022 owner found after the style edit". Reverted; the worktree was clean before and after.
  // Milestone 1 re-aim (the human's Decision A; PRE-REGISTRATION Amendment 6, OPEN-3 (a) as `style.mjs` has it): Style is
  // the Inspector's own tab, hidden until selected, so a real fill needs a real click on the tab first.
  await page.click("#inspector-tab-style");
  await page.evaluate(() => {
    const btn = document.querySelector(".style-disclosure");
    if (btn && btn.getAttribute("aria-expanded") !== "true") btn.click();
  });
  const fillColorPresent = await page.evaluate(() => document.querySelector(".style-fill-color") !== null);
  if (!fillColorPresent) throw new Error("CLASSC': .style-fill-color not present after expanding the style panel");
  await page.fill(".style-fill-color", "#112233");
  // Back to the Layer tab the suite's later steps were written with (REGRESS' re-runs `regression.mjs` on this same page); the
  // one click above must change nothing else.
  await page.click("#inspector-tab-layer");

  await expandAllGroups(page);
  const entries = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".console-entry-class-c")).map((el) => ({
      statement: el.querySelector(".console-entry-prose")?.textContent ?? null,
      owner: el.querySelector(".console-entry-owner")?.textContent ?? null,
      hasCopyButton: el.querySelector(".console-copy-button") !== null,
    }))
  );
  const styleEntries = entries.filter((e) => (e.owner ?? "").includes("ADR-022"));
  const last = styleEntries[styleEntries.length - 1];
  if (!last) throw new Error("CLASSC': no .console-entry-class-c entry with an ADR-022 owner found after the style edit");
  if (last.statement === null || !last.statement.includes("no API equivalent")) {
    throw new Error(`CLASSC': statement missing "no API equivalent". Actual: ${JSON.stringify(last.statement)}`);
  }
  if (last.owner === null || !last.owner.includes("ADR-022")) {
    throw new Error(`CLASSC': owner missing "ADR-022". Actual: ${JSON.stringify(last.owner)}`);
  }
  if (last.hasCopyButton) throw new Error("CLASSC': a .console-copy-button was present inside a class-C entry");
  return `style.setFillColor -> class-C entry: statement contains "no API equivalent" ("${last.statement}"); owner contains "ADR-022" ("${last.owner}"); no copy button`;
}

/**
 * `GROUP'`: 3 identical `queryWithFilter` calls, awaited in sequence -> ONE `.console-group` holds exactly
 * those 3 residential untiled `viewport_query` rows, its header reads `×N` for the N rows it shows, and
 * expanding it yields individually-parseable `.console-request-text` blocks, never a single merged/synthetic
 * text (I8). Re-aimed (E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md section 2.3, option 1): the group is
 * asserted by what its entries ARE, never by counting every new `.console-group-header` (the candidate arm
 * records tile queries and session-log lines too). Steps: settle, so no earlier generation is in flight;
 * read the baseline (label total; the residential untiled count must be 0); make the 3 calls; poll (declared
 * bound) for exactly 3 such rows all inside one `.console-group`. Capacity: the label's total after the poll
 * minus the baseline, R, must not exceed `MAX_CONSOLE_ENTRIES`, or the ring may have evicted the step's own
 * rows. What varies is read, not assumed: `ViewportQueryRequest` carries no per-call nonce, so the 3 texts
 * are expected BYTE-IDENTICAL -- reported, not asserted. On expiry the message names where each found row is
 * and the kinds of the rows between them (so a row of another kind splitting the group shows by name).
 */
async function stepGroup(page, consoleHandle) {
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
  const baselineRows = await readRowsWithGroups(page);
  const baseline = await readConsoleLabel(page);
  const baselineResidential = residentialUntiledRows(baselineRows).length;
  if (baselineResidential !== 0) {
    throw new Error(`GROUP': baseline already holds ${baselineResidential} residential untiled row(s), expected 0`);
  }

  for (let i = 0; i < 3; i++) {
    const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.queryWithFilter(p), RESIDENTIAL_PREDICATE);
    if (outcome.kind !== "applied") {
      throw new Error(`GROUP': queryWithFilter #${i + 1} of 3 returned ${JSON.stringify(outcome)}, expected {kind:"applied"}`);
    }
  }

  const found = await pollConsole(
    async () => ({ rows: await readRowsWithGroups(page), label: await readConsoleLabel(page) }),
    ({ rows }) => {
      const res = residentialUntiledRows(rows);
      return res.length === 3 && res.every((r) => r.group !== null && r.group === res[0].group);
    }
  );
  const { rows, label } = found.last;
  const R = label.total - baseline.total;
  if (R > MAX_CONSOLE_ENTRIES) {
    throw new Error(`GROUP': capacity: ${R} entries were recorded since the baseline (label total ${label.total} - ${baseline.total}), more than the ring's ${MAX_CONSOLE_ENTRIES}`);
  }
  const res = residentialUntiledRows(rows);
  if (!found.ok) {
    const at = res.map((r) => rows.indexOf(r));
    const between = at.length === 0 ? [] : rows.slice(Math.min(...at), Math.max(...at) + 1).map((r) => `${r.kind}:${r.label}${r.group === null ? "" : `@group${r.group}`}`);
    throw new Error(
      `GROUP': expected 3 residential untiled rows in one .console-group within ${CONSOLE_POLL_BOUND_MS}ms (polled every ${CONSOLE_POLL_INTERVAL_MS}ms), ` +
        `found ${res.length}, in groups ${JSON.stringify(res.map((r) => r.group))}; rows from the first found to the last, in DOM order: ${JSON.stringify(between)}; ` +
        `console label total ${label.total} (baseline ${baseline.total}, R=${R})`
    );
  }

  const inGroup = rows.filter((r) => r.group === res[0].group);
  const header = res[0].groupHeader;
  if (header !== `×${inGroup.length}`) {
    throw new Error(`GROUP': the group's header reads ${JSON.stringify(header)} but it shows ${inGroup.length} row(s), expected "×${inGroup.length}"`);
  }
  if (!inGroup.every((r) => r.kind === "a" && r.label === "viewport_query")) {
    throw new Error(`GROUP': not every row in the group was viewport_query. Actual: ${JSON.stringify(inGroup.map((r) => `${r.kind}:${r.label}`))}`);
  }
  inGroup.forEach((r, i) => {
    try {
      JSON.parse(r.requestText);
    } catch (e) {
      throw new Error(`GROUP': row #${i + 1} of the group did not individually parse as JSON: ${e.message}`);
    }
  });
  const distinct = new Set(res.map((r) => r.requestText));
  const varyNote =
    distinct.size === 1
      ? "all 3 texts BYTE-IDENTICAL (viewport_query carries no per-call nonce on the wire)"
      : `${distinct.size} distinct texts among the 3 (something DID vary -- read, not assumed)`;

  return `3 identical queryWithFilter calls -> 3 residential untiled viewport_query rows in ONE .console-group, header "${header}" for N=${inGroup.length} row(s), each individually parseable (never a merged text, I8); ${varyNote}; R=${R} <= ${MAX_CONSOLE_ENTRIES} (no eviction of the step's own rows)`;
}

/**
 * `UNCLASS'`: `.console-entry-unclassified` count is 0 ACROSS THE WHOLE RUN (the registry is
 * complete; the defect row exists in `ConsolePanel.tsx`'s own `ConsoleRow` switch but must never
 * fire) -- run after every other DOM-producing step above, with every group expanded, so this is a
 * true whole-run count, not a point-in-time one.
 *
 * (Note: the piece's own selector shorthand read `.console-entry-class-unclassified`; the actual
 * rendered class name, read from `ConsolePanel.tsx`'s own `ConsoleRow` switch, is
 * `.console-entry-unclassified` -- used here, since the real DOM is the ground truth this whole
 * suite exists to check against.)
 */
async function stepUnclass(page) {
  await expandAllGroups(page);
  const unclassified = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".console-entry-unclassified")).map((el) => el.textContent)
  );
  if (unclassified.length !== 0) {
    throw new Error(`UNCLASS': ${unclassified.length} unclassified entr(y/ies) found: ${JSON.stringify(unclassified)}`);
  }
  return `.console-entry-unclassified count is 0 across the whole run so far (every group expanded first)`;
}

/**
 * `COPYTRUNC'`: see this file's own top-level design note. The named technique -- "a large pasted
 * definition via crsAssertion" -- is driven for real: a NEAR-CAP (exactly `MAX_CRS_DEFINITION_BYTES`
 * = 65_536 bytes) `crsAssertion.definitionJson`, built by padding the REAL pinned catalog definition
 * (`crsCatalog()`) with a low-quote-density filler key (so JSON-escaping the inner PROJJSON text
 * inside the outer request's own `JSON.stringify` cannot silently blow the byte budget -- the
 * subtlety a pure-arithmetic version of this check would have missed: `definition_json` is a STRING
 * VALUE holding already-serialized JSON text, so every `"` inside it doubles to `\"` when the OUTER
 * request is stringified for display; padding with quote-free filler keeps that expansion bounded to
 * the real catalog definition's own (small) share of the total).
 *
 * This is driven through `openPath` (bypassing `CrsAssertionForm`'s own client-side ≤65_536 gate,
 * same as every other `openPath({crsAssertion})` call in this and `admission-remediation.mjs`) --
 * the ONE gap between "what the dev surface can send" and "what a real operator, using the real
 * form, could ever cause to be sent." Going PAST 65_536 (to force real truncation) would need
 * EXACTLY that gap: the real `CrsAssertionForm` disables Submit before ever reaching `admitPath`
 * once a pasted definition exceeds the byte limit (`admission-remediation.mjs`'s OVERBOUND' step
 * proves this empirically) -- so no REAL, UI-reachable request can ever carry a `definition_json`
 * over 65_536 bytes in the first place. That is the honest boundary this step tests: the largest
 * definition ANY real user interaction could ever produce, and whether IT alone can cross the
 * render ceiling. It cannot -- confirmed empirically below, not merely by arithmetic.
 */
async function stepCopytrunc(page) {
  const catalog = await page.evaluate(() => window.__SPATIAL_E2E__.crsCatalog());
  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error("COPYTRUNC': crsCatalog() returned no entries to build a near-cap definition from");
  }
  const base = JSON.parse(catalog[0].definition);
  const baseBytes = utf8ByteLength(JSON.stringify(base));
  const withoutPadding = JSON.stringify({ ...base, _e2e_copytrunc_padding: "" });
  const paddingNeeded = MAX_CRS_DEFINITION_BYTES - utf8ByteLength(withoutPadding);
  if (paddingNeeded < 0) {
    throw new Error(
      `COPYTRUNC': the base catalog definition alone (${baseBytes} bytes) already exceeds MAX_CRS_DEFINITION_BYTES (${MAX_CRS_DEFINITION_BYTES}) -- cannot build a near-cap definition this way`
    );
  }
  const padded = JSON.stringify({ ...base, _e2e_copytrunc_padding: "x".repeat(paddingNeeded) });
  const paddedBytes = utf8ByteLength(padded);
  if (paddedBytes !== MAX_CRS_DEFINITION_BYTES) {
    throw new Error(`COPYTRUNC': padded definition is ${paddedBytes} bytes, expected exactly ${MAX_CRS_DEFINITION_BYTES}`);
  }

  const crsAssertion = { identifier: "TEST:COPYTRUNC-NEAR-CAP", definitionJson: padded };
  await callOpenPath(page, FIXTURE_SMALL, { crsAssertion }); // outcome irrelevant -- recorded pre-await regardless

  const entries = await readClassAEntries(page);
  const openEntries = entries.filter((e) => e.header === "open_dataset");
  const last = openEntries[openEntries.length - 1];
  if (!last) throw new Error("COPYTRUNC': no open_dataset entry found after the near-cap-definition open");

  if (last.truncated) {
    return (
      `REACHABLE: a near-cap (${paddedBytes}-byte) crsAssertion.definitionJson DID push the rendered ` +
      `entry over MAX_ENTRY_RENDER_BYTES (${MAX_ENTRY_RENDER_BYTES}) -- ${last.truncatedReason}`
    );
  }
  if (last.requestText === null) throw new Error("COPYTRUNC': untruncated entry had no .console-request-text");
  const renderedBytes = utf8ByteLength(last.requestText);
  return (
    `NOT-REACHABLE (empirically confirmed, not just arithmetic): a near-cap crsAssertion.definitionJson ` +
    `(base catalog definition ${baseBytes} bytes, padded to exactly MAX_CRS_DEFINITION_BYTES=${MAX_CRS_DEFINITION_BYTES}) ` +
    `driven through openPath rendered UNTRUNCATED at ${renderedBytes} bytes < MAX_ENTRY_RENDER_BYTES=${MAX_ENTRY_RENDER_BYTES} ` +
    `(margin ${MAX_ENTRY_RENDER_BYTES - renderedBytes} bytes; the whole rendered request is only ` +
    `${renderedBytes - paddedBytes} bytes larger than the ${paddedBytes}-byte definition string alone -- NOT purely the ` +
    `cost of JSON-escaping that string's own inner quotes: this difference also includes the request's other fields ` +
    `(skp version, dataset path, cancel_key, crs_assertion.identifier) and JSON.stringify's own 2-space pretty-print ` +
    `indentation, neither decomposed out here. Small regardless, since the quote-free padding diluted the base ` +
    `definition's own quote density across the full 65_536 bytes). No REAL, ` +
    `UI-reachable request can carry a larger definition_json at all: the real CrsAssertionForm disables Submit before ` +
    `${MAX_CRS_DEFINITION_BYTES} bytes (admission-remediation.mjs's OVERBOUND'), so this near-cap value is already the ` +
    `largest ANY operator action could ever send. By construction, no other class-A field is bounded anywhere near the ` +
    `render ceiling either (open_dataset's path/cancel_key are short; viewport_query's filter.predicate has no declared ` +
    `max length in this slice, but was not driven here -- out of this step's named technique, "a large pasted definition ` +
    `via crsAssertion" -- so COPYTRUNC's truncated branch stays a real, unexercised code path today, not a fired one)`
  );
}

/**
 * `REGRESS'`: `npm run e2e:regression` and `npm run e2e:admission`, both spawned from THIS process
 * (which already holds the app's CDP port open) -> both attach rather than relaunch, so this is
 * genuinely "the same fresh session" the piece asks for, not three separate app instances. Both
 * must exit 0.
 */
function runSuite(npmScript, label) {
  const started = Date.now();
  const result = spawnSync("npm", ["run", npmScript], {
    cwd: SHELL_DIR,
    shell: process.platform === "win32",
    encoding: "utf8",
  });
  return {
    label,
    exitCode: result.status,
    ms: Date.now() - started,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

/** Last ~2000 chars of a suite's own stdout -- enough to carry its "== Summary ==" table without
 * dumping the entire, sometimes-large, transcript into this suite's own RESULT line. */
function tail(text, n = 2000) {
  return text.length > n ? `…${text.slice(-n)}` : text;
}

async function stepRegress() {
  const regression = runSuite("e2e:regression", "e2e:regression");
  if (regression.exitCode !== 0) {
    throw new Error(
      `REGRESS': npm run e2e:regression exited ${regression.exitCode} (${regression.ms}ms). Tail:\n${tail(regression.stdout)}\n${tail(regression.stderr)}`
    );
  }
  const admission = runSuite("e2e:admission", "e2e:admission");
  if (admission.exitCode !== 0) {
    throw new Error(
      `REGRESS': npm run e2e:admission exited ${admission.exitCode} (${admission.ms}ms). Tail:\n${tail(admission.stdout)}\n${tail(admission.stderr)}`
    );
  }
  return `npm run e2e:regression exited 0 (${regression.ms}ms); npm run e2e:admission exited 0 (${admission.ms}ms); both attached to THIS run's own already-launched app (same fresh session)`;
}

// ---------------------------------------------------------------------------------------

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 2_400_000); // 40 min: REGRESS' alone can spend up to ~25 min in its two sub-suites' own worst-case deadlines
  const watchdog = setTimeout(() => {
    console.error(`console: SPATIAL_E2E_DEADLINE_MS (default 2400000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE_SMALL)) {
    console.error(`console: fixture not found: ${FIXTURE_SMALL}`);
    console.error(`Regenerate with:\n  ${REGEN_FIXTURE}`);
    process.exitCode = 1;
    return;
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`console: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL", note: string}>} */
  const results = [];
  const ctx = {};

  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
    }
  }

  try {
    console.log(`console: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(`console: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms`);

    // The assumption made explicit (regression.mjs's precedent): the suite runs on the arm that ships and
    // pins none, so a readback that is not the shipped arm is a harness failure (e.g. an attach to an app a
    // prior script left pinned), by name, not a step failure.
    const armReadback = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
    if (armReadback !== SHIPPED_ARM) {
      throw new Error(
        `console: expected the shipped default residency arm (${JSON.stringify(SHIPPED_ARM)}) but readback was ${JSON.stringify(armReadback)} -- ` +
          `no arm is set or pinned by this suite`
      );
    }

    // Harness hygiene, matching every sibling suite's own convention: clear any dismissable banner
    // a previous run (or prior interactive use) may have left up.
    await page
      .evaluate(() => {
        document.querySelectorAll(".canvas-refusal button, .error-banner button").forEach((b) => b.click());
      })
      .catch(() => {});

    await runStep("HEADER'", 30_000, () => stepHeader(page));
    await runStep("ECHO'", 60_000, () => stepEcho(page, ctx));
    await runStep("TWOCMD'", 20_000, () => stepTwoCmd(page));
    await runStep("HEXLIM'", 30_000, () => stepHexlim(page, consoleHandle));
    await runStep("REFUSAL'", 30_000, () => stepRefusal(page));
    await runStep("CLASSB'", 30_000, () => stepClassB(page));
    await runStep("CLASSC'", 20_000, () => stepClassC(page));
    // GROUP' outer bound 45s: the settle, the three calls and the poll. A bound, not a duration.
    await runStep("GROUP'", 45_000, () => stepGroup(page, consoleHandle));
    await runStep("COPYTRUNC'", 30_000, () => stepCopytrunc(page));
    await runStep("UNCLASS'", 20_000, () => stepUnclass(page));
    await runStep("REGRESS'", 30 * 60_000, () => stepRegress());

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    const statusWidth = 6;
    console.log(`${"Step".padEnd(idWidth)}  ${"Status".padEnd(statusWidth)}  Note`);
    console.log(`${"-".repeat(idWidth)}  ${"-".repeat(statusWidth)}  ${"-".repeat(40)}`);
    for (const r of results) {
      console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(statusWidth)}  ${r.note}`);
    }

    const anyFail = results.some((r) => r.status === "FAIL");
    process.exitCode = anyFail ? 1 : 0;
  } catch (e) {
    console.error(`console: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `console-render-trace-${Date.now()}.json`);
      writeFileSync(
        ledgerPath,
        JSON.stringify({ renderTrace: consoleHandle.renderTrace(), allConsoleEntries: consoleHandle.entries }, null, 2)
      );
      console.log(`Full render-trace ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`console: failed to write the render-trace ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    await browser.close().catch(() => {});
    console.log(
      launched
        ? `This run launched the app; it stays RUNNING on CDP port ${CDP_PORT} for further interactive use.`
        : `Attached to an already-running app on CDP port ${CDP_PORT}; leaving it running.`
    );
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
