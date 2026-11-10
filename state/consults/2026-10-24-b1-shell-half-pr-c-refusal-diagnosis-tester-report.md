*Custodian's filing note (2026-10-24): the tester-high's diagnosis of milestone 4 PR C's refusal-suite failure in the head series, at bc315fb9 and a533a598, on the port-5400 harness. The custodian reads it as load, not I3: the suite passed every run alone and the failing runs' event stream lagged the page; a self-made-load run was refused by the harness's classifier and not worked around. The run 15:09:24Z to 15:30:06Z by its transcript (Read 2, Bash 51, Grep 1). Extracted by script from its SubagentHandback call, with one final newline added; the session scratch folder's path, 1 place(s), written as <the session scratch folder>; nothing else is changed. Its sha256, from line 5 to the end, is 5d6b453356d1322cadbcb6611429bc1c92f2f56a086973845891f76da1e4898f.*

---

Diagnosed: b1-shell-half PR C, e2e:refusal-contract-baseline, tester-high

Result: not settled. I could not reproduce the failure at the head or at the base. The base passed 4 of 4 and the head passed 5 of 5. Step 2's bisect and step 3's banner probe have no failing commit to work on, so I did neither as specified. Nothing in my runs tells load apart from code.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).

**Runs.** Each used the head series' debug exe (copied under an m4c-rd name), the worktree's Vite, and its own shared hold. Every run printed busy=FREE at launch, ended with rc=0 and left ports 9223 and 5400 free. Times are UTC, 2026-10-24. Every run passed OVERCEIL', REOPEN' and SLOW'/CANCEL'. The step times in ms are OVERCEIL' / REOPEN' / SLOW'/CANCEL'.

| Run | Commit | Start | End | Machine CPU load just before | Step times (ms) |
|---|---|---|---|---|---|
| base | a533a598 | 15:10:51 | 15:11:47 | 100,100,97 | 10885 / 20473 / 18205 |
| head | bc315fb9 | 15:12:21 | 15:13:24 | 35,37,26 | 12195 / 24460 / 19737 |
| head2 | bc315fb9 | 15:14:54 | 15:15:53 | 34,35,37 | 11781 / 23362 / 18262 |
| base2 | a533a598 | 15:19:23 | 15:20:13 | not read | 10211 / 18510 / 16150 |
| head3p (with probe) | bc315fb9 | 15:22:40 | 15:23:34 | 13,15,45 | 11093 / 21138 / 16175 |
| head4p (with probe) | bc315fb9 | 15:24:04 | 15:24:57 | 10,18,21 | 10886 / 20395 / 16160 |
| base3 | a533a598 | 15:25:37 | 15:26:49 | not read | 11579 / 33144 / 22806 |
| head5 | bc315fb9 | 15:27:06 | 15:27:52 | not read | 9453 / 17300 / 14076 |
| base4 | a533a598 | 15:28:07 | 15:28:51 | not read | 8771 / 16879 / 13850 |

- The first three rows are the runs step 1 asked for (base once, head once), plus head2. The rest are extra runs I added to try to catch a recurrence.
- Mount-readiness took 1.5 to 2.6 s in every run, against 12 s and 25 s in the head series' failing runs.
- Step times overlap between base and head. base3's REOPEN' at 33 s is the slowest of all nine runs, so run-to-run noise is larger than any base-to-head gap. I make no timing claim from nine runs.
- The probe runs (head3p, head4p) read the page's DOM through my own CDP connection every 500 ms. That may have slightly changed timing.

**What I tried and could not do.**
- Step 2 (bisect over 8cd440af, 0c3d54c4, 0c200a71) did not apply. The head passed, and the brief ties the bisect to a head failure.
- I tried to make the base-versus-head comparison fair by running both under identical load of my own, 16 self-terminating busy-loop processes inside the shared hold. The auto-mode classifier denied that command ([Interfere With Workloads]) before it started. I did not work around it. No burner process ever existed. The scripts are m4c-rd-stress-suite.sh and m4c-rd-probe-suite.sh in the m4c-rd-h scratch folder.
- If you want load versus code settled, that needs either your permission for self-made load or a re-run during one of the machine's heavy periods. The same probe is ready. head3p and head4p show it works: it logged `.canvas-refusal` added at 1792855373655 and removed at 1792855377102 (the Dismiss click). The strip's `hidden` attribute went false on the add and true on the remove.

