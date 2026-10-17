Reviewed: PR #224 at 93f2b927d0dcfd64abd0a608e6dfaf1335493455 (base e555177c), branch cut/engine-clause-composition-properties @ 93f2b927d0dcfd64abd0a608e6dfaf1335493455
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. Five Documentation findings follow. Each must be fixed before the merge, with no re-gate. None of them is the human's wording. The worker applies the words given here, and the PR body lists them. After these fixes the diff is 176 lines (campaign file 172 in, 0 out; README 2 in, 2 out), within the declared 180. The campaign file still has zero deletions, because every line these fixes change is new in this PR.

## The checks (form §F, architect's line)

1. **§A against the directive's item 1, line by line.** Each rule sharpens and none widens.
   - Fixture, seed and generator: `fixture()`, its own `Rng`, and G1's draw (head :1404-1412).
   - The join convention: `join_clauses` at :1293-1305.
   - Allowed refusals are TooLong and TooDeep only. Every other outcome, Panicked included, becomes a candidate (:1353-1358).
   - Run conditions: the whole extent and limit `FIXTURE_FEATURES + 1` (:1318-1320).
   - Completed streams only. The engine's `next_into` returns `None` only at the end and gives a terminal error once (engine/src/stream.rs:780-797).
   - Duplicates are checked before the set (:1337-1340).
   - The exclusion is applied per run with that run's own text (:1376). Any other failure, a start error included, fails the case (:1377).
   - Admission comes before any stream, and its labels are kept apart from the result label (:1358, :1370, :1387).
   - P6 is cut down to subsets of size 2 to n-1. The cut is equivalent, not narrower: under the convention a size-1 subset has the same bytes as the text, which was admitted alone; the empty subset is no filter; the size-n subset is the join itself.
   - The rejection sampler and the draw cap only sharpen "each admitted alone".

2. **The may-not-claim list (§E).** The PR body claims none of it. The doc comment at :1395-1399 claims none of it. The module-doc bullet and the `join_clauses` doc both call the convention the shell's (D1, D2). At the head no `combineClauses` exists under `frontends/`, and milestone 3's §2.5 marks `src/workspace/filterClauses.ts` as new. I class this as Documentation, not as an unsupported guarantee. The phrase is the directive's own name for the convention, it states no behaviour of this product, and line 1399 of the same file says the shell's half belongs to milestone 3's rows. No shell interface is called, encoded or tested, and no `pub` item is added.

3. **Amendment 1's sentence at :1399.** It matches the draft's line 184 (the span after the bold label) and Amendment 1's text block byte for byte. Each clause holds at the head:
   - "It mutates this Rust test helper": the mutation is in `join_clauses`, :1300.
   - "not the shell's combineClauses": `combineClauses` is the function milestone 3's form specifies. It is not built, and the sentence does not say it is.
   - "unit row UC3 (combineClauses)": frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:372.
   - "e2e row E-AND (the joined text, end to end)": the same file, :400. It asserts `.filter-active` equals the bracketed join and that the map is empty.

4. **Amendment 2's deviations.** None of (a) to (e) changes what the test proves, and none needs the human.
   - (a): clippy has no CI workflow. Only the record wording needs fixing (D5).
   - (b): the existing line 13 is left alone. That is correct, because the Out-of-scope line binds zero deletions. The new bullet says "two more".
   - (c): the guard still asserts that the witness separates.
   - (d): the probe chose no step. Minimality is a fact of the record, and the shipped guard proves the witness discriminates.
   - (e): the order of draws is unchanged, because runs draw nothing. A duplicate still fails the case, labelled as an execution failure.
   - The two moved pins are correct: the bytes at engine/src/predicate.rs:536-547 and :974-977 at the head are the depth walk and the AND flattening. The amendment names the tree as authoritative.

5. **The owner's-index line (README:550).** It is a pointer only, placed alphabetically (CANCEL… < CLAUSE… < CORPUS…). It replaces one line, so the index stays under 60 lines. Line 530's "every pointer checked at that commit" is no longer true for this pointer (D3).

## Correctness
None.

## Evidence
None. The witness case's printed P5 result line under the mutation, the 0 candidates, and the B/H identity of the G1 to G4 tallies all resolve to the worker report's lines 46-49, 76-81 and 92. I have no shell, so the reviewer recomputes the report's sha256 and the moved pins' hashes.

## Documentation (must-fix before the merge)

**D1. `engine/tests/admission_property_campaign.rs:33-37` (the module-doc bullet).**
- "by the shell's convention" presents the convention as the shell's (§E, first item).
- "each text in brackets" is false for one text (:1296).
- "if admitted returns exactly the intersection" leaves out the exclusion, which applied to 4 of the 201 cases.

