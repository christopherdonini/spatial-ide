// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The query-window attribution pass — `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`.
//!
//! **The preregistration is the contract and this file implements it.** Where the two disagree the
//! preregistration wins and this file is the defect. Nothing here decides a viewport, a ceiling, a
//! sample count or the decision rule — all of those are in that document.
//!
//! ## One process per trial, reused from `first_batch_factorial.rs`
//!
//! `trace::start` refuses a second concurrent trace in one process (`engine/src/trace.rs`'s
//! declared "one traced stream per traced run" limit), and every trial in this pass is traced. A
//! single-process loop would therefore make trial order load-bearing for the one instrument this
//! pass exists to trust. The driver re-executes **this same test binary** once per trial, with the
//! cell in an environment variable; the child writes its result to a **file**, never to stdout — the
//! previous cut's attempt-1 lesson (`kernel/RESULTS.md`, "the transferable lesson"): a console
//! sentinel that is not first on its own line is invisible to both a parser and a human skimming the
//! same console.
//!
//! ## What this harness may not do
//!
//! - **Never amend the preregistration.** A phase that cannot run as declared records
//!   `unmeasured — <reason>` and does not improvise past scope.
//! - **Never promote a trial whose additivity check failed into a cell's statistics.** That is an
//!   instrument defect, not a data point, and it stops the harness (§4 of the preregistration).

mod support;

use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use std::time::{Duration, Instant};

use spatial_engine::trace;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use support::*;

// ---- the fixture, reused rather than regenerated (preregistration §2) ---------------------------

const FEATURES: usize = 100_000;
const CELL_M: f64 = 40.0;
const E_LO: f64 = 2_600_000.0;
const N_LO: f64 = 1_200_000.0;

fn grid_cols() -> f64 {
    (FEATURES as f64).sqrt().ceil()
}

fn fixture_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/first-batch/parcels-145mb.parquet")
}

/// An edge on a cell **centre**, same construction `first_batch_factorial.rs::edge` uses, so this
/// pass's viewports select the exact row counts already registered there: whole = 100,000,
/// near-quarter = 25,281, 1/64 = 1,600.
fn edge(cols: f64, divisor: usize) -> f64 {
    ((cols as usize / divisor) as f64) * CELL_M + CELL_M / 2.0
}

// ---- the cell space (preregistration §3) ---------------------------------------------------------

#[derive(Clone, Copy)]
enum ViewId {
    Whole,
    NearQuarter,
    Sixty4th,
}

impl ViewId {
    fn as_str(self) -> &'static str {
        match self {
            Self::Whole => "whole",
            Self::NearQuarter => "near-quarter",
            Self::Sixty4th => "1-64",
        }
    }
    fn parse(s: &str) -> Option<Self> {
        match s {
            "whole" => Some(Self::Whole),
            "near-quarter" => Some(Self::NearQuarter),
            "1-64" => Some(Self::Sixty4th),
            _ => None,
        }
    }
    fn bbox(self, cols: f64) -> Option<Bbox> {
        match self {
            Self::Whole => None,
            Self::NearQuarter => Some(Bbox {
                xmin: E_LO,
                ymin: N_LO,
                xmax: E_LO + edge(cols, 2),
                ymax: N_LO + edge(cols, 2),
            }),
            Self::Sixty4th => Some(Bbox {
                xmin: E_LO,
                ymin: N_LO,
                xmax: E_LO + edge(cols, 8),
                ymax: N_LO + edge(cols, 8),
            }),
        }
    }
    /// **The exact predicted row count, restated from `first_batch_factorial.rs`'s independently
    /// derived and unit-tested constants** rather than recomputed here — a second, slightly
    /// different derivation would be a second place for the same bug to hide.
    fn predicted_rows(self) -> u64 {
        match self {
            Self::Whole => 100_000,
            Self::NearQuarter => 25_281,
            Self::Sixty4th => 1_600,
        }
    }
}

const VIEWPORTS: [ViewId; 3] = [ViewId::Whole, ViewId::NearQuarter, ViewId::Sixty4th];
/// A floor, not a target (preregistration §3).
const N: usize = 7;

