// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import { isInstrumentedBuild } from "../isInstrumentedBuild";
import { admitProject, type Reopened } from "../project/openProject";
import { fileNotFoundNotice, QUESTION_CANCEL, QUESTION_COPY, QUESTION_SAME, QUESTION_TEXT, RELINK_CHOICE, REOPEN_LOCATOR_REFUSAL_NOTICE } from "../project/reopenNotices";
import { cancel as cancelClient } from "../skp/client";
import { crsCatalog } from "../skp/crsCatalog";
import { pickFile, pickProjectFolder } from "../skp/dialog";
import type { IdentityDeclaration, ReopenAnswer } from "../skp/types";
import { admitDataset, AdmitOptions, Admitted, AdmissionOutcome } from "./admitDataset";
import { splitCandidateColumns } from "./candidateColumns";
import CrsAssertionForm from "./CrsAssertionForm";
import { fieldValue, FormattedRefusal } from "./formatRefusal";
import IdentityDeclarationForm from "./IdentityDeclarationForm";
import RefusalBlock from "./RefusalBlock";

/** Which remediation form, if any, stays reachable for the CURRENT refusal (NEXT-CUT.md P3 item
 * D: "the form still reachable — no dead end"). `null` means no form renders. */
export type FormFamily = "crs" | "identity" | null;

/** The family a refusal CODE alone establishes -- `null` for any code that does not, on its own,
 * open a remediation flow (`nextFormFamily` below is what decides whether a family carries
 * forward from a PRIOR refusal in the same remediation attempt). Three codes start one:
 * `engine.crs_undeclared` and `engine.format_default_contradicted` the CRS form (the second
 * refusal's own remedy is to assert the file's actual CRS), `engine.identity_unusable` the identity
 * form. */
export function formFamilyForCode(code: string): FormFamily {
  if (code === "engine.crs_undeclared") return "crs";
  if (code === "engine.format_default_contradicted") return "crs";
  if (code === "engine.identity_unusable") return "identity";
  return null;
}

/**
 * The form family to show for a NEW refusal, given whichever family (if any) was already active.
 *
 * - `engine.crs_assertion_conflict` is refused to `null` unconditionally (I1: this code NEVER
 *   gets a remediation control, no matter what came before).
 * - A code that starts its own family (`engine.crs_undeclared`, `engine.format_default_contradicted`,
 *   `engine.identity_unusable`) always wins, even over a different prior family -- a fresh refusal
 *   of that shape means the operator's remediation attempt has to start (or restart) there.
 * - Anything else (the axis-order codes, most concretely) carries the PRIOR family forward rather
 *   than clearing it: an axis-order refusal can only be the direct result of the CRS definition
 *   just asserted, so the CRS form staying reachable (item D) is what lets the operator try a
 *   different definition without the panel dead-ending. A code with no prior family (e.g. a
 *   fresh-open axis-order refusal against a file-declared CRS, where an assertion is not even
 *   applicable per ADR-015 §4) correctly renders no form at all.
 */
export function nextFormFamily(priorFamily: FormFamily, code: string): FormFamily {
  if (code === "engine.crs_assertion_conflict") return null;
  return formFamilyForCode(code) ?? priorFamily;
}

