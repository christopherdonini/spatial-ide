// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A human-legible reader over the audit log's own `spatial-audit/1` JSONL.
//!
//! **ADR-017's Exposure review, 2026-08-17, condition 2** — the human's own words, verbatim: *"the
//! audit record must be human-legible without a decoder in the loop ... the raw JSONL was honest
//! but unreadable by its own audience"* (G6). This module is that reader; `publish-bundle
//! --audit-show` (`kernel/src/bin/publish-bundle.rs`) is its one caller.
//!
//! **Read-only.** Nothing here ever opens the log for write, rotates it, or otherwise touches it —
//! [`render_audit_log`] takes the file's own text and returns sentences, nothing more. It also
//! **redacts nothing of its own**: every field it prints is one the record already carries, having
//! already passed through `AuditLog::classify`'s own `docs/09` scan at write time
//! (`super::log`'s own module docs). This reader performs no scan and can therefore never *un*redact
//! anything the writer withheld — there is nothing here capable of reconstructing a `credential`
//! finding the log itself refused to write in the first place.
//!
//! ## Corruption is visible, not silent
//!
//! The same doctrine `super::log`'s own module docs state for the write side — *"an interleaved
//! line fails to parse and is visible as corrupt, rather than silently changing a valid record's
//! meaning"* — governs the read side too. A line that does not parse as JSON, that does not carry
//! the `spatial-audit/1` schema tag, or that is missing a field this reader needs to say anything
//! about it, is reported as its own `CORRUPT` line in the output — **never dropped, never merged
//! into a neighbour, never silently skipped.**
//!
//! ## Two schema generations on one machine, and this reader tolerates both
//!
//! `super::mod`'s own module docs: *"the log is append-only, so generation N and generation N+1
//! coexist in one file forever and a reader will meet both."* This is not hypothetical for
//! `approval_route`: the field was named `approval` before it was renamed
//! (`kernel/src/permission/audit/record.rs`'s own git history), and a real, still-live log on this
//! project's own development machine carries lines from both spellings. Reading `approval` as a
//! fallback when `approval_route` is absent is exactly the tolerance the schema's own append-only
//! design calls for — it is not corruption, and is not reported as any.
//!
//! ## Pairing
//!
//! Records are paired by `attempt`. An outcome met with a pending intent renders one sentence at
//! that point (which is also the point the file's own natural order presents it, since
//! [`super::log::AuditLog`] always appends an outcome after its own intent for one attempt). An
//! intent with no outcome by end of file is an **orphan intent** — reported honestly as "intent
//! recorded, no outcome (interrupted?)" rather than dropped, which is also what an
//! `OutcomeNotAudited` boundary result looks like from this reader's side, since that case is
//! precisely an outcome that was never written. An outcome met with no pending intent (should not
//! occur given the write-side invariant, but a corrupted or otherwise-lost intent line can produce
//! one) is reported as its own case too, rather than silently attached to nothing.

use std::collections::HashMap;

use super::record::AUDIT_SCHEMA;

