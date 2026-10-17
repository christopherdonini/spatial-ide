*Custodian's filing note (2026-10-17): the worker's report for `engine-clause-composition-properties`, which is also the form's §C.3 run report, in C:/dev/wt/ccp from e555177c; the head 93f2b927d0dcfd64abd0a608e6dfaf1335493455, pushed and checked by the custodian (porcelain empty; local equals origin; two commits; numstat 169 and 0 in the campaign file, 1 and 1 in engine/README.md; the doc comment's last line is Amendment 1's sentence byte for byte; PR #224 open at the head). The run 2026-10-17T07:32:37Z to 2026-10-17T08:10:58Z by its transcript (Read 6, Bash 62, Write 5); its one SubagentHandback call, at 08:10:56Z. Extracted by script; 3 rooted path:line cite(s) de-rooted, each now `line N of <path> (on the branch)`; one final newline added; nothing else changed. The message's sha256 as handed back is d10586bb071ebc6bd73479c9de2fd20851a4569c8240b695b147f46d52c4c997; this file's, from line 5 to the end, is 710c486fd4315d4183785360db5e9567d38e04e09438fcec7d338eea85621934.*

---

REPORT: node:engine-clause-composition-properties@g2 (worker; model as the harness reports it: Sonnet 5.5, claude-sonnet-5-5; no override, no context handoff)

HEAD AND COMMITS
- Worktree C:/dev/wt/ccp, branch cut/engine-clause-composition-properties. Start: HEAD = B = e555177c438cdfee390e6073520be2734fb731fe after git fetch origin (rc 0); porcelain empty.
- Head: 93f2b927d0dcfd64abd0a608e6dfaf1335493455, pushed (plain update, never forced, rc 0).
- ec9c76649803316bbda8c10b8f445542adcda549 `test:` the one test, its helpers and the module-doc bullet. Pushed, rc 0.
- 93f2b927d0dcfd64abd0a608e6dfaf1335493455 `docs:` the owner's-index line in engine/README.md. Pushed, rc 0.
- `git commit -s` puts the Signed-off-by line after the two required trailer lines. Both messages end with the two lines, then Signed-off-by.
- Final porcelain: empty (git status --porcelain --untracked-files=all printed nothing).

