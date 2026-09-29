// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! §10 Amendment 12 (wave-2 A2-1), N-11's own process — see
//! `b1_nul_native_id_scan_once.rs`'s doc for why `IDENTITY_VERIFICATION_SCANS`'s counter needs a
//! process to itself.

use spatial_engine::dataset::identity_verification_scans;
use spatial_engine::fixture::{write_hostile_names, HostileColumn};
use spatial_engine::identity::IdentityDeclaration;
use spatial_engine::{CancelToken, Dataset, EngineError};

/// §3's fixture discipline: hashed before and after this file's own run.
fn sha256_file(path: &std::path::Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    let digest = Sha256::digest(&bytes);
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

/// N-11 (§10 Amendment 12, wave-2 A2-1): `a_declared_identity_naming_a_nul_named_column_is_
/// refused_before_any_scan` (c20). `column` is the full name; `candidate_columns` is empty;
/// `IDENTITY_VERIFICATION_SCANS` (measured through `identity_verification_scans()`) is unchanged —
/// no scan is ever prepared before the refusal.
/// Mutation: the name check is removed from the declared arm of `dataset::admit_identity`.
#[test]
fn a_declared_identity_naming_a_nul_named_column_is_refused_before_any_scan() {
    let dir = std::env::temp_dir().join("spatial-engine-b1-nul-declared-identity-no-scan");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join("nul-declared-identity.parquet");
    write_hostile_names(
        &path,
        "key\0x",
        &[HostileColumn {
            name: "a",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&path);

    let declaration = IdentityDeclaration::new("key\u{0}x", "test", "2026-09-29T00:00:00Z");
    let before = identity_verification_scans();
    match Dataset::open_with_declared_identity(&path, declaration, &CancelToken::new()) {
        Err(EngineError::IdentityUnusable {
            column,
            candidate_columns,
            ..
        }) => {
            assert_eq!(column, "key\u{0}x");
            assert!(
                candidate_columns.is_empty(),
                "the hostile column must never be a candidate: {candidate_columns:?}"
            );
        }
        Ok(_) => panic!("expected IdentityUnusable, got Ok"),
        Err(other) => panic!("expected IdentityUnusable, got {other:?}"),
    }
    let after = identity_verification_scans();
    assert_eq!(
        after, before,
        "a declared-identity refusal before any scan must not move the counter"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}
