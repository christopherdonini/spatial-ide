// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Brief B stage B1, engine/kernel half (`engine/B1-PROJECTION-PREREGISTRATION.md` §4): the live
//! projected stream, over a real `AttributeMode::MultiType` fixture and the real
//! `Dataset::stream_projected_with_cancel` / `Dataset::stream_with_cancel` entry points, decoded
//! from the actual Arrow IPC wire — never a hand-built envelope.
//!
//! E-14 and E-15 (the `flush` retention rule itself) are unit tests in `engine/src/stream.rs`
//! instead of here: an emitted batch's arrays are reconstructed by the Arrow IPC *reader* on the
//! way back out of `drain` below, and a freshly reconstructed array's own buffer memory always
//! equals its slice memory — the property E-14/E-15 are about would be true of every array this
//! file could ever observe, live stream or not, which is not a test of the retention decision.
//! `retain_or_compact_single_run`/`compact_attribute_slice` are private to `stream.rs`, and that is
//! where the decision itself is checked, on the same precedent E-11/E-12 already set for
//! `attr_row_bytes`/`decode_dictionary_chunk_column`.

use std::collections::BTreeMap;

use arrow::array::{Array, Float64Array, StringArray, UInt64Array};
use arrow::datatypes::SchemaRef;
use arrow::record_batch::RecordBatch;

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{f32_for, write_geoparquet, AttributeMode, CrsMode, FixtureSpec};
use spatial_engine::{AdmittedPredicate, BatchStream, Dataset, ViewportQuery, ID_COLUMN};

const SEED: u64 = 0x5EED_2056_0B01_0001;
const FEATURES: usize = 600;

/// One `AttributeMode::MultiType` fixture, written once (the `predicate_admission.rs` /
/// `skp_admission.rs` `OnceLock` precedent — cargo runs tests in this file in parallel, and two
/// concurrent writers of the same path race a truncate against a read).
fn fixture_path() -> std::path::PathBuf {
    static FIXTURE: std::sync::OnceLock<std::path::PathBuf> = std::sync::OnceLock::new();
    FIXTURE
        .get_or_init(|| {
            let spec = FixtureSpec {
                features: FEATURES,
                attributes: AttributeMode::MultiType,
                crs_mode: CrsMode::DeclaredLv95,
                seed: SEED,
                ..Default::default()
            };
            let dir = std::env::temp_dir().join("spatial-engine-live-projection-tests");
            std::fs::create_dir_all(&dir).unwrap();
            let path = dir.join("multitype.parquet");
            write_geoparquet(&path, &spec).expect("fixture");
            path
        })
        .clone()
}

fn dataset() -> Dataset {
    Dataset::open(fixture_path()).expect("open")
}

/// Drain a whole stream into its decoded record batches, plus the schema the first frame carried —
/// as decoded from the wire, not from any producer-side bookkeeping (`filter_composition.rs`'s own
/// `drain_digests` precedent).
fn drain(mut stream: BatchStream) -> (Vec<RecordBatch>, SchemaRef) {
    let mut out = Vec::new();
    let mut schema = None;
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        info.expect("batch");
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("ipc reader");
        if schema.is_none() {
            schema = Some(reader.schema());
        }
        for batch in reader {
            out.push(batch.expect("record batch"));
        }
        buf.clear();
    }
    (out, schema.expect("a fully-drained stream produced at least one batch"))
}

fn column_u64(batch: &RecordBatch, name: &str) -> UInt64Array {
    batch.column_by_name(name).unwrap().as_any().downcast_ref::<UInt64Array>().unwrap().clone()
}

