//! Data-plane transport bake-off harness — decision evidence for ADR-012.
//!
//! Serves the browser consumer and both candidate data-plane endpoints from one loopback listener
//! on an ephemeral port, so both candidates are measured in the same machine state within one run
//! (the preregistration's §8 makes measuring them in different machine states inadmissible).
//!
//! Not the `protocol` module. See README.md.

mod adapter_http;
mod adapter_ws;
mod corpus;
mod memory;
mod producer;
mod session;
mod transport;
mod wire;

use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use axum::body::Body;
use axum::extract::{ws::WebSocketUpgrade, Path, State};
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use tokio::sync::mpsc;

use producer::{BATCH_COUNT, MAX_INFLIGHT_BATCHES, ROWS_PER_BATCH, TOTAL_ROWS};
use session::Session;
use transport::{Checkpoints, OperationId, StreamState, Terminal};

/// **§18 P2 — `TCP_NODELAY`, actually set and actually recorded.**
///
/// §16.2 declared it "set identically and recorded". It was neither: the listener set no socket
/// options and no artifact field carried the state, while §17 presented itself as the compliance
/// record. It matters beyond bookkeeping — a 32-byte progress write issued immediately after a
/// multi-megabyte batch write, with Nagle live, is the exact shape where delayed-ACK interaction
/// shows up, and under §19.7's N=2 it is a plausible generator of the within-block drift the paired
/// estimator assumes is roughly linear.
///
/// Set on **every accepted connection**, so it applies identically to both candidates — they share
/// one listener. Read back after setting, because a declaration that something was set is worth
/// exactly as much as Phase 2's was.
mod nodelay {
    use std::sync::atomic::{AtomicU64, Ordering};

    pub static VERIFIED: AtomicU64 = AtomicU64::new(0);
    pub static FAILED: AtomicU64 = AtomicU64::new(0);

    /// Sets `TCP_NODELAY` and reads it back. Returns the observed value.
    pub fn apply(stream: &tokio::net::TcpStream) {
        match stream.set_nodelay(true).and_then(|()| stream.nodelay()) {
            Ok(true) => {
                VERIFIED.fetch_add(1, Ordering::Relaxed);
            }
            _ => {
                FAILED.fetch_add(1, Ordering::Relaxed);
            }
        }
    }

    pub fn report() -> serde_json::Value {
        serde_json::json!({
            "requested": true,
            "connectionsVerified": VERIFIED.load(Ordering::Relaxed),
            "connectionsFailed": FAILED.load(Ordering::Relaxed),
        })
    }
}

/// **§19.7 — the declared concurrency ceiling (ADR-010 rule 6).**
///
/// Declared before measuring, and deliberately driven past: the N+1 exercise opens a third stream
/// and requires a *surfaced refusal*, never a silent admit-and-degrade and never a silent queue.
const MAX_CONCURRENT_STREAMS: u64 = 2;

/// Holds one admission slot for the lifetime of a stream. Releasing on `Drop` is what makes the
/// ceiling hold under cancellation and transport failure, not only on the clean path.
struct StreamSlot(Shared);

impl Drop for StreamSlot {
    fn drop(&mut self) {
        self.0.active_streams.fetch_sub(1, Ordering::SeqCst);
    }
}

/// Admission. Returns `None` when the ceiling is already held.
fn try_admit(s: &Shared) -> Option<StreamSlot> {
    let mut cur = s.active_streams.load(Ordering::SeqCst);
    loop {
        if cur >= MAX_CONCURRENT_STREAMS {
            return None;
        }
        match s.active_streams.compare_exchange_weak(
            cur,
            cur + 1,
            Ordering::SeqCst,
            Ordering::SeqCst,
        ) {
            Ok(_) => return Some(StreamSlot(s.clone())),
            Err(actual) => cur = actual,
        }
    }
}

/// The refusal frame for an over-ceiling stream.
///
/// **Deliberately not a new error variant and not a new control frame.** §5 declares the taxonomy
/// `Cancelled | ProducerFailed | TransportFailed | DecodeFailed`; the refusal maps into
/// `TransportFailed` with an opaque `detail`. Minting a variant here would be the data plane
/// acquiring control-plane vocabulary, blurring the docs/02 split inside scaffolding — and admission
/// semantics belong to docs/10's SKP checklist, not to a bake-off harness.
fn admission_refusal_frame() -> Vec<u8> {
    wire::frame(
        wire::TAG_TERMINAL,
        &wire::terminal_payload(
            wire::TERM_TRANSPORT_FAILED,
            &format!("stream admission ceiling: {MAX_CONCURRENT_STREAMS} concurrent streams"),
        ),
    )
}

/// Batches this configuration will actually send.
///
/// §17.8 item 6: Phase 2 handed both adapters Phase 1's `BATCH_COUNT` regardless of configuration,
/// so progress frames announced `total=100` for a 1000-batch stream and the HTTP facts watcher
/// declared `Completed` early at configuration S.
fn total_batches(s: &Shared) -> u64 {
    s.corpus
        .as_ref()
        .map(|c| c.batches.len() as u64)
        .unwrap_or(BATCH_COUNT as u64)
}

/// Everything the producer side observed for one stream. This — not anything the client reports —
/// is the evidence for H2 and H3.
#[derive(Default, serde::Serialize)]
struct ProducerFacts {
    adapter: String,
    operation_id: String,
    stream_id: String,
    batches_generated: u64,
    batches_after_cancel_observed: u64,
    bytes_emitted: u64,
    cancel_observed_nanos_since_t0: Option<u64>,
    /// Per-batch generation cost. H2's cancellation latency is bounded below by this, so it is
    /// reported rather than left implicit — a tight write loop with no real work would flatter the
    /// cancellation figure and make the bake-off produce the wrong answer while looking rigorous.
    generation_cost_us: Vec<u64>,
    /// (elapsed_ms, resident payload bytes) at 50 ms. H3's bounded-memory claim rests on this.
    resident_samples: Vec<(u64, u64)>,
    memory_samples: Vec<(u64, memory::MemorySample)>,
    peak_memory: memory::MemorySample,
    payload_sha256: Option<String>,
    /// Phase 2: digest over decoded logical column values, invariant to batch granularity (§16.7).
    column_sha256: Option<String>,
    /// Measured gaps between memory samples, so the artifact carries the **actual** cadence
    /// rather than the declared one (§16.4).
    sample_gaps_us: Vec<u64>,
    json_frames_on_data_path: u64,
    terminal: Option<Terminal>,
    dangling_checkpoint: Option<String>,
    declared_resident_bound_bytes: u64,
}

struct AppState {
    session: Session,
    t0: Instant,
    web_dir: std::path::PathBuf,
    out_dir: std::path::PathBuf,
    facts: Mutex<HashMap<String, Arc<Mutex<ProducerFacts>>>>,
    /// Live stream state, so `/facts` can answer from the producer's *current* observation instead
    /// of only from the snapshot `finish()` writes. Without this, a cancellation instant that the
    /// producer already holds stays invisible until the adapter's peer-drain completes, and a poll
    /// that gives up first records "the producer never observed the cancel" — a false negative on
    /// the single most important gate.
    states: Mutex<HashMap<String, Arc<StreamState>>>,
    /// Serialized wire size of one batch, measured once at startup.
    ///
    /// H3's bound must be expressed in the same unit the resident counter accumulates. That counter
    /// holds *serialized Arrow IPC* bytes, not column bytes, so deriving the bound from
    /// `ROWS_PER_BATCH * COLUMN_BYTES_PER_ROW` understates it by the IPC framing and makes a
    /// correctly-behaving producer report FAIL. Deterministic for the fixed workload and seed, so
    /// this is still a declared-before-the-run figure.
    batch_wire_bytes: usize,
    /// Phase 2 (§16): the pre-generated immutable corpus. `None` means Phase 1's generate-on-demand
    /// path, which is retained unchanged so the generation-bound phase stays reproducible.
    corpus: Option<Arc<corpus::Corpus>>,
    /// §19.7: streams currently admitted. The ceiling is `MAX_CONCURRENT_STREAMS`.
    active_streams: AtomicU64,
}

