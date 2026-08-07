// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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

use crate::cancel::CancelToken;
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

/// Whether the fixture carries a categorical attribute column.
///
/// **An enum, not a bool**, on the `IndexUse` precedent in `stream.rs`: a call site reads which
/// policy is in force without knowing which way round a flag goes, and adding a second attribute
/// shape later is a compile error at every site rather than a silent reinterpretation.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AttributeMode {
    /// `[id, bbox?, geometry]` — the shape every earlier fixture had, byte for byte.
    None,
    /// Adds a nullable `zone` text column: four declared values and NULL, five outcomes.
    ///
    /// **NULL is not optional.** A style must declare `on_null` and `on_unmatched`, and a fixture
    /// whose acceptance run never produces a NULL would leave a mandatory declaration with no
    /// evidence behind it — the standing this repository refuses everywhere else.
    CategoricalZone,
}

/// Whether the fixture's parquet footer declares license metadata.
///
/// Same reason `CrsMode` and `IdentityMode` exist: an admission path is exercised against a **real
/// file** rather than a hand-written metadata map. The publisher's `declared-by-source` branch was
/// unreachable from any test before this, because it reads keys only a real footer can carry.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LicenseMode {
    /// No license keys at all — the common case, and what every earlier fixture wrote.
    NotDeclared,
    /// `license`, `attribution` and `redistribution: permitted`.
    DeclaredBySource,
    /// **`attribution` and `redistribution`, and no `license` key at all.**
    ///
    /// The three keys are independent, so this is an ordinary real-world shape rather than a corner
    /// — and it is the one the publisher used to answer with an invented `"(unnamed)"` license name.
    /// ADR-017 Corrigendum 1 makes it `license: null`, and this mode is how that arm is reached
    /// through a real footer instead of a hand-built `SourceLicense`.
    AttributionWithoutLicenseName,
    /// `redistribution: forbidden`, which publishing must refuse: a static bundle is a
    /// redistributed copy.
    ForbidsRedistribution,
}

/// The `zone` column's values. Four, so an acceptance style declaring cases for **two** of them
/// exercises matched, unmatched and NULL in one run.
pub const ZONE_VALUES: [&str; 4] = ["residential", "industrial", "agricultural", "civic"];

/// Salt separating the categorical stream from the geometry stream.
const ZONE_SALT: u64 = 0x2056_5A4F_4E45_0001;

/// The zone of feature `id`, as a **pure function of `(seed, id)`**.
///
/// This is the load-bearing property and it is not a style preference. Drawing the category from the
/// generator's shared `SplitMix64` would consume draws and shift every subsequent `parcel()` — the
/// vertex counts, the jitter, the interior rings, `coord_bits_xor` and `extent` — so a fixture with
/// a `zone` column would no longer carry the geometry of the fixture without one, and
/// `kernel/RESULTS.md`'s third section pins that geometry by seed and by exact vertex and byte
/// counts. Deriving from `(seed, id)` alone keeps the geometry **bit-identical by construction**.
///
/// It also makes the value a function of the *feature* rather than of its position, so it survives
/// chunk boundaries, row-group order, and the `ORDER BY` the publish path adds — the same property
/// ADR-016 §4 requires of anything identity-adjacent, for the same reason.
pub fn zone_for(seed: u64, id: u64) -> Option<&'static str> {
    let mut z = (seed ^ ZONE_SALT).wrapping_add(id.wrapping_mul(0x9E37_79B9_7F4A_7C15));
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^= z >> 31;
    match (z % 5) as usize {
        4 => None,
        k => Some(ZONE_VALUES[k]),
    }
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
    /// Rows per **write call**. Bounds the uninterruptible window during generation.
    ///
    /// **Not the row-group size** — that is [`Self::row_group_rows`], and conflating the two is the
    /// mistake this comment used to invite: `chunk` says how much is built in memory before a
    /// `write`, and the parquet writer buffers *across* writes until its own row-group limit.
    pub chunk: usize,
    /// Rows per parquet **row group**, passed to `WriterProperties::set_max_row_group_size`.
    ///
    /// **This is a memory decision, not a layout preference.** `ArrowWriter` defaults to 1 048 576
    /// rows per row group and buffers every column's encoded data until it flushes — so at the 5 GB
    /// class that default holds well over a gigabyte before the first flush, which no bound in this
    /// file could honour.
    ///
    /// **Defaulted to the writer's own 1 048 576 so every existing fixture stays byte-identical.**
    /// `kernel/RESULTS.md` pins fixture geometry by exact byte counts, and silently changing the
    /// row-group size would move those bytes for reasons unrelated to any measurement. A cut that
    /// needs a different value registers it.
    pub row_group_rows: usize,
    /// How the fixture carries feature identity. Exists so ADR-016's admission policy is exercised
    /// against real files rather than against hand-written schemas.
    pub identity: IdentityMode,
    /// Whether a categorical attribute column is written. Defaults to `None`, so every existing
    /// spec produces the file it always produced.
    pub attributes: AttributeMode,
    /// Whether the footer declares license metadata. Defaults to `NotDeclared`.
    pub license: LicenseMode,
}

