# Directive — the interim machine rule for both of the human's projects on this laptop (the human, verbatim)

*Custodian's filing note (2026-10-06): the human's typed direction, received at 10:12:46Z (2026-10-06T10:12:46.364Z) by the session transcript, as the human's own message. The text below the rule is that message, extracted from the transcript by script, with nothing changed except one final newline; its line breaks are as received. It replaces, where they differ, the rules of `state/directives/2026-10-06-machine-busy-marker.md`, and it gets a DIRECTIVE block in `DECISIONS-PENDING.md`.*

---
HUMAN DIRECTION, 2026-10-06: an interim machine rule, in force now on this laptop for both of my projects, until the agreed rule replaces it.

Principles: neither project has priority. Whoever starts first finishes; nobody stops, slows or kills another project's run. Nobody reads or changes the other project's folders. Only I can grant an exception.

A. Heavy means more than two cores for more than about three minutes, or any timed measurement. Editing, a small build and lint are free.
B. Before a heavy run, create %USERPROFILE%\Development\Claude\MACHINE-BUSY.json by exclusive create, which fails if the file exists. It holds project, who, what, since, expectedUntil (ISO UTC), pid and mode. It is never overwritten, and it is deleted when the run ends, also on failure. The pid is the Windows pid of the process doing the work, not the Git Bash pid and not a launcher that exits.
C. Before starting, look at the process list too. If the other project is visibly running something heavy without a lock, do not start; note it and tell me.

Until the agreed rule: this project's two slots take the lock in turn, one heavy run at a time. A timing-sensitive failure seen while the machine was busy is re-run before it is recorded.