type Shared = Arc<AppState>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = std::env::args().collect();
    let flag = |name: &str| -> Option<String> {
        args.iter()
            .position(|a| a == name)
            .and_then(|i| args.get(i + 1))
            .cloned()
    };

    let web_dir = flag("--web-dir")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|| {
            std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("web/dist")
        });
    // Validity gate: reports never land in a watched source tree. Spike M5 lost runs to exactly
    // this — report writes into `src-tauri` retriggered the file watcher and silently reran the
    // whole harness 2-3x per invocation.
    let out_dir = flag("--out-dir")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|| std::env::temp_dir().join("transport-bakeoff"));
    std::fs::create_dir_all(&out_dir)?;

    // docs/09 / H4: loopback only, never 0.0.0.0, and an OS-assigned ephemeral port.
    let bind = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 0);
    let listener = tokio::net::TcpListener::bind(bind).await?;
    let local = listener.local_addr()?;
    assert!(local.ip().is_loopback(), "listener must bind loopback only");
    assert_ne!(local.port(), 0, "port must be OS-assigned and concrete");

    // Phase 2 (§16.2): build the whole corpus BEFORE accepting any connection, so no generation
    // work can land inside a timed interval. One configuration at a time, fully RAM-resident, as
    // §16.3 declares.
    let corpus = if args.iter().any(|a| a == "--phase2") {
        let cfg = flag("--config")
            .and_then(|c| corpus::Config::parse(&c))
            .unwrap_or(corpus::Config::M);
        println!(
            "[bakeoff] phase 2: building corpus for configuration {} ({} rows/batch, {} batches)…",
            cfg.label(),
            cfg.rows_per_batch(),
            cfg.batch_count()
        );
        let c = corpus::Corpus::build(cfg).map_err(|e| format!("corpus: {e}"))?;
        println!(
            "[bakeoff] corpus ready in {} ms: {} wire bytes, max batch {} B",
            c.build_ms, c.total_wire_bytes, c.max_batch_wire_bytes
        );
        println!("[bakeoff]   wire digest   {}", c.wire_digest);
        println!("[bakeoff]   column digest {}", c.column_digest);
        // Touch every byte so page-cache warmth is equal for whichever candidate runs first.
        let warm = c.warm();
        println!("[bakeoff] corpus warmed (checksum accumulator {warm})");
        Some(Arc::new(c))
    } else {
        None
    };

    let state: Shared = Arc::new(AppState {
        session: Session::new(local.port()),
        t0: Instant::now(),
        web_dir,
        out_dir: out_dir.clone(),
        facts: Mutex::new(HashMap::new()),
        states: Mutex::new(HashMap::new()),
        batch_wire_bytes: corpus
            .as_ref()
            .map(|c| c.max_batch_wire_bytes)
            .unwrap_or_else(producer::batch_wire_bytes),
        corpus,
        active_streams: AtomicU64::new(0),
    });

    let app = router(state.clone());

    // The session token is delivered in the URL **fragment**, which is never sent to a server and
    // never appears in a request line. `GET /` therefore serves a document containing no credential
    // at all, so an unauthenticated local process that scans loopback and fetches `/` gets nothing
    // it can use. Handing the token out of the page-serving endpoint would have made every other
    // gate decoration (docs/09).
    let launch_url = format!(
        "http://127.0.0.1:{}/#{}",
        local.port(),
        state.session.token_for_injection()
    );
    let url_file = out_dir.join("launch-url.txt");
    std::fs::write(&url_file, &launch_url)?;

    // The token is never printed. docs/09: credentials are redacted from logs.
    println!("[bakeoff] listening on http://127.0.0.1:{}", local.port());
    println!("[bakeoff] session token: {}", session::REDACTED);
    println!("[bakeoff] open the URL in: {}", url_file.display());
    println!("[bakeoff] reports -> {}", out_dir.display());
    println!(
        "[bakeoff] workload: {} rows / {} batches of {} rows, {} wire bytes/batch",
        TOTAL_ROWS, BATCH_COUNT, ROWS_PER_BATCH, state.batch_wire_bytes
    );

    if args.iter().any(|a| a == "--launch") {
        if launch_browser(&launch_url, &out_dir) {
            // The browser already holds the URL in its argv, so the file has served its purpose.
            // Leaving a cleartext credential on disk next to the reports would move the hole this
            // fragment scheme closed rather than close it (docs/09). On the manual path the file
            // must survive, and that residual is stated in ADR-012's threat model.
            let _ = std::fs::remove_file(&url_file);
            println!("[bakeoff] launch URL file removed after handoff");
        }
    }

    // §18 P2: applied to every accepted connection, so both candidates get identical socket options.
    let listener = axum::serve::ListenerExt::tap_io(listener, |s| nodelay::apply(s));
    axum::serve(listener, app).await?;
    Ok(())
}

/// Opens the page in Edge, whose engine is the WebView2 runtime.
///
/// Uses an **isolated user-data directory** rather than the operator's default profile: any
/// installed extension holding `127.0.0.1` host permissions could otherwise read the session token
/// off the page. A launch failure is reported rather than silently discarded.
fn launch_browser(url: &str, out_dir: &std::path::Path) -> bool {
    let profile = out_dir.join("edge-profile");
    let mut candidates: Vec<std::path::PathBuf> = vec![
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe".into(),
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe".into(),
    ];
    // Newer installs use a split EdgeCore layout with a version-numbered directory and no `msedge`
    // on PATH or in App Paths — which is why `cmd /C start msedge` fails on this reference machine
    // with "The system cannot find the file msedge". Enumerate those too rather than assuming the
    // classic layout.
    for root in [
        r"C:\Program Files (x86)\Microsoft\EdgeCore",
        r"C:\Program Files\Microsoft\EdgeCore",
    ] {
        if let Ok(entries) = std::fs::read_dir(root) {
            let mut versioned: Vec<_> = entries
                .flatten()
                .map(|e| e.path().join("msedge.exe"))
                .filter(|p| p.exists())
                .collect();
            versioned.sort();
            candidates.extend(versioned.into_iter().rev()); // newest version first
        }
    }
    for exe in &candidates {
        if !exe.exists() {
            continue;
        }
        match std::process::Command::new(exe)
            .arg(format!("--user-data-dir={}", profile.display()))
            .arg("--new-window")
            .arg("--start-maximized")
            .arg("--no-first-run")
            .arg(url)
            .spawn()
        {
            Ok(_) => {
                println!("[bakeoff] launched {} with an isolated profile", exe.display());
                println!("[bakeoff] KEEP THE WINDOW VISIBLE AND FOCUSED for the whole run");
                return true;
            }
            // A failed launch is reported, never discarded: an earlier revision swallowed the
            // error and left the harness waiting forever with nothing on screen to explain why.
            Err(e) => println!("[bakeoff] launch failed ({}): {e}", exe.display()),
        }
    }
    println!(
        "[bakeoff] could not locate msedge.exe — open the URL in {} manually, \
         in a VISIBLE, FOCUSED window",
        out_dir.join("launch-url.txt").display()
    );
    false
}

