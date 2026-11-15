*Custodian's filing note (2026-11-06): U1 phase 1 (`publish-session-tier-identity`, slot 1 ahead of order, export-refused-above-row-ceiling-every-scope riding), built by a worker-high on `cut/publish-session-tier-identity` from main 9a4546ba, head 8f1c768e, from its brief by path and sha256 (eb2755ca); phase 2, the shell's publish.rs, waits for U12's merge, and both gates go after it (the form's OPEN-3 (A)). The custodian's check by git: four commits on 9a4546ba, each signed off; the eight Scope files of phase 1 and 861 changed lines (825/36), publish.rs untouched; origin's branch equal to the head; CI at the head success (Product CI — Rust workspace 42157144429, Product CI — shell 42157144503, Governance CI 42157144443, Rust fmt 42157144439, Ported notices 42157144423). The run 2026-11-06T00:20:07.662Z to 2026-11-06T03:51:28.930Z by its transcript (claude-sonnet-5-5, the worker-high definition's model; unique calls Bash 222, Edit 24, Read 15, Write 10 and the hand-back, 272, equal to the notification's); one push of its branch, its mutations reverted by `git checkout --` of the mutated file with the sha256 shown, and no reset, rebase, amend, force, PR action or claude command. Its size against section 7's 700 is class 8, for the closing amendment; its clippy `-D warnings` failures are on lines already on main (the ledger's clippy item); its shared-run LOD and tier failures at commit 2 fit the machine-wide tier directory (the ledger, 2026-11-06). KNOWN-LIMITATIONS items 5 and 6's sentences are the human's at the click. Extracted by script from its hand-back, unchanged. A report, not Authority.*

---

Built: publish-session-tier-identity phase 1 at 8f1c768ebb9be46fd4b3af26635a5cc4dec7a740

Phase 1 is built and pushed. CI is green at the head and the full workspace suite passes. Size is 861 lines against section 7's 700, reported as an overrun and not trimmed. Clippy `-D warnings` fails on lines already on the base, so I ran it with eight lints allowed (details below). The sentences in KNOWN-LIMITATIONS items 5 and 6 are the human's to approve at the click.

Branch cut/publish-session-tier-identity. origin == HEAD, porcelain empty, base 9a4546bacd37165498ce3f493cb504926618ca40. The brief's sha256 matched eb2755ca… at the start. My model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).

## Commits (each `-s`, the Co-Authored-By and Claude-Session trailers; `@` only on the first trailer line)
1. 8f096353b3c06d650d10f8c15baca62fd4689b4a  test: publish-session-tier-identity K-U1 alone, a session-tier dataset refused before the pin and at the boun… (subject truncated here; full text in git)
2. ad2b5279b8812530d417a7c4fdfe9463a486055c  feat: publish-session-tier-identity refuses a session-tier dataset at preflight, states each tier's check in the caveat, and reads the reader's MAX_FEATURES ceiling against a scope's own rows
3. 435be20a3b54a4a9580def1960c6f1d13070c9c0  test: publish-session-tier-identity K-CAV, U-PRED, U-GUARD, K-U10a and K-U10b
4. 8f1c768ebb9be46fd4b3af26635a5cc4dec7a740  docs: publish-session-tier-identity's sentences about behaviour, written from the built code, and the mutations observed

## P-0 (no stop, no FX-D fallback; throwaway test, release, base 9a4546ba)
- DuckDB v1.5.5.
- FX-S: source=session-ordinal:file_row_number, uniqueness=by-construction-within-generation, verified_rows=None, is_session_ordinal=true.
- FX-V: source=file:id, uniqueness=verified-at-open-full-file, verified_rows=Some(50), is_session_ordinal=false.
- FX-D: source=mapped:id, uniqueness=declared-not-verified, verified_rows=None, is_session_ordinal=false.
- FX-BIG: 2000001 features, 158621286 bytes, source=file:id, verified, verified_rows=Some(2000001).
- R6 bbox: xmin=2600000 ymin=1200000 xmax=2604000 ymax=1202000. expected_n=5000, counted_n=5000.
- R6 at the base: `Err code=publish.reader_ceiling_exceeded debug=ReaderCeilingExceeded { ceiling: "MAX_FEATURES", limit: 2000000, predicted: 2000001, …`

## K-U1 on the unfixed code (commit 1, run before any fix)
`thread 'a_session_tier_dataset_is_refused_before_the_pin_and_at_the_boundary_in_both_scopes' panicked at kernel\tests\publish_identity_tier.rs:261:23: R1 current-view: preflight_pinless admitted a session-tier dataset`. Result: `FAILED. 0 passed; 1 failed`. It passes at commit 2.

