# What Claude Code's public documentation says about a session's own timed wake (CronCreate, CronList, CronDelete, RemoteTrigger, ScheduleWakeup), for the form of `advisor-silence-two-hour-alarm`: a documentation agent's report, read only

*Filed by the custodian by script from the documentation agent's transcript: its hand-back, 14821 bytes, sha256 fb1e674b7d04a1b105d90926e15c8ded04f02c9baa784bbd5ec35dee073f95c1; the run 2026-11-15T00:02:00Z to 2026-11-15T00:04:13Z, 23 tool calls (21 WebFetch, 1 WebSearch, the hand-back), no write, no command, model claude-haiku-5-5. Its brief was a file in the custodian's scratch folder, 2556 bytes, sha256 3485330280ae5c4e0db5e2f1a60bacfcb631e24a8d023ea5cc3612980ea219f1: pages under code.claude.com/docs only, quotations byte-copied from what it fetched, gaps marked, nothing from memory. It read public pages only and loaded none of the scheduling tools (ADV-2026-11-15-01 item 6; ADV-2026-11-14-24 item 4 (d) and (e), `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-24-the-notifications-forms-eight-open-items-answered-halt-line-alone-literal-command-section-38-text-follow-up-node-budget-180.md`). Its own caveats, kept below as it wrote them: the fetch tool returns a model-extracted rendering of a page, not its raw bytes, so its quotations are of that text; it records no fetch time; some pages were read in part. It is the fact source of the architect's draft of the node's form (ADV-2026-11-14-24 item 4 (d)). Nothing is changed. The text below the rule is the report.*

---

Wake docs: five tools, Claude Code 2.1.314, read from code.claude.com

Caveats first:
- Times: I could not record a clock time for any fetch. The brief forbids running commands, and no clock is available otherwise. Date of reading: 2026-11-15.
- Quotations: WebFetch returns a model-extracted rendering, not raw bytes. Quotes below are copied from that returned text. I could not confirm byte-exactness against the raw pages. Quotes are marked with their URL. Anything else is my paraphrase.
- Several pages were too large to read in full. Where a point sits in an unread part, I say "Not found on the pages read".
- Version: the docs and changelog list features newer than 2.1.314 (2.1.317, 2.1.319, 2.1.325). Those are marked below.

URLs fetched (with result):
1. https://code.claude.com/docs/en/claude_code_docs_map.md: fetched, first 100,000 of 204,859 characters only.
2. https://code.claude.com/docs/en/scheduled-tasks: fetched, full page read.
3. https://code.claude.com/docs/en/tools-reference: fetched, output too large to read in full; the RemoteTrigger row came from a partial read (see 4).
4. https://code.claude.com/docs/en/tools-reference.md: fetched in chunks at offsets 6500 (partial preview: RemoteTrigger row), 10000 (partial preview, SendUserFile and neighbours), 20000 and 40000 and 80000 (other sections). The ScheduleWakeup and CronCreate rows were NOT seen.
5. https://code.claude.com/docs/en/hooks-guide: fetched at offset 20000 (matcher table, limitations, Stop hook block cap). Offset 8000 gave the Notification matcher table. The "Get notified when Claude needs input" section was NOT seen.
6. https://code.claude.com/docs/en/hooks-guide.md: fetched at offsets 0 and 8000 and 20000 (see 5).
7. https://code.claude.com/docs/en/routines: fetched, full text not read (offset 0 too large); offset 6000 read the create, trigger, usage and limits sections.
8. https://code.claude.com/docs/en/routines.md: fetched at offset 6000 (as 7).
9. https://code.claude.com/docs/en/changelog: fetched, first 100,000 characters (2.1.325 to 2.1.319) and offset 100000 (2.1.318 to 2.1.304). Later chunks not read.
10. A web search (query on the five tools, restricted to code.claude.com): returned only links and snippets, not fetched page text. I have not quoted any snippet as documentation.

