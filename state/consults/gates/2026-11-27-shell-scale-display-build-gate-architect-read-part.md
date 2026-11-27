Reviewed: governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md at main @ f39536be767cedc2f6637e3d0d48d286e2bc2688, against the code in the read checkout D:/wt/read-1127a at cbea7d4e06622e5b1debc058ba2a23ea696df761 (PR 368, draft). Shell-scale-display's build gate, the architect (Opus), THE READ PART, with no verdict; its run, from its completion notice only (ADV-2026-11-26-02), was 58 tool uses. Filed by the custodian, 2026-11-27: the hand-back saved by Write with the harness's indent removed (14415 bytes, sha256 39cd3306d48939596bc1fa4be0dd5bc976516233c66c21c05eedb44e6b95386a), byte for byte below the rule.

---

READ PART: cut/shell-scale-display @ cbea7d4e06622e5b1debc058ba2a23ea696df761, with the form and governance read at main f39536be767cedc2f6637e3d0d48d286e2bc2688. No verdict. The verdict comes at the run part, after E-SCALE.

Every code cite below is at cbea7d4e. Every form or ruling cite is at f39536be. Everything here is paraphrase unless it is marked verbatim. The form's Block-on-sight list is its §8 and its seams list is in its §9; the brief's §9 and §10 are read as those two.

**Locators (<scratch>).** `scale-diff.txt` reads as 682 lines. Every row of `scale-numstat.txt` matches its file's hunks in the diff. I have no shell, so I did not recompute the byte counts or either sha256. The commit-by-commit split (8c1e68d3 holding only the U4 lines, cbea7d4e only the words) is the workers' account; I did not check it by git.

## Findings

**F1. Architecture. Fixing it changes a code file, one comment line, no behaviour.** §8 item 9 holds as the code stands, so it blocks until fixed.
- `SCALE_BAR_MAX_PX` (`frontends/shell/src/layout/scaleBar.ts:13` @ cbea7d4e) is exported, but no product code reads it. Its only reader is U-SB2 (`scaleBar.test.ts:52` @ cbea7d4e).
- The other exports pass on the form's own reading (Amendment 2 item 4), under which a caller in the same module counts as a product caller. `SCALE_BAR_MIN_PX`, `SCALE_EXPONENT_MIN` and `SCALE_EXPONENT_MAX`, `SCALE_MANTISSAS`, `ScaleMantissa`, `ScaleReading` and `readingAtPxPerUnit` are all used by product code in `scaleBar.ts`.
- The way out keeps the constant and its export, and adds a doc saying the test suite is its only caller. This is the instrument-accessor exemption: the constant is read-only and acts on nothing. Fitting that exemption to a declared constant is my reading; the advisor may overrule it.
- Removing the export instead does not work: `noUnusedLocals` (`frontends/shell/tsconfig.json:15` @ cbea7d4e) would fail on the unused constant. Deleting the constant would break §2 item 1, which has the file hold §7's constants.
- So this way out changes none of §7's constants and no claim, and that is not a reason to send it to the advisor.
- This line is not the human's wording. The worker applies it with no re-gate, the PR body lists it, and the reviewer gives the changed code line a narrow read.
- The pair, in `frontends/shell/src/layout/scaleBar.ts`. Old, verbatim, which occurs once:
  `export const SCALE_BAR_MAX_PX = 150;`
  New:
  `/** Read by no product code: the arithmetic above keeps every width under it, and nothing checks it at run time. Its only caller is the test suite: U-SB2 in \`scaleBar.test.ts\` checks, at every zoom of its sweep, that the shipped \`scaleReading\` keeps the width under it. §7 declares this bound (ADR-010 rule 6), and only a test can show that the arithmetic holds it. */`
  `export const SCALE_BAR_MAX_PX = 150;`
