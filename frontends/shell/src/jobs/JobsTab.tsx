// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The Jobs tab (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.4): one row for the map's feature scan while one is in flight, and one for each export run. S-7 shows when
 * nothing is listed. A row shows its words (S-8, S-9) and one Cancel and nothing that is counted or timed: the scan row adds the owner's liveness text when there is one, as the owner
 * made it. The scan's Cancel is the handler App gives, the same function FilterPanel's Cancel calls; an export row's Cancel is the run's own, latched by `requestExportCancel`.
 */

import { useState } from "react";
import type { ExportCancelState, Job } from "./jobs";
import { EXPORT_JOB_TEXT, NO_JOBS_TEXT, NOT_CANCELLED_TEXT, requestExportCancel, SCAN_JOB_TEXT } from "./jobs";

function ExportRow({ cancel }: { cancel: () => Promise<boolean> }) {
  const [state, setState] = useState<ExportCancelState>("idle");
  const cancelling = state === "cancelling";
  return (
    <div className="jobs-row jobs-row-export">
      <span className="jobs-row-label">{EXPORT_JOB_TEXT}</span>
      <button type="button" className="jobs-cancel" disabled={cancelling} onClick={() => void requestExportCancel(state, cancel, setState)}>
        {cancelling ? "Cancelling" : "Cancel"}
      </button>
      {state === "not-cancelled" && <p className="jobs-not-cancelled">{NOT_CANCELLED_TEXT}</p>}
    </div>
  );
}

export default function JobsTab({ jobs, scanLiveness, onCancelScan }: { jobs: readonly Job[]; scanLiveness: string | null; onCancelScan: () => void }) {
  return (
    <div className="jobs-tab">
      {jobs.length === 0 && <p className="jobs-empty">{NO_JOBS_TEXT}</p>}
      {jobs.map((job) =>
        job.kind === "scan" ? (
          <div key="scan" className="jobs-row jobs-row-scan">
            <span className="jobs-row-label">{SCAN_JOB_TEXT}</span>
            {scanLiveness !== null && <span className="jobs-row-liveness">{scanLiveness}</span>}
            <button type="button" className="jobs-cancel" onClick={onCancelScan}>
              Cancel
            </button>
          </div>
        ) : (
          <ExportRow key={job.id} cancel={job.cancel} />
        )
      )}
    </div>
  );
}
