// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Viewport-residency cut P3: the shell's own LOCKED source of truth for tile-keyed residency,
 * mirroring the two values `e2e/residencyTrace.mjs` already carries as
 * `TILE_SIZE_LEVELS_PROPOSED`/`MAX_IN_FLIGHT_TILE_STREAMS_PROPOSED` (Amendment 11: "LOCKED").
 * Deliberately a SEPARATE module, not an import from that `.mjs` trace file -- `e2e/` is Node-side
 * test/harness code (do-not-touch this piece per NEXT-CUT.md's own boundary), and this module is the
 * one the actual shell bundle (`src/`) imports. The two are expected to carry the same values; if
 * Amendment 11 is ever revisited, both copies need updating, by design -- one file is the trace's
 * own declared data, the other is product code, and neither should reach into the other's module
 * graph.
 */

/** Tile grid resolutions (NEXT-CUT.md P3 item A): three fixed subdivisions of the SAME frame
 * (`tileGrid.ts`'s own `TileGridFrame`, level-independent) -- swept, not chosen, by P6's own tester
 * runs. A session picks exactly one for its whole lifetime (`TileViewportStreamManager`'s own
 * `level` constructor option); this list exists for anything that needs to enumerate all three
 * (P6's sweep), not to imply a session ever changes level mid-flight. */
export type TileGridLevel = "coarse" | "medium" | "fine";

export const TILE_GRID_LEVELS: readonly TileGridLevel[] = Object.freeze(["coarse", "medium", "fine"]);

/** Cells per axis at each level -- an 8x8 grid has 64 cells total, etc. */
export const TILE_GRID_DIMENSIONS: Readonly<Record<TileGridLevel, number>> = Object.freeze({
  coarse: 8,
  medium: 16,
  fine: 32,
});

/** This piece's own construction default when a caller does not specify a level -- NOT itself a
 * locked value (P6 sweeps all three); chosen as the mid-point of the three locked resolutions so an
 * unconfigured candidate-arm session has a reasonable starting point rather than an arbitrary edge. */
export const DEFAULT_TILE_GRID_LEVEL: TileGridLevel = "medium";

/** The shell's declared fan-out ceiling for concurrent tile-keyed `viewport_query` streams a single
 * camera-change plan may have in flight at once (Amendment 11, LOCKED) -- additional covering tiles
 * queue rather than mint a 4th+ concurrent ticket. */
export const MAX_IN_FLIGHT_TILE_STREAMS = 3;
