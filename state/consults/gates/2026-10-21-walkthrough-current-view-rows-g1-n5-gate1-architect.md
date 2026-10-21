Reviewed: PR #239 at b936965497436c210589de0226c105b3fce7a84c (base 9a8bd442), gate 1, architect
Verdict: PASS
Branch: cut/walkthrough-current-view-rows-g1-n5 @ b936965497436c210589de0226c105b3fce7a84c

I found nothing that blocks and nothing to fix before the merge. All cites below are into the worktree C:/dev/wt/wcv at the head, unless marked main.

## Correctness: no finding
Every clause of the two new spans (§2.1) and of the seven OPEN-1 items (§2.3) is true in the shipped shell at the head. None claims more than its cite shows. The quoted texts in both rows match their sources when read. The byte-for-byte check by script belongs to the reviewer, because I have no shell (see "Limits" below).

## Evidence: no finding
§4 and E1 to E3 belong to the reviewer, by script. I read the worker's report of them (state/consults/2026-10-21-walkthrough-current-view-rows-g1-n5-worker-report.md, main) and did not re-run them.

## Documentation: no finding

## Block-on-sight (§8), item by item
1. Not hit, as far as I read it. At the head the only changed lines are 324 (G1) and 948 (N5). I compared each against main's line by reading, and outside the named spans each is unchanged. The whole-file diff is the reviewer's §4 item 3.
2. Not hit. No code, test or app string changes. The worker's report and the custodian's filing note give a one-file diff. I did not run git.
3. Not hit, by read. The reason sentence in G1 equals `CURRENT_VIEW_DISABLED_REASON` (frontends/shell/src/publish/PublishPanel.tsx:70-71). N5's existing quoted spans are unchanged:
   - the refusal message equals the `Display` text at kernel/src/publish/error.rs:393-398, with the placeholders filled;
   - the guidance equals frontends/shell/src/admission/formatRefusal.ts:120-124.
4. Not hit. G1's span claims only that the option is disabled after an open, until the first of two events: the first data drawn, or a pan or zoom. It does not say the option is disabled whenever nothing is drawn, and it does not say Y4's sight is done.
5. Not hit.
   - Neither new span carries a bare path:line.
   - Item 5 keeps the existing `engine/src/geoparquet.rs:257-258`, as §2.3 item 5 directs. It still reads (`impl CoordinateUnitSource` / `as_str`).
   - The rows carry no pins.
6. Not hit. OPEN-1's yes is Amendment 1 on main, which is in the branch's parent B 978f3dde. The code came after it.
7. Not hit. On main the node is still `status: ready`, `budget_minutes: 0` (PLAN.yaml, node `walkthrough-current-view-rows-g1-n5`), so there is no PLAN edit between D's S9 and its click. The PR is a draft and has not merged.
8. Not hit. The worker's numstat gives 2+2 = 4 against a ceiling of 4. §7 is unedited.
9. Not hit. The scope addition (OPEN-1) is recorded as class 9 in Amendment 1, before any code.
10. Not hit. No record of this piece mentions a `verify-mutation` run.
11. Not hit. No record under `state/` is in the diff, by the worker's report.

## What I checked, with evidence

**W-G1, clause by clause:**
- **"With the file's data drawn on the map, Current view is enabled."** True.
  - The first batch with geometry runs `fitToExtent(…, false)` before it is drawn: WorkingCanvas.tsx:1531-1541 (baseline) and :1738-1742 (candidate).
  - The unreported arm calls `onViewShownRef.current?.(…)` (WorkingCanvas.tsx:1403-1408). That callback is App's `showBox` (App.tsx:2149), which writes `viewBox.set(bbox)` for the live dataset (App.tsx:2127-2129).
  - Availability is `useSyncExternalStore(subscribeViewBox, () => getViewBox() !== null)` (PublishPanel.tsx:382). The radio's `disabled={currentDisabled}` is at :683.
  - The real-shape proof is E-CV-OPEN: frontends/shell/e2e/export-view.mjs:93-104 asserts the radio is enabled after the first pixels, before any input.
- **"no reason paragraph appears."** True. The `<p>` renders only when `currentDisabled` is true (PublishPanel.tsx:688-690).
- **"After an open it is disabled."** True.
  - `viewBox.set(null)` runs in `handleAdmitted` (App.tsx:1108), after `admittedDatasetRef` is written first (:1104).
  - The panel is keyed per dataset (App.tsx:2377).
  - A reopen mints a fresh dataset handle (kernel/src/skp.rs:572, :1114), so the canvas keyed on `admitted.dataset` (App.tsx:2132) remounts. The previous file's data does not stay drawn while the box is null.
- **"only until the map draws the file's first data, or until a pan or zoom if one comes first."** True.
  - The box is written only through `showBox` (App.tsx:2149, :2195, :2206) and cleared only at App.tsx:1108.
  - Before any camera write `cameraRef` is null (WorkingCanvas.tsx:1056), and the resize report needs it (:2041).
  - The camera writers are the fit (:1391), interactive view-state changes (:2081) and the dev seam (:2313).
  - `onViewportWithinLastQuery` needs a prior report (:2040, :1063).
  - Zoom to layer returns early before any data (:1574-1575). Zoom to selection is a zoom through `fitToBbox` (:1585-1587).
  - Named, not blocking: the dev-only `e2eSetViewState` (:2313) also enables the option. §2.1 already records this.
