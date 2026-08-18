// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { consoleRecorder, isBindingCommandEntry } from "../console/recorder";
import { pickFile } from "./dialog";

/** NEXT-CUT.md P3 item B: `binding_pick_file` records name-only, pre-invoke, resolves
 * post-invoke, rethrows unchanged. */
describe("pickFile records binding_pick_file (NEXT-CUT.md P3)", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("records outcome ok and returns the chosen path unchanged", async () => {
    invokeMock.mockResolvedValueOnce("/data/fixture.parquet");
    const before = consoleRecorder.entries().length;

    const result = await pickFile();

    expect(result).toBe("/data/fixture.parquet");
    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_pick_file");
    expect(entry.outcome).toBe("ok");
  });

  it("records outcome ok on a cancelled picker (null is a normal resolution, not a refusal)", async () => {
    invokeMock.mockResolvedValueOnce(null);
    const before = consoleRecorder.entries().length;

    const result = await pickFile();

    expect(result).toBeNull();
    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.outcome).toBe("ok");
  });

  it("records outcome threw and rethrows the original error unchanged", async () => {
    const transportError = new Error("ipc failure");
    invokeMock.mockRejectedValueOnce(transportError);
    const before = consoleRecorder.entries().length;

    await expect(pickFile()).rejects.toBe(transportError);

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.outcome).toBe("threw");
    expect(entry.error).toBe("ipc failure");
  });
});
