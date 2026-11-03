---
id: size-threshold
status: active
applies_to: [custodian, architect, reviewer]
when: [draft, gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:349-357 @ 6b67d44 sha256:c99b2fcabe5d66acf6c904d268db4cb8f1d2451a4429bcba596b0381a2749159", "round 5, item 2"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# size-threshold

*Paraphrase, not the human's words: the binding text is at the source.*

Under the threshold means at most 150 changed lines (insertions plus deletions) of non-generated code and tests across at most 8 files, with no new exposure surface, no new dependency and no new user-visible behaviour. Generated files do not count; the only exempt text is the piece's own five-line form and the governing-doc sentences it must update to describe itself. Crossing any bound takes full gating.

The number is the custodian's stated choice under Appendix A3; the human adjusts it by a one-line note.
