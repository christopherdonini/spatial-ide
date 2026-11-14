*Custodian's filing note (2026-11-14): the worker's report for milestone 4 PR B's colour-by phase, part 1 (PLAN node b1-shell-half; `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`), which stopped at its Step 0, the fill probe, on I1 (§5) before any code, from its brief by file (15995 bytes, sha256 dc74b189ebb9d338f5e79420eaed6a072a14b1f44e340bc9e2ace0f1f5e72284, written at 2026-11-14T10:47:21Z). Dispatched at 2026-11-14T11:01:09Z by its transcript; handed back at 2026-11-14T11:07:12Z (claude-sonnet-5-5, worker; calls Read 31, Bash 32, Edit 7 and the hand-back, 71 in all; none errored; its seven edits are the probe's type changes in the worktree C:/dev/wt/m4b, in `skp/types.ts`, `style/document.ts` and `canvas/decodeBatch.ts`, all reverted: the custodian read the worktree at 5b309b78 with an empty porcelain). The report below was extracted by script from the hand-back in that transcript (4650 bytes, sha256 9e29eed7631b5ce95f370c4f62b97977d66fce9823cbaad8b0652ad6daec027d). Nothing is changed. It is evidence for the form's Amendment 16, not Authority. After the second rule, the probe's typecheck output that the report names in the scratch folder (5523 bytes, sha256 7e7520bea0c9dd8998991690637489fe8b8b1a167fab778adc95db6b76cb76d4), with its line endings written LF by the custodian (5484 bytes, sha256 f13b05e1619ae61189688ed46f0991685f1dc9ac9c556dec8e58569f976d149a); nothing else is changed.*

---

Stopped: b1-shell-half PR B colour-by part 1 Step 0, the fill probe names off-list files (I1). I made no commit and reverted every probe edit. Nothing was pushed, because there was nothing to push.

**Where checks**
- **Form:** sha256 `f103188348cb8cddf6bfc5d4a63f7be3fe1c9c441ebe114267ce03a32ddd30dc`, 259728 bytes. `git log --oneline -1` on it gives 8ef2e18b, as the brief says. The brief's own size and sha256 matched (15995 bytes, `dc74b189…2284`).
- **Worktree:** HEAD is `5b309b78e14bb40109656cb4e0d7ee62abf79156` on `cut/b1-shell-half-pr-b`, porcelain empty. `ls-remote` gives 5b309b78.
- **Main since 08ce9935:** `git diff --name-only 08ce9935… origin/main -- frontends renderer kernel protocol engine docs/adr KNOWN-LIMITATIONS.md` prints `frontends/shell/e2e/pan-anchor.mjs` alone.
- **Rule (00):** the three branches name `PublishDialog.tsx` and `MANUAL-WALKTHROUGH.md`, kernel, protocol, engine, `.github` and `scripts/plan` paths, and `KNOWN-LIMITATIONS.md`. None is on my list.
- **Install and disk:** both `.package-lock.json` files exist. C: has 49 GB free, D: has 352 GB.

**Step 0: what I changed (all reverted)**
- **`document.ts`:** `StyleState` gained a required `fillMatch: FillMatch | null` (default `null`), and `StyleDocumentV0`'s `fill_color` widened to `LiteralValue<string> | FillColorMatch`.
- **`types.ts`:** `StyleSetParams`' `fillColor` value became `string | FillColorMatch`, with a new `FillColorMatch` wire type written from the `fill-match` fixture's shape.
- **`decodeBatch.ts`:** `ResidentBatch.attributes` became `BatchAttributes | NotHeldAttributes | null`, with `NotHeldAttributes = { kind: "not-held"; match: BatchAttributes | null }`. This is my chosen shape for OPEN-20 (a). `decodeBatch.ts` is not on the list, but `ResidentBatch`'s type lives there, so no not-held shape can be written without editing it.

`npm run typecheck` in `frontends/shell` gave rc=2 with 26 errors. It ran outside a hold, since it is one 20.6 s tsc process. The output is at `<S>/m4b-cb1-probe-typecheck.txt`.

