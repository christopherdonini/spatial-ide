*Custodian's filing note (2026-10-08): `data-plane-crowded-start-detail-spaces`'s fix worker report, for PR #189's gate-1 reviewer D3, at the branch head 425dece2a9a16a05696c2ce6e1ce8348733fed6a (worker run 03:55:00Z to 03:56:29Z by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is bb246e38a7b472ffc4bb0b4a7128ad3187c6cf56fc0275d280070260330e276a. The custodian checked the fix against its finding by the diff 9867fa9f..425dece2 (one file, 4 lines added and 2 removed, comment only). Paths and lines below are at the branch head, not main.*

---

D3 is fixed in one commit and pushed to origin as an ordinary update.

Commit: 425dece2a9a16a05696c2ce6e1ce8348733fed6a, "docs: T1's comment names every release of an idle permit (PR #189 gate-1 reviewer D3)", signed off. The push was 9867fa9f..425dece2 (exit 0), and `git status --porcelain` is clean.

Diff: only `protocol/data-plane/tests/candidate_a.rs`, at the hunk starting line 846. The three comment lines became your five, with the four-space indent, and the `CROWDED_START_TIMEOUT` line is unchanged. The commit is 4 insertions and 2 deletions.

The three releases as I read them in `handle` in `protocol/data-plane/src/server.rs`; all three are real:
1. **START read OK:** `drop(idle_permit)` at line 481.
2. **Own timeout:** the `Err(_)` timeout arm (lines 457-476) sends the terminal, then `return`s, so the permit drops with the function. The permit is held until after `terminal_and_drain`, so the release is at the timeout, not before the terminal.
3. **`handle` returns early:** either `Ok(Ok(None))` at line 443 (the peer left before START), or `Ok(Err(detail))` at lines 444-456 (a START it cannot parse, which sends a terminal first).

Checks:
- The T1 test run on `candidate_a`, with `--exact`, exits 0: 1 passed, 16 filtered out, 5.01s. It was an incremental build of 8.84s, with no dependency-tree recompile.
- `cargo fmt --all -- --check` exits 0.
- §7 numstat against e888787e: `server.rs` 4/1 and `candidate_a.rs` 42/0. That is 47 total against the ceilings of 8 and 60 (68 total). `candidate_a.rs` is at 42 against 60.
  - The numstat command's exit code was masked by the trailing `echo`. The command printed its numbers, so it ran.

Model: Sonnet 5.5 (claude-sonnet-5-5). I received no context handoff and produced none. I touched nothing outside the worktree, `D:/wt-targets/dpcs` and the scratch folder, where I wrote the commit message as `d3-msg.txt`.
