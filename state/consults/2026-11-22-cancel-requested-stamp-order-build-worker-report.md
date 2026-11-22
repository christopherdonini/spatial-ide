*Filed by the custodian: the cancel node's build (governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md, C1 to C4), by the high-effort worker (claude-sonnet-5-5), on cut/cancel-stamp-order from 4b7655a2 to 3f3820c9eddaca61d503c76e8d2308e50c6a8667. Its hand-back, 12935 bytes, sha256 87c47057d2620fc18214913a3b1ee9b9046522207b7e8cc6c3e64c581f0009cb, below the rule. Its calls in the transcript, by unique call ids: Bash 171, Edit 38, Read 16, Write 11, SubagentHandback 1; 4 errored, each an Edit refused before a Read of its file and redone after one; one compaction; from 2026-11-22T07:18:13Z to 2026-11-22T09:56:49Z. Not yet read by a gate: what it reports is its own. The custodian re-ran the one red suite on the branch at 3f3820c9 and got the same ten unresolved cites.*

---

Stopped: C1 to C4 are built and pushed at 3f3820c9eddaca61d503c76e8d2308e50c6a8667 (cut/cancel-stamp-order), but one required suite is red at C4. `node scripts/plan/verify-cites.mjs` exits 1 with 10 unresolved cites. Form §4.5 requires it green at C4. The cause is my C3 diff, which shortens two files that other documents cite by line. I did not touch those documents, and I left the failure as it is. Details are under "Suites" below. The push followed the brief's plan; the custodian decides what to do about the red suite.

Everything else was green and matched the form's predictions. Areas of mine are marked "(mine)". Nothing in this report is a paraphrase presented as a quote.

**Start state**
- Worktree: C:/dev/wt/cancel-stamp. Base: 4b7655a255590bff20dc2c866b5ae1b7568b112f. I did not re-check origin/main's base against any later commit beyond the checks below.
- The S0 overlap check ran at the start. I re-ran it at the end. `gh pr list --state open --json number,headRefName,isDraft` printed `[]` (rc 0), so there is no open PR and nothing overlaps the ten Scope paths. The summary I kept from the first half does not hold the S0 lines byte for byte. This re-run is my evidence.
- After the final `git fetch`:
  - origin/main = 4b7655a255590bff20dc2c866b5ae1b7568b112f
  - origin/cut/cancel-stamp-order = HEAD = 3f3820c9eddaca61d503c76e8d2308e50c6a8667
  - `git status -sb` says "ahead 4", and the tree is clean.
- Heavy runs used `hold shared -Project SpatialIDE`. The hold lines printed `also=<m>` and `others=<m>`. No exclusive hold, no `-TargetPid`, and no run, book or cancel action was used. No exit code 96 to 99 appeared.

**Commits** (committer times are +01:00)
- C1 4a26ed74db51caf38717f012ce9472f4d32c931a, 2026-11-22T08:35:01+01:00, "test: the cancel request's stamp order, the hooks and the tests before the fix". It touches `engine/src/cancel.rs` (+299) and `engine/tests/cancel_request_stamp.rs` (new, +199).
- C2 ebdd0fd7ce0100fd621529aeb6fd239faafe6c30, 09:25:48, "fix: the cancel request is stamped under the transition lock before the flag is published". It touches `engine/src/cancel.rs` only (+54, -16).
- C3 b33e496da7edd57989a9c79878152ac86336ec52, 09:33:55, "test: the two ATTEMPTS wrappers removed and the slice assertion on the stamp order". It touches `engine/tests/slice.rs`, `kernel/tests/skp_admission.rs` and `kernel/tests/skp_filter_cancellation.rs`.
- C4 3f3820c9eddaca61d503c76e8d2308e50c6a8667, 10:16:34, "docs: the notes on where cancel_requested is stamped, the trace sentence and the owner's index". It touches the ADR-018 note (+6), the kernel notes (+8), `engine/src/trace.rs`, and the two README indexes.

**Results at C1 (tests red as §4 predicts)**
- Unit, from `cst-c1b-unit.log`: 3 passed, 5 failed.
  - T1: `assertion `left == right` failed: the cancelled flag was already published when the request was stamped` with left: 2, right: 1.
  - T2: `assertion `left == right` failed: an observer that saw the flag found 0 request stamps, not 1` with left: 0, right: 1.
  - T3, T4 and T5 each panicked at `engine\src\cancel.rs:664:33` with `timed out waiting for: the drop to find the transition lock held`. They ran about 60 s each, and the unit run took 60.00 s. This is item 12's "hook site does not exist".
  - T6, T7 and T8 passed.
