*Custodian's filing note (2026-10-03): lead-data's first draft for node 9 (`kernel-ticket-drop-followups`), the pilot's first measured piece, which is lead-drafted. It was written by the agent to this path itself, and returned "sha256: not computed" (C3). It is committed as written, below the rule. The hash of record of the draft as written, from this file's line 5 to the end, is 3efd28f93860c178b262ee5c4c9af73ce274ddf89ab4762464b0032f9e0aa867, computed by the custodian. The `lead-data` agent type was not loaded in this session when this draft was dispatched, so it ran as a general agent on opus under `.claude/agents/lead-data.md`'s body and tool line. The write audit passed: one Write, to this path, and no shell call. The C3 check passed. Its questions Q1 to Q3 went to the architect's consult (`state/consults/2026-10-03-kernel-ticket-drop-followups-architect-consult.md`). The consult's conditions are a draft-caused correction before commit; the revision is draft 2.*

---

# lead-data draft — kernel-ticket-drop-followups (node 9) at c9f41126

*Drafted by lead-data (the data-path lead, pilot), on the custodian's brief of 2026-10-03, under the 2026-10-03 lead-data clarification (C1 to C4). Everything here was read at main `c9f41126`. Each pin is `path:line @ c9f41126 sha256:HASH-TBD`; the custodian computes the hashes. The only quotations are code tokens byte-copied from the files they name.*

## 1. The draft

Proposed path: `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`. This is a full form, because the piece touches a stated invariant on a never-block path. No five-line form is committed for it.

````markdown
# StreamRegistry tickets — the no-drop-under-guard invariant made unwind-safe and checkable: preregistration

- **Decomposes:** PLAN node `kernel-ticket-drop-followups` (`PLAN.yaml:1558-1574 @ c9f41126 sha256:HASH-TBD`), placed by question round 31, item 1. PR #116 deferred these items when it landed: `state/gate-log.json` indices 173 and 174 (the architect's and the reviewer's attempt 2) and 176 (the architect's attempt-3 re-read). Index 177, the reviewer's attempt-3 pass, defers two of them as well. The predecessor is `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md` (DECISIONS-PENDING.md entry 132). Its record closed at the record cap (index 176 counts two record rounds), and this piece does not amend it.
- **Drafted by** lead-data on the custodian's brief, under the 2026-10-03 lead-data clarification. The inputs are listed in §0, read at main `c9f41126`. The architect gates this draft. lead-data does not review it.
- **Gating:** full form and full two-agent gating. The change touches a stated invariant, which is the stated-guarantee bullet of AUTONOMY.md §21a (`AUTONOMY.md:325-327 @ c9f41126 sha256:HASH-TBD`). It does so on the never-block path. An Out-of-scope line would therefore name a §21a category, so the template's Round 25 additions (Out-of-scope at dispatch) rule out a five-line form.
- **Committed before any code**, as its own commit.
- **Append-only once committed.** An amendment made after any outcome has been seen says so in its first line, and states what work it touches or invalidates.

## §0. Disclosure

- **Inputs, all read at `c9f41126`:**
  - the PLAN node;
  - gate-log indices 173, 174, 176 and 177;
  - the whole predecessor form;
  - from `kernel/src/skp.rs`: `StreamRegistry`, `SessionInvalidator::end_generation` and the `ticket_drop_under_lock_regression` module;
  - from `kernel/src/lib.rs`: `EngineSource` and its `Drop`;
  - the owner's index of `kernel/` and of `engine/`.
- **Not found: the gate reports behind indices 173, 174 and 176.** They are not filed in the repository at `c9f41126`.
  - The labels N3, N4 and R-S5, and the PLAN summary's reference to the architect's drafted text, occur only in `PLAN.yaml`, `CUSTODIAN-QUEUE.json`, `site/data/plan.json`, `state/CUT-STATE.md` and `state/gate-log.json`. `state/consults/gates/` holds no file dated before 2026-09-27.
  - §2's text is therefore this draft's own. It is mapped item by item to the PLAN summary, and it is not the architect's drafted text.
