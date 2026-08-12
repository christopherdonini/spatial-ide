import { useCallback, useEffect, useState } from "react";

import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import { pickFile } from "../skp/dialog";
import { admitDataset, Admitted, AdmissionOutcome } from "./admitDataset";
import DescribeSummary from "./DescribeSummary";
import { FormattedRefusal } from "./formatRefusal";

type State =
  | { kind: "idle" }
  | { kind: "opening" }
  | { kind: "refused"; refusal: FormattedRefusal }
  | { kind: "admitted"; admitted: Admitted };

interface Props {
  onAdmitted: (admitted: Admitted) => void;
}

/**
 * The admission flow as product truth (NEXT-CUT.md): a file picker, then `open_dataset`'s verdict
 * rendered directly. Success renders `DescribeSummary`; every typed refusal is shown with its full
 * reason, verbatim -- the refusal UX *is* the feature.
 */
export default function AdmissionPanel({ onAdmitted }: Props) {
  const [state, setState] = useState<State>({ kind: "idle" });

  // The one piece of the manual flow a path string can't replay itself -- everything from here
  // down is the product's own admission behavior, unchanged by the E2E hook registered below.
  const admitPath = useCallback(
    async (path: string): Promise<AdmissionOutcome> => {
      setState({ kind: "opening" });
      const cancelKey =
        typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `open-${Date.now()}-${Math.random()}`;
      const outcome = await admitDataset(path, cancelKey);
      if (outcome.kind === "refused") {
        setState({ kind: "refused", refusal: outcome.refusal });
        return outcome;
      }
      setState({ kind: "admitted", admitted: outcome.admitted });
      onAdmitted(outcome.admitted);
      return outcome;
    },
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
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    registerE2eHook("openPath", async (path: string) => {
      const outcome = await admitPath(path);
      return outcome.kind === "refused"
        ? { kind: "refused", code: outcome.refusal.code, message: outcome.refusal.message }
        : { kind: "admitted" };
    });
    return () => unregisterE2eHook("openPath");
  }, [admitPath]);

  return (
    <div className="admission-panel">
      <button type="button" onClick={() => void handlePick()} disabled={state.kind === "opening"}>
        {state.kind === "opening" ? "Opening…" : "Open GeoParquet…"}
      </button>

      {state.kind === "refused" && (
        <div className="admission-refusal" role="alert">
          <div className="admission-refusal-code">{state.refusal.code}</div>
          <p className="admission-refusal-message">{state.refusal.message}</p>
          {state.refusal.fields.length > 0 && (
            <dl className="admission-refusal-fields">
              {state.refusal.fields.map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {state.refusal.remediationIsCut2 && (
            <p className="admission-cut2-note">
              Remediation (asserting a CRS, or declaring an identity-mapping column) is cut-2
              work — not available in this build.
            </p>
          )}
        </div>
      )}

      {state.kind === "admitted" && <DescribeSummary describe={state.admitted.describe} />}
    </div>
  );
}
