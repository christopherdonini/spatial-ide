# lead-data's draft 2 of the cancel node's full form, its revision under ADV-2026-11-22-04, its final message as handed back

*Filed by the custodian from lead-data's subagent transcript (its hand-back at 2026-11-22T04:40:18.447Z, after the custodian's message resuming it), 40339 bytes, sha256 5f9252ae340537c80855f22ca7210a4d6c13a79edd0e5acea4fdf7f15447979c, below the rule unchanged. A draft, never Authority. The committed form is governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md: the text between this draft's two rules, with the custodian's changes listed in the ledger entry of this commit.*

---

Result: I revised the full form for `cancel-requested-stamped-before-the-flag-and-the-attempts-wrappers` under ADV-2026-11-22-04, read only, with every citation re-pinned to main at eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7. The revised form follows, whole.
Blocking question: none for the form's gate. For the build's gate, the advisor still has to rule the words of the two proposed notes (§2.8).
One correction to the ruling's premise, under its item 3: in both today's code and the fix, a `cancel` that follows a drop on the same token stamps nothing. No stamp comes after the flag (§2.9).
Report path: state/consults/2026-11-22-cancel-requested-stamp-order-form-lead-data-draft.md
sha256: not computed. I have no hashing tool and write no file, so the custodian's filing script computes it.

---

# The cancel tests' node: CANCELLATION_REQUESTED stamped before the cancelled flag is published, the two ATTEMPTS wrappers, and the inversion hidden in the slice budget test (full form)

