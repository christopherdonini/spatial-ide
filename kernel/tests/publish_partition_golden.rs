// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! G-2: the published partitions and manifest of a Polygon-only dataset, pinned by a golden file
//! computed before any MultiPolygon code exists (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` §6,
//! the publish half; §4's G-2 row).
//!
//! **What this proves, and no further.** The same test, green at the head of the MP-1 branch, proves
//! that publishing the fixture below still writes the same manifest bytes and the same partition
//! bytes (ADR-034's first Consequence). It is a golden file and not two runs compared at one
//! revision, which is what `publishing_twice_from_identical_inputs_gives_a_byte_identical_manifest`
//! already is. A moved partition cut shows here as a changed partition count or hash, because
//! partition boundaries are a function of the engine's batch-size estimate.
//!
//! **Real shape (the seam rule).** The fixture is the one `kernel/tests/publish.rs`'s own `fixture`
//! helper writes (its spec, restated below, with a categorical `zone` column), opened and published
//! through `publish_unguarded` with the same style, viewer stub and request shape. Every number is
//! read from the bundle on disk.
//!
//! The golden file is `kernel/tests/data/golden/publish-partitions.golden`. It was computed at the
//! golden commit, which adds this file and the engine half (`engine/tests/polygon_wire_golden.rs`)
//! and no product line. A mismatch prints the computed text in full.

use std::path::{Path, PathBuf};

use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode,
};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::bundle;
use spatial_kernel::publish::{
    publish_unguarded, CorrespondingSource, CorrespondingSourceKind, PublishRequest, ViewerAsset,
    ViewerAssets, ViewerLicenseInput,
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
    let d = std::env::temp_dir()
        .join("spatial-kernel-publish-partition-golden")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn sha256_file(path: &Path) -> String {
    let bytes = std::fs::read(path).expect("read for hashing");
    spatial_renderer::sha256_hex(&bytes)
}

/// `kernel/tests/publish.rs`'s `fixture`, restated: the same spec, so the file is the same file.
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

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset {
            path: "index.html".into(),
            bytes: b"<!doctype html><title>t</title>".to_vec(),
        },
        ViewerAsset {
            path: "app.js".into(),
            bytes: b"export const ok = 1;\n".to_vec(),
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
        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://example.invalid/spatial-ide".into(),
        },
    }
}

fn fixed_finish() -> String {
    "2026-08-06T09:00:01Z".to_string()
}
static FIXED_FINISH: fn() -> String = fixed_finish;

fn computed() -> String {
    let dir = workspace("g2");
    let src = fixture(&dir, 4_000);
    let fixture_before = sha256_file(&src);

    let ds = Dataset::open(&src).unwrap();
    ds.pin_content(&CancelToken::new()).unwrap();
    let v = viewer();
    let dest = dir.join("bundle");
    let out = publish_unguarded(
        &PublishRequest {
            dataset: &ds,
            dataset_name: "parcels",
            query: ViewportQuery::all(),
            attributes: vec!["zone".into()],
            style_source: STYLE,
            viewer: &v,
            viewer_license: viewer_license(),
            license: None,
            destination: dest.clone(),
            started_at: "2026-08-06T09:00:00Z".into(),
            finished_at: &FIXED_FINISH,
        },
        &CancelToken::new(),
        None,
    )
    .unwrap();

    let mut lines: Vec<String> = Vec::new();
    lines.push(format!("fixture.sha256 = {fixture_before}"));
    let manifest = std::fs::read(dest.join(bundle::MANIFEST_PATH)).unwrap();
    lines.push(format!("manifest.bytes = {}", manifest.len()));
    lines.push(format!(
        "manifest.sha256 = {}",
        spatial_renderer::sha256_hex(&manifest)
    ));
    lines.push(format!("rows = {}", out.rows));
    lines.push(format!("partitions = {}", out.partitions));
    for i in 0..out.partitions {
        let rel = bundle::partition_path(i);
        let bytes = std::fs::read(dest.join(&rel)).unwrap();
        lines.push(format!(
            "partition.{i} = bytes:{} {}",
            bytes.len(),
            spatial_renderer::sha256_hex(&bytes)
        ));
    }
    assert_eq!(
        sha256_file(&src),
        fixture_before,
        "the fixture file changed during the publish"
    );
    let mut text = lines.join("\n");
    text.push('\n');
    text
}

// RECORDED MUTATION (observed on the uncommitted tree over `ff6bdddc`, the branch base, with the
// golden files as the only change; a golden commit cannot name its own id): in
// `engine/src/stream.rs::estimate_bytes`, change `rows * 8` to `rows * 9`. The partition cuts
// move, and `the_published_partitions_and_manifest_match_the_golden_file` fails by name. §4's own
// mutation for this row (select MultiPolygon for `[Polygon]`) needs code the golden commit does
// not have; it is observed in the engine commit and recorded there.
#[test]
fn the_published_partitions_and_manifest_match_the_golden_file() {
    let got = computed();
    let golden = include_str!("data/golden/publish-partitions.golden").replace("\r\n", "\n");
    assert_eq!(
        got, golden,
        "the published bytes of a Polygon-only dataset moved (preregistration §5 invalidator I-2 at \
         the head, I-1 at the golden commit). Computed text:\n{got}"
    );
}
