// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Brief A P4 — the compatibility-corpus run against the preregistered expectations
//! (`engine/ADMISSION-PREREGISTRATION.md` §3's main-set table, §4's mutation table, §8's standing
//! rules). `#[ignore]`d: run explicitly —
//! `cargo test -p spatial-engine --test admission_p4_corpus -- --ignored --nocapture`.
//!
//! **Correctness only.** No duration, no rate, no timing anywhere in this file or in what it writes
//! (ADR-018; the preregistration's boundary 10, §1; the P4 node brief's own rule).
//!
//! **What this does.** For each of the 17 files §3's main set (12) and §4's mutation table (5) name
//! (`target/fixtures/compat-corpus/`, on disk, untracked): (1) hash-verifies it against
//! `MANIFEST.json` (mutations additionally against `mutations/DERIVATIONS.json`) before opening
//! anything, and again after every file has been opened; (2) opens it through
//! [`spatial_engine::Dataset::open`] — the same entry point `kernel/src/lib.rs`'s `Catalog::open_*`
//! wraps for the shell's own open (`kernel/src/skp.rs::open_dataset` → `Catalog::open_cancellable` →
//! `Dataset::open_cancellable` → the same `open_inner` `Dataset::open` calls with a throwaway
//! assertion/identity/cancel/pool default) — never a test-only shortcut; (3) records the first
//! outcome reached: admitted-as-declared / admitted-under-format-rule (with the specific provenance)
//! / refused-by-name (with the `engine.<code>` refusal identifier), plus the identity class where
//! admitted; (4) writes the table to `engine/ADMISSION-RESULTS.md`, generated, never hand-edited;
//! (5) compares each row's outcome to §3/§4's preregistered "Brief A" column and marks it accordingly.
//! A deviation is a recorded result; nothing here edits a prediction to match what was observed.
//!
//! **Two rows are not comparable to this instrument** (`gp-epsg2056-intkey-changed-same-size.parquet`
//! / M-1c and `gp-epsg2056-intkey-appended.parquet` / M-1a-equivalent): their §4 "Brief A" text
//! (`engine.source_changed` firing or not firing) describes the G-A2 open-then-mutate-in-place-then-
//! query workflow, which `ADMISSION-PREREGISTRATION.md` Amendment 1, item 9 states is P5's and not
//! approximated, and which Amendment 7 (iii) item 2 states G-A2 remains unscored (a gate is scored
//! by its own run). This runner performs one [`Dataset::open`] per file and nothing else, so it
//! cannot exercise that workflow. Both rows still get a real, standalone-open outcome recorded as
//! this instrument's own fact; that fact is not compared against the G-A2 text, and the run says so
//! by name rather than silently marking either "as predicted" or "DEVIATION".
//!
//! **Two more §3 cells name a component this instrument cannot reach either** (rows #3 and #8):
//! each ends with a boundary-8 publish-preflight refusal plus the equirectangular statement, and a
//! single [`Dataset::open`] cannot reach a publish preflight. §8's `unrun — reason` rule applies to
//! that one component of each cell; the rest of each cell (class, provenance, identity, sanity
//! level, and — for row #3 — the registered declared axis order) is still compared and still scored
//! `AsPredicted` / `DEVIATION` on its own terms. See each row's own note, and the Predictions
//! section's boundary-8 line, below.
//!
//! **RECORDED MUTATION — applied and observed, not only asserted, against
//! [`the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results`]
//! below.** Inverting the comparison in [`sha256_matches`] (`==` to `!=`) makes every file in the
//! corpus report a hash mismatch regardless of its actual bytes; the run then records "unrun —
//! hash mismatch" for all 17 rows instead of opening any of them. Observed by making that one-line
//! change locally and re-running this test: it panics at the `assert_eq!(not_run, 0, ...)` below,
//! not at `assert!(rows_opened > 0, ...)` further down, because `not_run` reaches 17 before
//! `rows_opened` (0) is ever checked — a real failure inside the test's own assertions, not a
//! setup-time panic — then reverted.

use std::collections::BTreeMap;
use std::fmt::Write as _;
use std::path::{Path, PathBuf};
use std::process::Command;

use serde_json::Value;
use sha2::{Digest, Sha256};

use spatial_engine::{Dataset, EngineError, IdSource};

/// The compatibility corpus lives outside any one worktree's `target/` — every worktree's own
/// `cargo test` reads the same on-disk copy (the pattern `engine/tests/common/mod.rs:15-19` and
/// `engine/LOD-PREREGISTRATION.md` §10 Amendment 4(d) already establish for `POLYGONS_100K` and
/// `PARCELS_5GB`: an absolute path, never resolved under `CARGO_MANIFEST_DIR`).
const CORPUS_ROOT: &str = r"C:\dev\spatial-ide\target\fixtures\compat-corpus";

fn manifest_path() -> PathBuf {
    Path::new(CORPUS_ROOT).join("MANIFEST.json")
}

fn derivations_path() -> PathBuf {
    Path::new(CORPUS_ROOT).join("mutations").join("DERIVATIONS.json")
}

/// `sha256(file)` as lowercase hex, or `None` if the file cannot be read at all — never a panic, so
/// an absent corpus file is a recorded row rather than a killed test run (§8: "a mismatch invalidates
/// the row", not the run).
fn sha256_hex(path: &Path) -> Option<String> {
    let bytes = std::fs::read(path).ok()?;
    let mut hasher = Sha256::new();
    hasher.update(&bytes);
    Some(hasher.finalize().iter().map(|b| format!("{b:02x}")).collect())
}

/// The one comparison the RECORDED MUTATION above inverts.
fn sha256_matches(actual: &Option<String>, expected: &str) -> bool {
    actual.as_deref() == Some(expected)
}

// ---- §3 / §4's preregistered predictions, as data ------------------------------------------

