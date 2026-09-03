#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// P1d B1+B2: this scan makes the "fabricated citation" defect class -- a quoted sentence attributed
// to a document that does not actually contain it -- MECHANICALLY IMPOSSIBLE to ship un-caught in the
// files this script scans, rather than relying (a third time, per the piece that added this script)
// on a human proofreader catching it by hand. Run directly (`node e2e/citationIntegrity.test.mjs`) or
// via `npm run test:citation-integrity`, wired into `npm run verify`.
//
// WHAT THIS SCRIPT DOES: for every source file matching `e2e/residency*.mjs` or
// `src/instrument/*.ts`, it extracts every double-quoted substring living inside a COMMENT (a `/* */`
// block or a consecutive run of `//` lines -- never a quote inside actual code, e.g. a string
// literal) that has a section-mark (a `§` character) or a recognized document-name token
// (RESIDENCY-PREREGISTRATION, CLAUDE.md, AI_DEVELOPMENT, SKP-V0, a `docs/NN` path, or an `ADR-NNN`
// id) within 120 characters, OUTSIDE the quote itself, in the SAME comment. For each such quote, it
// resolves which real file that nearby citation names (defaulting a bare `§N`, with no document name
// attached, to RESIDENCY-PREREGISTRATION.md -- the one document every file this script scans is
// written exclusively against) and asserts the quoted text is a literal, verbatim substring of that
// file, after three, and only three, disclosed normalizations: (1) collapsing whitespace runs
// (including the document's own markdown line-wrapping) to a single space, since a comment's own
// line-wrapping legitimately differs from the source document's, (2) treating this codebase's own
// ASCII `--` (used throughout in place of a real em dash for plain-ASCII safety) as equivalent to the
// Unicode em dash the documents themselves use, and (3) stripping markdown markup that carries no
// content of its own -- backtick code-span markers and `**`/`*` emphasis markers -- since a document's
// own bolding/code-span choices are presentation, not content, and a quote copied out of a bolded or
// code-spanned span legitimately drops the markup while keeping the words. No other difference is
// tolerated: an ellipsis standing in for elided text, a changed character (e.g. a different
// multiplication/comparison/arrow symbol), a changed capitalization, added or removed words, or a
// different citation target all fail this check.
//
// WHAT THIS SCRIPT CANNOT CATCH (disclosed, not merely implied by a passing run):
//  - A quote whose nearby citation is missing entirely (no § or document-name token within 120
//    characters) is never even considered -- a fabricated quote with NO citation attached at all is
//    invisible to this script (though also, arguably, a lesser offense: it is not claiming to be FROM
//    anywhere).
//  - A quote attributed to the WRONG section of the RIGHT document (the text exists in that document,
//    just not where the comment implies) passes -- this script only checks the whole target FILE for
//    the substring, never the specific section named.
//  - A quote that happens to be a genuine, accidental substring of the target document for reasons
//    unrelated to actual attribution (e.g. a short, generic phrase) can pass without truly having been
//    copied from the cited place -- the shorter and more generic the quoted text, the weaker this
//    script's own signal.
//  - Only DOUBLE-quoted spans are scanned; a citation built from single quotes is invisible here.
//  - A quote that is itself the ENTIRE first argument of a test-description string (this repository's
//    own `test("...", ...)`/`it("...", ...)` convention) that happens to mention a section/document
//    name INSIDE that same string is correctly excluded (a citation must live OUTSIDE the quote it
//    is meant to describe) -- but a citation living outside the quote yet still inside a DIFFERENT
//    nearby quote is also excluded, by the same rule, even on the rare occasion that exclusion is
//    wrong.
//
// This script proves absence of a MISMATCH for what it catches; it does not, and cannot, prove every
// citation-shaped comment in these files is honest.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const E2E_DIR = dirname(fileURLToPath(import.meta.url));
const SHELL_DIR = dirname(E2E_DIR);
const REPO_ROOT = join(SHELL_DIR, "..", "..");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL - ${name}`);
    console.error(`    ${e.stack ?? e.message}`);
  }
}

// ---------------------------------------------------------------------------------------
// The scanned file set.
// ---------------------------------------------------------------------------------------

function listScannedFiles() {
  const out = [];
  for (const entry of readdirSync(E2E_DIR)) {
    if (/^residency.*\.mjs$/.test(entry)) {
      out.push(join(E2E_DIR, entry));
    }
  }
  const instrumentDir = join(SHELL_DIR, "src", "instrument");
  for (const entry of readdirSync(instrumentDir)) {
    if (entry.endsWith(".ts")) {
      out.push(join(instrumentDir, entry));
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------
// Comment-block extraction. A quote spanning multiple physical lines of a `/** ... */` or a
// consecutive `//` run is invisible to a naive single-line quote regex (the raw source has a literal
// newline, plus a `*`/`//` continuation prefix, between the quote's own words) -- this flattens each
// comment block's own text into ONE line (continuation prefixes stripped, line breaks folded to a
// single space) before extracting quotes/citations from it, so a quote's own line-wrapping in the
// SOURCE never fools this scanner into missing it (or, worse, mis-pairing an unrelated pair of quote
// marks either side of a multi-line one -- exactly the failure mode a naive `[^"\n]`-based regex has).
const COMMENT_BLOCK_RE = /\/\*[\s\S]*?\*\/|(?:^[ \t]*\/\/[^\n]*\n?)+/gm;

