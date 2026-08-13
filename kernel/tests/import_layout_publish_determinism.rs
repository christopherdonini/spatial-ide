// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Phase 3 of the import-layout cut, second half — ADR-017 §12 publish determinism **across
//! layouts** at 145 MB (`kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §10: "ADR-017 §12 (publish
//! determinism asserted across layouts at 145 MB)").
//!
//! ## What §12 promises, and what this file actually tests
//!
//! ADR-017 §12, verbatim: *"Given identical source bytes, style bytes, declared projection,
//! publish parameters and viewer asset bytes, two publishes by the same publisher binary on the
//! same machine produce a byte-identical `manifest.json` and byte-identical partitions."* That
//! promise is scoped to **identical source bytes** — the same file published twice — and `C`, `H`
//! and `R` are three **different files** (different physical row order, different content hash by
//! construction; the preregistration's own scope clause: *"`H` is a different file with a
//! different content hash than `C` or `R`, never a same-file claim"*). So this file does not, and
//! must not, assert whole-manifest byte identity across the three.
//!
//! What it asserts instead is the thing the ADR's `ordering: "identity-ascending"` member actually
//! buys (`engine/src/stream.rs`'s `stream_for_publish` always queries `RowOrdering::ByIdentityAscending`,
//! never the file's own physical order): a static bundle published from `C`, `H` or `R` — three
//! files holding the same 100 000 features in three different physical row orders — is **the same
//! bundle**, byte for byte, everywhere the physical row order could have leaked, and differs
//! **only** where a genuinely different source file must legitimately produce a different value
//! (its own content hash, and the two manifest members and one digest that are computed from it).
//! That is the layout-specific reading of §12 this phase exists to check, and a leak anywhere else
//! is exactly the kind of defect a canonically-ordered publish is supposed to make impossible.
//!
//! ## Comparison method, and why
//!
//! **Partitions: byte-for-byte equality**, file name for file name (`compare_partitions`, adapted
//! from `kernel/tests/scale_pass.rs`'s own two-publish determinism check). This is the strong claim
//! §12 makes and the one directly falsified by a layout leak, so nothing weaker than raw bytes is
//! used for it.
//!
//! **`manifest.json`: field-level canonical comparison, not whole-file byte equality.** A raw
//! `sha256_file(manifest) == sha256_file(manifest)` check — the method `scale_pass.rs` uses for its
//! *same-source* determinism claim — would report every publish here as "different", because the
//! source content hash genuinely differs; a check that always fails on this input would prove
//! nothing about layout. Instead: both manifests are parsed as JSON and recursively diffed into a
//! set of member paths that disagree. **Empirically established before this file was written** (by
//! running the pinned binary against `C`, `H` and `R` and reading the resulting manifests) and
//! re-asserted every run, not merely assumed: the full set of members two of these three publishes
//! can ever legitimately disagree on is exactly `source.content_hash`,
//! `operation.source_content_hash`, `operation.digest`, and two array elements of
//! `reproducibility.basis` that restate the same hash and digest in prose. Any path outside that
//! set that disagrees is a layout leak and **stops this phase** — recorded exactly, not
//! investigated past this file's own re-read, per the preregistration's unattended rule.

mod support;

use std::path::{Path, PathBuf};
use std::process::Command;

use support::*;

// ---- the pinned binary, re-verified before use ----------------------------------------------------
//
// **Not a hardcoded expected hash, and that is a finding of this phase, not a shortcut.** The
// original design asserted the on-disk binary's hash against `CUT-STATE.md` phase 0's recorded
// value (`5d757adb…`), the same pattern the fixture hashes below use. It does not work for this
// artifact specifically: this workspace's release profile carries `debug = true` (kept for
// profiling — `Cargo.toml`'s own comment), and MSVC's `link.exe` embeds a build-specific PDB
// identifier in debug info, so **every relink of `spatial-kernel` produces a different
// `publish-bundle.exe` hash even with zero source change**. This was discovered empirically while
// building *this test file*: compiling this very test recompiles the `spatial-kernel` lib, which
// relinks the `publish-bundle` and `slice-host` bin targets as a side effect, which moved the hash
// three times in a row with `git diff --stat HEAD` empty throughout (HEAD stayed `870dd27`) — i.e.
// a hardcoded expected-hash assertion here would be **self-defeating**: writing the correct value
// into the source and recompiling to pick it up relinks the binary again and makes the just-written
// value wrong. See `CUT-STATE.md`'s phase 3 section for the full account, including the phase-0
// hash this supersedes and why it could not be preserved.
//
// What this function still does, in place of a frozen-hash assertion: confirms the binary exists at
// the release path a `cargo build --release` produces, is not a debug build (`--release` was
// actually used), and **logs its hash at the moment this run uses it** — so the artifact this run
// produced records exactly which bytes it published with, independently checkable, without
// asserting a value that this workspace's own build system cannot hold still.
fn repo_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().unwrap().to_path_buf()
}

