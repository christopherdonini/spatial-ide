// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Spatially-clustered **layout variants** of an existing GeoParquet file — lever B1 of the
//! first-batch cut.
//!
//! ## What this is, in one sentence, so it cannot be mis-cited
//!
//! It rewrites a file's rows in a declared order and changes **no row's contents**: same features,
//! same WKB bytes, same schema, same `geo` metadata, new physical order, **new file, new content
//! hash**. It is a **layout candidate, not an index candidate** — no structure is built, no
//! predicate is answered, and nothing is injected into any query. Any result measured on a variant
//! is a *layout-variant result*, measured on a different file, and may never be differenced against
//! a same-file cell.
//!
//! ## The confound this module would otherwise hand to its own measurement
//!
//! **A variant is written by DuckDB's parquet writer; the fixtures it is made from are written by
//! arrow-rs `ArrowWriter`.** Compression matches, but page size, dictionary thresholds, encodings
//! and statistics emission do not — so a variant differenced against its arrow-rs source measures
//! *writer plus order* and attributes all of it to order. An earlier revision of this header claimed
//! the rewrite "changes nothing else", and that claim was false in exactly this way.
//!
//! The fix is a control rather than a caveat: [`ClusterOrder::SourceIdentity`] writes the **same
//! rows in the source's own identity order through the identical `COPY`**. A clustered variant is
//! compared against *that*, and the pair differs by the row order alone. A B1 cell measured against
//! the arrow-rs original instead is a confounded cell and must be recorded as one.
//!
//! ## Why it is a rewrite and not a second generator
//!
//! [`crate::fixture::parcel`] draws from a shared sequential `SplitMix64`, so generating features in
//! a permuted order would consume the draws in a different sequence and change **every feature's
//! geometry**. The file would then differ from the original in two ways at once — order *and*
//! content — and no comparison between them would mean anything. Reading the original and writing a
//! reordered copy keeps each feature's bytes identical **by construction**, which the digest-set
//! comparison in the measurement then verifies rather than assumes. It also means no existing
//! fixture changes by a single byte, which `kernel/RESULTS.md` depends on.
//!
//! ## Test support, feature-gated, never a product path
//!
//! Behind the `fixture` feature for the same reason the generator is: `docs/02` scopes this module's
//! crate to "DuckDB + Arrow, connectors, CRS engine, data doctor", and rewriting a user's file is
//! none of those. **Reordering a user file at import would be new product behaviour with its own
//! reproducibility grade (ADR-005) and its own recorded-operation obligation (`docs/05`, `docs/01`
//! principle 3), and it is deliberately not what this module does.** It writes where its caller says,
//! from a measurement harness, and acquires no grant and no audit record — the same argument that
//! keeps `kernel/tests/publish.rs` on the unguarded path.

use std::path::Path;

use crate::cancel::CancelToken;
use crate::error::{EngineError, Result};
use crate::geoparquet::CoveringBbox;

/// Bits per axis in the curve's quantization grid, and therefore its cell count per axis.
///
/// **Order 16 — 65 536 cells per axis, a 32-bit key.** At the 5 GB fixture's ~72.7 km extent that is
/// 1.11 m per cell, and at the 145 MB control's ~12.6 km it is 0.19 m; both are far below the 40 m
/// parcel pitch, so distinct parcels receive distinct keys and the tie-break below is a formality
/// rather than the thing doing the ordering.
pub const CURVE_ORDER_BITS: u32 = 16;
/// Cells per axis, derived. `AXIS_CELLS * AXIS_CELLS` is exactly `u32::MAX + 1`, so a key fits in
/// `u32` with nothing to spare — which is why it is carried as `u64`.
pub const AXIS_CELLS: u64 = 1 << CURVE_ORDER_BITS;

const _: () = assert!(CURVE_ORDER_BITS >= 1 && CURVE_ORDER_BITS <= 31);