fn router(state: Shared) -> Router {
    Router::new()
        .route("/", get(serve_index))
        .route("/app.js", get(serve_js))
        .route("/clock", get(clock))
        .route("/stream/ws", get(stream_ws))
        .route("/stream/http", get(stream_http))
        .route("/manifest", get(manifest))
        .route("/facts/{stream_id}", get(facts))
        .route("/report", post(write_report))
        .with_state(state)
}

// ---------------------------------------------------------------------------------------------
// Static serving.
//
// **This endpoint serves no credential.** The session token reaches the page through the URL
// fragment, which browsers never transmit — so it appears in no request line, no access log, and no
// response body. An earlier revision injected it into the document, which meant any unauthenticated
// local process could `GET /` and read it straight out of the HTML, making the token gate on every
// other endpoint decorative. In production this delivery is the Tauri IPC control plane; the
// fragment stands in for it here (docs/09).
//
// `X-Content-Type-Options: nosniff` below is load-bearing, not boilerplate: without it a foreign
// page can point a `<script src>` at this endpoint and have the browser execute the response.
// ---------------------------------------------------------------------------------------------

async fn serve_index(State(s): State<Shared>) -> Response {
    let path = s.web_dir.join("index.html");
    match std::fs::read_to_string(&path) {
        Ok(html) => (
            [
                (header::CONTENT_TYPE, "text/html; charset=utf-8"),
                (header::CACHE_CONTROL, "no-store"),
                (header::X_CONTENT_TYPE_OPTIONS, "nosniff"),
            ],
            html,
        )
            .into_response(),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("consumer bundle missing at {}: {e}. Run `npm run build` in protocol/transport-bakeoff/web.", path.display()),
        )
            .into_response(),
    }
}

async fn serve_js(State(s): State<Shared>) -> Response {
    match std::fs::read(s.web_dir.join("app.js")) {
        Ok(js) => (
            [
                (header::CONTENT_TYPE, "text/javascript; charset=utf-8"),
                (header::CACHE_CONTROL, "no-store"),
                (header::X_CONTENT_TYPE_OPTIONS, "nosniff"),
            ],
            js,
        )
            .into_response(),
        Err(e) => (StatusCode::NOT_FOUND, format!("app.js: {e}")).into_response(),
    }
}

// ---------------------------------------------------------------------------------------------
// Auth (H4). Every data and control endpoint goes through this.
// ---------------------------------------------------------------------------------------------

fn bearer(headers: &HeaderMap) -> Option<&str> {
    headers
        .get(header::AUTHORIZATION)?
        .to_str()
        .ok()?
        .strip_prefix("Bearer ")
}

fn check(s: &Shared, headers: &HeaderMap, token: Option<&str>) -> Result<(), Response> {
    let origin = headers.get(header::ORIGIN).and_then(|v| v.to_str().ok());
    let sec_fetch_site = headers.get("sec-fetch-site").and_then(|v| v.to_str().ok());
    if !s.session.request_allowed(origin, sec_fetch_site) {
        return Err((StatusCode::FORBIDDEN, "origin rejected").into_response());
    }
    match token {
        Some(t) if s.session.token_matches(t) => Ok(()),
        _ => Err((StatusCode::UNAUTHORIZED, "authentication required").into_response()),
    }
}

async fn clock(State(s): State<Shared>, headers: HeaderMap) -> Response {
    if let Err(r) = check(&s, &headers, bearer(&headers)) {
        return r;
    }
    Json(serde_json::json!({
        "serverNanosSinceT0": s.t0.elapsed().as_nanos() as u64,
        // §8 makes "a debug build measured as release" inadmissible, but nothing recorded the build
        // profile, so the invalidator had no mechanism behind it. Now the consumer can check.
        "debugAssertions": cfg!(debug_assertions),
        "batchWireBytes": s.batch_wire_bytes,
        // §18 P2 / §19.8: absent or unequal `TCP_NODELAY` state is a Phase-3 invalidator, so the
        // consumer must be able to read it and put it in the artifact.
        "tcpNoDelay": nodelay::report(),
    }))
    .into_response()
}

/// The corpus manifest, so the consumer **verifies** corpus identity rather than assuming both
/// candidates received the same bytes (§16.2). Control plane — JSON here is ADR-004-legal.
async fn manifest(State(s): State<Shared>, headers: HeaderMap) -> Response {
    if let Err(r) = check(&s, &headers, bearer(&headers)) {
        return r;
    }
    match &s.corpus {
        // §18 P8: Phase 2's `creditWindowBytes` carried (4+1)x batch — the *producer-resident*
        // bound, not the credit window, and §16.3's credit-window figure appeared in no artifact
        // under its own name. Both are now emitted, each holding what its name says.
        Some(c) => Json(serde_json::json!({
            "phase": 2,
            "corpus": c.manifest(),
            "maxInflightBatches": MAX_INFLIGHT_BATCHES,
            "creditWindowBytes": MAX_INFLIGHT_BATCHES * c.max_batch_wire_bytes,
            "producerResidentBoundBytes": (MAX_INFLIGHT_BATCHES + 1) * c.max_batch_wire_bytes,
            "tcpNoDelay": nodelay::report(),
        }))
        .into_response(),
        None => Json(serde_json::json!({ "phase": 1, "corpus": serde_json::Value::Null }))
            .into_response(),
    }
}

async fn facts(State(s): State<Shared>, headers: HeaderMap, Path(id): Path<String>) -> Response {
    if let Err(r) = check(&s, &headers, bearer(&headers)) {
        return r;
    }
    let entry = s.facts.lock().unwrap_or_else(|e| e.into_inner()).get(&id).cloned();
    let live = s.states.lock().unwrap_or_else(|e| e.into_inner()).get(&id).cloned();
    match entry {
        Some(f) => {
            let guard = f.lock().unwrap_or_else(|e| e.into_inner());
            let mut v = serde_json::to_value(&*guard).unwrap();
            // Answer from the producer's *current* observation, not only from the snapshot
            // `finish()` writes. `finish()` runs after the adapter's peer-drain, so a poller that
            // gives up first would record "the producer never observed the cancel" when in fact
            // the instant was already held — a false negative on H2, the gate that matters most.
            if let Some(st) = live {
                if let Some(at) = st.observed_at() {
                    v["cancel_observed_nanos_since_t0"] = serde_json::json!(
                        at.saturating_duration_since(s.t0).as_nanos() as u64
                    );
                }
                v["batches_generated"] = serde_json::json!(st.batches_generated());
                v["batches_after_cancel_observed"] =
                    serde_json::json!(st.batches_after_cancel());
                v["bytes_emitted"] = serde_json::json!(st.bytes_emitted());
            }
            Json(v).into_response()
        }
        None => (StatusCode::NOT_FOUND, "unknown stream").into_response(),
    }
}

async fn write_report(
    State(s): State<Shared>,
    headers: HeaderMap,
    body: String,
) -> Response {
    if let Err(r) = check(&s, &headers, bearer(&headers)) {
        return r;
    }
    // H4: the token must appear in no artifact. Redact defensively, then assert.
    let redacted = s.session.redact(&body);
    if s.session.leaks_into(&redacted) {
        return (StatusCode::INTERNAL_SERVER_ERROR, "credential redaction failed").into_response();
    }
    let stamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    let path = s.out_dir.join(format!("bakeoff-report-{stamp}.json"));
    match std::fs::write(&path, redacted.as_bytes()) {
        Ok(()) => {
            println!("[bakeoff] report written: {}", path.display());
            Json(serde_json::json!({ "written": path.to_string_lossy() })).into_response()
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, format!("write: {e}")).into_response(),
    }
}

