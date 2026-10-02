# PORT-1 — Linux L1 for the Cargo workspace: a pinned ubuntu-24.04 entry in product-ci-rust, the cfg boundary check, the stale runner comment, per-platform levels in KNOWN-LIMITATIONS 1, and R3 in the preregistration template (PLAN node `port-1-linux-l1`) — preregistration

**Authority:** question round 33, items 6 and 7 (RULED 2026-10-02, question round 33), cited by round and item and not reproduced. The 2026-09-30 portability direction and handoff, the human's direction line, `state/directives/2026-09-30-portability-and-handoff.md:15-20` @ d310206 sha256:0903aa4aa83c5856b7c92aa811023ed4ba416a0cd099cbc8be424f034383d3f3. The plan that line adopts: §6, `state/directives/PORTABILITY-2026-09-30.md:119-133` @ d310206 sha256:efd05728ea3df4712dfae1f72c66683abd78b772e8dfc5d76ea0292511b039b7, and §2, `state/directives/PORTABILITY-2026-09-30.md:31-65` @ d310206 sha256:c69eed809fbffa8c0d0ee6f3a750039e2a0d6ce17e17a021cef170ef24f6699b. PORTABILITY is Fable's text, filed under the human's line. It is not the human's words, and nothing below quotes it. Item 7's adopted profiles are the mirror's item text, `state/questions/round-33.md:45-47` @ d310206 sha256:e755f57cb991ed935e34d510ce8ba5a0f44742d17645c682df987d7b48cc256d, which is not the human's words. Node: `PLAN.yaml:3329-3345` @ d310206 sha256:dd234cc14566dc7729693c86f92760b2444c9d30d4ac59fd432b0a851d014de7.
**Drafted by** the architect agent on the custodian's brief, read at `main` d310206 (consult: `state/consults/2026-10-02-port-1-linux-l1-architect-draft.md`). Shape models: `WORKSPACE-RUSTFMT-PREREGISTRATION.md` and `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:**
- (1) Every span hash, computed at d310206, since the architect had no Bash. The three dot-prefixed workflow pins carry their hashes in words: one per range for product-ci-rust's four ranges, in their order.
- (2) Question round 39 (RULED 2026-10-02), item 1 pins the Linux entry to `ubuntu-24.04`, not `ubuntu-latest`. It changes the title line, H3, §1 may-claim 1, §1's runner-image may-not-claim and §2 item 1's Linux entry. The governance job keeps `ubuntu-latest`, as governance-ci's other job does.
- (3) The consult's path in the line above.
- (4) This line.

Nothing else changed. On the consult's points:
- main had no branch protection and no rulesets when read, so the Windows check's rename blocks nothing (point 1);
- dispatch waits for PR #160 to merge (point 3);
- the EDQUOT/EPERM and SIGTERM intake items are routed as proposed nodes (point 6);
- PLAN's node takes this form as its gate and `merge: merge-commit`, in the same commit (point 8).
**Gating:** full.
- **The binding head is §21c's size bound** (`AUTONOMY.md:347-357` @ d310206 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31): about 600 lines over 13 files (§7).
- **The other §21a heads** (`AUTONOMY.md:315-332` @ d310206 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3):
  - no wire;
  - no security-posture change: the new governance job reads only, under the workflow's existing `contents: read`, and product-ci-rust's permissions are untouched;
  - the guarantee head is read as engaged, because KNOWN-LIMITATIONS 1 gains a stated support level (R5).
- PORTABILITY §6 names the reviewer, plus the architect for the template change. Full gating covers both.
- Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- **Reasoned from code at d310206. Nothing was run.**
- **The cfg sites in product source** (a Grep of every tracked `.rs` outside test targets and the excluded crates):
  - Eighteen occurrences sit in six files that §2's table names (`state/directives/PORTABILITY-2026-09-30.md:37-45` @ d310206 sha256:da37f199a78a71a33125784031fedf483c3fbaf96de7b4a45ce3358a00d99c53):
    - `engine/src/watch.rs` 3;
    - `engine/src/lod.rs` 2;
    - `kernel/src/publish/error.rs` 6 (`kernel/src/publish/error.rs:443-456` @ d310206 sha256:dd1c1c67599d3fe6668fb44fa43150420f91b430c0746b69be704172b5cb3651, which includes `cfg(not(any(windows, unix)))`);
    - `kernel/src/permission/audit/log.rs` 3;
    - `kernel/src/permission/audit/normalize.rs` 2;
    - `frontends/shell/src-tauri/src/origin.rs` 2 (`frontends/shell/src-tauri/src/origin.rs:172` @ d310206 sha256:3228849d8dd1cf2b7fa9571056ea41417fa77dcb01813a080febe5f1a89acc97).
  - One more site sits inside a `#[cfg(test)] mod`, in a file that is not a boundary: `kernel/src/permission/boundary.rs:527-542` @ d310206 sha256:6ce782479ffdafabf7f000d0f1a1cfd8919ba3cd0b6122749c1751a0381e206b. It is a Windows-path assertion inside a test that runs on every platform. A ruled piece made it Windows-only (`engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md:8` @ d310206 sha256:71062bb1029fa20fe38d3d0b88fd32d4c202d34ad26534863d22090e098190fd).
  - Nothing sits outside a boundary.
