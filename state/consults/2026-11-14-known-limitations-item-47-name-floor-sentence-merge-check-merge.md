# The advisor's merge check of PR #316 at 4e9984fc94f1: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 73bd322b

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-316-4e9984fc94f1.md in the human's advisory folder and told the custodian by session message; the custodian acts on the file. 4394 bytes, sha256 c24480ac76577aafca8bbcc08a3101d9eddcc48510334d56545568ba6ab73547, last modified at 2026-11-14T01:24:48Z by the file system; read by the custodian at 2026-11-14T01:26:08Z and again at this filing (2026-11-14T01:29:15Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #316 merged at 2026-11-14T01:25:00Z with the merge commit 73bd322bc2bd31589ef153195e37d4ebe958675a (parents 6596095d and 4e9984fc).*

---

Merge check: PR #316 at 4e9984fc94f1f08cbce7f84bd11ebc8c41add001
Verdict: MERGE

Written by the advisor session under the human's delegation of 2026-11-13. The piece is `known-limitations-item-47-name-floor-sentence` (the docs lane): one sentence added to the end of KNOWN-LIMITATIONS item 47, in the human's words by approval, with one source comment line below it.

What I read: the PR as GitHub reports it at 01:24Z on 2026-11-14 (head, author, branch, base, draft state, files, commits, body, checks); the form `governance/forms/root/KNOWN-LIMITATIONS-ITEM-47-NAME-FLOOR-SENTENCE-PREREGISTRATION.md` on main, whole; the gate report `state/consults/gates/2026-11-14-known-limitations-item-47-name-floor-sentence-gate-reviewer.md` on main at 6596095d, whole; line 33 of the human's third message of 2026-11-12 (21:15Z) as filed; line 17 of `state/consults/2026-11-12-known-limitations-redaction-name-floor-check-and-draft.md`; `KNOWN-LIMITATIONS.md` at the base 5b5fb0a3, at the head and on main; `kernel/src/bundle/redaction.rs` at the base and on main, lines 121 to 170; the head commit's message; the node's PLAN record.

1. The PR. Opened by the custodian's account, from the branch `cut/known-limitations-item-47-name-floor-sentence` of this repository, based on `main`, out of draft. One commit, signed off.

2. The head. The single reviewer gate reviewed 4e9984fc94f1f08cbce7f84bd11ebc8c41add001, and that is the PR's head. No commit follows the gated head.

3. The gate. The form is a five-line form with a single reviewer gate. The report's verdict is PASS WITH NOTES, with no blocking finding. Its three notes ask for no change to the PR: N1 is an error in the custodian's brief (the form of the path scan's `--range`), and the reviewer ran the right form; N2 and N3 are observations on the human's sentence that offer no words. The report also names a process departure by the worker (one `sed -i` edit of its own build script) and finds the result does not depend on it. That goes to question round 77; nothing in the PR changes for it.

4. Nothing waits for a ruling, and the wordings are equal to their sources. I checked these by script, not by eye:
(a) The diff against the base is one replaced line and one added line: line 454 of the file gains text at its end, and a new line 455 follows. Nothing else in the file differs.
(b) The head's line 454 is the base's line 454, then one space, then the sentence of the form's §A. That sentence is the text of the consult's line 17 after its quote marker, byte for byte. The human approved it as (A) in item 7 of the message named above ("my words by approval").
(c) The head's line 455 is the form's §B with its four pins filled in at the base, byte for byte. It is the custodian's wording, not the human's, and the PR body says so.
(d) The four pins: I recomputed each sha256 over its lines of `kernel/src/bundle/redaction.rs` at 5b5fb0a3, and each equals the comment's value. That file is the same on main today.
(e) N2 and N3 concern the human's own sentence. Neither says a clause is untrue as an operator can observe it, and the form has the reviewer change no word. The digest lists both for the human; they do not hold the merge.

5. The files. One file, `KNOWN-LIMITATIONS.md`, 2 insertions and 1 deletion, inside the form's Scope and its budget of 3 changed lines. No dependency, lockfile, workflow, licence or mod file.

6. The piece does what was ruled. The human placed this sentence at the end of item 47, in the docs lane. I read the code the sentence describes: a login name is kept for the search only at 3 bytes or more; the computer names from `COMPUTERNAME` and `HOSTNAME`, and the machine's own name when neither gives one, are kept under the same floor. The sentence says that, and no other item is edited or renumbered.

7. CI and main. `gh pr checks` at 01:24Z: four checks, all pass (sign-off, no profile path in the range, ported-notices twice). Governance CI does not run on this PR because its path filters do not list this file; the reviewer ran `verify-cites` and `verify-quotes` at the head and both passed, and I rest on that for the comment's cites. GitHub reports the PR mergeable and clean. On main, neither `KNOWN-LIMITATIONS.md` nor `kernel/src/bundle/redaction.rs` has changed since the base 5b5fb0a3 (main is 6596095d).

Not a Guardian or mod change, and nothing the human has put on hold.
