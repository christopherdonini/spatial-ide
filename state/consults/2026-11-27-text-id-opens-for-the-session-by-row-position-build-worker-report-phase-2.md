# Text-id's build (phase 2, the code): the worker's report

*Filed by the custodian from the worker's hand-back (saved by Write with the harness's indent removed; 11653 bytes, sha256 f358d3ad36d58434b11baffddd10a995a0db6ce0c44d20d539c2fad0bad87848). The worker's words, not the custodian's, except that the folder part of each of its 11 line cites is removed, so that main's cite check does not read them as cites into main: they are into the branch at 5e3cd027 or ebf961d3. The custodian re-ran §7's count (the form's Amendment 9).*

---

HEAD ebf961d31fe959fc4dc42cef6827f78152aca0db, pushed. Every step completed, with one class 8 overrun on lines (below) and the departures listed after it. `git rev-parse origin/cut/text-id-opens-for-the-session-by-row-position` returns the same hash. The tree is clean and the branch is not behind the remote.

COMMITS (base 83812fd5, all `git commit -s -F`, no typed sign-off, no email in any message)
- 8e4247d8 feat: skp/0.16, a file whose own id column cannot serve opens on the session tier when the caller chooses it
- f6cd7fb4 test: the set-aside open's engine tests (N-1 to N-9, N-S)
- a155b869 test: the set-aside open's kernel tests (K-1 to K-7) and the no-integer fixture generator
- b8c1d7dd feat: the shell offers the row-position choice for a refused id column, and carries it for one open only
- 42f862c2 test: the TEXTID' e2e step for the row-position choice, written and not run
- 5e3cd027 docs: ADR-016 Amendment 3, KNOWN-LIMITATIONS item 3 and the walkthrough's Part AH for the row-position choice
- ebf961d3 test: the scan-count test's declared input is a file whose own id the native path would scan

§7 COUNT at ebf961d3, using the brief's command
- 84 files, +2,313, -221, 2,534 lines.
- The file ceiling (84) is met exactly. The line ceiling (2,150) is overrun by 384. This is class 8, reported and not trimmed.
- Per file, added/deleted:
  - engine: dataset.rs 135/3, error.rs 14/2, identity.rs 34/2, predicate.rs 31/4, tests/identity.rs 1/1, text_id_set_aside_scan_counts.rs 94/0 (after the ebf961d3 edit, +5/-4 net), text_id_set_aside_session_tier.rs 260/0.
  - kernel src: lib.rs 23/0, project/mod.rs 16/2, skp.rs 31/2.
  - kernel tests: text_id_set_aside_not_saved_or_published.rs 367/0, skp_admission_remediation.rs 190/0, project_reopen.rs 19/14, manual_walkthrough_fixtures.rs 21/0. The other 22 kernel test files are 1 to 4 line `set_aside_file_id: false` literal bumps.
  - protocol: SKP-V0.md 34/10, commands.rs 23/0, v0/mod.rs 9/1, fixtures.rs 50/11, conformance README 8/0, three conformance fixture files 38+63+48 added, two new data files 56 and 8, plus 17 small data-file bumps.
  - shell: AdmissionPanel.test.ts 132/0, AdmissionPanel.tsx 74/12, RowPositionChoice.tsx 39/0, admitDataset.test.ts 25/6, describeSummaryText.test.ts 40/0, reopenNotices.test.ts 53/3, client.test.ts 32/6, client.ts 18/4, fixtures.test.ts 27/5, types.ts 10/1, e2e/admission-remediation.mjs 117/5, e2e/README.md 14/0, MANUAL-WALKTHROUGH.md 34/1, and smaller files.
  - docs: ADR-016 24/0, KNOWN-LIMITATIONS 3/3.

SUITES at the branch head (every one in a shared hold; nothing started an app, a dev server or an e2e suite)
- Shell: `npm ci` in `renderer/bundle-viewer` and in `frontends/shell` done earlier (`npmci-viewer-1.log`, `shell-ci-1.log`). `npm run typecheck` rc 0. `npm test` rc 0: 132 files and 1,695 tests passed, 0 failed (`shell-test-3.log`). These ran at 5e3cd027. The only commit since is a Rust test file.
- `cargo test --locked -p spatial-engine --no-fail-fast`: rc 0, 58 binaries, 518 passed, 0 failed, 20 ignored.
- `cargo test --locked -p spatial-kernel --test skp_admission_remediation`: rc 0, 12 passed.
- `cargo test --locked -p spatial-kernel --no-fail-fast`: rc 0, 65 binaries, 534 passed, 0 failed, 49 ignored.
- `cargo test --locked -p spatial-skp --no-fail-fast`: rc 0, 4 binaries, 64 passed.
- `cargo test --locked -p spatial-skp --test conformance -- --nocapture`: rc 0, 1 passed.
- `cargo fmt --all -- --check`: rc 0. The same check in `frontends/shell/src-tauri`: rc 0.
- `cargo clippy --workspace --locked --all-targets`: rc 0, 19 warnings, 0 errors. The warning at `skp.rs:277` is pre-existing code I did not touch. I did not check the other 18 against my lines.
- In `D:/wt/textid` (at 5e3cd027):
  - `verify-cites`: PASS.
  - `verify-quotes`: PASS (161 checked, 30 baselined).
  - `verify-test-claims`: PASS (971 claimed).
  - `verify` (verify:plan): PASS.
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 623 pass, 0 fail.
  - `verify-quotes --show-cites` on the five changed docs: rc 1 with 21 "quote not found" lines, all in pre-existing MANUAL-WALKTHROUGH lines (124 to 1446). None are in my changed lines (598, 2134 to 2166). I read this as a file-limited run not applying the baseline, since the full run passes with those entries baselined.
  - Not re-run after ebf961d3. That commit touched one Rust test file and nothing the cite scripts read.
- `health.mjs` was never run.

MUTATIONS
Each was applied by script to the committed tree, the named test run alone, and the failure recorded by name. The patch was then reverted with `git checkout --`, and the tree was clean after each one. None was committed and none was a compile-error red. Logs are `mut-*.log` and `mut-*.out` in `D:/wt/textid-logs/`.
- Observed at 5e3cd027:
  - M-1, the arm (d) `IdentityUnusable` return: `file_a_text_id_with_no_integer_column_opens_on_the_session_tier_when_set_aside`.
  - M-2, a declared first candidate in (c): `file_b_set_aside_opens_by_row_position_and_lists_parcel_key`.
  - M-3, a type-only check for (c): `the_set_aside_scan_counts_are_exact`.
  - M-3b, the `id` filter dropped: `a_repeating_integer_id_is_scanned_again_then_set_aside`.
  - M-4, `detail.contains("type is")`: `a_negative_integer_id_is_set_aside_after_its_scan`.
  - M-5, arm (b) removed: `the_set_aside_is_refused_by_name_for_a_file_with_no_id_column`.
  - M-6, `Ok(identity) => Ok(identity)`: `the_set_aside_is_refused_by_name_when_the_id_serves`.
  - M-8, the predicate alias arm filtered out: `a_predicate_naming_id_on_a_set_aside_open_is_refused_as_ambiguous`.
  - M-9, `Err(_)` in (d): `dataset::tests::a_set_aside_passes_cancelled_and_query_through_unchanged`.
- Observed at ebf961d3:
  - M-7, arm (a) moved after the native call: `the_set_aside_scan_counts_are_exact`, failing at `text_id_set_aside_scan_counts.rs:94`.
  - Kernel M-10: `an_open_setting_aside_a_text_id_describes_the_session_tier_with_set_aside_column_id`.
  - Kernel M-11: `the_set_aside_refusals_reach_the_wire_by_name`.
  - Kernel M-12: `a_filter_naming_id_on_a_set_aside_open_is_refused_as_ambiguous_through_skp`.
  - Kernel M-13: `a_project_file_after_a_set_aside_open_records_identity_null_and_no_choice`.
  - Kernel M-14: `a_session_history_after_a_set_aside_open_records_no_choice`.
  - Kernel M-15: `publish_refuses_a_set_aside_open_as_session_tier`.
  - Kernel M-16: `a_project_saved_after_a_set_aside_open_refuses_on_reopen_and_opens_only_when_asked_again`.
  - Wire M-17, `#[serde(default)]`: `an_open_dataset_request_without_set_aside_file_id_is_refused_and_the_set_aside_fixtures_round_trip`.
  - Shell M-18: `an_identity_refusal_naming_id_with_no_declaration_offers_row_position`.
  - Shell M-19: `choosing_row_position_sends_set_aside_true_and_no_identity`.
  - Shell M-20: `the_summary_says_the_user_chose_row_position`.
  - Shell M-21: `a_reopen_refused_for_its_own_id_offers_only_row_position`.
  - Shell M-22: `a_carried_choice_is_shown_in_the_crs_block`.
  - Shell M-23: `declaring_from_a_row_position_open_carries_no_set_aside`.
  - Shell M-23b: `a_declaration_after_a_refused_set_aside_carries_no_set_aside`.
  - Shell M-24: the T-1 test in `client.test.ts`, "openDataset sends set_aside_file_id false by default and true when asked".
  - Shell M-24b: the `admitDataset.test.ts` test "the setAsideFileId option is forwarded as set_aside_file_id, and its absence is false".
  - Shell M-26: `a_reopen_refused_after_the_choice_names_the_choice`.
  - Shell M-27: `a_retry_after_a_question_or_a_not_found_reply_does_not_carry_the_choice`.
- M-25 (E-1 step TEXTID') is not observed, because E-1 is written and not run, as the brief said.
- No separate skeleton commit exists, so red-at-skeleton was never observed. All reds are against mutated code at the committed head.

STOPS AND DEPARTURES
1. Class 8 on lines: 2,534 against 2,150, reported and not trimmed.
2. The ebf961d3 test fix. M-7 first came back NOT-RED at 5e3cd027. The scan-count test's declared-column input was a string id, which the native path refuses on type with no scan, so moving arm (a) after the native call left the delta at 0. I changed that input to a repeating integer id (`DuplicateIds`, declaration naming `id`) in its own commit, ran the test green, and re-observed M-7 as RED.
3. Harness faults, not product faults:
   - The M-1 patch first failed to compile (E0283, a type annotation in my patch). It was fixed to `let _: Vec<String> = candidates;`.
   - The shell group first crashed on a cp1252 decode in my Python harness. It was fixed with utf-8 and `errors='replace'`, and the tree was clean afterwards.
4. Machine script exit 97 (hold wait exceeded, another session holding the turn). I resubmitted the same hold each time and never ran a command another way. Calls exiting 97: the shell typecheck/test (retried as `-3`), engine mutations x4, scan test + M-7, mutation batch x1, suites batch x1. No command ran outside a hold except as noted in item 5.
5. Not in a hold: my earlier focused `vitest` and typecheck runs, and the node verify scripts (`verify-cites`, `verify-quotes`, `verify-test-claims`, `verify`), which are not cargo or heavy.
6. K-6 covers R1 only (`preflight_pinless`), with no boundary R2 run. M-13 and M-14 follow my own test doc comments and differ slightly from the form's wording.
7. `engine/ADMISSION-RESULTS.md` (generated evidence, outside Scope) still holds the old refusal text. I did not edit it.
8. The form file is not on this branch (it is on origin/main only). The walkthrough's Part AH cites its path.
9. KNOWN-LIMITATIONS item 3 line 68 cites `identity.rs:365-392` and `error.rs:376-380`. Recheck them if either Rust file changes again.
10. No Guardian refusal, no limit breach, and I made no read, write or search in `C:/dev/spatial-ide`. The disk floor was about 43,000 MB at the last check, above 40,960. I did not start any app or dev server and did not run E-1.

PRE-GATE SELF-CHECK
Checked for four classes:
1. Fabricated or misquoted citations. The S-4 and S-6a/b/c strings were compared against `strings.json`, and the ADR block against the draft's hash 3d1e6181d7f5918a581ec0ae92a529938aece3f53d312eec1a3ea92f184eb668. Both comparisons were done by script.
2. Cites shifted by my own edits. `verify-cites` and `verify-quotes` pass.
3. A mutation not observed. Every one is listed above, apart from M-25.
4. A compile-error red or a committed mutation. None; the tree is clean.

SEAM RULE
Product-caller grep, `git grep`, for each new `pub` item:
- `Dataset::open_cancellable_setting_aside_file_id` (`dataset.rs:336`) is called by `Catalog::open_cancellable_setting_aside_file_id` (`lib.rs:242`), which `SkpHost::open_under` calls (`skp.rs:1208`).
- `set_aside_column()` (`identity.rs:271`) is called in `predicate.rs:1161` and `skp.rs:2072`. The wire field is in `commands.rs:246`. The shell reads it in `describeSummaryText.ts:68`.
- `new_session_ordinal_set_aside` is `pub(crate)` and its caller is `dataset.rs:2207`.
- Shell items, each with a product caller:
  - `rowPositionOffer` and `rowPositionOptions`: `AdmissionPanel.tsx:604` and `:728`.
  - `reopenRetryOptions`: `AdmissionPanel.tsx:517`, `:660` and `:663`.
  - `refusedDeclarationOptions`: `AdmissionPanel.tsx:719`.
  - `carriedChoiceLine`: `AdmissionPanel.tsx:701`.
  - `setAsideChoiceLine`: `DescribeSummary.tsx:70`.
  - `SET_ASIDE_REFUSAL_NOTICE`: `openProject.ts:85`.

MODEL: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff to another model.
