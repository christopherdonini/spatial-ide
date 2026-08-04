//! The transport-neutral operation/stream interface.
//!
//! **Permitted vocabulary:** operation, stream, batch, cancel, progress, terminal error,
//! demand/credit. **Forbidden anywhere in this file:** socket, websocket, URL, path, HTTP status,
//! header, fetch, `Response`, port, close code, opcode. That list is not a style guide — it is
//! ADR-004's "one semantic API, multiple optimized *bindings*" made checkable, and
//! `tests/no_transport_leakage.rs` scans this file for every word on it.
//!
//! Nothing here knows what a batch contains, either. A batch source appends bytes to a buffer; what
//! those bytes mean belongs to the module that produced them.

use std::sync::atomic::{AtomicBool, AtomicU64, AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::Instant;

/// Opaque, binding-allocated identifier. Deliberately a *string*, never a JSON number: ADR-004
/// amendment 1 found a plain f64 crossing the webview IPC boundary was not reliably bit-exact, so
/// anything requiring exact identity does not travel as a JSON number.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct OperationId(String);

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct StreamId(String);

static ID_COUNTER: AtomicU64 = AtomicU64::new(0);

fn next_opaque(prefix: &str) -> String {
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

impl Default for OperationId {
    fn default() -> Self {
        Self::new()
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

impl Default for StreamId {
    fn default() -> Self {
        Self::new()
    }
}

/// Terminal outcome taxonomy — one taxonomy for every binding, with binding specifics confined to
/// the opaque `detail` string. An enum shaped `Http(u16) | WsClose(u16)` would be the leak this
/// prevents.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Terminal {
    Completed,
    Cancelled(String),
    ProducerFailed(String),
    TransportFailed(String),
    /// Never constructed producer-side — decoding happens in the consumer — but it belongs to the
    /// taxonomy because there is exactly one taxonomy shared by both ends.
    DecodeFailed(String),
}

/// Progress counters. Integers, never JSON floats (ADR-004 amendment 1).
#[derive(Clone, Copy, Debug)]
pub struct Progress {
    pub batches_emitted: u64,
    pub bytes_emitted: u64,
    /// `UNKNOWN_TOTAL` when the producer cannot know it without a second pass over the source.
    pub batches_total: u64,
}

/// A streaming filter does not know how many batches it will produce without running twice.
/// Reporting `0` would read as "none"; this sentinel reads as "not known", and the consumer shows
/// indeterminate progress rather than a fabricated denominator (`docs/01` principle 8).
pub const UNKNOWN_TOTAL: u64 = u64::MAX;

/// What an operation needs to start, as the binding received it. `params` is **opaque**: the
/// binding carries it, the module that owns the operation interprets it.
#[derive(Clone, Debug)]
pub struct OpenRequest {
    pub operation: String,
    pub params: Vec<u8>,
}

/// A source of batches. Appends the next batch's bytes to a caller-provided buffer.
///
/// `out` may already contain bytes and must be appended to, never cleared — that is how the binding
/// gets its framing in front of a payload without a second pass over it. A source that knows why
/// those leading bytes are there would be a source that knows about framing.
pub trait BatchSource: Send {
    fn next_into(&mut self, out: &mut Vec<u8>) -> Option<Result<BatchMeta, String>>;

    /// `None` when the count is not knowable in advance.
    fn total_batches(&self) -> Option<u64> {
        None
    }
}

#[derive(Clone, Copy, Debug, Default)]
pub struct BatchMeta {
    pub rows: u64,
}

/// Cancellation, propagated to whatever is actually producing.
///
/// The binding calls this the instant it observes cancellation. ADR-004 amendment 2 disqualified a
/// transport because "a client abort never reaches the producer"; this trait is the thing that
/// makes reaching the producer structural rather than hoped for.
pub trait SourceCancel: Send + Sync {
    fn cancel(&self);
}

/// What a factory hands back: the batches, and the handle that stops whatever produces them.
///
/// The two travel together because they are useless apart — a source with no way to stop it is the
/// defect ADR-004 amendment 2 disqualified a transport over.
pub type CreatedSource = (Box<dyn BatchSource>, Arc<dyn SourceCancel>);

/// Creates a source for one operation. Implemented by the module that owns the operation.
pub trait SourceFactory: Send + Sync + 'static {
    fn create(&self, request: &OpenRequest) -> Result<CreatedSource, String>;
}

/// Shared cancellation and accounting state for one stream.
///
/// `observed_at` is the producer's *own* instant, captured the moment the producer learns the
/// stream is cancelled **through its own data transport**. Measuring this client-side is the
/// mistake spike M5 made and flagged.
pub struct StreamState {
    pub stream: StreamId,
    pub operation: OperationId,
    cancelled: AtomicBool,
    observed_at: std::sync::Mutex<Option<Instant>>,
    /// Payload bytes the producer is holding (queued + in construction). This counter, not an OS
    /// memory reading, is what the bounded-memory claim rests on.
    resident_bytes: AtomicUsize,
    peak_resident_bytes: AtomicUsize,
    batches_generated: AtomicU64,
    batches_after_cancel: AtomicU64,
    bytes_emitted: AtomicU64,
    rows_emitted: AtomicU64,
}

impl StreamState {
    pub fn new(operation: OperationId, stream: StreamId) -> Arc<Self> {
        Arc::new(Self {
            stream,
            operation,
            cancelled: AtomicBool::new(false),
            observed_at: std::sync::Mutex::new(None),
            resident_bytes: AtomicUsize::new(0),
            peak_resident_bytes: AtomicUsize::new(0),
            batches_generated: AtomicU64::new(0),
            batches_after_cancel: AtomicU64::new(0),
            bytes_emitted: AtomicU64::new(0),
            rows_emitted: AtomicU64::new(0),
        })
    }

    /// Called by a binding the instant it observes cancellation on its own transport. Idempotent:
    /// only the first observation records the instant.
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

    pub fn note_generated(&self, bytes: usize, rows: u64) {
        self.batches_generated.fetch_add(1, Ordering::SeqCst);
        self.rows_emitted.fetch_add(rows, Ordering::SeqCst);
        if self.is_cancelled() {
            self.batches_after_cancel.fetch_add(1, Ordering::SeqCst);
        }
        let now = self.resident_bytes.fetch_add(bytes, Ordering::SeqCst) + bytes;
        self.peak_resident_bytes.fetch_max(now, Ordering::SeqCst);
    }

    pub fn note_written(&self, bytes: usize) {
        self.resident_bytes.fetch_sub(bytes, Ordering::SeqCst);
        self.bytes_emitted.fetch_add(bytes as u64, Ordering::SeqCst);
    }

    pub fn resident_bytes(&self) -> usize {
        self.resident_bytes.load(Ordering::SeqCst)
    }
    pub fn peak_resident_bytes(&self) -> usize {
        self.peak_resident_bytes.load(Ordering::SeqCst)
    }
    pub fn batches_generated(&self) -> u64 {
        self.batches_generated.load(Ordering::SeqCst)
    }
    pub fn batches_after_cancel(&self) -> u64 {
        self.batches_after_cancel.load(Ordering::SeqCst)
    }
    pub fn bytes_emitted(&self) -> u64 {
        self.bytes_emitted.load(Ordering::SeqCst)
    }
    pub fn rows_emitted(&self) -> u64 {
        self.rows_emitted.load(Ordering::SeqCst)
    }
}

/// BEGIN/END checkpoints — ADR-010 rule 7's progress-observability clause, and the property M4's
/// forensics found load-bearing: "the last BEGIN with no matching END names the culprit".
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn identifiers_are_opaque_and_binding_independent() {
        let a = StreamId::new();
        let b = StreamId::new();
        assert_ne!(a.as_str(), b.as_str());
        assert!(a.as_str().starts_with("st_"));
        assert_eq!(a.as_str().len(), 29);
    }

    #[test]
    fn cancel_observation_is_idempotent_and_keeps_the_first_instant() {
        let s = StreamState::new(OperationId::new(), StreamId::new());
        let first = Instant::now();
        s.observe_cancel(first);
        std::thread::sleep(std::time::Duration::from_millis(2));
        s.observe_cancel(Instant::now());
        assert_eq!(s.observed_at().unwrap(), first);
    }

    #[test]
    fn batches_generated_after_cancellation_are_counted_separately() {
        let s = StreamState::new(OperationId::new(), StreamId::new());
        s.note_generated(100, 10);
        assert_eq!(s.batches_after_cancel(), 0);
        s.observe_cancel(Instant::now());
        s.note_generated(100, 10);
        assert_eq!(s.batches_after_cancel(), 1);
    }

    #[test]
    fn resident_bytes_track_a_peak_and_return_to_zero() {
        let s = StreamState::new(OperationId::new(), StreamId::new());
        s.note_generated(1000, 1);
        s.note_generated(1000, 1);
        assert_eq!(s.peak_resident_bytes(), 2000);
        s.note_written(1000);
        s.note_written(1000);
        assert_eq!(s.resident_bytes(), 0);
        assert_eq!(s.peak_resident_bytes(), 2000, "the peak is not forgotten");
    }

    #[test]
    fn checkpoints_name_the_phase_that_never_finished() {
        let c = Checkpoints::default();
        c.begin("open");
        c.end("open");
        c.begin("send");
        assert_eq!(c.dangling().as_deref(), Some("send"));
        c.end("send");
        assert_eq!(c.dangling(), None);
    }
}
