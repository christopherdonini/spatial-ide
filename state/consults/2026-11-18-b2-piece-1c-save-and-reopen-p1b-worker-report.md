Built: b2-piece-1c-save-and-reopen P1b, worker-high. I ran as Opus 5.5 (ADV-2026-11-16-06 item 5), with no model override. One context handoff happened mid-task (a compaction summary); the transcript is agent-ae0082e5cecc72ae5.jsonl. (the custodian's filing note, 2026-11-18: the worker-high, model claude-opus-5-5, its run 2026-11-16T06:52:54Z to 08:33:41Z by its transcript, Read 25, Bash 143, Write 11, Edit 14, Grep 4, eight errored; 6706 bytes, sha256 87837b655d051cc157a71cbb88971d2a3cc9d8d4c454e36faeb30ac0bd5c2d1d; below byte for byte, with the scratch folder written as <S> in 1 place, with this note and one final newline)

1. **Commits** on `cut/b2-piece-1c-p1b`, base bdc72f5fc78734d90f2b1979f3cc4cdc399a6a6f:
   - a374590c22466f5c1f4ddc4e0312da4efa5076e0 test: piece 1c step 2 P1b's tests T6 to T14, before any product code
   - 1284ccda79407319256b68e83f18ffd7b3eac0a9 feat: piece 1c step 2 P1b, the store and the lock, with D-16 and the writers' bounds
   - 1ad509ad69f1be832ef92af43c26cb03ada00a56 fix: T6's reader thread no longer drops a Copy value
   - Pushed head: 1ad509ad (local equals origin). `git status --porcelain` is empty.

2. **P-base** at a374590c: T6 to T14 were each predicted to fail on a missing symbol, and each did.
   - lib: E0599 `commit_with` (T7).
   - project_lock_crash: E0432 `LockRefused`/`ProjectLock`/`OPEN_LOCK` (T6).
   - project_store: E0432 and E0599 on `locations_to_bytes`, `read_locations`, `KnownFoldersFull`, `Location`, `moved_to` and `with_same` (T8, T9, T10, T12, T13).
   - project_save: E0432 `read_locations`/`Location` (T11, T14).
   - Every run exited 101 with no test run.

3. **P-head:** run at 1284ccda (h1) and again at 1ad509ad (h2). Both runs exited 0 each time.
   - h2 summaries: project_lock_crash 1 passed; project_save 19 passed (T11 and T14 among them); project_store 5 passed; lib `project::store` 1 passed, 192 filtered.
   - h2 has 0 warnings. h1 had one `dropping_copy_types` warning in T6, which commit 1ad509ad fixes.
   - `cargo fmt --check` gave rc 0.

4. **Mutations:** all 13 observed at 1ad509ad by `p1b-mutate.mjs`. Each exited 101 with its test FAILED, and each revert showed `git diff --quiet` rc 0 (also rc 0 before the first mutation and at the end).
   - T6a fails on "a second take in this process".
   - T6b fails on "taken after the child's crash: Held".
   - T7 fails on "the save is kept: Unwritable".
   - T8 and T9 fail on assert_eq.
   - T10 fails on "a wrong format: []".
   - T12a, T12b and T13a fail on their over-bound asserts.
   - T11 fails on "an unknown member".
   - T14a fails on "refused: Saved".
   - T14b fails on "no identity folder".
   - **T13b is the exception:** restoring `to_string_lossy` also bypasses the string bound, so the test fails at its 4,097-byte assert before it reaches the not-Unicode case. It fails, but not where that assertion sits.

5. **§2.11 counting command (added/deleted), over B...1ad509ad:**

   | Group | File | Added/deleted | Ceiling |
   |---|---|---|---|
   | Kernel product | store.rs | 277/16 | 300 |
   | Kernel product | mod.rs | 15/27 | 40 (42 counting both columns) |
   | Protocol | SKP-V0.md | 0/1 | — |
   | Protocol | error.rs | 0/4 | — |
   | Kernel tests | project_lock_crash.rs | 102/0 | 130 |
   | Kernel tests | project_store.rs | 166/0 | 140 |
   | Kernel tests | project_save.rs | 71/0 | 90 |

   - Groups: kernel product 335 of 340, protocol 5 of 10, kernel tests 339 of 360. Total 679 lines in 7 files, against 710.
   - **Class 8 for the closing amendment:** `project_store.rs` is over its 140, and `mod.rs` is over its 40 if both columns count. Nothing was trimmed.
   - The lock-file `git diff --quiet` gave rc 0.

6. **Producers:** each has a doc comment in store.rs naming item 6 (d) and its consumer.
   - `OPEN_LOCK` (line 43), and `ProjectLock`/`try_lock`/`LockRefused` (lines 216-217): `open_project` step 3 and a first save (P3a); P3b's lock state; K-O4, K-O5, E-SECOND and E-CRASH-UNLOCK.
   - `with_same` and `KnownFoldersFull` (lines 272 and 355): the `same` arm (P3a); K-O11 and K-O6.
   - `moved_to` (line 374): the move arm (P3a).
   - `Location` and `read_locations` (line 427): the machine-location arm (P3a); K-O3 and K-O10.
   - Caller grep (`locations_to_bytes|read_locations\(|ProjectLock::try_lock|\.with_same\(|\.moved_to\(|commit_with\(` over kernel/src) found only two product callers: mod.rs:294 `store::locations_to_bytes(&uri, &at)` and store.rs:147 `self.commit_with(sync_folder)`. The other matches were the definitions, doc links and the test call. The rest have no product caller yet, as 6 (d) pre-commits.

7. **Holds** (each "line" is a `project=SpatialIDE` line; `<m>` values not copied):

   | Hold | What | Before | In hold | After |
   |---|---|---|---|---|
   | 1, 2, 3 (07:05, 07:13, 07:19Z) | none ran; the re-read exited 95, with 2 lines in hold | — | 2 lines | — |
   | 4 | P-base | 18.1%/7, none | 18.0%/3, 1 line | 20.6%/5, none |
   | 5 | h1 | 20.6%/5 | 26.3%/28, 1 line | 21.7%/11, none |
   | 6 | h2 | 21.7%/11 | 23.2%/19, 1 line | 81.5%/60, 3 lines |
   | 7 | mutations | 19.3%/6, none (after waiting until clear at 08:18:48Z, then 120 s) | 23.5%/14, 1 line | 28.8%/39, none |

   - quiet=False on every reading.
   - No exit code 96 to 99. All my background tasks have finished, and no process I started is still running.

8. **Departures and stops:**
   - (a) mod.rs line 36's import was reduced to `sha256_hex`, because only `locations_json` used the other two names. I count this as part of that region; the gates may count it as a third region (stop 2).
   - (b) `locations_to_bytes` also refuses a non-absolute path, because its reader refuses one (via `stored_path`).
   - (c) Before holds 2 to 4 I added a random 60-240 s wait. It only waits longer than the rule.
   - (d) The fix commit edits a line of T6 itself, a test of this piece (no assertion changes), after P-base.
   - (e) One `git fetch` of my branch to confirm the push. That is network use outside the brief's list.
   - (f) `commit_with` takes `impl Fn`.
   - No other stops.
   - E-SAVE was not run, and there was no workspace-wide test run.

Self-check of the four failure classes:
- The cross-module calls use the interfaces that actually exist: `canonical::{to_canonical_string, Json}` and `strict_json`.
- Each claim above rests on a log in the scratchpad.
- The user-facing change matches this commit: a failed flush no longer refuses a save and goes to stderr as its error kind only.
- Every test reaches its assertions; T13b's case is noted in section 4.

Files are in the worktree C:/dev/wt/1c-p1b:
- kernel/src/project/store.rs
- kernel/src/project/mod.rs
- protocol/skp/src/v0/error.rs
- protocol/skp/SKP-V0.md
- kernel/tests/project_lock_crash.rs
- kernel/tests/project_store.rs
- kernel/tests/project_save.rs

Logs are in the scratchpad, <S>:
- p1b-pbase-*.log
- p1b-phead-h2-*.log
- p1b-mut-summary.txt (10 MB: T12a, T12b, T13a and T13b print their whole documents)
- p1b-count.txt
