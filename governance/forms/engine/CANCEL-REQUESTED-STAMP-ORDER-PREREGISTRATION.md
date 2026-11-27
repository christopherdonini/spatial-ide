# The cancel tests' node: CANCELLATION_REQUESTED stamped before the cancelled flag is published, the two ATTEMPTS wrappers, and the inversion hidden in the slice budget test (full form)

- **Path (proposed):** `governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `cancel-requested-stamped-before-the-flag-and-the-attempts-wrappers`, its whole summary (cited by id).
  - The human's message of 2026-11-22, item 1: `state/directives/2026-11-22-the-humans-message-the-idle-time-work-flaky-tests-are-findings-the-cancel-node-subagent-compaction-guardian-and-monitor-a-property-testing-trial.md:17-24` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:5550f6db39b8d6a66e7f8fa78e0805d68c612706231da0dae7561444411fba7b. Its testing paragraph is `state/directives/2026-11-22-the-humans-message-the-idle-time-work-flaky-tests-are-findings-the-cancel-node-subagent-compaction-guardian-and-monitor-a-property-testing-trial.md:49` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:ccf9d59364036a7d53f7a8d29da175f2889034e85adc87e6304d8e7bf7cf26c6, in the same file.
  - ADV-2026-11-22-01, items 2, 3, 8, 9 and 10. It is the advisor's ruling under the human's delegation of 2026-11-13, not the human's words: `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-01-the-pieces-of-the-humans-message-placed-the-two-drafts-filed-on-main-before-their-ids.md:16-27` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:db9d854f52e67c9588751400f254efb71b8a53c32f7cb872b5202db2b8570cdf and `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-01-the-pieces-of-the-humans-message-placed-the-two-drafts-filed-on-main-before-their-ids.md:43-47` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:f7599452bfd6ef09495694cc7678889bf2e2cd30b5d2673bd1eaa6855af68355.
  - ADV-2026-11-22-04, items 1 to 4, likewise the advisor's ruling under the delegation and not the human's words: `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-04-the-cancel-forms-open-1-an-appended-note-to-adr-018-the-slice-assertion-joins-the-scope.md:11-21` @ 4a301df7a7d8fbd52b1bcb5a028e8311b2226fe0 sha256:bd4f4eb36d61a4bdc6934d1698c707817ee49a5561f15751b9a55ede62db67e3. Under its item 5, the ADR note goes into the human's digest, for the human to overturn.
  - The finding is ledger entry 1122b in `state/CUT-STATE.md`, cited by entry: the test `cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock`, revision 624eb45cd4df328ff1acdc9c1e58eb1c75d36339, five of five attempts, Product CI Rust run 44461774255. The slice assertion is attached to this node in the ledger (ADV-2026-11-22-04 item 2).
  - This node replaces ADV-2026-11-21-15 item 3 (iii): `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md:18` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:53da2dce556169b1fbafafc45957b718d6a8023c7fd5cf35041d4976f9002913.
- **Drafted by** lead-data, read only, on the custodian's briefs. The scratch brief files are evidence only and never Authority. First draft at main 662ea259; this revision at main eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7, after ADV-2026-11-22-04.
  - Every `@ eb47ee33…` pin is historical: it is authoritative for what this form read. For the code a commit edits, that commit's base tree is authoritative. The worker re-derives every cite it touches at the branch base: the main commit the worktree is fast-forwarded to at dispatch, which holds this form, named in the dispatch record.
  - The code lines cited here read the same at eb47ee33 as at 662ea259 by a content check of `engine/src/cancel.rs:133`, `:152`, `engine/tests/slice.rs:900`, `kernel/tests/skp_admission.rs:927`, `kernel/tests/skp_filter_cancellation.rs:270`, ADR-018 `:45` and `kernel/CANCELLATION-AND-TRACING.md:48`. That is a spot check, not a diff.
- **Hashes.** Every sha256 after a pin was filled in by the custodian's script before commit: the sha256 of the cited lines at the pinned commit, each line with its newline, as `scripts/plan/verify-quotes.mjs` checks it. The pin of §0.3's list names a commit only.
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

- Worktree `C:/dev/wt/cancel-stamp` on `cut/cancel-stamp-order`, created from 662ea259eac2e5fd1f47e83cbee0eea3d17430b5 and fast-forwarded to main at dispatch.
- Build output `D:/wt-targets/cancel-stamp`, given as `CARGO_TARGET_DIR`.
- The tests create their own fixtures under `<worktree>/target/fixtures`:
  - `kernel/tests/skp_filter_cancellation.rs:43-46` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:4dffa0ba99bc9f40a549db88b9de214a49ac468bb3bcfbce288102aeb3e63939;
  - `engine/tests/slice.rs:24-27` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:e9f3bcd2474559a62f60da5a3f5e5c993392309b5a876f1f8699bb15c2f9ee91.
- Re-check (paraphrase of a draft step). After the first test run and before any campaign run, the worker records that `C:/dev/wt/cancel-stamp/target` and its `fixtures` folder are plain folders and not links, with their resolved paths. A link, or a path into `D:\spatial-ide\target` or the sitting's fixtures, stops the piece.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run, and nothing has been measured. The 5 GB fixture is not used.
- **Hypothesis H1,** the cause the test's comment and the human's item 1 give: `cancel_inner` publishes the flag before it stamps. Evidence: `kernel/tests/skp_admission.rs:766-778` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:65a166e59ae6d280b8c59a443c3fa83766ccf87998748b8226b956b52444f3ff; `engine/src/cancel.rs:132-136` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91.
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

**0.3 The interfaces as read** (the seam rule; all @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7):
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
- ADR-018 item 1 defines `cancel_requested` as the moment the cancellation call returns to its caller: `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:45` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:604ad3d56b4a21f39cd69a0e08ba17a86e6fccf0fa4cfd3c4dabe9f672487d93. The design note's row is the same: `kernel/CANCELLATION-AND-TRACING.md:48` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:423eb42caf31d54c3f12aa2cb6dfba773ea4c494c9dc2382db03e753de428da2.
- The code stamps inside the call, after the flag is published and before the interrupt and the return (`engine/src/cancel.rs:133-145` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:30d99b519929da7fb0055a5bb31947157dca30a6c1715154e594a87d5d50c096). The fix stamps inside the call, before the flag is published. Neither is the return.
- **The reading the fix relies on:** the instant is stamped inside the call, before the flag is published. So it precedes every observation of that flag. And the interval that ADR-018 item 2 budgets (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-65` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:9be4c73980bb8157cc300a12d1f3cf0fdcbdc929af93ffdd12a8ab45eadc8a0d), measured from it, is never shorter than one measured from the call's return.
- **By how much it widens, in kind:**
  - **Against the call's return** (the ADR's words): by the rest of the call after the stamp. That is the flag's publication and the transition lock's release (code-controlled, a fixed number of steps); taking the interrupt slot's mutex, which `attach`, `detach` and the re-interrupter each hold for one statement; DuckDB's `InterruptHandle::interrupt` (external, class (b) in ADR-018 item 4's terms); and, when an execute is in flight, `std::thread::Builder::spawn` of the re-interrupter (the OS's, class (b)). None of this is bounded here and none is measured.
  - **Against today's stamp** (the point every recorded figure was measured from): by the publication alone, one SeqCst store and a lock release. Every other step after the stamp sits after it today as well.
