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

/** P5f complex-gate should-fix 2: the declared ceiling on how many tiles `TileViewportStreamManager`
 * will ever hold in its own `"queued"` state at once -- undeclared before this piece, which made the
 * queue's own fan-out unbounded (a covering set at an extreme zoom-out could in principle queue
 * thousands of tiles with nothing to stop it). The arithmetic: the FINE grid level's own whole frame
 * is `TILE_GRID_DIMENSIONS.fine ** 2` = 32 * 32 = 1,024 cells -- a covering set approaching the WHOLE
 * frame at the finest resolution is already an extreme zoom-out where truncation is honest, expected
 * behavior, not a normal pan/zoom. Half of that (512) is generous headroom for the ordinary case
 * (a covering set that is some real fraction of the frame, not the whole thing) while still bounding
 * the pathological one. A covering set whose NEW (not already tracked/resident) tile count exceeds
 * this, combined with `MAX_IN_FLIGHT_TILE_STREAMS`'s own free issuing slots, truncates FARTHEST-FIRST
 * from the current view centre -- `onCameraChange`'s own `TilePlanOutcome.coveringTruncated`/
 * `truncatedCount` record it, never silently. */
export const MAX_QUEUED_TILES = 512;

/** P5f complex-gate should-fix 4: the row limit the candidate arm's own untiled "first look" query
 * (`residency/candidateArmSession.ts`'s `issueUntiledQuery`) passes as `viewport_query`'s own `limit`
 * -- before P5f, that query was UNBOUNDED (`limit: null`, mirroring baseline's initial load) and
 * self-cancelled the instant its first batch delivered anything, so a ~10M-vertex fixture's own
 * untiled first look "ran past 60s without completing" (`issueUntiledQuery`'s own doc comment has the
 * full account) before ever reaching that self-cancel. This query exists ONLY to derive a
 * representative extent for the tile grid's own anchor (S4: the WHOLE untiled first look's own
 * union, not merely a batch's own extent -- `tileGrid.ts`'s own top doc comment) -- never to render
 * anything from it directly.
 *
 * **P5h fix: 10,000, down from P5f's own 200,000.** P5f's bound was still convicted evidence
 * (P5g): running to its own natural terminal at 200,000 rows decoded ~20M mostly-refused vertices
 * purely to observe an extent, 70-121s observed and variable -- the bootstrap over-fetching relative
 * to the one thing it actually needs. 10,000 is a DECLARED design choice (ADR-010 rule 6 style), not
 * a measured or proven one: this piece asserts that 10k rows of the docs/08-spec'd fixtures span
 * statistically the same extent the full untiled scan would, but that is NOT demonstrated here --
 * state it as the declared bound it is, not as fact. Determinism is preserved in exactly the sense
 * this module already claims elsewhere (this constant's own original comment, and `tileGrid.ts`'s own
 * doc comment): the limit is a fixed, declared input, and row order is whatever the engine's own scan
 * already deterministically produces for a given query -- this smaller bound adds no NEW source of
 * run-to-run variance beyond what the 200,000 bound already had or lacked.
 *
 * **Ingestion, not merely extent-observation, is retained by design -- unchanged by this fix.** The
 * bootstrap's own rows are still ingested through the SAME `WorkingCanvas.pushTileBatch` seam every
 * real tile stream's batches are (under the reserved `INITIAL_TILE_KEY`) -- P5f's own reserved-tile
 * ingest (`WorkingCanvas.tsx`'s `RESERVED_TILE_KEYS`) and `tileResidentSet.ts`'s own "evicted LAST
 * resort" policy for that key both exist BECAUSE that retention was already the design (cross-tile
 * dedupe needs the bootstrap's own content resident to compare newly-arriving tiles against). A
 * smaller declared limit only makes that existing retention cheaper -- it does not change what is
 * retained or how; redesigning that split is explicitly out of THIS piece's scope. */
export const UNTILED_FIRST_LOOK_ROW_LIMIT = 10_000;

/** Reserved tile key for the candidate arm's initial, untiled "first look" query's own batches
 * (`residency/candidateArmSession.ts`'s own top doc comment has the full account of why this query
 * exists) -- never a real tile key `tileGrid.ts`'s own `"row:col"` string form could ever produce (no
 * digit, no colon flanked by two numbers). Declared HERE, not in `candidateArmSession.ts` (which
 * re-exports it for backward compatibility), so `tileIngest.ts`/`WorkingCanvas.tsx` -- both of which
 * need to exclude it from distance-ordered eviction planning (P5f complex-gate must-fix 3: a NaN
 * distance from parsing this as a `"row:col"` key made eviction order a comparator artifact) -- can
 * import it without a cycle back into `candidateArmSession.ts` (which itself imports
 * `WorkingCanvasHandle`'s TYPE from `WorkingCanvas.tsx`). */
export const INITIAL_TILE_KEY = "initial-untiled-look";
