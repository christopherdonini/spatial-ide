# `engine/` — the data-engine module

`docs/02`'s **data-engine** module. First cut, scoped to one operation:

> **open a GeoParquet → filter in SQL → stream GeoArrow record batches → cancel**

Scaffolded for the `docs/07` Prototype hero slice, per that document's method rule: vertical slices,
never every module built in parallel to 20 %.

## What it does

| | |
|---|---|
| **Reads** | GeoParquet (WKB geometry, GeoParquet 1.1 metadata) through **DuckDB** |
| **Filters** | SQL over the covering `bbox` columns, **narrowed by a revision-keyed in-memory index** when one is admissible |
| **Emits** | GeoArrow polygons, `List<rings: List<vertices: FixedSizeList<xy: double>[2]>>`, as Arrow IPC |
| **Tags** | every batch envelope with frame, CRS, CRS source and axis order (ADR-010 rule 1) |
| **Cancels** | through DuckDB's own interrupt, not just a flag between batches |

## The five things worth knowing before reading the code

**1. CRS is a type, and a file without one is refused.** `docs/05` makes CRS part of the dataset's
type. GeoParquet's specification says an absent `crs` key means OGC:CRS84 — **this engine does not
apply that default**, because supplying a CRS the file never stated is the silent conversion
`docs/01` principle 8 forbids. A caller may assert a CRS for a file that declares none; an assertion
over a file that *does* declare one is refused without comparing them, because deciding two
definitions agree is a definitional-equivalence judgement this slice cannot make (it performs no
transform and has no PROJ). The policy is **ADR-015 (Proposed)** and lives in `src/crs.rs`.

**2. The envelope tag is unforgeable by construction.** `TaggedBatch` has one constructor, it takes a
`BatchEnvelope`, which takes a `DatasetCrs`, which has no public constructor at all. There is no path
from raw arrays to a serialized batch that skips the tag. Axis order is **read from the file's
PROJJSON**, never hardcoded — a hardcoded `easting,northing` satisfies the letter of rule 1 and
records nothing (`docs/05` requires that the normalization performed is recorded; this slice performs
none and says so).

**3. Cancellation reaches DuckDB.** ADR-004 amendment 2 disqualified a transport because "a client
abort never reaches the producer". A flag polled between batches has the same defect in a smaller
place: a filter that scans for seconds before its first batch would keep scanning. `CancelToken`
holds the connection's interrupt handle.

> **Measured while building this, and it changes what callers must do:** DuckDB's interrupt acts on a
> query that is *already running*. An interrupt raised on an idle connection is **not latched** — the
> next query runs to completion. So the producer's `is_cancelled()` check before executing is not
> belt-and-braces; it is the only thing that stops a stream cancelled before it started. Pinned by
> `an_interrupt_on_an_idle_connection_is_not_latched`.

