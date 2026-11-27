Reviewed: the branch cut/shell-scale-display at 530d7b0eff587cce7c71da26295c5dfa2602b63c in the detached read checkout D:/wt/read-1127a, and the form and the ruling at main 3bef44e9a439cbc089697826e6ab68edd565d09e in D:/wt/read-1127c, both read only. This is the custodian's filing note, 2026-11-27: the architect's narrow read of §2 against the base (ADV-2026-11-27-21 item 4; the form's Amendment 8 item 10), node:shell-scale-display@section-2-against-the-base-architect-read; its run, from its completion notice only (ADV-2026-11-26-02), 41 tool uses. It gives no verdict and takes no gate-log row. It is filed in this folder, not at the brief's path under state/consults/, because its cites name lines at a branch commit. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 9660 bytes, sha256 cb715983ceebaaebb539afabfac3bf30876e56c01bcac84a12ddaccbe13dced3), byte for byte. The custodian checked by git that the read checkout's HEAD is the base.

---

NARROW READ (no verdict). Code read at cut/shell-scale-display @ 530d7b0eff587cce7c71da26295c5dfa2602b63c (the base). Form and ruling read at main @ 3bef44e9a439cbc089697826e6ab68edd565d09e.

Task: ADV-2026-11-27-21 item 4, and the form's Amendment 8 item 10. I read Amendment 8 first, then §2 and §4 as Amendments 2, 4, 6 and 7 leave them, then §9's Seams.

**Result**
- Every §2 item can still be built as written at the base. Nothing blocks.
- Milestone 5, PR 365 and the identity route only moved lines in the places §2 relies on. Each moved line is a class 3 cite fix, listed below.
- Milestone 5 added no status item. `STATUS_ITEMS` still has the same five members, so the scale goes after the same neighbour as before.
- Milestone 5 did add a second meaning for the ids S-1 and S-3 right next to where the scale goes. That is optional words for the advisor (item D below).

**A. §2 item by item, at the base** (everything else in §2 stands as written)
- Item 1, `scaleBar.ts`: a new file with no cite in the six files. `CrsUnit` is still `frontends/shell/src/skp/types.ts:114`, with the same four members. That is the definition only; I read nothing else in that file.
- Item 2, `ScaleItem` in `regionParts.tsx`:
  - Stands at the line given. The file is unchanged between 0bcf5434 and the base (it is not in the diff). The header is still :12-17, and "the two status-bar items that compute" is still at :14.
  - The props `subscribe` and `getBox` match `createViewBoxStore` (`frontends/shell/src/feature/FeaturePanel.tsx:20-40`). That store is a closure object, so passing its methods on their own is safe. App already does this for `PublishPanel` (`App.tsx:2652-2653`).
  - `FeaturePanel.tsx:13-19` and :98 stand.
- Item 3, `App.tsx`:
  - Stands. `useCallback` is imported (:4) and `canvasRef` is at :1008.
  - `viewBox` is at :967. The top-level `admitted` is at :860, and it is the value the other status slots use (:2548-2633).
  - `regionParts` is already imported (:34), so `ScaleItem` joins that import.
  - The new slot sits among the status slots (:2548-2581, with `status.selectionEnded` at :2629). The canvas gets its unit from the same `admitted.describe.crs.unit` (`crsUnit` at :2442), which supports the pairing claim in §1.
  - §2 gives no line for this item, so there is no cite fix.
- Item 4, `contributions.ts`:
  - Stands. `STATUS_ITEMS` holds residency, scanLiveness, scanIncomplete, sourceWatch and selectionEnded, and `{ id: "scale" }` goes last, after selectionEnded.
  - Its only callers are `StudioLayout.tsx:471` and `StatusItemId` (:67).
  - The cite moved: §9's `contributions.ts:50-56` is now :52-58.
- Item 5, `styles.css`: `.status-bar` is still :159-171 and unchanged. Milestone 5's new rules (:592-616) are after it and none is named `.status-scale*`.
- Item 6, the `WorkingCanvas.tsx` comment:
  - The sentence "Its product caller is `App.tsx`'s save." is still there, but on line 149 instead of 148. It shares the line with the next sentence, so it is a sub-line span.
  - Cite fix: :148 becomes :149 in §2 item 6, §4 (commit 2), §5 I2 and §8 item 2.
  - Amendment 2 item 10's replacement text still applies to it.
- Items 7 and 8, the strings and the limitation draft: the cites in their clause checks moved (table B). The number 80 and the letter AI come from Amendment 8 item 5, and I did not re-check them. I did not read `viewportBbox.ts`.

**B. Moved lines, all class 3** (form cite, read at 0bcf5434 → line at 530d7b0e)

`WorkingCanvas.tsx`:
- `currentView` signature: :150 → :151. Its doc: :145-149 → :146-150. Its body: :1640-1644 → :1647-1651.
- The caller sentence: :148 → :149.
- `pixelsPerWorldUnitAtZoom`: :607-613 → :613-619.
- The report props: :571-578 → :577-584, and :599 → :605.
- `fitToExtent`: the `cameraRef` write :1442 → :1448; the reports :1453 → :1459 and :1458 → :1464.
- `applyView`: :1646-1650 → :1653-1657.
- The interactive handler: :2169 → :2176, and :2200-2210 → :2207-2217.
- The resize: :2116-2127 → :2123-2134.
- The DEV seam: :2407 → :2414, :2409 → :2416, :2411 → :2418.
- The auto-fit calls: :1591 → :1598, and :1819 → :1826.

