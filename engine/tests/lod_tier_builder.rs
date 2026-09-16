// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! T1–T11 of `engine/LOD-PREREGISTRATION.md` §4 (T11 added by that file's Amendment 2), each with
//! the mutation §4 declares recorded above it as `RECORDED MUTATION`.
//!
//! **The fixture is `polygons-100k`, read by absolute path** from the shared target directory this
//! tree's measurement fixtures live in (`target/fixtures/slice-budgets/`, the path
//! `kernel/tests/slice_budgets.rs:472` writes and `LOD-PREREGISTRATION.md` §3 names). It is
//! regenerated from the same seeded spec if it is not there, so this file never silently measures a
//! different dataset — and never rewrites one that is.
//!
//! **`parcels-5gb` is not run here.** §3's 5 GB rows are `#[ignore]`d and fixture-gated, in the
//! shape this crate already uses for its 5 GB work (`engine/tests/import_layout_5gb_fixtures.rs`),
//! and they are the tester's to run.
//!
//! **No number in this file is a performance claim.** T6 asserts one declared ceiling
//! (`LOD_CANCEL_OBSERVED_CEILING_MS`, `docs/08`'s existing budget restated) on a single sample; a
//! single sample is not a p50/p95 and nothing here reports one. Wall time is never asserted.

use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};

use arrow::array::{Array, ArrayRef, BinaryArray, BinaryBuilder, StructArray, UInt64Array,
                   UInt64Builder};
use arrow::datatypes::{DataType, Field, Fields, Schema};
use arrow::record_batch::RecordBatch;
use geo::{Simplify, SimplifyVwPreserve, Validation};
use geo_traits::to_geo::ToGeoGeometry;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use parquet::arrow::ArrowWriter;
use parquet::basic::Compression;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

use spatial_engine::cancel::CancelToken;
use spatial_engine::dataset::Dataset;
use spatial_engine::error::EngineError;
use spatial_engine::fixture::{write_geoparquet, CoordinateDomain, CrsMode, FixtureSpec};
use spatial_engine::lod::{
    build_tiers, LodTierKey, TierBatch, TierBuildProgress, TierMiss, TierSet, LOD_BUILD_WORKERS,
    LOD_BUILD_WORKERS_ARM_S, LOD_CRS_NOT_LINEAR, LOD_CRS_UNIT_UNDECLARED, LOD_TIER_COUNT,
    LOD_MIN_TRIANGLE_AREA_LADDER, LOD_TIER_LARGER_THAN_SOURCE, LOD_TIER_STALE,
};

// ---------------------------------------------------------------------------------------------
// The fixture, and the ladder every shared test reads.
// ---------------------------------------------------------------------------------------------

/// `LOD-PREREGISTRATION.md` §3's `polygons-100k`, by absolute path.
///
/// The shared target directory is not inside a worktree, so this is read where it actually lives
/// rather than resolved against `CARGO_MANIFEST_DIR`.
const POLYGONS_100K: &str =
    r"C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet";

/// §3's `parcels-5gb`, for the `#[ignore]`d rows only.
const PARCELS_5GB: &str = r"C:\dev\spatial-ide\target\slice-evidence\scale-pass\parcels-5gb.parquet";

/// The spec `polygons-100k` was written from (`kernel/tests/slice_budgets.rs:472-486`), restated so
/// an absent fixture is regenerated as the same bytes rather than as a different dataset.
fn polygons_100k() -> PathBuf {
    let path = PathBuf::from(POLYGONS_100K);
    if !path.is_file() {
        std::fs::create_dir_all(path.parent().expect("fixture dir")).expect("fixture dir");
        write_geoparquet(
            &path,
            &FixtureSpec { features: 100_000, avg_vertices: 100, hole_every: 7, ..Default::default() },
        )
        .expect("regenerate polygons-100k");
    }
    path
}

struct Ladder {
    set: TierSet,
    source_ids: Vec<u64>,
}

/// The one ladder every shared test reads — built once per test binary, with arm P's declared worker
/// count, over a tier directory this run removed first so the build is a build and not a reuse.
fn ladder() -> &'static Ladder {
    static LADDER: OnceLock<Ladder> = OnceLock::new();
    LADDER.get_or_init(|| {
        let path = polygons_100k();
        let source = Dataset::open(&path).expect("open polygons-100k");
        let cancel = CancelToken::new();
        // A previous run's tiers would be *admitted* (that is the point of the key), and then this
        // suite would assert over files it did not write.
        clear_tier_directory(&source, &cancel);
        let set = build_tiers(&source, LOD_BUILD_WORKERS, &cancel, None)
            .expect("build the polygons-100k ladder");
        let source_ids = read_ids(&path, "id");
        Ladder { set, source_ids }
    })
}

/// Remove whatever is in this source's tier directory, so a build is not silently a reuse.
fn clear_tier_directory(source: &Dataset, cancel: &CancelToken) {
    let (hash, _ms) = spatial_engine::index::content_hash(source.path(), cancel).expect("hash");
    let dir = PathBuf::from(std::env::var_os("LOCALAPPDATA").expect("LOCALAPPDATA"))
        .join("spatial-ide/tiers")
        .join(hash);
    if dir.exists() {
        std::fs::remove_dir_all(&dir).expect("clear the tier directory");
    }
}

// ---------------------------------------------------------------------------------------------
// Small helpers: read back what was written, without going through the code under test.
// ---------------------------------------------------------------------------------------------

fn read_ids(path: &Path, id_column: &str) -> Vec<u64> {
    let file = std::fs::File::open(path).expect("open for ids");
    let reader = ParquetRecordBatchReaderBuilder::try_new(file)
        .expect("reader")
        .with_batch_size(8192)
        .build()
        .expect("build reader");
    let mut out = Vec::new();
    for batch in reader {
        let batch = batch.expect("batch");
        let idx = batch.schema().index_of(id_column).expect("id column");
        let a = batch
            .column(idx)
            .as_any()
            .downcast_ref::<UInt64Array>()
            .expect("id column is UInt64");
        out.extend((0..a.len()).map(|i| a.value(i)));
    }
    out
}

