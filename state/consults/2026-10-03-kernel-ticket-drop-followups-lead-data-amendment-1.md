*Custodian's filing note (2026-10-03): lead-data's draft of node 9's Amendment 1, after PR #168's gate-1 reviewer FAIL, written by `lead-data` as its own agent type to this path itself and committed as written below the rule. The hash of record, from this file's line 5 (the report's first line) to the end, is 9edeb7198f9c73c035a8292b6b779c48d9e8a220287e51b4ee8572d941e66088, computed by the custodian; the agent returned "sha256: not computed" (C3). Write audit PASS by the tracked `scripts/hooks/subagent-write-audit.mjs`, its first live use: one Write, to this path; Read 13, Grep 9, Glob 1. C3: the worktree was clean before and after; in the main checkout the other differences are the custodian's own, and the fast-forward to the human's merge of #167. Its fenced Amendment is appended verbatim to the form's section 10 on the branch at 8195789b. The custodian's answers to its two questions: class 1 is accepted for the re-declared setup, as a post-result amendment, which the gate-2 architect may dispute; and the composed tree for P1 is pushed as its own branch, so it stays reachable.*

---

# lead-data Amendment 1 draft — kernel-ticket-drop-followups (node 9), after PR #168 gate 1

Drafted by lead-data on the custodian's brief, under the 2026-10-03 lead-data clarification (C1 to C4). It is a draft: the gates check it, and lead-data does not review it. It is written after gate 1's outcome was seen and before any code of the fix. Code was read in `C:/dev/wt/ticket-drop-fu` at 86774b06. The form was read in the same worktree. Its §10 is empty.

## Result

Amendment 1 drafted (classes 1 and 2). Route: swap the two entries' values in place, which makes T3's precondition deterministic. `MAX_REKEY_ATTEMPTS` is withdrawn. A narrower labelled assumption replaces §7's, and T3's existing `CancelledBeforeRedeem` assertion checks it on every run. The expected size is about 306 of 320, so no class 8. The correction is classed draft-caused under C4.

## The amendment, ready to append verbatim to §10

```markdown
### Amendment 1 — T3's precondition made deterministic, after gate 1's reviewer S1-1 (classes 1 and 2)

Written after gate 1's results were seen (class 1, a post-result amendment; class 2 for the predictions item 1 records as missed), and before any code of the fix. It touches §4's T3 Precondition bullet, §7's `MAX_REKEY_ATTEMPTS` bullet and its labelled assumption, and the P1, P2 and P3 observations made before it. No line of §0 to §9 is edited. The evidence is the gate-1 reviewer's report, `state/consults/gates/2026-10-03-kernel-ticket-drop-followups-gate1-reviewer.md` (reviewed at branch commit 86774b06), cited by finding.

1. **The result.**
   - I4 fired on its first clause, and §7's labelled assumption is falsified: S1-1's local runs, its CI push run and its simulation.
   - P2 is missed for T3 at 86774b06 (class 2). P1 and P3 hold only in the runs that reached T3's call: S1-1's knock-on, with checklist items 3 and 4. In the other runs T3 discriminated nothing. Worker report 1's verdict on I1 to I5 holds for its own runs only (S1-1).
   - I4's second clause has not fired: every recorded T3 failure was on the precondition (S1-1; the reviewer's exit-code table).
   - Under C4 of the 2026-10-03 lead-data clarification, this correction is draft-caused. The re-key-P-only precondition and the assumption are lead-data's drafted text, and they were implemented as drafted.
2. **T3's precondition, re-declared.** This item supersedes §4's T3 Precondition bullet. The rest of §4's T3 entry, and §4's Common setup, stand.
   - Under the registry's lock, before P is attributed, the map must hold exactly P's and Q's entries; otherwise the helper fails with a message naming the test. If P's key is not the first key in the map's iteration order, the two entries' values are swapped in place, and the test's names for P's key and Q's key are swapped with them. Then P's final key is attributed.
   - The swap removes no key, inserts no key and drops no `TicketState`. So the map's layout and order do not move, and P's state sits at the earlier key on every run. Q is never attributed, so its key is free to change.
   - Kept unchanged: T3's call, `cancel_all_for_dataset` on D; its four assertions (the call returned within `HANG_TIMEOUT`; it unwound with the test-named payload; P is `EndedBySourceChange`; P's entry is `CancelledBeforeRedeem`); and M3. T1 and T2 do not use the helper.
   - The helper stays a private item of the `#[cfg(test)]` module `ticket_drop_under_lock_regression`. No product code changes, so the caller rule and §8, item 4 apply as before.