- Each clause, checked against the code:
  - "Read by no product code": a search finds it only in `scaleBar.ts`, as the declaration and in a comment, and in `scaleBar.test.ts`.
  - "the arithmetic above": the doc at `scaleBar.ts:11` gives the factor-of-2.5 bound.
  - "nothing checks it at run time": `readingAtPxPerUnit` (`:50-61`) compares against the minimum only.
  - "U-SB2 … every zoom of its sweep": `scaleBar.test.ts:44-58`, -19 to 16 in steps of 1/64.
  - With the doc, scaleBar.ts is at 72 of 90 lines and the piece at 492 of 760.

**F2. Documentation. Fixing it changes a code comment in a file outside §7's list.** This needs class 9 and the advisor before it is committed (§8 item 1).
- The DEV-only seam `e2eReadWorkspace` has a doc (`frontends/shell/src/e2e-test-surface.ts:198-199` @ cbea7d4e) that names `e2e/reopen.mjs` as its only caller. From this head, E-SCALE also calls it (`frontends/shell/e2e/layout.mjs:590` @ cbea7d4e), so the doc is no longer true.
- The pair, in `frontends/shell/src/e2e-test-surface.ts`. Old, verbatim, which occurs once:
  `Only caller: \`e2e/reopen.mjs\`, which must see the state a reopen applied.`
  New:
  `Its callers: \`e2e/reopen.mjs\`, which must see the state a reopen applied, and \`e2e/layout.mjs\`'s E-SCALE, which reads the zoom after a wheel notch.`
- Clause check: these are the only two suites that call it (searched under `e2e/`), and E-SCALE reads `.view.zoom` (`layout.mjs:590-591`).
- This line is not the human's wording.

