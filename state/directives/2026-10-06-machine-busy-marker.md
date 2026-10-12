# Directive — the shared machine's heavy-run marker (the human, verbatim)

*Custodian's filing note (2026-10-06): the human's typed standing instruction, received at 06:24:03Z (2026-10-06T06:24:03.403Z) by the session transcript, as the human's own message. The text below the rule is that message, extracted from the transcript by script, with nothing changed except one final newline; its line breaks are as received. It gets a DIRECTIVE block in `DECISIONS-PENDING.md`.*

---
This PC is shared with two other Claude sessions working on another project
(ClinicaNutri). They coordinate heavy runs with a marker file:
%USERPROFILE%\Development\Claude\MACHINE-BUSY.json

From now on, before any heavy run (a build or test of the whole workspace, or anything
that uses several cores for more than a couple of minutes):
1. Read the marker. If it exists, its expectedUntil is in the future and its pid is
   still running, wait and check again every few minutes. Do not overwrite it.
2. If it is absent, expired, or its pid is gone, write your own: a JSON object with
   who, what, since, expectedUntil (ISO UTC times) and pid (the process that does the
   work, not a launcher that exits).
3. Delete the marker when your run ends, also when it fails.

Never read, change or delete anything in the ClinicaNutri folders. If a run cannot
wait, tell me instead of starting it.
