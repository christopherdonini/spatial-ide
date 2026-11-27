Reviewed: main at b42c0ed72a8a94885bdd1f057c5c7463e5127a0e, in the detached read worktree C:/dev/wt/read-1123c (the custodian's filing note, 2026-11-23: the architect's form gate on the full form, attempt 1, node:shell-scale-display@form-gate-architect-1, dispatched at 2026-11-23T15:24:58Z; its run: Read 49, Grep 22, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:24:58Z to 2026-11-23T15:35:42Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 17114 bytes, sha256 bc45a050c852e4206a9a4fdbb20ae31c7bffe92957e473fcd3279759d993ef18, byte for byte, nothing masked, with one final newline added. FAIL: E1 to E4 (Evidence: U-SB3 green at P0; U-SB2 sweeps past the exponent bound; U-SB1 exact boundaries not shown reachable through a zoom; E-SCALE row W reads S-4 before and after its notch); no Correctness finding; D1 to D6 Documentation, D3 a draft of KNOWN-LIMITATIONS words for the advisor; OPEN-1 to OPEN-7 read for the advisor, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123c @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e

Tag: node:shell-scale-display@form-gate-architect-1. The form is `governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md`. I used Read, Grep and Glob only and ran nothing. I did not recompute the hashes (the reviewer does), and I could not read the held PRs' file lists or the private reuse clone. Every cite below is at b42c0ed7.

The design holds: the class, the CRS, the view, the callers and the seams are all sound. The form fails on Evidence only. Four of its declared tests or mutations cannot produce the observation the form claims for them. Each can be fixed by an appended amendment before any code.

## Evidence findings (blocking)

**E1. §4 P0 and U-SB3: U-SB3 is green at P0, which trips I3.**
- Commit 1 ships a working `scaleLabel`. Only `scaleReading` is a stub (form :153), and commit 2 implements `scaleReading` alone (:157).
- So U-SB3, which tests `scaleLabel` (:170), passes at P0. That contradicts :156 ("U-SB1 to U-SB4 … fail"), and I3 (:202) makes the run invalid.
- Amend:
```text
  - `scaleBar.ts` with §7's constants, `scaleLabel`, and `scaleReading` that always returns `{kind:"none"}`;
```
```text
  - `scaleBar.ts` with §7's constants, `scaleLabel` that always returns `""`, and `scaleReading` that always returns `{kind:"none"}`;
```
```text
- Commit 2 implements `scaleReading` and the comment at :148.
```
```text
- Commit 2 implements `scaleReading`, `scaleLabel` and the comment at :148.
```

**E2. §4 U-SB2: the sweep runs past §7's exponent bound.**
- From zoom 16.875 up, the smallest qualifying length is 5×10⁻⁴ (k = −4), so the reading is `out-of-range` (§2 item 1, :97).
- That leaves two outcomes, both bad:
  - if U-SB2 asserts a bar at every step, it fails on the fix;
  - if it skips non-bars, it passes vacuously at P0, where the stub returns `none` (I3 again).
- At zoom −19 the length is 5×10⁷ (k = 7). At zoom 16 it is 0.001 (k = −3). So [−19, 16] lies wholly inside the bound.
- Amend:
```text
a sweep of zoom from -9 to 20 in steps of 1/64.
```
```text
a sweep of zoom from -19 to 16 in steps of 1/64, asserting `kind: "bar"` at every step.
```

**E3. §4 U-SB1 and M1: the exact-boundary cases may not be reachable.**
- `scaleReading` takes a zoom (§2 item 1, :93), so the cases at 30 and 12 pixels per unit have to come in as 2^log2(30) and 2^log2(12).
- The form does not show that this float round trip gives back exactly 30 or 12. No integer zoom can reach equality either: 60/(m·10^k) is never a power of two, because 3 divides 60.
- `≥` and `>` differ only at exact equality, so M1's named kill (:165) is not shown reachable. M1 may survive.
- Amend so that the cases reach the comparison exactly:
```text
- M1: `≥` becomes `>`. Fails at 30.
```
```text
- The comparison is made by a pure exported `readingAtPxPerUnit(unit, pxPerUnit)` in `scaleBar.ts`, whose product caller is `scaleReading` (passing `2 ** zoom`). U-SB1's 30, 29.999, 12 and 11.99 cases call it directly.
- M1: `≥` becomes `>`. Fails at 30 and 12.
```

**E4. §4 E-SCALE row W proves nothing as ordered.**
- W follows Z6 (zoom −30, S-4; form :183). A bar needs zoom ≥ about −19.67, and one wheel notch moves the zoom by well under one level.
- So W reads S-4 both before and after the notch. It would pass even if the item never updated.
- W is the only row that uses the interactive handler (`WorkingCanvas.tsx:2169`, then :2200-2210), the path ordinary use takes.
- Amend:
```text
It runs Z1 to Z6, then W, then D.
```
```text
It runs Z1 to Z6, then Z1 again, then W, then D. W asserts that the bar's width differs from Z1's and that the label and width equal `scaleReading` at the zoom `e2eReadWorkspace` returns.
```

## Correctness

No findings.

- **Class (full, both gates): holds.**
  - ADV-2026-11-16-06 item 2 (a) lists "CRS or reprojection" (directive :25), and (b) says "In doubt, the piece is full." (:26).
  - `governance/AUTONOMY.md:327` names "a CRS-is-a-type invariant", and :349-353 send new user-visible behaviour to full gating.
  - ADV-2026-11-23-15 item 7 (d) applies that rule at this form.
  - Note: the claim at form :74 that the piece is over 260 lines rests on §7's ceiling, which is not an estimate. The CRS ground is enough without it.
- **CRS: true for every CRS the app opens.**
  - The canvas draws the CRS's own coordinates. It uses an isotropic `OrthographicView` with one scalar zoom (`WorkingCanvas.tsx:2089`, :607-613), the offset frame only translates, and nothing is reprojected (KNOWN-LIMITATIONS.md item 11, :139-144).
  - So L × 2^zoom CSS px is exactly L CRS metres, at any latitude and for EPSG:2056, 3857 or a UTM zone.
  - A CRS metre is not a ground metre (in EPSG:3857 at 60° the gap is a factor of 2). The "(CRS)" in S-1, S-2's negation and the KNOWN-LIMITATIONS paragraph all disclose this.
  - Degree, other and unestablished units get S-3 and no bar (`types.ts:114`; `geoparquet.rs:168-177`). Nothing is converted.
- **View (ADR-010 rules 1 and 6 against §2 items 1-3).**
  - The reading is the canvas's own last camera write (`currentView`, :1640-1644). Every zoom write is followed at once by one of the three box reports (:1442 then :1453/:1458; :2169 then :2200; :2407 then :2411), and `reportViewport` calls the report directly (:1110-1113). So the snapshot follows the view the user sees.
  - Zoom is a scalar. The local frame only translates, so CRS units per CSS pixel do not depend on the frame.
  - The zoom is paired with the unit of the same dataset:
    - `handleAdmitted` sets `admittedDatasetRef` and clears the store (`App.tsx:1173-1177`) before the new `admitted` renders;
    - `showBox` drops a report from a replaced canvas (:2362-2364);
    - with the box null, `canvasRef` is never read during a remount.
  - One gap is dev-only and does not block: the DEV seam writes `initialViewState` without a write id (:2409), so deck's deep-equal can drop a repeat of it (:109-112).
- **Callers.** `scaleReading` is called by `ScaleItem`, `ScaleItem` by App's slot, and `readZoom` by `ScaleItem`. `scaleLabel`'s caller is only implied (D5).
- **Seams: each matches the code at b42c0ed7.**
  - `currentView?()` (:150; body :1640-1644).
  - The three report props (:571-578, :599).
  - `createViewBoxStore` (`FeaturePanel.tsx:20-40`).
  - `CrsUnit` (`types.ts:114`).
  - `STATUS_ITEMS` and `Slots` (`contributions.ts:50-56`, :71-84). The only other full `Slots` literal is `StudioLayout.test.tsx:23-42`.
  - The footer (`StudioLayout.tsx:456-460`).
  - `e2eSetViewState(x, y, z)` (`export-view.mjs:126`; registered at `WorkingCanvas.tsx:2417`).
  - `doWheel` (`lib.mjs:642-645`).
  - `e2eReadWorkspace` returns `view` (`App.tsx:1466-1477`).
  - R-SC1's harness exists as described, and its stand-in already answers `currentView` (`App.save.test.tsx:90-120`).
- **Constitution.**
  - The piece is a display only, with no ADR-006 class involved, and it stays inside the shell (docs/02).
  - It follows docs/01's "Measurements are units-aware" (:21).
  - No ADR-018 term is used. It makes no docs/08 claim.
  - The re-render on each zoom tick is limited to `ScaleItem`, which follows `FeaturePanel`'s pattern (:98).

## Documentation findings (must be fixed before the merge; the form is append-only, so each is carried by an appended amendment)

**D1. §9, Overlap: out of date at b42c0ed7.**
- It leaves out the colour-by-refill form. That form shares `App.tsx`, `WorkingCanvas.tsx` (comments at 164-193), `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md` and `e2e/README.md` (its form :218-228).
- Milestone 5's list does not include `regionParts.tsx`, `scaleBar.ts` or `scaleBar.test.ts` (its form :293-309), yet the scale form says they are shared.
- Milestone 5's form also names `layout.mjs` (its :309), so "not named" is no longer true.
```text
- `App.tsx`, `styles.css`, `WorkingCanvas.tsx` and `src/layout/` (`contributions.ts`, `regionParts.tsx`, `scaleBar.ts`, `scaleBar.test.ts`, `StudioLayout.test.tsx`): milestone 5's form. `App.tsx` is also in the recovery offer's form. Neither is built, so the order goes to whichever is built first.
```
```text
- `App.tsx`, `styles.css`, `WorkingCanvas.tsx`, `contributions.ts` and `StudioLayout.test.tsx`: milestone 5's form (PR A). `App.tsx` is also in the recovery offer's form. `App.tsx`, `WorkingCanvas.tsx` (its comments at 164-193, not :148), `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md` and `e2e/README.md` are also in the colour-by-refill form. None is built, so the order goes to whichever is built first.
```
```text
- `e2e/layout.mjs`: possibly milestone 5's e2e suites, which are not named.
```
```text
- `e2e/layout.mjs`: milestone 5's PR A, if its re-sweep declares it (its candidate list names `layout.mjs`).
```

**D2. §8 item 4 conflicts with §2 item 8.** The KNOWN-LIMITATIONS draft's title and paragraph both use "ground", and so does Part row 1.
```text
4. A bar for a unit other than `metre`; a ratio; the word "ground" anywhere but S-2's negation.
```
```text
4. A bar for a unit other than `metre`; a ratio; the word "ground" in a string the app shows, other than S-2's negation.
```

**D3. §2 item 8, KNOWN-LIMITATIONS draft (the drafter's words, not the human's or the advisor's): two clauses are not always true.**
- The item shows nothing until the canvas reports a box. That happens on the first resident batch's auto-fit (`WorkingCanvas.tsx:1582-1591`, :1817-1819), on a pan or zoom (:2200), on `applyView` (:1646-1650), or on a resize once a camera exists (:2116-2127).
- So an empty file, or a first look refused at open, shows no item. Both are reachable in ordinary use.
```text
When the dataset's CRS names the metre on both axes, the status bar shows a bar and the length it spans on the map at the current zoom:
```
```text
When the dataset's CRS names the metre on both axes, the status bar shows, once the map has drawn the first of the dataset's features or you have moved the map, a bar and the length it spans on the map at the current zoom:
```
```text
For a dataset in degrees, in another unit or in a unit not established, no bar is shown and the status bar says so.
```
```text
For a dataset in degrees, in another unit or in a unit not established, no bar is shown, and from the same moment the status bar says so.
```
- Clause check:
  - "once … drawn the first features": the auto-fit reports (:1458).
  - "or moved the map": the interactive report (:2200).
  - "says so": S-3 follows once a box exists (§2 item 2's snapshot).
- The other clauses are true: 1, 2 or 5 × 10^k; item 11; the 0.001 and 50,000,000 limits match k in [−3, 7]; the last sentence depends on E-SCALE's recorded DPR.

**D4. §2 item 6: the new comment points to the wrong file.** The call to `currentView` is in `App.tsx`'s `readZoom`, not in `regionParts.tsx`.
```text
"Its product callers are `App.tsx`'s save and the status bar's scale item (`layout/regionParts.tsx`)."
```
```text
"Its product callers are `App.tsx`'s save and `App.tsx`'s `readZoom`, which the status bar's scale item (`layout/regionParts.tsx`) calls."
```

**D5. §2 item 1: `scaleLabel`'s product caller is not named.**
```text
`scaleLabel(mantissa, exponent)` builds the decimal from the digits, with no float arithmetic, in OPEN-4's format.
```
```text
`scaleLabel(mantissa, exponent)` builds the decimal from the digits, with no float arithmetic, in OPEN-4's format. Its product caller is `ScaleItem`, for S-1 and S-2.
```

**D6. §4: some mutations' named failing cases are wrong or incomplete.**
- M5 fails at (ii), not (iii): `onViewShown` writes the store and does not re-render App (`FeaturePanel.tsx:13-19`), so an item that does not subscribe stays empty.
- M3 also fails at k = −3.
- M4 also fails at `unestablished`.
```text
- M5: `ScaleItem` reads once and does not subscribe. Fails at (ii).
```
```text
- M5: `ScaleItem` reads once and does not subscribe. Fails at (ii).
```
That pair is a typo; the correct pair for M5 is:
```text
- M5: `ScaleItem` reads once and does not subscribe. Fails at (iii).
```
```text
- M5: `ScaleItem` reads once and does not subscribe. Fails at (ii).
```
```text
- M3: the exponent's sign is ignored for k < 0. Fails at k = -1.
```
```text
- M3: the exponent's sign is ignored for k < 0. Fails at k = -3 and k = -1.
```
```text
- M4: `unit === "metre"` becomes `unit !== "degree"`. Fails at `other`.
```
```text
- M4: `unit === "metre"` becomes `unit !== "degree"`. Fails at `other` and `unestablished`.
```
(Disregard the first M5 pair above; use the second.)

## For the advisor: the OPEN items (not ruled here)

- **OPEN-1 (A):** sound against the code. `currentView` already returns the held zoom, and returns null before the first camera write. (A) is a narrower change than the shape the human ruled at milestone 3, OPEN-7 (c), which included a new handle method. Whether the advisor may rule a departure from that shape is the advisor's question.
- **OPEN-2 (a), OPEN-4 (a), OPEN-5 (a), OPEN-6 (a), OPEN-7:** sound.
  - OPEN-4: item 51 does group digits with commas (KNOWN-LIMITATIONS.md:465).
  - OPEN-5: corpus #8 is OGC:CRS84, so degrees (MANUAL-WALKTHROUGH.md:1478). I5 covers its absence on the rig.
- **OPEN-3 (a):** sound. ADR-010 rule 6 (:70-72) is about capacity ceilings, not a display range, so it supports the bound by analogy only.

## Records

- **Quotes.** Every quotation I checked matches its source byte for byte: directive :25; ADV-16-06 :25-26; AUTONOMY :327 and :351; docs/01 :21; `WorkingCanvas.tsx:148`. I could not check the reuse output (private clone).
- **Line cites.** There is no line cite into the ledger and no bare self-line. The header's line cite into PLAN.yaml, which the same commit edits, is pinned @ 0bcf5434 in Amendment 1. The node is still at 5416-5432 at b42c0ed7. The form names the base as authoritative for code cites.
- **Pins marked (r).** Each one I read is the line the form means:
  - milestone 3's form :276-281, :277, :279, :301, :334, :472, :494, :587;
  - `WorkingCanvas.tsx` :148, :1442, :1453, :1458, :1646-1650, :2169, :2200-2210, :2407, :2411, :2116-2127;
  - AUTONOMY :327 and :351; docs/01 :21; KNOWN-LIMITATIONS :139-144;
  - `regionParts.tsx:12-17`, `styles.css:159-171`, `layout.mjs:562-574`, `WorkingCanvas.wiring.test.tsx:399-482`.
- **Scope.**
  - The per-file ceilings add up to 758, within the 760 total, over 10 files.
  - The counting command leaves out the root `KNOWN-LIMITATIONS.md` and the two declared files.
  - I1 to I6 and §8 items 1 to 14 are sound, apart from item 4 (D2).

Files read (in the read worktree C:/dev/wt/read-1123c):
- governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md
- governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (:270-339, :466-497, :583-590)
- governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md (grep)
- governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md (grep, :290-319)
- governance/PLAN.yaml (:5414-5433)
- governance/AUTONOMY.md (:310-357)
- state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md
- state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md
- state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md
- state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md
- state/consults/2026-11-23-shell-scale-display-architect-draft.md (:1-5, :320-355)
- docs/01_Principles.md
- docs/adr/ADR-010-render-frames-origins-boundaries.md (:1-80)
- frontends/shell/src/canvas/WorkingCanvas.tsx (:100-160, :555-620, :1104-1113, :1420-1460, :1580-1591, :1630-1655, :1815-1819, :2080-2220, :2370-2423)
- frontends/shell/src/canvas/viewportBbox.ts (:1-40)
- frontends/shell/src/canvas/tileGrid.ts (:314-323)
- frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx (grep)
- frontends/shell/src/App.tsx (:840-859, :1150-1194, :1460-1479, :2180-2194, :2340-2449, :2530-2625)
- frontends/shell/src/App.save.test.tsx (:1-130)
- frontends/shell/src/feature/FeaturePanel.tsx (:1-100)
- frontends/shell/src/layout/contributions.ts
- frontends/shell/src/layout/regionParts.tsx (:1-40)
- frontends/shell/src/layout/StudioLayout.tsx (:445-463)
- frontends/shell/src/layout/StudioLayout.test.tsx (:15-46)
- frontends/shell/src/skp/types.ts (:95-124)
- frontends/shell/src/styles.css (:155-174)
- frontends/shell/e2e/layout.mjs (:1-60, :282-321, :500-598)
- frontends/shell/e2e/lib.mjs (:625-654)
- frontends/shell/e2e/export-view.mjs (:115-134)
- frontends/shell/e2e/selection.mjs (:750-800)
- frontends/shell/MANUAL-WALKTHROUGH.md (:1470-1484)
- engine/src/geoparquet.rs (:120-199)
- kernel/tests/manual_walkthrough_fixtures.rs (:1-90, grep)
- KNOWN-LIMITATIONS.md (:130-149, grep)

Model: claude-opus-5-5 (Opus 5.5).
