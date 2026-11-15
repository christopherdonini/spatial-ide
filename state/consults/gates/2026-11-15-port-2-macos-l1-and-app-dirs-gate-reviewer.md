Reviewed: PR #324 at cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5 (the custodian's filing note, 2026-11-15: the reviewer, PLAN node port-2-macos-l1-and-app-dirs, under its form (`governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`), the other of its two gates from dispatch; dispatched at 2026-11-15T09:09:49Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (11244 bytes, sha256 66f2bbe008f8c6566e58543a2338ea80e077fa0516fbaade9055960722fce8fb); the run 2026-11-15T09:09:50Z to 2026-11-15T10:26:24Z by its transcript, 136 calls (Bash 125, Read 10, SubagentHandback 1), none errored, model claude-opus-5-5; it wrote only its own scratch files and the seven mutations, each reverted; each run it claims has a call behind it, by the custodian's audit; received at 2026-11-15T10:26:24Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 27917 bytes, sha256 71092212c33dd721eb7fe00df04602cf636665ca3da3d92d4c77f2334c6092d2, with this note added in its first line and two masks: in its last paragraph the scratch folder's path is written <S>, and in check 3's Windows line the temporary folder below the masked profile is written <temp>), gate reviewer (cut/port-2-macos-l1-and-app-dirs @ cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5)
Verdict: PASS WITH NOTES

All seven notes are Documentation. Each comes with replacement words and must be fixed before the merge. No Correctness or Evidence finding is open. The notes are words only (WORDS-ONLY).

## Findings

### Correctness
None. The code at C matches §2 and §2 item 2's table. `data_dir` keeps its name, signature, visibility and file. No cfg was added to product source outside `app_dirs.rs`. Every site in §8 was checked and none fired.

### Evidence
None. E0 to E3 are confirmed by run id and head sha. M1 to M7 each failed under its own mutation, and each revert passed. P2 to P5 were recomputed and hold once main's merge (I11) is separated out (check 4).

### Documentation (must-fix before the merge; none of these is the human's wording)

**D1. Packet flag 1: K1's `RECORDED MUTATION` comment is untrue at C.**
- Where: `kernel/tests/case_policy_volume.rs:73`.
- At C it ends with this byte-copied sentence: "Not observed on macOS: that observation is E3's, and E3 has not run."
- E3 ran as run 43689426988.
- Fix: replace that sentence with:
  > On macOS, E3 (product-ci-rust run 43689426988, at the probe commit 6c86c2c508cc31da5a4e237fd0a6a72a760c01c3, M6 alone) failed the same final equality, left the resolved path itself, in its typed case and not under the profile token, and right `<user-home>/Inner/bundle`.
- Clause check:
  - The run's head sha is 6c86c2c5…, by `gh run view`.
  - "M6 alone": `git diff C origin/probe/port-2-case-policy-red` is one line of `kernel/src/permission/grant.rs`, `let parent =` changed to `let _canonical =`.
  - "the same final equality": macOS job 132736713381 panicked at `kernel/tests/case_policy_volume.rs:100:5`, which is the `assert_eq!` at lines 100-104 at C.
  - "left the resolved path…typed case…not under the token": left is `"/private/var/folders/<m>/T/cASE-pOLICY-pROBE-37088-0/iNNER/bundle"`.
  - "right": right is `"<user-home>/Inner/bundle"`.
- The worker applies it with no re-gate, and the PR body lists it.

**D2. Packet flag 2: item 43's source comment.** This wording goes to the advisor with my draft, because the advisor asked for it (Amendment 8 item 2). The item's own text is not touched.
- Where: `KNOWN-LIMITATIONS.md`, the first comment under item 43 (line 437 at C).
- Defect (a): the comment does not say whose words the changed data-folder clause is.
- Defect (b): no comment carries W3's "Not covered" case (Amendment 5 item 4).
- Draft (a), appended after "…as the comment below says.":
  > Since port-2-macos-l1-and-app-dirs, its data-folder clause, the one naming the folder on Windows, macOS and Linux, is also the human's wording, approved on 2026-10-23 (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md, section 10, W3, and Amendment 1 item 3), and it replaces the clause first approved as drafted.
- Clause check for (a):
  - The approval: the 2026-10-23 directive, item 4, reads "W3: yes to the architect's words for item 43." I read it at line 11 of that file.
  - Amendment 1 item 3 records the same approval.
  - The clause at `KNOWN-LIMITATIONS.md:436` at C contains W3's fenced text byte for byte (checked by script).
