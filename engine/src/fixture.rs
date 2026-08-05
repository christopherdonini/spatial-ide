//! Seeded GeoParquet fixture writer — **test support, feature-gated, never the shipped path**.
//!
//! `docs/02` scopes this module to "DuckDB + Arrow, connectors, CRS engine, data doctor"; a
//! synthetic generator is none of those. It lives behind the `fixture` feature so it cannot be
//! reached by accident, mirroring the line `protocol/transport-bakeoff/src/producer.rs` draws from
//! the other side.
//!
//! What it writes is a **GeoParquet 1.1** file of the shape real files have: WKB geometry, a
//! covering `bbox` struct column, and the CRS as PROJJSON in the file's `geo` key. The polygons are
//! irregular — vertex counts vary per feature and some carry holes — because a fixed-width payload
//! is exactly what the transport work has already been measured on, and it is not what a cadastral
//! layer looks like.
//!
//! The generator and its seed are committed; the file it produces is not (`.gitignore`).
//!
//! **The PROJJSON is a fixture.** It is transcribed from EPSG:2056's published definition, and
//! nothing in this crate interprets its conversion parameters — the engine performs no transform.
//! It is not a substitute for PROJ, and no test in this repository treats it as a CRS oracle
//! (`docs/08`, test-oracle separation).

use std::fs::File;
use std::path::Path;
use std::sync::Arc;

use arrow::array::{ArrayRef, BinaryBuilder, Float64Builder, StructArray, UInt64Builder};
use arrow::datatypes::{DataType, Field, Fields, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::basic::Compression;
use parquet::file::properties::WriterProperties;
use parquet::file::metadata::KeyValue;

use crate::error::{EngineError, Result};
use crate::wkb::encode_polygon;

pub const LV95_PROJJSON: &str = include_str!("../tests/data/epsg2056.projjson");

/// The EPSG:2056 (LV95) working domain the fixture is drawn in.
pub const E_LO: f64 = 2_600_000.0;
pub const N_LO: f64 = 1_200_000.0;

/// How the fixture declares (or fails to declare) its CRS. Each variant exists because a test
/// needs a real file exercising that admission path — a refusal asserted against a hand-written
/// JSON string is not the same as a refusal asserted against a file.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CrsMode {
    /// `crs` is the EPSG:2056 PROJJSON. The ordinary case.
    DeclaredLv95,
    /// The `crs` key is absent. GeoParquet's spec calls this OGC:CRS84; this engine refuses it.
    AbsentKey,
    /// `"crs": null` — the spec's explicit "no CRS".
    ExplicitNull,
    /// A definition with an `id` but no `coordinate_system`, so axis order cannot be established.
    NoCoordinateSystem,
    /// EPSG:4326 with its official (latitude, longitude) axis order.
    DeclaredLatLonFirst,
    /// A complete, usable LV95 definition with **no `id`** — no authority and no code.
    ///
    /// Legal PROJJSON, and the case that makes `crs::DEFINITION_ONLY` exist: the engine can read
    /// the definition and establish axis order, but has no identifier to name it by. Every such
    /// dataset shares the same placeholder, so ADR-015 §7.3 refuses a viewport that echoes it.
    DefinitionOnlyNoId,
}

#[derive(Clone, Debug)]
pub struct FixtureSpec {
    pub features: usize,
    /// Average vertices per feature; actual counts vary per feature around this value.
    pub avg_vertices: usize,
    /// Every n-th feature gets an interior ring. `0` disables holes.
    pub hole_every: usize,
    pub seed: u64,
    pub crs_mode: CrsMode,
    pub with_covering_bbox: bool,
    /// Rows per parquet row group / write call.
    pub chunk: usize,
}

impl Default for FixtureSpec {
    fn default() -> Self {
        Self {
            features: 5_000,
            avg_vertices: 24,
            hole_every: 7,
            seed: 0x5EED_2056_0000_0002,
            crs_mode: CrsMode::DeclaredLv95,
            with_covering_bbox: true,
            chunk: 4_096,
        }
    }
}

/// What was actually written — the fixture's own facts, so a test asserts against measured
/// quantities rather than against its own expectations of the generator.
#[derive(Clone, Debug, Default)]
pub struct FixtureFacts {
    pub features: usize,
    pub vertices: usize,
    pub rings: usize,
    pub bytes: u64,
    /// Sum of every coordinate's bits, order-independent — a cheap end-to-end identity check that
    /// does not require holding the whole fixture in memory. Compared against the same reduction
    /// computed on what a consumer received.
    pub coord_bits_xor: u64,
    pub min_vertices_per_feature: usize,
    pub max_vertices_per_feature: usize,
    /// `(xmin, ymin, xmax, ymax)` in the fixture's CRS — the union of every feature's bbox.
    ///
    /// Reported because a consumer has no metadata endpoint to ask: this slice has no control
    /// plane, so a viewer pointed at a fixture without its extent draws a clipped view and looks
    /// like a bug in the stream.
    pub extent: [f64; 4],
}

