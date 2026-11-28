// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The recovery offer (the recovery offer's preregistration, section 2.7 and Amendments 4, 17, 20 and 21). Client only: the kernel lists, recovers and
 * discards (`list_recoverable`, `recover_session`, `discard_recoverable`), and decides what can be offered; this file shows the list and turns each answer
 * into the owner's places.
 *
 * - **The list** is asked for at mount with no dataset (the sessions an earlier run left), and, for a reopen, once with the reopen's dataset (that project's
 *   record, shown after the reopen's notices). It is non-modal, and an entry no one answers stays in the kernel's store. Every string is the advisor's wording
 *   under the human's delegation of 2026-11-13, ADV-2026-11-23-39 item 1, copied by script and under the P6 marking; none is the human's.
 * - **Recover** runs through `runAdmitPath` (`admission/AdmissionPanel.tsx`, not edited) with `admitRecovered` as its `admit`: `recover_session`, then `describe`.
 *   For a project's record it is `recover_session` with that open's handle, which opens nothing. What comes back is applied by `App.tsx`'s `handleRecovered`,
 *   which records no step.
 * - **Discard** is `discardEntry`. A `not-found` or `cannot-be-offered` entry offers Discard only.
 * - **Text from a file is bounded** (`project/shownText.ts`) before it reaches a place or the log, as `admitProject` does.
 * - **A refusal of the recover call writes `recover-refused`, and one after an `opened` reply writes `recover-describe-refused`** (ADV-2026-11-28-01 item 4);
 *   a refused discard writes `discard-refused`; a success writes none of them.
 */

import { useEffect, useState } from "react";

import { describeOpened, type AdmissionOutcome, type Admitted } from "../admission/admitDataset";
import { isOpenInFlight, OPEN_LIVENESS_DELAY_MS, openCancelKey, openLivenessText, requestOpenCancel, runAdmitPath, type State } from "../admission/AdmissionPanel";
import { formatRefusal, type FormattedRefusal } from "../admission/formatRefusal";
import RefusalBlock from "../admission/RefusalBlock";
import { logSessionEvent } from "../diagnostics/log";
import { cancel, discardRecoverable, listRecoverable, recoverSession, SkpCallError } from "../skp/client";
import type { RecoverableRecord, ReopenCheck, StepIntent } from "../skp/types";
import { shownRefusal, shownText } from "./shownText";

/** R-S1, the list's heading. */
export const OFFER_HEADING = "[P6 placeholder] Unsaved changes from a session that did not close normally";
/** R-S2, an entry. */
export const ENTRY_TEXT = "[P6 placeholder] {file}, last change {time}";
/** R-S3, the two controls. */
export const RECOVER_LABEL = "[P6 placeholder] Recover";
export const DISCARD_LABEL = "[P6 placeholder] Discard";
/** R-S4, shown by `App.tsx` after a recover whose check names a difference. */
export const CHANGED_TEXT = "[P6 placeholder] {file} has changed since then: {components}.";
/** R-S5, an entry whose data is not found. */
export const NOT_FOUND_TEXT = "[P6 placeholder] {file} cannot be found or read, so these changes cannot be recovered. Discard removes them from this computer.";
/** R-S6, the offer at a project's open. */
export const PROJECT_OFFER_TEXT = "[P6 placeholder] This project has changes that were not saved before an earlier session of the app ended, last at {time}.";
/** R-S7, the list's footer. */
export const MORE_TEXT = "[P6 placeholder] More unsaved sessions are kept than are shown here.";
/** R-S11, an entry the kernel cannot read. */
export const UNREADABLE_TEXT = "[P6 placeholder] These unsaved changes cannot be read. Discard removes them from this computer.";
/** R-S12, an entry a later version wrote. */
export const LATER_VERSION_TEXT = "[P6 placeholder] These unsaved changes were made by a later version of the app, which this version cannot recover. Discard removes them from this computer.";

const TIME_OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" };