- **The predecessor has no §10.** It is a five-line form with a Results section and Amendments 1 and 2. This draft reads those two amendments as its amendment record.
- **Hypothesis H1 (labelled as a hypothesis).**
  - Claim: at `c9f41126`, a panic that unwinds out of `cancel` or `cancel_all_for_dataset` hangs the panicking thread, with the registry's lock still held, when `swept` or `retired` holds a `Pending` state whose `EngineSource` recorded a change at its post-check.
  - Reasoning, step 1: locals drop in reverse order of declaration. `swept` and `retired` are declared after the guard (`kernel/src/skp.rs:298-305 @ c9f41126 sha256:HASH-TBD`, `kernel/src/skp.rs:344-348 @ c9f41126 sha256:HASH-TBD`), so an unwind drops them first, while the guard is still held.
  - Step 2: `EngineSource`'s `Drop` reaches `SessionInvalidator::end_generation` (`kernel/src/lib.rs:636-641 @ c9f41126 sha256:HASH-TBD`, `kernel/src/lib.rs:592-607 @ c9f41126 sha256:HASH-TBD`).
  - Step 3: `end_generation` calls `StreamRegistry::cancel` for each of the generation's tickets (`kernel/src/skp.rs:894-898 @ c9f41126 sha256:HASH-TBD`), and that call locks the held `Mutex` on the same thread.
  - Discriminator: §4's three tests, committed before §2's code and run against the `c9f41126` code. H1 predicts that each fails by timeout (§5, P1).
- **Panic routes.**
  - The only call made under the guard that a test can make panic is `SourceCancel::cancel`, in the `Redeemed` arms of `cancel` and `cancel_all_for_dataset` (`kernel/src/skp.rs:329 @ c9f41126 sha256:HASH-TBD`, `kernel/src/skp.rs:367 @ c9f41126 sha256:HASH-TBD`). It is a call through the data plane's trait.
  - The shipped implementation of that trait, `EngineCancel` → `CancelToken::cancel` (`kernel/src/lib.rs:699-705 @ c9f41126 sha256:HASH-TBD`, `engine/src/cancel.rs:120-133 @ c9f41126 sha256:HASH-TBD`), is written not to panic.
  - Inside `mint`, `StreamHandle::mint()` calls `expect` on the OS CSPRNG (`protocol/skp/src/v0/handles.rs:19 @ c9f41126 sha256:HASH-TBD`). No test can induce that panic.
  - The piece is defensive: no run has observed an unwind under the guard.
- **Unwinding is live in shipped builds.** A search of every `Cargo.toml` in the checkout for a `panic =` key found none. The root release profile is `Cargo.toml:49-57 @ c9f41126 sha256:HASH-TBD`.
- **Fixture-drive confound:** not applicable. Nothing reads the 5 GB fixture.
- Every `path:line` in this form is a historical pin at `c9f41126`. A worker re-derives every cite it touches.

## §1. What this preregistration may and may not claim

- **May claim:**
  - The no-drop-under-guard invariant, widened as §2.1 states, holds on the return path. It also holds on an unwind that starts after a value has moved into `swept`, `retired` or `prev`.
  - Three tests prove the unwind half at the two sites where a test can start an unwind.
- **May not claim:**
  - any performance number, or any `docs/08` row;
  - anything about macOS or Linux, since the hang that is observed depends on std's `Mutex` not being re-entrant, and it is observed here on Windows only;
  - unwind-safety inside the two windows §2.6 (a) names;
  - that a test exercises the `debug_assert` (§4).
- **No wire change:**
  - no SKP literal, field, refusal code or `CancelOutcome` mapping changes;
  - no public signature of `StreamRegistry` changes;
  - no `protocol/**` file changes.
- **ADRs and principles:**
  - Full gating rests on docs/01, principle 7 (`docs/01_Principles.md:13 @ c9f41126 sha256:HASH-TBD`) and derived rule 1 (`docs/01_Principles.md:20 @ c9f41126 sha256:HASH-TBD`), and on ADR-018 Decision 1's `cancel_requested` (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:45 @ c9f41126 sha256:HASH-TBD`).
  - ADR-019 is Proposed and binds nothing (`docs/adr/ADR-019-control-plane-admission-tickets.md:3 @ c9f41126 sha256:HASH-TBD`). It is named only as the mechanism this code belongs to.
  - No ADR is amended. No operation class changes (ADR-006).
- **No performance risk.** Each method gains stack locals, and a check that compiles only with debug assertions.
- **Nothing user-visible.** The `debug_assert` message and the tests' panic messages are developer-facing.
- No new dependency, and no KNOWN-LIMITATIONS row.

## §2. The change, stated before it is applied

