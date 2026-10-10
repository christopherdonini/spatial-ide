# PR #204 gate 1 — reviewer
Reviewed: cut/e2e-stale-expectations-reaim @ ef1cc519c913a2bbc5d28a86530c579fae0f3ed6

**Verdict: FAIL.** There are two Evidence findings, E1 and E2. Each is a claim that the code or the evidence does not support. Both are fixed with text: one row in the walkthrough, plus the PR title and body. No code defect was found. The code matches the form and Amendments 1 to 3 item by item, every hash pin recomputes, CI is green and the light checks pass. There are three Documentation findings (D1 to D3), each to be fixed before the merge, and some advisory notes.

## Evidence (blocking)

**E1. The walkthrough's GROUP′ coverage row claims an assertion that the step no longer makes.**
- `frontends/shell/MANUAL-WALKTHROUGH.md:685` at ef1cc519 says the step asserts that "3 identical filter queries yield exactly 3 residential untiled `viewport_query` rows in one `×N` group". The column is defined as what each step asserts when it passes.
- That is the cf2434e6 wording. It was written for §2.3's GROUP′, which Amendment 2 item 2 superseded.
- At H, `stepGroup` passes when the three rows are split across items. Trace for items `[×2 a:viewport_query][b:<log line>][a:viewport_query]`:
  - (a) passes;
  - (b) finds no adjacent equal keys;
  - (c) counts exercised = 1.
- So "in one ×N group" is not something the step guarantees. The five solo runs did show one ×3 group each time, but that was observed, not asserted.
- The e2e README was updated at ef1cc519. This walkthrough row was not.
- **Fix:** restate the row to match Amendment 2 item 2's rule, as the README's GROUP′ paragraph already does.

**E2. The PR title and body say every existing fixture's bytes were shown unchanged. The T4 record does not support "every".**
- The title says "every existing fixture's bytes shown unchanged". The body's heading is "Every existing fixture byte-identical", and its T4 bullet says only "make-fixture's output is equal, and no file of 1 GiB or more exists".
- Worker report 2 lists three T4 files as **not covered**, because no producer exists in the tree (`state/consults/2026-10-10-e2e-stale-expectations-reaim-worker-report-2.md:97-99`):
  - `admission-remediation/bothneeded-temp.parquet`;
  - `first-batch/lever-b2-seam.parquet`;
  - `skp-admission-late-match-cancel.parquet`.
- The same report also records that `polygons-100k` was hashed through `make-fixture` instead of its `slice_budgets` producer, a deviation from the form (lines 94-96).
- Amendment 2 item 12.2 and round 15 (b) require uncovered files to be listed as not covered. The body omits all three, and omits the substitution.
- **Fix:** qualify the title, and name the three not-covered files and the `make-fixture` substitution in the T4 bullet.

## Documentation (must fix before the merge; not blocking)

**D1. `engine/src/fixture.rs` holds more than "one variant and nothing else".**
- The diff contains the `StringIdsBesideParcelKey` variant (B1 to B5 and its declaration at 546-548, exactly as Amendment 2 item 5 lists them). It also contains a 2-line doc-comment change to `ForeignKeyColumn` (533-534 at cf2434e6).
- That change is not code, and it corrects a doc that had become stale.
- But §2.6 (A), Amendment 1 item 2 and §8 item 1 rule in only the variant. Amendment 2 item 5 lists the doc change without ruling it in, and the PR body calls the file's change "one feature-gated variant".
- **Fix:** either have the record name the doc fix under §8 item 1, or revert those two lines. Make the body match.

**D2. The PR body says rows C2, C3, I4, I5, I6 and I8 "have blank result logs". They do not.**
- Part C's result log (2026-08-14) records a pass for the old C2 text: "`engine.identity_unusable` verbatim".
- Part I's result log (2026-08-30) covers the old I4, I5, I6 and I8.
- Neither log was edited, which is correct under §8 item 5. But the diff adds no blank result log, and no marker saying the existing logs are not evidence for the new texts. The walkthrough's own L7 and L8 rows set that precedent.
- §9's Operator bullet ("committed with blank result logs") is therefore not met in the diff.
- **Fix:** add the queued marker or blank log section, and correct the body.

**D3. A stale cite in the walkthrough, a file in this PR's scope.**
- `MANUAL-WALKTHROUGH.md:949` (row N6) cites `source-changed.mjs:726-739` as S3's mtime touch.
- At the base f0fccfaf those lines were already S2's return. At H they are inside S2's notch loop. S3's touch now sits at 871 for the `reopen` route, and the default route's S3 is the junction retarget.
- **Fix:** re-point the cite, or pin it to a commit.