export type State =
  /** `note` is non-null exactly once: right after a PLAIN open (no prior refusal against this same
   * path) is cancelled (NEXT-CUT.md P4, I8) -- "the pre-open state" item A/B describe. Any other
   * route back to `idle` (there is none yet, elsewhere in this flow) would carry `null`. */
  | { kind: "idle"; note: string | null }
  | {
      kind: "opening";
      /** This open's own `cancel_key` (SKP-V0 §2 C3) -- minted once, before the first `setState`,
       * specifically so it is reachable from render for the Cancel button (P4 item B) the instant
       * `kind` becomes `"opening"`, not only after `admit()` resolves. */
      cancelKey: string;
      /** The exact `AdmitOptions` THIS open is running with -- `openLivenessText` reads
       * `.identity` off of it to decide which liveness line applies (I11: the whole-file
       * uniqueness check is a materially different wait than a plain open). */
      options: AdmitOptions;
      /** The `admitted` state this run started from, held only when it is a session-tier admission that `identityDeclarationOffer` offered the declaration for
       * (a declaration started from that offer). A cancel of this run returns to it, so the offer is back. */
      resume?: Extract<State, { kind: "admitted" }>;
    }
  | {
      kind: "refused";
      path: string;
      refusal: FormattedRefusal;
      formFamily: FormFamily;
      /** The exact `AdmitOptions` that produced THIS refusal (MF2, reviewer gate, admission-
       * remediation cut): a form submit merges its own key over these -- new value replaces the
       * same key, the other key carries -- so a file refused for BOTH a CRS assertion and an
       * identity declaration does not loop forever resubmitting only the option the operator just
       * touched (CRS admission precedes identity in the engine, so a single-option resubmit always
       * re-refuses at whichever gate the dropped option had already passed, paying a whole-file
       * scan per lap). */
      options: AdmitOptions;
      /** True while a remediation submit against THIS SAME refused state is in flight -- the real
       * double-submit guard behind the forms' `disabled` prop (SF7), and also what keeps `kind` at
       * `"refused"` (never `"opening"`) across the await. That second part is MF1's actual fix:
       * `kind` flipping to `"opening"` and back is what unmounted `CrsAssertionForm`/
       * `IdentityDeclarationForm` on every re-refusal (losing pasted text/picks, SF7) AND made
       * `nextFormFamily`'s `priorFamily` argument always `null` (the updater always saw
       * `prev.kind === "opening"`), so an axis-order re-refusal after a bad paste rendered no form
       * at all and the operator had to re-pick the file from the OS dialog. */
      inFlight: boolean;
      /** This resubmit's own `cancel_key`, non-null exactly while `inFlight` is `true` (P4 item
       * B) -- mirrors `"opening"`'s own `cancelKey` field for the plain-open case. */
      cancelKey: string | null;
      /** The `AdmitOptions` THIS resubmit is running with, non-null exactly while `inFlight` is
       * `true` -- distinct from `options` above, which still names whatever produced the CURRENTLY
       * RENDERED refusal until the resubmit itself resolves (P4 item A: `openLivenessText` needs
       * to know whether the identity form's own submit, specifically, is the one in flight). */
      pendingOptions: AdmitOptions | null;
      /** A reopen refusal's owner place (B2 piece 1c, `project/openProject.ts`'s `reopenRefusalPlace`), shown inside the block. Absent for a dataset open. */
      owner?: string | null;
    }
  | {
      kind: "admitted";
      admitted: Admitted;
      /** The path this admission opened and the `AdmitOptions` it ran with (`runAdmitPath` sets both), so that `identityDeclarationOffer` can offer a declaration against the same file under the same CRS assertion. */
      path: string;
      options: AdmitOptions;
    }
  /** B2 piece 1c (O-14): a reopen's run ended at a `question` (S8) or a `not_found` (S11). `options` are the run's, so that a choice re-enters
   * the run with the answer it gave; nothing else is held between the calls (SKP-V0.md section 12.3). */
  | { kind: "question"; folder: string; options: AdmitOptions }
  | { kind: "not_found"; folder: string; options: AdmitOptions; fileName: string | null };

/** `EngineError::Cancelled`'s own SKP wire code (`kernel/src/skp.rs::error_of`) -- the ONLY code
 * naming a cancelled `open_dataset` call, minted only when this exact request's `cancel_key` (or the
 * `StreamHandle`/`CancelKey` handed to `cancel`) was observed cancelled (SKP-V0 §2 C3). A refusal
 * carrying it is never product refusal UX (I8): `runAdmitPath` below intercepts it before it ever
 * reaches `RefusalBlock`/`formFamilyForCode`. */
export const CANCELLED_REFUSAL_CODE = "engine.cancelled";

/** Declared, not measured -- the sibling of `App.tsx`'s `SCAN_LIVENESS_DELAY_MS` for the `open`
 * path rather than a viewport/filter scan (NEXT-CUT.md P4 item A: "its own delay constant name...
 * match the value unless a comment there says otherwise" -- `SCAN_LIVENESS_DELAY_MS`'s own comment
 * carries no such override, so this matches it: the same anti-flicker reasoning applies unchanged
 * to an `open_dataset` call that resolves well within human perception time). Cancel's own
 * visibility is NEVER gated by this constant, exactly like the scan panel's Cancel (see
 * `isOpenInFlight` below). */
export const OPEN_LIVENESS_DELAY_MS = 200;

/** True while EITHER a plain open OR a remediation resubmit is in flight -- the single predicate
 * behind the Open button's disabled state (P4 item C), the Cancel button's visibility (P4 item B,
 * ZERO delay, matching the filter panel's own Cancel), and `openCancelKey`/`openLivenessText`
 * below. */
export function isOpenInFlight(state: State): boolean {
  return state.kind === "opening" || (state.kind === "refused" && state.inFlight);
}

/** The `cancel_key` a Cancel click right now would have to reach, or `null` when nothing is in
 * flight (P4 item B). */
export function openCancelKey(state: State): string | null {
  if (state.kind === "opening") return state.cancelKey;
  if (state.kind === "refused" && state.inFlight) return state.cancelKey;
  return null;
}

