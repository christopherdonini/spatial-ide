// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The listening data plane: one operation, one stream per connection, declared ceilings.
//!
//! ## Where the control plane went — declared, not left implicit
//!
//! ADR-004 splits the **control plane** (commands, handles, schemas, progress, cancellation,
//! errors — Tauri IPC on desktop) from the **data plane**, and ADR-012's own Consequences say
//! "Nothing changes for the control plane. Tauri IPC remains the control plane." This slice has no
//! Tauri shell, so **operation-start rides the data channel** as a fixed-layout binary START frame.
//! `docs/10` gives partial cover — "Control plane … websocket for remote clients" — but this is a
//! **temporary structural deviation** and is recorded as one: if it survives past this slice it
//! needs its own ADR, not a comment. Credit and cancel are in-band binary control frames, which is
//! the adapter's own mechanism and needs no such note.
//!
//! ## This is not SKP v0
//!
//! In scope: one operation, a batch stream, cancel, progress, terminal error, credit-based demand.
//! Unversioned beyond a subprotocol string, single-consumer, no specification document. Out of
//! scope, because they would be authoring SKP v0 (`docs/10`'s checklist): a command catalog beyond
//! that one operation, version negotiation, capability discovery, handle lifecycle, idempotency
//! keys, schema evolution, a generalized auth model, a conformance suite — and the token `skp` on
//! any type, file, crate or wire field.

use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::atomic::AtomicU64;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use axum::extract::ws::{Message, WebSocket, WebSocketUpgrade};
use axum::extract::State;
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::Router;
use tokio::net::TcpListener;
use tokio::sync::{OwnedSemaphorePermit, Semaphore};

use crate::adapter_ws;
use crate::pump;
use crate::session::{Session, SUBPROTOCOL};
use crate::transport::{
    Checkpoints, OpenRequest, OperationId, SourceFactory, StreamId, StreamState, Terminal,
};
use crate::wire;

/// Declared ceilings — ADR-010 rule 6: declared, not discovered.
///
/// **The N+1 case is a refusal, not a queue.** Whether concurrent streams should be queued, and on
/// what policy, is the question ADR-014 is *reserved* for; implementing a queue here would decide it
/// by accident. Refusing is itself an admission policy and consumers will be written against it, so
/// it is **provisional and reversible** — the same standing Candidate A has here — not a decision.
///
/// A slot is taken **after** the operation is read and released as soon as the stream's last frame
/// is handed to the transport — never across the peer's shutdown. Both matter: taking it earlier
/// would let idle connections exhaust the ceiling, and holding it later would make the ceiling a
/// function of client timing rather than of load.
pub const MAX_CONCURRENT_STREAMS: usize = 4;
/// Credit window and pump channel capacity, in batches.
pub const MAX_INFLIGHT_BATCHES: usize = 4;
/// Largest payload the producer will put in one frame.
pub const MAX_FRAME_BYTES: usize = 16 * 1024 * 1024;
/// How long a connection may sit without starting an operation.
///
/// **This bound exists because a connection that never starts one costs a descriptor and a task.**
/// A *pre-warmed spare* idles by design — that is the point of it, since it moves the socket open
/// and the credential handshake off the per-query path — so the bound is not removed, it is
/// declared at the length a spare is allowed to wait and paired with a ceiling on how many spares
/// may exist (ADR-010 rule 6: declared, not discovered). Removing it silently would have traded a
/// latency win for an unbounded idle-connection count.
pub const START_TIMEOUT: Duration = Duration::from_secs(120);

/// How many connections may sit pre-warmed, authenticated, and not yet carrying an operation.
///
/// **A spare holds no admission slot.** The slot is taken after START is read and released before
/// the peer drain, so spares cannot exhaust `MAX_CONCURRENT_STREAMS` — which is what lets this be
/// a latency change rather than an admission-policy change. Whether concurrent *streams* should be
/// queued remains the question **ADR-014 is reserved for**, and nothing here touches it: this is a
/// ceiling on idle sockets, not on streams.
pub const MAX_IDLE_CONNECTIONS: usize = 4;

