// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The lasting dataset reference**, end to end: the form's §4 (K1 to K5) against ADR-036 §5
//! (Proposed), with fixtures generated in-test. The reopen runs through `SkpHost::open_dataset`
//! with the reference's own claims, so a claim type that did not match would not compile. Nothing
//! here times anything, and `NoChangeDetected` is never described as "unchanged".

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::{Duration, SystemTime};

use serde_json::Value;
use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode, LV95_PROJJSON,
};
use spatial_engine::{
    CancelToken, Dataset, IdentityDeclaration as EngineDeclaration, ViewportQuery,
};
use spatial_kernel::dataset_ref::{DatasetRef, DatasetUri, RefCheck};
use spatial_kernel::publish::{
    publish_unguarded, CorrespondingSource, CorrespondingSourceKind, PublishRequest, ViewerAsset,
    ViewerAssets, ViewerLicenseInput,
};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_renderer::canonical::to_canonical_string;
use spatial_skp::v0::{CrsAssertion, IdentityDeclaration, OpenDatasetRequest, SKP_VERSION};

const URI: &str = "spatial://dataset/ref/00112233445566778899aabbccddeeff";
const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#336699"},"fill_opacity":{"literal":0.8},"outline_color":{"literal":"#202020"},"outline_width":{"literal":1.0}}}"##;
const SIX: [&str; 6] = [
    "logical_uri",
    "content_hash",
    "source_revision",
    "locators",
    "cache_status",
    "portability_policy",
];

fn uri() -> DatasetUri {
    URI.parse().expect("a well-formed reference URI")
}

/// F1: 500 features, declared LV95, native `id`.
fn f1() -> FixtureSpec {
    FixtureSpec {
        features: 500,
        avg_vertices: 12,
        ..Default::default()
    }
}

/// F2: no CRS declared, a key column other than `id`, no `id`.
fn f2() -> FixtureSpec {
    FixtureSpec {
        features: 40,
        avg_vertices: 6,
        hole_every: 0,
        crs_mode: CrsMode::AbsentKey,
        identity: IdentityMode::ForeignKeyColumn,
        ..Default::default()
    }
}

fn write(name: &str, spec: &FixtureSpec) -> PathBuf {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/dataset-ref");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("write fixture");
    path
}

fn set_mtime(path: &Path, at: SystemTime) {
    let f = std::fs::File::options()
        .write(true)
        .open(path)
        .expect("reopen to set mtime");
    f.set_modified(at).expect("set mtime");
}

fn host() -> SkpHost {
    SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    )
}

fn text_of(r: &DatasetRef) -> String {
    to_canonical_string(&r.to_json()).expect("canonical text")
}

/// Assert that `names` occur as keys in this order after `"object":{` in canonical text.
fn in_file_order(text: &str, object: &str, names: &[&str]) {
    let mut at = text
        .find(&format!("\"{object}\":{{"))
        .expect("the object is present");
    for name in names {
        let found = text[at..]
            .find(&format!("\"{name}\":"))
            .unwrap_or_else(|| panic!("{name} out of order"));
        at += found + 1;
    }
}

fn key_set(v: &Value) -> Vec<&str> {
    let mut keys: Vec<&str> = v
        .as_object()
        .expect("an object")
        .keys()
        .map(String::as_str)
        .collect();
    keys.sort_unstable();
    keys
}

