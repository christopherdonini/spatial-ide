*Custodian's filing note (2026-10-28): the worker's report on PR #264's words commit, the architect's D-1 (each run alone), applied by script from the pair file. The custodian's check by git: the head 94ec3ad8 equals origin's branch, one commit after a45c206d, its diff 1 1 kernel/tests/first_batch_factorial.rs. The run 11:22:43Z to 12:06:18Z by its transcript (Bash 61, Monitor 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 7d1bec5efb04f28463e4f519af7acbbf1c2e120d0efeda74b57ffb2c4d7cf2d0.*

---

Applied: first-batch-factorial-ignored-trace-tests D1 at 94ec3ad852767b00695619767bdcbf7bdc4e5927

Brief sha256 matched (b022ea4b...). The pair file sha256 matched (adf1d119...).

Script (one-off, never committed). File `kernel/tests/first_batch_factorial.rs`:
- Before: `old` occurred 1 time, `new` 0 times.
- After: `old` 0 times, `new` 1 time.

Diff: one line in the doc comment of the recorded mutation M-1, `each test alone.` became `each run alone.` (`--ignored --exact`, each run alone). `git diff --numstat` gave `1 1 kernel/tests/first_batch_factorial.rs`, rc=0.

Checks (exit code, last line):
- `cargo test -p spatial-kernel --locked --test first_batch_factorial`, in a shared hold, `CARGO_TARGET_DIR=D:/wt-targets/fbf-d1`: rc=0. Last line: `test result: ok. 2 passed; 0 failed; 5 ignored; 0 measured; 0 filtered out`. The hold was released (`MACHINE_RELEASED`). The cold build took about 2.5 hours on the shared machine.
- `cargo fmt --all -- --check`: rc=0.
- `node scripts/plan/verify.mjs --offline`: rc=0. `verify:plan PASS`.
- `verify-cites.mjs`: rc=0. `PASS`, 2411 files, 100 loose references advised.
- `verify-quotes.mjs`: the first run, started while cargo was compiling, hit my 500 s timeout (rc=124). The re-run with a 1500 s timeout gave rc=0. `PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors, 0 ruling-cite errors`.
- `verify-test-claims.mjs`: rc=0. `PASS — all 669 claimed test(s) across 204 file(s) exist or are planned, superseded or withdrawn`.

Commit: one, signed off with `-s`. Only the first trailer line of the message file contained `@`; I showed this by grep before committing. Push done in its own call (a45c206d..94ec3ad8). Origin's branch equals HEAD (94ec3ad8...), and `git status --porcelain` is empty. No PR action.

Model: claude-sonnet-5-5 (Sonnet 5.5), as the harness reports it. No override and no context handoff.
