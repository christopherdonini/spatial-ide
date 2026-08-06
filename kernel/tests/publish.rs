//! The publish operation end to end, against real files.
//!
//! Everything the bundle format *promises* is asserted here against an emitted bundle rather than
//! against the code's intentions: determinism is two publishes compared byte for byte, redaction is
//! a scan over every byte of every emitted file, and "no partial bundle" is a directory listing
//! after a cancel.

use arrow::array::Array as _;
use std::path::{Path, PathBuf};

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::bundle::{self, redaction};
use spatial_kernel::publish::{
    publish, OperatorLicense, PublishError, PublishPhase, PublishProgress, PublishRequest,
    ViewerAsset, ViewerAssets,
};

const STYLE: &str = r##"{
  "style_version": 1,
  "layer": {
    "geometry": "polygon",
    "fill_color": {"match": {
      "column": "zone",
      "cases": [{"when": "residential", "then": "#aa3333"},
                {"when": "industrial",  "then": "#333388"}],
      "on_null": "#888888",
      "on_unmatched": "#cccccc"}},
    "fill_opacity": {"literal": 0.8},
    "outline_color": {"literal": "#202020"},
    "outline_width": {"literal": 1.0}
  }
}"##;

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-publish-tests").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn fixture(dir: &Path, features: usize) -> PathBuf {
    let path = dir.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features,
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
    // Synthetic, deliberately: a Rust test must not need Node to run. The acceptance run points at
    // the real built viewer instead.
    ViewerAssets::new(vec![
        ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
        ViewerAsset { path: "app.js".into(), bytes: b"export const ok = 1;\n".to_vec() },
    ])
    .unwrap()
}

fn request<'a>(
    ds: &'a Dataset,
    viewer: &'a ViewerAssets,
    destination: PathBuf,
) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: ViewportQuery::all(),
        attributes: vec!["zone".into()],
        style_source: STYLE,
        viewer,
        license: None,
        destination,
        // Fixed instants: the operation is a pure function of its inputs, and these reach only the
        // sidecar, which no hash covers.
        started_at: "2026-08-06T09:00:00Z".into(),
        finished_at: "2026-08-06T09:00:01Z".into(),
    }
}

fn read(bundle: &Path, rel: &str) -> Vec<u8> {
    std::fs::read(bundle.join(rel)).unwrap_or_else(|e| panic!("read {rel}: {e}"))
}

#[test]
fn a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains() {
    let d = workspace("layout");
    let ds = pinned(&fixture(&d, 3_000));
    let v = viewer();
    let dest = d.join("bundle");
    let out = publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap();

    assert!(dest.join(bundle::MANIFEST_PATH).is_file());
    assert!(dest.join(bundle::STYLE_PATH).is_file());
    assert!(dest.join(bundle::BUILD_INFO_PATH).is_file());
    assert!(dest.join("viewer/index.html").is_file());
    assert!(dest.join(bundle::partition_path(0)).is_file());
    assert_eq!(out.rows, 3_000);
    assert!(out.partitions >= 1);
    assert_eq!(out.reproducibility_grade, "Snapshot");

    // Every listed asset exists, is the listed length, and hashes to the listed hash. This is the
    // property the viewer's verification depends on, checked here from the writing side.
    let manifest: serde_json::Value = serde_json::from_slice(&read(&dest, bundle::MANIFEST_PATH)).unwrap();
    let listed: Vec<&serde_json::Value> = manifest["data"]["partitions"]
        .as_array()
        .unwrap()
        .iter()
        .chain(manifest["viewer"].as_array().unwrap())
        .collect();
    assert!(listed.len() >= 3);
    for asset in listed {
        let rel = asset["path"].as_str().unwrap();
        let bytes = read(&dest, rel);
        assert_eq!(bytes.len() as u64, asset["bytes"].as_u64().unwrap(), "{rel} length");
        assert_eq!(
            spatial_renderer::sha256_hex(&bytes),
            asset["content_hash"].as_str().unwrap(),
            "{rel} hash"
        );
    }
    // The style is listed separately, under its own ResourceRef, and hashes too.
    assert_eq!(
        spatial_renderer::sha256_hex(&read(&dest, bundle::STYLE_PATH)),
        manifest["style"]["resource"]["content_hash"].as_str().unwrap()
    );

    // The sidecar is named but NOT hashed and NOT verified — and the manifest says so, so a reader
    // is not left to discover it.
    assert_eq!(manifest["sidecar"]["path"].as_str().unwrap(), bundle::BUILD_INFO_PATH);
    assert_eq!(manifest["sidecar"]["hashed"].as_bool().unwrap(), false);
    assert_eq!(manifest["sidecar"]["verified"].as_bool().unwrap(), false);
}

