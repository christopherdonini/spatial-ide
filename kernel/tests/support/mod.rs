// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Shared measurement instruments** — the canary, the process-memory sampler, the disk-free gate,
//! the hardware profile, the percentile helpers, and the watchdog.
//!
//! ## Why this module exists now and did not before
//!
//! `slice_budgets.rs`, `indexed_budgets.rs` and `concurrency_in_situ.rs` each carry their own copy
//! of the canary and the `procmem` binding. Three copies was already one too many; the 5 GB scale
//! pass would have made four, and an instrument that exists in four places is an instrument whose
//! four versions can silently disagree — which is exactly the failure `renderer/tests/data/
//! manifest-key-sets.json` exists to prevent one level up.
//!
//! **The three existing harnesses are deliberately not migrated onto this module.** They are frozen
//! instruments: `kernel/RESULTS.md` attributes recorded numbers to the trees those files were in,
//! and rewriting them to import from here would change instruments that are not being re-run in
//! order to tidy code that is not in this cut's scope. The duplication is recorded here as owed
//! rather than removed under a measurement cut.
//!
//! Nothing in this module measures the system under test. It measures **the machine**, so that a
//! number taken on a machine that moved can be seen to have been taken on a machine that moved.

#![allow(dead_code)] // Each harness uses a different subset; unused-here is not unused.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

// ---------------------------------------------------------------------------------------------
// The canary
// ---------------------------------------------------------------------------------------------

/// The canary workload: fixed, transport-insensitive, touching no socket and no database.
///
/// Its whole purpose is to be *the same work every time*, so that if two readings of it disagree
/// the machine moved underneath the numbers taken between them.
pub fn canary_ms(iters: u64) -> f64 {
    let t = Instant::now();
    let mut acc = 0u64;
    for i in 0..iters {
        acc = acc.wrapping_add(i.rotate_left(7) ^ 0x9e37_79b9_7f4a_7c15);
    }
    std::hint::black_box(acc);
    t.elapsed().as_secs_f64() * 1000.0
}

/// Kept for comparability with `concurrency_in_situ.rs`'s artifact.
///
/// **Too short to be a stable instrument on this hardware** — a reading lands around 7 ms, inside
/// the CPU's own frequency-transition window, and consecutive readings on an idle machine have
/// disagreed by up to 3×. Recorded, never relied on alone.
pub const CANARY_ITERS_SHORT: u64 = 40_000_000;
/// The instrument the invalidator is actually taken on.
pub const CANARY_ITERS_LONG: u64 = 400_000_000;

/// The declared spread above which a phase's canary points invalidate that phase.
pub const CANARY_MAX_SPREAD: f64 = 0.10;

#[derive(Clone)]
pub struct Canary {
    pub label: String,
    pub short: Vec<f64>,
    pub long: Vec<f64>,
}

impl Canary {
    pub fn take(label: &str) -> Self {
        let short: Vec<f64> = (0..5).map(|_| canary_ms(CANARY_ITERS_SHORT)).collect();
        let long: Vec<f64> = (0..3).map(|_| canary_ms(CANARY_ITERS_LONG)).collect();
        let c = Self { label: label.to_string(), short, long };
        println!(
            "canary [{label}] short min {:.2} ms | long min {:.1} ms",
            c.short_min(),
            c.long_min()
        );
        c
    }
    pub fn short_min(&self) -> f64 {
        sorted(&self.short)[0]
    }
    pub fn long_min(&self) -> f64 {
        sorted(&self.long)[0]
    }
    pub fn json(&self) -> String {
        format!(
            r#"{{"label": {:?}, "short_ms": {}, "short_min_ms": {:.3}, "long_ms": {}, "long_min_ms": {:.3}}}"#,
            self.label,
            json_f64s(&self.short),
            self.short_min(),
            json_f64s(&self.long),
            self.long_min()
        )
    }
}

