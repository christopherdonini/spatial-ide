// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useCallback, useEffect, useState } from "react";

import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import { isInstrumentedBuild } from "../isInstrumentedBuild";
import { cancel as cancelClient } from "../skp/client";
import { crsCatalog } from "../skp/crsCatalog";
import { pickFile } from "../skp/dialog";
import { admitDataset, AdmitOptions, Admitted, AdmissionOutcome } from "./admitDataset";
import { splitCandidateColumns } from "./candidateColumns";
import CrsAssertionForm from "./CrsAssertionForm";
import DescribeSummary from "./DescribeSummary";
import { fieldValue, FormattedRefusal } from "./formatRefusal";
import IdentityDeclarationForm from "./IdentityDeclarationForm";
import RefusalBlock from "./RefusalBlock";

/** Which remediation form, if any, stays reachable for the CURRENT refusal (NEXT-CUT.md P3 item
 * D: "the form still reachable — no dead end"). `null` means no form renders. */
export type FormFamily = "crs" | "identity" | null;

/** The family a refusal CODE alone establishes -- `null` for any code that does not, on its own,
 * open a remediation flow (`nextFormFamily` below is what decides whether a family carries
 * forward from a PRIOR refusal in the same remediation attempt). */
export function formFamilyForCode(code: string): FormFamily {
  if (code === "engine.crs_undeclared") return "crs";
  if (code === "engine.identity_unusable") return "identity";
  return null;
}

/**
 * The form family to show for a NEW refusal, given whichever family (if any) was already active.
 *
 * - `engine.crs_assertion_conflict` is refused to `null` unconditionally (I1: this code NEVER
 *   gets a remediation control, no matter what came before).
 * - A code that starts its own family (`engine.crs_undeclared`, `engine.identity_unusable`) always
 *   wins, even over a different prior family -- a fresh refusal of that shape means the operator's
 *   remediation attempt has to start (or restart) there.
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
    }
  | { kind: "admitted"; admitted: Admitted };

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
}

/**
 * The admission flow's state-transition logic, isolated from the `useState`/`useCallback` plumbing
 * around it so it is directly testable without a render harness (SF11, reviewer gate, admission-
 * remediation cut) -- this package's own convention for exactly this reason
 * (`crsAssertionState.ts`'s top comment), applied one level up to the panel's own transition
 * rather than a single form's. `AdmissionPanel`'s `admitPath` below is a thin wrapper supplying the
 * real `admitDataset`, the real `setState`, and a real cancel key; a test supplies its own `deps`
 * and inspects the `State` values `setState` was called with directly.
 */
export async function runAdmitPath(
  path: string,
  options: AdmitOptions,
  deps: AdmitPathDeps
): Promise<AdmissionOutcome> {
  // Minted BEFORE the first `setState` (P4, unlike this function's pre-P4 shape, which minted it
  // only after) so it is already sitting in `State` -- reachable by `openCancelKey` from render --
  // the instant `kind` becomes `"opening"` (or `inFlight` becomes `true`), not only once `admit()`
  // resolves.
  const cancelKey = deps.makeCancelKey();

  // MF1: a remediation submit against the SAME refused path keeps `kind: "refused"` (only marking
  // `inFlight`), never resets to the bare `{kind: "opening"}` a plain first-open (or a fresh path)
  // uses -- see the `State["refused"]["inFlight"]` doc comment above for what that reset used to
  // break.
  deps.setState((prev) =>
    prev.kind === "refused" && prev.path === path
      ? { ...prev, inFlight: true, cancelKey, pendingOptions: options }
      : { kind: "opening", cancelKey, options }
  );

  const outcome = await deps.admit(path, cancelKey, options);

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
        formFamily: nextFormFamily(priorFamily, outcome.refusal.code),
        options,
        inFlight: false,
        cancelKey: null,
        pendingOptions: null,
      };
    });
    return outcome;
  }

  deps.setState(() => ({ kind: "admitted", admitted: outcome.admitted }));
  deps.onAdmitted(outcome.admitted);
  return outcome;
}

interface Props {
  onAdmitted: (admitted: Admitted) => void;
}

/**
 * The admission flow as product truth (NEXT-CUT.md): a file picker, then `open_dataset`'s verdict
 * rendered directly. Success renders `DescribeSummary`; every typed refusal is shown with its full
 * reason, verbatim -- the refusal UX *is* the feature. NEXT-CUT.md P3 adds the two remediation
 * forms (`CrsAssertionForm`/`IdentityDeclarationForm`), both re-entering `admitPath` below -- the
 * SAME function a plain retry uses, just with `AdmitOptions` set -- never a parallel admission
 * path.
 */
export default function AdmissionPanel({ onAdmitted }: Props) {
  const [state, setState] = useState<State>({ kind: "idle", note: null });

  // The one piece of the manual flow a path string can't replay itself -- everything from here
  // down is the product's own admission behavior, unchanged by the E2E hook registered below.
  // `runAdmitPath` above holds the actual transition logic; this wrapper only supplies the real
  // dependencies (see `runAdmitPath`'s own doc comment for why the split exists).
  const admitPath = useCallback(
    (path: string, options: AdmitOptions = {}): Promise<AdmissionOutcome> =>
      runAdmitPath(path, options, {
        admit: admitDataset,
        setState,
        onAdmitted,
        makeCancelKey: () =>
          typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `open-${Date.now()}-${Math.random()}`,
      }),
    [onAdmitted]
  );

  const handlePick = useCallback(async () => {
    const path = await pickFile();
    if (path === null) {
      return; // the operator cancelled the picker; not a refusal, not an error
    }
    await admitPath(path);
  }, [admitPath]);

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

  return (
    <div className="admission-panel">
      <button type="button" onClick={() => void handlePick()} disabled={isOpenInFlight(state)}>
        {state.kind === "opening" ? "Opening…" : "Open GeoParquet…"}
      </button>

      {/* P4 item B: Cancel appears with ZERO delay -- `inFlightCancelKey` alone gates it, exactly
          like `FilterPanel`'s own `isScanInFlight(scanState)` gate on its Cancel button. Reaches the
          SAME `cancel_key` `runAdmitPath` minted for whichever open (plain or resubmit) is running. */}
      {inFlightCancelKey !== null && (
        <button
          type="button"
          className="admission-open-cancel"
          onClick={() => requestOpenCancel(state, cancelClient)}
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

      {state.kind === "refused" && (
        <>
          <RefusalBlock refusal={state.refusal} />
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

      {state.kind === "admitted" && <DescribeSummary describe={state.admitted.describe} />}
    </div>
  );
}