#[derive(Clone, Copy)]
enum Prediction {
    /// §3: "admitted-as-declared" — no format rule touched anything.
    AdmittedAsDeclared,
    /// §3/§4: "admitted-under-format-rule", naming the specific provenance class the preregistration
    /// names (`crs:format-default` or `axis:format-override`).
    AdmittedUnderFormatRule(&'static str),
    /// §3/§4: "refused-by-name", naming the `engine.<code>` refusal identifier.
    RefusedByName(&'static str),
    /// §4 M-2: "not derivable statically — record at P4" — only that the open fails; §5's registered
    /// predictions do not name a variant, so none is compared here.
    OpenFailsUndetermined,
    /// §4 M-1c / M-1a-equivalent: the preregistered "Brief A" text names the G-A2 workflow (P5's
    /// and not approximated — Amendment 1 item 9; still unscored — Amendment 7 (iii) item 2), a
    /// different instrument from this run's single [`Dataset::open`]. See this file's own doc
    /// comment.
    OutOfScopeForThisInstrument,
}

struct RowSpec {
    /// `#1`..`#12` for the main set (§3's own numbering) or `M-2`/`M-3`/`M-4`/`M-1c`/
    /// `M-1a-equivalent` for the mutations (§4's own naming).
    id: &'static str,
    /// Path under `CORPUS_ROOT`, matching `MANIFEST.json`'s `path` field with the
    /// `target/fixtures/compat-corpus/` prefix stripped.
    suffix: &'static str,
    pipeline: &'static str,
    citation: &'static str,
    prediction: Prediction,
    /// Set only where §3/§4's own text names a *specific mechanism* beyond the three-way
    /// admitted-as-declared / admitted-under-format-rule / refused-by-name class — e.g. M-4's row
    /// names R-S3 by the covering column it repoints to. `None` everywhere else: the coarser class
    /// comparison in [`evaluate`] is what §3/§4's headline predictions state, and inventing a
    /// mechanism-level check no prediction text names would compare against something never
    /// registered.
    expect_sanity_reason_contains: Option<&'static str>,
    /// §3's own registered sanity level for this row (`metadata` / `none` / `sample`), where §3
    /// names one — main-set rows only (§3's "Sanity levels recorded" summary: `metadata` ×3 for #3,
    /// #6, #8; `none` ×4 for #1, #7, #9, #10; the other six main-set rows are refused before a
    /// sanity check runs, so §3 registers none for them). `None` for every mutation row: §3 does not
    /// register mutation-row sanity levels this way, and S3's check is scoped to the main set.
    registered_sanity_level: Option<&'static str>,
    /// §3 row 3's own registered declared axis order, retained as a recorded fact (the
    /// `declared_axis_order` metadata key) — `Some("latitude,longitude")` for row #3 only, `None`
    /// everywhere else (no other row's §3/§4 cell registers a retained declared order).
    registered_declared_axis_order: Option<&'static str>,
    /// `Some(reason)` for the two rows (#3, #8) whose §3 cell also ends with a boundary-8
    /// publish-preflight refusal and the equirectangular statement — a component a single
    /// [`Dataset::open`] cannot reach; `None` everywhere else. §8's `unrun — reason` rule applies
    /// to that one component; the rest of each cell is still compared on its own terms.
    unrun_boundary8_reason: Option<&'static str>,
}

fn main_set_rows() -> Vec<RowSpec> {
    vec![
        RowSpec {
            id: "#1",
            suffix: "geopandas/gp-epsg2056-intkey.parquet",
            pipeline: "GeoPandas / pyarrow",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 1",
            prediction: Prediction::AdmittedAsDeclared,
            expect_sanity_reason_contains: None,
            registered_sanity_level: Some("none"),
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#2",
            suffix: "geopandas/gp-nocrs-nokey.parquet",
            pipeline: "GeoPandas / pyarrow",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 2",
            prediction: Prediction::RefusedByName("engine.geo_metadata"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#3",
            suffix: "geopandas/gp-epsg4326-covering.parquet",
            pipeline: "GeoPandas / pyarrow",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 3",
            prediction: Prediction::AdmittedUnderFormatRule("axis:format-override"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: Some("metadata"),
            registered_declared_axis_order: Some("latitude,longitude"),
            unrun_boundary8_reason: Some(
                "a single Dataset::open cannot reach a publish preflight",
            ),
        },
        RowSpec {
            id: "#4",
            suffix: "duckdb-spatial/duckdb-lv95range-intkey.parquet",
            pipeline: "DuckDB spatial",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 4",
            prediction: Prediction::RefusedByName("engine.geo_metadata"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#5",
            suffix: "duckdb-spatial/duckdb-degreesrange-nokey.parquet",
            pipeline: "DuckDB spatial",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 5",
            prediction: Prediction::RefusedByName("engine.geo_metadata"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#6",
            suffix: "duckdb-spatial/duckdb-mercatorrange-strkey.parquet",
            pipeline: "DuckDB spatial",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 6",
            prediction: Prediction::RefusedByName("engine.format_default_contradicted"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: Some("metadata"),
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#7",
            suffix: "gdal/ogr2ogr-epsg2056-default.parquet",
            pipeline: "GDAL 3.11.3 ogr2ogr",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 7",
            prediction: Prediction::AdmittedAsDeclared,
            expect_sanity_reason_contains: None,
            registered_sanity_level: Some("none"),
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#8",
            suffix: "gdal/ogr2ogr-epsg4326-default.parquet",
            pipeline: "GDAL 3.11.3 ogr2ogr",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 8",
            prediction: Prediction::AdmittedUnderFormatRule("crs:format-default"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: Some("metadata"),
            registered_declared_axis_order: None,
            unrun_boundary8_reason: Some(
                "a single Dataset::open cannot reach a publish preflight",
            ),
        },
        RowSpec {
            id: "#9",
            suffix: "gdal/ogr2ogr-epsg2056-no-covering.parquet",
            pipeline: "GDAL 3.11.3 ogr2ogr",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 9",
            prediction: Prediction::AdmittedAsDeclared,
            expect_sanity_reason_contains: None,
            registered_sanity_level: Some("none"),
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#10",
            suffix: "qgis/qgis-savefeatures-epsg2056.parquet",
            pipeline: "QGIS 3.44.2 qgis_process",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 10",
            prediction: Prediction::AdmittedAsDeclared,
            expect_sanity_reason_contains: None,
            registered_sanity_level: Some("none"),
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#11",
            suffix: "geoparquet-spec/example.parquet",
            pipeline: "GeoParquet specification example",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 11",
            prediction: Prediction::RefusedByName("engine.geo_metadata"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "#12",
            suffix: "overture/overture-2026-08-19.0-building-bern.parquet",
            pipeline: "Overture Maps CLI",
            citation: "ADMISSION-PREREGISTRATION.md §3 row 12",
            prediction: Prediction::RefusedByName("engine.geo_metadata"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
    ]
}

fn mutation_rows() -> Vec<RowSpec> {
    vec![
        RowSpec {
            id: "M-2",
            suffix: "mutations/gp-epsg2056-intkey-truncated.parquet",
            pipeline: "derived from geopandas/gp-epsg2056-intkey.parquet",
            citation: "ADMISSION-PREREGISTRATION.md §4 mutation table, M-2",
            prediction: Prediction::OpenFailsUndetermined,
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "M-3",
            suffix: "mutations/gp-epsg2056-intkey-geojson-invalid.parquet",
            pipeline: "derived from geopandas/gp-epsg2056-intkey.parquet",
            citation: "ADMISSION-PREREGISTRATION.md §4 mutation table, M-3",
            prediction: Prediction::RefusedByName("engine.geo_metadata"),
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "M-4",
            suffix: "mutations/ogr2ogr-epsg2056-default-covering-absent-columns.parquet",
            pipeline: "derived from gdal/ogr2ogr-epsg2056-default.parquet",
            citation: "ADMISSION-PREREGISTRATION.md §4 mutation table, M-4",
            prediction: Prediction::AdmittedAsDeclared,
            expect_sanity_reason_contains: Some("no_such_bbox_column"),
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "M-1c",
            suffix: "mutations/gp-epsg2056-intkey-changed-same-size.parquet",
            pipeline: "derived from geopandas/gp-epsg2056-intkey.parquet",
            citation: "ADMISSION-PREREGISTRATION.md §4 mutation table, M-1c",
            prediction: Prediction::OutOfScopeForThisInstrument,
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
        RowSpec {
            id: "M-1a-equivalent",
            suffix: "mutations/gp-epsg2056-intkey-appended.parquet",
            pipeline: "derived from geopandas/gp-epsg2056-intkey.parquet",
            citation: "ADMISSION-PREREGISTRATION.md §4 mutation table, M-1a-equivalent",
            prediction: Prediction::OutOfScopeForThisInstrument,
            expect_sanity_reason_contains: None,
            registered_sanity_level: None,
            registered_declared_axis_order: None,
            unrun_boundary8_reason: None,
        },
    ]
}

// ---- What actually happened -----------------------------------------------------------------

enum Observed {
    Admitted {
        crs: String,
        crs_provenance: String,
        crs_source: String,
        axis_provenance: String,
        /// `declared_axis_order` (`engine/src/envelope.rs:134-135`) — the definition's own axis
        /// order, retained whenever a definition existed; absent (`None`) where none did.
        declared_axis_order: Option<String>,
        format_rule_reference: Option<String>,
        /// `coordinate_unit` (`engine/src/envelope.rs:150`) — always present for an admitted row.
        coordinate_unit: String,
        /// `coordinate_unit_source` (`engine/src/envelope.rs:151-153`) — which of the two sources
        /// supplied the unit; absent where there was neither.
        coordinate_unit_source: Option<String>,
        sanity_level: String,
        sanity_reason: String,
        identity_class: &'static str,
    },
    Refused {
        code: String,
        detail: String,
    },
}

/// Mirrors `kernel/src/skp.rs::error_of`'s naming (`engine.` + the variant's own snake_case name) —
/// duplicated here rather than imported, because `engine/tests/` cannot depend on the downstream
/// `kernel` crate (kernel depends on engine, never the reverse). Only the variants this corpus can
/// reach are named explicitly; anything else is still recorded, via its `Debug` tag, rather than
/// panicking the run — an unexpected refusal is a result, not a crash.
fn refusal_code(e: &EngineError) -> String {
    let name = match e {
        EngineError::Source(_) => "source",
        EngineError::CrsUndeclared { .. } => "crs_undeclared",
        EngineError::GeoMetadata(_) => "geo_metadata",
        EngineError::FormatDefaultContradicted { .. } => "format_default_contradicted",
        EngineError::IdentityUnusable { .. } => "identity_unusable",
        EngineError::IdentityOrdinalPartitionedUnsupported { .. } => {
            "identity_ordinal_partitioned_unsupported"
        }
        EngineError::AxisOrderUnsupported { .. } => "axis_order_unsupported",
        EngineError::AxisOrderUnestablished { .. } => "axis_order_unestablished",
        EngineError::InternalInconsistency { .. } => "internal_inconsistency",
        EngineError::Wkb(_) => "wkb",
        EngineError::Query(_) => "query",
        EngineError::ConnectionSetup { .. } => "connection_setup",
        other => return format!("engine.<unmapped:{other:?}>"),
    };
    format!("engine.{name}")
}

/// The `native` / `mapped` / `session-ordinal` arms below are the second duplicated kernel
/// vocabulary in this file (the first is `refusal_code`'s, above); the kernel's own match on the
/// same three variants is `kernel/src/skp.rs:1073-1077`.
fn open_and_observe(path: &Path) -> Observed {
    match Dataset::open(path) {
        Ok(ds) => {
            let md = ds.envelope().schema().metadata().clone();
            let get = |k: &str| md.get(k).cloned().unwrap_or_default();
            let identity_class = match ds.identity().source() {
                IdSource::File => "native",
                IdSource::Mapped { .. } => "mapped",
                IdSource::SessionOrdinal => "session-ordinal",
            };
            Observed::Admitted {
                crs: get("crs"),
                crs_provenance: get("crs_provenance"),
                crs_source: get("crs_source"),
                axis_provenance: get("axis_provenance"),
                declared_axis_order: md.get("declared_axis_order").cloned(),
                format_rule_reference: md.get("format_rule_reference").cloned(),
                coordinate_unit: get("coordinate_unit"),
                coordinate_unit_source: md.get("coordinate_unit_source").cloned(),
                sanity_level: get("sanity_level"),
                sanity_reason: get("sanity_reason"),
                identity_class,
            }
        }
        Err(e) => Observed::Refused { code: refusal_code(&e), detail: e.to_string() },
    }
}

// ---- Comparing observed against predicted -----------------------------------------------------

enum Verdict {
    AsPredicted,
    Deviation,
    /// §4 M-2: no specific variant was predicted; any refusal is recorded rather than compared.
    RecordedNoSpecificPrediction,
    /// §4 M-1c / M-1a-equivalent: a different instrument's prediction (see this file's doc comment).
    NotComparableDifferentInstrument,
}

impl Verdict {
    fn label(&self) -> &'static str {
        match self {
            Verdict::AsPredicted => "as predicted",
            Verdict::Deviation => "DEVIATION",
            Verdict::RecordedNoSpecificPrediction => "recorded (no specific prediction)",
            Verdict::NotComparableDifferentInstrument => "not comparable (different instrument)",
        }
    }
}

/// Every admitted row this corpus predicts is session-ordinal (§3's identity-class summary —
/// carried forward to the two admitted mutations, M-4 and M-1c, both derived from session-ordinal
/// bases).
const EXPECTED_ADMITTED_IDENTITY_CLASS: &str = "session-ordinal";

/// The sanity level this instrument actually observed for a row, structured — not the free-text
/// `sanity_reason`. An admitted row carries it directly on the envelope metadata. A row refused
/// `engine.format_default_contradicted` also carries one: it was convicted *during* the sanity check
/// (`convict_or_record`, `engine/src/dataset.rs:1107-1126`), whose `detail` interpolates the level as
/// `` at level `{level}`, `` (`dataset.rs:1116-1117`) — parsed here from the engine's own bytes, the
/// same way the runner elsewhere checks `sanity_reason` substrings rather than re-implementing the
/// rule. Every other refusal happens before a sanity check runs, so it carries none.
fn observed_sanity_level(observed: &Observed) -> Option<String> {
    match observed {
        Observed::Admitted { sanity_level, .. } => Some(sanity_level.clone()),
        Observed::Refused { code, detail } if code == "engine.format_default_contradicted" => {
            detail.split("at level `").nth(1).and_then(|rest| rest.split('`').next()).map(String::from)
        }
        Observed::Refused { .. } => None,
    }
}

fn evaluate(
    prediction: &Prediction,
    observed: &Observed,
    expect_sanity_reason_contains: Option<&str>,
    registered_sanity_level: Option<&str>,
    registered_declared_axis_order: Option<&str>,
) -> (Verdict, String) {
    let (verdict, note) = evaluate_class(prediction, observed);
    // A row whose §3/§4 text names a *specific mechanism* (not only the coarse three-way class) is
    // held to that mechanism too, even where the coarse class above already matched — M-4's own row
    // is the one case in this corpus where the mechanism differs from the class (§4 names R-S3; the
    // declared-CRS short-circuit reaches "none" first instead, a fact the coarse class check alone
    // cannot see because both paths report the same class and the same level).
    if let (Some(needle), Observed::Admitted { sanity_reason, .. }) =
        (expect_sanity_reason_contains, observed)
    {
        if !sanity_reason.contains(needle) {
            return (
                Verdict::Deviation,
                format!(
                    "{note} ADDITIONALLY: §3/§4's text names a specific mechanism whose reason \
                     should contain {needle:?}; observed sanity_reason = {sanity_reason:?}, which \
                     does not. The coarse class matched, but the mechanism that produced it did \
                     not — this is the deviation."
                ),
            );
        }
    }
    // S3: a main-set row §3 registers a sanity level for is held to that level too, even where the
    // coarse class above already matched — the same "mechanism, not only class" shape as the block
    // above, against §3's own registered levels rather than §4's mechanism text.
    if let Some(expected_level) = registered_sanity_level {
        let observed_level = observed_sanity_level(observed);
        if observed_level.as_deref() != Some(expected_level) {
            return (
                Verdict::Deviation,
                format!(
                    "{note} ADDITIONALLY: §3 registers this row's sanity level as {expected_level:?}; \
                     observed sanity level = {observed_level:?}, which does not match. The coarse \
                     class may have matched, but the registered sanity level did not — this is the \
                     deviation."
                ),
            );
        }
    }
    // B1(a): §3 row 3 registers this row's declared axis order as retained, a recorded fact (the
    // `declared_axis_order` metadata key, `engine/src/envelope.rs:134-135`) — held to that value
    // too, the same "mechanism, not only class" shape as the two blocks above.
    if let Some(expected_order) = registered_declared_axis_order {
        let observed_order = match observed {
            Observed::Admitted { declared_axis_order, .. } => declared_axis_order.clone(),
            Observed::Refused { .. } => None,
        };
        if observed_order.as_deref() != Some(expected_order) {
            return (
                Verdict::Deviation,
                format!(
                    "{note} ADDITIONALLY: §3 registers this row's declared axis order as \
                     {expected_order:?}, retained as a recorded fact (the `declared_axis_order` \
                     metadata key); observed declared_axis_order = {observed_order:?}, which does \
                     not match. The coarse class may have matched, but the registered retention \
                     did not — this is the deviation."
                ),
            );
        }
    }
    (verdict, note)
}

fn evaluate_class(prediction: &Prediction, observed: &Observed) -> (Verdict, String) {
    match (prediction, observed) {
        (Prediction::OutOfScopeForThisInstrument, Observed::Admitted { identity_class, .. }) => (
            Verdict::NotComparableDifferentInstrument,
            format!(
                "§4's Brief A text for this row describes the G-A2 open-then-mutate-then-query \
                 workflow (P5's and not approximated — Amendment 1 item 9; still \
                 unscored — Amendment 7 (iii) item 2); this \
                 instrument performs one standalone Dataset::open only. That open admitted \
                 (identity class {identity_class}), recorded as this instrument's own fact and not \
                 compared against the G-A2 text."
            ),
        ),
        (Prediction::OutOfScopeForThisInstrument, Observed::Refused { code, detail }) => (
            Verdict::NotComparableDifferentInstrument,
            format!(
                "§4's Brief A text for this row describes the G-A2 open-then-mutate-then-query \
                 workflow (P5's and not approximated — Amendment 1 item 9; still \
                 unscored — Amendment 7 (iii) item 2); this \
                 instrument performs one standalone Dataset::open only. That open refused \
                 {code} ({detail}), recorded as this instrument's own fact and not compared \
                 against the G-A2 text."
            ),
        ),
        (Prediction::OpenFailsUndetermined, Observed::Refused { code, detail }) => (
            Verdict::RecordedNoSpecificPrediction,
            format!(
                "§4 states the exact variant is \"not derivable statically — record at P4\"; \
                 observed refused {code} ({detail})."
            ),
        ),
        (Prediction::OpenFailsUndetermined, Observed::Admitted { .. }) => (
            Verdict::Deviation,
            "predicted the open to fail (variant undetermined per §4); observed: admitted."
                .to_string(),
        ),
        (Prediction::AdmittedAsDeclared, Observed::Admitted { format_rule_reference, identity_class, .. }) => {
            if let Some(reference) = format_rule_reference {
                (
                    Verdict::Deviation,
                    format!(
                        "predicted admitted-as-declared (no format rule); observed \
                         format_rule_reference = {reference:?}"
                    ),
                )
            } else if *identity_class != EXPECTED_ADMITTED_IDENTITY_CLASS {
                (
                    Verdict::Deviation,
                    format!(
                        "predicted identity class {EXPECTED_ADMITTED_IDENTITY_CLASS}; observed \
                         {identity_class}"
                    ),
                )
            } else {
                (Verdict::AsPredicted, "admitted-as-declared, session-ordinal.".to_string())
            }
        }
        (Prediction::AdmittedAsDeclared, Observed::Refused { code, detail }) => (
            Verdict::Deviation,
            format!("predicted admitted-as-declared; observed refused {code} ({detail})"),
        ),
        (
            Prediction::AdmittedUnderFormatRule(expected_provenance),
            Observed::Admitted {
                format_rule_reference,
                crs_provenance,
                axis_provenance,
                identity_class,
                ..
            },
        ) => match format_rule_reference {
            None => (
                Verdict::Deviation,
                "predicted admitted-under-format-rule; observed no format_rule_reference \
                 (admitted-as-declared)."
                    .to_string(),
            ),
            Some(_) => {
                let actual_provenance: &str = if crs_provenance == "crs:format-default" {
                    "crs:format-default"
                } else if axis_provenance == "axis:format-override" {
                    "axis:format-override"
                } else {
                    "unrecognized"
                };
                if actual_provenance != *expected_provenance {
                    (
                        Verdict::Deviation,
                        format!(
                            "predicted provenance {expected_provenance}; observed \
                             {actual_provenance} (crs_provenance={crs_provenance}, \
                             axis_provenance={axis_provenance})"
                        ),
                    )
                } else if *identity_class != EXPECTED_ADMITTED_IDENTITY_CLASS {
                    (
                        Verdict::Deviation,
                        format!(
                            "predicted identity class {EXPECTED_ADMITTED_IDENTITY_CLASS}; \
                             observed {identity_class}"
                        ),
                    )
                } else {
                    (
                        Verdict::AsPredicted,
                        format!(
                            "admitted-under-format-rule ({actual_provenance}), session-ordinal."
                        ),
                    )
                }
            }
        },
        (Prediction::AdmittedUnderFormatRule(expected_provenance), Observed::Refused { code, detail }) => (
            Verdict::Deviation,
            format!(
                "predicted admitted-under-format-rule ({expected_provenance}); observed refused \
                 {code} ({detail})"
            ),
        ),
        (Prediction::RefusedByName(expected_code), Observed::Refused { code, detail }) => {
            if code == expected_code {
                (Verdict::AsPredicted, format!("refused {code} ({detail})."))
            } else {
                (
                    Verdict::Deviation,
                    format!("predicted refusal {expected_code}; observed refused {code} ({detail})"),
                )
            }
        }
        (Prediction::RefusedByName(expected_code), Observed::Admitted { .. }) => (
            Verdict::Deviation,
            format!("predicted refusal {expected_code}; observed: admitted"),
        ),
    }
}

// ---- The manifest / derivations sha256 lookups --------------------------------------------

/// `suffix -> sha256` from `MANIFEST.json`'s `files` array, stripping the
/// `target/fixtures/compat-corpus/` prefix its own `path` field carries.
fn manifest_sha_by_suffix(manifest: &Value) -> BTreeMap<String, String> {
    let mut out = BTreeMap::new();
    for f in manifest["files"].as_array().expect("MANIFEST.json `files` is an array") {
        let path = f["path"].as_str().expect("file entry has a `path`");
        let sha = f["sha256"].as_str().expect("file entry has a `sha256`").to_string();
        let suffix = path
            .strip_prefix("target/fixtures/compat-corpus/")
            .unwrap_or(path)
            .to_string();
        out.insert(suffix, sha);
    }
    out
}

/// `suffix -> mutation_sha256` from `mutations/DERIVATIONS.json`'s `mutations` array — the mutation
/// files' own second, independent hash source (§8: mutations hash-verified against
/// `DERIVATIONS.json` too, not only `MANIFEST.json`).
fn derivations_sha_by_suffix(derivations: &Value) -> BTreeMap<String, String> {
    let mut out = BTreeMap::new();
    for m in derivations["mutations"].as_array().expect("DERIVATIONS.json `mutations` is an array")
    {
        let path = m["path"].as_str().expect("mutation entry has a `path`");
        let sha = m["observed_difference"]["mutation_sha256"]
            .as_str()
            .expect("mutation entry has observed_difference.mutation_sha256")
            .to_string();
        out.insert(format!("mutations/{}", path.strip_prefix("mutations/").unwrap_or(path)), sha);
    }
    out
}

fn git_head(repo_root: &Path) -> String {
    Command::new("git")
        .args(["rev-parse", "HEAD"])
        .current_dir(repo_root)
        .output()
        .ok()
        .filter(|o| o.status.success())
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim().to_string())
        .unwrap_or_else(|| "unknown (git rev-parse HEAD failed)".to_string())
}

/// UTC calendar date from `SystemTime::now()`, computed without a date-library dependency (Howard
/// Hinnant's `civil_from_days`, public-domain algorithm) — deliberately not a shell-out to `date`,
/// so the header does not depend on what happens to be on `PATH` when this test runs.
fn today_utc() -> String {
    let secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("system clock before 1970")
        .as_secs();
    let days = (secs / 86_400) as i64;
    let z = days + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = (z - era * 146_097) as u64;
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe as i64 + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if m <= 2 { y + 1 } else { y };
    format!("{y:04}-{m:02}-{d:02}")
}

// ---- The runner --------------------------------------------------------------------------

#[ignore = "opens real on-disk fixtures under target/fixtures/compat-corpus; run explicitly, on a \
            quiet machine (no spatial-ide-shell.exe running) — Brief A P4"]
#[test]
fn the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results() {
    let manifest_raw = std::fs::read_to_string(manifest_path())
        .unwrap_or_else(|e| panic!("MANIFEST.json unreadable at {CORPUS_ROOT}: {e}"));
    let manifest: Value =
        serde_json::from_str(&manifest_raw).expect("MANIFEST.json parses as JSON");
    let manifest_sha256 = {
        let mut h = Sha256::new();
        h.update(manifest_raw.as_bytes());
        h.finalize().iter().map(|b| format!("{b:02x}")).collect::<String>()
    };
    let by_suffix_manifest = manifest_sha_by_suffix(&manifest);

    let derivations_raw = std::fs::read_to_string(derivations_path())
        .unwrap_or_else(|e| panic!("DERIVATIONS.json unreadable: {e}"));
    let derivations: Value =
        serde_json::from_str(&derivations_raw).expect("DERIVATIONS.json parses as JSON");
    let by_suffix_derivations = derivations_sha_by_suffix(&derivations);

    let mut rows = main_set_rows();
    rows.extend(mutation_rows());
    let total_rows = rows.len();
    assert_eq!(total_rows, 17, "§3's 12 main-set rows plus §4's 5 mutation rows");

    struct RowRecord {
        spec_id: &'static str,
        suffix: &'static str,
        pipeline: &'static str,
        citation: &'static str,
        pre_hash_ok: bool,
        post_hash_ok: bool,
        summary: String,
        verdict_label: &'static str,
        note: String,
        /// The remaining fields exist so §5's predictions (below, after the loop) are computed from
        /// what was actually observed per row, never hand-typed against the corpus.
        main_set: bool,
        refusal_code: Option<String>,
        crs_provenance: Option<String>,
        axis_provenance: Option<String>,
        sanity_level: Option<String>,
    }

    let mut records = Vec::with_capacity(total_rows);
    let mut counts: BTreeMap<&'static str, u32> = BTreeMap::new();
    let mut rows_opened: u32 = 0;
    let mut deviation_rows: Vec<&'static str> = Vec::new();

    for row in &rows {
        let full_path = Path::new(CORPUS_ROOT).join(row.suffix);
        let actual_sha = sha256_hex(&full_path);

        let expected_manifest_sha =
            by_suffix_manifest.get(row.suffix).cloned().unwrap_or_default();
        let manifest_ok = !expected_manifest_sha.is_empty()
            && sha256_matches(&actual_sha, &expected_manifest_sha);
        let is_mutation = row.suffix.starts_with("mutations/");
        let derivations_ok = if is_mutation {
            let expected_derivations_sha =
                by_suffix_derivations.get(row.suffix).cloned().unwrap_or_default();
            !expected_derivations_sha.is_empty()
                && sha256_matches(&actual_sha, &expected_derivations_sha)
        } else {
            true // not applicable to a main-set row; vacuously true, never gated on
        };
        let pre_hash_ok = actual_sha.is_some() && manifest_ok && derivations_ok;

        let main_set = row.id.starts_with('#');

        if !pre_hash_ok {
            let reason = if actual_sha.is_none() { "absent" } else { "hash mismatch" };
            *counts.entry("unrun").or_insert(0) += 1;
            records.push(RowRecord {
                spec_id: row.id,
                suffix: row.suffix,
                pipeline: row.pipeline,
                citation: row.citation,
                pre_hash_ok: false,
                post_hash_ok: false,
                summary: format!("unrun — {reason}"),
                verdict_label: "unrun",
                note: "hash verification failed before the file was ever opened; §8's rule — a \
                       mismatch invalidates the row rather than the run."
                    .to_string(),
                main_set,
                refusal_code: None,
                crs_provenance: None,
                axis_provenance: None,
                sanity_level: None,
            });
            continue;
        }

        let observed = open_and_observe(&full_path);
        rows_opened += 1;
        let (verdict, note) = evaluate(
            &row.prediction,
            &observed,
            row.expect_sanity_reason_contains,
            row.registered_sanity_level,
            row.registered_declared_axis_order,
        );

        // B1(b): rows #3 and #8's §3 cell also ends with a boundary-8 publish-preflight refusal and
        // the equirectangular statement — a component a single Dataset::open cannot reach. Record it
        // as unrun (§8's `unrun — reason` rule), name what the rest of the cell compared, and never
        // let the row's label read as an unqualified "as predicted" for the cell as a whole.
        let note = if let Some(reason) = row.unrun_boundary8_reason {
            let mut compared: Vec<&str> = vec!["class", "provenance", "identity", "sanity level"];
            if row.registered_declared_axis_order.is_some() {
                compared.push("the registered declared axis order (retention)");
            }
            format!(
                "{note} §3's Brief A cell for this row also ends with a boundary-8 publish-\
                 preflight refusal and the equirectangular statement; that component is recorded \
                 unrun — {reason} (§8's `unrun — reason` rule: a registered element not run is \
                 never a pass by omission). What this instrument compared against the rest of the \
                 cell — {} — stands on its own, above.",
                compared.join(", "),
            )
        } else {
            note
        };
        let verdict_label: &'static str = if row.unrun_boundary8_reason.is_some() {
            match verdict {
                Verdict::AsPredicted => {
                    "as predicted (class/provenance/identity/sanity/retention only) — boundary-8 \
                     preflight unrun"
                }
                Verdict::Deviation => {
                    "DEVIATION (class/provenance/identity/sanity/retention) — boundary-8 preflight \
                     also unrun"
                }
                _ => verdict.label(),
            }
        } else {
            verdict.label()
        };

        let mut rec_refusal_code = None;
        let mut rec_crs_provenance = None;
        let mut rec_axis_provenance = None;
        // Assigned in both match arms below (never left at a placeholder), so it is declared
        // without one.
        let rec_sanity_level;

        let summary = match &observed {
            Observed::Admitted {
                crs,
                crs_provenance,
                crs_source,
                axis_provenance,
                declared_axis_order,
                format_rule_reference,
                coordinate_unit,
                coordinate_unit_source,
                sanity_level,
                sanity_reason,
                identity_class,
                ..
            } => {
                let class = if format_rule_reference.is_some() {
                    "admitted-under-format-rule"
                } else {
                    "admitted-as-declared"
                };
                *counts.entry(class).or_insert(0) += 1;
                rec_crs_provenance = Some(crs_provenance.clone());
                rec_axis_provenance = Some(axis_provenance.clone());
                rec_sanity_level = Some(sanity_level.clone());
                format!(
                    "{class} — crs={crs}, crs_provenance={crs_provenance}, \
                     crs_source={crs_source}, axis_provenance={axis_provenance}, \
                     declared_axis_order={declared_axis_order:?}, \
                     format_rule_reference={format_rule_reference:?}, \
                     coordinate_unit={coordinate_unit}, \
                     coordinate_unit_source={coordinate_unit_source:?}, \
                     sanity_level={sanity_level} ({sanity_reason}), identity={identity_class}"
                )
            }
            Observed::Refused { code, detail } => {
                *counts.entry("refused-by-name").or_insert(0) += 1;
                rec_refusal_code = Some(code.clone());
                rec_sanity_level = observed_sanity_level(&observed);
                format!("refused-by-name {code} — {detail}")
            }
        };

        // The post-run re-hash happens below, after every row has been opened; recorded per row
        // here as a placeholder overwritten in the second pass.
        if matches!(verdict, Verdict::Deviation) {
            deviation_rows.push(row.id);
        }
        records.push(RowRecord {
            spec_id: row.id,
            suffix: row.suffix,
            pipeline: row.pipeline,
            citation: row.citation,
            pre_hash_ok: true,
            post_hash_ok: false, // filled in by the post-run pass below
            summary,
            verdict_label,
            note,
            main_set,
            refusal_code: rec_refusal_code,
            crs_provenance: rec_crs_provenance,
            axis_provenance: rec_axis_provenance,
            sanity_level: rec_sanity_level,
        });
    }

    // ---- Post-run hash verification: every file that was opened must be byte-identical to what
    // it was before it was opened (an admission open must not mutate the source it reads). Mutation
    // rows are checked against both sources again, matching the pre-run check.
    for record in &mut records {
        if !record.pre_hash_ok {
            continue;
        }
        let full_path = Path::new(CORPUS_ROOT).join(record.suffix);
        let actual_sha = sha256_hex(&full_path);
        let manifest_ok = by_suffix_manifest
            .get(record.suffix)
            .is_some_and(|expected| sha256_matches(&actual_sha, expected));
        let derivations_ok = if record.suffix.starts_with("mutations/") {
            by_suffix_derivations
                .get(record.suffix)
                .is_some_and(|expected| sha256_matches(&actual_sha, expected))
        } else {
            true
        };
        record.post_hash_ok = manifest_ok && derivations_ok;
    }

    // ---- §5's registered predictions, resolved by name, computed from `records` above (never
    // hand-typed against the corpus — only the expected values §5 itself registers are literal).
    let p1_refusals: Vec<&str> = records
        .iter()
        .filter(|r| r.main_set && r.refusal_code.as_deref() == Some("engine.geo_metadata"))
        .map(|r| r.spec_id)
        .collect();
    let p1_expected: Vec<&str> = vec!["#2", "#4", "#5", "#11", "#12"];
    let p1_status = if p1_refusals == p1_expected { "borne out" } else { "not borne out" };

    let p2_rows: Vec<&str> = records
        .iter()
        .filter(|r| r.main_set && r.refusal_code.as_deref() == Some("engine.format_default_contradicted"))
        .map(|r| r.spec_id)
        .collect();
    let p2_status = if p2_rows == vec!["#6"] { "borne out" } else { "not borne out" };

    // `axis_provenance` alone is not the row's *primary* provenance class — #8 also carries
    // `axis:format-override` (it has no declared axis either), but its primary class is
    // `crs:format-default` because `evaluate_class` above checks `crs_provenance` first. The same
    // precedence is applied here so "exercises axis:format-override" means what §3/§5 mean by it.
    let p3_rows: Vec<&str> = records
        .iter()
        .filter(|r| {
            r.main_set
                && r.axis_provenance.as_deref() == Some("axis:format-override")
                && r.crs_provenance.as_deref() != Some("crs:format-default")
        })
        .map(|r| r.spec_id)
        .collect();
    let p3_status = if p3_rows == vec!["#3"] {
        "borne out (primary-provenance precedence applied: a row whose crs_provenance is \
         crs:format-default is counted under prediction 2, not here, even where its \
         axis_provenance is also axis:format-override — #8 is excluded from this count on that \
         precedence)"
    } else {
        "not borne out (primary-provenance precedence applied: a row whose crs_provenance is \
         crs:format-default is counted under prediction 2, not here, even where its \
         axis_provenance is also axis:format-override)"
    };

    // Prediction 4 names the G-A2 workflow this instrument cannot exercise (see this file's own doc
    // comment); §8's `unrun — reason` rule applies rather than a pass-by-omission "borne out".
    let m1c_verdict = records.iter().find(|r| r.spec_id == "M-1c").map(|r| r.verdict_label);
    let p4_status = match m1c_verdict {
        Some("not comparable (different instrument)") => {
            "unrun — this instrument performs one standalone Dataset::open; §4's Brief A text for \
             M-1c describes the G-A2 open-then-mutate-then-query workflow, which Amendment 1, item 9 \
             states is P5's and not approximated, and which Amendment 7 (iii) item 2 states G-A2 \
             remains unscored (see the M-1c row's own note, above)"
                .to_string()
        }
        Some(other) => format!(
            "not borne out — the M-1c row recorded verdict {other:?}, not \"not comparable \
             (different instrument)\""
        ),
        None => "unrun — the M-1c row is absent from this run".to_string(),
    };

    let p5_sample_rows: Vec<&str> = records
        .iter()
        .filter(|r| r.main_set && r.sanity_level.as_deref() == Some("sample"))
        .map(|r| r.spec_id)
        .collect();
    let p5_status = if p5_sample_rows.is_empty() { "borne out" } else { "not borne out" };

    // Prediction 6 claims a trend across "any wider producer set" (§5's own words); this fixed
    // 17-file corpus carries at most one instance of each path, so a population-level trend is
    // structurally unrun by this instrument regardless of what the two counts below turn out to be.
    let crs_format_default_count = records
        .iter()
        .filter(|r| r.main_set && r.crs_provenance.as_deref() == Some("crs:format-default"))
        .count();
    // Same primary-provenance precedence as `p3_rows` above.
    let axis_format_override_count = records
        .iter()
        .filter(|r| {
            r.main_set
                && r.axis_provenance.as_deref() == Some("axis:format-override")
                && r.crs_provenance.as_deref() != Some("crs:format-default")
        })
        .count();
    let p6_status = format!(
        "unrun — this corpus carries {crs_format_default_count} crs:format-default instance(s) and \
         {axis_format_override_count} axis:format-override instance(s) (primary-provenance \
         precedence applied: a row whose crs_provenance is crs:format-default is counted in the \
         first figure and excluded from the second, even where its axis_provenance is also \
         axis:format-override); a population-level trend across any wider producer set is not \
         something a fixed corpus of this size samples"
    );

    // B1(b): a component of §3's own per-row cells (rows #3, #8), not one of §5's six registered
    // predictions — recorded here by name because it is a registered element this instrument does
    // not reach (§8's `unrun — reason` rule).
    let p_boundary8_status = "unrun — a single Dataset::open cannot reach a publish preflight; \
         §3's boundary-8 publish-preflight refusal and equirectangular statement for rows #3 and \
         #8 are not reached by this instrument (see each row's own note, above)";

    // ---- Write the GENERATED admission table --------------------------------------------------
    let repo_root =
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..").canonicalize().expect("repo root");
    let commit = git_head(&repo_root);
    let date = today_utc();

    let mut out = String::new();
    writeln!(out, "<!-- GENERATED by engine/tests/admission_p4_corpus.rs::the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results -->").unwrap();
    writeln!(out, "<!-- commit: {commit} -->").unwrap();
    writeln!(out, "<!-- corpus manifest: {CORPUS_ROOT}\\MANIFEST.json sha256:{manifest_sha256} -->").unwrap();
    writeln!(out, "<!-- generated: {date} -->").unwrap();
    writeln!(out).unwrap();
    writeln!(out, "# Admission table (P4) — GENERATED, never hand-edited").unwrap();
    writeln!(out).unwrap();
    writeln!(
        out,
        "Generator: `engine/tests/admission_p4_corpus.rs::the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results`. \
         Generated from the tree at `{commit}`. Corpus manifest: `{CORPUS_ROOT}\\MANIFEST.json`, sha256 `{manifest_sha256}`. Generated: {date}. \
         Correctness only — no duration, no rate, no timing appears anywhere in this file (ADR-018; the preregistration's boundary 10)."
    ).unwrap();
    writeln!(out).unwrap();
    writeln!(out, "| id | path (under `target/fixtures/compat-corpus/`) | pipeline | pre-hash | post-hash | observed | verdict | citation |").unwrap();
    writeln!(out, "|---|---|---|---|---|---|---|---|").unwrap();
    for r in &records {
        writeln!(
            out,
            "| {} | `{}` | {} | {} | {} | {} | {} | {} |",
            r.spec_id,
            r.suffix,
            r.pipeline,
            if r.pre_hash_ok { "match" } else { "MISMATCH/ABSENT" },
            if !r.pre_hash_ok {
                "n/a"
            } else if r.post_hash_ok {
                "match"
            } else {
                "MISMATCH — INVALIDATED"
            },
            r.summary.replace('|', "\\|"),
            r.verdict_label,
            r.citation,
        )
        .unwrap();
    }
    writeln!(out).unwrap();
    writeln!(out, "## Notes, by row").unwrap();
    writeln!(out).unwrap();
    for r in &records {
        writeln!(out, "- **{}** (`{}`): {}", r.spec_id, r.suffix, r.note.replace('\n', " ")).unwrap();
    }
    writeln!(out).unwrap();
    writeln!(out, "## Totals").unwrap();
    writeln!(out).unwrap();
    for (k, v) in &counts {
        writeln!(out, "- {k}: {v}").unwrap();
    }
    writeln!(out, "- total rows: {total_rows}").unwrap();
    writeln!(out).unwrap();
    if deviation_rows.is_empty() {
        writeln!(out, "No DEVIATION rows.").unwrap();
    } else {
        writeln!(out, "DEVIATION rows: {}", deviation_rows.join(", ")).unwrap();
    }
    writeln!(out).unwrap();
    writeln!(out, "## Predictions (§5), resolved by name").unwrap();
    writeln!(out).unwrap();
    writeln!(out, "| # | status |").unwrap();
    writeln!(out, "|---|---|").unwrap();
    writeln!(
        out,
        "| 1 | {p1_status} — polygon-gate refusals (main set, engine.geo_metadata): {} (§5 names: {}) |",
        p1_refusals.join(", "),
        p1_expected.join(", "),
    )
    .unwrap();
    writeln!(
        out,
        "| 2 | {p2_status} — engine.format_default_contradicted rows (main set): {} (§5 names: #6) |",
        p2_rows.join(", "),
    )
    .unwrap();
    writeln!(
        out,
        "| 3 | {p3_status} — axis:format-override rows (main set): {} (§5 names: #3) |",
        p3_rows.join(", "),
    )
    .unwrap();
    writeln!(out, "| 4 | {p4_status} |").unwrap();
    writeln!(
        out,
        "| 5 | {p5_status} — sample-level rows (main set): {} |",
        if p5_sample_rows.is_empty() { "none".to_string() } else { p5_sample_rows.join(", ") },
    )
    .unwrap();
    writeln!(out, "| 6 | {p6_status} |").unwrap();
    writeln!(out, "| §3 rows #3, #8 (boundary-8) | {p_boundary8_status} |").unwrap();

    let results_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("ADMISSION-RESULTS.md");
    std::fs::write(&results_path, &out).expect("write engine/ADMISSION-RESULTS.md");

    // ---- The assertions this measurement test must actually reach, not only its setup ----------
    // S1: the artifact above already recorded every row, including any "unrun — hash mismatch /
    // absent" one (§8's own rule: a mismatch invalidates the row, not the run's ability to record
    // it). This assertion is what keeps corpus drift red instead of only visible in the table.
    let not_run = *counts.get("unrun").unwrap_or(&0);
    assert_eq!(
        not_run, 0,
        "corpus drift: {not_run} row(s) recorded unrun — hash mismatch / absent; see the table just \
         written to {}",
        results_path.display()
    );
    assert_eq!(records.len(), total_rows, "every row produced exactly one record, none skipped");
    assert_eq!(
        rows_opened + not_run,
        total_rows as u32,
        "every row was either opened or recorded unrun — hash mismatch / absent; none silently \
         dropped"
    );
    // The RECORDED MUTATION target: with `sha256_matches` inverted, `pre_hash_ok` is false for
    // every row (bytes always differ from themselves under `!=`), so every row is recorded unrun —
    // hash mismatch and `not_run` is 17; `assert_eq!(not_run, 0, ...)` above is what fails — not a
    // setup-time panic — before this `assert!(rows_opened > 0, ...)` is ever reached.
    assert!(rows_opened > 0, "at least one row must have actually been opened and observed");
    for r in &records {
        if r.pre_hash_ok {
            assert!(
                r.post_hash_ok,
                "row {} ({}) changed on disk between the pre-run and post-run hash check — \
                 admission must never mutate the source it reads",
                r.spec_id, r.suffix
            );
        }
    }
    assert!(
        std::fs::metadata(&results_path).map(|m| m.len() > 0).unwrap_or(false),
        "engine/ADMISSION-RESULTS.md was written and is non-empty"
    );

    eprintln!(
        "P4 admission table: {rows_opened} row(s) opened, {not_run} unrun, {} DEVIATION row(s) \
         — see {}",
        deviation_rows.len(),
        results_path.display()
    );
}