/// Render one `spatial-audit/1` JSONL file's text as plain-language lines, one per intent/outcome
/// pair (or per orphan, or per corrupt line) — [`publish-bundle --audit-show`'s][1] entire output.
///
/// [1]: ../../../bin/publish-bundle.rs
pub fn render_audit_log(text: &str) -> Vec<String> {
    let mut pending: HashMap<String, Intent> = HashMap::new();
    // First-seen order of attempt ids that still have a pending intent when the loop below ends —
    // walked afterward to emit orphan intents in the order their attempts first appeared, rather
    // than in `HashMap`'s own unspecified iteration order.
    let mut order: Vec<String> = Vec::new();
    let mut out: Vec<String> = Vec::new();

    for (i, raw) in text.lines().enumerate() {
        let line_no = i + 1;
        if raw.trim().is_empty() {
            continue;
        }

        let value: serde_json::Value = match serde_json::from_str(raw) {
            Ok(v) => v,
            Err(e) => {
                out.push(format!(
                    "line {line_no}: CORRUPT — does not parse as JSON ({e}); reported, not skipped"
                ));
                continue;
            }
        };

        let schema = value.get("schema").and_then(|v| v.as_str());
        if schema != Some(AUDIT_SCHEMA) {
            out.push(format!(
                "line {line_no}: CORRUPT — not a {AUDIT_SCHEMA} record (schema is {}); reported, \
                 not skipped",
                describe(schema)
            ));
            continue;
        }

        let Some(attempt) = value.get("attempt").and_then(|v| v.as_str()) else {
            out.push(format!(
                "line {line_no}: CORRUPT — a {AUDIT_SCHEMA} record with no `attempt` id; reported, \
                 not skipped"
            ));
            continue;
        };
        let attempt = attempt.to_string();

        match value.get("phase").and_then(|v| v.as_str()) {
            Some("intent") => match Intent::from_json(&value) {
                Some(intent) => {
                    if !pending.contains_key(&attempt) {
                        order.push(attempt.clone());
                    }
                    pending.insert(attempt, intent);
                }
                None => out.push(format!(
                    "line {line_no}: CORRUPT — an intent record missing `at` or `destination`; \
                     reported, not skipped"
                )),
            },
            Some("outcome") => match Outcome::from_json(&value) {
                Some(outcome) => match pending.remove(&attempt) {
                    Some(intent) => out.push(render_pair(&intent, &outcome)),
                    None => out.push(render_orphan_outcome(&attempt, &outcome)),
                },
                None => out.push(format!(
                    "line {line_no}: CORRUPT — an outcome record missing `at` or `outcome`; \
                     reported, not skipped"
                )),
            },
            other => out.push(format!(
                "line {line_no}: CORRUPT — a {AUDIT_SCHEMA} record with an unrecognized `phase` \
                 ({}); reported, not skipped",
                describe(other)
            )),
        }
    }

    for attempt in order {
        if let Some(intent) = pending.remove(&attempt) {
            out.push(render_orphan_intent(&intent));
        }
    }

    out
}

fn describe(s: Option<&str>) -> String {
    match s {
        Some(s) => format!("`{s}`"),
        None => "absent".to_string(),
    }
}

struct Intent {
    at: String,
    destination: String,
}

impl Intent {
    fn from_json(v: &serde_json::Value) -> Option<Self> {
        Some(Self {
            at: v.get("at")?.as_str()?.to_string(),
            destination: v.get("destination")?.as_str()?.to_string(),
        })
    }
}

struct Outcome {
    at: String,
    outcome: String,
    error_kind: Option<String>,
    approval_route: Option<String>,
    rows: Option<u64>,
    partitions: Option<u64>,
}

impl Outcome {
    fn from_json(v: &serde_json::Value) -> Option<Self> {
        Some(Self {
            at: v.get("at")?.as_str()?.to_string(),
            outcome: v.get("outcome")?.as_str()?.to_string(),
            error_kind: v.get("error_kind").and_then(|v| v.as_str()).map(str::to_string),
            // `approval_route` is the current field name; `approval` is the same domain's earlier
            // spelling — see this module's own top doc comment on why both are read.
            approval_route: v
                .get("approval_route")
                .or_else(|| v.get("approval"))
                .and_then(|v| v.as_str())
                .map(str::to_string),
            rows: v.get("rows").and_then(|v| v.as_u64()),
            partitions: v.get("partitions").and_then(|v| v.as_u64()),
        })
    }
}

/// `"2026-08-17T08:44:08Z"` → `"2026-08-17 08:44"` — `clock::rfc3339_utc`'s own fixed-width shape
/// (`YYYY-MM-DDTHH:MM:SSZ`, 20 bytes, `T` at index 10), sliced rather than parsed with a date
/// crate, the same "no date crate is pulled in for one string" reasoning `clock.rs` states for the
/// write side. A value that does not match the shape is shown verbatim rather than mangled.
fn plain_date(at: &str) -> String {
    if at.len() >= 16 && at.as_bytes().get(10) == Some(&b'T') {
        format!("{} {}", &at[0..10], &at[11..16])
    } else {
        at.to_string()
    }
}

fn plain_route(route: &str) -> String {
    match route {
        "shell-dialog" => "shell dialog".to_string(),
        "interactive" => "an interactive prompt".to_string(),
        "flag" => "the --approve flag".to_string(),
        other => other.to_string(),
    }
}

