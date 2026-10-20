// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.5 (PR B): the filter clauses of a view, pure. A clause is a text, switched on or off; the
 * enabled clauses combine into the one `Filter` the kernel receives (`combineClauses`), and the kernel alone admits or refuses it.
 *
 * **What the shell decides here, and what it does not (OPEN-3 (A), Amendment 1 item 4).** `recognizeSimple` decides only whether a text can be shown
 * as a card next to other cards. It is a test of how a text is shown, never an admission: it returns a yes or a no, never a rewritten text, and a
 * text it does not accept is an advanced card that stays whole and goes alone. ADR-021 rule 6's refusal of a second grammar governs admission, which
 * stays the kernel's. The texts are never trimmed, case-folded or ceilinged here; the kernel's byte and depth ceilings refuse by name.
 */

import type { Filter } from "../skp/types";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";

/** `clause-<n>`: minted per view and session, never persisted. */
export type ClauseId = `clause-${number}`;

export interface FilterClause {
  readonly id: ClauseId;
  /** The condition, byte for byte as it was typed. */
  readonly text: string;
  readonly enabled: boolean;
}

/** No clauses: the one shared empty list. */
export const NO_CLAUSES: readonly FilterClause[] = [];

/**
 * The Filter of the enabled clauses, in list order: none gives `null`; one gives its text byte for byte (so a single card sends exactly what the
 * panel sends); two or more give each text inside one pair of brackets, joined by ` AND `. A clause that is off is left out before combining.
 */
export function combineClauses(clauses: readonly FilterClause[]): Filter | null {
  const on = clauses.filter((clause) => clause.enabled);
  if (on.length === 0) return null;
  const predicate = on.length === 1 ? on[0].text : on.map((clause) => `(${clause.text})`).join(" AND ");
  return { predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };
}

// The recognizer's pieces (section 2.5). A name is a bare identifier or a double-quoted name with "" for an embedded quote; a literal is a number or a
// single-quoted string with '' for an embedded quote. Spaces between tokens are optional where the tokens cannot run together, and keywords match
// case-insensitively.
const NAME = String.raw`(?:[A-Za-z_][A-Za-z0-9_]*|"(?:[^"]|"")*")`;
const NUMBER = String.raw`-?[0-9]+(?:\.[0-9]+)?`;
const STRING = String.raw`'(?:[^']|'')*'`;
const LITERAL = `(?:${NUMBER}|${STRING})`;
const COMPARISON = String.raw`(?:==|<>|!=|<=|>=|=|<|>)`;
const SIMPLE_FORMS: readonly RegExp[] = [
  `^\\s*${NAME}\\s*${COMPARISON}\\s*${LITERAL}\\s*$`,
  `^\\s*${NAME}\\s+IS\\s+(?:NOT\\s+)?NULL\\s*$`,
  `^\\s*${NAME}\\s+(?:NOT\\s+)?IN\\s*\\(\\s*${LITERAL}(?:\\s*,\\s*${LITERAL})*\\s*\\)\\s*$`,
  `^\\s*${NAME}\\s+(?:NOT\\s+)?BETWEEN\\s+${LITERAL}\\s+AND\\s+${LITERAL}\\s*$`,
  `^\\s*${NAME}\\s+(?:NOT\\s+)?(?:I?LIKE)\\s+${STRING}\\s*$`,
].map((source) => new RegExp(source, "i"));

/** Whether `text` is one of the simple forms: a name, then a comparison with a literal, `IS [NOT] NULL`, `[NOT] IN` a literal list, `[NOT] BETWEEN` two literals, or `[NOT] LIKE` / `ILIKE` a string. */
export function recognizeSimple(text: string): boolean {
  return SIMPLE_FORMS.some((form) => form.test(text));
}

/** What a user asked of the cards. An add carries the text; the other two name a clause. */
export type ClauseRequest =
  | { readonly kind: "add"; readonly text: string }
  | { readonly kind: "setEnabled"; readonly clause: ClauseId; readonly enabled: boolean }
  | { readonly kind: "remove"; readonly clause: ClauseId };

/** The same change as a transition carries it: the clause is named by its id, so a later collapse of a clause's toggles can find it (plan section 10.3). */
export type ClauseStep =
  | { readonly kind: "add"; readonly clause: ClauseId }
  | { readonly kind: "setEnabled"; readonly clause: ClauseId; readonly enabled: boolean }
  | { readonly kind: "remove"; readonly clause: ClauseId };

export type ClauseProposal =
  | { readonly kind: "propose"; readonly clauses: readonly FilterClause[]; readonly filter: Filter | null; readonly step: ClauseStep }
  /** `blocking` is a card that is on and stands in the way. */
  | { readonly kind: "refuse"; readonly reason: "advanced-alone"; readonly blocking: ClauseId };

/**
 * What the cards would be after `request`, or why the shell will not send it. Under OPEN-3 (A) an advanced clause goes alone: adding or turning on an advanced clause while any other card is on, and
 * adding or turning on any clause while an advanced card is on, are refused. A card that is off blocks nothing, and turning one off or removing one is never refused.
 */
export function proposeClauseChange(clauses: readonly FilterClause[], request: ClauseRequest, mintId: () => ClauseId): ClauseProposal {
  const propose = (next: readonly FilterClause[], step: ClauseStep): ClauseProposal => ({ kind: "propose", clauses: next, filter: combineClauses(next), step });
  /** The card, if any, that stops `candidate` from being on beside the cards that are on. */
  const blockerOf = (candidate: FilterClause, others: readonly FilterClause[]): FilterClause | undefined => {
    const on = others.filter((clause) => clause.enabled);
    return recognizeSimple(candidate.text) ? on.find((clause) => !recognizeSimple(clause.text)) : on[0];
  };
  switch (request.kind) {
    case "add": {
      const added: FilterClause = { id: mintId(), text: request.text, enabled: true };
      const blocker = blockerOf(added, clauses);
      return blocker === undefined ? propose([...clauses, added], { kind: "add", clause: added.id }) : { kind: "refuse", reason: "advanced-alone", blocking: blocker.id };
    }
    case "setEnabled": {
      const target = clauses.find((clause) => clause.id === request.clause);
      const others = clauses.filter((clause) => clause.id !== request.clause);
      const blocker = target !== undefined && request.enabled ? blockerOf(target, others) : undefined;
      if (blocker !== undefined) return { kind: "refuse", reason: "advanced-alone", blocking: blocker.id };
      const next = clauses.map((clause) => (clause.id === request.clause ? { ...clause, enabled: request.enabled } : clause));
      return propose(next, { kind: "setEnabled", clause: request.clause, enabled: request.enabled });
    }
    case "remove":
      return propose(clauses.filter((clause) => clause.id !== request.clause), { kind: "remove", clause: request.clause });
  }
}

/** The number in a `clause-<n>` id. */
export const clauseNumber = (id: ClauseId): number => Number(id.slice("clause-".length));