- **Test-side inventory:**
  - **The 14 off-Windows LOD-tier ignores.** `git grep -c 'Windows-only LOD tier root' d310206 -- '*.rs'` gives 14 over four files: `engine/tests/lod_tier_builder.rs` 11, `engine/tests/lod_tier_cancellation.rs` 1, `engine/tests/lod_tier_preflight.rs` 1 and `kernel/tests/no_generation_in_persisted_artifacts.rs` 1. Their deferral record is `engine/LOD-PREREGISTRATION.md:594` @ d310206 sha256:11ec844833fdf06159469f77e85f199dd781b180814803be20f81491ff285751.
  - **The three bare ignores:**
    - `kernel/tests/publish.rs:668-669` @ d310206 sha256:e5c513ef5c1e83a1a951ddbe12c6f83cf82a1eff4596f081cde483722f02b5dc;
    - `kernel/tests/publish.rs:738-739` @ d310206 sha256:e5c513ef5c1e83a1a951ddbe12c6f83cf82a1eff4596f081cde483722f02b5dc;
    - `kernel/tests/permission_boundary.rs:1056-1057` @ d310206 sha256:e5c513ef5c1e83a1a951ddbe12c6f83cf82a1eff4596f081cde483722f02b5dc.
  - **A whole test compiled out off Windows:** `kernel/src/permission/audit/normalize.rs:293-299` @ d310206 sha256:22f3904dc0ffae6bbb457184e463917ecbd0a056842b634bf4ebc98140a73d94.
  - **Three whole test targets compiled out off Windows, all on the file-watching boundary (KNOWN-LIMITATIONS item 24):**
    - `engine/tests/source_watch_adapter.rs:11` @ d310206 sha256:c86a291c14354a8a1a619687603e0f192ab95deee3b50a4770eb81cd2ef61908;
    - `kernel/tests/source_watch_windows.rs:11` @ d310206 sha256:c86a291c14354a8a1a619687603e0f192ab95deee3b50a4770eb81cd2ef61908;
    - `kernel/tests/watcher_first_read_windows.rs:14` @ d310206 sha256:c86a291c14354a8a1a619687603e0f192ab95deee3b50a4770eb81cd2ef61908.
- **The workflows.**
  - `.github/workflows/product-ci-rust.yml` lines 14, 24-25, 30-43 and 180-193 at d310206, sha256 8dddc5b7406a10da83958be28323ed82b62fa7d7d70183f2fc1d0706294b223c, cc8521f2937395dc239af53df9ffa3694aa9c26150ae2c393fc9dff984219ab7, cfcf4927e82efe7dbb4a624c99684a17c431954595ab17ece6d2697019c7761a, d48db216f0c0d8248bdd237584f80dfc4180fb9433d26d50e6a515c30822c0bd respectively: what green means, the stale runner note and the one-entry matrix. The file sets no `RUSTFLAGS` and no `-D warnings`.
  - `.github/workflows/governance-ci.yml` lines 68-97 at d310206, sha256 9ac5f064e52210bb566b6374d7fbc4d459614ba7d429a390502423d673541326: its `paths` name no `.rs` file.
  - Shape model: `.github/workflows/rust-fmt.yml` lines 1-28 at d310206, sha256 1c6bf53c8f022c5b3cd5e5fc9b22ca68b9d9b1c4deece884ddf735cdf65cbe11.