/// How the fixture carries feature identity.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum IdentityMode {
    /// A unique `id` column. The ordinary case.
    NativeUnique,
    /// A unique key under a different name (`parcel_key`), and **no `id` column at all** — the
    /// shape most real GeoParquet has, which the engine refuses unless a mapping is declared.
    ForeignKeyColumn,
    /// An `id` column that repeats a value. Legal parquet, admitted by a
    /// column-exists-and-is-an-integer check, and fatal to ADR-010 rule 2's indirection.
    DuplicateIds,
    /// An `id` column holding a **string**. No transform reaches u64 without inventing one.
    StringIds,
    /// A signed `id` column holding negative values.
    NegativeIds,
    /// A unique `id` column whose values exceed 2^53, so a JS consumer narrowing to `Number`
    /// would collide (ADR-016 §7).
    HugeIds,
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
            // The `ArrowWriter` default, restated rather than left implicit — see the field.
            row_group_rows: 1_048_576,
            identity: IdentityMode::NativeUnique,
            attributes: AttributeMode::None,
            license: LicenseMode::NotDeclared,
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
    /// Observed `zone` values, in `ZONE_VALUES` order, and the observed NULL count.
    ///
    /// **Counted while writing, never predicted.** A test that asserted "about a fifth are NULL"
    /// against the generator's own intention would be checking the comment; these are what the file
    /// actually holds, in the same doctrine the rest of `FixtureFacts` already follows.
    pub zone_counts: [usize; 4],
    pub zone_nulls: usize,
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

