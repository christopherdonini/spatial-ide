# N1 — files: containment, atomic replace, torn tails, cross-file consistency, racy mtime (Round 1)

Track `n1-files`. Problem: ADR-036 (Proposed, PR #190, branch `pr190`) and what piece 1c (`b2-piece-1c-save-and-reopen`) must build: the resolver for `project-relative` locators, the project-file and lineage-file writes, and (with 1b) the session history's crash recovery. Acceptance of ADR-036 is due before 1c merges, so §§1–3 of the findings below are written as **text points for the ADR**, not just for 1c's code.

Sibling track `n1-model` (`notes/n1-model.md`) already covers the project file's model, identity across copy and move, collapse keys, Godot/KiCad/QGIS/VS Code as *models*. This track covers only on-disk mechanics. The QGIS and VS Code repos are re-read here for different files (save path, not model).

Nothing here was built or run. "Inference" marks every claim not read directly in code or a vendor document.

---

## 1. Spatial IDE facts relied on (all at `pr190` = `14acee0` unless marked)

| # | Fact | Where |
|---|---|---|
| F1 | ADR-036 binds nothing until accepted; acceptance due before 1c merges | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3 @ 14acee0b` |
| F2 | Project = folder: `<project file>` + `.spatial/lineage.jsonl`; "Nothing else in the folder belongs to the format" | ADR-036:15-26 |
| F3 | Bounded readers refuse rather than truncate; a project file "arrives from another person as often as from this machine" | ADR-036:37 |
| F4 | Canonical form: not empty, no leading `/`, no empty/`.`/`..` segment, no `\`, no `:`; claims "each path inside the folder has one spelling on every operating system" | ADR-036:70 |
| F5 | Containment: resolver resolves folder and target "following every symbolic link, junction and other reparse point", opens only if resolved path lies inside; refuses device names (`NUL`) and names Windows rewrites (trailing dot/space); "Its form states how the target that is checked is the target that is opened" | ADR-036:77-81 |
| F6 | `observed` = size, `modified_ns` (or `not-reported`), footer length, footer sha256; same-size same-mtime data-page edit not detected | ADR-036:83-86; `engine/src/descriptor.rs:4-25 @ 14acee0b` |
| F7 | Lineage written whole at Save "by writing a new file in the folder and renaming it over the old one"; 1c states how a reader detects project/lineage from different saves | ADR-036:148 |
| F8 | Damaged lineage "refused by name, never cut back to its last good line" | ADR-036:153 |
| F9 | Session history: "a final line without its LF is a torn write. Recovery keeps every complete line and names the torn one." | ADR-036:158 |
| F10 | mtime resolution differs across filesystems → fails closed | ADR-036:183 (Consequences) |
| F11 | 1c owes: carrying rule; resolver containment; "state how the target checked is the target opened; tests for a link out, and on Windows a junction out, a device name and a trailing dot or space"; OPEN for the human: data inside the folder with no canonical spelling | `PLAN.yaml:4434-4449 @ 14acee0b` |
| F12 | 1b owes the session history "safe against a crash" | `PLAN.yaml:4417-4433 @ 14acee0b` |
| F13 | Canonical-form check is text-only: `at.contains(['\\', ':'])` or a segment in `""`, `"."`, `".."` | `kernel/src/dataset_ref.rs:530-541 @ 14acee0b` (bounds `:44-45`) |
| F14 | The engine reads data **by path**: DuckDB `read_parquet(?)` with a path parameter; descriptor `std::fs::metadata(path)` and `File::open(path)`; LOD tiering opens a `File` and hands the handle to `ParquetRecordBatchReaderBuilder::try_new(file)` | `engine/src/stream.rs:1431 @ 4561f3b8, :1788`; `engine/src/descriptor.rs:103 @ 14acee0b, :122`; `engine/src/lod.rs:1360-1362 @ 4561f3b8` |
| F15 | Existing path-resolution style is canonicalize-then-compare (TOCTOU acknowledged): `resolve_destination` canonicalizes the parent; `Staging::finalize` checks `destination.exists()` then `std::fs::rename`, "The residual race is declared rather than closed" | `kernel/src/permission/grant.rs:194-214 @ 4561f3b8`; `kernel/src/publish/mod.rs:1605-1616 @ 4561f3b8` |
| F16 | `engine::watch::arm` canonicalizes, "resolves junctions and symlinks in every component" | `engine/src/watch.rs:604-605 @ 4561f3b8` |
| F17 | Bundle writes: `write_all` then `flush` then `sync_all` (FlushFileBuffers on Windows) per partition | `kernel/src/publish/mod.rs:1511-1515 @ 4561f3b8, :1573` |
| F18 | Audit log is JSONL, appended, `sync_all` per record; "an interleaved line fails to parse and is visible as corrupt" | `kernel/src/permission/audit/log.rs:39-49 @ 4561f3b8, :225-229` |
| F19 | Bundle-relative path validator already refuses control characters (canonical form does not) | `kernel/src/publish/viewer_assets.rs:179-226 @ 4561f3b8` |
| F20 | `MoveFileExW` replace-existing observed to emit REMOVED, RENAMED_OLD_NAME, RENAMED_NEW_NAME | `engine/tests/source_watch_adapter.rs:183-206 @ 4561f3b8` |
| F21 | `std::fs::canonicalize` on Windows yields `\\?\C:\...` | `engine/tests/session_identity.rs:293-297 @ 4561f3b8` |
| F22 | Precedent for adding `windows-sys` *features* without a new crate (`Win32_Storage_FileSystem`, `Win32_System_IO`) | `engine/Cargo.toml:63-78 @ 4561f3b8` |
| F23 | Lockfile has `windows-sys` 0.52.0/0.59.0/0.61.2, `rustix` 0.38.44/1.1.4, `libc`, `rand` 0.9.5/0.10.2; **no** `cap-std`, `cap-primitives`, `tempfile`, `same-file`, `nix` | `Cargo.lock:1623 @ 14acee0b, :1636, :2433, :2442, :2451` |
| F24 | `tempfile 3.27.0` is in the **shell's** lockfile only | `frontends/shell/src-tauri/Cargo.lock:4768 @ 4561f3b8` |
| F25 | "No new dependency. If a form finds one necessary, that is a question for the human before any code." | `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:25 @ 4561f3b8` |
| F26 | Reference machine: Windows 10 Pro 22H2 (build 19045) | `CLAUDE.md:28 @ 4561f3b8` |

---

## 2. The sweep

| Project | Kept / dropped | Why |
|---|---|---|
| bytecodealliance/cap-std (cap-primitives) `b7acf8e` | **KEPT, dossier** | Handle-relative component walk on Windows/macOS/Linux; openat2 on Linux; device-name refusal; Windows CI |
| golang/go `os.Root` `3b98edd` | **KEPT, dossier** | Second independent implementation; OBJ_DONT_REPARSE; escape-bug history 2025–2026 |
| rust-lang/rust std `42cfc04` | **KEPT, dossier** | `fs::rename` = MoveFileExW; CVE-2022-21658 fix; unstable `fs::Dir` |
| git/git `6de20f6` | **KEPT, dossier** | mingw_rename retry; lockfile; racy-git; NTFS alias rules; GPL-2.0-only → concepts only |
| chromium/chromium base/files `8fe23318` | **KEPT, dossier** | ImportantFileWriter: flush, ReplaceFile, field-measured retries |
| microsoft/vscode `d3d31f6` | KEPT, short | Atomic write and 60 s Windows rename retry |
| Stebalien/tempfile `1c294cc` | KEPT, short | `persist` = MoveFileExW; documents no sync |
| andreacorbellini/rust-atomic-write-file `e1ee3a5` | KEPT, short | Unix dir-fsync sequence; QEMU crash tests; Windows is plain `fs::rename` |
| untitaker/rust-atomicwrites `a15afcb` | KEPT, short | MOVEFILE_WRITE_THROUGH misuse |
| google/leveldb `7ee830d` | **KEPT, dossier (Q3/Q4)** | Torn tail rules; CURRENT pointer |
| facebook/rocksdb `dec6799` | KEPT, short | WALRecoveryMode semantics; predecessor-WAL check |
| sqlite/sqlite `74675a9` | KEPT, short | WAL salts and checksums; SAFE_APPEND; Windows AV retry list |
| etcd-io/etcd `f061acd` | KEPT, short | Zero-sector torn-entry detector |
| rust-lang/cargo `33f504c`, ninja-build/ninja `4e4df1e`, facebook/watchman `038eee6` | KEPT, short (Q5) | mtime rules |
| qgis/QGIS `fa8f961` | KEPT, counter-example | `.qgz` delete-then-rename from system temp; `.qgs` truncate in place |
| blender/blender `fbe76d9` | KEPT, short | `file@` temp in same dir then MoveFileExW |
| libuv/libuv `eb497c5` | KEPT, evidence | Node `fs.rename` on Windows = MoveFileExW(REPLACE_EXISTING) |
| duckdb/duckdb `f2f9329` | KEPT, evidence | How the consumer opens the target (share modes) |
| louischatriot/nedb `35be491` | KEPT, short | JSONL datastore: skips dir fsync on Windows; tolerates 10 % corrupt lines |
| tauri-apps/plugins-workspace `8489575` | KEPT, counter-example | fs scope = path check then path use |
| cyphar/libpathrs `3abe8bb` | WATCH | Linux-only (`lib.rs:86`), RESOLVE_IN_ROOT semantics, MPL/LGPL |
| cyphar/filepath-securejoin `9e667ca` | dropped (counter-example) | Its own docs: legacy `SecureJoin` "**not** safe against race conditions" (`doc.go`) |
| rbtcollins/fs_at `8443962` | WATCH | Windows/Unix *at calls, no containment, last commit 2025-08, no LICENSE file in repo (Cargo.toml says Apache-2.0) |
| XAMPPRocky/remove_dir_all `386e1f5` | dropped | Only its Cargo.toml read (uses fs_at); std now carries the fix |
| `openat2` crate | dropped | Linux-only, last release 2021-06 (crates.io) |
| Qt `QSaveFile`, npm `write-file-atomic`, Java `Files.move(ATOMIC_MOVE)`, Python `os.replace` | dropped, not inspected | Time spent on the Rust-reachable and Windows-relevant ones; none is reachable from the kernel. Unverified what each does on Windows |
| KiCad, Godot | dropped | Model questions covered by `n1-model` |

---

## 3. Dossiers

### 3.1 cap-std / cap-primitives (bytecodealliance/cap-std `b7acf8e`, v4.0.3, 2026-08-20)

**Licence.** `Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT`, from `COPYRIGHT:1-4`, `LICENSE-APACHE`, `LICENSE-MIT`, `LICENSE-Apache-2.0_WITH_LLVM-exception`, `cap-primitives/Cargo.toml` (`license = ...`). Permissive (green, notices owed). Dependency licences from crates.io: `winx` is `Apache-2.0 WITH LLVM-exception` only; `maybe-owned` is MIT OR Apache-2.0; the rest of the cap family is the triple licence. `ipnet` not checked.

**Activity and quality.** Tags up to `v4.0.3` (2026-08-20). CI runs `cargo test` on `windows-latest`, `windows-2022`, `macos-latest`, `macos-14`, Ubuntu, FreeBSD and musl (`.github/workflows/main.yml:199-274,279-356`). There is a fuzzer (`fuzz/`), and a `racy_asserts` cfg cross-checks each sandboxed open against an unsandboxed one (`cap-primitives/src/fs/open.rs:13-80`). `unsafe` occurs 18 times in `cap-primitives/src`. cap-primitives is 11,443 lines of Rust; the Windows part is 2,153 and `fs/manually` is 829. Production user per the README: the WASI implementation in Wasmtime (`README.md:132`). Security policy is in `SECURITY.md`.

**Why it matters.** It is the only mature Rust library that answers ADR-036 §5's "the target that is checked is the target that is opened". It does this by construction: it never checks a path and then opens a path.

**How it works**
- Entry point: `open(start: &File, path, options)` (`fs/open.rs:13`). Linux first tries `openat2(start, path, RESOLVE_BENEATH | RESOLVE_NO_MAGICLINKS)`, retries `EAGAIN` four times ("fails with EAGAIN if a rename happens anywhere on the host"), maps `EXDEV` to escape, and falls back on `ENOSYS`/`EPERM` (`rustix/linux/fs/open_impl.rs:52-132`). FreeBSD uses `O_RESOLVE_BENEATH`. macOS and Windows always use the manual walk (`rustix/fs/mod.rs:42-60`; `windows/fs/open_impl.rs:29`).
- Manual walk: `fs/manually/open.rs`. The path is split into a component stack. Each `Normal` component is opened **relative to the current directory handle** with `FollowSymlinks::No` (`:228-235`). `..` pops a **stack of held parent handles**, so "even if the directory is concurrently moved, we don't have to worry about `..` leaving the sandbox" (`:190-206`). An empty stack means `escape_attempt()` (`:202`). A symlink's target is read and its components pushed back onto the stack (`:297-365`). Any `Prefix`/`RootDir` component, which covers an absolute path or an absolute link target, is an escape (`:415`; `cow_component.rs:5-29`). Expansions are capped (`read_link_one.rs:27-29`). On Windows, `..` is resolved lexically before any lookup, as Windows does (`:81-95`).
- Windows open: `CreateFileAtW` wraps `NtCreateFile` with `OBJECT_ATTRIBUTES.RootDirectory = dir` (`windows/fs/create_file_at_w.rs:77-200`). No-follow is `FILE_FLAG_OPEN_REPARSE_POINT` (`windows/fs/oflags.rs:16-27`). After opening, `handle_open_result` checks the handle's metadata for a symlink (`windows/fs/open_unchecked.rs:154-205`). Directory handles are opened **without `FILE_SHARE_DELETE`** "so that directories can't be renamed or deleted underneath us" (`windows/fs/dir_utils.rs:61-72`). The test `tests/windows-open.rs:118-120` asserts that rename and remove of an open directory fail.
- Device names: the final component's stem, with trailing whitespace trimmed and uppercased, is matched against CON, PRN, AUX, NUL, COM0–9, COM¹²³, LPT0–9 and LPT¹²³, and gets `ERROR_FILE_NOT_FOUND` (`windows/fs/open_impl.rs:12-27`). The test covers suffixes `"", " ", ".", ". ", ".ext", ".ext. ", ".ext.more ."` and others (`tests/windows-open.rs:129-176`). CONIN$ and CONOUT$ are not in the list.
- Escape error: `PermissionDenied`, "a path led outside of the filesystem" (`fs/errors.rs:9-14`).

**What it actually guarantees on Windows, from the code**
- Containment of the opened handle against `..`, absolute paths, and **absolute** link targets. Every Windows junction is absolute (see 3.3), so every junction below the root is refused, **including one that points back inside the folder**. A relative symlink that stays inside is followed.
- Directories on the walk are pinned against rename and delete while their handles are held. The final file is pinned only if the caller sets `share_mode` without `FILE_SHARE_DELETE` (`OpenOptionsExt`). This is inference from `oflags.rs:28-46`: the caller's share mode is passed through.
- Wart: the Windows symlink target is read **by path** (`windows/fs/read_link_unchecked.rs:7-14` via `get_path.rs:28-31`: `GetFinalPathNameByHandle` + join + `fs::read_link`), not from the handle. Go reads it from the handle (3.2). A link swapped in that window can only redirect to a target that is still walked under the same rules, so containment holds (inference).
- Trailing dot and space: NT-relative opens do not apply Win32 name normalisation, so `x.parquet.` is a literal name to cap-std (inference from NT semantics; cap-std has no trailing-dot or space rule beyond device stems).
- History: GHSA-hp8f-xmx4-4qrg, a trailing slash disabled `O_NOFOLLOW`, fixed 2026-08-20 (`a8c9321`: "When a path has a trailing slash, the path component just before the trailing slash is not considered a final path component for the purposes of the OS `O_NOFOLLOW` flag"). `3d4542c` (2024-12-03) fixed device names with multi-dot extensions.

**As a dependency.** `cap_std::fs::Dir::open_ambient_dir(folder)` then `dir.open_with(at, opts)` gives a contained `std::fs::File` on all three OSes. Cost (crates.io metadata; not resolved, no cargo run): cap-std, cap-primitives, ambient-authority, fs-set-times, io-extras, io-lifetimes, ipnet (only used by its network `Pool`), maybe-owned and winx, plus rustix-linux-procfs on Linux. Their windows-sys ranges (`>=0.60,<0.62`; winx `<=0.59`; fs-set-times `<0.60`; io-extras `<=0.60`) may add another windows-sys minor version. About 9 new crates.

**As a port.** The algorithm in `fs/manually/open.rs` and the Windows `NtCreateFile`-with-`RootDirectory` mechanics are what 1c needs. If the human chooses "refuse every link below the root" (option B, §4.1), the Windows part shrinks to roughly 150–250 lines on `windows-sys`, which is already in the lock. It would need the `Wdk_Storage_FileSystem` and `Wdk_Foundation` features, under the F22 precedent. The Unix part would be roughly 60 lines on `rustix` 1.1.4 or `libc`, both already in the lock. These line counts are estimates.

**Do not reuse.** cap-std's absolute-path fallback in `open_unchecked.rs:57-116` (re-rooting via `CreateFileW` when `..` pops past the start). It is unsandboxed by design and the manual layer never reaches it. Also not its `ipnet` and network `Pool`.

**Licence implications.** Permissive, so it can be ported into the AGPL core with notices.

**Reuse mode: PORT.** If the human prefers a dependency, the alternative is ADOPT.

**Avoided work.** Large: correctly handling `..`, link loops, Windows trailing-slash, `.` and `..` quirks, and the escape bugs others have already paid for.

**Recommendation.** Piece 1c ports the walk's semantics, not the crate, for one operation: open one regular file read-only beneath the folder handle. It adopts cap-std's and Go's test tables as the 1c test list. Raising the cap-std-as-dependency option to the human costs about 9 crates and is worth it only if a second confined operation appears.

**Timing.** Now (ADR text) and before `b2-piece-1c-save-and-reopen` (code).

### 3.2 Go `os.Root` (golang/go `3b98edd`, 2026-10-07; Go 1.24+)

**Licence.** BSD-3-Clause (`LICENSE:1-8`). Permissive.

**Why it matters.** It is an independent second implementation with the same model as cap-std, and on Windows it uses the strongest primitive.

**How it works**
- Path model: `splitPathInRoot` refuses a leading separator, which is escape (`src/os/root.go:301-353`). The doc says symlinks are followed but "may not reference a location outside the root. Symbolic links must not be absolute" (`root.go:41-43`). Root "do[es] not prohibit traversal of filesystem boundaries, Linux bind mounts, /proc special files, or access to Unix device files" (`:45-46`). On Windows, reserved device names are refused (`:56-57`).
- Walk: `doInRoot` (`root_openat.go:340-500`). `..` **restarts from the root fd** rather than using `openat(dir, "..")`, "because dir may have moved since we opened it" (`:362-407`). Steps and restarts are bounded at 255 and 8 (`:368-369`). The symlink limit is 8 (`root.go:76`).
- Windows: `rootCleanPath` runs `GetFullPathName` on `\\?\?\` + path to mirror Windows' lexical cleaning, rejects `?`, and requires `filepathlite.IsLocal` (`root_windows.go:20-78`). `IsLocal` rejects `:` anywhere and reserved names (`internal/filepathlite/path_windows.go:23-53`). `isReservedName` cuts at `.` or `:`, trims trailing spaces, matches CON, PRN, AUX, NUL, COM1–9, LPT1–9, ¹²³, **CONIN$ and CONOUT$**, and for names with extensions defers to `RtlIsDosDeviceName_U` because "Since Windows 11, reserved names with extensions are no longer reserved" (`:98-160`).
- Windows open: `openat` adds `O_NOFOLLOW_ANY`, which becomes **`OBJ_DONT_REPARSE`** on `NtCreateFile` with `RootDirectory = dirfd` (`internal/syscall/windows/at_windows.go:109-162`; `OBJ_DONT_REPARSE = 0x1000`, `types_windows.go:142`). Any reparse point gives `STATUS_REPARSE_POINT_ENCOUNTERED`, which becomes `ELOOP` (`:264-265`). Root then reads the link from a **handle** opened with `FILE_OPEN_REPARSE_POINT` and `FSCTL_GET_REPARSE_POINT` (`root_windows.go:146-187`; `file_windows.go:476-500`). Reparse tags other than symlink and mount point return `ENOENT` from the reader (`file_windows.go:495-498`), so the original `ELOOP` stands.
- Fallback (commit `59ea07ba`, 2026-09-07, issue 78131): "Windows 10 build 10240 rejects NtCreateFile calls using OBJ_DONT_REPARSE with STATUS_INVALID_PARAMETER". It retries single components with `FILE_OPEN_REPARSE_POINT` and inspects the handle's attributes (`at_windows.go:193-254`).
- Rename inside a root: `NtSetInformationFile(FileRenameInformationEx, REPLACE_IF_EXISTS | POSIX_SEMANTICS, RootDirectory = newdirfd)`, falling back to `FileRenameInformation` (`at_windows.go:439-510`).
- Share mode: always `FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE` (`:156`), so Go does not pin.

**Escape history.** Each entry is a commit message read in the clone after deepening history:
- `92e23b68` (2025-04-16): escape via paths ending in `../`.
- `adcad7be` (2025-05-13): CVE-2025-0913, Windows followed symlinks on `O_CREATE|O_EXCL`.
- `657ed934` (2026-02-26): escape via `ReadDir`/`Readdir` lstat TOCTOU.
- `82215dc6` (2026-05-26): "a significant mechanism by which operations in a Root can escape". `openat(parent, "f/", O_NOFOLLOW)` follows `f`. This is the same class as cap-std's 2026-08 GHSA.

**What to reuse.** The test table `rootTestCases` (`src/os/root_test.go:187-385`) covers absolute symlink, relative symlink escaping, symlink chain escapes, dotdot before and after symlink, symlink cycle, and so on. Also: the reserved-name function including CONIN$/CONOUT$ and `RtlIsDosDeviceName_U`; restart-from-root for `..`; the OBJ_DONT_REPARSE fallback; and reading reparse data from the handle.

**Do not reuse.** Go cannot be a dependency of a Rust kernel.

**Licence implications.** BSD-3 permits a port with notice.

**Reuse mode: CONCEPTUAL DONOR.** Its tests are ported as 1c tests.

**Avoided work.** Moderate.

**Recommendation.** Use Go's escape-bug list as a regression list. ADR-036's canonical form already forbids empty segments (so no trailing slash) and `.`/`..` segments, which removes the input classes behind 92e23b68, 82215dc6 and cap-std's GHSA for the **locator text**. Link **targets** read from disk are not in canonical form, which is one reason to prefer option B (§4.1).

**Timing.** Now.

### 3.3 Rust std (rust-lang/rust `42cfc04`)

**Licence.** MIT OR Apache-2.0 (`LICENSE-MIT`, `LICENSE-APACHE`, `COPYRIGHT`). Already the toolchain.

- **`fs::rename` on Windows** is `MoveFileExW(old, new, MOVEFILE_REPLACE_EXISTING)`. On `ERROR_ACCESS_DENIED` only, it opens `old` with `DELETE` and `FILE_FLAG_OPEN_REPARSE_POINT | FILE_FLAG_BACKUP_SEMANTICS` and calls `SetFileInformationByHandle(FileRenameInfoEx, FILE_RENAME_FLAG_REPLACE_IF_EXISTS | FILE_RENAME_FLAG_POSIX_SEMANTICS)` (`library/std/src/sys/fs/windows.rs:1306-1375`). There is no `MOVEFILE_WRITE_THROUGH` and no retry. The documentation says: "`MoveFileExW` with a fallback to `SetFileInformationByHandle` … On Windows 10 version 1607 and above, the behavior is the same as Unix if the filesystem supports `FileRenameInfoEx`" (`library/std/src/fs.rs:3094-3107`).
- **`File::sync_all`** is `FlushFileBuffers` on Windows (`windows.rs:385-387`) and `fcntl(F_FULLFSYNC)` on Apple, `fsync` elsewhere (`sys/fs/unix.rs:1243-1255`).
- **CVE-2022-21658 fix** (`sys/fs/windows/remove_dir_all.rs:1-30,70-80`): "the low-level `NtOpenFile` API to open a file relative to a parent directory", with `FILE_OPEN_REPARSE_POINT`. On Unix, `openat(parent, name, O_NOFOLLOW | O_DIRECTORY)` (`sys/fs/unix.rs:2433-2510`). This is the same primitive cap-std and Go use, in std itself.
- **Unstable `fs::Dir`** (feature `dirfd`, issue 120426; `fs.rs:166-196`) opens and renames relative to a handle (`sys/fs/windows/dir.rs`: `FileRenameInfo` with `RootDirectory`, flags REPLACE_IF_EXISTS|POSIX). It is **not a sandbox**: an absolute path falls through to `File::open` (`dir.rs:80-83`) and `..` is not checked. It is unstable, so it cannot be used on stable.
- **Junction target** (`windows.rs:708-757`): `IO_REPARSE_TAG_MOUNT_POINT` is always `relative = false`, so a junction's target is always absolute. This is the basis for "every junction is refused" under cap-std or Go semantics.
- **`canonicalize`** is `GetFinalPathNameByHandleW(VOLUME_NAME_DOS)` with a drive-letter fallback (`windows.rs:1580-1660`).
- Stable `MetadataExt::{volume_serial_number, file_index}` are **unstable** (`windows_by_handle`, `os/windows/fs.rs:780-799`). File identity on Windows needs windows-sys `GetFileInformationByHandle`.

**Reuse mode: ADOPT.** `std::fs::rename` and `File::sync_all` are the replace primitives (§4.2); no new crate.

**Timing.** Now.

### 3.4 git (git/git `6de20f6`)

**Licence.** GPL-2.0-**only** (`COPYING`: "the only valid version of the GPL as far as this project is concerned is _this_ particular version"). This is **flagged as likely incompatible** with AGPL-3.0-or-later, so concepts only and no code.

- **Lockfile and tempfile.** `commit_lock_file` → `rename_tempfile`, which is close then `rename` (`lockfile.c:352-366`; `tempfile.c:335-357`). There is no directory fsync on commit. Hardening is opt-in per component via `fsync_component` (`write-or-die.c:58-90`). The default is "`core.fsync=committed,-loose-object`, which has good performance, but risks losing recent work in the event of an unclean system shutdown" (`Documentation/config/core.adoc:678-681`). macOS uses `F_FULLFSYNC` (`wrapper.c:665-677`).
- **`mingw_rename`** (`compat/mingw.c:2527-2650`):
  - It first tries `SetFileInformationByHandle(FileRenameInfoEx, REPLACE_IF_EXISTS | POSIX_SEMANTICS)` on a `DELETE` handle opened with `FILE_FLAG_OPEN_REPARSE_POINT`. On `ERROR_INVALID_PARAMETER`, `ERROR_NOT_SUPPORTED` or `ERROR_INVALID_FUNCTION` it falls back to `MoveFileExW(REPLACE_EXISTING | COPY_ALLOWED)`.
  - On `ERROR_SHARING_VIOLATION` or `ERROR_ACCESS_DENIED` (`is_file_in_use_error`, `:164-173`) it clears a read-only attribute and **retries with delays {0, 1, 10, 20, 40} ms**, then asks the user y/n (`retry_ask_yes_no`, `:243-263`).
  - The comment reads: "other applications may not set FILE_SHARE_DELETE. So we have to retry." (`:2608-2613`).
- **NTFS alias defence.** `is_ntfs_dotgit` treats `.git` followed by any run of **spaces and periods**, or `git~1`, as `.git` on every platform (`path.c:1415-1449`; `is_ntfs_dot_generic`, `:1451-1500`). This is the text-level answer to Windows name rewriting.
- **Racy git and Unicode:** see §3.9 and §4.1.

**Reuse mode: CONCEPTUAL DONOR.** **Timing:** now.

### 3.5 Chromium `ImportantFileWriter` (chromium/chromium `8fe23318`, base/files)

**Licence.** BSD-3-Clause (`LICENSE`).

- **Sequence** (`important_file_writer.cc:336-385`): write a temp file in the same directory, then `File::Flush`. On Windows that is `FlushFileBuffers`, with the comment "On Windows 8 and above, FlushFileBuffers is guaranteed to flush the storage device's internal buffers" (`file_win.cc:505-514`). On Linux it is `fdatasync` and on Apple `F_BARRIERFSYNC` (`file_posix.cc:674-690`).
- **Close as late as possible.** It closes late "with other software that may open the temp file (e.g., an A/V scanner doing its job without oplocks)" and boosts thread priority (`:349-354`).
- **Retries.** It retries the replace `kReplaceRetries = 5` times at `kReplacePauseInterval = 100 ms` (`:51-52,60,356-371`; crbug 1099284), and records retry histograms to UMA, so the A/V race is measured in the field.
- **`ReplaceFile`.** It calls `::ReplaceFile(to, from, backup, REPLACEFILE_IGNORE_MERGE_ERRORS)` (`file_util_win.cc:586-610`). It then needs about 40 lines to recover from `ERROR_UNABLE_TO_MOVE_REPLACEMENT_2`, in which "`to_path` file is lost" (`:621-670`).
- **Microsoft's `ReplaceFileW` page** (fetched): it preserves the replaced file's creation time, short name, object ID, DACLs, encryption, compression and named streams. "The resulting file has the same file ID as the replacement file." It makes no atomicity claim. For `ERROR_UNABLE_TO_MOVE_REPLACEMENT_2`: "The file to be replaced still exists with a different name."
- **Microsoft's `MoveFileExW` page** (fetched): no atomicity claim. `MOVEFILE_WRITE_THROUGH` "guarantees that a move performed as a copy and delete operation is flushed to disk", which is about cross-volume moves only.

**Reuse mode: CONCEPTUAL DONOR.** Take the flush-before-replace step, the bounded retry and the counting of retries. **Do not** take `ReplaceFileW`: its failure mode can leave no file at the destination name, whereas a failed `MoveFileExW` or `FileRenameInfoEx` leaves the old file in place.

### 3.6 LevelDB / RocksDB (google/leveldb `7ee830d`, BSD-3-Clause; facebook/rocksdb `dec6799`, GPL-2.0 OR Apache-2.0 per `README.md:29`)

- **Record framing.** Records carry `crc32c(type, data)`, a length and a type. Type 0 is "reserved for preallocated files" (`doc/log_format.md`; `db/log_format.h:15-16`).
- **Reader at EOF** (`db/log_reader.cc:189-270`):
  - A truncated header at EOF is "caused by the writer crashing in the middle of writing the header … just report EOF".
  - A length past EOF means "assume the writer died in the middle of writing the record. Don't report a corruption."
  - Zero-type, zero-length records are skipped (mmap preallocation).
  - A CRC mismatch drops the rest of the buffer "since 'length' itself may have been corrupted".
- **`SetCurrentFile`.** It writes the manifest's name into `CURRENT` through temp + sync + rename (`db/filename.cc:123-139`), with a directory sync for manifests (`util/env_posix.cc:375`) and `F_FULLFSYNC` on Apple (`:397-411`). This **pointer switch** makes a multi-file state change commit at one rename.
- **RocksDB `WALRecoveryMode`** (`include/rocksdb/options.h:412-449`):
  - `kTolerateCorruptedTailRecords`: "tolerate the last record … incomplete … Zeroed bytes from preallocation are also tolerated."
  - `kPointInTimeRecovery` is the **default** (`:1503-1504`): "stop the WAL playback on discovering WAL inconsistency … Ideal for systems that have disk controller cache like hard disk, SSD without super capacitor."
- **RocksDB predecessor-WAL check.** Each WAL records its predecessor's number, last sequence number and size, and a mismatch is reported by name (`db/log_reader.cc:355-410`).

**Reuse mode: CONCEPTUAL DONOR** (Q3 recovery semantics and Q4 pointer/link).

---

## 4. Findings by question

### 4.1 Containment without a check-then-open race (Q1)

**(a) The ADR's mechanism is the racy one.** "Resolve the folder and the target, following every link, open only if the resolved path lies inside" (F5) is canonicalize-then-compare, which is what `filepath-securejoin`'s own docs call "**not** safe against race conditions" (`doc.go`). Tauri's fs plugin does exactly this (`plugins/fs/src/commands.rs:1593-1640`: `read_link`, `canonicalize`, glob match, then later path use). Every mature race-free design (cap-std, Go `os.Root`, std's CVE-2022-21658 fix, libpathrs) inverts it:
1. open the folder as a **handle**;
2. open each segment **relative to the previous handle without following links** (`NtCreateFile` with `RootDirectory` and `FILE_OPEN_REPARSE_POINT`/`OBJ_DONT_REPARSE` on Windows; `openat(O_NOFOLLOW)` on POSIX; `openat2(RESOLVE_BENEATH)` on Linux ≥ 5.6);
3. treat a link segment by explicit rule;
4. **read through the final handle**.

Then the checked object *is* the opened object by construction.

**(b) Two semantics are available, and the ADR text currently describes neither exactly.**
- **Option A (cap-std and Go):** follow relative links that stay beneath; refuse absolute links. Since every junction is absolute (§3.3), **every junction is refused, including one that points back inside the folder**. The ADR's "resolved path lies inside" would admit an inward absolute link or junction, which neither library supports race-free.
- **Option B (simplest and strictest):** refuse **every** name-surrogate reparse point (symlink, junction) at any segment below the folder, by name. This removes link-target parsing, loop limits and the trailing-slash-in-target bug class (§3.2).

Both satisfy "never outside". **The human chooses.** 1c's test list should add "a junction pointing *inside* the folder" with the chosen outcome.

**(c) The hard part is the consumer, not the resolver.** The engine opens data **by path**: DuckDB `read_parquet(?)` with the path as a parameter (F14), and the descriptor's `metadata(path)` and `File::open(path)`. DuckDB on Windows calls `CreateFileW(path, GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE, …, OPEN_EXISTING)` (`duckdb/src/common/local_file_system.cpp:1239-1285`) and on POSIX `open(path, …)` (`:427`). Any resolver that returns a handle loses its guarantee the moment DuckDB re-resolves the path. 1c's form must state one of these:

1. **Windows, the reference machine: pin, then path-open.** The resolver holds every directory handle and the final file handle **without `FILE_SHARE_DELETE`** while DuckDB reads. cap-std already does this for directories (`dir_utils.rs:61-72`), and its test shows rename and delete of a held directory fail (`tests/windows-open.rs:118-120`). Per Windows sharing rules, DuckDB's open (GENERIC_READ, share READ|WRITE|DELETE) is still compatible, while any rename or delete of a component is refused, so the path DuckDB resolves is the chain the resolver checked. *Inference from documented sharing semantics; not run.* The final-file share mode should be READ|WRITE, because READ alone would refuse a file another application holds open for writing.
2. **Linux: hand DuckDB `/proc/self/fd/N`.** That magic link reopens the exact inode (libpathrs's technique). macOS has no equivalent that is not a `dup` (`/dev/fd/N`); *unverified*.
3. **All OSes, detection backstop.** Add **file identity** (Windows volume serial + file ID via `GetFileInformationByHandle`, already reachable through windows-sys `Win32_Storage_FileSystem`; POSIX `st_dev` + `st_ino`) to the existing in-session pre-check and post-check. If the identity of the resolver's handle differs from a fresh no-follow open after the read, the result is discarded. git's stat compare includes the inode (`statinfo.c:83-89`). This is session-only and is **never persisted** (it is machine-specific; ADR §2's spirit).
4. **Fully handle-based option (park).** Read parquet from the handle with `ParquetRecordBatchReaderBuilder::try_new(file)`, as LOD tiering already does (F14), and give DuckDB an Arrow scan (duckdb-rs has `vtab-arrow`, `crates/duckdb/Cargo.toml:40`). This is a large change with unmeasured cost, so it is not for 1c.

**(d) Device names and Windows rewrites belong in canonical form (text), not in the resolver.** NT-relative opens (cap-std, Go, std) do **not** apply Win32 normalisation, so `NUL` and `x.parquet.` are literal names to them. DuckDB's Win32 `CreateFileW` on the joined path **does** normalise (Win32 path rules; inference), so the handle-walk and DuckDB can disagree on which file a trailing-dot name means. A text rule protects every consumer the same way, on every OS, as git does with `.git` aliases (`path.c:1415-1449`). Proposed additions to ADR-036 §5's canonical form:
- no segment ending in `.` or ` `;
- no segment whose base (cut at the first `.`, trailing spaces trimmed, case-insensitive) is CON, PRN, AUX, NUL, COM0–9, LPT0–9, COM¹²³, LPT¹²³, CONIN$ or CONOUT$ (the union of Go `isReservedBaseName` and cap-std's list);
- no control character (F19 already does this for bundle paths).

Data with such names falls into the **existing** 1c OPEN item ("no canonical spelling": refuse the save, or carry `machine-recorded` alone). That is no new decision, a wider class of the same one.

**(e) "One spelling on every operating system" (F4) is an overclaim.** NTFS and APFS default to case-insensitive. NTFS 8.3 short names alias (`DATA~1`). macOS decomposes Unicode in names, which is why git has `compat/precompose_utf8.c` ("Converts filenames from decomposed unicode into precomposed unicode. Used on MacOS X"). None of these breaks containment, since every alias is in the same directory. They do falsify "one spelling". Suggested wording: "the writer writes one spelling; a reader resolves it on the OS it runs on, and refuses by name a spelling it cannot open." Optionally the writer writes NFC; that is the human's choice.

**(f) Further 1c rules, cheap and on the handle**
- **The target must be a regular file.** Check the open handle (Windows `GetFileType` = DISK and not a directory; POSIX `S_ISREG` after `O_NONBLOCK` open). Go's own doc says Root does not prohibit Unix device files (`root.go:45-46`); a FIFO inside a received project folder would block a plain `open`.
- **The writer is confined too.** If `.spatial` in a received folder is a symlink or junction, Save writes `lineage.jsonl` and its temp file **outside** the folder. The writer should open `.spatial` beneath the folder handle without following links and refuse by name a `.spatial` that is a link or reparse point. Renaming over a project file that is itself a symlink replaces the link, not its target (inference from rename semantics; VS Code refuses atomic write to a symlink, `diskFileSystemProvider.ts:257-273`).
- **The writer self-checks.** After computing `at`, resolve it back through the resolver and compare file identity with the file the user chose before writing the locator (inference; no project found doing this).
- **Root anchor.** Links **above** the folder are followed when opening the folder itself (Go `OpenRoot` "follows symbolic links in the directory name", `root.go:79-81`; cap-std `open_ambient_dir`). This matches the ADR.

**(g) Windows non-link reparse points are the main unknown.** Go treats only symlink and mount-point tags as links (`types_windows.go:154-157`, name-surrogate bit). With `OBJ_DONT_REPARSE`, *any* reparse point fails the open, and Go's reader returns `ENOENT` for other tags, so the open fails with `ELOOP` (inference from `at_windows.go`, `root_windows.go:146-154` and `file_windows.go:495-498`). That would include OneDrive Files-On-Demand placeholders, Data Deduplication files and WOF-compressed files. A search of Go's history under `src/os` for cloud, dedup or placeholder fixes found none. cap-std opens with `FILE_OPEN_REPARSE_POINT` and treats non-surrogate tags as files, so whether reads then hydrate or return placeholder data is *unverified*. **1c must test a project folder under OneDrive on the reference machine before choosing a primitive.** Many Windows 10 installs redirect Documents to OneDrive (inference; not measured).

### 4.2 Atomic replace (Q2)

| Project | Windows call | Flush file | Flush dir | Retry on sharing violation |
|---|---|---|---|---|
| Rust std `fs::rename` | `MoveFileExW(REPLACE_EXISTING)`; on ACCESS_DENIED falls back to `FileRenameInfoEx(REPLACE \| POSIX)` (`windows.rs:1306-1375`) | caller (`sync_all` = FlushFileBuffers) | — | none |
| tempfile 3.27 `persist` | `SetFileAttributesW(NORMAL)` + `MoveFileExW(REPLACE_EXISTING)` (`src/file/imp/windows.rs:92-119`) | **no**: "neither the file contents nor the containing directory are synchronized" (`src/file/mod.rs:174-177`) | no | none |
| atomic-write-file 0.3.1 | `fs::rename` (`src/imp/generic.rs:73-75`); TODO says `MOVEFILE_WRITE_THROUGH` (`src/imp/mod.rs:13-14`) | `sync_all` then rename (`src/lib.rs:607-617`) | Unix: `renameat` + `fsync(dir)` (`src/imp/unix/mod.rs:183-186`); Windows none | none |
| atomicwrites 0.4.4 | `MoveFileExW(WRITE_THROUGH \| REPLACE_EXISTING)` (`src/lib.rs:314-323`) | `sync_all` (`:164`) | Unix: parent `sync_all` (`:200-204`) | none |
| git | `FileRenameInfoEx(REPLACE \| POSIX)` then `MoveFileExW(REPLACE \| COPY_ALLOWED)` (`compat/mingw.c:2541-2620`) | per `core.fsync` | none found | {0,1,10,20,40} ms then ask (`:243-263`) |
| VS Code | Node `fs.rename` = libuv `MoveFileExW(REPLACE_EXISTING)` (`libuv/src/win/fs.c:2340-2347`) | `fdatasync` on close (`diskFileSystemProvider.ts:517-524`) | none | EACCES/EPERM/EBUSY, `min(100, 10·n)` ms up to **60 s** (`src/vs/base/node/pfs.ts:497-563`) |
| Chromium | `ReplaceFileW(IGNORE_MERGE_ERRORS)` + backup recovery | `FlushFileBuffers` | none | 5 × 100 ms, measured (UMA) |
| SQLite (I/O, not rename) | — | — | — | ACCESS_DENIED, SHARING_VIOLATION, LOCK_VIOLATION, …, 10 × linear 25 ms, "probably caused by antivirus software" (`src/os_win.c:1511-1548`) |
| Blender | `file@` in same dir, then `MoveFileExW` via `urename` (`writefile.cc:2018-2156`; `fileops_c.cc:530-545`) | — | — | — |
| NeDB | rename | fsync | **skipped on win32**: "Windows can't fsync (FlushFileBuffers) directories" (`lib/storage.js:54-56`) | — |
| QGIS `.qgz` | **delete target, then rename from `QDir::temp()`** (`src/core/qgsarchive.cpp:68-115`): crash window with no project file, possibly cross-volume | — | — | — |
| QGIS `.qgs` | copy to `file~`, then **truncate in place** and copy (`src/core/project/qgsproject.cpp:3627-3690`) | — | — | — |

**Conclusions for 1c's Save project:**

1. **Temp file in the same directory.** Create it with CREATE_NEW and a random suffix in the same directory (`.spatial/` for the lineage, the folder for the project file), opened beneath the folder handle per §4.1(f).
2. **Write, then flush before the rename.** `write_all`, then `sync_all` (FlushFileBuffers / `F_FULLFSYNC` / `fsync`), then close. Every durable implementation flushes before the rename (Chromium, atomic-write-file, atomicwrites, git when hardened). Without it, a power loss after the rename can leave the new name with empty or zero content. That is the classic ext4 rename-without-fsync case; *inference*, not reproduced.
3. **Replace with `std::fs::rename`.** That is MoveFileExW, with std's own FileRenameInfoEx POSIX-semantics fallback; no new crate. Or call `FileRenameInfoEx` relative to the folder handle (Go `Renameat`, `at_windows.go:439-510`) so the rename cannot be redirected through a swapped `.spatial`. **Not `ReplaceFileW`** (§3.5). **Not `MOVEFILE_WRITE_THROUGH`** as a durability claim: per Microsoft it only concerns copy+delete moves. Neither MoveFileExW nor ReplaceFileW documents atomicity. Every project above *relies* on same-volume rename being all-or-nothing, so the form should say so as a practice relied on, not a guarantee.
4. **Bounded retry.** Retry on `ERROR_SHARING_VIOLATION` and `ERROR_ACCESS_DENIED` with a **declared ceiling** (ADR-010 rule 6 style). Observed ceilings range from about 71 ms (git) through 500 ms (Chromium) to 60 s (VS Code). On final failure, Save fails by name, the old files are intact, and the temp file is removed. 1c should count retries, as Chromium does with UMA, so the number becomes a `docs/08` measurement rather than a guess.
5. **Directory flush.** POSIX: `fsync` the directory after `renameat` (atomic-write-file, atomicwrites, LevelDB). Windows: **no project read flushes a directory**, and NeDB explicitly skips it. Rename durability on NTFS after power loss is therefore relied on but unverified.
6. **Session history append (1b).** Reuse the audit-log pattern (F18): append, then `sync_all` per line. That makes only the last line tearable (§4.3).

### 4.3 Torn-write recovery of append-only logs (Q3)

"A final line without LF is a torn write" (F9) is **necessary, not sufficient.**
- **A line can end in LF and still be torn.** Its middle sectors may be zero. etcd's `isTornEntry` splits a record on 512-byte sector boundaries and calls it torn "if any data for a sector chunk is all 0" (`server/storage/wal/decoder.go:168-205`). LevelDB and RocksDB tolerate "zeroed bytes from preallocation" (§3.6).
- **The size can grow before the data lands.** SQLite assumes this unless a VFS declares `SQLITE_IOCAP_SAFE_APPEND` ("data is appended first then the size of the file is extended, never the other way around", `src/sqlite.h.in:640-650`). Without it, the journal's record count is updated only after a sync (`src/pager.c:4317-4333`). The tail of an unsynced append can therefore be NULs. On NTFS, reads past valid-data-length return zeros, not stale data (*inference*, not verified in code).
- **Without a sync between appends, a middle line can be lost while later lines survive.** RocksDB's default `kPointInTimeRecovery` stops at the first inconsistency for exactly the "disk controller cache … SSD without super capacitor" case (`include/rocksdb/options.h:438-442`). ADR-036's "keeps every complete line" would replay lines **after** a damaged one.
- **Counter-example.** NeDB tolerates up to 10 % unparsable lines (`lib/persistence.js:29,216-243`), which is the lenient policy ADR-036 rightly rejects.

**Proposed ADR-036 §9 text (no format change).** Recovery keeps the **longest prefix** of lines that (i) end in LF, (ii) contain no NUL byte, (iii) parse and validate, and (iv) **chain**: each step's `parent` is the previous kept step's `id`, and a mark's `after` and `to` name a kept step. The first line that fails is named, and nothing after it is replayed. The `parent` member already in the format (ADR-036:107) gives the chain check without a new member. 1b syncs per append (F18), so in practice only the last line can fail.

**Alternative (format change, must land before acceptance).** A per-line check member, as every binary log has (LevelDB crc32c, SQLite cumulative checksum, etcd CRC). This is the human's choice. The chain rule above gets most of the benefit for JSONL without one.

**Lineage file (§8).** It is whole-file, written by rename, so a tear means the flush before rename was skipped. The ADR's "refused by name" (F8) stands. Detection: a missing final LF, a NUL anywhere, a failed parse or chain, or a mismatch with the project file's link (§4.4).

### 4.4 Detecting a project file and a lineage file from different saves (Q4)

The two renames are not atomic as a pair. Hand copies, sync clients and VCS checkouts can also pair files from different saves (inference).

**Prior art**
- **git:** a commit names its tree by hash; the index carries a trailing SHA over its own bytes (`read-cache.c:1712-1741`).
- **LevelDB:** a `CURRENT` pointer switch (`db/filename.cc:123-139`).
- **RocksDB:** predecessor-WAL number, sequence number and size (`db/log_reader.cc:355-410`).
- **SQLite:** per-checkpoint salts copied into every frame, "This prevents old and new frames … being considered valid at the same time" (`src/wal.c:95-97`).
- **QGIS:** acknowledges the two-file gap ("The project has been saved but the latest changes to auxiliary data cannot be recovered", `src/core/project/qgsproject.cpp:4848`). Its single-container `.qgz` is itself saved by delete-then-rename (§4.2).

**Options for the 1c amendment**
- **A, hash link (git-like). Recommended.** The project file carries `lineage: {sha256, steps}` of the lineage it was saved with. Write and replace the lineage **first**, then the project file. A crash between the two renames gives an old project file and a new lineage, which is detected by hash mismatch and named. The cost is one hash over a bounded file; `canonical::sha256_hex` already exists (`renderer/src/canonical.rs:153 @ 4561f3b8`, used at `kernel/src/publish/mod.rs:1578 @ 4561f3b8`).
- **B, save id (SQLite-salt-like).** A 128-bit save id in both the project file and the lineage header. It detects pairing but not content damage, and is cheaper.
- **C, pointer (LevelDB `CURRENT`).** The lineage is written as `.spatial/lineage-<saveid>.jsonl` and the project file names it, so one rename commits. This conflicts with ADR §1's fixed name and "nothing else in the folder", because it leaves orphans.
- **D, single container.** This conflicts with §1, and QGIS shows that a container does not make the save atomic by itself.

**Time-sensitive.** ADR §3's closed key sets mean whichever member A or B adds must be in the version-1 shape accepted with ADR-036, alongside 1c's `workspace` amendment.

### 4.5 mtime resolution and racy change detection (Q5)

- **git** (`Documentation/technical/racy-git.adoc`; `read-cache.c:353-378,2571-2600`):
  - An entry whose mtime is ≥ the index file's own mtime is "racily clean" and is content-compared.
  - On index write, such entries get size smudged to 0 so they never falsely match later.
  - `core.useNanosec` is off by default on Linux "because in-core timestamps can have finer granularity than on-disk timestamps".
  - git also compares ctime, inode, uid, gid and size (`statinfo.c:64-104`).
- **cargo** (`src/compiler/fingerprint/mod.rs:349-360,2204-2222`):
  - "HFS on macOS only supports 1 second timestamps".
  - Docker layer caching zeroes nanoseconds.
  - "the kernel caches the current time between timer ticks, which could mean that if a file is updated at most 10ms after a build starts then Cargo may not pick up the build changes".
  - It uses `path_mtime <= reference_mtime` (fresh on equality), with a TODO (#5918) saying equality should be stale. An unstable `checksum-freshness` mode uses content checksums (`:36-40`).
- **ninja:** dirty iff `output.mtime < most_recent_input.mtime`, plus a build log of the recorded mtime and command hash (`src/graph.cc:222-290`).
- **watchman:** "Using a timestamp is prone to race conditions … Using an abstract clock id insulates the client" (`website/docs/clockspec.md`).

**For ADR-036 `observed`:**
1. The racy case is real and the ADR already declares it (F6). git's remedy would be to record, alongside `observed`, whether the file's mtime was within one resolution tick of the observation time ("racily observed"). The footer sha256 already covers most rewrites by parquet writers, since the footer holds offsets and statistics (inference).
2. Add **file identity** to the *in-session* check, not to the persisted observation (§4.1(c)3). It is machine-specific.
3. Cross-filesystem copies (FAT 2 s, HFS+ 1 s, Docker zeroed ns, SMB server time) will report `mtime` differing while size, footer length and footer hash match. "Fails closed" (F10) holds. Whether to word that case as "probably the same file, copied" is the human's (OPEN-7 wording).

---

## 5. "Do not reinvent" and "worth owning"

**Do not reinvent**
- Spatial IDE should not invent its own containment algorithm (component order, `..` handling, link-count limits, Windows lexical cleaning) because cap-std (Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT) and Go `os.Root` (BSD-3-Clause) already provide tested ones with public escape histories, unless the human picks option B (refuse every link), which needs only the per-segment no-follow open and none of the link resolution.
- Spatial IDE should not write its own reserved-device-name list from memory because Go's `isReservedName`/`isReservedBaseName` (BSD-3-Clause, `internal/filepathlite/path_windows.go:98-160`) and cap-std's list (with tests `tests/windows-open.rs:129-176`) already provide them, unless Windows changes the reserved set again (it did in Windows 11 for names with extensions; Go handles that with `RtlIsDosDeviceName_U`).
- Spatial IDE should not adopt `tempfile`, `atomic-write-file` or `atomicwrites` for the Save path because std's `rename` + `sync_all` already provide the primitives under MIT/Apache, and none of the three adds a Windows flush, a directory flush or a sharing-violation retry, unless a later requirement needs anonymous `O_TMPFILE` on Linux (atomic-write-file's `unnamed-tmpfile`).

**Worth owning (Spatial IDE's code)**
- The resolver for one operation (open one regular file read-only beneath the folder handle), with the pin-or-identity-check bridge to DuckDB's path open. It borrows the semantics and tests from cap-std and Go, and the `NtCreateFile` + `RootDirectory` mechanics from cap-std, Go and std.
- The atomic replace helper, about 60 lines (inference). It borrows FileRenameInfoEx/POSIX plus retry from git and std, flush and measured retries from Chromium, and the Unix dir fsync from atomic-write-file and atomicwrites.
- The session-history recovery rule (longest valid chained prefix). It borrows the semantics from RocksDB `kPointInTimeRecovery`, the zero-sector rule from etcd, and the chain from git and SQLite.

---

## 6. What I could not verify

- Whether `OBJ_DONT_REPARSE` is honoured on build 19045. Go says build 10240 rejects it; the build that introduced it was not found.
- How OneDrive placeholders, Data Deduplication and WOF files behave under `OBJ_DONT_REPARSE` or `FILE_OPEN_REPARSE_POINT` opens. This is the highest-value test for 1c on the reference machine.
- The Windows share-mode pinning argument in §4.1(c)1, including whether `FSCTL_SET_REPARSE_POINT` can convert a held non-empty directory. This is inference from documented semantics, not run.
- Rename durability on NTFS after power loss without a directory flush. No project flushes a directory on Windows; NeDB says it cannot.
- macOS: `O_RESOLVE_BENEATH` (from macOS 15, per a comment in an rsync patch read via WebFetch) and `O_NOFOLLOW_ANY` (macOS 11) are secondhand. Neither cap-std nor Go uses them. `/dev/fd/N` semantics for handing DuckDB a pinned file are also unverified.
- APFS Unicode normalisation behaviour, and NTFS returning zeros past valid-data-length; both are inference.
- Who uses `ReplaceFileW` besides Chromium. Qt `QSaveFile`, npm `write-file-atomic` and Java `ATOMIC_MOVE` were not inspected.
- The dependency closure of cap-std as Cargo would resolve it, including which windows-sys versions it adds. No cargo run, per METHOD rule 1.
- The GitHub issue pages (Go 73080/78131, crbug 1099284, cargo #5918) are blocked to WebFetch. Commit messages in clones were used instead.


## Errata from the independent check (2026-10-08)

- VERIFICATION-A row 2: Go `os.Root` has had **three** Root escape fixes since 2025 (`92e23b68` paths ending in `../`, `657ed934` ReadDir/Readdir, `82215dc6` trailing slash), not four. `adcad7be` (CVE-2025-0913) is a `syscall.Open` / `at_windows.go` bug (O_CREATE|O_EXCL following a dangling symlink), not a Root escape. Refusing absolute link targets is confirmed (`root.go:41-43,305-307`).
- VERIFICATION-A row 3 (confirmation, stated precisely): at Rust `main` `fc2324d`, `fs::rename` on Windows calls `MoveFileExW(MOVEFILE_REPLACE_EXISTING)` first and falls back to `SetFileInformationByHandle` with `FileRenameInfoEx` and POSIX semantics only on `ERROR_ACCESS_DENIED`.
- VERIFICATION-A spot-check: the SQLite `os_win.c` citation range is off by two lines at its end.
