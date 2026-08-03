//! The transport-neutral operation/stream interface.
//!
//! This is binding-level scaffolding for a transport measurement. It is NOT the semantic API
//! (ADR-004: "one semantic API, multiple optimized *bindings*" — a binding is not the API), and it
//! is not SKP. Per the preregistration's §5, nothing in this file may name a socket, a URL, an HTTP
//! status, a header, a port, a close code, or an opcode. Adapter-specific detail is confined to an
//! opaque `detail` string on `TerminalError`.
//!
//! What this file is allowed to know about: operations, streams, batches, cancellation, progress,
//! terminal errors, and demand/credit. Nothing else.

use std::sync::atomic::{AtomicBool, AtomicU64, AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::Instant;

/// Opaque, harness-allocated identifier. Deliberately a *string*, never a JSON number:
/// ADR-004 amendment 1 found a plain f64 crossing the webview IPC boundary was not reliably
/// bit-exact, so anything requiring exact identity does not travel as a JSON number. Using an
/// opaque string sidesteps that whole class rather than mitigating it.
///
/// Shape and value-space are identical across both adapters — reading two logs, you cannot tell
/// which adapter produced which id. Never a URL path segment, never a subprotocol string.
#[derive(Clone, Debug, PartialEq, Eq, Hash, serde::Serialize)]
pub struct OperationId(String);

#[derive(Clone, Debug, PartialEq, Eq, Hash, serde::Serialize)]
pub struct StreamId(String);

/// Monotonic counter + fixed seed material, so ids are reproducible and adapter-independent.
static ID_COUNTER: AtomicU64 = AtomicU64::new(0);

fn next_opaque(prefix: &str) -> String {
    // 26 lowercase base32 chars, ULID-shaped, derived from a counter and a per-process nonce.
    // Deterministic enough to reproduce, opaque enough that nothing downstream can parse meaning
    // out of it.
    let n = ID_COUNTER.fetch_add(1, Ordering::Relaxed);
    let nonce = std::process::id() as u64;
    let mut v = (n << 20) ^ nonce.rotate_left(17);
    let alphabet = b"0123456789abcdefghjkmnpqrstvwxyz";
    let mut out = String::with_capacity(26);
    for _ in 0..26 {
        out.push(alphabet[(v & 31) as usize] as char);
        v = v.rotate_right(5) ^ 0x9e37_79b9_7f4a_7c15;
    }
    format!("{prefix}_{out}")
}

impl OperationId {
    pub fn new() -> Self {
        Self(next_opaque("op"))
    }
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl StreamId {
    pub fn new() -> Self {
        Self(next_opaque("st"))
    }
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

/// The one operation this harness supports. Deliberately singular: a command catalog beyond this
/// would be authoring SKP v0 (docs/10's specification checklist), which is out of scope.
///
/// `allow(dead_code)`: this and `Progress` below define the neutral operation surface that the
/// wire layer encodes. They are kept as the written statement of that surface rather than deleted
/// because they are what a reader checks the framing against — the alternative is that the
/// interface exists only implicitly, in `wire.rs` byte offsets.
#[allow(dead_code)]
#[derive(Clone, Debug, serde::Serialize)]
pub struct ProduceBatches {
    pub operation: OperationId,
    pub total_rows: usize,
    pub rows_per_batch: usize,
}

/// Terminal outcome taxonomy. One taxonomy for both adapters; adapter specifics live only in
/// `detail`. An enum shaped `Http(u16) | WsClose(u16)` would be a leak and is what this prevents.
///
/// `DecodeFailed` is never constructed producer-side — decoding happens in the consumer — but it
/// belongs to the taxonomy because there is exactly *one* taxonomy shared by both ends. Splitting
/// it per-end would let the two drift.
#[allow(dead_code)]
#[derive(Clone, Debug, PartialEq, Eq, serde::Serialize)]
#[serde(tag = "kind", content = "detail")]
pub enum Terminal {
    Completed,
    Cancelled(String),
    ProducerFailed(String),
    TransportFailed(String),
    DecodeFailed(String),
}

/// Progress. Counters are integers, never JSON floats (ADR-004 amendment 1).
#[allow(dead_code)]
#[derive(Clone, Copy, Debug, serde::Serialize)]
pub struct Progress {
    pub batches_emitted: u64,
    pub bytes_emitted: u64,
    pub batches_total: u64,
}

/// Shared cancellation + accounting state for one stream.
///
/// `observed_at` is the producer's *own* instant, captured the moment the producer learns the
/// stream is cancelled **through its own data transport**. H2 forbids measuring this client-side —
/// that is precisely the mistake spike M5 made and flagged.
pub struct StreamState {
    pub stream: StreamId,
    cancelled: AtomicBool,
    observed_at: std::sync::Mutex<Option<Instant>>,
    /// Payload bytes the producer is currently holding (queued + in construction). This counter,
    /// not an OS memory reading, is what H3's bounded-memory claim actually rests on.
    resident_bytes: AtomicUsize,
    batches_generated: AtomicU64,
    /// Batches generated strictly after cancellation was observed. H2 allows at most 1.
    batches_after_cancel: AtomicU64,
    bytes_emitted: AtomicU64,
}

impl StreamState {
    pub fn new(stream: StreamId) -> Arc<Self> {
        Arc::new(Self {
            stream,
            cancelled: AtomicBool::new(false),
            observed_at: std::sync::Mutex::new(None),
            resident_bytes: AtomicUsize::new(0),
            batches_generated: AtomicU64::new(0),
            batches_after_cancel: AtomicU64::new(0),
            bytes_emitted: AtomicU64::new(0),
        })
    }

    /// Called by an adapter the instant it observes cancellation on its own transport.
    /// Idempotent: only the first observation records the instant.
    pub fn observe_cancel(&self, at: Instant) {
        if !self.cancelled.swap(true, Ordering::SeqCst) {
            *self.observed_at.lock().unwrap_or_else(|e| e.into_inner()) = Some(at);
        }
    }

    pub fn is_cancelled(&self) -> bool {
        self.cancelled.load(Ordering::SeqCst)
    }

    pub fn observed_at(&self) -> Option<Instant> {
        *self.observed_at.lock().unwrap_or_else(|e| e.into_inner())
    }

    pub fn note_generated(&self, bytes: usize) {
        self.batches_generated.fetch_add(1, Ordering::Relaxed);
        if self.is_cancelled() {
            self.batches_after_cancel.fetch_add(1, Ordering::Relaxed);
        }
        self.resident_bytes.fetch_add(bytes, Ordering::Relaxed);
    }

    pub fn note_written(&self, bytes: usize) {
        self.resident_bytes.fetch_sub(bytes, Ordering::Relaxed);
        self.bytes_emitted.fetch_add(bytes as u64, Ordering::Relaxed);
    }

    pub fn resident_bytes(&self) -> usize {
        self.resident_bytes.load(Ordering::Relaxed)
    }
    pub fn batches_generated(&self) -> u64 {
        self.batches_generated.load(Ordering::Relaxed)
    }
    pub fn batches_after_cancel(&self) -> u64 {
        self.batches_after_cancel.load(Ordering::Relaxed)
    }
    pub fn bytes_emitted(&self) -> u64 {
        self.bytes_emitted.load(Ordering::Relaxed)
    }
}

/// BEGIN/END checkpoints — ADR-010 rule 7's fourth bullet, and the property M4's forensics found
/// load-bearing: "the last BEGIN with no matching END names the culprit". This is what makes
/// cancel-during-production, cancel-during-transfer and cancel-during-decode separable in the
/// results rather than one undifferentiated stall.
#[derive(Default)]
pub struct Checkpoints {
    entries: std::sync::Mutex<Vec<(String, bool)>>,
}

impl Checkpoints {
    pub fn begin(&self, phase: &str) {
        self.entries.lock().unwrap_or_else(|e| e.into_inner()).push((phase.to_string(), true));
    }
    pub fn end(&self, phase: &str) {
        self.entries.lock().unwrap_or_else(|e| e.into_inner()).push((phase.to_string(), false));
    }
    /// The last BEGIN with no matching END. `None` means every phase closed cleanly.
    pub fn dangling(&self) -> Option<String> {
        let entries = self.entries.lock().unwrap_or_else(|e| e.into_inner());
        let mut depth: std::collections::HashMap<&str, i32> = std::collections::HashMap::new();
        for (phase, is_begin) in entries.iter() {
            *depth.entry(phase.as_str()).or_insert(0) += if *is_begin { 1 } else { -1 };
        }
        entries
            .iter()
            .rev()
            .find(|(p, b)| *b && depth.get(p.as_str()).copied().unwrap_or(0) > 0)
            .map(|(p, _)| p.clone())
    }
}