fn schema(with_bbox: bool, identity: IdentityMode, attributes: AttributeMode) -> Arc<Schema> {
    let id_field = match identity {
        IdentityMode::ForeignKeyColumn => Field::new("parcel_key", DataType::UInt64, false),
        IdentityMode::StringIds => Field::new("id", DataType::Utf8, false),
        IdentityMode::NegativeIds => Field::new("id", DataType::Int64, false),
        _ => Field::new("id", DataType::UInt64, false),
    };
    let mut fields = vec![Arc::new(id_field)];
    if with_bbox {
        fields.push(Arc::new(Field::new("bbox", DataType::Struct(bbox_fields()), false)));
    }
    // Column order is declared, and geometry stays last. File bytes depend on it, so it is a
    // decision rather than an accident of where the code was edited.
    if attributes == AttributeMode::CategoricalZone {
        fields.push(Arc::new(Field::new("zone", DataType::Utf8, true)));
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

/// Progress from a running generation, as an observer rather than a log line.
///
/// **The same shape as `PublishProgress` one crate up**, deliberately: the tree gets one progress
/// idiom rather than two that a reader has to learn separately. A caller drives a UI, a heartbeat,
/// or a silence watchdog from it — ADR-010 rule 7 requires a long-running operation's silence to be
/// *detectable*, and a generation that reports nothing for 400 seconds is indistinguishable from a
/// hang.
pub trait FixtureProgress: Send + Sync {
    /// One chunk is on its way to the writer.
    ///
    /// `bytes_written` is the writer's own count, **not** a `metadata()` call: at 403 chunks a
    /// syscall per chunk would be an instrument that touches the filesystem it is measuring.
    fn chunk_written(
        &self,
        chunk_index: usize,
        features_written: usize,
        features_total: usize,
        bytes_written: u64,
    );
}

/// A no-op observer, so the generation never branches on `Option` internally.
struct SilentFixture;
impl FixtureProgress for SilentFixture {
    fn chunk_written(&self, _: usize, _: usize, _: usize, _: u64) {}
}

/// Write the fixture. Returns what was written.
///
/// Uncancellable and silent, for the hundreds of small fixtures in this workspace's tests that want
/// neither. [`write_geoparquet_cancellable`] is the same operation with the two `docs/01` principle
/// 7 properties attached; this is a wrapper over it, not a second implementation, so there is no
/// second code path to keep in step.
pub fn write_geoparquet(path: impl AsRef<Path>, spec: &FixtureSpec) -> Result<FixtureFacts> {
    write_geoparquet_cancellable(path, spec, &CancelToken::new(), None)
}

/// Write the fixture, **cancellable and progress-reporting** (`docs/01` principle 7).
///
/// ## Why an instrument gets principle 7 at all
///
/// Generating the `docs/07` 5 GB fixture takes minutes and writes gigabytes. `docs/01` principle 7
/// is not conditioned on an operation being product code, and a test-support generator that could
/// not be interrupted would leave a multi-gigabyte orphan on any Ctrl-C — which is the side effect,
/// not the interruption, that matters.
///
/// **It is not a class-3 operation and deliberately acquires no grant, approval or audit record.**
/// It writes only where its caller says, it is feature-gated test support, and routing an
/// instrument through the authorization model would be the inverse of the argument that keeps
/// `kernel/tests/publish.rs` on the unguarded path.
///
/// ## The uninterruptible window, named rather than implied
///
/// Cancellation is observed at the top of each chunk, **per row** inside the build loop, and after
/// each `write`. So the uninterruptible window is **one chunk's encode, compress and row-group
/// write** — and, separately and smaller, `ArrowWriter::close`, which writes the footer. Both are
/// bounded by [`FixtureSpec::chunk`] and [`FixtureSpec::row_group_rows`]; neither is claimed to be
/// zero.
///
/// ## On cancel the partial file is removed, and the removal outcome is reported
///
/// The same discipline `publish`'s staging directory gets (ADR-010 rule 7): a cleanup failure is
/// carried out to the caller rather than swallowed, because a 5 GB orphan nobody was told about is
/// worse than an error.
pub fn write_geoparquet_cancellable(
    path: impl AsRef<Path>,
    spec: &FixtureSpec,
    cancel: &CancelToken,
    progress: Option<&dyn FixtureProgress>,
) -> Result<FixtureFacts> {
    let path = path.as_ref();
    let silent = SilentFixture;
    let progress: &dyn FixtureProgress = progress.unwrap_or(&silent);

    match generate(path, spec, cancel, progress) {
        Ok(facts) => Ok(facts),
        Err(e) => {
            // The partial file is the side effect; removing it is the recovery policy, and its
            // outcome is reported rather than swallowed.
            if path.exists() {
                if let Err(io) = std::fs::remove_file(path) {
                    return Err(EngineError::Source(format!(
                        "fixture generation failed ({e}) and the partial file `{}` could not then \
                         be removed ({io}). Both are reported: the first is what went wrong, the \
                         second is what is still on disk",
                        path.display()
                    )));
                }
            }
            Err(e)
        }
    }
}

fn generate(
    path: &Path,
    spec: &FixtureSpec,
    cancel: &CancelToken,
    progress: &dyn FixtureProgress,
) -> Result<FixtureFacts> {
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir).map_err(|e| EngineError::Source(format!("mkdir: {e}")))?;
    }
    let file = File::create(path).map_err(|e| EngineError::Source(format!("create: {e}")))?;

    let schema = schema(spec.with_covering_bbox, spec.identity, spec.attributes);
    // `geo` always; the license keys only when the mode asks. The engine reads a closed, declared
    // set of keys and carries their values verbatim — it parses no license text.
    let mut kv = vec![KeyValue::new("geo".to_string(), geo_metadata(spec))];
    match spec.license {
        LicenseMode::NotDeclared => {}
        LicenseMode::DeclaredBySource => {
            kv.push(KeyValue::new("license".to_string(), "CC-BY-4.0".to_string()));
            kv.push(KeyValue::new("attribution".to_string(), "(c) Example Cadastre".to_string()));
            kv.push(KeyValue::new("redistribution".to_string(), "permitted".to_string()));
        }
        LicenseMode::AttributionWithoutLicenseName => {
            // No `license` key. The publisher must carry the absence rather than name it.
            kv.push(KeyValue::new("attribution".to_string(), "(c) Example Cadastre".to_string()));
            kv.push(KeyValue::new("redistribution".to_string(), "permitted".to_string()));
        }
        LicenseMode::ForbidsRedistribution => {
            kv.push(KeyValue::new("license".to_string(), "internal-only".to_string()));
            kv.push(KeyValue::new("redistribution".to_string(), "forbidden".to_string()));
        }
    }
    let props = WriterProperties::builder()
        .set_compression(Compression::SNAPPY)
        .set_key_value_metadata(Some(kv))
        // See `FixtureSpec::row_group_rows`. Defaulted to the writer's own value, so this line
        // changes no existing fixture's bytes.
        .set_max_row_group_row_count(Some(spec.row_group_rows))
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
    let mut chunk_index = 0usize;
    while written < spec.features {
        // Before any building: a cancel observed here costs nothing at all.
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }
        let n = spec.chunk.min(spec.features - written);

        let mut ids = UInt64Builder::with_capacity(n);
        let mut signed_ids = arrow::array::Int64Builder::with_capacity(n);
        let mut string_ids = arrow::array::StringBuilder::new();
        let mut geoms = BinaryBuilder::new();
        let mut zones = arrow::array::StringBuilder::new();
        let (mut xmin_b, mut ymin_b, mut xmax_b, mut ymax_b) = (
            Float64Builder::with_capacity(n),
            Float64Builder::with_capacity(n),
            Float64Builder::with_capacity(n),
            Float64Builder::with_capacity(n),
        );

        for i in 0..n {
            // **Per row, not only per chunk.** One feature is ~1 µs of geometry, so an atomic load
            // here is free — and at the 5 GB class a chunk is 8 192 features, which is long enough
            // that per-chunk alone would be a visibly unresponsive window.
            if cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
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

            match spec.identity {
                // The value written is what makes each mode's refusal real: a duplicate is a
                // constant, a huge id is above 2^53, a negative is below zero.
                IdentityMode::DuplicateIds => ids.append_value(7),
                IdentityMode::HugeIds => ids.append_value((1u64 << 53) + id),
                IdentityMode::NegativeIds => signed_ids.append_value(-(id as i64) - 1),
                IdentityMode::StringIds => string_ids.append_value(format!("key-{id}")),
                _ => ids.append_value(id),
            }
            if spec.attributes == AttributeMode::CategoricalZone {
                // Derived from `(seed, id)` and **not** from `rng`, so the geometry above is
                // untouched by this column's existence.
                match zone_for(spec.seed, id) {
                    Some(v) => {
                        zones.append_value(v);
                        let k = ZONE_VALUES.iter().position(|z| *z == v).expect("declared value");
                        facts.zone_counts[k] += 1;
                    }
                    None => {
                        zones.append_null();
                        facts.zone_nulls += 1;
                    }
                }
            }
            geoms.append_value(encode_polygon(&rings));
            xmin_b.append_value(xmin);
            ymin_b.append_value(ymin);
            xmax_b.append_value(xmax);
            ymax_b.append_value(ymax);
        }

        let mut cols: Vec<ArrayRef> = vec![match spec.identity {
            IdentityMode::NegativeIds => Arc::new(signed_ids.finish()) as ArrayRef,
            IdentityMode::StringIds => Arc::new(string_ids.finish()) as ArrayRef,
            _ => Arc::new(ids.finish()) as ArrayRef,
        }];
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
        if spec.attributes == AttributeMode::CategoricalZone {
            cols.push(Arc::new(zones.finish()) as ArrayRef);
        }
        cols.push(Arc::new(geoms.finish()));

        let batch = RecordBatch::try_new(schema.clone(), cols)
            .map_err(|e| EngineError::Arrow(format!("fixture batch: {e}")))?;
        writer.write(&batch).map_err(|e| EngineError::Source(format!("parquet write: {e}")))?;

        written += n;
        facts.features += n;
        // The writer's own count, not a `metadata()` syscall — an instrument that stat'ed the file
        // once per chunk would be touching the filesystem it is measuring.
        progress.chunk_written(chunk_index, written, spec.features, writer.bytes_written() as u64);
        chunk_index += 1;

        // Observed on both sides of the write, which is what makes the uninterruptible window "one
        // chunk" rather than "however long the rest of the file takes".
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }
    }

    // **Unconditional, before `close`.** A cancel arriving during the final chunk must not produce
    // a complete, valid, closed file that the caller then caches as a successful generation — the
    // degenerate case where an interrupted build returns `Ok`. `close` itself is the second, smaller
    // uninterruptible window: it writes the footer.
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
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