Replace lines 33-37 with:
```
//! - **P5 and P6** — two more, in their own test and seed: a join of 1 to 4 G1 texts, each admitted
//!   alone, by the directive's join convention, which milestone 3's form specifies for the shell
//!   (`join_clauses`: one text unchanged, two or more each in brackets, joined by ` AND `), is
//!   admitted or refused only as too long or too deep, and if admitted, unless a run meets the
//!   declared overflow exclusion, returns exactly the intersection of the ids the texts return
//!   alone (P5); if it is admitted, every order-preserving subset of 2 to n-1 of its texts admits
//!   too (P6).
```
Clause check:
- "own test and seed": :1401, :1279.
- "1 to 4 G1 texts": :1409-1412.
- "each admitted alone": :1413-1414; the witness through :1317.
- "the directive's join convention": the directive, item 1.
- "milestone 3's form specifies for the shell": milestone 3 form :210-213. This says "specifies", not "built".
- "one text unchanged, two or more each in brackets, joined by ` AND `": :1296, :1297-1303.
- "admitted or refused only as too long or too deep": :1353-1358.
- "unless a run meets the declared overflow exclusion": :1376, :1381-1382.
- "exactly the intersection": :1384-1391, with the duplicate check at :1337-1340.
- "if it is admitted, every order-preserving subset of 2 to n-1": :1360-1372, which runs after :1353.

**D2. `engine/tests/admission_property_campaign.rs:1291-1292` (`join_clauses` doc).** The current text reads "/// The shell's join convention (the directive's item 1)". It calls an unbuilt shell function's convention the shell's.

Replace lines 1291-1292 with:
```
/// The directive's join convention (its item 1), which milestone 3's form specifies for the shell;
/// a test helper, not the shell's code: no text is no filter, one is itself byte for byte, two or
/// more are each in one pair of brackets joined by `" AND "`.
```
Clause check:
- "the directive's join convention": the directive's item 1.
- "specifies for the shell": milestone 3 §2.5, :210-213.
- "a test helper, not the shell's code": the function is in engine/tests.
- The three arms: :1295, :1296, :1297-1303.

**D3. `engine/README.md:530`.** "every pointer checked at that commit" names fb95bec0, a commit of 2026-10-10. This piece's form was drafted from 467dd47e, after that, so the new pointer could not have been checked at fb95bec0. Replace the line with:
```
- **Last verified at:** fb95bec0 (every pointer checked at that commit); the `referenced_columns` pointer at 3dfc1a0e; the `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md` pointer at e555177c
```
Clause check: the form is on main at e555177c, the base, whose commit message lists clause composition's OPEN-1 and OPEN-2 amendments. The existing two clauses are kept byte for byte. This fix stays inside Scope's named file. Amendment 2 item 1's README count then reads 2 in and 2 out (total 176), and the PR body records it.

**D4. Amendment 2's preamble (the form, in the working tree).** It gives the report's sha256 without an `@ <rev>` at a commit on main (round 15, item (e)).
- Fix: commit the report file alone to main first.
- Then, before Amendment 2 is committed, write its reference as `state/consults/2026-10-17-engine-clause-composition-properties-worker-report.md @ <that main commit>`, keeping the stated span (line 5 to the end) and the sha256 as written.
- The reviewer recomputes the sha256 at that commit.

**D5. Amendment 2 item 3, the E6 clause (working tree), and the time line §C.3 requires.**
- "E6, the suites and checks named passed (CI on the PR to come)" counts as passed "clippy as CI runs it", which never ran (item 5 (a)).
- Replace that clause with: "E6, the suites and checks named passed except clippy as CI runs it, which no workflow runs (item 5 (a)); PR CI is to come."
- Clause check: the report's lines 93-100 and 125 support it.
- §C.3 also owes CI's step time as a log reading, and the report has none (line 51). The closing amendment cites PR #224's CI run and its `cargo test` step time, by reference, as a log reading and not a docs/08 measurement.

Not findings:
- The stale "The four properties:" at :13 is bound by the Out-of-scope zero-deletion rule and is softened by the bullet.
- ADR-006 does not apply: the piece is a test and adds no operation.
- docs/08: the piece claims no performance, and its times are labelled log readings.
- No new seam: the test calls only engine interfaces that exist at the head (`AdmittedPredicate::admit`, `ViewportQuery::viewport`/`with_limit`/`with_filter`, `stream_with_cancel`, `next_into`). Each `Dataset` has its own pool (engine/src/dataset.rs:348). The test does not call `canary_dir()`.

Files read: C:/dev/wt/ccp/engine/tests/admission_property_campaign.rs, C:/dev/wt/ccp/engine/README.md, C:/dev/wt/ccp/engine/src/stream.rs, C:/dev/wt/ccp/engine/src/predicate.rs, C:/dev/wt/ccp/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md, C:/dev/spatial-ide/engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-17-engine-clause-composition-properties-worker-report.md, C:/dev/spatial-ide/state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md, C:/dev/spatial-ide/state/consults/2026-10-14-engine-clause-composition-properties-impact-read-lead-data.md, C:/dev/spatial-ide/state/consults/2026-10-14-engine-clause-composition-properties-architect-draft.md (line 184), C:/dev/spatial-ide/state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md, and the PR body.
