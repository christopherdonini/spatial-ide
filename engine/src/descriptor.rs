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

/// The words recorded when the filesystem reports no modification time.
///
/// **One literal, one site.** It was written twice — once on the shipped branch of
/// [`SourceDescriptor::of`] and once in a `pub` test constructor — and the test asserted the copy
/// the shipped build never produced. The constructor is gone (it acted, so the instrument-accessor
/// exemption did not cover it); the words live here and `of` is the only thing that records them.
const ABSENT_MODIFICATION_TIME_DEGRADATION: &str =
    "the filesystem reported no modification time for this file, so change detection for this \
     source is byte size, footer length and footer hash only";

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
    /// Every component this descriptor could **not** establish, in words written to be read by an
    /// operator — **though in P3a none reaches one**; see [`Self::degradation`].
    ///
    /// A list rather than one string because two can hold at once — a file with an over-ceiling
    /// footer on a filesystem reporting no modification time degrades twice, and a reader
    /// eventually owed "the degradation is shown" (boundary 5) is owed both.
    degradations: Vec<String>,
}

impl SourceDescriptor {
    /// Record [`ABSENT_MODIFICATION_TIME_DEGRADATION`] on a descriptor's degradation list.
    ///
    /// **Private, and the single site the absent-mtime degradation is recorded from.** [`Self::of`]
    /// calls it on the one branch that can reach it; `descriptor.rs`'s own
    /// `a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever` calls it on a
    /// descriptor `of` produced, so the test exercises the shipped words through the shipped code
    /// rather than a second copy of them.
    fn record_absent_modification_time(degradations: &mut Vec<String>) {
        degradations.push(ABSENT_MODIFICATION_TIME_DEGRADATION.to_string());
    }

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
        // **The degradation is RECORDED here — nothing shows it** (Amendment 4 (ii): boundary 5's
        // "the degradation is shown" is not met by P3a, because no surface carries the text to an
        // eye). A filesystem that reports no modification time has not told this descriptor that
        // anything changed; it has told it that one component is unavailable. Recording that here
        // is what lets `components_differing_from` stop reporting a permanent, false "mtime"
        // difference on such a filesystem (P3 gate attempt 1, correction 13).
        let mut degradations = Vec::new();
        if modified_nanos.is_none() {
            Self::record_absent_modification_time(&mut degradations);
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

    /// Footer bytes read for this descriptor, per open. Reported, never gated (boundary 5).
    ///
    /// **No longer an instrument accessor: it is product-called.** It was declared under the
    /// exemption (the human's ruling of 2026-09-16, round 5 item 4) on the claim that its only
    /// caller was the test suite. That claim was false of the tree: `post_check_source`
    /// (`engine/src/stream.rs:1590`), product code on the producer thread, calls it to report the
    /// bytes the R-D2 post-check read. The declaration is retired exactly as
    /// `StreamStats::post_check_bytes_read`'s was (`engine/src/stream.rs:602-616`); this accessor
    /// stands on the plain caller rule, with that product caller.
    ///
    /// Still not `cfg(test)`-gated: the property is about the *shipped* build's read accounting, and
    /// an accessor compiled only into a test build would prove it about a build nobody runs
    /// (`dataset.rs`'s own note on `INDEX_CONSULTATIONS`, and `index_consultations()` /
    /// `row_group_consultations()` / `attribute_concatenations()` beside it).
    ///
    /// Its test callers, unchanged and still useful to a reader, both in
    /// `engine/tests/session_identity.rs`:
    /// `the_descriptor_is_read_at_open_and_reports_the_footer_bytes_it_read` and
    /// `the_post_check_reports_the_footer_bytes_it_read`.
    pub fn footer_bytes_read(&self) -> u64 {
        self.footer_bytes_read
    }
    /// What this descriptor could **not** establish. `None` when all four components were.
    ///
    /// **Nothing shows this text to an operator in P3a, and it must not be described as though
    /// something did.** Boundary 5 asks for the degradation to be *shown*; carrying it to an eye
    /// needs a surface, and the one surface that would fit — a `describe` field — is outside
    /// boundary 9's closed list, so P3a does not invent one. What P3a has is the text, recorded and
    /// reachable; **where it is owed is recorded in `ADMISSION-PREREGISTRATION.md`'s Amendment 4**.
    ///
    /// **An instrument until then: its only caller is the test suite**, not `cfg(test)`-gated for
    /// the reason `footer_bytes_read` above is not — the words have to be the shipped build's.
    /// Several degradations are joined, because a reader eventually owed them is owed all of them.
    ///
    /// **Its callers, named so the caller-grep can verify this exemption** (the human's ruling of
    /// 2026-09-16, round 5 item 4):
    /// `engine/tests/session_identity.rs::the_descriptor_is_read_at_open_and_reports_the_footer_bytes_it_read`
    /// (asserts `None` on an undegraded descriptor) and this module's own
    /// `tests::a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever`
    /// (asserts the shipped const's text on a degraded one).
    pub fn degradation(&self) -> Option<String> {
        (!self.degradations.is_empty()).then(|| self.degradations.join("; "))
    }

    /// Every component this descriptor could **not** establish, named in
    /// [`Self::components_differing_from`]'s own vocabulary — `"mtime"` when no modification time
    /// was reported, `"footer-hash"` when the footer was over [`FOOTER_DESCRIPTOR_MAX_BYTES`] and
    /// was not read. `"size"` and `"footer-length"` are never unestablished — both are read from
    /// metadata this call always has.
    ///
    /// **`engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a's checks accessor.** Distinct from
    /// [`Self::degradation`]: that returns the operator-facing sentence (still shown nowhere in
    /// P3a); this returns the closed component vocabulary a wire enum can carry
    /// (`protocol/skp`'s `CheckComponent`). Product caller: the kernel's `describe` assembly
    /// (`kernel::skp::SkpHost::describe`).
    pub fn unestablished_components(&self) -> Vec<&'static str> {
        let mut out = Vec::new();
        if self.modified_nanos.is_none() {
            out.push("mtime");
        }
        if self.footer_hash.is_none() {
            out.push("footer-hash");
        }
        out
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
    /// That case is a *degradation*, and [`Self::degradation`] returns the recorded words naming it
    /// — recorded, and shown to nobody in P3a (Amendment 4 (ii)).
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

    /// RECORDED MUTATION: `unestablished_components` returns an empty list unconditionally.
    /// Expected/observed failure: this test fails — `["mtime"]` is expected, `[]` is produced.
    #[test]
    fn an_absent_modification_time_is_an_unestablished_component() {
        let with_mtime = descriptor(100, Some(1), 10, Some("aa"));
        assert!(with_mtime.unestablished_components().is_empty());
        let without_mtime = descriptor(100, None, 10, Some("aa"));
        assert_eq!(without_mtime.unestablished_components(), vec!["mtime"]);
    }

    /// RECORDED MUTATION: `unestablished_components` omits the `"footer-hash"` push. Expected/
    /// observed failure: this test fails — `["footer-hash"]` is expected, `[]` is produced.
    #[test]
    fn a_footer_hash_not_taken_is_an_unestablished_component() {
        let hashed = descriptor(100, Some(1), 10, Some("aa"));
        assert!(hashed.unestablished_components().is_empty());
        let unhashed = descriptor(100, Some(1), 10, None);
        assert_eq!(unhashed.unestablished_components(), vec!["footer-hash"]);
    }

    /// Mutation: change `FOOTER_DESCRIPTOR_MAX_BYTES` to any other value. Expected failure:
    /// `the_declared_footer_ceiling_is_the_preregistered_value` fails — the number is declared in
    /// the preregistration (§7) and in code, and the two must agree.
    #[test]
    fn the_declared_footer_ceiling_is_the_preregistered_value() {
        // §7/§13 A. The number lives here and in the preregistration, never in ADR text.
        assert_eq!(FOOTER_DESCRIPTOR_MAX_BYTES, 8_388_608);
    }

    /// **A filesystem reporting no modification time degrades; it does not refuse forever with the
    /// false sentence "the source file changed"** (P3 gate attempt 1, correction 13).
    ///
    /// **Moved here from `engine/tests/session_identity.rs`, and testing the shipped path now.** It
    /// used to build its degraded descriptor with `SourceDescriptor::without_modification_time_for_test`
    /// — a `pub` constructor whose only caller was this test and which **acted**, pushing a
    /// fabricated degradation whose literal was a second copy of the shipped one. The
    /// instrument-accessor exemption "exempts nothing that acts" (the human, 2026-09-16, round 5
    /// item 4), so the constructor is deleted, exactly as
    /// `dataset::ordinal_is_physical_not_scan_ordered` was. What replaces it: the descriptor comes
    /// from the **shipped** [`SourceDescriptor::of`] over a real fixture, and the degraded shape is
    /// produced by the same private [`SourceDescriptor::record_absent_modification_time`] that
    /// `of`'s no-mtime branch calls, over the one const those words now live in. No filesystem in
    /// this workspace withholds an mtime, so the `(None, None)` pair is still constructed; what is
    /// no longer constructed is the engine's own behaviour.
    ///
    /// In-module rather than an integration test for the reason the move exists: the private field
    /// write and the private fn call are both reachable here without a single new `pub` item, no
    /// `#[doc(hidden)]`, and nothing test-only on the crate's surface.
    ///
    /// RECORDED MUTATION: restore the `(Some(a), Some(b)) if a == b => {}, _ => push("mtime")` form
    /// in `components_differing_from`. Expected failure:
    /// `a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever` fails on its
    /// both-absent assertion — the case that once refused every query on such a filesystem forever.
    #[test]
    fn a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever() {
        let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../target/fixtures/descriptor-unit");
        std::fs::create_dir_all(&dir).expect("fixture dir");
        let path = dir.join("mtime-degradation.parquet");
        crate::fixture::write_geoparquet(
            &path,
            &crate::fixture::FixtureSpec {
                features: 64,
                avg_vertices: 8,
                identity: crate::fixture::IdentityMode::ForeignKeyColumn,
                ..Default::default()
            },
        )
        .expect("write fixture");

        // The shipped read, over a real file.
        let real = SourceDescriptor::of(&path).expect("reads");
        assert_eq!(real.degradation(), None, "this filesystem does report a modification time");

        // The shape `of` produces on a filesystem that reports none — built by `of`'s own branch
        // logic, not by a second copy of it.
        let mut without_mtime = real.clone();
        without_mtime.modified_nanos = None;
        SourceDescriptor::record_absent_modification_time(&mut without_mtime.degradations);

        // Neither side has one: NOT a difference. The file did not change; one component is
        // unavailable, and saying otherwise refuses every query on such a filesystem forever.
        assert!(
            without_mtime.components_differing_from(&without_mtime.clone()).is_empty(),
            "an unavailable component is a degradation, not a detected change"
        );
        assert!(without_mtime.refuse_if_changed(&without_mtime.clone()).is_ok());

        // The words are the shipped const's, recorded and reachable — shown to nobody in P3a.
        assert_eq!(
            without_mtime.degradation().as_deref(),
            Some(ABSENT_MODIFICATION_TIME_DEGRADATION)
        );

        // One side present and the other not IS a difference: that is observable, and fail-closed
        // still governs it.
        assert_eq!(real.components_differing_from(&without_mtime), vec!["mtime"]);
    }
}
