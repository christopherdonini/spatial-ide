Built: b2-piece-1c-save-and-reopen P2, worker-high (the custodian's filing note, 2026-11-18: the worker-high, model claude-opus-5-5, its run 2026-11-16T07:26:36Z to 08:42:05Z by its transcript, Read 30, Bash 55, Grep 4, Write 9, Edit 10, sixteen errored; 7064 bytes, sha256 4613fb5d160e2725a66cfdf96ede639d4153cb0dcfadd293f094e465ae258357; below byte for byte, with the scratch folder written as <S> in 1 place, with this note and one final newline)

P2 (the lineage reader) is built and pushed. The focused suites pass, and all nine mutations failed their tests. Both files are over their item 4 ceilings: that is class 8, recorded here and not trimmed. L1 has one assertion that item 5 does not list (below). There was no stop.

**Commits** on `cut/b2-piece-1c-p2`, base e567072f8f15d53fa65cc55842e2e15a071da30a:
- 3db8730111e0c5c041cd7425825a51a1a3ecabc1 `test: the lineage reader's eight tests, L1 to L4 and K-L5 to K-L8, before its code` (pushed on its own)
- eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb `feat: the lineage reader, session_history::read_lineage, a producer ahead of P3a`
- Pushed head: eeebe097, equal to origin. Porcelain is empty. No PR opened.

**P-base** at 3db87301 (hold 08:03:49Z to 08:17:08Z):
- The four-target command: rc=101. Predicted a compile failure for all eight new tests; observed `error[E0432]: unresolved imports ... read_lineage, FolderLineage, LineageRead, LineageRefused, PreviousLineage`. So L1 to L4 and K-L5 to K-L7 did not compile. K-L8 also did not run (same target); it is exempt by name.
- The three existing targets alone: rc=0. session_history 13 passed, session_history_crash 1, record_step_match 2.
- `--lib session_history`: rc=0, 11 passed.

**P-head** at eeebe097:
- The four-target command: rc=0. project_reopen 8 passed, 0 failed. record_step_match 2, session_history 13, session_history_crash 1.
- `--lib session_history`: rc=0, 11 passed.
- `cargo fmt --check`: rc=0.

**Mutations**, all observed at eeebe097 by `1cp2-mutations.mjs` in one hold. Each failed its own test (cargo rc=101, `... FAILED`), and `git diff --quiet` gave rc=0 after each revert and at the end.
- **L1:** the `is_member(&lines[..n])` guard dropped from arm 1. L1 failed at the control's assertion.
- **L2:** `&lines[..n]` changed to `&lines[..]`. L2 failed.
- **L3:** arm 2's `Used` arm deleted. L3 failed.
- **L4a:** arm 3 returns `lineage_file(folder_file)`. L4 failed at its first assertion.
- **L4b:** a not-kept member's fact always `Absent`. L4 failed at its `NotRead` assertion.
- **K-L5:** the `over` check made `|_| false`. K-L5 failed: it observed `Damaged{line 5, torn}`, not `OverBound`.
- **K-L6:** a Damaged line breaks the loop instead of refusing the file. K-L6 failed.
- **K-L7:** the mark arm returns `Ok(())`. K-L7 failed at its `panic!` arm.
- **K-L8:** `read_line` also accepts a lineage header and a withheld line. K-L8 failed.

**Counts**, by §2.11's command with B=e567072f and H=eeebe097. These are numstat's added and deleted lines; I compared the added lines with the ceilings.

| Group | File | Added | Deleted | Ceiling | Result |
|---|---|---|---|---|---|
| kernel product | `session_history.rs` | 340 | 16 | 260 | over by 80 |
| kernel tests | `project_reopen.rs` | 397 | 0 | 330 | over by 67 |

- That is 2 files and 737 added lines against 590.
- The lock-file check (`git diff --quiet ... -- Cargo.lock frontends/shell/src-tauri/Cargo.lock`) gives rc=0.

**Item 6's `pub` items.** Each doc comment names the consumer: P3a's `Projects::open_project`, step 6. `read_lineage` and `LineageRead` also say "A producer ahead of its consumer, pre-committed (ADV-2026-11-16-10 R2; the 1c form's Amendment 31 item 6)". `FolderLineage`, `PreviousLineage` and `LineageRefused` cite Amendment 31 item 6. No other `pub` item was added. The caller grep finds them only in `kernel/tests/project_reopen.rs`; there is no product caller, which is expected for a pre-committed producer.

**Holds.** The status reads before and after each hold:
- 07:35 status: no project hold (quiet=False, average=19.5%, peaks-over-25=7). Hold: the re-read inside the hold showed 2 project holds (average=24.6%, peaks-over-25=10), so it exited 95 and released without running. I waited from 07:43 until clear at 07:52:56Z, then 120 s more.
- 07:56:25Z status: no project hold (average=24.3%, peaks-over-25=22). The re-read inside the hold again showed 2 (average=32.7%, peaks-over-25=30), so it exited 95 and released. Clear at 07:59:11Z, then 120 s more.
- 08:02:34Z status: no project hold (average=25.6%, peaks-over-25=21). The re-read inside the hold showed 1 (average=32.2%, peaks-over-25=51). The base run went ahead.
- 08:20:53Z status: no project hold (average=22.2%, peaks-over-25=13). Re-read showed 1 (average=18.1%, peaks-over-25=7). The head run went ahead.
- 08:25:12Z status: a project hold was present, so I yielded. Clear at 08:32:35Z, then 120 s more. 08:35:52Z status: no project hold (average=26.5%, peaks-over-25=28). Re-read showed 1 (average=28.7%, peaks-over-25=39). The mutations ran.
- quiet=False in every read. The hold and release lines' `also`, `project` and `what` values were all `<m>`; no MACHINE_WAITING or MACHINE_ERROR line appeared.

**Departures, additions and what I did not do:**
- **L1's control assertion:** a member with the same `steps` but another save's sha256 reads as `NotTheRecordedOne`. Item 5's Asserts column for L1 has only the positive case, which cannot fail when the hash comparison is removed. The commit message says so.
- **L4's extra case:** a not-kept member with no folder file gives `Absent`, as item 3 states.
- **Error encoding:**
  - An I/O error other than not-found is `Damaged{line: 0, rule}`, following `recover`'s line-0 convention. No third variant was added.
  - `OverBound` names its bound as `{line: Option<usize>, limit}`, where `None` means the file's own bound.
- **Not-kept member:** the folder file's presence is checked with `symlink_metadata`. The file is never opened for reading.
- **Hashing** uses `spatial_renderer::canonical::sha256_hex`, which this file already used (§8 item 14).
- The test files are named `folder.jsonl` and `previous.jsonl`, because the real names are P3a's.
- I did not run clippy (CI's). I touched no file outside the two named.
- One stray Bash call was blocked by the harness (a bare `sleep`). I re-ran it as a bounded background loop; it was not a Guardian refusal. Several calls got the classifier's "no verdict (transient)" response and went through on retry.
- No background shell or process of mine is still running, and no cargo process is left.
- Run logs are under `<S>/` with names starting `1cp2-`.

**Pre-gate self-check:**
- **Cross-module:** the code uses `project::file::Lineage` as it is in `kernel/src/project/file.rs:72-78` @ e567072f and `sha256_hex` as it is in `renderer/src/canonical.rs:163-168`.
- **Completion claims:** each claim above points to a run log or the mutation summary.
- **Messages:** the `Display` texts state engine facts only.
- **Assertions reached:** each mutation's failure is at the test's own assertion (lines 160, 183, 212, 229, 247, 269, 306, 354 and 382 of the test file at 3db87301), not at its setup.
- **Model:** Opus 5.5 (claude-opus-5-5), the worker-high variant. No model override and no context handoff.
- `verify-quotes --show-cites` on both files: PASS.
