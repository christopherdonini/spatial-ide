Reviewed: PR #318 at 5e6b79bc0d0f423293b312140788044fab1de106 (the custodian's filing note, 2026-11-14: the gate, the reviewer, attempt 1, its second and last part, the whole gate's verdict, under the advisor's ruling ADV-2026-11-14-16 item 3 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-16-second-open-reviewer-applies-m1-to-m6-through-bash-one-gate-one-verdict-d8-class-8-docs-idle-filler-port-2.md`); the first part is the stop report `state/consults/gates/2026-11-14-second-open-history-before-1c-step-3-gate-reviewer-attempt-1-stop.md`; one of the two gates from dispatch of the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2; continued in the same run by the custodian's session message at 14:00:33Z, received in its transcript at 14:00:36Z, naming its continuation brief by file (6120 bytes, sha256 63858cc8dfb538847485aa2d101e3475fdff6f8e46e48179ea22c0b3d6ba1105); this part 14:00:36Z to 14:43:01Z by its transcript, 80 calls (Read 5, Bash 74, SubagentHandback 1), one errored, the M2 run with no-fail-fast at 14:07:06Z, exit 101 as that mutation expects; no file written by Write or Edit; its context compacted once, at 14:34:17Z, before its check 11; model claude-opus-5-5. The custodian checked its claims against its calls and its files on disk: for each of M1 to M6 the apply, the exit-101 run, the no-fail-fast run and the exit-0 run have their calls, each cargo run in a shared hold, the test-result counts in the files are the report's, and the revert files are empty; the light runs and the verify-quotes hold have their calls. Below, the hand-back (with one final newline, 14632 bytes, sha256 ef1de5c94935d64b76b784a810ba4d6518469ac48ad3e0bc4f1e1e3d82eb7380) with one change, the custodian's: the scratch folder's full path, which its Files section wrote after <S>, is cut, as a user-profile path is never quoted. Gate-log row 748 is the one row for attempt 1 and names both parts.)

Reviewed: PR #318 at 5e6b79bc0d0f423293b312140788044fab1de106, gate reviewer (cut/second-open-history-before-1c-step-3 @ 5e6b79bc0d0f423293b312140788044fab1de106)
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. Every mutation, M1 to M6, was applied, killed and reverted cleanly. The light runs and CI are green at H. Documentation findings D1 to D8 are must-fix before the merge. This report gives the verdict for the whole of attempt 1. Part 1 is the stop report, and its runs stand under ADV-2026-11-14-16 item 3 (c).

## Findings

### Correctness
None. The clause-by-clause check of §2.1 to §2.4 and C-1 to C-5 at H is in part 1 (check 3) and is not reopened.

### Evidence
- Part 1's E1 is closed: this gate applied and observed M1 to M6 itself (§9). Each was killed; details below.
- There is no coverage finding under §4, because no mutation survived.

### Documentation (each must be fixed before the merge; not a fail, no correction round)
D1 to D7 stand as part 1 gave them, with the same replacement words and the same clause checks. For D2 to D7 the routing is by ADV-2026-11-14-16 item 7: the words go to the advisor in one packet once both gates have closed, beside the architect's versions.
- **D1.** Item 43's DRAFT comment says "Only the clause about the ceiling is changed". Two sentences were also added. These are worker words. Replacement words are in part 1.
- **D2.** Item 43's "and one file for each project from then on" is not true for an open saved before any change. This is the worker's DRAFT rewording of the human's approved item. Replacement words are in part 1. The case to record in the source comment is the move-failure error path.
- **D3.** Item 63 states the `saved-here` mark unconditionally, but S5 is still shown in the NoStep and Differs cases (session_history.rs:382-389 at H). These are worker words. Replacement words are in part 1.
- **D4.** SKP-V0.md §11.3's "marked in its own record" has the same gap as D3. Replacement words are in part 1.
- **D5.** The `Projects::save` doc's "with its own record until its own first save". Replacement words are in part 1.
- **D6.** The `Reached` rustdoc's "for one opened file". Replacement words are in part 1.
- **D7.** The P6 sight line, which is the custodian's line in lead-data's words. Replacement words are in part 1. It goes to the advisor after both gates (item 7).
- **D8 (changed).** The advisor ruled "yes" in ADV-2026-11-14-16 item 6, so this is now a record finding, fixed in the closing amendment and not a question. The amendment that closes the piece carries:
  - a first line with the words `budget overrun, §7 not edited`;
  - the declared figure, "about 530 changed lines over 7 code and test files";
  - the final figure at the last head, by §21c's counting rule;
  - the reason;
  - a statement that Amendments 1 and 2 recorded the size as class 1 under ADV-2026-11-14-04, and that ADV-2026-11-14-16 names the class.
  
  §7 and Amendments 1 and 2 stay unedited.

