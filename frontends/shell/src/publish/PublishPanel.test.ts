// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { encodeHexF64 } from "../skp/codec";
import type { Bbox } from "../skp/types";
import { PREPARE_CANCEL_KEY_PREFIX, prepareCancelKey } from "./client";
import type { DialogSettleResult } from "./PublishDialog";
import {
  cancelControlVisible,
  currentViewOptionDisabled,
  formatBytesHashed,
  nextStateFromDialogSettled,
  nextStateFromPrepareOutcome,
  PublishControls,
  requestPrepareCancel,
  resolvePublishScope,
  settlePrepareOutcome,
  stateAfterCancelRejected,
  stateAfterCancelRequested,
  stateAfterPinProgress,
} from "./PublishPanel";
import type { PublishControlsProps, PublishPanelState } from "./PublishPanel";
import { FILTER_SCOPE_SENTENCE } from "./types";
import type { ExecuteOutcome, PrepareOutcome, PublishPromptData } from "./types";

const HERE = dirname(fileURLToPath(import.meta.url));

function wireBbox(xmin: number, ymin: number, xmax: number, ymax: number): Bbox {
  return { xmin: encodeHexF64(xmin), ymin: encodeHexF64(ymin), xmax: encodeHexF64(xmax), ymax: encodeHexF64(ymax) };
}

const PROMPT: PublishPromptData = {
  operation: "publish",
  class: 3,
  reversibility: "irreversible",
  source_name: "parcels",
  source_content_hash: "sha256:abc",
  style_hash: "sha256:def",
  destination_display: "C:\\out\\bundle",
  grantor: "os-user chris",
  grant_remaining_s: 120,
  row_scope: "row scope: the whole file",
  filter_scope: null,
  outcome_summary:
    'This will create a folder named "bundle" at C:\\out, containing the selected rows as one or ' +
    "more data partitions, the interactive viewer page, and a manifest.",
};

describe("currentViewOptionDisabled (NEXT-CUT.md P3 item 3)", () => {
  it("disabled while no settled view has arrived", () => {
    expect(currentViewOptionDisabled(false)).toBe(true);
  });
  it("enabled once one has", () => {
    expect(currentViewOptionDisabled(true)).toBe(false);
  });
});

describe("resolvePublishScope", () => {
  it("'whole' always yields whole-file, regardless of bbox", () => {
    expect(resolvePublishScope("whole", null)).toEqual({ kind: "whole-file" });
    expect(resolvePublishScope("whole", wireBbox(1, 2, 3, 4))).toEqual({ kind: "whole-file" });
  });

  it("'current' with no settled view (bbox null) yields null -- the disabled option's own boundary case", () => {
    expect(resolvePublishScope("current", null)).toBeNull();
  });

  it("'current' decodes the SKP-wire (HexF64) bbox back to plain f64 -- binding-local, not SKP", () => {
    const result = resolvePublishScope("current", wireBbox(2683000.5, 1248000.25, 2684000.5, 1249000.25));
    expect(result).toEqual({
      kind: "viewport-bbox",
      bbox: { xmin: 2683000.5, ymin: 1248000.25, xmax: 2684000.5, ymax: 1249000.25 },
    });
  });
});

describe("nextStateFromPrepareOutcome", () => {
  it("prompt -> the dialog state, carrying attempt_id and the prompt verbatim", () => {
    const outcome: PrepareOutcome = { status: "prompt", attempt_id: "att_1", prompt: PROMPT };
    expect(nextStateFromPrepareOutcome(outcome)).toEqual({ kind: "dialog", attemptId: "att_1", prompt: PROMPT });
  });

  it("picker-cancelled -> silent return to idle, never a refusal (NEXT-CUT.md P3 item 4)", () => {
    const outcome: PrepareOutcome = { status: "picker-cancelled" };
    expect(nextStateFromPrepareOutcome(outcome)).toEqual({ kind: "idle" });
  });

  it("refused -> a formatted refusal carrying the host's message verbatim", () => {
    const outcome: PrepareOutcome = { status: "refused", message: "row filter not recordable" };
    const next = nextStateFromPrepareOutcome(outcome);
    expect(next.kind).toBe("refused");
    if (next.kind === "refused") {
      expect(next.refusal.message).toBe("row filter not recordable");
    }
  });

  // RELEASE-0.1 item 10 (DECISIONS-PENDING entry 7's ruled pre-fix): the pin phase's own
  // cancellation outcome, shown rather than silently absorbed -- distinct from `picker-cancelled`
  // (a native-dialog dismissal with nothing to report).
  it("cancelled -> a distinct, visible 'cancelled' state, never folded into idle or a refusal", () => {
    const outcome: PrepareOutcome = { status: "cancelled" };
    expect(nextStateFromPrepareOutcome(outcome)).toEqual({ kind: "cancelled" });
  });
});

