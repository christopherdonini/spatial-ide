// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md section 4, step 1, the three shell rows: what one save sends through the real client, the folder
 * picker and the real saver, and what the owner is told. Only the Tauri boundary (`invoke`) is replaced, so the request is the one the client
 * would hand the host.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { encodeHexF64 } from "../skp/codec";
import { saveProject } from "../skp/client";
import { DEFAULT_STYLE_STATE, toStyleDocument } from "../style/document";
import { createProjectSaver, FOLDER_HOLDS_PROJECT_NOTICE, notSavedNotice, pickProjectFolder, SAVED_NOTICE, SELECTION_NOTICE, type SaveInput } from "./saveProject";

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

/** The commands the host was handed, in order, with their `request` objects. */
const sent = (): { command: string; request: Record<string, unknown> | undefined }[] =>
  invokeMock.mock.calls.map((c) => ({ command: c[0] as string, request: (c[1] as { request?: Record<string, unknown> } | undefined)?.request }));

beforeEach(() => {
  invokeMock.mockReset().mockImplementation(async (command: string) => {
    if (command === "binding_pick_project_folder") return FOLDER;
    return { project: "spatial://project/00000000000000000000000000000001", history_mark: "written" };
  });
});

describe("Save project: what the shell sends (B2 piece 1c, section 2.8)", () => {
  // RECORDED MUTATION for "save sends": in `createProjectSaver` (project/saveProject.ts) never add the dataset to `saved` after a confirmed save.
  // Expected failure: the second save asks the picker again and sends the folder a second time.
  it("save sends save_project with the version, the folder once, and the workspace", async () => {
    const saver = newSaver();
    expect(await saver.save(input())).toEqual([SAVED_NOTICE]);
    expect(await saver.save(input({ view: { centre: [1, 2], zoom: 3 } }))).toEqual([SAVED_NOTICE]);

    const calls = sent();
    expect(calls.map((c) => c.command), "the picker once, then the save twice").toEqual(["binding_pick_project_folder", "save_project", "save_project"]);
    expect(calls[1].request).toEqual({
      skp: "skp/0.13",
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
    expect(await saver.save(input({ selectionCount: 3 }))).toEqual([SAVED_NOTICE, SELECTION_NOTICE]);
    expect(await saver.save(input({ selectionCount: 0 })), "none standing, none shown").toEqual([SAVED_NOTICE]);
    const request = sent().find((c) => c.command === "save_project")?.request;
    expect(JSON.stringify(request), "the selection is not in the file").not.toContain("selection");
  });

  // RECORDED MUTATION for "refused save": in `createProjectSaver` return `[SAVED_NOTICE]` from the catch arm of the save. Expected failure: the refusal is swallowed.
  it("a refused save shows the owner's notice with the kernel's message", async () => {
    invokeMock.mockImplementation(async (command: string) => {
      if (command === "binding_pick_project_folder") return FOLDER;
      throw { code: "skp.project_save_failed", message: "the folder could not be written", fields: {} };
    });
    const saver = newSaver();
    expect(await saver.save(input())).toEqual([notSavedNotice("the folder could not be written")]);

    invokeMock.mockImplementation(async (command: string) => {
      if (command === "binding_pick_project_folder") return FOLDER;
      throw { code: "skp.project_folder_holds_project", message: "the folder holds a project", fields: {} };
    });
    expect(await saver.save(input()), "a refusal leaves the next save to ask for the folder again").toEqual([FOLDER_HOLDS_PROJECT_NOTICE]);
    expect(sent().filter((c) => c.command === "binding_pick_project_folder")).toHaveLength(2);
  });
});
