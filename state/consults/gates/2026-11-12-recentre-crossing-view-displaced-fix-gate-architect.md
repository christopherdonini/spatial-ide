Reviewed: PR #311 at b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a (the custodian's filing note, 2026-11-12: the gate, the architect, attempt 1, dispatched beside the reviewer under the form's Amendment 4 item 3, PLAN node recentre-crossing-view-displaced-fix, slot 2; its READINGS (2026-11-12) (a) to (d) are taken under the human's standing rule of 2026-11-12 and the form's Amendment 4 item 2, recorded with this filing, for the human's review at the click; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #311 at b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a (base 9398efc6), gate, architect
Verdict: FAIL

I have no shell. So I cannot show the brief's sha256 or the packet's, and I could not run `gh pr checks 311`, git or any test. I leave no background shell. Every pin below is written `sha256:<H>` for the custodian to fill. H below means b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a; M means main, 9b289086fe4d0e5fe8ff507ccdda0fa83e7fe758. Cites into `frontends/shell/node_modules/@deck.gl/core` (9.3.9, main's checkout) point at an untracked file. They are evidence (what deck does), not Authority.

## Findings

### Correctness
None.

### Evidence, blocking

**E-1. U1 and U2's test double does not take its types from deck.**
- Requirement: the 2026-11-05 directive, Part 1, item 7, first bullet (paraphrase: a test double imports the real interface types). The human's seam rule (round 4) also applies: the seam is written against the interface the other side actually has.
- Evidence:
  - `FakeDeck` types its props as `Record<string, any>` and hand-writes `tick(viewState: Record<string, unknown>, interactionState: { isDragging: boolean; inTransition: boolean })` (`frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx:52-87 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>`).
  - deck exports the real types: `DeckProps` (`@deck.gl/core` `dist/index.d.ts:67`), and `ViewStateChangeParameters` and `InteractionState` (`:85`). The callback's type is at `dist/lib/deck.d.ts:153`.
  - The fake's behaviour does match deck: D1 (`deck.js:323-328`), D3 (`deck.js:1044-1057`) and D5 (`view-manager.js:93-98`). Its types do not, so a change in deck's shape would not fail the test.
  - Precedent, not a defence: `WorkingCanvas.wiring.test.tsx:26-44 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>` has the same gap.
- Closure:
  - Type FakeDeck's props as `Partial<DeckProps>` or a `Pick` of it.
  - Type `tick`'s parameter as `ViewStateChangeParameters` plus `viewId`, with `interactionState: InteractionState`. All of these are imported from `@deck.gl/core`.
  - Run `tsc --noEmit` and U1/U2 at the new head. The reviewer re-observes both, failing at B and passing at the new head, under item 3 (a correction is checked as new work).

### Documentation (must fix before the merge)
All three sentences are the worker's, not the human's. The worker applies the words below with no re-gate, and the PR body lists them.

**D-1. The README entry's first sentence** (`frontends/shell/e2e/README.md:842-850 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>`).
- Problem: it says a double-click past the bound moves the frame's origin. Case 2 (i) asserts the opposite, that the double-click moves no origin.
- Replacement words:
  > `e2e/recentre-crossing.mjs` checks that a drag whose settled tick finds the target past the re-centring bound moves the frame's origin and does not move the view; that a double-click which carries the target past the bound moves no origin until its settle, and its zoom completes; and that a wheel notch after it then moves the origin without moving the view.
- Clause check:
  - "drag … moves the origin, not the view": case 1 (a), (b) and (d).
  - "double-click … no origin … zoom completes": case 2 (i) and (ii).
  - "wheel notch … moves the origin without moving the view": case 2 (iii), which also fails when there is no origin change.

**D-2. The header of `recentre-crossing.mjs`, line 8.**
- Replace "refuses an app that was already running" with "refuses an app already listening on the CDP port".
- Clause check: when the attach succeeds, `lib.mjs:254-267 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>` returns `launched: false`, and `setup()` then throws Void. A running app that is not listening on the port is not refused.

**D-3. The README entry's exit-code sentence.**
- Problem: it lists the VOID causes as if the list were complete. Other VOID causes exist (an app already on the CDP port, no `.working-canvas`, a canvas too narrow), and a fatal error exits 2 without printing VOID.
- Replacement words:
  > Exit 0 when all six asserted steps pass, 1 when one or more fails, 2 when the run is VOID — among others when the fit line never arrives, case 1 has no origin change in a leg, case 2's drag-out cannot land inside its window, or an app is already listening on the CDP port — or ends on a fatal error; a VOID run is never a PASS.
- Clause check: the exit codes are at `recentre-crossing.mjs:23`; the Void throws are in `setup` and the case bodies; the fatal error goes to the catch, which exits 2.

### Note (true but incomplete; not must-fix)
- `WorkingCanvas.tsx:2148-2151 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>` says "the recenter lands on the next tick with neither". That is true. But deck fires no tick when a transition ends (`transition.js:58-84`). So a run of double-clicks or arrow keys alone never re-centres.
- Suggested words:
  > A tick inside a transition, or one that starts one, defers too: a view state returned then is not the transition's own, so deck cancels the transition or animates from the old frame to the new (`transition-manager.js`, `processViewStateChange`, 9.3.9). deck fires no tick when a transition ends, so the recenter lands on the next tick with neither, such as a drag's end or a wheel tick; double-clicks and arrow keys alone start transitions only, and until such a tick the origin may stay past the bound (not measured).
- Clause check:
  - `transition-manager.js:47-75`.
  - `transition.js:58-84`.
  - `controller.js:241-247` (`_onTransition`), `:312-317` (pan end, `isDragging: false`), `:379-381` (wheel, `NO_TRANSITION_PROPS`), `:528-544` (double-click) and `:612` (keydown).
  - `orthographic-controller.js:316-318`.

## Checks

**1. §21a categories.**
- H changes no ADR and no security posture.
- It touches no wire or protocol: the diff is six files under `frontends/shell`.
- It adds no dependency: `package.json` gains one script line, and no lockfile changes.
- It touches no KNOWN-LIMITATIONS item and no release record. The RELEASE-0.1 amendment is the closing record's, under Amendment 3 item 6.
- Guarantee category: **yes**, and declared. The property "the view stays where it was" is under test (A5, A6, pan-anchor, the top doc comment), and §3 declares the deferral during transitions.
- Size: about 639 lines over six files, past §21c, so the piece is fully gated as dispatched. Every file is within its §7 ceiling (packet table: 60/70, 218/300, 347/450, 1/2, 12/45, 1/4), so there is no class-8 overrun.

**2. The fix against the constitution.** Code paths read:
- `WorkingCanvas.tsx:2091-2173` (the handler), `:594-599` (`pixelsPerWorldUnitAtZoom`), and its `setProps` call sites at 1358, 1424, 1453, 1658, 2259, 2268 and 2369.
- `offsetFrame.ts:84-91, 128-130, 166-173, 196-198`.
- deck's `deck.js:323-328, 831-833, 1044-1057`, `view-manager.js:93-98`, `controller.js:169-172, 226-243, 294-320, 363-393, 528-614`, `transition-manager.js:16-31, 47-106, 136-147`, `transition.js:58-84` and `orthographic-controller.js:316-318`.

Findings:
- ADR-010 rule 1 (tagged frames): met.
  - The trace (2122) and `reportViewport` (2161-2171) keep the old world pair.
  - The returned `rebased` target is renderer-local in the new frame, by `toLocal`.
  - `info.coordinate` is not read.
- Rule 3: unchanged; the f64 subtraction is still in `toLocal`.
- Rule 5: the window is closed. `render()` and the returned state both land inside one `_onViewStateChange`: D3 stores the returned value under `viewId`, and D5 makes the per-view entry win.
- No `setProps({initialViewState})` runs inside the callback, so D1's deep-equal overwrite cannot fire there.
- So the re-centre now moves the origin without moving the view.
- docs/01: the canvas is not blocked (one boolean read per tick, one spread on a re-centre). There is no silent conversion, and each re-centre is still recorded in `offsetFrame.events`.
- The guard **can stall** a re-centre.
  - `!inTransition && !startsTransition` defers every tick of a double-click, keyboard or smooth-wheel transition. No tick follows a transition's end.
  - Under double-click-only or arrow-key-only use, the origin stays past T(z) = min(131072, 2^(23-z)) until a drag end or a plain wheel tick.
  - Consequence: the precision error is drift·2^-24·2^z px. It passes 0.5 px only when drift > T(z). By my arithmetic (not a measurement), that needs zooms far past fit, close to the 131 072 m cap.
  - §3 declares the deferral as unmeasured. ADR-010 has no rule on when a re-centre must happen, so this does not block.

**3. §2 and the added comments, clause by clause.**
- The top doc comment (95-112): true. Line 100's relabel to 9.3.9 and the jump sentence at 104-109 check against D1, D3 and D5, with the fit at 1424 and the seam at 2369.
- The settled-tick note (2097-2107): true. Inertia defaults to 0 (`controller.js:169-170`), and pan end has null extraProps and `isDragging: false` (`:294-320`).
- The guard variables (2108-2113): `startsTransition` mirrors `_isTransitionEnabled` exactly.
- The deferral comment (2134-2151): true. The "harmless within RECENTER_MAX_DRIFT headroom" clause is carried text and holds for a one-gesture deferral. See the Note above.
- U1 and U2: names and doc comments (4-16) are true.
- `recentre-crossing.mjs`, header 5-29 and step comments: true except line 8 (D-2).
  - Line 29's tolerance basis restates PAN-ANCHOR §5 item 1 correctly.
  - Line 29's "thousands of px" is borne out by S6c's 10730 and 20426 buffer px.

**4. Tests at their boundaries.**
- U1 and U2 mount the real `WorkingCanvas`. Only Deck is stubbed, along D1, D3, D5 and the constructor at line 251. Inputs go through the real `pushBatch(loadBatchFixture("lv95-polygon-batch"))`. The typing is E-1.
- E1:
  - It drives the shipped measure build through `openPath` (the instrumented-build hook, `AdmissionPanel.tsx:325-344 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>`, not DEV-only) and the mouse.
  - It reads the shipped `traceViewState` lines (`renderTrace.ts:52-54`, not gated) and the images.
  - It also reads every render-trace line as a settle signal, and reads `.working-canvas`'s size from the DOM. Both are reads only, of the shipped build.
- Rule (d) as built at H (`edgeVerdict`) is Amendment 2 item 4's rule, point by point. It has one harmless addition: a failed capture reads as unreadable. `ringB` takes B from the start image (F1). (c) is printed as a REPORT line and not counted, as Amendment 3 orders.
- F3 at `recentre-crossing.mjs:18` and F2 at `:235` match the e1-image-rule draft's lines 181 and 188 byte for byte, checked by regex.
- The image analysis assumes image px equal CSS px. That held in these runs (668x712, buffer 668x712).

**5. The README entry (842-850).**
- Sentence 1: D-1. The exit-code sentence: D-3.
- Every other clause checks against the script.
- "What it proves not" is true. It does not mention keyboard or pinch input, and it does not claim to be complete.

**6. Row A7a.**
- The step sits as the 13:07Z directive's line 19 gives it, with N=5. That comes from S6e: k=3, N=5 at notch 8, zoom −8.077, box 48 of 668.
- The expected outcome sits as the italic words under OPEN-4 (A) in the form-architect draft.
- Both sit as Amendment 3 item 7 gives them. One item goes to the human (below).

**7. §11, item by item.**
- Items 1-12: all met.
  - Item 4: no `setProps(initialViewState)` inside the callback; only the comment at 2136 names it.
  - Item 8: (c) and (d) changed only under the human's OPEN-A (C), and the tolerance stays 4.0.
  - Item 10: branch lines are named by commit and not pinned; mutations are recorded "by hand", never as a `verify-mutation` observation.
  - Item 11: S3's run ended 06:36Z, before the S4 worker started at 07:03Z, by the reports' run stamps.
- Records relied on: the S3b, S4-S7 and S6b-S7 worker reports. The reviewer observes the runs.

**8. Readings of the edge check's inputs** (Amendment 4 item 2; the human's standing rule of 2026-11-12). These readings do not change what the check is for.

