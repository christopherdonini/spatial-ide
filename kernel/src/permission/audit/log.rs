// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The append-only audit log: where it lives, what bounds it, and what it does not promise.
//!
//! ## Location, and why it is not beside the bundle
//!
//! Default `<data-dir>/spatial-ide/audit/publish.jsonl` — `%LOCALAPPDATA%` on Windows,
//! `$XDG_DATA_HOME` else `$HOME/.local/share` elsewhere. `SPATIAL_IDE_AUDIT_LOG` overrides it with
//! an absolute path, and **there is deliberately no value that turns it off**: an unauditable
//! class-3 operation does not run, and a switch to disable the log would be a switch to disable the
//! gate.
//!
//! It is **not** written beside the destination, for three reasons that all point the same way. The
//! log audits the operator's *machine*, not the artifact. A log under the destination would be
//! **inside the bundle** — redistributed to every recipient, and caught by ADR-017 §13's own scan.
//! And it would be a second artifact that a future `--replace` destroys. The first of those is
//! enforced structurally, not by convention: [`AuditLog::open_for`] refuses a log path that resolves
//! inside the destination.
//!
//! ## What the append guarantees, and what it does not
//!
//! - **Guaranteed:** `OpenOptions::append` positions every write at end-of-file *at write time* on
//!   both Windows and POSIX, so two appenders do not overwrite each other's bytes.
//! - **Guaranteed:** within this process, one `Mutex` is held across open → write → sync, so the
//!   process never interleaves with itself. That is the only atomicity claimed.
//! - **Not guaranteed:** a single `write` is not atomic in general. A record is a few hundred bytes,
//!   far below any plausible partial-write threshold on either platform, but that is a practical
//!   expectation and not a standard. This is the second reason for JSON Lines: an interleaved line
//!   **fails to parse and is visible as corrupt**, rather than silently changing a valid record's
//!   meaning.
//! - **Not coordinated across processes:** `std` has no portable file locking, so nothing serializes
//!   two concurrent `publish-bundle` runs. Declared rather than closed — the same posture
//!   `Staging::finalize` takes about its residual TOCTOU race.
//! - `sync_all` runs per record, because the log's purpose is to survive an interrupted operation:
//!   a power loss mid-publish must still show the intent. **Its cost is unmeasured and no latency
//!   figure is claimed** (`docs/08`: no numbers, no claim).
//!
//! ## Declared ceilings (ADR-010 rule 6)
//!
//! | Ceiling | Value | At the ceiling |
//! |---|---|---|
//! | [`MAX_AUDIT_LOG_BYTES`] | 8 MiB | rotate, at boundary entry, before the intent record |
//! | [`MAX_AUDIT_LOG_GENERATIONS`] | 4 | the oldest generation is **deleted** |
//! | effective retention | ≈40 MiB over ~5 files | oldest records discarded, not archived |
//!
//! At roughly 400 bytes a record and two records a publish, one generation is on the order of
//! 10 000 publishes. The arithmetic is given so the number reads as a choice rather than a guess.
//!
//! **This does not settle `docs/09`'s "To be specified: audit-log retention."** That item is
//! retention across every class-3 operation and every client; this is a v0 ceiling for one log in
//! one module, offered as the first datum. The gap stays open and is flagged in
//! `kernel/PERMISSION-BOUNDARY.md`.

use std::io::Write as _;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

use spatial_renderer::canonical::{to_canonical_string, Json};

use super::super::error::AuditError;
use super::normalize_destination;
use super::record::{IntentRecord, OutcomeRecord};
use crate::bundle::redaction::{scan, MachineIdentifiers, OPERATOR_DECLARED};

/// The environment variable that relocates the log. Absolute paths only.
pub const AUDIT_LOG_ENV: &str = "SPATIAL_IDE_AUDIT_LOG";

/// Rotate when the live log is at or above this size (ADR-010 rule 6).
pub const MAX_AUDIT_LOG_BYTES: u64 = 8 * 1024 * 1024;

/// How many rotated generations are kept before the oldest is deleted (ADR-010 rule 6).
pub const MAX_AUDIT_LOG_GENERATIONS: u32 = 4;

