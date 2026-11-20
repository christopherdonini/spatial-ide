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
    /// The data plane's own session (`RunningDataPlane::session`, cloned at startup): its token is
    /// what `binding_data_plane_attach` hands out, and what `SessionLog::append_redacted` redacts
    /// when `binding_log_session_event` passes this session to it.
    pub session: spatial_data_plane::Session,
}

/// A single append-only file, flushed on every write. **Instrument surface — never an SKP field or
/// command** (ADR-004 Amendment 4): this sink exists so a global `error`/`unhandledrejection`
/// handler's output outlives the session, not so the wire can carry anything through it.
///
/// The session token does not reach this file through the page's lines:
/// `binding_log_session_event` (`commands.rs`) writes them through `append_redacted`, which passes
/// the page's `level` and `message` through the data plane's `Session::redact`, replacing every
/// occurrence of the token's exact text with `<redacted>`, and then calls `append`. The host's own
/// lines are composed in this crate and take
/// no token, with one exception that ordinary use does not reach: the origin self-check (`lib.rs`,
/// `on_page_load`) writes the main window's actual origin, or its whole URL when that URL has no
/// host, unredacted, so a page script that navigates the main window to an address holding the
/// token puts it here. Text holding the token in any other form (another case, another encoding,
/// split across calls) is not redacted.
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
        let file = std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&path)?;
        Ok(Self {
            file: Mutex::new(file),
            path,
        })
    }

    /// Append one line: `<unix-ms> <level> <message>`. Never panics on a write failure — a log sink
    /// that can crash the thing it is meant to record a failure from would defeat its own purpose.
    ///
    /// Both `level` and `message`, from every caller, pass through `one_line` first, so no line
    /// this writes holds a Unicode Cc but its final LF, nor a Bidi_Control character, U+2028 or
    /// U+2029. A text holding none of those is written as given. No length bound is applied. Nor
    /// does this make a line's fields always separable: a `level` holding a space, or a backslash
    /// followed by `n` in either text, is written as given. The page's texts reach this already
    /// redacted ([`Self::append_redacted`]); the rule replaces characters and removes none, and
    /// the token is hex, so running it after the redaction cannot change what the redaction caught.
    pub fn append(&self, level: &str, message: &str) {
        let ms = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis())
            .unwrap_or(0);
        // A single-line record whatever either text holds: a multi-line entry would make "the last
        // line" an unreliable thing to tail, and a CR or a Bidi_Control character can make a
        // terminal or an editor display a line otherwise than as its text reads.
        let line = format!("{ms} {} {}\n", one_line(level), one_line(message));
        if let Ok(mut f) = self.file.lock() {
            let _ = f.write_all(line.as_bytes());
            let _ = f.flush();
        }
    }

    /// Append one line of the page's text, for `binding_log_session_event` (`commands.rs`), its one
    /// product caller: `level` and `message` each pass through `session`'s `Session::redact`, which
    /// replaces every occurrence of the session token's exact text with `<redacted>`, and then
    /// [`Self::append`] writes the two results under its own rule. Text holding the token in any
    /// other form is not caught (this type's doc).
    pub fn append_redacted(
        &self,
        session: &spatial_data_plane::Session,
        level: &str,
        message: &str,
    ) {
        self.append(&session.redact(level), &session.redact(message));
    }
}

/// One text of a session-log line: each LF as a backslash and `n`; each other Unicode Cc
/// ([`char::is_control`], the tab and the CR among them), each Bidi_Control character (U+061C,
/// U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069), U+2028 and U+2029 as U+FFFD; every other
/// character as given. The set is the one `shownText` (`frontends/shell/src/project/shownText.ts`)
/// replaces, but for the LF, which is written as two characters so that the line stays one.
fn one_line(text: &str) -> String {
    let mut line = String::with_capacity(text.len());
    for c in text.chars() {
        match c {
            '\n' => line.push_str("\\n"),
            '\u{061C}'
            | '\u{200E}'
            | '\u{200F}'
            | '\u{202A}'..='\u{202E}'
            | '\u{2066}'..='\u{2069}'
            | '\u{2028}'
            | '\u{2029}' => line.push(char::REPLACEMENT_CHARACTER),
            c if c.is_control() => line.push(char::REPLACEMENT_CHARACTER),
            c => line.push(c),
        }
    }
    line
}
