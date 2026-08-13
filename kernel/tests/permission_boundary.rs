// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The class-3 permission boundary**, against real files and a real audit log.
//!
//! ADR-006's row for external side effects is *audit log · explicit approval · declared
//! reversibility*. Two of the three were owed; these tests are what makes their arrival a property
//! rather than an announcement.
//!
//! ## Every test drives the real boundary
//!
//! No mock log, no fake filesystem. Each case points `SPATIAL_IDE_AUDIT_LOG` at a file in its own
//! temporary workspace, runs `boundary::execute`, and then **reads the log back off the disk** and
//! parses it. A test that asserted on a record the code handed it would be asserting on the code's
//! intentions; these assert on bytes that were written.
//!
//! ## Determinism, and the two things that would otherwise make these flaky
//!
//! - **The clock is injected.** `PublishAttempt::clock` is a closure, so every `at` in these logs is
//!   a fixed string and a record can be compared exactly.
//! - **The env var is process-global, and the tests are threads.** `std::env::set_var` affects the
//!   whole process, so a per-test `set_var` would race. Every test here holds [`env_lock`] across
//!   its own set-var/run/read window, which is what makes the assertions deterministic.
//!
//!   **What that lock does not do is make `set_var` sound.** This binary also runs DuckDB's thread
//!   pool and other suites concurrently, and `set_var` racing a `getenv` in another thread is the
//!   known platform hazard that later editions make `unsafe` for. Nothing here reads the
//!   environment except the code under test, which runs inside the lock — so the exposure is a
//!   third-party read during the window, not a data race this suite creates. Said plainly rather
//!   than left as "serialized, therefore fine".
//!
//!   `publish_cli.rs` has no such concern: it passes the variable per child through
//!   `Command::env`, which never touches this process's environment.

use std::path::{Path, PathBuf};
use std::sync::{Mutex, MutexGuard, OnceLock};
use std::time::Duration;

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::permission::{
    boundary, ApprovalSource, AuditError, AuditLog, BoundaryError, DestinationScope, GrantSet,
    OperationKind, PermissionError, PreNamedApproval, Principal, PrincipalKind, PublishAttempt,
    PublishGrant, RefusalReason, SourceScope, AUDIT_LOG_ENV,
};
use spatial_kernel::publish::{
    CorrespondingSource, CorrespondingSourceKind, PublishPhase, PublishProgress, PublishRequest,
    ViewerAsset, ViewerAssets, ViewerLicenseInput,
};

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

/// Serializes the set-var → run → read window. See the module docs.
fn env_lock() -> MutexGuard<'static, ()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(())).lock().unwrap_or_else(|e| e.into_inner())
}

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-permission-tests").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    std::fs::canonicalize(&d).unwrap()
}

fn fixture(dir: &Path) -> PathBuf {
    let path = dir.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 200,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .unwrap();
    path
}

fn pinned(path: &Path) -> Dataset {
    let ds = Dataset::open(path).unwrap();
    ds.pin_content(&CancelToken::new()).unwrap();
    ds
}

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
        ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
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

const FIXED_CLOCK: &str = "2026-08-07T12:00:00Z";
fn clock() -> String {
    FIXED_CLOCK.to_string()
}

fn request<'a>(
    ds: &'a Dataset,
    v: &'a ViewerAssets,
    destination: PathBuf,
) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: ViewportQuery { bbox: None, bbox_crs: None, limit: None, filter: None },
        attributes: vec!["zone".to_string()],
        style_source: STYLE,
        viewer: v,
        viewer_license: viewer_license(),
        license: None,
        destination,
        started_at: "2026-08-07T12:00:00Z".into(),
        finished_at: &clock,
    }
}

fn principal() -> Principal {
    Principal { kind: PrincipalKind::OsUser, id: "test-operator".into() }
}

/// A grant covering exactly this dataset and destination.
fn grant_for(ds: &Dataset, destination: &Path, lifetime: Duration) -> GrantSet {
    let pin = ds.content_pin().expect("the fixture is pinned");
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
            lifetime,
        )
        .unwrap(),
    )
    .unwrap();
    set
}

