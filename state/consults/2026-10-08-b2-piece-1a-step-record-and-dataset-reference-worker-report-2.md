*Custodian's filing note (2026-10-08): `b2-piece-1a-step-record-and-dataset-reference`'s stage 2 worker report, at the branch head 479ae81d (the same worker-high run, resumed about 04:41Z, report at 05:49:54Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8630f802d0ad65d4c9b26f4f6802750632cd16c2fc990ccfe2e70c3731e6ca9b. Paths and lines below are at the branch head, not main.*

---

STAGE 2 REPORT, piece 1a. Branch cut/b2-piece-1a-step-record-and-dataset-reference at 479ae81d, pushed in ordinary updates (never forced). Base c01f2e09. Everything is green on the first build; no compile error, no failing new test, no edit to any existing test, no I3.

## Commits added in stage 2
- 1251fc3c test: the recorded mutation of every new test of piece 1a, observed at 1e637d55 (test text only, 4 files)
- 479ae81d docs: the engine and kernel owner's indexes, last verified at the last commit that changes code (piece 1a)
(Stage 1's six commits stand: 66f7bc26, 85fc25f8, f727dd6d, 98adfe3c, 2bd318b4, 1e637d55.)

## Commands, exit codes, holds (every heavy command in a shared hold, CARGO_TARGET_DIR=D:/wt-targets/1a, CARGO_BUILD_JOBS=8, RUST_TEST_THREADS=8; holds granted, no 96-99 code)
1. `cargo test --workspace --locked --features spatial-engine/fixture`: rc 0, HELD, cold build. 101 test binaries: 920 passed, 0 failed, 54 ignored. It includes descriptor.rs's unit tests, publish.rs, verify_bundle.rs, unchanged. New tests seen passing: O1-O4, R1-R7 (R7 is `a_project_relative_locator_that_leaves_the_project_folder_is_refused`), K1-K5, G1.
2. Lock diff after the first build, `git diff c01f2e09 HEAD -- Cargo.lock` (re-checked at 479ae81d): exactly `+ "getrandom 0.3.4",` in spatial-kernel's dependency list, nothing else.
3. `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`: rc 0, HELD. 73 warning lines (44 with a location), all in pre-existing code. None in dataset_ref.rs, descriptor.rs, source_observation.rs, the two kernel test files I changed or kernel/Cargo.toml. Two are in kernel/src/lib.rs at 398 and 473, not on my added line (line 63). No new warning on an added line.
4. Mutations: see table. Each run: `cargo test --workspace --locked --features spatial-engine/fixture --test|--lib <file> <name>`, HELD, rc 101 (the expected failure). (A first attempt with `-p spatial-engine` changed the feature set and began recompiling libduckdb-sys; I stopped my own two cargo PIDs (13236, 36028) and used the workspace form, which reuses the cold build.) After 1251fc3c: `cargo test --workspace ... --lib --test source_observation --test dataset_ref --test no_generation_in_persisted_artifacts`, HELD, rc 0 (lib 24+200+152, tests 4+5+7+30+27 passed, 0 failed).
6. `cargo fmt --all -- --check`: rc 0 (at head). `node scripts/adrIndex.mjs --check` in frontends/shell (no node_modules): rc 0, PASS. `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, HELD, 450 tests, 450 pass, 0 fail. verify.mjs rc 0; queue.mjs --check rc 0; site.mjs --check rc 0; verify-cites rc 0 (34 pre-existing advisories); verify-quotes rc 0 (121 checked, 90 verified, 30 baselined, 1 advisory, 0 errors); verify-test-claims rc 0 (all 520 claimed tests exist or are planned/superseded/withdrawn). These last six node commands ran unheld (light, single process).

## Mutations table
All seventeen were made by hand on a clean tree at HEAD 1e637d55 (observation commit), the named test run alone, reverted with `git checkout -- .` (tree clean after each). Not a `verify-mutation` run.
| Row | Test | Mutation | Failing assertion |
|---|---|---|---|
| O1 | an_observation_carries_the_four_components_the_open_read | observation() footer_hash: None | footer-hash assert_eq, left None, right Some(sha-256) |
| O2 | a_recorded_observation_differs_from_a_rewritten_file_by_the_descriptors_own_rule | observation compare bypasses the shared rule, drops footer-hash | left ["size","mtime","footer-length"], right adds "footer-hash" |
| O3 | a_data_page_edit_under_preserved_size_mtime_and_footer_is_not_detected | observation() modified_nanos: None | "the declared limit: no component is named for this edit" |
| O4 | an_unestablished_component_compares_by_the_degradation_rule | shared rule counts a footer hash on one side only | "a footer hash that was never taken is not a changed component" |
| R1 | a_reference_round_trips_through_its_canonical_text_byte_for_byte | parser drops admission.identity | byte comparison: reparsed text has "identity":null |
| R2 | an_unknown_member_is_refused_by_its_path | parser ignores unknown keys | unwrap_err on an Ok value (first case) |
| R3 | a_locator_count_or_string_over_its_ceiling_is_refused | locator-count check removed | unwrap_err on Ok, nine locators |
| R4 | a_dataset_uri_outside_its_grammar_is_refused | hex check removed from FromStr | the uppercase-hex URI "must be refused" |
| R5 | a_project_relative_locator_parses_and_writes_back_unchanged | parser refuses project-relative | "a project-relative locator parses: Malformed {path: $.resource.locators[1].at, detail: mutation}" |
| R6 | an_asserted_crs_without_a_definition_is_refused_rather_than_recorded_empty | None maps to "" | unwrap_err on Ok(Some(CrsAssertion{definition_json: ""})) |
| R7 | a_project_relative_locator_that_leaves_the_project_folder_is_refused | grammar check removed | unwrap_err on Ok for "../x.parquet" (first case) |
| K1 | the_reference_uses_the_bundles_resource_ref_vocabulary | writer renames portability_policy | key-set assert "the reference holds those members and no seventh" (this one fires before the order assert) |
| K2 | a_reference_survives_a_reopen_through_open_dataset_and_reports_no_change_detected | writer omits crs_assertion | the second open_dataset is refused: engine.format_default_contradicted (the recorded-assertion checks read the built ref, not the text, so they pass) |
| K3 | a_reopen_after_the_file_changed_names_each_changed_component | check returns NoChangeDetected | second assertion: left NoChangeDetected, right Differs{observed:["mtime"]} |
| K4 | a_reopen_under_another_identity_declaration_names_the_admission_difference | check skips identity | first check: left NoChangeDetected, right Differs{admission:["identity"]} |
| K5 | the_dataset_reference_module_reads_no_file_hashes_nothing_and_takes_no_lease | linked calls std::fs::metadata(ds.path()) | scan of real source: left ["std::fs"], right [] |
| G1 | a_dataset_reference_carries_no_generation_session_reference_handle_path_or_assertion_attribution | locator at carries ds.path() (implemented as linked recording ProjectRelative(ds.path()) since MachineRecorded is a unit variant) | "the reference's text names the fixture's path" |
Observation commit for all: 1e637d55. Reverted: yes, all. The RECORDED MUTATION comments (naming 1e637d55, no line numbers) are in 1251fc3c. All 17 mutations failed their tests as intended; none needed a test change.

## Section 7, at final head 479ae81d (insertions+deletions, the form's command, base c01f2e09)
- engine product: descriptor.rs 154 (ceiling 180)
- engine tests: source_observation.rs 238 (240)
- kernel product: dataset_ref.rs 818 + lib.rs 1 + Cargo.toml 3 = 822 (760): OVER by 62
- kernel tests: dataset_ref.rs 408 + no_generation... 117 = 525 (520): OVER by 5
- ADR: 174 (280); indexes: 6 + 11 = 17 (30)
- TOTAL 1930 (2010), 10 files (10).

## Deviations (class)
- Class 8: kernel product overrun, 822 vs 760. Stage 1 reported 814 (Amendment 2's mint, R7, grammar check were unbudgeted); the +8 now is the recorded-mutation comments. Class 8: kernel tests overrun 525 vs 520, wholly the recorded-mutation comments (stage 1 was 518). Section 7 not edited.
- Class 3 (test text): three earlier doc predictions were wrong and are corrected in 1251fc3c's observations: K1 fails on its key-set assertion before the order one, R4 on the uppercase-hex case, K2 at the second open. R6's explanatory sentence (a real open refuses an assertion with no definition for want of an axis order) was dropped from its comment when I replaced the note; it remains true.
- No compile fix changed a design point; none was needed.
- Stage 1's deviations stand (K5 strips the quoted "content_hash"; F3 maps onto native id; K1 order by positions; R6 at unit level; O4 both-absent not constructible; parse() takes a Value; etc.).

## Predictions of section 3
All held: F1 builds and round-trips byte-for-byte (R1, K2); F1' differs in size, mtime, footer-length AND footer-hash (O2 and K3 both passed with the exact four-name vector, so the footer-length prediction held); F1'' (data-page edit, size and mtime restored) names no component, NoChangeDetected-style empty list (O3 passed); F2 opens through SkpHost with assertion and declaration, records both claims without by/at, reopen gives NoChangeDetected (K2, G1); F3 (as adapted: mapped vs native on the same file) gives Differs{admission:["identity"]} (K4).

## Noticed, not done
- Test timings: publish_cancellation and the first heavy suites ran slowly in the cold build; nothing timing-sensitive failed.
- No existing test, PLAN.yaml, the form, or the main checkout was touched; node_modules are absent in frontends/shell so `npm run verify:adr-index` was run as the node script.
- Scratch folder holds my helper scripts (w1a-*.mjs, adrlib.mjs, build/check_adr*.mjs).

Model: Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff.
