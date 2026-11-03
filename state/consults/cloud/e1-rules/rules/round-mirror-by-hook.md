---
id: round-mirror-by-hook
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:506-511 @ 6b67d44 sha256:6ff267a6011238ef0a6dd7b82f15be9dad5e6bdfe1a47e26e1e68bfac78872dd", "round 33, item 3"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/hooks/questions-mirror.mjs"]
enforced_by: [scripts/hooks/questions-mirror.mjs]
---

# round-mirror-by-hook

*Paraphrase, not the human's words: the binding text is at the source.*

In the lease session the PreToolUse hook writes and mirrors the round for every AskUserQuestion call; the custodian writes no round file by hand for a call and runs no mirror CLI before one.

After each call it checks that the new round file exists and reads the last line of .claude/state/round-mirror.jsonl; a missing file or ok: false is mirrored or re-sent by hand with the file-argument CLI, and ledgered. A round answered without a call is filed by hand. Each hook-written file is committed with its RULED record.

This replaces the by-hand obligation of §4 and §16, which no record holds.
