# Directive — A2-1 lands before B1 closes; Fable's clarification of the 2026-09-28 S1 batch (the human, verbatim)

*Custodian's filing note (2026-09-29): the human's typed answer to the custodian's question on A2-1's timing, asked after the 06:10Z ledger entry. It relays Fable's clarification of the 2026-09-28 ruling (`state/directives/2026-09-28-after-wave-s1-batch.md`, the ruling line and Fable's A2-1 paragraph). It is filed beside that ruling, as the answer asks, and it is recorded verbatim below the rule, as received. It supersedes the reading in the 2026-09-28 handoff flush (edbd939, intended sequencing item (4)) that A2-1 waits for B1's close. Cited as "the 2026-09-29 A2-1 clarification".*

---

Fable's clarification of the 2026-09-28 ruling: "fixed as part of B1's close" means A2-1 belongs to B1's
contract and must land BEFORE B1 closes, via ADR-023's amendment while it is still Proposed. It does not
wait for b1-shell-half; nothing in the fix touches the shell. The handoff's "waits for B1's close" was
Fable's loose wording.
- Order: B-1 stays first. A2-1's P0 and preregistration may run while B-1's proposal is with Fable.
- A2-1's preregistration comes to Fable before any code, including any new refusal code and the ADR-023
  amendment text. The human accepts the amendment with B1's close.
- Encode the dependency the other way: whichever node closes B1 depends on b1-close-nul-column-names.
  Record this clarification beside the 2026-09-28 ruling.
