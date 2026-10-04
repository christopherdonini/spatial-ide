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
    /// post-check descriptor comparison) alone. A watch thread started before a later arming
    /// step failed may already have delivered a signal to the sink; every such delivery returns
    /// before `arm` does.
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
                reason:
                    "[P6 placeholder] this platform is not Windows; the advisory source-change \
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
    use std::sync::{mpsc, Arc};

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
            names_match(&self.long, observed)
                || self
                    .short
                    .as_deref()
                    .is_some_and(|s| names_match(s, observed))
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
        let len =
            unsafe { GetShortPathNameW(wide_path.as_ptr(), buf.as_mut_ptr(), buf.len() as u32) };
        if len == 0 || len as usize >= buf.len() {
            return None;
        }
        let short_full = String::from_utf16_lossy(&buf[..len as usize]);
        Path::new(&short_full)
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
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
    /// `OVERLAPPED` block the kernel writes into for as long as the read is outstanding. Created
    /// and dropped only on the one watch thread that owns its handle (wave-2 C-1: `issue_read` is
    /// now called from inside `watch_thread` itself, never by `arm`) — it never crosses a thread
    /// boundary and no closure ever captures one, so it needs no `Send` impl.
    struct PendingRead {
        handle: HANDLE,
        buffer: Box<[u8; WATCH_BUFFER_BYTES]>,
        overlapped: Box<OVERLAPPED>,
    }

    impl Drop for PendingRead {
        /// Cancel this read specifically (**never null** — the fix ruling's §4 item 3, beyond B2: a
        /// null cancel from a value that does not know whether some other read on the same
        /// handle has since been issued could cancel that unrelated read instead) and
        /// **synchronize on the cancellation** before `buffer` and `overlapped` are freed —
        /// closing or freeing either while the driver may still be writing a (cancelled)
        /// completion into them is a use-after-free waiting to happen. Runs only on this value's
        /// own watch thread (see the struct doc above), either from the loop's next iteration or
        /// from the thread unwinding — never from another thread's `Drop`, since nothing ever
        /// sends a `PendingRead` elsewhere.
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
        Ok(PendingRead {
            handle,
            buffer,
            overlapped,
        })
    }

    // SAFETY: a Win32 `HANDLE` is an opaque, process-wide resource identifier, never a pointer
    // this process dereferences — Windows documents it as safe to hand to another thread once the
    // calling thread no longer touches it, which is exactly the ownership transfer `arm` performs
    // when it moves a freshly opened directory handle into `spawn_watch_thread`'s closure, to be
    // owned from then on by the one watch thread that runs `watch_thread`.
    struct SendableHandle(HANDLE);
    unsafe impl Send for SendableHandle {}

    /// One armed handle's watch thread. Issues this handle's own first overlapped read (wave-2
    /// C-1: the issuing thread is the thread that owns it thereafter), reports that once through
    /// `ready`, then waits, maps, and re-issues until disarm or `CoverageLost` (§2a).
    #[allow(clippy::too_many_arguments)]
    fn watch_thread(
        handle: SendableHandle,
        names: NameSet,
        kind: WatchKind,
        filter: u32,
        sink: WatchSink,
        fired: Arc<AtomicBool>,
        disarming: Arc<AtomicBool>,
        ready: mpsc::Sender<Result<(), String>>,
    ) {
        let handle = handle.0;
        let mut pending = match issue_read(handle, filter) {
            Ok(p) => {
                let _ = ready.send(Ok(()));
                drop(ready);
                p
            }
            Err(e) => {
                let _ = ready.send(Err(e));
                drop(ready);
                return;
            }
        };
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
                                cause: format!(
                                    "re-issuing the watch after a non-matching name failed: {e}"
                                ),
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
            let next_entry_offset =
                u32::from_ne_bytes(buffer[offset..offset + 4].try_into().unwrap());
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

    // SAFETY: a Win32 `HANDLE` is an opaque, process-wide resource identifier, never a pointer
    // this process dereferences — safe to close from whichever thread this struct's `Drop` runs
    // on (see `SourceWatch::drop`, which joins each handle's watch thread before closing it).
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

    /// `arm`'s mapping from one watch thread's handshake to its `ChecksOnly` reason (`which` is
    /// `"parent"`/`"grandparent"`); exercised through `spawn_watch_thread` by wave-2 C-1
    /// regression test (2), the same function `arm` calls below, not a reimplementation.
    fn await_first_read(
        ready: mpsc::Receiver<Result<(), String>>,
        which: &str,
    ) -> Result<(), String> {
        match ready.recv() {
            Ok(result) => result.map_err(|e| {
                format!("[P6 placeholder] could not arm the {which} directory watch: {e}")
            }),
            // Unreachable by construction today (the watch thread always sends before it can
            // return — see `watch_thread`'s own doc comment), but a fallback here keeps a panic
            // off this product path (reviewer S1) — the caller's existing join-and-close path
            // runs on this `Err` exactly as it does on an issuing error.
            Err(_) => Err(format!(
                "[P6 placeholder] could not arm the {which} directory watch: the watch thread \
                 exited without reporting whether its first read was issued"
            )),
        }
    }

    /// Spawns `handle`'s own watch thread (named `thread_name`), which issues that handle's own
    /// first read (wave-2 C-1), and waits on its handshake — `which` is `"parent"`/`"grandparent"`
    /// for both the thread's own spawn-failure reason and `await_first_read`'s mapping. Closes
    /// `handle` on any failure; the caller closes nothing else.
    #[allow(clippy::too_many_arguments)]
    fn spawn_watch_thread(
        handle: HANDLE,
        names: NameSet,
        kind: WatchKind,
        filter: u32,
        sink: WatchSink,
        fired: Arc<AtomicBool>,
        thread_name: &str,
        which: &str,
    ) -> Result<Handle, String> {
        let disarming = Arc::new(AtomicBool::new(false));
        let (ready_tx, ready_rx) = mpsc::channel();
        let sendable_handle = SendableHandle(handle);
        let spawn_disarming = disarming.clone();
        let spawn = std::thread::Builder::new()
            .name(thread_name.to_string())
            .spawn(move || {
                watch_thread(
                    sendable_handle,
                    names,
                    kind,
                    filter,
                    sink,
                    fired,
                    spawn_disarming,
                    ready_tx,
                )
            });
        let join = match spawn {
            Ok(j) => j,
            Err(e) => {
                // SAFETY: the spawn itself failed, so no thread was ever created and nothing has
                // touched `handle` since `arm` opened it — this call exclusively owns it here.
                unsafe {
                    CloseHandle(handle);
                }
                return Err(format!(
                    "[P6 placeholder] could not spawn the {which} watch thread: {e}"
                ));
            }
        };
        match await_first_read(ready_rx, which) {
            Ok(()) => Ok(Handle {
                raw: handle,
                disarming,
                join: Some(join),
            }),
            Err(reason) => {
                let _ = join.join();
                // SAFETY: the watch thread has just been joined above, so nothing else is
                // touching `handle` — whether it exited after `issue_read` failed (no
                // `PendingRead` was ever created) or without sending at all (`await_first_read`'s
                // `RecvError` mapping).
                unsafe {
                    CloseHandle(handle);
                }
                Err(reason)
            }
        }
    }

    pub fn arm(path: &Path, sink: WatchSink) -> ArmOutcome {
        // Step 1 (§2a): canonicalize — resolves junctions and symlinks in every component (A10).
        let canonical = match std::fs::canonicalize(path) {
            Ok(p) => p,
            Err(e) => {
                return ArmOutcome::ChecksOnly {
                    reason: format!("[P6 placeholder] could not canonicalize the source path: {e}"),
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

        // §2a's Arming list, items 4-6, issued both handles' first reads here in `arm`, then
        // spawned the watch threads only once every read was pending. That ordering is
        // superseded by this piece's Change line (`engine/WATCHER-FIRST-READ-PREREGISTRATION.md`):
        // each handle's own thread now issues that handle's first read itself. The watcher
        // preregistration's §§0-12 are immutable as filed (§22), so its text is not edited to
        // match. The "Step 4"/"Step 5" labels below number this function's own order, not §2a's.
        //
        // Step 4: spawn P's watch thread. It issues P's own first overlapped read itself
        // (wave-2 C-1) and reports that once through the handshake `spawn_watch_thread` awaits.
        const P_FILTER: u32 =
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE;
        let fired = Arc::new(AtomicBool::new(false));
        let p_handle = match spawn_watch_thread(
            parent_handle,
            p_names,
            WatchKind::Parent,
            P_FILTER,
            sink.clone(),
            fired.clone(),
            "spatial-source-watch-parent",
            "parent",
        ) {
            Ok(h) => h,
            Err(reason) => return ArmOutcome::ChecksOnly { reason },
        };
        let mut handles = vec![p_handle];

        // Step 5: the grandparent, G, unless P is a volume root (round 17 item 2). Same handshake
        // shape as P; any failure disarms and joins P first via `SourceWatch`'s own `Drop`.
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
                let g_handle = match open_directory(&grandparent) {
                    Ok(h) => h,
                    Err(e) => {
                        drop(SourceWatch { fired, handles });
                        return ArmOutcome::ChecksOnly {
                            reason: format!(
                                "[P6 placeholder] could not open the grandparent directory to \
                                 watch it: {e}"
                            ),
                        };
                    }
                };
                match spawn_watch_thread(
                    g_handle,
                    g_names,
                    WatchKind::Grandparent,
                    FILE_NOTIFY_CHANGE_DIR_NAME,
                    sink,
                    fired.clone(),
                    "spatial-source-watch-grandparent",
                    "grandparent",
                ) {
                    Ok(h) => handles.push(h),
                    Err(reason) => {
                        drop(SourceWatch { fired, handles });
                        return ArmOutcome::ChecksOnly { reason };
                    }
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
        use super::{
            names_match, spawn_watch_thread, NameSet, WatchKind, WatchSink,
            FILE_NOTIFY_CHANGE_FILE_NAME, HANDLE,
        };
        use std::sync::atomic::AtomicBool;
        use std::sync::Arc;

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

        /// **Regression test (2)**, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md` (wave-2 C-1). A
        /// watch thread started on an invalid directory handle cannot issue its first read; it
        /// must report that failure through the one-shot handshake, and `spawn_watch_thread` —
        /// the same function `arm` calls below, not a reimplementation — must turn it into the
        /// `ChecksOnly` refusal `arm` would return, never `Ok`. This drives `spawn_watch_thread`
        /// itself (architect gate 1, B1), not a reassembly of its own pieces, so it also reaches
        /// its own join-and-close error path and `arm`'s own `Err(reason) => ChecksOnly` arms
        /// (reviewer gate 1, N2).
        ///
        /// RECORDED MUTATION: (a) in `watch_thread`, send `ready.send(Ok(()))` unconditionally
        /// before calling `issue_read` (report success before issuing the read). Expected
        /// failure: this test's `Ok(_) => panic!(..)` arm below fires, because `spawn_watch_thread`
        /// now returns `Ok(Handle { .. })` instead of `Err`. (b) in `spawn_watch_thread`, return
        /// `Ok(Handle { .. })` regardless of `await_first_read`'s outcome (arm never consulting
        /// the handshake). Expected failure: the same `Ok(_) => panic!(..)` arm fires, for the
        /// same reason.
        #[test]
        fn an_invalid_handle_reports_its_issuing_error_through_the_handshake() {
            let fired = Arc::new(AtomicBool::new(false));
            let names = NameSet {
                long: "source.dat".to_string(),
                short: None,
            };
            let sink: WatchSink = Arc::new(|_signal| {});
            let handle: HANDLE = std::ptr::null_mut();
            let result = spawn_watch_thread(
                handle,
                names,
                WatchKind::Parent,
                FILE_NOTIFY_CHANGE_FILE_NAME,
                sink,
                fired,
                "spatial-source-watch-test-parent",
                "parent",
            );
            let reason = match result {
                Err(reason) => reason,
                Ok(_) => panic!("an invalid handle must fail to issue its first read"),
            };
            assert!(
                reason.contains("could not arm the parent directory watch"),
                "expected arm's own ChecksOnly reason text, got: {reason}"
            );
        }
    }
}
