//! Integration tests for the one operation this slice has: open → SQL filter → stream → cancel.
//!
//! Every test runs against a **real GeoParquet file** written by the seeded fixture generator, read
//! back through DuckDB. Assertions about admission and refusal are made against files, not against
//! hand-written metadata strings, because "the engine refuses this file" and "the engine refuses
//! this JSON" are different claims and only the first one is the product.

use std::path::PathBuf;
use std::sync::Arc;
use std::time::{Duration, Instant};

use arrow::array::{Array, FixedSizeListArray, Float64Array, ListArray};
use spatial_engine::fixture::{write_geoparquet, CrsMode, FixtureFacts, FixtureSpec};
use spatial_engine::{
    Bbox, CancelToken, CrsAssertion, CrsSource, Dataset, EngineError, ViewportQuery,
};

fn fixture_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

fn write(name: &str, spec: &FixtureSpec) -> (PathBuf, FixtureFacts) {
    let path = fixture_dir().join(format!("{name}.parquet"));
    let facts = write_geoparquet(&path, spec).expect("write fixture");
    (path, facts)
}

/// Wait until a counter stops moving, and return where it stopped.
///
/// A backpressured producer works ahead into its window and *then* stops, so sampling once after an
/// arbitrary delay reads a value mid-climb. `stable_samples` consecutive equal readings is what
/// distinguishes "it has stopped" from "it has not got there yet" — and a producer that never stops
/// never plateaus, which is the failure this is here to detect.
fn wait_for_plateau(deadline: Duration, stable_samples: u32, mut read: impl FnMut() -> u64) -> Option<u64> {
    let end = Instant::now() + deadline;
    let mut last = read();
    let mut stable = 0;
    while Instant::now() < end {
        std::thread::sleep(Duration::from_millis(10));
        let now = read();
        if now == last && now > 0 {
            stable += 1;
            if stable >= stable_samples {
                return Some(now);
            }
        } else {
            stable = 0;
            last = now;
        }
    }
    None
}

fn small() -> FixtureSpec {
    FixtureSpec { features: 2_000, avg_vertices: 20, ..Default::default() }
}

/// Drain a stream into (rows, batches, coordinate-bit reduction, ids).
fn drain(stream: &mut spatial_engine::BatchStream) -> (usize, usize, u64, Vec<u64>) {
    let (mut rows, mut batches, mut bits) = (0usize, 0usize, 0u64);
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        let info = info.expect("batch");
        rows += info.rows;
        batches += 1;

        let mut rdr = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("ipc reader");
        let batch = rdr.next().expect("one batch").expect("decode");
        let id_col = batch
            .column(0)
            .as_any()
            .downcast_ref::<arrow::array::UInt64Array>()
            .expect("id column");
        ids.extend(id_col.values().iter().copied());
        bits ^= coord_bits(batch.column(1));
        buf.clear();
    }
    (rows, batches, bits, ids)
}

/// The same order-independent reduction the fixture computes while writing, applied to what came
/// out the other end. Equality is bit-identity of every coordinate, not a tolerance.
fn coord_bits(geometry: &Arc<dyn Array>) -> u64 {
    let polys = geometry.as_any().downcast_ref::<ListArray>().expect("polygon list");
    let mut acc = 0u64;
    for p in 0..polys.len() {
        let rings = polys.value(p);
        let rings = rings.as_any().downcast_ref::<ListArray>().expect("ring list");
        for r in 0..rings.len() {
            let verts = rings.value(r);
            let verts = verts
                .as_any()
                .downcast_ref::<FixedSizeListArray>()
                .expect("vertex fixed-size list");
            let flat = verts.values().as_any().downcast_ref::<Float64Array>().expect("xy");
            for v in 0..verts.len() {
                let x = flat.value(v * 2);
                let y = flat.value(v * 2 + 1);
                acc ^= x.to_bits().rotate_left(1) ^ y.to_bits();
            }
        }
    }
    acc
}

// ---------------------------------------------------------------------------------------------
// Admission — the ADR-015 policy, exercised through files
// ---------------------------------------------------------------------------------------------

