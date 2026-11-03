---
id: search-excluded-locations-explicitly
status: active
applies_to: [custodian, architect, reviewer, worker, worker-high, tester, tester-high, lead-data]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:557-561 @ 6b67d44 sha256:84276cbbb6da4446eab6ca1b44d0c3976b4fb56664505cb2ae00b99cf3923f29"]
supersedes: []
superseded_by: []
assumes: ["file-exists: .ignore"]
enforced_by: [none]
---

# search-excluded-locations-explicitly

*Paraphrase, not the human's words: the binding text is at the source.*

A tree-wide search excludes the historical paths in the root .ignore; a tree-wide rg from Bash also skips hidden folders, the Grep tool does not. Before concluding that a ruling, precedent, review or design does not exist, search those locations by name: give Grep that folder or file as its path, run rg --no-ignore with it as the path, or Read the file; Glob still lists them. Active work keeps direct references to its own drafts and gate reports.
