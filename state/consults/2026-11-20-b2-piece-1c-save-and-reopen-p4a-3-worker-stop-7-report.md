*Filed by the custodian: P4a-3's worker, its third (stop 7) hand-back (claude-sonnet-5-5), 6316 bytes, sha256 af83fd383821ba7f1c7202598cca5b80be2e75e955a2aaf67c7285d441828130, below the rule, byte for byte but for 2 of the project name as <m>, with one final newline added. Calls Bash 30, Edit 3, Read 2, SubagentHandback 1, 2 errored, from 2026-11-20T08:57:50Z to 2026-11-20T09:19:31Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-3, worker. port-5400 harness. STOP 7 at E-REOPEN R6: the saved view is applied, then the first look moves it. E-CHANGED was not reached. Nothing of the suites is committed. Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

COMMITS / PUSH
- Pushed head is still da94ae0b8fbd4ed1af926e2d01a70ef670da0ff2, `feat: the reopen's three DEV-only e2e hooks (B2 piece 1c, Amendment 54 item 7 (a))`. Nothing new was pushed.
- Uncommitted in `C:/dev/wt/1c-p4a`, from `git status --porcelain`:
  - `M frontends/shell/package.json`: one added line, `"e2e:reopen": "node e2e/reopen.mjs",`, after the `e2e:colour` line, and nothing else (`git diff` shows 1 insertion).
  - `?? frontends/shell/e2e/reopen.mjs`: 460 lines, the ceiling is 485.
- `e2e/README.md` is not yet written. I did not write the entry because the suite does not pass.

HARNESS (`<H>` = the scratchpad's `p4a-e2e-h`, pointed at `C:/dev/wt/1c-p4a`)
- Check: `sha256sum -c` gave ten `OK`, rc 0.
- I read the four scripts whole and changed no harness file.
- Exe build, in one hold: `build_rc=0`. It was a full cargo build, 15m 39s, ending with `copied exe`. The log's last five lines are:
  - `Compiling open v5.4.1`
  - `Compiling duckdb v1.10505.0`
  - `Compiling spatial-engine v0.0.0 (C:\dev\wt\1c-p4a\engine)`
  - `Compiling spatial-kernel v0.0.0 (C:\dev\wt\1c-p4a\kernel)`
  - `Finished dev profile [unoptimized + debuginfo] target(s) in 15m 39s`
- Each of the two suite runs had a `FREE` busy check first. The load samples were "20,20,22" for w-r1.
- A final busy check after the runs also gave `FREE`: no app, vite or process of mine is left running.
- Hold lines, masked: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<shell> also=<m> (...)` and `MACHINE_RELEASED project=<m> shell=<shell> affinity=FF (cores 0-7)`. This applies to the typecheck hold, the vitest hold, the build hold and both suite holds. There were no MACHINE_WAITING or MACHINE_ERROR lines.

RUNS (suite file e2e/reopen.mjs, run through run-suite with the 1500 s bound)
- w-r1, rc 1, log `<H>/out/p4a-e2e-w-r1.log`; session log copied to `<S>/1cp4a3-w-r1.session.log`.
- w-r2, rc 1, log `<H>/out/p4a-e2e-w-r2.log`; session log copied to `<S>/1cp4a3-w-r2.session.log`.
- The w-r2 app stderr is `<H>/out/p4a-e2e-w-r2.app.err.log`, and the ledger is `<H>/out/p4a-e2e-w-r2.rep.reopen-console-ledger-*.json`.
- Both runs had R1 to R5 PASS and R6 FAIL, with the same view difference.

STEP RESULTS (w-r2)
- R1 PASS: F1 admitted in folder P.
- R2 PASS: two clauses (the second off), fill colour `#112233`, the camera set through `e2eSetViewState`.
- R3 PASS: saved into P, locators `machine-recorded,project-relative`.
- R4 PASS: `skp.project_open_elsewhere`, S9's own-window place equal to the constant, the run ended, the open and its two clauses kept.
- R5 PASS.
- R6 FAIL, the view difference.
  - Right after the hook returned, `currentView` was exactly the saved one: centre (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572.
  - After the first look settled it was centre (2600899.8017650545, 1200540.3303261106), zoom -1.7458262014754529. That is the fit of the data, and not the file's `4143d7e22aaaaaab`, `4132530449249249`, `bfeb6db6db6db6dc`.
  - There was no `.reopen-notice` (so no S19: `view.state` applied).
  - In w-r1 the filter, clauses and fill colour had already read as the file's. The view failed in both runs.
- R7 to R9 and E-CHANGED were not reached.

CONSOLE RING AT THE READS (stop 13)
- w-r1 R5: label `Console — 256 actions (550 dropped)`; the `close_dataset` row had 224 entries after it. That read waited on the first look and was too late, so I moved it.
- w-r2 R5, read right after `openPath` returns and before the first look: `Console — 256 actions (334 dropped)`; the row has 2 entries after it. The row was present at its read.
- R6's `open_project` row was not checked, because the step failed on the view after the row check. The row read comes first in the code. The failure message does not report the row's position.
- No row was dropped before its read, so stop 13 did not fire.

THE STOP (7), with the cause as far as I read it (no product code changed)
- The reopen's first look is issued at `App.tsx` line 1831, the call `session.reissueUnrestricted(null, activeFilterRef.current)`.
- `reissueUnrestricted` in `residency/candidateArmSession.ts` line 1745 calls `canvas?.resetFitForNewGeneration()`, which sets `hasAutoFitRef` to false and clears the fit anchor. `WorkingCanvas.tsx` line 1660 is that method; its doc is at line 1105.
- The reopen's `applyView` (`WorkingCanvas.tsx` line 1648) sets `hasAutoFitRef` to true first, and App's `[admitted]` effect calls it (line 1691). The first look then resets it. The first batch's one-shot fit moves the camera to the data's fit.
- So the saved view is overridden whenever the first look's reissue runs. The session log's `candidate-first-look-view-planned` lines in `1cp4a3-w-r1.session.log` show the same fit box.
- That fix is in `candidateArmSession.ts` or `App.tsx`'s first look, under P4a's product files but not among the three DEV hooks. This is for the advisor. T-17 (unit) does not catch it.

COUNTS (at da94ae0b, as the custodian agreed)
- Shell product group: 801 added, 37 deleted, 838 against 820. That is class 8, over by 18, finished as written. This commit alone is 71 added and 6 deleted.
- The e2e group so far is `reopen.mjs` at 460 lines plus one `package.json` line, under 485. The README entry is still to come.
- The lock-file check is not yet run: the final package.json diff is the single line above. The two `package-lock.json` files are unchanged.

HOOK SIGNATURES (unchanged from the report before)
- `e2eOpenProjectFolder(folder: string): Promise<string>`
- `e2eRelinkFile(file: string): Promise<string>`
- `e2eReadWorkspace(): Promise<{filter: string|null; clauses: {text; enabled}[]; style: StyleState|null; view: {centre: [number, number]; zoom: number}|null}>`

I did not do: the README entry, the suite commit, P-head, or the E-CHANGED run. All wait on a ruling on R6's view defect, after which the first fix should land in its own commit before the suite's. To resume after the ruling: R6's hex comparison and the notice dump are already in the suite.
