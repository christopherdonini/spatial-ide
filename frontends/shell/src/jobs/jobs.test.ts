// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.4 and section 4 (J-U1, J-U2), as Amendments 2, 4 and 15 leave them: the pure part of
 * Jobs. `jobsFrom` lists the scan while FilterPanel's own predicate says a scan is in flight, and one job for each export run; the export Cancel's
 * latch shows Cancelling until the run ends, and a Cancel that did not reach a running export clears the latch and shows S-11. The scan predicate is
 * App's own `isScanInFlight`, handed over as `jobsFrom`'s third argument (`jobs.ts` cannot import `App.tsx`: `contributions.ts` imports `jobs.ts`).
 * Nothing here is mocked.
 */

import { describe, expect, it } from "vitest";

import { isScanInFlight } from "../App";
import type { ScanState } from "../App";
import { jobsFrom, requestExportCancel } from "./jobs";
import type { ExportCancelState, ExportJob } from "./jobs";

const HANDLE = "st_1";
const IN_FLIGHT: ScanState[] = [
  { kind: "issuing", streamHandle: HANDLE },
  { kind: "open-no-rows", streamHandle: HANDLE },
  { kind: "delivering", streamHandle: HANDLE, rows: 3 },
];
const NOT_IN_FLIGHT: ScanState[] = [
  { kind: "idle" },
  { kind: "complete", streamHandle: HANDLE },
  { kind: "cancelled", streamHandle: HANDLE, rows: 3 },
  { kind: "failed", streamHandle: HANDLE },
];
const run = (id: ExportJob["id"], cancel: () => Promise<boolean> = async () => true): ExportJob => ({ id, cancel });

describe("jobsFrom (J-U1)", () => {
  // RECORDED MUTATION for J-U1: in `jobsFrom` (jobs.ts) list the scan for the `complete` state too (`isScanInFlight(scanState) || scanState.kind === "complete"`).
  // Expected failure: the complete state gives a scan job. J-E1 is the real-app test of the same row; it is written and not run.
  it("J-U1: the three in-flight states give the scan job; idle, complete, cancelled and failed give none; one job for each run, in report order", () => {
    for (const state of IN_FLIGHT) expect(jobsFrom(state, [], isScanInFlight).map((job) => job.kind), state.kind).toEqual(["scan"]);
    for (const state of NOT_IN_FLIGHT) expect(jobsFrom(state, [], isScanInFlight), state.kind).toEqual([]);

    const jobs = jobsFrom(IN_FLIGHT[2], [run("export-1"), run("export-2")], isScanInFlight);
    expect(jobs.map((job) => (job.kind === "export" ? job.id : job.kind))).toEqual(["scan", "export-1", "export-2"]);
    const runs = jobsFrom(NOT_IN_FLIGHT[0], [run("export-2"), run("export-1")], isScanInFlight);
    expect(runs.map((job) => (job.kind === "export" ? job.id : job.kind))).toEqual(["export-2", "export-1"]);
    expect(jobsFrom(NOT_IN_FLIGHT[0], [], isScanInFlight)).toEqual([]);
  });

  it("J-U1: the scan is listed by the predicate it is given, exactly: the same answer as FilterPanel's for every state", () => {
    for (const state of [...IN_FLIGHT, ...NOT_IN_FLIGHT]) expect(jobsFrom(state, [], isScanInFlight).length === 1, state.kind).toBe(isScanInFlight(state));
    expect(jobsFrom(NOT_IN_FLIGHT[0], [], () => true).map((job) => job.kind)).toEqual(["scan"]);
  });
});

/** A latch held outside React: `apply` runs the update on it, as `setState` would. */
function latch(initial: ExportCancelState) {
  const held = { state: initial };
  return { held, apply: (update: (previous: ExportCancelState) => ExportCancelState) => void (held.state = update(held.state)) };
}

describe("the export Cancel's latch (J-U2)", () => {
  // RECORDED MUTATION for J-U2: in `requestExportCancel` (jobs.ts) do not clear the latch when `cancel()` answers false or rejects (drop the un-latch). Expected failure: the
  // latch stays at "cancelling" after a false answer and after a rejection. J-E2 is the real-app test of the same S-11; it is written and not run.
  it("J-U2: Cancel latches before it asks, asks once, and a true answer leaves it at Cancelling (the row leaves when the run ends)", async () => {
    const { held, apply } = latch("idle");
    let calls = 0;
    const pending = requestExportCancel(held.state, async () => (calls++, true), apply);
    expect(held.state, "latched before the answer").toBe("cancelling");
    await pending;
    expect(held.state).toBe("cancelling");
    expect(calls).toBe(1);

    await requestExportCancel(held.state, async () => (calls++, true), apply);
    expect(calls, "a press while latched asks nothing").toBe(1);
  });

  it("J-U2: a false answer clears the latch and shows S-11's state; so does a rejection", async () => {
    const answered = latch("idle");
    await requestExportCancel(answered.held.state, async () => false, answered.apply);
    expect(answered.held.state).toBe("not-cancelled");

    const rejected = latch("idle");
    await requestExportCancel(rejected.held.state, () => Promise.reject(new Error("the ipc failed")), rejected.apply);
    expect(rejected.held.state, "a rejection is the same un-latch, and is not left unhandled").toBe("not-cancelled");
  });

  it("J-U2: from the S-11 state a new press latches again", async () => {
    const { held, apply } = latch("not-cancelled");
    let calls = 0;
    const pending = requestExportCancel(held.state, async () => (calls++, true), apply);
    expect(held.state).toBe("cancelling");
    await pending;
    expect(calls).toBe(1);
  });
});
