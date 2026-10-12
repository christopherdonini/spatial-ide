*Custodian's filing note (2026-10-06): MP-1's phase B build (`geometry-types-beyond-polygons`, the form's §9 commits 4 to 6), worker report 2, by the worker-high on the custodian's brief after Amendment 2. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end as received, is 2087b7141b0978ba1a09bb66277a63c1977cb22e922dcfd78c8f060d265c2ab7. Write audit PASS: 40 Write or Edit calls, every one in the worktree `C:/dev/wt/mp1` or the session scratchpad, none in the main checkout or under the user's Claude folder. Tool calls Read 20, Bash 222, Edit 17, Write 23, SubagentHandback 1. Run window from the transcript: 2026-10-05T23:37:33.361Z to 2026-10-06T01:19:08.036Z (the harness's usage line: <subagent_tokens>532276</subagent_tokens><tool_uses>283</tool_uses><duration_ms>6094691</duration_ms>). Refusals in its run: 2026-10-05T23:49:44.890Z <tool_use_error>spatial-guardian G1: refused, because this git push force-pushes or deletes a remote (its first 100 characters) — resolved against the transcript: the refused call was a heredoc writing a shell test helper, not a git command, and its text held the JavaScript array call on `partRows` after open quotes; it did not run. Its three commits were published to the branch by the custodian (head 3c29bc67).*

---

# MP-1 — worker report 2 (phase B: commits 4 to 6)

Branch `cut/geometry-types-beyond-polygons`, worktree `C:/dev/wt/mp1`, three commits over `5c3a9e09`. Nothing was published, no PR, no rebase, pull, reset, clean or stash. Every cargo command used `CARGO_TARGET_DIR=D:/wt-targets/mp1`. Head: `3c29bc67f64634073373a28cd0ea24cc1280ed3e`. `git status --porcelain` is empty.

## Commits

- **4. Wire, `ac5384408b197ced65434d9507bc54519da4c7da`.** 28 files, one commit (§8 item 12).
  - W1: `GeometryInfo.declared_types: Option<Vec<String>>` after `encoding` (`null` for an absent key, `[]` kept); `encoding`'s doc names both values.
  - W2: `SKP_VERSION` is **`skp/0.9`**. The eight request fixtures and the three conformance fixture files are bumped; the future-version refusal fixture is renumbered `skp/0.9` to `skp/0.10` so it stays unsupported (the 83f04897 precedent). The three describe fixtures gain `declared_types` (`["Polygon"]`, `["polygon"]`, `["Polygon"]`). `fixtures.rs` (version test renamed, P-2's Rust side), the conformance README paragraph and AMBIGUITIES A9. TS side: `types.ts`, `fixtures.test.ts` (P-2's TS side), `client.test.ts`, `admitDataset.test.ts` and the hand-built describe literals in `App.test.ts`, `App.lateResult.test.tsx`, `AdmissionPanel.test.ts`.
  - W3: SKP-V0 §1's describe block updated in place; the `skp/0.9` entry is appended at §8's end, before §9.
  - K1's `declared_types` half: `describe_dataset` reads `Dataset::declared_geometry_types()`. K-1 now asserts F-1, F-3 (`[]` kept), F-4 (`None`) and a Polygon fixture.
- **5. Shell, `fc346a8a37360999bd9c9b5cdb9c42b1b8b97707`.** SH-A to SH-F, K-5, V-2 and the E2E step.
  - V-1 first: installed `@deck.gl/layers` is 9.3.9 (the lock). `solid-polygon-layer.js` encodes the datum index as the picking colour, and `polygon.js` `normalize` takes one datum as one polygon (ring 0 outer, the rest holes). P-4 holds, I-3 does not fire.
  - SH-A to SH-E: `parts`, `partToRow`, `partCount`; `UnexpectedEncodingError` (P6 placeholder); the `geometryEncoding` prop passed from `App.tsx` to both decode sites; `resolvePick` through `partToRow` with the first part's exterior vertex as anchor; both ceiling sites pass `partCount`; all readers migrated; `PICKING.md`.
  - SH-F: the Geometry `dt` is a P6 placeholder label naming the engine's encoding; a new declaration row has its own P6 `dt`, with distinct P6 texts for `[]` and `null`.
  - Tests SH-1 to SH-9, V-2 (new `partition-encoding.test.mjs`), K-5 (src-tauri `publish.rs`), E2E step `MP'` in `regression.mjs`.