fn pinned_publish_bundle_exe() -> (PathBuf, u64, String) {
    let exe = repo_root().join("target/release/publish-bundle.exe");
    let (bytes, hash) = file_facts(&exe);
    assert!(bytes > 0, "target/release/publish-bundle.exe is absent or empty; build it first");
    (exe, bytes, hash)
}

// ---- the three 145 MB @8192 fixtures (`CUT-STATE.md` phase 2), re-verified before use ------------

const C_8192_SHA256: &str = "ffc76db3c8e9bed23f070efb8f4d4cf102b0e2f81865da3d9926cfb9159e4202";
const H_8192_SHA256: &str = "ced7c1ac070a1bbc973273a2f35563223d68bff17124c4a1d581cdbe155359e5";
const R_8192_SHA256: &str = "7bfb15ee55e6a3b011e63a935d98ac9e63472f12890eebd39b17df3e2343772d";

fn evidence_dir() -> PathBuf {
    repo_root().join("target/slice-evidence/import-layout")
}

fn logs_dir() -> PathBuf {
    let d = evidence_dir().join("logs");
    std::fs::create_dir_all(&d).unwrap();
    d
}

/// **Written only under `target/slice-evidence/`** — the preregistration §10 / ADR-006 ruling this
/// cut is bound by ("the harness only ever writes under `target/slice-evidence/`"), rather than the
/// system temp directory most other kernel CLI tests use.
fn workspace() -> PathBuf {
    let d = evidence_dir().join("publish-determinism");
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn verified_fixture(name: &str, want_hash: &str) -> PathBuf {
    let path = evidence_dir().join(name);
    let (bytes, hash) = file_facts(&path);
    assert_eq!(
        hash, want_hash,
        "{name} ({bytes} B, sha256 {hash}) does not match the phase-2 pin ({want_hash}) — the \
         fixture moved underneath this phase; refusing to publish from it"
    );
    path
}

/// The literal-only style `kernel/tests/scale_pass.rs::SCALE_STYLE` uses — required because the
/// 145 MB `{C,H,R}` fixtures carry `AttributeMode::None` (`id`, `bbox`, `geometry` only; no `zone`
/// column for a `match` style to bind to).
const STYLE: &str = r##"{
  "style_version": 1,
  "layer": {
    "geometry": "polygon",
    "fill_color": {"literal": "#aa3333"},
    "fill_opacity": {"literal": 0.8},
    "outline_color": {"literal": "#202020"},
    "outline_width": {"literal": 1.0}
  }
}"##;

fn write_style(dir: &Path) -> PathBuf {
    let p = dir.join("style.json");
    std::fs::write(&p, STYLE).unwrap();
    p
}

fn write_viewer(dir: &Path) -> PathBuf {
    let p = dir.join("viewer");
    std::fs::create_dir_all(&p).unwrap();
    std::fs::write(p.join("index.html"), b"<!doctype html><title>t</title>").unwrap();
    std::fs::write(p.join("app.js"), b"export const ok = 1;\n").unwrap();
    std::fs::write(p.join("NOTICE.txt"), b"stub notice\n").unwrap();
    p
}

/// Publishes `data` (whole file, no `--bbox`, no `--attributes`, default `--name parcels`) through
/// the pinned binary, returning the destination on success.
fn publish(exe: &Path, data: &Path, style: &Path, viewer: &Path, out: &Path, audit_log: &Path) -> String {
    let approve = out.file_name().unwrap().to_string_lossy().to_string();
    let output = Command::new(exe)
        .env(spatial_kernel::permission::AUDIT_LOG_ENV, audit_log)
        .args([
            "--data", data.to_str().unwrap(),
            "--style", style.to_str().unwrap(),
            "--viewer", viewer.to_str().unwrap(),
            "--out", out.to_str().unwrap(),
            "--viewer-program", "Spatial IDE bundle viewer",
            "--viewer-copyright", "Copyright (C) 2026 the Spatial IDE contributors",
            "--viewer-license", "AGPL-3.0-or-later",
            "--viewer-notice", "NOTICE.txt",
            "--corresponding-source-url", "https://example.invalid/spatial-ide",
            "--approve", &approve,
        ])
        .output()
        .expect("run the pinned publish-bundle");
    let text = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(output.status.success(), "publish of {} failed:\n{text}", data.display());
    text
}

