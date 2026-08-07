// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Typed refusals for the class-3 permission boundary.
//!
//! Same discipline as `publish/error.rs`: `docs/05` makes a refusal "an **error**, not a warning",
//! and each variant says what was refused and why. A boundary that answered "denied" would hide
//! which of three independent conditions failed, and the whole point of separating grant from
//! approval is that they are different questions with different remedies.
//!
//! **Two error types, not one.** [`PermissionError`] is about authority — who may do what, to what,
//! until when. [`AuditError`] is about the record — whether this operation can be written down at
//! all. They are kept apart because they fail for unrelated reasons and a caller may want to treat
//! them differently: an unauthorized publish is a decision, an unauditable one is a broken machine.
//!
//! `AuditError::Unwritable` sits here rather than on `PermissionError`, which is a small departure
//! from the design record's placement. The reason is coherence: every other member of
//! `PermissionError` answers "may this run?", and "can the log be opened?" answers something else.
//! Both still refuse the operation, and the boundary reports them through one enum.

use spatial_renderer::canonical::CanonicalError;

/// Why an approval was not given.
///
/// **`Timeout` is deliberately absent**, because there is no timeout — see
/// [`crate::permission::approval`] for why one cannot be built on `std` without shipping a CLI that
/// can hang, and for what supplies the property a timeout would have. Naming a variant that never
/// occurs would be the enum claiming a capability the code does not have.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum RefusalReason {
    /// Something was typed, and it was not the confirmation phrase.
    NotMatched,
    /// End of input with no answer — a closed pipe, a redirected `/dev/null`, a Ctrl-Z.
    Eof,
}

impl RefusalReason {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::NotMatched => "not-matched",
            Self::Eof => "eof",
        }
    }
}

#[derive(Debug)]
pub enum PermissionError {
    /// No grant exists for this operation kind at all.
    ///
    /// Distinct from [`Self::GrantScopeMismatch`] on purpose: "you have no authority to publish" and
    /// "your authority does not cover this destination" send an operator to different places.
    NoGrant { operation: &'static str },

    /// A grant for this operation exists, and its scope does not cover this operation.
    ///
    /// `detail` names the predicate that failed on the closest candidate — wrong content hash,
    /// wrong dataset name, or a destination outside the granted scope — because "scope mismatch"
    /// without saying which of three is the black box `docs/01` principle 8 forbids.
    GrantScopeMismatch { detail: String },

    /// A grant matching this operation's scope exists and has expired.
    ///
    /// Checked **after** scope, so an otherwise-matching expired grant reports expiry rather than
    /// mismatch. The reverse order would tell an operator to fix their destination when what they
    /// need is a fresh grant.
    GrantExpired { lifetime_s: u64, elapsed_s: u64 },

    /// The grant store is full (ADR-010 rule 6).
    GrantCeilingExceeded { ceiling: &'static str, limit: usize },

    /// A grant was requested with a lifetime longer than the declared ceiling (ADR-010 rule 6).
    GrantLifetimeExceeded { requested_s: u64, limit_s: u64 },

    /// The destination could not be resolved to a fact.
    ///
    /// The grant is checked against the filesystem's answer, never against the string the caller
    /// typed (ADR-015's claim-vs-fact discipline). When the filesystem cannot answer — no parent
    /// directory, no final component — there is no fact to check against, and refusing is the only
    /// honest outcome.
    DestinationUnresolvable { path: String, detail: String },

    /// Approval was not given.
    ///
    /// Carries the phrase that was expected, because a refusal that does not say what would have
    /// worked trains operators to paste from scrollback — and a pasted confirmation confirms
    /// nothing.
    ApprovalRefused { reason: RefusalReason, expected: String },

    /// The approval channel itself failed — stdin could not be read.
    ///
    /// **Not a refusal by the operator**, and kept separate from one so an audit record does not
    /// report a machine fault as a human decision.
    ApprovalUnavailable { detail: String },
}

impl std::fmt::Display for PermissionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NoGrant { operation } => write!(
                f,
                "refused: no grant authorizes `{operation}`. Publishing is a class-3 external side \
                 effect (ADR-006), and docs/09 makes export and publish distinct capabilities that \
                 are never implied by write — so the absence of a grant is a refusal, not a \
                 default. Issue a scoped grant naming the dataset and the destination"
            ),
            Self::GrantScopeMismatch { detail } => write!(
                f,
                "refused: a publish grant exists but does not cover this operation — {detail}. \
                 Scope is checked against what the operation actually is (the dataset's content \
                 hash and the resolved destination), never against what the request says about \
                 itself; the same rule ADR-015 applies to a CRS assertion"
            ),
            Self::GrantExpired { lifetime_s, elapsed_s } => write!(
                f,
                "refused: the matching publish grant expired — its lifetime was {lifetime_s}s and \
                 {elapsed_s}s have elapsed. docs/09 makes grants expiring, not standing; an \
                 authorization for an irreversible act that never lapsed would be ambient authority \
                 wearing a grant's name"
            ),
            Self::GrantCeilingExceeded { ceiling, limit } => write!(
                f,
                "refused: declared ceiling {ceiling} reached — at most {limit} grants may be held \
                 at once (ADR-010 rule 6)"
            ),
            Self::GrantLifetimeExceeded { requested_s, limit_s } => write!(
                f,
                "refused: a grant lifetime of {requested_s}s exceeds the declared ceiling of \
                 {limit_s}s (ADR-010 rule 6). The ceiling is docs/09's own example — \"expires in \
                 20 minutes\" — promoted to a number, because a ceiling with no value is not \
                 declared"
            ),
            Self::DestinationUnresolvable { path, detail } => write!(
                f,
                "refused: `{path}` could not be resolved to an actual destination ({detail}), so \
                 there is no fact for a grant to be checked against. A grant checked against the \
                 caller's own spelling of a path would be checking the claim rather than the thing"
            ),
            Self::ApprovalRefused { reason, expected } => match reason {
                RefusalReason::NotMatched => write!(
                    f,
                    "refused: the confirmation did not name the destination. Expected exactly \
                     `{expected}`. Approval names *this* execution — a bare `y` would confirm that \
                     a key was pressed, not that the operator read where an irreversible publish \
                     was going (ADR-006 class 3; docs/09)"
                ),
                RefusalReason::Eof => write!(
                    f,
                    "refused: end of input before an answer, so nothing was approved. Refusal is \
                     the default on anything that is not the exact phrase `{expected}` — a class-3 \
                     side effect never proceeds on silence"
                ),
            },
            Self::ApprovalUnavailable { detail } => write!(
                f,
                "refused: the approval could not be read ({detail}). This is a failure of the \
                 channel rather than a decision by an operator, and it is reported as its own case \
                 so an audit record never files a broken pipe as a human refusal"
            ),
        }
    }
}

