// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The class-3 audit record** — ADR-006's second missing obligation.
//!
//! ADR-006 assigns external side effects three things: *audit log · explicit approval · declared
//! reversible / compensatable / irreversible*. Only the third existed; this is the first.
//!
//! ## This is not the command/event log, and the two must not be conflated
//!
//! `kernel/README.md` already warns in the other direction — that ADR-006's **class-2**
//! workspace-mutation log "would not serve as an audit record for an external side effect even if it
//! existed". The converse is stated here so neither side can be read into the other:
//!
//! **This log is class-3 only. It is not a transaction log, it does not participate in undo, and it
//! replays nothing.** Nothing in it can be used to reconstruct, reverse or re-apply an operation. It
//! records that an irreversible thing was attempted, by whom, to what, and how it ended.
//!
//! ## It is deliberately not a `docs/11` resource
//!
//! No stable URI, no schema negotiation, no lineage, no reproducibility grade, and no project
//! references it. This is the one place `docs/01` principle 1 is knowingly not applied, and the
//! reason is that applying it would put the log **in the project** — where it must not be. It audits
//! one machine, it is per-user, and it ships nowhere. Stated so a reader does not have to notice the
//! omission and guess whether it was considered.

pub mod clock;
pub mod log;
pub mod normalize;
pub mod record;

pub use clock::{rfc3339_utc, rfc3339_utc_now};
pub use log::{
    AuditLog, AUDIT_LOG_ENV, MAX_AUDIT_LOG_BYTES, MAX_AUDIT_LOG_GENERATIONS,
};
pub use normalize::normalize_destination;
pub use record::{ApprovalRoute, IntentRecord, Outcome, OutcomeRecord, AUDIT_SCHEMA};