- Integration, from `cst-c1b-int.log`: I1, I2 and I4 passed. I3 failed with `an_observer_spinning_on_the_flag_never_stamps_before_the_request: 24 inversions in 200 iterations`. The panic line read `24 of 200 iterations stamped the observer before the request; (iteration, requested ns, observed ns): [(3, 149000, 147600), (14, 90800, 89700), ...`.
- Campaign at C1, 50 + 50 runs, each its own cargo process, counting the wrapper's `attempt k/5 ... hit` lines:
  - skp_admission: 4 hits, in runs 15, 35, 43 and 46. All 50 runs passed (rc 0).
  - skp_filter_cancellation: 0 hits, all 50 runs passed.
  - So local detection power was low (4 hits in 100 runs). Per §4.4 the evidence rests on §4.1 and CI as much as on the campaign.

**Results at C2 (tests green)**
- Unit: 8 passed, 0 failed. Integration: 4 passed. I3 printed `0 inversions in 200 iterations`.
- I3 has no sleep. The 60 s deadline bounds each of the 200 iterations. The line is `an_observer_spinning_on_the_flag_never_stamps_before_the_request: 0 inversions in 200 iterations`.

**Mutations (each applied, run, reverted, and `git diff` empty after the revert)**
- Every kill matched the form's predictions (Amendment 1 item 9; Amendment 2's correction to M5's passes). Kills recorded as extra, not claimed as predicted, are noted below.
- M1 (the stamp after the publication, inside the lock):
  - Killed T1 and T2 (panics at `cancel.rs:730` and `:761`).
  - T3 to T8 passed.
  - I3 printed 0 inversions, so it was not killed.
- M2 (the transition lock removed, a `swap` claims, the stamp after it):
  - Killed T1, T2, T3, T4 and T5 (5 failed, 3 passed; T3 to T5 by the deadline message at `cancel.rs:687:33`, run time 60.01 s).
  - T6 to T8 passed.
  - I3 printed 2 inversions in 200 and failed. That is an extra, probabilistic failure, recorded but never claimed as a kill. I1, I2 and I4 passed.
- M3 (the publish guard removed, a plain store after the mark):
  - Killed T8 only. Messages: `the stamp panicked` and `a stamp that panicked left the token uncancelled`.
  - I1 to I4 passed.
- M4 (`first` ignored, so every call stamps when `stamp` is true):
  - Killed T3, T5, T6 and T7 (4 failed, 4 passed).
  - Killed I1, I2 and I4.
  - T1, T2 and T4 passed, and so did I3 (0 inversions).
- M5 (`stamp` ignored, so a drop stamps):
  - Killed T5 and T7, and I4.
  - Killed `kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant` (panic at `trace_spans.rs:351:5`).
  - T1 to T4, T6, T8, I1 and I2 passed.
- M6 was not run, per the form (not killable on x86-64).
- M7 (the stamp removed from `cancel_inner` and made in `BatchStream::next_into` on `Err(Cancelled)`):
  - At C3 it was killed at the new slice assertion, as predicted. The message was `cancel_observed (28451900 ns) was stamped before cancel_requested (34641600 ns)`, with the panic at `engine\tests\slice.rs:900:5`.
  - At C2 the unchanged `slice.rs` (the same M7 edit, with `slice.rs` restored from ebdd0fd) passed with `observed → terminal received 4.5183ms`. This confirms the old test's `saturating_sub` could not see the inversion. The 0 ms figure predicted for the budgeted interval was not printed by that test, so I cannot quote it. The test passed.
  - `git diff` was empty after each M7 revert.

**Campaign at C3 (50 + 50, the same shape as C1)**
- skp_admission: 50 of 50 passed, 0 wrapper hits.
- skp_filter_cancellation: 50 of 50 passed, 0 wrapper hits.
- No ordering failure and no presence failure.
- I saw no `PRODUCER_CANCELLED` failure in skp_admission, so there is nothing to record under that clause.

**Item 15 disclosure and residual**
- Disclosure: the campaign at C3 shows no failure in 100 runs, but C1 showed only 4 hits in 100 runs, so 0 hits at C3 is weak evidence by itself.
- Residual: Amendment 2 item 10's clause stands. skp_filter_cancellation does not carry the cross-test trace risk, because its binary holds one test.
- skp_admission shares one binary with other tests, and its residual stays as Amendment 1 item 15 says.

**C4 notes and counts**
- `node <S>/cancel-notes.mjs C:/dev/wt/cancel-stamp` printed `NOTES-OK` (rc 0). The numstat afterwards was ADR-018 6/0, kernel notes 8/0, `trace.rs` 3/2. All three are as expected.
- The README edits (mine, pointers only):
  - `engine/README.md`: the form's path in the preregistration list; two pinning pointers on the Cancellation row (`engine/src/cancel.rs::tests::the_request_is_stamped_before_the_flag_is_published` and `engine/tests/cancel_request_stamp.rs::an_observer_spinning_on_the_flag_never_stamps_before_the_request`); and an extension of the last-verified line citing b33e496d (3 insertions, 3 deletions).
  - `kernel/README.md`: the form's path appended to the kernel halves list, and the last-verified line extended (2 insertions, 2 deletions).
  - The index lengths stayed at 35 lines in `engine/README.md` and 46 in `kernel/README.md`, both under 60.
  - The last-verified entries cite b33e496d (C3), since an id inside C4 cannot name C4.
