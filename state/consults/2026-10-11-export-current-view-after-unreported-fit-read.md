*Custodian's filing note (2026-10-11): the read-only read the human asked for before a node on the Export panel's Current view after an unreported fit (state/directives/2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md, item 1), the run 18:15:42Z to 18:20:46Z by its transcript, read at main 58c2d153 and the v0.1.0 tag b391e43. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 18c58ca92e82f6fc3ecc68aba3e4d8aff856928d31320dd94ea70d2cde20050c. Its side observation on item 39's whatever its outcome read App.tsx only; the candidate arm's reset at each reissue start (frontends/shell/src/residency/candidateArmSession.ts) is gate 4's subject on PR #207 and is not re-examined here.*

---

# Export Current view after an unreported fit: read
Read at: main @ 58c2d153e11b641b18d58023ae0051a466901b27; tag v0.1.0 @ b391e43622056324c56d35cc33065305140a8415

Before reading I ran `git fetch origin` and confirmed HEAD equals origin/main (58c2d153e11b641b18d58023ae0051a466901b27). I made no edits, no checkouts and no builds. I read the tag through `git show`. Below, M = 58c2d153e11b641b18d58023ae0051a466901b27 and T = b391e43622056324c56d35cc33065305140a8415.

## 1. At main: does the default export scope after an Apply or Clear carry the box from before the fit?

**Yes.** This holds whenever a view was reported for the dataset before the Apply or Clear: a pan, a zoom, Zoom to layer, or a resize report. In that case the default Current view export sends the box from before the fit until the next report. If no view had been reported since the open, Current view is disabled instead (see "After an open" below).

**What writes `lastViewportBboxRef` (App).**
- It is declared at frontends/shell/src/App.tsx:821 @ M sha256:2daa358861a63fab6d72d65f99577c21371241ec20612716b6708ef30196e50b.
- A script count finds exactly 3 assignments in App.tsx at M:
  - The admit reset writes null and sets `hasSettledView` false: frontends/shell/src/App.tsx:1000-1006 @ M sha256:5ed75a07879d64d2793c443f2d963ba65f6ef2bbb7f9c87159d4c8eb8b1ffe9d, called with null at frontends/shell/src/App.tsx:202 @ M sha256:d9da889dd4c2384279e786d75b59f0c33ae7d9710b8ead042cf8bf8cb62a6d63.
  - `onViewportChanged` writes the box and flips `hasSettledView` true; `onViewportWithinLastQuery` writes the box and leaves `hasSettledView` alone: frontends/shell/src/App.tsx:1829-1849 @ M sha256:d4e2ee97804af04deb7c3d1e5ef3e141e660f30c276a71d412286f8efbc12f09. This hash is the same as Amendment 2 item 2's pin of these lines at 6de584fa.
- Nothing in an Apply or Clear writes the ref or `hasSettledView`.

**The Apply and Clear path.**
- Clear calls the same submit with an empty text: frontends/shell/src/filter/FilterPanel.tsx:66-69 @ M sha256:0f2b24de6cbe5c2637d1a2da350f1e936d6f0c5b7342b3ba02182e3e6951f7da. That submit reaches `onApply={handleApplyFilter}` at frontends/shell/src/App.tsx:1688 @ M sha256:119373bd8b1581be808361defd206df9b33649f6ddd2e39791b2e688bb0659ef.
- `applyFilter` calls `resetFitForNewGeneration` only on an "issued" outcome: frontends/shell/src/App.tsx:333-337 @ M sha256:923a3cf411a1edc4efd64107de0fd884669df79ed93c66d487b25ee85eeec7e1. That dep calls the canvas: frontends/shell/src/App.tsx:958-961 @ M sha256:bdbba1846542e3689c19a9709ec0dbc0b1e08886665c94d028a23c6c2b1ab58f.

