// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! WAVE1 A3 reproducer probe (evidence only, not product code): a filter predicate that is **under**
//! `MAX_PREDICATE_BYTES` but nests deeply, admitted on a thread with the 2 MiB stack that both
//! `std::thread::spawn` and tokio's `spawn_blocking` (the shell's `viewport_query` command) default
//! to.
//!
//! `MAX_PREDICATE_DEPTH` bounds only this crate's own `walk_expr` recursion, which runs *after*
//! DuckDB's C++ parser, transformer and `json_serialize_sql` have already recursed over the whole
//! tree. Each probe below prints the depth it reached and the typed outcome; a stack overflow
//! aborts the whole test process instead, which is the observation being tested for.
//!
//! Run one probe at a time: `cargo test -p spatial-engine --test wave1_a3_predicate_parser_depth
//! -- --exact <name> --nocapture`.

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec};
use spatial_engine::{AdmittedPredicate, Dataset, MAX_PREDICATE_BYTES};

const TWO_MIB: usize = 2 * 1024 * 1024;

fn dataset() -> Dataset {
    static FIXTURE: std::sync::OnceLock<std::path::PathBuf> = std::sync::OnceLock::new();
    let path = FIXTURE.get_or_init(|| {
        let spec = FixtureSpec {
            features: 50,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            ..Default::default()
        };
        let dir = std::env::temp_dir().join("spatial-engine-wave1-a3-depth");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("zoned.parquet");
        write_geoparquet(&path, &spec).expect("fixture");
        path
    });
    Dataset::open(path).expect("open")
}

/// Admit `predicate` on a fresh 2 MiB-stack thread and return the outcome's debug text. If the
/// C++ side overflows the stack, this never returns: the process dies.
fn admit_on_2mib_thread(predicate: String) -> String {
    assert!(predicate.len() <= MAX_PREDICATE_BYTES, "probe must stay under the byte ceiling");
    let ds = dataset();
    std::thread::Builder::new()
        .stack_size(TWO_MIB)
        .spawn(move || match AdmittedPredicate::admit(predicate, &ds) {
            Ok(_) => "admitted".to_string(),
            Err(e) => format!("{e:?}"),
        })
        .unwrap()
        .join()
        .expect("admission thread")
}

fn probe(label: &str, build: impl Fn(usize) -> String, depth: usize) {
    let p = build(depth);
    eprintln!("[{label}] depth={depth} bytes={} ...", p.len());
    let out = admit_on_2mib_thread(p);
    let shown: String = out.chars().take(200).collect();
    eprintln!("[{label}] depth={depth} -> {shown}");
}

fn left_assoc_plus(n: usize) -> String {
    // `1+1+...+1 = 1` — left-associative, so the parse tree is `n` deep with no parentheses.
    format!("{} = 1", vec!["1"; n + 1].join("+"))
}

fn unary_minus(n: usize) -> String {
    format!("{}1{} = 1", "-(".repeat(n), ")".repeat(n))
}

fn not_chain(n: usize) -> String {
    format!("{}zone IS NULL", "NOT ".repeat(n))
}

#[test]
fn probe_left_assoc_plus_under_byte_ceiling() {
    for depth in [100, 500, 900, 999, 1000, 1500, 2000] {
        probe("plus", left_assoc_plus, depth);
    }
}

#[test]
fn probe_unary_minus_under_byte_ceiling() {
    for depth in [100, 500, 900, 999, 1000, 1300] {
        probe("minus", unary_minus, depth);
    }
}

#[test]
fn probe_not_chain_under_byte_ceiling() {
    for depth in [100, 500, 900, 999, 1000] {
        probe("not", not_chain, depth);
    }
}
