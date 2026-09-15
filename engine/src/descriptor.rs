// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The **structural descriptor** — R-D1…R-D3 (`engine/ADMISSION-PREREGISTRATION.md` §2e), and a
//! change detector rather than an identity.
//!
//! Four components, read at open and re-read around every query: byte size, modification time,
//! footer length, footer hash. Its only job is to say *this is no longer the file that was opened*,
//! and the only thing it does with that answer is end the dataset-session generation.
//!
//! **What it is not, stated where it lives rather than only in a document:**
//!
//! - It is **not a snapshot claim** (Brief A boundary 4; block-on-sight A1). It does not establish
//!   snapshot consistency, it cannot detect every in-place modification, and it may detect a change
//!   during a query only after that query has finished reading. A change it did not see is not a
//!   check that passed — `mutations/gp-epsg2056-intkey-changed-same-size.parquet` is a real file
//!   whose bytes differ and whose four components all match, and the preregistration registers it
//!   as **not detected**.
//! - It is **not what makes session ordinals distinct** (R-D3). That is
//!   [`crate::identity::IdUniqueness::ByConstructionWithinGeneration`] and has nothing to do with
//!   this type.
//! - It is **not a content hash of the file**. The footer hash covers the footer's bytes and
//!   nothing else, which is why a data-page edit under a preserved size and mtime is invisible to
//!   it (ADR-005 vocabulary, A7: this is neither a content hash nor a source revision — it is a
//!   locator-adjacent structural fact about one open).

use std::io::{Read, Seek, SeekFrom};
use std::path::Path;

use sha2::{Digest, Sha256};

use crate::error::{EngineError, Result};

/// The declared ceiling on the footer read (§7; §13 A; ADR-010 rule 6 — declared, not discovered).
///
/// **Exceeding it degrades the descriptor and says so; it never refuses and never gates.** Past
/// this bound the footer hash is not taken and the descriptor carries size + mtime + footer length
/// only, with [`SourceDescriptor::degradation`] naming what was dropped and why.
///
/// The value's basis lives in the preregistration (§7) and is deliberately not restated as
/// reasoning here, and no number of this kind appears in any ADR text.
pub const FOOTER_DESCRIPTOR_MAX_BYTES: u64 = 8 * 1024 * 1024;

/// The bytes a parquet file ends with: a `uint32` footer length, then the four-byte magic.
const PARQUET_TAIL_BYTES: u64 = 8;
const PARQUET_MAGIC: &[u8; 4] = b"PAR1";

/// One open's structural facts about its source file.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SourceDescriptor {
    byte_size: u64,
    /// `None` when the filesystem gave no modification time. Recorded as absent rather than
    /// defaulted — the index cache's `ValidityHeuristic` fails closed on the same fact for the same
    /// reason (`docs/01` principle 8), and a comparison against an absent mtime is treated as a
    /// difference below.
    modified_nanos: Option<u128>,
    footer_length: u64,
    /// Hex sha-256 over the footer's bytes. `None` exactly when [`Self::degradation`] is `Some` —
    /// the two are one fact recorded twice so neither can be read without the other.
    footer_hash: Option<String>,
    /// Footer bytes actually read for this descriptor. **Reported-only, never gated** (boundary 5;
    /// §6's instrument table): nothing compares it to a budget.
    footer_bytes_read: u64,
    degradation: Option<String>,
}

impl SourceDescriptor {
    /// Read the four components from the file as it is right now.
    ///
    /// Reads at most [`FOOTER_DESCRIPTOR_MAX_BYTES`] plus the eight-byte tail, and **never the
    /// whole file** — this is the read the session tier's open is allowed to do, and G-A1 (P5) is
    /// what will hold that to account.
    pub fn of(path: &Path) -> Result<Self> {
        let md = std::fs::metadata(path)
            .map_err(|e| EngineError::Source(format!("descriptor metadata: {e}")))?;
        let byte_size = md.len();
        let modified_nanos = md
            .modified()
            .ok()
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_nanos());

