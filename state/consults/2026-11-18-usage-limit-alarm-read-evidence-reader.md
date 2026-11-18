# The usage-limit alarm of 2026-11-16, read from the records (ADV-2026-11-18-02 item 5): the evidence reader's report, attempt 2

*Filed byte for byte by the custodian from the subagent transcript, the SubagentHandback input of 2026-11-18T09:11:14.224Z: 7963 bytes, sha256 5f5b5a8f7906f34ca47f9016f83c77c60a2f9fe7d453946be0ca955479ed90e6, with one final newline added; ten Read calls and no other. Read only; nothing was changed. Attempt 1 stopped at its turn limit after its brief gave it a wrong window of lines, and its partial report is not filed; attempt 2 read an excerpt the custodian copied by script, byte for byte, from the transcripts. It is evidence, not Authority.*

---

Alarm read: usage limit of 2026-11-16, evidence-reader, attempt 2

Status: complete. All eight reads in the brief were made (A in two calls, because the first returned a partial view of lines 1 to 26). No write, edit or command was run. Redactions: the account-page URL and every reset time (the message text, `resetsAt` values) are shown as [redacted]. No spend figure appears in any record I read.

**1. What the harness recorded at the limit**

Limit records in the excerpt (A). Each has `apiError":"usage_limit_reached"`, `error":"rate_limit"`, `apiErrorStatus":429`, `isApiErrorMessage":true`. No record carries a `subtype` field: not found.

- Session transcript line 354186, 2026-11-16T09:03:26.856Z, `type":"assistant"`, `model":"<synthetic>"`, `perTurnEffort":"xhigh"`, `requestId":"req_011Ch6LXteB9M4A2RyDpBdGm"`.
- Session transcript line 354194, 2026-11-16T09:04:24.844Z, `type":"assistant"`, `perTurnEffort":"xhigh"`, `requestId":"req_011Ch6LcA1FkuRy4Jy5hZMXa"`.
- Session transcript line 354221, 2026-11-16T09:12:59.578Z, `type":"assistant"`, `perTurnEffort":"xhigh"`, `requestId":"req_011Ch6MG6xG8JcKJCN2ninkR"`.
- agent-a093584a9ffb37184.jsonl line 31, 2026-11-16T09:03:22.221Z, `isSidechain":true`, `type":"assistant"`, `perTurnEffort":"high"`, `requestId":"req_011Ch6LXXzhJtQR9aF1LKzfg"`. This is the earliest limit record in the excerpt.
- agent-a2ff6a3a2a8153413.jsonl line 228, 2026-11-16T09:04:26.153Z, `isSidechain":true`, `type":"assistant"`, `perTurnEffort":"high"`, `requestId":"req_011Ch6LcGNk2wUBHC6kCc1pJ"`.
- agent-a367b50b28c7a3f0f.jsonl line 647, 2026-11-16T09:07:17.162Z, `isSidechain":true`, `type":"assistant"`, `perTurnEffort":"high"`, `requestId":"req_011Ch6LpsThkDTzUvmieYWcU"`.

`quotaLimits` (identical in every record above; the excerpt has the same object in `apiErrorParams.rate_limit_info`): `status":"rejected"`, `resetsAt":[redacted]`, `unifiedRateLimitFallbackAvailable":false`, `rateLimitType":"seven_day"`, `overageStatus":"rejected"`, `overageDisabledReason":"org_level_disabled_until"`, `upgradePaths":["overage"]`, `isUsingOverage":false.

Limit message text (the `content` of each assistant record, identical in all six): "You've hit your monthly spend limit · raise it at [account link redacted] · your weekly limit resets [reset time redacted]".

Other limit-bearing lines:
- Queue and task-notification records for the failed agents: session lines 354180 (queue-operation, 09:03:22.277Z), 354188 (user, 09:03:28.348Z), 354198 (queue-operation, 09:04:26.165Z), 354200 (user, 09:04:26.322Z), 354204 (queue-operation, 09:07:17.172Z), 354206 (user, 09:07:17.332Z). Each `<summary>` reads "Agent terminated early due to an API error: You've hit your monthly spend limit … (error type rate_limit, HTTP 429, request id …, model sent to the API: claude-opus-5-5)". These carry no `quotaLimits` or `apiError` field. The text is in a `<summary>` element; `task-notification` is not a hook.
- Session line 354575 (2026-11-18T08:37:54.110Z, `type":"user"`, a tool_result). This is a grep output, not a limit record. Its text includes "You've hit your weekly limit · resets [reset time redacted] (Europe/Rome)" and the message lines above. It has no `quotaLimits` field.

Missing from the records: `subtype`, `notification_type`, and any `quota_auto_resume_*` value on any limit record.

