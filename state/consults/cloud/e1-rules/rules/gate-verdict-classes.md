---
id: gate-verdict-classes
status: active
applies_to: [custodian, architect, reviewer]
when: [gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:389 @ 6b67d44 sha256:8a36edc32e678f5c491f84c6c7b6d1cbc5c1b97bf8e86300ffb7a9180196a4c3", "state/directives/2026-10-05-product-first-direction.md, section 2"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# gate-verdict-classes

*Paraphrase, not the human's words: the binding text is at the source.*

A gate report carries three verdicts, Correctness, Evidence and Documentation, each with severity, scope and disposition. Only a Correctness or Evidence FAIL blocks. Documentation and record findings cause no correction round and no re-gate: they are fixed in the same PR before the merge, the custodian checks each fix against its finding, and the closing record lists them.

Never documentation-only: an unsupported claim of a guarantee, limit or measurement; a quote of the human's words marked verbatim that does not match its source; any red-line text. The record cap stays.
