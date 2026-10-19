// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { ACTIONS, actionEntry, ariaKeyShortcuts, matchChord, matchCommandOpener, matchToolKey, platformOf, shortcutLabel } from "./actionRegistry";
import type { FocusLike, KeyEventLike, Platform } from "./actionRegistry";

/**
 * SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §4, U5: the chord matcher (§2.3 (c)). The test names
 * carry the chord they pin, so a swapped binding fails by name.
 */

function key(letter: string, over: Partial<KeyEventLike> = {}): KeyEventLike {
  return {
    key: letter,
    code: `Key${letter.toUpperCase()}`,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    repeat: false,
    isComposing: false,
    ...over,
  };
}

const ctrl = (letter: string, over: Partial<KeyEventLike> = {}) => key(letter, { ctrlKey: true, ...over });
const meta = (letter: string, over: Partial<KeyEventLike> = {}) => key(letter, { metaKey: true, ...over });

// RECORDED MUTATION for "U5": swap the I and J bindings in actionRegistry.ts (the Inspector entry takes
// J's chord, the Activity entry takes I's). Expected failure: the test named for Mod+I fails.
// OBSERVED AT d19c84a6c455029a7ec4bdca077ac1e9295f8b8a: FAILED -- 4 cases, the first "Mod+I toggles the Inspector (Ctrl)":
//   AssertionError: expected 'layout.toggleActivity' to be 'layout.toggleInspector' // Object.is equality
// Reverted after observing.
describe("U5: Mod+B, Mod+I and Mod+J map to the three toggles", () => {
  it("Mod+B toggles Layers (Ctrl)", () => {
    expect(matchChord(ctrl("b"), "other")).toBe("layout.toggleLayers");
  });
  it("Mod+I toggles the Inspector (Ctrl)", () => {
    expect(matchChord(ctrl("i"), "other")).toBe("layout.toggleInspector");
  });
  it("Mod+J toggles Activity (Ctrl)", () => {
    expect(matchChord(ctrl("j"), "other")).toBe("layout.toggleActivity");
  });
  it("matches the letter case-insensitively (Caps Lock reports an upper-case key)", () => {
    expect(matchChord(ctrl("I"), "other")).toBe("layout.toggleInspector");
  });
  it("a letter outside the three matches nothing", () => {
    expect(matchChord(ctrl("x"), "other")).toBeNull();
  });
});

describe("U5: Mod is Meta on macOS and Ctrl elsewhere", () => {
  it("Mod+B, Mod+I and Mod+J match with Meta on macOS", () => {
    expect([meta("b"), meta("i"), meta("j")].map((event) => matchChord(event, "mac"))).toEqual([
      "layout.toggleLayers",
      "layout.toggleInspector",
      "layout.toggleActivity",
    ]);
  });
  it("Ctrl does not match on macOS", () => {
    expect(matchChord(ctrl("b"), "mac")).toBeNull();
  });
  it("Meta does not match elsewhere", () => {
    expect(matchChord(meta("b"), "other")).toBeNull();
  });
  it("Ctrl+Meta together matches on neither platform", () => {
    expect(matchChord(key("b", { ctrlKey: true, metaKey: true }), "mac")).toBeNull();
    expect(matchChord(key("b", { ctrlKey: true, metaKey: true }), "other")).toBeNull();
  });
});

