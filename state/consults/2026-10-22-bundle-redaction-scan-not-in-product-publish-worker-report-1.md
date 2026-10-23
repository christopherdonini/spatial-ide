*Custodian's filing note (2026-10-22): the redaction scan's code, tests and evidence by a worker-high, built at 979a7d5d on its branch (B′ c7d02156). The run 22:19:17Z to 00:18:51Z (2026-10-21 to 2026-10-22) by its transcript (Read 5, Bash 169, Write 31, Edit 1); its claims were read against that transcript's calls before filing. Its first point, manifest.ts over its ceiling, is recorded as class 8 in the form's Amendment 4. Its differences 2 to 8 go to the gates. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is a0799b0be0757c1dd512ac2f1e19ce75c322868ac91a9dce9eba4bbb85627a14.*

---

Built: bundle-redaction-scan-not-in-product-publish at 979a7d5d27c13216318f468a40fc0203b43e8f9c

One thing for the custodian first. `renderer/bundle-viewer/src/manifest.ts` is 7 changed lines (4 inserted, 3 deleted) against item 10's ceiling of 3. The ceiling cannot be met. W9 replaces three comment lines, so the minimum is 6 (3 deleted plus 3 inserted). W9 wraps to 4 lines at 100 columns. I did not edit the form. This is a class 8 candidate. Every other file is within its ceiling.

No invalidator. No fact changed since the form's pins.

**Commits and base**
- B′ = c7d02156d042c25f14d84c841ac89268ea5cec78, confirmed with `git merge-base origin/main HEAD`.
- One commit: 979a7d5d27c13216318f468a40fc0203b43e8f9c, `feat: the product publish scans every staged file before the rename; the viewer build scans dist/ and records its hashes`. It was made with `git commit -s -F`, with the two trailers.
- `git push origin cut/bundle-redaction-scan` ran in its own call and printed `push rc=0`. HEAD equals the remote branch.
- I did not read the O1 report; it is not in the worktree. I used the brief's figures and re-derived them (see step 7).