All of the change is in `kernel/src/skp.rs`. The PLAN summary's items map to this section as follows:
- the invariant over every value that owns an `EngineSource`, mint's refused source included → §2.1;
- declaring `swept` and `retired` before the guard → §2.2;
- the `debug_assert`, with `prev` kept alive past `drop(tickets)` → §2.3;
- the enumeration naming redeem's remove → §2.1's third bullet;
- the test doc comments naming the predecessor → §2.4.

**2.1 The invariant.** This text replaces the doc comment of the `tickets` field (`kernel/src/skp.rs:152-161 @ c9f41126 sha256:HASH-TBD`). It is drafted text, new and not a quotation. It may be reflowed to rustfmt width with its words unchanged.

    /// **Invariant (architect, PR #116 attempt 1, S1; widened by
    /// `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` §2): no `TicketState`, and no other value
    /// that owns an `EngineSource`, is dropped while this guard is held, on the return path or on an
    /// unwind.** The values, by site:
    /// - `sweep_locked`'s removed entries, moved into the `Vec` it returns (`swept` in each caller);
    /// - the `Pending` state `cancel` or `cancel_all_for_dataset` retires, moved out by
    ///   `mem::replace` (`retired`);
    /// - the `Pending` entry `redeem` removes: its `built.source` and `built.cancel` move into
    ///   `redeem`'s `Ok(..)` value, which its caller owns once the guard is released;
    /// - `insert`'s return in `mint` and `redeem` (`prev`): `None` by construction (`mint` inserts a
    ///   freshly minted [`StreamHandle`]'s key; `redeem` re-inserts the key it removed under the same
    ///   guard), and `debug_assert`ed only after the guard is released;
    /// - `mint`'s `source` and `cancel` when [`MAX_PENDING_TICKETS`] refuses them: parameters, which
    ///   drop after every local of the body, the guard included.
    /// Each method declares `swept`, `retired` and `prev` before it takes the guard, and locals drop
    /// in reverse order of declaration, so an unwind releases the guard first. On the return path
    /// each method calls `drop(tickets)` before any of them drops. Not covered: an unwind that starts
    /// inside `redeem`'s `Pending` arm between its `remove` and its `Ok(..)`, or inside `mint`'s
    /// `insert` call once `source` has moved into its argument; the calls there are std's, and none
    /// is a trait-object call.

The draft removes a claim from the current text: that each method has its own `// Entry 132` comment. The `cancel` and `cancel_all_for_dataset` comments do not carry that prefix.

**2.2 Declaration order.**
- In each of the five methods below, `swept` is declared before `self.tickets.lock()` and assigned after it:
  - `sweep_expired` (`kernel/src/skp.rs:209-215 @ c9f41126 sha256:HASH-TBD`);
  - `mint` (`kernel/src/skp.rs:219-250 @ c9f41126 sha256:HASH-TBD`);
  - `redeem` (`kernel/src/skp.rs:254-294 @ c9f41126 sha256:HASH-TBD`);
  - `cancel` (`kernel/src/skp.rs:297-340 @ c9f41126 sha256:HASH-TBD`);
  - `cancel_all_for_dataset` (`kernel/src/skp.rs:343-379 @ c9f41126 sha256:HASH-TBD`).
- In `cancel` and `cancel_all_for_dataset`, `retired` moves above the guard too, keeping its present initialiser.
- The worker chooses a form that compiles with no new rustc or clippy warning and no new `allow`.
- The order on the return path is unchanged: `drop(tickets)`, then `swept`, then `retired`.

**2.3 `prev` and the `debug_assert`.**
- In `mint` (`kernel/src/skp.rs:235-242 @ c9f41126 sha256:HASH-TBD`) and in `redeem` (`kernel/src/skp.rs:278-286 @ c9f41126 sha256:HASH-TBD`), `insert`'s return is assigned to `prev`, which is declared as `None` before the guard.
- Immediately after `drop(tickets)`, a `debug_assert!(prev.is_none(), ..)` checks it, with a message naming the method. `prev` drops last, after `swept`.
- So a firing assert panics after the guard has been released.
- In a build without debug assertions, a `Some` drops after the guard rather than under it. §2.1 makes that `Some` unreachable by construction.

**2.4 Test doc comments.** Two doc comments in the regression module refer to the predecessor as "this preregistration":
- `kernel/src/skp.rs:3148 @ c9f41126 sha256:HASH-TBD`, in the doc of `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`;
- `kernel/src/skp.rs:3295-3296 @ c9f41126 sha256:HASH-TBD`, in the doc of `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`, where the words are split across the two lines.