/// Per-phase canary spreads — **the registered invalidator, and the scope matters**.
///
/// The preregistration declares: *"the 400 M instrument at the start and end of every phase; a
/// spread above the declared 10 % across **a phase's** canary points invalidates **that phase**."*
///
/// An earlier implementation took a global min/max over every point in the pass and invalidated the
/// whole run. That is **stricter** than what was registered, and it is wrong for a pass long enough
/// to heat the machine: a phase can sit comfortably inside the bound while the pass as a whole
/// drifts past it, and the global test then discards phases whose own numbers are clean.
///
/// Returns one entry per interval: `(phase, spread, within_bound)`, where `phase` is the label of
/// the point that **ends** the interval — the phase that ran between the two readings.
pub fn phase_spreads(points: &[Canary]) -> Vec<(String, f64, bool)> {
    points
        .windows(2)
        .map(|w| {
            let (a, b) = (w[0].long_min(), w[1].long_min());
            let spread = if a.min(b) > 0.0 { (a - b).abs() / a.min(b) } else { f64::INFINITY };
            (w[1].label.clone(), spread, spread <= CANARY_MAX_SPREAD)
        })
        .collect()
}

// ---------------------------------------------------------------------------------------------
// Process memory
// ---------------------------------------------------------------------------------------------

/// Windows private commit, via `K32GetProcessMemoryInfo`.
///
/// Declared by hand rather than pulled from a crate: `kernel32` is already linked, so this needs no
/// dependency and no `psapi` link directive.
#[cfg(windows)]
pub mod procmem {
    #[repr(C)]
    #[derive(Default, Clone, Copy)]
    pub struct Counters {
        cb: u32,
        page_fault_count: u32,
        pub peak_working_set: usize,
        pub working_set: usize,
        quota_peak_paged_pool: usize,
        quota_paged_pool: usize,
        quota_peak_non_paged_pool: usize,
        quota_non_paged_pool: usize,
        pagefile_usage: usize,
        peak_pagefile_usage: usize,
        /// `PROCESS_MEMORY_COUNTERS_EX.PrivateUsage` — Windows **private commit**, the figure
        /// `docs/08`'s memory row names.
        pub private_usage: usize,
    }

    extern "system" {
        fn GetCurrentProcess() -> isize;
        fn K32GetProcessMemoryInfo(h: isize, c: *mut Counters, cb: u32) -> i32;
    }

    pub fn sample() -> Option<Counters> {
        let mut c = Counters { cb: std::mem::size_of::<Counters>() as u32, ..Default::default() };
        let ok = unsafe {
            K32GetProcessMemoryInfo(
                GetCurrentProcess(),
                &mut c,
                std::mem::size_of::<Counters>() as u32,
            )
        };
        (ok != 0).then_some(c)
    }
}

#[cfg(not(windows))]
pub mod procmem {
    #[derive(Default, Clone, Copy)]
    pub struct Counters {
        pub peak_working_set: usize,
        pub working_set: usize,
        pub private_usage: usize,
    }
    /// **`None`, not zero.** A platform this cannot read is a gap in the instrument, and a zero
    /// would be a measurement that says the process used no memory.
    pub fn sample() -> Option<Counters> {
        None
    }
}

/// Samples private commit on its own thread until stopped.
///
/// **The cadence is a pre-registered parameter, not a constant**, because a 20-minute phase at
/// 50 ms would retain 24 000 samples and changing it mid-run would be a protocol change made after
/// a result was seen. It is recorded in the artifact beside the samples it produced.
pub struct MemorySampler {
    stop: Arc<AtomicBool>,
    handle: Option<std::thread::JoinHandle<Vec<usize>>>,
    pub cadence_ms: u64,
}

impl MemorySampler {
    pub fn start(cadence_ms: u64) -> Self {
        let stop = Arc::new(AtomicBool::new(false));
        let s = stop.clone();
        let handle = std::thread::spawn(move || {
            let mut samples = Vec::new();
            while !s.load(Ordering::Relaxed) {
                if let Some(c) = procmem::sample() {
                    samples.push(c.private_usage);
                }
                std::thread::sleep(Duration::from_millis(cadence_ms));
            }
            samples
        });
        Self { stop, handle: Some(handle), cadence_ms }
    }

    /// Stop and return every sample taken.
    pub fn finish(mut self) -> Vec<usize> {
        self.stop.store(true, Ordering::Relaxed);
        self.handle.take().map(|h| h.join().unwrap_or_default()).unwrap_or_default()
    }
}

// ---------------------------------------------------------------------------------------------
// The watchdog
// ---------------------------------------------------------------------------------------------

