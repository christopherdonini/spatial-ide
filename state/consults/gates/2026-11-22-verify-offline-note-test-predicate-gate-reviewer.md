Reviewed: cut/verify-offline-note-predicate at d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c (the custodian's filing note, 2026-11-22: PR 355's single gate under the five-line form governance/forms/scripts/VERIFY-OFFLINE-NOTE-TEST-PREDICATE-PREREGISTRATION.md; Read 1, Bash 26, SubagentHandback 1, by unique call ids, no call errored; model claude-opus-5-5, from 2026-11-22T14:35:30Z to 2026-11-22T14:40:54Z by its transcript; no call named the main checkout; no compaction; the report below from its hand-back, 11258 bytes, sha256 5eaa9b2c3a7b4b067319ae1d8423cb129cae6035597d07f84062c469d7b9522e, byte for byte.)

---

Verdict: PASS WITH NOTES, PR #355 @ d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c

Reviewed: cut/verify-offline-note-predicate @ d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c (base 533c7402275086651c1fd590cd2005eb21cb9dc5; form and ruling read at main 08783d073376686eba767d5a65bb89675bd40b38). Read time: Sun Nov 22 14:39:23 UTC 2026 (`date -u`).

## Correctness

No findings.

- **Check 1, the diff.** I ran `git diff 533c74022750...d06c2dfb10b6` (rc 0), `--numstat` (rc 0) and `git log` (rc 0).
  - The diff touches one file, `scripts/plan/verify.test.mjs`. Numstat is `3	2`, so 5 changed lines against a budget of 16 or fewer.
  - Only the named test changes: its prefix line becomes `makeTempDir('verify-offline-note-pr-')`, and its second assertion becomes a `const evidenceFailure` line plus the new `assert.ok`.
  - A node script compared the parts byte for byte (rc 0):
    - The regex in the head file equals the backticked expression in Amendment 1 item 3: `regex byte-equal: true`.
    - The test-name line is equal to the base's, and occurs once in each file.
    - The first assertion is equal to the base's, and occurs once in each file.
  - The message is `PR/release evidence failures: ${JSON.stringify(result.failures.filter(evidenceFailure))}`, so it prints, as JSON, exactly the failures the predicate matches.
  - No retry, sleep, timeout or skip is added: the diff holds only the three lines above.
  - Both commits carry a `Signed-off-by` from git's `-s`. The worker's message files hold no typed sign-off; their only `@` is the Co-Authored-By noreply address.
- **Two commits instead of one.** Neither the form nor ADV-2026-11-22-14 requires a single commit. The form's budget is counted "in the merged diff", and that diff is 5 lines.
  - The first commit, e7c66320, has a predicate that cannot fail on a PR evidence failure. If the branch is merge-committed, that commit stays in history. That leaves a record question, not a form requirement (see D1).
