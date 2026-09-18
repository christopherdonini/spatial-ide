// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **G-A4 — no generation persisted**
//! (`engine/ADMISSION-PREREGISTRATION.md` §12b; block-on-sight A2: "No generation value in any
//! persisted or published artifact (typed-schema + grep tests)").
//!
//! `dataset_session_generation` (`kernel/src/skp.rs:259`) is kernel-authoritative, in-memory state
//! (`GenerationRegistry`) and client-mirrored state (`liveTicketSet.ts`'s live-ticket set) only —
//! §13 D's ruled design, "no generation value crosses the wire" (boundary 9, A2/A3). This file
//! enumerates, from the code rather than from memory, every artifact this tree can write to disk or
//! hand to an operator to read later, and proves each carries neither the word nor a value.
//!
//! ## What this tree can produce, enumerated by its own writers
//!
//! `kernel/src/publish/mod.rs` (`std::fs::write`/`staging.write`) is the one product writer of a
//! **published** artifact: the bundle — `manifest.json`, `style.json`, the viewer assets and the
//! GeoParquet partitions (`kernel/src/bundle/mod.rs`'s path constants). That bundle is also the only
//! thing in this tree answering to "project files", "styles" or "recipes" in the brief's list: a
//! style is `style.json` inside it; the closest thing to a "recipe" is the manifest's `operation`
//! block (`Manifest::operation`, `bundle/mod.rs:518-540`), which is the filter/projection/limit that
//! produced the bundle. **No standalone project-file or recipe-file format exists in this tree at
//! this commit** — grepped, not assumed: `fs::write`/`File::create`/`writeFileSync` outside test and
//! spike code resolve to exactly `kernel/src/bin/publish-bundle.rs` and `kernel/src/publish/mod.rs`.
//! The other **persisted** artifact this tree writes during ordinary operation is the shell's session
//! log (`frontends/shell/src-tauri/src/state.rs::SessionLog`) — plain `<ms> <level> <message>` lines,
//! `message` always caller-supplied text. This file cannot construct one directly (that struct lives
//! in the `spatial-ide-shell` crate, not `spatial-kernel`), so it tests the thing that actually
//! *reaches* a session log line instead: the real `Display` text of every `EngineError` this cut's
//! detected-change path can produce, and the real kernel-minted refusal strings
//! (`error_of`/`terminal_detail_of`) the shell's own `logSessionEvent` call sites
//! (`tileViewportStreamManager.ts:740`, `viewportStreamManager.ts:311-314`) interpolate verbatim
//! into a log line. If the kernel's own bytes never carry the word, neither can the log line built
//! from them.

use std::path::{Path, PathBuf};

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
use spatial_engine::{CancelToken, Dataset, EngineError, ViewportQuery};
use spatial_kernel::bundle;
use spatial_kernel::publish::{
    publish_unguarded, CorrespondingSource, CorrespondingSourceKind, PublishRequest, ViewerAsset,
    ViewerAssets, ViewerLicenseInput,
};
use spatial_kernel::skp::{error_of, terminal_detail_of};

const STYLE: &str = r##"{
  "style_version": 1,
  "layer": {
    "geometry": "polygon",
    "fill_color": {"literal": "#336699"},
    "fill_opacity": {"literal": 0.8},
    "outline_color": {"literal": "#202020"},
    "outline_width": {"literal": 1.0}
  }
}"##;

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-no-generation-tests").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn fixture(dir: &Path) -> PathBuf {
    let path = dir.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 500,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .unwrap();
    path
}

/// A pinned, open dataset -- `publish` refuses `SourceNotPinned` otherwise
/// (`kernel/tests/publish.rs`'s own `pinned()` helper, reused here by the same name and shape).
fn pinned(path: &Path) -> Dataset {
    let ds = Dataset::open(path).unwrap();
    ds.pin_content(&CancelToken::new()).unwrap();
    ds
}

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
        ViewerAsset { path: "app.js".into(), bytes: b"export const ok = 1;\n".to_vec() },
        ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
    ])
    .unwrap()
}

fn viewer_license() -> ViewerLicenseInput {
    ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://example.invalid/spatial-ide".into(),
        },
    }
}

fn fixed_finish() -> String {
    "2026-09-18T00:00:01Z".to_string()
}
static FIXED_FINISH: fn() -> String = fixed_finish;

/// A real published bundle, written to `dest`. Real product path
/// (`publish_unguarded`) — the same entry point `kernel/tests/publish.rs` uses for its own format
/// assertions.
fn publish_a_bundle(dest: PathBuf, ds: &Dataset, v: &ViewerAssets) {
    let req = PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: ViewportQuery::all(),
        attributes: vec!["zone".into()],
        style_source: STYLE,
        viewer: v,
        viewer_license: viewer_license(),
        license: None,
        destination: dest,
        started_at: "2026-09-18T00:00:00Z".into(),
        finished_at: &FIXED_FINISH,
    };
    publish_unguarded(&req, &CancelToken::new(), None).unwrap();
}

