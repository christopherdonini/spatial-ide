// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

mod arrow_en;
mod markers;
mod p1;
mod p2;

use std::borrow::Cow;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use tauri::http::{header, Response, StatusCode};
use tauri::Manager;

// M0 (ADR-003 spike): report which native webview runtime is hosting the
// canvas. WebGL2/WebGPU capability itself is queried JS-side (only the JS
// context can see `navigator.gpu` / `WebGLRenderingContext`); this command
// supplies the one fact only the host process knows.
#[tauri::command]
fn webview_runtime_version() -> Result<String, String> {
    tauri::webview_version().map_err(|e| e.to_string())
}

// M1.5's diagnostic pass adds ~12 sequential sub-benchmarks (~2-4 minutes)
// on top of M0+M1, so it's opt-in via an OS env var read on the Rust side
// (RUN_M1_5=1 npm run tauri dev) rather than always running. A JS-side gate
// (e.g. a Vite env var) would need extra tsconfig/vite-env.d.ts plumbing
// this spike doesn't otherwise need; this is a one-line command instead.
#[tauri::command]
fn should_run_m1_5() -> bool {
    std::env::var("RUN_M1_5").map(|v| v == "1").unwrap_or(false)
}

// M2 is gated the same way, but runs *instead of* M1 rather than after it
// (see main.ts): the precision harness needs only the 125-point marker set,
// so making it wait on M1's 10M-point load and 20 s frame-time sweep would
// add ~25 s to every run for nothing.
#[tauri::command]
fn should_run_m2() -> bool {
    std::env::var("RUN_M2").map(|v| v == "1").unwrap_or(false)
}

#[tauri::command]
fn should_run_m3() -> bool {
    std::env::var("RUN_M3").map(|v| v == "1").unwrap_or(false)
}

// M4 differs from M2/M3's gating: those commands are read from JS after the
// window already exists, but P2 generation (below, in run()) has to happen
// *before* the window exists, so RUN_M4 is read directly via std::env::var
// there too. This command exists only so main.ts can decide precedence
// (M4 over M3/M2/M1) the same way it already does for the others.
#[tauri::command]
fn should_run_m4() -> bool {
    std::env::var("RUN_M4").map(|v| v == "1").unwrap_or(false)
}

/// M5 (data-plane audit) also needs P2 loaded, same reasoning as M4's own
/// direct env::var read in run() below -- so the RUN_M5 check there is
/// `run_m4 || run_m5`, not a separate dataset path.
#[tauri::command]
fn should_run_m5() -> bool {
    std::env::var("RUN_M5").map(|v| v == "1").unwrap_or(false)
}

/// Freeze forensics (not a milestone): dual heartbeat to localize which side
/// of the JS/Rust boundary stops first when the reproducible stall hits.
/// `rust-heartbeat.txt` is written by a plain OS thread (see run()) with no
/// dependency on the webview at all -- it proves the *process* is still
/// being scheduled. `js-heartbeat.txt` is written here, invoked fire-and-
/// forget from a JS setInterval -- it proves the JS event loop is still
/// ticking *and* the IPC round trip still completes. On the next freeze,
/// whichever file's timestamp stops moving first (or both, simultaneously)
/// tells us whether this is a JS-side stall (occlusion/throttling), an
/// IPC/Rust-side stall (e.g. a held Mutex), or a whole-process suspension.
/// Written to the OS temp dir, deliberately *not* the CWD (src-tauri):
/// `tauri dev`'s file watcher watches that whole tree for rebuild triggers,
/// and a 1 Hz write loop inside it would retrigger a rebuild-and-restart
/// every second -- a self-inflicted restart loop indistinguishable, from
/// the outside, from the very freeze this instrumentation exists to
/// diagnose. Found by hitting exactly that loop while first wiring this up.
fn heartbeat_path(filename: &str) -> std::path::PathBuf {
    std::env::temp_dir().join(filename)
}

fn write_heartbeat(filename: &str, seq: u64) {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    let _ = std::fs::write(heartbeat_path(filename), format!("seq={seq} ts_ms={now}\n"));
}

