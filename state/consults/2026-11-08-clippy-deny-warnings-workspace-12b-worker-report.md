*Custodian's filing note (2026-11-08): the clippy 12b worker's report, from its hand-back byte for byte (7970 bytes, sha256 b31a88e777729279d94cd53cb365ba58ead0391cebd4a4f744c47dfbf0c290f9), saved with one final newline. The worker ran from 18:16:46Z to 19:29:48Z by its transcript (claude-sonnet-5-5; unique calls: Bash 66, Read 6, Write 3, Grep 1, 76 in all, the hand-back apart). Checked by the custodian at origin: the branch at 10b695f9, one commit on 75390735; 23 lines changed in the seven Scope files; draft PR #302 opened by the custodian at 19:32:03Z. Read in its transcript: the errored results are the six guard runs (exit 101, as the form predicts) and one call whose closing grep matched nothing after the scripts suite had exited 0; no Guardian or harness refusal. Every claimed head run has a call behind it.*

---

Built: clippy-deny-warnings-workspace 12b at 10b695f92925b11ac5a4b911c9bdd9e9039c5c40

**Worktree.** `origin/main` was 75390735fc3afb82cbc750f6bdd498274bad03c5 and the form's sha256 at it was 2730bb6b…52b93, as the brief states. The worktree is C:/dev/wt/c12b on branch cut/clippy-deny-warnings-workspace-12b, B = 75390735.

