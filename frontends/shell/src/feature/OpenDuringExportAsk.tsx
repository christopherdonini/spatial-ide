// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ExportRunEnd } from "../publish/PublishPanel";
import type { ExecuteOutcome } from "../publish/types";

/**
 * Opening a dataset while an export runs (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md, Amendment 1 B3 and Amendment 7). App renders the ask
 * in `region.layers`, beneath AdmissionPanel (Amendment 8 item 2), never over the map (rule 11), and the late-cancel statement in the same place.
 *
 * The ask has two choices and no timer. Its explanatory line is a P6 placeholder; the two labels are the form's.
 */

/**
 * The late-cancel statement's words (Amendment 7 item 3), the human's approved wording (Amendment 8 item 1). It follows "Cancel the export and go on"
 * when the export's own outcome is a finished bundle, and is decided by that outcome and never by what `cancel()` answered. `cancel()` answers true
 * while the run is between the kernel's last cancel check and its return, a window shorter than one request round trip, and the words hold there too.
 * The e2e step for this statement drives the export through the dev-only hooks. No word says or implies that a finished export was undone or removed.
 */
export const LATE_CANCEL_FINISHED = "The export was not cancelled: it finished before the cancel could stop it. The bundle was written to:";
export const LATE_CANCEL_FINISHED_UNAUDITED =
  "The export was not cancelled: it finished before the cancel could stop it, but its outcome record could not be audited. The bundle was written to:";

export type FinishedOutcome = Extract<ExecuteOutcome, { status: "success" | "succeeded-unaudited" }>;

/**
 * Whether the statement is shown for a run (Amendment 7 item 2(c)): the choice was made for this run, it is an execute run, and its `ended` resolved to a
 * bundle on disk. A prepare run, a refused or unknown-attempt outcome and a run kept going show none. Nothing here reads what `cancel()` answered.
 */
export function lateCancelOutcome(cancelChosen: boolean, end: ExportRunEnd | null): FinishedOutcome | null {
  if (!cancelChosen || end === null || end.phase !== "execute") return null;
  const outcome = end.outcome;
  return outcome.status === "success" || outcome.status === "succeeded-unaudited" ? outcome : null;
}

export function OpenDuringExportAsk({ onKeep, onCancelAndGo }: { onKeep: () => void; onCancelAndGo: () => void }) {
  return (
    <div className="open-during-export-ask" role="group" aria-label="[P6 placeholder] Open while an export runs">
      <p className="open-during-export-text">
        [P6 placeholder] An export of the open dataset is still running. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and the
        export is asked to stop and the new dataset is opened; the open dataset is closed once the export has ended.
      </p>
      <div className="open-during-export-choices">
        <button type="button" className="open-during-export-keep" onClick={onKeep}>
          Keep exporting
        </button>
        <button type="button" className="open-during-export-cancel" onClick={onCancelAndGo}>
          Cancel the export and go on
        </button>
      </div>
    </div>
  );
}

/** The statement, with the outcome's own `bundle_path` whole on its own line, and for the unaudited outcome its `detail` line as the panel renders it. */
export function LateCancelStatement({ outcome }: { outcome: FinishedOutcome }) {
  const unaudited = outcome.status === "succeeded-unaudited";
  return (
    <div className="late-cancel-statement" role="status">
      <p className="late-cancel-text">{unaudited ? LATE_CANCEL_FINISHED_UNAUDITED : LATE_CANCEL_FINISHED}</p>
      <p className="late-cancel-path">{outcome.bundle_path}</p>
      {outcome.status === "succeeded-unaudited" && <p className="late-cancel-detail">{outcome.detail}</p>}
    </div>
  );
}
