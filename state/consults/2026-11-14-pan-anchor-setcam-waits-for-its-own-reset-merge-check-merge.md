# The advisor's merge check of PR #317 at 3bb1d0658381: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 83e7b801

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-317-3bb1d0658381.md in the human's advisory folder and told the custodian by session message, received at 2026-11-14T09:12:49Z by the custodian's transcript; the custodian acts on the file. 5922 bytes, sha256 3acda7f9dc002f3056083188cc68f134d78c5957f72fd1481411aa5b0bcb19f7, last modified at 2026-11-14T09:11:56Z by the file system; read by the custodian at 2026-11-14T09:21:23Z and again at this filing (2026-11-14T09:28:11Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #317 merged at 2026-11-14T09:12:08Z with the merge commit 83e7b8016a4526054d1efd96607938ef20874fe1 (parents 3c6a1f3b and 3bb1d065).*

---

Merge check: PR #317 at 3bb1d0658381258c60e9a6ff34a80854e4d49224
Verdict: MERGE

By the advisor session, under the delegation of 2026-11-13. Checked on 2026-11-14 between 09:09Z and 09:12Z. The piece is `pan-anchor-setcam-waits-for-its-own-reset` (the filler slot): the e2e suite's `setCam` waits for the view-state line its own reset logs. Test code only.

What I read: the PR's fields and checks from GitHub; the whole diff from main to the head and the diff of the last commit alone; the form `governance/forms/frontends/PAN-ANCHOR-SETCAM-WAITS-FOR-ITS-OWN-RESET-PREREGISTRATION.md` at main 3c6a1f3b (its five lines, Amendments 5 to 8); the gate report `state/consults/gates/2026-11-14-pan-anchor-setcam-waits-for-its-own-reset-gate-reviewer.md`, whole; the D1 worker's report; the last row of `state/gate-log.json` (745); `governance/AUTONOMY.md` §31; the human's message of 2026-11-13 (11:48Z) on this merge check; my rulings ADV-2026-11-13-08 and -09 as Amendment 5 records them. I ran no suite and no build.

1. The PR. Opened by the custodian's account from the branch `cut/pan-anchor-setcam-waits-for-its-own-reset` of this repository, based on `main`, out of draft, open. GitHub reads it mergeable and clean (09:11:29Z).

2. The head against the gated head. The single reviewer gated 08bed11cd25066976a116cc6e2dbfb9aa8d647ac. One commit follows it, the head, which applies the gate's D1 words under §31 (d). I checked it by my own script, not by the custodian's:
- the report's old span (201 bytes) is in `setCam`'s joined comment at 08bed11c once, and not at the head;
- the report's replacement words (407 bytes) are in the joined comment at the head once;
- the comment at 08bed11c with the one span replaced equals the comment at the head, byte for byte;
- every line of the file before and after the comment is equal at the two commits. The comment went from 7 lines to 8; the commit is 5 insertions and 4 deletions in the one file.
The sentence is a worker's comment, not the human's wording, so §31 (d) applies: no answer of his is needed, no re-gate, and the PR body lists the words. It does. The human's three conditions of 2026-11-13 were written for a gate that ended FAIL on wording; this gate ended PASS WITH NOTES, and all three hold anyway: the only finding to fix was wording, the words are applied exactly with nothing else changed after the gated head, and the form's Amendment 8 records the closing.

3. The gate. One gate was owed (Amendment 5 item 6, a single reviewer for a five-line form). It ended PASS WITH NOTES at 08bed11c, with no Correctness finding and no Evidence finding. The reviewer made its own four runs, each as predicted: P0 at the base 2/16; P1 at the head 16/16; M-TRACE ended by its 600 s timeout after one check line and 19 progress lines; a loaded run 16/16. Its one finding to fix, D1, is closed by item 2. Its two observations ask for no action: the throw for a seam that does not resolve `true` is exercised by no run, and no record claims it was; the progress line's seconds count sleep turns.

4. Nothing waits. No ruling of mine or of the human is open on this piece. No ruled wording is in the diff: the comment's words are the worker's and the reviewer's. The node for drag's wait (ADV-2026-11-13-09, OPEN-A) is placed only if a loaded series fails on s1 after this merge; it does not hold this piece.

5. The files. One file, `frontends/shell/e2e/pan-anchor.mjs`, 21 insertions and 6 deletions from the branch's merge base with main (695e1303) to the head: 27 lines of the declared 40. It is the form's one Scope file. No dependency, lockfile, CI workflow, licence or mod file changes.

6. What was ruled, against the diff. ADV-2026-11-13-08 item 1 took the first fix, the suite waiting on its own lines with no wall-clock bound that load can break. ADV-2026-11-13-09 took OPEN-B (A): the harness's hard timeout ends a wait that never comes, with a progress line every 30 s. The diff does this and no more:
- the jittered zoom is computed once and passed to the seam;
- the seam's resolved value is read, and anything but `true` throws an Error naming `setCam` and the value;
- the 500 ms minimum stays;
- the loop has no turn limit, sleeps 1000 ms a turn, and on every 30th turn prints a line with none of `PASS`, `FAIL` or `====`;
- `setCam` returns the first line whose zoom equals the zoom it passed.
The second hunk adds the `RECORDED MUTATION` entry for M-TRACE with the 40-hex commit it was observed at. No check, tolerance, case or other helper changes. The comment covers the five points of Amendment 5 item 2. The claim stays inside its limit: `setCam`'s wait only; drag's wait and s1 are not covered, and the comment says so.

7. CI and main. `gh pr checks 317`, read by me at 09:09:44Z and again at 09:11:29Z: 8 rows, all pass (sign-off, exposure scan, ported notices twice, the shell's typecheck, build, vitest and cargo test twice, the tauri build twice). The other workflows are path-filtered and did not run at the head; the reviewer read all 16 rows passing at 08bed11c, and the head differs from it by comment lines in an e2e file that CI does not run. Main is at 3c6a1f3b. Since the branch took main in at 695e1303, main changed nothing under `frontends/shell/e2e/`; its 11 commits are records, forms, the plan, the site and one line of KNOWN-LIMITATIONS.

Two things noted, neither holding the merge:
- The PR body asks for a merge commit that keeps commit 1 (624b2e68) reachable from main. The merge is made with a merge commit, as every merge is.
- The piece took 184 minutes of subagent runs against an estimate of 60 (Amendment 8 item 6). It is recorded, and most of it is suite runs in shared holds.

For PR B: the suite that merges is blob 370fe1494cd4389f4c5679c46d1ccf390501110a. It differs from the blob the provisional reading ran (7642086b) by this comment only; no code line differs. That is answered in a ruling of its own.
