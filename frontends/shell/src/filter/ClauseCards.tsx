// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useState } from "react";

import RefusalBlock from "../admission/RefusalBlock";
import { recognizeSimple } from "../workspace/filterClauses";
import type { ClauseRequest, ClauseResult, FilterClause } from "../workspace/filterClauses";

/**
 * The filter clauses as cards (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.6, PR B), in the Filter section after `FilterPanel`. Each card shows its text verbatim (it wraps), a switch
 * (`role="switch"`), a Remove button and, under OPEN-3 (A), a mark when the text is not one of the simple forms and so can only be used on its own. One statement shows whenever any card
 * exists. A change goes to App (`onChange`), which asks the kernel for the one combined filter and answers with a `ClauseResult`; the cards are what App's view holds, so a refused or
 * not-applied change leaves them as they were. A refusal is shown at the cards' foot, the kernel's own as `RefusalBlock` shows it under the shell's lead line. While a change is pending
 * the controls are `aria-disabled` and a click shows the busy line. Every operator string is a P6 placeholder.
 */

export const CLAUSE_STATEMENT = "[P6 placeholder] Cards that are on are combined with AND. The filter keeps only features that meet every card that is on.";
export const CLAUSE_ON_LABEL = "[P6 placeholder] On";
export const CLAUSE_REMOVE_LABEL = "[P6 placeholder] Remove";
export const CLAUSE_ADVANCED_MARK = "[P6 placeholder] Expression, used on its own";
export const CLAUSE_REFUSED_LINE = "[P6 placeholder] Not applied. Your filter cards are unchanged.";
export const CLAUSE_NOT_APPLIED_LINE = "[P6 placeholder] Not applied. Try again.";
export const CLAUSE_BUSY_LINE = "[P6 placeholder] A filter change is still being applied.";
export const CLAUSE_ADVANCED_NEW_LINE = "[P6 placeholder] Not applied: this condition is not one of the simple forms, so it can only be used on its own. Turn off the other cards first.";
export const clauseBlockedLine = (text: string): string => `[P6 placeholder] Not applied: the card ${text} can only be used on its own. Turn it off first.`;

/**
 * The shell's own line for a change that was not applied, or `null` for one that was. The kernel's refusal follows it in `RefusalBlock`; the lines state only the shell's consequence.
 * A card that is on and in the way is either an expression (the card is named, since it is the one to turn off) or a simple card (the new condition is the expression).
 */
export function clauseResultLine(result: ClauseResult): string | null {
  switch (result.kind) {
    case "applied":
      return null;
    case "refused":
      return CLAUSE_REFUSED_LINE;
    case "shell-refused":
      return recognizeSimple(result.blocking.text) ? CLAUSE_ADVANCED_NEW_LINE : clauseBlockedLine(result.blocking.text);
    case "not-applied":
      return CLAUSE_NOT_APPLIED_LINE;
    case "busy":
      return CLAUSE_BUSY_LINE;
  }
}

export interface ClauseCardsProps {
  readonly clauses: readonly FilterClause[];
  /** A bar or card change is pending: the controls are `aria-disabled`. */
  readonly pending: boolean;
  readonly onChange: (request: ClauseRequest) => Promise<ClauseResult>;
}

export default function ClauseCards({ clauses, pending, onChange }: ClauseCardsProps) {
  const [result, setResult] = useState<ClauseResult | null>(null);
  const line = result === null ? null : clauseResultLine(result);

  async function change(request: ClauseRequest): Promise<void> {
    if (pending) return setResult({ kind: "busy" });
    setResult(null);
    const outcome = await onChange(request);
    setResult(outcome.kind === "applied" ? null : outcome);
  }

  return (
    <div className="clause-cards">
      {clauses.length > 0 && <p className="clause-statement">{CLAUSE_STATEMENT}</p>}
      {clauses.length > 0 && (
        <ul className="clause-list">
          {clauses.map((clause) => (
            <li key={clause.id} className={clause.enabled ? "clause-card" : "clause-card clause-card-off"} data-clause={clause.id}>
              <span className="clause-text">{clause.text}</span>
              {!recognizeSimple(clause.text) && <span className="clause-advanced">{CLAUSE_ADVANCED_MARK}</span>}
              <button
                type="button"
                role="switch"
                className="clause-switch"
                aria-checked={clause.enabled}
                aria-disabled={pending ? true : undefined}
                aria-label={`${CLAUSE_ON_LABEL}: ${clause.text}`}
                onClick={() => void change({ kind: "setEnabled", clause: clause.id, enabled: !clause.enabled })}
              >
                {CLAUSE_ON_LABEL}
              </button>
              <button
                type="button"
                className="clause-remove"
                aria-disabled={pending ? true : undefined}
                aria-label={`${CLAUSE_REMOVE_LABEL}: ${clause.text}`}
                onClick={() => void change({ kind: "remove", clause: clause.id })}
              >
                {CLAUSE_REMOVE_LABEL}
              </button>
            </li>
          ))}
        </ul>
      )}
      {line !== null && result !== null && (
        <div className="clause-foot" role="status">
          <p className="clause-line">{line}</p>
          {result.kind === "refused" && (
            <div className="clause-refusal">
              <RefusalBlock refusal={result.refusal} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
