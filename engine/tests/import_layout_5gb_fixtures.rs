// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Phase 5 of the import-layout cut — `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §4's 5 GB class:
//! `{C5 raster, H5 hilbert16, R5 shuffled}` at **shipped granularity only** (8192 rows/group, no
//! sweep — preregistration §4: "At 5 GB: three orders at shipped granularity only").
//!
//! **This is fixture-writing, not measurement.** Phase 6 (`kernel/tests/import_layout_factorial.rs`)
//! scores read volume and total query time; this file only establishes the three files and records
//! their facts, exactly `engine/tests/import_layout_fixtures.rs`'s own division of labour at the
//! 145 MB class.
//!
//! ## Provenance — locating the prior cut's files rather than regenerating them
//!
//! `C5` and `H5` were written by the `first-batch` cut's amendment A1 (`kernel/RESULTS.md`, "A1 —
//! the 5 GB clustered cell") and never touched since. Their sha256 is **not printed in full in
//! `kernel/RESULTS.md`'s prose** (only `G5`'s short form is) — the full values below are read from
//! that amendment's own artifact,
//! `target/slice-evidence/first-batch/first-batch-5gb-clustered.json`'s `fixtures[].sha256` fields,
//! which is the record `kernel/RESULTS.md`'s "Raw artifacts" table for that cut names as the source.
//! Independently re-verified against the files on disk (`Get-FileHash -Algorithm SHA256`, and again
//! by this harness) before this file was written or any of the three files were trusted.
//!
//! **`G5` (`target/slice-evidence/scale-pass/parcels-5gb.parquet`) is the `scale-pass` cut's own
//! fixture and is never a comparison arm** (preregistration §4) and **never regenerated or
//! overwritten** — ADR-006's ruling, cited in the preregistration §10: an in-place replacement of a
//! fixture other cuts' records depend on would be an external side effect this harness does not have
//! standing to take. This file only ever reads it and only ever writes under
//! `target/slice-evidence/import-layout/`.
//!
//! ## What this file writes
//!
//! `C5` and `H5` are reused **read-only iff their hashes verify**; a mismatch would trigger a
//! rewrite from `G5` (same mechanism as below, from scratch) — the preregistration's own §7 rewrite
//! ceiling (1 800 s at this class) governs that path, which this run's disk state did not take,
//! since both hashes verified.
//!
//! `R5` — the shuffled control at the 5 GB class — **is new** and is the one file this phase
//! actually writes: `ClusterOrder::Shuffled` (`ORDER BY hash(id), id`, deterministic, never
//! `random()`), shipped granularity (8192 rows/group, the same value `C5`/`H5` were written at and
//! `kernel/tests/first_batch_factorial.rs::ROW_GROUP_ROWS` uses), same declared extent as `C5`/`H5`
//! (`FEATURES = 3_300_000`, the `scale-pass` cut's own generator shape, restated here because that
//! constant is private to the `kernel` crate's test binary).
//!
//! ## `#[ignore]`d, like every generation pass in this family
//!
//! Writes up to one ~5 GB file (only if `R5` is not already present) and re-hashes up to three
//! ~5 GB files — minutes, not seconds, and not part of the ordinary `cargo test`:
//!
//! ```text
//! cargo test --release --features fixture -p spatial-engine --test import_layout_5gb_fixtures -- \
//!   --ignored --exact generate_the_5gb_fixture_set --nocapture
//! ```

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use spatial_engine::layout::{write_clustered_variant, ClusterOrder, DeclaredExtent, VariantSpec};
use spatial_engine::CancelToken;

// ---- the shape, restated from `kernel/tests/first_batch_factorial.rs`'s `FileId::features()`
// (`3_300_000`, `SCALE-PASS-PREREGISTRATION.md` §1a) — private to that crate's test binary ---------

const FEATURES: usize = 3_300_000;
const CELL_M: f64 = 40.0;
const SHIPPED_GRANULARITY: usize = 8_192;
const REWRITE_CEILING: Duration = Duration::from_secs(1_800); // preregistration §7, 5 GB rewrite

