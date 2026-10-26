Reviewed: PR #261 at ce318b5ef99124f42dae00c4c41aa163e4dcf8aa (base 2a6adbb1), gate 1, reviewer
cut/session-generation-other-recorded-mutations-name-no-commit @ ce318b5ef99124f42dae00c4c41aa163e4dcf8aa

Verdict: PASS WITH NOTES

I re-ran all five mutations on my own export of the base, and every outcome matches the new comment words. The code and the evidence hold. Two Documentation findings must be fixed before the merge, with no re-gate.

## Correctness
None.

## Evidence
None.

## Documentation (must-fix before the merge, no re-gate)

**D1. W-C's middle sentence is too broad.** It is at kernel/tests/session_generation.rs:243-245 at the head. It is not the human's wording: it is the architect's doc comment.
- **What is wrong.** The sentence says "Every public method that reads the attributions prunes before it reads them, except `invalidate`". At the base, `forget_dataset` is a `pub fn` (kernel/src/skp.rs:827-837). Its `st.tickets.retain(|_, (d, _, _)| d != dataset)` reads every attribution's dataset, and it does not prune first.
- **Why the conclusion still holds.** `forget_dataset` returns `()`, so the closing clause ("the call is not observable through this registry's public methods") is still true. Only the premise overreaches.
- **Note 1 missed it too.** The form's own clause check for this sentence lists only `attributed_ticket_count` (:660) and `ticket_liveness` (:680) as readers.
- **Replacement words.** They replace head lines 243-246 only. Head line 242 is unchanged and shown for context. The line count stays 4. The widths, measured by script, are 91, 97, 97, 98 and 54 columns.
```
/// `dead_generation_attributions_are_pruned_rather_than_accumulating` PASSED. Each round's
/// `invalidate` prunes after it removes the generation. Every public method whose answer depends
/// on the attributions prunes before it reads them, except `invalidate`, whose filter keeps only
/// the generation it ends; so, without a clock this file must not take (ADR-018), the call is not
/// observable through this registry's public methods.
```
- **Each clause checked against the base code** (kernel/src/skp.rs):
  - **"whose answer depends on the attributions":** only three methods qualify.
    - `attributed_ticket_count` returns `st.tickets.len()` after pruning (:659-661).
    - `ticket_liveness` reads `st.tickets` after pruning (:679-680, :690).
    - `invalidate` returns `ended`, collected from `st.tickets` (:795-800).
  - **Every other `pub` method's answer comes from other state:**
    - `mint_for_open` answers from `st.next` (:581-582);
    - `live_generation` from `invalidated`, `closing` and `live` (:605-614);
    - `attribute_ticket` from `closing` and `live` (:625-634); it only inserts into the attributions;
    - `dead_ticket_count` from `dead_tickets` (:715);
    - `ended_reason` from `invalidated` (:758);
    - `forget_dataset` returns nothing (:827).
    - `begin_close` is `pub(crate)`.
  - **"except `invalidate`, whose filter keeps only the generation it ends":** the filter is at :798, and `invalidate` does not prune before it collects (:788-800).
  - **"the call is not observable":** unchanged from W-C. `forget_dataset`'s retain removes this dataset's attributions of every generation, and it leaves stale entries of other datasets to the next prune, which every reader above runs first.
- **Application.** The worker applies these words and the PR body lists them. The form's closing record notes that W-C at the head differs from note 1's fence in this one sentence.

**D2. The PR body misstates W-B.** This is in the PR body, not in the code.
- **What is wrong.** The W-B bullet reads "PASSED, recorded as not detected by this test (each test mints a name once)". That is untrue of the file: `dead_generation_attributions_are_pruned_rather_than_accumulating` mints `ds_a` 50 times (base :234-235), and the concurrency test re-mints it (base :279). W-B's own words are "This test mints each name once".
- **Replacement words:** "PASSED, recorded as not detected by this test (it mints each name once)".
- **Clause check:** `invalidate_returns_exactly_the_tickets_of_the_generation_it_ended` mints `ds_a` and `ds_b` once each (base :151-152).

## Note on the worker's report (a record, nothing to fix in the PR)
The report says the two `generations.inner.lock()` sites at skp.rs:4373 and :4529 are in the unit-test module. There are five such sites at the base: 4373, 4529, 4583, 4640 and 5086. All five are inside `#[cfg(test)]` modules (`mod tests` from :2390, `mod ticket_drop_under_lock_regression` from :3415), so the conclusion stands. Only the count is short.

## Checks