#[tauri::command]
fn js_heartbeat(seq: u64) {
    write_heartbeat("js-heartbeat.txt", seq);
}

/// Freeze forensics: a persistent, immediately-flushed BEGIN/END marker
/// around every potentially-blocking Rust-side operation (lock acquisition,
/// command bodies). Explicit flush matters because stdout is line-buffered
/// under a terminal but can be block-buffered when piped to a log file --
/// without it, a marker for an operation that then hangs might never
/// actually reach disk, defeating the whole "last BEGIN without its END
/// names the culprit" analysis. Rust's own heartbeat thread (above)
/// acquires no application locks, so it staying alive while a checkpoint's
/// BEGIN has no matching END points specifically at *that* lock/operation,
/// not at the process being generally wedged.
fn checkpoint(label: &str) {
    use std::io::Write;
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    println!("[CHECKPOINT] {now} {label}");
    let _ = std::io::stdout().flush();
}

#[tauri::command]
fn js_checkpoint(label: String) {
    checkpoint(&format!("JS:{label}"));
}

/// M3: GPU pick index -> exact source coordinate, resolved host-side in f64.
///
/// This is ADR-003's prescribed picking path. The index arrives from the GPU
/// picking buffer, where it is encoded as an integer RGB triple — no float is
/// involved in carrying it — and it is resolved against the f64 source values,
/// never against the f32 positions that were uploaded for rendering. The two
/// paths never meet, which is what lets the returned coordinate be bit-exact
/// while the rendered position is not.
///
/// f64 over Tauri's JSON IPC is control-plane (one small message per click,
/// not a data hot path — ADR-004), and serde_json emits the shortest form
/// that round-trips, so the value should arrive bit-identical. The client
/// verifies that bitwise rather than trusting it.
/// Frame-tagged on purpose. A bare `{e, n}` crossing this boundary is
/// indistinguishable from a renderer-local value, and the whole hazard M3
/// exists to expose is that local-frame numbers are shaped exactly like
/// coordinates. Naming the CRS on the wire makes a silent conversion into a
/// visible mismatch (docs/01: CRS is a type).
#[derive(serde::Serialize)]
struct PickedCoordinate {
    crs: &'static str,
    e: f64,
    n: f64,
}

/// Bit-pattern-encoded sibling of PickedCoordinate, for the M4/M5 commit
/// round trip specifically (see f64_to_hex_bits above) -- resolve_pick
/// keeps using plain PickedCoordinate: M3's own picking path was measured
/// reliably bit-exact across every run in that milestone, unlike M4's
/// commit path, so it isn't touched here.
// camelCase to match Tauri's own snake_case->camelCase convention for
// command *arguments* (see commit_vertex_edit's e_bits/n_bits params,
// called as eBits/nBits from JS) -- kept consistent on the return side too
// rather than making callers juggle two different casing rules depending
// on IPC direction.
#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct PickedCoordinateBits {
    crs: &'static str,
    e_bits: String,
    n_bits: String,
}

#[tauri::command]
fn resolve_pick(
    dataset: String,
    sep_mm: u32,
    axis: String,
    id: u64,
) -> Result<PickedCoordinate, String> {
    let (e, n) = markers::resolve_by_id(&dataset, sep_mm, &axis, id)?;
    Ok(PickedCoordinate {
        crs: "EPSG:2056",
        e,
        n,
    })
}

/// M5 item 4 (README ADR-004 amendment draft): a plain f64 command argument
/// was measured (M4 diagnostic notes) to not reliably survive the JS->Rust
/// Tauri IPC boundary bit-exact -- 3 of 9 runs showed a 1-ULP loss, negligible
/// in magnitude for M4's own screen-space budget but a genuine failure of
/// literal bit-identity. Scalars that need guaranteed binary identity (not
/// just "close enough") now cross as an explicit IEEE-754 bit pattern, a
/// fixed 16-hex-digit lowercase string, instead of a native JSON number --
/// string round-tripping is not subject to the same decimal<->float hazard.
fn f64_to_hex_bits(v: f64) -> String {
    format!("{:016x}", v.to_bits())
}

