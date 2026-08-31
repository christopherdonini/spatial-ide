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
  // Viewport-residency cut P3: the arm-switch's own DEV-only identifiers -- every real call site
  // (`App.tsx`'s `setResidencyArm`/`getResidencyArm` hook registrations, and the
  // `notifyResidencyArmDataset{Opened,Closed}` bookkeeping calls in the `[admitted]` effect) is
  // gated behind `import.meta.env.DEV`, the same DCE claim the instrument identifiers above depend
  // on -- see `residency/residencyArm.ts`'s own top doc comment.
  "setResidencyArm",
  "getResidencyArm",
  "notifyResidencyArmDatasetOpened",
  "notifyResidencyArmDatasetClosed",
  // Viewport-residency cut P3w: the candidate arm's own SOLE construction entry point -- its only
  // call site (`App.tsx`'s `[admitted]` effect) is `if (import.meta.env.DEV && getResidencyArm()
  // === "candidate")`, the identical guard the arm-switch identifiers above already prove dead in a
  // production build -- checked here too as the SAME kind of corroborating evidence P3's own pair
  // above already established (not a new, independent gate; `startCandidateArmSession` lives inside
  // that exact same branch). Everything `candidateArmSession.ts` itself imports unconditionally
  // (`TileViewportStreamManager`, etc.) is expected to be tree-shaken away WITH it once this one
  // import has no live reference left -- not independently re-checked here, per this script's own
  // disclosed scope (P1d B6b): a hit against one of the identifiers below is the load-bearing proof,
  // not an exhaustive enumeration of every identifier in the whole candidate-arm module graph
  // (`canvas/tileGrid.ts`/`tileResidentSet.ts`/`tileIngest.ts` are NOT purely DEV-only artifacts the
  // way `residencyInstrument.ts`/`residencyArm.ts` are -- `WorkingCanvas.tsx`'s own `tileResidentRef
  // = useRef(new TileResidentSet())` constructs one UNCONDITIONALLY, arm-agnostic, so that class's
  // own code is expected, correctly, to survive into a production bundle -- inert, never reachable at
  // runtime there, but genuinely live code, not a leak).
  "startCandidateArmSession",
  // Viewport-residency cut P3i (RESIDENCY-PREREGISTRATION.md §12 Amendment 15): the segment
  // decomposition's own new exports -- same DEV-gated call-site discipline every identifier above
  // already relies on (`residencyInstrument.ts`'s own top doc comment, P3i paragraph).
  "recordResidencyBatchArrived",
  "recordResidencyBatchDecoded",
  "recordResidencyTileRequested",
  "recordResidencyDuplicatesDropped",
  "recordResidencyEvictionsApplied",
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
// Viewport-residency cut P3w item B: the candidate arm's own `WorkingCanvasHandle` methods --
// unconditionally-constructed object-literal methods (exactly like the three above), whose SOLE real
// callers all live inside `residency/candidateArmSession.ts`, itself only ever constructed from the
// SAME DEV-gated branch `startCandidateArmSession` above already covers. Bare method-shorthand
// definitions surviving is expected (same reasoning as the three above); a surviving CALL SITE is not.
const EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS = [
  "getResidentCounts",
  "armFirstPixelRenderHook",
  "disarmFirstPixelRenderHook",
  "pushTileBatch",
  "clearTile",
  "clearAllTiles",
  "isTileResidentInCandidateSet",
  "establishTileGridContext",
  "applyTileViewportContext",
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

  // P1d B6c: a SEPARATE pass for the three expected-present, caller-checked identifiers -- see
  // `EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS`'s own doc comment. A bare occurrence is NOT a hit
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

  if (hits.length > 0 || callerHits.length > 0) {
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
    process.exitCode = 1;
    return;
  }

  console.log(
    `check:dist-clean: PASS -- 0 hits for ${INSTRUMENT_IDENTIFIERS.length} instrument identifiers, and 0 surviving call sites for ${EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS.length} expected-present identifiers, across ${files.length} dist file(s).`
  );
}

main();
