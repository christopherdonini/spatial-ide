---
id: five-line-form
status: active
applies_to: [custodian, reviewer]
when: [draft, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:361-375 @ 6b67d44 sha256:1c5601d4700b34cb1c039b3ddc6325311b5c04420f9356f68b2bd5adda334690"]
supersedes: []
superseded_by: []
assumes: ["file-exists: docs/PREREGISTRATION-TEMPLATE.md"]
enforced_by: [none]
---

# five-line-form

*Paraphrase, not the human's words: the binding text is at the source.*

A single-gate piece commits, before any code, exactly five lines: Authority (node, ruling or directive), Scope (at most 8 files, a line budget of at most 150 non-generated), Change (the observable delta, one sentence), Tests+mutation (the tests and one mutation per new test that fails it by name), Out-of-scope (the full-gating categories it asserts it does not touch).

The reviewer reads Out-of-scope first; a false one is block-on-sight and the piece re-enters full gating. The literal template is AUTONOMY.md §21d.
