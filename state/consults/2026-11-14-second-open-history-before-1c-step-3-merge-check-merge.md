# The advisor's merge check of PR #318 at 63d66887049e: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 6f4280e8

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-318-63d66887049e.md in the human's advisory folder and told the custodian by session message, received at 2026-11-14T23:07:58Z by the custodian's transcript; the custodian acts on the file. 5873 bytes, sha256 ce334a648002bc8899c3fffc992cd253a758a1c32db8c13f0215b8f1ffe1263c, last modified at 2026-11-14T23:07:30Z by the file system; read by the custodian at 2026-11-14T23:08:37Z and again at this filing (2026-11-14T23:34:10Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #318 merged at 2026-11-14T23:07:43Z with the merge commit 6f4280e8759e338f0bec15295dc9d1b5805b4078 (parents a0bff480 and 63d66887), which keeps C1 reachable from main. Main's CI there is read at this filing.*

---

Merge check: PR #318 at 63d66887049e8ddafaef7c6183f09138e7893480
Verdict: MERGE

Written by the advisor session on 2026-11-14 at 23:07Z, under the human's delegation of 2026-11-13. This is the second merge check of this PR. The first, at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6, was HOLD on check 7 alone: main had changed `KNOWN-LIMITATIONS.md` after the branch was cut and the branch had not taken main in. My ruling ADV-2026-11-14-21 said what would settle it. Each of those things is now done, and I checked each myself.

Names used below. C is the head of the first check, c8f8bdca. N is the main commit the branch took in, f47a2ad90f69dfa02f63636887d0402862c03edd. M is the head checked here, 63d66887. The base is the branch's first merge base, 695e1303794ed390d305d07fca592694f33f589e. Main, when I read it, was at a0bff4801cb555cc1e30c8fa2d35c2107c5b06f2.

What I read: the custodian's request; the PR from GitHub (head, draft state, author, branches, mergeable state, the 18 check rows and the 12 runs at M); M's parents and commit message; the file lists base to C, N to M, N to main, and the PR's own list from GitHub; the blob of each of the eleven files at M, C, N and main; `KNOWN-LIMITATIONS.md` at the base, C, N and M, and ADR-036 at M and on main, compared by my own scripts with my ruling files; the two gate reports at M as filed on main, each whole; the form's Amendment 4 on main, whole, and the form's diff since my first check; the gate log's seven rows for the node. The earlier gate reports, the form's earlier parts and the code I read for the first check and for my rulings; those files have the same blobs at M as at C.

1. The PR. Opened from the custodian's account, from the branch `cut/second-open-history-before-1c-step-3` of this repository, based on main, out of draft, open. GitHub reads it MERGEABLE and CLEAN. Met.

2. The head. M is the head both last gate reports name. No commit follows it. M has two parents, C then N, and N is on main. Its message names N and the ruling. The first commit of the piece, a2fbab2c, is still an ancestor of M, so the pins in item 43's comment still resolve; the merge into main must stay a merge commit for that, and it is. Met.

3. The gates. Seven rows in the gate log for this node. The five up to C are as my first check read them: the reviewer's FAIL at dc0bd937 on one ruled sentence is closed by the reviewer's own PASS at C. The two new rows are at M, each scoped to the merge as ADV-2026-11-14-21 item 4 asks, each a new attempt with its own verdict: the architect, attempt 3, PASS, no finding; the reviewer, attempt 4, PASS, no finding. The reviewer ran the custodian's check script itself and its output is equal to the custodian's; it ran the four verify scripts at M, each exit 0; it read the 12 runs at M. Its five observations ask for nothing. One of them corrects a sentence of my own ruling: ADV-2026-11-14-21 item 4 (b) said main had changed no Rust file since the base, which stopped being true when PR #320 merged before N. Main's one Rust change is that PR's three tests in the kernel's protocol file, which is not a file of this piece, and the workspace runs at M passed on both systems with those tests and this piece together. Met.

4. Rulings and ruled wording. Nothing on the piece waits for a ruling. By my own scripts at M:
   - ADR-036 at M is main's ADR, one blank line, then the fence of ADV-2026-11-14-20 item 5, byte for byte;
   - item 43's line at M is main's line with the span of ADV-2026-11-14-17 item 3 replaced;
   - item 43's two comments are C's, which my first check compared with ADV-2026-11-14-17 item 4 and ADV-2026-11-14-20 item 6 (b); the same script passes at M;
   - `KNOWN-LIMITATIONS.md` at M, whole, equals N's file with item 43's line and comment replaced by C's line and two comments, and item 63's three lines and one blank line removed. So item 47's sentence, which main brought, is main's text, and no other line differs from main. The file also equals, byte for byte, the three-way merge I made outside the repository before the HOLD.
   ADV-2026-11-14-19, -20 and -21 are filed on main, each holding my file whole. Met.

5. The files. The PR's list from GitHub, the list from N to M, and the list from the base to C are the same eleven files, each on the form's §2.5 list. Ten of them have the same blob at M as at C. No dependency, lockfile, CI workflow, licence or mod file. Met.

6. What was ruled. Unchanged from the first check: each open of a dataset has its own session history record until a save binds the open to a project (the human's rulings of 2026-11-12, OPEN-N1 to N4); item 63 is withdrawn and item 43 reworded as ruled; the size is recorded as class 8. The merge of N adds nothing to the piece. Met.

7. CI and main. `gh pr checks 318`, read by me at 23:06:26Z: 18 rows, all pass. The 12 runs at M each completed with success at the first attempt. The branch last took main in at N. From N to main at a0bff480, each of the eleven files has the same blob, by my own comparison; main's changes since N are records, the plan and its generated files, and this piece's form (Amendment 4), which the PR does not touch. Met.

What ADV-2026-11-14-21 asked beyond the seven checks: one merge commit and no rewrite (the branch moved from C to M by one commit whose first parent is C); the form's Amendment 4 on main, with Amendments 1 to 3 untouched (the form's diff since my first check is 16 added lines and no removed line); the request naming M, N, the merge base and the list of paths changed on main (it does; the list is empty and I found it empty). All done.

After the merge: the kernel README's "Declared limits" line still lists item 63, which this piece withdraws. The form's Amendment 3 item 6 names the line and its replacement for the index update, as ruled in ADV-2026-11-14-19 item 6. Port-2 takes main in next.
