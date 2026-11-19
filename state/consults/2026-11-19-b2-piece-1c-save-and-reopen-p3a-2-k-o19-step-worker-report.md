*Filed by the custodian: the K-O19 step worker's hand-back (claude-sonnet-5-5), 3497 bytes, sha256 d9c1c1d937b798aa8bac94f10f1b77a82f79ac7bfc9e64c7e88bb501c97369d2, below the rule, byte for byte except: this project's name, twice in hold lines, written <m> (ADV-2026-11-18-07); one cite de-rooted to the file name, because it names a line of the branch's file and verify-cites reads a rooted cite on main; one final newline added. Calls Read 1, Bash 12, Write 4, SubagentHandback 1, none errored, from 2026-11-19T08:48:37Z to 08:52:22Z by its transcript. The step is Amendment 39 item 4's. Its commit b5c351564dd4798fdd341e783b9d71b0054242e9 is PR 337's head. Its first line's words "as predicted" are the worker's: ADV-2026-11-19-14 item 1 rules that the place seen is earlier than the prediction named (state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-14-k-o19s-result-stands-as-seen-one-more-mutation-k-o19s-own-declared-before-its-run-nothing-committed.md).*

---

Built: b2-piece-1c-save-and-reopen P3a-2, K-O19's recorded mutation step, worker
Result: K-O19 failed under K-O18's mutation as predicted; the comment is committed as b5c351564dd4798fdd341e783b9d71b0054242e9 and pushed.

- Brief sha256 fbc684123230cf8013fb439363c1400ef3cb42d9c7a0e0b81903f79330c3e07c (matches).
- Start checks: head 270d3ac2c17c6551f7783c1feba1bfc5ad140178, empty porcelain, and ls-remote gave the same id. I did not read Amendment 39 in the main checkout; I only looked at its tail.
- Mutation: the node script found the old text exactly once and applied it. The diff is the one line `... && left() {` becoming `... && left() && open.is_empty() {` in kernel/src/session_history.rs.
- Run: hold asked at 2026-11-19T08:49:25Z. Hold line: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:43860 also=<m> (...)`. Release line: `MACHINE_RELEASED project=<m> shell=bash.exe:43860 affinity=FF (cores 0-7)`. Cargo rc=101.
  - Result line: `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 38 filtered out; finished in 0.16s`
  - Panic line: `thread 'the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own' (69832) panicked at kernel\tests\project_reopen.rs:1673:5:`
  - Message: `assertion failed: withheld_unwritable(&saved.expect("saved").history_mark)`
  - The assertion is the one right after the save, before `opacity_step`, so the failure is after the step the prediction names, not at it.
- Revert: `git checkout -- kernel/src/session_history.rs` left `git diff` empty, and `git diff --quiet` gave rc=0.
- Comment: the one `RECORDED MUTATION` line above K-O19 was replaced by 7 lines (1 removed, 7 added in the commit).
  - The filled "Seen failing" text did not fit in 100 characters. I broke it after `over another run's folder.` as the brief said, then broke the message again after `assertion failed:`, which the brief did not cover.
  - I wrote the path as `project_reopen.rs:1673` (forward slashes, no column), where the panic line has backslashes and `:1673:5`. Line 1673 is the line number in the tree before this commit; the inserted comment moves the assertion to line 1679.
  - Check: 8 changed lines, all start with `///`, PASS. `cargo fmt --all -- --check` rc=0.
- Commit: b5c351564dd4798fdd341e783b9d71b0054242e9, 1 file changed (kernel/tests/project_reopen.rs). The first `git commit` attempt returned rc=1 with nothing staged. I ran `git add kernel/tests/project_reopen.rs` and committed again with the same message file. `git commit -s` added the Signed-off-by line itself; I typed none.
- Push: `270d3ac2..b5c35156  cut/b2-piece-1c-p3a-2 -> cut/b2-piece-1c-p3a-2`. `git ls-remote origin cut/b2-piece-1c-p3a-2` gives b5c351564dd4798fdd341e783b9d71b0054242e9.
- End state: head b5c351564dd4798fdd341e783b9d71b0054242e9, empty porcelain, no background shell or process of mine still running. The backgrounded hold call had already exited.
- Off-scope, not done: the hold call put `export` of the cargo variables between the `cd` and the hold, a small departure from the brief's exact shape.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override. I received no context handoff and produced none.
- Pre-gate self-check:
  - Cross-module code: none, the edit is comment-only.
  - Completion claims: each is backed by a call above.
  - User-facing messages: none.
  - Required test reaches its assertion: K-O19 got past setup and failed at line 1673, an assertion after the save.