        let mut f = std::fs::File::open(path)
            .map_err(|e| EngineError::Source(format!("descriptor open: {e}")))?;
        if byte_size < PARQUET_TAIL_BYTES {
            return Err(EngineError::Source(format!(
                "{} is {byte_size} bytes, too short to carry a parquet footer",
                path.display()
            )));
        }
        f.seek(SeekFrom::End(-(PARQUET_TAIL_BYTES as i64)))
            .map_err(|e| EngineError::Source(format!("descriptor seek: {e}")))?;
        let mut tail = [0u8; PARQUET_TAIL_BYTES as usize];
        f.read_exact(&mut tail)
            .map_err(|e| EngineError::Source(format!("descriptor tail: {e}")))?;
        if &tail[4..8] != PARQUET_MAGIC {
            return Err(EngineError::Source(format!(
                "{} does not end with the parquet magic bytes",
                path.display()
            )));
        }
        let footer_length =
            u64::from(u32::from_le_bytes([tail[0], tail[1], tail[2], tail[3]]));

        // Over the ceiling: degrade, say so, do not refuse (§13 A).
        if footer_length > FOOTER_DESCRIPTOR_MAX_BYTES {
            return Ok(Self {
                byte_size,
                modified_nanos,
                footer_length,
                footer_hash: None,
                footer_bytes_read: 0,
                degradation: Some(format!(
                    "the footer is {footer_length} bytes, over the declared ceiling of \
                     {FOOTER_DESCRIPTOR_MAX_BYTES} bytes, so it was not read or hashed. Change \
                     detection for this source is size, modification time and footer length only"
                )),
            });
        }
        // A footer that claims more bytes than the file holds is a malformed file, not a
        // degradation: there is nothing to read.
        let Some(footer_start) = byte_size.checked_sub(PARQUET_TAIL_BYTES + footer_length) else {
            return Err(EngineError::Source(format!(
                "{} declares a {footer_length}-byte footer in a {byte_size}-byte file",
                path.display()
            )));
        };
        f.seek(SeekFrom::Start(footer_start))
            .map_err(|e| EngineError::Source(format!("descriptor footer seek: {e}")))?;
        let mut footer = vec![0u8; footer_length as usize];
        f.read_exact(&mut footer)
            .map_err(|e| EngineError::Source(format!("descriptor footer: {e}")))?;
        let mut hasher = Sha256::new();
        hasher.update(&footer);
        Ok(Self {
            byte_size,
            modified_nanos,
            footer_length,
            footer_hash: Some(format!("{:x}", hasher.finalize())),
            footer_bytes_read: footer_length,
            degradation: None,
        })
    }

    pub fn byte_size(&self) -> u64 {
        self.byte_size
    }
    pub fn footer_length(&self) -> u64 {
        self.footer_length
    }
    /// Footer bytes read for this descriptor, per open. Reported, never gated (boundary 5).
    pub fn footer_bytes_read(&self) -> u64 {
        self.footer_bytes_read
    }
    /// What this descriptor could not do, in the words shown to the operator. `None` when all four
    /// components were read.
    pub fn degradation(&self) -> Option<&str> {
        self.degradation.as_deref()
    }

    /// Every component in which `self` and `now` differ, named — or an empty list.
    ///
    /// **Names every component that differed, not the first one** (§4's adopted rule: no fixture
    /// isolates a single component, so an assertion is exact only if the refusal enumerates them).
    ///
    /// An absent modification time on either side counts as a difference: `fail_closed_matches` on
    /// the index cache treats unknown as changed for exactly this reason, and treating unknown as
    /// unchanged is the silent staleness `docs/01` principle 8 forbids. A footer hash that was not
    /// taken on either side is **not** counted — it was not dropped by a change, it was never read,
    /// and the degradation text already says so.
    pub fn components_differing_from(&self, now: &Self) -> Vec<&'static str> {
        let mut out = Vec::new();
        if self.byte_size != now.byte_size {
            out.push("size");
        }
        match (self.modified_nanos, now.modified_nanos) {
            (Some(a), Some(b)) if a == b => {}
            _ => out.push("mtime"),
        }
        if self.footer_length != now.footer_length {
            out.push("footer-length");
        }
        if let (Some(a), Some(b)) = (&self.footer_hash, &now.footer_hash) {
            if a != b {
                out.push("footer-hash");
            }
        }
        out
    }

    /// The typed refusal for a source that differs from this descriptor, or `Ok(())`.
    ///
    /// The whole of R-D2's comparison; the pre-check and the post-check both route through it so
    /// the two cannot drift into two different ideas of "changed".
    pub fn refuse_if_changed(&self, now: &Self) -> Result<()> {
        let differing = self.components_differing_from(now);
        if differing.is_empty() {
            return Ok(());
        }
        Err(EngineError::SourceChanged { detail: format!("{{{}}}", differing.join(", ")) })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn descriptor(size: u64, mtime: Option<u128>, len: u64, hash: Option<&str>) -> SourceDescriptor {
        SourceDescriptor {
            byte_size: size,
            modified_nanos: mtime,
            footer_length: len,
            footer_hash: hash.map(str::to_string),
            footer_bytes_read: hash.map_or(0, |_| len),
            degradation: None,
        }
    }

    #[test]
    fn an_identical_descriptor_names_no_component() {
        let a = descriptor(100, Some(7), 10, Some("aa"));
        assert!(a.components_differing_from(&a.clone()).is_empty());
        assert!(a.refuse_if_changed(&a).is_ok());
    }

    #[test]
    fn the_refusal_names_every_component_that_differed_not_the_first() {
        // The `-appended` mutation fixture's registered shape (§4): size, mtime and footer all
        // differ at once, and the preregistration pre-declares that the detail names all of them.
        let opened = descriptor(27_132, Some(1), 11_806, Some("aa"));
        let now = descriptor(43_046, Some(2), 12_406, Some("bb"));
        assert_eq!(
            opened.components_differing_from(&now),
            vec!["size", "mtime", "footer-length", "footer-hash"]
        );
        let err = opened.refuse_if_changed(&now).unwrap_err();
        assert!(
            matches!(&err, EngineError::SourceChanged { detail }
                if detail == "{size, mtime, footer-length, footer-hash}"),
            "got {err:?}"
        );
    }

    #[test]
    fn one_component_alone_is_enough_and_is_the_only_one_named() {
        let opened = descriptor(100, Some(1), 10, Some("aa"));
        let mtime_only = descriptor(100, Some(2), 10, Some("aa"));
        assert_eq!(opened.components_differing_from(&mtime_only), vec!["mtime"]);
        let hash_only = descriptor(100, Some(1), 10, Some("bb"));
        assert_eq!(opened.components_differing_from(&hash_only), vec!["footer-hash"]);
    }

    #[test]
    fn an_absent_modification_time_counts_as_a_difference_rather_than_as_unchanged() {
        let known = descriptor(100, Some(1), 10, Some("aa"));
        let unknown = descriptor(100, None, 10, Some("aa"));
        assert_eq!(known.components_differing_from(&unknown), vec!["mtime"]);
        assert_eq!(unknown.components_differing_from(&unknown.clone()), vec!["mtime"]);
    }

    #[test]
    fn a_footer_hash_that_was_never_taken_is_not_reported_as_a_changed_component() {
        // Degraded both sides (over the ceiling): the missing hash is an absent read, not a
        // detected change, and reporting it as one would refuse every query on a large-footer file.
        let degraded_open = descriptor(100, Some(1), 10, None);
        let degraded_now = descriptor(100, Some(1), 10, None);
        assert!(degraded_open.components_differing_from(&degraded_now).is_empty());
    }

    #[test]
    fn the_declared_footer_ceiling_is_the_preregistered_value() {
        // §7/§13 A. The number lives here and in the preregistration, never in ADR text.
        assert_eq!(FOOTER_DESCRIPTOR_MAX_BYTES, 8_388_608);
    }
}
