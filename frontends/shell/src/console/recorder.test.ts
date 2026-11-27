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
    const request = { skp: "skp/0.3", dataset: "ds_x" };

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
    expect(recorder.droppedCount("other")).toBe(10);
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
    recorder.record({ skp: "skp/0.3", dataset: "ds_x" }, "describe");

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

/** The seven names the lane tests draw from: three of the stream kind (a named `viewport_query` or
 * `cancel` request, and the `binding_log_session_event` binding command) and four of the other
 * kind. Each line is how the name is recorded, by the recorder's own three capture methods. */
const STREAM_NAMES = ["viewport_query", "cancel", "binding_log_session_event"] as const;
const OTHER_NAMES = ["describe", "binding_pick_file", "style.setFillColor", "record_step"] as const;
type LaneName = (typeof STREAM_NAMES)[number] | (typeof OTHER_NAMES)[number];

function recordByName(recorder: ConsoleRecorder, name: LaneName): void {
  switch (name) {
    case "binding_log_session_event":
    case "binding_pick_file":
      recorder.recordBindingCommand(name);
      return;
    case "style.setFillColor":
      recorder.recordGuiAction(name);
      return;
    default:
      recorder.record({ name }, name);
  }
}

function isStreamName(name: LaneName): boolean {
  return (STREAM_NAMES as readonly string[]).includes(name);
}

/** A small seeded generator (mulberry32), so the 3,000-entry run below is the same every time. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The two lanes (known limitation 67; `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`
 * section 4): a data request, a cancel and a session-log line are held in a ring of their own, every
 * other entry in another ring, each of MAX_CONSOLE_ENTRIES. Every figure below is written against
 * MAX_CONSOLE_ENTRIES, never a literal ring size.
 */
describe("ConsoleRecorder lanes", () => {
  it("CL1: a record_step survives any amount of stream traffic, which is counted against its own ring", () => {
    const recorder = new ConsoleRecorder();
    recorder.record({ step: 1 }, "record_step");
    for (let i = 0; i < 300; i++) {
      recorder.record({ i }, "viewport_query");
      recorder.recordBindingCommand("binding_log_session_event");
    }

    const entries = recorder.entries();
    expect(entries.some((e) => e.kind === "skp-request" && e.command === "record_step")).toBe(true);
    expect(recorder.droppedCount("stream")).toBe(600 - MAX_CONSOLE_ENTRIES);
    expect(recorder.droppedCount("other")).toBe(0);
    expect(recorder.count()).toBe(MAX_CONSOLE_ENTRIES + 1);
  });

  it("CL2: each lane holds its newest MAX_CONSOLE_ENTRIES, whatever the other lane does", () => {
    const recorder = new ConsoleRecorder();
    for (let i = 0; i < 300; i++) {
      recorder.recordGuiAction("style.setFillColor");
      recorder.record({ i }, "cancel");
    }

    const entries = recorder.entries();
    expect(recorder.count()).toBe(2 * MAX_CONSOLE_ENTRIES);
    expect(recorder.droppedCount("stream")).toBe(300 - MAX_CONSOLE_ENTRIES);
    expect(recorder.droppedCount("other")).toBe(300 - MAX_CONSOLE_ENTRIES);
    // The oldest held entry of each lane is that lane's (300 - M + 1)th: its seq is twice the
    // number dropped from that lane (gui-action first, cancel second, in each pair).
    const firstGui = entries.find((e) => e.kind === "gui-action")!;
    const firstCancel = entries.find((e) => e.kind === "skp-request")!;
    expect(firstGui.seq).toBe(2 * (300 - MAX_CONSOLE_ENTRIES));
    expect(firstCancel.seq).toBe(2 * (300 - MAX_CONSOLE_ENTRIES) + 1);
  });

  it("CL3: entries() is every held entry, oldest first by seq, across both lanes", () => {
    const recorder = new ConsoleRecorder();
    recorder.recordGuiAction("style.setFillColor");
    for (let i = 0; i < 300; i++) recorder.record({ i }, "viewport_query");
    recorder.recordGuiAction("tool.set");

    const entries = recorder.entries();
    expect(entries[0]).toMatchObject({ kind: "gui-action", action: "style.setFillColor", seq: 0 });
    expect(entries[entries.length - 1]).toMatchObject({ kind: "gui-action", action: "tool.set", seq: 301 });
    for (let k = 1; k < entries.length; k++) {
      expect(entries[k]!.seq).toBeGreaterThan(entries[k - 1]!.seq);
    }
  });

  it("CL4: never silently truncates across both rings -- count() plus both drop counts is every entry recorded", () => {
    const recorder = new ConsoleRecorder();
    const next = seeded(67);
    const names: LaneName[] = [...STREAM_NAMES, ...OTHER_NAMES];
    const streamSeqs = new Set<number>();
    const checkAbsent = (recorded: number): void => {
      const held = new Set(recorder.entries().map((e) => e.seq));
      const absent: number[] = [];
      for (let seq = 0; seq < recorded; seq++) if (!held.has(seq)) absent.push(seq);
      expect(absent.length).toBe(recorder.droppedCount("stream") + recorder.droppedCount("other"));
      expect(absent.filter((seq) => streamSeqs.has(seq)).length).toBe(recorder.droppedCount("stream"));
    };

    let recorded = 0;
    for (let i = 0; i < 3000; i++) {
      // Seven names drawn evenly: over 3,000 entries both rings overflow (asserted below).
      const name = names[Math.floor(next() * names.length)]!;
      if (isStreamName(name)) streamSeqs.add(recorded);
      recordByName(recorder, name);
      recorded++;

      const dropped = recorder.droppedCount("stream") + recorder.droppedCount("other");
      expect(recorder.count() + dropped).toBe(recorded);
      if (i % 100 === 99) checkAbsent(recorded);
    }
    checkAbsent(recorded);
    expect(recorder.droppedCount("stream")).toBeGreaterThan(0);
    expect(recorder.droppedCount("other")).toBeGreaterThan(0);
    // Each lane holds at most MAX_CONSOLE_ENTRIES: the held entries of each lane, by name.
    const entries = recorder.entries();
    const heldStream = entries.filter((e) => streamSeqs.has(e.seq)).length;
    expect(heldStream).toBeLessThanOrEqual(MAX_CONSOLE_ENTRIES);
    expect(entries.length - heldStream).toBeLessThanOrEqual(MAX_CONSOLE_ENTRIES);
  });

  it("CL5: each name goes to its own lane only -- a stream name to the stream lane, every other name to the other", () => {
    for (const name of [...STREAM_NAMES, ...OTHER_NAMES] as LaneName[]) {
      const recorder = new ConsoleRecorder();
      for (let i = 0; i < MAX_CONSOLE_ENTRIES + 1; i++) recordByName(recorder, name);

      expect(recorder.droppedCount("stream"), `${name}: stream drops`).toBe(isStreamName(name) ? 1 : 0);
      expect(recorder.droppedCount("other"), `${name}: other drops`).toBe(isStreamName(name) ? 0 : 1);
    }
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