**The canvas side (WorkingCanvas).**
- `resetFitForNewGeneration` clears the fit anchor, re-arms the one-shot auto-fit and nulls `lastQueriedRef`: frontends/shell/src/canvas/WorkingCanvas.tsx:1532-1536 @ M sha256:e82b33496db058c3b71421e7cabd6b3facbe4a6e6b4b7ebd3b7546f2aa7ac706.
- The re-armed auto-fit runs on the next batch that carries geometry, with `fitToExtent(..., false)`:
  - baseline arm: frontends/shell/src/canvas/WorkingCanvas.tsx:1478-1488 @ M sha256:c27ca0ad6214c9518162452c50c83da344fabdf2b9999483e97d2a47f4a85405
  - tiled arm: frontends/shell/src/canvas/WorkingCanvas.tsx:1681-1685 @ M sha256:b2409c3b58d9415b89bff442cf8172b64d2d5d02313a4fc9a0ad7c22b1469452
  - Amendment 2 (d) pins lines 1487 and 1683 at 7cde3385. Their hashes recompute identically at M.
- In `fitToExtent`, when `notifyViewport` is false, nothing reaches `onViewportChanged`. It only sets `lastQueriedRef.current = null`: frontends/shell/src/canvas/WorkingCanvas.tsx:1349-1355 @ M sha256:7f4b29f260bb6c2931e69c179d47eec087c926bb40ffaa77ebcd50cb83119afa. The prop doc says the automatic fit "never fires it": frontends/shell/src/canvas/WorkingCanvas.tsx:533-539 @ M sha256:39539fc25de907c76677042af03139ed6c6ade8379ea8d9e8158bbfccdc8dd72.
- The sites that do report go through `reportViewport`, frontends/shell/src/canvas/WorkingCanvas.tsx:1020-1028 @ M sha256:f342b1107911fa9c809423097a43a94bd7f162f1c1c1373904d9ec14fc7f1d6f. There are four:
  - the notifying fit (Zoom to layer): frontends/shell/src/canvas/WorkingCanvas.tsx:1528 @ M sha256:8cc3bc160e9c7bc4d514869a0b245bb33a01f68e7a19a730489ce98ba2ffbe8d
  - the resize "query" branch
  - the interactive `onViewStateChange`: frontends/shell/src/canvas/WorkingCanvas.tsx:2018-2028 @ M sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2
  - the DEV-only view-state seam (line 2227)

**How the Export panel chooses and shows Current view.**
- The scope is panel-local, `useState<PublishScopeChoice>("current")`: frontends/shell/src/publish/PublishPanel.tsx:329 @ M sha256:d6cb8b2ec7e6c0b7d1cd6c60f2bc2811414c1d7be0a5a0752b8b441f9ebac81b. The doc names Current view as the default: frontends/shell/src/publish/PublishPanel.tsx:316-319 @ M sha256:2268f4f10b571247d480a8e74fa6d80eade3ad18e4bcdea686c8f6934abc16aa.
- The panel is keyed on the dataset only, so an Apply does not remount it or reset the choice: frontends/shell/src/App.tsx:1976-1983 @ M sha256:65adaeb11d5d8155fc3f1bd1140f84df46842048e3dde7926c24fd65a1fe3320.
- The option is disabled only by `!hasSettledView`: frontends/shell/src/publish/PublishPanel.tsx:36-38 @ M sha256:69a47aa5c42fc2b326e8574acea344ee977fa56c28e74efee9755693b9cdb5ed. Since `hasSettledView` resets only at admit, it stays enabled after an Apply or Clear.
- The panel shows a label only: the radio "Current view", plus the disabled reason when disabled. frontends/shell/src/publish/PublishPanel.tsx:584-599 @ M sha256:237750b17161d31fe7ab70095575a5e97ef32b303580987d7ca87d536c195c02.
- The Export button is blocked only by `scope === "current" && currentDisabled`: frontends/shell/src/publish/PublishPanel.tsx:608 @ M sha256:da576a827d6b2609075e44862db2df26c6e549e09ffe8a9f8eb76def387a8652.
- At click time the panel reads the ref through the getter: frontends/shell/src/publish/PublishPanel.tsx:348 @ M sha256:4ec6b8a27bb61e0d3c89af4229342c6b51f2cb7be19c7f3e57fdf3fbdf81a54f. `resolvePublishScope` refuses only a null box: frontends/shell/src/publish/PublishPanel.tsx:51-53 @ M sha256:99344da160ee4f2987efdf7bd8c74b317051cf44588acc169b6f4b5690a82848.
- So after an issued Apply or Clear and its auto-fit, the export sends the last reported box, which is from before the fit.
- When a filter is active, the panel also shows the filter-scope sentence (frontends/shell/src/publish/PublishPanel.tsx:602 @ M sha256:cef24920c6ae7d8f6a8d9a1f5a18494a706bf632408c10ad584a70d46ee7fbfe). Its text ends "publishing publishes the viewport extent, not your filter": frontends/shell/src/publish/types.ts:127-129 @ M sha256:3c8a5d3511d21c34405652c33a282b8c61963e8e3ea25ece4aac6e0eb0b71db7.