- **The draft's reading of what item 2 budgets:** unchanged. Item 2 scores the same pair of instants (`cancel_requested` → `cancel_observed`), stamped at the same call site. The stamp moves earlier, inside the call, by the publication. No recorded figure is rescored, as ADR-018's Consequences already provide for existing measurements (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:125-129` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:41613b9bfcbf1d16d771c6769e5207a8270bae606ab3d665b2be5c51c5acfeb6, paraphrased).
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
  - A loser that returned at once would also break the existing guarantee that `is_cancelled()` is true once `cancel()` returns (`engine/src/cancel.rs::tests::cancellation_is_visible_and_sticky`, `engine/src/cancel.rs:366-374` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:d7e2302172d240babd5fb20ca6284b62b5cc1f317d88995f89f33ed56a041a93).
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
  - **(b) order:** one `assert!(observed.offset_nanos >= requested.offset_nanos, …)` with its own message naming both stamps and their offsets. It replaces the `Err` return at `kernel/tests/skp_admission.rs:935-940` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:c47d13de800713ef385647246957219b5b26bf1d66b0dc2328a0be52487164c7 and `kernel/tests/skp_filter_cancellation.rs:275-280` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:c47d13de800713ef385647246957219b5b26bf1d66b0dc2328a0be52487164c7. Equal offsets pass.
- `kernel/tests/skp_admission.rs:943-948`, the existing 5 s sanity bound, stays unchanged.
- **Stop.** If C1 is not red for the intended reason (§4.1), or the C3 campaign shows any ordering failure, the wrappers stay exactly as they are and no assertion is removed or replaced. The piece goes to the advisor with the evidence. That decision is neither the worker's nor the gate's (ADV-2026-11-22-01 item 3).

**2.5 Both producer-reach checks, preserved byte for byte** (question (a)):
- `kernel/tests/skp_admission.rs:926-931` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:1b4085953a3c0d7cc9f349a061eef79a14dcf9067d9a7a9968192330c69ed002. With it: `:892-895` (`CancelState::Requested`) and `:914-919` (the terminal code).
- `kernel/tests/skp_filter_cancellation.rs:269-274` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:7501e797b2b64f6082560ca7c9aab09a35ddedb3cbb34d84eea94942e545a2f7. With it: `:244-247`.

**2.6 The slice budget assertion** (ADV-2026-11-22-04 item 2):
- `engine/tests/slice.rs:900` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:9cb51055d6d0979ff42eea1909a3eee055f3bad154ac564263c7fe20483ee732 becomes an ordering assertion with its own message, naming `cancel_observed` before `cancel_requested` and both offsets. That is followed by the exact subtraction, and the 100 ms assertion at `:901-904` stays unchanged.
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
- **Today** (`engine/src/cancel.rs:132-136` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91):
  - `cancel_for_drop`'s `swap` sets the flag, and `stamp` is false, so there is no stamp.
  - The later `cancel()`'s `swap` returns `already = true`, so `stamp && !already` is false and again there is no stamp.
  - **No stamp follows the flag:** the token's trace carries no `cancel_requested` at all.
- **After the fix:** the same. Step 2 finds the flag set, and the later `cancel()` stamps nothing.
- **What the trace promises in that order:**
  - no `CANCELLATION_REQUESTED` for that token;
  - so no span or derived interval opening on it: `segment_ms` returns `None` and `spans()` omits the span. It is absent, never zero and never negative (`engine/src/trace.rs:204-234` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:4095d59167a2ccc0dbcc0cb565a9d63657f27cdad3461dcebc864056c717ed2b);
  - a `PRODUCER_CANCELLED` may still appear when the dropped stream was still producing. It is an observation with no request in the trace, and ADR-018 item 2's interval cannot be derived for it. That is unchanged.
  - For a stream that ran to completion, the trace holds neither stamp (`kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant`, `kernel/tests/trace_spans.rs:316-368` @ eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 sha256:84f0eb14f68b4fdee0f653f0f8251946d1c51841365bd6ce33df9c4e7782ae3b).
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

## §10. Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-11-22 — the architect's form gate: C1 in its words; D1 to D8, N3 and N4 closed before dispatch

Made before any code. No outcome has been seen. The gate is `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md`, cited below by its own finding ids and sections. Code references are to 16c896558ac9073f132336f4c9cbcff5b31d8514. The worker re-derives each one at the branch base, as the header requires.

1. **C1, in the architect's words. It supersedes §0.4's two widening bullets.** The paragraph below is the architect's proposed paragraph under its C1, byte for byte, without its blockquote marker. It is not the human's wording, so it applies with no re-gate (`governance/AUTONOMY.md` §31, item 2 (d)). Attempt 2 reads it with the rest of this amendment (ADV-2026-11-22-07 item 4). The custodian adds the hash pins on a separate line.

**Amendment 1 (2026-11-22, before any code; the architect's form gate, C1).** §0.4's two "By how much it widens" bullets understate both widenings, because they leave out the request stamp's own `trace::mark`, whose `CURRENT` lock is taken before its clock read and whose buffer lock is taken after it (`engine/src/trace.rs:313`, `:150-151` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), and they are superseded by this amendment. Against the call's return, the interval widens by everything after that clock read: the rest of the mark and its two lock releases, the publication, the release of `transition`, the interrupt slot's mutex (held by `attach` and by the re-interrupter across DuckDB's interrupt, `engine/src/cancel.rs:251-267`, `:167-174`), DuckDB's interrupt when a query is bound, and the re-interrupter's spawn when an execute is in flight, none of it bounded or measured here. Against today's stamp, which is taken after the publication (`engine/src/cancel.rs:133-135`), it widens by the whole request mark, its two mutex waits included, plus one SeqCst store, in the conservative direction only, so §0.4's reading that item 2's budget is unchanged stands.

*The custodian's pins for the paragraph's own cites, at the code commit above:* `engine/src/trace.rs:313 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:10e79278eff4c7a01217f3599557168e28f9226d488461bea2d1e64411811a7c`, `engine/src/trace.rs:150-151 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:309f167f7a46c270f5482fa516322c54c496432a1c2a9badf458f7f71bc72b88`, `engine/src/cancel.rs:251-267 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:9eaca64840de4110690560fff81695bffe8dc7577449f8233781f0c738763b9a`, `engine/src/cancel.rs:167-174 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:20217086647a26ae32adc2d4a1ad6ac4e575c058e24cc74d023cc4ee4ee10f5f`, `engine/src/cancel.rs:133-135 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:3fbe4bf37d68dec930cd20a427d0bcd6be4c504fd767d29f8bb6137007d17d83`.

2. **RULED TEXTS: ADV-2026-11-22-07 items 1 to 3, recorded by the custodian's script.** The ruling is filed at `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-07-the-cancel-forms-notes-in-the-architects-words-the-ninth-file-attempt-2-on-amendment-1.md`, and its file governs. Each text is the architect's, in its report as filed on main. Each reference below is checked over the lines it names, each line with its line feed, and its hash is the ruling's.
   - **(a) The ADR-018 note.** It is appended after the last line of `docs/adr/ADR-018-what-cancellation-acknowledged-means.md`: a blank line, a line `---`, a blank line, the heading below, a blank line, then the body. The heading is the advisor's (the ruling's item 1 (a)), byte-copied from the ruling by script:

```text
## Note (2026-11-22, the advisor's ruling ADV-2026-11-22-07 under the delegation of 2026-11-13): where `cancel_requested` is stamped
```

     The body is `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md:100 @ eb1329edde00318444f589c136b34c550cae159c sha256:3b06d7a482457338179dadc14d090060f9af6f69a4eec32df7e502228b48bcf1`.
   - **(b) The kernel note.** It is appended at the end of `kernel/CANCELLATION-AND-TRACING.md` as its section 10: a blank line, a line `---`, a blank line, then `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md:126-130 @ eb1329edde00318444f589c136b34c550cae159c sha256:29254115ab31c94be206bbb8ebb8c78c7b589f6591d81a46ce0eacb2f4f8197e` (the ruling's items 1 (b) and 2).
   - **(c) The ninth file's sentence.** `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md:218-220 @ eb1329edde00318444f589c136b34c550cae159c sha256:7fb56c15cff5dd0cf3e71f738688d18f867795d0739235c7089885a5660c6258` replaces the two doc-comment lines above `CANCELLATION_REQUESTED` that say `cancel()` returned to its caller, `engine/src/trace.rs:370-371 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:b37efc210ccaeefde456ed1bde51775ae945328fb31b47ccac9d1b9dc88939fb` (the ruling's item 3). Nothing else in that file changes.
   - **(d)** No existing line of either note's file is edited. Both notes and the sentence are in the piece's own diff, in the same pull request as the fix. If the build changes where or how often the instant is stamped, the notes' words go back to the advisor before the build's gate (the ruling's item 1 (d)).
   - **(e)** The ruling's item 5 withdraws its item 3 of ADV-2026-11-22-04: after a drop, a real `cancel` stamps nothing, because it finds the flag set. The form's answer and the tests it names stand.

3. **ADV-2026-11-22-07 item 1, as ruled. It supersedes §1's ADR-text bullet in part, §2.9's placement, §7's Scope and count command, and §8 item 5's last bullet.**
   - **The kernel note** is appended at the end of `kernel/CANCELLATION-AND-TRACING.md` as its §10, not at the end of §2. It replaces §2.9's second placement bullet and the matching clause of §1's ADR-text bullet. ADR-018's placement does not change. Both notes take the ruled texts in item 2. This item does not restate their words.
   - **The ninth file.** `engine/src/trace.rs` joins the Scope for one thing only: the first sentence of the doc comment above `CANCELLATION_REQUESTED` (`engine/src/trace.rs:370-371` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), replaced by the ruled text in item 2. This supersedes §1's sentence that says those lines are not edited. It lands in C4 with the two notes, because it states a fact that holds only after C2.
   - **§7's Scope, 9 files:**
     - `engine/src/cancel.rs`
     - `engine/src/trace.rs` (that one sentence only)
     - `engine/tests/cancel_request_stamp.rs` (new)
     - `engine/tests/slice.rs` (§2.6's one assertion)
     - `kernel/tests/skp_admission.rs`
     - `kernel/tests/skp_filter_cancellation.rs`
     - `docs/adr/ADR-018-what-cancellation-acknowledged-means.md` (the appended note only)
     - `kernel/CANCELLATION-AND-TRACING.md` (the appended §10 only)
     - `engine/README.md` (the owner's index, pointers only; item 8)
   - **The line count** is taken by `git diff --numstat origin/main...HEAD` over those nine paths, at a named commit. The ceiling stays at 800 changed lines. The ninth file adds about 5 lines (+3/−2, the architect's estimate in its section 5). An overrun is still class 8.
   - **§8 item 5's last bullet now reads:** any edit to `engine/src/trace.rs` other than that first sentence, or that sentence in words other than the ruled text.

4. **D1, the internal pointers. It supersedes four pointers.**
   - §1's ADR-text bullet points at §2.8. The notes are in §2.9.
   - §2.2 (c) points at §2.9. The right section is §2.10.
   - §1 and §2.9's placement paragraph each point at the last section. That was the draft's open-questions list, which is outside the form. Both pointers now resolve to ADV-2026-11-22-07 item 1, recorded in this amendment's items 2 and 3.

5. **D2, the tool claim. It supersedes the Hashes line's clause on `verify-quotes.mjs`.**
   - The behaviour is pinned to `scripts/plan/verify-quotes.mjs:663-674` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 and `scripts/plan/verify-quotes.mjs:802-806` @ 16c896558ac9073f132336f4c9cbcff5b31d8514.
   - At that commit, the tool slices lines a to b, each with its own LF. The one exception is a file's last line when the file has no final newline. The tool then compares the slice's sha256.

6. **D3, the seam list and the lock order. It adds to §0.3 and supersedes §2.2's lock-order bullet.**
   - **More sites where the producer sees the flag.** Each has a SeqCst `is_cancelled` load that read true, then a mark:
     - the per-row exit, `engine/src/stream.rs:1981-1993` @ 16c896558ac9073f132336f4c9cbcff5b31d8514;
     - `classify_fetch_panic`, `engine/src/stream.rs:2652-2658` @ 16c896558ac9073f132336f4c9cbcff5b31d8514, which goes through `classify`'s load and mark at `engine/src/stream.rs:2636-2639` @ 16c896558ac9073f132336f4c9cbcff5b31d8514.
   - **The publish observer.** `kernel/src/publish/mod.rs:1042-1070` @ 16c896558ac9073f132336f4c9cbcff5b31d8514: `check` and `observe_if_cancelled` load the flag, and `observe` marks `CANCEL_OBSERVED`.
   - **Other readers of the request stamp:**
     - `engine/src/stream.rs:3264-3272` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 asserts that the segment exists;
     - `kernel/tests/first_batch_factorial.rs:1382-1385` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 and `kernel/tests/first_batch_factorial.rs:1517-1520` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 take `segment_ms`, which drops an inversion as absent (`engine/src/trace.rs:216-218` @ 16c896558ac9073f132336f4c9cbcff5b31d8514).
   - **Callers of `cancel()` that hold a registry lock:**
     - `kernel/src/skp.rs:353` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 and `kernel/src/skp.rs:392` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 hold `tickets`, taken at `kernel/src/skp.rs:323` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 and `kernel/src/skp.rs:370` @ 16c896558ac9073f132336f4c9cbcff5b31d8514. They reach `CancelToken::cancel` through `EngineCancel::cancel` at `kernel/src/lib.rs:745` @ 16c896558ac9073f132336f4c9cbcff5b31d8514. That call takes no lock of its own. Its `notice` lock (`kernel/src/lib.rs:747` @ 16c896558ac9073f132336f4c9cbcff5b31d8514) comes after `cancel` returns.
     - `kernel/src/skp.rs:963` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 holds `inflight`, taken at `kernel/src/skp.rs:958` @ 16c896558ac9073f132336f4c9cbcff5b31d8514.
   - **The lock order** is registry → `transition` → `CURRENT` → buffer. Those words are byte-copied from `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md:175` @ eb1329edde00318444f589c136b34c550cae159c. Two more edges come after `transition` is released: registry → the interrupt slot (`engine/src/cancel.rs:137-141` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), and registry → `notice`.
   - **Why there is no cycle.** Under `transition`, nothing takes a lock other than `CURRENT` and the buffer (`engine/src/trace.rs:312-316` @ 16c896558ac9073f132336f4c9cbcff5b31d8514, `engine/src/trace.rs:149-165` @ 16c896558ac9073f132336f4c9cbcff5b31d8514). The code that takes `CURRENT` (`engine/src/trace.rs:329-339` @ 16c896558ac9073f132336f4c9cbcff5b31d8514, `engine/src/trace.rs:353-357` @ 16c896558ac9073f132336f4c9cbcff5b31d8514) takes no registry lock and calls no `cancel`. `transition` is never held while the slot is taken.

7. **D4. It supersedes §2.10's clause about `spans()`.**
   - No entry in `SPANS` opens on `CANCELLATION_REQUESTED` (`engine/src/trace.rs:538-552` @ 16c896558ac9073f132336f4c9cbcff5b31d8514).
   - The corrected clause: no segment opening on that stamp is derivable, and `segment_ms(CANCELLATION_REQUESTED, _)` returns `None` (`engine/src/trace.rs:209-211` @ 16c896558ac9073f132336f4c9cbcff5b31d8514). The value is absent, never zero and never negative.

8. **D5. It supersedes the writer named in §7's `engine/README.md` bullet.**
   - The worker writes the owner's-index update inside the Scope, as pointers only, under the rules at `engine/README.md:535` @ 16c896558ac9073f132336f4c9cbcff5b31d8514. lead-data is read only and writes no file.
   - The update covers this form's path in the preregistration list (`engine/README.md:557` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), any new pinning test the worker adds to the Cancellation row (`engine/README.md:544` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), and the last-verified line. The build's gates read it.

9. **D6, the full kill lists. They supersede §4.3's M1, M2, M4 and M5.** Any other failure is recorded if seen, never claimed as a kill.
   - **M1** (at C2). Inside the lock, the order is: the publication, `after_publish`, `before_stamp`, the mark, `on_stamp`, then the release. This mirrors C1's placement.
     - It kills T1: `on_stamp` finds the flag set.
     - It kills T2: the observer at `after_publish` finds a count of 0.
     - It does not kill T3 to T8, I1, I2 or I4. Their stamps stay once-only and the flag stays published.
   - **M2** (at C2). `transition` is removed, a `swap` makes the claim, and the hooks sit where C1 places them (`after_publish` between the swap and the mark).
     - It kills T1 and T2, as at C1. These are the property-level kills.
     - It kills T3, T4 and T5 by the deadline message, because `on_contended` never fires. These kills show structure (item 12).
     - T6 to T8, I1, I2 and I4 pass, because the swap claims once and publishes first.
   - **M3** (at C2) kills T8 only. The flag is never stored after the panic.
   - **M4** (at C2) removes step 2's check, so every call runs steps 3 and 4 under the lock, and stamps when `stamp` is true.
     - It kills T3 (the loser's own stamp makes the count 2), T5, T6, T7, I1, I2 and I4.
     - T1, T2 and T4 pass.
     - T8 passes under item 12's first-call-only hooks.
   - **M5** (at C2) ignores `stamp`. It kills T5, T7, I4 and `kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant`. T3, T4, T6 and the other tests pass.
   - M6 and M7 are as registered, with item 13 added to M7.

10. **D7, I3's deadline. It adds to §2.8, §4.2 I3 and §7's test-only values.**
    - **Added timeout (ADV-2026-11-22-01 item 2):** I3's spin on the flag is bounded by a new 60 s deadline. It is a constant declared at I3's site in `engine/tests/cancel_request_stamp.rs`, on its own line.
    - `TEST_LIVENESS_DEADLINE` cannot be imported. It is private to `#[cfg(test)] mod tests` (`engine/src/cancel.rs:326-333` @ 16c896558ac9073f132336f4c9cbcff5b31d8514).
    - The deadline bounds only how long a failing I3 runs. It fails by name, retries no assertion, lengthens no existing wait, and is never reported as a latency.
    - It supersedes §2.8's sentence that no deadline value is added, for this one constant only. The gate reads this line against the human's item 1.

11. **D8. It supersedes §1's third "Not proven" bullet.**
    - The §2.3 hooks exist only in the test build.
    - The shipped build runs the same statements without them, with one exception. The test build also runs `on_contended`'s `transition.try_lock()` probe before step 1. The shipped build takes `transition` with a blocking lock alone.

12. **N2 (ADV-2026-11-22-07 item 5). It adds to §2.3.**
    - `before_stamp` fires in step 3 whether `stamp` is true or false. That is the point inside `transition`, before the publication, where today's mark would be. So T5 can hold a drop inside the lock.
    - A hook that holds or panics does so on the first call that reaches it, and passes every later call.
    - At C1, T3 to T5 are red because the hook site does not exist, not because the property is violated. The same holds for M2's kills of them. T1 and T2 carry the property.

13. **N3. It adds to §4.3's M7.**
    - M7's predicted failure rests on §5.3's clock assumption and on a strict gap.
    - Happens-before orders `PRODUCER_CANCELLED` before the `Err` is sent (`engine/src/stream.rs:1373-1374` @ 16c896558ac9073f132336f4c9cbcff5b31d8514). `next_into` receives that `Err` (`engine/src/stream.rs:799-803` @ 16c896558ac9073f132336f4c9cbcff5b31d8514) before M7's stamp is taken.
    - §2.6's assertion passes when the two offsets are equal. A tie at the clock's resolution is not shown to be impossible. A tie is recorded as class 2 with both offsets.
    - The run must also reach `Err(Cancelled)`, which is the test's existing precondition (`engine/tests/slice.rs:878-883` @ 16c896558ac9073f132336f4c9cbcff5b31d8514).

14. **N4. It adds §8 item 13**, in the architect's words, byte-copied from `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md:262` @ eb1329edde00318444f589c136b34c550cae159c: the `in_execute` load placed before the publication.
    - Step 5's load has to stay after step 4's store. The store-then-load pair with `engine/src/cancel.rs:194` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 and `engine/src/cancel.rs:197` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 depends on that order.
    - Like M6, no test of §4 kills this reordering. It rests on §2.2 and on review.

15. **The build's record (ADV-2026-11-22-07 item 6; the architect's sections 2 and 5). It adds §0.5 and adds to §5.4.**
    - **The disclosure, not a STOP.** In traced runs the fix publishes the flag after the request mark. A flag-polling observer then sees the flag later than today, by that mark's duration (item 1). The interrupt already comes after the mark today (`engine/src/cancel.rs:135` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 before `engine/src/cancel.rs:137` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), and it still does. Untraced runs are the shipped default (`engine/src/trace.rs:88` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), where the mark returns at once (`engine/src/trace.rs:303-305` @ 16c896558ac9073f132336f4c9cbcff5b31d8514). There the only changes are one lock and release of `transition`, contended only by another canceller of the same token, and the swap becoming a SeqCst load and a SeqCst store. No figure is claimed.
    - **The residual.** The `skp_admission` binary runs other tests in parallel. Once its wrapper is gone, a `PRODUCER_CANCELLED` stamped by one of those tests shows red, where today it stays hidden (§5.4). It is not attributed to H1 without evidence (§1). If it shows, it is a finding of its own for the advisor, recorded in the ledger as ADV-2026-11-22-01 item 2 requires.
    - **Where the record states them.** The PR body gives each in one line, citing this item. The closing amendment cites this item by amendment and item, with no prose.

