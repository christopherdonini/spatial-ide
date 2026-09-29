// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! §10 Amendment 12 (wave-2 A2-1), N-10's own process. `IDENTITY_VERIFICATION_SCANS`
//! (`engine/src/dataset.rs`, read through `identity_verification_scans()`) is process-global, so a
//! before/after comparison needs a process nothing else in the suite can touch it in —
//! `engine/tests/admission_instruments.rs`'s own module doc states the general hazard: "an
//! integration-test *file* is its own process, but `cargo test` runs every `#[test]` fn *within*
//! one file concurrently, on shared threads, by default." This file holds exactly one `#[test]`,
//! the same discipline that file's own doc explains, so N-10's own counter delta is never raced by
//! anything else this crate's test suite runs concurrently.

use spatial_engine::dataset::identity_verification_scans;
use spatial_engine::fixture::{write_hostile_names, HostileColumn};
use spatial_engine::identity::IdUniqueness;
use spatial_engine::Dataset;

/// §3's fixture discipline: hashed before and after this file's own run.
fn sha256_file(path: &std::path::Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    let digest = Sha256::digest(&bytes);
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

/// N-10 (§10 Amendment 12, wave-2 A2-1): `the_native_id_is_the_column_duckdb_binds_when_a_nul_
/// named_id_precedes_it` (E8's p3 file: `id\0x` (Utf8) ahead of a real, addressable `id` (Int64)).
/// The open succeeds, native on the real `id`, and the identity verification scan runs **exactly
/// once** — measured on the process-global counter, alone in this process, rather than inferred
/// from `IdUniqueness::VerifiedAtOpenFullFile` alone (that state is reachable only after the scan
/// ran, but does not itself say how many times).
/// Mutation: `dataset::admit_identity` matches by exported name instead of the bound (DESCRIBE)
/// name, so it would resolve `id\0x`'s truncated form and shadow the real `id`.
#[test]
fn the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it() {
    let dir = std::env::temp_dir().join("spatial-engine-b1-nul-native-id-scan-once");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join("nul-id-then-real-id.parquet");
    write_hostile_names(
        &path,
        "key",
        &[
            HostileColumn {
                name: "id\0x",
                int: false,
            },
            HostileColumn {
                name: "id",
                int: true,
            },
        ],
    );
    let fixture_sha_before = sha256_file(&path);

    let before = identity_verification_scans();
    let ds = Dataset::open(&path).expect("open must succeed, native on the real `id`");
    assert!(
        !ds.identity().source().is_session_ordinal(),
        "a real, addressable `id` exists"
    );
    assert_eq!(ds.identity().source().source_column(), "id");
    assert_eq!(
        ds.identity().uniqueness(),
        IdUniqueness::VerifiedAtOpenFullFile,
        "the native scan must have run, over the real column"
    );
    let after = identity_verification_scans();
    assert_eq!(
        after,
        before + 1,
        "the identity verification scan must run exactly once"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}
