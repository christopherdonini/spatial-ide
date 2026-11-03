---
id: wording-block-gate-author
status: active
applies_to: [architect, reviewer]
when: [draft, gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:536 @ 6b67d44 sha256:728df7f90d818b83db203b674dabf32d91b6954629b962ba1c4ad0e0a8d5866e", "governance/AUTONOMY.md:541-544 @ 6b67d44 sha256:a4b9ebfaff3149ad5f97feb99b0b10b591aaeac7db132094f98c8e0de14ab721", "state/directives/2026-10-11-direction-after-status-review.md:14-25 @ 6b67d44 sha256:d26d781228f0ac58aa937aa3793ff96560f334f3401dcb70ee663f48480882ec"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# wording-block-gate-author

*Paraphrase, not the human's words: the binding text is at the source.*

When a gate's only blocking findings are the words of a document sentence and Correctness and Evidence are closed, its author writes exact replacement words in the same report, each clause checked against the code, and says whether the sentence is the human's wording.

A sentence is judged at what an operator can observe in the shipped app; a case needing in-request timing, a dev-only switch or an instrumented build does not block and is named for the source comment. A new sentence of the human's stating what code does is drafted by the architect in the form, with the same check. Not covered: red-line texts, app strings (P6), findings that change code.
