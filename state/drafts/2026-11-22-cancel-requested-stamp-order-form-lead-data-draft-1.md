# lead-data's draft 1 of the cancel node's full form (cancel-requested-stamped-before-the-flag-and-the-attempts-wrappers), its final message as handed back; superseded by the revision ADV-2026-11-22-04 asks for

*Filed by the custodian from lead-data's subagent transcript (its last long text, at 2026-11-22T04:26:43.948Z), 33987 bytes, sha256 daeca989a02d4107c13aad5bf9c8aa8c09e5a4f32391e4607a2a2d4886da7ab4, below the rule unchanged. Its brief: the custodian's scratch file brief-cancel-form.md, 7281 bytes, sha256 ed99df7428fe30f709c6984f51e96afd9af91ccf9f81299b58e7db571ed3e476. A draft, never Authority; its sha256 placeholders are filled only in the committed form.*

---

Result: I drafted the full form for `cancel-requested-stamped-before-the-flag-and-the-attempts-wrappers` (below, whole). It is read only, from the main checkout at 662ea259eac2e5fd1f47e83cbee0eea3d17430b5.
Blocking question Q1: ADR-018:45 and kernel/CANCELLATION-AND-TRACING.md:48 define cancel_requested as the moment the call returns. Read literally, a producer stamp before the request stamp is not a defect, so the ordering assertion (question (b)) depends on a reading of the ADR. Is that reading recorded on the form for the architect to gate, or does it need an ADR-018 amendment for the human?
Report path: state/consults/2026-11-22-cancel-requested-stamp-order-form-lead-data-draft.md
sha256: not computed. I have no hashing tool and write no file, so the custodian's filing script computes it from the bytes it files.

---

# The cancel tests' node: CANCELLATION_REQUESTED stamped before the cancelled flag is published, and the two ATTEMPTS wrappers (full form)

