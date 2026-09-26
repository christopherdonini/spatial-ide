// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The advisory source-change watcher's adapter — `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a.
//!
//! **What this module claims and does not.** It maps real filesystem events on a temp directory to
//! three signals: a change, coverage lost, and unavailable at open (`ArmOutcome::ChecksOnly`). It
//! makes **no** claim about an OS delivery deadline, event ordering against a data-plane frame, or
//! any latency (ADR-035 Consequences; `docs/08` is untouched by this module). It is **advisory**:
//! the descriptor comparison in [`crate::descriptor`] remains the only thing that ever refuses a
//! query, unchanged by this module's existence (§5's "declared unchanged" list).
//!
//! **Product caller of every `pub` item here: the kernel** (`kernel::skp`). [`PlatformWatch`] is
//! constructed once, in the shell's `run` `setup` closure, where `SkpHost` is built.

use std::path::Path;
use std::sync::Arc;

/// A fact this adapter observed about an armed source, reported through a [`WatchSink`] — an
/// engine fact only, never a consequence (the operator-visible-text rule).
#[derive(Clone, Debug)]
pub enum WatchSignal {
    /// A notification matching the source (or, for the grandparent watch, matching the watched
    /// directory's own name) arrived. `action` is a short, fixed label for what kind
    /// (`"added"`, `"removed"`, `"modified"`, `"renamed-old-name"`, `"renamed-new-name"`,
    /// `"unknown"`, or `"directory-renamed"` for the grandparent's own match) — never a sentence.
    Change { action: &'static str },
    /// The watch itself stopped being able to tell this session anything: an overflow, an
    /// unrequested abort, or a failed re-issue. `cause` is the engine's own fact about what failed.
    CoverageLost { cause: String },
}

/// Delivers a [`WatchSignal`] to whoever armed the watch. Called from a watch thread, never from
/// the caller's own thread — a sink must not block or take a lock the caller might already hold.
pub type WatchSink = Arc<dyn Fn(WatchSignal) + Send + Sync>;

/// A live, armed watch. Disarm is its `Drop` — dropping this value stops the watch and releases
/// every handle and thread it holds, synchronously.
pub trait ArmedWatch: Send {
    /// `true` exactly when this watch has delivered no [`WatchSignal`] to its sink since it was
    /// armed. A synchronous, lock-free check of the watch's own internal state — independent of
    /// (and a second check beside) whatever bookkeeping the sink's own caller keeps from the
    /// asynchronous callback, so a signal that raced the caller's own admission check is still
    /// caught even if the caller's own record of it has not yet been observed.
    ///
    /// **The contract the kernel's admission path relies on** (`SOURCE-WATCHER-PREREGISTRATION.md`
    /// §2b, "Open and admission"): `false` means a signal has been delivered to the sink, or will
    /// be before this watch's own [`Drop`] returns.
    fn resolves_unchanged(&self) -> bool;
}

/// What arming produced.
pub enum ArmOutcome {
    /// A live watch is in place and delivering signals to the sink it was given.
    Watching(Box<dyn ArmedWatch>),
    /// No watch could be armed. `reason` names the step that failed and the OS error's text —
    /// engine facts only. Never a refusal: the caller falls back to checks (the pre-check/
    /// post-check descriptor comparison) alone.
    ChecksOnly { reason: String },
}

/// Arms a watch over one source path. Implemented by [`PlatformWatch`] (the product) and, in
/// `engine/tests/source_watch_adapter.rs` and the kernel's own ordering tests, by test-only
/// implementors that inject signals deterministically — no constructor exists here for tests only.
pub trait SourceWatchArm: Send + Sync {
    fn arm(&self, path: &Path, sink: WatchSink) -> ArmOutcome;
}

/// The declared buffer size for each handle's `ReadDirectoryChangesW` call (§7), DWORD-aligned.
/// Overflow past it is [`WatchSignal::CoverageLost`], never silently dropped.
pub(crate) const WATCH_BUFFER_BYTES: usize = 65536;

/// The product [`SourceWatchArm`]. Off Windows, [`SourceWatchArm::arm`] always returns
/// `ArmOutcome::ChecksOnly` naming the platform, and never `Watching` (§2a).
#[derive(Default)]
pub struct PlatformWatch;

impl PlatformWatch {
    pub fn new() -> Self {
        Self
    }
}

impl SourceWatchArm for PlatformWatch {
    fn arm(&self, path: &Path, sink: WatchSink) -> ArmOutcome {
        #[cfg(windows)]
        {
            windows_watch::arm(path, sink)
        }
        #[cfg(not(windows))]
        {
            let _ = (path, sink);
            ArmOutcome::ChecksOnly {
                reason: "[P6 placeholder] this platform is not Windows; the advisory source-change \
                         watcher runs on Windows only"
                    .to_string(),
            }
        }
    }
}

#[cfg(windows)]
mod windows_watch {
    use super::{ArmOutcome, ArmedWatch, WatchSignal, WatchSink, WATCH_BUFFER_BYTES};

