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
//! Grepped over `engine/src`, `kernel/src`, `protocol/skp/src` and `frontends/shell/src-tauri/src`
//! for `std::fs::write`/`File::create`/`OpenOptions::new()` outside `#[cfg(test)]`, and reconciled
//! against gate-log record 85, finding B-1. Four families:
//!
//! 1. **The published bundle** — `kernel/src/publish/mod.rs` (`Staging::write`, `kernel/src/publish/mod.rs:1355`)
//!    and `kernel/src/bundle/mod.rs`'s path constants: `manifest.json`, `style.json`, the viewer
//!    assets and the GeoParquet partitions. The only thing in this tree answering to "project
//!    files", "styles" or "recipes" in the brief's list: a style is `style.json` inside it; the
//!    closest thing to a "recipe" is the manifest's `operation` block (`Manifest::operation`,
//!    `bundle/mod.rs:518-540`). Scanned below.
//! 2. **The shell's session log** (`frontends/shell/src-tauri/src/state.rs::SessionLog`) — plain
//!    `<ms> <level> <message>` lines, `message` always caller-supplied text. This file cannot
//!    construct one directly (that struct lives in the `spatial-ide-shell` crate, not
//!    `spatial-kernel`), so it tests what actually *reaches* a session log line instead: the real
//!    `Display` text of every `EngineError` this cut's detected-change path can produce, and the
//!    real kernel-minted refusal strings (`error_of`/`terminal_detail_of`) the shell's own
//!    `logSessionEvent` call sites (`tileViewportStreamManager.ts:740`,
//!    `viewportStreamManager.ts:311-314`) interpolate verbatim into a log line.
//! 3. **A built LOD tier set** — `engine/src/lod.rs:1203` (`tiers.json`, the manifest) and `:1367`
//!    (one tier's GeoParquet file, inside the loop `build_tiers` runs per tier). Scanned below, over
//!    a small fixture, the same `build_tiers`/`LOD_BUILD_WORKERS_ARM_S` shape
//!    `engine/tests/lod_tier_builder.rs`'s own non-ladder tests already use.
//! 4. **The permission audit log** — `kernel/src/permission/audit/log.rs:144` (the writability
//!    probe, `AuditLog::open_for`) and `:215-221` (`AuditLog::append`, the actual record line).
//!    Scanned below, over one `IntentRecord`, the same `AuditLog::open_for`/`append_intent` shape
//!    `kernel/tests/permission_boundary.rs` already uses.
//!
//! **Excluded, with reason: `engine/src/fixture.rs:627`.** `File::create` inside
//! `write_geoparquet`'s `generate` — this writes the GeoParquet **fixtures** every test and
//! measurement run in this tree opens as a *source*, never something the product persists or
//! publishes *from* an operator's own data. It is an input generator, not an artifact family; the
//! same reasoning `docs/01` principle 8 gives a fixture (a stand-in for a real file, not a claim
//! about one) applies to what it writes. Not scanned.
//!
//! **No standalone project-file or recipe-file format exists in this tree at this commit** —
//! grepped, not assumed, against the same four-path scope above (`protocol/skp/src`, not the whole
//! `protocol/*` tree: `protocol/transport-bakeoff/src/main.rs:302,566` write outside
//! `#[cfg(test)]`, but the workspace root `Cargo.toml`'s `exclude` list names that crate); nothing
//! outside the four families and the one exclusion resolves.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex, MutexGuard, OnceLock};

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
use spatial_engine::lod::{build_tiers, LOD_BUILD_WORKERS_ARM_S};
use spatial_engine::{CancelToken, Dataset, EngineError, ViewportQuery};
use spatial_kernel::bundle;
use spatial_kernel::permission::audit::IntentRecord;
use spatial_kernel::permission::{AuditLog, AUDIT_LOG_ENV};
use spatial_kernel::publish::{
    publish_unguarded, CorrespondingSource, CorrespondingSourceKind, PublishRequest, ViewerAsset,
    ViewerAssets, ViewerLicenseInput,
};
use spatial_kernel::skp::{error_of, session_end_channel, terminal_detail_of, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{OpenDatasetRequest, SKP_VERSION};

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
    // Deliberately avoids the literal substring "generation" in this scratch prefix: the LOD
    // tier-set test below writes real product manifests that record this directory's own path
    // for provenance (`path_at_build`), and a case-insensitive byte scan for "generation" would
    // then trip on the *scratch directory's name*, not on anything the product wrote. (Found by
    // running this file's own tests: the first version of this prefix, `spatial-kernel-no-
    // generation-tests`, produced exactly that false failure.)
    let d = std::env::temp_dir().join("spatial-kernel-artifact-scan-tests").join(name);
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

/// **The LOD tier-set half of G-A4** (gate-log record 85, finding B-1, family 3). `build_tiers` writes
/// `tiers.json` (`engine/src/lod.rs:1203`) and, per tier, a GeoParquet file (`:1367`) to a real
/// on-disk cache. Same real-product-path discipline as the bundle test above: a real `build_tiers`
/// call, over a small fixture, scanned byte-for-byte -- not a schema walk this time, because
/// `tiers.json` is free-form JSON this file has no typed struct for and the byte scan already
/// covers a JSON manifest's keys and values alike (the bundle tests above establish that a key
/// match and a value match are different failure classes; one scan of a small manifest does not
/// need to re-prove that distinction, only to run it once more against this format).
///
/// RECORDED MUTATION (run and reverted): add `"generation": 1,` to `write_manifest`'s
/// `json!({...})` in `engine/src/lod.rs`, after `"schema"`. OBSERVED FAILURE fixed prefix: `the
/// substring "generation" appears in these LOD tier-set files:` -- followed by this run's own
/// `tiers.json` path (content-hash-keyed, not fixed text, not reproduced here).
#[test]
fn a_built_lod_tier_sets_manifest_and_tier_files_carry_no_generation_substring() {
    let d = workspace("lod-tiers");
    let path = d.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 2_000,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .unwrap();
    let source = Dataset::open(&path).unwrap();
    let set = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &CancelToken::new(), None)
        .expect("build a small tier set");

    let mut files: Vec<PathBuf> = vec![set.manifest_path()];
    for outcome in set.tiers() {
        files.push(outcome.record().path().to_path_buf());
    }
    assert!(files.len() > 1, "the tier set wrote nothing but its own manifest; this scan would be vacuous");

    let mut offending = Vec::new();
    for f in &files {
        let bytes = std::fs::read(f).unwrap_or_else(|e| panic!("read {}: {e}", f.display()));
        if contains_ascii_ci(&bytes, b"generation") {
            offending.push(f.display().to_string());
        }
    }
    assert!(
        offending.is_empty(),
        "the substring \"generation\" appears in these LOD tier-set files: {offending:?}"
    );
}

