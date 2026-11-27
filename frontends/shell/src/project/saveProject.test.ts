// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md section 4, step 1, the three shell rows: what one save sends through the real client, the folder
 * picker and the real saver, and what the owner is told. Only the Tauri boundary (`invoke`) is replaced, so the request is the one the client
 * would hand the host.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { encodeHexF64 } from "../skp/codec";
import { saveProject } from "../skp/client";
import { DEFAULT_STYLE_STATE, toStyleDocument } from "../style/document";
import {
  createProjectSaver,
  FOLDER_HOLDS_PROJECT_NOTICE,
  MARK_WITHHELD_NOTICE,
  NO_CANONICAL_SPELLING_NOTICE,
  notSavedNotice,
  pickProjectFolder,
  SAVED_NOTICE,
  saveTimeText,
  SELECTION_NOTICE,
  type SaveInput,
} from "./saveProject";

const FOLDER = "C:/projects/parcels";
const FILTER = { predicate: "area > 100", dialect: "duckdb-expr/0" };

const input = (more: Partial<SaveInput> = {}): SaveInput => ({
  dataset: "ds_1",
  filter: FILTER,
  clauses: [
    { text: "area > 100", enabled: true },
    { text: "zone = 'r'", enabled: false },
  ],
  style: DEFAULT_STYLE_STATE,
  view: { centre: [2_600_050.5, 1_200_050.25], zoom: 7.5 },
  selectionCount: 0,
  ...more,
});

const newSaver = () => createProjectSaver({ pickFolder: pickProjectFolder, save: saveProject });

/** The set clock of every case here, built from local components so that no case depends on the machine's time zone. */
const AT = new Date(2026, 10, 26, 7, 8, 9);
/** A save's first line at `when`: the notice's words, then the time in brackets (ADV-2026-11-26-25 item 1). */
const lineAt = (notice: string, when: Date = AT): string => `${notice} (${saveTimeText(when)})`;
/** The time in brackets that ends `line`: of the form `HH:MM:SS`, and its three fields, read as numbers, are the set clock's local getters. No literal clock string is asserted. */
function expectTimeOf(line: string | undefined, when: Date): void {
  const shown = / \(([^)]*)\)$/.exec(line ?? "")?.[1] ?? "";
  expect(shown, "the time in brackets ends the line").toMatch(/^\d{2}:\d{2}:\d{2}$/);
  expect(shown.split(":").map(Number)).toEqual([when.getHours(), when.getMinutes(), when.getSeconds()]);
}

/** The commands the host was handed, in order, with their `request` objects. */
const sent = (): { command: string; request: Record<string, unknown> | undefined }[] =>
  invokeMock.mock.calls.map((c) => ({ command: c[0] as string, request: (c[1] as { request?: Record<string, unknown> } | undefined)?.request }));

