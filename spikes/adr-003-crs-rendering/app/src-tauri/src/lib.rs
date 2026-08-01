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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            webview_runtime_version,
            log_m0_report
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
