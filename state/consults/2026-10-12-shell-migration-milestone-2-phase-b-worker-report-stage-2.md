*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B, stage 2 of 8, branch cut/shell-migration-milestone-2-phase-b at 147643c51e9adee0055bd2d6fd2ae68fd0d04a42. The agent's run held stages 1 and 2 (2026-10-12T05:16:51Z to 2026-10-12T06:00:23Z by its transcript; Read 13, Bash 91, Write 17, Edit 9); this is SubagentHandback call 2 of 2, handed back at 06:00:22Z. It arrived as a message and is extracted here by script, with no rooted path:line cite and no profile path in it; one final newline is added and nothing else is changed. Its sha256, from this file's line 5 to the end, is b3bf887f4f32697fef2deab04e90431a4bce5284d5786eabc55cd34fea16dada.*

---

REPORT: shell-migration-milestone-2, phase B, stage 2 of 8 (worker-high; model observed: Sonnet 5.5, no override, no context handoff). Stopped after stage 2 as briefed.

## Head and commits
Branch cut/shell-migration-milestone-2-phase-b in C:/dev/wt/mm2b. Head 147643c51e9adee0055bd2d6fd2ae68fd0d04a42 = origin, pushed with a plain push. The porcelain was empty when I started: HEAD was 0da5277b, the stage 1 head. No merge, rebase or force.
- b7bb54dd7df1333b1ce192e397644d150bf304f2 (X2): feat, the canvas pure modules. Every stage 2 mutation was observed at this commit.
- 147643c51e9adee0055bd2d6fd2ae68fd0d04a42: feat, the observed mutation of each test recorded. I checked that the diff has no non-comment line.
Not touched: state/, PLAN.yaml, the form, e2e, WorkingCanvas.tsx, App.tsx. Your acceptance of stage 1 decisions 1 and 2 is kept: the ViewState members stay optional and UA4's union `it` keeps its nine names.

## Changes by file (frontends/shell/src/canvas)
- clickPick.ts (new, 48): `resolveClickPick(deps, x, y)`.
  - Order, as the settle re-pick and onHover have it: no candidate gives `nothing`. Then the threshold gives `below-pick-resolution`, with no resolution run. Only above it are the pick and the row's bounds computed.
  - Bounds come from `extentOfBatch({parts: [batch.parts[row]]})`, i.e. every ring of every part of the row. A null pick, or a row with no vertex, gives `nothing`.
  - The deps are exactly `pickCandidateAt`, `belowPickResolutionNow` and `resolveCandidate`. They have no readout member and no pointer-down member.
  - `resolveCandidate` is a dep so that the test can prove no resolution runs when below; stage 3 passes `resolvePick`.
- highlightLayers.ts (new, 180): `buildHighlightLayers(batches, frame, highlight, kind)` returns `{layers, drawn}`.
  - Constants, each with what it bounds: SELECTED_OUTLINE_RGBA [0,90,255,255], INSPECTED_OUTLINE_RGBA [255,170,0,255], HIGHLIGHT_OUTLINE_WIDTH_PX 3, HIGHLIGHT_POINT_RING_RADIUS_PX = POINT_RADIUS_PX + 3 (7), HIGHLIGHT_BOTH_UNDERLAY_WIDTH_PX 7, HIGHLIGHT_BOTH_OUTER_RING_RADIUS_PX 11.
  - An empty highlight returns nothing without reading a batch.
  - Layer ids are `highlight:selected:`, `highlight:selected-both:` and `highlight:inspected:` followed by the data layer's id. The selected layers come before the inspected ones, and all are `pickable: false`.
  - Each layer carries one scalar width or radius. A both feature has its own selected-both layer at 7 px, or an 11 px ring for a point, and its inspected layer at 3 px, or a 7 px ring for a point. A selected-only feature is 3 px, or a 7 px ring.
  - Every part of a row is drawn: a polygon's exterior and holes, each line path, each point.
  - Positions are `frame.toLocal` in f64, offset-relative.
  - A WeakMap cache is keyed by batch, selection-set identity, inspected id, kind and origin. A pan that adds one tile scans only that tile. The caller must pass a set it does not mutate.
