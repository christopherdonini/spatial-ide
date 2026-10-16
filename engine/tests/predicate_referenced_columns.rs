// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `AdmittedPredicate::referenced_columns` (`kernel/B2-1B-RECORDING-PREREGISTRATION.md`, Amendment 1
//! item 4 (a)): the columns an admitted predicate references, each once, in order of first
//! appearance, against a real opened `Dataset`.

use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_engine::{AdmittedPredicate, Dataset};

/// **Mutation:** `admit` stores an empty list (`columns: Vec::new()`). **Expected failure:** this test
/// fails at its first assertion, `left: []`.
#[test]
fn an_admitted_predicate_reports_each_referenced_column_once_in_order_of_first_appearance() {
    let spec = FixtureSpec {
        features: 20,
        attributes: AttributeMode::MultiType,
        ..Default::default()
    };
    let dir = std::env::temp_dir().join("spatial-engine-predicate-referenced-columns");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join("multi.parquet");
    write_geoparquet(&path, &spec).expect("fixture");
    let ds = Dataset::open(&path).expect("open");

    let admit = |text: &str| AdmittedPredicate::admit(text, &ds).expect("admitted");
    let p = admit("zone = 'civic' AND (area > 100.5 OR zone = 'industrial') AND i64 > 0");
    assert_eq!(p.referenced_columns(), ["zone", "area", "i64"]);
    assert_eq!(admit("flag").referenced_columns(), ["flag"]);
    assert!(admit("1 = 1").referenced_columns().is_empty());
}
