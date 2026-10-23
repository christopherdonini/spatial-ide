*Custodian's filing note (2026-10-22): lead-data's owner's-index update for the redaction scan (§9), read only in the branch's worktree at 979a7d5d. The run 2026-10-22T00:20:13Z to 00:24:32Z by its transcript (Grep 25, Read 21; no Write, Edit or Bash). K1 to K6 and E1 are applied on the branch by a worker, byte-copied from this file. Its item 1, ADR-036 still called Proposed in both indexes, is outside this piece and is placed by the custodian. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 6894272fabeb2a25917d11d58e4533f368e96a1b828f726a1f6c75bcacb829d7.*

---

Drafted: bundle-redaction-scan-not-in-product-publish, the owner's-index update, at 979a7d5d

Result: six line replacements in `kernel/README.md` (12 changed lines, at the ceiling of 12) and one in `engine/README.md` (2 changed lines, ceiling 4). Each edit is below. No blocking question.
Report path: C:/dev/spatial-ide/state/consults/2026-10-22-bundle-redaction-scan-not-in-product-publish-owners-index-update.md (I wrote no file and computed no sha256, as the brief asks).

I read in the worktree at H only. I have no shell, so I ran no git diff and no test. Each claim below was checked by reading the code or the test at H.

## kernel/README.md

### K1. Last verified, line 360

Line at H, `kernel/README.md:360 @ 979a7d5d`:
```text
- **Last verified at:** d5863945 (every pointer checked at that commit); every pointer this piece adds or changes (the SKP host row, the session-history row, the `a_session_history_carries_no_generation_session_reference_handle_path_or_user_name` pointer, this piece's form in the preregistration list, limit 43 and the three session-history ceilings) at fa620916
```
New line:
```text
- **Last verified at:** d5863945 (every pointer checked at that commit); every pointer this piece adds or changes (the SKP host row, the session-history row, the `a_session_history_carries_no_generation_session_reference_handle_path_or_user_name` pointer, this piece's form in the preregistration list, limit 43 and the three session-history ceilings) at fa620916; every pointer the bundle redaction scan adds or changes (the publish row, the permission-boundary row, the bundle-viewer row under consumed-from, its form in the preregistration list and limit 47) at 979a7d5d
```
Checks: the five things named are edits K2 to K6, each checked below at 979a7d5d.

### K2. The publish row, line 372