### Observations
- Carried from part 1, unchanged:
  - the worker report's "only changed clause" claim, which is evidence and not edited;
  - item 63's "the project that save makes" on the move-failure error path;
  - the opens-count pin span (:179 lies outside the pinned :300-316).
- **New: my own departure at M2's `--no-fail-fast` run.** That one hold departed from the machine paragraph in two ways:
  - it ran in the foreground with `-MaxWaitMinutes 2`, not in background mode with 60;
  - a `sed` came before the `cd` in the same call.
  
  The hold was granted and released (no WAITING or ERROR line), the run completed (17/6 ok, skp 4 passed and 2 failed, session_history 13 ok), and it was not repeated. This touches nothing in the piece. It is listed for round 77.
- verify-quotes printed two advisory hash-reference lines for governance/forms/engine/LOD-PREREGISTRATION.md:541 and :545. That file is not in this diff, and the tool PASSes.

## Check 6: M1 to M6 (each alone, in order, each heavy run in its own shared hold, with `CARGO_TARGET_DIR=D:/wt-targets/so CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`)
- **The script.** `<S>/soc2-mut.mjs` is 2121 bytes, sha256 ddc7fede01220775b89870bf255b6acc329ed23cc11edc6c8ba2d26aca37c7fa, as stated. I read it whole.
- **The command** was `node <S>/soc2-mut.mjs C:/dev/wt/so <id> apply`. For every id it printed `<id> apply: anchor occurs 1 time(s) in <file>` and then `<id>: apply done in <file>`.
- **The revert** for every id was `git -C C:/dev/wt/so checkout -- <file>`. After each revert, `git diff` was 0 bytes and the porcelain was 0 lines (`<S>/g318r-M<n>-revdiff.txt` and `<S>/g318r-M<n>-rev.txt`, both 0 bytes), then the table's command was run again.

**M1** (`kernel/src/session_history.rs`)
- Diff, one hunk at :309:
  `-        let same = |r: &Record| r.holder == holder;`
  `+        let same = |r: &Record| r.holder == holder || (matches!(r.holder, Holder::Open(_)) && matches!(holder, Holder::Open(_)));`
- My reading: this is §4's M1 old→new text exactly.
- Table command: exit 101. The failure, byte-copied: `panicked at kernel\tests\session_history.rs:367:5:` / `assertion `left == right` failed: the unbound reopen starts its own record` (left 1, right 2).
- `--no-fail-fast`: project_save 17 ok and project_save_skp 6 ok. In session_history, 12 passed and 1 failed, the failure being `an_unbound_reopen_of_the_same_file_starts_its_own_record_and_another_file_its_own`.
- Revert run: exit 0, 1 passed.

**M2** (`kernel/src/session_history.rs`)
- Diff, at :309:
  `+        let same = |r: &Record| r.holder == holder || matches!(r.holder, Holder::Project(_));`
- My reading: this is §4's M2 text exactly.
- Table command: exit 101. The failure, byte-copied: `panicked at kernel\tests\project_save_skp.rs:449:5:` / `assertion `left == right` failed: A's record, after the second open's step` (left 2657, right 1861).
- `--no-fail-fast`: project_save 17 ok and session_history 13 ok. In project_save_skp, 4 passed and 2 failed:
  - `a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged` (:449);
  - `a_save_made_before_any_step_binds_the_open_and_a_later_open_saved_elsewhere_keeps_its_own_record` (:534, "the second open has its own").
- Revert run: exit 0, 1 passed.

