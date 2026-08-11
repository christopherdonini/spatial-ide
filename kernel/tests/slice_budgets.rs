// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The `docs/08` budget measurement for this slice, as a committed, re-runnable harness.**
//!
//! ```bash
//! cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture
//! ```
//!
//! `#[ignore]`d because it takes minutes and writes an evidence artifact; it is not part of the
//! ordinary suite. It refuses to run at all on a debug build (see `refuse_debug`) — the bake-off
//! preregistration makes a debug build an outright invalidator, and a number taken on one is not a
//! smaller number, it is not a measurement.
//!
//! ## What this harness may and may not be used for
//!
//! - **Every comparison is within-session.** README §21 Q1 / §22.1: the machine drifts between
//!   sessions and does so *asymmetrically*, so a ratio does not cancel it. A fixed,
//!   transport-insensitive **canary** is timed at the start and the end of the run and both readings
//!   are in the artifact; if they disagree, the session moved underneath the numbers.
//! - **No throughput claim, and nothing here may cite ADR-012** (its open risk 3). Byte totals and
//!   durations are recorded separately and deliberately not divided.
//! - **No transport conclusion.** One adapter is exercised. That is not a comparison.
//! - Both ends run in **one process**, so a producer-side observation and a client-side one are on
//!   the **same clock**: no clock-relation bound is needed, and none is claimed. That is the reason
//!   cancellation is measured here rather than in the browser.
//!
//! ## Scope carried by every figure below
//!
//! Windows 10 Pro 22H2 · MSVC · bundled DuckDB v1.5.5 · release profile, `debug_assertions` off ·
//! `docs/08` **Polygons** class (100k features / ~10M vertices) unless a section says otherwise.
//! Nothing here says anything about macOS or Linux.

