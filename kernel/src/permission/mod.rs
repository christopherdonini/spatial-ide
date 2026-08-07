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
//! client, no extension surface, and no SKP message. ADR-017's acceptance condition requires this
//! machinery before publish is exposed through SKP, a shipped CLI, MCP, a plugin, a notebook or an
//! AI surface; this cut builds the machinery and exposes nothing.
//! `kernel/PERMISSION-BOUNDARY.md` lists what exposure would still require — seven things, none of
//! them in this cut — and flags for the custodian the question of what that condition's "until
//! then" now means.
//!
//! ## The single-user reality
//!
//! The grantor and the operator are the same OS user today, and at the command line the tool mints
//! its own grant **from the request it is about to authorize** — so in the default invocation both
//! halves of the scope are tautologies and the grant checks nothing. (`--grant-destination` is the
//! one part that is a real check.) What gates a command-line publish is the **approval** and the
//! **audit record**; the grant's contribution there is that it exists, carries a grantor, expires,
//! and forces the single path. The grant mechanism's teeth are at the library boundary, where a
//! caller supplies a [`grant::GrantSet`] it did not derive from the request.
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
