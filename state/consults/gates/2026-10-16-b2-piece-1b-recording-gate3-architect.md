Reviewed: PR #222 at 3e63a839d195f96f3d20796ef78133633984d55a (round base d2501969, base 31e25f15) — cut/b2-piece-1b-recording @ 3e63a839d195f96f3d20796ef78133633984d55a
Verdict: PASS WITH NOTES

**Result:** Correctness is closed and Evidence is closed. Four items below are left to the reviewer, because I have no shell. There is one Documentation finding, ND-6, in the worker's own words. It must be fixed before the merge, with no re-gate. Nothing blocks, so no reduction is needed.

## My gate 2 findings, at the head
- **NC-1: met.** protocol/skp/SKP-V0.md:1266 carries my words byte for byte. The clause check from gate 2 still holds, because the round changes none of the checked lines: session_history.rs:187-188, :221 and :284-302, and the tests at kernel/tests/session_history.rs:513-588. The reviewer's C-1 is met by the same sentence.
- **ND-1: met.** SKP-V0.md:1261, the words `against the rules the reader holds`.
- **ND-2: met.** kernel/tests/session_history.rs:238-240, my words. The failing assertion is now at :263.
- **ND-3: met.** kernel/tests/session_history.rs:271-274, my words. The failing assertion is now at :284.
- **ND-4: met.** frontends/shell/e2e/console.mjs:597-599, my sentence byte for byte. The next sentence (:599-601) was only re-wrapped, and its words are unchanged.
- **ND-5:** this is the custodian's PR body, and it is not checkable on the branch. It is still must-fix before the merge, together with deleting the PR body's no-test sentence (R E-1).

## The reviewer's gate 2 findings, at the head
- **E-1: met.**
  - The test is at kernel/tests/session_history.rs:632-686.
  - The comment in `create` at kernel/src/session_history.rs:210-218 replaces the old claim that no test drives the removal.
  - No other text in the worktree still says that no test drives the removal (searched).
- **D-1: met.** kernel/README.md:360 carries the reviewer's words, with fa620916 in place of d2501969, as Amendment 10 item 3 orders. Every pointer it names is unchanged by the round: the constants at session_history.rs:43-45, the test names, limit 43 and the form.
- **N1: met.** session_history.rs:249 is `canonical(&locations)? + "\n"`. It writes the same bytes.
- **N4: met.** MANUAL-WALKTHROUGH.md:685 (clause check below).

## The new test against my addendum, item by item
1. **No `cfg` attribute and no `cfg!` macro:** holds. The only `cfg` in the file is the pre-existing string at :472. §8 item 8 holds.
2. **The run-time check and its doc:** holds. The check is the first statement (:651-653), and the doc says what a non-Windows run proves (:642-643).
3. **The name:** holds. It is the addendum's name, at :650.
4. **Product calls only:** holds. The test uses `StepRecorder::new` (:676) and `record_step` (:677), with the file's existing `host()` and `open()` for setup. It adds no product option, path or `pub` item.
5. **`icacls`'s exit status checked:** holds. `icacls` (:592-604) asserts success and panics when `icacls` cannot run, so a Windows run never passes vacuously. Without the ACE, the `unwrap_err` at :677 fails.
6. **The ACE's scope and principal:** holds.
   - The root is `scratch(..)/store` (:654, :658), and the ACE is on the root only.
   - The principal is `whoami`'s output (:661-664).
   - The rights are exactly `(OI)(CI)(WD)` (:668), with no delete right.
7. **The drop guard:** holds.
   - It is made right after the ACE (:670-674).
   - On drop it runs `/remove:d <user>`, then `/reset /T /C /Q`, then removes the scratch folder (:615-630).
   - It runs on a pass or a panic. It does not panic inside `Drop`.
   - It is dropped after `recorder` (declaration order), so no history handle is open when it runs.
8. **The three assertions, in order:** holds.
   - code: :678;
   - `detail` contains `locations.json`: :679-683, which matches `unwritable(LOCATIONS, ..)` at session_history.rs:249-250, after `create_dir` at :224;
   - the root is empty: :684-685. `records` lists every entry (:116-123), and WD does not deny listing.
9. **The recorded mutation and its observed-at commit:** holds.
   - The doc (:645-648) gives the addendum's mutation and expected failure, and names fa620916.
   - The worker's run failed at `kernel\tests\session_history.rs:680:5: a folder was left`. That line is numbered at fa620916; the assertion sits at :685 at the head.
   - No `verify-mutation` run was used.
   - fa620916 is the round's code head. 3e63a839 cannot name itself, so naming the code commit meets Amendment 10 item 2. This rests on the reviewer's first check below.

