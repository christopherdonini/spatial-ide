// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A folder opened through the host, with or without a declared identity column, is refused by
//! name with the same error, and the message offers no declaration: a declared column does not
//! change the refusal, because the refusal comes before any identity is read.

mod watch_support;

use std::path::PathBuf;
use std::sync::Arc;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::EngineError;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{IdentityDeclaration, OpenDatasetRequest, SKP_VERSION};

const CODE: &str = "engine.identity_ordinal_partitioned_unsupported";
const OLD_OFFER: &str = "or declare an identity column";

/// `SkpHost::open_dataset` on a folder holding one part with a unique `parcel_key`, once with no
/// declaration and once declaring `parcel_key`: both are refused with the code
/// `engine.identity_ordinal_partitioned_unsupported` and a `detail` field ending "is a directory";
/// the two `SkpError`s are equal; the message does not offer a declaration; and it equals the
/// engine's `Display` for that detail.
///
/// RECORDED MUTATION (observed at `2b90ed511f119052d752c849c7507ba59218cf39`): the old last clause of the
/// `Display` arm put back ("... declared. Open a single file, or declare an identity column that
/// is carried in the data"). Observed outcome: this test fails by name at (c), the message
/// assertion, with the message text as the panic. Applied, run, reverted; `cmp` passed.
///
/// RECORDED MUTATION M-K1b (observed at `8d1fe83acfaede6873b6366e6594b99ddf9943ad`):
/// the partitioned gate in `engine/src/dataset.rs` guarded with `declared_identity.is_none()`, so
/// a declared open gets past it. Observed outcome: this test fails by name at (a), the code
/// assertion on the declared open (`declared.code`), which saw `engine.source`. Applied, run,
/// reverted; the file's sha256 matched.
#[test]
fn a_folder_opened_with_or_without_a_declared_identity_is_refused_by_name_and_offered_no_declaration(
) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("the kernel crate sits in the workspace")
        .join("target/fixtures/partitioned-refusal-remedy/parts");
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("fixture directory");
    let spec = FixtureSpec {
        features: 50,
        avg_vertices: 8,
        identity: IdentityMode::ForeignKeyColumn,
        ..Default::default()
    };
    write_geoparquet(&dir.join("part-0.parquet"), &spec).expect("write the one part");

    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    let open = |identity: Option<IdentityDeclaration>, key: &str| {
        host.open_dataset(OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: dir.display().to_string(),
            cancel_key: key.to_string(),
            crs_assertion: None,
            identity,
            set_aside_file_id: false,
        })
        .expect_err("a folder is refused")
    };
    let undeclared = open(None, "partitioned-remedy-undeclared");
    let declared = open(
        Some(IdentityDeclaration {
            column: "parcel_key".to_string(),
        }),
        "partitioned-remedy-declared",
    );

    // (a) the code, for both requests.
    assert_eq!(undeclared.code, CODE, "{}", undeclared.message);
    assert_eq!(declared.code, CODE, "{}", declared.message);
    // (b) a `detail` field on both, naming the directory.
    for e in [&undeclared, &declared] {
        let detail = e.fields.get("detail").expect("a detail field");
        assert!(detail.ends_with("is a directory"), "{detail}");
    }
    // (c) the message offers no declaration.
    for e in [&undeclared, &declared] {
        assert!(!e.message.contains(OLD_OFFER), "{}", e.message);
    }
    // (d) the two errors are equal, byte for byte.
    assert_eq!(undeclared, declared);
    // (e) the message is the engine's own `Display` for that detail.
    let detail = undeclared.fields["detail"].clone();
    assert_eq!(
        undeclared.message,
        EngineError::IdentityOrdinalPartitionedUnsupported { detail }.to_string()
    );
}
