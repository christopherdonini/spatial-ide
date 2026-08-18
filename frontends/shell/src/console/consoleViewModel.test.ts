// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import {
  buildRowViewModel,
  groupConsecutiveEntries,
  type ClassBRowViewModel,
  type ClassCRowViewModel,
} from "./consoleViewModel";
import type { BindingCommandEntry, ConsoleEntry, GuiActionEntry, SkpRequestEntry } from "./recorder";

function skpEntry(seq: number, command: string, request: unknown = { skp: "skp/0.2" }): SkpRequestEntry {
  return { seq, kind: "skp-request", command, request, outcome: "ok" };
}

function bindingEntry(seq: number, command: string): BindingCommandEntry {
  return { seq, kind: "binding-command", command, outcome: "ok" };
}

function guiEntry(seq: number, action: string): GuiActionEntry {
  return { seq, kind: "gui-action", action };
}

describe("groupConsecutiveEntries (I8: coalescing never synthesizes)", () => {
  it("3 identical + 1 different command -> groups [3, 1], expanding yields the 3 originals by reference", () => {
    const a1 = skpEntry(0, "describe");
    const a2 = skpEntry(1, "describe");
    const a3 = skpEntry(2, "describe");
    const b1 = skpEntry(3, "viewport_query");
    const entries: ConsoleEntry[] = [a1, a2, a3, b1];

    const groups = groupConsecutiveEntries(entries);

    expect(groups.map((g) => g.entries.length)).toEqual([3, 1]);
    // The exact original references, in order -- never a merged/synthesized entry.
    expect(groups[0]!.entries).toEqual([a1, a2, a3]);
    expect(groups[0]!.entries[0]).toBe(a1);
    expect(groups[0]!.entries[1]).toBe(a2);
    expect(groups[0]!.entries[2]).toBe(a3);
    expect(groups[1]!.entries[0]).toBe(b1);
  });

  it("non-consecutive repeats of the same command do NOT merge -- only CONSECUTIVE runs group", () => {
    const a1 = skpEntry(0, "describe");
    const b1 = skpEntry(1, "viewport_query");
    const a2 = skpEntry(2, "describe");
    const groups = groupConsecutiveEntries([a1, b1, a2]);

    expect(groups.map((g) => g.entries.length)).toEqual([1, 1, 1]);
  });

  it("groups across classes independently -- a binding-command run and a gui-action run never merge with each other", () => {
    const b1 = bindingEntry(0, "binding_pick_file");
    const b2 = bindingEntry(1, "binding_pick_file");
    const c1 = guiEntry(2, "style.setFillColor");
    const groups = groupConsecutiveEntries([b1, b2, c1]);

    expect(groups.map((g) => g.entries.length)).toEqual([2, 1]);
  });

  it("empty input yields no groups", () => {
    expect(groupConsecutiveEntries([])).toEqual([]);
  });
});

describe("buildRowViewModel", () => {
  it("class A: builds commandLabel from the registry and skpVersion from the entry's OWN request.skp field (I3)", () => {
    const entry = skpEntry(0, "describe", { skp: "skp/0.2", dataset: "ds_x" });
    const vm = buildRowViewModel(entry);

    expect(vm.kind).toBe("class-a");
    if (vm.kind !== "class-a") throw new Error("unreachable");
    expect(vm.commandLabel).toBe("describe");
    expect(vm.skpVersion).toBe("skp/0.2");
    expect(vm.rendered.copyText).toContain("ds_x");
  });

  it("class A: skpVersion is null when the request carries no skp field (never a literal fallback)", () => {
    const entry = skpEntry(0, "describe", { dataset: "ds_x" });
    const vm = buildRowViewModel(entry);
    if (vm.kind !== "class-a") throw new Error("unreachable");
    expect(vm.skpVersion).toBeNull();
  });

  it("class A: an unmatched command name falls back to unclassified, not a silent skip", () => {
    const entry = skpEntry(0, "not_a_real_command");
    const vm = buildRowViewModel(entry);
    expect(vm.kind).toBe("unclassified");
  });

  it("class B: the view model has no field an argument object or a JSON block could occupy (I6, run-time shape)", () => {
    const entry = bindingEntry(0, "binding_pick_file");
    const vm = buildRowViewModel(entry) as ClassBRowViewModel;

    expect(vm.kind).toBe("class-b");
    const keys = Object.keys(vm).sort();
    expect(keys).toEqual(["citation", "effect", "entry", "kind", "outcome"].sort());
    // No copy-affordance flag, no request/rendered/copyText field anywhere on this shape.
    expect("copyText" in vm).toBe(false);
    expect("request" in vm).toBe(false);
    expect("rendered" in vm).toBe(false);
  });

  it("class B: an unmatched command name falls back to unclassified", () => {
    const entry = bindingEntry(0, "binding_does_not_exist");
    const vm = buildRowViewModel(entry);
    expect(vm.kind).toBe("unclassified");
    if (vm.kind !== "unclassified") throw new Error("unreachable");
    expect(vm.name).toBe("binding_does_not_exist");
  });

  it("class C: the view model has no field an argument object or a JSON block could occupy (I6, run-time shape)", () => {
    const entry = guiEntry(0, "style.setFillColor");
    const vm = buildRowViewModel(entry) as ClassCRowViewModel;

    expect(vm.kind).toBe("class-c");
    const keys = Object.keys(vm).sort();
    expect(keys).toEqual(["entry", "kind", "owner", "statement"].sort());
    expect("copyText" in vm).toBe(false);
    expect("request" in vm).toBe(false);
  });

  it("class C: an unmatched action name falls back to unclassified", () => {
    const entry = guiEntry(0, "style.notARealAction");
    const vm = buildRowViewModel(entry);
    expect(vm.kind).toBe("unclassified");
  });
});
