// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! SKP v0 — five commands, no more. See `../../SKP-V0.md`.

pub mod codec;
pub mod commands;
pub mod error;
pub mod handles;

pub use codec::{DecU64, HexF64, HexF64ParseError};
pub use commands::*;
pub use error::SkpError;
pub use handles::{CancelKey, DatasetHandle, StreamHandle};

/// The one version string this crate speaks. A host compares an incoming request's `skp` field with
/// `==`; anything else is `SkpError::version_unsupported` (SKP-V0.md §4 item 3 — there is
/// deliberately no negotiation beyond this).
pub const SKP_VERSION: &str = "skp/0";