/** What a recover returns for the shell to apply: the steps, and the check of the data against the record's (`null` when nothing was opened). */
export interface Recovery {
  readonly steps: readonly StepIntent[];
  readonly check: ReopenCheck | null;
}

export type RecoveredOutcome =
  | Extract<AdmissionOutcome, { kind: "refused" }>
  | { kind: "admitted"; admitted: Admitted; recovery: Recovery }
  | { kind: "applied"; recovery: Recovery };

/**
 * Recover's `admit`: `recover_session`, then `describe` of the open it made. With a `dataset` the call opens nothing and its outcome is `applied`. A typed refusal is
 * bounded, logged once and returned; any other failure is rethrown, as `admitProject` rethrows it. A refusal of the recover call writes `recover-refused`, and one
 * that arrives after the `opened` reply (the describe's, after `describeOpened` has closed the open) writes `recover-describe-refused` (ADV-2026-11-28-01 item 4).
 */
export async function admitRecovered(record: string, cancelKey: string, dataset: string | null): Promise<RecoveredOutcome> {
  let recovered = false;
  try {
    const reply = await recoverSession(record, cancelKey, dataset);
    if (reply.opened === null) return { kind: "applied", recovery: { steps: reply.steps, check: null } };
    recovered = true;
    const describe = await describeOpened(reply.dataset);
    return { kind: "admitted", admitted: { dataset: reply.dataset, describe, session: reply.opened.session }, recovery: { steps: reply.steps, check: reply.opened.check } };
  } catch (e) {
    if (!(e instanceof SkpCallError)) throw e;
    const refusal = shownRefusal(formatRefusal(e.skpError));
    if (recovered) {
      logSessionEvent("recover-describe-refused", `${refusal.code}: ${refusal.message}`);
    } else {
      logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);
    }
    return { kind: "refused", refusal };
  }
}

/** Discard: `null` when the record was removed, else the bounded refusal, logged once. */
export async function discardEntry(record: string): Promise<FormattedRefusal | null> {
  try {
    await discardRecoverable(record);
    return null;
  } catch (e) {
    if (!(e instanceof SkpCallError)) throw e;
    const refusal = shownRefusal(formatRefusal(e.skpError));
    logSessionEvent("discard-refused", `${refusal.code}: ${refusal.message}`);
    return refusal;
  }
}

interface Entry {
  record: string;
  /** The words shown, fixed when the list came. */
  text: string;
  /** The data file's bounded name, for R-S4. */
  file: string;
  recoverable: boolean;
}

const newCancelKey = (): string => (typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `recover-${Date.now()}-${Math.random()}`);
const fill = (text: string, slots: Record<string, string>): string => text.replace(/\{(file|time)\}/g, (_, slot: string) => slots[slot] ?? "");

function entryOf(item: RecoverableRecord, project: boolean, formatTime: (date: Date, options: Intl.DateTimeFormatOptions) => string): Entry {
  const file = shownText(item.file_name ?? "");
  const time = item.last_step_at === null ? "" : formatTime(new Date(item.last_step_at), TIME_OPTIONS);
  const { data } = item;
  if (data.state === "cannot-be-offered") return { record: item.record, text: data.reason === "later-version" ? LATER_VERSION_TEXT : UNREADABLE_TEXT, file, recoverable: false };
  if (data.state === "not-found") return { record: item.record, text: fill(NOT_FOUND_TEXT, { file }), file, recoverable: false };
  return { record: item.record, text: fill(project ? PROJECT_OFFER_TEXT : ENTRY_TEXT, { file, time }), file, recoverable: true };
}

interface Props {
  /** The open a reopen returned, for that project's record; `null` for the sessions an earlier run left. */
  projectDataset: string | null;
  confirmOpen: () => Promise<boolean>;
  /** A recover's result: the admission it made (`null` for a project's record) and what to apply. */
  onRecovered: (admitted: Admitted | null, recovery: Recovery, fileName: string) => void;
  formatTime?: (date: Date, options: Intl.DateTimeFormatOptions) => string;
}

const defaultTime = (date: Date, options: Intl.DateTimeFormatOptions): string => date.toLocaleString(undefined, options);

