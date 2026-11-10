*Custodian's filing note (2026-11-03): the gate 1 words on #271 (`adr-020-appended-note`), at de212127, applied by a worker (dispatched 2026-11-03T14:36:52Z by the main transcript, its prompt equal to its brief by script) from the custodian's pair file, the architect's D1 words byte-copied by script from its gate 1 report; admitted by the form's Amendment 1 under the human's ruling of 2026-11-03, item 1; the words are tooling text, not the human's, so no re-gate (AUTONOMY §31). The custodian's check by git: origin's branch is at de212127, one commit on 5ff86b13, scripts/plan/verify-quotes.baseline.json +1/-1; from ae71bd8a, ADR-020 15/0 and the baseline 2/2 (the form's Amendment 2, class 8); the file parses with 201 leaves at both ends, and the one differing leaf, the ADR-020 line-403 entry's reason, equals the words. By its transcript (Bash 9): one commit and its push, in separate calls; no fetch, reset, rebase, amend, force or PR action; no heavy command and no hold; writes only its own scratch files; its two wait loops sleep each turn and stop after 100 turns. Its report says it read the checks' PASS lines but not each exit code: the harness moved its check call to the background, and that call's own output, read by the custodian, prints each exit code as 0 (verify-quotes, the three node suites, verify.mjs --offline, verify-cites, verify-test-claims). The run 14:36:52Z to 14:44:11Z by its transcript. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 3fd6fb705fee00c14e916bc7ed368813cb67d3f8af6d0106824ab829551af979.*

---

Applied: adr-020-appended-note D1 at de21212795012d45930d228d5c742e379485cc08

Pair file sha256 matched (b050aa9f...1419). Script (one-off, not committed), run on file bytes:
- before: `old` occurs 1, `new` occurs 0.
- after: `old` occurs 0, `new` occurs 1.
- The file still parses as JSON. 201 leaves before and after, and the only differing leaf is /entries/2/reason.

Diff: one line in scripts/plan/verify-quotes.baseline.json, the ADR-020 line-403 entry's `reason`. The new text ends "...its bytes are immutable, and the appended ADR-020 Corrigendum on Amendment 1 §(c) carries the source's sentence."

Checks:
- `git diff --numstat ae71bd8a...HEAD` (rc 0) gives `15 0 ADR-020...md` and `2 2 scripts/plan/verify-quotes.baseline.json`. The baseline file is the predicted `2 2`. The ADR-020 file shows 15 insertions, 0 deletions: the branch's earlier appended note, not changed by this commit. I did not diff ADR-020's line 403 itself. This commit touches 1 file, 1 insertion and 1 deletion.
- `verify-quotes.mjs`: last line "verify:quotes PASS — 135 checked, 104 verified, 30 baselined, 1 advisory, 0 baseline entry errors ...". ADR-020:403 is still in the baselined list with the new reason.
- `node --test` on the three suites: 590 tests, pass 590, fail 0.
- `verify.mjs --offline`: PASS, with the PR-merged and release-published checks skipped as offline.
- `verify-cites.mjs`: PASS, 76 loose references advised.
- `verify-test-claims.mjs`: PASS, 701 claimed tests.
- I saw these PASS lines, not each command's own `$?`. The commands ran in one backgrounded Bash call that ended with exit code 0, so the last command (verify-test-claims) returned 0. I did not capture rc per command.

Commit message: `@` appears only on the first trailer line (grep showed line 5). One Signed-off-by (added by `-s`).

Push: origin/cut/adr-020-appended-note is de21212795012d45930d228d5c742e379485cc08, equal to HEAD (5ff86b13..de212127). `git status --porcelain` is empty.

No background process of mine is still running; both background shells exited (exit 0). Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
