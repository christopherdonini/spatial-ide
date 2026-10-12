# Directive — the third of 2026-10-06: Guardian probes after #182's reviewer and at the next session start, the earlier files left as filed, mods-readme-local-scope placed in slot 2, and the machine script's adoption on check 4 (the human, verbatim)

*Custodian's filing note (2026-10-06): the human's typed direction, received mid-turn at 17:01:34Z (2026-10-06T17:01:34.273Z) by the transcript's enqueue record, as pasted content. The text below the rule is the pasted text, extracted from the transcript by script, with nothing changed; its line breaks are as received. The direction is lines 6 to 12. Fable's notes, from line 13 to the end, are advice, as the message itself says. The message names no other project, so no name was replaced. Item 3 places the proposed node `mods-readme-local-scope`. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
HUMAN DIRECTION, 2026-10-06 (Chris), the third of today. File it verbatim. Fable's notes at the end are advice, not direction.

1. Guardian probes. E1 to E3, as the Guardian v0 form's section 4 defines them, run once after #182's reviewer has finished, with no agent running, and once at the next session start. Record each as class 1 rows. At the next session start, also check that the plugin list shows both mods at scope local and that the Recorder writes a record for the first approved command.
2. The earlier files that name the other project stay as filed. No history is rewritten.
3. mods-readme-local-scope is placed in slot 2 now, ahead of kernel-close-races-followups, exempt from the freeze. Docs only. It has no E-rows; my click on the merge is the approval.
4. The machine script. When check 4 passes as Fable's note b describes, this project adopts the script: it replaces section B of this morning's first direction, and the rule goes into the workers' briefs. If check 4 fails, hold and tell me.

FROM FABLE:
a. Check 3 passes. A hold whose shell died is removed and logged; that is the behaviour wanted, and my wording was loose.
b. Check 4, from the pinned session: one Bash call holding hold exclusive, a command that reads its own affinity, and release. Pass means: the command reads 65535, the log line says mode=exclusive cores=all, and a fresh call after release reads 255. Set -NotQuietMinutes and -MaxWaitMinutes so the script gives up (96 or 97) before the Bash call's own timeout. If the call is killed while waiting, confirm the queue place is gone.
c. Exit codes 96 to 99 from a held line mean the script did not grant the hold. They are not test results; cargo's failure code is 101.
d. Never use -TargetPid on this session's own process. Such a hold never goes stale, and a missed release would block the other project's shared runs.
e. In briefs: shared runs keep CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8, and exclusive runs drop them. Both projects read the -What text, so keep it neutral.
f. After adoption, a timed measurement uses hold exclusive. This morning's note about widening the session's own affinity no longer applies.
