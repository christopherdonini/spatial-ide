//! **Candidate B — loopback HTTP streaming response**, consumed through `fetch` + `ReadableStream`.
//!
//! Backpressure: TCP-native. The consumer stops reading, the receive window closes, the write pends,
//! and the body stream stops being polled — so the producer channel fills and the producer blocks.
//! No application credit protocol exists, and there is no consumer->producer channel at all. That
//! is a deliberate structural difference from Candidate A rather than an oversight; how it weighs
//! under the preregistration's §12 tie-break is for the measured evidence to settle, not for this
//! file to assert.
//!
//! Cancellation: `AbortController` on the consumer closes the connection; hyper drops the response
//! body; the drop guard below records the instant **on the producer's own clock**. This is the
//! "localhost HTTP with connection-close semantics" path ADR-004 amendment 2 names as an acceptable
//! candidate class.

use std::pin::Pin;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::task::{Context, Poll};
use std::time::Instant;

use futures::Stream;
use tokio::sync::mpsc;

use crate::transport::{Checkpoints, StreamState};
use crate::wire;

/// The response body. Its `Drop` is the cancellation signal: if the stream is dropped before it has
/// emitted its terminal frame, the peer went away and the producer must learn about it.
pub struct BodyStream {
    rx: mpsc::Receiver<Vec<u8>>,
    state: Arc<StreamState>,
    checkpoints: Arc<Checkpoints>,
    json_frames_seen: Arc<AtomicU64>,
    total_batches: u64,
    batches_sent: u64,
    finished: bool,
    began: bool,
}

impl BodyStream {
    pub fn new(
        rx: mpsc::Receiver<Vec<u8>>,
        state: Arc<StreamState>,
        checkpoints: Arc<Checkpoints>,
        total_batches: u64,
        json_frames_seen: Arc<AtomicU64>,
    ) -> Self {
        Self {
            rx,
            state,
            checkpoints,
            json_frames_seen,
            total_batches,
            batches_sent: 0,
            finished: false,
            began: false,
        }
    }
}

impl Stream for BodyStream {
    type Item = Result<bytes::Bytes, std::io::Error>;

    fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        let this = self.get_mut();
        if !this.began {
            this.began = true;
            this.checkpoints.begin("send");
        }
        if this.finished {
            return Poll::Ready(None);
        }

        match this.rx.poll_recv(cx) {
            Poll::Pending => Poll::Pending,
            Poll::Ready(Some(payload)) => {
                let len = payload.len();
                let batch = wire::frame(wire::TAG_BATCH, &payload);
                if wire::looks_like_json(&batch) {
                    this.json_frames_seen.fetch_add(1, Ordering::Relaxed);
                }
                this.state.note_written(len);
                this.batches_sent += 1;

                let p = wire::progress_payload(
                    this.batches_sent,
                    this.state.bytes_emitted(),
                    this.total_batches,
                );
                let progress = wire::frame(wire::TAG_PROGRESS, &p);
                if wire::looks_like_json(&progress) {
                    this.json_frames_seen.fetch_add(1, Ordering::Relaxed);
                }

                // Batch frame and its progress frame leave together; the consumer's shared frame
                // decoder splits them. One chunk keeps the write count down without changing what
                // crosses the wire.
                let mut out = batch;
                out.extend_from_slice(&progress);
                Poll::Ready(Some(Ok(bytes::Bytes::from(out))))
            }
            Poll::Ready(None) => {
                // Producer channel closed: the operation ran to completion.
                this.finished = true;
                this.checkpoints.end("send");
                let tf = wire::frame(
                    wire::TAG_TERMINAL,
                    &wire::terminal_payload(wire::TERM_COMPLETED, ""),
                );
                Poll::Ready(Some(Ok(bytes::Bytes::from(tf))))
            }
        }
    }
}

impl Drop for BodyStream {
    fn drop(&mut self) {
        if !self.finished {
            // The peer went away mid-stream. This is Candidate B's producer-visible cancellation
            // path, and this instant is the H2 measurement point.
            self.state.observe_cancel(Instant::now());
            self.checkpoints.end("send");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::transport::StreamId;
    use futures::StreamExt;

    #[tokio::test]
    async fn dropping_the_body_early_makes_cancellation_producer_visible() {
        let (tx, rx) = mpsc::channel::<Vec<u8>>(4);
        let state = StreamState::new(StreamId::new());
        let cps = Arc::new(Checkpoints::default());
        let body = BodyStream::new(
            rx,
            state.clone(),
            cps.clone(),
            100,
            Arc::new(AtomicU64::new(0)),
        );

        tx.send(vec![0xff, 0xff, 0xff, 0xff]).await.unwrap();
        // Box::pin, not pin_mut!: pin_mut! shadows the binding with a `Pin<&mut _>`, so dropping it
        // would drop the *reference* and leave the stream alive until end of scope — the drop under
        // test would never actually run.
        let mut body = Box::pin(body);
        let _first = body.next().await.expect("one chunk");
        assert!(!state.is_cancelled(), "not cancelled while streaming");

        drop(body); // simulates the client aborting the fetch
        assert!(
            state.is_cancelled(),
            "dropping the response body must make cancellation visible to the producer"
        );
        assert!(state.observed_at().is_some());
        // The checkpoint scheme must not leave `send` dangling after an aborted stream.
        assert_eq!(cps.dangling(), None);
    }

    #[tokio::test]
    async fn clean_completion_is_not_reported_as_cancellation() {
        let (tx, rx) = mpsc::channel::<Vec<u8>>(4);
        let state = StreamState::new(StreamId::new());
        let cps = Arc::new(Checkpoints::default());
        let body = BodyStream::new(
            rx,
            state.clone(),
            cps.clone(),
            1,
            Arc::new(AtomicU64::new(0)),
        );
        tx.send(vec![0xff, 0xff, 0xff, 0xff]).await.unwrap();
        drop(tx);

        let mut body = Box::pin(body);
        let _batch = body.next().await.expect("batch chunk");
        let _terminal = body.next().await.expect("terminal frame");
        assert!(body.next().await.is_none());
        drop(body);

        assert!(
            !state.is_cancelled(),
            "a stream that ran to completion must not be recorded as cancelled"
        );
        assert_eq!(cps.dangling(), None);
    }
}