## Advisory notes (not findings against the form)
- `console.mjs` `stepGroup`: if the console label fails to parse, `label.total` is null and R becomes negative or NaN, so the capacity check passes without testing anything. M9c shows the parse works at H. A `total === null` guard would close this.
- `source-changed.mjs`: `layoutPreRoute()` runs before S3's `process.platform` guard.
  - Off Windows, `symlinkSync(.., "junction")` makes a plain symlink, which §8 item 6 would count as another link type, before S3 fails by name.
  - The suites do not run off Windows today.
- The junction `e2e/out/source-changed-link` is left in place after every run (no `unlinkSync` in a `finally`). That keeps the recursive-delete hazard under `e2e/out` alive.
- `makeJunction` reports any non-junction obstruction at the link path as invalidator I4.

## §8, items 1 to 18
1. Only `engine/src/fixture.rs` changed under a product path; see D1. No product file other than `fixture.rs` changed in `f0fccfaf..H`.
2. No arm is set or pinned. `main` reads `getResidencyArm` back and stops unless it is `"candidate"` (M10 observed this).
3. REFUSAL′ and GROUP′ wait with `pollConsole`, bounded at 5000/100 ms with a condition. `waitForNextConsoleFrame` remains only inside `expandAllGroups`, which predates this piece.
4. GROUP′ does not count headers.
5. All walkthrough hunks are at or above line 685, and the result logs start at line 980. README hunks are at 241-287; the dated record at 436 is untouched.
6. The junction is made with `symlinkSync(..,"junction")` and removed with `unlinkSync`. There is no recursive delete, no `mklink` and no elevation. See the advisory notes.
7. The solo runs at H show `fixture-integrity` PASS and S3's two-copy hash check PASS.
8. The KNOWN-LIMITATIONS line's sha256, db65b22f…a2a, equals the line from [R5]: line 27 @ a576ab37. It is the only item touched: 2 insertions.
9. No mutation was committed (see Mutations).
10. `STRING_ID_MESSAGE` matches the engine's format strings (`identity.rs:337-338`, `error.rs:359`). The read-back itself rests on report 1's item 10.
11. Report 1's GROUP′ and report 3's `filter_type_admission` were reported, not recorded as failures. The latter passed alone: `state/drafts/two-shared-run-failures-solo-2026-10-10/`.
12. I3 fired solo and went to the human, who ruled in round 71. I6′ fired and the worker stopped; the human ruled the new base (Amendment 3). Neither was worked around.
13. No new dependency: 9 files changed, no lockfile or manifest among them.
14. Neither the patch nor M13 appears in history (`SPATIAL_FIXTURE_HASH_LOG` and `append_value(8)` have 0 hits in `git log -p --no-merges f0fccfaf..H`).
15. Five solo console runs, set in advance, each with its own log, all exit 0.
16. Step 6 (c) is present, with the name `GROUP': grouping not exercised`. Its quoted part equals the "fails by name as" capture from `state/directives/2026-10-09-round-71-and-round-70-paste.md:6` @ d151c2e0.
17. Reports 2 and 3 record no corpus write and no `admission_p4_corpus` run.
18. The first Amendment-2 GROUP′ code, 52228d5b (13:22:42+02:00), is a child of merge 71702f90, which carries f0fccfaf (the Amendment 2 commit, 13:17:31+02:00). `git diff cf2434e6 52228d5b` touches only GROUP′, its helpers and the header comment.

## §7 counts (`git diff --numstat origin/main...origin/cut/e2e-stale-expectations-reaim`; merge-base f0fccfaf)

| File | Lines changed | Ceiling |
|---|---|---|
| `console.mjs` | 235 | 220; Amendment 2 item 8's 290 |
| `admission-remediation.mjs` | 146 | 220 |
| `source-changed.mjs` | 142 | 170 |
| `regression.mjs` | 74 | 120 |
| `manual_walkthrough_fixtures.rs` | 80 | 90 |
| `fixture.rs` | 23 | 40 |
| Code and tests total | 700 | 860 |
| `README.md` | 36 | 40 |
| `MANUAL-WALKTHROUGH.md` | 32 | 60 |
| `KNOWN-LIMITATIONS.md` | 2 | 2 |

- 9 files changed.
- `console.mjs` at 235 is recorded as class 8 by Amendment 3 item 7. The 220 in §7 is not edited on main.