16. **N5. It adds to §2 and §7.**
    - Inside the Scope, the worker updates the doc comments at `engine/src/cancel.rs:100-107` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 and `engine/src/cancel.rs:129-131` @ 16c896558ac9073f132336f4c9cbcff5b31d8514. They are to state §2.1's order: stamped under `transition`, when a trace is running, at most once per token, before the flag is published.
    - The worker also checks the comment at `engine/src/cancel.rs:146-151` @ 16c896558ac9073f132336f4c9cbcff5b31d8514 against `first`.
    - These are the worker's own words, and the build's gates read them.

17. **Superseded index.**
    - §0.3: added to by item 6.
    - §0.4's widening bullets: superseded by item 1.
    - §0.5: added by item 15.
    - The Hashes line's tool clause: item 5.
    - §1's ADR-text bullet: items 3 and 4.
    - §1's third "Not proven" bullet: item 11.
    - §2: added to by item 16.
    - §2.2 (c)'s pointer: item 4.
    - §2.2's lock-order bullet: item 6.
    - §2.3: added to by item 12.
    - §2.8: added to by item 10.
    - §2.9's placement and pointer: items 2, 3 and 4.
    - §2.10's spans clause: item 7.
    - §4.2's I3: item 10.
    - §4.3's M1, M2, M4 and M5: item 9.
    - §4.3's M7: item 13.
    - §5.4: added to by item 15.
    - §7's Scope, count command and writer: items 3 and 8.
    - §7's test-only values: item 10.
    - §8 item 5's last bullet: item 3.
    - §8 item 13: added by item 14.

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — 2026-11-22 — the architect's attempt 2 on Amendment 1: words and pins only

