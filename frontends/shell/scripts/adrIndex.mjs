// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// NO SHEBANG, deliberately: `src/docs/adrIndex.test.ts` imports this module, and on a
// `core.autocrlf=true` checkout a `#!/usr/bin/env node` first line ending in CR LF makes Vitest's
// transform throw `SyntaxError: Invalid or unexpected token` in every importing suite while
// `node --check` still accepts the file (AI_DEVELOPMENT.md's eol class, second member -- PR #35).
// The CLI at the bottom is reached through `node scripts/adrIndex.mjs`, which needs no shebang.
//
// **What this generates.** The ADR index table in `docs/README.md`, one row per
// `docs/adr/ADR-0NN-*.md`, whose status cell is that ADR's OWN Status line copied verbatim -- no
// paraphrase, no classification, no truncation of the status text. The table therefore cannot say
// anything the ADRs do not say themselves, and `--check` fails when it drifts from them. It is the
// ADR's Status FIELD alone, though -- an acceptance condition or qualification recorded in an
// adjacent header field (ADR-017's and ADR-020's, for two) is NOT in the cell, which is why both
// the column heading and the block's header line say so (reviewer S1). The human-written narrative
// paragraph in `docs/README.md`'s "Conventions" section is not touched by this tool and is not
// replaced by the table: it carries reasoning the Status lines do not.
//
// **Where the block goes.** Between `<!-- adr-index:begin -->` and `<!-- adr-index:end -->`. When
// the markers already exist the block is replaced in place, so a human may move the section
// anywhere and regeneration follows it. When they do not exist (first run only) the section is
// appended at the end of the file -- after the narrative paragraph, and without splitting the
// "Conventions" bullet list that the narrative paragraph is the first item of.
//
// Every failure funnels through one `fail()` -> stderr + exit code (the `checkOriginEventName.mjs`
// idiom): a stack trace is noise in a `npm run verify` log.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const SHELL_DIR = dirname(SCRIPTS_DIR);
const REPO_ROOT = dirname(dirname(SHELL_DIR));

export const ADR_DIR = join(REPO_ROOT, "docs", "adr");
export const README_PATH = join(REPO_ROOT, "docs", "README.md");

export const BEGIN_MARKER = "<!-- adr-index:begin -->";
export const END_MARKER = "<!-- adr-index:end -->";
export const SECTION_HEADING = "## ADR index (generated)";

/** The one header line inside the markers, above the table. */
export const HEADER_LINE =
  "*Generated from each ADR's own Status line by `frontends/shell/scripts/adrIndex.mjs` — do not " +
  "edit by hand; run `npm run adr-index` in `frontends/shell`. `npm run verify:adr-index` fails on " +
  "drift. Each status cell is that ADR's **Status field alone**: an acceptance condition, a " +
  "corrigendum or a qualification recorded in an adjacent header field is not shown here, so read " +
  "the ADR before relying on a row. A reserved number with no ADR file (ADR-014 and ADR-031 today) " +
  "has no row.*";

export const TABLE_HEADER =
  "| ADR | Title | Status (the ADR's own Status field — conditions in adjacent fields are not " +
  "shown; read the ADR) |";
const TABLE_RULE = "|---|---|---|";

// `ADR-032-geoparquet-....md` -- three digits, so the two `PROPOSED-amendment-*` files and anything
// else in `docs/adr/` are excluded by the shape of the name rather than by a name list.
const ADR_FILE_RE = /^ADR-(\d{3})-.*\.md$/;

// The Status line, in the two shapes the tree actually uses: `**Status:** Accepted ...` (29 of the
// 30 ADRs) and `Status: **Accepted, 2026-09-02** ...` (ADR-028's own header, 2026-09-09). Accepted
// ADRs are immutable, so the reader accommodates the second shape rather than an ADR being edited
// to suit this tool; both are recognised only at the start of a line.
const STATUS_LINE_RE = /^(?:\*\*Status:\*\*|Status:)(.*)$/;

