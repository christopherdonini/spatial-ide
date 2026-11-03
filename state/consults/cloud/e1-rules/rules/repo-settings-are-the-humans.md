---
id: repo-settings-are-the-humans
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:211 @ 6b67d44 sha256:a038570048ca46c70850246997569041121bdbc9576ac9e764457fb71d0fc6a1", "governance/AUTONOMY.md:304 @ 6b67d44 sha256:425e48e7acd84af8dce084ea48850a3221726833fedb1a8ce0dde44df2c5ab3a", "Appendix A2, item 20"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# repo-settings-are-the-humans

*Paraphrase, not the human's words: the binding text is at the source.*

Branch protection on main, the v* tag ruleset (required CI and DCO, no force-push, no deletion), secret scanning with push protection, Dependabot alerts and the least-privilege gh token are the human's to set and re-issue, never the custodian's.

A dependency change stays a red line; the patch-bump precedent is PRECEDENTS P-033 and reaches no further than its words.
