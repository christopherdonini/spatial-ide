---
id: continuity-refresh-and-health-commit
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:184 @ 6b67d44 sha256:dfa1e80b67a815617bbbb3b6eb747d7224cb9a448bf5093134d012a35940b9a5", "governance/AUTONOMY.md:527 @ 6b67d44 sha256:7491e86cc45b76a850c3b8ebbc6d3a22182df67e0e1f9f43e33049c9c727096c", "governance/AUTONOMY.md:622 @ 6b67d44 sha256:29c98bdb59c95ca299089b57fbcb6da5aa80c9d4c6ee87a715b5a4f4ceeb7f65"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# continuity-refresh-and-health-commit

*Paraphrase, not the human's words: the binding text is at the source.*

The continuity block is refreshed at milestones. For a handoff or the pre-compaction flush, the machine facts are refreshed first in a commit of their own (node scripts/plan/health.mjs && node scripts/plan/site.mjs, committed as chore(site): health refresh), so the flush commit stays ledger-only. A milestone refresh is a ledger-only commit with no health refresh before it.