/// Features one rewrite will key — **a declared ceiling, enforced while scanning** (ADR-010 rule 6).
///
/// The curve pass holds one `(u64, u64)` per feature before the sort, so this bounds that vector at
/// [`MAX_KEYED_FEATURES`] × 16 B = **512 MiB**; the 5 GB hero-slice fixture's 3 300 000 features are
/// about 53 MB of it. Deliberately the same value as `index::MAX_INDEXED_FEATURES`, because it
/// bounds the same quantity — one entry per feature of one file — and a second, different limit on
/// the same thing is a limit that can disagree with itself.
///
/// **Being feature-gated is not an exemption.** ADR-010 rule 6 says "declared, not discovered", not
/// "declared where it is convenient", and this module previously declared nothing while
/// `rowgroup.rs` declared a bound for a structure three orders of magnitude smaller.
///
/// **What it does not bound:** DuckDB's own `__clustered_order` table and the sort behind the
/// `COPY`, which are DuckDB's memory exactly as the streaming path's buffer is. Named rather than
/// netted in.
pub const MAX_KEYED_FEATURES: usize = 20_000_000;
/// Bytes of key payload per feature, for the bound above.
pub const BYTES_PER_KEYED_FEATURE: usize = std::mem::size_of::<(u64, u64)>();

/// The order rows are written in.
///
/// **A named enum and not a `bool`**, on the `IndexUse` / `AttributeMode` precedent, and with the
/// rejected alternative recorded rather than dropped: **Morton was considered and refused.** The
/// pruning unit is a *row group* — thousands of contiguous rows — so what matters is the envelope of
/// a contiguous run, not the average locality of the curve. Morton's power-of-two boundary
/// discontinuities put long jumps inside a run, and one jump inflates that row group's envelope
/// toward the global extent, which destroys exactly the statistics this lever exists to sharpen.
/// Hilbert is continuous, so a contiguous run has a compact bounded envelope.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ClusterOrder {
    /// Hilbert curve, [`CURVE_ORDER_BITS`] bits per axis, over each feature's covering-bbox
    /// centroid.
    Hilbert16,
    /// **The control, and the reason it is a variant of this enum rather than a separate function.**
    ///
    /// The source's own identity order, rewritten through the identical `COPY` — so it differs from
    /// a clustered variant by the row order and by literally nothing else, and differs from the
    /// original source by the writer alone. Without it a B1 result is *writer plus order* reported
    /// as order. Sharing the code path is what makes "identical except the ORDER BY" a fact rather
    /// than an intention.
    SourceIdentity,
    /// **The shuffled control, `R` — `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §4/§5.** What an
    /// unordered ETL-shaped source reads: every prior baseline in this repository sat on a
    /// raster-ordered fixture, so `SourceIdentity`'s zone-map pruning is the floor for an
    /// *already-sorted* file, not for the shape a real import produces. Existing as a third
    /// [`ClusterOrder`] rather than a separate function for the identical reason `SourceIdentity`
    /// does: sharing `rewrite`'s one `COPY` statement, differing only in the `ORDER BY`, is what
    /// makes the comparison a control instead of a claim.
    ///
    /// **`ORDER BY hash(id), id` — exact wording, deterministic, and never `random()`.** DuckDB's
    /// `hash()` is a pure function of its input: the same id always hashes to the same value, in the
    /// same process or a fresh one, so two independent rewrites of the same source produce
    /// byte-identical files. `random()` would not — every run would draw a fresh order, so nothing
    /// about "R" could be re-verified after the fact, and the preregistration is explicit that this
    /// is the property that rules it out. `id` is the tie-break for the (astronomically unlikely,
    /// but not impossible) case of a hash collision — the same discipline `Hilbert16`'s
    /// `(curve_key, id)` order applies for the same reason: an order without a tie-break is not a
    /// total order.
    Shuffled,
}

impl ClusterOrder {
    /// The label that goes in a filename, an artifact row and the write-up. One string, so a
    /// measurement and a file cannot disagree about which variant produced a number.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Hilbert16 => "hilbert16",
            Self::SourceIdentity => "source-identity",
            Self::Shuffled => "shuffled",
        }
    }
}