/// How long a connection beyond the idle ceiling may wait before starting an operation.
///
/// Short, because it is over the declared budget — but non-zero, because a connection arriving at a
/// crowded moment and starting an operation immediately is exactly the behaviour pre-warming is for
/// and must not be punished for the pool being full.
pub const CROWDED_START_TIMEOUT: Duration = Duration::from_secs(5);
/// How long the producer waits for the consumer to close after its terminal frame.
///
/// The producer never closes first (see `adapter_ws`), so this is the bound on how long a finished
/// stream's connection can linger if the peer never closes. It holds no admission slot while it
/// waits — the slot is released before the drain — so a lingering peer costs a connection, not
/// capacity.
pub const PEER_DRAIN_TIMEOUT: Duration = Duration::from_secs(30);

/// How many finished streams' state and terminal this registry retains, at most (ADR-010 rule 6:
/// declared, not derived). Declared floor: at least `MAX_CONCURRENT_STREAMS`, so a full admission
/// window's streams are all retained when they end. Set below Finding A5-1's 200 finished streams
/// so that `stream_registry_bound.rs`'s count test actually discriminates.
pub const MAX_TERMINAL_RECORDS: usize = 64;
/// How long a terminal record survives a later stream event, mirroring the kernel's own
/// `TERMINAL_ENTRY_MAX_AGE` but declared independently: the data plane does not depend on the
/// kernel. After this age, a finished stream's state is no longer readable through `snapshot()`,
/// and no cancel reads it.
pub const TERMINAL_RECORD_MAX_AGE: Duration = Duration::from_secs(300);

// Checked at compile time rather than in a test: as runtime assertions these were constant-folded
// and could not fail. An edit that drops a ceiling below its floor stops the build.
const _: () = assert!(MAX_CONCURRENT_STREAMS >= 1);
const _: () = assert!(MAX_INFLIGHT_BATCHES >= 1);
const _: () = assert!(MAX_FRAME_BYTES >= 1024 * 1024);
const _: () = assert!(MAX_IDLE_CONNECTIONS >= 1);
const _: () = assert!(MAX_TERMINAL_RECORDS >= MAX_CONCURRENT_STREAMS);
const _: () = assert!(TERMINAL_RECORD_MAX_AGE.as_secs() >= 1);

pub struct DataPlaneConfig {
    pub factory: Arc<dyn SourceFactory>,
    /// Optional directory of static consumer assets. Serving static assets is **not** the data
    /// plane (ADR-004 amendment 2 leaves the custom-protocol path acceptable for exactly that);
    /// it is here so a browser consumer has a same-origin page to load.
    pub static_dir: Option<PathBuf>,
    /// The consumer's own origin, when it is *not* the same-origin page `static_dir` above would
    /// serve -- e.g. a Tauri webview, whose origin has nothing to do with this server's own bound
    /// port (ADR-020). `None` preserves the original assumption: the consumer is the page served
    /// at `/`, so its origin *is* this server's own `http://127.0.0.1:<port>`.
    pub expected_origin: Option<String>,
}

/// Bounded record of the streams this process has served, for instrumentation and tests. A live
/// entry — recorded but with no terminal recorded yet — is never removed; a finished stream's
/// state and its terminal are retained until the first of two events: the terminal record grows
/// older than `TERMINAL_RECORD_MAX_AGE` at a later `record` or `record_terminal`, or more than
/// `MAX_TERMINAL_RECORDS` newer terminal records come to exist. An idle process therefore keeps up
/// to `MAX_TERMINAL_RECORDS` terminal records of any age until the next stream event: the count
/// bound is what bounds memory, and the age bound acts only at those events, exactly as the
/// kernel's own `StreamRegistry` acts on its own terminal entries.
///
/// The data plane's cancel reads nothing here: a CANCEL frame carries no stream id, being scoped
/// to its own connection. The only readers, in this workspace, are instruments and tests.
///
/// Producer-side facts only — a client-side observation of cancellation is not evidence about the
/// producer (spike M5).
#[derive(Default)]
pub struct StreamRegistry {
    state: Mutex<StreamRegistryState>,
    refusals: AtomicU64,
}

