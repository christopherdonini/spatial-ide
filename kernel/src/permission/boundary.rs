// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The class-3 boundary.** Grant → approval → intent record → execute → outcome record, and no
//! other way through.
//!
//! ## The order, and why the intent record comes before authorization
//!
//! 1. [`crate::publish::preflight`] — pure; yields the source hash and the style hash, creates
//!    nothing.
//! 2. Resolve the destination; open the audit log — which resolves its own path, refuses to sit
//!    inside the bundle, rotates at its ceiling, and **probes by opening for append**.
//! 3. **Write the intent record, and `sync_all` it.**
//! 4. Grant check, against the facts from step 1.
//! 5. Approval.
//! 6. **Grant check again**, against a fresh clock reading.
//! 7. [`crate::publish::publish_prepared`] — inside which `DestinationExists` fires and the staging
//!    directory is created.
//! 8. Outcome record.
//!
//! **Step 3 precedes step 4 deliberately, and this is a correction to the shape the brief implied.**
//! An unauthorized attempt is still an attempt. A log that recorded only the attempts that passed
//! the gate could not answer the question an audit exists for, and required tests 1–4 — which
//! demand "typed refusal, **audited**" — would be unsatisfiable if the record came after the check.
//!
//! The second-order consequence is named rather than discovered: because intent precedes
//! authorization, an unauthorized caller can grow the log. Nothing is exposed today, so there is no
//! such caller; at exposure the rotation ceiling bounds it to the declared ~40 MiB. That is an
//! independent reason ADR-010 rule 6's "a ceiling with no number is not declared" earns its keep.
//!
//! ## Two gates before any side effect, and what each one establishes
//!
//! The append-open in step 2 establishes **permission and existence**, and it lands *before the
//! operator is prompted* — so nobody is asked to approve an operation that could never have run. It
//! does **not** establish **space**; a full disk is caught by the intent write in step 3, which also
//! precedes anything being created. An empty `write_all(b"")` is deliberately not used as a probe:
//! it proves nothing on either platform.
//!
//! ## What is **not** audited, enumerated rather than summarized
//!
//! Everything before step 3 refuses with **no record at all**, and that is a longer list than the
//! obvious one. It is written out here because an earlier draft of this comment said "the one
//! refusal that cannot be audited is an unwritable log", which was false and would have let a
//! reader believe the log sees every refusal:
//!
//! - **`AuditError::Unwritable`** — the log is what failed, so it cannot record its own
//!   unavailability. This one is unavoidable.
//! - **`AuditError::LogInsideDestination`** and **`AuditError::RotationFailed`** — raised while
//!   establishing the log, before it is usable.
//! - **`PermissionError::DestinationUnresolvable`** — there is no resolved destination to record.
//! - **every refusal `publish::preflight` can make**: `SourceNotPinned`, `LicenseDeclaredTwice`,
//!   `LicenseNotCarryable`, `OperatorLicenseEmpty`, the three `ViewerLicense*` refusals,
//!   `CorrespondingSourceNotDurable`, `DatasetNameRejected`, and any `Style` or `Engine` error.
//!
//! **The ordering is deliberate and the omission is defensible, but only for a stated reason**:
//! nothing on that list is an attempt to *do* the operation. Each one is a request that never
//! became an attempt — malformed, unlicensable, or aimed at nowhere — and none of them can produce
//! a side effect. What the log promises is that **every attempt that reached the gate is recorded,
//! authorized or not**, which is the property required to answer "who published what". It does not
//! promise a record of every command that was typed.
//!
//! The reason it cannot simply be fixed by moving the record earlier: an intent record carries the
//! source content hash and the style hash, and `preflight` is what produces them. A record written
//! before `preflight` would have to leave both null, which is a worse record of a real attempt in
//! exchange for a record of a malformed one.
//!
//! ## Why `DestinationExists` is not hoisted up here
//!
//! It stays inside `publish`, so publishing to an occupied destination leaves intent +
//! `outcome{refused, error_kind:"DestinationExists"}`. That is correct rather than a gap: an attempt
//! to overwrite a published artifact is precisely the event an audit exists to record. Hoisting the
//! check would not remove the case either — ADR-017 §15 declares the pre-check TOCTOU and makes the
//! rename's own failure the authoritative second line — so it would only add a second spelling of a
//! rule whose real version is elsewhere.
//!
//! The property that *must* hold — **no staging directory when a grant is missing** — holds by
//! construction, because the whole boundary runs before `publish_prepared` is called.
//!
//! ## Declared recovery policy (ADR-010 rule 7)
//!
//! **`none` — fail visibly, write the outcome record, terminate with a typed error.** The same
//! policy `publish` and `slice-host` declare. The nasty case has its own variant: an outcome record
//! that fails to write *after a successful publish* means the bundle exists and the audit does not,
//! and [`BoundaryError::OutcomeNotAudited`] carries the successful outcome whole rather than
//! discarding it — the precedent `PublishError::StagingNotRemoved` sets for reporting two things
//! that both happened.