/// One parsed record. Deliberately a hand-rolled reader over `serde_json`'s `Value` — the log is
/// read back as **text off the disk**, not handed over as a struct.
struct Log(Vec<serde_json::Value>);

impl Log {
    fn read(path: &Path) -> Self {
        let raw = std::fs::read_to_string(path).unwrap_or_default();
        Self(
            raw.lines()
                .filter(|l| !l.trim().is_empty())
                .map(|l| {
                    serde_json::from_str(l)
                        .unwrap_or_else(|e| panic!("audit line is not JSON ({e}): {l}"))
                })
                .collect(),
        )
    }

    fn phase(&self, phase: &str) -> Vec<&serde_json::Value> {
        self.0.iter().filter(|r| r["phase"] == phase).collect()
    }

    /// The single intent and the single outcome, asserting there is exactly one of each.
    ///
    /// Returns owned values so a caller can write `let (i, o) = Log::read(&p).intent_and_outcome();`
    /// without keeping the reader alive — the records are a few hundred bytes and this is a test.
    fn intent_and_outcome(&self) -> (serde_json::Value, serde_json::Value) {
        let i = self.phase("intent");
        let o = self.phase("outcome");
        assert_eq!(i.len(), 1, "expected exactly one intent record, log is {:#?}", self.0);
        assert_eq!(o.len(), 1, "expected exactly one outcome record, log is {:#?}", self.0);
        // Correlated: an outcome that did not name its intent's attempt would be unreadable.
        assert_eq!(i[0]["attempt"], o[0]["attempt"], "intent and outcome are not correlated");
        (i[0].clone(), o[0].clone())
    }
}

/// Run one attempt with the audit log pointed at `log`, holding the env lock across the window.
fn run_attempt(
    log_path: &Path,
    req: &PublishRequest<'_>,
    grants: &GrantSet,
    approval: &dyn ApprovalSource,
    cancel: &CancelToken,
    progress: Option<&dyn PublishProgress>,
) -> Result<spatial_kernel::publish::PublishOutcome, BoundaryError> {
    let _guard = env_lock();
    std::env::set_var(AUDIT_LOG_ENV, log_path);
    let resolved =
        spatial_kernel::permission::grant::resolve_destination(&req.destination).unwrap();
    let audit = AuditLog::open_for(&resolved)?;
    let attempt = PublishAttempt {
        request: req,
        grants,
        approval,
        principal: &principal(),
        audit: &audit,
        clock: &clock,
    };
    boundary::execute(&attempt, cancel, progress)
}

/// Whether any staging directory survives beside the destination.
///
/// The staging name is `.<dest>.staging-<hex>`, so this is what "no side effect" actually means on
/// disk — checking only that the destination is absent would miss a leftover staging directory,
/// which is the more likely failure.
fn no_side_effect(dir: &Path, destination: &Path) {
    assert!(!destination.exists(), "a destination was created: {}", destination.display());
    let leftovers: Vec<String> = std::fs::read_dir(dir)
        .unwrap()
        .filter_map(|e| e.ok())
        .map(|e| e.file_name().to_string_lossy().to_string())
        .filter(|n| n.contains(".staging-"))
        .collect();
    assert!(leftovers.is_empty(), "staging directories survived: {leftovers:?}");
}

// ---- 1. no grant --------------------------------------------------------------------------------