#[derive(Default)]
struct StreamRegistryState {
    /// Every recorded stream, live or finished, in admission order. A finished stream's entry is
    /// removed only when its terminal record below is pruned — never by the call that records its
    /// own terminal.
    streams: Vec<Arc<StreamState>>,
    /// Finished streams' terminals, in the order they were recorded.
    terminals: Vec<TerminalRecord>,
}

struct TerminalRecord {
    stream: String,
    terminal: Terminal,
    ended_at: Instant,
}

impl StreamRegistry {
    fn record(&self, s: Arc<StreamState>) {
        let mut state = self.state.lock().unwrap_or_else(|e| e.into_inner());
        state.streams.push(s);
        Self::prune_locked(&mut state);
    }
    fn record_terminal(&self, stream: &StreamId, t: Terminal) {
        let mut state = self.state.lock().unwrap_or_else(|e| e.into_inner());
        state.terminals.push(TerminalRecord {
            stream: stream.as_str().to_string(),
            terminal: t,
            ended_at: Instant::now(),
        });
        Self::prune_locked(&mut state);
    }

    /// Bounds the finished-stream state this registry retains. Run under this registry's own lock
    /// at the end of `record` and of `record_terminal`, never on a read. A terminal record strictly
    /// older than `TERMINAL_RECORD_MAX_AGE` is evicted (the kernel's own `>` comparison), and then,
    /// while more than `MAX_TERMINAL_RECORDS` terminal records remain, the earliest-recorded excess
    /// is evicted. Each eviction takes the matching `StreamState` with it. A live entry — one with
    /// no terminal record — is never touched: only ids already present in `terminals` are ever
    /// removed from `streams`, and the entry a `record_terminal` call has just recorded is the
    /// newest, so the count step never removes it. Neither `StreamState` nor `Terminal` implements
    /// `Drop`, so an evicted value dropping under this guard is not the kernel's own reentrancy
    /// hazard.
    fn prune_locked(state: &mut StreamRegistryState) {
        let mut evicted: Vec<String> = Vec::new();
        state.terminals.retain(|r| {
            if r.ended_at.elapsed() > TERMINAL_RECORD_MAX_AGE {
                evicted.push(r.stream.clone());
                false
            } else {
                true
            }
        });
        while state.terminals.len() > MAX_TERMINAL_RECORDS {
            evicted.push(state.terminals.remove(0).stream);
        }
        if !evicted.is_empty() {
            state.streams.retain(|s| !evicted.iter().any(|id| id == s.stream.as_str()));
        }
    }

    pub fn snapshot(&self) -> Vec<Arc<StreamState>> {
        self.state.lock().unwrap_or_else(|e| e.into_inner()).streams.clone()
    }
    pub fn terminals(&self) -> Vec<(String, Terminal)> {
        self.state
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .terminals
            .iter()
            .map(|r| (r.stream.clone(), r.terminal.clone()))
            .collect()
    }
    pub fn refusals(&self) -> u64 {
        self.refusals.load(std::sync::atomic::Ordering::SeqCst)
    }
    pub fn active(&self) -> usize {
        self.snapshot().iter().filter(|s| !s.is_cancelled()).count()
    }
}

#[derive(Clone)]
struct AppState {
    session: Session,
    factory: Arc<dyn SourceFactory>,
    admission: Arc<Semaphore>,
    /// Connections that are authenticated but have not yet started an operation. Counted so the
    /// declared idle ceiling is enforced rather than merely stated.
    idle: Arc<Semaphore>,
    registry: Arc<StreamRegistry>,
    json_frames_seen: Arc<AtomicU64>,
    static_dir: Option<PathBuf>,
}

pub struct RunningDataPlane {
    pub addr: SocketAddr,
    pub session: Session,
    pub registry: Arc<StreamRegistry>,
    /// Frames that looked like JSON on the data channel. H5's assertion is that this stays 0, and
    /// it is reported as an explicit number rather than as an absence.
    pub json_frames_seen: Arc<AtomicU64>,
    shutdown: Option<tokio::sync::oneshot::Sender<()>>,
    join: Option<tokio::task::JoinHandle<()>>,
}

