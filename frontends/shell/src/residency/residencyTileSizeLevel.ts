// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { TileGridLevel } from "../canvas/tileGridConstants";

/**
 * Viewport-residency cut P7: the tile-size sweep selector -- the campaign's last missing wire. This
 * module is the DEV-only counterpart to `residencyArm.ts`'s "THE ARM SWITCH" for the ONE remaining
 * knob P6's own tester runs need to sweep: which of the three LOCKED grid resolutions
 * (`tileGridConstants.ts`'s own `TILE_GRID_LEVELS`, Amendment 11) a candidate-arm session's
 * `TileViewportStreamManager` constructs against. Mirrors `residencyArm.ts`'s own module-scoped
 * singleton, typed-refusal, and test-reset discipline exactly -- see that module's own top doc
 * comment for the full rationale, restated only where this module's own contract differs.
 *
 * **DEV-only by convention, not by a check inside this module itself** -- same discipline
 * `residencyArm.ts` documents: every call site (`App.tsx`'s `__SPATIAL_E2E__` hook registrations, and
 * the `notifyResidencyTileSizeLevelDataset{Opened,Closed}` bookkeeping calls) is what is DEV-gated
 * (`isInstrumentedBuild()`), never this module's own exports. Kept plain, synchronous, and trivially
 * unit-testable with no `import.meta.env` mocking, exactly like `residencyArm.ts`.
 *
 * **`null` means "unset", not "medium".** `getResidencyTileSizeLevel()` returns `null` until a
 * caller's own `setResidencyTileSizeLevel` call succeeds -- this module deliberately does NOT default
 * to `DEFAULT_TILE_GRID_LEVEL` itself (that would duplicate the single source of truth
 * `TileViewportStreamManager`'s own constructor already owns: `opts.level ?? DEFAULT_TILE_GRID_LEVEL`,
 * `tileViewportStreamManager.ts`). `candidateArmSession.ts` passes this getter's own `null` straight
 * through as `level: undefined` to that constructor, which is EXACTLY what it already did before this
 * piece existed (no `level` option at all) -- "unset" reproduces today's implicit default
 * (`DEFAULT_TILE_GRID_LEVEL` = `"medium"`) rather than this module re-declaring what that default is.
 */

export type SetResidencyTileSizeLevelResult =
  | { ok: true }
  /** A typed refusal, never a thrown exception -- mirrors `SetResidencyArmResult`'s own discipline
   * (`residencyArm.ts`). */
  | { ok: false; code: "dataset-open"; message: string };

let currentLevel: TileGridLevel | null = null;
/** True between a dataset's own admission and its close -- tracked via explicit
 * `notifyResidencyTileSizeLevelDatasetOpened`/`notifyResidencyTileSizeLevelDatasetClosed` calls
 * (`App.tsx`'s `[admitted]` effect, dev-gated), the same separation-of-concerns `residencyArm.ts`'s
 * own identically-named pair already established -- this module does not import anything from
 * `App.tsx` or the admission flow either. */
let datasetOpen = false;

/** The currently selected level for the NEXT candidate-arm session -- `null` (unset) until a
 * dev-gated `setResidencyTileSizeLevel` call succeeds. Never itself substitutes
 * `DEFAULT_TILE_GRID_LEVEL` for `null` -- see this module's own top doc comment for why. */
export function getResidencyTileSizeLevel(): TileGridLevel | null {
  return currentLevel;
}

/**
 * Selects the tile grid level for the NEXT dataset session's candidate-arm `TileViewportStreamManager`
 * construction. Refused (typed, not thrown) while a dataset is currently open -- a
 * `TileViewportStreamManager`'s own `level` is "fixed for this manager's whole lifetime"
 * (`tileViewportStreamManager.ts`'s own doc comment on its `level` option), so changing the selector
 * mid-session would leave an already-constructed manager silently inconsistent with the new value; a
 * caller must close the current dataset first -- exactly `setResidencyArm`'s own rationale, applied to
 * this knob. Succeeding while `level` already equals the current value is a no-op success (not itself
 * a refusal), mirroring `setResidencyArm`'s identical "same value while open" carve-out.
 */
export function setResidencyTileSizeLevel(level: TileGridLevel): SetResidencyTileSizeLevelResult {
  if (datasetOpen && level !== currentLevel) {
    return {
      ok: false,
      code: "dataset-open",
      message: `residencyTileSizeLevel cannot change from ${JSON.stringify(currentLevel)} to "${level}" while a dataset is open -- close it first`,
    };
  }
  currentLevel = level;
  return { ok: true };
}

/** Called once a dataset is admitted (`App.tsx`'s `[admitted]` effect start, dev-gated) -- the
 * `setResidencyTileSizeLevel` refusal's own basis. */
export function notifyResidencyTileSizeLevelDatasetOpened(): void {
  datasetOpen = true;
}

/** Called on that same dataset's close (the effect's own cleanup, dev-gated) -- symmetric with
 * `notifyResidencyTileSizeLevelDatasetOpened`. Idempotent: calling it while already closed is
 * harmless. */
export function notifyResidencyTileSizeLevelDatasetClosed(): void {
  datasetOpen = false;
}

/** Test-only: resets both the selected level and the open-flag to their initial values, mirroring
 * `residencyArm.ts`'s own `__resetResidencyArmForTests` -- this module's state is otherwise
 * module-scoped and would otherwise leak between test cases sharing the same module instance. */
export function __resetResidencyTileSizeLevelForTests(): void {
  currentLevel = null;
  datasetOpen = false;
}