    use std::fs::OpenOptions;
    use std::os::windows::ffi::OsStrExt;
    use std::os::windows::fs::OpenOptionsExt;
    use std::path::Path;
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;

    use windows_sys::Win32::Foundation::{
        CloseHandle, GetLastError, ERROR_NOTIFY_ENUM_DIR, ERROR_OPERATION_ABORTED, HANDLE,
    };
    use windows_sys::Win32::Storage::FileSystem::{
        GetShortPathNameW, ReadDirectoryChangesW, FILE_ACTION_ADDED, FILE_ACTION_MODIFIED,
        FILE_ACTION_REMOVED, FILE_ACTION_RENAMED_NEW_NAME, FILE_ACTION_RENAMED_OLD_NAME,
        FILE_FLAG_BACKUP_SEMANTICS, FILE_FLAG_OVERLAPPED, FILE_LIST_DIRECTORY,
        FILE_NOTIFY_CHANGE_DIR_NAME, FILE_NOTIFY_CHANGE_FILE_NAME, FILE_NOTIFY_CHANGE_LAST_WRITE,
        FILE_NOTIFY_CHANGE_SIZE, FILE_SHARE_DELETE, FILE_SHARE_READ, FILE_SHARE_WRITE,
    };
    use windows_sys::Win32::System::IO::{CancelIoEx, GetOverlappedResult, OVERLAPPED};

    /// Which directory a handle is watching, for the mapping table (§2a).
    #[derive(Clone, Copy, PartialEq, Eq)]
    enum WatchKind {
        /// Watching the source's own parent, for a match on the source's name.
        Parent,
        /// Watching the parent's parent, for a match on the parent's own name (addition 5).
        Grandparent,
    }

    /// The long and short (8.3) names a completion's `FileName` is compared against, byte-exact
    /// per `char` after `to_uppercase` where the mapping is 1:1, otherwise exact (§7).
    struct NameSet {
        long: String,
        short: Option<String>,
    }

    impl NameSet {
        fn matches(&self, observed: &str) -> bool {
            names_match(&self.long, observed) || self.short.as_deref().is_some_and(|s| names_match(s, observed))
        }
    }

    /// Case-fold comparison: `to_uppercase` where the mapping is 1:1 (the overwhelming common
    /// case — ASCII and the vast majority of Unicode), otherwise an exact byte comparison. The
    /// residual (a `char` whose uppercase form is not 1:1) is named in KNOWN-LIMITATIONS (§7).
    fn names_match(a: &str, b: &str) -> bool {
        if a == b {
            return true;
        }
        let fold = |s: &str| -> String {
            s.chars()
                .map(|c| {
                    let mut up = c.to_uppercase();
                    match (up.next(), up.next()) {
                        (Some(u), None) => u,
                        _ => c,
                    }
                })
                .collect()
        };
        fold(a) == fold(b)
    }

    fn wide(s: &std::ffi::OsStr) -> Vec<u16> {
        s.encode_wide().chain(std::iter::once(0)).collect()
    }

    /// `GetShortPathNameW` over `path`. `None` when the call fails (no 8.3 name exists, 8.3
    /// generation is disabled on this volume, or any other reason) — comparison then falls back to
    /// the long name alone, which is always present.
    fn short_path_name(path: &Path) -> Option<String> {
        let wide_path = wide(path.as_os_str());
        let mut buf = [0u16; 512];
        // SAFETY: `wide_path` is a valid, nul-terminated UTF-16 buffer; `buf` is large enough for
        // any 8.3 short path, and its length is passed as the declared capacity.
        let len = unsafe {
            GetShortPathNameW(wide_path.as_ptr(), buf.as_mut_ptr(), buf.len() as u32)
        };
        if len == 0 || len as usize >= buf.len() {
            return None;
        }
        let short_full = String::from_utf16_lossy(&buf[..len as usize]);
        Path::new(&short_full).file_name().map(|n| n.to_string_lossy().to_string())
    }

