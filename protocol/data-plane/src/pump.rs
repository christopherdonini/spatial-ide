// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The producer pump: pulls batches from a source and frames them, on its own thread.
//!
//! Two properties this file exists to hold:
//!
//! **Reserve before generate.** Channel capacity is taken *before* a batch is asked for, so a
//! consumer that stops reading stops the producer at a hard plateau instead of one batch past it.
//! The bake-off established this shape; it is carried forward rather than re-derived.
//!
//! **Frame in place.** The framing prefix is written into the buffer first and the source appends
//! its payload after it, so a batch is serialized **once**, into the buffer that goes on the wire.
//! No claim is made here about copies below this level — ADR-004 requires copies to be "measured
//! and minimized, not assumed absent", and what the operating system and the browser do with these
//! bytes afterwards is not visible from this file.

use std::sync::Arc;

use bytes::Bytes;
use tokio::sync::mpsc;

use crate::transport::{BatchSource, StreamState};
use crate::wire;

pub(crate) enum PumpItem {
    /// A fully framed batch, ready to hand to the transport unchanged.
    Batch(Bytes),
    /// The source failed. Terminal, and never presented as the end of a complete stream (H7).
    Failed(String),
}

/// Spawn the pump. Returns the receiving half; the sending half lives on the pump thread.
///
/// **Thread-spawn failure is returned, not panicked.** It is reachable under thread or handle
/// exhaustion, on a per-connection path, and a panic here unwinds the connection's task and leaves
/// the peer with an aborted socket and no terminal frame — the same silent truncation the rest of
/// this crate treats as a correctness failure. `engine`'s equivalent call site already returns a
/// typed error; this one was the outlier.
pub(crate) fn spawn(
    mut source: Box<dyn BatchSource>,
    state: Arc<StreamState>,
    handle: tokio::runtime::Handle,
    capacity: usize,
    max_frame_bytes: usize,
) -> std::io::Result<mpsc::Receiver<PumpItem>> {
    let (tx, rx) = mpsc::channel::<PumpItem>(capacity);

    std::thread::Builder::new()
        .name("data-plane-pump".into())
        .spawn(move || {
            loop {
                if state.is_cancelled() {
                    break;
                }

                // Reserve first: nothing is generated until there is somewhere to put it.
                // `block_on` is safe here because this is a plain OS thread, never a runtime worker.
                let permit = match handle.block_on(tx.reserve()) {
                    Ok(p) => p,
                    Err(_) => break, // the consumer side is gone
                };

                let mut buf = Vec::new();
                wire::reserve_prefix(&mut buf, wire::TAG_BATCH);

                match source.next_into(&mut buf) {
                    None => break, // the source is finished
                    Some(Err(e)) => {
                        permit.send(PumpItem::Failed(e));
                        break;
                    }
                    Some(Ok(meta)) => {
                        if buf.len() - wire::FRAME_PREFIX_LEN > max_frame_bytes {
                            // ADR-010 rule 6: declared, and then actually enforced at the limit.
                            permit.send(PumpItem::Failed(format!(
                                "batch of {} bytes exceeds the declared frame ceiling {}",
                                buf.len() - wire::FRAME_PREFIX_LEN,
                                max_frame_bytes
                            )));
                            break;
                        }
                        if let Err(e) = wire::patch_len(&mut buf) {
                            permit.send(PumpItem::Failed(e));
                            break;
                        }
                        state.note_generated(buf.len(), meta.rows);
                        permit.send(PumpItem::Batch(Bytes::from(buf)));
                    }
                }
            }
        })?;

    Ok(rx)
}
