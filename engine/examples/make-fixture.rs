// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Writes a GeoParquet fixture. **Test support**, behind the `fixture` feature, and an *example*
//! rather than a binary so it cannot end up in the shipped surface by accident.
//!
//! ```text
//! cargo run -p spatial-engine --features fixture --example make-fixture -- \
//!     --out target/fixtures/probe.parquet --features 40000 [--vertices 24] [--seed 1]
//!     [--crs declared|absent|null|no-coordinate-system|latlon] [--no-covering]
//!     [--attributes none|zone]
//! ```
//!
//! The file it writes is never committed (`.gitignore`); the generator and its seed are.

use spatial_engine::fixture::{
    write_geoparquet_cancellable, AttributeMode, CrsMode, FixtureProgress, FixtureSpec,
};
use spatial_engine::CancelToken;

/// Progress to stderr. One line per chunk — at the 5 GB class that is ~403 lines over minutes,
/// which is a heartbeat rather than a flood, so nothing is throttled.
struct Console;

impl FixtureProgress for Console {
    fn chunk_written(&self, index: usize, written: usize, total: usize, bytes: u64) {
        eprintln!("[fixture] chunk {index}: {written}/{total} features, {bytes} B written");
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut spec = FixtureSpec::default();
    let mut out = "target/fixtures/probe.parquet".to_string();

    let mut args = std::env::args().skip(1);
    while let Some(a) = args.next() {
        let mut next = || args.next().ok_or_else(|| format!("{a} needs a value"));
        match a.as_str() {
            "--out" => out = next()?,
            "--features" => spec.features = next()?.parse()?,
            "--vertices" => spec.avg_vertices = next()?.parse()?,
            "--holes-every" => spec.hole_every = next()?.parse()?,
            "--seed" => spec.seed = next()?.parse()?,
            "--chunk" => spec.chunk = next()?.parse()?,
            // **A memory decision, not a layout preference.** See `FixtureSpec::row_group_rows`:
            // the writer's 1 048 576 default buffers well over a gigabyte before its first flush at
            // the 5 GB class. It is a flag rather than a computed value because it changes the
            // file's bytes, so it belongs in a pre-registered spec.
            "--row-group-rows" => spec.row_group_rows = next()?.parse()?,
            "--no-covering" => spec.with_covering_bbox = false,
            // `zone` adds a nullable categorical column derived from `(seed, id)`. It consumes no
            // geometry randomness, so the polygons are bit-identical to a fixture without it.
            "--attributes" => {
                spec.attributes = match next()?.as_str() {
                    "none" => AttributeMode::None,
                    "zone" => AttributeMode::CategoricalZone,
                    other => return Err(format!("unknown --attributes `{other}`").into()),
                }
            }
            "--crs" => {
                spec.crs_mode = match next()?.as_str() {
                    "declared" => CrsMode::DeclaredLv95,
                    "absent" => CrsMode::AbsentKey,
                    "null" => CrsMode::ExplicitNull,
                    "no-coordinate-system" => CrsMode::NoCoordinateSystem,
                    "latlon" => CrsMode::DeclaredLatLonFirst,
                    other => return Err(format!("unknown --crs `{other}`").into()),
                }
            }
            other => return Err(format!("unknown argument `{other}`").into()),
        }
    }

    // **Progress, because at the 5 GB class this runs for minutes** and a silent generation is
    // indistinguishable from a hang (ADR-010 rule 7). To stderr, so stdout stays the parseable
    // facts block it already is.
    //
    // **No Ctrl-C handler here, and that is a stated gap rather than an oversight.** `std` has no
    // console-control API, `engine/` has no tokio (the kernel's CLI borrows one for exactly this),
    // and adding a signal crate to reach an *example* would be a new dependency for test support.
    // So: the **operation** is cancellable and `kernel/tests/scale_pass.rs` drives it under a
    // watchdog through `write_geoparquet_cancellable`; this **binary** is not interruptible, and
    // interrupting it leaves a partial file the process never gets to remove.
    let cancel = CancelToken::new();
    let started = std::time::Instant::now();
    let facts = write_geoparquet_cancellable(&out, &spec, &cancel, Some(&Console))?;
    let elapsed = started.elapsed();

    println!("{out}");
    // **Wall time and bytes, side by side and deliberately not divided.** `kernel/RESULTS.md`'s
    // standing rule: no throughput claim is made anywhere in this repository, and a generator that
    // printed MB/s would be the first.
    println!("  wall ms             : {:.1}", elapsed.as_secs_f64() * 1000.0);
    println!("  features            : {}", facts.features);
    println!("  vertices            : {}", facts.vertices);
    println!("  rings               : {}", facts.rings);
    println!("  bytes               : {}", facts.bytes);
    println!(
        "  vertices per feature: {}..{}",
        facts.min_vertices_per_feature, facts.max_vertices_per_feature
    );
    println!("  coord_bits_xor      : {:#018x}", facts.coord_bits_xor);
    println!("  seed                : {:#018x}", spec.seed);
    if spec.attributes == AttributeMode::CategoricalZone {
        // Counted while writing, never predicted — the same doctrine as every other fact here.
        println!(
            "  zone counts         : {:?} + {} null",
            facts.zone_counts, facts.zone_nulls
        );
    }
    // Printed in the shape the probe wants, because this slice has no control plane for a consumer
    // to ask an extent from, and a viewer pointed at the wrong window looks like a broken stream.
    println!(
        "  extent              : {:.3},{:.3},{:.3},{:.3}",
        facts.extent[0], facts.extent[1], facts.extent[2], facts.extent[3]
    );
    Ok(())
}