/// **Required test 1.** No grant → typed refusal, no side effect, no staging directory, and the
/// audit shows intent + refusal.
#[test]
fn without_a_grant_the_publish_is_refused_audited_and_leaves_nothing_behind() {
    let d = workspace("no-grant");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let log = d.join("audit.jsonl");

    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &GrantSet::new(),
        &PreNamedApproval("out".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap_err();

    assert!(
        matches!(e, BoundaryError::Permission(PermissionError::NoGrant { .. })),
        "expected a typed NoGrant refusal, got {e:?}"
    );
    no_side_effect(&d, &dest);

    let l = Log::read(&log);
    let (intent, outcome) = l.intent_and_outcome();
    // **The intent is recorded even though nothing was authorized.** This is the property that
    // makes the log an audit rather than a success ledger.
    assert_eq!(intent["operation"], "publish-static-bundle");
    assert_eq!(intent["class"], 3);
    assert_eq!(intent["reversibility"], "irreversible");
    assert_eq!(intent["at"], FIXED_CLOCK);
    assert_eq!(outcome["outcome"], "refused");
    assert_eq!(outcome["error_kind"], "NoGrant");
    // No grant was found, so there is no grantor to name — and the member is null rather than absent.
    assert!(outcome["grantor_name"].is_null());
}

// ---- 2. scope mismatch --------------------------------------------------------------------------

/// **Required test 2.** A grant whose scope does not match — wrong content hash, or wrong
/// destination — is refused and audited. Both halves are exercised, because they are two different
/// predicates and a check that only compared one would pass this test with the other missing.
#[test]
fn a_grant_scoped_to_another_source_or_another_destination_is_refused_and_audited() {
    let d = workspace("scope-mismatch");
    let ds = pinned(&fixture(&d));
    let v = viewer();

    // (a) right destination, wrong source hash.
    let dest = d.join("out-a");
    let log = d.join("audit-a.jsonl");
    let mut wrong_hash = GrantSet::new();
    wrong_hash
        .add(
            PublishGrant::new(
                OperationKind::Publish,
                SourceScope {
                    dataset_name: "parcels".into(),
                    content_hash: "sha256:0000000000000000000000000000000000000000000000000000000000000000".into(),
                },
                DestinationScope::exact(&dest).unwrap(),
                principal(),
                Duration::from_secs(60),
            )
            .unwrap(),
        )
        .unwrap();

    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &wrong_hash,
        &PreNamedApproval("out-a".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap_err();
    match &e {
        BoundaryError::Permission(PermissionError::GrantScopeMismatch { detail }) => {
            assert!(detail.contains("source hashes"), "detail was {detail:?}");
        }
        other => panic!("expected a scope mismatch on the source hash, got {other:?}"),
    }
    no_side_effect(&d, &dest);
    let (_, outcome) = Log::read(&log).intent_and_outcome();
    assert_eq!(outcome["error_kind"], "GrantScopeMismatch");

    // (b) right source, wrong destination — the grant names a sibling.
    let dest = d.join("out-b");
    let log = d.join("audit-b.jsonl");
    let elsewhere = grant_for(&ds, &d.join("somewhere-else"), Duration::from_secs(60));
    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &elsewhere,
        &PreNamedApproval("out-b".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap_err();
    match &e {
        BoundaryError::Permission(PermissionError::GrantScopeMismatch { detail }) => {
            assert!(detail.contains("resolves to"), "detail was {detail:?}");
        }
        other => panic!("expected a scope mismatch on the destination, got {other:?}"),
    }
    no_side_effect(&d, &dest);
    let (_, outcome) = Log::read(&log).intent_and_outcome();
    assert_eq!(outcome["error_kind"], "GrantScopeMismatch");
}

// ---- 3. expired grant ---------------------------------------------------------------------------

/// **Required test 3.** An expired grant is refused as *expired* — not as a mismatch — and audited.
#[test]
fn an_expired_grant_is_refused_as_expired_and_audited() {
    let d = workspace("expired");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let log = d.join("audit.jsonl");

    let grants = grant_for(&ds, &dest, Duration::from_millis(1));
    std::thread::sleep(Duration::from_millis(10));

    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &grants,
        &PreNamedApproval("out".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap_err();

    assert!(
        matches!(e, BoundaryError::Permission(PermissionError::GrantExpired { .. })),
        "expected GrantExpired, got {e:?}"
    );
    no_side_effect(&d, &dest);
    let (_, outcome) = Log::read(&log).intent_and_outcome();
    assert_eq!(outcome["error_kind"], "GrantExpired");
}

// ---- 4. approval ---------------------------------------------------------------------------------

/// **Required test 4.** Approval refused, the wrong destination named, and end-of-input each refuse
/// with no side effect and an audit trail.
///
/// The interactive path gets its own coverage here by driving `ApprovalSource` directly — the trait
/// is the seam, so a scripted source exercises exactly the code an operator's answer reaches, with
/// no dependency on a terminal.
#[test]
fn approval_refused_wrong_name_or_eof_each_refuse_audited_and_without_side_effect() {
    /// An approval source that answers whatever it was told to, or reports EOF.
    struct Scripted(Option<&'static str>);
    impl ApprovalSource for Scripted {
        fn respond(
            &self,
            prompt: &spatial_kernel::permission::ApprovalPrompt,
        ) -> Result<spatial_kernel::permission::Approval, PermissionError> {
            match self.0 {
                Some(answer) => Ok(spatial_kernel::permission::Approval::new(answer)),
                None => Err(PermissionError::ApprovalRefused {
                    reason: RefusalReason::Eof,
                    expected: prompt.confirmation_phrase.clone(),
                }),
            }
        }
        fn route(&self) -> spatial_kernel::permission::audit::ApprovalRoute {
            spatial_kernel::permission::audit::ApprovalRoute::Interactive
        }
    }

    let d = workspace("approval");
    let ds = pinned(&fixture(&d));
    let v = viewer();

    for (case, source, expected_reason) in [
        // A bare `y` is the reflex the named confirmation exists to defeat.
        ("bare-yes", Scripted(Some("y")), RefusalReason::NotMatched),
        // The right shape, the wrong destination — a stale script.
        ("wrong-name", Scripted(Some("some-other-bundle")), RefusalReason::NotMatched),
        // Nothing at all.
        ("eof", Scripted(None), RefusalReason::Eof),
    ] {
        let dest = d.join(format!("out-{case}"));
        let log = d.join(format!("audit-{case}.jsonl"));
        let grants = grant_for(&ds, &dest, Duration::from_secs(60));

        let e = run_attempt(
            &log,
            &request(&ds, &v, dest.clone()),
            &grants,
            &source,
            &CancelToken::new(),
            None,
        )
        .unwrap_err();

        match &e {
            BoundaryError::Permission(PermissionError::ApprovalRefused { reason, .. }) => {
                assert_eq!(*reason, expected_reason, "{case}");
            }
            other => panic!("{case}: expected ApprovalRefused, got {other:?}"),
        }
        no_side_effect(&d, &dest);

        let (_, outcome) = Log::read(&log).intent_and_outcome();
        assert_eq!(outcome["error_kind"], "ApprovalRefused", "{case}");
        // The grant *was* found before the prompt, so the record names its grantor — which is what
        // distinguishes "refused at approval" from "refused at the grant" when reading the log.
        assert_eq!(outcome["grantor_name"], "test-operator", "{case}");
        assert_eq!(outcome["approval_route"], "interactive", "{case}");
    }
}

// ---- 5. the happy path ---------------------------------------------------------------------------

/// **Required test 5.** Granted and approved → the publish succeeds, and the audit shows intent plus
/// a success carrying the manifest hash.
#[test]
fn granted_and_approved_publishes_and_records_a_success_with_the_manifest_hash() {
    let d = workspace("success");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let log = d.join("audit.jsonl");
    let grants = grant_for(&ds, &dest, Duration::from_secs(60));

    let outcome = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &grants,
        &PreNamedApproval("out".into()),
        &CancelToken::new(),
        None,
    )
    .expect("a granted, approved publish succeeds");

    assert!(dest.join("manifest.json").exists());

    let l = Log::read(&log);
    let (intent, record) = l.intent_and_outcome();
    assert_eq!(record["outcome"], "success");
    assert_eq!(record["approval_route"], "flag");
    assert_eq!(record["rows"], outcome.rows);
    assert_eq!(record["operation_digest"], outcome.operation_digest);

    // **The manifest hash is over the bytes on disk**, not over anything the operation reported —
    // so it is recomputed here from the file and compared.
    let manifest = std::fs::read(dest.join("manifest.json")).unwrap();
    let expected = spatial_renderer::canonical::sha256_hex(&manifest);
    assert_eq!(record["manifest_hash"], expected);

    // The intent's source hash is the dataset's real pin, and the two records agree about which
    // attempt they describe.
    assert_eq!(
        intent["source_content_hash"],
        format!("sha256:{}", ds.content_pin().unwrap().hash())
    );
}

// ---- 6. cancellation ------------------------------------------------------------------------------

/// **Required test 6.** A cancel mid-publish leaves the staging directory cleaned (existing
/// behaviour) and the audit showing intent + `cancelled` — not `failed`.
///
/// The distinction matters to whoever reads the log: a cancellation is an operator changing their
/// mind, and filing it as a failure would make the log describe a broken machine.
#[test]
fn a_cancel_mid_publish_cleans_up_and_is_audited_as_cancelled() {
    /// Cancels as soon as the operation starts writing partitions.
    struct CancelOnFirstPartition(CancelToken);
    impl PublishProgress for CancelOnFirstPartition {
        fn phase(&self, phase: PublishPhase) {
            if phase == PublishPhase::WritingPartitions {
                self.0.cancel();
            }
        }
        fn partition_written(&self, _: usize, _: usize, _: u64) {}
    }

    let d = workspace("cancelled");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let log = d.join("audit.jsonl");
    let grants = grant_for(&ds, &dest, Duration::from_secs(60));

    let cancel = CancelToken::new();
    let obs = CancelOnFirstPartition(cancel.clone());
    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &grants,
        &PreNamedApproval("out".into()),
        &cancel,
        Some(&obs),
    )
    .unwrap_err();

    assert!(
        matches!(
            e,
            BoundaryError::Publish(spatial_kernel::publish::PublishError::Cancelled)
        ),
        "expected a cancelled publish, got {e:?}"
    );
    no_side_effect(&d, &dest);

    let (_, outcome) = Log::read(&log).intent_and_outcome();
    assert_eq!(outcome["outcome"], "cancelled");
    assert_eq!(outcome["error_kind"], "Cancelled");
}

// ---- 7. an unwritable log --------------------------------------------------------------------------

/// **Required test 7.** When the audit log cannot be written, the operation refuses **before any
/// side effect exists**.
///
/// Unwritability is constructed portably: the log's parent is a **regular file**, so
/// `create_dir_all` fails on Windows and on Unix alike. `chmod` is deliberately not used — it is a
/// no-op for an administrator on the reference platform, so the test would pass by not testing.
#[test]
fn an_unwritable_audit_log_refuses_before_anything_is_created() {
    let d = workspace("unwritable");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let grants = grant_for(&ds, &dest, Duration::from_secs(60));

    let blocker = d.join("not-a-directory");
    std::fs::write(&blocker, b"this is a file, not a directory\n").unwrap();
    let log = blocker.join("audit.jsonl");

    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &grants,
        &PreNamedApproval("out".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap_err();

    assert!(
        matches!(e, BoundaryError::Audit(AuditError::Unwritable { .. })),
        "expected AuditUnwritable, got {e:?}"
    );
    // The whole point: an unauditable class-3 operation does not run.
    no_side_effect(&d, &dest);
}

/// The log is refused outright when it would land **inside the bundle**, so an audit record can
/// never be redistributed with the artifact it describes (ADR-017 §13).
#[test]
fn an_audit_log_inside_the_destination_is_refused() {
    let d = workspace("log-inside");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let grants = grant_for(&ds, &dest, Duration::from_secs(60));
    let log = dest.join("audit.jsonl");

    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &grants,
        &PreNamedApproval("out".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap_err();

    assert!(
        matches!(e, BoundaryError::Audit(AuditError::LogInsideDestination { .. })),
        "expected LogInsideDestination, got {e:?}"
    );
    no_side_effect(&d, &dest);
}

// ---- 8. redaction on the record ---------------------------------------------------------------------

/// **Required test 8, first half.** A destination under a user-profile path is **normalized** in the
/// record.
///
/// The temporary directory these tests run in is itself under a user-profile root on both reference
/// platforms, so this asserts against a real path rather than a constructed one: the record must
/// carry a token, and must not carry the operator's own home directory.
#[test]
fn a_destination_under_a_user_profile_path_is_normalized_in_the_record() {
    let d = workspace("redaction-path");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let log = d.join("audit.jsonl");
    let grants = grant_for(&ds, &dest, Duration::from_secs(60));

    run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &grants,
        &PreNamedApproval("out".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap();

    let l = Log::read(&log);
    let (intent, _) = l.intent_and_outcome();
    let recorded = intent["destination"].as_str().unwrap();

    assert!(!recorded.contains('\\'), "a backslash survived normalization: {recorded}");
    assert!(recorded.ends_with("/out"), "the destination is unidentifiable: {recorded}");

    // **The token assertion is conditional on a root actually matching, and that is not evasion.**
    // `std::env::temp_dir()` is under a user-profile root on Windows (`%LOCALAPPDATA%\Temp`) and on
    // a macOS or Linux machine with `TMPDIR` set — but a bare Linux runner returns `/tmp`, which is
    // under no profile root at all and which normalization therefore leaves alone by design. An
    // unconditional assertion here would go red on `ubuntu-latest` for a reason unrelated to the
    // property, which is exactly the "matrix entry that is a red build waiting to happen" that
    // `product-ci-rust.yml` declines to add. So the token is required only where a root exists to
    // match, and the unconditional half of the guarantee is asserted below for every platform.
    let roots = spatial_kernel::permission::audit::normalize::roots_from_environment();
    let under_a_root = roots.iter().any(|(r, _)| {
        let d = dest.to_string_lossy().replace('\\', "/");
        d.to_ascii_lowercase().starts_with(&r.to_ascii_lowercase())
    });
    if under_a_root {
        assert!(
            recorded.starts_with('<'),
            "the destination is under a known user-profile root and was not normalized: {recorded}"
        );
    }

    // And the operator's own username does not appear as a path component anywhere in the record.
    let raw = std::fs::read_to_string(&log).unwrap();
    for key in ["USERNAME", "USER", "LOGNAME"] {
        if let Ok(u) = std::env::var(key) {
            if u.len() >= 3 {
                assert!(
                    !raw.contains(&format!("/{u}/")),
                    "the login name appears as a path component in the log: {u}"
                );
            }
        }
    }
}

/// **Required test 8, second half.** A credential reaching the record **never reaches the log** —
/// the record is refused and the operation does not run.
///
/// **Covered here for one field, the destination**, which is the one an operator could most
/// plausibly get a secret into. The *mechanism* is field-agnostic — `AuditLog::classify` scans the
/// whole rendered line, not a list of members — but no test exercises a second field, so this test
/// claims the destination and the code's own docs claim the rest.
///
/// Both halves are pinned separately, as the bundle redaction tests do: the first asserts that
/// normalization happened, this asserts that the unconditional rule fires. A test that only did the
/// first would pass with the credential check deleted.
#[test]
fn a_credential_in_the_recorded_destination_refuses_before_the_record_is_written() {
    let d = workspace("redaction-credential");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    // The destination is the field an operator could most plausibly get a secret into — a bundle
    // directory named after a token they pasted. `docs/09` makes the rule unconditional, so it
    // fires even though this field is the record's own subject.
    let dest = d.join("out-api_key-SUPERSECRETVALUE");
    let log = d.join("audit.jsonl");
    let grants = grant_for(&ds, &dest, Duration::from_secs(60));

    let e = run_attempt(
        &log,
        &request(&ds, &v, dest.clone()),
        &grants,
        &PreNamedApproval("out-api_key-SUPERSECRETVALUE".into()),
        &CancelToken::new(),
        None,
    )
    .unwrap_err();

    assert!(
        matches!(e, BoundaryError::Audit(AuditError::CredentialInRecord { .. })),
        "expected CredentialInRecord, got {e:?}"
    );
    no_side_effect(&d, &dest);

    // The log exists (it was opened and probed) and contains **nothing** — the record was refused
    // before the write, not after.
    let raw = std::fs::read_to_string(&log).unwrap_or_default();
    assert!(
        !raw.contains("SUPERSECRETVALUE"),
        "the credential reached the audit log: {raw}"
    );
    assert!(raw.trim().is_empty(), "a record was written despite the refusal: {raw}");
}

// ---- 9. the structural sole-caller proof --------------------------------------------------------------

/// **Required test 9.** The boundary is the only thing in `kernel/src` that reaches the publish
/// operation.
///
/// **Structural, not behavioural**, and that is the point: no test can enumerate the call paths that
/// might exist tomorrow, but a scan over the crate's own source can say that today exactly one file
/// names the entry point. The precedent is `engine/tests/slice.rs`, which scans that crate's source
/// for a boundary property for the same reason.
///
/// **What this establishes and what it does not.** It establishes that no *line of code* in
/// `kernel/src` — including `bin/publish-bundle.rs`, which the walk does cover — names either entry
/// point outside the boundary. Two limits, stated because the assertion invites the stronger
/// reading:
///
/// - It is a **line-oriented text scan**. An aliased import (`use … as go;`), a function pointer,
///   or `publish_prepared (…)` with a space would all defeat it. What makes that acceptable is that
///   the surface is small and the entry points are `pub(crate)`/named-to-warn, not that the scan is
///   airtight.
/// - It says nothing about **external** callers. `publish_unguarded` is `pub` and
///   `kernel/tests/publish.rs` calls it thirty times; that residual is deliberate, is why the
///   function carries that name, and is flagged for the human in `kernel/PERMISSION-BOUNDARY.md`.
#[test]
fn the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate() {
    let src = Path::new(env!("CARGO_MANIFEST_DIR")).join("src");
    let mut offenders: Vec<String> = Vec::new();
    let mut boundary_calls = 0usize;

    let mut stack = vec![src.clone()];
    while let Some(dir) = stack.pop() {
        for entry in std::fs::read_dir(&dir).unwrap() {
            let path = entry.unwrap().path();
            if path.is_dir() {
                stack.push(path);
                continue;
            }
            if path.extension().and_then(|e| e.to_str()) != Some("rs") {
                continue;
            }
            let rel = path.strip_prefix(&src).unwrap().to_string_lossy().replace('\\', "/");
            // `publish/mod.rs` *is* the operation and necessarily names its own functions.
            //
            // **The exclusion is that one file, not the directory.** `starts_with("publish/")`
            // would silently exempt any future file added under `publish/`, which is the one place
            // a new caller is most likely to appear.
            if rel == "publish/mod.rs" {
                continue;
            }
            let text = std::fs::read_to_string(&path).unwrap();
            for (n, line) in text.lines().enumerate() {
                // Comments and doc comments name these functions freely — this cut's whole
                // documentation does — so line comments are skipped.
                //
                // **Only `//`, and deliberately not `*`.** Skipping lines that begin with `*`
                // would exempt block-comment continuations, and it would *also* exempt
                // `*slot = publish_prepared(…)?;` — valid Rust, not a comment, and invisible to
                // this scan. That is a hole that fails open. The `//` skip fails the safe way: a
                // commented-out mention becomes a false offender, which is noise rather than a
                // silent pass.
                let code = line.trim_start();
                if code.starts_with("//") {
                    continue;
                }
                for needle in ["publish_unguarded(", "publish_prepared("] {
                    if code.contains(needle) {
                        if rel == "permission/boundary.rs" {
                            boundary_calls += 1;
                        } else {
                            offenders.push(format!("{rel}:{}: {}", n + 1, line.trim()));
                        }
                    }
                }
            }
        }
    }

    assert!(
        offenders.is_empty(),
        "the publish operation is reached without passing the permission boundary:\n{}",
        offenders.join("\n")
    );
    // …and the boundary really does call it, so the scan is not passing because the needle is wrong.
    assert!(
        boundary_calls > 0,
        "no call to the publish operation was found in permission/boundary.rs — the scan's needle \
         is stale and this test is asserting nothing"
    );
}

/// **Rotation, the one function in this cut that deletes audit records.**
///
/// It implements a declared ADR-010 rule 6 ceiling and it removes the oldest generation, so leaving
/// it unexercised would mean the retention table in `log.rs` was arithmetic about a code path
/// nothing had ever run. Driven by writing a live log past the ceiling rather than by calling an
/// internal — the trigger is `AuditLog::open_for`, and that is what an operator's next publish does.
#[test]
fn the_log_rotates_at_its_declared_ceiling_and_keeps_exactly_the_declared_generations() {
    use spatial_kernel::permission::audit::{MAX_AUDIT_LOG_BYTES, MAX_AUDIT_LOG_GENERATIONS};

    let d = workspace("rotation");
    let dest = d.join("out");
    let log = d.join("audit.jsonl");
    let gen = |n: u32| d.join(format!("audit.jsonl.{n}"));

    let _guard = env_lock();
    std::env::set_var(AUDIT_LOG_ENV, &log);

    // One generation more than the ceiling keeps, so the oldest must actually be deleted rather
    // than merely renamed off the end.
    for round in 0..=MAX_AUDIT_LOG_GENERATIONS {
        // A file at the ceiling. `open_for` rotates on the *next* open, which is the real trigger.
        std::fs::write(&log, vec![b'x'; MAX_AUDIT_LOG_BYTES as usize]).unwrap();
        // Mark this generation so the shifting can be followed rather than assumed.
        std::fs::write(&log, format!("round-{round}\n")).unwrap();
        let padded = format!("round-{round}\n{}", "x".repeat(MAX_AUDIT_LOG_BYTES as usize));
        std::fs::write(&log, padded).unwrap();

        AuditLog::open_for(&dest).expect("rotation succeeds and the log reopens");
        assert!(log.exists(), "the live log was not recreated after rotation");
        assert!(
            std::fs::metadata(&log).unwrap().len() < MAX_AUDIT_LOG_BYTES,
            "the live log is still at the ceiling, so nothing rotated"
        );
    }

    // Exactly the declared number of generations, and no more.
    for n in 1..=MAX_AUDIT_LOG_GENERATIONS {
        assert!(gen(n).exists(), "generation {n} is missing");
    }
    assert!(
        !gen(MAX_AUDIT_LOG_GENERATIONS + 1).exists(),
        "a generation beyond the declared ceiling survived — retention is not bounded"
    );

    // The oldest surviving generation is the oldest **kept** round, not the oldest ever written:
    // rotation discards, and the test says so rather than only counting files.
    let oldest = std::fs::read_to_string(gen(MAX_AUDIT_LOG_GENERATIONS)).unwrap();
    assert!(
        oldest.starts_with("round-1"),
        "the surviving oldest generation is {:?}; round-0 should have been deleted",
        oldest.lines().next()
    );
}

/// A log below the ceiling is left alone — otherwise "rotate at the ceiling" would be "rotate
/// always", and every publish would start a new generation.
#[test]
fn a_log_below_the_ceiling_is_not_rotated() {
    let d = workspace("no-rotation");
    let dest = d.join("out");
    let log = d.join("audit.jsonl");

    let _guard = env_lock();
    std::env::set_var(AUDIT_LOG_ENV, &log);
    std::fs::write(&log, b"a small existing log\n").unwrap();

    AuditLog::open_for(&dest).unwrap();
    assert!(!d.join("audit.jsonl.1").exists(), "a log below the ceiling was rotated");
    assert_eq!(std::fs::read_to_string(&log).unwrap(), "a small existing log\n");
}

/// The two-phase shape's whole reason for existing: an interrupted attempt leaves an intent with no
/// outcome, which is **readable** as "this started and we do not know how it ended".
///
/// Asserted directly on the log rather than by killing a process, so it is deterministic.
#[test]
fn an_intent_without_an_outcome_is_a_readable_state_not_a_missing_record() {
    let d = workspace("intent-only");
    let dest = d.join("out");
    let log = d.join("audit.jsonl");

    let _guard = env_lock();
    std::env::set_var(AUDIT_LOG_ENV, &log);
    let audit = AuditLog::open_for(&dest).unwrap();
    audit
        .append_intent(&spatial_kernel::permission::audit::IntentRecord {
            attempt: "0123456789abcdef".into(),
            at: FIXED_CLOCK.into(),
            operation: "publish-static-bundle",
            class: 3,
            reversibility: "irreversible",
            principal_kind: "os-user",
            principal_name: "test-operator".into(),
            source_name: "parcels".into(),
            source_content_hash: "sha256:aa".into(),
            destination: "<user-home>/out".into(),
            style_hash: "sha256:bb".into(),
        })
        .unwrap();

    let l = Log::read(&log);
    assert_eq!(l.phase("intent").len(), 1);
    assert_eq!(
        l.phase("outcome").len(),
        0,
        "an interrupted attempt must leave the intent alone, not synthesize an outcome"
    );
}
