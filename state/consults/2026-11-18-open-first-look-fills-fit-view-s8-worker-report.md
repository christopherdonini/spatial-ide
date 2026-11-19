Built: open-first-look-fills-fit-view S8, worker (the custodian's filing note, 2026-11-18: the Sonnet worker, model claude-sonnet-5-5, its run 2026-11-18T23:31:07Z to 23:38:36Z by its transcript, Bash 52, Read 1, Write 1, none errored; 7199 bytes, sha256 cf601982efa79e7d4465708b22d6c369f39121e6f182fe298582492a4308d09a; below byte for byte, with this note and one final newline)
Result: STOP. FILL fails at commit 1 (47693664) on an invalidator-I3 line, so commits 2 and 3 are not made, and the end checks were not run.

START (step 0): HEAD e4c1dfba = C; porcelain empty; ls-remote printed C; df: C: 48G free, D: 360G free; harness sha256 -c printed ten OK; exe sha256 5a347ec8...adcc5 (matches). Fixtures: filter-zoned 92ed800c...e46, 100k-happy-path fd0c74ab...ddfb49. The numstat of the four docs/e2e files, origin/main...C, printed nothing.

DEVIATION (mine): before step 1 I applied the FILL edit by mistake. I saved it to <S>/fl8-fill.patch and reverted the file with `git checkout -- frontends/shell/e2e/layout.mjs`. I ran the busy check and the layout run only after that, and `git status --porcelain` was empty then. Step 1 therefore ran on the unedited file at C.

STEP 1, layout-c at C (log <S>/fl-e2e-h/out/fl-e2e-layout-c.log, session log <S>/fl8-layout-c.session.log). Every step PASS except FILL, and rc=1. First line `worktree C:/dev/wt/fl head e4c1dfba36cca15dbfa5dd6105cd2c4028f27221 start 2026-11-18T23:34:01Z`. Result lines:
[OPEN] PASS (1189ms); [E-KEYS] PASS (2006ms); [E-FIELD] PASS (595ms); [E-LANDMARKS] PASS (600ms); [E-FOCUS] PASS (764ms); [E-FIT] PASS (1496ms); [E-FLOOR] PASS (1978ms); [RESIZEQ] PASS (17837ms): 72 new viewport_query lines, predicted 96; [E-REOPEN] PASS (161ms); [BURST] PASS (10013ms): 0 lines; FIXTURES PASS (both hashes unchanged).
`[FILL] FAIL (21546ms): FILL: within 10000ms of closing the Inspector 0 streams were issued and 0 rows arrived on them, expected at least 1 stream and 1 row (qualifying cells 2 before, 2 after; zoom -3.2394433553937008)`
FILL logs nothing before its result line. `rc=1 end 2026-11-18T23:35:14Z`; down.txt: killed tree 73096, killed tree 60864, port 9223 free, port 5400 free. The run-suite copies are fl-e2e-layout-c.rep.layout-results-1795044914849.json and fl-e2e-layout-c.rep.tauri.e2e.conf.json.

FILL's CHANGE (commit 1, `git diff` byte-copied from `git diff` before the commit; 9 insertions, 1 deletion):
```
-  /** Cells the grown view covers that no view-state line since the mark covers at the size before the toggle, lying wholly inside the parcel area. */
+  /** Cells the grown view covers that no earlier ask covers at the size before the toggle, lying wholly inside the parcel area.
+   * The earlier asks are the view-state lines since the mark and, OPEN-6 (A) of open-first-look-fills-fit-view section 5, the open's planned box:
+   * the session plans the shown view when the first look ends, so each tile `viewport_query` line before the mark (its bbox prints as `Object`,
+   * so the line carries no cells) counts the cells of the view-state line last seen before it. */
   const qualifying = (width, height) => {
     const asked = new Set();
+    let shown = null;
+    for (const e of consoleHandle.renderTrace().slice(0, markView)) {
+      shown = (e.text.includes("[render-trace] view-state ") ? parseViewState(e.text) : null) ?? shown;
+      if (shown !== null && /viewport_query \{[^}]*bbox: Object/.test(e.text)) for (const key of cover(shown, size.width, size.height)) asked.add(tileKeyToString(key));
+    }
```
Why the box is read this way: the console text of a tile viewport_query line is `bbox: Object` (see e2e/out/regression-render-trace-1795042586868.json), so the line carries no cells.

COMMIT 1: 476936642cddefe4a7652918f7674907a9f2b183, "test: FILL counts the open's planned box in its covered set (open-first-look-fills-fit-view S8, OPEN-6 (A))". Stat: 1 file changed, 9 insertions(+), 1 deletion(-). `node --check` rc 0; `profile-path-scan --staged` printed "profile-path-scan: clean", rc 0. Push line: `e4c1dfba..47693664  cut/open-first-look-fills-fit-view -> cut/open-first-look-fills-fit-view`.

STEP 3, layout-s8 at commit 1 (log fl-e2e-layout-s8.log; session log <S>/fl8-layout-s8.session.log). Every step's result is the same as at C except FILL (which now fails earlier). The step times differ slightly. rc=1, `rc=1 end 2026-11-18T23:37:34Z`.
`[FILL] FAIL (9725ms): FILL: 0 qualifying cells before the toggle (zoom -3.2394433553937008, 480x552 + 312px): invalidator I3, STOP and report`
FILL logs nothing before its result line. In this run RESIZEQ passed with 72 new lines (predicted 96), E-REOPEN PASS (123ms), BURST PASS (10007ms, 0 lines).
Reading: with the open's planned box counted, none of the cells the grown view covers lie outside it at this zoom (the notch zooms in), so FILL's precondition has no cell to test. The OPEN-6 (A) edit as the brief words it leaves the check unable to run. That is for the advisor or custodian: a different reading of the open's box, or a different set-up, would be needed. I did not try either; the brief forbids a re-run and any other FILL change.

UNCOMMITTED IN THE WORKTREE (drafted before the stop; none of it is committed or pushed):
- frontends/shell/e2e/README.md: numstat 13/3. FILL's entry corrected (the covered set now counts the open's planned box). The harness entries: an added sentence under M7 (the open-drain drain also waits for the fill's tile streams, no figure named) and one under the identity step (the fixture-open's fill puts tile streams in the ON and the OFF runs alike). A new E-FL section at the end, with `npm run e2e:open-fills-fit-view -- --measure-build <exe>`, exits 0/1/2, and the fd0c74ab fixture.
- KNOWN-LIMITATIONS.md: numstat 4/4. Item 64 retired in item 18's form, with a comment naming §3's not-covered cases and saying the words are the draft for the advisor's ruling. Item 51: the 10,000-row clause removed, the camera clause kept, the "goes when the node merges" sentence updated.
- frontends/shell/MANUAL-WALKTHROUGH.md: numstat 9/7. Part L's strip note, L1, L2, L5 and A7.
Their text is in the worktree and can be read with `git diff`. README's "re-read" claims on the harness are by reading the code, not by a run.

