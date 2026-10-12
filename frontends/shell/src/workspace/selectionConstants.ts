// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 7, the declared constants of the selection (ADR-010 rule 6:
 * each says what it bounds). The two outline encodings and the highlight widths are `canvas/highlightLayers.ts`'s.
 */

import type { SelectionMode } from "./selection";
import type { Tool } from "./workspaceState";

/** Bounds the members of one selection. An add that would pass it is refused by name and the set stays as it was
 * (section 2.3); nothing is silently dropped. A selection keeps one authoritative bbox per member, so this also bounds
 * the memory a selection holds and the work of every count. */
export const SELECTION_MAX_FEATURES = 10_000;

/** The first state of a view (section 7's Defaults row; Amendment 1 A4): the tool a view starts in. */
export const DEFAULT_TOOL: Tool = "navigate";

/** The first state of a view (Amendment 1 A4, the default mode: toggle, labelled Add / remove). */
export const DEFAULT_SELECTION_MODE: SelectionMode = "toggle";