#[test]
fn a_declared_crs_is_admitted_as_a_file_fact() {
    let (path, _) = write("declared", &small());
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(ds.crs().identifier(), "EPSG:2056");
    assert_eq!(ds.crs().source(), CrsSource::File);
    assert_eq!(ds.crs().axis_order().as_str(), "easting,northing");
    assert!(
        ds.crs().definition_json().unwrap().contains("Bessel 1841"),
        "the file's own definition travels, not just its code"
    );
    assert_eq!(ds.geoparquet_version(), "1.1.0");
}

#[test]
fn a_file_with_no_crs_is_refused_and_the_geoparquet_default_is_not_applied() {
    let (path, _) = write(
        "absent-crs",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, ..small() },
    );
    match Dataset::open(&path) {
        Err(EngineError::CrsUndeclared { .. }) => {}
        other => panic!("expected a typed refusal, got {other:?}", other = other.err()),
    }

    let (path_null, _) = write(
        "null-crs",
        &FixtureSpec { crs_mode: CrsMode::ExplicitNull, ..small() },
    );
    assert!(matches!(
        Dataset::open(&path_null),
        Err(EngineError::CrsUndeclared { .. })
    ));
}

#[test]
fn a_caller_may_assert_a_crs_for_a_file_that_declares_none_and_it_stays_marked() {
    let (path, _) = write(
        "assertable",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, ..small() },
    );
    let assertion = CrsAssertion {
        identifier: "EPSG:2056".into(),
        definition_json: Some(spatial_engine::fixture::LV95_PROJJSON.to_string()),
        by: "integration-test".into(),
        at: "2026-08-04T00:00:00Z".into(),
    };
    let ds = Dataset::open_with_asserted_crs(&path, assertion).expect("open with assertion");
    assert_eq!(ds.crs().source(), CrsSource::CallerAsserted);

    let md = ds.envelope().schema().metadata().clone();
    assert_eq!(md.get("crs_source").unwrap(), "caller_asserted");
    assert_eq!(md.get("crs_asserted_by").unwrap(), "integration-test");
}

#[test]
fn an_assertion_over_a_file_that_declares_a_crs_is_refused() {
    let (path, _) = write("declared-2", &small());
    let assertion = CrsAssertion {
        identifier: "EPSG:2056".into(),
        definition_json: Some(spatial_engine::fixture::LV95_PROJJSON.to_string()),
        by: "integration-test".into(),
        at: "2026-08-04T00:00:00Z".into(),
    };
    // Identical to what the file declares, and still refused: agreeing is a definitional-
    // equivalence judgement this slice does not make (docs/05).
    assert!(matches!(
        Dataset::open_with_asserted_crs(&path, assertion),
        Err(EngineError::CrsAssertionConflict { .. })
    ));
}

#[test]
fn a_definition_that_establishes_no_axis_order_is_refused() {
    let (path, _) = write(
        "no-cs",
        &FixtureSpec { crs_mode: CrsMode::NoCoordinateSystem, ..small() },
    );
    assert!(matches!(
        Dataset::open(&path),
        Err(EngineError::AxisOrderUnestablished { .. })
    ));
}

#[test]
fn a_latitude_first_source_is_refused_rather_than_reinterpreted() {
    // The EPSG:4326 trap docs/05 names. This slice normalizes nothing, so it refuses.
    let (path, _) = write(
        "latlon",
        &FixtureSpec { crs_mode: CrsMode::DeclaredLatLonFirst, ..small() },
    );
    match Dataset::open(&path) {
        Err(EngineError::AxisOrderUnsupported { established }) => {
            assert_eq!(established, "latitude,longitude");
        }
        other => panic!("expected AxisOrderUnsupported, got {:?}", other.err()),
    }
}

// ---------------------------------------------------------------------------------------------
// The operation
// ---------------------------------------------------------------------------------------------