- **Wave-3 cites** are dated before 51ed3b2 and resolve under AUTONOMY.md §29. This form re-pins every span it relies on at d310206. No record is edited.
- **H1 (hypothesis): `cargo test --workspace --locked -- --list --ignored` lists exactly the tests that the run step reports as ignored.** Discriminator: E1. If false, that is I9.
- **H2 (hypothesis): a job whose `name:` is a matrix expression reports exactly that string as its check name**, so Windows keeps `cargo test --workspace (windows-latest)`. Discriminator: E1's job names. If false, that is I3.
- **H3 (hypothesis): `ubuntu-24.04` is Ubuntu 24.04 x86_64 at E1.** Discriminator: the profile step (§2 item 1). If false, that is I4.
- **H4 (hypothesis): governance-ci's widened `push` filter fires on a fast-forward push that touches only an `engine/src` `.rs` file.** Discriminator: E3b. If false, that is I8.
- **Open Rust work.** PR #160 touches its §7 list (`protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:183-196` @ d310206 sha256:d35e008772793da2165d4f344051727f8de1b1ccf8773deddc0275f245d42234). None of those files is in §7 below. The one interaction: #160's tests first run on Linux in whichever PR's CI carries both pieces (§2 item 0).
- **Cache.** A second `Swatinem/rust-cache` key shares the repository's cache allowance with the Windows key. The Windows job's cache line is read at E1 and E4. This is not a gate condition.
- **Fixture drive:** nothing is measured.

### Intake (the node's wave-3 list)
| Item | Disposition |
|---|---|
| Linux 777 / 0 / 54 at a023546 (W3-B) | Context only. The predictions are set differences against Windows (§5), not counts. |
| The 14 reasons name the mechanism, not the boundary | **In**, §2 item 4. |
| WAVE3-1, the unused `WATCH_BUFFER_BYTES` off Windows (`engine/src/watch.rs:71` @ d310206 sha256:6b918ba33eca709baac9cc223d901aa24159dfb08bf43d227495cd4ca8e2e9b9) | **Out.** No job denies warnings (§8 item 2). A warning-free Linux build is not claimed. |
| WAVE3-2, three bare ignores | **In**, §2 item 5. |
| W3-A observation 4, two assertions compiled out | **In** for normalize.rs (§2 item 6). **Out** for boundary.rs: it is an assertion in a test that runs everywhere, ruled by #140, and splitting it out would change Windows' `--list`. |
| EDQUOT and EPERM in the unix tables (`kernel/src/publish/error.rs:448-451` @ d310206 sha256:c2cde56ef088ff06067f4c1a2b3a300a2669ffac794bbfbd44e5cebce72d6fc7) | **Out.** It changes a user-visible error class. Routed by the custodian. |
| SIGTERM in publish-bundle (`kernel/src/bin/publish-bundle.rs:674-694` @ d310206 sha256:9cd6c20085c687d43cb3779c93170162d64958d7b460bccf51984708434577fc) | **Out.** It is new cancellation behaviour, under ADR-018's head. Routed by the custodian. |
| The three whole-file watcher targets | **Out, disclosed.** A declared limitation (KNOWN-LIMITATIONS 24), not added here (§1). |
| W3-A A-1 to A-3, the 1c corrections | **Out.** They have their own nodes and port-2. |
| `engine/Cargo.toml`'s `cfg(windows)` dependency table | **Out of the check**, which scans `.rs` only (§1). |

## §1. May and may not claim
- **May claim:**
  1. The ubuntu-24.04 entry builds every workspace test target and runs the ordinary suite with 0 failed (E1, E4).
  2. Each run of either entry prints its ignored list.
  3. Linux's ignored list differs from Windows' by exactly 15 names, each with a reason that names its §2 boundary (§5 P2).
  4. The Windows test set is unchanged (§5 P4), and so is its check name (H2).
  5. `scripts/plan/cfg-boundary.mjs` exits 0 on the tree and exits 1, naming the path and line, on an OS-naming cfg form in product source outside §2's boundary files (T1 to T6, E2, E3b).
  6. KNOWN-LIMITATIONS 1 states each platform's level (§2 item 7).
  7. The template carries R3 as one appended line.