impl RunningDataPlane {
    /// The URL a browser consumer opens. The credential rides in the **fragment**, which browsers
    /// never transmit — so it appears in no request line, no log and no response body.
    ///
    /// It is returned, never written: ADR-012's threat model requires that the production transport
    /// "must not write the credential to disk", and nothing in this crate does.
    pub fn launch_url(&self) -> String {
        format!("http://127.0.0.1:{}/#{}", self.addr.port(), self.session.token_for_delivery())
    }

    pub async fn shutdown(mut self) {
        if let Some(tx) = self.shutdown.take() {
            let _ = tx.send(());
        }
        if let Some(j) = self.join.take() {
            let _ = j.await;
        }
    }
}

/// Bind and serve. **Loopback only, ephemeral port, asserted at startup** (`docs/09`).
pub async fn serve(config: DataPlaneConfig) -> std::io::Result<RunningDataPlane> {
    let listener = TcpListener::bind(("127.0.0.1", 0)).await?;
    let addr = listener.local_addr()?;
    assert!(addr.ip().is_loopback(), "the data plane binds loopback only");

    let session = match config.expected_origin {
        Some(origin) => Session::with_origin(origin)?,
        None => Session::new(addr.port())?,
    };
    let registry = Arc::new(StreamRegistry::default());
    let json_frames_seen = Arc::new(AtomicU64::new(0));

    let state = AppState {
        session: session.clone(),
        factory: config.factory,
        admission: Arc::new(Semaphore::new(MAX_CONCURRENT_STREAMS)),
        idle: Arc::new(Semaphore::new(MAX_IDLE_CONNECTIONS)),
        registry: registry.clone(),
        json_frames_seen: json_frames_seen.clone(),
        static_dir: config.static_dir,
    };

    let app = Router::new()
        .route("/", get(page))
        .route("/{file}", get(asset))
        .route("/stream", get(upgrade))
        .with_state(state);

    let (tx, rx) = tokio::sync::oneshot::channel::<()>();
    let join = tokio::spawn(async move {
        let _ = axum::serve(listener, app)
            .with_graceful_shutdown(async {
                let _ = rx.await;
            })
            .await;
    });

    Ok(RunningDataPlane {
        addr,
        session,
        registry,
        json_frames_seen,
        shutdown: Some(tx),
        join: Some(join),
    })
}

// ---------------------------------------------------------------------------------------------
// Static assets — not the data plane
// ---------------------------------------------------------------------------------------------

async fn page(State(st): State<AppState>) -> Response {
    serve_file(&st, "index.html").await
}

async fn asset(State(st): State<AppState>, axum::extract::Path(file): axum::extract::Path<String>) -> Response {
    serve_file(&st, &file).await
}

/// Serves a fixed set of names out of the configured directory.
///
/// The name is matched against a whitelist rather than sanitized: a whitelist cannot be defeated by
/// an encoding trick, and this endpoint has no reason to serve anything else.
async fn serve_file(st: &AppState, name: &str) -> Response {
    let Some(dir) = st.static_dir.as_ref() else {
        return (StatusCode::NOT_FOUND, "no consumer assets configured").into_response();
    };
    let (allowed, mime) = match name {
        "index.html" => (true, "text/html; charset=utf-8"),
        "app.js" => (true, "text/javascript; charset=utf-8"),
        // The bundler emits a source map next to the bundle; without it a browser reports a 404 for
        // a file the page itself asks for. It is served because it is part of the same build output,
        // not because the whitelist is negotiable.
        "app.js.map" => (true, "application/json; charset=utf-8"),
        _ => (false, ""),
    };
    if !allowed {
        return (StatusCode::NOT_FOUND, "not served").into_response();
    }
    match tokio::fs::read(dir.join(name)).await {
        Ok(bytes) => {
            // The served document contains no credential; the credential is in the URL fragment,
            // which the browser never sends.
            ([(header::CONTENT_TYPE, mime)], bytes).into_response()
        }
        Err(e) => (StatusCode::NOT_FOUND, format!("{name}: {e}")).into_response(),
    }
}