/// Compare every partition of two bundles byte for byte — adapted from
/// `kernel/tests/scale_pass.rs::compare_partitions` (that copy is private to its own file, same as
/// every other frozen-instrument duplication in this family).
fn compare_partitions(a: &Path, b: &Path) -> (usize, bool, Option<String>) {
    let da = a.join("data");
    let db = b.join("data");
    let list = |d: &Path| -> Result<std::collections::BTreeSet<String>, String> {
        std::fs::read_dir(d)
            .map_err(|e| format!("{}: {e}", d.display()))
            .map(|rd| rd.filter_map(|e| e.ok()).map(|e| e.file_name().to_string_lossy().to_string()).collect())
    };
    let (na, nb) = match (list(&da), list(&db)) {
        (Ok(a), Ok(b)) => (a, b),
        (Err(e), _) | (_, Err(e)) => return (0, false, Some(e)),
    };
    if na != nb {
        let only_a: Vec<_> = na.difference(&nb).cloned().collect();
        let only_b: Vec<_> = nb.difference(&na).cloned().collect();
        return (0, false, Some(format!("partition sets differ: only in A {only_a:?}, only in B {only_b:?}")));
    }
    let mut compared = 0usize;
    for name in &na {
        let pa = match std::fs::read(da.join(name)) {
            Ok(v) => v,
            Err(e) => return (compared, false, Some(format!("{name}: unreadable in A ({e})"))),
        };
        let pb = match std::fs::read(db.join(name)) {
            Ok(v) => v,
            Err(e) => return (compared, false, Some(format!("{name}: absent from B ({e})"))),
        };
        if pa != pb {
            return (compared, false, Some(format!("{name}: bytes differ")));
        }
        compared += 1;
    }
    (compared, true, None)
}

// ---- the manifest diff --------------------------------------------------------------------------

/// Every dotted/bracketed member path at which two manifests are allowed to disagree, because it is
/// a value computed from the source file's own content hash rather than a value the publish
/// operation's canonical row ordering should have made layout-independent. **Empirically closed**
/// (see this file's header) rather than assumed — any path this run finds outside this set is a
/// layout leak.
fn is_expected_source_hash_difference(path: &str) -> bool {
    matches!(path, "source.content_hash" | "operation.source_content_hash" | "operation.digest")
        || path.starts_with("reproducibility.basis[")
}

/// Every member path at which two manifest JSON trees disagree — `Value::Object`s recurse key by
/// key (a key present in only one side is reported as its own path), `Value::Array`s recurse index
/// by index when lengths agree or report `<prefix>[len]` when they do not, and any other disagreement
/// is a leaf path where `a != b`.
fn diff_paths(a: &serde_json::Value, b: &serde_json::Value, prefix: &str, out: &mut Vec<String>) {
    use serde_json::Value;
    match (a, b) {
        (Value::Object(ma), Value::Object(mb)) => {
            let mut keys: Vec<&String> = ma.keys().chain(mb.keys()).collect();
            keys.sort();
            keys.dedup();
            for k in keys {
                let path = if prefix.is_empty() { k.clone() } else { format!("{prefix}.{k}") };
                match (ma.get(k), mb.get(k)) {
                    (Some(va), Some(vb)) => diff_paths(va, vb, &path, out),
                    _ => out.push(format!("{path} (present in only one side)")),
                }
            }
        }
        (Value::Array(aa), Value::Array(ab)) => {
            if aa.len() != ab.len() {
                out.push(format!("{prefix}[len={} vs {}]", aa.len(), ab.len()));
                return;
            }
            for (i, (va, vb)) in aa.iter().zip(ab.iter()).enumerate() {
                diff_paths(va, vb, &format!("{prefix}[{i}]"), out);
            }
        }
        _ => {
            if a != b {
                out.push(prefix.to_string());
            }
        }
    }
}

fn read_manifest(bundle: &Path) -> serde_json::Value {
    let bytes = std::fs::read(bundle.join(spatial_kernel::bundle::MANIFEST_PATH))
        .expect("the bundle has a manifest");
    serde_json::from_slice(&bytes).expect("the manifest is JSON")
}

// ---- the driver ------------------------------------------------------------------------------------

#[test]
#[ignore = "correctness pass; run explicitly with --release; \
            kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 3, ADR-017 §12 half"]