struct SplitMix64(u64);

impl SplitMix64 {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
        z ^ (z >> 31)
    }
    fn unit(&mut self) -> f64 {
        (self.next() >> 11) as f64 * (1.0 / (1u64 << 53) as f64)
    }
    fn range(&mut self, lo: f64, hi: f64) -> f64 {
        lo + self.unit() * (hi - lo)
    }
}

fn schema(with_bbox: bool) -> Arc<Schema> {
    let mut fields = vec![Arc::new(Field::new("id", DataType::UInt64, false))];
    if with_bbox {
        fields.push(Arc::new(Field::new("bbox", DataType::Struct(bbox_fields()), false)));
    }
    fields.push(Arc::new(Field::new("geometry", DataType::Binary, false)));
    Arc::new(Schema::new(fields))
}

fn bbox_fields() -> Fields {
    Fields::from(vec![
        Field::new("xmin", DataType::Float64, false),
        Field::new("ymin", DataType::Float64, false),
        Field::new("xmax", DataType::Float64, false),
        Field::new("ymax", DataType::Float64, false),
    ])
}

fn geo_metadata(spec: &FixtureSpec) -> String {
    let crs_fragment = match spec.crs_mode {
        CrsMode::DeclaredLv95 => format!(",\"crs\":{LV95_PROJJSON}"),
        CrsMode::AbsentKey => String::new(),
        CrsMode::DefinitionOnlyNoId => {
            // The LV95 definition with its `id` member removed, so the identifier cannot be formed.
            let v: serde_json::Value = serde_json::from_str(LV95_PROJJSON).expect("lv95 projjson");
            let mut o = v.as_object().expect("projjson object").clone();
            o.remove("id");
            format!(",\"crs\":{}", serde_json::Value::Object(o))
        }
        CrsMode::ExplicitNull => ",\"crs\":null".to_string(),
        CrsMode::NoCoordinateSystem => {
            ",\"crs\":{\"type\":\"ProjectedCRS\",\"name\":\"CH1903+ / LV95\",\
              \"id\":{\"authority\":\"EPSG\",\"code\":2056}}"
                .to_string()
        }
        CrsMode::DeclaredLatLonFirst => ",\"crs\":{\"type\":\"GeographicCRS\",\"name\":\"WGS 84\",\
              \"coordinate_system\":{\"subtype\":\"ellipsoidal\",\"axis\":[\
                {\"name\":\"Geodetic latitude\",\"abbreviation\":\"Lat\",\"direction\":\"north\",\"unit\":\"degree\"},\
                {\"name\":\"Geodetic longitude\",\"abbreviation\":\"Lon\",\"direction\":\"east\",\"unit\":\"degree\"}]},\
              \"id\":{\"authority\":\"EPSG\",\"code\":4326}}"
            .to_string(),
    };

    let covering = if spec.with_covering_bbox {
        ",\"covering\":{\"bbox\":{\"xmin\":[\"bbox\",\"xmin\"],\"ymin\":[\"bbox\",\"ymin\"],\
          \"xmax\":[\"bbox\",\"xmax\"],\"ymax\":[\"bbox\",\"ymax\"]}}"
    } else {
        ""
    };

    format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":\"geometry\",\"columns\":{{\"geometry\":{{\
          \"encoding\":\"WKB\",\"geometry_types\":[\"Polygon\"]{crs_fragment}{covering}}}}}}}"
    )
}