- Draft (b), appended to the same comment:
  > Not covered, for the data-folder clause: a LOCALAPPDATA (Windows) or HOME (macOS, and Linux when XDG_DATA_HOME is not an absolute path) that is unset, empty or not an absolute path; then no data folder resolves, nothing is kept, and each step is refused by name. Ordinary use does not reach it, because the system sets both. Where the code does this: engine/src/app_dirs.rs (absolute_value and data_dir_for), kernel/src/session_history.rs (default_root), frontends/shell/src-tauri/src/lib.rs (the recorder is None) and frontends/shell/src-tauri/src/commands.rs (record_step).
- Clause check for (b):
  - `absolute_value` returns None for an empty or non-absolute value (`app_dirs.rs:70-77`).
  - The per-OS variables are at `:80-87`. On Linux, HOME is reached only when XDG_DATA_HOME is unusable.
  - `default_root` maps `data_dir` (`session_history.rs:248-250`).
  - The recorder is `default_root().map(...)`, so it is None when no data directory resolves (`lib.rs:453-454`).
  - `record_step` returns `SkpError::session_history_unwritable` when the recorder is None (`commands.rs:143-147`).
  - "Ordinary use does not reach it" is W3's own Not-covered sentence, from the form's W3.
- The draft has no quotation marks (§8 item 9) and no line cites.

**D3. `engine/src/app_dirs.rs:26` says "the rule is four variables". This is false: the code reads three.**
- Fix: change "four variables" to "three variables".
- Clause check: the only names `absolute_value` is called with are "LOCALAPPDATA" (:82, :96), "HOME" (:83, :85) and "XDG_DATA_HOME" (:84), by grep.

**D4. `user_data_dir`'s doc (`engine/src/app_dirs.rs:104-105`) leaves out a product caller.**
- At the merged head, the project machine store also reaches this function through `data_dir` (`kernel/src/project/store.rs:26,56-57`, from 1c).
- Fix: replace the two lines with:
  > Product callers: the kernel's `data_dir` (`kernel/src/permission/audit/log.rs`), through which the audit log, the session store and the project machine store reach it; the shell reaches the latter two.
- Clause check:
  - `resolve_log_path` calls `data_dir` (`log.rs:358`).
  - `data_dir` calls `user_data_dir` (`log.rs:375-376`).
  - `default_root` is at `session_history.rs:248-250`, and `projects_root` at `store.rs:56-57`.
  - The shell calls `default_root` at `lib.rs:454` and `projects_root` at `lib.rs:460`.

**D5. `data_dir`'s doc (`kernel/src/permission/audit/log.rs:372-374`) is loose on Linux and leaves out a caller.**
- On Linux, a relative XDG_DATA_HOME does not give None: the lookup falls back to HOME.
- The project machine store is not named.
- Fix: replace "`None` when the platform's variable is unset, empty or relative, so a log never lands relative to the working directory. The session store reaches the same directory through this function." with:
  > `None` when no variable the platform reads is a non-empty absolute path, so a log never lands relative to the working directory. The session store and the project machine store reach the same directory through this function.
- Clause check:
  - `data_dir_for` returns None on Windows only when LOCALAPPDATA is unusable, and on macOS only when HOME is.
  - On other Unix it returns None only when both XDG_DATA_HOME and HOME are unusable; A2's last case asserts this.
  - On Other it always returns None.
  - `store.rs:26,57` and `session_history.rs:39,249` both call it.

**D6 (record).** After D1 and D2 the head moves.
- §4's E1 is product-ci-rust "at the head marked ready", and E2 is governance-ci at that head.
- So E1 and E2 must be read at the new head, by run id, before the PR goes ready (packet flag 6).

**D7 (record).** The closing amendment should give P3 and P4 as recomputed against main's merge (I11), as references.
- No amendment records P3. Read literally against E0, it does not hold, because main added tests.
- It does hold once those are separated out (check 4).

### Observations (route; not this piece's files under §7 and §8 item 11)
- **O1.** `frontends/shell/e2e/publish.mjs:193-197` (`resolveAuditLogPath`) still encodes the old off-Windows rule: `XDG_DATA_HOME` taken verbatim, else `HOME/.local/share`.
  - On macOS it would name a different log path from the product's.
  - On Linux it would accept a relative XDG_DATA_HOME.
  - The e2e suite runs on Windows only today. This is a sibling to route as a node (shell e2e or port-4).