fn read_polygons(path: &Path) -> Vec<geo::Polygon<f64>> {
    let file = std::fs::File::open(path).expect("open for geometry");
    let reader = ParquetRecordBatchReaderBuilder::try_new(file)
        .expect("reader")
        .with_batch_size(8192)
        .build()
        .expect("build reader");
    let mut out = Vec::new();
    for batch in reader {
        let batch = batch.expect("batch");
        let idx = batch.schema().index_of("geometry").expect("geometry column");
        let a = batch
            .column(idx)
            .as_any()
            .downcast_ref::<BinaryArray>()
            .expect("geometry is a binary column");
        for i in 0..a.len() {
            let parsed = wkb::reader::read_wkb(a.value(i)).expect("parse WKB");
            match parsed.try_to_geometry().expect("non-empty geometry") {
                geo::Geometry::Polygon(p) => out.push(p),
                other => panic!("tier row {i} is not a Polygon: {other:?}"),
            }
        }
    }
    out
}

fn ring_vertex_counts(p: &geo::Polygon<f64>) -> Vec<usize> {
    let mut v = vec![p.exterior().0.len()];
    for i in p.interiors() {
        v.push(i.0.len());
    }
    v
}

/// A closed ring of `n` vertices on a circle — dense enough that the ladder's coarser rungs actually
/// remove vertices, which is what keeps each tier of a small fixture under the per-tier ceiling
/// `LOD_TIER_MAX_RELATIVE_BYTES`. (A source with nothing to simplify is T10's case, not T4's or
/// T5's: its tier gains a covering bbox while its geometry stays the size it was, and the per-tier
/// ceiling refuses it.)
fn dense_circle(cx: f64, cy: f64, r: f64, n: usize) -> Vec<Vec<[f64; 2]>> {
    let mut ring: Vec<[f64; 2]> = (0..n)
        .map(|i| {
            let a = (i as f64) * std::f64::consts::TAU / (n as f64);
            [cx + r * a.cos(), cy + r * a.sin()]
        })
        .collect();
    ring.push(ring[0]);
    vec![ring]
}


/// A minimal GeoParquet written by this test, so a source with an arbitrary `geo` key can exist
/// without teaching the shipped fixture generator a CRS shape only one test needs.
fn write_source(path: &Path, geo_key: &str, rings: &[(u64, Vec<Vec<[f64; 2]>>)]) {
    std::fs::create_dir_all(path.parent().expect("dir")).expect("dir");
    let schema = std::sync::Arc::new(Schema::new(vec![
        std::sync::Arc::new(Field::new("id", DataType::UInt64, false)),
        std::sync::Arc::new(Field::new("bbox", DataType::Struct(test_bbox_fields()), false)),
        std::sync::Arc::new(Field::new("geometry", DataType::Binary, false)),
    ]));
    let props = WriterProperties::builder()
        .set_compression(Compression::SNAPPY)
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo_key.to_string())]))
        .build();
    let file = std::fs::File::create(path).expect("create source");
    let mut writer = ArrowWriter::try_new(file, schema.clone(), Some(props)).expect("writer");

    let mut ids = UInt64Builder::with_capacity(rings.len());
    let mut geoms = BinaryBuilder::new();
    let (mut xmin, mut ymin, mut xmax, mut ymax) = (
        arrow::array::Float64Builder::new(),
        arrow::array::Float64Builder::new(),
        arrow::array::Float64Builder::new(),
        arrow::array::Float64Builder::new(),
    );
    for (id, polygon) in rings {
        ids.append_value(*id);
        geoms.append_value(spatial_engine::wkb::encode_polygon(polygon));
        let mut b = [f64::INFINITY, f64::INFINITY, f64::NEG_INFINITY, f64::NEG_INFINITY];
        for ring in polygon {
            for p in ring {
                b[0] = b[0].min(p[0]);
                b[1] = b[1].min(p[1]);
                b[2] = b[2].max(p[0]);
                b[3] = b[3].max(p[1]);
            }
        }
        xmin.append_value(b[0]);
        ymin.append_value(b[1]);
        xmax.append_value(b[2]);
        ymax.append_value(b[3]);
    }
    let bbox: ArrayRef = std::sync::Arc::new(StructArray::new(
        test_bbox_fields(),
        vec![
            std::sync::Arc::new(xmin.finish()) as ArrayRef,
            std::sync::Arc::new(ymin.finish()) as ArrayRef,
            std::sync::Arc::new(xmax.finish()) as ArrayRef,
            std::sync::Arc::new(ymax.finish()) as ArrayRef,
        ],
        None,
    ));
    let batch = RecordBatch::try_new(
        schema,
        vec![
            std::sync::Arc::new(ids.finish()) as ArrayRef,
            bbox,
            std::sync::Arc::new(geoms.finish()) as ArrayRef,
        ],
    )
    .expect("batch");
    writer.write(&batch).expect("write");
    writer.close().expect("close");
}

fn test_bbox_fields() -> Fields {
    Fields::from(vec![
        Field::new("xmin", DataType::Float64, false),
        Field::new("ymin", DataType::Float64, false),
        Field::new("xmax", DataType::Float64, false),
        Field::new("ymax", DataType::Float64, false),
    ])
}

fn geo_key(crs_json: &str) -> String {
    format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":\"geometry\",\"columns\":{{\"geometry\":{{\
          \"encoding\":\"WKB\",\"geometry_types\":[\"Polygon\"],\"crs\":{crs_json},\
          \"covering\":{{\"bbox\":{{\"xmin\":[\"bbox\",\"xmin\"],\"ymin\":[\"bbox\",\"ymin\"],\
          \"xmax\":[\"bbox\",\"xmax\"],\"ymax\":[\"bbox\",\"ymax\"]}}}}}}}}}}"
    )
}