**M3** (`kernel/src/session_history.rs`)
- Diff, at :359-363: `state.open(open).bound = Some(project.clone());` is moved from after the `if let` block to inside it, after `let _ = std::fs::remove_dir(&moved);`.
- My reading: this matches the table's words, "the bind moved inside the move branch". It is the worker's edit, and nothing else changed.
- Table command: exit 101. The failure, byte-copied: `panicked at kernel\tests\project_save.rs:590:5:` / `assertion `left == right` failed: only the project's record, and no unsaved- one` (left `["unsaved-d0f591961657387cda6f2d44969f94cd"]`, right `["6a10660eed66f82e94ffbcd55ff8fb56"]`).
- `--no-fail-fast`: project_save_skp 6 ok and session_history 13 ok. In project_save, 15 passed and 2 failed:
  - `a_step_after_a_save_made_before_any_step_goes_to_the_projects_record_under_the_projects_dataset_identity` (:590);
  - `the_project_files_dataset_uri_is_the_histories_dataset_uri_whichever_comes_first` (:465, "history.jsonl could not be read").
- Revert run: exit 0, 1 passed.

**M4** (`kernel/src/session_history.rs`)
- Diff: in `Open::holder()` (:141-147), the `match &self.bound { Some(project) => Holder::Project(project.clone()), None => Holder::Open(self.name.clone()), }` is replaced by `Holder::Open(self.name.clone())`.
- My reading: this matches the table's words, "the holder is always `Open(name)`".
- Table command: exit 101. The failure, byte-copied: `panicked at kernel\tests\project_save_skp.rs:514:5:` / `assertion `left == right` failed: the step went to A's record, so the later save marks it` (left Withheld, right Written).
- `--no-fail-fast`: session_history 13 ok.
  - In project_save, 13 passed and 4 failed:
    - `a_step_after_a_save_made_before_any_step_goes_to_the_projects_record_under_the_projects_dataset_identity` (:590);
    - `a_save_after_a_recorded_match_marks_only_a_workspace_holding_that_match` (:797);
    - `the_first_save_moves_the_record_under_the_project_identity` (:549);
    - `the_project_files_dataset_uri_is_the_histories_dataset_uri_whichever_comes_first` (:671).
  - In project_save_skp, 5 passed and 1 failed: `a_save_made_before_any_step_binds_the_open_and_a_later_open_saved_elsewhere_keeps_its_own_record` (:514).
- Revert run: exit 0, 1 passed.

**M5** (`kernel/src/project/mod.rs`)
- Diff, at :252:
  `-                    self.recorder.dataset_uri(name),`
  `+                    DatasetUri::mint(),`
- My reading: this is §4's M5 text exactly.
- Table command: exit 101. The failure, byte-copied: `panicked at kernel\tests\project_save.rs:672:9:` / `assertion `left == right` failed: the header's URI: n3-step-first` (the two `spatial://dataset/ref/…` URIs differ).
- `--no-fail-fast`: project_save_skp 6 ok and session_history 13 ok. In project_save, 15 passed and 2 failed:
  - `a_step_after_a_save_made_before_any_step_goes_to_the_projects_record_under_the_projects_dataset_identity` (:620);
  - `the_project_files_dataset_uri_is_the_histories_dataset_uri_whichever_comes_first` (:672).
- Revert run: exit 0, 1 passed.

**M6** (`kernel/src/session_history.rs`)
- Diff, at :442:
  `-        let header = canonical(&header_object(reference.to_json(), project))?;`
  `+        let header = canonical(&header_object(reference.to_json(), None))?;`
  The folder `match project` below it is unchanged.
- My reading: this matches the table's words, "the header always `not-yet-saved`, the folder unchanged".
- Table command: exit 101. The failure, byte-copied: `panicked at kernel\tests\project_save.rs:618:5:` / `assertion `left == right` failed` (left `Object {"basis": String("this session has not saved a project"), "state": String("not-yet-saved")}`, right `"spatial://project/8c9e66cb95965ac31d3a2f361fc168bf"`).
- `--no-fail-fast`: session_history 13 ok.
  - In project_save, 16 passed and 1 failed: `a_step_after_a_save_made_before_any_step_goes_to_the_projects_record_under_the_projects_dataset_identity` (:618).
  - In project_save_skp, 5 passed and 1 failed: `a_save_made_before_any_step_binds_the_open_and_a_later_open_saved_elsewhere_keeps_its_own_record` (:552).
- Revert run: exit 0, 1 passed.

