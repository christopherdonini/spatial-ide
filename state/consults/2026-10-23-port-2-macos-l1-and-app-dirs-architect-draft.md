*Custodian's filing note (2026-10-23): the form for `port-2-macos-l1-and-app-dirs`, drafted ahead by the architect, read only at main 2ffbf957 (main moved after it only in records). The run 08:52:05Z to 09:06:47Z by its transcript (Grep 27, Glob 1, Read 31; no Write, Edit or Bash). Nothing is committed from it before the human answers OPEN-1, OPEN-2, OPEN-A to OPEN-D and W3 (OPEN-E, item 43's words, which are the human's). Its candidate found in passing (the normalization roots read uncanonicalized, against canonicalized destinations, on macOS) is recorded as a proposed node; its two notes on stale macOS sentences go on `port-4-l2-smoke`'s and piece 1c's nodes. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is adb067756554c4957a4bae4a623b8f1d7405c0b601c81fb6a8fdbe3494fbf4ce.*

---

Drafted: port-2-macos-l1-and-app-dirs, at main 2ffbf957

I read everything in the main checkout at 2ffbf957. I have no shell, so no span hashes appear below: the custodian pins every `path:line @ 2ffbf957` cite with its sha256 when the form is committed. I also could not read any branch. Code on a branch is named by path, symbol and commit, and is marked as not read by me.

**Reuse index:** all three searches came back empty (`macos ci matrix`, `application data directory resolver`, `case insensitive filesystem`; output byte for byte in the brief). This is recorded as a miss in §0.

---

# PORT-2: macOS L1 for the Cargo workspace (macos-latest in product-ci-rust), one application-directory boundary replacing the two resolvers, and a case-policy test on a case-insensitive volume (PLAN node `port-2-macos-l1-and-app-dirs`). Preregistration.

