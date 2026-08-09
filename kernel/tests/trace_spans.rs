// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The span model's contract, and the consistency demonstration that validates it.
//!
//! ## The acceptance test that matters
//!
//! `NEXT-CUT.md` item 2.4: re-derive established segment numbers from traces and **show they agree
//! with the existing instruments where they overlap**. Agreement validates both; disagreement is a
//! finding about one of them and gets written up rather than silently reconciled.
//!
//! That is `traces_agree_with_the_instruments_that_already_measured_the_same_thing` below. It
//! compares trace-derived time-to-first-batch against the wall clock the harnesses use, and
//! trace-derived batch and row counts against `StreamStats`, which is the counter every earlier
//! results section rests on.
//!
//! ## What is asserted here and what is not
//!
//! These are **contract** tests: that spans happen, in order, with the right identity, and that
//! tracing changes no observable result. The *overhead* number is a measurement and belongs to the
//! declared harness on the declared fixture — `docs/08` numbers are not taken on whatever machine
//! happens to run the ordinary suite.

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::Instant;

use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode,
};
use spatial_engine::trace::{self, TraceKey};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::publish::{
    publish_unguarded, trace_names, CorrespondingSource, CorrespondingSourceKind, PublishPhase,
    PublishProgress, PublishRequest, ViewerAsset, ViewerAssets, ViewerLicenseInput,
};

const FEATURES: usize = 40_000;

const STYLE: &str = r##"{
  "style_version": 1,
  "layer": {
    "geometry": "polygon",
    "fill_color": {"literal": "#aa3333"},
    "fill_opacity": {"literal": 0.8},
    "outline_color": {"literal": "#202020"},
    "outline_width": {"literal": 1.0}
  }
}"##;

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-trace-spans").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn fixture(dir: &Path) -> PathBuf {
    let path = dir.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: FEATURES,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .unwrap();
    path
}

fn pinned(path: &Path) -> Dataset {
    let ds = Dataset::open(path).unwrap();
    ds.pin_content(&CancelToken::new()).unwrap();
    ds
}

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
        ViewerAsset { path: "app.js".into(), bytes: b"export const ok = 1;\n".to_vec() },
        ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
    ])
    .unwrap()
}

fn viewer_license() -> ViewerLicenseInput {
    ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://example.invalid/spatial-ide".into(),
        },
    }
}

fn request<'a>(
    ds: &'a Dataset,
    viewer: &'a ViewerAssets,
    destination: PathBuf,
) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: ViewportQuery::all(),
        attributes: vec!["zone".into()],
        style_source: STYLE,
        viewer,
        viewer_license: viewer_license(),
        license: None,
        destination,
        started_at: "2026-08-07T09:00:00Z".into(),
        finished_at: &FIXED_FINISH,
    }
}

fn fixed_finish() -> String {
    "2026-08-07T09:00:01Z".into()
}
static FIXED_FINISH: fn() -> String = fixed_finish;

/// **The declared "one traced stream per traced run" limit, meeting `cargo test`'s thread pool.**
///
/// `spatial_engine::trace` holds one global slot and *refuses* a second concurrent trace rather
/// than silently replacing it — the same reasoning as `CancelToken::attach`. Tests in one binary
/// are threads in one process, so they must take turns. Serializing here is the honest response;
/// weakening the refusal so the tests could run concurrently would delete the property the refusal
/// exists to provide.
static TRACE_SERIAL: std::sync::Mutex<()> = std::sync::Mutex::new(());

fn serial() -> std::sync::MutexGuard<'static, ()> {
    TRACE_SERIAL.lock().unwrap_or_else(|e| e.into_inner())
}