## Check 7: light runs (from C:/dev/wt/so)
- `cargo fmt --all -- --check`: rc 0, empty output.
- `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check`: rc 0, empty output.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0. Tests 598, pass 598, fail 0, cancelled 0, skipped 0, todo 0.
- `node scripts/plan/verify-cites.mjs`: rc 0. "every rooted (in-tree) path:line reference across 2987 file(s) resolves. (194 loose reference(s) advised above.)"
- `node scripts/plan/verify-test-claims.mjs`: rc 0. "PASS — all 803 claimed test(s) across 263 file(s) exist or are planned, superseded or withdrawn (25 planned, 16 superseded, 17 withdrawn, advisory)". Both §9 superseded rows were accepted: the 1b form :533 and the 1c form :1668, each pinned @ 8c693657.
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS".
- `node scripts/plan/verify-quotes.mjs`, in a shared hold: rc 0. "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 927 ruling cites resolved, 0 ruling-cite errors."

## Check 10: CI
- `gh pr checks 318`, read at 2026-11-14T14:23:52Z: 18 rows, all pass.
- `gh run view`: the head sha is 5e6b79bc0d0f423293b312140788044fab1de106 for all 12 runs:

| Workflow | push run | pull_request run |
|---|---|---|
| Product CI — Rust workspace | 43565080341 | 43577371015 |
| Rust fmt | 43565080396 | 43577371019 |
| Governance CI | 43565080315 | 43577371016 |
| Ported notices | 43565080302 | 43577370859 |
| Product CI — shell | 43565080466 | 43577370876 |
| DCO sign-off | — | 43577370870 |
| Exposure scan | — | 43577370854 |

## Check 11: end (2026-11-14T14:34:38Z)
- HEAD is 5e6b79bc0d0f423293b312140788044fab1de106; `ls-remote` gives the same head for `refs/heads/cut/second-open-history-before-1c-step-3`.
- The porcelain is 0 lines and `git diff` is 0 bytes.
- `df -h`: C: 50G free (90% used), D: 352G free (25% used).

## Start (part 2)
- HEAD was 5e6b79bc…, the porcelain was empty, and `ls-remote` gave the same head.
- The continuation brief is 6120 bytes, sha256 63858cc8…, as stated.
- The ruling copy is 6642 bytes, sha256 677a574d…, as stated.

## Earlier checks reopened
None. Part 1's checks 1 to 5 and 8, its heavy runs (36 / 1077 passed, 0 failed, 66 ignored / 78), the two superseded rows and the 18 pins stand as filed. No heavy run was repeated.

## Status readings (part 2)
No reading showed a `project=SpatialIDE` line, and all showed quiet=False.

| Status | average | peaks-over-25 |
|---|---|---|
| 5 | 34.2% | 51 |
| 6 | 53.2% | 60 |
| 7 | 39.0% | 60 |
| 8 | 46.8% | 60 |
| 9 | 31.0% | 60 |
| 10 | 30.3% | 60 |
| 11 | 21.0% | 2 |

Part 1's readings are as filed there.

## Hold lines (masked)
- Every hold has the form `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> …` and `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`.
- The verify-quotes hold was shell bash.exe:67608, exit 0.
- No MACHINE_WAITING or MACHINE_ERROR line appeared, and no hold was refused.

## Background shells
- Started in part 2:
  - the mutation and verify-quotes holds;
  - my bounded wait loops;
  - two shells at the end: a grep that collected hold lines over the harness task folder, and its wait loop. The harness moved both to the background, and they produced nothing usable.
- All have completed. None is left running, and none was killed.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.

## Files
- Part 2 scratch files, all in `<S>`:
  - for each n from 1 to 6: g318r-M&lt;n&gt;-apply.txt, -diff.txt, -a.txt (the 101 run), -b.txt (`--no-fail-fast`), -rev.txt, -revdiff.txt and -c.txt (the 0 run);
  - g318r-fmt1.txt, g318r-fmt2.txt, g318r-nodetest.txt, g318r-vcites.txt, g318r-vtc.txt, g318r-verify.txt and g318r-vquotes.txt;
  - g318r-status-5.txt to g318r-status-11.txt.
- The part 1 report text, extracted from the transcript, is in `<S>`/g318r-part1-report.txt.
