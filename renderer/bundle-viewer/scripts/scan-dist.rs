// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The viewer build's scan of `dist/`: the kernel's own `redaction::scan_directory`, compiled on its
//! own by `scan-dist.mjs`, from the same source file the kernel compiles (the `#[path]` below).
//!
//! One line per finding: file, class and byte offset, tab-separated, and never an excerpt. No
//! identities and no declared strings: the build machine's names are not the operator's, and the
//! byte classes do not depend on them. A failed walk exits non-zero.
#![allow(dead_code)]

#[path = "../../../kernel/src/bundle/redaction.rs"]
mod redaction;

fn main() {
    let Some(root) = std::env::args_os().nth(1) else {
        eprintln!("usage: scan-dist <directory>");
        std::process::exit(2);
    };
    let machine = redaction::MachineIdentifiers::default();
    match redaction::scan_directory(std::path::Path::new(&root), &machine) {
        Ok(findings) => {
            for f in findings {
                println!("{}\t{}\t{}", f.file, f.class, f.byte_offset);
            }
        }
        Err(e) => {
            eprintln!("scan-dist: the walk failed: {e}");
            std::process::exit(2);
        }
    }
}
