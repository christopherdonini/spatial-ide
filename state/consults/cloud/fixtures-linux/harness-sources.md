# Harness sources used by REPORT.md

These files were built and run **outside the repository**, in the session's scratch directory
(`$SCRATCH` below); none of them is a tracked file, and none is meant to become one. They are kept
here, as text, so the measurements in `REPORT.md` can be re-run, on this platform or on Windows.
`<checkout>` stands for the root of a spatial-ide clone.

The harness's `Cargo.lock` was a copy of the workspace's `Cargo.lock` at 6b67d44; cargo trimmed it
to the harness's dependency set, and every registry crate left in it has the same version as in the
workspace lock (parquet 58.4.0, arrow 58.4.0).

Build: `CARGO_TARGET_DIR=$SCRATCH/target cargo build --release --bins`, run in the harness folder.

## `harness/Cargo.toml`

```toml
[package]
name = "fixtures-linux-harness"
version = "0.0.0"
edition = "2021"
publish = false

[workspace]

[dependencies]
spatial-engine = { path = "<checkout>/engine", features = ["fixture"] }
parquet = { version = "=58.4.0", default-features = false, features = ["arrow", "snap"] }
sha2 = "0.10"

# Mirrors <checkout>/Cargo.toml's release profile, so spatial-engine compiles the same way.
[profile.release]
debug = true
[profile.release.package."*"]
debug = false
```

## `harness/src/bin/gen_s.rs`

```rust
// Writes fixture S with spatial_engine::fixture::write_geoparquet_cancellable and spec_s() restated
// field for field from kernel/tests/regenerate_fixture_s.rs (whose own entry point refuses off Windows).
use spatial_engine::fixture::{write_geoparquet_cancellable, FixtureSpec, LicenseMode};
use spatial_engine::CancelToken;
fn spec_s() -> FixtureSpec {
    FixtureSpec {
        features: 100_000,
        avg_vertices: 100,
        hole_every: 7,
        seed: 0x5EED_2056_0000_0007,
        chunk: 8_192,
        row_group_rows: 8_192,
        license: LicenseMode::DeclaredBySource,
        ..Default::default()
    }
}
fn main() {
    let out = std::path::PathBuf::from(std::env::args().nth(1).expect("output path"));
    assert!(!out.exists(), "{} already exists", out.display());
    let t = std::time::Instant::now();
    let f = write_geoparquet_cancellable(&out, &spec_s(), &CancelToken::new(), None).expect("write");
    println!("[gen_s] {} features, {} B, {:.2} s, wrote {}", f.features, f.bytes, t.elapsed().as_secs_f64(), out.display());
    println!("facts: features={} vertices={} rings={} bytes={} coord_bits_xor={:#018x} min_vpf={} max_vpf={} extent=[{:?}, {:?}, {:?}, {:?}]", f.features, f.vertices, f.rings, f.bytes, f.coord_bits_xor, f.min_vertices_per_feature, f.max_vertices_per_feature, f.extent[0], f.extent[1], f.extent[2], f.extent[3]);
}
```

## `harness/src/bin/gen_g5.rs`

```rust
// Writes G5 through the same writer, with spec_5gb() restated from kernel/tests/regenerate_fixture.rs's
// spec_5gb_matches_the_scale_pass literals. Used only to check that this harness writes the same
// bytes as the in-repo G5 entry point on this machine.
use spatial_engine::fixture::{
    write_geoparquet_cancellable, AttributeMode, CoordinateDomain, CrsMode, DeclaredTypes, FixtureSpec,
    GeometryMode, IdentityMode, LicenseMode, StatisticsMode,
};
use spatial_engine::CancelToken;
fn main() {
    let spec = FixtureSpec {
        features: 3_300_000,
        avg_vertices: 100,
        hole_every: 7,
        seed: 0x5EED_2056_0000_0005,
        crs_mode: CrsMode::DeclaredLv95,
        with_covering_bbox: true,
        chunk: 8_192,
        row_group_rows: 8_192,
        identity: IdentityMode::NativeUnique,
        attributes: AttributeMode::None,
        license: LicenseMode::DeclaredBySource,
        domain: CoordinateDomain::Lv95Metres,
        with_geo_bbox: false,
        statistics: StatisticsMode::WriterDefault,
        covering_names_absent_column: false,
        geo_version: "1.1.0".to_string(),
        geometry: GeometryMode::Polygon,
        declared_types: DeclaredTypes::Polygon,
    };
    let out = std::path::PathBuf::from(std::env::args().nth(1).expect("output path"));
    assert!(!out.exists(), "{} already exists", out.display());
    let t = std::time::Instant::now();
    let f = write_geoparquet_cancellable(&out, &spec, &CancelToken::new(), None).expect("write");
    println!("[gen_g5] {} features, {} B, {:.2} s, wrote {}", f.features, f.bytes, t.elapsed().as_secs_f64(), out.display());
    println!("facts: features={} vertices={} rings={} bytes={} coord_bits_xor={:#018x} min_vpf={} max_vpf={} extent=[{:?}, {:?}, {:?}, {:?}]", f.features, f.vertices, f.rings, f.bytes, f.coord_bits_xor, f.min_vertices_per_feature, f.max_vertices_per_feature, f.extent[0], f.extent[1], f.extent[2], f.extent[3]);
}
```

