# Text-id's TEXTID' (d) corrected and its head merged into the C1 branch, under ADV-2026-11-27-31, the worker's report

*Filed by the custodian, 2026-11-27. Phase 1 of the correction under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-31-both-e2e-steps-corrected-before-the-port-textid-d-and-e-r1-no-gate-runs-again-the-readme-section-replaced-whole.md`. It made the correction commit of text-id-opens-for-the-session-by-row-position in D:/wt/textid, from 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e to b7a3dae6b9f5c29262bc7472b1b4f1bd8ca024d2. It then made the merge commit of that head into text-id-reopen-with-a-recorded-declaration in D:/wt/c1rd, from 97019e9198a9a2d110d0d686ce8166574547d4ce to b018f9145cdc313cc827f4c122386edfa552717b. A sonnet worker (worker-high) made both, with no app, dev server or e2e suite started. Its run, from its completion notice only (ADV-2026-11-26-02), was 44 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (6695 bytes, sha256 d53cae522ce590feca31c0a4492687c3e887d23a191a51be01bb5f51b8610122). It is byte for byte except for one span, withheld as personal matter: in its departure 3, the sign-off line's name and email address, which git took from its configuration, are replaced by the marker `<the author's name and address>`. Its account is the worker's.*

---

text-id pushed head: b7a3dae6b9f5c29262bc7472b1b4f1bd8ca024d2. C1 branch pushed head: b018f9145cdc313cc827f4c122386edfa552717b. Every step of this phase completed. No app, e2e suite, cargo or clippy was run. Phase 2 is not started.

COMMITS
- b7a3dae6 on cut/text-id-opens-for-the-session-by-row-position: "test: text-id's TEXTID' (d) opens another file and waits for the close of (a)'s open before its reopen (ADV-2026-11-27-31 item 2)". It was cut on 2df8b4ae, which matched origin and had a clean status first.
- b018f914 on cut/text-id-reopen-with-a-recorded-declaration: "chore: text-id's corrected head merged into text-id-reopen-with-a-recorded-declaration (ADV-2026-11-27-31 item 3, step 1)". It is a --no-ff --signoff merge of origin/cut/text-id-opens-for-the-session-by-row-position (b7a3dae6), and it was clean with no conflict. Its parent is 97019e91, which matched origin and had a clean status first.

THE WAIT FUNCTION (all in frontends/shell/e2e/admission-remediation.mjs, placed after waitForMountReady and before fractionOf)
- Name: `openAnotherAndWaitForClose(page, stepId, path)`, at line 229. A helper `readConsoleRows(page)` and the constant `CLOSE_ROW_TIMEOUT_MS = 30_000` sit just above it.
- The reader copies reopen.mjs's readConsole: it expands the Console and its groups, then reads each `.console-entry`'s header, request text and outcome.
- What it does, in order:
  - It reads the `close_dataset` request texts into `known`.
  - It calls openPath(path) and throws by step name unless the answer is {kind:"admitted"}.
  - It polls with waitForCondition every 250 ms for a `close_dataset` row at outcome `ok` whose request is not in `known`.
- Signal: only that new Console row.
- Bound: 30 s. If the bound passes, the step fails with "<stepId>: no new close_dataset row at ok appeared in the Console within 30000ms of opening <path>, its request not among the N read before the open".
- There is no retry anywhere.
- Console state: it records whether the Console was already expanded. A `finally` collapses it again if the function expanded it, so later steps' canvas checks see the layout they had before. reopen.mjs leaves it open; I did not copy that.
- Phase 2 can call `openAnotherAndWaitForClose(page, "TEXTID-C1 (3)", FIXTURE_NO_ID_COLUMN)` and the same at (4). The caller's own reopen stays outside it.
- The call in (d) is at line 692, inside stepTextid. It comes after the checks that read project.spatial and before the e2eOpenProjectFolder reopen, and it passes FIXTURE_NO_ID_COLUMN. The doc comment (d) is at lines 630-633.
- The reopen is not retried. No assertion of the step was removed or loosened.

