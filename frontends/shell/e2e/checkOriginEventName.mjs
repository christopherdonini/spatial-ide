#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// ADR-020 Amendment 1 -- reviewer S1: `src-tauri/src/lib.rs`'s `ORIGIN_SELF_CHECK_MISMATCH_EVENT`
// constant and `src/diagnostics/originSelfCheck.ts`'s constant of the SAME name each hold the
// literal event-name string `"origin-self-check-mismatch"` with nothing mechanically tying them --
// a human editing one side (e.g. renaming the event when the "unverifiable" outcome was added)
// could silently drift the other, and `app.emit(...)`/`listen(...)` would then simply never see
// each other's traffic, with no compile error on either side (a Rust `&str` and a TypeScript string
// literal share no type system). This script is the mechanical link, following
// `checkDevOriginConsistency.mjs`'s own idiom exactly: read both real source files as text (no code
// execution), require EXACTLY ONE definition in each (an ambiguous file -- zero or more than one
// match -- fails loudly rather than silently picking one, the same reasoning
// `checkDevOriginConsistency.mjs`'s own top comment gives for `readVitePort`'s `matchAll`), and
// require the two extracted strings to be equal.
//
// Wired into `npm run verify` as `check:origin-event`, alongside `check:dev-origin` (both are
// config/constant-drift checks over real files, neither is application logic under test, so
// neither belongs in `npm test`'s vitest run -- `check:dist-clean`'s own precedent).

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const LIB_RS_PATH = join(SHELL_DIR, "src-tauri", "src", "lib.rs");
const ORIGIN_SELF_CHECK_TS_PATH = join(SHELL_DIR, "src", "diagnostics", "originSelfCheck.ts");

// `const ORIGIN_SELF_CHECK_MISMATCH_EVENT: &str = "origin-self-check-mismatch";` (any Rust string
// content between the quotes -- the value itself is not assumed, only the surrounding declaration
// shape, so this script fails loudly rather than silently if the constant's name ever changes too).
const RUST_CONST_RE = /const\s+ORIGIN_SELF_CHECK_MISMATCH_EVENT\s*:\s*&str\s*=\s*"([^"]*)"\s*;/g;

// `export const ORIGIN_SELF_CHECK_MISMATCH_EVENT = "origin-self-check-mismatch";` -- TypeScript
// side, same constant name, no type annotation to match on (the file declares none).
const TS_CONST_RE = /export\s+const\s+ORIGIN_SELF_CHECK_MISMATCH_EVENT\s*=\s*"([^"]*)"\s*;/g;

function extractExactlyOne(path, regex, label) {
  const text = readFileSync(path, "utf8");
  const matches = [...text.matchAll(regex)];
  if (matches.length !== 1) {
    throw new Error(
      `checkOriginEventName: expected exactly one ${label} definition in ${path}, found ` +
        `${matches.length} -- ${
          matches.length === 0
            ? "the declaration shape this script expects may have changed; update the regex alongside it."
            : "an ambiguous file (e.g. a second declaration, or a comment shaped like the real one): " +
              "this script cannot tell which match is authoritative without a human deciding, so it " +
              "refuses rather than silently picking the first one."
        }`
    );
  }
  return matches[0][1];
}

function main() {
  const rustValue = extractExactlyOne(LIB_RS_PATH, RUST_CONST_RE, "ORIGIN_SELF_CHECK_MISMATCH_EVENT (Rust)");
  const tsValue = extractExactlyOne(
    ORIGIN_SELF_CHECK_TS_PATH,
    TS_CONST_RE,
    "ORIGIN_SELF_CHECK_MISMATCH_EVENT (TypeScript)"
  );

  if (rustValue !== tsValue) {
    console.error(
      `checkOriginEventName: FAIL -- ${LIB_RS_PATH}'s ORIGIN_SELF_CHECK_MISMATCH_EVENT ` +
        `(${JSON.stringify(rustValue)}) does not match ${ORIGIN_SELF_CHECK_TS_PATH}'s ` +
        `(${JSON.stringify(tsValue)}). These two copies of the self-check mismatch event name have ` +
        "drifted -- the host's app.emit(...) and the frontend's listen(...) would no longer see each " +
        "other's traffic, and nothing else in the build would catch that."
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `checkOriginEventName: PASS -- lib.rs's and originSelfCheck.ts's ORIGIN_SELF_CHECK_MISMATCH_EVENT ` +
      `both equal ${JSON.stringify(rustValue)}.`
  );
}

main();
