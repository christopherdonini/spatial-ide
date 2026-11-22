Reviewed: governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md on main at 16c896558ac9073f132336f4c9cbcff5b31d8514, 39323 bytes, sha256 6c14991c25e4bbe5e4e323d1a29eda751c7bf6fe462f73636c42df0778981b97, read in the read worktree (the custodian's filing note, 2026-11-22: the cancel node's architect gate on its full form, attempt 1 (ADV-2026-11-22-01 item 3); Read 35, Grep 21, Glob 2, SubagentHandback 1, by unique call ids; 1 errored (a Grep on a path that does not exist), model claude-opus-5-5, from 2026-11-22T05:25:58Z to 2026-11-22T05:37:32Z by its transcript; the report below byte for byte from its hand-back of 25608 bytes, sha256 c24a4cbe3c9dfb8beb4baee92688ec9c6bce7d593d9a375ea175e1323d97a378), gate, architect
Verdict: FAIL, the cancel node's full form (governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md) on main @ 16c896558ac9073f132336f4c9cbcff5b31d8514

Reviewed: main @ 16c896558ac9073f132336f4c9cbcff5b31d8514, read in the detached worktree C:\dev\wt\gate-read. Every path:line below is at that head. Every proposed word in this report is the architect's, and none is the human's or the advisor's. Text inside double quotes is bytes copied from the file named; everything else is paraphrase.

**Summary.** The gate fails on one item, C1, a limit claim in §0.4. Both of the other blocking items, C1 and C2, are wording only: the code's Correctness and Evidence are closed and the design holds against the code. Replacement words for both are below. Neither is the human's wording: C1 is lead-data's form text, and C2 is lead-data's proposed note text. So under AUTONOMY §31 the words land with no re-gate: C1 as Amendment 1 to the form, and C2 through the advisor's ruling of the notes (ADV-2026-11-22-04 item 1). No STOP for item 2.

---

## Correctness

**C1. §0.4's "By how much it widens, in kind" (form :90-92) states a limit the code does not support.**
- The form says the widening against today's stamp is "by the publication alone, one SeqCst store and a lock release" (copied from :92).
- The code says otherwise:
  - `trace::mark_cold` takes `CURRENT` before the clock is read, and holds it through `push` (engine/src/trace.rs:313-315).
  - `push` reads the clock at engine/src/trace.rs:150, then takes the buffer lock at :151.
  - Today the flag is published first (engine/src/cancel.rs:133). The mark's `CURRENT` wait therefore falls after the publication, which shortens today's interval.
  - After the fix (form §2.1), the rest of the mark (the buffer lock, the push, both releases) and then the store all follow the clock read.
- So the widening against today is the whole request mark, both of its mutex waits included, plus one store. Those two locks are shared with the producer's own marks (engine/src/stream.rs:1795 and the other sites), so the waits are not a fixed number of steps. The transition lock's release comes after the store and is not in the interval at all.
- The bullet against the call's return (:91) leaves out the rest of the mark. It also says the slot mutex is held "for one statement" (copied from :91). In fact `attach` holds it across `handle.interrupt()` (engine/src/cancel.rs:251-267), and so does the re-interrupter (engine/src/cancel.rs:167-174).
- The conclusion of §0.4 still stands: both corrections widen the interval in the conservative direction.
- Not the human's wording. The worker or custodian appends the text below as the form's Amendment 1 before dispatch. No re-gate.

