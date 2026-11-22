# lead-data's draft of the cancel node's form Amendment 1, under ADV-2026-11-22-07, its final message as handed back

*Filed by the custodian from lead-data's subagent transcript (its hand-back at 2026-11-22T06:05:16.994Z), 19348 bytes, sha256 0b4953a457242e17ee511ee22a55eda4d05330be0e01bc92a80cb09275f05253, below the rule unchanged. A draft, never Authority. The committed amendment is Amendment 1 of governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md: this draft's text from its heading to its closing line, with three changes by the custodian's script: item 2's placeholder replaced by the ruled texts' references; a pins line after the C1 paragraph; one sentence at the end of item 1's lead.*

---

### Amendment 1 — 2026-11-22 — the architect's form gate: C1 in its words; D1 to D8, N3 and N4 closed before dispatch

Made before any code. No outcome has been seen. The gate is `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md`, cited below by its own finding ids and sections. Code references are to 16c896558ac9073f132336f4c9cbcff5b31d8514. The worker re-derives each one at the branch base, as the header requires.

1. **C1, in the architect's words. It supersedes §0.4's two widening bullets.** The paragraph below is the architect's proposed paragraph under its C1, byte for byte, without its blockquote marker. It is not the human's wording, so it applies with no re-gate (`governance/AUTONOMY.md` §31, item 2 (d)). The custodian adds the hash pins on a separate line.

**Amendment 1 (2026-11-22, before any code; the architect's form gate, C1).** §0.4's two "By how much it widens" bullets understate both widenings, because they leave out the request stamp's own `trace::mark`, whose `CURRENT` lock is taken before its clock read and whose buffer lock is taken after it (`engine/src/trace.rs:313`, `:150-151` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), and they are superseded by this amendment. Against the call's return, the interval widens by everything after that clock read: the rest of the mark and its two lock releases, the publication, the release of `transition`, the interrupt slot's mutex (held by `attach` and by the re-interrupter across DuckDB's interrupt, `engine/src/cancel.rs:251-267`, `:167-174`), DuckDB's interrupt when a query is bound, and the re-interrupter's spawn when an execute is in flight, none of it bounded or measured here. Against today's stamp, which is taken after the publication (`engine/src/cancel.rs:133-135`), it widens by the whole request mark, its two mutex waits included, plus one SeqCst store, in the conservative direction only, so §0.4's reading that item 2's budget is unchanged stands.

2. RULED TEXTS: recorded by the custodian's script

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

---

**What I could not settle**

- **No STOP.** No correction changes item 2's pair or budget, or the node's 480 minutes. Item 10 adds one constant, and item 3 adds about 5 lines under the unchanged 800 ceiling.
- **I have not read ADV-2026-11-22-07.** It is not in the read worktree. Items 2, 3, 12 and 15 follow the coordinator's paraphrase, and the file governs.
- **Pins in the C1 paragraph.** The architect's cites `engine/src/cancel.rs:251-267`, `:167-174` and `:133-135` carry no `@` in its own bytes. The custodian's pins line should cover them at 16c896558ac9073f132336f4c9cbcff5b31d8514. I put that paragraph at column 0, not indented under item 1, so its line matches the source byte for byte.
- **§7's count command.** §7 says its line is never edited. Item 3 supersedes the command's path list and leaves the 800 ceiling unchanged. Whether that counts as an edit is the gate's call.
- **Item 17 is not in the brief.** I added the superseded index because round 12 (e) in `.claude/agents/architect.md` asks a correction round to end with one.
- **Items 9 and 12 are my own design choices, for the gate to check.** These are M4's definition (step 2's check removed) and the first-call-only hooks. Without the hook rule, M4's results on T5 and T8 depend on how the hooks are built.
- **M2's kill list adds T2 to the architect's.** That follows from placing M2's hooks where C1 places them. M4's list adds T3 (the loser's own stamp).
- **`kernel/src/lib.rs:745` holds no lock itself.** It is reached under `tickets` through `kernel/src/skp.rs:353` and `:392`. I wrote it that way, not as a caller that holds a lock.
- **Callers I did not read.** These are the data-plane callers of `SourceCancel::cancel` (`protocol/data-plane/src/adapter_ws.rs`), which are outside engine/ and kernel/. I saw only their lines in a search, not what locks they hold.
- **kernel/README.md.** Its index might gain this form under the list of kernel halves of pieces filed elsewhere. That would be a tenth Scope file. I drafted nothing for it, and the custodian or the advisor decides.
- **The residual in `skp_filter_cancellation`.** I did not check whether that binary carries the same risk of a foreign stamp. Item 15 names only `skp_admission`, as the ruling does.

---

Result: Amendment 1 is drafted. It has 17 items, ending in the two closing lines, and it includes the coordinator's ADV-2026-11-22-07 changes (the ninth file, the N2 item, the build-record lines). No STOP.
Blocking questions: none.
Report path: state/drafts/2026-11-22-cancel-requested-stamp-order-form-amendment-1-lead-data-draft.md (the custodian files this message by script).
sha256: not computed. I have no shell, so the custodian records the hash at filing.
