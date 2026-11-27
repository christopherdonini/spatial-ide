# Files with no covering, loading by view: an addendum on the human's new facts and the route of a one-time rewrite sorted by location (architect consult)

*Filed by the custodian: consult:files-with-no-covering-addendum-the-rewrite-route. An addendum to the consult on files with no covering, not a gate, with no node; its lab figures are leads, not gate evidence, and the routes are the human's; placed by the advisor's ADV-2026-11-24-23, item 6 (state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-23-the-humans-message-of-09-52z-placed-every-case-settled-not-an-approval-identity-route-first-r6-its-own-piece.md). Dispatched at 2026-11-24T10:52:15Z to the architect on opus, its brief byte for byte (brief-noncover-addendum-1.md in the scratch folder, 11761 bytes, sha256 53404d1bd2902784561d76b93b5834352d9e5a323ea0a17b82964b507df815c0) with that ruling in it byte for byte; read only in the detached checkout D:/wt/read-1124f at main 20ed759b71064079792541f2a76cf804a6c84bc1; its run: Read 44, Grep 40, Glob 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T10:52:15Z to 2026-11-24T11:01:23Z by its transcript; 0 calls named the main checkout; handed back once, at 2026-11-24T11:01:22Z; no message was sent to it. Its recommendations are for a ruling; nothing is placed by this filing. Filed below the rule, 22917 bytes, sha256 d5a72309f2990656a11cb2b1377466c828f6edca583e12a46a1cd313037dd81a, byte for byte, nothing masked, with one final newline added.*

---

detached read checkout `D:/wt/read-1124f` @ 20ed759b71064079792541f2a76cf804a6c84bc1. **Verdict:** none. This is a consult addendum, read only, and not a gate.

Consult addendum: files with no covering, the rewrite route
Read: D:/wt/read-1124f @ 20ed759b71064079792541f2a76cf804a6c84bc1
REPORT PATH: state/consults/2026-11-24-files-with-no-covering-load-by-view-addendum-the-rewrite-route-architect-consult.md

Every cite is at 20ed759b. Two short names: M1124a is the human's message of 2026-11-24 at 00:47Z (the filed directive), and M1124b is the message of 09:52Z (as copied in the brief). Every lab figure is a **[lead]**: it comes from outside this engine and is not gate evidence. "The consult" means `state/consults/2026-11-24-files-with-no-covering-bbox-load-by-view-and-the-lod-tiers-architect-consult.md`, and its routes keep their numbers (3a, 3b, 3c, 3d). The new route is 3e.

## 0. What I confirmed in the code

- **The first look is bounded at 10,000 rows.**
  - `UNTILED_FIRST_LOOK_ROW_LIMIT = 10_000` (frontends/shell/src/canvas/tileGridConstants.ts:185).
  - It is passed as the query's limit (residency/candidateArmSession.ts:1304), with `bbox: null` (App.tsx:1831-1834).
  - A look that reaches the limit is marked durably partial (candidateArmSession.ts:1440-1442).
  - The vertex budget still bounds it: `MAX_RESIDENT_VERTICES = 2_000_000` (canvas/limits.ts:73).
  - The rows come in scan order, which is a declared choice and not a sampling claim (tileGridConstants.ts:165-175).
- **Only a query with a bbox is refused.** The refusal is on the bbox branch only (engine/src/stream.rs:1491-1494; protocol/skp/SKP-V0.md:1113). Its wire code is `engine.no_covering_bbox` (kernel/src/skp.rs:2200-2201, :2297).
- **The shell never reads `covering_bbox`.** It appears only in the type at skp/types.ts:192, so the shell plans tiles whatever describe says (skp.rs:2072).

**M1124b item 4 against the code.** "8 of the 16 are shown whole" holds for the first look only, and only if the file is under the vertex budget as well. 58% to 99.7% never loading, with a 10,000-row look, fits files of about 23,800 to about 3.3 million rows. That range is my arithmetic on the lead, not a fact.

## 1. The new facts against the consult's routes