**What the failing head-series artifacts say.** These are readings of existing files, not new runs.
- In `m4c-hs-refusal.session.log` (failing run 1), the page's own session-log line `canvas-refusal` is stamped 1792853648089. The suite's OVERCEIL' DOM read happened about 10 s later. I get about 1792853658.5 by subtracting the later steps' durations (37248 ms and 60008 ms) from the ledger's write time, 1792853755754. The banner was absent at that read.
- In failing run 2 (`m4c-hs-refusal2`), the same calculation gives a host refusal at 1792853975561 and a read at about 1792853990.0, 14.5 s later. The banner was again absent.
- The harness's console timestamps in those runs lag the host log by tens of seconds. The ceiling push (batchSeq 40) is stamped 1792853702641 in the report JSON in run 1, 54 s after the host's line. In run 2 it is stamped 1792854023484, 48 s after the host's line. In my passing head run the same two stamps differ by 105 ms (1792854756829 against 1792854756724).
- So the failing runs show the page logging the refusal 10 to 14 s before the read, with no banner at the read, while the harness's own event stream ran far behind. This rules out a simple read-before-refusal race on the host's clock. It does not show whether the banner was removed, never set, or not yet rendered. Treat all of this as unconfirmed inference.
- The code path I would watch if the failure recurs:
  - `frontends/shell/src/canvas/WorkingCanvas.tsx:1508-1509`: `logSessionEvent("canvas-refusal", …)` then `onCanvasRefusalRef.current(streamHandle, e.message)`.
  - `frontends/shell/src/App.tsx:2224`: the `if (admitted.dataset !== admittedDatasetRef.current) return;` guard in the callback. It returns before `setCanvasRefusal` (App.tsx:664) is called, and the host log line is already written by then.
  - `App.tsx:2294-2297`: the `attention.canvasRefusal` item that renders `.canvas-refusal`.
  - `App.tsx:248`: `setCanvasRefusal(null)` in `admitAndResetStaleUiState`.
  - None of these four lines is in `git diff a533a598 HEAD -- frontends/shell/src/App.tsx`. PR C's App.tsx changes are TableSource, TableTab, `tableShown`, and the `onBatch` filter argument. I do not claim any of these lines is the cause.
- In the failing head-series run, `waitForSettle` (`e2e/lib.mjs`:346-367) counted entries that the harness received. The harness received them slowly in those runs. This could let it report `settled=true` while the page was still working. That is a reading of the code, not something I observed.

**Processes check.** After the last run:
- `git checkout cut/b1-shell-half-pr-c` gave HEAD = bc315fb9d163dc292501618836bc25353c467bd8, and `git status --porcelain` printed nothing.
- Ports 9223 and 5400 are free, and the busy check printed FREE.
- No m4c-rd process remains.
- Each run's app and Vite were stopped by the PIDs the app-up script recorded.
- The probe was stopped by its own PID (27917 and 28011). Each recorded "alive after kill: 0".
- I touched only scratch files, the worktree's ignored e2e/out, and one exe copy, `spatial-ide-shell-m4c-rd.exe`, in the piece's target exes folder. It is byte-identical to the head series' exe (sha256 a6c1c608b7bad5ac15e07f95b85dc5325934c08ee9c5dfcad50d4dfd42b44282). You can delete it.

**Fixtures.** The sha256 of the three fixtures this suite opens, before and after, matched with `diff`. I regenerated none.
- 100k-happy-path.parquet: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
- over-ceiling-refused.parquet: b8b1bb9c437c06b5fd757b38113ab72b18a295e64730579551c0e4e8e1f4b992
- slow-filter-scan.parquet: 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5

**Hold lines (SpatialIDE only).** Nine shared holds were granted at cores=0-7, affinity=FF. Each opened with `MACHINE_HOLD shared project=SpatialIDE …` and closed with `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`. The tenth hold request, for the self-load run, was never issued.

**Four failure classes (tester rule):**
- The harness uses the product's interface. It is the real e2e script, a debug exe and Vite from the worktree, with a passive CDP observer beside it in two runs.
- The result claim points to files that exist: the `m4c-rd-*.log`, `.session.log`, `.app.err.log` and `.rep.*.json` files, one set per run, in the m4c-rd-h scratch folder's `out/`.
- No operator-facing results file was written.
- Every run reached its assertions, and each step line shows a PASS note.

**Evidence folder** (per-run logs, session logs, app stderr, reports, probe logs, load readings, fixture hashes and the scripts, all named m4c-rd-*): `<the session scratch folder>/m4c-rd-h/out/`.