- pickResolution.ts (+8/-11): `CanvasTool` and `cursorForPointerState(isDragging, tool = "navigate")`. Navigate is crosshair, Select is the CSS keyword `default`, and a drag is `grabbing` in both. The doc comment is rewritten as Amendment 2 item 6 requires.
- HoverReadoutView.tsx (+9/-8): `idLine` is exported. The two refusal texts are the constants HOVER_SESSION_ENDED_TEXT and HOVER_BELOW_RESOLUTION_TEXT, and the component renders them in place of the inline text.
- Tests: clickPick.test.ts (new, 123), highlightLayers.test.ts (new, 176), pickResolution.test.ts (+29, appended; its two cursor tests are unedited).

## Byte comparison of HoverReadoutView (Amendment 2 item 7)
I read the base span at c96e5329 by the form's rule (each JSX line of the two refusal divs trimmed, lines joined by one space). My script is bytecheck.mjs in the scratchpad's mm2b-b folder.
- HOVER_SESSION_ENDED_TEXT: equal byte for byte, 162 bytes.
- HOVER_BELOW_RESOLUTION_TEXT: equal byte for byte, 68 bytes.
- HoverReadoutView.test.tsx is unedited and passes (58 tests with pickResolution.test.ts, run with B's version of that file).

## Caller rule, stated plainly
At this head nothing outside the tests calls `resolveClickPick`, `buildHighlightLayers`, `idLine`, the two constants' second use, or the tool argument of `cursorForPointerState`. That is the second exemption.
- The consumers are named in the form and gated: WorkingCanvas's onClick, the render() append and the getCursor call in stage 3, and FeatureTab in stage 4.
- The constants are already called by HoverReadoutView itself.

## Tests and mutations
All 16 were applied to the committed tree of X2 = b7bb54dd7df1333b1ce192e397644d150bf304f2, the named test run, the failure read, and the file restored with git checkout. Porcelain was empty after each. No verify-mutation run was used. The failure text is in each test's comment; the exact edits are in the comments too.

| Test | Mutation | Failure observed |
|---|---|---|
| UB7 below threshold, no resolution | resolve before the threshold check | "resolutions run: expected 1 to be +0" |
| UB7 the tap's own pixel | `pickCandidateAt(y, x)` | "expected [ [ 6, 5 ] ] to deeply equal [ [ 5, 6 ] ]" |
| UB7 all parts of the row | bounds from the first part only | feature objects not equal (ordinal 1 hit part 1) |
| UB7 ordinal resolves to no feature | answer a feature with a null pick | "expected { kind: 'feature', pick: null, ... } to deeply equal { kind: 'nothing' }" |
| UB7 row with no vertex | answer a feature with `bounds as never` | "expected { kind: 'feature', ... } to deeply equal { kind: 'nothing' }" |
| UB8 readout stands on A, candidate B | a readout dep, preferred | "expected 10n to be 20n" |
| UB9 empty highlight | early return deleted | "Error: the batch was read for an empty highlight" |
| UB9 non-pickable, prefixed, order | `pickable: true` | "highlight:selected:sh_hl:0: expected true to be false" |
| UB9 every part drawn | first part only | "expected [ …(2) ] to have a length of 3 but got 2" |
| UB9 offset-relative | absolute coordinates | positions not minus the origin |
| UB9 drawn set | every selected id added | "expected [ 1n, 3n, 99n ] to deeply equal [ 1n, 3n ]" |
| UB9 cache | cache never hits | "expected [ …(3) ] to be [ …(3) ] // Object.is equality" |
| UB9-b polygon both | both drawn at the ordinary width | "selected, and inspected: expected 3 to be 7" |
| UB9-b point both | ring at the ordinary radius | "expected 7 to be 11" |
| UB11 swap | the two tools' cursors swapped | "expected 'default' to be 'crosshair'" |
| UB11 second | drag in Select returns the tool's cursor | "expected 'default' to be 'grabbing'" |

## H3 for unit suites
- All base suites pass unedited. Of the base test files I touched, only pickResolution.test.ts, by appending. B's version of that file, run against the head's source, passes and typechecks. HoverReadoutView.test.tsx is not touched.
- Stage 1's single exception stands (the UA4 union line), as accepted.
- `npm run verify` at 147643c5: rc 0. 88 files, 1258 tests (stage 1 head 86/1242: +2 files, +16 tests). residency-trace 76 passed, citation-integrity 30 passed.

## Governance, at 147643c5
- verify-cites rc 0 (1806 files, 38 loose advisories; the stage 1 head had 37). verify-quotes rc 0 (121 checked, 90 verified, 30 baselined). verify-test-claims rc 0 (545 claimed). verify.mjs rc 0.
- node --test scripts/plan, hooks and evidence: rc 0, 457 pass, 0 fail.
- One shared hold for the verify run, granted; no exit 96 to 99.

## §7 count (§7's command from B, three-dot, at the head)
Cumulative insertions 1,555 plus deletions 43 = 1,598 (stage 1 was 1,006).
Stage 2's own files:
- clickPick.ts 48 (ceiling 120).
- highlightLayers.ts 180 (220).
- pickResolution.ts 19 (20).
- HoverReadoutView.tsx 17 (ceiling 12): over by 5. The file's deletions alone are 8, because the two inline refusal blocks (4 and 3 lines) and the signature line are replaced by the form's own design (Amendment 2 item 7). That is a file-level class 8 candidate. The B-C group stays far inside: 264 of 572, WorkingCanvas not yet counted. I did not edit §7.
- Tests: clickPick.test.ts 123, highlightLayers.test.ts 176, pickResolution.test.ts +29.

## e2e for the custodian
Stage 2 needs no e2e step, and I wrote none and ran none. Nothing is owed at this head. The click, the highlight and the cursor reach the screen only in stage 3. Their e2e steps (E-CLICK, E-SELECT, E-NODRAG, E-ZOOMSEL, E-KINDS, E-CLICK-FAST) will be written with stage 5, when App drives them.

## Notes for the gates and for stage 3
1. `buildHighlightLayers`'s `drawn` set covers the resident ids among the selected and the inspected, one set, so the Feature tab can state whether the inspected feature is drawn from the same pass. `countSelection` only reads membership of the selected members, so the extra inspected id is harmless. The form names only the selected ids. This is a small widening; stage 3's `onSelectionDrawnChange` will emit this set.
2. For points, the ring layer's stroke is 3 px; the form fixes only the radii (7, 11).
3. In the highlight, a line is drawn as its path at 3 px (7 px if both); a polygon as its rings. A highlighted line is therefore wider than the 2 px line under it. Stage 5's walkthrough sighting should look at it.
4. Row UB7 has five `it`s and UB9 eight, beyond the form's one-per-row table. Each has its own observed mutation.
5. The stage plan stands: stage 3 is WorkingCanvas wiring, and the OPEN-12 wait applies only to stage 7's render site.
6. Environment as before: node_modules are real installs, and nothing in the tree is tracked from them.

## Pre-gate self-check
- Cross-module: clickPick uses `extentOfBatch`, `PickResult` and `ResidentBatch` as they are in the tree. highlightLayers uses `layerId`, `POINT_RADIUS_PX`, `OffsetFrame.toLocal` and deck's `PathLayer` and `ScatterplotLayer` props as buildLayers.ts uses them.
- Every completion claim names a test or a script output above.
- No user-facing string was added; the two constants carry the existing text.
- Every test reaches its assertion: the mutation failures are on the intended line, except UB9-empty, which fails by the trap's thrown error, which is the assertion's own mechanism (the batch must not be read).

## State left
`git status --porcelain` in C:/dev/wt/mm2b: empty. HEAD 147643c5 = origin/cut/shell-migration-milestone-2-phase-b. Run artefacts: scratchpad mm2b-b/ (specs2.json, mut-run2.log, fill3.mjs, bytecheck.mjs, verify-head2.log, gov-head2-*.log).