/// `error_kind`'s stable variant name (`boundary.rs::error_kind`'s own doc comment: "a variant
/// name, never a rendered message") turned into a plain-language fragment for a reader with no
/// Rust source open beside them. Every arm here is a real variant this tree's own `error_kind`
/// function can write (`kernel/src/permission/boundary.rs`); an unrecognized string — a future
/// variant this reader has not been told about yet — is shown as itself rather than guessed at.
fn plain_reason(kind: &str) -> String {
    match kind {
        "NoGrant" => "no grant authorized this publish".to_string(),
        "GrantScopeMismatch" => "the grant did not cover this operation".to_string(),
        "GrantExpired" => "the matching grant had expired".to_string(),
        "GrantCeilingExceeded" => "the declared grant ceiling was reached".to_string(),
        "GrantLifetimeExceeded" => "the requested grant lifetime exceeded the declared ceiling".to_string(),
        "DestinationUnresolvable" => "the destination could not be resolved".to_string(),
        "ApprovalRefused" => {
            "the confirmation did not match the destination (wrong phrase, or none given)".to_string()
        }
        "ApprovalUnavailable" => "the approval channel failed (not an operator decision)".to_string(),
        "AuditUnwritable" => "the audit log itself could not be written".to_string(),
        "AuditLogInsideDestination" => "the audit log path resolved inside the destination".to_string(),
        "AuditRotationFailed" => "the audit log could not be rotated".to_string(),
        "AuditControlCharacterInField" => "a record field contained a control character".to_string(),
        "AuditCredentialInRecord" => "a credential was found in the record and refused".to_string(),
        "AuditCanonical" => "the record could not be serialized".to_string(),
        "DestinationExists" => "the destination already exists".to_string(),
        "DestinationNotWritable" => "the destination was not writable".to_string(),
        "InsufficientSpace" => "there was not enough disk space".to_string(),
        "Io" => "an I/O error occurred".to_string(),
        "SourceNotPinned" => "the source was not content-pinned before publishing".to_string(),
        "LicenseNotCarryable" => "the source's license could not be carried forward".to_string(),
        "LicenseDeclaredTwice" => "a license was declared twice".to_string(),
        "OperatorLicenseEmpty" => "an empty operator license was declared".to_string(),
        "ViewerAssetPathRejected" => "a viewer asset path was rejected".to_string(),
        "ViewerLicenseIncomplete" => "the viewer license was incomplete".to_string(),
        "ViewerLicenseNoticeMissing" => "the viewer's own notice file was missing".to_string(),
        "CorrespondingSourceNotDurable" => "the corresponding-source route was not durable".to_string(),
        "DatasetNameRejected" => "the dataset name was rejected".to_string(),
        "RowFilterNotRecordable" => {
            "the active row filter cannot be recorded in this bundle format".to_string()
        }
        "CeilingExceeded" => "a declared ceiling was exceeded".to_string(),
        "StagingNotRemoved" => "the operation failed and left a staging directory behind".to_string(),
        "Engine" => "an engine-level error occurred".to_string(),
        "Style" => "a style error occurred".to_string(),
        "Canonical" => "the operation could not be serialized".to_string(),
        other => format!("`{other}` (not one of the reasons this reader recognizes)"),
    }
}

fn render_pair(intent: &Intent, outcome: &Outcome) -> String {
    let date = plain_date(&outcome.at);
    let head = format!("{date} — publish to {} —", intent.destination);
    match outcome.outcome.as_str() {
        "success" => {
            let rows = match outcome.rows {
                Some(r) => r.to_string(),
                None => "an unrecorded number of".to_string(),
            };
            let partitions = outcome.partitions.unwrap_or(0);
            let noun = if partitions == 1 { "partition" } else { "partitions" };
            let route = outcome
                .approval_route
                .as_deref()
                .map(plain_route)
                .unwrap_or_else(|| "an unrecorded route".to_string());
            format!("{head} APPROVED via {route} and SUCCEEDED ({rows} rows, {partitions} {noun})")
        }
        "refused" => {
            let reason = outcome
                .error_kind
                .as_deref()
                .map(plain_reason)
                .unwrap_or_else(|| "no reason was recorded".to_string());
            format!("{head} REFUSED: {reason}")
        }
        "cancelled" => format!(
            "{head} CANCELLED — the operation was stopped before it finished (an operator's own \
             cancel, or a Ctrl-C)"
        ),
        "failed" => {
            let reason = outcome
                .error_kind
                .as_deref()
                .map(plain_reason)
                .unwrap_or_else(|| "no reason was recorded".to_string());
            format!("{head} FAILED: {reason}")
        }
        other => format!(
            "{head} outcome `{other}` (not one of success/refused/cancelled/failed this reader \
             recognizes — reported as itself, not guessed at)"
        ),
    }
}