/// The `docs/09` classes that are recorded rather than fatal.
///
/// A flat "no findings" rule would make **every** record unwritable: the destination is the record's
/// subject, and `local-filesystem-path` is deliberately never attributable in
/// `bundle::redaction`. So the path classes are named in the record's own `residual_classes` — the
/// log states its own leakage instead of hiding it — while `credential` is fatal, unconditionally.
const RESIDUAL_CLASSES: &[&str] = &["local-filesystem-path", "username", "machine-identifier"];

/// An open, bounded, append-only audit log.
pub struct AuditLog {
    path: PathBuf,
    /// Held across open → write → sync. See the module docs for exactly what this does and does not
    /// buy.
    gate: Mutex<()>,
}

impl AuditLog {
    /// Resolve, bound-check and probe the log for a publish to `destination_resolved`.
    ///
    /// **Everything that can refuse, refuses here** — before the operator is prompted and before any
    /// side effect exists. Opening for append establishes *permission and existence*; it does not
    /// establish *space*, which the intent write immediately afterwards does, and which also runs
    /// before anything is created.
    ///
    /// An empty `write_all(b"")` is deliberately **not** used as a probe: it proves nothing on
    /// either platform.
    pub fn open_for(destination_resolved: &Path) -> Result<Self, AuditError> {
        let path = resolve_log_path()?;

        // Structural, not conventional: the log must not end up inside the artifact.
        if is_inside(&path, destination_resolved) {
            return Err(AuditError::LogInsideDestination {
                log: normalize_destination(&path),
                destination: normalize_destination(destination_resolved),
            });
        }

        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| AuditError::Unwritable {
                path: normalize_destination(&path),
                detail: format!("its directory could not be created: {e}"),
            })?;
        }

        rotate_if_needed(&path)?;

        // The probe.
        std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&path)
            .map_err(|e| AuditError::Unwritable {
                path: normalize_destination(&path),
                detail: e.to_string(),
            })?;

        Ok(Self { path, gate: Mutex::new(()) })
    }

    /// The resolved log path. Normalized, because this is shown to operators.
    pub fn display_path(&self) -> String {
        normalize_destination(&self.path)
    }

    /// The raw resolved path, for tests that read the file back.
    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn append_intent(&self, r: &IntentRecord) -> Result<(), AuditError> {
        let declared_from = [r.principal_name.clone()];
        self.append(|residual| r.to_json(residual), &declared_from)
    }

    pub fn append_outcome(&self, r: &OutcomeRecord) -> Result<(), AuditError> {
        let declared_from: Vec<String> = r.grantor_name.iter().cloned().collect();
        self.append(|residual| r.to_json(residual), &declared_from)
    }

    /// Render, scan, re-render with the scan's verdict, scan the final bytes, write.
    ///
    /// **Two passes, because `residual_classes` is a statement about the line it appears in.** The
    /// first render produces the bytes to scan; the classes found are then written into the second
    /// render. The only text the second pass adds is class names from a fixed set — none of which is
    /// a credential needle — and the final line is scanned again for `credential` anyway, so the
    /// guarantee is about **the bytes actually written** rather than about a draft of them. That is
    /// the same discipline `Staging::write` uses when it hashes what it wrote.
    fn append<F>(&self, render: F, identity_fields: &[String]) -> Result<(), AuditError>
    where
        F: Fn(&[&'static str]) -> Result<Json, AuditError>,
    {
        let draft = to_canonical_string(&render(&[])?)?;
        let residual = self.classify(&draft, identity_fields)?;
        let line = to_canonical_string(&render(&residual)?)?;
        // The backstop, over the bytes that will actually reach the disk.
        let _ = self.classify(&line, identity_fields)?;

        let _guard = self.gate.lock().unwrap_or_else(|e| e.into_inner());
        let mut f = std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.path)
            .map_err(|e| self.unwritable(e))?;
        f.write_all(line.as_bytes()).map_err(|e| self.unwritable(e))?;
        f.write_all(b"\n").map_err(|e| self.unwritable(e))?;
        f.flush().map_err(|e| self.unwritable(e))?;
        // Synced per record: an interrupted publish must still show its intent, and an intent
        // sitting in a buffer when the power goes is an intent that was never recorded.
        f.sync_all().map_err(|e| self.unwritable(e))?;
        Ok(())
    }

    fn unwritable(&self, e: std::io::Error) -> AuditError {
        AuditError::Unwritable {
            path: normalize_destination(&self.path),
            detail: e.to_string(),
        }
    }

    /// Run the `docs/09` scan over one rendered line.
    ///
    /// A `credential` finding is fatal. Everything else in [`RESIDUAL_CLASSES`] is reported back so
    /// the record can name it.
    fn classify(
        &self,
        line: &str,
        identity_fields: &[String],
    ) -> Result<Vec<&'static str>, AuditError> {
        let machine = MachineIdentifiers {
            declared: identity_fields
                .iter()
                .filter_map(|name| declared_occurrence(line, name))
                .collect(),
            ..MachineIdentifiers::from_environment()
        };
        let findings = scan("audit-record", line.as_bytes(), &machine);

        if let Some(f) = findings.iter().find(|f| f.class == "credential") {
            return Err(AuditError::CredentialInRecord {
                class: f.class,
                byte_offset: f.byte_offset,
            });
        }

        let mut residual: Vec<&'static str> = Vec::new();
        for f in &findings {
            // An attributed identity is not residual leakage: it is the record's own
            // `principal_name`, which `docs/09` requires the log to carry for the operation to be
            // attributable at all.
            if f.class == OPERATOR_DECLARED {
                continue;
            }
            if let Some(c) = RESIDUAL_CLASSES.iter().find(|c| **c == f.class) {
                if !residual.contains(c) {
                    residual.push(c);
                }
            }
        }
        residual.sort_unstable();
        Ok(residual)
    }
}

