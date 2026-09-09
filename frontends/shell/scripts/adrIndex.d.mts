// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Ambient declaration for `adrIndex.mjs`, so `src/docs/adrIndex.test.ts` (a TypeScript file under
// this package's own `strict`/`noImplicitAny`) can import it without `allowJs`. Same reason and
// same shape as `metafileKey.d.mts` and `rustCrateNotices.d.mts`; kept in sync with the module's
// own exports by hand, there being no other source of truth for a plain-JS module.

/** One ADR's own words, copied: nothing here is derived from anything but the file. */
export interface AdrEntry {
  /** The three-digit number from the file name, e.g. `"021"`. */
  number: string;
  /** The file name inside `docs/adr/`. */
  file: string;
  /** The H1 title, minus its own `ADR-0NN — ` prefix. */
  title: string;
  /** The Status FIELD's text after the `**Status:**` / `Status:` prefix, wrapped lines joined --
   * not the adjacent header fields, whatever they qualify. */
  status: string;
}

export declare class AdrIndexError extends Error {}

export declare const ADR_DIR: string;
export declare const README_PATH: string;
export declare const BEGIN_MARKER: string;
export declare const END_MARKER: string;
export declare const SECTION_HEADING: string;
export declare const HEADER_LINE: string;
export declare const TABLE_HEADER: string;

export declare function sortEntries(entries: AdrEntry[]): AdrEntry[];
export declare function readAdrStatuses(adrDir: string): AdrEntry[];
export declare function renderAdrIndex(entries: AdrEntry[]): string;
export declare function renderIndexBlock(entries: AdrEntry[]): string;
export declare function extractIndexBlock(readmeText: string): string;
export declare function withIndexBlock(readmeText: string, block: string): string;
export declare function checkIndex(
  readmeText: string,
  entries: AdrEntry[],
): { ok: boolean; message: string };