- Item 3's count, `git diff --numstat origin/main...HEAD` over the ten paths at 3f3820c9 (insertions/deletions):

| File | Ins/Del |
|---|---|
| ADR-018 | 6/0 |
| `engine/README.md` | 3/3 |
| `engine/src/cancel.rs` | 345/8 |
| `engine/src/trace.rs` | 3/2 |
| `engine/tests/cancel_request_stamp.rs` | 199/0 |
| `engine/tests/slice.rs` | 5/1 |
| `kernel/CANCELLATION-AND-TRACING.md` | 8/0 |
| `kernel/README.md` | 2/2 |
| `kernel/tests/skp_admission.rs` | 11/53 |
| `kernel/tests/skp_filter_cancellation.rs` | 10/40 |

- The total is 701 changed lines, against a ceiling of 800. `git diff --name-only origin/main...HEAD` lists exactly those ten paths.

**Suites at C4 (3f3820c9)**
- `cargo test -p spatial-engine`: rc 0, no failed result lines (31 result lines read from `cst-c4-engine.log`). Last line: `test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s`.
- `cargo test -p spatial-kernel`: rc 0, no failed result lines among its 62 result lines. The last result line was the same 0-passed doc-test line.
- `cargo fmt --all -- --check`: rc 0.
- `cargo clippy -p spatial-engine -p spatial-kernel --all-targets`: rc 0 (warnings only, and CI has no clippy step). One warning is in my new file, `engine\tests\cancel_request_stamp.rs:111:25`, `manual_is_multiple_of` (`spins % 1024 != 0`). The rest are in `kernel`, `renderer` and `engine\src\app_dirs.rs`. I did not fix mine, because a fifth commit was outside the brief. It is a one-line change if wanted.
- `node scripts/plan/verify.mjs --offline`: rc 0. Last line: `verify:plan PASS — C:\dev\wt\cancel-stamp\governance\PLAN.yaml agrees with the repository.`
- `node scripts/plan/verify-quotes.mjs`: rc 0. Last line: `verify:quotes PASS — 159 checked, 128 verified, 30 baselined, 1 advisory, ...`.
- `node scripts/plan/verify-cites.mjs`: **rc 1**. Last block: `verify:cites FAIL — 10 unresolved in-tree reference(s)`. The 214 advisory lines before it are not gated. The ten unresolved cites are:
  - `governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md`, 7 cites at lines 13 (two), 169 (two), 170, 174 and 175. They cite `kernel/tests/skp_admission.rs` at lines 927, 935-940, 943-948 and 926-931, and `kernel/tests/skp_filter_cancellation.rs` at lines 270, 275-280 and 269-274.
  - `state/consults/2026-10-04-timing-tests-assert-property-not-budget-architect-draft.md:18` cites `skp_admission.rs:941-948`.
  - `state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:64` and `:65` cite `skp_admission.rs:923` and `skp_filter_cancellation.rs:266`.
  - Each says the line exceeds the file's length. The files went from 950 lines at the base to 908 (skp_admission) and from 282 to 252 (skp_filter_cancellation), because C3 removes the wrappers, as the form asks.
  - Cause: these are bare `path:line` cites with no `@ commit` pin. I cannot edit the form (forbidden) or the state/consults files (outside Scope).
  - A way forward is the custodian's call: pin or re-point the ten cites in a records commit, or have the form say these lines are expected to shift. I did not route around it.

**Departures and disclosures**
- The C2 commit message misdescribes the doc comment edits. It mentions `cancel_for_drop`, which was not edited. It cannot be amended, so this is the disclosure.
- I wrote one stray file outside the three allowed locations. It is `da685a21-245c-4f3e-8f40-060e581f487c-c4.log`, the C4 commit's stdout (180 bytes), in the parent of `<S>` and not inside it. Nothing else was written outside the allowed places. I did not delete it.
- Four Edits on `skp_admission.rs` failed once with "File has not been read yet" and were redone after a Read. No test had a retry, sleep or skip added.
- One `Edit` for M7 at C2 failed with the same "not read yet" error on `stream.rs` and was redone after a Read. Each of the three `git checkout -- <files>` reverts I did on mutation edits left the diff empty.
- The M7-at-C2 run restored `engine/tests/slice.rs` from ebdd0fd before applying the mutation, so that it ran the old assertion. I then reverted all three files and `git diff` was empty.
- `cst-suites.sh`'s final echo always reads `script rc=0`. The real exit codes are the ones above, read from the per-step `rc=` lines.

**What is left running:** nothing. A `tasklist` check for cargo, rustc and the three test binaries returned no match, and every hold was released.

**Push:** `git -C C:/dev/wt/cancel-stamp push origin cut/cancel-stamp-order` ran in its own call and succeeded: `4b7655a2..3f3820c9  cut/cancel-stamp-order -> cut/cancel-stamp-order`.

**My model, as the harness reports it:** claude-sonnet-5-5.
