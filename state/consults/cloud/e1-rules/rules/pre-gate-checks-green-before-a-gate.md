---
id: pre-gate-checks-green-before-a-gate
status: active
applies_to: [custodian, architect, reviewer]
when: [gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:168-174 @ 6b67d44 sha256:14e8cb4003d2661b50a3c5139e32dc171b8335a39d65f8ae0d9287b08bc69af9", "Appendix A3, speed work (1)"]
supersedes: []
superseded_by: []
assumes: ["file-exists: .github/workflows/governance-ci.yml"]
enforced_by: [none]
---

# pre-gate-checks-green-before-a-gate

*Paraphrase, not the human's words: the binding text is at the source.*

A piece whose pre-gate self-checks (the mechanical checks governance-ci runs) are red is not sent to a gate; it is fixed first. A gate assumes them green and spends its attention on semantics: design, guarantees, vocabulary, scope. This holds under both gate shapes.