Proposed words (architect's):

> **Amendment 1 (2026-11-22, before any code; the architect's form gate, C1).** §0.4's two "By how much it widens" bullets understate both widenings, because they leave out the request stamp's own `trace::mark`, whose `CURRENT` lock is taken before its clock read and whose buffer lock is taken after it (`engine/src/trace.rs:313`, `:150-151` @ 16c896558ac9073f132336f4c9cbcff5b31d8514), and they are superseded by this amendment. Against the call's return, the interval widens by everything after that clock read: the rest of the mark and its two lock releases, the publication, the release of `transition`, the interrupt slot's mutex (held by `attach` and by the re-interrupter across DuckDB's interrupt, `engine/src/cancel.rs:251-267`, `:167-174`), DuckDB's interrupt when a query is bound, and the re-interrupter's spawn when an execute is in flight, none of it bounded or measured here. Against today's stamp, which is taken after the publication (`engine/src/cancel.rs:133-135`), it widens by the whole request mark, its two mutex waits included, plus one SeqCst store, in the conservative direction only, so §0.4's reading that item 2's budget is unchanged stands.

The hashes go in by the custodian's script, under round 15 (e).

Clause check:

| Clause | Holds at |
|---|---|
| `CURRENT` is taken before the clock read | trace.rs:313 (the guard lives through `push`, :314), clock read at :150 |
| the buffer lock is taken after the clock read | trace.rs:151 |
| the slot is held across the interrupt by `attach` | cancel.rs:251-255 lock, :263-264 interrupt, :266 store |
| the slot is held across the interrupt by the re-interrupter | cancel.rs:167, :172 |
| the interrupt fires only when a query is bound | cancel.rs:137-145 (`if let Some`) |
| the spawn happens only when an execute is in flight | cancel.rs:152; form §2.1 step 5 |
| today's stamp comes after the publication | cancel.rs:133 then :135 |
| the widening is conservative only | the stamp moves earlier relative to a publication and observers that do not move earlier: form §2.2 (d) |

**C2. The proposed note text in §2.9 (form :196-206) carries a guarantee stated without its condition, a list it presents as complete when it is not, and a wrong instrument object.** These are the words the advisor rules. They are resolved by the architect's text in item 1 below, with no re-gate (ADV-2026-11-22-04 item 1). The defects:
- **(i)** "It precedes every `cancel_observed`" (copied from :199) is stated with no condition. Happens-before holds. The ordering of the two values rests on form §5.3's clock assumption, which the form itself lists as not proven (§1, :111).
- **(ii)** The "longer by the rest of the call, which …" list (:199) leaves out the end of the trace record. It also leaves out that the interrupt is raised only when a query is bound.
- **(iii)** The kernel note's "a span opening on `cancel_requested`" (copied from :205): no entry in `SPANS` opens on it (engine/src/trace.rs:538-552). What returns `None` is a segment (`segment_ms`, :209-211).
- **(iv)** Both notes leave out "when a trace is running", the no-op path at engine/src/trace.rs:302-306.

## Evidence

None. H1's discriminator (T1 and T2, §4.1) is deterministic and placed correctly at C1 and C2. The campaign is supporting evidence only (§4.4), as the human's item 1 and ADV-2026-11-22-01 item 3 require.

---

## 1. §0.4's reading and §2.9, against ADR-018 items 1 to 3

- §0.4's reading (form :89) holds against ADR-018:45, :56-65 and :69-76, with C1 corrected.
- The finding itself stands:
  - the row says "returns" (ADR-018:45, kernel/CANCELLATION-AND-TRACING.md:48);
  - the code stamps at engine/src/cancel.rs:135, before :137-176;
  - after the fix, the stamp comes before the publication (form §2.1).
- A stamp at the return could fall after the worker's `cancel_observed`, because the flag is published before the call returns, today (cancel.rs:133) and after the fix (step 4 before step 5). So the literal row was never stampable as an origin that comes before the observation.
- The new reading is the only one that orders the pair. Measuring from a wider window is conservative: ADR-018:21 says a pass on a wider window is a pass a fortiori (paraphrase).
- ADR-018 item 1 binds every cancellable operation (ADR-018:41). The LOD harness stamps `requested` before it calls `cancel()` (engine/tests/lod_tier_cancellation.rs:84-87). The architect's text admits that reading explicitly, so the note does not leave a second operation contradicting it.

Clause table for lead-data's ADR note (form :199):

| Clause | Verdict | At |
|---|---|---|
| the row says "returns" | holds | ADR-018:45 |
| the engine does not stamp that moment | holds | cancel.rs:135 comes before :137-176 |
| it stamps inside the call, before the publication | holds only after C2; today it does not | cancel.rs:133 then :135; form §2.1 |
| the row is read as that instant | holds only for `CancelToken`; the LOD harness is not covered | ADR-018:41; lod_tier_cancellation.rs:84-87 |
| it precedes every `cancel_observed` | does not hold as written: no condition | form §5.3, §1 :111 |
| never shorter than the interval from the return | holds | one thread's program order |
| "longer by … flag, interrupt, thread" | does not hold as a complete list | trace.rs:151-165, :313; cancel.rs:137-145 |
| a call that finds the flag set stamps nothing | holds | cancel.rs:133-134; §2.1 step 2 |
| budget, names, items 2 and 3 unchanged | holds | no edit to ADR-018:41-76 |
| no line above is changed | holds if appended | — |

Clause table for lead-data's kernel note (form :205):

| Clause | Verdict | At |
|---|---|---|
| read as ADR-018's note reads it | depends on that note | — |
| inside `cancel`, before the publication | holds after C2 | §2.1 |
| it precedes every `cancel_observed` | does not hold as written: no condition | §5.3 |
| an earlier call or `cancel_for_drop` means no stamp | holds | cancel.rs:133-134; stream.rs:906 |
| "a span … absent, never zero" | wrong object: no `SPANS` entry; a segment is `None` | trace.rs:538-552, :209-211 |
| no line of §2 above is changed | holds | — |

**ADR-018, the architect's text in full** (appended after ADR-018:150; the advisor fills in the ruling id):

```markdown

---

## Note (2026-11-22, [ruling id]): where `cancel_requested` is stamped

Item 1's row defines `cancel_requested` as the moment the cancellation call returns to its caller. The engine does not stamp that moment, and a stamp there could fall after a worker's `cancel_observed`, because the cancelled flag is published before the call returns. The row is read as follows: `cancel_requested` is an instant taken inside the cancellation call, or by its caller before the call, and before the worker can observe the cancellation; never after the call returns. A harness that stamps it itself stamps before it calls cancel (`engine/tests/lod_tier_cancellation.rs`). For an operation cancelled through the engine's `CancelToken`, `CancelToken::cancel` takes the instant when a trace is running, at most once per token, inside the call and before it publishes the flag (`engine/src/cancel.rs`, `cancel_inner`). If two clock reads ordered by happens-before are ordered on the platform's monotonic clock, which is assumed and not proven here, that instant is no later than every `cancel_observed` stamped after a load of the flag. The interval item 2 scores, measured from it, is never shorter than one measured from the call's return: it is longer by everything the call does after the stamp, which includes finishing the trace record, publishing the flag, raising the external engine's interrupt when a query is bound, and starting the thread that re-raises it when an execute is in flight. A call that finds the flag already set, by an earlier call or by a stream's drop, stamps nothing, and an interval opening on `cancel_requested` is then not derivable. The pair item 2 scores, the 100 ms budget, the three instants' names and item 3's scoring are unchanged. No line above this note is changed.
```

Clause check of the architect's ADR note:

| Clause | Holds at |
|---|---|
| the engine does not stamp the return | cancel.rs:135 comes before :137-176; after the fix, step 3 comes before step 5 |
| the flag is published before the return | cancel.rs:133; §2.1 step 4 before step 5 |
| a caller may stamp before the call | lod_tier_cancellation.rs:84-87 |
| only when a trace is running | trace.rs:302-306 |
| at most once per token | §2.1 steps 1-3 and §2.2 (a); today cancel.rs:133-134 |
| inside the call, before the publication | after C2 (§2.1), proven by T1 and T2 at C2; the note lands at C4 |
| no later than every `cancel_observed` after a load, under the stated assumption | happens-before: trace.rs:150, then the SeqCst store, then a load that reads true (stream.rs:1794, 1846, 1898, 1981, 2548, 2637; kernel/src/publish/mod.rs:1043, 1058); assumption: form §5.3 |
| never shorter than from the return | the stamp comes before the return on the same thread |
| "includes" the trace record, flag, interrupt (bound), thread (executing) | trace.rs:151-165, :313; cancel.rs:137-145, :152 |
| a call that finds the flag set stamps nothing | cancel.rs:133-134; §2.1 step 2 |
| not derivable | trace.rs:209-211 |
| pair, budget, names, item 3 unchanged | no edit to ADR-018:41-76 |

**kernel/CANCELLATION-AND-TRACING.md, the architect's text in full** (appended after line 268, as a new §10 that follows the file's own §8 and §9 convention; see 6(a)):

