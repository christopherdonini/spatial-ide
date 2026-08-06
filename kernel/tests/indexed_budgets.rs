//! **The index-in-path `docs/08` pass, as a committed, re-runnable harness.**
//!
//! ```bash
//! cargo test --release -p spatial-kernel --test indexed_budgets -- --ignored --nocapture
//! ```
//!
//! Governed by `kernel/PROBE-PREREGISTRATION.md`, committed before this file was written and before
//! any result of this pass was looked at. It declares the sample counts, what each measured quantity
//! means, and the invalidators; this harness enforces them rather than describing them.
//!
//! ## Why this exists beside `slice_budgets.rs` rather than inside it
//!
//! `slice_budgets.rs` measures the tree that has **no index in the path** and its selectivity
//! section says so in as many words. Pieces 1–4a put an index, an identity uniqueness scan and a
//! progressive batch-size policy into that path. Rewriting the older harness would destroy the one
//! thing this pass needs most: the ability to measure the **unindexed baseline in the same session,
//! from the same binary**, because this machine drifts between sessions *asymmetrically* and a
//! ratio does not cancel it (bake-off README §21 Q1 / §22.1). So this harness measures both, in
//! order, in one process.
//!
//! ## Order is part of the design and cannot be rearranged
//!
//! The index cache is **process-wide and keyed by path**. Everything unindexed must therefore be
//! measured before any index exists in this process, and cannot be re-measured afterwards without a
//! fresh process. The phases below run in exactly the order they are written.
//!
//! ## What is measured, and on whose clock
//!
//! - Both ends run in **one process**, so producer-side and client-side instants are the **same
//!   clock**: no clock-relation bound is needed and none is claimed.
//! - Cancellation is always observed **inside the thread doing the work**, stamped the moment that
//!   thread has observed the cancel — never after a handoff back to the caller. A threshold
//!   asserted across a thread handoff measures scheduling, not the property (`RESULTS.md`,
//!   finding 1).
//! - **No throughput claim.** Byte totals and durations are recorded side by side and never
//!   divided. Nothing here cites ADR-012.
//! - **Index build cost and index query benefit are separate quantities** and are never netted into
//!   "pays for itself after N queries".

use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{Arc, Condvar, Mutex};
use std::time::{Duration, Instant};

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_engine::identity::IdentityDeclaration;
use spatial_engine::index::{IndexPhase, IndexPhaseObserver};
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use spatial_kernel::{Catalog, EngineSourceFactory, StreamParams, OPERATION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

/// Generous upper bound on any single blocking wait. A test or instrument that can hang forever is
/// itself a defect: a deadline turns a stall into a failure that names which wait it was.
const RECV_DEADLINE: Duration = Duration::from_secs(60);

const DATASET: &str = "parcels";

// ---- Declared before measuring (PROBE-PREREGISTRATION.md §1b) --------------------------------

const CLASS_FEATURES: usize = 100_000;
const CLASS_AVG_VERTICES: usize = 100;
/// Cancellation trials per wire-level case.
const CANCEL_TRIALS: usize = 30;
/// Runs per selectivity point, per path (wire and engine-direct), per index state.
const SELECTIVITY_RUNS: usize = 7;
/// Delay ladder for cancelling **during an index build**, ascending; the ladder stops at the first
/// trial that completes, because a completed build populates the cache and every later trial would
/// then be timing a cache hit under the same name (preregistration amendment A3).
const INDEX_CANCEL_DELAYS_MS: [u64; 6] = [10, 25, 50, 100, 200, 400];
const INDEX_CANCEL_REPEATS: usize = 2;
/// Delay ladder for cancelling **inside the DuckDB covering-bbox scan**, measured from the moment
/// the build reports that it has entered that phase (preregistration amendment A7).
///
/// **The previous pass sampled this phase zero times.** All twelve of its delays fell inside the
/// 610 ms SHA-256 content hash, which runs first; the scan is about 30 ms and starts after it. A
/// wall-clock ladder cannot aim at a phase that short — so this one does not try. It waits for the
/// phase observer to report `DuckDbScan`, and only then starts counting.
const SCAN_CANCEL_DELAYS_MS: [u64; 6] = [0, 1, 2, 5, 10, 20];
const SCAN_CANCEL_REPEATS: usize = 2;
/// Delay ladder for cancelling **during the identity uniqueness scan**, chosen to straddle the
/// uninterruptible prelude of `Dataset::open` rather than to land inside it (amendment A3).
const IDENTITY_CANCEL_DELAYS_MS: [u64; 5] = [5, 15, 30, 50, 80];
const IDENTITY_CANCEL_REPEATS: usize = 3;
const MEMORY_SAMPLE_MS: u64 = 50;

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

// ---------------------------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------------------------

/// The canary: fixed, transport-insensitive, touching no socket and no database.
///
/// The 400 M reading is the one to read — `RESULTS.md`'s instrument finding records that the 40 M
/// reading sits inside this CPU's own frequency-transition window and is too short to certify a
/// session. Both are recorded so the finding stays checkable.
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

struct Canary {
    label: String,
    short: Vec<f64>,
    long: Vec<f64>,
}

/// Discarded before every canary point. **A reading taken on a CPU that has been idle measures how
/// fast the governor ramps, not how fast the machine is** — attempt 1's *settled* point (taken after
/// 20 s of idle) came back slower than two points taken mid-run, which is the frequency-transition
/// window `RESULTS.md`'s instrument finding already named, showing up one scale higher.
const CANARY_WARMUP_ITERS: u64 = 100_000_000;

impl Canary {
    fn take(label: &str) -> Self {
        std::hint::black_box(canary_ms(CANARY_WARMUP_ITERS));
        let short: Vec<f64> = (0..5).map(|_| canary_ms(CANARY_ITERS_SHORT)).collect();
        let long: Vec<f64> = (0..3).map(|_| canary_ms(CANARY_ITERS_LONG)).collect();
        let c = Self { label: label.into(), short, long };
        println!(
            "canary [{label}] long min {:.1} ms  raw {}",
            c.long_min(),
            c.long.iter().map(|v| format!("{v:.1}")).collect::<Vec<_>>().join(", ")
        );
        c
    }
    fn long_min(&self) -> f64 {
        sorted(&self.long)[0]
    }
    fn json(&self) -> String {
        format!(
            r#"{{"label": "{}", "short_ms": {}, "long_ms": {}, "long_min_ms": {:.3}}}"#,
            self.label,
            json_f64s(&self.short),
            json_f64s(&self.long),
            self.long_min()
        )
    }
}

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
        /// `PROCESS_MEMORY_COUNTERS_EX.PrivateUsage` — Windows **private commit**.
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

/// Watches an index build's phase transitions so a cancel can be aimed at one of them.
///
/// **This is what closes the gap `RESULTS.md` reports as never sampled.** A wall-clock ladder
/// cannot aim at a 30 ms phase that begins after a 610 ms one; waiting for the phase to be
/// *announced* can. The build announces on its own thread as it enters each phase.
///
/// **It does not move the observation instant.** The cancellation latency reported below is still
/// stamped inside the thread doing the work, the moment that thread has observed the cancel. This
/// object only decides *when the cancel is issued*, which is the canceller's side of the
/// measurement and always was.
struct ScanPhaseWatch {
    entered_scan: Mutex<Option<Instant>>,
    signal: Condvar,
    phases: Mutex<Vec<&'static str>>,
}

impl ScanPhaseWatch {
    fn new() -> Self {
        Self {
            entered_scan: Mutex::new(None),
            signal: Condvar::new(),
            phases: Mutex::new(Vec::new()),
        }
    }

    /// Block until the build reports it has entered the DuckDB scan, or give up.
    fn wait_for_scan(&self, deadline: Duration) -> Option<Instant> {
        let guard = self.entered_scan.lock().unwrap_or_else(|e| e.into_inner());
        let (guard, _) = self
            .signal
            .wait_timeout_while(guard, deadline, |seen| seen.is_none())
            .unwrap_or_else(|e| e.into_inner());
        *guard
    }

    /// The most recent phase announced — what the build was doing at this instant.
    fn last_phase(&self) -> &'static str {
        self.phases
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .last()
            .copied()
            .unwrap_or("none")
    }

    fn seen(&self) -> Vec<&'static str> {
        self.phases.lock().unwrap_or_else(|e| e.into_inner()).clone()
    }
}

