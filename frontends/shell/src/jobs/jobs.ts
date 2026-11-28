// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The Jobs tab's pure part (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.4 and its Amendments 2, 4 and 15): which jobs stand, and the export row's Cancel latch.
 *
 * **A job is what the shell already holds, mirrored and never owned.** The scan is `ScanState`'s in-flight kinds, and an export is a run `handleExportRunning` (App.tsx) reports.
 * No job has an identity of its own beyond those two sources, no progress is computed, and no figure is made here: the only figures a row can show are the owner's own liveness
 * text (`scanLivenessText`, App.tsx), which the tab prints as the owner made it.
 *
 * **The scan predicate is handed in.** `jobsFrom`'s third parameter is App's own `isScanInFlight`, so a scan is listed exactly while FilterPanel's Cancel is. It is a parameter and
 * not an import because `contributions.ts` imports this module for `JOBS_LABEL` and `App.tsx` reaches `contributions.ts` through `StudioLayout.tsx`: a value import of `App.tsx` from here would make a cycle
 * in which, when this module loads first, `contributions.ts` reads `JOBS_LABEL` before this module defines it.
 *
 * The words below are the advisor's (ADV-2026-11-23-30 S-2, S-7, S-8, S-9, S-11), each written into this file by script from the filed ruling and checked by bytes.
 */

import type { ScanState } from "../App";
import type { ExportConsumerId } from "../workspace/workspaceState";

/** S-2: the Jobs tab's label. */
export const JOBS_LABEL = "Jobs";
/** S-7: shown when no job is listed. */
export const NO_JOBS_TEXT = "No map loading or export is running.";
/** S-8: the scan row. */
export const SCAN_JOB_TEXT = "Loading the map's features";
/** S-9: an export row. */
export const EXPORT_JOB_TEXT = "Export interactive map";
/** S-11: shown on an export row after a Cancel that did not reach a running export. */
export const NOT_CANCELLED_TEXT = "Nothing was cancelled.";

/** One export run as the tab sees it: its consumer id (the key of its row) and the run's own cancel (`ExportRunReport.cancel`, through App's run). */
export interface ExportJob {
  readonly id: ExportConsumerId;
  readonly cancel: () => Promise<boolean>;
}

export type Job = { readonly kind: "scan" } | ({ readonly kind: "export" } & ExportJob);

/** The scan first, while `isInFlight` says one is, then one job for each export run in the order given (the order the runs were reported in). */
export function jobsFrom(scanState: ScanState, exportJobs: readonly ExportJob[], isInFlight: (state: ScanState) => boolean): readonly Job[] {
  const scan: Job[] = isInFlight(scanState) ? [{ kind: "scan" }] : [];
  return [...scan, ...exportJobs.map((job): Job => ({ kind: "export", id: job.id, cancel: job.cancel }))];
}

/** idle: Cancel is offered; cancelling: asked and the run stands; not-cancelled: the last Cancel reached no running export. */
export type ExportCancelState = "idle" | "cancelling" | "not-cancelled";

/**
 * One press of an export row's Cancel. It latches before it asks, so a second press while the first is out asks nothing (the pattern of PublishPanel's `requestPrepareCancel`).
 * A `true` answer means only that a token was found, so the latch stays until the run ends and the row goes. A `false` answer, or a rejection, clears the latch and shows S-11,
 * and the next press asks again. The un-latch applies only to the latch it made: a state that has moved on is left as it is.
 */
export async function requestExportCancel(
  state: ExportCancelState,
  cancel: () => Promise<boolean>,
  applyState: (update: (previous: ExportCancelState) => ExportCancelState) => void
): Promise<void> {
  if (state === "cancelling") return;
  applyState(() => "cancelling");
  let reached = false;
  try {
    reached = await cancel();
  } catch {
    reached = false;
  }
  if (!reached) applyState((previous) => (previous === "cancelling" ? "not-cancelled" : previous));
}
