# The advisor's merge check of PR #324 at 45a945f80aef: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 70586ced

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-324-45a945f80aef.md in the human's advisory folder and told the custodian by session message, received at 2026-11-15T12:28:17Z by the custodian's transcript; the custodian acts on the file. 8690 bytes, sha256 858adbde049f0bd6860bf1202a1c528ca7505689171acf9d54ac869a98f0a4cd, last modified at 2026-11-15T12:27:52Z by the file system; read by the custodian at 2026-11-15T12:35:50Z and again at this filing (2026-11-15T12:51:51Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; the custodian's request was sent at 2026-11-15T12:23:37Z by the transcript; by GitHub, PR #324 merged at 2026-11-15T12:28:04Z with the merge commit 70586cede1f9478293959a0d8cdc17097cb48f56; main's CI at that commit: green, 7 runs.*

---

Merge check: PR #324 at 45a945f80aef8a3193b75a4f41b94f9737f66516
Verdict: MERGE

The advisor's verdict under the delegation of 2026-11-13. It is not the human's words. Written on 2026-11-15, from reads made between 12:23Z and 12:27Z.

What the PR is. PLAN node `port-2-macos-l1-and-app-dirs`, filler entry 17, branch `cut/port-2-macos-l1-and-app-dirs`. The macos-latest runner joins the Cargo workspace's test matrix. One application-directory boundary, `engine/src/app_dirs.rs`, replaces the two places that resolved the per-user data folder and the tier root. A case-policy test runs on a case-insensitive volume. KNOWN-LIMITATIONS item 1 states macOS L1 for the workspace, and item 43 names the data folder on each platform.

What I read. The custodian's merge check request. From GitHub: the PR's head, author, base, draft state, files, commits and body; its twenty check rows; the twelve runs at the head; the toolchain lines in the log of the three test jobs of the push run at the head; main's newest runs. From the repository's objects, read only: the branch's commits, the merge base, the diff from the merge base, the diff of the last commit, and the paths main changed since the merge base. On main at ce706a5ed27ca8a77ff0fda39dc73a96f5488511: the form's sections 1, 2 and 7 and its Amendments 6 to 10; the reviewer's gate report and both second parts, whole; the correction worker's report; the gate log's rows for the node; the human's two messages of 2026-10-23 that name this piece. The architect's first report I read whole when I ruled ADV-2026-11-15-12, and the boundary file whole to its tests. My own scripts made every comparison below from git objects. I made no run in the repository.

1. The PR is the custodian's own. Its author is the repository's account, its branch is in this repository, its base is main, and it is out of draft.

2. The head is the one both gates read last.
- Both gates reviewed cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5 in their first parts. The head is one commit on it, the correction commit of ADV-2026-11-15-12, and no commit follows.
- That commit changes words only, by my read of its whole diff: comments and doc comments in four Rust files, one table row in `kernel/PERMISSION-BOUNDARY.md` and two source comments in `KNOWN-LIMITATIONS.md`. No statement of code changes. Its numstat is the six rows the request gives.
- Each gate then read the head in a second part of its report, as ADV-2026-11-15-12 item 5 (c) asks. Each found the nine changes and nothing else.

3. Every gate ended PASS WITH NOTES and every finding is closed.
- The gate log holds two rows for the node, the architect's and the reviewer's, each PASS WITH NOTES at cf5e7c4c, attempt 1. The second parts add no row, which is right: a second part is a re-read, not a new attempt. Neither gate ended FAIL.
- Neither gate has a Correctness or Evidence finding. The reviewer applied all seven mutations, saw each named test fail and reverted each; none survived. It read E0 to E3 by run id.
- The Documentation findings that give words are in the correction commit: the reviewer's D1 and the architect's D2 to D8, each matched by the reviewer's script against the filed words. Item 43's comment (the architect's D10, the reviewer's D2) is ruled by ADV-2026-11-15-12 and checked under 4.
- The record findings are closed by the form's Amendment 10 on main: the architect's D9 and the reviewer's R1 (item 5: the pin at a branch commit is named as historical), D11 (item 6), the reviewer's D7 and R2 (item 7), D5's line (item 8), the reviewer's D6 and the architect's two conditions (items 9 and 10: E1 and E2 read at the head by run id, section 7 recounted).
- The correction worker stopped at its third check on its own wrong timeout. The custodian ran checks 3 to 9 at the head, each with exit code 0 (Amendment 10 item 3). That is by the custodian's record; CI's governance and format runs at the head are green by my read.

4. Nothing on the piece waits for a ruling, and every ruled wording in the diff equals its ruling byte for byte.
- ADV-2026-11-15-12 is filed, holding my file whole. Item 43's first source comment at the head, with its line feed, is 1711 bytes, sha256 974cc0c5a91e63bb69f9407a034d1cf5aeeab58cb491e9074c444e228ffe926c, equal to the line my script built from the earlier head's line and the ruling's two fences. Each fence occurs once.
- I ruled from the reviewer's two sentences as the custodian's packet quoted them. The filed report holds the same two sentences: each, with the changes my ruling names, equals my fence, and each occurs whole in the packet as my session received it.
- Item 43's own line and its second comment are byte-equal to the earlier head's. Against main, `KNOWN-LIMITATIONS.md` differs in four lines only: item 1's macOS line, item 1's source comment, item 43's line and item 43's first comment. Item 43's line differs from main's in one span, the data-folder clause, and the new clause is the form's W3 block, which occurs once in the line. That is the turn ADV-2026-11-13-20 item 5 (f) rules, with the one departure ADV-2026-11-15-12 item 4 allows.
- W3 is the architect's wording, and the human approved it: item 4 of the message of 2026-10-23 holds "W3: yes to the architect's words for item 43".
- The PR body lists the two passages as the advisor's words, with the ruling's id.
- The drafts ADV-2026-11-15-04 and ADV-2026-11-15-07, which wait for the human, belong to other pieces.

5. The diff's files are inside the form's list, and the one workflow change is named by the human.
- The diff from the merge base names sixteen files, the sixteen of the form's section 7. No Cargo manifest, lockfile, licence, Guardian or mod file is among them.
- One CI workflow changes, `.github/workflows/product-ci-rust.yml`. The human's message of 2026-10-23 names it in item 6: macos-latest joins the Cargo workspace's matrix with the same toolchain the Linux L1 job installs, nothing else installed. A second message that day answers the form's OPEN-1 with (a), "within my CI word, it installs nothing".
- The workflow's diff is that and no more, by my read: the header comments, one matrix entry, and one step that prints the macOS version and architecture. The install step is untouched.
- The condition of ADV-2026-11-13-10 item 2 (d): the macOS entry's log at the head shows rustc 1.100.0, the same line as the Linux and Windows entries, and that is the pin's version. I read the three logs myself. The form names no version in its own words, so the closing amendment carries one line with it.
- Section 7's size ceiling is passed: 953 changed lines against 850. The form's Amendments 5, 7 and 10 record it as class 8, and both gates read it.

6. The piece does what was ruled.
- The boundary reads three variables under the form's table: LOCALAPPDATA on Windows; HOME on macOS, under `Library/Application Support`; XDG_DATA_HOME and then HOME on other Unix. A value counts only when it is non-empty and absolute. The tier root resolves on Windows alone, and the other platforms refuse by name.
- The kernel's `data_dir` keeps its name and signature, and its body is one call into the boundary. The tier directory takes its root from the boundary, and its refusal carries the boundary's reason.
- The boundary check's allowlist and its expected map are those of the form's section 2 item 5.
- No dependency is added.
- The form's E1 and E2 hold at the head, by the run ids Amendment 10 gives and by my read of the same runs.

7. CI is green at the head, and no path of the piece changed on main.
- All twenty check rows pass, and the twelve runs at the head are each completed with success (read 12:24Z). The macOS, Linux and Windows test jobs are among them.
- The branch took main in at 8faccf8958016e0d39095d8e53de1d8588623060. From there to ce706a5e main changed 28 paths and none of the sixteen, by my own listing. GitHub's newest runs on main are at ce706a5e, so that is main's head, and its four runs are green (read 12:27Z).

For the closing records, none of it a condition on the merge.
- One line naming the rustc version the macOS entry logs at the head, under 5.
- The reviewer's observation O1: the shell's end-to-end publish script still resolves the audit log by the old rule off Windows. It is not this piece's file. The custodian proposes a node for it and I place it.
- The probe branch stays, never merged, as Amendment 7 records.

After the merge the custodian reads main's CI. Item 1's source comment says what follows from that read: the macOS line holds of main only while later runs of the macOS entry stay green, and if the first push to main after the merge is red, the next PR withdraws it.