3. **What replaces §7's `MAX_REKEY_ATTEMPTS` bullet and its assumption.** §7's line is not edited.
   - `MAX_REKEY_ATTEMPTS` is withdrawn: nothing is retried, so there is nothing to bound.
   - Assumption, labelled: the map's iteration order does not change between the helper's guard and the `values_mut` loop of the call under test, because no entry is inserted or removed between them. `attribute_p` writes only `GenerationRegistry`. The call's sweep removes only entries older than `TICKET_TTL` (P's state) or `TERMINAL_ENTRY_MAX_AGE` (Q's).
   - The `CancelledBeforeRedeem` assertion checks that assumption, and I4's second clause, on every run. A run that fails it fires I4.
   - Failure bound: the precondition has no failing draw. Its only failure is the two-entry check, which fails by name. Item 4's repetition is the measurement.
4. **Observations the fix requires.**
   - F is the branch commit that carries item 2's code.
   - Each run is recorded with its commit, its rc and each failing test's message.
   - A failure in any repetition stops the piece and is reported (§5). No run is repeated to obtain a pass.
   - P1: 5 runs of `cargo test -p spatial-kernel --lib an_unwind_through`, with F's test module over the product code of `kernel/src/skp.rs` at the merge-base, 4c50677c. The record names the commit, or the method, that composes the two. Expected in each run: T1 to T3 each fail by timeout, and none fails on the helper's message.
   - M1, M2 and M3: 5 runs each at F. Each is applied by hand, run with the same command and reverted, and the tree is clean after each. Expected in every run: as P3.
   - P2:
     - T3 alone, 100 runs at F, all passing;
     - 5 runs of `cargo test -p spatial-kernel --lib skp::` at F;
     - §9's suites once, at the head the gate reads;
     - CI's push and pull_request runs at that head.
   - O1 is not re-made, because the fix touches neither `mint` nor `tests::the_pending_ceiling_is_per_dataset_and_declared`. Its observations of record are listed in item 5.
   - Each of the three tests' doc comments names F as the commit its mutation was observed at.
5. **Where the observations are recorded (S2-3).**
   - The fix's worker report records the runs of item 4.
   - The test doc comments carry each mutation's commit.
   - The closing amendment in this section, references only, cites:
     - worker report 1, `state/consults/2026-10-03-kernel-ticket-drop-followups-worker-report-1.md`: P1 at 2813aead, and M1 to M3 and O1 at 1c8cea2207e2;
     - the gate-1 reviewer's checklist item 3: O1 at 86774b06;
     - the fix's worker report: item 4, at F;
     - the gate reports.
6. **Budget.**
   - At 86774b06, §7's counting command gives 316 of 320 (the reviewer's diff line).
   - Item 2 replaces the helper's re-key loop with a shorter swap. The expected figure at the final gate's head is about 306, within §7's 320, so class 8 is not taken.
   - If the counted figure exceeds 320, a class-8 amendment records it, and §7 is not edited.
```

## Reasoning for the route

**What the code does at 86774b06.**
- T3 runs three steps, in order: `UnwindSetup::new`, then `put_p_before_q`, then `attribute_p`.
- `put_p_before_q` removes P's entry and re-inserts it under a freshly minted key, up to 64 times. It stops once P's key comes before Q's in `keys()` order, and otherwise asserts by name.
- The call under test, `cancel_all_for_dataset`, walks `tickets.values_mut()`. It must retire P before it reaches Q's `Redeemed` arm, where Q's `PanickingCancel` panics.

**Measurement.** I have no shell, so I measured nothing. The only measurements are the reviewer's (S1-1): 14 of 60 local runs failed, one CI push run failed, and a simulation gave 0.254. My analysis of the routes builds on the reviewer's labelled inference: with two entries, std's `HashMap` has four buckets and iterates them in bucket order. That is an inference, and I did not read std's or hashbrown's source to confirm it.

**Route 1: re-key Q only (rejected).**
- On that inference, Q is free to move but P's bucket is fixed.
- When P sits in the last bucket, no new bucket for Q falls after P. That is about one draw in four, so this route has the same floor, mirrored.

**Route 2: re-mint both keys on each attempt (not chosen).**
- On the same inference, each attempt succeeds independently, with a probability that does not depend on the previous draw. So a bounded number of attempts gives a very small failure bound.
- That bound still rests on a model of std's private layout, which is exactly what failed here. It would need its own measurement, such as a standalone simulation, before it could be declared.
- It also keeps a retry constant in §7's place.

**Route 3: swap the two values in place (chosen).**
- With exactly two entries, one key comes first. Swapping the two values, and swapping the test's two key names with them, puts P's state at that first key.
- No hash, bucket or probability is involved, and no key moves. The swap drops no `TicketState`: `mem::swap` over two `&mut` drops nothing.
- The two-value swap is symmetric. So it does not even depend on `values_mut` yielding the two values in `keys()` order. That dependence survives only in the call under test, where it is I4's second clause, as before.

**Why the swap is safe.**
- No other state ties P or Q to its key string.
  - `StreamRegistry` has one field, `tickets`.
  - `wrap_for_data_plane` takes the dataset name, not a ticket key (`kernel/src/lib.rs`, `wrap_for_data_plane`'s parameters).
  - Q was redeemed before the helper runs, and Q is never attributed.
  - P is attributed only after the helper, under its final key.
- So `ticket_liveness(&self.p)` and the final `map.get(&s.p)` both read P's real state.

**What remains assumed, and how it is checked.**
- The iteration order must not move between the helper's guard and the call's `values_mut` loop.
  - Nothing inserts or removes between them. `attribute_p` writes only `GenerationRegistry`.
  - The call's `sweep_locked` removes a `Pending` entry only after `TICKET_TTL` (30 s, `kernel/src/skp.rs`) and a `Redeemed` entry only after `TERMINAL_ENTRY_MAX_AGE` (300 s).
- If either assumption broke, P would not be retired before Q's panic, or P would be swept. Either way, T3's existing `CancelledBeforeRedeem` assertion fails by name. So the residual assumption is checked on every run, not assumed silently.

**The four assertions and the caller rule are kept.**
- `call_unwinds_and_drops_p` is unchanged, and so are T3's call and its `CancelledBeforeRedeem` check.
- The helper is a private item of the `#[cfg(test)]` module and reaches the private `tickets` field, as `backdate_p` and the current helper already do. No product code changes.

