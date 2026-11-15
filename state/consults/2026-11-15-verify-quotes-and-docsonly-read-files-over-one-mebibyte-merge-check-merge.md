# The advisor's merge check of PR #325 at 536e664dfc5b: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, cacf3592

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-325-536e664dfc5b.md in the human's advisory folder and told the custodian by session message, received at 2026-11-15T10:42:34Z by the custodian's transcript; the custodian acts on the file. 5804 bytes, sha256 0c4fa66593b41c6eada97facba267d18282fb6a4780e01a6b23563c31b5a414b, last modified at 2026-11-15T10:42:09Z by the file system; read by the custodian at 2026-11-15T10:44:14Z and again at this filing (2026-11-15T11:17:05Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #325 merged at 2026-11-15T10:42:24Z with the merge commit cacf3592d1ad98df46f5e840b8983b8571641c49; main's CI at that commit: green, 4 runs.*

---

Merge check: PR #325 at 536e664dfc5b6296148e951896025516b71648bb
Verdict: MERGE

The advisor's verdict under the delegation of 2026-11-13. It is not the human's words. Written on 2026-11-15, from reads made between 10:40Z and 10:42Z.

What the PR is. PLAN node `verify-quotes-and-docsonly-read-files-over-one-mebibyte`, the governance lane, branch `cut/verify-quotes-and-docsonly-read-files-over-one-mebibyte`. The plan file passed 1 MiB, and two tools read it through git with Node's default buffer of 1 MiB: verify-quotes then reported an unresolvable rev, and the docs-only tool reported the plan as added or deleted. Each tool's one read gains the buffer option that verify-cites already uses, and each tool gets one test whose fixture is over 1 MiB.

What I read. The custodian's merge check request. From GitHub: the PR's head, author, base, draft state, files, commits and body; its eight check rows; the six runs at the head; main's four newest runs. From the repository's objects, read only: the branch's two commits, the merge base, the diff from the merge base, and the paths main changed since the merge base. On main at 6d11bcfd2e15dcd3e84259d1883f5d5d1b354847: the form with its Amendments 1 and 2; both gate reports, whole; the gate log's two rows for the node. The architect's draft of the form I read whole when I checked the filing of ADV-2026-11-15-10. My own script made every comparison below from git objects. I made no run in the repository.

1. The PR is the custodian's own. Its author is the repository's account, its branch is in this repository, its base is main, and it is out of draft.

2. The head is the one both gates passed. Each gate report names 536e664dfc5b6296148e951896025516b71648bb, and no commit follows it. The branch is two commits on the merge base 5ed2d5037d1c4ac37b17946405050e60b2822757: the fix with both tests, then the two tests' mutation comments.

3. Every gate ended PASS and no finding is open.
- The gate log holds two rows for the node, the architect's and the reviewer's, each PASS at the head, attempt 1. The filed reports are 8695 and 15969 bytes, with the sha256 values the request gives.
- Neither report has a Correctness, Evidence or Documentation finding. Their observations are notes, and none is a condition on this PR.
- The reviewer applied each mutation at the head and saw the named test fail at its second assertion, with the failure the form declares, then reverted it. It ran the form's three checks, the two tests by name, the suites (606 tests, none failed) and the five verify scripts, and it ran the two evidence rows on the real plan at the head.

4. Nothing on the piece waits for a ruling, and no ruled wording is in the diff.
- The node is placed by ADV-2026-11-15-09. Its form's four OPEN items are answered by ADV-2026-11-15-10, with item 2 (b) replaced by ADV-2026-11-15-11. All three are filed, each holding my file whole.
- The one ruled sentence is in the form, not in the diff: the fence of ADV-2026-11-15-11 occurs once in the form, by my script.
- The two terms of ADV-2026-11-15-10 item 5 hold, by my script and my read. `scripts/plan/docsOnly.mjs` keeps its line count, 212. The new docs-only test calls `checkDocsOnly` alone and asserts on the list it returns, not on any output string.
- The drafts ADV-2026-11-15-04 and ADV-2026-11-15-07, which wait for the human, belong to other pieces. Nothing in this diff depends on them.

5. The diff's files are inside the form's list. The diff from the merge base names four files, the four of the form's section 7: `scripts/plan/verify-quotes.mjs`, `scripts/plan/docsOnly.mjs` and their two test files. No dependency, lockfile, CI workflow, licence, Guardian or mod file is among them. The numstat is 1 and 1 for each tool, 12 and 0 and 41 and 0 for the test files, 57 lines against the ceiling of 80.

6. The piece does what was ruled.
- In each tool exactly one line differs from the merge base, and it is the line inside the function ADV-2026-11-15-09 names (`gitShowFile`, `gitShow`). The new line is the old line with `maxBuffer: 1 << 28` added as the last option. No other statement, no exit code and no reason text changes. The header and the two output lines of the docs-only tool are untouched.
- Each test file at the head begins with the whole file at the merge base, so each test is appended and no existing test changes. Each test builds its fixture in a temporary repository; no file in the diff is large.
- The test names are the two of ADV-2026-11-15-10 item 2.
- The form's Amendment 1 shows both defects on main by a run before the code, and Amendment 2 shows them gone at the head, each as predicted.
- The two reads in verify-test-claims and verify-mutation are not in the diff. They stay with the proposed node, as ADV-2026-11-15-09 item 5 rules.

7. CI is green at the head, and no path of the piece changed on main.
- All eight check rows pass, and the six runs at the head are each completed with success (read 10:40Z).
- The branch has not taken main in, and it did not need to: main's commits from the merge base to 6d11bcfd change thirteen paths and none of the four, by my own listing. GitHub's newest runs on main are at 6d11bcfd, so that is main's head, and its four runs are green (read 10:41Z).

One finding of the architect's is for me and not for this PR. ADV-2026-11-15-09 item 9 ends by saying the fix holds at any size a tracked file reaches. The code holds up to `1 << 28` bytes of output and no further. The form claims nothing beyond that, and no record in the diff repeats my clause. I take the finding and carry it on my own list.

After the merge the custodian reads main's CI. This piece's closing amendment names the merge commit as the commit from which both tools read a file past 1 MiB (ADV-2026-11-15-10 item 3 (a)).