Line at H, `kernel/README.md:372 @ 979a7d5d`:
```text
  - Publish and the bundle format → ADR-017; `spatial_kernel::publish::preflight`, `spatial_kernel::publish::publish_unguarded`, `spatial_kernel::bundle` · pinned by `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares`, `kernel/tests/publish.rs::an_existing_destination_is_refused_rather_than_replaced`, `kernel/tests/verify_bundle.rs::every_corruption_class_is_caught_with_its_declared_state`, `kernel/tests/publish.rs::a_multipolygon_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`, `kernel/tests/publish.rs::a_point_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`, `kernel/tests/publish.rs::a_line_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`
```
New line:
```text
  - Publish and the bundle format → ADR-017, its §13 for the redaction gate before the rename (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`); `spatial_kernel::publish::preflight`, `spatial_kernel::publish::publish_unguarded`, `spatial_kernel::bundle`, `spatial_kernel::bundle::redaction` (also compiled on its own by `renderer/bundle-viewer/scripts/scan-dist.rs`), `spatial_kernel::publish::ViewerAssets::with_build_record` (its caller: the shell's `bundled_viewer`) · pinned by `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares`, `kernel/tests/publish.rs::an_existing_destination_is_refused_rather_than_replaced`, `kernel/tests/verify_bundle.rs::every_corruption_class_is_caught_with_its_declared_state`, `kernel/tests/publish.rs::a_multipolygon_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`, `kernel/tests/publish.rs::a_point_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`, `kernel/tests/publish.rs::a_line_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`, `kernel/tests/permission_boundary.rs::a_viewer_asset_matching_its_build_record_is_published_and_the_same_asset_one_byte_changed_is_refused`, `kernel/src/publish/viewer_assets.rs::tests::only_a_viewer_file_whose_bytes_hash_to_its_own_build_record_entry_is_skipped`, `kernel/tests/typed_terminal_codes.rs::a_redaction_refusal_detail_begins_with_its_typed_code`
```
Checks:
- **"§13" is the redaction section.** Its heading `### 13. Redaction` is at `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:500 @ 979a7d5d`.
- **The gate runs before the rename.** It is in `run_inner` at `kernel/src/publish/mod.rs:936-970 @ 979a7d5d`. That is after the sidecar write at `kernel/src/publish/mod.rs:931-934 @ 979a7d5d` and before `staging.finalize` at `kernel/src/publish/mod.rs:974 @ 979a7d5d`. T6 asserts `no_side_effect` after the refusal (`kernel/tests/permission_boundary.rs:1221 @ 979a7d5d`).
- **`spatial_kernel::bundle::redaction` is public.** See `kernel/src/lib.rs:77 @ 979a7d5d` and `kernel/src/bundle/mod.rs:48 @ 979a7d5d`. The walk the gate uses is `first_undeclared_findings`, which is `pub(crate)`, at `kernel/src/bundle/redaction.rs:359-370 @ 979a7d5d`.
- **"also compiled on its own by scan-dist.rs".** See `renderer/bundle-viewer/scripts/scan-dist.rs:12-13 @ 979a7d5d` (the `#[path]` include) and the module doc at `kernel/src/bundle/redaction.rs:49-55 @ 979a7d5d`.
- **`with_build_record` is a `pub fn`.** See `kernel/src/publish/viewer_assets.rs:155 @ 979a7d5d`. `ViewerAssets` is re-exported at `kernel/src/publish/mod.rs:88 @ 979a7d5d`.
- **Its caller is the shell's `bundled_viewer`.** The call is at `frontends/shell/src-tauri/src/publish.rs:1395 @ 979a7d5d`. A grep of the worktree finds no other non-test caller.
- **T6 exists** at `kernel/tests/permission_boundary.rs:1161 @ 979a7d5d`.
- **U1 exists** at `kernel/src/publish/viewer_assets.rs:336 @ 979a7d5d`, inside `mod tests` (`kernel/src/publish/viewer_assets.rs:255 @ 979a7d5d`).
- **T3 exists** at `kernel/tests/typed_terminal_codes.rs:495 @ 979a7d5d`.
- **The six earlier pins are byte-identical** to the line at H. Their files are declared unchanged or are not in this piece's diff.

### K3. The permission-boundary row, line 373

Line at H, `kernel/README.md:373 @ 979a7d5d`:
```text
  - Class-3 permission boundary and audit log → `kernel/PERMISSION-BOUNDARY.md`; `spatial_kernel::permission::boundary::execute`, `spatial_kernel::permission::audit` · pinned by `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`, `kernel/tests/permission_boundary.rs::an_intent_without_an_outcome_is_a_readable_state_not_a_missing_record`
```
New line:
```text
  - Class-3 permission boundary and audit log → `kernel/PERMISSION-BOUNDARY.md`; `spatial_kernel::permission::boundary::execute`, `spatial_kernel::permission::audit` · pinned by `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`, `kernel/tests/permission_boundary.rs::an_intent_without_an_outcome_is_a_readable_state_not_a_missing_record`, `kernel/tests/permission_boundary.rs::the_boundary_refuses_a_bundle_whose_data_holds_a_path_before_the_rename_and_audits_it_as_refused`, `kernel/src/permission/audit/reader.rs::tests::a_redaction_refusal_reads_as_its_plain_reason`
```
Checks:
- **T5 exists** at `kernel/tests/permission_boundary.rs:1122 @ 979a7d5d`. It asserts `refused` and `RedactionFinding` at `kernel/tests/permission_boundary.rs:1153-1154 @ 979a7d5d`.
- **The boundary arms it pins:** `error_kind` at `kernel/src/permission/boundary.rs:240 @ 979a7d5d`, and the `Refused` classing at `kernel/src/permission/boundary.rs:302-305 @ 979a7d5d`.
- **T4 exists** at `kernel/src/permission/audit/reader.rs:416 @ 979a7d5d`, inside `mod tests` (`kernel/src/permission/audit/reader.rs:358 @ 979a7d5d`). It pins the reader's arm at `kernel/src/permission/audit/reader.rs:276-280 @ 979a7d5d`.

### K4. The bundle-viewer row under consumed-from, line 384

Line at H, `kernel/README.md:384 @ 979a7d5d`:
```text
  - `renderer/bundle-viewer/ceilings.json` (compiled in by `kernel/src/publish/ceilings.rs`), and the built viewer passed in as `spatial_kernel::publish::ViewerAssets` ← renderer/bundle-viewer
```
New line:
```text
  - `renderer/bundle-viewer/ceilings.json` (compiled in by `kernel/src/publish/ceilings.rs`), and the built viewer passed in as `spatial_kernel::publish::ViewerAssets`, with its build record (`renderer/bundle-viewer/viewer-asset-hashes.json`'s `assets`, written by `renderer/bundle-viewer/scripts/scan-dist.mjs`) attached by `ViewerAssets::with_build_record` ← renderer/bundle-viewer
```
Checks:
- **The record's file and member.** The doc of `with_build_record` names `renderer/bundle-viewer/viewer-asset-hashes.json`'s `assets` (`kernel/src/publish/viewer_assets.rs:153-155 @ 979a7d5d`).
- **Who writes it.** `scan-dist.mjs` writes it, and only after the scan passes (`renderer/bundle-viewer/scripts/scan-dist.mjs:75-94 @ 979a7d5d`).
- **How the kernel uses it.** The kernel matches it in `is_built_asset` (`kernel/src/publish/viewer_assets.rs:163-169 @ 979a7d5d`).

### K5. The preregistration list, line 387

Line at H, `kernel/README.md:387 @ 979a7d5d`:
```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`, `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`, `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md`, `kernel/B2-1B-RECORDING-PREREGISTRATION.md`
```
New line: the same line with this appended:
```text
, `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`
```
Check: the form is at `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:1 @ 979a7d5d`. The worker writes this as one line; the code block above only splits it for reading.

### K6. Declared limits, line 392

Line at H, `kernel/README.md:392 @ 979a7d5d`:
```text
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43
```
New line:
```text
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47
```
Check: item 47, the publish redaction refusal, is at `KNOWN-LIMITATIONS.md:411-418 @ 979a7d5d`.

## engine/README.md

### E1. Last verified, line 530

Line at H, `engine/README.md:530 @ 979a7d5d`:
```text
- **Last verified at:** 32c3e807 (every pointer checked at that commit)
```
New line:
```text
- **Last verified at:** 32c3e807 (every pointer checked at that commit); the test-support row, whose `spatial_engine::fixture` gains `write_zone_texts`, at 979a7d5d
```
Checks:
- **The new fixture.** `write_zone_texts` is at `engine/src/fixture.rs:1686 @ 979a7d5d`, inside `spatial_engine::fixture`, which only builds with the `fixture` feature (`engine/src/lib.rs:109-110 @ 979a7d5d`).
- **The test-support row is still true and is not edited.** It names the module, not its functions (`engine/README.md:546 @ 979a7d5d`).
- **Why the edit is owed at all.** The engine index is already true at H. This edit is owed only by the index's update rule, "Updated in the PR of every piece that changes what a pointer points to" (`engine/README.md:528 @ 979a7d5d`). Form §9 named line 546 as well, but nothing in that line has become untrue, so I did not draft it.

## Count against the ceilings (Amendment 3, item 10)

- `kernel/README.md`: K1 to K6, 6 deletions plus 6 insertions, **12 of 12**. No slack is left: any extra line a gate asks for would go over the ceiling (class 8).
- `engine/README.md`: E1, 1 deletion plus 1 insertion, **2 of 4**.
- Neither index gains a line, so both stay under their 60-line rule (kernel 43 lines, engine 35).

## What I could not settle

1. **ADR-036 is listed wrongly in both indexes, but not because of this change.** Its status at H reads `Accepted 2026-10-22` (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3 @ 979a7d5d`; it reached main before B′). The indexes still call it Proposed:
   - `kernel/README.md:374 @ 979a7d5d` ("(Proposed)")
   - `kernel/README.md:375 @ 979a7d5d` ("(Proposed)")
   - `kernel/README.md:391 @ 979a7d5d` (the Proposed list)
   - `engine/README.md:553 @ 979a7d5d` (the Proposed list)
   
   The accepted-ADR lists at `kernel/README.md:386 @ 979a7d5d` and `engine/README.md:549 @ 979a7d5d` also lack ADR-036. The kernel ceiling has no room for these fixes, so I have not drafted them. They are for the custodian to place.
