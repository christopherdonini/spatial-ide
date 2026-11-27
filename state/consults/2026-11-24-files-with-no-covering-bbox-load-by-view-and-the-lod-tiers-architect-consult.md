# Files with no covering bbox: what loading by view would take, and how it relates to the LOD tiers, the architect consult

*Filed by the custodian: the architect read of item 4 of the human message of 2026-11-23 and of the human message of 2026-11-24, under ADV-2026-11-23-33 item 7 (a read only, with no node and no piece). The human figures it gives are leads, not gate evidence. Dispatched at 2026-11-24T02:45:19Z; its run: Read 50, Grep 46, Glob 3, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T02:45:20Z to 2026-11-24T02:56:13Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T02:56:13Z. 17151 bytes, sha256 f58e83de37c970c389c92070f7c31a877a3be763bf329ea4b62c04fe215db82f, byte for byte, nothing masked, with one final newline added.*

---

Consult: files with no covering bbox, load by view and the LOD tiers
Read: D:/wt/read-1124b @ 4630fa09bec7d7c66a15393de0bd13d64537a9a1
REPORT PATH: state/consults/2026-11-24-files-with-no-covering-bbox-load-by-view-and-the-lod-tiers-architect-consult.md

Every cite below is at 4630fa09. The human's figures are leads, given with their message and item: M1123 is the message of 2026-11-23 and M1124 the message of 2026-11-24. Authority runs lower number first (docs/README.md:3). ADR-011 is named only as a direction.

## 1. Today

**At open.** The file opens. `judge_covering` (engine/src/dataset.rs:443, :1554-1611) is the one place that decides whether a declared covering can be used. When the file has no covering, `Dataset.covering` is None (:589-593, :995-997), and describe reports `covering_bbox: false` (kernel/src/skp.rs:2072). Two more facts are left unset at open: the row count, when there is no verified identity (skp.rs:1967-1975), and the extent (skp.rs:2074-2079).

**The refusal by view.** It happens in `build_sql`, on the bbox branch only (engine/src/stream.rs:1491-1494). It returns `NoCoveringBbox`, and its detail comes from `no_covering_bbox_detail`: "the file's `geo` metadata declares no covering.bbox" (dataset.rs:1010). The refusal is synchronous, before any ticket is minted (skp.rs:1499-1501), and its wire code is `no_covering_bbox` (skp.rs:2200-2201). The two refusals in dataset.rs (:747-751 and :863-866) belong to the index builds, which no product path calls (:827-828, :939-941). A query without a bbox is unaffected (stream.rs:1712-1717). SKP-V0 says the same: "A `viewport_query` without a bbox is unchanged." (protocol/skp/SKP-V0.md:1113).

**The first look.** It has no bbox, so it loads. The shipped arm issues it at App.tsx:1831-1834; the baseline arm, which is dev-only, at :2022-2031. The line-337 comment you pointed to is Apply's primary attempt, which has the same shape. Two bounds apply:
- **A row count.** `UNTILED_FIRST_LOOK_ROW_LIMIT = 10_000` (frontends/shell/src/canvas/tileGridConstants.ts:185) is passed as the query's limit (candidateArmSession.ts:1304). A look that reaches the limit is marked durably partial (:1440-1442).
- **A vertex budget.** `MAX_RESIDENT_VERTICES = 2_000_000` (limits.ts:73).

There is no byte budget on geometry. The 268,435,456-byte attribute ceiling only drops attributes (limits.ts:84).

**So, on the human's M1124 item 5:** a file whose rows fit under 10,000, and whose vertices fit under 2,000,000, should be shown whole by the first look. A larger file shows the first 10,000 rows in scan order, and the code marks that look partial.

**After a pan.** The tile mints are refused. Each refusal is written to the session log only (tileViewportStreamManager.ts:283-291, :958), and the tile is dropped (:1004-1007, candidateArmSession.ts:1073-1076). The first look stays on screen. A dropped tile is never resident, so `isFillComplete` returns false (candidateArmSession.ts:682-703). The status bar then takes the settled-partial branch (:817-824), whose sentence is "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." (residency/residencyStatus.ts:443). For this file that advice is false, because every pan is refused. For a small file, the "not loaded" clause is false as well. This is my reading of the code; nobody has seen it run (section 7).