- **Path (proposed):** `governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `cancel-requested-stamped-before-the-flag-and-the-attempts-wrappers`, its whole summary. It is cited by id, because at this read it was in the main checkout's working tree and not yet at a commit.
  - The human's message of 2026-11-22, item 1: `state/directives/2026-11-22-the-humans-message-the-idle-time-work-flaky-tests-are-findings-the-cancel-node-subagent-compaction-guardian-and-monitor-a-property-testing-trial.md:17-24` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>. Its testing paragraph is at `:49` of the same file @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>.
  - ADV-2026-11-22-01, items 2, 3, 8, 9 and 10, issued under the human's delegation of 2026-11-13. It is the advisor's ruling, not the human's words: `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-01-the-pieces-of-the-humans-message-placed-the-two-drafts-filed-on-main-before-their-ids.md:16-27` and `:43-47` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>.
  - The finding is ledger entry 1122b in `state/CUT-STATE.md`, cited by entry and not by line (round 14 (a′)): the test `cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock`, revision 624eb45cd4df328ff1acdc9c1e58eb1c75d36339, five of five attempts, Product CI Rust run 44461774255.
  - This node replaces ADV-2026-11-21-15 item 3 (iii), the cancel test (h): `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md:18` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>.
- **Drafted by** lead-data, read only, on the custodian's brief (`brief-cancel-form.md`, 7281 bytes, sha256 ed99df7428fe30f709c6984f51e96afd9af91ccf9f81299b58e7db571ed3e476; a scratch file and evidence only, never Authority). The draft was read at main 662ea259 (`.git/refs/heads/main`). Every `@ 662ea259…` below is a historical pin. For what this form read, the pin is authoritative. For the code a commit edits, that commit's base tree is authoritative.
- **Hashes.** Every `sha256:<custodian-script>` is filled in by the custodian's script before this form is committed. The drafter computed none.
- **Committed before any code.** The form is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Form and gating:** full form, full gating from dispatch, reviewer and architect, under AUTONOMY §21a, for two reasons. First, it changes a cancellation guarantee's instrument (ADR-018's instants) and properties currently under test: the two trace promises and the kernel ordering checks. Second, it is concurrent code under the trace's frozen measurement semantics (`kernel/CANCELLATION-AND-TRACING.md` §2). It is also over §21c's size (§7). No five-line form is possible.
- **Merge:** prepared and gated now, merged only after the v0.2 tag (the human's message, item 0, Merges; the same item 1). Before that merge, the branch is checked for changes that reached main after the gates in the files this form names. The check is recorded in the closing amendment.

## Isolation: the piece's first record (ADV-2026-11-22-01 item 9)

The custodian's check, byte-copied from the custodian's brief. The custodian confirms it against the run by script when filing:

```
2026-11-22T04:13:51Z
main target: LINK Junction -> D:\spatial-ide\target
main shell target: LINK Junction -> D:\spatial-ide\shell-target
worktree top: C:/dev/wt/cancel-stamp
C:/dev/wt/cancel-stamp/target: ABSENT
C:/dev/wt/cancel-stamp/frontends/shell/src-tauri/target: ABSENT
C:/dev/wt/cancel-stamp/target/fixtures: ABSENT
build folder D:/wt-targets/cancel-stamp: PLAIN D:\wt-targets\cancel-stamp
ISO-OK
```

- Worktree `C:/dev/wt/cancel-stamp` on branch `cut/cancel-stamp-order`, from 662ea259eac2e5fd1f47e83cbee0eea3d17430b5.
- Build output `D:/wt-targets/cancel-stamp`, given as `CARGO_TARGET_DIR`.
- The kernel and engine tests create their own fixtures under `<worktree>/target/fixtures`, from `CARGO_MANIFEST_DIR/../target/fixtures`:
  - `kernel/tests/skp_filter_cancellation.rs:43-46` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>;
  - `engine/tests/slice.rs:24-27` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>.
- Re-check (paraphrase of a draft step). After the first test run, and before any campaign run (§4.4), the worker records that `C:/dev/wt/cancel-stamp/target` and `C:/dev/wt/cancel-stamp/target/fixtures` are plain folders and not links. The same check names their resolved paths. A link, or a path that resolves into `D:\spatial-ide\target` or the sitting's fixtures, stops the piece before any further build.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run, and nothing has been measured. The 5 GB fixture is not used. The cause this form starts from is the one the test's own comment gives (`kernel/tests/skp_admission.rs:766-778` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>) and the one the human's item 1 names: `cancel_inner` publishes the flag (`engine/src/cancel.rs:133`) before it stamps (`:134-136`), all @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>. This is labelled **hypothesis H1**. Its discriminator is §4.1's controlled interleaving, red at C1 and green at C2. The campaign in §4.4 is supporting evidence only (the human's item 1; ADV-2026-11-22-01 item 3).

**0.2 The reuse index (the standing step).** These are the custodian's runs in the read-only reuse clone at 89bbac37, byte-copied from the custodian's brief. The custodian confirms them against the run by script:

```
$ node tools/reuse.mjs cancellation trace stamp order
No prior art recorded for "cancellation trace stamp order". Research it before planning an implementation.
exit 1
$ node tools/reuse.mjs atomic flag happens-before trace
No prior art recorded for "atomic flag happens-before trace". Research it before planning an implementation.
exit 1
$ node tools/reuse.mjs controlled interleaving loom test
No prior art recorded for "controlled interleaving loom test". Research it before planning an implementation.
exit 1
```

All three missed. The misses are recorded and do not block. Nothing is ported and no dependency is taken. A model checker such as the one the third query names is outside scope, because it would be a dependency (§1).

**0.3 The interfaces as read** (the seam rule; all @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>):
- `CancelToken::cancel` → `cancel_inner(true)`; `cancel_for_drop` → `cancel_inner(false)`; `cancel_inner`: `engine/src/cancel.rs:108-177`. `is_cancelled` is a SeqCst load at `engine/src/cancel.rs:179-181`.
- Two Dekker pairs with `in_execute`:
  - `execute_guarded` stores `in_execute` and then loads `cancelled` (`engine/src/cancel.rs:194-199`);
  - `cancel_inner` stores `cancelled` and then loads `in_execute` (`engine/src/cancel.rs:133`, `:152`).
  - `attach` loads `cancelled` under the slot lock (`engine/src/cancel.rs:250-268`).
- The only caller of `cancel_for_drop` is `BatchStream::drop` (`engine/src/stream.rs:898-908`).
- `trace::mark` is a Relaxed load of `ENABLED`. Then `mark_cold` locks `CURRENT`, and `Trace::push` reads the clock before it locks the event buffer (`engine/src/trace.rs:149-165`, `:301-316`). `Trace::events` sorts by offset (`engine/src/trace.rs:189-197`). `Trace::first` is name-global (`engine/src/trace.rs:199-202`). The trace is a single process-wide slot (`engine/src/trace.rs:90-98`; `kernel/CANCELLATION-AND-TRACING.md` §7, first bullet).
- Every `PRODUCER_CANCELLED` stamp on the producer side follows a SeqCst load of `cancelled` that read true:
  - `engine/src/stream.rs:1794-1797`, `:1846-1848` (the guard's own load), `:1898-1901`, `:2548-2556`;
  - `classify`: `engine/src/stream.rs:2636-2639`.
- The kernel tests:
  - `kernel/tests/skp_admission.rs`: the wrapper at `:779-801`, its struct at `:750-755`, its doc at `:766-778`, the body at `:803-950`;
  - `kernel/tests/skp_filter_cancellation.rs`: the wrapper at `:122-143`, its struct at `:91-99`, the body at `:145-282`.

## §1. What this preregistration may and may not claim

- **May claim:** an ordering in the engine's code and the proof of it under the tests named in §4. That ordering is: the request stamp's clock read happens-before the cancelled flag's publication, and so happens-before any observer's stamp taken after a load of that flag. The form may also claim that the two trace promises and the existing token guarantees named in §5 are kept. It may claim the counts of the §4.4 campaign, as counts.
- **May not claim:**
  - any performance figure, `docs/08` row or latency, and no change to the budgeted interval's value;
  - that the CI failure at 624eb45c had cause H1. The interleaving test shows that H1 can produce the inversion and that the fix removes that path. It cannot show which path produced a past CI run (§5.4).
- **ADR-018 and the design note are cited, never amended.** ADR-018 item 1's row (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:45` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>) and `kernel/CANCELLATION-AND-TRACING.md:48` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script> both define `cancel_requested` by the call's return.
  - The code stamps inside the call today, before the interrupt and before the return. The fix stamps earlier still, before the flag is published.
  - Whether that reading needs an amendment is OPEN-1 (see the last section). It is a question, not this form's decision. Until it is settled, neither text and no doc comment that restates it (`engine/src/trace.rs:370-371`) is edited.
  - In this paragraph's own words, a paraphrase: stamping earlier widens the budgeted `cancel_requested → cancel_observed` interval and never narrows it.