- **3d (hold the whole file once, up to the vertex budget).**
  - For the 8 small files [lead], 3d's loading half adds nothing, because they are already whole.
  - Its honesty half matters for all 16. The 8 small files still get the false "some areas were not loaded" sentence after a pan (§3).
  - For the other 8, 3d can only raise the first look to the vertex budget. It cannot load by view. How much more it would show per file is unknown.
- **3a (a scan per view).** It reads and decodes every geometry on every view. The 2.4 s per view of the side-file run [lead] already includes a read-back from the source, so 3a can only be slower. The facts weaken 3a further. I would drop it as a product route.
- **3b (a side file of boxes).** The consult's step 3 was a measurement-only form on read-back, because read-back was "not measured" (M1124a item 3).
  - M1124b item 4's 2.4 s per view on a 176 MB single-row-group file [lead] provisionally answers that question: a box per row does not remove the read of the whole geometry column, which is what the consult predicted from docs/07:22's bracket (an unordered source gets no pruning).
  - 3b stays useful for an exact extent, counts per view and an instant answer for an empty view. As a loading route it no longer looks worth building.
  - The lead ran DuckDB with spatial functions. This engine links DuckDB with `bundled, parquet, json` only (engine/Cargo.toml:48), so the lead does not transfer by assumption.
- **3c (the LOD tiers).** No change. Tier 0 is the source, and tiers give no load by view of tier 0 (engine/src/lod.rs:9-14).
- **The shares.**
  - Shown whole at the first look: 8 of 16 [lead]. The code confirms this, within the vertex budget.
  - Never loaded, per larger file: 58% to 99.7% [lead], under every route except 3e. 3d lowers it only up to the vertex budget.

## 2. The route the facts point to: 3e, a one-time rewrite sorted by location, with a covering and smaller row groups

**Why it works, by this tree's own evidence.**
- docs/07:22 measured physical layout as the only lever that moved read volume. With a covering and an order, DuckDB's zone maps prune row groups.
- The lead's 0.01 to 0.14 s per view [lead] fits that mechanism.
- docs/07:22 also closes the question: "layout stays out of the import path; no ADR was filed." Its reopen conditions are three, and "each requires a fresh preregistered gate, never an amendment". A source with no covering is none of the three as written.
- The rewrite is new product behaviour, which engine/src/layout.rs:41-47 names: rewriting a user's file is outside docs/02:21's engine scope as written, and it owes a reproducibility grade (ADR-005) and a recorded operation (docs/01 principle 3).

**The precedent in the tree, and why it does not serve as is.** `layout::write_clustered_variant` (layout.rs:216-428) is gated behind the `fixture` feature (engine/src/lib.rs:116-120) and has no product caller. It cannot serve these files:
- It reads the declared covering for its keys and refuses `NoCoveringBbox` without one (layout.rs:289, :652-667).
- It joins on an identity column. A repeated value multiplies rows and a null drops them (layout.rs:402-412), which rules out the files of M1124b item 1 that hold repeated ids.
- It carries the `geo` key verbatim (layout.rs:274-287), so the copy would declare no covering.
- As layout.rs:364-401 states at 20ed759b, this DuckDB's writer flushes on multiples of 2,048 rows and the rewrite refuses any other size. 50,000 [lead] is not such a multiple. A Rust-side writer (`ArrowWriter`, as LOD uses at lod.rs:50-53) has no such limit.

**What the copy needs.**

**(a) Where it lives, and who may delete it.**
- **In the app-local cache, keyed by the source's content hash.** This is the LOD tiers' place (lod.rs:142-151; engine/src/app_dirs.rs:90-115). LOD's location ruling is "never beside the source file without the user's word" (lod.rs:144). The root exists on Windows only (app_dirs.rs:22-24, :91-99).
- **Beside the source:** writing a file outside the app's own store is an external side effect (ADR-006:17). It needs approval and a declared reversibility, and LOD's ruling forbids it without the user's word. Not recommended.
- **In the project folder:** no. ADR-036 §1 keeps machine data out of the folder (ADR-036:28). A binary copy there also sits against docs/01's plain-text rule (docs/01:24). The project file has no member that could name it: a version-1 reader refuses any `cache_status` other than `linked` (ADR-036:92).
- **Deleting it:** the user may delete it at any time, and the app reads a missing copy as a miss. The app collects copies no source references (docs/11:45). There is no collector in the tree for LOD's tiers either: a grep of lod.rs finds reuse but no deletion. The cache's size bound and eviction are owed to an ADR.