/// **Not `#[ignore]`d — it costs nothing and it is what keeps this file's restated geometry
/// constants from drifting away from `first_batch_factorial.rs`'s independently unit-tested
/// ones** (that file's constants are private to it, so this file restates rather than imports them;
/// see `ViewId::bbox`'s doc). Without this, a divergence would surface 120 s into a measurement run
/// at the earliest, in the `#[ignore]`d driver's own row-count assertion — the same class of gap
/// `the_predicted_row_counts_match_the_numbers_registered_before_this_harness` exists to close for
/// the sibling file.
#[test]
fn the_restated_geometry_constants_match_the_registered_fixture() {
    assert_eq!(grid_cols(), 317.0, "317 is 100_000.sqrt().ceil() — a features/CELL_M drift");
    assert_eq!(edge(317.0, 2), 6_340.0, "near-quarter's edge");
    assert_eq!(edge(317.0, 8), 1_580.0, "1/64's edge");
    assert_eq!(ViewId::Whole.predicted_rows(), FEATURES as u64);
    assert_eq!(ViewId::NearQuarter.predicted_rows(), 159 * 159, "columns 0..=158, rows 0..=158 — all 159 rows are full-width at this depth (315 of 317 grid rows are full), so no partial-row term applies");
    assert_eq!(ViewId::Sixty4th.predicted_rows(), 40 * 40, "40x40, no partial row at this depth");
}

fn interleaved(len: usize, r: usize) -> Vec<usize> {
    (0..len).map(|i| (i + 5 * r) % len).collect()
}

// ---- ceilings, settle (preregistration §7 — reused from the factorial pass, same 145 MB class) ---

const CEIL_TRIAL: Duration = Duration::from_secs(120);
const SETTLE_OPENING: u64 = 120;
const SETTLE_CANARY: u64 = 60;

fn evidence_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/query-window-attribution");
    std::fs::create_dir_all(&d).unwrap();
    d
}

// ---- the child: exactly one trial, one JSON file ---------------------------------------------------

const VIEW_VAR: &str = "SPATIAL_QWA_VIEW";
const OUT_VAR: &str = "SPATIAL_QWA_OUT";

/// One trial, in a process of its own. The result goes to a file, never to stdout — see the module
/// doc's "attempt-1 lesson".
#[test]
fn qwa_trial_child() {
    let (Ok(view), Ok(out)) = (std::env::var(VIEW_VAR), std::env::var(OUT_VAR)) else {
        // The ordinary suite runs this and it does nothing.
        return;
    };
    let view = ViewId::parse(&view).expect("the driver passed an unparseable viewport");
    let json = run_one_trial(view);
    let mut f = std::fs::File::create(&out).expect("create the trial's result file");
    f.write_all(json.as_bytes()).expect("write the trial result");
    f.sync_all().expect("flush the trial result");
    println!("trial {} -> {}", view.as_str(), json);
}