function flattenBlockComment(raw) {
  return raw
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((line) => line.replace(/^[ \t]*\*[ \t]?/, ""))
    .join(" ");
}

function flattenLineCommentRun(raw) {
  return raw
    .split("\n")
    .map((line) => line.replace(/^[ \t]*\/\/[ \t]?/, ""))
    .join(" ");
}

function extractCommentBlocks(text) {
  const blocks = [];
  let m;
  COMMENT_BLOCK_RE.lastIndex = 0;
  while ((m = COMMENT_BLOCK_RE.exec(text))) {
    const raw = m[0];
    const flattened = raw.startsWith("/*") ? flattenBlockComment(raw) : flattenLineCommentRun(raw);
    const lineNumber = text.slice(0, m.index).split("\n").length;
    blocks.push({ flattened, lineNumber });
  }
  return blocks;
}

// ---------------------------------------------------------------------------------------
// Quote / citation extraction within one flattened (newline-free) comment block.
// ---------------------------------------------------------------------------------------

const QUOTE_RE = /"([^"]{1,400})"/g;
const DOC_RE =
  /(RESIDENCY-PREREGISTRATION(?:\.md)?|CLAUDE\.md|AI_DEVELOPMENT(?:\.md)?|SKP-V0|docs\/(\d{2})|ADR-(\d{3}))(?:\s*§\s*\d+[a-zA-Z]?)?|§\s*\d+[a-zA-Z]?/g;
const PROXIMITY_CHARS = 120;

function findQuotesAndCitations(flattened) {
  const quotes = [];
  let m;
  QUOTE_RE.lastIndex = 0;
  while ((m = QUOTE_RE.exec(flattened))) {
    quotes.push({ start: m.index, end: m.index + m[0].length, text: m[1] });
  }
  const citationsAll = [];
  let d;
  DOC_RE.lastIndex = 0;
  while ((d = DOC_RE.exec(flattened))) {
    citationsAll.push({ start: d.index, end: d.index + d[0].length, text: d[0], docsGroup: d[2], adrGroup: d[3] });
  }
  // A citation living INSIDE some quote's own span describes that quote's own content (e.g. a test
  // description that mentions "§4b" about itself) -- never a claim that the OUTER text attributes
  // that quote to a document, so such citations are excluded from being any quote's "nearby citation."
  const citations = citationsAll.filter((c) => !quotes.some((q) => c.start >= q.start && c.end <= q.end));
  return { quotes, citations };
}

/** For each quote, the nearest citation OUTSIDE it, within `PROXIMITY_CHARS`, on either side --
 * `null` if none qualifies (the quote is not scanned further). */