HOLDS: both shared, hold exits 0, no 96-99, no MACHINE_WAITING or MACHINE_ERROR. Lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:37028 also=<m> ...` / `MACHINE_RELEASED project=<m> shell=bash.exe:37028 affinity=FF (cores 0-7)`; second `shell=bash.exe:61800 also=<m>`, released the same way. Busy checks printed FREE twice: before layout-c, and after the push before layout-s8.

END STATE: HEAD 476936642cddefe4a7652918f7674907a9f2b183, which `git ls-remote` also prints. Porcelain: ` M KNOWN-LIMITATIONS.md`, ` M frontends/shell/MANUAL-WALKTHROUGH.md`, ` M frontends/shell/e2e/README.md`. No process of mine is running (each suite's down.txt shows the app stopped). The final busy check, the end-of-step `df`, the end numstat and the end fixture hashes were not run, because of the stop. Beyond the brief: I wrote scratch under `<S>` with `fl8-` names, namely fl8-form.md, fl8-draft.md, fl8-s7.md, fl8-fetch.txt, fl8-fill.patch, fl8-c1.out and fl8-push1.out. Of the four class checks: no cross-module code was written; the claims above point to logs that exist; no user-facing message was added; the required FILL assertion was not reached at commit 1 (it stopped at its precondition). Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
