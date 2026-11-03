---
id: next-lane-runs-when-top-is-blocked
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:74 @ 6b67d44 sha256:fa3544c76a24d3f1d60cf7101fa97129d21d0c8c9f0e91915b41b3bf341e6075", "Appendix A, item 2"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/queue.mjs, scripts/hooks/stop-queue.mjs]
---

# next-lane-runs-when-top-is-blocked

*Paraphrase, not the human's words: the binding text is at the source.*

The ready set is ordered by lane priority (approved by the human once), then order, then id. When the top lane's next node is blocked on the human, the next lane's ready node is next: nothing waits on a "keep going".