describe("nextStateFromDialogSettled", () => {
  const SUCCESS: ExecuteOutcome = {
    status: "success",
    bundle_path: "C:\\out\\bundle",
    rows: 42,
    partitions: 2,
    total_bytes: 1000,
    manifest_bytes: 50,
    style_hash: "h",
    operation_digest: "d",
    build_millis: 12.5,
  };

  it("abandoned -> idle", () => {
    const result: DialogSettleResult = { kind: "abandoned" };
    expect(nextStateFromDialogSettled(result)).toEqual({ kind: "idle" });
  });

  it("executed/success -> succeeded, carrying the outcome", () => {
    const result: DialogSettleResult = { kind: "executed", outcome: SUCCESS };
    expect(nextStateFromDialogSettled(result)).toEqual({ kind: "succeeded", outcome: SUCCESS });
  });

  it("executed/succeeded-unaudited -> succeeded too (a real bundle, reported distinctly by the UI's own render, not by which panel state it lands in)", () => {
    const outcome: ExecuteOutcome = { status: "succeeded-unaudited", bundle_path: "C:\\out\\bundle", detail: "disk full" };
    const result: DialogSettleResult = { kind: "executed", outcome };
    expect(nextStateFromDialogSettled(result)).toEqual({ kind: "succeeded", outcome });
  });

  it("executed/refused -> a formatted refusal", () => {
    const outcome: ExecuteOutcome = { status: "refused", message: "typed phrase did not match" };
    const next = nextStateFromDialogSettled({ kind: "executed", outcome });
    expect(next.kind).toBe("refused");
    if (next.kind === "refused") expect(next.refusal.message).toBe("typed phrase did not match");
  });

  it("executed/unknown-attempt -> a refusal explaining nothing was authorized or denied", () => {
    const outcome: ExecuteOutcome = { status: "unknown-attempt" };
    const next = nextStateFromDialogSettled({ kind: "executed", outcome });
    expect(next.kind).toBe("refused");
    if (next.kind === "refused") {
      expect(next.refusal.message).toMatch(/no longer known to the host/);
    }
  });
});

describe("settlePrepareOutcome -- S2, this cut's own reviewer gate: the un-caught-await fix", () => {
  it("a resolved promise passes its PrepareOutcome through unchanged", async () => {
    const outcome: PrepareOutcome = { status: "prompt", attempt_id: "att_1", prompt: PROMPT };
    await expect(settlePrepareOutcome(Promise.resolve(outcome))).resolves.toEqual(outcome);
  });

  it("a REJECTED promise (an IPC failure, not a typed refusal) resolves to a refused PrepareOutcome instead of rejecting", async () => {
    const rejected = Promise.reject(new Error("invoke() failed: the webview lost its IPC channel"));
    const outcome = await settlePrepareOutcome(rejected);
    expect(outcome).toEqual({
      status: "refused",
      message: "invoke() failed: the webview lost its IPC channel",
    });
  });

  it("a rejection that is not an Error instance still resolves (never throws) -- String(e) covers it", async () => {
    // eslint-disable-next-line prefer-promise-reject-errors -- deliberately a non-Error rejection,
    // proving the `e instanceof Error` branch's own fallback.
    const rejected = Promise.reject("a bare string rejection");
    const outcome = await settlePrepareOutcome(rejected);
    expect(outcome).toEqual({ status: "refused", message: "a bare string rejection" });
  });
});

describe("FILTER_SCOPE_SENTENCE -- pinned against publish.rs's own copy", () => {
  it("matches frontends/shell/src-tauri/src/publish.rs::FILTER_SCOPE_SENTENCE exactly, Rust line-continuation collapsed", () => {
    const rustSource = readFileSync(join(HERE, "../../src-tauri/src/publish.rs"), "utf8");
    const match = rustSource.match(/FILTER_SCOPE_SENTENCE: &str = "([\s\S]*?)";/);
    expect(match).not.toBeNull();
    // Rust string-literal line continuation: a trailing `\` followed by a newline and the next
    // line's leading whitespace collapses to nothing (no inserted space) -- the ONE escape this
    // particular literal uses, so this is not a general Rust string parser, just enough to prove
    // the two copies are the same text.
    const collapsed = (match as RegExpMatchArray)[1].replace(/\\\r?\n[ \t]*/g, "");
    expect(collapsed).toBe(FILTER_SCOPE_SENTENCE);
  });
});