----------------------------------------
CronCreate, CronList, CronDelete
Pages: https://code.claude.com/docs/en/scheduled-tasks (fetched); tool names also listed in the tools-reference table (not seen; see item 4 above).

(a) Same session or new session:
"Session-scoped scheduled tasks let Claude re-run a prompt automatically on an interval within a Claude Code session." (scheduled-tasks)
"Tasks are session-scoped. When you resume with `--resume` or `--continue`, Claude Code restores tasks that haven't [expired]..." (scheduled-tasks)
Cloud alternative: "Cloud [...] Persistent across restarts | Yes" and "Requires open session | No" (scheduled-tasks comparison table). The page says a session-independent option needs "a cloud scheduled task, ... a Desktop scheduled task, or ... GitHub Actions."

(b) Runs while idle with no turn running:
"Tasks only fire while Claude Code is running and idle. Closing the terminal or letting the session exit stops them firing." (scheduled-tasks, Limitations)
"A scheduled prompt fires between your turns, not while Claude is mid-response. If Claude is busy when a task comes due, the prompt waits until the current turn ends." (scheduled-tasks)

(c) Smallest and largest delay or interval:
Smallest: comparison table row "Minimum interval | 1 hour | 1 minute when Claude sets it ... | 1 minute" (scheduled-tasks). Column for /loop reads 1 minute.
"Seconds are rounded up to the nearest minute since cron has one-minute granularity." (scheduled-tasks, under /loop fixed interval)
Largest: "Recurring tasks automatically expire 7 days after creation." (scheduled-tasks, Seven-day expiry)
Count limit: "A session can hold up to 50 scheduled tasks at once." (scheduled-tasks)
Largest single interval, or a maximum delay for a one-shot: Not found on the pages read.
Cron form: "`CronCreate` accepts standard 5-field cron expressions: `minute hour day-of-month month day-of-week`." (scheduled-tasks)

(d) What it needs:
"Set `CLAUDE_CODE_DISABLE_CRON=1` in your environment to disable the scheduler entirely. `CronCreate` and `/loop` become unavailable, and any already-scheduled tasks stop firing." (scheduled-tasks)
The tools are listed as: "`CronCreate` | Schedule a new task. ...", "`CronList` | List scheduled tasks ...", "`CronDelete` | Cancel a task by ID." (scheduled-tasks)
No slash command is required for the tools. Natural-language requests are shown: "remind me at 3pm to push the release branch" (scheduled-tasks).
Account plan, permission, or network service for session-scoped tasks: Not found on the pages read. The page says only "Requires open session | Yes" for /loop (scheduled-tasks table).
Provider note, dynamic intervals only: "On Amazon Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform, and Microsoft Foundry, or with fetching turned off, both require Claude Code v2.1.248 or later." (scheduled-tasks)

(e) Survives session end or restart, and ends on its own:
"When you resume a session with `claude --resume` or `claude --continue`, Claude Code restores the tasks scheduled with `CronCreate`, except recurring tasks that have expired and one-shot tasks whose scheduled time has passed." (scheduled-tasks, Limitations)
"Recurring tasks automatically expire 7 days after creation. The task fires one final time, then deletes itself." (scheduled-tasks)
One-shot: "Claude schedules a single-fire task that deletes itself after running." (scheduled-tasks)
With feature-flag fetching off: "Claude Code stores a task you asked to keep across sessions in the project's `.claude/scheduled_tasks.json` file." (scheduled-tasks)

----------------------------------------
ScheduleWakeup
Pages: https://code.claude.com/docs/en/scheduled-tasks (fetched). Its tools-reference row was not seen (Not found on the pages read).

(a) Same session or new session:
"The `/loop` [bundled skill] is the quickest way to run a prompt on repeat while the session stays open." (scheduled-tasks)
"Claude calls the `ScheduleWakeup` tool with `stop: true`, which cancels the pending wakeup immediately." (scheduled-tasks, under "Stop a loop")
The page does not state explicitly that ScheduleWakeup itself wakes the same session, but the loop is described as running within the open session. Explicit statement: Not found on the pages read.