```markdown

---

## 10. Amendment — §2's `cancel_requested` row, as of 2026-11-22

Appended, as §8 and §9 append: nothing above is edited. It covers the `cancel_requested` row of §2's table only.

The row says `CancelToken::cancel()` returns to its caller. It is read as ADR-018's note of 2026-11-22 reads item 1's row: the instant is stamped inside `CancelToken::cancel`, when a trace is running and at most once per token, before the cancelled flag is published (`engine/src/cancel.rs`, `cancel_inner`). Under the clock assumption that note states, it is no later than every `cancel_observed` stamped after a load of that flag. A `cancel()` that finds the flag already set, by an earlier call or by `cancel_for_drop`, stamps nothing, and a segment opening on `cancel_requested` (`Trace::segment_ms`, `engine/src/trace.rs`) is then `None`, never zero. §2's scoring sentence, that `docs/08`'s budget is scored on `cancel_requested → cancel_observed`, is unchanged.
```

Clause check: the clauses are the same as the ADR note's, plus three:
- "as §8 and §9 append" holds (kernel/CANCELLATION-AND-TRACING.md:212-221, :258-260);
- "segment … `None`" holds (trace.rs:209-211);
- "the scoring sentence is unchanged" holds (:52-53).

If the advisor keeps the end of §2 instead, the body is unchanged: replace the heading and the "Appended" paragraph with a blockquote led by "**Note to §2 (2026-11-22).**".

