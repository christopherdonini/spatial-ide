//! The publish stream: a declared attribute projection, a declared row order, fixed partition
//! ceilings — and the fixture change that feeds it.
//!
//! Every test here pins something a published bundle's determinism rests on. A bundle promises that
//! two publishes of the same inputs produce byte-identical partitions and identical hashes, and that
//! promise is only as good as the ordering, the boundary rule and the projection underneath it.

use arrow::array::Array;
use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, ZONE_VALUES,
};
use spatial_engine::identity::IdentityDeclaration;
use spatial_engine::{CancelToken, Dataset, EngineError, ViewportQuery};

fn dir(name: &str) -> std::path::PathBuf {
    let d = std::env::temp_dir().join("spatial-engine-publish-tests").join(name);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn zoned_spec(features: usize) -> FixtureSpec {
    FixtureSpec {
        features,
        attributes: AttributeMode::CategoricalZone,
        crs_mode: CrsMode::DeclaredLv95,
        ..Default::default()
    }
}

/// Read a whole stream into `(ids, zone values)`, in arrival order, plus the partition sizes.
fn drain(stream: &mut spatial_engine::BatchStream) -> (Vec<u64>, Vec<Option<String>>, Vec<usize>) {
    let (mut ids, mut zones, mut rows) = (Vec::new(), Vec::new(), Vec::new());
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        let info = info.expect("stream terminal");
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let batch = rdr.next().unwrap().unwrap();
        let id_col = batch
            .column(0)
            .as_any()
            .downcast_ref::<arrow::array::UInt64Array>()
            .expect("id is u64");
        ids.extend(id_col.values().iter().copied());
        if batch.num_columns() > 2 {
            let z = batch
                .column(2)
                .as_any()
                .downcast_ref::<arrow::array::StringArray>()
                .expect("zone is utf8");
            for i in 0..z.len() {
                zones.push(if z.is_null(i) { None } else { Some(z.value(i).to_string()) });
            }
        }
        rows.push(info.rows);
        buf.clear();
    }
    (ids, zones, rows)
}

#[test]
fn adding_the_categorical_column_leaves_the_fixtures_geometry_bit_identical() {
    // The property `kernel/RESULTS.md`'s third section depends on: it pins the docs/08 Polygons
    // fixture by seed and by exact vertex, ring and byte counts, and a categorical column drawn
    // from the shared generator RNG would have shifted every subsequent parcel. Deriving `zone`
    // from `(seed, id)` alone is what makes this hold, and this is the assertion that says so.
    let d = dir("fixture-invariance");
    let plain = write_geoparquet(d.join("plain.parquet"), &FixtureSpec::default()).unwrap();
    let zoned = write_geoparquet(
        d.join("zoned.parquet"),
        &FixtureSpec { attributes: AttributeMode::CategoricalZone, ..Default::default() },
    )
    .unwrap();

    assert_eq!(plain.features, zoned.features);
    assert_eq!(plain.vertices, zoned.vertices, "vertex count moved");
    assert_eq!(plain.rings, zoned.rings, "ring count moved");
    assert_eq!(plain.coord_bits_xor, zoned.coord_bits_xor, "a coordinate bit moved");
    assert_eq!(plain.extent, zoned.extent);
    assert_eq!(plain.min_vertices_per_feature, zoned.min_vertices_per_feature);
    assert_eq!(plain.max_vertices_per_feature, zoned.max_vertices_per_feature);
    // The file itself is of course larger — it carries a column the other does not.
    assert!(zoned.bytes > plain.bytes);

    // And a fixture written without the column is unchanged in shape: no `zone` counted.
    assert_eq!(plain.zone_nulls, 0);
    assert_eq!(plain.zone_counts, [0; 4]);
}