// The end boundary of the status paragraph. Most ADR headers run Status, Amends/Resolves, Sources,
// Related, Implemented by as consecutive lines with NO blank line between them, so a blank line
// alone is not the boundary of the STATUS field: without a boundary rule the status cell would
// carry other fields' words under a column that says it holds the ADR's own Status field.
//
// The boundary is a CLOSED SET of label names, not a label SHAPE (reviewer S2, 2026-09-09): a
// shape rule stops at any `Something:` line, so a status sentence that continues "Note: ...",
// "Withheld pending review: ..." or "**But not, and this matters:** ..." would be silently
// truncated -- and `--check` could never see it, both sides being this same reader. An
// unrecognised label-shaped line is therefore KEPT in the status: a new header field shows up as
// extra words in a visible cell, which a human can find and fix, rather than as missing words
// nobody can see.
//
// Derived by grep over `docs/adr/ADR-0*.md` lines 1-40 on 2026-09-09 (`grep -oE
// '^\*\*[^*]+:\*\*'` plus the plain-label variant), then filtered to the labels that name a HEADER
// FIELD. The four bold labels found in that window which are body prose rather than fields are
// deliberately EXCLUDED, so that a status continuing with such a phrase keeps it: `**Forbidden:**`
// (ADR-004:40), `**Caveat, recorded:**` (ADR-009:11), `**The outcome under §19.9, applied in
// order:**` and `**Two limits a reader must carry forward, both from §21:**` (ADR-012:14, :31).
const FIELD_LABELS = new Set([
  "Acceptance condition (human, 2026-08-13 — binding)",
  "Acceptance condition attached by the human",
  "Amends",
  "Deadline, inherited from that block",
  "Deliberately not cited as authority anywhere below",
  "Drafted by",
  "History",
  "Implemented by",
  "Not related",
  "Related",
  "Resolves",
  "Reviewed",
  "Scope of acceptance (the human's own framing)",
  "Scope of any evidence below",
  "Sources",
  "Split from",
]);

// A label-shaped line in either shape the tree uses -- `**Label:** ...` or `Label: ...` (ADR-028's
// own header). The captured name is looked up in `FIELD_LABELS`; the shape alone decides nothing.
const LABEL_LINE_RE = /^(?:\*\*([^*\n]{1,120}):\*\*|([A-Z][^:\n]{0,120}):)(?:\s|$)/;

/** True when this line opens one of the known adjacent header fields, ending the status paragraph. */
function startsKnownAdjacentField(line) {
  const match = LABEL_LINE_RE.exec(line);
  if (match === null) return false;
  return FIELD_LABELS.has(match[1] ?? match[2]);
}

/** Thrown by the core for every refusal; the CLI turns it into one stderr line and exit 1. Every
 * message is already a complete `adrIndex: FAIL -- ...` line naming the file at fault. */
export class AdrIndexError extends Error {
  constructor(message) {
    super(message);
    this.name = "AdrIndexError";
  }
}

/** One ADR's own words: its number, file name, H1 title and Status line. Nothing derived. */
function readAdrEntry(adrDir, file) {
  const number = ADR_FILE_RE.exec(file)[1];
  // CRLF-normalised on read: a `core.autocrlf=true` checkout otherwise leaves a trailing CR inside
  // every captured status line, and the committed block would never match on Windows CI.
  const lines = readFileSync(join(adrDir, file), "utf8").replace(/\r\n/g, "\n").split("\n");

  const h1 = lines.find((line) => line.startsWith("# "));
  if (h1 === undefined) {
    throw new AdrIndexError(
      `adrIndex: FAIL -- ${file} has no H1 title line (a line beginning "# "). This tool copies the ` +
        "ADR's own title; it does not invent one."
    );
  }
  const titlePrefix = new RegExp(`^ADR-${number}\\s*(?:[—–:-])\\s*`);
  const title = h1.slice(2).trim().replace(titlePrefix, "").trim();
  if (title === "") {
    throw new AdrIndexError(
      `adrIndex: FAIL -- ${file}'s H1 title is empty once its "ADR-${number}" prefix is removed.`
    );
  }

  const statusIndices = [];
  lines.forEach((line, index) => {
    if (STATUS_LINE_RE.test(line)) statusIndices.push(index);
  });
  if (statusIndices.length !== 1) {
    throw new AdrIndexError(
      `adrIndex: FAIL -- ${file} declares ${statusIndices.length} Status lines; exactly one is ` +
        'required (a line beginning "**Status:**" or "Status:"). ' +
        (statusIndices.length === 0
          ? "Without one there is nothing to copy, and this tool will not classify an ADR itself."
          : `Lines ${statusIndices.map((i) => i + 1).join(", ")} all match, and nothing here can ` +
            "tell which is authoritative -- so it refuses rather than picking the first.")
    );
  }

  const start = statusIndices[0];
  const parts = [STATUS_LINE_RE.exec(lines[start])[1].trim()];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "") break; // the paragraph ends
    if (startsKnownAdjacentField(line)) break; // one of the known adjacent header fields begins
    parts.push(line.trim());
  }
  const status = parts.filter((part) => part !== "").join(" ");
  if (status === "") {
    throw new AdrIndexError(
      `adrIndex: FAIL -- ${file}'s Status line carries no text after its prefix.`
    );
  }

  return { number, file, title, status };
}