/// The rendered `"key":"value"` span containing `name`, for use as a `declared` string.
///
/// **The rendered member, not the bare name — and that is load-bearing.**
/// `redaction::declared_ranges` ignores any declared string shorter than `MIN_PRINTABLE_RUN` (12),
/// and real login names are routinely shorter: an 8-character username would be silently ignored,
/// and the operator's own deliberately-recorded identity would then be reported as a leak. The
/// rendered member clears the floor from the key alone.
///
/// It also preserves the mechanism's safety property exactly: only a match lying *wholly inside*
/// this span is attributed, so the same username appearing anywhere else in the record is still
/// reported.
///
/// The span is located in the rendered line rather than rebuilt, so this never has to re-implement
/// the writer's string escaping.
fn declared_occurrence(line: &str, name: &str) -> Option<String> {
    if name.trim().is_empty() {
        return None;
    }
    let b = line.as_bytes();
    for key in ["principal_name", "grantor_name"] {
        let needle = format!("\"{key}\":\"");
        let Some(start) = line.find(&needle) else { continue };
        let value_start = start + needle.len();
        let mut i = value_start;
        while i < b.len() {
            match b[i] {
                b'\\' => i += 2,
                b'"' => break,
                _ => i += 1,
            }
        }
        if i >= b.len() {
            continue;
        }
        let span = &line[start..=i];
        if span.contains(name) {
            return Some(span.to_string());
        }
    }
    None
}

/// Where the log lives.
fn resolve_log_path() -> Result<PathBuf, AuditError> {
    if let Ok(v) = std::env::var(AUDIT_LOG_ENV) {
        let p = PathBuf::from(&v);
        if !p.is_absolute() {
            return Err(AuditError::Unwritable {
                path: v,
                detail: format!(
                    "{AUDIT_LOG_ENV} must be an absolute path — a relative one would put the audit \
                     log wherever the process happened to be started"
                ),
            });
        }
        return Ok(p);
    }

    let base = data_dir().ok_or_else(|| AuditError::Unwritable {
        path: "(unresolved)".into(),
        detail: format!(
            "no per-user data directory could be determined from the environment, and no \
             {AUDIT_LOG_ENV} was set. A class-3 operation with nowhere to record itself does not run"
        ),
    })?;
    Ok(base.join("spatial-ide").join("audit").join("publish.jsonl"))
}