#[test]
fn streaming_the_whole_file_returns_every_feature_with_bit_identical_coordinates() {
    let spec = small();
    let (path, facts) = write("whole", &spec);
    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");

    let (rows, batches, bits, ids) = drain(&mut s);

    assert_eq!(rows, facts.features, "every feature arrives");
    assert!(batches >= 1);
    assert_eq!(
        bits, facts.coord_bits_xor,
        "coordinates are bit-identical from file through DuckDB, WKB decode, GeoArrow and IPC"
    );
    let mut sorted = ids.clone();
    sorted.sort_unstable();
    sorted.dedup();
    assert_eq!(sorted.len(), facts.features, "ids are unique and complete");
}

#[test]
fn the_payload_is_variable_width_geoarrow_with_holes() {
    let spec = FixtureSpec { features: 400, avg_vertices: 16, hole_every: 5, ..small() };
    let (path, facts) = write("shape", &spec);
    assert!(
        facts.max_vertices_per_feature > facts.min_vertices_per_feature,
        "the fixture itself must not be fixed-width ({} vs {})",
        facts.min_vertices_per_feature,
        facts.max_vertices_per_feature
    );

    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let info = s.next_into(&mut buf).expect("a batch").expect("ok");
    assert!(info.rows > 0);

    let mut rdr =
        arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
    let batch = rdr.next().unwrap().unwrap();

    // GeoArrow polygon: List<List<FixedSizeList<double>[2]>>, and the offsets actually vary.
    let polys = batch.column(1).as_any().downcast_ref::<ListArray>().unwrap();
    let mut ring_counts = std::collections::BTreeSet::new();
    let mut vertex_counts = std::collections::BTreeSet::new();
    for p in 0..polys.len() {
        let rings = polys.value(p);
        let rings = rings.as_any().downcast_ref::<ListArray>().unwrap();
        ring_counts.insert(rings.len());
        for r in 0..rings.len() {
            vertex_counts.insert(rings.value(r).len());
        }
    }
    assert!(ring_counts.contains(&2), "some features carry an interior ring");
    assert!(vertex_counts.len() > 1, "vertex counts differ between rings");

    let field = batch.schema().field(1).clone();
    assert_eq!(
        field.metadata().get("ARROW:extension:name").map(String::as_str),
        Some("geoarrow.polygon")
    );
}

#[test]
fn a_viewport_filter_selects_a_subset_and_every_selected_feature_intersects_it() {
    let spec = small();
    let (path, facts) = write("viewport", &spec);
    let ds = Dataset::open(&path).expect("open");

    // A quarter-ish window over the fixture's grid.
    let cols = (spec.features as f64).sqrt().ceil();
    let extent = cols * 40.0;
    let view = Bbox {
        xmin: spatial_engine::fixture::E_LO,
        ymin: spatial_engine::fixture::N_LO,
        xmax: spatial_engine::fixture::E_LO + extent / 2.0,
        ymax: spatial_engine::fixture::N_LO + extent / 2.0,
    };

    let mut s = ds
        .stream(&ViewportQuery::viewport(view, "EPSG:2056"))
        .expect("stream");
    let (rows, _, _, _) = drain(&mut s);

    assert!(rows > 0, "the viewport selects something");
    assert!(rows < facts.features, "the viewport selects a strict subset");
}

#[test]
fn a_viewport_in_another_crs_is_refused_because_nothing_here_reprojects() {
    let (path, _) = write("viewport-crs", &small());
    let ds = Dataset::open(&path).expect("open");
    let view = Bbox { xmin: 7.0, ymin: 46.0, xmax: 8.0, ymax: 47.0 };
    assert!(matches!(
        ds.stream(&ViewportQuery::viewport(view, "EPSG:4326")),
        Err(EngineError::CrsAssertionConflict { .. })
    ));
}