// ---------------------------------------------------------------------------------------------
// Producer task — shared by both candidates, so the producer schedule is identical by construction.
// ---------------------------------------------------------------------------------------------

fn start_stream(
    s: &Shared,
    adapter: &str,
) -> (
    mpsc::Receiver<bytes::Bytes>,
    Arc<StreamState>,
    Arc<Checkpoints>,
    Arc<Mutex<ProducerFacts>>,
    Arc<AtomicU64>,
    OperationId,
) {
    let operation = OperationId::new();
    let stream_id = transport::StreamId::new();
    let state = StreamState::new(stream_id.clone());
    let checkpoints = Arc::new(Checkpoints::default());
    let json_seen = Arc::new(AtomicU64::new(0));

    // Stated in the same unit the resident counter accumulates: serialized wire bytes, not column
    // bytes. At most MAX_INFLIGHT_BATCHES queued plus one in the adapter's hand.
    let batch_bytes_bound = (MAX_INFLIGHT_BATCHES as u64 + 1) * s.batch_wire_bytes as u64;

    let facts = Arc::new(Mutex::new(ProducerFacts {
        adapter: adapter.to_string(),
        operation_id: operation.as_str().to_string(),
        stream_id: stream_id.as_str().to_string(),
        declared_resident_bound_bytes: batch_bytes_bound,
        ..Default::default()
    }));
    s.facts
        .lock()
        .unwrap()
        .insert(stream_id.as_str().to_string(), facts.clone());
    s.states
        .lock()
        .unwrap()
        .insert(stream_id.as_str().to_string(), state.clone());

    // Bounded channel = the memory bound. The producer cannot get ahead of it (H3).
    let (tx, rx) = mpsc::channel::<bytes::Bytes>(MAX_INFLIGHT_BATCHES);

    // ---- Phase 2 (§16.2): feed pre-built immutable slices. No generation, no serialization, no
    // payload-sized allocation — a `Bytes` clone is a refcount bump. Both adapters receive the
    // identical slices, which is what makes the comparison a transport comparison.
    if let Some(c) = s.corpus.clone() {
        let (p_state, p_cps, p_facts) = (state.clone(), checkpoints.clone(), facts.clone());
        tokio::spawn(async move {
            p_cps.begin("produce");
            for b in c.batches.iter() {
                if p_state.is_cancelled() {
                    break;
                }
                let permit = match tx.reserve().await {
                    Ok(p) => p,
                    Err(_) => break,
                };
                if p_state.is_cancelled() {
                    break;
                }
                p_state.note_generated(b.len());
                // Refcount bump, not a copy — this is the symmetry rule both adapters rely on.
                permit.send(b.clone());
            }
            p_cps.end("produce");
            let mut f = p_facts.lock().unwrap_or_else(|e| e.into_inner());
            f.payload_sha256 = Some(c.wire_digest.clone());
            f.column_sha256 = Some(c.column_digest.clone());
            f.batches_generated = p_state.batches_generated();
            f.batches_after_cancel_observed = p_state.batches_after_cancel();
        });
        start_sampler(s, state.clone(), facts.clone());
        return (rx, state, checkpoints, facts, json_seen, operation);
    }

    {
        let state = state.clone();
        let checkpoints = checkpoints.clone();
        let facts = facts.clone();
        // Generation is CPU-bound (~ms/batch), so it runs on a blocking thread rather than a
        // runtime worker — otherwise the producer would stall the very I/O it is feeding.
        let handle = tokio::runtime::Handle::current();
        tokio::task::spawn_blocking(move || {
            let mut gen = producer::Generator::new();
            checkpoints.begin("produce");
            for _ in 0..BATCH_COUNT {
                if state.is_cancelled() {
                    break;
                }
                // Reserve capacity *before* generating, so a batch is never built into an
                // already-full queue. This is what makes the resident bound hold: at most
                // MAX_INFLIGHT_BATCHES queued plus the one under construction.
                let permit = match handle.block_on(tx.reserve()) {
                    Ok(p) => p,
                    Err(_) => break,
                };
                if state.is_cancelled() {
                    break;
                }
                let t = Instant::now();
                match gen.next_batch() {
                    Ok(raw) => {
                        // Phase 1 framed at send time; the channel now carries already-framed
                        // `Bytes` so that Phase 2's pre-framed corpus slices and Phase 1's freshly
                        // generated batches travel the identical adapter path.
                        let framed = bytes::Bytes::from(wire::frame(wire::TAG_BATCH, &raw));
                        let cost = t.elapsed().as_micros() as u64;
                        state.note_generated(framed.len());
                        facts.lock().unwrap_or_else(|e| e.into_inner()).generation_cost_us.push(cost);
                        permit.send(framed);
                    }
                    Err(e) => {
                        facts.lock().unwrap_or_else(|e| e.into_inner()).terminal = Some(Terminal::ProducerFailed(e));
                        break;
                    }
                }
            }
            checkpoints.end("produce");
            let mut f = facts.lock().unwrap_or_else(|e| e.into_inner());
            f.payload_sha256 = Some(gen.finish_hash());
            f.batches_generated = state.batches_generated();
            f.batches_after_cancel_observed = state.batches_after_cancel();
        });
    }

    start_sampler(s, state.clone(), facts.clone());

    (rx, state, checkpoints, facts, json_seen, operation)
}

/// Memory + resident-bytes sampler.
///
/// §16.4 requires the **actual** cadence in the artifact, not the intended one: Phase 1 declared
/// 50 ms and sampled at ~62.6 ms, which was only discoverable because the timestamps were kept.
/// The interval is therefore recorded alongside the samples rather than assumed.
fn start_sampler(s: &Shared, state: Arc<StreamState>, facts: Arc<Mutex<ProducerFacts>>) {
    let t0 = s.t0;
    tokio::spawn(async move {
        let mut tracker = memory::PeakTracker::default();
        let mut last = std::time::Instant::now();
        loop {
            tokio::time::sleep(Duration::from_millis(50)).await;
            let gap = last.elapsed().as_micros() as u64;
            last = std::time::Instant::now();
            let elapsed = t0.elapsed().as_millis() as u64;
            let m = tracker.record(elapsed);
            let resident = state.resident_bytes() as u64;
            let mut f = facts.lock().unwrap_or_else(|e| e.into_inner());
            f.resident_samples.push((elapsed, resident));
            f.memory_samples.push((elapsed, m));
            f.sample_gaps_us.push(gap);
            f.peak_memory = tracker.peak;
            if f.terminal.is_some() || f.resident_samples.len() > 8000 {
                break;
            }
        }
    });
}

fn finish(
    facts: &Arc<Mutex<ProducerFacts>>,
    state: &Arc<StreamState>,
    checkpoints: &Arc<Checkpoints>,
    json_seen: &Arc<AtomicU64>,
    t0: Instant,
    terminal: Terminal,
) {
    let mut f = facts.lock().unwrap_or_else(|e| e.into_inner());
    f.terminal = Some(terminal);
    f.bytes_emitted = state.bytes_emitted();
    f.batches_generated = state.batches_generated();
    f.batches_after_cancel_observed = state.batches_after_cancel();
    f.json_frames_on_data_path = json_seen.load(Ordering::Relaxed);
    f.dangling_checkpoint = checkpoints.dangling();
    f.cancel_observed_nanos_since_t0 = state
        .observed_at()
        .map(|i| i.saturating_duration_since(t0).as_nanos() as u64);
}

