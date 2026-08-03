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

/// M4's write path: commits an edited P2 vertex back into the source of
/// truth. `crs` is required and checked rather than assumed, the write-side
/// mirror of `resolve_pick`'s outbound tagging above -- a mislabeled frame
/// on a *write* corrupts ground truth, not just a click's reported
/// coordinate, so this rejects rather than trusts.
#[tauri::command]
fn commit_vertex_edit(
    state: tauri::State<'_, P2DatasetState>,
    id: u64,
    e: f64,
    n: f64,
    crs: String,
) -> Result<(), String> {
    if crs != "EPSG:2056" {
        return Err(format!("commit_vertex_edit: refusing untagged/mismatched crs {crs:?}"));
    }
    let dataset = state
        .0
        .as_ref()
        .ok_or("P2 not loaded -- RUN_M4 must be 1")?;
    let mut d = dataset.lock().map_err(|_| "P2 dataset lock poisoned")?;
    d.commit_vertex(id, e, n)
}

/// Read-back half of the M3-style bit-exact commit round trip: resolves a
/// P2 vertex id to whatever is currently stored, independent of whatever
/// the client thinks it just sent.
#[tauri::command]
fn resolve_p2_vertex(
    state: tauri::State<'_, P2DatasetState>,
    id: u64,
) -> Result<PickedCoordinate, String> {
    let dataset = state
        .0
        .as_ref()
        .ok_or("P2 not loaded -- RUN_M4 must be 1")?;
    let d = dataset.lock().map_err(|_| "P2 dataset lock poisoned")?;
    let (e, n) = d.resolve_vertex(id)?;
    Ok(PickedCoordinate {
        crs: "EPSG:2056",
        e,
        n,
    })
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

// M1.5 diagnostic results sink, same JSON-is-fine-for-control-messages
// reasoning as log_m1_report.
#[tauri::command]
fn log_m1_5_report(report_json: String) {
    println!("[M1.5 DIAGNOSTIC REPORT] {}", report_json);
    if let Err(e) = std::fs::write("m1_5-report.json", &report_json) {
        eprintln!("[M1.5 DIAGNOSTIC REPORT] failed to write m1_5-report.json: {}", e);
    }
}

// Same reasoning as log_m1_report: a small results payload, not point data,
// so JSON over invoke is fine here — only the P1/marker streams themselves
// are required to avoid JSON (ADR-004).
#[tauri::command]
fn log_m2_report(report_json: String) {
    println!("[M2 PRECISION REPORT] {}", report_json);
    if let Err(e) = std::fs::write("m2-report.json", &report_json) {
        eprintln!("[M2 PRECISION REPORT] failed to write m2-report.json: {}", e);
    }
}

#[tauri::command]
fn log_m3_report(report_json: String) {
    println!("[M3 PICKING REPORT] {}", report_json);
    if let Err(e) = std::fs::write("m3-report.json", &report_json) {
        eprintln!("[M3 PICKING REPORT] failed to write m3-report.json: {}", e);
    }
}

#[tauri::command]
fn log_m4_report(report_json: String) {
    println!("[M4 EDITING REPORT] {}", report_json);
    if let Err(e) = std::fs::write("m4-report.json", &report_json) {
        eprintln!("[M4 EDITING REPORT] failed to write m4-report.json: {}", e);
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
    // vertices * 8 bytes * 2) that most runs (M0-M3) have no use for.
    let run_m4 = std::env::var("RUN_M4").map(|v| v == "1").unwrap_or(false);
    let p2_dataset: Option<Arc<p2::SharedP2Dataset>> = if run_m4 {
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
            resolve_pick,
            commit_vertex_edit,
            resolve_p2_vertex,
            log_m0_report,
            log_m1_report,
            log_m1_5_report,
            log_m2_report,
            log_m3_report,
            log_m4_report
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
                    Some(shared) => match shared.lock() {
                        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, Cow::Owned(Vec::new())),
                        Ok(dataset) => match params.get("bbox") {
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