/// The extent the curve's grid is laid over.
///
/// **Declared by the caller, never measured from the file.** Quantizing against a measured extent
/// would make the ordering depend on the last vertex's jitter, which depends on the generator's RNG
/// — so a variant of a variant, or a variant of a regenerated fixture, would order differently for a
/// reason nothing in the measurement records. A declared extent is a stated input that travels with
/// the result.
///
/// Points outside it are clamped to the edge cells rather than refused: a curve grid is a *sorting*
/// device here, and a feature outside the declared extent still has to receive some key. The clamp
/// is recorded in [`LayoutFacts::clamped_features`] so it is never silent.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct DeclaredExtent {
    pub xmin: f64,
    pub ymin: f64,
    pub xmax: f64,
    pub ymax: f64,
}

impl DeclaredExtent {
    fn valid(&self) -> bool {
        self.xmin.is_finite()
            && self.ymin.is_finite()
            && self.xmax.is_finite()
            && self.ymax.is_finite()
            && self.xmax > self.xmin
            && self.ymax > self.ymin
    }
}

/// Everything one rewrite needs, all of it declared rather than discovered.
#[derive(Clone, Debug)]
pub struct VariantSpec {
    pub order: ClusterOrder,
    pub extent: DeclaredExtent,
    /// Rows per parquet row group in the variant.
    ///
    /// **Must equal the source's**, or the comparison is confounded: row-group size decides how much
    /// spatial extent one group spans, which is the very thing the clustering changes. The caller
    /// passes the source's own value and the measurement records both.
    pub row_group_rows: usize,
    /// The identity column, which is also the tie-break. Named rather than inferred so the variant
    /// and the dataset that later reads it cannot disagree about what identity means.
    pub id_column: String,
}

/// What the rewrite actually did.
#[derive(Clone, Debug)]
pub struct LayoutFacts {
    pub features: u64,
    pub bytes: u64,
    /// Curve keys observed, as a sanity fact rather than a claim: equal keys are possible in
    /// principle and the `(key, id)` tie-break handles them, but a variant where this is far below
    /// `features` has a quantization grid too coarse for its data and the reader should see that.
    pub distinct_keys: u64,
    /// Features whose centroid fell outside [`DeclaredExtent`] and were clamped to an edge cell.
    /// Recorded so a clamp is never silent (`docs/01` principle 8).
    pub clamped_features: u64,
    /// Row groups in the written file, read back from its own footer.
    pub row_groups: u64,
    /// The `geo` key carried across, and the other footer keys that came with it.
    pub carried_metadata_keys: Vec<String>,
    pub elapsed_millis: f64,
}

/// Write a spatially-clustered variant of `src` to `dst`.
///
/// Cancellable throughout (`docs/01` principle 7), with the uninterruptible window named rather than
/// implied: it is **one `COPY` statement**, which is DuckDB's own sort and write. That window is
/// interruptible through the connection's interrupt handle — the same mechanism the streaming path
/// uses — and it is the only part of this function that is not polled.
///
/// **On failure the partial destination is removed and the removal outcome is reported**, the same
/// discipline [`crate::fixture::write_geoparquet_cancellable`] applies: a multi-gigabyte orphan
/// nobody was told about is worse than an error.
pub fn write_clustered_variant(
    src: impl AsRef<Path>,
    dst: impl AsRef<Path>,
    spec: &VariantSpec,
    cancel: &CancelToken,
) -> Result<LayoutFacts> {
    let (src, dst) = (src.as_ref(), dst.as_ref());
    match rewrite(src, dst, spec, cancel) {
        Ok(f) => Ok(f),
        Err(e) => {
            if dst.exists() {
                if let Err(io) = std::fs::remove_file(dst) {
                    return Err(EngineError::Source(format!(
                        "layout rewrite failed ({e}) and the partial file `{}` could not then be \
                         removed ({io}). Both are reported: the first is what went wrong, the \
                         second is what is still on disk",
                        dst.display()
                    )));
                }
            }
            Err(e)
        }
    }
}

