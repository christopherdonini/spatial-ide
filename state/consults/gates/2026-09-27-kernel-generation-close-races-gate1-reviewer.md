*Custodian's filing note (2026-09-27): gate 1, attempt 1 (reviewer), full gating, of PLAN node `kernel-generation-close-races`. Reviewed: cut/kernel-generation-close-races @ af77861a6123576184c9d34071ddfb47b794374d (from the report's own first line; the full id from the branch). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cut/kernel-generation-close-races @ af77861

**Verdict: Correctness PASS. Evidence PASS, with one medium item (E1). Documentation FAIL on two blocking findings (D1, D2).**

Three-dot diff: merge-base bfb436d, 12 files. Main moved to 7132bdc during the review, in state/PLAN/queue/site files only, so the diff range is unchanged. `git status --porcelain` in C:/dev/wt/kernel-close-races is empty at the end, and HEAD is back at af77861. Every mutation was reverted with `git checkout -- kernel/src/skp.rs`. The test-first run was made on a detached checkout of 051c56f and the observation run on ecc4a37; after both I returned to the branch. The scratch clone is deleted.

## Blocking

**D1 (Documentation/Evidence). The prereg's own claim of the deleted test will turn main red when the node is marked done.**
- Where: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2e item 4 (line 173, byte-identical at d4245fe) names `a_generation_minted_by_live_or_mint_carries_an_unheld_reference_and_its_end_emits`.
- Why it only fails later: `verify-test-claims` @ b82941e exempts a gate file's claims only while its node's status is not `done` (the PLANNED vs BINDING header of `scripts/plan/verify-test-claims.mjs`). Today it prints "planned — node kernel-generation-close-races is in-progress".
- Proof: I ran `runVerifyTestClaims({plannedGates: new Set()})` at af77861, which is what the tool sees once the node is done. It returns exactly one binding finding: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:173`.
- The worker flagged this (worker-report-1, line 51 @ d4245fe). Setting the node's gate only defers it. Amendment 2 neither records nor routes it: row 11 routes lines 62-64 only, and the summary of `kernel-close-races-followups` does not mention it.
- Fix, available before merge because d4245fe is on main: add an appended class-1 correction row in row position:
  `- withdrawn-test: \`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:173\` @ d4245feaef1ed94a4947bd2b2d1df9cc91a1a610 sha256:031d3e86cedbb35e45658ea006e0e23160d1291eb40c403ab5b91b92d68c8242; ruling: round 23, item 2; carrier: round 23, item 2`
- I tested that row in a scratch clone at af77861 with the planned set empty: 0 findings, and the row is accepted as withdrawn.

**D2 (Documentation, the record cap, by name). Amendment 2 row 10, second bullet, restates its own pinned span.**
- Text: "It is clean neither at `0ada14f` nor at the head. No file's hunk count rises."
- This is prose restating a claim the pinned `state/consults/2026-09-27-kernel-close-races-suites-76f92ba.md:230-258 @ bfb436d` already carries in its table.
- Related: the next sentence, "include the one-line form…", is true but partial. The span also lists product lines skp.rs 1341, 1343 and 1377, session_generation.rs 23 and 351, and source_watch_ordering.rs 19.
- Fix: in the same appended correction as D1 (at most three sentences, not an in-place edit, per round 15 (f)), withdraw those sentences in favour of the span.

## Checks re-run

**Test-first at 051c56f** (`cargo test -p spatial-kernel --lib`: 121 passed, 2 failed, which is P1 plus the lib half of P2):
- CR2 FAILED at `expect_err` (skp.rs:3124): `a viewport_query inside close_dataset is refused: ViewportQueryResponse { stream: StreamHandle("sh_090b…"), expires_in_ms: 30000 }`.
- CR4 FAILED at skp.rs:3164: `a post-close end writes no invalidated mark`.

**Mutations at af77861** (each applied, run and reverted):