## 2. Whether the fix changes what item 2 budgets

It does not; there is no STOP line.
- Item 2 scores the pair `cancel_requested → cancel_observed`, on a 100 ms budget, by p50 and p95 under item 3 (ADR-018:56-76). The fix changes none of these.
- The first instant moves earlier, inside the same call, by the request mark and one store (C1). The measured interval therefore becomes a superset of today's and of the one from the return: conservative, a pass a fortiori (ADR-018:21, paraphrase).
- Side effect on the product:
  - in traced runs, the flag's publication now comes after the mark, so flag-polling observers see it later by the mark's duration;
  - the interrupt already came after the mark (cancel.rs:135 before :137);
  - in untraced runs (the shipped default, trace.rs:88), the only addition is an uncontended lock and unlock.
- This belongs in the build's record as a disclosure, not a STOP.

## 3. Drop first, then cancel (§2.10)

- **Today:** `cancel_for_drop` swaps the flag in, and the later `cancel()` sees `already` and stamps nothing (cancel.rs:133-134).
- **After the fix:** step 2 finds the flag set, and again nothing is stamped (§2.1).
- **What the trace promises:** no request stamp, and the segment is `None` (trace.rs:209-211). A `PRODUCER_CANCELLED` may still appear, with no origin.
- **Tests:** T7 (sequential), T5 (concurrent) and I4 (the public API: `Dataset::stream_with_cancel` at engine/tests/slice.rs:853-855, the drop at stream.rs:898-908). Today no test covers the follow-up `cancel`. The ruling's premise ("the stamp comes after the flag", ADV-2026-11-22-04 item 3) does not hold in the code, and lead-data is right.
- **Note:** T5 can hold a drop inside `transition` only if `before_stamp` fires when `stamp` is false. §2.3 (:160) does not say so (see N2).

## 4. The slice assertion and M7

- The Scope's change is correct. After §2.6, an inversion fails the test by name.
- Foreign stamps are excluded: the test takes the write lock (engine/tests/slice.rs:146-150, :842).
- M7 is deterministic as to order. `next_into` reads no flag (stream.rs:795-810). Every `Err(Cancelled)` the producer sends is stamped before `produce` returns, and it is sent after that (stream.rs:1373-1374).
- So `PRODUCER_CANCELLED`'s clock read happens-before the send, the receive and M7's stamp. The order rests on §5.3, not on scheduling.
- Two qualifications:
  - The kill needs strict inequality, because equal offsets pass under `>=`. A tie at the clock's resolution across a parked receiver's wake-up is not shown to be impossible. M7's prediction should say that it rests on §5.3 and on a strict gap (N3).
  - M7 also needs the run to reach `Err(Cancelled)`, the test's existing precondition (slice.rs:878-883).
- "Masking at C2" is predicted correctly: `saturating_sub` at :900 reads 0.

## 5. Principles, ADRs, seam rule, §8, Scope, isolation, the human's item 1

- **docs/01 principle 7** (docs/01_Principles.md:13, :20): holds.
  - A canceller waits only for another canceller of the same token inside steps 2 to 4.
  - The product callers already hold registry locks across `cancel()`: kernel/src/skp.rs:353 and :392 under `tickets`, :958-963 under `inflight`.
  - Nothing beneath them takes those locks, so there is no cycle. The full lock order is registry → `transition` → `CURRENT` → buffer.
