*Custodian's filing note (2026-09-30): the reviewer's gate 1 on PR #149, for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the second piece (the A4-1 and A4-3 src-tauri lines), full gating. Reviewed: cut/publish-refusal-src-tauri @ a633b0246c791a9e8653b0b4b2807616eaa60734 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 19:46:03Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at a633b02. Its P0 run at 55ce85e is the reproduction of record, and its mutation table at a633b02 is the observation of record for §4's four mutations. N3 corrects the worker-report filing note by a later fact: Governance CI has since run on the PR head and passed. Profile paths redacted at filing: none.*

---

Reviewed: cut/publish-refusal-src-tauri @ a633b0246c791a9e8653b0b4b2807616eaa60734

**Verdict: PASS.** No blocking findings.

**Checks**

1. **The diff is correct at both arms (`git diff 4a2bb00...a633b02`).**
   - It has three product hunks: the module doc at frontends/shell/src-tauri/src/publish.rs:29-31, the execute arm at publish.rs:735-737, and the pin arm at publish.rs:1077-1078. Everything else is `mod tests` (from publish.rs:2232) and PublishPanel.test.ts.
   - **Which variants reach the execute catch-all (publish.rs:738):** `BoundaryError` has four variants (kernel/src/permission/boundary.rs:138-148). `OutcomeNotAudited` has its own arm (publish.rs:729) and `Publish` now has one too. Only `Permission` and `Audit` reach the catch-all, and they stay untyped.
     - No `PermissionError` or `AuditError` wraps a `PublishError`: under kernel/src/permission, the only file that references `PublishError` is boundary.rs.
     - `resolve_destination` returns `PermissionError` (kernel/src/permission/grant.rs:190), and `respond` does too (kernel/src/permission/approval.rs:145).
     - So the falsifier (a `PublishError` arriving through a variant other than `Publish`) cannot occur.
   - **Cancelled at the pin phase:** `Err(EngineError::Cancelled) => EnsurePinnedOutcome::Cancelled` at publish.rs:1076 is unchanged and sits ahead of the new arm. `cancel_during_the_pin_phase_produces_a_typed_cancelled_outcome_with_no_side_effect` is green.
   - **Every `Failed` carries `publish.engine`:** `From<EngineError>` maps only `Cancelled` to `PublishError::Cancelled` (kernel/src/publish/error.rs:367-370). That case is intercepted first, so every other error becomes `Engine`, whose code is `publish.engine` (error.rs:206).
   - **Preflight sites unchanged:** publish.rs:410 (`refusal_detail`) is untouched. The only consumer of `Failed` is publish.rs:418, plus the test-only `ensure_pinned` (publish.rs:1045).
   - **No consumer matches the unprefixed text:** TS product code, e2e/*.mjs and the walkthrough have no match. Row G4 is a `PermissionError` and keeps `publish-refused`; frontends/shell/MANUAL-WALKTHROUGH.md:327.

2. **P0 at B (55ce85e), observed directly.** I ran it in a scratch worktree at D:/wt-targets/publish-refusal-src-tauri/scratch-b, with the untracked scaffolding copied from the branch worktree (both dist folders, src/generated, src-tauri/gen). B adds 57 lines, all in tests. cargo test exited 101:
   - T1 panicked at src\publish.rs:2240, the `assert_eq`. left was the Display with no prefix; right was `publish.cancelled: cancelled: no bundle exists ...`.
   - T2 panicked at src\publish.rs:2278 with `no publish.engine prefix: source: open for hashing: The system cannot find the file specified. (os error 2)`. That message has no prefix, so it came from the pin phase and not from `preflight_pinless`. `remove_file` succeeded. The invalid-run condition did not fire.
   - I then removed the scratch worktree and ran `git worktree prune`; no scratch worktree is left.

3. **Mutations:** all four observed at a633b02, each reverted, porcelain empty after each (table below).

4. **Suites at a633b02** (exit codes read directly):
   - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: rc=0. Lib 59 passed, 0 failed, 0 ignored. That includes T1, T2 and all ten of §5's declared-unchanged tests, each listed `ok`. sole_caller_scan: 2 passed. No test failed, so no timing re-run was needed.
   - `cargo clippy ... --tests`: rc=0 with 3 warnings: commands.rs:256, commands.rs:489 and publish.rs:303. The publish.rs:303 warning is on `PrepareOutcome`, which is at publish.rs:302 at 4a2bb00 and is untouched. Nothing new in publish.rs.
   - rustfmt `--check` hunk count on publish.rs: 62 at 4a2bb00 and 62 at a633b02.
   - `npm run verify` in frontends/shell: rc=0. 72 files and 1094 tests passed; citationIntegrity 30 passed, 0 failed.
   - From C:/dev/spatial-ide at a710afc, where main's porcelain shows only the pre-existing `.codex-remote-attachments/`:
     - node --test scripts suite: rc=0, 353 of 353 passed.
     - verify-cites: rc=0.
     - verify-quotes: rc=0.
     - verify-test-claims: rc=0, 404 claims.
     - verify.mjs: rc=0.
   - verify-test-claims in the branch worktree: rc=0, 410 claims across 99 files. The form's T1 and T2 claims resolve.

5. **§8 and §7:**
   - The added product lines carry no string literal outside comments: the two arms call `refusal_detail()` and nothing else.
   - The added and removed lines contain no `pub`, `cfg` or `ignore`.
   - `git diff --numstat 4a2bb00...a633b02 -- frontends/shell/src-tauri/src frontends/shell/src`:
     - publish.rs: 83 insertions, 3 deletions.
     - PublishPanel.test.ts: 34 insertions, 0 deletions.
     - That is 120 lines against the 170 limit, over 2 files against the 2-file limit. No overrun.

6. **No timing assertion.** Grepping the diff's added and removed lines for Instant, elapsed, Duration, sleep and timeout finds nothing.

7. **PR CI** (`gh pr checks 149`: 6 checks, all pass). I read each run's head SHA with `gh run view`:
   - Governance CI (plan, queue, site): ran on a633b02, event `pull_request`, success. So Governance CI did run on the PR head and passed.
   - DCO sign-off: success.
   - Product CI (shell): success on both `pull_request` and `push`. Each run's cargo-test and NSIS tauri build jobs passed.
   - All five commits carry one sign-off each.

**Seam:** T3 and T4 feed the real strings into the real `nextStateFromDialogSettled` and `nextStateFromPrepareOutcome` (frontends/shell/src/publish/PublishPanel.tsx:272, :231), which call `formatPublishRefusal`. Their inputs match what I observed independently:
- T3's input is exactly T1's right-hand value from my P0 run.
- T4's input is `publish.engine: ` followed by the exact text T2 printed under M2 (and at P0).

The caller rule is not engaged, because the diff adds no `pub` item.

**Mutation table** (observations of record; none is a `verify-mutation` run)

| # | Commit | Mutation | Test | Failing assertion |
|---|---|---|---|---|
| M1 | a633b02 | deleted the `Err(BoundaryError::Publish(e))` arm (publish.rs:737) | T1 `an_execute_time_publish_refusal_carries_its_typed_code_and_a_permission_refusal_does_not` | `assert_eq` at src\publish.rs:2246: left `cancelled: no bundle exists ...`, right `publish.cancelled: cancelled: ...` |
| M2 | a633b02 | restored `EnsurePinnedOutcome::Failed(e.to_string())` (publish.rs:1078) | T2 `a_pin_phase_engine_failure_refuses_as_publish_engine` | the `strip_prefix` panic at src\publish.rs:2301: `no publish.engine prefix: source: open for hashing: ...` |
| M3 | a633b02 | PublishPanel.tsx:272, the dialog-settled refused arm: `refusal: { code: "publish-refused", message, fields: [] }` | T3 `executed/refused, execute-time typed refusal -> code publish.cancelled, ...` | `expected 'publish-refused' to be 'publish.cancelled'`; 1 failed, 41 passed |
| M4 | a633b02 | the same bypass at PublishPanel.tsx:231, the prepare-refused arm | T4 `refused, pin-phase engine failure -> code publish.engine, ...` | `expected 'publish-refused' to be 'publish.engine'`; 1 failed, 41 passed |

**Blocking:** none.

**Non-blocking**

- **N1.** The rustfmt hunk count (62 at both commits) does not catch a new line that does not conform, as long as it falls inside a hunk that already existed. That is what happened here:
  - Under default rustfmt, the new execute arm at publish.rs:737 would be reflowed.
  - It lands inside the hunk that was already there at base line 725 (the `OutcomeNotAudited` arm and the catch-all), so the count stays at 62.
  - The arm matches its neighbours' style, and CI has no fmt gate, so this is not a defect. But the worker's description of a633b02 (rustfmt applied only to the lines T1 and T2 add) should not be read as saying the product lines are rustfmt-clean.
- **N2.** The comments above T3 and T4 in PublishPanel.test.ts refer to where their strings were captured as this branch's fix commit, without the commit id (cc9c9a1). The worker's report does name it. This is the label §4 requires for T4, and the round-25 rule on naming the commit is about records, not test comments. Still, the id would make the capture traceable after merge.
- **N3.** The custodian's filing note in state/consults/2026-09-30-publish-refusal-src-tauri-worker-report-1.md says Governance CI ran on the branch only at 4a2bb00. That was true when it was filed; it has since run on the PR head a633b02 and passed (point 7).

The branch worktree C:/dev/wt/publish-refusal-src-tauri is clean at a633b02. The scratch worktree is removed and pruned.