/// Case-insensitive ASCII substring search over raw bytes -- deliberately not a UTF-8 decode
/// (`String::from_utf8_lossy` would silently replace invalid sequences in a binary partition file
/// and could hide a real match straddling a replaced byte). `needle` is plain ASCII lowercase.
fn contains_ascii_ci(haystack: &[u8], needle: &[u8]) -> bool {
    if needle.is_empty() || haystack.len() < needle.len() {
        return false;
    }
    haystack.windows(needle.len()).any(|w| w.iter().zip(needle).all(|(a, b)| a.to_ascii_lowercase() == *b))
}

/// Every regular file under `dir`, recursively -- the same "every byte the bundle contains" scope
/// `redaction::scan_directory` (`kernel/tests/publish.rs`'s own precedent) already asserts over.
fn every_file(dir: &Path, out: &mut Vec<PathBuf>) {
    for entry in std::fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_dir() {
            every_file(&path, out);
        } else {
            out.push(path);
        }
    }
}

/// **Typed-schema half of G-A4.** Parses `manifest.json` and `style.json` as JSON and walks every
/// object key in the tree, asserting none of them names a generation. This is the schema check: it
/// would catch a field literally called `generation`, `dataset_session_generation` or similar being
/// added to `Manifest`/`Operation`/`Software` even before any value it carried was inspected.
///
/// RECORDED MUTATION (run and reverted): add a `("generation", Json::UInt(1))` member to
/// `Manifest::to_json`'s top-level object in `kernel/src/bundle/mod.rs` (the shape every other
/// member there already takes). OBSERVED FAILURE: this test fails on the manifest walk, naming the
/// key path `["$.generation"]` -- exact text observed: `manifest.json carries a key naming a
/// generation: ["$.generation"]`. The byte-scan test below also fails under this same mutation
/// (the key's own name is itself a substring match) -- both catching one defect is not a weakness of
/// either; `the_published_bundles_bytes_carry_no_generation_substring`'s own doc comment records the
/// mutation that isolates it (a value, not a key), verified there.
#[test]
fn the_published_manifest_and_style_carry_no_generation_key() {
    let d = workspace("typed-schema");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("bundle");
    publish_a_bundle(dest.clone(), &ds, &v);

    let manifest_bytes = std::fs::read(dest.join(bundle::MANIFEST_PATH)).unwrap();
    let manifest: serde_json::Value = serde_json::from_slice(&manifest_bytes).unwrap();
    let mut offending = Vec::new();
    walk_keys(&manifest, "$", &mut offending);
    assert!(
        offending.is_empty(),
        "manifest.json carries a key naming a generation: {offending:?}"
    );

    let style_bytes = std::fs::read(dest.join(bundle::STYLE_PATH)).unwrap();
    let style: serde_json::Value = serde_json::from_slice(&style_bytes).unwrap();
    let mut offending_style = Vec::new();
    walk_keys(&style, "$", &mut offending_style);
    assert!(
        offending_style.is_empty(),
        "style.json carries a key naming a generation: {offending_style:?}"
    );
}

fn walk_keys(v: &serde_json::Value, path: &str, offending: &mut Vec<String>) {
    match v {
        serde_json::Value::Object(map) => {
            for (k, child) in map {
                if k.to_ascii_lowercase().contains("generation") {
                    offending.push(format!("{path}.{k}"));
                }
                walk_keys(child, &format!("{path}.{k}"), offending);
            }
        }
        serde_json::Value::Array(items) => {
            for (i, child) in items.iter().enumerate() {
                walk_keys(child, &format!("{path}[{i}]"), offending);
            }
        }
        _ => {}
    }
}