fn run_one_trial(view: ViewId) -> String {
    let path = fixture_path();
    let ds = match Dataset::open(&path) {
        Ok(d) => d,
        Err(e) => return trial_error(view, "open", &e.to_string()),
    };

    let q = match view.bbox(grid_cols()) {
        None => ViewportQuery::all(),
        Some(b) => ViewportQuery::viewport(b, ds.crs().identifier()),
    };

    // Every trial in this pass is traced — this pass's only output is the decomposition
    // (preregistration §3).
    let guard = match trace::start(trace::TraceKey {
        label: view.as_str().into(),
        ..Default::default()
    }) {
        Some(g) => g,
        None => return trial_error(view, "trace", "a trace is already running in this process"),
    };

    let cancel = CancelToken::new();
    let mut stream = match ds.stream_with_cancel(&q, cancel) {
        Ok(s) => s,
        Err(e) => return trial_error(view, "stream", &e.to_string()),
    };
    // `as_str()`, not `{:?}` — its doc states the reason: "so a harness and an error message cannot
    // disagree about what a cell ran". Every sibling harness in this workspace uses it.
    let filter_plan_name = stream.filter_plan().as_str();
    let reused_connection = stream.connection_facts().reused_an_existing_connection;

    let mut buf = Vec::new();
    let mut rows = 0u64;
    let mut err: Option<String> = None;
    while let Some(info) = stream.next_into(&mut buf) {
        match info {
            Ok(i) => {
                rows += i.rows as u64;
                buf.clear();
            }
            Err(e) => {
                err = Some(e.to_string());
                break;
            }
        }
    }
    drop(stream);
    // Producer-thread marks (`producer_finished` in particular) can trail the consumer's last
    // `next_into` by a few microseconds; nothing here waits on it because no segment this pass
    // reports depends on it — every span it derives closes at `first_source_row` or earlier.

    let t = guard.trace();
    // Carried per trial so preregistration §1's "zero is asserted, not assumed" is satisfiable
    // downstream. **Not asserted here** — every query-window segment closes at `first_source_row` or
    // earlier, well before `TRACE_BUFFER_RECORDS` could plausibly fill on this fixture, so a nonzero
    // reading would be surprising rather than expected, but this child has no cell-level view to
    // decide "surprising for this pass" from. The driver's summarizer (next step, once real trials
    // exist) is where zero gets asserted across the whole run, not per trial.
    let dropped = t.dropped();

    // ---- segments, resolved from `trace::SPANS` — never from hardcoded event pairs -------------
    //
    // **This is the fix for a defect review found once already, in a different file.**
    // `engine/src/trace.rs`'s `the_spans_table_telescopes_by_construction` doc records that an
    // earlier version of *that* test built its legs from hardcoded event constants, so it could not
    // detect a `SPANS` entry re-pointed at the wrong event pair — every workspace test still passed.
    // A first draft of this harness made the identical mistake. `span_nanos` looks the pair up by
    // name in `trace::SPANS` every time, so if a table entry is ever re-pointed, this harness starts
    // measuring (and, via the additivity check below, refusing) whatever that edit actually did,
    // rather than silently continuing to report a fixed formula the table no longer describes.
    let leaf_names = [
        trace::SPAN_PRODUCER_HANDOFF,
        trace::SPAN_STATEMENT_PREPARE,
        trace::SPAN_PARAM_ASSEMBLY,
        trace::SPAN_BIND_AND_EXECUTE,
        trace::SPAN_FIRST_FETCH,
    ];
    let leaf_nanos: Vec<Option<i128>> = leaf_names.iter().map(|n| span_nanos(&t, n)).collect();
    let lease_bind_nanos = span_nanos(&t, trace::SPAN_LEASE_BIND);
    let query_nanos = span_nanos(&t, trace::SPAN_QUERY);
    let lease_to_first_row_nanos = span_nanos(&t, trace::SPAN_LEASE_TO_FIRST_ROW);

    // A missing or reversed pair (`Trace::segment_ms`/`first` return `None` for either) is an
    // instrument failure, not a data point — checked *before* the additivity arithmetic below, which
    // would otherwise silently skip a `None` leg rather than refuse the trial.
    if leaf_nanos.iter().any(Option::is_none) || query_nanos.is_none() || lease_to_first_row_nanos.is_none()
    {
        return trial_error(view, "additivity", "a required segment could not be derived (missing or reversed event pair)");
    }
    let leaf_nanos: Vec<i128> = leaf_nanos.into_iter().map(Option::unwrap).collect();
    let query_nanos = query_nanos.unwrap();
    let lease_to_first_row_nanos = lease_to_first_row_nanos.unwrap();

    // `leaf_names`' order is `[producer_handoff, statement_prepare, param_assembly,
    // bind_and_execute, first_fetch]` — indices 2..5 are exactly `query`'s three legs.
    let five_leg_sum: i128 = leaf_nanos.iter().sum();
    let three_leg_sum: i128 = leaf_nanos[2] + leaf_nanos[3] + leaf_nanos[4];
    // **Stops the trial, per the preregistration §4 and this file's own module doc — a trial whose
    // additivity check fails is an instrument defect, never promoted into a cell's statistics.**
    // Checked here, in the child, so a bad trial never reaches the driver with numeric fields that
    // look usable.
    if five_leg_sum != lease_to_first_row_nanos || three_leg_sum != query_nanos {
        return trial_error(
            view,
            "additivity",
            &format!(
                "lease_to_first_row off by {} ns, query off by {} ns — instrument defect",
                five_leg_sum - lease_to_first_row_nanos,
                three_leg_sum - query_nanos
            ),
        );
    }

    format!(
        "{{\"view\":\"{}\",\"rows\":{},\"predicted_rows\":{},\"filter_plan\":\"{}\",\
         \"reused_connection\":{},\"dropped_records\":{},\
         \"lease_bind_ms\":{},\"lease_bind_ns\":{},\
         \"producer_handoff_ms\":{:.3},\"producer_handoff_ns\":{},\
         \"statement_prepare_ms\":{:.3},\"statement_prepare_ns\":{},\
         \"param_assembly_ms\":{:.3},\"param_assembly_ns\":{},\
         \"bind_and_execute_ms\":{:.3},\"bind_and_execute_ns\":{},\
         \"first_fetch_ms\":{:.3},\"first_fetch_ns\":{},\
         \"query_ms\":{:.3},\"query_ns\":{},\
         \"lease_to_first_row_ms\":{:.3},\"lease_to_first_row_ns\":{},\"error\":{}}}",
        view.as_str(),
        rows,
        view.predicted_rows(),
        json_escape(filter_plan_name),
        reused_connection,
        dropped,
        opt_i128_ms(lease_bind_nanos),
        opt_i128(lease_bind_nanos),
        ns_to_ms(leaf_nanos[0]), leaf_nanos[0],
        ns_to_ms(leaf_nanos[1]), leaf_nanos[1],
        ns_to_ms(leaf_nanos[2]), leaf_nanos[2],
        ns_to_ms(leaf_nanos[3]), leaf_nanos[3],
        ns_to_ms(leaf_nanos[4]), leaf_nanos[4],
        ns_to_ms(query_nanos), query_nanos,
        ns_to_ms(lease_to_first_row_nanos), lease_to_first_row_nanos,
        err.map(|e| format!("\"{}\"", json_escape(&e))).unwrap_or_else(|| "null".into()),
    )
}

