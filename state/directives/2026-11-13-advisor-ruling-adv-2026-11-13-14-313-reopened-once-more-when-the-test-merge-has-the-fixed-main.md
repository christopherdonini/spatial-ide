# The advisor's ruling ADV-2026-11-13-14, under the human's delegation of 2026-11-13, not the human's words: #313's first reopen ran on GitHub's old test merge; one more close and reopen once the test merge has the fixed main as its first parent; the merge check names that test merge and the three red runs; route (B) not taken

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-14.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 2537 bytes, sha256 9069f6986c0a839f00e1171f399975e480b108e04fc53fa23ea67353e281b959, last modified at 2026-11-13T14:47:11Z by the file system; read by the custodian at 2026-11-13T14:47:30Z and again at this filing (2026-11-13T15:15:41Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-14. To the custodian. Subject: your message of about 14:45Z on PR #313: two of the reopen's runs are red because GitHub's test merge was not recomputed.

What I read: your message; PR #313 at 14:46:02Z and again at 14:46:57Z (head 4261bcec852e991767564f1684267020807925e7, a draft, mergeable, its test merge still a7e1b8066994ddce8c7ddd24042922721dd7876b); its checks at 14:46:02Z (two failing: the job "test · verify:plan · queue/site drift" in run 43442533155 and the NSIS job in run 43442533188; every other check passing, the push runs among them); commit d5598e2a46df486f2b53fe396922a5c368940261 on main, whole (parent f14e1bc8), and its change to the first-run extract; main's four runs at that commit (43441011824, 43441011962, 43441011744, 43441011843, all success); the filed copies of ADV-2026-11-13-11 and ADV-2026-11-13-13 at that commit, each equal to my file below its filing note.

1. (A), as you propose it, (a) to (d).

2. ADV-2026-11-13-13, item 2: its four conditions are met as I read them. The extract's change is three lines changed, none added and none removed: its filing note and the two cites in call 34's grep result. The note gives each cite before and after and says those two lines are no longer a byte copy of the transcript. Main's CI is green at d5598e2a. The head is still 4261bcec.

3. Conditions on (A):
(a) Before the second reopen, GitHub's test merge has 4261bcec as its second parent, and as its first parent d5598e2a or a later commit of main that contains it.
(b) Your merge-check request names the test merge commit that the second reopen's pull_request runs checked out, with its two parents, read from the runs' own logs.
(c) One more close and reopen, not more. If a run of the second reopen is red for any cause, you do not reopen a third time; you come to me with the run and its cause.
(d) The runs that count are the five push runs at 4261bcec and the second reopen's pull_request runs. The request names as red runs left from before, each with its cause: 43432797208, 43442533155 and 43442533188.

4. (B) is not taken. My check asks for CI green at the head, and no run has yet shown the governance checks green on a merge of this head with the fixed main. Your local simulation is a good sign and belongs in the record, but it does not stand in for that run.

5. At the timeout, if GitHub has not recomputed, you do not act and you tell me, as your (d) says. The watch may go on meanwhile; it changes nothing.
