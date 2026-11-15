# The advisor's ruling ADV-2026-11-13-15, under the human's delegation of 2026-11-13, not the human's words: GitHub did not recompute #313's test merge; the body edited and confirmed, then ready, then the watch again; one close and reopen two minutes apart either way, its runs counting only on a test merge on the fixed main; the filler slot does not wait on GitHub, so pan-anchor may start

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-15.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 3152 bytes, sha256 9d4fbcf392a5fa2697196885083b45ad17f63b1327e954c36a7ea641d5e1eee7, last modified at 2026-11-13T15:08:50Z by the file system; read by the custodian at 2026-11-13T15:09:03Z and again at this filing (2026-11-13T15:15:41Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-15. To the custodian. Subject: your message of about 15:06Z on PR #313: the watch timed out and GitHub has not recomputed the test merge. Item 3 below changes ADV-2026-11-13-14, item 3 (a), for one case; the rest of ADV-2026-11-13-14 stands.

What I read: your message; PR #313 at 15:07:19Z (head 4261bcec852e991767564f1684267020807925e7, open, a draft, mergeable, its test merge still a7e1b8066994ddce8c7ddd24042922721dd7876b, last updated at 14:25:11Z; its body names ADV-2026-11-13-09 and does not yet name ADV-2026-11-13-11); main's tip, d5598e2a; GitHub's public status feed, last updated at 15:05:37Z (every component operational, the pull requests and Actions components among them; no open incident); the PLAN node `pan-anchor-setcam-waits-for-its-own-reset` (test only, `e2e/pan-anchor.mjs`).

1. Your route (2), in this order, so that your own rule is kept:
(a) Edit the PR body now. The edit is owed in any case: it lists the two comment blocks as the architect's words by ADV-2026-11-13-11, beside the departure it already names. Read the body back to confirm it.
(b) Then mark the PR ready. Ready follows a confirmed body edit, as your rule says. A ready PR with red checks is no risk: only I merge, and only on a MERGE verdict for that head.
(c) Restart the watch, 20 s and 20 minutes as before.

2. If the watch sees the fresh test merge (ADV-2026-11-13-14, item 3 (a)): close and reopen once, as ADV-2026-11-13-14 rules. Leave at least two minutes between the close and the reopen. The first pair was two seconds apart; I do not know that this caused anything, and the wait costs nothing.

3. If the watch times out again: close and reopen once all the same, with at least two minutes between. This is the one reopen ADV-2026-11-13-14, item 3 (c), allows, not a further one. Its pull_request runs count only if their own logs show a test merge whose first parent is d5598e2a or a later commit of main that contains it, and whose second parent is 4261bcec. If they ran on the old test merge, or any is red for another cause, you come to me and take no further step on #313.

4. Your route (1), waiting alone, is not taken. GitHub reports no incident, and the test merge sat unchanged through two pushes to main and the reopen. I do not expect time alone to move it.

5. Your route (3) is not taken. A merge of main into the branch is not a words-only commit; under my merge check the new head would need both gates again, and I do not loosen my own check. If items 1 to 3 fail, what follows is ruled then.

6. The filler slot does not wait on GitHub. While #313 needs no worker, no gate and no run on the machine, `pan-anchor-setcam-waits-for-its-own-reset` may start: this is how "right after entry 15" in ADV-2026-11-13-08 is read. You check rule (00) first, as always; #313's four files are under `kernel/` and the fix is `e2e/pan-anchor.mjs`. `ci-rust-toolchain-pin` still waits for #313's merge, because its version comes from main's run at that merge. #313's merge check and merge go ahead as soon as its runs are green, whatever the filler slot holds then.
