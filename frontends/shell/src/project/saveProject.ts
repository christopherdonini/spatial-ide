// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2 piece 1c, Save project (B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md section 2.8): the shell's half of one save. Client only: this file
 * gathers what the shell holds into the `workspace` member, asks for a folder at an open's first save, sends `save_project`, and turns what
 * comes back into the owner's notices. The kernel decides everything else (what is written, where, and whether the save is refused), and
 * nothing here reads a path, a file or the history.
 *
 * - **The folder is sent once.** An open's first save asks the native picker (`binding_pick_project_folder`) and sends the folder it gave;
 *   once a save of that open has been confirmed, every later one sends `folder: null`, and the picker is not opened. A save that was refused,
 *   or whose picker was cancelled, leaves the next save to ask again.
 * - **The view is the canvas's.** `view` comes from `WorkingCanvasHandle.currentView`; with none, nothing is sent (`NO_VIEW_NOTICE`).
 * - **A selection made by clicking is not saved.** The workspace has no member for it; a save with one standing says so (`SELECTION_NOTICE`).
 * - **Every string here is a P6 placeholder**, marked as the shell marks them. None is the human's wording.
 */

import { invoke } from "@tauri-apps/api/core";

import { encodeHexF64 } from "../skp/codec";
import type { Filter, ProjectWorkspace, SaveProjectResponse } from "../skp/types";
import { toStyleDocument } from "../style/document";
import type { StyleState } from "../style/document";

/** The OS folder picker for the first save. **Not SKP**: `save_project` takes a folder already chosen. `null` means the operator cancelled. */
export function pickProjectFolder(): Promise<string | null> {
  return invoke<string | null>("binding_pick_project_folder");
}

/** S3: the saved notice. */
export const SAVED_NOTICE = "[P6 placeholder] The project was saved.";
/** S5: the project file was written and the session history took no `saved-here` mark (`history_mark: "withheld"`). */
export const MARK_WITHHELD_NOTICE = "[P6 placeholder] The session history holds no saved-here mark for this save.";
/** S6: the selection notice at save. */
export const SELECTION_NOTICE = "[P6 placeholder] A selection made by clicking is not saved.";
/** S7: the first save went to a folder that already holds a project. */
export const FOLDER_HOLDS_PROJECT_NOTICE = "[P6 placeholder] The folder already holds a project.";
/** S23: the not-saved notice for a save with no view from the canvas. It states the consequence only. */
export const NO_VIEW_NOTICE = "[P6 placeholder] The project was not saved.";
/** S4: the not-saved notice, with the kernel's message. */
export const notSavedNotice = (message: string): string => `[P6 placeholder] The project was not saved: ${message}`;

/** The code of the kernel's refusal of a first save into a folder that holds a project. */
const FOLDER_HOLDS_PROJECT_CODE = "skp.project_folder_holds_project";

/** What one save is made from. `clauses` and `filter` are the view's; `view` is the canvas's, or `null` when it has none. */
export interface SaveInput {
  readonly dataset: string;
  readonly filter: Filter | null;
  readonly clauses: readonly { readonly text: string; readonly enabled: boolean }[];
  readonly style: StyleState;
  readonly view: { readonly centre: readonly [number, number]; readonly zoom: number } | null;
  /** How many features the view's click selection holds. */
  readonly selectionCount: number;
}

export interface ProjectSaverDeps {
  /** `pickProjectFolder`: `null` is a cancel. */
  readonly pickFolder: () => Promise<string | null>;
  /** `skp/client.ts`'s `saveProject`. */
  readonly save: (dataset: string, folder: string | null, workspace: ProjectWorkspace) => Promise<SaveProjectResponse>;
}

export interface ProjectSaver {
  /** One save. Answers the notices to show (none when the operator cancelled the folder picker), or `null` when a save is already in flight, which this call did not start. */
  save(input: SaveInput): Promise<readonly string[] | null>;
}

/** The kernel's own code and message for a typed refusal, the error's message otherwise. */
function failureOf(error: unknown): { code: string | null; message: string } {
  const skpError = (error as { skpError?: { code?: unknown; message?: unknown } } | null)?.skpError;
  if (typeof skpError?.message === "string") {
    return { code: typeof skpError.code === "string" ? skpError.code : null, message: skpError.message };
  }
  return { code: null, message: error instanceof Error ? error.message : String(error) };
}

/** The `workspace` member the shell holds: the view's filter and clauses, the style as ADR-017 section 5a's document, and the canvas's view as `HexF64`. */
function workspaceOf(input: SaveInput, view: NonNullable<SaveInput["view"]>): ProjectWorkspace {
  return {
    filter: input.filter,
    clauses: input.clauses.map((clause) => ({ text: clause.text, enabled: clause.enabled })),
    style: { ...toStyleDocument(input.style) },
    view: { centre: [encodeHexF64(view.centre[0]), encodeHexF64(view.centre[1])], zoom: encodeHexF64(view.zoom) },
  };
}

export function createProjectSaver(deps: ProjectSaverDeps): ProjectSaver {
  /** The datasets with a confirmed save: their folder has been sent, and the kernel keeps it for the open. */
  const saved = new Set<string>();
  let inFlight = false;

  return {
    async save(input) {
      if (inFlight) return null;
      inFlight = true;
      try {
        if (input.view === null) return [NO_VIEW_NOTICE];
        const afterwards = input.selectionCount > 0 ? [SELECTION_NOTICE] : [];
        let folder: string | null = null;
        if (!saved.has(input.dataset)) {
          try {
            folder = await deps.pickFolder();
          } catch (error) {
            return [notSavedNotice(failureOf(error).message)];
          }
          if (folder === null) return [];
        }
        try {
          const response = await deps.save(input.dataset, folder, workspaceOf(input, input.view));
          saved.add(input.dataset);
          return [SAVED_NOTICE, ...(response.history_mark === "withheld" ? [MARK_WITHHELD_NOTICE] : []), ...afterwards];
        } catch (error) {
          const failure = failureOf(error);
          return [failure.code === FOLDER_HOLDS_PROJECT_CODE ? FOLDER_HOLDS_PROJECT_NOTICE : notSavedNotice(failure.message), ...afterwards];
        }
      } finally {
        inFlight = false;
      }
    },
  };
}
