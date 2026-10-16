// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { StepIntent } from "../skp/types";
import { createStepQueue, MAX_PENDING_STEP_RECORDS, noticeText } from "./stepRecorder";
import type { StepRecordReport } from "./stepRecorder";

/** B2-1B-RECORDING-PREREGISTRATION.md section 4, R1 and R2. A `send` whose calls stay pending until the test settles them. */
function pendingSends() {
  const sent: StepIntent[] = [];
  const settle: Array<() => void> = [];
  const reports: StepRecordReport[] = [];
  const queue = createStepQueue({
    send: (_dataset, intent) => {
      sent.push(intent);
      return new Promise<void>((resolve) => settle.push(resolve));
    },
    report: (report) => reports.push(report),
  });
  return { sent, settle, reports, queue };
}

const opacity = (value: number): StepIntent => ({ action: "style.set", params: { property: "fillOpacity", value } });
const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("the step queue (B2 piece 1b, section 2.5)", () => {
  // RECORDED MUTATION for "R1": in `drain` (stepRecorder.ts) do not await `deps.send(...)`. Expected failure: two steps are
  // sent before the first has settled.
  it("R1: sends one record at a time, in commit order", async () => {
    const { sent, settle, queue } = pendingSends();
    for (const value of [0.1, 0.2, 0.3]) queue.enqueue("ds_x", opacity(value));
    await flush();
    expect(sent, "only the first is in flight").toEqual([opacity(0.1)]);

    settle[0]!();
    await flush();
    expect(sent, "the second goes when the first has settled").toEqual([opacity(0.1), opacity(0.2)]);

    settle[1]!();
    await flush();
    settle[2]!();
    await flush();
    expect(sent, "in the order they were committed").toEqual([opacity(0.1), opacity(0.2), opacity(0.3)]);
  });

  // RECORDED MUTATION for "R2": remove the `MAX_PENDING_STEP_RECORDS` check in `enqueue`. Expected failure: the step past the
  // bound is queued, so nothing is reported.
  it("R2: at its bound, sends nothing and reports the change as not sent", async () => {
    const { sent, reports, queue } = pendingSends();
    for (let i = 0; i < MAX_PENDING_STEP_RECORDS; i++) queue.enqueue("ds_x", opacity(i / 100));
    await flush();
    expect(reports, "nothing is reported below the bound").toEqual([]);

    queue.enqueue("ds_x", { action: "filter.apply", params: { filter: null } });
    await flush();
    expect(sent, "the step past the bound is not sent, and only the first is in flight").toHaveLength(1);
    expect(reports).toHaveLength(1);
    const report = reports[0]!;
    expect(report).toMatchObject({ kind: "not-sent", dataset: "ds_x", waiting: MAX_PENDING_STEP_RECORDS });
    expect(noticeText(report)).toBe("Filter applied. It was not sent to the session history: 64 earlier changes are still waiting to be sent.");
  });
});