In each, those words become `` `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`'s ``. No claim in either comment changes. The edit is made in this piece's own diff, not as an amendment to the predecessor.

**2.5 Two doc edits in the same region.**
- **`sweep_locked`'s doc** (`kernel/src/skp.rs:170-177 @ c9f41126 sha256:HASH-TBD`) gains one sentence: each caller declares `swept` before it takes its guard, so an unwind also releases the guard first.
- **Three stale line cites in the regression module's comments** become symbol cites:
  - `kernel/src/skp.rs:2980 @ c9f41126 sha256:HASH-TBD`: the producer's `record_source_changed` call, which is at `engine/src/stream.rs:1324-1329 @ c9f41126 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:2991 @ c9f41126 sha256:HASH-TBD`: `EngineCancel`, which is at `kernel/src/lib.rs:699-705 @ c9f41126 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:3049 @ c9f41126 sha256:HASH-TBD`: `touch_modification_time` in `kernel/tests/session_generation.rs`, which is at `kernel/tests/session_generation.rs:338 @ c9f41126 sha256:HASH-TBD`.
- No other comment in the file is audited by this piece.

**2.6 Residuals: named, not fixed.**
- **(a) Two windows with no unwind protection.** In each, a value that owns an `EngineSource` lives as an arm binding or an expression temporary while the guard is held:
  - `redeem`'s `Pending` arm, from its `remove` to its `Ok(..)` (`kernel/src/skp.rs:272-287 @ c9f41126 sha256:HASH-TBD`);
  - `mint`'s `insert` call, once `source` has moved into its argument (`kernel/src/skp.rs:235-242 @ c9f41126 sha256:HASH-TBD`).

  The calls in both windows are std's (`to_string`, `Arc::clone`, `Instant::now`, `HashMap::insert`), and none is a trait-object call. No test can start an unwind in either window.
- **(b) The unwind's own failure mode.**
  - Suppose the panicking `SourceCancel` belongs to a ticket of the same generation that the dropped source then ends. During the unwind, `end_generation` cancels that ticket, and that cancel calls the same `SourceCancel::cancel` again, because the ticket's `cancelled` flag was never set.
  - A second panic there aborts the process. At `c9f41126` the same sequence hangs instead.
  - The shipped `EngineCancel` is written not to panic (§0).
- **(c) `redeem`'s `unreachable!` arm.** The value it would drop is not `Pending`, so it owns no `EngineSource`.

**2.7 Portability.** Not an OS-dependent feature, so R3's section does not apply. The tests observe a hang because std's `Mutex` is not re-entrant, and that is observed on Windows only (§1).

## §3. Fixtures / corpus — pre-declared outcomes

There is no committed fixture or corpus, so there is nothing to hash-verify.
- Each new test generates its own 50-feature GeoParquet under `target/fixtures/ticket-drop-under-lock/`, through the module's `fixture` helper (`kernel/src/skp.rs:3030-3046 @ c9f41126 sha256:HASH-TBD`).
- Each test only moves its file's modification time forward (`kernel/src/skp.rs:3052-3060 @ c9f41126 sha256:HASH-TBD`), so the run leaves the file's bytes unchanged.

| Fixture stem | Test | Tests committed first, run against the `c9f41126` code | After §2 |
|---|---|---|---|
| `unwind-cancel-swept` | T1 | fails by timeout | passes |
| `unwind-cancel-all-swept` | T2 | fails by timeout | passes |
| `unwind-cancel-all-retired` | T3 | fails by timeout | passes |

## §4. Tests, and the mutation per new test

**Common setup.** All three tests go in `ticket_drop_under_lock_regression`, after the predecessor's four.
- **Test-only types.** The module defines its own `BatchSource` stub, and a `SourceCancel` whose `cancel` panics with a message naming the test. It needs its own because the `tests` module's `synthetic_source` (`kernel/src/skp.rs:2326-2346 @ c9f41126 sha256:HASH-TBD`) is private to that module.
- **Ticket Q.**
  - Minted with the stub and the panicking cancel, then redeemed, so the registry holds it `Redeemed` and not cancelled.
  - Q is never attributed to a generation. So the generation end that the unwind triggers never cancels Q, which would make Q's cancel panic a second time (§2.6 (b)).
