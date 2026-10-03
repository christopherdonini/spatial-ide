*Custodian's filing note (2026-10-03): lead-data's second draft for node 9 (`kernel-ticket-drop-followups`), revised to the architect's consult conditions. This is the draft-caused correction before commit. It is the first dispatch as the `lead-data` agent type (the transcript's metadata reads agentType lead-data). Written by the agent to this path itself and committed as written below the rule. The hash of record of the draft as written, from this file's line 5 to the end, is 240615fcff10a3173ded9f72921b052e2d80b4360810a8fa6a824324a8c67b62, computed by the custodian. Write audit PASS: one Write, to this path. C3 clean. The committed form, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, is the fenced block of section 1, with every `sha256:HASH-TBD` replaced by the custodian's hash of the cited lines at c9f41126 (50 pins), by script. One more change: the pin on the repository root's `Cargo.toml` (lines 49-57) is written in words, because `kernel/Cargo.toml` sits beside the form and the checkers resolve a bare `Cargo.toml` to it. Nothing else in the form is changed.*

---

# lead-data draft 2 — kernel-ticket-drop-followups (node 9), revised to the architect's consult

*Revised by lead-data (the data-path lead, pilot) on the custodian's brief of 2026-10-03: a draft-caused correction before the form is committed, under the 2026-10-03 lead-data clarification (C1 to C4). Draft 1 is `state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-draft.md` (sha256 3efd28f93860c178b262ee5c4c9af73ce274ddf89ab4762464b0032f9e0aa867, as the brief gives it). The brief adopts the conditions of `state/consults/2026-10-03-kernel-ticket-drop-followups-architect-consult.md`, which is not a gate and not Authority. Each pin is `path:line @ c9f41126 sha256:HASH-TBD`; the custodian computes the hashes. The code under `kernel/` was read in the main working tree, which the brief states is unchanged under `kernel/` since `c9f41126`. The only quotations are code tokens byte-copied from the files they name. A `..` inside a code token elides arguments, as Rust's own `..` does.*

## 1. The revised form