/** The re-link choice a state offers (KNOWN-LIMITATIONS item 73), or `null`: the folder to re-enter the run for, and the run's own `AdmitOptions`, so that
 * the choice re-enters it with the answer it gave. It is offered in two states and no other:
 * - `not_found` (S11), as before;
 * - `refused`, when the run is a reopen (`options.reopen` is set), nothing is in flight and the owner place is `REOPEN_LOCATOR_REFUSAL_NOTICE`, which
 *   `reopenRefusalPlace` in `project/openProject.ts` gives only to `skp.project_target_unresolvable` with a `locator`. A refusal for a link or a wrong kind at the
 *   recorded place has another code, so another place, and no choice (OPEN-5). The kernel already uses a `relink` before any locator (`Projects::open_project`).
 * The owner place stays the one decision site; the refused block's render and the DEV hook `e2eRelinkFile` both read this function. */
export function relinkOffer(state: State): { folder: string; options: AdmitOptions } | null {
  if (state.kind === "not_found") return { folder: state.folder, options: state.options };
  if (state.kind === "refused" && state.options.reopen !== undefined && !state.inFlight && state.owner === REOPEN_LOCATOR_REFUSAL_NOTICE) {
    return { folder: state.path, options: state.options };
  }
  return null;
}

/** The declaration the panel offers beside the Open buttons, or `null`. */
export interface IdentityDeclarationOffer {
  path: string;
  options: AdmitOptions;
  candidateColumns: string[];
}

/** The identity declaration a state offers (identity-declaration-route-for-session-tier, section 2 item 4 (b)), or `null`. It is offered when every one of these holds:
 * - the state is `admitted`, which is a dataset the panel itself has admitted and no run in flight;
 * - the run was a direct open, not a reopen (`options.reopen` is unset): a project's reopen is not offered the declaration;
 * - the dataset's identity is on the session tier (`describe.identity.class` is `"session-ordinal"`);
 * - the engine's list came with it (`candidate_columns` is neither `null` nor absent), and the list may be empty;
 * - the dataset the panel admitted is the dataset on the map (`datasetOnMap`, the handle of App's own `admitted`): a later admission by another route (a reopen) has
 *   replaced the map's dataset, and a declaration against the earlier file would replace what the operator is looking at.
 * It carries the run's own path and `AdmitOptions`, so that the declaration is sent for the same file under the same CRS assertion. The one decision site: the panel's render and
 * `runAdmitPath`'s hold of the admission both read this function. */
export function identityDeclarationOffer(state: State, datasetOnMap: string | null): IdentityDeclarationOffer | null {
  if (state.kind !== "admitted") return null;
  if (state.options.reopen !== undefined) return null;
  const identity = state.admitted.describe.identity;
  if (identity.class !== "session-ordinal") return null;
  if (identity.candidate_columns === null || identity.candidate_columns === undefined) return null;
  if (datasetOnMap === null || state.admitted.dataset !== datasetOnMap) return null;
  return { path: state.path, options: state.options, candidateColumns: identity.candidate_columns };
}

/** The options a declaration submits (section 2 item 4 (c)): the offer's own, with the declaration over them. A CRS assertion the session open was admitted under is carried, as a
 * remediation submit carries it (`IdentityDeclarationForm`'s refused-state submit merges the same way); nothing else of the run is. */
export function declarationOptions(offer: IdentityDeclarationOffer, identity: IdentityDeclaration): AdmitOptions {
  return { ...offer.options, identity };
}

/** The `AdmitOptions` the in-flight open (if any) is actually running with -- see the `State`
 * union's own field comments for why this is not simply `state.options` in the `"refused"` case. */
function inFlightOptions(state: State): AdmitOptions | null {
  if (state.kind === "opening") return state.options;
  if (state.kind === "refused" && state.inFlight) return state.pendingOptions;
  return null;
}

/** Pure gating decision, the same shape as `App.tsx`'s `scanLivenessTextShouldShow` (P4 item A):
 * not in flight -> never; in flight -> only once `msSinceIssued` reaches `OPEN_LIVENESS_DELAY_MS`. */
export function openLivenessTextShouldShow(state: State, msSinceIssued: number): boolean {
  return isOpenInFlight(state) && msSinceIssued >= OPEN_LIVENESS_DELAY_MS;
}

/** The liveness line's own text (P4 item A) -- LIVENESS, never progress: no percentage, count, or
 * duration, matching `App.tsx`'s `scanLivenessText` discipline. Two literal strings only:
 * - an in-flight open carrying an identity declaration is paying ADR-016's whole-file uniqueness
 *   scan RIGHT NOW (I11: refusal-cost honesty extends to a submit that has not yet failed) --
 *   named plainly rather than left to read as an ordinary, cheap re-open.
 * - anything else in flight (a plain first open, or a CRS-assertion-only resubmit) gets the plain
 *   line: there is nothing more specific and honest to say about what it is paying.
 * `null` when nothing is in flight, matching `scanLivenessText`'s own `null` convention. */
export function openLivenessText(state: State): string | null {
  const options = inFlightOptions(state);
  if (options === null) return null;
  return options.identity
    ? "Opening — checking the declared column across the whole file…"
    : "Opening…";
}

