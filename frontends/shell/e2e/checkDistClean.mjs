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

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST_DIR = join(SHELL_DIR, "dist");

// The ten identifiers -- every exported symbol `residencyInstrument.ts`'s DEV-only singleton wiring
// and pure core class expose. Chosen because each is a distinctive, unlikely-to-collide token (no
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
  "beginResidencyStep",
  "endResidencyStep",
  "enableResidencyInstrument",
  "disableResidencyInstrument",
  "ResidencyInstrumentCore",
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

  if (hits.length > 0) {
    console.error(`check:dist-clean: FAIL -- ${hits.length} instrument-identifier hit(s) survived into dist/:`);
    for (const h of hits) {
      console.error(`  ${h.id} in ${h.file}`);
    }
    console.error(
      "This means the residency instrument's DEV-only code (or a fragment of it) reached a production build -- the wire-bytes-identity / zero-product-change claim it depends on does not hold."
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `check:dist-clean: PASS -- 0 hits for ${INSTRUMENT_IDENTIFIERS.length} instrument identifiers across ${files.length} dist file(s).`
  );
}

main();