READING (2026-11-12) (a): the fixture's own extent is the union of the covering `bbox` column: min xmin, min ymin, max xmax, max ymax. The writer builds each row's bbox from its ring vertices (`engine/src/fixture.rs:1206-1232, 1306-1309, 1323-1334 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>`; the covering bbox defaults on, `:689`). So it equals the vertex extent, which is the tight extent of what is drawn, read without decoding geometry. Not `grid_bounds` (`:955-962`), which is looser.

READING (2026-11-12) (b): use the largest parcel's half-extent bound, r_max = 0.42 × cell 40 m = 16.8 m.
- Sources: `fixture.rs:93, 1419`, with jitter at most 1.0 at `:1683-1695 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>`.
- It is a world-unit bound that holds for every parcel.
- Convert by ×2^zoom_end to CSS px (`WorkingCanvas.tsx:594-599`; the same 2^zoom per metre as `viewportBbox.ts:38`), then ×bw/cw to buffer px.
- At zoom −3.6925 that is about 1.30 buffer px.

READING (2026-11-12) (c): use `outlineWidth` from the active style, halved, because `PathLayer` centres the line on the ring (`buildLayers.ts:501-512 @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>`, `widthUnits: "pixels"`). Convert by bw/cw. On a fresh launch the width is `DEFAULT_STYLE_STATE.outlineWidth` = 0 (`document.ts:79`), and no outline layer is built, so the term is 0 at H.

