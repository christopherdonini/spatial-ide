// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! T12 of `engine/LOD-PREREGISTRATION.md` §4, added by §10 Amendment 6 (the human's ruling of
//! 2026-09-16): **the free-disk preflight runs before the first tier is written.**
//!
//! **Its own test binary, because it sets `LOCALAPPDATA` for the process.** The tier root is read
//! from that variable, so pointing it at a volume that does not exist is how "no free space" is
//! injected without a second filesystem; a process-global env write cannot share a binary with
//! tests that build real tiers. Cargo runs test binaries one after another.
//!
//! The preflight's *comparison* half is a unit test beside the code
//! (`the_preflight_fails_closed_when_free_space_is_unknown`, `engine/src/lod.rs`); this file is the
//! end-to-end half, from the real `Dataset` shape.

use std::path::{Path, PathBuf};

use arrow::array::{ArrayRef, BinaryBuilder, StructArray, UInt64Builder};
use arrow::datatypes::{DataType, Field, Fields, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::basic::Compression;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

use spatial_engine::cancel::CancelToken;
use spatial_engine::dataset::Dataset;
use spatial_engine::error::EngineError;
use spatial_engine::lod::{
    build_tiers, set_hard_bound_bytes, LOD_BUILD_WORKERS_ARM_S, LOD_INSUFFICIENT_DISK,
};

/// A drive letter with no volume behind it, established at run time rather than assumed. The
/// preflight's free-space reading fails on such a path, which is the "no free space" injection.
fn absent_volume() -> PathBuf {
    for letter in ['Z', 'Y', 'X', 'W', 'V'] {
        let root = PathBuf::from(format!("{letter}:\\"));
        if !root.exists() {
            return root.join("spatial-ide-lod-preflight");
        }
    }
    panic!("every candidate drive letter exists on this machine; this test needs one that does not");
}

fn bbox_fields() -> Fields {
    Fields::from(vec![
        Field::new("xmin", DataType::Float64, false),
        Field::new("ymin", DataType::Float64, false),
        Field::new("xmax", DataType::Float64, false),
        Field::new("ymax", DataType::Float64, false),
    ])
}

fn lv95_definition() -> String {
    spatial_engine::crs_catalog::entries()
        .iter()
        .find(|e| e.code == 2056)
        .expect("the pinned catalog carries EPSG:2056")
        .definition
        .clone()
}

/// A small LV95 GeoParquet, written here so this binary needs nothing from the other two.
fn write_source(path: &Path) {
    std::fs::create_dir_all(path.parent().expect("dir")).expect("dir");
    let geo = format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":\"geometry\",\"columns\":{{\"geometry\":{{\
          \"encoding\":\"WKB\",\"geometry_types\":[\"Polygon\"],\"crs\":{},\
          \"covering\":{{\"bbox\":{{\"xmin\":[\"bbox\",\"xmin\"],\"ymin\":[\"bbox\",\"ymin\"],\
          \"xmax\":[\"bbox\",\"xmax\"],\"ymax\":[\"bbox\",\"ymax\"]}}}}}}}}}}",
        lv95_definition()
    );
    let schema = std::sync::Arc::new(Schema::new(vec![
        std::sync::Arc::new(Field::new("id", DataType::UInt64, false)),
        std::sync::Arc::new(Field::new("bbox", DataType::Struct(bbox_fields()), false)),
        std::sync::Arc::new(Field::new("geometry", DataType::Binary, false)),
    ]));
    let props = WriterProperties::builder()
        .set_compression(Compression::SNAPPY)
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo)]))
        .build();
    let file = std::fs::File::create(path).expect("create source");
    let mut writer = ArrowWriter::try_new(file, schema.clone(), Some(props)).expect("writer");

    let mut ids = UInt64Builder::new();
    let mut geoms = BinaryBuilder::new();
    let (mut xmin, mut ymin, mut xmax, mut ymax) = (
        arrow::array::Float64Builder::new(),
        arrow::array::Float64Builder::new(),
        arrow::array::Float64Builder::new(),
        arrow::array::Float64Builder::new(),
    );
    for id in 0..16u64 {
        let cx = 2_600_000.0 + id as f64 * 60.0;
        let cy = 1_200_000.0;
        let ring: Vec<[f64; 2]> = (0..64)
            .map(|i| {
                let a = (i as f64) * std::f64::consts::TAU / 64.0;
                [cx + 20.0 * a.cos(), cy + 20.0 * a.sin()]
            })
            .chain(std::iter::once([cx + 20.0, cy]))
            .collect();
        ids.append_value(id);
        geoms.append_value(spatial_engine::wkb::encode_polygon(&[ring]));
        xmin.append_value(cx - 20.0);
        ymin.append_value(cy - 20.0);
        xmax.append_value(cx + 20.0);
        ymax.append_value(cy + 20.0);
    }
    let bbox: ArrayRef = std::sync::Arc::new(StructArray::new(
        bbox_fields(),
        vec![
            std::sync::Arc::new(xmin.finish()) as ArrayRef,
            std::sync::Arc::new(ymin.finish()) as ArrayRef,
            std::sync::Arc::new(xmax.finish()) as ArrayRef,
            std::sync::Arc::new(ymax.finish()) as ArrayRef,
        ],
        None,
    ));
    let batch = RecordBatch::try_new(
        schema,
        vec![
            std::sync::Arc::new(ids.finish()) as ArrayRef,
            bbox,
            std::sync::Arc::new(geoms.finish()) as ArrayRef,
        ],
    )
    .expect("batch");
    writer.write(&batch).expect("write");
    writer.close().expect("close");
}

