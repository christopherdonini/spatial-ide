// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import {
  __checkForTests,
  __resetForTests,
  begin,
  end,
  setStallHandler,
  WATCHDOG_PHASE_TIMEOUT_MS,
} from "./watchdog";

describe("watchdog (ADR-010 rule 7's BEGIN/END clause)", () => {
  beforeEach(() => {
    invokeMock.mockClear();
    __resetForTests();
    setStallHandler(null);
  });

  it("a phase that ends before the timeout never stalls", () => {
    const stalls: string[] = [];
    setStallHandler((phase) => stalls.push(phase));
    begin("open_dataset");
    end("open_dataset");
    __checkForTests(performance.now() + WATCHDOG_PHASE_TIMEOUT_MS + 1);
    expect(stalls).toEqual([]);
  });

  it("a phase with no matching end() past the declared timeout is named as the stall", () => {
    const stalls: string[] = [];
    setStallHandler((phase) => stalls.push(phase));
    const start = performance.now();
    begin("viewport_query");
    __checkForTests(start + WATCHDOG_PHASE_TIMEOUT_MS + 1);
    expect(stalls).toEqual(["viewport_query"]);
    expect(invokeMock).toHaveBeenCalledWith(
      "binding_log_session_event",
      expect.objectContaining({ level: "watchdog" })
    );
  });

  it("a phase just under the declared timeout does not stall", () => {
    const stalls: string[] = [];
    setStallHandler((phase) => stalls.push(phase));
    const start = performance.now();
    begin("ws-connect");
    __checkForTests(start + WATCHDOG_PHASE_TIMEOUT_MS - 1);
    expect(stalls).toEqual([]);
  });
});
