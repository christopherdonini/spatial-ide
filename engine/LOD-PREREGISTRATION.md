# Preregistration — LOD tier construction, route B (Rust `geo`), for ADR-031

*Drafted 2026-09-15 by the architect agent on the custodian's brief, for the human's sight. Inputs read at `main` **57bde69** (`.git/refs/heads/main`): `spikes/lod-feasibility/README.md` (main), the same file on `spike/lod-divergence-c3` (PR #80) for its two 2026-09-15 sections, `docs/01`, `docs/07`, `docs/08`, ADR-004, ADR-009, ADR-010, ADR-016, ADR-018, ADR-021, ADR-026, ADR-028, ADR-030, `engine/src/{layout,dataset,index}.rs`, `engine/Cargo.toml`, `Cargo.toml`, `frontends/shell/src/canvas/limits.ts`, and `docs/PREREGISTRATION-TEMPLATE.md` (full form).*

**Authority.** `DECISIONS-PENDING.md:47`, RULED 2026-09-14 question set C, item C3 — the human's typed words, quoted, not paraphrased:

> "(2) The architect drafts the preregistration now with the five open questions answered as pre-committed choices for my sight — I rule on drafted choices with their reasoning, not on five blank questions. No dependency is approved by this ruling; spike-only dependencies stay spike-only; the product dependency decision rides the preregistration's ruling."

and the human's stated prior, from the same item:

> "B preferred (pure Rust, statically linked, small licence surface) unless its output validity cannot be established."

Narrowed by `DECISIONS-PENDING.md:22`, RULED 2026-09-15 question round 2, Item 1 — the human's answer verbatim, **"1. Route A is out on principle (Recommended)"**, whose option text reads:

> "'Can be statically bundled' is not met by the pinned crate; a custom static build is a new build-system and licence surface, not a bundling. The architect drafts the ADR-031 preregistration for route B alone, five open questions pre-committed for your sight, simplifier variant (VW-preserve vs RDP + degenerate-ring removal) as a pre-committed choice."

**Committed before any code.** Same discipline as `engine/ADMISSION-PREREGISTRATION.md:5` and `frontends/shell/RESIDENCY-PREREGISTRATION.md`: every rule, pre-committed choice, fixture, declared value and gate below is fixed by this commit, before any line of tier-builder code exists and before any crate is added to any product manifest.

**Append-only once committed. An amendment made after any outcome has been seen MUST say so in its first line** (the ADMISSION rule, `engine/ADMISSION-PREREGISTRATION.md:5`) and must state what work it touches or invalidates. The five pre-declared amendment classes of `docs/PREREGISTRATION-TEMPLATE.md:101-122` are the only classes available.

**What this document is not.** It is not ADR-031. ADR-031 is a reserved number with no file (`docs/README.md:36`); this preregistration is the input its drafting will decompose, and both the ADR's text and its acceptance are the human's. **No dependency is approved by this document** (C3, quoted above) — §8 carries the crate set as a proposal to rule on.

---

## §0. Disclosure — written after the spike's outcomes were seen

**This document was written with the spike's results in hand.** It is not a blind preregistration and must not be read as one. Disclosed in full, the numbers and findings that were seen before a word of it was written:

1. **Route B's `polygons-100k` table** (`spikes/lod-feasibility/README.md:112-119`), including every wall-time, vertex-reduction and validity cell — in particular the single failing cell, `5.0 / simple`, **5 invalid of 100,000** (`:118`), and the five `preserve` and `simple` rows that returned **0 invalid**.
2. **Route B's `parcels-5gb` single row** (`:140-142`): tolerance 1.0, `preserve`, 804.686 s, 403 row groups, 345,507,850 → 252,277,009 vertices, reduction 0.2698, 0 invalid.
3. **Route A's two tables** (`:84-91`, `:98-104`) in full, including the 179.369 s 5 GB `preserve`/1.0 cell that `:144-149` names as confounded by thread count.
4. **Both cancellability tables** (`:153-180`) — route A's ~1 s `interrupt()` → join, and **route B's 9.952 s detection latency, 3 of 403 row groups processed** (`:169-172`).
5. **The whole "Route B divergence explained" section** on `spike/lod-divergence-c3` (PR #80, `spikes/lod-feasibility/README.md:308-635`): the per-feature table for ids 37926/40320/61222/70483/74445 (`:345-351`), the `POLYGON_INITIAL_MIN = 4` probe (`:372-391`), the GEOS `transformLinearRing` → `nullptr` mechanism (`:456-486`), and the direct answer that `SimplifyVwPreserve(5.0)` is valid on all five with zero validation errors (`:576-586`).
6. **The "Route A static bundling" section** (`:637-866`) — read, but **route A is excluded from this preregistration by the human's ruling of 2026-09-15 (`DECISIONS-PENDING.md:22`), on principle, not by any measurement.** No route-A number appears anywhere below as a comparator, and none of route A's measured cells has been used to set a value, a ceiling or an expectation here.

**Because §0's numbers were seen, every quantity in §3 that derives from them is labelled an *expectation*, never a prediction of a novel result, and no number in this document is a claim (§1).**

**Fixture-drive confound (standing, `AUTONOMY.md` §15a).** This piece measures against the 5 GB hero-slice fixture, so the drive is a confound and must be stated. The spike's own 5 GB reads were from **C:** — its disk-discipline accounting tracks `C:` free space before and after every 5 GB step (`spikes/lod-feasibility/README.md:64-75`). The 5 GB fixture has since been migrated between drives; **the drive each measured run reads from is recorded here, in this section, before any number from that run is reported**, and a number taken on one drive is never differenced against a number taken on the other.

**One further disclosure.** No pilot tier has been built. Route B **never wrote output of any kind** in the spike (`:108-110`, `:252-253`), so every statement below about a tier *writer* is written with no evidence at all behind it — §5 registers that as its own prediction with its own falsifier rather than letting it pass as assumed.

---

## §1. What this preregistration may and may not claim

- **No performance claim, and no `docs/08` row is proposed, added or amended by this piece.** Wall time is *measured and reported* (§6), never asserted. Every figure quoted from the spike is a single-run, single-sample spike measurement — the spike says so itself (`:79-80`: "All numbers below are single-run spike measurements (one sample each, not a p50/p95 series)") — and a single sample is not a p50/p95, so no spike figure may become a budget, a baseline or a regression threshold here.
- **The one `docs/08` budget this piece is scored against already exists and is unchanged:** "Cancellation acknowledged < 100 ms, any operation (01)" (`docs/08:8`), whose meaning is ADR-018's — scored on `cancel_requested → cancel_observed` on the producer's clock, p50/p95 carrying the verdict, `cancel_quiescent` reported beside it with no budget (`ADR-018:45-47`, `:56-59`). No cancellation vocabulary is coined or drifted here.
- **No `docs/08` Polygons-row claim.** The Polygons benchmark-matrix row is "100k features / 10M vertices" (`docs/08:31`); `polygons-100k` matches it by construction (`spikes/lod-feasibility/README.md:43`), and this piece measures *on* that fixture without asserting anything *about* that row.
- **No route-A comparison, of any kind.** Route A is out by ruling (§0 item 6). "Route B is faster/slower than route A" may not be written, implied, or inferred from any table produced under this preregistration.
- **Never "zero-copy."** Copies are measured and minimized, not assumed absent (`ADR-004:17`). The tier writer's copy behaviour is described as copy-minimized or not described at all.
- **No wire change.** No SKP command, parameter, field or version; no data-plane frame; no MCP surface. A tier is never carried on the control plane as bulk data (`ADR-004:17-18`).
- **No ADR is amended here**, and no ADR's status is changed. ADRs cited: 004, 005, 009, 010, 016, 018, 021, 026, 028, 030, and 031 as the reserved number this feeds.
- **Wording of any user-visible string is the human's.** The typed label and refusal *names* declared in §2 and §7 are identifiers, not user-facing prose; any string an operator reads goes to the human before it ships.
- **Tier *selection* — which tier a viewport draws — is not decided, designed or implemented here.** It is renderer/shell work under its own gate (§5, declared unchanged).

---

## §2. The rule — stated before it is applied

### 2a. Route and simplifier

**Route B (Rust `geo`) is the only candidate.** Route A is excluded by the human's ruling of 2026-09-15, on principle, before any measurement (`DECISIONS-PENDING.md:22`). No dual-arm campaign is run; there is one arm.

**Pre-committed choice: the simplifier is `geo::SimplifyVwPreserve` (topology-preserving Visvalingam–Whyatt). RDP (`geo::Simplify`) plus a written degenerate-ring-removal step is the alternative, and it is rejected.**

Reasoning:

1. **VW-preserve returned 0 invalid in every spike run in which it was used** — all three `polygons-100k` `preserve` rows (`spikes/lod-feasibility/README.md:115`, `:117`, `:119`) and the 5 GB `preserve`/1.0 row (`:142`) — and, per feature, it removes the exact five failures RDP produced, with zero validation errors on every one (PR #80, `:576-586`).
2. **RDP's failure mode is structural in `geo`, not incidental to a tolerance.** The divergence explanation shows both engines' RDP reduces the same hole to the same degenerate 3-vertex chord (PR #80, `:393-403`); GEOS then *drops* the collapsed ring (`transformLinearRing` returns `nullptr` because a `< 4`-point sequence is no longer a `LinearRing` — `:456-486`), while `geo` **refuses the cull wholesale** at `POLYGON_INITIAL_MIN = 4` (`:372-378`, `:549-565`) and emits a ring that crosses itself. `geo` has no facility to drop a collapsed hole. The spike's own summary sentence: "GEOS then *removes* the collapsed ring … `geo` instead *refuses the cull* … The divergence is entirely in ring-level post-processing, on both sides." (`:567-571`).
3. **Therefore choosing RDP means writing the missing post-processing ourselves** — degenerate-ring detection and removal, and, for whatever that does not fix, the equivalent of GEOS's conditional `buffer(0.0)` area repair (`:487-502`). That puts the product on the same footing as GEOS's post-processing while carrying none of GEOS's decades of adversarial exposure, as new code on the geometry-correctness path, with no oracle in-tree to check it against (`docs/08:46,53-54` names GEOS as the geometry oracle — and route A's GEOS is out by ruling, so that oracle is not available to this piece). That is a larger correctness surface than the human's stated prior admits: "B preferred (pure Rust, statically linked, **small licence surface**)".
4. **The choice is honest about what it is not.** VW-preserve is a different algorithm family from RDP (`:57-60`, `:588-590`), so this is not "RDP with a fix"; the tier ladder's reduction behaviour is VW's, and §3's expectation ranges are taken from VW's own measured rows only.

**Falsifier for this choice, declared now:** *any* invalid Polygon emitted by `SimplifyVwPreserve` at any ladder tolerance on either fixture in §3. The spike states the limit precisely — `geo`'s own doc says "attempting to preserve", not "guarantees" (`geo-0.33.1/src/algorithm/simplify_vw.rs:522`, quoted at PR #80 `:592-593`), and the spike lists as explicitly **unverified** "that `SimplifyVwPreserve` cannot produce an invalid Polygon on inputs outside these five" (`:635`). If the falsifier fires, the piece **stops and returns to the human** (§5, I2); a post-processing step is not added silently to rescue the choice, because doing so would convert this pre-committed choice into the alternative it rejected, after the fact.

### 2b. Open question 1 — tier count and basis

**Pre-committed choice: a fixed tolerance ladder of three derived tiers, over tier 0 = the source itself.** Tier 0 is the unsimplified source and is always the identity and geometry of record; tiers 1–3 are derived artifacts and are never authoritative for anything (the same relationship `ADR-010:62-68` states for any cache: "A renderer cache is **derived** from committed authoritative state. It is never the system of record").

Reasoning: a fixed ladder is a **declared** constant at its own site (`ADR-010:70-74`, "Capacity ceilings are declared, not discovered"); a data-driven tier count is a value discovered from the data at build time, which (a) makes the artifact set a function of the input rather than of the recipe, capping the reproducibility grade every containing workflow may claim (`docs/01:9`, ADR-005), and (b) has no declared site to state it at. Three, because three is what the spike actually exercised (`:53-54`), so §3's expectations are about the same quantities the ladder builds.

**Alternatives rejected:** *data-driven count* (per the above); *fixed count with a per-dataset fitted ladder* (same defect, one level down — the tolerances become discovered); *a deeper ladder* (untried at any scale; a fourth tier may be added later only by a preregistered measurement, never by amendment).

### 2c. Open question 2 — tolerance units

**Pre-committed choice: tolerance is a typed length in the source CRS's own linear unit, declared in metres and converted explicitly. Never screen pixels. A source whose CRS has no declared linear unit is refused.**

Concretely:

- The ladder (§7) is declared **in metres**.
- For a source CRS whose linear unit is not the metre, the conversion factor is read from that CRS's PROJJSON definition as supplied under **ADR-026** (pinned, content-hashed, in-tree, never fetched at runtime), the conversion is performed explicitly, and **the factor, its source entry id and content hash are recorded on the tier** — an explicit, logged transform (`docs/01:14`, principle 8: "Every transform — including CRS reprojection — is explicit, logged, and inspectable").
- A source whose CRS is **geographic / angular** is **refused** for tier building, typed: `engine.lod_crs_not_linear`. A tolerance in degrees is not a length, and simplifying by one is precisely the units-unaware measurement `docs/01:21` forbids ("Measurements are units-aware — 'area in degrees²' is unrepresentable"). This refusal is scoped: whether EPSG:4326 is admitted at all is **ADR-032's open decision**, and this refusal neither pre-empts nor depends on it — if 4326 becomes admissible, an angular-CRS tier still needs its own decision, and this refusal is the place it will be taken.
- A source whose CRS definition declares no linear-unit conversion factor is refused, typed: `engine.lod_crs_unit_undeclared`. No default factor is assumed (principle 8).

Reasoning against **screen pixels at a reference zoom/DPI**, the rejected alternative: it requires a display scale to exist at *build* time, in the engine, which the module boundary forbids — the data engine is "DuckDB + Arrow, connectors, CRS engine, data doctor" (`engine/src/layout.rs:41-42` quoting `docs/02`) and knows nothing of a viewport; it bakes an assumed display into a durable artifact, a discovered constant wearing a declared one's clothes (`ADR-010:70-74`); and it performs a CRS-units→pixels conversion invisibly inside a file, which is the silent conversion `docs/01:21` exists to prevent.

**Where pixels do belong, stated so the boundary is not lost:** the CRS-length→pixel mapping happens at **selection** time, in the client, through the visible map-view transform — `docs/01:21`'s "**display** reprojection happens only through an explicit, visible map-view transform". Build in CRS units; select in pixels through the view transform. Selection is out of this piece's scope (§1, §5).

### 2d. Open question 3 — where tiers live on disk, and the `layout.rs` interaction

**Pre-committed choice: one GeoParquet file per tier, in a sidecar directory keyed by the source's content hash, with a plain-text `tiers.json` manifest. Row order is the source's own identity order, unchanged.**

- **One file per tier.** Rejected alternative: *a single file with a tier/level column* — every tier's scan would then read past every other tier's rows, and `docs/07:22` records this measured to a close: "spatial pruning is a property of layout, not of any index", with an unordered source getting "no pruning at all". A level column would also make invalidation all-or-nothing: one tier's rebuild rewrites every tier's bytes.
- **Sidecar directory keyed by the source content hash**, not by filename — `docs/05`'s grid argument as `engine/src/index.rs:166-168` already applies it: "grids are identified by content hash, not filename. A grid substituted under the same name is a different transformation."
- **`tiers.json` is plain, diffable text** (`docs/01:24`, "Plain text everywhere"). It is a manifest, not a data path, so JSON is admissible here and nowhere near the geometry (`ADR-004:17`, "No JSON on the hot path"). Per tier it records: tolerance in metres and in the source CRS's unit with the conversion factor and its ADR-026 provenance; the source content hash; `LOD_BUILDER_VERSION`; the simplifier name; the identity column; feature count; vertex count before and after; output path and that output's own SHA-256.
- **Interaction with `engine/src/layout.rs`, ruled explicitly so it cannot be smuggled:** **the tier writer does not reorder rows.** It writes in the source's own identity order — the discipline `ClusterOrder::SourceIdentity` exists to enforce (`layout.rs:101-108`: "so it differs from a clustered variant by the row order and by literally nothing else") — so that a tier differs from its source by geometry simplification **and nothing else**, which is what makes any later comparison between them mean anything (`layout.rs:16-27`, the writer-plus-order confound that module was built to control). `layout.rs` itself stays exactly where it is: behind the `fixture` feature, "Test support, feature-gated, never a product path" (`layout.rs:39-47`), and the **preregistered import-layout gate FAILED** (`docs/07:22`: "layout stays out of the import path; no ADR was filed"). Hilbert-ordered tiers are therefore **not** taken here; if a later measurement wants them, that is its own preregistered gate against `docs/07:22`'s three named reopen conditions, never a rider on this one.

### 2e. Open question 4 — invalidation on source-content-hash change

**Pre-committed choice: a tier is found by path and admitted by key; a tier whose key does not match the source's current content hash is a miss with a recorded reason and is NEVER SERVED. Rebuild is lazy, on next request, as a cancellable progress-reporting operation. The stale label is declared and reserved now so that no later change can serve a stale tier silently.**

This is the engine's existing machinery, applied one artifact across, not new machinery:

- **Key.** `LodTierKey { source_content_hash, builder_version, tolerance_metres, simplifier, id_column }` — "The identity of a derived artifact: what it was built **from**, **by**, and **for**" (`engine/src/index.rs:159-163`), with every member in `PartialEq` "so a mismatch cannot be missed by a caller that forgot to compare one" (`:161-163`). `source_content_hash` is the SHA-256 of the whole source file (`index.rs:103-104`; `dataset.rs:542-545`).
- **Admission.** The `IndexCache` rule verbatim (`engine/src/dataset.rs:516-519`): "A cached index is *found* by path and *admitted* by content hash, builder version, answered predicate, build parameters and a fail-closed validity heuristic — so a stale index cannot serve a newer revision; it is found, rejected, and the reason is in the report." A tier miss carries the same three reasons as `IndexMiss` (`index.rs:229-236`): `Absent`, `KeyMismatch`, `SourceChanged`.
- **The cheap gate stays a heuristic and never an identity.** path + mtime + size gates *whether the hash is recomputed*; it is "a validity heuristic and never an identity … It exists so a cached index can be discarded cheaply, never so one can be *served* as though it were content-keyed — hence `fail_closed`" (`index.rs:193-199`). A heuristic mismatch **discards**; it never admits.
- **Rebuild is lazy, on next request**, and is an operation under `docs/01:13` principle 7 — cancellable, streaming, progress-reporting — exactly as the identity scan is (`index.rs:283-284`). **Not synchronous at open** (hashing 5 GB at open blocks the open path, `docs/01:20`). **Not a background job in v0** — a background job needs a scheduler, a priority policy and a cancellation owner this piece does not design; declared out of scope rather than assumed.
- **Is a stale tier ever served? No — and the label exists anyway.** `ADR-010:62-68` rule 5: "**Staleness is signalled, never silently served.** Any window in which the renderer can return a pick result, a coordinate, or a visibly rendered geometry from state it knows to be behind the committed state is a **named hazard requiring a visible signal**." Because v0 serves no stale tier, no signal is *needed* today — which is exactly the condition under which a future change quietly starts serving one. So the label is **declared and reserved now: `lod.tier_stale`**, a typed status that must ride every batch originating from a tier whose key does not match, and the type is shaped so a stale-tier batch **cannot be constructed without it** (structural, not editorial — the ADR-027 discipline). Any code path that serves a stale tier without `lod.tier_stale` is a block-on-sight (§8).

**Alternatives rejected:** *synchronous rebuild at open* (blocks the canvas, `docs/01:20`); *background job* (undesigned, out of scope); *serve stale-then-refresh* (permitted by rule 5 only with the visible signal, and the signal's shell surface does not exist yet — so it is not taken, and the label reserved instead of half-built).

### 2f. Open question 5 — relation to ADR-028's residency budget

ADR-028's item 5, quoted verbatim (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:37-38`):

> "5. Completeness at overview scales is NOT delivered by this decision; LOD/aggregation is
>    separate and owes its own preregistered gate."

**Pre-committed choice: a resident LOD tier's vertices are CHARGED against the same `MAX_RESIDENT_VERTICES` budget, at its existing declared value, unchanged. LOD does not redefine "over budget."**

Reasoning: the ceiling bounds a real, per-vertex cost that is identical whichever tier a vertex came from — the authoritative f64 array, the f32 render doubling, and the render-layer cache's third `[x, y]` copy (`frontends/shell/src/canvas/limits.ts:22-43`), all of which are properties of a resident vertex, not of its provenance. A tier reduces *how many* vertices a viewport needs; it does not make one cheaper. Charging tier vertices to a separate or larger budget would be the move that lets a partial view be presented as complete — which `ADR-028:31-32` rule 2 forbids and item 5 declines to deliver. The value stays `MAX_RESIDENT_VERTICES = 2_000_000` (`limits.ts:45`), untouched by this piece, and is not raised on the argument that tier vertices are "cheaper" — a ceiling is declared, not re-derived from a convenience (`ADR-010:70-74`).

**What changes, and what does not:** at overview zooms a tier may make a view *fit* where the source did not. "Fits" remains an outcome measured against the same ceiling, **not a new definition of over-budget**. But a view that is complete *at tier 3* must never read as complete *at the source* — that is the same silent-substitution hazard as rule 5's. So a second label is declared and reserved: **`lod.tier_resident{tier}`**, shown beside the existing rendered/total status (`residencyStatus.ts`), naming which tier is resident.

**Boundary, stated so this answer binds without this piece over-reaching:** both labels are declared here; **their shell surface is not built by this piece** and is named as owed, under its own gate. Until that surface exists, **no tier is served to the shell at all** — this piece builds and validates tiers in the engine and ships no selection, no residency change and no renderer code (§5, declared unchanged).

**Alternatives rejected:** *orthogonal / uncharged* (a resident tier vertex costs exactly what a resident source vertex costs); *redefines over budget* (contradicts `ADR-028:31-32` rule 2 and would be an amendment to an Accepted ADR, which this document may not make).

---

## §3. Fixtures — pre-declared outcomes

Both fixtures are hash-verified before and after every run. Quoted verbatim from `spikes/lod-feasibility/README.md:41-44`:

| Fixture | Path | Bytes | Features | Vertices | Geometry / CRS |
|---|---|---|---|---|---|
| `polygons-100k` | `target/fixtures/slice-budgets/polygons-100k.parquet` | 151,812,642 | 100,000 | 10,467,093 | Polygon, EPSG:2056 (matches docs/08's Polygons benchmark-matrix row: "100k features / 10M vertices") |
| `parcels-5gb` | `target/slice-evidence/scale-pass/parcels-5gb.parquet` | 5,004,376,705 | 3,300,000 | 345,507,850 | Polygon, EPSG:2056 |

Both store `geometry` as standard GeoParquet WKB and carry an `id` column (`UBIGINT`) as the identity column (`:46-49`).

### Pre-declared outcomes

| # | Outcome | Class | Fixture(s) | Pre-declared value |
|---|---|---|---|---|
| O1 | **Validity** — `geo::Validation::is_valid()` on every written tier feature | **HARD GATE** | both, every ladder tolerance | **0 invalid.** Any non-zero fires §5's I2 and stops the piece. |
| O2 | **Identity** — every source `id` appears exactly once in every tier, no duplicates, no drift | **HARD GATE** | both, every ladder tolerance | **preserved on every row**, verified over the whole tier, per ADR-016 §5's discipline (`ADR-016:81-90`) — over the *mapped/emitted* values, not the source column, and cancellable because it reads a whole column |
| O3 | **Engine can open its own tier** — the written tier passes the engine's own open gates R-P1–R-P6 (`engine/ADMISSION-PREREGISTRATION.md:41-47`) | **HARD GATE** | both | opens, with `geo` metadata, WKB encoding and Polygon geometry type admitted |
| O4 | **Row order** — the tier's row order equals the source's identity order | assertion | both | identical (§2d) |
| O5 | **Vertex reduction** | **EXPECTATION, not a claim** | see below | see below |
| O6 | **Wall time** | **measurement, reported only** | both | p50/p95 per arm, per §6 |
| O7 | **`cancel_requested → cancel_observed`** | **measurement, against `docs/08:8`** | `parcels-5gb` | p50/p95 within `LOD_CANCEL_OBSERVED_CEILING_MS` (§7); max always reported |
| O8 | **Tier set disk footprint** | assertion against a declared ceiling | both | within `LOD_TIER_SET_MAX_BYTES` (§7) |

**O5 — the vertex-reduction expectations, labelled.** These are **expectations carried over from the spike's seen numbers (§0), not predictions of a novel result and not claims.** They are `SimplifyVwPreserve` rows only (route A's rows are excluded by §1). A measured value outside an expectation is a **recorded deviation** with its reason, never an edit to this table (`docs/PREREGISTRATION-TEMPLATE.md:106-109`).

| Fixture | Tolerance (m) | Expected reduction | Seen at (spike cite) |
|---|---|---|---|
| `polygons-100k` | 0.1 | ≈ 0.037 | `:115` (10,467,093 → 10,078,396, 0.0371) |
| `polygons-100k` | 1.0 | ≈ 0.270 | `:117` (10,467,093 → 7,642,017, 0.2699) |
| `polygons-100k` | 5.0 | ≈ 0.667 | `:119` (10,467,093 → 3,491,136, 0.6665) |
| `parcels-5gb` | 1.0 | ≈ 0.270 | `:142` (345,507,850 → 252,277,009, 0.2698) |
| `parcels-5gb` | 0.1, 5.0 | **no expectation** | never run at those tolerances on this fixture by the spike |

**O6 — wall time, and why the spike's numbers cannot be reused.** Four independent reasons, each sufficient on its own:

1. **They are single samples.** "All numbers below are single-run spike measurements (one sample each, not a p50/p95 series)" (`:79-80`). `docs/08` scores p50/p95; a single sample has neither.
2. **They exclude the write.** Route B "No output GeoParquet is written by route B in this spike" (`:108-110`); the tier builder writes one. The measured interval is a different interval.
3. **The thread-count confound is in them and must be removed here.** Route B "simplifies each `geo::Polygon` in a **single thread, sequentially, row group by row group** — no parallelism was used or measured" (`:34-37`). This piece therefore declares **both arms explicitly**, so parallelism is a declared variable rather than a confound:
   - **Arm S — single-threaded baseline**, one worker, the reference point every later number is read against.
   - **Arm P — declared worker count**, `LOD_BUILD_WORKERS` (§7), a declared constant at its own site, never "all available cores" and never discovered from the machine.
   Both arms run on both fixtures. Neither arm's number is compared to any route-A number (§1).
4. **The drive is a confound** (`AUTONOMY.md` §15a; §0 above). The spike read `C:`; the run records its own drive in §0 before reporting.

**Disk discipline (inherited from the spike, `:64-75`, and binding here).** Never two 5 GB-scale outputs on disk at once. Each tier of the 5 GB ladder is built, measured, hash-recorded, then deleted before the next; free space is recorded before and after each step and the directory listed empty after each deletion. `LOD_TIER_SET_MAX_BYTES` (§7) is an assertion about the *ladder's* total, checked arithmetically from the per-tier sizes, not by holding the whole ladder on disk.

---

## §4. Tests, and the mutation per new test

Every test below is new. Each carries **one mutation that makes it fail by name**, verified mechanically as a pre-gate self-check.

| # | Test | Mutation that makes it fail by name |
|---|---|---|
| T1 | `tier_build_emits_zero_invalid_polygons` — O1's hard gate, both fixtures, every ladder tolerance | Replace `SimplifyVwPreserve` with `geo::Simplify` (RDP) at tolerance 5.0 on `polygons-100k`. Expected failure: 5 invalid, ids 37926/40320/61222/70483/74445 (PR #80 `:345-351`), each `interior ring at index 0 has a self-intersection`. |
| T2 | `tier_preserves_identity_for_every_row` — O2's hard gate | Drop the final feature of one row group in the writer. Expected failure: the id set-difference is non-empty and the test names the missing id. |
| T3 | `engine_opens_its_own_tier` — O3's hard gate | Omit the `geo` key from the written tier's Parquet footer metadata. Expected failure: `EngineError::GeoMetadata` at open (R-P2, `dataset.rs:684-686`), named by the test. |
| T4 | `tier_is_not_served_when_source_content_hash_changes` | Remove `source_content_hash` from `LodTierKey`'s `PartialEq`. Expected failure: a tier built from the old bytes is admitted for the mutated source — the exact defect `index.rs:161-163` exists to prevent. |
| T5 | `a_stale_tier_batch_cannot_exist_without_the_stale_label` — structural | Add a second constructor for a stale-tier batch that does not set `lod.tier_stale`. Expected failure: the test asserting the label-free constructor does not exist fails to compile / fails by name. |
| T6 | `cancel_observed_within_the_declared_ceiling` — O7, `parcels-5gb` | Move the cooperative check from per-feature back to the row-group boundary (the spike's own shape). Expected failure: observed latency exceeds `LOD_CANCEL_OBSERVED_CEILING_MS` by orders of magnitude — the spike measured 9.952 s with 3 of 403 row groups processed (`:169-172`). |
| T7 | `tier_writer_does_not_reorder_rows` — O4, guards §2d | Change the writer's row order (any permutation). Expected failure: the identity-order assertion fails naming the first differing row. |
| T8 | `geographic_crs_source_is_refused_for_tier_building` | Delete the angular-unit check. Expected failure: a source in a geographic CRS is accepted and a degrees-valued tolerance passes into the simplifier, instead of `engine.lod_crs_not_linear`. |
| T9 | `crs_without_a_declared_linear_unit_is_refused` | Default the missing conversion factor to 1.0. Expected failure: the refusal `engine.lod_crs_unit_undeclared` does not fire. |
| T10 | `tier_larger_than_its_source_is_refused` — O8 | Remove the size comparison. Expected failure: a tier exceeding its source's byte size is written instead of `engine.lod_tier_larger_than_source`. |

---

## §5. Registered predictions · declared unchanged · invalidators · falsification

### Registered predictions (wrong is a result)

- **P1.** `SimplifyVwPreserve` produces **0 invalid** at every ladder tolerance on both fixtures. *Falsifier:* one invalid feature. Consequence if false: §2a's pre-committed choice is falsified and the piece stops (I2).
- **P2.** Identity is preserved on every row of every tier. *Falsifier:* any missing, duplicated or drifted id. The spike's basis: both routes carry `id` as a passthrough "never touched by the simplification call — so a 1:1 row correspondence is structural, not incidental" (`:196-200`) — but the spike's route B **never wrote a file**, so the writer's own row correspondence is untested and P2 is a real prediction about new code.
- **P3 — the tier writer is unbuilt, and this is registered rather than assumed.** The spike wrote **no output at any point** on route B: "No output GeoParquet is written by route B in this spike … so 'route B can write a GeoParquet tier' is **untested**, not confirmed" (`:108-110`), and `wkb::writer` "exists in the pinned `wkb` crate but was never exercised" (`:108-110`, `:238`). Prediction: the writer round-trips — every simplified geometry, re-read from the written tier, is identical to the in-memory `geo::Polygon` it was written from (ring count, vertex count, coordinates bit-identical), and the tier opens under O3. *Falsifier:* any re-read discrepancy, or a tier the engine refuses to open. This prediction has **zero evidence behind it**; a failure here is an ordinary result, not a surprise.
- **P4.** Vertex reduction lands within O5's expectation ranges. *Falsifier:* outside the range → recorded as a deviation with its reason; the expectation is never edited to match.
- **P5 — direction only, no number.** Arm P's wall time is lower than arm S's on both fixtures. *Falsifier:* it is not. **This prediction may not be restated anywhere as a performance claim, and no figure attaches to it in this document** (§1); the tester reports p50/p95 for both arms and the comparison is read from those, never asserted here.
- **P6.** Per-feature cooperative cancellation meets `docs/08:8` where the row-group-grained design did not. *Falsifier:* p95 outside `LOD_CANCEL_OBSERVED_CEILING_MS` → I3.

### Declared unchanged

- **No SKP command, parameter, field or version; no data-plane frame; no MCP surface.**
- **`MAX_RESIDENT_VERTICES` = 2_000_000, unchanged** (`limits.ts:45`); no shell, renderer or residency code in this piece.
- **`engine/src/layout.rs` unchanged**, and no product path reaches it (`layout.rs:39-47`); the failed import-layout gate is not reopened (`docs/07:22`).
- **ADR-021's admission path untouched** — nothing in this piece runs caller-authored SQL, and the security property stands as recorded: "the predicate-admission parser is statically linked, and admission performs no runtime extension fetch of any kind" (`ADR-021:123-133`). **This piece adds no runtime fetch of any kind, of any artifact**: `geo`, `wkb` and `geo-traits` are statically linked Rust crates; no extension, no download, no filesystem write outside the declared tier directory.
- **No CRS is transformed.** Tier building performs no reprojection; the only CRS arithmetic is the declared, logged linear-unit conversion of §2c.
- **No ADR amended, no ADR status changed, no `docs/08` row added or amended.**
- **Tier selection, residency integration and both labels' shell surfaces are not built here** — named, owed, under their own gate.

### Invalidators — these stop the piece

- **I1 — the Arrow 58 vs 59 reconciliation.** The workspace pins one Arrow version, verbatim from the repo-root `Cargo.toml` (lines 41–45, the `[workspace.dependencies]` arrow pin — not the `engine/Cargo.toml` a directory-relative cite would name):
  > "# One Arrow version across the workspace. Pinned to what `duckdb` 1.10505 itself depends on — a
  > # second arrow major in the tree would make `RecordBatch` two incompatible types and force a
  > # re-encode at the engine/protocol boundary that ADR-004's copy-minimized clause would then have to
  > # account for.
  > arrow = { version = "58", default-features = false, features = ["ipc"] }"

  The spike's crate "resolved to Arrow 59.3.0 because it is deliberately standalone and unconstrained by that pin; reconciling the two versions is a real, unresolved question, not a detail" (`:249-252`). **Pre-committed resolution: the product does not take Arrow 59.** The tier writer uses the in-tree `parquet = "58"` (`engine/Cargo.toml:37`) against the workspace's Arrow 58, and `geo` / `wkb` / `geo-traits` must resolve **without** pulling a second Arrow major. **Gate step, before any code and before any `cargo add`:** resolve the three crates against the workspace and record the resolution. **If any of them forces a second Arrow major into the tree, the piece stops and returns to the human** — no bump, no dual-major tree, no re-encode at the engine/protocol boundary.
- **I2 — any invalid output** at any ladder tolerance (P1's falsifier). Stop; return to the human with the per-feature evidence. A post-processing step is **not** added to rescue the simplifier choice (§2a).
- **I3 — cancellation p95 outside the declared ceiling.** Stop. The ceiling is not raised silently; ADR-018's acceptance clarification is binding — "achieved typically" can never attach to a failed p95.
- **I4 — licence.** Any of the three crates, **or anything in their transitive closures**, resolving to other than a licence compatible with `AGPL-3.0-or-later` core (`ADR-009:16`). Stop.
- **I5 — the dependency is not approved.** This document approves nothing (C3, quoted in the header). If the human does not rule the crate set in, the piece does not start.
- **I6 — disk.** Insufficient free space to build the 5 GB ladder one tier at a time under §3's disk discipline. Stop and report; no measurement is taken on a constrained volume.

### Falsification of the whole preregistration

If `SimplifyVwPreserve` emits an invalid Polygon at a ladder tolerance on either fixture, **this preregistration's central pre-committed choice is wrong**: route B's simplifier question reopens with "RDP + a written degenerate-ring-removal step" as the live alternative, on a materially larger correctness surface than §2a weighed, and the choice returns to the human. If the tier writer cannot round-trip (P3), route B's *product* viability — as distinct from its measured simplification behaviour — is unestablished, and the human's prior ("B preferred … unless its output validity cannot be established") is the text that governs what happens next.

---

## §6. Instruments

| Quantity | Class | How |
|---|---|---|
| Invalid-output count | **assertion** (structural) | `geo::Validation::is_valid()` per feature; on failure, `validation_errors()` rendered through `InvalidPolygon`'s `Display` — the same instrument the divergence section used, whose API shape is recorded at PR #80 `:331-337` (`geo` 0.33.1 has **no** `explain_invalidity()`) |
| Identity round-trip | **assertion** | whole-tier id set compared against the source's, over the emitted values (ADR-016 §5's discipline, `ADR-016:81-90`) |
| Tier key match / miss reason | **assertion** | `LodTierKey` equality; miss reason one of `Absent` / `KeyMismatch` / `SourceChanged` (`index.rs:229-236`) |
| Stale label presence | **assertion** (structural) | the type cannot be constructed without it (T5) |
| Row order | **assertion** | positional comparison against the source |
| Output bytes per tier, ladder total | **assertion** against a declared ceiling (§7), **never a budget** | file size; SHA-256 recorded in `tiers.json` |
| Vertex counts before/after | **assertion** | ring-vertex count, the same counting the spike cross-checked exactly against route A (`:127-128`) |
| Build wall time, arm S and arm P | **measurement** | p50/p95 over a declared sample count, per fixture, per tolerance, per arm; dataset named; **drive named in §0** |
| `cancel_requested → cancel_observed` | **measurement**, against `docs/08:8` | ADR-018 §2 — p50/p95 carry the verdict, max always reported, `cancel_quiescent` reported beside with no budget (`ADR-018:45-47`, `:56-59`) |
| Max single-feature simplify time | **measurement** | the declared cancellation residual of §7; reported so the residual is a measured fact, not a hope |

**The numbers are the tester's.** Per `CLAUDE.md`'s workflow, the tester agent fills the results table; no measured figure enters this document, ADR-031, or any commit message except through that gate (§9).

---

## §7. Declared values and ceilings

Every value below is **declared, not discovered** (`ADR-010:70-74`), and lives at its own site in code with this document cited beside it.

| Constant | Value | What it bounds / means |
|---|---|---|
| `LOD_TOLERANCE_LADDER` | `[0.1, 1.0, 5.0]` **metres** | The three derived tiers' tolerances (§2b, §2c). Converted explicitly to the source CRS's linear unit, with the factor and its ADR-026 provenance recorded (§2c). Revisable only by a preregistered measurement, never by amendment. |
| `LOD_TIER_COUNT` | `3` | Derived tiers, over tier 0 = the source. Derived from the ladder's length; asserted equal to it. |
| `LOD_BUILDER_VERSION` | `1` | Part of `LodTierKey`; a builder change invalidates every tier it built (`index.rs:170`'s role). |
| `LOD_BUILD_WORKERS` | `8` | Arm P's declared worker count. Eight because the reference machine is 8C/16T (`spikes/lod-feasibility/README.md:64`) — **a declared choice recording that fact, never "all available cores"** and never read from the machine at runtime. Arm S is fixed at 1. |
| `LOD_CANCEL_CHECK_FEATURES` | `1` | The cooperative cancellation check runs **once per feature**, plus once per row-group boundary. The spike's row-group-only design measured a 9.952 s detection latency (`:169-172`) — two orders of magnitude outside `docs/08:8` — which is the reason this granularity is declared here and mutation-guarded by T6. |
| `LOD_CANCEL_OBSERVED_CEILING_MS` | `100` | `cancel_requested → cancel_observed`, p50 and p95, per `docs/08:8` and ADR-018 §2. **Declared residual, stated rather than discovered:** a single feature's `SimplifyVwPreserve` call has no interruption point inside it, so one pathological feature can exceed the ceiling on its own. The max single-feature simplify time is therefore measured and reported beside the p95 (§6); the ceiling is never raised to accommodate a measurement (I3). |
| `LOD_TIER_MAX_RELATIVE_BYTES` | `1.0 × source bytes` per tier | A "simplified" tier larger than its own source is a defect, not a tier → `engine.lod_tier_larger_than_source` (T10). |
| `LOD_TIER_SET_MAX_BYTES` | `2.0 × source bytes` for the whole ladder | Disk ceiling for the three-tier set → `engine.lod_tier_set_over_disk_ceiling`. **Derivation, labelled an expectation:** the only per-tier output-size ratios anywhere in evidence are route A's three 5 GB `preserve` runs, 0.9214 + 0.5740 + 0.0987 ≈ 1.594 (`:100-103`) — route A's, not route B's, since route B wrote nothing; 2.0 sits above that with margin. Checked arithmetically per §3's disk discipline, never by holding the ladder on disk. |

**Typed refusals declared here** (identifiers, not user-facing strings — §1): `engine.lod_crs_not_linear`, `engine.lod_crs_unit_undeclared`, `engine.lod_tier_larger_than_source`, `engine.lod_tier_set_over_disk_ceiling`. **Typed labels declared and reserved here:** `lod.tier_stale` (§2e), `lod.tier_resident{tier}` (§2f).

---

## §8. Block-on-sight — for the human, one by one

1. **The dependency decision is the human's and is NOT taken by this document.** C3, quoted in the header: *"No dependency is approved by this ruling; spike-only dependencies stay spike-only; the product dependency decision rides the preregistration's ruling."* The proposal to rule on, quoted from the spike's dependency table (`spikes/lod-feasibility/README.md:237-239`):

   | Crate | Version | Role |
   |---|---|---|
   | `geo` | 0.33.1 | `Simplify` (RDP) and `SimplifyVwPreserve` (topology-preserving VW) algorithms |
   | `wkb` | 0.9.2 | WKB decode (read-only; `wkb::writer` exists, unused/unexercised here) |
   | `geo-traits` | 0.3.0 | `ToGeoGeometry` conversion from `wkb`'s zero-copy reader types to `geo_types::Geometry` |

   **`wkb`'s role widens** relative to the spike: the tier writer needs `wkb::writer`, which the spike never exercised (`:238`, P3).
   **`parquet` and `arrow` at 59.3.0 are NOT proposed** (I1). The tier writer uses the already-in-tree `parquet = "58"` against the workspace's `arrow = "58"`.

2. **A second, separate dependency-surface change, needing its own word:** `parquet` is today `optional = true`, reachable only through the `fixture` feature (`engine/Cargo.toml:13`, `:37`), whose comment records the reason — "Test support only — gated so it cannot be reached from the shipped path by accident (docs/02 does not scope a synthetic generator to this module)". The tier writer needs it on the **shipped** path. Proposal: `parquet = "58"` becomes non-optional; the `fixture` feature keeps gating the **synthetic generator** and simply stops carrying `dep:parquet`. This introduces no new crate, but it changes **which crates are in the conveyed artifact**, so it reaches ADR-030's notice set (item 4 below) and is not a patch-level bump under `DECISIONS-PENDING.md:48` (C4).

3. **Licence surface, as stated by the spike and as gated here.** The spike's sentence, verbatim (`:232-233`): *"all resolved by `cargo add` from crates.io on 2026-09-13, all MIT-OR-Apache-2.0, compatible with the workspace's `AGPL-3.0-or-later`"*. **Gate step, before any add:** the three crates' licences **and their full transitive closures** are verified in `cargo metadata` and recorded — the spike stated the five named crates only, not their transitives, so "small licence surface" (the human's prior) is **not yet established below the top level**. Any incompatibility fires I4.

4. **ADR-030 consequence, checked at the gate.** Adding crates to a shipped crate changes every conveyed artifact's notice set: "Every conveyed artifact enumerates every third-party work it actually carries, generated from that artifact's own build manifest — no artifact ships with a named gap" (`ADR-030:32-37`). The notice generator's output is regenerated and checked, and the lockfile diff read for new entries, in the same PR (`DECISIONS-PENDING.md:48`, C4's own conditions).

5. **A stale tier served without `lod.tier_stale`** — any code path, in any diff. Blocks on sight (`ADR-010:62-68` rule 5).

6. **A tier treated as authoritative** for identity, geometry, picking or export. Tier 0 (the source) is the record; a tier is derived state (`ADR-010:62-68`).

7. **Any tolerance expressed in pixels, or any pixel↔CRS conversion inside the engine** (§2c).

8. **Any row reordering by the tier writer**, or any product path reaching `engine/src/layout.rs` (§2d, `docs/07:22`).

9. **`MAX_RESIDENT_VERTICES` changed by this piece**, or any second residency budget introduced for tier vertices (§2f).

10. **Any performance claim, `docs/08` row, or route-A comparison** appearing in code comments, commit messages, the results table, ADR-031, or this document (§1).

11. **A second Arrow major in the tree** (I1).

---

## §9. Gates

- **Architect** — full gating. This piece touches an Accepted-ADR surface (ADR-010 rules 5 and 6, ADR-016, ADR-028's budget) and a dependency/licence surface, so `AUTONOMY.md` §21a's full-gating categories apply regardless of size. §8's eleven items are checked one by one, by number.
- **Reviewer** — the full diff; the tier writer, the key/admission path and the cancellation granularity each reviewer-gated in their own right.
- **Suites** — T1–T10 green, each with its mutation verified to fail by name as a pre-gate self-check; the existing engine suites green unmodified; `verify:cites` green on this file.
- **Tester** — fills the results table: O6, O7 and the max single-feature simplify time, p50/p95, dataset and drive named. **No number enters any document except through this gate** (§6).
- **Operator** — **none in this piece, and the reason is recorded rather than the row omitted:** the tier builder is headless and ships no user-visible surface; tier *selection* and both labels' shell surfaces, which are what an operator could feel, are explicitly out of scope (§5). The first operator walkthrough is owed by the selection piece, not this one.
- **The human** — §8 item 1 (the crate set), item 2 (the `parquet` promotion), and ADR-031's own text and acceptance.

---

## §10. Amendments — opens empty, append-only

*(Empty. Append-only from this commit. Use one of the five pre-declared classes at `docs/PREREGISTRATION-TEMPLATE.md:101-122`; an amendment written after any outcome has been seen says so in its first line.)*

*(Section opened 2026-09-16 by the amendments below. No measurement outcome has been seen: this piece has no code yet. Each amendment names its class from `docs/PREREGISTRATION-TEMPLATE.md:101-122`.)*

**Amendment 1 — class 5, a ruling that adds to the pre-committed choices. Written 2026-09-16, after the human's ruling of question round 3 and before any code.** The human's ruling, `DECISIONS-PENDING.md` "RULED 2026-09-16 — question round 3", Item 1, verbatim: **"Accept the draft as pre-committed — SimplifyVwPreserve with its invalid-polygon falsifier, the 3-tier declared ladder, metre-typed tolerance through ADR-026's linear unit, content-hash sidecar tiers with row order untouched, never-serve-stale with lazy cancellable rebuild, tier vertices charged against the unchanged budget, the 100 ms cooperative-cancel ceiling with its residual measured, no Arrow 59 — with two additions recorded as class-5 amendments: (1) tier location: the sidecar directory lives in the app-local cache (%LOCALAPPDATA%\spatial-ide\tiers\<content-hash>\), never beside the source file without the user's word — a source may sit on read-only or shared storage, and writing next to it is a side effect the user didn't ask for; (2) geographic CRS: engine.lod_crs_not_linear is accepted as this cut's refusal, and the preregistration's non-goals record geographic-CRS tiers as a named follow-on, citing the corpus fact that most public GeoParquet is geographic — a declared gap with a date, never a permanent stance."** Applied to this document: (i) §2d's "sidecar directory keyed by the source's content hash" is located at **`%LOCALAPPDATA%\spatial-ide\tiers\<content-hash>\`** (the app-local cache); the tier writer never writes beside the source file without the user's explicit word — a declared value at its own site (§7 gains `LOD_TIER_ROOT` = the app-local cache path, resolved once, never discovered from the source's location), and "a tier written beside its source without the user's word" joins §8 as block-on-sight item 12. (ii) §1 and §5 gain a **named follow-on, dated 2026-09-16**: tiers for sources in a geographic (angular) CRS are NOT built by this piece — `engine.lod_crs_not_linear` is this cut's refusal — and the gap is declared, not permanent: most public GeoParquet is geographic (the corpus fact the human cites), so the follow-on is owed its own preregistered gate; ADR-032's axis-order decision and any 4326 admission remain its prerequisites. Nothing else in §2 changes.

**Amendment 2 — class 5, the dependency ruling the C3 ruling reserved to the human. Written 2026-09-16, after question round 3, before any code and before any `cargo add`.** The human's ruling, Item 2, verbatim: **"Approved: geo 0.33.1, wkb 0.9.2, geo-traits 0.3.0 may be added and parquet 58 promoted to non-optional — subject to the gate steps in the draft's §8: transitive licence closures recorded compatible before any cargo add; the piece stops if a second Arrow major appears; the notice set regenerated and the lockfile diff read for new entries in the same PR. wkb's writer, never exercised by the spike, gets its own test on the first tier written."** Applied: §8 items 1 and 2 are **approved conditionally** — the conditions are §8 items 1's licence step, 3, 4 and I1, and none is satisfied by the ruling itself; I5 is discharged by this ruling. §4 gains **T11 `wkb_writer_round_trips_the_first_tier_written`** — the first tier written by the builder is re-read through `wkb::reader` and every geometry compared bit-identical (ring count, vertex count, coordinates) to the in-memory `geo::Polygon` it was written from (P3's prediction, now with its own named test); **mutation:** flip the byte order flag passed to `wkb::writer` for one geometry → the test fails by name on the first coordinate mismatch.

**Amendment 3 — class 3, cite / line-number fixes. Written 2026-09-16; mechanical, no claim changed.** After this document was drafted, PR #80's branch took commit bd4384c (a corrected quotation in `spikes/lod-feasibility/README.md` that replaced 2 lines at 246–247 with 5), so every cite into that README at or after line 246 moved by +3. Stale cites fixed in place, in this document: `:342-348` → `:345-351`; `:369-388` → `:372-391`; `:453-483` → `:456-486`; `:573-583` → `:576-586`; `:634-863` → `:637-866`; `:249-250` → `:252-253`; `:573-583` → `:576-586`; `:390-400` → `:393-403`; `:453-483` → `:456-486`; `:369-375` → `:372-378`; `:546-562` → `:549-565`; `:564-568` → `:567-571`; `:484-499` → `:487-502`; `:585-587` → `:588-590`; `:589-590` → `:592-593`; `:632` → `:635`; `:342-348` → `:345-351`; `:246-249` → `:249-252`; `:328-334` → `:331-337`; `spikes/lod-feasibility/README.md:305-632` → `spikes/lod-feasibility/README.md:308-635`. Cites below line 246 are unchanged.

**Amendment 4 — class 3, cite fixes; mechanical, no claim changed. Written 2026-09-16.** Two cites in this document were unresolvable by `scripts/plan/verify-cites.mjs` (which resolves a bare basename against the citing file's own directory, `engine/`): §5 I1's cite of the workspace manifest at lines 41–45 meant the repo-root `Cargo.toml`, not `engine/Cargo.toml` (the scanner also strips a `../` prefix, so no `path:line` token can name the root manifest from this directory) — now written in prose as "the repo-root `Cargo.toml` (lines 41–45 …)"; Amendment 3's shift list wrote the spike README as a bare `README.md` — now the full path `spikes/lod-feasibility/README.md`. Found because the check failed on `main` from the commit that added Amendments 1–3 (2a939d3) — recorded in `state/CUT-STATE.md` as a self-inflicted red of the governance CI.

**Amendment 5 — class 2, a deviation recorded AFTER the outcome was seen. Written 2026-09-16 by the `lod-tier-builder-route-b` implementation worker, after building the declared ladder on `polygons-100k` with the code this amendment's own commit lands.** §3's **O8** pre-declares the tier set's disk footprint as *within* `LOD_TIER_SET_MAX_BYTES` on both fixtures. **On `polygons-100k` it is not.** The three tiers' arithmetic total is above the declared `2.0 × source bytes`, and the builder does exactly what §7 says it must: it refuses with `engine.lod_tier_set_over_disk_ceiling`, reports the limit and the observed total in the refusal itself, and keeps no tier on disk.

**The prediction is not edited to match it, and the ceiling is not raised.** §7 makes that value "revisable only by a preregistered measurement", and raising a declared ceiling to accommodate an outcome is the move the sibling entry (`LOD_CANCEL_OBSERVED_CEILING_MS`, and §5's I3) forbids in terms. The figures are in the worker's report to the custodian and are reproducible from the refusal and from the named test; none is written into this document, which is not the place a measured value enters (§6, §9).

**What was seen, qualitatively.** Every tier's *vertex* reduction landed on §3's O5 expectation for its tolerance — the simplification behaves exactly as the spike measured it — so this is not a simplifier defect and not an invalid-output event (I2 did not fire; O1 held on all three tiers). What it is: the ladder's smallest tolerance removes very little on this fixture, while each tier still carries one whole copy of every feature's identity and geometry, and three such files do not fit under twice the source. §7's own derivation labels itself an expectation, taken from route A's three 5 GB ratios — a different dataset, whose smallest-tolerance tier removed far more.

**What this blocks, named rather than left to be discovered.** T1, T2, T3, T7 and T11 all assert over a *built* `polygons-100k` ladder, and `build_tiers` now refuses to produce one. Those five are therefore `#[ignore]`d in `engine/tests/lod_tier_builder.rs` with this amendment named in the ignore reason. **Each of the five passed** when the set-ceiling check alone was bypassed in a local, uncommitted probe, on this same code and in one run; nothing else about them is in question, and the worker's report records that probe as a probe. T4, T5, T6, T8, T9, T10 and the simplifier-divergence check are unaffected and green.

**What is the human's to rule, with no option taken here:** whether `LOD_TIER_SET_MAX_BYTES` is the wrong value for this fixture family (a re-measurement, preregistered); whether the set ceiling is dropped in favour of the per-tier one (`LOD_TIER_MAX_RELATIVE_BYTES`, which held on every tier); or whether what a tier carries changes (this cut writes identity + a recomputed covering bbox + geometry, and the bbox column is the one part §2d does not require).

**Amendment 6 — class 5, a scope-narrowing/redirection on the human's ruling, written AFTER the outcome of Amendment 5 was seen. Written 2026-09-16, applied by the `lod-tier-builder-route-b` worker.** The human's ruling of 2026-09-16 (question round 6), on Amendment 5's O8 deviation, **verbatim**:

> "The 2.0× set ceiling is withdrawn: it was derived from route A's output sizes, and route A is out; a declared value whose premise is dead is revised by ruling, reason recorded (class-5 amendment). Replaced by two things: (a) the bound that exists by construction — tier count × the per-tier 1.0× ceiling = 3.0× the source, declared as the set's hard bound; (b) a free-disk preflight: before any tier is written, the builder requires free space ≥ the 3.0× bound for that source, refusing typed engine.lod_insufficient_disk otherwise; and the built set's actual size is disclosed with the tiers (tiers.json + the prepare report), per the settled "prep time and disk cost disclosed" boundary. The five ignored tests un-ignored; then the gates. Option 3 not taken — a ladder that fits at 99.4% is one compression change from red, and the bbox column earns its bytes."

Applied to this document: **§7's `LOD_TIER_SET_MAX_BYTES` (2.0 × source bytes) and its refusal `engine.lod_tier_set_over_disk_ceiling` are withdrawn** and exist nowhere in the code. §7 gains, at their own sites in `engine/src/lod.rs`: **`LOD_TIER_SET_HARD_BOUND_RELATIVE_BYTES` = `LOD_TIER_COUNT × LOD_TIER_MAX_RELATIVE_BYTES`** — a bound that holds by construction, since every tier is already refused above the per-tier ceiling, so there is nothing here for a measurement to falsify — and the typed refusal **`engine.lod_insufficient_disk`**, raised by a free-disk preflight that runs **before the first tier is written** and before the tier directory is created, against free space on the tier root's volume. The preflight **fails closed**: free space that cannot be established at all is a refusal, never an assumption of room. The built set's size is disclosed per tier and in total, in `tiers.json`'s `set` block and in the result type's `disk_cost()` — **bytes only; no time figure, because prep time is a measurement and is the tester's** (§6, §9). §3's O8 is therefore no longer an assertion against a discovered ceiling: the set's bound is structural, and what is *reported* is the actual size.

**Amendment 5's deviation stands as the record of what was seen**; what it blocked is discharged. T1, T2, T3, T7 and T11 are un-ignored and green. §4 gains **T12** `the_preflight_refuses_before_the_first_tier_is_written` (mutation: delete the preflight call from `build_tiers` → the refusal never fires on a tier root pointed at a volume that does not exist, and the build reaches the writer instead), with its comparison half pinned beside the code as `the_preflight_fails_closed_when_free_space_is_unknown` (mutation: return `Ok(())` for unknown free space → fails by name), and **T13** `the_built_sets_size_is_disclosed_with_the_tiers` (mutation: drop the `set` block from `write_manifest` → fails by name). The covering-bbox column stays, as the ruling's last sentence directs.

**One dependency consequence, recorded because §8's gate steps bind any manifest change.** `std::fs` has no free-space call, so the preflight is `GetDiskFreeSpaceExW`, reached through `windows-sys` under `[target.'cfg(windows)'.dependencies]`. **No crate and no crate version enters the tree**: `windows-sys 0.61.2` is already resolved in both the workspace lockfile and `frontends/shell/src-tauri/Cargo.lock`, so it is already in the conveyed artifact's notice set; each lockfile's diff is one line, adding it to `spatial-engine`'s dependency list. The in-tree precedent for a Win32 call shaped this way is `protocol/transport-bakeoff/src/memory.rs`. I1 and I4 re-checked and unchanged; the record is `engine/LOD-DEP-RESOLUTION.md`.

**Amendment 7 — class 5, a scope-narrowing on the human's ruling, written AFTER the outcome was seen (the finding it rules on was made while building this piece). Written 2026-09-16, applied by the `lod-tier-builder-route-b` worker.** The finding: `geo` 0.33.1's `SimplifyVwPreserve` takes its `epsilon` as a **minimum triangle area**, not a length (`geo-0.33.1/src/algorithm/simplify_vw.rs:63`, "epsilon is the minimum triangle area"), while §2c declared the ladder a length converted by the CRS's linear-unit factor. The human's ruling of 2026-09-16 (question round 6), **verbatim**:

> "The ladder's values are AREAS — minimum triangle area, in the CRS's squared linear unit: 0.1 / 1.0 / 5.0 m² on EPSG:2056 — the conversion factor squared for any non-metre linear CRS; values kept as measured; class-5 amendment to §2c and §7; T9's unit refusal unchanged. Two riders: every user-facing description of a tier (tiers.json, any future panel) says "minimum triangle area" in squared units, never "tolerance in metres"; and since §4 exercises only a factor-1.0 CRS, add one unit test with a synthetic non-metre factor that pins the squaring — the bug this ruling prevents is invisible on every fixture we own."

Applied to this document: **§2c's "tolerance is a typed length" reads as a typed *minimum triangle area* in the CRS's squared linear unit**, and §7's ladder is `LOD_MIN_TRIANGLE_AREA_LADDER` — **the same three values, 0.1 / 1.0 / 5.0, kept as measured**, now named for what they are: square metres. The ADR-026 linear-unit factor is **squared** in the conversion (`LinearUnit::min_triangle_area_in_unit` divides by `metres_per_unit²`; `metres_per_unit` is metres per one unit, so one square metre is `1 / factor²` square units — the direction is *divide*). §2c's two refusals are unchanged, T9 included; what changed is the quantity's name and its conversion, not which sources are admitted. First rider: `tiers.json` carries `quantity: "minimum triangle area"`, `min_triangle_area_square_metres`, `min_triangle_area_source_units` and `area_unit: "square <unit>"`, and the word "tolerance" appears in no tier description — T13 asserts that on the written manifest. Second rider: §4 gains **T14** `a_non_metre_crs_squares_the_conversion_factor_for_an_area`, a unit test beside the code over a synthetic PROJJSON whose linear unit declares `conversion_factor: 0.3048`, asserting the epsilon is `area / factor²` and explicitly **not** `area / factor` (mutation: use the unsquared factor → fails by name). Every fixture this tree owns is EPSG:2056, where the factor is one and the two are indistinguishable — which is the ruling's own reason for the test.
