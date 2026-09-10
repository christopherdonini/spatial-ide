#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// M5 (viewport-residency cut P1b reviewer-gate remediation). `residencyInstrument.ts`'s own top doc
// comment has always CLAIMED "npm run build succeeding and the dist grep this piece's own tests
// run, not merely claimed here" -- P1 shipped that sentence with no such grep actually wired
// anywhere (a claim with nothing behind it). This script is what makes the claim TRUE: it greps
// `dist/` (produced by `npm run build`, i.e. `vite build`) for ten identifiers unique to
// `src/instrument/residencyInstrument.ts`'s own DEV-only exports, and fails loudly if any survive
// into a production bundle -- proving `import.meta.env.DEV`'s Vite-literal-`false` replacement and
// esbuild's minifier dead-code-elimination actually removed this module's code, the same "no code
// change" load-bearing claim `WorkingCanvas.tsx`/`viewportStreamManager.ts`/`App.tsx`'s own
// `if (import.meta.env.DEV)` call-site guards depend on for zero product-behavior change.
//
// Run via `npm run check:dist-clean`, wired into `npm run verify` AFTER `npm run build` (`package
// .json`'s own `verify` script ordering) -- a grep against a directory `npm run build` has not yet
// produced would either find nothing (false confidence) or fail for the wrong reason (missing
// directory, not a real leak), so this script also fails loudly, distinctly, if `dist/` does not
// exist yet.
//
// **P1d B6b: what this check DOES and does NOT establish (disclosed, not merely implied by a passing
// run).** A HIT is real signal: the literal identifier string survived, so the guarded code (or a
// fragment quoting its own name, e.g. in a stack trace string) reached the bundle. A MISS is
// ONE-DIRECTIONAL, never a proof the underlying CODE PATH is absent -- a production minifier is free
// to RENAME a local binding (an imported function used only internally, never as a property access
// or a preserved export) to a short, unrelated token while leaving the CALL itself intact; this
// script would then read a clean 0-hit pass over a bundle that still executes the guarded code under
// a different name. What actually makes the code path itself absent is dead-code elimination at the
// GUARDED CALL SITE (`residencyInstrument.ts`'s own top doc comment, P1d B6a) -- this script is a
// grep-based PROOF that the twelve identifiers below are not LEXICALLY PRESENT, offered as
// corroborating evidence for that DCE claim, never as an independent, sufficient proof of it on its
// own. `residencyInstrument.ts`'s own exported function/class names were chosen distinctive enough
// (B6a's own doc comment: "no short/common word among them") that in practice a surviving CALL to
// one, even under a renamed local binding, would very likely still carry an unrelated literal string
// hit somewhere in the same bundle (an error message, a `.name` property read, a source map) -- but
// that is a probabilistic argument, not this script's own guarantee.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST_DIR = join(SHELL_DIR, "dist");

