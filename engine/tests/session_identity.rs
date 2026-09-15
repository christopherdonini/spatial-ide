// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The session identity tier** — R-I3, R-I4, R-D1 and R-D2
//! (`engine/ADMISSION-PREREGISTRATION.md` §2d, §2e), exercised against real GeoParquet files.
//!
//! Separate from `identity.rs` deliberately: that file is ADR-016's native and mapped policy and is
//! **unchanged by this cut** apart from the one assertion R-I3 replaces, and keeping the third tier
//! in its own module is what makes that visible in a diff.
//!
//! **What this module does not do.** It builds no gate test: G-A1 (fast admission asserted on read
//! accounting), G-A2 (detected-change invalidation end to end), G-A3 (late-generation rejection)
//! and G-A4 (no generation persisted) are **P5**'s and are not approximated here. It runs no corpus
//! file — that is **P4**. And nothing in it times anything: there is no duration, no rate and no
//! performance word anywhere in this file (ADR-018; block-on-sight A6).

use std::path::PathBuf;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::identity::IdSource;
use spatial_engine::{Dataset, EngineError, SourceDescriptor, FOOTER_DESCRIPTOR_MAX_BYTES};

fn dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/session-identity");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

fn write(name: &str, spec: &FixtureSpec) -> PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("write fixture");
    path
}

/// A file with no `id` column at all — the R-I3 shape, and the class §3 predicts for six of the
/// seven corpus files that reach the identity rules.
fn keyless() -> FixtureSpec {
    FixtureSpec { features: 500, avg_vertices: 12, identity: IdentityMode::ForeignKeyColumn, ..Default::default() }
}

// ---- §13 F, the escalation gate, in its standing form ------------------------------------------

/// **The probe that gated this whole piece** (`ADMISSION-PREREGISTRATION.md` §13 F: "whether the
/// vendored `duckdb` crate exposes it on the `read_parquet` path is verified at the **start** of
/// P3, before any session-ordinal code").
///
/// Kept as a test rather than recorded as a note, because the answer is a property of the vendored
/// crate and a crate bump can change it. If this ever fails, the identity mechanism itself changes
/// and that question is the human's.
///
/// It asserts availability on the **bound-parameter** form as well as the interpolated one, because
/// the engine's own stream path binds the file path (`FROM read_parquet(?)`, `trace.rs`) and an
/// option that only worked with a literal would not reach it.
#[test]
fn the_vendored_duckdb_exposes_file_row_number_on_read_parquet() {
    let path = write("frn-probe", &keyless());
    let p = path.to_str().unwrap().replace('\\', "/");
    let conn = duckdb::Connection::open_in_memory().expect("in-memory connection");

    let mut stmt = conn
        .prepare(&format!(
            "SELECT count(*), min(file_row_number), max(file_row_number), \
             count(DISTINCT file_row_number) FROM read_parquet('{p}', file_row_number=true)"
        ))
        .expect("`file_row_number = true` is accepted on the read_parquet path");
    let (rows, min, max, distinct): (i64, i64, i64, i64) = stmt
        .query_row([], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?)))
        .expect("the pseudo-column is readable");
    assert_eq!(rows, 500);
    assert_eq!(min, 0, "ordinals are 0-based");
    assert_eq!(max, rows - 1, "ordinals are dense over the file");
    assert_eq!(
        distinct, rows,
        "distinct by construction within this read — which is the whole basis the session tier \
         rests on, and is why no scan is needed to establish it"
    );

    // The bound-parameter form the engine's own statements use.
    let mut bound = conn
        .prepare("SELECT file_row_number FROM read_parquet(?, file_row_number=true) LIMIT 3")
        .expect("the option survives a bound path parameter");
    let got: Vec<i64> = bound
        .query_map([p.as_str()], |r| r.get::<_, i64>(0))
        .expect("bound query")
        .map(|r| r.unwrap())
        .collect();
    assert_eq!(got, vec![0, 1, 2]);
}

/// **The narrow in-code form of the physical-vs-scan-ordered check** (the proposed ADR-016
/// Amendment 1's block-on-sight 5: `file_row_number` must not be used "without the corpus check
/// that it is physical, not scan-ordered").
///
/// **This is evidence, not the check.** The corpus-wide verification is P4's, against real files
/// from independent pipelines; this asserts the property on one written fixture, over a reordered
/// and filtered scan, and claims nothing beyond that file. Its *placement* — exposed as a callable
/// check rather than run at open — is flagged for the architect, because running it at open would
/// read rows on the path boundary 6 declares reads nothing.
#[test]
fn the_ordinal_stays_attached_to_its_row_under_a_reordered_scan_on_this_fixture() {
    let path = write("frn-physical", &keyless());
    let p = path.to_str().unwrap().replace('\\', "/");
    let conn = duckdb::Connection::open_in_memory().expect("in-memory connection");
    assert!(
        spatial_engine::dataset::ordinal_is_physical_not_scan_ordered(&conn, &p, "parcel_key", 500)
            .expect("the check runs"),
        "on this file the ordinal did not renumber under ORDER BY — consistent with a physical \
         position. The general property is checked against the corpus at P4 and is not claimed here"
    );
}

