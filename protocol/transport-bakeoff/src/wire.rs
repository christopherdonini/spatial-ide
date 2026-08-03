//! Adapter-shared binary framing.
//!
//! This is **transport-level**, deliberately kept out of `transport.rs` (which is the
//! transport-neutral interface and may not name framing at all). Both adapters use the identical
//! frame layout so that the browser consumer's frame decoder is literally shared code and only the
//! byte *source* differs — which is what makes "identical consumer for both candidates" a fact
//! rather than a claim.
//!
//! **Every frame is fixed-layout binary. No JSON crosses the data channel in either direction**
//! (ADR-004; README H5). Counters are integers, never JSON floats (ADR-004 amendment 1).
//!
//! Layout, both directions:
//!
//! ```text
//! [u8 tag][3 reserved zero bytes][u32 big-endian payload_len][payload_len bytes]
//! ```
//!
//! **The prefix is 8 bytes, not 5, and the three reserved bytes are load-bearing.** Arrow IPC needs
//! its message start 8-byte aligned to hand out buffer *views*; at a 5-byte prefix the payload
//! lands on offset 5 and `tableFromIPC` silently copies the whole batch to realign it. Measured on
//! the first smoke run: `arrowParseSharesBuffer` was 0/100 on both candidates with a 5-byte prefix.
//! That is a full extra copy of the entire payload, on the hot path, caused purely by framing —
//! precisely the class of cost ADR-004's copy-minimized clause exists to catch.

/// Producer -> consumer.
///
/// `TAG_OPEN` carries the harness-allocated operation and stream ids **in band, as opaque UTF-8**.
/// They deliberately do not travel as a URL path segment, a subprotocol string, or a request-id
/// header — that would make the identifier's representation transport-specific, which is exactly
/// the leakage H6 forbids. In-band means the identical mechanism works for both candidates.
pub const TAG_OPEN: u8 = 0x0f;
pub const TAG_BATCH: u8 = 0x10;
pub const TAG_PROGRESS: u8 = 0x11;
pub const TAG_TERMINAL: u8 = 0x12;

/// Consumer -> producer (Candidate A only; Candidate B carries no consumer->producer channel,
/// which is itself a finding for the tie-break's "smaller security surface" criterion).
pub const TAG_CREDIT: u8 = 0x01;
pub const TAG_CANCEL: u8 = 0x02;

/// Terminal codes. A single taxonomy shared by both adapters; adapter specifics ride in the
/// trailing UTF-8 detail, never in the code itself.
pub const TERM_COMPLETED: u8 = 0;
pub const TERM_CANCELLED: u8 = 1;
pub const TERM_PRODUCER_FAILED: u8 = 2;
pub const TERM_TRANSPORT_FAILED: u8 = 3;
pub const TERM_DECODE_FAILED: u8 = 4;

/// One tag byte, three reserved zero bytes, one big-endian u32 length. Sized so the payload starts
/// 8-byte aligned — see the module comment; this is a measured copy, not a stylistic choice.
pub const FRAME_PREFIX_LEN: usize = 8;

pub fn frame(tag: u8, payload: &[u8]) -> Vec<u8> {
    let mut out = Vec::with_capacity(FRAME_PREFIX_LEN + payload.len());
    out.push(tag);
    out.extend_from_slice(&[0, 0, 0]);
    out.extend_from_slice(&(payload.len() as u32).to_be_bytes());
    out.extend_from_slice(payload);
    out
}

/// Reads the payload length out of a frame prefix.
pub fn payload_len(prefix: &[u8]) -> Option<usize> {
    let b: [u8; 4] = prefix.get(4..8)?.try_into().ok()?;
    Some(u32::from_be_bytes(b) as usize)
}

pub fn progress_payload(batches: u64, bytes: u64, total: u64) -> Vec<u8> {
    let mut p = Vec::with_capacity(24);
    p.extend_from_slice(&batches.to_be_bytes());
    p.extend_from_slice(&bytes.to_be_bytes());
    p.extend_from_slice(&total.to_be_bytes());
    p
}

pub fn terminal_payload(code: u8, detail: &str) -> Vec<u8> {
    let mut p = Vec::with_capacity(1 + detail.len());
    p.push(code);
    p.extend_from_slice(detail.as_bytes());
    p
}

/// H5's assertion, applied to a frame before it goes on the wire: no frame may be JSON.
///
/// A byte-level check rather than a promise. Interleaving JSON progress or metadata onto the data
/// channel and still reporting "JSON-free" is the specific dishonesty this exists to prevent, so
/// the check runs on every frame and the count is reported as an explicit `0`.
pub fn looks_like_json(frame_bytes: &[u8]) -> bool {
    // Skip the binary header; inspect the payload's first non-whitespace byte.
    let payload = if frame_bytes.len() > FRAME_PREFIX_LEN {
        &frame_bytes[FRAME_PREFIX_LEN..]
    } else {
        return false;
    };
    match payload.iter().find(|b| !b.is_ascii_whitespace()) {
        Some(b'{') | Some(b'[') => true,
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn frame_layout_roundtrips() {
        let f = frame(TAG_BATCH, &[1, 2, 3, 4]);
        assert_eq!(f[0], TAG_BATCH);
        assert_eq!(&f[1..4], &[0, 0, 0], "reserved bytes keep the payload 8-byte aligned");
        assert_eq!(payload_len(&f), Some(4));
        assert_eq!(&f[FRAME_PREFIX_LEN..], &[1, 2, 3, 4]);
    }

    #[test]
    fn payload_starts_eight_byte_aligned() {
        // Regression guard for the measured copy: at a 5-byte prefix, Arrow IPC could not hand out
        // buffer views and `tableFromIPC` copied every batch to realign it.
        assert_eq!(FRAME_PREFIX_LEN % 8, 0);
        let f = frame(TAG_BATCH, &[9; 32]);
        assert_eq!(f.len() % 8, 0);
    }

    #[test]
    fn progress_and_terminal_payloads_are_fixed_layout_binary() {
        let p = progress_payload(7, 1234, 100);
        assert_eq!(p.len(), 24);
        assert!(!looks_like_json(&frame(TAG_PROGRESS, &p)));

        let t = terminal_payload(TERM_CANCELLED, "client abort");
        assert_eq!(t[0], TERM_CANCELLED);
        assert!(!looks_like_json(&frame(TAG_TERMINAL, &t)));
    }

    #[test]
    fn json_detector_actually_catches_json() {
        // Guard against the gate being vacuous: it must fire on real JSON.
        assert!(looks_like_json(&frame(TAG_PROGRESS, br#"{"batches":7}"#)));
        assert!(looks_like_json(&frame(TAG_PROGRESS, br#"  [1,2,3]"#)));
        // Arrow IPC streams start with the 0xFFFFFFFF continuation marker, never '{' or '['.
        assert!(!looks_like_json(&frame(TAG_BATCH, &[0xff, 0xff, 0xff, 0xff, 0x00])));
    }
}