- **Ticket P.**
  - A real `EngineSource` over a drained stream whose post-check recorded a change (`kernel/src/skp.rs:3067-3087 @ c9f41126 sha256:HASH-TBD`).
  - Minted and attributed to its dataset's live generation, as `seeded_pending_ticket` does (`kernel/src/skp.rs:3106-3139 @ c9f41126 sha256:HASH-TBD`), but in the registries the test already holds.
  - Q is minted and redeemed before P is seeded, so no sweep removes P before the call under test.
- **The call under test** runs on a spawned thread through `run_with_timeout` (`kernel/src/skp.rs:3092-3101 @ c9f41126 sha256:HASH-TBD`), inside `catch_unwind`.
- **Each test asserts three things:**
  - the call returned within `HANG_TIMEOUT`; otherwise the test fails on a "did not return within" message that names it;
  - the call panicked, which shows the unwind happened;
  - `GenerationRegistry::ticket_liveness` of P is `EndedBySourceChange`, which shows P's source was dropped and not leaked.
- **Doc comments.** Each test's doc comment names this form by its path. It records its mutation as planned until the mutation has been observed, and the observation is recorded with its commit (§10).

**The three tests and their mutations:**
- **T1 `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard`.**
  - Setup: P is backdated past `TICKET_TTL` under the lock, as at `kernel/src/skp.rs:3203-3220 @ c9f41126 sha256:HASH-TBD`. P and Q are in different datasets.
  - The call is `cancel` on Q.
  - Mutation M1: in `StreamRegistry::cancel`, declare `swept` after the guard again, which is `c9f41126`'s order. Expected: T1 fails by timeout on its own message, and T2 and T3 pass.
- **T2 `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard`.**
  - Setup as T1. The call is `cancel_all_for_dataset` on Q's dataset.
  - Mutation M2: the same change in `cancel_all_for_dataset`. Expected: T2 fails by timeout. T1 and T3 pass, because T3's `swept` is empty.
- **T3 `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`.**
  - Setup: P is not expired, and P and Q are in one dataset D.
  - Precondition, established under the registry's lock before the call: P's key comes before Q's in the map's iteration order. While it does not, the test moves P's entry to a fresh `StreamHandle` key, at most `MAX_REKEY_ATTEMPTS` times, and otherwise fails by name. It attributes P's final key only after that.
  - The call is `cancel_all_for_dataset` on D.
  - An extra assertion: afterwards, P's entry is `CancelledBeforeRedeem`, which shows P was retired before Q's cancel panicked. If the precondition failed, the test fails by name rather than passing vacuously.
  - Mutation M3: in `cancel_all_for_dataset`, declare `retired` after the guard again. Expected: T3 fails by timeout. T1 and T2 pass, because their `retired` is empty.

**No test for six of the nine declarations.** These are:
- `swept` in `sweep_expired`, `mint` and `redeem`;
- `retired` in `cancel`;
- `prev` in `mint` and `redeem`.

No test can make a call panic between their assignment and `drop(tickets)` (§0, panic routes). The gate checks them by reading (§8, item 2).

**No test for the `debug_assert`.**
- No caller can reach its condition (§2.1). Reaching it would need a test-only seam in product code, which the caller rule forbids.
- Observation O1 instead, made once and recorded with its commit:
  - Replace `mint`'s key with a fixed string.
  - Expected: `tests::the_pending_ceiling_is_per_dataset_and_declared` (`kernel/src/skp.rs:2455-2468 @ c9f41126 sha256:HASH-TBD`) fails at the `debug_assert`'s own message on its second mint.
  - Then revert.
- O1 shows that the assert is compiled into test builds and fires. It is not a new test, and it carries no mutation of its own.

**Unchanged in code:** every test of `skp::tests` and of `ticket_drop_under_lock_regression`, with their recorded mutations.

## §5. Registered predictions · declared unchanged · invalidators · falsification

**Predictions:**
- **P1.** The three tests, committed before §2's code, each fail by timeout against the `c9f41126` code (H1).
- **P2.** After §2, T1 to T3 pass, and `cargo test -p spatial-kernel` passes with no other test changed.
- **P3.** M1, M2 and M3 each fail exactly their own test, by timeout, and leave the other two passing.
- **P4.** O1 behaves as §4 states.

**Declared unchanged:**
- The return-path drop order in all five methods: the guard, then `swept`, then `retired`, with `prev` added after them. So every swept or retired value still drops before its method returns, and ADR-018 Decision 1's `cancel_requested` instant does not move.
- Every public signature, SKP response, refusal code and `CancelOutcome`.
- The recovery of a poisoned lock in every method (`unwrap_or_else(|e| e.into_inner())`).
- The predecessor's four tests, their recorded mutations, and the predecessor's file.
- The body sentence at `kernel/README.md:177-179 @ c9f41126 sha256:HASH-TBD`. It states the `TicketState` half, which §2.1 keeps, so it stays true as written.
- Every file in `engine/`.