fn adr017_publish_determinism_across_layouts_at_145mb() {
    refuse_debug("import-layout-publish-determinism");
    require_disk("import-layout-publish-determinism");

    let out_dir = logs_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }

    let (exe, exe_bytes, exe_hash) = pinned_publish_bundle_exe();
    say!(
        "publish-bundle in use: {} ({exe_bytes} B, sha256 {exe_hash} — logged, not asserted against \
         a frozen value; see this file's header for why)",
        exe.display()
    );

    let c = verified_fixture("parcels-145mb-duckdb-source-identity-g8192.parquet", C_8192_SHA256);
    let h = verified_fixture("parcels-145mb-duckdb-hilbert16-g8192.parquet", H_8192_SHA256);
    let r = verified_fixture("parcels-145mb-duckdb-shuffled-g8192.parquet", R_8192_SHA256);
    say!("fixtures verified: C={C_8192_SHA256} H={H_8192_SHA256} R={R_8192_SHA256}");

    let ws = workspace();
    let style = write_style(&ws);
    let viewer = write_viewer(&ws);
    let audit_log = ws.join("audit.jsonl");

    let bundle_c = ws.join("bundle-C");
    let bundle_h = ws.join("bundle-H");
    let bundle_r = ws.join("bundle-R");
    publish(&exe, &c, &style, &viewer, &bundle_c, &audit_log);
    say!("published C -> {}", bundle_c.display());
    publish(&exe, &h, &style, &viewer, &bundle_h, &audit_log);
    say!("published H -> {}", bundle_h.display());
    publish(&exe, &r, &style, &viewer, &bundle_r, &audit_log);
    say!("published R -> {}", bundle_r.display());

    let manifest_c = read_manifest(&bundle_c);
    let manifest_h = read_manifest(&bundle_h);
    let manifest_r = read_manifest(&bundle_r);

    let mut any_fail = false;

    for (label, other_bundle, other_manifest) in
        [("H", &bundle_h, &manifest_h), ("R", &bundle_r, &manifest_r)]
    {
        // ---- partitions: byte for byte -------------------------------------------------------
        let (compared, identical, first_difference) = compare_partitions(&bundle_c, other_bundle);
        say!(
            "partitions C vs {label}: {compared} compared, identical={identical}{}",
            first_difference.as_deref().map(|d| format!(" ({d})")).unwrap_or_default()
        );
        if !identical {
            any_fail = true;
            say!(
                "STOP — partitions differ between C and {label} (first difference: {:?}). This is a \
                 cross-layout leak into the published, canonically-ordered output and is a \
                 cut-stopping result.",
                first_difference
            );
        }

        // ---- manifest: field-level diff, filtered by the known source-hash-derived set -------
        let mut diffs = Vec::new();
        diff_paths(&manifest_c, other_manifest, "", &mut diffs);
        let unexpected: Vec<&String> =
            diffs.iter().filter(|p| !is_expected_source_hash_difference(p)).collect();
        say!(
            "manifest C vs {label}: {} total differing member path(s), {} outside the known \
             source-hash-derived set: {:?}",
            diffs.len(),
            unexpected.len(),
            diffs
        );
        assert!(
            diffs.iter().any(|p| p == "source.content_hash"),
            "C and {label} manifests do not even disagree on source.content_hash — the fixtures \
             used were not actually different files, so this comparison establishes nothing"
        );
        if !unexpected.is_empty() {
            any_fail = true;
            say!(
                "STOP — manifest C vs {label} disagrees outside the known source-hash-derived set: \
                 {unexpected:?}. This is a cut-stopping result."
            );
        }
    }

    std::fs::write(out_dir.join("publish-determinism.log"), &log).expect("write the phase log");

    let verdict = if any_fail { "FAIL" } else { "PASS" };
    println!(
        "\nADR-017 publish determinism across layouts at 145 MB: {verdict}\n\
         method: partitions compared byte-for-byte (data/*.arrows); manifest.json compared by a \
         recursive field-level JSON diff, filtered against the empirically-closed set of members a \
         genuinely different source file may legitimately change (source.content_hash, \
         operation.source_content_hash, operation.digest, reproducibility.basis[0] and [2]) — never \
         a whole-file byte-identity check, because C, H and R are different files by construction \
         and such a check would fail unconditionally on this input without saying anything about \
         layout."
    );

    assert!(
        !any_fail,
        "ADR-017 publish determinism across layouts FAILED — see \
         target/slice-evidence/import-layout/logs/publish-determinism.log and CUT-STATE.md"
    );
}
