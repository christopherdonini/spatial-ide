// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Tauri-managed state: the running data plane's connection facts, and the session log sink
//! ADR-010 rule 7 requires ("global error/unhandledrejection handlers... visible and persisted").

use std::io::Write;
use std::sync::Mutex;

/// What `binding_data_plane_attach` (a **binding-local, non-SKP** command — SKP-V0.md §3, ADR-019)
/// hands the shell's WebSocket client: the endpoint and the credential, delivered over the control
/// plane rather than ever appearing in a served document or a log (ADR-012's threat model).
pub struct DataPlaneHandle {
    pub port: u16,
    pub token: String,
}

/// A single append-only file, flushed on every write. **Instrument surface — never an SKP field or
/// command** (ADR-004 Amendment 4): this sink exists so a global `error`/`unhandledrejection`
/// handler's output outlives the session, not so the wire can carry anything through it.
///
/// The session token is never written here: this type only ever receives the shell's own log
/// lines, never the data-plane handle above.
pub struct SessionLog {
    file: Mutex<std::fs::File>,
    pub path: std::path::PathBuf,
}

impl SessionLog {
    pub fn open(dir: &std::path::Path) -> std::io::Result<Self> {
        std::fs::create_dir_all(dir)?;
        let stamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0);
        let path = dir.join(format!("session-{stamp}.log"));
        let file = std::fs::OpenOptions::new().create(true).append(true).open(&path)?;
        Ok(Self { file: Mutex::new(file), path })
    }

    /// Append one line: `<unix-ms> <level> <message>`. Never panics on a write failure — a log sink
    /// that can crash the thing it is meant to record a failure from would defeat its own purpose.
    pub fn append(&self, level: &str, message: &str) {
        let ms = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis())
            .unwrap_or(0);
        // A single-line record, even if `message` itself contains a newline — a multi-line entry
        // would make "the last line" an unreliable thing to tail.
        let line = format!("{ms} {level} {}\n", message.replace('\n', "\\n"));
        if let Ok(mut f) = self.file.lock() {
            let _ = f.write_all(line.as_bytes());
            let _ = f.flush();
        }
    }
}
