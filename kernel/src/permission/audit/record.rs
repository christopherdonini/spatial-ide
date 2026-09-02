// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The two record shapes, and the schema they declare.
//!
//! ## Two phases, because a log that only records successes audits nothing
//!
//! One **intent** record is written before the operation runs, and one **outcome** record at every
//! terminal — success, typed refusal, cancellation, failure. An interrupted publish therefore leaves
//! an intent with no outcome, which is a *readable* state meaning "this started and we do not know
//! how it ended", rather than leaving nothing at all.
//!
//! The intent is written **before authorization is checked**, not after. An unauthorized attempt is
//! still an attempt, and a log that recorded only the attempts that passed the gate would be unable
//! to answer the question an audit exists for.
//!
//! ## JSON Lines, and why not one array
//!
//! One canonical-JSON object per line. A top-level array is unparseable after any partial write,
//! and this log's whole purpose is to survive the operation being interrupted. JSONL degrades to
//! "one corrupt line" instead.
//!
//! **JSON here is not an ADR-004 violation.** ADR-004 forbids JSON on **data hot paths**; an audit
//! record is a control-plane fact written twice per operation. It is the same distinction ADR-017
//! already draws for the manifest — "a reader that mistook a JSON manifest for a data-plane
//! violation would be reading the rule one level too high".
//!
//! Line framing does not rest on the escaper: every string admitted here is checked for control
//! characters first ([`no_control`]), so a field cannot forge a record boundary even if the writer's
//! escaping changed.
//!
//! ## What is deliberately absent
//!
//! - **`PublishRequest::started_at`.** The record carries one instant, its own `at`. Two wall-clock
//!   instants side by side is exactly the confusion ADR-017 §10/§12 draws a box around — one
//!   describes a request, the other an execution — and the audit has no need of the second.
//! - **`operation_digest` on the intent record.** It is computed inside `publish` from the resolved
//!   operation; claiming it before the operation ran would be a field describing something not yet
//!   decided.

use spatial_renderer::canonical::Json;

use super::super::error::AuditError;

/// The schema tag every record carries.
///
/// Versioned from the first record. ADR-017 §3's reasoning applies with the opposite conclusion:
/// there, a version bump was declined because `bundle_version` 1 had no external readers; here the
/// log is append-only, so **generation N and generation N+1 coexist in one file forever** and a
/// reader will meet both. A tag costs one member and is the only thing that makes the file
/// self-describing after a schema change.
pub const AUDIT_SCHEMA: &str = "spatial-audit/1";

/// How a class-3 attempt ended.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Outcome {
    Success,
    /// A typed refusal — no grant, scope mismatch, expiry, approval refused, destination exists.
    Refused,
    Cancelled,
    /// Something went wrong that is not a refusal: IO, disk full, a staging directory left behind.
    Failed,
}

impl Outcome {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Success => "success",
            Self::Refused => "refused",
            Self::Cancelled => "cancelled",
            Self::Failed => "failed",
        }
    }
}

/// The **channel** an approval was sought through — not evidence that one was given.
///
/// Recorded on refusals too, which is why it is `approval_route` and not `approval`: a record
/// saying `approval: "interactive"` beside `outcome: "refused"` reads as "an interactive approval
/// happened", when what happened is that the boundary asked interactively and was told no. The
/// channel is worth recording for exactly that case — "was this refused at a prompt or by a stale
/// script flag" is a question an audit reader has.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ApprovalRoute {
    /// Typed at a prompt.
    Interactive,
    /// Supplied as `--approve <destination>`.
    Flag,
    /// Typed into a host-composed DOM prompt in `frontends/shell`, compared in Rust
    /// (the publish cut). **Value-domain widening within `spatial-audit/1`** — the
    /// schema tag does not change; a reader already tolerant of an unrecognized `approval_route`
    /// string (this crate's own reader is not, but no external reader of this file is known to
    /// exist — `kernel/PERMISSION-BOUNDARY.md`'s "8 MiB × 4 remains one module's ceiling, not
    /// project policy" is the same posture on a different field) sees a third channel rather than a
    /// schema break. **Dated, no-external-readers justification, 2026-08-16, APPROVED 2026-09-02**
    /// (`DECISIONS-PENDING.md`'s resolved entry 6): the human confirmed the widening, with an
    /// **expiry clause** — this justification holds only while no external reader of this log
    /// exists; the day one does, the widening becomes a real schema decision this comment does
    /// not make, and needs its own.
    ShellDialog,
}

