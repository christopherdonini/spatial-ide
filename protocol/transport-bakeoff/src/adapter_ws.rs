//! **Candidate A — binary WebSocket.**
//!
//! Backpressure: explicit application credit. The consumer grants credit as fixed-layout binary
//! control frames; the writer only takes a batch off the producer channel when it holds credit.
//! Combined with the bounded producer channel this caps producer-resident payload at
//! `(MAX_INFLIGHT_BATCHES + 1) x batch bytes`.
//!
//! Cancellation: observed **through this adapter's own transport** — a CANCEL control frame, a
//! Close frame, or the receive half erroring/ending. Never via a side channel; that is what makes
//! the H2 measurement mean anything.

use std::sync::Arc;
use std::time::Instant;

use axum::extract::ws::{Message, WebSocket};
use futures::{SinkExt, StreamExt};
use tokio::sync::{mpsc, watch, Semaphore};

use crate::transport::{Checkpoints, StreamState, Terminal};
use crate::wire;

/// **P1 — the control path is split from the send path.**
///
/// Phase 1's F7 finding was that coalescing the batch and its progress frame halved Candidate A's
/// cancel-blind window. Phase 2 (`86df830`) split them back into two writes, because concatenating
/// them would allocate a payload-sized buffer inside the timed interval — §16.8's invalidator. That
/// traded a measurement invalidator for a *doubled* cancel-blind window, and §18 P1 records it.
///
/// Restoring the coalesced write would reintroduce the allocation. The window is removed at its
/// source instead: the receive half runs in its own task, so a CANCEL frame is parsed and
/// `observe_cancel` is stamped **while a send is still pending**. The single-select structure could
/// never do this — `tokio::select!` cannot poll `recv()` while `send().await` holds the loop.
///
/// The H2 measurement point is now independent of send progress entirely, which is what
/// `cancel_is_observed_while_a_send_is_pending` pins. §19.6 requires that test, not this comment,
/// to be the evidence.
pub async fn drive(
    socket: WebSocket,
    mut rx: mpsc::Receiver<bytes::Bytes>,
    state: Arc<StreamState>,
    checkpoints: Arc<Checkpoints>,
    total_batches: u64,
    json_frames_seen: Arc<std::sync::atomic::AtomicU64>,
    // An opaque resource released once this stream is functionally over — the admission slot
    // (§19.7). It must be dropped after the terminal frame is sent but **before** the peer-drain
    // below, which waits up to 30 s for the client to close: holding a capacity slot across that
    // makes the ceiling a function of client shutdown timing rather than of load.
    release_when_done: Option<Box<dyn Send + Sync>>,
) -> Terminal {
    let (mut sink, mut stream) = socket.split();
    let credit = Arc::new(Semaphore::new(0));
    let (halt_tx, mut halt_rx) = watch::channel::<Option<Terminal>>(None);
    let mut batches_sent: u64 = 0;

    // The receive half. Owns nothing the writer needs, so it can never be blocked by a pending send.
    let reader = tokio::spawn({
        let credit = credit.clone();
        let state = state.clone();
        async move {
            loop {
                match stream.next().await {
                    Some(Ok(Message::Binary(b))) => match parse_control(&b) {
                        Some(Control::Credit(n)) => credit.add_permits(n as usize),
                        Some(Control::Cancel) => {
                            // Producer-visible cancellation, stamped on the producer's own clock at
                            // the instant this adapter learns of it (H2) — regardless of whether the
                            // writer is mid-send.
                            state.observe_cancel(Instant::now());
                            let _ = halt_tx.send(Some(Terminal::Cancelled("control frame".into())));
                            break;
                        }
                        None => {
                            let _ = halt_tx
                                .send(Some(Terminal::TransportFailed("malformed control frame".into())));
                            break;
                        }
                    },
                    Some(Ok(Message::Close(_))) | None => {
                        state.observe_cancel(Instant::now());
                        let _ = halt_tx.send(Some(Terminal::Cancelled("peer closed".into())));
                        break;
                    }
                    Some(Ok(_)) => { /* ignore non-binary control traffic */ }
                    Some(Err(e)) => {
                        state.observe_cancel(Instant::now());
                        let _ = halt_tx.send(Some(Terminal::TransportFailed(format!("receive: {e}"))));
                        break;
                    }
                }
            }
            // The writer must not be left waiting on credit that will never arrive.
            credit.close();
        }
    });

    checkpoints.begin("send");
    let terminal = loop {
        // `borrow_and_update` marks the current value seen, so the `changed()` arms below fire on
        // the next transition. Cancel transitions once, so this cannot miss it.
        if let Some(t) = halt_rx.borrow_and_update().clone() {
            break t;
        }

        // Only pull a batch from the producer when credit is actually held.
        if credit.acquire().await.is_err() {
            // Semaphore closed by the reader: the peer is gone and the reason is already published.
            break halt_rx.borrow().clone().unwrap_or(Terminal::Cancelled("peer closed".into()));
        }

        let payload = tokio::select! {
            biased;
            _ = halt_rx.changed() => break halt_rx.borrow().clone().unwrap_or(Terminal::Completed),
            m = rx.recv() => match m {
                Some(p) => p,
                None => break Terminal::Completed,
            },
        };

        let len = payload.len();
        // Accounted at handoff to the transport, matching Candidate B exactly. Counting after the
        // flush here and before it there would be unequal instrumentation between adapters, which
        // §8 makes inadmissible outright.
        state.note_written(len);
        batches_sent += 1;

        if wire::looks_like_json(&payload) {
            json_frames_seen.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
        }

        // **The payload arrives already framed and is written through unchanged**, and the batch and
        // its progress frame remain two separate writes so nothing payload-sized is allocated inside
        // the timed interval (§16.8). `Bytes` clones share storage, so no copy happens here either.
        //
        // Each send races the halt signal. This is the P1 fix: a CANCEL arriving while these bytes
        // are still draining into the socket is observed now, not after the flush completes.
        tokio::select! {
            biased;
            _ = halt_rx.changed() => break halt_rx.borrow().clone().unwrap_or(Terminal::Completed),
            r = sink.send(Message::Binary(payload)) => {
                if let Err(e) = r {
                    state.observe_cancel(Instant::now());
                    break Terminal::TransportFailed(format!("send: {e}"));
                }
            }
        }

        let progress = wire::frame(
            wire::TAG_PROGRESS,
            &wire::progress_payload(batches_sent, state.bytes_emitted(), total_batches),
        );
        tokio::select! {
            biased;
            _ = halt_rx.changed() => break halt_rx.borrow().clone().unwrap_or(Terminal::Completed),
            r = sink.send(Message::Binary(progress.into())) => {
                if r.is_err() {
                    state.observe_cancel(Instant::now());
                    break Terminal::TransportFailed("send progress".into());
                }
            }
        }
    };
    checkpoints.end("send");

    // Terminal frame, best-effort: if the peer is already gone this send fails, which does not
    // change the terminal outcome we already determined.
    let (code, detail) = match &terminal {
        Terminal::Completed => (wire::TERM_COMPLETED, String::new()),
        Terminal::Cancelled(d) => (wire::TERM_CANCELLED, d.clone()),
        Terminal::ProducerFailed(d) => (wire::TERM_PRODUCER_FAILED, d.clone()),
        Terminal::TransportFailed(d) => (wire::TERM_TRANSPORT_FAILED, d.clone()),
        Terminal::DecodeFailed(d) => (wire::TERM_DECODE_FAILED, d.clone()),
    };
    let tf = wire::frame(wire::TAG_TERMINAL, &wire::terminal_payload(code, &detail));
    let _ = sink.send(Message::Binary(tf.into())).await;

    // The stream is finished as far as capacity is concerned: every batch and the terminal frame
    // have been handed to the transport. Anything still to come is the peer's shutdown, not ours.
    drop(release_when_done);

    // **The producer never initiates the close.** It sends its terminal frame and then waits for
    // the consumer to close, draining whatever arrives meanwhile.
    //
    // Observed on an invalid smoke run (self-invalidating under the preregistration's §8, so this
    // is the reason for the change and not evidence for anything): the producer emitted all 100
    // batches and a Rust client received all of them, while the browser consumer saw only 98 and no
    // terminal frame. A server-initiated Close races the frames still in the peer's receive path,
    // and the peer can surface the close before draining what preceded it — silent truncation, with
    // a healthy-looking producer on the other end.
    //
    // The structural point, stated without a verdict attached: a WebSocket data plane has an
    // application-visible shutdown protocol that both ends must get right, and getting it wrong
    // truncates silently. Whether that counts against this candidate under §12 is the evidence's
    // call. `websocket_delivers_every_batch_and_a_terminal_frame` pins the behaviour either way.
    //
    // Under the split structure the reader task *is* the drain: it runs until the peer closes the
    // connection or errors. Waiting for it to finish is therefore the same wait as before, expressed
    // where the receive half now lives.
    let _ = tokio::time::timeout(std::time::Duration::from_secs(30), reader).await;

    terminal
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
            let n = u32::from_be_bytes(payload.get(..4)?.try_into().ok()?);
            Some(Control::Credit(n))
        }
        wire::TAG_CANCEL => Some(Control::Cancel),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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
    fn cancel_observation_is_idempotent_and_records_the_first_instant() {
        let s = StreamState::new(crate::transport::StreamId::new());
        assert!(!s.is_cancelled());
        let first = Instant::now();
        s.observe_cancel(first);
        std::thread::sleep(std::time::Duration::from_millis(2));
        s.observe_cancel(Instant::now());
        assert!(s.is_cancelled());
        assert_eq!(s.observed_at().unwrap(), first);
    }
}
