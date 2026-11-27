// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useState } from "react";

import type { IdentityDeclaration } from "../skp/types";
import {
  buildIdentityDeclaration,
  IdentityFormState,
  initialIdentityFormState,
} from "./identityDeclarationState";

interface Props {
  /** Schema order, as the engine gave it -- never re-sorted or ranked here (ADR-016 §3-§7). It has two sources: `engine.identity_unusable`'s `candidate_columns`
   * field, for a refused file, and `describe.identity.candidate_columns`, for a file opened on the session tier (`skp/0.15`; ADR-016 Amendment 2). May be empty (the
   * file carries no integer column the engine lists at all); the free-text route stays available either way. */
  candidateColumns: string[];
  disabled: boolean;
  onSubmit: (identity: IdentityDeclaration) => void;
}

/**
 * The `engine.identity_unusable` remediation form (NEXT-CUT.md P3 item C). Re-enters
 * `admitDataset` via `AdmissionPanel`'s own `admitPath` -- this component never calls
 * `admitDataset`/`openDataset` itself, only `onSubmit`.
 *
 * I2: candidates render unranked, in schema order, and NONE preselected -- true even when
 * `candidateColumns` has exactly one entry (`initialIdentityFormState` never looks at the list at
 * all, so there is nothing here that could special-case a singleton into an auto-pick). A free-text
 * column name is an equal route (ADR-016 §3-§7's "never inferred" extends to "never restricted to
 * what the engine happened to suggest") -- a name that is not a real column is left for the engine
 * to refuse honestly on the next open, not rejected client-side.
 */
export default function IdentityDeclarationForm({ candidateColumns, disabled, onSubmit }: Props) {
  const [state, setState] = useState<IdentityFormState>(initialIdentityFormState());

  const declaration = buildIdentityDeclaration(state);

  return (
    <form
      className="identity-declaration-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (declaration !== null) onSubmit(declaration);
      }}
    >
      {/* D3 (identity-declaration-route-for-session-tier), the advisor's words under the human's delegation of 2026-11-13 (ADV-2026-11-23-26 item 2), not the human's; shown as the words commit set it, and shown on both routes. It replaces the cost notice an agent wrote, which said that nothing is saved and that a reopen asks again.
          What the notice does not say, for this comment and not for ordinary use: an integer column whose name holds U+0000 is refused before any scan, as is a column that is not
          there, one nothing can address and one that is not an integer (`engine/src/dataset.rs`, the identity block of `admit_identity`); a column that is empty in some row is refused
          only after the scan, by the repeat check; and a Cancel during the scan ends as a cancelled open, not as a refusal. */}
      <p className="identity-declaration-cost-notice">
        Declaring an integer column checks it across the whole file for uniqueness when the file is opened. A column whose values repeat, or that holds a negative value, is refused only after that scan, so a retry is not free. The declaration lasts while the file is open; a project saved afterwards records it, and opening that project checks the column again.
      </p>

      {candidateColumns.length > 0 && (
        <fieldset className="identity-declaration-candidate-list">
          {/* The legend and the hint below are the advisor's words under the human's delegation of 2026-11-13 (ADV-2026-11-26-04 item 4), not the human's; each is shown as the words commit set it. The legend names the criterion of the list: the integer widths `admit_column_type` takes, which `candidate_identity_columns` and
              `admit_column_type` both read from one predicate in `engine/src/identity.rs`, in schema order and unranked. Three cases are for this comment and not for ordinary use: an integer column whose name holds a comma is left off the list and can still be declared by typing its name (`engine/src/identity.rs`, `candidate_identity_columns`), a column
              whose name nothing can address is left off the list and is refused if it is declared (`engine/src/dataset.rs`, the addressability check of `admit_identity`), and the free text
              below is trimmed at either end (`identityDeclarationState.ts`, `buildIdentityDeclaration`), so an unlisted name typed with spaces at either end is sent trimmed, while a listed
              name is picked as it is. The hint names the free-text route, which accepts any name, and the checks at open, which are the engine's (`engine/src/dataset.rs`, the identity block of
              `admit_identity`): a missing column, a name nothing can address, a type that is not an integer, a repeat and a negative value. */}
          <legend>Integer columns, schema order, unranked</legend>
          {candidateColumns.map((column) => (
            <label className="identity-declaration-candidate" key={column}>
              <input
                type="radio"
                name="identity-declaration-route"
                checked={state.route === "candidate" && state.selectedColumn === column}
                onChange={() => setState((s) => ({ ...s, route: "candidate", selectedColumn: column }))}
              />
              {column}
            </label>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend>Or type a column name</legend>
        <p className="identity-declaration-free-text-hint">
          A column not listed above can still be typed by name; it is checked when the file is opened.
        </p>
        <label>
          <input
            type="radio"
            name="identity-declaration-route"
            checked={state.route === "freeText"}
            onChange={() => setState((s) => ({ ...s, route: "freeText" }))}
          />
          <input
            type="text"
            className="identity-declaration-free-text"
            value={state.freeTextColumn}
            onChange={(e) =>
              setState((s) => ({ ...s, route: "freeText", freeTextColumn: e.target.value }))
            }
          />
        </label>
      </fieldset>

      <button type="submit" disabled={disabled || declaration === null}>
        Declare this column
      </button>
    </form>
  );
}