- **No wire change, no user-visible string, no walkthrough row.** Nothing the sitting sees changes. **No dependency of any kind:** no edit to any `Cargo.toml` or `Cargo.lock`. No new `pub` item.
- **Not proven by this piece:**
  - that the platform's monotonic clock orders two reads on different threads that are related by happens-before. `Instant` is relied on for this. It is named as an assumption in §5.3;
  - that weakening any of the SeqCst accesses would be caught. No test here can see it on x86-64 (§4.3, M6);
  - the cfg(test) hooks of §2.3 exist only in the test build. The shipped build runs the same statements without them.

## §2. The change, stated before it is applied

**2.1 The ordering the fix gives.** This is not a plain swap of the two lines. Inside `cancel_inner`, under a new per-token transition mutex:

1. Lock `Inner::transition`, a new `Mutex<()>` and a private field. Recover from poison with `unwrap_or_else(|e| e.into_inner())`, as the module does everywhere.
2. Read `cancelled` (SeqCst). If it is already set, this call is not the first. Release the lock and go to step 5 with `first = false`.
3. If it is the first, create a drop guard that stores `cancelled = true` (SeqCst) when it drops. Then, if `stamp` is true, call `trace::mark(CANCELLATION_REQUESTED, 0, 0)`.
4. Drop the guard. This is the flag's publication. Then release the lock. If the stamp unwinds, the guard still publishes the flag, so cancellation never depends on the instrument (§2.2 (e)).
5. Outside the lock, unchanged except for its input: raise the interrupt through the slot, as at `engine/src/cancel.rs:137-145`. Spawn the re-interrupter on `first && in_execute.load(SeqCst)`, which replaces `!already && …` at `:152`.

