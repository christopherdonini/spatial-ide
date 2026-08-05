//! H6 — no transport detail leaks into the neutral interface.
//!
//! ADR-004 is "one semantic API, multiple optimized **bindings**"; ADR-012 says the swap between
//! adapters is "asserted mechanically … not claimed in prose". The whole legitimacy of calling this
//! slice's adapter *provisional* rests on it being cheap to replace, so the check is a test rather
//! than a convention.

use std::path::Path;

/// The vocabulary the transport-neutral interface may not contain, from the bake-off
/// preregistration's §5 list.
const FORBIDDEN: &[&str] = &[
    // Single tokens, because the scan compares *identifier components*: a two-word entry like
    // "close code" could never match one and would sit here looking like coverage.
    "socket", "websocket", "http", "url", "header", "fetch", "port", "close", "opcode", "tcp",
    "axum", "tungstenite",
    // **Connection-lifecycle vocabulary, added with pre-warmed connections.** A *connection* is a
    // transport concept: the neutral interface knows operations, streams, batches, cancellation,
    // progress, terminal errors and demand — and nothing about how many sockets carry them or how
    // long one is held open. Without these entries the pre-warming work could have leaked the
    // concept upward and the mechanical "swapping the adapter changes one construction site" claim
    // would have decayed silently, which is the whole reason this scan exists.
    "connection", "connect", "prewarm", "warm", "reconnect", "spare", "idle", "pool", "keepalive",
];

/// Words that name what the interface *is* allowed to talk about, asserted so the scan cannot pass
/// by the file having become empty or having been renamed out from under it.
const REQUIRED: &[&str] = &["operation", "stream", "batch", "cancel", "progress", "terminal", "credit"];

/// Identifiers that decompose into a forbidden word but belong to **Rust**, not to a transport.
/// Listed rather than pattern-matched away, so adding one is a visible decision.
const LANGUAGE_IDENTIFIERS: &[&str] =
    &["fetch_add", "fetch_sub", "fetch_max", "fetch_min", "fetch_update", "fetch_or", "fetch_and"];

/// Split an identifier into lowercase components on underscores and camelCase boundaries.
///
/// Component-wise rather than substring: a substring scan reports `port` inside `transport` and
/// `fetch` inside `fetch_add`, and a check that cries wolf gets deleted.
fn components(identifier: &str) -> Vec<String> {
    let mut out = Vec::new();
    for part in identifier.split('_') {
        let mut cur = String::new();
        for ch in part.chars() {
            if ch.is_uppercase() && !cur.is_empty() {
                out.push(std::mem::take(&mut cur));
            }
            cur.push(ch.to_ascii_lowercase());
        }
        if !cur.is_empty() {
            out.push(cur);
        }
    }
    out
}

fn neutral_interface() -> String {
    let p = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/transport.rs");
    std::fs::read_to_string(&p).unwrap_or_else(|e| panic!("{}: {e}", p.display()))
}

#[test]
fn the_neutral_interface_names_no_transport() {
    let src = neutral_interface();

    // The module's own doc comment quotes the forbidden list in order to forbid it, so the scan
    // runs over code only — comments are excluded, deliberately and visibly.
    let code = src
        .lines()
        .filter(|l| {
            let t = l.trim_start();
            !t.starts_with("//") && !t.starts_with("*") && !t.starts_with("/*")
        })
        .collect::<Vec<_>>()
        .join("\n");

    for identifier in code.split(|c: char| !(c.is_alphanumeric() || c == '_')) {
        if identifier.is_empty() || LANGUAGE_IDENTIFIERS.contains(&identifier) {
            continue;
        }
        for part in components(identifier) {
            assert!(
                !FORBIDDEN.contains(&part.as_str()),
                "`{part}` appears in the transport-neutral interface (in `{identifier}`); a binding \
                 detail has leaked into the interface ADR-004 keeps binding-independent"
            );
        }
    }
}

#[test]
fn the_scan_is_not_vacuous() {
    // A check that cannot fail is not a check. These are the shapes a real leak would take.
    assert!(components("WebSocket").contains(&"websocket".to_string()) || components("WebSocket").contains(&"socket".to_string()));
    assert!(components("close_code").contains(&"close".to_string()));
    assert!(components("http_status").contains(&"http".to_string()));
    assert!(components("listen_port").contains(&"port".to_string()));
    // …and these are the false positives it must not report.
    assert!(!components("transport").contains(&"port".to_string()));
    assert!(LANGUAGE_IDENTIFIERS.contains(&"fetch_add"));
}

#[test]
fn the_neutral_interface_still_covers_its_declared_vocabulary() {
    let src = neutral_interface().to_ascii_lowercase();
    for word in REQUIRED {
        assert!(src.contains(word), "the interface no longer mentions `{word}`");
    }
}

#[test]
fn only_one_construction_site_names_the_adapter() {
    // "Swapping candidates changes exactly one construction site" (ADR-012). Asserted by counting:
    // the adapter module is referenced from `server.rs` and from `lib.rs`'s module declaration, and
    // nowhere else.
    let dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("src");
    let mut referencing = Vec::new();
    for entry in std::fs::read_dir(&dir).expect("src dir") {
        let path = entry.expect("dir entry").path();
        if path.extension().and_then(|e| e.to_str()) != Some("rs") {
            continue;
        }
        let name = path.file_name().unwrap().to_string_lossy().to_string();
        if name == "adapter_ws.rs" {
            continue;
        }
        let body = std::fs::read_to_string(&path).expect("read");
        let code: String = body
            .lines()
            .filter(|l| !l.trim_start().starts_with("//"))
            .collect::<Vec<_>>()
            .join("\n");
        if code.contains("adapter_ws") {
            referencing.push(name);
        }
    }
    referencing.sort();
    assert_eq!(
        referencing,
        vec!["lib.rs".to_string(), "server.rs".to_string()],
        "the adapter is referenced from more than its module declaration and its construction site"
    );
}