fn render_orphan_intent(intent: &Intent) -> String {
    let date = plain_date(&intent.at);
    format!("{date} — publish to {} — intent recorded, no outcome (interrupted?)", intent.destination)
}

fn render_orphan_outcome(attempt: &str, outcome: &Outcome) -> String {
    let date = plain_date(&outcome.at);
    format!(
        "{date} — attempt {attempt} — outcome recorded with no matching intent (destination \
         unknown) — outcome: {}",
        outcome.outcome
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    /// One success pair, one refused pair, one orphan intent, and one unparseable line — the exact
    /// fixture shape this piece's own scope names. Every line here is a real `spatial-audit/1`
    /// record shape (`record.rs`'s own fixed key sets), typed by hand rather than produced by
    /// [`super::super::log::AuditLog`], so this test proves the READER against the schema
    /// independent of the writer that happens to share this crate.
    fn fixture() -> String {
        [
            // Attempt A: intent + a successful outcome.
            r#"{"schema":"spatial-audit/1","attempt":"aaa1","phase":"intent","at":"2026-08-17T08:44:08Z","operation":"publish-static-bundle","class":3,"reversibility":"irreversible","principal_kind":"os-user","principal_name":"Christopher","source_name":"parcels","source_content_hash":"sha256:aa","destination":"C:/dev/out/parcels","style_hash":"sha256:bb","residual_classes":["local-filesystem-path"]}"#,
            r#"{"schema":"spatial-audit/1","attempt":"aaa1","phase":"outcome","at":"2026-08-17T08:44:09Z","outcome":"success","error_kind":null,"grantor_kind":"os-user","grantor_name":"Christopher","grant_lifetime_s":120,"grant_remaining_s":99,"approval_route":"shell-dialog","operation_digest":"sha256:cc","manifest_hash":"sha256:dd","rows":2000,"partitions":1,"residual_classes":[]}"#,
            // Attempt B: intent + a refused outcome.
            r#"{"schema":"spatial-audit/1","attempt":"bbb2","phase":"intent","at":"2026-08-17T09:00:00Z","operation":"publish-static-bundle","class":3,"reversibility":"irreversible","principal_kind":"os-user","principal_name":"Christopher","source_name":"parcels","source_content_hash":"sha256:aa","destination":"C:/dev/out/refused-one","style_hash":"sha256:bb","residual_classes":["local-filesystem-path"]}"#,
            r#"{"schema":"spatial-audit/1","attempt":"bbb2","phase":"outcome","at":"2026-08-17T09:00:00Z","outcome":"refused","error_kind":"ApprovalRefused","grantor_kind":"os-user","grantor_name":"Christopher","grant_lifetime_s":120,"grant_remaining_s":118,"approval_route":"shell-dialog","operation_digest":null,"manifest_hash":null,"rows":null,"partitions":null,"residual_classes":[]}"#,
            // Attempt C: intent only -- interrupted, never reached an outcome.
            r#"{"schema":"spatial-audit/1","attempt":"ccc3","phase":"intent","at":"2026-08-17T09:15:00Z","operation":"publish-static-bundle","class":3,"reversibility":"irreversible","principal_kind":"os-user","principal_name":"Christopher","source_name":"parcels","source_content_hash":"sha256:aa","destination":"C:/dev/out/interrupted","style_hash":"sha256:bb","residual_classes":[]}"#,
            // An unparseable line -- truncated mid-object, as an interrupted write would leave one
            // (`log.rs`'s own module docs: "an interleaved line fails to parse").
            r#"{"schema":"spatial-audit/1","attempt":"ddd4","phase":"intent","at":"2026-08-17T09:2"#,
        ]
        .join("\n")
    }

    #[test]
    fn a_success_pair_reads_as_one_plain_sentence() {
        let lines = render_audit_log(&fixture());
        let line = lines.iter().find(|l| l.contains("C:/dev/out/parcels")).expect("the pair is present");
        assert!(line.starts_with("2026-08-17 08:44"), "{line}");
        assert!(line.contains("APPROVED via shell dialog"), "{line}");
        assert!(line.contains("SUCCEEDED"), "{line}");
        assert!(line.contains("2000 rows"), "{line}");
        assert!(line.contains("1 partition)"), "{line} (singular noun expected for exactly one)");
    }

    #[test]
    fn a_refused_pair_names_the_plain_reason_not_the_bare_variant() {
        let lines = render_audit_log(&fixture());
        let line = lines
            .iter()
            .find(|l| l.contains("C:/dev/out/refused-one"))
            .expect("the pair is present");
        assert!(line.contains("REFUSED:"), "{line}");
        assert!(line.contains("did not match the destination"), "{line}");
        assert!(!line.contains("ApprovalRefused"), "the raw variant name must not leak: {line}");
    }

    #[test]
    fn an_orphan_intent_is_reported_honestly_not_dropped() {
        let lines = render_audit_log(&fixture());
        let line = lines
            .iter()
            .find(|l| l.contains("C:/dev/out/interrupted"))
            .expect("the orphan intent is present");
        assert!(line.contains("intent recorded, no outcome (interrupted?)"), "{line}");
    }

    #[test]
    fn an_unparseable_line_is_reported_as_corrupt_not_skipped_silently() {
        let lines = render_audit_log(&fixture());
        let corrupt = lines.iter().find(|l| l.starts_with("line 6:")).expect(
            "the sixth fixture line (truncated mid-object) must produce its own reported line, not \
             vanish",
        );
        assert!(corrupt.contains("CORRUPT"), "{corrupt}");
        assert!(corrupt.contains("does not parse as JSON"), "{corrupt}");
    }

    #[test]
    fn exactly_four_output_lines_for_four_attempts_nothing_merged_nothing_lost() {
        let lines = render_audit_log(&fixture());
        assert_eq!(lines.len(), 4, "{lines:#?}");
    }

    #[test]
    fn a_record_declaring_an_unrecognized_schema_is_reported_as_corrupt() {
        let text = r#"{"schema":"spatial-audit/2","attempt":"x","phase":"intent","at":"2026-08-17T00:00:00Z","destination":"d"}"#;
        let lines = render_audit_log(text);
        assert_eq!(lines.len(), 1, "{lines:#?}");
        assert!(lines[0].contains("CORRUPT"), "{}", lines[0]);
        assert!(lines[0].contains("not a spatial-audit/1 record"), "{}", lines[0]);
    }

    /// **The append-only property named in this module's own top doc comment, exercised directly**:
    /// a line using the pre-rename `approval` field (`record.rs`'s own git history) is not corrupt
    /// -- it is an earlier, still-valid generation of the same schema tag, and this reader must
    /// read its route exactly as it would read `approval_route`.
    #[test]
    fn a_pre_rename_approval_field_is_read_as_approval_route_not_reported_as_corrupt() {
        let text = [
            r#"{"schema":"spatial-audit/1","attempt":"e1","phase":"intent","at":"2026-08-07T10:02:29Z","destination":"C:/dev/out/legacy"}"#,
            r#"{"schema":"spatial-audit/1","attempt":"e1","phase":"outcome","at":"2026-08-07T10:02:29Z","outcome":"success","approval":"interactive","rows":5,"partitions":1}"#,
        ]
        .join("\n");
        let lines = render_audit_log(&text);
        assert_eq!(lines.len(), 1, "{lines:#?}");
        assert!(lines[0].contains("APPROVED via an interactive prompt"), "{}", lines[0]);
        assert!(!lines[0].contains("CORRUPT"), "{}", lines[0]);
    }

    #[test]
    fn blank_lines_are_ignored_without_being_reported_as_corrupt() {
        let text = format!("{}\n\n\n", fixture());
        assert_eq!(render_audit_log(&text).len(), render_audit_log(&fixture()).len());
    }
}
