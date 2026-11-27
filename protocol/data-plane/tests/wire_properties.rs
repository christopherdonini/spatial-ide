// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The property-testing trial's P2: the data-plane wire format, no panic on bounded bytes and round
//! trip (its preregistration, section 3). Calls only `wire`'s public functions.
//!
//! The producer's START read is `read_start` in `server.rs`: `payload_len`, the payload slice, then
//! `parse_start`. It is private and reads a socket, so `read_start_steps` applies the same three
//! steps to bytes. `frame` is the producer's writer; `start_payload` mirrors the shell's `startFrame`
//! and has no production caller of its own. The production reader of the producer's frames is the
//! shell's `FrameDecoder`, which the shell's own wire property covers: nothing here pairs a Rust
//! writer with a TypeScript reader.
//!
//! The no-panic claim is for the 64-bit targets the CI builds. 256 cases per property; each input's
//! size is bounded at its generator. A failing case is saved to the pinned persistence file and
//! replays on every run.

use proptest::prelude::*;
use proptest::test_runner::FileFailurePersistence;
use spatial_data_plane::wire::{
    frame, looks_like_json, parse_start, payload_len, start_payload, FRAME_PREFIX_LEN, TAG_START,
};

fn config() -> ProptestConfig {
    ProptestConfig {
        cases: 256,
        failure_persistence: Some(Box::new(FileFailurePersistence::Direct(
            "proptest-regressions/wire_properties.txt",
        ))),
        ..ProptestConfig::default()
    }
}

/// The three steps of `read_start`, on bytes.
fn read_start_steps(b: &[u8]) -> Option<(String, Vec<u8>)> {
    let len = payload_len(b)?;
    let payload = b.get(FRAME_PREFIX_LEN..FRAME_PREFIX_LEN + len)?;
    parse_start(payload)
}

/// Every wire read that takes bytes off the socket; the claim is only that none of them panics.
fn read_everything(b: &[u8]) {
    std::hint::black_box(read_start_steps(b));
    std::hint::black_box(parse_start(b));
    std::hint::black_box(payload_len(b));
    std::hint::black_box(looks_like_json(b));
}

fn name_of(chars: Vec<char>) -> String {
    chars.into_iter().collect()
}

/// How a valid START payload is cut or altered. The cut lengths are half anywhere and half within 3
/// bytes after the start of one of the payload's fields, so the parser's later reads are reached.
#[derive(Debug, Clone)]
enum Mutation {
    CutAnywhere(u16),
    /// `field`: 0 the op length, 1 the op, 2 the params length, 3 the params.
    CutNearField {
        field: u8,
        delta: u8,
    },
    Replace {
        at: u16,
        byte: u8,
    },
}

fn mutation() -> impl Strategy<Value = Mutation> {
    prop_oneof![
        any::<u16>().prop_map(Mutation::CutAnywhere),
        (0u8..4, 0u8..=3).prop_map(|(field, delta)| Mutation::CutNearField { field, delta }),
        (any::<u16>(), any::<u8>()).prop_map(|(at, byte)| Mutation::Replace { at, byte }),
    ]
}

fn apply(m: &Mutation, mut payload: Vec<u8>, op_bytes: usize) -> Vec<u8> {
    match *m {
        Mutation::CutAnywhere(sel) => payload.truncate(sel as usize % (payload.len() + 1)),
        Mutation::CutNearField { field, delta } => {
            let starts = [0, 2, 2 + op_bytes, 2 + op_bytes + 4];
            payload.truncate(starts[field as usize] + delta as usize);
        }
        Mutation::Replace { at, byte } => {
            let i = at as usize % payload.len();
            payload[i] = byte;
        }
    }
    payload
}

proptest! {
    #![proptest_config(config())]

    /// (a), first kind: any byte string of 0 to 256 bytes.
    #[test]
    fn a_any_bytes_do_not_panic_the_start_reads(bytes in prop::collection::vec(any::<u8>(), 0..=256)) {
        read_everything(&bytes);
    }

    /// (a), second kind: a valid START payload (an operation name of 0 to 16 chars, params of 0 to 64
    /// bytes) cut or with one byte replaced, then framed.
    #[test]
    fn a_cut_or_altered_start_payload_does_not_panic_the_start_reads(
        op in prop::collection::vec(any::<char>(), 0..=16),
        params in prop::collection::vec(any::<u8>(), 0..=64),
        m in mutation(),
    ) {
        let op = name_of(op);
        let payload = apply(&m, start_payload(&op, &params), op.len());
        read_everything(&frame(TAG_START, &payload));
    }

    /// (b): the frame layout, for any tag and any payload of 0 to 1024 bytes.
    #[test]
    fn b_a_frame_is_its_prefix_then_the_payload(
        tag in any::<u8>(),
        payload in prop::collection::vec(any::<u8>(), 0..=1024),
    ) {
        let f = frame(tag, &payload);
        prop_assert_eq!(f.len(), payload.len() + 8);
        prop_assert_eq!(f[0], tag);
        prop_assert_eq!(&f[1..4], &[0u8, 0, 0][..]);
        prop_assert_eq!(payload_len(&f), Some(payload.len()));
        prop_assert_eq!(&f[FRAME_PREFIX_LEN..], &payload[..]);
    }

    /// (c): the three steps of `read_start`, applied to a framed START payload, return what was written.
    #[test]
    fn c_a_framed_start_reads_back_as_written(
        op in prop::collection::vec(any::<char>(), 0..=16),
        params in prop::collection::vec(any::<u8>(), 0..=64),
    ) {
        let op = name_of(op);
        let f = frame(TAG_START, &start_payload(&op, &params));
        prop_assert_eq!(read_start_steps(&f), Some((op, params)));
    }
}
