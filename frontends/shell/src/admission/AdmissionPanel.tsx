// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useCallback, useEffect, useState } from "react";

import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
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
  | { kind: "idle" }
  | { kind: "opening" }
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
    }
  | { kind: "admitted"; admitted: Admitted };

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
  // MF1: a remediation submit against the SAME refused path keeps `kind: "refused"` (only marking
  // `inFlight`), never resets to the bare `{kind: "opening"}` a plain first-open (or a fresh path)
  // uses -- see the `State["refused"]["inFlight"]` doc comment above for what that reset used to
  // break.
  deps.setState((prev) =>
    prev.kind === "refused" && prev.path === path ? { ...prev, inFlight: true } : { kind: "opening" }
  );

  const cancelKey = deps.makeCancelKey();
  const outcome = await deps.admit(path, cancelKey, options);

  if (outcome.kind === "refused") {
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
  const [state, setState] = useState<State>({ kind: "idle" });

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
    if (!import.meta.env.DEV) return;
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

  return (
    <div className="admission-panel">
      <button type="button" onClick={() => void handlePick()} disabled={state.kind === "opening"}>
        {state.kind === "opening" ? "Opening…" : "Open GeoParquet…"}
      </button>

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
