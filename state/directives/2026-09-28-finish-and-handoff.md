# Directive — finish, then hand off; two rulings for C-1's gate 2 (Fable, relayed by the human, verbatim)

*Custodian's filing note (2026-09-28): the human's message received at about 20:40Z, sent as pasted text. It holds Fable's instructions: two rulings for C-1's second gate, the should-fixes, the finishing order, and the handoff checklist a–e. It is recorded verbatim below the rule, as received. It arrived after C-1's correction round 1 had finished (ad2e692) and while gate 2 was running. The architect's gate 2 had already passed at c7f1afb, and it had ruled the helper scope the same way ruling 1 does. Cited as "the 2026-09-28 finish-and-handoff directive" with its item numbers.*

---

Fable, 2026-09-28: finish, then hand off. Nothing new starts in this session.

Two rulings for C-1's second gate, so it doesn't stall:
1. Helpers pulled out of arm are within the form's "arm" scope if all three hold: they're private to
   engine/src/watch.rs; they're called only from arm's path (arm itself and the watch thread's
   handshake); and they move no behaviour out of the module. The scope line limits behaviour, not
   function names. Send this ruling with the gate-2 dispatch.
2. The supersession of the watcher preregistration's arming steps 4–6 goes in a tracked record: a dated
   amendment to C-1's own preregistration that names the section and steps it supersedes and what
   replaces them. The watcher preregistration stays untouched. The PR description quotes the amendment.
On the should-fixes:
- The handshake must refuse, never panic. A watch thread that dies before replying maps to the same
  typed arm-time refusal.
- Before the opening thread exits, the regression test first asserts that describe reports
  coverage: watching. Otherwise the test passes vacuously.

Finish, in this order:
1. C-1: correction round 1, then gate 2, then a PR with Windows CI green, then the human's merge click,
   then the post-merge checks, then the node is done. The hard stop stays at 21:31Z.
   - If gate 2 fails or time runs out, block the node per rule 7, record the exact resume point (branch
     head, open findings, what the next round must do), and ask the human. Don't start a second round
     under time pressure.
   - If the PR is ready but the human hasn't clicked, park it at "PR ready" with its resume point.
2. #140's post-merge checks, once C-1's builds finish. Then mark the node done.
3. Start nothing new. B-1's P0 is the next session's first item after C-1.

Then the handoff. "Nothing left undone" means every open thread is either finished or parked with an
owner and a resume point:
a. The working tree on main is clean. The only exceptions are .codex-remote-attachments/ and target/,
   which aren't yours.
b. Branches: list every remote branch with its disposition.
   - Delete only branches fully merged into main (check with `git branch -r --merged origin/main`).
     Never force-push.
   - Keep the unmerged evidence branches cited by filings (cloud/wave2-A1, -A2 and -C) until their fixes
     land, and say so.
c. Scratch worktrees under C:/dev/wt/: remove one only if everything its filing cites is committed
   elsewhere. Otherwise keep it and list it.
d. The session-continuity block must include:
   - C-1's state: done, or blocked or parked with its resume point.
   - The queue, in order: C-1 if unfinished; then B-1's P0 (its measured coercion table and proposal
     come to Fable before any code); then A2-1, which waits for B1's close. B1's close waits for the
     migration plan, and the migration plan waits for the human's O-07.
   - What waits on the human: accepting ADR-034, the O-07 walkthrough, C-1's merge click if still
     pending, and any DECISIONS-PENDING entries, by number.
   - The 2026-10-02 weekly window.
   - The cloud credit: $201 left, expiring 2026-11-04 23:59 PT; no wave 3 is authorised.
   - The three S2 nodes and the close-races follow-ups, all still proposed.
e. Commit the flush, push, relinquish the lease, and tell the human it's safe to clear.
