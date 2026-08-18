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
///
/// `skp/0.1` (sql-filter cut): adds `viewport_query.filter`. `deny_unknown_fields` is kept both
/// directions and the comparison stays `==`, so a `skp/0` client and a `skp/0.1` host still fail on
/// the first call rather than silently tolerating the new field either way. `skp/1` is RESERVED
/// (docs/07's 1.0 freeze) and must not be used for any interim version.
///
/// `skp/0.2` (admission-remediation cut, P0): adds `open_dataset.crs_assertion` and
/// `open_dataset.identity`, plus `candidate_columns` on the `engine.identity_unusable` refusal.
/// Same discipline again: `deny_unknown_fields` both directions, `==` unchanged, every fixture on
/// both sides of the wire updated in this commit (`SKP-V0.md` §8).
pub const SKP_VERSION: &str = "skp/0.2";