- **"a reason paragraph below the two options reads, verbatim, …"** True. The `<p>` follows both radio labels inside the fieldset (PublishPanel.tsx:665-691). The quoted text matches :71 when read.
- **"Part Y's Y4 is their sight."** True. MANUAL-WALKTHROUGH.md:1866 is Y4, the P6 sight of the reason.
- **"(checked by default)"** is unchanged and still holds: `useState<PublishScopeChoice>("current")` (PublishPanel.tsx:381).

**W-N5:**
- **"starts selected by default"** and **"`PublishPanel`'s scope starts at Current view."** True (PublishPanel.tsx:381).
- **"as in G1, is enabled once the map has drawn this file's data."** True. The chain is W-G1's.
  - Every view in `drawOrder` mounts a `WorkingCanvas` with no CRS condition (App.tsx:2123-2132; workspace/workspaceState.ts:204-212).
  - N1's file is admitted (MANUAL-WALKTHROUGH.md:944).
- **"`PublishControls` renders the two radios, Whole dataset never disabled, both in `frontends/shell/src/publish/PublishPanel.tsx`."** True.
  - `PublishControls` is at :647.
  - The Whole dataset input at :668-674 has no `disabled`, and the fieldset carries none.

**§2.3, the seven items** (the worker's spans at MANUAL-WALKTHROUGH.md:948, against the form):
1. Byte-equal to the form's words, by read. True:
   - `if ds.is_geographic_degrees_instance()` (kernel/src/publish/mod.rs:474), defined over the recorded unit at engine/src/dataset.rs:1040-1043;
   - the placeholders filled from `ds.crs().identifier()` and `s.as_str()` (mod.rs:475-484), all inside `fn preflight_pinless_parts` (:453).
2. Names `prepare_with_progress`'s pin-free preflight, with no line. True: `publish::preflight_pinless` (src-tauri/src/publish.rs:424) runs before the pin phase (:434).
3. Line dropped, name kept. True: `ShellApproval::new` (src-tauri/src/publish.rs:790).
4. Names `PublishPanel`'s refused state. True: `{state.kind === "refused" && <RefusalBlock …/>}` (PublishPanel.tsx:750). It is rendered in `PublishControls`, which is the panel's body. The words are accurate.
5. Names `preflight_pinless_parts` and keeps the geoparquet cite. True; see item 1.
6. Names `GeographicCrsNotPublishable`'s `Display` in kernel/src/publish/error.rs. True (error.rs:391-398).
7. Names the `publish.geographic_crs_not_publishable` case of `formatRefusal.ts` in `frontends/shell/src/admission`. True (formatRefusal.ts:118-125).
   - "no test asserts it verbatim" still holds. A grep of frontends/shell for the guidance text finds only formatRefusal.ts:120 and the walkthrough.
   - formatRefusal.test.ts:197-207 asserts only that the guidance is non-null.

**§2.0 (e):** none of the new backticked tokens has a test prefix: `preflight_pinless_parts`, `prepare_with_progress`, `publish.geographic_crs_not_publishable`, `PublishControls`, `PublishPanel`, `CURRENT_VIEW_DISABLED_REASON`.

## Limits
- I have no shell. Every byte-for-byte equality above was checked by reading, not by script or hash: the reason sentence, the item 1 words, and the unchanged spans.
- I ran no git command, so these rest on the worker's report and on the reviewer, who runs §4 items 1 to 4 and E1 to E3 by script:
  - the diff's file list;
  - its numstat;
  - the masked whole-line comparison.
- I recomputed no pin hash.

Files read: C:/dev/spatial-ide/frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md; C:/dev/spatial-ide/state/consults/2026-10-21-walkthrough-current-view-rows-g1-n5-worker-report.md; C:/dev/spatial-ide/state/consults/gates/2026-10-14-export-current-view-after-unreported-fit-gate1-reviewer.md; C:/dev/wt/wcv/frontends/shell/MANUAL-WALKTHROUGH.md; C:/dev/wt/wcv/frontends/shell/src/publish/PublishPanel.tsx; C:/dev/wt/wcv/frontends/shell/src/App.tsx; C:/dev/wt/wcv/frontends/shell/src/canvas/WorkingCanvas.tsx; C:/dev/wt/wcv/kernel/src/publish/mod.rs; C:/dev/wt/wcv/kernel/src/publish/error.rs; C:/dev/wt/wcv/engine/src/dataset.rs; C:/dev/wt/wcv/engine/src/geoparquet.rs; C:/dev/wt/wcv/frontends/shell/src-tauri/src/publish.rs; C:/dev/wt/wcv/frontends/shell/src/admission/formatRefusal.ts; C:/dev/wt/wcv/frontends/shell/src/admission/formatRefusal.test.ts; C:/dev/wt/wcv/frontends/shell/e2e/export-view.mjs; C:/dev/spatial-ide/PLAN.yaml.
