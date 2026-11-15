Reviewed: PR #284 at 2c5627a208cd0d71f122b2783b2d7cef3a687bde (base 2c72923e), gate 1, architect
Branch and commit: cut/literal-only-float-integer-arithmetic-refused @ 2c5627a208cd0d71f122b2783b2d7cef3a687bde
Verdict: PASS WITH NOTES (WORDS-ONLY)

All line cites below are read in the worktree C:/dev/wt/lofi at 2c5627a2 (head) unless marked base. I have no shell: I computed no sha256, recomputed no pin, ran no test and observed no mutation. I leave no background shell. No sentence below is the human's wording (form §2.3 says none is); W-1's string is unchanged and I give it no words.

## Findings

### Correctness (blocking; a sentence, closed by words, so WORDS-ONLY under Part 1 item 2)

**C-1. `admitted_arithmetic_result`'s doc claims a limit the code does not have** (predicate.rs:2040-2043).
- **Requirement broken:** form §2.3 item 2 (the doc must say which branches can admit a `Decimal` operand), checked clause by clause under Part 1 item 1. Under the proportional-gates rule, an untrue claim of a limit is Correctness.
- **Evidence:** the doc names rule 6 as "a float column beside a within-bounds decimal literal" and then says "Any other pair with a `Decimal` operand falls through to `None`". But rule 6's `is_float_col` (2046-2048) is `kind != OperandKind::Literal`, so it accepts a column or an arithmetic result. Take `(f64 * 2) + 0.5 > 0`. `f64 * 2` is typed as a DOUBLE expression by rule 6 (2096-2101). Then `+ 0.5` is admitted by rule 6 again (2096). So a pair the doc says falls to `None` is in fact admitted, and an operator can see it admitted.
- **Closure:** replace predicate.rs:2037-2043 with:
```
/// Does `+`/`-`/`*` admit this pair (section 2.5(a), applying section 2.3's rules pairwise), and
/// if so, its result type? `None` covers both "refused" and "not this arm's job" uniformly. A
/// decimal literal beside an integer or a decimal is refused outright (O-5): no branch below admits
/// it. A `Decimal` operand is admitted by three rules only, each in both operand orders: a NULL
/// literal beside a numeric operand (rule 2); a REAL or DOUBLE operand that is not a literal (a
/// column or an arithmetic result) beside a within-bounds decimal literal (rule 6); and a
/// within-bounds decimal literal beside a double literal (the last clause). Any other pair with a
/// `Decimal` operand falls through to `None`.
```
- **Clause check of these words:**
  - "refused outright … no branch below admits it":
    - rule 1 covers REAL/DOUBLE only (2070);
    - rule 2 needs a NULL (2077-2088);
    - rule 3's `is_int` excludes `Decimal` (2045, 1594-1608);
    - rule 6 needs a non-literal float (2096-2109);
    - rule 7 and rule 5 need an integer through `int_le` or a float pair (2111-2143);
    - the new clause needs a double literal (2151-2156).
  - "a NULL literal beside a numeric operand (rule 2)": 2083-2088. `is_numeric` includes `Decimal` (1582-1588). A NULL literal is the only path to the NULL type (1766-1772; unary `-` NULL is typed BIGINT at 1987; NULL with NULL is typed BIGINT at 2081).
  - "a REAL or DOUBLE operand that is not a literal (a column or an arithmetic result) beside a within-bounds decimal literal (rule 6)": 2046-2054 and 2096-2109.
  - "within-bounds decimal literal beside a double literal (the last clause)": 2049-2055 and 2151-2156.
  - "Any other pair … `None`": no other rule (2070, 2077-2081, 2090, 2111-2143) admits a `Decimal` operand, and the function ends at 2157.
  - "each in both operand orders": each of the three rules has an `if` for each order (2083/2086, 2096/2103, 2151/2154).

### Evidence
None.

### Documentation (must-fix before the merge; no re-gate; the PR body lists the words)

