Reviewed: state/consults/2026-10-17-source-changed-post-route-s5d-race-step-1-custodian-runs.md at main e20edcf3878e46d9d8ed0c07b295f240e9586750
Verdict: PASS WITH NOTES

No Correctness or Evidence finding. Every row matches its artifacts, every class is right by §1.5, and the outcome is O3 by §1.6's order. Eight Documentation findings follow. They must be fixed before the record is relied on, with no re-gate. None of them is the human's wording: they are all the custodian's own record sentences, so the custodian applies the words below and the PR body lists them (AUTONOMY §31).

## Correctness
None.

## Evidence
None. What was checked:

**Check 1 (every row against its artifacts).** A script of my own compared the record with its artifacts: 1481 comparisons, 0 mismatches.
- **Hold lines.** The three hold blocks equal the MACHINE_ lines of the three hold outputs, whole and in order. Every one is this project's line or reads others=none.
- **Exe.** It recomputes to f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f (100047872 bytes), the same value as all three summaries.
- **Each of the 32 rows:**
  - The report name matches the summary line and the suite log's Report: line.
  - The report copy and the session-log copy are byte-identical to their sources.
  - `launched` is true and the route is post (all 33 report copies).
  - The run window and suite exit match; the suite log's rc agrees.
  - "fixtures unchanged" holds, and the fixture hash files before and after the run are equal.
  - Steps match both the report and the suite log's table.
  - t_touch equals the summary's mtime less 120 000.
  - The first new stream-issued entry, its receive time and the S4 count match. I computed them independently from allConsoleEntries at S4's own "N -> M" note.
  - The session-log lines after the baseline match exactly, and equal S5d's own evidence where it failed.
  - The status message matches.
  - The P and W lines are complete and in order.
  - Every gap recomputes.
  - Each capture's own `session log:` line names its own run's session log, which is a stronger proof than deviation 2's offset argument.
- The B15 refused line matches byte for byte, including its trailing space.
- All 33 suite logs name head be6aa620.

**Check 2 (classes).** I read F8's two fixed details at be6aa620 in kernel/src/skp.rs. Lines 1619-1624 and 1501-1505 hash to the form's pins, and the diff from c5f86b20 to be6aa620 over kernel/, the shell's src and src-tauri, and source-changed.mjs is empty.
- A5 and the series pre-flight carry the live-generation detail, so C1 is right.
- B13 and B16 carry `{mtime}`, the descriptor finding the form's source-changed.mjs:70-71 shows, so C2 is right.
- P and W have exactly one emitter each at base (lib.rs:636, skp.rs:1162). The F9 pins recompute.
- Every S5d failure has the refusal message and a session-ended line, so none is on the first condition.

**Check 3 (outcome).** O4 matches nothing among the 30 known runs: no S5a, S5b or S5c failure, no first-condition failure, no session-ended line without W, no C3. O3 matches A5, B13 and B16, which is what the record says.
- The record is right by the form that neither pre-flight enters the outcome. §1.3 calls the pre-flight "not counted", and Amendment 2 item 1 says the same of the first attempt's. Counting them would change nothing: the series pre-flight would be one more W-without-P run, and the first attempt's is P and W.
- The record's statement on the lost B9 capture is right. B9 passed S5d with a session-ended line and no refusal, so a capture with neither line would match O4's third condition, which comes first. With W alone it would be one more O3 run; with P it adds nothing.

**Check 4 (deviations 1 to 5).**
- Deviation 1 is true but incomplete (D5).
- Deviation 2 is right.
- Deviation 3 is right: series1's STOP line is there, and its hold call exited 82.
- Deviation 4 describes what the script does:
  - The PID wait loop inside run_one's probe branch has no `local i`, so it overwrote the extension loop's `i`.
  - The loop's list was expanded up front, so the order held: the B9 slot ran under the name B15, and the next slot was A10.
  - When the B15 slot came, run-suite.sh exited 94 at its log-exists test, before any write, and no app was launched.
