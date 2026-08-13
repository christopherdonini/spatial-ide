// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The strict reader, driven against real bundles it should accept and real ones it must not.**
//!
//! `kernel/examples/verify-bundle.rs` is the instrument the 5 GB scale pass uses to verify a bundle
//! the reference viewer is specified to refuse (ADR-017 §16's reader ceilings). A verifier that only
//! ever answers "verified" is worse than no verifier at all, so the cases that matter here are the
//! **negative** ones: five corruption classes, each asserted to fail with ADR-017 §14's own named
//! state and a non-zero exit.
//!
//! ## Why this drives the built example as a subprocess
//!
//! The reader is deliberately an `example` and not `src/bin/` or library code — see its module docs.
//! That means no `CARGO_BIN_EXE_*` for it, so the test locates the binary beside its own. The path
//! is derived rather than guessed, and if it is missing the test **fails loudly** rather than
//! skipping: a vacuous pass here would be the exact failure the file exists to prevent.

use std::path::{Path, PathBuf};
use std::process::Command;

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::permission::{
    boundary, AuditLog, DestinationScope, GrantSet, OperationKind, PreNamedApproval, Principal,
    PublishAttempt, PublishGrant, SourceScope, AUDIT_LOG_ENV,
};
use spatial_kernel::publish::{
    CorrespondingSource, CorrespondingSourceKind, PublishRequest, ViewerAsset, ViewerAssets,
    ViewerLicenseInput,
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

/// The built `verify-bundle` example, beside this test binary — building it first if it is absent.
///
/// **The build step is not belt-and-braces; it is required.** A full `cargo test` compiles examples,
/// but `cargo test --test verify_bundle` does not — so without this the file would pass in the suite
/// and fail in isolation, which is the worst of both. The profile is taken from this binary's own
/// path, so a `--release` test run verifies the release example rather than silently checking a
/// debug one.
///
/// **Built at most once per process.** libtest runs these tests in parallel threads; without the
/// `OnceLock` all three raced to invoke cargo, and each blocked on the package lock the others held
/// — turning a 4-second build into an eight-minute test run.
fn verifier() -> PathBuf {
    static BUILT: std::sync::OnceLock<PathBuf> = std::sync::OnceLock::new();
    BUILT.get_or_init(build_verifier).clone()
}

fn build_verifier() -> PathBuf {
    let me = std::env::current_exe().expect("the test binary knows where it is");
    let profile_dir = me
        .parent()
        .and_then(|deps| deps.parent())
        .expect("target/<profile>/deps/<test>");
    let exe = if cfg!(windows) { "verify-bundle.exe" } else { "verify-bundle" };
    let path = profile_dir.join("examples").join(exe);
    if path.exists() {
        return path;
    }

    let release = profile_dir.file_name().and_then(|n| n.to_str()) == Some("release");
    let mut cmd = Command::new(std::env::var("CARGO").unwrap_or_else(|_| "cargo".into()));
    cmd.args(["build", "-p", "spatial-kernel", "--example", "verify-bundle"]);
    if release {
        cmd.arg("--release");
    }
    let out = cmd.output().expect("cargo build --example verify-bundle");
    assert!(
        out.status.success(),
        "could not build the verify-bundle example:\n{}",
        String::from_utf8_lossy(&out.stderr)
    );
    assert!(
        path.exists(),
        "verify-bundle was built but is not at {} — the path derivation is wrong, and this test \
         would otherwise pass vacuously",
        path.display()
    );
    path
}

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-verify-bundle").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    std::fs::canonicalize(&d).unwrap()
}

/// Publish a small real bundle through the class-3 boundary, and return its directory.
fn publish_a_bundle(d: &Path) -> PathBuf {
    let src = d.join("parcels.parquet");
    write_geoparquet(
        &src,
        &FixtureSpec {
            features: 2_000,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            ..Default::default()
        },
    )
    .unwrap();

    let ds = Dataset::open(&src).unwrap();
    ds.pin_content(&CancelToken::new()).unwrap();
    let pin = ds.content_pin().unwrap();

    let viewer = ViewerAssets::new(vec![
        ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
        ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
    ])
    .unwrap();

    let dest = d.join("bundle");
    let clock = || "2026-08-07T12:00:00Z".to_string();
    let req = PublishRequest {
        dataset: &ds,
        dataset_name: "parcels",
        query: ViewportQuery { bbox: None, bbox_crs: None, limit: None, filter: None },
        attributes: vec!["zone".into()],
        style_source: STYLE,
        viewer: &viewer,
        viewer_license: ViewerLicenseInput {
            program: "Spatial IDE bundle viewer".into(),
            copyright: "Copyright (C) 2026 the Spatial IDE contributors".into(),
            license: "AGPL-3.0-or-later".into(),
            notice_path: "NOTICE.txt".into(),
            corresponding_source: CorrespondingSource {
                kind: CorrespondingSourceKind::Url,
                at: "https://example.invalid/spatial-ide".into(),
            },
        },
        license: None,
        destination: dest.clone(),
        started_at: "2026-08-07T12:00:00Z".into(),
        finished_at: &clock,
    };

    let principal = Principal::from_environment();
    let mut grants = GrantSet::new();
    grants
        .add(
            PublishGrant::new(
                OperationKind::Publish,
                SourceScope {
                    dataset_name: "parcels".into(),
                    content_hash: format!("sha256:{}", pin.hash()),
                },
                DestinationScope::exact(&dest).unwrap(),
                principal.clone(),
                std::time::Duration::from_secs(300),
            )
            .unwrap(),
        )
        .unwrap();

    std::env::set_var(AUDIT_LOG_ENV, d.join("audit.jsonl"));
    let audit = AuditLog::open_for(&std::fs::canonicalize(d).unwrap().join("bundle")).unwrap();
    let attempt = PublishAttempt {
        request: &req,
        grants: &grants,
        approval: &PreNamedApproval("bundle".into()),
        principal: &principal,
        audit: &audit,
        clock: &clock,
    };
    boundary::execute(&attempt, &CancelToken::new(), None).expect("the smoke bundle publishes");
    dest
}

