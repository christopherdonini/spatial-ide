Authority: PLAN node `kernel-ticket-drop-under-registry-lock` (DECISIONS-PENDING.md entry 132).
Scope: `kernel/src/skp.rs`; this file. Declared line budget <= 250 non-generated (fix + regression
tests) — over §21c's 150-line default; the Out-of-scope line below is why size is not what routes
this piece.
Change: `StreamRegistry::cancel`, `cancel_all_for_dataset` and `sweep_locked` (reached from
`sweep_expired`, `mint`, `redeem`, `cancel`, `cancel_all_for_dataset`) take a removed or replaced
`TicketState` out of the map and drop it only after the registry's `Mutex` guard is released, so a
`Pending` ticket's `EngineSource` — whose `Drop` can re-enter the same `Mutex` via
`SessionInvalidator::end_generation` -> `StreamRegistry::cancel` when its post-check has recorded a
source change — no longer deadlocks the thread that dropped it. No other behaviour changes: the
same outcomes, the same generation-end, the same refusals.
Tests+mutation: `kernel/src/skp.rs`'s new `ticket_drop_under_lock_regression` module —
`cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` (mutation: drop the
retired `TicketState` in place, under the lock, on the `cancel` path), `sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang`
(mutation: same, on the `sweep_locked` path reached from `sweep_expired`),
`cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`
(mutation: same, on the `cancel_all_for_dataset` path), and
`after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name` (an
outcome test, no drop-under-lock mutation of its own — it is the "no behaviour change" claim). Each
of the first three's mutation was performed once on this branch, observed to fail the named test by
timeout, and reverted before the fix landed in the same commit as its test.
Out-of-scope: this piece is **not** out of scope of §21a — it is a fix to code implementing a
stated guarantee: never block the canvas (docs/01), the cancellation guarantee ADR-018 states, and
ADR-019's admission-ticket mechanism. Full gating applies; the single combined-gate route (§21b)
does not.
Budget: 120 minutes (PLAN.yaml `budget_minutes` for this node).
