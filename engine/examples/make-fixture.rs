//! Writes a GeoParquet fixture. **Test support**, behind the `fixture` feature, and an *example*
//! rather than a binary so it cannot end up in the shipped surface by accident.
//!
//! ```text
//! cargo run -p spatial-engine --features fixture --example make-fixture -- \
//!     --out target/fixtures/probe.parquet --features 40000 [--vertices 24] [--seed 1]
//!     [--crs declared|absent|null|no-coordinate-system|latlon] [--no-covering]
//! ```
//!
//! The file it writes is never committed (`.gitignore`); the generator and its seed are.

use spatial_engine::fixture::{write_geoparquet, CrsMode, FixtureSpec};

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
            "--no-covering" => spec.with_covering_bbox = false,
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

    let facts = write_geoparquet(&out, &spec)?;
    println!("{out}");
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
    // Printed in the shape the probe wants, because this slice has no control plane for a consumer
    // to ask an extent from, and a viewer pointed at the wrong window looks like a broken stream.
    println!(
        "  extent              : {:.3},{:.3},{:.3},{:.3}",
        facts.extent[0], facts.extent[1], facts.extent[2], facts.extent[3]
    );
    Ok(())
}
