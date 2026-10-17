Reviewed: PR #224 at 93f2b927d0dcfd64abd0a608e6dfaf1335493455 (base e555177c)
cut/engine-clause-composition-properties @ 93f2b927d0dcfd64abd0a608e6dfaf1335493455
Verdict: PASS WITH NOTES

None of the findings blocks. The five Documentation findings below must be fixed before the merge, with no re-gate.

## Correctness
None. I checked §A rule by rule against the code at the head (`engine/tests/admission_property_campaign.rs`):
- **Run conditions:** the test uses `fixture()` unchanged and opens its own `Dataset` (:1403). `completed_ids` (:1309-1341) builds `Bbox` from `fx.facts.extent` in `ds.crs().identifier()`, sets the limit to `FIXTURE_FEATURES + 1`, uses `stream_with_cancel` (no projection, a fresh `CancelToken` that is never cancelled) and drains each stream to its end, one stream at a time.
- **Generation:**
  - It uses its own `P5_SEED` and `Rng` and draws n with `r.below(4) + 1` before its texts. Each text is `let d = r.below(5); gen_expr(&mut r, d)`, which is G1's draw in the same order.
  - A refused draw is discarded and counted. The `assert!(discarded < P5_DRAW_CAP)` fails the test when the cap is reached and never excludes a case.
  - `join_clauses` (:1293-1306) matches rule 5: none gives `None`, one gives the text byte for byte, two or more go in brackets joined by `" AND "`. Nothing is trimmed.
- **P5 admission (rule 6, :1353-1359):** only `TooLong` and `TooDeep` are allowed and they are counted by `code_of`. Every other outcome, `ConnectionsExhausted` and `Panicked` included, is a candidate. An allowed refusal returns before P6 and before any stream.
- **P6 (rule 8, :1360-1372):** it checks masks for subset sizes 2 to n-1 in index order, so the subsets keep their order. That gives 3 subsets at n=3, 10 at n=4 and 0 at n≤2. It checks admission only and treats any refusal as a candidate.
- **Rules 9 and 10:** both admission steps come before the first `completed_ids` call (:1373). An excluded case is still admission-checked, and its "excluded" label is returned before the comparison (:1381-1383), so it is never compared or counted as passed. The labels "P5 admission", "P6 admission", "execution of" and "P5 result" are distinct.
- **Rule 11:** on an error, `?` returns before any ids are kept.
- **Rule 12:** the length of the set is compared with the length of the Vec before the set is returned.
- **Rule 13:** the exclusion applies only to a terminal error (`Err((true, e))`), tested against that run's own text over all n+1 runs. This matches how `stream_check` applies it at :1160.
- **Rule 14:** a start error (`Err((false, _))`), a duplicate, or a terminal error the exclusion does not match is a candidate, including after another run of the same case was excluded, because the loop continues past an exclusion.
- **Rule 15:** `p5_case` returns exactly one `Ok(label)` or one `Err`, and each is tallied once.
- **§B:** `P5_WITNESS` holds literal texts and is case 0, run through `p5_case` first. The guard (:1432-1440) builds both joins without `join_clauses`.
- **Doc comment (:1395-1399):** it records the mutation in B-1's shape. Its last line, after `/// `, matches Amendment 1's sentence byte for byte (`cmp` rc 0). That sentence is the tail of line 184 of `state/consults/2026-10-14-engine-clause-composition-properties-architect-draft.md` @ 79cec8c5, and the whole line's sha256 recomputes to 1be808e1…, matching the pin.

## Evidence
None blocking.
- The mutated and unmutated runs reproduce the report's printed lines exactly (below).
- E5 holds:
  - numstat shows 169 lines in and 0 out for the campaign file, and 1 in and 1 out for `engine/README.md`, over 2 files.
  - The diff touches no product, fixture, dependency, lockfile, ADR, protocol or kernel file.
  - I re-ran the campaign at B. Its 7 lines (the fixture line, the G1 to G4 tallies and the stream-error lines) are byte-identical to the same lines at the head (`cmp` rc 0).
- Amendment 2's moved pins:
  - `engine/src/predicate.rs:536-547` hashes to 576c067a…, and `:974-977` hashes to 346c4137…, both at e555177c and at the head. These equal the 467dd47e pins at :514-525 and :952-955.
  - All 16 other pins in the form are identical at B.
  - `engine/src` did not change between B and the head.
  - Between 467dd47e and B, `dataset.rs`, `stream.rs`, `fixture.rs`, `lib.rs` and the campaign file are identical. The only change in `predicate.rs` is the `columns` field and `referenced_columns`. `admit`'s signature and its refusal paths are unchanged.