## Hash pins
- All 40 pins in Amendments 2 and 3 (A2.R1 to A2.R36, and Amendment 3's four) recompute equal at their pinned commits.
- Each pinned commit (d151c2e0, 6e9b74cf, 14475652) is an ancestor of origin/main.
- Every sha256 line in the solo-run READMEs matches the file beside it:
  - `…-solo-runs/`: 7 of 7;
  - `…-solo-runs-h/`: 11 of 11;
  - `two-shared-run-failures-solo-2026-10-10/`: 4 of 4.
- The self-hashes in reports 1 to 3 (line 5 to the end) match their filing notes.
- Amendment 3 item 4 re-checked:
  - `git rev-parse` prints dd340dd4… twice;
  - `git diff --quiet b8ad22ff f0fccfaf -- engine/src/fixture.rs` exits 0;
  - `git diff --quiet cf2434e6 ef1cc519 -- engine/src/fixture.rs kernel/tests/manual_walkthrough_fixtures.rs` exits 0.
- Amendment 2 item 5's line list and item 6's M13 line (1097) match `fixture.rs` at cf2434e6. Item 9's cites (506-512 and 910) match too.

## Mutations
Each mutation is recorded by name with its commit:
- M1 to M12 at cf2434e6 (report 1). M8 is the product-line mutation, under the human's allowance.
- M9, M9c, M9n, M9g and M9s at ef1cc519 (report 2).
- M13 at ef1cc519 (report 3): acb02874… against cc0a841a….

The cf2434e6 observations still hold at H:
- `git diff cf2434e6 ef1cc519` is empty for `regression.mjs`, `admission-remediation.mjs`, `source-changed.mjs`, both Rust files, `lib.mjs`, KNOWN-LIMITATIONS and the walkthrough.
- `console.mjs` changed only in GROUP′, so M7, M8 and M10 still stand.

No report calls a `verify-mutation` run an observation. No mutation is committed: the 8 non-merge commits show no mutation text, and the merge brings in only main's files. In the piece's paths, it adds nothing but the form's Amendment 2.

## Item 6's record
- **T1** equal under the rename map: 19 to 19, plus two new files (report 2).
- **First T2** against b8ad22ff: 11 keys differed. This is recorded as class 2 in Amendment 3 item 2, which matches report 2's lines 118-148.
- **T2 with the f0fccfaf base:**
  - workspace: `keys base=359 H=359; lines base=465 H=465; differences=0`;
  - src-tauri: `keys base=20 H=20; lines base=23 H=23; differences=0` (report 3);
  - the base run's one failure is a shared-run failure, re-run alone, which passed 3 of 3.
- **T3:** 21 entries and 5 derivations match. The MANIFEST sha equals A2.R27.
- **T4:** one key is equal. Three files are not covered; see E2.

## Light checks at H (`C:/dev/wt/reaim`)

| Check | Hold | Result |
|---|---|---|
| `node --check` on each of the four changed `.mjs` files | none | rc 0 each |
| `cargo test -p spatial-kernel --test manual_walkthrough_fixtures --locked` (`CARGO_TARGET_DIR=D:/wt-targets/k6`, `CARGO_BUILD_JOBS=8`, `RUST_TEST_THREADS=8`) | `hold shared -Project SpatialIDE`, granted, released | rc 0: 0 passed, 0 failed, 21 ignored. The file has no non-ignored tests; all 21 are generators. |
| `cargo fmt --all --check` | none | rc 0 |
| `verify-cites` | none | rc 0, PASS |
| `verify-quotes` | none | rc 0, PASS (121 checked, 0 errors) |
| `verify-test-claims` | none | rc 0, PASS |
| `verify` | none | rc 0, PASS |
| `queue --check` | none | rc 0, current |
| `site --check` | none | rc 0, current |
| `cfg-boundary` | none | rc 0, 0 outside |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | none | rc 0: 457 tests, 457 pass, 0 fail |

No e2e suite was run and the app was not started.

## CI (`gh pr checks 204`, final, every line; rc 0)

| Check | Run 38058771… | Run 38088279… |
|---|---|---|
| L1 portable correctness · cargo test --workspace (ubuntu-24.04) | pass, 4m56s | pass, 5m2s |
| cargo fmt --check (workspace and src-tauri) | pass, 7s | pass, 10s |
| cargo test --workspace (windows-latest) | pass, 15m29s | pass, 15m48s; it was pending at first and I watched it to completion |
| cfg boundary (PORTABILITY R2) | pass, 9s | pass, 7s |
| tauri build (NSIS, build-only, no signing) | pass, 4m32s | pass, 4m39s |
| test · verify:plan · queue/site drift | pass, 1m18s | pass, 1m12s |
| typecheck · build · vitest · cargo test | pass, 5m53s | pass, 5m55s |
| every commit is signed off | — | pass, 6s |
| no profile path in the range | — | pass, 8s |

## PR body and low-profile direction
- The title, body and the 9 commit messages on the branch carry no outside issue or PR reference and no outside @mention. The only URLs are the attribution lines.
- The body's base, head, size table, reports, solo-run record and may-not-claim list match the head and the reports, apart from E2, D1 and D2.

## State and one deviation
- The worktree is clean at ef1cc519c913a2bbc5d28a86530c579fae0f3ed6. No `reaim-base` worktree remains.
- Nothing was committed, rebased, merged or published, and no process I did not start was touched.
- One deviation: while checking the README hashes, a one-off list file was written to `/tmp` instead of my scratch folder. I removed it in the same command.
