#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// ADR-020 Amendment 1 -- reviewer S1, widened on the closing gate (must-fix 3): the event CONTRACT
// between `src-tauri/src/lib.rs` and `src/diagnostics/originSelfCheck.ts` is two things, not one,
// and neither is checked by any compiler (a Rust `&str`/`#[serde(...)]` attribute and a TypeScript
// string literal share no type system):
//
//   1. the event NAME -- `ORIGIN_SELF_CHECK_MISMATCH_EVENT`, declared on both sides. A human
//      editing one side (e.g. renaming the event when the "unverifiable" outcome was added) could
//      silently drift the other, and `app.emit(...)`/`listen(...)` would then simply never see each
//      other's traffic, with no error anywhere.
//   2. the payload's `kind` DISCRIMINANT strings -- `OriginSelfCheckOutcome`'s variants
//      (`#[serde(tag = "kind", rename_all = "camelCase")]`) as serde actually serializes them,
//      against the `kind: "..."` literals of `originSelfCheck.ts`'s discriminated union. This half
//      exists because a drift here is WORSE than silence: a renamed Rust variant still arrives as a
//      well-formed event, and the frontend's own discriminated union simply fails to match it. The
//      component's defensive third branch (`OriginMismatchState.tsx`) keeps that from being
//      rendered as a refusal claim -- but the branch is a safety net, not the contract; this check
//      is the contract.
//
// The script's method, following `checkDevOriginConsistency.mjs`'s own idiom exactly: read both
// real source files as text (no code execution), require EXACTLY ONE declaration of each shape (an
// ambiguous file -- zero or more than one match -- fails loudly rather than silently picking one,
// the same reasoning `checkDevOriginConsistency.mjs`'s top comment gives for `readVitePort`'s
// `matchAll`), and require the extracted values to agree.
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

// The tagged enum, attribute included: the tag name and the rename rule are captured rather than
// assumed, because this script's own PascalCase -> camelCase transformation below is only correct
// for `rename_all = "camelCase"`. The body is captured non-greedily up to a closing brace in column
// 0 -- variants and their fields are indented, so the first such brace is the enum's own.
const RUST_ENUM_RE =
  /#\[serde\(tag = "([^"]*)", rename_all = "([^"]*)"\)\]\s*\n(?:pub\s+)?enum\s+OriginSelfCheckOutcome\s*\{\n([\s\S]*?)\n\}/g;

// A variant line inside that body: indented, starts with a capital, followed by its field block,
// tuple, or a bare `,`. Doc comments (`///`) and field lines (lower-case) cannot match.
const RUST_VARIANT_RE = /^[ \t]+([A-Z][A-Za-z0-9]*)\s*[{(,]/gm;

// `  kind: "mismatch";` -- every discriminant literal declared by the TypeScript union's members.
const TS_KIND_RE = /^\s*kind:\s*"([^"]*)"\s*;/gm;

// serde's own `rename_all = "camelCase"` applied to a PascalCase variant name is exactly
// "lower-case the leading capital" -- true for single-capital-run names only, which is why
// `assertPlainPascalCase` below refuses anything else rather than guessing.
const SUPPORTED_RENAME_RULE = "camelCase";
const EXPECTED_SERDE_TAG = "kind";

/** Every failure funnels through here: a message on stderr and a non-zero exit code, never a throw
 * (an uncaught exception's stack trace is noise in a `npm run verify` log, and the "found N"
 * ambiguity path deserves exactly the same shape as the drift path -- closing-gate nit). */
const failures = [];
function fail(message) {
  failures.push(message);
}

function extractExactlyOne(path, regex, label, groupCount = 1) {
  const text = readFileSync(path, "utf8");
  const matches = [...text.matchAll(regex)];
  if (matches.length !== 1) {
    fail(
      `checkOriginEventName: FAIL -- expected exactly one ${label} declaration in ${path}, found ` +
        `${matches.length}. ${
          matches.length === 0
            ? "The declaration shape this script expects may have changed; update the regex alongside it."
            : "An ambiguous file (e.g. a second declaration, or a comment shaped like the real one): " +
              "this script cannot tell which match is authoritative without a human deciding, so it " +
              "refuses rather than silently picking the first one."
        }`
    );
    return null;
  }
  return matches[0].slice(1, 1 + groupCount);
}

/** serde's camelCase of a PascalCase variant, with the transformation's own precondition asserted
 * rather than assumed: `HTTPThing`-style consecutive capitals do NOT serialize as a simple
 * first-letter lower-casing, so such a name fails this check instead of being mis-derived. */
function serdeCamelCase(variant) {
  if (!/^[A-Z][a-z0-9]*(?:[A-Z][a-z0-9]*)*$/.test(variant) || /[A-Z]{2}/.test(variant)) {
    fail(
      `checkOriginEventName: FAIL -- variant ${JSON.stringify(variant)} is not plain PascalCase ` +
        "(single capitals only). This script derives serde's camelCase form by lower-casing the " +
        "leading capital, which is correct only for that shape -- rather than guess, it refuses: " +
        "pin the expected string explicitly here, alongside whatever variant name was introduced."
    );
    return null;
  }
  return variant[0].toLowerCase() + variant.slice(1);
}