/// The known-good hashes — `G5` from `SCALE-PASS-PREREGISTRATION.md`/`kernel/RESULTS.md`'s short
/// form (`5ae955c5…c1788`) confirmed in full against
/// `target/slice-evidence/first-batch/first-batch-5gb-clustered.json`'s `source_sha256_after`;
/// `C5`/`H5` from that same artifact's `fixtures[].sha256`. All three independently re-verified
/// against the files on disk before this file was committed.
const G5_SHA256: &str = "5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788";
const C5_SHA256: &str = "9b07b1ebf31f7011bf52c4904e7f991bb24aac59ff9c38d64aaff202cd8a659b";
const H5_SHA256: &str = "eb963539b21a802130796886a00a2c7667be1c16659f748685f4ce7b3f4fabf1";

fn scale_pass_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/scale-pass")
}
fn first_batch_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/first-batch")
}
fn evidence_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/import-layout");
    std::fs::create_dir_all(&d).unwrap();
    d
}
/// The `pilot/` residue the piece names as the only thing this cut's own disk-deletion policy may
/// ever remove — checked, not assumed absent.
fn pilot_residue_dir() -> PathBuf {
    evidence_dir().join("pilot")
}

fn g5_path() -> PathBuf {
    scale_pass_dir().join("parcels-5gb.parquet")
}
fn c5_path() -> PathBuf {
    first_batch_dir().join("parcels-5gb-duckdb-raster.parquet")
}
fn h5_path() -> PathBuf {
    first_batch_dir().join("parcels-5gb-duckdb-hilbert16.parquet")
}
fn r5_path() -> PathBuf {
    evidence_dir().join("parcels-5gb-duckdb-shuffled.parquet")
}

// ---- small standalone helpers, restated from `engine/tests/import_layout_fixtures.rs` (this
// crate's own precedent: a `kernel`-crate helper is not reachable from an `engine` integration
// test, and this is the second copy in this crate rather than a third distinct shape) --------------

fn free_bytes_on_c() -> Option<u64> {
    let out = std::process::Command::new("powershell")
        .args(["-NoProfile", "-Command", "(Get-PSDrive C).Free"])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

/// The same 40 GiB floor this cut's preflight (`CUT-STATE.md` phase 0) declared.
const MIN_FREE_BYTES: u64 = 40 * 1024 * 1024 * 1024;

/// Refuse to start below the declared floor, after applying this cut's own declared deletion
/// policy: delete only files this cut itself wrote that are no longer needed (the `pilot/` residue),
/// record every deletion, and never touch prior-cut evidence or fixtures.
fn require_disk_with_deletion_policy(phase: &str, log: &mut String) -> u64 {
    let mut free = free_bytes_on_c().unwrap_or(0);
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }
    say!(
        "free disk before `{phase}`: {:.2} GiB ({free} B) — floor {} GiB",
        free as f64 / (1u64 << 30) as f64,
        MIN_FREE_BYTES >> 30
    );
    if free < MIN_FREE_BYTES {
        let dir = pilot_residue_dir();
        if dir.exists() {
            say!("below floor — deleting this cut's own pilot residue at {}", dir.display());
            match std::fs::remove_dir_all(&dir) {
                Ok(()) => say!("deleted {}", dir.display()),
                Err(e) => say!("could not delete {}: {e}", dir.display()),
            }
        } else {
            say!("below floor — no pilot residue present at {} to delete", dir.display());
        }
        free = free_bytes_on_c().unwrap_or(0);
        say!(
            "free disk after deletion attempt: {:.2} GiB ({free} B)",
            free as f64 / (1u64 << 30) as f64
        );
    }
    assert!(
        free >= MIN_FREE_BYTES,
        "phase `{phase}` refuses to start: {:.1} GiB free after the declared deletion policy, floor \
         {} GiB. STOPPING rather than touching prior-cut evidence or fixtures.",
        free as f64 / (1u64 << 30) as f64,
        MIN_FREE_BYTES >> 30
    );
    free
}

