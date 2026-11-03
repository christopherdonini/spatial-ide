---
id: publish-test-failure-log-first
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:628 @ 6b67d44 sha256:4fe1c456d5efc15acbd63afc587447293b13d7b4530e33f4824490926d41695e", "governance/AUTONOMY.md:631 @ 6b67d44 sha256:854576a08ae62fe292067b6b6952e711eb87fa8d82daaa1cc9f67002ff0134ae", "round 51, item 3"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# publish-test-failure-log-first

*Paraphrase, not the human's words: the binding text is at the source.*

On the publish test's next failure, the failing job log is filed verbatim before any re-run.

Schema gap: a one-shot duty ("next failure"); nothing in the schema expires it.
