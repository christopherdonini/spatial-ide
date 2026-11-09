// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! An existing single file whose path holds `[`, `]`, `{` or `}` opens, and streams only its own
//! rows. The file also covers the spatial-index and row-group-index builds over such a file, one
//! test each.

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

/// For each shape in `SHAPES`, once keyless and once with a native unique id: the literal file is
/// written beside its decoys, opened through `Dataset::open_cancellable`, and its stream drained.
/// Four assertions per row: it is admitted; it streams the literal file's 500 rows, not a decoy's
/// count and, where that differs from 500, not the decoys' sum; the ids are distinct and as many as
/// the rows; the sha256 of every file is the same after as before.
///
/// Where the sum is 500, K2 and K3, the sum comparison is skipped and the distinct-id assertion is
/// what tells the literal from the pair, because every file's ids start again from 0: the fixture's
/// `id` column on the native rows, and the row's position within its file on the keyless rows.
///
/// RECORDED MUTATION (observed at `4f0d50cee15f0e48abd582053677b55f62af077d`): the `path.is_file()`
/// return removed from `partitioned_source_detail`, so every path holding one of the four is
/// refused. Observed outcome: this test fails by name at assertion 1 on the K1 keyless row, with
/// the refusal. A second mutation, `duckdb_literal_path` returning its input unchanged: this test
/// fails at assertion 2 on the K1 keyless row, 300 rows streamed against 500. A third, it leaving
/// `[` unescaped and rewriting only `]`: this test fails at assertion 1 on the K1 keyless row with
/// DuckDB's no-match error.
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

            // Assertion 3: the ids are distinct and as many as the rows. Every file's ids start
            // again from 0 (the fixture's `id` on the native rows, the row's position in its file
            // on the keyless rows), so a read of two files repeats them.
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

/// Writes the K1 shape, `zones[1].parquet` of 500 features beside `zones1.parquet` of 300, in a
/// directory of the calling test's own, each with a native unique id and `row_group_rows` and
/// `chunk` as given. Returns the literal file's path.
fn write_k1_pair(directory: &str, rows_per_group: Option<usize>) -> PathBuf {
    let dir = fixture_root().join(directory);
    let _ = std::fs::remove_dir_all(&dir);
    let mut literal_spec = spec(LITERAL_FEATURES, None, IdentityMode::NativeUnique);
    let mut decoy_spec = spec(
        DECOY_A_FEATURES,
        Some(DECOY_A_SEED),
        IdentityMode::NativeUnique,
    );
    if let Some(rows) = rows_per_group {
        for s in [&mut literal_spec, &mut decoy_spec] {
            s.row_group_rows = rows;
            s.chunk = rows;
        }
    }
    let literal = dir.join("zones[1].parquet");
    write_file(&literal, &literal_spec);
    write_file(&dir.join("zones1.parquet"), &decoy_spec);
    literal
}

/// An existing `zones[1].parquet` of 500 features, opened beside a `zones1.parquet` of 300 and
/// indexed through `Dataset::build_index`, is indexed from its own rows: the build is admitted and
/// its report holds 500 indexed features and 500 scanned rows, not the decoy's 300.
///
/// RECORDED MUTATION (observed at `<T>`): in `SpatialIndex::build_observed` the `read_parquet` path
/// left unescaped. Observed outcome: this test fails at the `indexed_features` assertion.
#[test]
fn an_index_built_over_an_existing_bracket_named_file_holds_only_that_files_features() {
    let literal = write_k1_pair("index-k1", None);
    let ds = Dataset::open_cancellable(
        &literal,
        None,
        None,
        &CancelToken::new(),
        PoolConfig::default(),
    )
    .expect("the file is admitted");

    let report = ds
        .build_index(&CancelToken::new())
        .expect("the index build over the literal file is admitted");

    assert_eq!(
        report.indexed_features, LITERAL_FEATURES,
        "indexed_features is the literal file's count, not the decoy's"
    );
    assert_eq!(
        report.scanned_rows, LITERAL_FEATURES as u64,
        "scanned_rows is the literal file's count, not the decoy's"
    );
}

/// An existing `zones[1].parquet` of 500 features, opened beside a `zones1.parquet` of 300, both
/// written at 100 rows per row group, has its row-group index built from its own footer: the
/// report holds 5 row groups, not the decoy's 3.
///
/// RECORDED MUTATION (observed at `<T>`): in `RowGroupIndex::read_metadata` the bound path left
/// unescaped. Observed outcome: this test fails at the `row_groups` assertion.
#[test]
fn a_row_group_index_built_over_an_existing_bracket_named_file_reads_only_that_files_footer() {
    const ROWS_PER_GROUP: usize = 100;
    let literal = write_k1_pair("row-group-k1", Some(ROWS_PER_GROUP));
    let ds = Dataset::open_cancellable(
        &literal,
        None,
        None,
        &CancelToken::new(),
        PoolConfig::default(),
    )
    .expect("the file is admitted");

    let report = ds
        .build_row_group_index(&CancelToken::new())
        .expect("the row-group index build over the literal file is admitted");

    assert_eq!(
        report.row_groups,
        LITERAL_FEATURES.div_ceil(ROWS_PER_GROUP),
        "row_groups is the literal file's footer's count, not the decoy's"
    );
}