**Base.**
- `git rev-parse HEAD` gave 75390735. `cargo clippy` is 0.1.97 (8bab26f4f6 2026-07-14) and `rustc` is 1.97.1 (8bab26f4f 2026-07-14).
- The JSON run exited 0 (9m56s, cold target). My counting script (c12b-count.mjs, Windows read's rule) gave 13 raw and 13 distinct rows. All 13 are in the seven Scope files, 0 outside, and they are N1's thirteen at N1's lines:
  - large_enum_variant admission_p4_corpus.rs:363:1
  - explicit_auto_deref admission_property_campaign.rs:218:5 and :543:31
  - format_in_format_args admission_property_campaign.rs:270:15
  - double_ended_iterator_last admission_property_campaign.rs:556:27
  - assertions_on_constants import_layout_5gb_digest.rs:395:5, import_layout_5gb_fixtures.rs:338:5, import_layout_digest.rs:461:5, import_layout_fixtures.rs:247:5, lod_tier_measurements.rs:253:5 and :486:5
  - needless_borrow import_layout_5gb_fixtures.rs:318:17 and :326:17

**Digest B.**
- The scratch fn's sha256 is 281cb9f7c431ed5dbbb6108b4e764d7a3f7fea7492e53fd0475ea67ccb3bbe58. Appended it was +50 lines in one file.
- The run exited 0. The output sha256 is 380ed68576fba852df7ab6a6cebaef69f339a1686cf96b694e513c5a43957af8, 2500 lines.
- After `git checkout --` the porcelain was empty.

**Fixes (rows 7 to 25 as in the Change line).**
- Row 7: `#[allow(clippy::large_enum_variant)]` on `enum Observed`.
- Rows 8 and 10: the `*` dropped.
- Row 9: inlined, with the format string `"({} {} {}) {} {} {} {}"` and the two arguments last in their own order.
- Row 11: first `.next_back()`.
- Rows 19 and 20: `log.as_str()`.
- Rows 18 and 21 to 25: `#[allow(clippy::assertions_on_constants)]` above each of the six fns, after any `#[ignore]`.
- `cargo fmt --all` exited 0 and `git diff --name-only` named only the seven files.
- **Pre-commit JSON run 1** (rc 0) listed 1 row: `filter_next` at admission_property_campaign.rs:557:27, "called `filter(..).next_back()` on an `DoubleEndedIterator`…". This is the declared OPEN-A fallback site. The line is :557 rather than :556 because row 9's net +1 line sits above it.
- **Fallback applied:** `.filter(|&b| b <= end)` and `.next_back()` became `.rfind(|&b| b <= end)`, then fmt. **Pre-commit JSON run 2** (rc 0) listed 0 rows.

**Commit.** Signed off with `git commit -s`. The message file's only `@` is in the Co-Authored-By trailer line; the Claude-Session line has none. Subject: `fix: clippy-deny-warnings-workspace 12b, the thirteen Windows clippy rows in seven engine test files removed, no behaviour, seeded draw or guard changed`.

**Head runs.**
- Clippy JSON: rc 0, 0 rows in the seven files, 0 outside, equal to the base's 0.
- `cargo clippy --locked -p spatial-engine --all-targets -- -D warnings`: **rc 0**, recorded from c12b-deny.txt.
- `cargo fmt --all -- --check`: rc 0.
- `cargo test --workspace --locked`: rc 0. 118 result lines summed to 1027 passed, 0 failed, 66 ignored.
- `cargo test --locked -p spatial-engine --no-run`: rc 0.
- **Guard runs**, six, each rc 101, each with 1 `panicked at` in its output file. Whole `panicked at` line, then the message line:
  - 18: `thread 'the_5gb_cross_file_digest_correctness_pass' (57772) panicked at engine\tests\import_layout_5gb_digest.rs:396:5:`
    `this phase's digests are compared for exact equality across files. Run with --release.`
  - 21: `thread 'generate_the_5gb_fixture_set' (41400) panicked at engine\tests\import_layout_5gb_fixtures.rs:339:5:`
    `this phase writes/verifies fixtures other phases score against; a debug build's numbers are not measurements. Run with --release.`
  - 22: `thread 'the_cross_file_digest_correctness_pass' (62576) panicked at engine\tests\import_layout_digest.rs:462:5:`
    `this phase's digests are compared for exact equality across files; nothing here is a timing, but every other pass in this family refuses a debug build on principle. Run with --release.`
  - 23: `thread 'generate_the_145mb_fixture_matrix' (59664) panicked at engine\tests\import_layout_fixtures.rs:248:5:`
    `this phase writes fixtures other phases hash and time; a debug build's numbers (even the elapsed-time-only ones reported here) are not measurements. Run with --release.`
  - 24: `thread 'wall_time_arm_s_and_arm_p_over_polygons_100k' (47988) panicked at engine\tests\lod_tier_measurements.rs:254:5:`
    `this test measures build wall time; a debug build's numbers are not measurements, and every other pass in this family refuses a debug build on principle. Run with --release.`
  - 25: `thread 'wall_time_arm_s_over_parcels_5gb' (44308) panicked at engine\tests\lod_tier_measurements.rs:488:5:`
    `this helper is called by both wall-time measurements and an O1-O4 outcomes pass at 5 GB scale; a debug build's wall time is not a measurement, and every other pass in this family refuses a debug build on principle. Run with --release.`
- **Digest H:** the same scratch bytes (sha256 281cb9f7… equal to step 2's), run rc 0. H sha256 is 380ed685…957af8 with 2500 lines, and `cmp` against B is identical.
- **M9:** the diff, with the scratch fn still appended, was:
  `-"({} {} {}) {} {} {} {}",` becomes `+"({} {} {}) {} {} {6} {5}",`
  and the last two arguments `r.pick(&["<", ">", "="]),` / `num_lit(r)` became `num_lit(r),` / `r.pick(&["<", ">", "="])`.
  - The run was rc 0. Its sha256 is 3abb6400d41fec7161fcae4d4846256ef479ccc2d4b2bbc7bf68710609b7b4c9 with 2500 lines. It differs from H on 2127 lines, so **M9 was caught**.
  - The first differing pair is line 23, H against M9: `G1 22 "…((i64 / 0.1) + 3 > 1940…` and `G1 22 "…((i64 / 0.1) + 3 < -630…`.
  - After `git checkout --` the porcelain was empty.

**Numstat, B...HEAD** (exactly the seven files):
- admission_p4_corpus.rs: 1/0
- admission_property_campaign.rs: 6/6
- import_layout_5gb_digest.rs: 1/0
- import_layout_5gb_fixtures.rs: 3/2
- import_layout_digest.rs: 1/0
- import_layout_fixtures.rs: 1/0
- lod_tier_measurements.rs: 2/0

The total is 23 against the declared 60. That is the form's own estimate under the fallback, so no overrun.

**Governance checks.**
- `node --test` on the three script suites: 598 tests, 598 pass, 0 fail.
- verify-cites, verify-quotes (in a hold), verify-test-claims, `verify.mjs --offline` and forms-layout: all rc 0 and PASS.

**Holds.** Every cargo call, the digest runs, the six guard runs and verify-quotes ran in a shared hold. All were granted, none refused, and each was released (MACHINE_HOLD with shells, `also=` elided).

**Push.** `git push -u origin cut/clippy-deny-warnings-workspace-12b` returned rc 0. `git ls-remote` shows origin's branch at 10b695f92925b11ac5a4b911c9bdd9e9039c5c40, equal to HEAD, and the porcelain is empty. I opened no PR and did not wait for CI.

**Off-scope seen, not done.**
- Row 11 needed the declared fallback: `filter_next` fires on `.filter(..).next_back()` in this clippy (0.1.97). This settles the form's "not settled" item.
- The brief says to check a row "at :556", but the row sat at :557 after row 9's line shift. I treated it as the same site.

**Background shells.** None still running; the one background `cargo` sweep with `tasklist | grep -c cargo` gave 0 after my last run.

**Model.** claude-sonnet-5-5 (Sonnet 5.5), no override, no context handoff received or produced.

**Pre-gate self-check.** The cross-module path count is zero; there are no new `pub` items, callbacks, tests or code paths. Every completion claim above points to an output file or run result in the scratch folder. No user-facing messages are added. The required tests reach their intended assertions: the guard runs panic at the guard's `assert!` on its own message, and the digest observations compare the 2500-line outputs.
