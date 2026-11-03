---
id: plan-edit-rights
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:67 @ 6b67d44 sha256:d164044680a70fb27155b3af71015e8b64f0683f49acc68a31facaca76f1079e", "governance/AUTONOMY.md:137 @ 6b67d44 sha256:bd66fef0f1f34ecf151856beca1c4d98a48d4bed0b375a66ac2af5cb0925c372", "Appendix A, item 1"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/verify.mjs]
---

# plan-edit-rights

*Paraphrase, not the human's words: the binding text is at the source.*

The custodian may append proposed nodes, move a node to in-progress when its branch opens, move it to done when its evidence verifies and felt_verdict is false, bump generation and update dates.

Only the human changes a lane's priority, sets order on a proposed node (exception: PRECEDENTS P-034), marks done a felt_verdict node, or deletes a node.

Enforcement is partial: verify.mjs fails a felt_verdict done without a RULED cite; it cannot see who edited a priority.
