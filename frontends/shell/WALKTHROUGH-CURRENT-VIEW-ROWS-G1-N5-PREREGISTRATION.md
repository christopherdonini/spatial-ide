# MANUAL-WALKTHROUGH.md rows G1 and N5: Current view is available once the map has drawn the file's data. Preregistration (full form)

File: `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md`

**Authority.**
- **The node:** PLAN node `walkthrough-current-view-rows-g1-n5`, `PLAN.yaml:5172-5188` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:96d07a4ade4ba47222a6d7dca42eadf8c1286b390f13dee3c6ff7170d41151c1. Its title is at `PLAN.yaml:5173` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:d675a62fc2c54ff025be166faae5bcac0b88ef5c07c33fa5823fc2b009261fcb and its summary at `PLAN.yaml:5187` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:215773186237dc3a34fa2f02fa524deb7cda6a2dd501df21a0a49472080b664a.
- **Placement:** the human's item 4, the docs lane, 1 of 6: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:14` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:736c1dce35a818ce004812943cdd87474fe974ec73379a63a7c0701470eff320.
- **The lane's terms:** `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:17-21` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:a93e0c9428a9f0e4364020919fcc8d31054d4d7b1030ff36c55b628190063707. The lane changes documents, comments and test names only (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:58d6c8e006c3d7a147debe6478ccb80a44fbad69c48f11d52fab7bfbeadd8f0d). Rule (00) applies against both slots and every PR awaiting merge (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:20` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:a26dbcc6949592e7a0b6e615557138d59b312719b4717287ff38f02277f1afcd).
- **The finding:** PR #219's gate-1 reviewer DOC-4, `state/consults/gates/2026-10-14-export-current-view-after-unreported-fit-gate1-reviewer.md:91-93` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:111bfdda54db649e637ebdb6d839d1c3d4a2570ce79e156f226afa2109be9c86. This is a record's cite into a filed report, so it is pinned with its hash (§25(b)).
- **The source piece:** `frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md`, read at 54d072687e79f8cb9a77ca942aa6809dad4e326b:
  - §2.6, which kept that piece's walkthrough edit to Part Y (`frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:181-197` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:08d5801f68f16e73b83f69ac50b86cea251396085c412f862cced1ae809716fb);
  - Amendment 7 item 5, which places this node (`frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:593` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c2608b7b9433607a5d904ad7fad0b6e7ac3f2a410593e1495431b7379a0a6261);
  - Amendment 4 item 1, where the human approved the disabled-reason sentence as drafted (`frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:545` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:518c6d5bf1737c42a8772421bd64698e11da4e250a7ea3e363f77ea5514edf76);
  - Amendment 8 item 5 (`frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:606` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:0d74b52ff23cae3dbf7007c895bf98313b3efd9bf5715af230c1fc234fd21367).
- **Verdicts:** proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording blocks follow the 2026-10-11 direction, item 2, and `AUTONOMY.md` §31.

**Drafted by** the architect, on the custodian's brief, at main 54d072687e79f8cb9a77ca942aa6809dad4e326b.

**These words are the architect's, not the human's.** One sentence quoted inside them is the human's: the disabled reason, approved on 2026-10-14. It is quoted unchanged.

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full form and full gating** (`AUTONOMY.md` §21a, §25(e)).
- By size, this piece is under §21c: 4 lines, 1 non-generated file besides the form and PLAN.yaml.
- But both rows restate a property currently under test, which is §21a category 4:
  - Current view's availability after an open is pinned by UPP1 (`frontends/shell/src/publish/PublishPanel.test.ts:61-67` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b529d68e86e1a71b79427f4bb94a83f2a022d7bd97a82760fff583fbd9ac86b1, `frontends/shell/src/publish/PublishPanel.test.ts:427-429` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c4607e46a88d43beec1aff8fd8bf0d6b9827afb1b468df49d0f32b6324e3401d), RCV3 (`frontends/shell/src/App.selection.test.tsx:767` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:3b3abf5f72b80aa6a99ce92b329c97784d52e20236d13b6c66f839d518af5e32) and E-CV-OPEN (`frontends/shell/e2e/export-view.mjs:92-103` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:4d065ee13993a7a80b3689f86c8105a660f94ed5ab69119405dde2ea53d6580c).
- A five-line `Out-of-scope` line would therefore have to name category 4. By §25(e), no five-line form is committed. This follows the precedent of `frontends/shell/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md` (its Gating paragraph).

