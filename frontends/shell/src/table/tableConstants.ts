// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The table's declared values (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 7; ADR-010 rule 6: capacity ceilings are declared, not discovered).
 * This file imports nothing, so `workspace/selection.ts` can read `CAPTURED_ROW_MAX_BYTES` under the workspace's import rule (UA6).
 */

/** The counted bytes one captured row may hold in a selection member (`workspace/selection.ts`'s `capturedRow`), so 10,000 members hold at most 160 MiB. A row past it is cut, with a marker. */
export const CAPTURED_ROW_MAX_BYTES = 16_384;