/// The per-user data directory, from the environment.
///
/// No `dirs` crate — which would be a new dependency, and is in fact one of the MPL-2.0 spike-tree
/// packages Step 0 had to make a decision about. The three variables below are the ones that crate
/// would read on the two reference platforms.
fn data_dir() -> Option<PathBuf> {
    #[cfg(windows)]
    {
        std::env::var_os("LOCALAPPDATA").map(PathBuf::from)
    }
    #[cfg(not(windows))]
    {
        std::env::var_os("XDG_DATA_HOME")
            .map(PathBuf::from)
            .or_else(|| std::env::var_os("HOME").map(|h| PathBuf::from(h).join(".local/share")))
    }
}

/// Whether `path` is `root` or lies beneath it.
///
/// Compares **lexically on the resolved forms**, because the destination does not exist yet and so
/// cannot be canonicalized. That is a weaker test than a filesystem one — a symlink pointing into
/// the destination would defeat it — and the weakness is stated rather than implied. What it does
/// catch is the case that actually occurs: an operator pointing `SPATIAL_IDE_AUDIT_LOG` somewhere
/// under `--out`.
fn is_inside(path: &Path, root: &Path) -> bool {
    let norm = |p: &Path| p.to_string_lossy().replace('\\', "/").trim_end_matches('/').to_string();
    let (p, r) = (norm(path), norm(root));
    #[cfg(windows)]
    let (p, r) = (p.to_ascii_lowercase(), r.to_ascii_lowercase());
    p == r || p.starts_with(&format!("{r}/"))
}

/// Rotate when the live log has reached its declared ceiling.
///
/// `publish.jsonl` → `.1` → `.2` → `.3` → `.4`, and `.4` is **deleted**. A failure here is fatal:
/// growing past a declared ceiling in silence would make the declaration untrue (ADR-010 rule 6).
fn rotate_if_needed(path: &Path) -> Result<(), AuditError> {
    let Ok(meta) = std::fs::metadata(path) else { return Ok(()) };
    if meta.len() < MAX_AUDIT_LOG_BYTES {
        return Ok(());
    }
    let failed = |p: &Path, e: std::io::Error| AuditError::RotationFailed {
        path: normalize_destination(p),
        detail: e.to_string(),
    };
    let gen = |n: u32| path.with_extension(format!("jsonl.{n}"));

    let oldest = gen(MAX_AUDIT_LOG_GENERATIONS);
    if oldest.exists() {
        std::fs::remove_file(&oldest).map_err(|e| failed(&oldest, e))?;
    }
    for n in (1..MAX_AUDIT_LOG_GENERATIONS).rev() {
        let from = gen(n);
        if from.exists() {
            let to = gen(n + 1);
            std::fs::rename(&from, &to).map_err(|e| failed(&from, e))?;
        }
    }
    let first = gen(1);
    std::fs::rename(path, &first).map_err(|e| failed(path, e))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_log_resolving_inside_the_destination_is_refused() {
        assert!(is_inside(Path::new("/a/b/out/audit.jsonl"), Path::new("/a/b/out")));
        assert!(is_inside(Path::new("/a/b/out"), Path::new("/a/b/out")));
        // A sibling whose name merely starts with the destination's is not inside it.
        assert!(!is_inside(Path::new("/a/b/output.jsonl"), Path::new("/a/b/out")));
        assert!(!is_inside(Path::new("/a/b/audit.jsonl"), Path::new("/a/b/out")));
    }

    /// The declared occurrence is the rendered member, which is what clears the length floor that
    /// would otherwise silently ignore a short username.
    #[test]
    fn a_short_username_is_still_attributable_because_the_member_is_declared_not_the_name() {
        let line = r#"{"principal_name":"bob","source_name":"parcels"}"#;
        let span = declared_occurrence(line, "bob").expect("the member is found");
        assert_eq!(span, r#""principal_name":"bob""#);
        assert!(
            span.len() >= crate::bundle::redaction::MIN_PRINTABLE_RUN,
            "the declared span must clear the printable-run floor, it is {} bytes",
            span.len()
        );
    }

    #[test]
    fn a_name_that_is_not_in_the_record_declares_nothing() {
        let line = r#"{"principal_name":"bob"}"#;
        assert!(declared_occurrence(line, "alice").is_none());
        assert!(declared_occurrence(line, "").is_none());
    }
}
