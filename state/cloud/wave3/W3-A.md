# Wave 3, W3-A (one batch: W3-A+W3-B+W3-C): the session's report, the result

**Source:** session_017msPRjkMFYd5Zn4FxukM4r, the final assistant turn (the page's timestamp 2026-09-30T07:54:23Z), after the human's lens authorisation (`state/cloud/wave3/W3-A-lens-authorisation.md`). The session's first report, a stop, is `state/cloud/wave3/W3-A-stop.md`. Copied at 2026-09-30T08:09:04Z (the saved copy's write time) with the message's own Copy action in claude.ai/code, and saved with LF line endings: 167 lines, sha256 51f2ad093796847a646a48c0d5fee98086a54ddb7e8bd16084e5e5dfa9e87283. Everything between the two rules below is the session's text, verbatim. The WAVE3 REPORT proper begins at `# WAVE3 REPORT`, and the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally at triage, after the batch ends, per `state/cloud/wave1-prompts.md` §3, carried into wave 3 by `state/cloud/wave3-prompts.md` §1. The saved text scans clean under the profile-path scanner's `--message` mode.

---

Progress: Rust sweep done; now checking the JS build scripts (buildViewerFirst.mjs, notice.mjs) before writing reproducers for the two Linux-observable candidates.

I've identified three Linux-observable candidates: the audit-log default path issue with empty/relative `XDG_DATA_HOME`, an inert hostname scan without exported `HOSTNAME`, and backslash being rewritten as a separator in audit destinations on POSIX. Now I'll write reproducers for these.