fn hex_bits_to_f64(hex: &str) -> Result<f64, String> {
    let bits = u64::from_str_radix(hex, 16).map_err(|e| format!("invalid bit-pattern hex {hex:?}: {e}"))?;
    Ok(f64::from_bits(bits))
}

/// M4's write path: commits an edited P2 vertex back into the source of
/// truth. `crs` is required and checked rather than assumed, the write-side
/// mirror of `resolve_pick`'s outbound tagging above -- a mislabeled frame
/// on a *write* corrupts ground truth, not just a click's reported
/// coordinate, so this rejects rather than trusts. `e_bits`/`n_bits`: see
/// f64_to_hex_bits above -- bit-pattern strings, not raw f64 args.
#[tauri::command]
fn commit_vertex_edit(
    state: tauri::State<'_, P2DatasetState>,
    id: u64,
    e_bits: String,
    n_bits: String,
    crs: String,
) -> Result<(), String> {
    if crs != "EPSG:2056" {
        return Err(format!("commit_vertex_edit: refusing untagged/mismatched crs {crs:?}"));
    }
    let e = hex_bits_to_f64(&e_bits)?;
    let n = hex_bits_to_f64(&n_bits)?;
    let dataset = state
        .0
        .as_ref()
        .ok_or("P2 not loaded -- RUN_M4 or RUN_M5 must be 1")?;
    checkpoint(&format!("LOCK_BEGIN commit_vertex_edit id={id}"));
    let mut d = dataset.lock().map_err(|_| "P2 dataset lock poisoned")?;
    checkpoint(&format!("LOCK_ACQUIRED commit_vertex_edit id={id}"));
    let result = d.commit_vertex(id, e, n);
    checkpoint(&format!("LOCK_END commit_vertex_edit id={id}"));
    result
}

/// Read-back half of the M3-style bit-exact commit round trip: resolves a
/// P2 vertex id to whatever is currently stored, independent of whatever
/// the client thinks it just sent. Returns bit-pattern strings, same reason
/// as commit_vertex_edit's e_bits/n_bits above -- this is the return-trip
/// half of the same IPC boundary, not yet separately measured as safe, so
/// it gets the same treatment rather than being assumed fine.
#[tauri::command]
fn resolve_p2_vertex(
    state: tauri::State<'_, P2DatasetState>,
    id: u64,
) -> Result<PickedCoordinateBits, String> {
    let dataset = state
        .0
        .as_ref()
        .ok_or("P2 not loaded -- RUN_M4 or RUN_M5 must be 1")?;
    checkpoint(&format!("LOCK_BEGIN resolve_p2_vertex id={id}"));
    let d = dataset.lock().map_err(|_| "P2 dataset lock poisoned")?;
    checkpoint(&format!("LOCK_ACQUIRED resolve_p2_vertex id={id}"));
    let (e, n) = d.resolve_vertex(id)?;
    checkpoint(&format!("LOCK_END resolve_p2_vertex id={id}"));
    Ok(PickedCoordinateBits {
        crs: "EPSG:2056",
        e_bits: f64_to_hex_bits(e),
        n_bits: f64_to_hex_bits(n),
    })
}

/// M5 item 4's bulk property-test command: decodes each hex bit-pattern to
/// f64 and re-encodes it, round-tripping through the *real* Tauri IPC
/// boundary in both directions (Vec<String> args in, Vec<String> return
/// out) at whatever batch size the caller chooses. The decode/re-encode
/// step is redundant by construction (a string that survives IPC intact and
/// parses as valid hex will always re-encode to itself) -- its value is
/// exercising the exact code path commit_vertex_edit/resolve_p2_vertex use,
/// at volume, not adding independent logic to trust.
#[tauri::command]
fn verify_bit_roundtrip(patterns: Vec<String>) -> Result<Vec<String>, String> {
    patterns
        .iter()
        .map(|hex| hex_bits_to_f64(hex).map(f64_to_hex_bits))
        .collect()
}

