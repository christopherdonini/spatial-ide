---
id: continuity-block-is-not-the-lease
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:183 @ 6b67d44 sha256:56a5d6009797d07508f458cab48f442b00119c167f56edf675affcc5596554e5"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/hooks/session-resume.mjs", "file-exists: governance/AI_DEVELOPMENT.md"]
enforced_by: [none]
---

# continuity-block-is-not-the-lease

*Paraphrase, not the human's words: the binding text is at the source.*

At startup, resume, clear and compact, the SessionStart hook prints the reading order, the continuity block verbatim and one line of machine facts. The block informs the incoming session; it does not transfer the lease (AI_DEVELOPMENT.md, "The lease and handover").