/// Serializes the set-var -> run -> read window for `AUDIT_LOG_ENV`, the same discipline
/// `kernel/tests/permission_boundary.rs::env_lock` states for itself -- this file has only the one
/// test touching the var, but the lock costs nothing and keeps the pattern uniform if a second test
/// is ever added here.
fn env_lock() -> MutexGuard<'static, ()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(())).lock().unwrap_or_else(|e| e.into_inner())
}

/// **The permission audit log half of G-A4** (gate-log record 85, finding B-1, family 4).
/// `AuditLog::open_for` probes writability with an `OpenOptions` open (`kernel/src/permission/audit/log.rs:144`)
/// and `AuditLog::append` writes the real record line (`:215-221`). Real product path, the same
/// shape `kernel/tests/permission_boundary.rs::an_intent_without_an_outcome_is_a_readable_state_not_a_missing_record`
/// already uses to construct one.
///
/// RECORDED MUTATION (run and reverted): add a `("generation", Json::str("1")),` member to
/// `IntentRecord::to_json`'s `Json::obj([...])` in `kernel/src/permission/audit/record.rs`, right
/// after its `"schema"` member. OBSERVED FAILURE, exact text: `the substring "generation" appears
/// in the permission audit log`.
#[test]
fn one_permission_audit_log_line_carries_no_generation_substring() {
    let d = workspace("audit-log");
    let log = d.join("audit.jsonl");
    let dest = d.join("out");

    let _guard = env_lock();
    std::env::set_var(AUDIT_LOG_ENV, &log);
    let audit = AuditLog::open_for(&dest).expect("open the audit log");
    audit
        .append_intent(&IntentRecord {
            attempt: "artifact-scan-test-0000".into(),
            at: "2026-09-18T00:00:00Z".into(),
            operation: "publish-static-bundle",
            class: 3,
            reversibility: "irreversible",
            principal_kind: "os-user",
            principal_name: "test-operator".into(),
            source_name: "parcels".into(),
            source_content_hash: "sha256:aa".into(),
            destination: "<user-home>/out".into(),
            style_hash: "sha256:bb".into(),
        })
        .expect("append one intent record");
    std::env::remove_var(AUDIT_LOG_ENV);

    let bytes = std::fs::read(&log).expect("read the audit log back");
    assert!(!bytes.is_empty(), "the audit log wrote nothing; this scan would be vacuous");
    assert!(
        !contains_ascii_ci(&bytes, b"generation"),
        "the substring \"generation\" appears in the permission audit log"
    );
}

