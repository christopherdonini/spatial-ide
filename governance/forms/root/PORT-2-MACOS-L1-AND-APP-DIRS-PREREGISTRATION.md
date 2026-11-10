# PORT-2: macOS L1 for the Cargo workspace (macos-latest in product-ci-rust), one application-directory boundary replacing the two resolvers, and a case-policy test on a case-insensitive volume (PLAN node `port-2-macos-l1-and-app-dirs`). Preregistration.

**Proposed file:** `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, at the repository root, beside PORT-1's form.

**Authority:**
- The human's approval and typed word for CI: `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:18` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:d0537714513a0963b7718a0d8a19e2cacf47e1075830f1e1bfbdacfc375ceb6c (item 6). Paraphrase, not a quote: macos-latest joins the Cargo workspace's matrix with the toolchain the Linux L1 job installs, and nothing else is installed. This form reads that word narrowly: one matrix entry, `dtolnay/rust-toolchain@stable` as the Linux entry has it (`.github/workflows/product-ci-rust.yml:205` at 2ffbf957d5a4c34cc0879af3dae66ba749b26b58, sha256 9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641), and no install step. Anything beyond that is OPEN-1 or an invalidator.
- Question round 33, items 6 and 7, cited by round and item.
- The 2026-09-30 portability direction: `state/directives/2026-09-30-portability-and-handoff.md:15-20` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:0903aa4aa83c5856b7c92aa811023ed4ba416a0cd099cbc8be424f034383d3f3 and its item 1, `state/directives/2026-09-30-portability-and-handoff.md:30-31` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:d9218311927d2d24c7ea340268dc1847b9e32fe1c21e31703f8311e126b85818.
- The plan row: `state/directives/PORTABILITY-2026-09-30.md:72` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:5580c64fbbfaefbd5c436d0b11160b8a4993c4a022bb587498ba853d51342e77 (§3, PORT-2). It is Fable's text, not the human's, and nothing here quotes it.
- The node: `PLAN.yaml:3410-3426` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:dcd8c7b518643bcf2688aa560486cc356e695190d34732ecbc4630ad43bea02f.

**Drafted by** the architect at main 2ffbf957 (consult: `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-architect-draft.md`). It is committed before any code, as the node's gate file, and is append-only from then on. An amendment made after any result says so in its first line.

**Gating: full.**
- §21a's guarantee head is engaged (`AUTONOMY.md:315-332` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3), for two reasons:
  - KNOWN-LIMITATIONS 1 gains a macOS level (R5);
  - the audit log's location rule changes, and that is a property under test (`kernel/src/permission/audit/log.rs:334-363` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:872bf3e419ba33602b9227c80a11620b56618f46195fe8c689ac4bc795513b9f).
- §21c's size bound applies too (`AUTONOMY.md:347-357` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31): about 680 lines over 16 files (§7).
- No other §21a head is engaged:
  - no ADR status line or amendment;
  - no security posture (ADR-020, ADR-009 and ADR-021 are not touched);
  - no wire.
- Round 25, item 2 (e): no five-line form is used.

## §0. Disclosure
- Reasoned from code at 2ffbf957. Nothing was run. The reuse index found nothing on any of the three searches.
- **The two resolvers, and every caller.**
  - Audit log: `data_dir` (`kernel/src/permission/audit/log.rs:365-381` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:973a19e3a7ab792b1ba37782839ba8b2f5b620e97c6a7fd162c3592449be9729, `pub(crate) fn data_dir() -> Option<PathBuf>`).
    - Windows: `LOCALAPPDATA`, taken verbatim.
    - Elsewhere: `XDG_DATA_HOME`, taken verbatim, or else `HOME/.local/share`.
  - Its callers on main:
    - `resolve_log_path` (`:355`), which feeds `AuditLog::open_for` (`:121-122`) and `publish-bundle --audit-show` (`kernel/src/bin/publish-bundle.rs:178-202` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:cf81660e8274b391d3dbd2318e399230933a201cbc43919f5d5165bd613d32fe);
    - `session_history::default_root` (`kernel/src/session_history.rs:38` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:93504a5c3026cbac159e5d5a8aeb296042087a22954b77aeb0ffbf707988f94a, `kernel/src/session_history.rs:130-134` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:ff0115c2e22f9d8cb7b94779641e5301a889c904babff3f03463d0d20361cd5d), whose product caller is the shell (`frontends/shell/src-tauri/src/lib.rs:448-451` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:783d976048ed03afeb3141bb5bc722460ff2d5f321cfca04ad5886f018735e8e).
  - Piece 1c's step 1 adds a machine store "through the existing `data_dir`". That is on `cut/b2-piece-1c-save-and-reopen`, not read here. Its form declares `data_dir`, `SkpHost::new` and `kernel/src/permission/**` unchanged by 1c (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:680` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:85120d9bd8a911d6229959850b524edaea32c5ebc3efae8d3147186f60b540df).
  - LOD tier root: `tier_directory` (`engine/src/lod.rs:1162-1180` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:26921dea887910df0352d93082f3f382edfedaff748a59653dbaaf07fa9d74cf) reads `LOCALAPPDATA` with no cfg, so its real rule is wherever `LOCALAPPDATA` is set (W3-A's correction, `state/cloud/wave3/W3-A.md:100-102` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:2eddcba65f070b3d73f2b57c9071c4b7bf007bcb300c865bda96eb88aafcd935). Its only caller is `build_tiers` (`engine/src/lod.rs:1027` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:9fc1b1e852cbe653787ae6e0865fac469957620887c454963fa13b51d172fc6d), which has no product caller. Its typed refusal is `engine.lod_tier_root_unresolved` (`:202-209`).
- **Case policy:** `component_eq` (`kernel/src/permission/audit/normalize.rs:178-194` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:671bde546154f7ec4675e8226b9f19194437e5ad9c3ae64ee71c4c3dc4ba0e84) and `is_inside` (`kernel/src/permission/audit/log.rs:383-401` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:bd8366cb8c8a06c715a1d9194dfb1bab0c41d2633254e2553b293561fc647968) fold ASCII case on Windows only. A recorded destination's parent is canonicalized by `resolve_destination` (`kernel/src/permission/grant.rs:184-214` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:df9f93b7d723dd9c353c7e0aaa67208f939f2baeecd94c7d39257b49f362a8dc).
- **Hypotheses:**
  - **H1:** on macOS, `std::fs::canonicalize` returns each existing component in its on-disk case on a case-insensitive APFS volume. This comes from knowledge of the platform and has not been observed. Discriminator: K1 at E1. If H1 is false, that is I8.
  - **H2:** the same holds on Windows/NTFS. Discriminator: K1, run locally.
  - **H3:** `macos-latest` is Apple Silicon running macOS 14 or later. Discriminator: the profile (§2 item 1). If false, that is I4.
  - **H4:** the macOS runner's temp volume is case-insensitive. Discriminator: K1's precondition. If false, that is I12.
- **Intake** (the node's list, plus the routed notes from PORT-1's gates):

| Item | Disposition |
|---|---|
| W3-A A-3: an empty or relative `XDG_DATA_HOME` (`state/cloud/wave3/W3-A.md:147-163` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:4b80495839381b39449f315e9a62beb918845a24334d94f82dd756726fdad017; custodian, `:188`) | **In**, §2 item 2. Extended to every variable the boundary reads (OPEN-2). |
| 1c-1 (a): the tier root follows `LOCALAPPDATA` on any OS | **In**, §2 item 3 (OPEN-D). |
| 1c-1 (b) | It is A-3. **In**, for the tier root as well. |
| 1c-2: the case candidate on macOS (`state/directives/PORTABILITY-2026-09-30.md:26` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:be2f0ed6594411e4ff1ccfdbd192f633a93c4886077575fadd8816f22bd8a465) | **In**: K1 verifies it. No product change. |
| 1c-2 (a): case-insensitive Linux mounts (`state/cloud/wave3/W3-A.md:104` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:d3bced2f388b913e5259c2147de7df6ae757c71cd881bd5a6274949a3bfdf496) | **Out, declared.** K1 is ignored on Linux with a reason. A casefold mount needs privilege or an install, which the human's word does not cover. |
| 1c-2 (b): Windows' ASCII-only fold | **Out.** Node `windows-case-fold-non-ascii`. |
| Observation 2: the POSIX file mode (`state/cloud/wave3/W3-A.md:167` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:c5ba8bf49a7f3600500f747192282bfc588c80eb50ef1b9e0f1576b5730acbe7; `:197`) | **Out.** No confidentiality claim covers it. The mode is unchanged at the new macOS location. |
| A-1 and A-2 (backslash, hostname) | **Out.** Nodes `posix-backslash-in-shared-path-logic` and `redaction-hostname-off-windows`. macOS takes the same code paths, and nothing here claims either. |
| PORT-1 note: T1 pins the site counts per file (`PORT-1-LINUX-L1-PREREGISTRATION.md:439-442` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:6964a0dc9b4e11ad834355abc8ab038259acac818ec2df3026a8c91193d9a2f6) | **In**, §2 item 5. |
| PORT-1 note: P3 is derived from a sorted `--list` set difference at P1 | **In**, §5. |
| The 19 off-Windows watcher compile-outs (`PORT-1-LINUX-L1-PREREGISTRATION.md:380-387` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:294e94b8ce688734479b818d23cbba9bde6a83fee48af1eaceee080b49e3150d) | Disclosed. They are the same on macOS (`cfg(windows)`). |

## §1. May and may not claim
- **May claim:**
  1. The macos-latest entry builds every workspace test target and runs the ordinary suite with 0 failed (E1, E4).
  2. Every entry prints its ignored list.
  3. On every platform, the per-user data directory and the tier root come from one boundary, `engine/src/app_dirs.rs`, under §2's table.
  4. No resolution is ever relative to the working directory (A2 and E-K).
  5. On Windows and macOS, a destination typed in another case is recorded in its on-disk case and takes its profile token (K1).
  6. The Windows test set changes only by the names §4 adds, and Windows' ignored list is unchanged (P4).
  7. KNOWN-LIMITATIONS 1 states macOS L1 for the workspace (W1).
- **May not claim:**
  - macOS L1 for `frontends/shell/src-tauri` or any excluded crate;
  - L2 or L3;
  - the Intel MacBook, or any macOS version CI has not run;
  - a pinned image: the label pins nothing;
  - anything about case-insensitive Linux mounts;
  - that the `HOME` or `TMPDIR` spelling equals its on-disk spelling;
  - a warning-free build;
  - that the new entry is required for merge, which is the human's setting;
  - any `docs/08` figure: CI durations are not measurements.
- **Unchanged:**
  - On Windows with an absolute `LOCALAPPDATA` (which the system always sets), the audit log path, the session store root and the tier root are byte-identical.
  - The Windows and Linux entries: check names, the Linux profile step, build/test/list commands, toolchain action, cache key expression, timeout, triggers, `paths` and concurrency.
  - In code:
    - `data_dir`'s name, file, signature and visibility;
    - `resolve_log_path`'s signature;
    - `SkpHost::new`;
    - `kernel/src/session_history.rs` whole, and `kernel/src/project/**`;
    - `component_eq`, `is_inside`, `normalize_with`, `resolve_destination` and `free_bytes_available`;
    - `LOD_TIER_ROOT` and `LOD_TIER_ROOT_UNRESOLVED`.
  - Tests: every existing test's name and body, apart from §2 item 6's reason strings and T1's expected map.
  - Every Cargo manifest and lockfile. No new dependency, and no `dirs` or `directories` crate.
  - Files not edited: `MACOS-BRINGUP.md` (paused: `PLAN.yaml:3461` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:a374bf2949ef5535cbbf9dbcf3a954269ad77ff4ee58268add196ea5dbd60360), PORTABILITY, and every other piece's form.
- **ADR-006:** no operation is added or reclassified. The class-3 audit obligation keeps its content and its refusal; only its default location moves, off Windows. No ADR is amended.
- **docs/02:** no module or directory is added. Placing the boundary in `engine/` is OPEN-A, and the reading is recorded there.
- **Seams** (the human's rule: each consuming side was read as it is, and each is proved end to end from the real shape):
  - `data_dir` into `app_dirs::user_data_dir`: E-K, through the shipped `publish-bundle --audit-show`. Both callers on main, and the shell's `default_root`, keep `Option<PathBuf>`.
  - `tier_directory` into `app_dirs::tier_cache_dir`: E-L, through `build_tiers`.
  - `resolve_destination` into `normalize_with` on a real case-insensitive volume: K1.
  - product-ci-rust into cargo on a macOS runner: E0 and E1.
  - The check into the tree: T1.
  - Caller rule: `pub fn user_data_dir` has product callers (kernel `data_dir`, then the audit log, the session store and the shell). The rest is `pub(crate)` with in-crate product callers. No callback, option or flag lands.

## §2. The change
0. **P1, the base.** The base is main at dispatch.
   - If `git diff --quiet 2ffbf957 <base> -- '*.rs' .github/workflows/product-ci-rust.yml` fails, §0 is re-derived and recorded before any code.
   - The worker records each entry's `--list` and `--list --ignored`, sorted, from E0.
1. **`.github/workflows/product-ci-rust.yml`.**
   - The matrix gains one entry:
     - `os: macos-latest`;
     - `job_name: "L1 portable correctness · cargo test --workspace (macos-latest)"`.
   - OPEN-1 (a) adds `Runner profile (macOS)`, with `if: ${{ runner.os == 'macOS' }}`, running `sw_vers -productVersion && uname -m`. Under OPEN-1 (b) there is no step.
   - The header comments are rewritten, quoting nothing:
     - what green means, per entry, macOS L1 for the workspace only (`:14-17`, `:27-29`);
     - Runner choice: three entries, the macOS label not pinned, by reference to this form (`:34-47`).
   - The 2026-08-06, 2026-08-07 and Resolved notes are kept as they are.
2. **`engine/src/app_dirs.rs`** (new; the application-directory boundary, added by this architect-reviewed change).
   - `pub(crate) enum Os { Windows, MacOs, OtherUnix, Other }`.
   - `pub(crate) const CURRENT: Os`, chosen by `cfg!(windows)`, `cfg!(target_os = "macos")` and `cfg!(unix)`: three sites in one expression.
   - The pure core:
     - `pub(crate) fn data_dir_for(os: Os, var: &dyn Fn(&str) -> Option<OsString>) -> Option<PathBuf>`;
     - `pub(crate) fn tier_root_for(os, var) -> Result<PathBuf, &'static str>`.
   - The shipped entries:
     - `pub fn user_data_dir() -> Option<PathBuf>`;
     - `pub(crate) fn tier_cache_dir() -> Result<PathBuf, &'static str>`.
   - A value counts only when it is non-empty and `Path::is_absolute`. An empty or relative value is treated as unset.

   | | Windows | macOS | Linux and other Unix | Other |
   |---|---|---|---|---|
   | data dir, before | `LOCALAPPDATA` verbatim | `XDG_DATA_HOME` verbatim, else `HOME/.local/share` | same as macOS | as Unix |
   | data dir, after | `LOCALAPPDATA` (OPEN-2) | `HOME/Library/Application Support`; `XDG_DATA_HOME` ignored | `XDG_DATA_HOME`, else `HOME/.local/share` | none |
   | tier root, before | `LOCALAPPDATA` verbatim, else refusal | `LOCALAPPDATA` if exported, else refusal | same as macOS | same |
   | tier root, after | `LOCALAPPDATA`, else refusal | refusal (OPEN-D (A)) | refusal | refusal |
   | none resolved | audit log: the publish refuses by `resolve_log_path`'s existing error (`kernel/src/permission/audit/log.rs:355-361` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:c33f57f9ce65426ee598e0de539e92be22bdcd817c537df71219c0c654eef945); session store: `record_step` refuses as today; tier: `engine.lod_tier_root_unresolved` | same | same | same |

   - Declared values at their own site: `MACOS_DATA_SUBDIR = "Library/Application Support"` and `XDG_DATA_DEFAULT_SUBDIR = ".local/share"`.
   - `engine/src/lib.rs` gains `pub mod app_dirs;`.
3. **`engine/src/lod.rs`.**
   - `tier_directory` calls `app_dirs::tier_cache_dir()`. The refusal detail becomes `{reason}`, then the existing sentence from "so the declared tier root cannot be resolved" onward (W6).
   - The docs at `:142-151`, `:202-209` and `:1162-1166` say where the root is decided.
   - No cfg is added.
4. **`kernel/src/permission/audit/log.rs`.**
   - `data_dir`'s body becomes `spatial_engine::app_dirs::user_data_dir()`. Its two cfg arms go.
   - Its doc, and the module doc at `:8-12`, follow §2 item 2 (W5).
   - `is_inside` is untouched.
5. **`scripts/plan/cfg-boundary.mjs`** allowlist and labels:
   - `engine/src/app_dirs.rs`: application directories (new);
   - `engine/src/lod.rs`: free space;
   - `kernel/src/permission/audit/log.rs`: filesystem case policy.

   **`scripts/plan/cfg-boundary.test.mjs`** T1's expected map (`:75`, `scripts/plan/cfg-boundary.test.mjs:83-88` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:9b3a8ce49e240d81880fb0590fa561a36086a2408a8b328169e3069db0061b14) becomes 19 sites in 7 files: `app_dirs.rs` 3, `lod.rs` 2, `watch.rs` 3, `origin.rs` 2, `log.rs` 1, `normalize.rs` 2, `error.rs` 6.
6. **The 14 LOD-tier ignore reasons** become `boundary: application directories and free space (engine/src/app_dirs.rs, engine/src/lod.rs); deferred by engine/LOD-PREREGISTRATION.md Amendment 8(a)`. The predicates are unchanged.
   - Files: `engine/tests/lod_tier_builder.rs` 11, `lod_tier_cancellation.rs` 1 and `lod_tier_preflight.rs` 1.
   - `kernel/tests/no_generation_in_persisted_artifacts.rs` 1 waits on OPEN-C.
7. **Tests:** the new files of §4.
8. **Records:**
   - KNOWN-LIMITATIONS item 1, the macOS line and the source comment (W1, W2);
   - item 43's location clause (W3, the human's words, for the human's answer);
   - `kernel/PERMISSION-BOUNDARY.md:190` (W4).

   No other item or document is edited. `MACOS-BRINGUP.md:143` goes stale and is routed to port-4's node (§10 note).
9. **Merge:** a merge commit only.
10. **Portability (R3):**
    - Boundary: application directories, `engine/src/app_dirs.rs`.
    - Windows: supported, unchanged (OPEN-2).
    - macOS: the data directory is supported at its native location; the tier root is **unavailable** (typed refusal, deferred by `engine/LOD-PREREGISTRATION.md:594` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:11ec844833fdf06159469f77e85f199dd781b180814803be20f81491ff285751, and §8's item at `state/directives/PORTABILITY-2026-09-30.md:147` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:f2b97648456a40bf7888f97b7999bd396a5898a05c30333c1ef584b327a8bcad).
    - Linux: the data directory is supported under the XDG rule; the tier root is unavailable, as on macOS.
    - Tests per platform: §4.
    - R4: no crate, test or filter is excluded on macOS.
    - R6: K1's Linux ignore carries its reason, and its deferral is the 1c-2 (a) row of §0.

## §3. Fixtures and predicted outcomes
Temporary directories only, removed in `finally`. No fixture is committed.

| # | Content | Outcome |
|---|---|---|
| S1 | Rule-table rows, each value taken from `temp_dir()` (absolute on the host), `""` or `"rel"` | §2 item 2's table, row by row |
| S2 | `publish-bundle --audit-show` with `SPATIAL_IDE_AUDIT_LOG` removed. Windows: `LOCALAPPDATA` absolute, then relative, with `XDG_DATA_HOME` set (ignored). macOS: `HOME` absolute with `XDG_DATA_HOME` absolute (ignored), then `HOME` relative. Linux: `XDG_DATA_HOME` unset, `""`, `relative-data`, then absolute; then `HOME` relative with XDG unset | each run prints `no audit log at <expected>/spatial-ide/audit/publish.jsonl`; each relative run exits 1 with the existing no-data-directory message, except Linux's relative XDG, which falls back to `HOME` |
| S3 | `build_tiers` on an 8-feature EPSG:2056 `write_geoparquet` source. Windows: `LOCALAPPDATA` relative. Elsewhere: `LOCALAPPDATA` set to an absolute temporary directory | `engine.lod_tier_root_unresolved` on every platform, and nothing created under that value or the working directory |
| S4 | `Case-Policy-Probe-<pid>-<n>/Inner` created under `canonicalize(temp_dir())`; the destination typed with both components' case changed, plus `bundle` | precondition: the other-case spelling exists (the volume is case-insensitive); `normalize_with(resolve_destination(typed), [(probe root, "<user-home>")], [])` equals `<user-home>/Inner/bundle` |

## §4. Tests, one mutation each
A mutation is observed by applying it, running the named test, recording the first failing assertion in that test's `// RECORDED MUTATION:` comment with the commit it was observed at, and reverting. A `verify-mutation` run is not an observation (round 25, item 2 (c)).

| # | Test (file) | Scenario | Mutation | Observed on |
|---|---|---|---|---|
| A1 | `the_rule_table_resolves_each_platform_from_its_own_variables` (`app_dirs.rs` unit test) | S1 | M1: the macOS arm returns `HOME/.local/share` | Windows |
| A2 | `an_empty_or_relative_value_is_treated_as_unset_never_as_a_relative_directory` (unit) | S1 | M2: the absoluteness check is removed | Windows |
| A3 | `the_tier_root_resolves_on_windows_only_and_never_from_localappdata_elsewhere` (unit) | S1 | M3: `tier_root_for` reads `LOCALAPPDATA` on every `Os` | Windows |
| E-K | `the_audit_log_resolves_under_this_platforms_data_directory_and_never_relative_to_the_working_directory` (`kernel/tests/app_data_dir_resolution.rs`, spawning `CARGO_BIN_EXE_publish-bundle`) | S2 | M4: `data_dir` keeps its 2ffbf957 body | Windows under OPEN-2 (a); otherwise E3 |
| E-L | `the_tier_root_is_refused_by_name_where_it_is_not_declared_and_nothing_is_written` (`engine/tests/lod_tier_root.rs`, its own binary because it sets `LOCALAPPDATA`) | S3 | M5: `tier_directory` reads `LOCALAPPDATA` directly | Windows under OPEN-2 (a); otherwise E3 |
| K1 | `on_a_case_insensitive_volume_a_destination_typed_in_another_case_is_recorded_in_its_on_disk_case_under_its_profile_token` (`kernel/tests/case_policy_volume.rs`), with `#[cfg_attr(not(any(windows, target_os = "macos")), ignore = "boundary: filesystem case policy (kernel/src/permission/audit/normalize.rs); a case-insensitive Linux volume is not exercised")]` | S4 | M6: `resolve_destination` rejoins the typed parent instead of canonicalizing it | Windows, and macOS through E3 |
| T1 | existing, expected map changed | the real tree | M7: `engine/src/app_dirs.rs` dropped from the allowlist | Windows |

The W3-A reproducer `a3_3_an_empty_or_relative_xdg_data_home_never_yields_a_working_directory_relative_log` (`kernel/tests/wave3_a_portability_audit.rs` on `cloud/wave3-A` at 8a2ba65f1f3bda3fc709d4a5d3bc2217890f0139, not read by me) is the shape model for E-K. It is not merged.

**Runs** (the worker records E0 to E3 by run id; the custodian records E4):
- **E0:** the branch's first push, one commit adding only §2 item 1's entry (with OPEN-1 (a)'s step), at the base. All three entries are predicted green.
- **E1:** product-ci-rust at the head marked ready, which the gates read.
- **E2:** governance-ci at that head. `cfg boundary (PORTABILITY R2)` is predicted to print `cfg-boundary: 19 sites in 7 files, 0 outside every boundary`, and `node --test` green.
- **E3:** probe branch `probe/port-2-case-policy-red`, cut from the head, one plain-push commit applying M6 (and M4 and M5 under OPEN-2 (b)). Predicted: K1 red on Windows and macOS, and Linux green (K1 is ignored there). The probe is never merged and is deleted once the run ids are recorded.
- **E4:** the first push to main after the merge. All green is predicted. If it is red, the next PR withdraws W1's macOS line, and the red is answered before any Rust dispatch.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - **P1:** A1 to A3, E-K, E-L, K1 and T1 pass, and each fails under its own mutation.
  - **P2 (E0):** macOS's `--list --ignored` equals Linux's, and macOS's `--list` equals Linux's, both sorted and byte-identical.
  - **P3 (E1, as sorted set differences against E0):**
    - every entry's `--list` is its E0 list plus exactly A1 to A3, E-K, E-L and K1;
    - Linux's `--list --ignored` is its E0 list plus K1;
    - macOS's and Windows' `--list --ignored` lists equal their E0 lists.
  - **P4:** Windows' `--list --ignored`, run locally, is byte-identical at the base and at the head.
  - **P5:** the job names are byte-identical for Windows and Linux, and macOS's is §2 item 1's string.
  - **P6:** the profile shows ProductVersion 14 or later and `arm64`. Under OPEN-1 (b), it is read from the "Set up job" image line.
  - **P7:** E2 and E3 come out as §4 predicts.
  - **P8:** K1 passes on Windows and macOS at E1 (H1, H2, H4).
- **Declared unchanged:** §1's Unchanged list.
- **How a first failure is read:**
  - A macOS failure at E0 is the platform's, since E0 carries no product change: it is I1.
  - A failure that first appears after E0 is this piece's, and is fixed here.
- **Invalidators** (each stops the piece):
  - **I1:** a macOS test fails at E0.
    - It is recorded as class 2, and each failing test becomes its own node to the custodian.
    - No ignore, exclusion or skip is added.
    - A test named by `timing-assertions-under-contention` or `timing-tests-assert-property-not-budget` is re-run once, with both run ids recorded.
    - The PR does not go ready until the human orders the nodes, or lands this piece without the entry and without W1.
  - **I2:** disk exhausted or the timeout hit on macOS. Any workflow change is declared by amendment first. A cleanup of preinstalled software, an install or another label goes to the human, typed.
  - **I3:** the Windows or Linux check name changes.
  - **I4:** H3 is false. This goes to the human, against round 33 item 7's profile.
  - **I5:** any install or system package is needed.
  - **I6:** P4 fails.
  - **I7:** P2 or P3 differs. It is recorded as class 2, with the unlisted skip or compile-out reported.
  - **I8:** K1 fails on macOS, so H1 is false and the 1c-2 candidate is observed.
    - It is recorded as class 2, and a node is routed for the human to grade.
    - K1 is never ignored to go green, and W1 waits.
  - **I9:** at the base, the check finds a site outside a boundary.
  - **I10:** at the base, `data_dir` has a signature other than §0's, or a new caller (the seam re-read).
  - **I11:** a Rust PR merges to main before E1. Main is merged into the branch, and E1 is read at the merged head.
  - **I12:** K1's precondition fails on a CI volume.
- **Falsification:**
  - macOS is green with a crate, test or filter excluded;
  - any resolution is relative to the working directory;
  - Windows paths change for an absolute `LOCALAPPDATA`;
  - KNOWN-LIMITATIONS claims more than L1 for the workspace.

## §6. Instruments
These are assertions only:
- `gh run view <id> --json jobs` for each run;
- sorted set differences of the list steps;
- the profile output;
- the check's stdout;
- `git grep` for §0's sites at the base and the head;
- `rustc`, `cargo`, `node` and `git` versions, locally and in CI;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings
- **Matrix:** §2 item 1's `os` and `job_name`. `timeout-minutes: 90` is unchanged.
- **Boundary:** §2 item 2's table, and its two subdirectory constants.
- **Check:** §2 item 5's labels and T1's map.
- **Reason strings:** §2 item 6, and K1's in §4.
- **W6, the LOD detail reasons:**
  - Windows: `LOCALAPPDATA is not set, or is not an absolute path`;
  - other platforms: `no tier root is declared on this platform yet (engine/LOD-PREREGISTRATION.md Amendment 8 (a))`.
- **Size:** at most 850 changed lines over at most 16 files, exactly these:
  1. `.github/workflows/product-ci-rust.yml`
  2. `engine/src/app_dirs.rs`
  3. `engine/src/lib.rs`
  4. `engine/src/lod.rs`
  5. `kernel/src/permission/audit/log.rs`
  6. `kernel/tests/app_data_dir_resolution.rs`
  7. `engine/tests/lod_tier_root.rs`
  8. `kernel/tests/case_policy_volume.rs`
  9. `scripts/plan/cfg-boundary.mjs`
  10. `scripts/plan/cfg-boundary.test.mjs`
  11. `engine/tests/lod_tier_builder.rs`
  12. `engine/tests/lod_tier_cancellation.rs`
  13. `engine/tests/lod_tier_preflight.rs`
  14. `kernel/tests/no_generation_in_persisted_artifacts.rs` (OPEN-C)
  15. `KNOWN-LIMITATIONS.md`
  16. `kernel/PERMISSION-BOUNDARY.md`
- **Counting command:** `git diff --numstat <base>...<head> -- . ':!PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit. An overrun is class 8, and this section is never edited.
- **Estimate:**

  | File or group | Lines |
  |---|---|
  | workflow | 30 |
  | `app_dirs.rs` | 200 |
  | `lib.rs` | 1 |
  | `lod.rs` | 30 |
  | `log.rs` | 25 |
  | E-K | 150 |
  | E-L | 90 |
  | K1 | 100 |
  | check and test | 14 |
  | reasons | 28 |
  | KNOWN-LIMITATIONS | 14 |
  | PERMISSION-BOUNDARY | 2 |

- **Minutes:** 240.

## §8. Block-on-sight
1. Any install step (brew, apt, choco, `cargo install`, npm), or any action beyond those already in the workflow.
2. A Windows or Linux entry change, other than in comments. A different macOS label.
3. `RUSTFLAGS`, `-D warnings`, `continue-on-error`, `|| true`, `--skip`, `--exclude`, a test filter, or a macOS-only ignore or compile-out.
4. A Cargo manifest or lockfile change, or any new dependency.
5. Any of these edited:
   - `kernel/src/session_history.rs`, `kernel/src/project/**` or `kernel/src/skp.rs`;
   - `SkpHost::new`;
   - `data_dir`'s name, signature, visibility or file;
   - `component_eq`, `is_inside`, `normalize_with` or `resolve_destination`.
6. A cfg outside `app_dirs.rs` added to product source. An allowlist entry other than §2 item 5's.
7. Any of these edited:
   - `MACOS-BRINGUP.md`, PORTABILITY, or another piece's form;
   - `engine/README.md` or `kernel/README.md` (both are #241's and 1c's);
   - a KNOWN-LIMITATIONS item other than 1 and 43.
8. W1, W4 or W5 not as §10's words. W3 applied without the human's answer.
9. A quotation in a comment, test or record line.
10. A test added, removed or renamed beyond §4.
11. A file outside §7's list.
12. A force-push, the probe commit at the gated head, or a squash or rebase merge.
13. A user-profile path in the diff, a commit message or a record. Tests use temporary directories only.
14. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash at a branch commit;
    - a test-text span on an unmerged branch pinned by hash or named without its commit id;
    - a bare self-line;
    - a §7 overrun not recorded as class 8;
    - code of a scope addition before its class 9 amendment;
    - a record calling a `verify-mutation` run an observation.

## §9. Gates
- **Architect:**
  - the Gating line;
  - item 6's word against §2 item 1;
  - round 33, items 6 and 7, against W1;
  - R1 to R6, including the allowlist;
  - the seams and the caller rule;
  - docs/02 (OPEN-A);
  - the rule (00) reading;
  - the round 7 ruling on operator-visible text (W6 states engine facts);
  - round 25, item 2;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - M1 to M7 observed;
  - E0 to E3 by run id;
  - P2 to P5 recomputed;
  - the probe's diff;
  - §7 recounted.
- **Suites:** product-ci-rust on all three entries; governance-ci; Rust fmt; exposure-scan; DCO; locally, `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` and the §6 tools; branch CI read before gating.
- **Operator:** none.

## §10. Amendments (opens empty; classes 1 to 9)

### The drafted words, each checked clause by clause against §2's design (the gates re-check each one against the code at the head)

**W1. KNOWN-LIMITATIONS item 1, replacing the line at `KNOWN-LIMITATIONS.md:30` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:0e31e0f1347a8b27c7eb5732cc619d71f6727338c7c4ba98b2b7686b25bc6dee.**
- Not the human's wording: its source comment, `:32`, names no approval. The worker applies it and the PR body lists it.

```
   - **macOS on Apple Silicon** (the image GitHub's `macos-latest` label runs; each run reports its version): L1 for the Cargo workspace only. Its suite compiles and passes in CI, and every run lists the tests it ignores. The file watcher's own tests do not run there (item 24). Not the Tauri shell, not L2, not L3, no Intel Mac, and no macOS version CI has not run.
```

- **Clause check:**
  - "L1 … workspace only": E1 and E4 on the `--workspace` commands (`.github/workflows/product-ci-rust.yml:221-234` at 2ffbf957d5a4c34cc0879af3dae66ba749b26b58, sha256 a58693b5a6baf5daeb5b4cc6085e4af998586eb1ef24be69fdbfe8dd4a87598a).
  - "lists the tests it ignores": the list step carries no OS condition (`:238-240`).
  - "watcher's own tests do not run": they are compiled out by `cfg(windows)`, as on Linux (PORT-1 Amendment 1, item 3).
  - "not the Tauri shell": it is outside the workspace.
  - "Apple Silicon" and "no version CI has not run": P6.
- **Not covered**, named for the source comment: the line holds of main only while later runs stay green (E4's withdrawal rule).

**W2. The item 1 source comment:** it adds `the macOS line is proved by PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md E1 (the product-ci-rust macos-latest entry)`. No run id and no `path:line`.

**W3. Item 43's location clause.**
- **This is the human's wording** ("Approved as drafted by the human", `KNOWN-LIMITATIONS.md:401` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:c16ea3a3b37a970e3636d0ce6bca190fb1d0802cdef2bff9bba754f90891aaf6). The human answers yes, gives their own words, or accepts it as it stands.
- It replaces "on Windows under … unless `XDG_DATA_HOME` is set." (`:400`) with:

```
on Windows under `%LOCALAPPDATA%\spatial-ide\sessions`, on macOS under `~/Library/Application Support/spatial-ide/sessions`, and on Linux under `~/.local/share/spatial-ide/sessions`, or under `spatial-ide/sessions` in `XDG_DATA_HOME` when that is set to an absolute path.
```

- **Clause check:** `default_root` is the data directory joined with `spatial-ide/sessions` (`kernel/src/session_history.rs:130-134` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:ff0115c2e22f9d8cb7b94779641e5301a889c904babff3f03463d0d20361cd5d), and the data directory follows §2 item 2's table on each platform (Windows, macOS, Linux; `~` means `HOME`).
- **Not covered**, for the source comment: a `LOCALAPPDATA` or `HOME` that is unset or not absolute. Then nothing is kept and `record_step` refuses. Ordinary use does not reach it, because the OS sets both.
- **Timing:** the words must land in this PR. Merged without them, the macOS clause is false.

**W4. `kernel/PERMISSION-BOUNDARY.md:190`.** Not the human's wording. The worker applies it.

```
| **Location** | `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl` (Windows); `$HOME/Library/Application Support/spatial-ide/audit/publish.jsonl` (macOS); `$XDG_DATA_HOME/spatial-ide/audit/publish.jsonl` when `XDG_DATA_HOME` is an absolute path, else `$HOME/.local/share/spatial-ide/audit/publish.jsonl` (Linux and other Unix). A variable that is unset or not absolute resolves nothing, and the publish refuses before anything exists |
```

- **Clause check:**
  - the join: `kernel/src/permission/audit/log.rs:362` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:82cda9d7f714309acc9a071600784d992ac723e3c1e0e39b1181a4e91a8c59c3;
  - the refusal: `:355-361`;
  - it fires before anything exists: `:121-122`.

**W5. `log.rs`'s module doc, lines 8-9.** A doc comment. The worker applies it.

```
//! Default `<data-dir>/spatial-ide/audit/publish.jsonl`, where `<data-dir>` is the application-directory
//! boundary's per-user data directory (`spatial_engine::app_dirs::user_data_dir`): `%LOCALAPPDATA%` on
//! Windows, `$HOME/Library/Application Support` on macOS, `$XDG_DATA_HOME` else `$HOME/.local/share` on
//! other Unix, each used only when it is an absolute path.
```

The clause check is the same as W4's.

**W6. The LOD reasons (§7).**
- An engine message: it states engine facts and no other module's consequence. It is not shown by the app (no product caller).
- **Clause check:** on Windows, `tier_cache_dir` errs only when `LOCALAPPDATA` is unset or relative; elsewhere it always errs (OPEN-D (A)). The kept sentence, a tier never written beside its source, holds because `build_tiers` returns at `engine/src/lod.rs:1027` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:9fc1b1e852cbe653787ae6e0865fac469957620887c454963fa13b51d172fc6d before any write.

## §10 Amendment 1 — at the commit: the pins, the draft's note not carried, the human's answers, OPEN-A's docs/02 reading, rule (00) by the branch diffs, the merge order (class 1); written by the custodian

*Written by the custodian at the commit that adds this form, before any code. References only: the architect's drafting consult `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-architect-draft.md` (its rule (00) and OPEN items, which are not carried into the form); the human's approval `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md`, item 6; the human's answers `state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md`, item 4.*

1. **The pins.** The draft's 38 line cites with a pin, read at main 2ffbf957, are pinned above by script at 2ffbf957d5a4c34cc0879af3dae66ba749b26b58, each over its lines joined with a final newline. The 3 continuations that carried a pin are written with their file's full path; the continuations without a pin stand as drafted, each a line of the file its sentence names, read at 2ffbf957. No `.rs` file and not `.github/workflows/product-ci-rust.yml` changed from 2ffbf957 to the commit that adds this form; §2 item 0's check is repeated at the worker's base. The two cites into `.github/workflows/product-ci-rust.yml` are written with `at <commit>, sha256 <hex>`, as `scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md` writes its cite into `.claude/settings.json`: verify-quotes' hash-reference grammar reads a path only from a letter, digit or underscore, so a pin on a path starting with a dot does not parse.
2. **Not carried:** the draft's custodian's note under §10, which it marked as not part of the form. Its two routes stand: `port-4-l2-smoke`'s summary, and piece 1c's next amendment (class 3, after this piece merges).
3. **The human's answers** (item 4): OPEN-1 (a), within the human's CI word, and it installs nothing; OPEN-2 (a); OPEN-A (A), with the docs/02 reading recorded for the gate (item 4 below); OPEN-B (b); OPEN-C (a); OPEN-D (A); W3 (OPEN-E): yes to the architect's words for item 43. W3 is applied as §10 gives it, and the PR body lists it as approved by the human on 2026-10-23.
4. **OPEN-A (A), the reading recorded for the gate.** The boundary is `engine/src/app_dirs.rs`, with the kernel's `data_dir` delegating to it: the engine is the lowest crate that needs it (its LOD cache), the kernel already depends on the engine, and `engine/src/watch.rs` is a precedent of an OS-mechanism boundary in `engine/` that the kernel and the shell consume. Against it stands `docs/02_Architecture.md:26` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:5c82976e414bcc765149ca2cef0b4f8757ae6bc0ddff4beeb1a39ab59f78630a, which gives `engine/` the data-engine module and nothing else; a per-user data directory for the audit log is not strictly data-engine work. The architect's gate tests this reading (§9, docs/02); if the gate reads that line as forbidding it, the draft's (B) is the fallback, by amendment.
5. **Rule (00), by the branch diffs at this commit** (`git diff --name-only origin/main...<branch>`, against §7's 16 files): #241 (`cut/bundle-redaction-scan` at 2fc01f59): `KNOWN-LIMITATIONS.md`; #244 (`cut/walkthrough-row-f7-cli-refusal` at abc900f2): none of the 16; #246 (`cut/b1-shell-half-pr-a` at 35085072): `KNOWN-LIMITATIONS.md`; 1c step 1 (`cut/b2-piece-1c-save-and-reopen` at 7109aeb2): none of the 16; #245 (`cut/questions-mirror-item-count` at 8e395985): none of the 16; covering-case, stopped at its P0 (`cut/covering-case-collision-binds-other-column` at b0637a7f): none of the 16; verify-cites-pin (`cut/verify-cites-pin-resolution-and-line-zero` at 7a23dbad): none of the 16. The KNOWN-LIMITATIONS items are separate paths (#241 adds item 47; #246 adds items 51, 52; this piece edits items 1 and 43). 1c's branch does not touch `kernel/tests/no_generation_in_persisted_artifacts.rs` at 7109aeb2, though its form lists it among its groups (the draft's rule (00)); by OPEN-C (a) this piece edits it only after 1c step 1 merges, with main merged into the branch first. No branch here, and not this piece, is under `protocol/`.
6. **The merge order** (OPEN-B (b)): this PR merges only after 1c step 1 merges, so E1 runs 1c's tests on macOS here. I11 reads E1 at the merged head of any Rust PR merged before it.
7. **Next:** the code, by one worker on `cut/port-2-macos-l1-and-app-dirs` from this commit: §2 item 0 (P1) and E0 first, then the change, §4's tests and mutations, and E1 to E3 by run id. The node carries 240 minutes (§7).

Nothing above is edited.

## §10 Amendment 2 — E0: I1 fired on one macOS test, and the run stopped before every binary ran (class 2); the probe E0b declared before it runs; §2 item 6's count (class 3); written after E0's result was seen

*Written by the custodian after E0's result was seen. References only: the worker-high's report `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-e0-stop-worker-report.md`; E0's commit fb16262770c89395356f58bccf731583500d7859; its product-ci-rust run 39954586687.*

1. **E0's result (class 2).** The Windows and Linux entries passed. The macOS entry built every workspace test target, and its profile step gave a macOS 26 version on arm64, so P6 holds and H3 is true (I4 does not fire). Its ordinary suite failed one test, `a_cancel_inside_the_sort_is_observed_rather_than_waited_out` in `kernel/tests/publish_cancellation.rs`, by its own refusal to pass when the sort-window cancel was not exercised: the sort finished inside one poll interval. That is I1. The piece stops: no ignore, exclusion or skip is added, and no product code is committed. Cargo stopped at that binary, so 27 of the 93 test binaries the Linux entry ran never ran on macOS, and P2's run-list half cannot be judged; its ignored-list half holds (macOS and Linux byte-identical).
2. **The failing test is an existing node's.** It is the one `publish-sort-window-cancel-not-exercised-on-ci` names from a Windows-runner sighting on 2026-10-09; that node is proposed, and is not one of the two nodes I1's one-time re-run clause names. E0 adds the macOS sighting to it; no new node is opened for this test.
3. **E0b, declared here before it runs (class 2 evidence; no product change):** a probe branch `probe/port-2-macos-no-fail-fast`, cut from E0's commit, with one commit that adds `--no-fail-fast` to the ordinary suite's command for the macOS entry only, by an expression on the runner's OS, so that the Windows and Linux commands are unchanged. It is pushed once, never merged, never gated, and deleted by the custodian once its run id is recorded. It installs nothing and adds no entry. Its purpose is the list I1 asks for, each failing macOS test by name, which run 39954586687 cannot give. Each further failing test becomes its own node; a failure that is the same defect as an existing node is added to it.
4. **§2 item 6's count (class 3).** At B, `engine/tests/lod_tier_builder.rs` holds the LOD-tier reason 14 times, not 11, so the three engine files hold 16 and the kernel file 1 (OPEN-C): 17, not 14. The rule of item 6 is unchanged: every occurrence of that reason in those files takes the new text. §7 is not edited.
5. **The piece waits for the human,** by I1: the human orders the nodes (this test's and any E0b adds), or lands this piece without the macOS entry and without W1. The worktree keeps the worker-high's prepared change for steps 3 and 4, uncommitted and never compiled; it is resumed or discarded on the human's answer.

Nothing above is edited.

## §10 Amendment 3 — E0b: every entry green, macOS equal to Linux by test name; the E0 failure is intermittent; I1 still waits for the human (class 2); written after E0b's result was seen

*Written by the custodian after E0b's result was seen. References only: the worker's report `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-e0b-probe-worker-report.md`; the probe commit c99c3c553147745e3715b27094277df9be06e755 on `probe/port-2-macos-no-fail-fast`, deleted after this amendment; its product-ci-rust run 39960207028.*

1. **E0b's result (class 2).** Run 39960207028, at E0's tree with `--no-fail-fast` on the macOS entry only, concluded success on all three entries. The macOS entry ran the same 106 test binaries as Linux, with 927 tests passed, 0 failed and 75 ignored, and its sorted list of test names and statuses equals Linux's. So P2's run-list half, unjudged at E0, holds at E0's tree.
2. **The E0 failure is intermittent.** `a_cancel_inside_the_sort_is_observed_rather_than_waited_out` passed in E0b on the same tree, as it failed once on Windows on 2026-10-09 and passed on the re-run (node `publish-sort-window-cancel-not-exercised-on-ci`). It is that node's defect, a test whose trigger may not fire inside one poll interval, and not a macOS-only failure. E0b found no other macOS failure.
3. **I1 still stands**, and these results do not lift it: the human orders the sort-window node, or lands this piece without the macOS entry and without W1. Neither gate has seen this piece's code; the worker-high's prepared change for steps 3 and 4 stays uncommitted in the piece's worktree until the human answers.

Nothing above is edited.

## §10 Amendment 4 — the human's answer to I1: the sort-window node ahead, the prepared code committed to the branch, the piece landing after that fix with its macOS entry and W1 (class 1); written after E0b's result was seen

*Written by the custodian. References only: the human's ruling `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its paragraph opening `Port-2, I1`; Amendments 2 and 3.*

1. **I1 is answered:** the human orders the node `publish-sort-window-cancel-not-exercised-on-ci` ahead of this piece (graded S3, its own form), and this piece lands after that fix with its macOS entry and W1. The other route, landing without the entry and without W1, is not taken.
2. **The prepared change is resumed** (Amendment 2 item 5): steps 3 and 4 of Amendment 1 item 7, §2 items 2 to 8 and §4's tests and mutations, by one worker-high from E0 on this branch; committed and pushed, not merged. §2 item 6 takes every occurrence of the reason in the three engine files (Amendment 2 item 4); `kernel/tests/no_generation_in_persisted_artifacts.rs` waits on OPEN-C (a), as Amendment 1 item 5 says.
3. **The order to the merge:** `publish-sort-window-cancel-not-exercised-on-ci` merges first, and 1c step 1 merges first (Amendment 1 item 6); main is then merged into this branch (I11), and E1 to E3 are read at the merged head. The PR does not go ready before that head. A red macOS entry on this branch's pushes before that merge, on the sort-window test alone, is that node's known defect (Amendment 3 item 2) and is not E1.
4. **Next:** the worker-high's build; then, after the two merges, main merged into the branch, E1 to E3, the PR and both gates.

Nothing above is edited.

## §10 Amendment 5 — the build: §7 overrun (class 8); P4's whole list (class 2); two corrections and one open comment (class 1); written after the results were seen

*Written by the custodian after the build's results were seen, before E1 and the gates. References only: the worker-high's report `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-build-worker-report.md`; the commits 6c21888e1be1dd723219e160c66c672fdb44967c and 83d2ecef8dba33017e47310d7fab8e2be5ee5123.*

1. **§7 (class 8):** 939 changed lines over 15 files by §7's command over 1f7d06b5...83d2ecef, against 850 over 16; the new files run past their estimates (`app_dirs.rs`, E-K and E-L). §7 is not edited, and nothing is trimmed.
2. **P4 (class 2):** the ignored entries are byte-identical at the base and the head (57 and 57); the whole sorted output differs by three lines, each `0 tests, 0 benchmarks`, for the three new binaries, which hold no ignored test. §5 is not edited; the gates read it.
3. **As predicted:** A1 to A3, E-K, E-L, K1 and T1 pass on Windows, and each fails under its own mutation, M1 to M7, observed on Windows (K1's macOS observation is E3's); the check prints 19 sites in 7 files, 0 outside; I9 holds at the base. CI's macOS entry fails on the sort-window test alone at both pushes (Amendment 4 item 3), and that binary stops the run.
4. **Class 1:** the worker-high corrected the prepared change twice: a workflow-comment sentence the form does not give removed, and an unused import moved into the tests module. W3's words name a case not covered, for item 43's source comment, and no text for it is given: the architect's gate reads it.
5. **Next:** the sort-window fix and 1c step 1 merge; main merged into this branch (I11); E1 to E3 at the merged head; the PR and both gates.

Nothing above is edited.