Made before any code. No outcome has been seen. The words are the architect's, from `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect-attempt-2.md`, applied with no re-gate (ADV-2026-11-22-07 item 4). None is the human's wording.

1. Amendment 1 item 3 records ADV-2026-11-22-07 items 1 (b), 2 and 3, not item 1 alone. Its lead now reads: "ADV-2026-11-22-07 items 1 (b), 2 and 3, as ruled."
2. Amendment 1 item 4's third bullet resolves both pointers to the wrong ruling item. §1's pointer, about the doc comment above `CANCELLATION_REQUESTED`, resolves to ADV-2026-11-22-07 item 3 (Amendment 1 items 2 (c) and 3); §2.9's pointer, about the kernel note's place, resolves to that ruling's items 1 (b) and 2 (Amendment 1 items 2 (b) and 3).
3. Amendment 1 item 12's second sentence misplaces `before_stamp`, because today's mark comes after the publication. It now reads: "That is the point inside `transition`, before the publication, just before a call with `stamp` true makes its mark (§2.1 step 3; §2.3)."
4. Amendment 1 item 9's M5 line predicts passes beyond §4's tests. Its last sentence now reads: "T1 to T4, T6, T8, I1 and I2 pass."
5. Amendment 1 item 5's second pin leaves out the comparison line. It now reads `scripts/plan/verify-quotes.mjs:802-807` @ 16c896558ac9073f132336f4c9cbcff5b31d8514.
6. Amendment 1 item 16 changes nothing in §7. Its lead now reads: "It adds to §2."
7. The draft's filing line places the custodian's added sentence at the end of Amendment 1 item 1's lead; it is the lead's second-to-last sentence. Nothing else differs between the draft and Amendment 1 beyond the three changes that line names (read line by line at the architect's attempt 2; the reviewer's byte comparison is the proof).
8. *The custodian's pins for Amendment 1's line references, at the commits they name, one full path per hash, added below by script.* The spans byte-copied in Amendment 1 items 6 and 14 are sub-line spans of `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md` lines 175 and 262 at eb1329edde00318444f589c136b34c550cae159c, and each carries its line's hash.
   - `engine/src/trace.rs:370-371 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:b37efc210ccaeefde456ed1bde51775ae945328fb31b47ccac9d1b9dc88939fb`
   - `scripts/plan/verify-quotes.mjs:663-674 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:68564ca31bd1c771672b2e89b22238459af430b684c710acd477ddbd4b9ee073`
   - `scripts/plan/verify-quotes.mjs:802-806 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:09c5321dbaffc4de97a1beff936352c6cb490867a6b2359b3bdd593a7f9ce4be`
   - `engine/src/stream.rs:1981-1993 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:1bd56d7e38c21185ee661e4582b7fadefd3826cd183209dc90b0adf87fd69be3`
   - `engine/src/stream.rs:2652-2658 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:174c16f3653c8886390bab9e5ae326741a7ea0fbc715c10ccb78846baff50a3f`
   - `engine/src/stream.rs:2636-2639 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:c6855d330ad4711c0c86874a5586ba66fb2b120db930b379b0f95e67f9bebae3`
   - `kernel/src/publish/mod.rs:1042-1070 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:29fcf1899a3090b89be6903b9ade4d91d16fc2e4b55eeb55347a982f788391ac`
   - `engine/src/stream.rs:3264-3272 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:44f8e9f1d81a5479175894c1aea25cc5eda6eb5ea1d977cb1cb1b5f893fea0ff`
   - `kernel/tests/first_batch_factorial.rs:1382-1385 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:daac1262bb7302ffca9e25aef58d1e80d48c1c3d95207a3b852b1815fc75ace9`
   - `kernel/tests/first_batch_factorial.rs:1517-1520 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:daac1262bb7302ffca9e25aef58d1e80d48c1c3d95207a3b852b1815fc75ace9`
   - `engine/src/trace.rs:216-218 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:f91dfe9e32b9fcf3878adec5b4a4dc07818b1136029e86b3ce524ee9590698b1`
   - `kernel/src/skp.rs:353 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:094db9f631da7d01cf4458af89296d6e83ca4ae2eab18d3d90798440fbe77217`
   - `kernel/src/skp.rs:392 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:094db9f631da7d01cf4458af89296d6e83ca4ae2eab18d3d90798440fbe77217`
   - `kernel/src/skp.rs:323 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:f8d7f70f39329e80344a7a13288767770cd5659993360af8386059fe17896cd9`
   - `kernel/src/skp.rs:370 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:f8d7f70f39329e80344a7a13288767770cd5659993360af8386059fe17896cd9`
   - `kernel/src/lib.rs:745 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:7010cebaec8201d1599880f71c4cbcc6c1a76b4ce3511bd84f61ec8536f46e07`
   - `kernel/src/lib.rs:747 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:f21145896067eae89418bdc2e99c7bf1a36b38538438592f0e713c95960446df`
   - `kernel/src/skp.rs:963 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:250fa99f35835a85929c03c378078227577a2d4a04886abe37152728ade1b698`
   - `kernel/src/skp.rs:958 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:a363b42bb5165c9010434a195514579d415345b10ad677c84e52f07d8bfef915`
   - `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md:175 @ eb1329edde00318444f589c136b34c550cae159c sha256:31e08d166b797b77548a85172ad846aa6d8b3a2372ed7fdbaead79f1fd4a5782`
   - `engine/src/cancel.rs:137-141 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:17d825686caee568b67d4d4aaf4b4d3fa79e60010accb68693b73a25424bc000`
   - `engine/src/trace.rs:312-316 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:a6e715174d8ffeb3af79dad5f792fa3785d1f64d9839d54c1ebf0e523141a43a`
   - `engine/src/trace.rs:149-165 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:f7ea7d72f1988a8fb1568d5533a112be7debe853530b1f9fbdee7ee9160cf04b`
   - `engine/src/trace.rs:329-339 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:72cb6e20ff3dded4a83ff1581b36eb55cbfe5906eb7f903715df9f89da3b3ed3`
   - `engine/src/trace.rs:353-357 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:d56cb59025f9ed7d10ecfde77b4d1969351f37e214e45381a3668109340b2d52`
   - `engine/src/trace.rs:538-552 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:30580d2a0b28584cde05c1dd38f255a2d3b621cd4f95d60f6b953348916386da`
   - `engine/src/trace.rs:209-211 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:3c8ca014ea839d66aa337a8b43512b0afbad73ff43cff4ce89538e56275a677e`
   - `engine/README.md:535 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:41f836437120efcc22e26a2cf504a6ec6e5ca415053ec81e11665b8b467b108a`
   - `engine/README.md:557 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:78160eed9b5b427099da7bd13569a6254abcac441379e2b198573690d45d9669`
   - `engine/README.md:544 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:5958fed422a3ce8cbbd3db27be414623d5bbc0a135372ae6840eb579aea398b8`
   - `engine/src/cancel.rs:326-333 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:8b6c8f1839206133029650526f440c5e701ba1f2dd639332bdc297aa9eccb264`
   - `engine/src/stream.rs:1373-1374 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:5013e24bb026218d8111b7ac19d021888309ffa1a213276bef8975e9bcf41ed2`
   - `engine/src/stream.rs:799-803 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:7db8de6d6d89f57dbe07b9abdfe0eac74832b6b470f521c7a0df344cea62bc8a`
   - `engine/tests/slice.rs:878-883 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:e6b8cd16739ab577e180188ec97dcbd226ddbc1267884af56130845d216e32b8`
   - `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md:262 @ eb1329edde00318444f589c136b34c550cae159c sha256:a40858a0fa44911d565bd4fae3f98e9aed9ac04665a42472791aded186b58700`
   - `engine/src/cancel.rs:194 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:7244a5da652767cb50daf18433ae479888b88b7edf4e53f7ee52b4bac938e048`
   - `engine/src/cancel.rs:197 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:a88afad7e8ea0c200495243f38712d91b6483e89711d3e66bdebc342a32466c7`
   - `engine/src/cancel.rs:135 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:98a279bbbac7b3224c31fe03ac1930353e5a8a383cb1ae6fda32fac0477ec9a5`
   - `engine/src/cancel.rs:137 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:5f4dbc18d0b2de1f52ba803992308846637ebfa67dfecd220ea7f5b8f1ab73f7`
   - `engine/src/trace.rs:88 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:ca4aedce41edc82d7097afb1299c606270ec8d2b31fa6a6f78dcdef58991afd7`
   - `engine/src/trace.rs:303-305 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:414978d427b5a0a1d0796b0e36a4c77702fd417db86e4668c443494e247f4a10`
   - `engine/src/cancel.rs:100-107 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:7ae03b9ccd360d7c611810675ac411a65c1e6fcd19a66f93c9b79916d972b598`
   - `engine/src/cancel.rs:129-131 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:50574247d30cd385cdd7acd1f12ebfe8f12aafb010c005f7180c1de641a20f53`
   - `engine/src/cancel.rs:146-151 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:3c4cac4e9a287205c053dd18e690180ce9b3f7836d4a26f2c1b8aac688ec1b0a`
   - `scripts/plan/verify-quotes.mjs:802-807 @ 16c896558ac9073f132336f4c9cbcff5b31d8514 sha256:90703f3f1e117459d8c61de3dfb18935e5c43ccbe983d936147bb6dff6150256`