fn rewrite(
    src: &Path,
    dst: &Path,
    spec: &VariantSpec,
    cancel: &CancelToken,
) -> Result<LayoutFacts> {
    let started = std::time::Instant::now();
    if !spec.extent.valid() {
        return Err(EngineError::Source(format!(
            "declared extent {:?} is not a usable quantization grid",
            spec.extent
        )));
    }
    if spec.row_group_rows == 0 {
        return Err(EngineError::Source("row_group_rows must be at least 1".into()));
    }
    let s = sql_string(src)?;
    let d = sql_string(dst)?;

    let conn = duckdb::Connection::open_in_memory()
        .map_err(|e| EngineError::ConnectionSetup { detail: e.to_string() })?;
    // The same PRAGMA the dataset path sets: geometry stays BLOB in and BLOB out, so the WKB bytes
    // that arrive are the WKB bytes that leave.
    conn.execute_batch("SET enable_geoparquet_conversion=false;")
        .map_err(|e| EngineError::ConnectionSetup { detail: e.to_string() })?;

    // ---- the footer keys, carried across verbatim -------------------------------------------
    //
    // Without this the variant loses its `geo` key and every `Dataset::open` of it refuses with
    // `CrsUndeclared` — which would look like a bug in the variant rather than a lost metadata key.
    // Values are carried **verbatim and uninterpreted**: this module parses no license text and no
    // PROJJSON, exactly as `dataset.rs` does not.
    let kv = read_kv_metadata(&conn, &s)?;
    if !kv.iter().any(|(k, _)| k == "geo") {
        return Err(EngineError::GeoMetadata(format!(
            "`{}` carries no `geo` footer key, so a variant of it would have no CRS to declare",
            src.display()
        )));
    }
    let carried_metadata_keys: Vec<String> = kv.iter().map(|(k, _)| k.clone()).collect();

    let covering = covering_of(&conn, &s)?;

    // ---- pass 1: the curve key, computed in Rust --------------------------------------------
    //
    // Not in SQL: the curve is 16 sequential rotations and expressing that as a scalar expression
    // would be a generated 16-level nest that nobody can read and no test can aim at. In Rust it is
    // the textbook `xy2d`, unit-tested against its own inverse.
    let (keys, clamped) = curve_keys(&conn, &s, &covering, &spec.id_column, spec, cancel)?;
    let features = keys.len() as u64;
    let mut distinct: Vec<u64> = keys.iter().map(|(_, k)| *k).collect();
    distinct.sort_unstable();
    distinct.dedup();
    let distinct_keys = distinct.len() as u64;

    // ---- the ordering table ------------------------------------------------------------------
    conn.execute_batch("CREATE TABLE __clustered_order (id UBIGINT, curve_key UBIGINT);")
        .map_err(|e| EngineError::Query(format!("create ordering table: {e}")))?;
    {
        let mut app = conn
            .appender("__clustered_order")
            .map_err(|e| EngineError::Query(format!("appender: {e}")))?;
        for (i, (id, key)) in keys.iter().enumerate() {
            if i % crate::index::CANCEL_POLL_INTERVAL == 0 && cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
            app.append_row(duckdb::params![*id, *key])
                .map_err(|e| EngineError::Query(format!("append ordering row: {e}")))?;
        }
        app.flush().map_err(|e| EngineError::Query(format!("flush ordering rows: {e}")))?;
    }
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }

    // ---- the one uninterruptible window: DuckDB's sort and write -----------------------------
    let id = quote_ident(&spec.id_column);
    let kv_clause = kv
        .iter()
        .map(|(k, v)| format!("{}: '{}'", quote_ident(k), v.replace('\'', "''")))
        .collect::<Vec<_>>()
        .join(", ");
    // **One statement for both orders, differing only in the `ORDER BY`.** That is what makes the
    // control a control: everything else about how the file is produced — the writer, the
    // compression, the row-group size, the metadata — is the same text.
    let order_by = match spec.order {
        ClusterOrder::Hilbert16 => format!("o.curve_key ASC, s.{id} ASC"),
        ClusterOrder::SourceIdentity => format!("s.{id} ASC"),
        // The preregistration's exact wording (`ORDER BY hash(id), id`), qualified by the `s.`
        // alias the shared `SELECT ... FROM read_parquet(...) s` already uses. `hash()`, never
        // `random()` — see the variant's own doc comment for why that is load-bearing rather than
        // stylistic.
        ClusterOrder::Shuffled => format!("hash(s.{id}), s.{id} ASC"),
    };
    let copy = format!(
        "COPY (SELECT s.* FROM read_parquet('{s}') s JOIN __clustered_order o ON s.{id} = o.id \
         ORDER BY {order_by}) TO '{d}' \
         (FORMAT PARQUET, COMPRESSION SNAPPY, ROW_GROUP_SIZE {rg}, KV_METADATA {{{kv_clause}}})",
        rg = spec.row_group_rows,
    );
    cancel.attach(std::sync::Arc::clone(&conn.interrupt_handle()))?;
    let copied = conn.execute_batch(&copy);
    cancel.detach();
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }
    copied.map_err(|e| EngineError::Query(format!("clustered COPY: {e}")))?;

    // ---- the confound guard, checked rather than hoped -----------------------------------------
    //
    // **DuckDB's parquet writer does not honour an arbitrary `ROW_GROUP_SIZE`.** Measured against
    // this DuckDB: 8 000 rows asked to be written in groups of 1 000 came out as **four** groups,
    // not eight — the writer flushes on a multiple of its own vector size (2 048). That is a
    // material confound and not a detail: row-group size decides how much extent one group spans,
    // which is precisely the quantity this rewrite exists to change. A variant whose groups are
    // 2 048 rows compared against a source whose groups are 1 000 measures two things at once.
    //
    // So it is verified from the written file's own footer, and a mismatch is a **typed refusal**
    // rather than a note. `docs/01` principle 8: a confound that reaches a results table as a
    // silent difference is the failure mode this repository spends the most effort on.
    let group_rows = row_group_row_counts(&conn, &d)?;
    let row_groups = group_rows.len() as u64;
    let want = spec.row_group_rows as u64;
    // Three separate ways the written layout can differ from the requested one, all checked:
    //   - a full group that is not the requested size (the vector-multiple case above);
    //   - a *last* group larger than requested, which the "exempt the last" rule would otherwise
    //     wave through;
    //   - a file DuckDB collapsed into a single group, where "exempt the last" checks nothing at
    //     all — which is the original failure exactly, in the shape that hides from the guard.
    let uneven: Vec<u64> =
        group_rows.iter().rev().skip(1).copied().filter(|n| *n != want).collect();
    let last_too_big = group_rows.last().is_some_and(|n| *n > want);
    let collapsed = group_rows.len() == 1 && features > want;
    if !uneven.is_empty() || last_too_big || collapsed {
        return Err(EngineError::Source(format!(
            "the variant's row groups are {group_rows:?} for {features} rows, not the {want} rows \
             per group this rewrite asked for. DuckDB's parquet writer flushes on a multiple of its \
             vector size, so a `row_group_rows` that is not such a multiple silently produces a \
             different layout — and a layout comparison against a differently-grouped file measures \
             two changes at once. Choose a `row_group_rows` this writer will honour (a multiple of \
             2048)"
        )));
    }
    // **The row count is verified against the file, not against the scan that produced the keys.**
    // The `COPY`'s join multiplies rows on any duplicate identity and drops them on any NULL, and
    // either would reach a results table as a layout effect. `LayoutFacts::features` is the curve
    // scan's count; this is the written file's.
    let written: u64 = group_rows.iter().sum();
    if written != features {
        return Err(EngineError::Source(format!(
            "the variant holds {written} rows and its source has {features}. The rewrite joins on \
             the identity column, so a duplicate identity multiplies rows and a null drops them — \
             either way this is not the same features in a new order"
        )));
    }

    Ok(LayoutFacts {
        features,
        // Reported, not defaulted: a failed stat used to land in a results table as "the variant is
        // 0 bytes", which is a measurement fact hiding its own failure.
        bytes: std::fs::metadata(dst)
            .map(|m| m.len())
            .map_err(|e| EngineError::Source(format!("stat the written variant: {e}")))?,
        distinct_keys,
        clamped_features: clamped,
        row_groups,
        carried_metadata_keys,
        elapsed_millis: started.elapsed().as_secs_f64() * 1000.0,
    })
}

