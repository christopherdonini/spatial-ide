#!/usr/bin/env node
// E2E TEST SURFACE (e2e/README.md) -- APPROVED'/REFUSED'/FILTERED' steps for NEXT-CUT.md's
// publish cut, phase P4. Sibling to regression.mjs/filter.mjs/filter-panel.mjs/style.mjs, not
// folded into any of them: same attach-or-launch path (`lib.mjs`), same watchdog/deadline
// discipline, same **E2E-verified** evidence class (e2e/README.md) -- driven through real IPC and
// the real permission boundary (`kernel/src/permission/boundary.rs`), not a parallel path.
//
// ## The native destination picker, and why this suite does NOT exercise it
//
// `binding_publish_prepare`'s own native OS save dialog has no CDP-reachable automation path at
// all (WebView2's dialog chrome is invisible to a CDP driver, same limit `openPath` works around
// for admission's picker) -- and unlike admission, publish's picker is fused *inside* that one
// Tauri command, not a separate command JS could simply skip calling. So this suite drives
// `window.__SPATIAL_E2E__.publishPrepareWithDestination` instead of `publishPrepare`: a **dev-only
// test seam** (`commands.rs::binding_publish_prepare_e2e_destination`, `#[cfg(debug_assertions)]`,
// compiled out of a release build) that supplies the destination directly and otherwise runs the
// IDENTICAL `publish::prepare` code path the real command runs -- same `preflight`, and the grant
// is still minted **host-side** from the supplied destination (never from a JS-asserted grant;
// F-5's "the requester never mints the grant" holds through this seam exactly as it does for the
// real command). **This suite therefore proves everything past the picker -- prompt composition,
// grant minting, approval, execution, audit -- but does NOT prove the native picker itself renders
// or behaves correctly. Only the operator's manual walkthrough (MANUAL-WALKTHROUGH.md Part G)
// exercises the real dialog.** `publishExecute` (driving the real Submit button's own function) is
// unchanged from P2/P3 and IS exercised here, same as every other suite in this tree.
//
// ## Audit-log determinism
//
// Reads back `SPATIAL_IDE_AUDIT_LOG` if the invoking environment set one (a temp path, for
// isolation), else the real per-user default (`kernel/src/permission/audit/log.rs::resolve_log_path`'s
// own Windows branch, mirrored below) -- either way, only correct against a FRESHLY LAUNCHED app,
// because an already-running instance this script merely attaches to was started with whatever
// environment IT had, not this process's. `main()` below refuses to proceed if `attachOrLaunch`
// attached rather than launched, rather than silently reading from an indeterminate log.
//
// `waitForMountReady`/`waitForHook`/`withTimeout` are duplicated from filter.mjs rather than
// imported -- this workspace's own established convention for sibling test files.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, CDP_PORT } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "out");
const REPO_ROOT = join(HERE, "..", "..", "..");
const PUBLISH_OUT_DIR = join(REPO_ROOT, "target", "e2e-publish-out");

const FIXTURE_FILTER = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

// `manual_walkthrough_fixtures.rs::generate_the_filter_fixture`'s own spec (`features: 2_000`, no
// bbox/limit anywhere in this suite) -- so a whole-file publish over this fixture must carry
// exactly this many rows, filter active or not (FILTERED' is what proves "or not").
const FIXTURE_FILTER_FEATURES = 2000;

// Verbatim from `publish.rs::FILTER_SCOPE_SENTENCE` / `types.ts::FILTER_SCOPE_SENTENCE` -- the
// conditional block's own sentence (NEXT-CUT.md), pinned equal to both by
// `PublishPanel.test.ts` already; this suite adds the third, end-to-end pin.
const FILTER_SCOPE_SENTENCE =
  "this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing " +
  "publishes the viewport extent, not your filter";

