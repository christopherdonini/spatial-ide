// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `publish-session-tier-identity` (U1) and `export-refused-above-row-ceiling-every-scope` (U10):
//! the tests, built from the real producers (`Catalog::open_cancellable`, `boundary::execute`).
//!
//! Preregistration: `governance/forms/kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md`.
//!
//! Every test opens its fixture the way the host does (no CRS assertion, and no declared identity
//! unless the test says so), so the identity under test is the one a real open admits. Nothing here
//! sleeps, retries or times out.

use std::path::{Path, PathBuf};
use std::sync::{Mutex, MutexGuard, OnceLock};
use std::time::Duration;

use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode, E_LO, N_LO,
};
use spatial_engine::{Bbox, CancelToken, Dataset, IdentityDeclaration, ViewportQuery};
use spatial_kernel::bundle;
use spatial_kernel::permission::{
    boundary, AuditLog, BoundaryError, DestinationScope, GrantSet, OperationKind, PreNamedApproval,
    Principal, PrincipalKind, PublishAttempt, PublishGrant, SourceScope, AUDIT_LOG_ENV,
};
use spatial_kernel::publish::{
    self, CorrespondingSource, CorrespondingSourceKind, PublishError, PublishRequest, ViewerAsset,
    ViewerAssets, ViewerLicenseInput,
};
use spatial_kernel::Catalog;

/// The code the session-tier refusal carries. Matched as text on purpose: the test must compile and
/// run against code that has no such refusal yet, so that its failure there is a failed assertion.
const SESSION_REFUSAL_CODE: &str = "publish.session_identity_not_publishable";

const STYLE: &str = r##"{
  "style_version": 1,
  "layer": {
    "geometry": "polygon",
    "fill_color": {"match": {
      "column": "zone",
      "cases": [{"when": "residential", "then": "#aa3333"}],
      "on_null": "#888888",
      "on_unmatched": "#cccccc"}},
    "fill_opacity": {"literal": 0.8},
    "outline_color": {"literal": "#202020"},
    "outline_width": {"literal": 1.0}
  }
}"##;

/// Serializes the set-var, run and read window of the process-global audit-log variable.
fn env_lock() -> MutexGuard<'static, ()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(()))
        .lock()
        .unwrap_or_else(|e| e.into_inner())
}

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-kernel-publish-identity-tier-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    std::fs::canonicalize(&d).unwrap()
}

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset {
            path: "index.html".into(),
            bytes: b"<!doctype html><title>t</title>".to_vec(),
        },
        ViewerAsset {
            path: "NOTICE.txt".into(),
            bytes: b"stub notice\n".to_vec(),
        },
    ])
    .unwrap()
}

fn viewer_license() -> ViewerLicenseInput {
    ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://example.org/spatial-ide".into(),
        },
    }
}

fn clock() -> String {
    "2026-11-06T12:00:00Z".to_string()
}

fn request<'a>(
    ds: &'a Dataset,
    v: &'a ViewerAssets,
    query: ViewportQuery,
    destination: PathBuf,
) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query,
        attributes: vec!["zone".to_string()],
        style_source: STYLE,
        viewer: v,
        viewer_license: viewer_license(),
        license: None,
        destination,
        started_at: "2026-11-06T12:00:00Z".into(),
        finished_at: &clock,
    }
}

fn principal() -> Principal {
    Principal {
        kind: PrincipalKind::OsUser,
        id: "test-operator".into(),
    }
}

/// A grant covering exactly this dataset (by its pin) and this destination. Built from the pin and
/// not from `publish::preflight`, so a refusal in preflight cannot be mistaken for a missing grant.
fn grant_for(ds: &Dataset, destination: &Path) -> GrantSet {
    let pin = ds.content_pin().expect("the dataset is pinned");
    let mut set = GrantSet::new();
    set.add(
        PublishGrant::new(
            OperationKind::Publish,
            SourceScope {
                dataset_name: "parcels".into(),
                content_hash: format!("sha256:{}", pin.hash()),
            },
            DestinationScope::exact(destination).unwrap(),
            principal(),
            Duration::from_secs(600),
        )
        .unwrap(),
    )
    .unwrap();
    set
}