describe("U5: the extra modifiers, repeat and composition never match", () => {
  const platforms: Platform[] = ["other", "mac"];
  const mod = (platform: Platform, over: Partial<KeyEventLike> = {}) =>
    platform === "mac" ? meta("b", over) : ctrl("b", over);

  it.each(platforms)("Alt does not match (%s)", (platform) => {
    expect(matchChord(mod(platform, { altKey: true }), platform)).toBeNull();
  });
  it.each(platforms)("Shift does not match (%s)", (platform) => {
    expect(matchChord(mod(platform, { shiftKey: true }), platform)).toBeNull();
  });
  it("Ctrl+Alt does not match, which is how AltGr reports", () => {
    expect(matchChord(ctrl("b", { altKey: true }), "other")).toBeNull();
  });
  it.each(platforms)("a repeat event is ignored (%s)", (platform) => {
    expect(matchChord(mod(platform, { repeat: true }), platform)).toBeNull();
  });
  it.each(platforms)("an event inside IME composition is ignored (%s)", (platform) => {
    expect(matchChord(mod(platform, { isComposing: true }), platform)).toBeNull();
  });
  it("the bare letter, without Mod, matches nothing", () => {
    expect(matchChord(key("b"), "other")).toBeNull();
  });
});

describe("U5: the code fallback, for a key that is not a Latin letter", () => {
  it("a Cyrillic layout's Ctrl+physical-B (key 'и', code KeyB) still toggles Layers", () => {
    expect(matchChord(ctrl("и", { code: "KeyB" }), "other")).toBe("layout.toggleLayers");
  });
  it("the physical key is not consulted when the key is a Latin letter (a layout that moves B)", () => {
    expect(matchChord(ctrl("x", { code: "KeyB" }), "other")).toBeNull();
  });
  it("a non-Latin key on an unregistered code matches nothing", () => {
    expect(matchChord(ctrl("и", { code: "KeyQ" }), "other")).toBeNull();
  });
});