/// M5 item 4: property-tests the hex<->f64 encoding scheme itself (fast,
/// in-process, no IPC) -- the *actual* bug this scheme fixes was in the
/// Tauri IPC transport for raw f64 args, not in any encoding logic, so
/// these tests can't reproduce the original failure by themselves. What
/// they establish is that the encoding is lossless for every value class
/// that matters, so nothing here needlessly widens the value space M5's
/// live-IPC verification (src/m5-dataplane.ts, verify_bit_roundtrip above)
/// has to cover. That live-IPC test is the one that re-exercises the actual
/// boundary where the original bug lived.
#[cfg(test)]
mod bit_encoding_tests {
    use super::*;
    use rand::Rng;

    fn roundtrip_ok(bits: u64) -> bool {
        let hex = format!("{:016x}", bits);
        let decoded = hex_bits_to_f64(&hex).expect("valid 16-hex-digit string must decode");
        decoded.to_bits() == bits
    }

    #[test]
    fn special_values_roundtrip() {
        let specials: [u64; 9] = [
            0x0000000000000000, // +0
            0x8000000000000000, // -0
            0x7FF0000000000000, // +inf
            0xFFF0000000000000, // -inf
            0x7FF8000000000000, // canonical quiet NaN
            0xFFF8000000000000, // negative canonical NaN
            0x7FF0000000000001, // NaN, minimal nonzero payload (signalling-style)
            0x0000000000000001, // smallest positive subnormal
            0x000FFFFFFFFFFFFF, // largest subnormal
        ];
        for bits in specials {
            assert!(roundtrip_ok(bits), "bit pattern {bits:016x} failed to round-trip");
        }
    }

    #[test]
    fn previously_observed_failing_values_roundtrip() {
        // The three 1-ULP mismatches actually captured during the M4 IPC
        // investigation (README, "Precision & write-path correctness" row)
        // -- named regression cases, not synthetic ones. First pair is the
        // exact hex the bit-pattern instrumentation logged; the other two
        // are the decimal values from the two earlier flaky runs, reparsed
        // (Rust float-literal parsing is correctly-rounded, same guarantee
        // JSON.stringify's shortest-round-trip output relies on).
        let observed: [u64; 6] = [
            0x41444a815dce737b_u64,
            0x41444a815dce737a_u64,
            2659586.7328628874_f64.to_bits(),
            2659586.732862887_f64.to_bits(),
            1185592.4587547975_f64.to_bits(),
            1185592.4587547977_f64.to_bits(),
        ];
        for bits in observed {
            assert!(roundtrip_ok(bits), "bit pattern {bits:016x} failed to round-trip");
        }
    }

    #[test]
    fn random_bits_roundtrip_100k() {
        let mut rng = rand::thread_rng();
        for _ in 0..100_000 {
            let bits: u64 = rng.gen();
            assert!(roundtrip_ok(bits), "bit pattern {bits:016x} failed to round-trip");
        }
    }
}

/// Report JSON files must not live in `src-tauri` during `tauri dev`, same
/// reason as `heartbeat_path` above (found there first: writing 1 Hz
/// heartbeat files to the CWD self-inflicted a rebuild-restart loop, since
/// `tauri dev`'s file watcher monitors that whole tree). Discovered
/// affecting *this* function's siblings the same way while building M5:
/// `log_m5_report`'s own write into CWD retriggered a rebuild before the
/// harness's own process even exited, which reran the whole (~30s,
/// 100k-plus-IPC-call) M5 harness from scratch 2-3 times per invocation
/// before a kill command landed -- silently duplicating work and, worse,
/// silently producing multiple report files layered over each other with
/// no signal anything had happened. Every log_m*_report below now writes
/// here instead of the CWD; on M0-M4, this fixes a live but previously
/// unnoticed version of the same bug (their reports likely also
/// double-wrote or masked the rebuild's own restart, just fast enough that
/// nobody was watching for it before M5's longer runtime made it visible).
fn report_path(filename: &str) -> std::path::PathBuf {
    std::env::temp_dir().join(filename)
}

