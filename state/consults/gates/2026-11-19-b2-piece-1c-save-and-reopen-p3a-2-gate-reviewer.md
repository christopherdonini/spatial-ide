Reviewed: PR #337 at c351ddb8055c89fde6b6bb8e319c6347a581077d (the custodian's filing note, 2026-11-19: the reviewer, one of PR 337's two gates under the full form (Amendment 36 item 13), attempt 1, whole, after the O1 fix (ADV-2026-11-19-15 item 7); Bash 68, Read 28, Grep 1, SubagentHandback 1, none errored, model claude-opus-5-5, from 2026-11-19T10:26:43Z to 10:59:27Z by its transcript, its four holds as the machine log gives them; the report below byte for byte from its hand-back of 18400 bytes, sha256 4510c4fe7344ff6bf975710150780174c13a727a335e150f69665f5f45b676b0, with three masks: this project's name written <m> in its hold heading and in its two hold lines; with this note in its first line and one final newline), gate, reviewer
cut/b2-piece-1c-p3a-2 @ c351ddb8055c89fde6b6bb8e319c6347a581077d
Reviewed: PR #337 at c351ddb8055c89fde6b6bb8e319c6347a581077d, gate, reviewer
Verdict: PASS WITH NOTES

Nothing blocks. There are no Correctness or Evidence findings. Before the merge, D1 to D11 below must be fixed, in the same PR and with no re-gate. All of them are comment lines or closing-amendment text, and none is the human's wording. Four items go to the advisor: A1 to A4.

## Correctness
None.
- The O1 fix (c351ddb8) only moves lines. The moved block `kernel/src/project/mod.rs:681-685 at H` is byte-identical to its old place (cmp rc 0). It takes the same inputs and produces the same values (`file.dataset` and `relink` are never changed, and `refused` is bound at :670).
- With the Amendment 41 item 4 mutation applied, mod.rs equals b5c35156 except for the two doc steps (diff below).
- The rest of the change matches the form's item 7(a)/8 list of public items. No pub item has a product caller, because they are pre-committed to P3b, which PLAN.yaml names on main.

## Evidence
None. Every run I made is at H and passes. Every mutation I made was seen to fail, except the K-O19 row of the item 7(b) table, which also survives in the worker's table. That row's outcome is recorded by Amendment 39, and Amendment 40 item 3 replaces it as K-O19's own mutation.

## Documentation (must fix before the merge; none is the human's wording; the worker applies the words with no re-gate, and the PR body lists them)

**D1–D7: the architect's Drafts 1–7 (its report at b5c35156), adopted word for word.**
- I re-read every Old block at H. Each occurs exactly once:
  - Draft 1: mod.rs:131-132
  - Draft 2: mod.rs:232-234
  - Draft 3: mod.rs:244-247
  - Draft 4: mod.rs:116
  - Draft 5: session_history.rs:123-124
  - Draft 6: session_history.rs:138
  - Draft 7: session_history.rs:152-154
- I clause-checked the New text at H. c351ddb8 moved some mod.rs lines, so the architect's mod.rs cites shift:
  - Draft 1: the reopen's lock is at `mod.rs:687 at H` and its push at :773-778. The first save's lock is at :335-336 and its push at :349-355. No site removes an entry.
  - Draft 2: the lookup is at :256, over the pushes at :349 and :773. `folder` is set at :352 and :775.
  - Draft 3: the reopen bind is at `session_history.rs:393-395 at H`, proven by K-O22. Its row's mutation fails at `kernel/tests/project_reopen.rs:1774 at H`.
  - Drafts 5–7: `bound` is written only at session_history.rs:378 and :394. The holder's record is found at :310-312. An unbound record is named `unsaved-` at :477.
- All seven clauses hold at H.

