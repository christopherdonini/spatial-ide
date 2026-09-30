*Custodian's filing note (2026-09-30): the architect's gate 1 on PR #146, for PLAN node `engine-cancel-before-stream-window` at generation 1, full gating. Reviewed: cut/cancel-before-execute @ c93d0ec (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at c93d0ec. The custodian re-read B1 (`std::thread::spawn` in `cancel_inner`, reached from `BatchStream`'s drop through `cancel_for_drop`), B2 (the `Inner.interrupt` doc) and B3 (the module header) at c93d0ec, and each reads as the report states. Profile paths redacted at filing: none.*

---

Reviewed: cut/cancel-before-execute @ c93d0ec

**Verdict: FAIL.** Reviewed `cut/cancel-before-execute @ c93d0ec`. The form's §10 was read at main 39ee43b. I had no shell, so I read the head's files and main's baseline instead of running `git diff`. The reviewer has to confirm anything that depends on the diff itself.

Three findings block: B1 (§8 item 5), B2 (§8 item 8) and B3 (item 4).

## §8 block-on-sight

1. **Timing assertion: PASS.** The only deadlines in the diff are liveness bounds: T2's watchdog `!fired` at `engine/src/cancel.rs:389-392`, `until_live` at `:253-262`, and T5's two poll loops at `engine/tests/cancel_execute_window.rs:75-82` and `:101-108`. Elapsed time is printed and never asserted (`cancel.rs:381-383`, `:420-423`). The `elapsed < 10s` check at `cancel.rs:315-318` was already there before this piece and is one of the tests §5 declares unchanged.
2. **Sibling, wire, SKP or dependency change: PASS.** Amendment 2's numstat covers exactly four files. `dataset.rs`, `index.rs`, `rowgroup.rs` and `layout.rs` are absent from it. The reviewer should confirm that no `Cargo.toml` or `Cargo.lock` path outside `engine/src` changed.
3. **Interrupt outside the slot mutex, or after `detach`: PASS.** The interrupt in `cancel_inner` holds the if-let temporary lock (`cancel.rs:111-113`), and the re-interrupter interrupts under the lock (`:135-138`). See N1.
4. **More than one re-interrupter, or a spawn on the uncancelled path: PASS.** The spawn is guarded by `!already && in_execute` (`cancel.rs:120`), and `cancelled` never goes back to false.
5. **`unwrap` or panic on spawn failure: FAIL (B1).** `cancel.rs:122` calls `std::thread::spawn`, and std documents that it panics if the OS fails to create a thread. That contradicts §2 item 3 ("There is no panic"). `cancel_inner` is also reached from `cancel_for_drop` in `BatchStream`'s `Drop`, so a panic during unwinding would abort the process. Fix: use `std::thread::Builder::new().spawn(..)` and discard the `Err`, which gives the degraded behaviour §2.3 declares.
6. **`is_executing()` doc: PASS.** `cancel.rs:177-184` carries every element: a read-only view over state the shipped build maintains, the test suite as its only caller, the caller named (`a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled`), and why the property must be proven about the shipped build. It does nothing but read. See also item 4 below.
7. **Tests and mutations: PASS.** P0-1, T2, T3, T4 and T5 are all present. Each mutation's failure is recorded by name in `state/consults/2026-09-30-cancel-before-execute-worker-report-1.md` (MUTATIONS, lines 34-41), observed at fb98e43. Those observations carry over to c93d0ec only if item 6 holds. See N4.
8. **`Inner.interrupt` claim left unqualified: FAIL (B2).** The pre-attach claim, "not lost: `attach` interrupts immediately", is kept, and the added "Qualified" sentence says the field "is what stops a query cancelled before `attach` or before `prepare`" (`cancel.rs:44-49`). That is false. `an_interrupt_on_an_idle_connection_is_not_latched` (`cancel.rs:459-473`) cancels, attaches (so `attach` interrupts), and the query then returns `Ok`. Amendment 1, item 2 records that `Prepare` clears the flag through `InitialCleanup`. What actually stops those cancels is a flag check: `produce`'s pre-prepare check (`stream.rs:1728`) and the guard's step 2. §2.1 asks for the claim to be qualified to callers that check under the guard, and this text is not.

## Architect checks named in §9

- **ADR-018 item 1: PASS.** A guard `Cancelled` stamps `PRODUCER_CANCELLED` (`stream.rs:1772-1774`), which is `cancel_observed`. No figure is published.
- **ADR-018 item 4: PASS.** `REINTERRUPT_INTERVAL` is class (a), stated as how often the thread looks (`cancel.rs:30-34`), and DuckDB's reaction is named as the other class.
- **ADR-018 item 5: PASS.** Nothing claims a bound from attaching the interrupt.
- **ADR-010 rule 6: PASS.** The ceiling of one thread per token is declared, and the constant has its own site.
- **docs/01 principle 7: PASS in intent.** B1 is the one defect against it.