A sketch for the gates, not code to copy:

```rust
fn cancel_inner(&self, stamp: bool) {
    let first = {
        let _t = self.inner.transition.lock().unwrap_or_else(|e| e.into_inner());
        if self.inner.cancelled.load(Ordering::SeqCst) {
            false
        } else {
            let publish = PublishOnDrop(&self.inner.cancelled); // stores true, SeqCst, on drop
            if stamp {
                crate::trace::mark(crate::trace::CANCELLATION_REQUESTED, 0, 0);
            }
            drop(publish);
            true
        }
    };
    // interrupt through the slot; re-interrupter on `first && in_execute.load(SeqCst)`, as today
}
```

**2.2 Why it keeps the promises under concurrent callers** (the human's item 1; ADV-2026-11-22-01 item 3):
- (a) **At most once.** Every writer of `cancelled` holds `transition`, so the read in step 2 and the store in step 4 are atomic with respect to every other writer. Exactly one call per token sees it unset, and only that call can stamp. Readers (`is_cancelled`, `attach`, `execute_guarded`) only load, as today.
- (b) **Two threads cancelling at once.** The loser blocks on `transition` until the winner has stamped and published. The loser therefore returns only after the request stamp exists and the flag is set. A lock-free claim, where the loser fails a claim and publishes or returns at once, would let the loser publish the flag before the winner's stamp, and so reopen the inversion. That is why the claim and the publication sit under one lock. A loser that returned early would also break the existing promise that `cancel()` returning means `is_cancelled()` is true (`engine/src/cancel.rs::tests::cancellation_is_visible_and_sticky`, `:366-374`).
- (c) **A cancel racing a drop.** If `cancel` enters first, there is one stamp, and the drop finds the flag set and adds none. If `cancel_for_drop` enters first, there is no stamp, and the later `cancel` finds the flag set and adds none. That is today's outcome too: a drop that sets the flag first leaves no request stamp (unchanged; §5.2).
- (d) **Ordering.** The stamp's clock read (`engine/src/trace.rs:150`) is sequenced before the flag's SeqCst store, which is a release. An observer's SeqCst load that reads true synchronizes with that store, and the observer's own `mark` is sequenced after its load. So the request's clock read happens-before the observer's clock read. Every producer-side `PRODUCER_CANCELLED` site is such a load followed by a mark (§0.3).
- (e) **Panic safety.** The drop guard publishes on unwind. A stamp that panics cannot leave a token uncancelled.
- **Memory orderings, named.** SeqCst stays on every access to `cancelled` and `in_execute`. None is weakened. SeqCst, not release/acquire, is required by the two store-then-load pairs with `in_execute` (§0.3): `execute_guarded` stores `in_execute` and then loads `cancelled`, while `cancel_inner` stores `cancelled` and then loads `in_execute`. Only a single total order guarantees that at least one side sees the other. The load inside the lock in step 2 could be Relaxed, but it is kept at SeqCst for uniformity. `ENABLED` stays Relaxed (`engine/src/trace.rs:82-88`).
- **Lock order:** `transition` → `CURRENT` → the trace's event buffer. No path takes `CURRENT` or the buffer and then calls `cancel_inner`. `transition` is never held while the interrupt slot is taken: step 5 runs after the release.
- **Never block the canvas (`docs/01` principle 7).** A canceller can now wait on `transition` only while another canceller of the same token runs steps 2 to 4: one load, a disabled or enabled `mark` (no I/O, no allocation, `engine/src/trace.rs:141-165`), and one store. No figure is claimed for that wait.

**2.3 The test-only hooks.** These are `#[cfg(test)]` only, a private per-token field set through a `#[cfg(test)] pub(crate)` setter, and absent from the shipped build:
- `on_contended`: called before step 1 when `transition.try_lock()` fails, so a test knows a second caller has reached the held lock;
- `before_stamp`: called in step 3 before the mark;
- `on_stamp`: called right after the mark, at the same call site;
- `after_publish`: called right after step 4's publication, while the lock is still held.
- The hooks are per token, not global, so tests that run in parallel and cancel other tokens cannot trigger them. They count and order this token's own stamp decision.
- The real trace is exercised separately, in its own process (§4.2).

**2.4 The wrappers.**
- After C2 is green and §4.4's campaign at C3 has run, the two `ATTEMPTS` loops and their `OrderingRaceObserved` structs are removed (`kernel/tests/skp_admission.rs:750-755`, `:766-801`; `kernel/tests/skp_filter_cancellation.rs:91-99`, `:122-143`, as in §0.3).
- Each test body becomes the test itself, with its two questions as separate assertions:
  - question (a), reach: the presence `expect`s, kept as they are (§2.5);
  - question (b), order: one `assert!(observed.offset_nanos >= requested.offset_nanos, …)`, with a message of its own that names the two stamps and their offsets, in place of the `Err` return at `kernel/tests/skp_admission.rs:935-940` and `kernel/tests/skp_filter_cancellation.rs:275-280`. Equal offsets pass.
- `kernel/tests/skp_admission.rs:943-948`, the existing 5 s sanity bound, is kept unchanged. It is not added here.
- **The stop.** If the fix does not close the failure, the wrappers stay exactly as they are. Either of these is a stop: C1 not red for the intended reason (§4.1), or any ordering failure in §4.4's C3 campaign. No assertion is removed or replaced. The piece goes to the advisor with the evidence. That decision is neither the worker's nor the gate's (ADV-2026-11-22-01 item 3).

**2.5 Both producer-reach checks, preserved byte for byte** (question (a); @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>):
- `kernel/tests/skp_admission.rs:926-931`: `cancel_requested` stamped, then `cancel_observed` stamped. Kept with them: the `CancelState::Requested` assertion at `:892-895` and the terminal-code assertion at `:914-919`.
- `kernel/tests/skp_filter_cancellation.rs:269-274`: the same two presence checks. Kept with them: the `CancelState::Requested` assertion at `:244-247`.

**2.6 No retry, sleep, longer timeout or skip is added to any test.** (ADV-2026-11-22-01 item 2.) This piece removes two retry wrappers.

**2.7 Deadlines in the new tests.** Each blocking wait for a hook's signal in the new unit tests is bounded by the existing `TEST_LIVENESS_DEADLINE` (`engine/src/cancel.rs:333`, 60 s). It waits for a real completion signal (the human's item 1 draws this distinction) and never retries a failed assertion. No new deadline value is declared and none is lengthened. In the correct code every signal arrives without waiting to the deadline. Only a broken interleaving runs the wait to its end and fails by name.