**Reuse index (the standing step).** The brief carried no `tools/reuse.mjs` output. The custodian runs it (for example with "walkthrough current view") and appends the printed lines here, byte-copied by script and marked, with the tool's commit. A miss is noted and does not block.

*The custodian's insertion, before this form's commit: `node tools/reuse.mjs <words>` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, its output byte for byte. Both queries miss; the miss is noted and does not block.*

```text
$ node tools/reuse.mjs walkthrough current view
No prior art recorded for "walkthrough current view". Research it before planning an implementation.
$ node tools/reuse.mjs manual walkthrough rows
No prior art recorded for "manual walkthrough rows". Research it before planning an implementation.
```

## §0. Disclosure

- **Inputs:**
  - the node;
  - the source form's §2.4, §2.6, and Amendments 3, 4, 7 and 8;
  - DOC-4;
  - the walkthrough's Parts G, N and Y;
  - the shell code named in §2.1, read at 54d072687e79f8cb9a77ca942aa6809dad4e326b (call this C).
- **The base.** The code base B is the merge-base on main when the branch is cut.
  - The worker re-reads every cite at B.
  - A moved line is a class 3 row before code, and B's tree is authoritative for it.
  - A changed fact is an invalidator (§5).
- **Pins are historical.** Every `path:line at 54d072687e79f8cb9a77ca942aa6809dad4e326b` below is a read at C. The custodian pins it by script as `path:line @ <full id> sha256:<hex>`, contiguous on one line (round 15 (d), (e)).
- **Found beyond the node, marked (A):**
  - **(A1)** N5 carries seven further stale cites and one changed fact outside its Current-view clause (§2.3, OPEN-1).
  - **(A2)** G1 does not mention two lines the panel now shows: the purpose line at `frontends/shell/src/publish/PublishPanel.tsx:664` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:03498c57db5cae74856fa21099853738b59105bf3efd9ebd7b274bf0ae6a854d and the selection sentence at `frontends/shell/src/publish/PublishPanel.tsx:44` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:2bb87f00d31fda9cd4a03a276fe4b28c9ba6cd8076590ed920386ec5bbd480ed, `frontends/shell/src/publish/PublishPanel.tsx:695` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:e17d72b15e4d077e84e69b55873042850da910032ffff3c0636afdcd03591c17. Both are P6 placeholders. G1's text is not made untrue by this, since it lists what appears rather than claiming nothing else does. No row is written (§2.4).
  - **(A3)** Governance D's paths also include `scripts/plan/verify-quotes.mjs` and its test, conditionally (`scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:ce62cea8b0d6da493cd9d301f773d62a90243dc02485daa767299ef15d8e9567). The brief did not list them. They are disjoint from this piece.
- Nothing is measured, there is no fixture and no app run, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten span states what the shipped shell does at B, checked clause by clause in §2.1.
- **May not claim:**
  - any change to the code, a test, an assertion, or a string the app shows;
  - that the reason sentence's P6 sight is done (that is Part Y's Y4);
  - that Current view is disabled whenever the map has drawn nothing. Only the other direction is claimed: once the map has drawn the data, the option is enabled. A pan before the first batch also enables it;
  - any edit to Part Y, to `KNOWN-LIMITATIONS.md` or to an ADR;
  - any performance figure.
- **ADRs cited, none amended:** 006 (publishing is class 3; unchanged), 017 §8.

## §2. The change

### 2.0 Rules

- **(a)** New text cites by item name (const, function, component, file). It never cites by a bare `path:line`. Lines drift, and these rows are read months later.
- **(b)** Quotation marks wrap only text byte-copied from its source. Every existing quoted span in G1 and N5 stays byte-identical.
- **(c)** The reason sentence is byte-copied by script from `frontends/shell/src/publish/PublishPanel.tsx:71` at B, between its string quotes. The architect's copy below comes from a read. It is not the proof.
- **(d)** Each row stays one physical line. Only the span named in its row changes.
- **(e)** No backticked snake_case token with a test prefix (`a_`, `the_`, `it_`, …) is written in this form or in the rows, so `verify-test-claims` sees no new test claim.

### 2.1 Rows