## Items 1-6

1. **§2 implemented as written, nothing outside: FAIL, on item 3 only (B1).**
   - Item 1 is followed step by step (`cancel.rs:157-175`), and the spawn happens after the lock statement ends.
   - Item 2 matches `stream.rs:1771-1787`.
   - Items 5 and 6 hold: the README sentence and no `cfg`.
   - Nothing lands outside §2 and §4. Moving the check past `EXECUTE_CALLED` follows necessarily from replacing `:1755` and `:1764` with one guard (see N2).
2. **`TEST_LIVENESS_DEADLINE`: PASS.** Round 25, item 1 (a) says to assert the property and its ordering, report the timing, and never assert a budget docs/08 does not declare. The tests do that: they assert who ended the query (the token, not the watchdog) and the order of events, and print the timing. The 60 s ceiling only turns a hang into a named failure, and nothing compares a duration against a target. The custodian's §4 reading holds.
3. **README item 3's blockquote: PASS, not false at c93d0ec.** The pre-execute `is_cancelled()` check it describes still exists at `stream.rs:1728` and still stops a stream cancelled before it started. Folding the second check into guard step 2 changes neither the class of check nor the claim. See N3.
4. **Corrected doc comments: FAIL (B2 above, and B3).**
   - **B3:** the module header says DuckDB clears the flag "at the start of every … `RunFunctionInTransactionInternal`" (`cancel.rs:12-14`, a sub-line span; retained spans byte-copied, the elision removes no qualifier). Amendment 1, item 2 records that this function clears the flag only when it opens an auto-commit transaction, so the header leaves out a condition the record established. Fix: attribute the clears in `Prepare` and `PendingQueryPreparedInternal` to `InitialCleanup`, and state the auto-commit condition.
   - `attach`'s paragraph (`cancel.rs:191-199`) is true.
   - `is_executing()`'s doc is complete (§8 item 6).
5. **Amendments 1 and 2: PASS on class and form.**
   - Amendment 1's first line says it was written after the results (class 1), states them, and says it invalidates nothing. Its sources are tracked; the extracted archive under D: is cited as evidence, not as Authority.
   - Amendment 2 opens with "Budget overrun, §7 not edited". It gives the declared figure, the final figure by §7's own command at a named commit, and the reason. §7 is unchanged: it reads the same at `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md:88` on the branch and on main. By my reading, the per-file figures add up to 429 and 395; the reviewer recomputes them.
   - Fixing B1 to B3 will change the figure. That needs a new class-8 row at the new head, not an edit to Amendment 2.
6. **Custodian's formatting commit: PASS, conditional on the reviewer's proof.** No rule forbids it. It formats only the piece's own lines, and it came before any gate. What I can read at c93d0ec is consistent with rustfmt's defaults, for example the chain breaks at `cancel.rs:123-127` and `:331-333`. However, Amendment 2's proof strips `,{};` as well as whitespace, and that also hides moved braces, which change scope. The reviewer should prove the commit is formatting only by rerunning rustfmt on fb98e43's hunks and comparing the result byte for byte with c93d0ec. Also, "each changed file" in Amendment 2 is loose: `stream.rs` shows the same numstat at both commits.

## Non-blocking notes

- **N1.** After each sleep, the re-interrupter interrupts without rechecking `in_execute` (`cancel.rs:131-138`). So one extra interrupt can land after the window closes while the connection is still bound. That is harmless: the token is cancelled for good and the connection is not reused before `detach`. Still, §2.1 says the thread exits when either condition is false. Either recheck after the sleep or document the extra interrupt.
- **N2.** Because the check now sits after `EXECUTE_CALLED`, a step-2 `Cancelled` leaves a trace with `execute_called` but no `execute_returned`. The comment at `stream.rs:1788-1792` also still says the span "brackets exactly this call". The reviewer should confirm that no kernel trace summarizer depends on those events coming in pairs.
- **N3.** `attach`'s doc dropped its "only thing" claim while the README blockquote (`engine/README.md:43-47`) keeps its own. They read inconsistently, but the README is not false.
- **N4.** The mutation observation of record for P0-1 says "the tree after fb98e43" (worker report line 34), and Amendment 1, item 1 names no commit. Name the commit when the record is next touched.
- **N5.** T5's fixture sits in a fixed shared temp directory (`cancel_execute_window.rs:25`). That follows the repo's convention, but concurrent runs would collide and the 2,000,000-feature file is never removed.
- **N6.** The worker report quotes T2 at 12.5 ms and T3 at 22.4 ms as test run times. No record should present them as cancellation figures (ADR-018 item 1).