**Sites tsc names** (file(line,col) TS code)
- **Off the list:**
  - `src/canvas/tileResidentSet.ts` (238,38) TS2367 and (239,33) TS2339
  - `src/canvas/tileResidentSet.test.ts` (98,28) TS2322
  - `src/canvas/tileIngest.test.ts` (637,49) TS2322
  - `src/canvas/WorkingCanvas.test.ts` (151,11) TS2741
  - `src/table/tableSource.ts` (218,24) TS2367, (219,56) TS2339 and (229,40) TS2322. This file is conditional, and Amendment 12 item 4 allows an edit only for the wait, so I count these as off the list.
  - `src/canvas/decodeBatch.ts`, which tsc does not name but my own type edit needs.
- **On the list:**
  - `src/attributes/values.ts` (61,25) TS2367, (62,32), (64,32), (65,22), (67,23), (67,51) and (68,16) TS2339, and (68,27) TS7006
  - `src/attributes/values.test.ts` (52,22) TS2322
  - `src/canvas/limits.ts` (83,69) TS2367, (83,116) TS2339, (89,25) TS2367, (89,67) TS2339 and (90,22) TS2322
  - `src/style/document.test.ts` (36,33) and (42,52) TS2339, and (128,13) TS2741
  - `src/workspace/viewTransitions.test.ts` (29,7) TS2741

**My reading of where the off-list names come from** (a paraphrase, not a form quote)
- `WorkingCanvas.test.ts:151` comes only from making `fillMatch` required. The two TS2741 sites on the list have the same cause. §2.3 (a) says "defaulting to `null`", and Amendment 3 and 4 made new members required, so I wrote it as required.
- Every other off-list site comes from the not-held shape change.
- `tileResidentSet.ts` around lines 237 to 262 builds a row map for the attribute block when it drops duplicates. `WorkingCanvas.withinAttributes` runs before ingest. A not-held batch that keeps a match column would therefore need the same row-mapping, so that file likely needs a real edit and not only a type fix.
- The custodian's class 9 amendment has to decide two things: whether `fillMatch` is required or optional, and which not-held shape to use. The fill list changes with both.

**State left**
- **Revert:** `git checkout -- frontends/shell/src/skp/types.ts frontends/shell/src/style/document.ts frontends/shell/src/canvas/decodeBatch.ts` returned rc=0. Porcelain is empty and HEAD is still 5b309b78.
- **Commits and mutations:** none. I ran no mutation and wrote no scratch file other than the typecheck output.
- **Status readings and holds:** none, because Step 0 needed none.
- **Branch:** `ls-remote` still gives 5b309b78.
- **Background shells:** none left.
- **Departures from the brief:** none. I skipped the final push because I made no commit.
- **Model:** Sonnet 5.5 (`claude-sonnet-5-5`), as the harness reports. I received and produced no context handoff.

---