/// A phase's declared ceilings (ADR-010 rule 6), and what fires at them.
///
/// **Two ceilings, because one number cannot serve both.** `total` bounds the whole phase;
/// `silence` bounds the gap between progress reports — `PublishPhase::Querying` is silent by
/// construction while DuckDB sorts, so a phase can be healthy and quiet for minutes.
///
/// At a ceiling the watchdog fires the phase's own `CancelToken` — **the product mechanism**, so a
/// fired watchdog exercises cancellation but is never counted as a measured cancellation sample —
/// waits the declared grace, and then aborts the process so the artifact cannot be finished with a
/// number that came from a phase nobody bounded.
pub struct Watchdog {
    fired: Arc<AtomicBool>,
    stop: Arc<AtomicBool>,
    beat: Arc<std::sync::Mutex<Instant>>,
    handle: Option<std::thread::JoinHandle<()>>,
}

/// Declared grace between firing the cancel token and aborting.
pub const WATCHDOG_GRACE: Duration = Duration::from_secs(60);

impl Watchdog {
    pub fn start(
        phase: &'static str,
        total: Duration,
        silence: Option<Duration>,
        cancel: spatial_engine::CancelToken,
    ) -> Self {
        let fired = Arc::new(AtomicBool::new(false));
        let stop = Arc::new(AtomicBool::new(false));
        let beat = Arc::new(std::sync::Mutex::new(Instant::now()));
        let (f, s, b) = (fired.clone(), stop.clone(), beat.clone());
        let started = Instant::now();

        let handle = std::thread::spawn(move || {
            loop {
                if s.load(Ordering::Relaxed) {
                    return;
                }
                std::thread::sleep(Duration::from_millis(250));

                let over_total = started.elapsed() > total;
                let over_silence = silence.is_some_and(|q| {
                    b.lock().map(|t| t.elapsed() > q).unwrap_or(false)
                });
                if !(over_total || over_silence) {
                    continue;
                }

                let why = if over_total { "total" } else { "silence" };
                eprintln!(
                    "[watchdog] phase `{phase}` exceeded its declared {why} ceiling after {:.1} s \
                     — firing the cancel token, then aborting after the declared {} s grace. This \
                     phase is `unmeasured` and is NOT re-run in this cut (ADR-010 rule 6).",
                    started.elapsed().as_secs_f64(),
                    WATCHDOG_GRACE.as_secs()
                );
                f.store(true, Ordering::SeqCst);
                cancel.cancel();

                let grace_start = Instant::now();
                while grace_start.elapsed() < WATCHDOG_GRACE {
                    if s.load(Ordering::Relaxed) {
                        return; // the phase returned inside the grace; the fire is still recorded
                    }
                    std::thread::sleep(Duration::from_millis(100));
                }
                eprintln!("[watchdog] phase `{phase}` did not return inside the grace; aborting");
                std::process::abort();
            }
        });
        Self { fired, stop, beat, handle: Some(handle) }
    }

    /// One heartbeat. Called from a progress observer; resets the silence clock.
    pub fn beat(&self) {
        if let Ok(mut t) = self.beat.lock() {
            *t = Instant::now();
        }
    }

    /// Whether the watchdog fired. **Recorded even when the phase then completed** — a phase that
    /// finished inside the grace still had its cancel token fired, and its numbers are not clean.
    pub fn fired(&self) -> bool {
        self.fired.load(Ordering::SeqCst)
    }

    pub fn finish(mut self) -> bool {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(h) = self.handle.take() {
            let _ = h.join();
        }
        self.fired.load(Ordering::SeqCst)
    }
}

// ---------------------------------------------------------------------------------------------
// Machine facts and small helpers
// ---------------------------------------------------------------------------------------------

pub fn refuse_debug(harness: &str) {
    assert!(
        !cfg!(debug_assertions),
        "{harness} produces measurements, and a debug build invalidates every one of them. A \
         number taken on a debug build is not a smaller number, it is not a measurement. Run with \
         --release."
    );
}

pub fn hardware_profile() -> String {
    let out = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "$c=Get-CimInstance Win32_Processor|Select-Object -First 1; \
             $o=Get-CimInstance Win32_OperatingSystem; \
             $m=Get-CimInstance Win32_ComputerSystem; \
             '{0} | cores {1}/{2} | RAM {3} GiB | {4} {5}' -f \
             $c.Name.Trim(),$c.NumberOfCores,$c.NumberOfLogicalProcessors, \
             [math]::Round($m.TotalPhysicalMemory/1GB,1),$o.Caption.Trim(),$o.BuildNumber",
        ])
        .output();
    match out {
        Ok(o) if o.status.success() => String::from_utf8_lossy(&o.stdout).trim().to_string(),
        _ => "unavailable".to_string(),
    }
}

