# scripts/hooks — the custodian's Claude Code hooks

Built from `AUTONOMY.md` Appendix B ("Claude Code 2.1.270 hook facts, verbatim from the installed
version's documentation") and, for the Notification hook added by the human's second directive
(item 16), from the saved reference the coordinator pointed at (`hooks.md`, fetched alongside
Appendix B on 2026-09-13, sections `### Notification` and `#### Notification input`). Every field
each hook reads from stdin is quoted below from one of those two sources — nothing here is built
from memory. Node's standard library only.

**Every hook catches its own errors and allows/no-ops rather than throwing to the shell**, per the
piece's own rule: "handles a missing plan file (allow)" generalized to "never blocks Claude Code's
own lifecycle on this tooling's own bugs."

**In a cloud session every hook here is inert** (RULED 2026-09-25, the cloud hooks, item (1);
`HOOKS-CLOUD-INERT-PREREGISTRATION.md`): each script exits 0 at its entry point, before reading
stdin and with no output, when `CLAUDE_CODE_REMOTE` is exactly `true` — the marker the
cloud-environments documentation names, quoted in `cloud.mjs`. The hooks are the custodian's; a
cloud worker gets no continuity block, no Stop-hook continuation, no flush demand and no Telegram
attempt. The variable was checked unset in the custodian's local Remote Control session (Claude
Code 2.1.282, 2026-09-25). `cloud.test.mjs` dry-runs every command in `.claude/settings.json` with
the marker set, and each hook with and without it.

## Stop — `stop-queue.mjs`

**Contract, quoted (Appendix B):**

> "In addition to the common input fields, Stop hooks receive `stop_hook_active`,
> `last_assistant_message`, `background_tasks`, and `session_crons`. The `stop_hook_active` field
> is `true` when Claude Code is already continuing as a result of a stop hook. Check this value or
> process the transcript to avoid blocking on a condition that will never resolve. Claude Code
> overrides the hook and ends the turn after 8 consecutive blocks." — "The `background_tasks` and
> `session_crons` arrays let hooks distinguish 'session is done' from 'session is paused waiting
> for background work to wake it back up'."

> "`decision` — `"block"` prevents Claude from stopping. Omit to allow Claude to stop";
> "`reason` — Required when `decision` is `"block"`. Tells Claude why it should continue."

> "Command hooks run under Git Bash on Windows (shell form)... `timeout`... Seconds before
> canceling... Defaults: 600 for `command`..." — this hook is given `timeout: 20` explicitly in
> `.claude/settings.json`.