(b) Runs while idle:
"Tasks only fire while Claude Code is running and idle." (scheduled-tasks Limitations; applies to session tasks)
"In a [background session], a [self-paced loop] stops if its next wakeup comes due while the session's process isn't running, such as after a crash." (scheduled-tasks Limitations)
"Requires open session | Yes" for /loop (scheduled-tasks table).

(c) Smallest and largest delay:
"After each iteration it picks a delay between one minute and one hour based on what it observed" (scheduled-tasks, "Let Claude choose the interval"). This is stated for self-paced /loop; the page does not separately attach the range to the tool name.
Fallback: "If an iteration ends without either rescheduling or stopping, Claude Code schedules one fallback wakeup about 20 minutes later and ends the loop when that iteration doesn't reschedule either." (scheduled-tasks)
Conflict with the changelog (see below): the 2.1.319 entry says the loop now ends in that case "instead of scheduling a fallback wakeup".

(d) Needs:
"`/loop` bundled skill" (scheduled-tasks). The tool is driven by /loop. Dynamic intervals on the four providers named above need Claude Code v2.1.248 or later (scheduled-tasks).
Setting: CLAUDE_CODE_DISABLE_CRON=1 disables CronCreate and /loop (scheduled-tasks). No separate setting for ScheduleWakeup found on the pages read.
Account or network service: Not found on the pages read.

(e) Survives session end or restart, and ends on its own:
"A self-paced `/loop` isn't restored, so run `/loop` again to restart it." (scheduled-tasks, Limitations, on --resume/--continue)
Self-ending: "Claude can also end the loop on its own once the task is complete. Claude calls the `ScheduleWakeup` tool with `stop: true`..." (scheduled-tasks)
"Detach without stopping a loop... A self-paced loop waiting there for its next iteration keeps running" (scheduled-tasks) and "Detaching with `Ctrl+C` without stopping the loop requires Claude Code v2.1.295 or later."

----------------------------------------
RemoteTrigger
Page: https://code.claude.com/docs/en/tools-reference.md (partial read: the row came from a preview of the .md variant at offset 6500).

