---
id: halt-switch-stop-and-hold
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:89 @ 6b67d44 sha256:4a43bdd96b1346c5a619bc0c5e10592940fe2e8769cb0a9398726b03dcf37c72", "governance/AUTONOMY.md:296 @ 6b67d44 sha256:8e7515506fa8905346684617eb392380bc0a9fe3be0612f6fd4e55cf03fedfea", "Appendix A2, item 18"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/hooks/stop-queue.mjs]
---

# halt-switch-stop-and-hold

*Paraphrase, not the human's words: the binding text is at the source.*

If state/CUSTODIAN-HALT exists, locally or on origin/main, the custodian stops and holds: it flushes and ledgers, dispatches nothing new, tells running workers to end at their next checkpoint and raises no question. The file's first line is the reason. Only the human removes it.

The hook only allows the stops; the hold is the custodian's.
