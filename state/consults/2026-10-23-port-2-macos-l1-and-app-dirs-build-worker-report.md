*Custodian's filing note (2026-10-23): port-2's resumed build by a worker-high on `cut/port-2-macos-l1-and-app-dirs` from E0 (the form's Amendment 4). The run 17:58:34Z to 19:40:00Z by its transcript (Read 5, Bash 76, Edit 2, Write 1); its claims were read against that transcript's calls before filing: two commits and two pushes, origin's branch equal to the head, the porcelain empty, no force push, rebase, amend, merge or PR write; its Edit and Write calls only in the piece's worktree and its `p2-resume-` scratch files; the branch's 15 files are §7's list less OPEN-C's file, at 939 changed lines by numstat over 1f7d06b5...83d2ecef. It discloses a scratch file written by a shell redirect into the home folder and removed at once. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder, and one final newline added, and its 2 path:line cites into files or lines only on the branch written in words; nothing else is changed. Its sha256, from line 5 to the end, is 1614a5a746cb1b3038dce62b38054c1ca70172aded6eb22510d2d3e357b9b59e.*

---

Built: port-2-macos-l1-and-app-dirs at 83d2ecef8dba33017e47310d7fab8e2be5ee5123

Origin's branch equals HEAD (83d2ecef...) and `git status --porcelain` is empty. No PR action, no probe branch, no merge of main. The only red on my pushes is the known sort-window test on macOS (see CI).

**Corrections to the prepared change against the form (2)**
1. `.github/workflows/product-ci-rust.yml`: I removed one sentence the form does not prescribe: "The macOS entry adds the one case-insensitive volume the suite runs on." It asserted H4 before E1 has observed it, and "the one" is wrong because Windows is case-insensitive too.
2. `engine/src/app_dirs.rs`: the first build warned `unused import: Path`. I moved `use std::path::Path` into the tests module and left `PathBuf` at the top.

**Read against the form, no correction needed**
- W1, W3, W4 and W5 were compared byte for byte by script against the form's fenced blocks. W1 and W4 are exact lines, W5 is the exact 4 lines, and W3 is present with the old "unless `XDG_DATA_HOME`" clause gone.
- W2's text is in item 1's source comment.
- W6's two reason strings are in `app_dirs.rs`. The refusal detail is `{reason}, so the declared tier root cannot be resolved. A tier is never written ...`.
- The table of §2 item 2, the two subdirectory constants and the three-cfg `CURRENT` expression match the form.
- Every LOD-tier reason in the three engine files has the new text: 16 occurrences, 14 in the builder file and 1 each in the other two. No old string remains there.
- `kernel/tests/no_generation_in_persisted_artifacts.rs` is untouched; its old string at line 421 remains, per OPEN-C (a).

**Left for your decision**
- Item 43's source comment: W3 says "Not covered, for the source comment", but no instruction adds it, and W2 is the only prescribed comment text. I added nothing, as the E0 worker did. The uncovered case is a `LOCALAPPDATA` or `HOME` that is unset or not absolute.

**Commits**
- `6c21888e1be1dd723219e160c66c672fdb44967c`: `feat(engine,kernel): port-2-macos-l1-and-app-dirs, form sections 2 items 2 to 8 and 4: one application-directory boundary, A1 to A3, E-K, E-L, K1`
- `83d2ecef8dba33017e47310d7fab8e2be5ee5123`: `test(engine,kernel): port-2-macos-l1-and-app-dirs, form section 4: the recorded mutations M1 to M7 at 6c21888e`
- Both are signed off with both trailer lines, and each was pushed in its own call. The pushes went fb162627..6c21888e and then 6c21888e..83d2ecef, rc 0 each.

**Files in the first commit (15)**
- New: `engine/src/app_dirs.rs` (277 lines, with A1 to A3), `engine/tests/lod_tier_root.rs` (E-L), `kernel/tests/app_data_dir_resolution.rs` (E-K), `kernel/tests/case_policy_volume.rs` (K1).
- `engine/src/lib.rs`: `pub mod app_dirs;`.
- `engine/src/lod.rs`: `tier_directory` calls `app_dirs::tier_cache_dir()`, and the docs say where the root is decided. No cfg added.
- `kernel/src/permission/audit/log.rs`: `data_dir`'s body is now `spatial_engine::app_dirs::user_data_dir()`. Name, signature and visibility are unchanged, the module doc is W5, and `is_inside` is untouched.
- `scripts/plan/cfg-boundary.mjs`: allowlist labels. `cfg-boundary.test.mjs`: T1's expected map.
- The three `lod_tier_*.rs` files: the reason strings.
- Records: `KNOWN-LIMITATIONS.md` (W1, W2, W3) and `kernel/PERMISSION-BOUNDARY.md` (W4).
- The workflow file: header comments only. E0's entry and step were already in the branch.
- The second commit is comment-only. It adds the `RECORDED MUTATION` comments to `app_dirs.rs`, `app_data_dir_resolution.rs`, `lod_tier_root.rs`, `case_policy_volume.rs` and `cfg-boundary.test.mjs`.

**Tests, all on Windows, rc 0**
- Build: `cargo test --workspace --locked --no-run` finished in 27m29s (rc 0).
- A1, A2, A3, E-K, E-L and K1 each pass by name. A1 to A3 are in one run with 3 passed. E-K, E-L and K1 passed in the same run, 1 passed each.
- T1: `node --test scripts/plan/cfg-boundary.test.mjs` gave 7 pass, 0 fail.

**Mutations M1 to M7**
Each was applied alone at 6c21888e, its named test run, and then reverted. Porcelain was empty after each revert (printed). All are observed on Windows only. I used no `verify-mutation` tool.

| # | Test | First failing assertion |
|---|---|---|
| M1 | A1 | message `macOS uses the native location below HOME and ignores XDG_DATA_HOME`: left the `.local/share` spelling, right `Library/Application Support` |
| M2 | A2 | `Windows with LOCALAPPDATA = "rel"`: left `Some("rel")`, right `None`; the empty value passes because the empty check stays |
| M3 | A3 | `MacOs must not take a tier root from LOCALAPPDATA`: left an `Ok` with the temp dir, right the undeclared-root `Err` |
| M4 | E-K | case `LOCALAPPDATA relative, XDG_DATA_HOME set and ignored`, status check: left `Some(0)`, right `Some(1)`. The reader printed a path relative to the working directory. |
| M5 | E-L | `the refusal is the tier root's own, by name`: left `engine.lod_insufficient_disk`, right `engine.lod_tier_root_unresolved` |
| M6 | K1 | the final equality: left `<user-home>/iNNER/bundle`, right `<user-home>/Inner/bundle`. The precondition passes. macOS is E3's and not observed. |
| M7 | T1 | `assert.equal(r.status, 0)`: `1 !== 0`, with `engine/src/app_dirs.rs line 45 (on the branch) outside every boundary` and `19 sites in 7 files, 3 outside every boundary` |

M4 and M5 are observed on Windows under OPEN-2 (a).

**P4, cfg-boundary check and §7**
- **P4:** `--list --ignored`, sorted, was run at the detached 1f7d06b5 and at 83d2ecef.
  - The ignored-test entries (`: test` lines) are 57 and 57, byte-identical, sha256 8c6d24e53fa2d743dc93df31714ce8acf8c8d8fb036fb3cf84dd7ed8363db42f.
  - The whole sorted output is not byte-identical: the head has 3 more lines, each `0 tests, 0 benchmarks`. They are the three new binaries (E-L, E-K, K1), which have no ignored test. This is class-2 wording for you to grade.
- **Check:** `node scripts/plan/cfg-boundary.mjs` printed `cfg-boundary: 19 sites in 7 files, 0 outside every boundary`, matching the form.
- **§7 overrun (class 8):** the counting command over `1f7d06b5...HEAD` gives 870 added and 69 deleted, 939 changed lines over 15 files, against 850 and 16.
  - By file: `app_dirs.rs` 277 (estimate 200), E-K 236 (150), E-L 168 (90), K1 105 (100), `lod.rs` 37, workflow 33, `log.rs` 28, `lod_tier_builder.rs` 28, `PERMISSION-BOUNDARY.md` 2, and the rest small.
  - I did not edit §7 or trim.

**Checks at the head**
- `cargo fmt --all -- --check`: rc 0.
- `cargo clippy --workspace --all-targets --locked`: rc 0, 77 warning lines. One is mine: `variant name ends with the enum's name` at `engine/src/app_dirs.rs` line 39 (on the branch), `Os::MacOs`. The form names that variant, so I kept it. The rest are existing code.
- `verify-cites`: PASS, rc 0. `verify-quotes`: PASS, rc 0. `verify-test-claims`: PASS, rc 0 (637 claimed tests). `verify`: PASS, rc 0.
- Scripts suite `node --test` on plan, hooks and evidence: rc 0, 543 pass, 0 fail, so no re-run was needed.

**Invalidators and blocks:** I9 holds (check at the base: 18 sites in 6 files, 0 outside). I10, I12 and §8 did not fire. No manifest, lockfile, dependency, install or user-profile path. No test added, removed or renamed beyond §4. The only cfg outside `app_dirs.rs` is the existing ones; the check says 0 outside.

**CI**
- Run 40004779556 at 6c21888e: ubuntu and windows success. macOS failed at `a_cancel_inside_the_sort_is_observed_rather_than_waited_out` (`kernel/tests/publish_cancellation.rs:248`) and nothing else.
- Run 40010112058 at 83d2ecef: ubuntu success, windows success. macOS failed on the same test and nothing else.
- In both macOS runs cargo stopped at that binary, so the binaries after it did not run. This is the known defect per Amendment 4 item 3 (the macOS entry's sort-window failure), and I changed nothing for it.
- At 83d2ecef the Rust fmt run (40010112064), Ported notices run (40010112053) and Governance CI run (40010112190) completed success. I did not read the Product CI shell run 40010112101.

**Disclosures**
- Early in the session I wrote one scratch file into the home directory by mistake (a fmt output file) and deleted it right away; the directory listing confirmed it gone.
- M1 to M3 were run with `-p spatial-engine`, a different feature set from the workspace build, which cost a 16m51s rebuild. M4 to M6 used `--workspace --test ...`, which reused the cache.
- The first build call appended a `p2-resume-build.rc` write to scratch after the release line, which is a small departure from the prescribed shape.
- Processes: none I started still runs. I saw a cargo/rustc pair from 21:17 local time that I did not start and did not touch.

**Holds (my project only):** 12 holds, each `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...` followed by `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`. They were:
- the build
- the named tests
- M1 to M6
- P4 at the base
- P4 at the head
- clippy
- the scripts suite

No exit 96 to 99 came back.

**Model:** the harness reports Sonnet 5.5 (`claude-sonnet-5-5`). No override and no context handoff.