- **May not claim:**
  - Linux L1 for `frontends/shell/src-tauri` or any excluded crate; L2; L3; macOS; any other distribution or architecture (R5).
  - That the printed list is every test Linux does not run: the three whole-file watcher targets are compiled out and are named in §0 instead.
  - A warning-free Linux build.
  - That either new check is required for merge. That setting is the human's (`AUTONOMY.md:302-304` @ d310206 sha256:b470ee4fdd8973a7a8c13bba7f2ce944351a38e994b899e7b3304ad60c092994).
  - That the `ubuntu-24.04` image keeps its contents after E1. The profile step reports the OS version on each run.
  - OS coupling the check cannot see:
    - test code;
    - `Cargo.toml` target tables;
    - runtime checks such as `std::env::consts::OS`;
    - separator or case assumptions without a cfg.
    These stay the gates' to read under R4.
  - Any `docs/08` figure. CI durations are not measurements.
- **Unchanged:**
  - every test's name and body;
  - every product (non-test) source line;
  - product-ci-rust's triggers, `paths`, concurrency, timeout, toolchain action, cache key expression and its two `cargo` commands;
  - the Windows check name;
  - governance-ci's `plan` job and its steps;
  - every other workflow;
  - every Cargo manifest and lockfile;
  - no new dependency, no `package.json`, and no action beyond those already in use.

  ADR-006 does not apply: this is CI, tests' gating and documentation. No ADR is amended.
- **Seams:**
  - product-ci-rust into `cargo` on a Linux runner: E1.
  - GitHub's check naming from a matrix `name`: E1 (H2).
  - governance-ci into the check's CLI, a process boundary: E2, which is green, and E3b, which is red.
  - The check into the real tree: T1 runs on the repository itself, and T2 and T3 use files read from `HEAD`.
  - No export, no flag and no option lands. The tests spawn the shipped CLI (`process.execPath`), and its only product caller is the governance job, which lands in the same PR.

## §2. The change
0. **P1, the base.** The base is `main` at dispatch, after this form's commit and after PR #160's merge.
   - If `git diff --quiet d310206 <base> -- '*.rs'` fails, §0's inventory is re-derived at the base and recorded before any code.
   - A Rust PR that merges to main before E1 is merged into this branch, and E1 is read at the merged head.
1. **`.github/workflows/product-ci-rust.yml`:**
   - The job's `name:` becomes `${{ matrix.job_name }}`. The matrix becomes `include:` of two entries:
     - `os: windows-latest`, `job_name: "cargo test --workspace (windows-latest)"`;
     - `os: ubuntu-24.04`, `job_name: "L1 portable correctness · cargo test --workspace (ubuntu-24.04)"`.
   - A step `Runner profile (Linux)`, `if: ${{ runner.os == 'Linux' }}`, which runs `grep -E '^(NAME|VERSION_ID)=' /etc/os-release && uname -m`.
   - The build step gains `id: build`. Its command is unchanged.
   - After the suite step, which is unchanged: `List the ignored tests (PORTABILITY R6)`, with `if: ${{ !cancelled() && steps.build.outcome == 'success' }}`, running `cargo test --workspace --locked -- --list --ignored`.
   - **Comments.** Lines 14, 24-25, 30-43 and 186-188 at d310206 are rewritten:
     - what green means, per entry;
     - Linux L1 for the workspace only, by reference to this form;
     - the stale "nothing has established" premise is replaced.
   - The 2026-08-06 note, the 2026-08-07 note and the Resolved section are kept as they are. The comments quote nothing.
2. **`.github/workflows/governance-ci.yml`:**
   - Both triggers' `paths` gain `"**/*.rs"`.
   - A new job `cfg-boundary`, named `cfg boundary (PORTABILITY R2)`, on `ubuntu-latest` with `timeout-minutes: 5`. Its steps:
     - `actions/checkout@v4` with `persist-credentials: false`;
     - `actions/setup-node@v4` with `node-version: "24"`;
     - `node scripts/plan/cfg-boundary.mjs`.
   - The header gains one section: what the job's green means (§1 may-claim 5), what it does not (§1, by reference), and that the widened filter also runs the `plan` job on Rust-only pushes. It quotes nothing.