- **Check 2, the predicate against the code.** `git diff --quiet 533c74022750 d06c2dfb10b6 -- scripts/plan/verify.mjs` gave rc 0.
  - I read these templates at the head (`git show d06c2dfb10b6:scripts/plan/verify.mjs`), at verify.mjs lines 175, 180, 182, 186 (reason), 189, 195, 199, 203, 209, 212, 214, 236, 246, 258, 269, 272, 321 and 325.
  - I read the drift problem strings at queue.mjs lines 241, 245, 248 and 254, and at site.mjs lines 856, 866, 875, 879, 885 and 889.
  - I read the reason and detail strings at verify.mjs lines 51, 53, 83, 90, 133, 135, 138, 141, 154, 157, 160, 163 and 167.
  - One `node -e` run (rc 0, log `<S>/vonp-rev-pred.log`):
    - (a) All four templates of Amendment 1 item 1 match when filled: verify.mjs lines 180, 182, 195 and 236.
    - (b) None of the five failures in `vonp-b-red.log` match. They are two `queue drift:` and three `site drift:` "does not exist" paths under `<TMP>\verify-offline-note-pr-PSsJmi`.
    - Final line: `all (a) match, no (b) match, b count 5 : true`.
  - Other templates: a grep over every non-test `scripts/plan/*.mjs` (23 files) for `PR #`, `evidence {pr` and `gh release view` finds:
    - verify.mjs line 15, which is a comment;
    - verify.mjs lines 180, 182, 195 and 236, the four templates;
    - queue.mjs line 31 and site.mjs line 91, which are renderers, not failure strings.
  - So no other failure template matches. Templates that put a value into the string (`${result.reason}`, `${filePath}`, `JSON.stringify(evidence)`, `loadPlan`'s `e.message`) could match only if that value held `PR #<digit>`, `evidence {pr: <digit>` or `(gh release view)`. See N2.
  - Offline, the returns at verify.mjs lines 179 and 192 return `[]` before the templates at 180, 182 and 195 can run. Line 236 needs `prResults`, which `runVerify` leaves empty offline. So the test still means what its name says.

## Evidence

No findings.

- **Check 3, the export.**
  - Set-up: `git archive d06c2dfb10b6 | tar -x -C <S>/vonp-rev` (rc 0), `git init -q` (rc 0), `-c core.longpaths=true add -A` (rc 0). The export has no remote, so `slug` is null.
  - **Baseline:** `timeout 300 node --test scripts/plan/verify.test.mjs` gave rc 0, with tests 24, pass 24, fail 0, cancelled 0, skipped 0.
  - **R:** a node-based anchored replace put the base's old assertion back and kept the new prefix. It replaced the head's two-line pair, read from the head file, which occurred exactly once; otherwise it exits 3. It reported `R applied; anchor occurred once`, rc 0.
    - The run gave rc 1, with tests 24, pass 23, fail 1. The failing test is `✖ runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked (114.0942ms)`.
    - First 300 characters of its message (`<S>/vonp-rev-R.log`): `AssertionError [ERR_ASSERTION]: failures containing pr: ["queue drift: <TMP>\\verify-offline-note-pr-Lftnhk\\CUSTODIAN-QUEUE.md does not exist","queue drift: <TMP>\\verify-offline-note-pr-Lftnhk\\CUSTODIAN-QUEUE.json does not exist","site drift: <TMP>\\verify-offline-note-pr-Lftnhk\\site\\index.html does not exist","`
    - It failed at `verify.test.mjs:273:10`, which is the second assertion in the R file.
    - The reverse anchored command reported `R reversed; anchor occurred once`. `cmp` against `git show d06c2dfb10b6:scripts/plan/verify.test.mjs` gave rc 0, and `git diff --quiet` against the export's index gave rc 0.
  - **M1:** an anchored replace removed `if (offline) return [];` only in the `evidence.pr` branch. The anchor was `if (evidence.pr !== undefined) {` together with the line after it, and it occurred once. The diff shows only line 179 removed.
    - The run gave rc 1, with tests 24, pass 21, fail 3. The failing tests:
      - `verifyStatusAgreement passes on the fixture plan as recorded (offline)`
      - `runVerify PASS: a freshly generated queue+site agrees (offline)`
      - the form's test, by name.
    - The form's test message (`<S>/vonp-rev-M1.log`): `AssertionError [ERR_ASSERTION]: PR/release evidence failures: ["node \"n-done\": evidence {pr: 1} could not be checked (no repo slug found)","node \"n-felt-done\": evidence {pr: 2} could not be checked (no repo slug found)"]`
    - It failed at `verify.test.mjs:274:10`, which is the new second assertion.
  - **Clean-up:** `rm -rf <S>/vonp-rev` gave rc 0, and `ls -d` then gave "No such file or directory" (rc 2). The worktree's `verify.mjs` `cmp` against the head gave rc 0, `git status --porcelain` shows 0 lines, and HEAD is still d06c2dfb.
- **Check 4, the worker's claims against its logs.** Each count claim is shown by its log:
  - `vonp-b-red.log`: 24/23/1. The quoted red message matches the log; the report's `…` elisions remove only repeated path text.
  - `vonp-b-green.log`: 24/24/0.
  - `vonp-b-green2.log`: 24/24/0.
  - `vonp-b-m1.log`: 24/21/3, with the same three failing names and the same two-item evidence message as my run.
  - `vonp-b-ci.log`: 623/623/0, cancelled 0, skipped 0. The log holds no rc line, so "rc=0" rests on the counts.
  - Numstat `3	2`: I reproduced it.
  - Not checked from a log: the claim that the broken-regex commit stayed green under M1. That run's log was not kept (`vonp-b-m1.log` is the redo).
  - The backslash cause: see D1. `vonp-b-edit.mjs` does not show a heredoc loss.
- **Check 5, CI.** `gh pr checks 355` gave rc 0, and all 8 checks pass: cfg boundary ×2, every commit is signed off, no profile path in the range, ported-notices ×2, and test · verify:plan · queue/site drift ×2. `gh pr view 355 --json headRefOid,isDraft` gave rc 0, with `headRefOid` d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c and `isDraft` true.

## Documentation (must fix before the merge; not the human's wording)

**D1. The cause is misstated.**
- The record: the body of commit d06c2dfb (`<S>/vonp-b-msg2.txt`, line 3 onward) says the expression "lost its backslashes when written through a shell heredoc (\d read as d), so it matched nothing". The worker's report says the same, as "my Bash heredoc script dropped the backslashes".
- What `<S>/vonp-b-edit.mjs` shows: in `od -c` of its line 6, the bytes `\ d`, `\ {` and `\ (` are on disk. They sit inside a double-quoted JavaScript string (`const nw = "  const evidenceFailure = (f) => /PR #\d|…`). JavaScript reads `\d` as `d`, `\{` as `{` and `\(` as `(`.
- Reproduced: `<S>/vonp-rev-broken.mjs` printed `JS string literal reads: /PR #d|evidence {pr: d|(gh release view)/`. So the heredoc kept the backslashes, and the JS string literal dropped them.
- "Matched nothing" is also untrue: the broken regex matches the release template (verify.mjs:195), giving `true`, and fails only the three PR templates.
- The fix: squash-merge and use these words as the squash commit's body sentence, in place of the commit's first sentence:

  "The first commit's regular expression lost its backslashes in the edit script's double-quoted JavaScript string (\d read as d), so it matched no PR evidence failure and the test could not fail on one."

- Clause check:
  - "lost its backslashes in the edit script's double-quoted JavaScript string": vonp-b-edit.mjs line 6, with the bytes shown by od, and the reproduction above.
  - "(\d read as d)": the reproduction prints `PR #d`.
  - "matched no PR evidence failure": the broken regex returns `false` for the filled templates at lines 180, 182 and 236.
  - "the test could not fail on one": the fixture's done evidence is `{pr: 1}` and `{pr: 2}` (verify.test.mjs line 270's comment). Offline, only PR evidence can be at issue.
