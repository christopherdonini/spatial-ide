// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! SKP v0 — five commands, no more. See `../../SKP-V0.md`.

pub mod codec;
pub mod commands;
pub mod error;
pub mod events;
pub mod handles;

pub use codec::{DecU64, HexF64, HexF64ParseError};
pub use commands::*;
pub use error::SkpError;
pub use events::{DatasetSessionEnded, DATASET_SESSION_ENDED_EVENT};
pub use handles::{CancelKey, DatasetHandle, SessionRef, StreamHandle};

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
///
/// `skp/0.3` (Brief A, P3): `describe` gains the four fields Brief A's settled boundary 9 names —
/// `crs.provenance`, `crs.axis_provenance`, `identity.class` (with its session-tier statement) and
/// the sanity-check level — plus the P2-held `crs.display_convention` carrier; and three new typed
/// refusals appear (`engine.source_changed`, `engine.identity_ordinal_partitioned_unsupported`,
/// `engine.internal_inconsistency`) beside the publish-class `publish.geographic_crs_not_publishable`.
/// **No generation value crosses the wire in either direction** (boundary 9;
/// `engine/ADMISSION-PREREGISTRATION.md` §13 D): generation attribution rides the existing ticket,
/// and `protocol/data-plane/` has an empty diff. Same discipline for the fourth time:
/// `deny_unknown_fields` both directions, `==` unchanged, every fixture on both sides of the wire
/// updated in this commit (`SKP-V0.md` §8's `skp/0.3` entry lists the full field set).
///
/// `skp/0.4` (crs-unit-fact-and-bounds): `describe` gains one member, `crs.unit`, a closed
/// four-value enum (`CrsUnit`) carrying the engine's recorded `AdmissionRecord::coordinate_unit`
/// class. No request member, no command, no refusal code; `protocol/data-plane/` has an empty
/// diff; no MCP surface. Same discipline again: `deny_unknown_fields` both directions, `==`
/// unchanged, every fixture on both sides of the wire updated in this commit (`SKP-V0.md` §8's
/// `skp/0.4` entry lists the full field set).
///
/// `skp/0.5` (the advisory source-change watcher, `engine/SOURCE-WATCHER-PREREGISTRATION.md`):
/// `OpenDatasetResponse` gains `session: SessionRef`; `DescribeResponse` gains `coverage`, `checks`
/// and `session_end`; and one new control-plane event, [`DatasetSessionEnded`] on
/// [`DATASET_SESSION_ENDED_EVENT`] — the one named exception to §4 item 7's rule against
/// server-to-client push. No generation value crosses the wire (rider (a)). Same discipline again:
/// `deny_unknown_fields` both directions, `==` unchanged, every fixture on both sides of the wire
/// updated in this commit (`SKP-V0.md` §8's `skp/0.5` entry lists the full field set).
pub const SKP_VERSION: &str = "skp/0.5";
