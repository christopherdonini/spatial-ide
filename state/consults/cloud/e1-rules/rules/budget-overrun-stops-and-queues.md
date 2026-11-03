---
id: budget-overrun-stops-and-queues
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:199 @ 6b67d44 sha256:f44ac2151f46cd374d90c023c9f87dceca57a1cf7a641c56155d615a9110e218", "Appendix A, item 10"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# budget-overrun-stops-and-queues

*Paraphrase, not the human's words: the binding text is at the source.*

A node past twice its budget_minutes stops and queues: the overrun goes in the ledger, the node is set blocked with needs_human: {kind: ruling} (continue / narrow / drop), and the queue moves on.