PINS AT B (all 17 pins of the form's body, recomputed by script; each hash first checked against its own pin commit)
- Identical at B (15): the three directive/ruling pins (the directive's :8-30, :49, :13-16, :6; the 2026-10-11 ruling :9); campaign :55-56, :1055-1058, :1009-1025, :1237-1243; fixture.rs :359-367, :1086-1090, :406-408; line 131 of FILTER-BIND-COERCIONS-PREREGISTRATION.md (on the branch); line 172 of docs/PREREGISTRATION-TEMPLATE.md (on the branch); milestone 3 form :210-215.
- Moved (2, class 3, bytes identical): predicate.rs:514-525 is now :536-547; predicate.rs:952-955 is now :974-977. Both shifted by +22, from d95f964a adding the `columns` field and `referenced_columns`.
- Changed: none.
- Amendment 1's pin (architect-draft :184 @ 79cec8c5, sha256 1be808e1...): the hash is verified. The sentence is a sub-line span of that line.
- engine/README.md changed since 467dd47e (the referenced_columns pointer). The form pins nothing in it.

INVALIDATORS (§E), 467dd47e vs B
- `git diff --quiet` is clean across dataset.rs, stream.rs, fixture.rs, lib.rs, Cargo.toml and the campaign file. So `Dataset::open` (dataset.rs:222), `stream_with_cancel` (stream.rs:906), `next_into` (stream.rs:782), the `ViewportQuery` builders (stream.rs:242 onward), `FixtureFacts.extent` (fixture.rs:603) and the campaign helpers named in §A are identical.
- `AdmittedPredicate::admit`: signature unchanged (predicate.rs:115). The diff only adds a `columns` field, a dedup of `structural.columns` after every check, and `referenced_columns`. No refusal path changed.
- engine/src/identity.rs changed in comments only. No STOP.

THE TEST
- Name: a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit, at line 1401 of engine/tests/admission_property_campaign.rs (on the branch).
- Parts, by line at my head:
  - :1279-1289 constants and the witness P5_WITNESS (literal texts).
  - :1293-1306 join_clauses. The mutation line is :1300.
  - :1309-1341 completed_ids: own stream, whole extent, limit FIXTURE_FEATURES + 1, drained; a start or terminal error gives no ids; duplicates are refused before the set.
  - :1345-1393 p5_case:
    - :1353-1359 the join's admission (only TooLong or TooDeep are allowed refusals, counted by code), labelled P5 admission.
    - :1360-1372 P6: subsets of size 2 to n-1 by mask, labelled P6 admission, before any stream.
    - :1373-1380 the n+1 runs, with exclusion by each run's own text (:1376) and any other failure failing the case.
    - :1381-1383 excluded, never compared.
    - :1384-1391 the intersection compare, labelled P5 result.
  - :1404-1421 own seed and Rng, the sampler with its draw cap; case 0 is the witness, so it runs first.
  - :1422-1430 runs, tally and the candidate assertion.
  - :1432-1440 the guard, written without join_clauses.
- Module-doc bullet at :33-37, after the P4 bullet.
- Doc comment :1395-1399: the mutation recorded the way B-1's is, plus Amendment 1's sentence on its own `///` line (:1399). A script confirmed that line equals the sentence byte for byte, and that the sentence ends line 184 of the architect draft at 79cec8c5.

PRINTED LINES (commit 93f2b927, same code as ec9c7664). Command: CARGO_TARGET_DIR=D:/wt-targets/ccp CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 cargo test -p spatial-engine --test admission_property_campaign --locked a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit -- --exact --nocapture (rc 0)
P5_SEED 0xb02a00500000005, P5_CASES 200, witness ["zone ILIKE '_ivic'\nor flag", "zone = 'residential'"]
discarded 315/2000, P6 subsets admitted 724, tally {"excluded": 4, "passed": 197, "skp.filter_too_deep": 0, "skp.filter_too_long": 0}
test a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 2 filtered out; finished in 11.43s
- The tally counts the witness plus the 200 seeded cases: 197 + 4 = 201.
- Other `finished in` readings, log readings and not docs/08 measurements: 14.22 s for the same test on the same code before commit; 28.06 s for the whole campaign binary at B (2 tests); 30.82 s at head (3 tests, rc 0). The cold first build took 15m28s. No CI step time is available to me.

WITNESS DERIVATION
- Start: the mutated run (join_clauses without brackets), on the tree with a placeholder witness that did not discriminate. The first reported P5 result failure was case 7 of seed 0x0B02_A005_0000_0005. Case 0 is the witness slot, so this is the 7th seeded case.
- Texts drawn:
  1. `f32 = 0.1`
  2. `zone ILIKE '_ivic'` newline `or nOt (((NOT flag))` tab `and (-area < 0.1))`
  3. `zone = 'residential'`
- Bare join 157 ids, bracketed join 33 ids, intersection 33.
- I chose each step by hand and checked its three keeps with a scratch probe (below). Every step kept all three: each text admitted alone, no run errored or excluded, and the bare join's ids differ from the bracketed join's (bare / bracketed ids).
  1. Drop text 1: bare 242, bracketed 97. Other single drops tried: dropping text 3 also kept; dropping text 2 did not.
  2. Drop the `nOt` before the bracketed expression: 216 / 71.
  3. Replace the AND node by its left operand: 216 / 71.
  4. Drop a bracket pair: 216 / 71.
  5. Drop a bracket pair: 216 / 71.
  6. Drop a bracket pair: 216 / 71.
  7. Drop the NOT: 242 / 97.
- Final texts: `zone ILIKE '_ivic'` newline `or flag`, and `zone = 'residential'`.
- Stop check: the only single steps left are replacing the OR by one operand or dropping a text.
  - Replacing the OR by its left operand: bare and bracketed both 0 ids.
  - Replacing the OR by its right operand: both 97 ids.
  - Dropping a text goes below two.
  - The final texts have no NOT, bracket pair or AND.
- The mutated run's failure count: 29 candidates at ec9c7664 (the witness plus 28 seeded cases). On the placeholder tree it was 28.

MUTATION OBSERVATION (E4)
- Applied at ec9c7664 as an uncommitted one-line edit at campaign :1300: `.map(|t| format!("({t})"))` became `.map(|t| t.to_string())`.
- Ran the test by its exact name. It FAILED by name, and the first candidate line printed is the witness's P5 result line, byte-copied:
  candidate case 0 ["zone ILIKE '_ivic'\nor flag", "zone = 'residential'"]: P5 result: "zone ILIKE '_ivic'\nor flag AND zone = 'residential'": 242 ids, intersection 97
- The failure at campaign :1430 reads 29 candidate(s). The tally line read passed 168, excluded 4.
- Reverted with git checkout; porcelain printed nothing. No `verify-mutation` run is claimed as an observation.

CANDIDATES (§C.1)
- Unmutated run: 0 candidates, 0 real (E1 holds).
- A defect of the test, found and fixed before the first commit and so never a candidate in a committed state: p5_case sliced the sets for a run missing after an exclusion. It now returns excluded before the compare.

E1 TO E6
- E1: held. 0 candidates.
- E2: held. filter_too_deep 0 and filter_too_long 0 (counts, not findings).
- E3: excluded is 4 of 201 cases (about 2%). Whether that is material is not defined by the form, so I report the count only. I did not inspect the four.
- E4: held (above).
- E5: held. The campaign file's numstat is 169 insertions, 0 deletions. The G1 to G4 tally lines and the two stream-error lines are identical at B and at head (diff of the printed lines, no difference). Base run: cargo test -p spatial-engine --test admission_property_campaign --locked -- --nocapture, rc 0, 2 passed. Head run: same command, rc 0, 3 passed.
- E6:
  - Campaign run at B and head: both rc 0.
  - `cargo fmt --all -- --check`: rc 0 at B and at head.
  - Clippy: see the difference below. No warning falls on an added line.
  - verify.mjs rc 0, verify-cites rc 0, verify-quotes rc 0, verify-test-claims rc 0.
  - verify-mutation rc 0: all 1 new test(s) have a recorded mutation naming them. It runs no mutation.
  - `node --test` over the three suites: rc 0, 457 pass, 0 fail.
  - PR CI: not mine.

§D COUNT (git diff --numstat e555177c...HEAD)
- engine/README.md: 1 insertion, 1 deletion.
- engine/tests/admission_property_campaign.rs: 169 insertions, 0 deletions.
- Total 171 against the declared 180. No overrun.

COMMANDS AND EXIT CODES
- Rc 0:
  - git fetch; the pin and invalidator scripts.
  - Hold, cold base run, release (cargo rc 0).
  - `--no-run` build.
  - The unmutated filtered runs.
  - Hold, clippy, release (rc 0).
  - Hold, head campaign run, release (rc 0).
  - The five verify scripts before and after the commits.
  - node --test.
  - Both commits and both pushes.
  - git checkout after the mutation.
  - cargo fmt --check.
- Rc 101 (expected or fixed during development): the first filtered run (the sets slice defect, fixed); the second run (the guard failed because the placeholder witness did not separate); the mutated runs (expected).
- The probe runs went through a grep pipe, so I report no exit code for them. Each printed `test result: ok`.
- The hold script never returned 96 to 99.

DIFFERENCES FROM THE FORM OR THE BRIEF
1. The brief says to run clippy as that workflow runs it. product-ci-rust.yml runs no clippy; only `cargo build --workspace --tests --locked` and `cargo test --workspace --locked`. No workflow I found runs clippy. I ran `cargo clippy -p spatial-engine --tests --locked` (rc 0, 39 warnings, all pre-existing). The four in the campaign file are at lines 216, 268, 541 and 554, all existing code.
2. The scratch probe (§B.1) was a temporary test appended to the campaign file, never committed, and removed before the commit (grep finds 0 occurrences). It supplied the three keeps. I chose each reduction step by hand. The probe is a tool and was not an automatic minimizer.
3. The module-doc header "The four properties:" stays stale, because insertions only (E5) forbids editing it. The new bullet says it adds two more.
4. The guard uses `assert!(separates, ...)` instead of assert_ne!, so a failure does not print two 800-id sets.
5. `completed_ids` admits the text itself and returns a set, and a duplicate is its `Err((false, _))`. This saved lines and does not change the rules.
6. The draw-cap assert runs after every draw, so reaching 2,000 refused draws fails the test.
7. The sampler runs for all cases before the first run. The seeded cases draw the same way, and the witness slot consumes no draw.

NOT DONE (not mine)
- The form, PLAN, the queue, the PR, the run-report file (the custodian files it from this message), and CI's step time.

Files: C:/dev/wt/ccp/engine/tests/admission_property_campaign.rs, C:/dev/wt/ccp/engine/README.md.
