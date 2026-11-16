*Custodian's filing note (2026-11-15): lead-data's read-only five-line form draft for `lod-tier-tests-own-tier-folder`, the filler queue's entry 11, read at main 68857b9e, from its hand-back (37095 bytes, sha256 85b7698bfd5b59b2dc3ed59128f4e99c186f785d3c18bc1daabd5aab750b7b38), below the rule. Each `sha256:<H>` pin that follows a cite is filled by script with the sha256 of the cited whole lines, each with its LF, at 68857b9e6771296c506134281ece3d202e9366eb (76 pins). 25 of them are bare line numbers, each bound to the nearest earlier path and line cite in the same paragraph, as the quote checker binds them, but one: the bare `:1438-1442` in N1's list of the builder's ignored rows is bound to `engine/tests/lod_tier_builder.rs`, the file whose test it names, where that rule would bind it to `engine/src/lod.rs`. Two are left: the draft's own sentence about them, and the pin on the PLAN node's fields, which names no lines. Nothing else is changed. Its brief by file (8936 bytes, sha256 64ef01a5678b8fdcbbe9a068a3bd2646911cb0b258453362a2999db420c091c6), carrying the reuse index's three misses byte for byte; the run 2026-11-15T14:44:16Z to 2026-11-15T15:01:14Z by its transcript, 71 calls (Grep 35, Read 32, Glob 3, SubagentHandback 1), no write, one errored call (a Read of a path that does not exist), model claude-opus-5-5. Its OPEN-5 is ruled by the advisor (`state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-14-lod-tier-open-5-a-one-five-line-form-both-gates-from-dispatch-size-note-260-for-this-piece-three-terms.md`); its other OPEN items take its recommendations under the direction of 2026-10-31, item 4, recorded 2026-11-15. A draft and not Authority.*

---

Draft: lod-tier-tests-own-tier-folder five-line form, lead-data, at 68857b9e

Result: the five lines are drafted below. The piece touches no §21a category, so it can take the five-line form. It is estimated at about 240 lines over 7 files, which is over §21c's 150 lines. That closes it to the single gate, and it takes §36's two gates from dispatch.
Blocking question for the advisor (OPEN-5): §36 says a filler fits a five-line form within §21c's size, and §21a says a change over the size threshold takes the full shape. Does this piece stay one filler on a five-line form with both gates, or is it split, or does it take the full form?
Report path: state/consults/2026-11-15-lod-tier-tests-own-tier-folder-five-line-form-lead-data-draft.md. I wrote no file and have no shell, so the custodian computes the sha256 when filing. I leave no background shell.

Wording convention: no text below is a quotation unless it is code text or tool output marked as copied byte for byte. Every other sentence is my own wording. Every `sha256:<H>` is filled by the custodian's script from the whole cited lines, each with its LF.

Form path, from the forms index (governance/README.md:23 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1a043fffd97b3db90f07c55a43d498dbda72f522eca034adc375ab8ebd153978): `governance/forms/engine/LOD-TIER-TESTS-OWN-TIER-FOLDER-PREREGISTRATION.md`. Six of the seven Scope files are under engine/.