| Test | Mutation | Failure |
|---|---|---|
| CR1 (round 23 item 2's test) | minting arm restored on `live_generation`'s no-mark, not-closing arm | at `expect_err` (skp.rs:3470), `Ok(ViewportQueryResponse{..})` |
| `the_state_is_three_valued_never_minted_is_not_invalidated` | same | `left: Ok(1)`, `right: Err(NotOpen)` |
| CR2 | `closing` check deleted | `only the drop-point ticket: the racing query minted none`, `left: 2` |
| CR3 | `unwrap_or(ObservedChange)` restored | `left: "engine.source_changed"` |
| CR4 | mark written before the live lookup | `a post-close end writes no invalidated mark` |
| R2 | `attribute_ticket`'s `closing` check deleted | `a closing dataset attributes nothing` |

All match the doc-comment records made at 12ccbeb.

**Amendment 1, 1.3 re-made at ecc4a37** (`cargo test -p spatial-kernel --no-fail-fast`, rc 101): 37 targets, 290 passed, 8 failed, 28 ignored.
- The failures are the seven `skp_projection.rs` tests plus `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too`, each with `skp.unknown_dataset`, and nothing else fails.
- The panic lines are identical to the observation of record.

**Kernel suite at af77861**: `cargo test -p spatial-kernel --no-fail-fast` exits 0, with 37 targets, 298 passed, 0 failed, 28 ignored. That is P6: the only change from ecc4a37 is the eight tests. No timing flake.

**§7 recount** (its own command):
- af77861 against its merge-base bfb436d: 645 + 141 = 786 lines, 11 files.
- 0ada14f...76f92ba: 786 lines, 11 files, the same.
- The prereg's history from 4e273a6 to HEAD adds lines only, so §7 is unedited. Row 8's class-8 form is per the template's class 8: the first-line words, declared and final figures, the command's commit, and the reason. The overrun is accepted as disclosed.

**Withdrawal row pin**: `engine/SOURCE-WATCHER-PREREGISTRATION.md:482 @ 3b421d5` recomputes to 0bfcf2dc…a1372fb and matches. 3b421d5 is on main, the line names the test, and `verify-test-claims` accepts the row. The file's only change is that one appended line.

**Amendment 2 hashes**: all 22 recomputed spans match, at d4245fe, 188b1f8 and bfb436d, all three on main. I read each span, and each says what its row claims.

**H1–H3 against the tree**:
- H1 holds. `closeDataset` runs only in the `[admitted]` effect cleanups (App.tsx 1444, 1637). `handleAdmitted` writes `admittedDatasetRef` (988) before `setAdmitted`, so both `forDataset` guards (1240, 1256) drop the old dataset's refusal.
- H2 holds. The catalog writers are `SkpHost::open_dataset`'s `open_cancellable` (skp.rs:1097), the raw-params binary (main.rs:105) and tests.
- H3 holds for the §2e sites, and for B1's eight via Amendment 1.
- P3 holds. `SessionRef::mint` appears at skp.rs 1164 and 1176, inside `open_dataset` (1025–1190); every other hit is after `#[cfg(test)]` (2045).

**Amendment 1, block-on-sight 18**:
- 76f92ba is exactly 8 insertions in 2 files. Each line has 1.2's form, sits directly after its `SkpHost::new(..)` statement, and uses the handle in 1.2's table.
- The only delta from ecc4a37 to 76f92ba is the prereg plus those 8 lines.
- At ecc4a37 neither file has a `mint_for_open` line, so "no code before the amendment" resolves, and e2528ea precedes 76f92ba.

**Amendment 1, block-on-sight 19 and 1.5**: `git show --cc ecc4a37` only threads B1's `(query, projection)` and `viewport_query_build_error_of`. The mint step runs, in order: live check, then `build_viewport_query` refusals, then `open_engine_stream(ds, &query, projection.as_ref())`, then wrap, then mint. That is main's order. No projection refusal can be reached after the stream opens.

**§8, items 1–17**: all clear.
- No sleep, `recv_timeout`, spawned thread or timing wait in CR1–4 or R2.
- `NotLive` is `pub` and its caller is the mint step. `begin_close` is `pub(crate)`. The step methods are private.
- No `cfg(test)` in product code. `live.insert` appears only in `mint_for_open`.
- `close_dataset` runs in §2c's order. `invalidate` marks only after `live.remove`.
- No new code, string, member or literal. No diff under protocol/, engine/ (except the one row) or src-tauri/, and the shell diff is one comment.
- `StreamRegistry` is untouched. E7's and K10's edits are doc-only. The only deletion is the Amendment-1 test, and it has its row.
- No `DECISIONS-PENDING` line cite and no bare self-line. No bare `generation` symbol.

**Discharge/done clauses**: the only one is row 11's "routed and not done". The node it routes to exists on main at c4300c9.

**Round 25**:
- Class 8 and class 9 are correctly recorded.
- No record calls a `verify-mutation` run an observation.
- Test text is named by commit id (051c56f, 12ccbeb, 4682866) and is never hash-pinned at a branch commit.
- This is the full form, so §21d does not apply.

**Correctness**: I found no defect.
- §2d's rows hold as coded. A ticket a query mints after `cancel_all` is refused at attribution, either on `closing` or on the removed live generation, and the query cancels it. A post-close end writes nothing.
- A reopen during a close cannot collide, because handles are minted per open.
- The seam reading holds: the refusal is the existing `skp.unknown_dataset`.

## Medium (Evidence, not blocking)

**E1. Branch CI never ran at af77861, and the last governance run on the branch failed.**
- Cause: the push from 00c3807 to af77861 touches only `state/**`, and the path filters skip it.
- The last Governance CI (run 36353113673 at 00c3807) failed `verify-cites` on 13 cites into the two state/consults files, which were not yet on the branch. The merge af77861 brings those files in.
- Locally at af77861 everything passes: verify-cites @ 522e448, verify-quotes @ f9444a4, verify-test-claims @ b82941e, verify-mutation @ 7d24ed1 (`--base bfb436d` and `--base 0ada14f`, 6/6), and verify.mjs @ db9d20b `--offline`. `node --test` gives 349/349.
- Fix: run governance-ci (and product-ci-rust) at af77861 with `workflow_dispatch`, or read the PR's run, before merge.

## Suggestions

- **S1.** The skp.rs:1066-1067 comment ("even one no client holds") is now false. It is routed and fine. ADR-035's Decision text (line 60) still describes `live_or_mint` as a shipped path. §2f keeps ADR-035 out of scope, so this is the architect's call: consider a dated, appended ADR-035 note via the followups node.
- **S2.** Row 7's P4 "at the head" pins a diff-stat (one comment in a `.ts` testUtils file), not a count comparison. The inference is sound, but saying it is structural would be clearer: the shell count is 1090 at the head against 1087 at 4682866 because main moved.

## Nits

- **N1.** The withdrawal row sits under SOURCE-WATCHER's Amendment 7 heading (the E5 pin) and points to this piece only through its riders. The form forbids a new heading, so this is acceptable.
- **N2.** E7's doc comment, "removal, `begin_close`, cancel, forget order": "removal" means the watch removal, and reads ambiguously beside `catalog.remove`, which runs last.

Relevant files: C:/dev/wt/kernel-close-races/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md, C:/dev/wt/kernel-close-races/kernel/src/skp.rs, C:/dev/wt/kernel-close-races/engine/SOURCE-WATCHER-PREREGISTRATION.md, C:/dev/wt/kernel-close-races/scripts/plan/verify-test-claims.mjs