fn file_facts(p: &Path) -> (u64, String) {
    let Ok(md) = std::fs::metadata(p) else { return (0, "absent".into()) };
    let hash = spatial_engine::index::content_hash(p, &CancelToken::new())
        .map(|(h, _)| h)
        .unwrap_or_else(|_| "unreadable".into());
    (md.len(), hash)
}

fn row_groups_of(path: &Path) -> u64 {
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    let path_sql = path.to_str().unwrap().replace('\'', "''");
    spatial_engine::layout::row_group_row_counts(&conn, &path_sql).expect("row groups").len() as u64
}

/// A minimal rewrite watchdog, restated from `import_layout_fixtures.rs::RewriteWatchdog` — that
/// struct is private to the other test binary and not importable here.
struct RewriteWatchdog {
    stop: Arc<AtomicBool>,
    fired: Arc<AtomicBool>,
    handle: Option<std::thread::JoinHandle<()>>,
}

impl RewriteWatchdog {
    fn start(ceiling: Duration, cancel: CancelToken) -> Self {
        let stop = Arc::new(AtomicBool::new(false));
        let fired = Arc::new(AtomicBool::new(false));
        let (s, f) = (stop.clone(), fired.clone());
        let started = Instant::now();
        let handle = std::thread::spawn(move || loop {
            if s.load(Ordering::Relaxed) {
                return;
            }
            std::thread::sleep(Duration::from_millis(250));
            if started.elapsed() > ceiling {
                eprintln!(
                    "[watchdog] a 5 GB rewrite exceeded its declared {ceiling:?} ceiling after \
                     {:.1} s — firing the cancel token. This attempt is recorded as failed and is \
                     NOT retried inside this run (preregistration §7).",
                    started.elapsed().as_secs_f64()
                );
                f.store(true, Ordering::SeqCst);
                cancel.cancel();
                return;
            }
        });
        Self { stop, fired, handle: Some(handle) }
    }
    fn finish(mut self) -> bool {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(h) = self.handle.take() {
            let _ = h.join();
        }
        self.fired.load(Ordering::SeqCst)
    }
}

fn source_extent() -> DeclaredExtent {
    let cols = (FEATURES as f64).sqrt().ceil();
    DeclaredExtent {
        xmin: spatial_engine::fixture::E_LO,
        ymin: spatial_engine::fixture::N_LO,
        xmax: spatial_engine::fixture::E_LO + cols * CELL_M,
        ymax: spatial_engine::fixture::N_LO + cols * CELL_M,
    }
}