9. `kernel/README.md` joins the Scope as its tenth file, the owner's index only, pointers only: this form's path in the list of kernel halves of pieces filed elsewhere, and the last-verified line. The worker writes it. The line count is taken by `git diff --numstat origin/main...HEAD` over the ten paths at a named commit; the ceiling stays at 800 and an overrun is class 8. §8 item 11 reads the tenth file as in Scope.
10. Append to Amendment 1 item 15's residual: "`kernel/tests/skp_filter_cancellation.rs` does not carry this risk: its binary holds one test, so once its wrapper is gone no other stream shares its trace."
11. **Superseded index.**
   - §2.8's sentence that no deadline value is added: superseded in part by Amendment 1 item 10 (in place of Amendment 1 item 17's "§2.8: added to by item 10").
   - §2.9's two proposed texts and their clause table: superseded by Amendment 1 item 2.
   - §4's C4 line: added to by Amendment 1 item 3.
   - Amendment 1 items 3, 4, 5, 9, 12, 16 and 17: corrected by items 1 to 6 and this item.
   - Amendment 1's line references: pinned by item 8.
     - §7's Scope and Amendment 1 item 3's count: added to by item 9.
     - Amendment 1 item 15's residual: added to by item 10.

Read the last amendment first.

Nothing above is edited.

