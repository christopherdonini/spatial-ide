// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import OriginMismatchState from "./OriginMismatchState";
import { recordOriginMismatch } from "./diagnostics/originSelfCheck";

// React 18.3's own `act` (not `react-dom/test-utils`'s deprecated re-export) requires this flag so
// it knows synchronous updates in this file are wrapped, rather than warning on every one.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * `recordOriginMismatch`/the module's own subscriber `Set` are process-lifetime singletons
 * (`originSelfCheck.ts`'s own doc comment: "there is no 'clear' path by design"), so this suite
 * renders a fresh container per test but does not attempt to reset the module state between
 * tests -- each test instead asserts against a payload it itself just recorded, and relies on
 * `recordOriginMismatch` always overwriting (never accumulating) the single current value.
 */
describe("OriginMismatchState (ADR-020 Amendment 1's typed, non-dismissable mismatch state)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders nothing before any mismatch has been recorded", () => {
    act(() => {
      root.render(<OriginMismatchState />);
    });
    expect(container.querySelector(".origin-mismatch-state")).toBeNull();
  });

  it("renders the pinned and actual origins from the event payload verbatim once a mismatch is recorded", () => {
    act(() => {
      root.render(<OriginMismatchState />);
    });
    act(() => {
      recordOriginMismatch({
        kind: "mismatch",
        pinned: "http://localhost:5180",
        actual: "http://tauri.localhost",
      });
    });
    const el = container.querySelector(".origin-mismatch-state");
    expect(el).not.toBeNull();
    expect(el?.textContent).toContain("http://localhost:5180");
    expect(el?.textContent).toContain("http://tauri.localhost");
    expect(el?.textContent).toContain("will refuse");
    // Non-dismissable: no button anywhere in this state (contrast ErrorBanner's Dismiss button).
    expect(el?.querySelector("button")).toBeNull();
  });

  it("a later mismatch replaces the rendered text rather than appending to it", () => {
    act(() => {
      root.render(<OriginMismatchState />);
    });
    act(() => {
      recordOriginMismatch({
        kind: "mismatch",
        pinned: "http://localhost:5180",
        actual: "http://tauri.localhost",
      });
    });
    act(() => {
      recordOriginMismatch({
        kind: "mismatch",
        pinned: "http://localhost:5180",
        actual: "https://tauri.localhost",
      });
    });
    const el = container.querySelector(".origin-mismatch-state");
    expect(el?.textContent).toContain("https://tauri.localhost");
    // "https://tauri.localhost" is NOT a substring of "http://tauri.localhost" (the "s" breaks
    // it) -- if the first mismatch's text had survived alongside the second (append rather than
    // replace), this exact string would still be present.
    expect(el?.textContent).not.toContain("http://tauri.localhost");
  });

  // -- Reviewer S5: the "unverifiable" outcome renders truthfully different text ----------------

  it("renders a distinct, truthful state for an unverifiable read (does not claim the data plane will refuse)", () => {
    act(() => {
      root.render(<OriginMismatchState />);
    });
    act(() => {
      recordOriginMismatch({
        kind: "unverifiable",
        pinned: "http://localhost:5180",
        error: "<unreadable: webview url() failed>",
      });
    });
    const el = container.querySelector(".origin-mismatch-state");
    expect(el).not.toBeNull();
    expect(el?.classList.contains("origin-mismatch-state--unverifiable")).toBe(true);
    expect(el?.textContent).toContain("http://localhost:5180");
    expect(el?.textContent).toContain("could not verify");
    // The truthful distinction this reviewer finding exists for: an unverifiable read must NEVER
    // claim the data plane will refuse -- the pinned origin may still be exactly right.
    expect(el?.textContent).not.toContain("will refuse");
    expect(el?.querySelector("button")).toBeNull();
  });

  it("an unverifiable read and a mismatch render visibly different text for the same pinned origin", () => {
    act(() => {
      root.render(<OriginMismatchState />);
    });
    act(() => {
      recordOriginMismatch({
        kind: "unverifiable",
        pinned: "http://localhost:5180",
        error: "boom",
      });
    });
    const unverifiableText = container.querySelector(".origin-mismatch-state")?.textContent;
    act(() => {
      recordOriginMismatch({
        kind: "mismatch",
        pinned: "http://localhost:5180",
        actual: "http://tauri.localhost",
      });
    });
    const mismatchText = container.querySelector(".origin-mismatch-state")?.textContent;
    expect(unverifiableText).not.toEqual(mismatchText);
  });
});