/** Cancel's own action (P4 item B), factored out of the JSX `onClick` so it is directly testable
 * without a render harness (this package's own convention): a no-op when nothing is in flight,
 * otherwise the SKP `cancel` call against the EXACT `cancel_key` `runAdmitPath` minted and retained
 * for the request currently running -- never a fresh key, never a stream handle. The eventual
 * `engine.cancelled` refusal this produces is handled entirely inside `runAdmitPath` itself (the
 * `admit()` promise already in flight resolves to it); this function only issues the cancellation,
 * it does not itself transition `State`. */
export function requestOpenCancel(state: State, cancel: (cancelKey: string) => Promise<unknown>): void {
  const cancelKey = openCancelKey(state);
  if (cancelKey !== null) void cancel(cancelKey);
}

export interface AdmitPathDeps {
  admit: (path: string, cancelKey: string, options?: AdmitOptions) => Promise<AdmissionOutcome>;
  setState: (updater: (prev: State) => State) => void;
  onAdmitted: (admitted: Admitted) => void;
  makeCancelKey: () => string;
  /** Asked before anything else when present (Amendment 1 B3): `false` drops the open. Absent, as in the tests that predate it, the open goes on. */
  confirmOpen?: () => Promise<boolean>;
  /** B2 piece 1c (O-15): a reopen's admission goes here in place of `onAdmitted`, with what the reply gives beyond it. */
  onReopened?: (admitted: Admitted, reopened: Reopened) => void;
  /** Whether Cancel was pressed for `cancelKey` (Amendment 54 item 5 (e)): a `question` or a `not_found` that arrives after it is dropped. */
  wasCancelled?: (cancelKey: string) => boolean;
}

/**
 * The admission flow's state-transition logic, isolated from the `useState`/`useCallback` plumbing
 * around it so it is directly testable without a render harness (SF11, reviewer gate, admission-
 * remediation cut) -- this package's own convention for exactly this reason
 * (`crsAssertionState.ts`'s top comment), applied one level up to the panel's own transition
 * rather than a single form's. `AdmissionPanel`'s `admitPath` below is a thin wrapper supplying the
 * real `admitDataset`, the real `setState`, and a real cancel key; a test supplies its own `deps`
 * and inspects the `State` values `setState` was called with directly.
 *
 * **`confirmOpen` is awaited before the first `setState`** (B3): when it answers `false` nothing is admitted, no state is set and the result is `null`.
 *
 * **A reopen's run** (B2 piece 1c, Amendment 54 item 5 (b) to (e)) is this same function, with `options.reopen` set and `admitProject` as its
 * `admit`, so the liveness line, Cancel and the refusal block are the ones above. Its refusal opens no form (the claims are the project file's,
 * not the user's), a `question` or a `not_found` ends the run, and one that arrives after Cancel for its key asks nothing and ends at the
 * cancelled note. An admission after a Cancel is applied, as any late admission is.
 */