3. **`scripts/plan/cfg-boundary.mjs`** (new, Node standard library only, no arguments):
   - **(a) The file list.** It reads `git ls-files -z -- '*.rs'` in the working directory and drops:
     - paths under `spikes/` or `protocol/transport-bakeoff/`;
     - any path with a `tests/`, `benches/` or `examples/` directory segment.
   - **(b) Blanking.** In each file it blanks comments (line comments, and nested block comments), string literals (raw strings included) and char literals. Newlines are kept, so line numbers hold.
   - **(c) Test modules.** It drops the body of each `#[cfg(test)]` item that is `mod <ident> {`, up to its matching brace.
   - **(d) Sites.** A site is any `cfg!(…)`, `cfg(…)` or `cfg_attr(…)` whose predicate holds the whole identifier `windows`, `unix`, `target_os` or `target_family`. For `cfg_attr`, the predicate is the first top-level argument. A site may span lines, as in rustfmt's wrapped attributes.
   - **(e) The allowlist.** The allowlist is in the script, taken from §2's table. Each entry is a path with its label(s):
     - `engine/src/watch.rs`: file watching;
     - `engine/src/lod.rs`: application directories and free space;
     - `kernel/src/permission/audit/log.rs`: application directories and filesystem case policy;
     - `kernel/src/permission/audit/normalize.rs`: filesystem case policy;
     - `kernel/src/publish/error.rs`: OS error classification;
     - the prefix `frontends/shell/src-tauri/`: native integration and packaging.

     An entry is added only by an architect-reviewed change. The header says so and quotes nothing.
   - **(f) Output and exits** are as §7 declares.
4. **The 14 off-Windows reasons** become §7's LOD reason, in the four files of §0. The predicates are unchanged.
5. **The three bare `#[ignore]`** become `#[ignore = "<§7's release-only reason>"]`.
6. **`case_differences_collapse_on_windows`.** In `kernel/src/permission/audit/normalize.rs`, its `#[cfg(windows)]` becomes `#[cfg_attr(not(windows), ignore = "<§7's case-policy reason>")]`. The body is unchanged. It still runs on Windows, and Linux compiles it and lists it as ignored.
7. **KNOWN-LIMITATIONS item 1.**
   - It keeps its v0.1.0 text and its source comment.
   - It gains §7's per-platform paragraph, scoped to `main`, not to the v0.1.0 artifact.
   - Its new source comment names PORTABILITY R5 and §6 item 4, question round 33, items 6 and 7, and this form's E1. It carries no run id and no `path:line`.
   - No other item is edited.
8. **`docs/PREREGISTRATION-TEMPLATE.md`:** §7's R3 line, appended after the file's last line. Nothing above it is edited.
9. **Merge:** a merge commit only. The custodian sets the node's `merge: merge-commit` with this form's commit.
10. **Portability of this piece** (R1 to R6):
    - **R1:** no shared semantics change.
    - **R2:** no OS-conditional product code is added. Item 6 uses R2's permitted test form.
    - **R3:** the check is OS-independent tooling. It runs on Linux in governance-ci and on Windows in the local suite. macOS has no run and no claim.
    - **R4:** no crate, test or filter is excluded on Linux. The only Linux-only ignores are §5 P2's 15 names.
    - **R5:** §1.
    - **R6:** items 4 to 6, and item 1's list step.
    - **The check's own tests:** they take temp dirs from `os.tmpdir()`, spawn `process.execPath` and `git` only, use no symlink and no drive letter, and are not ignored on any platform.

## §3. Fixtures and predicted outcomes
Each scenario uses a fresh temporary git repository (not armed), removed in `finally`, unless it is marked as the real tree.

| # | Content | Exit | Stdout |
|---|---|---|---|
| S1 | the real tree (cwd the repository root) | 0 | 18 site lines over the six allowlisted files (§0), then the count line with 0 outside |
| S2 | `engine/src/predicate.rs` read from `HEAD`, with `#[cfg(windows)]` planted on a new line above one item | 1 | `engine/src/predicate.rs:<planted line> outside every boundary` |
| S3 | `kernel/src/permission/boundary.rs` read from `HEAD`; then the same with `#[cfg(unix)] fn after() {}` appended after its test module | 0; then 1 | nothing for boundary.rs; then the appended line only |
| S4 | a file in a non-boundary path whose only OS-cfg text sits in `///`, `//` and `/* */` comments, a normal string and a raw string | 0 | the count line, 0 sites |
| S5 | a file in a non-boundary path with `cfg!(target_os = "macos")`, `#[cfg_attr(unix, derive(Debug))]`, a rustfmt-wrapped `#[cfg(any(` over three lines with `windows` and `target_family`, `#![cfg(not(windows))]`, plus `#[cfg(feature = "x")]`, `#[cfg_attr(test, allow(dead_code))]` and `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]` | 1 | exactly 4 violation lines, at the declared lines |
| S6 | `#[cfg(windows)]` in `engine/tests/x.rs`, `kernel/benches/b.rs`, `spikes/s/src/lib.rs` and `protocol/transport-bakeoff/src/m.rs` | 0 | the count line, 0 sites |
| S7 | cwd a temporary directory that is not a repository; then the real tree with one argument | 2, 2 | empty; stderr is exactly the matching fact line |

