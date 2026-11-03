---
id: ledger-committed-at-flush-and-report
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:292 @ 6b67d44 sha256:642d918fe9c4008d6bc18e1654c62c4d9b14f1b6f2cfacbbe740abdde928a34c", "Appendix A2, item 17"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# ledger-committed-at-flush-and-report

*Paraphrase, not the human's words: the binding text is at the source.*

The ledger is tracked under state/: state/CUT-STATE.md with its SESSION-CONTINUITY block, state/NEXT-CUT.md and state/cut-archive/. It is committed at every flush and at every report: the checkpoint is the commit.
