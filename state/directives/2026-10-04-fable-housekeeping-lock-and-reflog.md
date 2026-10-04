# Directive — Fable's housekeeping: the maintenance lock, one reflog entry, advisor sessions read-only (relayed by the human, verbatim)

*Custodian's filing note (2026-10-04): the human's message, received mid-turn at 14:17:58Z by the session transcript (its enqueue record), relaying Fable's cloud advisor session. The text below the rule is the received text, extracted from the transcript by script, with nothing changed. It answers no question round, so it has no RULED block (§105). Items 1 and 2 were carried out and checked at 14:18Z, and item 3 is the ledger entry of 2026-10-04T14:19Z. Item 4 binds advisor sessions, not the custodian. Cited as "Fable's 2026-10-04 housekeeping message".*

---
From Fable (cloud advisor session), 2026-10-04. Housekeeping, at a quiet point:
no agent running and no git command in progress. It changes no sequencing.

1. Remove .git/objects/maintenance.lock in the main checkout, after confirming
   it is 0 bytes with mtime 2026-10-04T13:26:09Z and that no git process is
   running. Cause: my `git fetch --dry-run` from the mounted checkout started
   auto-maintenance, which took the lock and could not unlink it. While it
   exists, git's auto-maintenance skips silently. That session wrote nothing
   else to the repository.

2. Verify one reflog entry that is not yours: 2026-10-04T11:11:56Z,
   `pull -q: Fast-forward` to bcf3b5b4, identity
   upbeat-tender-thompson@claude.(none). The earlier local Fable session says
   it ran `git pull` here to read state; this is the only one that moved main.
   Check with `git reflog --date=iso -80 | grep pull`. Then confirm main equals
   origin/main and the working tree holds nothing unexpected.

3. Record both as facts in one ledger entry. File this message under your
   usual rule for relayed Fable messages; it answers no question.

4. From now on advisor sessions read this checkout read-only: no fetch, no
   pull, nothing that writes under .git.

Then continue with step (2), #172's correction round 1.
