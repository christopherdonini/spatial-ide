*The step-B worker's report for the second piece of the node verify-offline-note-test-flake (the five-line form `governance/forms/scripts/VERIFY-OFFLINE-NOTE-TEST-PREDICATE-PREREGISTRATION.md`), its build in C:/dev/wt/vonp from 533c7402275086651c1fd590cd2005eb21cb9dc5 to d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c, PR 355. Filed by the custodian below the rule from its second hand-back in its transcript, 4254 bytes, sha256 d2e5b2696f6e45b72502c6852aee69e86aaeef0d79801135898eaf98af346aeb, byte for byte but for one mask: the system temporary folder's path is written as <TMP> (1 place). Its run, after its first hand-back: Read 1, Bash 12, Write 3, SubagentHandback 1, by unique call ids, no call errored, model claude-sonnet-5-5, from 2026-11-22T14:28:57Z to 2026-11-22T14:32:53Z by its transcript; no call named the main checkout; no compaction. The cause it gives for its first commit's regular expression is corrected by the single gate's D1 (`state/consults/gates/2026-11-22-verify-offline-note-test-predicate-gate-reviewer.md`).*

---

Built: the offline-note test's evidence predicate at d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c (branch tip, pushed)
Result: the change is in and pushed, but as two commits, not one. The first commit's regex lost its backslashes, so I added a fix commit. Neither commit was amended or reset. Squash on merge if one commit is wanted.

Start state: HEAD was 533c7402275086651c1fd590cd2005eb21cb9dc5 and `git status --porcelain` was empty. Amendment 1 read from 08783d07.

Step 1, red (the prefix change alone; rc=1; 24 tests, 23 pass, 1 fail). Lines are from `vonp-b-red.log`. The `at` line carries a worktree path with no profile folder. The message tail is cut at 300 characters.
- `✖ runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked (69.3669ms)`
- `AssertionError [ERR_ASSERTION]: failures containing pr: ["queue drift: <TMP>\\verify-offline-note-pr-PSsJmi\\CUSTODIAN-QUEUE.md does not exist","queue drift: …\\CUSTODIAN-QUEUE.json does not exist","site drift: …\\site\\index.html does not exist", …`
- `at TestContext.<anonymous> (file:///C:/dev/wt/vonp/scripts/plan/verify.test.mjs:273:10)`

Commits:
- e7c66320 `test: verify.test.mjs: the offline-note test's second assertion matches only a PR or release evidence failure`. Its regex is wrong: it reads `/PR #d|evidence {pr: d|(gh release view)/`, because my Bash heredoc script dropped the backslashes. The file run was green (24 of 24, rc=0), but only because the regex matched nothing.
- d06c2dfb `test: verify.test.mjs: restore the backslashes in the evidence predicate's regular expression`. Green re-run: 24 tests, 24 pass, 0 fail, rc=0 (`vonp-b-green2.log`).
- I found the bug at M1: with the broken regex the target test passed under the mutation. I fixed it with a script written through the Write tool, then redid M1 on a fresh export.

M1 (a fresh export of d06c2dfb, with its own git index and core.longpaths set):
- The anchor was the two lines `if (evidence.pr !== undefined) {` plus the following `if (offline) return [];` line, because the bare offline-return line occurs twice. It occurred exactly once, and the edit removed only the PR one.
- rc=1. The form's test failed by name, with the message:
  - `✖ runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked (66.1189ms)`
  - `AssertionError [ERR_ASSERTION]: PR/release evidence failures: ["node \"n-done\": evidence {pr: 1} could not be checked (no repo slug found)","node \"n-felt-done\": evidence {pr: 2} could not be checked (no repo slug found)"]`
- Two other tests also failed (24 tests, 21 pass, 3 fail): `verifyStatusAgreement passes on the fixture plan as recorded (offline)` and `runVerify PASS: a freshly generated queue+site agrees (offline)`.
- I removed the export (the folder is gone). `cmp` of the worktree's verify.mjs with `git show HEAD:scripts/plan/verify.mjs` gave rc=0.

CI command `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (`vonp-b-ci.log`): rc=0, tests 623, pass 623, fail 0, cancelled 0, skipped 0.

Size: `git diff --numstat 533c7402 HEAD` gives `3	2	scripts/plan/verify.test.mjs`, a total of 5 lines, in that one file. The worktree is clean.

Push: `* [new branch] cut/verify-offline-note-predicate -> cut/verify-offline-note-predicate`, tracking set.

Changed lines as committed, from `git show HEAD~1 HEAD`. The first `evidenceFailure` line is the broken one and the second replaces it:
```
-  const dir = makeTempDir('verify-offline-note-');
+  const dir = makeTempDir('verify-offline-note-pr-');
-  assert.ok(!result.failures.some((f) => f.includes('pr')), `failures containing pr: ${JSON.stringify(result.failures.filter((f) => f.includes('pr')))}`);
+  const evidenceFailure = (f) => /PR #d|evidence {pr: d|(gh release view)/.test(f);
+  assert.ok(!result.failures.some(evidenceFailure), `PR/release evidence failures: ${JSON.stringify(result.failures.filter(evidenceFailure))}`);
-  const evidenceFailure = (f) => /PR #d|evidence {pr: d|(gh release view)/.test(f);
+  const evidenceFailure = (f) => /PR #\d|evidence \{pr: \d|\(gh release view\)/.test(f);
```

Model: Sonnet 5.5 (claude-sonnet-5-5).