#[test]
fn publishing_twice_from_identical_inputs_gives_a_byte_identical_manifest() {
    // The acceptance criterion, and the reason the ordering, the fixed partition policy and the
    // canonical number grammar all exist.
    let d = workspace("determinism");
    let src = fixture(&d, 4_000);
    let v = viewer();

    let ds_a = pinned(&src);
    let a = publish(&request(&ds_a, &v, d.join("a")), &CancelToken::new(), None).unwrap();
    // A second *open* as well as a second publish: the manifest must not depend on process state
    // that happens to survive between the two.
    let ds_b = pinned(&src);
    let b = publish(&request(&ds_b, &v, d.join("b")), &CancelToken::new(), None).unwrap();

    let ma = read(&d.join("a"), bundle::MANIFEST_PATH);
    let mb = read(&d.join("b"), bundle::MANIFEST_PATH);
    assert_eq!(ma, mb, "two publishes produced different manifest bytes");
    assert_eq!(a.style_hash, b.style_hash);
    assert_eq!(a.operation_digest, b.operation_digest);
    assert_eq!(a.partitions, b.partitions);

    // …and every partition is byte-identical, which is the thing the manifest's hashes assert.
    for i in 0..a.partitions {
        let rel = bundle::partition_path(i);
        assert_eq!(read(&d.join("a"), &rel), read(&d.join("b"), &rel), "partition {i} differs");
    }
    // The style bytes too.
    assert_eq!(read(&d.join("a"), bundle::STYLE_PATH), read(&d.join("b"), bundle::STYLE_PATH));
}

#[test]
fn the_sidecar_is_what_differs_between_two_publishes_and_it_is_excluded_by_design() {
    // If the wall-clock facts lived in the manifest, the assertion above would be false. This test
    // is the other half of that argument: the values really do differ, and they really are outside
    // every hash.
    let d = workspace("sidecar");
    let src = fixture(&d, 800);
    let v = viewer();

    let ds = pinned(&src);
    let mut req = request(&ds, &v, d.join("a"));
    publish(&req, &CancelToken::new(), None).unwrap();

    req.destination = d.join("b");
    req.started_at = "2027-01-01T00:00:00Z".into();
    req.finished_at = "2027-01-01T00:00:05Z".into();
    publish(&req, &CancelToken::new(), None).unwrap();

    assert_eq!(
        read(&d.join("a"), bundle::MANIFEST_PATH),
        read(&d.join("b"), bundle::MANIFEST_PATH),
        "a timestamp reached the manifest"
    );
    assert_ne!(
        read(&d.join("a"), bundle::BUILD_INFO_PATH),
        read(&d.join("b"), bundle::BUILD_INFO_PATH),
        "the sidecar did not record the instants it exists to record"
    );
}

#[test]
fn the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle() {
    // docs/09, asserted over the artifact rather than over the intention. The scan reads every file
    // including the partitions and the sidecar.
    let d = workspace("redaction");
    let ds = pinned(&fixture(&d, 2_000));
    let v = viewer();
    let dest = d.join("bundle");
    publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap();

    let machine = redaction::MachineIdentifiers::from_environment();
    let findings = redaction::scan_directory(&dest, &machine).unwrap();
    assert!(findings.is_empty(), "redaction findings in the emitted bundle: {findings:#?}");

    // The scan is only meaningful if it *can* fire — a grep that finds nothing because it looks for
    // nothing is not evidence. This is the same directory with one planted string.
    std::fs::write(dest.join("planted.txt"), b"opened C:\\dev\\secret.parquet").unwrap();
    let after = redaction::scan_directory(&dest, &machine).unwrap();
    assert!(
        after.iter().any(|f| f.class == "local-filesystem-path"),
        "the scan cannot detect what it claims to"
    );
}