impl IndexPhaseObserver for ScanPhaseWatch {
    fn phase(&self, phase: IndexPhase) {
        self.phases.lock().unwrap_or_else(|e| e.into_inner()).push(phase.as_str());
        if phase == IndexPhase::DuckDbScan {
            *self.entered_scan.lock().unwrap_or_else(|e| e.into_inner()) = Some(Instant::now());
            self.signal.notify_all();
        }
    }
}

/// Nearest rank over a sorted slice — the same sort-and-index method every earlier figure used.
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
    format!("[{}]", v.iter().map(|x| format!("{x:.3}")).collect::<Vec<_>>().join(", "))
}

fn json_strs(v: &[&str]) -> String {
    format!("[{}]", v.iter().map(|s| format!("\"{}\"", json_escape(s))).collect::<Vec<_>>().join(", "))
}

fn json_u64s(v: &[u64]) -> String {
    format!("[{}]", v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(", "))
}

/// p50/p95 plus every raw sample. The samples travel with the summary always: a percentile over
/// n = 7 that arrives without its samples cannot be checked by a reader.
fn summary_json(label: &str, v: &[f64]) -> String {
    let s = sorted(v);
    format!(
        r#"{{"what": "{label}", "n": {}, "p50_ms": {:.3}, "p95_ms": {:.3}, "min_ms": {:.3}, "max_ms": {:.3}, "samples_ms": {}}}"#,
        v.len(),
        pct(&s, 0.50),
        pct(&s, 0.95),
        s.first().copied().unwrap_or(f64::NAN),
        s.last().copied().unwrap_or(f64::NAN),
        json_f64s(v)
    )
}

// ---------------------------------------------------------------------------------------------
// Harness plumbing
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

async fn cancel_frame(c: &mut Client) {
    let f = wire::frame(wire::TAG_CANCEL, &[]);
    c.send(Message::Binary(f.into())).await.expect("cancel");
}

#[derive(Default)]
struct Collected {
    batches: usize,
    rows: usize,
    payload_bytes: usize,
    first_batch_bytes: usize,
    peak_retained_bytes: usize,
    terminal: Option<u8>,
    first_batch_ms: Option<f64>,
    total_ms: f64,
}

async fn drain(c: &mut Client, col: &mut Collected, t0: Instant, stop_after: Option<usize>) {
    loop {
        if let Some(n) = stop_after {
            if col.batches >= n {
                return;
            }
        }
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
                    col.first_batch_bytes = payload.len();
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

fn rows_in(payload: &[u8]) -> usize {
    let mut rdr =
        arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None).expect("ipc");
    rdr.next().expect("batch").expect("decode").num_rows()
}

async fn host(path: &std::path::Path) -> RunningDataPlane {
    let mut catalog = Catalog::new();
    catalog.open(DATASET, path, None).expect("open dataset");
    spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::new(catalog)),
        static_dir: None,
    })
    .await
    .expect("serve")
}

fn evidence_dir() -> std::path::PathBuf {
    let d = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/slice-evidence");
    std::fs::create_dir_all(&d).expect("evidence dir");
    d
}

fn json_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            c if c.is_control() => out.push(' '),
            c => out.push(c),
        }
    }
    out
}

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
        .args(["-NoProfile", "-Command", "(Get-PSDrive C).Free"])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

fn refuse_debug() {
    assert!(
        !cfg!(debug_assertions),
        "this harness produces measurements, and a debug build invalidates every one of them. \
         Run: cargo test --release -p spatial-kernel --test indexed_budgets -- --ignored --nocapture"
    );
}

/// One selectivity point: what was asked, and what each path measured.
struct Point {
    label: String,
    bbox: Option<[f64; 4]>,
    plan: String,
    rows: u64,
    batches: u64,
    payload_bytes: u64,
    first_batch_bytes: u64,
    wire_first: Vec<f64>,
    wire_total: Vec<f64>,
    engine_first: Vec<f64>,
    engine_total: Vec<f64>,
    peak_resident: Vec<u64>,
}

impl Point {
    fn json(&self) -> String {
        format!(
            r#"{{"label": "{}", "bbox": {}, "filter_plan": "{}", "rows": {}, "batches": {}, "wire_payload_bytes": {}, "first_batch_payload_bytes": {},
      "wire_time_to_first_batch": {},
      "wire_total_stream_time": {},
      "engine_direct_time_to_first_batch": {},
      "engine_direct_total_time": {},
      "producer_resident_peak_bytes_per_run": {}}}"#,
            self.label,
            match self.bbox {
                Some(b) => format!("[{}, {}, {}, {}]", b[0], b[1], b[2], b[3]),
                None => "null".into(),
            },
            self.plan,
            self.rows,
            self.batches,
            self.payload_bytes,
            self.first_batch_bytes,
            summary_json("wire: query start -> first batch on the client", &self.wire_first),
            summary_json("wire: query start -> terminal", &self.wire_total),
            summary_json("engine-direct: stream() -> first batch returned", &self.engine_first),
            summary_json("engine-direct: stream() -> end of stream", &self.engine_total),
            json_u64s(&self.peak_resident),
        )
    }
}