```
Authority: PLAN node `lod-tier-tests-own-tier-folder` (governance/PLAN.yaml, that node's title, budget_minutes and summary fields @ 68857b9e6771296c506134281ece3d202e9366eb sha256:<H>), filler queue entry 11, graded S3 (state/FILLER-QUEUE.md:34 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1dc5fa0bf10c730a22a74c39dbac6158f21f5f3bbb98e987cdd844fb73beb30c), placed by the human's ruling of 2026-11-06, item 2 (state/directives/2026-11-06-u12-e2e-on-5400-u1-size-accepted-tier-folder-node-review-packet-decisions.md:10 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:575e723b186e8433af97c0b14d1ee7fd771b685304254269f221f80f67950589), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84); the finding is #284's gate-1 reviewer report, its check 2 (state/consults/gates/2026-11-06-literal-only-float-integer-arithmetic-refused-gate1-reviewer.md:78 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b111fe055dfbf626892100435739a4c32db55b2269b899208a229dcfcce58ea5; :81-83 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:03bab5c51c7bdf7c72717c47f0f09263600ad36b5e016409d53c9d04bf1bbd9e), with the binary passing alone in that piece's Amendment 1 (governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:324 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:33a3d8c9ad78bc596813724dbf99f8ed8ab7c7db62bb887887c52d6b3ae118ac); the product's tier root stays the one port-2 settled (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:62 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:cc45ee68926d56ab49400508d1a08c976aad396b0a04280cb5f8cb492578875f; engine/src/app_dirs.rs:6-9 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:6e8db860fe962cbec9b9126c657d82c07558df17ce1d15cc5ca88b35ae94d7a9); reuse index: three misses, no prior art recorded for "test tier cache directory per run", "localappdata test isolation" or "parallel test suites shared cache folder" (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this form's brief).
Scope: 7 files: engine/tests/common/mod.rs (the per-run folder helper `tier_run_root`, the machine-wide root as inherited, a `build_tiers` wrapper that ensures the folder first, and the finished-run sweep, OPEN-2); engine/tests/lod_tier_builder.rs (its tier-path sites through the helper, T-A, T-B and T-B's child half, the comment at engine/tests/lod_tier_builder.rs:981-984 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:75e3592a6d2d873ad85b6ff85faf9b9f9c643272bfa2a2d83efaa2e2e2dff4eb, `drop_tiers`'s doc, and the 5 GB floor's volume, OPEN-3); engine/tests/lod_tier_cancellation.rs and engine/tests/lod_tier_measurements.rs (their `tier_directory` helpers, the cancellation file's doc paragraph on sharing a folder, the measurements floor's volume); engine/tests/lod_tier_preflight.rs (its second build lands in the run's folder); kernel/tests/no_generation_in_persisted_artifacts.rs (its LOD test builds in a per-run folder and removes it, OPEN-8); engine/README.md (owner's index, OPEN-4); declared line budget 260 by §21c's counting rule (governance/AUTONOMY.md:357 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec), about 240 estimated (N6), over §21c's 150 and so closed to the single gate from dispatch (OPEN-5); this form is exempt; no line under engine/src/ or kernel/src/, no Cargo manifest or lockfile, nothing under protocol/, docs/ or KNOWN-LIMITATIONS.md; engine/tests/lod_tier_root.rs unchanged.
Change: in every test under engine/tests and kernel/tests that builds, reads or clears LOD tiers, the tier root on Windows becomes a folder owned by that test's own process below the cargo target's tmp directory, by setting `LOCALAPPDATA` for the test process once, before its first build, while the product's resolution (`app_dirs::tier_cache_dir`, `lod::tier_directory`) is left exactly as it is; no test run reaches %LOCALAPPDATA%\spatial-ide\tiers any more, a later run removes a finished run's folder, and `cargo test --workspace -- --list` gains T-A, T-B and T-B's ignored child half.
Tests+mutation: T-A, new: engine/tests/lod_tier_builder.rs::a_test_runs_tiers_are_built_in_its_own_folder_and_never_under_the_machine_wide_tier_root (a small source whose bytes match no other test's; built through the wrapper; its directory and hash captured and the set removed first; then asserts (1) the directory is not below the inherited `LOCALAPPDATA` joined with `LOD_TIER_ROOT`, and (2) it equals `tier_run_root()` joined with `LOD_TIER_ROOT` and the content hash). T-B, new: engine/tests/lod_tier_builder.rs::a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place (the parent builds over source S; it runs its own test binary as a second process (`std::env::current_exe()`, `--exact` the child half, `--ignored`, S named by an environment variable) and waits for it to exit; the child clears its tier directory for S through `clear_tier_directory`, builds over S, prints its directory and removes its set; then the parent asserts (1) the child exited 0, (2) every one of the parent's three tier files is still on disk, (3) a second parent build reuses all three, and (4) the child's directory differs from the parent's; the order comes from process sequence alone, with no sleep, timer or timing window). Child half, new, ignored on every platform: engine/tests/lod_tier_builder.rs::the_second_run_half_of_the_two_runs_test (it returns at once when its variable is absent). M1, for both: in `common::tier_run_root` delete the `std::env::set_var("LOCALAPPDATA", ..)` line, so the product resolves the machine-wide root again; predicted: T-A FAILS at (1); T-B FAILS at (2), because the child reuses the parent's tiers in the one shared hash folder and its removal deletes them. M2, T-B only, under OPEN-2 (A): the sweep removes every sibling folder without first testing its lock; predicted: T-B FAILS at (2), because the child's start-up sweep removes the parent's live folder. No existing test's assertion changes what it asserts. Each mutation is observed by applying it, running `--test lod_tier_builder` filtered to the two tests, recording the failure by name and commit in a `RECORDED MUTATION:` comment (this file's convention), and reverting. A verify-mutation run is never called an observation.
Out-of-scope: ADR: none (no status line or amendment; ADR-018's cancellation behaviour is untouched, and the cancellation test changes only where its helper resolves the folder); security: none (nothing ADR-020, ADR-009 or ADR-021 governs; nothing is written outside the cargo target and the temporary directories the tests already use); wire: none (nothing under protocol/, no SKP or data-plane change); guarantee: none touched (no line under engine/src/ or kernel/src/ changes, so app_dirs.rs's table, `tier_root_for`, `tier_cache_dir`, `lod::tier_directory`, `LOD_TIER_ROOT`, the free-disk preflight and every refusal stay as port-2 left them; port-2's claim that one boundary decides the tier root still holds, and T-A's (2) now checks it end to end; no existing assertion changes what it asserts, N5); no new dependency (std only), no new exposure surface, no string a user sees; §25 (e) is set aside for a filler by §36 in any case.
```

*The notes, OPEN items and unsettled points below are mine, as lead-data.*

## Notes

**N1. Every test that writes, reads or clears a tier folder under the machine-wide root, at 68857b9e**

