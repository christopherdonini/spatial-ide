---
id: filler-slot-admission
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:692 @ 6b67d44 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84", "governance/AUTONOMY.md:696 @ 6b67d44 sha256:c7a81594eb17a9f535e32fedcb97532168822b9cda9606ce131d5d26097ba92f", "state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md:8 @ 6b67d44 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84"]
supersedes: []
superseded_by: []
assumes: ["file-exists: state/FILLER-QUEUE.md", "agent-exists: architect", "agent-exists: reviewer"]
enforced_by: [none]
---

# filler-slot-admission

*Paraphrase, not the human's words: the binding text is at the source.*

A filler slot beside slots 1 and 2 is never idle while state/FILLER-QUEUE.md (the human orders it; the custodian may propose additions) holds a piece. A piece runs there only if it: is on that queue; touches no path of a slot 1 or 2 piece, of the docs or governance lanes, or of a PR awaiting the click; fits a five-line form under size-threshold with reviewer and architect gating from dispatch; is graded S3 unless the human grades it; shows only P6 placeholder strings; sends red-line text to the human. One filler at a time.
