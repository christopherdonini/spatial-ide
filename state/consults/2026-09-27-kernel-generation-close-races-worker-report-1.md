*Custodian's filing note (2026-09-27): the kernel-generation-close-races worker's hand-back at the custodian's handover request (steps 1 to 6 done, the closing amendment not written; head `4682866` on `cut/kernel-generation-close-races`, local), transcribed from the hand-back message with the harness's two-space indent removed. A worker report, not a gate report. Its path-and-line cites are into the branch or the base; they are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the worker's text.*

---

I stopped at a clean point when you asked, with steps 1 to 6 done and the §10 closing amendment not written. There's one blocker: verify-test-claims fails at 4682866, and the fix needs the custodian's action on PLAN.yaml. No STOP condition fired, and nothing was pushed.

**State.** The worktree is C:/dev/wt/kernel-close-races on branch cut/kernel-generation-close-races. `git status --porcelain` is empty, the scratch directory is deleted, and no process I started is still running. `npm ci` left node_modules in frontends/shell and renderer/bundle-viewer; git ignores them.

**Commits after 4e273a6 (the preregistration):**
- 051c56f: the test-first commit, CR2 and CR4 only.
- 8c4724c: the change in §2a–§2d, plus §2e's test-side edits and the withdrawn-test row.
- 12ccbeb: CR1, CR3 and R2.
- 4682866: every observed mutation failure written into its test's doc comment, with its commit. This is the head.

**Discriminators (step 1)**
- **H1 true, so I7 does not fire.** `closeDataset` runs only in the cleanups of the `[admitted]` effect (`frontends/shell/src/App.tsx` line 1444, line 1637, line 1647 @ 3b421d5). `handleAdmitted` writes `admittedDatasetRef` before `setAdmitted` (line 988, line 201), and `setAdmitted` takes only a non-null `Admitted` (line 187). So both guards in `reportViewportOutcome` (line 1240, line 1256) drop a refusal for the old dataset.
- **H2 true, so I1 does not fire.** The catalog-writer grep finds only `SkpHost::open_dataset` (`kernel/src/skp.rs` line 1051 @ 3b421d5) and `kernel/src/main.rs` line 105, which is the binary using the raw-params factory, not `SkpHost`.
- **H3 true.** Each site needed exactly one `mint_for_open` line: session_generation's dead-ticket test, typed_terminal_codes (1), skp_admission (5) and skp_filter_cancellation (1).
- **P3 true.** At base, the non-test mint sites were skp.rs lines 536 (the branch being removed), 1118 and 1130. At the head only lines 1163 and 1175 remain, both in `open_dataset`.

**P1 and P2**
- **P1 holds.** At 051c56f, CR2 FAILED at `expect_err` (it returned `Ok`) and CR4 FAILED on its invalidated-mark assertion. So I3 does not fire, and there was no hang (I4).
- **P2.** At 4682866 every test passes (suite counts below). I did not run the full suite at base, so the "only CR2 and CR4 fail at base" half is shown only for the lib target.

**Mutations.** Each was applied, run and reverted at 12ccbeb, and each result is recorded in the test's doc comment.

| Test | Mutation | Observed |
|---|---|---|
| CR1 | minting arm restored in `live_generation` | FAILED at `expect_err` |
| the_state_is_three_valued | same | FAILED on NotOpen (`left: Ok(1)`) |
| CR2 | closing check deleted | FAILED on `map.len()` (`left: 2`) |
| CR2, extra | `begin_close` moved after `cancel_all` | FAILED at `expect_err` |
| CR3 | `unwrap_or(ObservedChange)` restored | FAILED on code (`engine.source_changed`) |
| CR4 | mark written before the live lookup | FAILED on the invalidated-mark assertion |
| R2 | closing check deleted from `attribute_ticket` | FAILED on its attribution assertion |
| E7, extra | `begin_close` removes `live` | FAILED by recv timeout |
| forget_dataset test | `st.live.remove` dropped | FAILED (`left: Ok(3)`) |
| forget_dataset test | `tickets.retain` dropped | **PASSED**: `prune_locked` masks it, recorded as such |
| never_resurrects | mint over an invalidated entry | FAILED |
| K10 | same mutation | FAILED |
| a_fresh_open | `invalidated.remove` dropped from `mint_for_open` | FAILED |

**Suites, all at 4682866 unless noted**
- `cargo test --workspace --no-fail-fast`: exit 0; 78 targets, 733 passed, 0 failed, 40 ignored.
- `cargo clippy --workspace --all-targets`: exit 0. No warning points at a line I changed; the only skp.rs warning is the existing `type_complexity` at line 243 (`StreamRegistry::redeem`).
- rustfmt: my new code is clean. The only formatting hunks that touch changed lines are two existing lines (574 and 1372 in skp.rs), and both were already flagged at base.
- `npm run verify` in frontends/shell: exit 0; 72 test files, 1087 tests; residency-trace 76 passed; citation-integrity 30 passed.
- **P4 holds.** With base's terminalShapes.ts restored (the only shell change), the counts are identical, then reverted.
- `node --test` over scripts/plan and scripts/hooks: exit 0, 315 passed.
- verify-cites, verify-quotes, verify-mutation (6 of 6) and `verify.mjs --offline`: all exit 0.
- **verify-test-claims: exit 1.** The withdrawal row is accepted and its pin recomputes, so P5 holds and I6 does not fire; the tool's commit is b82941e774a0. The one binding finding is the preregistration's own §2e item 4, which names the deleted test. It is binding because PLAN.yaml gives this node `gate: none`. An in-file row can't fix it before merge, because the pin must sit at a commit on main. The custodian needs to either set this preregistration as the node's gate, or add a post-merge pin.

**§7 count** against merge base 3b421d5, by §7's own command: 636 insertions + 141 deletions = **777 lines, against the ≤600 budget: a class-8 overrun**. Files: 9, within ≤10. Of that, skp.rs product code is +166/−71, the skp.rs test module is +374/−1, and the other test files make up the rest.

**What remains:** step 7, the §10 closing amendment. It must record the class-8 overrun and these deviations:
- `invalidate_returns_exactly_the_tickets_of_the_generation_it_ended` needed only the rename, no `mint_for_open`.
- The forget_dataset test gained a ds_b case so the `live.remove` mutation can fail.
- The mutation descriptions in the K10 and never_resurrects comments were reworded, not just renamed.
- In source_watch_ordering.rs, the module doc and the unused `SessionEndReason` import were cut after the test deletion.
- E7's doc comment names the new close order and records the extra.

Noticed but not done:
- skp.rs still says "even one no client holds" in a comment in `open_dataset`'s sink (around line 1017), which is declared unchanged.
- Some `:line` cites into skp.rs in session_generation.rs and skp.rs itself were already stale at base.

Self-check:
- No new seam; the refusal reuses the existing `SkpError::unknown_dataset` (`protocol/skp/src/v0/error.rs` line 51).
- Each observation above names its test and commit.
- No user-facing string changed.
- Every new test reaches its assertion, as the mutations show.

Model: Opus 5.5 at high effort, the escalation in the brief. I received and produced no context handoff.
