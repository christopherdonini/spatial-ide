---
id: generated-files-regenerate-on-merge
status: active
applies_to: [custodian, worker, worker-high]
when: [build]
paths: ["governance/PLAN.yaml", "governance/CUSTODIAN-QUEUE.*", "site/**"]
source: ["governance/AUTONOMY.md:470 @ 6b67d44 sha256:3d8b1e3d34bd6ad63a82413f44c1305a8c769451acbf1cd4bf1f092dbbd7d40e", "state/directives/2026-09-19-generated-files.md:5 @ 6b67d44 sha256:d268f9e53e4644885c55ff3fb6d44b6bbd7b88d3d96b93d8cc1c54903affc1df"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/queue.mjs, scripts/plan/site.mjs]
---

# generated-files-regenerate-on-merge

*Paraphrase, not the human's words: the binding text is at the source.*

Generated files are never conflict-resolved by hand. When a branch touching PLAN.yaml conflicts with main: merge origin/main, take main's version of every generated file, resolve PLAN.yaml semantically keeping both sides' node changes, run the generators and verify.mjs, then commit, push and let CI run. Each sibling PR that conflicts the same way gets the same treatment.

Procedure: scripts/plan/README.md, heading "generated-files-regenerate-on-merge" (to be added). The source names pre-move paths (governance/MOVED.tsv).