**(b) Which ADRs and clauses it reaches.**
- **Contradicts, unless reopened:** docs/07:22's closure of layout in the import path, by a fresh preregistered gate. Also lod.rs:9-14's rule that tier 0 is the source of record. The copy would serve the geometry that is drawn and picked, so tier 0 would in effect be derived.
- **Owes a new ADR.** Per index.rs:54-57 and rowgroup.rs:46-48, the first derived file on disk owes docs/11's ResourceRef model (docs/11:21-33, :45) and ADR-005's grades (ADR-005:12-20). ADR-031 is reserved and not drafted (docs/README.md:36). The two should share the derived-artifact rules.
- **Consistent, if built as a cache:**
  - **ADR-006.** The build is a pure transformation (ADR-006:15; the same reading as rowgroup.rs:37-39). There is nothing to undo, and no step is recorded, because the layer's rows do not change (ADR-036 §7, :185).
  - **docs/01 principle 8.** The build must still be logged and visible.
  - **docs/05:18.** The raw source is kept.
  - **docs/02:42.** Content-addressed intermediates.
  - **ADR-004:17.** "Copy-minimized" governs the data plane, which does not change. The disk copy is a separate cost. In the same spirit, but not by its letter, it is measured and reported.
  - **docs/01:24 (plain text).** Untouched, as long as the copy is never project state.
- **ADR-016.**
  - A native or declared id needs no change.
  - For a session-tier source, see (d). A reused copy reaches the OPEN on stability across reopen (ADR-016:171-176) and the verified tier, which is not built (:225-228).
- **ADR-010.** Rule 6: declared ceilings for keys, disk and memory. Rule 2: a stale copy is a wrong but plausible answer (see (e)).
- **ADR-018.** Cancellation is measured, at p50 and p95.
- **ADR-033.** The build takes a maintenance lease (the `build_index` pattern, dataset.rs:775-778).
- **ADR-035.** The copy dies with the session's generation.
- **ADR-028 and ADR-021.** Unchanged in kind. The bbox clause stays in SQL (stream.rs:1491 onward), and tiles are minted against the copy. ADR-028's settled predicate needs a "being prepared" state, so that no partial sentence is shown while the copy builds.
- **SKP (version bump).**
  - A command to start the build, cancel it and see its progress. No SKP command runs a build today (skp.rs:2284-2286).
  - A fact, or an event in ADR-035's form, that says view loading is ready. describe is answered once, at open.

**(c) What it costs at open.**
- **Time.**
  - It cannot be inside open. The cold-open budget is 5 s (docs/08:7), and open takes no whole-file read (dataset.rs:671-677). 11 s for 176 MB [lead] would exceed it.
  - So the build is an operation after open: the first look streams from the source meanwhile, and the canvas is never blocked.
  - The phases:
    1. The content hash, a whole-file read, if the copy is persisted (index.rs:594-606). dataset.rs:673-674 cites kernel/RESULTS.md at about 603–610 ms on the 100,000-feature fixture; I did not read RESULTS.md.
    2. A Rust pass over identity and geometry, decoding WKB into a box and a Hilbert key. The `wkb` and `geo` crates are already product dependencies (Cargo.toml:62-68).
    3. The sort and the write.
    4. A check of row count and row groups (the layout.rs:374-413 pattern).
  - Nothing in this engine has been measured.