The tier folder is the inherited `LOCALAPPDATA` joined with `spatial-ide/tiers` and the source's content hash (engine/src/lod.rs:1163-1181 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:a80d34fb4998af1ec0a61d3418977f97d6c0d0da4fbf125cc722f997f4647e17; engine/src/app_dirs.rs:91-99 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:be0612d532d4d059f92abd3a48f463cf8440a096da779d0d0b63ae9faa9db5b2; :112-115 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:24a2a4bf8c2219ad609fc834b48c2ebc0bee92bf7933b163ade74376ffb4cf7f). "Default" below means the default `cargo test` on Windows. Off Windows, every default row here is ignored by the `cfg_attr` reason that port-2 set (for example engine/tests/lod_tier_builder.rs:494-498 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b9c977e817c8b2d494224ff98cd899830f7a24bb9d43a8e164bdbfe1bb5452cc).

- **engine/tests/lod_tier_builder.rs, default:**
  - `ladder()` (engine/tests/lod_tier_builder.rs:71-85 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:75faef5ae0a341dde9b69adb79c9d55c64719f6fac5cc7289c0aafc20a0eff67) calls `clear_tier_directory` (:88-96 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:026e58ffa63421c2eb8d364e5548f38bd9c548900017249c2ca715c5c5f5a087).
    - It removes the folder for polygons-100k's hash, then builds the ladder there, and never removes it afterwards.
    - Its six readers are `tier_build_emits_zero_invalid_polygons`, `tier_preserves_identity_for_every_row`, `engine_opens_its_own_tier`, `tier_writer_does_not_reorder_rows`, `wkb_writer_round_trips_the_first_tier_written` and `the_built_sets_size_is_disclosed_with_the_tiers`. Each reads tier files or the manifest.
    - The reviewer's failure was the first reader opening a tier file that another run had removed (the gate report :81 above).
  - Four tests build over their own sources and remove their sets with `drop_tiers` (:477-481 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:34e5e8ad359aee991bfdd5d2ad1bf5b827d156097e4eeea17f0732bcb4ad3eaf), each at the hash of its source:
    - `a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size` (:685-700 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:20ad24d78326fc5264de4965393863e9ce795487bc6469026567c678f66a8ddd);
    - `a_build_measures_the_largest_single_feature_simplify`;
    - `tier_is_not_served_when_source_content_hash_changes`;
    - `a_stale_tier_batch_cannot_exist_without_the_stale_label`.
  - `tier_larger_than_its_source_is_refused` reads the machine-wide hash folder and removes it (:1151-1169 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:995df29f797f562692951c525db66563c149f0fdba7bfd2655c329cd736abbf6).
  - `build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier`, and the point and linestring tests, each clear the folder, then read it and remove it (:1527 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:f0e1a197b6e91f548ad74bb740b449dc2081e5ec6884116ff7a679addd039ec5; :1541-1554 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:8cd5cccd55358c74b2e03b17d524332440f6993570b39542a1dfb96fce754f6e; :1606-1619 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:8cd5cccd55358c74b2e03b17d524332440f6993570b39542a1dfb96fce754f6e; :1671-1684 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:8cd5cccd55358c74b2e03b17d524332440f6993570b39542a1dfb96fce754f6e).
  - **They do not reach the tier root:**
    - `geographic_crs_source_is_refused_for_tier_building` and `crs_without_a_declared_linear_unit_is_refused` are refused at `linear_unit_of` before `tier_directory` runs (engine/src/lod.rs:1018 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:5537ef2c93b539dcce9ccfbbc2a653379805a411abf415713c37d18ae07906ed; :1028 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:9fc1b1e852cbe653787ae6e0865fac469957620887c454963fa13b51d172fc6d).
    - `the_rejected_simplifier_is_the_one_that_emits_invalid_polygons` reads only the fixture.
- **engine/tests/lod_tier_builder.rs, `--ignored` only:**
  - `the_5gb_ladder_under_disk_discipline` (:1438-1442 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:058abc4f4efe766fb04ff335fecf8576036e0ebd778535f0b208518d8c8cb079) removes its tier files and leaves the manifest and the folder.
  - `two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file` touches the fixture only.
- **engine/tests/lod_tier_cancellation.rs:**
  - Default: `cancel_observed_within_the_declared_ceiling` uses its own `tier_directory` (engine/tests/lod_tier_cancellation.rs:34-40 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:10276e660b50044a0c9bf844b54f54c62a8470697ec4866770e5f7a923598b17). It removes the folder before and after (:139-141 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:29ac0f00fb307a9e2627c130a52a358349ced085ba05b5186a04d1876fcf02a6; :183 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:29f6bc466821b58a903750324f5f8061f064d7374f5b670a7665c74d30e0506d). This is the same polygons-100k folder as the ladder's, so a run in another worktree removes another run's ladder this way as well.
  - `--ignored`: `cancel_observed_within_the_declared_ceiling_at_5gb` (:201-202 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:68c29e21e1af91691b081e000bf17578f0c4f99ed8de6c65051db38c6df8b156).
