*Custodian's filing note (2026-10-16): the worker-high's report for `b2-piece-1b-recording`'s correction round 2 of 2, the last (Amendment 10), built in C:/dev/wt/1b from d2501969; the head 3e63a839d195f96f3d20796ef78133633984d55a, pushed and checked by the custodian (porcelain empty; local equals origin; two signed-off commits, fa620916 and 3e63a839). The run 2026-10-16T12:22:11Z to 2026-10-16T12:55:52Z by its transcript (Read 5, Bash 53, Edit 5, Write 3, Monitor 1); its one SubagentHandback call, at 12:55:51Z. Extracted by script; 12 rooted path:line cite(s) de-rooted, because they name lines on the branch, each now `line N of <path> (on the branch)` at the head the report names; nothing else changed. The message's sha256 as handed back is 5aaa8c504e2796ec45fdc9ea61222fdd5465f719ccdb579c07b6ecb9f809377a; this file's, from line 5 to the end, is a00de505a498cf34bd53cee4b1a0ff97fec1edce956a7e24f48e8bd2f5e95c79.*

---

REPORT: PR #222 `b2-piece-1b-recording`, correction round 2 of 2 (Amendment 10), worker-high. I applied every item in the brief and changed nothing on the not-yours list.

**Head and commits** (worktree `C:/dev/wt/1b`; started at d2501969 with an empty porcelain)
- New head 3e63a839d195f96f3d20796ef78133633984d55a. It is pushed with an ordinary `git push`, exit 0, and not forced: `d2501969..3e63a839`.
- fa620916ecf48496ba427c631e84ed4485cd5790 is the `fix:` commit: the E-1 test, the `create` comment and N1.
- 3e63a839 is the `docs:` commit: the words, the walkthrough row, and the test doc's observed-at commit.

**Findings, with the place at the new head**
- **R E-1:** `kernel/tests/session_history.rs`.
  - Test: `on_windows_a_record_whose_locations_write_is_denied_is_removed_and_the_root_is_empty` at :650, with the helper `icacls` at :592 and the struct `DenyGuard` at :609.
  - Form: an ordinary `#[test]` with no `cfg` attribute and no `cfg!`. The run-time check `std::env::consts::OS != "windows"` returns at once elsewhere. It drives only `StepRecorder::new` and `record_step`.
  - Setup: the store root is made inside `scratch("record-creation-denied")`. The user comes from `whoami`. `icacls <root> /deny <user>:(OI)(CI)(WD)` runs through `std::process::Command`, and its exit status is asserted.
  - Guard: `DenyGuard` is made right after the ACE. On drop it runs `/remove:d <user>`, then `/reset /T /C /Q` on the root, then removes the scratch folder. It runs on a pass or a panic.
  - Assertions, in the addendum's order: (1) code `skp.session_history_unwritable`; (2) the detail contains `locations.json`; (3) `records(&root)` is empty.
  - The mutation and expected failure are in the doc, as the addendum gives them.
- **R E-1, the comment in `create`:** `line 210-217 of kernel/src/session_history.rs (on the branch)` now names the test and its seam.
- **R N1:** `line 249 of kernel/src/session_history.rs (on the branch)`, `std::fs::write(dir.join(LOCATIONS), canonical(&locations)? + "\n")`. `cargo fmt` put the call on one line. The bytes written do not change.
- **A NC-1:** `line 1266 of protocol/skp/SKP-V0.md (on the branch)` carries the architect's sentence in the architect's words. The reviewer's C-1 was not used.
- **A ND-1:** `line 1261 of protocol/skp/SKP-V0.md (on the branch)`, the step (8) check now reads "against the rules the reader holds".
- **A ND-2:** `line 238-240 of kernel/tests/session_history.rs (on the branch)`, the architect's words.
- **A ND-3:** `line 271-274 of kernel/tests/session_history.rs (on the branch)`, the architect's words.
- **A ND-4:** `line 597-599 of frontends/shell/e2e/console.mjs (on the branch)`, the added sentence is the architect's words.
  - I re-wrapped the next sentence's lines ("The step keeps its purpose ... bounded poll"). Its words are unchanged and only the line breaks moved.