- **O2.** At the merged head, `data_dir` has a third product caller, `projects_root` (from 1c).
  - I10 is worded "at the base" and did not fire. Amendment 1 foresaw 1c's machine store going through `data_dir`.
  - The seam's shape (`Option<PathBuf>`) is unchanged, and E-K proves it from the shipped binary. On macOS the machine store now sits under `~/Library/Application Support/spatial-ide/projects`.
- **O3.** Packet flag 5: the probe branch exists at 6c86c2c5 (fetched). §4 says to delete it, and Amendment 7 item 7 records why it was kept (G1). This is recorded, not a defect.
- **O4.** M5's first failing assertion is the refusal id. Under M5 the relative root fails at the free-space step (`engine.lod_insufficient_disk`) before any write. The test's working-directory and beside-source assertions stay in place behind it.

## Checks

**1. Start.**
- `git -C C:/dev/spatial-ide fetch -q origin`: rc 0.
- In `C:/dev/wt/p2`: HEAD is cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5 and the branch is `cut/port-2-macos-l1-and-app-dirs`. The porcelain is empty, and ls-remote gives C. All rc 0.
- `df -h /c /d`: C: 51G free (90% used); D: 366G free.
- origin/main is 1daef56a59b11de9d56c70fdb8b3d44b2a740c7c, and the merge base is 8faccf8958016e0d39095d8e53de1d8588623060.
- The form at origin/main, `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`: sha256 8d61912189d6bcb572c6c0de31297b452238443e478ecf68d4b2cefd9fb3df91, 501 lines.
- The packet's sha256 9af834f7… and the brief's 66f2bbe0… match.

**2. The diff.**
- `git diff --numstat 8faccf89...C`: rc 0, 16 files, 871 added and 70 deleted, 941 in all. The per-file counts equal the packet's.
- The full diff has sha256 31b0bc81…, the same as the packet's patch.
- §7's command over the same range gives 16 files and 941 lines. The files are exactly §7's 16.
- The overrun against 850 is recorded as class 8 in Amendments 5 and 7, and §7 still reads 850 at main (packet flag 4).
- First-parent commits: fb162627, 6c21888e, 83d2ecef, 72cc7f0f (the merge, 2 parents) and cf5e7c4c. Each has one Signed-off-by.
- ADV-2026-11-14-21 item 6: `git diff --name-only 8faccf89 origin/main` names 13 paths. A fixed-string grep against the PR's 16 gives rc 1, no overlap; the self-test (KNOWN-LIMITATIONS.md against the name list) gives rc 0.
- §2 and §8, item by item:
  - The workflow changes only the header comments, one matrix entry and the `Runner profile (macOS)` step. The Windows and Linux entries are unchanged.
  - Grep over the 871 added lines: 0 hits for RUSTFLAGS, `-D warnings`, `continue-on-error`, `|| true`, `--skip`, `--exclude`, brew, apt-get, choco, `cargo install`, `npm `, `Users/` and `/home/`.
  - Of the 8 `cfg!(` additions, 3 are in `app_dirs.rs` and 5 are in tests.
  - The one `cfg_attr(` addition is K1's.
  - W1, W2, W3, W4 and W5 are byte-identical to the form's fenced blocks (checked by script).
  - W6 has both strings in the code.
  - The §2 item 6 reason appears 14, 1, 1 and 1 times in the four files, and the old string 0 times.
  - The six test names equal §4's.
  - K1's ignore attribute equals §4's.
  - The allowlist and T1's map equal §2 item 5's.

**3. E0 to E3 by run id** (`gh run view … --json headSha,conclusion,jobs`, all rc 0):

| Run | What it is | Head | Conclusion | Jobs |
|---|---|---|---|---|
| 39954586687 | E0 | fb16262770c8… | failure | macOS 120417124610 failure; Linux 120417124985 success; Windows 120417125056 success (Amendment 2) |
| 39960207028 | E0b | c99c3c553147… | success | all three success |
| 43687946638 | E1 | cf5e7c4c… (C) | success | Linux 132732271973, macOS 132732272168 and Windows 132732272304, all success |
| 43687946684 | E2 | C | success | cfg boundary 132732271945 and test/verify:plan 132732272099, both success |
| 43689426988 | E3 | 6c86c2c508cc… on `probe/port-2-case-policy-red` | failure | macOS 132736713381 failure; Windows 132736713576 failure; Linux 132736713646 success |

