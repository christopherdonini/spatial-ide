// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Tier 2 — the Windows adapter**, `engine/SOURCE-WATCHER-PREREGISTRATION.md` §4: real
//! `PlatformWatch` over real filesystem events on a temp directory. Proves mapping, never timing
//! (`WATCH_TEST_WAIT` is a harness ceiling, not a claim — ADR-018).
//!
//! Non-Windows is a declared non-goal (§4's own tier note): nothing off Windows is claimed beyond
//! `ChecksOnly`, so this whole file is `#[cfg(windows)]`.

#![cfg(windows)]

use std::path::{Path, PathBuf};
use std::sync::mpsc;
use std::time::Duration;

use spatial_engine::{ArmOutcome, ArmedWatch, PlatformWatch, SourceDescriptor, SourceWatchArm, WatchSignal, WatchSink};

/// §7: a harness ceiling, never a claim about delivery latency.
const WATCH_TEST_WAIT: Duration = Duration::from_secs(10);

fn scratch_dir(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-engine-source-watch-adapter-tests").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).expect("scratch dir");
    d
}

/// A file that `SourceDescriptor::of` can parse without a real parquet library or a real GeoParquet
/// fixture writer — the descriptor's own parser is pure byte-level framing (an 8-byte tail: a
/// little-endian `u32` footer length, then the four-byte magic `PAR1`), never a real Thrift
/// validation, so a synthetic zero-length-footer file is a legitimate, minimal input for it. `body`
/// carries whatever bytes a test wants to write and rewrite; the descriptor's footer region (empty)
/// never overlaps them, so an in-place same-size edit of `body` alone never appears in the
/// descriptor (exactly what A1 exercises).
fn plain_file(dir: &Path, name: &str, body: &[u8]) -> PathBuf {
    let path = dir.join(name);
    rewrite_plain_file(&path, body);
    path
}

/// Rewrite an existing (or new) plain fixture file's whole contents — `body` plus the same
/// zero-length-footer tail `plain_file` uses. An in-place same-size edit is `rewrite_plain_file`
/// called twice with two `body` values of equal length; the tail never moves or changes.
fn rewrite_plain_file(path: &Path, body: &[u8]) {
    let mut bytes = body.to_vec();
    bytes.extend_from_slice(&0u32.to_le_bytes());
    bytes.extend_from_slice(b"PAR1");
    std::fs::write(path, &bytes).expect("write plain fixture file");
}

/// Arm a real `PlatformWatch` over `path`, expecting `Watching` — panics with the engine's own
/// `reason` text if arming fell back to `ChecksOnly`, so a broken arm fails loudly rather than
/// letting every signal-based assertion below fail vacuously.
fn arm_watching(path: &Path) -> (Box<dyn ArmedWatch>, mpsc::Receiver<WatchSignal>) {
    let (tx, rx) = mpsc::channel();
    let sink: WatchSink = std::sync::Arc::new(move |signal| {
        let _ = tx.send(signal);
    });
    match PlatformWatch::new().arm(path, sink) {
        ArmOutcome::Watching(w) => (w, rx),
        ArmOutcome::ChecksOnly { reason } => {
            panic!("expected Watching, arming fell back to ChecksOnly: {reason}")
        }
    }
}

/// Arm a real `PlatformWatch` over `path`, expecting `ChecksOnly` — panics if it armed for real.
fn arm_checks_only(path: &Path) -> String {
    let sink: WatchSink = std::sync::Arc::new(|_signal| {});
    match PlatformWatch::new().arm(path, sink) {
        ArmOutcome::ChecksOnly { reason } => reason,
        ArmOutcome::Watching(_) => panic!("expected ChecksOnly, but arming produced a live watch"),
    }
}

fn recv_signal(rx: &mpsc::Receiver<WatchSignal>) -> WatchSignal {
    rx.recv_timeout(WATCH_TEST_WAIT)
        .unwrap_or_else(|_| panic!("no signal arrived within {WATCH_TEST_WAIT:?}"))
}