- **Principle 8** (docs/01:14): holds. The note makes the instant's real position explicit.
- **ADR-010 rule 6** (ADR-010-render-frames-origins-boundaries.md:70-72): holds. No capacity is added, and `TRACE_BUFFER_RECORDS` is unchanged.
- **ADR-004 Amendment 4** (ADR-004:31-34): holds. Nothing reaches the wire.
- **ADR-006:** not engaged.
- **docs/08:** no claim.
- **Seam rule:** the design is written against the interfaces as they actually are; I verified every observer and caller. §0.3's list, though, leaves out sites the diff's behaviour reaches (D3). That gap is in the record, not an imagined interface.
- **§8, item by item:**
  - items 1 to 12 hold as written;
  - item 5's last bullet changes if 6(b) is taken;
  - one item is missing: the `in_execute` load that §2.1 step 5 needs must stay after the publication, because the store-then-load pair with cancel.rs:194/197 depends on that program order. Item 7 covers weakening, not reordering (N4).
- **Scope:** 8 files and 800 lines is plausible. 6(b) would add 1 file and about 5 lines.
- **Node budget:** 480 minutes, adopted in ledger entry 1122g.
- **Isolation** (form :24-45): meets ADV-2026-11-22-01 item 9.
  - The fixtures resolve under the worktree (slice.rs:24-27; skp_filter_cancellation.rs:43-46), not under D:\spatial-ide\target.
  - The re-check after the first test run is ordered.
- **The human's item 1** (directive :20, :24): holds.
  - No retry, sleep, longer timeout or skip is added (§2.7, §2.8).
  - The wrappers leave only on T1 and T2 red then green, plus C3 at zero, or it stops (§2.4, §5.5).
  - The two questions stay apart (§2.4 (a)/(b)).
- **§5.4's residual:** a foreign `PRODUCER_CANCELLED` from a parallel test in the skp_admission binary (ten untraced tests; nothing serializes them) is not closed by the fix. Once the wrapper is gone, it turns red rather than staying hidden, which is what item 1 intends. The record must then not attribute it to H1 (§1, :105).

## 6. Lead-data's open questions (the advisor decides)

**(a) Placement.** Recommendation: append at the end of the file as §10 (text above). This follows the file's own convention for changes that touch §2 (kernel/CANCELLATION-AND-TRACING.md:212-217, :258-260) and moves no line.

Inserting after :79 instead would silently re-aim these unpinned cites into lines 80 and later, all in append-only records:
- state/consults/2026-09-30-engine-cancel-before-execute-architect-draft.md:20 (→:93) and :94 (→:89);
- state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-impact-read.md:76 (→:180-182);
- state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md:90 (→:163), :91 (→:164), :93 (→:212);
- state/consults/2026-10-11-module-docs-stale-statements-impact-read.md:80 (→:161-167), :83 (→:219-221, :212-217), :215 (→:219-221);
- state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-impact-read.md:187 (→:83-117) and :338 (→:83-97);
- state/consults/2026-10-23-publish-sort-window-cancel-not-exercised-on-ci-lead-data-draft.md:34 (→:130);
- state/consults/DRIFT-SWEEP-AREA-D-2026-10-10.md:69 (→:161-167);
- the legacy entry scripts/plan/verify-cites-legacy-bound.json:11 (→:155-269).

Every governance/forms cite into the file is pinned, so those stay stable. The file's own line cites in §8 (:223, :240) point at lines 70-79, above either insertion point.

Either placement makes the file longer, so the legacy entry's past-end cite comes within bounds. scripts/plan/verify-cites.mjs @ 16c896558ac9073f132336f4c9cbcff5b31d8514 fails only an entry the list gains (:393-401), so neither placement fails it.

**(b) engine/src/trace.rs:370-371.** Recommendation: a ninth file, that doc comment's first sentence only. It is the instrument's own definition, which summarizers read, and after C2 it states an engine fact that is false. Engine messages state engine facts (round 7). The cost is about +3/−2 lines, and §8 item 5's last bullet is narrowed by the amendment. Not the human's wording. The architect's words, replacing :370-371:

```
/// Stamped inside `CancelToken::cancel`, before the cancelled flag is published, at most once per
/// token — **`cancel_requested`, the first of the three cancellation instants** (ADR-018 item 1, as
/// its note of 2026-11-22 reads it) and the only one the canceller itself can stamp.
```