// ---------------------------------------------------------------------------------------------
// Candidate A — binary WebSocket
// ---------------------------------------------------------------------------------------------

async fn stream_ws(State(s): State<Shared>, headers: HeaderMap, ws: WebSocketUpgrade) -> Response {
    // The token rides in the subprotocol list, validated at handshake before the upgrade
    // completes, so an unauthenticated peer never reaches the data path.
    let protos: Vec<String> = headers
        .get("sec-websocket-protocol")
        .and_then(|v| v.to_str().ok())
        .map(|v| v.split(',').map(|p| p.trim().to_string()).collect())
        .unwrap_or_default();
    let presented = protos.iter().find(|p| p.as_str() != "bakeoff.v0");
    if let Err(r) = check(&s, &headers, presented.map(|x| x.as_str())) {
        return r;
    }

    // §19.7's ceiling, enforced before any producer work is started.
    let Some(slot) = try_admit(&s) else {
        return ws.protocols(["bakeoff.v0"]).on_upgrade(|mut socket| async move {
            let _ = socket
                .send(axum::extract::ws::Message::Binary(admission_refusal_frame().into()))
                .await;
        });
    };

    let total = total_batches(&s);
    let (rx, state, checkpoints, facts, json_seen, operation) = start_stream(&s, "websocket");
    let stream_id = state.stream.clone();
    let t0 = s.t0;

    ws.protocols(["bakeoff.v0"]).on_upgrade(move |mut socket| async move {
        // Held for the stream's whole lifetime; released on drop, including on the failure paths.
        let _slot = slot;
        // Ids travel in band as opaque UTF-8 — never a URL segment or a header (H6).
        let open = wire::frame(
            wire::TAG_OPEN,
            format!("{} {}", operation.as_str(), stream_id.as_str()).as_bytes(),
        );
        if socket
            .send(axum::extract::ws::Message::Binary(open.into()))
            .await
            .is_err()
        {
            finish(&facts, &state, &checkpoints, &json_seen, t0,
                   Terminal::TransportFailed("open frame".into()));
            return;
        }
        let terminal = adapter_ws::drive(
            socket,
            rx,
            state.clone(),
            checkpoints.clone(),
            total,
            json_seen.clone(),
        )
        .await;
        finish(&facts, &state, &checkpoints, &json_seen, t0, terminal);
    })
}

// ---------------------------------------------------------------------------------------------
// Candidate B — loopback HTTP streaming response
// ---------------------------------------------------------------------------------------------

async fn stream_http(State(s): State<Shared>, headers: HeaderMap) -> Response {
    if let Err(r) = check(&s, &headers, bearer(&headers)) {
        return r;
    }
    // §19.7's ceiling. Refused in the declared taxonomy, as a frame the shared decoder already
    // understands, so the refusal is symmetric with Candidate A's rather than an HTTP status the
    // other candidate has no analogue for.
    let Some(slot) = try_admit(&s) else {
        return Body::from(admission_refusal_frame()).into_response();
    };

    let total = total_batches(&s);
    let (rx, state, checkpoints, facts, json_seen, operation) = start_stream(&s, "http-stream");
    let stream_id = state.stream.clone();
    let t0 = s.t0;

    let open = wire::frame(
        wire::TAG_OPEN,
        format!("{} {}", operation.as_str(), stream_id.as_str()).as_bytes(),
    );

    let body_stream = adapter_http::BodyStream::new(
        rx,
        state.clone(),
        checkpoints.clone(),
        total,
        json_seen.clone(),
    );

    // Once the body is fully consumed or dropped, record the producer-side facts.
    let watch_state = state.clone();
    let watch_facts = facts.clone();
    let watch_cp = checkpoints.clone();
    let watch_json = json_seen.clone();
    tokio::spawn(async move {
        // The admission slot lives exactly as long as the stream does. This task runs until the
        // stream completes or is cancelled, so moving the slot in releases the ceiling on both
        // paths; holding it in `stream_http`'s frame would release it the instant the response
        // headers were returned, and the ceiling would not bind at all.
        let _slot = slot;
        loop {
            tokio::time::sleep(Duration::from_millis(25)).await;
            if watch_state.is_cancelled() {
                finish(&watch_facts, &watch_state, &watch_cp, &watch_json, t0,
                       Terminal::Cancelled("connection closed".into()));
                break;
            }
            if watch_state.batches_generated() >= total
                && watch_state.resident_bytes() == 0
            {
                finish(&watch_facts, &watch_state, &watch_cp, &watch_json, t0,
                       Terminal::Completed);
                break;
            }
        }
    });

    let prefix = futures::stream::once(async move { Ok::<_, std::io::Error>(bytes::Bytes::from(open)) });
    let combined = futures::StreamExt::chain(prefix, body_stream);

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/octet-stream")
        .header(header::CACHE_CONTROL, "no-store")
        .header(header::X_CONTENT_TYPE_OPTIONS, "nosniff")
        .body(Body::from_stream(combined))
        .unwrap()
}

// ---------------------------------------------------------------------------------------------
// H4 — security negative tests, run against a live server.
//
// These matter more than the unit tests on `Session`: a correct predicate that is never called, or
// is called after the data path has already opened, is security theatre. These drive the real
// router over a real socket. `/clock` is the probe deliberately — it is authenticated by the same
// `check()` as the data endpoints but returns immediately, so a passing negative test cannot be
// confused with a 240 MB stream that merely failed early.
// ---------------------------------------------------------------------------------------------
#[cfg(test)]
mod security_tests {
    use super::*;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use tokio::net::TcpStream;

    /// The served document must contain **no credential**. This is a regression test for a real
    /// hole: `/` was the one route that never called `check()`, and it injected the session token
    /// into the HTML — so any unauthenticated local process could `GET /`, read the token, and use
    /// it on the data endpoints, making every other gate decoration (docs/09).
    #[tokio::test]
    async fn the_served_document_contains_no_credential() {
        let web = std::env::temp_dir().join(format!("bakeoff-web-{}", std::process::id()));
        std::fs::create_dir_all(&web).unwrap();
        // Includes the old placeholder, so a reintroduced substitution would be caught rather than
        // passing because the marker happens to be absent.
        std::fs::write(
            web.join("index.html"),
            "<!doctype html><html><body>__SESSION_TOKEN__</body></html>",
        )
        .unwrap();

        let (port, token, _) = spawn_server_with(Some(web.clone())).await;

        let mut s = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
        s.write_all(
            format!("GET / HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\n\r\n")
                .as_bytes(),
        )
        .await
        .unwrap();
        let mut body = Vec::new();
        s.read_to_end(&mut body).await.unwrap();
        let body = String::from_utf8_lossy(&body);

        assert!(body.contains("200 OK"), "the page must still be served");
        assert!(
            !body.contains(&token),
            "the served document must not contain the session token"
        );
        let _ = std::fs::remove_dir_all(&web);
    }

    async fn spawn_server() -> (u16, String) {
        let (p, t, _) = spawn_server_with(None).await;
        (p, t)
    }