Proposed path, unchanged: `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`.

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
- **No architect-drafted text exists for this piece.** None is filed at `c9f41126`, and none was supplied for this form. §2.1 is this draft's own text, and nothing in this form presents it as the architect's. The parenthetical `architect, PR #116 attempt 1, S1` in §2.1's first line is carried from the current doc comment (`kernel/src/skp.rs:152 @ c9f41126 sha256:HASH-TBD`). It credits the original invariant, not §2.1's wording.
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
  - The no-drop-under-guard invariant, widened as §2.1 states, holds on the return path, and on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`.
  - Three tests prove the unwind half at the two sites where a test can start an unwind: the `SourceCancel::cancel` calls in `cancel` and in `cancel_all_for_dataset`. The `StreamHandle::mint` case rests on the declaration order, read at the gate (§8, item 2), because no test can induce that panic (§0).
- **May not claim:**
  - any performance number, or any `docs/08` row;
  - anything about macOS or Linux, since the hang that is observed depends on std's `Mutex` not being re-entrant, and it is observed here on Windows only;
  - unwind-safety on an unwind out of a std call while a value that owns an `EngineSource` is in flight under the guard (§2.6 (a));
  - that a test exercises the `debug_assert` (§4).
- **No wire change:**
  - no SKP literal, field, refusal code or `CancelOutcome` mapping changes;
  - no public signature of `StreamRegistry` changes;
  - no `protocol/**` file changes.
- **Not a crossing piece (C2 of the 2026-10-03 lead-data clarification).**
  - Behaviour changes only on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint` while the guard is held.
  - At `c9f41126` the only shipped `SourceCancel` for this registry is kernel-internal: `EngineCancel` in `kernel/src/lib.rs` (`kernel/src/lib.rs:699-705 @ c9f41126 sha256:HASH-TBD`). It is written not to panic (§0).
  - `StreamHandle::mint`'s panic route is its `expect` on the OS CSPRNG (§0).
  - `mint`, which takes the `SourceCancel`, is called only from inside `kernel/`. No other module can put a panicking `SourceCancel` into this registry, so no contract another module consumes changes.
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
    /// unwind out of `SourceCancel::cancel` or `StreamHandle::mint`.** The values, by site:
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
    /// Each method declares those of `swept`, `retired` and `prev` it uses. It declares them before
    /// it takes the guard, and locals drop in reverse order of declaration, so an unwind releases the
    /// guard first. On the return path each method calls `drop(tickets)` before any of them drops.
    /// The unwinds covered start in `SourceCancel::cancel`, the only call made under this guard
    /// through a trait object, or in `StreamHandle::mint`, which `mint` calls while `source` is still
    /// a parameter. Not covered: an unwind out of a std call while a value that owns an
    /// `EngineSource` is in flight, as in `sweep_locked`'s `filter_map(..).collect()`,
    /// `cancel_all_for_dataset`'s `retired.push(mem::replace(..))`, `redeem`'s `Pending` arm between
    /// its `remove` and its `Ok(..)`, or `mint`'s `insert` call once `source` has moved into its
    /// argument.

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
- **(a) An unwind out of a std call: not covered.** Such an unwind drops, while the guard is held, any value that owns an `EngineSource` and is then in flight as an arm binding, an expression temporary, a call argument or a partly built collection. The four known sites, as examples:
  - `sweep_locked`'s `filter_map(..).collect()`: the partly built `Vec` and the removed value it holds drop in `sweep_locked`'s own frame, before they reach `swept`, while the caller's guard is held (`kernel/src/skp.rs:193-196 @ c9f41126 sha256:HASH-TBD`);
  - `cancel_all_for_dataset`'s `retired.push(mem::replace(..))`: the argument drops if `push`'s growth panics (`kernel/src/skp.rs:353-358 @ c9f41126 sha256:HASH-TBD`);
  - `redeem`'s `Pending` arm, from its `remove` to its `Ok(..)` (`kernel/src/skp.rs:272-287 @ c9f41126 sha256:HASH-TBD`);
  - `mint`'s `insert` call, once `source` has moved into its argument (`kernel/src/skp.rs:235-242 @ c9f41126 sha256:HASH-TBD`).

  The calls at these sites are std's, and none is a trait-object call. No test can start an unwind at any of them.
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
- **F1.** With §2 applied, a value that owns an `EngineSource` is shown to drop while the guard is held, on the return path or on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`.
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
9. The invariant's doc comment claiming an unwind out of a std call (§2.6 (a)), or its bold first sentence claiming an unwind without naming `SourceCancel::cancel` and `StreamHandle::mint`.
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

## 2. Changes made, by section

Each change is one of the brief's items 1 to 5. Nothing else in the form changed. Item 6 (the optional `*cancelled = true` reordering) is not adopted, and the form does not mention it.

- **§0** (item 5): one new bullet after "Not found". It says no architect-drafted text exists for this piece, and that §2.1 is this draft's own text. It also says the parenthetical `architect, PR #116 attempt 1, S1` is carried from `kernel/src/skp.rs:152` and credits the original invariant, not §2.1's wording. That clause is there so the doc comment's provenance line cannot be read as presenting §2.1 as the architect's.
- **§1, May claim** (item 1): the unwind half is now scoped to unwinds out of `SourceCancel::cancel` or `StreamHandle::mint`, not to values already in `swept`, `retired` or `prev`. The second bullet names the two test sites, and says the `StreamHandle::mint` case rests on reading (§8, item 2). Without that, "three tests prove the unwind half" would claim more than the tests prove.
- **§1, May not claim** (item 1): "the two windows §2.6 (a) names" becomes an unwind out of a std call while an `EngineSource`-owning value is in flight (§2.6 (a)).
- **§1, new bullet "Not a crossing piece"** (item 4): gives the reason the piece is not crossing, with the pin `kernel/src/lib.rs:699-705 @ c9f41126 sha256:HASH-TBD`. Beyond item 4's text, it also names `StreamHandle::mint`'s CSPRNG `expect` and the fact that `mint` is called only from inside `kernel/`. Under item 1, the changed behaviour also covers an unwind out of `StreamHandle::mint`, so a reason that named `SourceCancel` alone would be incomplete. See question 2.
- **§2.1, bold first sentence** (item 2): "on an unwind" becomes "on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`".
- **§2.1, closing sentences** (items 1 and 3): "Each method declares `swept`, `retired` and `prev` before it takes the guard" becomes "Each method declares those of `swept`, `retired` and `prev` it uses. It declares them before it takes the guard". A new sentence names the two covered origins. "Not covered" now names any unwind out of a std call while such a value is in flight, with the four known sites as examples. The bullets by site are unchanged.
- **§2.6 (a)** (item 1): "Two windows with no unwind protection" becomes "An unwind out of a std call: not covered", with the four known sites as examples. Two of them have new pins: `kernel/src/skp.rs:193-196` (`sweep_locked`'s `filter_map(..).collect()`) and `kernel/src/skp.rs:353-358` (`retired.push(mem::replace(..))`). The closing sentence is generalised from "both windows" to "these sites", and its list of std calls is dropped, because it described only the two original windows.
- **§5, F1** (item 1): F1 now falsifies the covered scope (the return path, plus an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`), not a site list. Under the old wording, any unlisted std-call site would trip F1.
- **§8, item 9** (items 1 and 2): now blocks a doc comment that claims an unwind out of a std call, or a bold first sentence that claims an unwind without naming the two origins.
- **Report only:** the header and this report's structure. Draft 1's sections 2 to 5 are summarised in section 3 below, not reproduced.

## 3. Draft 1's other sections

- **Section 2 (C2):** the paths and contracts analysis stands. Two updates:
  - The "one observable difference" now also arises on an unwind out of `StreamHandle::mint`. At `c9f41126`, such an unwind drops `swept` under the guard.
  - The reason the piece is not crossing is now in the form's §1, and the brief closes draft 1's question 3 as not crossing.
- **Section 3 (C1 index lines):** unchanged.
- **Section 5 (questions):** the brief resolves questions 1 to 3. Question 4 is carried below.

## 4. Files read for this revision (C4)

- `state/directives/2026-10-03-lead-data-pilot-clarification.md`: whole file.
- `state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-draft.md`: whole file.
- `state/consults/2026-10-03-kernel-ticket-drop-followups-architect-consult.md`: whole file.
- `kernel/README.md`: 346-383 (the owner's index), plus a grep for its heading.
- `engine/README.md`: 495-528 (the owner's index), plus a grep for its heading.
- `kernel/src/skp.rs`: 150-384.
- `kernel/src/lib.rs`: 690-706.
- `engine/src/cancel.rs`: 96-173. This was read in the working tree; the brief does not state that `engine/` is unchanged since `c9f41126`.
- A repository-wide grep of `*.rs` for implementations of `SourceCancel`. It found `EngineCancel` (`kernel/src/lib.rs:701`), two test-only `NoopCancel`s in `kernel/src/skp.rs`, and three in `protocol/data-plane/tests/`.
- Not read for this revision: `state/directives/2026-10-03-write-audit-ruling.md`, `docs/PREREGISTRATION-TEMPLATE.md` and `.claude/agents/architect.md`. The last two were read whole for draft 1.
- **Usage:** tokens and wall time are unknown, because lead-data cannot observe them.
- **Correction rounds:** one, draft-caused (this revision, before the form is committed), as the brief classes it.

## 5. Questions

1. Not blocking: §0's pin `engine/src/cancel.rs:120-133` stops before `cancel_inner`'s `Builder::spawn` (lines 142-163 in the working tree), which the "written not to panic" reading also rests on. Widen it to 120-165? This was not changed, because it is outside the brief's list.
2. Not blocking: the §1 not-crossing bullet also names `StreamHandle::mint`'s CSPRNG `expect` and `mint`'s kernel-only callers, beyond item 4's text, so that it agrees with item 1. Strike these if they are unwanted.
3. Not blocking, carried from draft 1's question 4: should the seven stale line cites outside §2.5's region (`kernel/src/skp.rs` lines 515, 644, 1064, 1066, 1665, 2031 and 3478 at `c9f41126`) be folded into Scope as class-3 fixes, or left alone?
