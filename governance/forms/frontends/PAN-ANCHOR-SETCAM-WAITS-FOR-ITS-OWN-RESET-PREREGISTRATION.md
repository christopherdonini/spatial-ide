# shell e2e: pan-anchor's setCam waits for the view-state line its own reset logs, never a late line from the previous gesture — a reproducer at the base first, test only, five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's checks has been seen says so in its first line. PLAN node pan-anchor-setcam-waits-for-its-own-reset, slot 2, placed by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 11). The short answer, the five lines, the notes, the OPEN items, the reuse index, the record findings and what is not settled are the architect's draft (`state/consults/2026-11-10-pan-anchor-setcam-waits-for-its-own-reset-form-architect-draft.md`, read only at main 544c8971; extracted sha256 de3edf149d47afe332fc1116aa6fd4895738fe2ac9c4fb1c5bba08e91841bbb9), carried byte for byte from its short answer on, with these changes, all the custodian's: the draft names its read commit C (its read note); each cite it writes `path:line @ C` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (35 pins, 15 of them by a file name that resolves to one tracked path at that commit), and each bare line number's `@ C` to `@ <commit>` (19); this title and lead line added; the draft's opening lines (its draft line and its read note) dropped; the custodian's settlement added. Form path: `governance/forms/frontends/PAN-ANCHOR-SETCAM-WAITS-FOR-ITS-OWN-RESET-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

**Short answer (mine).**
- **The cause is real at main, but not quite as the node summary states it.**
  - The suite's console listener pushes each view-state line only after an awaited `jsonValue()` round trip.
  - `drag` waits for quiet on those pushes, not on the page's emissions.
  - So the previous gesture's last line (its pan-end tick, logged before the deferred recenter, which logs nothing of its own) can land after `setCam` clears the log.
  - `setCam` then returns the last line it holds once any line is there, so it can return that stale line.
- **The fix:** `setCam` returns the line whose zoom is its own jittered value.
- **What the fix does not remove:**
  - The same lag can also cut `s1` short. In diag run 1, large dx=-1200, `s1` is short by 300 px, so that case would still read about -300 px with a correct `s0` (my arithmetic).
  - There-and-back's 168.00 px is not explained by anything the code or the records show.
- **Route:** one file, about 25 lines, a five-line form, a single reviewer.

---

## The form (five-line, `governance/AUTONOMY.md` §21d)

Path: `governance/forms/frontends/PAN-ANCHOR-SETCAM-WAITS-FOR-ITS-OWN-RESET-PREREGISTRATION.md`. Neither the template (docs/PREREGISTRATION-TEMPLATE.md:146-161 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:1fa3a0a1f684962d334dae85179ee13ea533c0e2adb45a2a3e83f3cf4f157031) nor the forms index (governance/README.md:19 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:016bc203ae0da1a764f6f0d1908c9e9ddb8b04d595d2f6497fd7625e67bdbd2c, one folder per former top-level folder) names a file. The suite lives under frontends/, and the precedent sits in governance/forms/frontends/, so this form goes there too. `PAN-ANCHOR-PREREGISTRATION.md` is a different piece's form and its path is not reused.