**W-G1: Part G, row G1, the Expected outcome cell** (`frontends/shell/MANUAL-WALKTHROUGH.md:324` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:2ca686d429355fba246a8f4d6185162d926070d7d33e8ae3c0f73afb056f260c).
- **Stale span:** from "If the canvas has had no pan/zoom gesture yet" to "pan or zoom once and it enables." It says Current view stays disabled until a pan or zoom, with the old reason sentence. That sentence is no longer in the code: `CURRENT_VIEW_DISABLED_REASON` at `frontends/shell/src/publish/PublishPanel.tsx:70-71` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:4affb1368fa2fbe1022a2b165bab9159efdfc79531a6a76dd8e02d5bf95a66ab is the only reason string.
- **New span (the architect's words, not the human's; the quoted sentence is the human's, byte-copied per 2.0 (c)):**

  > With the file's data drawn on the map, **Current view** is enabled and no reason paragraph appears. After an open it is disabled only until the map draws the file's first data, or until a pan or zoom if one comes first. While it is disabled, a reason paragraph below the two options reads, verbatim, *"Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset."* (`CURRENT_VIEW_DISABLED_REASON` in `frontends/shell/src/publish/PublishPanel.tsx`, the human's words; Part Y's Y4 is their sight).

- **Clause check (at C):**
  - **"With the file's data drawn on the map, Current view is enabled":**
    - The first batch with geometry runs the automatic fit before it is drawn: baseline at `frontends/shell/src/canvas/WorkingCanvas.tsx:1531-1541` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c27ca0ad6214c9518162452c50c83da344fabdf2b9999483e97d2a47f4a85405, candidate at `frontends/shell/src/canvas/WorkingCanvas.tsx:1738-1742` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b2409c3b58d9415b89bff442cf8172b64d2d5d02313a4fc9a0ad7c22b1469452.
    - The fit's unreported arm calls `onViewShown` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1403-1408` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c9c00b590cf06caf49d50de2b5ee5216b148143dd2c8405a61eaf20395f5faed), which is App's `showBox` (`frontends/shell/src/App.tsx:2149` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:dbd5746b99c9f22a6634ddc26f3072af8ca298f74eca887f274fe3f4b223529b, `frontends/shell/src/App.tsx:2127-2129` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:865844271ffb755e59a5d7b8c6a81eb47a73c1c82bd35dbd8f83247e43966415, guarded on the live dataset).
    - The store notifies its listeners (`frontends/shell/src/feature/FeaturePanel.tsx:31-34` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:7dcb8c5e075b847f3f6f9f602cd41c3ed097a86b4f3d77e2310ad25da32462ff). The panel's availability is `getViewBox() !== null` (`frontends/shell/src/publish/PublishPanel.tsx:382` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:f8deaa9d7aefe47ebe7d4e0eda3b786a9dafee0a1f1340c81598623954f9a785), so `currentViewOptionDisabled` returns false (`frontends/shell/src/publish/PublishPanel.tsx:65-67` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:85c0130cfa0241c556818c69795cd482fdcb7c75646f822ce89a35c27ef8a945) and the radio is enabled (`frontends/shell/src/publish/PublishPanel.tsx:683` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:86266f6514ddc6682a809c392e2d3fe46ad8a5272992d7a167889592c9edee09).
    - Proven by RCV3 and E-CV-OPEN (Gating).
  - **"no reason paragraph appears":** the paragraph renders only when the option is disabled (`frontends/shell/src/publish/PublishPanel.tsx:688-690` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:5fa25c880317ad095841adc91d1413f3b757ed3504d47bc46271ea0604fd9b2a). Proven by the UPP1 render case (`frontends/shell/src/publish/PublishPanel.test.ts:427-429` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c4607e46a88d43beec1aff8fd8bf0d6b9827afb1b468df49d0f32b6324e3401d).
  - **"After an open it is disabled":**
    - `handleAdmitted` empties the box (`frontends/shell/src/App.tsx:1107-1108` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b55fc96fae17f9c179ae831378b89749feab26b87f207fa3e2b6b6e62efa1590). The panel is re-keyed per dataset (`frontends/shell/src/App.tsx:2377` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:01e6e3c934fc616c0d5034417accd6066deb28035b5458ef25730c72ad973c24). The store starts empty (`frontends/shell/src/feature/FeaturePanel.tsx:27` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c6dda77b7fa0e564522a4686359cee6487a654b86e9b0bd985f695219c16ff19).
    - Proven by RCV2 (`frontends/shell/src/App.selection.test.tsx:750` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c5578e10ef1fa1606cd686061df50f2f146d0f49033e70bb69a22312ce1699e6).
  - **"only until the map draws the file's first data, or until a pan or zoom if one comes first":**
    - The box is set only through `showBox`, from three callbacks (`frontends/shell/src/App.tsx:2149` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:dbd5746b99c9f22a6634ddc26f3072af8ca298f74eca887f274fe3f4b223529b, `frontends/shell/src/App.tsx:2195` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:3a50103e4cfa5d16685af6f7ff797a92f49194148f529917b7fe37976a97e146, `frontends/shell/src/App.tsx:2206` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:3a50103e4cfa5d16685af6f7ff797a92f49194148f529917b7fe37976a97e146). It is cleared only at the admission (`frontends/shell/src/App.tsx:1108` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:2871fc752f3157a0208667f41ab8d4604fa893234285d0ed0b54794ed8c634e7).
    - Before the first data, `onViewShown` cannot fire from a resize: the camera is null (`frontends/shell/src/canvas/WorkingCanvas.tsx:1056` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:0ef738c8d49c82193abdf70064ae9967061c8151a9d49a635120804127349ffd), and the resize branch needs it (`frontends/shell/src/canvas/WorkingCanvas.tsx:2041` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:a061efba06923f5fe3471e63bd28a57e48f30e3ccf7f9a6eb913cf5c5c2093c3). The camera is written only by the fit (`frontends/shell/src/canvas/WorkingCanvas.tsx:1391` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:3e8803d41ecee52f8bbae5f149c95ec5c4312d93b09efdffe7a6aa08a566a7ac), a view-state change (`frontends/shell/src/canvas/WorkingCanvas.tsx:2081` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:d3a2c4f75c4992e18a038f56b6248f3411e54c1375e1957818ea50814e50b5f2) and the dev seam (`frontends/shell/src/canvas/WorkingCanvas.tsx:2313` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b962592dc52c9cae1f68df8c093052666340a781c4207f58601aede582ca10a6).
    - Every operator route that reports before the data is a pan or zoom: interactive input (`frontends/shell/src/canvas/WorkingCanvas.tsx:2049-2119` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:068d4f65874eff32db56fe0c776d81136915a4a0a1884988bfa53a4f754cdef5 → `frontends/shell/src/canvas/WorkingCanvas.tsx:2108-2118` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2 → `reportViewport` `frontends/shell/src/canvas/WorkingCanvas.tsx:1062-1065` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:7a15ffb85f4a4db6dc1c062c969ce66547fec2a7204876731adedf51c3c2c2b0), and Zoom to selection through `fitToBbox` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1585-1587` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:a64de487b8741edfd9a809f1621f91772f175b12621dfd755f49fec13710da05). Zoom to layer does nothing before data, because its anchor is set only by batches (`frontends/shell/src/canvas/WorkingCanvas.tsx:1574-1575` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:6ec7573e7b69f5871553a1d699e2f00f2592097942bdfd05f7baa324003c406f).
    - The within-report needs a prior report (`frontends/shell/src/canvas/WorkingCanvas.tsx:2040` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:f2531473ff17012fbf3a4627b06a62abf2a28c7a537f752de29ae15a59e574cd, `frontends/shell/src/canvas/WorkingCanvas.tsx:1063` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c6b9e011107412e00bd18d6887e290d5810dfebec5b56be9e376cbbb477c3212).
  - **"a reason paragraph below the two options reads … verbatim":** it is the `<p>` after both radios inside the fieldset (`frontends/shell/src/publish/PublishPanel.tsx:667-690` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:1000ef1061f290b08e4b8daab2552139c6be3fcf409925e495b5059af25abd3d). The string is `frontends/shell/src/publish/PublishPanel.tsx:71` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:1c32c3322260a0d9e68a84443f8fdf3cb8258689a677a6ee3faa9bdae015c3b5. It is byte-equal to the human-approved draft in the source form's §2.4 (its line 161 at C) and asserted by UPP1 (`frontends/shell/src/publish/PublishPanel.test.ts:428` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:096153ad7b8b39fce42660e10d937eb471026899a9c836e1b8dc5acea00b6f98).
  - **"Part Y's Y4 is their sight":** `frontends/shell/MANUAL-WALKTHROUGH.md:1866` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:fc69528ea5c1e326198cfc5e554a5b8ff8c03344268cc4926d8c4f88d75d56f4.
  - **Named, not blocking (dev-only):** the dev seam `e2eSetViewState` (`frontends/shell/src/canvas/WorkingCanvas.tsx:2313` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b962592dc52c9cae1f68df8c093052666340a781c4207f58601aede582ca10a6) also enables the option with no pan.
  - **Unchanged in G1:** everything else in the cell, including "(checked by default)", which still holds (`frontends/shell/src/publish/PublishPanel.tsx:381` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:d6cb8b2ec7e6c0b7d1cd6c60f2bc2811414c1d7be0a5a0752b8b441f9ebac81b).

**W-N5: Part N, row N5, the Step cell's parenthetical** (`frontends/shell/MANUAL-WALKTHROUGH.md:948` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b13f7cf032a07637052e7aa5afa12dc15bdeb9c3374e08b5d6b6d0cf90e5657b).
- **Stale span:** the parenthetical after "click the **Whole dataset** radio", from "(Current view starts selected by default but disabled" to "`:569-578` is Whole dataset)".
  - Its "disabled with no settled view yet" is untrue (W-G1's facts).
  - Its three line cites no longer read. The default is at `frontends/shell/src/publish/PublishPanel.tsx:381` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:d6cb8b2ec7e6c0b7d1cd6c60f2bc2811414c1d7be0a5a0752b8b441f9ebac81b, the Current view radio and its reason at `frontends/shell/src/publish/PublishPanel.tsx:677-690` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:fdad0419432a5a266fbee462914bd43c063840714808a4c9fdeddf998bcfbd75, and Whole dataset at `frontends/shell/src/publish/PublishPanel.tsx:667-676` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b06081552179ca24596a1008a3a15d7cfcfa9117671417c27146976ad0e9bd17.
- **New span (the architect's words, not the human's):**

  > (Current view starts selected by default and, as in G1, is enabled once the map has drawn this file's data; this row chooses Whole dataset instead — `PublishPanel`'s scope starts at Current view, and `PublishControls` renders the two radios, Whole dataset never disabled, both in `frontends/shell/src/publish/PublishPanel.tsx`)

- **Clause check (at C):**
  - **"starts selected by default":** `useState<PublishScopeChoice>("current")` (`frontends/shell/src/publish/PublishPanel.tsx:381` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:d6cb8b2ec7e6c0b7d1cd6c60f2bc2811414c1d7be0a5a0752b8b441f9ebac81b), re-keyed per dataset (`frontends/shell/src/App.tsx:2377` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:01e6e3c934fc616c0d5034417accd6066deb28035b5458ef25730c72ad973c24), so a fresh reopen starts there.
  - **"as in G1, is enabled once the map has drawn this file's data":**
    - W-G1's chain.
    - The degrees file is drawn: every admitted view mounts a `WorkingCanvas` with no CRS condition (`frontends/shell/src/App.tsx:2123-2132` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:a7a95f13bacc0808ea76c80eaf17ba70052da5baab91664bc42a2c9584263ed2).
    - N1's file is admitted, not refused (N1's row).
  - **"Whole dataset never disabled":** its input has no `disabled` attribute (`frontends/shell/src/publish/PublishPanel.tsx:668-674` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:7fe60347f54437df76105a53dc40d0989ee1e735bac31cdbc161d059009f7eca).
  - **"`PublishControls` renders the two radios":** `frontends/shell/src/publish/PublishPanel.tsx:647-690` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:8f012ab68b1846a393ae496f49ad615e45388ac01fc45720cfcad252800f591b.
- **Unchanged in N5 (without OPEN-1):** everything else, every quoted span included.

### 2.2 In place

Both rows are edited in place, and no Part is renumbered. No record under `state/` is edited. Part Y is not touched.

### 2.3 OPEN-1 (applied only on the human's yes; a yes is class 9, a no is class 5): N5's other stale cites (A1)

- **The change on a yes:** each item below is re-aimed in place under 2.0 (a), and no other claim in the row changes. The row stays one line, so §7 is unchanged.
- **The items, as they stand in the row → what reads at C:**
  1. "computes the degrees check (`ds.crs().identifier()` and `CoordinateUnitSource::as_str`, `kernel/src/publish/mod.rs:435-443`)" is **a changed fact, not a moved line.** The check is answered from the recorded unit: `ds.is_geographic_degrees_instance()` (`kernel/src/publish/mod.rs:471-474` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:1a9149bc54eef523c77be6138edc088e183fd8d875a73e9c0f7bd726e58127ce; `engine/src/dataset.rs:1040-1043` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:6164b6a3059a5bf8343ed5b11e626027e64688a165c072dba4bba203e721e7fc). The identifier and `as_str` only fill the message (`kernel/src/publish/mod.rs:475-484` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:0cafc0a35d5071853a32011a39addce29fc7c040cbd406697d368754e8b18616).
     - New words: "answers the degrees check from the dataset's recorded coordinate unit (`Dataset::is_geographic_degrees_instance`), and fills the refusal's two placeholders from `ds.crs().identifier()` and `CoordinateUnitSource::as_str` (both in `preflight_pinless_parts`, `kernel/src/publish/mod.rs`)".
  2. `frontends/shell/src-tauri/src/publish.rs:404-409`: the preflight call in `prepare_with_progress` is at `frontends/shell/src-tauri/src/publish.rs:422-429` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:a186cc444a61d66ea200997e5bdc98b378f03c719d4b0e28ddbc9702ca157f53. The new words name `prepare_with_progress`'s pin-free preflight, with no line.
  3. `ShellApproval::new`, `:694`: now `frontends/shell/src-tauri/src/publish.rs:790` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:b2dc7eee345b7167d5184f568ead77442783dc41546ab5d92a22e76f92fe7b40. The line is dropped and the name kept.
  4. `frontends/shell/src/publish/PublishPanel.tsx:652` (`RefusalBlock`): now `frontends/shell/src/publish/PublishPanel.tsx:750` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:5b75e85c10ca01e4b396d39b7f57107a77bf4f385b144de92dca316877bc609e. The new words name `PublishPanel`'s refused state.
  5. `kernel/src/publish/mod.rs:436-442` (the placeholders): now `kernel/src/publish/mod.rs:476-483` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:d8c29225ec3c7bebd0463621a3816b8d28278074b969ffa08ad15b7cc9922949. The new words name `preflight_pinless_parts`. `engine/src/geoparquet.rs:257-258` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:66ee765a4eba9fea6c56a5dbac844601fb35c5a57d7a9be0f54a80d25263d2c0 still reads and is kept.
  6. `kernel/src/publish/error.rs:323-331` (the message): now `kernel/src/publish/error.rs:391-398` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:6a0864eb5ccd0ef72843cffb931ee1b24dbd474acce54c6c344766894ad97ef7. The new words name `GeographicCrsNotPublishable`'s `Display` in `kernel/src/publish/error.rs`. The quoted message is byte-identical at C, filled.
  7. `formatRefusal.ts:107-114` (the guidance): now `frontends/shell/src/admission/formatRefusal.ts:118-125` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:43a07a7e7bb7d2752feaab01104e917c063212ff1864122d2bb60bacf7a02f54. The new words name the `publish.geographic_crs_not_publishable` case of `formatRefusal.ts`. The quoted guidance is byte-identical at C. "no test asserts it verbatim" still holds: `formatRefusal.test.ts` names the code only, at `frontends/shell/src/admission/formatRefusal.test.ts:201` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:a28f1909958060143d6de9691f4782fd93492c33e1d530cfadddfac60d293d2c.
- **Still reading, kept:** `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:535-539` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:cf0b9fd8e7d3600fc049d0996ad234cec8fb060fcd80bf0368ae4744dbd226ec.
- **Recommended: yes.** Without it the row's Current-view clause is current while its refusal-path cites point at wrong lines, and item 1 misstates what decides the refusal. It is words only, inside the lane.

### 2.4 Not changed, recorded

- The purpose line and the selection sentence G1 does not mention (A2).
- Part G's coverage table, row `OPEN` at `frontends/shell/MANUAL-WALKTHROUGH.md:390` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:4f5474a06bf4f093d179bcb6e79236e84373ed6f39e96d876939a66daee33ad5, is still true: `OPEN` never touches the panel.
- The historical result-log line at `frontends/shell/MANUAL-WALKTHROUGH.md:1118` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:7d546976a978de99feba95694b8e8205bb96d14a5c80e0341d720e198bffb877 is a record of a past sitting and is not edited.

### 2.5 Overlap (rule 00), walkthrough Parts counted as separate paths

- **This piece's paths:**
  - P1: `frontends/shell/MANUAL-WALKTHROUGH.md` Part G (row G1);
  - P2: the same file's Part N (row N5);
  - P3: this form;
  - P4: PLAN.yaml, with the files `queue.mjs` and `site.mjs` regenerate (`CUSTODIAN-QUEUE.md`, `CUSTODIAN-QUEUE.json`, `site/`).
  - Nothing is under `protocol/`, `scripts/plan/` or `state/drafts/`.
- **Governance D (PR #237; the D form's paths at `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:ce62cea8b0d6da493cd9d301f773d62a90243dc02485daa767299ef15d8e9567):**
  - `scripts/plan/rotate-plan-summaries.mjs` and its test, `scripts/plan/verify-quotes.mjs` and its test (conditional), `scripts/plan/README.md` and `AUTONOMY.md` are disjoint from P1 to P4.
  - At S10, PLAN.yaml, `CUSTODIAN-QUEUE.*` and `site/` overlap P4. `state/cut-archive/` and `state/drafts/` are disjoint.
  - **The resolution, under D's OPEN-5 (B)** (D's Amendment 1 item 5; D's Amendment 8 item 3: S9, then S10, under it). From D's S9 to its click, every commit touching PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` is held. Therefore:
    - (a) the branch's walkthrough commits may be made at any time;
    - (b) the node's in-progress edit on main lands before D's S9 or after D's click, never between them;
    - (c) this piece's done commit and its merge come after D's click, and the branch merges main first (§23 regeneration). This piece does not merge before D's S9 either: going done would add a done node with a summary over 300 bytes to D's S10 candidates. That node is on no row of D's resolved sheet, and it would change the counts D's gate 2 recorded (D's Amendment 6 item 1).
- **Slot 1** (`bundle-redaction-scan-not-in-product-publish`, form not yet drafted): if its form edits a Part G row, P1 is shared. That is re-checked at dispatch, and the later piece waits.
- **Slot 2** (`b2-piece-1c-save-and-reopen`, form ahead, not in code): no known overlap. Re-checked at dispatch.
- **Rule 00 is re-checked at dispatch** against both slots and every PR awaiting merge.

### 2.6 Portability

No OS-dependent feature. R3 does not apply.

## §3. Fixtures

None.

## §4. Tests

- No test is added, renamed or changed, so no mutation is owed. No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Evidence at H, each by script with its exit code checked:**
  1. `git diff -U0 B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` has exactly two hunks. Each removes and adds one line, one starting `| G1 |` and one starting `| N5 |`.
  2. The reason sentence extracted from row G1 equals the string at `PublishPanel.tsx`'s `CURRENT_VIEW_DISABLED_REASON` at H, byte for byte.
  3. Outside the two named spans (and OPEN-1's items on a yes), each of the two lines is byte-identical between B and H. The script diffs the lines with the spans masked.
  4. The old reason sentence, "No settled view yet", has zero occurrences in `frontends/shell/MANUAL-WALKTHROUGH.md` at H. Each search pattern is self-tested positive at B.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predicted:**
  - E1: §4's items 1 to 4 hold.
  - E2: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0 at H and in the done commit, each named with the tool's commit. `queue.mjs --check` and `site.mjs --check` report current. The `node --test` scripts suites exit 0.
  - E3: PR CI green.
- **Declared unchanged:**
  - every file but P1 to P4;
  - every row but G1 and N5;
  - Part Y;
  - every quoted span in both rows;
  - all code, tests and strings the app shows;
  - every record under `state/`.
- **Invalidators (stop and report):**
  - at B, availability is no longer `getViewBox() !== null`, the reason string differs from `frontends/shell/src/publish/PublishPanel.tsx:71` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:1c32c3322260a0d9e68a84443f8fdf3cb8258689a677a6ee3faa9bdae015c3b5, the box gains a writer or a clearer, or the fit no longer reaches `onViewShown`;
  - a new span would need a code, test or string change;
  - a cite fact changed at B, as opposed to a moved line.
- **Falsified if** a rewritten clause is shown untrue at B in the shipped app.

## §6. Instruments

Assertions only (§4, E1 to E3). No measurement. No operator step for this piece. The rows themselves are read at the next sitting with Parts G and N.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H -- frontends/shell/MANUAL-WALKTHROUGH.md`, insertions plus deletions. B and H are named in the PR body.
- **Ceiling:** at most 4 lines (G1 1+1, N5 1+1). OPEN-1 on a yes adds 0 lines, because it edits the same N5 line.
- **Files:** `git diff --name-only B...H` lists at most this form, `frontends/shell/MANUAL-WALKTHROUGH.md`, PLAN.yaml and the generated `CUSTODIAN-QUEUE.*` and `site/` files. That is at most 3 non-generated files.
- **Budget:** 30 minutes. The node carries `budget_minutes: 0` (`PLAN.yaml:5183` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:c730f3011e042a625d9c690c7788c2b43d4da2c96dbe5a78331dddbac9c8fd61), and the custodian sets 30 in the commit that marks it in progress.
- **No constant is added.** An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. A changed line other than the G1 and N5 lines, or a span changed outside §2.1 (and OPEN-1 on a yes).
2. Any code, test, assertion or app-string change, or anything under `scripts/plan/`.
3. A quotation not byte-copied, or a byte changed in an existing quoted span. A reason sentence unequal to `CURRENT_VIEW_DISABLED_REASON` at H is a verbatim-quote failure of the human's words, so it is Correctness.
4. A new clause claiming more than its cite shows, in particular that Current view is disabled whenever nothing is drawn, or that Y4's sight is done.
5. A new bare `path:line` in a rewritten span, a pin split across lines, or a pin at a branch commit.
6. OPEN-1's items applied before the human's answer.
7. PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` committed to main between D's S9 and its click, or this piece merged before D's click (§2.5).
8. A §7 overrun not recorded as class 8, or §7 edited.
9. A scope addition not recorded as class 9 before its code.
10. A record calling a `verify-mutation` run an observation of a mutation.
11. A record under `state/` edited.

## §9. Gates

- **Architect and reviewer, full gating.**
  - The architect checks each clause of §2.1 against the code at B, then §8 item by item.
  - The reviewer checks the diff, §4's items by script, and E1 to E3.
- **Verdicts are proportional** (product-first, section 2). A clause's truth and the verbatim reason are Correctness. E1 to E3 are Evidence. Documentation findings are fixed before the merge, with no re-gate.
- **Wording rule (the 2026-10-11 direction, item 2; §31):** the new spans are not the human's wording. A gate's replacement words are applied with no re-gate and listed in the PR body. The quoted reason is the human's, and it is not reworded here.
- **Briefs:** there is no build and no app run. If the custodian classes the `node --test` suites as heavy, the brief carries THE MACHINE paragraph as written (`state/directives/2026-10-06-machine-script-adopted.md:12-22` @ 54d072687e79f8cb9a77ca942aa6809dad4e326b sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1).
- **Operator:** none for the piece. No KNOWN-LIMITATIONS item is added or edited.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9. A yes to OPEN-1 is class 9, and a no is class 5.

## §11. Open items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | N5's seven other stale cites and one changed fact (§2.3), re-aimed in place, words only | yes | no |

## Amendment 1 — committed: the human's yes to OPEN-1 (class 9); the reuse step and the pins (class 1)

*Written by the custodian before any code. References only: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`, its last line.*

