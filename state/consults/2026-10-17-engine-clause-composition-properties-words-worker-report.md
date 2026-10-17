*Custodian's filing note (2026-10-17): the words worker's report for `engine-clause-composition-properties` (gate 1's words, the architect's D1 to D3, no re-gate), in C:/dev/wt/ccp from 93f2b927; the head 61b2e23170f0412c7d5404b4bb022b30ff03e836, pushed. The worker's script stopped at its last assertion after writing (its report says so), so the custodian checked the commit by script: each of the two files at the head equals its text at 93f2b927 with the architect's three blocks spliced in, byte for byte; no other file changed; the count against e555177c is 172 and 0 in the campaign file and 2 and 2 in engine/README.md. The run 2026-10-17T08:33:20Z to 2026-10-17T08:38:50Z by its transcript (Bash 8, Write 2); its one SubagentHandback call, at 08:38:49Z. Extracted by script; 0 rooted path:line cite(s) de-rooted; one final newline added; nothing else changed. The message's sha256 as handed back is f70c74ca74fdd83ec25e1f7128f5fd3e8efa2a71d8b2d21b073768aff5c574a9; this file's, from line 5 to the end, is f70c74ca74fdd83ec25e1f7128f5fd3e8efa2a71d8b2d21b073768aff5c574a9.*

---

Gate 1's Documentation words (the architect's D1 to D3) are applied to PR #224 and pushed. The new test, fmt and all four verify scripts pass.

**Head and commit:** the head before was 93f2b927d0dcfd64abd0a608e6dfaf1335493455, and `git fetch origin` exited 0. The commit is 61b2e23170f0412c7d5404b4bb022b30ff03e836, a `docs:` commit made with `-s -F`. The push was an ordinary update (93f2b927..61b2e231) and exited 0. Final porcelain is empty.

**Script:** `ccpw-apply.mjs` in my scratch folder, standard library only, run once. It read the architect's report and took its fenced blocks. It checked the old spans by hash, replaced the lower span in the campaign file first, and wrote the edits.
- **Defect in the script:** its closing `git status` assertion failed with a false negative (exit 1). The assertion's `trim()` stripped the leading space of the first porcelain line. The edits were already written by then. I checked afterwards by hand that porcelain named only the two files, and `file` reported no CR.
- **Gap against the brief:** I did not rerun the script, so it never completed its status assertion or the line-by-line equality assertion. The old-span hashes did verify. The line-by-line equality holds only by construction: the splice and write in the script, plus the numstat results below.

**Block hashes as the script read them, all matching the brief:**
- D1 had 7 lines: 24fdf6dabcd3949c748070f3fab3e2dea5f4b6c816f00d35b7182a9a7909d718
- D2 had 3 lines: 35830037e8d21f3bab9bcafa9cbcb1180a8fb8ae4637a480383246cb311ea4b8
- D3 had 1 line: 1b637c30bc755c3356b64ece9132040c5e25d3040d68883e0a2f730fcbbb6b57

All three old spans' hashes matched at the head.

**Numstat:**
- **Against the head, before the commit** (printed, not asserted): `engine/README.md` 1 in and 1 out; `engine/tests/admission_property_campaign.rs` 9 in and 6 out.
- **`git diff --numstat e555177c...HEAD`, after the commit:** the campaign file 172 in and 0 out; `engine/README.md` 2 in and 2 out. That is 176 in, matching the brief.

**Commands and exit codes:**
- `cargo fmt --all -- --check` exited 0.
- The exact-name cargo test ran in a shared hold and passed (1 passed). Its release line printed `MACHINE_RELEASED`. The pipeline's exit was not printed separately.
- The four verify scripts first ran piped through `tail`, only to read their output. I reran each in the foreground with its exit code captured and nothing piped: `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify-mutation.mjs` all exited 0. `verify-mutation` named the new test as having a recorded mutation.
- I ran no `verify-mutation` mutation observation; the tool checks that one is recorded.
- The script run and `git push` exited 0, apart from the `git status` assertion above.

**Differences from the brief:**
- The brief asked for each verify command with a timeout of at least 300 s. I used the Bash tool's 600 s timeout.
- The first verify pass was piped, as noted above.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`), as the harness reports it. No override and no context handoff.

**Pre-gate classes:** this change is words only, with no cross-module seam and no new user-facing message. The one required test reached its assertion and passed.
