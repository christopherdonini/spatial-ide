// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { consoleRecorder, isBindingCommandEntry } from "../console/recorder";
import { crsCatalog } from "./crsCatalog";

/** NEXT-CUT.md P3 item B: `binding_crs_catalog` records name-only, pre-invoke, resolves
 * post-invoke, rethrows unchanged. */
describe("crsCatalog records binding_crs_catalog (NEXT-CUT.md P3)", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("records outcome ok and returns the catalog unchanged", async () => {
    const catalog = [{ id: "epsg:2056", authority: "EPSG", code: 2056, name: "CH1903+", definition: "{}", hash: "abc" }];
    invokeMock.mockResolvedValueOnce(catalog);
    const before = consoleRecorder.entries().length;

    const result = await crsCatalog();

    expect(result).toBe(catalog);
    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_crs_catalog");
    expect(entry.outcome).toBe("ok");
  });

  it("records outcome threw and rethrows the original error unchanged", async () => {
    const transportError = new Error("ipc failure");
    invokeMock.mockRejectedValueOnce(transportError);
    const before = consoleRecorder.entries().length;

    await expect(crsCatalog()).rejects.toBe(transportError);

    const entry = consoleRecorder.entries()[before]!;
    if (!isBindingCommandEntry(entry)) throw new Error("expected binding-command entry");
    expect(entry.outcome).toBe("threw");
  });
});