- Report hash: `tail -n +5` of the report hashes to 710c486f…, as Amendment 2 states.
- E3 (that the excluded count would be material) has no threshold in the form. The count of 4 of 201 is reported as a count. This is an observation, not a finding.

## Documentation (must fix before the merge; no re-gate; none of these is the human's wording)

**D1. `engine/tests/admission_property_campaign.rs:33-37` (the worker's module-doc bullet).**
- Problem 1: "by the shell's convention" reads as a claim that the shell joins this way, which §E's may-not-claim list forbids. `combineClauses` exists only in milestone 3's form. `git grep combineClauses|filterClauses` printed no lines under `frontends/shell/src` at 93f2b927 or on main (R1 of the impact read).
- Problem 2: the P6 clause reads as unconditional, but the code checks P6 only when the join is admitted.
- Replacement words (6 lines; budget 172 of 180 with D2; still insertions only relative to B):
```
//! - **P5 and P6** — two more, in their own test and seed: a join of 1 to 4 G1 texts, each admitted
//!   alone, by the directive's join convention (`join_clauses`: one text unchanged, two or more
//!   each in brackets, joined by ` AND `; milestone 3's planned `combineClauses`, not built
//!   code) is admitted or refused only as too long or too deep, and if admitted returns exactly
//!   the intersection of the ids the texts return alone (P5); if it is admitted, every
//!   order-preserving subset of 2 to n-1 of its texts admits too (P6).
```
- Each clause checked against the code:
  - "directive's join convention": directive item 1, pinned in §A rule 5.
  - "one text unchanged": `[one] => Some(one.clone())`.
  - "each in brackets, joined by ` AND `": :1300 `format!("({t})")` and `.join(" AND ")`.
  - "planned …, not built code": no `combineClauses` under `frontends/shell/src`.
  - "refused only as too long or too deep": :1356-1359.
  - "if admitted returns exactly the intersection": :1384 `sets[n] != want`.
  - "if it is admitted, every subset 2..n-1 admits": the P6 loop runs only after the `Admitted` arm.

**D2. `engine/tests/admission_property_campaign.rs:1291-1292` (the worker's `join_clauses` doc).**
- Problem: "The shell's join convention" has the same may-not-claim problem as D1.
- Replacement words:
```
/// The directive's join convention (its item 1; milestone 3's planned `combineClauses`, not built
/// code): no text is no filter, one is itself byte for byte, two or more are each in one pair of
/// brackets joined by `" AND "`.
```
- Clause check: the three cases are :1295, :1296 and :1297-1304. The "not built code" clause is checked as in D1.

**D3. `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md`, Amendment 2's italic note (working tree :141; the custodian's text).**
- Problem: the report's sha256 is written without an `@ <rev>`. That breaks round 15 (e), and §C.4 requires the reference by path @ a main commit.
- Fix: commit the report to main first, then name that commit. The commit must not be the one that adds Amendment 2.
- Replacement words: "…is `state/consults/2026-10-17-engine-clause-composition-properties-worker-report.md` @ <full id of the main commit that adds it> (its sha256 from line 5 to the end, 710c486fd4315d4183785360db5e9567d38e04e09438fcec7d338eea85621934)."
- Clause check: the hash recomputes (above).

**D4. The same form, Amendment 2 item 5 (a) (working tree :148).**
- Problem: "No workflow runs clippy." states the state of CI with no commit (round 15 (c)).
- Replacement words: "At e555177c no workflow runs clippy."
- Clause check: `git grep -n -i clippy e555177c -- .github` finds one line, a comment in `.github/workflows/rust-fmt.yml:14` that says "not clippy".

**D5. §C.3 asks for CI's step time; the report has none** (its line 51 says none was available).
- This is not Evidence: the directive asks for "time spent", and the report's libtest `finished in` lines supply it.
- Fix: the closing amendment adds the CI step time for the campaign's test step as a log reading, not a docs/08 measurement.
- Source: the push run 39015992294 at 93f2b927. Its job `cargo test --workspace (windows-latest)` (117348145664) passed in 18m41s as a whole job; read the step from its log.

## The mutation I made
- **Setup:** a detached worktree at `C:/dev/wt/gate224` at 93f2b927. Line 1300 changed from `.map(|t| format!("({t})"))` to `.map(|t| t.to_string())`, shown by `git diff --numstat` as 1 in, 1 out.
- **Run:** the exact name with `--exact --nocapture`, rc 101. The failure is at `admission_property_campaign.rs:1430:5` with `29 candidate(s)`, and the test reads FAILED.
- **First candidate line, byte-copied from the output:**
  `  candidate case 0 ["zone ILIKE '_ivic'\nor flag", "zone = 'residential'"]: P5 result: "zone ILIKE '_ivic'\nor flag AND zone = 'residential'": 242 ids, intersection 97`
- **Tally line:** `discarded 315/2000, P6 subsets admitted 724, tally {"excluded": 4, "passed": 168, "skp.filter_too_deep": 0, "skp.filter_too_long": 0}`. This matches the report's 29, 168 and 4, and its 242/97.
- **Revert:** `git checkout --` rc 0. `git status --porcelain --untracked-files=all` printed nothing, and HEAD was 93f2b927. I removed the worktree at the end (`git worktree remove` rc 0; `git worktree list` no longer shows it).
- No `verify-mutation` run is treated as an observation of a mutation here.

## Commands and exit codes
- **Diff and checkout:**
  - `git fetch origin`: rc 0.
  - `git diff --numstat e555177c...93f2b927`: 1 1 `engine/README.md`; 169 0 `engine/tests/admission_property_campaign.rs`.
  - `git worktree add --detach C:/dev/wt/gate224 93f2b927…`: rc 0.
- **Cargo runs**, each in its own shared hold, all with `CARGO_TARGET_DIR=D:/wt-targets/ccp CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`. The hold was granted every time and the script never returned 96 to 99.
  - Unmutated, the exact name, `--exact --nocapture` at the head: rc 0, zero candidates. The printed lines are byte-identical to the report's: `P5_SEED 0xb02a00500000005, P5_CASES 200, witness [...]` and `discarded 315/2000, P6 subsets admitted 724, tally {"excluded": 4, "passed": 197, "skp.filter_too_deep": 0, "skp.filter_too_long": 0}`. Libtest reads `finished in 12.46s` (a log reading).
  - Mutated: rc 101 (above).
  - Whole campaign binary at the head, `--nocapture`: rc 0, 3 passed, `finished in 29.25s`.
  - Whole campaign binary at B (e555177c, the same worktree re-detached): rc 0, 2 passed. Its G1 to G4 lines and stream-error lines `cmp` equal to the head's, rc 0.
- **Checks at the head:**
  - `cargo fmt --all -- --check`: rc 0.
  - `node scripts/plan/verify-cites.mjs`: rc 0 (PASS, 40 advisories, all outside this piece).
  - `verify-quotes.mjs`: rc 0.
  - `verify-test-claims.mjs`: rc 0.
  - `verify.mjs`: rc 0.
  - `verify-mutation.mjs`: rc 0. It reports `ok engine/tests/admission_property_campaign.rs:1401 — rust test "a_join_…"`; it runs no mutation.
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 457 pass, 0 fail.
  - Worktree porcelain after the scripts: empty.
- **Main checkout's working tree** (Amendment 2 uncommitted; the report untracked, so verify-cites did not scan it): `verify-cites.mjs` rc 0 and `verify-quotes.mjs` rc 0, with porcelain unchanged before and after.
- **PR checks:**
  - `gh pr checks 224`: rc 8 (one check pending). All other checks pass.
  - The pending check is `cargo test --workspace (windows-latest)` of the pull_request run 39016467325.
  - Every run's headSha is 93f2b927d0dcfd64abd0a608e6dfaf1335493455 (push runs 39015992294 and 39015992342; pull_request runs 39016467325, 39016467223, 39016467262 and 39016467256). The pull_request runs build GitHub's merge ref.
  - `mergeStateStatus` is UNKNOWN.
  - Re-read the Windows PR job before the merge.
- **Read-only checks:**
  - Every pin in the form recomputed by script at its pinned commit and at B (all match the pin; two moved as Amendment 2 states).
  - The report's tail hash recomputed.
  - Amendment 1's sentence compared byte for byte.
  - `git grep clippy` on e555177c `.github`.
  - `git grep combineClauses|filterClauses` under `frontends/shell/src`: piped through `head`, so I report no rc; it printed no lines.

Files: C:/dev/spatial-ide/engine/tests/admission_property_campaign.rs (at 93f2b927), C:/dev/spatial-ide/engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-17-engine-clause-composition-properties-worker-report.md
