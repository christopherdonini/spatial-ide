Reviewed: main @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1
sha256: not computed

Reading caveat: I had no shell, so HEAD is not confirmed by git and no hash is computed. I read the main checkout's working tree. The session's git status showed uncommitted edits to `PLAN.yaml` and to two shell forms. None of the files cited below has uncommitted edits except `PLAN.yaml`, which is cited by node id only. The read gives the node at :5206, but the working tree has it at :5223.

## 1. The form, and why

**The form is five-line, because the human asked for one (directive item 1). Its honest declared budget is 180 lines, which closes the single gate from dispatch. The route is OPEN-1.**

- **No honest budget of 150 or less fits.** I sketched the code line by line at rustfmt's defaults: there is no `rustfmt.toml` in the repository, so the line width is 100 and the chain width is 60. The parts:
  - module-doc bullet: 3
  - constants and witness: about 8
  - `join_clauses`: about 15 (its chain breaks onto separate lines)
  - completed-stream ids: about 25
  - one case: about 55 (P5 admission, P6, the n+1 runs, duplicates, exclusion, intersection)
  - the test: about 45
  
  That comes to about 150 to 170 in the campaign file, plus 2 lines in `engine/README.md`. The read's 135 to 155 (its §5) did not allow for rustfmt's signature, pattern and chain breaks. The only way to land at 150 or less is to drop things the directive requires, or the guard. This is the read's R2, confirmed.
- **Under §21c as written,** a Scope over 150 cannot take the single gate from dispatch. §21a then asks for the full form (`AUTONOMY.md:329-331`). The human asked for a five-line form.
- **Recommendation:** keep the five-line form and take both gates from dispatch (OPEN-1 (A)). That is the shape §21b's mid-piece clause already produces. It needs the human's word because it is taken at dispatch.
- **Where the properties go: the existing campaign file, not a sibling (R4).**
  - A sibling integration test is its own crate. It would have to copy `Rng`, `fixture`, `leaf` and `gen_expr` (about 200 lines). The other way is `#[path]`-including the file, which compiles and runs the 2,500-case campaign twice. Either way a second binary writes the same temp fixture path (`admission_property_campaign.rs:126-128`).
  - In the same file, the `OnceLock` (:117) shares one fixture build.
  - A separate `#[test]` with its own `Rng` cannot change the campaign's G1 cases, whatever its seed, because they draw from separate generator states. E5 proves this: the campaign's printed tallies must be identical at the base and the head.
  - The new test never calls `canary_dir()` (:157-162), so it cannot race the campaign's read of that directory (:1168-1171).
  - The connection pool is per dataset (`engine/src/pool.rs:4`), so the new test's own `Dataset` does not compete with the campaign's leases.
  - Corrections to the read: plain `cargo test` runs test binaries one after another, so the read's sibling-file race needs either nextest or two checkouts running at once. The two-checkouts case already exists for the campaign today (a shared `temp_dir`). It predates this piece and is not this piece's to fix.
- **The seam rule.** The diff crosses no module seam. The helper reproduces the directive's convention (:13-16), which matches milestone 3's §2.5 text (`SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:210-215`), not built code. The form claims nothing about the shell.

## 2. Draft form

````markdown
# Clause composition, P5 and P6, over the admission property campaign — five-line short form (`AUTONOMY.md` §21d)

Committed before any code. Drafted by the architect on the custodian's brief, reading main at 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1. Append-only once committed; an amendment made after any outcome says so in its first line. The custodian keeps the PLAN node on main; the branch carries no PLAN or generated file. Path of this form: `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md`.