## The code (commit 2, as at the head)
- Session check in `preflight_pinless_parts`, after the geometry-encoding check and before `dataset_logical_uri`:
```
    if ds.identity().source().is_session_ordinal() {
        return Err(PublishError::SessionIdentityNotPublishable);
    }
```
- Variant `PublishError::SessionIdentityNotPublishable`, code `publish.session_identity_not_publishable`. Display:
```
"[P6 placeholder] refused: this dataset's features are identified by their position in the file, for this open only, and a published bundle carries its feature ids beyond this open"
```
- The code, `error_kind` and `publish_outcome` (Refused) arms are in boundary.rs. The boundary module-doc list gains the variant.
- `fn identity_caveat(uniqueness: IdUniqueness) -> String`, called as `identity_caveat(identity.uniqueness())` in `build_manifest`.
- `ceilings::predicted_features(verified_rows: Option<u64>, query: &ViewportQuery) -> Option<u64>`: None for a bbox query, otherwise the verified count capped by the limit.
  - Called in `preflight_pinless_parts` as `ceilings::predicted_features(ds.identity().verified_rows(), &req.query)`, inside `check_reader_ceilings(...)`.
- `ceilings::check_streamed_features(rows_written, batch_rows, &ReaderCeilings)`: refuses when the total is `> max_features`, with `CeilingExceeded { ceiling: "MAX_FEATURES", limit, saw }`.
  - Called in `run_inner`'s partition loop after the `MAX_PUBLISH_PARTITIONS` check and before `write_partition`: `ceilings::check_streamed_features(rows_total, info.rows as u64, &reader_ceilings)?;`. `reader_ceilings` is read once before the loop.
- The verified tier's caveat bytes are unchanged. A script compared the base literal with the K-CAV constant and with the head's function output: all equal. The base and test literal sha256 is ecc14d34…bbc1, 272 bytes with quotes. The head's verified-tier output is equal to the base's.
- K-CAV also asserts that the `DeclaredNotVerified` caveat (FX-D) claims no verification.

## Sentences written in commit 4 (each from the code above; the gates check them clause by clause)
- Place 1: `SessionIdentityNotPublishable`'s doc in error.rs.
  - It says the ids are row positions meaningful only within the minting open (ADR-016 Amendment 1, item 1).
  - It says the variant is raised in `preflight_pinless_parts` right after the geometry-encoding check and before the dataset name, from the identity record alone, for both scopes.
  - It says the no-audit-record shape is the one `permission::boundary`'s module doc describes.
  - The Display does not advise declaring an identity column.
- Place 2: `ReaderCeilingExceeded`'s doc in error.rs. It was edited in the first part of commit 4 and the pre-existing sentence on `CeilingExceeded` is the one it distinguishes from.
- Place 3: the residual paragraph in `check_reader_ceilings`'s doc in ceilings.rs, plus new docs on `predicted_features` and `check_streamed_features`.
  - The residual was rewritten for the scope's prediction and the write-time check.
  - A `None` prediction is not a pass: the ceiling is enforced at write time and the refusal is `CeilingExceeded`.
  - The `>` comparison matches the viewer's.
- Place 4: mod.rs.
  - The module-doc order of operations (steps 1 and 4).
  - `preflight_pinless`'s "one case" doc is now "two cases": `DeclaredNotVerified`, and a bbox scope.
  - The ceiling comment gains the scope's prediction paragraph.
  - New comments on the session check, the guard and `identity_caveat`.
- Place 5: boundary.rs module doc. The list of preflight refusals with no audit record gains the new variant, "fourth in `preflight_pinless_parts`".
- Place 6: engine/src/identity.rs, the doc of `is_session_ordinal` only. It now names the publish preflight as a third asking site. This is the only engine line changed.
- Place 8: KNOWN-LIMITATIONS items 5 and 6. THE HUMAN'S TO APPROVE AT THE CLICK. Each changed sentence:
  - Item 5, heading: "...and a whole-file publish above one of them is refused before anything is written."
  - Item 5, body: "A whole-file publish of a source predicted above `MAX_FEATURES` is refused at preflight:" (the quoted refusal is unchanged).
  - Item 5, new final sentence: "A Current view publish is not predicted from the whole file: it is refused only if its own rows exceed `MAX_FEATURES`, and that refusal comes while the rows are being written, after the approval, with nothing left at the destination."
  - Item 6, new sentence: "For a Current view publish, `MAX_FEATURES` is likewise enforced only as the rows are written (see item 5)."
  - Both source comments carry "revised 2026-11-06 by publish-session-tier-identity". Two cites were updated from stale lines: error.rs:253-259 became :450-456, and ceilings.rs:109-116 became :108-115.