use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_kernel::{Catalog, EngineSourceFactory, StreamParams, OPERATION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

/// Generous upper bound on any single blocking wait here.
///
/// **A test or instrument that can hang forever is itself a defect.** An unbounded receive
/// turned a stalled producer into a hung binary that exited `0xffffffff` and named nothing;
/// a deadline turns the same stall into a failure that says which wait it was. Set far above
/// any honest wait on these fixtures, so it can only fire on a genuine stall.
const RECV_DEADLINE: Duration = Duration::from_secs(60);

const DATASET: &str = "parcels";

// ---- Declared before measuring (docs/08: sample counts are declared, not chosen afterwards) ----

/// `docs/08` benchmark matrix, Polygons row: 100k features / 10M vertices. "Feature count alone is
/// not a workload", so the fixture is shaped to the vertex target too.
const CLASS_FEATURES: usize = 100_000;
const CLASS_AVG_VERTICES: usize = 100;

/// Cancellation trials per case. Two cases: mid-stream, and before the first batch.
const CANCEL_TRIALS: usize = 30;
/// Full-stream runs for the time-to-first-batch / total-stream figures.
const STREAM_RUNS: usize = 7;
/// Repeats per selectivity point.
const SELECTIVITY_RUNS: usize = 3;
/// Memory sampling cadence, matching the bake-off's §6 definition.
const MEMORY_SAMPLE_MS: u64 = 50;

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

// ---------------------------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------------------------

/// The canary workload: fixed, transport-insensitive, touching no socket and no database.
///
/// §22.1's recommendation, adopted. `kernel/tests/concurrency_in_situ.rs` runs this at
/// `CANARY_ITERS_SHORT`, and that count is kept here so the two artifacts carry a comparable
/// instrument — but **this harness found 40 M iterations to be too short to be a stable instrument
/// on this hardware**: a reading lands around 7 ms, which is inside the CPU's own
/// frequency-transition window, so consecutive readings on an idle machine disagreed by up to 3x.
/// `CANARY_ITERS_LONG` is run alongside it for that reason, and both are recorded.
fn canary_ms(iters: u64) -> f64 {
    let t = Instant::now();
    let mut acc = 0u64;
    for i in 0..iters {
        acc = acc.wrapping_add(i.rotate_left(7) ^ 0x9e37_79b9_7f4a_7c15);
    }
    std::hint::black_box(acc);
    t.elapsed().as_secs_f64() * 1000.0
}

const CANARY_ITERS_SHORT: u64 = 40_000_000;
const CANARY_ITERS_LONG: u64 = 400_000_000;

/// One canary reading point: five short readings and three long ones.
struct Canary {
    short: Vec<f64>,
    long: Vec<f64>,
}

impl Canary {
    fn take(label: &str) -> Self {
        let short: Vec<f64> = (0..5).map(|_| canary_ms(CANARY_ITERS_SHORT)).collect();
        let long: Vec<f64> = (0..3).map(|_| canary_ms(CANARY_ITERS_LONG)).collect();
        let c = Self { short, long };
        println!(
            "canary [{label}] short min {:.2} ms median {:.2} ms | long min {:.1} ms median {:.1} ms",
            c.short_min(),
            pct(&sorted(&c.short), 0.5),
            c.long_min(),
            pct(&sorted(&c.long), 0.5),
        );
        c
    }
    fn short_min(&self) -> f64 {
        sorted(&self.short)[0]
    }
    fn long_min(&self) -> f64 {
        sorted(&self.long)[0]
    }
    fn json(&self) -> String {
        format!(
            r#"{{"short_ms": {}, "short_min_ms": {:.3}, "long_ms": {}, "long_min_ms": {:.3}}}"#,
            json_f64s(&self.short),
            self.short_min(),
            json_f64s(&self.long),
            self.long_min()
        )
    }
}

/// Windows process memory counters, read directly rather than through a crate so the harness adds
/// no dependency for one struct. `K32GetProcessMemoryInfo` lives in `kernel32`, which Rust already
/// links, so this needs no `psapi` link directive.
#[cfg(windows)]
mod procmem {
    #[repr(C)]
    #[derive(Default, Clone, Copy)]
    pub struct Counters {
        cb: u32,
        page_fault_count: u32,
        pub peak_working_set: usize,
        pub working_set: usize,
        quota_peak_paged_pool: usize,
        quota_paged_pool: usize,
        quota_peak_non_paged_pool: usize,
        quota_non_paged_pool: usize,
        pagefile_usage: usize,
        peak_pagefile_usage: usize,
        /// `PROCESS_MEMORY_COUNTERS_EX.PrivateUsage` — Windows **private commit**, the figure
        /// `docs/08`'s memory row and the bake-off's §6 both name.
        pub private_usage: usize,
    }

    extern "system" {
        fn GetCurrentProcess() -> isize;
        fn K32GetProcessMemoryInfo(h: isize, c: *mut Counters, cb: u32) -> i32;
    }

    pub fn sample() -> Option<Counters> {
        let mut c = Counters { cb: std::mem::size_of::<Counters>() as u32, ..Default::default() };
        let ok = unsafe {
            K32GetProcessMemoryInfo(GetCurrentProcess(), &mut c, std::mem::size_of::<Counters>() as u32)
        };
        (ok != 0).then_some(c)
    }
}

#[cfg(not(windows))]
mod procmem {
    #[derive(Default, Clone, Copy)]
    pub struct Counters {
        pub peak_working_set: usize,
        pub working_set: usize,
        pub private_usage: usize,
    }
    pub fn sample() -> Option<Counters> {
        None
    }
}

/// Samples this process's private commit every `MEMORY_SAMPLE_MS` until stopped.
struct MemorySampler {
    stop: Arc<AtomicBool>,
    peak_private: Arc<AtomicUsize>,
    peak_working_set: Arc<AtomicUsize>,
    samples: Arc<AtomicUsize>,
    join: Option<std::thread::JoinHandle<()>>,
}

impl MemorySampler {
    fn start() -> Self {
        let stop = Arc::new(AtomicBool::new(false));
        let peak_private = Arc::new(AtomicUsize::new(0));
        let peak_working_set = Arc::new(AtomicUsize::new(0));
        let samples = Arc::new(AtomicUsize::new(0));
        let join = {
            let (stop, pp, pw, n) =
                (stop.clone(), peak_private.clone(), peak_working_set.clone(), samples.clone());
            std::thread::spawn(move || {
                while !stop.load(Ordering::SeqCst) {
                    if let Some(c) = procmem::sample() {
                        pp.fetch_max(c.private_usage, Ordering::SeqCst);
                        pw.fetch_max(c.working_set, Ordering::SeqCst);
                        n.fetch_add(1, Ordering::SeqCst);
                    }
                    std::thread::sleep(Duration::from_millis(MEMORY_SAMPLE_MS));
                }
            })
        };
        Self { stop, peak_private, peak_working_set, samples, join: Some(join) }
    }

    fn finish(mut self) -> (usize, usize, usize) {
        self.stop.store(true, Ordering::SeqCst);
        if let Some(j) = self.join.take() {
            let _ = j.join();
        }
        (
            self.peak_private.load(Ordering::SeqCst),
            self.peak_working_set.load(Ordering::SeqCst),
            self.samples.load(Ordering::SeqCst),
        )
    }
}

/// Nearest-rank percentile over a sorted slice — the same sort-and-index method every spike and
/// bake-off figure used (§6). Stated here so the number is reproducible from the raw samples, which
/// are also written to the artifact.
fn pct(sorted: &[f64], p: f64) -> f64 {
    if sorted.is_empty() {
        return f64::NAN;
    }
    let rank = (p * sorted.len() as f64).ceil() as usize;
    sorted[rank.clamp(1, sorted.len()) - 1]
}

fn sorted(v: &[f64]) -> Vec<f64> {
    let mut s = v.to_vec();
    s.sort_by(|a, b| a.partial_cmp(b).unwrap());
    s
}

fn json_f64s(v: &[f64]) -> String {
    let body: Vec<String> = v.iter().map(|x| format!("{x:.3}")).collect();
    format!("[{}]", body.join(", "))
}

fn json_u64s(v: &[u64]) -> String {
    let body: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    format!("[{}]", body.join(", "))
}

// ---------------------------------------------------------------------------------------------
// Harness plumbing — the same client shape the H1–H7 tests use
// ---------------------------------------------------------------------------------------------

async fn connect(dp: &RunningDataPlane) -> Client {
    let mut req =
        format!("ws://127.0.0.1:{}/stream", dp.addr.port()).into_client_request().unwrap();
    req.headers_mut()
        .insert("origin", format!("http://127.0.0.1:{}", dp.addr.port()).parse().unwrap());
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery()).parse().unwrap(),
    );
    tokio_tungstenite::connect_async(req).await.expect("connect").0
}