- The probe's parent is C, and its diff against C is the single M6 line (the diff is shown in D1's clause check).
- K1's failing lines from `--log-failed`, byte-copied, with the profile part masked:
  - Windows, `panicked at kernel\tests\case_policy_volume.rs:100:5:`:
    - `assertion `left == right` failed: the destination must be recorded in its on-disk case under the profile token; resolved: \\?\<temp>\cASE-pOLICY-pROBE-6836-0\iNNER\bundle`
    - `  left: "<user-home>/iNNER/bundle"`
    - ` right: "<user-home>/Inner/bundle"`
  - macOS, `panicked at kernel/tests/case_policy_volume.rs:100:5:`:
    - `  left: "/private/var/folders/<m>/T/cASE-pOLICY-pROBE-37088-0/iNNER/bundle"`
    - ` right: "<user-home>/Inner/bundle"`
  - Each binary reports `test result: FAILED. 0 passed; 1 failed`, and each run stops at `error: test failed, to rerun pass `-p spatial-kernel --test case_policy_volume``.
- In the Linux E3 job log, K1 is `ignored, boundary: filesystem case policy …` and `a_directory_scoped_grant_covers_a_publish_into_that_directory ... ok`, with 0 FAILED lines. This confirms Amendment 7 item 5's Linux sentence.

**4. P2 to P5, recomputed.** All nine job logs were fetched with `gh run view --job <id> --log`, rc 0. A node script split each log at `##[group]Run` markers. The ignored set is the `: test` lines of the list step. The ran set is `test X ... ok|ignored|FAILED` lines of the suite step, sorted.

- **P2:**
  - The E0 ignored lists for macOS and Linux are both 75 entries, sha256 f8c8b95f…, identical.
  - The E0 macOS run list is incomplete (70 binaries, 787 lines, 1 failed).
  - The E0b run lists for macOS and Linux are both 1002 lines, sha256 57d24a7e…, identical.
  - P2 holds as Amendments 2 and 3 state.
- **P3:** I took E1 minus E0 for Linux and Windows, and E1 minus E0b for macOS. Each name was attributed by `fn <name>(` among the added lines of `git diff fb162627 8faccf89 -- '*.rs'` (main) or of `8faccf89...C` (the PR).
  - Run lists:
    - Linux: +131 (123 main, 2 main should-panic tests, 6 PR) and −4 (all main).
    - macOS: the same.
    - Windows: +135 (126 main, 3 main should-panic, 6 PR) and −4 (main).
    - The 6 PR additions on every entry are exactly A1, A2, A3, E-K, E-L and K1.
  - Ignored lists:
    - Linux: +9 = K1 (PR) and 8 from main.
    - macOS: +9, all main, no K1.
    - Windows: +9, all main.
    - Two of these, `a_unc_path_keeps_its_share_form` and `a_user_profile_destination_becomes_a_token`, came from main adding `cfg_attr(not(windows), ignore …)`, shown in the main diff.
  - P3 holds after main's merge is separated out (D7).
  - P8: K1 is `ok` on macOS and Windows at E1 and `ignored` on Linux. A1 to E-L are `ok` on all three entries.
- **P4:**
  - Locally at C, `cargo test --workspace --locked -- --list --ignored` (shared hold, rc 0) gives 66 entries, sha256 ac848b42…. That is byte-identical to E1 Windows' list (`diff` rc 0).
  - Base side: E0 Windows has 57, plus 9 attributed to main, with no PR addition.
  - A local run at the base was not possible within the brief's write bound. The build worker's base/head run at 1f7d06b5/83d2ecef is Amendment 5 item 2's.
- **P5:**
  - The job names of E0 and E1 are identical for Windows (`cargo test --workspace (windows-latest)`) and Linux (`L1 portable correctness · cargo test --workspace (ubuntu-24.04)`), and equal the merge base's `job_name` lines 195 and 197.
  - macOS's name is §2 item 1's string, found once in the form.
- **P6, read in passing:**
  - E0 and E0b macOS: `26.6.2`, `arm64`.
  - E1 macOS: `26.7.2`, `arm64`.
  - Linux: `NAME="Ubuntu"`, `VERSION_ID="24.04"`, `x86_64`.

