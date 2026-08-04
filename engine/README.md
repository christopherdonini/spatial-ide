# `engine/` — the data-engine module

`docs/02`'s **data-engine** module. First cut, scoped to one operation:

> **open a GeoParquet → filter in SQL → stream GeoArrow record batches → cancel**

Scaffolded for the `docs/07` Prototype hero slice, per that document's method rule: vertical slices,
never every module built in parallel to 20 %.

## What it does

| | |
|---|---|
| **Reads** | GeoParquet (WKB geometry, GeoParquet 1.1 metadata) through **DuckDB** |
| **Filters** | SQL over the covering `bbox` columns — a **linear scan**, not an index |
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
  `protocol/data-plane`. `kernel/tests/end_to_end.rs` scans this crate's source to keep it that way.
- **No reprojection**, no PROJ, no definitional-equivalence check. A viewport in another CRS is
  refused, not transformed.
- **No spatial index.** `docs/07`'s other open gate, untouched.
- **No provenance column.** ADR-013 is Proposed and binds nothing; its own OPEN block says the
  per-feature-versus-per-vertex choice must be made "explicitly at acceptance, not inherited".
  Nothing here creates derived coordinates, so there is nothing to record.
- **No persistence, no registry, no lineage, no undo, no reproducibility grade.**

## Declared ceilings (ADR-010 rule 6)

`MAX_BATCH_BYTES` 4 MiB · `TARGET_BATCH_BYTES` 1 MiB · `MAX_ROWS_PER_BATCH` 65 536 ·
`MAX_INFLIGHT_BATCHES` 2. Producer-resident payload is bounded by
`(MAX_INFLIGHT_BATCHES + 1) × MAX_BATCH_BYTES`, **plus DuckDB's own streaming buffer, which this
counter does not see and does not claim to**.

**The consequence of `MAX_BATCH_BYTES`, stated because a ceiling that surprises you is not
declared:** batches are cut at `TARGET_BATCH_BYTES`, so the ceiling is normally unreachable — but a
**single feature** larger than 4 MiB (roughly 262 000 vertices) cannot be split and terminates the
stream with `CeilingExceeded`. Real cadastral parcels are nowhere near that; a dissolved
country-level multipolygon would be. Raising the ceiling, or splitting a feature's rings across
batches, is a design decision this slice does not make.

## Deviation from `docs/05`, named rather than buried

`docs/05` requires ingestion to **normalize** axis order to the internal (E, N) convention and to
record the normalization performed. This engine performs no normalization: a non-x-first source is
**refused**. Deliberate, and in the safe direction — refusing cannot silently mislabel coordinates
where an unimplemented normalization could — but it is a gap against `docs/05`, not a satisfied
requirement. Recorded in ADR-015 (Proposed) §5 and its second OPEN block.

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
