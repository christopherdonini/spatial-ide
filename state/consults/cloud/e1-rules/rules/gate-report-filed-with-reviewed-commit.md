---
id: gate-report-filed-with-reviewed-commit
status: active
applies_to: [custodian, architect, reviewer]
when: [gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:480 @ 6b67d44 sha256:b8da618dd28b5cba5235c7c9a79d4b0bafdd69b014a6c5d9ed017b2d95f9ad9f", "round 25, item 2 (b)"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# gate-report-filed-with-reviewed-commit

*Paraphrase, not the human's words: the binding text is at the source.*

A gate report names on its first line, beside the verdict, the branch and commit it reviewed, as <branch> @ <commit id>. The custodian files it as state/consults/gates/<date>-<piece>-gate<n>-<architect|reviewer>.md: a first-line filing note naming the gate, attempt, PLAN node and "Reviewed: <branch> @ <commit id>", then the hand-back byte-identical. Its cites are read at that commit and never rewritten; a record citing a report line pins it at a main commit with its hash.
