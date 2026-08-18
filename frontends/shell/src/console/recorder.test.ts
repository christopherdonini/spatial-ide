// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import { ConsoleRecorder, MAX_CONSOLE_ENTRIES, MAX_ENTRY_RENDER_BYTES } from "./recorder";

describe("ConsoleRecorder", () => {
  it("records the exact request reference, not a copy (I2)", () => {
    const recorder = new ConsoleRecorder();
    const request = { skp: "skp/0.2", dataset: "ds_x" };

    recorder.record(request);

    expect(recorder.entries()[0]!.request).toBe(request);
  });

  it("starts an entry pending, in insertion order, with an increasing seq", () => {
    const recorder = new ConsoleRecorder();
    recorder.record({ a: 1 });
    recorder.record({ a: 2 });

    const entries = recorder.entries();
    expect(entries.map((e) => e.outcome)).toEqual(["pending", "pending"]);
    expect(entries.map((e) => e.seq)).toEqual([0, 1]);
    expect(entries.map((e) => (e.request as { a: number }).a)).toEqual([1, 2]);
  });

  it("resolveOk transitions the entry to ok", () => {
    const recorder = new ConsoleRecorder();
    const handle = recorder.record({ a: 1 });

    handle.resolveOk();

    expect(recorder.entries()[0]!.outcome).toBe("ok");
  });

  it("resolveRefused transitions to refused and carries the typed refusal", () => {
    const recorder = new ConsoleRecorder();
    const handle = recorder.record({ a: 1 });
    const refusal = { code: "engine.crs_assertion_conflict", message: "already declared", fields: { dataset: "ds_x" } };

    handle.resolveRefused(refusal);

    const entry = recorder.entries()[0]!;
    expect(entry.outcome).toBe("refused");
    expect(entry.refusal).toEqual(refusal);
    expect(entry.error).toBeUndefined();
  });

  it("resolveThrew transitions to threw and carries the message", () => {
    const recorder = new ConsoleRecorder();
    const handle = recorder.record({ a: 1 });

    handle.resolveThrew("network unreachable");

    const entry = recorder.entries()[0]!;
    expect(entry.outcome).toBe("threw");
    expect(entry.error).toBe("network unreachable");
    expect(entry.refusal).toBeUndefined();
  });

  it("evicts the oldest entry once MAX_CONSOLE_ENTRIES is exceeded, counting every drop", () => {
    const recorder = new ConsoleRecorder();
    const total = MAX_CONSOLE_ENTRIES + 10;
    for (let i = 0; i < total; i++) {
      recorder.record({ i });
    }

    const entries = recorder.entries();
    expect(entries).toHaveLength(MAX_CONSOLE_ENTRIES);
    expect(recorder.droppedCount()).toBe(10);
    // Oldest 10 (i = 0..9) are gone; the surviving window starts at i = 10 and stays in order.
    expect((entries[0]!.request as { i: number }).i).toBe(10);
    expect((entries[entries.length - 1]!.request as { i: number }).i).toBe(total - 1);
    for (let k = 1; k < entries.length; k++) {
      expect((entries[k]!.request as { i: number }).i).toBeGreaterThan(
        (entries[k - 1]!.request as { i: number }).i
      );
    }
  });

  it("subscribe fires on record and on resolve; unsubscribe stops further notifications", () => {
    const recorder = new ConsoleRecorder();
    const listener = vi.fn();
    const unsubscribe = recorder.subscribe(listener);

    const handle = recorder.record({ a: 1 });
    expect(listener).toHaveBeenCalledTimes(1);

    handle.resolveOk();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    recorder.record({ a: 2 });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("a throwing listener does not break record() or other listeners (recorder inertness)", () => {
    const recorder = new ConsoleRecorder();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const throwing = vi.fn(() => {
      throw new Error("boom");
    });
    const healthy = vi.fn();
    recorder.subscribe(throwing);
    recorder.subscribe(healthy);

    expect(() => recorder.record({ a: 1 })).not.toThrow();

    expect(throwing).toHaveBeenCalledTimes(1);
    expect(healthy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("MAX_ENTRY_RENDER_BYTES is above engine's MAX_CRS_DEFINITION_BYTES (65_536) so a legitimate max-size CRS assertion is never pre-truncated", () => {
    expect(MAX_ENTRY_RENDER_BYTES).toBeGreaterThan(65_536);
  });
});
