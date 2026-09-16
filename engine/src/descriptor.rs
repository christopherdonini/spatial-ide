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
    /// defaulted (`docs/01` principle 8).
    ///
    /// **Absent on both sides is a degradation, not a difference** — see
    /// [`Self::components_differing_from`]. Absent on one side only *is* a difference: the file's
    /// metadata really did change in an observable way.
    modified_nanos: Option<u128>,
    footer_length: u64,
    /// Hex sha-256 over the footer's bytes. `None` when the footer was over
    /// [`FOOTER_DESCRIPTOR_MAX_BYTES`] and was not read; [`Self::degradation`] then names that.
    footer_hash: Option<String>,
    /// Footer bytes actually read for this descriptor. **Reported-only, never gated** (boundary 5;
    /// §6's instrument table): nothing compares it to a budget.
    footer_bytes_read: u64,
    /// Every component this descriptor could **not** establish, in the words shown to the operator.
    ///
    /// A list rather than one string because two can hold at once — a file with an over-ceiling
    /// footer on a filesystem reporting no modification time degrades twice, and a reader owed
    /// "the degradation is shown" (boundary 5) is owed both.
    degradations: Vec<String>,
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
        // **Boundary 5's "the degradation is shown", applied to mtime as well as to the footer.**
        // A filesystem that reports no modification time has not told this descriptor that anything
        // changed — it has told it that one component is unavailable. Recording that here is what
        // lets `components_differing_from` stop reporting a permanent, false "mtime" difference on
        // such a filesystem (P3 gate attempt 1, correction 13).
        let mut degradations = Vec::new();
        if modified_nanos.is_none() {
            degradations.push(
                "the filesystem reported no modification time for this file, so change detection \
                 for this source is byte size, footer length and footer hash only"
                    .to_string(),
            );
        }

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
            degradations.push(format!(
                "the footer is {footer_length} bytes, over the declared ceiling of \
                 {FOOTER_DESCRIPTOR_MAX_BYTES} bytes, so it was not read or hashed. Change \
                 detection for this source is size, modification time and footer length only"
            ));
            return Ok(Self {
                byte_size,
                modified_nanos,
                footer_length,
                footer_hash: None,
                footer_bytes_read: 0,
                degradations,
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
            degradations,
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
    /// components were established; several degradations are joined, because a reader owed "the
    /// degradation is shown" is owed all of them.
    pub fn degradation(&self) -> Option<String> {
        (!self.degradations.is_empty()).then(|| self.degradations.join("; "))
    }

    /// Every component in which `self` and `now` differ, named — or an empty list.
    ///
    /// **Names every component that differed, not the first one** (§4's adopted rule: no fixture
    /// isolates a single component, so an assertion is exact only if the refusal enumerates them).
    ///
    /// **The modification time, in three cases rather than two** (P3 gate attempt 1, correction
    /// 13). Both sides present: an ordinary comparison. **Neither side present: not a difference** —
    /// a filesystem that never reports a modification time has told this descriptor that the
    /// component is unavailable, not that the file changed, and reporting it as a change refused
    /// every query on such a filesystem forever with the false sentence "the source file changed".
    /// That case is a *degradation* and [`Self::degradation`] names it in the operator's own words.
    /// One side present and the other not: **a difference**, because the metadata really did change
    /// in an observable way — that is the case `ValidityHeuristic::fail_closed_matches` exists for,
    /// and treating an observable change as unchanged is the silent staleness `docs/01` principle 8
    /// forbids.
    ///
    /// A footer hash that was not taken on either side is **not** counted — it was not dropped by a
    /// change, it was never read, and the degradation text already says so.
    pub fn components_differing_from(&self, now: &Self) -> Vec<&'static str> {
        let mut out = Vec::new();
        if self.byte_size != now.byte_size {
            out.push("size");
        }
        match (self.modified_nanos, now.modified_nanos) {
            (Some(a), Some(b)) if a != b => out.push("mtime"),
            (Some(_), None) | (None, Some(_)) => out.push("mtime"),
            _ => {}
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
    ///
    /// **They also share [`Self::refuse_if_changed_or_unreadable`] for the case where there is
    /// nothing to compare against.** The two checks once disagreed there — the pre-check propagated
    /// a read failure as `EngineError::Source` while the post-check mapped it to `SourceChanged`, so
    /// a source deleted mid-session left the generation live (P3 gate attempt 1, blocking finding
    /// 4). This sentence is the invariant; those two functions are the whole of it.
    pub fn refuse_if_changed(&self, now: &Self) -> Result<()> {
        let differing = self.components_differing_from(now);
        if differing.is_empty() {
            return Ok(());
        }
        Err(EngineError::SourceChanged { detail: format!("{{{}}}", differing.join(", ")) })
    }

    /// This descriptor as a filesystem that reports **no modification time** would have produced
    /// it: the component absent, and the degradation that names it recorded.
    ///
    /// **A test constructor, and marked as one in its name**, because no filesystem in this
    /// workspace withholds an mtime and the rule still has to be pinned — the `(None, None)` case
    /// once refused every query forever with the false sentence "the source file changed". It is
    /// not `cfg(test)`-gated for the reason `dataset.rs`'s own counters are not: this crate's
    /// integration tests link the shipped library, and a constructor compiled only into a unit-test
    /// build would be unreachable from them.
    #[doc(hidden)]
    pub fn without_modification_time_for_test(mut self) -> Self {
        self.modified_nanos = None;
        self.degradations.push(
            "the filesystem reported no modification time for this file, so change detection \
             for this source is byte size, footer length and footer hash only"
                .to_string(),
        );
        self
    }

    /// Re-read `path` and compare, mapping a **failure to read it at all** onto the same typed
    /// `SourceChanged` refusal.
    ///
    /// A source that cannot be re-read — deleted, renamed, locked by another process — is exactly
    /// the situation this check exists for, and reporting it as `EngineError::Source` ("the file
    /// could not be opened or read at all") would be true of the file and wrong about the session:
    /// the caller that must end the dataset-session generation matches on `SourceChanged` and would
    /// not see it.
    ///
    /// **Both the pre-check and the post-check call this**, so the wording and the type are one
    /// decision made once.
    pub fn refuse_if_changed_or_unreadable(&self, path: &Path) -> Result<()> {
        match Self::of(path) {
            Ok(now) => self.refuse_if_changed(&now),
            Err(e) => Err(EngineError::SourceChanged {
                detail: format!("{{the source could not be re-read: {e}}}"),
            }),
        }
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
            degradations: Vec::new(),
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

    /// Mutation: make `components_differing_from` return after its first push. Expected failure:
    /// `one_component_alone_is_enough_and_is_the_only_one_named` still passes while
    /// `the_refusal_names_every_component_that_differed_not_the_first` fails — which is why both
    /// directions are asserted and not only this one.
    #[test]
    fn one_component_alone_is_enough_and_is_the_only_one_named() {
        let opened = descriptor(100, Some(1), 10, Some("aa"));
        let mtime_only = descriptor(100, Some(2), 10, Some("aa"));
        assert_eq!(opened.components_differing_from(&mtime_only), vec!["mtime"]);
        let hash_only = descriptor(100, Some(1), 10, Some("bb"));
        assert_eq!(opened.components_differing_from(&hash_only), vec!["footer-hash"]);
    }

    /// **Corrected at P3 gate attempt 1 (correction 13).** This test used to assert that an absent
    /// modification time is a difference *in every case*, including when it is absent on both
    /// sides — which made a filesystem that never reports one refuse every query forever with the
    /// false sentence "the source file changed". The fail-closed intent it was written for is
    /// intact and is asserted below; what changed is that an unavailable component is now a
    /// degradation rather than a fabricated observation.
    /// Mutation: restore the `(Some(a), Some(b)) if a == b => {}, _ => push("mtime")` form.
    /// Expected failure:
    /// `an_unobservable_modification_time_degrades_while_an_observable_change_in_it_still_differs`
    /// fails on its both-absent case.
    #[test]
    fn an_unobservable_modification_time_degrades_while_an_observable_change_in_it_still_differs() {
        let known = descriptor(100, Some(1), 10, Some("aa"));
        let unknown = descriptor(100, None, 10, Some("aa"));

        // Observable: it was readable and now is not (or the reverse). Fail closed — a difference.
        assert_eq!(known.components_differing_from(&unknown), vec!["mtime"]);
        assert_eq!(unknown.components_differing_from(&known), vec!["mtime"]);

        // Unobservable on both sides: nothing was seen to change, and claiming otherwise is the
        // fabrication `docs/01` principle 8 forbids just as much as silent staleness is.
        assert!(unknown.components_differing_from(&unknown.clone()).is_empty());
        assert!(unknown.refuse_if_changed(&unknown.clone()).is_ok());
    }

    /// Mutation: compare `footer_hash` with `!=` over the two `Option`s instead of matching both
    /// `Some`. Expected failure:
    /// `a_footer_hash_that_was_never_taken_is_not_reported_as_a_changed_component` fails, and an
    /// over-ceiling file would refuse every query.
    #[test]
    fn a_footer_hash_that_was_never_taken_is_not_reported_as_a_changed_component() {
        // Degraded both sides (over the ceiling): the missing hash is an absent read, not a
        // detected change, and reporting it as one would refuse every query on a large-footer file.
        let degraded_open = descriptor(100, Some(1), 10, None);
        let degraded_now = descriptor(100, Some(1), 10, None);
        assert!(degraded_open.components_differing_from(&degraded_now).is_empty());
    }

    /// Mutation: change `FOOTER_DESCRIPTOR_MAX_BYTES` to any other value. Expected failure:
    /// `the_declared_footer_ceiling_is_the_preregistered_value` fails — the number is declared in
    /// the preregistration (§7) and in code, and the two must agree.
    #[test]
    fn the_declared_footer_ceiling_is_the_preregistered_value() {
        // §7/§13 A. The number lives here and in the preregistration, never in ADR text.
        assert_eq!(FOOTER_DESCRIPTOR_MAX_BYTES, 8_388_608);
    }
}