**D8: the comment above K-O19 (supersedes architect Draft 8).**
- Place: `kernel/tests/project_reopen.rs:1660-1669 at H`. Comment lines only.
- It carries the bare `:1673`. At H the assertion is at :1679, and Amendment 40 item 4 asks for no line number.
- Replace lines 1660-1669 with:
```
/// **K-O19** (R3 (b), under P-2 (i)). After that save, the first step is recorded under a record
/// of the open's own, and the leftover is unchanged.
///
/// RECORDED MUTATION (Amendment 40 item 3; K-O19's own): in `adopt_project`'s arm for a record
/// folder another run left, the open is bound to the project before the refusal is returned.
/// Seen failing at the step, after the save's `assert!` held: `Run::opacity_step`'s
/// `expect("recorded")`, since `create` refuses the record folder the other run left.
/// K-O18's mutation (Amendment 39, declared after the result was seen): item 5 (g)'s arm never
/// taken, so `adopt_project` binds the open with no move over another run's folder. Seen failing
/// at the `assert!` right after the save, before the step:
/// `withheld_unwritable(&saved.expect("saved").history_mark)`.
/// The declared mutation, `create`'s `create_dir` replaced by `create_dir_all`, did not fail this
/// test: under P-2 option (i) the first step never meets an existing folder (Amendment 39 item 1).
```
- Clause check:
  - "bound … before the refusal": this is my 7(b) mutation, diff below.
  - "Seen failing at the step, after the save's assert held": the panic is at `project_reopen.rs:610:40` inside `opacity_step` (`impl Run` at :554), called at :1680, which is after the assertion at :1679.
  - "`create` refuses the record folder the other run left": the panic text names `the record folder` and os error 183. That text comes from `session_history.rs:482 at H` (`create_dir`). The folder is the project's hex (:476), which `left_by_another_run` (:1569) made.
  - The K-O18 lines keep the worker's seen failure from Amendment 39 (at 270d3ac2). I did not re-run that.
  - The last two lines are unchanged from H.

