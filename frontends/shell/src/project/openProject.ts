// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2 piece 1c, Amendment 54 item 5 (b) to (l): the shell's half of a reopen. Client only: the kernel reads the project file, the machine store
 * and the data, and decides; this file turns its one reply into an admission outcome and the owner's places, and changes nothing it reads.
 *
 * - **The reopen's `admit`** (`admitProject`) is what `runAdmitPath` (`admission/AdmissionPanel.tsx`) runs for a reopen, in place of
 *   `admitDataset`: `open_project` and then `describe` (section 2.8). It never calls `open_dataset`. A `question` or a `not_found` ends the run
 *   (O-14); the panel re-enters the run with the answer, or with the re-link and the answer the run already gave. A `describe` that fails after
 *   `opened` first sends `close_dataset` for the opened handle, and the failure goes on when the close settles or once
 *   `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed, whichever is first (`admission/admitDataset.ts`'s `describeOpened`).
 * - **Text from a file is bounded** (item 5 (j)) by `project/shownText.ts` here, before it reaches a place or the log: every refusal's message and
 *   fields, `file_name`, `basis` and O-18's column. The workspace's own text is not (item 5 (k)): it applies whole, and W-TEXT names the member.
 * - **The refusal's owner place** (item 5 (g); ADV-2026-11-20-05 item 4) is chosen here from the code alone, and S9's two places from the
 *   refusal's `project` against the identity this window holds. The refusal itself shows in the existing block, with no remediation form.
 * - **One log line per refusal** (item 5 (l)), the code and the bounded message, beside `admitDataset`'s `admission-refused` line.
 */

import { describeOpened, type AdmissionOutcome, type AdmitOptions } from "../admission/admitDataset";
import { fieldValue, formatRefusal, type FormattedRefusal } from "../admission/formatRefusal";
import { logSessionEvent } from "../diagnostics/log";
import { openProject, SkpCallError } from "../skp/client";
import { decodeHexF64 } from "../skp/codec";
import type { LineageRefusal, ProjectWorkspace, ReopenCheck, ReopenLineage, ReopenView } from "../skp/types";
import { DEFAULT_STYLE_STATE, readStyleDocument, type StyleState } from "../style/document";
import {
  changedFileNotice,
  colourByNotRestoredNotice,
  ENGINE_REFUSAL_NOTICE,
  KNOWN_FOLDERS_FULL_NOTICE,
  LINEAGE_NOT_KEPT_NOTICE,
  LINEAGE_NOT_RECORDED_NOTICE,
  lineageFileRefusedNotice,
  MACHINE_RECORD_REFUSED_NOTICE,
  OPEN_ELSEWHERE_OTHER_NOTICE,
  OPEN_ELSEWHERE_OWN_NOTICE,
  OPEN_PANICKED_NOTICE,
  relinkedFileNotice,
  REOPEN_LOCATOR_REFUSAL_NOTICE,
  REOPEN_REFUSAL_NOTICE,
  STYLE_NOT_APPLIED_NOTICE,
  viewNotAppliedNotice,
  workspaceTextNotice,
} from "./reopenNotices";
import { holdsHiddenText, shownRefusal, shownText } from "./shownText";

/** What an `opened` reply gives beyond the admission: App's reopen handler applies it. `relinked` is whether the call carried a `relink`. */
export interface Reopened {
  readonly project: string;
  readonly workspace: ProjectWorkspace;
  readonly view: ReopenView;
  readonly check: ReopenCheck;
  readonly lineage: ReopenLineage;
  readonly relinked: boolean;
}

/**
 * The reopen's `admit`: `open_project` with the run's answer and re-link (both `null` at a first call), then `describe`. `heldProject` is the
 * identity this window holds, for S9. A typed refusal is bounded, logged once and returned with its owner place; any other failure is rethrown,
 * as `admitDataset` rethrows it, for the global handlers. When `describe` fails, `describeOpened` first sends `close_dataset` for the opened
 * handle, which frees the project's lock once the kernel has closed it and its release has run; the failure goes on when the close settles or
 * once `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed, whichever is first. A cancel after the engine's open answers `opened` and is applied as any `opened` is
 * (item 5 (e)): that is timing inside one round trip, not covered by a test.
 */
export async function admitProject(folder: string, cancelKey: string, options: AdmitOptions = {}, heldProject: string | null = null): Promise<AdmissionOutcome> {
  const answer = options.reopen?.answer ?? null;
  const relink = options.reopen?.relink ?? null;
  try {
    const reply = await openProject(folder, cancelKey, answer, relink);
    if ("question" in reply) return { kind: "question" };
    if ("not_found" in reply) return { kind: "not_found", fileName: reply.not_found.file_name === null ? null : shownText(reply.not_found.file_name) };
    const { project, dataset, session, workspace, view, check, lineage } = reply.opened;
    const describe = await describeOpened(dataset);
    return { kind: "admitted", admitted: { dataset, describe, session }, reopened: { project, workspace, view, check, lineage, relinked: relink !== null } };
  } catch (e) {
    if (!(e instanceof SkpCallError)) throw e;
    const refusal = shownRefusal(formatRefusal(e.skpError));
    logSessionEvent("reopen-refused", `${refusal.code}: ${refusal.message}`);
    return { kind: "refused", refusal, owner: reopenRefusalPlace(refusal, heldProject) };
  }
}

