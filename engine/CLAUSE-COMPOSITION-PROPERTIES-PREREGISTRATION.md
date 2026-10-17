# Clause composition, P5 and P6, over the admission property campaign — five-line short form (`AUTONOMY.md` §21d)

Committed before any code. Drafted by the architect on the custodian's brief, reading main at 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1. Append-only once committed; an amendment made after any outcome says so in its first line. The custodian keeps the PLAN node on main; the branch carries no PLAN or generated file. Path of this form: `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md`.

```
Authority: PLAN node engine-clause-composition-properties; the human's directive, item 1 (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:8-30 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:b2dfc6ded564293c409fb562359da6083f37691c07420d4a960a3be30c785b48) and item 3, fourth bullet (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:49 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:2d9bb66ea7c6cda9a639a22b03d4388b9bc0541178ebf12e2f1fadd78702076f); the owner's-index rule (state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:9 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:9ee29afd68f0103e2fdef80e6838b5b354e23f1e39b103732bf792de4ed4df2e). Evidence (a read, cited for what it reported; every fact used re-checked at 467dd47e): state/consults/2026-10-14-engine-clause-composition-properties-impact-read-lead-data.md. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, each with exit code 1, for property test `No prior art recorded for "property test". Research it before planning an implementation.`, for clause composition `No prior art recorded for "clause composition". Research it before planning an implementation.` and for predicate conjunction `No prior art recorded for "predicate conjunction". Research it before planning an implementation.`; three misses, noted, not blocking.
Scope: engine/tests/admission_property_campaign.rs, insertions only (one module-doc bullet after the P4 bullet; one block appended after the last test; no existing line changes); engine/README.md (the owner's index's list of preregistrations in this module gains this form; one line replaced); 2 files; declared line budget <= 180 changed lines by §21c's counting (insertions plus deletions), this form excluded; no PLAN or generated file on the branch. Over §21c's 150, so closed to the single gate from dispatch (§D; OPEN-1).
Change: one new #[test] in the campaign file runs P5 and P6 over 200 seeded G1 cases and the kept bracket-join witness, through test-only helpers (the join convention, the ids of a completed whole-extent stream, one case), and prints the run's report; no product code, fixture, dependency or existing line changes.
Tests+mutation: new test `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` (engine/tests/admission_property_campaign.rs). Mutation: the test helper joins without the brackets (in `join_clauses`, `.map(|t| format!("({t})"))` becomes `.map(|t| t.to_string())`); the test fails by name on the witness's P5 result line. Observed by applying it at the final code commit, running the test by its exact name, recording the failure with that commit id, and reverting it (§B).
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, no product code, nothing under protocol/ or kernel/; ADR-021's admission is driven by the test and changed in nothing; no existing property's test, assertion, generator, seed or helper changes (the campaign file's diff has zero deletions); no fixture, dependency, exposure surface or string the app shows.
```

### §A. P5 and P6 as this piece runs them (sharpened, not widened)