- **Path (proposed):** `governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `cancel-requested-stamped-before-the-flag-and-the-attempts-wrappers`, its whole summary (cited by id).
  - The human's message of 2026-11-22, item 1: `state/directives/2026-11-22-the-humans-message-the-idle-time-work-flaky-tests-are-findings-the-cancel-node-subagent-compaction-guardian-and-monitor-a-property-testing-trial.md:17-24` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>. Its testing paragraph is `:49` of the same file @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>.
  - ADV-2026-11-22-01, items 2, 3, 8, 9 and 10. It is the advisor's ruling under the human's delegation of 2026-11-13, not the human's words: `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-01-the-pieces-of-the-humans-message-placed-the-two-drafts-filed-on-main-before-their-ids.md:16-27` and `:43-47` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>.
  - ADV-2026-11-22-04, items 1 to 4, likewise the advisor's ruling under the delegation and not the human's words: `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-04-the-cancel-forms-open-1-an-appended-note-to-adr-018-the-slice-assertion-joins-the-scope.md:11-21` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>. Under its item 5, the ADR note goes into the human's digest, for the human to overturn.
  - The finding is ledger entry 1122b in `state/CUT-STATE.md`, cited by entry: the test `cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock`, revision 624eb45cd4df328ff1acdc9c1e58eb1c75d36339, five of five attempts, Product CI Rust run 44461774255. The slice assertion is attached to this node in the ledger (ADV-2026-11-22-04 item 2).
  - This node replaces ADV-2026-11-21-15 item 3 (iii): `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md:18` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>.
- **Drafted by** lead-data, read only, on the custodian's briefs. The scratch brief files are evidence only and never Authority. First draft at main 662ea259; this revision at main eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7, after ADV-2026-11-22-04.
  - Every `@ eb47ee33…` pin is historical: it is authoritative for what this form read. For the code a commit edits, that commit's base tree is authoritative. The worker re-derives every cite it touches at the branch base, 662ea259eac2e5fd1f47e83cbee0eea3d17430b5.
  - The code lines cited here read the same at eb47ee33 as at 662ea259 by a content check of `engine/src/cancel.rs:133`, `:152`, `engine/tests/slice.rs:900`, `kernel/tests/skp_admission.rs:927`, `kernel/tests/skp_filter_cancellation.rs:270`, ADR-018 `:45` and `kernel/CANCELLATION-AND-TRACING.md:48`. That is a spot check, not a diff.
- **Hashes.** Every `sha256:<custodian-script>` is filled in by the custodian's script before commit.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Form and gating:** full form and full gating from dispatch, reviewer and architect, under AUTONOMY §21a, on four grounds:
  - ADR text: a note appended to ADR-018, with words the advisor rules under the delegation;
  - a cancellation guarantee's instrument (ADR-018's instants);
  - properties under test: the two trace promises and the kernel and slice ordering checks;
  - concurrent code under the trace's frozen measurement semantics (`kernel/CANCELLATION-AND-TRACING.md` §2).
  It is also over §21c's size (§7).
- **Merge:** prepared and gated now, merged only after the v0.2 tag (the human's message, item 0, Merges). Before the merge, the branch is checked for changes on main since the gates in every Scope file. The check is recorded in the closing amendment.

## Isolation: the piece's first record (ADV-2026-11-22-01 item 9)

The custodian's check, byte-copied from the custodian's first brief. The custodian confirms it against the run by script:

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

- Worktree `C:/dev/wt/cancel-stamp` on `cut/cancel-stamp-order`, from 662ea259eac2e5fd1f47e83cbee0eea3d17430b5.
- Build output `D:/wt-targets/cancel-stamp`, given as `CARGO_TARGET_DIR`.
- The tests create their own fixtures under `<worktree>/target/fixtures`:
  - `kernel/tests/skp_filter_cancellation.rs:43-46` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>;
  - `engine/tests/slice.rs:24-27` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>.
- Re-check (paraphrase of a draft step). After the first test run and before any campaign run, the worker records that `C:/dev/wt/cancel-stamp/target` and its `fixtures` folder are plain folders and not links, with their resolved paths. A link, or a path into `D:\spatial-ide\target` or the sitting's fixtures, stops the piece.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run, and nothing has been measured. The 5 GB fixture is not used.
- **Hypothesis H1,** the cause the test's comment and the human's item 1 give: `cancel_inner` publishes the flag before it stamps. Evidence: `kernel/tests/skp_admission.rs:766-778` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>; `engine/src/cancel.rs:132-136` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>.
- Its discriminator is §4.1, red at C1 and green at C2. The campaign of §4.4 is supporting evidence only.

**0.2 The reuse index (the standing step).** Byte-copied from the custodian's first brief. These are the custodian's runs in the read-only reuse clone at 89bbac37, confirmed by the custodian's script:

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

All three missed. The misses are noted and do not block. Nothing is ported. A model checker would be a dependency and is out of scope (§1).

**0.3 The interfaces as read** (the seam rule; all @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>):
- `cancel` → `cancel_inner(true)`; `cancel_for_drop` → `cancel_inner(false)`; `cancel_inner` itself: `engine/src/cancel.rs:108-177`.
- `is_cancelled` is a SeqCst load: `engine/src/cancel.rs:179-181`.
- The two store-then-load pairs with `in_execute`: `engine/src/cancel.rs:194-199` (`execute_guarded`), and `:133` with `:152` (`cancel_inner`).
- `attach`: `engine/src/cancel.rs:250-268`.
- The only caller of `cancel_for_drop` is `BatchStream::drop`: `engine/src/stream.rs:898-908`.
- `trace::mark`, `mark_cold` and `Trace::push`, which reads the clock before the buffer lock: `engine/src/trace.rs:149-165`, `:301-316`.
- `Trace::events` sorts by offset: `engine/src/trace.rs:189-197`. `Trace::first` is name-global: `:199-202`. `segment_ms` returns `None` for a missing or backward pair: `:204-220`.
- One process-wide trace: `engine/src/trace.rs:90-98`; `kernel/CANCELLATION-AND-TRACING.md` §7, first bullet.
- Every producer-side `PRODUCER_CANCELLED` follows a SeqCst load of `cancelled` that read true:
  - `engine/src/stream.rs:1794-1797`, `:1846-1848`, `:1898-1901`, `:2548-2556`;
  - `classify`: `engine/src/stream.rs:2636-2639`.
- The kernel tests:
  - `kernel/tests/skp_admission.rs`: struct `:750-755`, doc `:766-778`, wrapper `:779-801`, body `:803-950`;
  - `kernel/tests/skp_filter_cancellation.rs`: struct `:91-99`, wrapper `:122-143`, body `:145-282`.
- The slice budget test: `engine/tests/slice.rs::cancelling_mid_stream_stops_production_promptly`, `engine/tests/slice.rs:841-928`. Its subtraction at `:900` reads an inversion as zero.

**0.4 A finding against ADR-018's wording, older than this piece** (ADV-2026-11-22-04 item 1):
- ADR-018 item 1 defines `cancel_requested` as the moment the cancellation call returns to its caller: `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:45` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>. The design note's row is the same: `kernel/CANCELLATION-AND-TRACING.md:48` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>.
- The code stamps inside the call, after the flag is published and before the interrupt and the return (`engine/src/cancel.rs:133-145` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>). The fix stamps inside the call, before the flag is published. Neither is the return.
- **The reading the fix relies on:** the instant is stamped inside the call, before the flag is published. So it precedes every observation of that flag. And the interval that ADR-018 item 2 budgets (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-65` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>), measured from it, is never shorter than one measured from the call's return.
- **By how much it widens, in kind:**
  - **Against the call's return** (the ADR's words): by the rest of the call after the stamp. That is the flag's publication and the transition lock's release (code-controlled, a fixed number of steps); taking the interrupt slot's mutex, which `attach`, `detach` and the re-interrupter each hold for one statement; DuckDB's `InterruptHandle::interrupt` (external, class (b) in ADR-018 item 4's terms); and, when an execute is in flight, `std::thread::Builder::spawn` of the re-interrupter (the OS's, class (b)). None of this is bounded here and none is measured.
  - **Against today's stamp** (the point every recorded figure was measured from): by the publication alone, one SeqCst store and a lock release. Every other step after the stamp sits after it today as well.