beforeEach(() => {
  invokeMock.mockReset().mockImplementation(async (command: string) => {
    if (command === "binding_pick_project_folder") return FOLDER;
    return { project: "spatial://project/00000000000000000000000000000001", history_mark: "written", project_relative: "carried" };
  });
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(AT);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Save project: what the shell sends (B2 piece 1c, section 2.8)", () => {
  // RECORDED MUTATION for "save sends": in `createProjectSaver` (project/saveProject.ts) never add the dataset to `saved` after a confirmed save.
  // Expected failure: the second save asks the picker again and sends the folder a second time.
  it("save sends save_project with the version, the folder once, and the workspace", async () => {
    const saver = newSaver();
    expect(await saver.save(input())).toEqual([lineAt(SAVED_NOTICE)]);
    expect(await saver.save(input({ view: { centre: [1, 2], zoom: 3 } }))).toEqual([lineAt(SAVED_NOTICE)]);

    const calls = sent();
    expect(calls.map((c) => c.command), "the picker once, then the save twice").toEqual(["binding_pick_project_folder", "save_project", "save_project"]);
    expect(calls[1].request).toEqual({
      skp: "skp/0.14",
      dataset: "ds_1",
      folder: FOLDER,
      workspace: {
        filter: FILTER,
        clauses: [
          { text: "area > 100", enabled: true },
          { text: "zone = 'r'", enabled: false },
        ],
        style: toStyleDocument(DEFAULT_STYLE_STATE),
        view: { centre: [encodeHexF64(2_600_050.5), encodeHexF64(1_200_050.25)], zoom: encodeHexF64(7.5) },
      },
    });
    expect(calls[2].request?.folder, "the folder key is present, and null after the first save").toBeNull();
    expect(Object.keys(calls[2].request ?? {})).toContain("folder");
    expect((calls[2].request?.workspace as { view: unknown }).view, "every save sends the workspace").toEqual({
      centre: [encodeHexF64(1), encodeHexF64(2)],
      zoom: encodeHexF64(3),
    });
  });

  // RECORDED MUTATION for "selection notice": in `createProjectSaver` drop `afterwards` from the success return. Expected failure: the notices are the saved notice alone.
  it("a click selection at save shows the selection notice", async () => {
    const saver = newSaver();
    expect(await saver.save(input({ selectionCount: 3 }))).toEqual([lineAt(SAVED_NOTICE), SELECTION_NOTICE]);
    expect(await saver.save(input({ selectionCount: 0 })), "none standing, none shown").toEqual([lineAt(SAVED_NOTICE)]);
    const request = sent().find((c) => c.command === "save_project")?.request;
    expect(JSON.stringify(request), "the selection is not in the file").not.toContain("selection");
  });

  // RECORDED MUTATION for SH-9: in `createProjectSaver` (project/saveProject.ts) S18's condition becomes `!== "carried"`. Expected failure: the
  // `outside` reply shows S18 after the saved notice.
  it("a reply naming no canonical spelling shows S18 after the saved notice, and no other judgment shows it", async () => {
    const replyWith = (history_mark: string, project_relative: string) =>
      invokeMock.mockImplementation(async (command: string) => {
        if (command === "binding_pick_project_folder") return FOLDER;
        return { project: "spatial://project/00000000000000000000000000000001", history_mark, project_relative };
      });
    const saver = newSaver();

    replyWith("written", "no-canonical-spelling");
    expect(await saver.save(input())).toEqual([lineAt(SAVED_NOTICE), NO_CANONICAL_SPELLING_NOTICE]);
    replyWith("withheld", "no-canonical-spelling");
    expect(await saver.save(input({ selectionCount: 2 })), "after S5, before S6").toEqual([
      lineAt(SAVED_NOTICE),
      MARK_WITHHELD_NOTICE,
      NO_CANONICAL_SPELLING_NOTICE,
      SELECTION_NOTICE,
    ]);
    for (const judgment of ["carried", "outside"]) {
      replyWith("written", judgment);
      expect(await saver.save(input()), `${judgment} shows no S18`).toEqual([lineAt(SAVED_NOTICE)]);
    }
  });

  // RECORDED MUTATION for "refused save": in `createProjectSaver` return `[SAVED_NOTICE]` from the catch arm of the save. Expected failure: the refusal is swallowed.
  it("a refused save shows the owner's notice with the kernel's message", async () => {
    invokeMock.mockImplementation(async (command: string) => {
      if (command === "binding_pick_project_folder") return FOLDER;
      throw { code: "skp.project_save_failed", message: "the folder could not be written", fields: {} };
    });
    const saver = newSaver();
    expect(await saver.save(input())).toEqual([lineAt(notSavedNotice("the folder could not be written"))]);

    invokeMock.mockImplementation(async (command: string) => {
      if (command === "binding_pick_project_folder") return FOLDER;
      throw { code: "skp.project_folder_holds_project", message: "the folder holds a project", fields: {} };
    });
    expect(await saver.save(input()), "a refusal leaves the next save to ask for the folder again").toEqual([lineAt(FOLDER_HOLDS_PROJECT_NOTICE)]);
    expect(sent().filter((c) => c.command === "binding_pick_project_folder")).toHaveLength(2);
  });

  // RECORDED MUTATION for T-16: in `createProjectSaver` (project/saveProject.ts) O-9's entry is removed from the saved list. Expected failure: the list
  // is the saved notice alone.
  it("T-16: a through-link save shows its notice", async () => {
    const { THROUGH_LINK_NOTICE } = await import("./saveProject");
    invokeMock.mockImplementation(async (command: string) => {
      if (command === "binding_pick_project_folder") return FOLDER;
      return { project: "spatial://project/00000000000000000000000000000001", history_mark: "written", project_relative: "through-link" };
    });
    expect(await newSaver().save(input()), "the saved notice, then O-9's place, and nothing after").toStrictEqual([lineAt(SAVED_NOTICE), THROUGH_LINK_NOTICE]);
  });

  it("SP-T1: two confirmed saves of one open answered saved lines that differ, each carrying its own save's fact", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      const saver = newSaver();
      const [clock1, clock2] = [new Date(2026, 10, 26, 23, 4, 5), new Date(2026, 10, 26, 23, 4, 7)];
      vi.setSystemTime(clock1);
      const first = await saver.save(input());
      vi.setSystemTime(clock2);
      const second = await saver.save(input());
      expect(first?.[0], "the two saved lines differ").not.toBe(second?.[0]);
      expect(first?.[0], "each line is its own save's: the saved notice, then its time").toBe(lineAt(SAVED_NOTICE, clock1));
      expect(second?.[0]).toBe(lineAt(SAVED_NOTICE, clock2));
      expectTimeOf(first?.[0], clock1);
      expectTimeOf(second?.[0], clock2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("SP-T2: two refused saves with the same kernel message, at two set seconds, answered first lines that differ", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      invokeMock.mockImplementation(async (command: string) => {
        if (command === "binding_pick_project_folder") return FOLDER;
        throw { code: "skp.project_save_failed", message: "the folder could not be written", fields: {} };
      });
      const saver = newSaver();
      const [clock1, clock2, clock3] = [new Date(2026, 10, 26, 9, 4, 5), new Date(2026, 10, 26, 9, 4, 7), new Date(2026, 10, 26, 9, 4, 9)];
      vi.setSystemTime(clock1);
      const first = await saver.save(input());
      vi.setSystemTime(clock2);
      const second = await saver.save(input());
      expect(first?.[0], "the two not-saved lines differ").not.toBe(second?.[0]);
      expect(first?.[0]).toBe(lineAt(notSavedNotice("the folder could not be written"), clock1));
      expect(second?.[0]).toBe(lineAt(notSavedNotice("the folder could not be written"), clock2));
      expectTimeOf(first?.[0], clock1);
      expectTimeOf(second?.[0], clock2);

      // A picker that throws answers its own first line, with the time at its set clock.
      invokeMock.mockImplementation(async (command: string) => {
        if (command === "binding_pick_project_folder") throw new Error("the folder picker failed");
        return {};
      });
      vi.setSystemTime(clock3);
      const third = await saver.save(input());
      expect(third?.[0]).toBe(lineAt(notSavedNotice("the folder picker failed"), clock3));
      expectTimeOf(third?.[0], clock3);
    } finally {
      vi.useRealTimers();
    }
  });
});