/// Wait until this dataset's producer threads are done, **before** the trace slot is handed on.
///
/// **Taking turns is not enough on its own, and this is the reason.** Nothing joins a producer
/// thread — `stream_inner` discards the `JoinHandle` — so dropping a `BatchStream` ends the
/// *consumer's* interest and leaves the producer to unwind on its own schedule. The trace is
/// process-global, so a straggler from one test goes on stamping `batch_full` into the *next*
/// test's trace, and an exact-count assertion fails somewhere with no visible cause. It is
/// timing-dependent, so it passes when the file is run alone and fails under a loaded workspace
/// run, which is the worst possible shape for a defect to have.
///
/// A lease returning to the pool is the observable form of "that thread is finished". The wait is
/// bounded and declared here rather than discovered by whoever next sees the flake.
fn quiesce(ds: &Dataset) {
    const WINDOW: std::time::Duration = std::time::Duration::from_secs(10);
    let deadline = std::time::Instant::now() + WINDOW;
    while ds.connections().active_leases() != 0 && std::time::Instant::now() < deadline {
        std::thread::sleep(std::time::Duration::from_millis(5));
    }
    assert_eq!(
        ds.connections().active_leases(),
        0,
        "a producer still held a lease {WINDOW:?} after its stream was dropped, so this test would \
         have leaked events into the next one's trace"
    );
}

// ---------------------------------------------------------------------------------------------
// The consistency demonstration
// ---------------------------------------------------------------------------------------------

/// **Trace-derived numbers must agree with the instruments that already measured the same thing.**
///
/// Two overlaps exist and both are checked:
///
/// - **time to first batch** — the traces' `lease_acquired → first_batch_full` segment against the
///   caller's own wall clock over the same span of code. These measure the same interval by two
///   independent routes, so they must agree to within the cost of the code between the outer clock
///   and the inner spans.
/// - **batches and rows** — the traces' `batch_full` count and row total against `StreamStats`,
///   which is the counter every previous results section rests on. This one is exact: both count
///   the same events, so anything other than equality is a defect in one of them.
#[test]
fn traces_agree_with_the_instruments_that_already_measured_the_same_thing() {
    let _serial = serial();
    let d = workspace("consistency");
    let ds = pinned(&fixture(&d));

    let guard = trace::start(TraceKey {
        dataset: "parcels".into(),
        physical_id: 0,
        lease_generation: 0,
        label: "consistency".into(),
    })
    .expect("no other trace is running");

    let outer_start = Instant::now();
    let mut stream = ds.stream(&ViewportQuery::all()).expect("stream opens");
    let stats = stream.stats();
    let mut payload = Vec::new();
    let mut first_batch_wall_ms = None;
    let mut batches = 0u64;
    let mut rows = 0u64;
    while let Some(info) = stream.next_into(&mut payload) {
        let info = info.expect("no terminal error");
        if first_batch_wall_ms.is_none() {
            first_batch_wall_ms = Some(outer_start.elapsed().as_secs_f64() * 1000.0);
        }
        batches += 1;
        rows += info.rows as u64;
        payload.clear();
    }
    drop(stream);
    quiesce(&ds);

    let t = guard.trace();
    let events = t.events();

    // **The equality claims below are only valid on a trace that dropped nothing.** The buffer is a
    // declared ceiling that a large enough run reaches by design, and `batch_full` fires once per
    // batch — so raising `FEATURES` past the ceiling would turn the exact assertions into false
    // failures that look like an instrumentation bug. Checked first, so the diagnosis is in the
    // failure message rather than in whoever debugs it later.
    assert_eq!(
        t.dropped(),
        0,
        "this consistency check compares exact counts, so it is only meaningful on a trace that \
         dropped no records. The fixture now exceeds TRACE_BUFFER_RECORDS — either lower FEATURES \
         or compare first-occurrence segments only."
    );

    // ---- overlap 1: batches and rows, which must be exactly equal -----------------------------
    let traced_batches = events.iter().filter(|e| e.name == trace::BATCH_FULL).count() as u64;
    let traced_rows: u64 =
        events.iter().filter(|e| e.name == trace::BATCH_FULL).map(|e| e.rows).sum();

    assert_eq!(
        traced_batches,
        stats.batches_generated.load(Ordering::SeqCst),
        "the traces' batch count and StreamStats' must be the same number — they count the same \
         event, and a disagreement is a defect in one of them, not a tolerance"
    );
    assert_eq!(traced_batches, batches, "and the consumer saw exactly those batches");
    assert_eq!(
        traced_rows,
        stats.rows_generated.load(Ordering::SeqCst),
        "the traces' row total must equal StreamStats'"
    );
    assert_eq!(traced_rows, rows, "and the consumer received exactly those rows");
    assert_eq!(traced_rows, FEATURES as u64, "which is the whole fixture");

    // ---- overlap 2: time to first batch, two independent clocks -------------------------------
    let traced_ttfb = t
        .segment_ms(trace::LEASE_ACQUIRED, trace::FIRST_BATCH_FULL)
        .expect("both boundaries are stamped on a stream that produced a batch");
    let wall_ttfb = first_batch_wall_ms.expect("at least one batch was produced");

    // The traced segment is strictly *inside* the wall-clock one — the outer clock starts before
    // the lease is acquired and stops after the batch has been serialized into `payload`. So the
    // check is containment plus a bound on the difference, not equality: asserting equality would
    // be asserting that the code between them costs nothing, which is false and would make the
    // test a flake generator.
    assert!(
        traced_ttfb <= wall_ttfb + 1.0,
        "the traced first-batch segment ({traced_ttfb:.3} ms) must not exceed the wall-clock \
         interval that contains it ({wall_ttfb:.3} ms)"
    );
    assert!(
        traced_ttfb > 0.0,
        "the traced segment must be positive, got {traced_ttfb:.3} ms"
    );

    // ---- the ordering the model claims ---------------------------------------------------------
    let order = [
        trace::LEASE_ACQUIRED,
        trace::SQL_PREPARED,
        trace::EXECUTE_RETURNED,
        trace::FIRST_SOURCE_ROW,
        trace::FIRST_BATCH_FULL,
    ];
    let mut last = 0u64;
    for name in order {
        let e = t.first(name).unwrap_or_else(|| panic!("{name} must be stamped"));
        assert!(
            e.offset_nanos >= last,
            "spans must be monotonic; {name} at {} follows {last}",
            e.offset_nanos
        );
        last = e.offset_nanos;
    }
}

