*Custodian's filing note (2026-10-13): the worker-high's report on PR #217's correction round 3, item (c), OPEN-15 (B), the tap's pixel, as the human ruled it (Amendment 15), branch cut/shell-migration-milestone-2-phase-b at d59f1a6abc0577a952940e1a34cbb76528ff1acc, the run 2026-10-12T21:56:21Z to 2026-10-12T22:08:26Z by its transcript (Read 1, Bash 56, Write 2, Monitor 1); its one SubagentHandback call, at 22:08:25Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is e58eec1326ecbc331384318d622244e4ce1eb024b4c92ee97219ad504da61532; this file's, from line 5 to the end, is e58eec1326ecbc331384318d622244e4ce1eb024b4c92ee97219ad504da61532. Its verify-quotes --show-cites line (rc 1 on untouched walkthrough lines) is the worker's own scoped run; the repository-wide run passes.*

---

REPORT: item (c) of round 3, OPEN-15 (B), the tap's pixel. Built, verified and pushed. Nothing was run in e2e.

**Head and commits** (branch cut/shell-migration-milestone-2-phase-b; start f18dbefb confirmed with an empty porcelain after `git fetch origin`)
- 635646e294a38dd4815ad8a68c36d448547f06f3 (fix:) is the code, e2e step, documentation and Part W row.
- d59f1a6abc0577a952940e1a34cbb76528ff1acc (fix:, comments only) is the mutation records, in a commit of their own.
  - Its body counts 5 records: 3 new, and 2 existing tap-test records re-observed because the handler they call changed.
- Pushed with a plain `git push origin cut/shell-migration-milestone-2-phase-b` (f18dbefb..d59f1a6a). Both commits are -s with the Co-Authored-By trailer you named.

**The pixel function** (`src/canvas/clickPick.ts`)
```
export type PixelBox = Pick<HTMLElement, "offsetWidth"|"offsetHeight"|"clientLeft"|"clientTop"> & { getBoundingClientRect(): Pick<DOMRect,"left"|"top"|"width"|"height"> };
export function tapPixel(src: {clientX:number;clientY:number}, canvas: PixelBox) {
  const r = canvas.getBoundingClientRect();
  const scaleX = r.width / canvas.offsetWidth || 1;
  const scaleY = r.height / canvas.offsetHeight || 1;
  return { x: (Math.trunc(src.clientX) - r.left - canvas.clientLeft) / scaleX, y: (Math.trunc(src.clientY) - r.top - canvas.clientTop) / scaleY };
}
```
- I read the installed mjolnir.js 3.0.1 `dist/utils/event-utils.js` (`getOffsetPosition`) before writing it. It matches line for line:
  - line 59: `rect = rootElement.getBoundingClientRect()`
  - lines 62-63: `scaleX = rect.width / rootElement.offsetWidth || 1`, and the same for y
  - lines 66-67: `x: (center.x - rect.left - rootElement.clientLeft) / scaleX`, and the same for y
- The truncation comes first, then the rect, then the border, then the division. The `|| 1` fallback is kept as is.
- The comment cites `getOffsetPosition (dist/utils/event-utils.js)` by name, without line numbers, because node_modules is untracked.
- `Tap` is now `{ srcEvent?: { clientX, clientY } }`. A tap without `srcEvent` emits nothing.
- It reads only `srcEvent` and the canvas. It reads no hover state and no pointer-down info (§8 item 3).
- `createTapHandler(deps, emit, canvas)` takes the canvas as a new third argument. Its one product caller is `WorkingCanvas.tsx`, which passes the same `canvas` it gives Deck. tsc agrees that mjolnir's `srcEvent` (MouseEvent | PointerEvent) fits `Tap`.
- `WorkingCanvas.tsx`: the dblclick filter, the settle re-pick and the hover are unchanged. Comment lines 2021-2022 now describe `tapPixel`.
- `WorkingCanvas.wiring.test.tsx`: its 5 `onClick` stand-ins carry `srcEvent: {clientX, clientY}` in place of `offsetCenter`, plus the file's doc line about deck's interface. That is 10 more lines on top of the 18 already used.

**The three cases** (`clickPick.test.ts`, describe "UB7 (tap pixel)"). Each mutation was applied, run, read and reverted. The records are in the file's OBSERVED AT style at 635646e2.
1. **The recorded case.** Client (331.5, 533.5), rect (266, 40), whole size, gives {65, 493}.
   - Mutation: `Math.round` in place of both `Math.trunc` in `tapPixel`.
   - Observed: `expected { x: 66, y: 494 } to deeply equal { x: 65, y: 493 }`. 4 of the file's 11 tests failed: the three pixel cases and the tap at (5, 6).
2. **Fractional left and top.** Client (331.9, 533.9), rect left 266.6 and top 40.6, gives (64.4, 492.4).
   - Mutation: `Math.trunc(src.clientX - r.left - canvas.clientLeft) / scaleX`, and the same for y.
   - Observed: `expected [ 65, 493 ] to deeply equal [ NumberCloseTo 64.4 (9 digits), …(1) ]`. Only this test failed.
3. **Fractional drawn size.** Rect 1000.5 x 715.453125 against layout 1000 x 715, client (331.5, 533.5), gives (64.967516, 492.687763). I computed these two values by script from the formula and wrote them as literals, checked to 6 digits.
   - Mutation: drop the division by `scaleX` and `scaleY` in the return line.
   - Observed: `expected [ 65, 493 ] to deeply equal [ …(2) ]`. Only this test failed.