// -----------------------------------------------------------------------------------------------
// MF1 (this batch's reviewer gate): a Cancel offered during the native-picker window, where no
// `CancelToken` is registered yet, could not cancel anything -- and latched the button at
// "Cancelling" for the rest of an uncancelled pin. The criterion is now "the first pin-phase
// progress event has arrived" (`cancelControlVisible`).
// -----------------------------------------------------------------------------------------------

const PREPARING_BEFORE_ANY_EVENT: PublishPanelState = {
  kind: "preparing",
  phase: null,
  bytesDone: null,
  bytesTotal: null,
  cancelRequested: false,
};

describe("cancelControlVisible -- MF1's own criterion", () => {
  it("false during the picker window: still preparing, no phase event yet, so no token is proven registered", () => {
    expect(cancelControlVisible(PREPARING_BEFORE_ANY_EVENT)).toBe(false);
  });

  it("true once the pin phase has actually reported -- the event is emitted from inside the call the token was registered before", () => {
    const withPhase = stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 1048576, 5004376705);
    expect(cancelControlVisible(withPhase)).toBe(true);
  });

  it("false in every settled state -- there is nothing running to cancel", () => {
    expect(cancelControlVisible({ kind: "idle" })).toBe(false);
    expect(cancelControlVisible({ kind: "cancelled" })).toBe(false);
  });
});

describe("stateAfterPinProgress", () => {
  it("folds phase and bytes in, leaving cancelRequested alone", () => {
    expect(stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 10, 100)).toEqual({
      kind: "preparing",
      phase: "pinning-source",
      bytesDone: 10,
      bytesTotal: 100,
      cancelRequested: false,
    });
  });

  it("a late event after the phase settled is a silent no-op, never a resurrection of 'preparing'", () => {
    const settled: PublishPanelState = { kind: "cancelled" };
    expect(stateAfterPinProgress(settled, "pinning-source", 10, 100)).toEqual(settled);
  });

  it("an event carrying no byte counts keeps whatever counts were last reported", () => {
    const withBytes = stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 10, 100);
    expect(stateAfterPinProgress(withBytes, "pinning-source")).toEqual({ ...withBytes });
  });
});

describe("requestPrepareCancel -- MF1: what a Cancel click may and may not do", () => {
  /** Applies the reducer updates the function pushes, so the assertions read the SAME state a
   * React `setState` would have produced -- not a list of un-applied updater functions. */
  function stateBox(initial: PublishPanelState) {
    let current = initial;
    return {
      apply: (update: (prev: PublishPanelState) => PublishPanelState) => {
        current = update(current);
      },
      get: () => current,
    };
  }

  it("a cancel request BEFORE the first phase event does not latch and never calls the host", async () => {
    const box = stateBox(PREPARING_BEFORE_ANY_EVENT);
    const cancel = vi.fn().mockResolvedValue(false);
    await requestPrepareCancel(box.get(), "ds_abc123", box.apply, cancel);
    expect(cancel).not.toHaveBeenCalled();
    expect(box.get()).toEqual(PREPARING_BEFORE_ANY_EVENT);
  });

  it("AFTER the first phase event: publishCancel is called with the prepare key, and the button latches", async () => {
    const running = stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 1048576, 5004376705);
    const box = stateBox(running);
    const cancel = vi.fn().mockResolvedValue(true);
    await requestPrepareCancel(box.get(), "ds_abc123", box.apply, cancel);
    expect(cancel).toHaveBeenCalledWith(prepareCancelKey("ds_abc123"));
    expect(box.get()).toEqual({ ...running, cancelRequested: true });
  });

  it("a host answer of `false` (nothing found under the key) un-latches -- the pin is still running, so Cancel must stay clickable", async () => {
    const running = stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 1048576, 5004376705);
    const box = stateBox(running);
    const cancel = vi.fn().mockResolvedValue(false);
    await requestPrepareCancel(box.get(), "ds_abc123", box.apply, cancel);
    expect(cancel).toHaveBeenCalledWith(prepareCancelKey("ds_abc123"));
    expect(box.get()).toEqual({ ...running, cancelRequested: false });
  });
});

describe("stateAfterCancelRequested / stateAfterCancelRejected", () => {
  it("requested latches only where a token is proven registered", () => {
    expect(stateAfterCancelRequested(PREPARING_BEFORE_ANY_EVENT)).toEqual(PREPARING_BEFORE_ANY_EVENT);
    const running = stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 1, 2);
    expect(stateAfterCancelRequested(running)).toEqual({ ...running, cancelRequested: true });
  });

  it("rejected clears the latch while preparing, and leaves any settled state untouched", () => {
    const latched = stateAfterCancelRequested(stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 1, 2));
    expect(stateAfterCancelRejected(latched)).toMatchObject({ cancelRequested: false });
    expect(stateAfterCancelRejected({ kind: "cancelled" })).toEqual({ kind: "cancelled" });
  });
});

