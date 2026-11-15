*Custodian's filing note (2026-11-10): the architect's five-line form draft for slot 2's `pan-anchor-setcam-waits-for-its-own-reset`, read only at main 544c8971, from the `## pan-anchor` section of `state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md`. Its brief was given by file (8799 bytes, sha256 35c4f8758c30a427d4aa8cba09d0a7565a460a753c8863e03edc820d4e1efa60), with the in-flight paths by git and the reuse index's output byte for byte. Dispatched at 2026-11-10T02:31:47.589Z by its transcript; the run went to 2026-11-10T02:43:09.012Z (claude-opus-5-5; unique calls: Read 28, Grep 23, Glob 2, the hand-back, 54 in all; no errored call). The report below was extracted by script from the hand-back in that transcript (28694 bytes, sha256 de3edf149d47afe332fc1116aa6fd4895738fe2ac9c4fb1c5bba08e91841bbb9) and is unchanged. The custodian checked by script: its 11 quoted spans of over forty characters in note 1 and its fenced run-2 block, each in the source consult; its reuse block, byte-equal to the brief's. Its line cites are at 544c8971 as it states; the custodian did not re-read the code lines its reading rests on, which the form's gate reads. Its OPEN-1 is marked a red line by its reading; its recommendation (A) keeps the placed node's scope, and a node for the s1 lag and the there-and-back residual is the human's to place.*

---

Draft: pan-anchor-setcam-waits-for-its-own-reset, five-line form, architect

Read at: main @ 544c897194f45cecc56ed651d6c2375ec83a5e03. I have no shell, so I could not confirm HEAD myself. The session's start snapshot showed main at 544c8971, with untracked files only and none of them on a path I read. I give no sha256 anywhere in this report, because I have no shell. Below, C stands for 544c897194f45cecc56ed651d6c2375ec83a5e03, so a cite written `path:line @ C` is `path:line @ 544c897194f45cecc56ed651d6c2375ec83a5e03`. The custodian's script expands each cite to its full form. Every passage marked byte-copied was copied from the Read tool's output, not by script, and the custodian's script re-checks it. Everything else is my own words.

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

Path: `governance/forms/frontends/PAN-ANCHOR-SETCAM-WAITS-FOR-ITS-OWN-RESET-PREREGISTRATION.md`. Neither the template (docs/PREREGISTRATION-TEMPLATE.md:146-161 @ C) nor the forms index (governance/README.md:19 @ C, one folder per former top-level folder) names a file. The suite lives under frontends/, and the precedent sits in governance/forms/frontends/, so this form goes there too. `PAN-ANCHOR-PREREGISTRATION.md` is a different piece's form and its path is not reused.

