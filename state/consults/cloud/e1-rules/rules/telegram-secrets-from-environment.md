---
id: telegram-secrets-from-environment
status: active
applies_to: [custodian, reviewer, worker, worker-high]
when: [build, gate-reviewer]
paths: ["scripts/hooks/telegram.mjs", "scripts/hooks/notify-telegram.mjs", "scripts/hooks/questions-mirror.mjs"]
source: ["governance/AUTONOMY.md:276 @ 6b67d44 sha256:ce826273716018d0f249bc9432bde96f776da85e61058fe05bc54ada3cc8dd28", "governance/AUTONOMY.md:280-285 @ 6b67d44 sha256:51f9a2581378297f489443755438cc76c1d32c6b0a1c7d995d9c515822b7c428", "Appendix A2, item 16"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# telegram-secrets-from-environment

*Paraphrase, not the human's words: the binding text is at the source.*

Telegram code uses Node's https only. The bot token and chat id come from CUSTODIAN_TELEGRAM_BOT_TOKEN and CUSTODIAN_TELEGRAM_CHAT_ID, environment variables only: never in the tree, never logged; unset means no-op.

One message per blocking event (a ten-minute dedupe under .claude/state/). A round file over 4096 characters goes as one document with a short summary above it, never split into several messages.