## `harness/src/bin/footer.rs`

```rust
// Prints a parquet file's footer: created_by, format version, rows, row groups, per-column-chunk
// compression/encodings/sizes, and key-value metadata (key, length, sha256 of the value).
use parquet::file::reader::{FileReader, SerializedFileReader};
use sha2::{Digest, Sha256};
fn main() {
    let p = std::env::args().nth(1).expect("path");
    let r = SerializedFileReader::new(std::fs::File::open(&p).unwrap()).unwrap();
    let md = r.metadata();
    let fm = md.file_metadata();
    println!("file: {p}");
    println!("created_by: {:?}", fm.created_by());
    println!("format_version: {}", fm.version());
    println!("num_rows: {}", fm.num_rows());
    println!("num_row_groups: {}", md.num_row_groups());
    println!("schema columns: {}", fm.schema_descr().num_columns());
    for (i, c) in fm.schema_descr().columns().iter().enumerate() {
        println!("  col[{i}] {} physical={:?} logical={:?} converted={:?}", c.path(), c.physical_type(), c.logical_type_ref(), c.converted_type());
    }
    if let Some(kv) = fm.key_value_metadata() {
        for e in kv {
            let v = e.value.clone().unwrap_or_default();
            println!("kv: {} len={} sha256={}", e.key, v.len(), hex(&Sha256::digest(v.as_bytes())));
        }
    }
    let mut comp = std::collections::BTreeMap::new();
    let (mut tot_c, mut tot_u) = (0i64, 0i64);
    for (gi, g) in md.row_groups().iter().enumerate() {
        let (mut gc, mut gu) = (0i64, 0i64);
        let mut cols = Vec::new();
        for c in g.columns() {
            *comp.entry(format!("{:?}", c.compression())).or_insert(0u32) += 1;
            gc += c.compressed_size();
            gu += c.uncompressed_size();
            cols.push(format!("{}:{}c/{}u enc={:?} stats={}", c.column_path(), c.compressed_size(), c.uncompressed_size(), c.encodings().collect::<Vec<_>>(), c.statistics().is_some()));
        }
        tot_c += gc; tot_u += gu;
        println!("rg[{gi}] rows={} total_byte_size={} compressed={} uncompressed={} | {}", g.num_rows(), g.total_byte_size(), gc, gu, cols.join(" ; "));
    }
    println!("compression codecs over all column chunks: {comp:?}");
    println!("total compressed={tot_c} uncompressed={tot_u}");
}
fn hex(b: &[u8]) -> String { b.iter().map(|x| format!("{x:02x}")).collect() }
```

## `libm/angles.rs` (standalone; `rustc -O angles.rs -o angles && ./angles > angles.txt`)

```rust
// Prints, for every angle ring() in engine/src/fixture.rs can form with m in 3..=400 points
// (a = (i as f64 / m as f64) * TAU), the bits of a, a.sin() and a.cos() as this build computes them.
fn main() {
    for m in 3usize..=400 {
        for i in 0..m {
            let a = (i as f64 / m as f64) * std::f64::consts::TAU;
            println!("{} {} {:016x} {:016x} {:016x}", m, i, a.to_bits(), a.sin().to_bits(), a.cos().to_bits());
        }
    }
}
```

## `libm/check.py` (`python3 -I check.py angles.txt`; the 140-digit re-check changes `prec = 80` to `prec = 140` and `1e-75` to `1e-135`)

```python
import sys, struct
from decimal import Decimal, getcontext
getcontext().prec = 80
def f(bits): return struct.unpack('>d', bytes.fromhex(bits))[0]
def sincos(x):
    x = Decimal(x)  # exact value of the double
    s = Decimal(0); c = Decimal(0); term = Decimal(1); k = 0
    # term = x^k / k!
    while True:
        if k % 4 == 0: c += term
        elif k % 4 == 1: s += term
        elif k % 4 == 2: c -= term
        else: s -= term
        k += 1
        term = term * x / k
        if k > 10 and abs(term) < Decimal('1e-75'): break
    return s, c
def nearest(d):
    return float(d)  # Decimal -> float is correctly rounded
bad = {'sin': [], 'cos': []}; n = 0; mlo = {}
for line in open(sys.argv[1]):
    m, i, a, sb, cb = line.split(); n += 1
    s, c = sincos(f(a))
    for name, got, exact in (('sin', f(sb), s), ('cos', f(cb), c)):
        want = nearest(exact)
        if got != want and not (got == 0.0 and want == 0.0):
            bad[name].append((int(m), int(i), got, want))
print('angles checked:', n)
for name in bad:
    print(name, 'not correctly rounded:', len(bad[name]), 'first:', bad[name][:3])
inrange = [b for name in bad for b in bad[name] if 15 <= b[0] <= 149]
print('of which with m in 15..=149 (the ring sizes S and G5 use):', len(inrange))
```
