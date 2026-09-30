*Custodian's filing note (2026-09-30): the gate-1 architect's scoped confirmation on PR #147, at the same head, on the reviewer's gate-1 N1 (the unregistered mutation M4) and N4 (a client cancel followed by an end), for PLAN node `kernel-ticket-liveness-redeem-wording` at generation 1. Reviewed: cut/ticket-liveness-redeem @ 616f20d (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. The optional hardening in item 1 is not taken, so the gated head stays 616f20d; the closing record states that the composition is proven by inspection at 616f20d and claims no test against M4. Profile paths redacted at filing: none.*

---

Reviewed: cut/ticket-liveness-redeem @ 616f20d

Scoped confirmation, PR #147 gate 1 (architect), `cut/ticket-liveness-redeem @ 616f20d`. Neither note blocks, and my PASS stands.

**Item 1 (the reviewer's N1, mutation M4): not blocking, and no test is owed.** The closing record must not claim a test catches M4. The optional hardening below is a one-line build-time guard.
**Item 2 (the reviewer's N4, a client cancel followed by an end): consistent with reading R and §1(i)/(iii). My I6 ruling stands, and nothing goes to the human.**

Reasons:
1. **No test can catch M4 within the form.** The re-read only matters inside the window between the two steps. A test can reach that window through `create_from_ticket` only with an interposition hook (forbidden by §8 item 2) or a real second thread (forbidden by §8 item 8 and §1). M4 is not registered in §4, and the four registered mutations are met.
   - A `dead_code` warning is not a guard, because CI does not deny warnings. So the record must say the composition is proven by inspection at 616f20d. It must not write "discharged" against any test (round 7).
   - **Optional hardening:** put `#[deny(dead_code)]` on `redeem_or_liveness_refusal`. M4 then fails the non-test build. It is an attribute, not a hook, and falls within §2a. If added, the record names the build as the proof, with the commit.
2. **The answer is a fact the kernel recorded, not a guess.** The ticket's generation did end for that reason, and the record holds.
   - At base, a START made after the end already gets the record's code from the first read, whatever caused the ticket's cancel. §1(iii) makes the re-read give the same answer.
   - ADR-035 Decision 2's redemption bullet makes no exception for a ticket the client cancelled first. The falsification in §5 covers handles with no record, so it is not triggered here.
