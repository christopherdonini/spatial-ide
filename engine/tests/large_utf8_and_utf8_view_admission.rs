// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md` §4: T1
//! and T3. The engine takes an attribute's type only from DuckDB's Arrow export, so T1 makes each
//! of the two refused types with DuckDB's own export (no file, no constructed field) and T3 pins
//! that the product's own connection configuration exports text as plain `Utf8`.

use arrow::datatypes::{DataType, Field, Fields};
use duckdb::Connection;

use spatial_engine::attributes::{admit_projection, admit_projection_column, ProjectionError};
use spatial_engine::fixture::configured_connection;

/// The Arrow field DuckDB exports for `SELECT 'a'::VARCHAR AS zone` on `conn`.
fn exported_zone_field(conn: &Connection) -> Field {
    let mut stmt = conn
        .prepare("SELECT 'a'::VARCHAR AS zone")
        .expect("prepare the VARCHAR probe");
    let arrow = stmt
        .query_arrow([])
        .expect("export the probe through Arrow");
    let schema = arrow.get_schema();
    // Drained in full, as `dataset::probe_schema` does, before the connection is used again.
    arrow.for_each(drop);
    schema
        .field_with_name("zone")
        .expect("the exported schema carries `zone`")
        .clone()
}

/// T1. Each of the two types is made by the bundled DuckDB's own Arrow export on a connection the
/// product configures, with one `SET` added (H-SET); the engine then refuses it at projection
/// admission, which is what describe's `projectable` is computed from.
// RECORDED MUTATION (observed at `cea0ef8c`, line numbers at that commit): in `admit_attribute_type`,
// restore `| D::LargeUtf8 | D::Utf8View` to the admitted arm. Observed: this test fails by name --
// "LargeUtf8 must be refused by admit_projection_column" at
// `engine/tests/large_utf8_and_utf8_view_admission.rs:56`; T4 fails with it. Reverted.
#[test]
fn a_large_utf8_or_utf8_view_column_duckdb_exports_is_not_projectable() {
    // `produce_arrow_string_view` alone leaves VARCHAR as `Utf8` on the bundled DuckDB (tried at
    // this piece's fix commit, recorded under I1); with `arrow_output_version` 1.4 it exports `Utf8View`.
    for (set, expected) in [
        ("SET arrow_large_buffer_size=true", DataType::LargeUtf8),
        (
            "SET produce_arrow_string_view=true; SET arrow_output_version='1.4'",
            DataType::Utf8View,
        ),
    ] {
        let conn = configured_connection().expect("configured connection");
        conn.execute_batch(set).expect(set);
        let field = exported_zone_field(&conn);
        // The precondition: the export really is the type this case is about. Without it the
        // assertions below would prove nothing about either type.
        assert_eq!(
            field.data_type(),
            &expected,
            "`{set}` must make DuckDB export VARCHAR as {expected}"
        );
        assert!(
            matches!(
                admit_projection_column(&field, "geometry", "id"),
                Err(ProjectionError::TypeNotAdmitted { .. })
            ),
            "{expected} must be refused by admit_projection_column"
        );
        let schema = Fields::from(vec![field]);
        assert!(
            matches!(
                admit_projection(&["zone".to_string()], &schema, "geometry", "id"),
                Err(ProjectionError::TypeNotAdmitted { .. })
            ),
            "{expected} must be refused by admit_projection"
        );
    }
}

/// T3. The premise pin: on a connection configured as the product configures it, with no `SET`
/// added, VARCHAR is exported as plain `Utf8`. Green before and after the change; red if a DuckDB
/// bump or a configuration change makes ordinary text reach either refused type.
// RECORDED MUTATION (observed at `cea0ef8c`): append `; SET arrow_large_buffer_size=true` to
// `CONFIGURE_SQL` (`engine/src/pool.rs`), run in this file's own test binary. Observed: this test
// fails by name -- `assertion left == right failed`, `left: LargeUtf8`, at
// `engine/tests/large_utf8_and_utf8_view_admission.rs:80`. Reverted.
#[test]
fn the_product_configured_connection_exports_text_as_plain_utf8() {
    let conn = configured_connection().expect("configured connection");
    assert_eq!(exported_zone_field(&conn).data_type(), &DataType::Utf8);
}