- Place 9: kernel/README.md, the form added to the preregistrations list line.
- Place 10: a `RECORDED MUTATION:` line on each new test. They name 435be20a3b54a4a9580def1960c6f1d13070c9c0 as the observation commit.
- The shell's place 7 is phase 2 and untouched.

## Mutations (each alone, on commit 3, in a shared hold; reverted with the file's sha256 shown equal to commit 3's)
Reference hashes at commit 3: mod.rs c47267cc…62ce, ceilings.rs 1a87558e…f877.
- M-1, the session check removed.
  - The test `a_session_tier_dataset_is_refused_before_the_pin_and_at_the_boundary_in_both_scopes` failed. The panic was at `kernel\tests\publish_identity_tier.rs:262:23`: `R1 current-view: preflight_pinless admitted a session-tier dataset`.
  - Result: `1 passed; 1 failed; 2 ignored`.
- M-3, the caveat is the verified text for every tier.
  - `the_manifest_caveat_claims_a_verification_only_for_the_tier_that_had_one` failed at `publish_identity_tier.rs:376:5`: `R5: the caveat claims a verification that never ran: uniqueness was verified over this file at open. …`.
- M-4, the bbox early return removed from `predicted_features`.
  - `publish::ceilings::tests::a_bbox_scope_predicts_nothing_over_a_verified_file` failed at `ceilings.rs:303:9`: `left: Some(3300000)`, `right: None`.
  - Result: `11 passed; 1 failed`.
- M-5, `>` became `>=` in `check_streamed_features`.
  - `publish::ceilings::tests::a_batch_that_brings_the_total_to_the_ceiling_is_not_refused` failed at `ceilings.rs:334:9`: `assertion failed: check_streamed_features(0, c.max_features, &c).is_ok()`.
  - Result: `11 passed; 1 failed`.
- M-6, `verified_rows()` passed for every scope, in release with `--ignored --exact`.
  - `a_current_view_publish_over_a_verified_file_above_the_ceiling_publishes_its_own_rows` failed at `publish_identity_tier.rs:475:31`: `R6: a bbox scope is not predicted from the whole file: ReaderCeilingExceeded { ceiling: "MAX_FEATURES", limit: 2000000, predicted: 2000001, alternative: "publish the current-viewport bbox instead of the whole file (…)" }`.
- M-7, the guard call removed from `run_inner`, in release with `--ignored --exact`.
  - `an_unverified_file_above_the_ceiling_is_refused_by_the_write_time_guard_and_leaves_nothing` failed at `publish_identity_tier.rs:537:18`: `R8: expected CeilingExceeded for MAX_FEATURES, got Ok(PublishOutcome { …partitions: 245, rows: 2000001, … })`.
- Every failure is where the form predicted. M-2 is phase 2's.

## The ignored tests (commit 3, release, `--ignored`)
- K-U10a and K-U10b: `2 passed; 0 failed; 2 filtered out; finished in 30.65s` (a second dry run: 28.76s).
- The existing ignored tests also ran:
  - `an_adr_025_reader_ceiling_refusal_at_preflight_produces_no_audit_record` (`permission_boundary`): `ok`, 1 passed.
  - `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_before_any_hash_is_taken` and `…_refuses_at_preflight_before_any_write` (`publish.rs`): `ok`, 2 passed.
- D: free before and after each FX-BIG run was 183.8 GiB and 183.6 GiB (M-6), then 183.6 GiB and 183.3 GiB (M-7). The floor is 40 GiB.

## CI (pushed head 8f1c768e)
- Product CI — Rust workspace, run 42157144429: success.
  - Job "L1 portable correctness · cargo test --workspace (ubuntu-24.04)": success.
  - Job "cargo test --workspace (windows-latest)": success.
- Product CI — shell 42157144503: success.
- Governance CI — plan, queue, site 42157144443: success.
- Rust fmt 42157144439: success.
- Ported notices 42157144423: success.