- **engine/tests/lod_tier_measurements.rs, all `--ignored`:**
  - `wall_time_arm_s_and_arm_p_over_polygons_100k` touches the polygons-100k folder again, through `tier_directory` and `clear_tier_directory` (engine/tests/lod_tier_measurements.rs:66-80 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:3899bc047309fec6ae04dc47c85a6973b490f0f5e7b407a599bcec633c910bfa; :195-227 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:0f16e0978a88650cd37ad10db38534f36e241ea62aa3ddf62629b5f0b8ed8746).
  - `wall_time_arm_s_over_parcels_5gb`, `wall_time_arm_p_over_parcels_5gb` and `the_5gb_ladder_outcomes_o1_to_o4` all go through `five_gb_build` (:509-510 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:68c29e21e1af91691b081e000bf17578f0c4f99ed8de6c65051db38c6df8b156; :617-631 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1aa7a66425f456a3d9309fef9a765382b63c3c2cddfe962ee97ba9e09cb40486). It leaves the manifest and the folder.
  - The only default test in this file, `the_row_order_check_fires_on_a_permutation`, touches no tier.
- **engine/tests/lod_tier_preflight.rs, default:** `the_preflight_refuses_before_the_first_tier_is_written`.
  - Its first build runs under an absent volume and writes nothing.
  - It then restores the inherited `LOCALAPPDATA`, builds again into the machine-wide root, and removes its hash folder (engine/tests/lod_tier_preflight.rs:165-172 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:50fd2c26b0b6b46b9e5dd6ad061c7130bdc5a86daaa0106a53936bad92b3a187; :196-205 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:f29d3ecf7f08e3cb8d96d888756b6c241dfd934763c948ab81e2915794c388ab).
- **engine/tests/lod_tier_root.rs, default:** on Windows it sets a relative value, which is refused before any write (engine/tests/lod_tier_root.rs:104-113 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:145791175bc61e01fbb7f445a829fb3bf50660b50335f1725284e6aaf86920e3). It touches nothing under the machine-wide root and is not edited.
- **kernel/tests/no_generation_in_persisted_artifacts.rs, default:** `a_built_lod_tier_sets_manifest_and_tier_files_carry_no_generation_substring` builds into the machine-wide root and never removes the set (kernel/tests/no_generation_in_persisted_artifacts.rs:425-467 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b04749b3645e7b771c019cf2b3c5da533336927967a6730629c348f2c6e618ab).
- **kernel/src/skp.rs's test** `an_engine_produced_lod_refusal_reaches_the_wire_as_engine_dot_lod_refused` uses a geographic source. It is refused before the tier root (kernel/src/skp.rs:2739-2745 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b084d8358b1de18b3ab59a3f6f9d10ff5d18dd10ccea3ee4126fae1832fd3a39), so it needs no change and kernel/src/ stays out of Scope.
- **engine/tests/common/mod.rs** writes no tier. Its `POLYGONS_100K` is one absolute path on Windows for every worktree (engine/tests/common/mod.rs:19-21 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:c6ab1235cbd1a23f01a46540f198f592f354048be442f74ec707d9b27744e484), so every worktree hashes the same bytes into the same tier folder.
- **Other crates:** none. No other Rust file in the repository names `build_tiers` or the tier path, and no product path builds a tier (kernel/src/skp.rs:2261-2262 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:f4cd77e71281f3ca4c5800739f9fa58e48d68027b75f1a3dcb1213dcb8c93c60). So on this machine the machine-wide folder holds test output only.

**N2. What "a test run" is: the test process**
- **Two runs from two worktrees: the separation must hold.**
  - This is the case that was observed.
  - The folder is keyed only by content hash, the 100k fixture is one path for every worktree, and the small sources are generated deterministically.
  - So identical bytes from any worktree reach one folder, and each binary clears or removes it (N1).
- **Two runs from the same worktree: the tier separation holds, but it is not enough.**
  - Under OPEN-1 (A) with per-process folders, the two runs get separate tier folders.
  - The two runs still share their sources. Every run removes and rewrites the sources under the worktree's `target/fixtures/lod-tier-builder/<name>` (engine/tests/lod_tier_builder.rs:466-475 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:72f32ae47c2d76f36dfc9077ce740a02fa5dcfb44efacd746822dce74d06b137; engine/tests/lod_tier_preflight.rs:146-151 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:e3d13464fa85d46c181f5693e8292db5683b4d9abdb37c44e50ab0e3adc20aed) and the kernel's `workspace()` (kernel/tests/no_generation_in_persisted_artifacts.rs:100-113 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:799ef79254ec3c9f5a65c2cf9d86a59b721db3454ec2c42240d2697ef93ae123).
  - So two runs in one worktree can still break each other through their sources. That is outside this node (OPEN-6).
- **Binaries of one run: the separation is not needed for correctness.**
  - Cargo runs test binaries one after another (engine/tests/lod_tier_cancellation.rs:7-11 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:511b4dc5018e25f48d74c97f27112541009dd26712126d605fb129c5e3141c4b; the builder comment in Scope).
  - Per-process folders give the separation anyway. Both comments, which rely on the binaries running in sequence, are reworded so they stay true.
  - Inside one binary, the parallel tests share one folder. The existing rule that each test's source has bytes of its own still governs them (engine/tests/lod_tier_builder.rs:774-776 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:f26bc476a43f9dff62b273c62dcd7294dd692d8f1c4af031efa55f2db826fd02).