    /// Open a directory handle suitable for `ReadDirectoryChangesW` (§2a's edge): list-directory
    /// access, full sharing (addition 5, so this watch never blocks a rename or delete of the
    /// directory it watches — block-on-sight 16), backup semantics (required to open a directory
    /// at all) plus overlapped I/O. Returns the raw handle, `into_raw_handle`'d out of the
    /// `std::fs::File` immediately — ownership passes to this module's own `Drop`
    /// (`SourceWatch`/`Handle`) rather than `File`'s, since `File::drop` knows nothing about the
    /// outstanding overlapped read this module issues on it.
    fn open_directory(path: &Path) -> std::io::Result<HANDLE> {
        use std::os::windows::io::IntoRawHandle;
        let file = OpenOptions::new()
            .access_mode(FILE_LIST_DIRECTORY)
            .share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE)
            .custom_flags(FILE_FLAG_BACKUP_SEMANTICS | FILE_FLAG_OVERLAPPED)
            .open(path)?;
        Ok(file.into_raw_handle() as HANDLE)
    }

    /// One pending (issued, not yet completed) overlapped read, owning the buffer and the
    /// `OVERLAPPED` block the kernel writes into for as long as the read is outstanding.
    struct PendingRead {
        handle: HANDLE,
        buffer: Box<[u8; WATCH_BUFFER_BYTES]>,
        overlapped: Box<OVERLAPPED>,
    }

    // SAFETY: a Win32 `HANDLE` is an opaque, process-wide resource identifier (never a pointer this
    // process dereferences), and `OVERLAPPED`'s own `hEvent` field here is always null (this module
    // never sets it) — Windows documents both as safe to hand to another thread once the calling
    // thread no longer touches them, which is exactly the ownership transfer `arm` performs when it
    // moves a freshly-issued `PendingRead` into the one watch thread that owns it from then on.
    unsafe impl Send for PendingRead {}

    impl Drop for PendingRead {
        /// Cancel this read specifically (**never null** — the fix ruling's §4 item 3, beyond B2: a
        /// null cancel from a value that does not know whether some other read on the same
        /// handle has since been issued could cancel that unrelated read instead) and
        /// **synchronize on the cancellation** before `buffer` and `overlapped` are freed —
        /// closing or freeing either while the driver may still be writing a (cancelled)
        /// completion into them is a use-after-free waiting to happen. This makes dropping a
        /// `PendingRead` always safe, including when a failed `Builder::spawn` drops the
        /// closure that captured it without ever running [`watch_thread`]'s own
        /// `GetOverlappedResult` (reviewer B2).
        fn drop(&mut self) {
            unsafe {
                CancelIoEx(self.handle, self.overlapped.as_ref());
            }
            let mut transferred = 0u32;
            unsafe {
                GetOverlappedResult(self.handle, self.overlapped.as_ref(), &mut transferred, 1);
            }
        }
    }

    /// Issue one overlapped `ReadDirectoryChangesW` on `handle`. `Err` names the OS error; the
    /// caller treats that as an arm failure (`ChecksOnly`), never a signal.
    fn issue_read(handle: HANDLE, filter: u32) -> Result<PendingRead, String> {
        let mut buffer = Box::new([0u8; WATCH_BUFFER_BYTES]);
        let mut overlapped: Box<OVERLAPPED> = Box::new(unsafe { std::mem::zeroed() });
        // SAFETY: `handle` is a valid, overlapped-mode directory handle owned by this call's
        // caller for at least as long as this read is outstanding; `buffer` and `overlapped` are
        // heap-allocated and moved into the returned `PendingRead`, so their addresses stay valid
        // for the read's whole lifetime, which is exactly the requirement `ReadDirectoryChangesW`
        // places on an overlapped call. `bWatchSubtree = FALSE` (no subtree, per §2a); `lpBytesReturned`
        // is null, the documented form for an overlapped call (the count is read from
        // `GetOverlappedResult` once the read completes).
        let ok = unsafe {
            ReadDirectoryChangesW(
                handle,
                buffer.as_mut_ptr() as *mut core::ffi::c_void,
                buffer.len() as u32,
                0,
                filter,
                std::ptr::null_mut(),
                overlapped.as_mut(),
                None,
            )
        };
        if ok == 0 {
            let err = unsafe { GetLastError() };
            return Err(format!("ReadDirectoryChangesW failed, error {err}"));
        }
        Ok(PendingRead { handle, buffer, overlapped })
    }

