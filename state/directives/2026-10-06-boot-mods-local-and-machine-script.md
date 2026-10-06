# Directive — the second of 2026-10-06: the boot, the mods at local scope (C.8 withdrawn), other projects off limits, the public repository's naming rule, the P0 scratch deletion and the machine script (the human, verbatim)

*Custodian's filing note (2026-10-06): the human's typed direction, received at 16:20:13Z (2026-10-06T16:20:13.631Z) by the session transcript, as the human's own message, the first of session da685a21. The message arrived as pasted text; the harness's paste markers around it are not part of it and are not filed. The text below the rule is the pasted text, extracted from the transcript by script, with nothing changed; its line breaks are as received. The direction is lines 6 to 19. Fable's notes, from line 20 to the end, are advice, as the message itself says. Item 3: the message names no other project, so no name was replaced. Item 1 withdraws section C, item 8 of `state/directives/2026-10-06-merges-machine-and-mod-scope.md`; item 9 there stands. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
HUMAN DIRECTION, 2026-10-06 (Chris), the second of today. File it verbatim. Fable's notes at the end are advice, not direction.

0. You are the custodian of this repository for this session. Boot the usual way before anything else:
   - The previous custodian session (128d8fa3) is closed, by me. Its lease is stale. Verify that origin/main equals the flush commit the SESSION-CONTINUITY block records and that the working tree is as that block describes, then take the lease as this session's id and arm the commit-msg fence. If either check fails, hold and tell me.
   - Read in AUTONOMY section 0's order: state/CUT-STATE.md (the SESSION-CONTINUITY block first), CUSTODIAN-QUEUE.md, DECISIONS-PENDING.md, state/directives/ newest first, PRECEDENTS.md, then AUTONOMY.md and AI_DEVELOPMENT.md.
   - Check PLAN.yaml with the plan check, and read CI on main, before any dispatch.
   - Then file this direction and continue with the block's intended sequencing, as changed below.

1. Mod scope. Before starting this session I moved both mods from user scope to local scope for this repository myself (uninstalled at user scope, installed at local scope from the main checkout), then restarted. Section C, item 8 of this morning's direction (the code check) is withdrawn, so the block's step R6 places no C.8 piece and slot 2 goes to kernel-close-races-followups. Item 9 stands.
2. Other projects. No agent of this project reads another project's transcripts, memory or folders, and the same holds the other way.
3. This repository is public. From now, nothing filed here names the other project or states facts about it: write "the other project". If a message of mine names it, file it with the name replaced by [the other project] and say so in the filing note.
4. Delete the scratch files of the guardian-v1 P0 run that hold lines from other projects' transcripts, if they still exist, and tell me what was deleted.
5. The machine script. This project's name in it is SpatialIDE. Use hold and release, not the wrapper, once the changed version is there. The trial run is yours, and Fable reads the result.

FROM FABLE:
a. Right after the lease: claude plugin list shows both mods at scope local. If either is missing or at user scope, stop and tell the human. Record both entries (scope, install path) as the new install row. The forms' and READMEs' user-scope lines are corrected in the usual way.
b. Then the block's steps R2 to R5 as written: the pin, E12, #182's reviewer on c4c251d4, both closing records. Set the pin before any build or other heavy run. Only R6 changes (item 1).
c. The flush commit was 39ccad91 when Fable read main at 16:12Z.
d. guardian-v1, when it resumes: its G8 must also cover the repository's .claude/settings.local.json, where the install record now lives. Add this to its resume notes.
e. The line shape the Recorder recognises, read from planFor: cd <dir> && <hold> && cargo test ... ; rc=$? ; <release> ; exit $rc
   - cd comes first, or the record loses its tree reading.
   - The test command is its own step: not inside braces or parentheses, and not an argument of the script.
   - No $( ), backtick or heredoc anywhere on the line, or the whole line is skipped.
   - The script's path is written with forward slashes and without the user's name.
f. The trial checks: a record is written for the line in e; the exit code is the test's; after a line that is killed before release, status shows the hold as stale; hold exclusive gives all sixteen cores from the pinned session and release puts the shell back on 0 to 7; the auto-mode classifier lets the powershell.exe call through.
g. From the script's log, quote only this project's lines.