// Sink for the M0 report assembled in JS: prints to the `tauri dev` stdout
// and writes a JSON file (see report_path above) so results survive window
// close, for transcription into the README results table.
#[tauri::command]
fn log_m0_report(report_json: String) {
    println!("[M0 GPU REPORT] {}", report_json);
    if let Err(e) = std::fs::write(report_path("m0-report.json"), &report_json) {
        eprintln!("[M0 GPU REPORT] failed to write m0-report.json: {}", e);
    }
}

// Same pattern for M1's self-driven pan/zoom benchmark: this is a small
// results payload, not point data, so JSON over invoke is fine here — only
// the P1 point stream itself is required to avoid JSON (ADR-004).
#[tauri::command]
fn log_m1_report(report_json: String) {
    println!("[M1 BENCHMARK REPORT] {}", report_json);
    if let Err(e) = std::fs::write(report_path("m1-report.json"), &report_json) {
        eprintln!("[M1 BENCHMARK REPORT] failed to write m1-report.json: {}", e);
    }
}

// M1.5 diagnostic results sink, same JSON-is-fine-for-control-messages
// reasoning as log_m1_report.
#[tauri::command]
fn log_m1_5_report(report_json: String) {
    println!("[M1.5 DIAGNOSTIC REPORT] {}", report_json);
    if let Err(e) = std::fs::write(report_path("m1_5-report.json"), &report_json) {
        eprintln!("[M1.5 DIAGNOSTIC REPORT] failed to write m1_5-report.json: {}", e);
    }
}

// Same reasoning as log_m1_report: a small results payload, not point data,
// so JSON over invoke is fine here — only the P1/marker streams themselves
// are required to avoid JSON (ADR-004).
#[tauri::command]
fn log_m2_report(report_json: String) {
    println!("[M2 PRECISION REPORT] {}", report_json);
    if let Err(e) = std::fs::write(report_path("m2-report.json"), &report_json) {
        eprintln!("[M2 PRECISION REPORT] failed to write m2-report.json: {}", e);
    }
}

#[tauri::command]
fn log_m3_report(report_json: String) {
    println!("[M3 PICKING REPORT] {}", report_json);
    if let Err(e) = std::fs::write(report_path("m3-report.json"), &report_json) {
        eprintln!("[M3 PICKING REPORT] failed to write m3-report.json: {}", e);
    }
}

#[tauri::command]
fn log_m4_report(report_json: String) {
    println!("[M4 EDITING REPORT] {}", report_json);
    if let Err(e) = std::fs::write(report_path("m4-report.json"), &report_json) {
        eprintln!("[M4 EDITING REPORT] failed to write m4-report.json: {}", e);
    }
}

#[tauri::command]
fn log_m5_report(report_json: String) {
    println!("[M5 DATAPLANE REPORT] {}", report_json);
    if let Err(e) = std::fs::write(report_path("m5-report.json"), &report_json) {
        eprintln!("[M5 DATAPLANE REPORT] failed to write m5-report.json: {}", e);
    }
}