**Invalidators, each of which stops the piece and is reported:**
- **I1.** P1 fails: some test does not hang against the `c9f41126` code. Then the route §0 states is not what the code does. No test is weakened to fit.
- **I2.** A test can reach its unwind only through a seam in product code.
- **I3.** A test can pass only by changing the return-path order or a public signature.
- **I4.** T3's precondition cannot be established. Or it holds, and T3's `CancelledBeforeRedeem` check still fails, which would mean the map's `values_mut` order differs from its `keys` order.
- **I5.** No form of §2.2 compiles without a new warning or a new `allow`.

**Falsification:**
- **F1.** A site that neither §2.1 nor §2.6 names is shown to drop a value that owns an `EngineSource` while the guard is held, on return or on unwind.
- **F2.** With §2 applied, any of T1 to T3 aborts the process instead of returning a caught panic.

## §6. Instruments

Every quantity here is an assertion. There is no measurement, and no `docs/08` row.

| Question | Instrument |
|---|---|
| Did the call return, or hang? | `run_with_timeout`'s bounded receive, against `HANG_TIMEOUT` |
| Did the call unwind? | `catch_unwind`'s result |
| Was P's source dropped, not leaked? | `GenerationRegistry::ticket_liveness` |
| Did T3's precondition hold? | the state of P's entry, read under the registry's lock |

## §7. Declared values and ceilings

- No product constant is added or changed.
- `HANG_TIMEOUT` (5 s, `kernel/src/skp.rs:3028 @ c9f41126 sha256:HASH-TBD`) is reused. It bounds how long a hung call is waited for.
- `MAX_REKEY_ATTEMPTS = 64` is test-only and declared at its own site in the regression module. It bounds T3's re-keys.
  - Assumption, labelled: with two entries, a uniform hash puts P first about half the time on each attempt. On that assumption, exhausting the bound is about 2^-64 likely.
