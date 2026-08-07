// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The permission boundary for class-3 external side effects.**
//!
//! ADR-006 assigns external side effects three things — *audit log · explicit approval · declared
//! reversible / compensatable / irreversible* — and until this module only the third existed.
//! `docs/09` adds the shape of the first two: scoped, expiring grants, and "class-3 side effects
//! always require approval".
//!
//! | ADR-006 requires | Where it is |
//! |---|---|
//! | a declared reversibility class | `publish::REVERSIBILITY_CLASS` — was already there |
//! | explicit approval | [`approval`] |
//! | an audit log | [`audit`] |
//! | (the scope it is all checked against) | [`grant`] |
//! | (the one path through them) | [`boundary`] |
//!
//! ## What this is not
//!
//! **It is not a permission system, and nothing here is exposed.** There is no authentication, no
//! client, no extension surface, and no SKP message. ADR-017's acceptance condition forbids exposing
//! publish through SKP, a shipped CLI, MCP, a plugin, a notebook or an AI surface until the
//! machinery exists *and* an exposure surface passes review; this cut builds the machinery and
//! **does not flip the condition**. `kernel/PERMISSION-BOUNDARY.md` lists what exposure still
//! requires — seven things, none of them in this cut.
//!
//! ## The single-user reality
//!
//! The grantor and the operator are the same OS user today, and at the command line the tool mints
//! its own grant. That is stated plainly in [`grant`] and in the write-up rather than obscured: what
//! actually gates a command-line publish is the **approval** and the **audit record**; the grant's
//! contribution there is that it exists, carries a grantor, expires, constrains the destination
//! class, and forces the single path. The grant mechanism's teeth are at the library boundary, where
//! a caller supplies a [`grant::GrantSet`] it did not derive from the request.
//!
//! The object model deliberately does not *assume* the single-user case — a grant carries its
//! grantor and [`grant::PrincipalKind`] has room for kinds that do not exist — so multi-principal is
//! a data change rather than a redesign. No authentication is built and none is claimed.

pub mod approval;
pub mod audit;
pub mod boundary;
pub mod error;
pub mod grant;

pub use approval::{Approval, ApprovalPrompt, ApprovalSource, PreNamedApproval, StdinApproval};
pub use audit::{AuditLog, AUDIT_LOG_ENV};
pub use boundary::{execute, BoundaryError, PublishAttempt};
pub use error::{AuditError, PermissionError, RefusalReason};
pub use grant::{
    DestinationScope, GrantSet, OperationKind, Principal, PrincipalKind, PublishGrant, SourceScope,
    MAX_GRANTS, MAX_GRANT_LIFETIME,
};
