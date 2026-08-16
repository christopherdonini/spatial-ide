// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The shell crate's half of the sole-caller property** (`NEXT-CUT.md` P1 item 6), extending
//! `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`
//! one crate up.
//!
//! `spatial_kernel::publish::publish_unguarded` is `pub` and callable with no grant, no approval and
//! no audit (`kernel/PERMISSION-BOUNDARY.md` F-2). The kernel's own suite proves nothing in
//! `kernel/src` reaches it outside `permission::boundary::execute`; this proves nothing in
//! `frontends/shell/src-tauri/src` names it either — `crate::publish` (this crate's own publish
//! seam) goes through `spatial_kernel::permission::boundary::execute` exclusively (see
//! `src/publish.rs`'s `execute` function).
//!
//! Same two limits as the kernel suite states about itself, restated rather than assumed: this is a
//! **line-oriented text scan** (an aliased import or unusual spacing would defeat it), and it says
//! nothing about callers **outside** this crate's own source tree (`node_modules`, `target`, the
//! webview's JS are all out of its reach — and out of reach for a Rust source scan by construction).

use std::path::Path;

#[test]
fn no_line_in_the_shell_crate_names_publish_unguarded() {
    let src = Path::new(env!("CARGO_MANIFEST_DIR")).join("src");
    let mut offenders: Vec<String> = Vec::new();

    let mut stack = vec![src.clone()];
    while let Some(dir) = stack.pop() {
        for entry in std::fs::read_dir(&dir).unwrap() {
            let path = entry.unwrap().path();
            if path.is_dir() {
                stack.push(path);
                continue;
            }
            if path.extension().and_then(|e| e.to_str()) != Some("rs") {
                continue;
            }
            let rel = path.strip_prefix(&src).unwrap().to_string_lossy().replace('\\', "/");
            let text = std::fs::read_to_string(&path).unwrap();
            for (n, line) in text.lines().enumerate() {
                // Doc comments and this crate's own docs name the function freely (this file does,
                // above) — only `//`, deliberately not `*`, the same asymmetry
                // `kernel/tests/permission_boundary.rs` documents for its own scan: skipping `*`
                // lines would also hide a block-comment continuation *and* a real
                // `*slot = publish_unguarded(…)` assignment, which is a hole that fails open. `//`
                // fails the other way — a commented-out mention becomes a false offender, noise
                // rather than a silent pass.
                let code = line.trim_start();
                if code.starts_with("//") {
                    continue;
                }
                if code.contains("publish_unguarded(") {
                    offenders.push(format!("{rel}:{}: {}", n + 1, line.trim()));
                }
            }
        }
    }

    assert!(
        offenders.is_empty(),
        "publish_unguarded is named outside the permission boundary in this crate:\n{}",
        offenders.join("\n")
    );
}

/// The scan above proves an *absence*. This proves the *presence* it is meant to be a property
/// about — that this crate's own publish seam really does go through the gated boundary — so a
/// future refactor that quietly deleted the `boundary::execute` call would fail this test rather
/// than leave the absence-scan vacuously green.
#[test]
fn the_shell_crates_own_publish_seam_calls_the_permission_boundary() {
    let path = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/publish.rs");
    let text = std::fs::read_to_string(&path).unwrap();
    assert!(
        text.contains("boundary::execute("),
        "src/publish.rs no longer calls permission::boundary::execute — the scan above would now \
         be proving nothing"
    );
}
