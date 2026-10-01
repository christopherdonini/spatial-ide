// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `Catalog::open` and `Catalog::open_cancellable` on a name already present: the replace path.
//!
//! Pins the outcome only (the new dataset is served, the name is listed once, the replaced
//! dataset's pool is gone when the call returns). It does not time anything and says nothing about
//! readers' waits. Preregistration: `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md` §4.

use std::path::PathBuf;
use std::sync::Arc;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::CancelToken;
use spatial_kernel::Catalog;

const NAME: &str = "replaced";

fn fixture(file: &str) -> PathBuf {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(file);
    write_geoparquet(
        &path,
        &FixtureSpec { features: 64, avg_vertices: 8, hole_every: 0, ..Default::default() },
    )
    .expect("write fixture");
    path
}

/// T1 (S1). Mutation M1, `open`'s `insert` becoming `entry(name.into()).or_insert(Arc::new(ds))`,
/// is observed in the commit named below: T1 fails on the assertion `get(N)'s path is B`.
///
/// M1 observation, applied on the tree at commit c3e8e54 and reverted: this test failed on
/// `assertion `left == right` failed: get(N)'s path is B`; its sibling passed.
#[test]
fn replacing_a_name_through_open_serves_the_new_dataset_and_drops_the_old_one_before_open_returns() {
    let a = fixture("catalog-replace-t1-a.parquet");
    let b = fixture("catalog-replace-t1-b.parquet");
    let catalog = Catalog::new();

    catalog.open(NAME, &a, None).expect("first open");
    let old_pool = {
        let ds = catalog.get(NAME).expect("A registered");
        Arc::downgrade(ds.connections())
    };
    assert_eq!(old_pool.strong_count(), 1, "A's pool is alive after the first open");

    catalog.open(NAME, &b, None).expect("second open is Ok");

    let served = catalog.get(NAME).expect("N still registered");
    assert_eq!(served.path(), b.as_path(), "get(N)'s path is B");
    assert_eq!(catalog.names(), vec![NAME.to_string()], "names() is [N]");
    assert_eq!(old_pool.strong_count(), 0, "A's pool is gone when open returns");
}

/// T2 (S2), as T1 through `open_cancellable`. Mutation M2, the same change in `open_cancellable`,
/// is observed in the commit named below: T2 fails on the assertion `get(N)'s path is B`.
///
/// M2 observation, applied on the tree at commit c3e8e54 and reverted: this test failed on
/// `assertion `left == right` failed: get(N)'s path is B`; its sibling passed.
#[test]
fn replacing_a_name_through_open_cancellable_serves_the_new_dataset_and_drops_the_old_one_before_it_returns(
) {
    let a = fixture("catalog-replace-t2-a.parquet");
    let b = fixture("catalog-replace-t2-b.parquet");
    let catalog = Catalog::new();
    let cancel = CancelToken::new();

    catalog.open_cancellable(NAME, &a, None, None, &cancel).expect("first open");
    let old_pool = {
        let ds = catalog.get(NAME).expect("A registered");
        Arc::downgrade(ds.connections())
    };
    assert_eq!(old_pool.strong_count(), 1, "A's pool is alive after the first open");

    catalog.open_cancellable(NAME, &b, None, None, &cancel).expect("second open is Ok");

    let served = catalog.get(NAME).expect("N still registered");
    assert_eq!(served.path(), b.as_path(), "get(N)'s path is B");
    assert_eq!(catalog.names(), vec![NAME.to_string()], "names() is [N]");
    assert_eq!(old_pool.strong_count(), 0, "A's pool is gone when it returns");
}