**Two documents disagree with this reading:**
- `frontends/shell/MANUAL-WALKTHROUGH.md:1649` (P5) expects a canvas refusal and no point drawn. Its result line (:1672) is blank, so it was never run.
- KNOWN-LIMITATIONS item 9 (:121-122) says such a file is refused when the view is queried, and does not mention the first look.

## 2. What is missing

A load by view needs one box per row. Without boxes, the engine can only test the geometry itself, and there is nothing to test it with: DuckDB is linked with `bundled, parquet, json` only (engine/Cargo.toml:48), so no spatial SQL function exists in the shipped engine.

**Row-group statistics cannot fill the gap.**
- The engine reads statistics only from covering columns (`covering_statistics`, dataset.rs:1734-1736; rowgroup.rs:16-19).
- The file-level `bbox` member, when a file has one, gives an extent and nothing per row (geoparquet.rs:366-368).
- The human's M1124 item 2 lead says 13 of the 16 files hold a single row group. For those files a group's box is the whole extent, so it prunes nothing.
- docs/07:22 states the measured bracket: an unordered source gets no pruning, and spatial pruning is a property of layout.

**The cost every route has to face.** On a single-row-group, unordered file, any route that reads matching rows back from the source re-reads the whole geometry column. That read-back is exactly what M1124 item 3 marks as not measured.

## 3. The routes

### 3a. A scan per view, under some size
- **Reads and writes.** It reads the whole file on every view query and writes nothing. In the producer, each row's WKB is decoded, its box computed and tested against the view. That replaces the SQL bbox clause (stream.rs:1700-1711).
- **What it changes.**
  - The engine: `build_sql` and `produce`.
  - SKP-V0.md:1112-1113, whose refusal no longer holds.
  - ADR-021 item 4's composition rule (ADR-021:67-70), because the bbox test leaves SQL.
  - A declared size ceiling read from the footer (ADR-010 rule 6).
- **The fan-out.** The tiled arm issues one query per tile, up to 3 at once (tileGridConstants.ts:40) and up to 512 queued (:54), so each camera change becomes many whole-file scans. This route only works served untiled, one query per settled view. That touches ADR-028 Decision 1 (ADR-028:28-30).
- **docs/01.** It can be cancelled per chunk, since a query without a WHERE still yields chunks. Progress is per batch only. A view with no matches stays silent, which is ADR-021's named shortfall (ADR-021:146-152), under principle 7 (docs/01:13).
- **docs/08.** Measure:
  - first pixels (docs/08:6) and time to stable view, p50/p95, per view;
  - cancellation requested→observed, p50/p95 (docs/08:8);
  - on generated no-covering versions of the Polygons class (docs/08:31) and the Points class (:29), in single-row-group and multi-row-group forms, at full, quarter and 1/64 views, with the size ceiling declared beforehand.

### 3b. A side file of one box per row, made at open
- **Reads and writes.** It reads every geometry once and writes (identity, box) rows.
- **Where it can live.** Persisted, it would sit in a cache keyed by content hash, as LOD's tiers do (lod.rs:9-14, :1169-1172). Two comments in the tree name a persisted derived file as the point where docs/11's ResourceRef, ADR-005's grades and their own ADR become owed: index.rs:54-57 and rowgroup.rs:46-48.
- **When it runs.** Not inside open. Open avoids whole-file hashing (dataset.rs:673-677). The human's lead of 6.5 s for 400,000 polygons (M1124 item 3) was taken with DuckDB plus spatial functions, not this engine, so it does not transfer. Set beside the 5 s cold-open budget (docs/08:7), it argues for building after open as its own operation: cancellable, reporting progress, on a maintenance lease (the `build_index` pattern, dataset.rs:775-778).
- **What it changes.** The engine gains a new module, in the pattern of index.rs and rowgroup.rs. The control plane needs a way to start the build, cancel it and see its progress: no SKP command runs a build today (skp.rs:2285-2286), so that means a version bump. Describe needs a fact saying how this dataset can be loaded by view.
- **What it gives, and what it does not.** Kept in memory for the current generation only, it gives an exact extent, per-view counts (today `viewportTotal` is always null, candidateArmSession.ts:640-643) and an instant answer for an empty view. It does not remove the read-back IO.
- **docs/08.** Measure:
  - build time p50/p95, with its cancellation p50/p95;
  - side-file bytes over source bytes;
  - read-back first pixels p50/p95 per view, through row-position ranges against a full scan, which is M1124 item 3's gap;
  - the same datasets as 3a.