// ---- R-I3: the session tier ---------------------------------------------------------------------

#[test]
fn a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis() {
    let path = write("r-i3-keyless", &keyless());
    let ds = Dataset::open(&path).expect("R-I3 admits what used to refuse `identity_unusable`");

    assert_eq!(*ds.identity().source(), IdSource::SessionOrdinal);
    assert_eq!(ds.identity().source().as_envelope_value(), "session-ordinal:file_row_number");
    assert_eq!(
        ds.identity().uniqueness().as_str(),
        "by-construction-within-generation",
        "ADR-016 §6's third value, naming the basis"
    );
    // Nothing counted, so nothing is claimed. `js_exact` in particular must stay unknown rather
    // than default to true (ADR-016 §7).
    assert_eq!(ds.identity().verified_rows(), None);
    assert_eq!(ds.identity().max_value(), None);
    assert_eq!(ds.identity().js_exact(), None);
    // R-I3's own sentence: the candidate list is still reported.
    assert!(ds.identity().candidate_columns().contains(&"parcel_key".to_string()));
}

/// The bare word "unique" appears nowhere in the session tier's record (the proposed ADR-016
/// Amendment 1's block-on-sight 6), and neither does any snapshot claim (A1).
#[test]
fn the_session_tier_record_says_neither_unique_nor_snapshot() {
    let path = write("r-i3-vocabulary", &keyless());
    let ds = Dataset::open(&path).expect("opens");
    let recorded = format!(
        "{} {} {}",
        ds.identity().source().as_envelope_value(),
        ds.identity().uniqueness().as_str(),
        spatial_engine::SESSION_IDENTITY_STATEMENT
    );
    let lower = recorded.to_lowercase();
    assert!(!lower.contains("unique"), "the bare word must not appear: {recorded}");
    assert!(!lower.contains("snapshot"), "no snapshot claim anywhere: {recorded}");
    // What it *does* say: this identity does not outlive the open.
    assert!(spatial_engine::SESSION_IDENTITY_STATEMENT.contains("does not survive this open"));
}

/// A **declared** mapping naming a column the file does not carry still refuses. R-I3 does not
/// swallow a caller's mistake: the caller named something specific and got it wrong (ADR-016 §3).
#[test]
fn a_declared_mapping_to_a_missing_column_still_refuses_rather_than_falling_to_the_session_tier() {
    let path = write("r-i3-bad-declaration", &keyless());
    let declaration = spatial_engine::IdentityDeclaration::new(
        "no_such_column",
        "integration-test",
        "2026-09-15T00:00:00Z",
    );
    match Dataset::open_with_declared_identity(
        &path,
        declaration,
        &spatial_engine::CancelToken::new(),
    ) {
        Err(EngineError::IdentityUnusable { column, .. }) => assert_eq!(column, "no_such_column"),
        other => panic!("expected the mapped-path refusal, got {:?}", other.err()),
    }
}

// ---- R-I4: partitioned sources ------------------------------------------------------------------

#[test]
fn a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file() {
    let d = dir().join("r-i4-partition-set");
    std::fs::create_dir_all(&d).expect("partition dir");
    match Dataset::open(&d) {
        Err(EngineError::IdentityOrdinalPartitionedUnsupported { detail }) => {
            assert!(detail.contains("directory"), "the refusal names what it saw: {detail}");
        }
        other => panic!("expected R-I4's named refusal, got {:?}", other.err()),
    }
}

#[test]
fn a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not() {
    let glob = dir().join("parts-*.parquet");
    assert!(matches!(
        Dataset::open(&glob),
        Err(EngineError::IdentityOrdinalPartitionedUnsupported { .. })
    ));
    // Narrowness, asserted: a mistyped single path is not a partition set, and calling it one would
    // be this engine inventing a diagnosis.
    assert!(matches!(
        Dataset::open(dir().join("no-such-file.parquet")),
        Err(EngineError::Source(_))
    ));

    // **A canonicalized Windows path is not a glob**, even though `\\?\C:\...` carries a literal
    // `?`. Caught by the kernel's own permission-boundary suite, which opens canonicalized paths;
    // asserted here so the narrowing cannot be undone silently.
    let real = write("r-i4-not-a-glob", &keyless());
    let canonical = std::fs::canonicalize(&real).expect("canonicalize");
    assert!(
        canonical.to_str().unwrap().contains('?') || cfg!(not(windows)),
        "this assertion is only meaningful if the canonical form really carries the prefix"
    );
    Dataset::open(&canonical).expect("a canonicalized single file opens like any other");
}

// ---- R-D1 / R-D2: the descriptor and the read-around checks -------------------------------------