- Deviation 5's account of the stderr copy is right. The copy is byte-identical to A15's and names A15's session log (session-1792261278.log). It omits the runner overwrite (D3).
- No other row's artifacts were overwritten. The refused slot writes only extension-B15.* and appends one summary line.

**Check 5.** The record makes no timing claim, has no p50 or p95, and compares no arms. Its hold lines are this project's only. It holds no profile path and no line cite into `DECISIONS-PENDING.md`.

**Not checked.** The record says the build ran "in a shared hold", but no output of that hold was named to this gate, so I could not check it. build.log shows a finished build.

## Documentation (must-fix before the record is relied on)

**D1. The pre-flight headings cite the wrong deviation.** Deviation 4 is about the B15 name. The builder appends that note whenever a file's name differs from its slot's.
- Replace `### First attempt, pre-flight (not counted) (its files carry the name pre, deviation 4)` with `### First attempt, pre-flight (not counted) (its files carry the name pre)`.
- Replace `### Series, pre-flight (not counted) (its files carry the name pre, deviation 4)` with `### Series, pre-flight (not counted) (its files carry the name pre)`.
- Clause check: the files are series1-pre.* and series2-pre.*, and the script calls `run_one pre A probe`.

**D2. The affinity block sits under "Every line below is byte-copied whole", but three of its five lines are cut, and all five carry a prefix.** The lead-in, `- **Affinity**, read once per series (§1.2 by Amendment 2):`, should read:
> - **Affinity**, read once per series (§1.2 by Amendment 2). Each line is the series' name, then either that series summary's spinner line whole or, cut by script from the summary line of the run probed, the run's name and its app-pid and app-affinity fields:

Clause check: the two spinner lines occur whole in the series2 and extension summaries. The pre, pre and A9 lines are the builder's cut of those runs' summary lines.

**D3. Deviation 5 omits part of what the refusal overwrote.** Replace its text after the bold title with:
> After that refusal the series script copied the harness's current stderr file, which was A15's, over the B9 slot's copy, and wrote the refusal's own output over the B9 slot's runner output; it copied the B9 slot's report and session log again from their sources, unchanged. The B9 slot's report, session log, suite log and summary line are intact; its P and W cannot be read. The stderr copy is byte-identical to A15's, checked by script, and names A15's session log.

Clause check:
- The `cp app.err.log` happened after a slot that launched nothing, so the file was A15's; the sha is equal and it names session-1792261278.log.
- extension-B15.runner.txt is now `log s5d-extension-B15 exists`.
- The report and session-log copies are byte-identical to their sources, because `rep` was read from s5d-extension-B15.log, the B9 slot's own suite log.
- run-suite.sh exits 94 before writing that log.

