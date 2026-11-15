*Custodian's filing note (2026-11-06): 8e (`skp-filter-dialect-unsupported-ruling`, the filler), built by a worker on `cut/skp-filter-dialect-unsupported-ruling` from main 8963de60, head 2aca6898, from its brief by path and sha256 (15552 bytes, sha256 e463a231dbc014f929f3c054a0a2423517775b52376ad9b6119230c03a56df40); its transcript runs from 2026-11-06T12:10:00Z to 14:19:14Z and holds both runs: the stop at the base on I-2 (its report filed at state/consults/2026-11-06-skp-filter-dialect-unsupported-ruling-worker-stop-1-report.md) and, after the form's Amendment 2, the build. Unique calls 131 in the transcript: the notification's 124 for the resumed run and 7 for the stop run. The custodian's check by git: origin's branch equals the head, and the diff from the base names nine files. A report, not Authority.*

Built: skp-filter-dialect-unsupported-ruling at 2aca68983bd53f1d65cc993810c130ca9c09f5f9 (pushed; origin's branch equals HEAD; porcelain empty). The nine-file diff is 180 lines against the declared 150, class 6 as the brief says, not trimmed. One `cargo test --workspace --locked` run at the head failed on the shared-fixture test described below; its `--no-fail-fast` rerun passed.

**The stop.** Base check 2 hit `governance/CUSTODIAN-QUEUE.json:65` and `site/data/plan.json:10917` (this node's title text) and I stopped. The custodian ruled I-2 does not trip for those two hits (recorded as the form's Amendment 2), and I continued from step 2. No other new hit appeared at any later step.

**Start state.**
- HEAD equal to 8963de604017282124a7caa30f54550583882836, porcelain empty.
- `.cargo/config.toml` sha256 equals 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f.
- D: free 193 GiB.

**Base checks (all rc 0).**
- `git grep -n DialectUnsupported -- '*.rs'` had 6 hits: predicate.rs:263 and :338, the two test arms, and kernel/src/skp.rs:2290 and :2806. No product constructor.
- Case-insensitive grep `filter_dialect_unsupported`: 8 hits. Besides engine/kernel and commands.rs:376, the only others were the two excepted JSON files.
- `skp/0.12` is at protocol/skp/src/v0/mod.rs:115 and frontends/shell/src/skp/types.ts:15.
- Both greps self-tested positive.

**Commits.**
1. 02054337 T1 (test only).
2. 6444682c the removal.
3. 1ff549a3 comments.
4. 2aca6898 the script's notes.
- Each was signed off with `git commit -s -F`. Each message file had `@` only on the first trailer line.

**T1.**
- It is `a_wrong_dialect_fails_at_decode_in_viewport_query_and_record_step_with_filter_news_message` in `protocol/skp/src/v0/commands.rs` `mod tests`. Its body is in the diff; I did not byte-copy it here.
- `cargo test -p spatial-skp --locked` at the base code passed: lib 31 passed, 0 failed, and T1 `... ok`.
- At the head, T1 passes in the workspace run.
- **R1: no deviation.** The adjacently tagged `StepIntent` carries `Filter::new`'s message through, so R1 asserts the message, as predicted.
- `cargo fmt` reformatted T1 after the base run. That was formatting only, so I did not rerun the base-code test.

**Removal counts.**
- `cargo test --workspace -- --list` at the base code (commit 1) lists 1078 tests.
- The commit 2 workspace run shows 1013 passed, 0 failed, 64 ignored, which is 1077 tests.
- `comm` of the name lists shows one missing test, `skp::tests::filter_dialect_unsupported_maps_to_its_code_and_field`.
- Other differences were only the `- should panic` suffix of listing format.

**Mutations.** Each ran alone on commit 6444682c in a debug build with `cargo test -p spatial-skp --locked --no-fail-fast`, and each was reverted. After each revert `commands.rs` sha256 was eea97c1aa3a158666e83bc8b80172506202e4efa220ee77fc36cfcde0dec4e95, equal to commit 2's.
- **M-1** (Deserialize maps the Err to a fixed message):
  - Failing lines: `test v0::commands::tests::a_wrong_dialect_fails_at_decode_in_viewport_query_and_record_step_with_filter_news_message ... FAILED`; `protocol\skp\src\v0\commands.rs:921:9:` with `V1: unsupported filter dialect`.
  - Result line: `test result: FAILED. 30 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s`.
  - Only T1 failed, at V1's message assertion.
- **M-2** (`Filter::new`'s Err message emptied):
  - Failing lines: the same test `... FAILED`; panicked at `protocol\skp\src\v0\commands.rs:898:9:`, which is check (iii)'s first assertion.
  - Result line: the same, `30 passed; 1 failed`.
  - Only T1 failed.
- A first M-1 run without `--no-fail-fast` stopped at the lib failure, so I reran with `--no-fail-fast`; the lines above are from that rerun.
- T1's doc carries both `RECORDED MUTATION:` lines, with commit 6444682c51783c02102fad3f33bf007483e592df.

**Comments, each written from the code at commit 2.**
- `admit` doc:
  - FilterError has eleven variants.
  - `admit` can return each: I checked every one is constructed in predicate.rs (Unparsable:495, NotASingleExpression:590, ConstructNotAdmitted:530, UnknownColumn:1212, ColumnNotFilterable:1198, IdentityAliasAmbiguous:1191, NotBoolean:1314, TooLong:123, TooDeep:932, RejectedByBinder:134, TypeNotAdmitted:1396; those are pre-edit line numbers).
  - Lease exhaustion is the sibling variant `PredicateAdmitError::ConnectionsExhausted`.
  - No ADR claim.
- `FilterError` doc:
  - Eleven variants, matching SKP-V0 §7.5's ten table rows plus the `skp.filter_type_not_admitted` row of its `skp/0.8` note. This is true after the script, and the §7.5 heading already says eleven.
  - It names the struck code's note of 2026-11-05, `filter_error_of`'s by-name mapping, and the no-wildcard discipline.
  - **NEXT-CUT.md decision: clause removed.** `state/NEXT-CUT.md` at the base has no "design essential 5" about `skp.filter_*`; its item 5 is "Footer work is bounded and accounted". I also replaced the same stale cite in `filter_error_of`'s doc and in the test-block header comment.
- `PredicateAdmitError` doc and its `Filter` variant doc: eleven; the history sentence reads "`FilterError` had twelve variants until the dialect variant was removed".
- kernel/src/skp.rs:
  - The count comment near line 1453 now says "the eleven typed" codes, and the comment near 1456 says "those eleven".
  - `filter_error_of`'s doc says "a twelfth variant".
  - The test-block comment says "eleven variants". I counted 11 `filter_*_maps_to_its_code*` tests.
  - The `predicate_admit_error_of` doc no longer says ADR-021 item 8's list is untouched. It says the function mints no code the two sides don't already mint, and cites item 8 only for no-wildcard.
  - The comment near line 2954 now says "eleven-code route" with the ADR cite dropped.
- `FILTER_DIALECT_DUCKDB_EXPR_0` doc:
  - It states the one admitted value.
  - It states refusal at construction and, through the same constructor, at deserialization, as a serde error before any host code runs.
  - It states that no `skp.filter_*` code is produced, pointing to §7.5's note of 2026-11-05.
  - The "later phase" claim is gone.
  - The first sentence, with its "skp/0.1" wording, is unchanged.

**The script.** `sfdu-notes.mjs` sha256 21a8bdc949ef90465e6b69abc55f85a08d7fd65eb9e1ae450a34b8c3cee4233a. The dry run printed `DRY RUN` and the four after-hashes; after `write` the files carry them:
- SKP-V0.md a6f5b221c5994e232e7ae3d2a4ff748679f4c45bc22c48fe5b8fe4a162558efb
- ADR-021 43e0afc7fde5b398fc154792aca2e1cd90e1dcbda53f91aa9f9d6cc0504f0f2c
- ADR-033 1cf9adb66e6d103e01cd3dea9354ba55a80530814f77d8ca469d9a210c31e794
- docs/02 cd2c29dacd755d5d7e93739e365e658b010a6384eb1e19d8cbcdd087074f693d

Span check: `grep -cxF` of the note line (SKP-V0.md line 523) prints 1, and 0 with an `x` appended. The exact-match grep for the deleted row prints 0, against 1 at the base.

**CI on head 2aca6898.** All five runs succeeded:
- 42224447045 Product CI — shell
- 42224444330 Ported notices
- 42224444354 Rust fmt
- 42224444353 Governance CI — plan, queue, site
- 42224444351 Product CI — Rust workspace

Both L1 jobs, windows-latest and ubuntu-24.04, were `success`.

**Checks at the head.**
- `cargo fmt --all -- --check`: rc 0.
- `verify.mjs --offline`, `verify-cites`, `verify-test-claims`: PASS, rc 0.
- `verify-quotes`: PASS, rc 0.
- `node --test` scripts suite: rc 0, 598 pass, 0 fail.
- `cargo test --workspace --locked`: one run failed. `tier_build_emits_zero_invalid_polygons` in `engine/tests/lod_tier_builder.rs:309` died with `open for geometry: ... NotFound` for the shared absolute fixture path under the main checkout's `target/fixtures`. I never touch that path and the test is unrelated to this piece. That test took 603 s in a shared run, so I am not recording it as a failure, per the machine rule; the custodian should re-run it alone. The rerun with `--no-fail-fast` passed: 1013 passed, 0 failed, 64 ignored, the same counts as at commit 2.
- `git diff --name-only 8963de60...HEAD` shows exactly the nine Scope files.
- Numstat: 113 insertions + 67 deletions = **180 lines against the declared 150, a class 6 overrun, not fixed by trimming.** By file: commands.rs 61/3, predicate.rs 23/30, skp.rs 14/30, ADR-021 6/0, ADR-033 6/0, SKP-V0.md 2/1, docs/02 1/1, the two engine test files 0/1 each.

**Deviations.** The I-2 stop and ruling above; nothing else. No stop rule was met.

**Off-scope noticed, not done.**
- `Filter`'s doc ("the single dialect `skp/0.1`") is left for the drift sweep, as the form says.
- The docs of `code_of` and `campaign_code_of` still say "ADR-021 item 8"; the form leaves them unchanged.

**Hold lines (SpatialIDE only).** Shared holds were granted and released for every cargo run. Two were released with exit 0, and none returned 96 to 99.

**Background shells.** All my wait loops and cargo jobs completed. No process of mine is left running; I killed nothing.

**Model.** Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

**Pre-gate self-check.**
- Cross-module seams: read `Filter::new`, `Filter`'s Deserialize and `StepIntent` in protocol/skp/src/v0/commands.rs, and `filter_error_of` in kernel/src/skp.rs. T1 starts from the real producer shape.
- Completion claims: each claim above rests on a log or run.
- Messages: no user-facing message was changed except removing the never-shown Display arm.
- Required tests: T1 reaches its V1 and (iii) assertions, as the mutations show.
