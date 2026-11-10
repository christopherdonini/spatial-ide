*Custodian's filing note (2026-11-10): the worker's P1-D report, from its second hand-back (sha256 fea56ccf161a2f8bb4f986eb303f272a06a01ff7df9477f164169495268ca2c4, 6442 bytes), byte for byte below the rule. Its brief, brief-pa.md with Addendum 1 by file (2364 bytes, sha256 ecf9e83be3bc00b2f07f955981867c8cdf2020da389600f40f54f947811176a8); the run 2026-11-10T19:04:19Z to 2026-11-10T19:12:55Z by its transcript, 17 calls, model claude-sonnet-5-5. The diag file it names (100101 bytes, sha256 202469d0e05a521120a12df414dce6f2006a80c1bbd31b09c24bd4022b27817a) is kept in the local evidence folder, outside the repository.*

---

Observed: pan-anchor-setcam-waits-for-its-own-reset P1-D at 624b2e68 (HEAD 624b2e6893a39fc967eada2cc028875d3c7d767c)

Amendment 2 read whole from `ae7cd8f5` (form sha256 there 2bb1b698…c6302 verified). No fix, no second run, no commit and no push. Worktree reverted, `git status --porcelain` empty. No background shell left (all four calls ended on their own; app-down output shows ports 9223 and 5400 free).

**Patch** (the full diff is in `<S>/pa-p1d.patch`). It is `pa-p1.patch` re-applied, then extended; `node --check` exited 0, and only pan-anchor.mjs changed.
- Page side (by `Date.now()`):
  - `console.debug` is wrapped and passes every call through.
  - The `e2eSetViewState` wrapper records the call time and `document.visibilityState` at the call. It records the timer firing, the visibility at the firing, and the real seam's result or exception text with its return time.
  - Every `view-state` emission is recorded with its zoom and targetX. The wrapper still logs the stale line and fires the real seam at +2000 ms, as in P1.
  - The page side is collected with `page.evaluate` in the `finally`.
- Node side (by `Date.now()`): `setCam` start, evaluate-returned and found-or-throw; every `view-state` console receipt; every push into `vs` (wrapped `vs.push`) with its zoom; `pageerror`; console `error`.
- The diag JSON is written at the `finally` (success or throw) and again in `main().catch`.

**Run**
- Tag `p1d`. Fixture before and after: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 both times.
- Log first line: `worktree C:/dev/wt/pa head 624b2e6893a39fc967eada2cc028875d3c7d767c start 2026-11-10T19:06:27Z`.
- Result lines: PASS for all 8 small checks and for the first 7 large ones (`large: pixel-spaces-coincide` through `large: recenter-crossing-A dx=1200`). The fatal line is:
  `pan-anchor.mjs fatal: Error: setCam: no view-state line with zoom -6.99986 within 5500 ms of the call; 1 other lines arrived`
  Last line `rc=2 end 2026-11-10T19:11:39Z`. Exit 2, no `==== n/16 PASS ====` line.
- This is not the same call as in P1. The throw is the 14th `setCam` call (`large: recenter-crossing-A dx=-1200`, zoom -6.99986). The 7th call, which threw in P1, was found this time.
- App-down: `killed tree 46340`, `killed tree 70576`, `port 9223 free`, `port 5400 free`.
- app.err.log is two lines: the session log path and `data-plane expected origin (config mirror): http://localhost:5180`.
- Reports copied: tauri.e2e.conf.json (the `rep.` copy). No audit log file was created. The session log is copied to `<S>/pa-p1d.session.log` (228081 bytes).

**Diag file**: `<S>/pa-p1d-diag.json`, 100101 bytes, sha256 202469d0e05a521120a12df414dce6f2006a80c1bbd31b09c24bd4022b27817a. It holds 1158 node records, 14 page calls and 558 page emits. `pageCollectError` is undefined.
- **Errors, whole run:** the `pageerror` and console-`error` list is `[]`. `mainCatch` is the fatal text above.