    /// Returns the live `Shared` state too, so a test can inspect what the **producer** observed
    /// rather than inferring it from client-side behaviour.
    async fn spawn_server_with(
        web_dir: Option<std::path::PathBuf>,
    ) -> (u16, String, Shared) {
        let listener = tokio::net::TcpListener::bind(SocketAddr::new(
            IpAddr::V4(Ipv4Addr::LOCALHOST),
            0,
        ))
        .await
        .unwrap();
        let local = listener.local_addr().unwrap();
        assert!(local.ip().is_loopback(), "must never bind a routable address");
        let state: Shared = Arc::new(AppState {
            session: Session::new(local.port()),
            t0: Instant::now(),
            web_dir: web_dir.unwrap_or_else(|| std::path::PathBuf::from(".")),
            out_dir: std::env::temp_dir().join("transport-bakeoff-test"),
            facts: Mutex::new(HashMap::new()),
            states: Mutex::new(HashMap::new()),
            batch_wire_bytes: producer::batch_wire_bytes(),
            corpus: None,
            active_streams: AtomicU64::new(0),
        });
        let token = state.session.token_for_injection().to_string();
        let app = router(state.clone());
        tokio::spawn(async move {
            // Same socket-option path as production (§18 P2), so the tests exercise what runs.
            let listener = axum::serve::ListenerExt::tap_io(listener, |s| nodelay::apply(s));
            let _ = axum::serve(listener, app).await;
        });
        (local.port(), token, state)
    }

    /// **§18 P2.** Phase 2 declared `TCP_NODELAY` "set identically and recorded" while setting
    /// nothing. A declaration is worth what Phase 2's was unless something checks it, so this reads
    /// the option back off the accepted socket rather than trusting `set_nodelay`'s return.
    #[tokio::test]
    async fn tcp_nodelay_is_set_on_accepted_connections_and_recorded() {
        let before = nodelay::VERIFIED.load(Ordering::Relaxed);
        let (port, token) = spawn_server().await;
        let origin = format!("http://127.0.0.1:{port}");
        assert_eq!(probe(port, Some(&origin), Some(&token)).await, 200);

        assert!(
            nodelay::VERIFIED.load(Ordering::Relaxed) > before,
            "no accepted connection had TCP_NODELAY verified — the tap is not wired in"
        );
        assert_eq!(
            nodelay::FAILED.load(Ordering::Relaxed),
            0,
            "TCP_NODELAY failed to apply on at least one connection"
        );
    }

    /// Returns the numeric HTTP status of a `GET /clock`.
    async fn probe(port: u16, origin: Option<&str>, auth: Option<&str>) -> u16 {
        probe_full(port, origin, auth, None).await
    }

    async fn probe_full(
        port: u16,
        origin: Option<&str>,
        auth: Option<&str>,
        sec_fetch_site: Option<&str>,
    ) -> u16 {
        let mut s = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
        let mut req = format!(
            "GET /clock HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\n"
        );
        if let Some(o) = origin {
            req.push_str(&format!("Origin: {o}\r\n"));
        }
        if let Some(f) = sec_fetch_site {
            req.push_str(&format!("Sec-Fetch-Site: {f}\r\n"));
        }
        if let Some(a) = auth {
            req.push_str(&format!("Authorization: Bearer {a}\r\n"));
        }
        req.push_str("\r\n");
        s.write_all(req.as_bytes()).await.unwrap();
        let mut buf = vec![0u8; 256];
        let n = s.read(&mut buf).await.unwrap();
        let head = String::from_utf8_lossy(&buf[..n]).to_string();
        head.split_whitespace()
            .nth(1)
            .and_then(|c| c.parse().ok())
            .unwrap_or(0)
    }

    #[tokio::test]
    async fn authenticated_same_origin_request_succeeds() {
        // Positive control. Without it, all four negative tests below could pass because the
        // endpoint is simply broken.
        let (port, token) = spawn_server().await;
        let origin = format!("http://127.0.0.1:{port}");
        assert_eq!(probe(port, Some(&origin), Some(&token)).await, 200);
    }

    #[tokio::test]
    async fn unauthenticated_request_is_rejected() {
        let (port, _token) = spawn_server().await;
        let origin = format!("http://127.0.0.1:{port}");
        assert_eq!(probe(port, Some(&origin), None).await, 401);
    }

    #[tokio::test]
    async fn wrong_token_is_rejected() {
        let (port, _token) = spawn_server().await;
        let origin = format!("http://127.0.0.1:{port}");
        let wrong = "0".repeat(64);
        assert_eq!(probe(port, Some(&origin), Some(&wrong)).await, 401);
    }

    #[tokio::test]
    async fn foreign_origin_is_rejected_even_with_a_valid_token() {
        let (port, token) = spawn_server().await;
        assert_eq!(
            probe(port, Some("http://evil.example"), Some(&token)).await,
            403
        );
        // localhost is a *different* origin from 127.0.0.1 and must not be waved through.
        let lh = format!("http://localhost:{port}");
        assert_eq!(probe(port, Some(&lh), Some(&token)).await, 403);
    }

    #[tokio::test]
    async fn null_and_bare_absent_origin_are_rejected_explicitly() {
        // The WebView2 failure mode: an opaque origin serializes as the literal string `null`,
        // and an origin check written as "reject only known-bad" waves it through.
        let (port, token) = spawn_server().await;
        assert_eq!(probe(port, Some("null"), Some(&token)).await, 403);
        // No Origin AND no same-origin fetch-metadata signal: rejected.
        assert_eq!(probe(port, None, Some(&token)).await, 403);
        // A forged fetch-metadata claim cannot rescue a stated foreign origin.
        assert_eq!(
            probe_full(port, Some("http://evil.example"), Some(&token), Some("same-origin")).await,
            403
        );
        // Cross-site fetch metadata with no Origin: still rejected.
        assert_eq!(
            probe_full(port, None, Some(&token), Some("cross-site")).await,
            403
        );
    }

    /// **Candidate A must deliver every batch and a terminal frame.**
    ///
    /// This exists because the first smoke run showed the producer emitting all 100 batches
    /// (243,834,400 bytes, terminal Completed) while the browser consumer saw only 98 and no
    /// terminal — a silent truncation. Guessing at it through a browser was slow and inconclusive,
    /// so delivery is now pinned down here, with no browser in the loop.
    ///
    /// Uses a reduced batch count via the same code path; the assertion is on *completeness*, not
    /// throughput.
    #[tokio::test]
    async fn websocket_delivers_every_batch_and_a_terminal_frame() {
        use futures_util::{SinkExt, StreamExt};
        use tokio_tungstenite::tungstenite::client::IntoClientRequest;
        use tokio_tungstenite::tungstenite::Message as TMessage;

        let (port, token) = spawn_server().await;

        let mut req = format!("ws://127.0.0.1:{port}/stream/ws")
            .into_client_request()
            .unwrap();
        req.headers_mut().insert(
            "sec-websocket-protocol",
            format!("bakeoff.v0, {token}").parse().unwrap(),
        );
        req.headers_mut().insert(
            "origin",
            format!("http://127.0.0.1:{port}").parse().unwrap(),
        );
        let (mut ws, _resp) = tokio_tungstenite::connect_async(req).await.unwrap();

        let credit = |n: u32| {
            let mut p = Vec::new();
            p.extend_from_slice(&n.to_be_bytes());
            TMessage::Binary(wire::frame(wire::TAG_CREDIT, &p).into())
        };
        ws.send(credit(4)).await.unwrap();

        let mut batches = 0u32;
        let mut opens = 0u32;
        let mut terminal: Option<u8> = None;

        let deadline = tokio::time::Instant::now() + Duration::from_secs(240);
        while terminal.is_none() {
            let next = tokio::time::timeout_at(deadline, ws.next()).await;
            let msg = match next {
                Err(_) => panic!(
                    "timed out after {batches}/{BATCH_COUNT} batches with no terminal frame"
                ),
                Ok(None) => panic!(
                    "socket closed after {batches}/{BATCH_COUNT} batches with no terminal frame \
                     — this is the silent-truncation bug"
                ),
                Ok(Some(m)) => m.unwrap(),
            };
            if let TMessage::Binary(b) = msg {
                match b[0] {
                    wire::TAG_OPEN => opens += 1,
                    wire::TAG_BATCH => {
                        batches += 1;
                        // Renew demand exactly as the browser consumer does.
                        ws.send(credit(1)).await.unwrap();
                    }
                    wire::TAG_PROGRESS => {}
                    wire::TAG_TERMINAL => terminal = Some(b[wire::FRAME_PREFIX_LEN]),
                    other => panic!("unexpected frame tag {other}"),
                }
            }
        }

        assert_eq!(opens, 1, "exactly one open frame carrying the stream ids");
        assert_eq!(
            batches, BATCH_COUNT as u32,
            "every batch must be delivered — got {batches}"
        );
        assert_eq!(
            terminal,
            Some(wire::TERM_COMPLETED),
            "a completed stream must end in a Completed terminal frame"
        );
    }