impl std::error::Error for PermissionError {}

/// Why an operation could not be written down — and therefore could not run.
#[derive(Debug)]
pub enum AuditError {
    /// The log cannot be created, opened for append, or written.
    ///
    /// **This is the refusal that cannot itself be audited**, and that is stated rather than
    /// papered over: the log cannot record its own unavailability. Claiming otherwise would be an
    /// audit claim the mechanism cannot honor, which `docs/01` principle 3 forbids.
    Unwritable { path: String, detail: String },

    /// The audit log resolves to a path inside the bundle being published.
    ///
    /// Refused structurally rather than by convention. The log audits the operator's **machine**;
    /// a copy of it inside a redistributable bundle would ship the operator's publish history to
    /// every recipient, and ADR-017 §13's own scan would then find it.
    LogInsideDestination { log: String, destination: String },

    /// A generation could not be rotated, so the declared ceiling cannot be honored.
    ///
    /// Fatal rather than ignored: silently exceeding a declared ceiling (ADR-010 rule 6) would make
    /// the number in the docs a wish.
    RotationFailed { path: String, detail: String },

    /// A field carries a control character, which would break the one-record-per-line framing.
    ///
    /// Refused before serialization rather than escaped, so line framing does not depend on the
    /// escaper's behaviour for bytes no legitimate field contains.
    ControlCharacterInField { field: &'static str },

    /// The `docs/09` scan found a credential in the record about to be written.
    ///
    /// **Unconditional, and never attributable.** `docs/09` makes credential redaction absolute;
    /// `bundle::redaction` already refuses to let an operator declaration excuse a credential, and
    /// the same rule governs here. The record is not written and the operation does not run — an
    /// operation whose audit record would leak a secret is not made safe by running it unlogged.
    CredentialInRecord { class: &'static str, byte_offset: usize },

    Canonical(CanonicalError),
}

impl std::fmt::Display for AuditError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Unwritable { path, detail } => write!(
                f,
                "refused: the audit log `{path}` cannot be written ({detail}). A class-3 external \
                 side effect that cannot be recorded does not run — that is what the gate means \
                 (ADR-006; docs/09). Nothing has been created at the destination. This one refusal \
                 is necessarily absent from the log itself, because the log is what failed"
            ),
            Self::LogInsideDestination { log, destination } => write!(
                f,
                "refused: the audit log `{log}` resolves inside the destination `{destination}`. \
                 The log audits this machine and ships nowhere; inside a bundle it would be \
                 redistributed to every recipient and would trip ADR-017 §13's own redaction scan. \
                 Point SPATIAL_IDE_AUDIT_LOG somewhere outside the bundle"
            ),
            Self::RotationFailed { path, detail } => write!(
                f,
                "refused: the audit log could not be rotated at `{path}` ({detail}), so its \
                 declared size ceiling cannot be honored (ADR-010 rule 6). Growing past a declared \
                 ceiling in silence would make the declaration untrue, so this refuses instead"
            ),
            Self::ControlCharacterInField { field } => write!(
                f,
                "refused: the audit field `{field}` contains a control character. Records are one \
                 canonical-JSON object per line, and a field that can carry a newline is a field \
                 that can forge a record boundary"
            ),
            Self::CredentialInRecord { class, byte_offset } => write!(
                f,
                "refused: the docs/09 scan found a `{class}` at byte {byte_offset} of the audit \
                 record about to be written. Credential redaction is unconditional — it is not \
                 excused by a field being deliberately supplied — so the record is not written and \
                 the operation does not run. Nothing has been created at the destination"
            ),
            Self::Canonical(e) => write!(f, "the audit record could not be serialized: {e}"),
        }
    }
}

impl std::error::Error for AuditError {}

impl From<CanonicalError> for AuditError {
    fn from(e: CanonicalError) -> Self {
        Self::Canonical(e)
    }
}