export async function runAdmitPath(
  path: string,
  options: AdmitOptions,
  deps: AdmitPathDeps
): Promise<AdmissionOutcome | null> {
  if (deps.confirmOpen !== undefined && !(await deps.confirmOpen())) return null;
  // Minted BEFORE the first `setState` (P4, unlike this function's pre-P4 shape, which minted it
  // only after) so it is already sitting in `State` -- reachable by `openCancelKey` from render --
  // the instant `kind` becomes `"opening"` (or `inFlight` becomes `true`), not only once `admit()`
  // resolves.
  const cancelKey = deps.makeCancelKey();

  // MF1: a remediation submit against the SAME refused path keeps `kind: "refused"` (only marking
  // `inFlight`), never resets to the bare `{kind: "opening"}` a plain first-open (or a fresh path)
  // uses -- see the `State["refused"]["inFlight"]` doc comment above for what that reset used to
  // break.
  deps.setState((prev) => {
    if (prev.kind === "refused" && prev.path === path) return { ...prev, inFlight: true, cancelKey, pendingOptions: options };
    // An open of the same path while the session-tier offer stands (a declaration from the offer, or the same file opened again) holds the admission it started from, so that Cancel returns to it with its offer. The offer's own rule is the test.
    if (prev.kind === "admitted" && prev.path === path && identityDeclarationOffer(prev, prev.admitted.dataset) !== null) return { kind: "opening", cancelKey, options, resume: prev };
    return { kind: "opening", cancelKey, options };
  });

  const outcome = await deps.admit(path, cancelKey, options);

  if (outcome.kind === "question" || outcome.kind === "not_found") {
    if (deps.wasCancelled?.(cancelKey)) deps.setState(() => ({ kind: "idle", note: "Open cancelled" }));
    else deps.setState(() => (outcome.kind === "question" ? { kind: "question", folder: path, options } : { kind: "not_found", folder: path, options, fileName: outcome.fileName }));
    return outcome;
  }

  if (outcome.kind === "refused") {
    // I8/P4: a refusal carrying `CANCELLED_REFUSAL_CODE` is not product refusal UX -- it is this
    // exact request's own Cancel button having reached the host. It never flows through
    // `nextFormFamily`/`RefusalBlock` the way a real refusal does.
    if (outcome.refusal.code === CANCELLED_REFUSAL_CODE) {
      deps.setState((prev) => {
        if (prev.kind === "refused" && prev.path === path && prev.cancelKey === cancelKey) {
          // A remediation resubmit was cancelled: back to the SAME refused state that was already
          // showing -- refusal, formFamily, and options untouched, exactly like a re-refusal's
          // carry-forward (P3b) -- only `inFlight`/`cancelKey`/`pendingOptions` clear. The form and
          // whatever the operator had typed into it survive because `kind` never left `"refused"`.
          return { ...prev, inFlight: false, cancelKey: null, pendingOptions: null };
        }
        // A declaration from the session-tier offer was cancelled: back to the admission it started from, with its offer. The file was never closed.
        if (prev.kind === "opening" && prev.cancelKey === cancelKey && prev.resume !== undefined) return prev.resume;
        // A plain open was cancelled (or this is a stale cancellation racing a fresher attempt for
        // the same path/refusal -- the guard above already excluded it): the pre-open state, i.e.
        // idle, with the one-line note ADR-018 §1 permits (no duration, no "acknowledged").
        return { kind: "idle", note: "Open cancelled" };
      });
      return outcome;
    }

    deps.setState((prev) => {
      // A family -- and now its accumulated `options` -- only carries forward from a refusal
      // against this SAME path: a fresh path (a new file picked, or a fresh E2E `openPath` call)
      // never inherits a stale family or option set from whatever was previously open.
      const priorFamily = prev.kind === "refused" && prev.path === path ? prev.formFamily : null;
      return {
        kind: "refused",
        path,
        refusal: outcome.refusal,
        // A reopen refusal opens no remediation form (Amendment 54 item 5 (g)).
        formFamily: options.reopen !== undefined ? null : nextFormFamily(priorFamily, outcome.refusal.code),
        options,
        inFlight: false,
        cancelKey: null,
        pendingOptions: null,
        ...(outcome.owner !== undefined ? { owner: outcome.owner } : {}),
      };
    });
    return outcome;
  }

  deps.setState(() => ({ kind: "admitted", admitted: outcome.admitted, path, options }));
  if (outcome.reopened !== undefined && deps.onReopened !== undefined) deps.onReopened(outcome.admitted, outcome.reopened);
  else deps.onAdmitted(outcome.admitted);
  return outcome;
}

/** A picker's answer: the hook's slot once when it holds one (instrumented builds only), else the picker's. */
function takeSlot(slot: { current: string | null }, pick: () => Promise<string | null>): Promise<string | null> {
  const supplied = isInstrumentedBuild() ? slot.current : null;
  if (supplied === null) return pick();
  slot.current = null;
  return Promise.resolve(supplied);
}

/** A fresh `cancel_key` for one call. */
const newCancelKey = (): string => (typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `open-${Date.now()}-${Math.random()}`);

/** O-19a: the Open project control's two texts, idle and opening (the advisor's wording under the human's delegation of 2026-11-13, ADV-2026-11-20-05 item 2). */
const OPEN_PROJECT_IDLE = "Open project…";
const OPEN_PROJECT_OPENING = "Opening project…";

/** D1 and D2 (identity-declaration-route-for-session-tier): the offer's label and its first line. The advisor's words under the human's delegation of 2026-11-13 (ADV-2026-11-23-26 item 2), not
 * the human's; each is shown as the words commit set it. D2's present words are the advisor's ADV-2026-11-27-15 item 1, which replaces the D2 of ADV-2026-11-23-26 item 2. D2 is true of the code as follows: "opens this file again" is `runAdmitPath` called with the same path; "the filter and the selection are cleared and Colour by ends; the rest of the style is kept" is what an admission of
 * another dataset does to the workspace (`workspaceState.ts`); "stays open as it is now" is that a refusal leaves App's `admitted` as it was. */
const DECLARE_IDENTITY_LABEL = "Declare an identity column…";
const DECLARE_IDENTITY_FIRST_LINE = "Declaring opens this file again with the column you choose. The filter and the selection are cleared and Colour by ends; the rest of the style is kept. If the column is refused, the file stays open as it is now.";

interface Props {
  onAdmitted: (admitted: Admitted) => void;
  /** Resolves `true` at once when no export runs; otherwise `App` asks, and `false` (Keep exporting) drops the open. */
  confirmOpen: () => Promise<boolean>;
  /** B2 piece 1c: App's reopen handler (O-15), called for a reopen's admission in place of `onAdmitted`. */
  onReopened: (admitted: Admitted, reopened: Reopened) => void;
  /** The project identity this window holds, or `null`; read when a reopen is refused, for S9's own-window place (Amendment 54 item 5 (f)). */
  heldProject: () => string | null;
  /** The handle of the dataset on the map, or `null` (App's own `admitted`): the identity declaration is offered only while the dataset this panel admitted is that one (`identityDeclarationOffer`). */
  datasetOnMap: string | null;
}