## §3. Fixtures: pre-declared outcomes

No new fixture. The kernel tests write their existing fixtures (`fixture("cancel", 200_000)`, `fixture("late-match", 2_000_000)`) under the worktree's `target/fixtures`, per the Isolation section. The engine unit and integration tests in §4 use no file. No hash verification applies, since no fixture is a declared input.

## §4. Tests, and the mutation per new test

The commit sequence is C1, then C2, then C3. Each is named by its full id in the closing amendment.
- **C1:** the §2.3 hooks placed in today's order, the new tests, and no fix. In today's order, `after_publish` sits between the swap and the mark.
- **C2:** the fix (§2.1).
- **C3:** the wrappers removed (§2.4).

A red result at C1 is deliberate. Under item 1 it is evidence, not a finding.

**4.1 The controlled interleaving** (`engine/src/cancel.rs::tests`, deterministic, the trace not read):
- T1 `the_request_is_stamped_before_the_flag_is_published`. The `on_stamp` hook asserts `!is_cancelled()` at the moment of the stamp. **C1: red,** with its own message saying the flag was published before the request was stamped. **C2: green.**
- T2 `an_observer_that_sees_the_flag_finds_the_request_already_stamped`. The `after_publish` hook hands control to an observer thread and waits for it. The observer asserts `is_cancelled()` and that this token's stamp count is 1, then signals back. **C1: red** at the count assertion (0). **C2: green.** This is the test the human's item 1 asks for: the observer runs, deterministically, between the flag's publication and the old stamp.