/// **A run nobody cancelled must not claim a cancellation was requested.**
///
/// `BatchStream::drop` cancels its token on *every* drop, a completed stream included — that is what
/// stops an abandoned stream and it is deliberate. An earlier revision stamped
/// `cancellation_requested` inside `CancelToken::cancel`, so review captured a real artifact from a
/// run with no cancel in it reading `producer_finished` at 169.68 ms followed by
/// `cancellation_requested` at 170.32 ms.
///
/// That instant is the first of the three the design note freezes. A summarizer deriving
/// `cancel_requested -> cancel_observed` would find an origin in runs that had none, and in a
/// genuinely cancelled run would find two.
#[test]
fn a_successful_run_stamps_no_cancellation_instant() {
    let _serial = serial();
    let d = workspace("no-phantom-cancel");
    let ds = pinned(&fixture(&d));

    let guard = trace::start(TraceKey { label: "no-phantom-cancel".into(), ..Default::default() })
        .expect("no other trace is running");
    let mut stream = ds.stream(&ViewportQuery::all()).expect("stream opens");
    let mut payload = Vec::new();
    while let Some(b) = stream.next_into(&mut payload) {
        b.expect("no terminal error");
        payload.clear();
    }
    // The drop that used to stamp the phantom instant.
    drop(stream);
    quiesce(&ds);
    let t = guard.trace();
    drop(guard);

    let names: Vec<&str> = t.events().iter().map(|e| e.name).collect();
    assert!(
        t.first(trace::CANCELLATION_REQUESTED).is_none(),
        "a stream that ran to completion must stamp no cancellation instant, got {names:?}"
    );
    assert!(
        t.first(trace::PRODUCER_CANCELLED).is_none(),
        "nor a producer-side cancellation observation, got {names:?}"
    );
    // The run really did happen, so the absence above is meaningful rather than an empty trace.
    assert!(t.first(trace::FIRST_BATCH_FULL).is_some(), "the run produced batches");
    assert!(
        t.first(trace::PRODUCER_FINISHED).is_some(),
        "and the producer recorded that it finished"
    );
}