### 3c. The LOD tiers
These are section 4. They help draw an overview; they do not load tier 0 by view.

### 3d. Mine: hold the whole file once, up to the vertex budget
For a dataset with `covering_bbox: false`:
- run the first look without the 10,000-row limit, bounded only by `MAX_RESIDENT_VERTICES`. That limit exists to anchor the tile grid's frame (tileGridConstants.ts:155-163), which a dataset that plans no tiles does not need;
- plan no tiles;
- say truthfully whether the whole file is resident.

The engine and the wire do not change (SKP-V0.md:1113). The change is in the shell's residency module, plus a note or amendment to ADR-028 for a dataset that never plans: Amendment 2's settled predicate turns on whether a plan has run (ADR-028:405). docs/08: first look to stable view, p50/p95, and its cancellation, on generated files up to the budget.

## 4. The LOD tiers

**Tier construction does read every geometry.** It reads only the identity column and the geometry column (lod.rs:1383-1385). It writes a box for each row, but computed from the simplified geometry (:1676-1683). A simplified ring is a subset of the source's vertices, so its box can be smaller than the source row's. That makes it unsafe as a covering for tier 0. It could also emit the source boxes in the same pass, but it does not today.

**It does not run on these files as built.**
- It refuses a geographic CRS (lod.rs:178-184; form §2c, governance/forms/engine/LOD-PREREGISTRATION.md:91).
- It reads Polygon only (lod.rs:1556-1561).
- It needs the identity column to be in the file (lod.rs:1366, :1813-1819). On the session tier that column is `file_row_number` (identity.rs:92-97), which is not in the file, so the build should refuse. That is inferred, not seen run.
- It runs lazily, on request, and has no product caller (lod.rs:999; skp.rs:2285-2286). Tier selection is not designed (form §1, :54).

**Tier 0's authority.** Tier 0 is the source and the record. A tier is never authoritative for identity, geometry, picking or export (lod.rs:9-14; form :77, :309). Tier vertices are charged against the same budget (form :128-132). So the tiers could draw an overview of such a file, because they carry a covering of their own (lod.rs:1723-1731). They do not give a load by view of tier 0, which close zooms, picking and export still need.

## 5. Identity

**Every route identifies its rows by row position on the session tier.** The query's identity is `file_row_number AS id` (stream.rs:1438-1440; identity.rs:42-55; ADR-016:186-208).
- 3a and 3d keep identity as it is.
- 3b kept in memory is keyed within the generation and dies with it, which is exactly ADR-016 Amendment 1 item 1.
- 3b persisted, or tiers built for a session-tier source, would store row positions (or ids) and use them to reach rows in a later session. That reaches ADR-016's OPEN, which must be settled before any identity is persisted or used to address a feature across sessions (ADR-016:171-176). It also touches the verified tier, which is defined but not built (:225-228), and the session statement, which says the identity is never saved (identity.rs:150-154).

**The human's M1124 item 4 lead** fits the session tier as the ordinary way to identify a feature without a key. It does not change M1123 item 2's requirement that the choice is the user's.

**The ADR-016 draft (ADV-2026-11-23-34, which binds nothing).**
- Neither side needs anything from the other. A route built for the session tier serves text-id opens too, because Decision 3 of the architect's draft says "nothing else changed" (state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:55).
- A route must key rows by `source_column()`, never by a column named `id` (Decision 5, :57).
- A persisted side file sits badly with "nothing of it is saved" (Decision 6, :58). That is one more reason to keep 3b in memory.

## 6. What each route would amend
- **3d.** A note or amendment to ADR-028 for a dataset that never plans (it is not architect-blockable). KNOWN-LIMITATIONS item 9. The status strings, which fall under P6. Undecided: the wording, and whether describe should carry the footer's row count.
- **3a.** SKP-V0.md:1112-1113 and a version bump. ADR-021 item 4. ADR-028 Decision 1, if served untiled. docs/08 rows once measured. KNOWN-LIMITATIONS item 9. Undecided: the size ceiling and what is refused above it.
- **3b, in memory.** A new SKP command or event for the build, and the describe fact. ADR-033's lease class. No ADR-016 change. Undecided: when the build starts (after the first look, or on the first pan) and what the status shows while it runs.
- **3b, persisted.** A new ADR covering docs/11, ADR-005 and ADR-016's OPEN at :171-176, and its relation to ADR-031, which is reserved and not drafted. A disk preflight, after LOD's precedent (lod.rs:193-200).
- **LOD.** ADR-031; the form's geographic follow-on (its Amendment 1); a tier-selection gate; how a tier reads a session-tier identity.

