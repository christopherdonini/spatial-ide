---
id: single-gate-route
status: active
applies_to: [custodian, reviewer]
when: [draft, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:336-345 @ 6b67d44 sha256:72379b95047a81926ee35b3bdb2d10e27d27c43e97a7c61e9a45af9e191f994e", "round 5, item 2"]
supersedes: []
superseded_by: []
assumes: ["agent-exists: reviewer"]
enforced_by: [none]
---

# single-gate-route

*Paraphrase, not the human's words: the binding text is at the source.*

Only docs, tests and polish that touch no full-gating category and stay under size-threshold take the single gate: one reviewer covers the code review and a light constitution check (cites, ADR-018 vocabulary, red-line scan), no architect gate opens, and the piece carries the five-line form.

A full-gating category found mid-piece closes the route: the piece stops and re-enters full gating. A size overrun found mid-piece closes it too, but the five-line form stays and the overrun is a class 6 amendment; a full form is never written after the code.