/// E-8: `a_live_projected_stream_emits_id_geometry_then_the_declared_columns` (§3's first fixture
/// row: native `id`, request `[area, zone]` → schema `[id, geometry, area, zone]`; projected
/// fields nullable; NULLs travel as NULL). The request deliberately reverses the fixture's own file
/// order (`zone` before `area`), so a sort-by-file-order bug is distinguishable from the declared
/// (request) order this test actually pins. Values are checked row by row against an independent
/// DuckDB read of the same file, keyed on `id`. Mutation: `resolve_projection` sorts by file order.
// RECORDED MUTATION: in `engine/src/attributes.rs::admit_projection`, sort `out` by the field's
// position in `file_schema` instead of declared order. Observed: this test fails by name --
// `left: ["id", "geometry", "zone", "area"]` vs `right: ["id", "geometry", "area", "zone"]` at
// `engine/tests/live_projection.rs:101`. Reverted.
#[test]
fn a_live_projected_stream_emits_id_geometry_then_the_declared_columns() {
    let ds = dataset();
    let names = vec!["area".to_string(), "zone".to_string()];
    let projection = ds.resolve_projection(&names).expect("admitted projection");
    let stream = ds
        .stream_projected_with_cancel(&ViewportQuery::all(), &projection, CancelToken::new())
        .expect("stream");
    let (batches, schema) = drain(stream);

    let field_names: Vec<&str> = schema.fields().iter().map(|f| f.name().as_str()).collect();
    assert_eq!(field_names, vec!["id", "geometry", "area", "zone"]);
    assert!(!schema.field(0).is_nullable(), "id must stay non-nullable");
    for f in schema.fields().iter().skip(2) {
        assert!(f.is_nullable(), "`{}` must come back nullable regardless of the source", f.name());
    }

    // Oracle: an independent DuckDB read of the same file, never the fixture's own `area_for`.
    let conn = spatial_engine::fixture::configured_connection().expect("conn");
    let path_str = fixture_path().to_string_lossy().to_string();
    let mut stmt = conn.prepare("SELECT id, area, zone FROM read_parquet(?)").expect("prepare");
    let mut oracle: BTreeMap<u64, (f64, Option<String>)> = BTreeMap::new();
    for batch in stmt.query_arrow([path_str.as_str()]).expect("query") {
        let ids = column_u64(&batch, "id");
        let areas = batch.column_by_name("area").unwrap().as_any().downcast_ref::<Float64Array>().unwrap();
        let zones = batch.column_by_name("zone").unwrap().as_any().downcast_ref::<StringArray>().unwrap();
        for r in 0..batch.num_rows() {
            let zone = (!zones.is_null(r)).then(|| zones.value(r).to_string());
            oracle.insert(ids.value(r), (areas.value(r), zone));
        }
    }
    assert_eq!(oracle.len(), FEATURES);

    let mut seen = 0usize;
    let mut saw_null_zone = false;
    for batch in &batches {
        let ids = column_u64(batch, ID_COLUMN);
        let areas = batch.column_by_name("area").unwrap().as_any().downcast_ref::<Float64Array>().unwrap();
        let zones = batch.column_by_name("zone").unwrap().as_any().downcast_ref::<StringArray>().unwrap();
        for r in 0..batch.num_rows() {
            let id = ids.value(r);
            let (expected_area, expected_zone) = oracle.get(&id).unwrap_or_else(|| panic!("id {id} in oracle"));
            assert_eq!(areas.value(r), *expected_area, "area mismatch at id {id}");
            let zone = (!zones.is_null(r)).then(|| zones.value(r).to_string());
            assert_eq!(&zone, expected_zone, "zone mismatch at id {id}");
            saw_null_zone |= zone.is_none();
            seen += 1;
        }
    }
    assert_eq!(seen, FEATURES, "every row must be seen exactly once");
    assert!(saw_null_zone, "the fixture must exercise a NULL zone, or the NULL claim above is vacuous");
}

/// E-9: `projection_leaves_frame_crs_axis_and_identity_metadata_byte_identical`. The declared-
/// unchanged list (§5) names exactly the frame tag, `crs`, `crs_source`, `axis_order`,
/// `axis_normalization` and identity metadata — not the admission-provenance keys
/// (`crs_provenance` etc.), which a projected envelope already omits on `stream_for_publish`'s own,
/// pre-existing precedent (`BatchEnvelope::with_attributes` carries no `AdmissionRecord`). Mutation:
/// `with_attributes` drops `axis_normalization` — the loop below then finds it present on one side
/// and absent on the other, and the equality assertion fails by name.
// RECORDED MUTATION: in `engine/src/envelope.rs::BatchEnvelope::with_attributes`, strip
// `axis_normalization` from the built schema's metadata. Observed: this test fails by name --
// "`axis_normalization` must be identical, projected or not / left: Some(\"none-performed\") /
// right: None" at `engine/tests/live_projection.rs:169`. Reverted.
#[test]
fn projection_leaves_frame_crs_axis_and_identity_metadata_byte_identical() {
    let ds = dataset();
    let (_, unprojected_schema) =
        drain(ds.stream_with_cancel(&ViewportQuery::all(), CancelToken::new()).expect("unprojected"));
    let projection = ds.resolve_projection(&["zone".to_string()]).expect("admitted projection");
    let (_, projected_schema) = drain(
        ds.stream_projected_with_cancel(&ViewportQuery::all(), &projection, CancelToken::new())
            .expect("projected"),
    );

    let u = unprojected_schema.metadata();
    let p = projected_schema.metadata();
    for key in ["frame", "crs", "crs_source", "axis_order", "axis_normalization"] {
        assert!(u.contains_key(key), "unprojected envelope must carry `{key}`");
        assert_eq!(u.get(key), p.get(key), "`{key}` must be identical, projected or not");
    }
    let identity_keys: Vec<&String> = u.keys().filter(|k| k.starts_with("id_")).collect();
    assert!(!identity_keys.is_empty(), "the fixture's identity metadata must carry at least one id_* key");
    for key in identity_keys {
        assert_eq!(u.get(key), p.get(key), "identity metadata `{key}` must be identical, projected or not");
    }
}

