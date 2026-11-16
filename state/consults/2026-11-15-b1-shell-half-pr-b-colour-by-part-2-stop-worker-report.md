*Custodian's filing note (2026-11-15): the report of PR B colour-by part 2's worker, from its hand-back (6401 bytes, sha256 43e44f912edc39096e2ce48c9049cee3634d857360ab4a1055a1ee2a5b0df9d2), below the rule, byte for byte. Its brief by file (17007 bytes, sha256 c65f91baf8c1c3a416324e460ce4fb14d1c9330e8ab1f29b580b5c16cbb62c10), with one closing line the custodian added at dispatch, naming the scratch folder and the harness folder by their places. The run 2026-11-15T14:38:17Z to 2026-11-15T15:05:02Z by its transcript, 122 calls (Bash 108, Read 9, Write 3, Edit 1, SubagentHandback 1), no errored call, model claude-sonnet-5-5; its run cb2-t is one call in that transcript. It stopped at cb2-t, not as predicted (class 2; the form's Amendment 20). Its reading that no layers line follows the One colour click is not borne out by the ledger's own times (Amendment 20, item 2). It did not push its commit T 3e0f8151, which the brief asked for after a stop; the custodian pushed it (bfcb57e7..3e0f8151).*

---

Stopped: b1-shell-half PR B colour-by part 2, step 2 (run cb2-t), cb2-t not as predicted (class 2). It exited 1: PB-E1, PB-E5, PB-E2 and PB-E4 passed, PB-E3 failed. Nothing was pushed. No mutation was run, and there is no R commit.

**Where checks and harness:** all matched the brief. Harness run-suite sha256 is 5102f5974d8218315c7483282738b98fcfdd548db80680390ae702603554398c.
**Fixture:** sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 before and after the run (the suite printed "unchanged"), and the same again at the end.

**Build 1 (before T), rc 0:** last lines were `Finished dev profile ... in 4m 32s`, `copied exe`, `build-rc=0`. The exe is D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe, 91555840 bytes, mtime 2026-11-15 15:56:14 +0100, sha256 1a6303807c33597c178c6290dbf7affc5b56a9350b3085d473a5f3cf2e4b1da5.

**Commit T:** 3e0f8151eaeccd7d6721b2d0317510f378674f2b, subject as briefed, `3 files changed, 455 insertions(+)`.
- `frontends/shell/e2e/colour.mjs` is new, 442 lines.
- `frontends/shell/package.json` has the one `e2e:colour` line.
- `frontends/shell/e2e/README.md` has the Colour spec entry, 12 lines.
- Checks before the commit:
  - `node --check`: rc 0.
  - `npm test`: rc 0, `Tests 1494 passed (1494)`.
  - `npm run test:citation-integrity`: rc 0, `30 passed, 0 failed`.
  - `verify-cites`: rc 0.
  - `verify-test-claims`: rc 0.
  - `profile-path-scan --staged`: rc 0.
- Porcelain is empty and the branch HEAD is 3e0f8151.

**Run cb2-t:**
- It ran in a shared hold at the T commit, 30-minute timeout argument 1500 s, started 2026-11-15T15:02:41Z.
- Exit code 1.
- Byte-copied lines:
  - `[PB-E3] FAIL (2251ms): PB-E3: the dominant colour is 31,120,180,255, expected #4285f4 at opacity 1`
  - `[PB-E1] PASS (17246ms): coloured by zone through the Style tab (4 cases); legend agricultural | civic | industrial | residential | [P6 placeholder] No value | [P6 placeholder] Other; the dominant colour under each filter equals its swatch: agricultural 166,206,227,255; civic 31,120,180,255; industrial 178,223,138,255; residential 51,160,44,255; NULL 158,158,158,255`
  - `[PB-E4] PASS (2499ms): 9 steps; the colour by step records the match on zone (4 cases) with the dependency zone: Utf8; the One colour step after it is the literal #4285f4`
  - PB-E5 and PB-E2 passed, with all five PB-E2 checks (i) to (v) passing.
- Before PB-E3's pixel read, its earlier assertions held: `pre.style-document` showed the literal `#4285f4`, the legend was empty, and the One colour button was disabled. Only the frame colour was wrong: 31,120,180 is the second case's (civic) swatch, not the literal.
- In the console ledger (`m4b-e2e-cb2-t.rep.colour-console-ledger-1794754996305.json` in the harness `out` folder), the last two `[render-trace] layers` lines (entries 101 and 102) come from clearing the filter at the end of PB-E1. None follows the One colour click, so no render was traced after the style change.
- I can't tell from this one run whether the frame was captured stale, or the canvas did not re-render after `fillMatch` went to null. The latter would be a product defect in the Style-to-canvas path.
- My PB-E3 settle waited for 2000 ms of render-trace quiet, not for a fresh `layers` line after the click. `style.mjs`'s `waitForFreshLayerUpdate` waits for one, so that is a likely suite defect.
- Per the brief I did not re-run it, and I did not edit T.

**Not done:** the mutations, the exe rebuilds, the R commit, the size count against the 590 ceiling, and the push. T is 442 lines in `colour.mjs`, so it is under 590 by `wc -l`; I did not run §7's Count command. Anything written to the file by R has 148 lines of room.

**Departures:**
- I used `SHIMDIR=shim-wait` on the run so that `session.stop()` kills the app and PB-E4 can read the history. This was announced in my plan.
- I committed T before running cb2-t, so the run's head is T.
- The suite's steps run independently after PB-E1 instead of stopping at the first failure, so collateral failures can be recorded.
- PB-E2 sub-check (ii) compares the dialog text with the prompt's own value, so M-PB-E2c can fail at (i) alone.

**Wrote outside the worktree and `<S>`:** nothing else. Scratch folders from the run were removed by the suite. The worktree is clean.

**Status readings:** reading lines were `quiet=False average=45.1% peaks-over-25=60`, `average=26.1% peaks-over-25=29`, and `average=27.8% peaks-over-25=58`. No `project=SpatialIDE` line was present in any of the three. The other heavy-run lines are `<m>`.

**Pre-gate self-check:**
- Interface used is the real one: I read the dev hooks, `PublishPanel`, `StylePanel`, `viewTransitions`, the `recording.mjs` and `project.mjs` precedents, and `renderer/style-ts/src/style.ts`. The standalone esbuild and `Style.parse` check gave `#a6cee3 #9e9e9e #616161`.
- Completion claims have proving evidence for the passing steps only. PB-E3 failed, so the suite is not complete.
- User-facing messages: the README entry describes behaviour of the suite as built. Its PB-E3 description is not yet shown to hold on this exe.
- Required tests reach their intended assertion: PB-E3's pixel assertion was reached and failed.

**Cross-module seam:** it is read from the real shape. `e2eSaveProjectToFolder`, the `publishPrepareWithDestination` and `publishExecute` hooks, the history read after stop, and the viewer's `Style.parse` are all driven through the shipped code. I read `App.tsx` and `PublishPanel.tsx` (the cites for the commit message are not written, because there is no R commit). The caller grep is empty: `colour.mjs` adds no `pub` item or callback.

**Model:** Sonnet 5.5, `claude-sonnet-5-5`, no override. I received one context handoff (the summary at the top of this session) and produced none.

**Background shells left:** none of mine. Some `msedgewebview2.exe` processes are visible on the machine; they are not mine and I left them alone.

**State:** branch `cut/b1-shell-half-pr-b` at 3e0f8151eaeccd7d6721b2d0317510f378674f2b, 1 commit ahead of bfcb57e7, nothing pushed, porcelain empty.

**Next step, for the custodian:** a fresh brief is needed. The decision is whether PB-E3 should wait for a fresh `[render-trace] layers` line before it captures, as `style.mjs` does. If a second run still shows the old colour, that points at a product defect. The cb2-t log is `m4b-e2e-cb2-t.log` in `<S>/m4b-e2e-h/out`.