- **6. Docs, `3c29bc67f64634073373a28cd0ea24cc1280ed3e`.**
  - KNOWN-LIMITATIONS items 31 to 34 (S-K1 to S-K4), each with a source comment, marked draft wording. S-K2 names both the empty-list and absent-key cases. Two class-3 fixes in that file: item 9's comment pinned at the v0.1.0 tag commit `b391e436` (lines read there, three hashes), and item 21's comment repointed by item.
  - Part S of `frontends/shell/MANUAL-WALKTHROUGH.md`, appended at its end, blank result log. S1 is Amendment 2 item 1's rewrite (corpus #12, the identity refusal naming `id`); S2 carries the F-1 hover.
  - P4 re-run: `admission_p4_corpus.rs` rows #11 and #12 and P1's literal; `ADMISSION-RESULTS.md` is the generator's own output.
  - S-3's own per-batch assertion; the clippy `needless_lifetimes` fix in `multipolygon_stream.rs`.

## The literal minted

`skp/0.9` (main is `skp/0.8`). The conformance fixture that named `skp/0.9` as an unsupported future version now names `skp/0.10`. `SKP-V0.md` §8 has the entry, at §8's end.

## Mutations: each applied, the named test run, the failure recorded in the test's comment, then reverted

A commit cannot name its own id, so each comment records the commit the uncommitted tree sat on. Every revert was checked byte-identical by hash. No `verify-mutation` run was used as an observation.

**Commit 4, observed over `5c3a9e09`:**
- P-2 Rust (`skip_serializing_if` on an empty list): `declared_types_keeps_a_populated_list_and_round_trips_empty_as_empty_and_absent_as_null` FAILED.
- P-2 TS (remove the `declared_types` line from the caller-asserted fixture): vitest `describe fixtures carry declared_types, and an empty list and an absent key stay distinct (skp/0.9)` FAILED. In the same run Rust `describe_response_with_a_caller_asserted_crs_round_trips`, `declared_types_keeps_a_populated_list_and_round_trips_empty_as_empty_and_absent_as_null` and `describe_fixtures_carry_projectable_on_every_schema_row` also failed.
- K-1 `declared_types` half (write `None` in `describe_dataset`): `skp::tests::the_real_describe_geometry_carries_the_engines_encoding_for_each_open` FAILED at F-1's `declared_types`.

