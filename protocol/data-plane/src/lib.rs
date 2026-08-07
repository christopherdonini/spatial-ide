// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! # `protocol/data-plane` — the data-plane binding (docs/02, docs/04, docs/10)
//!
//! ADR-004's data plane: **binary, chunked, backpressured, copy-minimized, JSON-free**, carrying
//! Arrow IPC record batches. One operation, one stream per connection, one adapter.
//!
//! ## Status — read before citing anything here
//!
//! **ADR-012 (data-plane transport) is Proposed and no §19.9 branch selected a candidate.** The
//! binary WebSocket implemented in [`adapter_ws`] is the **provisional** choice that
//! `protocol/transport-bakeoff/README.md` §19.10's step 3 licenses building against, together with
//! that step's own declared circular gate: *if the hero-slice confirmation falsifies the provisional
//! choice, step 3 is rework.* It is **not a transport decision and may not be cited as one.**
//! Nothing in this crate quotes a throughput or copy figure, and no zero-copy claim is made
//! (ADR-004: copies are "measured and minimized, not assumed absent").
//!
//! Reversibility is the whole justification for "provisional", so it is mechanical rather than
//! promised: [`transport`] is the transport-neutral interface, `tests/no_transport_leakage.rs`
//! scans it for the forbidden vocabulary, and a second adapter attaches at exactly one construction
//! site in [`server`].
//!
//! ## Layering
//!
//! This crate knows nothing about what a batch contains. A [`transport::BatchSource`] appends bytes
//! to a buffer; a [`transport::SourceFactory`] interprets the opaque operation parameters. There is
//! no dependency on `engine/` — the composition happens in `kernel/`, which is the only place that
//! knows both sides.
//!
//! ## Declared recovery policy (ADR-010 rule 7)
//!
//! **`none` — fail visibly and terminate the stream.** Every stream ends in exactly one terminal
//! frame from the shared taxonomy; a stream that ends without one is a failure the consumer must
//! report, never a short stream. No retry, no reconnect, no resumption. There is no watchdog because
//! there is nothing to restart; the terminal frame *is* the instrument.
//!
//! ## Scope
//!
//! Windows/WebView2 reference profile, like everything else this project has measured. Nothing here
//! says anything about macOS or Linux.

mod adapter_ws;
mod pump;
pub mod server;
pub mod session;
pub mod transport;
pub mod wire;

pub use server::{
    serve, DataPlaneConfig, RunningDataPlane, StreamRegistry, MAX_CONCURRENT_STREAMS,
    MAX_FRAME_BYTES, MAX_INFLIGHT_BATCHES,
};
pub use session::Session;
pub use transport::{
    BatchMeta, BatchSource, OpenRequest, OperationId, Progress, SourceCancel, SourceFactory,
    StreamId, StreamState, Terminal, UNKNOWN_TOTAL,
};