```
Authority: PLAN node engine-clause-composition-properties; the human's directive, item 1 (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:8-30 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD) and item 3, fourth bullet (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:49 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD); the owner's-index rule (state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:9 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD). Evidence (a read, cited for what it reported; every fact used re-checked at 467dd47e): state/consults/2026-10-14-engine-clause-composition-properties-impact-read-lead-data.md. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, each with exit code 1, for property test `No prior art recorded for "property test". Research it before planning an implementation.`, for clause composition `No prior art recorded for "clause composition". Research it before planning an implementation.` and for predicate conjunction `No prior art recorded for "predicate conjunction". Research it before planning an implementation.`; three misses, noted, not blocking.
Scope: engine/tests/admission_property_campaign.rs, insertions only (one module-doc bullet after the P4 bullet; one block appended after the last test; no existing line changes); engine/README.md (the owner's index's list of preregistrations in this module gains this form; one line replaced); 2 files; declared line budget <= 180 changed lines by §21c's counting (insertions plus deletions), this form excluded; no PLAN or generated file on the branch. Over §21c's 150, so closed to the single gate from dispatch (§D; OPEN-1).
Change: one new #[test] in the campaign file runs P5 and P6 over 200 seeded G1 cases and the kept bracket-join witness, through test-only helpers (the join convention, the ids of a completed whole-extent stream, one case), and prints the run's report; no product code, fixture, dependency or existing line changes.
Tests+mutation: new test `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` (engine/tests/admission_property_campaign.rs). Mutation: the test helper joins without the brackets (in `join_clauses`, `.map(|t| format!("({t})"))` becomes `.map(|t| t.to_string())`); the test fails by name on the witness's P5 result line. Observed by applying it at the final code commit, running the test by its exact name, recording the failure with that commit id, and reverting it (§B).
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, no product code, nothing under protocol/ or kernel/; ADR-021's admission is driven by the test and changed in nothing; no existing property's test, assertion, generator, seed or helper changes (the campaign file's diff has zero deletions); no fixture, dependency, exposure surface or string the app shows.
```

### §A. P5 and P6 as this piece runs them (sharpened, not widened)

Run conditions (directive item 1, P5's run conditions):
1. Fixture: `fixture()` unchanged — MultiType, 800 features, `FIXTURE_SEED` (engine/tests/admission_property_campaign.rs:55-56 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD); `zone` holds NULLs, one row in five (engine/src/fixture.rs:359-367 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD).
2. The test opens its own `Dataset` and runs one stream at a time, each drained to its end.
3. Viewport: `facts.extent` as a `Bbox`, the union of every feature's bbox (engine/src/fixture.rs:1086-1090 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD), in the dataset's CRS; limit `FIXTURE_FEATURES + 1`; no projection; no cancel.

Generation:
4. Its own seed `P5_SEED = 0x0B02_A005_0000_0005` and its own `Rng`; no draw from G1 to G4's streams. `P5_CASES = 200`. Per case, n = `r.below(4) + 1`. Each text is `gen_expr(&mut r, r.below(5))`, G1's draw as the campaign makes it (engine/tests/admission_property_campaign.rs:1055-1058 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD). A text is kept only if `AdmittedPredicate::admit` admits it alone; a refused draw is discarded and counted. `P5_DRAW_CAP = 2_000` discarded draws per run: reaching it fails the test, and it never excludes a case.
5. `join_clauses` is the directive's convention (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:13-16 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD): no text gives `None`; one gives the text byte for byte; two or more give each text in one pair of brackets, joined by `" AND "`. Nothing is trimmed or case-folded.

P5:
6. Admission: the join is admitted, or refused with `FilterError::TooLong` or `FilterError::TooDeep` (`code_of`: `skp.filter_too_long`, `skp.filter_too_deep`). Any other refusal, `PredicateAdmitError::ConnectionsExhausted` included, fails the case. An allowed refusal is counted by code, and P6 and the result are not run for that case.
7. Result: if the join is admitted, the set of its run's ids equals the intersection of the sets of the n alone runs' ids.

P6:
8. If the join is admitted, each order-preserving subset of size 2 to n−1, joined by `join_clauses`, is admitted; any refusal of a subset fails the case.
   - A size-1 subset is a text alone: step 4 admitted it, with the same bytes under the convention.
   - The empty subset is no filter and has no admission.
   - The size-n subset is the join itself.
   - So P6 checks no subset when n ≤ 2, three when n = 3 and ten when n = 4. It checks admission only, and no subset is streamed.

Rules for both:
9. The admission assertions (6, 8) run before any stream, and their failures are labelled apart from the result assertion (7).
10. They run on every case, a case later excluded included. The exclusion is triggered by a run, and every run comes after admission. An excluded case is never compared and never counted as passed; an admission failure on it is a candidate.
11. Ids come only from a stream that ended without error. A stream that failed gives no ids.
12. Each run's ids are checked for duplicates before they become a set, and a duplicate fails the case.
13. Exclusion: the campaign's `is_declared_integer_arithmetic_overflow`, unchanged (engine/tests/admission_property_campaign.rs:1009-1025 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD), applied to each of the n+1 runs with that run's own text (the text alone, or the join). If it matches any run, the case is excluded: counted and reported, not compared, and not counted as passed. That function is removed when node stream-evaluation-failure-fixed-detail lands (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:131 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD). P5's exclusion goes with it, and that node's form owns this call site.
14. Any other execution failure fails the case, even when another run of the same case is excluded. That covers a start error, and a terminal error the exclusion does not match.
15. Every case has exactly one outcome: passed, excluded, refused by code, or candidate.

### §B. The witness and the mutation

1. **Derivation.**
   - With the mutation applied, run the test and take the first reported failure whose detail is P5's result.
   - Reduce it by hand, one step at a time. Each step is one of: drop a text (never below two); replace an AND or OR node by one of its operands; drop a NOT or a bracket pair.
   - Every step must keep three things: each text admitted alone, no run excluded, and the bare join's id set different from the bracketed join's.
   - Stop when no single step keeps the difference.
   - The report records the seed, the case, the texts drawn, each step and the final texts.
2. **Kept** as `P5_WITNESS`, literal texts, run first through the same case function as every generated case.
3. **A guard after the candidate assertion.** The id set of the bare join (`P5_WITNESS` joined by `" AND "`) differs from the id set of the bracketed join, and both are written without `join_clauses`. Under the mutation, the test therefore fails on the witness's P5 result line. Without the mutation, the guard shows that the witness still discriminates.
4. **The record.** The test's doc comment records the mutation the way B-1's does (engine/tests/admission_property_campaign.rs:1237-1243 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD), with the sentence OPEN-2 settles.
5. **The observation of record** is as the Tests+mutation line states. No record calls a `verify-mutation` run an observation of a mutation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD).