### Amendment 3 — 2026-11-22 — the shortened-target list joins the Scope as its eleventh file; the words commit

By the advisor's rulings ADV-2026-11-22-10 item 4 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-10-the-cancel-builds-stop-a-scripts-node-reads-listed-cites-at-a-commit-the-two-code-gates-now.md`) and ADV-2026-11-22-13 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-13-the-cancel-gates-two-texts-for-one-place-the-architects-d1-and-d2-land-doc-1-met-by-them.md`), under the human's delegation of 2026-11-13.

1. **The eleventh file.** `scripts/plan/verify-cites-shortened-target.json` joins §7's Scope as its eleventh file, for its `entries` array only. The node verify-cites-shortened-target-list added it (PR 351, merged by the advisor by merge commit 7ca0a2fd12c0aa58aefcbca87e0cd37068816fdd). The array gains ten entries, one for each unresolved cite in the build worker's report (`state/consults/2026-11-22-cancel-requested-stamp-order-build-worker-report.md`, its verify-cites bullet): seven in this form and three in the two consults it names. Each entry names the citing file, the cite's token as written, and the commit that the rule in the header of `scripts/plan/verify-cites.mjs` names. Nothing else in the file changes, and no cite in this form or in the two consults is touched.

2. **The order.** First the branch takes main in by a merge commit, signed off, never a rebase. Then one commit adds the ten entries and nothing else. At that commit, `node scripts/plan/verify-cites.mjs` exits 0, and §4.5's green `verify-cites` is met there, not at 3f3820c9 (ADV-2026-11-22-10 item 5). If the run at the merge's head names an unresolved cite other than these ten, the worker stops and reports.