/// A span's duration in raw nanoseconds, resolved from `trace::SPANS` by name — `None` if either
/// endpoint is missing or the pair resolves backwards (`Trace::first`/`segment_ms`'s own contract).
fn span_nanos(t: &trace::Trace, name: &str) -> Option<i128> {
    let (_, from, to) = trace::SPANS
        .iter()
        .find(|(n, _, _)| *n == name)
        .unwrap_or_else(|| panic!("{name} must be a span in trace::SPANS"));
    let a = t.first(from)?;
    let b = t.first(to)?;
    if b.offset_nanos < a.offset_nanos {
        return None;
    }
    Some(b.offset_nanos as i128 - a.offset_nanos as i128)
}

fn ns_to_ms(n: i128) -> f64 {
    n as f64 / 1_000_000.0
}

fn opt_i128(v: Option<i128>) -> String {
    v.map(|x| x.to_string()).unwrap_or_else(|| "null".into())
}

fn opt_i128_ms(v: Option<i128>) -> String {
    v.map(|x| format!("{:.3}", ns_to_ms(x))).unwrap_or_else(|| "null".into())
}

fn trial_error(view: ViewId, phase: &str, detail: &str) -> String {
    format!(
        "{{\"view\":\"{}\",\"error\":\"{}: {}\"}}",
        view.as_str(),
        phase,
        json_escape(detail)
    )
}

fn spawn_trial(exe: &std::path::Path, view: ViewId, slot: &std::path::Path) -> Result<String, String> {
    let _ = std::fs::remove_file(slot);
    let started = Instant::now();
    let out = Command::new(exe)
        .args(["qwa_trial_child", "--exact", "--nocapture", "--test-threads=1"])
        .env(VIEW_VAR, view.as_str())
        .env(OUT_VAR, slot)
        .output()
        .map_err(|e| format!("spawn: {e}"))?;
    if started.elapsed() > CEIL_TRIAL {
        return Err(format!("exceeded the declared {} s trial ceiling", CEIL_TRIAL.as_secs()));
    }
    if !out.status.success() {
        let tail: String =
            String::from_utf8_lossy(&out.stderr).lines().rev().take(3).collect::<Vec<_>>().join(" / ");
        return Err(format!("child exited {:?}: {tail}", out.status.code()));
    }
    std::fs::read_to_string(slot).map_err(|e| format!("child wrote no result file: {e}"))
}

// ---- the driver -------------------------------------------------------------------------------