    /// One armed handle's watch thread: waits for the outstanding read to complete, maps it, and
    /// re-issues — until disarm or a `CoverageLost` (at most one signal per handle, §2a).
    fn watch_thread(
        mut pending: PendingRead,
        names: NameSet,
        kind: WatchKind,
        filter: u32,
        sink: WatchSink,
        fired: Arc<AtomicBool>,
        disarming: Arc<AtomicBool>,
    ) {
        let handle = pending.handle;
        loop {
            let mut transferred: u32 = 0;
            // SAFETY: `handle` and `pending.overlapped` are the same pair `issue_read` submitted;
            // `bWait = TRUE` blocks this thread (and only this thread) until the one outstanding
            // read on this handle completes, is cancelled, or the handle is closed.
            let ok = unsafe {
                GetOverlappedResult(handle, pending.overlapped.as_ref(), &mut transferred, 1)
            };
            if ok == 0 {
                let err = unsafe { GetLastError() };
                if err == ERROR_OPERATION_ABORTED && disarming.load(Ordering::SeqCst) {
                    // This watch's own disarm cancelled the read: nothing is reported (§2a's
                    // mapping table, last row).
                    return;
                }
                if fired.swap(true, Ordering::SeqCst) {
                    return;
                }
                sink(WatchSignal::CoverageLost {
                    cause: format!(
                        "the overlapped read completed with error {err}, not the disarm's own \
                         ERROR_OPERATION_ABORTED"
                    ),
                });
                return;
            }
            if transferred == 0 {
                // A 0-byte success: an overflow (§2a's mapping table).
                if fired.swap(true, Ordering::SeqCst) {
                    return;
                }
                sink(WatchSignal::CoverageLost {
                    cause: "the notification buffer overflowed (a 0-byte completion)".to_string(),
                });
                return;
            }

            match map_completion(&pending.buffer[..transferred as usize], &names, kind) {
                Some(signal) => {
                    if !fired.swap(true, Ordering::SeqCst) {
                        sink(signal);
                    }
                    return;
                }
                None => {
                    // A non-matching name: re-issue and keep waiting (§2a's mapping table).
                    match issue_read(handle, filter) {
                        Ok(next) => {
                            pending = next;
                            // Reviewer B1: `disarming` may have flipped between the
                            // completion just handled and this re-issue — `SourceWatch::drop`'s
                            // own `CancelIoEx` landed on the read that just completed, not on
                            // this new one, so without this check the new read is never
                            // cancelled and this thread's next wait below blocks until some
                            // later, unrelated change. Re-check and cancel this read's own
                            // `OVERLAPPED` (named, not null: one read is ever outstanding per
                            // handle, so both cancel the same read here, and naming it keeps
                            // the cancel exact if that changes) so the loop's next wait wakes with
                            // `ERROR_OPERATION_ABORTED` and returns through the top-of-loop
                            // disarm check above.
                            if disarming.load(Ordering::SeqCst) {
                                unsafe {
                                    CancelIoEx(handle, pending.overlapped.as_ref());
                                }
                            }
                        }
                        Err(e) => {
                            if fired.swap(true, Ordering::SeqCst) {
                                return;
                            }
                            sink(WatchSignal::CoverageLost {
                                cause: format!("re-issuing the watch after a non-matching name failed: {e}"),
                            });
                            return;
                        }
                    }
                }
            }
        }
    }