/// P1's pre-serialized Arrow IPC bytes for the default (no query params)
/// protocol response, generated once at startup and intentionally leaked to
/// `'static`: the dataset lives for the app's whole process lifetime
/// anyway, so leaking avoids an extra clone on every protocol request (see
/// p1.rs for the rest of the copy-chain accounting). Kept byte-for-byte
/// identical to what M1 measured against — M1.5's parameterized queries
/// (below) are additive and never touch this path.
struct P1Bytes(&'static [u8]);

/// M1.5 diagnostics: the same fixed-seed point set, kept around unserialized
/// so `?n=`/`?bbox=`/`?chunk=` requests can slice it on demand instead of
/// re-drawing random numbers (comparable runs) or re-leaking memory per
/// request (this is `Arc`-shared, not leaked — diagnostic requests are rare
/// and one-off, unlike M1's own hot default path).
struct P1DatasetState(Arc<p1::P1Dataset>);

/// M4's P2 dataset, gated behind RUN_M4=1 unlike P1's unconditional
/// generation (see run() below) -- `None` when M4 isn't the milestone in
/// play this run, so the ~1-2s generation and ~160MB (10M vertices * 8
/// bytes * 2) it costs is paid only when actually needed. `Mutex`, not a
/// bare `Arc` like P1DatasetState, because M4 has a write path
/// (commit_vertex_edit) that P1/M2/M3's read-only sharing never needed.
struct P2DatasetState(Option<Arc<p2::SharedP2Dataset>>);

fn parse_query(query: Option<&str>) -> HashMap<&str, &str> {
    query
        .unwrap_or("")
        .split('&')
        .filter_map(|pair| pair.split_once('='))
        .collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Runs before the window/webview exist — this blocks first paint of
    // even the HUD by however long P1 generation + IPC serialization takes.
    // Acceptable for a spike measuring steady-state render/pan-zoom cost,
    // not first-launch latency, but do not carry this pattern into
    // kernel/engine startup (docs/01: never block the canvas). The M1
    // "time to first pixels" numbers in the README are measured from query
    // start (the P1 fetch), per docs/08 — real cold-launch-to-pixels time
    // is this startup delay *plus* that, and isn't what's reported there.
    let dataset = Arc::new(p1::P1Dataset::generate());

    // Vec::leak (not .into_boxed_slice()+Box::leak): the writer buffer in
    // full_arrow_ipc grows via push/write and so has spare capacity by the
    // time it's done; into_boxed_slice() would reallocate+copy the whole
    // ~162MB buffer to shrink it. leak() keeps the original allocation (any
    // unused capacity is leaked too, not copied).
    let p1_bytes: &'static [u8] = dataset.full_arrow_ipc().leak();
    println!(
        "[M1] P1 generated: {} points, {} bytes Arrow IPC",
        p1::POINT_COUNT,
        p1_bytes.len()
    );

    // Unlike P1 above, P2 generation is gated behind RUN_M4=1 read directly
    // here (the window doesn't exist yet, so there's no JS round trip to
    // wait on) rather than unconditional: it costs ~1-2s and ~160MB (10M
    // vertices * 8 bytes * 2) that most runs (M0-M3) have no use for. M5
    // needs it too (item 4 exercises the real commit_vertex_edit/
    // resolve_p2_vertex commands at volume), hence run_m4 || run_m5.
    let run_m4 = std::env::var("RUN_M4").map(|v| v == "1").unwrap_or(false);
    let run_m5 = std::env::var("RUN_M5").map(|v| v == "1").unwrap_or(false);
    let need_p2 = run_m4 || run_m5;

    // Freeze forensics (README diagnostic note): a plain OS thread, no
    // Tauri/webview APIs at all, so this keeps ticking as long as the OS is
    // scheduling this process's threads -- independent of whatever the
    // webview/JS side is doing. Gated behind RUN_M4/RUN_M5 for the same
    // reason the JS heartbeat is (see main.ts): an unconditional periodic
    // mechanism would run during any future M0-M3 rerun that never had this
    // instrumentation present when its committed numbers were measured. M5
    // included since its own longer runtime (property-test batches) is
    // exactly the kind of run freeze forensics would matter for -- same
    // condition as need_p2 below, kept as its own explicit check since the
    // two gates mean different things even though they currently agree.
    if run_m4 || run_m5 {
        std::thread::spawn(|| {
            let mut seq = 0u64;
            loop {
                write_heartbeat("rust-heartbeat.txt", seq);
                seq += 1;
                std::thread::sleep(std::time::Duration::from_secs(1));
            }
        });
    }

    let p2_dataset: Option<Arc<p2::SharedP2Dataset>> = if need_p2 {
        let d = p2::P2Dataset::generate();
        println!(
            "[M4] P2 generated: {} polygons, {} vertices",
            p2::POLYGON_COUNT,
            p2::VERTEX_COUNT
        );
        Some(Arc::new(Mutex::new(d)))
    } else {
        None
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(P1Bytes(p1_bytes))
        .manage(P1DatasetState(dataset))
        .manage(P2DatasetState(p2_dataset))
        .invoke_handler(tauri::generate_handler![
            webview_runtime_version,
            should_run_m1_5,
            should_run_m2,
            should_run_m3,
            should_run_m4,
            should_run_m5,
            js_heartbeat,
            js_checkpoint,
            resolve_pick,
            commit_vertex_edit,
            resolve_p2_vertex,
            verify_bit_roundtrip,
            log_m0_report,
            log_m1_report,
            log_m1_5_report,
            log_m2_report,
            log_m3_report,
            log_m4_report,
            log_m5_report
        ])
        // Serves the P1 point cloud as raw Arrow IPC bytes — no JSON, no
        // invoke/serde round trip (ADR-004).
        //
        // Default (no query params): M1's original single-shot, unchunked
        // whole-buffer response, unchanged. Real chunking/backpressure over
        // the wire is still M5's job (docs/02, docs/06; ADR-004 honesty
        // check) — this is spike-local scaffolding for M1.5's diagnostics,
        // not a proposed SKP wire shape:
        //   ?n=<count>          M1.5 scaling curve — prefix of the same
        //                       fixed dataset (no new RNG draw).
        //   ?bbox=eMin,nMin,eMax,nMax   M1.5 visible-count diagnostic — a
        //                       crude unindexed linear scan (p1.rs), so its
        //                       own cost confounds the render-cost result.
        //   ?chunk=<i>&chunkSize=<c>    M1.5 streaming diagnostic — N
        //                       separate self-contained Arrow IPC messages
        //                       (each with its own schema message, unlike
        //                       real IPC streaming's schema-once framing),
        //                       simulating chunked delivery via repeated
        //                       requests. This API (register_uri_scheme_
        //                       protocol, tauri 2.11.5) has no lower-level
        //                       streamed-body option, hence the simulation.
        .register_uri_scheme_protocol("p1", |ctx, request| {
            let params = parse_query(request.uri().query());
            let (status, body): (StatusCode, Cow<'static, [u8]>) = if request.uri().path()
                == "/markers"
            {
                // M2 precision probes and M3 pick datasets — same Arrow IPC
                // framing as P1, just tiny datasets. `?set=` selects which;
                // absent means the original 125-point M2 grid.
                let set = params.get("set").copied().unwrap_or("markers");
                // An unparseable sepMm must not silently become 100 — the
                // separation *is* the independent variable of the class (c)
                // sweep, so a quietly substituted value would relabel every
                // row of it.
                let sep_mm: Option<u32> = match params.get("sepMm") {
                    Some(s) => s.parse().ok(),
                    None => Some(100),
                };
                let axis = params.get("axis").copied().unwrap_or("e");
                let shuffle = params.get("shuffle").copied() == Some("1");
                match sep_mm.and_then(|mm| markers::dataset(set, mm, axis, shuffle)) {
                    // Every marker-family payload now carries an explicit id
                    // column; M2's loader reads e/n by name and is unaffected.
                    Some((e, n, ids)) => (
                        StatusCode::OK,
                        Cow::Owned(arrow_en::serialize_en_id(&e, &n, &ids)),
                    ),
                    None => (StatusCode::BAD_REQUEST, Cow::Owned(Vec::new())),
                }
            } else if request.uri().path() == "/p2" {
                // M4: the parcel-polygon vertex set, same Arrow IPC framing
                // (e/n/id) as /markers. Checked by path, like /markers, and
                // ahead of the generic ?bbox= handling below so a /p2 bbox
                // request can't accidentally fall through to P1's bbox
                // filter (different dataset, different state).
                //   (no params)        full 10,000,000-vertex dataset.
                //   ?bbox=eMin,nMin,eMax,nMax   whole polygons whose
                //                       centroid falls in the box
                //                       (p2.rs::arrow_ipc_bbox) — M4's
                //                       viewport-culled visible subset.
                match ctx.app_handle().state::<P2DatasetState>().0.as_ref() {
                    None => (StatusCode::SERVICE_UNAVAILABLE, Cow::Owned(Vec::new())),
                    // A poisoned lock returns 500 rather than panicking the
                    // protocol handler thread, consistent with how
                    // commit_vertex_edit/resolve_p2_vertex handle the
                    // identical failure a few dozen lines above.
                    Some(shared) => {
                        checkpoint(&format!("LOCK_BEGIN /p2 bbox={:?}", params.get("bbox")));
                        let result = match shared.lock() {
                            Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, Cow::Owned(Vec::new())),
                            Ok(dataset) => {
                                checkpoint(&format!("LOCK_ACQUIRED /p2 bbox={:?}", params.get("bbox")));
                                match params.get("bbox") {
                                    Some(bbox_str) => {
                                        let parts: Vec<f64> =
                                            bbox_str.split(',').filter_map(|s| s.parse().ok()).collect();
                                        match parts[..] {
                                            [e_min, n_min, e_max, n_max] => (
                                                StatusCode::OK,
                                                Cow::Owned(dataset.arrow_ipc_bbox(e_min, n_min, e_max, n_max)),
                                            ),
                                            _ => (StatusCode::BAD_REQUEST, Cow::Owned(Vec::new())),
                                        }
                                    }
                                    None => (StatusCode::OK, Cow::Owned(dataset.full_arrow_ipc())),
                                }
                            }
                        };
                        checkpoint(&format!("LOCK_END /p2 bbox={:?}", params.get("bbox")));
                        result
                    }
                }
            } else if let Some(chunk_str) = params.get("chunk") {
                let chunk: usize = chunk_str.parse().unwrap_or(0);
                let chunk_size: usize = params
                    .get("chunkSize")
                    .and_then(|s| s.parse().ok())
                    .unwrap_or(256_000);
                let dataset = ctx.app_handle().state::<P1DatasetState>().0.clone();
                // Dev-only diagnostic param, hand-typed URLs only, but a
                // stray huge value shouldn't panic the protocol handler —
                // saturate instead of overflowing (arrow_ipc_range clamps
                // to dataset length anyway, so saturating to usize::MAX
                // still produces a well-formed, just empty/tiny response).
                let start = chunk.saturating_mul(chunk_size);
                let end = (chunk.saturating_add(1)).saturating_mul(chunk_size);
                (StatusCode::OK, Cow::Owned(dataset.arrow_ipc_range(start, end)))
            } else if let Some(bbox_str) = params.get("bbox") {
                let parts: Vec<f64> = bbox_str.split(',').filter_map(|s| s.parse().ok()).collect();
                let dataset = ctx.app_handle().state::<P1DatasetState>().0.clone();
                match parts[..] {
                    [e_min, n_min, e_max, n_max] => (
                        StatusCode::OK,
                        Cow::Owned(dataset.arrow_ipc_bbox(e_min, n_min, e_max, n_max)),
                    ),
                    _ => (StatusCode::BAD_REQUEST, Cow::Owned(Vec::new())),
                }
            } else if let Some(n_str) = params.get("n") {
                let n: usize = n_str.parse().unwrap_or(p1::POINT_COUNT);
                let dataset = ctx.app_handle().state::<P1DatasetState>().0.clone();
                (StatusCode::OK, Cow::Owned(dataset.arrow_ipc_range(0, n)))
            } else {
                (StatusCode::OK, Cow::Borrowed(ctx.app_handle().state::<P1Bytes>().0))
            };
            let origin = request
                .headers()
                .get(header::ORIGIN)
                .and_then(|v| v.to_str().ok())
                .unwrap_or("*");
            Response::builder()
                .status(status)
                .header(header::CONTENT_TYPE, "application/vnd.apache.arrow.stream")
                .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, origin)
                .body(body)
                .expect("building the P1 response must not fail")
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