#[test]
fn cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory() {
    let d = workspace("cancel");
    let ds = pinned(&fixture(&d, 30_000));
    let v = viewer();
    let dest = d.join("bundle");

    // Cancel once the first partitions are on disk, so the cancel lands *during* writing rather
    // than before it starts — the case "no partial output" is actually about.
    struct CancelAfter {
        cancel: CancelToken,
        after: usize,
    }
    impl PublishProgress for CancelAfter {
        fn phase(&self, _: PublishPhase) {}
        fn partition_written(&self, index: usize, _: usize, _: u64) {
            if index + 1 >= self.after {
                self.cancel.cancel();
            }
        }
    }

    let cancel = CancelToken::new();
    let obs = CancelAfter { cancel: cancel.clone(), after: 2 };
    let e = publish(&request(&ds, &v, dest.clone()), &cancel, Some(&obs)).unwrap_err();
    assert!(matches!(e, PublishError::Cancelled), "got {e}");

    assert!(!dest.exists(), "a bundle exists under the destination name after a cancel");
    let leftovers: Vec<String> = std::fs::read_dir(&d)
        .unwrap()
        .map(|e| e.unwrap().file_name().to_string_lossy().to_string())
        .filter(|n| n.contains("staging"))
        .collect();
    assert!(leftovers.is_empty(), "staging directories left behind: {leftovers:?}");
}

#[test]
fn an_existing_destination_is_refused_rather_than_replaced() {
    // ADR-006 class 3: publishing is irreversible, so re-running a command never destroys an
    // already-published bundle. Declared, not discovered.
    let d = workspace("exists");
    let ds = pinned(&fixture(&d, 500));
    let v = viewer();
    let dest = d.join("bundle");
    publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap();

    let before = read(&dest, bundle::MANIFEST_PATH);
    let e = publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap_err();
    assert!(matches!(e, PublishError::DestinationExists { .. }), "got {e}");
    assert_eq!(read(&dest, bundle::MANIFEST_PATH), before, "the existing bundle was touched");
}

#[test]
fn an_unpinned_source_is_refused_before_anything_is_written() {
    let d = workspace("unpinned");
    let ds = Dataset::open(fixture(&d, 200)).unwrap(); // deliberately not pinned
    let v = viewer();
    let dest = d.join("bundle");
    let e = publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap_err();
    assert!(matches!(e, PublishError::SourceNotPinned), "got {e}");
    assert!(!dest.exists());
}

#[test]
fn a_source_that_changed_since_the_pin_is_detected_and_refused() {
    let d = workspace("changed");
    let src = fixture(&d, 400);
    let ds = pinned(&src);

    // Rewrite the file with a different feature count: same path, different bytes.
    write_geoparquet(
        &src,
        &FixtureSpec {
            features: 401,
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        },
    )
    .unwrap();

    let v = viewer();
    let dest = d.join("bundle");
    let e = publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap_err();
    match e {
        PublishError::Engine(spatial_engine::EngineError::SourceChangedUnderPublish {
            detected_by,
            ..
        }) => assert!(detected_by.contains("content hash"), "detected by {detected_by}"),
        other => panic!("got {other}"),
    }
    assert!(!dest.exists());
}

#[test]
fn a_style_whose_match_column_is_not_published_is_refused_at_publish_not_at_view_time() {
    let d = workspace("style-mismatch");
    let ds = pinned(&fixture(&d, 300));
    let v = viewer();
    let mut req = request(&ds, &v, d.join("bundle"));
    req.attributes = vec![]; // `zone` exists in the dataset but is not published
    let e = publish(&req, &CancelToken::new(), None).unwrap_err();
    assert!(
        matches!(
            e,
            PublishError::Style(spatial_renderer::StyleError::MatchColumnNotPublished { .. })
        ),
        "got {e}"
    );
    assert!(!d.join("bundle").exists());
}