Fields actually read: `session_id`, `cwd`, `background_tasks`. (`stop_hook_active`,
`last_assistant_message`, `session_crons` are part of the verified contract but this hook's own
decision, per AUTONOMY.md §3, does not key off them — "`stop_hook_active: true` is not by itself a
reason to allow — that is what a continuation looks like; the caps and the progress test are the
loop protection.")

**Decision order** (AUTONOMY.md §3, with §18's HALT switch as step 2 — the human's second
directive):

1. `background_tasks` non-empty → allow.
2. `CUSTODIAN_STOP_HOOK=off` (environment) → allow. Or `state/CUSTODIAN-HALT` exists, locally or
   on `origin/main` (`git fetch --quiet origin main` with a 5-second timeout; a fetch failure
   means "unknown", not halt) → allow, stderr `HALT: <the file's first line>`. This replaces the
   old `.claude/state/stop-hook.pause` file override. The `origin/main` probe result (only when it
   actually completed — never a fetch failure) is cached in `.claude/state/halt-probe-cache.json`
   for 60 seconds (`HALT_CACHE_TTL_MS`, reviewer finding 17), so a stop that keeps recurring
   within a minute does not re-fetch every time; the local-file check is always live.
3. Derive the ready set live from `PLAN.yaml` (never the committed queue file).
4. Ready set empty, or only human-blocked nodes remain → allow, stderr names the waiting-on-human
   count; sends one Telegram message listing the waiting items (id, kind, minutes, total), deduped
   on a hash of the waiting set (item 16b).
5. Continuation accounting: `.claude/state/stop-hook-<session_id>.json` and
   `.claude/state/stop-hook-daily-<YYYY-MM-DD>.json` (gitignored). Consecutive resets to 0 on
   progress (HEAD or the plan hash changed since the last block). Session cap `6` (declared
   `SESSION_CONSECUTIVE_CAP` — under Claude Code's own 8-consecutive-block override quoted above;
   `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` is never touched here). Daily cap `40` (declared
   `DAILY_CONTINUATION_CAP`, §3: "daily cap `DAILY_CONTINUATION_CAP` = 40 across sessions"). At
   either cap → allow.
6. Otherwise → block, with the exact reason text AUTONOMY.md §3 specifies, reordered
   `smallFirst` and spike/measurement-lane-deferred past 75% of the daily cap (declared
   `NEAR_DAILY_CAP_RATIO`, §10).

Never sends `reason` on an allow — only `Stop`'s documented `decision: "block"` path takes one; an
allow prints its explanation to stderr only (goes to the debug log, matching "Exit code 0... Claude
Code writes stdout to the debug log and doesn't show it in the transcript" — the exceptions listed
there do not include `Stop`).

## PreCompact — `precompact-flush.mjs`

**Contract, quoted (Appendix B):** `"Runs before Claude Code is about to run a compact
operation."` Matchers: `"manual — /compact; auto — Auto-compact when the conversation reaches the
auto-compact window"`. `"Exit with code 2 to block compaction. For a manual /compact, the stderr
message is shown to the user. You can also block by returning JSON with 'decision': 'block'."`
`"Blocking automatic compaction has different effects depending on when it fires. If compaction
was triggered proactively before the context limit, Claude Code skips it and the conversation
continues uncompacted. If compaction was triggered to recover from a context-limit error already
returned by the API, the underlying error surfaces and the current request fails."` Input:
`"PreCompact hooks receive trigger and custom_instructions."`

This hook blocks via **exit code 2** (stderr shown for manual `/compact`; no documented JSON
`"reason"` field for PreCompact, unlike Stop — only `"decision": "block"` is documented for it), not
via a `reason` field on stdout.

**Fresh** (AUTONOMY.md §7; tightened 2026-09-15 on the human's word): `state/CUT-STATE.md`'s
`## SESSION-CONTINUITY` block carries `flushed_at` within the last **10 minutes** (declared
`FLUSH_FRESHNESS_MS`) **and** `flushed_at` **at or after the last ledger change** below the flush
commit (`git log -1 --format=%cI HEAD~1 -- state/CUT-STATE.md`; skipped when it cannot be read —
no prior ledger history or a shallow clone — since an unknown last-change is not grounds to block:
"hash equality alone is not freshness") **and** `tip` equal to the current `HEAD` (or to `HEAD`'s
parent when `HEAD` is a ledger-only flush commit — the one commit that cannot cite its own hash)
**and** `git status --porcelain` shows no modified tracked file **and** `HEAD` is pushed
(`git rev-parse @{u}` resolves, **and** `HEAD` is reachable from it —
`git merge-base --is-ancestor HEAD @{u}`, not literal equality: the upstream ref can be further
ahead from someone else's later push while `HEAD` is still, itself, pushed — reviewer finding 7).
Fresh → allow. Stale → block once,
recording `.claude/state/precompact-<session_id>.json`; a second `PreCompact` within 15 minutes
(declared `SECOND_CHANCE_WINDOW_MS`) of that record is allowed whatever the freshness, "so a
context-limit recovery is never blocked twice."

**Ledger path (human's second directive, item 17):** reads `state/CUT-STATE.md` — the ledger
relocated there on `main` (`a40ccfe`/`252585b`); nothing here reads the old root-level path.

## SessionStart — `session-resume.mjs`

**Contract, quoted (Appendix B / guide):** `"Claude Code adds stdout it treats as plain text to
Claude's context"` for `SessionStart`. `"Since plain stdout already reaches Claude for this event,
a hook that only loads context can print to stdout directly without building JSON."` Guide: `"Use
a SessionStart hook with a compact matcher to re-inject critical context after every compaction."`
This is the documented re-injection path this hook uses, for both the `compact` and `resume`
matchers (the latter so a `--resume`/`/resume` session gets the same reading order, per AUTONOMY.md
§0's own framing: "Reading order after a compaction **or a new session**").

Prints §0's reading order, then `state/CUT-STATE.md`'s `## SESSION-CONTINUITY` block **verbatim**
(heading through the next `#`-heading or end of file) — nothing summarized or reformatted. Never
throws: a missing or unparseable `state/CUT-STATE.md` still prints the reading order, with a note
in place of the block.

## Notification — `notify-telegram.mjs`

**Contract, quoted (the saved reference, `hooks.md`, section `#### Notification input`):**

> "In addition to the common input fields, Notification hooks receive `message` with the
> notification text, an optional `title`, and `notification_type` indicating which type fired."

**Fields read:** `message`, `title` (optional), `notification_type`, `cwd`.

**Decision control, quoted:** the exit-code table's own row for this event reads `"Notification |
No | Exit code and stderr are ignored"` — so this hook always exits 0 and decides nothing; its only
effect is the side effect of forwarding the notification to Telegram (`telegram.mjs`'s
`sendTelegram`). The reference's own words: `"Notification hooks can't block or modify
notifications... Notification hooks are intended for side effects such as forwarding the
notification to an external service."`

**Matcher** (`.claude/settings.json`): `permission_prompt|idle_prompt|agent_needs_input|
quota_auto_resume_stale|quota_auto_resume_disabled` — the five notification types where Claude is
blocked on the human (human's second directive, item 16a). All five names are letters/digits/`_`
only, so this stays on the matcher spec's *exact-string-list* path (`|`-separated), not the
regular-expression path — confirmed against the matcher-patterns table's own charset rule
(letters, digits, `_`, `-`, spaces, `,`, `|` → exact-match list).

**Message text:** `"<notification type>: <title/message> (<cwd basename>)"` — `buildMessage()` in
`notify-telegram.mjs`. Sent via `sendTelegramDeduped` (not the bare `sendTelegram`), keyed on
`notification_type` plus the message's own first 80 characters (`dedupeKey()`) — reviewer finding
5: §16's "one message per blocking event" applies here exactly as it does to the Stop hook's own
waiting-items notice below, on the same ten-minute window.

## `telegram.mjs` — the send primitive (human's second directive, item 16)

`sendTelegram(text)`: `POST https://api.telegram.org/bot<TOKEN>/sendMessage`, JSON body `{chat_id,
text}` (truncated to 4096 chars), via Node's `https` module only. Token:
`CUSTODIAN_TELEGRAM_BOT_TOKEN`. Chat id: `CUSTODIAN_TELEGRAM_CHAT_ID`. **Both environment-only —
never read from any file, never logged.** Either unset → no-op, one stderr line. 8-second timeout.
**A failure never changes a hook's decision** — every caller in this directory awaits the promise
but never lets its rejection (there isn't one; it always resolves) or its result change what the
hook returns. `CUSTODIAN_TELEGRAM_DRY_RUN=1` writes the would-be message to stderr instead of
sending, for tests (`hooks.test.mjs` sets this for every test in the file, and additionally clears
the token/chat-id env vars, so no test can ever perform real network I/O regardless of the
developer's own environment).

`sendTelegramDeduped(key, text, opts)`: "one message per blocking event" — suppresses a repeat send
for the same `key` within a 10-minute window (declared `DEDUPE_WINDOW_MS`), recorded in
`.claude/state/telegram-sent.json`.

`sendDocument(filePath, caption)`: `POST https://api.telegram.org/bot<TOKEN>/sendDocument` as
`multipart/form-data`, the body built by hand (`buildMultipartBody`, exported for testing) with the
same `https` module — **no dependency**. Same environment, same 8-second timeout, and the **same
result shape** as `sendTelegram`. **No `parse_mode` on either send** (plain text; markdown escaping
would break copy-paste of the verbatim question text — the human's 2026-09-14 directive).

## Question round mirror — `questions-mirror.mjs`

**Obligation (the human, 2026-09-14, AUTONOMY.md Appendix A3):** every question round gets a
Telegram mirror. **Before the first `AskUserQuestion` of a round**, the custodian writes the full
round — every question set, verbatim: item number, red-line marker, the digest text, the numbered
options with their descriptions — to `state/questions/round-<n>.md` (a **tracked** record; only the
`.gitkeep` marker ships empty), then runs:

```
node scripts/hooks/questions-mirror.mjs state/questions/round-<n>.md
```

**Telegram is read-and-copy only — never an answer channel.** `AskUserQuestion` stays the answer
channel; Telegram exists so the round is copy-paste-ready on the phone. The mirror never reads
Telegram for answers.

**Format (plain text, no markdown — escaping breaks copy-paste):** each item is separated from the
next by a blank line and a `---` rule so it forwards cleanly, and **item order in the file = the
order the prompts will ask**.

**The 4096 fallback:** the boundary is measured on the message text as `[...text].length` (Unicode
code points, matching Telegram's own "characters" limit). `≤ 4096` → one plain-text `sendMessage`
of the file contents. `> 4096` → a short summary message
(`Question round <n> — <k> items; full text attached (copy-paste ready)`) **then** `sendDocument`
of the round file with that same summary as the caption. The CLI exits `0` on success and `1` (with
a stderr line) on a missing file, missing token/chat-id env, or an API error. The pure-ish core
`mirrorRound({ file, sendMessage, sendDocument, readFile })` takes its dependencies injected, so
tests drive it with fakes and never touch the network.

## State directory

All of the above keep their own state under `<project root>/.claude/state/` (gitignored —
`.gitignore` gained a `.claude/state/` entry for this piece): `stop-hook-<session_id>.json`,
`stop-hook-daily-<date>.json`, `precompact-<session_id>.json`, `telegram-sent.json`. Project root
is resolved as `CLAUDE_PROJECT_DIR` (the environment variable `.claude/settings.json` already
uses to locate each script) when set, falling back to the hook's own `cwd` input field, then
`process.cwd()`.

## Not in the docs (so not relied on), quoted (Appendix B)

> "Whether a PreCompact block's `reason` reaches Claude on an automatic compaction; SubagentStop's
> exact contract; hook behaviour under `--resume` beyond the `resume` matcher."

Nothing in this directory depends on any of the three.

## Tests

`hooks.test.mjs` covers all four hooks plus `telegram.mjs`, both as direct unit tests of the
exported decision functions (`decide`, `checkHalt`, `decidePrecompact`, `checkFreshness`,
`buildOutput`, `buildMessage`) and, for `stop-queue.mjs` and `precompact-flush.mjs`, as literal
`spawnSync` CLI invocations piping representative stdin JSON — the dry run of §3 in script form:
block on the two-node fixture's ready node; allow when only its human-blocked node remains; allow
on non-empty `background_tasks`; allow via the environment override; allow on a local
`state/CUSTODIAN-HALT` file (its first line surfaced on stderr); allow at the session and daily
continuation caps. `checkFreshness`'s own git calls are injectable (`{ git: (args) => ... }`) so the
"fresh" branch can be tested deterministically — a real git commit's tracked content cannot state
that same commit's own resulting hash (the hash is computed from the content), so the achievable,
literal test of "fresh" uses an injected git rather than a self-referencing commit.