**D9: `kernel/src/session_history.rs:135-136 at H` (Open::uri's doc).**
- Old (byte-copied):
```
    /// The open's one dataset identity: minted once, and carried by the history's header, by every
    /// step's `data.dataset` and by the project file's dataset entry.
```
- Defect: for a reopened open this is untrue. `reopened` replaces the minted identity with the project file's identity (:392).
- New:
```
    /// The open's one dataset identity: minted at its first mention, or for a reopened open the
    /// project file's ([`StepRecorder::reopened`]), and carried by the history's header, by every
    /// step's `data.dataset` and by the project file's dataset entry.
```
- Clause check:
  - "minted at its first mention": :170.
  - "for a reopened open the project file's": :392, proven by row K-O21b. Its mutation ("the recorder's minted dataset URI kept") fails at `project_reopen.rs:1741 at H`.
  - "carried by …": :303 and :321 (step and header), and :277 (the save's ask).

**D10: the closing amendment must name K-O25.**
- Amendment 41 item 4 says "named by the worker". The label K-O25 and the test name `a_relink_the_writer_refuses_writes_nothing_at_a_first_reopen_or_a_copy` occur in no form text on main (grep count 0).
- Under round 25 the closing amendment names the test with its commit id, 68374441. It is not hash-pinned at a branch commit.

**D11: the closing amendment records class 8.**
- Amendment 41 item 7 counts class 8. The figures by the §2.11 command:
  - `project_reopen.rs` 1457 of 520 (+937)
  - `project_lock_crash.rs` 151 of 70 (+81)
  - the tests group 1608 of 590
  - the total 2170 of 1,230
  - 7 files of 6: the ADR has no ceiling row in item 4; Amendment 36 item 10 brings it in
- Product files are within their ceilings: mod.rs 488/520, skp.rs 30/60, session_history.rs 30/50, dataset_ref.rs 6/10. The product group is 554/640.
- Step 2's kernel product total is 1417 of 1,400 (17 over).
- The §7 lines are not to be edited to match.

## To the advisor (Observations; none blocks)

**A1. Two reorderings that come with Amendment 41 item 3(a) but are not declared by it.** My reading of the code:
- A copy's `ProjectFileUnwritable` from `replace` now comes after a relink check that can refuse first.
- `Cancelled` is now checked at `live()` after the lineage read (`mod.rs:711 at H`).
- Both follow necessarily from moving the check, and both write strictly less.
- Ordinary use cannot reach either. It would take a relink the writer refuses (a relative, non-Unicode or over-long path) together with a replace failure or a cancel inside one call.
- Whether the closing amendment records them is the advisor's call.

**A2. ADR-036 Amendment 2 item 3** (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:291 at H`). It is pre-existing, and the PR does not edit it. It says each open's identity is "minted the first time the recorder is asked". A reopened open now carries the project file's identity. This is red-line text: I give no words and do not grade it.

**A3. Differences between the mutation table script and the item 7(b) table rows.** I ran the brief's table script (sha256 matches). Four rows do something different from the form's words:
- K-O2 removes only the mtime comparison in `engine/src/descriptor.rs`; the form says "only byte_size compared".
- K-O10b reads a refused locations.json as holding no entry.
- K-O14 leaks the lock by `mem::forget`; the form says "the error arm keeps the guard".
- K-O4a locks under a fresh random root.
- All four fail.

**A4. K-O25 has no catalog assertion.** It does not assert that the catalog holds no entry after the refusal, as item 7(b)'s general bullet asks of a case that opens nothing. It does assert that the locks are free (save's Projects dropped). It also asserts the named `MachineRecordRefused`, the copy's bytes, the store listing, the identity folder's absence and an empty write list, with no early return.

Smaller observations:
- folders.json is read before the lock. A stale write would need another process to complete a whole open between that read and the lock, which ordinary use does not do.
- When a copy's `replace` fails, the new identity's folder is left holding folders.json and open.lock.
- The step 4 doc's "the identity the project file names" is ambiguous for a copy: the code reads the original identity's folder.
- The architect's O3 and O5 stand.
- I could not read the PR body (`gh pr view` is not allowed).
- Other runs on this branch cannot be listed (`gh run list` is not allowed).

## Checks

**1 Start (2026-11-19T10:26:57Z).**
- Fetch rc 0.
- `rev-parse HEAD` gives H. Porcelain is 0 bytes. `ls-remote` gives H.
- df: C: 46G avail, D: 361G avail.

**2 Diff, B...H numstat.**

| File | Added | Deleted |
|---|---|---|
| ADR-036 | 8 | 0 |
| dataset_ref.rs | 4 | 2 |
| mod.rs | 485 | 3 |
| session_history.rs | 30 | 0 |
| skp.rs | 26 | 4 |
| project_lock_crash.rs | 151 | 0 |
| project_reopen.rs | 1457 | 0 |

- Total: 2161 added, 9 deleted.
- There is no diff over Cargo.lock, **/Cargo.toml, frontends or protocol.
- Main's drift B→origin/main over the seven paths is empty.
- 68374441 is hunk `@@ -1794,3 +1794,61 @@`: appended, with no deleted lines. c351ddb8 touches mod.rs only (9/7).

**3 §2.11 counts.** The figures are in D11. The literal command and the present-path command gave identical results.

**4 The O1 fix.**
- The moved lines are byte-identical.
- Doc steps 2 and 5 are true at H.
- The reorderings are in A1.

**5 The rest of the change.**
- I grepped pub items with `^\+\s*pub(\(crate\))? `, with a positive control on `pub fn adopt_project`. The grep finds the following, and they match item 7(a)/8:
  - pub: Answer, Reopen, Opened (and its seven pub fields), ViewState, OpenFailure, open_project
  - pub(crate): reopened, OpenGuard, begin_open, open_under
- `dataset_ref.rs:590-593 at H` equals the 2026-10-23 draft.
- ADR Amendment 3 equals ADV-04 item 4's fence. Its items 1 and 2 equal the 2026-10-23 draft byte for byte.

**6 Words.** D1 to D9 above.

**7(a) Table.**
- Dry run rc 0 at 10:34:18Z: all 35 old texts found once.
- Full run in hold 1 (`<S>`/g337r-mutate.mjs, script start 10:34:48.803Z, done 10:47:54.505Z). Every row was reverted with `git diff --quiet` rc 0. Porcelain was empty after.
- All rows fail (cargo rc 101) except K-O19 (`cargo rc 0; test the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own ... ok`).
- Compared with the worker's table at 270d3ac2, every row has the same outcome and the same panic line, except K-O20, K-O21a, K-O21b and K-O22. Those four sit +6 lines lower (1702→1708, 1726→1732, 1735→1741, 1768→1774), because b5c35156's comment lines lie above them.
- Rows near c351ddb8, byte-copied:
  - K-O8b: `panicked at kernel\tests\project_reopen.rs:1278:5:` `Err(Open(SkpError { code: "engine.source", message: "source: elsewhere/parcels.parquet is not a readable file", fields: {} }))`
  - K-O4a: `panicked at kernel\tests\project_reopen.rs:1074:9:` (an `Ok(Opened(...))`)
  - K-O4b: `panicked at kernel\tests\project_reopen.rs:1106:5:` `assertion \`left == right\` failed`
  - K-O14: `panicked at kernel\tests\project_reopen.rs:734:5:` `open.lock is free: Err(Held)`

**7(b) Amendment 40 item 3.**
- Applied by one anchored `node -e` (it refuses unless the anchor occurs exactly once). rc 0. `git diff`:
```
@@ -373,6 +373,7 @@ impl StepRecorder {
             let _ = std::fs::remove_dir(&moved);
         } else if !state.records.iter().any(|r| r.holder == held) && left() {
             let left = "another run left a record there";
+            state.open(open).bound = Some(project.clone());
             return Err(unwritable("the project's record folder", &left));
         }
```
- This is equivalent to the worker's `1cp3a2m-mutate.mjs`.
- In hold 2: K-O19 rc 101: `thread 'the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own' (43452) panicked at kernel\tests\project_reopen.rs:610:40:` / `recorded: SkpError { code: "skp.session_history_unwritable", message: "this step could not be written and flushed to the session history: the record folder: Cannot create a file when that file already exists. (os error 183)", fields: {"detail": "the record folder: Cannot create a file when that file already exists. (os error 183)"} }`
  - It fails at the step (:1680 calls :610), after the mark assertion at :1679 held. This is as predicted.
- K-O18 rc 101: `thread 'a_save_after_a_reopen_with_no_step_whose_project_record_another_run_left_leaves_it_and_keeps_the_open_unbound' (53892) panicked at kernel\tests\project_reopen.rs:1655:9:` / `Withheld(NoStepRecorded)`
  - The line is inside the two-save loop, so the output does not show which iteration failed. My reading: it is the second save, because the first save returns the 5(g) refusal (withheld as unwritable, which the assertion accepts) and the second meets a bound open. This matches the prediction.
- Reverted with `git checkout -- kernel/src/session_history.rs`, rc 0. `git diff --quiet` rc 0. sha256 590718fca474495e233685380adc893c0d64bac133ca2b9c7a7f820e248615e5, equal to `git show H:` of the file.

**7(c) Amendment 41 item 4.**
- Applied by one anchored `node -e` (block and anchor each exactly once). rc 0. The diff removes the 5-line block before `let lock = ProjectLock::try_lock` and puts it back after `live()?;` before `let path = match relink {`.
- Against mod.rs at b5c35156, `diff` shows only the doc lines 596-597 and 601-604, so the code is b5c35156's. This is equivalent to the worker's `1cp3a2o1-mutate.mjs`.
- In hold 3: rc 101: `thread 'a_relink_the_writer_refuses_writes_nothing_at_a_first_reopen_or_a_copy' (75220) panicked at kernel\tests\project_reopen.rs:1853:5:` / `nothing written: ["copy: the copy's project.spatial", "copy: a machine folder for a new identity", "first reopen: the identity's machine folder"]`
  - It fails at the final "nothing written" assertion and names both cases, as predicted. It is identical to the O1 worker's run5.
- Reverted with `git checkout -- kernel/src/project/mod.rs`, rc 0. diff-quiet rc 0. sha256 f5e8832ad66b5c6789eb1f5f4baf1c0bf6f2fc67d2d13dfa254e69694f5ee79c, equal to `git show H:`.

**8 Runs.**
- Why I reproduced instead of reusing: the O1 worker's run3 and clippy2 logs (10:02:45Z, 10:03:18Z) were written before c351ddb8's commit time (10:03:33Z).
- Hold 4: `cargo test --locked -p spatial-kernel --lib` plus 14 targets: rc 0.

| Target | Passed |
|---|---|
| lib | 193 (1 ignored) |
| project_lock_crash | 2 |
| project_reopen | 40 |
| project_resolver | 4 |
| project_save | 21 |
| project_save_crash | 1 |
| project_save_skp | 6 |
| project_store | 5 |
| session_history | 13 |
| session_history_crash | 1 |
| skp_admission | 10 |
| skp_admission_remediation | 7 |
| skp_cancel_terminal_without_credit | 2 |
| skp_filter_cancellation | 1 |
| skp_projection | 14 |

- `cargo clippy --locked -p spatial-kernel --all-targets`: rc 0, nine warnings:
  - renderer\src\canonical.rs:303
  - renderer\src\style.rs:10
  - engine\src\app_dirs.rs:39
  - kernel\src\permission\boundary.rs:536
  - kernel\src\publish\mod.rs:839
  - kernel\src\skp.rs:277 (type_complexity)
  - kernel\src\lib.rs:415
  - kernel\src\lib.rs:490
  - kernel\src\bin\publish-bundle.rs:149
- These are the O1 worker's same nine. Of them, only skp.rs is in the PR. Line 277 is identical at B and outside the PR's hunks.

**9 Light runs, from `<W>`.**
- `node scripts/plan/verify-test-claims.mjs` rc 0: "verify:test-claims PASS — all 868 claimed test(s) across 275 file(s) …".
- `node scripts/plan/verify.mjs --offline` rc 0: "verify:plan PASS".
- Note: `<W>`'s form copy is at B and has no Amendments 40–41, so these runs did not see main's latest form text.

**10 CI.**
- At 10:35:29Z and again at 10:56:46Z: `gh pr checks 337`, 20 pass.
- All 12 runs are at c351ddb8 and completed with success: 44502275908, 44502283989, 44502276025, 44502284108, 44502275863, 44502283996, 44502283924, 44502284050, 44502276022, 44502283898, 44502276019, 44502283922. Windows, macOS and Ubuntu pass in both Rust workspace runs.
- 44474730131 is the known red, at ff31b05c (push). Tests were pushed before code: E0432 unresolved imports `OpenFailure`/`Reopen`/`Answer` and E0599 no method `open_project`, on all three platforms. No other branch runs could be listed.

**11 End (10:56:46Z).**
- HEAD is H. Porcelain is 0 bytes. `ls-remote` gives H.
- df: C: 46G avail (91%), D: 361G avail.

## Holds (all shared, `-Project <m>`)

| Hold | Start | End | Command |
|---|---|---|---|
| 1 | 10:34:36Z | release 10:47:56Z | mutation table |
| 2 | 10:50:10Z | 10:50:38Z | K-O19 then K-O18 |
| 3 | 10:51:51Z | 10:52:17Z | K-O25 |
| 4 | 10:52:46Z | 10:56:29Z | tests and clippy |

- Each hold printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<own> also=<m> …` and `MACHINE_RELEASED project=<m> …`. There were no exits 96–99.
- A departure, mine: the lines for holds 2 and 4 ran a second command after `;` rather than `&&`. Had the hold failed, that command would have run outside a hold. Both holds printed MACHINE_HOLD, so it ran inside. The same lines also ran exports before the hold and `date`/`echo` after the release.

## Background
None of my shells or processes is still running: all four hold tasks completed. A notification arrived for a task I did not start ("PR 327 head series tester"). I did not read it.

## Scratch files
All are in `<S>`:
- g337r-mutations.txt (table summary)
- g337r-7b-ko19.log, g337r-7b-ko18.log (7(b) runs)
- g337r-7c-ko25.log (7(c) run)
- g337r-8-test.log, g337r-8-clippy.log (check 8)
- g337r-9-vtc.txt, g337r-9-verify.txt (check 9)

Model: Opus 5.5 (claude-opus-5-5).