## Checks at the head (the tree is unchanged since commit 4)
- `cargo test --workspace --locked --no-fail-fast`: exit 0, in a shared hold. 33 test binaries reported; none failed, no `FAILED` line. This includes the engine LOD and tier tests, which pass at the head.
- `cargo clippy --workspace --locked --tests --no-deps -- -D warnings`: exit 101. This is not from my change.
  - `renderer/src/canonical.rs:240` (`manual_range_contains`) and `renderer/src/style.rs:10` (`doc_lazy_continuation`).
  - `engine/src/rowgroup.rs:331` and `engine/src/stream.rs:2462` (`too_many_arguments`).
  - `engine/src/stream.rs:2346` (`if_same_then_else`).
  - Further engine lib and test lints.
  - Kernel lines I did not write: `kernel/src/lib.rs:414` and `:489`, `kernel/src/skp.rs:277` (`type_complexity`), `kernel/src/permission/boundary.rs:536` (`ptr_arg`), and `kernel/src/publish/mod.rs:839` (`needless_borrow` on `&watch`, a pre-existing line).
  - I re-ran with `--keep-going` and `-A` for those eight lints (`manual_range_contains`, `doc_lazy_continuation`, `too_many_arguments`, `if_same_then_else`, `type_complexity`, `explicit_auto_deref`, `ptr_arg`, `needless_borrow`), for the new test target `publish_identity_tier`: exit 0. The earlier `--tests --keep-going` run linted the kernel lib and lib test targets whole, and none of its errors were on my lines.
  - The custodian should treat main's clippy state as the "see the ledger" item.
- `cargo fmt --all -- --check`: exit 0.
- `node scripts/plan/verify.mjs --offline`: exit 0, PASS.
- `verify-cites.mjs`: exit 0, PASS (2663 files).
- `verify-quotes.mjs`: PASS, exit 0, on the second run (138 checked, 107 verified). The first run hit my 280 s timeout (rc=124), so I re-ran it with 1500 s.
- `verify-test-claims.mjs`: exit 0, PASS (738 claimed tests).

## Size
`git diff --numstat origin/main...HEAD` over the form's Scope paths is 825 insertions and 36 deletions, total 861 lines against section 7's 700. That is an overrun and I did not trim.
- Per file (insertions/deletions): publish_identity_tier.rs 574/0, ceilings.rs 146/5, mod.rs 66/20, error.rs 18/0, KNOWN-LIMITATIONS.md 12/8, boundary.rs 5/0, identity.rs 3/2, kernel/README.md 1/1.
- No file outside the Scope was touched, and `frontends/shell/src-tauri/src/publish.rs` was not.

## Disclosures
- **LOD and tier test failures in shared runs at commit 2.** The workspace test at commit 2 failed in the engine LOD and tier tests, and they passed when run alone.
  - Run `psti-ws2` failed `a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size` and `tier_is_not_served_when_source_content_hash_changes`, with the test binary taking 1040 s. That run ended about 01:43Z, before your 02:03Z–02:40Z window.
  - Run `psti-ws2b` failed `tier_build_emits_zero_invalid_polygons` and `cancel_observed_within_the_declared_ceiling`. It ended about 02:24Z, inside your window, so it matches the interference you described (a shared tier directory cleared by another run).
  - The ws2 failures predate the window and I could not explain them, but timing under contention is the likely cause.
  - I re-ran the LOD tests alone (2 passed), and the full suite at the head passes, so I did not treat any of this as a regression.
  - Per the brief, nothing timing-sensitive is recorded as a failure.
- **Brief wording.** The brief says clippy and fmt "at the head" with the exact command, and I reported the deviation above.
- **Commit 1.** The test file is 574 lines at the head (K-U1 plus the commit-3 tests), against the form's estimate.
- **Hold lines (my own project's only, `also=` elided).** All holds were `hold shared -Project SpatialIDE`, each granted (no exit codes 96 to 99), and released.
  - `publish-session-tier-identity: M-1 mutation run`
  - `publish-session-tier-identity: M-3 mutation run`
  - `publish-session-tier-identity: M-4 mutation run`
  - `publish-session-tier-identity: M-5 mutation run`
  - `publish-session-tier-identity: M-6 mutation run, K-U10a in release`
  - `publish-session-tier-identity: M-7 mutation run, K-U10b in release`
  - `publish-session-tier-identity: workspace tests at commit 4 tree`
  - `publish-session-tier-identity: clippy at the head` and `clippy keep-going at the head`
  - `publish-session-tier-identity: clippy with four lints allowed at the head`
  - `publish-session-tier-identity: clippy of the new test target at the head`
- **Background shells.** None left running. All my backgrounded wait loops and the verify-quotes run completed on their own before this report. I started no process that is still alive.

Files (absolute): C:/dev/wt/psti/kernel/tests/publish_identity_tier.rs, C:/dev/wt/psti/kernel/src/publish/{mod.rs,ceilings.rs,error.rs}, C:/dev/wt/psti/kernel/src/permission/boundary.rs, C:/dev/wt/psti/engine/src/identity.rs, C:/dev/wt/psti/KNOWN-LIMITATIONS.md, C:/dev/wt/psti/kernel/README.md.
