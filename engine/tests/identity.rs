//! Identity admission — the **ADR-016** policy, exercised through real GeoParquet files.
//!
//! Separate from `slice.rs` because it is a different subject with its own fixtures, in the same
//! way ADR-016 is separate from ADR-015: both are decided at open, and that is the only thing they
//! share.
//!
//! Every case here is a file the engine either admits or refuses. Asserting against a written file
//! rather than a hand-built schema is deliberate — "the engine refuses this file" and "the engine
//! refuses this struct" are different claims, and only the first one is the product.

use std::path::PathBuf;
use std::time::{Duration, Instant};

use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec, IdentityMode};
use spatial_engine::identity::{IdSource, IdUniqueness, IdentityDeclaration};
use spatial_engine::{CancelToken, Dataset, EngineError, ViewportQuery};

/// The same loud per-test bound `slice.rs` carries, for the same reason: a test that can hang
/// forever is itself a defect, and `next_into` blocks on a channel with no timeout form.
struct Watchdog(std::sync::Arc<std::sync::atomic::AtomicBool>);

const TEST_DEADLINE: Duration = Duration::from_secs(120);

impl Watchdog {
    fn new(label: &'static str) -> Self {
        let done = std::sync::Arc::new(std::sync::atomic::AtomicBool::new(false));
        let flag = done.clone();
        std::thread::spawn(move || {
            let deadline = Instant::now() + TEST_DEADLINE;
            while Instant::now() < deadline {
                if flag.load(std::sync::atomic::Ordering::SeqCst) {
                    return;
                }
                std::thread::sleep(Duration::from_millis(50));
            }
            if !flag.load(std::sync::atomic::Ordering::SeqCst) {
                eprintln!(
                    "WATCHDOG: `{label}` exceeded {TEST_DEADLINE:?} without finishing — a \
                     blocking wait never returned."
                );
                std::process::abort();
            }
        });
        Self(done)
    }
}

impl Drop for Watchdog {
    fn drop(&mut self) {
        self.0.store(true, std::sync::atomic::Ordering::SeqCst);
    }
}

fn write(name: &str, spec: &FixtureSpec) -> (PathBuf, FixtureFacts) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/identity");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let facts = write_geoparquet(&path, spec).expect("write fixture");
    (path, facts)
}

fn small() -> FixtureSpec {
    FixtureSpec { features: 2_000, avg_vertices: 20, ..Default::default() }
}

fn declare(column: &str) -> IdentityDeclaration {
    IdentityDeclaration::new(column, "integration-test", "2026-08-05T00:00:00Z")
}

#[test]
fn a_native_id_column_is_verified_unique_rather_than_trusted() {
    let _wd = Watchdog::new("a_native_id_column_is_verified_unique_rather_than_trusted");
    // ADR-016's Context records that the native column used to be admitted on
    // exists-and-is-an-integer alone. This is the check that closed that gap.
    let (path, facts) = write("native", &small());
    let ds = Dataset::open(&path).expect("open");

    assert_eq!(*ds.identity().source(), IdSource::File);
    assert_eq!(ds.identity().uniqueness(), IdUniqueness::VerifiedAtOpenFullFile);
    assert_eq!(ds.identity().verified_rows(), Some(facts.features as u64));
    assert_eq!(ds.identity().js_exact(), Some(true));

    let md = ds.envelope().schema().metadata().clone();
    assert_eq!(md.get("id_source").unwrap(), "file:id");
    assert_eq!(md.get("id_uniqueness").unwrap(), "verified-at-open-full-file");
    assert_eq!(md.get("id_verified_rows").unwrap(), &facts.features.to_string());
}

#[test]
fn a_duplicate_id_column_is_refused_rather_than_admitted_as_identity() {
    let _wd = Watchdog::new("a_duplicate_id_column_is_refused");
    // The gap ADR-016's Context names first: legal parquet, an integer column called `id`, and two
    // features sharing an identity — ADR-010 rule 2's wrong-but-plausible pick arriving through
    // the data instead of through buffer order.
    let (path, _) =
        write("duplicate", &FixtureSpec { identity: IdentityMode::DuplicateIds, ..small() });
    match Dataset::open(&path) {
        Err(EngineError::IdentityUnusable { column, detail }) => {
            assert_eq!(column, "id");
            assert!(detail.contains("distinct"), "the refusal must say why: {detail}");
        }
        other => panic!("expected a typed refusal, got {:?}", other.err()),
    }
}

#[test]
fn a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared() {
    let _wd = Watchdog::new("a_foreign_key_column_needs_a_declaration");
    // The shape most real GeoParquet has, and the reason ADR-016 exists: refusal stays the
    // default (§2)…
    let (path, facts) =
        write("foreign-key", &FixtureSpec { identity: IdentityMode::ForeignKeyColumn, ..small() });
    assert!(matches!(Dataset::open(&path), Err(EngineError::IdentityUnusable { .. })));

    // …and a declaration redirects identity without weakening anything.
    let ds = Dataset::open_with_declared_identity(&path, declare("parcel_key"), &CancelToken::new())
        .expect("a declared mapping admits the file");
    assert_eq!(
        *ds.identity().source(),
        IdSource::Mapped {
            column: "parcel_key".into(),
            by: "integration-test".into(),
            at: "2026-08-05T00:00:00Z".into(),
        }
    );
    assert_eq!(ds.identity().uniqueness(), IdUniqueness::VerifiedAtOpenFullFile);

    let md = ds.envelope().schema().metadata().clone();
    assert_eq!(md.get("id_source").unwrap(), "mapped:parcel_key");
    assert_eq!(md.get("id_declared_by").unwrap(), "integration-test");

    // And the stream reads it: every feature arrives, coordinates untouched, ids distinct.
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    let mut rows = 0usize;
    while let Some(info) = s.next_into(&mut buf) {
        rows += info.expect("batch").rows;
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let batch = rdr.next().unwrap().unwrap();
        let col = batch
            .column(0)
            .as_any()
            .downcast_ref::<arrow::array::UInt64Array>()
            .expect("id column");
        ids.extend(col.values().iter().copied());
        buf.clear();
    }
    assert_eq!(rows, facts.features);
    ids.sort_unstable();
    ids.dedup();
    assert_eq!(ids.len(), facts.features, "every mapped id is distinct on the wire too");
}

