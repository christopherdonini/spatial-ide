*Custodian's filing note (2026-11-06): the reviewer's report for gate 1 of PR #289, from its hand-back (sha256 b443f6fecb8c02119b2d75037a6ea6b30edc9bf65058b5ca51bef7540423c695, 20645 bytes), byte for byte except one span: the path of the session scratch folder in its last paragraph, a user-profile path, replaced by `<the session scratch folder>/` under the human's rule that no filed record quotes a user-profile path. A report, not Authority.*

Reviewed: PR #289 at dccbb3e836ea11887369b0a6f8b06c30e099342f (base 0f9edda8), gate 1, reviewer
Verdict: PASS WITH NOTES (WORDS-ONLY)

`cut/publish-session-tier-identity` @ dccbb3e836ea11887369b0a6f8b06c30e099342f. I checked the brief's sha256 (41415f71…f840) and the packet's (02498206…0b0c3) at the start, and both matched.

The code is correct, and every check passed: all suites, the five ignored release tests, and M-1 to M-7, each observed by me on a clean export. There are no Correctness or Evidence findings. Three doc-comment sentences are no longer true; my replacement words for each are below. None of them is the human's wording or red-line text.

## Findings

### Correctness
None.

### Evidence
None. All seven mutations failed exactly where the form predicts, and every other test in each target passed (check 3).

### Documentation (each must be fixed before the merge; WORDS-ONLY; none is the human's wording or red-line text)

**D-1. Place 2 (§2.6) was never written.**
- **Requirement:** form §2.6 place 2, and §8 item 9.
- **Evidence:**
  - `kernel/src/publish/error.rs` at the head, the `ReaderCeilingExceeded` doc, still says `CeilingExceeded` "is *this operation's own* declared limit (`MAX_PUBLISH_PARTITIONS`)".
  - At the head, `CeilingExceeded` also carries the reader's `MAX_FEATURES`: `ceilings::check_streamed_features` raises it, called at mod.rs `run_inner`, before `write_partition`.
  - `git show 8f1c768e -- kernel/src/publish/error.rs` adds only the new variant's doc. Commit 8f1c768e's message ("the ReaderCeilingExceeded doc, which no longer calls the write-time limit MAX_PUBLISH_PARTITIONS alone") is therefore untrue, and so is the phase-1 report's "Place 2 … was edited in the first part of commit 4".
- **Closure:** replace the sentence that runs from "Distinct from [`Self::CeilingExceeded`]," to "wherever it is predictable there." with:
  > Distinct from [`Self::CeilingExceeded`], which is a limit reached by an actual count rather than predicted: in the partition loop it carries this operation's own `MAX_PUBLISH_PARTITIONS`, and the reader's `MAX_FEATURES` for a publish preflight gave no prediction (a bbox scope, or a `DeclaredNotVerified` identity; `ceilings::check_streamed_features`) — this variant is the *reader's* limit as predicted (`renderer/bundle-viewer/ceilings.json`, read via [`crate::publish::ceilings::reader_ceilings`]), checked in `preflight` wherever it is predictable there.

  Clause check against the head:
  - **"reached by an actual count":** every raise site compares a count. These are mod.rs `run_inner` (`saw: index as u64 + 1`), ceilings.rs `check_streamed_features` (`saw = rows_written + batch_rows`) and `viewer_assets.rs` (counts of the supplied assets).
  - **"in the partition loop … MAX_PUBLISH_PARTITIONS":** the `index >= MAX_PUBLISH_PARTITIONS` arm in `run_inner`.
  - **"MAX_FEATURES for a publish preflight gave no prediction":**
    - The guard runs on every partition, but it can fire only when the total exceeds the ceiling.
    - A predicted scope above the ceiling is already refused at preflight by `check_reader_ceilings(predicted_features(..))`.
    - A predicted scope at or below the ceiling streams at most its exact verified count, capped by its limit.
    - `predicted_features` returns `None` for a bbox and for `verified_rows` `None`.
  - **"this variant … checked in preflight":** `check_reader_ceilings`, called in `preflight_pinless_parts`.
- The PR body and the closing record must not cite place 2 as done at 8f1c768e.

**D-2. A stale cross-reference in `preflight`'s doc** (kernel/src/publish/mod.rs, inside Scope).
- **Requirement:** Part 1 item 1, and §2.6 place 4.
- **Evidence:** the doc still says "(see that function's own doc comment for the reordering and its one named residual)". `preflight_pinless`'s doc at the head now names "The two cases this ordering cannot help".
- **Closure:** replace that parenthesis with "(see that function's own doc comment for the reordering and the two cases it cannot help)". Clause check: `preflight_pinless`'s doc heading and its two bullets (`DeclaredNotVerified`, and a scope with a bbox).

