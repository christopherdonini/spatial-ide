---
id: full-gating-categories
status: active
applies_to: [custodian, architect, reviewer]
when: [draft, gate-architect, gate-reviewer]
paths: []
source: ["governance/AUTONOMY.md:317-332 @ 6b67d44 sha256:b4deb529fa75eb7de38f1524f39b68faa0f624d7852b5e49b1f8967ea7cffe4c", "Appendix A3, speed work (2)"]
supersedes: []
superseded_by: []
assumes: ["adr-status: ADR-004 Accepted", "adr-status: ADR-006 Accepted", "adr-status: ADR-009 Accepted", "adr-status: ADR-018 Accepted", "adr-status: ADR-020 Accepted", "adr-status: ADR-021 Accepted", "agent-exists: architect", "agent-exists: reviewer"]
enforced_by: [none]
---

# full-gating-categories

*Paraphrase, not the human's words: the binding text is at the source.*

Full gating (the full preregistration, and both reviewer and architect to an affirmative PASS, either block holding the piece) applies when a change touches: an ADR status line or amendment; security posture (what ADR-020, ADR-009 or ADR-021 governs); the data plane or the wire (protocol/skp/**, an SKP message, literal or field, an MCP-adapter surface); a stated guarantee (never-block, ADR-018 cancellation, ADR-006 undo class, ADR-004 copy-minimisation, CRS-is-a-type, a property under test); or when it exceeds size-threshold.