/// One attempt through the real boundary, with the audit log pointed at `log_path`.
fn run_attempt(
    log_path: &Path,
    req: &PublishRequest<'_>,
    grants: &GrantSet,
    approval_name: &str,
) -> Result<publish::PublishOutcome, BoundaryError> {
    let _guard = env_lock();
    std::env::set_var(AUDIT_LOG_ENV, log_path);
    let resolved =
        spatial_kernel::permission::grant::resolve_destination(&req.destination).unwrap();
    let audit = AuditLog::open_for(&resolved)?;
    let approval = PreNamedApproval(approval_name.to_string());
    let attempt = PublishAttempt {
        request: req,
        grants,
        approval: &approval,
        principal: &principal(),
        audit: &audit,
        clock: &clock,
    };
    boundary::execute(&attempt, &CancelToken::new(), None)
}

/// Whether any staging directory survives beside the destination.
fn no_side_effect(dir: &Path, destination: &Path) {
    assert!(
        !destination.exists(),
        "a destination was created: {}",
        destination.display()
    );
    let leftovers: Vec<String> = std::fs::read_dir(dir)
        .unwrap()
        .filter_map(|e| e.ok())
        .map(|e| e.file_name().to_string_lossy().to_string())
        .filter(|n| n.contains(".staging-"))
        .collect();
    assert!(
        leftovers.is_empty(),
        "staging directories survived: {leftovers:?}"
    );
}

/// FX-S: 200 features, a foreign-key column and no `id`, so the open admits the session tier.
fn open_fx_s(dir: &Path) -> std::sync::Arc<Dataset> {
    let path = dir.join("fx-s.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 200,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::ForeignKeyColumn,
            ..Default::default()
        },
    )
    .unwrap();
    let catalog = Catalog::new();
    catalog
        .open_cancellable("fx_s", &path, None, None, &CancelToken::new())
        .expect("the foreign-key-column fixture opens");
    catalog.get("fx_s").expect("the catalog holds the dataset")
}