use std::path::PathBuf;
use std::time::Instant;

use spatial_engine::CancelToken;
use spatial_renderer::canonical;

use crate::publish::{
    self, PublishError, PublishOutcome, PublishProgress, PublishRequest, OPERATION_CLASS,
    REVERSIBILITY_CLASS,
};

use super::approval::{self, ApprovalPrompt, ApprovalSource};
use super::audit::log::is_inside as log_is_inside;
use super::audit::{
    ApprovalRoute, AuditLog, IntentRecord, Outcome, OutcomeRecord, normalize_destination,
};
use super::error::{AuditError, PermissionError};
use super::grant::{
    resolve_destination, GrantSet, OperationFacts, OperationKind, Principal, PublishGrant,
};

/// One gated attempt at a class-3 operation.
pub struct PublishAttempt<'a> {
    pub request: &'a PublishRequest<'a>,
    pub grants: &'a GrantSet,
    pub approval: &'a dyn ApprovalSource,
    /// Who is operating. Today the same OS user as the grantor; the type does not assume it.
    pub principal: &'a Principal,
    pub audit: &'a AuditLog,
    /// RFC-3339 UTC, injected so a test can pin every `at` in the log. Mirrors
    /// `PublishRequest::finished_at`, and for the same reason.
    pub clock: &'a dyn Fn() -> String,
}

/// What went wrong, kept in three separable kinds.
///
/// **Never flattened**, the same discipline `PublishError` applies to engine, style and canonical
/// failures: "denied" would hide which of three independent conditions failed, and they have three
/// different remedies.
#[derive(Debug)]
pub enum BoundaryError {
    Permission(PermissionError),
    Audit(AuditError),
    Publish(PublishError),
    /// The publish **succeeded** and its outcome record could not be written.
    ///
    /// Carries the outcome whole, because reporting only the audit failure would lose the fact that
    /// a bundle now exists on disk — and a caller who was told "audit failed" and not "you published
    /// something" has been told the less important half.
    OutcomeNotAudited { outcome: Box<PublishOutcome>, path: String, detail: String },
}

impl std::fmt::Display for BoundaryError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Permission(e) => write!(f, "{e}"),
            Self::Audit(e) => write!(f, "{e}"),
            Self::Publish(e) => write!(f, "{e}"),
            Self::OutcomeNotAudited { outcome, path, detail } => write!(
                f,
                "the publish SUCCEEDED and a bundle now exists at `{}`, but its outcome could not \
                 be recorded in the audit log `{path}` ({detail}). Both are reported: the first is \
                 what happened, the second is what the log does not say about it. The intent record \
                 is present, so the log shows an attempt with no outcome",
                normalize_destination(&outcome.bundle_path)
            ),
        }
    }
}

impl std::error::Error for BoundaryError {}

impl From<PermissionError> for BoundaryError {
    fn from(e: PermissionError) -> Self {
        Self::Permission(e)
    }
}
impl From<AuditError> for BoundaryError {
    fn from(e: AuditError) -> Self {
        Self::Audit(e)
    }
}
impl From<PublishError> for BoundaryError {
    fn from(e: PublishError) -> Self {
        Self::Publish(e)
    }
}

/// A short alias for [`BoundaryError`], so the two exhaustive matches below fit on one line each.
/// Declared here rather than after them, so a reader meeting `Self_::Permission` has already seen
/// what it is.
use BoundaryError as Self_;