- **Disk.**
  - About 1× the source [lead], plus the added columns. That is 32 B per row for four f64 and 8 B per row for a source ordinal, before compression. This is arithmetic, not a measurement.
  - A fail-closed free-space preflight comes before writing (lod.rs:193-200, :962-966).
  - A partial file is removed on failure, and the removal is reported (layout.rs:213-238).
- **Memory.**
  - The keys take 16 B per feature, bounded at 512 MiB by `MAX_KEYED_FEATURES` (layout.rs:68-85).
  - DuckDB's sort is not bounded by this code (layout.rs:80-82). A DuckDB sort needs a declared memory limit; a Rust external sort needs its own bound.
- **Cancellable:** yes. The only window without polling is the COPY, and the connection's interrupt handle can stop it (layout.rs:206-211, :349-356).
- **Progress:**
  - The hash reports bytes, on the `pin_content_observed` precedent (dataset.rs:686-698). The key pass can report per batch.
  - One DuckDB COPY reports nothing, which is a principle-7 gap (docs/01:13).
  - I recommend a Rust-side writer, which reports progress and honours any row-group size. Otherwise the gap must be declared.
- **Streaming:** the build sends nothing to the canvas.

**(d) What identity its rows carry, and how picks, filters and saved projects map back.**
- **Native or declared id.** The copy carries the column byte for byte (layout.rs:9-11 states this by construction; a check of the digest set is what proves it). Picks and filters map one to one.
- **Session tier: a Correctness hazard to design out.**
  - `file_row_number` on the copy is the copy's position, not the source's (identity.rs:58-77, :92-97; stream.rs:1438-1440).
  - The first look reads the source, so its ids are source positions. Tiles from the copy would carry copy positions.
  - The shell's dedupe across tiles compares those ids (tileGridConstants.ts:177-184). It would merge different features and draw one feature twice.
  - So the copy must carry the source ordinal as a stored column, and the engine must project that column as `id` on the copy. This changes `IdSource::source_column`'s contract per file read.
  - Within one generation that is the session tier, and nothing changes in ADR-016 (Amendment 1 item 1, :186-208).
  - Reusing that column in a later session persists an identity used across sessions, which reaches ADR-016's OPEN (:171-176) and the verified tier (:225-228).
  - The text-id draft's "nothing of it is saved" sits against it too (the consult's §5).
- **Added columns.** The covering and the ordinal must not collide with any source name. The covering-name rule is ASCII case-insensitive (dataset.rs:1613-1619). They must not be admitted by a filter or a projection, and describe keeps listing the source's schema (skp.rs:2064-2069). Otherwise a filter is admitted that the source would refuse.
- **Picks.** They resolve against resident rows, so they need nothing more once ids agree.
- **Whole-file reads stay on the source:** export, publish, the table and the first look. They keep the source's order and schema.
- **Saved projects need nothing.** The project file references the source (ADR-036:83-92). It saves no feature id (:223) and no selection (:252). Its filter refers only to attributes (:163), and its view is a centre and a zoom (:249).
  - On reopen, the saved view is applied after the first look (App.tsx:1836).
  - If the copy is not ready yet, view queries refuse, and the shell must say "being prepared" rather than "pan or zoom".
- **Rows with no box.** A row with a null or empty geometry has no box, so it would never load by view. That must be declared.

**(e) When the source changes after the copy is made.**
- **Detected in session** (descriptor checks before each query and after each terminal, ADR-016 Amendment 1 item 3, :217-223; or the watcher): the session ends (ADR-035), and the copy is dropped for that generation. A persisted copy keyed by the old hash becomes collectable.
- **Not detected in session.** An edit that keeps size and mtime is not seen (ADR-036:110). View reads (from the copy) and whole-file reads (from the source) then show two different contents in one session.
  - This is a new hazard; today every read sees one file.
  - It has to be declared, and nothing may call the copy a snapshot (ADR-016:190-191; ADR-036:85-92 reserves Snapshot for stage 3).
- **Between sessions.** With a content-hash key, the next open's hash misses and the copy is rebuilt.
  - Keying by the descriptor would reuse stale rows silently. The descriptor is a change detector, not an identity (ADR-016:210-215). I recommend refusing that.