- The guard test now concerns a missing `srcEvent` and passes `canvas`. I re-observed its mutation, which now replaces the guard and the line below it. It fails with `expected [ [ +0, +0 ] ] to deeply equal []`.
- I also re-observed the swapped-pixel mutation of the tap test (now client 5.9, 6.9 giving pixel (5, 6)). It fails with `expected [ [ 6, 5 ] ] to deeply equal [ [ 5, 6 ] ]`.

**E-KINDS change** (`e2e/selection.mjs`)
- `hoverHits(page, label, want, distinct, unrounded = false)`: with `unrounded`, `css = exact`. Every other caller keeps `Math.round`.
- `stepKinds` calls it with `unrounded` only when `kind === "point"`. The hover, the Navigate click, the Add only clicks and the repeat click of that kind then all use the unrounded position. The multipolygon and line kinds are untouched.
- After the hover search and before the Navigate click, the point step runs:
  - it prints `[E-KINDS] point step: hover and click at (x, y) CSS px`, using `hits[0].css`;
  - it fails with `E-KINDS (point): the position (x, y) is not fractional on both axes` unless `hits[0].css` is non-integer on both axes.
- Risk to know about: the guard checks `hits[0]` alone, as the check words it. At a forced scale of 1.25, `(x + 0.5) * 0.8` can land on a whole number on one axis, so the guard can fail spuriously there. A rerun would show it, because the message prints the position.
- **E-DBLCLICK** is now the last `runStep`, after E-ASK-TWO. Nothing else in that step changed.
- **The one-line mutation for the custodian**, recorded in the file header as a new line for E-KINDS (point): in `frontends/shell/src/canvas/clickPick.ts`, in `tapPixel`'s return line, replace both `Math.trunc(` with `Math.round(`.
  - Expected: E-KINDS (point) fails on the Navigate click (the inspected id is not the hover's), as the rounded tap did before this round.
  - If it passes, the position was not at the dot's edge in that run, and the pass shows nothing about rounding. The header says so.

**Documentation**
- `e2e/README.md`, the "Asserted" paragraph: `it runs before E-SEL-FILTER` is now `it runs last`.
- `e2e/README.md`, "What it proves not": the old sentence that the hover points are whole pixels and do not exercise a fractional coordinate now says they are whole CSS pixels, except E-KINDS' point step. That step hovers and clicks at the unrounded position, fails unless it is fractional on both axes, and runs at the machine's own display scale.
- The comments in `WorkingCanvas.tsx` and `clickPick.ts` that named `offsetCenter` now name `tapPixel` and the `pointerup`'s client coordinates. The `Tap` doc says `offsetCenter` is never read.
- The wiring test's doc line is updated in the same way.

**Part W row** (`frontends/shell/MANUAL-WALKTHROUGH.md`, after W10; plus one result-log line `W10a (the point edge, a real mouse; the scale factor)`)
- W10a, OPEN-15. With a real mouse, at your display's own scaling, open `point-p1.parquet`, choose Select and Replace, and move the pointer onto the edge of a point until the hover readout names a feature. Click without moving; repeat on a few other points. Record the Windows scale factor.
- Expected-outcome cell, marked draft: *Draft for the human's words:* each click selects the point the readout named (the highlight is on it and Selected is 1). A click that selects another point, or none, is a deviation: report it with the scale factor.

**Commands and exit codes**
- `npm run verify` in `frontends/shell`, inside a shared hold (granted; `VERIFY_RC=0`, released): rc 0. 93 test files and 1336 tests passed; the other suites it runs passed (76 and 30 passed, 0 failed).
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS.
- `node scripts/plan/verify.mjs`: rc 0, PASS.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.
- `node --check frontends/shell/e2e/selection.mjs`: rc 0.
- `npx tsc --noEmit`, run on its own earlier, was clean.
- `verify-quotes.mjs --show-cites` on my changed files: rc 1, 28 "quote not found" lines. All are on older lines of `MANUAL-WALKTHROUGH.md` (327 to 1433) that I did not touch; none is on my new lines (1826, 1848). The repo-wide run passes.

**Budget** (insertions plus deletions from f64418bc; `git diff --numstat`)

| File | Used | Cap |
|---|---|---|
| clickPick.ts | 25 | 25 |
| clickPick.test.ts | 45 | 60 |
| WorkingCanvas.tsx | 14 | 30 |
| selection.mjs | 74 | 100 |
| e2e/README.md | 4 | 10 |
| MANUAL-WALKTHROUGH.md | 2 | 8 |
| WorkingCanvas.wiring.test.tsx | 28 | 60 |

- clickPick.ts is exactly at its cap. No overrun anywhere.
- App.tsx (21) and App.selection.test.tsx (43) are from earlier work in the round; I did not touch them.

**Pre-gate self-check**
- Cross-module code: the pixel steps are written against the installed mjolnir `getOffsetPosition`, and `srcEvent` against mjolnir's `HammerEvent` type (MouseEvent | PointerEvent).
- Every completion claim points to a test or a run that exists.
- No user-facing message changed.
- The new tests reach their assertions: each failed under its own mutation.
- Not proven here, by design: the WebView2 agreement itself, and the forced scale runs at 1.25 and 1.5. Those are the custodian's e2e runs, and the run record must name the WebView2 runtime version and the device pixel ratio (Amendment 15 item 2). The point step prints the position but not those two values, since the check asked for the position only.

I ran as Sonnet 5.5 with no model override, and received and produced no context handoff.

**Final state:** head d59f1a6abc0577a952940e1a34cbb76528ff1acc, pushed. `git status --porcelain` is empty. No background process is left. The `release` call ran after the hold.