**N3. How each run gets its own folder, under OPEN-1 (A)**
- **`common::tier_run_root()`** is a `OnceLock`. Its first call:
  - saves the inherited `LOCALAPPDATA` as the machine-wide value;
  - names the folder `env!("CARGO_TARGET_TMPDIR")/lod-tier-runs/<pid>`;
  - on Windows, takes that folder's lock and sweeps finished sibling folders (OPEN-2);
  - removes any stale folder of the same id and creates the folder;
  - on Windows, sets `LOCALAPPDATA` to the folder.
  - The value never changes again in that process.
- **`common::build_tiers`** has the engine's signature. It calls `tier_run_root()` and then delegates to the engine's function.
  - Each LOD file imports it in place of the engine's, so every call site is covered by an import change.
  - P-0b checks that only common names `spatial_engine::lod::build_tiers`.
- **Path sites:** each site that builds the path from `LOCALAPPDATA` uses `common::tier_run_root().join(LOD_TIER_ROOT)` instead (`LOD_TIER_ROOT` is public: engine/src/lod.rs:151 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1aebd7d78db085849cc03d02ccd9df07330ca2f82602791d2c28c4ae7610d08a).
- **Preflight:** it takes `mod common;` and calls the helper first. Its existing save and restore then restores the run's folder, so its second build lands there.
  - common's two fixture items get `#[allow(dead_code)]`, as `generations_performed` already has.
- **Kernel test:** it cannot use engine/tests/common, because that would cross the docs/02 module boundary.
  - It sets `LOCALAPPDATA` to `<CARGO_TARGET_TMPDIR>/kernel-lod-tier-run-<pid>` before its build, restores the old value afterwards, and removes the folder.
  - The folder sits outside `lod-tier-runs/`, so an engine sweep never touches it (OPEN-8).
- **Why setting the variable is safe here:**
  - It is set once, before any build in the process, and is never changed while a build runs. That is unlike preflight's injection (engine/tests/lod_tier_preflight.rs:7-10 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:ba026ee0470b49186a7980996a2ca0744c1d8fc3f02fd830b4ed8f7d9c2e9a27).
  - By my reading of the standard library's documentation, `set_var` is safe on Windows in multi-threaded programs. P-0c confirms this in the installed toolchain's docs. Both crates are on edition 2021, where `set_var` is not `unsafe`.
  - Off Windows the variable is never set. Every test that reaches the helper is ignored there, and no tier root is declared there (engine/src/app_dirs.rs:14 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:033b4412397fd1cf89dfe447fc6af4d668f4b50a61a422cffcb98af79e4e6d34).
  - Nothing in engine/ reads the data directory. Its only consumer is the kernel's `data_dir` (kernel/src/permission/audit/log.rs:377-378 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:f4330f77a5be834aaab099c4dcc6fc1a58ad4e49ee2758aeb6db9556ed2e0796).
- **The own-binary shape extends at no cost.**
  - The three LOD binaries and preflight are already separate binaries, so the override needs no new binary and no extra link.
  - One binary per test, the other reading of that shape, would add about 14 binaries, each linking the bundled DuckDB. I have no measured link time for it.

**N4. Where the folders live, their size, and who removes them**
- **Drive:**
  - `CARGO_TARGET_TMPDIR` is inside the run's target directory.
  - For a worker's worktree whose cargo target is on D:, it is D: (governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md:142 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:403b3ceee810701f7409255f000b93cd8624ba405ad1af2e8ba65d5f4a132df2).
  - For the main checkout's own target it is C:, and in CI it is the runner's disk.
  - Nothing is written beside a source, and nothing is written under %LOCALAPPDATA%.
- **Size in the default suite:**
  - The polygons-100k ladder is 2.0509 × its source (engine/LOD-RESULTS.md:129 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:0bdac315cb3a3df30090bf70423dd3d60c58c7dbbe49e1780977dbbf58787a6f). The source is 151,812,642 B (engine/tests/lod_tier_builder.rs:251 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:93304ec85f3aefd434556873204b0653c3c2f3c2f9d14caf60750d58d4032229), so the ladder is about 311 MB by my arithmetic. It is built once per lod_tier_builder process and kept until the process ends.
  - The other sets are small and are removed by their tests.
- **Size in the `--ignored` 5 GB rows:**
  - The ladder totals 10,271,920,822 B and is never on disk all at once (engine/LOD-RESULTS.md:124 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:6bdbbad9439b978a34d2cfbfaad8f32d9b8c6da4dc9ac5e25594547de5b4ed16).
  - The peak is below tier 1 plus tier 2, 8,516,481,220 B by my arithmetic from :100-101 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b4bd9b6513c79f33f9dd1e1eb4c88203f31a7e5f8a4bdf791e627f8bbdb3319a.
  - The preflight requires 15,013,130,115 B free on the volume that holds the folder (:125 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:44831ca17f049ff315652fdde42d90f7ec880e6581fafae0557f1de2191488d7).
  - The 5 GB cancellation row leaves at most one partial tier.
