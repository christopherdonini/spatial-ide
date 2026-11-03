---
id: plan-status-derived
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:54-63 @ 6b67d44 sha256:20c04751588eb6ebedec2c5cd0d5fdcc64a0ebb06fd6a2f21edacccdd9a6df3f", "governance/AUTONOMY.md:134-135 @ 6b67d44 sha256:d452b77bfa317af6d63ed1c71e462f49799c254f46da5e119ff6ac902b848e8b"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/verify.mjs]
---

# plan-status-derived

*Paraphrase, not the human's words: the binding text is at the source.*

ready and blocked are derived, and the recorded value must equal the derivation: ready when every depends_on node is done and needs_human.kind is none; blocked when a dependency is not done or needs_human.kind is not none. in-progress names a branch or an open PR in evidence. proposed and unscheduled nodes are never queued; a proposed node waits for the human to set its order.