NUMSTAT (2df8b4ae..b7a3dae6)
- e2e/README.md: 1 added, 1 deleted. That is clause (d) of the "Row-position spec" section only.
- e2e/admission-remediation.mjs: 70 added, 3 deleted.
- Only those two files changed.

CHECKS AT b7a3dae6
- node --check admission-remediation.mjs: exit 0.
- Shell checks ran in one shared hold, in D:/wt/textid/frontends/shell:
  - npm run typecheck: exit 0.
  - npm test: exit 0. "Test Files 132 passed (132), Tests 1697 passed (1697)".
- Root checks:
  - verify-cites: exit 0. "verify:cites PASS — every rooted (in-tree) path:line reference across 3809 file(s) resolves. (240 loose reference(s) advised above.)"
  - verify-quotes: exit 0. "verify:quotes PASS — 161 checked, 130 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 948 ruling cites resolved, 0 ruling-cite errors."
  - verify-test-claims: exit 0. "verify:test-claims PASS — all 971 claimed test(s) across 300 file(s) exist or are planned, superseded or withdrawn (66 planned, 16 superseded, 17 withdrawn, advisory)."
  - verify (plan): exit 0. "verify:plan PASS — D:\wt\textid\governance\PLAN.yaml agrees with the repository."
  - node --test (scripts/plan, hooks, evidence): exit 0. tests 623, pass 623, fail 0.
- Logs are in D:/wt/textid-logs/fix31-*.
- The git status was clean before the push.
- I made no Rust change and ran no cargo, so the Rust workspace is for the custodian to read from CI.

PART 2 CHECKS (D:/wt/c1rd, at b018f914)
- node --check admission-remediation.mjs: exit 0.
- `git diff --stat 97019e91 HEAD` shows README.md 2 +-, admission-remediation.mjs 73 +++++++++++++++++++++++++-, and "2 files changed, 71 insertions(+), 4 deletions(-)".
- `git diff --stat 2df8b4ae b7a3dae6` shows the same files and the same counts.
- `git log --oneline -3`:
  - b018f914 chore: text-id's corrected head merged into text-id-reopen-with-a-recorded-declaration (ADV-2026-11-27-31 item 3, step 1)
  - b7a3dae6 test: text-id's TEXTID' (d) opens another file and waits for the close of (a)'s open before its reopen (ADV-2026-11-27-31 item 2)
  - 97019e91 docs: text-id-reopen-with-a-recorded-declaration's words under ADV-2026-11-27-30 (row AH8 and its result-log line, and the e2e README's recorded-declaration section)
- Status was clean after the merge.
- I touched no pull request. After the pushes, `git rev-parse origin/<branch>` returned b7a3dae6b9f5c29262bc7472b1b4f1bd8ca024d2 for text-id's branch and b018f9145cdc313cc827f4c122386edfa552717b for the C1 branch.

DEPARTURES AND NOTES
1. Return string of stepTextid: I also edited its pass-note text, so (d) now reads "another file opened and the close of (a)'s open seen, the reopen refused with ...". It is a note, not an assertion, and the ruling and the brief did not name it. Revert it if you want the commit narrower.
2. Doc comment of the helper: it names `TEXTID-C1` (3) and (4) as future callers. Those exist only on the C1 branch, which does not yet call it.
3. Sign-off: `git commit -s` and `git merge --signoff` added "Signed-off-by: <the author's name and address> from git config. I typed no Signed-off-by line, so the email in both commits comes from the config. Both commits end with the Co-Authored-By line as the brief asked, and the Signed-off-by line follows it.
4. Brief vs. main-checkout rule: I read worker.md from D:/wt/textid/.claude/agents/ (same repo, same file) because the brief bars opening the main checkout.
5. Hold slip: the first verify-quotes run was started outside a hold, in the same Bash call as verify-cites. It ran long, roughly 7 minutes, and is a light script. The shell typecheck and test ran inside the shared hold.
6. Disk before the heavy run: C: 41744 MB free and D: 28700 MB free, both above the floors.
7. Untested reading: I could not run the app, so the Console read and collapse in the helper is checked only by `node --check`. It reuses reopen.mjs's selectors, and the wait for the Console's aria-expanded before reading `known` is my own addition.