**Step 1: pins re-read at HEAD**
- A script recomputed every `path:line[-line] @ rev sha256` pin in the form: 182 pins, state/ paths included. 181 resolve to identical bytes at HEAD. No pin's own hash is wrong.
- One class 3 row: `PLAN.yaml:5394-5410 @ 9a8bd442` (the form's Authority line 8). The span is still lines 5394-5410 at HEAD, but the node's summary line 5409 has been extended since, so the hash differs.
- The word-form cites also hold. `git diff 8572792..HEAD` over .github, .gitignore, renderer, src-tauri, kernel/src, engine/src, kernel/tests and KNOWN-LIMITATIONS.md was empty. `git diff 9a8bd44..HEAD` over the code paths showed only forms.

**§2 and Amendment 3 items, and where they landed**
- Gate in `run_inner`: `kernel/src/publish/mod.rs`, from line 936 (W4′ comment). It sits after the sidecar write and before `total_bytes` and `finalize`.
- Walk with `skip`: `kernel/src/bundle/redaction.rs`.
  - `scan_directory` (line 346) now delegates to the private `walk<E>` (line 375).
  - `pub(crate) first_undeclared_findings<E>` is at line 359.
  - The `skip` parameter and the per-file `before_each_file` check are in `walk`.
  - The shape of the gate function is mine. It takes an `io_error` closure so the file stays std-only, and it returns `Result<Option<(String, Vec<Finding>)>, E>`.
- Variant: `PublishError::RedactionFinding` in `kernel/src/publish/error.rs`, with its code arm and `Display` arm.
- Audit and reader:
  - `error_kind` and `publish_outcome` (as Refused) in `boundary.rs`, 3 lines.
  - The `plain_reason` arm in `kernel/src/permission/audit/reader.rs`.
- Build record in the kernel: `ViewerAssets::with_build_record` (line 155) and `is_built_asset` (line 163) in `viewer_assets.rs`.
- Build record in the shell:
  - `bundled_viewer` reads the record through `read_build_record` (`publish.rs` lines 1394-1395 and 1404). It refuses with W8.
  - `commands.rs` is untouched.
- `tauri.conf.json`: one resource entry.
- Viewer build:
  - The `package.json` build script.
  - `scripts/scan-dist.rs`, `scripts/scan-dist.mjs`, and `redaction-reviewed.json` with exactly the three rows.
  - `build.mjs` strips comments with `minifyWhitespace: true` and `legalComments: 'eof'`.
  - The `manifest.ts` comment (W9).
- CI: `product-ci-viewer.yml` gets the toolchain step, `redaction.rs` in both path filters, and the W11 paragraph.
- `.gitignore`: one line, `viewer-asset-hashes.json`.
- `kernel/src/bin/publish-bundle.rs`: W12 only. The diff contains only added `//!` lines.
- Fixture F1: `write_zone_texts` in `engine/src/fixture.rs`.
- KNOWN-LIMITATIONS.md: item 47.
- `kernel/README.md` and `engine/README.md` are not touched.

**Words**

I extracted each word from the form by script. A second script (`rds-verify-words.py`) proved all of them equal to the form's bytes; 17 checks, all OK. The `§` cites below are the form's own labels. In every row, "W1 at lines 424" means the same file at HEAD.

| Word | File | Lines at 979a7d5d |
|---|---|---|
| W1 | `kernel/src/publish/error.rs` | 424 |
| W2 | `kernel/src/permission/audit/reader.rs` | 276-280 |
| W3 | `kernel/src/publish/error.rs` | 186-191 |
| W4′ | `kernel/src/publish/mod.rs` | 936-946 |
| W5′ | `kernel/src/publish/mod.rs` | 58-61 |
| W6 and W6′ | `KNOWN-LIMITATIONS.md` | 411-418 |
| W7′ | `kernel/src/bundle/redaction.rs` | 49-56 |
| W8 | `frontends/shell/src-tauri/src/publish.rs` | 1430-1432 |
| W9 | `renderer/bundle-viewer/src/manifest.ts` | 333-336 |
| W10 | `renderer/bundle-viewer/build.mjs` | 33-36 |
| W11 | `.github/workflows/product-ci-viewer.yml` | 50-54 |
| W12 | `kernel/src/bin/publish-bundle.rs` | 47-58 |

Notes on the table:
- W10 reads `esbuild 0.28.2`, from the lockfile.
- W6′ sits after the three bullets.
- W9 has no inner backticks, as the form gives it.

**KNOWN-LIMITATIONS item number:** 47. It is 9 inserted lines. I added no provenance comment, to avoid words beyond W6.

**Tests, each passing by name**
- T1: `a_publish_whose_styled_column_holds_a_path_is_refused_by_the_redaction_scan_and_nothing_reaches_the_destination` (shell `publish.rs` line 3216).
- T3: `a_redaction_refusal_detail_begins_with_its_typed_code` (`typed_terminal_codes.rs`). It also asserts W1 exactly.
- T4: `a_redaction_refusal_reads_as_its_plain_reason` (`reader.rs`).
- T5: `the_boundary_refuses_a_bundle_whose_data_holds_a_path_before_the_rename_and_audits_it_as_refused` (`permission_boundary.rs`).
- U1: `only_a_viewer_file_whose_bytes_hash_to_its_own_build_record_entry_is_skipped` (`viewer_assets.rs`).
- T6: `a_viewer_asset_matching_its_build_record_is_published_and_the_same_asset_one_byte_changed_is_refused` (`permission_boundary.rs`).
- T8: `bundled_viewer_reads_the_build_record_beside_the_viewer_directory_and_refuses_without_it`.
- T9: `the_packaged_resources_carry_the_build_record_at_the_path_bundled_viewer_reads`.
- V1: `a finding outside the reviewed record fails the viewer build and writes no hash record` and `a reviewed row passes only at its own file, class and offset`.
- V2: `the built app.js carries no comment from the viewer's sources`.
- V3: `the hash record names each dist file with the sha256 of its bytes`.

The §4 unchanged success tests pass unedited.

**Mutations at 979a7d5d**

Each mutation was applied in the working tree, the named test or tests were run alone, the change was reverted with `git checkout -- <file>`, and `git status --porcelain` was empty. Nothing was committed. Raw outputs are in my scratch folder as `rds-m*.txt`.

| Mutation | Result |
|---|---|
| M1 | T1 (shell) failed with `got Success`. T5 failed at its `unwrap_err`. |
| M2 | T1 and T5 failed at the `refused` assertion (left `failed`). |
| M3 | T1 got `Success`. T5 failed at `unwrap_err`. |
| M4 | T3 failed at the code assertion (left `publish.redaction`). |
| M5 | T4 failed; the text read "not one of the reasons this reader recognizes". |
| M6 | `granted_and_approved_publishes_and_records_a_success_with_the_manifest_hash` failed. `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` got `Refused`. |
| M7 | Predicted survivor, and it survived. All of these passed: kernel lib 164, permission_boundary 16, publish 33, publish_cancellation 6, typed_terminal_codes 8, shell 71. The only diff was `|| watch.check()` becoming `|| Ok(())`. |
| M8 | U1 failed at "one byte changed". T6 got `Ok` for the changed asset. |
| M9 | U1 failed at "another path, the same bytes". |
| M10 | T6 failed on its first half. T8 got `Refused` on its first half. |
| M11 | T8 failed on its second half: `unwrap_err` on an `Ok`. |
| M12 | V1's second test failed at "offset + 1". The first V1 test passed. |
| M13 | V1's first test failed at "no record is written for a failed scan". The second V1 test passed. |
| M14 | After rebuilding, V2 failed at "absent from dist/app.js: Any URI scheme…". With the mutation, the build scan matched the `app.js` row at 7291, which confirms that offset. |
| M15 | T9 failed (left `Null`). |

**Suites at 979a7d5d**

Each was run under a shared hold; the exit code is the command's.

| Suite | Exit | Counts |
|---|---|---|
| `cargo test -p spatial-kernel --lib --test publish --test permission_boundary --test typed_terminal_codes` | 0 | lib 164, permission_boundary 16 (1 ignored), publish 33 (2 ignored), typed_terminal_codes 8 |
| `cargo test -p spatial-engine --features fixture --lib` | 0 | 203 passed |
| `cargo test` in `frontends/shell/src-tauri` | 0 | 71 passed, 2 doc-tests |
| `cargo fmt --all --check` | 0 | |
| `npm run verify` in `renderer/bundle-viewer` | 0 | 104 tests, 0 failures |
| `rustfmt --edition 2021 --check renderer/bundle-viewer/scripts/scan-dist.rs` | 0 | |
| `node --test` on scripts/plan, hooks and evidence | 0 | 527 passed |
| verify, verify-cites, verify-quotes, verify-test-claims | 0 each | verify:plan PASS; verify:cites PASS (2178 files); verify:quotes PASS (130 checked); verify:test-claims PASS (613 claimed tests) |

The full `cargo test -p spatial-kernel` also ran, on the tree that was then committed unchanged. It exited 0, with all targets ok and publish_cli at 9. I did not run `product-ci-shell` or the workspace CI; those rows are the custodian's. No timing-sensitive failure appeared in the shared runs.

**Step 7**
- **Ceilings**: below, each file's insertions plus deletions against its ceiling.
  - The product-ci-viewer workflow is 10 of 30.
  - `.gitignore` is 1 of 2.
  - KNOWN-LIMITATIONS.md is 9 of 22.
  - `engine/src/fixture.rs` is 45 of 50.
  - Shell `publish.rs` is 157 of 240 (the non-test part is 42, against 45).
  - `tauri.conf.json` is 1 of 2.
  - `publish-bundle.rs` is 13 of 16.
  - `redaction.rs` is 55 of 66.
  - `reader.rs` is 26 of 30.
  - `boundary.rs` is 3 of 8.
  - `error.rs` is 21 of 30.
  - `mod.rs` is 42 of 42.
  - `viewer_assets.rs` is 60 of 110.
  - `permission_boundary.rs` is 123 of 150.
  - `typed_terminal_codes.rs` is 34 of 35.
  - `build.mjs` is 6 of 16.
  - `package.json` is 2 of 2.
  - `redaction-reviewed.json` is 8 of 12.
  - `scan-dist.mjs` is 105 of 130.
  - `scan-dist.rs` is 32 of 60.
  - `scan-dist.test.mjs` is 82 of 150.
  - `manifest.ts` is 7 of 3, OVER.
- **Total**: 842 over my 22 files. That is under 1,222 over 24 files, and under 1,206, which is 1,222 less the two README ceilings. The form is excluded.
- **Names**: `git diff --name-only B′...HEAD` lists exactly 22 files, the 22 code files. None is a lockfile.
- **§2.4 byte-identical**:
  - Everything in `redaction.rs` outside the W7′ paragraph and the walk region is byte-identical to B′. That covers `scan`, `CREDENTIAL_NEEDLES`, `MIN_PRINTABLE_RUN`, `ATTRIBUTABLE_CLASSES`, `OPERATOR_DECLARED`, `declared_ranges`, `in_printable_run`, `find_all_ascii_ci`, `finding`, `MachineIdentifiers` and `from_environment`, and the whole `mod tests`.
  - `scan_directory`'s signature and final sort are unchanged.
- **Item 9 "declared unchanged, added"**: empty diff for LICENSES, `notice.mjs`, `portedNotices.mjs`, `index.html`, `commands.rs`, `tauri-build.yml`, `product-ci-shell.yml` and every lockfile. Also empty for protocol, docs, `frontends/shell/src`, `frontends/shell/e2e`, `kernel/tests/publish.rs`, both READMEs, PLAN.yaml, CUSTODIAN-QUEUE.*, site, state and the walkthrough.
- **NOTICE.txt**: after the final `npm run build`, `dist/NOTICE.txt` sha256 is 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb. It matches the brief.
- **Scan output**: the last four lines of `scan-dist.mjs`'s output in that build are:
  ```
  scan-dist: 3 files scanned, 2 findings, all reviewed; record written
  scan-dist: reviewed row NOTICE.txt credential 19092: matched
  scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched
  scan-dist: reviewed row app.js local-filesystem-path 7291: not found
  ```

**Caller grep**
- `first_undeclared_findings` has its product caller at `kernel/src/publish/mod.rs:953`.
- `is_built_asset` has its product caller at `mod.rs:957`.
- `with_build_record` has its product caller at `frontends/shell/src-tauri/src/publish.rs:1395`.
- `read_build_record` is called at `publish.rs:1394`.
- `write_zone_texts` is a `fixture`-feature item. Its only callers are tests, `publish.rs:3225` and `permission_boundary.rs:1114`, on the fixture precedent.

**Differences from the form or the brief**
1. `manifest.ts` is over its ceiling, as stated at the top.
2. The gate's walk is generic over the error type and takes an `io_error` closure (so `redaction.rs` stays std-only). `walk` returns `Vec<Finding>` and takes a `first_only` flag, which is how the gate stops at the first file with a non-declared finding. The form left the shape to the worker. `scan-dist.rs` carries `#![allow(dead_code)]` because the standalone compile does not use the gate function.
3. `read_build_record` parses with `serde(deny_unknown_fields)`. A missing member, a non-string asset value, a trailing unknown member or a version other than 1 all refuse with W8. W8's four conditions are all covered, plus malformed `assets`. The W8 `{remedy}` strings are written inline in `read_build_record`, not shared with `resolve_viewer_dir`, to stay under the 45-line sub-ceiling. T8 asserts the message ends with the remedy that `resolve_viewer_dir` gives, so drift would fail.
4. `scan-dist.mjs` removes an existing record before scanning, so none survives a failed scan. It takes optional `dist` and `record` arguments (V1 and V3 use them) and exports `compare` and `listFiles`. Its per-row status lines come last in the output; the form's "last line" wording is ambiguous.
5. The shell crate's `cargo test` needs the ignored `frontends/shell/src/generated/NOTICE.txt` to exist. My first run failed on that. I ran `node scripts/generateNotice.mjs` in the worktree to produce it; it is ignored and uncommitted. The same applies to `renderer/bundle-viewer/viewer-asset-hashes.json`, which `npm run build` writes and which is ignored.
6. For M3 only, the mutation was applied in the same Bash call as the hold, ahead of it. That deviates from the prescribed hold-call shape. Every other cargo run used the prescribed shape.
7. cargo stops at the first failing test binary, so M8 needed two invocations: U1 in lib, and T6 separately.
8. I used the tilde path to the machine script as the brief gave it.

**Pre-gate self-check (the four failure classes)**
- Cross-module code uses the interface the other side actually has. I read `Staging::path`, `CancelWatch::check`, `ViewerAssets` and `PublishRequest` first. The seams are proven end to end by T1, T5, T6, T8 and T9 from the real producer and consumer shapes.
- Every completion claim points to evidence: the named tests, the mutation outputs, the exit codes and the scripts above.
- Every user-facing string describes behaviour implemented at this commit. W1 and W8 are marked `[P6 placeholder]`.
- Every required test reaches its intended assertion, not only its setup. M1 to M6 and M8 to M15 each failed at the intended assertion; I read each panic line.

**Hold lines (my project only)**

I did not read or quote any other project's lines. The grant line also carries a trailing `also=` field, which I omit here.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` (the same prefix on each of the cargo runs)
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:48960 affinity=FF (cores 0-7)` (one example; the shell id varies per call)

No cargo, rustc, node or scan-dist process of mine is still running. All background tasks completed and every hold was released. The only processes matching my worktree path were the tool's own shells.

**Final porcelain:** empty. HEAD is 979a7d5d27c13216318f468a40fc0203b43e8f9c and equals `origin/cut/bundle-redaction-scan`.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