## §4. Tests, one mutation each (`scripts/plan/cfg-boundary.test.mjs`)
- **How a mutation is observed:** apply it, run the named test, record the first failing assertion in that test's `// RECORDED MUTATION:` comment (inside the test, naming the test), then revert. The commit it was observed at is named in the closing record. A `verify-mutation` run is not an observation (round 25, item 2 (c)).
- No timing, no sleep, no network.

| # | Test | Scenario | Mutation |
|---|---|---|---|
| T1 | `the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site` | S1 | M1: `engine/src/lod.rs` dropped from the allowlist |
| T2 | `a_planted_cfg_windows_in_a_shared_engine_module_fails_by_path` | S2 | M2: attribute forms are not matched (only `cfg!`) |
| T3 | `a_cfg_inside_a_cfg_test_module_is_test_code_and_one_after_it_is_not` | S3 | M3: the test-module exclusion is removed |
| T4 | `cfg_text_in_comments_and_string_literals_is_not_a_site` | S4 | M4: blanking is skipped |
| T5 | `every_cfg_form_naming_an_os_is_a_site` | S5 | M5: `target_os` is removed from the token set |
| T6 | `test_targets_and_excluded_crates_are_not_scanned` | S6 | M6: the `tests/` segment exclusion is removed |
| T7 | `a_missing_file_list_or_an_argument_exits_2_with_the_fact_line` | S7 | M7: a failed `git ls-files` is read as an empty list |

- **End-to-end runs from the real shape.** The worker records E1 to E3 by run id, and the custodian records E4.
  - **E1:** the first product-ci-rust run on this PR carrying the Linux entry, by run id, and then the run at the head marked ready. The gates read the latter. It is predicted green on both entries, with P2 to P6.
  - **E2:** governance-ci's `pull_request` run at the head marked ready. `cfg boundary (PORTABILITY R2)` is predicted green, with S1's output, and `node --test` green with T1 to T7.
  - **E3:** the probe branch `probe/cfg-boundary-red`, cut from the piece's head. Plain pushes only: no force-push and no rebase.
    - **E3a:** a creation push of one commit adding `#[cfg(windows)] const _CFG_BOUNDARY_PROBE: () = ();` to `engine/src/predicate.rs`. Whatever runs, and what they show, is recorded. Nothing is predicted.
    - **E3b:** a fast-forward push of one commit touching only that file, adding a second plant under `#[cfg(unix)]`. Predicted: governance-ci runs (H4), and `cfg-boundary` is red, naming both lines.
    - The probe's other runs are not evidence and may be cancelled. The probe is never merged, and it is deleted after the ids are recorded.
  - **E4:** the first push to `main` after the merge. Both entries and `cfg-boundary` are predicted green. A red E4 is answered before any Rust dispatch. KNOWN-LIMITATIONS 1's Linux line is withdrawn by the next PR while it is red.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - **P1:** T1 to T7 pass, and each fails under its own mutation.
  - **P2:** in E1, Linux's `--list --ignored` minus Windows' is exactly 15 names: the 14 LOD-tier tests and `case_differences_collapse_on_windows`. Windows' minus Linux's is empty.
  - **P3:** Linux's `--list` equals Windows' `--list` less the tests of the three whole-file watcher targets (§0).
  - **P4:** Windows' `--list` and `--list --ignored`, run locally and sorted, are byte-identical at the base and at the head.
  - **P5:** E1's job names are §2 item 1's two strings, byte for byte.
  - **P6:** the profile step reports `VERSION_ID="24.04"` and `x86_64`.
  - **P7:** E2, E3b and E4 come out as §4 predicts.
  - Linux's passed count is recorded, not predicted.