```
Authority: PLAN node `pan-anchor-setcam-waits-for-its-own-reset` (governance/PLAN.yaml:5520-5536 @ C), generation 1; the human's placement, slot 2, after publish-e2e-filtered-step-shared-run-failure, a five-line form (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:11 @ C); its source, the `## pan-anchor` section of state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md (:83-124 @ C), evidence, not Authority; the human's gate-round rulings, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ C); e2e runs on the port-5400 harness under the approval of 2026-10-11, item 1 (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ C), until the human says port 5180 is free and a listen test on it passes, then on 5180, by the human's ruling of 2026-11-09 on every piece's e2e (state/directives/2026-11-09-304-open-b-a-widened-303-clicked-pef-open-2-a-open-5-listen-test-then-5180.md:13 @ C); non-red-line OPEN items under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ C), held to 2026-11-16 (the placement directive, :9 @ C); the reuse index found no prior art on either search (e2e stale log line wait; deck.gl view state pan drag test), a miss noted here.
Scope: 1 file: frontends/shell/e2e/pan-anchor.mjs; declared line budget 40, insertions plus deletions, comments counted (governance/AUTONOMY.md:357 @ C); this form exempt; frontends/shell/src/canvas/WorkingCanvas.tsx (M-TRACE) and a probe wrapper in pan-anchor.mjs (P0, P1) are edited and reverted for observations and never committed; renderTrace.ts, e2e-test-surface.ts, e2e/lib.mjs, e2e/README.md (no pan-anchor entry), MANUAL-WALKTHROUGH.md, KNOWN-LIMITATIONS.md and every other e2e suite are read, not changed; no other file changes.
Change: `setCam` returns the first view-state line logged since its clear whose `zoom` equals the jittered zoom it passed to `window.__SPATIAL_E2E__.e2eSetViewState` (the reset's own line, frontends/shell/src/canvas/WorkingCanvas.tsx:2340 @ C), after the existing 500 ms minimum, under a hard bound whose failure throws an error naming setCam, that zoom and the bound — never the last line merely because one has arrived; `drag`, `instrumentA`, every case, the tolerance and every other helper are unchanged.
Tests+mutation: every pan-anchor check, each reaching `setCam` (the changed helper; no assertion changed); M-TRACE: WorkingCanvas.tsx:2340's `traceViewState(0, 0, zoom, frame.originX, frame.originY)` given `zoom + 1e-6`, predicted exit 2, `pan-anchor.mjs fatal:` with setCam's bound message at the first call (small, normal-A dx=300), after `PASS  small: pixel-spaces-coincide`; reproducer, before any code: P0 at the base, a page-side wrapper over `e2eSetViewState` (worktree edit of pan-anchor.mjs, reverted) that logs a stale `[render-trace] view-state` line (targetX 1e7, zoom the call's minus 0.25, origin the call's target) at once and runs the real seam 2000 ms later, predicted exit 1 with both `pixel-spaces-coincide` checks PASS and the other 14 FAIL by name — P0 exiting 0, or any of the 14 passing, is a STOP; P1 at the head, the same wrapper, predicted exit 0, `==== 16/16 PASS ====`; R1 unmutated at the head, exit 0, `==== 16/16 PASS ====`; M-TRACE's failure recorded by name in a `RECORDED MUTATION` entry of the file's header with the 40-hex commit it was observed at, then reverted and the worktree shown clean; a verify-mutation run is not an observation; mutation observations are the gate's own (Part 1, item 9); a run departing from its prediction is a stop, and no retry is added; every run on Windows inside `hold shared -Project SpatialIDE`, the port named by the harness, the fixture's sha256 recorded before and after, the app's stderr, the suite's output and the session log copied right after each run; `--measure` never passed; the e2e does not run on CI.
Out-of-scope: ADR: none (ADR-010 rule 1 unchanged: the suite reads only the shell's own trace line, never deck's `info.coordinate`); security: none (the DEV-only seam and `registerE2eHook`'s instrumented-build gate unchanged; no exposure surface, no dependency); wire: none (nothing under protocol/; the trace line is a console line, not SKP or MCP); guarantee: none (every check asserts the same residuals against the same 4.0 px tolerance, frontends/shell/e2e/pan-anchor.mjs:45 @ C; the wait is a precondition on which line is read as s0, not a property); no string the app shows is added or changed.
```

Budget: **60 minutes.** It rests on two things:
- The precedent's 45 minutes fitted its code and not its runs (its form, note 3).
- This piece needs four suite runs (P0, P1, R1, M-TRACE), `npm run verify` in a hold, and a debug exe only if the harness's exe is older than the shell's src-tauri at B.

The pan-anchor suite runs longer than publish's 17 to 23 seconds (the gate report's run windows), because of its sleeps and fills. My estimate is a few minutes per run; it is not a measurement.

---

## Notes (mine)

**1. The failure as recorded (settle 1).**

These are the source's byte-copied lines.
- The heads, from state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md:3 @ C (a sub-line span): `the detached checkout C:/dev/wt/mm2b-e2e at the branch head e1f92a974aa9ce77150be0b057160cec755bb910 (main f8bc2951 for the three comparison runs)`
- Run 2, from :88-92 @ C:
```
--- window small: client 328x552, buffer 328x552, DPR 1 ---
--- window large: client 788x812, buffer 788x812, DPR 1 ---
FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
==== 15/16 PASS ====
FAILED: large: recenter-crossing-A dx=-1200
```
- :99 @ C: `run 2: FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4) | ==== 15/16 PASS ====`
- :102 @ C, a sub-line span: `with the large window 1400 by 876 in place of 1400 by 900 (DIAG-PAN-876), so the canvas is 812 tall under the old bar`. The file's own window sizes are 820 by 640 and 1400 by 900 (frontends/shell/e2e/pan-anchor.mjs:285, :287 @ C).
- What DIAG-PAN-DRAG logs, :110 @ C, a sub-line span: `(logging, for each recenter-crossing drag, the element under the pointer, the start and end, the view-state count, s0, s1 and the first lines after the call)`
- Diag run 1, :113 @ C, a sub-line span: `diag run 1 rc=1 ==== 14/16 PASS ==== FAIL  large: there-and-back-net  ::  net residual 168.00 buffer px (tol 4) FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 800.01 buffer px (tol 4)`
  - Its dx=1200 `s1`, :114, a sub-line span: `"s1":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320}`
  - Its dx=-1200 record, :115, a sub-line span: `"vsBefore":2,"vsAfter":12,"s0":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":102390.06352414814,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}`