```
Authority: PLAN node `pan-anchor-setcam-waits-for-its-own-reset` (governance/PLAN.yaml:5520-5536 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:99658bb04d28fcb207292cd854d1bd1350994db0774d7bdffa3bbd2b2684d720), generation 1; the human's placement, slot 2, after publish-e2e-filtered-step-shared-run-failure, a five-line form (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:11 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:a8d065a9ea15b39fbb4257a92e8c53ae96ecac134576c17d07b2b27879a2cb72); its source, the `## pan-anchor` section of state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md (:83-124 @ 544c897194f45cecc56ed651d6c2375ec83a5e03), evidence, not Authority; the human's gate-round rulings, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a); e2e runs on the port-5400 harness under the approval of 2026-10-11, item 1 (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:99a0e4c3f7c9278ef1871b5222638b97b46d6a6dce7f11718f3ea54b2f48fb84), until the human says port 5180 is free and a listen test on it passes, then on 5180, by the human's ruling of 2026-11-09 on every piece's e2e (state/directives/2026-11-09-304-open-b-a-widened-303-clicked-pef-open-2-a-open-5-listen-test-then-5180.md:13 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:ce7039173e17b0d97e79271ec8a978ad62fc1dfa29cdd071fd2cf74f6be8bd18); non-red-line OPEN items under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38), held to 2026-11-16 (the placement directive, :9 @ 544c897194f45cecc56ed651d6c2375ec83a5e03); the reuse index found no prior art on either search (e2e stale log line wait; deck.gl view state pan drag test), a miss noted here.
Scope: 1 file: frontends/shell/e2e/pan-anchor.mjs; declared line budget 40, insertions plus deletions, comments counted (governance/AUTONOMY.md:357 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; frontends/shell/src/canvas/WorkingCanvas.tsx (M-TRACE) and a probe wrapper in pan-anchor.mjs (P0, P1) are edited and reverted for observations and never committed; renderTrace.ts, e2e-test-surface.ts, e2e/lib.mjs, e2e/README.md (no pan-anchor entry), MANUAL-WALKTHROUGH.md, KNOWN-LIMITATIONS.md and every other e2e suite are read, not changed; no other file changes.
Change: `setCam` returns the first view-state line logged since its clear whose `zoom` equals the jittered zoom it passed to `window.__SPATIAL_E2E__.e2eSetViewState` (the reset's own line, frontends/shell/src/canvas/WorkingCanvas.tsx:2340 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:07b16e9017f1af73a5f49ecd61bd4d5830c365928433dcab347e6f56b2d78ea7), after the existing 500 ms minimum, under a hard bound whose failure throws an error naming setCam, that zoom and the bound — never the last line merely because one has arrived; `drag`, `instrumentA`, every case, the tolerance and every other helper are unchanged.
Tests+mutation: every pan-anchor check, each reaching `setCam` (the changed helper; no assertion changed); M-TRACE: WorkingCanvas.tsx:2340's `traceViewState(0, 0, zoom, frame.originX, frame.originY)` given `zoom + 1e-6`, predicted exit 2, `pan-anchor.mjs fatal:` with setCam's bound message at the first call (small, normal-A dx=300), after `PASS  small: pixel-spaces-coincide`; reproducer, before any code: P0 at the base, a page-side wrapper over `e2eSetViewState` (worktree edit of pan-anchor.mjs, reverted) that logs a stale `[render-trace] view-state` line (targetX 1e7, zoom the call's minus 0.25, origin the call's target) at once and runs the real seam 2000 ms later, predicted exit 1 with both `pixel-spaces-coincide` checks PASS and the other 14 FAIL by name — P0 exiting 0, or any of the 14 passing, is a STOP; P1 at the head, the same wrapper, predicted exit 0, `==== 16/16 PASS ====`; R1 unmutated at the head, exit 0, `==== 16/16 PASS ====`; M-TRACE's failure recorded by name in a `RECORDED MUTATION` entry of the file's header with the 40-hex commit it was observed at, then reverted and the worktree shown clean; a verify-mutation run is not an observation; mutation observations are the gate's own (Part 1, item 9); a run departing from its prediction is a stop, and no retry is added; every run on Windows inside `hold shared -Project SpatialIDE`, the port named by the harness, the fixture's sha256 recorded before and after, the app's stderr, the suite's output and the session log copied right after each run; `--measure` never passed; the e2e does not run on CI.
Out-of-scope: ADR: none (ADR-010 rule 1 unchanged: the suite reads only the shell's own trace line, never deck's `info.coordinate`); security: none (the DEV-only seam and `registerE2eHook`'s instrumented-build gate unchanged; no exposure surface, no dependency); wire: none (nothing under protocol/; the trace line is a console line, not SKP or MCP); guarantee: none (every check asserts the same residuals against the same 4.0 px tolerance, frontends/shell/e2e/pan-anchor.mjs:45 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:ffb43e0f9b4aefc7735146467b19c14463e3401c650392e2da53af560cd2a912; the wait is a precondition on which line is read as s0, not a property); no string the app shows is added or changed.
```

Budget: **60 minutes.** It rests on two things:
- The precedent's 45 minutes fitted its code and not its runs (its form, note 3).
- This piece needs four suite runs (P0, P1, R1, M-TRACE), `npm run verify` in a hold, and a debug exe only if the harness's exe is older than the shell's src-tauri at B.

The pan-anchor suite runs longer than publish's 17 to 23 seconds (the gate report's run windows), because of its sleeps and fills. My estimate is a few minutes per run; it is not a measurement.

---

## Notes (mine)

**1. The failure as recorded (settle 1).**

These are the source's byte-copied lines.
- The heads, from state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md:3 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:e83045c2b6b7713360d77a820f5d5b7e5fac5b850416138087e0947e7e671700 (a sub-line span): `the detached checkout C:/dev/wt/mm2b-e2e at the branch head e1f92a974aa9ce77150be0b057160cec755bb910 (main f8bc2951 for the three comparison runs)`
- Run 2, from :88-92 @ 544c897194f45cecc56ed651d6c2375ec83a5e03:
```
--- window small: client 328x552, buffer 328x552, DPR 1 ---
--- window large: client 788x812, buffer 788x812, DPR 1 ---
FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
==== 15/16 PASS ====
FAILED: large: recenter-crossing-A dx=-1200
```
- :99 @ 544c897194f45cecc56ed651d6c2375ec83a5e03: `run 2: FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4) | ==== 15/16 PASS ====`
- :102 @ 544c897194f45cecc56ed651d6c2375ec83a5e03, a sub-line span: `with the large window 1400 by 876 in place of 1400 by 900 (DIAG-PAN-876), so the canvas is 812 tall under the old bar`. The file's own window sizes are 820 by 640 and 1400 by 900 (frontends/shell/e2e/pan-anchor.mjs:285, :287 @ 544c897194f45cecc56ed651d6c2375ec83a5e03).
- What DIAG-PAN-DRAG logs, :110 @ 544c897194f45cecc56ed651d6c2375ec83a5e03, a sub-line span: `(logging, for each recenter-crossing drag, the element under the pointer, the start and end, the view-state count, s0, s1 and the first lines after the call)`
- Diag run 1, :113 @ 544c897194f45cecc56ed651d6c2375ec83a5e03, a sub-line span: `diag run 1 rc=1 ==== 14/16 PASS ==== FAIL  large: there-and-back-net  ::  net residual 168.00 buffer px (tol 4) FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 800.01 buffer px (tol 4)`
  - Its dx=1200 `s1`, :114, a sub-line span: `"s1":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320}`
  - Its dx=-1200 record, :115, a sub-line span: `"vsBefore":2,"vsAfter":12,"s0":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":102390.06352414814,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}`
- Diag run 2, :116, a sub-line span: `diag run 2 rc=1 ==== 14/16 PASS ==== FAIL  small: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4) FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)`
  - Its dx=-1200 record, :118, a sub-line span: `"vsBefore":2,"vsAfter":14,"s0":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":140786.33734570362,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}`
- Diag run 3, :119, a sub-line span: `diag run 3 rc=1 ==== 15/16 PASS ==== FAIL  small: recenter-crossing-A dx=1200  ::  grab-point residual 800.00 buffer px (tol 4)`
  - Its large dx=-1200 case, which passed, :121, a sub-line span: `"vsBefore":1,"vsAfter":14,"s0":{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}`
- The source gives no PAN-DIAG lines for the small window.

**What the code at main shows.**

- **The listener.** It pushes `await a[2].jsonValue()`, so each push lands one CDP round trip after the console event (pan-anchor.mjs:60-63 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:db4aa4d2cba1d84e793e86f767ce901663f43349ec516a3bd6e7c5b4327cfe29).
- **`setCam`** (pan-anchor.mjs:92-105 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:cb3a70bb9b8397a4d9bdd6e8a7281065c39cd704a996d29d34f776d6031ff7a1):
  - it clears the log (`vs.length = 0`, :97);
  - it calls the seam with `z + jit * 1e-5` (:98);
  - it sleeps 500 ms (:99), then polls while `vs.length === 0` (:103);
  - it returns `vs[vs.length - 1]` (:104).
  - The comment at :100-102 says "Wait for the line itself", but the loop waits for *any* line. That sentence is untrue as the code stands, and the change replaces it.
- **`drag`** ends on `waitForSettle(() => vs, { quietMs: 600, timeoutMs: 9000 })` plus 180 ms (:114-115). `waitForSettle` measures quiet on the array's length, so it measures pushes, not emissions (frontends/shell/e2e/lib.mjs:348-369 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:b8de0367e9d6ac10206551d7093797d650c401b30412c76e40fdfdd739afa1af). A backlog in the push pipeline longer than about 780 ms therefore lets `drag` return before its own gesture's last lines are pushed.
- **The seam** (WorkingCanvas.tsx:2324-2349 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:18388468b6ce61983a802302122d985b5cfd784e4d86ed613306c5db6c0b9455) does three things in order:
  - it calls `frame.forceRecenter(targetX, targetY)` (:2338);
  - it logs exactly one line, synchronously, before it returns: `traceViewState(0, 0, zoom, frame.originX, frame.originY)` (:2340);
  - it calls `deck.setProps({ initialViewState: … })` (:2343).
  - `setProps` with a new `initialViewState` overwrites deck's view state without calling `onViewStateChange`. I read that in the installed @deck.gl/core 9.3.9, `dist/lib/deck.js`, the `setProps` branch; that is evidence, not Authority, and the file is not tracked. MANUAL-WALKTHROUGH.md:1010 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:f72bbe2e8ec362bd7df1a25bcb7aa305d410d365772d3774a6b39a77dbfc2fde states the same.
- **The always-on line.** `traceViewState` is `console.debug("[render-trace]", "view-state", { targetX, targetY, zoom, originX, originY })` (frontends/shell/src/diagnostics/renderTrace.ts:52-54 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:c0625d203a8d31e2a64ace70438fc9789040afce42e36f3467328cb4a82697ea). It has exactly three call sites: the fit (WorkingCanvas.tsx:1410), the controller callback (:2101) and the seam (:2340), each @ 544c897194f45cecc56ed651d6c2375ec83a5e03. :1292-1295 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 names the same three camera-change sites.
- **The gesture end.**
  - deck fires one `isDragging: false` tick at pan end (WorkingCanvas.tsx:2083-2091 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:e11c719c9c09b831d8bd8b32388d707e389d5c1cf09c66cb60d1f70e83049b16; in the installed controller, `_onPanMoveEnd` → `updateViewport`, and a new controller state counts as changed).
  - :2101 logs that tick with the pan's final target and the frame origin from *before* any recenter.
  - The deferred recenter at :2127-2134 then calls `setProps({ initialViewState })` and logs nothing.
  - So "its gesture-end recenter" emits no line. The late line is the pan-end tick's own line, and its fields equal the drag's last pan line.
- **The records against that.**
  - In both failing large dx=-1200 records, s0 is byte-equal to the previous drag's s1, including its origin 2606340, the pre-recenter origin, and the previous call's zoom -6.99987.
  - jit is global: the large size's dx=+1200 case is the 13th call (-7 + 13e-5) and dx=-1200 the 14th (-6.99986) (my arithmetic, from :96 and the call order at :226, :238, :258, :271 @ 544c897194f45cecc56ed651d6c2375ec83a5e03).
  - The "first line after the call" is the reset: targetX 0 and the call's own zoom.
- **Verdict on the custodian's reading** (mine).
  - **Holds in substance.** A line from the previous gesture lands in `vs` after the clear, and `setCam` returns it.
  - **Holds in part on the source.** It is the pan-end tick's line (or the identical last pan line), not a line of the recenter, which logs none.
  - **"arrives first and is taken as the reset" (the node summary) is not what the code does.** `setCam` returns the *last* line it holds. A stale line is returned only when it is last at the return: either the reset's push had not landed after at least 500 ms (the lag :100-102 already records on a loaded machine), or it landed before the stale one.
  - `vsBefore: 2` in every failing record against `1` in the passing one fits either ordering. Without the instrument's definition of `tail` I cannot tell which. My reading, unverified: the first, because one CDP session answers in order.
- **Other mechanisms the code shows.**
  - **(a) The same lag on `s1`.** `s1 = last(vs)` after `drag` (:228, :242, :261, :273 @ 544c897194f45cecc56ed651d6c2375ec83a5e03) can precede its gesture's last lines.
    - Diag run 1's dx=-1200 `s1` is 102390.06, 8 of 11 steps of 12798.76. Run 2's is 140786.34, all 11 steps, and run 1 has `vsAfter` 12 where run 2 has 14.
    - (102390.06 + 140787.31) × 2^-6.99986 - 1100 ≈ 800.0, the recorded 800.01. With a correct s0 of 0 the same case would read ≈ -300.0 and still fail (my arithmetic).
    - So the source's Reading, at :124 @ 544c897194f45cecc56ed651d6c2375ec83a5e03, a sub-line span (`The drag itself pans the full distance (s1 at ±140786 in world units, both directions).`), does not hold for diag run 1. The node summary's "although the drag panned in full" does not hold there either.
  - **(b) There-and-back-net, 168.00 buffer px, diag run 1, large.**
    - No PAN-DIAG line covers that case.
    - A stale s0 from the previous paint-vs-event drag would give about 11 000 px, not 168.
    - A truncated s1 would give a multiple of 7.5 px, and 168 is not one (my arithmetic).
    - The code shows no mechanism that yields 168.00. I say so plainly.

**What I would have needed from the two instruments.**
- **DIAG-PAN-DRAG:**
  - its code, and in particular how `tail` was taken (from `vs`, from the index at `setCam`'s return, or from a separate listener in emission order);
  - per line, the page's emission time and the push time;
  - `vs` whole at `setCam`'s return and at the read of s1;
  - the previous `drag`'s `waitForSettle` result (`settled`, `count`);
  - the same records for there-and-back.
- **DIAG-PAN-876:** its patch, to confirm it changed only the resize call.

Neither is in the repository.

**2. The change (settle 2).**

Function touched: `setCam` (pan-anchor.mjs:93-105 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:fddea67da35a817db9d5ad36dc8e6ade9cce18799a14156fb0eba419f0839cac), its comment, and the file header's `RECORDED MUTATION` entry. Nothing else.
- Compute `const zoom = z + jit * 1e-5` once and pass it to the seam, replacing the inline expression at :98.
- Keep the clear (:97) and the 500 ms minimum (:99).
- Poll until `vs.find((l) => l.zoom === zoom)` is defined. Return that line, not `vs[vs.length - 1]`.
- If no line matches within the bound, throw an Error. It must name setCam, the call's zoom, the bound, and how many other lines arrived. It reaches `main().catch` and exits 2 (:301 @ 544c897194f45cecc56ed651d6c2375ec83a5e03).

Can a line carry that zoom and not be the reset? At main, inside the clear-to-return window, no (my reading of the code):
- The seam logs one line with exactly the `zoom` argument (:2340).
- The controller callback (:2101) fires only on input or a transition, and the suite sends no input in that window. A late line from the previous gesture carries the previous call's zoom, since a pan keeps the zoom.
- The jittered zooms of the 14 calls are pairwise distinct: the bases differ by at least 0.5, and the jitters by under 2e-4.
- A fit line (:1410) carries a computed fit zoom. It is not shown to be unequal by construction, but equality with a jittered double is not reachable by any path the code shows.
- Exact equality also depends on Playwright's number serialization in both directions. R1 proves it on the real seam: every call must find its line, or the run exits 2.

The bound:
- The present bound is 500 ms plus 20 × 250 ms. It is kept as 5.5 s. Its cadence is OPEN-3.
- A failing wait lasts *at least* the bound after the seam call returns, never "at most". This follows the precedent's W2.

Sentences: under Part 1, item 1, the worker writes `setCam`'s comment and the header entry from the built code, and they must cover:
- what the wait matches and why that line is the reset's;
- the bound, and what its failure names;
- that the wait is a precondition, not a property;
- that a late previous-gesture line stays in `vs` and is not read;
- that `s1` is not covered (OPEN-1);
- M-TRACE's entry, with its commit.

No product code changes. Anything beyond this is an OPEN item.

**3. The route (settle 3).**
- Files: 1. Lines (my estimate, not a count), about 20 to 28:
  - setCam about +10/-5;
  - the comment about +5/-3;
  - the RECORDED MUTATION entry about +4.
  - Declared 40.
- §21a (governance/AUTONOMY.md:315-332 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3): no category is touched.
  - On "any property currently under test" (:325-327): every check's residual formula and the 4.0 px tolerance are unchanged.
  - The change selects as s0 the line the instrument already defines s0 to be, the post-reset state, and its failure becomes a named error instead of a stale read or `undefined.targetX`.
  - The reviewer checks this reading first.
- §25 (e) (:482 @ 544c897194f45cecc56ed651d6c2375ec83a5e03): the Out-of-scope line asserts that none of the four categories is touched, so the five-line form is open.
- §21c (:347-357 @ 544c897194f45cecc56ed651d6c2375ec83a5e03): all four bounds hold. One file of 8, well under 150 lines, no exposure surface, no dependency, no user-visible behaviour.
- §21b (:334-345 @ 544c897194f45cecc56ed651d6c2375ec83a5e03): the single reviewer gate is open (OPEN-6).
- §36 (:687-696 @ 544c897194f45cecc56ed651d6c2375ec83a5e03) does not apply: this is a slot 2 piece, not a filler.
- This is the smallest true reading. Scope is not trimmed: the s1 lag is out of scope because the node does not name it (OPEN-1), not to make the piece fit.

**4. The evidence (settle 4).**

Shared conditions for every run:
- In one Bash call inside `hold shared -Project SpatialIDE`, from frontends/shell, through the harness's run-suite step with a hard `timeout`.
- The command is `node e2e/pan-anchor.mjs` (pan-anchor.mjs:9 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:54a51c1a0cd6e9a787e365b8e03cf80a9b16b25819aa08f6cd64a04280b7c8a5; there is no npm script for it). `--measure` is never passed: with it the suite exits 0 on failures (:294).
- **Until the human's word and a passing listen test on 5180:** the port-5400 harness.
  - a debug exe with the TAURI_CONFIG overlay, CDP on 9223 (lib.mjs:33 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:b2827fa0fa0243d23feeebfbee0ccd0c6e414182f321aaef9f064476afdcebb4), localhost:5180 mapped to 127.0.0.1:5400 (lib.mjs:37 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:418bf82b63dcca39827e753c2247286b54452f89db7b3d4c60d3fd9a2089d7f8);
  - Vite on 5400 with `--strictPort`;
  - the npx shim on PATH for those runs only;
  - `attachOrLaunch` attaches (lib.mjs:158-166 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:e8c84607c3999df4b8b7098858ab5a5fbb3661d3a3cd757cbdf4933f9867d212), and Vite, relaunched for each run, serves the worktree's sources, so M-TRACE needs no rebuild.
- **After a passing listen test:** the same command with no overlay. `attachOrLaunch` spawns `npx tauri dev` itself (lib.mjs:192-200 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:e0c0c40a30fc68ccb51af852be4a99c4b5ef28a96bca47b21631a975200a87d4), which builds, so the run stays inside the hold.
- Before and after each run: the fixture's sha256 (pan-anchor.mjs:47 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:f80b62fd5d680a146f1f9dd0b7ac744f2bee71c1ffdc0ba21e20b3cb2b70e2be, read from the main checkout's target folder).
- Copied right after each run: the app's stderr, the suite's output and the session log.
- `validate` is never used.

The runs:
- **P0, the reproducer, at the base B, before any code.**
  - Worktree edit: after `setup()` in `main`, one `page.evaluate` wraps `window.__SPATIAL_E2E__.e2eSetViewState`. The wrapper:
    - logs `console.debug("[render-trace]", "view-state", { targetX: 1e7, targetY: 0, zoom: z - 0.25, originX: x, originY: y })`;
    - schedules the real seam with `setTimeout(…, 2000)`;
    - returns `true`.
  - Expected: exit 1, `PASS` on both `pixel-spaces-coincide` checks, `FAIL` on the other 14.
  - Why it is deterministic: the stale line is emitted 2000 ms before the reset, so at 500 ms `vs` holds only it. A stale world point at E_C + 1e7 is out of reach of any real `s1`, so no residual can come back inside 4 px.
  - Exit 0, or any of the 14 passing, is a STOP: the probe did not deliver. It is never read as evidence.
  - Reverted; porcelain shown empty.
- **P1 at the head, the same wrapper.**
  - Expected: exit 0, `==== 16/16 PASS ====`. Each call returns at about 2.5 s, inside the 5.5 s bound.
  - Reverted.
  - P0 failing and P1 passing is the evidence that the change removes the stale-s0 cause.
- **M-TRACE at the head, no wrapper.**
  - WorkingCanvas.tsx:2340's zoom argument given `+ 1e-6`.
  - Expected: exit 2. Output: `--- window small: …`, then `PASS  small: pixel-spaces-coincide …`, then `pan-anchor.mjs fatal: Error: setCam: …` naming the call's zoom and the bound.
  - It shows the wait is specific to the reset's own zoom. Under the unchanged setCam at main, this mutation would pass.
  - Reverted; the line shown back.
- **R1 at the head, unmutated.**
  - Expected: exit 0, `==== 16/16 PASS ====`.
  - This is the seam's real-shape end-to-end proof: every one of the 14 calls found its own line.
- **Readiness (Part 1, item 4), at the head, each with an expected exit of 0:**
  - `node --check e2e/pan-anchor.mjs`;
  - `npm run verify` in frontends/shell, in a shared hold;
  - the scripts' `node --test`;
  - `verify:plan`, `verify:cites` and `verify:quotes`.
  - A fresh worktree runs `npm ci` in frontends/shell and in renderer/bundle-viewer.
- **Claim limit.** P1 and R1 show that s0 is the call's own reset. They do not show that recenter-crossing-A cannot fail from the s1 lag (note 1 (a)). No record may say the #218 failures cannot recur.

**5. What must not change (settle 5).**
- In pan-anchor.mjs:
  - `setup` and its listener (:57-74);
  - `readBox`, `drag`, `instrumentA`, `waitForFill`, `columnCentroid`, `resizeWindow`, `settleCanvasSize`, `record`;
  - `runCasesForSize`'s cases and their arguments, and `main`;
  - `TOLERANCE_BUFFER_PX` (:45), `EDGE_MARGIN_PX`, the `FILL_*` bounds, `PAINT_ZOOM`;
  - the existing RECORDED MUTATIONS (:146-152).
- In the product: WorkingCanvas.tsx (M-TRACE never committed), renderTrace.ts, e2e-test-surface.ts, and what a user sees.
- In the documents: MANUAL-WALKTHROUGH.md and KNOWN-LIMITATIONS.md, neither of which names pan-anchor or setCam; and e2e/README.md, which has no pan-anchor entry (searched; none).
- Rule (00) (governance/AUTONOMY.md:606-610 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:baec02eb42f6476b817f5e75fd234dc6fbc70adea33fd8a53a20635fe2a33676), against the brief's lists:
  - #306 touches `frontends/shell/e2e/publish.mjs` only. It is disjoint from this piece, and the node depends on it.
  - #305, B1 PR C, port-2, 1c and 12c touch none of these paths.
  - protocol/: none.
  - WorkingCanvas.tsx is edited and never committed, so it claims no path.
  - The custodian rechecks at dispatch.

**Constitution check (mine).** No violations.
- docs/01: evidence only.
- ADR-010 rule 1: the suite still reads the shell's own trace line.
- ADR-006: untouched.
- docs/08: no number; 5.5 s is a bound.
- docs/02 and docs/10: no wire, no MCP.
- docs/07: the prototype slice.
- Seam rule: the consumer side read is the real `e2eSetViewState` (frontends/shell/src/e2e-test-surface.ts:305 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:84c32191df675d974ce5afaabfd63fe3218b73e0385cfc471eb8cd5d41bd3919; WorkingCanvas.tsx:2324-2351 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:d2a8fde77ba254d0b1c0d6c3037c2dc0d0c3dfae77f4be5c90395bf65925f96f) and the real trace shape (renderTrace.ts:53 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:99d7d70cdf835e76cc5b6d55ca3acd43ec2897561141442f1972d0f6210f1585). R1 is the end-to-end proof from that shape. No `pub` item, callback or option is added.

---

## OPEN items

**OPEN-1. The s1 lag (note 1 (a)), and the 168.00 px there-and-back failure (note 1 (b)).** **Red line by my reading:** taking either into this piece changes the scope of a ruled item, the human's placed node.
- (A) Not in this piece. The form claims only s0 (note 4's claim limit). The custodian proposes a node: first a diagnostic that logs emission and push times, `vs` at each read and there-and-back's s0 and s1; then a fix. A gesture line carries no gesture id, so `drag` cannot wait for "its own" line the way `setCam` can. The human places it.
- (B) Widen this node to `drag`'s read of s1.
- **Recommend (A).**

**OPEN-2. Reproducer form.** Not a red line.
- (A) The in-app wrapper probe, P0 and P1, as reverted worktree edits: the real listener, the real seam, the real shape (Part 1, item 7).
- (B) A Node-only fake-page probe that evaluates setCam's text: deterministic and needs no app, but a test double for the page.
- **Recommend (A).**

**OPEN-3. The poll's cadence** (§37, governance/AUTONOMY.md:698-704 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:e3eff9881722c7d4e3ec1123cbd7d94432376699d0cf04dc4626d0af8a48cc43). Not a red line.
- (A) 250 ms × 20, as now.
- (B) 1000 ms × 5, the same 5.5 s bound, as the precedent took (its OPEN-3 (B)).
- **Recommend (B).**

**OPEN-4. The bound's failure.** Not a red line.
- (A) Throw: a fatal exit 2 that names setCam.
- (B) Record a FAIL per case and continue, which means restructuring the 7 call sites.
- **Recommend (A).**

**OPEN-5. Observation.** Not a red line.
- (A) The reviewer re-observes P0 (at the base), P1 and M-TRACE in a shared hold. Mutation observations are the gate's own (Part 1, item 9).
- (B) The worker's runs only.
- **Recommend (A).**

**OPEN-6. Gates.** Not a red line.
- (A) A single reviewer under §21b.
- (B) The reviewer and the architect.
- **Recommend (A).**

The port is not an OPEN item. The human ruled it for every piece on 2026-11-09 (:13 @ 544c897194f45cecc56ed651d6c2375ec83a5e03), and the Authority line carries it.

---

## The reuse index (as given in the brief, byte for byte; the misses are noted in Authority)

```text
$ node tools/reuse.mjs e2e stale log line wait   (exit 1)
No prior art recorded for "e2e stale log line wait". Research it before planning an implementation.
$ node tools/reuse.mjs deck.gl view state pan drag test   (exit 1)
No prior art recorded for "deck.gl view state pan drag test". Research it before planning an implementation.
```

---

## Record findings for the custodian (documentation class, not this form's)

- The node summary (governance/PLAN.yaml:5535 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:e59056a41e2d12eb02e5ac174db790e6d963231f0bae743e4979d53ceb21f93e) contains two phrases the code and the records do not support: "arrives first" and "although the drag panned in full" (note 1).
- The source's Reading (state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md:124 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:0ccfd13d7d49c5d618507ecc7d08f6b2df3aa7a1faea9f612703033128e247cc) says "both directions" for s1 at ±140786. That does not hold for diag run 1.
- The form repeats neither.
- The suite's own comment at pan-anchor.mjs:100-102 @ 544c897194f45cecc56ed651d6c2375ec83a5e03 sha256:4abff0ae24533e67e25d006c813288bd42c68cafae21000c9a835e7d13120c4f says it waits "for the line itself", which it does not. The change replaces it.

## What I could not settle

- **HEAD and hashes:** HEAD is unconfirmed by shell, and I give no sha256.
- **The order of the stale line and the reset in `vs`:** this needs the instrument's definition of `tail` (note 1).
- **The 168.00 px there-and-back residual:** unexplained (OPEN-1).
- **deck's behaviour:** read in the installed 9.3.9 package, which is not tracked: `setProps` with a new `initialViewState` fires no callback, and pan end fires one tick. This is evidence, not Authority. I did not read deck's inertia default; it does not affect the zoom argument.
- **Line count and budget:** estimates.
- **P0's determinism:** it rests on the probe's 2000 ms gap exceeding the push lag. A lag above that is P0's STOP, never a pass.
- **Background shells:** I leave none; I had no shell.

## The custodian's settlement (class 1, before any code)

- **OPEN-2 (A), OPEN-3 (B), OPEN-4 (A), OPEN-5 (A) and OPEN-6 (A)**, each the draft's recommendation and none a red line, taken on 2026-11-10 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 9), for the human's review: the reproducer is the in-app wrapper probe, P0 at the base and P1 at the head, each a worktree edit reverted after its run; the wait polls once a second, five turns, inside the same bound; the bound's failure throws, a fatal exit 2 naming setCam; the reviewer re-observes P0, P1 and M-TRACE inside a shared hold, the worker's runs read as the fallback; a single reviewer under §21b.
- **OPEN-1**, a red line by the draft's reading (the scope of the node the human placed), is not taken by the custodian. The placed node's scope stands, which is (A): the s1 lag and the there-and-back residual are not in this piece, and the form claims s0 only (note 4's claim limit). The node the draft proposes for them, a diagnostic first and then a fix, is a placement, which is the human's: it is put to the human, and nothing is placed before the human's word.
- **The draft's finding, read:** the custodian's script checked at 544c8971 the 15 code lines it rests on, each holding what the draft says of it: among them setCam returning the last line once any is there (pan-anchor.mjs :103-104), the listener's push after an awaited `jsonValue` (:62), `drag`'s settle on the array's length (:114), the seam's own trace line carrying the call's zoom (WorkingCanvas.tsx :2340) and deck's view state set by `initialViewState` (:2343). One side claim is corrected here and changes no line of this form: lib.mjs :37 holds the suite's `http://localhost:5180` URL prefix; the mapping of that address to 127.0.0.1:5400 is the harness's TAURI_CONFIG overlay, as item 1 of the human's approval of 2026-10-11 describes it (`state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`), not lib.mjs's (note 4's port-5400 runs).
- **The record findings** (the draft's section for the custodian), read: the two phrases it names stand in the PLAN node's summary at 544c8971, as written when the node was placed; the summary keeps them as history, and neither this form nor the summary's new lead repeats them. The source's sentence on both directions stands in the source consult at its line 124, a record not amended. The suite's comment at pan-anchor.mjs :100-102 is replaced by the Change line's code.
- **The budget:** the node carried none; the draft's 60 minutes is set as its budget at this commit. The draft's estimate rests on four suite runs, a verify run and a debug build if the harness's exe is older than the base; it is not a measurement. The time taken is reported at the closing record.
- **The port:** the Authority line carries the human's rulings. At this commit the human has not said port 5180 is free, so the runs use the port-5400 harness; from a passing listen test after the human's word, every run begun uses 5180, and a run already begun on 5400 ends there.
- **The route:** slot 2, by the human's placement, once #306 merges (`depends_on`); a five-line form under §21c's size; the single reviewer (OPEN-6 (A)). Every suite run in one Bash call inside a shared hold, the app's stderr, the suite's output and the app's session log copied right after each run; `npm run verify` and `verify-quotes` inside a shared hold; a fresh worktree runs `npm ci` in frontends/shell and in renderer/bundle-viewer. `validate` is not used.
- **The read commit and main:** the draft was read at 544c8971; main at this form's commit is 96970544, and no file under frontends/ changed between them (checked by script); the pins keep the read commit's lines. B is main at dispatch.
- **Rule (00)** at main 96970544, `git diff --name-only origin/main...<branch>` against the Scope file, `frontends/shell/src/canvas/WorkingCanvas.tsx` (M-TRACE's, never committed), `frontends/shell/e2e/README.md` and protocol/: `cut/b1-shell-half-pr-c` (in progress): none; `cut/port-2-macos-l1-and-app-dirs` (in progress): none; `cut/b2-piece-1c-save-and-reopen` (in progress): none; `cut/publish-e2e-filtered-step-shared-run-failure` (PR #306): none; `cut/clippy-deny-warnings-workspace-12c` (in progress): none. It is checked again at dispatch.

## Amendments (opens empty; append-only)

## Amendment 1 — OPEN-1 (A), the human's ruling of 2026-11-10 (16:40Z), and the diagnostic node placed after this piece (class 5)

*Written by the custodian. References only: the human's message `state/directives/2026-11-10-o0-run-now-1c-step-1-slot-1-then-pr-b-306-clicked-pan-anchor-open-1-a-diagnostic-node-closing-message-leads-with-slots.md`, item 4.*

1. **OPEN-1 (A), the human's.** The settlement put OPEN-1 to the human as a red line, and the human answered (A). This piece's scope stands as committed: s0 only, in its one file.
2. **The node.** The node this form's draft proposed is placed by the human in slot 2, right after this piece: `pan-anchor-there-and-back-residual-diagnostic`, the diagnostic first, nothing fixed before it is read, graded on its result as item 4 says. In PLAN it depends on this piece; its form is drafted after this piece's worker.
3. **Unchanged:** this form's change, probes, mutation, runs and gate.

Nothing above is edited.

## Amendment 2 — P1 departed from its prediction at commit 1 (class 1, written after the result was seen); one instrumented observation at commit 1, and nothing fixed before it is read (class 1)

1. **P1 at commit 1** (624b2e6893a39fc967eada2cc028875d3c7d767c) exited 2 where note 4 predicted 0. Seven small-window checks passed; the eighth case's `setCam`, the seventh call, threw: `pan-anchor.mjs fatal: Error: setCam: no view-state line with zoom -6.99993 within 5500 ms of the call; 1 other lines arrived`. The worker stopped by the stop rules: nothing fixed, no retry, no push. Its report: `state/consults/2026-11-10-pan-anchor-setcam-waits-for-its-own-reset-build-worker-report.md` (sha256 2e5558bf93aa8045f0c0f45efbd2fb963c9af54d1dd62d4bfccb4e84b36af1bc). P0 at the base ran as predicted.
2. **What the run did not record:** page-side times, page errors, the listener's push times. The app's session log shows tile work from 18:10:46Z to 18:10:48Z and none after. The custodian reads that as fitting a reset that ran about 2 s after the seventh call while its line did not reach `vs`. That is a reading, not an observation.
3. **P1-D, one observation at commit 1.** It uses P1's wrapper, extended, as a worktree edit of pan-anchor.mjs that is reverted and never committed. The harness, the hold, the fixture's hashes and the copies are as note 4 gives them. Per `setCam` call, it records:
   - page side, by `Date.now()`: the wrapper's call; the timer's firing; the real seam's return, or its exception's text; each `view-state` `console.debug` emission and its zoom (console.debug wrapped, passing through); `document.visibilityState` at the call and at the firing;
   - node side, by `Date.now()`: each console event's receipt, each push into `vs` with its zoom, any `pageerror`, and any console line of type `error`.
   - The records are written as JSON to a scratch file at exit, on every path, the throw included.
   - Nothing is predicted: it is an observation, not a retry of P1. Its exit code and fatal line are recorded as they come.
4. **The route after the reading.**
   - (a) The seam ran and its line was emitted on the page, but it reached `vs` late or never: the harness's. The fix comes in this piece, under a further amendment written from the reading.
   - (b) The seam threw, its timer never fired, or it emitted no line: the product's e2e seam. It goes to the human before any fix.
   - (c) Anything else is reported as it is, and nothing is fixed.
5. **Unchanged:** Scope, the Change line, M-TRACE, R1, readiness and the claim limit. P1 stays owed at the head that the route leaves.

## Amendment 3 — P1-D's route: (B), the human's message of 2026-11-11 (05:38Z) (class 5)

- **Route (B)** (`state/directives/2026-11-11-1c-open-7-1-a-p2-now-pan-anchor-route-b-diagnostic-now-stall-record-two-runs.md`, item 2; the file's sha256 1bad1bbe9e354e98313996976b23f7599956ec879b7299f54ba5793d11ea8b6e): `pan-anchor-there-and-back-residual-diagnostic` runs now in slot 2, ahead of any fix. This piece is held on its reading and leaves the slot. Nothing is fixed before it is read.
- **After the reading** (the same item): stalls of a second or more only beside the build are the harness's, S3, fixed in this piece under a further amendment, the custodian proposing which of the item's two fixes; the item's other routes go as it gives them.
- **Unchanged:** Amendment 2 item 5.

Nothing above is edited.

## Amendment 4 — released on the diagnostic's grade (class 5); route 1's fix, the custodian's proposal of which; behind the new S1-candidate node in slot 2

*Written by the custodian. References only: `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md` (the file's sha256 1511353c54cbe39c67e37331caa4ed8e3b384f26951491e9ae7f8ce414e7ae68), item 5; `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md` (sha256 fc806d9a29a5957d708865afeeb099bf961f80d1dbb5277e3980ba17cc54b2a8), its route lines. Nothing below is a quotation.*

1. **Released** (item 5 (a)). The stalls are graded S3, the harness's, and this piece takes route 1's fix under this form.
2. **The custodian's proposal: the first of the two fixes,** that the suite waits on its own lines with no wall-clock bound that load can break. The quiet run kept 7 long stalls with the quiet condition shown, so a suite that does not start beside a build would still meet them; only the first fix removes the failure they cause. The fix's shape is drafted by amendment before code.
3. **Order.** The new node `recentre-crossing-view-displaced-by-origin-move` takes slot 2 first (item 5 (b)); this piece follows it.

Nothing above is edited.
