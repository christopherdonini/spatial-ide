// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1B-RECORDING-PREREGISTRATION.md section 2.5: the queue between a committed change and the kernel's
 * `record_step`. A first-in, first-out queue with one call in flight, so steps reach the kernel in commit order
 * (two `spawn_blocking` tasks on the host can run out of order). The canvas never waits for it: `enqueue`
 * returns at once, and a step is sent after the change it records has been applied.
 *
 * Each step carries the value it sets, never a delta, so a step that is not kept loses only that intermediate
 * state. A step the queue cannot send, and a step the kernel does not confirm, are reported to the owner
 * (`App.tsx`), which shows `noticeText`; neither is silent. The history is the kernel's (ADR-036 section 9):
 * this file holds no history and replays nothing.
 */

import type { StepIntent } from "../skp/types";

/** The most steps waiting at once, the one in flight included (section 7). At this count a change is not sent. */
export const MAX_PENDING_STEP_RECORDS = 64;

/** What the owner is told about a step that was not recorded. */
export type StepRecordReport =
  | { kind: "not-confirmed"; dataset: string; intent: StepIntent; message: string }
  | { kind: "not-sent"; dataset: string; intent: StepIntent; waiting: number };

export interface StepQueueDeps {
  /** Sends one step: `skp/client.ts`'s `recordStep`. Anything it throws or rejects is a failure to confirm. */
  send: (dataset: string, intent: StepIntent) => Promise<unknown>;
  report: (report: StepRecordReport) => void;
}

export interface StepQueue {
  /** Queues one step, or reports it as not sent when `MAX_PENDING_STEP_RECORDS` steps are already waiting. */
  enqueue: (dataset: string, intent: StepIntent) => void;
}

/** The kernel's own message for a typed refusal, the error's message otherwise. */
function failureMessage(error: unknown): string {
  const skpError = (error as { skpError?: { message?: unknown } } | null)?.skpError;
  if (typeof skpError?.message === "string") return skpError.message;
  return error instanceof Error ? error.message : String(error);
}

export function createStepQueue(deps: StepQueueDeps): StepQueue {
  /** The step in flight is the head and stays in the list until its call has settled. */
  const waiting: { dataset: string; intent: StepIntent }[] = [];
  let draining = false;

  async function drain(): Promise<void> {
    draining = true;
    try {
      while (waiting.length > 0) {
        const { dataset, intent } = waiting[0]!;
        try {
          await deps.send(dataset, intent);
        } catch (error) {
          deps.report({ kind: "not-confirmed", dataset, intent, message: failureMessage(error) });
        } finally {
          waiting.shift();
        }
      }
    } finally {
      // A throwing `report` leaves the rest of the queue to the next `enqueue`, and reaches the global handler (ADR-010 rule 7).
      draining = false;
    }
  }

  return {
    enqueue(dataset, intent) {
      if (waiting.length >= MAX_PENDING_STEP_RECORDS) {
        deps.report({ kind: "not-sent", dataset, intent, waiting: waiting.length });
        return;
      }
      waiting.push({ dataset, intent });
      if (!draining) void drain();
    },
  };
}

/** The owner's sentences (section 2.10, O1 to O3): what the change did, then what the history did not do. */
export function noticeText(report: StepRecordReport): string {
  const applied = report.intent.action === "filter.apply" ? "Filter applied." : "Style change applied.";
  return report.kind === "not-confirmed"
    ? `${applied} The session history did not confirm keeping it: ${report.message}`
    : `${applied} It was not sent to the session history: ${report.waiting} earlier changes are still waiting there.`;
}