// ---------------------------------------------------------------------------------------------
// The data channel
// ---------------------------------------------------------------------------------------------

async fn upgrade(State(st): State<AppState>, headers: HeaderMap, ws: WebSocketUpgrade) -> Response {
    // A present `Origin` that `to_str` refuses (`http`'s `HeaderValue::to_str` refuses any byte outside
    // visible ASCII) is refused directly, before the credential check (ADR-020 Decision; docs/09 "Local
    // listening sockets"), rather than read as absent: `Session::request_allowed`'s `None` arm exists for a
    // header that is truly absent, and admitting on that arm for a header that is present but
    // unreadable would let a same-origin claim rescue a stated foreign origin.
    let origin = match headers.get("origin") {
        None => None,
        Some(v) => match v.to_str() {
            Ok(o) => Some(o),
            Err(_) => return (StatusCode::FORBIDDEN, "origin").into_response(),
        },
    };
    let sec_fetch_site = headers.get("sec-fetch-site").and_then(|v| v.to_str().ok());
    if !st.session.request_allowed(origin, sec_fetch_site) {
        return (StatusCode::FORBIDDEN, "origin").into_response();
    }

    let offered = headers
        .get("sec-websocket-protocol")
        .and_then(|v| v.to_str().ok())
        .unwrap_or_default();
    let presented = st.session.token_from_offers(offered).unwrap_or("");
    if !st.session.token_matches(presented) {
        return (StatusCode::UNAUTHORIZED, "credential").into_response();
    }

    ws.protocols([SUBPROTOCOL]).on_upgrade(move |socket| handle(st, socket))
}