/// **Not a sort-location test.** An earlier revision of this test and its name claimed the two
/// `stream_arrow`-bracketing spans "locate the sort" — but `ViewportQuery::all()` is
/// `RowOrdering::Unordered`, so the query it runs has no `ORDER BY` and no sort to locate.
/// `kernel/CANCELLATION-AND-TRACING.md` §2's question is still open. What this test actually
/// establishes: the full `lease_to_first_row` window's internal spans (`NEXT-CUT.md` Phase 1) are
/// all present, correctly ordered, and every adjacent segment is derivable — the property the
/// eighth section's attribution cells depend on existing before they can trust a single number from
/// it.
#[test]
fn the_query_windows_internal_spans_are_all_present_and_ordered() {
    let _serial = serial();
    let d = workspace("query-window-spans");
    let ds = pinned(&fixture(&d));

    let guard = trace::start(TraceKey { label: "query-window-spans".into(), ..Default::default() })
        .expect("no other trace is running");
    let mut stream = ds
        .stream(&ViewportQuery::all())
        .expect("stream opens");
    let mut payload = Vec::new();
    while let Some(b) = stream.next_into(&mut payload) {
        b.expect("no terminal error");
        payload.clear();
    }
    drop(stream);
    quiesce(&ds);

    let t = guard.trace();

    // ---- the ordering the model claims, same shape as the LEASE_ACQUIRED..FIRST_BATCH_FULL check
    // above, for the same diagnosable-failure reason ------------------------------------------------
    let order = [
        trace::SQL_BUILT,
        trace::LEASE_ACQUIRED,
        trace::PRODUCER_STARTED,
        trace::SQL_PREPARED,
        trace::EXECUTE_CALLED,
        trace::EXECUTE_RETURNED,
        trace::FIRST_SOURCE_ROW,
    ];
    let mut last = 0u64;
    for name in order {
        let e = t.first(name).unwrap_or_else(|| panic!("{name} must be stamped"));
        assert!(
            e.offset_nanos >= last,
            "spans must be monotonic; {name} at {} follows {last}",
            e.offset_nanos
        );
        last = e.offset_nanos;
    }

    // Every adjacent segment is derivable, which is the property that makes an attribution cell
    // trustworthy at all — including the wider `lease_to_first_row` window Phase 1 scores its
    // decision rule against, not just the narrower `query` span.
    assert!(t.segment_ms(trace::SQL_BUILT, trace::LEASE_ACQUIRED).is_some(), "lease_bind");
    assert!(t.segment_ms(trace::LEASE_ACQUIRED, trace::PRODUCER_STARTED).is_some(), "producer_handoff");
    assert!(t.segment_ms(trace::PRODUCER_STARTED, trace::SQL_PREPARED).is_some(), "statement_prepare");
    assert!(t.segment_ms(trace::SQL_PREPARED, trace::EXECUTE_CALLED).is_some(), "param_assembly");
    assert!(t.segment_ms(trace::EXECUTE_CALLED, trace::EXECUTE_RETURNED).is_some(), "bind_and_execute");
    assert!(t.segment_ms(trace::EXECUTE_RETURNED, trace::FIRST_SOURCE_ROW).is_some(), "first_fetch");
    assert!(t.segment_ms(trace::LEASE_ACQUIRED, trace::FIRST_SOURCE_ROW).is_some(), "lease_to_first_row");
    // `query` (`sql_prepared -> first_source_row`) keeps its original, narrower definition — see
    // `SPAN_LEASE_TO_FIRST_ROW`'s doc comment for why the two are not the same span.
    assert!(t.segment_ms(trace::SQL_PREPARED, trace::FIRST_SOURCE_ROW).is_some(), "query");
}

