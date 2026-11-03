---
id: open-entry-ruled-marker
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:663 @ 6b67d44 sha256:ab03c6d4f3e1aa64da188b95f588a2dbbb0f9fd54dc8d095df67049fe6f60de1"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/rotate-decisions-pending.mjs]
---

# open-entry-ruled-marker

*Paraphrase, not the human's words: the binding text is at the source.*

When an open DECISIONS-PENDING.md entry is ruled, its head gains the marker [RULED <date> — question round <n>; see the RULED block at the top; recorded as filed:], so that the next rotation archives it.