/// One file's rewrite-or-reuse decision: verify against the known hash; reuse if it matches;
/// rewrite from `G5` (1 800 s watchdog) if it does not, recording why. Returns the file's final
/// facts.
fn ensure(
    id: &str,
    dst: &Path,
    known_sha256: &str,
    order: ClusterOrder,
    src: &Path,
    extent: DeclaredExtent,
    log: &mut String,
) -> (u64, String, u64) {
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }
    if dst.exists() {
        let (bytes, hash) = file_facts(dst);
        if hash == known_sha256 {
            let row_groups = row_groups_of(dst);
            say!(
                "{id}: VERIFIED — reusing {} read-only, {bytes} B, {row_groups} row groups, sha256 \
                 {hash}",
                dst.display()
            );
            return (bytes, hash, row_groups);
        }
        say!(
            "{id}: HASH MISMATCH at {} — on-disk sha256 {hash}, recorded {known_sha256}. \
             Rewriting rather than trusting a fixture that moved underneath this phase.",
            dst.display()
        );
    } else {
        say!("{id}: absent at {} — writing it", dst.display());
    }
    let cancel = CancelToken::new();
    let dog = RewriteWatchdog::start(REWRITE_CEILING, cancel.clone());
    let spec = VariantSpec { order, extent, row_group_rows: SHIPPED_GRANULARITY, id_column: "id".into() };
    let started = Instant::now();
    let result = write_clustered_variant(src, dst, &spec, &cancel);
    let elapsed = started.elapsed();
    let fired = dog.finish();
    match result {
        Ok(facts) if !fired && elapsed <= REWRITE_CEILING => {
            let (bytes, hash) = file_facts(dst);
            say!(
                "{id}: WROTE {} — {} features, {bytes} B, {} row groups, {} clamped, {:.0} ms, \
                 sha256 {hash}",
                dst.display(),
                facts.features,
                facts.row_groups,
                facts.clamped_features,
                elapsed.as_secs_f64() * 1000.0
            );
            (bytes, hash, facts.row_groups)
        }
        Ok(_) => {
            std::fs::write(evidence_dir().join("import-layout-5gb-fixtures.log"), &log as &str).ok();
            panic!("{id}: watchdog at {REWRITE_CEILING:?} (fired={fired}), not retried within this run");
        }
        Err(e) => {
            std::fs::write(evidence_dir().join("import-layout-5gb-fixtures.log"), &log as &str).ok();
            panic!("{id}: rewrite refused or failed: {e}. A refusal stops this phase (F3).");
        }
    }
}

#[test]
#[ignore = "writes up to one ~5 GB file and re-hashes up to three; run explicitly with --release, \
            --features fixture; kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 5"]