/// Asserts no signal arrives within a short, bounded window — never a claim about eventual
/// delivery, only that filtering (or disarming) did not fire promptly where it must not. A
/// disconnect with nothing ever sent (the sink's last `Arc` clone dropping, e.g. after `drop(watch)`)
/// is itself a form of "nothing arrived" and passes too.
fn assert_no_signal_soon(rx: &mpsc::Receiver<WatchSignal>) {
    match rx.recv_timeout(WATCH_TEST_WAIT / 10) {
        Ok(signal) => panic!("expected no signal, got {signal:?}"),
        Err(mpsc::RecvTimeoutError::Timeout) => {}
        Err(mpsc::RecvTimeoutError::Disconnected) => {}
    }
}

fn is_change(signal: &WatchSignal) -> bool {
    matches!(signal, WatchSignal::Change { .. })
}

/// Serializes every test in this file on one process-wide lock. A6's own mechanism (suspending
/// every thread in this process named `spatial-source-watch*`) would otherwise reach into whatever
/// OTHER test's watch happens to be live at the same moment under cargo's default concurrent test
/// execution — this file's own tests are the only thing sharing that name, so this is the
/// self-contained fix rather than a new `--test-threads=1` invocation convention to remember.
fn serial_guard() -> std::sync::MutexGuard<'static, ()> {
    static LOCK: std::sync::OnceLock<std::sync::Mutex<()>> = std::sync::OnceLock::new();
    LOCK.get_or_init(|| std::sync::Mutex::new(())).lock().unwrap_or_else(|e| e.into_inner())
}

