*The build worker's report for the node verify-offline-note-test-flake (the five-line form `governance/forms/scripts/VERIFY-OFFLINE-NOTE-TEST-MESSAGE-PREREGISTRATION.md`), in C:/dev/wt/vont from 166ef0671a2b18069765de36b16c1ca3275f6f7e, PR 354 (draft), filed by the custodian below the rule from its hand-back in its transcript, 3345 bytes, sha256 a67adf0ef9ffc9f5a12b0e2b6f1744c69a3897314600fc84e8c12c1531fa537b, byte for byte but for one mask: the profile path in the five temporary-folder paths the M1 message prints, written there with doubled backslashes, is written as <u> (5 places). Its run: Read 2, Bash 8, Edit 2, Write 1, SubagentHandback 1, by unique call ids, 1 call errored (an Edit refused before its Read, redone), model claude-sonnet-5-5, from 2026-11-22T13:10:36Z to 2026-11-22T13:13:12Z by its transcript; no call named the main checkout; no compaction.*

---

Built: the offline-note test's messages at c3bd9798de2933c51811cb90df240c04da009361
Result: both assertions now print what they saw. M1 turned the test red with the folder paths in the message, and every other run is green.

Start: the worktree HEAD was 166ef0671a2b18069765de36b16c1ca3275f6f7e and `git status --porcelain` was empty.
Baseline: `node --test scripts/plan/verify.test.mjs` gave 24 tests, 24 pass, 0 fail, rc=0 (vont-base.log).
C: c3bd9798, "test: verify.test.mjs: the offline-note test's two assertions say what they saw". The file run after C gave 24/24, rc=0 (vont-c.log).
Push: new branch `cut/verify-offline-note-message` -> `cut/verify-offline-note-message`, rc=0.

M1 (not committed): one anchored `sed` changed the prefix to `'verify-offline-note-pr-'`; the guard checked the anchor occurs exactly once. The file run gave 24 tests, 23 pass, 1 fail, rc=1 (vont-m1.log). The failing test is the form's, at verify.test.mjs:267, failing at the second assertion (line 273). Its message, byte for byte from the log:
AssertionError [ERR_ASSERTION]: failures containing pr: ["queue drift: <u>\\AppData\\Local\\Temp\\verify-offline-note-pr-RFYHgQ\\CUSTODIAN-QUEUE.md does not exist","queue drift: <u>\\AppData\\Local\\Temp\\verify-offline-note-pr-RFYHgQ\\CUSTODIAN-QUEUE.json does not exist","site drift: <u>\\AppData\\Local\\Temp\\verify-offline-note-pr-RFYHgQ\\site\\index.html does not exist","site drift: <u>\\AppData\\Local\\Temp\\verify-offline-note-pr-RFYHgQ\\site\\data\\plan.json does not exist","site drift: <u>\\AppData\\Local\\Temp\\verify-offline-note-pr-RFYHgQ\\site\\.nojekyll does not exist"]

Restore: `git checkout -- scripts/plan/verify.test.mjs`. `git status --porcelain` was empty. `cmp` against `git show HEAD:scripts/plan/verify.test.mjs` (vont-head.mjs) returned 0. The file run after the restore gave 24/24, rc=0 (vont-after.log).
CI scripts suite, the whole command: 623 tests, 623 pass, 0 fail, rc=0 (vont-ci.log).
Size: `git diff --numstat 166ef067 HEAD` gives `2 2 scripts/plan/verify.test.mjs`. The total is 4 changed lines, within the 12 allowed, over that one file.

Changed lines as committed, from `git show`:
-  assert.ok(result.notes.some((n) => n.includes('--offline')));
-  assert.ok(!result.failures.some((f) => f.includes('pr')));
+  assert.ok(result.notes.some((n) => n.includes('--offline')), `notes runVerify returned: ${JSON.stringify(result.notes)}`);
+  assert.ok(!result.failures.some((f) => f.includes('pr')), `failures containing pr: ${JSON.stringify(result.failures.filter((f) => f.includes('pr')))}`);

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. No background process is running. Logs are in the scratchpad folder, under the `vont-` names above. I opened no PR and ran no fetch, merge or other command the brief bans.

Pre-gate self-check:
- Cross-module seams: none. It is a test file only, and the `runVerify` return shape (`notes`, `failures`) was read at verify.mjs:294-327.
- Completion claims: each rests on a log named above.
- User-facing messages: only test assertion messages, and they describe behaviour implemented at this commit.
- Required tests: M1 reached the second assertion and printed its message.
- Caller grep: no new `pub` item, option or code path.
