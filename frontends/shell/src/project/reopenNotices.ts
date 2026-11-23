// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2 piece 1c, Amendment 54 item 12: the owner's places for a reopen, and the builders that fill their slots. Every text is the advisor's wording
 * under the human's delegation of 2026-11-13, from ADV-2026-11-20-05 item 2, or for W-STYLE and O-18 from ADV-2026-11-20-09 item 2, copied from
 * those rulings by script, and ADV-2026-11-21-14 item 2 takes them as the app's words. S8's words are the advisor's by the human's approval of ADV-2026-11-21-12, filed at
 * state/directives/2026-11-21-the-humans-message-four-drafts-approved-s8s-words-to-the-advisor-the-ci-change-v0-2-without-the-console-and-mint-window-nodes-the-stop-alarms-check-d.md. A text states the owner's consequence and repeats no
 * engine or kernel fact: engine messages state engine facts, owners state consequences.
 *
 * - **A builder takes its slot values as given.** None of them is bounded here. The bound on text read from a file (Amendment 54 item 5 (j))
 *   is applied by the caller to `{file_name}`, `{column}`, `basis` and every refusal's message and fields before they reach a builder.
 * - **Which place shows where is the caller's routing**, not this file's (ADV-2026-11-20-05 item 4): `reopenRefusalPlace`, `lineagePlaces`
 *   (Amendment 55's table) and `reopenApply` in `project/openProject.ts`.
 * - **Every export has its product caller** there, or in the panel's question and re-link (`admission/AdmissionPanel.tsx`).
 */

import type { AdmissionChange, LineageRefusal, ObservedChange } from "../skp/types";

/** S8: the question a reopen asks when the machine remembers the project in another folder. */
export const QUESTION_TEXT = "This machine remembers this project in another folder. Is the project in this folder a copy, or the same project? A copy gets a new identity, written to the project file in this folder, and its data links become its own. The same project: this folder is remembered for it, and the question is not asked here again.";
/** S8, the first choice (the answer `copy`). */
export const QUESTION_COPY = "A copy";
/** S8, the second choice (the answer `same`). */
export const QUESTION_SAME = "The same project";
/** S8, the third choice, which ends the run. */
export const QUESTION_CANCEL = "Do not open";

/** S9-own: shown with `skp.project_open_elsewhere` when the refusal's `project` is the identity this window holds. */
export const OPEN_ELSEWHERE_OWN_NOTICE = "It is the project open in this window, which stays as it is.";
/** S9-other: shown with the same code for any other holder. It promises no time and does not say where the project is open. */
export const OPEN_ELSEWHERE_OTHER_NOTICE = "The project was not opened in this window. Close it where it is open, then try again.";

const CHANGED_FILE = "The data differs from what the project recorded when it was saved.{parts} The project was opened on the data as it is now.";
/**
 * S12, after a re-link. Its words are the advisor's under the human's delegation of 2026-11-13, from ADV-2026-11-22-44 item 2, and not the human's. The last sentence is true for both
 * routes to a re-link: the data file not found where this machine recorded it, and a refusal at the place the project file records (`relinkOffer` in `admission/AdmissionPanel.tsx`). The
 * open is on the file chosen, and its place is recorded when the project is saved. The case a gate gave as not ordinary use: a save that is refused records nothing
 * (`SaveFailure::LineageNotKept`, KNOWN-LIMITATIONS item 71).
 */
const RELINKED_FILE = "The file you chose differs from what the project recorded when it was saved.{parts} The project was opened on the file you chose, and it records that file's place when you save it.";
const FILE_PART = " In the file: {observed}.";
const ADMISSION_PART = " In its admission: {admission}.";

/** The wire's own words of a `check`, as it came. */
export interface CheckWords {
  readonly observed: readonly ObservedChange[];
  readonly admission: readonly AdmissionChange[];
}

/** `{parts}`: the file's part when `observed` is not empty, then the admission's part when `admission` is not empty; each list joined by a comma and a space. */
function partsOf(check: CheckWords): string {
  const file = check.observed.length > 0 ? FILE_PART.replace("{observed}", () => check.observed.join(", ")) : "";
  const admission = check.admission.length > 0 ? ADMISSION_PART.replace("{admission}", () => check.admission.join(", ")) : "";
  return file + admission;
}

/** S10: the data differs from what the project recorded, after a reopen without a re-link. */
export function changedFileNotice(check: CheckWords): string {
  return CHANGED_FILE.replace("{parts}", () => partsOf(check));
}

/** S12: the same, after a re-link. */
export function relinkedFileNotice(check: CheckWords): string {
  return RELINKED_FILE.replace("{parts}", () => partsOf(check));
}

const NOT_FOUND = "The project's data file was not found where this machine recorded it: {file_name}. Choose the file to re-link it.";
const NOT_FOUND_NONE = "This machine records no location for the project's data. Choose the file to re-link it.";
/** S11, the choice: opens the file picker for a re-link. */
export const RELINK_CHOICE = "Choose the data file…";

/** S11 (S11-none when `fileName` is `null`): the data file was not found, or no location is recorded for it. */
export function fileNotFoundNotice(fileName: string | null): string {
  return fileName === null ? NOT_FOUND_NONE : NOT_FOUND.replace("{file_name}", () => fileName);
}

/** S16: a history file of this project is not the one the project file records. */
export const LINEAGE_NOT_RECORDED_NOTICE = "A history file found for this project, in its folder or on this machine, is not the one the project file records. It was not read as this project's history.";
/** S17: the project file records a history this version does not keep. */
export const LINEAGE_NOT_KEPT_NOTICE = "The project file records a history, which this version does not keep. A save of this project will be refused.";
const LINEAGE_FILE_REFUSED = "A history file of this project was refused: {reason}.";

/** `{reason}`: the wire's word, followed by `, line ` and the number where the refusal carries a line. */
function reasonOf(refusal: LineageRefusal): string {
  return "line" in refusal && refusal.line !== null ? `${refusal.reason}, line ${refusal.line}` : refusal.reason;
}

/** S17's refused line, for one refused history file. It shows before S17, once for each refused file. */
export function lineageFileRefusedNotice(refusal: LineageRefusal): string {
  return LINEAGE_FILE_REFUSED.replace("{reason}", () => reasonOf(refusal));
}

const VIEW_NOT_APPLIED = "The saved view was not applied: it was saved in another coordinate space than the one the data is in now. The view was fitted to the data instead.";

/** S19: the saved view was saved in another coordinate space and was not applied. `basis` is shown after it, as given. */
export function viewNotAppliedNotice(basis: string): string {
  return `${VIEW_NOT_APPLIED} ${basis}`;
}

/** S20: shown with `skp.project_known_folders_full`; its fields show as the refusal block shows them. */
export const KNOWN_FOLDERS_FULL_NOTICE = "The project was not opened in this window. The folders this machine remembers for it are unchanged.";
/** S21: shown with `skp.project_machine_record_refused`; its fields show as the refusal block shows them. */
export const MACHINE_RECORD_REFUSED_NOTICE = "The project was not opened in this window. The record was left as it is.";
/** R-ENG: beside every `engine.*` refusal at a reopen but `engine.cancelled`. */
export const ENGINE_REFUSAL_NOTICE = "The project was not opened in this window. The claims this refusal names are the ones the project file recorded for the data. None was typed here.";
/** R-CODE: beside a reopen refusal that has no line of its own. */
export const REOPEN_REFUSAL_NOTICE = "The project was not opened in this window.";
/** R-CODE, the data's locator: replaces R-CODE for `skp.project_target_unresolvable` when the refusal carries a `locator` field. It is also the owner place that `relinkOffer` in `admission/AdmissionPanel.tsx` reads to offer `RELINK_CHOICE` beside the refusal. */
export const REOPEN_LOCATOR_REFUSAL_NOTICE = "The project was not opened in this window. If its data file was moved or renamed, put it back where the project recorded it and open the project again, or choose the file where it is now. The project records the new place when you save it.";
/** S-PANIC: shown with `skp.open_project_panicked`. It promises no free lock. */
export const OPEN_PANICKED_NOTICE = "The open failed inside the application, and this window did not receive the project. The project may stay held until the application is closed.";

const WORKSPACE_TEXT = "Saved text holds characters that do not show, or that change the direction of text, in: {members}. It was applied as saved, and what you see of it may not be all of it.";

/** W-TEXT: saved text holds characters that do not show or that change the direction of text. `members` are one or more of `filter`, `filter clauses` and `style`. */
export function workspaceTextNotice(members: readonly string[]): string {
  return WORKSPACE_TEXT.replace("{members}", () => members.join(", "));
}

const COLOUR_BY_NOT_RESTORED = "Colour by was not restored: the data does not offer the column {column} for it now. The rest of the saved style was applied. A save now replaces the saved style with the one shown.";

/** O-18: a Colour by was not restored because the data does not offer its column. `column` is shown as given. */
export function colourByNotRestoredNotice(column: string): string {
  return COLOUR_BY_NOT_RESTORED.replace("{column}", () => column);
}

/** W-STYLE (Amendment 57 item 1): the saved style was not applied, because the shell's reader answers with none for it, and the default is shown. It shows no text of the file. */
export const STYLE_NOT_APPLIED_NOTICE = "The saved style was not applied: this version cannot show it. The default style is shown. A save now replaces the saved style with the one shown.";
