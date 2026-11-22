# scripts/plan/verify.test.mjs: the offline-note test's second assertion matches only an evidence failure, not a path — five-line short form (`AUTONOMY.md` §21d)

Committed before any code, per the short-form discipline; append-only once committed.
- **The node:** the PLAN node verify-offline-note-test-flake, its second piece. The advisor's ruling ADV-2026-11-22-14 places it, under the human's delegation of 2026-11-13 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-14-the-flaky-scripts-tests-cause-shown-by-pr-354s-gate-its-fix-the-nodes-second-piece-now.md`). The first piece, PR 354, gave the two assertions their messages under `governance/forms/scripts/VERIFY-OFFLINE-NOTE-TEST-MESSAGE-PREREGISTRATION.md`.
- **Why now:** the cause is shown by PR 354's gate. With pr in the temporary folder's name, the test fails at its second assertion on five failures that hold pr only in the folder's path, and none is about pull-request evidence (`state/consults/gates/2026-11-22-verify-offline-note-test-message-gate-reviewer.md`; ruling item 1). The ruling is the recorded decision the human's message of 2026-11-22, item 1, asks for when an unreliable assertion is replaced.
- **Its class:** the five-line form and the reviewer alone, with the standard worker (ruling item 2).
- **No retry, sleep, longer timeout or skip** is added, and none is used to make the test green (ADV-2026-11-22-01 item 2; ruling item 5).
- **Merge:** it changes one test file, and no file the app is built from, no workflow and no lockfile, so it merges as it closes, before the v0.2 tag.
- **The records:** the custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file.

```
Authority: PLAN node verify-offline-note-test-flake, its second piece; the advisor's ruling ADV-2026-11-22-14, under the human's delegation of 2026-11-13: the second assertion's predicate is replaced because it matched the folder's path, the test keeps its name and its meaning, the folder's prefix holds pr for good; the human's message of 2026-11-22, item 1, flaky tests are findings (ADV-2026-11-22-01); reuse index: no prior art recorded for assertion predicate or for temp folder path (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian on 2026-11-22), a miss noted here.
Scope: 1 file: scripts/plan/verify.test.mjs; declared line budget <= 16 changed lines in the merged diff by §21c's counting (insertions plus deletions, comments counted), this form excluded. Block on sight: any change to another test in the file, to its helpers or fixtures, to verify.mjs or any other script, to a workflow, a dependency or a lockfile; any change to the first assertion; any retry, sleep, longer timeout or skip.
Change: in the test named runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked, three things and nothing else. (a) The second assert.ok's predicate, which now matches any failure containing pr, is replaced by one that matches only the text scripts/plan/verify.mjs itself writes for a pull-request or release evidence failure. The worker names that text from the code, with its file, line and commit, and the custodian files it as this form's Amendment 1 before the change is made. (b) That assertion's message prints, as JSON, the failures the new predicate matches. (c) The test's temporary folder's prefix becomes verify-offline-note-pr- for good, so the test is its own regression on every run. The test's name, its first assertion and every other line are unchanged. If verify.mjs writes no text that tells such a failure apart, the piece stops before any change and goes to the advisor; verify.mjs is not changed here.
Tests+mutation: no new test. The regression, red then green: with (c) applied alone, the file run alone fails this test by name at its second assertion, and the worker records the failure byte for byte from the run's output; with (a) and (b) applied too, the file runs green. M1: in an export of the whole tree with its own git index (core.longpaths set), verify.mjs's offline handling of an unchecked pull-request evidence is changed so that it reports a failure for it; the test fails by name on the new predicate, recorded byte for byte; the export is then removed, and the worktree's verify.mjs is compared with the head by cmp. The runs: node --test scripts/plan/verify.test.mjs, and CI's scripts suite green.
Out-of-scope: ADR none; security none -- one test file, Node's standard library, no dependency, no workflow; wire none; guarantee none touched -- the test's meaning stays: offline, unchecked pull-request or release evidence alone fails nothing; only what counts as such a failure is narrowed to the script's own words for it.
```

### Amendment 1 — 2026-11-22 — the text, named from the code before the change

1. **The text.** At 533c7402275086651c1fd590cd2005eb21cb9dc5, `scripts/plan/verify.mjs` writes a pull-request or release evidence failure in four places, copied here by script from `git show`, each with its line number:

```
180: if (!slug) return [`${tag}: evidence {pr: ${evidence.pr}} could not be checked (no repo slug found)`];
182: return result.ok ? [] : [`${tag}: PR #${evidence.pr} is not merged (${result.detail})`];
195: : [`${tag}: release "${evidence.release}" was not found (gh release view)`];
236: return [`node "${node.id}": status is "${node.status}" but PR #${pr} is reported merged (${result.detail})`];
```

   What tells such a failure apart is fixed text in these lines: `PR #` before a number, `evidence {pr: ` before a number, and `(gh release view)`. By the step-A worker's search (`state/consults/2026-11-22-verify-offline-note-test-predicate-step-a-worker-report.md`, its item 3), no other failure string in the plan scripts holds them. `queue.mjs` and `site.mjs` hold `PR #` only in what they render, and the drift failures name paths, which hold no `#`.