**1. The diff.**
- `git diff --numstat 2a6adbb1...HEAD` gave rc 0: `49	17	kernel/tests/session_generation.rs`. That is one file and 66 lines, against the declared budget of 90.
- The merge base is 2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf, with one commit (ce318b5e).
- My own script (`sgo-g1r-check.mjs`, rc 0) found 66 changed lines, 0 of them outside `///`. No code, assertion, message, fixture or test name changed.
- Each W-heading's base span is exactly the span replaced: W-A :121-122, W-B :145-147, W-C :229-230, W-F :251-253, W-D :255-257, W-E :544-547.
- The longest changed line is 98 columns. The 10 lines over 100 columns at the head are the base's own 10, shifted down.
- There are no CRs.

**2. The words.**
- Method: the same script rebuilt the head from the base by putting each fence of the form's note 1 in place, with `<base>` replaced by 2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf (one occurrence each in W-A to W-E, none in W-F).
- Result: `expected === head: true`, 29709 = 29709 bytes.
- The form is the same at the base and on main: sha256 faef1370b9348425c910b2ea989be0ec211cb3e0d63ededd41b57d263bcf3600 both.
- The blob ids of skp.rs, lib.rs, the test file and transport.rs are identical at 564a98b2 and 2a6adbb1. The 7 pins in note 1 recompute OK at 564a98b2: skp.rs:628-631, :437-439 and :808-812, session_generation.rs:136-139, transport.rs:154, lib.rs:321-324 and :389.
- I read every clause check against the base and found each true, except W-C's middle sentence (D1). Points of note:
  - W-B's "only if" reading holds: `mint_for_open` prunes before it replaces `live` (:580, :583), and `open_dataset` mints a fresh `DatasetHandle` (:1114) used at :1246 and :1279.
  - The workspace and kernel Cargo.toml carry no lints or warnings keys, and there is no `.cargo` folder.

**3. The observations, again (my own export).**
- **Export.** `git archive` of 2a6adbb10d2a… went to a scratch tar (rc 0), then `tar --force-local -xf` into the new folder D:/wt-targets/sgo-g1r-export (rc 0). The tar was deleted afterwards.
- **Sources checked and touched.** The three sources were sha256-equal to the base before the runs (lib.rs f6d57439…, skp.rs 616586af…, test file 7a5c3318…), and I touched them at 05:18:28Z.
- **Target.** CARGO_TARGET_DIR was D:/wt-targets/sgo-g1r-target (new) for every export run.
- **First run.** It printed `Compiling spatial-kernel v0.0.0 (D:\wt-targets\sgo-g1r-export\kernel)` and `Finished ... in 16m 20s`.
- **Method.** An exact-string script made each edit. Each edit had to match its expected count, and all five were dry-run first on scratch copies. Each diff against the base was printed before its run, and each restore was a copy of `git show 2a6adbb1:kernel/src/skp.rs`.

| | Unmutated | Mutated (exit code) | Restored skp.rs |
|---|---|---|---|
| M-A (628-631 → `let g = st.live.get(dataset).map_or(0, \|(g, _)\| *g);`) | rc 0, `1 passed` | 101: panicked at `kernel\tests\session_generation.rs:136:5`: `an ended session attributes nothing` | sha 616586af…, cmp 0 |
| M-B (`&& *tg == g` dropped at :798) | rc 0, `1 passed` | 0: `test result: ok. 1 passed`; warnings: unused `tg` at skp.rs:798:30, unused `g` at :789:19 | 616586af…, cmp 0 |
| M-C (:624 removed) | rc 0, `1 passed` | 0: `test result: ok. 1 passed` | 616586af…, cmp 0 |
| M-D1 (:438 → `std::cell::RefCell<GenerationState>`, 10 `self.inner.lock().unwrap_or_else(..)` → `borrow_mut()`) | rc 0, `1 passed` | 101: does not build. 3× `error[E0277]: \`RefCell<GenerationState>\` cannot be shared between threads safely` at kernel\src\lib.rs:389:24 (`impl SourceFactory for EngineSourceFactory`; chain through GenerationRegistry → `Arc<GenerationRegistry>` → AdmissionMode lib.rs:314 → EngineSourceFactory lib.rs:328 → `SourceFactory: Send + Sync + 'static`, transport.rs:154:33), kernel\src\lib.rs:679:22 (`impl BatchSource for EngineSource`), kernel\src\skp.rs:1132:13 (the WatchSink closure) | 616586af…, cmp 0 |
| M-E (loop :809-812 moved after :816 prune, fed from a `Vec` collected from `st.tickets` with the same filter) | rc 0, `1 passed` | 101: panicked at `kernel\tests\session_generation.rs:563:5`: `` assertion `left == right` failed: and the record kept the handle `` / `left: 0` / `right: 1` | 616586af…, cmp 0; lib.rs f6d57439… cmp 0; test file 7a5c3318… cmp 0 |

