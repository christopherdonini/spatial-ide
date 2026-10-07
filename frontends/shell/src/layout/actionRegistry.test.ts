// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { ACTIONS, ariaKeyShortcuts, matchChord, platformOf, shortcutLabel } from "./actionRegistry";
import type { KeyEventLike, Platform } from "./actionRegistry";

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
    expect(matchChord(ctrl("k"), "other")).toBeNull();
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
  it("holds exactly the three toggles and Zoom to layer (question round 66, item 2)", () => {
    expect(ACTIONS.map((entry) => entry.id).sort()).toEqual([
      "layer.zoomToLayer",
      "layout.toggleActivity",
      "layout.toggleInspector",
      "layout.toggleLayers",
    ]);
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