describe("formatBytesHashed -- a count of bytes read, never a rate, percentage or ETA (ADR-018)", () => {
  it("groups digits and names what was counted", () => {
    expect(formatBytesHashed(1048576, 5004376705)).toBe("1,048,576 / 5,004,376,705 bytes hashed");
  });

  it("a null done (an event carrying only a total) reads as zero", () => {
    expect(formatBytesHashed(null, 1000)).toBe("0 / 1,000 bytes hashed");
  });
});

// -----------------------------------------------------------------------------------------------
// MF3: the render surface itself. `renderToStaticMarkup` over `PublishControls` -- the panel's own
// disclosure body, one component down -- the identical in-house route `PublishDialog.test.ts:150-171`
// established (no DOM harness, no new dependency).
// -----------------------------------------------------------------------------------------------

describe("the rendered publish controls (MF3)", () => {
  function render(state: PublishPanelState, overrides: Partial<PublishControlsProps> = {}): string {
    const raw = renderToStaticMarkup(
      createElement(PublishControls, {
        state,
        scope: "whole",
        hasSettledView: true,
        filterActive: false,
        onScopeChange: vi.fn(),
        onPublishClick: vi.fn(),
        onCancelPreparing: vi.fn(),
        onDialogSettled: vi.fn(),
        ...overrides,
      })
    );
    return raw.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&amp;", "&").replaceAll("&#x2F;", "/");
  }

  it("preparing, before any phase event: the placeholder label, no byte readout, and NO Cancel button (MF1)", () => {
    const html = render(PREPARING_BEFORE_ANY_EVENT);
    expect(html).toContain("Preparing…");
    expect(html).not.toContain("bytes hashed");
    expect(html).not.toContain("publish-preparing-cancel");
  });

  it("preparing, after the first phase event: the host's phase label, the bytes readout, and a live Cancel", () => {
    const html = render(stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 1048576, 5004376705));
    expect(html).toContain("pinning-source");
    expect(html).toContain("1,048,576 / 5,004,376,705 bytes hashed");
    expect(html).toContain("publish-preparing-cancel");
    expect(html).toContain(">Cancel<");
    // No rate, no percentage, no ETA anywhere on this surface (ADR-018).
    expect(html).not.toMatch(/%|\bETA\b|\bper second\b|\bremaining\b/);
  });

  it("a cancel already requested: the button reads 'Cancelling' and is disabled", () => {
    const latched = stateAfterCancelRequested(
      stateAfterPinProgress(PREPARING_BEFORE_ANY_EVENT, "pinning-source", 1048576, 5004376705)
    );
    const html = render(latched);
    expect(html).toContain("Cancelling");
    expect(html).toMatch(/class="publish-preparing-cancel"[^>]*disabled/);
  });

  it("cancelled: the ADR-006 sentence, verbatim, and Publish enabled again", () => {
    const html = render({ kind: "cancelled" });
    expect(html).toContain("Preparing stopped — nothing was written.");
    // The Publish button carries no `disabled` attribute in this state -- the operator may retry
    // immediately, which is what "nothing was written" means in practice.
    const publishButton = html.match(/<button[^>]*class="publish-open"[^>]*>/)?.[0] ?? "";
    expect(publishButton).not.toBe("");
    expect(publishButton).not.toContain("disabled");
    expect(html).toContain("Publish…");
  });

  it("preparing disables Publish (one prepare at a time) -- the contrast that makes the cancelled case's re-enable real", () => {
    const publishButton =
      render(PREPARING_BEFORE_ANY_EVENT).match(/<button[^>]*class="publish-open"[^>]*>/)?.[0] ?? "";
    expect(publishButton).toContain("disabled");
  });
});

describe("prepareCancelKey -- pinned against publish.rs::prepare_cancel_key's own prefix (RELEASE-0.1 item 10)", () => {
  it("PREPARE_CANCEL_KEY_PREFIX matches frontends/shell/src-tauri/src/publish.rs::PREPARE_CANCEL_KEY_PREFIX exactly", () => {
    const rustSource = readFileSync(join(HERE, "../../src-tauri/src/publish.rs"), "utf8");
    const match = rustSource.match(/PREPARE_CANCEL_KEY_PREFIX: &str = "([^"]*)";/);
    expect(match).not.toBeNull();
    expect((match as RegExpMatchArray)[1]).toBe(PREPARE_CANCEL_KEY_PREFIX);
  });

  it("prepareCancelKey concatenates the prefix and the dataset handle verbatim", () => {
    expect(prepareCancelKey("ds_abc123")).toBe(`${PREPARE_CANCEL_KEY_PREFIX}ds_abc123`);
  });
});