impl ApprovalRoute {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Interactive => "interactive",
            Self::Flag => "flag",
            Self::ShellDialog => "shell-dialog",
        }
    }
}

/// Written before anything is authorized, decided or created.
#[derive(Clone, Debug)]
pub struct IntentRecord {
    pub attempt: String,
    pub at: String,
    pub operation: &'static str,
    pub class: u8,
    pub reversibility: &'static str,
    pub principal_kind: &'static str,
    pub principal_name: String,
    pub source_name: String,
    pub source_content_hash: String,
    /// Already through [`super::normalize_destination`].
    pub destination: String,
    pub style_hash: String,
}

/// Written at the terminal, whatever the terminal was.
#[derive(Clone, Debug)]
pub struct OutcomeRecord {
    pub attempt: String,
    pub at: String,
    pub outcome: Outcome,
    /// The refusal's own variant name — never its rendered message.
    ///
    /// A message is prose that can be reworded and, worse, interpolates its inputs: a
    /// `DestinationNotWritable` display carries the path it failed on, which would put an
    /// un-normalized path into the record through the back door. The variant name is stable, is
    /// greppable, and carries nothing.
    pub error_kind: Option<&'static str>,
    pub grantor_kind: Option<&'static str>,
    pub grantor_name: Option<String>,
    pub grant_lifetime_s: Option<u64>,
    pub grant_remaining_s: Option<u64>,
    pub approval_route: Option<ApprovalRoute>,
    pub operation_digest: Option<String>,
    pub manifest_hash: Option<String>,
    pub rows: Option<u64>,
    pub partitions: Option<u64>,
}

/// Refuse a string that would break the one-record-per-line framing.
pub fn no_control(field: &'static str, s: &str) -> Result<(), AuditError> {
    if s.chars().any(|c| c.is_control()) {
        return Err(AuditError::ControlCharacterInField { field });
    }
    Ok(())
}

fn opt_str(v: Option<&String>) -> Json {
    match v {
        Some(s) => Json::str(s.clone()),
        None => Json::Null,
    }
}

fn opt_static(v: Option<&'static str>) -> Json {
    match v {
        Some(s) => Json::str(s),
        None => Json::Null,
    }
}

fn opt_uint(v: Option<u64>) -> Json {
    match v {
        Some(n) => Json::UInt(n),
        None => Json::Null,
    }
}

