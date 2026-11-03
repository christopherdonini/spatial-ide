---
id: stop-hook-decision-order
status: active
applies_to: [architect, reviewer, worker, worker-high]
when: [build, gate-architect, gate-reviewer]
paths: ["scripts/hooks/stop-queue.mjs", ".claude/settings.json"]
source: ["governance/AUTONOMY.md:84-95 @ 6b67d44 sha256:c970056f50c8e024d257aefd9654822a1ad1be537ce226bda49bbb7789a4e7e6", "governance/AUTONOMY.md:474 @ 6b67d44 sha256:3c2b645897a71aa4548944e783859a72440ce5e8883eacfd509c57964f26e5c6", "governance/AUTONOMY.md:525-526 @ 6b67d44 sha256:0b482ba0897da51979f9f251a257c1abf9309d08d3946f25661ff4c4469b4939"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/hooks/stop-queue.mjs"]
enforced_by: [scripts/hooks/hooks.test.mjs]
---

# stop-hook-decision-order

*Paraphrase, not the human's words: the binding text is at the source.*

The Stop hook decides in this order: (1) CUSTODIAN_STOP_HOOK=off, or state/CUSTODIAN-HALT locally or on origin/main, allows; (2) a session not holding CUSTODIAN-LEASE is allowed, with no human-blocked notice; (3) a stale continuity block blocks, inside the caps; (4) non-empty background_tasks allows; (5) a live ready set from PLAN.yaml that is empty or only human-blocked allows; (6) 6 consecutive blocks per session or 40 per day allows; (7) otherwise it blocks with "next: <id> …", preferring small nodes past 75% of the daily cap.

stop_hook_active alone never allows. CLAUDE_CODE_STOP_HOOK_BLOCK_CAP is not raised.