// ---------------------------------------------------------------------------------------------
// Off by default, and no observable difference
// ---------------------------------------------------------------------------------------------

/// **Tracing must change no result.** If it did, every number taken with it on would describe a
/// different program from the one that ships.
#[test]
fn a_traced_publish_and_an_untraced_one_produce_the_same_bundle() {
    let _serial = serial();
    let d = workspace("same-bundle");
    let ds = pinned(&fixture(&d));
    let v = viewer();

    let untraced_dest = d.join("untraced");
    let untraced = publish_unguarded(&request(&ds, &v, untraced_dest.clone()), &CancelToken::new(), None)
        .expect("publish succeeds");
    assert!(!trace::is_enabled(), "tracing is off unless a trace is started");

    // **Quiesce before the trace opens**, or the untraced publish's producer stamps into the
    // traced run's buffer — the exact defect this file's `quiesce` doc calls the worst shape.
    // Nothing here asserts a count, so it would have passed while being wrong.
    quiesce(&ds);

    let traced_dest = d.join("traced");
    let guard = trace::start(TraceKey { label: "same-bundle".into(), ..Default::default() })
        .expect("no other trace is running");
    let traced = publish_unguarded(&request(&ds, &v, traced_dest.clone()), &CancelToken::new(), None)
        .expect("publish succeeds");
    let events = guard.trace().events().len();
    quiesce(&ds);
    drop(guard);

    assert!(events > 0, "the traced run recorded spans");
    assert!(!trace::is_enabled(), "the guard turned tracing back off");

    assert_eq!(
        untraced.operation_digest, traced.operation_digest,
        "tracing must not change the operation digest"
    );
    assert_eq!(untraced.partitions, traced.partitions, "nor the partition count");
    assert_eq!(untraced.rows, traced.rows, "nor the row count");
    assert_eq!(untraced.style_hash, traced.style_hash, "nor the style hash");

    // The bytes themselves, which is the claim that matters: every partition byte-identical.
    for i in 0..untraced.partitions {
        let rel = format!("data/part-{i:05}.arrows");
        let a = std::fs::read(untraced_dest.join(&rel)).expect("untraced partition");
        let b = std::fs::read(traced_dest.join(&rel)).expect("traced partition");
        assert_eq!(a, b, "partition {i} must be byte-identical with and without tracing");
    }
}

/// The publish path's own spans, including the three that decompose one partition's write — the
/// decomposition the fifth section could not make.
#[test]
fn a_traced_publish_decomposes_a_partition_write() {
    let _serial = serial();
    struct Counter(AtomicUsize);
    impl PublishProgress for Counter {
        fn phase(&self, _: PublishPhase) {}
        fn partition_written(&self, _: usize, _: usize, _: u64) {
            self.0.fetch_add(1, Ordering::SeqCst);
        }
    }

    let d = workspace("decompose");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let counter = Counter(AtomicUsize::new(0));

    let guard = trace::start(TraceKey { label: "decompose".into(), ..Default::default() })
        .expect("no other trace is running");
    publish_unguarded(&request(&ds, &v, dest), &CancelToken::new(), Some(&counter))
        .expect("publish succeeds");
    let t = guard.trace();
    quiesce(&ds);
    drop(guard);

    let events = t.events();
    let count = |n: &str| events.iter().filter(|e| e.name == n).count();

    assert!(t.first(trace_names::VERIFY_START).is_some(), "the source verification is stamped");
    assert!(t.first(trace_names::VERIFY_END).is_some());
    assert!(
        t.segment_ms(trace_names::VERIFY_START, trace_names::VERIFY_END).is_some(),
        "and its duration is derivable"
    );

    let partitions = counter.0.load(Ordering::SeqCst);
    assert!(partitions > 0, "the fixture produces partitions");
    // Once per partition, each: the write path is instrumented per file, not per operation.
    assert_eq!(count(trace_names::PARTITION_CREATE_START), partitions);
    assert_eq!(count(trace_names::PARTITION_WRITE_START), partitions);
    assert_eq!(count(trace_names::PARTITION_SYNC_START), partitions);
    assert_eq!(count(trace_names::PARTITION_SYNC_END), partitions);

    // **The decomposition itself.** `create → write → sync-start → sync-end` in order, for the
    // first partition, which is what makes "where did the 418 ms go" an answerable question.
    let stamps: Vec<u64> = [
        trace_names::PARTITION_CREATE_START,
        trace_names::PARTITION_WRITE_START,
        trace_names::PARTITION_SYNC_START,
        trace_names::PARTITION_SYNC_END,
    ]
    .iter()
    .map(|n| t.first(n).expect("stamped").offset_nanos)
    .collect();
    assert!(
        stamps.windows(2).all(|w| w[0] <= w[1]),
        "the write decomposition must be in order, got {stamps:?}"
    );
}