/// The stable variant name of a refusal, for the audit record's `error_kind`.
///
/// **A variant name, never a rendered message.** A message is prose that can be reworded, and worse
/// it interpolates its inputs — a `DestinationNotWritable` display carries the path it failed on,
/// which would walk an un-normalized filesystem path into the record through the back door.
fn error_kind(e: &BoundaryError) -> &'static str {
    match e {
        Self_::Permission(p) => match p {
            PermissionError::NoGrant { .. } => "NoGrant",
            PermissionError::GrantScopeMismatch { .. } => "GrantScopeMismatch",
            PermissionError::GrantExpired { .. } => "GrantExpired",
            PermissionError::GrantCeilingExceeded { .. } => "GrantCeilingExceeded",
            PermissionError::GrantLifetimeExceeded { .. } => "GrantLifetimeExceeded",
            PermissionError::DestinationUnresolvable { .. } => "DestinationUnresolvable",
            PermissionError::ApprovalRefused { .. } => "ApprovalRefused",
            PermissionError::ApprovalUnavailable { .. } => "ApprovalUnavailable",
        },
        Self_::Audit(a) => match a {
            AuditError::Unwritable { .. } => "AuditUnwritable",
            AuditError::LogInsideDestination { .. } => "AuditLogInsideDestination",
            AuditError::RotationFailed { .. } => "AuditRotationFailed",
            AuditError::ControlCharacterInField { .. } => "AuditControlCharacterInField",
            AuditError::CredentialInRecord { .. } => "AuditCredentialInRecord",
            AuditError::Canonical(_) => "AuditCanonical",
        },
        Self_::Publish(p) => match p {
            PublishError::DestinationExists { .. } => "DestinationExists",
            PublishError::DestinationNotWritable { .. } => "DestinationNotWritable",
            PublishError::InsufficientSpace { .. } => "InsufficientSpace",
            PublishError::Io { .. } => "Io",
            PublishError::SourceNotPinned => "SourceNotPinned",
            PublishError::LicenseNotCarryable { .. } => "LicenseNotCarryable",
            PublishError::LicenseDeclaredTwice { .. } => "LicenseDeclaredTwice",
            PublishError::OperatorLicenseEmpty => "OperatorLicenseEmpty",
            PublishError::ViewerAssetPathRejected { .. } => "ViewerAssetPathRejected",
            PublishError::ViewerLicenseIncomplete { .. } => "ViewerLicenseIncomplete",
            PublishError::ViewerLicenseNoticeMissing { .. } => "ViewerLicenseNoticeMissing",
            PublishError::CorrespondingSourceNotDurable { .. } => "CorrespondingSourceNotDurable",
            PublishError::DatasetNameRejected { .. } => "DatasetNameRejected",
            PublishError::RowFilterNotRecordable => "RowFilterNotRecordable",
            PublishError::CeilingExceeded { .. } => "CeilingExceeded",
            PublishError::Cancelled => "Cancelled",
            PublishError::StagingNotRemoved { .. } => "StagingNotRemoved",
            PublishError::Engine(_) => "Engine",
            PublishError::Style(_) => "Style",
            PublishError::Canonical(_) => "Canonical",
        },
        Self_::OutcomeNotAudited { .. } => "OutcomeNotAudited",
    }
}

/// Whether a terminal is a refusal, a cancellation or a failure.
///
/// **Three outcomes rather than "not success"**, because they mean different things to whoever reads
/// the log: a refusal is the gate working, a cancellation is an operator changing their mind, and a
/// failure is a broken machine.
fn outcome_of(e: &BoundaryError) -> Outcome {
    match e {
        // **`ApprovalUnavailable` is a failure, not a refusal**, and the distinction is the whole
        // reason it is a separate variant. It means the approval *channel* broke — a closed pipe, a
        // console that cannot be read — not that anyone declined. Filing it as `refused` would make
        // the log say an operator turned the publish down when no operator was ever asked, which is
        // precisely what `error.rs` splits the variant off to prevent; the split would have been
        // discarded one function later.
        Self_::Permission(PermissionError::ApprovalUnavailable { .. }) => Outcome::Failed,
        Self_::Permission(_) => Outcome::Refused,
        Self_::Publish(p) => publish_outcome(p),
        Self_::Audit(_) | Self_::OutcomeNotAudited { .. } => Outcome::Failed,
    }
}