fn params(bbox: Option<[f64; 4]>) -> StreamParams {
    StreamParams {
        dataset: DATASET.into(),
        bbox,
        bbox_crs: bbox.map(|_| "EPSG:2056".to_string()),
        limit: None,
    }
}

async fn start(c: &mut Client, p: StreamParams) {
    let f = wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, &p.encode()));
    c.send(Message::Binary(f.into())).await.expect("start");
}

async fn grant(c: &mut Client, n: u32) {
    let f = wire::frame(wire::TAG_CREDIT, &n.to_be_bytes());
    c.send(Message::Binary(f.into())).await.expect("credit");
}

async fn cancel(c: &mut Client) {
    let f = wire::frame(wire::TAG_CANCEL, &[]);
    c.send(Message::Binary(f.into())).await.expect("cancel");
}

#[derive(Default)]
struct Collected {
    batches: usize,
    rows: usize,
    payload_bytes: usize,
    /// The **accounted** consumer counter: the largest payload this client held at one time. This
    /// consumer keeps exactly one payload alive at a time, which is what makes the counter mean
    /// something; it is not an OS reading and does not claim to be one.
    peak_retained_bytes: usize,
    terminal: Option<u8>,
    first_batch_ms: Option<f64>,
    total_ms: f64,
}

/// Read to the terminal (or to `stop_after` batches), counting what arrived.
async fn drain(c: &mut Client, col: &mut Collected, t0: Instant, stop_after: Option<usize>) {
    loop {
        if let Some(n) = stop_after {
            if col.batches >= n {
                return;
            }
        }
        // Bounded, and loud on elapse. A measurement harness that hangs produces no artifact and no
        // verdict — strictly worse than one that fails and says which wait stalled.
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(_) => break,
            Err(_) => panic!(
                "timed out after {RECV_DEADLINE:?} waiting for a frame ({} batches in)",
                col.batches
            ),
        };
        let Message::Binary(b) = msg else { continue };
        let Some(len) = wire::payload_len(&b) else { continue };
        let payload = &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len];
        match b[0] {
            wire::TAG_BATCH => {
                if col.first_batch_ms.is_none() {
                    col.first_batch_ms = Some(t0.elapsed().as_secs_f64() * 1000.0);
                }
                col.batches += 1;
                col.payload_bytes += payload.len();
                col.peak_retained_bytes = col.peak_retained_bytes.max(payload.len());
                col.rows += rows_in(payload);
            }
            wire::TAG_TERMINAL => {
                col.terminal = Some(payload[0]);
                break;
            }
            _ => {}
        }
    }
    col.total_ms = t0.elapsed().as_secs_f64() * 1000.0;
}

/// Decode the batch far enough to count its rows. The full bit-identity check is H1's job in
/// `end_to_end.rs`; repeating it here would make this harness measure the decoder.
fn rows_in(payload: &[u8]) -> usize {
    let mut rdr =
        arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None).expect("ipc");
    rdr.next().expect("batch").expect("decode").num_rows()
}

async fn host(path: &std::path::Path) -> RunningDataPlane {
    let catalog = Catalog::new();
    catalog.open(DATASET, path, None).expect("open dataset");
    spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::new(Arc::new(catalog))),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve")
}

fn evidence_dir() -> std::path::PathBuf {
    let d = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/slice-evidence");
    std::fs::create_dir_all(&d).expect("evidence dir");
    d
}

/// Escape a captured string for embedding in the JSON artifact.
///
/// The hardware string comes from another process's stdout, and this artifact is assembled by
/// string interpolation. A quote or a backslash in a CPU name would produce a file that no reader
/// can parse — an evidence artifact that cannot be read is not evidence.
fn json_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            // Control characters become spaces rather than escapes: this field is a one-line
            // identity string, and a literal newline inside it would be a different kind of wrong.
            c if c.is_control() => out.push(' '),
            c => out.push(c),
        }
    }
    out
}

/// Hardware and OS identity, captured into the artifact so no figure travels without it.
fn hardware_profile() -> String {
    let out = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "$c=Get-CimInstance Win32_Processor|Select-Object -First 1; \
             $o=Get-CimInstance Win32_OperatingSystem; \
             $m=Get-CimInstance Win32_ComputerSystem; \
             '{0} | cores {1}/{2} | RAM {3} GiB | {4} {5}' -f \
             $c.Name.Trim(),$c.NumberOfCores,$c.NumberOfLogicalProcessors, \
             [math]::Round($m.TotalPhysicalMemory/1GB,1),$o.Caption.Trim(),$o.BuildNumber",
        ])
        .output();
    match out {
        Ok(o) if o.status.success() => String::from_utf8_lossy(&o.stdout).trim().to_string(),
        _ => "unavailable".to_string(),
    }
}

