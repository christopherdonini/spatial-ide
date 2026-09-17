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

**Amendment 8 — class 5 (scope-narrowing/redirection on the human's rulings of 2026-09-16 round 7 and 2026-09-17 round 8) together with class 4 (mutations added after a gate finding, each with its observed failure). Written 2026-09-17 by the `lod-tier-builder-route-b` worker, AFTER attempt-1 of the architect and reviewer gates returned FAIL (narrow) and after the outcomes of Amendments 5–7 were seen.** Both classes are named because this amendment carries both kinds of record and neither is invented here (`docs/PREREGISTRATION-TEMPLATE.md:101-122`).

**(a) A named follow-on, dated 2026-09-16: tier building is Windows-only in this cut.** The architect's text, verbatim:

> "§1 and §5 gain a named follow-on, dated 2026-09-16: tier building is Windows-only in this cut. The tier root is %LOCALAPPDATA% (Amendment 1) and the free-disk preflight is GetDiskFreeSpaceExW; on any other platform the root does not resolve and the free-space reading is None, so every build refuses, fail-closed, typed. A declared gap with a date, never a permanent stance: a macOS/Linux tier root and free-space call are owed their own gate, alongside docs/07's standing macOS/Linux hardware-validation item."

The human's ruling of 2026-09-17 (question round 8, item 1), verbatim:

> "Accepted: windows-sys 0.61.2 as a direct cfg(windows) engine dependency for GetDiskFreeSpaceExW, as recorded. Its Unix counterpart (statvfs) is owed with docs/07's macOS/Linux gates, dated beside the Windows-only tier note."

So, dated 2026-09-16 and unchanged by the acceptance: **`statvfs` — the Unix counterpart of the free-space reading — is owed with `docs/07`'s macOS/Linux gates, beside the macOS/Linux tier root**, and until both land the non-Windows arm is `None` and every build there refuses, fail-closed and typed (`engine/src/lod.rs:923` is that arm; `engine/src/lod.rs:1136` is the root's refusal).

**(b) The caller rule on `build_tiers`.** The reviewer's B2 — the module lands with no product caller — is answered by the human's ruling of 2026-09-17 (question round 8, item 2), verbatim:

> "The architect's reading: the round-3 acceptance licenses build_tiers to land ahead of the selection piece; the PR body and PLAN.yaml name the selection piece as its caller; no product path reaches build_tiers until that piece lands. Recorded as the caller rule's second exemption clause, beside the instrument-accessor one: a producer pre-committed by the human with its consumer named and gated may land ahead of that consumer; it exempts nothing whose consumer is undesigned."

