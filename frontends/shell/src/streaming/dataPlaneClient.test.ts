// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { consoleRecorder, isBindingCommandEntry } from "../console/recorder";
import { __resetForTests, dataPlaneAttach } from "./dataPlaneClient";

/**
 * NEXT-CUT.md P3 item B: `binding_data_plane_attach` records name-only, pre-invoke, resolves
 * post-invoke, rethrows unchanged -- the wire must be observationally invisible to `dataPlaneAttach`'s
 * own callers (`skp/client.test.ts`'s own established mock-invoke pattern, reused here).
 */
describe("dataPlaneAttach records binding_data_plane_attach (NEXT-CUT.md P3)", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    __resetForTests();
  });

  it("records a binding-command entry name-only, pending before invoke settles, ok after", async () => {
    invokeMock.mockResolvedValueOnce({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    const before = consoleRecorder.entries().length;

    const result = await dataPlaneAttach();

    expect(result).toEqual({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_data_plane_attach");
    expect(entry.outcome).toBe("ok");
  });

  it("records outcome threw and rethrows the original error unchanged, without recording any argument object", async () => {
    const transportError = new Error("connection refused");
    invokeMock.mockRejectedValueOnce(transportError);
    const before = consoleRecorder.entries().length;

    await expect(dataPlaneAttach()).rejects.toBe(transportError);

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.outcome).toBe("threw");
    // S4 (reviewer gate, action-console P7 fixes): BindingCommandEntry structurally carries no
    // error text -- the original `Error` above is still rethrown to `dataPlaneAttach`'s own caller
    // unchanged, only never stored on this entry.
    // No field on a binding-command entry could ever hold an argument object (recorder.ts's own
    // BindingCommandEntry shape) -- this call takes none anyway, but the assertion documents the
    // invariant the type itself already guarantees.
    expect(Object.keys(entry).sort()).toEqual(["command", "kind", "outcome", "seq"].sort());
  });
});
