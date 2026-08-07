// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Pinning a source's bytes, so "the dataset changed underneath us" is detectable rather than
//! assumed away.
//!
//! ## Why this is an explicit act and not something `open` does
//!
//! Hashing a source reads the whole file. `kernel/RESULTS.md` measures that at ~603–610 ms on the
//! 100 000-feature fixture, and `docs/07`'s hero slice opens a **5 GB** file whose cold-open cost
//! against `docs/08` that file records as **unmeasured**. Putting an unconditional SHA-256 inside
//! `Dataset::open` would spend that on every open — including every viewport query's dataset, which
//! never publishes anything — to serve a check only publishing needs.
//!
//! So the pin is a separate, explicitly-called operation: cancellable and progress-bearing like any
//! other whole-file pass (`docs/01` principle 7), paid for by the caller that needs it.
//!
//! ## What a pin establishes, and what it does not
//!
//! A pin is a statement about **bytes at a moment**, and the honest reading is narrow:
//!
//! - It **does** let a later read detect that the file is no longer the file that was pinned.
//! - It does **not** establish that the source is immutable, and it does not pin a *revision* —
//!   `docs/11`'s ResourceRef has a `source_revision` member and this engine has nothing to put in
//!   it. That is why a bundle built on a pin claims ADR-005 **Snapshot** and not **Exact**.
//! - The window between the pin and the read is real. Publishing re-hashes at its own start and
//!   compares, which closes the pin-to-publish window; it re-checks the cheap **fail-closed**
//!   heuristic below at finalize, which does not close the during-publish window and is not
//!   recorded as though it did.
//!
//! The heuristic is length plus modification time — the same discipline `index::ValidityHeuristic`
//! already applies, and for the same reason: it is **never an identity**, and anything it cannot
//! confirm discards rather than passes. Treating unknown as unchanged is the silent staleness
//! `docs/01` principle 8 forbids.

use std::path::Path;

use crate::cancel::CancelToken;
use crate::error::{EngineError, Result};
use crate::index;

/// A source's content hash at a moment, with the cheap heuristic taken beside it.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ContentPin {
    hash: String,
    len: u64,
    modified_nanos: Option<u128>,
}

impl ContentPin {
    /// SHA-256 of the whole file, lowercase hex, **without** a `sha256:` prefix — the same spelling
    /// `index::content_hash` produces, so the two cannot drift.
    pub fn hash(&self) -> &str {
        &self.hash
    }

    pub fn len(&self) -> u64 {
        self.len
    }

    pub fn is_empty(&self) -> bool {
        self.len == 0
    }

    /// Compute a pin. Reads the whole file; cancellable throughout.
    pub fn take(path: &Path, cancel: &CancelToken) -> Result<(Self, f64)> {
        let (hash, millis) = index::content_hash(path, cancel)?;
        let h = index::ValidityHeuristic::of(path).ok_or_else(|| {
            EngineError::Source(format!(
                "{} could not be measured for length and modification time, so no pin can be \
                 taken; a pin that cannot be re-checked is not a pin",
                path.display()
            ))
        })?;
        Ok((Self { hash, len: h.len, modified_nanos: h.modified_nanos }, millis))
    }

    /// Re-hash and compare. The real check, and the one publishing performs at its start.
    pub fn verify_by_rehash(&self, path: &Path, cancel: &CancelToken) -> Result<f64> {
        let (fresh, millis) = index::content_hash(path, cancel)?;
        if fresh != self.hash {
            return Err(EngineError::SourceChangedUnderPublish {
                pinned: self.hash.clone(),
                observed: fresh,
                detected_by: "content hash re-read at publish start",
            });
        }
        Ok(millis)
    }

    /// Re-check the cheap heuristic. **Fail-closed and not a content hash** — it is cheap enough to
    /// run at finalize, and it is recorded as an operational check rather than as a manifest-level
    /// assurance, so nothing reads it as a second hash.
    pub fn verify_by_heuristic(&self, path: &Path) -> Result<()> {
        let Some(now) = index::ValidityHeuristic::of(path) else {
            return Err(EngineError::SourceChangedUnderPublish {
                pinned: self.hash.clone(),
                observed: "unreadable".to_string(),
                detected_by: "length and modification time re-read at finalize (fail-closed: a \
                              source that cannot be re-checked is treated as changed)",
            });
        };
        if now.len != self.len || now.modified_nanos != self.modified_nanos {
            return Err(EngineError::SourceChangedUnderPublish {
                pinned: format!("{} bytes", self.len),
                observed: format!("{} bytes", now.len),
                detected_by: "length and modification time re-read at finalize — a heuristic, not \
                              a content hash",
            });
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn tmp(name: &str) -> std::path::PathBuf {
        let d = std::env::temp_dir().join("spatial-engine-pin-tests");
        std::fs::create_dir_all(&d).unwrap();
        d.join(name)
    }

    #[test]
    fn a_pin_verifies_against_unchanged_bytes_and_refuses_changed_ones() {
        let p = tmp("pin-a.bin");
        std::fs::write(&p, b"the original bytes").unwrap();
        let (pin, _) = ContentPin::take(&p, &CancelToken::new()).unwrap();
        pin.verify_by_rehash(&p, &CancelToken::new()).unwrap();

        std::fs::write(&p, b"different bytes!!!").unwrap();
        let e = pin.verify_by_rehash(&p, &CancelToken::new()).unwrap_err();
        assert!(matches!(e, EngineError::SourceChangedUnderPublish { .. }));
        let _ = std::fs::remove_file(&p);
    }

    #[test]
    fn the_finalize_heuristic_fails_closed_when_it_cannot_confirm() {
        let p = tmp("pin-b.bin");
        std::fs::write(&p, b"bytes").unwrap();
        let (pin, _) = ContentPin::take(&p, &CancelToken::new()).unwrap();
        pin.verify_by_heuristic(&p).unwrap();

        // A file that is no longer there cannot be confirmed unchanged, and "cannot confirm" is
        // treated as changed rather than as fine.
        std::fs::remove_file(&p).unwrap();
        assert!(matches!(
            pin.verify_by_heuristic(&p),
            Err(EngineError::SourceChangedUnderPublish { .. })
        ));
    }

    #[test]
    fn a_cancelled_pin_is_a_typed_cancellation_and_not_a_partial_hash() {
        let p = tmp("pin-c.bin");
        std::fs::write(&p, vec![7u8; 4 << 20]).unwrap();
        let c = CancelToken::new();
        c.cancel();
        assert!(matches!(ContentPin::take(&p, &c), Err(EngineError::Cancelled)));
        let _ = std::fs::remove_file(&p);
    }
}
