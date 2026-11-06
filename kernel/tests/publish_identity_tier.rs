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
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use spatial_kernel::permission::{
    boundary, AuditLog, BoundaryError, DestinationScope, GrantSet, OperationKind, PreNamedApproval,
    Principal, PrincipalKind, PublishAttempt, PublishGrant, SourceScope, AUDIT_LOG_ENV,
};
use spatial_kernel::publish::{
    self, CorrespondingSource, CorrespondingSourceKind, PublishRequest, ViewerAsset, ViewerAssets,
    ViewerLicenseInput,
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
