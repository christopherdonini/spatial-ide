// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The one implemented adapter — a binary WebSocket, provisionally chosen.**
//!
//! ## Status, stated where it cannot be missed
//!
//! **ADR-012 is Proposed. No §19.9 branch selected a candidate.** Phase 3's own words: rule 4 fired
//! at configuration M alone and "that is the ordering's verdict at one configuration, not a
//! transport decision"; configuration S failed twice; rule 7 (batch-size dependence) is still not
//! evaluable; and the N=2 concurrency block — the one that *inverted* the ranking in Candidate B's
//! favour — is inadmissible on an accounting defect, not on any reason to think its timings wrong.
//!
//! What licenses building on Candidate A anyway is **not** rule 5, which preregisters only "stays
//! Proposed": it is `protocol/transport-bakeoff/README.md` **§19.10's sequencing**, whose step 3
//! builds the `protocol/` data plane and the first `engine/` scaffolding against a **provisional**
//! winner, and which declares its own circular gate — *if the hero-slice confirmation falsifies the
//! provisional choice, step 3 is rework.* This adapter is that provisional choice. It is **not a
//! transport decision and may not be cited as one.**
//!
//! Two open risks point at this file specifically, and both re-open the question rather than being
//! settled by it: a properly accounted N=2 block reproducing the concurrency inversion (ADR-012 open
//! risk 1 — and this slice sustains exactly the transient two-stream overlap that raises it), and an
//! incremental Arrow reader removing the copy differential (open risk 2).
//!
//! **No throughput or copy figure appears in this file or is claimed from it** (ADR-012 open risk 3:
//! "No throughput-based claim may cite this ADR"), and no zero-copy claim is made for either
//! candidate (ADR-004; §19.9 rule 6 — an unknown internal copy count is not a win).
//!
//! ## Mechanism
//!
//! Backpressure is explicit application credit: the consumer grants credit as fixed-layout binary
//! control frames, and the writer only takes a batch off the pump when it holds credit.
//! Cancellation is observed **through this adapter's own transport** — a CANCEL control frame, a
//! peer close, or the receive half erroring — and is immediately propagated to the source, which is
//! what makes the producer actually stop rather than merely be told.

use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::time::Instant;

use axum::extract::ws::{Message, WebSocket};
use futures::{SinkExt, StreamExt};
use tokio::sync::{mpsc, watch, Semaphore};

use crate::pump::PumpItem;
use crate::transport::{Checkpoints, SourceCancel, StreamState, Terminal, UNKNOWN_TOTAL};
use crate::wire;

/// H5, byte-level: no frame on the data channel may be JSON, **in either direction**.
///
/// Checked at every send and on every inbound control frame rather than on batches alone. The
/// requirement is "zero JSON bytes on the data path, in either direction"; a counter that only ever
/// looked at batch payloads would report `0` while progress, terminal or control frames carried
/// JSON, which is precisely the kind of self-flattering instrument this project keeps catching.
fn note_if_json(counter: &AtomicU64, bytes: &[u8]) {
    if wire::looks_like_json(bytes) {
        counter.fetch_add(1, Ordering::Relaxed);
    }
}

/// Drive one stream to a terminal outcome.
///
/// The receive half runs in its own task so a CANCEL frame is parsed and `observe_cancel` is
/// stamped **while a send is still pending**. A single `select!` structure cannot do this —
/// `tokio::select!` cannot poll a receive while `send().await` holds the loop — and the bake-off
/// recorded the resulting cancel-blind window as a real defect (§18 P1). The measurement point is
/// therefore independent of send progress.
#[allow(clippy::too_many_arguments)] // one call site; grouping these into a struct would only move
                                     // the same eight values behind a name that adds nothing
