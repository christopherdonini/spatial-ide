// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { combineClauses, proposeClauseChange, recognizeSimple } from "./filterClauses";
import type { ClauseId, ClauseProposal, FilterClause } from "./filterClauses";

/**
 * SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC3 to UC5 (PR B): the clause model, pure. Each `it` is one row, so each carries the one recorded mutation
 * the table names.
 */

const clause = (n: number, text: string, enabled = true): FilterClause => ({ id: `clause-${n}`, text, enabled });
const filterOf = (predicate: string) => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });

// RECORDED MUTATION for "UC3": in `combineClauses` (filterClauses.ts) trim each text (`clause.text.trim()` where the text is read). Expected failure: the whitespace case.
// OBSERVED AT 9a9d1849f3dead11891642b95fe4a4ff0bffc76c: FAILED -- "UC3: none gives null, one gives its text byte for byte, two or more give (t1) AND (t2) in card order, cards that are off are left out, and the dialect is the constant":
//   AssertionError: whitespace and case are kept: expected { Object (predicate, dialect) } to deeply equal { …(2) }. Reverted after observing.
describe("UC3: combineClauses", () => {
  it("UC3: none gives null, one gives its text byte for byte, two or more give (t1) AND (t2) in card order, cards that are off are left out, and the dialect is the constant", () => {
    expect(combineClauses([])).toBeNull();
    expect(combineClauses([clause(1, "a = 1", false)]), "a card that is off is left out: none is on").toBeNull();
    const spaced = "  \"Zone\"   =  'R'  ";
    expect(combineClauses([clause(1, spaced)]), "whitespace and case are kept").toEqual(filterOf(spaced));
    expect(combineClauses([clause(1, "b = 2"), clause(2, "a = 1")])).toEqual(filterOf("(b = 2) AND (a = 1)"));
    expect(combineClauses([clause(1, "a = 1"), clause(2, "b = 2"), clause(3, "c = 3")])?.predicate).toBe("(a = 1) AND (b = 2) AND (c = 3)");
    expect(combineClauses([clause(1, "a = 1"), clause(2, "b = 2", false), clause(3, "c = 3")])?.predicate, "an off card is left out before combining").toBe("(a = 1) AND (c = 3)");
    expect(combineClauses([clause(1, "a = 1", false), clause(2, spaced)]), "one card on among cards that are off: its text, not bracketed").toEqual(filterOf(spaced));
    expect(combineClauses([clause(1, "  a = 1 "), clause(2, " b = 2")])?.predicate, "texts inside the brackets are untrimmed").toBe("(  a = 1 ) AND ( b = 2)");
    expect(combineClauses([clause(1, "a = 1")])?.dialect).toBe(FILTER_DIALECT_DUCKDB_EXPR_0);
    expect(combineClauses([clause(1, "a = 1"), clause(2, "b = 2")])?.dialect).toBe("duckdb-expr/0");
  });
});

// RECORDED MUTATION for "UC4": in `recognizeSimple`'s name pattern (filterClauses.ts, `NAME`) let the bare name's tail class admit a closing bracket (`[A-Za-z0-9_]*` becomes `[A-Za-z0-9_)]*`). Expected failure: the escape row `a)=1`.
// OBSERVED AT 9a9d1849f3dead11891642b95fe4a4ff0bffc76c: FAILED -- "UC4: the simple forms are accepted, literals holding ), -- and '' too, and the escapes and the texts that are not one form are refused":
//   AssertionError: refused: "a)=1": expected true to be false // Object.is equality. Reverted after observing.
describe("UC4: recognizeSimple", () => {
  it("UC4: the simple forms are accepted, literals holding ), -- and '' too, and the escapes and the texts that are not one form are refused", () => {
    const accepted = [
      "a = 1", "a=1", "a == 1", "a <> 'x'", "a != 'x'", "a < -1.5", "a <= 2", "a > 0", "a >= 0", "  a   =   1  ", "A = 'x'", "_x1 = 'a'",
      `"zone" = 'residential'`, `"my ""quoted"" col" = 1`, `"zone"='r'`,
      "a IS NULL", "a is not null", `"zone" IS NOT NULL`,
      "a IN (1, 2, 3)", "a not in ('x','y')", "a IN (1)", "a In ( 1 , 2 )",
      "a BETWEEN 1 AND 2", "a NOT BETWEEN 'a' AND 'b'", "a between 1 and 2",
      "a LIKE 'x%'", "a not like '%y'", "a ILIKE 'z'",
      "a = 'x) OR (1=1'", "a = 'x -- y'", "a = 'x /* y'", "a = 'it''s'", "a = ''", "a IN ('a)', 'b--c', '''')", "a LIKE '%)%'", "a BETWEEN 'a)' AND 'b--'",
    ];
    for (const text of accepted) expect(recognizeSimple(text), `accepted: ${text}`).toBe(true);
    const refused = [
      "a = 1) OR (1=1", "a = 1 --", "a = 1 /*", "a = $$x$$", "a = E'x'", "a = 1 2", "a = 'x' 'y'", "a = 1;",
      "a)=1", "a) = 1", "a(b) = 1", "(a = 1)", "a = 1 OR b = 2", "a = 1 AND b = 2", "NOT a = 1", "a IS NULL OR b = 1",
      "a", "", "   ", "a =", "= 1", "a = b", "a + 1 = 2", "f(a) = 1", "a LIKE 5", "a BETWEEN 1 AND", "a IN ()", "a IN (1,)", "a IN (1 2)", "a IN (SELECT 1)", "a = 1.", "a = .5", "a = +1", "a = 'x",
    ];
    for (const text of refused) expect(recognizeSimple(text), `refused: ${JSON.stringify(text)}`).toBe(false);
  });
});

