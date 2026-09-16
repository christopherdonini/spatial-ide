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

/// Move a file's modification time forward without touching a byte of it.
///
/// **The change a mid-scan test can safely make.** Rewriting a file DuckDB is still reading makes
/// DuckDB fail first, on a truncated read, which is a fact about DuckDB and not about the
/// post-check. mtime is one of the descriptor's four components, so a test using it exercises the
/// same path with none of that interference.
fn touch_modification_time(path: &std::path::Path) {
    let now = std::time::SystemTime::now() + std::time::Duration::from_secs(120);
    std::fs::File::options()
        .write(true)
        .open(path)
        .expect("reopen to set mtime")
        .set_modified(now)
        .expect("set mtime");
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
/// Mutation: drop `file_row_number=true` from the statement. Expected failure:
/// `the_vendored_duckdb_exposes_file_row_number_on_read_parquet` fails at `prepare` — which is
/// the §13 F escalation this test exists to detect if a crate bump ever causes it.
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
/// Mutation: have `ordinal_is_physical_not_scan_ordered` compare positions instead of keys (i.e.
/// assume scan order). Expected failure:
/// `the_ordinal_stays_attached_to_its_row_under_a_reordered_scan_on_this_fixture` fails.
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

/// Mutation: restore the `IdentityUnusable` refusal on the no-`id`-column path in
/// `admit_identity`. Expected failure:
/// `a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis` fails at
/// `Dataset::open`.
#[test]
fn a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis() {
    let path = write("r-i3-keyless", &keyless());
    let ds = Dataset::open(&path).expect("R-I3 admits what used to refuse `identity_unusable`");

    assert_eq!(*ds.identity().source(), IdSource::SessionOrdinal);
    assert_eq!(ds.identity().source().as_envelope_value(), "session-ordinal:file_row_number");
    assert_eq!(
        ds.identity().uniqueness().as_str(),
        "by-construction-within-generation",
        "the third what-was-checked value, naming the basis. It is the PROPOSED ADR-016 \
         Amendment 1's, not the accepted ADR's — ADR-016 §6 as accepted lists two, and nothing \
         here treats the amendment as binding"
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
/// Mutation: spell `IdUniqueness::ByConstructionWithinGeneration` as `"unique-within-session"`.
/// Expected failure: `the_session_tier_record_says_neither_unique_nor_snapshot` fails on the
/// bare-word check.
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
/// Mutation: drop the `matches!(source, IdSource::Mapped { .. })` guard so a bad declaration
/// falls through to the session tier. Expected failure:
/// `a_declared_mapping_to_a_missing_column_still_refuses_rather_than_falling_to_the_session_tier`
/// fails — the caller named a column and would be silently answered about a different identity.
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

/// Mutation: delete the `path.is_dir()` branch in `partitioned_source_detail`. Expected failure:
/// `a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file` fails — the source
/// refuses as a generic unreadable file instead of by R-I4's name.
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

/// Mutation: remove the `\\?\` prefix strip. Expected failure:
/// `a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not` fails on its canonical-path
/// case — every canonicalized Windows path reads as a glob.
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

/// Mutation: set `footer_bytes_read: 0` on the non-degraded construction. Expected failure:
/// `the_descriptor_is_read_at_open_and_reports_the_footer_bytes_it_read` fails — boundary 5's
/// reported-only accounting would report nothing.
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
/// Mutation: shorten `EngineError::SourceChanged`'s `Display` to drop boundary 4's limitation
/// sentence. Expected failure:
/// `the_source_changed_message_states_its_limit_and_makes_no_snapshot_claim` fails.
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
/// Mutation: hash the whole file instead of the footer in `SourceDescriptor::of`. Expected
/// failure: `a_change_the_descriptor_cannot_see_is_not_reported_and_is_not_a_check_that_passed`
/// fails — and the descriptor would be performing the whole-file read boundary 6 forbids.
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

/// Mutation: change `FOOTER_DESCRIPTOR_MAX_BYTES`. Expected failure:
/// `the_footer_ceiling_is_declared_in_code_and_degrades_rather_than_refusing` fails against the
/// preregistered value.
#[test]
fn the_footer_ceiling_is_declared_in_code_and_degrades_rather_than_refusing() {
    // The number lives in the preregistration (§7) and in code, never in ADR text.
    assert_eq!(FOOTER_DESCRIPTOR_MAX_BYTES, 8 * 1024 * 1024);
    // The degradation behaviour itself is unit-tested in `engine/src/descriptor.rs`, over
    // constructed descriptors — writing a real file with an 8 MiB footer is a P4/P5 concern and is
    // not approximated here.
}

// ---- the post-check's terminal classes, and its ordering ---------------------------------------

/// **§13 C's three rules, on the three terminal classes** — and the ordering the host depends on.
///
/// The producer records what the post-check found **before it sends any terminal**, so a host that
/// reads the flag when a terminal arrives never races the producer still computing it. That
/// ordering was wrong at P3 gate attempt 1: `tx.send(Err(e))` fired first on the error path.
///
/// Mutation recorded in-source: moving the `tx.send` back above `post_check_source` in
/// `stream.rs`'s producer closure makes the cancelled case below flaky and then failing.
#[test]
fn a_clean_stream_whose_source_changed_terminates_as_source_changed() {
    let path = write("post-check-clean", &keyless());
    let ds = Dataset::open(&path).expect("opens");
    let mut stream = ds.stream(&spatial_engine::ViewportQuery::all()).expect("stream issues");

    // Change the source while the stream is open. **The modification time only, bytes untouched**:
    // rewriting the file under a scan that is still reading it makes DuckDB itself fail first, and
    // this test is about the post-check's terminal, not about DuckDB's behaviour on a truncated
    // read. mtime is one of the four components, so what is exercised is the same path.
    //
    // The batches already in flight are unaffected — nothing here claims they were a snapshot (A1);
    // what is asserted is the terminal.
    touch_modification_time(&path);

    let mut buf = Vec::new();
    let mut terminal = None;
    while let Some(item) = stream.next_into(&mut buf) {
        if let Err(e) = item {
            terminal = Some(e);
            break;
        }
    }
    match terminal {
        Some(EngineError::SourceChanged { detail }) => {
            assert!(detail.contains("mtime"), "{detail}");
        }
        other => panic!(
            "rule (i): a clean run over a changed source terminates as the typed source-changed \
             refusal, got {other:?}"
        ),
    }
    // Rule (ii)'s record, written before that terminal was sent.
    assert!(stream.stats().source_changed_detail().is_some());
}

/// **Rule (ii): a cancelled stream keeps `cancelled`** — the check still runs and still records,
/// but a cancel is never *reported* as a source change (ADR-018 vocabulary).
///
/// Mutation recorded in-source: making the `Err` arm of the terminal match send the post-check's
/// error instead of the outcome's turns this stream's terminal into `SourceChanged` and fails here.
#[test]
fn a_cancelled_stream_keeps_its_cancelled_terminal_while_the_change_is_still_recorded() {
    let path = write("post-check-cancelled", &keyless());
    let ds = Dataset::open(&path).expect("opens");
    let cancel = spatial_engine::CancelToken::new();
    let mut stream = ds
        .stream_with_cancel(&spatial_engine::ViewportQuery::all(), cancel.clone())
        .expect("stream issues");
    cancel.cancel();
    touch_modification_time(&path);

    let mut buf = Vec::new();
    let mut terminal = None;
    while let Some(item) = stream.next_into(&mut buf) {
        if let Err(e) = item {
            terminal = Some(e);
            break;
        }
    }
    // The terminal a consumer sees is the cancel, whatever the post-check found beside it.
    assert!(
        matches!(terminal, Some(EngineError::Cancelled) | None),
        "a cancel is never reported as a source change, got {terminal:?}"
    );
    // And the finding is still recorded, which is what ends the dataset-session generation — the
    // whole reason the side channel exists. It was written before the terminal above was sent.
    assert!(
        stream.stats().source_changed_detail().is_some(),
        "rule (ii): the check still runs on a cancelled stream and its finding is still recorded"
    );
}

/// The post-check finds nothing on an unchanged source, and the flag stays empty — so a host
/// reading it does not end a session that nothing happened to.
/// Mutation: have `post_check_source` always record a finding. Expected failure:
/// `an_unchanged_source_records_no_post_check_finding` fails — and every ordinary query would
/// end its own dataset session.
#[test]
fn an_unchanged_source_records_no_post_check_finding() {
    let path = write("post-check-unchanged", &keyless());
    let ds = Dataset::open(&path).expect("opens");
    let mut stream = ds.stream(&spatial_engine::ViewportQuery::all()).expect("stream issues");
    let mut buf = Vec::new();
    while let Some(item) = stream.next_into(&mut buf) {
        item.expect("an unchanged source streams to a clean terminal");
    }
    assert_eq!(stream.stats().source_changed_detail(), None);
}

// ---- the pre-check and post-check agree on an unreadable source ---------------------------------

/// **P3 gate attempt 1, blocking finding 4.** The pre-check used to propagate a read failure as
/// `EngineError::Source`, while the post-check mapped the same failure to `SourceChanged` — so a
/// source deleted mid-session left the generation live, because the host matches on `SourceChanged`.
///
/// Mutation recorded in-source: restoring `SourceDescriptor::of(&self.path)?` in
/// `Dataset::check_source_unchanged` fails this test.
#[test]
fn a_source_deleted_mid_session_refuses_as_source_changed_not_as_an_unreadable_file() {
    let path = write("precheck-deleted", &keyless());
    let ds = Dataset::open(&path).expect("opens");
    std::fs::remove_file(&path).expect("delete the source under the open dataset");

    match ds.check_source_unchanged() {
        Err(EngineError::SourceChanged { detail }) => {
            assert!(
                detail.contains("could not be re-read"),
                "the refusal names the real condition: {detail}"
            );
        }
        other => panic!(
            "a deleted source must reach the same typed refusal the post-check uses, got {other:?}"
        ),
    }
    // And through the query path, which is what the host actually calls.
    assert!(matches!(
        ds.stream(&spatial_engine::ViewportQuery::all()),
        Err(EngineError::SourceChanged { .. })
    ));
}

// ---- R-I4's glob metacharacters -----------------------------------------------------------------

/// Every metacharacter DuckDB's `read_parquet` expands is detected — not just `*` and `?`.
///
/// The trade-off this encodes is stated at the detection site: a literal file whose name contains
/// one of these is refused by name even though it is one file, because the alternative is a silent
/// multi-file scan in which `file_row_number` is a per-file ordinal reused across files — the
/// session tier's identity colliding with nothing said.
///
/// Mutation recorded in-source: narrowing `GLOB_METACHARACTERS` back to `['*', '?']` fails the
/// bracket and brace cases.
#[test]
fn every_glob_metacharacter_read_parquet_expands_is_refused_by_name() {
    for name in ["parts-*.parquet", "parts-?.parquet", "parts-[0-9].parquet", "parts-{a,b}.parquet"]
    {
        match Dataset::open(dir().join(name)) {
            Err(EngineError::IdentityOrdinalPartitionedUnsupported { detail }) => {
                assert!(detail.contains("glob metacharacter"), "{name}: {detail}");
            }
            other => panic!("`{name}` must be refused by name, got {:?}", other.err()),
        }
    }
}

// ---- the descriptor's mtime degradation ---------------------------------------------------------

/// **A filesystem reporting no modification time degrades; it does not refuse forever with the
/// false sentence "the source file changed"** (P3 gate attempt 1, correction 13).
///
/// Constructed rather than observed: no filesystem in this workspace withholds an mtime, so the
/// `(None, None)` pair is built directly. What it pins is the rule, which is where the defect was.
///
/// Mutation recorded in-source: restoring the `(Some(a), Some(b)) if a == b => {}, _ => push` form
/// in `components_differing_from` makes both assertions below fail.
#[test]
fn a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever() {
    let path = write("mtime-degradation", &keyless());
    let real = SourceDescriptor::of(&path).expect("reads");
    let without_mtime = real.clone().without_modification_time_for_test();

    // Neither side has one: not a difference. The file did not change; one component is
    // unavailable, and saying otherwise refuses every query on such a filesystem forever.
    assert!(
        without_mtime.components_differing_from(&without_mtime.clone()).is_empty(),
        "an unavailable component is a degradation, not a detected change"
    );
    assert!(without_mtime.refuse_if_changed(&without_mtime.clone()).is_ok());
    // And the operator is told which component is unavailable, in the descriptor's own words.
    let degradation = without_mtime.degradation().expect("the degradation is shown, never silent");
    assert!(degradation.contains("no modification time"), "{degradation}");

    // One side present and the other not IS a difference: that is observable, and fail-closed
    // still governs it.
    assert_eq!(real.components_differing_from(&without_mtime), vec!["mtime"]);
}
