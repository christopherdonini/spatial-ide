*Custodian's filing note (2026-11-06): U1 phase 2 (`publish-session-tier-identity`, slot 1 ahead of order), built by a worker-high on `cut/publish-session-tier-identity` from 16cbe5ef (main 0f9edda8 merged in), head dccbb3e8, from its brief by path and sha256 (11993 bytes, sha256 b508c68d078c4361a3b6c13b1f0675e400b64b19b33df873055b6234fd6600a9); dispatched at 2026-11-06T11:27:47Z by its transcript, its last record at 2026-11-06T12:40:37Z; unique calls 103, equal to the notification's. The custodian's check by git: two commits on 16cbe5ef, the shell's publish.rs the only file changed, origin's branch equal to the head. The brief's step 6 named the three record checks at wrong paths (the custodian's error); a message corrected it during the run, and the report says the worker had already found the right paths. The report discloses one `git fetch origin main` outside the brief's network list. A report, not Authority.*

Built: publish-session-tier-identity phase 2 at dccbb3e836ea11887369b0a6f8b06c30e099342f

Start: brief sha256 matched b508c68d. HEAD 16cbe5ef052dd29dce50f2bf7e5e1acc35bc323e, origin's branch the same, porcelain empty. D: free 201G at the start.
Model: Sonnet 5.5 (claude-sonnet-5-5). No model override, no context handoff.

**Step 1 (build preconditions, all exit 0)**
- bundle-viewer `npm ci`: last line "npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow."
- bundle-viewer `npm run build`: "scan-dist: reviewed row app.js local-filesystem-path 7291: not found"
- shell `npm ci`: same allow-scripts warning as its last line.
- shell `npm run verify`: last line "ℹ duration_ms 14.4082".
- The check ran again at the head, because the frontend tests read publish.rs: rc 0, "Test Files 109 passed (109)", "Tests 1446 passed (1446)".

**Commits** (both `-s`; `@` only on the first trailer line)
1. e5a96db74b634ec51777c9e359213720bd6ca88c: "test: publish-session-tier-identity S-U1, a session-tier dataset refused through the shell's prepare_with_progress before any pin, in both scopes"
2. dccbb3e836ea11887369b0a6f8b06c30e099342f: "docs: publish-session-tier-identity place 7, the shell's two cases this ordering cannot help, and M-2 observed"
- Both touch only `frontends/shell/src-tauri/src/publish.rs`. No product code, string, `pub` item, dependency or `unsafe`, and no path:line cite in a code comment.
- S-U1 at commit 1 (inside a shared hold): `a_session_tier_dataset_reaches_prepare_refused_with_its_typed_code_before_any_pin_is_taken_in_both_scopes ... ok`; "test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 72 filtered out; finished in 0.12s".

**M-2** (alone, on commit 1, shared hold). The session check was moved out of `preflight_pinless_parts` into `preflight`, after `SourceNotPinned`. It failed by name at the no-pin assertion, observed at e5a96db74b634ec51777c9e359213720bd6ca88c. Byte-copied from the run log:
```
thread 'publish::tests::a_session_tier_dataset_reaches_prepare_refused_with_its_typed_code_before_any_pin_is_taken_in_both_scopes' (28300) panicked at src\publish.rs:3020:13:
whole-file: a pin-free refusal must never take a pin as a side effect
test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 72 filtered out; finished in 0.08s
```
- Revert by `git checkout -- kernel/src/publish/mod.rs`. The file's sha256 is 6c8e522ea78ac1909ee29d88778a4cac0b139216e3eea53444b5f54519948bd2, equal to commit 1's (same value before the mutation).

**Place-7 sentence** (byte-copied from the file at HEAD; the lines run from `The two cases this ordering cannot help` to `preflight refuses it first, in either scope.`):
```
/// **The two cases this ordering cannot help, because the scope's feature count is not
/// predictable without reading the source.** This function calls [`publish::preflight_pinless`]
/// first, so what that function passes un-refused at the `MAX_FEATURES` check passes here too (see
/// its own doc comment for the same two cases).
/// - **`DeclaredNotVerified` identity.** It carries no verified row count, so nothing is predicted
///   for it, in either scope.
/// - **A `ViewportBbox` scope.** `PublishScope::to_query` gives it a bbox query, and a bbox query is
///   given no prediction whatever the file's row count, so a file above the ceiling is not refused
///   here for it.
///
/// In both, the pin phase runs, and [`prepare_with_query`]'s own [`publish::preflight`] makes the
/// same empty prediction, so neither refuses on the row count and the attempt can reach the
/// approval prompt. The ceiling is then enforced when the attempt is executed, while the rows are
/// written: [`execute_with_progress`] returns [`ExecuteOutcome::Refused`] with a message prefixed
/// `publish.ceiling_exceeded: `, and not `publish.reader_ceiling_exceeded: `. A session-tier
/// identity is not a case of its own: it also has no verified row count, but the pin-free
/// preflight refuses it first, in either scope.
```
Each clause with the code it rests on (names, at HEAD):
- "calls `preflight_pinless` first": `prepare_with_progress` runs `publish::preflight_pinless(&request)` before `ensure_pinned_with_progress`.
- "same two cases": the kernel's `preflight_pinless` doc was already rewritten to "The two cases this ordering cannot help" in phase 1.
- "no verified row count" / "nothing predicted": `ceilings::predicted_features` returns `verified_rows.map(..)`, and `verified_rows` is None for `DeclaredNotVerified` (phase-1 P-0 for FX-D).
- Bbox: `PublishScope::to_query` sets `bbox: Some(..)` for `ViewportBbox`, and `predicted_features` returns None on `query.bbox.is_some()`.
- "pin phase runs ... `prepare_with_query`'s `publish::preflight`": `ensure_pinned_with_progress` is called after the pin-free preflight, and `prepare_with_query` calls `publish::preflight`, which calls `preflight_pinless_parts`.
- "enforced when executed": `run_inner` calls `ceilings::check_streamed_features(rows_total, info.rows as u64, &reader_ceilings)?` before `write_partition`. It returns `CeilingExceeded`, whose code is `publish.ceiling_exceeded`; `ReaderCeilingExceeded`'s is `publish.reader_ceiling_exceeded`.
- `execute_with_progress`: `BoundaryError::Publish(e)` maps to `ExecuteOutcome::Refused { message: e.refusal_detail() }`, which is "<code>: <display>".
- "session tier ... refuses it first": the `is_session_ordinal()` check sits before `check_reader_ceilings` in `preflight_pinless_parts`, and FX-S has `verified_rows` None (P-0).
- No shell test proves the execute-time clause; it is read from the code.

**S-U1** is at `frontends/shell/src-tauri/src/publish.rs`, lines 2951 to 3053 at HEAD, directly after K-5. Its RECORDED MUTATION and OBSERVED lines name e5a96db74b634ec51777c9e359213720bd6ca88c. It was byte-extracted from the file; the full text is in the file, not repeated here to keep the report short.

**CI on dccbb3e8** (all conclusions success; none failed or cancelled)
- Product CI — shell, run 42213359719:
  - "typecheck · build · vitest · cargo test", job 127877202473: success.
  - "tauri build (NSIS, build-only, no signing)", job 127877202957: success.
- Rust fmt, run 42213359747: "cargo fmt --check (workspace and src-tauri)" success.
- Governance CI, run 42213359533: "cfg boundary (PORTABILITY R2)" success; "test · verify:plan · queue/site drift" success.
- Ported notices, run 42213359591: success.
- **Product CI — Rust workspace did not run on this head.** Its path filters (kernel, engine, renderer) do not match a publish.rs-only push. Its latest run is 42210184066 at 16cbe5ef, success.

**Checks at HEAD dccbb3e8** (each in a shared hold)
- `cargo test --workspace --locked`: rc 0, 114 result lines, 1021 passed, 0 failed, 66 ignored.
- Shell `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: rc 0. Unit tests "73 passed; 0 failed; 0 ignored"; the S-U1 test is among them.
- `cargo clippy --workspace --locked --tests --no-deps -- -D warnings`: **rc 101**, same as phase 1's report. Eight errors, all in lines this phase did not touch (engine/src/stream.rs:2346, 2350 and 2462; engine/src/rowgroup.rs:331; renderer/src/canonical.rs:240; renderer/src/style.rs:10). The shell crate is outside the workspace, and my diff has no workspace file.
- Ignored tests in release, at HEAD (`--release`):
  - `--test publish_identity_tier -- --ignored`: rc 0. K-U10a `a_current_view_publish_over_a_verified_file_above_the_ceiling_publishes_its_own_rows ... ok` and K-U10b `an_unverified_file_above_the_ceiling_is_refused_by_the_write_time_guard_and_leaves_nothing ... ok`. "test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 2 filtered out; finished in 32.36s".
  - `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_at_preflight_before_any_write`: rc 0, "1 passed; 0 failed; 0 ignored; 0 measured; 34 filtered out; finished in 6.59s".
  - `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_before_any_hash_is_taken`: rc 0, "1 passed; ...; 34 filtered out; finished in 12.27s".
  - `an_adr_025_reader_ceiling_refusal_at_preflight_produces_no_audit_record`: rc 0, "1 passed; ...; 16 filtered out; finished in 13.97s".
- D: free, from `df` (Avail), before and after each of the five runs:
  - K-U10a/K-U10b: 192G, 193G.
  - Ignored test 1: 193G, 193G.
  - Ignored test 2: 193G, 192G.
  - Ignored test 3: 192G, 192G.
  - The 40 GiB floor was never near.
- `cargo fmt --all -- --check`: rc 0. Shell `cargo fmt --manifest-path ... -- --check`: rc 0.
- `node scripts/plan/verify.mjs --offline`: rc 0, PASS.
- Under the custodian's correction, `node scripts/plan/verify-cites.mjs`: rc 0, PASS (2697 files).
- `node scripts/plan/verify-quotes.mjs` (2400 s timeout): rc 0, PASS (138 checked, 107 verified, 30 baselined).
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS (739 claimed tests).
- I first tried the brief's `scripts/*.mjs` paths, got module-not-found, and found the scripts under `scripts/plan/` myself. The custodian's correction message, which arrived later, names the same paths, so all three ran at those paths under it.

**Size:** `git diff --numstat origin/main...HEAD` over the nine paths is 946 insertions and 39 deletions, total 985 against section 7's 700. Phase 2 adds 124 (publish.rs 121/3) to phase 1's 861. Class 8, reported and not trimmed.

**Disclosures**
- I ran `git fetch origin main` once, to refresh the size base. It is network use outside the brief's list. It changed nothing in the tree.
- No stop rule met. The mutation failed where predicted, and no test failed where none was predicted.
- Not done, not mine: `KNOWN-LIMITATIONS.md` items 5 and 6 (the human's words).

**Hold lines** (SpatialIDE only, `also=` elided, every one granted and released, no 96 to 99):
- "publish-session-tier-identity: shell npm run verify" (twice, the second "...at the head").
- "...: shell S-U1 at commit 1"
- "...: shell S-U1 under M-2"
- "...: workspace tests at the phase 2 head"
- "...: shell cargo test at the head"
- "...: clippy at the head"
- "...: K-U10a and K-U10b in release"
- "...: ignored test 1 of 3 in release", "2 of 3" and "3 of 3".

**Background shells:** none left. Every background command I started exited on its own, and I killed nothing.

**End state:** origin's branch equals HEAD (dccbb3e836ea11887369b0a6f8b06c30e099342f), `git status --porcelain` is empty, and I took no PR action.