- Diag run 2, :116, a sub-line span: `diag run 2 rc=1 ==== 14/16 PASS ==== FAIL  small: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4) FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)`
  - Its dx=-1200 record, :118, a sub-line span: `"vsBefore":2,"vsAfter":14,"s0":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":140786.33734570362,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}`
- Diag run 3, :119, a sub-line span: `diag run 3 rc=1 ==== 15/16 PASS ==== FAIL  small: recenter-crossing-A dx=1200  ::  grab-point residual 800.00 buffer px (tol 4)`
  - Its large dx=-1200 case, which passed, :121, a sub-line span: `"vsBefore":1,"vsAfter":14,"s0":{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}`
- The source gives no PAN-DIAG lines for the small window.

**What the code at main shows.**

- **The listener.** It pushes `await a[2].jsonValue()`, so each push lands one CDP round trip after the console event (pan-anchor.mjs:60-63 @ C).
- **`setCam`** (pan-anchor.mjs:92-105 @ C):
  - it clears the log (`vs.length = 0`, :97);
  - it calls the seam with `z + jit * 1e-5` (:98);
  - it sleeps 500 ms (:99), then polls while `vs.length === 0` (:103);
  - it returns `vs[vs.length - 1]` (:104).
  - The comment at :100-102 says "Wait for the line itself", but the loop waits for *any* line. That sentence is untrue as the code stands, and the change replaces it.
- **`drag`** ends on `waitForSettle(() => vs, { quietMs: 600, timeoutMs: 9000 })` plus 180 ms (:114-115). `waitForSettle` measures quiet on the array's length, so it measures pushes, not emissions (frontends/shell/e2e/lib.mjs:348-369 @ C). A backlog in the push pipeline longer than about 780 ms therefore lets `drag` return before its own gesture's last lines are pushed.
- **The seam** (WorkingCanvas.tsx:2324-2349 @ C) does three things in order:
  - it calls `frame.forceRecenter(targetX, targetY)` (:2338);
  - it logs exactly one line, synchronously, before it returns: `traceViewState(0, 0, zoom, frame.originX, frame.originY)` (:2340);
  - it calls `deck.setProps({ initialViewState: … })` (:2343).
  - `setProps` with a new `initialViewState` overwrites deck's view state without calling `onViewStateChange`. I read that in the installed @deck.gl/core 9.3.9, `dist/lib/deck.js`, the `setProps` branch; that is evidence, not Authority, and the file is not tracked. MANUAL-WALKTHROUGH.md:1010 @ C states the same.