/// EPSG:2056 exactly as the pinned ADR-026 catalog carries it.
fn lv95_definition() -> String {
    spatial_engine::crs_catalog::entries()
        .iter()
        .find(|e| e.code == 2056)
        .expect("the pinned catalog carries EPSG:2056")
        .definition
        .clone()
}

fn scratch_dir(name: &str) -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("workspace root")
        .join("target/fixtures/lod-tier-builder")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).expect("scratch dir");
    d
}

/// Remove the tier directory a small-fixture test created, so a test run leaves the app-local cache
/// as it found it.
fn drop_tiers(set: &TierSet) {
    let _ = std::fs::remove_dir_all(set.directory());
}

// ---------------------------------------------------------------------------------------------
// T1 — O1's hard gate.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: replace `SimplifyVwPreserve` with `geo::Simplify` (RDP) in
// `engine/src/lod.rs::simplify_slice` → tier_build_emits_zero_invalid_polygons fails: at the
// ladder's 5.0 m2 minimum triangle area the builder refuses with `engine.lod_invalid_output` naming feature
// 37926 and `interior ring at index 0 has a self-intersection`, so the ladder never completes and
// the test fails on `build the polygons-100k ladder`. Verified mechanically at unit scale by
// `the_rejected_simplifier_is_the_one_that_emits_invalid_polygons` below, which runs both
// simplifiers over the same five features and asserts the divergence directly.
#[test]
fn tier_build_emits_zero_invalid_polygons() {
    let l = ladder();
    assert_eq!(l.set.tiers().len(), LOD_TIER_COUNT, "the ladder is the declared three tiers");
    for outcome in l.set.tiers() {
        let record = outcome.record();
        let mut invalid: Vec<String> = Vec::new();
        for (i, p) in read_polygons(record.path()).iter().enumerate() {
            if !p.is_valid() {
                let errors: Vec<String> =
                    p.validation_errors().iter().map(|e| e.to_string()).collect();
                invalid.push(format!("row {i}: {}", errors.join("; ")));
            }
        }
        assert!(
            invalid.is_empty(),
            "tier {} (minimum triangle area {} m2) wrote {} invalid polygon(s): {}",
            record.tier(),
            record.key().min_triangle_area_square_metres,
            invalid.len(),
            invalid.join(" | ")
        );
    }
}

/// The evidence behind T1's mutation, at a scale a test can afford: the five `polygons-100k`
/// features the spike's divergence section names, run through both simplifiers at 5.0 m.
///
/// This is not a second T1 — it is the mutation's own record, mechanically checked rather than
/// asserted in a comment. It reads the fixture read-only and writes nothing.
#[test]
fn the_rejected_simplifier_is_the_one_that_emits_invalid_polygons() {
    let path = polygons_100k();
    let ids = read_ids(&path, "id");
    let polygons = read_polygons(&path);
    let wanted = [37926u64, 40320, 61222, 70483, 74445];
    let mut rdp_invalid = 0usize;
    let mut vw_invalid = 0usize;
    let mut seen = 0usize;
    for (id, p) in ids.iter().zip(polygons.iter()) {
        if !wanted.contains(id) {
            continue;
        }
        seen += 1;
        if !p.simplify(5.0).is_valid() {
            rdp_invalid += 1;
        }
        if !p.simplify_vw_preserve(5.0).is_valid() {
            vw_invalid += 1;
        }
    }
    assert_eq!(seen, wanted.len(), "all five named features are in the fixture");
    assert_eq!(vw_invalid, 0, "the pre-committed simplifier emits no invalid polygon on these five");
    assert!(
        rdp_invalid > 0,
        "the rejected alternative is what emits invalid polygons here — if it no longer does, T1's \
         declared mutation no longer makes T1 fail and §4 needs a new one"
    );
}

// ---------------------------------------------------------------------------------------------
// T2 — O2's hard gate.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: drop the final row of each written batch in `engine/src/lod.rs::write_tier`
// (`writer.write(&emitted_batch(.., &rows[..rows.len()-1], ..))`) →
// tier_preserves_identity_for_every_row fails: the emitted id set is missing the last id of every
// row group and the assertion names the first missing id ("tier 1 is missing 13 source id(s), first
// 8191").
#[test]
fn tier_preserves_identity_for_every_row() {
    let l = ladder();
    let source: std::collections::BTreeSet<u64> = l.source_ids.iter().copied().collect();
    assert_eq!(source.len(), l.source_ids.len(), "the source's own ids are unique");

    for outcome in l.set.tiers() {
        let emitted = read_ids(outcome.record().path(), "id");
        let unique: std::collections::BTreeSet<u64> = emitted.iter().copied().collect();
        assert_eq!(
            unique.len(),
            emitted.len(),
            "tier {} emitted {} duplicate id(s)",
            outcome.record().tier(),
            emitted.len() - unique.len()
        );
        let missing: Vec<u64> = source.difference(&unique).copied().collect();
        assert!(
            missing.is_empty(),
            "tier {} is missing {} source id(s), first {}",
            outcome.record().tier(),
            missing.len(),
            missing[0]
        );
        let extra: Vec<u64> = unique.difference(&source).copied().collect();
        assert!(extra.is_empty(), "tier {} emitted {} id(s) the source has not", outcome.record().tier(), extra.len());
        assert_eq!(emitted.len() as u64, outcome.record().features(), "the record counts what was written");
    }
}

// ---------------------------------------------------------------------------------------------
// T3 — O3's hard gate. The cross-module seam: the engine's own open path, from the real shape.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: omit the `geo` key from the written tier's footer metadata
// (`engine/src/lod.rs::tier_footer_metadata` returning only the licence keys) →
// engine_opens_its_own_tier fails: `Dataset::open` returns `EngineError::GeoMetadata` at R-P2
// (`dataset.rs:684-686`) and the test fails by name on "open the tier this engine wrote".
#[test]
fn engine_opens_its_own_tier() {
    let l = ladder();
    let source = Dataset::open(polygons_100k()).expect("open the source");
    for outcome in l.set.tiers() {
        let tier = Dataset::open(outcome.record().path()).expect("open the tier this engine wrote");
        assert_eq!(tier.crs().identifier(), source.crs().identifier(), "the tier is in the source's CRS");
        assert_eq!(tier.geometry_column(), source.geometry_column());
        assert_eq!(tier.geoparquet_version(), source.geoparquet_version());
        assert!(tier.covering().is_some(), "the tier declares its own covering bbox columns");
        assert_eq!(
            tier.identity().source().source_column(),
            source.identity().source().source_column(),
            "the tier carries the source's identity column, by name"
        );
    }
}