Clause check:
- inside `cancel`, before the publication: after C2 (§2.1);
- at most once per token: §2.2 (a);
- "the first of the three … only one the canceller … can stamp": unchanged from :370-371.

---

## Documentation (must be fixed before the merge, in Amendment 1, before dispatch)

- **D1.** Internal section references are off by one:
  - §1 :106 says the notes are in "§2.8"; they are in §2.9;
  - §2.2 (c) :151 cites "(§2.9)"; it should be §2.10;
  - :108's "see the last section" points at the draft's "What I could not settle" section, which is outside the form.
- **D2.** The Hashes line :14 states how `scripts/plan/verify-quotes.mjs` behaves without naming the tool's commit (round 15 (c)).
- **D3.** §0.3 (:69-84) leaves out:
  - the per-row `PRODUCER_CANCELLED` exit, stream.rs:1981-1993, and `classify_fetch_panic`, stream.rs:2652-2658;
  - the publish observer, kernel/src/publish/mod.rs:1042-1070;
  - the stamp's other readers: stream.rs:3264-3272, and kernel/tests/first_batch_factorial.rs:1382-1385 and :1517-1520, where `segment_ms` drops an inversion as absent;
  - the callers of `cancel()` that hold locks: kernel/src/skp.rs:353, :392, :963 and kernel/src/lib.rs:745.

  §2.2's lock order (:155) gains the registry locks at its head.
- **D4.** §2.10 :229, "`spans()` omits the span": no `SPANS` entry opens on the request (trace.rs:538-552). It should say that `segment_ms` is `None`.
- **D5.** §7 :342 says `engine/README.md` is "written by lead-data", but lead-data is read-only. Name who writes the file.
- **D6.** The mutation predictions are incomplete:
  - M2 also kills T1 (the swap publishes before the mark);
  - M4 also kills T5, T7 and I4;
  - M5 also kills T5;
  - M1 must place the stamp after `after_publish`, mirroring C1, or T2 survives.
- **D7.** I3's spin wait in the new integration binary needs a deadline declared at its site, on a line of its own (ADV-2026-11-22-01 item 2). `TEST_LIVENESS_DEADLINE` is private to the cancel.rs tests (cancel.rs:333).
- **D8.** The "Not proven" line in §1 (:113) should say that the test build also runs `on_contended`'s `try_lock` probe.

## Notes

- **N1.** Draft against form: I checked each custodian change listed in ledger entry 1122g against draft-2 :15-402.
  - These change no meaning: the ADV-2026-11-22-04 pin moved to 4a301df7 (the file did not exist at eb47ee33); the Hashes line; the group pin of §0.3; the heading of §10; the references split into one full path per hash (skp_admission.rs:935-940 and skp_filter_cancellation.rs:275-280 are byte-identical, so they share a hash).
  - The branch-base change does change meaning: re-derivation moves from 662ea259 to the main commit at dispatch. It is correct, because 662ea259 does not hold the form and §7's three-dot range needs a base on main. :13's spot-check pair is then no longer that base, which is harmless.
  - I found no unlisted change.
- **N2.** T3 to T5 at C1, and M2's kills of them, are red because the hook site does not exist, not because the property is violated. They show structure. The property-level kill of M2 is T1.
- **N3.** M7's prediction should state that it rests on §5.3 and a strict gap (section 4 above).
- **N4.** §8 needs one more item: "the `in_execute` load placed before the publication".
- **N5.** The worker updates the docs at cancel.rs:100-107 and :129-131 inside the Scope; the build's gate reads them.
- **N6.** No discharge claims. The testing paragraph (form :384) matches directive :49 by eye; the byte comparison is the reviewer's, since I have no shell.

No ADR skeleton is needed: no decision is missing.

Relevant paths:
- C:\dev\wt\gate-read\governance\forms\engine\CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md
- C:\dev\wt\gate-read\engine\src\cancel.rs
- C:\dev\wt\gate-read\engine\src\trace.rs
- C:\dev\wt\gate-read\engine\src\stream.rs
- C:\dev\wt\gate-read\engine\tests\slice.rs
- C:\dev\wt\gate-read\docs\adr\ADR-018-what-cancellation-acknowledged-means.md
- C:\dev\wt\gate-read\kernel\CANCELLATION-AND-TRACING.md
- C:\dev\wt\gate-read\kernel\src\skp.rs
- C:\dev\wt\gate-read\scripts\plan\verify-cites-legacy-bound.json
