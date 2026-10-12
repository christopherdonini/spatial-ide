*Custodian's filing note (2026-10-12): the architect's check before building for PR #217's correction round 3, asked by the human's OPEN-15 (B) ruling (state/directives/2026-10-12-round-72-217-third-round-open-13-to-open-15.md) and Amendment 14 item 5; branch cut/shell-migration-milestone-2-phase-b at f64418bcc7eee2d0f418bd59f8c00c9554f2c04b; the run 2026-10-12T17:18:20Z to 2026-10-12T17:27:30Z by its transcript (Read 40, Grep 26, Glob 4; zero writes); its one SubagentHandback call, at 17:27:28Z. It arrived as a message and is extracted here by script. 8 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is b6f7408a6cf6b2ba67df3d6363c13b17c2a7721f6547f5f03f3e7489a7242c50; this file's, from line 5 to the end, is 600f184d78018555079da40c1add01a0180899e35c7f37a84416077c648a8d20. Q1's finding against the wording and its (d) choice go to the human before item (c) is built; Q2 holds, and items (a), (b) and (d) proceed.*

---

# PR #217 round 3 — the architect's check before building
Read: cut/shell-migration-milestone-2-phase-b @ f64418bcc7eee2d0f418bd59f8c00c9554f2c04b

**Verdict.**
- **Q1 (OPEN-15 (B)):** there is one finding against the reading, and it goes to the human before building. Truncating first and then subtracting the rect is the right order. But the words "less the canvas rect" leave out mjolnir's scale term, so the tap's pixel does not equal the hover's when the canvas's CSS size is fractional, and ordinary use reaches that. Replacement words are below.
  - (b) holds.
  - (c) holds, with one qualification at 150%.
  - (d) is enough for the pixel function and for WebView2 at the run's device pixel ratio, with two additions. It is not enough for a scaled display: the human either narrows the claim or adds a run.
- **Q2 (OPEN-14):** the reading holds. The answer is **yes**: filtering by `event.type` makes a double-click only zoom and adds no delay. The field is `type`, not `tapCount`.
- **Budget (Amendment 14 item 6):** everything fits. Notes are at the end.

