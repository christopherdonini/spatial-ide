// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The table's declared values (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 7; ADR-010 rule 6: capacity ceilings are declared, not discovered).
 * This file imports nothing, so `workspace/selection.ts` can read `CAPTURED_ROW_MAX_BYTES` under the workspace's import rule (UA6).
 */

/** The counted bytes one captured row may hold in a selection member (`workspace/selection.ts`'s `capturedRow`), so 10,000 members hold at most 160 MiB. A row past it is cut, with a marker. */
export const CAPTURED_ROW_MAX_BYTES = 16_384;

/** The first scope's `limit` (section 7): the table asks for at most this many features. */
export const TABLE_MAX_ROWS = 1_000;

/** The windowed grid's row height and the rows it draws past each edge of the visible ones (section 7). */
export const TABLE_ROW_HEIGHT_PX = 24;
export const TABLE_OVERSCAN_ROWS = 10;

// TABLE_MAX_IN_FLIGHT (milestone 4 section 7, 1) is not a constant here: tableSource holds one stream handle and cancels it before it issues another, so no code would read the constant.

/**
 * The attribute data the first scope's rows may hold in all: the sum of `attributes.bytes` (each batch's copy of its projected
 * columns, an Arrow IPC stream, so offsets, validity and framing count) over the batches tableSource has added. Milestone 4's
 * form, Amendment 7 item 5; ADR-010 rule 6; approved by the human on 2026-10-24
 * (state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md, item 2).
 * 64 MiB, declared, not measured: 1,000 rows (TABLE_MAX_ROWS) x 32 columns (ATTRIBUTE_PROJECTION_MAX) x about 2 KiB a value
 * (67,108,864 / 32,000 = 2,097 bytes). The node table-max-attribute-bytes-measurement measures it, before any performance claim.
 * At the ceiling the table stops adding rows and says so: a batch that would pass it is not added, the stream is cancelled, and
 * the stopped line shows the rows already added; no row is left out without that line.
 */
export const TABLE_MAX_ATTRIBUTE_BYTES = 67_108_864;