const SIMPLE = "a = 1";
const ADVANCED = "a = 1 OR b = 2";

function mint(from: number): () => ClauseId {
  let n = from;
  return () => `clause-${n++}`;
}
const propose = (clauses: readonly FilterClause[], request: Parameters<typeof proposeClauseChange>[1], from = 10): ClauseProposal => proposeClauseChange(clauses, request, mint(from));
const refusedBy = (proposal: ClauseProposal): string | null => (proposal.kind === "refuse" ? proposal.blocking : null);

// RECORDED MUTATION for "UC5": in `proposeClauseChange`'s `blockerOf` (filterClauses.ts) ignore `enabled` (`const on = others;` for `others.filter((clause) => clause.enabled)`). Expected failure: the off-card row.
// OBSERVED AT 9a9d1849f3dead11891642b95fe4a4ff0bffc76c: FAILED -- "UC5: simple next to simple is proposed, advanced alone is proposed, advanced with a card on or a card with an advanced card on is refused, and a card that is off blocks nothing":
//   AssertionError: an off card blocks nothing: advanced is proposed: expected 'refuse' to be 'propose' // Object.is equality. Reverted after observing.
describe("UC5: proposeClauseChange", () => {
  it("UC5: simple next to simple is proposed, advanced alone is proposed, advanced with a card on or a card with an advanced card on is refused, and a card that is off blocks nothing", () => {
    const first = propose([clause(1, SIMPLE)], { kind: "add", text: "b = 2" });
    expect(first).toEqual({ kind: "propose", clauses: [clause(1, SIMPLE), clause(10, "b = 2")], filter: filterOf("(a = 1) AND (b = 2)"), step: { kind: "add", clause: "clause-10" } });
    expect(propose([], { kind: "add", text: ADVANCED })).toEqual({ kind: "propose", clauses: [clause(10, ADVANCED)], filter: filterOf(ADVANCED), step: { kind: "add", clause: "clause-10" } });

    expect(refusedBy(propose([clause(1, SIMPLE)], { kind: "add", text: ADVANCED })), "advanced beside a card that is on").toBe("clause-1");
    expect(refusedBy(propose([clause(1, ADVANCED)], { kind: "add", text: SIMPLE })), "a card beside an advanced card that is on").toBe("clause-1");
    expect(refusedBy(propose([clause(1, ADVANCED)], { kind: "add", text: "c OR d" })), "advanced beside advanced").toBe("clause-1");
    expect(propose([clause(1, SIMPLE)], { kind: "add", text: ADVANCED })).toMatchObject({ kind: "refuse", reason: "advanced-alone" });

    expect(propose([clause(1, SIMPLE, false)], { kind: "add", text: ADVANCED }).kind, "an off card blocks nothing: advanced is proposed").toBe("propose");
    expect(propose([clause(1, ADVANCED, false)], { kind: "add", text: SIMPLE }).kind, "an off advanced card blocks nothing: a card is proposed").toBe("propose");

    const mixed = [clause(1, SIMPLE, false), clause(2, ADVANCED, false), clause(3, "c = 3", false)];
    expect(propose(mixed, { kind: "setEnabled", clause: "clause-2", enabled: true }).kind, "advanced on when all are off").toBe("propose");
    expect(refusedBy(propose([clause(1, SIMPLE), clause(2, ADVANCED, false)], { kind: "setEnabled", clause: "clause-2", enabled: true })), "turning advanced on beside a card").toBe("clause-1");
    expect(refusedBy(propose([clause(1, ADVANCED), clause(2, SIMPLE, false)], { kind: "setEnabled", clause: "clause-2", enabled: true })), "turning a card on beside an advanced card").toBe("clause-1");
    const off = propose([clause(1, ADVANCED), clause(2, SIMPLE)], { kind: "setEnabled", clause: "clause-1", enabled: false });
    expect(off, "turning off is never refused").toEqual({ kind: "propose", clauses: [clause(1, ADVANCED, false), clause(2, SIMPLE)], filter: filterOf(SIMPLE), step: { kind: "setEnabled", clause: "clause-1", enabled: false } });
    expect(propose([clause(1, ADVANCED), clause(2, SIMPLE, false)], { kind: "remove", clause: "clause-1" })).toEqual({ kind: "propose", clauses: [clause(2, SIMPLE, false)], filter: null, step: { kind: "remove", clause: "clause-1" } });
  });
});
