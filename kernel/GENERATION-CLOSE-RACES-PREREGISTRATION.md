# Preregistration: the kernel generation close races (`kernel-generation-close-races`)

*File: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`.*

## Header

- **Authority.** PLAN node `kernel-generation-close-races`, generation 1. It is bound by, cited by round and item:
  - **Round 22, item 1** (DECISIONS-PENDING.md, RULED 2026-09-25). Paraphrase: the node comes immediately after the watcher and takes in what wave-1 A2 reports about the close race. A generation minted for a closing dataset is the defect. The unheld reference is only the containment in the meantime.
  - **Round 23, item 2** (RULED 2026-09-25, a red line). Paraphrase: the unheld session reference is containment for the close race, not a protocol feature. Once this piece lands the unheld path must be unreachable, and this piece adds a test proving it.
  - **The design these rulings sit inside:**
    - ADR-035, Decisions 2–5 and its Note 2026-09-25; the Note's item 3 names this node;
    - ADR-019, the ticket mechanism;
    - `protocol/skp/SKP-V0.md` §8, the second note to the `skp/0.3` entry, which names this node.
  - **Nothing is amended.** None of these ADRs changes, and neither does SKP-V0.
- **Drafted by** the architect agent on the custodian's brief, reading main at `3b421d5`. References are by path, symbol and section, and none carries a line.
- **Committed before any code.** It is its own commit on the piece's branch, and the branch's first commit.
- **Append-only once committed.** An amendment made after any outcome has been seen says so in its first line, the ADMISSION rule this template's Header carries. It states what work it touches or invalidates.

## §0. Disclosure

1. **Read at `3b421d5`:**
   - `kernel/src/skp.rs`, in full:
     - the registries: `StreamRegistry`, `GenerationRegistry`, `GenerationState`, `SessionInvalidator`, `EndReport`;
     - `SkpHost::{open_dataset, viewport_query, end_generation, close_dataset}`;
     - the in-crate test module `ticket_drop_under_lock_regression`, with its E5, E7, E8 and K15 tests.
   - `kernel/src/lib.rs`: `EngineSourceFactory::create_from_ticket` and `EngineSource`.
   - `protocol/skp/src/v0/error.rs`: `SkpError::unknown_dataset`.
   - `protocol/skp/SKP-V0.md` §8's second note to the `skp/0.3` entry.
   - `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`.
   - In `frontends/shell/src-tauri/src/`, `lib.rs` (the only `SkpHost::new`) and `commands.rs`.
   - In `frontends/shell/src/App.tsx`: `reportViewportOutcome`, and the effect cleanups that call `closeDataset`.
   - `state/cloud/wave1/A2.md` and `state/cloud/wave1-prompts.md` §4.
   - `state/consults/2026-09-26-source-watcher-gate1-architect.md` (Advisory, item 7) and `state/consults/2026-09-26-source-watcher-gate2-reviewer.md` (Suggestions, S1).
   - `state/CUT-STATE.md`, entry 2026-09-24T22:01Z, which carries the ADR-035 drafter's two follow-up notes.
   - `engine/SOURCE-WATCHER-PREREGISTRATION.md`: §4's E7, E8 and K10 rows, and Amendment 1 item 3.
   - `kernel/tests/*.rs`, read only at grep level (call sites of `live_or_mint`, `catalog.open` and `viewport_query`). The worker reads each touched file in full.
2. **Evidence, not Authority** (round 14's distinction, and round 15's dated non-retroactivity note).
   - `A2.md` and the two gate reports are evidence: a run's output and a gate's reading.
   - The Authority is the two rulings above.
   - A2's cites are at the wave-1 baseline `bb98f71`. They are historical and are not reused.
3. **Hypotheses.** Each is labelled, and §5 holds its discriminator.
   - **H1.** In the product, a `skp.unknown_dataset` refusal from a query racing its own close never writes the live dataset's `viewportRefusal`.
     - Why: `reportViewportOutcome`'s `forDataset` guard drops it, because `closeDataset(old)` runs in an effect cleanup after the admitted handle has moved on.
     - Discriminator: the worker reads `App.tsx` at the base and records the path. If H1 fails, the existing unknown-dataset text can surface in the race, and that goes to the human at the PR (§9).
     - Either way the change is not a regression: the base answers the same race with `engine.source_changed`, a false session-ended claim (advisory 7).
   - **H2.** No product path puts a dataset into `SkpHost`'s catalog except `SkpHost::open_dataset`.
     - Read so far: the shell's only catalog writes are through `SkpHost`, and `kernel/src/main.rs` uses the raw-params factory, not `SkpHost`.
     - Discriminator: the caller grep in §6. A product caller found is invalidator I1.
   - **H3.** Every kernel test that queries a catalog-only dataset through `SkpHost` is fixed by one added `mint_for_open` line, the shape `ticket_drop_under_lock_regression` already uses.
     - Discriminator: the post-change suite run. Anything else is invalidator I2.
4. **Readings** (the architect's, for the gates to check).
   - **(a) "Unreachable" is read as deleted.**
     - The unheld path is `GenerationRegistry::live_or_mint`'s minting branch, the only non-test `SessionRef::mint` outside `open_dataset`.
     - ADR-035 Decision 3 names the close race as its only shipped-build entry.
     - Once the race is closed, the branch would have test callers only. The caller rule forbids keeping a code path with no product caller.
     - So the branch is deleted, not guarded. Every live generation is then inserted only by `mint_for_open`, carrying the reference its caller returned to a client.
     - The type (`live: (u64, SessionRef)`) keeps round 22 item 1's invariant ("every generation carries a reference", paraphrase) enforced.
   - **(b) `close_dataset` linearizes at its new `begin_close` step (§2c).** Every racing query's outcome equals one of the two sequential outcomes (§2d).
5. **Intake, disposed.**

   | Item | Source | Disposition |
   |---|---|---|
   | Drafter note (i): a post-close `invalidate` leaves a never-removed `invalidated` mark | CUT-STATE entry 2026-09-24T22:01Z | **In** (§2a) |
   | Drafter note (ii), which is also A2 observation 1: a `viewport_query` racing `close_dataset` mints a generation for a closed name | the same entry; `A2.md`'s unproven observation 1 and its triage | **In** (§2a–§2d) |
   | Watcher gate-1 advisory 7: the mint-race fallback reports `engine.source_changed` on a close race | gate-1 architect report, Advisory 7 | **In** (§2b). It is the close race's own refusal |
   | A2 observation 2: `ticket_liveness` and `redeem` under two locks give the wrong wording, recorded S2 | `A2.md`'s unproven observation 2 and its triage | **Out** — authority below |
   | Watcher gate-2 reviewer S1: a grandparent spawn failure leaves a signal the ChecksOnly arm ignores | gate-2 reviewer report, S1 | **Out** — it concerns `open_dataset`'s arming, not a close race. A proposed node for the custodian |

   **Why observation 2 is out:**
   - Round 22 item 1 takes in what A2 reports *about the close race* (paraphrase).
   - Observation 2 needs a generation end landing between `ticket_liveness` and `redeem`. A close records no end: `forget_dataset` ends the open, not a generation (ADR-035 Decision 3, the "Close" bullet).
   - On a close, `redeem`'s "cancelled before it was redeemed" is the true answer.
   - Its S2 disposition is the custodian's record under the wave-1 severity rule (`state/cloud/wave1-prompts.md` §4; the human's instruction, RULED 2026-09-25, the cloud hooks, the wave-1 block). The rule sends an S2 to a record, not to a cut, and the node's summary is that record.
   - No ruling or standing rule adds it to this piece.
6. **Fixture-drive confound: none.** Nothing is measured, and no 5 GB fixture is read.

## §1. What this may and may not claim

- **May claim:**
  - (i) After `close_dataset` returns, the closed name has no live generation, no `invalidated` mark and no `closing` mark.
  - (ii) No ticket minted after `begin_close` stays redeemable.
  - (iii) A `viewport_query` racing `close_dataset` answers what one of the two sequential orders would answer (§2d).
  - (iv) A post-close end writes no mark and emits nothing.
  - (v) The unheld-reference path does not exist. The proof is round 23 item 2's test (CR1) plus the caller grep (§6).
- **May not claim:**
  - any performance figure, `docs/08` row, duration or cost, including for the added set lookup (ADR-018; `docs/08`'s no-numbers rule);
  - anything about A2 observation 2 or gate-2 S1;
  - a host-level interleaving between `viewport_query`'s live check and its mint. That window has no product interposition point, so its guard is proven at the registry (R2) and by §2d, not end to end (§4);
  - any change in the shell's behaviour (H1 is a reading).
- **Wire change: none.** No SKP literal (`skp/0.5` stays), member, code or message text changes. Inside existing codes, the race's answer becomes the sequential answer, `skp.unknown_dataset`.
- **Cited, none amended:** ADR-019, ADR-035 (Decisions 2–5 and the Note), ADR-010 rules 6–7, ADR-018, ADR-006, ADR-004 Amendment 4.
- **Operation classes: unchanged** (ADR-006).
- **Seam.** No new seam is written. The refusal is an existing `SkpError` the shell already receives for a query issued after a close, so the seam rule's end-to-end test is not owed. The gate checks this reading.

## §2. The change, stated before it is applied

All code changes are in `kernel/src/skp.rs`, one module.

### 2a. `GenerationRegistry`

1. **`GenerationState` gains `closing: HashSet<String>`.**
   - Documentation: names in the middle of a `close_dataset`. Set by `begin_close` and cleared by `forget_dataset`. Never pruned by time. Bounded as §7 states.
2. **`live_or_mint` is replaced by `live_generation(&self, dataset) -> Result<u64, NotLive>`.**
   - It never mints.
   - Order of answers:
     1. an `invalidated` mark: `Err(NotLive::Ended(reason))`, where the reason is the first mark (unchanged rule);
     2. a `closing` mark: `Err(NotLive::NotOpen)`;
     3. a live entry: `Ok(g)`;
     4. otherwise: `Err(NotLive::NotOpen)`.
   - New type: `pub enum NotLive { Ended(SessionEndReason), NotOpen }`. Its product caller is `SkpHost`'s mint step (2b).
   - The call to `SessionRef::mint()` in this registry is deleted.
3. **`attribute_ticket` also returns `false` while the dataset is `closing`.** Its signature is unchanged.
4. **`begin_close(&self, dataset)` is new, `pub(crate)`.** It inserts `closing` under the registry's guard.
   - It does **not** remove `live`. Ends recorded during a close still find the live generation and emit, which is ADR-035 Decision 3's close-time routes and E7.
   - Its product caller is `close_dataset`.
5. **`invalidate` marks only when it removes a live generation.**
   - The `invalidated.entry(..).or_insert(reason)` step moves after the successful `live.remove`.
   - With no live generation it writes nothing and returns `None`.
   - The first mark still stands: an already-ended dataset has no live entry, so a later call writes nothing.
6. **`forget_dataset` also removes `closing`.**
7. **Doc comments that describe minting outside `open_dataset` are corrected to the new rule.** They are on `GenerationRegistry`, `GenerationState::{live, invalidated}` and `EndReport`.
   - Symbol names keep §13 G's naming rule: no bare `generation`.

### 2b. `SkpHost::viewport_query`

1. **Its body is split, in order, into three private methods it composes, and nothing else.** Code moves at its existing indentation.
   - **(1) resolve:** `check_version`, `sweep_expired`, `catalog.get`.
   - **(2) mint:** the `live_generation` check, `build_viewport_query`, `open_engine_stream` with its pre-check end, `wrap_for_data_plane`, `tickets.mint`.
   - **(3) attribute:** `attribute_ticket`, and on `false`, the cancel and the refusal.
   - Each method's only product caller is `viewport_query`. The split mirrors `SessionInvalidator`'s `record`/`enqueue` split, which E8 drives.
   - Exact signatures follow the tree's types. They are written against the interface the tree has.
2. **The live check maps `NotLive::Ended(reason)` exactly as today.** The two existing detail strings stay byte-identical. `NotLive::NotOpen` maps to `SkpError::unknown_dataset(name)`.
3. **On attribution failure, the fallback `ended_reason(..).unwrap_or(ObservedChange)` is removed.**
   - `Some(reason)` maps to that reason's existing refusal, strings byte-identical.
   - `None` maps to `SkpError::unknown_dataset(name)`.
   - This is linearizable. A `None` means the close had begun, or had already forgotten the name.

### 2c. `SkpHost::close_dataset`

The order becomes:
1. the existing `unknown_dataset` check;
2. the watch removed and dropped (unchanged);
3. **`generations.begin_close(name)` (new)**;
4. `tickets.cancel_all_for_dataset(name)`;
5. `generations.forget_dataset(name)`, which clears `closing`;
6. `catalog.remove(name)`.

The method's ordering comment is rewritten to state this order and why.

### 2d. Linearization

Notation: v = the query's steps (resolve, live check, mint, attribute); c = the close's steps (begin_close, cancel_all, forget, remove).

| Interleaving | Before this piece | After |
|---|---|---|
| resolve after remove | `skp.unknown_dataset` | same |
| resolve before remove, live check after forget | mints a generation with an unheld reference, then a redeemable ticket (ADR-035 D3's race) | `skp.unknown_dataset`; nothing minted |
| live check after begin_close | a live check passes; a ticket minted after cancel_all and attributed before forget escapes, still `Pending` | `skp.unknown_dataset`; no stream built, no ticket minted |
| live check and mint before cancel_all, attribute after begin_close or after forget | `engine.source_changed` (advisory 7) | `skp.unknown_dataset` (or the recorded end's code, if one ended first); close cancelled the ticket |
| live check before begin_close, mint after cancel_all | attribute before forget succeeds, and the ticket escapes | attribute refuses (closing), the query cancels its own ticket, then `skp.unknown_dataset` |
| attribute before begin_close | `Ok`; close cancels the ticket; redemption refused as cancelled | same |

**Invariant after `close_dataset` returns.** The name has no `live`, `invalidated`, `closing`, attribution or dead-ticket entry. Every ticket minted for it is `CancelledBeforeRedeem`, or was never inserted. A query cancelling its own ticket may drop that ticket's source after its guard is released. If that source's post-check found a change before `forget`, it records a real end and emits, which ADR-035 Decision 3 permits. After `forget` it records nothing.

### 2e. Test-side and record-side changes

1. **Existing tests that query a catalog-only dataset through `SkpHost`** gain one `mint_for_open(name, SessionRef::mint())` line, the reference being held by the test.
   - Expected sites: `kernel/tests/skp_admission.rs`, `typed_terminal_codes.rs`, `skp_filter_cancellation.rs`, and `session_generation.rs`'s dead-ticket test (H3).
2. **Calls and comments renamed from `live_or_mint` to `live_generation`:**
   - calls in `kernel/tests/session_generation.rs` and `session_end_event.rs`;
   - comments in `source_watch_ordering.rs` (K10's recorded mutation), `typed_terminal_codes.rs` and `frontends/shell/src/testUtils/terminalShapes.ts`. These are comment-only edits.
3. **`session_generation.rs` registry tests are rewritten to the new rule** (§4, changed tests).
4. **One test is deleted:** `a_generation_minted_by_live_or_mint_carries_an_unheld_reference_and_its_end_emits` in `kernel/tests/source_watch_ordering.rs`. The path it tests no longer exists.
   - Its claim is withdrawn by one row appended to `engine/SOURCE-WATCHER-PREREGISTRATION.md`. That is the only change to that file.
   - The row is in row position, with the marker `withdrawn-test`. It pins the line of that file's Amendment 1 item 3 that claims the test, at a main commit with its sha256, which the worker computes. It carries `ruling: round 23, item 2; carrier: round 23, item 2`, in the grammar of `scripts/plan/README.md`'s WITHDRAWN section.

### 2f. Out of scope

- `EngineSourceFactory::create_from_ticket` and all of `StreamRegistry`;
- A2 observation 2 and gate-2 S1;
- `describe`, including its catalog-only `None` coverage arm, which is left as is;
- `protocol/`, `engine/`, `frontends/shell/src-tauri/`, and `frontends/shell/src/` except the one comment;
- ADR-035, SKP-V0 and KNOWN-LIMITATIONS.

## §3. Fixtures and scenarios: outcomes declared in advance

**Fixtures.** Each test generates its GeoParquet with the in-crate `fixture(name)` helper: `write_geoparquet`, 50 features, 8 average vertices, `NativeUnique`, under `target/fixtures/ticket-drop-under-lock/`.
- They are generated per run and not tracked. No claim depends on their bytes, and no new test touches their bytes or modification time. They are not hash-verified, and that is disclosed rather than skipped.

**Scenarios.** A is the dataset raced; B is a second open that stays open.

| # | Scenario | At base (test-first where it compiles) | After the fix |
|---|---|---|---|
| S1 | A query on A resolves; `close_dataset(A)` completes; the query continues | not run (the split does not exist at base); its pre-fix behaviour is shown by CR1's registered mutation | `skp.unknown_dataset`; `live` is exactly {B with B's returned reference}; no ticket; no event |
| S2 | A whole `viewport_query(A)` runs inside `close_dataset(A)`, after `cancel_all_for_dataset` releases its guard and before `forget_dataset` | **FAIL**: returns `Ok`; a `Pending` ticket for A survives the close | `skp.unknown_dataset`; no stream built, no ticket minted; no state for A; no event |
| S3 | Mint before `close_dataset(A)`, attribute after it | not run; shown by CR3's mutation | `skp.unknown_dataset`, not `engine.source_changed`; the ticket is `CancelledBeforeRedeem`; no event |
| S4 | `close_dataset(A)`, then `end_generation(A, ObservedChange)` | **FAIL**: 0 cancelled and no event, but an `invalidated` mark for A remains | 0; no mark; no event |
| S5 | Registry: `mint_for_open(A)`; `begin_close(A)`; attribute; live check; `invalidate`; `forget_dataset` | not run | attribute `false`; live check `NotOpen`; `invalidate` returns `Some` with A's reference; the live check is then `Ended`; after forget, `closing` is empty |
| S6 | E5, E7, E8, K10, K15 and the three ticket-drop tests, unedited in their assertions | pass | pass |

## §4. Tests, one mutation per new test

**Determinism: no sleeps, no spawned threads, and no timeout in any new test.** Each interleaving runs on the test's own thread.
- **(i) Step split.** `viewport_query`'s three product steps (2b) are called with a real `host.close_dataset` placed between them. This is E8's precedent.
- **(ii) The drop point.** The window inside `close_dataset`, after `cancel_all_for_dataset` releases its guard and before `forget_dataset`, is reached through the product's own drop point for a retired `Pending` ticket, the point E7 uses.
  - A test-owned `BatchSource` is minted through the real `StreamRegistry::mint`, with a no-op `SourceCancel`.
  - Its `Drop` runs the racing call synchronously.
  - No lock is held at that point: this is entry 132's drop-after-release invariant.
  - The drop point is used as a deterministic instant. The test does not claim that product code runs a query there.
- **(iii) Events.** The real bounded channel is read with `try_recv`. Every enqueue in these tests happens on the test's thread before the read, so an empty channel is a fact, not an elapsed timeout.
- **(iv) Placement.** In-crate, in `ticket_drop_under_lock_regression`, beside E5, E7, E8 and K15. Private state is read directly, the K15 precedent, and no test-only `pub` item or hook is added.

**Mutation observation (round 25, item 2 (c)).** Each registered mutation is applied, the named test is run, its failure is recorded by name in the test's doc comment with the commit it was observed at, and the mutation is reverted. `scripts/plan/verify-mutation.mjs` is a floor: it checks that a mutation is recorded, and a run of it observes nothing.

**New tests**

| Test | Scenario | Asserts | Registered mutation | Test-first |
|---|---|---|---|---|
| CR1 `the_close_race_mints_no_generation_so_no_unheld_reference_exists` (**round 23, item 2's test**) | S1 | the code is `skp.unknown_dataset`; `live` holds exactly B with `open_b.session`; the ticket map is empty; `try_recv` is empty | restore a minting arm in `live_generation` (a `SessionRef::mint()` generation on the no-mark, not-closing arm, returning `Ok`), so the call returns `Ok` and the test fails at its `expect_err` | no |
| CR2 `a_viewport_query_inside_close_is_refused_before_it_builds_or_mints` | S2 | the code is `skp.unknown_dataset`; the ticket map has exactly one entry (the fake's); for A, `live`, `invalidated`, attributions and dead tickets are empty; `try_recv` is empty | delete `live_generation`'s `closing` check, so the query mints, fails attribution and cancels itself, and the map has two entries | **yes**: at base, FAIL at `expect_err` (it returns `Ok`) |
| CR3 `a_ticket_minted_before_close_and_attributed_after_it_refuses_as_unknown_dataset` | S3 | the code is `skp.unknown_dataset`; the ticket is `CancelledBeforeRedeem`; `try_recv` is empty | restore `unwrap_or(SessionEndReason::ObservedChange)`, so the code is `engine.source_changed` | no |
| CR4 `an_end_reaching_invalidate_after_close_leaves_no_mark_and_emits_nothing` | S4 | `end_generation` returns 0; `invalidated`, `live` and dead tickets are empty; `ended_reason` is `None`; `try_recv` is empty | restore marking before the live lookup in `invalidate` | **yes**: at base, FAIL on the `invalidated` assertion |
| R2 `a_closing_dataset_refuses_new_attributions_but_still_records_an_end` | S5 | as in S5 | delete `attribute_ticket`'s `closing` check, so attribution returns `true` | no |

**Recorded extras** (observed, not registered):
- In CR2: move `begin_close` after `cancel_all_for_dataset`. The query returns `Ok`, and CR2 fails at `expect_err`.
- In E7: make `begin_close` remove `live`. E7 times out with no event.

**Changed tests** (names kept unless stated). Each changed assertion's mutation is re-observed.
- `session_generation.rs`:
  - `the_state_is_three_valued_never_minted_is_not_invalidated`: a never-opened name answers `NotOpen` repeatedly and mints nothing. Mutation: CR1's.
  - `a_fresh_open_clears_an_earlier_invalidation_because_that_is_what_reopening_is`: rename only.
  - `live_or_mint_never_resurrects_an_invalidated_generation` is renamed `live_generation_never_resurrects_an_invalidated_generation`. It is not claimed in any tracked record.
  - `invalidate_returns_exactly_the_tickets_of_the_generation_it_ended`: adds `mint_for_open` where it relied on minting.
  - `forget_dataset_removes_the_generation_the_invalidation_and_every_attribution`: after forget, the answer is `NotOpen`, and a reopen is `mint_for_open`. Its recorded mutation is re-observed.
  - `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`: one `mint_for_open` line, if H3.
- The one-line `mint_for_open` sites of 2e item 1.
- The comment and call renames of 2e item 2.

**Deleted:** the Amendment-1 test (2e item 4), with its `withdrawn-test` row.

**Suites (§9):** the whole kernel suite; the shell suite (`npm run verify`), because of the comment edit.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions** (a wrong one is a result, class 2):
- **P1.** CR2 and CR4 fail at base on their named assertions (§3).
- **P2.** After the fix, every new, changed and existing kernel test passes. The only failures between base and fix are CR2 and CR4.
- **P3.** The caller grep (§6) finds `SessionRef::mint` in non-test kernel and src-tauri code only in `SkpHost::open_dataset`: two sites, the Watching arm and the ChecksOnly arm.
- **P4.** The shell's test count and results are identical to base.
- **P5.** `verify-test-claims` accepts the withdrawal row. Its tool commit is named in the record, per round 15 (c).

**Declared unchanged:**
- `protocol/**`, `SKP_VERSION`, `engine/**` and `frontends/shell/src-tauri/**`;
- `frontends/shell/src/**` except the one comment;
- `StreamRegistry`, `create_from_ticket`, `EngineSource`, the event payload and queue, and `open_dataset`;
- `describe`'s answers;
- E5, E7, E8, K10, K15 and the ticket-drop tests' assertions;
- ADR-035, SKP-V0, KNOWN-LIMITATIONS and docs/01.

**Invalidators** (stop and return to the custodian):
- **I1.** A product caller of the minting branch, other than the race, is found (H2).
- **I2.** A kernel test outside §4's list fails, or one of H3's sites needs more than the one `mint_for_open` line.
- **I3.** CR2 passes at base: the escape does not reproduce, so §2d's table is wrong.
- **I4.** CR2's call inside the drop hangs: a guard is held across the drop point, an entry-132 S1.
- **I5.** E7 or E8 fails after the fix.
- **I6.** `verify-test-claims` refuses the row's citation. That becomes a question for the human.
- **I7.** H1 is false. This does not stop the code, but it goes to the human at the PR.

**Falsification.** This whole preregistration is wrong if, after `close_dataset(A)` returns:
- a ticket for A is still `Pending` or redeemable, or
- `GenerationState` holds any entry for A, or
- a generation exists whose reference `open_dataset` never returned.

## §6. Instruments (all assertions, no measurements)

1. The typed codes and the registry state in §4, read in-crate.
2. The caller grep: `git grep -n "SessionRef::mint" -- kernel/src frontends/shell/src-tauri/src`, read against the test-module boundary. P3.
3. The catalog-writer grep: `git grep -nE "\.open\(|open_cancellable\(" -- frontends/shell/src-tauri/src kernel/src`. H2.
4. Test-first runs at the test-only commit, and mutation runs, each recorded with its commit (§4).
5. `verify-test-claims`, `verify-cites`, `verify-quotes` and `verify-mutation`, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings

- **No new constant.** The `closing` set's bound is structural: at most one entry per `close_dataset` call in progress, plus the residual of a close that unwinds between `begin_close` and `forget_dataset`. That residual leaves the name refused as `NotOpen`, which is what the caller asked for. No RAII guard is added. It is not pruned by time, because a timer could let a closing name answer again. This is ADR-010 rule 6: declared, not discovered.
- **Line budget: ≤ 600 changed lines. File count: ≤ 10.**
  - Counted as insertions plus deletions (§21c's rule).
  - Counting command: `git diff --numstat <merge-base>...<head> -- . ':!kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`. The line figure is the sum of the first two columns, and the file figure is the row count.
  - `<merge-base>` is the branch's merge-base with main, and the closing amendment names it.
  - The withdrawal row counts.
  - An overrun is recorded as class 8 (round 25, item 2 (a)), and this line is never edited to match.
  - Estimate: about 140 product lines, 260 new-test lines, 80 changed-test lines, 50 deleted, and about 10 comment lines.

## §8. Block-on-sight

1. Any sleep, `recv_timeout`, spawned thread or timing-based wait in CR1–CR4 or R2.
2. Any new `pub` item without a product caller. `begin_close` must be `pub(crate)`. The step methods must be private. `NotLive`'s caller is the mint step.
3. Any test-only hook, `cfg(test)` branch in product code, or callback or option added for the tests.
4. Anything that inserts into `live` other than `mint_for_open`, or any `SessionRef::mint` in non-test kernel code outside `open_dataset`.
5. `close_dataset` in any order other than §2c's, or `begin_close` removing `live`.
6. `invalidate` writing a mark without removing a live generation.
7. Any of the following:
   - a race-path refusal coded `engine.source_changed` or `engine.source_coverage_lost` without a recorded end;
   - any new code, message text, member or literal;
   - any change to the existing detail strings;
   - any diff under `protocol/`, `engine/` or `src-tauri/`;
   - any shell diff beyond the one comment.
8. Any change to `StreamRegistry` or `create_from_ticket`, which would be the out-of-scope work of §0 item 5.
9. The assertions of E5, E7, E8, K10, K15 or the ticket-drop tests edited. Comment-only edits naming the new order are allowed.
10. A test deleted other than the Amendment-1 test; that deletion without its row; or any edit to `engine/SOURCE-WATCHER-PREREGISTRATION.md` beyond appending the one row.
11. A record calling a `verify-mutation` run an observation, or an observation without its commit (round 25, item 2 (c)).
12. A §7 overrun not recorded as class 8, or §7's line edited (round 25, item 2 (a)).
13. Any code of a scope addition before its class-9 amendment (round 25, item 2 (a)).
14. Record-form failures:
    - a line cite into `DECISIONS-PENDING.md`;
    - a verbatim passage not byte-copied by script and marked;
    - a hash reference at a branch commit (round 15 (e));
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id (round 25, item 2 (d));
    - a bare self-line (round 14).
15. ADR-035, SKP-V0.md or docs/01 edited.
16. A squash or rebase merge (round 26, item 3).
17. A symbol named with the bare word `generation` (§13 G).

## §9. Gates

- **Architect:**
  - ADR-019, and ADR-035 Decisions 2–5 and its Note;
  - round 22 item 1 and round 23 item 2;
  - the caller rule and the seam reading (§1);
  - docs/01 principle 8, since advisory 7 was a false diagnosis;
  - ADR-010 rules 6–7 and ADR-018;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - the test-first and mutation observations re-run;
  - §7 recounted by its command;
  - the row's pin recomputed;
  - H1–H3 read.
- **Suites, green before either gate:**
  - `cargo test --workspace` (at least the kernel), `cargo clippy`, and `cargo fmt --check` on the changed files;
  - `npm run verify` in `frontends/shell`;
  - `node --test` over `scripts/`;
  - `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify --offline`;
  - branch CI read before gating.
- **Operator:** none. No user-visible string or felt behaviour changes. If H1 fails, it goes to the human at the PR.

## §10. Amendments

*Opens empty and is append-only. The classes are `docs/PREREGISTRATION-TEMPLATE.md` §10's classes 1–7 and its Round 25 additions, classes 8–9.*