function nearestCitation(quote, citations) {
  let best = null;
  let bestDist = Infinity;
  for (const c of citations) {
    let dist = Infinity;
    if (c.end <= quote.start) dist = quote.start - c.end;
    else if (c.start >= quote.end) dist = c.start - quote.end;
    if (dist <= PROXIMITY_CHARS && dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------------------
// Citation -> target file resolution.
// ---------------------------------------------------------------------------------------

function resolveDocsFile(twoDigits) {
  const dir = join(REPO_ROOT, "docs");
  const found = readdirSync(dir).find((f) => f.startsWith(`${twoDigits}_`) && f.endsWith(".md"));
  return found ? join(dir, found) : null;
}

function resolveAdrFile(threeDigits) {
  const dir = join(REPO_ROOT, "docs", "adr");
  const found = readdirSync(dir).find((f) => f.startsWith(`ADR-${threeDigits}-`) && f.endsWith(".md"));
  return found ? join(dir, found) : null;
}

function resolveTargetFile(citation) {
  if (citation.text.includes("RESIDENCY-PREREGISTRATION")) return join(SHELL_DIR, "RESIDENCY-PREREGISTRATION.md");
  if (citation.text.includes("CLAUDE.md")) return join(REPO_ROOT, "CLAUDE.md");
  if (citation.text.includes("AI_DEVELOPMENT")) return join(REPO_ROOT, "AI_DEVELOPMENT.md");
  if (citation.text.includes("SKP-V0")) return join(REPO_ROOT, "protocol", "skp", "SKP-V0.md");
  if (citation.docsGroup) return resolveDocsFile(citation.docsGroup);
  if (citation.adrGroup) return resolveAdrFile(citation.adrGroup);
  // A bare `§N`, no document name attached in the same citation match: this script's own disclosed
  // default (see this file's own top comment) -- every file it scans is written exclusively against
  // RESIDENCY-PREREGISTRATION.md's own section numbering.
  if (citation.text.includes("§")) return join(SHELL_DIR, "RESIDENCY-PREREGISTRATION.md");
  return null;
}

// ---------------------------------------------------------------------------------------
// The three disclosed normalizations (this file's own top comment) -- nothing else.
// ---------------------------------------------------------------------------------------

function normalize(s) {
  return s
    .replace(/--/g, "\u2014") // this codebase's own ASCII stand-in for an em dash
    .replace(/[`*]/g, "") // markdown code-span backticks and emphasis (`*`/`**`) markers carry no content of their own
    .replace(/\s+/g, " ")
    .trim();
}

const targetFileCache = new Map();
function readNormalizedTarget(path) {
  if (!targetFileCache.has(path)) {
    targetFileCache.set(path, normalize(readFileSync(path, "utf8")));
  }
  return targetFileCache.get(path);
}

// ---------------------------------------------------------------------------------------
// Run the scan.
// ---------------------------------------------------------------------------------------

const scannedFiles = listScannedFiles();
test(`scans a non-empty file set (found ${scannedFiles.length})`, () => {
  if (scannedFiles.length === 0) {
    throw new Error("listScannedFiles() found nothing -- e2e/residency*.mjs or src/instrument/*.ts moved or renamed?");
  }
});

let totalQuotesChecked = 0;

for (const filePath of scannedFiles) {
  const relPath = relative(SHELL_DIR, filePath).split("\\").join("/");
  const text = readFileSync(filePath, "utf8");
  const blocks = extractCommentBlocks(text);

  for (const block of blocks) {
    const { quotes, citations } = findQuotesAndCitations(block.flattened);
    for (const quote of quotes) {
      const citation = nearestCitation(quote, citations);
      if (!citation) continue; // no § / document-name token nearby -- not this script's job (see top comment)

      totalQuotesChecked++;
      const label = `${relPath}:~${block.lineNumber} — cites ${JSON.stringify(citation.text)} — quotes ${JSON.stringify(
        quote.text.slice(0, 90) + (quote.text.length > 90 ? "…" : "")
      )}`;

      test(label, () => {
        const targetPath = resolveTargetFile(citation);
        if (!targetPath) {
          throw new Error(`could not resolve a target file for citation ${JSON.stringify(citation.text)}`);
        }
        if (!existsSync(targetPath)) {
          throw new Error(`resolved target file does not exist: ${targetPath}`);
        }
        const targetNormalized = readNormalizedTarget(targetPath);
        const quoteNormalized = normalize(quote.text);
        if (!targetNormalized.includes(quoteNormalized)) {
          throw new Error(
            `quoted text does not appear verbatim (after whitespace/em-dash/backtick normalization) in ` +
              `${relative(REPO_ROOT, targetPath)}. Quoted: ${JSON.stringify(quote.text)}`
          );
        }
      });
    }
  }
}

console.log("");
console.log(`citationIntegrity: ${totalQuotesChecked} citation-adjacent quote(s) checked across ${scannedFiles.length} file(s).`);
console.log(`== ${passed} passed, ${failed} failed ==`);
if (failed > 0) {
  process.exitCode = 1;
}