## The worker's own words, clause by clause at the head
- **The `create` comment (session_history.rs:210-218):**
  - The removal is driven by the named test, through `StepRecorder::new` and `record_step`: holds. `record_step` reaches `create` (:173), and the removal is :229.
  - The seam is the store root the caller supplies: holds (`StepRecorder::new(root, host)`).
  - The folder inherits the root's ACL; `create_dir` succeeds and the `locations.json` write fails: holds. WD denies adding a file, not adding a folder. The reviewer observed this at d2501969 and the worker at fa620916.
  - The folder must then be gone: holds. That is the test's assertion at :685.
  - The test returns at once on any other OS: holds (:651).
- **The test's doc (tests :632-648):** every clause holds, except one. The words that the test drives only `StepRecorder::new` and `record_step` (:636-637) are untrue as written: the test also drives `SkpHost::new` and `SkpHost::open_dataset` through `host()` and `open()`. This is ND-6.
- **The helpers' docs:**
  - `icacls` (:590-591): holds.
  - `DenyGuard` (:606-608): holds. Removing the scratch folder depends on no open handle in it. The worker observed the folder gone after the passing, mutated and full runs, and `scratch(..)` clears it at the next start in any case.
- **The walkthrough's GROUP' row (MANUAL-WALKTHROUGH.md:685), against console.mjs:**
  - 3 style edits to distinct fill colours: holds. `GROUP_CALLS` = 3 (:277), and the fills are at :716-721.
  - The count rises to exactly 3 above the count before them, found by a bounded poll: holds (:709, :724-730, :738-744).
  - One click then writes exactly one entry: holds (:784-792).
  - That entry is the class-C row for `console.toggleGroupExpanded`, its owner names docs/03, and its statement contains `no API equivalent`: holds.
    - The script asserts class C, the owner and the statement (:823-825).
    - It identifies the row as the toggle's by its cause: the one click between two settled reads. Mutation 2 (:688-691) proves that the click's `recordNamed` is the writer.
    - The approved JSDoc (:679-682) says the same.

## New findings
- **Correctness:** none.
- **Evidence:** none. These are left to the reviewer, because I have no shell:
  1. Recompute that `git diff fa620916 3e63a839 -- '*.rs'` changes comment lines only.
  2. Recompute that `git show fa620916:kernel/tests/session_history.rs` line 680 is the empty-root assertion.
  3. Check that CI at 3e63a839 is green, and that the windows-latest workspace job lists the new test as `ok`.
  4. Check that the commit carrying Amendment 10 precedes fa620916.

### Documentation (must-fix before the merge; no re-gate; not the human's wording)
**ND-6. The test doc says the test drives only the recorder's two calls.**
- **Where:** kernel/tests/session_history.rs:636-637. The words come from my addendum, item 2.
- **Fix:** replace the words `The test drives only `StepRecorder::new` and `record_step`,` with:
```text
The test drives the recorder only through `StepRecorder::new` and `record_step`,
```
- **Clause check:** the recorder's only calls are at :676 and :677. `SkpHost::new` (:62-71) and `open_dataset` (:73-82) act on the host, not on the recorder.

### Out of scope (a note for the custodian)
- console.mjs:277 says `GROUP_CALLS` is the number of identical calls and the expected residential-row count. That has been stale since the re-aim at 7b547f90, the same as R N4. The round neither touched it nor made it untrue.

## §8, the round's lines
1. Pass: no change to the order of checks or to the write. N1 writes the same bytes.
2. Pass: the user name appears only on the test's `icacls` command line. The refusal's detail names `locations.json`, not a user.
3. Pass.
4. Pass: SKP-V0 changes in text only.
5. Pass.
6. Pass: no ADR is among the six files.
7. Pass: the detail states the kernel's fact.
8. Pass: no `cfg`, no resolver and no `LOCALAPPDATA`. The run-time OS check is not a `cfg` (addendum item 1).
9. Pass: no `pub` item, no option, and no test-only path.
10. Pass.
11. Pass.
12. Pass: no timing assertion and no number.
13. Pass:
    - §7 is class 8 (the round adds 108 lines) and is not edited;
    - nothing outside Amendment 10 was added;
    - no `verify-mutation` run is called an observation;
    - the test text names its commit id, fa620916, and pins no hash.
14. Pass: every applied word is byte-equal to its source; there is no ledger cite and no bare self-line.
15. Pass: R D-1.
16. The custodian's.

Relevant files:
- C:/dev/wt/1b/kernel/tests/session_history.rs
- C:/dev/wt/1b/kernel/src/session_history.rs
- C:/dev/wt/1b/protocol/skp/SKP-V0.md
- C:/dev/wt/1b/frontends/shell/e2e/console.mjs
- C:/dev/wt/1b/frontends/shell/MANUAL-WALKTHROUGH.md
- C:/dev/wt/1b/kernel/README.md