// A representative subset of `kernel/src/bundle/redaction.rs::CREDENTIAL_NEEDLES` -- not the
// authoritative scan (that already runs host-side, unconditionally, and refuses to WRITE a record
// containing one; a credential-bearing record cannot reach this script's read-back at all). This
// is this suite's own independent sanity net over the bytes actually on disk.
const CREDENTIAL_NEEDLES = [
  "credential",
  "password",
  "passwd",
  "secret",
  "api_key",
  "apikey",
  "authorization:",
  "bearer ",
  "private_key",
  "begin rsa",
];

/** Bounds one step's whole async body -- identical to the other suites' own helper. */
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

/** Same gate every other suite uses before its first step -- see filter.mjs's own doc comment for
 * the fresh-launch race this closes (a WebView2 page target existing is not the same fact as React
 * having mounted). */
async function waitForMountReady(page, timeoutMs = MOUNT_READY_TIMEOUT_MS) {
  const start = Date.now();
  let lastHeader = null;
  let lastHookPresent = false;
  let lastEvalError = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const info = await page.evaluate(() => ({
        header: document.querySelector(".app-header")?.textContent ?? null,
        hookPresent: typeof window.__SPATIAL_E2E__?.openPath === "function",
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
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const missing = [];
  if (lastHeader === null) missing.push(".app-header non-null");
  if (!lastHookPresent) missing.push("window.__SPATIAL_E2E__.openPath present");
  throw new Error(
    `mount-readiness gate: timed out after ${timeoutMs}ms waiting for ${missing.join(" and ")}. page url=${page.url()}` +
      (lastEvalError ? `, last evaluate error=${lastEvalError}` : "")
  );
}

/** Polls for a named hook to appear on `window.__SPATIAL_E2E__` -- both
 * `publishPrepareWithDestination` and `publishExecute` register only once something exists to
 * drive them (a dataset is admitted; a `PublishDialog` is actually mounted), so a caller must wait
 * rather than assume they are already present the instant a preceding step's promise resolves. */
async function waitForHook(page, hookName, timeoutMs = 20_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const present = await page.evaluate(
      (name) => typeof window.__SPATIAL_E2E__?.[name] === "function",
      hookName
    );
    if (present) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`waitForHook: window.__SPATIAL_E2E__.${hookName} did not appear within ${timeoutMs}ms`);
}

/** Where the audit log lives for THIS run: the override this process's own environment carries (a
 * temp path, if the invoker set one before launching -- see this file's top comment), else the
 * real per-user default -- `kernel/src/permission/audit/log.rs::resolve_log_path`'s Windows branch,
 * mirrored rather than imported (this is a Node script, not Rust). */
function resolveAuditLogPath() {
  if (process.env.SPATIAL_IDE_AUDIT_LOG) return process.env.SPATIAL_IDE_AUDIT_LOG;
  if (process.platform === "win32") {
    if (!process.env.LOCALAPPDATA) {
      throw new Error(
        "resolveAuditLogPath: SPATIAL_IDE_AUDIT_LOG is unset and LOCALAPPDATA is unset -- cannot " +
          "locate the real audit log"
      );
    }
    return join(process.env.LOCALAPPDATA, "spatial-ide", "audit", "publish.jsonl");
  }
  const xdg = process.env.XDG_DATA_HOME;
  const home = process.env.HOME;
  if (xdg) return join(xdg, "spatial-ide", "audit", "publish.jsonl");
  if (home) return join(home, ".local", "share", "spatial-ide", "audit", "publish.jsonl");
  throw new Error("resolveAuditLogPath: could not resolve a default audit log location from the environment");
}

/**
 * The intent+outcome pair for one publish attempt, correlated by **destination**, not by the
 * shell's own `attempt_id`.
 *
 * **A real thing this suite's own earlier run found, not an assumption**: `spatial-audit/1`'s
 * `attempt` field is minted INSIDE `permission::boundary::execute` itself
 * (`kernel/src/publish/mod.rs::random_suffix`, a fresh 16-hex-char value per call) -- it is a
 * different identifier from the shell's own `PendingAttempts`-keyed `attempt_id` (32 hex,
 * `mint_attempt_id`, `frontends/shell/src-tauri/src/publish.rs`), which is never written to the
 * audit log and which the kernel's own boundary has no reason to know about. The two serve
 * different purposes -- the shell's is a single-use lookup key into host memory; the kernel's
 * correlates one attempt's own two records -- and nothing on either side of this seam claims they
 * are the same value. `destination` is what this suite actually controls uniquely per scenario
 * (`freshDestination`'s own timestamped, random parent directory), so it is the correlation key
 * that works from the JS side.
 */
function readAuditRecordsForDestination(logPath, destinationTag) {
  if (!existsSync(logPath)) {
    throw new Error(`readAuditRecordsForDestination: audit log does not exist at ${logPath}`);
  }
  const records = [];
  for (const line of readFileSync(logPath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    records.push(JSON.parse(line));
  }
  const intent = records.find(
    (r) => r.phase === "intent" && typeof r.destination === "string" && r.destination.includes(destinationTag)
  );
  if (!intent) return [];
  const outcome = records.find((r) => r.phase === "outcome" && r.attempt === intent.attempt);
  return outcome ? [intent, outcome] : [intent];
}

/** A fresh, non-existent `<parent>/bundle` destination under its own freshly-created, otherwise
 * empty parent directory -- `resolve_destination` requires the PARENT to already exist (it
 * canonicalizes it) while the destination itself must NOT exist yet. A private parent per
 * scenario is also what makes REFUSED''s "no `.staging-*` debris anywhere under the destination
 * parent" check meaningful rather than incidentally true of a shared directory. */
function freshDestination(label) {
  const parent = join(PUBLISH_OUT_DIR, `${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  mkdirSync(parent, { recursive: true });
  return join(parent, "bundle");
}

/** `kernel/examples/verify-bundle.rs` -- ADR-017 §14's conforming reader, run as a subprocess
 * (it is deliberately an `example`, never `src/bin/`; see that file's own module docs). Built once
 * up front (`buildVerifyBundleExample`) so each call here is a fast `cargo run` against an
 * already-built binary, not a fresh compile inside a timed step. */
function runVerifyBundle(bundlePath, jsonOutPath) {
  return spawnSync(
    "cargo",
    ["run", "-p", "spatial-kernel", "--example", "verify-bundle", "--", "--bundle", bundlePath, "--json", jsonOutPath, "--quiet"],
    { cwd: REPO_ROOT, encoding: "utf8" }
  );
}

function buildVerifyBundleExample() {
  console.log("publish: building kernel/examples/verify-bundle (cargo build -p spatial-kernel --example verify-bundle)...");
  const result = spawnSync("cargo", ["build", "-p", "spatial-kernel", "--example", "verify-bundle"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `buildVerifyBundleExample: cargo build failed (exit ${result.status}):\n${result.stdout}\n${result.stderr}`
    );
  }
  console.log("publish: verify-bundle example built.");
}

async function stepOpen(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER);
  if (outcome.kind !== "admitted") {
    throw new Error(`OPEN: openPath(filter fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  }
  await waitForHook(page, "publishPrepareWithDestination");
  return "admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)";
}

/**
 * APPROVED': prepare (test-seam destination) -> assert every prompt field NEXT-CUT.md's Approval
 * design paragraph names -> execute with the CORRECT phrase -> assert success -> verify the real
 * bundle with the conforming reader -> read back the two audit lines for this attempt and assert
 * their shape (approval_route "shell-dialog", a normalized destination, no credential-looking
 * content).
 */
async function stepApproved(page) {
  const destination = freshDestination("approved");
  // The audit log's own `attempt` correlator is minted inside `boundary::execute` itself and
  // never crosses to JS (see `readAuditRecordsForDestination`'s own doc comment) -- this
  // scenario's own unique parent directory name is what actually correlates its two records.
  const destinationTag = basename(dirname(destination));

  const prepareOutcome = await page.evaluate(
    (dest) => window.__SPATIAL_E2E__.publishPrepareWithDestination(dest, "whole"),
    destination
  );
  if (prepareOutcome.status !== "prompt") {
    throw new Error(`APPROVED': prepare returned ${JSON.stringify(prepareOutcome)}, expected {status:"prompt"}`);
  }
  const { attempt_id: attemptId, prompt } = prepareOutcome;

  if (!prompt.source_content_hash || !prompt.source_content_hash.startsWith("sha256:")) {
    throw new Error(`APPROVED': source_content_hash missing/malformed: ${JSON.stringify(prompt.source_content_hash)}`);
  }
  if (!prompt.style_hash || typeof prompt.style_hash !== "string" || prompt.style_hash.length === 0) {
    throw new Error(`APPROVED': style_hash missing: ${JSON.stringify(prompt.style_hash)}`);
  }
  const expectedPhrase = basename(destination);
  if (prompt.confirmation_phrase !== expectedPhrase) {
    throw new Error(
      `APPROVED': confirmation_phrase "${prompt.confirmation_phrase}" !== destination basename "${expectedPhrase}"`
    );
  }
  if (!prompt.destination_display || !prompt.destination_display.includes(expectedPhrase)) {
    throw new Error(`APPROVED': destination_display "${prompt.destination_display}" does not name the destination`);
  }
  if (!/whole file/i.test(prompt.row_scope)) {
    throw new Error(`APPROVED': row_scope does not read as whole-file scope: ${JSON.stringify(prompt.row_scope)}`);
  }
  if (prompt.filter_scope !== null) {
    throw new Error(
      `APPROVED': filter_scope must be null before any filter is applied this run, got ${JSON.stringify(prompt.filter_scope)}`
    );
  }

  await waitForHook(page, "publishExecute");
  const executeOutcome = await page.evaluate(
    (phrase) => window.__SPATIAL_E2E__.publishExecute(phrase),
    prompt.confirmation_phrase
  );
  if (executeOutcome.status !== "success") {
    throw new Error(`APPROVED': execute with the correct phrase returned ${JSON.stringify(executeOutcome)}, expected {status:"success"}`);
  }

  const jsonOut = join(OUT_DIR, `verify-approved-${Date.now()}.json`);
  const verify = runVerifyBundle(executeOutcome.bundle_path, jsonOut);
  if (verify.status !== 0) {
    throw new Error(`APPROVED': verify-bundle exited ${verify.status} against ${executeOutcome.bundle_path}\n${verify.stdout}\n${verify.stderr}`);
  }
  const verifySummary = JSON.parse(readFileSync(jsonOut, "utf8"));
  if (!verifySummary.verified) {
    throw new Error(`APPROVED': verify-bundle reported verified=false: ${JSON.stringify(verifySummary)}`);
  }

  const records = readAuditRecordsForDestination(resolveAuditLogPath(), destinationTag);
  if (records.length !== 2) {
    throw new Error(`APPROVED': expected exactly 2 audit records for destination tag ${destinationTag}, found ${records.length}: ${JSON.stringify(records)}`);
  }
  const [intent, outcomeRecord] = records;
  if (intent.phase !== "intent") throw new Error(`APPROVED': first record's phase is "${intent.phase}", expected "intent": ${JSON.stringify(intent)}`);
  if (outcomeRecord.phase !== "outcome") throw new Error(`APPROVED': second record's phase is "${outcomeRecord.phase}", expected "outcome": ${JSON.stringify(outcomeRecord)}`);
  if (outcomeRecord.outcome !== "success") throw new Error(`APPROVED': outcome record's outcome is "${outcomeRecord.outcome}", expected "success"`);
  if (outcomeRecord.approval_route !== "shell-dialog") {
    throw new Error(`APPROVED': outcome record's approval_route is "${outcomeRecord.approval_route}", expected "shell-dialog"`);
  }
  if (intent.destination.includes("\\") || /c:[\\/]users/i.test(intent.destination)) {
    throw new Error(`APPROVED': audit destination is not normalized (raw path leaked through): ${JSON.stringify(intent.destination)}`);
  }
  const rawLower = JSON.stringify(records).toLowerCase();
  for (const needle of CREDENTIAL_NEEDLES) {
    if (rawLower.includes(needle)) {
      throw new Error(`APPROVED': audit records contain a credential-looking needle "${needle}": ${JSON.stringify(records)}`);
    }
  }

  return (
    `prepared+executed with attempt ${attemptId}; bundle verified (${verifySummary.rows} rows, ` +
    `${verifySummary.partitions} partitions); 2 audit lines (intent+outcome success, ` +
    `approval_route shell-dialog, destination "${intent.destination}", no credential needle)`
  );
}

/**
 * REFUSED': prepare -> execute with a WRONG phrase -> assert a typed refusal outcome, no bundle
 * directory, no `.staging-*` debris anywhere under the destination's parent, and an audit pair
 * (intent + outcome refused with `error_kind` `ApprovalRefused`).
 */
async function stepRefused(page) {
  const destination = freshDestination("refused");
  const destinationTag = basename(dirname(destination));

  const prepareOutcome = await page.evaluate(
    (dest) => window.__SPATIAL_E2E__.publishPrepareWithDestination(dest, "whole"),
    destination
  );
  if (prepareOutcome.status !== "prompt") {
    throw new Error(`REFUSED': prepare returned ${JSON.stringify(prepareOutcome)}, expected {status:"prompt"}`);
  }
  const { attempt_id: attemptId } = prepareOutcome;

  await waitForHook(page, "publishExecute");
  const wrongPhrase = "definitely-the-wrong-phrase";
  const executeOutcome = await page.evaluate(
    (phrase) => window.__SPATIAL_E2E__.publishExecute(phrase),
    wrongPhrase
  );
  if (executeOutcome.status !== "refused") {
    throw new Error(`REFUSED': execute with a wrong phrase returned ${JSON.stringify(executeOutcome)}, expected {status:"refused"}`);
  }

  if (existsSync(destination)) {
    throw new Error(`REFUSED': the destination directory exists despite a refused approval: ${destination}`);
  }
  const parent = dirname(destination);
  const leftovers = existsSync(parent) ? readdirSync(parent).filter((name) => name.includes(".staging-")) : [];
  if (leftovers.length > 0) {
    throw new Error(`REFUSED': staging debris left under the destination's own parent: ${leftovers.join(", ")}`);
  }

  const records = readAuditRecordsForDestination(resolveAuditLogPath(), destinationTag);
  if (records.length !== 2) {
    throw new Error(`REFUSED': expected exactly 2 audit records for destination tag ${destinationTag}, found ${records.length}: ${JSON.stringify(records)}`);
  }
  const [intent, outcomeRecord] = records;
  if (intent.phase !== "intent") throw new Error(`REFUSED': first record's phase is "${intent.phase}", expected "intent"`);
  if (outcomeRecord.phase !== "outcome") throw new Error(`REFUSED': second record's phase is "${outcomeRecord.phase}", expected "outcome"`);
  if (outcomeRecord.outcome !== "refused") {
    throw new Error(`REFUSED': outcome record's outcome is "${outcomeRecord.outcome}", expected "refused"`);
  }
  if (outcomeRecord.error_kind !== "ApprovalRefused") {
    throw new Error(`REFUSED': outcome record's error_kind is "${outcomeRecord.error_kind}", expected "ApprovalRefused"`);
  }

  return (
    `prepared with attempt ${attemptId}, refused on the wrong phrase; no bundle directory, no ` +
    `.staging-* debris under ${parent}; audit pair intent+outcome refused, error_kind ApprovalRefused`
  );
}

/**
 * FILTERED': apply a filter through `queryWithFilter` (the same seam the real FilterPanel's Apply
 * button calls) -> prepare (whole-file scope) -> assert the prompt's `filter_scope` is the
 * verbatim conditional-block sentence -> execute -> assert the manifest's `operation.filter` says
 * `whole-file` AND the bundle's row count equals the FULL dataset (the filter did not leak into
 * the published stream -- P0's guarantee, exercised end to end through the real boundary).
 */
async function stepFiltered(page) {
  const filterOutcome = await page.evaluate(
    (predicate) => window.__SPATIAL_E2E__.queryWithFilter(predicate),
    "zone = 'residential'"
  );
  if (filterOutcome.kind !== "applied") {
    throw new Error(`FILTERED': queryWithFilter("zone = 'residential'") returned ${JSON.stringify(filterOutcome)}, expected {kind:"applied"}`);
  }

  const destination = freshDestination("filtered");
  const prepareOutcome = await page.evaluate(
    (dest) => window.__SPATIAL_E2E__.publishPrepareWithDestination(dest, "whole"),
    destination
  );
  if (prepareOutcome.status !== "prompt") {
    throw new Error(`FILTERED': prepare returned ${JSON.stringify(prepareOutcome)}, expected {status:"prompt"}`);
  }
  const { prompt } = prepareOutcome;
  if (prompt.filter_scope !== FILTER_SCOPE_SENTENCE) {
    throw new Error(
      `FILTERED': filter_scope mismatch.\nExpected: ${FILTER_SCOPE_SENTENCE}\nActual:   ${JSON.stringify(prompt.filter_scope)}`
    );
  }

  await waitForHook(page, "publishExecute");
  const executeOutcome = await page.evaluate(
    (phrase) => window.__SPATIAL_E2E__.publishExecute(phrase),
    prompt.confirmation_phrase
  );
  if (executeOutcome.status !== "success") {
    throw new Error(`FILTERED': execute returned ${JSON.stringify(executeOutcome)}, expected {status:"success"}`);
  }

  const manifest = JSON.parse(readFileSync(join(executeOutcome.bundle_path, "manifest.json"), "utf8"));
  if (manifest.operation?.filter?.kind !== "whole-file") {
    throw new Error(
      `FILTERED': manifest.operation.filter is ${JSON.stringify(manifest.operation?.filter)}, expected {"kind":"whole-file"}`
    );
  }
  if (manifest.data?.rows !== FIXTURE_FILTER_FEATURES) {
    throw new Error(
      `FILTERED': manifest.data.rows is ${manifest.data?.rows}, expected the FULL dataset's ` +
        `${FIXTURE_FILTER_FEATURES} -- the active SQL filter must not leak into the published stream`
    );
  }

  const jsonOut = join(OUT_DIR, `verify-filtered-${Date.now()}.json`);
  const verify = runVerifyBundle(executeOutcome.bundle_path, jsonOut);
  if (verify.status !== 0) {
    throw new Error(`FILTERED': verify-bundle exited ${verify.status} against ${executeOutcome.bundle_path}\n${verify.stdout}\n${verify.stderr}`);
  }
  const verifySummary = JSON.parse(readFileSync(jsonOut, "utf8"));
  if (!verifySummary.verified || verifySummary.rows !== FIXTURE_FILTER_FEATURES) {
    throw new Error(
      `FILTERED': verify-bundle's own independently-decoded row count is ${verifySummary.rows} ` +
        `(verified=${verifySummary.verified}), expected ${FIXTURE_FILTER_FEATURES}`
    );
  }

  return (
    `filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; ` +
    `bundle rows=${manifest.data.rows} == full dataset (${FIXTURE_FILTER_FEATURES}) both by the ` +
    `manifest's own claim and the reader's independent decode -- the filter did not leak`
  );
}

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 900_000);
  const watchdog = setTimeout(() => {
    console.error(`publish: SPATIAL_E2E_DEADLINE_MS (default 900000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE_FILTER)) {
    console.error(`publish: fixture not found: ${FIXTURE_FILTER}`);
    console.error(`Regenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return;
  }

  mkdirSync(PUBLISH_OUT_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  try {
    buildVerifyBundleExample();
  } catch (e) {
    console.error(`publish: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`publish: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;

  // **Fresh-instance requirement (this file's own top comment).** Audit-log determinism depends on
  // reading back the SAME log the app currently running actually writes to, which this process can
  // only guarantee for a launch IT performed (inheriting ITS OWN environment, including any
  // `SPATIAL_IDE_AUDIT_LOG` override the invoker set). An attach to a pre-existing instance may have
  // been started with a different override, or none -- refuse rather than read an indeterminate log.
  if (!launched) {
    console.error(
      `publish: attached to an ALREADY-RUNNING instance on CDP port ${CDP_PORT} instead of launching ` +
        `a fresh one. This suite's audit-log determinism requires a fresh launch -- kill the existing ` +
        `instance (taskkill /T /F on its process tree), confirm ports ${CDP_PORT}/5180 are down, then ` +
        `re-run \`npm run e2e:publish\` (optionally with SPATIAL_IDE_AUDIT_LOG=<temp path> set first ` +
        `for full isolation from any other publishes on this machine).`
    );
    await browser.close().catch(() => {});
    process.exitCode = 1;
    return;
  }

  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL"|"SKIP", note: string}>} */
  const results = [];

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
    console.log(`publish: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(`publish: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms`);
    console.log(`publish: audit log for this run: ${resolveAuditLogPath()}`);

    await runStep("OPEN", 40_000, () => stepOpen(page));
    await runStep("APPROVED'", 180_000, () => stepApproved(page));
    await runStep("REFUSED'", 60_000, () => stepRefused(page));

    // EXPIRED' (NEXT-CUT.md P4: "cheap if the TTL seam permits shortening via env/test knob -- if
    // not, skip with a stated reason"). `PENDING_ATTEMPT_TTL` (`publish.rs`) is a hardcoded 120s
    // constant with no env/test override -- adding one would touch the single-use/TTL design P1
    // already built and reviewed, which is out of this piece's scope, and sleeping 120 real seconds
    // for one E2E assertion is not "cheap" by this suite's own established budget discipline (every
    // other step here completes in well under a minute). The property itself IS already covered,
    // just not by this suite: `frontends/shell/src-tauri/src/publish.rs::tests::
    // a_pending_attempt_past_its_ttl_is_treated_as_unknown` backdates `created_at` past the TTL with
    // no sleep, at the Rust unit level, and passes as part of `cargo test --lib` (this piece's own
    // required verify command).
    const expiredNote =
      "no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (120s, publish.rs); " +
      "sleeping 120s for one E2E assertion is not cheap (NEXT-CUT.md P4 permits skipping with a " +
      "stated reason). The property is unit-tested instead: " +
      "publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown (backdated " +
      "created_at, no sleep) -- part of this piece's own required `cargo test --lib` run.";
    results.push({ id: "EXPIRED'", status: "SKIP", note: expiredNote });
    console.log(`[EXPIRED'] SKIP: ${expiredNote}`);

    await runStep("FILTERED'", 180_000, () => stepFiltered(page));

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    const statusWidth = 6;
    console.log(`${"Step".padEnd(idWidth)}  ${"Status".padEnd(statusWidth)}  Note`);
    console.log(`${"-".repeat(idWidth)}  ${"-".repeat(statusWidth)}  ${"-".repeat(40)}`);
    for (const r of results) {
      console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(statusWidth)}  ${r.note}`);
    }

    process.exitCode = results.some((r) => r.status === "FAIL") ? 1 : 0;
  } catch (e) {
    console.error(`publish: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    consoleHandle.dispose();
    // Same policy as every other suite: disconnect only, never stop the app -- this run launched
    // it (the fresh-instance gate above guarantees that), and it stays up for further interactive
    // use, same convention every prior E2E script in this tree follows.
    await browser.close().catch(() => {});
    console.log(`This run launched the app; it stays RUNNING on CDP port ${CDP_PORT} for further interactive use.`);
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