- **Removal:**
  - Each test still removes what it removes today.
  - What is left goes with the run's folder: the ladder, and the manifests the 5 GB and measurement rows leave behind.
  - That folder is removed by the next LOD binary run in the same target, through its start-up sweep, or with the target itself (`cargo clean`, or the custodian's sweep of merged worktrees). This is OPEN-2 (A).
  - **How the sweep works:**
    - A run holds `<pid>.lock` open with no sharing (`std::os::windows::fs::OpenOptionsExt::share_mode(0)`, std only) and creates its folder only after it holds the lock.
    - The sweep opens each sibling's lock file the same way. If the open fails, that run is live and its folder is skipped.
    - If the open succeeds, the owner has exited (Windows closes the handle on any exit, a kill included). The sweep then removes that folder and then its lock file.
    - No age, time or pid-liveness test is involved.
  - Strictly, a run's folder outlives that run until the next run starts. libtest has no end-of-binary hook, and no new dependency is allowed.
- **Leftovers already in the machine-wide root** from past test runs, and from worktrees still on older code, are not this piece's code. Whether and when to remove them by hand is the custodian's call.

**N5. The existing tests after the change**
- **The ladder's build-not-reuse clear:**
  - The folder is new for each process, so the clear finds nothing to remove. It stays as the guard.
  - The ladder is still a build, and no other run can now place tiers in its folder.
- **Measurements:** the reuse guard is unchanged (engine/tests/lod_tier_measurements.rs:195-227 above).
- **Cancellation:** it still clears first, so the cancel is still proven against a build.
- **The no-tier-written checks** in `tier_larger_than_its_source_is_refused` and the three geometry-type refusals now read the run's folder, which is where the product now writes.
  - They assert the same property as before.
  - Their existing weakness is unchanged and disclosed: a folder that does not exist reads as empty, through `unwrap_or_default`.
- **Preflight:** it still proves that the refusal is the preflight's and that the same source builds when there is room.
- **lod_tier_root.rs and the app_dirs unit tests** are unchanged, so the product's rule stays proven.
  - T-A's (2) adds an end-to-end check of the Windows row through `build_tiers`, which no test made before.
- **Under M1,** every existing test still passes on its own, as it does at 68857b9e. Only T-A and T-B catch the regression, which is why they are added.
- **The kernel scan for the word generation:** tiers.json records each tier's absolute path (engine/src/lod.rs:716 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:57190f050b4686a6f5d6fe7a232474030f2022ac61cd6d3922718123fcdcbd37).
  - So no run folder may contain that word in its name, and none of mine does.
  - A target path containing the word would trip the scan, as a profile path could today. P-0d checks this.

**N6. Size, gate and budget**
- **Estimate by file, counting insertions plus deletions, tests and comments included:**

| File | Lines | Parts |
|---|---|---|
| engine/tests/common/mod.rs | about 65 | the helper and its doc about 25, the machine-wide accessor 7, the wrapper 12, the lock and sweep 20, the allows 2 |
| engine/tests/lod_tier_builder.rs | about 125 | the import 3, `clear_tier_directory` 4, five path sites 20, the `drop_tiers` doc 2, the comment 8, the floor 8, T-A about 25, T-B about 35, the child half about 20 |
| engine/tests/lod_tier_cancellation.rs | about 12 | |
| engine/tests/lod_tier_measurements.rs | about 14 | |
| engine/tests/lod_tier_preflight.rs | about 6 | |
| kernel/tests/no_generation_in_persisted_artifacts.rs | about 16 | |
| engine/README.md | about 4 | |
| **Total** | **about 240** | **over 7 files** |

- **Size against §21c:**
  - That is within 8 files and over 150 lines (governance/AUTONOMY.md:350-351 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333). By the brief's rule it is closed to the single gate.
  - OPEN-2 (B) saves about 20 lines and OPEN-3 (B) about 16, leaving about 205. I find no shape at or below 150 that still covers N1.
- **Gate:** §36's two filler gates, the reviewer and the architect, both from dispatch (governance/AUTONOMY.md:692 above).
  - §21b's single reviewer does not apply. The piece is over size, and §36 sets both gates for a filler (governance/AUTONOMY.md:336-345 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:72379b95047a81926ee35b3bdb2d10e27d27c43e97a7c61e9a45af9e191f994e).
  - This is my recommendation. The route is decided by the custodian, the advisor and the gates.
- **Budget:** 60 minutes, the node's budget_minutes field (pinned in Authority). It is the custodian's estimate at placement, not a measurement.
  - It has to cover the edits and two new tests, one with a child process, P-0, and runs 1 to 6 of N7. Those runs include the full engine suite, with the 100k ladder built in a debug profile, and a clippy pass.
  - A fresh worktree also has to compile the bundled DuckDB.
  - I have no measured times, but on this reading the piece does not fit 60 minutes. An overrun is recorded as class 6 and never edits the form's lines.

**N7. Heavy runs** (each inside a shared hold only, yielding to slots 1 and 2; the worker checks each exit code)
1. Base: `cargo test -p spatial-engine --locked --test lod_tier_builder`. Expected: exit 0, with T-A and T-B passing and 3 ignored (the two existing rows plus the child half).
2. M1 applied: `cargo test -p spatial-engine --locked --test lod_tier_builder -- a_test_runs_tiers_are_built a_second_run_clearing`. Expected: exit 101, with T-A failing at (1) and T-B at (2). Then revert.
   - Before and after this run, the worker lists the machine-wide folder's hash folders. The two lists must be equal, because both tests remove what the mutation writes.
3. M2 applied, under OPEN-2 (A): the same command filtered to T-B. Expected: exit 101, with T-B failing at (2). Then revert.
4. `cargo test -p spatial-engine --locked` (the whole engine crate, all the LOD binaries and lod_tier_root included). Expected: exit 0.
5. `cargo test -p spatial-kernel --locked --test no_generation_in_persisted_artifacts`. Expected: exit 0. CI runs `cargo test --workspace --locked` (.github/workflows/product-ci-rust.yml:249 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:a9a5f7dfd80682cf7c1f55f66873911fb936d9a5379c813aa09d8e36cd73e74a).
6. `cargo clippy -p spatial-engine -p spatial-kernel --all-targets --locked -- -D warnings`. Expected: exit 0, the state the clippy node left.
- **Light checks (no hold needed):**
  - the machine-wide folder listed before run 4 and after run 5, with no new or changed entry (another worktree on older code could add noise, so the custodian picks the window);
  - `cargo fmt --all -- --check`;
  - `git diff --name-only origin/main...HEAD -- engine/src kernel/src`, which must be empty;
  - `git diff --numstat origin/main...HEAD` for the size;
  - the plan, cite and test-claim verifiers.
- **Not run in this piece:**
  - the `--ignored` 5 GB rows and the 100k measurement. These are the tester's, need 15 GB free and take hours. They compile in run 4.
  - two suites at once (OPEN-7).
- **P-0 checks, before any code:**
  - (a) No test in the kernel binary reaches `data_dir`, `default_root`, `projects_root`, or an `AuditLog` without `AUDIT_LOG_ENV`.
  - (b) After the edits, only engine/tests/common/mod.rs names `spatial_engine::lod::build_tiers` among the engine tests.
  - (c) The installed toolchain's docs state that `set_var` is safe on Windows.
  - (d) `env!("CARGO_TARGET_TMPDIR")` compiles in both crates' integration tests, and the worktree's target path does not contain the word generation.
- **Stops:**
  - any line changed under engine/src/ or kernel/src/;
  - any existing assertion's expected value edited;
  - any sleep, timer or timing window in T-A or T-B;
  - a new entry appearing under the machine-wide root.

**N8. Rule (00) at 68857b9e** (from the brief's lists)
- PR B touches only frontends/shell/ and renderer/, so it does not overlap. No PR is open. This piece touches nothing under protocol/.
- `probe/port-2-case-policy-red` (one engine/ or kernel/ path) and `cut/revert-pr-320` (two such paths) are not in progress. Their paths were not given, so the custodian checks them against this Scope by git at dispatch. #320's files were kernel/src/skp.rs and kernel/README.md (the close-races form's Amendment 1), and neither is in this Scope.

**N9. Platform**
- The effect is on Windows only.
- The off-Windows ignored lists gain T-A and T-B, under the existing reason string. Every platform's list gains the child half.
- CI prints these lists (.github/workflows/product-ci-rust.yml:255 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b12bdf5346649f3ae7b1f7e0bfe755a8a9b402d08bba8a996bfa5fc36a891940).

## Impact read for engine/ and kernel/ (pointers)
- **Interfaces:** the LOD tier builder row (engine/README.md:550 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:618fe79d3be0e0cf1bc91069785ec2c339a55752c79a3ca062d19294294ecb08) is read only. The kernel's index needs no change.
- **ADRs:** none.
- **Preregistrations:**
  - the LOD form's I6 (governance/forms/engine/LOD-PREREGISTRATION.md:242 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:20dbeb990dcb0042265aa8ae4cccd2da031a0bcd19906bb67b9ef4c06e5af5b4);
  - port-2's §1 claims and its E-L row (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:78 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:a486eea580f10321a2f8d1305ec4ea433302355929031f60189229ed5394ccb4; :86 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:378601d0ed58d96cdb1dd804f3908a007cfec295a698965d43076fa189c21cc0; :187 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1b647604768f843110400ea2ba20bd4815cae7a5466a410ab0de0c894167fb6e).
  - None of these is edited.
- **KNOWN-LIMITATIONS:** none.

## OPEN items
- **OPEN-1. How each run gets its own folder.** Recommendation: (A). Mark: neither; it takes the recommendation, recorded with its date, under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38), held to 2026-11-16 (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:9 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:4331532d442d213e307e19d7866d8d0ede449b81592563a8c378a9e8446912a1).
  - (A) A process override in the test binaries, through engine/tests/common, and inline in the kernel test (N3). No product line changes.
  - (B) A test-only seam under engine/src/, such as a tier-root override behind the `fixture` feature.
    - It would add a second place that decides the tier root, beside the one boundary port-2 claims (§21a's guarantee category; rule (e) then requires the full form at dispatch).
    - It is a `pub` item with no product caller, which the architect's caller rule fails by name.
  - (C) Set `LOCALAPPDATA` from outside the process, on the command line or in `.cargo/config.toml`'s `[env]`.
    - That is not per run, and it moves the data directory for every workspace test and for cargo's own child tools.
  - (D) Give each run's sources unique bytes.
    - The tiers would still be under the machine-wide root, against the ruling, and polygons-100k is one fixed fixture.
- **OPEN-2. The folder's place and its removal.** Recommendation: (A). Mark: neither (direction of 2026-10-31, item 4).
  - (A) `CARGO_TARGET_TMPDIR/lod-tier-runs/<pid>`, with the lock-file sweep (N4).
  - (B) The same place with no sweep. About 311 MB then accumulates per lod_tier_builder run until the target is removed.
  - (C) One folder per binary, cleared at its start. Two runs from one worktree would then share it.
  - (D) `std::env::temp_dir()` on C:, with (A)'s sweep. The drive is then C:, as today, so OPEN-3 is not needed, but the run folders sit on the volume whose free space is most constrained.
- **OPEN-3. The 5 GB rows' 40 GiB floor.** Recommendation: (A). Mark: neither (direction of 2026-10-31, item 4).
  - Today it reads C: (engine/tests/lod_tier_builder.rs:1370-1376 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:5a912ac9fe82e9b1c3fa3b3f1ad673622d7d19a37de98775aec8f310bdeb913a; :1429-1434 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:7ad5a20fcf7e29e1e9450785e11aa926d22612ffcdce6e2739a21eacb8959306; engine/tests/lod_tier_measurements.rs:58-64 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:5a912ac9fe82e9b1c3fa3b3f1ad673622d7d19a37de98775aec8f310bdeb913a).
  - (A) Read the volume of the run's folder, which is the volume the tiers are built on and the one I6 names.
  - (B) Keep C: and disclose the mismatch.
  - (C) Pin the 5 GB rows' folder to C:.
- **OPEN-4. engine/README.md.** Recommendation: (A). Mark: neither (direction of 2026-10-31, item 4).
  - (A) Add this form to the preregistration list (engine/README.md:557 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:86fc0ac11f8021c99eca669206f6d7407fdae201dd6850a4e7f0380c1b1a5a5b) and update the Last-verified bullet (:537 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:8968da6af52f16aaf2e1808b8e8dc41419cd1ba370736624b9969655f1baa30f).
  - (B) Also pin T-B on the LOD row, about 2 lines more.
  - (C) Leave it out.
- **OPEN-5. The route at this size.** Recommendation: (A). Mark: this goes to the advisor. It concerns how this piece runs under the human's §36 rule, and option (B) changes the scope of the human's ruling of 2026-11-06, item 2. It is not reserved to the human under the grant's item 4 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:19-25 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b4bec5730ac2d5519e94a8b23af33f57691740a59025bde1938bce9835a36a32).
  - (A) One five-line form with a declared budget of 260 and both gates from dispatch.
  - (B) Two fillers, each within 150 lines:
    - 11a: the helper without the sweep, the engine edits, T-A and the README.
    - 11b: T-B, the sweep and the kernel test. The kernel test keeps writing to the machine-wide root until 11b lands.
  - (C) The full form, with full gating (governance/AUTONOMY.md:329-332 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:c8c9d75464f21096f3883ae53143cb2fd30dbaae17689b273473ceb9897e672a). An outline is below.
- **OPEN-6. Shared sources when one worktree runs twice.** Recommendation: (A). Mark: neither under (A); (B) changes the ruling's scope and goes to the advisor.
  - (A) Disclose only (N2).
  - (B) Widen this node to give each run its own sources.
- **OPEN-7. A run of two suites at once.** Recommendation: (A). Mark: neither (direction of 2026-10-31, item 4).
  - (A) None. T-B is the deterministic proof.
  - (B) One supplementary two-worktree run, labelled as timing-dependent and not counted as evidence. It needs a second full build.
- **OPEN-8. The kernel test's shape.** Recommendation: (A). Mark: neither (direction of 2026-10-31, item 4).
  - (A) An inline window: set the variable, build, restore it and remove the folder, guarded by P-0a.
  - (B) Move the LOD test into its own kernel test binary. That adds one binary that links DuckDB; its time is unmeasured.

## The full form's outline, only if OPEN-5 (C) is ruled
- §0, the disclosure: N1 and N2.
- §1, may claim:
  - no test run reaches the machine-wide tier root;
  - two runs do not share tiers;
  - nothing accumulates.
- §1, may not claim:
  - same-worktree source separation;
  - any figure from docs/08.
- §1, unchanged: engine/src/ and kernel/src/ entirely.
- §2: N3 and N4.
- §4: T-A, T-B, M1 and M2.
- §5: the N7 predictions, with invalidators P-0a to P-0d.
- §7: the 260-line budget.
- §8: the N7 stops.
- §9: both gates.

## What I could not settle
- That the tests compile and pass at the base. This rests on reading alone.
- Whether cargo releases its build-directory lock before the test binaries start. If it does not, two runs from one worktree cannot overlap at all.
- Whether `set_var` is safe on Windows: P-0c.
- How much `CARGO_TARGET_TMPDIR` space a worktree target has on D:.

## The packet's gaps
- The engine/ and kernel/ paths of `probe/port-2-case-policy-red` and `cut/revert-pr-320`.
- Measured build, suite and link times on this machine, needed to test the 60-minute budget.
- The current form of the shared-hold command.
- Whether any check pins the ignored lists, which T-A, T-B and the child half change.
- Whether every worker worktree has its own cargo target, which OPEN-2's per-target folder assumes.

Model: claude-opus-5-5 (Opus 5.5).