**After an open.** No stale box is possible.
- The admit reset nulls the ref and sets `hasSettledView` false (pins above). The open's auto-fit then reports nothing.
- Current view stays disabled, with its reason shown, and the default-checked Current view blocks Export until the first pan, zoom or Zoom to layer. The operator can still choose Whole dataset.

**After a resize that reports nothing (item 39).**
- `onResize` reports only when `viewportAfterResize` decides so: frontends/shell/src/canvas/WorkingCanvas.tsx:1954-1958 @ M sha256:00298acdd3ba2d68d4fecb804c6c5b9cc65e61b0d88df335ac348f1b024bb8bb.
- That decision is "none" when `lastQueried` is null: frontends/shell/src/canvas/viewportBbox.ts:76-79 @ M sha256:969316ad0cab5dc9142a98a2d48348653c0cbe4008685fedce4fb16bccb07898.
- After the post-Apply auto-fit, `lastQueriedRef` is null, so a resize leaves the pre-fit box in place, and the window is not closed by a resize.
- After an open with no report yet, the ref is still null, so the option stays disabled.
- After a reported view with no fit since, a resize does report: "query" or "within", and both App handlers write the ref.
- Item 39's exception text: frontends/shell/../../KNOWN-LIMITATIONS.md, i.e. KNOWN-LIMITATIONS.md:369 @ M sha256:ade05ff3699847fc81592b239f647a4be3bb3b9338b4614efb3ef7196e647ade.

**Side observation, not traced further.** Item 39 says the exception follows an Apply or Clear "whatever its outcome". The lines read clear `lastQueriedRef` only through `resetFitForNewGeneration`, which runs only on an issued outcome, or through a non-notifying fit. A script count finds exactly these three writes of `lastQueriedRef.current` in WorkingCanvas.tsx at M: lines 1026, 1354 and 1535.

## 2. At the tag: does the same hold?

**Yes for Apply and Clear, and the same for an open.** For a resize, the code differs, and the tag is broader.

**The same as main** (several spans have the same hash as main):
- The ref is declared at frontends/shell/src/App.tsx:640 @ T sha256:2daa358861a63fab6d72d65f99577c21371241ec20612716b6708ef30196e50b.
- A script count finds 2 writers at T, against 3 at M:
  - the admit reset: frontends/shell/src/App.tsx:790-796 @ T sha256:5ed75a07879d64d2793c443f2d963ba65f6ef2bbb7f9c87159d4c8eb8b1ffe9d, called with null at frontends/shell/src/App.tsx:191 @ T sha256:d9da889dd4c2384279e786d75b59f0c33ae7d9710b8ead042cf8bf8cb62a6d63
  - `onViewportChanged`: frontends/shell/src/App.tsx:1388-1402 @ T sha256:4233f9d9468b9ad42eff2e8ce8514ff3d415d2aaa83999fc9723c35767c0fae3
- The Apply and Clear path is the same:
  - frontends/shell/src/filter/FilterPanel.tsx:66-69 @ T sha256:0f2b24de6cbe5c2637d1a2da350f1e936d6f0c5b7342b3ba02182e3e6951f7da
  - frontends/shell/src/App.tsx:1264 @ T sha256:119373bd8b1581be808361defd206df9b33649f6ddd2e39791b2e688bb0659ef
  - the reset only on "issued": frontends/shell/src/App.tsx:325-328 @ T sha256:bad32db5eed05cc63902ad10547a37afcf405faa1a4070f4022b44ed2e29bce4
  - frontends/shell/src/App.tsx:755 @ T sha256:a78116fd74b4d50a64cf71585b1a575d1517007532b0dd5397ccb74ad8a15153
