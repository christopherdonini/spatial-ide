import { describe, expect, it } from "vitest";

import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { predicateTextToFilter } from "./predicateInput";

// NEXT-CUT.md binding note 1: "no parse/normalize/trim/case-fold, no client ceilings. The ONE
// admitted mapping: empty input -> `filter: null`. Whitespace-only goes on the wire verbatim."
describe("predicateTextToFilter (P3 item 1, binding note 1: the one admitted client-side mapping)", () => {
  it("empty input maps to filter: null", () => {
    expect(predicateTextToFilter("")).toBeNull();
  });

  it("whitespace-only text rides the wire VERBATIM -- never trimmed to empty, never treated as null", () => {
    expect(predicateTextToFilter("   ")).toEqual({ predicate: "   ", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
  });

  it("ordinary predicate text rides verbatim, with the one admitted dialect", () => {
    expect(predicateTextToFilter("zone = 'residential'")).toEqual({
      predicate: "zone = 'residential'",
      dialect: FILTER_DIALECT_DUCKDB_EXPR_0,
    });
  });

  it("odd internal whitespace/casing is never normalized or case-folded", () => {
    const odd = "  Zone = 'Residential'  AND  area > 100  ";
    expect(predicateTextToFilter(odd)).toEqual({ predicate: odd, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
  });
});