- **The draft's reading of what item 2 budgets:** unchanged. Item 2 scores the same pair of instants (`cancel_requested` → `cancel_observed`), stamped at the same call site. The stamp moves earlier, inside the call, by the publication. No recorded figure is rescored, as ADR-018's Consequences already provide for existing measurements (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:125-129` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>, paraphrased).
  - **Stop:** if the architect finds that the fix changes what item 2 budgets, and not only the wording of the instant, the piece goes to the advisor before any code (ADV-2026-11-22-04 item 1, fourth bullet).

## §1. What this preregistration may and may not claim

- **May claim:**
  - the engine ordering in §2.2 and its proof under §4's tests: the request stamp's clock read happens-before the flag's publication, and so happens-before every observer stamp taken after a load of that flag;
  - that the two trace promises and the token guarantees of §5.2 are kept;
  - the campaign counts, as counts.
- **May not claim:**
  - any performance figure, `docs/08` row or latency;
  - any change to the 100 ms budget or to item 2's scoring;
  - that the 624eb45c CI failure had cause H1 (§5.4).
- **ADR text.** The piece appends one note to ADR-018 and one to §2 of `kernel/CANCELLATION-AND-TRACING.md`. Their proposed text is in §2.8. No existing line of either file is edited.
  - The architect's gate reads the proposed text against the ADR. The advisor rules the words, from the architect's text, before the build's gate. Both notes land in the piece's diff in the ruled words, and the build's gates read them as ruled (ADV-2026-11-22-04 item 1).
  - No other line of either file changes. `engine/src/trace.rs:370-371` is not edited (see the last section).
- **No wire change**, no user-visible string, no walkthrough row; nothing the sitting sees changes. **No dependency:** no `Cargo.toml` or `Cargo.lock` edit. No new `pub` item.
- **Not proven:**
  - that the platform's monotonic clock orders two reads on different threads related by happens-before. This is an assumption (§5.3);
  - that weakening any SeqCst access would be caught. M6 is not killed (§4.3);
  - the cfg(test) hooks of §2.3 exist only in the test build; the shipped build runs the same statements without them.

## §2. The change, stated before it is applied

**2.1 The ordering the fix gives.** This is not a plain swap. Under a new private per-token `transition: Mutex<()>`, recovered from poison as the module does:

1. Lock `transition`.
2. Read `cancelled` (SeqCst). If it is set, `first = false`; release the lock and go to step 5.
3. If it is unset, create a drop guard that stores `cancelled = true` (SeqCst) on drop. If `stamp` is true, `trace::mark(CANCELLATION_REQUESTED, 0, 0)`.
4. Drop the guard (the publication), then release the lock.
5. Outside the lock, raise the interrupt through the slot as at `engine/src/cancel.rs:137-145`. Spawn the re-interrupter on `first && in_execute.load(SeqCst)`, replacing `!already` at `:152`.

A sketch, not code to copy:

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

**2.2 Why it keeps the promises under concurrent callers:**
- (a) **At most once.** Every writer of `cancelled` holds `transition`, so one call per token sees it unset, and only that call can stamp. Readers only load.
- (b) **Two cancels at once.** The loser blocks until the winner has stamped and published. It returns only once the stamp exists and the flag is set.
  - A lock-free claim would let the loser publish before the winner's stamp, which is the inversion again.
  - A loser that returned at once would also break the existing guarantee that `is_cancelled()` is true once `cancel()` returns (`engine/src/cancel.rs::tests::cancellation_is_visible_and_sticky`, `engine/src/cancel.rs:366-374` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>).
- (c) **A cancel racing a drop.** If the cancel enters first, there is one stamp. If the drop enters first, there is no stamp, and the later cancel adds none (§2.9).
- (d) **Order.** The stamp's clock read (`engine/src/trace.rs:150`) is sequenced before the SeqCst store, which acts as a release. An observer's SeqCst load that reads true synchronizes with it, and the observer's `mark` comes after its load.
- (e) **Panic safety.** The guard publishes on unwind, so a panicking stamp cannot leave the token uncancelled.
- **Memory orderings.** SeqCst stays on every access to `cancelled` and `in_execute`. It is required by the two store-then-load pairs of §0.3, where only one total order guarantees that at least one side sees the other. The load in step 2 is kept at SeqCst for uniformity. `ENABLED` stays Relaxed (`engine/src/trace.rs:82-88`).
- **Lock order:** `transition` → `CURRENT` → the trace buffer. Nothing takes `CURRENT` and then calls `cancel_inner`. `transition` is never held while the slot is taken.
- **Never block the canvas (`docs/01` principle 7).** A canceller waits only while another canceller of the same token runs steps 2 to 4: no I/O and no allocation (`engine/src/trace.rs:141-165`). No figure is claimed for that wait.

**2.3 Test-only hooks.** These are `#[cfg(test)]` only, private and per token, set through a `#[cfg(test)] pub(crate)` setter, and absent from the shipped build:
- `on_contended`: `transition.try_lock()` fails before step 1;
- `before_stamp`: in step 3, before the mark;
- `on_stamp`: at the mark's call site, right after it;
- `after_publish`: right after step 4's publication, with the lock still held.

The hooks count and order only this token's own stamp decision, so tests that run in parallel and cancel other tokens cannot touch them.

**2.4 The wrappers.**
- After C2 is green and the C3 campaign of §4.4 has run, the two `ATTEMPTS` loops and their `OrderingRaceObserved` structs leave both files (§0.3's lines). Each body becomes the test itself, with two separate assertions:
  - **(a) reach:** the presence `expect`s of §2.5, unchanged;
  - **(b) order:** one `assert!(observed.offset_nanos >= requested.offset_nanos, …)` with its own message naming both stamps and their offsets. It replaces the `Err` return at `kernel/tests/skp_admission.rs:935-940` and `kernel/tests/skp_filter_cancellation.rs:275-280` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>. Equal offsets pass.
- `kernel/tests/skp_admission.rs:943-948`, the existing 5 s sanity bound, stays unchanged.
- **Stop.** If C1 is not red for the intended reason (§4.1), or the C3 campaign shows any ordering failure, the wrappers stay exactly as they are and no assertion is removed or replaced. The piece goes to the advisor with the evidence. That decision is neither the worker's nor the gate's (ADV-2026-11-22-01 item 3).

**2.5 Both producer-reach checks, preserved byte for byte** (question (a)):
- `kernel/tests/skp_admission.rs:926-931` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>. With it: `:892-895` (`CancelState::Requested`) and `:914-919` (the terminal code).
- `kernel/tests/skp_filter_cancellation.rs:269-274` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>. With it: `:244-247`.

**2.6 The slice budget assertion** (ADV-2026-11-22-04 item 2):
- `engine/tests/slice.rs:900` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script> becomes an ordering assertion with its own message, naming `cancel_observed` before `cancel_requested` and both offsets. That is followed by the exact subtraction, and the 100 ms assertion at `:901-904` stays unchanged.
- After the fix, an inversion there fails the test by name, where today it reads as a 0 ms interval and passes.
- The reported line at `:917` is left alone: after the new assertion its `saturating_sub` cannot saturate.
- Nothing else in the test changes. This lands in C3. Its mutation is M7 (§4.3).
- I see no reason to keep it out.

**2.7 No retry, sleep, longer timeout or skip is added to any test.** (ADV-2026-11-22-01 item 2.) This piece removes two retry wrappers.

**2.8 Deadlines in the new tests.** Each blocking wait for a hook's signal in the new unit tests is bounded by the existing `TEST_LIVENESS_DEADLINE` (`engine/src/cancel.rs:333`, 60 s). It waits for a real completion signal and never retries an assertion. No deadline value is added or lengthened. In correct code no wait runs to its end; only a broken interleaving does, and it fails by name.

**2.9 The two appended notes, proposed text** (for the architect's gate; the words are the advisor's to rule before the build's gate).

*Placement.*
- ADR-018: at the end of the file, after the last line of its *Alternatives considered* section.
- `kernel/CANCELLATION-AND-TRACING.md`: at the end of §2, after its last line (currently `:79`) and before the rule that closes §2. That insertion moves every later line of the file. Pinned cites elsewhere stay stable, but bare cites would not. See the last section.

ADR-018, proposed:

```markdown
## Note (2026-11-22): where `cancel_requested` is stamped

Item 1's row says `cancel_requested` is the moment the cancellation call returns to its caller. The engine does not stamp that moment: `CancelToken::cancel` stamps the instant inside the call, before it publishes the cancelled flag that a worker loads (`engine/src/cancel.rs`, `cancel_inner`). Item 1's row is read as that instant. It precedes every `cancel_observed` stamped after a load of that flag, so the interval item 2 scores, measured from it, is never shorter than one measured from the call's return: it is longer by the rest of the call, which publishes the flag, raises the external engine's interrupt and, when an execute is in flight, starts the thread that re-raises it. A cancellation call that finds the flag already set, by an earlier call or by a stream's drop, stamps nothing. The 100 ms budget, the three instants' names and items 2 and 3 are unchanged. No line above this note is changed.
```

`kernel/CANCELLATION-AND-TRACING.md` §2, proposed:

```markdown
> **Note to §2 (2026-11-22).** The `cancel_requested` row is read as ADR-018's note of 2026-11-22 reads it: the instant is stamped inside `CancelToken::cancel`, before the cancelled flag is published (`engine/src/cancel.rs`, `cancel_inner`), so it precedes every `cancel_observed` stamped after a load of that flag. A `cancel()` that finds the flag already set, by an earlier call or by `cancel_for_drop`, stamps nothing, and a span opening on `cancel_requested` is then absent, never zero. No line of §2 above this note is changed.
```

Clause check of the proposed text against the fix (§2.1) and the code at eb47ee33:

| Clause | Holds at | Note |
|---|---|---|
| does not stamp the call's return | §2.1 step 3; step 5 runs after it | true today as well (`engine/src/cancel.rs:135` precedes `:137-176`) |
| stamped inside the call, before the flag's publication | §2.1 steps 3–4 | true only after C2; the note lands after C2 |
| precedes every `cancel_observed` after a load of the flag | §2.2 (d); every site in §0.3 | rests on the clock assumption of §5.3 |
| longer by the rest of the call: flag, interrupt, re-interrupter | §2.1 steps 4–5; `engine/src/cancel.rs:137-176` | the re-interrupter only when an execute is in flight (`:152`) |
| a call that finds the flag set stamps nothing | §2.1 step 2; today `engine/src/cancel.rs:133-134` | tests T5, T6, T7 and I4 (§4.2) |
| a span opening on `cancel_requested` is then absent, never zero | `engine/src/trace.rs:204-220`, `:229-234` | existing code, not changed |

Neither note is the human's wording. They are the advisor's to rule under the delegation, into the human's digest.

**2.10 ADV-2026-11-22-04 item 3: a drop first, then a real `cancel` on the same token.** Read from the code, not from the ruling's premise.
- **Today** (`engine/src/cancel.rs:132-136` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>):
  - `cancel_for_drop`'s `swap` sets the flag, and `stamp` is false, so there is no stamp.
  - The later `cancel()`'s `swap` returns `already = true`, so `stamp && !already` is false and again there is no stamp.
  - **No stamp follows the flag:** the token's trace carries no `cancel_requested` at all.
- **After the fix:** the same. Step 2 finds the flag set, and the later `cancel()` stamps nothing.
- **What the trace promises in that order:**
  - no `CANCELLATION_REQUESTED` for that token;
  - so no span or derived interval opening on it: `segment_ms` returns `None` and `spans()` omits the span. It is absent, never zero and never negative (`engine/src/trace.rs:204-234` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>);
  - a `PRODUCER_CANCELLED` may still appear when the dropped stream was still producing. It is an observation with no request in the trace, and ADR-018 item 2's interval cannot be derived for it. That is unchanged.
  - For a stream that ran to completion, the trace holds neither stamp (`kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant`, `kernel/tests/trace_spans.rs:316-368` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:<custodian-script>).
- **Which tests hold it:**
  - today: none for the follow-up `cancel`. The kernel test covers the drop alone;
  - this piece adds three: T7 (sequential), T5 (concurrent, the drop entering first) and I4 (the real trace, through the public API) (§4.2).

## §3. Fixtures: pre-declared outcomes

- No new fixture is a declared input. The kernel tests write their existing fixtures under the worktree's `target/fixtures`.
- I4 (§4.2) writes one small fixture there through `spatial_engine::fixture`, as `engine/tests/slice.rs` does. Its spec is declared at its site. Predicted outcome: the stream drains with no error.
- No hash verification applies.

## §4. Tests, and the mutation per new test

Commits:
- **C1:** the §2.3 hooks placed in today's order (`after_publish` between the swap and the mark), plus the new tests, and no fix;
- **C2:** the fix;
- **C3:** the wrappers removed (§2.4) and the slice assertion (§2.6);
- **C4:** the two notes, in the advisor's ruled words, before the build's gates open.

Each commit is named by its full id in the closing amendment. A red result at C1 is deliberate and is evidence, not a finding (the human's item 1).

**4.1 The controlled interleaving** (`engine/src/cancel.rs::tests`; deterministic; the trace is not read):
- **T1 `the_request_is_stamped_before_the_flag_is_published`:** `on_stamp` asserts `!is_cancelled()`. C1: red, with its own message (flag published before the stamp). C2: green.
- **T2 `an_observer_that_sees_the_flag_finds_the_request_already_stamped`:** `after_publish` hands control to an observer thread and waits. The observer asserts `is_cancelled()` and a stamp count of 1, then signals. C1: red at the count (0). C2: green. This is the observer run deterministically between the publication and the old stamp.

**4.2 The trace promises under concurrent callers** (unit tests in `engine/src/cancel.rs::tests`; `I` tests in the new `engine/tests/cancel_request_stamp.rs`, a binary of its own, serialized by its own mutex, so no foreign stamp reaches its trace):
- **T3 `two_concurrent_cancels_stamp_once_and_the_loser_returns_after_the_stamp`:** A is held at `before_stamp`. B, on its own thread, signals through `on_contended`. Release A. After B returns, B asserts `is_cancelled()` and a count of 1. Final count 1. C1: red by the deadline (no lock). C2: green.
- **T4 `a_cancel_entering_before_a_drop_stamps_once`:** count 1. C1: red by the deadline. C2: green.
- **T5 `a_drop_entering_before_a_cancel_stamps_nothing`:** count 0, and `is_cancelled()` true after the `cancel` returns. C1: red by the deadline. C2: green.
- **T6 `a_repeated_cancellation_stamps_once`:** `cancel`, `cancel`, `clone().cancel()`; count 1. C1 and C2: green.
- **T7 `cancel_for_drop_stamps_nothing_and_a_later_cancel_adds_none`:** count 0. C1 and C2: green.
- **T8 `a_stamp_that_panics_still_publishes_the_flag`:** `on_stamp` panics inside `catch_unwind`; then `is_cancelled()` is true and a second `cancel()` returns. C1 and C2: green.
- **I1 `a_token_cancelled_twice_leaves_one_request_stamp_in_the_trace`:** C1 and C2: green.
- **I2 `concurrent_cancellers_leave_one_request_stamp_per_token`:** K = 8 threads released by a `Barrier`, over M = 200 tokens, one trace each, exactly one stamp per iteration. A loop of assertions, not a retry. C1 and C2: green.
- **I3 `an_observer_spinning_on_the_flag_never_stamps_before_the_request`:** M = 200 iterations, one trace each, requested ≤ observed. C1: no registered prediction; the inversion count is recorded. C2: green. Supporting evidence only.
- **I4 `a_cancel_after_a_drop_of_the_same_token_stamps_no_request`:**
  1. Drain a stream opened through `Dataset::stream_with_cancel` with a caller-held token.
  2. Drop it, which runs `cancel_for_drop`.
  3. Call `cancel()` on the token.
  The trace holds no `CANCELLATION_REQUESTED`, and `segment_ms(CANCELLATION_REQUESTED, PRODUCER_CANCELLED)` is `None`. C1 and C2: green. This is §2.10's real-trace test.
- **Preserved unchanged:** `kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant`; `engine/src/cancel.rs::tests::cancellation_is_visible_and_sticky`.

**4.3 Mutations.** Each is applied at the commit named, the test is run, its failure is recorded by name with the commit, and the mutation is reverted (round 25's observation wording).
- **M1** (at C2): the stamp after the publication, inside the lock. Kills T1 and T2.
- **M2** (at C2): `transition` removed, the claim made by `swap`, the stamp after it. Kills T3, T4 and T5 by the deadline message.
- **M3** (at C2): the guard removed, with a plain store after the mark. Kills T8.
- **M4** (at C2): `first` ignored, so every `cancel()` stamps. Kills T6, I1 and I2.
- **M5** (at C2): `stamp` ignored, so a drop stamps. Kills T7, I4 and `a_successful_run_stamps_no_cancellation_instant`.
- **M6:** any SeqCst access weakened. **Not killed** on x86-64. It rests on §2.2 and review.
- **M7** (at C3): the stamp removed from `cancel_inner` and made instead in `BatchStream::next_into` when it returns `Err(Cancelled)`.
  - Predicted: `engine/tests/slice.rs::cancelling_mid_stream_stops_production_promptly` fails at §2.6's ordering assertion, by its message. The producer stamps `PRODUCER_CANCELLED` before the `Err` that `next_into` receives, and `next_into` reads no flag of its own (no `is_cancelled` call in `engine/src/stream.rs` before `:1794`).
  - The same mutation applied at C2, the parent of the slice change, is predicted to pass, reading 0 ms. That shows the masking.
  - A different outcome is recorded as class 2.
- I3 has no recorded mutation. The two kernel tests are changed, not new: M1 may fail their ordering assertion probabilistically, and that is recorded if seen, never claimed as a kill.

**4.4 Repeated runs** (supporting evidence only: the human's item 1; ADV-2026-11-22-04 item 4).
- **Run shape.** Each run is its own `cargo test` process of the whole binary, as CI runs it, with `-- --nocapture`. The campaign runs under the machine's holds and yields to sitting and release work at the next safe checkpoint.
- **At C1:** 50 runs each of `--test skp_admission` and `--test skp_filter_cancellation`, counting the wrapper's `attempt k/5 … hit` lines. That count is the campaign's detection power here.
- **At C3:** the same 50 + 50. Pass: no ordering failure and no presence failure.
- If C1 shows no inversion, the form records that the local campaign has shown no power. The evidence then rests on §4.1 and CI.
- Linux evidence comes from the PR's CI runs only.

**4.5 The suites, green at C4:**
- `cargo test -p spatial-engine` (`engine/tests/cancel_execute_window.rs`, `dataset.rs` and `index.rs` window tests, `engine/tests/slice.rs`);
- `cargo test -p spatial-kernel` (`wire_bytes_invariant.rs`, `trace_spans.rs`);
- clippy and fmt; `verify:plan`, `verify:cites`, `verify:quotes`.

## §5. Predictions · declared unchanged · invalidators · falsification

**5.1 Predicted:** §4's outcomes as registered; zero C3 campaign failures. A miss is class 2 and is never edited.

**5.2 Declared unchanged:**
- `cancel()` returning implies `is_cancelled()` is true. The interrupt comes after the flag (`engine/src/cancel.rs:100-101`).
- The re-interrupter's condition, in meaning; `attach`, `detach`, `execute_guarded`, `is_executing`.
- A drop that sets the flag first leaves no request stamp, and a later `cancel` adds none.
- The disabled `mark` cost, and no `mark` in a per-row loop (`engine/src/trace.rs:34-37`).
- The public API.
- Every wire byte and user-visible string; every existing line of ADR-018 and of `kernel/CANCELLATION-AND-TRACING.md`.
- `Cargo.toml` and `Cargo.lock`.
- The 100 ms budget and item 2's scoring.

**5.3 Assumption:** two `Instant::now()` reads on different threads related by happens-before are ordered, earlier ≤ later. A C3 inversion falsifies either the fix or this assumption, and the piece stops.

**5.4 Not excluded:** a foreign `PRODUCER_CANCELLED` from another test in the same kernel binary, stamped while the cancel test's trace is enabled, would read as an inversion with an arbitrary gap (`engine/src/trace.rs:90-98`, `:199-202`). Entry 1122b's five gaps under 2 µs fit H1 better. That is a reading, not a proof (OPEN-4 as drafted).

**5.5 Invalidators** (each a stop, to the advisor):
- T1 or T2 not red at C1 for its own message;
- any test running to its deadline at C2;
- any ordering or presence failure at C3;
- the architect finding that item 2's budget changes (§0.4);
- any need for a file outside §7 or for a dependency.

**5.6 Falsification:** inversions at C3 while T1 and T2 are green. H1 is then not, or not only, the cause.

## §6. Instruments

- Every quantity is an assertion: counts, offset order, flag state, typed outcomes.
- The campaign figures are counts of runs and failures, not measurements.
- Nothing is timed against `docs/08`. The 100 ms assertion in `slice.rs` and the 5 s bound in `skp_admission.rs` exist already and are unchanged.

## §7. Declared values and ceilings

- **Test-only values,** each declared at its site: I2 K = 8, M = 200; I3 M = 200; I4's fixture spec; campaign N = 50 per kernel binary at C1 and at C3. No product constant.
- **Scope (8 files):**
  - `engine/src/cancel.rs`
  - `engine/tests/cancel_request_stamp.rs` (new)
  - `engine/tests/slice.rs` (the one assertion at `:900`)
  - `kernel/tests/skp_admission.rs`
  - `kernel/tests/skp_filter_cancellation.rs`
  - `docs/adr/ADR-018-what-cancellation-acknowledged-means.md` (the appended note only)
  - `kernel/CANCELLATION-AND-TRACING.md` (the note appended to §2 only)
  - `engine/README.md` (the owner's index, pointers only, written by lead-data on request)
- **Line budget:** at most 800 changed lines (insertions plus deletions under §21c's rule, this form excluded), counted by `git diff --numstat origin/main...HEAD -- engine/src/cancel.rs engine/tests/cancel_request_stamp.rs engine/tests/slice.rs kernel/tests/skp_admission.rs kernel/tests/skp_filter_cancellation.rs docs/adr/ADR-018-what-cancellation-acknowledged-means.md kernel/CANCELLATION-AND-TRACING.md engine/README.md` at a named commit. An overrun is class 8, and this line is never edited.
- **Node budget, restated:** 480 minutes, in place of the placed 240, the campaign included. If the first ten C1 runs project the campaign past the budget, the worker reports the projection to the custodian before going on.

## §8. Block-on-sight

1. A retry, sleep, longer timeout or skip added to any test without a line of its own (§2.7, §2.8; ADV-2026-11-22-01 item 2).
2. A wrapper removed without T1 and T2 red at C1 and green at C2, and without the C3 counts.
3. The presence `expect`s merged into, weakened by or replaced with the ordering assertion; either question's assertion removed.
4. Any edit to `Cargo.toml` or `Cargo.lock`.
5. Any of these edits:
   - any existing line of ADR-018 or of `kernel/CANCELLATION-AND-TRACING.md` edited;
   - a note there in words other than the advisor's ruled text;
   - a note landed before that ruling;
   - any other ADR touched;
   - `engine/src/trace.rs`'s `CANCELLATION_REQUESTED` doc edited.
6. A hook compiled into the shipped build; a new `pub` item.
7. Any SeqCst access to `cancelled` or `in_execute` weakened.
8. A `mark` in a per-row loop.
9. `transition` held while the slot is taken, or `cancel_inner` called under `CURRENT`.
10. A wire byte, user-visible string or walkthrough row changed.
11. A file, or a part of `engine/tests/slice.rs` other than §2.6's assertion, changed outside §7's Scope.
12. A merge before the v0.2 tag, or without the check for changes on main.

## §9. Gates

- **Architect, the form's gate:**
  - §0.4's reading and §2.9's proposed text, read against ADR-018 items 1 to 3, with the clause table;
  - whether the fix changes what item 2 budgets (a stop if so);
  - `docs/01` principles 7 and 8; ADR-010 rule 6; ADR-004 Amendment 4;
  - the seam rule against §0.3; §2.10; §8 item by item.
- **Advisor:** rules the two notes' words, from the architect's text, before the build's gate (ADV-2026-11-22-04 item 1).
- **Reviewer and architect, the build's gates:**
  - the full diff, the notes read as ruled;
  - §2.2 against the code;
  - every mutation of §4.3 observed by name;
  - the campaign logs against §4.4.
- **Suites:** §4.5, green at C4 on the branch, three-dot range.
- **Operator:** none.

**Working section: the testing paragraph, as written** (the human's message, line 49; also in each worker brief, ADV-2026-11-22-01 item 10):

Testing while writing the code: run the smallest test that exercises the changed behaviour while the worker can still use the result. For a behavioural fix, show it red for the intended reason and green after the fix. Use an installed-session check only for a claim that depends on the installed integration. This adds no permanent watcher, full-suite-on-edit rule, or extra gate.

## §10. Amendments: opens empty, append-only

*(empty)*

---

## What I could not settle

- **The design note's placement.** ADV-2026-11-22-04 item 1 places the note at the end of §2. Inserting it there moves every later line of `kernel/CANCELLATION-AND-TRACING.md`, and many records cite that file by line. Most cites I saw are pinned `@ <commit>`, so they are stable. I did not check every one. One entry in `scripts/plan/verify-cites-legacy-bound.json:11` names a `kernel/CANCELLATION-AND-TRACING.md:155-269` cite from a gates file. If `verify:cites` at the branch fails on a cite outside the Scope, the fix would need a file the Scope does not hold. The draft's default is the end of §2, with `verify:cites` run before the note's commit. On a failure, the choice between the end of the file under a heading naming §2 and a Scope addition is the advisor's, not the worker's.
- **`engine/src/trace.rs:370-371`.** The `CANCELLATION_REQUESTED` doc comment restates the same wording, that `cancel()` returned. The ruling names two notes only, so it stays out of the Scope and becomes the one place still saying "returned". Keeping it out, or adding it as a ninth file, is the advisor's call.
- **M7's determinism** rests on `next_into` reading no flag of its own. I saw no `is_cancelled` call in `engine/src/stream.rs` before `:1794`, but I did not read every path of `next_into`. If M7 does not fail the slice test deterministically, that is recorded as class 2, and the slice assertion then has only M1's probabilistic coverage.
- **The node's budget of 480 minutes** is my estimate. The campaign's machine time is unmeasured.
- **I4's opening call.** I did not read `Dataset::stream_with_cancel`'s full signature or the open call I4 needs. The worker uses whatever the engine's public API offers, as `engine/tests/slice.rs` and `kernel/tests/trace_spans.rs` do.
- OPEN-4 and OPEN-5 stay as drafted (§5.4; §2.2 on never blocking the canvas). OPEN-3 and OPEN-6 are as the custodian took them (§4.4, §7).
- No `sha256` here is computed. Every pin is left for the custodian's script.
