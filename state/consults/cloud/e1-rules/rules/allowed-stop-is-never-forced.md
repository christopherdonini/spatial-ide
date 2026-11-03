---
id: allowed-stop-is-never-forced
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:97 @ 6b67d44 sha256:08c65dc9f98305492164f6a299152028e3a1e2c57e4d31ab13302ba453c17199"]
supersedes: []
superseded_by: []
assumes: ["file-exists: governance/AI_DEVELOPMENT.md"]
enforced_by: [none]
---

# allowed-stop-is-never-forced

*Paraphrase, not the human's words: the binding text is at the source.*

The Stop hook counts continuations, not tokens. The custodian ends a window on AI_DEVELOPMENT.md's "Token discipline" rules whatever the hook says, and nothing turns an allowed stop into a continuation.