async fn handle(st: AppState, mut socket: WebSocket) {
    // **The idle ceiling bounds how long a connection may *loiter*, never whether it may connect.**
    //
    // The first version of this gated every connection on an idle permit, and a test caught what
    // that costs: with the spare pool full, the next connection — the one that actually wants to
    // stream — was refused before it could send START. Pre-warming would have starved the streams
    // it exists to serve. Bounding idle sockets and admitting streams are different jobs and the
    // ceiling must only do the first.
    //
    // So every connection is admitted, and the ceiling decides how patient the producer is with a
    // connection that has not started anything: a spare within the pool may wait `START_TIMEOUT`;
    // one beyond it gets `CROWDED_START_TIMEOUT` and is then told why. Idle sockets stay bounded,
    // and stream capacity is untouched — which is what keeps this a latency change rather than an
    // admission-policy change (ADR-014's reserved question).
    let idle_permit = st.idle.clone().try_acquire_owned().ok();
    let start_budget = if idle_permit.is_some() { START_TIMEOUT } else { CROWDED_START_TIMEOUT };

    // **The operation is read before a capacity slot is taken.** Admission is about *streams*, and a
    // connection that never starts one must not hold a slot: with the slot taken first,
    // `MAX_CONCURRENT_STREAMS` idle connections could exhaust the declared ceiling for
    // `START_TIMEOUT` and cause visible refusals of legitimate streams.
    let request = match tokio::time::timeout(start_budget, read_start(&mut socket)).await {
        Ok(Ok(Some(r))) => r,
        Ok(Ok(None)) => return, // the peer left before starting anything
        Ok(Err(detail)) => {
            // A START this producer cannot parse is a transport failure and says so. Returning
            // here instead would drop the socket with no terminal frame — the silent truncation
            // `lib.rs` declares a correctness failure, reached on the parse path.
            terminal_and_drain(socket, wire::TERM_TRANSPORT_FAILED, detail, &st.json_frames_seen)
                .await;
            return;
        }
        Err(_) => {
            let detail = if idle_permit.is_some() {
                "no operation started".to_string()
            } else {
                format!(
                    "no operation started, and the declared ceiling                      MAX_IDLE_CONNECTIONS={MAX_IDLE_CONNECTIONS} was already reached, so this                      connection was held for {CROWDED_START_TIMEOUT:?} rather than                      {START_TIMEOUT:?}"
                )
            };
            terminal_and_drain(socket, wire::TERM_TRANSPORT_FAILED, &detail, &st.json_frames_seen)
                .await;
            return;
        }
    };

    // The connection is no longer idle: it has an operation. The idle slot goes back here, before
    // the stream's own admission, so a running stream never also occupies spare capacity.
    drop(idle_permit);

    // Admission. Refusal is visible and typed; there is no queue.
    let permit: OwnedSemaphorePermit = match st.admission.clone().try_acquire_owned() {
        Ok(p) => p,
        Err(_) => {
            st.registry.refusals.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
            terminal_and_drain(
                socket,
                wire::TERM_PRODUCER_FAILED,
                &format!(
                    "declared ceiling MAX_CONCURRENT_STREAMS={MAX_CONCURRENT_STREAMS} reached; \
                     refused, not queued"
                ),
                &st.json_frames_seen,
            )
            .await;
            return;
        }
    };

    // **Creating the source is blocking work and does not run on a runtime worker.** It opens a
    // database connection and prepares a statement today, and it is the call that grows as the
    // catalog does. A parked worker cannot parse another connection's CANCEL frame, which is
    // `docs/08`'s <100 ms cancellation budget and `docs/01` principle 7 paid for by an unrelated
    // stream.
    let factory = st.factory.clone();
    let request_for_create = request.clone();
    let created = tokio::task::spawn_blocking(move || factory.create(&request_for_create)).await;

    let (source, cancel) = match created {
        Ok(Ok(pair)) => pair,
        Ok(Err(detail)) => {
            // A refusal from the module that owns the operation — a CRS that cannot be admitted,
            // for instance — reaches the consumer as a typed terminal carrying its own words, not
            // as a dropped connection.
            //
            // **The slot goes back before the drain, not after.** No stream started, so there is
            // nothing to account for; holding it across `terminal_and_drain`'s up-to-30 s wait for
            // the peer to close would make the declared ceiling a function of client shutdown
            // timing rather than of load — the exact property this file's ceiling comment claims,
            // and ADR-010 rule 6's "declared, not discovered".
            drop(permit);
            terminal_and_drain(socket, wire::TERM_PRODUCER_FAILED, &detail, &st.json_frames_seen)
                .await;
            return;
        }
        Err(join) => {
            drop(permit);
            terminal_and_drain(
                socket,
                wire::TERM_PRODUCER_FAILED,
                &format!("starting the operation panicked: {join}"),
                &st.json_frames_seen,
            )
            .await;
            return;
        }
    };

    let state = StreamState::new(OperationId::new(), StreamId::new());
    st.registry.record(state.clone());
    let checkpoints = Arc::new(Checkpoints::default());
    let total = adapter_ws::total_or_unknown(source.total_batches());

    let rx = match pump::spawn(
        source,
        state.clone(),
        tokio::runtime::Handle::current(),
        MAX_INFLIGHT_BATCHES,
        MAX_FRAME_BYTES,
    ) {
        Ok(rx) => rx,
        Err(e) => {
            // The producer never got a thread. Nothing was streamed, so the slot goes back before
            // the drain, and the peer is told why rather than having its socket dropped.
            //
            // **This is the one path through this function that records a stream and never
            // reaches `record_terminal` below** (§2 item 6 of
            // `STREAM-REGISTRY-BOUND-PREREGISTRATION.md`): `record` above already ran for `state`,
            // so without this the entry would stay live for ever. The detail string is computed
            // once and reused for both the consumer-facing terminal frame and this registry's own
            // record.
            drop(permit);
            let detail = format!("could not start the producer: {e}");
            terminal_and_drain(socket, wire::TERM_PRODUCER_FAILED, &detail, &st.json_frames_seen)
                .await;
            st.registry.record_terminal(&state.stream, Terminal::ProducerFailed(detail));
            return;
        }
    };

    let stream_id = state.stream.clone();
    let terminal = adapter_ws::drive(
        socket,
        rx,
        state,
        cancel,
        checkpoints,
        total,
        st.json_frames_seen.clone(),
        Some(Box::new(permit)),
    )
    .await;

    st.registry.record_terminal(&stream_id, terminal);
}