/// JSONL is the artifact format, and it must survive a round trip through a file — the summarizer
/// reads what this writes.
#[test]
fn spans_serialize_to_one_json_object_per_line() {
    let _serial = serial();
    let d = workspace("jsonl");
    let ds = pinned(&fixture(&d));

    let guard = trace::start(TraceKey {
        dataset: "parcels".into(),
        physical_id: 3,
        lease_generation: 1,
        label: "jsonl".into(),
    })
    .expect("no other trace is running");
    let mut stream = ds.stream(&ViewportQuery::all()).expect("stream opens");
    let mut payload = Vec::new();
    while let Some(b) = stream.next_into(&mut payload) {
        b.expect("no terminal error");
        payload.clear();
    }
    drop(stream);
    quiesce(&ds);
    let jsonl = guard.trace().to_jsonl();
    quiesce(&ds);
    drop(guard);

    let path = d.join("spans.jsonl");
    std::fs::write(&path, &jsonl).expect("spans are writable");
    let read = std::fs::read_to_string(&path).expect("and readable");

    let lines: Vec<&str> = read.lines().collect();
    assert!(lines.len() > 2, "a key line, event lines, and derived span lines");
    assert!(lines[0].contains(r#""kind":"trace-key""#), "the first line names the trace");
    assert!(lines[0].contains(r#""physical_id":3"#));

    // **The drop count travels in the file, not in someone's memory of the run.** The buffer is a
    // declared ceiling that normal use reaches, so a figure derived from an artifact that silently
    // lost records would be unfalsifiable. Both fields are required to be present.
    assert!(
        lines[0].contains(r#""buffer_records":"#) && lines[0].contains(r#""dropped_records":"#),
        "the key line must carry the buffer ceiling and what it refused: {}",
        lines[0]
    );

    let events: Vec<&&str> = lines[1..].iter().filter(|l| l.contains(r#""kind":"event""#)).collect();
    let spans: Vec<&&str> = lines[1..].iter().filter(|l| l.contains(r#""kind":"span""#)).collect();
    assert!(!events.is_empty(), "a streamed query stamps events");
    assert_eq!(
        events.len() + spans.len(),
        lines.len() - 1,
        "every line after the key is an event or a span and nothing else"
    );

    // **An event is an instant; a span is an interval. The artifact must not let one be read as the
    // other**, which is exactly what a single merged `kind` would allow.
    for l in &events {
        assert!(l.contains(r#""offset_nanos":"#), "an event carries an instant: {l}");
        assert!(!l.contains(r#""millis":"#), "an event carries no duration: {l}");
    }
    for l in &spans {
        assert!(l.contains(r#""millis":"#), "a span carries a duration: {l}");
        assert!(!l.contains(r#""offset_nanos":"#), "a span is not an instant: {l}");
    }
    for l in &lines[..] {
        assert!(l.starts_with('{') && l.ends_with('}'), "one JSON object per line: {l}");
    }
}
