---
id: pre-rustfmt-unpinned-cites
status: active
applies_to: [custodian, architect, reviewer, worker, worker-high]
when: [correct-record, gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:515-518 @ 6b67d44 sha256:948351e00c9ff4d4c6c42aa400fc04bbea213d07a916388673390788be6c0ecc", "state/directives/2026-10-02-rustfmt-notes.md:15-18 @ 6b67d44 sha256:2db04e9793d79b48c681febca5cc6b23c5ed0fbfcafaaf83c93e64ea14128391"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# pre-rustfmt-unpinned-cites

*Paraphrase, not the human's words: the binding text is at the source.*

An unpinned path:line reference in a record dated before the rustfmt merge commit 51ed3b2 (PR #157) resolves against its first parent, b598784. A pinned reference resolves at its pin. No record is edited for this.