**2. Whether any notification fired around the stop**

- No Notification hook run is recorded among the excerpted lines. No `notification_type` string appears in any excerpted line (A).
- Hook attachments that do appear, neither of them a Notification hook: session line 353989 (2026-11-16T09:00:23.899Z, `hook_additional_context`, `hookName":"tool.call"`, `hookEvent":"PostToolUse"`); session line 354109 (2026-11-16T09:03:02.618Z, `hook_success`, `hookEvent":"SessionStart"`, command `session-resume.mjs`).
- "PushNotification" appears in session line 354087 (2026-11-16T09:03:03.173Z, `compact_boundary`) only as a tool name in `preCompactDiscoveredTools`.
- Dedupe record (C, `.claude/state/telegram-sent.json`, lines 2 to 25). It has no key beginning `notification:quota_` or any quota type. Its two `notification:` keys are:
  - line 2: `"notification:permission_prompt:Claude needs your permission": 1794652364473`
  - line 3: `"notification:idle_prompt:Claude is waiting for your input": 1794707797564`
  Those values are epoch milliseconds as written. My arithmetic (not checked with a tool) gives 2026-11-14T10:32:44.473Z and 2026-11-15T01:56:37.564Z. Both are before the stop. The other 23 keys are `waiting:<hash>` keys with values 1789340772273 to 1793452529689.
- Code reading (not a record): telegram.mjs writes the dedupe key before the send (lines 262 to 264), and a key is written even when no token is set (send returns a no-op, header line 10). So a quota notification that reached `sendTelegramDeduped` would leave a key. The file has none, so per the file the hook did not reach that point, or the file was rewritten, or the state was kept under another project root. The records do not say which.

**3. What the hook would have to match**

- Settings (B), `.claude/settings.json`, line 78: `"Notification": [`. Line 80: `"matcher": "quota_auto_resume_stale|quota_auto_resume_disabled"`. Line 84: `"command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/notify-telegram.mjs\""`, timeout 15.
- Script (D), `scripts/hooks/notify-telegram.mjs`: header lines 12 to 14 say the matcher is those two types and that "This script has no type list of its own: it forwards whatever notification the matcher lets through." Line 33 builds `"<notification_type>: <title/message> (<cwd basename>)"`. Lines 37 to 39 key on `notification:<notification_type>:<first 80 chars of message>` (line 28, `DEDUPE_HEAD_LENGTH = 80`). Line 77 exits 0 when `isCloudSession()`. Lines 70 to 71: a send failure is logged to stderr and does not change the exit code.
- Telegram module (E), lines 1 to 40 and 240 to 270: env names `CUSTODIAN_TELEGRAM_BOT_TOKEN` and `CUSTODIAN_TELEGRAM_CHAT_ID` (names only; no values read); dedupe window `DEDUPE_WINDOW_MS` = 10 minutes (line 36); the key is checked at line 259 and written at line 264.
- Documentation as quoted in the project's own AUTONOMY.md (F), Appendix B, line 449 (not the official docs; not verified against them): matcher values are "`permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`, `elicitation_url_dialog`, `elicitation_complete`, `elicitation_response`, `agent_needs_input`, `agent_completed`, `quota_auto_resume_fired`, `quota_auto_resume_stale`, `quota_auto_resume_disabled`". Line 453: a matcher with only letters, digits, `_`, `-`, spaces, `,` and `|` is an exact string or list; anything else is a regex.
- Policy text (F), §38 item (iv), line 732: the matcher "names the two quota notification types and no other type." `quota_auto_resume_fired` is in the documented list but not in the matcher.

**Missing**

- Whether Claude Code emitted any `quota_auto_resume_*` Notification on the 429 stop: no excerpted record shows one, and no limit record carries a `notification_type`.
- Whether the Notification hook was run at all (no hook log or hook-run record in the excerpt).
- Whether the hook's environment (token, chat id, `CLAUDE_PROJECT_DIR`) was set; the records do not say.
- Whether `isCloudSession()` (cloud.mjs, not read) was true.
- The full session transcript after 09:13Z on 2026-11-16: the excerpt has no records from 09:13Z to 08:00Z on 2026-11-18 other than the listed lines.
- Lines of `telegram.mjs` between 40 and 240, and `cloud.mjs`, were not read.
- The custodian's note said the excerpt is 32 lines; the file shows 32 numbered lines plus an empty line 33. No line content was lost.
- The excerpt's 2026-11-18 lines (354575 only) are consistent with the custodian's locating note. The 2026-11-16 lines are consistent with it too; no contradiction found.

**Model (as the harness reports it):** claude-haiku-5-5 (Haiku 5.5).
