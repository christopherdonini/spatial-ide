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
  /** Schema order, as `engine.identity_unusable`'s `candidate_columns` field carried it -- never
   * re-sorted or ranked here (ADR-016 §3-§7). May be empty (the file carries no 64-bit integer
   * column at all); the free-text route stays available either way. */
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
      <p className="identity-declaration-cost-notice">
        Declaring a column here triggers a whole-dataset uniqueness check when this file is opened.
        A wrong declaration is refused only after that full scan of the dataset runs -- retrying a
        failed declaration is not free. Nothing is saved: reopening this file will ask you to
        declare again.
      </p>

      {candidateColumns.length > 0 && (
        <fieldset>
          <legend>Candidate columns (schema order, unranked)</legend>
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