/// Classify a publish failure, **unwrapping a cleanup failure to the thing that actually went
/// wrong**.
///
/// `StagingNotRemoved` is two facts at once: an operation ended badly, *and* a staging directory
/// survived. Classifying the pair as `failed` would file an operator's Ctrl-C as a machine fault;
/// classifying it as whatever it wraps would lose the debris. So the record carries both — `outcome`
/// comes from the inner cause (recursively, since the wrapper carries a whole `PublishError`) and
/// `error_kind` stays `StagingNotRemoved`, which is what tells a reader something is still on disk.
fn publish_outcome(e: &PublishError) -> Outcome {
    match e {
        PublishError::Cancelled => Outcome::Cancelled,
        PublishError::StagingNotRemoved { after, .. } => publish_outcome(after),
        PublishError::DestinationExists { .. }
        | PublishError::SourceNotPinned
        | PublishError::LicenseNotCarryable { .. }
        | PublishError::LicenseDeclaredTwice { .. }
        | PublishError::OperatorLicenseEmpty
        | PublishError::ViewerAssetPathRejected { .. }
        | PublishError::ViewerLicenseIncomplete { .. }
        | PublishError::ViewerLicenseNoticeMissing { .. }
        | PublishError::CorrespondingSourceNotDurable { .. }
        | PublishError::DatasetNameRejected { .. }
        | PublishError::RowFilterNotRecordable
        | PublishError::CeilingExceeded { .. } => Outcome::Refused,
        PublishError::DestinationNotWritable { .. }
        | PublishError::InsufficientSpace { .. }
        | PublishError::Io { .. }
        | PublishError::Engine(_)
        | PublishError::Style(_)
        | PublishError::Canonical(_) => Outcome::Failed,
    }
}