// ---------------------------------------------------------------------------------------------
// T4 — never served when the source's content hash changes.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: remove `source_content_hash` from `LodTierKey`'s `PartialEq` (a hand-written
// impl comparing the other four members) → tier_is_not_served_when_source_content_hash_changes
// fails: `record.admit(&key_from_other_bytes, ..)` returns `Ok`, the assertion "a tier built from
// other bytes must not be admitted" fails by name, and a tier built from the old bytes would be
// served for the new ones.
// RECORDED MUTATION (reviewer/architect attempt-1 SHOULD-FIX, §10 Amendment 8 item (i)3): drop the
// re-`stat` on the reuse path in `engine/src/lod.rs::build_tiers` — take `Ok(_admitted) =>
// (Some(found.clone()), None)` again → a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size
// fails by name on "a tier whose bytes changed on disk is not the artifact its record names": the
// altered tier is admitted, `was_rebuilt()` is false, and the disclosed set size is the record's
// stale byte count rather than the bytes on disk.
#[test]
fn a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size() {
    let dir = scratch_dir("reuse-restat");
    let path = dir.join("source.parquet");
    let rings: Vec<(u64, Vec<Vec<[f64; 2]>>)> = (0..32u64)
        .map(|i| (i, dense_circle(2_600_000.0 + i as f64 * 60.0, 1_200_000.0, 20.0, 256)))
        .collect();
    write_source(&path, &geo_key(&lv95_definition()), &rings);

    let source = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    let first = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("build");
    let tier_one = first.tiers()[0].record().path().to_path_buf();
    let recorded_bytes = first.tiers()[0].record().bytes();

    // The source is untouched, so its key still admits — and every tier is reused.
    let reused = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("reuse");
    assert!(reused.tiers().iter().all(|t| !t.was_rebuilt()), "an unchanged ladder is reused whole");

    // Now the artifact changes under the record: same path, same key, different bytes.
    {
        use std::io::Write;
        let mut f = std::fs::OpenOptions::new().append(true).open(&tier_one).expect("open the tier");
        f.write_all(&[0u8; 4_096]).expect("alter the tier on disk");
    }
    let altered_bytes = std::fs::metadata(&tier_one).expect("stat").len();
    assert_ne!(altered_bytes, recorded_bytes, "the alteration really changed the file's size");

    let after = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("rebuild");
    assert!(
        after.tiers()[0].was_rebuilt(),
        "a tier whose bytes changed on disk is not the artifact its record names"
    );
    assert_eq!(after.tiers()[0].miss(), Some(TierMiss::Absent));
    assert!(
        after.tiers()[1..].iter().all(|t| !t.was_rebuilt()),
        "and the tiers that did not change are still reused"
    );

    // The disclosure is the size on disk, not the size a record remembers.
    let on_disk: u64 = after
        .tiers()
        .iter()
        .map(|t| std::fs::metadata(t.record().path()).expect("stat a tier").len())
        .sum();
    assert_eq!(after.total_bytes(), on_disk);
    assert_eq!(after.disk_cost().total_bytes, on_disk);
    for outcome in after.tiers() {
        assert_eq!(
            outcome.record().bytes(),
            std::fs::metadata(outcome.record().path()).expect("stat").len(),
            "every disclosed per-tier size is the file's own"
        );
    }
    drop_tiers(&after);
}

// RECORDED MUTATION (§6's instrument, §10 Amendment 8 item (i)9): return `Duration::ZERO` from
// `simplify_slice`'s `max_simplify` instead of the measured maximum →
// a_build_measures_the_largest_single_feature_simplify fails by name on "a build that simplified
// features measures the residual": `max_single_feature_simplify()` is `None`, because the builder
// reports a maximum only when one was actually taken.
#[test]
fn a_build_measures_the_largest_single_feature_simplify() {
    let dir = scratch_dir("residual-instrument");
    let path = dir.join("source.parquet");
    // **Deliberately not byte-identical to any other test's source.** The tier directory is keyed by
    // the source's content hash, so two tests whose sources have the same bytes would build, alter
    // and delete tiers in the *same* directory — and this suite runs its tests in parallel threads.
    let rings: Vec<(u64, Vec<Vec<[f64; 2]>>)> = (0..24u64)
        .map(|i| (i, dense_circle(2_600_000.0 + i as f64 * 70.0, 1_200_000.0, 21.0, 192)))
        .collect();
    write_source(&path, &geo_key(&lv95_definition()), &rings);
    let source = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();

    let built = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("build");
    assert!(built.tiers().iter().all(|t| t.was_rebuilt()), "this ladder was built, not reused");
    let measured = built
        .max_single_feature_simplify()
        .expect("a build that simplified features measures the residual");
    assert!(
        measured > std::time::Duration::ZERO,
        "the instrument reports the call it timed, not a placeholder"
    );

    // §6's instrument is about the *residual* `LOD_CANCEL_OBSERVED_CEILING_MS` declares: one
    // feature's simplify call has no interruption point inside it. The value is reported, never
    // asserted against a budget here — the figure is the tester's (§6, §9), and nothing in this
    // test or in the builder writes it into a file, a comment or a document.
    let reused = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("reuse");
    assert!(reused.tiers().iter().all(|t| !t.was_rebuilt()));
    assert!(
        reused.max_single_feature_simplify().is_none(),
        "a run that simplified nothing reports no maximum, rather than a stale or zero one"
    );
    drop_tiers(&built);
}