## 7. Behaviour nobody has seen run
Four things rest on code reading alone:
- the first look drawing a file with no covering, which contradicts walkthrough P5 (:1649);
- the status sentence after a pan;
- the first look staying drawn after a refused pan;
- `build_tiers` refusing a session-tier source.

**The probe** (one tester run, not run in this consult):
- **Files.** Two generated polygon files, LV95, no covering (`with_covering_bbox: false`, the generator kernel/src/skp.rs:3134 uses), no `id` column. One has fewer rows than 10,000, the other more. Both are written outside the repository.
- **Runs.** The e2e build opens each file, lets the first look settle, pans once, then zooms once. The tester also calls `build_tiers` on the small file at the engine level.
- **Records.**
  - resident feature counts after each step, against the file's row count;
  - the status text after each step, verbatim;
  - any banner;
  - the `tile-stream-mint-refused` log lines with their codes;
  - `build_tiers`' result, verbatim.
- **What would change this answer.**
  - If the first look draws nothing, section 1 is wrong and 3d needs that cause first.
  - If the post-pan status is not the line-443 sentence, the defect claim in section 1 is withdrawn.
  - If `build_tiers` succeeds, the identity obstacle in section 4 is withdrawn.

## 8. Recommendation
1. **The probe first.**
2. **Then 3d, if the probe confirms.** It is the cheapest route that is true. A small file is already loaded, and the app should stop asking for tiles it cannot get and stop advising a pan. A piece for it would preregister:
   - that the first look completes under the budget, and the status it then shows;
   - the planning that stops when `covering_bbox` is false;
   - the strings;
   - first look to stable view, p50/p95, and cancellation p50/p95 on generated files.
3. **Then a measurement-only form for read-back** (M1124 item 3), before choosing between 3a and 3b. Read-back cost is what separates them, and docs/07:22 predicts no pruning on unordered sources.
4. **Then 3b in memory, if read-back pays.** Persisting it comes only after an ADR. I would not take 3a as the product route under tiling.

**Not to be built before the tag:** any engine route, any SKP change, a persisted side file, and LOD selection. The only exception I see is the honesty part of 3d, if the probe confirms the false advice, since ordinary use reaches it. Placing it is the advisor's or the human's decision.

**Apart from this question:** KNOWN-LIMITATIONS item 9's opening words, "Polygons only", sit beside limits.ts:60-71, which describes point and line opens. I did not work out which is current.

**Files read:** the brief; state/directives/2026-11-23-the-humans-message-text-id-files-…-a-bbox-consult.md; state/directives/2026-11-24-the-humans-message-lab-leads-…-the-routes-to-weigh.md; state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-33-*.md; ADV-2026-11-23-35 and ADV-2026-11-24-05 (grep only); state/consults/2026-11-23-advisor-draft-adv-2026-11-23-34-*.md; state/consults/2026-11-23-text-id-opens-…-architect-draft.md (:44-103); docs/README.md; docs/01_Principles.md; docs/07_Roadmap.md (:1-40); docs/08_Testing.md; docs/adr/ADR-016 (:56-247); ADR-021 (:51-75, :140-159); ADR-023 (status, grep); ADR-028 (:1-75, :534-582, grep); protocol/skp/SKP-V0.md (grep); engine/Cargo.toml (:20-49); engine/src/dataset.rs, stream.rs, geoparquet.rs, rowgroup.rs, index.rs, envelope.rs, identity.rs, lod.rs (parts); kernel/src/skp.rs (parts); kernel/tests/no_generation_in_persisted_artifacts.rs (grep); governance/forms/engine/LOD-PREREGISTRATION.md (:44-133, grep); governance/MOVED.tsv (grep); KNOWN-LIMITATIONS.md (:116-128); frontends/shell/src/App.tsx (:250-449, :1680-2059); residency/candidateArmSession.ts (parts); streaming/tileViewportStreamManager.ts (parts); canvas/tileGridConstants.ts; canvas/limits.ts; residency/residencyStatus.ts (grep); App.layout.test.tsx (:60-99, :470-492); MANUAL-WALKTHROUGH.md (:1622-1679, grep).

Model: Opus 5.5 (claude-opus-5-5).
