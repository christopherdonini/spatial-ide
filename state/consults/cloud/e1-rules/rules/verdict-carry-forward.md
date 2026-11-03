---
id: verdict-carry-forward
status: active
applies_to: [custodian, architect, reviewer]
when: [gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:391 @ 6b67d44 sha256:0c58790eefd07239bd6dc677ba226230fa9d65411f45a8a39768fe8170757b4b"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# verdict-carry-forward

*Paraphrase, not the human's words: the binding text is at the source.*

A Correctness or Evidence verdict passed at revision R carries to a later revision only when a semantic applicability check confirms the diff changes neither the supported claims nor their required evidence. File classification alone never suffices; a change to source, tests, configuration or fixtures reopens the affected verdict.
