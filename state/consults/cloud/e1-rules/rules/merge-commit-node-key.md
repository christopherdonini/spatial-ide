---
id: merge-commit-node-key
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:496-500 @ 6b67d44 sha256:020bcee57d7c92172ca38c0242d6143f91759ed069eae2e47d50eda0c0af9d39", "round 33, item 2", "round 34, items 4 and 5"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/verify-test-claims.mjs]
---

# merge-commit-node-key

*Paraphrase, not the human's words: the binding text is at the source.*

The custodian sets merge: merge-commit, the only accepted value, on a node that is not done when its PR will merge as a merge commit; main's own run after the merge is the proof. verify-test-claims.mjs then accepts as advisory, until the merge, a same-PR superseded pin refused by condition (e) alone; a squash or rebase merge makes the claim binding.

Procedure: scripts/plan/README.md, the `verify-test-claims.mjs` section.
