// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { consoleRecorder, isBindingCommandEntry } from "../console/recorder";
import { logSessionEvent } from "./log";

/** NEXT-CUT.md P3 item B: `binding_log_session_event` records name-only, pre-invoke, resolves
 * post-invoke -- still never throws into its own caller (this file's own pre-existing contract),
 * whether `invoke` resolves or rejects. */
describe("logSessionEvent records binding_log_session_event (NEXT-CUT.md P3)", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("never throws, and records outcome ok once invoke resolves", async () => {
    invokeMock.mockResolvedValueOnce(undefined);
    const before = consoleRecorder.entries().length;

    expect(() => logSessionEvent("info", "hello")).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_log_session_event");
    expect(entry.outcome).toBe("ok");
  });

  it("never throws even when invoke rejects, and records outcome threw", async () => {
    invokeMock.mockRejectedValueOnce(new Error("ipc failure"));
    const before = consoleRecorder.entries().length;

    expect(() => logSessionEvent("error", "boom")).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.outcome).toBe("threw");
    // S4 (reviewer gate, action-console P7 fixes): BindingCommandEntry structurally carries no
    // error text.
    expect("error" in entry).toBe(false);
  });
});