/// Case-sensitive scan for the exact shape [`spatial_skp::v0::SessionRef::mint`] produces: `"sr_"`
/// followed by 32 lowercase hex digits. Deliberately not case-insensitive (unlike
/// `contains_ascii_ci` above, built for English prose that could carry any case) — this format is
/// always lowercase by construction (`protocol/skp/src/v0/handles.rs::mint_hex_id`), so a
/// case-sensitive scan is the more precise check and cannot be defeated by an incidental uppercase
/// "SR_..." appearing in unrelated text.
fn contains_a_session_reference_shape(bytes: &[u8]) -> bool {
    const PREFIX: &[u8] = b"sr_";
    if bytes.len() < PREFIX.len() + 32 {
        return false;
    }
    for start in 0..=bytes.len() - PREFIX.len() - 32 {
        if &bytes[start..start + PREFIX.len()] == PREFIX {
            let hex = &bytes[start + PREFIX.len()..start + PREFIX.len() + 32];
            if hex.iter().all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(b)) {
                return true;
            }
        }
    }
    false
}

/// As [`walk_keys`], generalized to any needle — added here rather than widening `walk_keys` itself,
/// so every existing test in this file (and its own RECORDED MUTATION notes, which quote `walk_keys`'
/// exact behaviour) stays byte-unchanged.
fn walk_keys_named(v: &serde_json::Value, path: &str, needle: &str, offending: &mut Vec<String>) {
    match v {
        serde_json::Value::Object(map) => {
            for (k, child) in map {
                if k.to_ascii_lowercase().contains(needle) {
                    offending.push(format!("{path}.{k}"));
                }
                walk_keys_named(child, &format!("{path}.{k}"), needle, offending);
            }
        }
        serde_json::Value::Array(items) => {
            for (i, child) in items.iter().enumerate() {
                walk_keys_named(child, &format!("{path}[{i}]"), needle, offending);
            }
        }
        _ => {}
    }
}

