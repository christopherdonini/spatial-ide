# Directive — the fourth of 2026-10-06: the machine script adopted for shared runs, exclusive holds on check 4, and THE MACHINE paragraph for every heavy-run brief (the human, verbatim)

*Custodian's filing note (2026-10-06): the human's typed direction, received at 17:11:45Z (2026-10-06T17:11:45.383Z) by the session transcript, as pasted content in the human's own message. The text below the rule is the pasted text, extracted from the transcript by script, with nothing changed; its line breaks are as received. The direction is lines 6 to 23, and the paragraph its item 3 puts into briefs as written is lines 12 to 22. Fable's notes, from line 24 to the end, are advice, as the message itself says. The message names no other project, so no name was replaced. It changes item 4 of `state/directives/2026-10-06-probes-readme-node-and-script-adoption.md`, and replaces section B of `state/directives/2026-10-06-merges-machine-and-mod-scope.md` except section B's items numbered 5 (until check 4 passes) and 6. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
HUMAN DIRECTION, 2026-10-06 (Chris), the fourth of today. File it verbatim. Fable's notes at the end are advice, not direction.

1. The machine script is adopted for this project's shared runs now. Fable has read its third version whole, and the trial's checks 1, 2, 3 and 5 passed. This changes item 4 of my third direction. Runs already dispatched finish as they were dispatched.
2. Exclusive holds from this project start when check 4 passes. Until then a timed measurement follows line 5 of section B of this morning's first direction. The rest of section B is replaced by the script, except line 6: the two slots still run their heavy runs one at a time.
3. Put the paragraph below, as written, into every brief whose agent may run a heavy command (worker, worker-high, tester, tester-high, reviewer), and follow it yourself.

THE MACHINE (a shared laptop; the human's rule of 2026-10-06)
- Heavy means more than two cores for more than about three minutes, or any timed measurement. Editing, lint and a small build are free.
- Every heavy command runs inside a shared hold, in one Bash call of this shape, where <M> is the script's path as the custodian gives it:
  cd <dir> && powershell.exe -NoProfile -ExecutionPolicy Bypass -File <M> hold shared -Project SpatialIDE -What "<piece>: <what runs>" -Minutes <estimate> -MaxWaitMinutes <wait> && <the command> ; rc=$? ; powershell.exe -NoProfile -ExecutionPolicy Bypass -File <M> release -Project SpatialIDE ; exit $rc
- cd comes first. The command is its own step: not inside braces or parentheses, and not an argument of the script. The line holds no $( ), backtick or heredoc.
- <wait> is shorter than the call's own timeout, so that a refused hold comes back with its reason instead of being cut off.
- Set CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8: this project's half is eight logical cores.
- Exit codes 96 to 99 come from the script, not from the command. They mean the hold was not granted or the script failed. Do not run the command another way: report the code and the script's output to the custodian.
- A timing-sensitive failure seen in a shared run is not recorded as a failure. Report it to the custodian, who re-runs it alone on the machine.
- The -What text is read by every project on the machine: name the piece and the command, nothing else.
- Never: the script's run, book or cancel actions; -TargetPid; an exclusive hold; a change to any file in the script's folder; reading or quoting another project's lines in its log; stopping or slowing a process you did not start.

FROM FABLE:
a. Exclusive holds are the custodian's alone: one Bash call holding hold exclusive -Minutes <n>, the command and release, with -NotQuietMinutes and -MaxWaitMinutes below the call's timeout. Drop the two job settings there. Over 30 minutes, book at least an hour ahead under SpatialIDE.
b. A 96 whose reading names another heavy run means try again when status shows none. A 96 for CPU or cool-down goes to the human.
c. The session's pin to cores 0 to 7 stays, set again after each restart. It covers a heavy command started without a hold by mistake.
d. The script honours MACHINE-BUSY.json itself while its process lives, so no separate check is needed before a shared hold.
e. The script as read: 684 lines, last changed 16:33:15Z, sha256 6826d814d961e3e15fadd9f9a79c6e0d5f7c695fad5a09e878376e9e9f33ea2b. If the file differs at a later reading, tell the human before the next heavy run.
