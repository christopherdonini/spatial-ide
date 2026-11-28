// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 4 (J-R1), as Amendments 2 and 15 leave it: the Jobs tab. S-7 shows when nothing is listed;
 * the scan row and each export row show their words (S-8, S-9) and one Cancel; the scan's Cancel calls the one handler it is given; the export's Cancel
 * calls the run's `cancel` once and is disabled and reads Cancelling while the run stands; a false answer shows S-11 and puts Cancel back; no digit shows
 * outside the owner's liveness text. Nothing is mocked: the rows come from the real `jobsFrom`.
 */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isScanInFlight } from "../App";
import type { ScanState } from "../App";
import { EXPORT_JOB_TEXT, jobsFrom, NO_JOBS_TEXT, NOT_CANCELLED_TEXT, SCAN_JOB_TEXT } from "./jobs";
import type { ExportJob } from "./jobs";
import JobsTab from "./JobsTab";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const SCANNING: ScanState = { kind: "delivering", streamHandle: "st_1", rows: 12 };
const IDLE: ScanState = { kind: "idle" };
const LIVENESS = "Filtering — 12 rows so far";

describe("JobsTab (J-R1)", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const show = (scan: ScanState, runs: readonly ExportJob[], liveness: string | null, onCancelScan: () => void = () => {}) =>
    act(() => root.render(<JobsTab jobs={jobsFrom(scan, runs, isScanInFlight)} scanLiveness={liveness} onCancelScan={onCancelScan} />));
  const rows = () => [...container.querySelectorAll(".jobs-row")];
  const cancelOf = (row: Element) => row.querySelector<HTMLButtonElement>("button.jobs-cancel")!;
  const settle = () => act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));

  it("J-R1: S-7 shows when nothing is listed, and then no row", () => {
    show(IDLE, [], null);
    expect(container.querySelector(".jobs-empty")?.textContent).toBe(NO_JOBS_TEXT);
    expect(rows()).toHaveLength(0);
    show(SCANNING, [], null);
    expect(container.textContent).not.toContain(NO_JOBS_TEXT);
  });

  it("J-R1: the scan row shows S-8 and the owner's liveness text when there is one; its Cancel calls the handler once", () => {
    let calls = 0;
    show(SCANNING, [], null, () => void calls++);
    expect(rows()).toHaveLength(1);
    expect(rows()[0].textContent).toContain(SCAN_JOB_TEXT);
    expect(rows()[0].querySelector(".jobs-row-liveness"), "the owner's text is null: nothing added").toBeNull();
    show(SCANNING, [], LIVENESS, () => void calls++);
    expect(rows()[0].querySelector(".jobs-row-liveness")?.textContent).toBe(LIVENESS);
    expect(cancelOf(rows()[0]).textContent).toBe("Cancel");
    act(() => cancelOf(rows()[0]).click());
    expect(calls).toBe(1);
  });

  // RECORDED MUTATION for J-R1: in `JobsTab.tsx` leave the export row's Cancel enabled while it reads Cancelling (drop its `disabled`). Expected failure: the button is not disabled while Cancelling.
  // OBSERVED AT 12f326aa0004fc112a0ecfb37c10d710653f2a9c (2026-11-28): FAILED -- "J-R1: an export row shows S-9; Cancel asks once and is disabled and reads Cancelling while the run stands; the row goes when the run does": AssertionError: Cancel is disabled while Cancelling: expected false to be true. Reverted after observing.
  it("J-R1: an export row shows S-9; Cancel asks once and is disabled and reads Cancelling while the run stands; the row goes when the run does", async () => {
    let calls = 0;
    let answer!: (reached: boolean) => void;
    const runs = [{ id: "export-1" as const, cancel: () => (calls++, new Promise<boolean>((resolve) => (answer = resolve))) }];
    show(IDLE, runs, null);
    expect(rows()).toHaveLength(1);
    expect(rows()[0].textContent).toContain(EXPORT_JOB_TEXT);
    expect(cancelOf(rows()[0]).textContent).toBe("Cancel");
    expect(cancelOf(rows()[0]).disabled).toBe(false);

    act(() => cancelOf(rows()[0]).click());
    expect(calls).toBe(1);
    expect(cancelOf(rows()[0]).textContent).toBe("Cancelling");
    expect(cancelOf(rows()[0]).disabled, "Cancel is disabled while Cancelling").toBe(true);
    act(() => cancelOf(rows()[0]).click());
    expect(calls, "a second click asks nothing").toBe(1);

    answer(true);
    await settle();
    expect(cancelOf(rows()[0]).textContent, "a true answer means only that a token was found: still Cancelling").toBe("Cancelling");
    expect(container.querySelector(".jobs-not-cancelled")).toBeNull();

    show(IDLE, [], null);
    expect(rows(), "the run ended: the row is gone").toHaveLength(0);
    expect(container.querySelector(".jobs-empty")?.textContent).toBe(NO_JOBS_TEXT);
  });

  it("J-R1: a false answer, and a rejection, show S-11 and put Cancel back; the next press asks again", async () => {
    let calls = 0;
    let mode: "false" | "reject" = "false";
    const runs = [{ id: "export-1" as const, cancel: async () => (calls++, mode === "false" ? false : Promise.reject(new Error("the ipc failed"))) }];
    show(IDLE, runs, null);
    act(() => cancelOf(rows()[0]).click());
    await settle();
    expect(rows()[0].querySelector(".jobs-not-cancelled")?.textContent).toBe(NOT_CANCELLED_TEXT);
    expect(cancelOf(rows()[0]).textContent).toBe("Cancel");
    expect(cancelOf(rows()[0]).disabled).toBe(false);

    mode = "reject";
    act(() => cancelOf(rows()[0]).click());
    await settle();
    expect(calls).toBe(2);
    expect(rows()[0].querySelector(".jobs-not-cancelled")?.textContent).toBe(NOT_CANCELLED_TEXT);
    expect(cancelOf(rows()[0]).disabled).toBe(false);
  });

  it("J-R1: no digit shows outside the owner's liveness text, and no percentage, estimate or time", () => {
    const runs = [{ id: "export-1" as const, cancel: async () => true }, { id: "export-2" as const, cancel: async () => true }];
    show(SCANNING, runs, LIVENESS);
    expect(rows()).toHaveLength(3);
    const text = container.textContent ?? "";
    expect(text).toContain(LIVENESS);
    expect(text.replace(LIVENESS, "")).not.toMatch(/[0-9]/);
    expect(text).not.toMatch(/%|ETA|remaining/);
    show(IDLE, runs, null);
    expect(container.textContent).not.toMatch(/[0-9]/);
  });
});
