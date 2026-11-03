---
id: plan-text-no-unmeasured-numbers
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:50 @ 6b67d44 sha256:d43a56c1854231c7e3cc840a164080e7d1f8aa18e0a73a11a26514ff1c1b1794", "governance/AUTONOMY.md:127 @ 6b67d44 sha256:e772c266d21e177a26cf8751bead268201f71100664f4185fb91bcc4b1eb66ac", "Appendix A, item 5"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/site.mjs]
---

# plan-text-no-unmeasured-numbers

*Paraphrase, not the human's words: the binding text is at the source.*

A node's title and summary carry no duration, rate or percentage unless the node carries measurement: {results: <tracked RESULTS.md anchor>, row: "<docs/08 row>"}. site.mjs refuses to generate otherwise.
