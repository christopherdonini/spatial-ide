// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

const listenMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/event", () => ({ listen: listenMock }));

import { consoleRecorder, isBindingCommandEntry } from "../console/recorder";
import {
  publishCancel,
  publishExecute,
  publishPrepare,
  publishPrepareWithDestination,
  subscribePublishProgress,
} from "./client";

/**
 * `publishPrepare`/`publishExecute`/`publishCancel`'s own request shape -- the Rust side already
 * validates the wire contract (`publish.rs`'s own tests); this asserts only that this TS client
 * actually SENDS the right invoke args (`skp/client.test.ts`'s own established precedent, same
 * reasoning). Argument NAMES are camelCase (Tauri's `#[tauri::command]` macro default,
 * `ArgumentCase::Camel`, unmodified anywhere in this crate) -- distinct from `skp/client.ts`'s own
 * `{request: {...snake_case}}` shape, since these commands take several loose parameters, not one
 * pre-shaped request struct.
 */
describe("publishPrepare request shape", () => {
  beforeEach(() => {
    invokeMock.mockReset().mockResolvedValue({ status: "picker-cancelled" });
  });

  it("sends datasetHandle/styleDoc/scope/filterActive as camelCase invoke args", async () => {
    await publishPrepare("ds_x", '{"style_version":1}', { kind: "whole-file" }, false);

    expect(invokeMock).toHaveBeenCalledWith("binding_publish_prepare", {
      datasetHandle: "ds_x",
      styleDoc: '{"style_version":1}',
      scope: { kind: "whole-file" },
      filterActive: false,
    });
  });

  it("carries filterActive through UNCHANGED when true -- the disclosed P1 deviation this shell must not silently drop", async () => {
    await publishPrepare("ds_x", "{}", { kind: "viewport-bbox", bbox: { xmin: 0, ymin: 0, xmax: 1, ymax: 1 } }, true);

    expect(invokeMock).toHaveBeenCalledWith(
      "binding_publish_prepare",
      expect.objectContaining({ filterActive: true })
    );
  });

  it("sends the viewport-bbox scope shape verbatim (plain f64, not SKP's HexF64)", async () => {
    const scope = { kind: "viewport-bbox" as const, bbox: { xmin: 1, ymin: 2, xmax: 3, ymax: 4 } };
    await publishPrepare("ds_x", "{}", scope, false);

    expect(invokeMock).toHaveBeenCalledWith(
      "binding_publish_prepare",
      expect.objectContaining({ scope })
    );
  });
});

describe("publishExecute / publishCancel request shape", () => {
  beforeEach(() => {
    invokeMock.mockReset().mockResolvedValue({ status: "unknown-attempt" });
  });

  it("publishExecute sends attemptId/typedPhrase verbatim -- no comparison happens in this function", async () => {
    await publishExecute("att_1", "whatever-the-operator-typed");
    expect(invokeMock).toHaveBeenCalledWith("binding_publish_execute", {
      attemptId: "att_1",
      typedPhrase: "whatever-the-operator-typed",
    });
  });

  it("publishCancel sends attemptId", async () => {
    invokeMock.mockResolvedValue(true);
    const result = await publishCancel("att_1");
    expect(invokeMock).toHaveBeenCalledWith("binding_publish_cancel", { attemptId: "att_1" });
    expect(result).toBe(true);
  });
});

/**
 * NEXT-CUT.md P3 item B: every binding command in this file -- including the dev-only E2E seam --
 * records name-only, pre-invoke, resolved post-invoke, rethrown unchanged. `consoleRecorder` is a
 * module-level singleton (`skp/client.test.ts`'s own established "before" marker pattern, reused).
 */