3. **The count.** The entries are data, and they count as changed lines like any other line in the Scope. The line count is taken by `git diff --numstat origin/main...HEAD` over the eleven paths at a named commit. After the merge of main the three-dot range starts at the merged main commit, so main's own changes are not counted. The ceiling stays at 800 changed lines, and an overrun is still class 8. §8 item 11 reads the eleventh file as in Scope.

4. **The words commit.** After the entries' commit, one commit applies the architect's D1 to D4 (`state/consults/gates/2026-11-22-cancel-requested-stamp-order-g1-architect.md`, its Documentation section), each in that report's words copied by script, and the clippy line the reviewer's check 9 names (`state/consults/gates/2026-11-22-cancel-requested-stamp-order-g1-reviewer.md`): `spins % 1024 != 0` becomes `!spins.is_multiple_of(1024)`, and nothing else on the line changes. D1 and D2 are taken in place of the reviewer's DOC-1 for the same two comments, by ADV-2026-11-22-13. The closing amendment records DOC-1 as met by them, and that the choice between the two authors' words is that ruling's.

5. **The later commits' read.** The reviewer reads the merge commit, the entries' commit, the words commit and any correction commit once, narrowly (ADV-2026-11-22-10 item 5). For each entry, it checks that the commit is the one the header's rule names. It reads D1 to D4 as applied against the architect's report, and the clippy line as a code line.