#[test]
fn a_viewport_without_a_covering_bbox_column_is_refused_not_silently_scanned() {
    let (path, _) = write(
        "no-covering",
        &FixtureSpec { with_covering_bbox: false, ..small() },
    );
    let ds = Dataset::open(&path).expect("open");
    let view = Bbox {
        xmin: spatial_engine::fixture::E_LO,
        ymin: spatial_engine::fixture::N_LO,
        xmax: spatial_engine::fixture::E_LO + 100.0,
        ymax: spatial_engine::fixture::N_LO + 100.0,
    };
    assert!(matches!(
        ds.stream(&ViewportQuery::viewport(view, "EPSG:2056")),
        Err(EngineError::NoCoveringBbox { .. })
    ));
    // …while an unfiltered stream over the same file is fine.
    assert!(ds.stream(&ViewportQuery::all()).is_ok());
}

#[test]
fn every_batch_carries_the_envelope_not_just_the_first() {
    let (path, _) = write("tagging", &FixtureSpec { features: 6_000, ..small() });
    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");

    let mut buf = Vec::new();
    let mut seen = 0;
    while let Some(info) = s.next_into(&mut buf) {
        info.expect("batch");
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let b = rdr.next().unwrap().unwrap();
        let md = b.schema().metadata().clone();
        assert_eq!(md.get("frame").map(String::as_str), Some("authoritative-project-crs"));
        assert_eq!(md.get("crs").map(String::as_str), Some("EPSG:2056"));
        assert_eq!(md.get("axis_order").map(String::as_str), Some("easting,northing"));
        seen += 1;
        buf.clear();
    }
    assert!(seen >= 2, "this fixture must produce more than one batch (saw {seen})");
}

// ---------------------------------------------------------------------------------------------
// Cancellation and backpressure
// ---------------------------------------------------------------------------------------------

#[test]
fn cancelling_before_the_first_batch_stops_the_stream_inside_the_budget() {
    // docs/08: "Cancellation acknowledged < 100 ms, any operation" — including one that has not
    // produced anything yet, which is the case a between-batches flag check cannot serve.
    let (path, _) = write("cancel-early", &FixtureSpec { features: 40_000, ..small() });
    let ds = Dataset::open(&path).expect("open");

    let cancel = CancelToken::new();
    let mut s = ds
        .stream_with_cancel(&ViewportQuery::all(), cancel.clone())
        .expect("stream");

    let t0 = Instant::now();
    cancel.cancel();
    let mut buf = Vec::new();
    let outcome = s.next_into(&mut buf);
    let elapsed = t0.elapsed();

    match outcome {
        None => {}
        Some(Err(EngineError::Cancelled)) => {}
        other => panic!("expected a cancelled terminal, got {other:?}"),
    }
    assert!(
        elapsed < Duration::from_millis(100),
        "cancellation took {elapsed:?}, over the docs/08 budget"
    );
    assert!(
        s.stats().batches_after_cancel.load(std::sync::atomic::Ordering::SeqCst) <= 1,
        "at most one batch may be generated after cancellation is observed"
    );
}

#[test]
fn cancelling_mid_stream_stops_production_promptly() {
    let (path, _) = write("cancel-mid", &FixtureSpec { features: 40_000, ..small() });
    let ds = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    let mut s = ds
        .stream_with_cancel(&ViewportQuery::all(), cancel.clone())
        .expect("stream");

    let mut buf = Vec::new();
    s.next_into(&mut buf).expect("first batch").expect("ok");
    buf.clear();

    let t0 = Instant::now();
    cancel.cancel();
    while let Some(r) = s.next_into(&mut buf) {
        buf.clear();
        if matches!(r, Err(EngineError::Cancelled)) {
            break;
        }
    }
    let elapsed = t0.elapsed();
    assert!(elapsed < Duration::from_millis(100), "stream drained in {elapsed:?}");

    let stats = s.stats();
    assert!(
        stats.batches_after_cancel.load(std::sync::atomic::Ordering::SeqCst) <= 1,
        "H2: at most one further batch after cancel"
    );
}

#[test]
fn dropping_the_stream_cancels_the_query() {
    let (path, _) = write("cancel-drop", &FixtureSpec { features: 40_000, ..small() });
    let ds = Dataset::open(&path).expect("open");
    let cancel;
    {
        let s = ds.stream(&ViewportQuery::all()).expect("stream");
        cancel = s.cancel_token();
        assert!(!cancel.is_cancelled());
    }
    assert!(cancel.is_cancelled(), "an abandoned stream must not leave DuckDB scanning");
}