- **Line budget:** at most 320 insertions plus deletions in `kernel/src/skp.rs`, counted by `git diff --numstat <merge-base>..<head> -- kernel/src/skp.rs` at the head the final gate reads.
- **Files:** `kernel/src/skp.rs`, this file, and `kernel/README.md` (owner's-index lines only, per C1).
- An overrun is recorded as class 8.
- **Time budget:** 90 minutes, the PLAN node's `budget_minutes`.

## §8. Block-on-sight

1. A change to the return-path drop order in any of the five methods, other than adding `prev` last.
2. `swept`, `retired` or `prev` declared after the guard in any of the five methods. This is read at the gate, because six of the nine declarations have no test.
3. The `debug_assert` evaluated while the guard is held, or `prev` dropped before `drop(tickets)`.
4. A test-only seam, a `cfg(test)` branch, or a new `pub` item in product code.
5. A change to an SKP literal, a refusal code, a `CancelOutcome` mapping or a public signature. Or a change to any file other than `kernel/src/skp.rs`, this file, and the owner's-index lines of `kernel/README.md`.
6. A new test that does not assert its own unwind and P's drop. Or T3 without its `CancelledBeforeRedeem` check.
7. Any edit to `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`.
8. A new rustc or clippy warning, or a new `#[allow(..)]`, in `kernel/src/skp.rs`.
9. The invariant's doc comment claiming either window named in §2.6 (a).
10. A mutation recorded as observed without its commit, or a `verify-mutation` run named as the observation of a mutation (the template's Round 25 additions).
11. The owner's-index update missing from the PR, or not matching the diff (C1).

## §9. Gates

- **Architect:**
  - docs/01, principle 7 and derived rule 1;
  - ADR-018 Decision 1;
  - ADR-019, as the mechanism only;
  - the caller rule, checked against §4's test-only types;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - the declaration order, read in all five methods;
  - M1 to M3 and O1, re-observed;
  - every pin, recomputed.
- **Suites, green before either gate:**
  - `cargo test -p spatial-kernel --lib skp::`
  - `cargo test -p spatial-kernel`
  - `cargo clippy -p spatial-kernel --all-targets`, with no new warning
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`
  - `node scripts/plan/verify-quotes.mjs`
  - `node scripts/plan/verify-cites.mjs`
  - `node scripts/plan/verify-test-claims.mjs`
  - `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`
  - `node scripts/plan/verify.mjs --offline`
- **Owner's index (C1 of the 2026-10-03 lead-data clarification):**
  - lead-data writes the update once the implementation is ready, and before the final gate;
  - the worker applies it in this PR;
  - the final review checks it against the diff.
- **Operator:** none. Nothing user-visible changes, so there is no walkthrough row.

## §10. Amendments — opens empty, append-only

````

## 2. C2: is the piece confined to engine/ and kernel/?

**Yes, by paths and by contract.** One reading of a guarantee goes to the custodian as question 3.

**Paths.** The piece changes only:
- `kernel/src/skp.rs`;
- the new form;
- the owner's-index lines of `kernel/README.md`.

It touches no file in `engine/` and none outside `kernel/`.

**Contracts that another module consumes, checked at `c9f41126`:**
- **`spatial_kernel::skp::StreamRegistry`:**
  - The shell only constructs it (`frontends/shell/src-tauri/src/lib.rs:280 @ c9f41126 sha256:HASH-TBD`).
  - Every method call is inside `kernel/`: `SkpHost`, `SessionInvalidator`, and `EngineSourceFactory::redeem_or_liveness_refusal` (`kernel/src/lib.rs:545-553 @ c9f41126 sha256:HASH-TBD`).
  - No signature changes.
- **`protocol/data-plane`** reaches `redeem` only through `SourceFactory::create` on the kernel's factory. `redeem`'s return value and refusal strings are unchanged.
  - The data plane's own `StreamRegistry` (`protocol/data-plane/src/server.rs:146 @ c9f41126 sha256:HASH-TBD`) is a different type.
- **SKP behaviour, refusal codes, describe fields, bundle and wire semantics** are unchanged on every path that does not panic.
- **The one observable difference** is what happens when a `SourceCancel` panics while the guard is held:
  - At `c9f41126`, the panicking thread can hang while it holds the registry's lock. Every later ticket call then blocks: `viewport_query`, `cancel`, `close_dataset`, and redemption.
  - After the piece, the panic propagates, and later calls recover the poisoned lock. In the case §2.6 (b) names, the process aborts instead.
  - No SKP response encodes any of these outcomes.

This draft reads that difference as inside the never-block guarantee, not as a crossing contract (question 3).

**Verdict:** an in-module piece. Section 1 is a draft, not an impact read.

## 3. C1: owner's-index lines this piece will change

lead-data writes the update when the implementation is ready, before the final gate.

| Index line | Change |
|---|---|
| `kernel/README.md:353 @ c9f41126 sha256:HASH-TBD` (Stream tickets) | Gains two pins: `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard` and `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`. |
| `kernel/README.md:373 @ c9f41126 sha256:HASH-TBD` (preregistrations in this module) | Gains `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`. |
| `kernel/README.md:350 @ c9f41126 sha256:HASH-TBD` (Last verified at) | Changes only if the update re-checks every pointer at the implementation commit. Otherwise it stays `af40bbf`. |

- **`engine/README.md`'s index:** no line changes.
- **Not index lines:** the body sentence at `kernel/README.md:177-179 @ c9f41126 sha256:HASH-TBD` is declared unchanged (§5).

## 4. Measurement (C4)

**Files read for this draft.** Ranges are what was opened. "grep" means only matching lines were seen.

**Briefing and governance:**
- `.claude/agents/lead-data.md`: whole file.
- `state/directives/2026-10-03-lead-data-pilot-clarification.md`: whole file.
- `docs/PREREGISTRATION-TEMPLATE.md`: whole file.
- `.claude/agents/architect.md`: whole file.
- `AUTONOMY.md`: 306-365, plus grep.
- `docs/01_Principles.md`: 16-25, plus grep.
- `docs/adr/ADR-018-what-cancellation-acknowledged-means.md`: 39-116, plus a grep of its headings.
- `docs/adr/ADR-019-control-plane-admission-tickets.md`: 1-6.
- `KNOWN-LIMITATIONS.md`: 305-316, plus grep. No item covers this piece.

**Owner's index and module READMEs:**
- `kernel/README.md`: 340-383 (the index) and 160-184 (the body), plus grep.
- `engine/README.md`: 490-528, plus grep.

**Records of the piece and its deferral:**
- `PLAN.yaml`: 1550-1579, plus grep.
- `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`: whole file, plus grep.
- `state/gate-log.json`: lines 1-3 and 169-179 (indices 167-177).
- `CUSTODIAN-QUEUE.json`: 20-43.
- `state/CUT-STATE.md`: 44-57.
- `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md`: 240-264. This was a false lead: its N3 rows belong to Part N, not to PR #116.
- `state/questions/round-31.md`: grep only (line 13).

**Code and tests:**
- `kernel/src/skp.rs`: 80-399, 800-904, 1336-1465, 2323-2358, 2440-2533 and 2960-3429. Greps for symbols, the test list, "preregistration", line cites and lock sites.
- `kernel/src/lib.rs`: 530-706.
- `engine/src/cancel.rs`: 96-149.
- `engine/src/stream.rs`: 1184-1199 and 1316-1333, plus grep.
- `kernel/tests/session_generation.rs`: 246-263, plus a grep of `kernel/tests/` for `touch_modification_time`.
- `protocol/skp/src/v0/handles.rs`: grep with context (17-31, 49-61).
- `Cargo.toml`: 45-66, plus grep.

**Grep only:**
- `frontends/shell/src-tauri/src/lib.rs`
- `frontends/shell/src-tauri/Cargo.toml`
- `protocol/data-plane/src/`
- `state/consults/2026-10-01-catalog-open-replace-note-architect-draft.md`
- `state/consults/2026-09-26-catalog-open-drop-reproduction.md`

**Globs and repository-wide greps:**
- Globs: `state/consults/**/*ticket*`, `state/consults/gates/2026-09-2*`, `state/consults/2026-09-24*`, `scripts/plan/verify*.mjs`, `docs/adr/ADR-01[89]*`, `**/KNOWN-LIMITATIONS*`.
- Repository-wide greps: `R-S5|prev kept alive`, `redeem's remove`, `#116` under `state/`, and `panic =` across every `Cargo.toml`.

**Where the index was cited instead of re-reading the module:**
- **The other eight kernel preregistrations** (`kernel/README.md:373`) were not opened. For example, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` covers `redeem`'s caller, and that caller was read only at `kernel/src/lib.rs:545-553`.
- **The accepted-ADR list** (`kernel/README.md:372`) was taken as given. Only ADR-018 and ADR-019 were opened.
- **The declared-limits numbers** (`kernel/README.md:377`) were taken as given. KNOWN-LIMITATIONS was only searched for a ticket or unwind item, and none exists.
- **Consumed from other modules** (`kernel/README.md:365-370`) bounded the C2 read. It was then verified by grepping the shell and the data plane for `StreamRegistry`, because under C2 the index replaces rediscovery, not verification.
- **`engine/`'s interfaces** (`engine/README.md:500-514`) were taken as given. `engine/src/` was read only for:
  - `CancelToken::cancel`, to check the panic route;
  - the post-check's record site, for a stale cite.
- **The ceilings lines** (`kernel/README.md:378-382`) were not re-read, because the piece adds no ceiling.
- **The close-ordering pins** (`kernel/README.md:357`) were taken from the index. The close tests were not re-read.

**Usage:** tokens and wall time are unknown, because lead-data cannot observe them.

**Correction rounds:** none yet.

## 5. Questions to the custodian

1. **Blocking for the §2.1 wording.** The PLAN node names the architect's drafted enumeration text (index 176's N3 and R-S5), but that text is not filed in the repository at `c9f41126`. Please supply it for byte-exact use, or confirm that §2.1's own text stands.
2. **Altered guarantee.** §2.1 widens the invariant. Today it covers no `TicketState`, on the return path. The draft extends it to every value that owns an `EngineSource`, on the return path and on an unwind, and names the two windows in §2.6 (a) as residuals. Please confirm this, or order the windows closed, which needs more code in `redeem` and `mint`.
3. **Failure mode, and C2.** Under a `SourceCancel` panic while the guard is held, `c9f41126` hangs the thread that holds the lock. After the piece, the panic propagates, or in the case §2.6 (b) names, the process aborts. Please confirm this falls inside the never-block guarantee and is not an SKP behaviour change under C2.
4. **Not blocking: stale cites elsewhere in the file.** Seven more line cites in `kernel/src/skp.rs` comments fall outside the region this piece edits, at lines 515, 644, 1064, 1066, 1665, 2031 and 3478 at `c9f41126`. Two of them cite the ledger by line, and 3478 is a recorded panic message. §2.5 does not audit them. Should they be folded into this piece's Scope as class-3 cite fixes, or left alone?