// RECORDED MUTATION: skip the preflight — delete the `disk_preflight(required_bytes, available)?`
// call from `engine/src/lod.rs::build_tiers` → the_preflight_refuses_before_the_first_tier_is_written
// fails by name on "no free space must refuse before any tier is written": with the tier root on a
// volume that does not exist the refusal never fires, and the build instead reaches the writer and
// returns `EngineError::Source` from `create the tier file`, which is the wrong refusal at the wrong
// moment — after the builder has already decided to write.
#[test]
fn the_preflight_refuses_before_the_first_tier_is_written() {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("workspace root")
        .join("target/fixtures/lod-tier-builder/t12");
    let _ = std::fs::remove_dir_all(&dir);
    let path = dir.join("source.parquet");
    write_source(&path);

    let source = Dataset::open(&path).expect("open");
    let source_bytes = std::fs::metadata(&path).expect("stat").len();
    assert_eq!(
        set_hard_bound_bytes(source_bytes),
        source_bytes * 3,
        "the preflight requires the by-construction bound: tier count x the per-tier ceiling"
    );

    // The injection: a tier root on a volume that does not exist, so free space cannot be
    // established at all. Nothing else about the build changes.
    let absent = absent_volume();
    let previous = std::env::var_os("LOCALAPPDATA");
    std::env::set_var("LOCALAPPDATA", &absent);
    let outcome = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &CancelToken::new(), None);
    match previous {
        Some(v) => std::env::set_var("LOCALAPPDATA", v),
        None => std::env::remove_var("LOCALAPPDATA"),
    }

    match outcome {
        Err(EngineError::LodRefused { refusal, detail }) => {
            assert_eq!(refusal, LOD_INSUFFICIENT_DISK, "no free space must refuse before any tier is written");
            assert!(
                detail.contains(&set_hard_bound_bytes(source_bytes).to_string()),
                "the refusal names what it required: {detail}"
            );
            // And it says which half failed — free space that could not be established at all,
            // which is what makes this injection a "no free space" injection rather than a
            // mis-spelled path.
            assert!(
                detail.contains("could not be established"),
                "the refusal names what it could not establish: {detail}"
            );
        }
        other => panic!("no free space must refuse before any tier is written: {other:?}"),
    }
    assert!(!absent.exists(), "nothing was written to the absent volume");

    // And the same build succeeds once the tier root is resolvable again — so the refusal is the
    // preflight's, not something else about this source.
    let ok = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &CancelToken::new(), None)
        .expect("the same source builds when there is room");
    assert!(ok.disk_cost().free_bytes_before_build.is_some(), "the preflight's reading is disclosed");
    assert!(ok.total_bytes() <= ok.hard_bound_bytes());
    let _ = std::fs::remove_dir_all(ok.directory());
}
