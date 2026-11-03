---
id: plan-summary-states-current-state
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:675 @ 6b67d44 sha256:8120075d21dada47fe1710fde115083979c81df300f9599c63e3b9679524bd25", "governance/AUTONOMY.md:680-681 @ 6b67d44 sha256:0e3ad578e8905a8ae076f5a4dc6306a38f1a24e63e04073ed1485363050a429e", "state/directives/2026-10-20-governance-d-done-node-summaries-archived-the-2026-10-14-trim-sentence-corrected.md:23 @ 6b67d44 sha256:2df8ce388e1588d1cd2620548b20312b90080504eddcc14db2444a6b5cdf18ff"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/rotate-plan-summaries.mjs]
---

# plan-summary-states-current-state

*Paraphrase, not the human's words: the binding text is at the source.*

A node's summary states its current state and what is owed. A done node's history belongs in its form's closing record and the ledger; the monthly rotation moves what is left. An old summary is searched by node id in state/cut-archive/ (search-excluded-locations-explicitly).