- **The always-on line.** `traceViewState` is `console.debug("[render-trace]", "view-state", { targetX, targetY, zoom, originX, originY })` (frontends/shell/src/diagnostics/renderTrace.ts:52-54 @ C). It has exactly three call sites: the fit (WorkingCanvas.tsx:1410), the controller callback (:2101) and the seam (:2340), each @ C. :1292-1295 @ C names the same three camera-change sites.
- **The gesture end.**
  - deck fires one `isDragging: false` tick at pan end (WorkingCanvas.tsx:2083-2091 @ C; in the installed controller, `_onPanMoveEnd` → `updateViewport`, and a new controller state counts as changed).
  - :2101 logs that tick with the pan's final target and the frame origin from *before* any recenter.
  - The deferred recenter at :2127-2134 then calls `setProps({ initialViewState })` and logs nothing.
  - So "its gesture-end recenter" emits no line. The late line is the pan-end tick's own line, and its fields equal the drag's last pan line.
- **The records against that.**
  - In both failing large dx=-1200 records, s0 is byte-equal to the previous drag's s1, including its origin 2606340, the pre-recenter origin, and the previous call's zoom -6.99987.
  - jit is global: the large size's dx=+1200 case is the 13th call (-7 + 13e-5) and dx=-1200 the 14th (-6.99986) (my arithmetic, from :96 and the call order at :226, :238, :258, :271 @ C).
  - The "first line after the call" is the reset: targetX 0 and the call's own zoom.
- **Verdict on the custodian's reading** (mine).
  - **Holds in substance.** A line from the previous gesture lands in `vs` after the clear, and `setCam` returns it.
  - **Holds in part on the source.** It is the pan-end tick's line (or the identical last pan line), not a line of the recenter, which logs none.
  - **"arrives first and is taken as the reset" (the node summary) is not what the code does.** `setCam` returns the *last* line it holds. A stale line is returned only when it is last at the return: either the reset's push had not landed after at least 500 ms (the lag :100-102 already records on a loaded machine), or it landed before the stale one.
  - `vsBefore: 2` in every failing record against `1` in the passing one fits either ordering. Without the instrument's definition of `tail` I cannot tell which. My reading, unverified: the first, because one CDP session answers in order.
- **Other mechanisms the code shows.**
  - **(a) The same lag on `s1`.** `s1 = last(vs)` after `drag` (:228, :242, :261, :273 @ C) can precede its gesture's last lines.
    - Diag run 1's dx=-1200 `s1` is 102390.06, 8 of 11 steps of 12798.76. Run 2's is 140786.34, all 11 steps, and run 1 has `vsAfter` 12 where run 2 has 14.
    - (102390.06 + 140787.31) × 2^-6.99986 - 1100 ≈ 800.0, the recorded 800.01. With a correct s0 of 0 the same case would read ≈ -300.0 and still fail (my arithmetic).
    - So the source's Reading, at :124 @ C, a sub-line span (`The drag itself pans the full distance (s1 at ±140786 in world units, both directions).`), does not hold for diag run 1. The node summary's "although the drag panned in full" does not hold there either.
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

Function touched: `setCam` (pan-anchor.mjs:93-105 @ C), its comment, and the file header's `RECORDED MUTATION` entry. Nothing else.
- Compute `const zoom = z + jit * 1e-5` once and pass it to the seam, replacing the inline expression at :98.
- Keep the clear (:97) and the 500 ms minimum (:99).
- Poll until `vs.find((l) => l.zoom === zoom)` is defined. Return that line, not `vs[vs.length - 1]`.
- If no line matches within the bound, throw an Error. It must name setCam, the call's zoom, the bound, and how many other lines arrived. It reaches `main().catch` and exits 2 (:301 @ C).

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
- §21a (governance/AUTONOMY.md:315-332 @ C): no category is touched.
  - On "any property currently under test" (:325-327): every check's residual formula and the 4.0 px tolerance are unchanged.
  - The change selects as s0 the line the instrument already defines s0 to be, the post-reset state, and its failure becomes a named error instead of a stale read or `undefined.targetX`.
  - The reviewer checks this reading first.