```text

> spatial-ide-shell@0.1.0 pretypecheck
> node scripts/buildViewerFirst.mjs && npm run generate:notice


> spatial-bundle-viewer@0.0.0 build
> node build.mjs && node scripts/scan-dist.mjs


  dist\app.js  325.2kb

⚡ Done in 284ms
dist/index.html + dist/app.js + dist/NOTICE.txt + dist-metafile.json
scan-dist: 3 files scanned, 2 findings, all reviewed; record written
scan-dist: reviewed row NOTICE.txt credential 19092: matched
scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched
scan-dist: reviewed row app.js local-filesystem-path 7291: not found

> spatial-ide-shell@0.1.0 generate:notice
> node scripts/generateNotice.mjs

src/generated/NOTICE.txt (3506979 bytes)

> spatial-ide-shell@0.1.0 typecheck
> tsc --noEmit

src/attributes/values.test.ts(52,22): error TS2322: Type 'string' is not assignable to type 'BatchAttributes | NotHeldAttributes | null'.
src/attributes/values.ts(61,25): error TS2367: This comparison appears to be unintentional because the types 'BatchAttributes | NotHeldAttributes' and 'string' have no overlap.
src/attributes/values.ts(62,32): error TS2339: Property 'data' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'data' does not exist on type 'NotHeldAttributes'.
src/attributes/values.ts(64,32): error TS2339: Property 'data' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'data' does not exist on type 'NotHeldAttributes'.
src/attributes/values.ts(65,22): error TS2339: Property 'data' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'data' does not exist on type 'NotHeldAttributes'.
src/attributes/values.ts(67,23): error TS2339: Property 'rows' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'rows' does not exist on type 'NotHeldAttributes'.
src/attributes/values.ts(67,51): error TS2339: Property 'rows' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'rows' does not exist on type 'NotHeldAttributes'.
src/attributes/values.ts(68,16): error TS2339: Property 'names' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'names' does not exist on type 'NotHeldAttributes'.
src/attributes/values.ts(68,27): error TS7006: Parameter 'name' implicitly has an 'any' type.
src/canvas/limits.ts(83,69): error TS2367: This comparison appears to be unintentional because the types 'BatchAttributes | NotHeldAttributes' and 'string' have no overlap.
src/canvas/limits.ts(83,116): error TS2339: Property 'bytes' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'bytes' does not exist on type 'NotHeldAttributes'.
src/canvas/limits.ts(89,25): error TS2367: This comparison appears to be unintentional because the types 'BatchAttributes | NotHeldAttributes' and 'string' have no overlap.
src/canvas/limits.ts(89,67): error TS2339: Property 'bytes' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'bytes' does not exist on type 'NotHeldAttributes'.
src/canvas/limits.ts(90,22): error TS2322: Type 'string' is not assignable to type 'BatchAttributes | NotHeldAttributes | null'.
src/canvas/tileIngest.test.ts(637,49): error TS2322: Type 'string' is not assignable to type 'BatchAttributes | NotHeldAttributes | null'.
src/canvas/tileResidentSet.test.ts(98,28): error TS2322: Type 'string' is not assignable to type 'BatchAttributes | NotHeldAttributes | null | undefined'.
src/canvas/tileResidentSet.ts(238,38): error TS2367: This comparison appears to be unintentional because the types 'BatchAttributes | NotHeldAttributes' and 'string' have no overlap.
src/canvas/tileResidentSet.ts(239,33): error TS2339: Property 'rows' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'rows' does not exist on type 'NotHeldAttributes'.
src/canvas/WorkingCanvas.test.ts(151,11): error TS2741: Property 'fillMatch' is missing in type '{ fillColor: string; fillOpacity: number; outlineColor: string; outlineWidth: number; }' but required in type 'StyleState'.
src/style/document.test.ts(36,33): error TS2339: Property 'literal' does not exist on type 'FillColorMatch | LiteralValue<string>'.
  Property 'literal' does not exist on type 'FillColorMatch'.
src/style/document.test.ts(42,52): error TS2339: Property 'literal' does not exist on type 'FillColorMatch | LiteralValue<string>'.
  Property 'literal' does not exist on type 'FillColorMatch'.
src/style/document.test.ts(128,13): error TS2741: Property 'fillMatch' is missing in type '{ fillColor: string; fillOpacity: number; outlineColor: string; outlineWidth: number; }' but required in type 'StyleState'.
src/table/tableSource.ts(218,24): error TS2367: This comparison appears to be unintentional because the types 'BatchAttributes | NotHeldAttributes | null' and 'string' have no overlap.
src/table/tableSource.ts(219,56): error TS2339: Property 'bytes' does not exist on type 'BatchAttributes | NotHeldAttributes'.
  Property 'bytes' does not exist on type 'NotHeldAttributes'.
src/table/tableSource.ts(229,40): error TS2322: Type 'BatchAttributes | NotHeldAttributes | null' is not assignable to type 'BatchAttributes | null'.
  Type 'NotHeldAttributes' is missing the following properties from type 'BatchAttributes': names, data, bytes, rows
src/workspace/viewTransitions.test.ts(29,7): error TS2741: Property 'fillMatch' is missing in type '{ fillColor: string; fillOpacity: number; outlineColor: string; outlineWidth: number; }' but required in type 'StyleState'.
```