Installed versions: `@deck.gl/core` 9.3.9, `mjolnir.js` 3.0.1, `@luma.gl/core` 9.3.6 (each package's own package.json).

## Q1. OPEN-15 (B)

### (a) How each pixel is computed today

**The hover's pixel.**
- **Event:** a native `mousemove` MouseEvent. mjolnir's MoveInput builds `center` from `event.clientX` and `clientY` as delivered (mjolnir.js 3.0.1 `dist/inputs/move-input.js:97-107, 116-126`).
- **Offset:** the EventRegistrar's normalizer adds `offsetCenter = (center − rect.left − root.clientLeft) / scaleX`, the same for y. Here `scaleX = rect.width / root.offsetWidth || 1` (`dist/utils/event-utils.js:59-68`; `dist/utils/event-registrar.js:130-136`).
- **Root element:** the canvas. deck.js:928 falls back to `this.canvas`, and the product passes no `parent` (`line 2006-2012 of frontends/shell/src/canvas/WorkingCanvas.tsx (at f64418bc) @ f64418bc`).
- **Pick:** deck stores `offsetCenter` as the pick request (@deck.gl/core 9.3.9 `dist/lib/deck.js:146-172`) and picks it on the next frame (`deck.js:856-883`).
- **Where it truncates:** nowhere in app, deck or mjolnir code. The whole number comes from the engine's MouseEvent `clientX`. The repo cannot show this. WebView2's own failing run is consistent with it: the hover named id 0 at 331.5, and both clicks missed, the tap at 331.5 (rounded by Hammer to 332) and the retry at an integer 332. luma rounds CSS to device pixels (`@luma.gl/core 9.3.6 dist/adapter/canvas-surface.js:412-418`), so a fractional hover coordinate of 65.5 would have rounded onto the missed pixel.
- **Order:** truncate first (the engine), then subtract the rect (mjolnir). The app does no arithmetic on it; WorkingCanvas's `onHover` only reads `info.x` and `info.y` (`WorkingCanvas.tsx:2114-2146 @ f64418bc`).

**The tap's pixel.**
- `center = Math.round(pointerup.clientX)` and the same for y (mjolnir.js `dist/hammerjs/input/get-center.js:7-11`, called from `compute-input-data.js:32`).
- `offsetCenter` is then built by the same formula as the hover's (`event-utils.js:65-68`).
- The product reads `tap.offsetCenter` as it is (`line 58-63 of frontends/shell/src/canvas/clickPick.ts (at f64418bc) @ f64418bc`). So the tap rounds first and then subtracts.

**Does the human's rule reproduce the hover's pixel exactly?**
- **Order matters.** With a fractional `rect.left`, truncating first is the only order that matches the hover. Example: clientX 331.9 and left 266.6 give 64.4 on the hover; subtracting first and then truncating gives 65.
- **Fractional canvas rect, whole canvas size:** yes, provided the truncation comes first. The CSS pair is then identical, and deck turns identical CSS pairs into the same device pixel (`dist/lib/deck-picker.js:145-149`).
- **Fractional canvas size: no.** This is the finding against.
  - `offsetWidth` is an integer layout size, while `getBoundingClientRect().width` is fractional. So mjolnir's `scaleX` is not 1, and the hover's offset is divided by it (`event-utils.js:62-63`).
  - The rule as worded omits that division. The two pixels then differ by up to under a CSS pixel, zero at the canvas's near edge and growing across it. With luma's rounding, that can be one device pixel, on either axis whose size is fractional.
  - Ordinary use reaches this. The shell's own measured layout values are fractional (`line 668-676 of frontends/shell/src/styles.css (at f64418bc) @ f64418bc`, a `.canvas-container` top of 578.2px), and a window at 125% or 150% often has a fractional CSS size.
  - The canvas has no border today (`styles.css:509-513 @ f64418bc`), so mjolnir's `clientLeft` and `clientTop` terms are 0. They are still part of the formula the hover goes through.

**Replacement words** for the first OPEN-15 bullet. This is the human's wording, so the human answers yes, gives their own words, or accepts it as it stands.

> The tap's pixel is computed from the tap event's own client coordinates, truncated as the hover's are, then made relative to the canvas by the same steps deck's event layer takes for the hover: less the canvas rect and the canvas's border, divided by the canvas's drawn size over its layout size. No hover state and no pointer-down info is read, so section 8 item 3 stands. Section 2.2's rule that the tap takes event.offsetCenter is amended to this.

Clause check:
1. The tap event's own client coordinates are `srcEvent.clientX` and `clientY` (see (b)).
2. "Truncated as the hover's are" is the engine's MouseEvent behaviour, evidenced above. The truncation comes before the subtraction.
3. "The same steps" are `event-utils.js:59-68`: the rect at line 59, the scale at lines 62-63, the border at lines 66-67. For the same values in the same order the result is bit-identical. In jsdom, `0/0 || 1` gives 1.
4. "No hover state, no pointer-down info": the function reads only `srcEvent` and the canvas element. deck's pointer-down info is `_lastPointerDownInfo` (`deck.js:201-243`), which is not read.

Not covered: a layout change between the hover and the tap. The tap picks against the layout at the tap, which is correct.

### (b) Which native event the tap's coordinates come from
- For a tap, mjolnir's `srcEvent` is the native **PointerEvent of type `pointerup`**, listened for on the window (`dist/hammerjs/inputs/pointerevent.js:6, 11, 51-57`).
- The Tap recognizer keeps that end input (`dist/hammerjs/recognizers/tap.js:64`) and emits it when its timer fires (`tap.js:74-76`).
- The registrar spreads it with `srcEvent` intact and sets `type` (`event-registrar.js:108-113, 130-136`). For a `dblclick`, it is the second `pointerup`.
- This is the tap event's own event, not deck's pointer-down pick, so §8 item 3 stands.
- The coordinates are those of the up edge, even though the event is emitted about 300 ms later, as today.

### (c) The human's reason against (C)
- **"Both axes at once": holds.** At .5 coordinates the shift is +1 px on each axis (investigation items 1 and 3: hover (65, 493), tap (66, 494)).
- **"A 1 px radius does not cover it": holds at 100% and 125%.**
  - `deviceRadius = Math.round(radius × ratio)` (`deck-picker.js:150`) is 1 at both ratios.
  - The closest-pixel search accepts `d² ≤ r²` (`dist/lib/picking/query-object.js:18, 34-35`), so a (1, 1) diagonal, with d² = 2, is outside it.
  - Qualification: at 150% the radius is 2 device px. That covers a (1, 1) device diagonal but not (2, 1) or (2, 2). The conclusion stands.
- **"No radius helps in the neighbouring polygon": holds.** The centre pixel has d² = 0 and always wins (`query-object.js:34-37`). (C) as offered was also points-only (Amendment 10 item 4(b)), so polygons kept the mismatch.
  - This part is geometry, not a measurement. No run observed the neighbouring-polygon case.

### (d) The proof
- **Where the position comes from:** the record gives point (331.5, 533.5), canvas rect left 266 and top 40, hover pixel (65, 493), tap pixel (66, 494), in the investigation's item 3.
  - The record does not name which run's log that is, and the logs are not committed.
  - The run-2 record shows E-KINDS failing in each selection run up to 2f18ad39, and passing from a6607738, step fix 3's rounding.
  - The .5 offsets are consistent with device pixel ratio 1 (`line 408-414 of frontends/shell/e2e/lib.mjs (at f64418bc) @ f64418bc`). The record does not state the ratio.
- **The unit test with a rounding mutation proves the formula.** It should also carry:
  1. the recorded case, (331.5, 533.5) with rect (266, 40) giving (65, 493), where rounding gives (66, 494);
  2. a fractional-left case where the order matters, with a mutation that subtracts first and then truncates;
  3. if the words above are adopted, a fractional-size case with a mutation that drops the scale.

  All of this fits clickPick.test.ts's +60.
- **The E-KINDS point step at the fractional position is the WebView2 proof.** The 2f18ad39 failure is already the observed failure of the rounding rule there. Two additions are needed before the step's pass counts:
  1. For the point step only, the step uses the unrounded `exact` (`line 246-247 of frontends/shell/e2e/selection.mjs (at f64418bc) @ f64418bc`), and fails unless `hits[0].css` is non-integer on both axes. It prints the position. Otherwise a pass can be vacuous.
  2. The run's record names the WebView2 runtime version and the device pixel ratio. WebView2 updates itself, and the claim belongs to the version that ran (round 15 (c) by analogy).
- **Is that enough for the WebView2 claim?**
  - The pick itself does not depend on the device pixel ratio once the CSS pairs are equal (`deck-picker.js:145-149`).
  - Whether WebView2 truncates MouseEvent coordinates at 125% and 150% is engine behaviour. A run at ratio 1 does not show it.
  - So the human either narrows the claim to the ratio that ran, with scaled displays named for the walkthrough's real-mouse part, or adds a run at a forced scale factor.
  - **This choice goes to the human.**

## Q2. OPEN-14: yes, a double-click can be told apart at the click

**How each reaches `onClick` today**
- Both `click` and `dblclick` map to `onClick` (`@deck.gl/core 9.3.9 dist/lib/constants.js:73-75`).
- The recognizers are a `dblclick` Tap with `taps: 2`, and a `click` Tap that requires `dblclick` to fail (`constants.js:84-85`; the wiring is `mjolnir.js dist/event-manager.js:68-77`).
- deck registers `_onEvent` for each (`deck.js:948-950`) and dispatches to `props.onClick(info, event)` (`deck.js:174-199, 599-617`).
- The product forwards every event to `onTap` without a type check (`WorkingCanvas.tsx:2023 @ f64418bc`; `clickPick.ts:52-64 @ f64418bc`).

**A single tap already waits for a double tap to fail.**
- The click recognizer has a failure requirement, so a recognized tap starts a 300 ms timer and returns Began (`tap.js:22, 68-78`).
- It emits only if `dblclick` has failed by then (`dist/hammerjs/recognizer/recognizer.js:194-215`).
- The 300 ms delay exists today.

**A double-click delivers one `dblclick` and no `click`.**
- The second press runs the click recognizer's `process`, whose `reset()` clears the first click's pending timer (`tap.js:44, 89-91`; the session is new at `dist/hammerjs/input/input-handler.js:13-15`).
- On the second release, `dblclick` reaches count 2 and becomes the session's current recognizer. `click` is then not run (`manager.js:115-130`).
- After 300 ms, `dblclick` emits with `tapCount` 2 (`tap.js:74-76, 92-96`).
- The controller zooms on the same event (`dist/controllers/controller.js:100-101, 528`).

**The field that tells them apart is `event.type`.** The registrar sets it to the registered name, `click` or `dblclick` (`event-registrar.js:108-113`). `tapCount` must not be used: the click recognizer also counts taps made close together (`tap.js:54-63, 94`). For example, a third press inside the interval cancels the pending `dblclick` (`tap.js:44`), and the following `click` can carry `tapCount` 2.

**Answer:** a filter that returns on `event.type === "dblclick"` makes a double-click only zoom. It adds no delay, and a single click arrives as it does today.

Behaviour that exists today and that the filter leaves unchanged, for the human's sight (not blocking):
- a triple-click inside the interval arrives as one `click`, with no zoom;
- two quick clicks more than 10 px apart deliver only the second (`tap.js:25, 55-60`).

## The round's items against the code (Amendment 14 items 4 and 6)
- **Everything fits.** clickPick.ts +25 covers the pixel function and the `Tap` shape (`srcEvent`, `type`). WorkingCanvas.tsx +30 covers the filter and the call.
- **Existing test call sites that must change** (count them inside the +60s):
  - the three `onClick` stand-ins in `line 247 of frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx (at f64418bc), 264, 280 @ f64418bc`;
  - `line 133-140 of frontends/shell/src/canvas/clickPick.test.ts (at f64418bc) @ f64418bc`, whose missing-pixel guard now concerns a missing `srcEvent`.
- **Item 4(b) names no proof.** The minimum is a wiring test with a `{type: "dblclick"}` event, which is the real shape per the source above, and its mutation (the filter removed) observed.
- **Documentation, must-fix before the merge:** these sentences describe the old rule and must change in the round:
  - `line 774 of frontends/shell/e2e/README.md (at f64418bc) @ f64418bc`, which says the hover points are whole pixels;
  - the comments at `WorkingCanvas.tsx:2021-2022 @ f64418bc` and `clickPick.ts:9-19, 50-57 @ f64418bc`, which name `offsetCenter`.

Files read:
- C:/dev/spatial-ide/state/directives/2026-10-12-round-72-217-third-round-open-13-to-open-15.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (§2.2, Amendments 9 to 14)
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-point-click-investigation.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-worker-report-stepfix-3.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-2.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-12-shell-migration-milestone-2-phase-b-gate1-architect.md
- C:/dev/spatial-ide/.git/worktrees/mm2b/HEAD; C:/dev/spatial-ide/.git/refs/heads/cut/shell-migration-milestone-2-phase-b
- C:/dev/wt/mm2b/frontends/shell/src/canvas/WorkingCanvas.tsx; C:/dev/wt/mm2b/frontends/shell/src/canvas/clickPick.ts; C:/dev/wt/mm2b/frontends/shell/src/styles.css; C:/dev/wt/mm2b/frontends/shell/e2e/selection.mjs; C:/dev/wt/mm2b/frontends/shell/e2e/lib.mjs
- C:/dev/wt/mm2b/frontends/shell/node_modules/@deck.gl/core/dist/lib/{deck.js, constants.js, deck-picker.js, picking/query-object.js}, dist/controllers/controller.js, package.json
- C:/dev/wt/mm2b/frontends/shell/node_modules/mjolnir.js/dist/{index.js, event-manager.js, utils/event-utils.js, utils/event-registrar.js, inputs/move-input.js, hammerjs/manager.js, hammerjs/inputs/pointerevent.js, hammerjs/input/input-handler.js, hammerjs/input/compute-input-data.js, hammerjs/input/get-center.js, hammerjs/recognizers/tap.js, hammerjs/recognizer/recognizer.js, hammerjs/recognizer/recognizer-state.js}, package.json
- C:/dev/wt/mm2b/frontends/shell/node_modules/@luma.gl/core/dist/adapter/canvas-surface.js, package.json