**F3. Evidence, open until the run part. No code change. A clause in the advisor's words, sent to the advisor unreworded.**
- The comment on KNOWN-LIMITATIONS item 80 (`KNOWN-LIMITATIONS.md:576` @ cbea7d4e, the ruling's second New span) says, in the present tense, that the item's last sentence rests on E-SCALE's record of a device pixel ratio of 1. No run of E-SCALE has been made, so that record does not exist at this head.
- It becomes true only if the tester's series records 1, which is where Amendment 13 item 5 (iv) puts the decision. The run part checks it. If the series records any value but 1, both the comment and the paragraph's last sentence go back to the advisor.

**F4. Evidence, a clause in the advisor's words, sent to the advisor unreworded. No code change. These are strings the app shows, so they stay under P6.**
- S-2 (`scaleBar.ts:36-37` @ cbea7d4e) says the bar spans {L} m on the map, with no qualifier for the display scaling.
- The code makes the bar L × 2^zoom CSS pixels wide. That 2^zoom is the canvas's CSS pixels per unit was measured at a device pixel ratio of 1.0 only (`canvas/viewportBbox.ts:16-23` @ cbea7d4e).
- So on a display at any other scaling, S-2 is unchecked; it is not shown false. §1's list of things the piece may not claim includes the bar's length at any other ratio. Item 80's last sentence discloses this, and row AI5 with invalidator I7 is the check.
- An operator can reach this in ordinary use, on any display scaled above 100%.

**F5. Documentation, a clause in the advisor's words, sent to the advisor unreworded. No code change.**
- Row AI1 (`frontends/shell/MANUAL-WALKTHROUGH.md:2144` @ cbea7d4e) says the bar stays between about 60 and 150 pixels.
- Those are CSS pixels (`scaleBar.ts:11-13`). At a display scaling of 125% or 150%, the bar covers up to 1.25 or 1.5 times as many screen pixels.

**F6. Architecture note, not blocking. Fixing it would change code and §2 item 2's design, so the advisor decides.**
- `ScaleItem` puts `aria-label` on a `div` with no role (`regionParts.tsx:253` @ cbea7d4e), as §2 item 2 drafts it. ARIA 1.2 does not allow naming an element with the generic role.
- Two places speak of the accessible name: R-SC1's message (`App.scale.test.tsx:167` @ cbea7d4e) and the e2e README's clause on Z1 to Z5 (`frontends/shell/e2e/README.md:746` @ cbea7d4e). Both tests read only the attribute; neither reads the accessibility tree.
- I propose no words for the README clause: ADV-2026-11-27-28 item 4 keeps that entry as written, and the reviewer's read part reads it.

**F7. Evidence, for the reviewer's read part. No code change.**
- The worker observed M1 to M5 at 1d613b04 (the build report's MUTATIONS section). The two later commits changed the code those mutations touch:
  - 8c1e68d3 changed `scaleReading`'s parameter type and `ScaleItem`'s prop types;
  - cbea7d4e changed R-SC1's expectations at (ii), where M5 is killed.
- So the reviewer's new observation at cbea7d4e is the one that counts (§9).
- For M1, M3 and M4 the form names two failing cases each (Amendment 2 items 4 and 6, as Amendments 4 and 6 amend them). Only the first case of each was observed, because the tests stop at their first failure. The reviewer either observes the second case or records it as unobserved.

**F8. Documentation, a note only. No edit, because the form is append-only.**
- §1's may-claim list leaves out the exponent bound: a zoom outside it shows S-4, not a bar. §2 item 1, §7 and item 80's sentence on 0.001 to 50,000,000 carry it.

## The checks the brief asked for

**Diff against §2 and §4.** Every item the product gains is one §2 describes:
- `scaleBar.ts` (§2 item 1, as Amendments 2, 4 and 6 amend it);
- `ScaleItem` (§2 item 2, with ADV-2026-11-27-25 item 2's types);
- App's `readZoom` and slot (`App.tsx:1010`, `:2638`);
- `STATUS_ITEMS` (`contributions.ts:58`);
- the CSS (`styles.css:183-196`), with `.status-bar` unchanged;
- the comment at `WorkingCanvas.tsx:149`, which is Amendment 2 item 10's New text;
- the `NO_SLOTS` line.

Every test is one §4 names: U-SB1 to U-SB4, R-SC1 (i) to (iv), and E-SCALE (Z1 to Z6, Z1 again, W, D, the DPR record). The extra assertions sit inside named tests: the title and aria checks in E-SCALE and R-SC1, and the extra boundary cases in U-SB4. No new item for the advisor. The SHELL-SCALE-DISPLAY prefix on string ids (ADV-2026-11-27-23) is on every comment and test name that names one.

**U4 by way (a)** (ADV-2026-11-27-25 items 1 and 2). It holds:
- No source file under `src/layout/` imports from `skp/` or `canvas/`. A search of every file that is not a test finds only the one allowed type import, in `scaleBar.test.ts:10`, and U4 excludes test files (`layoutBoundary.test.ts:28`).
- `scaleReading(unit: string, …)` returns `not-metre` for every value but `"metre"` (`scaleBar.ts:67-71`).
- `ScaleItem` has `unit: string` and `getBox: () => object | null`, and compares the box only with `null` (`regionParts.tsx:241-246`).
- App passes `admitted.describe.crs.unit`, a `CrsUnit` and so assignable to string, and `viewBox.get`, which returns `AuthoritativeBbox | null` (`FeaturePanel.tsx:21`). There is no cast.
- The two doc sentences are at `scaleBar.ts:65` and `regionParts.tsx:233`, and each names U4.

**CRS truth** (docs/01 line 21; ADR-010 rules 1 and 6). It holds:
- A bar is shown only for `"metre"`. The wire's unit is a closed set of four values (`skp/types.ts:105-114`), and the engine writes `metre` only when both axes name it (`engine/src/geoparquet.rs:169-193`).
- Nothing is reprojected or converted. The width is L × 2^zoom from `currentView` (`WorkingCanvas.tsx:1647-1651`), and the canvas applies no view transform.
- A zoom is never paired with another dataset's unit:
  - the open clears the store before the new dataset is set (`App.tsx:1203`);
  - a report from a canvas that has been replaced is dropped (`App.tsx:2430-2432`);
  - the snapshot reads no zoom while the box is null (`regionParts.tsx:246`).
- The bounds are declared (§7).

Sentences that claim more than the code does: F3, F4 and F5, all in the advisor's words. Item 80's other sentences, S-1, S-3, S-4 and the other rows of Part AI each hold against the code.

**§8 item 9 and `SCALE_BAR_MAX_PX`** (ADV-2026-11-27-25 item 6): see F1. The way out changes none of §7's constants and no claim.

**Seams (§9), each against the interface it actually has.** Each holds at this head:
- `currentView?()`;
- the three report props, and every zoom write followed by a report (`WorkingCanvas.tsx:1448`, `:2176` then `:2207-2217`, `:2414` then `:2418`);
- `createViewBoxStore`'s `get` and `subscribe` (`FeaturePanel.tsx:20-40`);
- `CrsUnit`;
- `STATUS_ITEMS`, `Slots` and the footer (`contributions.ts:52-87`, `StudioLayout.tsx:470-474`);
- `e2eSetViewState(x, y, z)` returning `Promise<boolean>` (`e2e-test-surface.ts:336`);
- `doWheel(page, centre, deltaY)` and `canvasRect` (`lib.mjs:633-645`);
- `e2eReadWorkspace().view` (`App.tsx:1501-1508`).

The end-to-end proof is E-SCALE, and it is owed to the tester.

**Guarantees.**
- ADR-006: no operation, no mutation and no Console row.
- Never block the canvas: `ScaleItem` re-renders only when the zoom it reads changes, and App does not re-render (§8 item 6).
- No performance claim is made.

**Portability (§2 item 9).** It holds. The product code uses no feature that depends on the OS. E-SCALE's Windows paths are declared Windows-only. The unit tests and R-SC1 use only mocked path strings.

**§1, item by item.**
- May claim, the length, the width and S-3: true within §7's bound (F8).
- May not claim, ground distance or a ratio: true.
- May not claim, a device pixel ratio other than 1: true in the code and the README (`scaleBar.ts:7-8`, `README.md:746`). S-2 is F4.
- May not claim, any performance figure, macOS or Linux, or more than one view: true.
- Class: true. docs/01 and ADR-010 rules 1 and 6: true.
- ADR-006: true. The unchanged list: true. The numstat touches no file in the wire, kernel, engine, protocol, src-tauri, renderer or `surfaceRegistry.ts`, and no handle method.

**§8, item by item** ("held" means the code does what the item forbids).
1. Not held: 13 paths, all on the list.
2. Not held: under `canvas/`, only the comment.
3. Not held.
4. Not held: "ground" appears in a shown string only in S-2's negation.
5. Not held.
6. Not held: App has `useCallback` only (`App.tsx:4`).
7. Not held.
8. Not held: the advisor's words have landed.
9. Held, by F1.
10. Not held.
11. Not held: the worker does not call `verify-mutation` an observation, and M1 to M5 carry 1d613b04. F7 covers the later commits.
12. Not held: 491 of 760 lines, 10 of 10 files, and each file under its ceiling.
13. Not held: no cite into DECISIONS-PENDING, no hash, and AI5's line into the walkthrough itself was removed.
14. Not applicable at the read part.

**§7.** 487 insertions and 4 deletions, 491 lines over 10 counted files, by the numstat in <scratch>. Outside the count: KNOWN-LIMITATIONS 4, the walkthrough 29, the README 2. That agrees with the workers' reports. The design did not grow beyond what §2 declares. F1's doc adds one line, and F2, if the advisor allows it, adds a comment edit outside the list.

**Wording.**
- F1's and F2's words are not the human's. The worker applies F1's with no re-gate. F2's wait for the advisor's class 9.
- F3, F4 and F5 are the advisor's ruled words, reported with no words of mine. None is a red-line text.
- E-SCALE's run, its red at P0, M6 and the device pixel ratio record are owed to the tester. The run part reads them.

Files:
- D:/wt/read-1127a/frontends/shell/src/layout/scaleBar.ts
- D:/wt/read-1127a/frontends/shell/src/layout/regionParts.tsx
- D:/wt/read-1127a/frontends/shell/src/App.tsx
- D:/wt/read-1127a/frontends/shell/src/e2e-test-surface.ts
- D:/wt/read-1127a/frontends/shell/e2e/layout.mjs
- D:/wt/read-1127a/KNOWN-LIMITATIONS.md
- D:/wt/read-1127a/frontends/shell/MANUAL-WALKTHROUGH.md
- D:/wt/read-1127c/governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md