- **R D-1:** `line 360 of kernel/README.md (on the branch)`, the reviewer's words, with fa620916 where they name d2501969.
- **R N4:** `line 685 of frontends/shell/MANUAL-WALKTHROUGH.md (on the branch)`, the GROUP' row. The words are mine and are listed below.
- **Observed-at commit:** `line 647-648 of kernel/tests/session_history.rs (on the branch)` names fa620916.

**Sentences I wrote myself** (verbatim)
1. The `create` comment, `line 210-217 of kernel/src/session_history.rs (on the branch)`:
```
The removal is driven by the test named below, in `kernel/tests/session_history.rs`, through
`StepRecorder::new` and `record_step` alone:

`on_windows_a_record_whose_locations_write_is_denied_is_removed_and_the_root_is_empty`

Its seam is the store root the caller supplies: the record's folder inherits the root's
ACL, so an inheritable deny-write ACE on the root lets the `create_dir` below succeed and
makes the write of `locations.json` fail, and the folder must then be gone. The test
returns at once on any other operating system.
```
2. The test's doc, `line ~630-649 of kernel/tests/session_history.rs (on the branch)`:
```
**E-1 (Amendment 10), the cleanup after a failed record creation.** The caller supplies the
store root and a record's folder inherits the root's access list, so an inheritable deny entry
for the process's own user on the root, with the rights `(OI)(CI)(WD)`, lets the `create_dir` of
the record's folder succeed and refuses the write of `locations.json` inside it. The deny does
not include delete: the product's own `remove_dir_all` is what is under test. The test drives
only `StepRecorder::new` and `record_step`, runs `icacls` through `std::process::Command` with
its exit status checked, and proves, in order: the refusal is `skp.session_history_unwritable`;
its detail names `locations.json`, so the failure came after the folder was made; and the store
root then holds no entry.

On any other operating system the test returns at once, checked at run time, and proves
nothing there. The proof is CI's windows-latest job and a local Windows run.

RECORDED MUTATION: the `.inspect_err(|_| drop(std::fs::remove_dir_all(&dir)))` in `create` is
removed. Expected failure: the store root holds one `unsaved-` folder, and the test fails at
its empty-root assertion. Observed at fa620916: applied alone, the test run by its name failed
at that assertion with a folder left in the store root.
```
3. The docs of the `icacls` helper and of `DenyGuard`:
   - `icacls` helper: "Runs `icacls` with `args` and fails the test unless it exits with success. A machine without `icacls` fails the test that needs it; nothing returns early."
   - `DenyGuard`: "Removes the deny entry from the store root when it is dropped, whether the test passed or panicked, then resets the root's access list and removes the test's scratch folder, so that a failing run leaves nothing a later run or a person cannot delete."
   - Failure messages in the test: "the failure came before the folder was made: {detail}", "a folder was left: {left:?}", "whoami printed no user".
4. The GROUP' row (`MANUAL-WALKTHROUGH.md:685`) has two replacements. The rest of the row is unchanged.
   - Old: "3 identical filter queries yield exactly 3 residential untiled `viewport_query` rows, found by a bounded poll".
   - New: "3 style edits to distinct fill colours bring the count of class-A `style.set` `record_step` rows to exactly 3 above the count before them, found by a bounded poll".
   - Added after "never a synthesized merge (I8);" and before "`UNCLASS'`": "one click on a found group's header then writes exactly one console entry, the class-C row for `console.toggleGroupExpanded`, whose owner names `docs/03` and whose statement contains `no API equivalent`;"
   - These are true of `e2e/console.mjs`'s `stepGroup` at the head: the poll condition at ~:732, the `split run` and `parse` checks, and the toggle checks at ~:780-825.
5. Both commit messages are mine.

**The new test and its mutation**
- On this machine (Windows), run by its exact name at fa620916 unmutated: `1 passed; 0 failed`.
- Mutation:
  - Edit: only `.inspect_err(|_| drop(std::fs::remove_dir_all(&dir)))` was removed from `create`, after a count of exactly 1. The edit and its revert were both checked with `git diff` and `git checkout`.
  - Run: head was fa620916, the test run alone by its exact name.
  - Failure read: `panicked at kernel\tests\session_history.rs:680:5: a folder was left: [...\record-creation-denied\store\unsaved-50783fb1995fbd10be2315c19215c35f]`. Line 680 is the empty-root assertion, so this matches the doc's expected failure.
  - After `git checkout -- kernel/src/session_history.rs`, `git status --porcelain` printed nothing.
  - No `verify-mutation` run was used.