- §25 (e) (:482 @ C): the Out-of-scope line asserts that none of the four categories is touched, so the five-line form is open.
- §21c (:347-357 @ C): all four bounds hold. One file of 8, well under 150 lines, no exposure surface, no dependency, no user-visible behaviour.
- §21b (:334-345 @ C): the single reviewer gate is open (OPEN-6).
- §36 (:687-696 @ C) does not apply: this is a slot 2 piece, not a filler.
- This is the smallest true reading. Scope is not trimmed: the s1 lag is out of scope because the node does not name it (OPEN-1), not to make the piece fit.

**4. The evidence (settle 4).**

Shared conditions for every run:
- In one Bash call inside `hold shared -Project SpatialIDE`, from frontends/shell, through the harness's run-suite step with a hard `timeout`.
- The command is `node e2e/pan-anchor.mjs` (pan-anchor.mjs:9 @ C; there is no npm script for it). `--measure` is never passed: with it the suite exits 0 on failures (:294).
- **Until the human's word and a passing listen test on 5180:** the port-5400 harness.
  - a debug exe with the TAURI_CONFIG overlay, CDP on 9223 (lib.mjs:33 @ C), localhost:5180 mapped to 127.0.0.1:5400 (lib.mjs:37 @ C);
  - Vite on 5400 with `--strictPort`;
  - the npx shim on PATH for those runs only;
  - `attachOrLaunch` attaches (lib.mjs:158-166 @ C), and Vite, relaunched for each run, serves the worktree's sources, so M-TRACE needs no rebuild.
- **After a passing listen test:** the same command with no overlay. `attachOrLaunch` spawns `npx tauri dev` itself (lib.mjs:192-200 @ C), which builds, so the run stays inside the hold.
- Before and after each run: the fixture's sha256 (pan-anchor.mjs:47 @ C, read from the main checkout's target folder).
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
- Rule (00) (governance/AUTONOMY.md:606-610 @ C), against the brief's lists:
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
- Seam rule: the consumer side read is the real `e2eSetViewState` (frontends/shell/src/e2e-test-surface.ts:305 @ C; WorkingCanvas.tsx:2324-2351 @ C) and the real trace shape (renderTrace.ts:53 @ C). R1 is the end-to-end proof from that shape. No `pub` item, callback or option is added.

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

**OPEN-3. The poll's cadence** (§37, governance/AUTONOMY.md:698-704 @ C). Not a red line.
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

The port is not an OPEN item. The human ruled it for every piece on 2026-11-09 (:13 @ C), and the Authority line carries it.

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

- The node summary (governance/PLAN.yaml:5535 @ C) contains two phrases the code and the records do not support: "arrives first" and "although the drag panned in full" (note 1).
- The source's Reading (state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md:124 @ C) says "both directions" for s1 at ±140786. That does not hold for diag run 1.
- The form repeats neither.
- The suite's own comment at pan-anchor.mjs:100-102 @ C says it waits "for the line itself", which it does not. The change replaces it.

## What I could not settle

- **HEAD and hashes:** HEAD is unconfirmed by shell, and I give no sha256.
- **The order of the stale line and the reset in `vs`:** this needs the instrument's definition of `tail` (note 1).
- **The 168.00 px there-and-back residual:** unexplained (OPEN-1).
- **deck's behaviour:** read in the installed 9.3.9 package, which is not tracked: `setProps` with a new `initialViewState` fires no callback, and pan end fires one tick. This is evidence, not Authority. I did not read deck's inertia default; it does not affect the zoom argument.
- **Line count and budget:** estimates.
- **P0's determinism:** it rests on the probe's 2000 ms gap exceeding the push lag. A lag above that is P0's STOP, never a pass.
- **Background shells:** I leave none; I had no shell.