impl IntentRecord {
    /// The record as canonical JSON, in declared key order.
    ///
    /// `residual_classes` is supplied by the log rather than by the record, because it is the
    /// **log's** report about the bytes it is about to write — see [`super::log`] for the two-pass
    /// render that produces it.
    pub fn to_json(&self, residual_classes: &[&'static str]) -> Result<Json, AuditError> {
        no_control("principal_name", &self.principal_name)?;
        no_control("source_name", &self.source_name)?;
        no_control("source_content_hash", &self.source_content_hash)?;
        no_control("destination", &self.destination)?;
        no_control("style_hash", &self.style_hash)?;
        no_control("at", &self.at)?;
        Ok(Json::obj([
            ("schema", Json::str(AUDIT_SCHEMA)),
            ("attempt", Json::str(self.attempt.clone())),
            ("phase", Json::str("intent")),
            ("at", Json::str(self.at.clone())),
            ("operation", Json::str(self.operation)),
            ("class", Json::UInt(self.class as u64)),
            ("reversibility", Json::str(self.reversibility)),
            ("principal_kind", Json::str(self.principal_kind)),
            ("principal_name", Json::str(self.principal_name.clone())),
            ("source_name", Json::str(self.source_name.clone())),
            ("source_content_hash", Json::str(self.source_content_hash.clone())),
            ("destination", Json::str(self.destination.clone())),
            ("style_hash", Json::str(self.style_hash.clone())),
            (
                "residual_classes",
                Json::Arr(residual_classes.iter().map(|c| Json::str(*c)).collect()),
            ),
        ]))
    }
}

impl OutcomeRecord {
    pub fn to_json(&self, residual_classes: &[&'static str]) -> Result<Json, AuditError> {
        no_control("at", &self.at)?;
        if let Some(g) = &self.grantor_name {
            no_control("grantor_name", g)?;
        }
        if let Some(d) = &self.operation_digest {
            no_control("operation_digest", d)?;
        }
        if let Some(h) = &self.manifest_hash {
            no_control("manifest_hash", h)?;
        }
        Ok(Json::obj([
            ("schema", Json::str(AUDIT_SCHEMA)),
            ("attempt", Json::str(self.attempt.clone())),
            ("phase", Json::str("outcome")),
            ("at", Json::str(self.at.clone())),
            ("outcome", Json::str(self.outcome.as_str())),
            ("error_kind", opt_static(self.error_kind)),
            ("grantor_kind", opt_static(self.grantor_kind)),
            ("grantor_name", opt_str(self.grantor_name.as_ref())),
            ("grant_lifetime_s", opt_uint(self.grant_lifetime_s)),
            ("grant_remaining_s", opt_uint(self.grant_remaining_s)),
            ("approval_route", opt_static(self.approval_route.map(|a| a.as_str()))),
            ("operation_digest", opt_str(self.operation_digest.as_ref())),
            ("manifest_hash", opt_str(self.manifest_hash.as_ref())),
            ("rows", opt_uint(self.rows)),
            ("partitions", opt_uint(self.partitions)),
            // Present on **both** shapes, not just the intent. `residual_classes` is a statement
            // about the line it appears in, and an outcome record carries a grantor name; a field
            // that existed on only one shape would make a reader infer that the other had been
            // scanned and found clean, when in fact it had not been asked.
            (
                "residual_classes",
                Json::Arr(residual_classes.iter().map(|c| Json::str(*c)).collect()),
            ),
        ]))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use spatial_renderer::canonical::to_canonical_string;

    fn intent() -> IntentRecord {
        IntentRecord {
            attempt: "0123456789abcdef".into(),
            at: "2026-08-07T10:00:00Z".into(),
            operation: "publish-static-bundle",
            class: 3,
            reversibility: "irreversible",
            principal_kind: "os-user",
            principal_name: "someone".into(),
            source_name: "parcels".into(),
            source_content_hash: "sha256:aa".into(),
            destination: "<user-home>/out".into(),
            style_hash: "sha256:bb".into(),
        }
    }

    /// One line, no newline inside it — the property the whole framing rests on.
    #[test]
    fn a_rendered_record_occupies_exactly_one_line() {
        let s = to_canonical_string(&intent().to_json(&[]).unwrap()).unwrap();
        assert!(!s.contains('\n'), "{s}");
        assert!(s.starts_with('{') && s.ends_with('}'), "{s}");
    }

    /// A control character is refused rather than escaped, so framing does not depend on the
    /// escaper's behaviour for bytes no legitimate field contains.
    #[test]
    fn a_control_character_in_a_field_is_refused() {
        let mut r = intent();
        r.source_name = "par\ncels".into();
        assert!(matches!(
            r.to_json(&[]),
            Err(AuditError::ControlCharacterInField { field: "source_name" })
        ));
    }

    /// Both shapes carry a fixed key set, and it is pinned — a record that silently gained or lost
    /// a member would change what every future reader of an append-only file must handle.
    #[test]
    fn both_shapes_declare_a_fixed_key_set_in_a_fixed_order() {
        let Json::Obj(members) = intent().to_json(&["username"]).unwrap() else { panic!() };
        let keys: Vec<&str> = members.iter().map(|(k, _)| k.as_str()).collect();
        assert_eq!(
            keys,
            [
                "schema", "attempt", "phase", "at", "operation", "class", "reversibility",
                "principal_kind", "principal_name", "source_name", "source_content_hash",
                "destination", "style_hash", "residual_classes"
            ]
        );

        let outcome = OutcomeRecord {
            attempt: "0123456789abcdef".into(),
            at: "2026-08-07T10:00:01Z".into(),
            outcome: Outcome::Success,
            error_kind: None,
            grantor_kind: Some("os-user"),
            grantor_name: Some("someone".into()),
            grant_lifetime_s: Some(300),
            grant_remaining_s: Some(299),
            approval_route: Some(ApprovalRoute::Flag),
            operation_digest: Some("sha256:cc".into()),
            manifest_hash: Some("sha256:dd".into()),
            rows: Some(10),
            partitions: Some(1),
        };
        let Json::Obj(members) = outcome.to_json(&[]).unwrap() else { panic!() };
        let keys: Vec<&str> = members.iter().map(|(k, _)| k.as_str()).collect();
        assert_eq!(
            keys,
            [
                "schema", "attempt", "phase", "at", "outcome", "error_kind", "grantor_kind",
                "grantor_name", "grant_lifetime_s", "grant_remaining_s", "approval_route",
                "operation_digest", "manifest_hash", "rows", "partitions", "residual_classes"
            ]
        );
    }

    /// An absent member is `null`, never omitted: a reader distinguishing "no grant was found" from
    /// "this schema does not have that field" needs the key to be there.
    #[test]
    fn absent_members_are_null_rather_than_missing() {
        let r = OutcomeRecord {
            attempt: "0123456789abcdef".into(),
            at: "2026-08-07T10:00:01Z".into(),
            outcome: Outcome::Refused,
            error_kind: Some("NoGrant"),
            grantor_kind: None,
            grantor_name: None,
            grant_lifetime_s: None,
            grant_remaining_s: None,
            approval_route: None,
            operation_digest: None,
            manifest_hash: None,
            rows: None,
            partitions: None,
        };
        let s = to_canonical_string(&r.to_json(&[]).unwrap()).unwrap();
        assert!(s.contains(r#""grantor_name":null"#), "{s}");
        assert!(s.contains(r#""manifest_hash":null"#), "{s}");
        assert!(s.contains(r#""error_kind":"NoGrant""#), "{s}");
    }

    /// **`ApprovalRoute::ShellDialog`, the third channel (`NEXT-CUT.md`'s publish cut).** A new
    /// value in `approval_route`'s domain, never a new key — the outcome record's key set is
    /// asserted unchanged from the two-variant pinning above, and the value renders as the wire
    /// spelling `"shell-dialog"`.
    #[test]
    fn shell_dialog_serializes_as_shell_dialog_and_the_key_set_is_unchanged() {
        assert_eq!(ApprovalRoute::ShellDialog.as_str(), "shell-dialog");

        let outcome = OutcomeRecord {
            attempt: "0123456789abcdef".into(),
            at: "2026-08-16T10:00:00Z".into(),
            outcome: Outcome::Success,
            error_kind: None,
            grantor_kind: Some("os-user"),
            grantor_name: Some("someone".into()),
            grant_lifetime_s: Some(120),
            grant_remaining_s: Some(90),
            approval_route: Some(ApprovalRoute::ShellDialog),
            operation_digest: Some("sha256:cc".into()),
            manifest_hash: Some("sha256:dd".into()),
            rows: Some(10),
            partitions: Some(1),
        };
        let Json::Obj(members) = outcome.to_json(&[]).unwrap() else { panic!() };
        let keys: Vec<&str> = members.iter().map(|(k, _)| k.as_str()).collect();
        assert_eq!(
            keys,
            [
                "schema", "attempt", "phase", "at", "outcome", "error_kind", "grantor_kind",
                "grantor_name", "grant_lifetime_s", "grant_remaining_s", "approval_route",
                "operation_digest", "manifest_hash", "rows", "partitions", "residual_classes"
            ],
            "a third ApprovalRoute variant must not change the outcome record's key set"
        );
        let s = to_canonical_string(&outcome.to_json(&[]).unwrap()).unwrap();
        assert!(s.contains(r#""approval_route":"shell-dialog""#), "{s}");
    }
}