    /// **R6 / §18 P1 — the cancel-blind window, demonstrated rather than asserted from the diff.**
    ///
    /// §19.4 and §19.6 require *this specific* demonstration, because the plausible-looking version
    /// of the test proves nothing: showing that a cancel works *between* sends passes on the broken
    /// structure too. What has to be shown is a CANCEL observed **while a batch send is still
    /// draining into the socket**.
    ///
    /// Construction. The client grants credit and then **stops reading**. Its receive window closes,
    /// the server's `sink.send` for the first batch pends part-way through, and the writer is parked
    /// inside it. A CANCEL is then sent on the same connection — TCP is full-duplex, so it arrives
    /// even though the server cannot make progress writing.
    ///
    /// Under Phase 2's structure (`86df830`) one `tokio::select!` owned both halves, and it cannot
    /// poll `recv()` while `send().await` holds the loop. This cancel would have been invisible
    /// until the flush completed — which, with the client never reading, is never. The split
    /// structure sees it immediately. That difference is the whole of P1.
    #[tokio::test]
    async fn cancel_is_observed_while_a_send_is_pending() {
        use futures_util::SinkExt;
        use tokio_tungstenite::tungstenite::client::IntoClientRequest;
        use tokio_tungstenite::tungstenite::Message as TMessage;

        let (port, token, shared) = spawn_server_with(None).await;

        let mut req = format!("ws://127.0.0.1:{port}/stream/ws")
            .into_client_request()
            .unwrap();
        req.headers_mut().insert(
            "sec-websocket-protocol",
            format!("bakeoff.v0, {token}").parse().unwrap(),
        );
        req.headers_mut()
            .insert("origin", format!("http://127.0.0.1:{port}").parse().unwrap());
        let (mut ws, _resp) = tokio_tungstenite::connect_async(req).await.unwrap();

        let ctl = |tag: u8, p: &[u8]| TMessage::Binary(wire::frame(tag, p).into());
        // Credit far in excess of what the client and kernel socket buffers can absorb. This matters:
        // with credit merely "ample" the writer parks on `credit.acquire()` once the buffers fill,
        // which is a *different* wait and would not exercise the window under test. The first
        // attempt at this test granted 8 and the buffers swallowed 3 batches (~7 MB) before the
        // stall, so the count is set well above that.
        ws.send(ctl(wire::TAG_CREDIT, &64u32.to_be_bytes())).await.unwrap();

        // Deliberately read nothing from here on.
        let state = {
            let deadline = tokio::time::Instant::now() + Duration::from_secs(10);
            loop {
                if let Some(s) = shared
                    .states
                    .lock()
                    .unwrap_or_else(|e| e.into_inner())
                    .values()
                    .next()
                    .cloned()
                {
                    break s;
                }
                assert!(tokio::time::Instant::now() < deadline, "stream never registered");
                tokio::time::sleep(Duration::from_millis(5)).await;
            }
        };

        // Wait for the first batch to be handed to the transport. `note_written` runs *before*
        // `sink.send`, so a non-zero count means the writer has entered a send.
        let deadline = tokio::time::Instant::now() + Duration::from_secs(10);
        while state.bytes_emitted() == 0 {
            assert!(
                tokio::time::Instant::now() < deadline,
                "producer never handed a batch to the transport"
            );
            tokio::time::sleep(Duration::from_millis(5)).await;
        }

        // Establish that the writer is genuinely *stalled inside* a send, not merely slow. The
        // buffers absorb some prefix of the stream first, so wait for the count to plateau rather
        // than assuming the first sample is already the stall point.
        let deadline = tokio::time::Instant::now() + Duration::from_secs(20);
        let stalled_at = loop {
            let a = state.bytes_emitted();
            tokio::time::sleep(Duration::from_millis(50)).await;
            if a == state.bytes_emitted() && a > 0 {
                break a;
            }
            assert!(
                tokio::time::Instant::now() < deadline,
                "the writer never stalled — the socket absorbed the whole stream, so this test \
                 cannot exercise the window it exists to test"
            );
        };
        tokio::time::sleep(Duration::from_millis(400)).await;
        assert_eq!(
            state.bytes_emitted(),
            stalled_at,
            "the writer must be parked inside a pending send for this test to mean anything — \
             it is still making progress, so the socket never filled and the window was not exercised"
        );
        // ...and genuinely mid-stream, not stalled on the last batch of a nearly-finished corpus.
        let total = BATCH_COUNT as u64 * shared.batch_wire_bytes as u64;
        assert!(
            stalled_at < total / 2,
            "expected the stall well inside the stream, got {stalled_at} of {total} bytes"
        );
        assert!(
            !state.is_cancelled(),
            "nothing has been cancelled yet; a cancel observed here would invalidate the measurement"
        );

        // The measurement. H2's gate is < 100 ms, on the producer's own clock.
        let sent_at = std::time::Instant::now();
        ws.send(ctl(wire::TAG_CANCEL, &[])).await.unwrap();

        let deadline = tokio::time::Instant::now() + Duration::from_secs(5);
        let observed = loop {
            if let Some(at) = state.observed_at() {
                break at;
            }
            assert!(
                tokio::time::Instant::now() < deadline,
                "producer never observed the cancel — the send is still blind to the control path, \
                 which is exactly the §18 P1 regression this test exists to catch"
            );
            tokio::time::sleep(Duration::from_millis(1)).await;
        };

        let ack = observed.saturating_duration_since(sent_at);
        assert!(
            ack < Duration::from_millis(100),
            "producer-visible cancellation took {ack:?}, over H2's 100 ms gate, with a send pending"
        );
        assert!(
            state.batches_after_cancel() <= 1,
            "H2 allows at most one further batch after cancellation, saw {}",
            state.batches_after_cancel()
        );
    }