// The twelve identifiers -- every exported symbol `residencyInstrument.ts`'s DEV-only singleton
// wiring and pure core class expose, PLUS (P1c, RESIDENCY-PREREGISTRATION.md §12 Amendment 6) the
// two identifiers unique to `WorkingCanvas.tsx`'s own DEV-gated instrument-identity view-state seam
// (`applyDeterministicE2eViewState`, its call-counter closure variable
// `e2eSetViewStateCallCount`). Chosen because each is a distinctive, unlikely-to-collide token (no
// short/common word among them) -- a minifier that actually ran would either delete this dead code
// entirely (the expected, passing case) or, if it somehow didn't, rename local bindings but NOT
// arbitrary string literals matching these identifiers that might appear in, say, an unrelated
// comment -- so a hit here is real signal, not minifier-name noise.
const INSTRUMENT_IDENTIFIERS = [
  "recordResidencyBatch",
  "recordResidencyStreamIssued",
  "recordResidencyStreamEnded",
  "recordResidencyRenderTick",
  "recordResidencyInput",
  "recordResidencySupersededBytes", // P1d suggestion 10
  "beginResidencyStep",
  "endResidencyStep",
  "enableResidencyInstrument",
  "disableResidencyInstrument",
  "ResidencyInstrumentCore",
  "applyDeterministicE2eViewState",
  "e2eSetViewStateCallCount",
  // Viewport-residency cut P3: the arm-SWITCH's own DEV-only identifiers -- every real call site
  // (`App.tsx`'s `setResidencyArm` hook registration, and the
  // `notifyResidencyArmDataset{Opened,Closed}` bookkeeping calls in the `[admitted]` effect) is
  // gated behind `import.meta.env.DEV`, the same DCE claim the instrument identifiers above depend
  // on -- see `residency/residencyArm.ts`'s own top doc comment.
  //
  // SHOULD-FIX S2 (2026-09-07, reviewer gate; citation corrected 2026-09-08, post-PASS sweep S-a):
  // `getResidencyArm` REMOVED from this list. It is called UNGATED, in every build, at TWO real
  // production sites -- `WorkingCanvas.tsx:570` (`const armRef = useRef(getResidencyArm())`) and
  // inside `residencyArm.ts`'s own `shouldConstructCandidateSession()` (the predicate `App.tsx:1009`'s
  // construction branch calls, `if (shouldConstructCandidateSession())` -- SHOULD-FIX S3's own
  // extraction; `App.tsx`'s branch no longer reads `getResidencyArm()` inline itself). Not dead code
  // at either site, so a MISS here was never real signal for it: the function's own literal
  // source-level name does not need to survive minification for the call to work (a plain,
  // non-property function reference is exactly what esbuild is free to rename), so this list's
  // "0 hits" pass was true only because the MINIFIER renamed a binding that was never going away in
  // the first place -- meaningless, per the reviewer's own words. `setResidencyArm` stays forbidden
  // below: its own hook REGISTRATION (the switch itself) remains `isInstrumentedBuild()`-gated.
  "setResidencyArm",
  "notifyResidencyArmDatasetOpened",
  "notifyResidencyArmDatasetClosed",
  // RELEASE-0.1 item 7 (2026-09-07, DECISIONS-PENDING entry 52 = (a)): `startCandidateArmSession`
  // REMOVED from this list here (was present through Viewport-residency cut P3w). It used to sit
  // behind the SAME `import.meta.env.DEV`-class guard as the identifiers immediately above (`App.tsx`'s
  // `[admitted]` effect: `if (isInstrumentedBuild() && getResidencyArm() === "candidate")`) -- item 7
  // dropped the `isInstrumentedBuild()` operand, and SHOULD-FIX S3 later extracted the remaining
  // comparison into `residencyArm.ts`'s own `shouldConstructCandidateSession()`, so the guard reads
  // (citation corrected 2026-09-08, post-PASS sweep S-a) `if (shouldConstructCandidateSession())`
  // today (`App.tsx:1009`), which defaults to `true` (`DEFAULT_RESIDENCY_ARM` is `"candidate"`). A
  // plain production build therefore calls `startCandidateArmSession` BY DEFAULT now -- checking for
  // its absence would fail
  // every green build, testing the wrong thing. See `EXPECTED_PRESENT_CALL_SITE_IDENTIFIERS`'s own
  // doc comment (S1) for why it is not asserted PRESENT here either (a plain function call, not a
  // property access -- its literal name does not survive minification, present or absent).
  // Viewport-residency cut P3i (RESIDENCY-PREREGISTRATION.md §12 Amendment 15): the segment
  // decomposition's own new exports -- same DEV-gated call-site discipline every identifier above
  // already relies on (`residencyInstrument.ts`'s own top doc comment, P3i paragraph).
  "recordResidencyBatchArrived",
  "recordResidencyBatchDecoded",
  "recordResidencyTileRequested",
  "recordResidencyDuplicatesDropped",
  "recordResidencyEvictionsApplied",
  // Viewport-residency cut P7 (the tile-size sweep selector): the DEV-only identifiers unique to
  // `residency/residencyTileSizeLevel.ts` -- every real call site (`App.tsx`'s
  // `setResidencyTileSizeLevel` hook registration, and the
  // `notifyResidencyTileSizeLevelDataset{Opened,Closed}` bookkeeping calls) is gated behind
  // `import.meta.env.DEV`, the same DCE claim the arm-switch identifiers above already rely on --
  // see `residencyTileSizeLevel.ts`'s own top doc comment (it mirrors `residencyArm.ts` exactly).
  //
  // SHOULD-FIX S2's own parallel case: `getResidencyTileSizeLevel` REMOVED too -- `App.tsx`
  // (`tileGridLevel: getResidencyTileSizeLevel()`) sits INSIDE the same now-unconditional candidate
  // construction branch as `getResidencyArm()`, a live production call for the identical reason.
  // `setResidencyTileSizeLevel` stays forbidden: only its own hook registration is dev-gated.
  "setResidencyTileSizeLevel",
  "notifyResidencyTileSizeLevelDatasetOpened",
  "notifyResidencyTileSizeLevelDatasetClosed",
];

