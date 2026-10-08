# J-TABLE — the feature table in Activity (milestone 4, `b1-shell-half`), Round 1

Researcher: Claude (archaeology track), 2026-10-08. Spatial IDE read at `4561f3b` (read-only). `pr190` does not touch `frontends/shell/src/streaming/`, `engine/src/stream.rs`, `engine/src/pool.rs`, `protocol/data-plane/` or `kernel/src/skp.rs`: `git diff --stat main pr190` on those paths is empty. Candidates are under `~/spatial-ide-archaeology/candidates/j-table/`. Nothing was built, installed or run.

---

## 1. Spatial IDE facts relied on (at `4561f3b`)

**The task**
- Milestone 4 is attributes of the inspected feature, colour by category, and "the table, in Activity, with 'features' and the three scope options of §3". The open question is "where the table's features come from … a second consumer of the dataset's four stream connections … proposes no new SKP command without the human's ruling" (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:233-241 @ 4561f3b8`; `PLAN.yaml:2353-2369 @ 4561f3b8`).
- The three scopes are Filtered (the layer's filter as applied), Selected (selected features that pass the filter) and Selected, ignoring filter (every selected feature) (`SHELL-MIGRATION-PLAN…:50-52`).
- Rules that bind the form:
  - no new dependency (`:25`);
  - landmarks, ARIA and full keyboard reach are acceptance items (`:32`);
  - a selection is a set of feature ids bound to a view, a resource and a generation, with a declared ceiling (`:176-182`).
- Shell dependencies: `react ^18.3.1`, `apache-arrow ^21.2.0`, plus deck.gl and Tauri. There is no grid or virtualisation library (`frontends/shell/package.json:41-50 @ 4561f3b8`).

**`viewport_query` as it stands**
- Wire shape: `{ skp, dataset, bbox, bbox_crs, limit, filter, columns }`. There is **no offset, order or key parameter** (`frontends/shell/src/skp/types.ts:253-265 @ 4561f3b8`; `protocol/skp/SKP-V0.md:1092-1100 @ 4561f3b8`).
- The shell sends `columns: null` today (`frontends/shell/src/skp/client.ts:106-124 @ 4561f3b8`).
- `columns` holds at most 32 names (`MAX_PROJECTED_ATTRIBUTES`, `protocol/skp/SKP-V0.md:1124 @ 4561f3b8`; `engine/src/attributes.rs:70 @ 4561f3b8`).
- The admitted attribute types are utf8 (three Arrow variants), boolean, the 8/16/32/64-bit signed and unsigned integers, float32 and float64, and a dictionary over one of these (`engine/src/attributes.rs:78-101 @ 4561f3b8`).
- With a projection, the batch schema is `[id, geometry, ...columns]`, with `id` at column 0 (`protocol/skp/SKP-V0.md:1102-1110 @ 4561f3b8`).
- **The viewport path is unordered by design.**
  - `RowOrdering::Unordered` emits no `ORDER BY`, because "ordering would materialize the entire result before the first batch" (`engine/src/stream.rs:565-578 @ 4561f3b8`, `:1704-1712`).
  - Only publish uses `ByIdentityAscending`.
  - The filter admission refuses `ORDER BY`/`LIMIT` modifiers inside a predicate (`engine/src/predicate.rs:799-803 @ 4561f3b8`).
- The filter is a predicate only. `IN` takes a literal list (`protocol/skp/SKP-V0.md:442-447 @ 4561f3b8`), and a predicate is at most 4,096 bytes (`engine/src/predicate.rs:59 @ 4561f3b8`).
- The filter namespace is built from `dataset.file_schema()` (`engine/src/predicate.rs:1142-1160 @ 4561f3b8`). `file_schema` comes from `SELECT * FROM read_parquet(?) LIMIT 0` (`engine/src/dataset.rs:1100-1115 @ 4561f3b8`).
  - The session-ordinal identity's source column is `file_row_number` (`engine/src/identity.rs:77 @ 4561f3b8`, `:92-97`).
  - *Inference, not tested:* a `SELECT *` probe does not include DuckDB's virtual `file_row_number`. If so, `id IN (…)` cannot be written for a session-ordinal dataset, while for a native `id: UInt64` column it is admitted (`UBIGINT` surrogate, `engine/src/predicate.rs:1265-1277 @ 4561f3b8`).
- DuckDB settings:
  - The engine's connection configuration sets only the extension and geoparquet settings (`engine/src/pool.rs:185-187 @ 4561f3b8`). `preserve_insertion_order` keeps DuckDB's default, `true`, which "if set to false … the system is allowed to re-order any results that do not contain ORDER BY" (`duckdb/duckdb@f2f9329 src/include/duckdb/main/settings.hpp:2181-2190`).
  - *Inference:* an unfiltered or filtered unordered scan of an unchanged single file therefore returns rows in file order, and position k is reproducible within a generation. This is not pinned by any Spatial IDE test I found.

**The four connections, and who holds them**
- Data plane:
  - `MAX_CONCURRENT_STREAMS` 4 and `MAX_INFLIGHT_BATCHES` 4 (`protocol/data-plane/README.md:94 @ 4561f3b8`; `protocol/data-plane/src/server.rs:60-62 @ 4561f3b8`);
  - one operation and one stream per connection, with no multiplexing (`protocol/data-plane/README.md:115-122 @ 4561f3b8`);
  - an N+1 request is refused, not queued, and queueing is reserved for ADR-014 (`protocol/data-plane/README.md:103-110 @ 4561f3b8`).
- Engine pool: `MAX_STREAM_CONNECTIONS` 4, acquired by `try_acquire` with "no queue, no wait" (`engine/src/pool.rs:53-55 @ 4561f3b8`, `:99`). Every pending ticket already holds a stream lease (`kernel/src/skp.rs:87-92 @ 4561f3b8`).
- **A stream holds its lease while it waits for credit.**
  - The writer's credit wait races only halt, pump failure and owner cancel (`protocol/data-plane/src/adapter_ws.rs:197-262 @ 4561f3b8`). There is no idle timeout once START is read: `START_TIMEOUT` bounds only the time before START (`protocol/data-plane/src/server.rs:63-71 @ 4561f3b8`).
  - The consumer grants `CREDIT_WINDOW = 4` and tops up at half (`frontends/shell/src/streaming/adapterWs.ts:13 @ 4561f3b8`, `:120-123`).
  - So **a table that withholds credit keeps one of the four slots** until it cancels or completes.
- Shipped composition:
  - the candidate arm is the default (`frontends/shell/src/residency/residencyArm.ts:50 @ 4561f3b8`);
  - it runs up to `MAX_IN_FLIGHT_TILE_STREAMS = 3` tile streams ("Amendment 11, LOCKED", `frontends/shell/src/canvas/tileGridConstants.ts:36-40 @ 4561f3b8`) plus one untiled first-look query capped at `UNTILED_FIRST_LOOK_ROW_LIMIT = 10_000` rows (`frontends/shell/src/canvas/tileGridConstants.ts:185 @ 4561f3b8`; `frontends/shell/src/residency/candidateArmSession.ts:1260-1274 @ 4561f3b8`);
  - `kernel/README.md:97-115 @ 4561f3b8` records the 3 + 1 = 4 composition;
  - the tile manager retries `engine.connections_exhausted`, and only that code (`frontends/shell/src/streaming/tileViewportStreamManager.ts:316-327 @ 4561f3b8`).
- **A fifth concurrent stream from a table can therefore be refused at the lease whenever the map is busy.**

**Client mechanics a table would reuse**
- Data plane: `startStream` with explicit credit and cancel (`frontends/shell/src/streaming/adapterWs.ts:37-163 @ 4561f3b8`).
- Stale-generation drop: `LiveTicketSet` (`frontends/shell/src/streaming/liveTicketSet.ts:101-154 @ 4561f3b8`).
- Supersede-and-self-cancel bookkeeping (`frontends/shell/src/streaming/viewportStreamManager.ts:85-140 @ 4561f3b8`).
- Batch decode: `tableFromIPC` per batch (`frontends/shell/src/canvas/decodeBatch.ts:130 @ 4561f3b8`). The decoded Arrow table is thrown away after ids and geometry are copied out (`:96-238`), so **no attribute survives decode today**.

**Other facts**
- Counts: `describe.row_count` is `{ basis, value }` and describes the unfiltered file (`protocol/skp/SKP-V0.md:81 @ 4561f3b8`). No filtered count exists before a scan completes.
- Design notebook: "table scope and counts must be explicit; inspect does not replace selection. Preserve keys such as `0012`" (`state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md:177-181 @ 4561f3b8`). "Console, Problems, Jobs and Table share an on-demand working area" (`:80`).

---

## 2. The sweep (20 repositories in source, plus 2 specifications)

| Project | Kept or dropped, and why |
|---|---|
| `uwdata/mosaic` (vgplot `Table.js`, core `QueryManager`) | **Kept.** The canonical "table as a second database client". `LIMIT`/`OFFSET` pages, `ORDER BY` in the engine, low-priority prefetch, cancel. |
| `manzt/quak` | **Kept, beside Mosaic.** The same model on Mosaic with flechette, plus `AsyncBatchReader`. |
| `observablehq/inputs` (`table.js`) | Dropped as a source model: in memory only, and sorting materialises everything. Cited once for "sort only when complete". |
| `finos/perspective` (DuckDB virtual server, `generic_sql_model`, viewer-datagrid) | **Kept.** Range requests against a view that DuckDB materialises, with Arrow IPC to the client. |
| `finos/regular-table` | Dropped: Perspective's renderer, with no ARIA in its source (grep found none). |
| `qgis/QGIS` (`src/gui/attributetable/`, `QgsVectorLayerCache`) | **Kept.** Scopes as filter modes, an id-first row map, attributes fetched on demand, selection synced by feature id. |
| `duckdb/duckdb-ui` (`ts/pkgs/duckdb-data-reader`) | **Kept.** One forward stream read on demand (`readUntil`). The closest match to "no new command". |
| `duckdb/duckdb` (late materialization, settings) | Kept as an engine fact (WATCH): `LIMIT`/`OFFSET` late materialization, `preserve_insertion_order`. |
| `apache/arrow-js` | **Kept.** Already a dependency: how `Vector.get` reads a cell. |
| `hyparam/hightable` | **Kept, shortlisted.** React, async `DataFrame.fetch(rowStart, rowEnd, orderBy, signal)`, scroll scaling past the browser's height limit, `role=grid`, roving tabindex. |
| `adazzle/react-data-grid` | **Kept, shortlisted for ARIA and keyboard.** It now needs React ^19.2. |
| `TanStack/virtual`, `TanStack/table` | Dropped as dependencies: headless, with no ARIA and no height scaling. A dependency for little. |
| `glideapps/glide-data-grid` | Dropped: draws on a canvas and exposes a parallel hidden table to assistive technology. Five runtime and peer dependencies; last release 2024-02. |
| `ag-grid/ag-grid` | Kept narrowly for two concepts (`aria-rowcount=-1`, version-stamped blocks). The server-side and viewport row models are Enterprise (commercial). |
| `revolist/revogrid` | Dropped: a Stencil web component, 7.5 MB, and its opt-in WCAG plugin forces `treegrid`. |
| `microsoft/vscode` (`ui/list`, `ui/table`, `common/paging.ts`) | **Kept for `PagedModel` cancellation.** Its table is a list, not a grid. |
| `antonycourtney/tad` | Kept as a minor donor: page-aligned 1,024-row fetch and stale-request tracking. Idle since 2025-03. |
| `keplergl/kepler.gl` (data-table) | Dropped: in memory, built on `react-virtualized` and styled-components. |
| `rilldata/rill` (virtualized-table) | Dropped: Svelte, `role="cell"` and `presentation` only. |
| W3C APG grid pattern, WAI-ARIA editor's draft | The baseline for §5. |

---

## 3. Dossiers

### 3.1 `duckdb/duckdb-ui` — `DuckDBDataReader` (data-source prior art, P0)

- **Repository:** `duckdb/duckdb-ui@0628932` (2026-09-28).
- **Licence:** MIT ("Copyright 2018-2025 Stichting DuckDB Foundation", `LICENSE`). Green.
- **Activity:** active.
  - The README says "most of the user interface code is not yet publicly available"; only the TypeScript data packages are open (`README.md`, "This repository contains …").
  - The packages have a test (`ts/pkgs/duckdb-data-reader/test/DuckDBDataReader.test.ts`).
- **Why it matters.** DuckDB's own UI does not page by offset in this package. It keeps one streaming result and reads it forward only as far as the view needs. This is exactly what Spatial IDE's credit-based stream allows with no new command.
- **How it works** (`ts/pkgs/duckdb-data-reader/src/DuckDBDataReader.ts`):
  - It wraps an `AsyncDuckDBDataBatchIterator` and keeps every batch read so far.
  - `readUntil(targetRowCount)` pulls batches until `totalRowsRead >= target` or the iterator is done ("rows are read in batches, typically of 2048 rows each").
  - `value(col, row)` finds the batch through a run-length list of batch sizes, `batchSizeRuns`: "not expected to grow beyond length 2", so the lookup is O(1).
  - `rowCount` grows, and `done` says when it is final.
- **What to reuse:**
  - the read-until-target loop driven by the grid's visible range plus overscan;
  - the "row count so far, plus `done`" pair, which maps to `aria-rowcount=-1` until done;
  - batch lookup by prefix sums. Engine batches are cut by bytes, so sizes vary: use a prefix-sum array, not the two-run trick.
- **What not to reuse:** its own value classes (`@duckdb/data-values`). Spatial IDE already has Arrow.
- **Licence implications:** none for a concept. A port keeps the MIT notice.
- **Reuse mode:** CONCEPTUAL DONOR.
- **Avoided work:** small.
- **Recommendation:** model the Filtered table as a pull consumer of one `viewport_query` stream (`bbox: null`, the filter as applied, `columns` = the shown attributes), granting credit only as the visible range needs rows.
- **Timing:** now, as an input to `b1-shell-half`'s form.

### 3.2 `qgis/QGIS` — the attribute table (P1)

- **Repository:** `qgis/QGIS@fa8f961` (2026-10-08).
- **Licence:** GPL-2.0-or-later. `COPYING` is GPL v2; the file headers say "either version 2 of the License, or (at your option) any later version" (`src/gui/attributetable/qgsattributetablemodel.cpp:10-11`; `src/core/vector/qgsvectorlayercache.cpp:12-13`). Core-combinable copyleft. Never usable in the SDK or anything a proprietary plugin links.
- **Why it matters.** The most mature GIS answer to the same three questions: scope, row identity and selection sync.
- **How it works:**
  - **Ids first, attributes on demand.**
    - `QgsAttributeTableModel::loadLayer` iterates every feature of the request and calls `featureAdded(fid)`, which fills `mRowIdMap`/`mIdRowMap`. The row-to-id map is fully materialised (`qgsattributetablemodel.cpp:474-528`, `:259-289`).
    - `data()` maps a row to a fid, then `loadFeatureAtId` goes through `QgsVectorLayerCache::featureAtId`: a `QCache` hit, or one `QgsFeatureRequest(fid)` with only the cached attribute subset and no geometry (`qgsattributetablemodel.cpp:676-720`; `qgsvectorlayercache.cpp:157-190`).
    - The cache size is the "row-cache" setting, default 10,000. A size of 0, or a provider without `SelectAtId`, falls back to a full cache (`qgsdualview.cpp:64`, `:466-477`).
  - **Sort runs on the client over the whole column:** `prefetchSortData` iterates every feature for the sort attribute and fills `sortCache` (`qgsattributetablemodel.cpp:1005-1060`).
  - **Scopes are filter modes:** `ShowAll`, `ShowSelected`, `ShowVisible`, `ShowFilteredList`, `ShowEdited` and `ShowInvalid` (`qgsattributetablefiltermodel.h:47-52`).
    - `ShowVisible` rebuilds its id list on the canvas's `extentsChanged`, through a single-shot timer, by re-querying with the extent and the renderer's `willRenderFeature` (`qgsattributetablefiltermodel.cpp:386-394`, `:595-660`).
    - `ShowSelected` tests `selectedFeatureIds().contains(fid)` (`:421-422`).
  - **Selection syncs by feature id**, both ways: `QgsFeatureSelectionModel::selectFeatures` writes the layer's selection manager, and `layerSelectionChanged` repaints (`qgsfeatureselectionmodel.cpp:77-192`).
  - `loadLayer` reports progress about once a second and accepts a cancel flag (`:503-514`).
- **What to reuse (concepts):**
  - scope as a filter over ids, kept apart from the attribute fetch;
  - "Selected" computed from the selection's id set, never from a scan;
  - selection sync by id in both directions;
  - a declared attribute-cache ceiling.
- **What not to reuse:**
  - the full id materialisation (every fid in a hash) for a millions-of-features file;
  - client-side sort over the whole column. Both are whole-file reads, which the 2026-09-18 direction forbids outside an explicit operation.
- **Reuse mode:** CONCEPTUAL DONOR.
- **Avoided work:** moderate, in design.
- **Recommendation:** take QGIS's scope and selection model: the table's Selected scopes are computed from the selection's ids, and row identity is the feature id, never the position. Do not take its load-all-ids model.
- **Timing:** now.

### 3.3 `finos/perspective` — the DuckDB virtual server (P1, prior art for a future ruled command)

- **Repository:** `finos/perspective@6dbc6b8` (2026-10-02).
- **Licence:** Apache-2.0 (`LICENSE.md`; per-file banner "distributed under the terms of the Apache License 2.0", e.g. `rust/perspective-js/src/ts/virtual_servers/duckdb.ts:7-10`). Green, notices owed.
- **Why it matters.** Perspective is the Arrow-native, viewport-driven grid. Its DuckDB backend shows what an engine-side range request looks like.
- **How it works:**
  - `tableMakeView` runs `CREATE {TABLE} {view_id} AS (…)` (`rust/perspective-client/src/rust/virtual_server/generic_sql_model.rs:340-361`; `duckdb.ts:374-392`). **The view is materialised in DuckDB**: "DuckDB's temp tables take the default" (`generic_sql_model.rs:90-93`).
  - `view_get_data` is `SELECT … FROM {view_id} LIMIT {end-start} OFFSET {start}` (`generic_sql_model.rs:455-533`).
  - The result is returned as Arrow IPC through `bindings.runQuery` into `dataSlice.fromArrowIpc` (`duckdb.ts:525-543`).
  - The unsorted order is made explicit, not assumed: `ORDER BY rowid` ("the dialect's natural row identity", `generic_sql_model.rs:99-102`; `table_make_view.rs:646-665`, `:963-969`).
  - **The grid side reads JSON, not Arrow:** the datagrid's data listener calls `view.to_columns_string(window)` then `JSON.parse` (`packages/viewer-datagrid/src/ts/data_listener/index.ts:97-103`).
- **What to reuse:**
  - the shape of a range request (`start_row`, `end_row`, columns, sort) **if** the human rules a command;
  - making the natural order explicit rather than relying on engine defaults.
- **What not to reuse:**
  - the materialised temp table. It is a whole-result write per view, which conflicts with the no-whole-file-scan direction on a 5 GB source;
  - the JSON cell path.
- **Licence implications:** a port of SQL shapes owes an Apache-2.0 notice.
- **Reuse mode:** CONCEPTUAL DONOR.
- **Avoided work:** moderate, for a future command form.
- **Recommendation:** cite it in the form as the reference design for random access, which needs a ruling. Do not adopt it.
- **Timing:** park until a command is asked for.

### 3.4 `uwdata/mosaic` Table and `manzt/quak` DataTable (P1)

- **Repositories and licences:**
  - `uwdata/mosaic@3faf153` (2026-10-04): BSD-3-Clause ("Copyright (c) 2023-2025, UW Interactive Data Lab", `LICENSE`).
  - `manzt/quak@41549f9` (2026-04-16): MIT (`LICENSE`).
  - Both green.
- **How it works:**
  - **Mosaic** `packages/vgplot/inputs/src/Table.js`:
    - the query is `Query.from(t).select(cols).where(filter).orderby(sort).limit(limit).offset(offset)` (`:227-235`). Sort and filter run in the engine;
    - on scroll near the bottom it requests the next offset (`:125-139`) and prefetches the page after at `Priority.Low` (`:182-191`; `packages/mosaic/core/src/Coordinator.ts:198-203`);
    - rows are **appended to the DOM**, with no virtualisation (`:249-282`);
    - hover writes a selection clause built from the row's **values over every field** (`clausePoints`, `:172-180`; `core/src/clause/PointClause.ts:75-101`). Identity is by value, not by key;
    - `QueryManager.cancel` removes queued entries and rejects pending results with "Canceled" (`core/src/QueryManager.ts:205-222`). No database-side cancel is visible in that code.
  - **quak** `lib/clients/DataTable.ts`: the same model (`:196-209`, `:245-254`), with an `AsyncBatchReader` over flechette batches (`lib/utils/AsyncBatchReader.ts:23-40`). Row selection is not used.
  - **Arrow handling:** Mosaic converts each result with `getChildAt(i).toArray()` (`core/src/util/to-data-columns.ts:38-46`).
  - **ARIA:** none in either. quak writes a non-standard `aria-role` attribute (`DataTable.ts:433`).
- **What to reuse:**
  - the "second client of the same database" framing;
  - prefetching the next range at lower priority than the map.
- **What not to reuse:**
  - identity by value tuple. Spatial IDE has a real `id`;
  - an unbounded append-only DOM;
  - offset paging without `ORDER BY`. DuckDB's docs say results "might not be deterministic without the ORDER BY clause" (duckdb.org, LIMIT page).
- **Reuse mode:** CONCEPTUAL DONOR.
- **Avoided work:** small.
- **Recommendation:** give a table request a lower scheduling priority than map tiles.
- **Timing:** now.

### 3.5 `hyparam/hightable` (grid prior art, P0 to port, not to adopt)

- **Repository:** `hyparam/hightable@0989abd` (2026-03-10).
  - npm `hightable` 0.26.4 (2026-03-05), 96 releases;
  - `dist.unpackedSize` 472,753; **no runtime dependencies**; peers `react`/`react-dom` `^18.3.1 || ^19`;
  - vitest tests, including `test/components/HighTable.keyboard.test.tsx` (9 cases); CI on `ubuntu-latest` only (`.github/workflows/ci.yml`).
- **Licence:** MIT (`LICENSE`; `package.json` `"license": "MIT"`, author Hyperparam). Green.
- **Why it matters.** It is the only candidate that combines an async range-fetch data source, React, virtualisation past the browser's element-height ceiling and `role=grid` with roving tabindex.
- **How it works:**
  - **Data source:** `DataFrame { numRows, columnDescriptors, getCell({row, column, orderBy}) → ResolvedValue | undefined, getRowNumber, fetch({rowStart, rowEnd, columns, orderBy, signal}), eventTarget }`, with `resolve`/`update`/`numrowschange` events (`src/helpers/dataframe/types.ts:46-153`). `getCell` never fetches, and the boxed value tells "pending" from `undefined`.
  - **Cancellation:** one `AbortController` per visible-range effect, aborted when the range or sort changes. `AbortError` is swallowed (`src/hooks/useFetchCells.ts:45-67`).
  - **Scroll scaling:** `maxElementHeight = 8_000_000`. The comment records Firefox at 17,895,700, Chrome at 33,554,400 and Safari at 33,554,428 (`src/helpers/constants.ts:12-14`). Above that, `createScale` maps scrollTop through a factor, with local scrolling for small deltas (`src/helpers/scroll.ts:225-270`).
  - **ARIA:** `<table role="grid" aria-rowcount aria-colcount aria-multiselectable>` (`src/components/Table.tsx:153-163`), `role="row" aria-rowindex aria-selected` (`Row.tsx:19-25`), `role="columnheader" aria-sort aria-rowindex aria-colindex` (`ColumnHeader.tsx:178-186`), and a roving tabindex in which only the current cell has `tabIndex=0` (`hooks/useCellFocus.ts:35-37`).
  - **Keyboard:** arrows; Ctrl+arrows to the edge; Home and End; Ctrl+Home and Ctrl+End; PageUp and PageDown (`Table.tsx:34-91`). This is the APG data-grid navigation set, without the selection-key chords.
  - **APG deviations, checked in code:**
    - data cells use `role="cell"` instead of `gridcell` (`Cell.tsx:96`);
    - `aria-readonly={true}` is on the grid, although APG says read-only grids "do not include the aria-readonly attribute" (`Table.tsx:157`);
    - `aria-checked` is on `role="rowheader"`, which ARIA does not list as a supported state for `rowheader` (supported: `aria-expanded`, `aria-sort`) (`RowHeader.tsx:58-64`);
    - the scroll wrapper is itself a tab stop (`role="group" tabIndex={0}`, `Scroller.tsx:99`), adding one tab stop beside the grid's.
  - **React 18 is not honoured by the current release.**
    - `src/hooks/useFetchCells.ts:1` and `src/providers/SelectionProvider.tsx:2` import `useEffectEvent`, and the published `dist/HighTable.js` of 0.26.1 to 0.26.4 imports it from `react`.
    - `react@18.3.1`'s `cjs/react.development.js` has no `useEffectEvent`, while `react@19.2.0`'s does (checked on unpkg).
    - 0.26.0 (2026-01-14) is the last release without it.
    - The peer range `^18.3.1` is therefore wrong from 0.26.1 on.
- **As a dependency:** only by pinning `0.26.0`, then patching four ARIA deviations upstream or locally. That is a new dependency and the human's question. I do not recommend it.
- **As a port:** the `DataFrame` interface, `createScale`, the keyboard map and the roving-tabindex hook. The ARIA deviations are fixed in the port.
- **Licence implications:** MIT notice in `NOTICE` and the dist notice (`generate:notice`).
- **Reuse mode:** PORT.
- **Avoided work:** moderate.
- **Recommendation:** build Spatial IDE's own grid, porting these four pieces, and record the ARIA corrections as acceptance tests.
- **Timing:** now, at the form.

### 3.6 `adazzle/react-data-grid` (ARIA and keyboard reference, P2)

- **Repository:** `adazzle/react-data-grid@f5f8abd` (2026-10-07).
  - npm 7.0.0-beta.61; 372,846 bytes; no runtime dependencies;
  - **peers `react ^19.2`**: since beta.50 (2025-03) React 19, and since beta.59 React 19.2. The last with `^18.0 || ^19.0` is beta.47 (2024-09-11), per the npm registry;
  - CI on `ubuntu-latest` (`.github/workflows/ci.yml`).
- **Licence:** MIT (`LICENSE`, "Original work Copyright (c) 2014 Prometheus Research"). Green.
- **How it works:**
  - `role` defaults to `grid` (`src/DataGrid.tsx:293`), with `aria-multiselectable`, `aria-colcount` and `aria-rowcount` (`:1169-1179`), rows carrying `aria-rowindex` (`:1125-1127`), and `role="gridcell" aria-colindex` (`src/Cell.tsx:96-102`);
  - roving tabindex citing the APG anchor (`src/hooks/useRovingTabIndex.ts:4-5`);
  - Home, End, Ctrl, PageUp and PageDown handled in `getNextPosition` (`DataGrid.tsx:833-880`).
- **Deviation:** `aria-selected={isCellActive}` marks the *focused* cell as selected (`Cell.tsx:100`), which conflates focus with selection.
- **Limits:**
  - it requires `rows: readonly R[]` (`DataGrid.tsx:122`);
  - the virtual height is `rowHeight * rows.length`, with no cap (`src/hooks/useViewportRows.ts:20-28`). *Inference:* at 35 px rows, roughly a million rows pass Chrome's element-height limit quoted above.
- **Reuse mode:** CONCEPTUAL DONOR, for the keyboard-to-position function and the gridcell and rowindex wiring.
- **Recommendation:** reject it as a dependency (React 19.2, an in-memory rows array).
- **Timing:** now, as a test oracle for the keyboard map.

### 3.7 `microsoft/vscode` — `PagedModel` cancellation (P2)

- **Repository:** `microsoft/vscode@d3d31f6` (2026-10-08). Licence MIT (`LICENSE.txt`; header in `src/vs/base/common/paging.ts`). Green.
- **How it works:** `PagedModel.resolve(index, token)` shares one in-flight `getPage` per page. Each waiting index registers on its own token, and the page's `CancellationTokenSource` is cancelled **only when the last waiting index cancels**: `page.promiseIndexes`, size zero leads to `page.cts.cancel()` (`src/vs/base/common/paging.ts:112-157`). `PagedRenderer` renders a placeholder and cancels on dispose (`src/vs/base/browser/ui/list/listPaging.ts:40-60`).
- **ARIA:** the `Table` widget is a `List` plus `SplitView` headers. The list role defaults to `list`, and `table/` holds no `grid`/`gridcell` roles (grep of `tableWidget.ts`; `listWidget.ts:1504-1525`). The keyboard is row-oriented: Up, Down, PageUp, PageDown, Enter, Escape, Ctrl+A (`listWidget.ts:331-343`). **It is not an ARIA grid.**
- **Reuse mode:** PORT, of the reference-counted range cancellation, into the table's fetch layer.
- **Avoided work:** small.
- **Recommendation:** port the refcount rule. A range whose rows all scrolled away sends SKP `cancel`, which Spatial IDE already has end to end. A range still wanted by any visible row is kept.
- **Timing:** now.

### 3.8 `ag-grid/ag-grid` community (P3, two concepts)

- **Repository:** `ag-grid/ag-grid@89faa99` (2026-10-08).
- **Licence is split** (`LICENSE.txt`: "two license types: MIT and Commercial"):
  - `packages/ag-grid-community/LICENSE.txt` is MIT ("Copyright (c) 2015-2026 AG GRID LTD");
  - `packages/ag-grid-enterprise/LICENSE.html` is the "AG Grid Commercial End User Licence Agreement". **Red.**
  - The server-side and viewport row models live in `packages/ag-grid-enterprise/src/serverSideRowModel/` and `…/viewportRowModel/`, so they are **red**. The infinite row model is community (`packages/ag-grid-community/src/infiniteRowModel/`).
- **Size:** npm `ag-grid-community` 36.2.0 is 21,636,306 bytes unpacked, with dependencies `ag-charts-types` and `ag-stack`.
- **Concepts:**
  - **`aria-rowcount` is -1 while the last row index is unknown** (`src/gridBodyComp/gridBodyCtrl.ts:484-493`), which matches the ARIA rule "If the total number of rows is unknown, authors MUST set … -1";
  - a block load carries a `version`, and a stale or destroyed block's result is dropped (`src/infiniteRowModel/infiniteBlock.ts:16`, `:45`, `:62-70`);
  - concurrent block loads are capped by `maxConcurrentDatasourceRequests` (`rowNodeBlockLoader.ts:66-88`);
  - `rowContainerHeightService` "solves the 'max height' problem" by stretching (`src/rendering/rowContainerHeightService.ts:7-60`).
- **Reuse mode:** CONCEPTUAL DONOR (MIT parts only).
- **Recommendation:** reject it as a dependency (size). Take `aria-rowcount=-1` and the per-range version stamp.
- **Timing:** now.

### 3.9 `apache/arrow-js` — reading cells straight from batches (P1)

- **Repository:** `apache/arrow-js@8a7fda4` (2026-10-06); `package.json` version 21.2.0, which matches the shell's `^21.2.0`. Licence Apache-2.0 (`LICENSE.txt`). Already a dependency.
- **How `Vector.get` works:**
  - a chunked vector keeps `_offsets` (`src/vector.ts:89-114`), and `get` does a `binarySearch` over chunk offsets, then calls the type's getter (`src/util/chunk.ts:100-128`);
  - numeric: `values[stride*index]`, no allocation (`src/visitor/get.ts:147`);
  - 64-bit integers: `values[index]`, a `BigInt` (`:151`);
  - Utf8: `decodeUtf8` **on every call** (`:195-198`);
  - Dictionary: `dictionary.get(values[index])` (`:312-314`).
- **What the others do:**
  - Mosaic: `toArray()` per column per page (§3.4);
  - Perspective's grid: JSON (§3.3);
  - duckdb-ui: its own value objects per batch (§3.1);
  - **none of the grids checked reads visible cells straight from Arrow.**
- **Pattern for Spatial IDE** (*design inference from the code above*):
  - keep each table batch as the `Table` that `tableFromIPC` returns, with a prefix-sum array of `numRows`;
  - for each visible cell, call `getChildAt(c)!.get(localRow)`;
  - read `id` (column 0) as `bigint` and never narrow it, as `frontends/shell/src/canvas/decodeBatch.ts:163-169 @ 4561f3b8` already insists;
  - decode strings only for visible cells, and optionally keep a small LRU cache of formatted strings per batch;
  - avoid `Table.get(i)` (a struct-row proxy per row) and `toArray()` on Utf8 columns.
- **Reuse mode:** ADOPT. It is already a dependency, so this is a usage pattern, not a new dependency.
- **Recommendation:** decode the table's batches separately from the map's. `decodeBatch` keeps no attributes, and the map's residency budgets should not carry table rows.
- **Timing:** now.

### 3.10 `duckdb/duckdb` — engine facts (WATCH)

- **Repository:** `duckdb/duckdb@f2f9329` (2026-10-08). Licence MIT (`LICENSE`, "Copyright 2018-2026 Stichting DuckDB Foundation").
- **`preserve_insertion_order`:** default `"true"` (`src/include/duckdb/main/settings.hpp:2181-2190`). See §1.
- **Late materialization:**
  - `LateMaterialization::Optimize` fires on a constant `LIMIT` with an `OFFSET` at or under `late_materialization_max_rows` (default `"50"`), on larger limits only when the row ids are consecutive, and on top-N (`src/optimizer/late_materialization.cpp:419-470`; `settings.hpp:1804-1813`);
  - it requires the scan function's `late_materialization` flag (`late_materialization.cpp:228`);
  - **I could not verify** whether `read_parquet` sets that flag: the grep across the repository timed out. MotherDuck's announcement attributes a "3–10x" faster `LIMIT` read to it, linking a DuckDB PR; that figure is theirs, with the measurer unnamed.
- **Relevance:** only if a ruled range command uses `OFFSET`. It does not change the no-new-command design.
- **Reuse mode:** WATCH.
- **Timing:** park until a command is asked for.

---

## 4. Answers to the four questions

### Q1. How serious tools feed a table without materialising it

| Tool | Request model | Sort and filter | Row identity while scrolling | Cancelling stale ranges | Map or selection sync |
|---|---|---|---|---|---|
| Mosaic, quak | Range: `LIMIT`/`OFFSET` per page, prefetch next | Engine (SQL) | Position under the query's order. Without `ORDER BY`, engine-dependent | Reject queued or pending results; no DB cancel visible | By value tuple over all fields |
| Perspective + DuckDB | Range over a **materialised** view table | Engine | `__ID__` / `rowid`; order made explicit with `ORDER BY rowid` | Not examined (the viewport window replaces the last) | Not examined |
| QGIS | All ids first; attributes per id through an LRU cache | Filter at the provider; **sort on the client over the whole column** | Feature id | Progress callback with a cancel flag on the id load | Both ways, by feature id |
| hightable | `fetch(rowStart, rowEnd, orderBy, signal)` | The DataFrame implementer decides | `getRowNumber` | `AbortController` per range | Row number |
| AG Grid infinite (community) | Blocks of rows, capped concurrency | Datasource (server) | Row node id | Version stamp drops stale results | Not examined |
| VS Code `PagedModel` | Pages on demand | Not applicable | Index | Page cancelled when its last waiter cancels | Not applicable |
| duckdb-ui reader | **One forward stream, read until N** | Whatever the query says | Position in the stream | Not shown (closed UI) | Not shown |

**What this means for Spatial IDE (my reading, for the form, not a ruling):**

1. **Every tool with random access uses a range request with an offset, key or explicit order in the engine.**
   - `viewport_query` has none.
   - With the existing commands, the table can be **forward-only**: the duckdb-ui pattern on one credit-driven stream.
   - Jumping to row k reads k rows. That is honest; say so in the UI.
   - Random access and sort need a new command, which is the human's to rule. Perspective's and Mosaic's shapes are the reference designs.
2. **The second consumer costs a slot for as long as its stream is open,** because credit-waiting holds the lease (§1). With the shipped 3 + 1 composition, a live table stream makes a fourth map request refusable (`engine.connections_exhausted`). The tile manager already retries that code once.
   - The form has to choose one of these, and each is the human's:
     - (a) the table stream is cancelled whenever its tab is hidden or the map is busy, and re-read from the start on return. *Inference:* the cost grows with how far the user had scrolled;
     - (b) map fan-out is lowered to 2 while a table stream is live, which touches the LOCKED `MAX_IN_FLIGHT_TILE_STREAMS`;
     - (c) ADR-014 queueing, which is reserved.
   - Prior art for priority: Mosaic's `Priority.Low` prefetch, and AG Grid's `maxConcurrentDatasourceRequests`.
3. **The Selected scopes need no scan.** QGIS computes "selected" from ids.
   - Selected, ignoring filter: `filter: id IN (…)`.
   - Selected: `(<filter as applied>) AND id IN (…)`.
   - Both are bounded by the selection ceiling of §6.3 and chunked under `MAX_PREDICATE_BYTES` = 4,096.
   - Each chunk is a short stream that ends on its own.
   - Once complete, the scope is fully loaded and can be **sorted on the client honestly** (Observable's "sort only once materialised").
   - **Caveat (inference):** for a session-ordinal dataset, `id` is `file_row_number`, which is probably not in the filter namespace. The form should test this before relying on it.
4. **Count:** for Filtered, the total is unknown until the stream completes. Use `aria-rowcount="-1"` (the ARIA spec; AG Grid) and a visible "k loaded, more to read". `describe.row_count` is the unfiltered file's count and must not stand in for it.
5. **Identity:** key rows by the batch's `id` (column 0, `BigUint64`), never by position. Drop batches from a dead generation through `LiveTicketSet`, as the map does. *Inference:* under `preserve_insertion_order=true`, positions are stable within a generation. Do not claim more.
6. **Attributes of the inspected feature** need no second consumer if the map's own stream carries `columns`. *Inference:* larger batches count against residency. Alternatively, a one-row `id IN (x)` stream on inspect. The form chooses.

### Q2. Virtualised grids

| Candidate | Virtualisation | ARIA grid (checked in code) | Keyboard | Size (`unpackedSize`) | Dependencies | Licence |
|---|---|---|---|---|---|---|
| hightable 0.26.4 | Rows; scales past 8 M px | `grid`/`row`/`columnheader`, rowindex/colindex/rowcount; **`cell` not `gridcell`; `aria-readonly` on grid; `aria-checked` on rowheader** | APG navigation set | 472,753 | none; React peer, but **needs React 19's `useEffectEvent` from 0.26.1** | MIT |
| react-data-grid 7 beta.61 | Rows and columns; no height cap | `grid`, gridcell, rowindex/colindex, roving tabindex; `aria-selected` = active cell | APG navigation set | 372,846 | none; **React ^19.2** | MIT |
| TanStack Virtual 3.14 + Table 9.2 | Headless; no height cap | none | none | 60,900 + 437,568; 121,881 + 1,003,460 | `@tanstack/store`, `react-store` | MIT |
| Glide Data Grid 6.0.3 | Canvas | Parallel hidden `<table role=grid>` of the visible rows; canvas holds `tabIndex=0`; cells `tabIndex=-1` | Own | 3,662,455 | `@linaria/react`, `canvas-hypertxt`, `react-number-format`; peers lodash, marked, react-responsive-carousel | MIT |
| AG Grid Community 36.2 | Rows and columns, height stretching | Full (`aria-rowcount=-1` when unknown) | Full | 21,636,306 | `ag-charts-types`, `ag-stack` | MIT (Enterprise models commercial) |
| RevoGrid 4.28.3 | Rows and columns | Opt-in plugin; forces `treegrid` | Own | 7,522,640 | none (Stencil) | MIT |
| VS Code list/table | Rows | `list`/`listbox`, not a grid | Row-oriented | not on npm | not applicable | MIT |
| Perspective datagrid / regular-table | Rows and columns | none found | Own | 1,929,251 / 503,556 | Perspective client, wasm | Apache-2.0 |

### Q3. Reading cells from Arrow

See §3.9. In short: no candidate grid reads cells straight from Arrow. `apache-arrow`'s `Vector.get` is cheap for numbers, allocates a `BigInt` for 64-bit integers and decodes a string per call for Utf8. Read only the visible cells, per column, through `getChildAt(c).get(r)`.

### Q4. The APG grid baseline

- **Roles:** `grid` on the container, labelled by `aria-labelledby` or `aria-label`; `row`; `gridcell`, `columnheader`, `rowheader`.
- **One tab stop** for the whole grid, with focus moved by code.
- **Navigation keys:**
  - arrows, which stop at the edges;
  - PageUp and PageDown;
  - Home and End within the row;
  - Ctrl+Home and Ctrl+End;
  - optionally Shift+Space and Ctrl+A for selection.
- **Read-only grids omit `aria-readonly`.**
- **`aria-sort`** on the sorted header.
- **Rows not in the DOM:** `aria-rowcount` and `aria-rowindex`. "If the total number of rows is unknown, authors MUST set the value of aria-rowcount to -1" (W3C APG grid pattern; WAI-ARIA editor's draft, `#aria-rowcount`, `#aria-rowindex`).
- **Which candidate meets it in code:**
  - react-data-grid comes closest, with one deviation: `aria-selected` marks the focused cell;
  - hightable has four deviations (§3.5);
  - AG Grid Community appears complete but is out on size;
  - Glide meets it only through a shadow table;
  - TanStack, VS Code, regular-table, Mosaic, Observable and quak do not.
  - **No candidate would pass Spatial IDE's acceptance item unchanged within the shell's React 18.**

---

## 5. Build versus adopt (under "no new dependency")

**Recommendation: BUILD a small grid in the shell, and PORT four MIT pieces into it.** Ask the human for no dependency.

- **Port:**
  - hightable's `DataFrame` fetch interface and `createScale` height scaling;
  - hightable's and react-data-grid's keyboard-to-position map and roving tabindex, with their ARIA deviations corrected;
  - VS Code's reference-counted page cancellation;
  - AG Grid's `aria-rowcount=-1` and version-stamped ranges.
- **Keep:** React 18, plain CSS and `apache-arrow` as they are.
- **Notices:** MIT notices for the ported files go through `generate:notice`.
- *Inference, not a measured figure:* this is an estimate of a few hundred lines for the grid core, plus the data-source layer.

If the human prefers a dependency anyway, the only fitting one is `hightable@0.26.0`, pinned (MIT, no runtime dependencies, React 18 compatible), with its ARIA deviations patched. Every later hightable release, and every react-data-grid release since beta.50, requires React 19.

### Do not reinvent

- Spatial IDE should not implement **stale-batch rejection** from scratch, because its own `LiveTicketSet` and supersede bookkeeping already provide it. The table reuses `streaming/` as is, unless the table needs a multiplexed stream, which ADR-012 reserves.
- Spatial IDE should not implement **Arrow cell decoding** from scratch, because `apache-arrow` 21.2 (Apache-2.0, already a dependency) provides typed `Vector.get`, unless profiling under `docs/08` later shows Utf8 decode per visible cell to matter.
- Spatial IDE should not invent **a range-cancellation rule**, because VS Code's `PagedModel` (MIT) provides a reference-counted one in about 45 lines, unless ADR-014 later imposes a different admission order.

### Worth owning

- The grid component: ARIA, keyboard, virtualisation and scaling. It is small, it is an acceptance item, and no candidate meets the baseline on React 18. It borrows hightable's and react-data-grid's code shapes.
- The table's data-source layer: scope, pull credit, id keying and slot yielding. It is entirely specific to the data plane's single-stream connections and the 3 + 1 composition. It borrows duckdb-ui's read-until pattern and QGIS's scope model.

---

## 6. What I could not verify

- **Whether `read_parquet` enables DuckDB late materialization:** the repository-wide grep timed out. Any `OFFSET`-based command form must check it.
- **Whether `file_row_number` is in the filter namespace** for a session-ordinal dataset. This is inferred from `probe_schema` being `SELECT *`. Needs a test.
- **Position stability of unordered scans** under `preserve_insertion_order=true` in Spatial IDE's engine: inferred, not pinned by a test.
- **Perspective's handling of stale viewport requests,** and its selection model: not examined.
- **Issues and PRs** on hightable (the React 18 peer mismatch) and react-data-grid (the React 19 move): github.com issue pages cannot be fetched here, so an upstream report is not ruled out.
- **Screen-reader behaviour:** every ARIA finding is a reading of the code against the specification. No assistive technology was run.


## Errata from the independent check (2026-10-08)

- VERIFICATION-B row 1: a started stream waiting for credit does keep its lease with no timeout (confirmed). But 3 tile streams + 1 untiled query is the **declared peak**, not normal use: at first load the untiled stream ends before tiles are planned (`frontends/shell/src/residency/candidateArmSession.ts:1399-1401 @ 4561f3b8`, `frontends/shell/src/streaming/tileViewportStreamManager.ts:513 @ 4561f3b8`); all four run at once only after an Apply/Clear reissue. The "3 + 1" text is written about the admission pool; the stream pool's recorded fact is 4 = 4.
- VERIFICATION-B row 18: hightable 0.26.1+ needs React **19.2** or later. react-data-grid: React `^19.0` starts at beta.49 (not beta.50), `^19.2` at beta.58 (not beta.59), and the last release allowing React 18 is beta.48 (not beta.47).
- VERIFICATION-B spot-check S5: QGIS's cache skips geometry only when geometry caching is off.