- `resetFitForNewGeneration` clears the anchor and re-arms the auto-fit (there is no `lastQueriedRef`): frontends/shell/src/canvas/WorkingCanvas.tsx:1339-1342 @ T sha256:2d82fe58e0c302796eb8ae41bc7fdde8c2e1bf096aa478c069a9780f8a8ef91b.
- The auto-fit is `fitToExtent(..., false)`:
  - frontends/shell/src/canvas/WorkingCanvas.tsx:1285-1295 @ T sha256:c27ca0ad6214c9518162452c50c83da344fabdf2b9999483e97d2a47f4a85405
  - frontends/shell/src/canvas/WorkingCanvas.tsx:1486-1491 @ T sha256:e7ddf94ea821dadfad70c32803ecfe84a4368e97a2023814a6da1c915e442016
- `fitToExtent` reports only when `notifyViewport` is true: frontends/shell/src/canvas/WorkingCanvas.tsx:1157-1162 @ T sha256:6ed8cdad666a0e7e2c7c27d8f5da95cefadb3ab0137412b718ecd95fe75438b1.
- Zoom to layer notifies: frontends/shell/src/canvas/WorkingCanvas.tsx:1335 @ T sha256:8cc3bc160e9c7bc4d514869a0b245bb33a01f68e7a19a730489ce98ba2ffbe8d. The interactive handler reports: frontends/shell/src/canvas/WorkingCanvas.tsx:1760-1769 @ T sha256:747506ffb494aa750e5a5e7fc0b4a14eca4d962b66827397e36e9d8a60db2fb0. Script count: 3 `onViewportChangedRef.current(` sites at T (the fit, the interactive handler, the DEV seam).
- The panel is the same:
  - default "current": frontends/shell/src/publish/PublishPanel.tsx:326 @ T sha256:d6cb8b2ec7e6c0b7d1cd6c60f2bc2811414c1d7be0a5a0752b8b441f9ebac81b
  - disabled only by `!hasSettledView`: frontends/shell/src/publish/PublishPanel.tsx:36-37 @ T sha256:e4b5cfb8b1ecebb70cd76f47e66c1ee277aa243f34e8701bbcc4c87e455ed77a
  - the getter read at click time: frontends/shell/src/publish/PublishPanel.tsx:345 @ T sha256:4ec6b8a27bb61e0d3c89af4229342c6b51f2cb7be19c7f3e57fdf3fbdf81a54f
  - null refused: frontends/shell/src/publish/PublishPanel.tsx:53 @ T sha256:8928d3468d62807c467a87b1546778071e7daa06315cf8a72d7b09742728d597
  - the radio and reason, byte-identical to main: frontends/shell/src/publish/PublishPanel.tsx:579-594 @ T sha256:237750b17161d31fe7ab70095575a5e97ef32b303580987d7ca87d536c195c02
  - the button guard: frontends/shell/src/publish/PublishPanel.tsx:603 @ T sha256:da576a827d6b2609075e44862db2df26c6e549e09ffe8a9f8eb76def387a8652
  - keyed on the dataset: frontends/shell/src/App.tsx:1541-1548 @ T sha256:65adaeb11d5d8155fc3f1bd1140f84df46842048e3dde7926c24fd65a1fe3320

**How the code differs.**
- At T, WorkingCanvas has no `onResize`, `onViewportWithinLastQuery`, `viewportAfterResize` or `lastQueriedRef` (script counts 0, 0, 0 and 0). The prop doc says it fires "after every settled view-state change (pan, zoom, or an origin recenter)": frontends/shell/src/canvas/WorkingCanvas.tsx:439-441 @ T sha256:c4103377895ccc2f72c23e4f6b5c30f9efe3f105ff022f364b6d0e7ffb78287d.
- So at the tag no resize ever reports. The Current view box is stale after any resize, until the next pan or zoom, not only inside the post-fit window. At main the stale window after a resize is limited to the period after an open, an issued Apply or Clear, or an auto-fit.
- KNOWN-LIMITATIONS.md at T has no item 39 (script count 0). Its last item is 15.

## 3. The approval dialog