2. **Offline,** the two returns before lines 180 and 195 (lines 179 and 193) write nothing, so no such failure is written offline at all. The test's meaning stands as the form gives it.

3. **The change** takes the worker's proposed predicate, the regular expression `/PR #\d|evidence \{pr: \d|\(gh release view\)/` tested on each failure; the assertion's message prints, as JSON, the failures it matches. Everything else is as the form's Change and Tests+mutation lines give it.

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — 2026-11-22 — the gate; the record before the merge check

1. **The single gate:** the reviewer, PASS WITH NOTES at d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c, no Correctness or Evidence finding (`state/consults/gates/2026-11-22-verify-offline-note-test-predicate-gate-reviewer.md`, gate-log row 831). The worker's report is `state/consults/2026-11-22-verify-offline-note-test-predicate-step-b-worker-report.md`. The merged diff is 5 lines, in `scripts/plan/verify.test.mjs` alone; `scripts/plan/verify.mjs` is unchanged.

2. **CI at d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c:** all 8 checks passing, read by the custodian at 2026-11-22T14:46:12Z.

3. **D2, a line number in Amendment 1 item 2,** in the reviewer's words: Amendment 1 item 2's second line number is 192, not 193: at 533c7402275086651c1fd590cd2005eb21cb9dc5, `scripts/plan/verify.mjs` line 192 is the release branch's `if (offline) return [];`.

4. **D1, the cause in the second commit's message.** The branch has two commits, e7c66320 and d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c, and neither is rewritten; the advisor merges by merge commit (the grant, item 5 (b)). The message of d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c gives a shell heredoc as the cause. The record of the cause is this item, in the reviewer's words: The first commit's regular expression lost its backslashes in the edit script's double-quoted JavaScript string (\d read as d), so it matched no PR evidence failure and the test could not fail on one.

5. **The reviewer's N2** (a temporary folder or fixture value holding the fixed text would still trip the predicate; random suffixes cannot) is recorded here and changes nothing.

6. **The merge:** a test of the scripts alone, which merges as it closes (ADV-2026-11-21-15 item 3; the human's item 0 of 2026-11-22 names shipped code and lockfiles). At the merge the ledger finding of the flaky test closes, its cause in the first form's Amendment 2 (ADV-2026-11-22-14).

Read the last amendment first.

Nothing above is edited.

### Amendment 3 — 2026-11-22 — merged

1. **Merged** by the advisor by merge commit b9023d48d63b98f07db79c59125db190d5d39c5f, at 2026-11-22T15:13:23Z by GitHub, at the checked head d06c2dfb10b660e0ce0106dbd4b8f06d98902d0c; its verdict MERGE filed at `state/consults/merge-checks/PR-355-d06c2dfb10b6.md`; main's CI at the merge commit green (4 runs, all success, read at 2026-11-22T15:18:06Z).

2. The ledger's finding on the flaky test closes at this merge (ADV-2026-11-22-14 item 6).

Read the last amendment first.

Nothing above is edited.