**Proposed file:** `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, at the repository root, beside PORT-1's form.

**Authority:**
- The human's approval and typed word for CI: `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:18 @ 2ffbf957` (item 6). Paraphrase, not a quote: macos-latest joins the Cargo workspace's matrix with the toolchain the Linux L1 job installs, and nothing else is installed. This form reads that word narrowly: one matrix entry, `dtolnay/rust-toolchain@stable` as the Linux entry has it (`.github/workflows/product-ci-rust.yml:205 @ 2ffbf957`), and no install step. Anything beyond that is OPEN-1 or an invalidator.
- Question round 33, items 6 and 7, cited by round and item.
- The 2026-09-30 portability direction: `state/directives/2026-09-30-portability-and-handoff.md:15-20 @ 2ffbf957` and its item 1, `:30-31 @ 2ffbf957`.
- The plan row: `state/directives/PORTABILITY-2026-09-30.md:72 @ 2ffbf957` (§3, PORT-2). It is Fable's text, not the human's, and nothing here quotes it.
- The node: `PLAN.yaml:3410-3426 @ 2ffbf957`.

**Drafted by** the architect at main 2ffbf957 (consult: `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-architect-draft.md`). It is committed before any code, as the node's gate file, and is append-only from then on. An amendment made after any result says so in its first line.

**Gating: full.**
- §21a's guarantee head is engaged (`AUTONOMY.md:315-332 @ 2ffbf957`), for two reasons:
  - KNOWN-LIMITATIONS 1 gains a macOS level (R5);
  - the audit log's location rule changes, and that is a property under test (`kernel/src/permission/audit/log.rs:334-363 @ 2ffbf957`).
- §21c's size bound applies too (`AUTONOMY.md:347-357 @ 2ffbf957`): about 680 lines over 16 files (§7).
- No other §21a head is engaged:
  - no ADR status line or amendment;
  - no security posture (ADR-020, ADR-009 and ADR-021 are not touched);
  - no wire.
- Round 25, item 2 (e): no five-line form is used.

## §0. Disclosure
- Reasoned from code at 2ffbf957. Nothing was run. The reuse index found nothing on any of the three searches.
- **The two resolvers, and every caller.**
  - Audit log: `data_dir` (`kernel/src/permission/audit/log.rs:365-381 @ 2ffbf957`, `pub(crate) fn data_dir() -> Option<PathBuf>`).
    - Windows: `LOCALAPPDATA`, taken verbatim.
    - Elsewhere: `XDG_DATA_HOME`, taken verbatim, or else `HOME/.local/share`.
  - Its callers on main:
    - `resolve_log_path` (`:355`), which feeds `AuditLog::open_for` (`:121-122`) and `publish-bundle --audit-show` (`kernel/src/bin/publish-bundle.rs:178-202 @ 2ffbf957`);
    - `session_history::default_root` (`kernel/src/session_history.rs:38 @ 2ffbf957`, `:130-134 @ 2ffbf957`), whose product caller is the shell (`frontends/shell/src-tauri/src/lib.rs:448-451 @ 2ffbf957`).
  - Piece 1c's step 1 adds a machine store "through the existing `data_dir`". That is on `cut/b2-piece-1c-save-and-reopen`, not read here. Its form declares `data_dir`, `SkpHost::new` and `kernel/src/permission/**` unchanged by 1c (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:680 @ 2ffbf957`).
  - LOD tier root: `tier_directory` (`engine/src/lod.rs:1162-1180 @ 2ffbf957`) reads `LOCALAPPDATA` with no cfg, so its real rule is wherever `LOCALAPPDATA` is set (W3-A's correction, `state/cloud/wave3/W3-A.md:100-102 @ 2ffbf957`). Its only caller is `build_tiers` (`engine/src/lod.rs:1027 @ 2ffbf957`), which has no product caller. Its typed refusal is `engine.lod_tier_root_unresolved` (`:202-209`).
- **Case policy:** `component_eq` (`kernel/src/permission/audit/normalize.rs:178-194 @ 2ffbf957`) and `is_inside` (`kernel/src/permission/audit/log.rs:383-401 @ 2ffbf957`) fold ASCII case on Windows only. A recorded destination's parent is canonicalized by `resolve_destination` (`kernel/src/permission/grant.rs:184-214 @ 2ffbf957`).
- **Hypotheses:**
  - **H1:** on macOS, `std::fs::canonicalize` returns each existing component in its on-disk case on a case-insensitive APFS volume. This comes from knowledge of the platform and has not been observed. Discriminator: K1 at E1. If H1 is false, that is I8.
  - **H2:** the same holds on Windows/NTFS. Discriminator: K1, run locally.
  - **H3:** `macos-latest` is Apple Silicon running macOS 14 or later. Discriminator: the profile (§2 item 1). If false, that is I4.
  - **H4:** the macOS runner's temp volume is case-insensitive. Discriminator: K1's precondition. If false, that is I12.
- **Intake** (the node's list, plus the routed notes from PORT-1's gates):

| Item | Disposition |
|---|---|
| W3-A A-3: an empty or relative `XDG_DATA_HOME` (`state/cloud/wave3/W3-A.md:147-163 @ 2ffbf957`; custodian, `:188`) | **In**, §2 item 2. Extended to every variable the boundary reads (OPEN-2). |
| 1c-1 (a): the tier root follows `LOCALAPPDATA` on any OS | **In**, §2 item 3 (OPEN-D). |
| 1c-1 (b) | It is A-3. **In**, for the tier root as well. |
| 1c-2: the case candidate on macOS (`state/directives/PORTABILITY-2026-09-30.md:26 @ 2ffbf957`) | **In**: K1 verifies it. No product change. |
| 1c-2 (a): case-insensitive Linux mounts (`state/cloud/wave3/W3-A.md:104 @ 2ffbf957`) | **Out, declared.** K1 is ignored on Linux with a reason. A casefold mount needs privilege or an install, which the human's word does not cover. |
| 1c-2 (b): Windows' ASCII-only fold | **Out.** Node `windows-case-fold-non-ascii`. |
| Observation 2: the POSIX file mode (`state/cloud/wave3/W3-A.md:167 @ 2ffbf957`; `:197`) | **Out.** No confidentiality claim covers it. The mode is unchanged at the new macOS location. |
| A-1 and A-2 (backslash, hostname) | **Out.** Nodes `posix-backslash-in-shared-path-logic` and `redaction-hostname-off-windows`. macOS takes the same code paths, and nothing here claims either. |
| PORT-1 note: T1 pins the site counts per file (`PORT-1-LINUX-L1-PREREGISTRATION.md:439-442 @ 2ffbf957`) | **In**, §2 item 5. |
| PORT-1 note: P3 is derived from a sorted `--list` set difference at P1 | **In**, §5. |
| The 19 off-Windows watcher compile-outs (`PORT-1-LINUX-L1-PREREGISTRATION.md:380-387 @ 2ffbf957`) | Disclosed. They are the same on macOS (`cfg(windows)`). |

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
  - Files not edited: `MACOS-BRINGUP.md` (paused: `PLAN.yaml:3461 @ 2ffbf957`), PORTABILITY, and every other piece's form.
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
   | none resolved | audit log: the publish refuses by `resolve_log_path`'s existing error (`kernel/src/permission/audit/log.rs:355-361 @ 2ffbf957`); session store: `record_step` refuses as today; tier: `engine.lod_tier_root_unresolved` | same | same | same |

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

   **`scripts/plan/cfg-boundary.test.mjs`** T1's expected map (`:75`, `:83-88 @ 2ffbf957`) becomes 19 sites in 7 files: `app_dirs.rs` 3, `lod.rs` 2, `watch.rs` 3, `origin.rs` 2, `log.rs` 1, `normalize.rs` 2, `error.rs` 6.
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
    - macOS: the data directory is supported at its native location; the tier root is **unavailable** (typed refusal, deferred by `engine/LOD-PREREGISTRATION.md:594 @ 2ffbf957`, and §8's item at `state/directives/PORTABILITY-2026-09-30.md:147 @ 2ffbf957`).
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
*(Custodian's note, not part of the form: `MACOS-BRINGUP.md:143 @ 2ffbf957` and `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:369 @ 2ffbf957` state the old macOS location. The first is noted in `port-4-l2-smoke`'s summary for its resume. The second goes to 1c's next amendment as class 3, after this piece merges.)*

### The drafted words, each checked clause by clause against §2's design (the gates re-check each one against the code at the head)

**W1. KNOWN-LIMITATIONS item 1, replacing the line at `KNOWN-LIMITATIONS.md:30 @ 2ffbf957`.**
- Not the human's wording: its source comment, `:32`, names no approval. The worker applies it and the PR body lists it.

```
   - **macOS on Apple Silicon** (the image GitHub's `macos-latest` label runs; each run reports its version): L1 for the Cargo workspace only. Its suite compiles and passes in CI, and every run lists the tests it ignores. The file watcher's own tests do not run there (item 24). Not the Tauri shell, not L2, not L3, no Intel Mac, and no macOS version CI has not run.
```

- **Clause check:**
  - "L1 … workspace only": E1 and E4 on the `--workspace` commands (`.github/workflows/product-ci-rust.yml:221-234 @ 2ffbf957`).
  - "lists the tests it ignores": the list step carries no OS condition (`:238-240`).
  - "watcher's own tests do not run": they are compiled out by `cfg(windows)`, as on Linux (PORT-1 Amendment 1, item 3).
  - "not the Tauri shell": it is outside the workspace.
  - "Apple Silicon" and "no version CI has not run": P6.
- **Not covered**, named for the source comment: the line holds of main only while later runs stay green (E4's withdrawal rule).

**W2. The item 1 source comment:** it adds `the macOS line is proved by PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md E1 (the product-ci-rust macos-latest entry)`. No run id and no `path:line`.

**W3. Item 43's location clause.**
- **This is the human's wording** ("Approved as drafted by the human", `KNOWN-LIMITATIONS.md:401 @ 2ffbf957`). The human answers yes, gives their own words, or accepts it as it stands.
- It replaces "on Windows under … unless `XDG_DATA_HOME` is set." (`:400`) with:

```
on Windows under `%LOCALAPPDATA%\spatial-ide\sessions`, on macOS under `~/Library/Application Support/spatial-ide/sessions`, and on Linux under `~/.local/share/spatial-ide/sessions`, or under `spatial-ide/sessions` in `XDG_DATA_HOME` when that is set to an absolute path.
```

- **Clause check:** `default_root` is the data directory joined with `spatial-ide/sessions` (`kernel/src/session_history.rs:130-134 @ 2ffbf957`), and the data directory follows §2 item 2's table on each platform (Windows, macOS, Linux; `~` means `HOME`).
- **Not covered**, for the source comment: a `LOCALAPPDATA` or `HOME` that is unset or not absolute. Then nothing is kept and `record_step` refuses. Ordinary use does not reach it, because the OS sets both.
- **Timing:** the words must land in this PR. Merged without them, the macOS clause is false.

**W4. `kernel/PERMISSION-BOUNDARY.md:190`.** Not the human's wording. The worker applies it.

```
| **Location** | `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl` (Windows); `$HOME/Library/Application Support/spatial-ide/audit/publish.jsonl` (macOS); `$XDG_DATA_HOME/spatial-ide/audit/publish.jsonl` when `XDG_DATA_HOME` is an absolute path, else `$HOME/.local/share/spatial-ide/audit/publish.jsonl` (Linux and other Unix). A variable that is unset or not absolute resolves nothing, and the publish refuses before anything exists |
```

- **Clause check:**
  - the join: `kernel/src/permission/audit/log.rs:362 @ 2ffbf957`;
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
- **Clause check:** on Windows, `tier_cache_dir` errs only when `LOCALAPPDATA` is unset or relative; elsewhere it always errs (OPEN-D (A)). The kept sentence, a tier never written beside its source, holds because `build_tiers` returns at `engine/src/lod.rs:1027 @ 2ffbf957` before any write.

---

## Rule (00) at 2ffbf957 (`AUTONOMY.md:609 @ 2ffbf957`)
- **#241** (`cut/bundle-redaction-scan`). Its paths, as `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md` and 1c's §2.14 list them, are:
  - `kernel/src/bundle/redaction.rs`, `kernel/src/publish/`, `permission/boundary.rs` and `audit/reader.rs`;
  - `kernel/tests/typed_terminal_codes.rs` and `kernel/tests/permission_boundary.rs`;
  - `engine/src/fixture.rs`, `engine/README.md` and `kernel/README.md`;
  - `.github/workflows/product-ci-viewer.yml`;
  - KNOWN-LIMITATIONS item W6.

  These are disjoint from this piece: `log.rs` is not `reader.rs`, `product-ci-rust.yml` is not `product-ci-viewer.yml`, E-L uses `write_geoparquet` without editing it, and the KNOWN-LIMITATIONS items differ.
- **#244** (`cut/walkthrough-row-f7-cli-refusal`): walkthrough Part F. Disjoint. The order of #244, then #241, with no main commit between them, means this PR does not merge between those two clicks.
- **Milestone 4 PR A** (`cut/b1-shell-half-pr-a`): shell paths. Disjoint.
- **1c step 1** (`cut/b2-piece-1c-save-and-reopen`): its groups are at `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-458 @ 2ffbf957`.
  - **One shared file:** `kernel/tests/no_generation_in_persisted_artifacts.rs` (OPEN-C).
  - **Otherwise disjoint:**
    - the kernel's `lib.rs` and `session_history.rs`, `protocol/`, `Cargo.lock`, `SkpHost::new` and `kernel/src/permission/**` are untouched here;
    - `data_dir` keeps the interface 1c calls.
  - 1c's §2.9 macOS sentence goes stale once this piece merges (§10 note).
- **`questions-mirror-item-count`** (`cut/questions-mirror-item-count`): `scripts/hooks/questions-mirror*.mjs`. Disjoint from `scripts/plan/cfg-boundary*`.
- **`covering-case-collision-binds-other-column`** (engine, drafting; its form is not committed).
  - It shares no code with the filesystem case policy: its case is DuckDB's binder, not a volume.
  - Contact points: `engine/src/lib.rs` (this piece adds one line), and KNOWN-LIMITATIONS, where separate items are disjoint.
  - The custodian reads its Scope at dispatch. If it names `engine/src/lib.rs` or `engine/src/lod.rs`, the two pieces are sequenced.

## OPEN items
- **OPEN-1. A macOS profile step.**
  - (a) A `Runner profile (macOS)` step running `sw_vers -productVersion && uname -m`. It installs nothing and adds no entry, but it is a workflow line beyond the entry the human's word names.
  - (b) No step; P6 is read from the job's "Set up job" image line.
  - **Recommend (a)**, put to the human as within the word. Take (b) if the custodian reads the word strictly.
- **OPEN-2. Windows' absoluteness check.**
  - (a) Absolute-only on every platform. R1, and `resolve_log_path`'s promise that a reader and a writer resolve one file (`kernel/src/permission/audit/log.rs:334-339 @ 2ffbf957`). It changes Windows only for an empty or relative `LOCALAPPDATA`, which ordinary use never has.
  - (b) The Windows arm stays byte-identical. M4 and M5 are then observable only on the probe.
  - **Recommend (a).** It is named because Windows is the reference profile.
- **OPEN-A. Where the boundary lives.**
  - (A) `engine/src/app_dirs.rs`, with kernel `data_dir` delegating to it.
    - The engine is the lowest crate that needs the boundary (its LOD cache), and the kernel already depends on it.
    - `engine/src/watch.rs` is a precedent: an OS-mechanism boundary in `engine/` that the shell and kernel consume.
    - The tension: `docs/02_Architecture.md:26 @ 2ffbf957` says `engine/` holds the data-engine module "and nothing else" (the docs/02 words, quoted from that line). A per-user data directory for the audit log is not strictly data-engine work.
  - (B) The kernel owns the boundary and passes the tier root into `build_tiers`. That changes an entry point with no product caller, and all 14 LOD tests' calls, and moves LOD Amendment 1's location ruling out of the engine.
  - (C) A new crate, which means a module-map change and an ADR.
  - **Recommend (A)**, with the docs/02 reading recorded in §1 for the gate to test. If the gate reads docs/02:26 as forbidding it, (B) is the fallback.
- **OPEN-B. Merge order against 1c.**
  - (a) Merge when green. Whichever lands second runs the other's tests on macOS, and 1c's PR would then meet a CI entry its form never planned for.
  - (b) This PR waits to merge until 1c step 1 merges, so E1 runs 1c's tests on macOS here, where any failure is this piece's I1.
  - **Recommend (b).** It also fits the human's placement line of 2026-09-30, "not ahead of … B2" (`state/directives/2026-09-30-portability-and-handoff.md:19-20 @ 2ffbf957`, the words byte-copied from those lines). Whether item 6 of 2026-10-23 lifts that line is the human's call.
- **OPEN-C. The one LOD reason in `kernel/tests/no_generation_in_persisted_artifacts.rs`, which 1c step 1 also edits.**
  - (a) With OPEN-B (b): it is edited in a commit after 1c step 1 merges, with main merged into the branch first.
  - (b) It is left stale and routed to a docs-lane node.
  - **Recommend (a).**
- **OPEN-D. The tier root off Windows.**
  - (A) Unavailable, keyed on the platform. This closes 1c-1 (a). Amendment 8(a) stays owed, and PORTABILITY §8 defers it. Free space is `None` there anyway, so a root would only change which refusal fires.
  - (B) Native cache roots now (`~/Library/Caches`, `XDG_CACHE_HOME` or `~/.cache`), which discharges half of 8(a).
  - **Recommend (A).**
- **OPEN-E. W3, item 43's words.** These are the human's. Yes, their own words, or accept as it stands.

## What I could not settle
- **H1 (macOS `canonicalize` case):** this comes from knowledge of the platform, not observation. K1 at E1 decides it.
- **The macOS runner's disk and memory headroom for a cold DuckDB build:** unknown. It is covered by I2.
- **Whether an existing test fails on macOS:** unknown. E0 decides.
- **A candidate found in passing, not in scope:**
  - The normalization roots are read from the environment uncanonicalized (`kernel/src/permission/audit/normalize.rs:116-142 @ 2ffbf957`), while destinations are canonicalized. On macOS, `/var` is a symlink to `/private/var`, so the `TMPDIR` root would never match a recorded destination.
  - The redaction needle `/var/folders/` would still name the class.
  - `a_destination_under_a_user_profile_path_is_normalized_in_the_record` then skips its token assertion silently (`kernel/tests/permission_boundary.rs:728-746 @ 2ffbf957`).
  - This comes from platform knowledge, not observation. It goes to the custodian as a candidate node.
- **1c's new `data_dir` call sites on its branch:** not read (no git). The custodian reads them by symbol at dispatch (I10).
- **`covering-case-collision-binds-other-column`'s paths:** its form is not committed.
- **Whether KNOWN-LIMITATIONS item 1's levels paragraph was ever approved by the human:** its comment names no approval, so it is read here as not the human's.
- **Whether `engine/README.md` needs an owner's-index row for a new module:** not settled. It is shared with #241, so it is not edited here.
- **No span hashes** were computed (no shell).

Files read (absolute):
- C:\dev\spatial-ide\PLAN.yaml
- C:\dev\spatial-ide\state\directives\2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\state\cloud\wave3\W3-A.md
- C:\dev\spatial-ide\PORT-1-LINUX-L1-PREREGISTRATION.md
- C:\dev\spatial-ide\.github\workflows\product-ci-rust.yml
- C:\dev\spatial-ide\kernel\src\permission\audit\log.rs
- C:\dev\spatial-ide\engine\src\lod.rs
- C:\dev\spatial-ide\kernel\src\session_history.rs
- C:\dev\spatial-ide\kernel\src\permission\audit\normalize.rs
- C:\dev\spatial-ide\kernel\src\permission\grant.rs
- C:\dev\spatial-ide\kernel\B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md
- C:\dev\spatial-ide\MACOS-BRINGUP.md
- C:\dev\spatial-ide\scripts\plan\cfg-boundary.mjs
- C:\dev\spatial-ide\AUTONOMY.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