#[test]
fn a_declared_mapping_to_a_non_integer_column_is_refused_not_hashed() {
    let _wd = Watchdog::new("a_non_integer_mapping_is_refused");
    // ADR-016 §4: a hash or a dictionary index is a synthesized identity wearing a mapping's
    // clothes. Hashing would introduce a collision probability a stable identity may not have.
    let (path, _) = write("string-key", &FixtureSpec { identity: IdentityMode::StringIds, ..small() });
    match Dataset::open_with_declared_identity(&path, declare("id"), &CancelToken::new()) {
        Err(EngineError::IdentityUnusable { detail, .. }) => {
            assert!(detail.contains("Utf8"), "the refusal names the type: {detail}");
            assert!(detail.contains("synthesized"), "and says why a hash is not a way out: {detail}");
        }
        other => panic!("expected a typed refusal, got {:?}", other.err()),
    }
}

#[test]
fn a_negative_identity_value_is_refused_because_it_cannot_widen_into_u64() {
    let _wd = Watchdog::new("a_negative_identity_value_is_refused");
    // The *type* is admissible — Int64 widens — and the *values* are not. That is why §4's type
    // test and the value check both exist; either alone would let this through or refuse too much.
    let (path, _) =
        write("negative", &FixtureSpec { identity: IdentityMode::NegativeIds, ..small() });
    match Dataset::open(&path) {
        Err(EngineError::IdentityUnusable { detail, .. }) => {
            assert!(detail.contains("negative"), "{detail}");
        }
        other => panic!("expected a typed refusal, got {:?}", other.err()),
    }
}

#[test]
fn identities_above_the_js_exact_limit_are_admitted_but_flagged_on_the_envelope() {
    let _wd = Watchdog::new("huge_identities_are_flagged");
    // ADR-016 §7. The engine carries u64 exactly, so this is admitted — but a consumer narrowing
    // to a JS `Number` would collide, and the envelope says so rather than leaving it to be
    // discovered per value. An unhandled BigInt is the M4 root cause behind ADR-010 rule 7.
    let (path, _) = write("huge", &FixtureSpec { identity: IdentityMode::HugeIds, ..small() });
    let ds = Dataset::open(&path).expect("u64 carries these exactly");
    assert_eq!(ds.identity().js_exact(), Some(false));
    assert_eq!(ds.envelope().schema().metadata().get("id_js_exact").unwrap(), "false");
}

#[test]
fn skipping_the_uniqueness_check_is_recorded_rather_than_hidden() {
    let _wd = Watchdog::new("skipping_the_uniqueness_check_is_recorded");
    // A caller may take responsibility for uniqueness. It may not make that invisible: ADR-016 §6
    // requires the record to say what was *checked*, so an opt-out is visible to every consumer
    // downstream of it — including on a file that would have failed the check.
    let (path, _) =
        write("unverified", &FixtureSpec { identity: IdentityMode::DuplicateIds, ..small() });
    let mut d = declare("id");
    d.skip_uniqueness_check = true;
    let ds = Dataset::open_with_declared_identity(&path, d, &CancelToken::new())
        .expect("the opt-out admits without checking");

    assert_eq!(ds.identity().uniqueness(), IdUniqueness::DeclaredNotVerified);
    let md = ds.envelope().schema().metadata().clone();
    assert_eq!(md.get("id_uniqueness").unwrap(), "declared-not-verified");
    // Unknown, and reported as unknown rather than defaulted to the reassuring answer.
    assert!(md.get("id_js_exact").is_none(), "unverified width must not read as exact");
    assert!(md.get("id_verified_rows").is_none());
}

#[test]
fn the_uniqueness_scan_is_cancellable_because_it_reads_a_whole_column() {
    let _wd = Watchdog::new("the_uniqueness_scan_is_cancellable");
    // ADR-016 §5: the scan is an *operation*, not a lookup, so `docs/01` principle 7 binds it.
    // At `docs/07`'s 5 GB this is the difference between an open a user can abandon and one that
    // holds the application for the length of a full column read.
    let (path, _) = write("cancellable", &FixtureSpec { features: 40_000, ..small() });
    let cancel = CancelToken::new();
    cancel.cancel();

    match Dataset::open_with_declared_identity(&path, declare("id"), &cancel) {
        Err(EngineError::Cancelled) => {}
        // A pre-cancelled token may also surface as DuckDB refusing to run at all; either way the
        // open must not complete as if nothing happened.
        Err(EngineError::Query(_)) => {}
        other => panic!("a cancelled open must not succeed, got {:?}", other.map(|_| "Ok")),
    }
}
