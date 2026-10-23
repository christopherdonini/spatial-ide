*Custodian's filing note (2026-10-23): #247's gate 1 words, entries 1 and 2 of the architect's reconciled set, applied by a worker at 1b529f49 with no re-gate. The run 13:39:52Z to 13:48:14Z by its transcript (Bash 8); its claims were read against that transcript's calls before filing: one commit and one push, origin's branch equal to the head, the porcelain empty, no force push, rebase or PR call, only `scripts/plan/verify-cites.mjs` changed since the head both gates read (10 lines in, 10 out), its writes only its own scratch files. Section 7 stays 60, 106 and 166. The custodian then updated the PR body with entries 3 and 4 and appended the form's Amendment 3 from entry 5. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 82d65701b255067d1039e4196eec231235c2d1d07935c83d6de0259d7607e01a.*

---

Applied: #247 gate 1 words at 1b529f497153519c139f34e8029ccdc752f9fdd0

Commit: "docs(plan): verify-cites-pin-resolution-and-line-zero, gate 1 words: the header's line-0 and pin-limit sentences". It is signed off and ends with the two trailer lines. Only scripts/plan/verify-cites.mjs is staged.

Method: a script read the reconciled set from main at 835bf90b, via git show. For each of entries 1 and 2 it took the first ~~~ block after "Target:" and the first after "Final words:". It matched consecutive lines in the file and spliced the final words in. Nothing was retyped.

Once-before and once-after checks:
- Entry 1: the target (6 lines) occurred once, at line 14. The final words (6 lines) occurred 0 times before. After the edit the final words occur once, at line 14, and the target 0 times.
- Entry 2: the target (4 lines) occurred once, at line 64. The final words (4 lines) occurred 0 times before. After the edit the final words occur once, at line 64, and the target 0 times.
- The file has 433 lines by wc -l before and after. The files use LF endings.

Diff 7a23dbad..HEAD: 1 file, 10 insertions and 10 deletions. All of it is comment lines in the header, at the hunks starting at lines 11 and 61. It touches no code, test or string.

Checks at my head, each with its exit code:
- `git diff --numstat e408606d...HEAD -- scripts/plan/verify-cites.mjs scripts/plan/verify-cites.test.mjs`: rc=0. It shows verify-cites.mjs +37/-23 (60 changed lines) and verify-cites.test.mjs +104/-2 (106 changed lines). That is 166 together, against the form's §7 limits of 60, 150 and 210. Nothing was changed to bring any figure down. If §7's 60 counts added lines only, verify-cites.mjs reads 37; if it counts added plus deleted, it reads 60.
- `node --check scripts/plan/verify-cites.mjs`: rc=0.
- `node --test scripts/plan/verify-cites.test.mjs`: rc=0, 32 tests.
- The scripts suite, run inside a shared hold and released: rc=0, last lines "ℹ tests 549 … ℹ pass 549 … ℹ fail 0". No guardian parity failure appeared, so no single-file rerun was needed.
- `verify-cites.mjs`: rc=0. Last line: "verify:cites PASS — every rooted (in-tree) path:line reference across 2261 file(s) resolves. (108 loose reference(s) advised above.)"
- `verify-quotes.mjs`: rc=0. Last line: "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 843 ruling cites resolved, 0 ruling-cite errors."
- `verify-test-claims.mjs`: rc=0. Last line: "verify:test-claims PASS — all 632 claimed test(s) across 193 file(s) exist or are planned, superseded or withdrawn (48 planned, 9 superseded, 17 withdrawn, advisory)."
- `verify.mjs`: rc=0. Last line: "verify:plan PASS — C:\dev\wt\vcpin\PLAN.yaml agrees with the repository."

Push: the push returned rc=0. `git rev-parse HEAD` and `origin/cut/verify-cites-pin-resolution-and-line-zero` both give 1b529f49…, and `git ls-remote origin refs/heads/cut/verify-cites-pin-resolution-and-line-zero` shows the same id. `git status --porcelain` printed nothing. No PR action was taken.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

Off-scope: none noticed. My scratch files, all named vcpin-w1-*, are in the scratchpad folder.
