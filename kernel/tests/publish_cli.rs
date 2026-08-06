//! **The `publish-bundle` binary itself**, driven the way an operator drives it.
//!
//! ## Why this file exists at all
//!
//! `publish.rs` exercises the publish *library* thoroughly, and every viewport-CRS rule ADR-015 §7
//! states is already asserted against the *engine* in `engine/tests/slice.rs`. Both suites were
//! green while `publish-bundle --bbox` was refusing a whole source kind outright, because the defect
//! was in neither: it was in how the binary **composed** them. The CLI built a `ViewportQuery` whose
//! `bbox_crs` echoed `dataset.crs().identifier()`, and nothing tested the binary.
//!
//! A composition root that no test drives is a place where two correct modules can be wired together
//! wrongly and every suite stays green. So these tests run the built binary as a subprocess and read
//! the bundle it wrote off the disk.
//!
//! ## The rule being asserted, stated once
//!
//! ADR-015 §7: a viewport CRS identifier is a **caller assertion about the query**, and a viewport
//! sent with **no** CRS declares that its coordinates are already in the dataset's own. `--bbox`
//! carries no CRS, so it means exactly the second thing and the manifest records `bbox_crs: null`.
//!
//! Echoing the dataset's own identifier back was wrong on both source kinds, which is why both are
//! covered here:
//!
//! - **authority-identified** (`EPSG:2056`) — the echo manufactured a caller assertion the caller
//!   never made, out of the very value it would then be compared against. It could not fail, so it
//!   established nothing, and it wrote a claim into `operation.filter.bbox_crs` that no operator had
//!   asserted.
//! - **definition-only** — every such dataset shares the `(definition-only)` placeholder, and §7.3
//!   refuses a viewport that names it (`ViewportCrsUnidentifiable`). The echo therefore made `--bbox`
//!   **unusable on that entire source kind**, for a reason no operator could read off the command
//!   line. That test would have failed before this fix; it is the regression this file exists for.

use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec};

/// A style over the fixture's `zone` column, so the publish exercises the ordinary path rather than
/// a degenerate one.
const STYLE: &str = r##"{
  "style_version": 1,
  "layer": {
    "geometry": "polygon",
    "fill_color": {"match": {
      "column": "zone",
      "cases": [{"when": "residential", "then": "#aa3333"},
                {"when": "industrial",  "then": "#333388"}],
      "on_null": "#888888",
      "on_unmatched": "#cccccc"}},
    "fill_opacity": {"literal": 0.8},
    "outline_color": {"literal": "#202020"},
    "outline_width": {"literal": 1.0}
  }
}"##;

/// The fixture's grid is 40 m per cell from `(E_LO, N_LO)`, so this window covers a subset of a
/// 2 000-feature fixture rather than all of it or none of it. Both are asserted, because a filter
/// that selected everything would make "the filter was applied" unfalsifiable.
const FEATURES: usize = 2_000;
const WINDOW: f64 = 600.0;

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-publish-cli-tests").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn fixture(dir: &Path, crs_mode: CrsMode) -> PathBuf {
    let path = dir.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: FEATURES,
            attributes: AttributeMode::CategoricalZone,
            crs_mode,
            ..Default::default()
        },
    )
    .unwrap();
    path
}

fn style_file(dir: &Path) -> PathBuf {
    let path = dir.join("style.json");
    std::fs::write(&path, STYLE).unwrap();
    path
}

/// A viewer directory rather than `ViewerAssets`: the binary takes `--viewer <dir>` and reads it,
/// and that read is part of what these tests are driving.
fn viewer_dir(dir: &Path) -> PathBuf {
    let path = dir.join("viewer");
    std::fs::create_dir_all(&path).unwrap();
    std::fs::write(path.join("index.html"), b"<!doctype html><title>t</title>").unwrap();
    std::fs::write(path.join("app.js"), b"export const ok = 1;\n").unwrap();
    path
}

/// Run the built binary. **The binary, not a re-implementation of its argument handling** — the
/// defect this file covers lived in argument handling.
fn publish_bundle(args: &[&str]) -> Output {
    Command::new(env!("CARGO_BIN_EXE_publish-bundle"))
        .args(args)
        .output()
        .expect("run publish-bundle")
}

