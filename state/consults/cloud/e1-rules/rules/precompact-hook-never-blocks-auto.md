---
id: precompact-hook-never-blocks-auto
status: active
applies_to: [architect, reviewer, worker, worker-high]
when: [build, gate-architect, gate-reviewer]
paths: ["scripts/hooks/precompact-flush.mjs", ".claude/settings.json"]
source: ["governance/AUTONOMY.md:182 @ 6b67d44 sha256:ff7bd5a1f0e8b8da854dbe3b9fa0952e3c8f88b2d98903ffa280ffe9596507a8", "governance/AUTONOMY.md:187 @ 6b67d44 sha256:2fde247edf9f787ed438e39ac38cf91f1e3b7152edd5e621df5ae0fcd2827f26"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/hooks/precompact-flush.mjs"]
enforced_by: [scripts/hooks/hooks.test.mjs]
---

# precompact-hook-never-blocks-auto

*Paraphrase, not the human's words: the binding text is at the source.*

The PreCompact hook never blocks an automatic compaction, or any call whose trigger is not manual: it judges, records and lets it through. A manual /compact on a stale flush is blocked once with the flush instruction; a second manual call within 15 minutes is allowed. Each decided call appends one line to .claude/state/precompact-<session_id>.jsonl.

Fresh means: flushed_at within 10 minutes and not before the last ledger change, tip equal to HEAD (or its parent for a ledger-only flush commit), no modified tracked file, HEAD pushed.