**4. DuckDB's own GeoParquet conversion is turned off, deliberately.** `SET
enable_geoparquet_conversion=false` on every connection. With it on, DuckDB interprets the file's
`geo` metadata and hands back a converted geometry type — a **second CRS policy** in the path, one
this engine did not write and whose conversions are invisible here. `docs/05` allows exactly one.

> It also avoids an upstream defect found here: with the conversion enabled, `read_parquet` on a
> GeoParquet file whose `geo` metadata has **no `crs` key** fails with an internal error
> (`TransactionContext::ActiveTransaction called without active transaction`) rather than a
> diagnosable one, on DuckDB v1.5.5. Files without a declared CRS are exactly the ones this engine
> has a policy for, so that path is not exotic.

**5. Nothing is repaired and nothing is guessed.** An unclosed ring, a Z/M geometry, an EWKB
SRID, a truncated WKB: each is a typed refusal. Consent-based geometry repair with a before/after
diff is the data doctor's job (`docs/05`), which is Alpha work.

## What it deliberately does not do

- **No transport.** Nothing here names a socket, a URL, a port or a frame; there is no dependency on
  `protocol/data-plane`. `tests/slice.rs` scans this crate's own source — recursively — to keep it
  that way, symmetric with `protocol/data-plane` scanning its own.
- **No reprojection**, no PROJ, no definitional-equivalence check. A viewport in another CRS is
  refused, not transformed — and per ADR-015 §7 the identifier check that does this is a **caller
  assertion about the query**, never a finding that two CRS definitions agree.
- **No spatial index.** `docs/07`'s other open gate, untouched.
- **No provenance column.** ADR-013 is Proposed and binds nothing; its own OPEN block says the
  per-feature-versus-per-vertex choice must be made "explicitly at acceptance, not inherited".
  Nothing here creates derived coordinates, so there is nothing to record.
- **No persistence, no registry, no lineage, no undo, no reproducibility grade.**

## Declared ceilings (ADR-010 rule 6)

`MAX_BATCH_BYTES` 4 MiB · `TARGET_BATCH_BYTES` 1 MiB · `FIRST_TARGET_BATCH_BYTES` 64 KiB ·
`MIN_BATCH_BYTES` 32 KiB · `BATCH_GROWTH_FACTOR` 4 · `MAX_ROWS_PER_BATCH` 65 536 ·
`MAX_QUEUED_BATCHES` 2. Producer-resident payload is bounded by
`(MAX_QUEUED_BATCHES + 1) × MAX_BATCH_BYTES`, **plus DuckDB's own streaming buffer, which this
counter does not see and does not claim to**.

**The consequence of `MAX_BATCH_BYTES`, stated because a ceiling that surprises you is not
declared:** batches are cut **before** a feature is appended, not after, so an ordinary payload
cannot reach the ceiling no matter how full the current batch is when a large feature arrives. What
remains is the irreducible case — a **single feature** larger than 4 MiB (roughly 262 000 vertices)
cannot be split, and terminates the stream with `FeatureTooLarge`, **naming the feature's id** so it
can be found. Real cadastral parcels are nowhere near that; a dissolved country-level multipolygon
would be. Raising the ceiling, or splitting one feature's rings across batches, is a design decision
this slice does not make.

*(Cut-before-append replaced cut-after-append in review. With the old ordering a large feature
landing on an almost-full batch pushed the total past the ceiling and killed the stream — the batch
size was a function of its last feature, and `docs/08`'s Polygons class at 50–200 vertices per
feature could never produce the case.)*

## Spatial index — keying, ceilings, and what it is not

`docs/07`'s open gate, closed for this slice's shape. An in-memory grid over the covering-bbox
columns, built by one cancellable scan.

**Authority, because the obvious citation is the wrong one.** This is derived state, but *not* by
ADR-010 rule 5 — rule 5 binds "every **renderer** cache", and ADR-013 §7's test (delete this index
and rule 5 still says what it says) makes citing it here an enlargement of an Accepted rule by
analogy. What binds is **ADR-006** (an index build is a pure transformation: input snapshot +
parameters → derived output, no transaction boundary, no undo), **ADR-007** (it owns no mutation, so
it cannot gate one), `docs/02`/`docs/05`'s content-addressed DAG intermediates, and `docs/01`
principle 8 for staleness.

**The key is four things, and a mismatch on any one is a different derived object:**

| Component | Why it is in the key |
|---|---|
| **content hash** of the source | `docs/05`'s grid rule one level up — "a grid substituted under the same name is a different transformation". A filename is not an identity |
| **builder version** | Two indexes over the same bytes from different code are different objects |
| **answered predicate** — `covering-bbox-intersects` | So a bbox index can **never** be silently promoted to answer true geometry intersection, which would be a wrong-but-plausible result set |
| **build parameters** (grid resolution) | Two grids at different resolutions answer at different costs and are not interchangeable |

**path + mtime + size is a validity heuristic, never an identity**, and it **fails closed**: anything
it cannot confirm — an unreadable file, a filesystem with no mtime — discards the index rather than
serving it. Treating unknown as unchanged is the silent staleness principle 8 forbids.

**The index narrows; it never decides.** Candidate ids are added *alongside* the bbox predicate, not
instead of it, so an indexed result set is provably identical to the unindexed one and a wrong index
costs time rather than correctness. `an_indexed_query_returns_exactly_what_the_scan_returns` pins
that. When candidates are too scattered to express as ranges the scan runs instead, and the stream
reports `IndexTooFragmented` rather than `ScanOnly` — "there was no index" and "the index could not
help" are different facts, and a timing that cannot tell them apart cannot be attributed.

**Declared ceilings:** `MAX_INDEXED_FEATURES` 20 M · `GRID_AXIS_CELLS` 256 · `MAX_ID_RANGES` 4 096 ·
memory `features × 48 B` (id + bbox + one grid slot), declared per index and reported by
`build_index`.

**Not persisted, deliberately.** Writing it to disk is the trigger `kernel/README.md` names for
`docs/11`'s ResourceRef model and ADR-005's grades; that is its own decision, not a side effect of a
latency fix.

**Build cost and query benefit are separate quantities** and `IndexReport` keeps them apart —
content-hash time, build time, rows scanned, features indexed. Nothing here nets them into "pays for
itself after N queries".

## Progressive first-batch sizing

The first batch is cut at `FIRST_TARGET_BATCH_BYTES` and grows by `BATCH_GROWTH_FACTOR` per batch
until `TARGET_BATCH_BYTES`, so pixels can land sooner without leaving the steady state small.

- **The bound is structural, not tested.** `target_for` is `min(first × factor^n, TARGET)` with
  saturating arithmetic, and four `const` assertions make
  `MIN ≤ FIRST ≤ target_n ≤ TARGET < MAX` hold for **every** n. ADR-010 rule 6 asks a ceiling to
  stay a ceiling; a test would only cover the states someone thought of.
- **The floor is declared and justified.** Every batch is a complete self-contained Arrow IPC
  stream, because that is what puts the rule 1 tag on *every* batch — so the envelope repeats per
  batch, and below the floor a batch is mostly envelope. `MIN_BATCH_BYTES` is asserted to exceed a
  real one-feature batch rather than assumed to.
- **Declared once per stream, not per batch.** `BatchStream::size_policy()` reports the policy;
  `BatchInfo` carries `batch_index` and `target_bytes` as two integers. The batch **schema metadata
  is deliberately unchanged** — putting a varying value there would make the envelope
  batch-dependent and hollow out the assertion that every batch carries the same envelope. This is
  a `docs/01` principle 8 visibility obligation; ADR-010 rule 1 is about coordinate space and is
  not cited for it.
- **What it may not be claimed to do.** `docs/08`'s first-pixels budget is missed at 334 ms, and
  `kernel/RESULTS.md` attributes p50 109.7 ms to the producer *before any browser*. That figure is
  query start-up **plus** scan-until-full, and this policy attacks only the second. Until the two
  are decomposed, no claim about the budget follows from this change — if start-up alone is
  ≥ 100 ms, no batch size reaches it.

**Consequence for the credit window, stated because it is easy to miss.**
`protocol/data-plane`'s `MAX_INFLIGHT_BATCHES` counts *batches*, not bytes. Smaller early batches
mean the same window holds fewer bytes, so the composed per-stream bound in `kernel/README.md`
remains a valid **upper** bound but a looser one. Any previously measured "percentage of bound"
figure describes the pre-change shape and may not be carried across this change.

## Admission: what this module refuses to open

Both refusals are **ADR-015 (Proposed)** policy, and both happen at open, in front of an operator:

- **A source with no CRS**, and a caller assertion over a source that has one — the four-row table in
  ADR-015 §1–§6.
- **A source with no stable per-feature identity** — concretely, no 64-bit column named `id`
  (**ADR-016**, Proposed — split out of ADR-015 §8). ADR-010 rule 2 resolves picking through a
  stable feature ID and `docs/11` requires
  one for editing and lineage; synthesizing a row ordinal is the M3 hazard rule 2 exists to prevent.
  **This bounds which real GeoParquet the hero slice can open more tightly than anything in
  `docs/07`** — most files in the wild carry no such column — and the source-key-to-identity mapping
  that would fix it is an OPEN item on ADR-016, not something implemented here. **ADR-016's own
  Context states what this check does not establish** — dataset-wide uniqueness, and stability
  across reopen — so the words "stable feature identity" are not read as stronger than the code.

## Axis order: a conflict with `docs/05`, resolved rather than buried

`docs/05` requires ingestion to **normalize** axis order to the internal (E, N) convention and to
record the normalization performed. This engine performs no normalization: a non-x-first source is
**refused**.

That is a real conflict between two constitution documents, and it resolves: `docs/README.md` is
**lower-number-wins**, so `docs/01` principle 8 (no silent conversion) governs and `docs/05`'s
normalization clause yields. Refusing is the **resolved** behaviour, not an unmet requirement — an
unimplemented normalization could silently mislabel coordinates, and refusing cannot. Recorded in
ADR-015 (Proposed) §5, whose OPEN block is only about whether normalizing *later* should replace
refusing.

## Declared recovery policy (ADR-010 rule 7)

**`none` — fail visibly and terminate the stream with a typed, surfaced error.** No retry, no
reconnect, no partial result presented as complete. No watchdog, because there is nothing to restart.

## Running

```bash
cargo test -p spatial-engine

# a fixture to point the slice host at (test support; the file is never committed)
cargo run -p spatial-engine --features fixture --example make-fixture -- \
    --out target/fixtures/probe.parquet --features 40000
```

The fixture generator is behind the `fixture` feature: `docs/02` does not scope a synthetic generator
to this module, and `protocol/transport-bakeoff/src/producer.rs` draws the same line from the other
side. Its polygons are irregular — vertex counts vary per feature (12–48 at the default spec) and
some carry interior rings — because a fixed-width payload is what the transport work has already been
measured on, and it is not what a cadastral layer looks like.

**The fixture's PROJJSON is a fixture.** Transcribed from EPSG:2056's published definition; nothing
in this crate interprets its conversion parameters, and no test treats it as a CRS oracle
(`docs/08`, test-oracle separation).

## Scope of anything measured through this module

Windows 10 Pro 22H2 / MSVC / bundled DuckDB v1.5.5. Nothing here says anything about macOS or Linux —
the same limit `docs/07` places on ADR-003.