    /// Walk one `ReadDirectoryChangesW` completion's `FILE_NOTIFY_INFORMATION` records. `None`
    /// means every record named a non-matching name (a `Change` is `Some`; `ERROR_NOTIFY_ENUM_DIR`
    /// is handled by the caller before this is reached).
    fn map_completion(buffer: &[u8], names: &NameSet, kind: WatchKind) -> Option<WatchSignal> {
        let mut offset = 0usize;
        loop {
            if offset + 12 > buffer.len() {
                return None;
            }
            // SAFETY: `buffer` is at least 12 bytes past `offset` (checked above), which is
            // `FILE_NOTIFY_INFORMATION`'s three fixed `u32` members read here individually and
            // unaligned — the structure's own layout is not naturally aligned inside this byte
            // buffer, which is why every read here is `from_ne_bytes` over a copied, aligned
            // array rather than a cast onto the buffer's own (possibly misaligned) bytes.
            let next_entry_offset = u32::from_ne_bytes(buffer[offset..offset + 4].try_into().unwrap());
            let action = u32::from_ne_bytes(buffer[offset + 4..offset + 8].try_into().unwrap());
            let file_name_length =
                u32::from_ne_bytes(buffer[offset + 8..offset + 12].try_into().unwrap()) as usize;
            let name_start = offset + 12;
            let name_end = name_start + file_name_length;
            if name_end > buffer.len() {
                return None;
            }
            let name_bytes = &buffer[name_start..name_end];
            let wide: Vec<u16> = name_bytes
                .chunks_exact(2)
                .map(|b| u16::from_ne_bytes([b[0], b[1]]))
                .collect();
            let observed = String::from_utf16_lossy(&wide);
            // Only the file name is compared, never a path — `ReadDirectoryChangesW` on a
            // non-subtree watch reports the changed entry's own name, relative to the watched
            // directory.
            let observed_name = Path::new(&observed)
                .file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or(observed);
            if names.matches(&observed_name) {
                let label = match kind {
                    WatchKind::Grandparent => "directory-renamed",
                    WatchKind::Parent => action_label(action),
                };
                return Some(WatchSignal::Change { action: label });
            }
            if next_entry_offset == 0 {
                return None;
            }
            offset += next_entry_offset as usize;
        }
    }