/// `(id, curve_key)` for every feature, plus how many centroids were clamped.
fn curve_keys(
    conn: &duckdb::Connection,
    src_sql: &str,
    covering: &CoveringBbox,
    id_column: &str,
    spec: &VariantSpec,
    cancel: &CancelToken,
) -> Result<(Vec<(u64, u64)>, u64)> {
    use arrow::array::{Array, Float64Array, UInt64Array};

    let sql = format!(
        "SELECT {id}, {xmin}, {ymin}, {xmax}, {ymax} FROM read_parquet('{src_sql}')",
        id = quote_ident(id_column),
        xmin = covering.xmin.to_sql(),
        ymin = covering.ymin.to_sql(),
        xmax = covering.xmax.to_sql(),
        ymax = covering.ymax.to_sql(),
    );
    let mut stmt = conn
        .prepare(&sql)
        .map_err(|e| EngineError::Query(format!("curve-key prepare: {e}")))?;
    cancel.attach(std::sync::Arc::clone(&conn.interrupt_handle()))?;
    let scanned = stmt.query_arrow([]);
    let mut out = Vec::new();
    let mut clamped = 0u64;
    let result = (|| -> Result<()> {
        let arrow = scanned.map_err(|e| EngineError::Query(format!("curve-key scan: {e}")))?;
        for chunk in arrow {
            if cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
            let ids = chunk
                .column(0)
                .as_any()
                .downcast_ref::<UInt64Array>()
                .ok_or_else(|| EngineError::Query("curve-key: id column is not u64".into()))?;
            let f = |i: usize| -> Result<&Float64Array> {
                chunk
                    .column(i)
                    .as_any()
                    .downcast_ref::<Float64Array>()
                    .ok_or_else(|| EngineError::Query(format!("curve-key: column {i} is not f64")))
            };
            let (xmin, ymin, xmax, ymax) = (f(1)?, f(2)?, f(3)?, f(4)?);
            // **Checked before any `value()` is read.** `value()` ignores the validity bitmap, so a
            // NULL identity would arrive as whatever byte pattern occupies its slot — normally 0 —
            // and then join to whatever row genuinely carries id 0, silently duplicating one feature
            // and losing another. `column_u64` refuses nulls on the streaming path for exactly this
            // reason and says why; this module does not get to opt out of that on the same data.
            for (i, col) in [ids as &dyn Array, xmin, ymin, xmax, ymax].iter().enumerate() {
                if col.null_count() > 0 {
                    return Err(EngineError::Source(format!(
                        "column {i} of the curve-key scan holds {} null value(s); a clustered \
                         variant cannot be ordered by a coordinate or keyed by an identity that \
                         is not there",
                        col.null_count()
                    )));
                }
            }
            for r in 0..chunk.num_rows() {
                let cx = (xmin.value(r) + xmax.value(r)) / 2.0;
                let cy = (ymin.value(r) + ymax.value(r)) / 2.0;
                let (gx, was_clamped_x) = quantize(cx, spec.extent.xmin, spec.extent.xmax);
                let (gy, was_clamped_y) = quantize(cy, spec.extent.ymin, spec.extent.ymax);
                if was_clamped_x || was_clamped_y {
                    clamped += 1;
                }
                // **Enforced while scanning, not after.** A file past the ceiling must not
                // materialize every key first and then be told the limit — `MAX_INDEXED_FEATURES`'s
                // own recorded lesson, which this module owes for the same reason.
                if out.len() >= MAX_KEYED_FEATURES {
                    return Err(EngineError::CeilingExceeded {
                        ceiling: "MAX_KEYED_FEATURES",
                        limit: MAX_KEYED_FEATURES as u64,
                        saw: out.len() as u64 + 1,
                    });
                }
                out.push((ids.value(r), hilbert_xy2d(gx, gy)));
            }
        }
        Ok(())
    })();
    cancel.detach();
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }
    result?;
    Ok((out, clamped))
}