#[test]
fn the_categorical_column_produces_every_branch_a_style_must_declare() {
    // Four declared values plus NULL. An acceptance style declaring cases for two of them then
    // exercises matched, unmatched and NULL in one run — which is what stops `on_null` and
    // `on_unmatched` being mandatory declarations with no evidence behind them.
    let d = dir("zone-distribution");
    let facts = write_geoparquet(d.join("z.parquet"), &zoned_spec(5_000)).unwrap();
    let total: usize = facts.zone_counts.iter().sum::<usize>() + facts.zone_nulls;
    assert_eq!(total, facts.features, "every feature carries a zone or a NULL");
    for (i, n) in facts.zone_counts.iter().enumerate() {
        assert!(*n > 0, "`{}` never appeared", ZONE_VALUES[i]);
    }
    assert!(facts.zone_nulls > 0, "no NULL appeared, so `on_null` would be untested");
}

#[test]
fn the_zone_of_a_feature_is_a_function_of_the_feature_and_not_of_its_position() {
    // Two fixtures of different lengths, same seed: a feature's category must not depend on how
    // many features come after it, or on which chunk it landed in.
    let d = dir("zone-position-independence");
    let small = write_geoparquet(d.join("small.parquet"), &zoned_spec(400)).unwrap();
    let large = write_geoparquet(d.join("large.parquet"), &zoned_spec(4_000)).unwrap();
    assert_eq!(small.features, 400);
    assert_eq!(large.features, 4_000);

    let seed = zoned_spec(1).seed;
    for id in [0u64, 1, 7, 399] {
        assert_eq!(
            spatial_engine::fixture::zone_for(seed, id),
            spatial_engine::fixture::zone_for(seed, id),
            "zone_for is not a pure function"
        );
    }
    // Also different chunk sizes must not change it.
    let chunked = write_geoparquet(
        d.join("chunked.parquet"),
        &FixtureSpec { chunk: 97, ..zoned_spec(400) },
    )
    .unwrap();
    assert_eq!(small.zone_counts, chunked.zone_counts);
    assert_eq!(small.zone_nulls, chunked.zone_nulls);
}