Recorded as fact, with no code change: **`engine::lod::build_tiers` has no product caller in this piece** (its callers today are `engine/tests/lod_tier_builder.rs`, `engine/tests/lod_tier_cancellation.rs`, `engine/tests/lod_tier_preflight.rs` and `kernel/src/skp.rs:978`'s seam test), and it lands under the caller rule's **second exemption clause**, with the **selection piece named as its caller** and gated. Nothing whose consumer is undesigned rides on this.

**(c) The tier-cache lifecycle — a named, owed decision and a hard precondition.** The human's ruling of 2026-09-17 (question round 8, item 3), verbatim:

> "Recorded as a named, owed decision for ADR-031 and a hard precondition of the selection piece: a total cache ceiling declared relative to free disk at its site (round 6's principle), delete-on-supersede as the default candidate with LRU over directories as the alternative, a runner with a scheduler, a priority policy and a cancellation owner — never a background job without all three — and an operator view. No product path calls build_tiers before the lifecycle is declared. Not widened into this piece."

**Not widened into this piece**: this cut adds no eviction, no total cache ceiling and no runner. What it does have is bounded per source and disclosed — the per-tier ceiling, the by-construction set bound and the preflight (Amendment 6).

**(d) The prepare report, and the two labels' shell surface.** The human's round-6 words were "tiers.json + the prepare report". **There is no prepare report in this tree**, and §9 (accepted) gives this piece no operator surface. Recorded, dated 2026-09-17: the **prepare report is owed to the selection piece**, beside the shell surface already owed there for `lod.tier_stale` and `lod.tier_resident{tier}` (§2e, §2f). What this piece delivers instead is the report's *content*, in two places a later surface can read without re-deriving anything: `tiers.json`'s `set` block and `TierSet::disk_cost()` (`engine/src/lod.rs:852`), proven by `the_built_sets_size_is_disclosed_with_the_tiers`.

**(e) T1, T2, T3, T7 and T11 are un-ignored and green — with the proof, not the claim.** `engine/tests/lod_tier_builder.rs` carries no `#[ignore]` naming Amendment 5 any more; the five tests are `tier_build_emits_zero_invalid_polygons`, `tier_preserves_identity_for_every_row`, `engine_opens_its_own_tier`, `tier_writer_does_not_reorder_rows` and `wkb_writer_round_trips_the_first_tier_written`. The three LOD binaries' own result lines from the run this amendment was written against:

```
tests\lod_tier_builder.rs:      test result: ok. 14 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out
tests\lod_tier_cancellation.rs: test result: ok. 1 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out
tests\lod_tier_preflight.rs:    test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

The one `ignored` in each of the first two is that binary's `parcels-5gb` row, fixture-gated and the tester's (§3).

**(f) The reader `build_tiers` uses, and why it is outside `pool.rs`'s lease accounting.** The tier build reads its source through its own `ParquetRecordBatchReaderBuilder` (`engine/src/lod.rs:1320`), not through a DuckDB connection leased from `engine/src/pool.rs`. That is correct rather than an oversight: the pool exists to bound **DuckDB** connections — a scarce, configured resource whose classes `dataset.rs` admits against — and this build issues no SQL, needs no connection, and would hold one for the whole ladder if it took one. Taking a lease it never queries on would consume a `Stream`-class slot the control plane's own tickets depend on (`kernel/src/skp.rs:40-47` records that exhaustion path), which is the opposite of bounding. The file handle it does open is per tier and closed with the reader.

**(g) Four declared values and identifiers beyond §7's table, so §7 and the code agree.** Each lives at its own site with its reason, and none is a ceiling §7 declares: `LOD_READ_BATCH_ROWS` (`engine/src/lod.rs:161`) — the read window a cancel can land in, deliberately smaller than the row group; `LOD_TIER_ROW_GROUP_ROWS` (`:170`) — the writer's memory bound, this tree's shipped granularity restated; `LOD_TIER_ROOT_UNRESOLVED` (`:207`) — the typed form Amendment 1's tier-location ruling requires for an unresolvable root; `LOD_INVALID_OUTPUT` (`:215`) — the typed form of §5's invalidator I2.

**(h) `engine.lod_insufficient_disk` over a volume whose free space could not be measured** was ruled acceptable by the architect — the human's own word for the fail-closed case — and is **unchanged**: the refusal names both that it could not establish free space and what it required (`engine/src/lod.rs:931-955`), and `the_preflight_fails_closed_when_free_space_is_unknown` asserts the unknown arm refuses.

**(i) The attempt-1 gate findings, each with the line or test that resolves it.** Nothing below is called discharged without its proof:

1. **The engine→kernel seam had no consuming-side test.** Resolved by `an_engine_produced_lod_refusal_reaches_the_wire_as_engine_dot_lod_refused` (`kernel/src/skp.rs:978`), which writes a geographic-CRS fixture with the engine's own generator, opens a real `Dataset`, takes the `EngineError::LodRefused` that `spatial_engine::lod::build_tiers` actually produced, and asserts `error_of`'s `code`, both `fields` and that `message` is the error's own `Display`. *Mutation (class 4, added after this gate finding):* map `LodRefused` to the `("source", vec![])` arm → **observed**: `assertion left == right failed; left: "engine.source"; right: "engine.lod_refused"`.
2. **A test helper still justified itself by the withdrawn `LOD_TIER_SET_MAX_BYTES`.** Resolved: `engine/tests/lod_tier_builder.rs:169-173` now names the per-tier ceiling `LOD_TIER_MAX_RELATIVE_BYTES`, which is what actually holds there. The only remaining mention of the withdrawn value is `engine/src/lod.rs:130`, where it is named as the thing the by-construction bound replaced.
3. **The reuse path disclosed a size it had not re-read.** Resolved: `engine/src/lod.rs:1035` re-`stat`s every reused tier (bytes only, no re-hash), a size that differs from the record is `TierMiss::Absent` and is rebuilt, and `engine/src/lod.rs:1043-1051` re-applies the per-tier ceiling to a reused tier in every profile. Proven by `a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size`. *Mutation:* drop the re-`stat` → **observed**: `a tier whose bytes changed on disk is not the artifact its record names`.
4. **`LOD_CANCEL_CHECK_FEATURES` was declared and read by nothing.** Resolved: `engine/src/lod.rs:1482-1491` reads it as the cadence of the per-feature check, counted the way `engine/src/index.rs:66-83` counts its own poll interval. T6's mutation still guards the granularity.
5. **An unmeasured duration in a code comment.** Resolved: the repo-root `Cargo.toml`'s dev-profile block no longer states one; it states the structural reason and says why no duration appears there (`docs/08`).
6. **The `debug_assert!` could read as the bound.** Resolved: `engine/src/lod.rs:1097-1100` says in terms that it is not — it is compiled out under `--release`, the tester's build, and what enforces the size in every profile is the per-tier ceiling (after each write and on every reuse) together with the preflight.
7. **A post-Amendment-7 half-edit in an operator-reachable string.** Resolved: `engine/src/lod.rs:478-481` now reads "an area in an angular unit is not an area in a linear unit". Recorded here for the P6 string-sight list, which is where any operator-visible wording is the human's (§1).
8. **`pub` items with no product caller.** Resolved as instrument accessors, each doc declaring it and naming its test: `set_hard_bound_bytes` (`engine/src/lod.rs:878`) names `the_preflight_refuses_before_the_first_tier_is_written`; `TierSet::disk_cost()` (`:852`) and `TierSetDiskCost` name `the_built_sets_size_is_disclosed_with_the_tiers`; `TierSet::max_single_feature_simplify()` (`:840`) names `a_build_measures_the_largest_single_feature_simplify`.
9. **§6's instrument was declared and undelivered.** Delivered: the largest single `simplify_vw_preserve` call is timed where the call is made (`engine/src/lod.rs:1512-1516`), carried out as a `Duration` on `TierSet` (`:840`), and **written into no file, comment or document** — the figure is the tester's (§6, §9). Proven by `a_build_measures_the_largest_single_feature_simplify`, which also asserts that a run which simplified nothing reports `None` rather than zero. *Mutation:* return `Duration::ZERO` from the slice → **observed**: `a build that simplified features measures the residual`.
10. **A nit taken:** the cancel observed at the top of the tier loop reported tier 0, which this module's vocabulary reserves for the source; `engine/src/lod.rs:1015` now reports the tier the build was about to start. **A nit not taken:** `engine/tests/lod_tier_builder.rs`'s `ladder()` has no teardown — a process-wide `OnceLock` has no drop hook, and the helper clears the tier directory *before* it builds, so a rerun is deterministic and no state accumulates beyond one ladder; `cancel_acknowledged` is left alone as pre-existing vocabulary.

**Amendment 8, items appended 2026-09-17 after BOTH gates PASSED at attempt 2 — class 3 (cite / pointer fixes) and class 5 (owed items recorded on a gate's finding). Appended, never edited into the items above.** Corrections of record only: **no code behaviour changed** in this round — the gated tree is `efc4132`, and this round touches comments, this document and the merge of `main`. Line numbers below are this commit's; where an item corrects a cite, the superseded value is named so a reader can follow the correction rather than guess at it.

**(j) Architect C1 — class 3, two mutation-comment pointers.** `engine/tests/lod_tier_builder.rs:440` and `:503` pointed at "§10 Amendment 8 item (f)", which is the reader/lease item. Corrected in place to the items that actually record those mutations: **(i)3** for the reuse re-`stat` (`a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size`) and **(i)9** for §6's instrument (`a_build_measures_the_largest_single_feature_simplify`). Mechanical; no claim changed and no test changed.

**(k) Architect C2 + reviewer N6 — the rest of the module's `pub` surface under the caller rule's second exemption.** Item (b) named `build_tiers` alone. The clause the human ruled ("a producer pre-committed by the human with its consumer named and gated may land ahead of that consumer") covers the surface that producer needs, and the surface is listed here so the selection piece's gate can check that each item acquired a reader. **The consumer is `lod-tier-selection`, gated, for every line below.**

| `pub` item (`engine/src/lod.rs`) | The pre-committed section that names it |
|---|---|
| `TierBatch::from_admitted` (`:371`), `TierBatch::from_stale` (`:378`), `TierLabel` (`:305`), `AdmittedTier` (`:324`), `StaleTier` (`:337`) | §2e's structural stale label — "the type is shaped so a stale-tier batch cannot be constructed without it" — and T5, which is what proves it |
| `TierBuildProgress` (`:581`) | `docs/01` principle 7: a long operation reports progress, and §7's cancellation granularity needs an observer to stamp `cancel_observed` on the working thread |
| `LOD_BUILDER_VERSION` (`:86`), `LOD_SIMPLIFIER` (`:91`), `LOD_TIER_SET_HARD_BOUND_RELATIVE_BYTES` (`:137`), `LOD_TIER_ROOT` (`:149`), `LOD_READ_BATCH_ROWS` (`:161`), `LOD_TIER_ROW_GROUP_ROWS` (`:170`) | §7's declared-value rule ("every value lives at its own site in code"), plus Amendment 8 (g) for the two this document adds beyond §7's table |
| `LOD_TIER_ROOT_UNRESOLVED` (`:207`), `LOD_INVALID_OUTPUT` (`:215`) | §7's typed-refusal rule as extended by Amendment 1 (the tier root) and §5's I2 (an invalid output) |
| `LOD_TIER_RESIDENT_PREFIX` (`:232`) | §2f's resident label, declared and reserved with its shell surface owed |
| `TierRecord` (`:608`), `TierOutcome` (`:748`), `TierSetDiskCost` (`:781`) | §2d's manifest fields and §2e's miss reasons as a caller reads them; `TierSetDiskCost` also Amendment 6's disclosure |
| `LinearUnit::min_triangle_area_in_unit` (`:430`) | §2c as amended by Amendment 7 — the squared-factor conversion, with T14 as its proof |

**No external reference of any kind exists for these today**, which is the fact the exemption covers and the selection piece's gate will close.

**(l) Reviewer SF1 — class 3, the `disk_cost()` caller list corrected so it survives the grep.** Both docs said the only callers were two tests. The grep finds a **shipped in-module caller** as well: `write_manifest` (`engine/src/lod.rs:1171`), which every build reaches — `tiers.json`'s `set` block *is* this value serialized — plus `engine/tests/lod_tier_builder.rs:492` and `:921` and `engine/tests/lod_tier_preflight.rs:191`. `TierSet::disk_cost()`'s doc (`:843-857`) and `TierSetDiskCost`'s (`:770-780`) now say exactly that, and both keep the fact that remains true: **no product caller outside this module** until the prepare report exists.

**(m) Reviewer SF2 — owed, dated 2026-09-17: a fourth miss reason for a present-but-altered tier.** A tier whose bytes changed on disk is reported `TierMiss::Absent`, which renders "absent" (`engine/src/lod.rs:294`) — and the engine knows the difference: the file is there and its size does not match its record (`:1044`). **Not changed now**, because both gates passed on `efc4132` and this is a post-PASS round. Owed **before the first consumer reads a miss reason** — that is the selection piece — so that no operator view is ever shown a fact that is false about the thing it names. §2e's three reasons are the pre-committed set, so the fourth is an amendment that piece makes, not one this document may make for it.

**(n) Reviewer SF3 — owed hardening, dated 2026-09-17: the derived path replaces the recorded one on reuse.** Admission reads the `path` the manifest recorded (`read_manifest`, `engine/src/lod.rs:1155-1166`, consumed at `:1031` and `:1044`) rather than deriving `directory.join(format!("tier-{tier}.parquet"))`. A hand-edited sidecar could therefore point a "reused" tier at any file of matching byte length outside the cache; the key still has to match, so this is not a path to serving another *source's* tier, but it is a path to serving bytes the builder never wrote. **Not changed now** (post-PASS); owed to the selection piece or a short-form follow-up, whichever lands first: the path is derived from the directory and the tier number, and the recorded one is checked against it rather than trusted.

**(o) Reviewer N1 — class 3, a stale cite in item (h).** Item (h) cites `engine/src/lod.rs:931-955` for `disk_preflight`; in the gated tree that function ended at `:952`, and in this commit it spans **`:940-961`** (this round's doc edits above it moved it). The function is unchanged; only the cite was wrong.

**(p) Reviewer N2 — class 3, the provenance of item (a)'s quoted paragraph.** Item (a) labels the Windows-only-gap paragraph "the architect's text, verbatim" with nothing in-tree to resolve. Its source, named: **the architect agent's attempt-1 gate report of 2026-09-16, relayed verbatim by the custodian in this piece's fix-round brief**; the substance is recorded in `DECISIONS-PENDING.md` entry 99. The human's round-8 acceptance quoted beside it is from the same entry's ruling.

**(q) Reviewer SF6 — a known cost, recorded as a fact and not as a claim.** On the reviewer's run the `lod_tier_builder` binary took **935 s** inside a default `cargo test --workspace` — **one sample, this machine, debug profile, not a p50/p95**. The cause is structural and is what the human ruled in round 6: the five un-ignored tests build the ladder over `polygons-100k`, which is §3's declared fixture. **Nothing declared is violated** — there is no budget on suite time — and CI and every future gate pay it. Recorded so the next reader meets it as a known cost rather than as a surprise; any change to it is a preregistered decision, not a quiet one.

**(r) Reviewer's isolation notes, recorded against future changes.** (i) `engine/tests/lod_tier_builder.rs`'s `t5` and `t9` sources carry identical geometry and differ only in footer metadata — safe exactly while `t9` keeps its edited (unit-less) CRS definition, since the content hash is what separates their tier directories; a future edit that made the two footers equal would put two tests in one directory. (ii) `engine/tests/lod_tier_cancellation.rs` and `engine/tests/lod_tier_builder.rs` **deliberately share `polygons-100k`'s tier directory** and rely on cargo running test *binaries* sequentially (each clears that directory before it builds). Under a parallel runner — `cargo nextest` runs binaries concurrently — they would collide. Recorded against any future runner change; the same hazard produced a real failure in this piece's own fix round when two tests inside one binary wrote byte-identical sources (fixed at `engine/tests/lod_tier_builder.rs:512-517`).

**(s) Nits N3–N5, noted, no code change.** (i) `simplify_rows` computes one slice length for every worker (`engine/src/lod.rs:1440`), so the last slice is shorter than the rest — correctness is unaffected (order and contents are the same) and the balance question belongs to arm P's measurement, not to this round. (ii) `build_one_tier` takes twelve arguments (`:1235`); a parameter struct is the obvious remedy and is a refactor, which a post-PASS round may not take. (iii) The per-tier limit truncates (`(source_bytes as f64 * LOD_TIER_MAX_RELATIVE_BYTES) as u64`) while the set bound ceils (`set_hard_bound_bytes`, `:887`); at `1.0 ×` the two differ by at most a byte and the per-tier check is the stricter of the pair, so nothing is admitted that the ceiling means to refuse. All three are recorded for whoever next opens this module with licence to change behaviour.

**Amendment 9 — class 1, a post-result amendment. Written 2026-09-17 by the `tester` agent, AFTER this piece's measured results were seen.** The results are `engine/LOD-RESULTS.md`, taken against the gated tree `1d46678` with the measurement harness `engine/tests/lod_tier_measurements.rs` (tests only; no file under `engine/src/` differs from `1d46678`). Its sample counts were declared and committed **before any run**, with every results cell empty, which is the discipline §6 and §9 reserve to this gate. **No measured figure is written into this document by this amendment** — §6's rule is that the numbers are the tester's and enter through the results file, and every clause below names the table in that file which proves it rather than restating a value here.

**(a) The four hard gates are met.** **O1** — zero invalid output, proven structurally rather than by sampling: the builder validates every simplified Polygon before writing it and refuses the whole build otherwise, so a build that returns `Ok` is the zero-invalid result for every feature it wrote (`engine/LOD-RESULTS.md`, *Row 1 — the 5 GB ladder*, the **O1** paragraph, with the feature-validation counts for both fixtures). **§5's I2 did not fire, and §2a's declared falsifier did not fire.** **O2** (identity), **O3** (the engine opens its own tier) and **O4** (row order) are met on all three tiers **at 5 GB** — a scale at which they had never been asserted, since T2/T3/T7 run on `polygons-100k` only (*Row 4*, the table *O2, O3, O4 at 5 GB — verified per tier, before disk discipline removed it*).

**(b) O5 holds, and there is no recorded deviation to record.** Every expectation §3 declares was met on both fixtures, and the emitted vertex counts are the same integers the spike recorded (*Row 1*'s per-tier table; *Row 3*'s *The artifact, identical in all ten samples*). The two `parcels-5gb` rungs §3 leaves without an expectation are reported as measured and are labelled as carrying none. **P4 holds.**

**(c) O6 is reported and nothing about it is asserted** (§1). Both arms are printed with p50, p95 and max on `polygons-100k` at the declared five samples per arm, per tier and in total (*Row 3*), and as single samples at 5 GB (*Row 4*). **P5 — direction only — holds at both scales**, and the results file states the direction without attaching a ratio to it, here or there.

**(d) O7 is met and no ceiling was touched.** The p95 of `cancel_requested → cancel_observed` carries the verdict against `LOD_CANCEL_OBSERVED_CEILING_MS`, with max reported beside it, at the declared five samples (*Row 2*). **§5's I3 did not fire. P6 holds.** §7's declared residual is a measured fact rather than a hope: `TierSet::max_single_feature_simplify()` is reported for every build (*Row 3*'s residual table, *Row 4*'s residual column), and §6's ninth instrument is therefore delivered as well as declared.

**(e) O8 is within the bound Amendment 6 substituted.** The built set is within `LOD_TIER_SET_HARD_BOUND_RELATIVE_BYTES` on both fixtures, and every tier is within `LOD_TIER_MAX_RELATIVE_BYTES` (*Row 1*'s **O8** table; *Row 3*'s **O8 on this fixture** line). One fact the results file records that bears on Amendment 5: the ladder exceeds the **withdrawn** 2.0 × set ceiling on `parcels-5gb` as well, not only on `polygons-100k` — Amendment 5's deviation was not a small-fixture peculiarity, and the human's round-6 ruling that withdrew the value is corroborated at the fixture that ruling could not yet see.

**(f) Which rows are single samples, stated because the distinction is the whole of §1's discipline.** **Row 1** (the 5 GB ladder) and **Row 4** (5 GB wall time, each arm) are **one sample each and are not p50/p95**; the results file labels them so wherever they appear. Only **Row 2** and **Row 3** carry p50/p95, at N = 5, and the results file names its estimator (nearest-rank) and says in terms that at five samples the p95 *is* the maximum and is a weak estimate of a tail. No figure from any single-sample row may become a budget, a baseline or a regression threshold (§1).

**(g) Predictions, all six.** **P1, P2, P3, P4, P5 and P6 all held** on the evidence taken; the results file's *Verdicts* section names, for each, the table that proves it. P3 held for its re-read and open halves at 5 GB; its bit-identical-geometry half remains the gated suite's `wkb_writer_round_trips_the_first_tier_written` at 100k scale, which this gate did not re-run and does not claim.

**(h) Owed, dated 2026-09-17: `cancel_quiescent` is not instrumented by this piece.** ADR-018 asks that it be reported beside the verdict with no budget; `TierBuildProgress` has no callback that could stamp it and `build_tiers`'s return is stamped by nobody, so the results file reports its absence rather than a number (*Row 2*'s closing note and *Not run, not reported, and why*). What is asserted in its place is a fact about the artifact, not about time: a cancelled build leaves no partial tier on disk. The instrument is owed; naming it here is what stops its absence from reading as a pass.

**(i) I6's condition arose once and was resolved without a measurement being taken on a constrained volume.** Free space on `C:` fell below the tests' own floor part-way through the session; **no 5 GB row ever refused and none was measured below the floor**, the run stopped, and what was deleted to restore headroom was the tester's own worktree build cache and nothing else. Two further disturbances are disclosed rather than absorbed: an unattributed drop in free space inside one row, and another actor's disk reclamation overlapping one 5 GB run, whose figure is labelled not-clean wherever it appears (*Machine state and contention*, items 1–3).

**(j) One finding from the harness itself, recorded because a mutation claimed and not observed is not a mutation.** The first mutation declared for the harness's reuse guard **did not fire** when run: removing only the per-sample directory clear leaves the tier files absent, admission reports a miss, and every sample still rebuilds. The corrected mutation — removing the clear *and* the per-sample deletion — was run and its failure observed by name. Both the failed first attempt and the observed second are kept in `engine/tests/lod_tier_measurements.rs`'s own `RECORDED MUTATION` comments, where the code they describe is.

**(k) What this amendment does not do.** It amends no ADR and changes no ADR's status; it proposes, adds and amends no `docs/08` row; it raises no ceiling and edits no expectation; it makes no performance claim and no route-A comparison of any kind; and it changes nothing in §§1–9. It records that the tester's gate of §9 has been discharged, and where.
