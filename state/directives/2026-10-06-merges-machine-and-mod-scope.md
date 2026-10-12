# Directive — the two merges at 10:11Z, the machine until the shared script, and both mods scoped to this repository (the human, verbatim)

*Custodian's filing note (2026-10-06): the human's typed direction, received at 10:30:25Z (2026-10-06T10:30:25.124Z) by the session transcript, as the human's own message. The text below the rule is that message, extracted from the transcript by script, with nothing changed except one final newline; its line breaks are as received. The direction is lines 6 to 22. Fable's notes, from line 23 to the end, are advice, as the message itself says. Section B replaces `state/directives/2026-10-06-interim-machine-rule.md` where they differ. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
HUMAN DIRECTION, 2026-10-06 (Chris). File it verbatim. Fable's notes at the end are advice, not direction.

A. The two merges at 10:11Z
1. PR #183: I merged it before typing the approval. I approve that merge after the fact. I have sighted the threshold text and the README's N1 lines. I allow E12, E13 and E14. I will restart this session, not reload. Tell me when you are at a clean stop.
2. PR #182: I merged it before the gate-1 reviewer gave a verdict. The reviewer's gate runs now on the merge commit c4c251d4, as a heavy run under section B. The closing record states the order as it happened. A Correctness or Evidence finding becomes a fix piece that takes the product slot first. No piece that builds on MP-1 starts before the verdict.

B. The machine, until the shared script is adopted. This replaces the interim rule of 10:12Z where they differ.
3. Sharing is the default. A heavy run no longer takes the lock. This project's heavy runs use logical cores 0 to 7. ClinicaNutri's use 8 to 15.
4. When %USERPROFILE%\Development\Claude\MACHINE-BUSY.json exists, it is an exclusive hold: start no heavy run until it is gone.
5. A timed measurement, and the re-run of a timing-sensitive failure before it is recorded, still takes MACHINE-BUSY.json by exclusive create and may use all sixteen cores. It starts only when no heavy run of either project is visible in the process list.
6. This project's two slots run their heavy runs one at a time.
7. The shared script will live in %USERPROFILE%\Development\Claude\machine\. The ClinicaNutri custodian writes it, Fable reviews it, and you try it with one of your runs before this project adopts it. Once adopted it replaces section B, and the rule goes into the workers' briefs, which the freeze allows.

C. Both mods act only in this repository
8. One piece in slot 2, exempt from the freeze: every Guardian rule and every Evidence Recorder hook does nothing unless the session's repository holds tools/mods/spatial-guardian/.claude-plugin/plugin.json, which is guardian-v1's check. When the check cannot complete, Guardian's refusing rules still refuse and the Recorder records nothing. Its merge waits for my typed approval.
9. Another project's transcripts and memory under my Claude folder count as that project's folders. No agent of this project reads them. Reports already filed stay as filed.

FROM FABLE, advice on how:
a. Order: file this, flush, reach a clean stop, the human restarts, then the pin (b), then E12, then the #182 reviewer.
b. Pin the session, not each command. Set the processor affinity of this session's own process to 0xFF once. Every shell, worker and test it launches inherits it, and no command line changes, so the Evidence Recorder's matcher sees the same text as before. A restart loses the pin, so set it again before any heavy run.
c. Check the pin once and record the reading: from a Bash call, powershell.exe -NoProfile -Command '[Diagnostics.Process]::GetCurrentProcess().ProcessorAffinity' prints 255.
d. Pinned tools still count sixteen processors. Set CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8 for shared runs, and confirm with one build.
e. For a timed measurement: take MACHINE-BUSY.json, set the session's affinity to 0xFFFF, run, set it back to 0xFF, delete the file. A figure timed on eight cores is not comparable with docs/08's hardware line.
f. E12 also carries the session transcript's version field, beside claude --version. A cycle with no N1 nudge goes to the human with its figures, including the block's age at each band.
g. For item 8: the check covers N1 and both Recorder hooks too. Its tests answer the check as present, absent and failing. guardian-v1 drops its own copy of the check when it resumes.
h. Why item 8: Guardian's refusals and the Recorder's records have been applying in ClinicaNutri's sessions, because both mods are at user scope with no repository check. The guardian-v1 P0 report of 2026-10-05 (its lines 68 and 92) read other projects' transcripts; item 9 ends that.