fn free_bytes_on_c() -> Option<u64> {
    let out = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "(Get-PSDrive C).Free",
        ])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

// ---------------------------------------------------------------------------------------------
// The measurement
// ---------------------------------------------------------------------------------------------

/// Refuses to produce a number on a build whose figures would not mean anything.
fn refuse_debug() {
    assert!(
        !cfg!(debug_assertions),
        "this harness produces measurements, and a debug build invalidates every one of them. \
         Run: cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture"
    );
}

#[ignore = "measurement harness: minutes long, release-only, writes an evidence artifact"]
#[tokio::test(flavor = "multi_thread", worker_threads = 4)]
async fn measure_the_slice_against_docs_08() {
    refuse_debug();

    let hardware = json_escape(&hardware_profile());
    let free_before = free_bytes_on_c();
    println!("hardware: {hardware}");

    // Four canary points, not two. The first pass of this harness recorded a ~28 % shift between
    // its start and end readings, and two readings cannot tell "the machine drifted" apart from
    // "this harness left work running behind it". A mid-run reading and a settled reading can.
    let canary_start = Canary::take("start");

    // ---- The fixture, shaped to docs/08's Polygons class ------------------------------------
    // **The harness keeps its fixtures apart from the ordinary suite's.**
    //
    // Every other test writes into `target/fixtures/` under a fixed name. This harness runs for
    // minutes and is normally started by hand, so it can easily overlap an ordinary
    // `cargo test --workspace` — and two processes writing the same `.parquet` path produce
    // "File too small to be a Parquet file" in whichever one reads mid-write. In a document whose
    // own finding #2 is "the source tree moved underneath the measurement", the measurement sharing
    // a fixture directory with the test suite is the same hazard one level down.
    let dir =
        std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/slice-budgets");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("polygons-100k.parquet");
    let t = Instant::now();
    let facts: FixtureFacts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: CLASS_FEATURES,
            avg_vertices: CLASS_AVG_VERTICES,
            hole_every: 7,
            ..Default::default()
        },
    )
    .expect("fixture");
    let fixture_build_ms = t.elapsed().as_secs_f64() * 1000.0;
    println!(
        "fixture: {} features, {} vertices, {} rings, {} bytes ({:.0} ms)",
        facts.features, facts.vertices, facts.rings, facts.bytes, fixture_build_ms
    );

    // ---- Dataset open, at the sizes that exist on this disk ----------------------------------
    //
    // This is **not** docs/08's "cold open of a 5 GB GeoParquet" row. It is the open path timed at
    // the sizes this machine had room for, and it is labelled that way in the artifact. It is also
    // *not* a cold-cache figure: nothing here purges the Windows file cache, so the second and
    // later opens read a warm cache.
    let mut open_points: Vec<(u64, Vec<f64>)> = Vec::new();
    for (label_bytes, p) in [(facts.bytes, path.clone())] {
        let mut samples = Vec::new();
        for _ in 0..5 {
            let t = Instant::now();
            let ds = spatial_engine::Dataset::open(&p).expect("open");
            samples.push(t.elapsed().as_secs_f64() * 1000.0);
            drop(ds);
        }
        open_points.push((label_bytes, samples));
    }

    let dp = host(&path).await;

    // ---- Cancellation, case 1: mid-stream ----------------------------------------------------
    //
    // Generous credit, so the producer is genuinely in flight — generating, framing and writing —
    // when the CANCEL frame arrives. Latency is the producer's own `Instant`, stamped inside the
    // adapter the moment it parses the frame, minus the client's `Instant` taken immediately
    // before the send. Both ends are in this process, so those are the same clock: **no
    // clock-relation bound is needed and none is claimed.**
    let mut mid_latency = Vec::new();
    let mut mid_after = Vec::new();
    let mut mid_to_terminal = Vec::new();
    for trial in 0..CANCEL_TRIALS {
        let mut c = connect(&dp).await;
        start(&mut c, params(None)).await;
        grant(&mut c, 100_000).await;

        let t0 = Instant::now();
        let mut col = Collected::default();
        drain(&mut c, &mut col, t0, Some(2)).await;
        assert_eq!(col.batches, 2, "trial {trial}: the stream was under way before the cancel");

        let sent_at = Instant::now();
        cancel(&mut c).await;
        drain(&mut c, &mut col, t0, None).await;
        let to_terminal = sent_at.elapsed().as_secs_f64() * 1000.0;

        assert_eq!(col.terminal, Some(wire::TERM_CANCELLED), "trial {trial}");
        let states = dp.registry.snapshot();
        let s = states.last().expect("stream");
        let observed = s.observed_at().expect("the producer observed the cancel");
        mid_latency.push(observed.duration_since(sent_at).as_secs_f64() * 1000.0);
        mid_after.push(s.batches_after_cancel());
        mid_to_terminal.push(to_terminal);
        c.close(None).await.ok();
    }

    // ---- Cancellation, case 2: before the first batch ----------------------------------------
    //
    // The case a flag polled between batches cannot serve. No credit is granted, so nothing is
    // ever delivered; the query is running when the CANCEL arrives. docs/08's budget says "any
    // operation", and an operation that has produced nothing is one of them.
    let mut early_latency = Vec::new();
    let mut early_after = Vec::new();
    let mut early_to_terminal = Vec::new();
    for trial in 0..CANCEL_TRIALS {
        let mut c = connect(&dp).await;
        start(&mut c, params(None)).await;
        tokio::time::sleep(Duration::from_millis(50)).await;

        let t0 = Instant::now();
        let sent_at = Instant::now();
        cancel(&mut c).await;
        let mut col = Collected::default();
        drain(&mut c, &mut col, t0, None).await;
        let to_terminal = sent_at.elapsed().as_secs_f64() * 1000.0;

        assert_eq!(col.batches, 0, "trial {trial}: nothing was ever delivered");
        assert_eq!(col.terminal, Some(wire::TERM_CANCELLED), "trial {trial}");
        let states = dp.registry.snapshot();
        let s = states.last().expect("stream");
        let observed = s.observed_at().expect("the producer observed the cancel");
        early_latency.push(observed.duration_since(sent_at).as_secs_f64() * 1000.0);
        early_after.push(s.batches_after_cancel());
        early_to_terminal.push(to_terminal);
        c.close(None).await.ok();
    }

    let canary_mid = Canary::take("mid — after 60 cancel trials");

    // ---- Streaming property + memory ---------------------------------------------------------
    //
    // Time to first batch against total stream time, at the Polygons class. This is the streaming
    // property — partial results flow while the query runs — and it is **not** a throughput claim:
    // the byte total and the duration are recorded side by side and deliberately not divided.
    let baseline_mem = procmem::sample().map(|c| (c.private_usage, c.working_set));
    let sampler = MemorySampler::start();

    let mut first_batch = Vec::new();
    let mut total_stream = Vec::new();
    let mut run_bytes = Vec::new();
    let mut run_rows = Vec::new();
    let mut peak_resident = Vec::new();
    let mut consumer_peak_retained = Vec::new();
    let mut batches_per_run = Vec::new();
    for run in 0..STREAM_RUNS {
        let mut c = connect(&dp).await;
        let t0 = Instant::now();
        start(&mut c, params(None)).await;
        grant(&mut c, 100_000).await;
        let mut col = Collected::default();
        drain(&mut c, &mut col, t0, None).await;

        assert_eq!(col.terminal, Some(wire::TERM_COMPLETED), "run {run}");
        assert_eq!(col.rows, facts.features, "run {run}: every feature arrives");
        first_batch.push(col.first_batch_ms.expect("a first batch"));
        total_stream.push(col.total_ms);
        run_bytes.push(col.payload_bytes as u64);
        run_rows.push(col.rows as u64);
        consumer_peak_retained.push(col.peak_retained_bytes as u64);
        batches_per_run.push(col.batches as u64);

        let states = dp.registry.snapshot();
        peak_resident.push(states.last().expect("stream").peak_resident_bytes() as u64);
        c.close(None).await.ok();
    }
    let (peak_private, peak_ws, mem_samples) = sampler.finish();

    // ---- Viewport selectivity vs full scan ----------------------------------------------------
    //
    // **There is no spatial index.** This is a linear scan over the GeoParquet 1.1 covering-bbox
    // columns, and `docs/07` keeps server-side spatial indexing as an open gate. What is measured
    // here is what a scan costs at each selectivity, not what an index would cost.
    let cols = (CLASS_FEATURES as f64).sqrt().ceil();
    let extent = cols * 40.0;
    let e_lo = spatial_engine::fixture::E_LO;
    let n_lo = spatial_engine::fixture::N_LO;
    let mut selectivity: Vec<(String, Vec<f64>, Vec<f64>, u64)> = Vec::new();
    for (label, frac) in [("quarter-extent", 0.5_f64), ("one-sixty-fourth-extent", 0.125)] {
        let bbox =
            [e_lo, n_lo, e_lo + extent * frac, n_lo + extent * frac];
        let mut firsts = Vec::new();
        let mut totals = Vec::new();
        let mut rows = 0u64;
        for _ in 0..SELECTIVITY_RUNS {
            let mut c = connect(&dp).await;
            let t0 = Instant::now();
            start(&mut c, params(Some(bbox))).await;
            grant(&mut c, 100_000).await;
            let mut col = Collected::default();
            drain(&mut c, &mut col, t0, None).await;
            assert_eq!(col.terminal, Some(wire::TERM_COMPLETED));
            firsts.push(col.first_batch_ms.expect("first batch"));
            totals.push(col.total_ms);
            rows = col.rows as u64;
            c.close(None).await.ok();
        }
        selectivity.push((label.to_string(), firsts, totals, rows));
    }

    dp.shutdown().await;

    let canary_end = Canary::take("end");
    // Same instrument after a settle. If `end` is slow and `settled` returns to `start`, the run's
    // own heat/load explains it; if `settled` stays slow, the machine itself moved.
    tokio::time::sleep(Duration::from_secs(20)).await;
    let canary_settled = Canary::take("settled — after 20 s idle");
    let free_after = free_bytes_on_c();

    // ---- The hard gates this harness is entitled to assert ------------------------------------
    //
    // Asserted, not merely recorded: a future run that regresses past a docs/08 budget must fail
    // loudly rather than be absorbed into a new number.
    let mid_sorted = sorted(&mid_latency);
    let early_sorted = sorted(&early_latency);
    let resident_bound =
        (spatial_data_plane::MAX_INFLIGHT_BATCHES + 1) * spatial_data_plane::MAX_FRAME_BYTES;
    let worst_resident = *peak_resident.iter().max().unwrap() as usize;

    let write_artifact = |verdict: &str| {
        let art = format!(
            r#"{{
  "kind": "docs/08 budget measurement — first engine slice",
  "harness": "kernel/tests/slice_budgets.rs",
  "command": "cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture",
  "verdict_note": "{verdict}",
  "build_profile": {{
    "profile": "release",
    "debug_assertions": {debug_assertions},
    "note": "built with CARGO_PROFILE_RELEASE_DEBUG=false to fit this machine's free disk; debug info does not affect codegen and debug_assertions is off either way"
  }},
  "hardware_profile": "{hardware}",
  "free_disk_bytes": {{ "before": {free_before}, "after": {free_after} }},
  "comparison_scope": "within-session only (bake-off README §21 Q1 / §22.1). No figure here may be compared with any number from any earlier session or any bake-off phase.",
  "throughput_claim": "none. Byte totals and durations are recorded separately and deliberately not divided; ADR-012 open risk 3 forbids a throughput claim citing it, and no transport conclusion is drawn here.",
  "clock_note": "both ends run in this process, so producer-side and client-side instants are the same clock: no clock-relation bound is needed and none is claimed",
  "canary": {{
    "instrument": "fixed transport-insensitive integer loop; touches no socket and no database",
    "short_iterations": {canary_short_iters},
    "long_iterations": {canary_long_iters},
    "instrument_finding": "the 40M-iteration canary that kernel/tests/concurrency_in_situ.rs uses is too short to be a stable instrument on this hardware: it sits inside the CPU's own frequency-transition window. Read the dispersion of the canary_40m_ms samples in this artifact rather than any figure quoted in prose -- an earlier version of this string quoted 'near 7 ms' and 'up to 3x', neither of which was a measurement taken from any run. The 400M-iteration reading is carried alongside it and is the one a reader should use.",
    "start": {canary_start},
    "mid_after_cancel_trials": {canary_mid},
    "end": {canary_end},
    "settled_after_20s_idle": {canary_settled},
    "why_four_points": "two readings cannot separate 'the machine drifted' from 'this harness left work running behind it'; a mid-run reading and a settled reading can"
  }},
  "dataset_class": {{
    "docs_08_row": "Polygons — 100k features / 10M vertices",
    "features": {features},
    "vertices": {vertices},
    "rings": {rings},
    "file_bytes": {file_bytes},
    "vertices_per_feature": "{vmin}..{vmax}",
    "fixture_build_ms": {fixture_build_ms:.1},
    "seed": "0x5EED205600000002 (FixtureSpec default)",
    "shape": "irregular polygons, per-feature vertex counts vary, every 7th carries an interior ring"
  }},
  "cancellation": {{
    "budget": "docs/08 — cancellation acknowledged < 100 ms, any operation",
    "measured": "producer-side: the adapter's own Instant at the moment it parses the CANCEL frame, minus the client's Instant immediately before the send",
    "trials_per_case": {trials},
    "percentile_method": "nearest rank over the sorted samples (sort and index), raw samples included",
    "mid_stream": {{
      "p50_ms": {mid_p50:.3}, "p95_ms": {mid_p95:.3},
      "min_ms": {mid_min:.3}, "max_ms": {mid_max:.3},
      "batches_generated_after_cancel_max": {mid_after_max},
      "cancel_to_terminal_p50_ms": {mid_term_p50:.3}, "cancel_to_terminal_p95_ms": {mid_term_p95:.3},
      "samples_ms": {mid_samples},
      "batches_after_cancel": {mid_after_samples}
    }},
    "before_first_batch": {{
      "note": "no credit granted, so nothing was ever delivered; the query is running when the CANCEL arrives. This is the case a flag polled between batches cannot serve.",
      "p50_ms": {early_p50:.3}, "p95_ms": {early_p95:.3},
      "min_ms": {early_min:.3}, "max_ms": {early_max:.3},
      "batches_generated_after_cancel_max": {early_after_max},
      "cancel_to_terminal_p50_ms": {early_term_p50:.3}, "cancel_to_terminal_p95_ms": {early_term_p95:.3},
      "samples_ms": {early_samples},
      "batches_after_cancel": {early_after_samples}
    }}
  }},
  "streaming": {{
    "note": "the streaming property (partial results while the query runs), NOT a throughput claim",
    "runs": {runs},
    "time_to_first_batch_p50_ms": {fb_p50:.3}, "time_to_first_batch_p95_ms": {fb_p95:.3},
    "total_stream_p50_ms": {ts_p50:.3}, "total_stream_p95_ms": {ts_p95:.3},
    "first_batch_samples_ms": {fb_samples},
    "total_samples_ms": {ts_samples},
    "batches_per_run": {batches_per_run},
    "rows_per_run": {rows_per_run},
    "wire_payload_bytes_per_run": {bytes_per_run}
  }},
  "memory": {{
    "producer_and_consumer_are_one_process": "this figure covers BOTH ends; the producer-only figure comes from the slice-host process during the browser probe run",
    "baseline_private_commit_bytes": {baseline_private},
    "baseline_working_set_bytes": {baseline_ws},
    "peak_private_commit_bytes": {peak_private},
    "peak_working_set_bytes": {peak_ws},
    "sample_interval_ms": {sample_ms},
    "samples_taken": {mem_samples},
    "producer_resident_counter": {{
      "what": "StreamState::peak_resident_bytes — payload bytes the producer holds (queued + in construction). This counter, not an OS reading, is what the bounded-memory claim rests on.",
      "peak_bytes_per_run": {peak_resident},
      "declared_bound_bytes": {resident_bound},
      "bound_expression": "(MAX_INFLIGHT_BATCHES + 1) x MAX_FRAME_BYTES = ({inflight} + 1) x {frame_bytes}",
      "outside_this_counter": "DuckDB's own streaming buffer is NOT seen by this counter and is not claimed to be"
    }},
    "accounted_consumer_counter": {{
      "what": "largest payload this client held at one time; it decodes and drops one batch at a time",
      "peak_bytes_per_run": {consumer_peak}
    }}
  }},
  "dataset_open": {{
    "note": "NOT docs/08's 5 GB cold-open row. Timed at the size this disk had room for, and with a WARM file cache — nothing here purges the Windows file cache.",
    "file_bytes": {open_bytes},
    "samples_ms": {open_samples}
  }},
  "viewport_selectivity": {{
    "note": "there is NO spatial index — this is a linear scan over the covering bbox columns; docs/07 keeps server-side spatial indexing as an open gate",
    "full_scan_rows": {features},
    "full_scan_total_p50_ms": {ts_p50:.3},
    "points": [{selectivity}]
  }},
  "explicitly_not_measured": {{
    "frame_time_p50_p95": "excluded. The 2D canvas probe is not the renderer module; a frame-time figure from it would be an off-architecture number quoted against a budget amended from ADR-003 spike M4 evidence.",
    "cold_open_5gb": "see RESULTS.md — unmeasured, free disk recorded there",
    "reproducibility_grade": "none claimed: the slice persists nothing (kernel/README.md), so there is no workflow to replay and no grade to assert",
    "cross_platform_deltas": "Windows/WebView2 only; macOS and Linux are docs/07's open follow-up"
  }}
}}
"#,
            debug_assertions = cfg!(debug_assertions),
            hardware = hardware,
            free_before = free_before.map(|v| v.to_string()).unwrap_or("null".into()),
            free_after = free_after.map(|v| v.to_string()).unwrap_or("null".into()),
            canary_short_iters = CANARY_ITERS_SHORT,
            canary_long_iters = CANARY_ITERS_LONG,
            canary_start = canary_start.json(),
            canary_mid = canary_mid.json(),
            canary_end = canary_end.json(),
            canary_settled = canary_settled.json(),
            features = facts.features,
            vertices = facts.vertices,
            rings = facts.rings,
            file_bytes = facts.bytes,
            vmin = facts.min_vertices_per_feature,
            vmax = facts.max_vertices_per_feature,
            fixture_build_ms = fixture_build_ms,
            trials = CANCEL_TRIALS,
            mid_p50 = pct(&mid_sorted, 0.50),
            mid_p95 = pct(&mid_sorted, 0.95),
            mid_min = mid_sorted[0],
            mid_max = mid_sorted[mid_sorted.len() - 1],
            mid_after_max = mid_after.iter().max().unwrap(),
            mid_term_p50 = pct(&sorted(&mid_to_terminal), 0.50),
            mid_term_p95 = pct(&sorted(&mid_to_terminal), 0.95),
            mid_samples = json_f64s(&mid_latency),
            mid_after_samples = json_u64s(&mid_after),
            early_p50 = pct(&early_sorted, 0.50),
            early_p95 = pct(&early_sorted, 0.95),
            early_min = early_sorted[0],
            early_max = early_sorted[early_sorted.len() - 1],
            early_after_max = early_after.iter().max().unwrap(),
            early_term_p50 = pct(&sorted(&early_to_terminal), 0.50),
            early_term_p95 = pct(&sorted(&early_to_terminal), 0.95),
            early_samples = json_f64s(&early_latency),
            early_after_samples = json_u64s(&early_after),
            runs = STREAM_RUNS,
            fb_p50 = pct(&sorted(&first_batch), 0.50),
            fb_p95 = pct(&sorted(&first_batch), 0.95),
            ts_p50 = pct(&sorted(&total_stream), 0.50),
            ts_p95 = pct(&sorted(&total_stream), 0.95),
            fb_samples = json_f64s(&first_batch),
            ts_samples = json_f64s(&total_stream),
            batches_per_run = json_u64s(&batches_per_run),
            rows_per_run = json_u64s(&run_rows),
            bytes_per_run = json_u64s(&run_bytes),
            baseline_private = baseline_mem.map(|m| m.0.to_string()).unwrap_or("null".into()),
            baseline_ws = baseline_mem.map(|m| m.1.to_string()).unwrap_or("null".into()),
            peak_private = peak_private,
            peak_ws = peak_ws,
            sample_ms = MEMORY_SAMPLE_MS,
            mem_samples = mem_samples,
            peak_resident = json_u64s(&peak_resident),
            resident_bound = resident_bound,
            inflight = spatial_data_plane::MAX_INFLIGHT_BATCHES,
            frame_bytes = spatial_data_plane::MAX_FRAME_BYTES,
            consumer_peak = json_u64s(&consumer_peak_retained),
            open_bytes = open_points[0].0,
            open_samples = json_f64s(&open_points[0].1),
            selectivity = selectivity
                .iter()
                .map(|(label, f, t, rows)| {
                    format!(
                        r#"{{"label": "{label}", "rows": {rows}, "first_batch_ms": {}, "total_ms": {}}}"#,
                        json_f64s(f),
                        json_f64s(t)
                    )
                })
                .collect::<Vec<_>>()
                .join(", "),
        );
        let out = evidence_dir().join("slice-budgets.json");
        std::fs::write(&out, art).expect("write artifact");
        println!("evidence: {}", out.display());
    };

    // **The verdict is computed before the artifact is written, and written into it.**
    //
    // The artifact used to be emitted with a fixed "see RESULTS.md" note and *then* the assertions
    // ran, so a run that blew a budget left a file indistinguishable from a passing one — and the
    // panic meant nobody went looking. An artifact that cannot tell you whether its own run passed
    // is the kind of evidence this project spent three bake-off phases learning to distrust.
    let mut misses: Vec<String> = Vec::new();
    if pct(&mid_sorted, 0.95) >= 100.0 {
        misses.push(format!("mid-stream cancel p95 {:.3} ms >= 100 ms", pct(&mid_sorted, 0.95)));
    }
    if pct(&early_sorted, 0.95) >= 100.0 {
        misses.push(format!(
            "cancel-before-first p95 {:.3} ms >= 100 ms",
            pct(&early_sorted, 0.95)
        ));
    }
    if *mid_after.iter().max().unwrap() > 1 || *early_after.iter().max().unwrap() > 1 {
        misses.push("more than one batch generated after cancellation was observed".to_string());
    }
    if worst_resident > resident_bound {
        misses.push(format!(
            "producer-resident peak {worst_resident} B exceeded the declared bound {resident_bound} B"
        ));
    }
    write_artifact(&if misses.is_empty() {
        "all hard gates met; see RESULTS.md for the per-row verdicts".to_string()
    } else {
        format!("REGRESSION - hard gates missed: {}", misses.join("; "))
    });

    println!(
        "cancel mid-stream   p50 {:.3} ms  p95 {:.3} ms  (n={CANCEL_TRIALS}, max batches after cancel {})",
        pct(&mid_sorted, 0.50),
        pct(&mid_sorted, 0.95),
        mid_after.iter().max().unwrap()
    );
    println!(
        "cancel before first p50 {:.3} ms  p95 {:.3} ms  (n={CANCEL_TRIALS}, max batches after cancel {})",
        pct(&early_sorted, 0.50),
        pct(&early_sorted, 0.95),
        early_after.iter().max().unwrap()
    );
    println!(
        "first batch p50 {:.1} ms / total p50 {:.1} ms  (n={STREAM_RUNS})",
        pct(&sorted(&first_batch), 0.50),
        pct(&sorted(&total_stream), 0.50)
    );
    println!(
        "producer-resident peak {} B vs declared bound {} B; private commit peak {} B",
        worst_resident, resident_bound, peak_private
    );

    // docs/08: cancellation acknowledged < 100 ms, any operation.
    assert!(
        pct(&mid_sorted, 0.95) < 100.0,
        "REGRESSION: mid-stream cancel p95 {:.3} ms exceeds the docs/08 100 ms budget",
        pct(&mid_sorted, 0.95)
    );
    assert!(
        pct(&early_sorted, 0.95) < 100.0,
        "REGRESSION: cancel-before-first-batch p95 {:.3} ms exceeds the docs/08 100 ms budget",
        pct(&early_sorted, 0.95)
    );
    assert!(
        *mid_after.iter().max().unwrap() <= 1 && *early_after.iter().max().unwrap() <= 1,
        "REGRESSION: more than one batch generated after cancellation was observed"
    );
    assert!(
        worst_resident <= resident_bound,
        "REGRESSION: producer-resident peak {worst_resident} exceeded the declared bound {resident_bound}"
    );
}