Setting up the branch and DCO hook proof, then compiling the kernel test crate (DuckDB build is slow, so I'll start it in the background).

Hook proof passed (unsigned commit rejected, nothing created). Writing the reproducer file while the kernel test crate compiles.

Still compiling (DuckDB is the long pole). Waiting on the build before running the reproducers.

Four reproducers fail as intended. Running controls now: the hostname child with `HOSTNAME` exported, and the relative `XDG_DATA_HOME` variant run by hand.

Confirmed: exporting HOSTNAME makes the scan pass, and unsetting XDG_DATA_HOME yields an absolute path. I'll note the container's 2-byte hostname in the A3-2 test doc and finish compiling the hit list.

Reproducers are formatted, clippy-clean, and fail as designed. Committing to `cloud/wave3-A` with sign-off and pushing.

Pushed. Pulling exact line numbers for the report.

# WAVE3 REPORT
## Worker fields
Item: A          Lens/purpose: accidental Windows coupling and false platform guarantees, read against `state/directives/PORTABILITY-2026-09-30.md` §1, §2 and §8 (R1–R6)
Baseline SHA: a02354677d6c03aaed4b2dbdf4d14b09621d5766 (confirmed by `git -C /tmp/wave3-baseline rev-parse HEAD`)
Branch: cloud/wave3-A   Commits: 8a2ba65f1f3bda3fc709d4a5d3bc2217890f0139 (one test file, `kernel/tests/wave3_a_portability_audit.rs`; no product source changed)
Environment:
- Linux container, kernel 6.18.44. rustc 1.94.1, cargo 1.94.1, node v22.22.2, npm 10.9.7 (node and npm were not used).
- Network used: crates.io (cargo build), plus git fetch and push to origin.
- As authorised, the lens, PLAN.yaml, KNOWN-LIMITATIONS.md and DECISIONS-PENDING.md were read from the session checkout at 3212bfe, which contains cf86d60. That checkout has no product diff from the baseline.

Commands run (all product reading, building and testing in /tmp/wave3-baseline):
- `git worktree add /tmp/wave3-baseline a023546…`: 0. `git -C /tmp/wave3-baseline rev-parse HEAD`: 0.
- grep/sed inventory of engine/, kernel/, protocol/, renderer/, frontends/: 0.
- `git switch -c cloud/wave3-A`: 0. `git config core.hooksPath .githooks`: 0.
- DCO proof: `git -c user.name=chris -c user.email=chrys92d@gmail.com commit --allow-empty -m "test: dco hook probe (must be rejected)"` exited 1 with "error: commit has no Signed-off-by trailer". No commit was created (HEAD stayed at a023546).
- `cargo test -p spatial-kernel --no-run`: 0.
- `cargo test -p spatial-kernel --test wave3_a_portability_audit`: 101. Four failed, as designed.
- `unshare --uts sh -c 'hostname wave3-probe-host && cargo test -p spatial-kernel --test wave3_a_portability_audit'`: 101. Four failed, as designed.
- Control for A3-2: `SPATIAL_WAVE3_A3_2_CHILD=1 HOSTNAME=wave3-probe-host <test binary> --exact a3_2_…` inside the same namespace: 0 (1 passed).
- Controls for A3-3, each `env -i HOME=/tmp/w3home [XDG_DATA_HOME=…] target/debug/publish-bundle --audit-show`, run from /tmp/w3cwd: 0 for all three runs (XDG_DATA_HOME set to "", set to "relative-data", and unset).
- `rustfmt --edition 2021` on the test file: 0. `cargo clippy -p spatial-kernel --test wave3_a_portability_audit`: 0, no warnings in the file.
- `git … commit -s`: 0. `git push -u origin cloud/wave3-A`: 0.

Findings: 3

### Classified hits

**(1) Declared boundary (§2's table): listed, not findings**
- engine/src/watch.rs:86, 90, 102 (and the Windows-only imports at :107–123 and :198): file-watching boundary.
- engine/src/lod.rs:902 and :931 (`free_bytes_available`): free-space boundary.
- engine/src/lod.rs:1142 (`tier_directory`): application-directories boundary.
- engine/Cargo.toml:61: a `cfg(windows)` dependency on windows-sys, used only by those two files.
- kernel/src/publish/error.rs:396–408: OS error-classification boundary (§1c-4's pattern).
- kernel/src/permission/audit/normalize.rs:177–186 (`component_eq`, cfg at :178 and :182): case-policy boundary (§1c-2).
- kernel/src/permission/audit/normalize.rs:108–134 (`roots_from_environment`: USERPROFILE, HOME, LOCALAPPDATA, APPDATA, TEMP, TMP, TMPDIR): in a boundary file; it reads both platforms' roots.
- kernel/src/permission/audit/log.rs:367 and :371 (`data_dir`'s cfg arms): application-directories boundary (§1c-1).
- kernel/src/permission/audit/log.rs:389 (`is_inside`'s case fold): case-policy boundary (§1c-2).
- frontends/shell/src-tauri/src/origin.rs:172 (`cfg!(windows) || cfg!(target_os = "android")`): native-integration boundary.
- frontends/shell/src-tauri/src/lib.rs:307–309 (app-log directory with a temp_dir fallback): native-integration boundary.
- frontends/shell/src-tauri/tauri.conf.json:27 (`"targets": ["nsis"]`): packaging boundary.

**(2) Declared limitation: listed, not findings**
- engine/src/watch.rs:90–98: `ChecksOnly` off Windows (KNOWN-LIMITATIONS 24; §8).
- engine/src/lod.rs:932–934: `None` off Windows, so the preflight fails closed (LOD-PREREGISTRATION Amendment 8(a); §8).
- engine/src/lod.rs:1143–1150: the `engine.lod_tier_root_unresolved` refusal without LOCALAPPDATA (same records; §8).
- renderer/bundle-viewer/notice.mjs:341: NOTICE text naming the Windows install location "bundle-viewer\NOTICE.txt". Packaging is Windows-only (KNOWN-LIMITATIONS 1), and other platforms' packages are deferred (§8).

**(3) Accidental coupling: findings (all under A-1)**
- kernel/src/permission/audit/normalize.rs:63–72: strips `\\?\` and rewrites `\` to `/` on every OS. **Finding A-1.**
- kernel/src/publish/viewer_assets.rs:120–127: rewrites `\` to `/` in a walked file name on every OS. **Finding A-1.**
- kernel/src/permission/audit/log.rs:387 (`is_inside`): rewrites `\` to `/` on every OS. Same pattern; the consequence is only a false refusal (fail-closed). Listed under A-1.
- kernel/src/bundle/redaction.rs:346–351 (`scan_directory`): rewrites `\` to `/` in the finding's file label. Same pattern; affects the display label only. Listed under A-1.

**(4) False or silently weakened guarantee: findings**
- kernel/src/bundle/redaction.rs:127–133: hostnames are read only from `COMPUTERNAME`/`HOSTNAME`. **Finding A-2.**
- kernel/src/permission/audit/log.rs:373–375: the non-Windows `data_dir` arm takes `XDG_DATA_HOME` verbatim. **Finding A-3.**

**Reviewed and set aside (portable, or Windows syntax that cannot match off Windows; not hits)**
- engine/src/dataset.rs:1497–1498: `\\?\` is stripped before the glob scan. It matches only a path text beginning `\\?\`, which a POSIX path never does in practice.
- kernel/src/bundle/redaction.rs:141–160 and :253–270: the scan looks for every platform's path shapes. Its scope is stated at :15–19.
- kernel/src/publish/mod.rs:787: `replace('\\', "/")` on a path that was already validated to contain no backslash. It has no effect on any OS.
- kernel/src/publish/viewer_assets.rs:165–199 and renderer/bundle-viewer/src/manifest.ts:320: the bundle-path rules, identical on every platform.
- kernel/src/permission/grant.rs:97–106 and redaction.rs:120–125: `USERNAME`/`USER`/`LOGNAME` cover both families.
- kernel/src/publish/mod.rs:1518–1531 (`finalize`): its POSIX rename semantics are declared. §1c-4 confirmed.
- frontends/shell/src (.ts and .tsx): no filesystem path parsing, no platform checks, and no modifier keys. The only key handling is `Enter` (PublishDialog.tsx:205, FilterPanel.tsx:72). §1c-5 confirmed.

**Out of scope (test code, tooling, or not a module): listed for completeness**
- Test modules inside product files: kernel/src/permission/boundary.rs:530 and normalize.rs:284.
- protocol/transport-bakeoff/src/memory.rs:18, 47, 75: excluded from the workspace as ADR-012 decision evidence (Cargo.toml:7–9).
- frontends/shell/e2e/*.mjs: hard-coded `C:\dev\…` fixture paths, and log lookups keyed only on LOCALAPPDATA.
- renderer/bundle-viewer/e2e/zoom-anchor.mjs:113 and scripts/run-acceptance.mjs:63–73: Windows browser and fixture paths.
- frontends/shell/scripts/buildViewerFirst.mjs:36: build tooling with both arms implemented.
- frontends/canvas-probe/scripts/run-probe.mjs:184: records `navigator.userAgent`.

**§1c's two known gaps**
- **1c-1 is confirmed** at log.rs:366–377 and lod.rs:1142–1151. Two corrections:
  - (a) lod.rs reads `LOCALAPPDATA` with no cfg, so its real rule is "wherever LOCALAPPDATA is set", not "Windows only". On Linux or macOS with that variable exported, it would resolve a tier root rather than refuse by name. This is code-path-only; per §1a, no product path reaches it today.
  - (b) Both resolvers accept an empty or relative value. For the audit log that is Finding A-3, which is separate from the two resolvers disagreeing.
- **1c-2 is confirmed** at normalize.rs:177–186 and log.rs:386–392. Two corrections, both code-path-only:
  - (a) The same gap applies on Linux case-insensitive mounts (vfat/exFAT, CIFS, ext4 casefold), not only on macOS. For `is_inside`, the consequence is that a log inside the destination is not refused.
  - (b) On Windows the fold is ASCII-only (`eq_ignore_ascii_case`, `to_ascii_lowercase`), while NTFS also folds non-ASCII letters. So a profile path that differs only in non-ASCII case escapes redaction on Windows too.

### Finding A-1
Claim: On POSIX, shared path-string logic treats `\` as a separator. As a result, the audit log records two different destinations as the same string, and a viewer asset named `a\b.js` is published as `a/b.js` instead of hitting the "contains a backslash" refusal.
Suggested severity: S3
Code path:
- Audit record: `AuditLog::open_for` and the records call `normalize_destination` (normalize.rs:53), which reaches `normalize_with` (normalize.rs:63–72). There the verbatim prefix is stripped and `stripped.replace('\\', "/")` runs, with no cfg.
- Viewer assets: `ViewerAssets::from_dir` builds `rel` at viewer_assets.rs:120–127 with `.replace('\\', "/")`, then `ViewerAssets::new` calls `validate_relative_path` (viewer_assets.rs:189), whose backslash rule never sees the byte.
- The same pattern also appears at log.rs:387 (a false refusal only) and redaction.rs:351 (a label only).
Reproducer: kernel/tests/wave3_a_portability_audit.rs, tests `a3_1a_two_distinct_posix_destinations_do_not_normalize_to_one_audit_string` and `a3_1b_a_viewer_asset_named_with_a_backslash_is_refused_not_renamed`. Command: `cargo test -p spatial-kernel --test wave3_a_portability_audit`. Observed:
- a3_1a: "two distinct destinations are recorded as the same audit string `/tmp/spatial-kernel-wave3-a/a3-1a/maps/a/b`". Both sides were equal, although the two resolved destinations compare unequal.
- a3_1b: "the file `a\b.js` was admitted and renamed; the published paths are ["a/b.js", "index.html"]".
Guarantee violated:
- R1 (identity is the same on every platform) and R4 (a backslash assumption in shared logic).
- normalize.rs module doc: "The destination is the audit's subject, so it is recorded".
- normalize.rs:170–175, which refuses to merge two spellings on Linux because that "would rewrite a path into one that does not exist".
- viewer_assets.rs:189's refusal rule.
Evidence: observed on Linux. macOS takes the same code path but was not observed. Windows is correct, because `\` is a separator there.
False-positive check:
- Searched KNOWN-LIMITATIONS.md, DECISIONS-PENDING.md, PLAN.yaml (port-1 to port-4), the lens, kernel/PERMISSION-BOUNDARY.md (its four declared limits) and the preregistrations for "backslash", "separator" and "normaliz". Nothing declares this.
- §1c names only case and application directories.
Confidence: proven (Linux)

### Finding A-2
Claim: On Linux (and, going by the code, macOS), the redaction scan knows no hostname unless `HOSTNAME` is exported, which the default shells do not do. So the `machine-identifier` class can never reach an audit record's `residual_classes`, while on Windows `COMPUTERNAME` is always present.
Suggested severity: S3
Code path: `MachineIdentifiers::from_environment` (redaction.rs:117) reads only `["COMPUTERNAME", "HOSTNAME"]` (redaction.rs:127–133). `AuditLog::classify` (log.rs:245–251) calls `scan` with those identifiers, and its result becomes `residual_classes` (log.rs:93, 259–271).
Reproducer: kernel/tests/wave3_a_portability_audit.rs, test `a3_2_the_scan_finds_the_machine_hostname_without_an_exported_hostname_variable`. It re-runs itself as a child with `HOSTNAME` removed and checks the hostname from /proc.
- The container's own hostname is `vm`, 2 bytes, which is below the scan's 3-byte floor. The run therefore used a private UTS namespace: `unshare --uts sh -c 'hostname wave3-probe-host && cargo test -p spatial-kernel --test wave3_a_portability_audit'`.
- Observed: "the OS reports a hostname, but from_environment() knows [] and the scan found []".
- Control: the child alone, with `HOSTNAME=wave3-probe-host` exported, passes.
- Separately, in this container `env | grep -c ^HOSTNAME=` returns 0 while bash's `$HOSTNAME` prints `vm`. That is bash setting the variable without exporting it.
Guarantee violated:
- R1 (redaction never silently weakens).
- kernel/PERMISSION-BOUNDARY.md:293–295: "`machine-identifier` findings are recorded in the record's own `residual_classes`, so the log states its own leakage instead of hiding it."
Evidence: Linux was observed as above. macOS is code-path-only: zsh does not set `HOSTNAME`, but this was not observed on a Mac.
False-positive check:
- PERMISSION-BOUNDARY.md's four declared limits (:298–312) do not include this.
- KNOWN-LIMITATIONS, DECISIONS-PENDING, PLAN and the lens say nothing about HOSTNAME or COMPUTERNAME.
- redaction.rs:115–116 does say "an identifier this cannot read is simply not scanned for, which is a gap in the scan and not a pass". That is a general code comment, not a KNOWN-LIMITATIONS entry, a preregistration deferral or §8, and it does not say this is the default state on Linux and macOS. Triage may weigh it.
Confidence: proven (Linux); code-path-only (macOS)

### Finding A-3
Claim: When `XDG_DATA_HOME` is empty or relative, the audit log path is relative to the working directory. `resolve_log_path` refuses exactly this for the `SPATIAL_IDE_AUDIT_LOG` override. A writer and a reader started in different directories then use different files, and `--audit-show` falsely reports that "nothing has been published on this machine yet".
Suggested severity: S3
Code path: `data_dir`'s non-Windows arm (log.rs:371–376) returns `XDG_DATA_HOME` unchecked. `resolve_log_path` (log.rs:336) joins it with no absoluteness check, although it refuses a relative override at :339–346. That result feeds both `AuditLog::open_for` (log.rs:122) and `publish-bundle --audit-show` (publish-bundle.rs:180).
Reproducer: kernel/tests/wave3_a_portability_audit.rs, test `a3_3_an_empty_or_relative_xdg_data_home_never_yields_a_working_directory_relative_log`, which drives the shipped `publish-bundle --audit-show` with `env_clear`, a temporary `HOME` and a temporary working directory. Observed: "XDG_DATA_HOME="": the audit log resolves to the working-directory-relative path `spatial-ide/audit/publish.jsonl`". By hand:
- `XDG_DATA_HOME=relative-data` printed `relative-data/spatial-ide/audit/publish.jsonl`.
- With `XDG_DATA_HOME` unset, the control printed `/tmp/w3home/.local/share/spatial-ide/audit/publish.jsonl`.
Guarantee violated:
- log.rs:342–344: "a relative one would put the audit log wherever the process happened to be started".
- `resolve_log_path`'s doc: "a reader and a writer can never resolve two different files for what is supposed to be one log".
- The XDG Base Directory specification: treat an empty value as unset, and ignore a relative one.
Evidence: observed on Linux. macOS takes the same arm and is code-path-only. The Windows arm (log.rs:369) has the same shape with `LOCALAPPDATA`, but the system always sets that variable, so on Windows this is code-path-only and unlikely to occur.
False-positive check:
- §1c-1 and PORT-2 (a proposed node) cover the two resolvers disagreeing and the macOS location, not the missing check on the value. MACOS-BRINGUP.md:143 calls the XDG choice "functionally correct".
- Nothing in KNOWN-LIMITATIONS, DECISIONS-PENDING or PERMISSION-BOUNDARY.md declares it.
- Triage may choose to route it into PORT-2's resolver work.
Confidence: proven (Linux)

### Unproven observations (not findings; at most five, one line each)
- publish/error.rs:401–404: the unix tables leave out EDQUOT (Linux 122, macOS 69) and EPERM, so a POSIX quota overrun is a generic IO failure where Windows reports disk full. Not reproduced, because that needs quotas.
- The audit log is created with the umask default (typically 0644) on POSIX, while `%LOCALAPPDATA%` inherits a user-only ACL. I found no confidentiality claim, so this is not a finding.
- publish-bundle.rs:642–656 handles Ctrl-C only. SIGTERM on POSIX, like console close on Windows, ends the process with no outcome record and no staging cleanup. Not exercised.
- boundary.rs:530 and normalize.rs:284 compile Windows-only test assertions out with `#[cfg(windows)]` instead of `cfg_attr` ignore, so they never appear in an ignored list (R6). This is test code and outside this audit's scope.
- The redaction scan flags every Windows drive-letter path but only the POSIX roots /home, /Users, /tmp and /var/folders (redaction.rs:154–159). That asymmetry is declared only in the code doc at redaction.rs:15–17.

### Stops (if any): none in this run
The earlier stop (the lens file was missing at the baseline) was resolved by the human's authorisation. Product code was audited at the baseline, and only the lens and governance files were read from main.

---

## Custodian fields (filled locally, never by the worker)

(Filled at triage, after the batch ends.)
