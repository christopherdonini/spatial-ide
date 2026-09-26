// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `skp/0.5`, the advisory source-change watcher (ADR-035 D4). The **only** control-plane
//! server-to-client push v0 defines — §4 item 7's "none" is amended by exactly this one named
//! exception, which is why it is a Tauri event and not a new command: no request carries it, no
//! response is expected, and it is not a subscription (there is no way to ask for it and no way to
//! turn it off).

use serde::{Deserialize, Serialize};

use crate::v0::{EndReason, SessionRef};

/// The Tauri event name this shell emits on every ended dataset-session generation, at most once
/// per open (§7). Never a websocket frame — `protocol/data-plane/` has an empty diff for this
/// version.
pub const DATASET_SESSION_ENDED_EVENT: &str = "skp://dataset_session_ended";

/// The event payload — exactly two members (rider (b); ADR-035 D4). No generation value, no
/// duration, no ordering claim against any data-plane frame (ADR-035 Consequences).
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct DatasetSessionEnded {
    pub session: SessionRef,
    pub reason: EndReason,
}
