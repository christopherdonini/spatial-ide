// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Times `spatial_kernel::bundle::redaction::scan` over one file's bytes, already in memory.
//!
//! `redaction-bench gen <dir>` writes the inputs: for each of 1, 16, 64 and 256 MiB,
//! - `random-<n>MiB.bin`: bytes from splitmix64 with a fixed seed, exactly n MiB;
//! - `text-<n>MiB.txt`: one ASCII line repeated, cut to exactly n MiB;
//! - `parquet-<n>MiB.parquet`: one whole file from the engine's fixture writer
//!   (`spatial_engine::fixture::write_geoparquet`, `FixtureSpec::default()` with only `features`
//!   changed), its feature count chosen so its length lands near n MiB. Its exact length is printed;
//!   it is not cut, so it stays a complete parquet file.
//!
//! `redaction-bench run <dir> <runs>` reads each file whole with `std::fs::read` (the product walk's
//! own read), then times `<runs>` calls of `scan` over those bytes, back to back in this process.
//! Only the call is timed; the read is not. Every run's duration, the findings count and the
//! identifiers used are printed.

use std::hint::black_box;
use std::path::{Path, PathBuf};
use std::time::Instant;

use spatial_kernel::bundle::redaction::{scan, MachineIdentifiers};

const MIB: usize = 1 << 20;
const SIZES_MIB: [usize; 4] = [1, 16, 64, 256];
const SEED: u64 = 0x5EED_0017_0013_0001;
/// No credential needle, no drive-letter shape, no identifier below: checked by the zero findings
/// the run prints.
const LINE: &str = "The quick brown fox jumps over the lazy dog 0123456789.\n";

/// Fixed, so a run does not depend on who runs it: one username and one hostname, as a Windows
/// environment yields (`USERNAME`, `COMPUTERNAME`), and the two strings the product publish
/// declares (`kernel/src/publish/mod.rs`, the gate: the viewer's copyright and its
/// corresponding-source route), written as this repository's own.
fn machine() -> MachineIdentifiers {
    MachineIdentifiers {
        usernames: vec!["benchuser".to_string()],
        hostnames: vec!["BENCH-HOST-01".to_string()],
        declared: vec![
            "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".to_string(),
            "https://github.com/christopherdonini/spatial-ide".to_string(),
        ],
    }
}

fn splitmix64(state: &mut u64) -> u64 {
    *state = state.wrapping_add(0x9E37_79B9_7F4A_7C15);
    let mut z = *state;
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

fn random_bytes(n: usize) -> Vec<u8> {
    let mut s = SEED;
    let mut out = Vec::with_capacity(n);
    while out.len() < n {
        out.extend_from_slice(&splitmix64(&mut s).to_le_bytes());
    }
    out.truncate(n);
    out
}

fn text_bytes(n: usize) -> Vec<u8> {
    LINE.as_bytes().iter().copied().cycle().take(n).collect()
}

fn write_parquet(path: &Path, features: usize) -> u64 {
    let spec = spatial_engine::fixture::FixtureSpec {
        features,
        ..Default::default()
    };
    let facts = spatial_engine::fixture::write_geoparquet(path, &spec).expect("fixture writer");
    let len = std::fs::metadata(path).unwrap().len();
    assert_eq!(len, facts.bytes, "the writer's own byte count");
    len
}

fn gen(dir: &Path) {
    std::fs::create_dir_all(dir).unwrap();
    for &m in &SIZES_MIB {
        let n = m * MIB;
        std::fs::write(dir.join(format!("random-{m}MiB.bin")), random_bytes(n)).unwrap();
        std::fs::write(dir.join(format!("text-{m}MiB.txt")), text_bytes(n)).unwrap();
    }
    // Bytes per feature from a probe write, then two corrections toward each target length.
    let probe = dir.join("parquet-probe.parquet");
    let probe_features = 20_000;
    let bpf = write_parquet(&probe, probe_features) as f64 / probe_features as f64;
    std::fs::remove_file(&probe).unwrap();
    for &m in &SIZES_MIB {
        let target = (m * MIB) as f64;
        let path = dir.join(format!("parquet-{m}MiB.parquet"));
        let mut features = (target / bpf).round() as usize;
        let mut len = write_parquet(&path, features);
        for _ in 0..2 {
            features = (features as f64 * target / len as f64).round() as usize;
            len = write_parquet(&path, features);
        }
        println!(
            "PARQUET target_mib={m} features={features} bytes={len} vs_target={:+.4}%",
            (len as f64 / target - 1.0) * 100.0
        );
    }
}

fn median(v: &mut [f64]) -> f64 {
    v.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let n = v.len();
    if n % 2 == 1 {
        v[n / 2]
    } else {
        (v[n / 2 - 1] + v[n / 2]) / 2.0
    }
}

fn run(dir: &Path, runs: usize) {
    let m = machine();
    println!(
        "IDENTIFIERS usernames={:?} hostnames={:?} declared={:?}",
        m.usernames, m.hostnames, m.declared
    );
    println!("COLUMNS content size_mib bytes run seconds ns_per_byte mib_per_s findings");
    for content in ["random", "text", "parquet"] {
        for &mib in &SIZES_MIB {
            let ext = match content {
                "random" => "bin",
                "text" => "txt",
                _ => "parquet",
            };
            let name = format!("{content}-{mib}MiB.{ext}");
            let path: PathBuf = dir.join(&name);
            let bytes = std::fs::read(&path).unwrap();
            let mut secs = Vec::with_capacity(runs);
            for r in 1..=runs {
                let t0 = Instant::now();
                let found = scan(black_box(&name), black_box(&bytes), black_box(&m));
                let dt = t0.elapsed().as_secs_f64();
                let found = black_box(found);
                secs.push(dt);
                println!(
                    "RUN {content} {mib} {} {r} {dt:.6} {:.4} {:.2} {}",
                    bytes.len(),
                    dt * 1e9 / bytes.len() as f64,
                    bytes.len() as f64 / MIB as f64 / dt,
                    found.len()
                );
                if r == 1 {
                    for f in found.iter().take(5) {
                        println!(
                            "FINDING {content} {mib} class={} offset={} excerpt={:?}",
                            f.class, f.byte_offset, f.excerpt
                        );
                    }
                }
            }
            let (lo, hi) = secs
                .iter()
                .fold((f64::MAX, f64::MIN), |(a, b), &x| (a.min(x), b.max(x)));
            let med = median(&mut secs.clone());
            println!(
                "SUMMARY {content} {mib} bytes={} runs={runs} median_s={med:.6} min_s={lo:.6} max_s={hi:.6} spread_pct={:.2} median_ns_per_byte={:.4} median_mib_per_s={:.2}",
                bytes.len(),
                (hi - lo) / med * 100.0,
                med * 1e9 / bytes.len() as f64,
                bytes.len() as f64 / MIB as f64 / med
            );
        }
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    match args.get(1).map(String::as_str) {
        Some("gen") => gen(Path::new(&args[2])),
        Some("run") => run(Path::new(&args[2]), args[3].parse().unwrap()),
        _ => panic!("usage: redaction-bench gen <dir> | run <dir> <runs>"),
    }
}