(a) Wakes the same session, or starts a new one:
Tools-reference row: "Creates, updates, runs, and lists [cloud scheduled tasks], formerly routines, on claude.ai. Backs the `/schedule` command."
Routines page (https://code.claude.com/docs/en/routines): "Each run opens as a full session, a new one for each run." (quoted in the run description: "The run [opens as a full session], a new one for each run, where you can see what Claude did...")
"A GitHub trigger starts a new session automatically when a matching event occurs ... Claude Code doesn't reuse sessions across events" (routines).
So: it starts a new cloud session, not the local one.

(b) Runs while idle:
"Scheduled tasks execute on Anthropic-managed cloud infrastructure, or on your organization's self-hosted environment ... so they keep working when your laptop is closed." (routines)
Comparison table: "Requires machine on | No" and "Requires open session | No" (scheduled-tasks comparison; the cloud column).

(c) Smallest and largest delay:
Smallest: "Minimum interval | 1 hour" (cloud column, scheduled-tasks comparison table).
"Expressions that run more often than once per hour are rejected." (routines, Add a schedule trigger)
Largest interval: Not found on the pages read. One-off: "Schedule a one-off run... runs the task a single time at a specific timestamp" (routines).
Limits: "Scheduled runs, including one-off runs | 100 per hour | Your account" (routines, Usage and limits).

(d) Needs:
Tools-reference row: "Cloud scheduled tasks live on claude.ai and require a Pro, Max, Ultra, Team, or Enterprise plan. This tool is therefore not accessible from Amazon Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform, or Microsoft Foundry."
Routines: "Scheduled tasks are available on Pro, Max, Ultra, Team, and Enterprise plans." (routines)
Slash command: "Create and manage them ... or from the CLI with `/schedule`." (routines)
Setting: "`/schedule` requires a claude.ai subscription login." (routines, Troubleshooting)
Org toggle: "Cloud scheduled tasks are off for your organization ... **Scheduled tasks (Was Routines)** or **Routines** toggle" (routines).
Network service: cloud environment; "The **Default** environment uses **Limited** access with **Allow package managers** checked" (routines).

(e) Survives session end or restart, and ends on its own:
Comparison table: "Persistent across restarts | Yes" (scheduled-tasks).
"Scheduled tasks ... keep working when your laptop is closed." (routines)
One-off: "After the task runs, it turns itself off and the web UI marks it as **Completed**." (routines)
Paused: "Paused tasks keep their configuration but don't run until you turn them back on." (routines)
Recurring end: Not found on the pages read (the routines page does not state a recurring expiry; compare the session-scoped 7-day rule above).

----------------------------------------
Further item 1: can a hook or other documented feature run a command after the session has been idle for a set time?

Hooks, from https://code.claude.com/docs/en/hooks-guide:
Notification matcher values, from the matcher table: "`Notification` | notification type | `permission_prompt`, `idle_prompt`, `auth_success`, ..." The matcher list includes `idle_prompt`. The text describing when idle_prompt fires, and its delay, was not seen: Not found on the pages read.
"`Stop` ... Stop hooks fire whenever Claude finishes responding, not only at task completion. They don't fire on user interrupts." (hooks-guide, Limitations)
"`Notification` | When Claude Code sends a notification" (hooks-guide, event table).
"Command hooks communicate through stdout, stderr, and exit codes only. They can't trigger `/` commands or tool calls." (hooks-guide, Limitations)
Idle timer event: Not found on the pages read. The event table in hooks-guide lists no timer or idle-duration event. The full hooks reference page was not read.
Scheduled-task alternative: "Tasks only fire while Claude Code is running and idle." (scheduled-tasks). This is a prompt schedule, not a hook.

Further item 2: changelog lines that name the five tools or /loop or /schedule (https://code.claude.com/docs/en/changelog). Quotes as returned by WebFetch's extraction:
- 2.1.325 (November 13, 2026): "Changed scheduled tasks and `/loop` to ask before running a skill that declares `allowed-tools` or hooks; add `Skill(name)` to `permissions.allow` to run it unattended"
- 2.1.319 (Added): "Added a note to `/loop` confirmations in cloud sessions that a timer stops with its container, with an offer of a loop that survives"
- 2.1.319 (Changed): "Changed self-paced `/loop` to end when a turn finishes without rescheduling, instead of scheduling a fallback wakeup; set `CLAUDE_CODE_LOOP_KEEPALIVE=1` to keep the old behavior"
- 2.1.317: "Added a warning to `/schedule` when a new cloud scheduled task gets connectors you did not ask for, with how to remove them"
- 2.1.317: "Fixed `/schedule` leaving a cloud scheduled task's next run time and link out of its results after creating or updating it"
- 2.1.317: "Fixed self-paced `/loop` wakeups sometimes not being scheduled when Claude left a field out of its request"
- 2.1.314: the extraction says an entry for 2.1.314 is in the readable chunk, and none of its lines name the five tools. I did not see its text. Quotes from it: Not found on the pages read.
- No changelog line found naming CronCreate, CronList, CronDelete, ScheduleWakeup, or RemoteTrigger in the readable chunks (2.1.325 down to 2.1.304). Chunks beyond 200,000 characters were not read.

Mine, not the docs: the 2.1.319 change (fallback wakeup replaced by ending the loop) came after 2.1.314. On 2.1.314 the older fallback behaviour probably applies. I have not verified this against the changelog for 2.1.314 itself.

Gaps left open:
- ScheduleWakeup's tools-reference row, and CronCreate, CronList, CronDelete rows: not seen.
- The "Get notified when Claude needs input" section of hooks-guide: not seen.
- The idle_prompt timing: not seen.
- The full routines page: partly read.