/// Run one class-3 operation through the boundary.
pub fn execute(
    attempt: &PublishAttempt<'_>,
    cancel: &CancelToken,
    progress: Option<&dyn PublishProgress>,
) -> Result<PublishOutcome, BoundaryError> {
    let req = attempt.request;

    // ---- 1. facts, before anything is created --------------------------------------------------
    let pre = publish::preflight(req)?;
    let destination = resolve_destination(&req.destination)?;
    let facts = OperationFacts {
        operation: OperationKind::Publish,
        dataset_name: req.dataset_name.to_string(),
        content_hash: pre.source_content_hash(),
        destination: destination.clone(),
    };

    // ---- 2/3. the audit log, then the intent record --------------------------------------------
    //
    // The log was opened by the **caller** (`AuditLog::open_for`), which is where the probe, the
    // rotation and the inside-the-bundle refusal happen — all of them before anything below runs.
    //
    // **The inside-the-bundle check is re-run here, against this attempt's own destination.**
    // `open_for` takes the destination it is told about, and every field of `PublishAttempt` is
    // public, so a caller could hand `open_for` one path and `execute` another — which would leave
    // ADR-017 §13's "the log ships nowhere" resting on the caller having passed the same value
    // twice. Re-checking against the destination actually being published is what makes it a
    // property of the boundary rather than of its callers.
    if log_is_inside(attempt.audit.path(), &destination) {
        return Err(AuditError::LogInsideDestination {
            log: attempt.audit.display_path(),
            destination: normalize_destination(&destination),
        }
        .into());
    }

    let attempt_id = publish::random_suffix();
    let intent = IntentRecord {
        attempt: attempt_id.clone(),
        at: (attempt.clock)(),
        operation: publish::OPERATION,
        class: OPERATION_CLASS,
        reversibility: REVERSIBILITY_CLASS,
        principal_kind: attempt.principal.kind.as_str(),
        principal_name: attempt.principal.id.clone(),
        source_name: req.dataset_name.to_string(),
        source_content_hash: facts.content_hash.clone(),
        destination: normalize_destination(&destination),
        style_hash: pre.style_hash().to_string(),
    };
    attempt.audit.append_intent(&intent)?;

    // From here on, **every** return path writes an outcome record.
    let mut ctx = OutcomeContext {
        attempt_id,
        grantor_kind: None,
        grantor_name: None,
        grant_lifetime_s: None,
        grant_remaining_s: None,
        approval_route: None,
    };

    // ---- 4. the grant, before the operator is even shown the prompt ----------------------------
    let now = Instant::now();
    let grant = match attempt.grants.find(&facts, now) {
        Ok(g) => g,
        Err(e) => return Err(finish(attempt, &ctx, e.into())),
    };
    ctx.note_grant(grant, now);

    // ---- 5. approval ---------------------------------------------------------------------------
    let prompt = ApprovalPrompt {
        operation: publish::OPERATION,
        class: OPERATION_CLASS,
        reversibility: REVERSIBILITY_CLASS,
        source_name: req.dataset_name.to_string(),
        source_content_hash: facts.content_hash.clone(),
        style_hash: pre.style_hash().to_string(),
        destination_display: destination.display().to_string(),
        confirmation_phrase: confirmation_phrase(&destination),
        grantor: format!(
            "{} {}",
            grant.granted_by().kind.as_str(),
            grant.granted_by().id
        ),
        grant_remaining_s: grant.remaining(now).as_secs(),
    };
    ctx.approval_route = Some(attempt.approval.route());
    let given = match attempt.approval.respond(&prompt) {
        Ok(a) => a,
        Err(e) => return Err(finish(attempt, &ctx, e.into())),
    };
    if let Err(e) = approval::check(&prompt, &given) {
        return Err(finish(attempt, &ctx, e.into()));
    }

    // ---- 6. the grant again, against a fresh clock ---------------------------------------------
    //
    // **This is what stands in for the prompt timeout that `std` cannot give.** However long the
    // operator took to answer, the authorization is re-checked against its own declared lifetime
    // before anything is written — so a stale approval cannot ride an expired grant, and the bound
    // is the grant's rather than an arbitrary deadline.
    let now = Instant::now();
    let grant = match attempt.grants.find(&facts, now) {
        Ok(g) => g,
        Err(e) => return Err(finish(attempt, &ctx, e.into())),
    };
    ctx.note_grant(grant, now);

    // ---- 7. the operation ----------------------------------------------------------------------
    let result = publish::publish_prepared(req, pre, cancel, progress);

    // ---- 8. the outcome ------------------------------------------------------------------------
    match result {
        Ok(outcome) => {
            let manifest_hash = manifest_hash(&outcome.bundle_path);
            let record = OutcomeRecord {
                attempt: ctx.attempt_id.clone(),
                at: (attempt.clock)(),
                outcome: Outcome::Success,
                error_kind: None,
                grantor_kind: ctx.grantor_kind,
                grantor_name: ctx.grantor_name.clone(),
                grant_lifetime_s: ctx.grant_lifetime_s,
                grant_remaining_s: ctx.grant_remaining_s,
                approval_route: ctx.approval_route,
                operation_digest: Some(outcome.operation_digest.clone()),
                manifest_hash,
                rows: Some(outcome.rows),
                partitions: Some(outcome.partitions as u64),
            };
            match attempt.audit.append_outcome(&record) {
                Ok(()) => Ok(outcome),
                Err(e) => Err(BoundaryError::OutcomeNotAudited {
                    outcome: Box::new(outcome),
                    path: attempt.audit.display_path(),
                    detail: e.to_string(),
                }),
            }
        }
        Err(e) => Err(finish(attempt, &ctx, e.into())),
    }
}

/// What the outcome record knows by the time a terminal is reached.
struct OutcomeContext {
    attempt_id: String,
    grantor_kind: Option<&'static str>,
    grantor_name: Option<String>,
    grant_lifetime_s: Option<u64>,
    grant_remaining_s: Option<u64>,
    approval_route: Option<ApprovalRoute>,
}

impl OutcomeContext {
    fn note_grant(&mut self, grant: &PublishGrant, now: Instant) {
        self.grantor_kind = Some(grant.granted_by().kind.as_str());
        self.grantor_name = Some(grant.granted_by().id.clone());
        self.grant_lifetime_s = Some(grant.lifetime().as_secs());
        self.grant_remaining_s = Some(grant.remaining(now).as_secs());
    }
}