- **Declared unchanged:** §1's Unchanged list.
- **Invalidators** (each one stops the piece):
  - **I1:** a Linux test fails. The exception is a test already named by `timing-assertions-under-contention` or `timing-tests-assert-property-not-budget`, which is re-run once with both run ids recorded. A failure goes to the custodian as its own node. No ignore is added here.
  - **I2:** the Linux job runs out of disk or hits the timeout. Any workflow change it needs is declared by an amendment before it is made.
  - **I3:** H2 is false, or the Windows check name changes. This goes to the custodian.
  - **I4:** H3 is false. This goes to the human (the runner label against the round 33 item 7 profile).
  - **I5:** any system package or install is needed. This goes to the human, typed, as what CI installs.
  - **I6:** P4 fails.
  - **I7:** P2 or P3 differs. This is recorded as class 2. An unlisted Linux-only skip or compile-out is reported.
  - **I8:** H4 is false.
  - **I9:** H1 is false.
  - **I10:** the check finds a site outside a boundary at the base. Allowlist growth is the architect's, not this piece's.
- **Falsification:**
  - the Linux job is green with a crate, test or filter excluded;
  - the check exits 0 with a planted site outside a boundary;
  - KNOWN-LIMITATIONS 1 claims more than Linux L1 for the workspace;
  - the Windows test set changes.

## §6. Instruments
Assertions only:
1. Run conclusions and job names: `gh run view <id> --json jobs`.
2. The list outputs: sorted set differences between E1's two list steps, and local Windows `--list` diffs at the base and the head.
3. The profile step's output.
4. The check's stdout and exit status.
5. `git grep -c` for §0's counts, at the base and at the head.
6. `rustc`, `cargo`, `node` and `git` versions, locally and in CI (round 15 (c)).
7. verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit.

## §7. Declared values and ceilings
- **Matrix values:** §2 item 1's two `os` and `job_name` pairs; the step names and the list command; `timeout-minutes: 90` (unchanged).
- **Governance job:** §2 item 2's name, runner, timeout, the two actions and the command. The filter addition is `"**/*.rs"` on both triggers.
- **The check:**
  - the exclusions of §2 item 3 (a);
  - the token set `windows`, `unix`, `target_os`, `target_family`;
  - §2 item 3 (e)'s allowlist.
- **The check's output:**
  - stdout, per site: `cfg-boundary: <path>:<line> <labels>`, or `cfg-boundary: <path>:<line> outside every boundary`;
  - stdout, last line: `cfg-boundary: <n> sites in <f> files, <m> outside every boundary`;
  - stderr: `cfg-boundary: no file list (git ls-files failed)` or `cfg-boundary: takes no arguments`;
  - exit 0 when none is outside, 1 when any is outside, 2 on either stderr line.
- **Reason strings:**
  - LOD: `boundary: application directories (engine/src/lod.rs); deferred by engine/LOD-PREREGISTRATION.md Amendment 8(a)`;
  - case policy: `boundary: filesystem case policy (kernel/src/permission/audit/normalize.rs); the case fold is Windows-only`;
  - release-only: `release-only: needs a source above MAX_FEATURES rows; run by hand with --release -- --ignored`.
- **The KNOWN-LIMITATIONS 1 paragraph.** It is current-state text, and the human may reword it:
  - a lead naming the levels on `main` (not the v0.1.0 artifact), as R5 defines them, a green result at one level saying nothing about the next;
  - **Windows 10/11 x64** (the reference profile): L1, the Cargo workspace suite in CI; L2, the installer build and the operator walkthroughs; L3, the gates `docs/07` records as met on Windows/WebView2, and no others;
  - **Linux, Ubuntu 24.04 x64:** L1 for the Cargo workspace only. Its suite compiles and passes in CI, and every run lists the tests it ignores. The file watcher's own tests do not run there (item 24). Not the Tauri shell, not L2, not L3, and no other distribution or architecture;
  - **macOS:** no level yet.