/// Observe the `FilterPlan` for a query. The wire carries no plan — it is reported by the engine to
/// its caller — so this is an **engine-direct observation with identical parameters**, and it is
/// labelled that way wherever it appears. Without it, "the index narrowed this", "there was no
/// index" and "the index could not help" produce similar timings and none of them is attributable.
fn observe_plan(ds: &Dataset, q: &ViewportQuery) -> String {
    let s = ds.stream(q).expect("stream");
    format!("{:?}", s.filter_plan())
}

/// One engine-direct run: `stream()` to the first batch, and to the end. No data plane, no socket.
fn engine_direct(ds: &Dataset, q: &ViewportQuery) -> (f64, f64, u64, u64, u64, u64) {
    let t0 = Instant::now();
    let mut s = ds.stream(q).expect("stream");
    let mut buf = Vec::new();
    let mut first_ms = None;
    let (mut rows, mut batches, mut bytes, mut first_bytes) = (0u64, 0u64, 0u64, 0u64);
    while let Some(info) = s.next_into(&mut buf) {
        let info = info.expect("batch");
        if first_ms.is_none() {
            first_ms = Some(t0.elapsed().as_secs_f64() * 1000.0);
            first_bytes = info.payload_bytes as u64;
        }
        rows += info.rows as u64;
        batches += 1;
        bytes += info.payload_bytes as u64;
        buf.clear();
    }
    (first_ms.unwrap_or(f64::NAN), t0.elapsed().as_secs_f64() * 1000.0, rows, batches, bytes, first_bytes)
}

// ---------------------------------------------------------------------------------------------
// The measurement
// ---------------------------------------------------------------------------------------------