// P1d B6c: three `WorkingCanvas.tsx` imperative-handle METHOD NAMES (product code, never
// `residencyInstrument.ts` exports) that are EXPECTED, by design, to remain present in a production
// bundle -- re-review nit 19. Unlike `INSTRUMENT_IDENTIFIERS` above (whose owning module has no
// non-DEV reason to exist, so DCE is expected to remove it entirely), these three are real,
// unconditionally-constructed object-literal methods on `WorkingCanvasHandle` (never behind their
// OWN `import.meta.env.DEV` check at definition time -- only their SOLE real callers, `App.tsx`'s
// DEV-gated E2E hook registrations, are gated). esbuild's default minifier does not mangle
// object-literal property names, so these NAMES legitimately survive as ordinary method-name tokens;
// treating that as a leak would be a false positive. What must NOT survive is a CALL reaching them --
// checked below as "the identifier immediately preceded by `.` or `?.`" (a member-expression
// invocation), never as "the bare identifier is absent" (which IS expected to be present, as a
// method-shorthand definition, preceded by `,`/`{`/whitespace, never `.`).
// RELEASE-0.1 item 7 (2026-09-07, DECISIONS-PENDING entry 52 = (a)): seven identifiers REMOVED from
// this list (were present through Viewport-residency cut P3w item B: `pushTileBatch`, `clearTile`,
// `clearAllTiles`, `isTileResidentInCandidateSet`, `establishTileGridContext`,
// `applyTileViewportContext`, plus `getResidentCounts` -- that one shared with the baseline arm's own
// dev-only readback). All seven's real callers used to live ONLY inside `residency/
// candidateArmSession.ts`, itself only ever constructed from the DEV-gated branch this file's own
// `INSTRUMENT_IDENTIFIERS` comment (`startCandidateArmSession`) used to name -- so a surviving CALL
// SITE for any of them was a real regression (that branch was supposed to be dead in production).
// That branch is no longer DEV-gated (item 7): `candidateArmSession.ts` now calls
// `canvas.pushTileBatch`/`.clearTile`/`.clearAllTiles`/`.isTileResidentInCandidateSet`/
// `.establishTileGridContext`/`.applyTileViewportContext` unconditionally whenever the candidate arm
// is active (the default), and `getResidentCounts` gained the SAME unconditional callers inside that
// same file -- THREE, re-counted (2026-09-07, reviewer gate nit): `emitResidencyStatus` (:685),
// `emitResidencyRelinquished` (:837), `hasHeadroom` (:885) -- alongside its pre-existing dev-only one
// in `App.tsx`. A surviving call site for any of these seven is now the EXPECTED, correct shape for a
// production build shipping the default arm -- checking for its absence would fail every green
// build. `armFirstPixelRenderHook`/`disarmFirstPixelRenderHook` below are UNCHANGED: their only real
// callers stay inside `App.tsx`'s own `isInstrumentedBuild()`-gated E2E-hook effect (verified by grep
// against `src/`, item 7's own audit), so a surviving call site for either of those two remains real
// signal, unaffected by this piece.
const EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS = ["armFirstPixelRenderHook", "disarmFirstPixelRenderHook"];

