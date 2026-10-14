Tag-side checks for item 44 (draft state/consults/2026-10-14-known-limitations-crs-epoch-edges-third-axis-architect-draft.md). This was read-only, using git show, git grep and git ls-tree only. The only writes were command outputs in my scratch folder. No edit, commit or push.

**Verdict: nothing found that makes §A's words untrue at the v0.1.0 tag. C3 to C11 all hold at T.** The code that matters is byte-identical between T and M, except for line numbers and two simplifications at T. Neither simplification undermines a clause.

T = b391e43622056324c56d35cc33065305140a8415. `git rev-parse v0.1.0^{commit}` gives T (rc 0). M = b9e7822938ec18394dbb4465c5bf471968f09582 (rc 0).

## The six T spans (in the source comment's order)
1. The geo reader: `engine/src/geoparquet.rs:46-114`
   - This runs from `pub struct GeoMeta` to the closing brace of `parse`, the same convention as M's 348-369 and 372-470.
   - Split form, if wanted: 46-54 for the struct, 57-114 for `parse`.
2. The axis order from the first two axes: `engine/src/geoparquet.rs:159-189` (`axis_order_from_projjson`)
3. The definition kept whole: `engine/src/geoparquet.rs:104` (`Some(crs.to_string()),`)
   - `crs` is bound to the whole `col.get("crs")` object at :100.
   - The tuple spans 102-106. A one-line pin matches M's :440.
4. The manifest's definition string and two-axis order: `kernel/src/publish/mod.rs:1254-1261`
   - 1254-1256 is the "Verbatim, as a JSON string" comment, 1257 is `crs_source_definition`, 1261 is `axis_order`.
   - Byte-identical to M's 1391-1398 (diff rc 0).
5. The viewer's string check: `renderer/bundle-viewer/src/manifest.ts:689-691`
   - The whole file is byte-identical at T and M (diff rc 0), so this is the same as M's pin.
6. The app's CRS line: `frontends/shell/src/admission/describeSummaryText.ts:17-28` (`crsSummaryLine`)
   - Byte-identical to M's 17-28 (diff rc 0).

## The checks

**D2.** I listed every `.get(` read in `engine/src/geoparquet.rs` at T with `git grep -n -E '\.get\(|one\("' T`: rc 0.
- In `parse` (57-114):
  - `version` :62
  - `primary_column` :68
  - `columns` :74, then the primary column by name :75
  - `encoding` :83
  - `geometry_types` :89
  - `crs` :98 and :100
  - `covering` and its `bbox` :111
- In `parse_covering` (117-132): `xmin`, `ymin`, `xmax`, `ymax` at :131, through :120.
- Inside the crs definition only:
  - `id` / `authority` / `code` :141-142
  - `coordinate_system` / `axis` :161-162
  - `direction` :174 and `name` :175, for axes 0 and 1
- `git grep -n -w -E 'epoch|edges' T -- engine/src/geoparquet.rs`: rc 1, no hits. The positive self-test on `covering|geometry_types` gave rc 0 with 13 hits.
- Neither `epoch` nor `edges` is read. GeoMeta at T has 6 fields; M has 8 (M adds `crs_key` and the column `bbox`). The extra two do not matter to C3.
- The open path's one read of `geo` at T is `engine/src/dataset.rs:264-266`; M's is 354-356.
- `engine/src/layout.rs:613-619` also reads `geo` through `GeoMeta::parse`. It is `#[cfg(feature = "fixture")]` (`lib.rs:90-91`), and that feature is enabled only under `[dev-dependencies]` in `kernel/Cargo.toml` and `src-tauri/Cargo.toml`. So it is not a product path, and it is gated the same way at M.

**D3.** `git grep -n -E 'coordinate_system|"axis"' T -- engine/src kernel/src frontends/shell/src frontends/shell/src-tauri/src renderer/bundle-viewer/src`: rc 0, 17 hits, all in `engine/src`.

| Hits | Classification |
|---|---|
| `crs-catalog.json:8`, `:21` | Data: the two pinned definitions, EPSG:2056 and EPSG:3857, each with two-axis coordinate systems |
| `crs_catalog.rs:26` | Module doc comment |
| `crs_catalog.rs:219`, `:221`, `:227`, `:230`, `:403` | `#[cfg(test)]` (the tests start at :193) |
| `fixture.rs:57` (doc comment), `:310` (a written fixture string) | Feature-gated test-support writer, not a reader |
| `geoparquet.rs:161-162` | **The one product reader** |
| `geoparquet.rs:165` | That reader's refusal message |
| `geoparquet.rs:212`, `:231`, `:240`, `:252` | Tests (the tests start at :191) |

- A wider scan over kernel, shell, src-tauri, viewer and protocol (`axis`, `axes`, `coordinate_system`, `coordinateSystem`) found no other reader of PROJJSON axes. That scan was rc 0 with 53 hits: prose, the deck.gl `COORDINATE_SYSTEM`, and axis-order strings.
- The axis-order function is 159-189.
  - It reads only `axes[0]` and `axes[1]` (:174-182).
  - Fewer than two axes is refused as `AxisOrderUnestablished` (:168-172).
  - There is no upper bound, so a CRS with more axes is accepted.
  - With no top-level `coordinate_system`, it is refused (:160-166). That covers the compound CRS.
- The asserted-definition path goes through the same function: `dataset.rs:293-298`.
- The definition is kept as the whole crs object at :100 and :104.
- `engine/src/lod.rs` does not exist at T: `git ls-tree` rc 0 with empty output. M has it.
  - `git grep -n -E 'build_tiers|mod lod|lod::' T -- engine kernel frontends/shell/src-tauri/src`: rc 1.
  - Positive self-test at M: rc 0, 91 lines.
  - So at T there is no every-axis reader and no `build_tiers` caller.