- **During the build.** Check the descriptor before and after the build, and refuse on any change, because the hash and the rewrite's read are separate reads.

## 3. The status text today (for item 7's probe)

**The chain after a pan, on a file with no covering:**
1. The tile's `viewport_query` is refused. The refusal is logged as `tile-stream-mint-refused` with `engine.no_covering_bbox` (tileViewportStreamManager.ts:283-291, :958; skp.rs:2200-2201, :2297).
2. It does not end the session: it is not one of the two session-ended codes (streaming/liveTicketSet.ts:80-85).
3. It is not retried: only `engine.connections_exhausted` is retryable (tileViewportStreamManager.ts:328, :336-339).
4. The tile is dropped and `onTileDropped` is called (:1004-1007).
5. The session emits a status once nothing is tracked (candidateArmSession.ts:1073-1076).
6. `isFillComplete` is false, because a covering tile is never complete (:682-703, :699-701). `settledState` then gives `settled-partial` (residencyStatus.ts:338-344).
7. Within budget, the bar shows (candidateArmSession.ts:817-824; residencyStatus.ts:486): "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." (residencyStatus.ts:443)
8. Over budget, it shows the over-budget sentence (residencyStatus.ts:488-498) with the suffix " Filling has finished for this view — the render budget is full; pan or zoom to see other areas." (:422)
9. A zoom-out that truncates the cover takes the same branch (:689).

**What tests cover it.** The S1 unit tests reach this sentence for a retryable code after its second refusal (candidateArmSession.refusal.test.ts:97-99, :217-234). No test in that file drives a refusal that is never retried; a grep finds no `no_covering_bbox` there. Nobody has seen this path run on a real file.

**What the probe looks for, per step:**
- the status text, verbatim. The e2e constant is `K7_SETTLED_PARTIAL_TEXT` (e2e/regression.mjs:1765);
- the `tile-stream-mint-refused` lines and their codes (read by `tileMintOutcomesSince`, tileViewportStreamManager.ts:309-311);
- the resident feature count;
- whether a `.canvas-refusal` element shows. Walkthrough P5 expects one (MANUAL-WALKTHROUGH.md:1649).

**Also to record: the status after the first look settles and before the pan.** The fit on open can itself notify a viewport change, depending on its call site's `notifyViewport` (WorkingCanvas.tsx:1414-1422). I did not trace which way that goes, so tiles may be refused with no pan at all.

## 4. What is the human's, and the open questions

All routes are the human's (ADV-2026-11-24-23 item 8). My recommendation for each:

1. **Which route loads by view.**
   - Run the probe first.
   - Then 3d's honesty half: stop planning tiles when `covering_bbox` is false, and stop the false sentence.
   - Then, if the human chooses, a measurement-only preregistered gate for 3e in this engine, before any product code.
2. **Reopening docs/07:22.** A fourth reopen condition ("a source with no covering, where the alternative is no load by view") is the human's to add. A fresh gate follows, never an amendment.
   - I recommend it, narrowly: a derived copy, the source untouched, never called import.
   - The measured failure was whole-file cost. Under 3e, whole-file reads stay on the source.
3. **Where the copy lives.** I recommend the app cache. Not beside the source without the user's word, and never the project folder.
4. **Whether it persists across sessions.**
   - Recommended: content-hash reuse for a native or declared id.
   - For session-tier sources, a copy per generation only, until ADR-016's OPEN is settled.
   - Either way, the disk write owes the new ADR first.
5. **Who starts it.** I recommend an offer the user accepts, showing the disk cost, rather than a start on open, until it is measured. That also gives principle 4 its SKP command.
6. **The strings** ("being prepared", and the corrected settled sentence). These fall under P6.
7. **The cache bound and its eviction.** These belong to the ADR.

## 5. ADR skeleton (a draft that binds nothing; drafting and acceptance are the human's)