describe("U5: the registry's ids and shortcuts are unique", () => {
  it("ids are unique", () => {
    const ids = ACTIONS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("shortcuts are unique, and Zoom to layer has none", () => {
    const letters = ACTIONS.flatMap((entry) => (entry.chord === null ? [] : [entry.chord.letter]));
    expect(new Set(letters).size).toBe(letters.length);
    expect(ACTIONS.find((entry) => entry.id === "layer.zoomToLayer")?.chord).toBeNull();
  });
  // RECORDED MUTATION for "U5 (the eight ids)": delete the `selection.clear` entry from `ACTIONS` (actionRegistry.ts). Expected
  // failure: the sorted ids lack "selection.clear".
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "holds exactly the eight ids: the three toggles and Zoom to layer (question round 66, item 2), and milestone 2's four (RULED 2026-10-09, eight forms, item 4)":
  //   AssertionError: expected [ 'layer.zoomToLayer', …(6) ] to deeply equal [ 'layer.zoomToLayer', …(7) ]. Reverted after observing.
  // RECORDED MUTATION for "UC8 (the eleven ids)": delete the `dataset.open` entry from `ACTIONS` (actionRegistry.ts). Expected failure: the sorted ids lack "dataset.open".
  // OBSERVED AT fa6715541ccdef4285503a2b9bd59ec9a44943dc: FAILED -- "holds exactly the eleven ids: the eight of milestone 2 and, for milestone 3, command.focus, dataset.open and layer.revealExport (question round 66, item 2; SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC8)":
  //   AssertionError: expected [ 'command.focus', …(9) ] to deeply equal [ 'command.focus', …(10) ]. Reverted after observing.
  it("holds exactly the eleven ids: the eight of milestone 2 and, for milestone 3, command.focus, dataset.open and layer.revealExport (question round 66, item 2; SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC8)", () => {
    expect(ACTIONS.map((entry) => entry.id).sort()).toEqual([
      "command.focus",
      "dataset.open",
      "layer.revealExport",
      "layer.zoomToLayer",
      "layout.toggleActivity",
      "layout.toggleInspector",
      "layout.toggleLayers",
      "selection.clear",
      "selection.zoomTo",
      "tool.navigate",
      "tool.select",
    ]);
  });
});

// RECORDED MUTATION for "UC8": give `command.focus` the chord J in `ACTIONS`. Expected failure: Mod+K maps to nothing, and the chord J is held twice.
// OBSERVED AT fa6715541ccdef4285503a2b9bd59ec9a44943dc: FAILED -- "UC8: Mod+K maps to command.focus (Meta on macOS), and every chord is unique": AssertionError: expected [ null, null, null ] to deeply equal [ 'command.focus', …(2) ];
//   and "shortcuts are unique, and Zoom to layer has none": expected 3 to be 4. Reverted after observing.
describe("UC8: Mod+K is the command bar's chord", () => {
  it("UC8: Mod+K maps to command.focus (Meta on macOS), and every chord is unique", () => {
    expect([matchChord(ctrl("k"), "other"), matchChord(meta("k"), "mac"), matchChord(ctrl("k"), "mac")]).toEqual(["command.focus", "command.focus", null]);
    const letters = ACTIONS.flatMap((entry) => (entry.chord === null ? [] : [entry.chord.letter]));
    expect(new Set(letters).size).toBe(letters.length);
  });
});

describe("the platform read and the labels it drives", () => {
  it("platformOf reads a Mac-family platform string, and a user agent only when there is none", () => {
    expect(platformOf({ platform: "MacIntel" })).toBe("mac");
    expect(platformOf({ platform: "Win32" })).toBe("other");
    expect(platformOf({ platform: "Linux x86_64" })).toBe("other");
    expect(platformOf({ platform: "", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)" })).toBe("mac");
    expect(platformOf({})).toBe("other");
  });
  it("the shortcut label and the aria-keyshortcuts value follow the platform", () => {
    const chord = { letter: "i", code: "KeyI" };
    expect(shortcutLabel(chord, "other")).toBe("Ctrl+I");
    expect(shortcutLabel(chord, "mac")).toBe("⌘I");
    expect(ariaKeyShortcuts(chord, "other")).toBe("Control+I");
    expect(ariaKeyShortcuts(chord, "mac")).toBe("Meta+I");
  });
});

// UB10 (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4): the tool keys (section 2.2; Amendment 1 A4: bare N and
// bare S) and the four ids milestone 2 adds.
const noFocus: FocusLike | null = null;

describe("UB10: bare N is tool.navigate and bare S is tool.select", () => {
  // RECORDED MUTATION for "UB10 (the keys)": give `tool.navigate` the S key in `ACTIONS` (`bareKey: { letter: "s", code: "KeyS" }`), so no entry matches N. Expected
  // failure: the bare N answers null where tool.navigate was expected.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "matches either letter case, with nothing or a button holding the key, and no other letter":
  //   AssertionError: expected null to be 'tool.navigate' // Object.is equality. Reverted after observing.
  it("matches either letter case, with nothing or a button holding the key, and no other letter", () => {
    expect(matchToolKey(key("n"), noFocus)).toBe("tool.navigate");
    expect(matchToolKey(key("N"), noFocus)).toBe("tool.navigate");
    expect(matchToolKey(key("s"), noFocus)).toBe("tool.select");
    expect(matchToolKey(key("S"), noFocus)).toBe("tool.select");
    expect(matchToolKey(key("s"), { tagName: "BUTTON" })).toBe("tool.select");
    expect(matchToolKey(key("x"), noFocus)).toBeNull();
    expect(matchToolKey(key("b"), noFocus)).toBeNull();
  });
});

describe("UB10: a key that is not a Latin letter falls back to the physical key, and a Latin letter never does", () => {
  // RECORDED MUTATION for "UB10 (the code fallback)": in `matchToolKey` match on the key alone (replace the ternary with
  // `event.key.toLowerCase() === key.letter`). Expected failure: a Cyrillic layout's physical N no longer selects Navigate.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "a Cyrillic layout's physical N and S (key 'т' and 'ы') select the tools":
  //   AssertionError: expected null to be 'tool.navigate' // Object.is equality. Reverted after observing.
  it("a Cyrillic layout's physical N and S (key 'т' and 'ы') select the tools", () => {
    expect(matchToolKey(key("т", { code: "KeyN" }), noFocus)).toBe("tool.navigate");
    expect(matchToolKey(key("ы", { code: "KeyS" }), noFocus)).toBe("tool.select");
  });
  // RECORDED MUTATION for "UB10 (a Latin letter never falls back)": in `matchToolKey` match on either (replace the ternary with
  // `event.key.toLowerCase() === key.letter || event.code === key.code`). Expected failure: a Latin x on N's physical key selects Navigate.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "a Latin letter on N's physical key (a layout that moves it) matches nothing, and a non-Latin key on another code matches nothing":
  //   AssertionError: expected 'tool.navigate' to be null. Reverted after observing.
  it("a Latin letter on N's physical key (a layout that moves it) matches nothing, and a non-Latin key on another code matches nothing", () => {
    expect(matchToolKey(key("x", { code: "KeyN" }), noFocus)).toBeNull();
    expect(matchToolKey(key("т", { code: "KeyQ" }), noFocus)).toBeNull();
  });
});

describe("UB10: any modifier, a repeat or a composition ignores the key", () => {
  // RECORDED MUTATION for "UB10 (modifier, repeat, composition)": in `matchToolKey` drop `event.altKey` from the modifier test. Expected
  // failure: the Alt case answers a tool where null was expected.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "Ctrl, Meta, Alt, Shift, repeat and isComposing each ignore both keys":
  //   AssertionError: alt + n: expected 'tool.navigate' to be null. Reverted after observing.
  it("Ctrl, Meta, Alt, Shift, repeat and isComposing each ignore both keys", () => {
    const cases: [string, Partial<KeyEventLike>][] = [
      ["ctrl", { ctrlKey: true }],
      ["meta", { metaKey: true }],
      ["alt", { altKey: true }],
      ["shift", { shiftKey: true }],
      ["repeat", { repeat: true }],
      ["isComposing", { isComposing: true }],
    ];
    for (const [name, over] of cases) {
      for (const letter of ["n", "s"]) expect(matchToolKey(key(letter, over), noFocus), `${name} + ${letter}`).toBeNull();
    }
  });
  // RECORDED MUTATION for "UB10 (a chord is not a tool key)": give `tool.select` the chord Mod+S in `ACTIONS` (`chord: { letter: "s", code: "KeyS" }`). Expected
  // failure: Ctrl+S answers tool.select to `matchChord` where null was expected.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "a Mod chord is not a tool key, and a bare tool key is not a chord":
  //   AssertionError: expected 'tool.select' to be null. Reverted after observing.
  it("a Mod chord is not a tool key, and a bare tool key is not a chord", () => {
    expect(matchToolKey(ctrl("n"), noFocus)).toBeNull();
    expect(matchChord(key("n"), "other")).toBeNull();
    expect(matchChord(ctrl("s"), "other")).toBeNull();
  });
});

describe("UB10: a key is ignored while an input, textarea, select or contenteditable element holds it", () => {
  // RECORDED MUTATION for "UB10 (the text-field guard)": drop the guard in `matchToolKey` (delete `if (isEditable(focus)) return null;`). Expected
  // failure: a key typed in an input answers a tool.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "ignores each of the four, and still matches on an element that is none of them":
  //   AssertionError: {"tagName":"INPUT"}: expected 'tool.navigate' to be null. Reverted after observing.
  it("ignores each of the four, and still matches on an element that is none of them", () => {
    const editable: FocusLike[] = [
      { tagName: "INPUT" },
      { tagName: "textarea" },
      { tagName: "SELECT" },
      { tagName: "DIV", isContentEditable: true },
    ];
    for (const focus of editable) {
      expect(matchToolKey(key("n"), focus), JSON.stringify(focus)).toBeNull();
      expect(matchToolKey(key("s"), focus), JSON.stringify(focus)).toBeNull();
    }
    expect(matchToolKey(key("n"), { tagName: "DIV", isContentEditable: false })).toBe("tool.navigate");
  });
});

describe("UB10: the four ids milestone 2 adds", () => {
  // RECORDED MUTATION for "UB10 (the four entries)": relabel Zoom to selection as "Zoom to Selection" in `ACTIONS`. Expected failure: the label
  // differs from the approved one.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "have unique ids, the human's labels and no Mod chord, and only the tools have a key":
  //   AssertionError: expected [ 'Navigate', 'Select', …(2) ] to deeply equal [ 'Navigate', 'Select', …(2) ]. Reverted after observing.
  it("have unique ids, the human's labels and no Mod chord, and only the tools have a key", () => {
    const four = ["tool.navigate", "tool.select", "selection.zoomTo", "selection.clear"] as const;
    const ids = ACTIONS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(four.map((id) => actionEntry(id).label)).toEqual(["Navigate", "Select", "Zoom to selection", "Clear selection"]);
    for (const id of four) expect(actionEntry(id).chord, id).toBeNull();
    const keys = ACTIONS.flatMap((entry) => (entry.bareKey === null ? [] : [`${entry.id}:${entry.bareKey.letter}`]));
    expect(keys).toEqual(["tool.navigate:n", "tool.select:s"]);
  });
  // RECORDED MUTATION for "UB10 (the scope words)": give `layer.zoomToLayer` the scope words "the layer" in `ACTIONS`. Expected failure: a second
  // entry declares a scope.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "Zoom to selection declares its scope in the plan's words, and no other entry declares one":
  //   AssertionError: expected [ [ 'layer.zoomToLayer', …(1) ], …(1) ] to deeply equal [ [ 'selection.zoomTo', …(1) ] ]. Reverted after observing.
  it("Zoom to selection declares its scope in the plan's words, and no other entry declares one", () => {
    expect(ACTIONS.flatMap((entry) => (entry.scopeWords === null ? [] : [[entry.id, entry.scopeWords]]))).toEqual([
      ["selection.zoomTo", "Selected, ignoring filter"],
    ]);
  });
});

// RECORDED MUTATION for "UC10": in `matchCommandOpener` match on `event.code === "Slash"` instead of `event.key === "/"`. Expected failure: the Shift+Digit7 row (key "/", code Digit7) no longer matches.
// OBSERVED AT fa6715541ccdef4285503a2b9bd59ec9a44943dc: FAILED -- "UC10: / matches bare, with Shift and on another code; Ctrl, Meta, Alt, repeat, composing and an editable focus do not; Slash with another key does not":
//   AssertionError: expected [ true, true, false, false ] to deeply equal [ true, true, true, true ]
//   (the Shift+Digit7 row is the third). Reverted after observing.
describe("UC10: the bare / opens the command bar", () => {
  it("UC10: / matches bare, with Shift and on another code; Ctrl, Meta, Alt, repeat, composing and an editable focus do not; Slash with another key does not", () => {
    const slash = (over: Partial<KeyEventLike> = {}) => key("/", { code: "Slash", ...over });
    expect([slash(), slash({ shiftKey: true }), slash({ shiftKey: true, code: "Digit7" }), slash({ code: "NumpadDivide" })].map((e) => matchCommandOpener(e, noFocus))).toEqual([true, true, true, true]);
    const ignored: Partial<KeyEventLike>[] = [{ ctrlKey: true }, { metaKey: true }, { altKey: true }, { repeat: true }, { isComposing: true }];
    for (const over of ignored) expect(matchCommandOpener(slash(over), noFocus), JSON.stringify(over)).toBe(false);
    for (const tagName of ["INPUT", "TEXTAREA", "SELECT"]) expect(matchCommandOpener(slash(), { tagName }), tagName).toBe(false);
    expect(matchCommandOpener(slash(), { tagName: "DIV", isContentEditable: true })).toBe(false);
    expect(matchCommandOpener(slash(), { tagName: "BUTTON" })).toBe(true);
    expect(matchCommandOpener(key("a", { code: "Slash" }), noFocus)).toBe(false);
  });
});