function main() {
  // --- 1. the event name -------------------------------------------------------------------
  const rust = extractExactlyOne(
    LIB_RS_PATH,
    RUST_CONST_RE,
    "ORIGIN_SELF_CHECK_MISMATCH_EVENT (Rust)"
  );
  const ts = extractExactlyOne(
    ORIGIN_SELF_CHECK_TS_PATH,
    TS_CONST_RE,
    "ORIGIN_SELF_CHECK_MISMATCH_EVENT (TypeScript)"
  );

  if (rust && ts && rust[0] !== ts[0]) {
    fail(
      `checkOriginEventName: FAIL -- ${LIB_RS_PATH}'s ORIGIN_SELF_CHECK_MISMATCH_EVENT ` +
        `(${JSON.stringify(rust[0])}) does not match ${ORIGIN_SELF_CHECK_TS_PATH}'s ` +
        `(${JSON.stringify(ts[0])}). These two copies of the self-check event name have ` +
        "drifted -- the host's app.emit(...) and the frontend's listen(...) would no longer see each " +
        "other's traffic, and nothing else in the build would catch that."
    );
  }

  // --- 2. the payload's `kind` discriminants -------------------------------------------------
  const enumMatch = extractExactlyOne(
    LIB_RS_PATH,
    RUST_ENUM_RE,
    "OriginSelfCheckOutcome (serde-tagged enum)",
    3
  );
  let rustKinds = null;
  if (enumMatch) {
    const [tag, renameRule, body] = enumMatch;
    if (tag !== EXPECTED_SERDE_TAG || renameRule !== SUPPORTED_RENAME_RULE) {
      fail(
        `checkOriginEventName: FAIL -- OriginSelfCheckOutcome is tagged ` +
          `#[serde(tag = ${JSON.stringify(tag)}, rename_all = ${JSON.stringify(renameRule)})], but ` +
          `this script only knows how to derive the wire strings for tag ` +
          `${JSON.stringify(EXPECTED_SERDE_TAG)} + rename_all ${JSON.stringify(SUPPORTED_RENAME_RULE)} ` +
          "-- and the frontend's own union is written against that shape. Update both together."
      );
    } else {
      const variants = [...body.matchAll(RUST_VARIANT_RE)].map((m) => m[1]);
      if (variants.length === 0) {
        fail(
          `checkOriginEventName: FAIL -- found no variants inside OriginSelfCheckOutcome in ` +
            `${LIB_RS_PATH}. The enum body's shape this script scans for (an indented, ` +
            "capital-initial variant name) may have changed; update the regex alongside it."
        );
      } else {
        const derived = variants.map(serdeCamelCase);
        rustKinds = derived.some((k) => k === null) ? null : derived;
      }
    }
  }

  const tsKindMatches = [
    ...readFileSync(ORIGIN_SELF_CHECK_TS_PATH, "utf8").matchAll(TS_KIND_RE),
  ].map((m) => m[1]);
  if (tsKindMatches.length === 0) {
    fail(
      `checkOriginEventName: FAIL -- found no \`kind: "..."\` discriminant declarations in ` +
        `${ORIGIN_SELF_CHECK_TS_PATH}. The union's shape this script scans for may have changed; ` +
        "update the regex alongside it."
    );
  }

  if (rustKinds && tsKindMatches.length > 0) {
    const rustSorted = [...rustKinds].sort();
    const tsSorted = [...tsKindMatches].sort();
    const same =
      rustSorted.length === tsSorted.length && rustSorted.every((k, i) => k === tsSorted[i]);
    if (!same) {
      fail(
        `checkOriginEventName: FAIL -- the self-check payload's \`kind\` discriminants have ` +
          `drifted. ${LIB_RS_PATH}'s OriginSelfCheckOutcome serializes ` +
          `${JSON.stringify(rustSorted)}; ${ORIGIN_SELF_CHECK_TS_PATH}'s union declares ` +
          `${JSON.stringify(tsSorted)}. A drift here is silent at runtime: the event still ` +
          "arrives, the frontend's union simply fails to match it, and only " +
          "OriginMismatchState.tsx's defensive third branch stands between that and a rendered " +
          "claim nothing established."
      );
    }
  }

  if (failures.length > 0) {
    for (const message of failures) console.error(message);
    process.exitCode = 1;
    return;
  }

  console.log(
    `checkOriginEventName: PASS -- lib.rs's and originSelfCheck.ts's ` +
      `ORIGIN_SELF_CHECK_MISMATCH_EVENT both equal ${JSON.stringify(rust[0])}, and their ` +
      `\`kind\` discriminants agree: ${JSON.stringify([...rustKinds].sort())}.`
  );
}

main();