**5. Mutations, observed on Windows at C.**
- One hold built everything first: `cargo test -p spatial-engine -p spatial-kernel --locked --no-run`, rc 0, `Finished … in 7m 30s`.
- Each mutation went in through `node <S>/mut-324.mjs M<n>` (rc 0, `M<n> <file> APPLIED`). Each reverted with `git checkout -- <file>`, after which `git diff` was empty (0 bytes) and the porcelain empty.
- Profile parts are written `<temp>`.

- **M1** (`engine/src/app_dirs.rs:83`, `home.join(MACOS_DATA_SUBDIR)` changed to `home.join(XDG_DATA_DEFAULT_SUBDIR)`):
  - Exit 101.
  - Compile warning: `warning: constant `MACOS_DATA_SUBDIR` is never used`.
  - Failing test: `app_dirs::tests::the_rule_table_resolves_each_platform_from_its_own_variables`, alone (212 filtered out). It panicked at `engine\src\app_dirs.rs:158:9:`:
    - `assertion `left == right` failed: macOS uses the native location below HOME and ignores XDG_DATA_HOME`
    - `  left: Some("<temp>\\p2-home\\.local/share")`
    - ` right: Some("<temp>\\p2-home\\Library\\Application Support")`
  - The revert run passed: rc 0, 1 passed.
- **M2** (`:76`, `path.is_absolute().then_some(path)` changed to `Some(path)`):
  - Exit 101.
  - Failing test: `an_empty_or_relative_value_is_treated_as_unset_never_as_a_relative_directory`, alone. It panicked at `:212:13:`:
    - `assertion `left == right` failed: Windows with LOCALAPPDATA = "rel"`
    - `  left: Some("rel")`
    - ` right: None`
  - The revert run passed: rc 0, 1 passed.
- **M3** (`:97`, the non-Windows arms now read `absolute_value(var, "LOCALAPPDATA").ok_or(...)`):
  - Exit 101.
  - Failing test: `the_tier_root_resolves_on_windows_only_and_never_from_localappdata_elsewhere`, alone. It panicked at `:264:13:`:
    - `assertion `left == right` failed: MacOs must not take a tier root from LOCALAPPDATA`
    - `  left: Ok("<temp>\\p2-local")`
    - ` right: Err("no tier root is declared on this platform yet (engine/LOD-PREREGISTRATION.md Amendment 8 (a))")`
  - The revert run passed: rc 0, 1 passed.