- **The template line:**
  - Bold lead: `Platform section, conditional`.
  - Then the reference, in this form: R3, `state/directives/PORTABILITY-2026-09-30.md:49-54` @ d310206 sha256:60f4aa60c2364c5acc141be1a32c0d23a3b38f2a9df5d03d40c51cef44bf9959; PLAN node `port-1-linux-l1`; appended at the end, so that no line a record cites above it moves.
  - Then one sentence: a piece that adds or materially changes an OS-dependent feature carries a Portability item in §2 answering R3's three items, which are:
    - its owning boundary (from that directive's §2 table, or one the architect adds);
    - its behaviour on each of Windows, macOS and Linux, in R3's three grades;
    - its tests per platform, and any deferral with where it is recorded.
  - User-visible reductions go into KNOWN-LIMITATIONS.
  - The line reproduces nothing.
- **Size budget:** at most 750 changed lines, insertions plus deletions, over at most 13 files, exactly these:
  - `.github/workflows/product-ci-rust.yml`
  - `.github/workflows/governance-ci.yml`
  - `scripts/plan/cfg-boundary.mjs`
  - `scripts/plan/cfg-boundary.test.mjs`
  - `engine/tests/lod_tier_builder.rs`
  - `engine/tests/lod_tier_cancellation.rs`
  - `engine/tests/lod_tier_preflight.rs`
  - `kernel/tests/no_generation_in_persisted_artifacts.rs`
  - `kernel/tests/publish.rs`
  - `kernel/tests/permission_boundary.rs`
  - `kernel/src/permission/audit/normalize.rs`
  - `KNOWN-LIMITATIONS.md`
  - `docs/PREREGISTRATION-TEMPLATE.md`
- **Counting command:** `git diff --numstat <merge-base>...<head> -- . ':!PORT-1-LINUX-L1-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit. This form is excluded by name.
- An overrun is class 8, and this section is never edited to match.
- **Estimate:**
  - product-ci-rust 80;
  - governance-ci 45;
  - the script 180;
  - its tests 260;
  - the reasons 34;
  - normalize.rs 2;
  - KNOWN-LIMITATIONS 8;
  - the template 1.
- **Minutes:** 180.

## §8. Block-on-sight
1. The Windows entry's check name is not byte-identical. Or its build or test command, toolchain, cache key or timeout changes.
2. `RUSTFLAGS`, `-D warnings`, `continue-on-error`, `|| true`, `--skip`, `--exclude`, a test filter, or any Linux-only exclusion, in either workflow.
3. Any install step (apt, brew, choco, `cargo install`, npm). Or any action beyond those §7 names.
4. A change to product-ci-rust's triggers, `paths` or concurrency. A change to governance-ci's `plan` job. Permissions beyond `contents: read`, or a `secrets.` reference, in the new job.
5. Any of these:
   - a test added, removed or renamed;
   - a platform ignore beyond §2 item 6;
   - an off-Windows reason that does not name its §2 boundary;
   - a reason other than §7's.
6. Any non-test product source change. A new OS-naming cfg anywhere in product source.
7. In the check:
   - an allowlist entry not in §2's table;
   - a flag, option, export or mode;
   - a dependency or a network call;
   - exit 0 on a git failure.
8. KNOWN-LIMITATIONS claims the shell, L2, L3, another distribution or architecture, or a macOS level. Or another item is edited.
9. The template change is more than one line appended at the end, or any line above it is edited.
10. A file outside §7's list, apart from this form (its own appended §10 amendments included) and the custodian's generated set (`PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**`, `state/**`).
11. Any force-push; the probe commit at the gated head; the probe merged.
12. A squash or rebase merge.
13. A user-profile path in the diff, in a commit message or in a record.
14. A quotation in a workflow header, the script, the tests, KNOWN-LIMITATIONS or the template line.
15. A record calling a `verify-mutation` run an observation, or a mutation recorded without its commit in the closing record.
16. A §7 overrun not recorded as class 8, or §7 edited. Any code of a scope addition before its class 9 amendment.
17. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - reproduced text without its script mark and hash;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so.

## §9. Gates
- **Architect:**
  - the Gating line;
  - round 33, items 6 and 7, against §2 and §7's KNOWN-LIMITATIONS paragraph;
  - PORTABILITY §6, scope and acceptance item by item;
  - R1 to R6, including the allowlist against §2's table and the R3 line against its pin;
  - the intake table;
  - the seam reading and the caller rule (§1);
  - the round 7 ruling on operator-visible text (the check states facts);
  - round 25, item 2 (`docs/PREREGISTRATION-TEMPLATE.md:165-176` @ d310206 sha256:45769ff5726170a1404349dc7d163a9c0c3a363b5fc628b2b0523925207f8238; `AUTONOMY.md:476-482` @ d310206 sha256:3680d17dc772d9248e75778adaf853f28acde5a77fde2ff98ffa23728b77e774);
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - M1 to M7 observed;
  - E1 to E3 read by run id;
  - P2 to P5 recomputed from the logs and local lists;
  - the probe's diff;
  - §7 recounted.
- **Suites, green before either gate:**
  - product-ci-rust, both entries;
  - governance-ci, `plan` and `cfg-boundary`;
  - Rust fmt, exposure-scan and DCO;
  - locally on Windows, `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`, and §6 item 7's tools, each with its commit;
  - branch CI read before gating.
- **Operator:** none.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)
