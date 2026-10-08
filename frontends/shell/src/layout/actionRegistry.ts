// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The action registry, minimal (SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §2.3 (c), plan seam 1;
 * question round 66, item 2: the three toggles and Zoom to layer only -- open and export join in
 * milestone 3). Static data plus one pure matcher. **This file is the one place the shell reads the
 * platform** (§2.10, §8 item 12): `currentPlatform` below.
 *
 * Callers: `StudioLayout`'s one `keydown` listener on `window` (via `matchChord`), the three toggle
 * buttons in the top bar and the Layers row's button (each by id).
 */

export type ActionId = "layout.toggleLayers" | "layout.toggleInspector" | "layout.toggleActivity" | "layer.zoomToLayer";

/** A chord is the modifier (Mod) plus one letter. `letter` is the Latin letter matched on
 * `event.key`; `code` is the physical key matched instead when `event.key` is not a Latin letter (a
 * non-Latin layout). */
export interface Chord {
  readonly letter: string;
  readonly code: string;
}

export interface ActionEntry {
  readonly id: ActionId;
  readonly label: string;
  readonly chord: Chord | null;
}

export const ACTIONS: readonly ActionEntry[] = [
  { id: "layout.toggleLayers", label: "Layers", chord: { letter: "b", code: "KeyB" } },
  { id: "layout.toggleInspector", label: "Inspector", chord: { letter: "i", code: "KeyI" } },
  { id: "layout.toggleActivity", label: "Activity", chord: { letter: "j", code: "KeyJ" } },
  { id: "layer.zoomToLayer", label: "Zoom to layer", chord: null },
];

export type Platform = "mac" | "other";

/** Mac-family platform strings (`navigator.platform` on macOS and iOS-family WebKit). */
export function platformOf(source: { readonly platform?: string; readonly userAgent?: string }): Platform {
  const platform = source.platform ?? "";
  if (/^(Mac|iPhone|iPad|iPod)/.test(platform)) return "mac";
  if (platform === "" && /Mac OS X|Macintosh/.test(source.userAgent ?? "")) return "mac";
  return "other";
}

/** The platform this window runs on: the shell's one platform read. */
export function currentPlatform(): Platform {
  return typeof navigator === "undefined" ? "other" : platformOf(navigator);
}

/** The slice of a `KeyboardEvent` the matcher reads. */
export interface KeyEventLike {
  readonly key: string;
  readonly code: string;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly altKey: boolean;
  readonly shiftKey: boolean;
  readonly repeat: boolean;
  readonly isComposing: boolean;
}

/**
 * The id of the action `event` is the chord of, or `null`.
 * - Mod is Meta on macOS and Ctrl elsewhere, and must be down with Alt, Shift and the other of
 *   Ctrl and Meta up: AltGr reports Ctrl+Alt, so it never matches.
 * - `event.repeat` and `event.isComposing` are ignored (a held key toggles once; an IME composition
 *   is never a shortcut).
 * - The letter matches on `event.key`, case-insensitively; when `event.key` is not a Latin letter,
 *   on `event.code`.
 */
export function matchChord(event: KeyEventLike, platform: Platform): ActionId | null {
  if (event.repeat || event.isComposing) return null;
  const modDown = platform === "mac" ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
  if (!modDown || event.altKey || event.shiftKey) return null;
  const isLatinLetter = /^[A-Za-z]$/.test(event.key);
  for (const entry of ACTIONS) {
    const chord = entry.chord;
    if (chord === null) continue;
    if (isLatinLetter ? event.key.toLowerCase() === chord.letter : event.code === chord.code) return entry.id;
  }
  return null;
}

/** The chord as the label shows it: `Ctrl+B`, or `⌘B` on macOS. */
export function shortcutLabel(chord: Chord, platform: Platform): string {
  const letter = chord.letter.toUpperCase();
  return platform === "mac" ? `⌘${letter}` : `Ctrl+${letter}`;
}

/** The chord as `aria-keyshortcuts` writes it. */
export function ariaKeyShortcuts(chord: Chord, platform: Platform): string {
  return `${platform === "mac" ? "Meta" : "Control"}+${chord.letter.toUpperCase()}`;
}
