*Custodian's filing note (2026-10-25): the worker's gate 1 doc-comment change on #258, at 4e7029d9, applied from the custodian's pairs file (extracted by script from the architect's gate 1 report, D1). The custodian's check at the head: the new lines occur once and the old line nowhere; the numstat from 7b437be3 is 2 and 1 in the one file, and from dd0b6113 the file totals 129 of 140. No rebase, reset, PR action or force push; nothing written outside the worktree and its own scratch files. The run 18:49:50Z to 18:54:26Z by its transcript (Bash 7, Write 2). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 9073045b1ea438af89f876688dc3131ca2ea201fc49a2d0987b6c030bba406e3.*

---

Applied: #258's gate 1 words at 4e7029d97b2ca0d19b74c083b83228b8d57024c9

- Pairs file sha256 matched 56124843…ecf4b1 (rc=0). The script asserted `old` occurs once and starts at the start of line 5098 (rc=0). At HEAD, `new` occurs once, at line 5098, and `old` occurs 0 times. Line endings are LF throughout; every other byte is unchanged. The doc paragraph was read back whole: "…bytes of OS CSPRNG that only this open returns, and `Catalog::names`, which this test's watch calls, has no product caller, so nothing in the product can name the entry before the open returns."
- One commit, signed with -s, on top of 7b437be3. The message file had `@` only on the first trailer line. In the committed message, `@` is on that Co-Authored-By line, plus the sign-off that -s added.
- `git diff --numstat 7b437be3 HEAD`: kernel/src/skp.rs, 2 insertions and 1 deletion (rc=0). `git diff --numstat dd0b6113...HEAD`: kernel/src/skp.rs only, 129 lines total, within 140 (rc=0).
- `cargo fmt --all -- --check`: rc=0.
- `cargo test -p spatial-kernel --locked --lib ticket_drop_under_lock_regression`, inside a shared hold (granted and released): "test result: ok. 23 passed; 0 failed; 0 ignored; 0 measured; 140 filtered out; finished in 0.63s". The hold shape's final `exit $rc` did not surface the cargo exit code, so I did not see its rc. The result line is the evidence.
- `verify.mjs --offline`, `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs` all returned rc=0 with PASS. Only advisories were printed.
- Pushed with `git push origin cut/kernel-close-during-open-admission` (rc=0). HEAD, origin's tracking ref and `ls-remote` all show 4e7029d9. `git status --porcelain` is empty. No process I started still runs: the cargo process count is 0.
- Model: Sonnet 5.5 (claude-sonnet-5-5).
- Off-scope: none noticed. No PR action was taken.