**It shows the bbox numbers, at both main and the tag.** PublishDialog.tsx is identical at T and M (`git diff --quiet` succeeded).
- The dialog renders the host's `row_scope` under the term "Row scope", plus `filter_scope` when present: frontends/shell/src/publish/PublishDialog.tsx:251-258 @ M sha256:5629d49c1673f3dccadf6471610531c109642023e9564097d59ad53b8fdff8dd, and the same lines and hash @ T.
- The host composes `row_scope` with the four numbers. The Current view arm's format is "row scope: the current viewport extent only (xmin {}, ymin {}, xmax {}, ymax {}) \" followed by "— not the whole file":
  - frontends/shell/src-tauri/src/publish.rs:124-135 @ M sha256:5b3088e1a740b7e19bf89e8aee875a00c86003bf858e2511d5a007b80d559d38
  - frontends/shell/src-tauri/src/publish.rs:115-123 @ T sha256:7a5fd0c71d14938e647caaef24c5336eacdb4961b74655bea279c2faad3078b8
  - The `ViewportBbox` arm is the same text at both. Only the WholeFile arm was re-wrapped.
- The numbers are the box the panel sent, the stale one in the case above. They are plain f64 values with no CRS name, and nothing marks whether they match the map.
- The outcome summary line names no box: frontends/shell/src/publish/PublishDialog.tsx:233 @ M sha256:cb7a1dbc65b52ab6abd74d202317d02cf0cc94acaae3eb4593dc72d42ebb5656, the same @ T.
- Before the dialog there is only the native save picker (`binding_publish_prepare`, `.save_file`, in frontends/shell/src-tauri/src/commands.rs at M). It shows no scope. I found no other approval step.
- The Export panel itself shows a label only ("Current view" / "Whole dataset"), with no numbers, at both revisions (pins in §1 and §2).

## For the node

**Facts the summary needs:**
- `lastViewportBboxRef` (the export's Current view) is written only at:
  - the admit reset (null)
  - `onViewportChanged` (pan, zoom, Zoom to layer, a resize that grows past the last-asked area, the DEV seam)
  - `onViewportWithinLastQuery` (a resize shrink; main only)
- The auto-fit after an open, and after an issued Apply or Clear (`resetFitForNewGeneration` re-arms it), moves the camera through `fitToExtent(..., false)` and reports nothing.
- After an issued Apply or Clear that follows any earlier report, Current view stays enabled. It is the panel's default, and the panel is not remounted by an Apply. The export sends the pre-fit box until the next pan, zoom or Zoom to layer. At main, a resize in that window also reports nothing, because `lastQueried` is null.
- After an open, there is no stale box: the ref is null and Current view is disabled with its reason until a first report.
- The approval dialog states the sent box's four numbers in the "Row scope" line. The panel shows only the label. With a filter active, the panel and the dialog also say the export "publishes the viewport extent, not your filter".
- Side observation: item 39's "whatever its outcome" is not matched by the lines read, where the reset runs only on an issued outcome.

**User-visible differences between main and the tag:**
- The Apply/Clear stale-box behaviour, the open behaviour and the dialog are the same at both.
- Resize differs: at the tag no resize ever updates the box, so it can be stale after any resize. At main only a resize inside the post-open, post-Apply/Clear or post-auto-fit window leaves it stale.
- Other differences are cosmetic labels in the panel: "Publish" became "Export", "Publish…" became "Export interactive map…", "Published." became "Exported.", main adds a placeholder purpose line, and the placement changed. The dialog text is unchanged.

## Files read
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (Amendment 2; line 948, Amendment 3 item 2)
- C:/dev/spatial-ide/state/consults/2026-10-11-shell-migration-milestone-2-amendment-2-architect-draft.md (Open questions)
- C:/dev/spatial-ide/frontends/shell/src/App.tsx (M and T)
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx (M and T)
- C:/dev/spatial-ide/frontends/shell/src/canvas/viewportBbox.ts (M; T export list)
- C:/dev/spatial-ide/frontends/shell/src/filter/FilterPanel.tsx (M and T)
- C:/dev/spatial-ide/frontends/shell/src/publish/PublishPanel.tsx (M and T diff)
- C:/dev/spatial-ide/frontends/shell/src/publish/PublishDialog.tsx (M; identical at T)
- C:/dev/spatial-ide/frontends/shell/src/publish/types.ts (M and T)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/publish.rs (M and T)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/commands.rs (M, `binding_publish_prepare`)
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md (M item 39; T item list)