/// Send a terminal frame on a stream that never started, then wait for the peer to close.
///
/// **The producer never initiates the close, on the refusal paths either.** Dropping the socket
/// right after the terminal frame races the frames still draining — and on Windows, closing a socket
/// that still has unread inbound data (the client's START frame usually is) gives an *abortive*
/// close, which discards the send buffer and takes the terminal frame with it. That is the same
/// silent truncation ADR-012's Consequences make a correctness failure, arriving on the path whose
/// entire job is to tell the consumer why it was refused.
async fn terminal_and_drain(
    mut socket: WebSocket,
    code: u8,
    detail: &str,
    json_frames_seen: &std::sync::atomic::AtomicU64,
) {
    let f = wire::frame(wire::TAG_TERMINAL, &wire::terminal_payload(code, detail));
    if wire::looks_like_json(&f) {
        json_frames_seen.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
    }
    if socket.send(Message::Binary(f.into())).await.is_err() {
        return;
    }
    let _ = tokio::time::timeout(PEER_DRAIN_TIMEOUT, async {
        while let Some(Ok(msg)) = socket.recv().await {
            if matches!(msg, Message::Close(_)) {
                break;
            }
        }
    })
    .await;
}

/// Read the START frame.
///
/// **Three outcomes, kept distinct.** An operation was started (`Ok(Some)`); the peer left without
/// starting one (`Ok(None)`); or the peer sent a START this producer cannot parse (`Err`). The
/// third used to collapse into the second, which dropped the socket with no terminal frame — a
/// silent truncation reached through the parser rather than through the writer, and `lib.rs` makes
/// that a correctness failure either way.
async fn read_start(
    socket: &mut WebSocket,
) -> std::result::Result<Option<OpenRequest>, &'static str> {
    while let Some(Ok(msg)) = socket.recv().await {
        if let Message::Binary(b) = msg {
            if b.first() == Some(&wire::TAG_START) {
                let len = wire::payload_len(&b)
                    .ok_or("malformed START frame: prefix shorter than the frame header")?;
                let payload = b
                    .get(wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len)
                    .ok_or("malformed START frame: payload shorter than its declared length")?;
                let (operation, params) = wire::parse_start(payload)
                    .ok_or("malformed START frame: operation and parameters did not parse")?;
                return Ok(Some(OpenRequest { operation, params }));
            }
        }
    }
    Ok(None)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// F4 (`STREAM-REGISTRY-BOUND-PREREGISTRATION.md` §3): a terminal record survives its own
    /// terminal and stays retained while younger than the declared age. Mirrors the kernel's own
    /// backdating shape (`kernel::skp::StreamRegistry`'s
    /// `sweep_expired_reclaims_an_old_cancelled_before_redeem_entry`): `ended_at` is backdated
    /// under this registry's own lock rather than waiting on real time.
    // MUTATION (T4), run at 2b99551, rustc 1.97.1 (8bab26f4f 2026-07-14): `record_terminal` removes the entry whose
    // terminal it records -- the drop at the terminal the ruling forbids.
    // `a_terminal_record_survives_its_terminal_and_is_kept_within_its_declared_age` failed:
    // Declared excerpt (copied by script):
    // test server::tests::a_terminal_record_survives_its_terminal_and_is_kept_within_its_declared_age ... FAILED
    //
    // failures:
    //
    // ---- server::tests::a_terminal_record_survives_its_terminal_and_is_kept_within_its_declared_age stdout ----
    //
    // thread 'server::tests::a_terminal_record_survives_its_terminal_and_is_kept_within_its_declared_age' (39468) panicked at protocol\data-plane\src\server.rs:642:18:
    // recorded above
    // Reverted; `git diff --stat` was empty afterward.
    #[test]
    fn a_terminal_record_survives_its_terminal_and_is_kept_within_its_declared_age() {
        let reg = StreamRegistry::default();

        let fresh = StreamState::new(OperationId::new(), StreamId::new());
        reg.record(fresh.clone());
        reg.record_terminal(&fresh.stream, Terminal::Completed);

        let aging = StreamState::new(OperationId::new(), StreamId::new());
        reg.record(aging.clone());
        reg.record_terminal(&aging.stream, Terminal::Completed);
        {
            let mut state = reg.state.lock().unwrap();
            let r = state
                .terminals
                .iter_mut()
                .find(|r| r.stream == aging.stream.as_str())
                .expect("recorded above");
            r.ended_at = Instant::now()
                .checked_sub(TERMINAL_RECORD_MAX_AGE - Duration::from_secs(1))
                .expect(
                    "process uptime exceeds TERMINAL_RECORD_MAX_AGE; re-run once the machine has \
                     been up longer",
                );
        }

        // The next `record` runs the prune (this file's `prune_locked`) without waiting on either
        // bound.
        reg.record(StreamState::new(OperationId::new(), StreamId::new()));

        let ids: Vec<String> = reg.terminals().into_iter().map(|(id, _)| id).collect();
        assert!(
            ids.contains(&fresh.stream.as_str().to_string()),
            "the entry at its own terminal must survive it"
        );
        assert!(
            ids.contains(&aging.stream.as_str().to_string()),
            "younger than the declared age, so it is kept"
        );
    }

    /// F5: a terminal record older than the declared age is pruned on the next `record`, and the
    /// unrelated live entry recorded before it is untouched.
    // MUTATION (T5), run at 2b99551, rustc 1.97.1 (8bab26f4f 2026-07-14): the age prune is removed; only the count
    // prune runs. `a_terminal_record_older_than_its_declared_age_is_pruned_on_the_next_record` failed:
    // Declared excerpt (copied by script):
    // test server::tests::a_terminal_record_older_than_its_declared_age_is_pruned_on_the_next_record ... FAILED
    //
    // failures:
    //
    // ---- server::tests::a_terminal_record_older_than_its_declared_age_is_pruned_on_the_next_record stdout ----
    //
    // thread 'server::tests::a_terminal_record_older_than_its_declared_age_is_pruned_on_the_next_record' (48648) panicked at protocol\data-plane\src\server.rs:686:9:
    // older than the declared age, so it is pruned
    // Reverted; `git diff --stat` was empty afterward.
    #[test]
    fn a_terminal_record_older_than_its_declared_age_is_pruned_on_the_next_record() {
        let reg = StreamRegistry::default();

        let live = StreamState::new(OperationId::new(), StreamId::new());
        reg.record(live.clone());

        let old = StreamState::new(OperationId::new(), StreamId::new());
        reg.record(old.clone());
        reg.record_terminal(&old.stream, Terminal::Completed);
        {
            let mut state = reg.state.lock().unwrap();
            let r = state
                .terminals
                .iter_mut()
                .find(|r| r.stream == old.stream.as_str())
                .expect("recorded above");
            r.ended_at = Instant::now()
                .checked_sub(TERMINAL_RECORD_MAX_AGE + Duration::from_secs(1))
                .expect(
                    "process uptime exceeds TERMINAL_RECORD_MAX_AGE; re-run once the machine has \
                     been up longer",
                );
        }

        reg.record(StreamState::new(OperationId::new(), StreamId::new()));

        let ids: Vec<String> = reg.terminals().into_iter().map(|(id, _)| id).collect();
        assert!(
            !ids.contains(&old.stream.as_str().to_string()),
            "older than the declared age, so it is pruned"
        );

        let snap = reg.snapshot();
        assert!(
            snap.iter().any(|s| s.stream.as_str() == live.stream.as_str()),
            "the live entry, never terminal, must be retained"
        );
        assert!(
            !snap.iter().any(|s| s.stream.as_str() == old.stream.as_str()),
            "the pruned terminal record's StreamState must be dropped with it"
        );
    }
}