/// Write the fixture. Returns what was written.
pub fn write_geoparquet(path: impl AsRef<Path>, spec: &FixtureSpec) -> Result<FixtureFacts> {
    let path = path.as_ref();
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir).map_err(|e| EngineError::Source(format!("mkdir: {e}")))?;
    }
    let file = File::create(path).map_err(|e| EngineError::Source(format!("create: {e}")))?;

    let schema = schema(spec.with_covering_bbox);
    let props = WriterProperties::builder()
        .set_compression(Compression::SNAPPY)
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo_metadata(spec))]))
        .build();
    let mut writer = ArrowWriter::try_new(file, schema.clone(), Some(props))
        .map_err(|e| EngineError::Source(format!("parquet writer: {e}")))?;

    let mut rng = SplitMix64(spec.seed);
    let mut facts = FixtureFacts {
        min_vertices_per_feature: usize::MAX,
        extent: [f64::INFINITY, f64::INFINITY, f64::NEG_INFINITY, f64::NEG_INFINITY],
        ..Default::default()
    };

    let mut written = 0usize;
    while written < spec.features {
        let n = spec.chunk.min(spec.features - written);

        let mut ids = UInt64Builder::with_capacity(n);
        let mut geoms = BinaryBuilder::new();
        let (mut xmin_b, mut ymin_b, mut xmax_b, mut ymax_b) = (
            Float64Builder::with_capacity(n),
            Float64Builder::with_capacity(n),
            Float64Builder::with_capacity(n),
            Float64Builder::with_capacity(n),
        );

        for i in 0..n {
            let id = (written + i) as u64;
            let rings = parcel(&mut rng, spec, id);

            let (mut xmin, mut ymin, mut xmax, mut ymax) =
                (f64::INFINITY, f64::INFINITY, f64::NEG_INFINITY, f64::NEG_INFINITY);
            for ring in &rings {
                facts.rings += 1;
                for p in ring {
                    xmin = xmin.min(p[0]);
                    ymin = ymin.min(p[1]);
                    xmax = xmax.max(p[0]);
                    ymax = ymax.max(p[1]);
                    facts.coord_bits_xor ^= p[0].to_bits().rotate_left(1) ^ p[1].to_bits();
                }
            }

            let verts: usize = rings.iter().map(Vec::len).sum();
            facts.vertices += verts;
            facts.min_vertices_per_feature = facts.min_vertices_per_feature.min(verts);
            facts.max_vertices_per_feature = facts.max_vertices_per_feature.max(verts);

            facts.extent[0] = facts.extent[0].min(xmin);
            facts.extent[1] = facts.extent[1].min(ymin);
            facts.extent[2] = facts.extent[2].max(xmax);
            facts.extent[3] = facts.extent[3].max(ymax);

            ids.append_value(id);
            geoms.append_value(encode_polygon(&rings));
            xmin_b.append_value(xmin);
            ymin_b.append_value(ymin);
            xmax_b.append_value(xmax);
            ymax_b.append_value(ymax);
        }

        let mut cols: Vec<ArrayRef> = vec![Arc::new(ids.finish())];
        if spec.with_covering_bbox {
            let bbox = StructArray::new(
                bbox_fields(),
                vec![
                    Arc::new(xmin_b.finish()) as ArrayRef,
                    Arc::new(ymin_b.finish()),
                    Arc::new(xmax_b.finish()),
                    Arc::new(ymax_b.finish()),
                ],
                None,
            );
            cols.push(Arc::new(bbox));
        }
        cols.push(Arc::new(geoms.finish()));

        let batch = RecordBatch::try_new(schema.clone(), cols)
            .map_err(|e| EngineError::Arrow(format!("fixture batch: {e}")))?;
        writer.write(&batch).map_err(|e| EngineError::Source(format!("parquet write: {e}")))?;

        written += n;
        facts.features += n;
    }

    writer.close().map_err(|e| EngineError::Source(format!("parquet close: {e}")))?;
    facts.bytes = std::fs::metadata(path).map(|m| m.len()).unwrap_or(0);
    Ok(facts)
}

/// One irregular parcel: a jittered convex-ish ring, occasionally with an interior ring.
///
/// Parcels tile a grid so a viewport filter selects a predictable subset, but no two have the same
/// vertex count and none is axis-aligned — the fixed-width, structurally-regular payload is the
/// thing this fixture exists to stop using.
fn parcel(rng: &mut SplitMix64, spec: &FixtureSpec, id: u64) -> Vec<Vec<[f64; 2]>> {
    let cols = (spec.features as f64).sqrt().ceil() as u64;
    let (gx, gy) = (id % cols, id / cols);
    let cell = 40.0_f64;
    let cx = E_LO + gx as f64 * cell + cell / 2.0;
    let cy = N_LO + gy as f64 * cell + cell / 2.0;

    // Vertex count varies per feature: half the average to 1.5x it, minimum 4 (closed triangle).
    let spread = (spec.avg_vertices / 2).max(2);
    let n = (spec.avg_vertices.saturating_sub(spread)
        + (rng.next() as usize % (2 * spread + 1)))
        .max(4);

    let outer = ring(rng, cx, cy, cell * 0.42, n);
    if spec.hole_every > 0 && id.is_multiple_of(spec.hole_every as u64) {
        let inner = ring(rng, cx, cy, cell * 0.12, (n / 3).max(4));
        // Interior rings wind the other way in most real data; reversed here for the same reason.
        let mut inner: Vec<[f64; 2]> = inner.into_iter().rev().collect();
        let first = inner[0];
        let last = *inner.last().unwrap();
        if first != last {
            inner.push(first);
        }
        vec![outer, inner]
    } else {
        vec![outer]
    }
}

fn ring(rng: &mut SplitMix64, cx: f64, cy: f64, r: f64, n: usize) -> Vec<[f64; 2]> {
    let n = n.max(4) - 1; // the closing repeat is added below
    let mut pts = Vec::with_capacity(n + 1);
    for i in 0..n {
        let a = (i as f64 / n as f64) * std::f64::consts::TAU;
        let jitter = rng.range(0.55, 1.0);
        // Coordinates keep their full f64 significance at LV95 magnitudes (~2.6e6): the sub-metre
        // detail is the part ADR-010 rule 3 exists to protect on the way to the GPU.
        pts.push([cx + r * jitter * a.cos(), cy + r * jitter * a.sin()]);
    }
    pts.push(pts[0]);
    pts
}
