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

## Results

Fix + tests at `kernel/src/skp.rs` @ 8ff2875ce9486c3e2bf528ebc9d51fa9b255c472.

- Before the fix (this branch's prior tree state, uncommitted): the four new tests, run once,
  FAILED by name — `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`,
  `sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang`,
  `cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`,
  `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name` — each
  panicking on its own "did not return within 5s" message.
- After the fix @ 8ff2875: `cargo test -p spatial-kernel --lib skp::` — 28 passed, 0 failed.
  `cargo test -p spatial-kernel` — rc 0. `cargo test -p spatial-engine` — rc 0.
  `cargo clippy -p spatial-kernel --all-targets` — rc 0; the one warning naming `kernel/src/skp.rs`
  (`:197`, `type_complexity` on `redeem`'s return type) is unchanged text at
  `kernel/src/skp.rs:172` @ 96d8668 (origin/main before this piece) — not new.
- Each of the first three tests' RECORDED MUTATION was performed and reverted on this branch before
  8ff2875: each reintroduction made exactly its own named test FAIL by timeout, and left the other
  three passing.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` — 256 passed, 0 failed, rc 0.
- `node scripts/plan/verify-quotes.mjs` — rc 0. `verify-cites.mjs` — rc 0. `verify-test-claims.mjs`
  — rc 0. `verify-mutation.mjs --base origin/main --head HEAD` — rc 0, all 4 new tests named.
  `verify.mjs --offline` — rc 0.

## Amendment 1 (correction round 1 — PR #116 attempt 1: architect PASS/S1/R1–R5, reviewer FAIL/D1–D5
record-only; commits below not yet on main are disclosed as branch commits)

(a) Class 1 (post-result). S1 discharged at `6b94f1e` (branch commit): `StreamRegistry::tickets`'s
field doc comment states the no-drop-under-guard invariant and names `mint`'s and `redeem`'s
`insert()` return values (always `None`) by symbol.

(b) Class 4 (mutation added after a gate finding). Reviewer should-fix discharged at `6b94f1e`
(branch commit): `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` and
`cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` each gain
a `ticket_liveness == EndedBySourceChange` assertion and RECORDED MUTATION (B) — forgetting the
retired value instead of dropping it after release; observed on this branch (performed once each,
reverted): (B) on `cancel` fails only the new assertion in its own test, (B) on
`cancel_all_for_dataset` fails only the new assertion in its own test (confirming the reviewer's
finding that the pre-existing assertions alone let it pass).

(c) Class 1. D1 corrected: RECORDED MUTATION (A) on `cancel` (drop-in-place under the lock,
pre-existing) was re-run on this branch and observed to also fail
`after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`, not only
`cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` as the Results section
above says. The Results section stands unedited (append-only); this row supersedes its "left the
other three passing" clause for mutation (A) on `cancel` only — the `sweep_locked` and
`cancel_all_for_dataset` mutations' isolation from the other three tests was re-confirmed unaffected.

(d) Class 4. D3 discharged at `9ab46fe` (branch commit):
`after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`'s doc
comment now names both of `cancel`'s RECORDED MUTATIONs it is not free of — (A), per (c), and (B),
added at `6b94f1e` (branch commit) alongside (b) — each observed once on this branch and reverted.
Its "cancelled … real end-to-end via `SkpHost`" clause is also corrected there: the cancel this test
drives is `StreamRegistry::cancel` directly, and only the test's own final `viewport_query` goes
through a real `SkpHost`.

(e) Class 3. D4 corrected: the Results section's clippy bullet's bare `:197` line pin is superseded
below by a symbol cite (`type_complexity` on `redeem`'s return type) — the line had already moved to
`:207` by (a)'s insertion alone, which is why a line pin was the wrong shape here. This round's tool
runs are named by commit in the Checks row below, closing the "tool results without a commit" half
of D4/R3/R4.

(f) Class 1. R5 corrected: the Scope line's "ADR-019's admission-ticket mechanism" clause does not,
alone, justify full gating —
`docs/adr/ADR-019-control-plane-admission-tickets.md:3 @ d4362bd sha256:fc621681dcff98bdcf336c62d8c7aecf99fcecd4535f1c0256ecaac550823d61`
states ADR-019 is Proposed and binds nothing until accepted. Full gating rests on docs/01's
never-block-the-canvas rule and the Accepted ADR-018 alone, both already named on the same Scope
line; ADR-019 stays named there only as the mechanism this fix's code belongs to, not as an
independent gating reason.

(g) Class 6 (budget deviation, Scope not edited). Declared figure: <= 250 non-generated lines.
Final figure under §21c's counting rule (insertions + deletions over `kernel/src/skp.rs`, this
preregistration excluded): 488 at `7744fbd` (undeclared at that commit — D2/R1), 535 at `9ab46fe`
(branch commit) after this round's items (a)–(e). Reason: the fix moves four call sites' drop point
under a real, drained end-to-end chain and this round adds a second recorded mutation and a doc
correction to three of the four regression tests; the Out-of-scope line already routed this piece to
full gating at commit, so §21b's mid-piece route-closure does not additionally apply.

(h) D5 resolved, no new class: the five-line form is kept under full gating on the precedent of
round 16, item 1 — byte-copied, "rendering is new user-visible behaviour, which crosses §21c's
bound, so the architect reads alongside the reviewer with the five-line form kept" — which this
piece's own architect attempt-1 PASS already applied without blocking on the form's shape.

Checks this round, all at `9ab46fe` (branch commit) unless named otherwise: `cargo test -p
spatial-kernel --lib skp::` — rc 0, 28 passed (re-run at `9ab46fe`). `cargo test -p spatial-kernel` —
rc 0 (at `6b94f1e`, unaffected by `9ab46fe`'s doc-only change). `cargo test -p spatial-engine` — rc 0
(at `6b94f1e`). `cargo clippy -p spatial-kernel --all-targets` — rc 0 (at `6b94f1e`), no new warning
(the pre-existing `type_complexity` note on `redeem`'s return type — cited by symbol, not line, per
(e)). `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` — rc 0, 256 passed (at
`6b94f1e`). `verify-quotes.mjs` — rc 0. `verify-cites.mjs` — rc 0. `verify-test-claims.mjs` — rc 0
(all three re-run at `9ab46fe`). `verify-mutation.mjs --base origin/main --head HEAD` — rc 0, all 4
tests named (re-run at `9ab46fe`). `verify.mjs --offline` — rc 0 (at `6b94f1e`).

### Superseded index (as of Amendment 1) — read this amendment first

- Results section: "each reintroduction made exactly its own named test FAIL by timeout, and left
  the other three passing" is superseded for mutation (A) on `cancel` by (c); unaffected for the
  `sweep_locked` and `cancel_all_for_dataset` mutations.
- Results section: the clippy bullet's `:197` line pin is superseded by (e)'s symbol cite.
- Scope line: the "ADR-019's admission-ticket mechanism" clause, read as an independent full-gating
  justification, is superseded by (f); it stands only as a mechanism reference.

## Amendment 2 (correction round 2, the last under the record cap: PR #116 attempt 2, `state/gate-log.json` index 173 (architect) and index 174 (reviewer), both FAIL record-only; commits not on main are disclosed as branch commits)

(a) Class 1. Amendment 1 (h)'s reproduced span of round 16, item 1 and its clause crediting the architect's attempt 1 with applying that precedent are withdrawn. D5 is ruled at `state/gate-log.json` index 173 (architect, attempt 2).

(b) Class 3 (tense). The five-line form's Tests+mutation line's last sentence records the three mutation runs in the past tense at `fa39539` (branch commit), which is the parent of `8ff2875` (branch commit), the commit that adds the fix and its tests. That sentence is read as the planned step; the runs are recorded by the Results section's mutation bullet, as superseded by Amendment 1 (c), and by Amendment 1 (b).

(c) Class 3. The Results section's clippy pin is completed as `kernel/src/skp.rs:172 @ 96d8668 sha256:ba5a20cb973fd24c19bda5a9c374082be0525ad6a42615c593ca8ba44a2c6148`, a historical pin authoritative for what origin/main carried before this piece, while Amendment 1 (e)'s symbol cite is authoritative for the current tree. Amendment 1 (e)'s bare line number is superseded by that symbol cite alone, since no commit on main carries that line.

(d) Class 3. The Results section's last two bullets (the `node --test` and `verify-*` runs), which name no commit, are superseded by Amendment 1's Checks paragraph, which names each run's commit.

(e) Class 3 (test text, by named exception). The doc comment of `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name` as it stood at `9d2586c` (branch commit; no commit on main carries it, so no hash) is corrected in place in this commit: its heading no longer calls mutation (B) a drop-under-lock mutation, and (B)'s failure site is the test's `expect_err` call, not its `refused.code` assertion (`state/gate-log.json` index 174).

### Superseded index (as of Amendment 2) - read this amendment first

- Amendment 1 (h): the reproduced span of round 16, item 1 and the clause about the architect's attempt 1, by (a).
- The five-line form's Tests+mutation line's last sentence, read as a record of runs, by (b).
- Results section, clippy bullet: the unhashed `96d8668` pin, completed by (c); Amendment 1 (e)'s bare line number, by (c).
- Results section: the last two bullets' tool results without a commit, by (d), and with them Amendment 1 (e)'s clause closing that half of D4.
- The fourth regression test's doc comment as at `9d2586c` (branch commit), by (e).
- Amendment 1's superseded index stands for what it names; this index adds to it.