/// **K1.** The reference's `resource` is the bundle's ResourceRef vocabulary and not a second
/// model: the same six members in the same order, the same named-state shape and the same locator
/// shape, compared with what a real `publish_unguarded` wrote.
///
/// Mutation: the writer renames `portability_policy`. Expected failure:
/// `the_reference_uses_the_bundles_resource_ref_vocabulary` fails on the reference's member-order
/// assertion.
#[test]
fn the_reference_uses_the_bundles_resource_ref_vocabulary() {
    let spec = FixtureSpec {
        attributes: AttributeMode::CategoricalZone,
        ..f1()
    };
    let path = write("k1", &spec);
    let ds = Dataset::open(&path).expect("opens");
    ds.pin_content(&CancelToken::new()).expect("pins");
    let dest = path.with_extension("bundle");
    let _ = std::fs::remove_dir_all(&dest);
    let asset = |path: &str, bytes: &[u8]| ViewerAsset {
        path: path.into(),
        bytes: bytes.to_vec(),
    };
    let viewer = ViewerAssets::new(vec![
        asset("index.html", b"<!doctype html><title>t</title>"),
        asset("app.js", b"export const ok = 1;\n"),
        asset("NOTICE.txt", b"stub notice\n"),
    ])
    .expect("viewer assets");
    let finish: fn() -> String = || "2026-10-08T00:00:01Z".to_string();
    let request = PublishRequest {
        dataset: &ds,
        dataset_name: "parcels",
        query: ViewportQuery::all(),
        attributes: vec!["zone".into()],
        style_source: STYLE,
        viewer: &viewer,
        viewer_license: ViewerLicenseInput {
            program: "Spatial IDE bundle viewer".into(),
            copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors"
                .into(),
            license: "AGPL-3.0-or-later".into(),
            notice_path: "NOTICE.txt".into(),
            corresponding_source: CorrespondingSource {
                kind: CorrespondingSourceKind::Url,
                at: "https://example.invalid/spatial-ide".into(),
            },
        },
        license: None,
        destination: dest.clone(),
        started_at: "2026-10-08T00:00:00Z".into(),
        finished_at: &finish,
    };
    publish_unguarded(&request, &CancelToken::new(), None).expect("publishes");
    let manifest_text = std::fs::read_to_string(dest.join("manifest.json")).expect("manifest");
    let manifest: Value = serde_json::from_str(&manifest_text).expect("JSON");

    let text = text_of(&DatasetRef::linked(uri(), &ds).expect("builds"));
    let entry: Value = serde_json::from_str(&text).expect("JSON");
    let (bundle_source, resource) = (&manifest["source"], &entry["resource"]);

    let mut six = SIX.to_vec();
    six.sort_unstable();
    assert_eq!(key_set(bundle_source), six, "the bundle's own members");
    assert_eq!(
        key_set(resource),
        six,
        "the reference holds those members and no seventh"
    );
    in_file_order(&manifest_text, "source", &SIX);
    in_file_order(&text, "resource", &SIX);
    assert_eq!(key_set(&entry), ["admission", "observed", "resource"]);

    // A member that is not known is the same named state in both, and the bundle's own word for a
    // revision it does not pin.
    let (bundle_rev, rev) = (
        &bundle_source["source_revision"],
        &resource["source_revision"],
    );
    assert_eq!(key_set(bundle_rev), ["basis", "state"]);
    assert_eq!(key_set(rev), ["basis", "state"]);
    assert_eq!(bundle_rev["state"], rev["state"]);
    assert_eq!(key_set(&resource["content_hash"]), ["basis", "state"]);
    assert_eq!(resource["content_hash"]["state"], "not-taken");

    // The locator has the bundle's two members.
    assert_eq!(key_set(&bundle_source["locators"][0]), ["at", "kind"]);
    assert_eq!(key_set(&resource["locators"][0]), ["at", "kind"]);
    assert_eq!(resource["locators"][0]["kind"], "machine-recorded");
    assert_eq!(resource["locators"][0]["at"], URI);
}

/// **K2.** The seam, end to end. A reference is built from a real `SkpHost::open_dataset` over a
/// file that declares no CRS and no `id`, read back from its text, and its claims are passed
/// unconverted into a second `OpenDatasetRequest`. The reopened dataset reports no change
/// detected.
///
/// Mutation: the writer omits `crs_assertion` (always `null`). Expected failure:
/// `a_reference_survives_a_reopen_through_open_dataset_and_reports_no_change_detected` fails on
/// the recorded assertion.
#[test]
fn a_reference_survives_a_reopen_through_open_dataset_and_reports_no_change_detected() {
    let path = write("k2", &f2());
    let host = host();
    let open = |cancel_key: &str, crs: Option<CrsAssertion>, id: Option<IdentityDeclaration>| {
        let request = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: path.display().to_string(),
            cancel_key: cancel_key.to_string(),
            crs_assertion: crs,
            identity: id,
        };
        let opened = host.open_dataset(request).expect("open");
        host.catalog()
            .get(opened.dataset.as_str())
            .expect("in the catalog")
    };
    let assertion = CrsAssertion {
        identifier: "EPSG:2056".to_string(),
        definition_json: LV95_PROJJSON.to_string(),
    };
    let declaration = IdentityDeclaration {
        column: "parcel_key".to_string(),
    };
    let first = open("k2-first", Some(assertion), Some(declaration));

    let built = DatasetRef::linked(uri(), &first).expect("a reference is built");
    let recorded = built.admission();
    let asserted = recorded
        .crs_assertion
        .as_ref()
        .expect("the assertion is recorded");
    assert_eq!(asserted.identifier, "EPSG:2056");
    assert_eq!(asserted.definition_json, LV95_PROJJSON);
    assert_eq!(
        recorded.identity.as_ref().map(|i| i.column.as_str()),
        Some("parcel_key")
    );

    // The text is what a project file would hold, and the host's attribution is not in it.
    let text = text_of(&built);
    let (by, at) = (first.crs().asserted_by(), first.crs().asserted_at());
    let (by, at) = (
        by.expect("a claimant was minted"),
        at.expect("a time was minted"),
    );
    assert!(
        !text.contains(by) && !text.contains(at),
        "attribution must not be written"
    );

    // Read back from the text alone, then reopen with the parsed claims as they are.
    let read_back = DatasetRef::parse(&serde_json::from_str(&text).expect("JSON")).expect("parses");
    assert_eq!(text_of(&read_back), text);
    let claims = read_back.admission();
    let second = open(
        "k2-second",
        claims.crs_assertion.clone(),
        claims.identity.clone(),
    );
    assert_eq!(read_back.check(&second), RefCheck::NoChangeDetected);
}

