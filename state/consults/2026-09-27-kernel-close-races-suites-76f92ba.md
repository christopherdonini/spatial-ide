*Custodian's filing note (2026-09-27): §9's suites for PLAN node `kernel-generation-close-races` at the branch head `76f92ba0a193ba4a5c68de4c8972a7b13d1b27c1` (`cut/kernel-generation-close-races`, after Amendment 1's eight lines), run by the custodian in the worktree `C:/dev/wt/kernel-close-races` (its own `target/`) on 2026-09-27 between about 21:27Z and 21:50Z. The workspace test run and the shell's `npm run verify` ran concurrently. The merge-base with main is `0ada14f`. Each section names its command and exit status; the lines inside each fence are extracted from the run's own output by script and are unedited, and the counts outside the fences are computed by script from those lines. Not an agent report. Profile paths redacted at filing (0).*

---

## 1. `cargo test --workspace --no-fail-fast` — exit 0

Summed over the 80 `test result:` lines below: 778 passed, 0 failed, 40 ignored.

The log's own `Running`/`Doc-tests` and `test result:` lines, unedited:

```
     Running unittests src\lib.rs (target\debug\deps\spatial_data_plane-61191f38165d9569.exe)
test result: ok. 24 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s
     Running tests\candidate_a.rs (target\debug\deps\candidate_a-e8795e9f650bdf8f.exe)
test result: ok. 11 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.83s
     Running tests\no_transport_leakage.rs (target\debug\deps\no_transport_leakage-7399dddebf76b5f2.exe)
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\origin_header_encoding.rs (target\debug\deps\origin_header_encoding-5ed6084b62542108.exe)
test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
     Running tests\stream_registry_bound.rs (target\debug\deps\stream_registry_bound-b2c6608aa64f3d48.exe)
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.17s
     Running unittests src\lib.rs (target\debug\deps\spatial_engine-2a4b9f077a11e2ef.exe)
test result: ok. 167 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 2.67s
     Running tests\admission_format_semantics.rs (target\debug\deps\admission_format_semantics-5721ce90717f826a.exe)
test result: ok. 23 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.72s
     Running tests\admission_instruments.rs (target\debug\deps\admission_instruments-f9a15808cf4d20fd.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.21s
     Running tests\admission_p4_corpus.rs (target\debug\deps\admission_p4_corpus-1e4b8c86ff96d4a1.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\batch_sizing.rs (target\debug\deps\batch_sizing-81888dd4735faf11.exe)
test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.81s
     Running tests\connection_reuse.rs (target\debug\deps\connection_reuse-a78254565b9efff9.exe)
test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 12.25s
     Running tests\filter_composition.rs (target\debug\deps\filter_composition-80d8cbaebc77028e.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.62s
     Running tests\first_batch_and_pruning.rs (target\debug\deps\first_batch_and_pruning-4c251814d6b7e9a6.exe)
test result: ok. 17 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.32s
     Running tests\fixture_generation.rs (target\debug\deps\fixture_generation-9e3f43309e7ee8d7.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.75s
     Running tests\identity.rs (target\debug\deps\identity-43924cb3f5eb34c9.exe)
test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.89s
     Running tests\import_layout_5gb_digest.rs (target\debug\deps\import_layout_5gb_digest-3f49dfd02c2f2c4b.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\import_layout_5gb_fixtures.rs (target\debug\deps\import_layout_5gb_fixtures-46408f4730a0105b.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\import_layout_digest.rs (target\debug\deps\import_layout_digest-0b701ed79c522d11.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\import_layout_fixtures.rs (target\debug\deps\import_layout_fixtures-bdadf72bf37c824b.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\index_build_cancellation.rs (target\debug\deps\index_build_cancellation-5c0fc9c2b1019997.exe)
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 12.31s
     Running tests\live_projection.rs (target\debug\deps\live_projection-46c4825c975a7040.exe)
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.38s
     Running tests\lod_tier_builder.rs (target\debug\deps\lod_tier_builder-394198adfd0a774d.exe)
test result: ok. 14 passed; 0 failed; 2 ignored; 0 measured; 0 filtered out; finished in 621.23s
     Running tests\lod_tier_cancellation.rs (target\debug\deps\lod_tier_cancellation-76c5ee1643c39be6.exe)
test result: ok. 1 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 22.66s
     Running tests\lod_tier_measurements.rs (target\debug\deps\lod_tier_measurements-2e9ce4f718c5327c.exe)
test result: ok. 1 passed; 0 failed; 4 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\lod_tier_preflight.rs (target\debug\deps\lod_tier_preflight-e7deb8f8381a5f72.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.12s
     Running tests\planner_seam.rs (target\debug\deps\planner_seam-0681619b737477e6.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.21s
     Running tests\predicate_admission.rs (target\debug\deps\predicate_admission-93ba6c93ef2ad8ef.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.22s
     Running tests\publish_stream.rs (target\debug\deps\publish_stream-a7f5527c116b4672.exe)
test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.48s
     Running tests\row_group_seam.rs (target\debug\deps\row_group_seam-82ef31d6010808a2.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.60s
     Running tests\session_identity.rs (target\debug\deps\session_identity-9f5e1a565ddd4791.exe)
test result: ok. 18 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.24s
     Running tests\slice.rs (target\debug\deps\slice-5d4f77735a8557ea.exe)
test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.92s
     Running tests\source_watch_adapter.rs (target\debug\deps\source_watch_adapter-a9ef3b91104d2c37.exe)
test result: ok. 13 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 2.16s
     Running tests\spatial_index.rs (target\debug\deps\spatial_index-1a800a8f238a05dd.exe)
test result: ok. 10 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.64s
     Running unittests src\lib.rs (target\debug\deps\spatial_kernel-ae7e60b79ca7d0aa.exe)
test result: ok. 128 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.59s
     Running unittests src\bin\publish-bundle.rs (target\debug\deps\publish_bundle-889a74dc61d07e54.exe)
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s
     Running unittests src\main.rs (target\debug\deps\slice_host-1179d26a53fba775.exe)
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\cancel_rescore.rs (target\debug\deps\cancel_rescore-cac33faa766cbbe1.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\concurrency_in_situ.rs (target\debug\deps\concurrency_in_situ-0554b904e087bd83.exe)
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 9.10s
     Running tests\describe_crs_unit.rs (target\debug\deps\describe_crs_unit-e9696fad9cd92988.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.23s
     Running tests\end_to_end.rs (target\debug\deps\end_to_end-098528e12e50e2b3.exe)
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.79s
     Running tests\first_batch_factorial.rs (target\debug\deps\first_batch_factorial-ad4da4cc8ac600d9.exe)
test result: ok. 2 passed; 0 failed; 5 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\import_layout_factorial.rs (target\debug\deps\import_layout_factorial-5e52a1823ee4867e.exe)
test result: ok. 2 passed; 0 failed; 2 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\import_layout_publish_determinism.rs (target\debug\deps\import_layout_publish_determinism-5b1e5406a09aed25.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\indexed_budgets.rs (target\debug\deps\indexed_budgets-41885577067ac1dd.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\manual_walkthrough_fixtures.rs (target\debug\deps\manual_walkthrough_fixtures-cee55baebdbc2313.exe)
test result: ok. 0 passed; 0 failed; 9 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\no_generation_in_persisted_artifacts.rs (target\debug\deps\no_generation_in_persisted_artifacts-f2564d70f7a492b2.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 2.57s
     Running tests\permission_boundary.rs (target\debug\deps\permission_boundary-ee9581ebd4d9e9b1.exe)
test result: ok. 14 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.42s
     Running tests\post_check_cost_report.rs (target\debug\deps\post_check_cost_report-3b21600830f047e5.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.84s
     Running tests\publish.rs (target\debug\deps\publish-619d7519e082fc71.exe)
test result: ok. 28 passed; 0 failed; 2 ignored; 0 measured; 0 filtered out; finished in 4.41s
     Running tests\publish_cancellation.rs (target\debug\deps\publish_cancellation-7d224f4c4e0c7875.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 12.05s
     Running tests\publish_cli.rs (target\debug\deps\publish_cli-523ec73f42db3a59.exe)
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.13s
     Running tests\query_window_attribution.rs (target\debug\deps\query_window_attribution-0326a32a91c7b3cd.exe)
test result: ok. 2 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\regenerate_fixture.rs (target\debug\deps\regenerate_fixture-80c1bdb33af760a7.exe)
test result: ok. 3 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\scale_pass.rs (target\debug\deps\scale_pass-de61271c61af7207.exe)
test result: ok. 1 passed; 0 failed; 2 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\scale_pass_a6.rs (target\debug\deps\scale_pass_a6-177b752aba18a2c5.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\session_end_event.rs (target\debug\deps\session_end_event-270416c72e2004ce.exe)
test result: ok. 7 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.82s
     Running tests\session_generation.rs (target\debug\deps\session_generation-a11402649618fd21.exe)
test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s
     Running tests\session_reference.rs (target\debug\deps\session_reference-97c080216911a083.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.25s
     Running tests\skp_admission.rs (target\debug\deps\skp_admission-7b6159bf50ded573.exe)
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 4.57s
     Running tests\skp_admission_remediation.rs (target\debug\deps\skp_admission_remediation-47df522daf735e48.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.10s
     Running tests\skp_filter_cancellation.rs (target\debug\deps\skp_filter_cancellation-210fea8574310832.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 38.51s
     Running tests\skp_projection.rs (target\debug\deps\skp_projection-d78362c4377fed43.exe)
test result: ok. 10 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.58s
     Running tests\slice_budgets.rs (target\debug\deps\slice_budgets-37ef4dbf58277cb9.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\source_watch_ordering.rs (target\debug\deps\source_watch_ordering-3ca7644abe7d9e8f.exe)
test result: ok. 14 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.36s
     Running tests\source_watch_windows.rs (target\debug\deps\source_watch_windows-c98e54f6030be034.exe)
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.27s
     Running tests\trace_spans.rs (target\debug\deps\trace_spans-0ded5e5d61925ca4.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 25.02s
     Running tests\typed_terminal_codes.rs (target\debug\deps\typed_terminal_codes-410aa6cc95e09c34.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s
     Running tests\verify_bundle.rs (target\debug\deps\verify_bundle-8f14437de0c54c4b.exe)
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.97s
     Running tests\wire_bytes_invariant.rs (target\debug\deps\wire_bytes_invariant-887fddbb7442428d.exe)
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.70s
     Running unittests src\lib.rs (target\debug\deps\spatial_renderer-d87e48baaa2dbe29.exe)
test result: ok. 30 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.41s
     Running tests\style_agreement.rs (target\debug\deps\style_agreement-6a19df2147040414.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\style_shell_agreement.rs (target\debug\deps\style_shell_agreement-f1e634df1d0247a6.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running unittests src\lib.rs (target\debug\deps\spatial_skp-46bdecb8b953abcb.exe)
test result: ok. 25 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\conformance\main.rs (target\debug\deps\conformance-52c8136b5e981107.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
     Running tests\fixtures.rs (target\debug\deps\fixtures-204aea1bef71357d.exe)
test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s
   Doc-tests spatial_data_plane
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   Doc-tests spatial_engine
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   Doc-tests spatial_kernel
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   Doc-tests spatial_renderer
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
   Doc-tests spatial_skp
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

## 2. `cargo clippy --workspace --all-targets` — exit 0

- clippy warning lines (excluding per-crate summaries): 38
- warnings on branch-added lines: 0
- Method: each warning's primary `-->` location is intersected with the lines `git diff -U0 0ada14f...76f92ba` adds (`clippy-touch`, the custodian's scratch script).

## 3. `npm run verify` in `frontends/shell` — exit 0

```
checkDevOriginConsistency: PASS -- vite.config.ts's server.port (5180) matches tauri.conf.json's build.devUrl ("http://localhost:5180")'s own port.
checkOriginEventName: PASS -- lib.rs's and originSelfCheck.ts's ORIGIN_SELF_CHECK_MISMATCH_EVENT both equal "origin-self-check-mismatch", and their `kind` discriminants agree: ["mismatch","unverifiable"].
adrIndex: PASS -- 32 ADRs, index in docs/README.md matches every Status line
check:dist-clean: PASS -- 0 hits for 24 instrument identifiers, 0 surviving call sites for 2 expected-absent-caller identifiers, and >=1 surviving call site each for 7 expected-present identifiers, across 4 dist file(s).
check:dist-notice: PASS -- all 3 required notice strings, all 26 Vite package name(s), and all 335 linked crate name(s) found across 4 dist file(s); no forbidden or degraded strings; anchored entry-line counts match each section's own source (viewer 3, frontend 26, Rust crates 352, DuckDB amalgamation 26); every pinned amalgamation licence file's sha256 re-verified, the linked libduckdb-sys 1.10505.0 is the version the manifest pins, and the crate tarball's own sha256 and third_party/ listing (26 dirs) match the pinned manifest.
 Test Files  72 passed (72)
      Tests  1090 passed (1090)
== 76 passed, 0 failed ==
== 30 passed, 0 failed ==
```

## 4. `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` — exit 0

```
ℹ tests 349
ℹ pass 349
ℹ fail 0
```

## 5. The verify tools (each tool's commit: the last commit touching its file at 76f92ba)

```
verify-cites @ 522e448: verify:cites PASS — every rooted (in-tree) path:line reference across 849 file(s) resolves. (32 loose reference(s) advised above.)
verify-quotes @ f9444a4: verify:quotes PASS — 110 checked, 79 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors.
verify-test-claims @ b82941e: verify:test-claims PASS — all 346 claimed test(s) across 89 file(s) exist or are planned, superseded or withdrawn (1 planned, 3 superseded, 16 withdrawn, advisory).
verify-mutation @ 7d24ed1 (--base 0ada14f --head HEAD): verify:mutation PASS — all 6 new test(s) have a recorded mutation naming them.
verify @ db9d20b (--offline): verify:plan PASS — C:\dev\wt\kernel-close-races\PLAN.yaml agrees with the repository.
```

## 6. §7's count, by §7's own command with `<merge-base>` = `0ada14f` (`git merge-base HEAD origin/main`) at 76f92ba

```
1	0	engine/SOURCE-WATCHER-PREREGISTRATION.md
1	1	frontends/shell/src/testUtils/terminalShapes.ts
541	72	kernel/src/skp.rs
1	1	kernel/tests/session_end_event.rs
77	29	kernel/tests/session_generation.rs
5	0	kernel/tests/skp_admission.rs
1	0	kernel/tests/skp_filter_cancellation.rs
7	0	kernel/tests/skp_projection.rs
8	37	kernel/tests/source_watch_ordering.rs
2	1	kernel/tests/typed_terminal_codes.rs
1	0	kernel/tests/wire_bytes_invariant.rs
```

645 insertions + 141 deletions = 786 lines; 11 files.

## 7. rustfmt (`rustfmt --check --edition 2021 --color never`, rustfmt 1.9.0-stable) over the nine `.rs` files the branch changes

Hunk counts (`Diff in` lines) at the merge-base `0ada14f` (each base copy checked beside its original, so its `mod` paths resolve, then removed) and at 76f92ba:

| File | 0ada14f | 76f92ba |
|---|---|---|
| `kernel/src/skp.rs` | 99 | 99 |
| `kernel/tests/session_end_event.rs` | 24 | 24 |
| `kernel/tests/session_generation.rs` | 19 | 18 |
| `kernel/tests/skp_admission.rs` | 37 | 37 |
| `kernel/tests/skp_filter_cancellation.rs` | 9 | 9 |
| `kernel/tests/skp_projection.rs` | 42 | 42 |
| `kernel/tests/source_watch_ordering.rs` | 36 | 33 |
| `kernel/tests/typed_terminal_codes.rs` | 17 | 17 |
| `kernel/tests/wire_bytes_invariant.rs` | 18 | 18 |

Branch-added lines that a rustfmt hunk rewrites (`fmt-touch`, the custodian's scratch script: a hunk's `-` line whose number is one `git diff -U0 0ada14f...76f92ba` adds):

```
kernel/src/skp.rs: rustfmt hunks=99, branch-added lines=541, hunk '-' lines on branch-added lines: 1341,1343,1377
kernel/tests/session_end_event.rs: rustfmt hunks=24, branch-added lines=1, hunk '-' lines on branch-added lines: none
kernel/tests/session_generation.rs: rustfmt hunks=18, branch-added lines=77, hunk '-' lines on branch-added lines: 351,23
kernel/tests/skp_admission.rs: rustfmt hunks=37, branch-added lines=5, hunk '-' lines on branch-added lines: 116,309,360,437,595
kernel/tests/skp_filter_cancellation.rs: rustfmt hunks=9, branch-added lines=1, hunk '-' lines on branch-added lines: 131
kernel/tests/skp_projection.rs: rustfmt hunks=42, branch-added lines=7, hunk '-' lines on branch-added lines: 184,321,432,500,530,580,676
kernel/tests/source_watch_ordering.rs: rustfmt hunks=33, branch-added lines=8, hunk '-' lines on branch-added lines: 19
kernel/tests/typed_terminal_codes.rs: rustfmt hunks=17, branch-added lines=2, hunk '-' lines on branch-added lines: 96
kernel/tests/wire_bytes_invariant.rs: rustfmt hunks=18, branch-added lines=1, hunk '-' lines on branch-added lines: 257
```

## 8. P3's caller grep at 76f92ba (§6 item 2)

§6 item 2's grep, run from inside `kernel/src` so that its paths print relative to that directory (the same two pathspecs; `frontends/shell/src-tauri/src` has no match). Rooted `path:line` tokens into lines that exist only on the branch would fail `verify-cites` on main.

```
$ cd kernel/src && git grep -n "SessionRef::mint" -- . ../../frontends/shell/src-tauri/src
skp.rs:1164:                let session = SessionRef::mint();
skp.rs:1176:                let session = SessionRef::mint();
skp.rs:2725:        generations.mint_for_open(dataset, SessionRef::mint());
skp.rs:2907:        generations.mint_for_open(&name, SessionRef::mint());
skp.rs:2981:        generations.mint_for_open(dataset, SessionRef::mint());
skp.rs:3441:    /// REGISTERED MUTATION: restore a minting arm in `live_generation` (a `SessionRef::mint()`
skp.rs:3567:        let session = SessionRef::mint();
```

`SkpHost::open_dataset` begins at line 1025 of `skp.rs` and `SkpHost::describe` at line 1190 (both at 76f92ba); the first `#[cfg(test)]` in the file is at line 2045.

## 9. P4: the shell diff against the merge-base

```
$ git diff --stat 0ada14f...76f92ba -- frontends/shell
 frontends/shell/src/testUtils/terminalShapes.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```