    /// **§19.7 — the N+1 admission exercise (ADR-010 rule 6).**
    ///
    /// Rule 6's point is that "we are comfortably under it today" is not a strategy: the ceiling is
    /// declared and then deliberately driven past. The third concurrent stream must be **refused and
    /// the refusal surfaced**, never silently queued and never admitted-and-degraded — which is the
    /// wrong-but-plausible result rule 7 forbids.
    ///
    /// The refusal arrives as a `TransportFailed` terminal frame, in the taxonomy §5 already
    /// declares. No new error variant and no new control frame: minting either would be the data
    /// plane acquiring control-plane vocabulary.
    #[tokio::test]
    async fn a_stream_over_the_declared_ceiling_is_refused_and_surfaced() {
        async fn open_stream(port: u16, token: &str) -> TcpStream {
            let mut s = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
            // `Connection: close` so the refused response reaches EOF. Without it keep-alive holds
            // the socket open and `read_to_end` blocks on a connection the server is done with.
            let req = format!(
                "GET /stream/http HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\n\
                 Origin: http://127.0.0.1:{port}\r\nAuthorization: Bearer {token}\r\n\r\n"
            );
            s.write_all(req.as_bytes()).await.unwrap();
            s
        }

        let (port, token) = spawn_server().await;

        // Hold the ceiling. Read at least one byte from each so the handler has certainly run and
        // taken its slot before the third connection is opened.
        let mut held = Vec::new();
        for _ in 0..MAX_CONCURRENT_STREAMS {
            let mut s = open_stream(port, &token).await;
            let mut one = [0u8; 1];
            s.read_exact(&mut one).await.unwrap();
            held.push(s);
        }

        // N+1.
        let mut third = open_stream(port, &token).await;
        let mut buf = Vec::new();
        tokio::time::timeout(Duration::from_secs(10), third.read_to_end(&mut buf))
            .await
            .expect("the refused stream must terminate, not hang")
            .unwrap();

        let sep = buf
            .windows(4)
            .position(|w| w == b"\r\n\r\n")
            .expect("response head");
        let body = &buf[sep + 4..];
        assert_eq!(
            body[0],
            wire::TAG_TERMINAL,
            "a refused stream must surface a terminal frame, not silence or a partial stream"
        );
        assert_eq!(
            body[wire::FRAME_PREFIX_LEN],
            wire::TERM_TRANSPORT_FAILED,
            "the refusal must map into the declared taxonomy"
        );
        let detail = String::from_utf8_lossy(&body[wire::FRAME_PREFIX_LEN + 1..]);
        assert!(
            detail.contains("admission ceiling"),
            "the refusal must say why it was refused, got {detail:?}"
        );

        // And the ceiling must be released again, or it is a leak rather than a ceiling.
        drop(held);
        let deadline = tokio::time::Instant::now() + Duration::from_secs(10);
        loop {
            let mut s = open_stream(port, &token).await;
            let mut one = [0u8; 1];
            if tokio::time::timeout(Duration::from_millis(500), s.read_exact(&mut one))
                .await
                .is_ok()
            {
                let mut head = vec![0u8; 200];
                let n = s.read(&mut head).await.unwrap_or(0);
                let text = String::from_utf8_lossy(&head[..n]).to_string();
                if !text.contains("admission ceiling") {
                    break;
                }
            }
            assert!(
                tokio::time::Instant::now() < deadline,
                "admission slots were never released — the ceiling leaks"
            );
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    }

    /// Raw WebSocket handshake, returning the HTTP status of the upgrade response.
    async fn ws_probe(port: u16, origin: Option<&str>, protocols: Option<&str>) -> u16 {
        let mut s = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
        let mut req = format!(
            "GET /stream/ws HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\n\
             Upgrade: websocket\r\nConnection: Upgrade\r\n\
             Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n"
        );
        if let Some(o) = origin {
            req.push_str(&format!("Origin: {o}\r\n"));
        }
        if let Some(p) = protocols {
            req.push_str(&format!("Sec-WebSocket-Protocol: {p}\r\n"));
        }
        req.push_str("\r\n");
        s.write_all(req.as_bytes()).await.unwrap();
        let mut buf = vec![0u8; 256];
        let n = s.read(&mut buf).await.unwrap();
        String::from_utf8_lossy(&buf[..n])
            .split_whitespace()
            .nth(1)
            .and_then(|c| c.parse().ok())
            .unwrap_or(0)
    }

    /// The WebSocket endpoint extracts its credential from the subprotocol list — a **different**
    /// code path from the `Authorization` header the other endpoints use, and previously exercised
    /// only by the positive case. Since ADR-012 recommends adopting this transport, a reject-side
    /// bug here would sit directly under the recommendation.
    #[tokio::test]
    async fn websocket_upgrade_rejects_bad_credentials_and_origins() {
        let (port, token) = spawn_server().await;
        let origin = format!("http://127.0.0.1:{port}");

        // Positive control first — without it the four negative cases below could all pass
        // because the endpoint is simply broken.
        assert_eq!(
            ws_probe(port, Some(&origin), Some(&format!("bakeoff.v0, {token}"))).await,
            101,
            "a correctly credentialed same-origin upgrade must succeed"
        );

        // No credential at all: only the public subprotocol name is offered.
        assert_eq!(ws_probe(port, Some(&origin), Some("bakeoff.v0")).await, 401);
        // No Sec-WebSocket-Protocol header whatsoever.
        assert_eq!(ws_probe(port, Some(&origin), None).await, 401);
        // Wrong credential, correct length.
        assert_eq!(
            ws_probe(port, Some(&origin), Some(&format!("bakeoff.v0, {}", "0".repeat(64)))).await,
            401
        );
        // Valid credential, foreign origin.
        assert_eq!(
            ws_probe(
                port,
                Some("http://evil.example"),
                Some(&format!("bakeoff.v0, {token}"))
            )
            .await,
            403
        );
        // Valid credential, `null` origin — the WebView2 opaque-origin shape.
        assert_eq!(
            ws_probe(port, Some("null"), Some(&format!("bakeoff.v0, {token}"))).await,
            403
        );
    }

    /// **R4 — mid-stream disconnect must be producer-visible**, end to end, without a browser.
    ///
    /// The unit test on `BodyStream::drop` proves the guard fires; this proves the guard is
    /// actually reached when a *real* peer vanishes mid-transfer, which is the case that matters
    /// and the one F4 showed can go unnoticed.
    #[tokio::test]
    async fn mid_stream_disconnect_is_observed_by_the_producer() {
        let (port, token, app_state) = spawn_server_with(None).await;
        let origin = format!("http://127.0.0.1:{port}");

        let mut s = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
        s.write_all(
            format!(
                "GET /stream/http HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\n\
                 Origin: {origin}\r\nAuthorization: Bearer {token}\r\n\r\n"
            )
            .as_bytes(),
        )
        .await
        .unwrap();

        // Read enough to be genuinely mid-stream, then drop the connection on the floor.
        let mut buf = vec![0u8; 64 * 1024];
        let mut got = 0usize;
        while got < 256 * 1024 {
            match s.read(&mut buf).await {
                Ok(0) | Err(_) => break,
                Ok(n) => got += n,
            }
        }
        assert!(got > 0, "expected to receive some of the stream before disconnecting");
        drop(s);

        // The producer must notice through its own transport. Poll its own record, not the client's.
        let mut observed = false;
        for _ in 0..200 {
            tokio::time::sleep(Duration::from_millis(25)).await;
            let seen = app_state
                .states
                .lock()
                .unwrap_or_else(|e| e.into_inner())
                .values()
                .any(|st| st.is_cancelled());
            if seen {
                observed = true;
                break;
            }
        }
        assert!(
            observed,
            "a peer disappearing mid-stream must become visible to the producer"
        );
    }

    #[tokio::test]
    async fn same_origin_get_without_an_origin_header_is_allowed() {
        // Regression test for a real bug found on the first live run: browsers omit `Origin` on
        // same-origin GET, so a naive "reject when Origin is absent" rule rejected the harness
        // page's own requests. The fix requires a positive `Sec-Fetch-Site: same-origin` signal
        // rather than trusting absence.
        let (port, token) = spawn_server().await;
        assert_eq!(
            probe_full(port, None, Some(&token), Some("same-origin")).await,
            200
        );
    }
}