#[test]
fn tier_is_not_served_when_source_content_hash_changes() {
    let dir = scratch_dir("t4");
    let path = dir.join("source.parquet");
    let rings: Vec<(u64, Vec<Vec<[f64; 2]>>)> =
        (0..64u64).map(|i| (i, dense_circle(2_600_000.0 + i as f64 * 60.0, 1_200_000.0, 20.0, 256))).collect();
    write_source(&path, &geo_key(&lv95_definition()), &rings);

    let source = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    let set = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("build");

    // (a) The key is what decides. Same file, same heuristic, one different content hash.
    let record = set.tiers()[0].record();
    let other = LodTierKey::new(
        "0000000000000000000000000000000000000000000000000000000000000000",
        record.key().min_triangle_area_square_metres,
        record.key().id_column.clone(),
    );
    let validity = spatial_engine::index::ValidityHeuristic::of(&path);
    let refused = record.admit(&other, validity.as_ref());
    match refused {
        Ok(_) => panic!("a tier built from other bytes must not be admitted"),
        Err(stale) => assert_eq!(stale.miss(), TierMiss::KeyMismatch),
    }
    // The same record admits for its own key — otherwise the assertion above would be vacuous.
    assert!(record.admit(record.key(), validity.as_ref()).is_ok(), "its own key still admits");

    // (b) End to end: an unchanged source reuses; a rewritten one is a miss and is rebuilt.
    let again = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("reuse");
    assert!(
        again.tiers().iter().all(|t| !t.was_rebuilt()),
        "an unchanged source admits its own tiers rather than rebuilding them"
    );

    let mut changed = rings.clone();
    changed.push((999, dense_circle(2_600_000.0, 1_200_400.0, 20.0, 256)));
    write_source(&path, &geo_key(&lv95_definition()), &changed);
    let source2 = Dataset::open(&path).expect("reopen");
    let rebuilt = build_tiers(&source2, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("rebuild");
    assert_ne!(rebuilt.source_content_hash(), set.source_content_hash(), "the source changed");
    assert!(
        rebuilt.tiers().iter().all(|t| t.miss() == Some(TierMiss::Absent)),
        "a tier built from the old bytes is not served for the new ones"
    );
    drop_tiers(&set);
    drop_tiers(&rebuilt);
}

// ---------------------------------------------------------------------------------------------
// T5 — structural: a stale-tier batch cannot exist without the label.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: add a second constructor for a stale-tier batch that does not set the label
// (e.g. `pub fn from_stale_unlabelled(tier: u8, rows: u64) -> Self { Self { tier, rows, label:
// TierLabel::Resident(tier) } }` in `engine/src/lod.rs`'s `impl TierBatch`) →
// a_stale_tier_batch_cannot_exist_without_the_stale_label fails: the structural half counts three
// constructors where the type's contract allows two and reports "a constructor of TierBatch that
// does not derive its label from a witness".
#[test]
fn a_stale_tier_batch_cannot_exist_without_the_stale_label() {
    let dir = scratch_dir("t5");
    let path = dir.join("source.parquet");
    let rings: Vec<(u64, Vec<Vec<[f64; 2]>>)> =
        (0..16u64).map(|i| (i, dense_circle(2_600_000.0 + i as f64 * 60.0, 1_200_000.0, 20.0, 256))).collect();
    write_source(&path, &geo_key(&lv95_definition()), &rings);
    let source = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    let set = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &cancel, None).expect("build");
    let record = set.tiers()[0].record();

    // Behavioural half: the only way to a stale-tier batch is through the witness the rejection
    // produced, and that path always labels it.
    let stale = record
        .admit(
            &LodTierKey::new("deadbeef", record.key().min_triangle_area_square_metres, record.key().id_column.clone()),
            spatial_engine::index::ValidityHeuristic::of(&path).as_ref(),
        )
        .expect_err("a mismatched key is a miss");
    let batch = TierBatch::from_stale(&stale, 42);
    assert!(batch.is_stale());
    assert_eq!(batch.label().as_str(), LOD_TIER_STALE);
    assert_eq!(batch.rows(), 42);

    let admitted = record
        .admit(record.key(), spatial_engine::index::ValidityHeuristic::of(&path).as_ref())
        .expect("its own key admits");
    let resident = TierBatch::from_admitted(&admitted, 42);
    assert!(!resident.is_stale());
    assert_eq!(resident.label().as_str(), format!("lod.tier_resident{{{}}}", record.tier()));

    // Structural half: there is no third way in. Every constructor in `impl TierBatch` takes a
    // witness and sets the label from it; none takes a `TierLabel`. A new constructor that skipped
    // the witness would be the block-on-sight of §8 item 5, and this is what notices it.
    let source_text = std::fs::read_to_string(
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src/lod.rs"),
    )
    .expect("read lod.rs");
    let block = source_text
        .split("impl TierBatch {")
        .nth(1)
        .expect("lod.rs declares `impl TierBatch`")
        .split("\n}\n")
        .next()
        .expect("the impl block ends");
    let constructors: Vec<&str> =
        block.lines().filter(|l| l.contains("pub fn ") && l.contains("-> Self")).collect();
    assert_eq!(
        constructors.len(),
        2,
        "a constructor of TierBatch that does not derive its label from a witness: {constructors:?}"
    );
    assert!(
        constructors.iter().all(|c| c.contains("&AdmittedTier") || c.contains("&StaleTier")),
        "every TierBatch constructor takes an admission witness: {constructors:?}"
    );
    assert!(
        !block.contains("label: TierLabel)") && !block.contains("label: &TierLabel"),
        "no TierBatch constructor takes a label as a parameter"
    );
    drop_tiers(&set);
}

// T6 — `cancel_observed_within_the_declared_ceiling` — lives in its own test binary,
// `engine/tests/lod_tier_cancellation.rs`. It cancels a build of the *same* fixture and so owns the
// same tier directory this file's ladder does; cargo runs test binaries one after another, which is
// what keeps the two from asserting over each other's files.