- Every outcome matches the new comment words.
- M-D2 was never applied.
- No `verify-mutation` run was made or relied on.

**4. The head (the PR's worktree, CARGO_TARGET_DIR=D:/wt-targets/sgo).**
- `cargo test -p spatial-kernel --locked --test session_generation` gave rc 0: `test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.03s`.
- The target was warm from the worker's head build, so nothing recompiled (`Finished ... in 0.35s`). The binary ran from D:/wt-targets/sgo. The head differs from what that target last built only in doc lines, and CI also built and ran it at the head.
- `cargo fmt --all -- --check` gave rc 0 with no output.

**5. Verify scripts (worktree) and CI.**
- `verify.mjs --offline` rc 0: `verify:plan PASS`.
- `verify-cites.mjs` rc 0: `verify:cites PASS`, 2429 files, 101 loose references advised.
- `verify-quotes.mjs` rc 0: `verify:quotes PASS — 131 checked, 100 verified, 30 baselined`.
- `verify-test-claims.mjs` rc 0: `verify:test-claims PASS — all 671 claimed test(s)`.
- `gh pr checks 261`:
  - First read: rc 8, one pending check (Windows, run 40272639941).
  - `gh run watch 40272639941 --exit-status` then gave rc 0. `gh run view` showed headSha ce318b5e…, completed, success.
  - Second read: rc 0, 18 checks pass, none failing or pending.
- Head sha by `gh run view`: all 12 runs have headSha ce318b5ef99124f42dae00c4c41aa163e4dcf8aa and concluded success.
  - push runs: 40271125187, 40271125184, 40271125178, 40271125200, 40271125199.
  - pull_request runs: 40272639941, 40272639861, 40272639912, 40272639864, 40272639904, 40272639855, 40272639928.

**6. The PR body and the disclosures.**
- **PR body.** These claims hold against the head and my runs:
  - The PR is a draft, its head is ce318b5e…, its base is main, and it changes one file, 49 in and 17 out.
  - "every changed line a `///` doc line" is true.
  - The W-A, W-C, W-D, W-E and W-F bullets are true.
  - "the file's 12 tests pass" and "four verify scripts pass" are true.
  - "every outcome as the words predict" is reproduced above.
  - The exception is the W-B bullet's parenthesis (D2).
- **Disclosure 1 (tar file).** D:/wt-targets/sgo-export.tar and D:/wt-targets/sgo-export are both absent (ls rc 2). I cannot see the worker's transcript.
- **Disclosure 2 (revert and the next run in one message).** I cannot check this from the worker's transcript. My own M-E unmutated run, on a file shown equal to the base, passed independently.
- **Disclosure 4 (unused `tg`).** Reproduced: the unused `tg` warning at :798:30 sits beside the unused `g` at :789:19. Warnings only; the build passed.
- **M-D1's three E0277 errors.** Reproduced: the same three sites in the same order, SourceFactory impl first. W-D's "among any other sites" covers the second and third.

**Hold lines (own project only).** There were 8 holds, all `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF`, each followed by `MACHINE_RELEASED project=SpatialIDE`. None was refused, and no exit code 96 to 99 occurred.
- Export cold build plus M-A unmutated: background, rc 0, 16m 20s build.
- M-A mutated: rc 101.
- M-B unmutated (0) and mutated (0).
- M-C unmutated (0) and mutated (0).
- M-D1 unmutated (0) and mutated (101).
- M-E unmutated (0) and mutated (101).
- Head suite: rc 0.

**End state.**
- The PR worktree's porcelain is empty (0 bytes), and its HEAD is ce318b5e….
- D:/wt-targets/sgo-g1r-export is removed (ls rc 2).
- The target D:/wt-targets/sgo-g1r-target remains.
- `tasklist` finds no cargo.exe, rustc.exe or session_generation* process.
- I made no commit, push or PR action, and wrote only to the scratch folder (`sgo-g1r-*`), my export and my target.

Files I read: C:\dev\spatial-ide\kernel\SESSION-GENERATION-OTHER-RECORDED-MUTATIONS-PREREGISTRATION.md, C:\dev\spatial-ide\state\consults\2026-10-26-session-generation-other-recorded-mutations-name-no-commit-build-worker-report.md, C:\dev\spatial-ide\state\directives\2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md, C:\dev\wt\sgo\kernel\tests\session_generation.rs
