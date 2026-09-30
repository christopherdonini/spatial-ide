*Custodian's filing note (2026-09-30): the architect's gate 2 on PR #146, for PLAN node `engine-cancel-before-stream-window` at generation 2, full gating, after correction round 1. Reviewed: cut/cancel-before-execute @ 9801778 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 9801778. N6 is already met: the siblings node's summary names both texts (537c55a). Profile paths redacted at filing: none.*

---

Reviewed: cut/cancel-before-execute @ 9801778

**Verdict: PASS with notes.** Reviewed `cut/cancel-before-execute @ 9801778`. The form's §10 and worker report 2 were read at main f8b394d. I had no shell, so the reviewer recomputes the figures and checks the diff.

## 1. B1, B2 and B3 at 9801778

- **B1: resolved (PASS).** `engine/src/cancel.rs:141-157` now uses `std::thread::Builder::new().name(..).spawn(..)` with `let _ =`, so a failed spawn has no panic path. The name is a constant with no NUL byte, so `Builder` cannot panic on it either. This meets §2 item 3.
- **B2: resolved (PASS).** `cancel.rs:45-53` now says the interrupt from `attach` is not latched. It says the field is not what stops a query cancelled before `attach` or `prepare`, and that the flag checks do. Both statements agree with `an_interrupt_on_an_idle_connection_is_not_latched` and Amendment 1, item 2.
- **B3: resolved (PASS).** `cancel.rs:12-17` attributes the clears to `InitialCleanup`, and says `RunFunctionInTransactionInternal` clears the flag only when it opens an auto-commit transaction.

## 2. Amendment 3

**Class 2: PASS.** Its first line says it was written after gate 1's results and states its class. It records the deviation (the CI run failed while T5 was predicted to pass) with its evidence, and states the reason as unmeasured. It does not edit §3's F3 or §5. §5's third invalidator named in advance a class-2 amendment as the way to re-declare F3.

**T5 against the re-declared F3: PASS.**
- The viewport covers the whole extent (`engine/tests/cancel_execute_window.rs:60-68`).
- The predicate goes through the real `AdmittedPredicate::admit` (`:89`).
- Report 2's PREDICATE EVIDENCE section records a scan of 2,000,000 rows for the OR predicate, each disjunct alone rejected, and 7 of 7 passing unmutated runs.
- The fixture now sits in a per-run directory that is removed on drop (`:36-56`).

**The shared-assertion residual: acceptable as disclosed, not blocking.** The form registered this outcome in advance: §5's third invalidator treats a missed window as an invalid run. Amendment 3, item 4 and the comment at `cancel_execute_window.rs:31-32` both state that a missed window and T5's mutation fail the same assertion. The measured window is about 0.5 s against a 1 ms poll, and the mutation's failure is deterministic because `in_execute` is only ever set inside `execute_guarded`.

## 3. Amendment 4

**Class 8: PASS.** Its first line reads "Budget overrun, §7 not edited". It gives the declared figure (400 over 4 files) and the final figure by §7's own command at a named commit (494 over 4 at 9801778). By my reading the per-file figures add up to 494. It gives the reason by reference to report 2, and it leaves Amendment 2 standing as c93d0ec's record. §7 is unchanged. It opens no gate route.

## 4. The trace change on the cancelled path

**PASS: within §2 and ADR-018.**
- When a step-4 guard `Cancelled` stamps `PRODUCER_CANCELLED` and returns (§2 item 2, together with step 4 in §2 item 1), `produce` returns before the `EXECUTE_RETURNED` stamp. That stamp is still in its original position, after the match on the `Ok` path (`engine/src/stream.rs:1807`).
- The baseline already left `execute_called` without `execute_returned` whenever `stream_arrow` returned `Err`: main's `stream.rs:1762` stamps `execute_called`, and `:1777` returns before `execute_returned`. So this shape is not new.
- A step-2 `Cancelled` now leaves no `execute_called`, which restores the baseline trace for that path.
- ADR-018 item 1's instants are unaffected, because `PRODUCER_CANCELLED` is `cancel_observed`, and the execute events are span marks.
- The comment at `stream.rs:1793-1796` states all of this accurately. The reviewer confirms report 2's reading that the pairing consumers omit an unpaired span rather than zero it.

## 5. The folded notes

**PASS.**
- **The RAII `WindowOpen` guard** (`cancel.rs:60-68` and `:176-184`). It clears `in_execute` on step 2's return and on an unwind. It is dropped explicitly before step 4 reads `cancelled`, which keeps §2.1's order.
- **The recheck after the sleep** (`cancel.rs:143-156`). After each sleep the thread reads `in_execute` and the slot under the slot mutex, then interrupts. It exits when either is false, as §2.1 says. That covers §8 item 3 (every interrupt is under the mutex, and none can follow `detach`, which takes the same lock). §8 item 4 is unchanged: one spawn per token, only on the transition. §8 item 5 is met (B1).

## 6. §8 at 9801778

1. **PASS.** The only deadlines are the liveness ones, and elapsed time is printed, never asserted.
2. **PASS.** Four files; no sibling, wire or dependency change. The reviewer confirms this over the full diff.
3. **PASS.** See item 5 and N1.
4. **PASS.**
5. **PASS.**
6. **PASS.** `cancel.rs:197-204` still carries every element of the instrument-accessor exemption.
7. **PASS.** Report 2's MUTATIONS table records all five tests failing by name at 9801778. The T2 and T3 mutations are worded differently from §4 but mean the same, and report 2 discloses that at line 34.
8. **PASS.**

## Blocking findings

None.

## Non-blocking notes

- **N1.** The guard clears `in_execute` without taking the slot lock, so it can clear the flag between the re-interrupter's check and its interrupt. At most one interrupt can therefore land just after the window closes. That is harmless: the connection is still bound to this token, the token is permanently cancelled, and nothing can reach the connection after `detach`. The comment at `cancel.rs:148` ("not interrupted into") holds only for a window that closes during the sleep. Reword it at the next edit.
- **N2.** Amendment 3, item 3 says "The fixture is the same", but T5 adds `AttributeMode::CategoricalZone` (`cancel_execute_window.rs:80`), which puts a `zone` column in the fixture. Only report 2, item 4 records this. If the record is touched again, point to report 2 for it.
- **N3.** Report 2, line 20 calls the `zone LIKE` rejection "the plausible cause of the CI miss". The CI miss at c93d0ec ran the old F3, which had no predicate, so that clause is wrong. Amendment 3, item 2 correctly keeps the reason unmeasured. The report is evidence, so no correction is owed unless something cites that clause.
- **N4.** `cancel_execute_window.rs:28-30` says each disjunct on its own is decided "without reading the row groups". Report 2 shows that for `zone LIKE` (0.003 s). For `id + id < id` it gives only a 0.02 s runtime and "pushed to the scan", with no count of rows read. Soften the claim to match its evidence when the file is next edited.
- **N5.** This was correction round 1 of 2 under the record cap. If a round 2 is needed, the architect reduces the record to references afterwards.
- **N6.** Two stale docs are left for PLAN node `engine-cancel-before-execute-siblings`: the README blockquote's "only thing" and the `lease_for_stream` doc. The custodian should make sure that node's summary names both.