fn assert_ok(out: &Output, what: &str) {
    assert!(
        out.status.success(),
        "{what} failed with {}\n--- stdout ---\n{}\n--- stderr ---\n{}",
        out.status,
        String::from_utf8_lossy(&out.stdout),
        String::from_utf8_lossy(&out.stderr),
    );
}

fn manifest(bundle: &Path) -> serde_json::Value {
    let bytes = std::fs::read(bundle.join(spatial_kernel::bundle::MANIFEST_PATH))
        .expect("the bundle has a manifest");
    serde_json::from_slice(&bytes).expect("the manifest is JSON")
}

/// The `--bbox` window for a fixture, in that fixture's own coordinates.
fn bbox_arg() -> String {
    let (e, n) = (spatial_engine::fixture::E_LO, spatial_engine::fixture::N_LO);
    format!("{e},{n},{},{}", e + WINDOW, n + WINDOW)
}

/// Common assertions over a `--bbox` publish, so the two source kinds differ only in the fixture.
fn assert_bbox_filter_carries_no_caller_assertion(bundle: &Path) {
    let m = manifest(bundle);
    let filter = &m["operation"]["filter"];
    assert_eq!(
        filter["kind"].as_str().unwrap(),
        "covering-bbox-intersects",
        "the filter is not the one `--bbox` asks for"
    );
    // **The assertion this file exists for.** `null`, not the dataset's identifier: the operator
    // asserted nothing, so the manifest records nothing (ADR-015 §7; ADR-017 §6 lists
    // `operation.filter.bbox_crs` among the members whose bare `null` means "absent").
    assert_eq!(
        filter["bbox_crs"],
        serde_json::Value::Null,
        "`bbox_crs` echoes an assertion the operator never made: {}",
        filter["bbox_crs"]
    );
    // **The window the operator typed is the window the manifest records.** Checked because the
    // defect this file covers was in argument handling, and `--bbox` parsing is where a component
    // can go missing — see `a_bbox_with_an_unparseable_component_is_refused_rather_than_dropped`.
    let (e, n) = (spatial_engine::fixture::E_LO, spatial_engine::fixture::N_LO);
    for (member, want) in
        [("xmin", e), ("ymin", n), ("xmax", e + WINDOW), ("ymax", n + WINDOW)]
    {
        assert_eq!(
            filter[member].as_f64().unwrap(),
            want,
            "the manifest's filter.{member} is not the value `--bbox` was given"
        );
    }

    // The filter really ran: some rows were excluded, and some survived. Without both halves a
    // `bbox_crs` of `null` could be true of a publish that quietly ignored `--bbox` entirely.
    let rows = m["data"]["rows"].as_u64().unwrap();
    assert!(rows > 0, "the viewport selected nothing, so the publish proves nothing");
    assert!(
        rows < FEATURES as u64,
        "the viewport selected all {FEATURES} features, so no filtering is demonstrated"
    );
}

/// The authority-identified case: the echo was admissible here, and still wrong.
#[test]
fn a_bbox_publish_on_an_authority_identified_source_records_no_caller_assertion() {
    let d = workspace("authority-identified");
    let src = fixture(&d, CrsMode::DeclaredLv95);
    let dest = d.join("bundle");

    let out = publish_bundle(&[
        "--data",
        src.to_str().unwrap(),
        "--style",
        style_file(&d).to_str().unwrap(),
        "--viewer",
        viewer_dir(&d).to_str().unwrap(),
        "--out",
        dest.to_str().unwrap(),
        "--attributes",
        "zone",
        "--bbox",
        &bbox_arg(),
    ]);
    assert_ok(&out, "a --bbox publish on an authority-identified source");

    // The fixture really is the source kind this test names — otherwise the two tests below could
    // both be running against the same file and one of them would be decorative.
    assert_eq!(manifest(&dest)["crs"]["source"].as_str().unwrap(), "EPSG:2056");
    assert_bbox_filter_carries_no_caller_assertion(&dest);
}

