// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Times `Dataset::open` and nothing else.** The cold-open phase's only moving part.
//!
//! ```text
//! time-open --data <file.parquet> [--repeat N] [--json <out.json>]
//! ```
//!
//! ## Why this is its own process
//!
//! A cold sample must be the **first** thing that touches the file after a reboot. Any harness that
//! also generated, streamed or hashed would have warmed the cache before the clock started — so the
//! cold-open phase runs this, once, and nothing else.
//!
//! It deliberately does **not** hash the fixture: at 5 GB that is a whole-file read, and it would
//! warm the very file being measured. Integrity at cold time is the length+mtime heuristic the
//! engine already has; the full hash is re-verified afterwards, by the harness, in a later phase.
//!
//! ## What is timed
//!
//! `Instant` around `Dataset::open` alone — not process start, not argument parsing, not the print.
//! At 5 GB that call reads the parquet footer plus **one column** (the `id` column, for ADR-016's
//! uniqueness scan), which is why the cold-open budget is nearly independent of the other 4.95 GB.

use std::path::PathBuf;
use std::time::Instant;

use spatial_engine::Dataset;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut data: Option<PathBuf> = None;
    let mut repeat = 1usize;
    let mut json_out: Option<PathBuf> = None;

    let mut args = std::env::args().skip(1);
    while let Some(a) = args.next() {
        match a.as_str() {
            "--data" => data = args.next().map(PathBuf::from),
            "--repeat" => repeat = args.next().ok_or("--repeat needs a value")?.parse()?,
            "--json" => json_out = args.next().map(PathBuf::from),
            other => return Err(format!("unknown argument `{other}`").into()),
        }
    }
    let data = data.ok_or("--data is required")?;

    // Refused rather than warned: a cold-open number from a debug build is not a smaller number,
    // it is not a measurement.
    if cfg!(debug_assertions) {
        return Err("this is a measurement instrument and refuses to run on a debug build".into());
    }

    let mut samples_ms = Vec::with_capacity(repeat);
    let mut facts = String::new();
    for i in 0..repeat {
        let t = Instant::now();
        let ds = Dataset::open(&data)?;
        let ms = t.elapsed().as_secs_f64() * 1000.0;
        samples_ms.push(ms);
        if i == 0 {
            // Recorded once, from the first open, so the artifact says what was opened rather than
            // only how long it took.
            facts = format!(
                r#""crs": "{}", "crs_source": "{}", "id_uniqueness": "{}""#,
                ds.crs().identifier(),
                ds.crs().source().as_str(),
                ds.identity().uniqueness().as_str()
            );
        }
        println!("open {} : {ms:.3} ms", i + 1);
        drop(ds);
    }

    let body: Vec<String> = samples_ms.iter().map(|m| format!("{m:.3}")).collect();
    let json = format!(
        r#"{{"path": {:?}, "repeat": {repeat}, "samples_ms": [{}], {facts}}}"#,
        data.display().to_string(),
        body.join(", ")
    );
    if let Some(p) = json_out {
        std::fs::write(p, &json)?;
    }
    println!("{json}");
    Ok(())
}