pub(crate) async fn drive(
    socket: WebSocket,
    mut rx: mpsc::Receiver<PumpItem>,
    state: Arc<StreamState>,
    source_cancel: Arc<dyn SourceCancel>,
    checkpoints: Arc<Checkpoints>,
    total_batches: u64,
    json_frames_seen: Arc<AtomicU64>,
    release_when_done: Option<Box<dyn Send + Sync>>,
) -> Terminal {
    let (mut sink, mut stream) = socket.split();
    let credit = Arc::new(Semaphore::new(0));
    let (halt_tx, mut halt_rx) = watch::channel::<Option<Terminal>>(None);
    let mut batches_sent: u64 = 0;

    // Announce the stream's identity in band, as opaque UTF-8. Not a URL segment, not a
    // subprotocol string, not a request id — those would make the identifier's representation
    // transport-specific, which is the leakage the neutral interface forbids.
    let open = wire::frame(
        wire::TAG_OPEN,
        format!("{} {}", state.operation.as_str(), state.stream.as_str()).as_bytes(),
    );
    note_if_json(&json_frames_seen, &open);
    if sink.send(Message::Binary(open.into())).await.is_err() {
        return Terminal::TransportFailed("peer gone before the stream opened".into());
    }

    // The receive half. Owns nothing the writer needs, so it can never be blocked by a pending send.
    let reader = tokio::spawn({
        let credit = credit.clone();
        let state = state.clone();
        let source_cancel = source_cancel.clone();
        let json_frames_seen = json_frames_seen.clone();
        async move {
            loop {
                match stream.next().await {
                    Some(Ok(Message::Binary(b))) => {
                        note_if_json(&json_frames_seen, &b);
                        match parse_control(&b) {
                        Some(Control::Credit(n)) => {
                            // **Credit is granted as sent.** The only thing clamped is the
                            // arithmetic overflow `Semaphore::add_permits` panics on.
                            //
                            // An earlier version of this clamped the *cumulative* permits to
                            // `server::MAX_INFLIGHT_BATCHES`, reasoning that the constant is
                            // documented as "credit window, in batches". That conflated two
                            // different quantities and deadlocked the transport: the window bounds
                            // how many batches may be **in flight**, which the pump's bounded
                            // channel already enforces, whereas a grant says how many the consumer
                            // is willing to receive **in total from here**. A conforming peer that
                            // grants 100 up front and then waits — which is exactly what
                            // `every_batch_and_a_terminal_frame_are_delivered` does — had 96 of
                            // those credits silently discarded and waited forever for batches this
                            // loop would never send. Discarding credit a peer legitimately issued
                            // is a worse failure than the overflow it was guarding against.
                            let room =
                                tokio::sync::Semaphore::MAX_PERMITS - credit.available_permits();
                            credit.add_permits((n as usize).min(room));
                        }
                        Some(Control::Cancel) => {
                            // Producer-visible cancellation, stamped on the producer's own clock at
                            // the instant this adapter learns of it — and propagated to the source
                            // in the same breath, so the work stops rather than just the writing.
                            state.observe_cancel(Instant::now());
                            source_cancel.cancel();
                            let _ = halt_tx.send(Some(Terminal::Cancelled("control frame".into())));
                            // **Deliberately no `break`.** This task *is* the peer-drain below: it
                            // must run until the peer closes, or the connection is dropped the
                            // moment the writer finishes and the terminal frame races the teardown.
                            //
                            // Found by `superseded_query_cancel_while_a_second_stream_continues`,
                            // which saw the cancelled stream end in an aborted connection
                            // (os error 10053) after four batches and **no terminal frame at all**.
                            // That is the same silent-truncation failure ADR-012's Consequences
                            // describe — "a stream that ends without a terminal frame must be
                            // reported as a failure rather than as a short stream" — reached by the
                            // cancel path rather than the completion path. Breaking here is what
                            // caused it.
                        }
                        None => {
                            state.observe_cancel(Instant::now());
                            source_cancel.cancel();
                            let _ = halt_tx.send(Some(Terminal::TransportFailed(
                                "malformed control frame".into(),
                            )));
                            break;
                        }
                        }
                    }
                    Some(Ok(Message::Close(_))) | None => {
                        state.observe_cancel(Instant::now());
                        source_cancel.cancel();
                        let _ = halt_tx.send(Some(Terminal::Cancelled("peer closed".into())));
                        break;
                    }
                    Some(Ok(_)) => { /* ignore non-binary traffic */ }
                    Some(Err(e)) => {
                        state.observe_cancel(Instant::now());
                        source_cancel.cancel();
                        let _ = halt_tx.send(Some(Terminal::TransportFailed(format!("receive: {e}"))));
                        break;
                    }
                }
            }
            credit.close();
        }
    });

    checkpoints.begin("send");
    let terminal = loop {
        if let Some(t) = halt_rx.borrow_and_update().clone() {
            break t;
        }

        // Only pull a batch when credit is actually held — and **consume** the credit rather than
        // returning it.
        //
        // Two defects were fixed here, both inherited from the harness this was ported from:
        //
        // 1. **The permit must be forgotten, or credit is not credit.** `Semaphore::acquire` returns
        //    a permit that returns itself to the semaphore when dropped, so acquiring without
        //    `forget()` waits for a credit to *exist* and then hands it straight back. One grant
        //    would license an unbounded number of batches, and the demand signal the consumer
        //    thinks it is giving would do nothing. Bounded memory would then rest entirely on the
        //    pump channel's capacity — which does hold — but "explicit application credit" would be
        //    decoration.
        // 2. **The wait must be interruptible by the halt signal.** With the receive half now
        //    running past a CANCEL (so it can serve as the peer-drain), nothing else closes the
        //    semaphore, and a writer parked here would never send its terminal frame. That deadlock
        //    is what `h2_a_cancel_before_the_first_batch_still_stops_the_query` caught.
        let permit = tokio::select! {
            biased;
            _ = halt_rx.changed() => break halt_rx.borrow().clone().unwrap_or_else(reader_ended_without_reason),
            p = credit.acquire() => match p {
                Ok(p) => p,
                // The semaphore is closed by the reader when the peer is gone for good.
                Err(_) => break halt_rx
                    .borrow()
                    .clone()
                    .unwrap_or(Terminal::Cancelled("peer closed".into())),
            },
        };
        permit.forget();

        let item = tokio::select! {
            biased;
            _ = halt_rx.changed() => break halt_rx.borrow().clone().unwrap_or_else(reader_ended_without_reason),
            m = rx.recv() => match m {
                Some(i) => i,
                None => break Terminal::Completed,
            },
        };

        let payload = match item {
            PumpItem::Batch(b) => b,
            PumpItem::Failed(detail) => break Terminal::ProducerFailed(detail),
        };

        let len = payload.len();
        state.note_written(len);
        batches_sent += 1;
        note_if_json(&json_frames_seen, &payload);

        // The payload arrives already framed and is written through unchanged; `Bytes` clones share
        // storage, so nothing payload-sized is allocated here. Each send races the halt signal, so a
        // CANCEL arriving while these bytes drain is observed now, not after the flush.
        tokio::select! {
            biased;
            _ = halt_rx.changed() => break halt_rx.borrow().clone().unwrap_or_else(reader_ended_without_reason),
            r = sink.send(Message::Binary(payload)) => {
                if let Err(e) = r {
                    state.observe_cancel(Instant::now());
                    source_cancel.cancel();
                    break Terminal::TransportFailed(format!("send: {e}"));
                }
            }
        }

        let progress = wire::frame(
            wire::TAG_PROGRESS,
            &wire::progress_payload(batches_sent, state.bytes_emitted(), total_batches),
        );
        note_if_json(&json_frames_seen, &progress);
        tokio::select! {
            biased;
            _ = halt_rx.changed() => break halt_rx.borrow().clone().unwrap_or_else(reader_ended_without_reason),
            r = sink.send(Message::Binary(progress.into())) => {
                if r.is_err() {
                    state.observe_cancel(Instant::now());
                    source_cancel.cancel();
                    break Terminal::TransportFailed("send progress".into());
                }
            }
        }
    };
    checkpoints.end("send");

    // Whatever ends the loop, the source stops. A stream that ended because the consumer went away
    // must not leave a query running behind it.
    source_cancel.cancel();

    let (code, detail) = match &terminal {
        Terminal::Completed => (wire::TERM_COMPLETED, String::new()),
        Terminal::Cancelled(d) => (wire::TERM_CANCELLED, d.clone()),
        Terminal::ProducerFailed(d) => (wire::TERM_PRODUCER_FAILED, d.clone()),
        Terminal::TransportFailed(d) => (wire::TERM_TRANSPORT_FAILED, d.clone()),
        Terminal::DecodeFailed(d) => (wire::TERM_DECODE_FAILED, d.clone()),
    };
    let tf = wire::frame(wire::TAG_TERMINAL, &wire::terminal_payload(code, &detail));
    note_if_json(&json_frames_seen, &tf);
    let _ = sink.send(Message::Binary(tf.into())).await;

    // The stream is finished as far as capacity is concerned: every batch and the terminal frame
    // have been handed to the transport. Anything still to come is the peer's shutdown, not ours —
    // and holding a capacity slot across the peer's shutdown would make the declared ceiling a
    // function of client timing rather than of load.
    drop(release_when_done);

    // **The producer never initiates the close.** It sends its terminal frame and waits for the
    // consumer to close, draining whatever arrives meanwhile. A server-initiated close races the
    // frames still in the peer's receive path, and the peer can surface the close before draining
    // what preceded it — silent truncation with a healthy-looking producer. ADR-012 records that
    // this exact failure occurred in the bake-off and was caught only because a Rust client
    // disagreed with the browser; it is a correctness requirement of this transport, not advice.
    //
    // The wait is only a real drain because the reader task keeps running after a CANCEL. If it
    // returned on the cancel, this `await` would complete instantly and dropping the socket would
    // abort the connection with the terminal frame still in flight.
    // **On timeout the reader is aborted, not dropped.** Dropping a `JoinHandle` *detaches* its
    // task rather than cancelling it: it would keep looping on `stream.next()` against a peer that
    // stays connected and silent, still owning the receive half of the socket (the sink half
    // dropping does not close it — `split` shares the socket through a `BiLock`) and still holding
    // this stream's state, source-cancel handle and credit semaphore alive. That is one leaked
    // task, socket and descriptor per such connection, with nothing bounding the count.
    let drain = reader.abort_handle();
    if tokio::time::timeout(crate::server::PEER_DRAIN_TIMEOUT, reader).await.is_err() {
        drain.abort();
    }

    terminal
}

