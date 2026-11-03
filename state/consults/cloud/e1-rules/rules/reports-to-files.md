---
id: reports-to-files
status: active
applies_to: [custodian, architect, reviewer, worker, worker-high, tester, tester-high]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:620 @ 6b67d44 sha256:6e874eea9dd86d5f8b7b1e82b66e68688da67cf6f8550a21d87d554a607929bf", "governance/AUTONOMY.md:631 @ 6b67d44 sha256:854576a08ae62fe292067b6b6952e711eb87fa8d82daaa1cc9f67002ff0134ae", "state/directives/2026-10-03-reports-to-files-two-pieces-trial.md:8-11 @ 6b67d44 sha256:98f86f7d767411fd2f7bce9de966cd0bedc8a19b14ce6e86842fa8f93dbae5f4"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# reports-to-files

*Paraphrase, not the human's words: the binding text is at the source.*

Every subagent writes its full report to the file path its brief gives and returns only its verdict, its blocking findings one line each, the path and the file's sha256. The custodian commits the file as written with its filing note above it and reads only what it needs to act on.