**D4.** I ran `git grep -n -E 'source_definition|axis_order|definition_json' T -- kernel/src/publish/mod.rs kernel/src/bundle/mod.rs`: rc 0.
- Publish:
  - `crs_source_definition` at :1257, inside 1254-1257
  - manifest `axis_order` at :1261
  - operation `axis_order` at :1148 (M :1277)
- Bundle:
  - Manifest fields at :687 and :691
  - The `crs` object at **737-756**, byte-identical to M's 794-813. Its members are source, source_definition (741-747, string or null), display, transform, crs_source, axis_order (:753), axis_normalization.
  - The operation digest's `axis_order` at :527 and :563
- The viewer's exact crs key set is `manifest.ts:86-88`, with `],` at :89.
- The string-only check is :691. The type loop is :694-695.
- The viewer's CRS line is `main.ts:219` (M :308): `${m.crsSource} → ${m.crsDisplay} · transform: ${m.crsTransform}`.
- `git grep -n -E 'source_definition|axis_order' T -- renderer/bundle-viewer/src`: rc 0. The only `source_definition` hits are `manifest.ts:87` and `:691`. `partition.ts:115` compares the envelope's `axis_order` with `'easting,northing'` (:29).
- The envelope metadata (`envelope.rs:72-87`) carries the identifier, source, asserted_by/at and axis_order. It carries no definition.

**D5.** The CRS line is `describeSummaryText.ts:17-28`: the asserted form at :22-25, the file form at :27, both ending `axis order ${crs.axis_order}`.
- `git grep -n definition_json T -- frontends/shell/src`: rc 0, 21 hits, 15 of them tests.
- The non-test hits:
  - `AdmissionPanel.tsx:310` and `crsAssertionState.ts:52`, `:78` build the outgoing assertion.
  - `console/recorder.ts:149` is a comment.
  - `skp/types.ts:34` and `:69` are types.
- No product file renders the describe payload's `definition_json`. The only consumer of `describe.crs` is `DescribeSummary.tsx:21`, through `crsSummaryLine`.
- The payload field is `kernel/src/skp.rs:547` at T (M :1891).

**Extra: D1 absence scan at T.** I ran this as supporting evidence; it was not in the brief's list.
- Positive self-test at M (`engine/src/descriptor.rs`): rc 0, which finds :383.
- `git grep -n -w -E 'epoch|edges' T -- engine/src kernel/src protocol frontends/shell/src frontends/shell/src-tauri/src renderer/bundle-viewer/src`: rc 0, 14 hits.
- The hits are the tile manager's issue epochs (`tileViewportStreamManager.ts`), two test titles about bbox "edges", and a whitespace comment at `kernel/src/permission/approval.rs:251`. None reads a GeoParquet member.

**D6, clause by clause (T against M):**

| Clause | At T |
|---|---|
| C3 | **Holds.** No `epoch` or `edges` read. T reads 7 members to M's 8; nothing depends on the difference. |
| C4 | **Holds.** Follows from C3. |
| C5 | **Holds.** `CrsInfo` (`types.ts:67-79`) has no such member. DescribeSummary (11-48) shows CRS, geometry, identity, row count, extent text, schema count and license. |
| C6 | **Holds.** Manifest crs members are byte-identical to M; viewer key sets identical; partitions are Arrow IPC (`bundle/mod.rs:26`). The bundle layout (:22-29) includes no copy of the source file. |
| C7 | **Holds.** Axes 0 and 1 only; fewer than two refused, more accepted. The unit reader is absent at T (M's 815-832), as the draft expected; the clause does not need it. A latitude-first CRS is refused at T (`dataset.rs:303-307`) where M overrides it; that does not affect the clause. |
| C8 | **Holds.** `AxisOrder::as_str` is `crs.rs:111-118` (names :113-116, M 152-155). The shell shows it at :24 and :27. Publish records it at :1148 and :1261, the bundle at :753, the describe payload at `skp.rs:555`. |
| C9 | **Holds, more simply than at M.** The only product reader is `geoparquet.rs:161-162` (indexes 0 and 1 at :174-175), and there is no `lod.rs`. |
| C10 | **Holds.** :100 and :104 re-serialise the whole crs object. |
| C11 | **Holds.** Publish 1254-1257 is byte-identical to M. Bundle 741-747. The viewer checks the definition is a string only (:691), and its CRS line (`main.ts:219`) does not read it. No publish refusal is based on the CRS. |

**D7.** I read `KNOWN-LIMITATIONS.md` at M (rc 0, 388 lines).
- Items in file order: 1-16, 29, 42, then 17-28 and 30-41 under "## On main since v0.1.0" (:196).
- Sorted, they equal exactly 1..42 (diff rc 0).
- `grep -E '\b4[34]\b'`: rc 1. The positive self-test on `\b4[12]\b` gave rc 0.
- **Neither 43 nor 44 is taken on main.** The placement claims hold: item 42's on-main paragraph is at :194 and the heading at :196.

## Notes that do not change §A's words
- The source comment's "Not covered" clause on `engine/src/lod.rs` / `build_tiers` is true on main only, because the file does not exist at T. It sits after the "On main" pins and names no revision, so it is not untrue. If exactness is wanted, it could say "on main".
- The architect's "the open path's one read of geo" is accurate as worded. `layout.rs` is a second, non-product reader of `geo` at both revisions.
- The action console (`console/recorder.ts`) records outgoing requests. An operator's own pasted assertion text can therefore appear there verbatim. That is the operator's input being shown, not a reading of the file's axes, and it does not contradict C9 or C11.