/// The halt signal fired but carried no outcome — only reachable if the receive task ended without
/// publishing one, which today means it panicked.
///
/// **It must not default to `Completed`.** Reporting success for a stream that was cut short is the
/// one outcome H7 and ADR-010 rule 5 forbid: "no partial view presented as complete". An unexplained
/// end is a transport failure until something says otherwise.
fn reader_ended_without_reason() -> Terminal {
    Terminal::TransportFailed("the receive task ended without publishing a terminal outcome".into())
}

enum Control {
    Credit(u32),
    Cancel,
}

fn parse_control(b: &[u8]) -> Option<Control> {
    if b.len() < wire::FRAME_PREFIX_LEN {
        return None;
    }
    let tag = b[0];
    let len = wire::payload_len(b)?;
    let payload = b.get(wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len)?;
    match tag {
        wire::TAG_CREDIT => {
            Some(Control::Credit(u32::from_be_bytes(payload.get(..4)?.try_into().ok()?)))
        }
        wire::TAG_CANCEL => Some(Control::Cancel),
        _ => None,
    }
}

/// Total batches, as the consumer should read it.
pub(crate) fn total_or_unknown(total: Option<u64>) -> u64 {
    total.unwrap_or(UNKNOWN_TOTAL)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::transport::{OperationId, StreamId};

    #[test]
    fn parses_credit_and_cancel_control_frames() {
        let credit = wire::frame(wire::TAG_CREDIT, &4u32.to_be_bytes());
        assert!(matches!(parse_control(&credit), Some(Control::Credit(4))));
        let cancel = wire::frame(wire::TAG_CANCEL, &[]);
        assert!(matches!(parse_control(&cancel), Some(Control::Cancel)));
        assert!(parse_control(&[]).is_none());
        assert!(parse_control(&[0x99, 0, 0, 0, 0]).is_none());
    }

    #[test]
    fn an_unknown_total_is_a_sentinel_not_a_zero() {
        assert_eq!(total_or_unknown(None), UNKNOWN_TOTAL);
        assert_eq!(total_or_unknown(Some(7)), 7);
    }

    #[test]
    fn cancel_observation_records_the_first_instant_only() {
        let s = StreamState::new(OperationId::new(), StreamId::new());
        let first = Instant::now();
        s.observe_cancel(first);
        std::thread::sleep(std::time::Duration::from_millis(2));
        s.observe_cancel(Instant::now());
        assert_eq!(s.observed_at().unwrap(), first);
    }
}
