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
use tokio::sync::mpsc;

use crate::transport::{Checkpoints, StreamState, Terminal};
use crate::wire;

pub async fn drive(
    mut socket: WebSocket,
    mut rx: mpsc::Receiver<bytes::Bytes>,
    state: Arc<StreamState>,
    checkpoints: Arc<Checkpoints>,
    total_batches: u64,
    json_frames_seen: Arc<std::sync::atomic::AtomicU64>,
) -> Terminal {
    let mut credit: u64 = 0;
    let mut batches_sent: u64 = 0;

    checkpoints.begin("send");
    let terminal = loop {
        // Only pull a batch from the producer when we actually hold credit. `biased` keeps the
        // control path ahead of the data path so a cancel is never starved by a full send queue.
        let can_send = credit > 0;
        tokio::select! {
            biased;

            incoming = socket.recv() => {
                match incoming {
                    Some(Ok(Message::Binary(b))) => {
                        match parse_control(&b) {
                            Some(Control::Credit(n)) => credit = credit.saturating_add(n as u64),
                            Some(Control::Cancel) => {
                                // Producer-visible cancellation, observed on the producer's own
                                // clock at the instant this adapter learns of it (H2).
                                state.observe_cancel(Instant::now());
                                break Terminal::Cancelled("control frame".into());
                            }
                            None => {
                                break Terminal::TransportFailed("malformed control frame".into());
                            }
                        }
                    }
                    Some(Ok(Message::Close(_))) | None => {
                        state.observe_cancel(Instant::now());
                        break Terminal::Cancelled("peer closed".into());
                    }
                    Some(Ok(_)) => { /* ignore non-binary control traffic */ }
                    Some(Err(e)) => {
                        state.observe_cancel(Instant::now());
                        break Terminal::TransportFailed(format!("receive: {e}"));
                    }
                }
            }

            maybe_batch = rx.recv(), if can_send => {
                match maybe_batch {
                    Some(payload) => {
                        let len = payload.len();

                        // Accounted at handoff to the transport, matching Candidate B exactly.
                        // Counting after the flush here and before it there would be unequal
                        // instrumentation between adapters, which the preregistration's §8 makes
                        // inadmissible outright.
                        state.note_written(len);
                        credit -= 1;
                        batches_sent += 1;

                        if wire::looks_like_json(&payload) {
                            json_frames_seen.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
                        }

                        // **The payload arrives already framed and is written through unchanged.**
                        // Phase 1 concatenated the batch and its progress frame into one buffer;
                        // under Phase 2's pre-generated corpus that concatenation would allocate a
                        // payload-sized buffer *inside the timed interval*, which §16.8 makes an
                        // invalidator. Both candidates therefore write the batch and its progress
                        // frame as two separate writes — symmetric, and allocation-free for the
                        // payload. `Bytes` clones share storage, so no copy happens here either.
                        if let Err(e) = socket.send(Message::Binary(payload)).await {
                            state.observe_cancel(Instant::now());
                            break Terminal::TransportFailed(format!("send: {e}"));
                        }

                        let progress = wire::frame(
                            wire::TAG_PROGRESS,
                            &wire::progress_payload(
                                batches_sent,
                                state.bytes_emitted(),
                                total_batches,
                            ),
                        );
                        if socket.send(Message::Binary(progress.into())).await.is_err() {
                            state.observe_cancel(Instant::now());
                            break Terminal::TransportFailed("send progress".into());
                        }
                    }
                    None => break Terminal::Completed,
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
    let _ = socket.send(Message::Binary(tf.into())).await;

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
    let _ = tokio::time::timeout(std::time::Duration::from_secs(30), async {
        while let Some(Ok(_)) = socket.recv().await {}
    })
    .await;

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