**D-3. ceilings.rs, `check_reader_ceilings`'s doc, the last clause of the new "What it is given for `MAX_FEATURES`" paragraph.**
- **Requirement:** Part 1 item 1, and §2.6 place 3.
- **Evidence:** "so those routes are refused later and not at preflight" says every publish on those routes is refused. A bbox publish at or below the ceiling is not refused: `check_streamed_features` refuses only when `saw > max_features`.
- **Closure:** replace that clause with "so on those routes a publish above the ceiling is refused later, at write time, and not at preflight". Clause check: `check_streamed_features`'s `if saw > ceilings.max_features`, and its call in `run_inner` after preflight and after staging is created (`publish_prepared` creates staging before `run`).

### Notes (not blocking; no acceptance conditions)
- **N-1, a sibling outside Scope.** `frontends/shell/MANUAL-WALKTHROUGH.md` M10 says that for a `DeclaredNotVerified` dataset "only the bundled viewer's own load-time check catches it over ceiling". That is untrue at the head, because the write-time guard now catches it. The file is outside the nine paths (§8 item 7), so it cannot be fixed in this PR. It is for the custodian to place (AUTONOMY §14). Ordinary use cannot reach it: no product route sets `DeclaredNotVerified`.
- **N-2, for the human at the click (red line; no words proposed).**
  - Every new clause of KNOWN-LIMITATIONS items 5 and 6 checks true against the head:
    - A whole-file publish is still refused at preflight (`predicted_features` gives `Some` for no bbox).
    - "Current view" is not predicted from the whole file (`to_query` builds `ViewportBbox` with a bbox; `predicted_features` returns `None` for a bbox).
    - It is refused only if its own rows exceed `MAX_FEATURES` (the guard's `>`).
    - That refusal comes while the rows are written (in the partition loop, before `write_partition`).
    - It comes after the approval (the shell's `execute_with_progress` runs after the prompt).
    - Nothing is left at the destination (the destination is never created; staging, a sibling `.name.staging-…`, is removed on failure).
    - Item 6's new sentence: the same guard.
  - The lead "a whole-file publish above one of them is refused before anything is written" is still broader than the code for `MAX_RESIDENT_BYTES` and `MAX_PARTITIONS`. That breadth was already there before this PR (this PR narrowed "a publish" to "a whole-file publish"), and item 6 qualifies it straight away.
  - The Display text (OPEN-4 (A)) carries its `[P6 placeholder] ` mark. It states the identity fact and the format fact, and gives no advice to declare an identity column. Each clause is true: the source is `session-ordinal:file_row_number`, and a bundle persists the ids.
- **N-3, cosmetic.** Two KNOWN-LIMITATIONS item 5 lines exceed the paragraph's wrap width (the "refused before anything is written.** The viewer's ceilings…" line, and the "…no destination is created. A Current view publish is not" line).
- **N-4, item 7.** S-U1 opens FX-S with `Dataset::open`, not the host's route (`host.catalog()`). It asserts `is_session_ordinal()`, so the real input shape is proven, and it follows the K-5 precedent. Building it through the catalog would be closer to "the real producer where practical".
- **N-5, clippy.** It stops at the first crates' compile errors, so the kernel's integration-test targets, `publish_identity_tier` included, were not linted under `-D warnings` (check 2).

## Check 1: the diff against §2.1–2.7, §7 and §8
- **Session check:** sits in `preflight_pinless_parts` after the encoding check and before `dataset_logical_uri`. It reads only `ds.identity().source().is_session_ordinal()`, with no IO.
- **The new variant:** named in `code()` (`publish.session_identity_not_publishable`), in `Display` (prefixed `[P6 placeholder] `), in boundary.rs `error_kind`, and as `Refused` in `publish_outcome`.
- **`identity_caveat(uniqueness: IdUniqueness)`:** a function of the tier. Script `psti-g1r-caveat.mjs` parses the Rust literals and returns rc 0: the base literal, the head's verified-tier output and the test's `VERIFIED_CAVEAT` are all 270 bytes and all equal.
- **`predicted_features`:** returns `None` for a bbox; otherwise `verified_rows` capped by `limit`.
- **`check_streamed_features`:** refuses when `saturating_add > max_features`, with `CeilingExceeded { "MAX_FEATURES", limit, saw }`.
  - It is called after the `MAX_PUBLISH_PARTITIONS` check and before `write_partition`.
  - `reader_ceilings` is read once, before the loop.
  - `check_reader_ceilings` is unchanged: the ceilings.rs hunks are doc, `use`, the two new functions and appended tests only.
- **Unchanged:** `ceilings.json` (not in the diff), its hash, every `MAX_*` value, `bundle_version` and every other manifest member. A grep of changed lines for `bundle_version|MAX_…[:=]` returns rc 1. No product constant is added; the only new `const` items are in the test file.
- **Files:** exactly the nine. Changed lines carrying `pub`: only the two `pub(crate)` fns.
  - `engine/src/identity.rs`: the doc only.
  - The shell's publish.rs: the doc of `prepare_with_progress` (place 7) and S-U1 only.
  - KNOWN-LIMITATIONS: one hunk at items 5 and 6 and their comments; item 3 untouched.
  - README: one list entry.
- **Size:** `git diff --numstat 0f9edda8...dccbb3e8` gives 946 + 39 = 985 against 700. That is class 8 (packet disposition 1). The form's §7 line is unedited: the form is not in the diff, and its sha256 at main is d8edbcc8.
- **Bytes:**
  - CR: none. Tab: none.
  - Non-ASCII: three added lines with em-dashes (the boundary.rs list item, and two in mod.rs). Both files already use the same style.
  - Every changed file ends in `0a`. No "No newline" marker.

## Check 2: the suite at the head, in `C:/dev/wt/psti`, target `D:/wt-targets/psti`
- `cargo test --workspace --locked`: **rc 0**. 114 result lines: 1021 passed, 0 failed, 66 ignored. K-U1, K-CAV, U-PRED and U-GUARD passed by name. No engine LOD or tier test failed, so none was re-run.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: **rc 0**. "73 passed; 0 failed", plus 2 in a second binary. S-U1 passed by name.
- Release, `--ignored`:
  - `--test publish_identity_tier`: **rc 0**, "2 passed; 0 failed; … 2 filtered out" (K-U10a and K-U10b).
  - `…refuses_at_preflight_before_any_write --exact`: **rc 0**, 1 passed.
  - `…refuses_before_any_hash_is_taken --exact`: **rc 0**, 1 passed.
  - `an_adr_025_reader_ceiling_refusal_at_preflight_produces_no_audit_record --exact`: **rc 0**, 1 passed.
- `npm run verify` (frontends/shell): **rc 0**. "Tests 1446 passed (1446)"; node suites "fail 0".
- `cargo fmt --all -- --check`: **rc 0**. The shell's `cargo fmt --manifest-path … -- --check`: **rc 0**.
- `cargo clippy --workspace --locked --tests --no-deps -- -D warnings`: **rc 101**.
  - Errors in renderer/src/canonical.rs:240, renderer/src/style.rs:10, engine/src/rowgroup.rs:331, and engine/src/stream.rs:2346, 2350 and 2462. None is among the nine.
  - Because that run stops at those crates, I also ran `cargo clippy -p spatial-kernel --locked --tests --no-deps -- -D warnings`: **rc 101**. Its errors are at kernel/src/lib.rs:414 and :489, kernel/src/skp.rs:277, kernel/src/permission/boundary.rs:536 and kernel/src/publish/mod.rs:839.
  - The last two are inside Scope files, but `git blame` puts each line in a commit that is an ancestor of the base (55c7683e and 717ff9c3; `merge-base --is-ancestor` rc 0). They are not lines this diff wrote.
- Porcelain afterwards: empty (0 bytes); HEAD is dccbb3e8.

## Check 3: M-1 to M-7 on the export
**Setup**
- `git archive dccbb3e8`, unpacked with `tar --force-local` into `D:/wt-targets/psti-g1r-export`.
- Prepared in CI's order, each step **rc 0**: bundle-viewer `npm ci --offline`, then `npm run build`; shell `npm ci --offline`, then `npm run build`.
- Cold target `D:/wt-targets/psti-g1r-target`. Built with `--no-run`, each **rc 0**: kernel debug lib plus `publish_identity_tier` (12m01s), kernel release `publish_identity_tier` (14m34s), and the shell crate.
- Mutations were applied by script (`psti-g1r-mutate.mjs`, exact text, one occurrence each, dry-run diffs shown first). After each run, I restored the file from `git show dccbb3e8:<path>`. The sha256 was back to the head's each time: mod.rs 6c8e522e…48bd2 and ceilings.rs 692f6225…5c0c.

**Results.** Each named test failed where the form predicts. "Others" means the other tests in that target.
- **M-1** (session check removed; debug, publish_identity_tier): rc 101. K-U1 FAILED at publish_identity_tier.rs:266 with "R1 current-view: preflight_pinless admitted a session-tier dataset". Others: 1 passed, 2 ignored.
- **M-3** (both unverified leads set to the verified sentence): rc 101. K-CAV FAILED at :384 with "R5: the caveat claims a verification that never ran…". Others: 1 passed.
- **M-4** (bbox early return removed; kernel `--lib`): rc 101. `a_bbox_scope_predicts_nothing_over_a_verified_file` FAILED, `left: Some(3300000)` against `right: None`. Others: 172 passed, 1 ignored.
- **M-5** (`>` changed to `>=`; `--lib`): rc 101. `a_batch_that_brings_the_total_to_the_ceiling_is_not_refused` FAILED at `check_streamed_features(0, c.max_features, &c).is_ok()`. Others: 172 passed.
- **M-6** (`verified_rows()` passed for every scope; release `--ignored`): rc 101. K-U10a FAILED at :488 with `ReaderCeilingExceeded { ceiling: "MAX_FEATURES", limit: 2000000, predicted: 2000001 …`. K-U10b ok.
- **M-7** (guard call removed; release `--ignored`): rc 101. K-U10b FAILED at :555 with "R8: expected CeilingExceeded for MAX_FEATURES, got Ok(… partitions: 245, rows: 2000001 …)". K-U10a ok.
- **M-2** (check moved into `preflight` after `SourceNotPinned`; shell crate): rc 101. S-U1 FAILED at src\publish.rs:3039 with "whole-file: a pin-free refusal must never take a pin as a side effect". Others: 72 passed. Cargo stopped after the failing unit binary.
- The export, its target and both tmp folders are removed. `ls D:/wt-targets/psti-g1r-*` finds nothing.

## Check 4: the tests' soundness
- **S-U1:**
  - It calls the real `prepare_with_progress` over a real FX-S, unpinned, in both scopes.
  - It asserts each R3 claim: `Refused` with the prefix `publish.session_identity_not_publishable: `, `content_pin()` None, `store.len() == 0`, and `out` absent.
  - Its producing shape matches the consumer: `refusal_detail` gives `code: display`, as the shell parses it.
- **K-U1:** `Catalog::open_cancellable`, then `preflight_pinless` (R1); then pinned, `boundary::execute` with a grant and a `PreNamedApproval` (R2). It asserts no destination, no `.staging-` entry and an empty audit log.
- **K-CAV:** `publish_unguarded` over FX-V and FX-D, the latter opened with a declared mapping onto `id` and `skip_uniqueness_check` true.
- **K-U10a:** `preflight_pinless` (R7), then `preflight` and `publish_unguarded` (R6, rows = 5000).
- **K-U10b:** `boundary::execute` (R8). It asserts `CeilingExceeded`, no destination or staging, one intent record and one refused outcome of kind `CeilingExceeded`.
- **The existing list is unchanged:** `git diff --stat 0f9edda8...dccbb3e8 -- kernel/tests/publish.rs kernel/tests/permission_boundary.rs` is empty (rc 0). The ceilings.rs hunks append after the five existing unit tests and leave them untouched.
- **No sleep, retry, timeout or `cfg`** in either new test body (grep). The only shared state is the file's own `env_lock` around `AUDIT_LOG_ENV`. The only `#[ignore]`s are on K-U10a and K-U10b.
- **`RECORDED MUTATION:` lines:** M-1, M-3, M-4, M-5, M-6 and M-7 each name 435be20a3b54a4a9580def1960c6f1d13070c9c0; M-2 names e5a96db74b634ec51777c9e359213720bd6ca88c. Each describes the mutation that ran and the failure point I reproduced.

## Check 5: the sentences, places 1 to 10, clause by clause
- **Place 1** (the variant's doc and Display): true. The check sits after the encoding check and before `dataset_logical_uri`. It reads the identity alone and never the query. It runs before the pin and the audit intent (boundary `execute`: `preflight` before `append_intent`).
- **Place 2:** not written (D-1).
- **Place 3:** true except the last clause (D-3).
- **Place 4:** the module order (steps 1 and 4), `preflight_pinless`'s two cases, the ceiling comment, and the session-check, guard and caveat comments are all true. The adjacent stale reference is D-2.
- **Place 5:** boundary.rs's "fourth in `preflight_pinless_parts` … no record can carry this kind" is true.
- **Place 6:** identity.rs ("the publish preflight, which refuses a dataset of this tier") is true.
- **Place 7:** the shell's "two cases" is true clause by clause:
  - `prepare_with_progress` calls `preflight_pinless` first and then `ensure_pinned_with_progress`.
  - `prepare_with_query`'s `preflight` re-runs the same parts.
  - `execute_with_progress` maps `BoundaryError::Publish(e)` to `Refused { e.refusal_detail() }`, so the message carries the `publish.ceiling_exceeded: ` prefix.
  - The session tier is refused before the ceiling check.
- **Place 8:** see N-2. These are the human's words, at the click.
- **Place 9:** the README entry is present.
- **Place 10:** see check 4.

## Check 6: verify scripts and CI
- **The brief's paths do not exist:** `node scripts/verify-cites.mjs` gives rc 1 (module not found). I ran the scripts under `scripts/plan/`:
  - `verify.mjs --offline`: **rc 0**, PASS.
  - `verify-cites.mjs`: **rc 0**, PASS (2697 files).
  - `verify-test-claims.mjs`: **rc 0**, PASS (739).
  - `verify-quotes.mjs` (timeout 2400): **rc 0**, PASS (138 checked, 107 verified, 30 baselined).
- **`gh pr checks 289`** (rc 0, read 2026-11-06T13:21:30Z): all 16 checks pass.
- **`gh run view`, each rc 0, every run on head dccbb3e836ea11887369b0a6f8b06c30e099342f, completed and successful:**
  - pull_request event: 42220817728 DCO sign-off; 42220817682 Ported notices; 42220817647 Rust fmt; 42220817596 Exposure scan; 42220817663 Governance CI; 42220817858 Product CI — shell; 42220817907 Product CI — Rust workspace.
  - push event: 42213359591 Ported notices; 42213359747 Rust fmt; 42213359533 Governance CI; 42213359719 Product CI — shell.
- Section 8 item 16 is met: no CI entry is red.

## D: free space around each FX-BIG run (`df -BG /d`)
- Worktree K-U10a and K-U10b: 177G before, 177G after.
- Worktree ignored test 1: 177G, 177G. Test 2: 177G, 177G. Test 3: 177G, 177G.
- Export M-6: 166G before, 165G after.
- Export M-7: 165G before, 165G after.
- After cleanup: 178G. The 40 GiB floor was never near.

## Packet gaps
- The packet did not say that the phase-1 report's place-2 claim was unverified. The gate found it untrue (D-1).
- The brief named the verify scripts at `scripts/*.mjs`; they live at `scripts/plan/`. The phase-2 report had already recorded the same error.
- No other gaps.

## Hold lines (this project's only; `also=` elided)
All were `hold shared -Project SpatialIDE`, each granted (no exit code 96 to 99) and released. Each `-What` began "publish-session-tier-identity gate 1 reviewer:" followed by:
- cargo test --workspace
- verify-quotes
- shell cargo test
- K-U10a and K-U10b in release
- ignored test 1 of 3 in release; 2 of 3; 3 of 3
- shell npm run verify
- clippy; clippy kernel only
- export bundle-viewer npm ci offline and build; export bundle-viewer build
- export shell npm ci offline; export shell build
- export kernel debug test build; export kernel release test build; export shell crate test build
- M-1 mutation run; M-3; M-4; M-5; M-6 in release; M-7 in release; M-2, shell crate

## Background shells and disclosures
- None of mine is running. Every hold call exited and released. My two wait loops ended at their hard timeout (rc 124).
- A cargo.exe chain (PIDs 81196 and 21164, under timeout.exe 48072 and 68060, started 14:47:52Z) is running on the machine. It names neither the kernel package nor the shell manifest, and I did not start it, so I left it alone.
- **Disclosure:** `git archive` wrote a tar to `D:/wt-targets/psti-g1r-archive.tar`, which is not on the brief's write list. I removed it straight after unpacking.
- No commit, push, PR action or network use other than `gh`. The worktree's porcelain is empty.

Scratch logs are under `<the session scratch folder>/` (for example `psti-g1r-ws.log` and `psti-g1r-m1.log` to `psti-g1r-m7.log`).
