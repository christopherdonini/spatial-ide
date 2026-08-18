// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { encodeHexF64 } from "../skp/codec";
import type { Bbox } from "../skp/types";
import type { DialogSettleResult } from "./PublishDialog";
import {
  currentViewOptionDisabled,
  nextStateFromDialogSettled,
  nextStateFromPrepareOutcome,
  resolvePublishScope,
  settlePrepareOutcome,
} from "./PublishPanel";
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
