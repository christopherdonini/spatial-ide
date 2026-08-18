// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import {
  ConsoleRecorder,
  consoleRecorder,
  MAX_CONSOLE_ENTRIES,
  MAX_ENTRY_RENDER_BYTES,
  recordNamed,
  type SkpRequestEntry,
} from "./recorder";

/** Every entry this file's own "ConsoleRecorder" describe block builds via `.record()` is a
 * `SkpRequestEntry` by construction -- narrowed with this helper rather than a bare `as` cast at
 * each call site. */
function asSkpRequestEntry(entry: { kind: string }): SkpRequestEntry {
  if (entry.kind !== "skp-request") throw new Error(`expected skp-request entry, got ${entry.kind}`);
  return entry as SkpRequestEntry;
}

describe("ConsoleRecorder", () => {
  it("records the exact request reference, not a copy (I2)", () => {
    const recorder = new ConsoleRecorder();
    const request = { skp: "skp/0.2", dataset: "ds_x" };

    recorder.record(request);

    expect(asSkpRequestEntry(recorder.entries()[0]!).request).toBe(request);
  });

  it("starts an entry pending, in insertion order, with an increasing seq", () => {
    const recorder = new ConsoleRecorder();
    recorder.record({ a: 1 });
    recorder.record({ a: 2 });

    const entries = recorder.entries().map(asSkpRequestEntry);
    expect(entries.map((e) => e.outcome)).toEqual(["pending", "pending"]);
    expect(entries.map((e) => e.seq)).toEqual([0, 1]);
    expect(entries.map((e) => (e.request as { a: number }).a)).toEqual([1, 2]);
  });

  it("resolveOk transitions the entry to ok", () => {
    const recorder = new ConsoleRecorder();
    const handle = recorder.record({ a: 1 });

    handle.resolveOk();

    expect(asSkpRequestEntry(recorder.entries()[0]!).outcome).toBe("ok");
  });

  it("resolveRefused transitions to refused and carries the typed refusal", () => {
    const recorder = new ConsoleRecorder();
    const handle = recorder.record({ a: 1 });
    const refusal = { code: "engine.crs_assertion_conflict", message: "already declared", fields: { dataset: "ds_x" } };

    handle.resolveRefused(refusal);

    const entry = asSkpRequestEntry(recorder.entries()[0]!);
    expect(entry.outcome).toBe("refused");
    expect(entry.refusal).toEqual(refusal);
    expect(entry.error).toBeUndefined();
  });

  it("resolveThrew transitions to threw and carries the message", () => {
    const recorder = new ConsoleRecorder();
    const handle = recorder.record({ a: 1 });

    handle.resolveThrew("network unreachable");

    const entry = asSkpRequestEntry(recorder.entries()[0]!);
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

    const entries = recorder.entries().map(asSkpRequestEntry);
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

  it("count() equals entries().length without copying the buffer (S6, reviewer gate, action-console P7 fixes)", () => {
    const recorder = new ConsoleRecorder();
    expect(recorder.count()).toBe(0);

    recorder.record({ a: 1 });
    recorder.record({ a: 2 });
    expect(recorder.count()).toBe(2);
    expect(recorder.count()).toBe(recorder.entries().length);

    const total = MAX_CONSOLE_ENTRIES + 10;
    for (let i = 0; i < total; i++) recorder.record({ i });
    // Past the eviction ceiling: count() still agrees with entries().length, and both cap at
    // MAX_CONSOLE_ENTRIES (droppedCount() tracks the rest, not count()).
    expect(recorder.count()).toBe(MAX_CONSOLE_ENTRIES);
    expect(recorder.count()).toBe(recorder.entries().length);
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

  it("record() carries the optional command name on the entry (P3: command-name header)", () => {
    const recorder = new ConsoleRecorder();
    recorder.record({ skp: "skp/0.2", dataset: "ds_x" }, "describe");

    expect(recorder.entries()[0]!.kind).toBe("skp-request");
    expect(asSkpRequestEntry(recorder.entries()[0]!).command).toBe("describe");
  });

  describe("recordBindingCommand (class B, NEXT-CUT.md P3 item A)", () => {
    it("records a binding-command entry, name only, starting pending", () => {
      const recorder = new ConsoleRecorder();
      recorder.recordBindingCommand("binding_pick_file");

      const entry = recorder.entries()[0]!;
      expect(entry).toEqual({ seq: 0, kind: "binding-command", command: "binding_pick_file", outcome: "pending" });
    });

    it("resolveOk transitions to ok", () => {
      const recorder = new ConsoleRecorder();
      const handle = recorder.recordBindingCommand("binding_pick_file");
      handle.resolveOk();
      const entry = recorder.entries()[0]!;
      if (entry.kind !== "binding-command") throw new Error("expected binding-command entry");
      expect(entry.outcome).toBe("ok");
    });

    it("resolveThrew transitions to threw and carries no message -- structurally (S4, reviewer gate, action-console P7 fixes)", () => {
      const recorder = new ConsoleRecorder();
      const handle = recorder.recordBindingCommand("binding_pick_file");
      handle.resolveThrew();
      const entry = recorder.entries()[0]!;
      if (entry.kind !== "binding-command") throw new Error("expected binding-command entry");
      expect(entry.outcome).toBe("threw");
      expect("error" in entry).toBe(false);
    });

    it("CRITICAL: resolveThrew accepts no message parameter at all -- a caller cannot smuggle host-arbitrary error text through it even by accident", () => {
      const recorder = new ConsoleRecorder();
      const handle = recorder.recordBindingCommand("binding_pick_file");
      // @ts-expect-error -- BindingCommandHandle.resolveThrew has no parameters (S4); passing one
      // must fail tsc, not merely be ignored at runtime.
      handle.resolveThrew("this must not compile");
    });

    it("notifies subscribers on record and resolve, same as record()", () => {
      const recorder = new ConsoleRecorder();
      const listener = vi.fn();
      recorder.subscribe(listener);
      const handle = recorder.recordBindingCommand("binding_pick_file");
      expect(listener).toHaveBeenCalledTimes(1);
      handle.resolveOk();
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe("recordGuiAction (class C, NEXT-CUT.md P3 item A)", () => {
    it("records a gui-action entry with no outcome field at all -- the action IS its own completion", () => {
      const recorder = new ConsoleRecorder();
      recorder.recordGuiAction("style.setFillColor");

      const entry = recorder.entries()[0]!;
      expect(entry).toEqual({ seq: 0, kind: "gui-action", action: "style.setFillColor" });
    });

    it("notifies subscribers once, synchronously", () => {
      const recorder = new ConsoleRecorder();
      const listener = vi.fn();
      recorder.subscribe(listener);
      recorder.recordGuiAction("style.togglePanelExpanded");
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});

/**
 * `recordNamed` (NEXT-CUT.md P3 item A): the name-only capture API's own fence, proven at the type
 * level, not merely by convention. Delegates to the module-level `consoleRecorder` singleton (the
 * same instance `skp/client.ts` uses), so these tests read only the entry each `it` itself
 * appended -- the same `entries().length` "before" marker `skp/client.test.ts` already uses for
 * the same shared-singleton reason.
 */
describe("recordNamed", () => {
  // Asserted at TYPECHECK time (`npm run typecheck`), not at `vitest` runtime -- same caveat as
  // `surfaceRegistry.test.ts`'s own compile-time `describe` block: the `@ts-expect-error` comment
  // below is the actual assertion; `vitest` running the call to completion (it never throws) does
  // not itself prove the type-level fence held.
  it("CRITICAL: accepts only a RecordableName -- no third parameter exists for an argument object to occupy", () => {
    // @ts-expect-error -- recordNamed's own signature has no parameter after `name: RecordableName`;
    // a caller cannot pass an argument object even by explicit position, let alone by accident. This
    // is the fence itself: it fails `tsc`, not merely a lint at review time.
    recordNamed("binding-command", "binding_pick_file", { path: "/should/not/compile" });
  });

  it("CRITICAL: a computed/template-string name fails tsc -- RecordableName is a literal union, not string (reviewer gate S3)", () => {
    const computed = "binding_" + "pick_file";
    // @ts-expect-error -- `computed`'s inferred type is `string`, not the `RecordableName` literal
    // union; only a name that is ITSELF one of the registry's own literal command/action strings
    // (or a `const`-narrowed alias of one) type-checks here.
    recordNamed("binding-command", computed);
  });

  it("binding-command records name-only and returns a handle with resolveOk/resolveThrew (no resolveRefused)", () => {
    const before = consoleRecorder.entries().length;

    const handle = recordNamed("binding-command", "binding_crs_catalog");
    handle.resolveOk();

    const entry = consoleRecorder.entries()[before]!;
    if (entry.kind !== "binding-command") throw new Error("expected binding-command entry");
    expect(entry.command).toBe("binding_crs_catalog");
    expect(entry.outcome).toBe("ok");
    // @ts-expect-error -- BindingCommandHandle has no resolveRefused; a binding command never
    // produces a typed SkpError-shaped refusal at this boundary (recorder.ts's own doc comment).
    void handle.resolveRefused;
  });

  it("gui-action records name-only and returns void", () => {
    const before = consoleRecorder.entries().length;

    const result = recordNamed("gui-action", "canvas.dismissCanvasRefusal");

    expect(result).toBeUndefined();
    const entry = consoleRecorder.entries()[before]!;
    expect(entry).toEqual({ seq: entry.seq, kind: "gui-action", action: "canvas.dismissCanvasRefusal" });
  });
});