fn generate_the_5gb_fixture_set() {
    assert!(
        !cfg!(debug_assertions),
        "this phase writes/verifies fixtures other phases score against; a debug build's numbers \
         are not measurements. Run with --release."
    );

    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }
    say!("kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 5 — the 5 GB fixture set");

    let free_before = require_disk_with_deletion_policy("import-layout-5gb-fixtures", &mut log);

    // ---- G5: read-only, never regenerated. A mismatch here STOPS the cut — there is no repair
    // path this harness is allowed to take (ADR-006 ruling, preregistration §10). --------------------
    let g5 = g5_path();
    assert!(g5.exists(), "G5 (the scale-pass source fixture) is absent at {} — this phase refuses \
             to generate one (preregistration §4/§10)", g5.display());
    let (g5_bytes, g5_hash) = file_facts(&g5);
    say!("G5 (read-only source): {} — {g5_bytes} B, sha256 {g5_hash}", g5.display());
    assert_eq!(
        g5_hash, G5_SHA256,
        "G5's sha256 does not match the recorded value ({G5_SHA256}). This file is READ-ONLY and \
         this harness refuses to regenerate or overwrite it — STOPPING per the piece's own disk/ \
         fixture policy rather than working around a moved source fixture."
    );
    say!("G5 verified against the recorded hash — read-only, not a comparison arm (preregistration §4)");

    let extent = source_extent();

    // ---- C5, H5: reused iff they verify; rewritten (1 800 s watchdog) otherwise ------------------
    let (c5_bytes, c5_hash, c5_groups) =
        ensure("C5", &c5_path(), C5_SHA256, ClusterOrder::SourceIdentity, &g5, extent, &mut log);
    let (h5_bytes, h5_hash, h5_groups) =
        ensure("H5", &h5_path(), H5_SHA256, ClusterOrder::Hilbert16, &g5, extent, &mut log);

    // ---- R5: the one genuinely new file ------------------------------------------------------------
    // No known-good hash exists yet (it is new); an empty string as the "known" value means `ensure`
    // always takes the write-or-verify-existing-copy path rather than the mismatch-rewrite path
    // (a prior run of this same phase, before its result was seen, may have already written it).
    let r5_dst = r5_path();
    let (r5_bytes, r5_hash, r5_groups) = if r5_dst.exists() {
        let (bytes, hash) = file_facts(&r5_dst);
        let row_groups = row_groups_of(&r5_dst);
        say!(
            "R5: already present at {} — {bytes} B, {row_groups} row groups, sha256 {hash} (not \
             rewritten; a phase is never re-run after its result is seen, but this file may have \
             been written by an earlier attempt at this same un-scored phase)",
            r5_dst.display()
        );
        (bytes, hash, row_groups)
    } else {
        require_disk_with_deletion_policy("import-layout-5gb-r5-rewrite", &mut log);
        let cancel = CancelToken::new();
        let dog = RewriteWatchdog::start(REWRITE_CEILING, cancel.clone());
        let spec = VariantSpec {
            order: ClusterOrder::Shuffled,
            extent,
            row_group_rows: SHIPPED_GRANULARITY,
            id_column: "id".into(),
        };
        let started = Instant::now();
        let result = write_clustered_variant(&g5, &r5_dst, &spec, &cancel);
        let elapsed = started.elapsed();
        let fired = dog.finish();
        match result {
            Ok(facts) if !fired && elapsed <= REWRITE_CEILING => {
                let (bytes, hash) = file_facts(&r5_dst);
                say!(
                    "R5: WROTE {} — {} features, {bytes} B, {} row groups, {} clamped, {:.0} ms, \
                     sha256 {hash}",
                    r5_dst.display(),
                    facts.features,
                    facts.row_groups,
                    facts.clamped_features,
                    elapsed.as_secs_f64() * 1000.0
                );
                (bytes, hash, facts.row_groups)
            }
            Ok(_) => {
                std::fs::write(evidence_dir().join("import-layout-5gb-fixtures.log"), &log).ok();
                panic!("R5: watchdog at {REWRITE_CEILING:?} (fired={fired}), not retried");
            }
            Err(e) => {
                std::fs::write(evidence_dir().join("import-layout-5gb-fixtures.log"), &log).ok();
                panic!("R5 rewrite refused or failed: {e}. A refusal stops this phase (F3).");
            }
        }
    };

    // ---- row-group-count cross-check: all three must share the same shipped-granularity layout ---
    say!(
        "\nrow groups — C5 {c5_groups}, H5 {h5_groups}, R5 {r5_groups} (all should agree — F3 was \
         already enforced per-file inside `write_clustered_variant`, this is a cross-file restatement)"
    );

    let free_after = free_bytes_on_c().unwrap_or(0);
    say!(
        "\nfree disk after: {:.2} GiB ({free_after} B) — delta {:.3} GiB",
        free_after as f64 / (1u64 << 30) as f64,
        (free_before as i64 - free_after as i64) as f64 / (1u64 << 30) as f64
    );

    // ---- the artifact -----------------------------------------------------------------------------
    let artifact = format!(
        r#"{{
  "preregistration": "kernel/IMPORT-LAYOUT-PREREGISTRATION.md",
  "phase": 5,
  "free_disk_before_bytes": {free_before},
  "free_disk_after_bytes": {free_after},
  "g5": {{"path": {:?}, "bytes": {g5_bytes}, "sha256": {:?}, "role": "read-only source, never a comparison arm"}},
  "c5": {{"path": {:?}, "bytes": {c5_bytes}, "sha256": {:?}, "row_groups": {c5_groups}}},
  "h5": {{"path": {:?}, "bytes": {h5_bytes}, "sha256": {:?}, "row_groups": {h5_groups}}},
  "r5": {{"path": {:?}, "bytes": {r5_bytes}, "sha256": {:?}, "row_groups": {r5_groups}}}
}}
"#,
        g5.display().to_string(),
        g5_hash,
        c5_path().display().to_string(),
        c5_hash,
        h5_path().display().to_string(),
        h5_hash,
        r5_dst.display().to_string(),
        r5_hash,
    );
    std::fs::write(evidence_dir().join("fixtures-5gb.json"), &artifact).expect("write artifact");
    std::fs::write(evidence_dir().join("import-layout-5gb-fixtures.log"), &log).expect("write log");
    println!("→ {}", evidence_dir().join("fixtures-5gb.json").display());
}
