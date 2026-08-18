// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { FormattedRefusal, refusalGuidance } from "./formatRefusal";

/**
 * The shared refusal presentational block -- extracted from `AdmissionPanel.tsx` (NEXT-CUT.md
 * filter-panel cut P3) so `FilterPanel`'s own inline refusal display (`.filter-refusal`) renders the
 * IDENTICAL markup a dataset-open refusal already does, rather than a second, drifting copy.
 *
 * **Class names preserved byte-exactly** (`e2e/regression.mjs`'s `stepRefusal` helper, steps B2'/C3',
 * asserts these directly): `.admission-refusal` (the outer `role="alert"` container),
 * `.admission-refusal-code`, `.admission-refusal-message`, `.admission-refusal-fields` (+ its `dt`/
 * `dd` pairs). No `<button>` is rendered here -- `stepRefusal` also asserts `hasButton === false`
 * (a refusal panel has no dismiss control of its own; the caller decides whether/how it goes away,
 * e.g. `AdmissionPanel`'s own `state` replacement on the next admission attempt, or `FilterPanel`'s
 * own next Apply/Clear). This is exactly why the admission-remediation forms (NEXT-CUT.md P3,
 * `CrsAssertionForm`/`IdentityDeclarationForm`) are NOT rendered here: they carry a real Submit
 * `<button>`, so `AdmissionPanel` renders them as siblings of this block, never inside it -- the
 * blanket cut-2 note this block used to render (`remediationIsCut2` + a fixed sentence) is gone
 * entirely (NEXT-CUT.md P3 item G); `refusalGuidance` below replaces it with copy specific to the
 * one code (I1) and the two codes (D) that need product framing beyond `message`.
 */
export default function RefusalBlock({ refusal }: { refusal: FormattedRefusal }) {
  const guidance = refusalGuidance(refusal.code);
  return (
    <div className="admission-refusal" role="alert">
      <div className="admission-refusal-code">{refusal.code}</div>
      <p className="admission-refusal-message">{refusal.message}</p>
      {refusal.fields.length > 0 && (
        <dl className="admission-refusal-fields">
          {refusal.fields.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {guidance !== null && <p className="admission-refusal-guidance">{guidance}</p>}
    </div>
  );
}
