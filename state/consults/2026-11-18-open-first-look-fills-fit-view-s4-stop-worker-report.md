Built: open-first-look-fills-fit-view S2's remainder and S4, worker (the custodian's filing note, 2026-11-18: the Sonnet worker, model claude-sonnet-5-5, resumed 2026-11-18T18:59:48Z, its report at 19:30:35Z by its transcript; 3231 bytes, sha256 e11a5105df7b570cfd37468edc9e79130edafa625fd5505148b70f857271df3d; below byte for byte; 2 spans masked, each marked where it stood, with this note and one final newline)
Result: STOP at S4 step 7. The E-FL base run exited 2 (VOID: precondition unmet), so P-E-base is not read. I did not run step E (debug exe) or step F (the two suites). This report is partial: it covers the start state, S4 steps 3 to 6 and the step-7 STOP. S2's remainder (B) and the harness check (D) are not reported here, and I never reached E or F.

START: HEAD was B (349cec82). Porcelain empty. Fixture 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49. C: 49G free, D: 367G free.

S4 STATE:
- Script `frontends/shell/e2e/open-fills-fit-view.mjs` (251 lines), plus the `package.json` entry `e2e:open-fills-fit-view`, committed as E = ff3c1465eea3724c3840485febb2a5da05765623. Pushed: `ls-remote` prints E.
- Measure build: rc 0. Its log says "Finished `release` profile [optimized] target(s) in 21m 51s".
- Exe `D:/wt-targets/fl/release/spatial-ide-shell.exe`: 72475648 bytes, mtime <masked under ADV-2026-11-18-07 item 2; in UTC 2026-11-18T19:27:32Z by its step-B report>, sha256 d8309b1ecc1906d597a07e9a04d1d17ed57da3a07dc88472a6189bbc541148d9.
- Porcelain empty after the build.

E-FL BASE RUN (once, shared hold, `timeout 900`): rc=2.
- Log first line: blank. The log is 413 bytes, sha256 23c1bb4ddb38b2d121099dd670d9401fd8c5cc27cefd928e5ffc4c315c1a71ea.
- The only result lines, byte-copied:
  `precondition: first stream-issued sh_5d3eabaefde3b8ee95cf950eea1ee9a8, its batch rows 10000 (need 10000), fit view-state seen, describe.extent basis not-established-at-open, value null`
  `VOID  the precondition is unmet -- not a PASS (checks recorded before it: 0)`
- Reading: two of the three precondition parts hold. The first stream's batch rows are 10000 (≥10,000) and a fit view-state was seen. The third fails: the `describe.extent` line at open carries basis `not-established-at-open` and a null value.
- So the script's precondition requires an extent value that the shipped base does not emit at open. This is either I2 (precondition fails at the base) or a script defect, because I read the extent line wrongly. The custodian decides which. I did not edit the script or re-run, per the brief.
- Open question for the custodian: should (d) and (e) take the extent from a later `describe.extent` line, or from another source? The script only reads the at-open line.

MACHINE lines (masked):
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:54496 also=<m> (commands started from now on inherit it; release when done)
- MACHINE_RELEASED project=SpatialIDE shell=bash.exe:54496 affinity=FF (cores 0-7)
- The measure-build hold printed the same two lines with shell=bash.exe:41696 and also=<m>.

END STATE: HEAD = E, porcelain empty, ls-remote prints E. Fixture re-checked: 29933646 bytes, sha256 fd0c74ab… (unchanged). `df -h`: C: 49G free, D: 367G free.

Off-scope: none. Nothing was done that neither text names, except that the E-FL rc went to `<S>/fl1-efl-base.rc` and the log to `<S>/fl1-efl-base.log`, with `<S>` = <masked: a profile path, the custodian's scratch folder>.

Model: Sonnet 5.5 (claude-sonnet-5-5). No override. One context handoff received (the compaction summary).