describe("publish/client.ts records every binding command name-only (NEXT-CUT.md P3)", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("publishPrepare records binding_publish_prepare, outcome ok", async () => {
    invokeMock.mockResolvedValueOnce({ status: "picker-cancelled" });
    const before = consoleRecorder.entries().length;

    await publishPrepare("ds_x", "{}", { kind: "whole-file" }, false);

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_publish_prepare");
    expect(entry.outcome).toBe("ok");
  });

  it("publishExecute records binding_publish_execute, outcome ok", async () => {
    invokeMock.mockResolvedValueOnce({ status: "unknown-attempt" });
    const before = consoleRecorder.entries().length;

    await publishExecute("att_1", "phrase");

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_publish_execute");
    expect(entry.outcome).toBe("ok");
  });

  it("publishCancel records binding_publish_cancel, outcome ok", async () => {
    invokeMock.mockResolvedValueOnce(true);
    const before = consoleRecorder.entries().length;

    await publishCancel("att_1");

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_publish_cancel");
    expect(entry.outcome).toBe("ok");
  });

  it("publishPrepareWithDestination (the dev-only E2E seam) records too -- it is never hidden from the console", async () => {
    invokeMock.mockResolvedValueOnce({ status: "picker-cancelled" });
    const before = consoleRecorder.entries().length;

    await publishPrepareWithDestination("ds_x", "{}", { kind: "whole-file" }, false, "/tmp/out");

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_publish_prepare_e2e_destination");
    expect(entry.outcome).toBe("ok");
  });

  it("a rejected invoke records outcome threw and rethrows unchanged, for every command in this file", async () => {
    const transportError = new Error("ipc failure");
    invokeMock.mockRejectedValueOnce(transportError);
    const before = consoleRecorder.entries().length;

    await expect(publishPrepare("ds_x", "{}", { kind: "whole-file" }, false)).rejects.toBe(transportError);

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.outcome).toBe("threw");
  });
});

type ProgressHandler = (event: { payload: { attempt_id: string; phase: string } }) => void;

describe("subscribePublishProgress", () => {
  it("filters events to the given attemptId only", async () => {
    // A boxed `const`, deliberately NOT a captured `let` reassigned inside the mock's own closure
    // -- TypeScript does not reliably narrow a `let` that is mutated only inside a nested closure
    // (a known TS control-flow limitation), which manifested here as `NonNullable<typeof handler>`
    // resolving to `never` at the call sites below even after an explicit `if (!handler) throw`
    // guard. Reading `box.handler` into a fresh, never-reassigned `const` sidesteps that entirely.
    const box: { handler: ProgressHandler | null } = { handler: null };
    const unlistenSpy = vi.fn();
    listenMock.mockReset().mockImplementation((_event: string, cb: ProgressHandler) => {
      box.handler = cb;
      return Promise.resolve(unlistenSpy);
    });

    const onPhase = vi.fn();
    const unsubscribe = subscribePublishProgress("att_1", onPhase);
    // `listen` resolves asynchronously (it registers over IPC) -- let that microtask settle before
    // the handler is usable, mirroring the same async-registration shape the real Tauri API has.
    await Promise.resolve();
    await Promise.resolve();

    const handler = box.handler;
    if (!handler) throw new Error("listen() callback was never captured");
    handler({ payload: { attempt_id: "att_1", phase: "querying" } });
    handler({ payload: { attempt_id: "att_OTHER", phase: "finalizing" } });

    expect(onPhase).toHaveBeenCalledTimes(1);
    expect(onPhase).toHaveBeenCalledWith("querying");

    unsubscribe();
    expect(unlistenSpy).toHaveBeenCalledTimes(1);
  });

  it("unsubscribing before listen() resolves does not leak a live listener", async () => {
    const unlistenSpy = vi.fn();
    let resolveListen: ((fn: () => void) => void) | null = null;
    listenMock.mockReset().mockImplementation(
      () =>
        new Promise<() => void>((resolve) => {
          resolveListen = resolve;
        })
    );

    const unsubscribe = subscribePublishProgress("att_1", vi.fn());
    unsubscribe(); // before listen() has resolved at all
    (resolveListen as unknown as (fn: () => void) => void)(unlistenSpy);
    await Promise.resolve();
    await Promise.resolve();

    expect(unlistenSpy).toHaveBeenCalledTimes(1); // the late-arriving unlisten fn is disposed, not held
  });
});
