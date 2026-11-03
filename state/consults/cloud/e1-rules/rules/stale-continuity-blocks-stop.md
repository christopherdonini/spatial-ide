---
id: stale-continuity-blocks-stop
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:526 @ 6b67d44 sha256:5d786f0fc845702d944898d330316a59c6afcab88ccb0fc71d03a8f187210731", "round 33, items 4 and 5"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/hooks/flush.mjs"]
enforced_by: [scripts/hooks/stop-queue.mjs]
---

# stale-continuity-blocks-stop

*Paraphrase, not the human's words: the binding text is at the source.*

When the Stop hook blocks on a stale continuity block (the newest commit touching state/CUT-STATE.md left flushed_at as its parent had it), the custodian rewrites the block with scripts/hooks/flush.mjs from git and the ledger, commits it ledger-only, pushes, then stops.