/**
 * The owner's place beside a reopen refusal (ADV-2026-11-20-05 item 4), one at most. `engine.cancelled` has none: it is the cancelled note
 * (`CANCELLED_REFUSAL_CODE` in `admission/AdmissionPanel.tsx`). Every code without a line of its own takes R-CODE.
 */
export function reopenRefusalPlace(refusal: FormattedRefusal, heldProject: string | null): string | null {
  const code = refusal.code;
  if (code === "engine.cancelled") return null;
  if (code.startsWith("engine.")) return ENGINE_REFUSAL_NOTICE;
  if (code === "skp.open_project_panicked") return OPEN_PANICKED_NOTICE;
  if (code === "skp.project_open_elsewhere") return heldProject !== null && fieldValue(refusal, "project") === heldProject ? OPEN_ELSEWHERE_OWN_NOTICE : OPEN_ELSEWHERE_OTHER_NOTICE;
  if (code === "skp.project_known_folders_full") return KNOWN_FOLDERS_FULL_NOTICE;
  if (code === "skp.project_machine_record_refused") return MACHINE_RECORD_REFUSED_NOTICE;
  if (code === "skp.project_target_unresolvable" && fieldValue(refusal, "locator") !== undefined) return REOPEN_LOCATOR_REFUSAL_NOTICE;
  return REOPEN_REFUSAL_NOTICE;
}

const refusedOf = (fact: ReopenLineage["folder_file"] | ReopenLineage["previous_file"]): LineageRefusal | null =>
  typeof fact === "object" && fact !== null ? fact.refused : null;

/**
 * The lineage facts' places (Amendment 55 item 1): S16 once when either file is `not-the-recorded-one`; a refused line for each refused file;
 * then S17 exactly when the project file records a lineage (`folder_file` `recorded` or `recorded-with-lines-after`, or a `previous_file`).
 * `absent` or `not-read` with `null` has none. No rule text crosses: a refused line names the reason word and its line alone.
 */
export function lineagePlaces(lineage: ReopenLineage): string[] {
  const { folder_file, previous_file } = lineage;
  const places: string[] = [];
  if (folder_file === "not-the-recorded-one" || previous_file === "not-the-recorded-one") places.push(LINEAGE_NOT_RECORDED_NOTICE);
  for (const refused of [refusedOf(folder_file), refusedOf(previous_file)]) if (refused !== null) places.push(lineageFileRefusedNotice(refused));
  if (folder_file === "recorded" || folder_file === "recorded-with-lines-after" || previous_file !== null) places.push(LINEAGE_NOT_KEPT_NOTICE);
  return places;
}

/** Every string value of a style document, at any depth. */
const stringsOf = (value: unknown): string[] =>
  typeof value === "string" ? [value] : typeof value === "object" && value !== null ? Object.values(value).flatMap(stringsOf) : [];

/** The workspace members whose text holds a control or Bidi_Control character, for W-TEXT (item 5 (k)). */
function hiddenTextMembers(workspace: ProjectWorkspace): string[] {
  const members: string[] = [];
  if (workspace.filter !== null && holdsHiddenText(workspace.filter.predicate)) members.push("filter");
  if (workspace.clauses.some((clause) => holdsHiddenText(clause.text))) members.push("filter clauses");
  if (stringsOf(workspace.style).some(holdsHiddenText)) members.push("style");
  return members;
}

/**
 * What App applies of an `opened` reply, besides the filter and the clauses, which apply whole and as saved (O-16): the style (O-18; W-STYLE,
 * the default when the reader answers with none, Amendment 57 item 1), the saved view when `view.state` is `applies` (O-17, V3; else `null`, and
 * the fit runs), and the notices in the order S10 or S12, the lineage's places, S19, W-TEXT, then O-18 or W-STYLE. `columns` are the ones the
 * reopened data offers for Colour by.
 */
export function reopenApply(reopened: Reopened, columns: readonly string[]): { style: StyleState; view: { centre: [number, number]; zoom: number } | null; notices: string[] } {
  const { workspace, check, view } = reopened;
  const notices: string[] = [];
  if (check.observed.length > 0 || check.admission.length > 0) notices.push(reopened.relinked ? relinkedFileNotice(check) : changedFileNotice(check));
  notices.push(...lineagePlaces(reopened.lineage));
  if (view.state !== "applies") notices.push(viewNotAppliedNotice(shownText(view.basis)));
  const hidden = hiddenTextMembers(workspace);
  if (hidden.length > 0) notices.push(workspaceTextNotice(hidden));
  const read = readStyleDocument(workspace.style, columns);
  if (read === null) notices.push(STYLE_NOT_APPLIED_NOTICE);
  else if (read.colourByNotRestored !== null) notices.push(colourByNotRestoredNotice(shownText(read.colourByNotRestored)));
  const saved = view.state === "applies" ? { centre: [decodeHexF64(workspace.view.centre[0]), decodeHexF64(workspace.view.centre[1])] as [number, number], zoom: decodeHexF64(workspace.view.zoom) } : null;
  return { style: read === null ? DEFAULT_STYLE_STATE : read.state, view: saved, notices };
}
