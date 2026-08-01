mod p1;

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

// Sink for the M0 report assembled in JS: prints to the `tauri dev` stdout
// and writes a JSON file next to src-tauri so results survive window close,
// for transcription into the README results table.
#[tauri::command]
fn log_m0_report(report_json: String) {
    println!("[M0 GPU REPORT] {}", report_json);
    if let Err(e) = std::fs::write("m0-report.json", &report_json) {
        eprintln!("[M0 GPU REPORT] failed to write m0-report.json: {}", e);
    }
}

// Same pattern for M1's self-driven pan/zoom benchmark: this is a small
// results payload, not point data, so JSON over invoke is fine here — only
// the P1 point stream itself is required to avoid JSON (ADR-004).
#[tauri::command]
fn log_m1_report(report_json: String) {
    println!("[M1 BENCHMARK REPORT] {}", report_json);
    if let Err(e) = std::fs::write("m1-report.json", &report_json) {
        eprintln!("[M1 BENCHMARK REPORT] failed to write m1-report.json: {}", e);
    }
}

/// P1's pre-serialized Arrow IPC bytes, generated once at startup and
/// intentionally leaked to `'static`: the dataset lives for the app's whole
/// process lifetime anyway, so leaking avoids an extra clone on every
/// protocol request (see p1.rs for the rest of the copy-chain accounting).
struct P1Bytes(&'static [u8]);

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
    //
    // Vec::leak (not .into_boxed_slice()+Box::leak): the writer buffer in
    // generate_p1_arrow_ipc grows via push/write and so has spare capacity
    // by the time it's done; into_boxed_slice() would reallocate+copy the
    // whole ~162MB buffer to shrink it. leak() keeps the original
    // allocation (any unused capacity is leaked too, not copied).
    let p1_bytes: &'static [u8] = p1::generate_p1_arrow_ipc().leak();
    println!(
        "[M1] P1 generated: {} points, {} bytes Arrow IPC",
        p1::POINT_COUNT,
        p1_bytes.len()
    );

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(P1Bytes(p1_bytes))
        .invoke_handler(tauri::generate_handler![
            webview_runtime_version,
            log_m0_report,
            log_m1_report
        ])
        // Serves the P1 point cloud as raw Arrow IPC bytes — no JSON, no
        // invoke/serde round trip (ADR-004). Single-shot, unchunked: the
        // whole buffer is one response body. That's a deliberate M1
        // simplification (see p1.rs doc comment); real chunking and
        // cancellation land in M5's data-plane audit.
        .register_uri_scheme_protocol("p1", |ctx, request| {
            let bytes = ctx.app_handle().state::<P1Bytes>().0;
            let origin = request
                .headers()
                .get(header::ORIGIN)
                .and_then(|v| v.to_str().ok())
                .unwrap_or("*");
            Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, "application/vnd.apache.arrow.stream")
                .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, origin)
                .body(bytes)
                .expect("building the P1 response must not fail")
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