**4.2 The two trace promises under concurrent callers** (unit tests in `engine/src/cancel.rs::tests`; then `engine/tests/cancel_request_stamp.rs`, a new binary that holds only these tests, serialized by its own mutex, so no foreign stamp reaches its trace):
- T3 `two_concurrent_cancels_stamp_once_and_the_loser_returns_after_the_stamp`.
  - Canceller A is held at `before_stamp`. Canceller B, on its own thread, signals through `on_contended`. Then A is released.
  - After B's `cancel()` returns, B's thread asserts `is_cancelled()` and a stamp count of 1. The test then asserts a final count of 1.
  - **C1: red** by the liveness deadline: there is no lock to contend. **C2: green.**
- T4 `a_cancel_entering_before_a_drop_stamps_once`. `cancel` is held at `before_stamp`, `cancel_for_drop` contends, then the hold is released. Count 1. **C1: red** by the deadline. **C2: green.**
- T5 `a_drop_entering_before_a_cancel_stamps_nothing`. `cancel_for_drop` is held at `before_stamp`, `cancel` contends, then the hold is released. Count 0, and `is_cancelled()` is true after `cancel` returns. **C1: red** by the deadline. **C2: green.**
- T6 `a_repeated_cancellation_stamps_once`. `cancel` is called, then `cancel` again, then `clone().cancel()`. Count 1. **C1 and C2: green.** It pins the existing promise.
- T7 `cancel_for_drop_stamps_nothing_and_a_later_cancel_adds_none`. Count 0. **C1 and C2: green.**
- T8 `a_stamp_that_panics_still_publishes_the_flag`. `on_stamp` panics inside `catch_unwind`. Then `is_cancelled()` is true, and a second `cancel()` returns without deadlock (the lock is poisoned and recovered). **C1: green.** Today's flag precedes the stamp, so the old order holds this property trivially. **C2: green.**
- I1 `engine/tests/cancel_request_stamp.rs::a_token_cancelled_twice_leaves_one_request_stamp_in_the_trace` uses the real trace. **C1 and C2: green.**
- I2 `…::concurrent_cancellers_leave_one_request_stamp_per_token` uses the real trace. K = 8 threads released by a `Barrier` on one token, repeated over M = 200 tokens, one trace each. Every iteration asserts exactly one `CANCELLATION_REQUESTED`. It is a loop of assertions, each of which fails the test, and not a retry. **C1 and C2: green.**
- I3 `…::an_observer_spinning_on_the_flag_never_stamps_before_the_request` uses the real trace. An observer thread spins on `is_cancelled()` and marks `PRODUCER_CANCELLED`, and a canceller cancels. M = 200 iterations, one trace each, asserting requested ≤ observed. **C1: no registered prediction.** The inversion is probabilistic there, and the C1 count of inversions is recorded as evidence. **C2: green.** I3 is supporting evidence only.
- Preserved and unchanged:
  - `kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant` (`kernel/tests/trace_spans.rs:316-368` @ 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 sha256:<custodian-script>), the end-to-end proof that `cancel_for_drop` stamps nothing;
  - `engine/src/cancel.rs::tests::cancellation_is_visible_and_sticky`.