// ---------------------------------------------------------------------------------------------
// T7 — O4, the row order §2d rules on.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: reverse each emitted batch before writing it in
// `engine/src/lod.rs::write_tier` (`rows.reverse();` before `emitted_batch`) →
// tier_writer_does_not_reorder_rows fails naming the first differing row ("tier 1 row 0: source id
// 0, tier id 8191").
#[test]
fn tier_writer_does_not_reorder_rows() {
    let l = ladder();
    for outcome in l.set.tiers() {
        let emitted = read_ids(outcome.record().path(), "id");
        assert_eq!(emitted.len(), l.source_ids.len(), "tier {} row count", outcome.record().tier());
        if let Some(i) = (0..emitted.len()).find(|&i| emitted[i] != l.source_ids[i]) {
            panic!(
                "tier {} row {i}: source id {}, tier id {} — the tier must be written in the \
                 source's own identity order (§2d)",
                outcome.record().tier(),
                l.source_ids[i],
                emitted[i]
            );
        }
    }
}

// ---------------------------------------------------------------------------------------------
// T8, T9 — the two CRS refusals of §2c.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: delete the angular-unit check in `engine/src/lod.rs::linear_unit_of` (the
// `crs_type == "GeographicCRS" || unit == Degree` arm) → geographic_crs_source_is_refused_for_tier_building
// fails: the build is accepted and an area in square degrees passes into the simplifier, so the
// call returns `Ok` and the assertion "a geographic CRS must be refused" fails by name.
#[test]
fn geographic_crs_source_is_refused_for_tier_building() {
    let dir = scratch_dir("t8");
    let path = dir.join("wgs84.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 32,
            avg_vertices: 8,
            crs_mode: CrsMode::DeclaredCrs84Degrees,
            domain: CoordinateDomain::Wgs84Degrees,
            ..Default::default()
        },
    )
    .expect("write a geographic source");

    let source = Dataset::open(&path).expect("open the geographic source");
    let outcome = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &CancelToken::new(), None);
    match outcome {
        Err(EngineError::LodRefused { refusal, .. }) => {
            assert_eq!(refusal, LOD_CRS_NOT_LINEAR, "a geographic CRS must be refused");
        }
        other => panic!("a geographic CRS must be refused with {LOD_CRS_NOT_LINEAR}: {other:?}"),
    }
}

// RECORDED MUTATION: default the missing conversion factor to 1.0 in
// `engine/src/lod.rs::linear_unit_of` (return `Ok(LinearUnit { metres_per_unit: 1.0, .. })` for the
// `Unestablished` arm) → crs_without_a_declared_linear_unit_is_refused fails: the refusal
// `engine.lod_crs_unit_undeclared` does not fire and the build returns `Ok`.
#[test]
fn crs_without_a_declared_linear_unit_is_refused() {
    let dir = scratch_dir("t9");
    let path = dir.join("no-unit.parquet");

    // EPSG:2056 with the `unit` member removed from its own two coordinate-system axes, and nothing
    // else touched — its axis *directions* still establish the axis order, so the file opens and
    // the refusal is about the unit and about nothing else.
    let mut definition: serde_json::Value =
        serde_json::from_str(&lv95_definition()).expect("lv95 projjson");
    for axis in definition["coordinate_system"]["axis"]
        .as_array_mut()
        .expect("lv95 declares its axes")
    {
        axis.as_object_mut().expect("axis object").remove("unit");
    }
    let rings: Vec<(u64, Vec<Vec<[f64; 2]>>)> =
        (0..16u64).map(|i| (i, dense_circle(2_600_000.0 + i as f64 * 60.0, 1_200_000.0, 20.0, 256))).collect();
    write_source(&path, &geo_key(&definition.to_string()), &rings);

    let source = Dataset::open(&path).expect("open the unit-less source");
    let outcome = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &CancelToken::new(), None);
    match outcome {
        Err(EngineError::LodRefused { refusal, .. }) => {
            assert_eq!(refusal, LOD_CRS_UNIT_UNDECLARED, "no default factor is assumed");
        }
        other => panic!("an undeclared linear unit must be refused with {LOD_CRS_UNIT_UNDECLARED}: {other:?}"),
    }
}

// ---------------------------------------------------------------------------------------------
// T10 — O8's per-tier ceiling.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: remove the size comparison in `engine/src/lod.rs::build_one_tier` (the
// `bytes > limit` arm) → tier_larger_than_its_source_is_refused fails: a tier exceeding its
// source's byte size is written and returned `Ok` instead of `engine.lod_tier_larger_than_source`,
// and the assertion fails by name.
#[test]
fn tier_larger_than_its_source_is_refused() {
    let dir = scratch_dir("t10");
    let path = dir.join("nothing-to-simplify.parquet");
    // A source with no covering bbox column and geometry the ladder's smallest minimum triangle
    // area cannot reduce: the tier
    // gains its own covering bbox (a property of the tier, §2d) while its geometry stays the size
    // it was, so the output is larger than the input — which is a defect, not a tier.
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 4_000,
            avg_vertices: 4,
            hole_every: 0,
            with_covering_bbox: false,
            ..Default::default()
        },
    )
    .expect("write a source with nothing to simplify");

    let source = Dataset::open(&path).expect("open");
    let outcome = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &CancelToken::new(), None);
    match outcome {
        Err(EngineError::CeilingExceeded { ceiling, limit, saw }) => {
            assert_eq!(ceiling, LOD_TIER_LARGER_THAN_SOURCE);
            assert!(saw > limit, "the refusal reports what convicted it: {saw} > {limit}");
        }
        other => panic!("a tier larger than its source must be refused: {other:?}"),
    }
    // Nothing over the ceiling is kept on disk.
    let (hash, _ms) = spatial_engine::index::content_hash(&path, &CancelToken::new()).expect("hash");
    let tier_dir = PathBuf::from(std::env::var_os("LOCALAPPDATA").expect("LOCALAPPDATA"))
        .join("spatial-ide/tiers")
        .join(hash);
    let kept: Vec<PathBuf> = std::fs::read_dir(&tier_dir)
        .map(|rd| {
            rd.filter_map(|e| e.ok())
                .map(|e| e.path())
                .filter(|p| p.extension().is_some_and(|x| x == "parquet"))
                .collect()
        })
        .unwrap_or_default();
    assert!(kept.is_empty(), "the over-ceiling tier was kept on disk: {kept:?}");
    let _ = std::fs::remove_dir_all(&tier_dir);
}