#[test]
fn the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact() {
    let d = workspace("manifest-contents");
    let ds = pinned(&fixture(&d, 600));
    let v = viewer();
    let dest = d.join("bundle");
    publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap();
    let m: serde_json::Value = serde_json::from_slice(&read(&dest, bundle::MANIFEST_PATH)).unwrap();

    // Three ResourceRefs, each with all six docs/11 members named.
    for block in [&m["bundle"], &m["source"], &m["style"]["resource"]] {
        for member in [
            "logical_uri",
            "content_hash",
            "source_revision",
            "locators",
            "cache_status",
            "portability_policy",
        ] {
            assert!(!block[member].is_null(), "missing {member} in {block}");
        }
        // An unknown member is a named state carrying its basis, never a bare null.
        if block["source_revision"].is_object() {
            assert!(block["source_revision"]["state"].is_string());
            assert!(block["source_revision"]["basis"].is_string());
        }
    }

    // The decided publishing path, recorded as a fact.
    assert_eq!(m["crs"]["transform"].as_str().unwrap(), "none — rendered in source CRS");
    assert_eq!(m["crs"]["source"].as_str().unwrap(), "EPSG:2056");
    assert_eq!(m["crs"]["display"].as_str().unwrap(), "EPSG:2056");
    assert_eq!(m["crs"]["axis_normalization"].as_str().unwrap(), "none-performed");

    // ADR-016's envelope facts, plus the caveat that says what they do not establish.
    assert_eq!(m["identity"]["id_source"].as_str().unwrap(), "file:id");
    assert_eq!(m["identity"]["id_uniqueness"].as_str().unwrap(), "verified-at-open-full-file");
    assert!(m["identity"]["caveat"].as_str().unwrap().contains("Stability across reopen"));

    // ADR-005: the grade, its basis, and why not higher.
    assert_eq!(m["reproducibility"]["grade"].as_str().unwrap(), "Snapshot");
    assert!(!m["reproducibility"]["basis"].as_array().unwrap().is_empty());
    assert!(m["reproducibility"]["why_not_higher"].as_str().unwrap().contains("Exact"));

    // License, honestly absent — the fixture declares none and nothing is invented.
    assert_eq!(m["license"]["state"].as_str().unwrap(), "not-declared");

    // Bounds computed over published rows, not lifted from the file's covering bbox.
    assert_eq!(m["bounds"]["basis"].as_str().unwrap(), "computed-over-published-rows");

    // The reservations exist in v1 so filling them later is not a format change.
    assert!(m["derived_caches"].as_array().unwrap().is_empty());
    assert_eq!(m["query_surface"]["available"].as_bool().unwrap(), false);

    // The format is declared normatively enough for an independent writer.
    let f = &m["data"]["format"];
    assert_eq!(f["compression"].as_str().unwrap(), "none");
    assert_eq!(f["dictionaries"].as_str().unwrap(), "none");
    assert_eq!(f["framing"].as_str().unwrap(), "arrow-ipc-stream-per-partition");
    assert_eq!(f["partition_boundary_rule"].as_str().unwrap(), "cut-before-append");

    // The operation is carried as data beside its digest, so the digest can be recomputed.
    assert!(m["operation"]["digest"].as_str().unwrap().starts_with("sha256:"));
    assert_eq!(m["operation"]["ordering"].as_str().unwrap(), "identity-ascending");
    assert_eq!(m["operation"]["filter"]["kind"].as_str().unwrap(), "whole-file");
    // Named for what it is: no "SQL", no "intersection".
    let manifest_text = String::from_utf8(read(&dest, bundle::MANIFEST_PATH)).unwrap();
    assert!(!manifest_text.contains("read_parquet"), "generated SQL reached the manifest");
}

#[test]
fn a_filtered_publish_records_the_filter_and_bounds_the_rows_it_actually_wrote() {
    let d = workspace("filtered");
    let ds = pinned(&fixture(&d, 4_000));
    let v = viewer();
    let dest = d.join("bundle");

    let mut req = request(&ds, &v, dest.clone());
    // A quarter-extent-ish viewport in the fixture's own CRS.
    req.query = ViewportQuery::viewport(
        spatial_engine::Bbox {
            xmin: 2_600_000.0,
            ymin: 1_200_000.0,
            xmax: 2_601_000.0,
            ymax: 1_201_000.0,
        },
        "EPSG:2056",
    );
    let out = publish(&req, &CancelToken::new(), None).unwrap();
    assert!(out.rows > 0 && out.rows < 4_000, "the viewport selected {} of 4000", out.rows);

    let m: serde_json::Value = serde_json::from_slice(&read(&dest, bundle::MANIFEST_PATH)).unwrap();
    assert_eq!(
        m["operation"]["filter"]["kind"].as_str().unwrap(),
        "covering-bbox-intersects",
        "the filter must be named for what it is, not called `intersection`"
    );

    // Bounds describe the published rows. The file's own covering bbox spans the whole fixture, so
    // a bundle that lifted bounds from it would open on a mostly-empty map.
    let b = &m["bounds"];
    let (xmin, xmax) = (b["xmin"].as_f64().unwrap(), b["xmax"].as_f64().unwrap());
    assert!(xmin >= 2_600_000.0 - 100.0, "xmin {xmin} looks like the whole file's");
    assert!(xmax < 2_610_000.0, "xmax {xmax} looks like the whole file's");
}