- **M4** (`kernel/src/permission/audit/log.rs`, `data_dir`'s body becomes the ten-line two-cfg body from 2ffbf957):
  - Exit 101.
  - Failing test: `the_audit_log_resolves_under_this_platforms_data_directory_and_never_relative_to_the_working_directory`, the binary's only test. It panicked at `kernel\tests\app_data_dir_resolution.rs:215:17:`:
    - `assertion `left == right` failed: LOCALAPPDATA relative, XDG_DATA_HOME set and ignored`
    - `--- status exit code: 0 ---`
    - stdout: `no audit log at relative-data\spatial-ide\audit\publish.jsonl -- nothing has been published on this machine yet, or the log's own location has never been written to`
    - `  left: Some(0)`
    - ` right: Some(1)`
  - The revert run passed: rc 0, 1 passed.
- **M5** (`engine/src/lod.rs:1170`, the root now comes from `std::env::var_os("LOCALAPPDATA").map(PathBuf::from).ok_or("LOCALAPPDATA is not set")`):
  - Exit 101.
  - Failing test: `the_tier_root_is_refused_by_name_where_it_is_not_declared_and_nothing_is_written`, alone in its binary. It panicked at `engine\tests\lod_tier_root.rs:116:13:`:
    - `assertion `left == right` failed: the refusal is the tier root's own, by name: the tier set needs 17541 B free before the first tier is written and the free space on the tier root's volume could not be established at all; no tier is written on an assumption about disk`
    - `  left: "engine.lod_insufficient_disk"`
    - ` right: "engine.lod_tier_root_unresolved"`
  - The revert run passed: rc 0, 1 passed.
- **M6** (`kernel/src/permission/grant.rs:208`, `let parent =` changed to `let _canonical =`):
  - Exit 101.
  - Failing test: K1, alone in its binary. It panicked at `kernel\tests\case_policy_volume.rs:100:5:`:
    - `assertion `left == right` failed: the destination must be recorded in its on-disk case under the profile token; resolved: <local temp path, masked>`
    - `  left: "<user-home>/iNNER/bundle"`
    - ` right: "<user-home>/Inner/bundle"`
  - The revert run passed: rc 0, 1 passed.
- **M7** (`scripts/plan/cfg-boundary.mjs`, the `engine/src/app_dirs.rs` allowlist line removed):
  - Exit 1, 1 test, 0 pass, 1 fail: `the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site`.
  - Lines:
    - `AssertionError [ERR_ASSERTION]: cfg-boundary: engine/src/app_dirs.rs:45 outside every boundary`
    - then `:47` and `:49`
    - `cfg-boundary: 19 sites in 7 files, 3 outside every boundary`
    - `actual: 1,` / `expected: 0,`
  - The revert run passed: rc 0, 1 pass.

No mutation survived.

**6. `RECORDED MUTATION` comments at C, against check 5.**
- M1 to M5 and M7 each match my observation: the same mutation, test, first assertion and values. Each names 6c21888e as the commit it was observed at.
- M6's Windows clause matches. Its macOS sentence is untrue at C (D1).
- My observations are at C. I used no verify-mutation run as an observation (round 25, item 2 (c)).

**7. The code at C against §2, and S1 to S4 against §4's tests.**
- **S1:**
  - What they drive: A1 to A3 call `data_dir_for` and `tier_root_for` directly, for every `Os`. They use temp_dir()-absolute values, `""` and `"rel"`.
  - What they assert:
    - each platform reads its own variables only;
    - the Linux fallback to HOME;
    - an empty or relative value counts as unset, including XDG_DATA_HOME falling back;
    - only Windows has a tier root.
  - M1 to M3 show each test fails when its claim is false.
- **S2:**
  - What it drives: E-K spawns `CARGO_BIN_EXE_publish-bundle --audit-show` with `AUDIT_LOG_ENV` removed and every table variable set or removed. That binary takes the same `resolve_log_path` as `open_for` (`publish-bundle.rs:194`, `log.rs:125`). Each child runs in an empty working directory of its own.
  - Cases: §3's for each platform, plus Windows with an empty value and Linux with both values relative.
  - What it asserts: a success line naming the path, or exit 1 with the existing message and an empty stdout. In every case the working directory is still empty.
  - M4 shows the test fails when the claim is false.
- **S3:**
  - What it drives: E-L calls `build_tiers` on an 8-feature `write_geoparquet` source (EPSG:2056 asserted). LOCALAPPDATA is relative on Windows and an absolute temporary directory elsewhere.
  - What it asserts:
    - the refusal id;
    - the reason for that platform;
    - the no-fallback sentence;
    - nothing under the working directory;
    - nothing under the value off Windows;
    - only `source.parquet` beside the source.
  - M5 shows the test fails when the claim is false.
- **S4:**
  - What it drives: K1 checks its precondition first (`typed_parent.exists()`), then `normalize_with(resolve_destination(typed), [(probe root, "<user-home>")], [])`.
  - What it asserts: the final equality.
  - M6 makes it fail on Windows and macOS (E3).
- Seams:
  - `data_dir` into `user_data_dir` is proved by E-K.
  - `tier_directory` into `tier_cache_dir` is proved by E-L.
  - `resolve_destination` into `normalize_with` is proved by K1.
  - The product-ci-rust macOS entry is proved by E0 and E1.
  - The check against the tree is proved by T1.
- Caller rule:
  - `pub fn user_data_dir` has product callers through `data_dir` (D4 lists them).
  - `tier_directory`'s only caller, `build_tiers`, has only test callers (`kernel/src/skp.rs:2739` is inside tests), as §0 states.

**8. Suites, from `C:/dev/wt/p2` at C.**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (shared hold): rc 0; tests 600, pass 600, fail 0.
- The §6 tools, each at C (tool files last changed at 6f29ce6062b72cef23782d87ccbae207d967187f):
  - `verify-cites`: rc 0, PASS over 3082 files with 192 loose advisories.
  - `verify-test-claims`: rc 0, PASS with 808 claimed tests.
  - `verify-mutation --base 8faccf89 --head C`: rc 0, PASS, 6 new tests each named by a recorded mutation. This is a heuristic, not an observation.
  - `verify.mjs --offline`: rc 0, `verify:plan PASS`.
  - `verify-quotes` (shared hold): rc 0, `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 934 ruling cites resolved, 0 ruling-cite errors.`
- `node scripts/plan/cfg-boundary.mjs`: rc 0, `cfg-boundary: 19 sites in 7 files, 0 outside every boundary`.
- CI, read with `gh pr checks 324` (rc 0) at 2026-11-15T09:22:52Z: all 20 checks pass. The PR is a draft and open, with head C.
- Each run's head sha by `gh run view`; every one is C:
  - product-ci-rust: 43687946638 (push) and 43695086516 (pull_request), success.
  - Rust fmt: 43687946681 and 43695086458, success.
  - governance-ci: 43687946684 and 43695086476, success.
  - DCO: 43695086438, success.
  - Exposure scan: 43695086528, success.
  - Ported notices: 43687946680 and 43695086452.
  - Shell: 43687946744 and 43695086560, success.

**9. The packet's flags.**
1. Yes, the sentence is untrue at C. Replacement words are D1.
2. No to both questions: the comment does not say whose words the clause is, and no source comment carries the Not-covered case. Drafts are D2 (a) and (b), for the advisor.
3. The pre-check failure touches no §4 or §5 claim.
   - §4's M6 row names K1 alone, and P1 and P7 hold.
   - The Linux E3 log confirms `publish_cli` passed under M6 there.
   - My reading, not proven: on Windows the temporary path's spelling differs from its canonical form, so M6 also breaks the directory-scoped grant's comparison.
4. 941 changed lines over 16 files, confirmed by §7's command, against 850. It is class 8 in Amendments 5 and 7, and §7 is unedited.
5. The probe branch is kept. Recorded in Amendment 7 item 7 (O3).
6. E1 ran at C (43687946638, head C). Once D1 and D2 land, the head changes, and E1 and E2 must be re-read there (D6).
7. The Location row is W4 byte for byte, and `log.rs`'s module doc lines 8-11 are W5 byte for byte. Both match the code at C:
   - the join is at `log.rs:365`;
   - the refusal at `:358-363`;
   - `open_for` resolves the path first, at `:125`.
   - The only defect in that area is `data_dir`'s own doc (D5).

**10. End.**
- HEAD is cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5. The porcelain and `git diff` are empty.
- `df -h /c /d`: C: 51G free (90% used); D: 357G free.
- No cargo or rustc process for this target remains (count 0).
- Time: 2026-11-15T10:23:32Z.

## Status readings and holds
- 15 status calls, all rc 0. None showed a `project=SpatialIDE` line. Each reading had quiet=False.
- Average and peaks-over-25, in order:

| # | Average | Peaks-over-25 |
|---|---|---|
| 1 | 25.8% | 27 |
| 2 | 79.7% | 60 |
| 3 | 43.4% | 60 |
| 4 | 37.5% | 60 |
| 5 | 39.4% | 60 |
| 6 | 41.7% | 60 |
| 7 | 33.6% | 60 |
| 8 | 34.9% | 60 |
| 9 | 29.7% | 44 |
| 10 | 30.7% | 60 |
| 11 | 31.8% | 60 |
| 12 | 31.1% | 60 |
| 13 | 31.2% | 60 |
| 14 | 26.3% | 30 |
| 15 | 25.8% | 20 |

- 16 shared holds, all granted, with no exit 96 to 99: the build, M1 to M6 each mutated and reverted (12), the node suite, verify-quotes, and the local P4 list.
- The hold lines I read had this form:
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`

## Departures (mine)
- The M1 revert hold ran without a status call before it. The other 15 holds each had one.
- I ran `git -C C:/dev/wt/p2 fetch -q origin` and a fetch of the probe ref in the worktree, as well as the main-checkout fetch. Both are fetches; nothing else went over the network.
- The local P4 `--list --ignored` run at C is a heavy run beyond the listed mutation and suite runs. It was in a hold, for P4's word "locally".
- The harness moved one wait loop to the background at 180 s. It ran to its own bound and finished.
- No run was repeated, apart from the mutations' own revert runs.
- No commit, push or PR action; no file written outside `<S>` and `<T>` apart from the mutations, each reverted.

Background shells left: none. Every background task finished, and its completion was notified.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.

Scratch evidence (all in `<S>`): `<S>/g324r-*.txt`. This includes the mutation outputs g324r-M1.txt to g324r-M7.txt and their `-revert` and `-diff` files, the parsed CI lists g324r-ign-*.txt and g324r-ran-*.txt, g324r-p3.txt, and g324r-p4-head-ign.txt.