/// E-18 (the live half): `a_file_with_a_float32_column_binds_every_predicate_without_panicking`.
/// Mutation: remove the `REAL` arm from `duckdb_type_name` — `bind_admit`'s surrogate relation then
/// has no DuckDB type to `CAST(NULL AS ...)` `f32` as (F1's typed refusal fires, or — before F1 —
/// the `expect()` it replaced panics), and every predicate below fails to admit.
// RECORDED MUTATION: in `engine/src/predicate.rs::duckdb_type_name`, comment out the
// `D::Float32 => Some("REAL")` arm. Observed: this test fails by name -- `f32 > 0` refused as
// `ColumnNotFilterable { column: "f32", reason: "... has no DuckDB surrogate type to bind
// against ..." }` at `engine/tests/live_projection.rs:191`. Reverted.
#[test]
fn a_file_with_a_float32_column_binds_every_predicate_without_panicking() {
    let ds = dataset();
    for predicate in ["f32 > 0", "f32 = 0.1", "f32 < 1000.0", "f32 > 0.1 AND f32 < 1.0"] {
        AdmittedPredicate::admit(predicate, &ds)
            .unwrap_or_else(|e| panic!("`{predicate}` over a real Float32 column must admit: {e:?}"));
    }
}

/// E-20: `how_a_float32_column_compares_with_a_numeric_literal_is_pinned` (H5, confirmed by P0).
/// The fixture's `f32` column is drawn from the three declared `fixture::F32_VALUES`; `f32 = 0.1`
/// and `f32 > 0.1` are asserted against the row sets a filtered stream *actually returns*, not
/// against an assumption about float comparison. Mutation: the fixture writes `f32` as `Float64`
/// with the same values — a `DOUBLE` column would not exercise `REAL`'s own cast behaviour (H5),
/// and would in any case be admitted differently.
// RECORDED MUTATION: in `engine/src/fixture.rs`, change the `f32` field's `DataType` to `Float64`,
// its builder to `Float64Builder`, and its append call to `f32_for(spec.seed, id) as f64` (same
// values, widened). Observed: this test fails by name -- "a fully-drained stream produced at least
// one batch" panics at `engine/tests/live_projection.rs:77` (a DOUBLE column's exact-literal
// comparison finds none of the rows the f32-computed expected sets predict). Reverted.
#[test]
fn how_a_float32_column_compares_with_a_numeric_literal_is_pinned() {
    let ds = dataset();
    let expected_eq: std::collections::BTreeSet<u64> =
        (0..FEATURES as u64).filter(|&id| f32_for(SEED, id) == 0.1f32).collect();
    let expected_gt: std::collections::BTreeSet<u64> =
        (0..FEATURES as u64).filter(|&id| f32_for(SEED, id) > 0.1f32).collect();
    assert!(
        !expected_eq.is_empty() && !expected_gt.is_empty(),
        "the fixture must exercise both buckets, or this test proves nothing"
    );

    for (text, expected) in [("f32 = 0.1", &expected_eq), ("f32 > 0.1", &expected_gt)] {
        let predicate = AdmittedPredicate::admit(text, &ds).expect("admitted predicate");
        let query = ViewportQuery::all().with_filter(predicate);
        let (batches, _) =
            drain(ds.stream_with_cancel(&query, CancelToken::new()).expect("filtered stream"));
        let mut observed = std::collections::BTreeSet::new();
        for batch in &batches {
            let ids = column_u64(batch, ID_COLUMN);
            for r in 0..batch.num_rows() {
                observed.insert(ids.value(r));
            }
        }
        assert_eq!(&observed, expected, "`{text}` over the declared stored values");
    }
}