/// Run the verifier. Returns (exit ok, combined output).
fn verify(bundle: &Path) -> (bool, String) {
    let out = Command::new(verifier())
        .args(["--bundle", bundle.to_str().unwrap(), "--quiet"])
        .output()
        .expect("run verify-bundle");
    let mut text = String::from_utf8_lossy(&out.stdout).to_string();
    text.push_str(&String::from_utf8_lossy(&out.stderr));
    (out.status.success(), text)
}

fn copy_dir(from: &Path, to: &Path) {
    std::fs::create_dir_all(to).unwrap();
    for entry in std::fs::read_dir(from).unwrap() {
        let e = entry.unwrap();
        let dst = to.join(e.file_name());
        if e.path().is_dir() {
            copy_dir(&e.path(), &dst);
        } else {
            std::fs::copy(e.path(), dst).unwrap();
        }
    }
}

/// A bundle straight from the publisher verifies, and exits zero.
#[test]
fn a_real_bundle_verifies() {
    let d = workspace("accepts");
    let bundle = publish_a_bundle(&d);
    let (ok, text) = verify(&bundle);
    assert!(ok, "a freshly published bundle failed verification:\n{text}");
}

/// **The five corruption classes, each with ADR-017 §14's own state name.**
///
/// These are the reason this file exists. Each mutation is applied to its own copy of a real
/// bundle, so one case cannot mask another, and each asserts both the non-zero exit *and* the
/// specific state — a verifier that failed for the wrong reason would be reporting noise.
#[test]
fn every_corruption_class_is_caught_with_its_declared_state() {
    let d = workspace("rejects");
    let bundle = publish_a_bundle(&d);

    struct Case {
        name: &'static str,
        state: &'static str,
        mutate: fn(&Path),
    }

    let cases = [
        Case {
            name: "a flipped byte inside a partition",
            state: "asset-hash-mismatch",
            mutate: |b| {
                let p = b.join("data/part-00000.arrows");
                let mut bytes = std::fs::read(&p).unwrap();
                let mid = bytes.len() / 2;
                bytes[mid] ^= 0xFF;
                std::fs::write(&p, bytes).unwrap();
            },
        },
        Case {
            name: "a truncated partition",
            state: "partition-byte-count-mismatch",
            mutate: |b| {
                let p = b.join("data/part-00001.arrows");
                let bytes = std::fs::read(&p).unwrap();
                std::fs::write(&p, &bytes[..bytes.len() - 100]).unwrap();
            },
        },
        Case {
            name: "a missing partition file",
            state: "asset-missing",
            mutate: |b| std::fs::remove_file(b.join("data/part-00001.arrows")).unwrap(),
        },
        Case {
            name: "a manifest whose row count no longer matches its partitions",
            state: "partition-row-count-mismatch",
            mutate: |b| {
                let p = b.join("manifest.json");
                let s = std::fs::read_to_string(&p).unwrap().replace("\"rows\":2000", "\"rows\":1999");
                std::fs::write(&p, s).unwrap();
            },
        },
        Case {
            name: "a tampered style document",
            state: "asset-hash-mismatch",
            mutate: |b| {
                let p = b.join("style.json");
                let s = std::fs::read_to_string(&p).unwrap().replace("0.8", "0.7");
                std::fs::write(&p, s).unwrap();
            },
        },
    ];

    for (i, case) in cases.iter().enumerate() {
        let copy = d.join(format!("corrupt-{i}"));
        copy_dir(&bundle, &copy);
        (case.mutate)(&copy);

        let (ok, text) = verify(&copy);
        assert!(!ok, "{}: the verifier accepted a corrupt bundle\n{text}", case.name);
        assert!(
            text.contains(case.state),
            "{}: expected state `{}`, got:\n{text}",
            case.name,
            case.state
        );
    }
}

/// An unreachable or unparseable manifest is refused before anything else is read.
#[test]
fn a_missing_or_unparseable_manifest_is_refused_by_name() {
    let d = workspace("manifest");
    let bundle = publish_a_bundle(&d);

    let gone = d.join("no-manifest");
    copy_dir(&bundle, &gone);
    std::fs::remove_file(gone.join("manifest.json")).unwrap();
    let (ok, text) = verify(&gone);
    assert!(!ok);
    assert!(text.contains("manifest-unreachable"), "{text}");

    let broken = d.join("bad-manifest");
    copy_dir(&bundle, &broken);
    std::fs::write(broken.join("manifest.json"), b"{not json").unwrap();
    let (ok, text) = verify(&broken);
    assert!(!ok);
    assert!(text.contains("manifest-unparseable"), "{text}");
}