    fn action_label(action: u32) -> &'static str {
        match action {
            FILE_ACTION_ADDED => "added",
            FILE_ACTION_REMOVED => "removed",
            FILE_ACTION_MODIFIED => "modified",
            FILE_ACTION_RENAMED_OLD_NAME => "renamed-old-name",
            FILE_ACTION_RENAMED_NEW_NAME => "renamed-new-name",
            _ => "unknown",
        }
    }

    /// One armed handle: closed and joined on `Drop`.
    struct Handle {
        raw: HANDLE,
        disarming: Arc<AtomicBool>,
        join: Option<std::thread::JoinHandle<()>>,
    }

    // SAFETY: see `PendingRead`'s own `Send` impl above — the same reasoning applies to the raw
    // handle this struct closes on `Drop`, from whichever thread that `Drop` runs on.
    unsafe impl Send for Handle {}

    /// The product [`ArmedWatch`]: the parent handle always, the grandparent's if it was armed too.
    pub struct SourceWatch {
        fired: Arc<AtomicBool>,
        handles: Vec<Handle>,
    }

    impl ArmedWatch for SourceWatch {
        fn resolves_unchanged(&self) -> bool {
            !self.fired.load(Ordering::SeqCst)
        }
    }

    impl Drop for SourceWatch {
        fn drop(&mut self) {
            // Per §2a, at most one signal per handle and no re-arm within an open. Cancel
            // every outstanding read first (so every thread's `GetOverlappedResult` wakes with
            // `ERROR_OPERATION_ABORTED`, reported as nothing per the mapping table's last row),
            // then join, then close — releasing the directory happens only once every thread has
            // stopped touching the handle.
            for h in &self.handles {
                h.disarming.store(true, Ordering::SeqCst);
                // SAFETY: `h.raw` is a handle this watch owns exclusively until this `Drop` runs;
                // cancelling with a null `OVERLAPPED` cancels every outstanding I/O on it from any
                // thread in this process, which is exactly the one outstanding read by construction.
                unsafe {
                    CancelIoEx(h.raw, std::ptr::null());
                }
            }
            for h in &mut self.handles {
                if let Some(j) = h.join.take() {
                    let _ = j.join();
                }
                // SAFETY: the watch thread for `h.raw` has been joined above, so nothing else is
                // touching this handle; closing it releases the directory (A9, A12).
                unsafe {
                    CloseHandle(h.raw);
                }
            }
        }
    }

    pub fn arm(path: &Path, sink: WatchSink) -> ArmOutcome {
        // Step 1 (§2a): canonicalize — resolves junctions and symlinks in every component (A10).
        let canonical = match std::fs::canonicalize(path) {
            Ok(p) => p,
            Err(e) => {
                return ArmOutcome::ChecksOnly {
                    reason: format!(
                        "[P6 placeholder] could not canonicalize the source path: {e}"
                    ),
                }
            }
        };
        let Some(parent) = canonical.parent().map(Path::to_path_buf) else {
            return ArmOutcome::ChecksOnly {
                reason: "[P6 placeholder] the source's canonicalized path has no parent directory"
                    .to_string(),
            };
        };
        let Some(final_name) = canonical.file_name() else {
            return ArmOutcome::ChecksOnly {
                reason: "[P6 placeholder] the source's canonicalized path carries no file name"
                    .to_string(),
            };
        };

        // Step 2: open the parent, P.
        let parent_handle = match open_directory(&parent) {
            Ok(h) => h,
            Err(e) => {
                return ArmOutcome::ChecksOnly {
                    reason: format!(
                        "[P6 placeholder] could not open the parent directory to watch it: {e}"
                    ),
                }
            }
        };

        // Step 3: record the final name and its 8.3 short name, if one exists.
        let p_names = NameSet {
            long: final_name.to_string_lossy().to_string(),
            short: short_path_name(&canonical),
        };

        // Step 4: P's first overlapped read.
        const P_FILTER: u32 =
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE;
        let p_pending = match issue_read(parent_handle, P_FILTER) {
            Ok(p) => p,
            Err(e) => {
                unsafe {
                    CloseHandle(parent_handle);
                }
                return ArmOutcome::ChecksOnly {
                    reason: format!("[P6 placeholder] could not arm the parent directory watch: {e}"),
                }
            }
        };

        // Step 5: the grandparent, G, unless P is a volume root (round 17 item 2).
        let mut grandparent_armed: Option<(HANDLE, PendingRead, NameSet)> = None;
        let is_volume_root = parent.parent().is_none();
        if !is_volume_root {
            if let Some(grandparent) = parent.parent().map(Path::to_path_buf) {
                let g_names = NameSet {
                    long: parent
                        .file_name()
                        .map(|n| n.to_string_lossy().to_string())
                        .unwrap_or_default(),
                    short: short_path_name(&parent),
                };
                match open_directory(&grandparent) {
                    Ok(g_handle) => match issue_read(g_handle, FILE_NOTIFY_CHANGE_DIR_NAME) {
                        Ok(g_pending) => {
                            grandparent_armed = Some((g_handle, g_pending, g_names));
                        }
                        Err(e) => {
                            // A failure to arm G is checks-only too (the conservative reading
                            // ruled as recommended) — dropping P's own not-yet-threaded read here
                            // cancels and synchronizes it (`PendingRead::drop`) before its buffer
                            // is freed (no thread exists yet to do that for us), then both
                            // directories are released.
                            drop(p_pending);
                            unsafe {
                                CloseHandle(parent_handle);
                                CloseHandle(g_handle);
                            }
                            return ArmOutcome::ChecksOnly {
                                reason: format!(
                                    "[P6 placeholder] could not arm the grandparent directory \
                                     watch: {e}"
                                ),
                            };
                        }
                    },
                    Err(e) => {
                        // Dropping P's own not-yet-threaded read cancels and synchronizes it
                        // (`PendingRead::drop`) before its buffer is freed.
                        drop(p_pending);
                        unsafe {
                            CloseHandle(parent_handle);
                        }
                        return ArmOutcome::ChecksOnly {
                            reason: format!(
                                "[P6 placeholder] could not open the grandparent directory to \
                                 watch it: {e}"
                            ),
                        };
                    }
                }
            }
        }

        // Step 6: only once every read is pending, spawn one thread per handle. Reviewer B2: a
        // failed spawn is a fallible OS call on a product path, never an `.expect()` panic — it
        // falls back to `ChecksOnly` like every other arming failure above.
        let fired = Arc::new(AtomicBool::new(false));

        let p_disarming = Arc::new(AtomicBool::new(false));
        let p_spawn = {
            let sink = sink.clone();
            let fired = fired.clone();
            let disarming = p_disarming.clone();
            std::thread::Builder::new()
                .name("spatial-source-watch-parent".to_string())
                .spawn(move || {
                    watch_thread(p_pending, p_names, WatchKind::Parent, P_FILTER, sink, fired, disarming)
                })
        };
        let p_join = match p_spawn {
            Ok(j) => j,
            Err(e) => {
                // The closure above, including its `p_pending`, was already dropped by the
                // failed `spawn` call — `PendingRead::drop` already cancelled and synchronized
                // that outstanding read before its buffer was freed. Only the raw handles this
                // function still owns need releasing.
                unsafe {
                    CloseHandle(parent_handle);
                }
                if let Some((g_handle, g_pending, _)) = grandparent_armed {
                    drop(g_pending);
                    unsafe {
                        CloseHandle(g_handle);
                    }
                }
                return ArmOutcome::ChecksOnly {
                    reason: format!(
                        "[P6 placeholder] could not spawn the parent watch thread: {e}"
                    ),
                };
            }
        };
        let mut handles = Vec::with_capacity(2);
        handles.push(Handle { raw: parent_handle, disarming: p_disarming, join: Some(p_join) });

        if let Some((g_handle, g_pending, g_names)) = grandparent_armed {
            let g_disarming = Arc::new(AtomicBool::new(false));
            let g_spawn = {
                let sink = sink.clone();
                let fired = fired.clone();
                let disarming = g_disarming.clone();
                std::thread::Builder::new()
                    .name("spatial-source-watch-grandparent".to_string())
                    .spawn(move || {
                        watch_thread(
                            g_pending,
                            g_names,
                            WatchKind::Grandparent,
                            FILE_NOTIFY_CHANGE_DIR_NAME,
                            sink,
                            fired,
                            disarming,
                        )
                    })
            };
            match g_spawn {
                Ok(j) => {
                    handles.push(Handle { raw: g_handle, disarming: g_disarming, join: Some(j) });
                }
                Err(e) => {
                    // `g_pending` was already dropped inside the failed `spawn` call above,
                    // cancelled and synchronized by its own `Drop`. Build and drop a
                    // `SourceWatch` holding only P, which disarms, joins and closes it, then
                    // close G.
                    drop(SourceWatch { fired: fired.clone(), handles });
                    unsafe {
                        CloseHandle(g_handle);
                    }
                    return ArmOutcome::ChecksOnly {
                        reason: format!(
                            "[P6 placeholder] could not spawn the grandparent watch thread: {e}"
                        ),
                    };
                }
            }
        }

        ArmOutcome::Watching(Box::new(SourceWatch { fired, handles }))
    }

    /// `ERROR_NOTIFY_ENUM_DIR` reserved for readability at the call site (§2a's mapping table);
    /// not read anywhere today because `GetOverlappedResult`'s failure arm in [`watch_thread`]
    /// already treats every non-abort error uniformly as `CoverageLost`, which this named constant
    /// documents rather than special-cases — the mapping table's own text names it explicitly as
    /// one of the two shapes an overflow can take (H3), and this binds the name to the value that
    /// checked build keeps live.
    #[allow(dead_code)]
    const _ERROR_NOTIFY_ENUM_DIR: u32 = ERROR_NOTIFY_ENUM_DIR;

    #[cfg(test)]
    mod tests {
        use super::names_match;

        /// **The isolating proof for A7** (`engine/tests/source_watch_adapter.rs`). A real Windows
        /// rename event cannot isolate the fold from the byte-exact branch — every scenario that
        /// produces a fold-dependent match is preceded, on the same handle, by a record naming the
        /// file's own current (already byte-exact-matching) spelling, so a Tier-2 test can never
        /// observe the fold path break in isolation (A7's own doc comment has the full account).
        /// This calls the shipped, private `names_match` directly — no reimplementation.
        ///
        /// RECORDED MUTATION: replace the function body with `a == b` (drop the fold entirely).
        /// Expected failure: this test's `assert!(names_match(...))` line fails, `false` where
        /// `true` is expected.
        #[test]
        fn names_match_folds_case() {
            assert!(names_match("source.dat", "SOURCE.DAT"));
            assert!(names_match("SOURCE.DAT", "source.dat"));
            assert!(names_match("Source.Dat", "sOURCE.dAT"));
            assert!(names_match("source.dat", "source.dat"));
            assert!(!names_match("source.dat", "sibling.dat"));
        }
    }
}
