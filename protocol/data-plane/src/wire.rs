// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Binary framing for the data channel.
//!
//! Transport-level, deliberately kept out of `transport.rs` (which is the transport-neutral
//! interface and may not name framing at all).
//!
//! **Every frame is fixed-layout binary. No JSON crosses the data channel in either direction**
//! (ADR-004; `docs/10`). Counters are integers, never JSON floats (ADR-004 amendment 1).
//!
//! ```text
//! [u8 tag][3 reserved zero bytes][u32 big-endian payload_len][payload_len bytes]
//! ```
//!
//! **The prefix is 8 bytes and the three reserved bytes are load-bearing.** Arrow IPC hands out
//! buffer *views* only when its message start is 8-byte aligned. Carried forward from the bake-off
//! as a structural requirement; whether it buys shared buffers **on this slice's variable-width
//! GeoArrow payload** is a separate question, measured by the consumer at run time and not inherited
//! (the bake-off's own scope note says buffer-sharing results are conditional on payload shape).

/// Producer → consumer.
pub const TAG_OPEN: u8 = 0x0f;
pub const TAG_BATCH: u8 = 0x10;
pub const TAG_PROGRESS: u8 = 0x11;
pub const TAG_TERMINAL: u8 = 0x12;

/// Consumer → producer.
pub const TAG_CREDIT: u8 = 0x01;
pub const TAG_CANCEL: u8 = 0x02;
/// Starts the one operation. Carries an opaque parameter blob the binding does not interpret.
pub const TAG_START: u8 = 0x03;

/// Terminal codes — one taxonomy, binding specifics in the trailing UTF-8 detail.
pub const TERM_COMPLETED: u8 = 0;
pub const TERM_CANCELLED: u8 = 1;
pub const TERM_PRODUCER_FAILED: u8 = 2;
pub const TERM_TRANSPORT_FAILED: u8 = 3;
pub const TERM_DECODE_FAILED: u8 = 4;

pub const FRAME_PREFIX_LEN: usize = 8;

/// Write a frame prefix placeholder into an empty buffer, to be patched by [`patch_len`] once the
/// payload has been appended. This is what lets a producer serialize **directly** into the framed
/// buffer instead of serializing and then copying into one.
pub fn reserve_prefix(out: &mut Vec<u8>, tag: u8) {
    out.clear();
    out.push(tag);
    out.extend_from_slice(&[0, 0, 0, 0, 0, 0, 0]);
    debug_assert_eq!(out.len(), FRAME_PREFIX_LEN);
}

/// Patch the length field of a buffer whose payload was appended after [`reserve_prefix`].
pub fn patch_len(out: &mut [u8]) -> Result<(), String> {
    if out.len() < FRAME_PREFIX_LEN {
        return Err("frame shorter than its own prefix".into());
    }
    let len = out.len() - FRAME_PREFIX_LEN;
    if len > u32::MAX as usize {
        return Err(format!("payload of {len} bytes does not fit a u32 length"));
    }
    out[4..8].copy_from_slice(&(len as u32).to_be_bytes());
    Ok(())
}

pub fn frame(tag: u8, payload: &[u8]) -> Vec<u8> {
    let mut out = Vec::with_capacity(FRAME_PREFIX_LEN + payload.len());
    reserve_prefix(&mut out, tag);
    out.extend_from_slice(payload);
    patch_len(&mut out).expect("payload length checked by construction");
    out
}

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

/// The START payload: `[u16 op_len][op utf8][u32 params_len][params]`.
///
/// Fixed-layout binary like everything else on this channel. The operation parameters are opaque
/// bytes here; only the module that owns the operation decodes them.
pub fn start_payload(operation: &str, params: &[u8]) -> Vec<u8> {
    let mut p = Vec::with_capacity(2 + operation.len() + 4 + params.len());
    p.extend_from_slice(&(operation.len() as u16).to_be_bytes());
    p.extend_from_slice(operation.as_bytes());
    p.extend_from_slice(&(params.len() as u32).to_be_bytes());
    p.extend_from_slice(params);
    p
}

pub fn parse_start(payload: &[u8]) -> Option<(String, Vec<u8>)> {
    let op_len = u16::from_be_bytes(payload.get(..2)?.try_into().ok()?) as usize;
    let op = std::str::from_utf8(payload.get(2..2 + op_len)?).ok()?.to_string();
    let at = 2 + op_len;
    let params_len = u32::from_be_bytes(payload.get(at..at + 4)?.try_into().ok()?) as usize;
    let params = payload.get(at + 4..at + 4 + params_len)?.to_vec();
    Some((op, params))
}

/// Applied to every frame before it goes on the wire: no frame may be JSON.
///
/// A byte-level check rather than a promise. Interleaving JSON progress or metadata onto the data
/// channel and still reporting "JSON-free" is the specific dishonesty this exists to prevent.
pub fn looks_like_json(frame_bytes: &[u8]) -> bool {
    let payload = if frame_bytes.len() > FRAME_PREFIX_LEN {
        &frame_bytes[FRAME_PREFIX_LEN..]
    } else {
        return false;
    };
    matches!(payload.iter().find(|b| !b.is_ascii_whitespace()), Some(b'{') | Some(b'['))
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
        assert_eq!(FRAME_PREFIX_LEN % 8, 0);
        let f = frame(TAG_BATCH, &[9; 32]);
        assert_eq!(f.len() % 8, 0);
    }

    #[test]
    fn a_payload_serialized_in_place_is_framed_without_a_second_pass() {
        // The property that keeps the producer from copying every batch: the payload is written
        // straight into the framed buffer and only the length field is patched afterwards.
        let mut buf = Vec::new();
        reserve_prefix(&mut buf, TAG_BATCH);
        buf.extend_from_slice(&[7u8; 100]); // stands in for a serializer appending its output
        patch_len(&mut buf).unwrap();
        assert_eq!(payload_len(&buf), Some(100));
        assert_eq!(buf.len(), FRAME_PREFIX_LEN + 100);
    }

    #[test]
    fn start_payloads_roundtrip_with_opaque_parameters() {
        let params = vec![0xDE, 0xAD, 0xBE, 0xEF];
        let f = start_payload("stream_features", &params);
        let (op, got) = parse_start(&f).unwrap();
        assert_eq!(op, "stream_features");
        assert_eq!(got, params);
        assert!(parse_start(&f[..3]).is_none(), "a truncated START does not half-parse");
    }

    #[test]
    fn progress_and_terminal_payloads_are_fixed_layout_binary() {
        let p = progress_payload(7, 1234, crate::transport::UNKNOWN_TOTAL);
        assert_eq!(p.len(), 24);
        assert!(!looks_like_json(&frame(TAG_PROGRESS, &p)));

        let t = terminal_payload(TERM_CANCELLED, "peer closed");
        assert_eq!(t[0], TERM_CANCELLED);
        assert!(!looks_like_json(&frame(TAG_TERMINAL, &t)));
    }

    #[test]
    fn the_json_detector_actually_catches_json() {
        assert!(looks_like_json(&frame(TAG_PROGRESS, br#"{"batches":7}"#)));
        assert!(looks_like_json(&frame(TAG_PROGRESS, br#"  [1,2,3]"#)));
        // Arrow IPC streams start with the 0xFFFFFFFF continuation marker, never '{' or '['.
        assert!(!looks_like_json(&frame(TAG_BATCH, &[0xff, 0xff, 0xff, 0xff, 0x00])));
    }
}