**Records for calls 6 and 7** (t in ms relative to that call's `setCam-start`, printed by a script reading the file)
```
== call 6
node {"ev":"setCam-start","call":6,"zoom":-6.99994,"t":0}
node {"ev":"console-receipt","type":"debug","t":4}
node {"ev":"setCam-evaluate-returned","call":6,"t":5}
node {"ev":"push","zoom":-7.24994,"t":6}
node {"ev":"console-receipt","type":"debug","t":2015}
node {"ev":"push","zoom":-6.99994,"t":2077}
node {"ev":"setCam-found","call":6,"zoom":-6.99994,"vsLen":2,"t":2516}
(then 13 console-receipt/push pairs for the drag's lines, zoom -6.99994, t 2737..3790; and at t 5007 console-receipt, setCam-evaluate-returned call 7, push zoom -7.24993 at 5044)
page call {"call":6,"zoom":-6.99994,"tCall":2,"visCall":"visible","tFire":2013,"visFire":"visible","result":true,"tReturn":2077}
page emit {"t":2,"zoom":-7.24994,"targetX":10000000}
page emit {"t":2013,"zoom":-6.99994,"targetX":0}
page emit {"t":2734,"zoom":-6.99994,"targetX":0}
page emit {"t":2834..3789,...} (12 pan lines, targetX -12799.47 down to -140794.14, the last twice)
page emit {"t":5007,"zoom":-7.24993,"targetX":10000000}   <- call 7's stale line
== call 7
node {"ev":"setCam-start","call":7,"zoom":-6.99993,"t":0}
node {"ev":"push","zoom":-6.99994,"t":232}
node {"ev":"console-receipt","type":"debug","t":233}
node {"ev":"setCam-evaluate-returned","call":7,"t":234}
node {"ev":"push","zoom":-7.24993,"t":269}
node {"ev":"console-receipt","type":"debug","t":2241}
node {"ev":"push","zoom":-6.99993,"t":4878}
node {"ev":"setCam-found","call":7,"zoom":-6.99993,"vsLen":3,"t":5761}
page call {"call":7,"zoom":-6.99993,"tCall":232,"visCall":"visible","tFire":2235,"visFire":"visible","result":true,"tReturn":3060}
page emit {"t":232,"zoom":-7.24993,"targetX":10000000}
page emit {"t":2235,"zoom":-6.99993,"targetX":0}
```
Record shapes are as the script prints them. The call-6 pan lines are summarised in the parentheses where marked.

**What the records show, only**
- Call 7: the real line was emitted on the page at t 2235 and its console receipt reached node at t 2241. Its push into `vs` came at t 4878, 2.6 s later. The seam took 825 ms to return (tFire 2235, tReturn 3060). `setCam` found the line at t 5761, which is 261 ms inside its 5500 ms + call-return window. A previous-gesture line (zoom -6.99994) was pushed at t 232 after the clear, so `vs` held 3 lines.
- Call 14 (the throw): the page call was recorded at t 166 and the stale line emitted at t 166 and pushed; `tFire` is null and `tReturn` is null in the page record collected after the throw. No emission of zoom -6.99986 was recorded on the page. `vs` had 1 line at the throw (t 5551 after evaluate-returned).
- Under route 4 of Amendment 2, call 14 matches (b) (the timer never fired, no seam line emitted). Call 7 in this run matches (a) (emitted on the page, reached `vs` late). P1's seventh-call failure was not reproduced. The pair of runs show both shapes; I read no further.

**Hold lines** (`also=` elided): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:61372 …` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:61372 affinity=FF (cores 0-7)`.

**Harness disclosure**: unchanged from the first report (port-5400 harness, approval of 2026-10-11 item 1). Run files are under `<H>/out/pa-e2e-p1d.*`, and scratch files are `<S>/pa-p1d*` and `<S>/pa-diag-edit.mjs` and `<S>/pa-show.mjs` (the show script).

**Model**: claude-sonnet-5-5 (Sonnet 5.5), no override, no context handoff.
