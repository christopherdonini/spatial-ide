// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! An existing single file whose path holds `[`, `]`, `{` or `}` opens, and streams only its own
//! rows.

use std::collections::HashSet;
use std::path::{Path, PathBuf};

use sha2::{Digest, Sha256};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::{CancelToken, Dataset, PoolConfig, ViewportQuery};

const LITERAL_FEATURES: usize = 500;
const DECOY_A_FEATURES: usize = 300;
const DECOY_B_FEATURES: usize = 200;
const DECOY_A_SEED: u64 = 0x5EED_2056_0000_0101;
const DECOY_B_SEED: u64 = 0x5EED_2056_0000_0202;

/// One literal file and the decoy files laid beside it. The paths are relative to the row's own
/// directory and use `/`.
struct Shape {
    row: &'static str,
    directory: &'static str,
    literal: &'static str,
    decoys: &'static [(&'static str, usize)],
}

const SHAPES: &[Shape] = &[
    Shape {
        row: "K1, a bracket pair",
        directory: "k1",
        literal: "zones[1].parquet",
        decoys: &[("zones1.parquet", DECOY_A_FEATURES)],
    },
    Shape {
        row: "K2, a bracket class of two",
        directory: "k2",
        literal: "zones[12].parquet",
        decoys: &[
            ("zones1.parquet", DECOY_A_FEATURES),
            ("zones2.parquet", DECOY_B_FEATURES),
        ],
    },
    Shape {
        row: "K3, a brace alternation",
        directory: "k3",
        literal: "zones{a,b}.parquet",
        decoys: &[
            ("zonesa.parquet", DECOY_A_FEATURES),
            ("zonesb.parquet", DECOY_B_FEATURES),
        ],
    },
    Shape {
        row: "K4, a lone closing bracket",
        directory: "k4-closing-bracket",
        literal: "zones].parquet",
        decoys: &[("zones1.parquet", DECOY_A_FEATURES)],
    },
    Shape {
        row: "K4, a lone opening bracket",
        directory: "k4-opening-bracket",
        literal: "zones[.parquet",
        decoys: &[("zones1.parquet", DECOY_A_FEATURES)],
    },
    Shape {
        row: "K4, a lone closing brace",
        directory: "k4-closing-brace",
        literal: "zones}.parquet",
        decoys: &[("zones1.parquet", DECOY_A_FEATURES)],
    },
    Shape {
        row: "K4, a brace pair",
        directory: "k4-brace-pair",
        literal: "zones{1}.parquet",
        decoys: &[("zones1.parquet", DECOY_A_FEATURES)],
    },
    Shape {
        row: "K5, a bracket pair in the parent directory",
        directory: "k5",
        literal: "dir[1]/zones.parquet",
        decoys: &[("dir1/zones.parquet", DECOY_A_FEATURES)],
    },
];

fn fixture_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("the engine crate sits in the workspace")
        .join("target/fixtures/single-file-bracket-name")
}

fn spec(features: usize, seed: Option<u64>, identity: IdentityMode) -> FixtureSpec {
    let mut spec = FixtureSpec {
        features,
        avg_vertices: 12,
        identity,
        ..Default::default()
    };
    if let Some(seed) = seed {
        spec.seed = seed;
    }
    spec
}

fn sha256_of(path: &Path) -> String {
    let bytes = std::fs::read(path).expect("read a fixture to hash it");
    Sha256::digest(&bytes)
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect()
}

fn write_file(path: &Path, spec: &FixtureSpec) {
    std::fs::create_dir_all(path.parent().expect("a fixture has a parent directory"))
        .expect("fixture directory");
    write_geoparquet(path, spec).expect("write fixture");
}

/// Every id the stream carries, in arrival order.
fn drain_ids(ds: &Dataset) -> Vec<u64> {
    let mut stream = ds
        .stream(&ViewportQuery::all())
        .expect("the stream is issued");
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    while let Some(item) = stream.next_into(&mut buf) {
        item.expect("a batch");
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("an IPC stream");
        for batch in reader {
            let batch = batch.expect("a record batch");
            let column = batch
                .column(0)
                .as_any()
                .downcast_ref::<arrow::array::UInt64Array>()
                .expect("column 0 is the u64 id");
            ids.extend(column.values().iter().copied());
        }
        buf.clear();
    }
    ids
}

#[test]
fn an_existing_single_file_whose_name_holds_a_bracket_or_a_brace_opens_and_streams_only_its_own_rows(
) {
    for shape in SHAPES {
        for (mode_name, mode) in [
            ("keyless", IdentityMode::ForeignKeyColumn),
            ("native", IdentityMode::NativeUnique),
        ] {
            let row = format!("{} ({mode_name})", shape.row);
            let dir = fixture_root().join(format!("{}-{mode_name}", shape.directory));
            let _ = std::fs::remove_dir_all(&dir);

            let literal = dir.join(shape.literal);
            write_file(&literal, &spec(LITERAL_FEATURES, None, mode));
            let mut files = vec![literal.clone()];
            let mut decoy_counts = Vec::new();
            for (i, (name, count)) in shape.decoys.iter().enumerate() {
                let seed = if i == 0 { DECOY_A_SEED } else { DECOY_B_SEED };
                let decoy = dir.join(name);
                write_file(&decoy, &spec(*count, Some(seed), mode));
                files.push(decoy);
                decoy_counts.push(*count);
            }
            let before: Vec<String> = files.iter().map(|f| sha256_of(f)).collect();

            // Assertion 1: admitted.
            let ds = Dataset::open_cancellable(
                &literal,
                None,
                None,
                &CancelToken::new(),
                PoolConfig::default(),
            )
            .unwrap_or_else(|e| panic!("{row}: assertion 1, the file must be admitted: {e}"));

            let ids = drain_ids(&ds);

            // Assertion 2: the literal file's count, and not a decoy's. "And not the decoys' sum"
            // is asserted only where the sum is not the literal's count: K2's and K3's two decoys
            // total 500, so on those rows assertion 3 tells the literal from the pair.
            assert_eq!(
                ids.len(),
                LITERAL_FEATURES,
                "{row}: assertion 2, the rows streamed are the literal file's"
            );
            for count in &decoy_counts {
                assert_ne!(ids.len(), *count, "{row}: assertion 2, a decoy's count");
            }
            let decoy_sum: usize = decoy_counts.iter().sum();
            if decoy_sum != LITERAL_FEATURES {
                assert_ne!(ids.len(), decoy_sum, "{row}: assertion 2, the decoys' sum");
            }

            // Assertion 3: the ids are distinct and as many as the rows. The fixture numbers every
            // file from 0, so a read of two files repeats them.
            let distinct: HashSet<u64> = ids.iter().copied().collect();
            assert_eq!(
                distinct.len(),
                ids.len(),
                "{row}: assertion 3, the ids are distinct and as many as the rows"
            );

            // Assertion 4: no file was touched.
            let after: Vec<String> = files.iter().map(|f| sha256_of(f)).collect();
            assert_eq!(before, after, "{row}: assertion 4, every file is unchanged");
        }
    }
}