/// **Grep half of G-A4.** Not the schema this time -- every byte of every file the publisher wrote,
/// including the GeoParquet partitions and the viewer assets, scanned for the literal substring
/// "generation" case-insensitively. This is the check a schema walk cannot make: a generation value
/// stuffed into a *string field's value* (rather than named by a key) would pass the typed-schema
/// test above and fail this one.
///
/// RECORDED MUTATION (run and reverted): change `Reproducibility::snapshot`'s `why_not_higher`
/// string (`kernel/src/bundle/mod.rs`) to mention "the next generation of this format" (a
/// plausible, innocent-sounding edit -- a VALUE, not a key, so the typed-schema test above stays
/// green under it). OBSERVED FAILURE, exact text: `the substring "generation" appears in these
/// published bundle files: ["manifest.json"]`.
#[test]
fn the_published_bundles_bytes_carry_no_generation_substring() {
    let d = workspace("byte-scan");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("bundle");
    publish_a_bundle(dest.clone(), &ds, &v);

    let mut files = Vec::new();
    every_file(&dest, &mut files);
    assert!(!files.is_empty(), "the bundle wrote nothing; this scan would be vacuous");

    let mut offending = Vec::new();
    for f in &files {
        let bytes = std::fs::read(f).unwrap();
        if contains_ascii_ci(&bytes, b"generation") {
            offending.push(f.strip_prefix(&dest).unwrap_or(f).display().to_string());
        }
    }
    assert!(
        offending.is_empty(),
        "the substring \"generation\" appears in these published bundle files: {offending:?}"
    );

    // The scan is only meaningful if it can fire at all -- the same discipline
    // `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle` uses (`kernel/tests/publish.rs`).
    std::fs::write(dest.join("planted.txt"), b"this line names a Generation on purpose").unwrap();
    let mut files_with_plant = Vec::new();
    every_file(&dest, &mut files_with_plant);
    let planted_bytes = std::fs::read(dest.join("planted.txt")).unwrap();
    assert!(
        contains_ascii_ci(&planted_bytes, b"generation"),
        "the scan cannot detect what it claims to"
    );
}

/// **The session-log half of G-A4, tested at its source.** `SessionLog` (`frontends/shell/src-tauri`)
/// is a generic append-only text sink whose `message` is always caller-supplied; it cannot itself be
/// constructed from `spatial-kernel`. What reaches it around the detected-change path is exactly the
/// real `Display` text of the `EngineError` variants this cut's typed refusals use, and the real
/// `error_of`/`terminal_detail_of` strings the shell's `logSessionEvent` call sites interpolate
/// verbatim (`tileViewportStreamManager.ts:740` `tile-session-ended-source-changed: ${detail}`;
/// `viewportStreamManager.ts:311-314` `session-ended-source-changed: ...${terminal.detail}`;
/// `tileViewportStreamManager.ts:280` `tile-stream-mint-refused: ${tileKey}: ${code} ...`). If none
/// of the kernel's own bytes carries a generation, no session-log line built from them can either.
///
/// RECORDED MUTATION (run and reverted): append ", generation debug." to `EngineError::SourceChanged`'s
/// `Display` text (`engine/src/error.rs`) -- a plausible debugging addition. OBSERVED FAILURE: this
/// test fails, naming the three scanned strings that carried it (`SourceChanged Display`,
/// `error_of.message`, `terminal_detail_of`, each with the mutated sentence quoted in full).
#[test]
fn every_typed_string_a_session_log_line_can_carry_around_a_detected_change_has_no_generation_substring() {
    let source_changed = EngineError::SourceChanged { detail: "mtime".to_string() };
    let partitioned = EngineError::IdentityOrdinalPartitionedUnsupported {
        detail: "path carries a glob metacharacter".to_string(),
    };
    let internal = EngineError::InternalInconsistency { detail: "an admitted CRS lost its provenance class".to_string() };

    let mut strings: Vec<(String, String)> = vec![
        ("SourceChanged Display".into(), source_changed.to_string()),
        ("SourceChanged error_of.message".into(), error_of(&source_changed).message),
        ("SourceChanged error_of.code".into(), error_of(&source_changed).code),
        ("SourceChanged terminal_detail_of".into(), terminal_detail_of(&source_changed)),
        ("IdentityOrdinalPartitionedUnsupported Display".into(), partitioned.to_string()),
        (
            "IdentityOrdinalPartitionedUnsupported terminal_detail_of".into(),
            terminal_detail_of(&partitioned),
        ),
        ("InternalInconsistency Display".into(), internal.to_string()),
        ("InternalInconsistency terminal_detail_of".into(), terminal_detail_of(&internal)),
    ];
    // `SkpError::fields` too -- the named values a client can build on without parsing `message`
    // (`protocol/skp/src/v0/error.rs`'s own doc comment). A generation stuffed into a field value
    // would pass every check above and only be caught here.
    for e in [&source_changed, &partitioned, &internal] {
        for (k, v) in &error_of(e).fields {
            strings.push((format!("error_of.fields[{k}]"), v.clone()));
        }
    }

    let mut offending = Vec::new();
    for (label, s) in &strings {
        if contains_ascii_ci(s.as_bytes(), b"generation") {
            offending.push(format!("{label}: {s:?}"));
        }
    }
    assert!(
        offending.is_empty(),
        "a string a session-log line can carry verbatim names a generation: {offending:#?}"
    );
}
