---
id: wait-loops-and-background-shells
status: active
applies_to: [custodian, architect, reviewer, worker, worker-high, tester, tester-high, lead-data, evidence-reader]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:703 @ 6b67d44 sha256:ff241345b6faec828fad7670037800e961fba6a4aa6c440c3bd235b1b1c6bfbd", "governance/AUTONOMY.md:707-709 @ 6b67d44 sha256:69667a55585685e080bfc2e838ebcbb11bed00c4bffe6c556b73a9f8e4f65bce", "state/directives/2026-10-29-wait-loops-sleep-and-time-out-background-shells-killed-at-closing.md:6 @ 6b67d44 sha256:d0b8b9f33769c62fa60624d3d26b69898370127ee213a99799b8485ee5b862f8"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# wait-loops-and-background-shells

*Paraphrase, not the human's words: the binding text is at the source.*

A wait loop sleeps at least one second per turn and carries a hard timeout that ends it. Every agent reports the background shells it leaves: none, or each killed by its own PID. Before a piece's closing record is committed, the custodian runs the closing checklist and kills any shell still running for the piece.

Procedure: scripts/plan/README.md, heading "wait-loops-and-background-shells" (to be added; RULED 2026-10-29).