/** What the command bar's `/open` calls (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.7): it does what a click of Open does at that moment.
 * `requestProjectPick` is the same for the bar's Open project entry (B2 piece 1c, O-19b) and the Open project control. */
export interface AdmissionPanelHandle {
  requestPick(): "started" | "busy";
  requestProjectPick(): "started" | "busy";
}

/**
 * The admission flow as product truth (NEXT-CUT.md): a file picker, then `open_dataset`'s verdict
 * rendered directly. Success is rendered by `App` (`DescribeSummary`, bound to the dataset on the map,
 * milestone 1 / OPEN-1 (A)); every typed refusal is shown with its full
 * reason, verbatim -- the refusal UX *is* the feature. NEXT-CUT.md P3 adds the two remediation
 * forms (`CrsAssertionForm`/`IdentityDeclarationForm`), both re-entering `admitPath` below -- the
 * SAME function a plain retry uses, just with `AdmitOptions` set -- never a parallel admission
 * path. B2 piece 1c adds the Open project control (O-19a): a folder picked runs `reopenPath`, which is `runAdmitPath` with the reopen's own
 * `admit`, and S8's choices and S11's re-link re-enter it.
 */
const AdmissionPanel = forwardRef<AdmissionPanelHandle, Props>(function AdmissionPanel({ onAdmitted, confirmOpen, onReopened, heldProject, datasetOnMap }, ref) {
  const [state, setState] = useState<State>({ kind: "idle", note: null });
  /** The keys Cancel was pressed for (Amendment 54 item 5 (e)), read by `runAdmitPath` when a reopen's `question` or `not_found` arrives. */
  const cancelledKeys = useRef(new Set<string>());
  /** The DEV-only hooks' one-shot slots (`e2e-test-surface.ts`): a folder or a file supplied in place of a picker's answer. Always `null` in a plain build. */
  const e2eFolderRef = useRef<string | null>(null);
  const e2eFileRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // The one piece of the manual flow a path string can't replay itself -- everything from here
  // down is the product's own admission behavior, unchanged by the E2E hook registered below.
  // `runAdmitPath` above holds the actual transition logic; this wrapper only supplies the real
  // dependencies (see `runAdmitPath`'s own doc comment for why the split exists).
  const admitPath = useCallback(
    (path: string, options: AdmitOptions = {}): Promise<AdmissionOutcome | null> =>
      runAdmitPath(path, options, {
        admit: admitDataset,
        setState,
        onAdmitted,
        confirmOpen,
        makeCancelKey: newCancelKey,
      }),
    [onAdmitted, confirmOpen]
  );

  // A reopen's run (B2 piece 1c): the same transition with the reopen's `admit`, which never reaches `admitDataset`.
  const reopenPath = useCallback(
    (folder: string, reopen: { answer: ReopenAnswer | null; relink: string | null }): Promise<AdmissionOutcome | null> =>
      runAdmitPath(folder, { reopen }, {
        admit: (path, cancelKey, options) => admitProject(path, cancelKey, options, heldProject()),
        setState,
        onAdmitted,
        onReopened,
        confirmOpen,
        makeCancelKey: newCancelKey,
        wasCancelled: (cancelKey) => cancelledKeys.current.has(cancelKey),
      }),
    [onAdmitted, onReopened, confirmOpen, heldProject]
  );

  const handlePick = useCallback(async () => {
    const path = await pickFile();
    if (path === null) {
      return; // the operator cancelled the picker; not a refusal, not an error
    }
    await admitPath(path);
  }, [admitPath]);

  // O-19a: the folder picker (S2's title, shared with the save), then the reopen's first call. A dismissed picker starts nothing.
  const handleProjectPick = useCallback(async (): Promise<AdmissionOutcome | null> => {
    const folder = await takeSlot(e2eFolderRef, pickProjectFolder);
    return folder === null ? null : reopenPath(folder, { answer: null, relink: null });
  }, [reopenPath]);

  // S11's choice, and item 73's after a refusal at the recorded place (`relinkOffer`): the file picker, then the re-link call with the answer the run already gave
  // (Amendment 54 item 5 (d)). A dismissed picker ends the run at the cancelled note. A Cancel of the call after item 73's refusal returns to that refusal, with its choice (`runAdmitPath`); after S11's, it ends the run at the cancelled note.
  const handleRelink = useCallback(
    async (folder: string, options: AdmitOptions): Promise<AdmissionOutcome | null> => {
      const file = await takeSlot(e2eFileRef, pickFile);
      if (file === null) setState({ kind: "idle", note: "Open cancelled" });
      else return reopenPath(folder, { answer: options.reopen?.answer ?? null, relink: file });
      return null;
    },
    [reopenPath]
  );

  // The Open button's own condition decides (section 2.7): busy starts nothing, else a pick starts, so a second `/open` during the picker or the ask starts a new pick, as a second click does.
  useImperativeHandle(
    ref,
    () => ({
      requestPick() { if (isOpenInFlight(state)) return "busy"; void handlePick(); return "started"; },
      requestProjectPick() { if (isOpenInFlight(state)) return "busy"; void handleProjectPick(); return "started"; },
    }),
    [state, handlePick, handleProjectPick]
  );

  // E2E TEST SURFACE (dev builds only, e2e/README.md): `pickFile()` above opens a native dialog no
  // CDP driver can reach, so this hook lets the harness supply a path directly and run `admitPath`
  // -- the exact same admission code the manual click above runs, not a parallel test path.
  // NEXT-CUT.md P3 item F: `opts` carries the SAME two remediation options a real form submit
  // would, camelCased for JS-side ergonomics; `crsCatalog` is exposed read-only alongside it so
  // P5's suite can inspect the pinned catalog without going through the DOM.
  useEffect(() => {
    if (!isInstrumentedBuild()) return;
    registerE2eHook("openPath", async (path, opts) => {
      const options: AdmitOptions | undefined = opts
        ? {
            crsAssertion: opts.crsAssertion
              ? { identifier: opts.crsAssertion.identifier, definition_json: opts.crsAssertion.definitionJson }
              : null,
            identity: opts.identity ?? null,
          }
        : undefined;
      const outcome = await admitPath(path, options);
      // A dropped open (Keep exporting, or replaced by a later open while the ask stood) has no kind of its own in `OpenPathOutcome`, which is outside this piece's files; it reads as a refusal with its own code.
      if (outcome === null) return { kind: "refused", code: "open.dropped", message: "The open was dropped while an export ran: Keep exporting was chosen, or a later open replaced this one." };
      return outcome.kind === "refused"
        ? { kind: "refused", code: outcome.refusal.code, message: outcome.refusal.message }
        : { kind: "admitted" };
    });
    registerE2eHook("crsCatalog", () => crsCatalog());
    return () => {
      unregisterE2eHook("openPath");
      unregisterE2eHook("crsCatalog");
    };
  }, [admitPath]);

  // The reopen's two DEV hooks: each fills a slot, runs the click's own handler and empties the slot.
  useEffect(() => {
    if (!isInstrumentedBuild()) return;
    const answer = (outcome: AdmissionOutcome | null): string => (outcome === null ? "dropped" : outcome.kind === "refused" ? outcome.refusal.code : outcome.kind);
    registerE2eHook("e2eOpenProjectFolder", async (folder) => {
      e2eFolderRef.current = folder;
      try { return answer(await handleProjectPick()); } finally { e2eFolderRef.current = null; }
    });
    registerE2eHook("e2eRelinkFile", async (file) => {
      const offer = relinkOffer(stateRef.current);
      if (offer === null) return "not-asked";
      e2eFileRef.current = file;
      try { return answer(await handleRelink(offer.folder, offer.options)); } finally { e2eFileRef.current = null; }
    });
    return () => {
      unregisterE2eHook("e2eOpenProjectFolder");
      unregisterE2eHook("e2eRelinkFile");
    };
  }, [handleProjectPick, handleRelink]);

  // P4 item A: the liveness line is gated by `OPEN_LIVENESS_DELAY_MS`, reset per NEWLY in-flight
  // `cancel_key` (never re-armed by a sub-transition that keeps the SAME key in flight -- there is
  // only one such transition here, unlike the scan machine's issuing/open-no-rows/delivering, but
  // the pattern is `FilterPanel.tsx`'s own, verbatim). Cancel's own visibility below is NOT gated
  // by this timer -- `openCancelKey(state) !== null` alone decides it, matching the filter panel's
  // ZERO-delay Cancel.
  const inFlightCancelKey = openCancelKey(state);
  const [showOpenLiveness, setShowOpenLiveness] = useState(false);
  useEffect(() => {
    setShowOpenLiveness(false);
    if (inFlightCancelKey === null) {
      return;
    }
    const timer = setTimeout(() => setShowOpenLiveness(true), OPEN_LIVENESS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [inFlightCancelKey]);

  const openLivenessMessage = showOpenLiveness ? openLivenessText(state) : null;
  const offer = state.kind === "refused" ? relinkOffer(state) : null;
  const declareOffer = identityDeclarationOffer(state, datasetOnMap);

  return (
    <div className="admission-panel">
      <button type="button" onClick={() => void handlePick()} disabled={isOpenInFlight(state)}>
        {state.kind === "opening" && state.options.reopen === undefined ? "Opening…" : "Open GeoParquet…"}
      </button>
      <button type="button" className="admission-open-project" onClick={() => void handleProjectPick()} disabled={isOpenInFlight(state)}>
        {state.kind === "opening" && state.options.reopen !== undefined ? OPEN_PROJECT_OPENING : OPEN_PROJECT_IDLE}
      </button>

      {/* P4 item B: Cancel appears with ZERO delay -- `inFlightCancelKey` alone gates it, exactly
          like `FilterPanel`'s own `isScanInFlight(scanState)` gate on its Cancel button. Reaches the
          SAME `cancel_key` `runAdmitPath` minted for whichever open (plain or resubmit) is running. */}
      {inFlightCancelKey !== null && (
        <button
          type="button"
          className="admission-open-cancel"
          onClick={() =>
            requestOpenCancel(state, (cancelKey) => {
              cancelledKeys.current.add(cancelKey);
              return cancelClient(cancelKey);
            })
          }
        >
          Cancel
        </button>
      )}

      {openLivenessMessage && (
        <div className="admission-open-liveness" role="status">
          <span className="admission-open-liveness-spinner" aria-hidden="true" />
          {openLivenessMessage}
        </div>
      )}

      {state.kind === "idle" && state.note && <p className="admission-open-cancelled-note">{state.note}</p>}

      {/* Identity-declaration-route-for-session-tier: a file that opened on the session tier is offered the declaration beside the Open buttons. The offer renders only in the `admitted` state, where
          `isOpenInFlight` is false, so the form is never disabled here; its submit is `admitPath` with `declarationOptions`, the same function a remediation submit uses. */}
      {declareOffer !== null && (
        <details className="admission-declare-identity">
          <summary>{DECLARE_IDENTITY_LABEL}</summary>
          <p className="admission-declare-identity-first-line">{DECLARE_IDENTITY_FIRST_LINE}</p>
          <IdentityDeclarationForm
            candidateColumns={declareOffer.candidateColumns}
            disabled={false}
            onSubmit={(identity) => void admitPath(declareOffer.path, declarationOptions(declareOffer, identity))}
          />
        </details>
      )}

      {/* S8 (B2 piece 1c): the reopen's question. A choice re-enters the run with its answer and a fresh key; the third ends the run. */}
      {state.kind === "question" && (
        <div className="admission-reopen-question" role="group">
          <p>{QUESTION_TEXT}</p>
          <button type="button" className="admission-reopen-copy" onClick={() => void reopenPath(state.folder, { answer: "copy", relink: state.options.reopen?.relink ?? null })}>
            {QUESTION_COPY}
          </button>
          <button type="button" className="admission-reopen-same" onClick={() => void reopenPath(state.folder, { answer: "same", relink: state.options.reopen?.relink ?? null })}>
            {QUESTION_SAME}
          </button>
          <button type="button" className="admission-reopen-cancel" onClick={() => setState({ kind: "idle", note: null })}>
            {QUESTION_CANCEL}
          </button>
        </div>
      )}

      {/* S11 or S11-none: the data file was not found. `fileName` is bounded already (`admitProject`). */}
      {state.kind === "not_found" && (
        <div className="admission-reopen-not-found">
          <p>{fileNotFoundNotice(state.fileName)}</p>
          <button type="button" className="admission-reopen-relink" onClick={() => void handleRelink(state.folder, state.options)}>
            {RELINK_CHOICE}
          </button>
        </div>
      )}

      {state.kind === "refused" && (
        <>
          <RefusalBlock refusal={state.refusal} reopen={state.options.reopen !== undefined} owner={state.owner ?? null} />
          {/* Item 73: the refusal at the recorded place offers the same choice S11 does; `handleRelink` and the run's own options are unchanged. */}
          {offer !== null && (
            <button type="button" className="admission-reopen-relink" onClick={() => void handleRelink(offer.folder, offer.options)}>
              {RELINK_CHOICE}
            </button>
          )}
          {state.formFamily === "crs" && (
            <>
              {/* MF2 honesty requirement: a carried identity option is the operator's own earlier
                  claim, not a silent addition (no I2 concern), but it must be visible, not silent. */}
              {state.options.identity && (
                <p className="admission-carried-option">
                  This attempt will also include your identity declaration (column:{" "}
                  {state.options.identity.column}).
                </p>
              )}
              <CrsAssertionForm
                disabled={state.inFlight}
                onSubmit={(crsAssertion) => void admitPath(state.path, { ...state.options, crsAssertion })}
              />
            </>
          )}
          {state.formFamily === "identity" && (
            <>
              {state.options.crsAssertion && (
                <p className="admission-carried-option">
                  This attempt will also include your CRS assertion ({state.options.crsAssertion.identifier},
                  asserted this session).
                </p>
              )}
              <IdentityDeclarationForm
                candidateColumns={splitCandidateColumns(fieldValue(state.refusal, "candidate_columns"))}
                disabled={state.inFlight}
                onSubmit={(identity) => void admitPath(state.path, { ...state.options, identity })}
              />
            </>
          )}
        </>
      )}
    </div>
  );
});

export default AdmissionPanel;