/// The storage medium the fixture sits on. Recorded because 403 scattered column-chunk reads behave
/// very differently on a spindle than on an SSD, and the cold-open row turns on exactly that.
pub fn media_type() -> String {
    let out = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "(Get-PhysicalDisk | Select-Object -First 1 -ExpandProperty MediaType)",
        ])
        .output();
    match out {
        Ok(o) if o.status.success() => String::from_utf8_lossy(&o.stdout).trim().to_string(),
        _ => "unavailable".to_string(),
    }
}

pub fn free_bytes_on_c() -> Option<u64> {
    let out = std::process::Command::new("powershell")
        .args(["-NoProfile", "-Command", "(Get-PSDrive C).Free"])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

/// The declared floor. Every phase refuses to start below it.
pub const MIN_FREE_BYTES: u64 = 20 * 1024 * 1024 * 1024;

/// Refuse to start a phase below the declared disk floor.
pub fn require_disk(phase: &str) -> u64 {
    let free = free_bytes_on_c().unwrap_or(0);
    assert!(
        free >= MIN_FREE_BYTES,
        "phase `{phase}` refuses to start: {:.1} GiB free, declared floor {} GiB. Recorded as an \
         invalidator, not worked around.",
        free as f64 / (1u64 << 30) as f64,
        MIN_FREE_BYTES >> 30
    );
    free
}

/// A fixture's size and content hash, for the "recorded in the artifact, re-verified rather than
/// assumed" discipline every measurement pass in this family follows.
///
/// **Added here rather than left duplicated a third time.** `kernel/tests/first_batch_factorial.rs`
/// carries its own private copy and stays on it — that harness is a frozen instrument
/// (`kernel/RESULTS.md` attributes its numbers to the tree it was measured on, and migrating it here
/// to tidy code is not this cut's business) — but a *new* harness reaching for the identical logic a
/// third time is exactly the drift this module's own header warns about.
pub fn file_facts(p: &std::path::Path) -> (u64, String) {
    let Ok(md) = std::fs::metadata(p) else { return (0, "absent".into()) };
    let hash = spatial_engine::index::content_hash(p, &spatial_engine::CancelToken::new())
        .map(|(h, _)| h)
        .unwrap_or_else(|_| "unreadable".into());
    (md.len(), hash)
}

/// **`total_cmp`, not `partial_cmp().unwrap()`.** A zero-batch run legitimately produces a NaN
/// first-batch time, and the unwrap turned that into a panic at the END of a phase -- losing the
/// whole phase instead of reporting the empty run it was trying to describe.
pub fn sorted(v: &[f64]) -> Vec<f64> {
    let mut s = v.to_vec();
    s.sort_by(|a, b| a.total_cmp(b));
    s
}

pub fn pct(sorted: &[f64], p: f64) -> f64 {
    if sorted.is_empty() {
        return f64::NAN;
    }
    let rank = (p * sorted.len() as f64).ceil() as usize;
    sorted[rank.clamp(1, sorted.len()) - 1]
}

pub fn json_f64s(v: &[f64]) -> String {
    let body: Vec<String> = v.iter().map(|x| format!("{x:.3}")).collect();
    format!("[{}]", body.join(", "))
}

pub fn json_usizes(v: &[usize]) -> String {
    let body: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    format!("[{}]", body.join(", "))
}

pub fn json_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            // Control characters become spaces rather than escapes: these are one-line identity
            // strings, and a literal newline inside one would be a different kind of wrong.
            c if c.is_control() => out.push(' '),
            c => out.push(c),
        }
    }
    out
}

/// A summary of a sample set, in the shape every prior section reports.
pub fn summarize(label: &str, samples: &[f64]) -> String {
    let s = sorted(samples);
    format!(
        r#"{{"label": {:?}, "n": {}, "min_ms": {:.3}, "p50_ms": {:.3}, "p95_ms": {:.3}, "max_ms": {:.3}, "samples_ms": {}}}"#,
        label,
        s.len(),
        s.first().copied().unwrap_or(f64::NAN),
        pct(&s, 0.5),
        pct(&s, 0.95),
        s.last().copied().unwrap_or(f64::NAN),
        json_f64s(samples)
    )
}
