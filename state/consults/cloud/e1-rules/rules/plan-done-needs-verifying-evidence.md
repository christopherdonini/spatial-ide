---
id: plan-done-needs-verifying-evidence
status: active
applies_to: [custodian]
when: [always]
paths: ["governance/PLAN.yaml"]
source: ["governance/AUTONOMY.md:58 @ 6b67d44 sha256:a7030d253f4b9ea520cc97e016e75ebc1cd975ae273187f750b8e7d42b48e1cf", "governance/AUTONOMY.md:65 @ 6b67d44 sha256:7fa675d1ef4530d999e3d11db08d772062cb17847ed09da8235025cfac37c879", "governance/AUTONOMY.md:135 @ 6b67d44 sha256:edc6ec0749befa6c8b33c2cfdfe2c69ae6a2548c918633adad929f96e1d2fb19"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/plan/verify.mjs, scripts/plan/site.mjs]
---

# plan-done-needs-verifying-evidence

*Paraphrase, not the human's words: the binding text is at the source.*

A node is done only with an evidence pointer that verifies: a merged PR, an ADR file whose Status line reads Accepted, a tag, a release, a commit on main, a tracked path, or a log once it is archived. A pointer into an untracked directory does not verify.

A felt_verdict node also needs verdict: {by: human, cite: "DECISIONS-PENDING.md RULED <date>"} whose RULED block exists. No checkmark is rendered without a verifying pointer.
