//! Typed refusals for publishing.
//!
//! `docs/05`: a refusal is "an **error**, not a warning". Every way this operation can decline is a
//! variant here, and each one says what was refused and why — an error that says "write failed"
//! hides the reason, which is the black box `docs/01` principle 8 forbids one layer down from where
//! it usually appears.

use spatial_engine::EngineError;
use spatial_renderer::canonical::CanonicalError;
use spatial_renderer::StyleError;

#[derive(Debug)]
pub enum PublishError {
    /// Something already exists at the destination.
    ///
    /// **A refusal, not a replace.** Publishing is a class-3 external side effect under ADR-006 and
    /// `docs/09` ("Export and publish are distinct capabilities … Irreversible actions declare their
    /// reversibility class before approval"), and destroying an already-published bundle as a side
    /// effect of re-running a command is what that gate exists to prevent. A `--replace` capability
    /// is deliberately **not** in v0; adding one needs an approval gate and a declared reversibility
    /// class, not a convenience flag.
    DestinationExists { path: String },

    /// The destination cannot be written to. Raised **before the query runs** where possible, so a
    /// long stream is not spent discovering it.
    DestinationNotWritable { path: String, raw_os_error: Option<i32>, detail: String },

    /// The filesystem ran out of room, **detected at write time**.
    ///
    /// No pre-flight prediction is made and none is claimed: the final size is not known before the
    /// stream is read, and a prediction that could be wrong is worse than a detection that cannot.
    InsufficientSpace { path: String, raw_os_error: Option<i32>, detail: String },

    /// An IO failure this operation could not classify. The raw OS code stays visible rather than
    /// being flattened into prose, because the code is what makes an unfamiliar failure diagnosable.
    Io { context: String, raw_os_error: Option<i32>, detail: String },

    /// The dataset was never pinned, so "did the source change" has no answer.
    ///
    /// Publishing with an unpinned source would let the bundle claim ADR-005 **Snapshot** on a basis
    /// that was never established — a grade claimed and not honored, which `docs/01` principle 3
    /// forbids in as many words.
    SourceNotPinned,

    /// The source's redistribution term forbids what publishing does.
    LicenseNotCarryable { declared_by: &'static str, redistribution: String },

    /// Both the source and the operator declare license terms.
    ///
    /// Refused rather than resolved, on ADR-015 §4's precedent exactly: an assertion is admissible
    /// only over a source that declares nothing, and deciding which of two declarations wins is a
    /// judgement this operation is not equipped to make.
    LicenseDeclaredTwice { source: String, operator: String },

    /// An operator declared a license that is empty or only whitespace.
    ///
    /// ADR-017 §5 (Corrigendum 1) types `license` under `declared-by-operator` as a **non-empty
    /// string**, on the grounds that an operator states a license or makes no declaration at all.
    /// That is only true if the empty one is refused: a blank would sit in the state whose entire
    /// meaning is that somebody claimed something, and `""` is not a claim. Refused here rather than
    /// only at the command line, because the library is a surface too.
    OperatorLicenseEmpty,

    /// A viewer asset's path is not a safe bundle-relative path.
    ViewerAssetPathRejected { path: String, detail: String },

    /// The dataset name cannot become a logical URI.
    ///
    /// A name carrying a path separator, a drive letter or `..` would put a filesystem path in the
    /// manifest through the URI (`docs/09`), which is why this is checked rather than escaped.
    DatasetNameRejected { name: String, detail: String },

    /// A declared ceiling was reached (ADR-010 rule 6).
    CeilingExceeded { ceiling: &'static str, limit: u64, saw: u64 },

    /// The operation was cancelled. No bundle exists under the final name, and the staging
    /// directory has been removed.
    Cancelled,

    /// The staging directory could not be removed after a failure.
    ///
    /// Carries the failure it was cleaning up after, because reporting only the cleanup failure
    /// would lose the thing that actually went wrong — and reporting only the original would leave
    /// a directory on disk that nobody was told about (ADR-010 rule 7: an operation may not
    /// terminate silently).
    StagingNotRemoved { after: Box<PublishError>, path: String, detail: String },

    Engine(EngineError),
    Style(StyleError),
    Canonical(CanonicalError),
}

impl std::fmt::Display for PublishError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::DestinationExists { path } => write!(
                f,
                "refused: `{path}` already exists. Publishing is an irreversible external side \
                 effect (ADR-006 class 3; docs/09), so an existing bundle is never replaced as a \
                 side effect of re-running a command — remove it, or publish elsewhere"
            ),
            Self::DestinationNotWritable { path, raw_os_error, detail } => write!(
                f,
                "refused: `{path}` is not writable (os error {raw_os_error:?}: {detail})"
            ),
            Self::InsufficientSpace { path, raw_os_error, detail } => write!(
                f,
                "failed: the filesystem holding `{path}` is full (os error {raw_os_error:?}: \
                 {detail}). Detected at write time — this operation makes no pre-flight space \
                 prediction, because the bundle's size is not known before the stream is read"
            ),
            Self::Io { context, raw_os_error, detail } => {
                write!(f, "io failure while {context} (os error {raw_os_error:?}): {detail}")
            }
            Self::SourceNotPinned => write!(
                f,
                "refused: the source was never pinned, so a change underneath this publish could \
                 not be detected. Call `Dataset::pin_content` first — a bundle that claimed an \
                 ADR-005 grade on an unpinned source would be claiming a grade it cannot honor"
            ),
            Self::LicenseNotCarryable { declared_by, redistribution } => write!(
                f,
                "refused: the license declared by the {declared_by} says redistribution is \
                 `{redistribution}`, and a static bundle **is** a redistributed copy of the data. \
                 docs/09 gates irreversible external side effects; this is one it does not permit"
            ),
            Self::LicenseDeclaredTwice { source, operator } => write!(
                f,
                "refused: the source declares license `{source}` and the operator declared \
                 `{operator}`. An operator declaration is admissible only over a source that \
                 declares nothing — deciding which of two declarations governs is not this \
                 operation's judgement to make (the same rule ADR-015 §4 applies to CRS)"
            ),
            Self::OperatorLicenseEmpty => write!(
                f,
                "refused: the operator declared an empty license. `declared-by-operator` means \
                 somebody claimed something (ADR-017 §5, Corrigendum 1) — declare a license, or \
                 declare nothing and let the manifest record `not-declared`"
            ),
            Self::ViewerAssetPathRejected { path, detail } => write!(
                f,
                "refused: viewer asset path `{path}` {detail}. An unvalidated asset path joined \
                 onto a staging root writes wherever the caller likes"
            ),
            Self::DatasetNameRejected { name, detail } => write!(
                f,
                "refused: dataset name `{name}` {detail}, so it cannot become a logical URI \
                 without putting a filesystem path in the manifest (docs/09)"
            ),
            Self::CeilingExceeded { ceiling, limit, saw } => write!(
                f,
                "refused: declared ceiling {ceiling} exceeded — limit {limit}, saw {saw}"
            ),
            Self::Cancelled => write!(
                f,
                "cancelled: no bundle exists under the destination name and the staging directory \
                 has been removed"
            ),
            Self::StagingNotRemoved { after, path, detail } => write!(
                f,
                "publish failed ({after}) and the staging directory `{path}` could not then be \
                 removed ({detail}). Both are reported: the first is what went wrong, the second \
                 is what is still on disk"
            ),
            Self::Engine(e) => write!(f, "{e}"),
            Self::Style(e) => write!(f, "{e}"),
            Self::Canonical(e) => write!(f, "{e}"),
        }
    }
}