**D4. Deviation 4 omits a second effect of the same overwrite.** Append:
> The same overwrite made the script skip its check of A9's app affinity, which compares the loop variable with the extension's first run number; the reading itself was taken and recorded (65535, the hold's grant), so §1.2's condition is met by the reading, not by the check.

Clause check: the test `[ "$i" = "$FIRST" -a -n "$PROBE1" ]` sees i=15 (which the B15 name proves) against FIRST=9. The A9 summary line ends `app-pid=42568 app-affinity=65535`.

**D5. §1.4's PID field is missing from 29 rows that the artifacts can fill.** app-down prints `killed tree` for each PID app-up recorded: vite's first, then the app's. At the three probed runs the second line equals the probe (9892, 36316, 42568).
- Replace deviation 1 with:
> 1. The series probed the app's PID at each series' first run. For every other run the PID is the second `killed tree` line in its runner output (the harness's stop kills the trees app-up recorded, vite's first, the app's second; at the three probed runs it equals the probe). The B9 slot's runner output was overwritten (deviation 5), so its PID is not read. The suite's own process list uses `wmic`, which returns no rows on this machine (`appProcesses: []` in every report). Every counted run shows `launched: true` and its own session log.
- In each row, replace `PID not read (deviation 1)` with `PID <n> (deviation 1)`, using these values. B9 keeps `PID not read (deviation 1)`.
  - Series: A1 32052, B1 45896, A2 37108, B2 50268, A3 536, B3 48272, A4 37384, B4 31404, A5 34748, B5 28016, A6 38776, B6 20048, A7 16868, B7 18984, A8 14448, B8 30596.
  - Extension: A10 18452, B10 41260, A11 50044, B11 21364, A12 34240, B12 32864, A13 46620, B13 6200, A14 3220, B14 7496, A15 39200, A16 26100, B16 35248.
- Clause check: app-up writes the vite PID then the app PID to app-pids.txt; app-down splits that line and prints `killed tree $id`. Each of these runner files has exactly two such lines, and appProcesses is empty in all 32 rows.

**D6. The B15 not-run row quotes `S5d=PASS` and a report name without saying whose they are.** Replace its lead-in with:
> - The harness refused the slot before launching anything (deviation 4). The series script's summary line for it, byte-copied; its S5d and report fields were read from the B9 slot's suite log, which carries the B15 name, and its scratch-mtime field is A15's:

Clause check: `st` and `rep` come from s5d-extension-B15.log, whose report source-changed-1792260893008.json is the B9 row's. 1792261412057 is A15's summary mtime.

**D7. The record does not say the series script changed between attempts.** Add a deviation:
> 6. The series script was edited between attempts: after the first attempt (its stop line names cores 0 to 7; the script kept checks the hold's grant, Amendment 2) and after the series (the copy kept was last written at 2026-10-17T18:12:11Z, after the series ended and before the extension began). The copy kept is the extension's; deviations 4 and 5 are read from it.

Clause check: the script's mtime is 18:12:11.08Z; series2 ended at 18:11:45Z and the extension started at 18:13:51Z. Series1's STOP text does not appear in the copy kept.

**D8. The record does not say what the unrun B15 slot means for the outcome.** Append to the "The lost capture" bullet:
> The extension's B15 slot never ran (deviation 4), so the outcome rests on 30 of the 32 runs §1.3 orders; the B15 slot's reading, like the B9 slot's, is unknown.

Clause check: §1.3 orders 16 runs plus one more series of 16; 30 runs have known classes.

## Commands (exit codes)
All the checks below ran in the foreground with a timeout of at least 300 s, with output redirected to a file. A few plain reads (cat, ls, sed) printed straight to the console, and the pin hashes and the PID and mtime listings were printed from pipelines, so I report their output, not an exit code.
- `git rev-parse HEAD`: rc 0, e20edcf3878e46d9d8ed0c07b295f240e9586750. The record's sha256 is 331dee7d2ec883aa3c37c0065cb1d411e141b867cb19726e9fd3345d5b5a7da3, as stated.
- `git show be6aa620:kernel/src/skp.rs`, `:kernel/src/lib.rs` and `:frontends/shell/e2e/source-changed.mjs`: rc 0 each. The pin spans hash to the form's values: skp.rs 1619-1624, 1501-1505 and 1161-1167; lib.rs 609-616 and 635-639; source-changed.mjs 1246-1283 and 70-71.
- `git diff --stat c5f86b20 be6aa620` over kernel/, frontends/shell/e2e/source-changed.mjs, frontends/shell/src and frontends/shell/src-tauri: rc 0, empty.
- `git grep` for the P and W texts at be6aa620: rc 0, one emitter each.
- My own check script, read-only over the artifacts: rc 0, 1481 checks, 0 mismatches.
- Route, launched and head over the 33 report copies and 33 suite logs: rc 0. All are post, true and be6aa620.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, with no advisory on this record.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS.
- `node scripts/plan/verify.mjs`: rc 0, PASS.

I made no write outside my scratch folder, launched no app and took no hold. The tree was clean at e20edcf3 when the verify scripts ran. The checkout's later modified and staged files are not mine.