`App.tsx`:
- The `currentView` callers: :1475 → :1505, and :2190 → :2246.
- `e2eReadWorkspace`: :1466-1477 → :1496-1507; the effect closes at :1509.
- The open resets the store: :1176-1177 → :1200-1201.
- `showBox`: :2362-2364 → :2428-2430.
- `onViewShown={showBox}`: :2388 → :2454.
- The other two reports: :2428-2446 → :2507-2525. The debounced call inside them: :2438 → :2517.
- The `applyView` calls: :1836 → :1880, and :2034 → :2090.
- One canvas: :2356-2358 → :2422-2424.

Layout files:
- The footer: `StudioLayout.tsx:456-460` → :470-474.
- `NO_SLOTS`: `StudioLayout.test.tsx:23-42` → :24-42.
- `Slots`: `contributions.ts:80-84` → :82-86, and :71-84 → :73-86.

I checked the zoom writes for I1. There are still exactly three `cameraRef.current =` writes (:1448, :2176, :2414), and each still reaches a box report. PR 365's `keepCamera` changes only `hasAutoFitRef` (:1667-1671) and writes no zoom.

**C. The seven symbols**
- `STATUS_ITEMS`: covered in A, item 4. §2 and §4 still hold.
- `Slots` (:86):
  - The signature is unchanged. Every slot is required except `status.selectionEnded`, so `status.scale` is required. App supplies it, and that is correct.
  - The only two places that build a `Slots` object are `App.tsx` and `NO_SLOTS`. I searched all of `frontends/shell` for `Slots`. So "one `NO_SLOTS` line" still holds, and so does §7's ceiling of 2 lines for that test file.
- The footer (:470-474): it still renders every `STATUS_ITEMS` slot in order, so `StudioLayout.tsx` is still not edited.
- `NO_SLOTS` (:24-42):
  - Milestone 5 changed its members: it added `activity.problems`, and `attention.top` replaced the three old attention keys.
  - The new line goes among the status keys, after `"status.sourceWatch": null` at :41.
  - Milestone 5's new C-R3 tests (:302-373) use `NO_SLOTS`, and adding a `null` line changes none of their assertions. The "declared unchanged" claim still holds.
- `currentView`: the signature, its members `{centre, zoom}` and a body that reads only `cameraRef` are unchanged. It has exactly two non-test callers, :1505 (DEV) and :2246 (the save). I searched `src`, excluding test files.
- `showBox`: same body, with the guard `admitted.dataset === admittedDatasetRef.current` and then `viewBox.set`. It is called from all three reports (:2454, :2513, :2524). The open still sets the store to `null` first (:1201), and the ref is written before that (:1197). So §1's pairing argument and §8 item 5 still hold.
- `e2eReadWorkspace`: still DEV-only, behind `isInstrumentedBuild`. It returns `{filter, clauses, style, view}`, with `view` from `currentView` (:1505). Row W's read of the zoom still holds.

**D. What §2 does not say at the base**
- No new status slot or status item, and no change to `.status-bar`. Nothing to sit beside and nothing to displace.
- Optional words (Documentation, not the human's words; the advisor's call under Amendment 8 item 10, third bullet):
  - Why: at the base, milestone 5 uses S-1 for the Problems tab label (`frontends/shell/src/layout/StudioLayout.test.tsx:368`) and S-3 for the strip's button (`frontends/shell/src/layout/StudioLayout.tsx:125`, `:310`, and `frontends/shell/src/App.tsx:2540`, two lines above where the new slot goes). A scale comment that says only "S-3" or "S-4" next to those reads two ways.
  - Old (§2 item 7, part of the line): `Each goes in `scaleBar.ts` and is shown by `ScaleItem`.`
  - New: `Each goes in `scaleBar.ts` and is shown by `ScaleItem`. A code or test comment that names one gives this form's name with the id (`SHELL-SCALE-DISPLAY` S-1 to S-4), because at the base milestone 5's S-1 is the Problems tab's label and its S-3 is the attention strip's button (`frontends/shell/src/layout/StudioLayout.test.tsx:368`, `frontends/shell/src/layout/StudioLayout.tsx:125`, `frontends/shell/src/layout/StudioLayout.tsx:310`, `frontends/shell/src/App.tsx:2540`, each at 530d7b0e).`
  - Clause check: ":368 is S-1 for the Problems label" holds; it is the test named "…labelled S-1…". ":125 and :310 are S-3 for the button" holds; both doc comments say S-3. ":2540" holds; the comment there says "the layout's S-3 button".
- A note for the record:
  - 530d7b0e is a branch commit. So is each of its parents, since PR A is not merged.
  - Under round 15 (e), and round 25 item 2 for test text, the next amendment's cite fixes are `path:line @ 530d7b0eff587cce7c71da26295c5dfa2602b63c` with the commit named and no sha256, until a commit on main holds them.
  - The form's header already makes the base authoritative for the code.

**What I did not read**
- In the six files: only the ranges cited above. I grepped the rest; I did not read every line.
- `StudioLayout.tsx` outside the footer and the grep hits.
- `e2e/layout.mjs`, `lib.mjs`, `export-view.mjs` and `tsModuleLoader.mjs`.
- `App.save.test.tsx`, whose :39-120 §4 R-SC1 relies on and which may have moved.
- `WorkingCanvas.wiring.test.tsx`.
- `viewportBbox.ts`, `tileGrid.ts` and `geoparquet.rs`.
- Milestone 5's form and its `conditions/` code. I saw only the diff hunks.
- `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md` and `e2e/README.md`.
- No 0bcf5434 file directly. Old line positions come from the form's cites plus the hunk offsets in `<scratch>/scale-diff-0bcf-base.txt`, and the offsets agree with every line I read at the base.
- I ran nothing, computed no hash, and did not check the checkout's HEAD by git. I relied on the brief that D:/wt/read-1127a is at 530d7b0e.