/// One coordinate to a grid cell, plus whether it had to be clamped to reach one.
fn quantize(v: f64, lo: f64, hi: f64) -> (u64, bool) {
    let n = (AXIS_CELLS - 1) as f64;
    if !v.is_finite() {
        // A non-finite centroid still has to sort somewhere; it goes to cell 0 and is *counted*.
        return (0, true);
    }
    let t = (v - lo) / (hi - lo);
    let scaled = t * n;
    let clamped = !(0.0..=n).contains(&scaled);
    // **Rounding, not flooring** — a cell boundary should be the nearest cell, not the one below,
    // so a coordinate exactly on a boundary does not systematically bias one way.
    (scaled.clamp(0.0, n).round() as u64, clamped)
}

/// Hilbert curve index of grid cell `(x, y)` — the textbook `xy2d`.
///
/// `d` is in `[0, AXIS_CELLS²)`, which for order 16 is the whole of `u32`'s range, so it is carried
/// as `u64`.
pub fn hilbert_xy2d(mut x: u64, mut y: u64) -> u64 {
    let n = AXIS_CELLS;
    let mut d = 0u64;
    let mut s = n / 2;
    while s > 0 {
        let rx = u64::from((x & s) > 0);
        let ry = u64::from((y & s) > 0);
        d += s * s * ((3 * rx) ^ ry);
        // rotate the quadrant
        if ry == 0 {
            if rx == 1 {
                x = n - 1 - x;
                y = n - 1 - y;
            }
            std::mem::swap(&mut x, &mut y);
        }
        s /= 2;
    }
    d
}

