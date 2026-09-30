# Windows-first, portable by construction — the standing constraint and a bounded plan (2026-09-30)

*Fable, 2026-09-30, on the human's request of the same date. The custodian files this under `state/directives/` with the human's covering line. It adds one standing rule, one mechanical check and one next piece. It reopens no accepted work, and it does not make earlier declared platform limitations blocking. Every repository fact below was checked at main 716cc0e.*

**The principle:** shared semantics, explicit platform implementations, continuously tested portability, honestly scoped support.

## 1. Verified current state

### 1a. Codex's four findings, checked

| Finding | Verified | What it is |
|---|---|---|
| Product CI is Windows-only | **True.** `product-ci-rust.yml`, `product-ci-shell.yml` and `tauri-build.yml` run on `windows-latest` only. The viewer and governance workflows run on `ubuntu-latest`, and the `adr-003-spike-ci-{linux,macos}` workflows cover only the archived renderer spike. | An actual gap. |
| The watcher is Windows-only, with a checks-only fallback | **True and declared.** `engine/src/watch.rs`: off Windows, `arm` returns `ChecksOnly` naming the platform; KNOWN-LIMITATIONS 24 states it. | An explicitly reduced behaviour, correctly recorded. Not blocking. |
| LOD storage and free space are Windows-specific | **True and declared.** The tier root reads `%LOCALAPPDATA%` only (a typed refusal, `engine.lod_tier_root_unresolved`, elsewhere), and `free_bytes_available` returns `None` off Windows, so the preflight fails closed. `engine/LOD-PREREGISTRATION.md` Amendment 8(a) records both as owed with docs/07's macOS/Linux gates. No product path calls the tier builder yet, which is why KNOWN-LIMITATIONS does not list it. | A declared, deferred implementation. Not blocking. |
| macOS/Linux renderer validation is outstanding | **True.** The docs/07 gate is open by name; `MACOS-BRINGUP.md` is paused; KNOWN-LIMITATIONS 1 says so. | An actual gap. |

### 1b. Stale documentation

- **`product-ci-rust.yml`'s runner comment** says nothing has established that the suite passes on Linux. That is stale since #140 (W2-D): on Linux, `cargo test --workspace` gave 742 passed, 0 failed, 54 ignored (the 40 already ignored before that change, plus the 14 LOD-tier tests now ignored off Windows with a stated reason). That is cloud evidence, not CI, but the comment's premise no longer holds.
- Nothing else found stale. KNOWN-LIMITATIONS 1 and 24, `product-ci-shell.yml`'s note that `src-tauri` on Linux "has never been validated", and CLAUDE.md's hardware-gate wording are all accurate.

### 1c. Gaps Codex did not list

1. **Two application-directory resolvers that disagree.** The audit log (`kernel/src/permission/audit/log.rs`, `data_dir`) uses `%LOCALAPPDATA%`, else `XDG_DATA_HOME`, else `~/.local/share`, which is not the macOS convention. The LOD tier root (`engine/src/lod.rs`) uses `%LOCALAPPDATA%` only. One concern, two implementations, two platform behaviours.
2. **Case sensitivity is keyed on the OS, not the filesystem.** Audit normalization (`normalize.rs`, `component_eq`) and the audit-log containment check (`log.rs`) compare case-insensitively on Windows only. macOS's default APFS volume is case-insensitive too, so on macOS a destination typed with different case than the profile path may escape the `<user-home>` redaction. **This is a candidate, from reading code; it has not been observed on a Mac.**
3. **The Tauri shell is outside the Cargo workspace**, so the W2-D Linux evidence does not cover it. `frontends/shell/src-tauri` has never compiled off Windows, and `tauri.conf.json`'s bundle targets are `nsis` only.
4. **Already done well, kept as the pattern:** publish's OS error classes (`kernel/src/publish/error.rs`, explicit per-platform errno tables) and `finalize`'s declared POSIX rename semantics.
5. **The shell has no keyboard shortcuts yet**, so nothing to fix; the migration introduces them (§5).

## 2. The standing rule

**R1. Shared semantics never depend on the OS by accident.** Spatial semantics, precision, identity, permissions, cancellation, redaction and result guarantees are the same on every platform. Where a platform cannot provide one, it refuses by name or states a different grade. It never silently weakens.

**R2. OS mechanisms live behind small, named boundaries.** Today's boundaries:

| Boundary | Where | Today |
|---|---|---|
| File watching | `engine/src/watch.rs` | Windows supported; macOS and Linux explicitly reduced (checks-only) |
| Application directories | `kernel/src/permission/audit/log.rs` and `engine/src/lod.rs` (two resolvers; see 1c-1) | Windows supported; others as 1c-1 |
| Free space | `engine/src/lod.rs` (`free_bytes_available`) | Windows supported; others unavailable (fails closed) |
| OS error classification | `kernel/src/publish/error.rs` | All three supported |
| Filesystem case policy | `kernel/src/permission/audit/normalize.rs`, `log.rs` | Keyed on OS (see 1c-2) |
| Protected capture (Prepare) | not built (B2) | §4 |
| Native integration and packaging | `frontends/shell/src-tauri`, `tauri.conf.json` | Windows only |