- If the PR is merge-committed instead, the false sentence stays in d06c2dfb's history. The custodian's merge record should then carry the corrected sentence.

**D2. A line number in the form is wrong.** It is on main, not in this PR's diff.
- Amendment 1 item 2 of `governance/forms/scripts/VERIFY-OFFLINE-NOTE-TEST-PREDICATE-PREREGISTRATION.md` names "lines 179 and 193" as the offline returns. At both 533c7402 and d06c2dfb, the release offline return `if (offline) return [];` is line 192. Line 193 is `return ghReleaseView(repoRoot, evidence.release)`.
- The form is append-only, so this needs an appended correction, not an edit. Words for it: "Amendment 1 item 2's second line number is 192, not 193: at 533c7402275086651c1fd590cd2005eb21cb9dc5, `scripts/plan/verify.mjs` line 192 is the release branch's `if (offline) return [];`."
- Clause check: `awk 'NR==192'` on `git show 533c74022750:scripts/plan/verify.mjs` prints that line, and NR==193 prints `return ghReleaseView(...)`.

## Notes

- **N1.** The PR body's line 15 states two commits and no cause, so it needs no change.
- **N2.** A remaining false-fail case, not reachable in ordinary use: a system temporary folder or fixture value whose text holds `PR #<digit>`, `evidence {pr: <digit>` or `(gh release view)` would still trip the predicate. Random `mkdtemp` suffixes are alphanumeric, so the prefix-borne flake is closed. If wanted, this can be named in the test's source comment.
- **N3.** The M1 failure takes the "no repo slug" template (verify.mjs:180), both in my export and in the worker's, because the export has no remote. In a checkout with origin, the same mutation would call `gh api` and take the template at line 182. Both are in the predicate.

Model: Opus 5.5 (claude-opus-5-5).