READING (2026-11-12) (d): check each edge in K against the end image's box edge on the same side, left with left and bottom with bottom. K names sides, and a nearer-edge match could let a displaced edge pass.

The resulting tolerance is 4.0 + 1.30 + 0, about 5.30 buffer px. My arithmetic, for the reviewer's cross-check only and not a measurement: with y up (`flipY: false`), the left edge projects near x≈66 and the bottom near y≈357, against end-box left 66 and bottom 357. At that view the fixture reaches the canvas's top and right edges.

**9. Main made untrue by H.**
- ADR-010 and `docs/`: unchanged in meaning.
- A5 and A6 read truer.
- The pan-anchor form's pins become historical pins (§8). Read against the tree, the tree is authoritative.
- KNOWN-LIMITATIONS item 17: for the human, below.

## For the human
- **H-1, KNOWN-LIMITATIONS item 17** (`KNOWN-LIMITATIONS.md:230-246 @ 9b289086fe4d0e5fe8ff507ccdda0fa83e7fe758 sha256:<H>`).
  - Its "at most half a pixel at any zoom and origin" now holds only once a re-centre has landed. After double-click-only or arrow-key-only transitions, drift can stay above T(z). By my arithmetic a visible size needs zooms far past ordinary use.
  - The form chose OPEN-6 (A), no item, and §3 discloses the deferral.
  - The item's own comment marks its wording as DRAFT, not the human's. But an edit is outside §7, so it would be class 9 and a placement for you. It does not block this merge.
- **H-2, A7a's expected outcome** (`frontends/shell/MANUAL-WALKTHROUGH.md`, row A7a @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a sha256:<H>).
  - Its return leg is asserted by E1 only at z_fit −3.69. S6e, at A7a's zoom of about −8.08, ran the left leg only (k=3).
  - The mechanism does not depend on zoom, by reading. Your wording, so no replacement words.

## Evidence notes
- Part 1 item 4: the records show the full vitest suite (1458) at 3df3e57c, not `npm run verify` at H. H changed only `.mjs` and `.md` files after that commit. The reviewer's run at H supplies the check.

## Packet gaps
- Commit and filing times proving §11 item 11's order; I used the reports' run stamps instead.
- The PR's CI: without a shell I could not run `gh pr checks 311`.
- Whether `npm run verify` ran at H.
- The device pixel ratio behind E1's image-px = CSS-px assumption (inferred from 668x712 = buffer 668x712).