/// The definition-only case: **this publish was impossible before the fix.**
///
/// `dataset.crs().identifier()` is the `(definition-only)` placeholder here, and ADR-015 §7.3
/// refuses a viewport that names it — so the binary's own echo made the engine refuse the binary's
/// own query, and `--bbox` had no working form at all on this source kind.
#[test]
fn a_bbox_publish_on_a_definition_only_source_is_possible_at_all() {
    let d = workspace("definition-only");
    let src = fixture(&d, CrsMode::DefinitionOnlyNoId);
    let dest = d.join("bundle");

    let out = publish_bundle(&[
        "--data",
        src.to_str().unwrap(),
        "--style",
        style_file(&d).to_str().unwrap(),
        "--viewer",
        viewer_dir(&d).to_str().unwrap(),
        "--out",
        dest.to_str().unwrap(),
        "--attributes",
        "zone",
        "--bbox",
        &bbox_arg(),
    ]);
    assert_ok(&out, "a --bbox publish on a definition-only source");

    // The fixture really is definition-only: this is the placeholder every such dataset shares, and
    // the reason §7.3 refuses a viewport that echoes it.
    assert_eq!(
        manifest(&dest)["crs"]["source"].as_str().unwrap(),
        spatial_engine::crs::DEFINITION_ONLY,
        "this fixture is not the definition-only source kind, so this test asserts nothing"
    );
    assert_bbox_filter_carries_no_caller_assertion(&dest);
}

/// **A `--bbox` component that is not a number refuses the publish rather than being dropped.**
///
/// The parser was `split(',').filter_map(|s| s.parse().ok())` followed by a length check, so a
/// malformed component vanished and any four surviving numbers became the window: `--bbox
/// junk,A,B,C,D` published `A,B,C,D` — a query the operator never asked for, irreversibly, with no
/// word said. A dropped argument is a different operation, and this binary performs a class-3
/// external side effect.
#[test]
fn a_bbox_with_an_unparseable_component_is_refused_rather_than_dropped() {
    let d = workspace("bbox-malformed");
    let src = fixture(&d, CrsMode::DeclaredLv95);
    let style = style_file(&d);
    let viewer = viewer_dir(&d);
    let (e, n) = (spatial_engine::fixture::E_LO, spatial_engine::fixture::N_LO);

    // Five fields, one of them junk: exactly the shape that used to collapse to a valid-looking
    // four-number window.
    let smuggled = format!("junk,{e},{n},{},{}", e + WINDOW, n + WINDOW);
    for bad in [smuggled.as_str(), "1,2,3", "1,2,3,4,5", "1,2,3,x", ""] {
        let dest = d.join(format!("bundle-{}", bad.len()));
        let out = publish_bundle(&[
            "--data",
            src.to_str().unwrap(),
            "--style",
            style.to_str().unwrap(),
            "--viewer",
            viewer.to_str().unwrap(),
            "--out",
            dest.to_str().unwrap(),
            "--attributes",
            "zone",
            "--bbox",
            bad,
        ]);
        assert!(
            !out.status.success(),
            "`--bbox {bad}` was accepted; stdout:\n{}",
            String::from_utf8_lossy(&out.stdout)
        );
        assert!(!dest.exists(), "`--bbox {bad}` wrote a bundle before failing");
    }
}