**D-1. The new clause's comment cites by name, not by path** (predicate.rs:2144-2150).
- Form §2.3 item 3 requires "its governing cites, by path and section". The comment writes "ADR-021's Note …" and "FILTER-BIND section 2.3", which are names, not paths.
- Each cite does resolve:
  - ADR-021's Note 2026-09-30 heading is at docs/adr/ADR-021-row-filter-on-viewport-query.md:244, and its item 2 at :254-263.
  - Its Note 2026-10-03 item 2 is at :274 ("Inside `+`, `-` and `*`, nothing changes.").
  - FILTER-BIND §2.3 rule 6's second clause is at :77, and §2.5(a) at :89.
- Words, replacing 2144-2150:
```
    // a double literal beside an integer or decimal literal within the bounds, in either order: the
    // result is DOUBLE, because the only conversion is literal to DOUBLE
    // (`docs/adr/ADR-021-row-filter-on-viewport-query.md`, Note 2026-09-30, item 2;
    // `governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` section 2.3, rule 6's
    // second clause, applied pairwise by section 2.5(a)). `is_numeric_lit` tests the partner's kind
    // is literal and its within-bounds flag, so a partner beyond the bounds keeps
    // `literal_out_of_bounds`. A rule-2 result that counts as a decimal literal has the expression
    // kind, so it is not admitted here (`docs/adr/ADR-021-row-filter-on-viewport-query.md`, Note
    // 2026-10-03, item 2); neither is a non-literal partner.
```
- Clause check: only the cites change, and each resolves as above. The other clauses are checked under check 2.

**D-2. T1's doc states DuckDB behaviour without its version and implies an oracle the test does not run** (filter_type_admission.rs:632-638).
- "its stream delivers the ids DuckDB's own result over FX-1 predicts" is a DuckDB behaviour stated without its version (§8 item 10).
- T1 also asserts against constants (`all`/`none`, diff lines 132-152), not against a DuckDB query run inside the test.
- Words, replacing 632-638:
```
/// T1 (`governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md`,
/// section 4): in `+`, `-` and `*`, a DOUBLE literal beside an integer or decimal literal within
/// the bounds is admitted, in either operand order (rows 1 to 7), as two DOUBLE literals already
/// were (row 8). Each of the eight rows asserts four things: `admit` returns `Ok`; `drain_ids`
/// succeeds and equals the row's expected set, every id or none, written here from the form's
/// section 3; `i64 = (<a>)` is refused in its real `TypeNotAdmitted` shape with operand types
/// BIGINT and DOUBLE expression, which pins the walk's type for the arithmetic node `<a>` as
/// DOUBLE; and the binder's `typeof(<a>)` on `configured_connection()` is DOUBLE.
```
- Clause check:
  - Rows 1-7 are a double literal beside an integer or decimal literal. Rows 3 (`5 * 1e3`) and 6 (`0.5 + 1e3`) put the partner on the left.
  - Row 8 was admitted at the base: rule 1 at 2070, and P-0 in the worker report.
  - The expected sets are `all`/`none` and match form §3's "At the head: stream" column row by row.
  - `conn` is `configured_connection()`.
  - The `typeof` assertion is an assertion, not a version claim.

**D-3. Records due in the closing amendment** (at the head, §10 is empty):
- the 170/150 size overrun as class 8, with §7's line not edited;
- T2 row 2's DECIMAL(20,19) as a class 2 deviation.

The words above add lines, so the class 8 count is to be taken at the words head.

### Notes (no acceptance condition)

