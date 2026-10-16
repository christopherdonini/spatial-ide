*Custodian's filing note (2026-10-16): the worker's report for `b2-piece-1b-recording`'s Amendment 11 (the last words from gate 3: the architect's ND-6 and ND-7, the reviewer's N-1), in C:/dev/wt/1b from 3e63a839; the head a542097e2017751fef164912431847ae6292c35d, pushed and checked by the custodian (porcelain empty; local equals origin; the diff two files, seven lines in, six out, the three places only). The run 2026-10-16T13:42:02Z to 2026-10-16T13:49:10Z by its transcript (Read 3, Bash 9, Edit 3, Grep 1, Write 1); its one SubagentHandback call, at 13:47:07Z. Seen by the custodian, three deviations from the brief: the test run was piped through `tail`, with its exit code read from PIPESTATUS, as the report says; the verify scripts' output went to files in the system temp folder, not the scratch folder or `target/`; and a read-only `find` the worker started in the background, a search for the test's scratch folder, was still running when it handed back; its transcript's last note, at 13:49:10Z, says that job ended with exit code 0, and no folder or process of it remains. Extracted by script; 0 rooted path:line cite(s) de-rooted, each now `line N of <path> (on the branch)`; nothing else changed. The message's sha256 as handed back is 71a348166d5bae911c841147158e5d33534cdd1cd4943d3bf14d5c445408e60e; this file's, from line 5 to the end, is 71a348166d5bae911c841147158e5d33534cdd1cd4943d3bf14d5c445408e60e.*

---

Amendment 11's three wording changes are committed and pushed. New head a542097e2017751fef164912431847ae6292c35d, `docs: b2-piece-1b-recording Amendment 11, three wording changes from gate 3 (ND-6, ND-7, N-1)`, signed off, on `cut/b2-piece-1b-recording`. The branch was at 3e63a839 with an empty porcelain beforehand. I ran no e2e suite.

**The three places as they now read** (the committed diff is below):
1. **ND-6**, `kernel/tests/session_history.rs` lines 636-640. I re-wrapped the paragraph within 100 columns. It now says: `/// not include delete: the product's own `remove_dir_all` is what is under test. The test drives` / `/// the recorder only through `StepRecorder::new` and `record_step`, runs `icacls` through` / `/// `std::process::Command` with its exit status checked, and proves, in order: the refusal is` / `/// `skp.session_history_unwritable`; its detail names `locations.json`, so the failure came after` / `/// the folder was made; and the store root then holds no entry.`
2. **ND-7**, `frontends/shell/e2e/console.mjs` lines 277-278. I put the comment on its own line above the code:
   `// the number of style edits GROUP' makes, each to a distinct fill colour, and the number of `style.set` `record_step` rows it expects above its baseline; at most 3, the fills `stepGroup` lists (re-aimed by kernel/B2-1B-RECORDING-PREREGISTRATION.md Amendment 6)`
   `const GROUP_CALLS = 3;`
3. **N-1**, `session_history.rs` line 682: `        "the refusal did not name locations.json: {detail}"`

**Commands and exit codes**
- `git fetch origin`: 0. HEAD was 3e63a839, branch `cut/b2-piece-1b-recording`, porcelain empty.
- `CARGO_TARGET_DIR=D:/wt-targets/1b cargo test -p spatial-kernel --locked --test session_history -- --exact on_windows_a_record_whose_locations_write_is_denied_is_removed_and_the_root_is_empty`: 0, 1 passed. I piped it through `tail` and took the exit code from PIPESTATUS.
- Afterwards `record-creation-denied` was gone: the folder is under `%TEMP%\spatial-ide-session-history-tests`, and `ls -d` there returned 2, no such file.
- `cargo fmt --all --check`: 0.
- `node --check frontends/shell/e2e/console.mjs`: 0.
- `node scripts/plan/verify-cites.mjs`: 0, PASS. It advises 38 loose references; none is in my files.
- `node scripts/plan/verify-quotes.mjs`: 0, PASS. 121 checked, 90 verified.
- `node scripts/plan/verify-test-claims.mjs`: 0, PASS. 563 claimed tests exist or are planned, superseded or withdrawn.
- `git diff 3e63a839..HEAD`: 2 files changed, 7 insertions, 6 deletions. The diff matches the three places above and nothing else.
- `git push origin cut/b2-piece-1b-recording`: 0. It was an ordinary update, 3e63a839..a542097e, not forced.

For the verify scripts I redirected output to files in `%TEMP%` and read the tails, so I did not pipe them.

**Final state:** `git status --porcelain` in `C:/dev/wt/1b` is empty. The pre-gate four classes are unchanged by this wording-only commit: no cross-module code was touched, and no new completion claim, user-facing message or required test was added. The N-1 message now matches what its assertion checks.

**Model:** claude-sonnet-5-5, as the harness reports it. No override and no context handoff.