// -------------------------------------------------------------------------------------------
// A1 (H2, H5's sibling case)
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: drop `LAST_WRITE` and `SIZE` from `engine::watch`'s parent filter constant.
/// Expected failure: this test times out in `recv_signal` — a same-size in-place write generates
/// no `FILE_NAME` event, so with both flags gone nothing is left to catch it.
#[test]
fn a_same_size_in_place_write_with_restored_mtime_signals_change_while_the_descriptor_still_matches(
) {
    let _guard = serial_guard();
    let dir = scratch_dir("a1");
    let path = plain_file(&dir, "source.dat", b"the original body, thirty-two b!");
    let original_mtime = std::fs::metadata(&path).expect("metadata").modified().expect("mtime");
    let before = SourceDescriptor::of(&path).expect("descriptor before");

    let (watch, rx) = arm_watching(&path);

    // Same length as the original body — an in-place, same-size write.
    rewrite_plain_file(&path, b"THE ORIGINAL BODY, THIRTY-TWO B!");
    // Restored immediately after — H2: signalled no later than the writer's handle close, which
    // this write (a single `std::fs::write` open-write-close) already is.
    std::fs::File::options()
        .write(true)
        .open(&path)
        .expect("reopen to restore mtime")
        .set_modified(original_mtime)
        .expect("restore mtime");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");

    let after = SourceDescriptor::of(&path).expect("descriptor after");
    assert_eq!(before, after, "a same-size write with mtime restored must not appear in the descriptor");
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A2 — renaming the source away
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: ignore `RENAMED_OLD_NAME` in `engine::watch`'s action mapping. Expected
/// failure: this test times out — the rename-away completion is the only event this test
/// produces, and dropping its action leaves nothing to signal.
#[test]
fn renaming_the_source_away_signals_change() {
    let _guard = serial_guard();
    let dir = scratch_dir("a2");
    let path = plain_file(&dir, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    std::fs::rename(&path, dir.join("source-renamed-away.dat")).expect("rename away");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A3 — a temp write renamed over the source
// -------------------------------------------------------------------------------------------

/// **Empirical correction to the preregistration's own mutation, discovered while writing this
/// test (recorded here, not silently).** §4's table names the mutation "ignore
/// `RENAMED_NEW_NAME`" for this case. Instrumented and observed directly (debug prints, run and
/// discarded) before writing this comment: `MoveFileExW`'s replace-existing rename actually
/// delivers **three** records for this one `std::fs::rename` call, in order — `REMOVED` on
/// `source.dat` (the destination being unlinked), `RENAMED_OLD_NAME` on `source.dat.tmp` (a
/// non-match, different name), then `RENAMED_NEW_NAME` on `source.dat`. Ignoring
/// `RENAMED_NEW_NAME` alone leaves the test passing on the earlier `REMOVED` match, so it is not
/// actually the discriminating mutation for this scenario; ignoring `REMOVED` **and**
/// `RENAMED_NEW_NAME` together is, and was verified to make this test time out.
///
/// RECORDED MUTATION: ignore both `REMOVED` and `RENAMED_NEW_NAME` in `engine::watch`'s action
/// mapping. Expected/observed failure: this test times out — every record this rename-over
/// produces is then excluded.
#[test]
fn a_temp_write_renamed_over_the_source_signals_change() {
    let _guard = serial_guard();
    let dir = scratch_dir("a3");
    let path = plain_file(&dir, "source.dat", b"original");
    let tmp = plain_file(&dir, "source.dat.tmp", b"replacement");
    let (watch, rx) = arm_watching(&path);

    // A temp-write-then-rename-over, addition 6's named case: Rust's `rename` on Windows replaces
    // an existing target.
    std::fs::rename(&tmp, &path).expect("rename the temp write over the source");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A4 — deleting the source
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: ignore `REMOVED` in `engine::watch`'s action mapping. Expected failure: this
/// test times out.
#[test]
fn deleting_the_source_signals_change() {
    let _guard = serial_guard();
    let dir = scratch_dir("a4");
    let path = plain_file(&dir, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    std::fs::remove_file(&path).expect("delete the source");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A5 — a sibling change signals nothing, and a later source write does
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: make `engine::watch`'s name comparison match any name (never filter).
/// Expected failure: `assert_no_signal_soon` after the sibling-only write fails — a signal arrives
/// for the sibling, which must never happen.
#[test]
fn a_sibling_change_signals_nothing_and_a_later_source_write_does() {
    let _guard = serial_guard();
    let dir = scratch_dir("a5");
    let path = plain_file(&dir, "source.dat", b"body");
    let sibling = plain_file(&dir, "sibling.dat", b"sibling body");
    let (watch, rx) = arm_watching(&path);

    // The sibling changes; the source does not. Nothing must arrive.
    std::fs::write(&sibling, b"sibling body, changed").expect("write sibling");
    assert_no_signal_soon(&rx);

    // Now the source changes, and this is the first (and only) signal this watch ever delivers.
    std::fs::remove_file(&path).expect("remove the source");
    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A6 (H3) — a forced overflow signals coverage lost
// -------------------------------------------------------------------------------------------

/// **Empirical, per §0's H3 discriminator** — forces the OS's own notification buffer past its
/// limit with a tight burst of unrelated directory churn (never sleeping between iterations), and
/// asserts the adapter reports `CoverageLost` rather than silently losing events. `cause` is
/// asserted to name what happened (a 0-byte completion or a non-abort error), matching H3's own
/// two named shapes.
///
/// RECORDED MUTATION: treat a 0-byte completion as no event (re-issue and keep waiting) in
/// `engine::watch`'s completion handling. Expected failure: this test times out — the one shape
/// H3 predicts most often on this hardware is silently swallowed instead of reported.
// Raw Win32 declarations, not `windows-sys` (§5's invalidator: no crate added for this file). Two
// calls only: find this process's own watch thread by the name `engine::watch` gives it, and
// suspend it for a bounded window — the only reliable way found (two throughput-based attempts,
// tried and discarded below this comment's own doc) to force a real backlog past
// `WATCH_BUFFER_BYTES`, because Windows boosts an overlapped-I/O-waiting thread's scheduling
// priority on completion specifically to prevent the starvation a raw CPU-priority fight would
// otherwise need.
#[allow(non_snake_case)]
mod raw_win32 {
    pub const TH32CS_SNAPTHREAD: u32 = 0x0000_0004;
    pub const THREAD_SUSPEND_RESUME: u32 = 0x0002;
    pub const THREAD_QUERY_LIMITED_INFORMATION: u32 = 0x0800;

    #[repr(C)]
    pub struct THREADENTRY32 {
        pub dwSize: u32,
        pub cntUsage: u32,
        pub th32ThreadID: u32,
        pub th32OwnerProcessID: u32,
        pub tpBasePri: i32,
        pub tpDeltaPri: i32,
        pub dwFlags: u32,
    }

    #[link(name = "kernel32")]
    extern "system" {
        pub fn CreateToolhelp32Snapshot(flags: u32, pid: u32) -> isize;
        pub fn Thread32First(snapshot: isize, entry: *mut THREADENTRY32) -> i32;
        pub fn Thread32Next(snapshot: isize, entry: *mut THREADENTRY32) -> i32;
        pub fn OpenThread(access: u32, inherit_handle: i32, thread_id: u32) -> isize;
        pub fn SuspendThread(thread: isize) -> u32;
        pub fn ResumeThread(thread: isize) -> u32;
        pub fn CloseHandle(handle: isize) -> i32;
        pub fn GetCurrentProcessId() -> u32;
        pub fn GetThreadDescription(thread: isize, description: *mut *mut u16) -> i32;
        pub fn LocalFree(mem: *mut u16) -> *mut u16;
    }

    /// Find every thread in this process whose description contains `needle`, and suspend each —
    /// returns their thread IDs so the caller can resume by the same list. `unsafe` because it is
    /// raw FFI over Win32 handles; every handle opened here is closed before returning.
    pub fn suspend_threads_named(needle: &str) -> Vec<u32> {
        let mut suspended = Vec::new();
        unsafe {
            let pid = GetCurrentProcessId();
            let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);
            assert!(snapshot != -1isize, "CreateToolhelp32Snapshot failed");
            let mut entry: THREADENTRY32 = std::mem::zeroed();
            entry.dwSize = std::mem::size_of::<THREADENTRY32>() as u32;
            let mut ok = Thread32First(snapshot, &mut entry);
            while ok != 0 {
                if entry.th32OwnerProcessID == pid {
                    let access = THREAD_SUSPEND_RESUME | THREAD_QUERY_LIMITED_INFORMATION;
                    let h = OpenThread(access, 0, entry.th32ThreadID);
                    if h != 0 {
                        let mut desc_ptr: *mut u16 = std::ptr::null_mut();
                        let hr = GetThreadDescription(h, &mut desc_ptr);
                        if hr >= 0 && !desc_ptr.is_null() {
                            let len = (0..).take_while(|&i| *desc_ptr.add(i) != 0).count();
                            let slice = std::slice::from_raw_parts(desc_ptr, len);
                            let desc = String::from_utf16_lossy(slice);
                            LocalFree(desc_ptr);
                            if desc.contains(needle) {
                                SuspendThread(h);
                                suspended.push(entry.th32ThreadID);
                            }
                        }
                        CloseHandle(h);
                    }
                }
                ok = Thread32Next(snapshot, &mut entry);
            }
            CloseHandle(snapshot);
        }
        suspended
    }

    pub fn resume_thread_id(tid: u32) {
        unsafe {
            let access = THREAD_SUSPEND_RESUME;
            let h = OpenThread(access, 0, tid);
            if h != 0 {
                ResumeThread(h);
                CloseHandle(h);
            }
        }
    }
}

/// **Two throughput-based attempts, tried and discarded before this one.** A single-thread tight
/// rename-toggle burst (10 rounds of 5 000) and a 64-thread rename-toggle burst both completed with
/// **zero** signals in 10 s; a 64-thread pure-mtime-touch burst issued 529 655 touches in 10 s with
/// **still zero** signals — this adapter's re-issue loop drains far faster than any of these could
/// generate volume, on this hardware. What actually forces the condition: suspending the real watch
/// thread (found by the name `engine::watch::arm` gives it) for a bounded window, then flooding the
/// directory while it cannot drain at all.
///
/// RECORDED MUTATION: treat a 0-byte completion as no event (re-issue and keep waiting) in
/// `engine::watch`'s completion handling. Expected failure: this test times out — the shape H3
/// predicts on this hardware (a 0-byte success) is silently swallowed instead of reported.
#[test]
fn a_forced_overflow_signals_coverage_lost() {
    let _guard = serial_guard();
    let dir = scratch_dir("a6");
    let path = plain_file(&dir, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    let suspended = raw_win32::suspend_threads_named("spatial-source-watch");
    assert!(!suspended.is_empty(), "could not find the watch thread to suspend by name");

    // Flood while the watch thread cannot run at all — no scheduler boost can rescue it.
    for i in 0..2_000 {
        let f = dir.join(format!("flood-{i}.dat"));
        let _ = std::fs::write(&f, b"x");
        let _ = std::fs::remove_file(&f);
    }

    for tid in suspended {
        raw_win32::resume_thread_id(tid);
    }

    let signal = recv_signal(&rx);
    match &signal {
        WatchSignal::CoverageLost { cause } => {
            assert!(!cause.is_empty(), "the cause must name what happened");
        }
        WatchSignal::Change { .. } => {
            // The source's own name never appeared in the flood, so a `Change` here would mean the
            // adapter matched the wrong name — a distinct defect, worth failing loudly on.
            panic!("expected CoverageLost from the forced overflow, got a Change signal instead");
        }
    }
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A7 — a differently-cased name renamed over the source
// -------------------------------------------------------------------------------------------

/// **Observational only — the isolating proof of case-fold matching is
/// `engine::watch::windows_watch::tests::names_match_folds_case`, not this test.** Verified
/// empirically (debug prints, run and discarded) before writing this comment: a case-only
/// self-rename delivers `RENAMED_OLD_NAME` on `"source.dat"` (this watch's own exact stored
/// spelling — a byte-exact match regardless of any fold logic) immediately before
/// `RENAMED_NEW_NAME` on `"SOURCE.DAT"` (the fold-dependent one), and "at most one signal per
/// handle" means the first (byte-exact) record is the one this test can ever observe. Structural,
/// not a gap in this test alone: every real rename-based scenario that could produce a
/// fold-dependent match is preceded by a same-handle record naming the file's own current
/// (already-matching) spelling — confirmed for A3's scenario too (that test's own corrected
/// comment). Kept here because it still proves the real end-to-end path end to end (case (b));
/// dropping the fold from `names_match` does **not** make this test fail — the unit test below
/// does.
///
/// RECORDED MUTATION: none isolates `a7_a_differently_cased_name_renamed_over_the_source_signals_change`
/// on its own — by the structural reason above, dropping the fold from `names_match` leaves this
/// test passing unchanged (confirmed above). The isolating mutation is recorded on
/// `names_match_folds_case` below instead, which is where it belongs.
#[test]
fn a_differently_cased_name_renamed_over_the_source_signals_change() {
    let _guard = serial_guard();
    let dir = scratch_dir("a7");
    let path = plain_file(&dir, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    // NTFS is case-insensitive but case-preserving: renaming a file to a different-case spelling
    // of its own name is a real, permitted rename, not a no-op.
    let recased = dir.join("SOURCE.DAT");
    std::fs::rename(&path, &recased).expect("case-only rename");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A8 (H1) — renaming the watched directory succeeds and signals, via G
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: skip arming G (return early from `engine::watch::arm` after step 4).
/// Expected failure: this test times out — H1 predicts P's own handle sees nothing when P itself
/// is renamed, so only G's watch can ever catch this, and dropping it leaves nothing to.
#[test]
fn renaming_the_watched_directory_succeeds_and_signals_change() {
    let _guard = serial_guard();
    let dir = scratch_dir("a8"); // G
    let parent = dir.join("watched-parent"); // P
    std::fs::create_dir(&parent).expect("create P");
    let path = plain_file(&parent, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    let renamed = dir.join("watched-parent-renamed");
    std::fs::rename(&parent, &renamed).expect("rename the watched directory itself");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change (via G), got {signal:?}");
    drop(watch);
}

// -------------------------------------------------------------------------------------------
// A9 (H4) — deleting the watched directory succeeds and signals
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: open P without `FILE_SHARE_DELETE` in `engine::watch::open_directory`.
/// Expected failure: `remove_dir_all` fails with a sharing violation instead of succeeding — this
/// test's own `.expect("remove the watched directory")` panics.
#[test]
fn deleting_the_watched_directory_succeeds_and_signals() {
    let _guard = serial_guard();
    let dir = scratch_dir("a9");
    let parent = dir.join("watched-parent");
    std::fs::create_dir(&parent).expect("create P");
    let path = plain_file(&parent, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    // Succeeds despite this watch's own open handles on P (and the source), because every one of
    // them was opened with FILE_SHARE_DELETE (block-on-sight 16; A12 exercises the same fact
    // without ever removing anything).
    std::fs::remove_dir_all(&parent).expect("remove the watched directory");

    // A signal arrives — either P's own handle (from the file's removal inside it) or G's (from
    // P's own removal); either satisfies H4.
    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");

    // The directory is gone only after the watch itself releases the handle(s) it still holds —
    // Windows keeps a share-delete-marked directory alive in the namespace until the last handle
    // closes.
    drop(watch);
    assert!(!parent.exists(), "the directory must be fully gone once the watch releases it");
}

// -------------------------------------------------------------------------------------------
// A10 — a source reached through a junction is watched at its final path
// -------------------------------------------------------------------------------------------

/// **Corrected construction, empirically driven (debug runs, discarded, before writing this
/// comment).** A first attempt watched a junctioned path one level shallow and wrote to the real
/// target's own file: `CreateFileW` (via `open_directory`) reparse-follows a junction
/// transparently by default (no `FILE_FLAG_OPEN_REPARSE_POINT` is ever requested), so a plain
/// content write reached the watch identically whether `arm` canonicalized first or not — that
/// construction could not discriminate the mutation it claimed to (the same class of finding as
/// A3's and A7's own corrected comments). What canonicalization actually changes is **which
/// directory `arm` computes as the grandparent, G** (round 17 item 2 / addition 5): the junction's
/// own parent differs from the real target's real parent whenever the junction sits at a different
/// depth, so this test nests the junction one level deeper than the real target and asserts on a
/// rename of the **real** grandparent — the one case a resolved-vs-unresolved parent computation
/// actually disagrees on.
///
/// RECORDED MUTATION: skip `std::fs::canonicalize` in `engine::watch::arm` (watch `path` exactly
/// as given). Expected/observed failure: this test times out — G is armed on the junction's own
/// parent (`dir/layer`) instead of the real target's real parent (`dir`), so renaming `dir` is
/// never seen.
#[test]
fn a_source_reached_through_a_junction_is_watched_at_its_final_path() {
    let _guard = serial_guard();
    let dir = scratch_dir("a10");
    let real_dir = dir.join("real-target");
    std::fs::create_dir(&real_dir).expect("create the real target directory");
    let path = plain_file(&real_dir, "source.dat", b"body");

    let layer = dir.join("layer");
    std::fs::create_dir(&layer).expect("create the extra nesting level");
    let junction_dir = layer.join("via-junction");
    let status = std::process::Command::new("cmd")
        .args(["/C", "mklink", "/J"])
        .arg(&junction_dir)
        .arg(&real_dir)
        .status();
    let status = match status {
        Ok(s) => s,
        Err(e) => panic!("could not run mklink: {e}"),
    };
    assert!(status.success(), "mklink /J must succeed to run this test");
    let junctioned_path = junction_dir.join("source.dat");

    let (watch, rx) = arm_watching(&junctioned_path);

    // Renaming P itself — `real_dir`, the real target directory. With `path` canonicalized, G is
    // exactly `dir` (real_dir's real parent), which observes this rename as a `DIR_NAME` change on
    // `real_dir`'s own entry (H1: P's own handle never sees this, only G's). Through the
    // unresolved junction path, G would instead be `dir/layer`, which never sees anything happen
    // inside `dir` at all.
    let renamed_p = dir.join("real-target-renamed");
    std::fs::rename(&real_dir, &renamed_p).expect("rename P itself");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change (via the real G), got {signal:?}");
    drop(watch);
    let _ = path; // kept for readability of the setup; not read again after arming.
}

// -------------------------------------------------------------------------------------------
// A11 — an unwatchable parent directory arms checks-only with its reason
// -------------------------------------------------------------------------------------------

/// **Deviation from the preregistration's named mechanism, recorded here rather than silently.**
/// §4's own table names "icacls deny under a timeout" for this case. Verified empirically before
/// writing this test (two standalone probes, run and discarded): in this worker's execution
/// sandbox, an explicit `icacls /deny <user>:(RX)` — and even `/inheritance:d` followed by a hard
/// `(N)` no-access ACE — has **no effect** on this process's own ability to list the directory;
/// `std::fs::read_dir` still succeeds either way. Rather than write a test that cannot force its
/// own precondition in this environment (and would therefore either pass vacuously or fail to
/// build the fixture), this uses a **kernel sharing-mode conflict** instead: opening `P` from this
/// test with `share_mode(0)` (deny every other opener's access, including
/// `FILE_LIST_DIRECTORY`) forces `open_directory`'s own `CreateFile` call to fail with a real,
/// deterministic OS error — a mechanism no privilege or sandbox policy bypasses, because it is not
/// a security-descriptor check at all. It exercises the exact same code path §4's own mutation
/// targets (`open_directory`'s `Err` arm, `ArmOutcome::ChecksOnly`); only the OS error's *cause*
/// differs from a permissions denial. `FILE_LIST_DIRECTORY` (`1`) and `FILE_FLAG_BACKUP_SEMANTICS`
/// (`0x0200_0000`) are the same stable Win32 ABI constants `engine::watch::open_directory` itself
/// uses (`windows-sys 0.61.2`'s own values) — written here as plain integers so this test needs no
/// `windows-sys` dev-dependency of its own (no crate added for this file, per §5's invalidator).
///
/// RECORDED MUTATION: return `ArmOutcome::Watching` unconditionally from `engine::watch::arm`
/// (ignore `open_directory`'s error). Expected failure: `arm_checks_only`'s own panic on an
/// unexpected `Watching` outcome.
#[test]
fn an_unlistable_directory_arms_checks_only_with_its_reason() {
    let _guard = serial_guard();
    const FILE_LIST_DIRECTORY: u32 = 1;
    const FILE_FLAG_BACKUP_SEMANTICS: u32 = 0x0200_0000;

    let dir = scratch_dir("a11");
    let path = plain_file(&dir, "source.dat", b"body");

    use std::os::windows::fs::OpenOptionsExt;
    let _locking_handle = std::fs::OpenOptions::new()
        .access_mode(FILE_LIST_DIRECTORY)
        .share_mode(0)
        .custom_flags(FILE_FLAG_BACKUP_SEMANTICS)
        .open(&dir)
        .expect("exclusively open the parent directory to force a sharing conflict");

    let reason = arm_checks_only(&path);
    assert!(!reason.is_empty(), "the reason must name the OS error");
}

// -------------------------------------------------------------------------------------------
// A12 — a disarmed watch delivers nothing and releases the directory
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: map every completion error to `CoverageLost` unconditionally (drop the
/// `disarming` check) in `engine::watch::watch_thread`. Expected failure: `assert_no_signal_soon`
/// fails — `Drop`'s own `CancelIoEx` produces exactly the completion this test must see nothing
/// from.
#[test]
fn a_disarmed_watch_delivers_nothing_and_releases_the_directory() {
    let _guard = serial_guard();
    let dir = scratch_dir("a12");
    let path = plain_file(&dir, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    drop(watch);
    assert_no_signal_soon(&rx);

    // The directory is fully released: renaming it (which needs no open handle from this
    // process's watch to succeed, but would have failed under A9's own mutation) proves it.
    // `remove_dir_all` first: a stale target from an earlier run of this test must not make a
    // correct run fail on "directory not empty".
    let renamed = dir.with_file_name("a12-renamed-after-disarm");
    let _ = std::fs::remove_dir_all(&renamed);
    std::fs::rename(&dir, &renamed).expect("the directory must be freely renamable once disarmed");
}

// -------------------------------------------------------------------------------------------
// A13 (H5) — a modification-time touch signals change
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: drop `LAST_WRITE` from `engine::watch`'s parent filter constant. Expected
/// failure: this test times out — a bare mtime touch (no byte written) generates no other flag's
/// event.
#[test]
fn a_modification_time_touch_signals_change() {
    let _guard = serial_guard();
    let dir = scratch_dir("a13");
    let path = plain_file(&dir, "source.dat", b"body");
    let (watch, rx) = arm_watching(&path);

    let later = std::time::SystemTime::now() + Duration::from_secs(120);
    std::fs::File::options()
        .write(true)
        .open(&path)
        .expect("reopen to touch mtime")
        .set_modified(later)
        .expect("touch mtime");

    let signal = recv_signal(&rx);
    assert!(is_change(&signal), "expected Change, got {signal:?}");
    drop(watch);
}