#[test]
#[ignore = "measurement pass; run explicitly with --release"]
fn the_query_window_attribution_pass() {
    refuse_debug("query_window_attribution");
    require_disk("query-window-attribution-setup");

    let out_dir = evidence_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }

    say!("hardware: {}", hardware_profile());
    say!("media: {}", media_type());

    // ---- §2: the fixture, reused and re-verified, never regenerated --------------------------
    let path = fixture_path();
    assert!(
        path.exists(),
        "fixture absent at {} — unmeasured, not regenerated (preregistration §2: this pass's \
         whole point is a same-file, same-session comparison, and a freshly generated file is not \
         guaranteed to be the same bytes)",
        path.display()
    );
    let (bytes, hash) = file_facts(&path);
    assert_ne!(hash, "unreadable", "fixture at {} could not be hashed", path.display());
    say!("fixture: {} bytes, sha256 {}", bytes, hash);

    // ---- the mechanism self-check, before the settle and before any measurement --------------
    //
    // The previous cut's attempt-1 lesson, applied here rather than re-learned: a harness that
    // cannot measure should cost seconds, not a night. **Probed on the gate viewport
    // (near-quarter), per preregistration §7** — not an arbitrary viewport, so a self-check that
    // passes says something about the cell whose numbers actually decide the outcome. This probe
    // also exercises the additivity check on a **live** trial, not just the unit tests committed
    // alongside the event implementation (`engine/src/trace.rs`'s
    // `the_spans_table_telescopes_by_construction` and `the_query_windows_events_telescope_exactly`
    // prove the table and the marks are internally consistent; this proves a real stream's marks
    // satisfy that arithmetic too).
    //
    // **Deliberately runs before §2's own row-count assertions, below.** §2 says those scans happen
    // "before any trial runs" — this probe is not an admitted trial (it is never pushed into
    // `trials`) and independently asserts the near-quarter row count itself, which is a sharper
    // fixture check than a bare count comparison. Ordered first anyway, on purpose: if the mechanism
    // cannot measure at all, that should cost one trial's worth of seconds, not three full-file
    // scans first.
    let exe = std::env::current_exe().expect("current exe");
    match spawn_trial(&exe, ViewId::NearQuarter, &out_dir.join("trial-slot.json")) {
        // Every clause pins down a distinct way the probe could lie: `"error":null` rules out both
        // a stream failure and (since `trial_error` never emits this key) an additivity failure;
        // `"dropped_records":0` rules out a trace that silently lost events; the exact row count
        // rules out a viewport that quietly selected the wrong rows.
        Ok(line)
            if line.contains("\"error\":null")
                && line.contains("\"dropped_records\":0")
                && line.contains(&format!("\"rows\":{}", ViewId::NearQuarter.predicted_rows())) =>
        {
            say!("mechanism check OK — a child trial round-trips, additivity holds, dropped_records is 0");
        }
        Ok(line) => panic!(
            "the trial mechanism produced something this driver cannot trust, and every cell would \
             have recorded `unmeasured` without saying why. Got: {line}"
        ),
        Err(e) => panic!("the trial mechanism does not work: {e}"),
    }

    // ---- the predicted row counts, asserted before any measurement (preregistration §2) -------
    // Covers `ViewId::Whole` too — a separate whole-file-only scan before this loop would assert
    // the identical fact (`predicted_rows(Whole) == FEATURES`) twice.
    let mut predicted_json = Vec::new();
    for v in VIEWPORTS {
        let ds = Dataset::open(&path).expect("open for viewport check");
        let q = match v.bbox(grid_cols()) {
            None => ViewportQuery::all(),
            Some(b) => ViewportQuery::viewport(b, ds.crs().identifier()),
        };
        let mut s = ds.stream(&q).expect("reference stream");
        let mut buf = Vec::new();
        let mut rows = 0u64;
        while let Some(i) = s.next_into(&mut buf) {
            rows += i.expect("reference batch").rows as u64;
            buf.clear();
        }
        assert_eq!(
            rows,
            v.predicted_rows(),
            "viewport {} selected {rows} rows, not the registered {}",
            v.as_str(),
            v.predicted_rows()
        );
        say!("viewport {} selects {} rows (matches registered prediction)", v.as_str(), rows);
        predicted_json.push(format!("{{\"view\":\"{}\",\"rows\":{}}}", v.as_str(), rows));
    }

    // ---- the opening settle, then the first canary ---------------------------------------------
    say!("settling {SETTLE_OPENING} s before the first canary");
    std::thread::sleep(Duration::from_secs(SETTLE_OPENING));
    let mut canaries = vec![Canary::take("setup-end")];

    // ---- the trial loop --------------------------------------------------------------------------
    say!("{} viewports; n = {N} each, all traced", VIEWPORTS.len());
    let mut trials: Vec<String> = Vec::new();
    for r in 0..N {
        std::thread::sleep(Duration::from_secs(SETTLE_CANARY));
        canaries.push(Canary::take(&format!("rep-{r}-start")));
        for i in interleaved(VIEWPORTS.len(), r) {
            let view = VIEWPORTS[i];
            match spawn_trial(&exe, view, &out_dir.join("trial-slot.json")) {
                Ok(line) => {
                    // Preregistration §4 and this file's own module doc: a trial whose additivity
                    // check failed is an instrument defect and **stops the harness** — it is never
                    // promoted into a cell's statistics by being merely recorded and continued past.
                    //
                    // **The trials and log gathered so far are flushed before the panic**, not left
                    // in console scrollback only — the attempt-1 lesson this file's module doc cites
                    // is exactly "a defect that costs a night because nothing survives to explain
                    // it". A partial artifact that stops mid-pass is diagnosable; a panic with no
                    // artifact at all is the failure mode this flush exists to avoid repeating.
                    if line.contains("\"error\":\"additivity") {
                        trials.push(format!("{{\"rep\":{r},\"trial\":{line}}}"));
                        log.push_str(&format!(
                            "STOPPED — trial {} rep {r} failed its additivity check: {line}\n",
                            view.as_str()
                        ));
                        let _ = std::fs::write(
                            out_dir.join("query-window-attribution-PARTIAL.json"),
                            format!("{{\"trials\":[{}]}}", trials.join(",")),
                        );
                        let _ = std::fs::write(out_dir.join("query-window-attribution.log"), &log);
                        panic!(
                            "trial {} rep {r} failed its additivity check — this is an instrument \
                             defect, not a data point, and the pass stops here rather than \
                             continuing with a corrupted cell. Partial trials and log flushed to {}. \
                             Got: {line}",
                            view.as_str(),
                            out_dir.display()
                        );
                    }
                    trials.push(format!("{{\"rep\":{r},\"trial\":{line}}}"));
                }
                Err(e) => {
                    say!("UNMEASURED — trial {} rep {r}: {e}", view.as_str());
                    trials.push(format!(
                        "{{\"rep\":{r},\"trial\":{{\"view\":\"{}\",\"error\":\"{}\"}}}}",
                        view.as_str(),
                        json_escape(&e)
                    ));
                }
            }
        }
    }
    std::thread::sleep(Duration::from_secs(SETTLE_CANARY));
    canaries.push(Canary::take("pass-end"));

    let spreads = phase_spreads(&canaries);
    for (label, spread, ok) in &spreads {
        say!("canary {label}: spread {:.1}% {}", spread * 100.0, if *ok { "OK" } else { "OVER" });
    }

    let artifact = format!(
        "{{\"preregistration\":\"kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md\",\
         \"scope\":\"lease_bind is reported, never scored — preregistration §8. Every trial in this \
         pass reuses a warm connection (Dataset::open primes the pool before any stream opens), so \
         lease_bind never contains a fresh connection-open/PRAGMA cost here — see reused_connection \
         on every trial.\",\
         \"hardware\":\"{}\",\"media\":\"{}\",\"fixture_bytes\":{},\"fixture_sha256\":\"{}\",\
         \"predicted_rows\":[{}],\
         \"canaries\":[{}],\"canary_spreads\":[{}],\"trials\":[{}]}}",
        json_escape(&hardware_profile()),
        json_escape(&media_type()),
        bytes,
        hash,
        predicted_json.join(","),
        canaries.iter().map(|c| c.json()).collect::<Vec<_>>().join(","),
        spreads
            .iter()
            .map(|(l, s, ok)| format!(
                "{{\"phase\":\"{}\",\"spread\":{s:.4},\"within\":{ok}}}",
                json_escape(l)
            ))
            .collect::<Vec<_>>()
            .join(","),
        trials.join(","),
    );
    std::fs::write(out_dir.join("query-window-attribution.json"), artifact).expect("write artifact");
    std::fs::write(out_dir.join("query-window-attribution.log"), log).expect("write log");
    println!("→ {}", out_dir.join("query-window-attribution.json").display());
}
