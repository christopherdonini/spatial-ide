// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import {
  dismissBanner,
  installGlobalErrorHandlers,
  subscribeBanner,
} from "./errorHandlers";

// jsdom does not implement `ErrorEvent`/`PromiseRejectionEvent` construction with a settable
// `error`/`reason`, so a plain `Event` with the property assigned stands in for one -- the handler
// under test only ever reads `event.error` / `event.reason`, and that is indistinguishable from a
// real browser event at that boundary.
function errorEvent(error: unknown): Event {
  return Object.assign(new Event("error"), { error, message: error instanceof Error ? error.message : String(error) });
}

function rejectionEvent(reason: unknown): Event {
  return Object.assign(new Event("unhandledrejection"), { reason });
}

describe("global error handlers (ADR-010 rule 7)", () => {
  beforeEach(() => {
    invokeMock.mockClear();
    dismissBanner();
    installGlobalErrorHandlers();
  });

  it("catches an injected synchronous error: shows a banner and persists to the session log", () => {
    const seen: Array<{ message: string; detail: string } | null> = [];
    const unsubscribe = subscribeBanner((b) => seen.push(b));

    window.dispatchEvent(errorEvent(new Error("injected synchronous failure")));

    const last = seen.at(-1);
    expect(last).not.toBeNull();
    expect(last?.message).toContain("injected synchronous failure");
    expect(invokeMock).toHaveBeenCalledWith(
      "binding_log_session_event",
      expect.objectContaining({ level: "error" })
    );
    unsubscribe();
  });

  it("catches an injected unhandled promise rejection: shows a banner and persists to the session log", () => {
    const seen: Array<{ message: string; detail: string } | null> = [];
    const unsubscribe = subscribeBanner((b) => seen.push(b));

    window.dispatchEvent(rejectionEvent(new Error("injected rejection")));

    const last = seen.at(-1);
    expect(last).not.toBeNull();
    expect(last?.message).toContain("injected rejection");
    expect(invokeMock).toHaveBeenCalledWith(
      "binding_log_session_event",
      expect.objectContaining({ level: "unhandledrejection" })
    );
    unsubscribe();
  });

  it("dismissBanner clears the banner for every subscriber", () => {
    const seen: Array<{ message: string; detail: string } | null> = [];
    const unsubscribe = subscribeBanner((b) => seen.push(b));
    window.dispatchEvent(errorEvent(new Error("x")));
    expect(seen.at(-1)).not.toBeNull();
    dismissBanner();
    expect(seen.at(-1)).toBeNull();
    unsubscribe();
  });
});