#[test]
fn an_operator_may_declare_a_license_for_a_source_that_declares_none() {
    let d = workspace("operator-license");
    let ds = pinned(&fixture(&d, 300));
    let v = viewer();
    let dest = d.join("bundle");
    let mut req = request(&ds, &v, dest.clone());
    req.license = Some(OperatorLicense {
        license: "CC-BY-4.0".into(),
        attribution: Some("© Example Cadastre".into()),
        redistribution: bundle::Redistribution::Permitted,
        by: "operator".into(),
        at: "2026-08-06T09:00:00Z".into(),
    });
    publish(&req, &CancelToken::new(), None).unwrap();

    let m: serde_json::Value = serde_json::from_slice(&read(&dest, bundle::MANIFEST_PATH)).unwrap();
    // A claim carries its claimant — the crs_source / id_source shape, applied to license.
    assert_eq!(m["license"]["state"].as_str().unwrap(), "declared-by-operator");
    assert_eq!(m["license"]["license"].as_str().unwrap(), "CC-BY-4.0");
    assert_eq!(m["license"]["by"].as_str().unwrap(), "operator");
    assert_eq!(m["license"]["redistribution"].as_str().unwrap(), "permitted");
}

#[test]
fn a_viewer_asset_path_that_escapes_the_bundle_is_refused() {
    let d = workspace("asset-escape");
    let ds = pinned(&fixture(&d, 100));
    let bad = ViewerAssets::new(vec![ViewerAsset {
        path: "../escape.js".into(),
        bytes: b"x".to_vec(),
    }]);
    assert!(matches!(bad, Err(PublishError::ViewerAssetPathRejected { .. })));
    // And a valid set still publishes, so the check is not simply refusing everything.
    let v = viewer();
    publish(&request(&ds, &v, d.join("ok")), &CancelToken::new(), None).unwrap();
}

#[test]
fn every_partition_carries_the_adr_010_rule_1_envelope_and_the_declared_projection() {
    let d = workspace("envelope");
    let ds = pinned(&fixture(&d, 5_000));
    let v = viewer();
    let dest = d.join("bundle");
    let out = publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap();
    assert!(out.partitions > 1, "expected several partitions, got {}", out.partitions);

    // Every one, not just the first: the envelope repeats per partition precisely so a reader that
    // starts anywhere is still told what space the coordinates are in.
    for i in 0..out.partitions {
        let bytes = read(&dest, &bundle::partition_path(i));
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&bytes), None).unwrap();
        let batch = rdr.next().unwrap().unwrap();
        let md = batch.schema().metadata().clone();
        assert_eq!(md.get("frame").unwrap(), spatial_engine::FRAME_AUTHORITATIVE, "partition {i}");
        assert_eq!(md.get("crs").unwrap(), "EPSG:2056");
        assert_eq!(md.get("axis_order").unwrap(), "easting,northing");
        assert_eq!(md.get("attribute_columns").unwrap(), r#"["zone"]"#);
        assert_eq!(batch.schema().field(0).name(), "id");
        assert_eq!(batch.schema().field(2).name(), "zone");
        assert!(batch.schema().field(2).is_nullable(), "a published attribute must carry NULLs");
        // And the stream really is one self-contained IPC stream per partition: one batch, then EOS.
        assert!(rdr.next().is_none(), "partition {i} carries more than one record batch");
    }
}

#[test]
fn ids_ascend_across_partitions_and_the_null_branch_reaches_the_bundle() {
    let d = workspace("ordering-and-nulls");
    let ds = pinned(&fixture(&d, 6_000));
    let v = viewer();
    let dest = d.join("bundle");
    let out = publish(&request(&ds, &v, dest.clone()), &CancelToken::new(), None).unwrap();

    let mut previous: Option<u64> = None;
    let mut saw_null = false;
    let mut saw_value = false;
    for i in 0..out.partitions {
        let bytes = read(&dest, &bundle::partition_path(i));
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&bytes), None).unwrap();
        let batch = rdr.next().unwrap().unwrap();
        let ids = batch
            .column(0)
            .as_any()
            .downcast_ref::<arrow::array::UInt64Array>()
            .unwrap();
        for id in ids.values() {
            if let Some(p) = previous {
                assert!(*id > p, "ids are not ascending across partition {i}");
            }
            previous = Some(*id);
        }
        let zone = batch
            .column(2)
            .as_any()
            .downcast_ref::<arrow::array::StringArray>()
            .unwrap();
        for r in 0..zone.len() {
            if zone.is_null(r) {
                saw_null = true;
            } else {
                saw_value = true;
            }
        }
    }
    assert_eq!(previous, Some(5_999));
    // Both branches the style must declare actually travel, so `on_null` is exercised by a real
    // bundle rather than only by a unit test.
    assert!(saw_null, "no NULL zone reached the bundle");
    assert!(saw_value, "no non-NULL zone reached the bundle");
}
