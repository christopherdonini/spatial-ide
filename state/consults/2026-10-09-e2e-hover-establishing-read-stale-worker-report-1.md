*Custodian's filing note (2026-10-09): `e2e-hover-establishing-read-stale`'s worker report 1 (stages 1 to 3 under Amendment 1), the worker-high run 09:42:38Z to 11:26:06Z by its transcript, on `cut/e2e-hover-establishing-read-stale` from d007a50b, head 86c26f2bd1d11dba1b195ea54ce6592180cac10e, pushed. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8f0a417606817ddd037323ce28b299d52cc8796cba6fcb3e5fc77fd4569ea65b. The custodian checked: the worktree is clean at that head and origin holds it; the diff is lib.mjs 63 insertions and regression.mjs 17 insertions and 18 deletions; no process or port was left. The rest is the worker's.*

---

REPORT: e2e-hover-establishing-read-stale (slot 1, first item). The barrier is built, route A holds, and every run and mutation of the form is done. Nothing was left applied. Branch pushed.

MODEL: Sonnet 5.5, no override, no context handoff given or produced.

COMMITS (both `git commit -s`, trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` only, as your brief gave; I did not add the Claude-Session line from the harness reminder)
- f9e1f8dc793785f02a72346407261f825fac225b: `hoverIdAfterBarrier` appended to lib.mjs after `zoomInOneNotch`. K6's establishing helper and A9' candidate loop call it. Case (iii)'s non-comment lines are untouched. Only the last two lines of its comment changed (it now says the node has been diagnosed and points to this piece).
- 86c26f2bd1d11dba1b195ea54ce6592180cac10e: comments only. Recorded-mutation notes: M1 and M2 beside K6's helper, M-B beside the export, and re-observation lines for M3, M4 and M5. Everything is observed at f9e1f8dc.

§7 BY THE FORM'S COMMAND (`git diff --numstat d007a50b...HEAD -- frontends/shell ':(exclude)frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md'`)
- lib.mjs 63 insertions, 0 deletions
- regression.mjs 17 insertions, 18 deletions
- Total 98 lines in 2 files, against 140. No overrun.
- lib.mjs's diff is one insertion hunk after the old last line (`@@ -595,0 +596,63 @@`), 0 deletions.

STAGE 1
- Cites: I recomputed every `path:line @ rev sha256` pin in the form against base d007a50b. 55 distinct pins, 0 mismatches, 0 skipped. frontends/shell/e2e and src are identical at dba12b8, b4dc05e and d007a50b.
- §0.4 interfaces: re-read, no difference, so I1 did not fire. deck is installed 9.3.9, and the pointerleave-as-(-1,-1) handling and the sequence-guarded async pick are in `deck.js`.
- Odd map height mechanism: a TAURI_CONFIG window overlay, as in report 2 §3. I built three debug exes with the e2e overlay and the host-resolver rule, at heights 801, 803 and 800. They are copies, and vite runs from the worktree on 127.0.0.1:5400. No tracked file was edited for it, so A1.3's "temporary odd-height edit" never arose.
- Each run is a fresh app process through the `npx` shim, so every log reads `launched:true`.
- The measured map is authoritative and matched the window: 801 gives 668x737, 803 gives 668x739, 800 gives 668x736.
- Pick mode: by code reading only (`pickAsync: 'auto'` in deck.js, WebGL2 canvas), so sync. It was not observed at run time.

STAGE 2: ROUTE A HOLDS, so route B was not needed
- The first clean run at 801 (`r2-801-a1`) showed the barrier changing an id to clear: K6/re-pick had standing id 50244 and then took 47080. A9' and K6 both passed.
- I2 did not fire.

RUNS TABLE
Every run is the whole `e2e:regression` suite, and the process exit code is 1 for every run. The only failing step in any clean run is C2'/C3' ("expected {kind:"refused", code:"engine.identity_unusable"}, got {"kind":"admitted"}"). It fails the same way at 1280x800, so it is the known base failure (milestone 1 Amendment 11 item 3). NET' is INFO. Every other step passed.

| Row | Window | Measured map and capturePixels buffer | Result | Barrier lines |
|---|---|---|---|---|
| 2 (route A check plus two more, and one extra) | 1280x801 | 668x737, 668x737 | 4 of 4 runs: A9' and K6 PASS | see below |
| 3 | 1280x803 | 668x739, 668x739 | 1 of 1: A9' and K6 PASS | see below |
| 4 | 1280x800 | 668x736, 668x736 | 2 of 2: A9' and K6 PASS | see below |

- The 4th run at 801 is extra. My first M-B edit failed ("File has not been read yet") in the same Bash call that started the run, so it ran clean. I relabelled it and then did M-B properly.
- Barrier lines at 801 (identical in all 4 runs):
  - A9' (notch 4, flipY true): standing clear, taken 24517.
  - K6/continuous: standing clear, taken 24517.
  - K6/re-pick: standing `confirmed` id 50244, saw the change to clear, taken 47080.
  - K6/discrete: standing 47078, taken 48646.
  - K6/release-edge: standing 50244, taken 47080.
- Barrier lines at 803:
  - A9' standing clear, taken 29272.
  - K6/continuous standing clear, taken 29272.
  - K6/re-pick, K6/discrete and K6/release-edge: the same standing and taken ids as at 801.
- Barrier lines at 800 (both runs):
  - A9' standing `confirmed` 27683, taken 28625.
  - K6/continuous standing clear, taken 28625.
  - K6/re-pick standing clear, taken 52144.
  - K6/discrete standing clear, taken 50249.
  - K6/release-edge standing clear, taken 52144.
- Case summaries: in every clean run (i) reached the verbatim refusal text, (iii) re-picked the id named above, and (iv) reached an outcome.
  - (iv) at 801 and 803: "a different id (47080 -> 47078), confirmed re-picked".
  - (iv) at 800: "an absence, confirmed re-picked (nothing resident under that pixel)".
- A9' attempts with a standing id that differed from the id taken, per run: 0 of 1 at 801 (all 4 runs), 0 of 1 at 803, and 1 of 1 at 800 (both runs). So the pre-fix A9' read could have accepted 27683 at the default window.
- P2 holds: at the odd heights K6/re-pick's standing id (50244) differs from the id taken (47080) in every run. P3 holds: at 800 K6/re-pick's standing readout is `clear` in both runs.
- Fixtures: sha256 of all seven fixtures is identical before and after. The 100k-happy-path hash is fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49.

MUTATIONS
Each was applied once, run once, restored, and shown clean. After each restore `git status --porcelain` and `git diff` were both empty. No permission refusal occurred. Every run below had exit code 1 because of C2'/C3' plus the mutation's own failure. The clean check before each application was also empty.
- M1 (801, observed at f9e1f8dc, first run): the `hoverIdAfterBarrier` call in `establishAboveThresholdHoverK6` was replaced by the base's move-then-poll. K6 failed with "K6/re-pick: after ONE discrete zoom-out step with the pointer stationary, .hover-readout no longer names the feature the pointer is still over (expected id 50244, last seen {"state":"confirmed","text":"id 47080 …". The standing id was taken and the true one was last seen. A9' passed. I4 did not fire (1 failure in 1 run).
- M-B (801, observed at f9e1f8dc): the `page.mouse.move(leave.x, leave.y)` line in lib.mjs was deleted. K6 failed with "K6/re-pick: hover barrier: .hover-readout did not reach the clear state within 5000ms of the pointer leaving .working-canvas (standing readout {"state":"confirmed","text":"id 50244 …", last state seen the same". The earlier establishing calls passed.
- M2 (800, observed at f9e1f8dc): `pickCandidateAt` in WorkingCanvas.tsx picked at `x + 40`. K6 failed at K6/re-pick with the :1332 message (expected id 52144, last seen id 52145). A9' passed. No earlier case failed.
- M3 (800): the marker span was deleted. K6 failed with "K6/discrete: the labelled state rendered at notch 1/8 with NO marker element". Cases (i) and (iii) had passed.
- M4 (800): `lastPointerPxRef.current = null;` was deleted. K6 failed with "K6/release-edge: a camera-settle re-pick line appeared in the render trace since this step's mark, whatever the pick found: "[render-trace] readout_confirmed camera-settle-repick cleared {zoom: -0.8481387601458408}"".
- M5 (800): `isBelowPickResolution` was made to return `true`. A9' failed with "A9': timed out after 120000ms". K6 failed with "K6/continuous: no above-threshold hoverable candidate found after trying notch 0 plus 15 zoom-in notch(es)". This matches the prediction. No barrier line took an id.

HEAVY COMMANDS (all shared holds, all granted, none refused, no exit 96 to 99)
- cargo build, window 801, cold: rc 0.
- cargo build, window 803: rc 0.
- cargo build, window 800: rc 0.
- Run 801 route A check: rc 1.
- Run 801 a2 and a3 plus 803 a1 (one hold): rc 1.
- Run 800 a1 and a2 (one hold): rc 1.
- Run M1: rc 1.
- Extra clean run at 801: rc 1.
- Run M-B: rc 1.
- Runs M2, M3, M4, M5 (one hold each): rc 1.
- Not held, all rc 0: `npm ci` in frontends/shell and in renderer/bundle-viewer, the viewer build, `generate:notice`, and `npm run test:citation-integrity` (30 passed), `test:residency-trace` (76 passed), `check:dev-origin` and `check:origin-event`.
- I did not run the full `npm run verify`, the governance `node --test` suite or verify-cites.
- `verify-quotes.mjs` on the two files reports 11 "quote not found" lines on regression.mjs strings I did not touch. The main checkout gives 11 too, so I count it as pre-existing.
- After each run `app-down` stopped only the pids `app-up` recorded. Ports 5400 and 9223 were free afterwards. The background monitor I started was killed.

§8 ITEMS
1. Only lib.mjs and regression.mjs changed: `git diff --name-only d007a50b...HEAD` lists exactly those two. OK.
2. Case (iii): only comment lines changed, 2 lines inside the 1318 to 1320 sentence. No non-comment line changed. OK.
3. No retry or re-established hover in (iii). OK.
4. No product code committed and nothing left applied. OK.
5. No change to any assertion, predicate, timeout, notch count or step bound. The 5,000 ms id wait now sits inside the export, at the same value. OK.
6. No fixed sleep or frame count as the barrier. OK.
7. Every K6 and A9' attempt that takes an id goes through the export, which logs one line per attempt. OK.
8. No timing figure is asserted. The only numbers in the code are the bounds (5,000 ms and the 4 px offset). I report no durations. OK.
9. Every changed test has its observed mutation (M1, M-B, M2, M3, M4, M5). I ran no `verify-mutation`. OK.
10. The only export is `hoverIdAfterBarrier`, and regression.mjs calls it from two sites. OK.
11. No dependency or lockfile change. OK.
12. I marked no quote of the human's words verbatim. OK.
13. source-changed.mjs and residency-harness.mjs are untouched. OK.
14. lib.mjs has insertions only, after its last line (0 deletions). OK.
15. The private `waitForCondition`, `readHoverReadoutState` and `hoverReadoutId` were extracted from the base by `sed -n` on regression.mjs lines 145-154, 1177-1193 and 1199-1201, so they are byte-identical. None is exported. OK.
16. No second export, and no parameter the callers do not pass. OK.
- I8 did not fire. I1 to I7 did not fire.

DIFFERENCES FROM THE FORM, AND THINGS TO KNOW
- The 4th clean run at 801, explained above.
- Whether the barrier "saw a change to clear" in the log is taken from the standing readout before the barrier. It is not a separate detection.
- In the M5 run, A9''s raced-out continuation kept running in the page and interleaved its barrier lines with K6's. That is the existing `withTimeout` behaviour.
- lib.mjs's export is `async` and takes `(page, target, label)` as A1.2 says. The reading of the leave point (4 CSS px above the top edge, then 4 px left of the left edge) is done in one `page.evaluate`. Route B was not written.

FINAL STATE
- Worktree `C:/dev/wt/k6`, branch `cut/e2e-hover-establishing-read-stale`.
- HEAD 86c26f2bd1d11dba1b195ea54ce6592180cac10e, pushed to origin with upstream set. No force-push, no rebase, main untouched, no pull request.
- `git status --porcelain` is empty.
- Ignored leftovers: node_modules, the viewer dist, src/generated, and `D:/wt-targets/k6` (the cold target holds the build; the exe copies are in its `exes` folder).
- My scratch folder holds all the tooling and the per-run logs, including the barrier lines and monitor output.
