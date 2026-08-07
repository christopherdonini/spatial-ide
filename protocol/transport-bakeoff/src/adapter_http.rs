// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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
    rx: mpsc::Receiver<bytes::Bytes>,
    /// A progress frame produced alongside a batch and yielded on the next poll. Batch and progress
    /// are two separate chunks on both candidates: concatenating them would allocate a
    /// payload-sized buffer inside Phase 2's timed interval, which §16.8 makes an invalidator.
    pending_progress: Option<bytes::Bytes>,
    state: Arc<StreamState>,
    checkpoints: Arc<Checkpoints>,
    json_frames_seen: Arc<AtomicU64>,
    total_batches: u64,
    batches_sent: u64,
    finished: bool,
    began: bool,
    /// An opaque resource whose lifetime must match the stream's — the admission slot (§19.7).
    /// Held here rather than by the completion poller so it is released the moment the body ends or
    /// is dropped; releasing it 25 ms late made back-to-back N=2 runs collide with the ceiling.
    /// Typed as an opaque box so this adapter names no capacity concept.
    held: Option<Box<dyn Send + Sync>>,
}

impl BodyStream {
    pub fn new(
        rx: mpsc::Receiver<bytes::Bytes>,
        state: Arc<StreamState>,
        checkpoints: Arc<Checkpoints>,
        total_batches: u64,
        json_frames_seen: Arc<AtomicU64>,
    ) -> Self {
        Self {
            rx,
            pending_progress: None,
            state,
            checkpoints,
            json_frames_seen,
            total_batches,
            batches_sent: 0,
            finished: false,
            began: false,
            held: None,
        }
    }

    /// Ties an opaque resource to this body's lifetime.
    pub fn holding(mut self, r: Box<dyn Send + Sync>) -> Self {
        self.held = Some(r);
        self
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

        // A progress frame queued alongside the previous batch. Yielded as its own chunk so the
        // batch payload is written through untouched — see `pending_progress`.
        if let Some(p) = this.pending_progress.take() {
            return Poll::Ready(Some(Ok(p)));
        }

        match this.rx.poll_recv(cx) {
            Poll::Pending => Poll::Pending,
            Poll::Ready(Some(payload)) => {
                let len = payload.len();
                if wire::looks_like_json(&payload) {
                    this.json_frames_seen.fetch_add(1, Ordering::Relaxed);
                }
                this.state.note_written(len);
                this.batches_sent += 1;

                let progress = wire::frame(
                    wire::TAG_PROGRESS,
                    &wire::progress_payload(
                        this.batches_sent,
                        this.state.bytes_emitted(),
                        this.total_batches,
                    ),
                );
                this.pending_progress = Some(bytes::Bytes::from(progress));

                // The payload arrives already framed and is handed to hyper unchanged; the `Bytes`
                // clone shares storage, so no payload-sized copy or allocation happens here.
                Poll::Ready(Some(Ok(payload)))
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
        let (tx, rx) = mpsc::channel::<bytes::Bytes>(4);
        let state = StreamState::new(StreamId::new());
        let cps = Arc::new(Checkpoints::default());
        let body = BodyStream::new(
            rx,
            state.clone(),
            cps.clone(),
            100,
            Arc::new(AtomicU64::new(0)),
        );

        tx.send(bytes::Bytes::from_static(&[0xff, 0xff, 0xff, 0xff])).await.unwrap();
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
        let (tx, rx) = mpsc::channel::<bytes::Bytes>(4);
        let state = StreamState::new(StreamId::new());
        let cps = Arc::new(Checkpoints::default());
        let body = BodyStream::new(
            rx,
            state.clone(),
            cps.clone(),
            1,
            Arc::new(AtomicU64::new(0)),
        );
        tx.send(bytes::Bytes::from_static(&[0xff, 0xff, 0xff, 0xff])).await.unwrap();
        drop(tx);

        // Batch, then its progress frame as a separate chunk, then the terminal frame. Progress is
        // no longer concatenated onto the batch: doing so would allocate a payload-sized buffer
        // inside Phase 2's timed interval, which §16.8 makes an invalidator.
        let mut body = Box::pin(body);
        let _batch = body.next().await.expect("batch chunk");
        let _progress = body.next().await.expect("progress chunk");
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
