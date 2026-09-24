// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **G-A1 — fast admission is structural, proved on reads rather than on a timing**
//! (`engine/ADMISSION-PREREGISTRATION.md` §12b).
//!
//! A session-ordinal open (R-I3) must issue zero whole-file reads and no hash call; a native or
//! mapped open must run exactly the verification scan. Both directions are asserted in **one test
//! module**, on the counter `Dataset::open`'s own identity admission increments
//! (`identity_verification_scans`, `dataset.rs`), so the two claims cannot drift apart from each
//! other the way two separate files could.
//!
//! ## Why this file has exactly one `#[test]`
//!
//! Same isolation `planner_seam.rs` states for `INDEX_CONSULTATIONS`, learned the hard way while
//! drafting this file: **an integration-test *file* is its own process, but `cargo test` runs every
//! `#[test]` fn *within* one file concurrently, on shared threads, by default.** A first version of
//! this file split the session-ordinal and native/mapped claims into two `#[test]` fns and failed
//! `session_ordinal...` nondeterministically — `identity_verification_scans()` had moved between the
//! "before" read and the open, because the *other* test's native-identity open ran its own
//! whole-column scan on another thread in between. A racy proof of a negative is worse than none, so
//! every claim this file makes about the counter's before/after delta runs inside the same `#[test]`
//! fn, in sequence, with nothing else in the process able to touch it.
//!
//! ## What is, and is not, asserted about a "hash call"
//!
//! `admit_identity`'s only whole-column read is `run_identity_scan`, which this counter counts.
//! There is no separate content-hash call anywhere on the open path for a test to instrument
//! instead: the engine's one content hash (`index::content_hash`) lives inside `build_index`, which
//! no `Dataset::open*` constructor calls. So "no hash call" for a session-ordinal open is a
//! structural fact about `open_inner`'s call graph — checkable by reading `dataset.rs`, not by a
//! counter that would have to invent an operation the code does not perform to prove it absent.

use std::path::PathBuf;

use spatial_engine::dataset::identity_verification_scans;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::identity::{IdSource, IdUniqueness, IdentityDeclaration};
use spatial_engine::{CancelToken, Dataset};

fn write(name: &str, spec: &FixtureSpec) -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/admission-instruments");
    std::fs::create_dir_all(&d).expect("fixture dir");
    let path = d.join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("write fixture");
    path
}

fn small() -> FixtureSpec {
    FixtureSpec { features: 500, avg_vertices: 12, ..Default::default() }
}

/// RECORDED MUTATION: remove the `IDENTITY_VERIFICATION_SCANS.fetch_add(1, ..)` line
/// `admit_identity` runs immediately before `run_identity_scan` (`engine/src/dataset.rs`).
/// EXPECTED FAILURE: this test fails on its mapped-open assertion — `after_mapped > before_mapped`
/// is false (the counter no longer moves at all), rather than the session-ordinal assertion passing
/// vacuously because nothing ever increments the counter in the first place.
#[test]
fn session_ordinal_reads_nothing_native_and_mapped_run_exactly_the_verification_scan() {
    // F-7-class: polygons, a candidate column (`parcel_key`) that is not named `id`, no native
    // identity and no declaration -- the same fixture shape `identity.rs`'s
    // `a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared` already opens both
    // ways, reused here for the read-accounting claim that test does not make.
    let foreign_key_path =
        write("foreign-key", &FixtureSpec { identity: IdentityMode::ForeignKeyColumn, ..small() });

    // ---- session-ordinal: the SAME file, opened plain --------------------------------------
    let before_ordinal = identity_verification_scans();
    let ordinal = Dataset::open(&foreign_key_path).expect("R-I3: a single-file keyless source admits");
    assert_eq!(*ordinal.identity().source(), IdSource::SessionOrdinal);
    assert_eq!(ordinal.identity().uniqueness(), IdUniqueness::ByConstructionWithinGeneration);
    assert_eq!(
        identity_verification_scans(),
        before_ordinal,
        "a session-ordinal open must not run the uniqueness scan at all (boundary 6, G-A1)"
    );
    drop(ordinal);

    // ---- mapped: the SAME file, opened with a declared mapping onto `parcel_key` -----------
    let before_mapped = identity_verification_scans();
    let mapped = Dataset::open_with_declared_identity(
        &foreign_key_path,
        IdentityDeclaration::new("parcel_key", "admission-instruments-test", "2026-09-18T00:00:00Z"),
        &CancelToken::new(),
    )
    .expect("a declared mapping admits the file");
    assert!(matches!(*mapped.identity().source(), IdSource::Mapped { .. }));
    assert_eq!(mapped.identity().uniqueness(), IdUniqueness::VerifiedAtOpenFullFile);
    let after_mapped = identity_verification_scans();
    assert!(
        after_mapped > before_mapped,
        "a mapped open must run the verification scan; the counter did not move \
         (before={before_mapped}, after={after_mapped})"
    );
    assert_eq!(after_mapped, before_mapped + 1, "exactly one scan for one open -- not zero, not more than one");
    drop(mapped);

    // ---- native: a SEPARATE file with an admissible `id` column (F-8-class, R-I1) ----------
    // ADR-016's own gap, unchanged by Brief A: the uniqueness scan runs for a native column too,
    // not only a mapped one -- G-A1's "the verification scan runs" holds for both.
    let native_path = write("native", &small());
    let before_native = identity_verification_scans();
    let native = Dataset::open(&native_path).expect("open");
    assert_eq!(*native.identity().source(), IdSource::File);
    assert_eq!(native.identity().uniqueness(), IdUniqueness::VerifiedAtOpenFullFile);
    let after_native = identity_verification_scans();
    assert!(
        after_native > before_native,
        "a native-identity open must run the verification scan; the counter did not move \
         (before={before_native}, after={after_native})"
    );
    assert_eq!(after_native, before_native + 1, "exactly one scan for one open");
}
