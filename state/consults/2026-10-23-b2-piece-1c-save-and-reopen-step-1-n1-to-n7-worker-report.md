*Custodian's filing note (2026-10-23): piece 1c step 1's commits N1 to N7 (the form's Amendment 1, item 6), by a worker-high, N1 a merge of main at 43a39222 and N2 to N7 six commits, to 7109aeb2. The run 2026-10-22 23:06Z to 2026-10-23 02:07Z by its transcript (Read 29, Bash 158, Write 24, Edit 22, Grep 3); its claims were read against that transcript's calls before filing: one merge, six commits and seven pushes, origin's branch equal to the head, the porcelain empty, no force push, rebase or amend; every write in the worktree or in the session scratch folder under its prefix (a scratch copy of the tree made there by `git archive`). The custodian checked by script: each ADR file at N2 equals the file at N1, one LF and the form's annex, Annex A dated 2026-10-22, N2's UTC commit date; the counts by §2.11's command over `43a39222...7109aeb2` (probe 144, ADR text 45, renderer 123, kernel product 2,099, kernel tests 145, 15 files). Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 369d946e2a31d18b4433a8590374c169a85cd4bb21a935fd8179761b3d1d133a.*

---

Built: b2-piece-1c-save-and-reopen step 1, N1 to N7, at 7109aeb2431d9ca9379cb15b0d027dba78a20217

Pushed; origin's branch equals it; `git status --porcelain` is empty; no process I started is running. Nothing past N7 was touched.

**Read first**
1. `cargo clippy --all-targets --locked -- -D warnings` exits 101 at every commit N2 to N7, on main's own code under rustc 1.97.1. The errors are in `renderer/src/canonical.rs` `write_double` (manual_range_contains; line 240 at N2, line 303 after N3), `renderer/src/style.rs:10` (doc_lazy_continuation), and `engine/src/rowgroup.rs:331`, `stream.rs:2355` and `stream.rs:2471`. N3 must keep `write_double` byte-identical, so I could not fix them. The literal command stops at the renderer and never lints the kernel. I therefore also ran `cargo clippy --all-targets --locked` without `-D` (exit 0 at N3 to N7) and compared warnings by file and message. The set is 45, identical from N3 to N7, with none in the code I added.
2. The kernel product group is over its ceiling (counts below). That is class 8 for you; I did not edit §7.
3. The first N3 test run (label n3) is void. I compile-checked a scratch copy of the tree with the same `CARGO_TARGET_DIR`, and cargo shares artifacts for equal relative paths, so that run executed my copy's later work. I touched the sources, re-ran N3 (n3b) and used only n3b. No copy was built after that.

**B and commits** (B = `git merge-base origin/main HEAD` = 43a39222ebe6fbe1352c2268ef54521921028b66). Each commit was pushed in its own call, exit 0.
- N1 36708c1377488ae3f0a7a01203baada6e425e056: merge of main, no rebase
- N2 6e4dea3a20a6ee08b6345fe302cd7f7ebe47fd11: ADR-036 Amendment 1 and ADR-022 Amendment 2
- N3 74e9bbdaae0193c7e356762d4c790c2a24c291c3: `to_line_oriented_string` in `canonical.rs`, U-L1
- N4 610a5be954b2219a820751baf9121866b0e4aeee: `dataset_ref.rs` bind-time bound and widened canonical form, U-I1, U-C1; Status lines in `dataset_ref.rs` and `lib.rs`
- N5 b8e2f2860f1784bd8a4a131840248678ce26aee1: `project/{mod,strict_json,file}.rs`, `pub mod project`, U-R1 to U-R7, U-V1, U-V2
- N6 0510bec4afe89036c3b453e186c04eb15ab828dc: `session_history.rs` reads through the strict reader, Status line
- N7 7109aeb2431d9ca9379cb15b0d027dba78a20217: `store.rs`, K-S6, K-S7

**Step 2 class 3 rows.** The sweep at the merged HEAD, before my edits, covered 60 pins into `renderer/`, `kernel/src|tests|Cargo`, `docs/adr`, `protocol/skp/src`, `engine/src` and `frontends/shell/src/{workspace,style,canvas}`. 55 are the same, none changed, and 5 moved. All five are ADR-036 pins at ad921f55 (cited in §0.3 and §2.10); read them at the new line:
- :27 is now :28
- :42 is now :64
- :101 is now :125
- :128 is now :152
- :182 is now :207

No fact changed, so there is no invalidator. Pins into `state/`, `KNOWN-LIMITATIONS.md`, `AUTONOMY.md`, `SKP-V0.md`, `kernel/README.md` and the shell files outside those directories were not re-read. My own edits moved cites in files I edited. One example is the e6dfe624 pin `session_history.rs:43-45`, now :45-47.

**ADR equality checks** (by script, before = N1, after = N2 and also N7):
- ADR-036: 29296 bytes + LF + 7788 = 37085; prefix unchanged, equal.
- ADR-022: 6008 bytes + LF + 776 = 6785; prefix unchanged, equal.
- Annex A has the heading date 2026-10-22, the UTC date of N2's commit.
- No CR, and each file ends in LF. `docs/README.md` is not regenerated. Both Edit appends were accepted; Guardian never refused.

**Checks per commit.** fmt `--check` exit 0 each time. Clippy `-D warnings` 101, clippy without `-D` 0, tests 0, 0 failed, 57 ignored each time. Passed counts: N2 964, N3 965, N4 967, N5 976, N6 977, N7 979. N2 ran under the first script, whose second clippy variant failed on main's engine lints; it has no without-`-D` run.

**Mutations at N7** (7109aeb2). Each was applied, its test run alone, the failure recorded by name, reverted with `git checkout -- <file>`, and `git status --porcelain` was empty after each. All 15 failed the named test:
- U-L1 (4-space indent)
- U-R1 (duplicate check removed)
- U-R2 (keys compared as a set)
- U-R3 (rendered file compared as parsed values)
- U-R4 (render comparison skipped)
- U-R5 (file ceiling removed)
- U-R6 (indent changed in the writer only)
- U-C1 (case-sensitive device names)
- U-I1 (check removed)
- U-R7 (comparison removed)
- U-V1 (view numbers through `write_double`)
- U-V2 (view read as JSON numbers)
- K-S6 (written in place; parent saw the child's bytes, not the previous file's)
- K-S7 (rename bound removed; the test's own 60 s bound failed it)
- the added N6 test (`in_writers_form` call removed)

**Counts** (§2.11 command, B...HEAD; added + deleted):

| Group | Count | Ceiling |
|---|---|---|
| probe | 144 | 150 |
| ADR text | 45 | 80 |
| renderer | 123 | 200 |
| kernel product | 2,099 | 1,350 |
| kernel tests | 145 | 1,000 |

- Kernel product detail: 1,565 outside inline `mod tests` and 534 inside them.
- The unit tests the form places in `file.rs` and `dataset_ref.rs` count in the product group by path.
- Files in `git diff --name-only B...HEAD` (15):
  - `docs/adr/ADR-022-…`, `docs/adr/ADR-036-…`
  - `kernel/src/{dataset_ref,lib,session_history}.rs`
  - `kernel/src/project/{file,mod,store,strict_json}.rs`
  - `kernel/tests/{project_save,project_save_crash}.rs`
  - `renderer/src/canonical.rs`
  - the three probe files under `spikes/b2-1c-onedrive-probe/`

**Disclosures**
- **Added test.** `recover_refuses_a_line_out_of_declared_order_or_off_canonical_spelling`, in `session_history.rs`. §4 does not name it. It covers the new order and spelling refusals and carries a mutation (above). No 1b test was edited; I3 is not met.
- **Layout function.** `to_line_oriented_string` writes no closing LF; `write_project` adds the one LF.
- **Declared values not in §7.**
  - project reader depth 32 and string bound 4,096
  - `folders.json` reader: 2 MiB, depth 4
  - rename pause 100 ms
  - session-history line reader: depth 32, strings up to 65,536 (the CRS definition bound)
- **`MAX_KNOWN_FOLDERS`.** I count `first` among the 256.
- **Protocol codes.** `ProjectFileRefused { path, rule }` and `SaveError` are kernel types. The `skp.*` codes arrive with the version bump.
- **`serde_json` in `strict_json`.** It decodes string escapes and checks a number token's grammar; number values use std's `f64` parse.
- **`folders.json` writer and reader.** No committed test yet (K-S13 and K-O10 are later). A throwaway round-trip test passed and was deleted.
- **Runs in the background.** The first run was moved to the background at the 600 s limit. The later runs were launched with run_in_background, with the same commands and exit codes recorded.
- **Hold estimate.** N2's hold estimate of 25 minutes was exceeded (about 40 minutes); later holds used 75 or 60.

**Pre-gate self-check**
1. Cross-module code uses the interfaces as read. `DatasetRef::{parse,to_json,linked}`, `SourceObservation::{byte_size,footer_length}`, `style::parse` and `to_canonical_json`, `HexF64` (`codec.rs:38-63`) and the shell's `combineClauses` (`filterClauses.ts:31-40`) were read before use. The seam tests are U-R6 and U-V1 (writer, renderer layout function, reader), and the 1b suites through `read_line`.
2. Every completion claim points to a run above.
3. No user-facing message is added; refusal text states facts only.
4. Every named test reaches its assertion, and its mutation fails it at that assertion.

**Caller grep** (non-test code outside `kernel/src/project/`):
- The strict-reader functions are called by `session_history.rs`.
- `to_line_oriented_string` is called by `file.rs:146` and `strict_json.rs:93`.
- `write_project`, `read_project`, `mint_identity`, `projects_root`, `record_dir`, `KnownFolders`, `stage` and `replace` have no caller yet. Their callers (O1, P3, step 2) come later in this PR.

**Hold lines** (my project's only), eight pairs:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …` and `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`. These were for N2, N3, N3 again, N4, N5, N6, N7 and the mutation runs.

**Model:** Sonnet 5.5, id claude-sonnet-5-5, as the harness reports. No override and no context handoff.