/**
 * A copy of `entries` in ADR-number order. Its own function so the ordering can be tested directly
 * rather than through `readdirSync`, whose order this must not depend on (reviewer N1).
 */
export function sortEntries(entries) {
  return [...entries].sort((a, b) => Number(a.number) - Number(b.number));
}

/**
 * Every `ADR-0NN-*.md` in `adrDir`, sorted by number, each with its own title and Status line.
 * Throws (naming the file) when an ADR has no H1, no Status line, or more than one.
 */
export function readAdrStatuses(adrDir) {
  const files = readdirSync(adrDir).filter((name) => ADR_FILE_RE.test(name));
  return sortEntries(files.map((file) => readAdrEntry(adrDir, file)));
}

/** A markdown table cell: newlines collapsed to single spaces, pipes escaped. Nothing else. */
function cell(text) {
  return text.replace(/\s*\n\s*/g, " ").replace(/\|/g, "\\|");
}

/** The table alone -- header, rule, one row per ADR, the status cell verbatim. */
export function renderAdrIndex(entries) {
  const rows = entries.map(
    (entry) =>
      `| [ADR-${entry.number}](adr/${entry.file}) | ${cell(entry.title)} | ${cell(entry.status)} |`
  );
  return [TABLE_HEADER, TABLE_RULE, ...rows].join("\n");
}

/** What lives between the markers: the header line, a blank line, the table. */
export function renderIndexBlock(entries) {
  return `${HEADER_LINE}\n\n${renderAdrIndex(entries)}`;
}

function countOccurrences(text, needle) {
  let count = 0;
  let at = text.indexOf(needle);
  while (at !== -1) {
    count += 1;
    at = text.indexOf(needle, at + needle.length);
  }
  return count;
}

/** The committed block between the markers, LF-normalised, or a refusal naming what is wrong. */
export function extractIndexBlock(readmeText) {
  const text = readmeText.replace(/\r\n/g, "\n");
  const begins = countOccurrences(text, BEGIN_MARKER);
  const ends = countOccurrences(text, END_MARKER);
  if (begins !== 1 || ends !== 1) {
    throw new AdrIndexError(
      `adrIndex: FAIL -- docs/README.md must contain exactly one ${BEGIN_MARKER} and one ` +
        `${END_MARKER}; found ${begins} and ${ends}. Run \`npm run adr-index\` in frontends/shell ` +
        "to write the block."
    );
  }
  const from = text.indexOf(BEGIN_MARKER) + BEGIN_MARKER.length;
  const to = text.indexOf(END_MARKER);
  if (to < from) {
    throw new AdrIndexError(
      `adrIndex: FAIL -- docs/README.md's ${END_MARKER} appears before its ${BEGIN_MARKER}.`
    );
  }
  return text.slice(from, to).replace(/^\n+/, "").replace(/\n+$/, "");
}