/// **`--license` without `--license-at` is refused, and the tool never substitutes its own clock.**
///
/// ADR-017 §10 makes `license.at` the instant the **operator made the declaration** and §12 keeps
/// **build** timing out of the manifest entirely. This binary passed its own `started_at` — the
/// build clock — as `license.at`, which put a value the manifest cannot support into the manifest
/// *and* made every operator-declared publish produce different bytes on every run, breaking §12's
/// byte-identity guarantee for that whole branch.
#[test]
fn an_operator_license_requires_its_declaration_instant_and_never_borrows_the_build_clock() {
    let d = workspace("license-at");
    let src = fixture(&d, CrsMode::DeclaredLv95);
    let style = style_file(&d);
    let viewer = viewer_dir(&d);
    let base = |dest: &str| -> Vec<String> {
        vec![
            "--data".into(),
            src.to_str().unwrap().into(),
            "--style".into(),
            style.to_str().unwrap().into(),
            "--viewer".into(),
            viewer.to_str().unwrap().into(),
            "--out".into(),
            d.join(dest).to_str().unwrap().into(),
            "--attributes".into(),
            "zone".into(),
        ]
    };
    let run = |args: Vec<String>| {
        publish_bundle(&args.iter().map(String::as_str).collect::<Vec<_>>())
    };

    // Refused, and nothing is written.
    let mut without = base("no-at");
    without.extend(["--license".into(), "CC-BY-4.0".into()]);
    let out = run(without);
    assert!(!out.status.success(), "--license without --license-at published anyway");
    assert!(
        String::from_utf8_lossy(&out.stderr).contains("--license-at"),
        "the refusal does not name the missing flag"
    );
    assert!(!d.join("no-at").exists());

    // The reverse is refused too: there is no manifest state for "declared nothing, at 09:00".
    let mut orphan = base("orphan-at");
    orphan.extend(["--license-at".into(), "2026-08-06T09:00:00Z".into()]);
    assert!(!run(orphan).status.success(), "--license-at without --license published anyway");

    // A blank license is refused at the library choke point as well as here.
    let mut blank = base("blank");
    blank.extend([
        "--license".into(),
        "   ".into(),
        "--license-at".into(),
        "2026-08-06T09:00:00Z".into(),
    ]);
    assert!(!run(blank).status.success(), "a blank --license published anyway");

    // …and a complete declaration publishes, carrying **the declared instant**, not the build's.
    let mut ok = base("declared");
    ok.extend([
        "--license".into(),
        "CC-BY-4.0".into(),
        "--license-at".into(),
        "2026-08-06T09:00:00Z".into(),
        "--attribution".into(),
        "(c) Example Cadastre".into(),
        "--redistribution".into(),
        "permitted".into(),
    ]);
    let out = run(ok);
    assert_ok(&out, "a complete operator declaration");
    let m = manifest(&d.join("declared"));
    assert_eq!(m["license"]["state"].as_str().unwrap(), "declared-by-operator");
    assert_eq!(m["license"]["license"].as_str().unwrap(), "CC-BY-4.0");
    assert_eq!(
        m["license"]["at"].as_str().unwrap(),
        "2026-08-06T09:00:00Z",
        "`license.at` is not the instant the operator declared"
    );
    // The build clock lives in the sidecar, and the two are different values. A build that started
    // at the declared instant to the second would make this vacuous, which no real run does.
    let sidecar: serde_json::Value =
        serde_json::from_slice(&std::fs::read(d.join("declared").join("build-info.json")).unwrap())
            .unwrap();
    assert_ne!(
        sidecar["started_at"].as_str().unwrap(),
        "2026-08-06T09:00:00Z",
        "the build clock and the declaration instant are the same value again"
    );
}

/// A publish with no `--bbox` still records `whole-file`, so the fix did not turn every publish into
/// a filtered one with an absent CRS.
#[test]
fn a_publish_without_a_bbox_still_records_the_whole_file_filter() {
    let d = workspace("whole-file");
    let src = fixture(&d, CrsMode::DeclaredLv95);
    let dest = d.join("bundle");

    let out = publish_bundle(&[
        "--data",
        src.to_str().unwrap(),
        "--style",
        style_file(&d).to_str().unwrap(),
        "--viewer",
        viewer_dir(&d).to_str().unwrap(),
        "--out",
        dest.to_str().unwrap(),
        "--attributes",
        "zone",
    ]);
    assert_ok(&out, "a whole-file publish");

    let m = manifest(&dest);
    assert_eq!(m["operation"]["filter"]["kind"].as_str().unwrap(), "whole-file");
    // §8 gives `whole-file` exactly one member; a `bbox_crs` here would be a key the format does not
    // define in that shape, and every conforming reader would refuse the bundle.
    assert!(m["operation"]["filter"].get("bbox_crs").is_none());
    assert_eq!(m["data"]["rows"].as_u64().unwrap(), FEATURES as u64);
}