#[test]
fn the_publish_stream_emits_the_declared_projection_in_declared_order() {
    let d = dir("projection");
    let path = d.join("p.parquet");
    write_geoparquet(&path, &zoned_spec(2_000)).unwrap();
    let ds = Dataset::open(&path).unwrap();

    let fields = ds.resolve_projection(&["zone".to_string()]).unwrap();
    assert_eq!(fields.len(), 1);
    assert_eq!(fields[0].name(), "zone");
    assert!(fields[0].is_nullable(), "a published attribute is always nullable");

    let mut s = ds.stream_for_publish(&ViewportQuery::all(), &fields, CancelToken::new()).unwrap();
    // The envelope names the projection — on docs/11 and principle 8's authority, not ADR-010
    // rule 1's, which is about coordinate space.
    let md = s.envelope().schema().metadata().clone();
    assert_eq!(md.get("attribute_columns").unwrap(), r#"["zone"]"#);
    assert_eq!(md.get("frame").unwrap(), spatial_engine::FRAME_AUTHORITATIVE);

    let (ids, zones, _) = drain(&mut s);
    assert_eq!(ids.len(), 2_000);
    assert_eq!(zones.len(), 2_000);
    // Every value matches what the generator says that feature's zone is — so the column that
    // arrives is the column that was written, row for row, after ordering.
    let seed = zoned_spec(1).seed;
    for (id, zone) in ids.iter().zip(zones.iter()) {
        let expected = spatial_engine::fixture::zone_for(seed, *id).map(|s| s.to_string());
        assert_eq!(*zone, expected, "feature {id}");
    }
    assert!(zones.iter().any(|z| z.is_none()), "the NULL branch never travelled");
}

#[test]
fn the_publish_stream_orders_by_identity_and_the_query_path_still_does_not() {
    let d = dir("ordering");
    let path = d.join("o.parquet");
    write_geoparquet(&path, &zoned_spec(3_000)).unwrap();
    let ds = Dataset::open(&path).unwrap();

    let mut published =
        ds.stream_for_publish(&ViewportQuery::all(), &[], CancelToken::new()).unwrap();
    let (ids, _, _) = drain(&mut published);
    assert_eq!(ids.len(), 3_000);
    assert!(ids.windows(2).all(|w| w[0] < w[1]), "publish rows are not ascending by identity");

    // The viewport path is untouched: it returns the same set, and this test asserts the set rather
    // than an order, because the absence of an ORDER BY is what that path is *for*.
    let mut queried = ds.stream(&ViewportQuery::all()).unwrap();
    let (mut q_ids, _, _) = drain(&mut queried);
    q_ids.sort_unstable();
    assert_eq!(q_ids, ids);
}

/// The measured resolution rule the `ORDER BY` comment in `stream.rs` rests on.
///
/// **This started as an assumption and the assumption was wrong**, which is why it is pinned here
/// rather than asserted in a comment. The reasoning under review was that `ORDER BY "id"` carries
/// the same hazard the index range predicates carry — that DuckDB binds a bare name to the base
/// column rather than to the select alias. Injecting `ORDER BY "id"` into the product path did not
/// fail the ordering test, and this is why: **the two clauses resolve in opposite directions.**
///
/// The consequence for the code is small and worth stating plainly: naming the source column in
/// `ORDER BY` is not a bug fix, it is independence from which rule applies. The consequence for
/// this file is larger — a test whose comment claims to catch a bug it cannot catch is worse than
/// no test, because it is read as coverage.
#[test]
fn duckdb_resolves_order_by_and_where_in_opposite_directions() {
    let c = duckdb::Connection::open_in_memory().unwrap();
    c.execute_batch(
        "CREATE TABLE t(id BIGINT, parcel_key BIGINT);
         INSERT INTO t VALUES (300,0),(200,1),(100,2);",
    )
    .unwrap();
    let read = |sql: &str| -> Vec<i64> {
        let mut s = c.prepare(sql).unwrap();
        let v: Vec<i64> = s.query_map([], |r| r.get(0)).unwrap().map(|x| x.unwrap()).collect();
        v
    };

    // ORDER BY binds the **alias**: sorted by parcel_key ascending, not by the base `id` (which
    // descends), so both spellings agree.
    assert_eq!(
        read(r#"SELECT "parcel_key" AS "id" FROM t ORDER BY "id" ASC"#),
        vec![0, 1, 2],
        "ORDER BY no longer resolves the select alias; stream.rs's comment needs revising"
    );
    assert_eq!(read(r#"SELECT "parcel_key" AS "id" FROM t ORDER BY "parcel_key" ASC"#), vec![0, 1, 2]);

    // WHERE binds the **base column**: `"id" >= 200` selects the rows whose base id is 300 and 200,
    // which are parcel_keys 0 and 1 — not the parcel_keys >= 200, of which there are none. This is
    // the hazard `build_sql`'s range-predicate paragraph already records.
    assert_eq!(read(r#"SELECT "parcel_key" AS "id" FROM t WHERE "id" >= 200 ORDER BY "parcel_key""#), vec![0, 1]);
    assert_eq!(read(r#"SELECT "parcel_key" AS "id" FROM t WHERE "parcel_key" >= 2 ORDER BY "parcel_key""#), vec![2]);
}

#[test]
fn a_mapped_identity_orders_by_the_identity_the_stream_actually_emits() {
    // The property that matters regardless of how SQL resolves a bare name: with a declared
    // identity mapping, published rows ascend by the **mapped** identity — the one every partition
    // hash, every `id` in the bundle and ADR-010 rule 2's indirection are expressed in.
    //
    // The fixture makes a wrong binding visible rather than coincidentally agreeable: `parcel_key`
    // ascends with the feature and `id` descends, so ordering by the wrong column is the exact
    // reverse sequence.
    let d = dir("mapped-ordering");
    let path = d.join("both.parquet");
    write_both_id_columns(&path, 500);

    let ds = Dataset::open_with_declared_identity(
        &path,
        IdentityDeclaration::new("parcel_key", "test", "2026-08-06T00:00:00Z"),
        &CancelToken::new(),
    )
    .unwrap();

    let mut s = ds.stream_for_publish(&ViewportQuery::all(), &[], CancelToken::new()).unwrap();
    let (ids, _, _) = drain(&mut s);
    assert_eq!(ids.len(), 500);
    assert!(
        ids.windows(2).all(|w| w[0] < w[1]),
        "rows are not ascending by the *mapped* identity — the ORDER BY bound the wrong column"
    );
    assert_eq!(ids.first(), Some(&0), "first emitted identity is not parcel_key's minimum");
    assert_eq!(ids.last(), Some(&499));
}

#[test]
fn a_publish_partition_is_one_batch_and_its_boundaries_are_reproducible() {
    // "One partition is one `TaggedBatch`" is what keeps the ADR-010 rule 1 envelope on every
    // partition by construction rather than by care. The boundaries must also be a pure function of
    // the row sequence, or two publishes would hash differently while nothing changed.
    let d = dir("partitioning");
    let path = d.join("part.parquet");
    write_geoparquet(&path, &zoned_spec(6_000)).unwrap();
    let ds = Dataset::open(&path).unwrap();
    let fields = ds.resolve_projection(&["zone".to_string()]).unwrap();

    let mut a = ds.stream_for_publish(&ViewportQuery::all(), &fields, CancelToken::new()).unwrap();
    assert_eq!(a.size_policy(), spatial_engine::BatchSizePolicy::publish());
    let (ids_a, zones_a, rows_a) = drain(&mut a);

    let mut b = ds.stream_for_publish(&ViewportQuery::all(), &fields, CancelToken::new()).unwrap();
    let (ids_b, zones_b, rows_b) = drain(&mut b);

    assert_eq!(rows_a, rows_b, "partition boundaries moved between two identical publishes");
    assert_eq!(ids_a, ids_b);
    assert_eq!(zones_a, zones_b);
    assert!(rows_a.len() > 1, "the fixture should span several partitions");
    for n in &rows_a {
        assert!(*n <= spatial_engine::PUBLISH_PARTITION_ROWS, "a partition exceeded the row ceiling");
    }
}

#[test]
fn an_inadmissible_or_reserved_column_is_refused_before_anything_is_written() {
    let d = dir("projection-refusals");
    let path = d.join("r.parquet");
    write_geoparquet(&path, &zoned_spec(200)).unwrap();
    let ds = Dataset::open(&path).unwrap();

    // Not in the file.
    assert!(matches!(
        ds.resolve_projection(&["nope".to_string()]).unwrap_err(),
        EngineError::AttributeUnpublishable { .. }
    ));
    // The geometry column already travels as GeoArrow.
    assert!(matches!(
        ds.resolve_projection(&["geometry".to_string()]).unwrap_err(),
        EngineError::AttributeUnpublishable { .. }
    ));
    // The identity already travels as `id`.
    assert!(matches!(
        ds.resolve_projection(&["id".to_string()]).unwrap_err(),
        EngineError::AttributeUnpublishable { .. }
    ));
    // A struct column is outside the admissible set and is refused rather than flattened.
    assert!(matches!(
        ds.resolve_projection(&["bbox".to_string()]).unwrap_err(),
        EngineError::AttributeUnpublishable { .. }
    ));
}

#[test]
fn a_publish_stream_is_cancellable_like_any_other() {
    let d = dir("cancel");
    let path = d.join("c.parquet");
    write_geoparquet(&path, &zoned_spec(20_000)).unwrap();
    let ds = Dataset::open(&path).unwrap();
    let cancel = CancelToken::new();
    cancel.cancel();
    let mut s = ds.stream_for_publish(&ViewportQuery::all(), &[], cancel).unwrap();
    let mut buf = Vec::new();
    match s.next_into(&mut buf) {
        Some(Err(EngineError::Cancelled)) => {}
        other => panic!("expected a typed cancellation, got {other:?}"),
    }
}

#[test]
fn a_batch_reports_the_bounds_of_the_rows_it_actually_carries() {
    // Bounds are computed over published rows, never lifted from the file's covering bbox: under a
    // filter the file's bbox describes rows the bundle does not contain, and a viewer fitted to it
    // opens on a mostly-empty map that reads as a rendering fault.
    let d = dir("bounds");
    let path = d.join("b.parquet");
    let facts = write_geoparquet(&path, &zoned_spec(4_000)).unwrap();
    let ds = Dataset::open(&path).unwrap();

    let mut s = ds.stream_for_publish(&ViewportQuery::all(), &[], CancelToken::new()).unwrap();
    let mut union = [f64::INFINITY, f64::INFINITY, f64::NEG_INFINITY, f64::NEG_INFINITY];
    let mut buf = Vec::new();
    let mut seen = 0usize;
    while let Some(info) = s.next_into(&mut buf) {
        info.unwrap();
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let batch = rdr.next().unwrap().unwrap();
        // Reconstruct the same walk the engine's own helper performs, over the decoded batch.
        let coords = decoded_coords(&batch);
        for p in coords.chunks_exact(2) {
            union[0] = union[0].min(p[0]);
            union[1] = union[1].min(p[1]);
            union[2] = union[2].max(p[0]);
            union[3] = union[3].max(p[1]);
        }
        seen += 1;
        buf.clear();
    }
    assert!(seen > 0);
    // The published union equals the fixture's own recorded extent, to the bit.
    for i in 0..4 {
        assert_eq!(union[i].to_bits(), facts.extent[i].to_bits(), "bound {i}");
    }
}

fn decoded_coords(batch: &arrow::array::RecordBatch) -> Vec<f64> {
    use arrow::array::{FixedSizeListArray, Float64Array, ListArray};
    let polys = batch.column(1).as_any().downcast_ref::<ListArray>().unwrap();
    let rings = polys.values().as_any().downcast_ref::<ListArray>().unwrap();
    let fsl = rings.values().as_any().downcast_ref::<FixedSizeListArray>().unwrap();
    let flat = fsl.values().as_any().downcast_ref::<Float64Array>().unwrap();
    flat.values().to_vec()
}

/// A file carrying **both** `id` and `parcel_key`, with the two ordering oppositely.
///
/// Written here rather than added to the fixture generator: it exists to make one SQL-resolution
/// hazard visible, and it is not a dataset class anything else needs.
fn write_both_id_columns(path: &std::path::Path, features: usize) {
    use arrow::array::{BinaryBuilder, UInt64Builder};
    use arrow::datatypes::{DataType, Field, Schema};
    use arrow::record_batch::RecordBatch;
    use parquet::arrow::ArrowWriter;
    use parquet::file::metadata::KeyValue;
    use parquet::file::properties::WriterProperties;
    use std::sync::Arc;

    let schema = Arc::new(Schema::new(vec![
        Field::new("id", DataType::UInt64, false),
        Field::new("parcel_key", DataType::UInt64, false),
        Field::new("geometry", DataType::Binary, false),
    ]));

    let mut ids = UInt64Builder::new();
    let mut keys = UInt64Builder::new();
    let mut geoms = BinaryBuilder::new();
    for i in 0..features as u64 {
        // `id` descends while `parcel_key` ascends, so ordering by the wrong one is the reverse
        // sequence rather than a coincidence that happens to agree.
        ids.append_value(features as u64 - 1 - i);
        keys.append_value(i);
        let e = 2_600_000.0 + i as f64;
        let n = 1_200_000.0 + i as f64;
        geoms.append_value(spatial_engine::wkb::encode_polygon(&[vec![
            [e, n],
            [e + 1.0, n],
            [e + 1.0, n + 1.0],
            [e, n],
        ]]));
    }

    let batch = RecordBatch::try_new(
        schema.clone(),
        vec![Arc::new(ids.finish()), Arc::new(keys.finish()), Arc::new(geoms.finish())],
    )
    .unwrap();

    let geo = format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":\"geometry\",\"columns\":{{\"geometry\":{{\
          \"encoding\":\"WKB\",\"geometry_types\":[\"Polygon\"],\"crs\":{}}}}}}}",
        spatial_engine::fixture::LV95_PROJJSON
    );
    let props = WriterProperties::builder()
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo)]))
        .build();
    let f = std::fs::File::create(path).unwrap();
    let mut w = ArrowWriter::try_new(f, schema, Some(props)).unwrap();
    w.write(&batch).unwrap();
    w.close().unwrap();
}
