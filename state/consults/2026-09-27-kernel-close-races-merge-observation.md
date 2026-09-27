*Custodian's filing note (2026-09-27): the observation of record named by `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` Amendment 1, item 1.3 (PLAN node `kernel-generation-close-races`, on `cut/kernel-generation-close-races`). The custodian's own run, not an agent report. The command was `cargo test -p spatial-kernel --no-fail-fast`, run in the worktree `C:/dev/wt/kernel-close-races` (its own `target/`) on 2026-09-27 at about 21:15Z, exit 101. The tree was the merge of `origin/main` (`0ada14f`) with its one conflict resolved and the helper's `columns: None` added. Those were the last edits before the run, and the merge was then committed with no further edit as `ecc4a37`, so the run is of `ecc4a37`'s tree. Its result: 8 tests failed, each with `skp.unknown_dataset` — the seven in `kernel/tests/skp_projection.rs` and the one in `kernel/tests/wire_bytes_invariant.rs` that Amendment 1's table names — and every other target passed (290 passed, 8 failed and 28 ignored, summed over the `test result:` lines below). Everything below the rule is extracted from the run's log by script: the lines are unedited, and only the lines named in each heading are kept. Profile paths redacted at filing (0).*

---

Per-target lines, in run order (the log's own `Running`/`Doc-tests` and `test result:` lines, unedited):

```
     Running unittests src\lib.rs (target\debug\deps\spatial_kernel-ae7e60b79ca7d0aa.exe)
test result: ok. 128 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.56s
     Running unittests src\bin\publish-bundle.rs (target\debug\deps\publish_bundle-889a74dc61d07e54.exe)
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s
     Running unittests src\main.rs (target\debug\deps\slice_host-1179d26a53fba775.exe)
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\cancel_rescore.rs (target\debug\deps\cancel_rescore-cac33faa766cbbe1.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\concurrency_in_situ.rs (target\debug\deps\concurrency_in_situ-0554b904e087bd83.exe)
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 9.21s
     Running tests\describe_crs_unit.rs (target\debug\deps\describe_crs_unit-e9696fad9cd92988.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.22s
     Running tests\end_to_end.rs (target\debug\deps\end_to_end-098528e12e50e2b3.exe)
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.47s
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
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 2.34s
     Running tests\permission_boundary.rs (target\debug\deps\permission_boundary-ee9581ebd4d9e9b1.exe)
test result: ok. 14 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.40s
     Running tests\post_check_cost_report.rs (target\debug\deps\post_check_cost_report-3b21600830f047e5.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.93s
     Running tests\publish.rs (target\debug\deps\publish-619d7519e082fc71.exe)
test result: ok. 28 passed; 0 failed; 2 ignored; 0 measured; 0 filtered out; finished in 4.40s
     Running tests\publish_cancellation.rs (target\debug\deps\publish_cancellation-7d224f4c4e0c7875.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 10.48s
     Running tests\publish_cli.rs (target\debug\deps\publish_cli-523ec73f42db3a59.exe)
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.73s
     Running tests\query_window_attribution.rs (target\debug\deps\query_window_attribution-0326a32a91c7b3cd.exe)
test result: ok. 2 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\regenerate_fixture.rs (target\debug\deps\regenerate_fixture-80c1bdb33af760a7.exe)
test result: ok. 3 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\scale_pass.rs (target\debug\deps\scale_pass-de61271c61af7207.exe)
test result: ok. 1 passed; 0 failed; 2 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\scale_pass_a6.rs (target\debug\deps\scale_pass_a6-177b752aba18a2c5.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\session_end_event.rs (target\debug\deps\session_end_event-270416c72e2004ce.exe)
test result: ok. 7 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.81s
     Running tests\session_generation.rs (target\debug\deps\session_generation-a11402649618fd21.exe)
test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s
     Running tests\session_reference.rs (target\debug\deps\session_reference-97c080216911a083.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.24s
     Running tests\skp_admission.rs (target\debug\deps\skp_admission-7b6159bf50ded573.exe)
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 4.83s
     Running tests\skp_admission_remediation.rs (target\debug\deps\skp_admission_remediation-47df522daf735e48.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.09s
     Running tests\skp_filter_cancellation.rs (target\debug\deps\skp_filter_cancellation-210fea8574310832.exe)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 40.92s
     Running tests\skp_projection.rs (target\debug\deps\skp_projection-d78362c4377fed43.exe)
test result: FAILED. 3 passed; 7 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.21s
     Running tests\slice_budgets.rs (target\debug\deps\slice_budgets-37ef4dbf58277cb9.exe)
test result: ok. 0 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s
     Running tests\source_watch_ordering.rs (target\debug\deps\source_watch_ordering-3ca7644abe7d9e8f.exe)
test result: ok. 14 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.32s
     Running tests\source_watch_windows.rs (target\debug\deps\source_watch_windows-c98e54f6030be034.exe)
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.29s
     Running tests\trace_spans.rs (target\debug\deps\trace_spans-0ded5e5d61925ca4.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 26.78s
     Running tests\typed_terminal_codes.rs (target\debug\deps\typed_terminal_codes-410aa6cc95e09c34.exe)
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s
     Running tests\verify_bundle.rs (target\debug\deps\verify_bundle-8f14437de0c54c4b.exe)
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.59s
     Running tests\wire_bytes_invariant.rs (target\debug\deps\wire_bytes_invariant-887fddbb7442428d.exe)
test result: FAILED. 1 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.50s
   Doc-tests spatial_kernel
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
error: 2 targets failed:
    `-p spatial-kernel --test skp_projection`
    `-p spatial-kernel --test wire_bytes_invariant`
```

Failing tests (the log's `... FAILED` lines, unedited):

```
test columns_empty_list_is_refused_never_read_as_null ... FAILED
test every_projection_refusal_is_synchronous_typed_and_pre_mint ... FAILED
test a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte ... FAILED
test describe_projectable_agrees_with_viewport_query_admission_for_every_column ... FAILED
test every_projection_refusal_matches_its_committed_error_fixture_shape ... FAILED
test a_projection_composes_with_a_filter ... FAILED
test a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns ... FAILED
test wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too ... FAILED
```

Each failure's panic block (the log's lines from each `thread '...' panicked at` line to the next blank line, unedited):

```
thread 'columns_empty_list_is_refused_never_read_as_null' (41016) panicked at kernel\tests\skp_projection.rs:529:10:
columns: null must admit — today's frames, unchanged: SkpError { code: "skp.unknown_dataset", message: "no open dataset with handle `ds_00000000000000000000000000000011` (closed, or never opened this session)", fields: {"handle": "ds_00000000000000000000000000000011"} }

thread 'every_projection_refusal_is_synchronous_typed_and_pre_mint' (34852) panicked at kernel\tests\skp_projection.rs:376:9:
assertion `left == right` failed: empty list: wrong code
  left: "skp.unknown_dataset"
 right: "skp.projection_empty_list"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

thread 'a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte' (43052) panicked at kernel\tests\skp_projection.rs:504:5:
assertion `left == right` failed
  left: "skp.unknown_dataset"
 right: "skp.filter_column_not_filterable"

thread 'describe_projectable_agrees_with_viewport_query_admission_for_every_column' (50660) panicked at kernel\tests\skp_projection.rs:587:21:
column `id` marked not-projectable, but was refused with `skp.unknown_dataset`, not a projection code

thread 'every_projection_refusal_matches_its_committed_error_fixture_shape' (2800) panicked at kernel\tests\skp_projection.rs:460:9:
assertion `left == right` failed: v0-error-projection_empty_list: code must match the committed fixture
  left: "skp.unknown_dataset"
 right: "skp.projection_empty_list"

thread 'a_projection_composes_with_a_filter' (28092) panicked at kernel\tests\skp_projection.rs:676:43:
a projection and a valid filter must compose: SkpError { code: "skp.unknown_dataset", message: "no open dataset with handle `ds_00000000000000000000000000000040` (closed, or never opened this session)", fields: {"handle": "ds_00000000000000000000000000000040"} }

thread 'a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns' (27072) panicked at kernel\tests\skp_projection.rs:185:43:
the fixture's own request must admit: SkpError { code: "skp.unknown_dataset", message: "no open dataset with handle `ds_00112233445566778899aabbccddeeff` (closed, or never opened this session)", fields: {"handle": "ds_00112233445566778899aabbccddeeff"} }

thread 'wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too' (1056) panicked at kernel\tests\wire_bytes_invariant.rs:268:10:
a declared projection over a real Float64/Utf8 pair must admit: SkpError { code: "skp.unknown_dataset", message: "no open dataset with handle `ds_00000000000000000000000000000001` (closed, or never opened this session)", fields: {"handle": "ds_00000000000000000000000000000001"} }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```