**ACE checks**
- After the passing run, the mutated run, and the full workspace run, `…\spatial-ide-session-history-tests\record-creation-denied` no longer exists. `ls` and `icacls` on it both report the path as not found, so no deny entry remains. The guard removed the folder in each run, including the failing one.

**Commands and exit codes**
- The Bash tool prints a code only for a non-zero exit; the rc lines in this list are read from that. The commands marked held ran inside the shared-hold shape from the brief, and no code from 96 to 99 came back.
- `git fetch origin`: 0. The head was d2501969 and the porcelain empty.
- The new test by name, held: 0 (pass). Mutated, held: 101 (the failure above).
- `cargo test --workspace --locked --features spatial-engine/fixture`, held, in the background: exit 0. 106 `test result` lines, 963 passed, 0 failed, 57 ignored. The new test is listed `ok`.
- `cargo fmt --all --check`: 0.
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`, held: 0. 76 warning lines in the log, none in `kernel/src/session_history.rs` or `kernel/tests/session_history.rs`, so none on an added line. An earlier kernel-only clippy run (unheld) also printed nothing for those two files.
- src-tauri `cargo test --locked`, held: 0 (67 + 2 passed).
- `npm run verify` in `frontends/shell`, held: 0 (the log ends `== 30 passed, 0 failed ==`).
- `node scripts/plan/verify-cites.mjs`: 0 (PASS). `verify-quotes.mjs`: 0 (PASS). `verify-test-claims.mjs`: 0 (PASS). Each was run in the foreground.
- `verify-quotes.mjs --show-cites` over the six changed files: 1, with 35 not-found lines. All are in lines I did not touch (`MANUAL-WALKTHROUGH.md` quotes at :122 to :1433 and `console.mjs` :466 to :517). The plain run passes because it baselines them.
- `git push origin cut/b2-piece-1b-recording`, a separate call: 0.

**§7** by its command, B 31e25f15 to 3e63a839: 4,922 lines over 66 files, against 3,950 over 60. The round before this one was 4,814 at 10173747; this round adds 108.
- Kernel product (`session_history.rs` 1,396, `skp.rs` 55, `dataset_ref.rs` 51, `lib.rs` 14, `audit/log.rs` 2): 1,518 against 950. OVERRUN.
- Kernel tests (`session_history.rs` 686, `no_generation` 117, `session_history_crash` 150): 953 against 700. OVERRUN.
- Amendment 2's own (`record_step_crs.rs` 158 plus 66 for the spans I did not touch): 224 against 220. OVERRUN.
- Shell product: 361 against 320. OVERRUN.
- e2e (`recording.mjs` 407, `console.mjs` 229, `package.json` 1): 637 against 300. OVERRUN.
- Within ceiling:
  - protocol product 286 against 340;
  - the shell's binding 50 against 70;
  - shell tests 392 against 420;
  - records (`kernel/README.md` 24, `MANUAL-WALKTHROUGH.md` 29, `KNOWN-LIMITATIONS.md` 3) 56 against 110.
- `e2e/README.md` (45) sits outside every group.
- Class 8 overruns, recorded here and not fixed.

**Off-scope, not done**
- The notes A N-a, N-b, N-c and R N2, N3, N5, N6 are untouched, as are ADR-022, every app string, and the form, PLAN, queue and PR body.
- I ran no e2e suite.
- The mutation sentence for the new test says "Observed at fa620916" and the `docs:` commit adds that. The test's code is identical in fa620916 and 3e63a839 except for the added doc words and the ND-2 and ND-3 doc edits.

**Final porcelain** in `C:/dev/wt/1b`: empty. HEAD is origin/cut/b2-piece-1b-recording at 3e63a839d195f96f3d20796ef78133633984d55a.

**Self-check:**
- The cross-module test uses only product calls (`StepRecorder::new`, `record_step`).
- Each completion claim above names its test or line.
- No user-facing message was added.
- The test reaches its final assertion: the mutation fails at the empty-root assertion.
- Product caller grep: no new `pub` or option was added.

**Model:** Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it, with no override. I received no context handoff and produced none.
