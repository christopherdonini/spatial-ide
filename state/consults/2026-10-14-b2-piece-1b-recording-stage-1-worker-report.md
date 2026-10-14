STAGE 1 REPORT, node:b2-piece-1b-recording@g3. Worktree C:/dev/wt/1b, branch cut/b2-piece-1b-recording, base B = 31e25f15a8639fe69f843b1802034ea27d76b0fa. Head aa1d0d06893384f76c7d4ad66fa92429b4d2e703 equals origin/cut/b2-piece-1b-recording. `git status --porcelain` is empty. Every commit was published as an ordinary non-forced update in its own Bash call.

1. COMMITS (oldest first; all `-s`, with the Co-Authored-By and Claude-Session trailers)
- b1883ce1 docs: the docs/07 note for B2 piece 1b, in the human's words
- 696b0a6b docs: ADR-036 amended as ruled and ADR-022 Amendment 1, for B2 piece 1b
- 10168433 feat: B2 piece 1b, wire (commit 3): skp/0.12, record_step, its fixtures and the literal
- d95f964a feat: B2 piece 1b, engine (before commit 4): AdmittedPredicate::referenced_columns
- aa1d0d06 feat: B2 piece 1b, the kernel (commit 4): StepRecorder, the session history and recover

2. EQUALITY CHECKS FOR THE HUMAN'S WORDS
- docs/07 Notebooks line: one line, `- Notebooks: record and replay (03) — <the human's note>`. The note's sha256 equals the form's pin (ba376ea97ae09913d6f5cbc4bd9f51dc86e852698b39cca111ab2da6a695c6c6), compared by script against the form's fence.
- ADR-036 blocks 0, A to G, the dependencies cell, H, I, J and K were applied by script from the form's fences. The diff is 38 insertions and 9 deletions, and Status is unchanged (Proposed).
- ADR-022 Amendment 1: 7 insertions, sha256 a154b693656f36db04996eda5627c9af5da3b132114847aefd569c678f9b0cb5, equal to the form's fence.
- `node scripts/adrIndex.mjs` (run from frontends/shell) rewrote 34 rows and left docs/README.md byte-unchanged.
- Block R of kernel/src/lib.rs, the lead sentence and the kernel/README.md text are the architect's words; the fence comparison passed.

3. INTERFACES RE-DERIVED AT B
49 pins were hashed at their own pinned commits and all matched. Seven differ at B, and none is in a command shape, so no I2:
- viewTransitions.ts:19-30: the union grew to 9 transitions. The `filter.apply` and `style.set` shapes are unchanged.
- viewTransitions.ts:56-76, App.tsx:918-922, App.tsx:345-349 and App.tsx:1694-1700: the blocks are unchanged and have moved.
- kernel/README.md:270-284 and kernel/src/lib.rs:17-29: the Streaming-a-query bullet was reworded. The lead that block R replaces is unaffected.
All SKP, protocol, engine, kernel and audit-log pins are identical at B. SKP_VERSION at B was `skp/0.11`.

4. RUNS AT HEAD aa1d0d06
All runs are un-piped, and each held `shared -Project SpatialIDE` and was released.
- `cargo fmt --all -- --check`: rc 0.
- `cargo test -p spatial-skp --locked`: rc 0. 30 unit, 1 conformance and 25 fixtures tests passed, 0 failed.
- `cargo test -p spatial-kernel --locked`: rc 0. 45 test binaries, 375 passed, 0 failed, 40 ignored.
  - In that run: the lib has 162 passed, `session_history` 10, `session_history_crash` 1, `record_step_crs` 3 and `no_generation_in_persisted_artifacts` 8.
- `cargo test -p spatial-engine --features fixture --locked`: rc 0. 47 binaries, 444 passed, 0 failed, 17 ignored.
- `cargo clippy -p spatial-skp -p spatial-kernel -p spatial-engine --all-targets --locked --features spatial-engine/fixture`: rc 0.
  - Warnings shown were all in code I did not touch. None is in session_history.rs, record_step_crs.rs, the new tests, commands.rs or the engine test.
  - The one in kernel/src/skp.rs:277 is existing code.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS (1907 files).
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS (121 checked, 90 verified).
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS (563 tests claimed).
- cfg-boundary: 0 outside every boundary, observed earlier.
- Not run: the shell's TypeScript tests, because there is no node_modules in the worktree. I edited three shell literal files for the version bump (see deviation 6).