#[test]
fn the_descriptor_is_read_at_open_and_reports_the_footer_bytes_it_read() {
    let path = write("r-d1-descriptor", &keyless());
    let ds = Dataset::open(&path).expect("opens");
    let d = ds.descriptor();
    assert!(d.byte_size() > 0);
    assert!(d.footer_length() > 0);
    // Reported-only, never gated (boundary 5): this is an accounted fact, and nothing compares it
    // to a budget anywhere in the tree.
    assert_eq!(d.footer_bytes_read(), d.footer_length());
    assert!(
        d.footer_length() <= FOOTER_DESCRIPTOR_MAX_BYTES,
        "this fixture's footer is far under the declared ceiling, so it is not degraded"
    );
    assert_eq!(d.degradation(), None);
    // An unchanged file is not a check that passed — it is a check that convicted nothing.
    assert!(ds.check_source_unchanged().is_ok());
}

#[test]
fn the_pre_check_refuses_by_name_when_the_source_is_replaced_under_an_open_dataset() {
    let path = write("r-d2-precheck", &keyless());
    let ds = Dataset::open(&path).expect("opens");

    // A real rewrite of the same path with a different file: two more features, so size, footer
    // length and footer hash all differ — the `-appended` mutation fixture's registered shape.
    let bigger = FixtureSpec { features: 700, ..keyless() };
    write_geoparquet(&path, &bigger).expect("rewrite the source under the open dataset");

    match ds.check_source_unchanged() {
        Err(EngineError::SourceChanged { detail }) => {
            assert!(detail.contains("size"), "every component that differed is named: {detail}");
            assert!(detail.contains("footer-hash"), "{detail}");
        }
        other => panic!("expected engine.source_changed, got {other:?}"),
    }

    // And the pre-check is wired into the query path, not only available on it: a query issued
    // after the change refuses before anything is leased.
    match ds.stream(&spatial_engine::ViewportQuery::all()) {
        Err(EngineError::SourceChanged { .. }) => {}
        other => panic!("a query issued after a detected change must refuse, got {:?}", other.err()),
    }
}

/// The refusal's own text carries boundary 4's limitation and claims nothing more (A1).
#[test]
fn the_source_changed_message_states_its_limit_and_makes_no_snapshot_claim() {
    let message = EngineError::SourceChanged { detail: "{size}".into() }.to_string();
    assert!(message.contains("does not establish snapshot consistency"));
    assert!(message.contains("cannot detect every in-place modification"));
    assert!(message.contains("only after that query has finished reading"));
    // The one phrase that must never appear anywhere.
    assert!(!message.contains("reads one snapshot"));
}

/// **The honest not-detected case, in fixture form** — §4's M-1c, asserted as a *passing* test that
/// `engine.source_changed` does **not** fire.
///
/// A file whose bytes differ only inside a data page, with size, mtime and footer preserved, is
/// invisible to all four components by construction. This is boundary 4's declared limit made a
/// test, and nothing here describes it as a check that passed.
#[test]
fn a_change_the_descriptor_cannot_see_is_not_reported_and_is_not_a_check_that_passed() {
    let path = write("m-1c-equivalent", &keyless());
    let ds = Dataset::open(&path).expect("opens");
    let before = std::fs::metadata(&path).expect("metadata");
    let modified = before.modified().expect("mtime");

    // Flip one byte well inside the file's data region — before the footer, so no descriptor
    // component that was read covers it — then restore size and mtime exactly.
    let mut bytes = std::fs::read(&path).expect("read");
    let offset = 1_000usize;
    assert!(offset < bytes.len() / 2, "the edit must land in data, not in the footer");
    bytes[offset] ^= 0x01;
    std::fs::write(&path, &bytes).expect("write");
    assert_eq!(std::fs::metadata(&path).unwrap().len(), before.len(), "size restored by construction");
    std::fs::File::options()
        .write(true)
        .open(&path)
        .expect("reopen to set mtime")
        .set_modified(modified)
        .expect("restore mtime");

    let now = SourceDescriptor::of(&path).expect("re-read");
    assert!(
        ds.descriptor().components_differing_from(&now).is_empty(),
        "NOT DETECTED — the bytes changed and the descriptor cannot see it. This is the limit \
         boundary 4 declares, recorded as a result and never as a check that passed"
    );
    assert!(ds.check_source_unchanged().is_ok());
}

// ---- the declared ceiling ------------------------------------------------------------------------

#[test]
fn the_footer_ceiling_is_declared_in_code_and_degrades_rather_than_refusing() {
    // The number lives in the preregistration (§7) and in code, never in ADR text.
    assert_eq!(FOOTER_DESCRIPTOR_MAX_BYTES, 8 * 1024 * 1024);
    // The degradation behaviour itself is unit-tested in `engine/src/descriptor.rs`, over
    // constructed descriptors — writing a real file with an 8 MiB footer is a P4/P5 concern and is
    // not approximated here.
}