/** `readmeText` with `block` between the markers, appending the section when they are absent. */
export function withIndexBlock(readmeText, block) {
  const text = readmeText.replace(/\r\n/g, "\n");
  const begins = countOccurrences(text, BEGIN_MARKER);
  const ends = countOccurrences(text, END_MARKER);
  if (begins === 0 && ends === 0) {
    const body = text.endsWith("\n") ? text : `${text}\n`;
    return `${body}\n${SECTION_HEADING}\n\n${BEGIN_MARKER}\n${block}\n${END_MARKER}\n`;
  }
  if (begins !== 1 || ends !== 1) {
    throw new AdrIndexError(
      `adrIndex: FAIL -- docs/README.md contains ${begins} ${BEGIN_MARKER} and ${ends} ` +
        `${END_MARKER}; this tool rewrites exactly one block and will not guess which.`
    );
  }
  const from = text.indexOf(BEGIN_MARKER) + BEGIN_MARKER.length;
  const to = text.indexOf(END_MARKER);
  if (to < from) {
    throw new AdrIndexError(
      `adrIndex: FAIL -- docs/README.md's ${END_MARKER} appears before its ${BEGIN_MARKER}.`
    );
  }
  return `${text.slice(0, from)}\n${block}\n${text.slice(to)}`;
}

/** Every row line in a block, keyed by ADR number -- a LIST per number, because a duplicated row is
 * itself a drift worth naming as such rather than reporting as whichever copy came last (N2). */
function rowsByAdr(block) {
  const rows = new Map();
  for (const line of block.split("\n")) {
    const match = /^\| \[ADR-(\d{3})\]/.exec(line);
    if (match) rows.set(match[1], [...(rows.get(match[1]) ?? []), line]);
  }
  return rows;
}

/**
 * `--check`'s core: a byte comparison of the committed block against the rendered one, reported
 * as the ADRs whose rows differ rather than as a diff of the whole block.
 */
export function checkIndex(readmeText, entries) {
  const expected = renderIndexBlock(entries);
  const committed = extractIndexBlock(readmeText); // throws on missing/duplicated markers
  if (committed === expected) {
    return {
      ok: true,
      message: `adrIndex: PASS -- ${entries.length} ADRs, index in docs/README.md matches every Status line`,
    };
  }

  const committedRows = rowsByAdr(committed);
  const expectedRows = rowsByAdr(expected);
  const changed = [];
  const missing = [];
  const duplicated = [];
  for (const [number, rows] of expectedRows) {
    const committedForNumber = committedRows.get(number);
    if (committedForNumber === undefined) missing.push(`ADR-${number}`);
    else if (committedForNumber.length > 1) {
      duplicated.push(`ADR-${number} appears ${committedForNumber.length} times`);
    } else if (committedForNumber[0] !== rows[0]) changed.push(`ADR-${number}`);
  }
  const extra = [...committedRows.keys()]
    .filter((number) => !expectedRows.has(number))
    .map((number) => `ADR-${number}`);

  const details = [];
  if (changed.length > 0) {
    details.push(`the committed row does not match the ADR's own Status line for ${changed.join(", ")}`);
  }
  if (duplicated.length > 0) details.push(`the row for ${duplicated.join(", the row for ")}`);
  if (missing.length > 0) details.push(`no row for ${missing.join(", ")}`);
  if (extra.length > 0) details.push(`a row for ${extra.join(", ")}, which has no ADR file`);
  if (details.length === 0) {
    details.push("the block's header line or table header differs from the generated one");
  }

  return {
    ok: false,
    message:
      `adrIndex: FAIL -- docs/README.md's ADR index has drifted: ${details.join("; ")}. ` +
      "Run `npm run adr-index` in frontends/shell to regenerate it; the ADRs are the source, the " +
      "table is not edited by hand.",
  };
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function main(argv) {
  try {
    const entries = readAdrStatuses(ADR_DIR);
    const readmeText = readFileSync(README_PATH, "utf8");
    if (argv.includes("--check")) {
      const result = checkIndex(readmeText, entries);
      if (!result.ok) {
        fail(result.message);
        return;
      }
      console.log(result.message);
      return;
    }
    // LF only: the text is assembled with `\n` and written through `writeFileSync`, which does no
    // newline translation -- a CRLF rewrite of a repository text file is the eol class's fourth
    // member (AI_DEVELOPMENT.md, 2026-09-09).
    writeFileSync(README_PATH, withIndexBlock(readmeText, renderIndexBlock(entries)), "utf8");
    console.log(`adrIndex: wrote ${entries.length} ADR rows into docs/README.md`);
  } catch (error) {
    if (error instanceof AdrIndexError) {
      fail(error.message);
      return;
    }
    fail(`adrIndex: FAIL -- ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Imported by the test suite; only a direct `node scripts/adrIndex.mjs` runs the CLI.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2));
}