### §C. Candidates and the report

1. **Candidates (directive item 1 and item 3's fourth bullet).**
   - Every failure in the unmutated run is a candidate until it is reproduced (the same seed and case) and minimized (§B.1's steps, keeping the same failure).
   - It is real when it is reproduced, minimized, and a defect of the product, not of this test. The report gives the reason for each candidate.
   - A defect of the test is fixed inside Scope and recorded.
   - A real one stops the piece before the PR and goes through normal triage (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:6 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD). The piece adds no exclusion, ignore or generator change, and fixes no product code.
   - The mutated run's failures are mutation evidence, not candidates.
2. **What the test prints under `--nocapture`:** `P5_SEED`, `P5_CASES` and the witness; the discarded draws; the tally (passed, excluded, refused by code, P6 subsets admitted); and each candidate.
3. **The run report.** The worker writes it and the custodian files it under `state/consults/`. It holds:
   - the printed lines, byte-copied, with the commit and the command;
   - the time spent, as libtest's `finished in` line from a run filtered to this test and as CI's step time, each a log reading and not a docs/08 measurement;
   - the mutated run's failure count and the witness's derivation;
   - the mutation observation;
   - the candidates, and how many were real.
4. **The closing amendment** references the report by path @ a commit on main, with its sha256. This form claims no performance.

### §D. Budget, and what is left out

- **The architect's sketch,** at rustfmt's defaults: about 150 to 170 lines in the campaign file and 2 in engine/README.md. No honest budget of 150 or less fits. The declared budget is 180.
- **Left out to keep it:**
  - an automatic minimizer (minimizing is by hand, and recorded);
  - a sibling file;
  - any change to `stream_check`, the campaign test or its generators (an `ids` field would edit P1's helper);
  - a no-filter control run;
  - running P1 to P4's checks on P5's runs;
  - a timer in the test (the time comes from libtest's line).
- **Counting:** `git diff --numstat B...H`, with B and H named in the PR body. An overrun is class 6, and the Scope line is not edited.

### §E. Predictions, declared unchanged, invalidators, may not claim

- **Predictions** (a wrong prediction is a result):
  - E1: the unmutated run has zero candidates.
  - E2: refused-by-code shows filter_too_deep 0, because each top-level operand is walked from depth 1 and a same-operator AND chain is flattened (engine/src/predicate.rs:514-525 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD; engine/src/predicate.rs:952-955 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD). filter_too_long is rare, possibly 0. These are reported as counts, not as findings.
  - E3: the excluded count is material, because `i64` spans the 64-bit range (engine/src/fixture.rs:406-408 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD).
  - E4: under the mutation, the test fails by name on the witness line.
  - E5: the campaign file's numstat shows 0 deletions, and the campaign's printed G1 to G4 tallies are identical at B and at H.
  - E6: `cargo test -p spatial-engine --test admission_property_campaign`, `cargo fmt --all -- --check`, clippy as CI runs it, verify-cites, verify-quotes, verify-test-claims (a planned claim until done) and verify.mjs all pass, verify-mutation shows a mutation recorded by name (it runs none), the `node --test` scripts suites pass, and PR CI is green.
- **Declared unchanged:** every existing line of the campaign file; every product file; engine/src/fixture.rs; every other test; ADRs; protocol/; kernel/.
- **Invalidators (stop and report):**
  - at B, an interface used here differs from 467dd47e (`AdmittedPredicate::admit`, `Dataset::open`, `stream_with_cancel`, `next_into`, the `ViewportQuery` builders, `FixtureFacts.extent`, or the campaign helpers named in §A);
  - a property needs a product, fixture or existing-line change;
  - a real candidate (§C.1);
  - no witness under the mutation where precedence changes the ids.
- **May not claim:**
  - that the shell joins this way: the helper is the directive's convention, which matches milestone 3's text (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:210-215 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD), not built code;
  - that turning a card off never refuses in the app: P6 shows only the engine's admission of joins built by this convention;
  - any performance figure;
  - anything about a viewport other than the whole extent, or about a limit at or below the row count.

### §F. Gates

- **Route:** OPEN-1. Recommended: (A), reviewer and architect, both to an affirmative PASS, from dispatch.
- **Verdicts are proportional** (state/directives/2026-10-05-product-first-direction.md, section 2): a gate blocks only on Correctness or Evidence. A documentation finding is fixed before the merge, with no re-gate. OPEN-2's sentence falls under `AUTONOMY.md` §31.
- **Reviewer:** first the Out-of-scope line and E5's zero deletions. Then it re-applies the mutation at H and records the failure by name.
- **Architect:** §A against the directive's item 1, line by line (sharpened, not widened); the may-not-claim list; and that no shell interface is encoded as if it were built.
- **Overlap** is re-checked at dispatch against both slots and every PR awaiting merge. The dependency, b2-piece-1b-recording, may edit engine/README.md's owner's index, so this piece merges main in before its last gate run.

### §G. Open for the human

- **OPEN-1:** the route.
- **OPEN-2:** the mutation record's sentence.

## Amendments

(Opens empty.)
````

## 3. Clause check

All pins are @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:HASH-TBD.

| # | Clause | Checked against | Holds |
|---|---|---|---|
| K1 | The fixture is MultiType, 800 features, with NULLs only in zone (one in five) | `engine/tests/admission_property_campaign.rs:55-56`, `:116-153`; `engine/src/fixture.rs:182-187`, `:359-367` | yes |
| K2 | `facts.extent` is the union of the bboxes, so it reaches every row | `engine/src/fixture.rs:1086-1090`; the campaign reads it at `admission_property_campaign.rs:1036` | yes |
| K3 | The limit can sit above the row count | `engine/src/stream.rs:276-285` (no ceiling) | yes |
| K4 | G1's draw is `gen_expr(&mut r, r.below(5))` | `admission_property_campaign.rs:1055-1058`, `:279-309` | yes |
| K5 | The convention is the directive's, and matches milestone 3's text | directive `:13-16`; `SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:210-215` | yes (same three cases; nothing trimmed, `:215`) |
| K6 | The allowed refusals are TooLong and TooDeep, mapped by `code_of` | directive `:19`; `admission_property_campaign.rs:627-628` | yes |
| K7 | Result = intersection; whole extent, a limit above the row count, the fixture unchanged | directive `:20-21` | yes |
| K8 | P6 is admission only, over order-preserving subsets | directive `:22`. Sizes 0, 1 and n are covered by construction (§A.8); this is a statement of coverage, not a narrowing | yes |
| K9 | Admission and result asserted separately | directive `:24` | yes |
| K10 | Completed streams only | directive `:25`; the shape of `stream_check`'s early return at `:886-893` and `:916-918` | yes |
| K11 | Duplicates checked before the set | directive `:26` | yes |
| K12 | Exclusion over any of the n+1 runs; never compared, never counted as passed | directive `:27`; the function at `:1009-1025`; its authority at `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:97`, `:128-131` | yes |
| K13 (R3) | Admission still runs on a case that is later excluded | directive `:27` names runs as the trigger, and admission precedes every run; never compared and never counted as passed are both kept | a sharpening: it narrows nothing, and the case's count does not change |
| K14 | Any other execution failure fails, even beside an exclusion | directive `:28` | yes (that is its plain reading) |
| K15 | The mutation is the bracket-free join, observed on a minimized witness and kept | directive `:29`. The witness exists because G1's OR arm joins without brackets (`:293-300`) | yes, if E4 holds |
| K16 | Candidates first; the report's contents | directive `:30`, `:49` | yes |
| K17 | No product defect fixed here | directive `:6` | yes |
| K18 | The owner's-index line is owed | ruling `state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:9`; `engine/README.md:550` | yes |
| K19 | A separate test does not move the campaign's RNG | each `Rng` holds its own state (`:80-92`); E5 proves it | yes |
| K20 | No contention with the campaign's leases | `engine/src/pool.rs:4` (per dataset), `:99`, `:132` | yes |

**OPEN-2's drafted sentence (for the test's doc comment):** It mutates this Rust test helper, not the shell's combineClauses; milestone 3's form gives the shell's half to its unit row UC3 (combineClauses) and its e2e row E-AND (the joined text, end to end).

| # | Clause of the sentence | Checked against | True at main |
|---|---|---|---|
| S1 | It mutates this Rust test helper | §B: the mutation is one line of `join_clauses` in the campaign file | yes |
| S2 | not the shell's combineClauses | No frontends/ path is in Scope; there is no `combineClauses` or `filterClauses` under `frontends/shell/src` (grep) | yes |
| S3 | milestone 3's form gives that half to UC3 (combineClauses) | `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:372` | yes, as the form's assignment |
| S4 | and to E-AND (the joined text, end to end) | the same file, `:400`, `:413` | yes, as the form's assignment |

- **What the sentence does not say:** that UC3 or E-AND exists or passes. At 467dd47e neither is in code: there is no E-AND under `frontends/shell/e2e`, and node shell-migration-milestone-3 is proposed.
- **It stays true** after milestone 3 lands.
- **No operator-observable case applies,** because the sentence is a test comment.
- **Whose wording:** the human's directive states the content, and these are the architect's words under item 2e of the 2026-10-11 direction.

## 4. OPEN items (the human's)

- **OPEN-1: the route.** The honest budget is 180, over §21c's 150. Choices:
  - **(A), recommended:** this five-line form, with the reviewer and the architect from dispatch. This needs the human's word, because §21a, read alone, gives the full form under full gating.
  - **(B):** the full form under full gating. The architect redrafts it from these sections.
  - **(C):** the single gate at 150 or less. Not recommended: even without the guard, the sketch is about 150 to 160, and an overrun (class 6) closes the route mid-piece.
- **OPEN-2: the mutation record's sentence (R1).** The directive says that UC3 and E-AND cover the shell's half (directive `:29`), and that E-AND already shows a conjunction (`:11`). At 467dd47e neither exists in code. Choices:
  - **(a):** the drafted words in §3.
  - **(b):** the human's own words, which the architect checks once.
  - **(c):** the directive's words, landing only once UC3 and E-AND exist in code. The piece's comment would then wait for milestone 3, or change in a later piece.
  
  Not settled here.

## 5. Files read

- C:\dev\spatial-ide\state\directives\2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md
- C:\dev\spatial-ide\state\consults\2026-10-14-engine-clause-composition-properties-impact-read-lead-data.md
- C:\dev\spatial-ide\engine\tests\admission_property_campaign.rs (whole file)
- C:\dev\spatial-ide\engine\src\predicate.rs (:59-125, :440-549, :895-974; grep)
- C:\dev\spatial-ide\engine\src\fixture.rs (:176-189, :340-414, :990-1004, :1076-1095; grep)
- C:\dev\spatial-ide\engine\src\stream.rs (:255-299)
- C:\dev\spatial-ide\engine\src\pool.rs (:1-140)
- C:\dev\spatial-ide\engine\README.md (:520-561)
- C:\dev\spatial-ide\engine\FILTER-BIND-COERCIONS-PREREGISTRATION.md (:95-131)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (:204-229; grep)
- C:\dev\spatial-ide\frontends\shell\STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md (:1-397, as a precedent)
- C:\dev\spatial-ide\KNOWN-LIMITATIONS-ITEM-42-CURRENT-VIEW-PREREGISTRATION.md (the five-line shape)
- C:\dev\spatial-ide\AUTONOMY.md (:306-391, :476-545)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (:1-80)
- C:\dev\spatial-ide\PLAN.yaml (node engine-clause-composition-properties; nodes shell-migration-milestone-3 and stream-evaluation-failure-fixed-detail by grep)
- C:\dev\spatial-ide\scripts\plan\verify-test-claims.mjs (:1-40)
- C:\dev\spatial-ide\scripts\plan\verify-mutation.mjs (:1-60)
- C:\dev\spatial-ide\state\directives\2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md (grep, :9)
- Greps: `frontends/shell/src` (combineClauses and filterClauses: none); `frontends/shell/e2e` (E-AND: none); `*.rs` for the temp-path names; `docs/adr/ADR-021*`; `rustfmt.toml` (none)