/// The inverse, `d2xy`. Exists **only** so the forward map can be tested as a bijection rather than
/// against a table of expected values somebody typed in from the same source as the implementation.
pub fn hilbert_d2xy(mut d: u64) -> (u64, u64) {
    let n = AXIS_CELLS;
    let (mut x, mut y) = (0u64, 0u64);
    let mut s = 1u64;
    while s < n {
        let rx = 1 & (d / 2);
        let ry = 1 & (d ^ rx);
        if ry == 0 {
            if rx == 1 {
                x = s - 1 - x;
                y = s - 1 - y;
            }
            std::mem::swap(&mut x, &mut y);
        }
        x += s * rx;
        y += s * ry;
        d /= 4;
        s *= 2;
    }
    (x, y)
}

/// Row counts of a parquet file's row groups, in file order.
///
/// Read from the footer rather than predicted, which is what makes the confound guard above a check
/// on the file instead of a check on an intention.
pub fn row_group_row_counts(conn: &duckdb::Connection, path_sql: &str) -> Result<Vec<u64>> {
    let mut stmt = conn
        .prepare(&format!(
            "SELECT row_group_id, max(row_group_num_rows) FROM parquet_metadata('{path_sql}') \
             GROUP BY row_group_id ORDER BY row_group_id"
        ))
        .map_err(|e| EngineError::Query(format!("row-group counts prepare: {e}")))?;
    let mut rows = stmt
        .query([])
        .map_err(|e| EngineError::Query(format!("row-group counts: {e}")))?;
    let mut out = Vec::new();
    while let Some(r) = rows.next().map_err(|e| EngineError::Query(format!("row: {e}")))? {
        let n: i64 = r.get(1).map_err(|e| EngineError::Query(format!("count: {e}")))?;
        out.push(n.max(0) as u64);
    }
    Ok(out)
}

/// The footer's key/value metadata, as strings.
fn read_kv_metadata(conn: &duckdb::Connection, src_sql: &str) -> Result<Vec<(String, String)>> {
    let mut stmt = conn
        .prepare(&format!("SELECT key, value FROM parquet_kv_metadata('{src_sql}')"))
        .map_err(|e| EngineError::Query(format!("kv metadata prepare: {e}")))?;
    let mut rows = stmt
        .query([])
        .map_err(|e| EngineError::Query(format!("kv metadata: {e}")))?;
    let mut out = Vec::new();
    while let Some(r) = rows.next().map_err(|e| EngineError::Query(format!("kv row: {e}")))? {
        // DuckDB reports both as BLOB. Carried verbatim; nothing here interprets a value.
        let k: Vec<u8> = r.get(0).map_err(|e| EngineError::Query(format!("kv key: {e}")))?;
        let v: Vec<u8> = r.get(1).map_err(|e| EngineError::Query(format!("kv value: {e}")))?;
        let k = String::from_utf8(k)
            .map_err(|_| EngineError::GeoMetadata("a footer key is not UTF-8".into()))?;
        let v = String::from_utf8(v)
            .map_err(|_| EngineError::GeoMetadata(format!("footer value for `{k}` is not UTF-8")))?;
        out.push((k, v));
    }
    Ok(out)
}