/// **R-a's own reference, at rest** (`engine/SOURCE-WATCHER-PREREGISTRATION.md`, round 21 item 1,
/// rider (b)). A real `SkpHost::open_dataset` mints a real [`spatial_skp::v0::SessionRef`]; this test
/// publishes that exact open's `Dataset` through the same real `publish_unguarded` path every other
/// test in this file uses, then proves the published bundle carries neither the key `"session"` nor
/// any value shaped like a session reference — by key (schema walk, `manifest.json`/`style.json`) and
/// by byte (every file in the bundle, both the exact minted value and the general `sr_` + 32-hex
/// shape, so a *different* session reference value slipping in some other way would still be caught).
///
/// RECORDED MUTATION: add a `("session", Json::str(<an sr_ value>))` member to `Manifest::to_json`'s
/// top-level object (`kernel/src/bundle/mod.rs`, the same call site the file's own
/// `the_published_manifest_and_style_carry_no_generation_key` mutation note names for `"generation"`).
/// Expected failure: the schema walk below finds `$.session`, and the byte scan independently finds
/// the planted `sr_` value — both, since a key match is also a byte match, exactly as the file's own
/// existing precedent for `"generation"` states above.
#[test]
fn the_published_bundle_carries_no_session_reference_key_or_value() {
    let d = workspace("session-reference");
    let path = fixture(&d);

    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    let open = host
        .open_dataset(OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: path.display().to_string(),
            cancel_key: "r-b".to_string(),
            crs_assertion: None,
            identity: None,
        })
        .expect("open");
    let minted_session = open.session.as_str().to_string();
    assert!(
        contains_a_session_reference_shape(minted_session.as_bytes()),
        "the vacuity check's own planted value must itself match the shape it plants"
    );

    let ds = host.catalog().get(open.dataset.as_str()).expect("the catalog holds the open dataset");
    ds.pin_content(&CancelToken::new()).expect("pin");
    let v = viewer();
    let dest = d.join("bundle");
    publish_a_bundle(dest.clone(), &ds, &v);

    // Typed-schema half: no key named "session" in the manifest or the style.
    let manifest_bytes = std::fs::read(dest.join(bundle::MANIFEST_PATH)).unwrap();
    let manifest: serde_json::Value = serde_json::from_slice(&manifest_bytes).unwrap();
    let mut offending_keys = Vec::new();
    walk_keys_named(&manifest, "$", "session", &mut offending_keys);
    assert!(
        offending_keys.is_empty(),
        "manifest.json carries a key naming a session reference: {offending_keys:?}"
    );

    let style_bytes = std::fs::read(dest.join(bundle::STYLE_PATH)).unwrap();
    let style: serde_json::Value = serde_json::from_slice(&style_bytes).unwrap();
    let mut offending_style_keys = Vec::new();
    walk_keys_named(&style, "$", "session", &mut offending_style_keys);
    assert!(
        offending_style_keys.is_empty(),
        "style.json carries a key naming a session reference: {offending_style_keys:?}"
    );

    // Byte half: every file in the bundle, scanned for the exact minted value AND for the general
    // `sr_` + 32-hex shape (so a different reference value would not slip past a scan for only this
    // one open's own).
    let mut files = Vec::new();
    every_file(&dest, &mut files);
    assert!(!files.is_empty(), "the bundle wrote nothing; this scan would be vacuous");

    let mut offending_bytes = Vec::new();
    for f in &files {
        let bytes = std::fs::read(f).unwrap();
        let carries_exact = contains_ascii_ci(&bytes, minted_session.as_bytes());
        let carries_shape = contains_a_session_reference_shape(&bytes);
        if carries_exact || carries_shape {
            offending_bytes.push(format!(
                "{} (exact={carries_exact}, shape={carries_shape})",
                f.strip_prefix(&dest).unwrap_or(f).display()
            ));
        }
    }
    assert!(
        offending_bytes.is_empty(),
        "a session reference appears in these published bundle files: {offending_bytes:?}"
    );

    // The scan is only meaningful if it can fire at all — same vacuity discipline as
    // `the_published_bundles_bytes_carry_no_generation_substring` above, planting this open's own
    // real minted value rather than a synthetic one.
    std::fs::write(dest.join("planted.txt"), format!("this line plants {minted_session} on purpose"))
        .unwrap();
    let planted_bytes = std::fs::read(dest.join("planted.txt")).unwrap();
    assert!(
        contains_ascii_ci(&planted_bytes, minted_session.as_bytes())
            && contains_a_session_reference_shape(&planted_bytes),
        "the scan cannot detect what it claims to"
    );
}