/// Write the outcome record for a failing terminal and return the error to report.
///
/// **An audit failure here does not replace the original error.** The operation failed for a reason
/// the caller needs; losing it in favour of "the log could not be written" would report the less
/// important of two facts. The audit failure is surfaced on stderr instead, because a silent one
/// would leave the log claiming an attempt had no ending.
fn finish(attempt: &PublishAttempt<'_>, ctx: &OutcomeContext, e: BoundaryError) -> BoundaryError {
    let record = OutcomeRecord {
        attempt: ctx.attempt_id.clone(),
        at: (attempt.clock)(),
        outcome: outcome_of(&e),
        error_kind: Some(error_kind(&e)),
        grantor_kind: ctx.grantor_kind,
        grantor_name: ctx.grantor_name.clone(),
        grant_lifetime_s: ctx.grant_lifetime_s,
        grant_remaining_s: ctx.grant_remaining_s,
        approval_route: ctx.approval_route,
        operation_digest: None,
        manifest_hash: None,
        rows: None,
        partitions: None,
    };
    if let Err(audit) = attempt.audit.append_outcome(&record) {
        eprintln!(
            "[publish] the outcome record could not be written to {}: {audit}. The audit log now \
             shows an attempt with no ending",
            attempt.audit.display_path()
        );
    }
    e
}

/// The phrase an operator must type. See [`super::approval`] for why it is the basename.
pub fn confirmation_phrase(resolved_destination: &std::path::Path) -> String {
    resolved_destination
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        // `resolve_destination` already refused a destination with no final component, so this is
        // unreachable; it is a value rather than a panic because a boundary that aborts is worse
        // than one that refuses.
        .unwrap_or_else(|| "(unnamed)".to_string())
}

/// The emitted manifest's hash, read back from the finished bundle.
///
/// **Computed here rather than by `publish`, and over what is on disk.** `PublishOutcome` carries a
/// byte count, not a hash, and `build_manifest` records the bundle's own hash as `Unknown` for a
/// stated reason — a manifest cannot contain its own hash. So the boundary reads the file after the
/// rename and hashes the bytes that exist, which is the same discipline `Staging::write` uses.
///
/// `None` when it cannot be read. A missing hash in the record is honest; a fabricated one would
/// not be, and the publish itself has already succeeded.
fn manifest_hash(bundle: &PathBuf) -> Option<String> {
    let path = bundle.join(crate::bundle::MANIFEST_PATH);
    let bytes = std::fs::read(path).ok()?;
    Some(canonical::sha256_hex(&bytes))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_confirmation_phrase_is_the_final_component() {
        assert_eq!(confirmation_phrase(std::path::Path::new("/a/b/parcels-2026")), "parcels-2026");
        assert_eq!(confirmation_phrase(std::path::Path::new(r"D:\maps\out")), "out");
    }

    /// A cleanup failure carries **two** facts, and the record keeps both: `outcome` describes what
    /// actually went wrong, `error_kind` says a staging directory survived.
    ///
    /// Otherwise an operator's Ctrl-C would appear in the log as a machine fault — or, the other way
    /// round, the debris left on disk would vanish from the record entirely.
    #[test]
    fn a_cleanup_failure_is_classified_by_what_it_wraps_and_still_names_itself() {
        for (inner, expected) in [
            (PublishError::Cancelled, Outcome::Cancelled),
            (PublishError::SourceNotPinned, Outcome::Refused),
            (
                PublishError::Io { context: "x".into(), raw_os_error: None, detail: "y".into() },
                Outcome::Failed,
            ),
        ] {
            let wrapped = BoundaryError::Publish(PublishError::StagingNotRemoved {
                after: Box::new(inner),
                path: "x".into(),
                detail: "y".into(),
            });
            assert_eq!(outcome_of(&wrapped), expected);
            assert_eq!(
                error_kind(&wrapped),
                "StagingNotRemoved",
                "the wrapper must still be named, or the debris on disk vanishes from the record"
            );
        }
    }

    /// Every permission failure is a refusal, and an IO failure is not.
    #[test]
    fn refusals_and_failures_are_not_conflated() {
        assert_eq!(
            outcome_of(&BoundaryError::Permission(PermissionError::NoGrant {
                operation: "publish-static-bundle"
            })),
            Outcome::Refused
        );
        assert_eq!(
            outcome_of(&BoundaryError::Publish(PublishError::Io {
                context: "x".into(),
                raw_os_error: None,
                detail: "y".into()
            })),
            Outcome::Failed
        );
    }
}