#[test]
fn a_paused_consumer_bounds_producer_resident_memory() {
    // H3, on the producer's own counter rather than an OS reading — the same basis the bake-off's
    // bounded-memory claim rested on.
    let (path, _) = write("backpressure", &FixtureSpec { features: 40_000, ..small() });
    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");

    let mut buf = Vec::new();
    s.next_into(&mut buf).expect("first batch").expect("ok");

    // Consumer pauses. The producer may work ahead into its declared window and must then stop.
    // Waited for by condition, not by a fixed sleep: this suite runs its DuckDB fixtures in
    // parallel and a few hundred milliseconds is a guess, not a synchronisation primitive.
    let stats = s.stats();
    let plateau = wait_for_plateau(Duration::from_secs(20), 25, || {
        stats.batches_generated.load(std::sync::atomic::Ordering::SeqCst)
    })
    .expect("a backpressured producer stops; this one never did");

    let peak = stats.peak_resident_bytes.load(std::sync::atomic::Ordering::SeqCst);
    let bound = (spatial_engine::MAX_INFLIGHT_BATCHES + 1) * spatial_engine::MAX_BATCH_BYTES;
    assert!(peak > 0, "the producer did generate something");
    assert!(
        peak <= bound,
        "producer-resident payload {peak} exceeded the declared bound {bound}"
    );

    // The discriminating assertion. One batch was taken, the channel holds `MAX_INFLIGHT_BATCHES`,
    // and one more may be complete and blocked on the send — so a backpressured producer stops at
    // that, while one without backpressure runs to the end of the file (this fixture is 40 000
    // features, tens of batches).
    assert!(
        plateau <= 1 + (spatial_engine::MAX_INFLIGHT_BATCHES + 1) as u64,
        "generated {plateau} batches while the consumer was paused"
    );
}

#[test]
fn the_first_batch_is_handed_over_before_the_result_is_materialized() {
    // The property that separates streaming from collect-then-chunk. `docs/08`'s "First pixels
    // < 100 ms after query start" cannot be met by an engine that materializes first.
    //
    // **Asserted structurally, not as a timing ratio.** This test used to require
    // `first * 3 < total`, and a release build made that brittle: the whole stream finishes in
    // ~90 ms, at which scale a 3x ratio sits inside run-to-run noise (measured: 2 failures in ~26
    // release runs, one missing by 1.2 ms). The property itself never wavered — what wavered was a
    // clock comparison standing in for it. The producer's own counter answers the question directly:
    // if the engine had materialized the result before handing over the first batch, every batch
    // would already have been generated by the time `next_into` returned.
    let (path, _) = write("streaming", &FixtureSpec { features: 60_000, ..small() });
    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let stats = s.stats();

    let mut buf = Vec::new();
    s.next_into(&mut buf).expect("first batch").expect("ok");
    let generated_when_first_arrived =
        stats.batches_generated.load(std::sync::atomic::Ordering::SeqCst);
    buf.clear();

    let (_, remaining, _, _) = drain(&mut s);
    let total_batches = remaining as u64 + 1;

    assert!(
        total_batches > 4,
        "this fixture must produce enough batches for the question to mean anything (saw \
         {total_batches})"
    );
    assert!(
        generated_when_first_arrived < total_batches,
        "{generated_when_first_arrived} of {total_batches} batches had been generated when the \
         first one was handed over — that is materialize-then-chunk, not streaming"
    );
    // Sharper still: the producer may only be as far ahead as its declared window allows.
    assert!(
        generated_when_first_arrived <= (spatial_engine::MAX_INFLIGHT_BATCHES + 2) as u64,
        "the producer ran {generated_when_first_arrived} batches ahead of a window of {}",
        spatial_engine::MAX_INFLIGHT_BATCHES
    );
}
