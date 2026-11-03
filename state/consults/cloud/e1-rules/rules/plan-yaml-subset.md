---
id: plan-yaml-subset
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:19 @ 6b67d44 sha256:222e0cdaeab3321502c336acd0a5be050b7216144805b10a280cf34c677d325e"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/plan/yamlSubset.mjs"]
enforced_by: [scripts/plan/yamlSubset.mjs, scripts/plan/verify.mjs]
---

# plan-yaml-subset

*Paraphrase, not the human's words: the binding text is at the source.*

PLAN.yaml is written in the declared YAML subset that scripts/plan/yamlSubset.mjs parses. Anything outside it is rejected with its line number, and no parser dependency is added for it: dependency additions are the human's.

Procedure: scripts/plan/README.md, heading "The declared YAML subset (`yamlSubset.mjs`)".