**ADR-0xx — A derived copy of a source for loading by view**
- **Context.** Many published files have no covering, and are single-row-group and unordered [lead]. View queries refuse (stream.rs:1491-1494). Layout is the only measured lever (docs/07:22). The first derived file on disk owes ResourceRef and grades (index.rs:54-57).
- **Decision.**
  - The copy is a cache artifact, not a resource the project names. It sits under the app cache, keyed by the source's content hash and the builder version.
  - It carries the source's rows byte for byte, sorted by Hilbert key over boxes computed from the geometry, with a declared covering, a declared row-group size and the source ordinal stored.
  - It is authoritative for nothing. View reads only; export, publish, the table and the first look read the source.
  - The build is a pure transformation (ADR-006), started over SKP. It is cancellable, reports progress per phase, takes a maintenance lease, and is checked by a disk preflight and declared memory and key ceilings.
  - Its rows are checked equal to the source's at build: the count, and a digest per row or per set.
  - It is invalidated with the generation and on any hash mismatch.
  - For a session-tier source it is per generation until ADR-016's OPEN is settled.
  - It is never called a snapshot. The undetected in-place edit is declared.
- **Consequences.**
  - The project format does not change, and ADR-021 and ADR-028 do not change in kind.
  - SKP takes a version step.
  - Disk use is about 1× each source [lead], bounded by a cache bound.
  - docs/07:22 is reopened by its own gate.
  - lod.rs's tier-0 statement and ADR-031 must state the copy's relation to tier 0.

## Notes outside the question

- App.lateResult.test.tsx:484 and App.layout.test.tsx:79 reject an unrestricted first look or reissue with `engine.no_covering_bbox`. The engine never produces that for a query without a bbox (SKP-V0.md:1113). They test the refusal display in general terms, and they may be where P5's expectation came from.
- KNOWN-LIMITATIONS item 9 now sits at :118-123.

**Files read** (all at 20ed759b; Read, Grep and Glob only):
- **The consult and the directive:** state/consults/2026-11-24-files-with-no-covering-bbox-…-architect-consult.md; state/directives/2026-11-24-the-humans-message-lab-leads-…-the-routes-to-weigh.md.
- **The constitution:** docs/01, docs/02 (grep), docs/05 (:1-20, :78-88), docs/07 (:1-40), docs/08, docs/11; ADR-004 (grep), ADR-005, ADR-006, ADR-016 (:165-239), ADR-036; docs/adr listing; docs/README.md (grep); protocol/skp/SKP-V0.md (grep).
- **The engine:** engine/Cargo.toml (:20-92); engine/src/lib.rs (:100-134); layout.rs (:1-140, :190-429, :640-677); lod.rs (:1-60, :125-214, grep); app_dirs.rs; index.rs (:40-64, grep); rowgroup.rs (:1-60); dataset.rs (:660-790, :1540-1619, grep); stream.rs (:1425-1504); identity.rs (:30-165); wkb.rs (grep).
- **The kernel:** kernel/src/skp.rs (:2060-2084, :2185-2209, :2278-2292, grep).
- **The shell:** canvas/tileGridConstants.ts (:150-190); canvas/limits.ts (grep); canvas/tileGrid.ts (grep, :207-218); canvas/WorkingCanvas.tsx (:1408-1427, grep); residency/candidateArmSession.ts (:205-234, :630-830, :1030-1099, :1280-1310, :1425-1454, :1620-1649, :1760-1794, grep); residency/residencyStatus.ts (:338-344, :380-499); residency/candidateArmSession.refusal.test.ts (:1-140, :215-239, grep); streaming/tileViewportStreamManager.ts (:270-349, :930-1039, grep); streaming/liveTicketSet.ts (grep); App.tsx (grep); App.lateResult.test.tsx and App.layout.test.tsx (grep); e2e/regression.mjs (grep); skp/types.ts (grep).
- **Other:** KNOWN-LIMITATIONS.md (:116-125, grep); MANUAL-WALKTHROUGH.md (grep); governance/forms/engine/LOD-PREREGISTRATION.md (grep).

Model: Opus 5.5 (claude-opus-5-5).