2. **Engine "engine halves of pieces filed elsewhere" (`engine/README.md:552 @ 979a7d5d`).** This form edits `engine/src/fixture.rs`. The precedent is `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, whose Scope line names that same file (`kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md:4 @ 979a7d5d`) and which is not in that list. Following it, I did not add this form. If the custodian wants it listed, it is 2 more lines and fits the engine ceiling (4 of 4).
3. **The tests in other modules are not in the kernel index.** They are T1, T8 and T9 in `frontends/shell/src-tauri/src/publish.rs`, and V1 to V3 in `renderer/bundle-viewer/scripts/scan-dist.test.mjs`. They pin the seams K2 and K4 name. I left them out because the kernel rows pin kernel tests only, though the engine index does pin kernel tests. Adding them would cost no extra lines, since they would go into existing rows.
4. **I did not run any test,** so the new and existing pins' passing is for the gates' suites.
5. **The `979a7d5d` in K1 and E1 is where I read.** Once the worker applies the edits, H moves, and the reviewer checks the edits against the new diff (form §9).
6. **Other index lines are unchanged and still true.** The ceilings row (`kernel/README.md:395 @ 979a7d5d`) is unchanged and still points to `MAX_VIEWER_ASSETS` and `MAX_VIEWER_ASSET_BYTES` (`kernel/src/publish/viewer_assets.rs:36-38 @ 979a7d5d`) and to `PUBLISH_WRITE_CHUNK_BYTES` (`kernel/src/publish/mod.rs:151 @ 979a7d5d`). The binaries row's pins use synthetic viewers, for example `kernel/tests/verify_bundle.rs:134 @ 979a7d5d`. Apart from the ADR-036 lines in item 1, I found no other index line made untrue.