6. **Superseded index.**
   - §7's Scope and Amendment 2 item 9's count: added to by items 1 and 3.
   - §4.5's green `verify-cites`: met at the entries' commit, by item 2.

Read the last amendment first.

Nothing above is edited.

### Amendment 4 — 2026-11-22 — the narrow read; the record before the merge request

1. **The narrow read** of the merge of main (51a1c84dd8502c5b9a7295e113f78101923d9c01), the entries' commit (315e44d3cf3ad5f35f4dc33910708bef9e263669) and the words commit (74c06805a61c64485d9bed90118c4aedfa27d9a5), by item 5 of Amendment 3: the reviewer, PASS WITH NOTES, no Correctness, Evidence or Documentation finding (`state/consults/gates/2026-11-22-cancel-requested-stamp-order-narrow-read-reviewer.md`, gate-log row 830). The worker's report is `state/consults/2026-11-22-cancel-requested-stamp-order-merge-entries-words-worker-report.md`. The count is 726 of the 800 changed lines over the eleven Scope paths (Amendment 3 item 3).

2. **CI at 74c06805a61c64485d9bed90118c4aedfa27d9a5:** every check passing, read by the custodian at 2026-11-22T14:14:04Z. This meets the narrow read's N1 (two Windows jobs pending at its own read).

3. **The gates' Documentation items.** DOC-1 is met by the architect's D1 and D2, applied in the words commit; the choice between the two authors' words is ADV-2026-11-22-13's (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-13-the-cancel-gates-two-texts-for-one-place-the-architects-d1-and-d2-land-doc-1-met-by-them.md`). DOC-2: ADV-2026-11-22-10 is filed (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-10-the-cancel-builds-stop-a-scripts-node-reads-listed-cites-at-a-commit-the-two-code-gates-now.md`), which also meets the architect's N5. DOC-3 and the architect's N1: the build report's C1 line (`state/consults/2026-11-22-cancel-requested-stamp-order-build-worker-report.md`) gives one wait message for T3, T4 and T5, while as built T3's and T5's messages differ; the report is filed and not edited, and this item is its correction by reference. DOC-4: C2 (ebdd0fd7ce0100fd621529aeb6fd239faafe6c30) says in its message that it edits the doc comment on cancel_for_drop, and its diff to engine/src/cancel.rs from 4a26ed74 edits none; no commit is rewritten (ADV-2026-11-22-10 item 6). DOC-5: the count stands on the gates' own numstat (code gate 1's check 2; the narrow read's check 5).

4. **The clippy line** (ADV-2026-11-22-10 item 6; the architect's N3) is corrected in the words commit, and the narrow read reads its predicate as the same for every u32.

5. **The campaign's wording** (the architect's N2): at C3 the wrappers are gone, so its evidence is the pass counts, 50 of 50 per binary, not a count of wrapper hits; the C1 campaign showed no detection power for skp_filter_cancellation, 0 hits in 50 runs (`state/consults/2026-11-22-cancel-requested-stamp-order-build-worker-report.md`).

6. **The disclosure and the residual** of ADV-2026-11-22-07 item 6 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-07-the-cancel-forms-notes-in-the-architects-words-the-ninth-file-attempt-2-on-amendment-1.md`) stand as that item gives them, for this build's record. The skp_admission binary passed in CI at 74c06805a61c64485d9bed90118c4aedfa27d9a5 and in both gates' runs.

7. **The stray file** (ADV-2026-11-22-10 item 6): the build worker's 180-byte C4 output, written beside `<S>` and not in it (its report, its departures). A search three levels deep under the sessions' temporary folder found no such file at 2026-11-22T14:02:38Z.

8. **Line cites at the head** (the narrow read's N2): D3 added one line to the doc comment above cancel, so the architect's cancel.rs cites below it, read at 3f3820c9, are one line lower at 74c06805a61c64485d9bed90118c4aedfa27d9a5 (the mark at line 202, drop(publish) at 209). Any later record cites them at a named commit.

9. **The merge request** waits for the v0.2 tag (the human's message of 2026-11-22, item 1). It names any change on main since 069b91e0 to the eleven paths and reads CI again (the architect's N4). Before it, the PR body lists D1 to D4, the disclosure and residual, and C2's message.

Read the last amendment first.

Nothing above is edited.

### Amendment 5 — 2026-11-22 — the stray file was removed

1. **Amendment 4 item 7 is incomplete.** The build worker's 180-byte C4 output was removed by the custodian's own call at 2026-11-22T10:02:49Z, by the main session's transcript: the call read the file, removed it and printed REMOVED, and a listing of its folder then counted no such file. That is why the search at 14:02:38Z found none. The removal is what ADV-2026-11-22-10 item 6 allows ("remove it if your own rules let you").

Read the last amendment first.

Nothing above is edited.
