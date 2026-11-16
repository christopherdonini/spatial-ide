# The advisor's merge check of PR #326 at ed7e646588c4: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, a7949c9f

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-326-ed7e646588c4.md in the human's advisory folder and told the custodian by session message, received at 2026-11-16T00:10:31Z by the custodian's transcript; the custodian acts on the file. 6247 bytes, sha256 8c1c4c53a5774b794f17e428e7634ba8a02bb8b258f7faa921a31c00c633c73b, last modified at 2026-11-16T00:10:07Z by the file system; read by the custodian at 2026-11-16T00:14:07Z and again at this filing (2026-11-16T01:01:22Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #326 merged at 2026-11-16T00:10:22Z with the merge commit a7949c9fe2d5646b8f810e5dbed44ae7e2821fd0; main's CI at that commit: green, 7 runs.*

---

Merge check: PR #326 at ed7e646588c40b39b70a7d2c1fcfe10f90e7a943
Verdict: MERGE

The advisor's verdict under the delegation of 2026-11-13. It is not the human's words. Written on 2026-11-16, from reads made between 00:08Z and 00:10Z.

What the PR is. PLAN node `lod-tier-tests-own-tier-folder`, filler entry 11, branch `cut/lod-tier-tests-own-tier-folder`, made by the human's ruling of 2026-11-06: each test run takes its own tier folder, and the machine-wide one is kept for the product. On Windows each engine and kernel test process that builds, reads or clears LOD tiers now sets its own folder below the cargo target's temporary directory, once, before its first build. Two new tests prove it, one of them with a second process. The product's own resolution of the tier root is not changed.

What I read. The custodian's merge check request. From GitHub: the PR's head, author, base, draft state, files, commits and body; its twenty check rows; main's newest runs. From the repository's objects, read only: the four commits, the merge base, the numstat, the diff of the last commit, the helper in `engine/tests/common/mod.rs`, and the paths main changed since the merge base. On main at 354e1840d44b18bf7f9da9d37d2dd188a101c0f0: the form's five lines, its sections A to D and its Amendment 3; both gate reports, whole; the gate log's two rows. Earlier, when I ruled on the piece: lead-data's draft whole, the form's Amendment 1's fence, the lines both gates listed for the Scope question, and every test file that names the tier builder. My own scripts made every comparison below from git objects. I made no run in the repository.

1. The PR is the custodian's own. Its author is the repository's account, its branch is in this repository, its base is main, and it is out of draft.

2. The head differs from the gated head by words only. Both gates passed f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb. The head is one commit on it. By my script every changed line of that commit is a comment line, in three files, 20 added and 15 removed. Its words are the architect's D1 to D5: with line breaks and code marks set aside, the replacement words of D1, D2 and D3 occur in the files at the head, D4's inserted clause follows its anchor, and D5's file name stands whole on one line. Section 31 (d) of AUTONOMY allows these with no re-gate, and the PR body lists the five.

3. Both gates ended PASS WITH NOTES and every finding is closed.
- The gate log holds two rows for the node, the architect's and the reviewer's, each PASS WITH NOTES at f8f931e2, attempt 1. Neither report has a Correctness or an Evidence finding.
- The reviewer applied both mutations at the gated head, saw the two new tests fail at the predicted assertions, and reverted each. It ran the engine crate's tests and the kernel test, each with no failure, and the light checks.
- The architect's D1 to D5 are in the words commit. The reviewer's D1 to D4 are findings on the same four sentences, and the applied words answer each: the inherited value in the second process, the wrapper off Windows and during the preflight's injection, the injection in the helper's doc, and what else in the kernel binary reads the variable. The architect's D6 is in the form's Amendment 3, in its own words.

4. Nothing on the piece waits for a ruling, and the one ruled wording is where it was ruled to be.
- My rulings on the piece are ADV-2026-11-15-14, -16, -18, -22 and -23. Each is filed, holding my file whole, by my script.
- The fence of ADV-2026-11-15-18, the reading of the check P-0 (b), occurs once in the form. No wording in the diff is mine or the human's.
- The Scope question of ADV-2026-11-15-18 is answered: the six groups of lines both gates list are inside the piece (ADV-2026-11-15-22 and -23), the reviewer's filed list holds no other line, and Amendment 3 lists them.

5. The diff's files are inside the form's list. The diff from the merge base names seven files, the seven of the form's Scope line: five test files of the engine, one of the kernel, and the engine's README. No file under `engine/src` or `kernel/src`, no Cargo manifest, lockfile, CI workflow, licence, Guardian or mod file is among them.

6. The piece does what was ruled, and its size is recorded.
- The helper takes the folder for the process, holds a lock file open, removes the folders of runs that have ended, and sets the variable once on Windows. The four suites take the builder through the helper's wrapper. `engine/tests/lod_tier_root.rs` is unchanged.
- The size is 423 changed lines against my note of 260 for this piece. Under term (a) of ADV-2026-11-15-14 the piece keeps its form and nothing is trimmed. The form's amendments give the count by file, and both gates read whether each line is in scope.
- The time was 150 minutes against the node's 60, recorded.
- The form says that on Windows the variable now also decides the per-user data directory, and both gates checked what else each touched process reads. Neither found a dependence on the machine's real directory.
- One run of the piece overlapped another heavy run of this project, in the window ADV-2026-11-15-17 rules. By the architect's check no recorded result rests on that run.

7. CI is green at the head, and no path of the piece changed on main.
- All twenty check rows pass (read 00:08Z).
- The branch has not taken main in, and it did not need to: main's commits from the merge base d2008810 to 354e1840 change 29 paths and none of the seven, by my own listing. GitHub's newest runs on main are at 354e1840, and its four runs are green (read 00:08Z).

For the records, none of it a condition on the merge.
- Clippy with warnings denied fails on three rows that main carries, none in a changed file. They are with the clippy node's 12d (ADV-2026-11-15-21).
- The architect's O2 and both gates' note on a rare lock race: the sweep removes a lock file even when its folder could not be removed, so that folder is never swept again. Nothing reaches the machine-wide folder. If the custodian proposes a node for it, I place it.
- The next run of the ignored measurement tests names the tier volume and says the wrapper is inside the timed region, as Amendment 3 records.

After the merge the custodian reads main's CI.
