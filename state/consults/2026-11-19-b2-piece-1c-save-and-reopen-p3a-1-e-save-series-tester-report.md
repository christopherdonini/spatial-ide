Series: b2-piece-1c-save-and-reopen P3a-1 E-SAVE at c905c7ea06cbe9e354c346e3a7777c3a2546bd85, tester, port-5400 harness (the custodian's filing note, 2026-11-19: the Sonnet tester, model claude-sonnet-5-5, its run 2026-11-19T03:12:26Z to 03:33:55Z by its transcript, Read 1, Bash 24, two calls errored; 7431 bytes, sha256 9871e042a17ba6b1117fd748dc4731fefd27c9295a6aad484ac2437000036ce1; below byte for byte but for the project value of the hold lines as <m> (2), the scratch folder as <S> (1), the user profile folder as <u>\ (1), an ls line owner, group and local file time as 1 <u> <g> 3506979 <t> (1), a local file time as <t> (1), one sentence on the machine as <one sentence masked>  (1), with this note and one final newline)
Result: E-SAVE PASS, 12 of 12 steps, run-suite rc=0, one run, no re-run. The load line was 22,22,26. No STOP rule fired.

Start state
- HEAD in C:/dev/wt/1c-p3a-1 was c905c7ea06cbe9e354c346e3a7777c3a2546bd85, and the porcelain was empty.
- `git ls-remote origin cut/b2-piece-1c-p3a-1` printed c905c7ea06cbe9e354c346e3a7777c3a2546bd85.
- `df -h`: C: 47G free, D: 355G free.
- `sha256sum -c` printed ten OK lines (every harness file and both shims). I read run-suite, app-up and build-exe whole, and changed no harness file.

Installs and builds
- The hold wrapped `npm ci && npm run build` in bundle-viewer, then the same in frontends/shell, in one hold (15 min). rc=0; its output is in <S>/p3a1e-npm1.out.
- NOTICE.txt was written: `-rw-r--r-- 1 <u> <g> 3506979 <t> frontends/shell/src/generated/NOTICE.txt`.
- The porcelain stayed empty. The lock-file blobs are unchanged, and `git ls-files -s` matches HEAD: frontends/shell/package-lock.json d53e1792cc5881e4a87e0da139b999fe14c21c38, renderer/bundle-viewer/package-lock.json ca9c5ee732ef875d6a64e16ed3f2aaee308f6f6c.

Exe
- The build ran in one hold (30 min) and exited rc=0. The last lines it printed:
```
   Compiling open v5.4.1
   Compiling duckdb v1.10505.0
   Compiling spatial-engine v0.0.0 (C:\dev\wt\1c-p3a-1\engine)
   Compiling spatial-kernel v0.0.0 (C:\dev\wt\1c-p3a-1\kernel)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 17m 37s
copied exe
```
- `D:/wt-targets/1c-p3a-1/exes/spatial-ide-shell-p3a1.exe`: 91542016 bytes, mtime <t>, sha256 c2806c52856d9e1d5359682d3c1617da4c3610299879ab82e40f6e4de10700ca.

E-SAVE
- The hold (10 min) ran `p3a1-e2e-load.sh e-save`, then run-suite with tag e-save and `e2e/project.mjs`, timeout 1500, no --measure. The first line of the run's log:
```
worktree C:/dev/wt/1c-p3a-1 head c905c7ea06cbe9e354c346e3a7777c3a2546bd85 start 2026-11-19T03:32:17Z
```
- Load line: `load e-save 03:32:07Z 22,22,26`
- Step lines, byte-copied from the log:
```
[OPEN] PASS (3764ms): admitted; the Save control and the first pixels are there
[CLAUSES] PASS (4583ms): three clauses, the second off; the Filter section reads Applied: ("zone" = 'residential') AND ("zone" IS NOT NULL); 4 record_step rows reached ok
[STYLE] PASS (3501ms): opacity 0.37 and colour #112233 committed; their record_step rows reached ok
[POSE] PASS (4054ms): camera set to centre (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572
[SAVE] PASS (51ms): answered "asked"; the folder holds project.spatial alone (2497 characters); spatial://project/bb426e33ba86b5de8b2a1faecf36d5b4
[READBACK-FILTER] PASS (0ms): the file holds the three clauses in order, the second off, and the filter ("zone" = 'residential') AND ("zone" IS NOT NULL)
[READBACK-STYLE] PASS (1ms): the file's style holds the fill colour #112233 and the applied opacity 0.37
[READBACK-VIEW] PASS (1ms): the file's view holds the pose's patterns: centre 4143d7e22aaaaaab, 4132530449249249, zoom bfeb6db6db6dc
[SECOND-SAVE] PASS (59ms): answered "not-asked"; the second folder stays empty; the first folder's project.spatial still reads back
[INSIDE-OPEN] PASS (3998ms): the copy under "parcels.parquet" in the third folder was admitted
[INSIDE-SAVE] PASS (79ms): answered "asked"; the third folder holds project.spatial and the copy; spatial://project/a185dc6379aa2598dfa23d026e72d793
[NOTICE-S18] PASS (20ms): the save notices hold S18's text once; the dataset entry's locators read machine-recorded
rc=0 end 2026-11-19T03:32:53Z
```
  The READBACK-VIEW line above has a transcription slip: the zoom pattern in the log is `bfeb6db6db6db6dc`, not the `bfeb6db6db6dc` I typed. The log is the authority.
- The fixture sha256 was 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 before and after the run ("unchanged").
- Run-suite's down step killed the process trees 55196 and 72336, and ports 9223 and 5400 were free afterwards.
- The suite prints the line "the advisory source watcher signalled observed-change" to the app's stderr. The session log ends with a candidate-session-ended-source-changed line for the dataset, which is a P6 placeholder. I did not investigate either.
- Copies in <S> (<S>):
  - p3a1e-e-save.log
  - p3a1e-e-save.app.err.log
  - p3a1e-e-save.session.log (copied from `<u>\dev.spatialide.shell\logs\session-1795059147.log`, the file the stderr names)
- Run-suite's own copies are in <S>/p3a1-e2e-h/out/p3a1-e2e-e-save.*. They include the console ledger `p3a1-e2e-e-save.rep.project-console-ledger-1795059172656.json`.
- The audit log was not produced. I set SPATIAL_IDE_AUDIT_LOG=<S>/p3a1e-e-save.audit.jsonl as the brief says, but no such file exists after the run. I do not know whether the suite or the app reads that variable.

Holds
- The asked stamps are in <S>/p3a1e-h1.asked, -h2.asked and -h3.asked.
- All three holds were granted at the first call, with exit 0 and no 96 to 99 or 97. Each hold line read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=… also=<m>`, and each release line was `MACHINE_RELEASED project=<m> …`. No MACHINE_WAITING or MACHINE_ERROR lines appeared.

| Hold | What ran | Asked (UTC) |
|---|---|---|
| h1 | installs and frontend builds | 2026-11-19T03:12:44Z |
| h2 | exe build | 2026-11-19T03:13:45Z |
| h3 | E-SAVE | 2026-11-19T03:32:04Z |

<one sentence masked> The 17m37s cold cargo build and the E-SAVE run were both shared-machine runs. The suite is a pass/fail correctness run with per-step times only, and no perf claim is made from it.

Processes at the end
- The last busy check printed FREE, and so did the one before the run.
- No background shell or process I started is still running.
- Ports 5400 and 9223 were free after the run.
- At the end HEAD was still c905c7ea06cbe9e354c346e3a7777c3a2546bd85 and the porcelain was empty.
- `df -h`: C: 47G free, D: 348G free.

Things I did that the brief does not name
- I added short foreground wait loops (`until grep -q MACHINE_RELEASED …`, each with a hard cap) to follow the background holds. Each was moved to the background by the harness after 180 s.
- I ran the first FREE check in a parallel call with the `ls`/`sha256sum` of the exe. I then re-ran it alone, and that is the one counted.
- I ran no code changes, no commits, no re-runs, and no `--measure`.

Four failure classes (checked before handing this to a gate)
- Interface: the suite drove the real debug shell exe through the app window (WebView2 over CDP) and the shipped SKP calls. It used no stub or direct kernel call.
- Result pointers: every claim above points to a log or stamp file in <S> that exists.
- Operator-facing lines: the log's lines describe this commit's run only. HEAD is printed in its first line, and the suite is not the release gate.
- Assertion reached: all twelve steps, including the three read-back steps, SECOND-SAVE and NOTICE-S18, printed PASS after their file reads, so the assertions were reached and not only the setup.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. I have no token-usage figures at hand.