`#[cfg(windows)]`, `#[cfg(unix)]` or `#[cfg(target_os = …)]` in product code outside these files is accidental coupling unless the architect adds the file as a boundary. Test code may use `cfg_attr(not(windows), ignore = "<reason naming the boundary>")`.

**R3. Every new or materially changed OS-dependent feature states, in its existing preregistration:**
- its owning boundary;
- its behaviour on Windows, macOS and Linux, each as **supported**, **explicitly reduced** (what is reduced, and how the user or client sees it) or **unavailable** (the typed refusal);
- its tests per platform, and any deferred implementation with where it is recorded.

User-visible reductions go into KNOWN-LIMITATIONS as today. There is no separate platform register.

**R4. Reviews block new coupling and false guarantees, not declared limitations.** A gate fails a piece that adds OS-conditional code outside a boundary, puts a Windows assumption into shared logic (a drive letter, a backslash, `LOCALAPPDATA`, an OS-keyed case rule), states no behaviour for a platform, or makes a platform green by broad exclusion. A limitation that is already declared, such as the watcher's checks-only mode or the LOD tiers' refusal, is not a finding.

**R5. Three claim levels, never implied upward.**
- **L1** — compiles, and passes the portable correctness tests.
- **L2** — runs through the platform's real webview and desktop integration (an application smoke test).
- **L3** — meets the hardware-dependent rendering, precision and performance gates (docs/07, docs/08).

A green result at one level says nothing about the next. KNOWN-LIMITATIONS 1 carries each platform's current level, and nothing else does.

**R6. Skipped tests are named gaps.** A test ignored on a platform names its boundary in the ignore reason. Each CI run prints the platform's ignored list. A new platform ignore needs its reason and its deferral record; a whole module excluded by `cfg` to make a platform pass is a finding under R4.

## 3. Continuous portability evidence: the smallest progression

| Step | Adds | Level | Needs approval |
|---|---|---|---|
| PORT-1 | `ubuntu-latest` in `product-ci-rust.yml`'s matrix; the boundary check (§6); the stale comment fixed; KNOWN-LIMITATIONS 1 gains per-platform levels | Linux L1 (workspace) | Runner minutes (see §7) |
| PORT-2 | `macos-latest` in the same matrix; one application-directory boundary replacing the two resolvers (native locations, no new dependency); a test pinning the case policy on a case-insensitive volume | macOS L1 (workspace) | Runner minutes |
| PORT-3 | `frontends/shell/src-tauri` checked and tested on Linux and macOS in `product-ci-shell.yml` (Linux needs WebKitGTK system packages in the runner) | L1 (shell) | CI system packages |
| PORT-4 | Unsigned `tauri build` on Linux and macOS as a package check; a Linux application smoke test under a virtual display; the macOS smoke by hand on the human's MacBook (`MACOS-BRINGUP.md`, resumed) | L2 | Support profiles; Linux machine or VM |
| — | docs/07's measured hardware gates | L3 | Deferred (§8) |

Each step is its own piece, with its own preregistration, and none starts before the previous one is green.

## 4. Prepare before B2: the coherent-acquisition guarantee, defined without the OS

The accepted Save/Prepare direction (2026-09-18) already calls the protected-handle capture "one prospective Windows implementation". This section keeps it from becoming a universal promise by swapping API calls.

**The guarantee.** A prepared artifact is *coherently acquired* when all four hold:
- **A1, one instant:** its bytes equal the source file's bytes at a single instant.
- **A2, no writer at that instant:** no process had the file open for writing, so the instant is not the middle of someone's rewrite. A1 alone can capture a torn file that was never a version its writer produced.
- **A3, structurally valid:** it parses as a complete file of its format (for GeoParquet: the footer, schema and metadata validate). This is necessary but not sufficient, and never proves A1 or A2.
- **A4, installed immutable:** it is installed atomically into content-addressed storage, and its hash is computed from the same bytes that were installed.

A copy plus a hash establishes A3 at best, plus A4. It is never described as coherent acquisition.

**Candidate mechanisms, each to be probed in B2's P0, none assumed:**

| Platform and filesystem | Candidate | What it could establish |
|---|---|---|
| Windows, local NTFS or ReFS | Open without write sharing, read through the same handle, keep it until validation ends | A1 and A2: the sharing check refuses the open while a writer holds the file, and refuses writers while it is held. This is mandatory exclusion, not an advisory lock. |
| Windows, network shares | Same | Only if the probe shows the server enforces sharing |
| Linux, local | A read lease (`fcntl F_SETLEASE`), which is granted only when no writer has the file open and is broken when one opens it | A1 and A2 while the lease holds, with an abort on a break. Conditions: the caller owns the file (or holds `CAP_LEASE`), and the filesystem is local. |
| Linux, reflink filesystems (Btrfs, XFS) | A clone (`FICLONE`) | A1 only |
| macOS, APFS | A clone (`clonefile`) | A1 only. macOS has no mandatory exclusion, and `flock` is advisory, so it is **not** equivalent to the Windows mechanism. |
| Any, when the change attribute is unchanged across the read | A before-and-after check | Detection with a declared gap (for example writers through shared memory maps), never exclusion |

