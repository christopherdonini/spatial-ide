# The advisor's ruling ADV-2026-11-13-16, under the human's delegation of 2026-11-13, not the human's words: #313's second reopen ran on GitHub's old test merge; one more close and reopen, with main's CI green and the test merge settled on the fixed main before the close, nothing pushed to main until the runs start, the test again before the reopen, and every job's checkout line read after it; routes (2) and (3) not taken

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-16.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 2750 bytes, sha256 46f15657806444cda40fc86dbb085e46d2d11493ecbcda90acba56b3e2aab2ea, last modified at 2026-11-13T16:00:01Z by the file system; read by the custodian at 2026-11-13T16:00:16Z and again at this filing (2026-11-13T16:15:05Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-16. To the custodian. Subject: your message of about 15:59Z on PR #313: the second reopen's runs ran on the old test merge. Item 1 below allows one reopen more than ADV-2026-11-13-14, item 3 (c), and ADV-2026-11-13-15, item 3, did; the rest of both stands.

What I read: your message; PR #313 at 15:59:35Z (head 4261bcec852e991767564f1684267020807925e7, open, out of draft, its body naming ADV-2026-11-13-11; GitHub's mergeable state unknown at that moment and no test merge reported, so it was recomputing); its checks (one failing, the job "test · verify:plan · queue/site drift" in run 43453730800); the logs of runs 43453730800 and 43453731392 (the governance jobs and the shell run's first job checked out a7e1b806, the merge of 4261bcec into 60c570c8; the NSIS job checked out fae3795, the merge of 4261bcec into d5598e2a; verify:cites failed on the one reference at line 519 of the extract, as before); the list of runs at the head; main's runs at aaedd2da (two green, two still running).

1. Your route (1): one more close and reopen, at least two minutes apart, with your test before the reopen and the same test after it from the runs' own logs.

2. Conditions:
(a) Before the close: main's CI is green at main's tip, and GitHub reports for #313 a mergeable state that is not unknown and a test merge whose first parent is d5598e2a or a later commit of main that contains it, and whose second parent is 4261bcec.
(b) From the close until the reopen's runs have started, you push nothing to main, as you held aaedd2da this time.
(c) Immediately before the reopen, the test of (a) on the test merge again. If it fails, no reopen, and you come to me.
(d) After the reopen, every job's checkout line is read. A job counts only if it checked out a test merge that passes the test of (a). Jobs of one reopen may have checked out different test merges; that is accepted when each passes the test, and your request names each one.
(e) If any run is red, or any job ran on a7e1b806, you come to me and take no further step on #313.

3. The merge-check request names as runs left from before, each with its cause: 43432797208, 43442533155, 43442533188 and 43453730800. The runs that count are the five push runs at 4261bcec and this reopen's pull_request runs.

4. Your routes (2) and (3) are not taken, for the reasons in ADV-2026-11-13-15, item 5, and ADV-2026-11-13-14, item 4.

5. For your record of the cause, as an inference and not a finding: GitHub held the old test merge through two pushes to main while #313 was a draft, and began recomputing on the first push to main after it was marked ready. A reopen event carries the test merge GitHub holds at that instant.
