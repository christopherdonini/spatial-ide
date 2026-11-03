---
id: queue-and-site-regenerated
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml", "governance/CUSTODIAN-QUEUE.*", "site/**"]
source: ["governance/AUTONOMY.md:71 @ 6b67d44 sha256:db4ae7e381c1b88e3fe82cfc3cdc6b81fabee894116333fa1dc2c0bc385bc12e", "governance/AUTONOMY.md:136 @ 6b67d44 sha256:a98c58e0c7b6309caa27517c367e7e193668f0c887331ea9bfd1516abe530db3"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/plan/queue.mjs", "file-exists: scripts/plan/site.mjs"]
enforced_by: [scripts/plan/queue.mjs, scripts/plan/site.mjs]
---

# queue-and-site-regenerated

*Paraphrase, not the human's words: the binding text is at the source.*

CUSTODIAN-QUEUE.md, CUSTODIAN-QUEUE.json and site/ are generated from PLAN.yaml by scripts/plan/queue.mjs and scripts/plan/site.mjs. After any PLAN.yaml change they are regenerated, never hand-edited; governance-ci runs both with --check and fails on a diff.

Procedure: scripts/plan/README.md, headings "`queue.mjs` — the generated queue (§2)" and "`site.mjs` — the landing page (§5)".