/// The two scopes: the viewport's bbox (a sixteenth of the file) and the whole dataset.
fn scopes() -> [(&'static str, ViewportQuery); 2] {
    [
        (
            "current-view",
            ViewportQuery {
                bbox: Some(Bbox {
                    xmin: E_LO,
                    ymin: N_LO,
                    xmax: E_LO + 160.0,
                    ymax: N_LO + 160.0,
                }),
                bbox_crs: None,
                limit: None,
                filter: None,
            },
        ),
        ("whole-dataset", ViewportQuery::all()),
    ]
}

/// **K-U1 (R1 and R2): a dataset on the session tier is refused, in both scopes.**
///
/// FX-S opens through `Catalog::open_cancellable` with no assertion and no declared identity, which
/// is what the host does, and lands on the session tier. R1: `preflight_pinless` refuses it with the
/// session-tier code, in both scopes, and takes no pin. R2: pinned, with a grant for exactly this
/// dataset and destination and an approval carrying the destination's name, `boundary::execute`
/// returns the same code, creates no destination and no staging directory, and writes no audit
/// record.
#[test]
fn a_session_tier_dataset_is_refused_before_the_pin_and_at_the_boundary_in_both_scopes() {
    let d = workspace("k-u1");
    let ds = open_fx_s(&d);
    assert!(
        ds.identity().source().is_session_ordinal(),
        "FX-S must be on the session tier for this test to prove anything"
    );
    assert!(ds.content_pin().is_none(), "R1 runs before any pin");
    let v = viewer();

    // R1, unpinned.
    for (label, query) in scopes() {
        let req = request(&ds, &v, query, d.join(format!("r1-{label}")));
        match publish::preflight_pinless(&req) {
            Err(e) => assert_eq!(
                e.code(),
                SESSION_REFUSAL_CODE,
                "R1 {label}: expected the session-tier refusal, got {e}"
            ),
            Ok(()) => panic!("R1 {label}: preflight_pinless admitted a session-tier dataset"),
        }
        assert!(
            ds.content_pin().is_none(),
            "R1 {label}: the refusal must come before any pin"
        );
        assert!(!req.destination.exists(), "R1 {label}: nothing is created");
    }

    // R2, pinned, through the real boundary.
    ds.pin_content(&CancelToken::new()).unwrap();
    for (label, query) in scopes() {
        let dest = d.join(format!("r2-{label}"));
        let log = d.join(format!("audit-{label}.jsonl"));
        let req = request(&ds, &v, query, dest.clone());
        let grants = grant_for(&ds, &dest);
        let approval_name = format!("r2-{label}");
        match run_attempt(&log, &req, &grants, &approval_name) {
            Err(BoundaryError::Publish(e)) => assert_eq!(
                e.code(),
                SESSION_REFUSAL_CODE,
                "R2 {label}: expected the session-tier refusal, got {e}"
            ),
            Err(other) => panic!("R2 {label}: expected a publish refusal, got {other:?}"),
            Ok(outcome) => panic!(
                "R2 {label}: the boundary published a session-tier dataset ({} rows)",
                outcome.rows
            ),
        }
        no_side_effect(&d, &dest);
        let records = std::fs::read_to_string(&log).unwrap_or_default();
        assert!(
            records.trim().is_empty(),
            "R2 {label}: a preflight refusal must leave no audit record, found: {records}"
        );
    }
}

// ---- K-CAV: the manifest's identity caveat states what each tier's check was ----------------------

/// The verified tier's caveat, byte for byte as the publisher wrote it before this piece.
const VERIFIED_CAVEAT: &str = "uniqueness was verified over this file at open. Stability across \
reopen is NOT established: nothing here pins a source revision, so two files could present \
identical identities. The source content hash above is the only thing tying this identity space \
to a byte sequence";

/// FX-V: 50 features with a native, unique `id` column.
fn write_fx_v(dir: &Path) -> PathBuf {
    let path = dir.join("fx-v.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 50,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .unwrap();
    path
}

/// Opens `path` through the catalog (declared identity as given), pins it, publishes the whole file
/// without the boundary (these are format facts, not authorization facts) and returns the manifest's
/// `identity` member.
fn published_identity(
    dir: &Path,
    path: &Path,
    declared: Option<IdentityDeclaration>,
    dest_name: &str,
) -> serde_json::Value {
    let catalog = Catalog::new();
    catalog
        .open_cancellable("ds", path, None, declared, &CancelToken::new())
        .expect("the fixture opens");
    let ds = catalog.get("ds").unwrap();
    ds.pin_content(&CancelToken::new()).unwrap();
    let v = viewer();
    let dest = dir.join(dest_name);
    let req = request(&ds, &v, ViewportQuery::all(), dest.clone());
    publish::publish_unguarded(&req, &CancelToken::new(), None).expect("the publish succeeds");
    let manifest: serde_json::Value =
        serde_json::from_slice(&std::fs::read(dest.join(bundle::MANIFEST_PATH)).unwrap()).unwrap();
    manifest["identity"].clone()
}

/// **K-CAV (R4 and R5): the caveat states what each tier's check was.**
///
/// R4: a file with a native `id`, verified at open, publishes with exactly the caveat bytes the
/// publisher wrote before this piece. R5: the same file opened with a declared mapping onto `id` and
/// `skip_uniqueness_check` true is `declared-not-verified`, and its caveat is not the verified one:
/// it contains no claim that a verification ran, and it keeps the stability sentence.
#[test]
fn the_manifest_caveat_claims_a_verification_only_for_the_tier_that_had_one() {
    let d = workspace("k-cav");
    let path = write_fx_v(&d);

    // R4, FX-V.
    let verified = published_identity(&d, &path, None, "r4");
    assert_eq!(verified["id_uniqueness"], "verified-at-open-full-file");
    assert_eq!(
        verified["caveat"].as_str().unwrap(),
        VERIFIED_CAVEAT,
        "R4: the verified tier's caveat bytes must not change"
    );

    // R5, FX-D.
    let mut declaration = IdentityDeclaration::new("id", "test-operator", "2026-11-06T12:00:00Z");
    declaration.skip_uniqueness_check = true;
    let declared = published_identity(&d, &path, Some(declaration), "r5");
    assert_eq!(declared["id_source"], "mapped:id");
    assert_eq!(declared["id_uniqueness"], "declared-not-verified");
    let caveat = declared["caveat"].as_str().unwrap();
    assert!(
        !caveat.contains("was verified"),
        "R5: the caveat claims a verification that never ran: {caveat}"
    );
    assert!(
        caveat.contains("was not verified"),
        "R5: the caveat must say the check did not run: {caveat}"
    );
    assert!(
        caveat.contains("Stability across reopen is NOT established"),
        "R5: the stability sentence stays: {caveat}"
    );
}

// ---- K-U10a and K-U10b: the reader's MAX_FEATURES ceiling against the rows a scope publishes ------

/// FX-BIG: MAX_FEATURES + 1 features, minimal geometry, a native `id`, **with** the covering bbox
/// (a bbox query needs it).
///
/// The generator tiles parcels on a grid of 40 m cells from (`E_LO`, `N_LO`), `ceil(sqrt(n))` = 1415
/// cells to a row, and keeps each parcel's ring inside its own cell. So the bbox of
/// [`fx_big_bbox`] encloses exactly the cells 0..100 by 0..50, which is 5,000 features.
fn write_fx_big(path: &Path) {
    write_geoparquet(
        path,
        &FixtureSpec {
            features: publish::ceilings::reader_ceilings().max_features as usize + 1,
            avg_vertices: 3,
            hole_every: 0,
            crs_mode: CrsMode::DeclaredLv95,
            with_covering_bbox: true,
            identity: IdentityMode::NativeUnique,
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        },
    )
    .unwrap();
}

/// The rows [`fx_big_bbox`] encloses in FX-BIG.
const FX_BIG_BBOX_ROWS: u64 = 5_000;

fn fx_big_bbox() -> ViewportQuery {
    ViewportQuery {
        bbox: Some(Bbox {
            xmin: E_LO,
            ymin: N_LO,
            xmax: E_LO + 4_000.0,
            ymax: N_LO + 2_000.0,
        }),
        bbox_crs: None,
        limit: None,
        filter: None,
    }
}

/// **K-U10a (R6, with R7 beside it): a Current-view publish over a verified file above the ceiling
/// is predicted from its own rows.**
///
/// FX-BIG holds MAX_FEATURES + 1 verified rows. Preflight no longer reads that whole-file count as
/// the prediction for a bbox scope: the bbox publish passes preflight and writes exactly the 5,000
/// rows its bbox encloses, while the whole-file scope over the same file is still refused at
/// preflight, before any pin.
///
/// `#[ignore]`d and release-only, for the reason of the ADR-025 tests in `publish.rs`: the property
/// needs a source above MAX_FEATURES scanned rows. Run by hand: `cargo test -p spatial-kernel
/// --release --test publish_identity_tier -- --ignored`. Not run in CI.
#[test]
#[ignore = "release-only: needs a source above MAX_FEATURES rows; run by hand with --release -- --ignored"]
fn a_current_view_publish_over_a_verified_file_above_the_ceiling_publishes_its_own_rows() {
    let max = publish::ceilings::reader_ceilings().max_features;
    let d = workspace("k-u10a");
    let path = d.join("fx-big.parquet");
    write_fx_big(&path);
    let catalog = Catalog::new();
    catalog
        .open_cancellable("fx_big", &path, None, None, &CancelToken::new())
        .expect("FX-BIG opens");
    let ds = catalog.get("fx_big").unwrap();
    assert_eq!(ds.identity().verified_rows(), Some(max + 1));
    let v = viewer();

    // R7: the whole file is refused at preflight, before any pin.
    let whole = request(&ds, &v, ViewportQuery::all(), d.join("whole"));
    match publish::preflight_pinless(&whole) {
        Err(PublishError::ReaderCeilingExceeded {
            ceiling, predicted, ..
        }) => {
            assert_eq!(ceiling, "MAX_FEATURES");
            assert_eq!(predicted, max + 1);
        }
        other => panic!("R7: expected ReaderCeilingExceeded for the whole file, got {other:?}"),
    }
    assert!(ds.content_pin().is_none(), "R7: refused before any pin");

    // R6: the bbox scope publishes its own rows.
    ds.pin_content(&CancelToken::new()).unwrap();
    let dest = d.join("bundle");
    let view = request(&ds, &v, fx_big_bbox(), dest.clone());
    publish::preflight(&view).expect("R6: a bbox scope is not predicted from the whole file");
    let outcome = publish::publish_unguarded(&view, &CancelToken::new(), None)
        .expect("R6: the Current-view publish succeeds");
    assert_eq!(outcome.rows, FX_BIG_BBOX_ROWS);
    assert!(dest.join(bundle::MANIFEST_PATH).exists());

    // Disk hygiene: a multi-million-row fixture must not linger under the temp folder.
    let _ = std::fs::remove_dir_all(&d);
}

/// **K-U10b (R8): the write-time guard refuses an unverified file above the ceiling before the
/// batch that crosses it is written.**
///
/// FX-BIG-D is FX-BIG opened with a declared mapping onto `id` and `skip_uniqueness_check` true, so
/// its row count is `None` and preflight predicts nothing. Through the real boundary, the whole-file
/// publish is refused with `CeilingExceeded` for `MAX_FEATURES`, with the limit and a total above it;
/// no destination and no staging directory remain, and the audit log reads an intent and a refused
/// outcome of kind `CeilingExceeded`.
///
/// `#[ignore]`d and release-only, for the reason K-U10a is. Run by hand: `cargo test -p
/// spatial-kernel --release --test publish_identity_tier -- --ignored`. Not run in CI.
#[test]
#[ignore = "release-only: needs a source above MAX_FEATURES rows; run by hand with --release -- --ignored"]
fn an_unverified_file_above_the_ceiling_is_refused_by_the_write_time_guard_and_leaves_nothing() {
    let max = publish::ceilings::reader_ceilings().max_features;
    let d = workspace("k-u10b");
    let path = d.join("fx-big-d.parquet");
    write_fx_big(&path);
    let mut declaration = IdentityDeclaration::new("id", "test-operator", "2026-11-06T12:00:00Z");
    declaration.skip_uniqueness_check = true;
    let catalog = Catalog::new();
    catalog
        .open_cancellable(
            "fx_big_d",
            &path,
            None,
            Some(declaration),
            &CancelToken::new(),
        )
        .expect("FX-BIG-D opens");
    let ds = catalog.get("fx_big_d").unwrap();
    assert_eq!(ds.identity().uniqueness().as_str(), "declared-not-verified");
    assert_eq!(ds.identity().verified_rows(), None);
    ds.pin_content(&CancelToken::new()).unwrap();

    let v = viewer();
    let dest = d.join("out");
    let log = d.join("audit.jsonl");
    let req = request(&ds, &v, ViewportQuery::all(), dest.clone());
    publish::preflight(&req).expect("R8: nothing is predicted for an unverified row count");
    let grants = grant_for(&ds, &dest);

    match run_attempt(&log, &req, &grants, "out") {
        Err(BoundaryError::Publish(PublishError::CeilingExceeded {
            ceiling,
            limit,
            saw,
        })) => {
            assert_eq!(ceiling, "MAX_FEATURES");
            assert_eq!(limit, max);
            assert!(saw > max, "saw {saw} must be above the limit {max}");
        }
        other => panic!("R8: expected CeilingExceeded for MAX_FEATURES, got {other:?}"),
    }
    no_side_effect(&d, &dest);

    let records: Vec<serde_json::Value> = std::fs::read_to_string(&log)
        .unwrap()
        .lines()
        .filter(|l| !l.trim().is_empty())
        .map(|l| serde_json::from_str(l).unwrap())
        .collect();
    let intents = records.iter().filter(|r| r["phase"] == "intent").count();
    let outcomes: Vec<&serde_json::Value> =
        records.iter().filter(|r| r["phase"] == "outcome").collect();
    assert_eq!(intents, 1, "R8: one intent record: {records:#?}");
    assert_eq!(outcomes.len(), 1, "R8: one outcome record: {records:#?}");
    assert_eq!(outcomes[0]["outcome"], "refused");
    assert_eq!(outcomes[0]["error_kind"], "CeilingExceeded");

    let _ = std::fs::remove_dir_all(&d);
}