#[ignore = "measurement harness: minutes long, release-only, writes an evidence artifact"]
#[tokio::test(flavor = "multi_thread", worker_threads = 4)]
async fn measure_the_indexed_slice_against_docs_08() {
    refuse_debug();

    let hardware = json_escape(&hardware_profile());
    let free_before = free_bytes_on_c();
    println!("hardware: {hardware}");

    let canary_start = Canary::take("start");

    // ---- Fixtures ----------------------------------------------------------------------------
    //
    // A: the file every query measurement runs against, and the one the browser probe is pointed
    // at, so the two instruments describe the same bytes.
    // B: a byte-identical second copy used **only** for index-build cancellation. The index cache
    // is keyed by path, so trials on B cannot disturb A's cache entry — and a cancelled build on A
    // would otherwise be indistinguishable, in the cache, from one that never ran.
    let dir =
        std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/slice-budgets");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path_a = dir.join("polygons-100k.parquet");
    let path_b = dir.join("polygons-100k-cancel-b.parquet");
    let spec = FixtureSpec {
        features: CLASS_FEATURES,
        avg_vertices: CLASS_AVG_VERTICES,
        hole_every: 7,
        ..Default::default()
    };
    let facts: FixtureFacts = write_geoparquet(&path_a, &spec).expect("fixture A");
    let facts_b: FixtureFacts = write_geoparquet(&path_b, &spec).expect("fixture B");
    assert_eq!(facts.coord_bits_xor, facts_b.coord_bits_xor, "B must be the same bytes as A");
    println!(
        "fixture: {} features, {} vertices, {} rings, {} bytes",
        facts.features, facts.vertices, facts.rings, facts.bytes
    );

    let sampler = MemorySampler::start();
    let baseline_mem = procmem::sample().map(|c| (c.private_usage, c.working_set));

    // ---- Dataset open, warm cache -------------------------------------------------------------
    //
    // NOT docs/08's "cold open of a 5 GB GeoParquet" row: nothing here purges the Windows file
    // cache, and this file is 1/34th of that size. It is the open path timed at the size this disk
    // had room for. **This now includes ADR-016's identity uniqueness scan**, which reads a whole
    // column, so it is a different quantity from the same row in the earlier harness.
    // **Both connection configurations are timed**, because this cut changed what `Dataset::open`
    // does and the brief requires the cost to be recorded rather than assumed. What was added is
    // one trivial drained statement before the connection is handed to the pool; what was *not*
    // added is a connection — open created exactly one before this cut and creates exactly one
    // now. The two configurations differ only in whether that connection is then kept.
    //
    // **This is an absolute figure in this session and not a before/after.** The 26.7–39.9 ms in
    // the previous `RESULTS.md` section came from another session and is not a baseline for it.
    let mut open_ms = Vec::new();
    for _ in 0..5 {
        let t = Instant::now();
        let ds = Dataset::open(&path_a).expect("open");
        open_ms.push(t.elapsed().as_secs_f64() * 1000.0);
        drop(ds);
    }
    let mut open_ms_fresh = Vec::new();
    for _ in 0..5 {
        let t = Instant::now();
        let ds = Dataset::open_with_connections(
            &path_a,
            None,
            spatial_engine::PoolConfig::fresh_per_query(),
        )
        .expect("open");
        open_ms_fresh.push(t.elapsed().as_secs_f64() * 1000.0);
        drop(ds);
    }

    // ---- Cancellation during the identity uniqueness scan -------------------------------------
    //
    // A whole-column operation on the open path, so `docs/01` principle 7 applies to it exactly as
    // it applies to a stream. Observed **inside the opening thread**, stamped the instant
    // `open_with_declared_identity` returns having seen the cancel.
    let mut ident_latency = Vec::new();
    let mut ident_delays = Vec::new();
    let mut ident_completed = 0usize;
    let mut ident_other_error = 0usize;
    for delay in IDENTITY_CANCEL_DELAYS_MS {
        for _ in 0..IDENTITY_CANCEL_REPEATS {
            let cancel = CancelToken::new();
            let p = path_a.clone();
            let c2 = cancel.clone();
            let worker = std::thread::spawn(move || {
                let decl = IdentityDeclaration::new("id", "indexed_budgets harness", "unix:0");
                let r = Dataset::open_with_declared_identity(&p, decl, &c2);
                (Instant::now(), r.is_ok(), r.err().map(|e| e.to_string()))
            });
            std::thread::sleep(Duration::from_millis(delay));
            let sent = Instant::now();
            cancel.cancel();
            let (observed, ok, err) = worker.join().expect("identity worker");
            if ok {
                // The cancel arrived after the scan had already finished. Counted and reported,
                // never dropped silently and never counted as a latency sample.
                ident_completed += 1;
            } else if err.as_deref() == Some("cancelled") || err.iter().any(|e| e.contains("ancel")) {
                ident_latency.push(observed.duration_since(sent).as_secs_f64() * 1000.0);
                ident_delays.push(delay);
            } else {
                ident_other_error += 1;
                println!("identity cancel trial: unexpected error {err:?}");
            }
        }
    }

    // ---- Cancellation INSIDE the DuckDB scan phase (amendment A7) ------------------------------
    //
    // **The gap the previous pass named and could not close.** All twelve of its delays fell inside
    // the 610 ms content hash and the ~30 ms scan was never sampled. This ladder does not guess at a
    // wall-clock offset: it waits for the build to announce that it has entered `DuckDbScan`, and
    // measures the delay from there.
    //
    // A **third copy** of the fixture, because a cancelled build inserts nothing into the cache but
    // a completed one does — running this on B would leave B's cache populated and make the delay
    // ladder below a series of cache hits timed under the wrong name. The copy is deleted when this
    // phase is over, because disk headroom is itself an invalidator here.
    let path_c = dir.join("polygons-100k-scan-c.parquet");
    let facts_c: FixtureFacts = write_geoparquet(&path_c, &spec).expect("fixture C");
    assert_eq!(facts.coord_bits_xor, facts_c.coord_bits_xor, "C must be the same bytes as A");
    let ds_c = Arc::new(Dataset::open(&path_c).expect("open C"));

    let mut scan_latency = Vec::new();
    let mut scan_delays = Vec::new();
    let mut scan_issued_in = Vec::new();
    let mut scan_observed_in = Vec::new();
    let mut scan_completed_first = 0usize;
    let mut scan_never_started = 0usize;
    let mut scan_stopped_at: Option<u64> = None;
    'scan_ladder: for delay in SCAN_CANCEL_DELAYS_MS {
        for _ in 0..SCAN_CANCEL_REPEATS {
            let watch = Arc::new(ScanPhaseWatch::new());
            let cancel = CancelToken::new();
            let ds = Arc::clone(&ds_c);
            let observer = Arc::clone(&watch);
            let c2 = cancel.clone();
            let worker = std::thread::spawn(move || {
                let r = ds.build_index_observed(&c2, Some(&*observer));
                // Stamped **inside the thread doing the work**, the moment it has observed the
                // cancel — never after a handoff back to the caller.
                (Instant::now(), r.is_ok(), observer.last_phase(), observer.seen())
            });

            if watch.wait_for_scan(Duration::from_secs(30)).is_none() {
                // The build never reached the scan. Counted and reported; never silently retried.
                scan_never_started += 1;
                cancel.cancel();
                let _ = worker.join();
                continue;
            }
            std::thread::sleep(Duration::from_millis(delay));
            let issued_in = watch.last_phase();
            let sent = Instant::now();
            cancel.cancel();
            let (observed, ok, observed_in, seen) = worker.join().expect("scan worker");
            if ok {
                // The scan finished before the cancel arrived. Reported separately — it is not a
                // latency sample, and it populates C's cache, so the ladder stops here.
                scan_completed_first += 1;
                scan_stopped_at = Some(delay);
                println!(
                    "scan-phase cancel ladder: a build completed at delay {delay} ms (phases {seen:?}) — stopping"
                );
                break 'scan_ladder;
            }
            scan_latency.push(observed.duration_since(sent).as_secs_f64() * 1000.0);
            scan_delays.push(delay);
            scan_issued_in.push(issued_in);
            scan_observed_in.push(observed_in);
        }
    }
    println!(
        "scan-phase cancellation: {} samples, {} completed first, {} never reached the scan",
        scan_latency.len(),
        scan_completed_first,
        scan_never_started
    );
    drop(ds_c);
    let _ = std::fs::remove_file(&path_c);

    // ---- Cancellation during an index build ---------------------------------------------------
    //
    // Two whole-file phases live inside `build_index`: a SHA-256 content hash of the source, and a
    // DuckDB scan of the covering-bbox columns. Which phase a given delay landed in is attributed
    // **afterwards**, from the successful build's own `content_hash_millis` / `build_millis` split.
    // The ladder stops at the first trial that completes (amendment A3).
    let ds_b = Arc::new(Dataset::open(&path_b).expect("open B"));
    let mut idx_latency = Vec::new();
    let mut idx_delays = Vec::new();
    let mut idx_completed_at: Option<u64> = None;
    'ladder: for delay in INDEX_CANCEL_DELAYS_MS {
        for _ in 0..INDEX_CANCEL_REPEATS {
            let cancel = CancelToken::new();
            let ds = Arc::clone(&ds_b);
            let c2 = cancel.clone();
            let worker = std::thread::spawn(move || {
                let r = ds.build_index(&c2);
                (Instant::now(), r.is_ok())
            });
            std::thread::sleep(Duration::from_millis(delay));
            let sent = Instant::now();
            cancel.cancel();
            let (observed, ok) = worker.join().expect("index worker");
            if ok {
                idx_completed_at = Some(delay);
                println!("index-build cancel ladder: a build completed at delay {delay} ms — stopping");
                break 'ladder;
            }
            idx_latency.push(observed.duration_since(sent).as_secs_f64() * 1000.0);
            idx_delays.push(delay);
        }
    }
    // One successful build on B, for the phase split the attribution above needs. B is never
    // queried, so this cache entry affects nothing else.
    let b_report = ds_b.build_index(&CancelToken::new()).expect("build B");
    println!(
        "index on B: hash {:.1} ms, build {:.1} ms, {} features, {} B declared",
        b_report.content_hash_millis,
        b_report.build_millis,
        b_report.indexed_features,
        b_report.declared_memory_bytes
    );

    // ---- The three query viewports ------------------------------------------------------------
    //
    // The same three the browser probe is given, computed the same way, so the two instruments ask
    // the same questions of the same file.
    let cols = (CLASS_FEATURES as f64).sqrt().ceil();
    let span = cols * 40.0;
    let e_lo = spatial_engine::fixture::E_LO;
    let n_lo = spatial_engine::fixture::N_LO;
    let viewports: Vec<(&str, Option<[f64; 4]>)> = vec![
        ("full", None),
        ("quarter-extent", Some([e_lo, n_lo, e_lo + span * 0.5, n_lo + span * 0.5])),
        ("one-sixty-fourth-extent", Some([e_lo, n_lo, e_lo + span * 0.125, n_lo + span * 0.125])),
    ];
    println!("viewports: {viewports:?}");

    let ds_a = Dataset::open(&path_a).expect("open A");
    let query_for = |bbox: Option<[f64; 4]>| match bbox {
        Some(b) => ViewportQuery::viewport(
            Bbox { xmin: b[0], ymin: b[1], xmax: b[2], ymax: b[3] },
            "EPSG:2056",
        ),
        None => ViewportQuery::all(),
    };

    let dp = host(&path_a).await;

    // ---- Phase 1: UNINDEXED. Must run before any index exists in this process. -----------------
    let mut unindexed: Vec<Point> = Vec::new();
    for (label, bbox) in &viewports {
        unindexed.push(measure_point(&dp, &ds_a, label, *bbox, &query_for).await);
    }
    for p in &unindexed {
        println!(
            "unindexed {}: plan {} rows {} · wire first p50 {:.1} total p50 {:.1} · engine first p50 {:.1} total p50 {:.1}",
            p.label,
            p.plan,
            p.rows,
            pct(&sorted(&p.wire_first), 0.5),
            pct(&sorted(&p.wire_total), 0.5),
            pct(&sorted(&p.engine_first), 0.5),
            pct(&sorted(&p.engine_total), 0.5)
        );
    }

    let canary_mid = Canary::take("mid — after the unindexed phase");

    // ---- Build the index on A ------------------------------------------------------------------
    //
    // Build cost and query benefit are separate quantities and stay separate. Nothing here nets
    // them into "pays for itself after N queries".
    let t_build = Instant::now();
    let a_report = ds_a.build_index(&CancelToken::new()).expect("build A");
    let a_build_wall_ms = t_build.elapsed().as_secs_f64() * 1000.0;
    let mut reuse_reports = Vec::new();
    for _ in 0..3 {
        let t = Instant::now();
        let r = ds_a.build_index(&CancelToken::new()).expect("reuse A");
        reuse_reports.push((t.elapsed().as_secs_f64() * 1000.0, r.content_hash_millis, r.build_millis, r.miss.is_none()));
    }
    println!(
        "index on A: hash {:.1} ms, build {:.1} ms, wall {:.1} ms, {} features, {} B declared, {} rows scanned",
        a_report.content_hash_millis,
        a_report.build_millis,
        a_build_wall_ms,
        a_report.indexed_features,
        a_report.declared_memory_bytes,
        a_report.scanned_rows
    );

    // ---- Phase 2: INDEXED, same binary, same session, same file --------------------------------
    let mut indexed: Vec<Point> = Vec::new();
    for (label, bbox) in &viewports {
        indexed.push(measure_point(&dp, &ds_a, label, *bbox, &query_for).await);
    }
    for p in &indexed {
        println!(
            "indexed   {}: plan {} rows {} · wire first p50 {:.1} total p50 {:.1} · engine first p50 {:.1} total p50 {:.1}",
            p.label,
            p.plan,
            p.rows,
            pct(&sorted(&p.wire_first), 0.5),
            pct(&sorted(&p.wire_total), 0.5),
            pct(&sorted(&p.engine_first), 0.5),
            pct(&sorted(&p.engine_total), 0.5)
        );
    }

    // The result sets must be identical with and without the index. If they are not, the index has
    // become the system of record, which ADR-006 says a pure transformation's cached output is not
    // — and every timing above would be describing two different questions.
    for (u, i) in unindexed.iter().zip(indexed.iter()) {
        assert_eq!(u.rows, i.rows, "{}: indexed and unindexed row counts must agree", u.label);
        assert_eq!(
            u.payload_bytes, i.payload_bytes,
            "{}: indexed and unindexed payloads must be identical",
            u.label
        );
    }

    // ---- Cancellation with the index in the path -----------------------------------------------
    //
    // The quarter-extent viewport, so the index is genuinely consulted (a whole-file query never
    // reaches the index at all).
    let cancel_bbox = viewports[1].1;
    let mut mid_latency = Vec::new();
    let mut mid_after = Vec::new();
    for trial in 0..CANCEL_TRIALS {
        let mut c = connect(&dp).await;
        start(&mut c, params(cancel_bbox)).await;
        grant(&mut c, 100_000).await;
        let t0 = Instant::now();
        let mut col = Collected::default();
        drain(&mut c, &mut col, t0, Some(2)).await;
        assert_eq!(col.batches, 2, "trial {trial}: the stream was under way before the cancel");
        let sent_at = Instant::now();
        cancel_frame(&mut c).await;
        drain(&mut c, &mut col, t0, None).await;
        assert_eq!(col.terminal, Some(wire::TERM_CANCELLED), "trial {trial}");
        let states = dp.registry.snapshot();
        let s = states.last().expect("stream");
        let observed = s.observed_at().expect("the producer observed the cancel");
        mid_latency.push(observed.duration_since(sent_at).as_secs_f64() * 1000.0);
        mid_after.push(s.batches_after_cancel());
        c.close(None).await.ok();
    }

    let mut early_latency = Vec::new();
    let mut early_after = Vec::new();
    for trial in 0..CANCEL_TRIALS {
        let mut c = connect(&dp).await;
        start(&mut c, params(cancel_bbox)).await;
        tokio::time::sleep(Duration::from_millis(50)).await;
        let t0 = Instant::now();
        let sent_at = Instant::now();
        cancel_frame(&mut c).await;
        let mut col = Collected::default();
        drain(&mut c, &mut col, t0, None).await;
        assert_eq!(col.batches, 0, "trial {trial}: nothing was ever delivered");
        assert_eq!(col.terminal, Some(wire::TERM_CANCELLED), "trial {trial}");
        let states = dp.registry.snapshot();
        let s = states.last().expect("stream");
        let observed = s.observed_at().expect("the producer observed the cancel");
        early_latency.push(observed.duration_since(sent_at).as_secs_f64() * 1000.0);
        early_after.push(s.batches_after_cancel());
        c.close(None).await.ok();
    }

    dp.shutdown().await;
    let (peak_private, peak_ws, mem_samples) = sampler.finish();

    let canary_end = Canary::take("end");
    tokio::time::sleep(Duration::from_secs(20)).await;
    let canary_settled = Canary::take("settled — after 20 s idle");
    let free_after = free_bytes_on_c();

    // ---- Artifact -------------------------------------------------------------------------------

    let mid_sorted = sorted(&mid_latency);
    let early_sorted = sorted(&early_latency);
    let resident_bound =
        (spatial_data_plane::MAX_INFLIGHT_BATCHES + 1) * spatial_data_plane::MAX_FRAME_BYTES;
    let worst_resident = unindexed
        .iter()
        .chain(indexed.iter())
        .flat_map(|p| p.peak_resident.iter().copied())
        .max()
        .unwrap_or(0) as usize;

    let canary_minima = [
        canary_start.long_min(),
        canary_mid.long_min(),
        canary_end.long_min(),
        canary_settled.long_min(),
    ];
    let canary_all: Vec<f64> = [&canary_start, &canary_mid, &canary_end, &canary_settled]
        .iter()
        .flat_map(|c| c.long.iter().copied())
        .collect();
    let spread = |v: &[f64]| {
        let s = sorted(v);
        (s[s.len() - 1] - s[0]) / s[0]
    };
    let canary_spread_minima = spread(&canary_minima);
    let canary_spread_all = spread(&canary_all);

    let mut misses: Vec<String> = Vec::new();
    if pct(&mid_sorted, 0.95) >= 100.0 {
        misses.push(format!("mid-stream cancel p95 {:.3} ms >= 100 ms", pct(&mid_sorted, 0.95)));
    }
    if pct(&early_sorted, 0.95) >= 100.0 {
        misses.push(format!("cancel-before-first p95 {:.3} ms >= 100 ms", pct(&early_sorted, 0.95)));
    }
    if !ident_latency.is_empty() && pct(&sorted(&ident_latency), 0.95) >= 100.0 {
        misses.push(format!(
            "identity-scan cancel p95 {:.3} ms >= 100 ms",
            pct(&sorted(&ident_latency), 0.95)
        ));
    }
    if !idx_latency.is_empty() && pct(&sorted(&idx_latency), 0.95) >= 100.0 {
        misses.push(format!(
            "index-build cancel p95 {:.3} ms >= 100 ms",
            pct(&sorted(&idx_latency), 0.95)
        ));
    }
    if !scan_latency.is_empty() && pct(&sorted(&scan_latency), 0.95) >= 100.0 {
        misses.push(format!(
            "duckdb-scan-phase cancel p95 {:.3} ms >= 100 ms",
            pct(&sorted(&scan_latency), 0.95)
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
    if canary_spread_minima > 0.10 {
        misses.push(format!(
            "canary spread across the four minima {:.1}% exceeded the declared 10% invalidator",
            canary_spread_minima * 100.0
        ));
    }

    let art = format!(
        r#"{{
  "kind": "docs/08 index-in-path measurement — engine cut pieces 1-4a",
  "harness": "kernel/tests/indexed_budgets.rs",
  "command": "cargo test --release -p spatial-kernel --test indexed_budgets -- --ignored --nocapture",
  "preregistration": "kernel/PROBE-PREREGISTRATION.md, committed before this harness was written and before any result of this pass was looked at",
  "verdict_note": "{verdict}",
  "build_profile": {{ "profile": "release", "debug_assertions": {debug_assertions}, "note": "built with CARGO_PROFILE_RELEASE_DEBUG=false; debug info does not affect codegen and debug_assertions is off either way" }},
  "hardware_profile": "{hardware}",
  "free_disk_bytes": {{ "before": {free_before}, "after": {free_after} }},
  "comparison_scope": "within-session only. The unindexed baseline in this artifact was re-measured in THIS session from THIS binary; no figure here is compared with any number from any earlier session, including the ones already in kernel/RESULTS.md.",
  "throughput_claim": "none. Byte totals and durations are recorded separately and deliberately not divided; nothing here cites ADR-012.",
  "clock_note": "both ends run in this process, so producer-side and client-side instants are the same clock: no clock-relation bound is needed and none is claimed. Cancellation observations are stamped inside the thread doing the work, never after a handoff.",
  "order_note": "the index cache is process-wide and keyed by path, so the unindexed phase ran before any index existed in this process and cannot be re-run afterwards without a fresh process",
  "canary": {{
    "instrument": "fixed transport-insensitive integer loop; touches no socket and no database",
    "estimator": "min of 3 at each of four points",
    "long_iterations": {canary_long_iters},
    "spread_across_four_minima": {canary_spread_minima:.4},
    "spread_across_all_raw_long_readings": {canary_spread_all:.4},
    "declared_threshold": 0.10,
    "points": [{canary_start}, {canary_mid}, {canary_end}, {canary_settled}]
  }},
  "dataset_class": {{
    "docs_08_row": "Polygons — 100k features / 10M vertices",
    "features": {features}, "vertices": {vertices}, "rings": {rings}, "file_bytes": {file_bytes},
    "vertices_per_feature": "{vmin}..{vmax}",
    "seed": "0x5EED205600000002 (FixtureSpec default)",
    "second_copy_for_index_cancellation": "byte-identical; used only so a cancelled build cannot disturb the cache entry the query phases use"
  }},
  "dataset_open": {{
    "note": "NOT docs/08's 5 GB cold-open row: nothing purges the Windows file cache and this file is 1/34th of that size. This figure now INCLUDES ADR-016's identity uniqueness scan, which reads a whole column, so it is a different quantity from the same row in the earlier harness.",
    "file_bytes": {file_bytes},
    "samples_ms": {open_samples},
    "samples_ms_fresh_connections": {open_samples_fresh},
    "what_this_cut_added_to_open": "one trivial drained statement (SELECT 1) before the connection open already created is handed to the pool. No connection is created that was not created before: open used one configured connection for parquet_kv_metadata, the schema probe and the identity scan, and it now returns that same one instead of dropping it. Both connection configurations are timed because the difference between them is whether the connection is KEPT, not whether it is made.",
    "this_is_not_a_before_after": "these are absolute figures in THIS session. The 26.7-39.9 ms in the previous RESULTS.md section came from another session and is not a baseline for them; the preregistration forbids between-session comparison."
  }},
  "index": {{
    "build_cost_and_query_benefit": "separate quantities, never netted into 'pays for itself after N queries'",
    "on_the_measured_file": {{
      "content_hash_millis": {a_hash:.3},
      "build_millis": {a_build:.3},
      "wall_millis_including_both": {a_wall:.3},
      "indexed_features": {a_features},
      "scanned_rows": {a_scanned},
      "declared_memory_bytes": {a_mem},
      "declared_memory_expression": "features x 48 B (id + bbox + one grid slot), PER DATASET and NOT per stream — it must not be multiplied by MAX_CONCURRENT_STREAMS",
      "miss_reason_on_first_build": "{a_miss}"
    }},
    "reuse_of_a_cached_index": {{
      "note": "the content hash is re-read on every call, so a cache hit still costs a whole-file SHA-256; only the scan and the grid are skipped",
      "wall_ms_per_reuse": {reuse_wall},
      "content_hash_ms_per_reuse": {reuse_hash},
      "build_ms_per_reuse": {reuse_build}
    }}
  }},
  "cancellation": {{
    "budget": "docs/08 — cancellation acknowledged < 100 ms, any operation",
    "measured": "producer-side, stamped inside the thread doing the work at the moment it has observed the cancel; minus the canceller's Instant immediately before it issued the cancel",
    "index_in_path": "yes for the two stream cases: they run the quarter-extent viewport against a built index (a whole-file query never reaches the index at all)",
    "mid_stream": {{ "trials": {trials}, "summary": {mid_summary}, "batches_generated_after_cancel": {mid_after} }},
    "before_first_batch": {{ "trials": {trials}, "note": "no credit granted, so nothing was ever delivered; the query is running when CANCEL arrives", "summary": {early_summary}, "batches_generated_after_cancel": {early_after} }},
    "during_index_build": {{
      "note": "delay ladder in ms, ascending; the ladder stops at the first trial that completes because a completed build populates the cache and later trials would time a cache hit under the same name",
      "delays_ms": {idx_delays},
      "ladder_stopped_at_delay_ms": {idx_stop},
      "summary": {idx_summary},
      "phase_attribution": "delays below the content-hash time landed in the SHA-256 pass; delays above it landed in the DuckDB covering-bbox scan. The split for this file is in index.on_the_measured_file above (measured on the second copy: hash {b_hash:.1} ms, build {b_build:.1} ms)."
    }},
    "inside_the_duckdb_scan_phase": {{
      "note": "The gap the previous pass named and could not close: all twelve of its delays fell inside the 610 ms content hash and the ~30 ms scan was sampled zero times. This ladder does not guess a wall-clock offset — it waits for the build to ANNOUNCE that it has entered the DuckDbScan phase and measures the delay from there. Run on a THIRD copy of the fixture, so a completed build cannot populate the cache the other ladders use.",
      "aiming": "phase-observer signalled; the delay is measured from the announcement of DuckDbScan, not from the start of build_index",
      "observation_instant_unmoved": "the latency below is still stamped INSIDE the thread doing the work, at the moment it observed the cancel. The observer decides only when the cancel is ISSUED, which is the canceller's side and always was.",
      "delays_after_scan_start_ms": {scan_delays},
      "ladder_stopped_at_delay_ms": {scan_stop},
      "summary": {scan_summary},
      "phase_cancellation_was_issued_in": {scan_issued},
      "phase_cancellation_was_observed_in": {scan_observed},
      "trials_where_the_scan_completed_before_the_cancel": {scan_completed},
      "trials_where_the_build_never_reached_the_scan": {scan_never}
    }},
    "during_identity_uniqueness_scan": {{
      "note": "ADR-016's whole-column scan on the open path. Trials in which the cancel arrived after the scan had already finished are counted here and are NOT latency samples.",
      "delays_ms": {ident_delays},
      "summary": {ident_summary},
      "trials_where_the_open_completed_first": {ident_completed},
      "trials_with_an_unexpected_error": {ident_other}
    }}
  }},
  "selectivity": {{
    "note": "time to first batch AND total are both reported at every point. Quoting only 'total fell' would manufacture an improvement: RESULTS.md's non-monotonicity finding is about the FIRST batch, which is the figure the first-pixels budget depends on.",
    "filter_plan_provenance": "observed on an engine-direct stream with identical parameters — the wire carries no plan",
    "what_the_indexed_half_means_after_this_cut": "The product planner no longer consults the index (piece 1), so the rows labelled 'indexed' below describe a dataset with a BUILT BUT UNUSED index. They are EXPECTED to report ScanOnly and to equal the unindexed rows, and that expectation is the check: a difference here would mean the index is still reaching the product path. The index-in-path cost itself is the previous RESULTS.md section's finding and is deliberately NOT re-measured here.",
    "runs_per_point_per_path": {runs},
    "unindexed": [{unindexed}],
    "indexed": [{indexed}]
  }},
  "memory": {{
    "producer_and_consumer_are_one_process": "this figure covers BOTH ends, and in this harness it also covers the index and the fixture writer",
    "baseline_private_commit_bytes": {baseline_private},
    "baseline_working_set_bytes": {baseline_ws},
    "peak_private_commit_bytes": {peak_private},
    "peak_working_set_bytes": {peak_ws},
    "sample_interval_ms": {sample_ms},
    "samples_taken": {mem_samples},
    "producer_resident_counter": {{
      "what": "StreamState::peak_resident_bytes — payload bytes the producer holds. This counter, not an OS reading, is what the bounded-memory claim rests on.",
      "worst_over_every_run": {worst_resident},
      "declared_bound_bytes": {resident_bound},
      "bound_expression": "(MAX_INFLIGHT_BATCHES + 1) x MAX_FRAME_BYTES = ({inflight} + 1) x {frame_bytes}",
      "bound_is_looser_now": "MAX_INFLIGHT_BATCHES counts batches, not bytes, so a window of progressively-sized early batches holds fewer bytes than a window of steady-state ones. A percentage-of-bound figure describes the batch shape it was taken under.",
      "outside_this_counter": "DuckDB's own streaming buffer, and the engine's own queue ((MAX_QUEUED_BATCHES + 1) x MAX_BATCH_BYTES = 12 MiB), neither of which this counter sees"
    }},
    "index_memory": {{
      "declared_bytes": {a_mem},
      "scope": "PER DATASET, not per stream: one index is shared by every stream over that file, so it is added once to the composed process bound and never multiplied by MAX_CONCURRENT_STREAMS"
    }}
  }},
  "explicitly_not_measured": {{
    "cold_open_5gb": "unmeasured. 63.7 GiB RAM with no cache-purge mechanism in this harness, and single-digit GiB free on C:. Both blockers recorded, neither worked around by substituting a smaller file.",
    "frame_time_p50_p95": "excluded: there is no renderer module, and the 2D canvas probe is not one",
    "vram": "excluded: nothing in this slice owns a GPU buffer",
    "cross_platform": "Windows only; macOS and Linux are docs/07's open follow-up",
    "between_session_comparison": "forbidden here: the unindexed baseline is re-measured in this session rather than taken from RESULTS.md"
  }}
}}
"#,
        verdict = if misses.is_empty() {
            "all hard gates met".to_string()
        } else {
            format!("REGRESSION - hard gates missed: {}", misses.join("; "))
        },
        debug_assertions = cfg!(debug_assertions),
        hardware = hardware,
        free_before = free_before.map(|v| v.to_string()).unwrap_or("null".into()),
        free_after = free_after.map(|v| v.to_string()).unwrap_or("null".into()),
        canary_long_iters = CANARY_ITERS_LONG,
        canary_spread_minima = canary_spread_minima,
        canary_spread_all = canary_spread_all,
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
        open_samples = json_f64s(&open_ms),
        open_samples_fresh = json_f64s(&open_ms_fresh),
        a_hash = a_report.content_hash_millis,
        a_build = a_report.build_millis,
        a_wall = a_build_wall_ms,
        a_features = a_report.indexed_features,
        a_scanned = a_report.scanned_rows,
        a_mem = a_report.declared_memory_bytes,
        a_miss = format!("{:?}", a_report.miss),
        reuse_wall = json_f64s(&reuse_reports.iter().map(|r| r.0).collect::<Vec<_>>()),
        reuse_hash = json_f64s(&reuse_reports.iter().map(|r| r.1).collect::<Vec<_>>()),
        reuse_build = json_f64s(&reuse_reports.iter().map(|r| r.2).collect::<Vec<_>>()),
        b_hash = b_report.content_hash_millis,
        b_build = b_report.build_millis,
        trials = CANCEL_TRIALS,
        mid_summary = summary_json("cancel observed, mid-stream", &mid_latency),
        mid_after = json_u64s(&mid_after),
        early_summary = summary_json("cancel observed, before the first batch", &early_latency),
        early_after = json_u64s(&early_after),
        idx_delays = json_u64s(&idx_delays),
        idx_stop = idx_completed_at.map(|v| v.to_string()).unwrap_or("null".into()),
        idx_summary = summary_json("cancel observed, during an index build", &idx_latency),
        scan_delays = json_u64s(&scan_delays),
        scan_stop = scan_stopped_at.map(|v| v.to_string()).unwrap_or("null".into()),
        scan_summary = summary_json("cancel observed, inside the DuckDB scan phase", &scan_latency),
        scan_issued = json_strs(&scan_issued_in),
        scan_observed = json_strs(&scan_observed_in),
        scan_completed = scan_completed_first,
        scan_never = scan_never_started,
        ident_delays = json_u64s(&ident_delays),
        ident_summary = summary_json("cancel observed, during the identity uniqueness scan", &ident_latency),
        ident_completed = ident_completed,
        ident_other = ident_other_error,
        runs = SELECTIVITY_RUNS,
        unindexed = unindexed.iter().map(|p| p.json()).collect::<Vec<_>>().join(",\n    "),
        indexed = indexed.iter().map(|p| p.json()).collect::<Vec<_>>().join(",\n    "),
        baseline_private = baseline_mem.map(|m| m.0.to_string()).unwrap_or("null".into()),
        baseline_ws = baseline_mem.map(|m| m.1.to_string()).unwrap_or("null".into()),
        peak_private = peak_private,
        peak_ws = peak_ws,
        sample_ms = MEMORY_SAMPLE_MS,
        mem_samples = mem_samples,
        worst_resident = worst_resident,
        resident_bound = resident_bound,
        inflight = spatial_data_plane::MAX_INFLIGHT_BATCHES,
        frame_bytes = spatial_data_plane::MAX_FRAME_BYTES,
    );
    let out = evidence_dir().join("indexed-budgets.json");
    std::fs::write(&out, art).expect("write artifact");
    println!("evidence: {}", out.display());

    println!(
        "cancel mid-stream   p50 {:.3} p95 {:.3} · before-first p50 {:.3} p95 {:.3}",
        pct(&mid_sorted, 0.50),
        pct(&mid_sorted, 0.95),
        pct(&early_sorted, 0.50),
        pct(&early_sorted, 0.95)
    );
    if !scan_latency.is_empty() {
        println!(
            "cancel duckdb-scan  p50 {:.3} p95 {:.3} (n={}, {} scans completed first, {} never reached the scan)",
            pct(&sorted(&scan_latency), 0.50),
            pct(&sorted(&scan_latency), 0.95),
            scan_latency.len(),
            scan_completed_first,
            scan_never_started
        );
    } else {
        println!(
            "cancel duckdb-scan  NO SAMPLES ({} completed first, {} never reached the scan)",
            scan_completed_first, scan_never_started
        );
    }
    if !ident_latency.is_empty() {
        println!(
            "cancel identity-scan p50 {:.3} p95 {:.3} (n={}, {} opens completed first)",
            pct(&sorted(&ident_latency), 0.50),
            pct(&sorted(&ident_latency), 0.95),
            ident_latency.len(),
            ident_completed
        );
    }
    if !idx_latency.is_empty() {
        println!(
            "cancel index-build   p50 {:.3} p95 {:.3} (n={})",
            pct(&sorted(&idx_latency), 0.50),
            pct(&sorted(&idx_latency), 0.95),
            idx_latency.len()
        );
    }
    println!("canary spread: minima {:.2}% · all raw {:.2}%", canary_spread_minima * 100.0, canary_spread_all * 100.0);
    if !misses.is_empty() {
        println!("HARD GATES MISSED: {}", misses.join("; "));
    }

    // ---- The hard gates ------------------------------------------------------------------------
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
    assert!(
        canary_spread_minima <= 0.10,
        "INVALIDATED: canary spread across the four minima {:.1}% exceeds the declared 10% threshold; \
         the session moved underneath these numbers and they are not reportable",
        canary_spread_minima * 100.0
    );
}