**Commit 5, observed over `ac538440`:**
- SH-1 (walk the multipolygon one level short): `the engine's F-1 batch decodes to its parts, partToRow, partCount and totalVertices (SH-1)` FAILED.
- SH-2 (delete the encoding check): `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)` FAILED.
- SH-3 (read a part level under `geoarrow.polygon`): `the engine's polygon batch gives one part per feature (SH-3)` FAILED. The hand-built polygon decode test failed with it.
- SH-4 (index `ids` by the ordinal): `an ordinal on row 1's part resolves row 1's id, and two parts of row 0 resolve identically (SH-4)` FAILED.
- SH-5, `buildLayers` site (pass `ids.length`): `counts the pick ceiling in parts, not features, at this site (SH-5)` in `buildLayers.test.ts` FAILED. The updated ceiling test failed with it.
- SH-5, `ResidentSet` site: `counts the pick ceiling in parts, not features, at this site (SH-5)` in `residentSet.test.ts` FAILED.
- SH-6, `extentOfBatch` (part 0 only): `a feature with two distant parts has one extent spanning both (SH-6)` FAILED.
- SH-6, `averageFeatureExtent` (part 0 only): `a feature with two distant parts has one extent spanning both parts, counted once (SH-6)` FAILED.
- SH-7 trim (slice by feature count): `keeps features whole with all their parts, and partToRow, partCount and totalVertices agree` FAILED.
- SH-7 dedupe (`srcIdx` in `partToRow`): `drops a duplicate whole and carries every part of the kept features` FAILED.
- SH-8 (one datum per feature): `builds one datum per part with the style's fill, and an outline holding every ring of every part (SH-8)` FAILED.
- SH-9 (render `[]` and `null` alike): `an empty list and an absent key render distinctly, each as a labelled placeholder` FAILED.
- V-2 (delete the viewer's encoding check): `the engine's multipolygon batch, offered as a partition, is refused at the encoding check` FAILED.
- K-5 (move the check out of `preflight_pinless_parts` into the pinned `preflight`, after the pin): `a_multipolygon_encoded_dataset_reaches_prepare_refused_with_its_typed_code_before_any_pin_is_taken` FAILED at the no-pin assertion.
- E2E `MP'`: operator-run, no mutation, and not run by me (`node --check` only).

**Commit 6, observed over `fc346a8a`:** S-3's added per-batch assertion. The registered `estimate_bytes` mutation cannot fail it, because it reads the real encoding's bytes against the formula. A two-site mutation does: weaken `read_ring`'s refusal from fewer than 4 positions to fewer than 1, and make the test's `square` return one vertex. `every_multipolygon_batch_fits_its_target_under_the_unedited_estimate` FAILED at the new assertion ("batch 0: 65460 B of geometry exceed the estimate's geometry share of 56724 B (1091 rows, 2181 parts, 2618 rings, 2618 vertices)"). The target assertion is kept.

## The P4 re-run (commit 6)

- 17 rows opened, 0 unrun, **2 DEVIATION rows: #12 and M-4** (M-4 pre-existing).
- #11: admitted-as-declared, session-ordinal, sanity `none`, as predicted (C-11).
- #12: entered with C-12's registered prediction (admitted under the format rule, `crs:format-default`; boundary-8 publish component unrun, with its reason, as #3 and #8). The generator records the observed `engine.identity_unusable` (`id` is a `Utf8`) as a DEVIATION, citing the form's §3 C-12 and Amendment 2 item 1. The prediction is not edited.
- P1 literal is #2, #4, #5: "borne out".
- Other rows' outcomes are unchanged. Only the refusal text of #2, #4 and #5 changed, to the new `engine.geo_metadata` wording. The generator does not record #11's encoding or `declared_types`, so those are not observed by it. The conformance run and K-1/F-3 cover the encodings.

## Suites at head `3c29bc67`, exit codes

- `cargo test --workspace --locked --features spatial-engine/fixture`: **exit 0**, 869 passed, 0 failed, 43 ignored (summed over the log's `test result` lines). Phase A's 42 ignored plus one (below).
- `cargo fmt --all --check`: exit 0. `cargo fmt` over `frontends/shell/src-tauri` `--check`: exit 0.
- `cargo clippy --workspace --locked --all-targets --features spatial-engine/fixture`: **exit 0**. The tree was identical to commit 6's. 73 warning lines, all on lines I did not write; the `needless_lifetimes` warning is gone.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: exit 0, 66 and 2 passed (K-5 included).
- Shell: `npx tsc --noEmit` exit 0; `npx vitest run` exit 0, 73 files and 1113 tests. Without `npm run build` first, 6 tests in the notice files fail on a missing `dist-metafile.json`; they pass after the build, which `npm test`'s pretest does.
- Viewer `node --test "scripts/**/*.test.mjs"`: exit 0, 81 pass.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: exit 0, 444 pass.
- `verify.mjs` (verify-plan), `verify-cites`, `verify-quotes` (default mode), `verify-test-claims`, `queue.mjs --check`, `site.mjs --check`: each exit 0. Verify-cites reports 34 pre-existing loose-reference advisories. `verify-quotes --show-cites KNOWN-LIMITATIONS.md` reports 0 hash-reference errors, so the three `b391e436` pins recompute. `cfg-boundary.mjs`: 0 sites outside every boundary.
- G-1 and G-2 green at head (`the_polygon_only_wire_matches_the_golden_file`, `the_published_partitions_and_manifest_match_the_golden_file`). `git diff --quiet d8276158 HEAD` over both golden directories: rc 0. sha256 `d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d` (engine) and `5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01` (kernel), as in report 1.

## §7's figures

By §7's command at `3c29bc67`: `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- . ':!engine/MULTIPOLYGON-MP1-PREREGISTRATION.md' ':!engine/ADMISSION-RESULTS.md'`. The merge base is `ff6bdddc`. The index sections of `engine/README.md` and `kernel/README.md` are not yet applied, so the docs group lacks them.

| group | lines | files | ceiling |
|---|---|---|---|
| engine product | 1,190 | 8 | 1,200, within |
| engine tests (five new files, `lod_tier_builder`, `admission_p4_corpus`, golden, BF counted as files) | 1,258 | 10 | 1,150, **over by 108** |
| kernel, the listed files | 588 | 8 | 560, **over by 28** |
| kernel, with the 3 unlisted test files (`support/mod.rs`, `regenerate_fixture.rs`, `manual_walkthrough_fixtures.rs`) | 620 | 11 | 560 |
| protocol | 271 | 20 | 330, within |
| shell product (the 14 files, `types.ts` among them, plus `PICKING.md`) | 369 | 15 | 460, within |
| shell tests and seams (shell tests, two `testUtils` helpers, `regression.mjs`, `publish.rs`, the viewer test) | 858 | 20 | 820, **over by 38** |
| docs (`KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md`) | 62 | 2 | 130, within |
| **Total** | **4,628** | **86** | **4,500 lines, 80 files, over by 128 lines and 6 files** |

Class 8 (budget overrun, §7 not edited) is owed at the gated head, per Amendment 2 item 4.

## Deviations from the form

1. Commit 4 also edits AMBIGUITIES A9 (the 83f04897 precedent; inside `tests/conformance/**`), beyond W2's README paragraph.
2. K-1 gains a fourth case, F-4 (absent key, `None`), beyond Amendment 2's F-1, F-3 and Polygon.
3. The three describe fixtures all carry the Polygon encoding with populated lists. P-2's `[]` and `null` states are built in place from a fixture, with no new fixture files.
4. The E2E step needs F-1 on disk. I added the ignored generator `generate_the_multipolygon_f1_fixture` to `kernel/tests/manual_walkthrough_fixtures.rs`. That file is outside §7's kernel list, and the generator is one more ignored test than P-5 names. It was never run, so the F-1 file does not exist and `MP'` and Part S are unrun.
5. Two new shell test helpers, `testUtils/batchFixtures.ts` and `testUtils/partsOfPolygons.ts`, not named in §7.
6. S-3's new assertion has a two-site mutation (above), because the registered mutation cannot fail it.
7. P4 generator: the #3/#8 boundary-8 strings also name #12.
8. `PickCeilingExceeded`'s public field is renamed `featureCount` to `pickOrdinalCount`; there was no other user.
9. `protocol/skp/tests/conformance/DIVERGENCES.md` line 3 ("fixtures last run at `skp/0.8`") is left, because it is a run record with a commit id I cannot honestly write.
10. Held, not changed: the non-list `geometry_types` arm and A-4's lines (OPEN-2); `geoparquet.rs` and `geometry_admission.rs` are untouched in phase B. The index sections of `engine/README.md` and `kernel/README.md` are not edited.

## Git state touched, all rc 0

- `git add` of explicit paths (several).
- `git commit -s -F <file>` three times, producing `ac538440`, `fc346a8a`, `3c29bc67`.
- Read-only: `status`, `diff`, `log`, `rev-parse`, `merge-base`, `show`, `blame`, `tag`.
- Never run: checkout, reset, rebase, pull, push, clean, stash.
- Non-git effects: `npm ci` in `renderer/bundle-viewer` and `frontends/shell` of the worktree (gitignored `node_modules`), `npm run build` (gitignored outputs), and cargo output under `D:/wt-targets/mp1`.

## Process incident

I started `cargo test -p spatial-engine ...`, which begins a full feature-split rebuild (report 1's finding 3). I killed that tree by its own PID only (48772, with its descendants). No repo effect, and no process of mine survives.

## Pre-gate self-check

- **Cross-module code uses the interface the other side exposes: yes.**
  - `describe_dataset` calls the existing `Dataset::declared_geometry_types()`, which has that one product caller (`kernel/src/skp.rs`).
  - The shell reads `describe.geometry.encoding` and `declared_types`, and the engine's own committed batches (BF-1) in SH-1, SH-3, SH-4 and V-2.
  - K-5 goes through the shell's real `prepare_with_progress`.
- **Every completion claim has existing evidence: yes**, except the E2E `MP'` step and Part S, which are operator-run and unrun.
- **User-facing messages describe behaviour at this commit: yes.** Every new string is a P6 placeholder and states the shell's or format's own fact.
- **Required tests reach their intended assertion: yes**, each failed at its assertion under its mutation.
- **Model observed:** `claude-sonnet-5-5`. No override. No context handoff received or produced.

RESULT: phase B built and committed (wire `ac538440`, shell `fc346a8a`, docs `3c29bc67`); all suites green at head with exit 0; G-1 and G-2 green and both golden files byte-identical to `d8276158`; every new mutation observed by name. §7 is over its ceilings in four places (class 8 owed at the gated head). The P4 re-run's #12 deviation is recorded by the generator.
BLOCKER: none.
STOP: no §5 invalidator fired. OPEN-2 is untouched.
