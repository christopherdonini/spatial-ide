*Custodian's filing note (2026-10-08): `b2-piece-1a-step-record-and-dataset-reference`'s stage 1 worker report, at the branch head 1e637d55 (worker-high run from 04:16:30Z, report at 04:41:19Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256 as written, from this file's line 5 to the end, is d6c7419f81c5f17b20a20a27588421966560ab62b087343d3d0eca6ba0379ee2. One disclosed rewrite: on the lock section's last line, two directory:line tokens are de-rooted to the directory, its Cargo.toml and the line, so that verify-cites does not read them as rooted cites. Paths and lines below are at the branch head, not main, except the pins it re-derived, which it names at aa00e565 and c01f2e09.*

---

STAGE 1 REPORT, piece 1a (node b2-piece-1a-step-record-and-dataset-reference). Branch cut/b2-piece-1a-step-record-and-dataset-reference at 1e637d55 in C:/dev/wt/1a, pushed (ordinary updates, never forced). Base c01f2e09. No cargo build, check, clippy or test was run. Nothing is compiled; the code is written against the interfaces I read.

AMENDMENT 2 (ab0469f4, read via git show, main not merged) was applied. Everything it asks is done and committed.

## Commits (all signed off)
1. 66f7bc26 docs: ADR-036 (Proposed) - the project folder, the step record and the lasting dataset reference (ADR + docs/README.md via adrIndex.mjs)
2. 85fc25f8 feat: SourceObservation ... (piece 1a, E-1) (engine/src/descriptor.rs, engine/tests/source_observation.rs: O1-O4)
3. f727dd6d feat: the lasting dataset reference, kernel::dataset_ref (piece 1a, K-1 and K-2) (kernel/src/dataset_ref.rs, kernel/src/lib.rs, kernel/tests/dataset_ref.rs: K1-K5, kernel/tests/no_generation_in_persisted_artifacts.rs: G1 + header family)
4. 98adfe3c docs: the engine and kernel owner's indexes (engine/README.md, kernel/README.md only; PLAN.yaml untouched)
5. 2bd318b4 docs: ADR-036 under Amendment 2 (the four OPEN blocks I had written are removed; ruled text applied)
6. 1e637d55 feat: DatasetUri::mint and the project-relative grammar (Amendment 2 items 3-4: mint, R4 clause, R7, kernel/Cargo.toml, Cargo.lock)

## ADR equality check (script, anchor check per change)
- After commit 1 (Amendment 1 only, with the 4 OPEN blocks): file minus the OPEN-2/3/5/7 blocks == section 2.3 as amended by Amendment 1: true. OPEN blocks sat at: OPEN-2, OPEN-3 and OPEN-5 after the last bullet of section 4; OPEN-7 after the "Locators are built..." paragraph in section 5.
- At head (commit 5): file == section 2.3 as amended by Amendments 1 AND 2, byte for byte: true (raw 2.3 = 12284 bytes, amended = file = 14091). The nine fenced ADR-text blocks were extracted by script from the form (as of ab0469f4); anchors: section 4 last bullet, section 9 "After a crash" bullet, section 5 project-relative bullet, Consequences absolute-path bullet's second sentence, plus the four Amendment 1 anchors. Section 2.3's marked text is identical in the branch's form and in ab0469f4. The only "**OPEN" line left is Amendment 1 item 1 (c)'s (project file name and extension). No OPEN-2/3/5/7 text remains. Status line is "Proposed. It binds nothing...". `adrIndex.mjs --check` PASS.

## LOCK DIFF (for the PR body), byte for byte, `git diff c01f2e09 HEAD -- Cargo.lock`
```
--- a/Cargo.lock
+++ b/Cargo.lock
@@ -1903,6 +1903,7 @@ version = "0.0.0"
 dependencies = [
  "arrow",
  "futures-util",
+ "getrandom 0.3.4",
  "serde_json",
  "spatial-data-plane",
  "spatial-engine",
```
Exactly one added line; no other lock change. kernel/Cargo.toml gains `getrandom = "0.3"` (the requirement protocol/skp (Cargo.toml, line 15) and protocol/data-plane (Cargo.toml, line 17) carry). Produced with `cargo metadata --format-version 1 --offline` (rc 0). protocol/ diff is empty.

## Section 7 count (the form's command, base c01f2e09, head 1e637d55), insertions+deletions
- engine product: descriptor.rs 154 (ceiling 180)
- engine tests: source_observation.rs 233 (240)
- kernel product: dataset_ref.rs 810 + lib.rs 1 + Cargo.toml 3 = 814 (ceiling 760). OVERRUN of 54, class 8 (see deviations). Before Amendment 2 it was 758.
- kernel tests: tests/dataset_ref.rs 403 + no_generation... 115 = 518 (520)
- ADR: 174 (280)
- indexes: engine/README 6 + kernel/README 11 = 17 (30)
- TOTAL 1910 (2010), 10 files (10), Cargo.lock excluded by the command.

## Light checks (exit codes)
- cargo fmt --all -- --check: 0 (at head)
- node scripts/plan/verify-cites.mjs: 0 (PASS, 34 pre-existing loose advisories)
- adrIndex.mjs --check (verify:adr-index): 0
- ADR equality script: 0
- K5 token self-check on the module source (grep): clean.

## Re-derivation of consumed interfaces at base c01f2e09
Every pinned span in the form re-hashed at both aa00e565 and c01f2e09 and ALL MATCH the form's sha256 (OpenDatasetRequest commands.rs:20-38; descriptor.rs:58-83, 269-288, 97-102; dataset.rs:603-606, 658-671; crs.rs:229-243, 114-123; identity.rs:33-41). The lines cut's change to commands.rs is a doc comment at ~166, outside the struct. No invalidator I2. Two notes: identity.rs:33-41 pins the IdSource enum; the `DatasetIdentity::source()` accessor itself is at identity.rs:259. Consumed: Dataset::descriptor(), crs().source()/identifier()/definition_json(), identity().source() matched as IdSource::Mapped{column,..}, wire CrsAssertion {identifier, definition_json} and IdentityDeclaration {column}.

## Deviations from the form (with amendment class)
- Class 8: the kernel-product overrun (814 vs 760): Amendment 2's mint (~12), R7 (~28) and grammar check (~12) were not budgeted. The form's section 7 is not edited.
- Class 3 (test text): K5 strips the quoted literal "content_hash" before scanning, because the writer must spell that ResourceRef member and the form's scan lists `content_hash`; a planted unquoted token and the quoted-only case are controls. Also, to keep the "File" token clean the module matches `IdSource::Mapped{..}` with `_ => None` (no `IdSource::File`) and R6 uses `CrsSource::FormatRule`.
- Class 3: F3 (K4) declares a mapping onto the native `id` column, because the fixture writer has no "native id plus a second unique int64 column" mode.
- Class 3: K1 checks member order by text positions plus key-set equality via serde_json (no ordered parser in tree).
- R6 is a unit test of the private `claim_of`; an engine open refuses an assertion with no definition (AxisOrderUnestablished), so the case is unreachable via a real Dataset.
- O4 cannot build the both-sides-no-mtime case from an integration test; the existing descriptor.rs unit tests cover it through the shared function.
- Error Display impls are the Debug form (macro); no operator-facing text.
- parse() takes a serde_json::Value, so a duplicate key is already collapsed; documented in the module header (1c's file reader must refuse it). byte_size/footer_length above 2^53-1 are refused at parse; basis texts of named states are accepted only if exactly the fixed constants; `at` of a project-relative locator is otherwise opaque (only Amendment 2's grammar).
- Index "Last verified at" is f727dd6d (before the Amendment 2 commits); the pointers are all still valid at head. Refresh if you want it at head.
- Predictions to note: O2/K3 predict footer-length differs for 500 vs 1000 features; not guaranteed. A wrong prediction is a result (class 2).

## What stage 2 must run (my reading of section 4, section 9)
- First builds, all under CARGO_TARGET_DIR=D:/wt-targets/1a and the machine paragraph: `cargo test --workspace --locked --features spatial-engine/fixture` (expect first compile errors to fix inside section 7), `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture` (no new warning on an added line), `cargo fmt --all --check`, `npm run verify:adr-index`, `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`, verify.mjs, queue --check, site --check, verify-cites, verify-quotes, verify-test-claims.
- Mutations, each applied, test run, failure recorded by name with the commit, reverted: O1 (observation() footer_hash None), O2 (components_differing_from bypasses the shared rule and omits footer-hash), O3 (observation() modified_nanos None), O4 (shared rule counts a footer hash present on one side only), R1 (parser drops admission.identity), R2 (ignores unknown keys), R3 (locator-count check removed), R4 (hex check removed from FromStr), R5 (parser refuses project-relative), R6 (None maps to empty string), R7 (grammar check removed so `..` parses), K1 (writer renames portability_policy), K2 (writer omits crs_assertion), K3 (check returns NoChangeDetected), K4 (check skips identity), K5 (linked calls std::fs::metadata(ds.path())), G1 (machine-recorded locator's at carries ds.path()). Each mutation is described in its test's doc comment.
- Existing tests unmodified: verify no edit to any existing test (I3) and that descriptor.rs unit tests plus publish.rs/verify_bundle.rs pass unchanged. Confirm the lock diff above is still the whole Cargo.lock change after the first build with --locked.

## Noticed, not done
- The scratch folder is shared with the custodian's files; my helper scripts there are w1a-* plus adrlib.mjs, build_adr*.mjs, check_adr*.mjs.
- I did not touch PLAN.yaml, the form, or the main checkout.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