Run conditions (directive item 1, P5's run conditions):
1. Fixture: `fixture()` unchanged — MultiType, 800 features, `FIXTURE_SEED` (engine/tests/admission_property_campaign.rs:55-56 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:11de179ef6b10bed86e5fa2adf8156b247a17a6015b4294444f014d1be9c7136); `zone` holds NULLs, one row in five (engine/src/fixture.rs:359-367 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:01f875640c391579f43a7e1f656b326cd4ec849022b6cf476df86ed8fd39c16e).
2. The test opens its own `Dataset` and runs one stream at a time, each drained to its end.
3. Viewport: `facts.extent` as a `Bbox`, the union of every feature's bbox (engine/src/fixture.rs:1086-1090 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:0e9050e1ac3e5b684ed749fbcf5d5616e592f23dab66a007fef747d385f48107), in the dataset's CRS; limit `FIXTURE_FEATURES + 1`; no projection; no cancel.

Generation:
4. Its own seed `P5_SEED = 0x0B02_A005_0000_0005` and its own `Rng`; no draw from G1 to G4's streams. `P5_CASES = 200`. Per case, n = `r.below(4) + 1`. Each text is `gen_expr(&mut r, r.below(5))`, G1's draw as the campaign makes it (engine/tests/admission_property_campaign.rs:1055-1058 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:3221190e61212c140f8257e156c179d373f7e9c736a2513e495f1696e9562be3). A text is kept only if `AdmittedPredicate::admit` admits it alone; a refused draw is discarded and counted. `P5_DRAW_CAP = 2_000` discarded draws per run: reaching it fails the test, and it never excludes a case.
5. `join_clauses` is the directive's convention (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:13-16 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:fd1f7cdeb2b1bf101db642a44e32b93b43c1a8e70c40f01e74a37c7cd0dbd7e9): no text gives `None`; one gives the text byte for byte; two or more give each text in one pair of brackets, joined by `" AND "`. Nothing is trimmed or case-folded.

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
13. Exclusion: the campaign's `is_declared_integer_arithmetic_overflow`, unchanged (engine/tests/admission_property_campaign.rs:1009-1025 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:28064433feb53976108e1765d68b5270473630f6fc2e52006c750e7d63848a7a), applied to each of the n+1 runs with that run's own text (the text alone, or the join). If it matches any run, the case is excluded: counted and reported, not compared, and not counted as passed. That function is removed when node stream-evaluation-failure-fixed-detail lands (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:131 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:fb775f4b3aca30cb44c7d2cab30e5e96093b794f1a73d8dba26df0eada5843b7). P5's exclusion goes with it, and that node's form owns this call site.
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
4. **The record.** The test's doc comment records the mutation the way B-1's does (engine/tests/admission_property_campaign.rs:1237-1243 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:9e12a086827e9f563865bb658d8807984268fa02ae86694ef4be486fb0b5ecd3), with the sentence OPEN-2 settles.
5. **The observation of record** is as the Tests+mutation line states. No record calls a `verify-mutation` run an observation of a mutation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2).

### §C. Candidates and the report

1. **Candidates (directive item 1 and item 3's fourth bullet).**
   - Every failure in the unmutated run is a candidate until it is reproduced (the same seed and case) and minimized (§B.1's steps, keeping the same failure).
   - It is real when it is reproduced, minimized, and a defect of the product, not of this test. The report gives the reason for each candidate.
   - A defect of the test is fixed inside Scope and recorded.
   - A real one stops the piece before the PR and goes through normal triage (state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:6 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:6a5fcf88aa1e8e5dedfd94aee8da5a8c32fac7745d0f10c24ff3d4c76821ccb7). The piece adds no exclusion, ignore or generator change, and fixes no product code.
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
  - E2: refused-by-code shows filter_too_deep 0, because each top-level operand is walked from depth 1 and a same-operator AND chain is flattened (engine/src/predicate.rs:514-525 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:576c067a1518ea5f19e432d30924519351e6ad08bd3a7339158d90b08529d84f; engine/src/predicate.rs:952-955 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:346c4137ad3364b895432abf534f95dad211b2c339ca4bb8dd72d25f5687a221). filter_too_long is rare, possibly 0. These are reported as counts, not as findings.
  - E3: the excluded count is material, because `i64` spans the 64-bit range (engine/src/fixture.rs:406-408 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:a47258ddefc5cbae1d4c42458c064a162e2c4c3a77c02a453efbec7b3a12e351).
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
  - that the shell joins this way: the helper is the directive's convention, which matches milestone 3's text (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:210-215 @ 467dd47e8504cf7ad810a9b8d80f97d4f8fd50a1 sha256:968ee9c21a59eea66a3509d8a2ebe5ef4fb014fbbcc9b34da8f38c09d24acd25), not built code;
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

### Amendment 1 — the human's rulings on OPEN-1 and OPEN-2 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md`, item 4). References only.*

1. **OPEN-1 (A):** this five-line form, with the reviewer and the architect, both to an affirmative PASS, from dispatch (§F).
2. **OPEN-2 (a):** the drafted sentence goes into the test's doc comment, as §B item 4 says. It is byte-copied by script from `state/consults/2026-10-14-engine-clause-composition-properties-architect-draft.md:184 @ 79cec8c5e45767a2b96edec85b76d1a7b6734d2a sha256:1be808e1b8a6b88b52031f32745ad8d5baf1669df7f44e57dd71ed080d6c29b2` (a sub-line span: the words after the bold label; the hash is the whole line's):

```text
It mutates this Rust test helper, not the shell's combineClauses; milestone 3's form gives the shell's half to its unit row UC3 (combineClauses) and its e2e row E-AND (the joined text, end to end).
```

3. **Generation:** the node's generation goes up by one.

Nothing above is edited.
