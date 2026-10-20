Reviewed: state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md at main 0bbc1c9919ba8ef94f6c115414f11dfaa792963f
Verdict: PASS WITH NOTES

The record's sha256 at that commit is d811de6e03209757b8f39e69d77769c9ff7db190ff7177d4c99885b710785588, which matches the brief.

## Correctness
None.

## Evidence
None. Each check is below.

**1. Rows against their artifacts.** I wrote my own script, without reusing the record's builder logic. It parses every fenced block in the record and every row field, then checks each against the artifact the record names. Every one matched, at all 17 rows (the pre-flight and A1 to B8):
- **Setup blocks:** the two path lists equal `series-exe-paths.txt` and `series-frontend-paths.txt` byte for byte. The build lines occur whole in the build call's output. The hold lines occur whole in the build, refused-request and series call outputs. The pre-flight lines and the two closing lines occur whole in `series-summary.txt`.
- **Per-row values:**
  - From the report JSON: the stream-issued text (the render-trace entry's whole `text`), the receipt time and ms, and S4's count (the "17 -> N" in S4's note, recomputed as N minus 17). Also the status message, every step verdict, `launched`, and the session-log baseline.
  - From the session log: the copy is byte-identical to the original the report names. The four-token lines after the baseline match exactly. No `tile-stream-mint-abandoned` or `dataset_session_ended` line appears in any copied log.
  - From the stderr captures: the P, W and R lines and each P count.
  - From the suite logs: the helper's exit line and each run's report name.
  - From the summary: t_repoint, the run window, the suite rc, and "fixtures unchanged" (the fixtures-before and -after hashes are byte-equal in every run). The app PID is the second `killed tree` line of the runner output; in the pre-flight it equals the probe, 37116.
- **Gaps:** every gap recomputes.
- **The exe:** I recomputed both files' sha256. `spatial-ide-shell-s5d-base-ed8731a7.exe` and step 1's `…-be6aa620.exe` both hash to f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f, which is the sha256 step 1's Setup states.
- **Two lines that are not whole artifact lines.** They are listed under Documentation.

**2. Classes, read at B.**
- **F8's two fixed details** in `kernel/src/skp.rs` at ed8731a7 are `{this dataset's session ended while this query was being prepared}` (the attribute arm) and `{this dataset's session ended when its source was observed to have changed}` (the live check). The second is joined across a Rust line continuation. The form's §0 F8 pins point at c5f86b20, where the lines sit elsewhere; for this check I read the tree at B as authoritative.
- **R's detail** in `engine/src/descriptor.rs` at B is `format!("{{the source could not be re-read: {e}}}")`.
- **W:** the watcher's stderr text at B is `"the advisory source watcher signalled {}"`, which is the pattern the series script and the builder match.
- **P:** the post-check line is `session ended for dataset …`.
- **Results.** All 15 S5d failures, the pre-flight included, have exactly one refusal: `engine.source_changed` with detail `{mtime}`. That detail is neither F8's nor R's, so each is C2. There are no C1 or C3 rows.
- **P counts:** P is present in every run. The failing runs count 0 (one or two P lines each); the two passing runs, B5 and B7, count 23. There are no W or R lines in any run.
- **A3** reaches the shell through a tile terminal that carries F8's live-check detail, not through a refusal. Its only mint refusal is still `{mtime}`, so it is C2 by Amendment 4 item 3, which classes by detail alone.

**3. The outcome.** In Amendment 4 item 4's order:
- I1-late: no W in any run.
- R-late: no R in any run.
- O4: none. S1 to S5c and S4 pass in all runs, every run has a session-ended line and P, and there is no C3.
- O2: C2 in A1, B1, A2, B2, A3, B3, A4, B4, A5, A6, B6, A7, A8 and B8.

So the outcome is **O2**, which is what the record names. The record is right that the pre-flight enters no outcome (§1.3 and Amendment 4 item 5: arm A, not counted). Counting it would change nothing, since it is C2 with P and has no W or R. No extension is owed: 14 of 16 runs failed, and §1.3 orders one only below 3.

**4. Item 1 and the deviations.**
- **Path lists.** I recomputed both `git diff --name-only` lists at main; each is byte-equal to its artifact. The exe list names two `engine/*.md` forms, so item 1 required a rebuild. The rebuild happened in a shared hold: the build call's output carries this project's MACHINE_HOLD shared and MACHINE_RELEASED lines, and its checkout line is at ed8731a7. The result is byte-identical to step 1's exe.
- **Frontend list:** 13 paths, so nothing is pooled.
- **The base.** B (ed8731a7) was main at the series' start: the next commit, e6ae021f, was committed at 11:24:18Z, after the series ended at 11:23:50Z.
- **The checkout.** The e2e checkout is at B and clean now. The series script exits 93 when the checkout is unclean at start and writes no NOT-CLEAN line at its end.
- **Deviation 1.** This session's transcript shows two series commands identical except for `-Minutes 35` and `-Minutes 30`. The refused call's output reads `MACHINE_ERROR NOT_BOOKED …` and exits with code 98. Because the chain is joined by `&&`, nothing ran.
- **Deviation 2** is confirmed as stated under check 1.
- **The series script** did what the record says:
  - Each artifact is named `$LABEL-$T`, from the arm and run number.
  - `keep()` and a check before each run refuse to overwrite (`REFUSED-OVERWRITE`, return 93), and `run-suite.sh` refuses an existing log (94).
  - W and R are read from each run's capture before the next run. Any result other than `W=0 R=0` (including NO-CAPTURE) stops the series with 70.
  - It stops when the checkout is not at B (95) or not clean (93), when the pre-flight capture is empty (81), when the helper does not start (83), and when either affinity is not 65535 (82).
  - The script was last written at 11:00:50Z, before the series started at 11:10:52Z.
  - Arm B's spinner starts before each launch and stops after the run's report. No spinner or s5d exe process is still running.

**5. What the record claims and must not.**
- It makes no timing claim and does not compare the arms. The only mention is the disclaimer. The cargo "Finished … in 24.59s" is byte-copied tool output, not a claim.
- Every hold line carries `project=SpatialIDE` or is the refused request's MACHINE_ERROR line. The builder excludes the WAITING and QUIET lines.
- There is no profile path; a scan for `Users`, `CHRIST`, `AppData` and `.claude` finds nothing.
- There is no cite into DECISIONS-PENDING.md.

**6. The verify scripts at 0bbc1c99:** all three pass (exit codes are in the command list).

## Documentation (must fix before the record is relied on; no re-gate)

**D1. Two quoted blocks are not whole artifact lines, but the record's header says every quoted line is.** The header reads: "Every quoted line is byte-copied whole, carriage returns removed."
- **(a)** In Setup's affinity block, `pre app-pid=37116 app-affinity=65535` is the pre-flight's summary line cut down to its run name and its last two fields. The summary line itself is longer.
- **(b)** In each of the 17 rows, the "S4's verdict and note" block joins the report's `status` and `note` fields with a space. No artifact line reads that way; the suite log has `[S4-…] PASS: …`.

The content is true in every case. These are not the human's words (they are the custodian's record), so the custodian applies the replacement words below with no re-gate and the PR body lists them:
1. **Header.** Replace "Every quoted line is byte-copied whole, carriage returns removed." with: "Every quoted line is byte-copied whole, carriage returns removed, except the two the lead-ins below name: the pre-flight's affinity line, cut from its summary line, and each row's S4 verdict and note, joined from two report fields."
   - Clause check: every other fenced line matched a whole artifact line, or a whole JSON field value for the stream-issued text and the status message (check 1). The two exceptions are exactly (a) and (b).
2. **Affinity lead-in.** Replace "- **Affinity** (Amendment 2): the app's in the pre-flight and the spinner's, once for the series, each the hold's grant:" with: "- **Affinity** (Amendment 2): the app's in the pre-flight and the spinner's, once for the series, each the hold's grant. The first line is the pre-flight's summary line cut to its run name and its last two fields; the second is a whole summary line:"
   - Clause check: the builder maps `^(\S+) .* (app-pid=\d+ app-affinity=\d+)$` to `$1 $2`, and `spinner pid=14748 affinity=65535` occurs whole in the summary.
3. **Each row's S4 lead-in (17 rows).** Replace "S4's verdict and note:" with: "S4's verdict and note, the report's `status` and `note` fields joined by one space:"
   - Clause check: the builder writes `${r.s4.status} ${r.s4.note}`, and my script rebuilt all 17 rows from the reports and matched them.

## Observations (no finding)
- **Step 1's build log was overwritten.** `build-s5d.sh` writes `out/s5d/build.log` in step 1's folder, so step 2's build replaced it (its mtime is 10:59:43Z on 2026-10-20). Step 1's record does not cite that file, so nothing on record is lost. A future build script should write into its own step's folder.
- **The spinner affinity probe** used a spinner started only for the probe (PID 14748), before A1. Each B-run spinner starts the same way, from the same shell, in the same hold, so Amendment 2's "once per series" holds.
- **Amendment 5** calls itself "References only." but restates the record's figures. It is not the form's closing record (§2), and its figures match the record.

## Process notes
- **Main moved during my review** (81b350f5 at 11:50:12Z; it changes only CUSTODIAN-QUEUE.*, site/ and state/CUT-STATE.md). My first verify-cites run in the main checkout finished at 11:49:35Z, so at 0bbc1c99. The verify-quotes run straddled the move and the verify.mjs run was at 81b350f5. I therefore re-ran all three at 0bbc1c99 in a scratch clone.
- **A command of mine had `cd <clone> && git checkout …` where the `cd` failed.** The checkout did not run. The main checkout is still on `refs/heads/main` with an unchanged reflog.
- **One grep of the series call's output printed MACHINE_WAITING lines that name another project.** I have not quoted them.
- My exploratory read commands were not all redirected; every check command is listed below.

## Commands and exit codes
- My record-against-artifacts script: exit **1**, 17 mismatches. All 17 are "suite verdict fixture-integrity": my script expected a `[fixture-integrity] PASS:` line, which the suite prints only in its table. Every other check matched.
- Follow-up `grep -c '^fixture-integrity  *PASS '` over the 17 suite logs: exit 0, one match in each log.
- `sha256sum` of both exes: exit 0, both f3fdf25a…c31f.
- `git diff --name-only be6aa620… ed8731a7… -- <exe paths>` and `-- frontends/shell/src` at main: exit 0 and 0. `cmp` with the two artifacts: 0 and 0.
- `git -C <e2e checkout> rev-parse HEAD` / `status --porcelain`: exit 0, ed8731a7, clean.
- Transcript grep for this project's S5d hold requests: exit 0.
- `git show 0bbc1c99:PLAN.yaml` (node status checks): exit 0. This node is blocked with generation 6; the flake node is blocked and depends on it.
- In the main checkout: `node scripts/plan/verify-cites.mjs` exit 0 (PASS, at 0bbc1c99); `verify-quotes.mjs` exit 0 (PASS); `verify.mjs` exit 0 (PASS, but at 81b350f5).
- In a scratch clone at 0bbc1c99:
  - `verify-cites.mjs`: exit 0, PASS.
  - `verify-quotes.mjs`: exit 1 on the first run. The cause was the clone's path: git reported "Filename too long". Re-run with `core.longpaths=true` set through GIT_CONFIG_* env: exit 0, PASS.
  - `verify.mjs`: exit 1 on the first run, because the clone's origin was a local path and gh returned 404. After setting the clone's origin to the GitHub URL: exit 0, PASS.
- Process check for any leftover spinner or s5d app: exit 0, none running.

No file was written outside my scratch folder, and nothing was committed, pushed or killed.