5. MUTATIONS
Each was applied alone to a clean tree, the test was run by exact name, and the tree was reverted and shown clean. Mutations P1-P4, P3b, P4b and V were observed at 10168433. The kernel ones and E1 were observed at aa1d0d06 (E1 at the tree of aa1d0d06, with the engine file from d95f964a unchanged).
- P1-P3 (inline protocol tests), P3b (`key_present` removed from `FilterApplyParams`), P4 and P4b (a fixture message edit) each failed by name. V is the version literal, caught by `skp_version_is_skp_0_12`.
- U1 (return after the LF check): `recovery_keeps_the_longest_valid_prefix_and_names_the_first_failing_line` failed (left None, right Some((2,1))).
- U2 (drop `chain.parent=Some(to)`): `the_chain_follows_restored_marks` failed (rule `$.step.parent`, line 6).
- U3 (`unwrap_or(raw)` for a missing LF): `every_truncation_of_a_valid_history_recovers_a_prefix_and_never_a_line_past_the_cut` failed ("cut at 733").
- U4 (`v.to_string()`): `an_unregistered_action_under_a_newer_actions_value_is_kept_byte_for_byte_and_refused_otherwise` failed (byte comparison).
- U5 (history-ceiling branch removed): `a_step_over_a_line_or_history_ceiling_is_refused_and_nothing_is_written` failed (`unwrap_err` on Ok).
- U6 (stop flag removed): `after_a_failed_write_the_history_takes_no_later_step` failed.
- U7 (`MAX_STEP_LINE_BYTES` = 100_000): `the_worst_case_header_and_step_lines_fit_their_ceilings` failed ("a step line of 168567 bytes").
- U8 (provenance word check changed to TEXT): `recover_refuses_a_crs_provenance_outside_the_three_classes` failed ((0,false) vs (2,true) at "file").
- U9 (definition changed to TEXT): `recover_refuses_a_definition_that_is_neither_a_sha256_nor_none_admitted` failed (same shape, at "abc").
- K1 (`data` removed): failed with `MissingMember $.step.data`.
- K2 (premature record folder created): failed with "nothing was recorded". This is a proxy mutation; see deviation 13.
- K3 (`require_live` removed): failed (`unwrap_err` on Ok).
- K4 (parent always None): failed at `$.step.parent`, line 3.
- K5 (record keyed by handle): failed with "the reopen continues the record" (left 2, right 1).
- K6 (delete the whole root at end): failed because the earlier run's record was gone.
- K7 (no lock): failed because the `WouldBlock` match did not hold.
- K8 (BufWriter with `get_ref().sync_all()`): `session_history_crash` failed with "the file holds no header line".
- K9 (`.flush()` instead of `.sync_all()`): failed (`["no sync_all"]` vs `[]`).
- K10 (hash `crs.identifier()`): `two_definitions_under_one_identifier_record_one_label_and_two_definition_hashes` failed (hash mismatch).
- K11 (hash an empty text): `a_format_default_admission_records_the_none_admitted_state` failed (left Null, right "none-admitted").
- K12 (`crs.source().as_str()`): `each_admission_class_records_the_provenance_describe_reports` failed (the reader refuses "`file` is not one of ...").
- S1 (`style::parse` removed): `a_style_value_the_style_model_refuses_is_refused_by_name_and_records_nothing` failed.
- S2 (lowercase rule removed): `a_colour_not_in_lowercase_is_refused_by_name_and_records_nothing` failed.
- G2 (as specified in the form: a project-relative locator carrying the path): `a_session_history_carries_no_generation_session_reference_handle_path_or_user_name` failed through `recover` refusing the header at line 1, `$.resource.locators[0].at`. The reader catches it before the path scan does.
- G2b (the path in the header's free-text project basis, so the path scan itself is exercised): the same test failed with "the history names the fixture's path" (no_generation_in_persisted_artifacts.rs:882). Reverted, porcelain clean.
- E1 (engine, `columns: Vec::new()`): `an_admitted_predicate_reports_each_referenced_column_once_in_order_of_first_appearance` failed (left [], right ["zone","area","i64"]). Reverted, porcelain clean.
`verify-mutation` was not used as an observation.

6. SECTION 7 COUNT (insertions + deletions, `w1b-count.mjs` over B...HEAD, excluding the form, PLAN, queue, site, docs/README and lockfiles)
| Group | Count | Ceiling |
| --- | --- | --- |
| docs/07 | 2 | 12 |
| ADRs | 54 | 130 |
| protocol product | 283 | 340 |
| wire fixtures and protocol tests | 259 | 260 |
| version literal | 118 | 160 |
| kernel product | 1445 | 950 |
| kernel tests (3 files) | 764 | 700 |
| record_step_crs.rs (Amendment 2 file) | 156 | 220 |
| kernel/README.md | 16 | 110 |
| engine | 59 | 160 |
| total, 47 files | 3156 | 3950 |
- Kernel product: session_history.rs is 1326 lines, and its inline `#[cfg(test)]` module starts at line 929. The product part is about 928 lines; the rest are the inline tests U1-U9. Even so, the sum of the five kernel/src files is 1445 against 950.
- Kernel tests exceed 700 by 64.
- record_step_crs.rs plus the U8/U9 line span (kernel/src/session_history.rs lines 1260-1325, 66 lines) is 222 against 220, so 2 over.
- All three overruns are class 8. The section 7 line was never edited.

7. LOCK DIFFS
`git diff 31e25f15a8639fe69f843b1802034ea27d76b0fa...HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock frontends/shell/package-lock.json` is empty (0 bytes). protocol/data-plane has an empty diff. There are no dependency changes.

8. DEVIATIONS, with amendment class
1. A fifth new error code, `skp.style_value_not_admitted`. The form names four codes but also asks for style refusals "by name". It has a constructor and a fixture. Class 9 candidate; the custodian should rule on it.
2. 8 new wire data files against the form's "<= 6". Class 8.
3. protocol/skp/tests/conformance/main.rs was edited (2 arms) although §2.13 does not name it. Class 8.
4. The history file is opened read+write rather than append. Windows refuses `File::try_lock` on an append-only handle (probed: "Access is denied"). Nothing else writes the file while it is locked, so every `write_all` still lands at the end. Class 9 candidate. Consequence: a live history cannot be read by another handle on Windows, so tests drop the recorder before `recover`.
5. `filter` is required as a present key on deserialization of `filter.apply` params. This is stricter than the existing tolerated-absent Option mechanism and is covered by P3/P3b. Class 9 candidate.
6. The shell literal files (`types.ts`, `client.test.ts`, `admitDataset.test.ts`) were bumped to `skp/0.12` in commit 3, as precedent 26d4ccc0 did. Class 8. Not run here (no node_modules).
7. The engine change is in its own commit d95f964a, which the brief allowed.
8. Two extra kernel style tests (S1 and S2), from Amendment 1 item 4 (d).
9. The `At` check in the reader is shape-only.
10. Duplicate-key detection is a hand-written scanner, because no direct `serde` dependency is allowed. Class 8.
11. The docs/07 note is one line after the em-dash.
12. P4 also asserts that the error constructors equal their fixtures.
13. K2's mutation is a proxy (premature record folder creation).
14. Commit 4 carries a wording correction to commit 3's text: "No space or coordinate crosses it either, and `dataset` is the only handle" in SKP-V0 §10.2 and the commands.rs doc. Commit 3 had said there was no handle.
15. The overruns in section 6. Class 8.
16. Conformance rows' existing `spec` citations were left as written, and the conformance README now says so. The `refusals-any-layer` future-version row was renumbered to `skp/0.13`.

9. WHAT STAGE 2 MUST BUILD AND RUN (form §2.4, §2.5, §4, §9)
- Commit 5: the binding in frontends/shell/src-tauri/src/{commands,lib}.rs.
  - A `record_step` command on `spawn_blocking`, calling the kernel's `StepRecorder::record_step`.
  - `StepRecorder::new(default_root(), host)` at setup, registered in `generate_handler!`.
  - `end_session()` on the normal exit event. Read the exit hook first (H5). At most about 70 lines.
- Commit 6: the shell.
  - `skp/types.ts` and `skp/client.ts` `recordStep`.
  - `workspace/stepRecorder.ts`: FIFO, one call in flight, `MAX_PENDING_STEP_RECORDS=64`.
  - `App.tsx`: enqueue `filter.apply` in `commitActiveFilter` after an issued outcome, and a style-commit handler using `styleTransitions`.
  - `StylePanel.tsx`: `onCommit` fired from range and colour `change` events and from Reset.
  - `surfaceRegistry.ts`: five style rows to class A, and the doc counts six commands.
  - Notices O1-O3, and tests C1, R1, R2, A1-A3 plus the console completeness test.
  - Only the two transitions (`filter.apply`, `style.set`) of the 9-member union may be recorded.
- Commit 7: `e2e/recording.mjs` (E1 RECORD with a kill, E2 CLOSE), its `package.json` entry, a MANUAL-WALKTHROUGH Part (X0-X4), a KNOWN-LIMITATIONS item (the §2.10 L text) and index lines. PLAN.yaml is the custodian's.
- The shell tests need `npm ci` (or equivalent) before they can run, and that also runs the version-literal tests.
- H6: `serde_json` is used with its default float parse (no `float_roundtrip`), which may drift by one ULP. This matters for E1's byte-for-byte comparison.

10. NOTICED AND NOT DONE
- H6 as above.
- A failed `create` can leave an orphan record folder. `end_session` removes only this run's records.
- `default_root()` has no product caller until stage 2.
- `Failure.rule` messages are `Debug` text.
- Linux behaviour of K8 and of the lock being freed at process death is untested (Windows only).
- `Last verified at` in kernel/README.md was not refreshed.
- Cold DuckDB build took about 16 minutes on first build. Whole-package kernel and engine runs exceed 10 minutes, so use background runs.
- The brief's tooling rules held: no force flags, no rebase or merge, no PR actions, no lockfile, PLAN, queue or site edits, and nothing written outside the worktree, D:/wt-targets/1b and the scratch folder.

My model as the harness reports it: Sonnet 5.5, `claude-sonnet-5-5`.
