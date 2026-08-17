import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import PublishDialog, {
  nextPublishDialogState,
  settleExecuteOutcome,
  submitPublishAttempt,
} from "./PublishDialog";
import type { PublishDialogState } from "./PublishDialog";
import type { ExecuteOutcome, PublishPromptData } from "./types";

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

const PROMPT: PublishPromptData = {
  operation: "publish-static-bundle",
  class: 3,
  reversibility: "irreversible",
  source_name: "parcels",
  source_content_hash: "sha256:abc",
  style_hash: "sha256:def",
  destination_display: "C:\\out\\my-bundle",
  grantor: "os-user chris",
  grant_remaining_s: 120,
  row_scope: "row scope: the whole file — every row the dataset contains",
  filter_scope: null,
  outcome_summary:
    'This will create a folder named "my-bundle" at C:\\out, containing the selected rows as one ' +
    "or more data partitions, the interactive viewer page, and a manifest.",
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
    // An arbitrary, almost-certainly-wrong phrase -- there is no expected value anywhere on this
    // call, or anywhere on `PublishPromptData` (`types.ts`), for a mismatch to be checked against,
    // and the outcome proves it: `execute` (standing in for the host) is reached with that exact
    // string, not short-circuited by any JS-side equality check.
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

describe("settleExecuteOutcome -- S2, this cut's own reviewer gate: the .then-with-no-.catch fix", () => {
  it("a resolved promise passes its ExecuteOutcome through unchanged", async () => {
    await expect(settleExecuteOutcome(Promise.resolve(SUCCESS))).resolves.toEqual(SUCCESS);
  });

  it("a REJECTED promise (an IPC failure, not a typed refusal) resolves to a refused ExecuteOutcome instead of rejecting -- this is what stops the dialog wedging in \"executing\" forever", async () => {
    const rejected = Promise.reject(new Error("invoke() failed: the webview lost its IPC channel"));
    const outcome = await settleExecuteOutcome(rejected);
    expect(outcome).toEqual({
      status: "refused",
      message: "invoke() failed: the webview lost its IPC channel",
    });
  });

  it("a rejection that is not an Error instance still resolves (never throws) -- String(e) covers it", async () => {
    // eslint-disable-next-line prefer-promise-reject-errors -- deliberately a non-Error rejection,
    // proving the `e instanceof Error` branch's own fallback.
    const rejected = Promise.reject("a bare string rejection");
    const outcome = await settleExecuteOutcome(rejected);
    expect(outcome).toEqual({ status: "refused", message: "a bare string rejection" });
  });
});

describe(
  "the rendered dialog -- ADR-017's Exposure review, 2026-08-17, condition 1 (G3: \"there's a lot " +
    'of things written but not necessarily that clear"). `renderToStaticMarkup`, not a DOM harness ' +
    "this package deliberately does not carry (App.test.ts's own top comment) -- a one-shot static " +
    "render is enough to prove text presence and order, needs no jsdom event loop, and adds no " +
    "dependency.",
  () => {
    // `renderToStaticMarkup` HTML-escapes text content (`"` -> `&quot;`, ...) -- decoded back before
    // comparison so this test asserts on the same characters an operator actually reads, not on
    // React's own escaping of them.
    function renderedHtml(): string {
      const raw = renderToStaticMarkup(
        createElement(PublishDialog, {
          attemptId: "att_1",
          prompt: PROMPT,
          execute: vi.fn(),
          cancelExecution: vi.fn(),
          onSettled: vi.fn(),
        })
      );
      return raw.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
    }

    it("renders the host-composed outcome_summary sentence, verbatim", () => {
      expect(renderedHtml()).toContain(PROMPT.outcome_summary);
    });

    it("renders it BEFORE the provenance field list -- prominent, not buried (the binding rule: " +
      '"top of the dialog body, before the provenance fields")', () => {
      const html = renderedHtml();
      const summaryAt = html.indexOf(PROMPT.outcome_summary);
      // `Source` is the FIRST provenance field `PublishDialog.tsx` renders (`<dt>Source</dt>`) --
      // the correct anchor for "before every provenance field", not merely "before some field".
      const sourceFieldAt = html.indexOf("Source</dt>");
      expect(summaryAt).toBeGreaterThan(-1);
      expect(sourceFieldAt).toBeGreaterThan(-1);
      expect(summaryAt).toBeLessThan(sourceFieldAt);
    });

    it("ADDS clarity, replaces nothing -- every existing field is still rendered in full", () => {
      const html = renderedHtml();
      for (const value of [
        PROMPT.source_name,
        PROMPT.source_content_hash,
        PROMPT.style_hash,
        PROMPT.destination_display,
        PROMPT.row_scope,
      ]) {
        expect(html).toContain(value);
      }
      expect(html).toContain("This cannot be undone");
    });
  }
);