// ---------------------------------------------------------------------------------------------
// T11 — Amendment 2: the `wkb` writer, never exercised by the spike.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: flip the byte-order flag passed to `wkb::writer` for one geometry in
// `engine/src/lod.rs::simplify_slice` (`endianness: if id == 7 { BigEndian } else { LittleEndian }`)
// → wkb_writer_round_trips_the_first_tier_written fails by name on the first coordinate mismatch
// for that feature ("tier 1 row 7: coordinate 0 read back as a different bit pattern"). The rest of
// the file still decodes, which is the point: a byte-order defect is silent until something
// compares coordinates.
#[test]
fn wkb_writer_round_trips_the_first_tier_written() {
    let l = ladder();
    let first = l.set.tiers().first().expect("the ladder has a first tier").record();
    assert_eq!(first.tier(), 1);
    assert_eq!(first.key().min_triangle_area_square_metres, LOD_MIN_TRIANGLE_AREA_LADDER[0]);

    // The expected geometry is computed here, independently of the builder: the source's own WKB,
    // decoded and simplified at the tier's own minimum triangle area, in the source's squared unit.
    let source_polygons = read_polygons(&polygons_100k());
    let tier_polygons = read_polygons(first.path());
    assert_eq!(tier_polygons.len(), source_polygons.len(), "the tier has the source's row count");

    let epsilon = first.min_triangle_area_source_units();
    let mut vertices_after = 0u64;
    for (row, (src, got)) in source_polygons.iter().zip(tier_polygons.iter()).enumerate() {
        let expected = src.simplify_vw_preserve(epsilon);
        let (ea, ga) = (ring_vertex_counts(&expected), ring_vertex_counts(got));
        assert_eq!(ea.len(), ga.len(), "tier 1 row {row}: ring count");
        assert_eq!(ea, ga, "tier 1 row {row}: per-ring vertex counts");
        vertices_after += ga.iter().map(|n| *n as u64).sum::<u64>();

        let coords_of = |p: &geo::Polygon<f64>| -> Vec<(u64, u64)> {
            let mut v: Vec<(u64, u64)> =
                p.exterior().0.iter().map(|c| (c.x.to_bits(), c.y.to_bits())).collect();
            for i in p.interiors() {
                v.extend(i.0.iter().map(|c| (c.x.to_bits(), c.y.to_bits())));
            }
            v
        };
        let (ec, gc) = (coords_of(&expected), coords_of(got));
        if let Some(i) = (0..ec.len()).find(|&i| ec[i] != gc[i]) {
            panic!(
                "tier 1 row {row}: coordinate {i} read back as a different bit pattern \
                 (expected {:?}, read {:?})",
                ec[i], gc[i]
            );
        }
    }
    assert_eq!(
        vertices_after,
        first.vertices_after(),
        "the record's vertex count is the count of what is on disk"
    );
}

// ---------------------------------------------------------------------------------------------
// T13 — §10 Amendment 6: the built set's actual size is disclosed with the tiers.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: drop the size from the manifest — delete the `"set"` block from
// `engine/src/lod.rs::write_manifest` → the_built_sets_size_is_disclosed_with_the_tiers fails by
// name on "tiers.json discloses the set's own size": `manifest["set"]` is `null`, so the assertion
// that `set.bytes` equals the sum of the tier files' bytes cannot be made at all.
#[test]
fn the_built_sets_size_is_disclosed_with_the_tiers() {
    let l = ladder();
    let manifest: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(l.set.manifest_path()).expect("read tiers.json"))
            .expect("tiers.json parses");

    let set = manifest.get("set").expect("tiers.json discloses the set's own size");
    let disclosed = set.get("bytes").and_then(serde_json::Value::as_u64).expect("set.bytes");
    let on_disk: u64 = l
        .set
        .tiers()
        .iter()
        .map(|t| std::fs::metadata(t.record().path()).expect("stat a tier").len())
        .sum();
    assert_eq!(disclosed, on_disk, "the disclosed size is the size of the files on disk");
    assert_eq!(disclosed, l.set.total_bytes(), "and the same the result type reports");

    // The bound it is read against, and the source it is relative to.
    let bound = set.get("hard_bound_bytes").and_then(serde_json::Value::as_u64).expect("hard bound");
    assert_eq!(bound, l.set.hard_bound_bytes());
    assert_eq!(bound, l.set.source_bytes() * 3, "tier count x the per-tier ceiling, by construction");
    assert!(disclosed <= bound, "the set is within its by-construction bound");

    // Per tier, in ladder order — the disclosure is not one number a reader has to trust.
    let per_tier = set.get("per_tier_bytes").and_then(serde_json::Value::as_array).expect("per tier");
    assert_eq!(per_tier.len(), LOD_TIER_COUNT);
    for (i, entry) in per_tier.iter().enumerate() {
        assert_eq!(entry.get("tier").and_then(serde_json::Value::as_u64), Some(i as u64 + 1));
        assert_eq!(
            entry.get("bytes").and_then(serde_json::Value::as_u64),
            Some(l.set.tiers()[i].record().bytes())
        );
    }

    // The prepare report's disk half carries the same facts as the manifest.
    let cost = l.set.disk_cost();
    assert_eq!(cost.total_bytes, disclosed);
    assert_eq!(cost.hard_bound_bytes, bound);
    assert!(cost.free_bytes_before_build.is_some(), "the preflight ran and its reading is disclosed");

    // The ruling's first rider, on the tier's own description: areas in squared units, never a
    // "tolerance in metres".
    let first = &manifest.get("tiers").and_then(serde_json::Value::as_array).expect("tiers")[0];
    assert_eq!(
        first.get("quantity").and_then(serde_json::Value::as_str),
        Some("minimum triangle area")
    );
    assert!(first.get("min_triangle_area_square_metres").is_some());
    assert!(first.get("area_unit").and_then(serde_json::Value::as_str).unwrap().starts_with("square "));
    let text = std::fs::read_to_string(l.set.manifest_path()).expect("read tiers.json");
    assert!(!text.contains("tolerance"), "no tier is described as a tolerance (§10 Amendment 7)");
}