/// **K3.** After the file changes, `check` names each changed component in the descriptor's own
/// vocabulary: none for a reopen of the same file, `mtime` alone for a later modification time,
/// and all four for F1' (1,000 features, an mtime 60 s later).
///
/// Mutation: `check` returns `NoChangeDetected` unconditionally. Expected failure:
/// `a_reopen_after_the_file_changed_names_each_changed_component` fails on its second assertion.
#[test]
fn a_reopen_after_the_file_changed_names_each_changed_component() {
    let path = write("k3", &f1());
    let opened_at = std::fs::metadata(&path).unwrap().modified().unwrap();
    let built = DatasetRef::linked(uri(), &Dataset::open(&path).expect("opens")).expect("builds");
    let differs = |observed: Vec<&'static str>| RefCheck::Differs {
        observed,
        admission: vec![],
    };

    assert_eq!(
        built.check(&Dataset::open(&path).expect("reopens")),
        RefCheck::NoChangeDetected
    );

    set_mtime(&path, opened_at + Duration::from_secs(60));
    assert_eq!(
        built.check(&Dataset::open(&path).expect("reopens")),
        differs(vec!["mtime"])
    );

    let rewritten = FixtureSpec {
        features: 1_000,
        ..f1()
    };
    write_geoparquet(&path, &rewritten).expect("rewrite");
    set_mtime(&path, opened_at + Duration::from_secs(60));
    assert_eq!(
        built.check(&Dataset::open(&path).expect("reopens")),
        differs(vec!["size", "mtime", "footer-length", "footer-hash"])
    );
}

/// **K4.** Two declarations over the same bytes are two identity spaces, so a reopen under another
/// identity declaration is named as an admission difference in both directions, and a reopen under
/// the same one is not. F3 declares a mapping onto the native `id` column: the fixture writer has
/// no second unique key beside `id`.
///
/// Mutation: `check` skips the identity comparison. Expected failure:
/// `a_reopen_under_another_identity_declaration_names_the_admission_difference` fails on its
/// first assertion.
#[test]
fn a_reopen_under_another_identity_declaration_names_the_admission_difference() {
    let path = write("k4", &f1());
    let mapped = || {
        let declared = EngineDeclaration::new("id", "k4-test", "2026-10-08T00:00:00Z");
        Dataset::open_with_declared_identity(&path, declared, &CancelToken::new()).expect("mapped")
    };
    let (mapped_ds, native_ds) = (mapped(), Dataset::open(&path).expect("native"));
    let differs = RefCheck::Differs {
        observed: vec![],
        admission: vec!["identity"],
    };

    let from_mapped = DatasetRef::linked(uri(), &mapped_ds).expect("builds");
    let recorded = from_mapped.admission().identity.as_ref();
    assert_eq!(recorded.map(|i| i.column.as_str()), Some("id"));
    assert_eq!(from_mapped.check(&native_ds), differs);

    let from_native = DatasetRef::linked(uri(), &native_ds).expect("builds");
    assert!(from_native.admission().identity.is_none());
    assert_eq!(from_native.check(&mapped_ds), differs);

    assert_eq!(from_mapped.check(&mapped()), RefCheck::NoChangeDetected);
}

const FORBIDDEN: [&str; 8] = [
    "std::fs",
    "std::io",
    "File",
    "OpenOptions",
    "pin_content",
    "content_hash",
    "ContentPin",
    "acquire(",
];

/// The tokens of `FORBIDDEN` a source names. The one quoted member name the format requires,
/// `"content_hash"`, is removed first: the scan is for the engine's hashing, never quoted.
fn found_in(source: &str) -> Vec<&'static str> {
    let source = source.replace("\"content_hash\"", "");
    FORBIDDEN
        .into_iter()
        .filter(|token| source.contains(token))
        .collect()
}

/// **K5.** The module reads no file, hashes nothing and takes no lease: its source names none of
/// the tokens that would. A source scan, meaningful because it fires on a planted positive control
/// for every token and on the exact mutation below.
///
/// Mutation: `linked` calls `std::fs::metadata(ds.path())`. Expected failure:
/// `the_dataset_reference_module_reads_no_file_hashes_nothing_and_takes_no_lease` fails on the
/// scan of the real source, naming `std::fs`.
#[test]
fn the_dataset_reference_module_reads_no_file_hashes_nothing_and_takes_no_lease() {
    for token in FORBIDDEN {
        let planted = format!("fn planted() {{ let _ = {token}; }}");
        assert_eq!(
            found_in(&planted),
            vec![token],
            "the scan cannot detect {token}"
        );
    }
    assert!(found_in("const K: &str = \"content_hash\";").is_empty());
    let mutated = "fn linked() { let _ = std::fs::metadata(ds.path()); }";
    assert_eq!(found_in(mutated), vec!["std::fs"]);

    let source = include_str!("../src/dataset_ref.rs");
    assert!(
        source.contains("\"content_hash\""),
        "the exclusion above is not vacuous"
    );
    assert_eq!(found_in(source), Vec::<&str>::new());
}
