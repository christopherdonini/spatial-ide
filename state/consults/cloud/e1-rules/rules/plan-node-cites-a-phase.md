---
id: plan-node-cites-a-phase
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:17 @ 6b67d44 sha256:9b7abe8c378ca2a2a0b1328a5e0c9672848785beac53cc0f562581006b2af134", "Appendix A, item 1"]
supersedes: []
superseded_by: []
assumes: ["file-exists: governance/PLAN.yaml", "file-exists: docs/07_Roadmap.md"]
enforced_by: [scripts/plan/verify.mjs]
---

# plan-node-cites-a-phase

*Paraphrase, not the human's words: the binding text is at the source.*

PLAN.yaml decomposes docs/07_Roadmap.md and never competes with it: every node cites the docs/07 phase it belongs to. A node that fits no phase is appended as proposed and is not queued until the human places it.

Note: the source says the file sits at the repo root; since piece F it is governance/PLAN.yaml (governance/MOVED.tsv). verify.mjs checks that the phase exists, not that it fits.
