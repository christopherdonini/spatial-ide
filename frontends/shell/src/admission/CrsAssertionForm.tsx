// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useState } from "react";

import { crsCatalog, CrsCatalogEntry } from "../skp/crsCatalog";
import type { CrsAssertion } from "../skp/types";
import {
  buildCrsAssertion,
  CrsAssertionFormState,
  definitionValidationMessage,
  initialCrsAssertionFormState,
  suggestedIdentifierFor,
} from "./crsAssertionState";

interface Props {
  disabled: boolean;
  onSubmit: (assertion: CrsAssertion) => void;
}

/**
 * The `engine.crs_undeclared` remediation form (NEXT-CUT.md P3 item B). Re-enters `admitDataset`
 * via `AdmissionPanel`'s own `admitPath` -- this component never calls `admitDataset`/`openDataset`
 * itself, only `onSubmit`.
 *
 * ADR-026 decision 1: two equal routes to a definition -- pick a pinned catalog entry (full
 * PROJJSON shown before picking, `<details>` is a click to expand, never a hover) or paste one
 * verbatim. Neither starts selected (this cut's own I2 principle, applied here too, not just to
 * identity candidates) -- `initialCrsAssertionFormState` starts with no route and no entry chosen.
 */
export default function CrsAssertionForm({ disabled, onSubmit }: Props) {
  const [catalog, setCatalog] = useState<CrsCatalogEntry[]>([]);
  const [state, setState] = useState<CrsAssertionFormState>(initialCrsAssertionFormState());

  useEffect(() => {
    let cancelled = false;
    void crsCatalog().then((entries) => {
      if (!cancelled) setCatalog(entries);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const assertion = buildCrsAssertion(state, catalog);
  // P4 item D (P3c's dangling item): `buildCrsAssertion` already refuses silently -- `assertion`
  // is `null` -- when the pasted definition is over `MAX_CRS_DEFINITION_BYTES`; this is the SAME
  // `null` a not-yet-filled-in form produces, so `definitionValidationMessage` is what tells the
  // two apart and says why, rather than the Submit button simply staying disabled with no
  // explanation. Submit was already blocked in this state (`assertion === null` below); this only
  // makes the UI say why instead of staying silent.
  const definitionMessage = definitionValidationMessage(state, catalog);

  return (
    <form
      className="crs-assertion-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (assertion !== null) onSubmit(assertion);
      }}
    >
      <p className="crs-assertion-claim-notice">
        This records a CLAIM you are making about this file&#39;s coordinate reference system --
        recorded with who asserted it and when. Nothing is saved: reopening this file will ask you
        to assert again.
      </p>

      <fieldset className="crs-assertion-catalog">
        <legend>Pick a pinned definition</legend>
        {catalog.length === 0 && <p>Loading the pinned catalog&#8230;</p>}
        {catalog.map((entry) => (
          <div className="crs-assertion-entry" key={entry.id}>
            <label>
              <input
                type="radio"
                name="crs-assertion-route"
                checked={state.route === "catalog" && state.selectedEntryId === entry.id}
                onChange={() =>
                  setState((s) => ({
                    ...s,
                    route: "catalog",
                    selectedEntryId: entry.id,
                    identifier: s.identifier.trim().length > 0 ? s.identifier : suggestedIdentifierFor(entry),
                  }))
                }
              />
              {entry.name} ({entry.authority}:{entry.code})
            </label>
            <details>
              <summary>Full definition</summary>
              <pre className="crs-assertion-definition">{entry.definition}</pre>
            </details>
          </div>
        ))}
      </fieldset>

      <fieldset>
        <legend>Or paste a definition</legend>
        <label>
          <input
            type="radio"
            name="crs-assertion-route"
            checked={state.route === "paste"}
            onChange={() => setState((s) => ({ ...s, route: "paste" }))}
          />
          Paste a PROJJSON definition verbatim
        </label>
        <textarea
          className="crs-assertion-paste"
          value={state.pastedDefinition}
          onChange={(e) => setState((s) => ({ ...s, route: "paste", pastedDefinition: e.target.value }))}
        />
        {definitionMessage !== null && (
          <p className="crs-assertion-definition-validation" role="alert">
            {definitionMessage}
          </p>
        )}
      </fieldset>

      <label className="crs-assertion-identifier">
        Identifier
        <input
          type="text"
          value={state.identifier}
          onChange={(e) => setState((s) => ({ ...s, identifier: e.target.value }))}
        />
      </label>
      {/* SF9: the identifier is the one field a catalog pick populates from something other than
          the operator's own keystrokes -- said plainly so the operator knows they own a string
          they did not type, and that it is still theirs to edit. */}
      {state.route === "catalog" && (
        <p className="crs-assertion-identifier-hint">Filled from your catalog pick — edit if it should differ.</p>
      )}

      <button type="submit" disabled={disabled || assertion === null}>
        Assert this CRS
      </button>
    </form>
  );
}