/// The source's covering-bbox paths, read from its own `geo` key rather than assumed.
fn covering_of(conn: &duckdb::Connection, src_sql: &str) -> Result<CoveringBbox> {
    let kv = read_kv_metadata(conn, src_sql)?;
    let geo = kv
        .into_iter()
        .find(|(k, _)| k == "geo")
        .map(|(_, v)| v)
        .ok_or_else(|| EngineError::GeoMetadata("no `geo` key".into()))?;
    crate::geoparquet::GeoMeta::parse(&geo)?.covering.ok_or_else(|| EngineError::NoCoveringBbox {
        detail: "the source declares no covering.bbox, so a centroid cannot be read without \
                 decoding every geometry — which this rewrite deliberately does not do"
            .into(),
    })
}

fn sql_string(p: &Path) -> Result<String> {
    Ok(p.to_str()
        .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?
        .replace('\'', "''"))
}

fn quote_ident(name: &str) -> String {
    format!("\"{}\"", name.replace('"', "\"\""))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_curve_is_a_bijection_over_the_grid() {
        // Checked against its own inverse rather than against a table of expected values, which
        // would only prove that two transcriptions of the same source agree.
        for d in [0u64, 1, 2, 3, 4, 12345, 65535, 65536, 1 << 20, (AXIS_CELLS * AXIS_CELLS) - 1] {
            let (x, y) = hilbert_d2xy(d);
            assert_eq!(hilbert_xy2d(x, y), d, "d={d} -> ({x},{y}) did not round-trip");
        }
    }

    #[test]
    fn the_curve_is_continuous_which_is_the_property_morton_lacks() {
        // Successive indices are always adjacent cells. This is the whole reason Hilbert was
        // chosen over Morton: a contiguous *run* of rows therefore has a compact envelope, and a
        // row group is exactly such a run.
        let mut prev = hilbert_d2xy(0);
        for d in 1..20_000u64 {
            let cur = hilbert_d2xy(d);
            let dx = prev.0.abs_diff(cur.0);
            let dy = prev.1.abs_diff(cur.1);
            assert_eq!(dx + dy, 1, "d={d}: {prev:?} -> {cur:?} is not a unit step");
            prev = cur;
        }
    }

    #[test]
    fn quantization_clamps_and_says_so() {
        let (lo, hi) = (0.0, 100.0);
        assert_eq!(quantize(0.0, lo, hi), (0, false));
        assert_eq!(quantize(100.0, lo, hi), (AXIS_CELLS - 1, false));
        // Outside the declared extent: clamped, and the clamp is reported rather than silent.
        assert_eq!(quantize(-1.0, lo, hi), (0, true));
        assert_eq!(quantize(101.0, lo, hi), (AXIS_CELLS - 1, true));
        assert_eq!(quantize(f64::NAN, lo, hi), (0, true));
    }

    #[test]
    fn a_degenerate_declared_extent_is_refused_rather_than_divided_by() {
        for e in [
            DeclaredExtent { xmin: 0.0, ymin: 0.0, xmax: 0.0, ymax: 1.0 },
            DeclaredExtent { xmin: 0.0, ymin: 0.0, xmax: 1.0, ymax: 0.0 },
            DeclaredExtent { xmin: f64::NAN, ymin: 0.0, xmax: 1.0, ymax: 1.0 },
        ] {
            assert!(!e.valid(), "{e:?} should not be a usable grid");
        }
    }
}
