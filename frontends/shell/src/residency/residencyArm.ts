// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Viewport-residency cut P3: the arm switch, "the piece's structural rule" (NEXT-CUT.md P3's own
 * task text). ALL candidate-arm behaviour (tile grid, tile-keyed planning, tile-keyed residency,
 * distance-ordered eviction) is gated behind `getResidencyArm() === "candidate"`; the default and
 * only value the full vitest/E2E regression suites ever observe is `"baseline"`, so this module's
 * own state never diverges from that default in any run that never calls `setResidencyArm`.
 *
 * **The SWITCH stays dev-gated at the one registration site -- the DEFAULT does not.** This module
 * has no `import.meta.env.DEV` guard of its own -- `setResidencyArm`/`getResidencyArm`'s own
 * `__SPATIAL_E2E__` hook registrations in `App.tsx` are what is DEV-gated (`isInstrumentedBuild()`),
 * the same pattern `instrument/residencyInstrument.ts`'s own top doc comment documents for its own
 * singleton wiring. Kept this way (rather than gating inside `setResidencyArm`/`getResidencyArm`
 * themselves) so this module stays plain, synchronous, and trivially unit-testable with no
 * `import.meta.env` mocking at all -- unchanged by the flip below, which touches only the constant's
 * own value, never this module's gating shape.
 *
 * **The default flipped to `"candidate"` on the human's ruling, RELEASE-0.1 item 7 (2026-09-07,
 * DECISIONS-PENDING entry 52 = (a)).** ADR-028 (Accepted 2026-09-02) is the decision this applies,
 * not a new one -- this module makes no design choice of its own, it only carries the value the
 * ruling named. `App.tsx`'s own candidate-session construction site (`[admitted]` effect) no longer
 * gates on `isInstrumentedBuild()` at all -- a production build now constructs a candidate-arm
 * session by default, same as any other build. `DEFAULT_RESIDENCY_ARM` is `"candidate"`; a caller's
 * own explicit `setResidencyArm("baseline")` call (dev-gated at the one registration site above)
 * remains the only way to select ADR-011 gate 8's recorded baseline interim for a session -- baseline
 * is not retired, only no longer the default a plain `tauri build` ships.
 */

export type ResidencyArm = "baseline" | "candidate";

export const DEFAULT_RESIDENCY_ARM: ResidencyArm = "candidate";

export type SetResidencyArmResult =
  | { ok: true }
  /** A typed refusal, never a thrown exception -- mirrors `RequestOutcome`/`ApplyFilterOutcome`'s
   * own discipline elsewhere in this shell (report, don't throw, for an expected-shape refusal). */
  | { ok: false; code: "dataset-open"; message: string };

let currentArm: ResidencyArm = DEFAULT_RESIDENCY_ARM;
/** True between a dataset's own admission and its close -- tracked here via explicit
 * `notifyResidencyArmDatasetOpened`/`notifyResidencyArmDatasetClosed` calls (App.tsx's `[admitted]`
 * effect, dev-gated) rather than this module importing anything from `App.tsx` or the admission
 * flow itself, keeping this module's own dependency graph free of any of that machinery. */
let datasetOpen = false;

/** The current arm -- `"baseline"` until a dev-gated `setResidencyArm("candidate")` call succeeds. */
export function getResidencyArm(): ResidencyArm {
  return currentArm;
}

/**
 * Selects the arm for the NEXT dataset session. Refused (typed, not thrown) while a dataset is
 * currently open -- switching arms mid-session would leave whatever candidate machinery a session
 * already constructed (or didn't) silently inconsistent with the new value; a caller must close the
 * current dataset first. Succeeding while `arm` already equals the current value is a no-op success
 * (not itself a refusal -- setting to the same value is not "changing arms mid-session" in any sense
 * that matters).
 */
export function setResidencyArm(arm: ResidencyArm): SetResidencyArmResult {
  if (datasetOpen && arm !== currentArm) {
    return {
      ok: false,
      code: "dataset-open",
      message: `residencyArm cannot change from "${currentArm}" to "${arm}" while a dataset is open -- close it first`,
    };
  }
  currentArm = arm;
  return { ok: true };
}

/** Called once a dataset is admitted (App.tsx's `[admitted]` effect start, dev-gated) -- the
 * `setResidencyArm` refusal's own basis. */
export function notifyResidencyArmDatasetOpened(): void {
  datasetOpen = true;
}

/** Called on that same dataset's close (the effect's own cleanup, dev-gated) -- symmetric with
 * `notifyResidencyArmDatasetOpened`. Idempotent: calling it while already closed is harmless. */
export function notifyResidencyArmDatasetClosed(): void {
  datasetOpen = false;
}

/** Test-only: resets both the arm and the open-flag to their initial values, mirroring
 * `dataPlaneClient.ts`'s own `__resetForTests` pattern -- this module's state is otherwise
 * module-scoped and would otherwise leak between test cases sharing the same module instance. */
export function __resetResidencyArmForTests(): void {
  currentArm = DEFAULT_RESIDENCY_ARM;
  datasetOpen = false;
}
