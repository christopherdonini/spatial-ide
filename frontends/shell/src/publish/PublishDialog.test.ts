import { describe, expect, it, vi } from "vitest";

import { nextPublishDialogState, submitPublishAttempt } from "./PublishDialog";
import type { PublishDialogState } from "./PublishDialog";
import type { ExecuteOutcome } from "./types";

const CONFIRMING = (phrase: string): PublishDialogState => ({ kind: "confirming", phrase });
const EXECUTING = (cancelRequested = false): PublishDialogState => ({ kind: "executing", cancelRequested });
const CLOSED: PublishDialogState = { kind: "closed" };

const SUCCESS: ExecuteOutcome = {
  status: "success",
  bundle_path: "C:\\out\\bundle",
  rows: 10,
  partitions: 1,
  total_bytes: 100,
  manifest_bytes: 10,
  style_hash: "h",
  operation_digest: "d",
  build_millis: 1,
};

describe("nextPublishDialogState -- the approval surface's own lifecycle (NEXT-CUT.md P2)", () => {
  it("open -> submit -> executing, on a non-empty phrase", () => {
    const next = nextPublishDialogState(CONFIRMING("bundle.skpb"), { kind: "submit" });
    expect(next).toEqual(EXECUTING(false));
  });

  it("empty-field: submit on an empty phrase is inert -- stays confirming, unchanged", () => {
    const state = CONFIRMING("");
    const next = nextPublishDialogState(state, { kind: "submit" });
    expect(next).toBe(state);
  });

  it("second submit impossible: submit while already executing is a no-op", () => {
    const state = EXECUTING(false);
    const next = nextPublishDialogState(state, { kind: "submit" });
    expect(next).toBe(state);
  });

  it("closed on any outcome: settled from executing always closes, regardless of what the caller's outcome was", () => {
    // The reducer itself carries no outcome payload (PublishPanel is what branches on the real
    // ExecuteOutcome) -- this only proves the STATE MACHINE closes unconditionally on settlement.
    expect(nextPublishDialogState(EXECUTING(false), { kind: "settled" })).toEqual(CLOSED);
    expect(nextPublishDialogState(EXECUTING(true), { kind: "settled" })).toEqual(CLOSED);
  });

  it("settled is a no-op outside executing (nothing to close)", () => {
    const state = CONFIRMING("x");
    expect(nextPublishDialogState(state, { kind: "settled" })).toBe(state);
    expect(nextPublishDialogState(CLOSED, { kind: "settled" })).toBe(CLOSED);
  });

  it("cancel abandons: confirming -> closed", () => {
    expect(nextPublishDialogState(CONFIRMING("partial"), { kind: "cancel" })).toEqual(CLOSED);
  });

  it("cancel is a no-op once executing -- that state has its own cancelExecution event instead", () => {
    const state = EXECUTING(false);
    expect(nextPublishDialogState(state, { kind: "cancel" })).toBe(state);
  });

  it("cancelExecution only marks the request while executing; a no-op elsewhere", () => {
    expect(nextPublishDialogState(EXECUTING(false), { kind: "cancelExecution" })).toEqual(EXECUTING(true));
    const confirming = CONFIRMING("x");
    expect(nextPublishDialogState(confirming, { kind: "cancelExecution" })).toBe(confirming);
  });

  it("phraseChanged only applies while confirming", () => {
    expect(nextPublishDialogState(CONFIRMING(""), { kind: "phraseChanged", value: "abc" })).toEqual(
      CONFIRMING("abc")
    );
    const executing = EXECUTING(false);
    expect(nextPublishDialogState(executing, { kind: "phraseChanged", value: "abc" })).toBe(executing);
  });
});

describe("submitPublishAttempt -- the no-JS-comparison proof (NEXT-CUT.md, binding)", () => {
  it("sends the typed phrase to the host VERBATIM, with no gate -- proven structurally: this " +
    "function's own signature never receives a confirmation phrase to compare against", async () => {
    const execute = vi.fn().mockResolvedValue(SUCCESS);
    // A phrase that does NOT match whatever a real `prompt.confirmation_phrase` might have been --
    // there is nothing in this call for such a mismatch to be checked against, and the outcome
    // proves it: `execute` (standing in for the host) is reached with that exact string, not
    // short-circuited by any JS-side equality check.
    const outcome = await submitPublishAttempt("att_1", "totally-wrong-phrase", { execute });

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith("att_1", "totally-wrong-phrase");
    expect(outcome).toBe(SUCCESS);
  });

  it("an empty phrase is ALSO sent through unconditionally by this function -- the empty-field " +
    "guard lives in the reducer/handler that decides whether to call this at all, never here", async () => {
    const execute = vi.fn().mockResolvedValue({ status: "refused", message: "empty phrase" });
    await submitPublishAttempt("att_2", "", { execute });
    expect(execute).toHaveBeenCalledWith("att_2", "");
  });
});
