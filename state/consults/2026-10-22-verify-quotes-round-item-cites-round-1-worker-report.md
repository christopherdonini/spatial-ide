*Custodian's filing note (2026-10-22): #242's correction round 1 (the form's Amendment 4) by a worker, at 91ccdab4 on its branch. The run 14:19:40Z to 14:49:00Z by its transcript (Bash 22, Monitor 1); its claims were read against that transcript's calls before filing, and the custodian recounted section 7 over 49a7f532...91ccdab4: 415 lines over 7 files. Its suite's four hooks failures in a shared run, passing alone, are reported as timing-sensitive under the machine rule, not recorded as failures; the reviewer's re-gate runs the suite again. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 07462c7aaba27fff1b271597e30b9829e7fe390cf6cff4446113f3a29a5050fd.*

---

Built: verify-quotes-round-item-cites correction round 1 at 91ccdab4904b5937b53b296b03a91a62b41fd2f3

Step 1 (C2). Added to scripts/plan/verify-test-claims.test.mjs, named exactly "verify-test-claims: a withdrawn-test row whose ruling cites an itemless round resolves through the tracked round file". It copies C1's shape and adds no helper.
- Fixture: the test itself runs `git show 40b04b46:...` on the archive and on state/questions/round-66.md. It finds the block by the rulingSet header grammar (`rounds 66 and 67`), copies it to the next boundary line, asserts the block has no item lines, and asserts the round file has item 2 and no item 9.
- Positive case: ruling `round 66, item 2` gives 0 findings and 1 withdrawn row.
- Negative case: ruling `round 66, item 9` gives 1 finding matching /unresolvable ruling: round 66, item 9/.
- Run alone with --test-name-pattern: rc=0, tests 1, pass 1.
- The "by your own script" copy is done by the test at run time, not by a separate script.

Step 2 (MC2), applied by sed to the working tree on top of b08a1fec with C2 still uncommitted; there was no other commit to name.
- Applied: both `, (r) => trackedRoundFileText(root, r)` arguments dropped from withdrawnRiders' two resolveCitation calls.
- Run: C2 alone, rc=1, tests 1, fail 1. The failure line is "✖ verify-test-claims: a withdrawn-test row whose ruling cites an itemless round resolves through the tracked round file (968.6449ms)".
- Reverted with `git checkout -- scripts/plan/verify-test-claims.mjs`. The porcelain then showed only the test file, which was C2 uncommitted. No other mutation was recorded.

Step 3 (the words). My script, not committed, is vqri-r1-apply.mjs in my scratch folder. It took the first two fenced blocks of each of sections 1 to 4 of the consult. Each "current" block occurred exactly once in its file (count 1), and each was replaced byte for byte; LF line ends and the final newline are kept.
- Section 1: scripts/plan/verify-quotes.mjs, old block 1094 characters, replacement 1761.
- Section 2: scripts/plan/README.md, old 998, replacement 1438.
- Section 3: .github/workflows/governance-ci.yml, old 245, replacement 419.
- Section 4: the same file, old 363, replacement 384.
- Sections 5 and 6 are the custodian's and were not touched.

Step 4 (checks at my head).
- Suite: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` gave rc=1, tests 543, pass 539, fail 4. The count matches U6 (527 plus 16).
  - The 4 failures are all in scripts/hooks/hooks.test.mjs, in a shared run of 955 s: three stop-queue tests (the caps end the turn on a stale block, a stale block counts as a continuation, the continuity check fails open) and session-resume "prints the resume facts line after the block". Their durations were 13 to 35 s.
  - Re-run alone with --test-name-pattern, those 4 give rc=0, tests 4, pass 4, fail 0.
  - Per the machine rule I record these as timing-sensitive in a shared run, not as failures. The custodian should re-run the full suite alone.
- verify-quotes.mjs: rc=0, "130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 836 ruling cites resolved, 0 ruling-cite errors."
- verify-test-claims.mjs: rc=0, "all 613 claimed test(s) across 188 file(s) exist or are planned, superseded or withdrawn (36 planned, 9 superseded, 17 withdrawn, advisory)".
- verify-cites.mjs: rc=0, PASS across 2189 files.
- verify.mjs: rc=0, "verify:plan PASS".
- queue.mjs --check: rc=0, "CUSTODIAN-QUEUE.md/.json are current."
- site.mjs --check: rc=0, "site/ is current."
- U4: B's verify-test-claims.mjs, from b08a1fec, was copied untracked into scripts/plan/ and run (rc=0), then deleted. `cmp` of its output against the head's output gave rc=0. The porcelain after showed only the four modified files, with nothing untracked.
- §7 by its command over 49a7f532...HEAD: lines 415 (limit 550), files 7 (limit 7).
- `git diff --stat b08a1fec...HEAD`: only governance-ci.yml, scripts/plan/README.md, scripts/plan/verify-quotes.mjs and scripts/plan/verify-test-claims.test.mjs; 53 insertions, 13 deletions.

Step 5. Commit 91ccdab4904b5937b53b296b03a91a62b41fd2f3: `git add` by path for those four files, `git commit -s -F`, subject as ordered, body naming Amendment 4 and the words' consult. The last two lines are the two trailers you gave. The sign-off line follows them. The push (`git push origin cut/verify-quotes-round-item-cites`) gave rc=0. `git ls-remote origin refs/heads/cut/verify-quotes-round-item-cites` returns 91ccdab4904b5937b53b296b03a91a62b41fd2f3, equal to HEAD. `git status --porcelain` is empty.

Seam read: scripts/plan/verify-test-claims.mjs:551 and :557 (withdrawnRiders' reader), cited in the commit body. The caller grep adds no new pub item.

Pre-gate self-check:
- Cross-module code uses the interface the other side actually has: C2 starts from the real `runVerifyTestClaims` entry point and the real archive and question-file bytes.
- Completion claims point to evidence: MC2's failure line and the check outputs are in the transcript.
- User-facing messages: none were added.
- Required tests reach their assertion: C2's mutation fails on the positive case, in the withdrawn-row assertions.

Hold lines (my own project only): "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ..." and "MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)", once for the suite and once for the verify scripts.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

Off-scope noticed, not done: nothing.