**Size, by reading.**
- The current helper, its doc comment included, is 28 lines.
- A swap helper that keeps the two-entry check and the test-named message is about 18 lines after rustfmt.
- The reviewer counted 316 = 290 + 26. Since the helper's lines are all branch insertions, the expected figure is about 306.
- The T3 and M1 to M3 doc-comment edits replace lines rather than add them: F replaces 1c8cea2207e2 in each.

**Run counts.**
- P2's 100 runs of T3: at the measured old rate (about 14/60), 100 clean runs would have a probability of about 3e-12 (0.767^100, my arithmetic, labelled). So 100 clean runs discriminate the fix from the old setup.
- P1 and M1 to M3, 5 runs each: once T3 has no failing draw, the only remaining run-to-run variation is the hang timing. Five runs is more than the reviewer's three or four.

**Class.**
- Class 1 is the post-result record, with what it invalidates and what replaces it. The precedent is `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`'s Amendment 1, which re-declared a test's fixture after a gate-1 finding. Its Amendment 2 records the gate-2 architect's reading of it as class 1.
- Class 2 covers the missed P2 and the P1 and P3 knock-on.
- Class 8 is not taken; see the Budget item.

**C4.** The correction is draft-caused. §4's T3 Precondition bullet (re-key P only) and §7's uniform-hash assumption were in lead-data's draft 2, and worker report 1 implemented them as drafted. The architect's gate-1 report lists no implementation defect.

## Files read

- `C:/dev/spatial-ide/kernel/README.md`: the Owner's index section
- `C:/dev/spatial-ide/engine/README.md`: the Owner's index section
- `C:/dev/spatial-ide/state/directives/2026-10-03-lead-data-pilot-clarification.md`
- `C:/dev/spatial-ide/state/directives/2026-10-03-write-audit-ruling.md`
- `C:/dev/spatial-ide/state/directives/2026-09-18-record-cap.md`
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`: §10 and the Round 25 additions
- `C:/dev/spatial-ide/.claude/agents/architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-03-kernel-ticket-drop-followups-gate1-reviewer.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-03-kernel-ticket-drop-followups-gate1-architect.md`
- `C:/dev/spatial-ide/state/consults/2026-10-03-kernel-ticket-drop-followups-worker-report-1.md`: grep for its commits and O1 only
- `C:/dev/spatial-ide/kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`: §10, as the class-1 precedent
- `C:/dev/spatial-ide/kernel/*PREREGISTRATION.md`: grep for the opening lines of each Amendment 1
- `C:/dev/wt/ticket-drop-fu/kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`: whole
- `C:/dev/wt/ticket-drop-fu/kernel/src/skp.rs`: `StreamRegistry` (the `tickets` field through `cancel_all_for_dataset`), `TICKET_TTL`, `TERMINAL_ENTRY_MAX_AGE` and `HANG_TIMEOUT`, and the regression module's `EmptySource`, `PanickingCancel`, `UnwindSetup` and T1 to T3
- `C:/dev/wt/ticket-drop-fu/kernel/src/lib.rs`: the signature of `wrap_for_data_plane`

## Questions (non-blocking)

- Class: does the custodian accept class 1 for item 2's re-declared setup, on the RAW-PATH Amendment 1 precedent? No class names a re-declared test setup, and per §10 a class that does not fit goes to the human.
- P1's composed tree: must the scratch commit that puts F's test module over 4c50677c's product code be pushed so that it stays reachable, or does the record of the method suffice?

sha256: not computed