1. **OPEN-1: yes.** §2.3's seven items are in scope from this commit, before any code. §7 is unchanged: they edit the same N5 line.
2. **The reuse step** (the Reuse index paragraph): run by the custodian before this commit and inserted there, marked. Both queries miss.
3. **The pins.** Each cite read at C is pinned by script at 54d072687e79f8cb9a77ca942aa6809dad4e326b, with the sha256 of its lines; short file names are expanded to their repository paths. Left as written: the cites §2.3's items 2 to 7 give as they stand in row N5, the cites inside quoted row text, and §2.0 (c)'s cite at B. Of the pinned files, 1 changed between C and ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f (scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md, by an append below the pinned lines).
4. **Order (§2.5):** the branch's commits may be made now. The node's in-progress edit, with §7's 30-minute budget, lands on main after governance D's click, and this piece merges after that click.
5. **Rule 00 at this commit:** disjoint from governance D's branch paths, except §2.5's held PLAN edits; from the redaction scan's drafted paths (no walkthrough row, its draft's §9); from milestone 4's drafted paths (a new Part only, edits neither G nor N); from piece 1c's draft (no walkthrough Part); and from ADR-036's block (one ADR file).

Nothing above is edited.

## Amendment 2 — gate 1 complete: both PASS (class 1); written after both gate reports were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-21-walkthrough-current-view-rows-g1-n5-gate1-architect.md` (gate-log 572) and `state/consults/gates/2026-10-21-walkthrough-current-view-rows-g1-n5-gate1-reviewer.md` (gate-log 573).*

1. **Gate 1** at b936965497436c210589de0226c105b3fce7a84c: the architect and the reviewer PASS, with no finding. No words are owed.
2. **Next (§2.5):** after governance D's click, the branch merges main in, the node's in-progress edit and its done commit with `{pr: 239}` follow, and the PR leaves draft for the human's click.

Nothing above is edited.