impl std::error::Error for PublishError {}

impl From<EngineError> for PublishError {
    fn from(e: EngineError) -> Self {
        // A cancelled engine stream is a cancelled publish, not an opaque engine failure: the
        // caller asked for this and deserves the answer in its own vocabulary.
        match e {
            EngineError::Cancelled => Self::Cancelled,
            other => Self::Engine(other),
        }
    }
}

impl From<StyleError> for PublishError {
    fn from(e: StyleError) -> Self {
        Self::Style(e)
    }
}

impl From<CanonicalError> for PublishError {
    fn from(e: CanonicalError) -> Self {
        Self::Canonical(e)
    }
}

/// Classify an IO error into the typed refusals the brief names.
///
/// **Platform-specific by construction.** `raw_os_error` is a Win32 code on Windows and an errno on
/// Unix, and the two overlap: 112 is `ERROR_DISK_FULL` on Windows and nothing standard on Unix. A
/// single shared table would mean one platform's disk-full silently matching another platform's
/// unrelated failure, so the sets are separate and each is named.
pub(crate) fn classify_io(path: &str, context: &str, e: std::io::Error) -> PublishError {
    let code = e.raw_os_error();
    let detail = e.to_string();

    #[cfg(windows)]
    const DISK_FULL: &[i32] = &[39, 112]; // ERROR_HANDLE_DISK_FULL, ERROR_DISK_FULL
    #[cfg(windows)]
    const NOT_WRITABLE: &[i32] = &[5, 19, 32, 33]; // ACCESS_DENIED, WRITE_PROTECT, SHARING_VIOLATION, LOCK_VIOLATION

    #[cfg(unix)]
    const DISK_FULL: &[i32] = &[28]; // ENOSPC
    #[cfg(unix)]
    const NOT_WRITABLE: &[i32] = &[13, 30]; // EACCES, EROFS

    #[cfg(not(any(windows, unix)))]
    const DISK_FULL: &[i32] = &[];
    #[cfg(not(any(windows, unix)))]
    const NOT_WRITABLE: &[i32] = &[];

    match code {
        Some(c) if DISK_FULL.contains(&c) => {
            PublishError::InsufficientSpace { path: path.into(), raw_os_error: code, detail }
        }
        Some(c) if NOT_WRITABLE.contains(&c) => {
            PublishError::DestinationNotWritable { path: path.into(), raw_os_error: code, detail }
        }
        // Kind-based fallbacks, so a platform whose code this build does not know still classifies
        // the two cases the brief names rather than flattening them into `Io`.
        _ if e.kind() == std::io::ErrorKind::PermissionDenied => {
            PublishError::DestinationNotWritable { path: path.into(), raw_os_error: code, detail }
        }
        _ => PublishError::Io { context: context.into(), raw_os_error: code, detail },
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn permission_denied_classifies_even_when_the_raw_code_is_unknown_here() {
        let e = std::io::Error::new(std::io::ErrorKind::PermissionDenied, "nope");
        assert!(matches!(
            classify_io("/x", "writing", e),
            PublishError::DestinationNotWritable { .. }
        ));
    }

    #[test]
    fn an_unclassified_io_error_keeps_its_raw_code_visible() {
        let e = std::io::Error::from_raw_os_error(4242);
        match classify_io("/x", "writing a partition", e) {
            PublishError::Io { raw_os_error, context, .. } => {
                assert_eq!(raw_os_error, Some(4242));
                assert!(context.contains("partition"));
            }
            other => panic!("flattened into {other:?}"),
        }
    }

    #[test]
    fn a_cancelled_engine_stream_reaches_the_caller_as_a_cancelled_publish() {
        let e: PublishError = EngineError::Cancelled.into();
        assert!(matches!(e, PublishError::Cancelled));
    }
}