// ---------------------------------------------------------------------------------------------
// §3's 5 GB rows — `#[ignore]`d and fixture-gated, the tester's to run. Disk discipline in the code
// (`LOD-PREREGISTRATION.md` §3): never two 5 GB-scale outputs on disk at once; each tier is built,
// its facts recorded, then deleted before the next; free space reported before and after.
// ---------------------------------------------------------------------------------------------

/// The same 40 GiB floor this crate's other 5 GB phases declare
/// (`engine/tests/import_layout_5gb_fixtures.rs:132`).
const MIN_FREE_BYTES: u64 = 40 * 1024 * 1024 * 1024;

fn free_bytes_on_c() -> Option<u64> {
    let out = std::process::Command::new("powershell")
        .args(["-NoProfile", "-Command", "(Get-PSDrive C).Free"])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

/// Deletes tier N−1 the moment tier N starts writing, so the 5 GB ladder is never two completed
/// GB-scale outputs on disk at once (§3's disk discipline, in the ignored test's own code).
///
/// **The observer seam is what makes this possible from outside the builder.** Nothing inside
/// [`build_tiers`] re-reads a finished tier — its bytes and sha256 are recorded the moment it
/// closes, and the ladder's total is checked arithmetically from those records (§3) — so removing
/// the file afterwards removes a copy, never a fact.
struct DiskDiscipline {
    directory: PathBuf,
    deleted: Mutex<Vec<u8>>,
}

impl TierBuildProgress for DiskDiscipline {
    fn tier_progress(&self, tier: u8, _features_done: u64, _features_total: u64) {
        if tier < 2 {
            return;
        }
        let mut deleted = self.deleted.lock().expect("lock");
        let previous = tier - 1;
        if deleted.contains(&previous) {
            return;
        }
        let path = self.directory.join(format!("tier-{previous}.parquet"));
        match std::fs::remove_file(&path) {
            Ok(()) => println!(
                "disk discipline: removed tier {previous} at {} before tier {tier} grew; free {} B",
                path.display(),
                free_bytes_on_c().unwrap_or(0)
            ),
            Err(e) => println!("disk discipline: tier {previous} not removed ({e})"),
        }
        deleted.push(previous);
    }

    fn cancel_observed(&self, _tier: u8, _features_done: u64) {}
}

/// Build the 5 GB ladder with the previous tier deleted as the next one starts, and report each
/// tier's facts. Nothing here asserts a wall time: the numbers are the tester's (§6, §9).
#[test]
#[ignore = "reads the 5 GB fixture and writes GB-scale tiers; run explicitly with --release: \
            cargo test --release -p spatial-engine --test lod_tier_builder -- --ignored --exact \
            the_5gb_ladder_under_disk_discipline --nocapture"]
fn the_5gb_ladder_under_disk_discipline() {
    let path = PathBuf::from(PARCELS_5GB);
    assert!(
        path.is_file(),
        "the 5 GB fixture is absent at {} — this phase refuses to run rather than measure \
         something else, and never regenerates a fixture other cuts' records depend on",
        path.display()
    );
    let free_before = free_bytes_on_c().unwrap_or(0);
    println!("free disk before: {free_before} B (floor {MIN_FREE_BYTES} B)");
    assert!(
        free_before >= MIN_FREE_BYTES,
        "refusing to start below the declared floor: {free_before} B free (§5, I6)"
    );

    let source = Dataset::open(&path).expect("open parcels-5gb");
    let cancel = CancelToken::new();
    let (hash, _ms) = spatial_engine::index::content_hash(&path, &cancel).expect("hash the source");
    let directory = PathBuf::from(std::env::var_os("LOCALAPPDATA").expect("LOCALAPPDATA"))
        .join("spatial-ide/tiers")
        .join(&hash);
    let _ = std::fs::remove_dir_all(&directory);
    let discipline = DiskDiscipline { directory: directory.clone(), deleted: Mutex::new(Vec::new()) };

    let set = build_tiers(&source, LOD_BUILD_WORKERS, &cancel, Some(&discipline))
        .expect("build the 5 GB ladder");
    for outcome in set.tiers() {
        let record = outcome.record();
        println!(
            "tier {} minimum triangle area {} m2 ({} source square units) features {} vertices {} -> {} bytes {} sha256 {}",
            record.tier(),
            record.key().min_triangle_area_square_metres,
            record.min_triangle_area_source_units(),
            record.features(),
            record.vertices_before(),
            record.vertices_after(),
            record.bytes(),
            record.sha256()
        );
    }
    println!("ladder total (arithmetic, §3): {} B over a source of {} B", set.total_bytes(), set.source_bytes());

    // Delete after the measurement, and say what is left.
    for outcome in set.tiers() {
        let _ = std::fs::remove_file(outcome.record().path());
    }
    let left: Vec<PathBuf> = std::fs::read_dir(&directory)
        .map(|rd| {
            rd.filter_map(|e| e.ok())
                .map(|e| e.path())
                .filter(|p| p.extension().is_some_and(|x| x == "parquet"))
                .collect()
        })
        .unwrap_or_default();
    assert!(left.is_empty(), "the tier directory still holds a parquet file after deletion: {left:?}");
    println!("free disk after: {} B", free_bytes_on_c().unwrap_or(0));
}