/// One selectivity point, both paths, `SELECTIVITY_RUNS` each.
async fn measure_point(
    dp: &RunningDataPlane,
    ds: &Dataset,
    label: &str,
    bbox: Option<[f64; 4]>,
    query_for: &dyn Fn(Option<[f64; 4]>) -> ViewportQuery,
) -> Point {
    let q = query_for(bbox);
    let plan = observe_plan(ds, &q);

    let (mut wire_first, mut wire_total, mut peak_resident) = (Vec::new(), Vec::new(), Vec::new());
    let (mut rows, mut batches, mut bytes, mut first_bytes) = (0u64, 0u64, 0u64, 0u64);
    for _ in 0..SELECTIVITY_RUNS {
        let mut c = connect(dp).await;
        let t0 = Instant::now();
        start(&mut c, params(bbox)).await;
        grant(&mut c, 100_000).await;
        let mut col = Collected::default();
        drain(&mut c, &mut col, t0, None).await;
        assert_eq!(col.terminal, Some(wire::TERM_COMPLETED), "{label}: the stream must complete");
        wire_first.push(col.first_batch_ms.expect("a first batch"));
        wire_total.push(col.total_ms);
        rows = col.rows as u64;
        batches = col.batches as u64;
        bytes = col.payload_bytes as u64;
        first_bytes = col.first_batch_bytes as u64;
        peak_resident.push(dp.registry.snapshot().last().expect("stream").peak_resident_bytes() as u64);
        c.close(None).await.ok();
    }

    let (mut engine_first, mut engine_total) = (Vec::new(), Vec::new());
    for _ in 0..SELECTIVITY_RUNS {
        let (f, t, r, _b, _by, _fb) = engine_direct(ds, &q);
        assert_eq!(r, rows, "{label}: engine-direct and wire row counts must agree");
        engine_first.push(f);
        engine_total.push(t);
    }

    Point {
        label: label.to_string(),
        bbox,
        plan,
        rows,
        batches,
        payload_bytes: bytes,
        first_batch_bytes: first_bytes,
        wire_first,
        wire_total,
        engine_first,
        engine_total,
        peak_resident,
    }
}