**4.3 Mutations** (each applied at C2, the named test run, its failure recorded by name with the commit, then reverted; round 25's mutation-observation wording):
- M1: the stamp moved after the publication, still inside the lock. Kills T1 and T2.
- M2: `transition` removed, with the claim made by `cancelled.swap` and the stamp after it (today's order). Kills T3, T4 and T5 by the deadline message.
- M3: the drop guard removed and a plain store placed after the mark. Kills T8.
- M4: `first` ignored, so every `cancel()` stamps. Kills T6, I1 and I2.
- M5: the `stamp` argument ignored, so a drop stamps. Kills T7, and `a_successful_run_stamps_no_cancellation_instant` in the kernel.
- M6: any SeqCst access to `cancelled` or `in_execute` weakened. **Not killed** by any test here on x86-64. It rests on §2.2 and review, and it is recorded as such.
- I3 has no recorded mutation: it is probabilistic by design.
- The two kernel tests are changed, not new. M1 can make their ordering assertion fail, but only probabilistically. That outcome is recorded, if seen, and is not claimed as a kill.

**4.4 Repeated runs** (supporting evidence only; the human's item 1). Each run is its own `cargo test` process, the whole binary as CI runs it, with `-- --nocapture`. The runs go under the machine rules in the custodian's brief.
- **At C1** (today's order, wrappers present): 50 runs of `--test skp_admission` and 50 of `--test skp_filter_cancellation`. Count the wrapper's `attempt k/5 … hit` lines, which gives the inversions per attempt. That count is the campaign's detection power on this machine.
- **At C3** (fix, no wrappers): the same 50 plus 50. Pass condition: no ordering failure and no presence failure.
- If C1 shows no inversion at all, the form records that the local campaign has no shown power. The evidence then rests on §4.1 and the PR's CI runs.

**4.5 The suites, unchanged and green at C3:**
- `cargo test -p spatial-engine` (the window tests `engine/tests/cancel_execute_window.rs`, `dataset.rs`, `index.rs`; `engine/tests/slice.rs::cancelling_mid_stream_stops_production_promptly`);
- `cargo test -p spatial-kernel` (including `wire_bytes_invariant.rs` and `trace_spans.rs`);
- clippy and fmt; `verify:plan`, `verify:cites`, `verify:quotes`.

## §5. Predictions · declared unchanged · invalidators · falsification

**5.1 Predicted.** §4's C1 and C2 outcomes as registered, and zero failures in the C3 campaign. A wrong prediction is a result (class 2) and is never edited.

**5.2 Declared unchanged:**
- `cancel()` returning means `is_cancelled()` is true. Interrupt after the flag (`engine/src/cancel.rs:100-101`). The re-interrupter's spawn condition, in meaning. `attach`, `detach`, `execute_guarded` and `is_executing`.
- A drop that sets the flag first leaves no request stamp, and a later `cancel` adds none.
- The disabled `mark` cost; no `mark` in a per-row loop (`engine/src/trace.rs:34-37`).
- The public API: `cancel`, `cancel_for_drop`, `is_cancelled`, signatures and visibility.
- Every wire byte; every user-visible string; ADR-018; `kernel/CANCELLATION-AND-TRACING.md`; `Cargo.toml` and `Cargo.lock`.

**5.3 The assumption relied on.** Two `Instant::now()` reads on different threads, related by happens-before, are ordered: the earlier read is ≤ the later one. If the C3 campaign shows an inversion, that falsifies either H1's fix or this assumption, and the piece stops.

**5.4 Not excluded.** A foreign `PRODUCER_CANCELLED` in a kernel binary's trace would read as an inversion, with an arbitrary gap. Its source would be another test in the same binary whose stream observes a drop's flag while the cancel test's trace is enabled (`engine/src/trace.rs:90-98`; `Trace::first` is name-global). Entry 1122b reports five gaps under 2 µs, which fits H1 better than a foreign stamp. This is a reading, not a proof.

**5.5 Invalidators (each a stop, to the advisor):**
- T1 or T2 not red at C1 for its own message;
- any test hanging past its deadline at C2;
- any ordering or presence failure in the C3 campaign;
- any need to touch a file outside §7's Scope;
- any need for a dependency.

**5.6 Falsification of the whole form.** Inversions persist at C3 although T1 and T2 are green. The cause would then not be, or not only be, H1.

## §6. Instruments

- Every quantity is an **assertion**: a stamp count, an ordering of two offsets, a boolean flag state, a typed outcome.
- The campaign counts are counts of runs and of failures. They are not measurements.
- Nothing is timed and nothing is compared with `docs/08`.
- The 5 s bound in `skp_admission.rs` and the 100 ms budget assertion in `slice.rs` are existing and unchanged.

## §7. Declared values and ceilings

- **New constants, test-only, each declared at its own site:** I2 K = 8 threads and M = 200 tokens; I3 M = 200 iterations; the campaign N = 50 runs per binary per commit (C1, C3). No product constant is added or changed.
- **Scope (5 files):**
  - `engine/src/cancel.rs`
  - `engine/tests/cancel_request_stamp.rs` (new)
  - `kernel/tests/skp_admission.rs`
  - `kernel/tests/skp_filter_cancellation.rs`
  - `engine/README.md`: the owner's index Cancellation row and its last-verified line, pointers only, written by lead-data on request.
- **Line budget:** at most 700 changed lines (insertions plus deletions under §21c's rule, this form excluded). Counted by `git diff --numstat origin/main...HEAD -- engine/src/cancel.rs engine/tests/cancel_request_stamp.rs kernel/tests/skp_admission.rs kernel/tests/skp_filter_cancellation.rs engine/README.md` at a named commit. An overrun is class 8, and this line is never edited.

## §8. Block-on-sight

1. A retry, a sleep, a longer timeout or a skip added to any test without a line of its own (§2.6, §2.7; ADV-2026-11-22-01 item 2).
2. A wrapper removed without T1 and T2 red at C1 and green at C2, and without §4.4's C3 counts.
3. The presence `expect`s of §2.5 merged into, weakened by or replaced with the ordering assertion. Either question's assertion removed.
4. Any edit to `Cargo.toml` or `Cargo.lock`.
5. Any edit to ADR-018, to `kernel/CANCELLATION-AND-TRACING.md`, or to `engine/src/trace.rs`'s `CANCELLATION_REQUESTED` doc before OPEN-1 is settled.
6. A hook or test branch compiled into the shipped build. Any new `pub` item.
7. Any SeqCst access to `cancelled` or `in_execute` weakened.
8. A `mark` added inside a per-row loop.
9. `transition` held while the interrupt slot is taken, or `cancel_inner` called under `CURRENT`.
10. A wire byte, a user-visible string or a walkthrough row changed.
11. A file outside §7's Scope changed.
12. A merge before the v0.2 tag, or without the check for changes on main since the gates.

## §9. Gates

- **Architect:** ADR-018 items 1 and 2 against §1 and OPEN-1; `docs/01` principles 7 and 8; ADR-010 rule 6 for the declared values; ADR-004 Amendment 4, the instrument kept off the wire; the seam rule, §0.3 read against the code; §8 item by item.
- **Reviewer:** the full diff; §2.2's argument against the code; every mutation of §4.3 observed by name; the campaign logs against §4.4.
- **Suites:** §4.5, green at C3 on the branch, three-dot range.
- **Operator:** none. Nothing is visible at the sitting.

**Working section: the testing paragraph, as written** (the human's message, line 49; also in each worker brief per ADV-2026-11-22-01 item 10):

Testing while writing the code: run the smallest test that exercises the changed behaviour while the worker can still use the result. For a behavioural fix, show it red for the intended reason and green after the fix. Use an installed-session check only for a claim that depends on the installed integration. This adds no permanent watcher, full-suite-on-edit rule, or extra gate.

## §10. Amendments: opens empty, append-only

*(empty)*

---

## What I could not settle

- **OPEN-1 (blocking; the human's if it needs an ADR amendment).** ADR-018:45 and `kernel/CANCELLATION-AND-TRACING.md:48` define `cancel_requested` as the call's return. The code already stamps before the return, and the fix stamps before the flag. Under the literal row, observed-before-requested is allowed, so question (b)'s assertion rests on a reading. The options: record the reading on the form for the architect to gate, with no text edited (the draft's default), or propose an ADR-018 amendment to the human (a red line).
- **OPEN-2.** `engine/tests/slice.rs:900` uses `saturating_sub`, so the same inversion would read as 0 ms and pass the 100 ms budget assertion silently. Should an ordering assertion be added there in this piece (one more file), or should it be a separate finding? The draft leaves it out and reports it here.
- **OPEN-3.** The campaign is N = 50 runs per binary, at C1 and C3, on this Windows machine only. The failure was on ubuntu-24.04, and the only Linux evidence will be the PR's CI runs. Its machine time is unknown. Both the count and the platform gap are for the custodian.
- **OPEN-4.** Is the foreign-stamp hazard of §5.4 its own node if it appears after the fix? The draft treats any C3 inversion as a stop to the advisor, with its gap recorded.
- **OPEN-5.** The new per-token mutex in `cancel()` and in every `BatchStream` drop. The draft reads this as no change to the never-block guarantee: the wait is bounded by one stamp, with no I/O. The architect gates it. If the custodian reads it as an altered guarantee, it is a question for the advisor.
- **OPEN-6.** The node's `budget_minutes: 240` probably does not cover the campaign of §4.4 (four sets of 50 whole-binary runs). That is for the custodian to set.
- No `sha256` in this draft is computed: every pin is marked for the custodian's script.