export default function RecoveryOffer({ projectDataset, confirmOpen, onRecovered, formatTime = defaultTime }: Props) {
  const [listed, setListed] = useState<{ entries: Entry[]; more: boolean } | null>(null);
  const [state, setState] = useState<State>({ kind: "idle", note: null });
  const [shown, setShown] = useState<FormattedRefusal | null>(null);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let current = true;
    // A refused or failed list shows no offer: the records stay where they are.
    Promise.resolve()
      .then(() => listRecoverable(projectDataset))
      .then(
        (reply) => current && setListed({ entries: reply.records.map((item) => entryOf(item, projectDataset !== null, formatTime)), more: reply.more }),
        () => undefined
      );
    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the list is asked for once for each open
  }, [projectDataset]);

  const key = openCancelKey(state);
  useEffect(() => {
    setLive(false);
    if (key === null) return;
    const timer = setTimeout(() => setLive(true), OPEN_LIVENESS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [key]);

  const drop = (record: string) => setListed((prior) => (prior === null ? prior : { ...prior, entries: prior.entries.filter((e) => e.record !== record) }));

  async function recover(entry: Entry): Promise<void> {
    setShown(null);
    if (projectDataset !== null) {
      setBusy(true);
      const outcome = await admitRecovered(entry.record, newCancelKey(), projectDataset);
      setBusy(false);
      if (outcome.kind === "applied") {
        onRecovered(null, outcome.recovery, entry.file);
        drop(entry.record);
      } else if (outcome.kind === "refused") setShown(outcome.refusal);
      return;
    }
    let recovery: Recovery | null = null;
    const outcome = await runAdmitPath(entry.record, {}, {
      admit: async (record, cancelKey) => {
        const result = await admitRecovered(record, cancelKey, null);
        if (result.kind === "applied") throw new Error("recover_session opened nothing for a null dataset");
        if (result.kind === "admitted") recovery = result.recovery;
        return result;
      },
      setState,
      onAdmitted: (admitted) => {
        if (recovery !== null) onRecovered(admitted, recovery, entry.file);
      },
      confirmOpen,
      makeCancelKey: newCancelKey,
    });
    if (outcome?.kind === "admitted") drop(entry.record);
  }

  async function discard(entry: Entry): Promise<void> {
    setShown(null);
    setBusy(true);
    const refusal = await discardEntry(entry.record);
    setBusy(false);
    if (refusal === null) drop(entry.record);
    else setShown(refusal);
  }

  if (listed === null || listed.entries.length === 0) return null;
  const idle = !busy && !isOpenInFlight(state);
  const liveness = live ? openLivenessText(state) : null;
  const refusal = shown ?? (state.kind === "refused" ? state.refusal : null);
  return (
    <div className="recovery-offer" role="group">
      {projectDataset === null && <h2 className="recovery-heading">{OFFER_HEADING}</h2>}
      <ul className="recovery-entries">
        {listed.entries.map((entry) => (
          <li key={entry.record} className="recovery-entry">
            <span className="recovery-entry-text">{entry.text}</span>
            {entry.recoverable && (
              <button type="button" className="recovery-recover" disabled={!idle} onClick={() => void recover(entry)}>
                {RECOVER_LABEL}
              </button>
            )}
            <button type="button" className="recovery-discard" disabled={!idle} onClick={() => void discard(entry)}>
              {DISCARD_LABEL}
            </button>
          </li>
        ))}
      </ul>
      {listed.more && <p className="recovery-more">{MORE_TEXT}</p>}
      {key !== null && (
        <button type="button" className="recovery-cancel" onClick={() => requestOpenCancel(state, (cancelKey) => cancel(cancelKey))}>
          Cancel
        </button>
      )}
      {liveness !== null && <div className="recovery-liveness" role="status">{liveness}</div>}
      {state.kind === "idle" && state.note !== null && <p className="recovery-note">{state.note}</p>}
      {refusal !== null && <RefusalBlock refusal={refusal} />}
    </div>
  );
}
