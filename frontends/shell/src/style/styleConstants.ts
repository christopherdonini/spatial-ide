// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The Colour by apply's declared values (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 7; ADR-010 rule 6: capacity
 * ceilings are declared, not discovered). The colours are P6 placeholders; none is a design decision. This file imports nothing.
 */

/** The most cases one apply writes. It stays below ADR-017 section 5a's 64, which `document.ts` closes at. Values past it, in code-point order, draw as Other. */
export const CATEGORY_MAX_CASES = 12;

/** The case colours, in order: case `i` takes `CATEGORY_PALETTE[i]`. As many as `CATEGORY_MAX_CASES`. */
export const CATEGORY_PALETTE: readonly string[] = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
];

/** The colour of a feature whose value is NULL (the document's `on_null`). */
export const CATEGORY_NULL_COLOR = "#9e9e9e";

/** The colour of a feature whose value no case names (the document's `on_unmatched`). */
export const CATEGORY_OTHER_COLOR = "#616161";