// SHOULD-FIX S1 (2026-09-07, reviewer gate, re-review after RELEASE-0.1 item 7's first pass): the
// preregistration asked for the candidate-arm identifiers to be EXPECTED PRESENT, not merely removed
// from the forbidden list above -- a MISS here (an identifier this list expects to survive, but
// doesn't) is now a FAIL too, the positive mirror of `INSTRUMENT_IDENTIFIERS`'s own negative check.
// Re-verified empirically against a real `npm run build` output (`vite.config.ts:29`:
// `minify: "esbuild"` for a plain build, the same config a shipped artifact uses) before writing this
// list, not assumed: `pushTileBatch`/`clearTile`/`clearAllTiles`/`isTileResidentInCandidateSet`/
// `establishTileGridContext`/`applyTileViewportContext`/`getResidentCounts` -- object-literal
// method-shorthand names `WorkingCanvas.tsx` defines on `WorkingCanvasHandle` -- each DID survive as
// a real call-shaped (`.name(`) occurrence, confirmed by a direct grep of the built `dist/` before
// this list was written.
//
// **`startCandidateArmSession` is NOT included here, a correction to the piece's own preregistration
// note ("the reviewer counted them in the clean bundle")** -- re-checked directly against a real
// build and found NOT present as literal text, in either bare or call-shaped form: unlike the seven
// above, it is a PLAIN function call (`App.tsx`: `const session = startCandidateArmSession({...})`,
// no `.`/`?.` prefix), never a property access, so esbuild's minifier is free to rename its local
// binding -- and does. Asserting its literal presence here would be a check that FAILS ON EVERY GREEN
// BUILD, testing the wrong thing (the same one-directional-MISS caveat this file's own top doc
// comment, P1d B6b, already names for the negative list). Its own reachability is corroborated
// INDIRECTLY instead: every one of the seven identifiers below is called only from CODE
// `startCandidateArmSession` itself constructs (`candidateArmSession.ts`) -- their survival proves
// that code was NOT dead-code-eliminated from this build (post-PASS sweep nit, 2026-09-08:
// corrected from the stronger, imprecise "proof that branch was reachable" -- surviving in the
// BUNDLE is not the same claim as being TAKEN at runtime, this script's own top doc comment's
// MISS-is-one-directional caveat cuts the other way too). No single check here establishes "the
// default arm is candidate, and a plain production build actually takes that branch" alone; three
// things together do: `residencyArm.test.ts`'s own unit test (the PREDICATE, `shouldConstructCandidateSession()`,
// returns `true` in production mode); this check (the branch's own downstream code is present, not
// eliminated, in the built artifact); and the E2E ledgers (`regression.mjs`/`filter-panel.mjs`'s own
// render-trace output, RELEASE-0.1 item 7's report -- direct runtime evidence the branch is TAKEN
// and behaves correctly when it is), without needing `startCandidateArmSession`'s own literal name
// to survive too.
const EXPECTED_PRESENT_CALL_SITE_IDENTIFIERS = [
  "pushTileBatch",
  "clearTile",
  "clearAllTiles",
  "isTileResidentInCandidateSet",
  "establishTileGridContext",
  "applyTileViewportContext",
  "getResidentCounts",
];

function collectFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(js|mjs|css|html)$/i.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  if (!existsSync(DIST_DIR)) {
    console.error(
      `check:dist-clean: ${DIST_DIR} does not exist -- run "npm run build" first (this script is meant to run AFTER it, see package.json's own "verify" ordering).`
    );
    process.exitCode = 1;
    return;
  }

  const files = collectFiles(DIST_DIR);
  if (files.length === 0) {
    console.error(`check:dist-clean: ${DIST_DIR} exists but contains no .js/.mjs/.css/.html files -- a build that produced nothing is not a clean pass.`);
    process.exitCode = 1;
    return;
  }

  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const id of INSTRUMENT_IDENTIFIERS) {
      if (text.includes(id)) {
        hits.push({ file, id });
      }
    }
  }

  // P1d B6c: a SEPARATE pass for the two expected-present, caller-checked identifiers (RELEASE-0.1
  // item 7 removed the other five; see `EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS`'s own doc
  // comment above for the full account). A bare occurrence is NOT a hit
  // (expected: the method-shorthand definition); only an occurrence immediately preceded by `.` or
  // `?.` (a real call site surviving) counts.
  const callerHits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const id of EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS) {
      const callPattern = new RegExp(`[.?]\\s*${id}\\s*\\(`, "g");
      const matches = text.match(callPattern);
      if (matches) {
        callerHits.push({ file, id, count: matches.length });
      }
    }
  }

  // SHOULD-FIX S1: the POSITIVE mirror -- each of `EXPECTED_PRESENT_CALL_SITE_IDENTIFIERS` must have
  // AT LEAST ONE call-shaped (`.name(`) occurrence SOMEWHERE across the whole dist/ (not per-file --
  // esbuild's own chunking is not this script's concern, only whether the call site reached the
  // shipped output at all). A ZERO-hit identifier here is a FAIL: the preregistration's own claim
  // ("expected present" as of RELEASE-0.1 item 7) does not hold for it.
  const missingExpectedCallSites = [];
  for (const id of EXPECTED_PRESENT_CALL_SITE_IDENTIFIERS) {
    const callPattern = new RegExp(`[.?]\\s*${id}\\s*\\(`, "g");
    let totalCount = 0;
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const matches = text.match(callPattern);
      if (matches) totalCount += matches.length;
    }
    if (totalCount === 0) {
      missingExpectedCallSites.push(id);
    }
  }

  if (hits.length > 0 || callerHits.length > 0 || missingExpectedCallSites.length > 0) {
    if (hits.length > 0) {
      console.error(`check:dist-clean: FAIL -- ${hits.length} instrument-identifier hit(s) survived into dist/:`);
      for (const h of hits) {
        console.error(`  ${h.id} in ${h.file}`);
      }
      console.error(
        "This means the residency instrument's DEV-only code (or a fragment of it) reached a production build -- the wire-bytes-identity / zero-product-change claim it depends on does not hold."
      );
    }
    if (callerHits.length > 0) {
      console.error(`check:dist-clean: FAIL -- ${callerHits.length} surviving CALL SITE(s) for expected-present-but-unreachable identifiers:`);
      for (const h of callerHits) {
        console.error(`  ${h.count} call-shaped occurrence(s) of ${h.id} in ${h.file}`);
      }
      console.error(
        "The bare identifier surviving is expected (a real WorkingCanvasHandle method name, B6c); a CALL to it surviving means its DEV-gated caller (App.tsx's E2E hook registrations) was not dead-code-eliminated -- a real regression, not the expected shape."
      );
    }
    if (missingExpectedCallSites.length > 0) {
      console.error(
        `check:dist-clean: FAIL -- ${missingExpectedCallSites.length} identifier(s) expected to have a surviving call site (S1) had ZERO:`
      );
      for (const id of missingExpectedCallSites) {
        console.error(`  ${id}`);
      }
      console.error(
        "These are the candidate arm's own WorkingCanvasHandle methods -- RELEASE-0.1 item 7 flipped the default arm to candidate, so a plain production build is now expected to construct and call a candidate-arm session; zero call sites means that branch did not reach the bundle, or reached it and was stripped -- a real regression from what item 7 shipped, not the expected shape."
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `check:dist-clean: PASS -- 0 hits for ${INSTRUMENT_IDENTIFIERS.length} instrument identifiers, 0 surviving call sites for ${EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS.length} expected-absent-caller identifiers, and >=1 surviving call site each for ${EXPECTED_PRESENT_CALL_SITE_IDENTIFIERS.length} expected-present identifiers, across ${files.length} dist file(s).`
  );
}

main();