**N-1. `sentence`'s doc names one case, not every case** (predicate.rs:1438-1440).
- Each clause is true of the walk. `'1' + NULL` misses rule 2 because VARCHAR is not `is_numeric` (2083-2088, 1582-1588) and returns `None` (2157). `determine_reason`'s text arm excludes a NULL partner (2285-2286). The bounds hold for both operands (1766-1772, 1819-1825), so the pair reaches `ConversionRounds` (2318). W-1 (1450-1451) names a float type, so it is false of this pair.
- The doc does not name every case W-1 is still false of. By reading, 8b's architect shapes (a) to (c) also reach `ConversionRounds`: `/` at 1951-1954 sends VARCHAR or BOOLEAN beside NULL or its own type to `determine_reason`; VARCHAR+VARCHAR and BOOLEAN+BOOLEAN in `+ - *`. Whether the binder lets them reach the walk is unprobed.
- The doc neither claims completeness nor disclaims it, so it is not false. It meets §2.3 item 1 ("cover only the cases … still false of").
- The `-` and `*` forms share the arm (2002-2034), but only `+` reached the walk in a run (worker report; 8b's P-0).
- Optional words for the last clause:
```
    /// alone. It is still false of a text literal beside a NULL literal in `+`, `-` or `*`
    /// (`'1' + NULL > 0`, observed for `+`; `-` and `*` share the arm), which reaches this reason
    /// because the text reason excludes a NULL partner. That case is an example, not a complete
    /// list.
```
- Clause check: as above. "Not a complete list" is supported by 1951-1954 and by the VARCHAR/BOOLEAN pairs falling to 2318.

**N-2. CI.** The packet's reading at 02:00:04Z shows a second set of runs (4214739xxxx) in progress on the same head, and the first set all success. That is a merge condition, not a dispatch condition (Part 1 item 4).

## Check 1: Section 1's readings against the head

The built clause (2151-2156) admits exactly what the readings admit, and nothing at the head needs ADR text.

**ADR-021, Note 2026-09-30, item 2** (:254-263): the two-literals bullet (:261) applies inside `+ - *` (:263). Its exception names "a decimal literal beside an integer or a decimal", never a double. So the readings admit double literal + integer literal and double literal + decimal literal, both within bounds.
- The clause is `is_double_lit` beside `is_numeric_lit`, where `is_numeric_lit` (2049-2054) requires kind Literal and `within_bounds`, and an integer, `Decimal` or `Double` type.
- What it admits beyond those two pairs is unreachable:
  - double beside double is caught first by rule 1 (2070);
  - a UHUGEINT literal is beyond 20 digits by construction, so it fails `within_bounds` (1791);
  - NULL is caught by rule 2 and is not in `is_numeric_lit`.
- No earlier rule admits these pairs:
  - rule 5's `int_le` requires a non-literal (2056-2062);
  - rule 6's `is_float_col` requires a non-literal (2046-2048).
- The O-5 exception holds: a decimal literal beside an integer or decimal still reaches `None` and then `ConversionCanFail` (2163-2167, 2315-2316).

**ADR-021, Note 2026-10-03, item 2** (:274, "Inside `+`, `-` and `*`, nothing changes."): a counted rule-2 result is `Typed::expression` (2019-2023), so `is_numeric_lit` rejects it and it reaches `ConversionRounds`. This matches OPEN-3 (a). T2 row 4 asserts it.

**The twelve codes and five reasons** (:267): `TypeRefusalReason` (1401-1414) and `wire_value` (1420-1428) are untouched by the diff.

**FILTER-BIND:**
- §2.5(a) applies §2.3 pairwise (:89).
- §2.3 counts an integer literal within the bounds as an integer (:71).
- Rule 6's second clause (:77) is mirrored by the clause and by comparison rule 6(ii) (2244-2249).
- Under OPEN-2 (i), BIGINT and HUGEINT literals within 20 digits are admitted. `is_numeric_lit` sets no 32-bit bound, which matches.
- The conversion the clause needs is declared at §7 (:273, "numeric → numeric" on literals).

## Check 2: The §2.3 sentences, clause by clause

**`sentence`'s doc:** true. See N-1, including whether it names every case.

**`admitted_arithmetic_result`'s doc:**
- "refused outright (O-5)" is true.
- Branch 1 (rule 2) is true.
- Branch 3 (the last clause) is true.
- Branch 2 says "float column" and is false for a float arithmetic result. So "Any other pair … `None`" is false. Finding C-1 gives the words.

**The new clause's comment, clause by clause:**
- The pairs and "in either order": 2151-2156.
- The DOUBLE result: 2152 and 2155.
- "only conversion is literal to DOUBLE": FILTER-BIND :273.
- The bound test: `is_numeric_lit` checks kind and `within_bounds`, and an out-of-bounds partner reaches `LiteralOutOfBounds` at 2295. T2 rows 1-2 assert it.
- The counted rule-2 result has the expression kind (2019-2023).
- "neither is a non-literal partner" holds for this clause.
- Each cite resolves (see D-1). The only defect is the path form, which D-1 fixes.

**T1's doc:** each assertion it lists is in the code (diff lines 154-183). The oracle and version clause is fixed by D-2. Its `RECORDED MUTATION:` line:
- matches M-1 in form §4;
- names the 40-hex f2955007;
- names the failing row and its message;
- says "other five tests passed". The binary has six `#[test]`s: lines 125, 469, 568, 646, 719 and 1457.

**T2's doc:** each of its four claims matches a row:
- rows 1-2: out of bounds, at 2295;
- row 3 `1e3 + i64`: rule 5 fails, `is_numeric_lit` fails, so `ConversionRounds`;
- row 4: the counted expression gives `ConversionRounds`, since `is_decimal_arithmetic_pair` is false for a DOUBLE partner (2163-2167);
- row 5: `ConversionCanFail` at 2315-2316.

Its `RECORDED MUTATION:` line matches M-2 in form §4 and the worker report (line 35).

Neither recorded line calls a `verify-mutation` run an observation. The observations are the worker's. Under Part 1 item 9 they stay the gates' own, and I could not observe them (no shell).

## Check 3: Section 8, item by item

1. **Holds.** P-0 ran at base 2c72923e with nothing committed (worker report, lines 9-13), before ad223091.
2. **Holds.** The clause reads no `counts_as_decimal_literal`, and both helpers require kind Literal (2049-2055).
3. **Holds.** In the test file the diff is pure insertion between 8b's T1 and `code_of`. B-T1b (predicate.rs) is outside every hunk. B-T3, 8b's T1, B-T2 and B-T1 are unchanged.
4. **Holds.** The predicate.rs hunks are two doc comments and one added clause. W-1's string, the reasons, `determine_reason`, `Typed`, Display and the constants (1391, 1394) are unchanged.
5. **Holds.** No `pub` line, lib.rs, Cargo.toml or Cargo.lock in the diff (packet §3).
6. **Holds.** The diff touches only the three `engine/` Scope files.
7. **Holds.** Form §10 is empty, and this gate does the clause check.
8. **Holds.** T1 and T2 have no sleep, retry, timeout, `#[ignore]` or `cfg`.
9. **Holds on the text.** The observations are the worker's, and the reviewer observes.
10. **Holds once D-2's words are applied.** As it stands, T1's doc states DuckDB behaviour without the version.
11. **Holds.** The target is D:/wt-targets/lofi, and P-0 was deleted (worker report, lines 7 and 9).
12. **Holds.** Nothing new claims negated or nested shapes, `/`, columns or figures.
13. **Holds at the packet's reading.** The first run set is all success, and the second set is in progress (N-2).

## Check 4: Declared-unchanged items (sections 2.2, 2.4 and 5)

The diff touches none of them:
- every other arm and rule;
- the reasons, the precedence (2280-2319), the `Typed` fields (1515-1534), Display and W-1;
- the constants;
- `is_admitted_comparison`, `type_of_division` and `check_pair`;
- B-T1, B-T1b, B-T3, 8b's T1 and the campaign file, which is outside the diff.

The head suite passed: 478 passed, 0 failed (packet §4).

## Check 5: The wire and the out-of-scope categories

- Nothing under `protocol/`.
- `FilterError::TypeNotAdmitted`'s fields and the reason wire values are unchanged. Only the set of refused predicates shrinks.
- No docs/08 figure moves, no constant moves, and no ADR file is touched.
- The guarantee category is touched only as form §9 item 6 states: the implementation is brought to ADR-021's admitted class.

## Packet gaps
- The diff's hunk headers give base offsets only. I needed the head's line numbers for the three docs and found them by grep.
- The packet says the worker report is "to be filed", but it was already at state/consults/2026-11-06-literal-only-float-integer-arithmetic-refused-worker-report.md, and I read P-0, the target and the mutation runs there.
- The packet does not say what started the second CI run set (4214739xxxx) on the same head.
- To check the sentence doc's completeness I needed shapes (a) to (c). The packet names them but not where they are; I found them through the form's §1 cite into state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md.

Files read: the brief, the packet, the Part 1 directive, and the form; at the head, predicate.rs (1385-1564, 1578-1616, 1750-1829, 1928-2329) and filter_type_admission.rs (1-125, 540-634, plus a grep of its tests); ADR-021 (:244-276), FILTER-BIND (:58-97, :268-275), 8b's gate-1 architect report (:30-49), and the worker report.