**The rule for B2.**
- Where A1–A4 are established, Prepare records the coherent guarantee.
- Where only A1, A3 and A4 hold, Prepare records a **different, lower grade** that names the missing property. It is never labelled coherent. Whether a lower grade may satisfy publish-from-recipe or replay is the human's call at B2's sighting.
- Where A1 cannot be established, Prepare refuses by name (for example `prepare.coherent_acquisition_unavailable`, naming the platform and filesystem).
- B2 claims only what its P0 has probed. Until macOS and Linux are probed, Prepare there is unavailable with that refusal, and Save (the reference recipe) is portable as it is.

This is a design check for B2's preregistration. It authorises no snapshot subsystem now.

## 5. Portability in the shell migration

- **Shortcuts and menus:** the action registry defines shortcuts with a platform-neutral modifier (Ctrl on Windows and Linux, Cmd on macOS), and native menus are generated from the registry (macOS has an application menu; the others do not).
- **Paths:** the frontend never parses or builds a filesystem path. Paths are opaque values from the backend or a dialog, displayed as the backend renders them. No backslash, drive-letter or case logic in TypeScript.
- **Accessibility:** semantic HTML and ARIA, keyboard-complete. Each platform's screen reader (Narrator, VoiceOver, Orca) is checked at L2, not assumed from one.
- **Display scaling:** canvas sizing follows the device pixel ratio; a 2x display is checked in the macOS smoke.
- **Webview differences** (WebView2, WKWebView, WebKitGTK): WebGL2, fonts, scrolling, IME and drag-and-drop are handled in the shell's adapters, never in spatial logic.
- **Early real-app smoke:** after the migration's first merged milestone, run the real app on macOS (the MacBook) and on Linux, and record the findings as L2 evidence. Native integration is discovered then, not at release.

## 6. The next piece: PORT-1

**Scope:**
1. Add `ubuntu-latest` to `product-ci-rust.yml`'s matrix. The job name carries its level (for example "L1 portable correctness · ubuntu-latest"). Each run prints its ignored list.
2. A governance check (in the existing governance workflow): list every `cfg(windows)`, `cfg(unix)`, `cfg(not(windows))` and `cfg(target_os …)` in product source (not tests), and fail when one sits outside the boundary files in §2's table. The allowlist lives in the check itself and grows only by an architect-reviewed change.
3. Correct `product-ci-rust.yml`'s stale runner comment (§1b).
4. KNOWN-LIMITATIONS 1 gains each platform's level: Windows L1, L2 and the L3 gates as today; Linux L1 (workspace) once the job is green; macOS none yet.
5. The preregistration template gains R3's three items as a conditional section for OS-dependent pieces. No new document.

**Acceptance:**
- The Linux job is green: 0 failed. Every entry in its ignored list is accounted for: either ignored on every platform, as on Windows, or ignored off Windows with a reason naming its boundary (today, the 14 LOD-tier tests). None is unexplained.
- The Windows job is unchanged: `--list` and `--list --ignored` are identical before and after.
- The boundary check passes on main, and fails on a planted `#[cfg(windows)]` in a shared engine module (the mutation, recorded).
- KNOWN-LIMITATIONS 1 claims Linux L1 for the workspace only: not the shell, not L2, not L3.
- No new dependency. Gating: the reviewer, plus the architect for the template change.

## 7. Decisions for the human

1. **Runner minutes.** PORT-1 adds a Linux job to every product push; PORT-2 adds macOS. Standard GitHub-hosted runners have been free for public repositories, but check Settings → Billing before relying on it. Recommended: approve PORT-1 now, PORT-2 after PORT-1 is green.
2. **Support profiles to target.** Recommended: Windows 10/11 x64 (the reference, unchanged); macOS 14 or later on Apple Silicon for CI, plus the 2019 Intel MacBook for L2 and L3; Linux, Ubuntu 24.04 x64 with WebKitGTK 4.1. Other distributions and architectures are not claimed.
3. **CI system packages** for the Linux shell build (PORT-3): WebKitGTK and its build dependencies, installed in the runner only. They are not product dependencies, but they change what CI installs.
4. **A Linux machine or VM** for the L2 smoke. A VM is enough for L2; L3 needs real hardware and is deferred.
5. **Where the coherent-acquisition guarantee lives.** Recommended: a short Proposed ADR drafted with B2's preregistration, since publish-from-recipe, CLI replay and editing's base revision will all cite it. The alternative is B2's preregistration alone, promoted later.

## 8. Deliberately deferred

- L3 on macOS and Linux (docs/07's measured gates).
- A native watcher on macOS (FSEvents) and Linux (inotify); checks-only stays, as declared.
- The LOD tier root and free space off Windows (owed with docs/07's gates; `statvfs` would be a dependency decision then).
- Prepare off Windows until B2's P0 probes a mechanism (§4).
- Signing, notarization and distribution packages for macOS and Linux.
- Native menus beyond what the registry generates.
