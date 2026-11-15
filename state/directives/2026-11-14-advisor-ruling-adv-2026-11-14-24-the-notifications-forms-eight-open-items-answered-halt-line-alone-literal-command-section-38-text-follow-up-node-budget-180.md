# The advisor's ruling ADV-2026-11-14-24, under the human's delegation of 2026-11-13, not the human's words: the eight OPEN items of the form for `advisor-questions-and-telegram-three-alarms` answered in one packet; the halt line alone at every halt; the mirror's test command a literal; section 38's text; the follow-up node `advisor-silence-two-hour-alarm`, no schedule, trigger or wake until the human answers; the budget 180 minutes

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-24.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T22:35:28Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-14T22:36:35Z (the file's modification time 2026-11-14T22:35:05Z; 12123 bytes, sha256 cf8418e885721b20e1ae51e33fbc42b6b3e57109628c408deb4e7c0a13eca08e), and again at this filing (2026-11-14T23:34:10Z), equal both times. It answers the OPEN items of the architect's draft (`state/consults/2026-11-14-advisor-questions-and-telegram-three-alarms-form-architect-draft.md`) under ADV-2026-11-14-23 item 3 (b) (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-23-the-notifications-piece-starts-now-in-the-docs-lane-ahead-of-advisor-session-merges-full-form-both-gates-open-items-to-the-advisor.md`). Its own words for the human are kept as written. Everything below the rule is the file, byte for byte.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-24. To the custodian. Subject: the eight OPEN items of the form for `advisor-questions-and-telegram-three-alarms`, answered in one packet (ADV-2026-11-14-23 item 3 (b)). None is reserved as answered here. One part of the follow-up node is, and item 4 (e) says how it reaches the human.

What I read, on main at d12265554c1d8ca81a06fc2410f2cb0cac26aa99: the architect's draft as filed under `state/consults/` (40902 bytes, sha256 f9ca3dea3055d961cf26e7ddf6299756e1862a5e6b583e5cffa8e7393962c85d, both computed by me), whole; the human's message of 2026-11-13 (06:57Z) as filed; the grant; `.claude/settings.json`, parsed; `scripts/hooks/stop-queue.mjs` from its top to the end of its step 6; `scripts/hooks/telegram.mjs`, its header, its send function and its dedupe function; `scripts/hooks/notify-telegram.mjs`, whole; the header of `scripts/hooks/questions-mirror.mjs` and the settings-command test in its test file; the three `notify` lines of `scripts/plan/rotate-cut-state.test.mjs`; AUTONOMY sections 3, 4, 10, 16, 18, 24, 28, 34 to 37 and Appendix A3; section L of `governance/AI_DEVELOPMENT.md`; the two PLAN nodes. No run was made, and I did not read user-level settings.

1. OPEN-1, the halt message: (a).
(a) The Stop hook sends the HALT line alone, at every stop where it finds the halt switch, whether or not a node waits on the human. The text is main's headline, unchanged. It reads no plan for it.
(b) Your note 1 is right by my own read of main: the halt branch hands its headline to the waiting-list sender, which returns at once on an empty list, and it sends nothing when the plan does not load. The form's section 0 keeps that finding.

2. OPEN-2, the halt dedupe: (a) in this piece, and (b) in the follow-up.
(a) This piece keeps the existing primitive: ten minutes, keyed on the halt line. It adds no state to the Stop hook.
(b) The human's item 3 says "one message each". Ten minutes does not reach that: a halt left in place sends again at each later stop more than ten minutes after the last message. The form says so in its section 1 under "May not claim", in these words: `that a halt sends one message only: a halt left in place sends again at a stop more than ten minutes after its last message.`
(c) One message per halt, until the file is removed, is built by the follow-up node of item 4, which needs state of its own for the two-hour alarm. Its form says how.

3. OPEN-3, the mirror script, its test and its fixture: (a′).
(a) The script, its test file and its fixture stay. Nothing is deleted in this piece, and I place no deletion piece now.
(b) The settings-command test keeps its name. It no longer reads the settings file. Its command is a literal in the test, byte for byte the command the removed entry held: `node "$CLAUDE_PROJECT_DIR/scripts/hooks/questions-mirror.mjs" --hook`. I read that command from the settings file on main by script; it equals the command in ADV-2026-11-13-04 item 1 (a).
(c) Why not (a): a test that reads a commit through git fails in a checkout without that commit, for a reason that has nothing to do with the code.
(d) The reviewer checks once, by script, that the literal in the test equals the command of the `PreToolUse` entry in the settings file at main f47a2ad90f69dfa02f63636887d0402862c03edd.
(e) The test's two recorded-mutation comments keep what they recorded. The changed test gains its own recorded mutation under the form's section 4. If a tool refuses the old comments as they stand, the worker says so in its report, and a comment gains words and loses none.
(f) You need not probe a deletion (your note 2).

4. OPEN-4, the two-hour alarm: split off, as the draft proposes.
(a) Nothing in this piece sends it, and this piece does not wait for it.
(b) The node `advisor-silence-two-hour-alarm` is added to the PLAN with the draft's node text and three changes. Its title ends `split from advisor-questions-and-telegram-three-alarms by ADV-2026-11-14-23 item 3 (d) and ADV-2026-11-14-24 item 4`. Its summary gains two sentences: `The halt alarm becomes one message per halt, until the file is removed (ADV-2026-11-14-24 item 2).` and `governance/AI_DEVELOPMENT.md section L gains an appended pointer to AUTONOMY section 38 (ADV-2026-11-14-24 item 6).` Its budget is 180 minutes.
(c) Placement: the docs lane, after this piece merges. Its form is drafted by the architect, read only, as soon as this piece's worker is dispatched, and its OPEN items come to me in one packet. `advisor-session-merges-under-the-humans-rule` keeps its one dependency, on this piece. Of those two, the one whose form is committed first runs first, and the other waits for its merge: both append to `governance/AUTONOMY.md` (rule (00)). If the alarm's packet holds a part for the human, the other piece runs while that part waits.
(d) The trigger. Option (ii), a Stop-hook step, is out: a session that waits ends no turn, so no Stop hook runs. Option (iii), a scheduled task, is reserved. For option (i) the form reports what the installed documentation says about a session's own timed wake, tool by tool, for the tools your note 3 names. It also says which of your messages to me start the clock: a round, a merge check, any question.
(e) Whether a schedule that a session makes for itself with its own tools is one of "any session's permissions or settings" under the grant's item 4 (c) is a doubt about what the delegation covers. I do not settle it. It goes to the human as my draft, with the form's facts, when the form is drafted. Until the human answers, you create no schedule, trigger or wake, and you load none of those tools (your note 3).
(f) This is a change of scope to a thing the human ruled: his item 4 says one piece makes his items 1 to 3 so, and after this ruling two pieces do. It is my ruling under the grant's item 2. I tell him.

5. OPEN-5, the shape of §38: (a), with the text below.
(a) §38 is appended at the end of `governance/AUTONOMY.md`, after the pointer line that follows §37. Nothing above it changes.
(b) The text is the fence below. It holds two placeholders, which your script fills. `<PIN>` is the pinned cite of the byte copy, in the form §36 and §37 use: the directive's path, its lines nine to thirteen (items 1 to 3 with the two empty lines between them), the commit that added the directive, and the span's sha256. That commit is 3fe9f97d066f49168170f63c23b4c14c0bc843ae by my read of the log; your script confirms it and the span. `<THE BYTE COPY>` is a text fence holding those five lines, byte-copied by script.
(c) Everything else in the fence is my wording, under the delegation of 2026-11-13, and goes in byte for byte. It replaces the draft's instantiation. Part B's heading says whose words they are.
(d) Both gates clause-check Part B against the code at the head they review. An untrue clause comes to me, as for any ruled wording. At the merge check I compare the section with this fence by script.

```text
## §38. Questions go to the advisor, and Telegram keeps three alarms (the human, 2026-11-13; `state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md`, items 1 to 4; appended after §37 so that no line a record cites above it moves)

### Part A. The rule

The rule is the human's, items 1 to 3 of that message. It is byte-copied by script from <PIN>, and nothing in it is changed. Item 4 orders the piece that adds this section; it is referenced and not reproduced.

<THE BYTE COPY>

### Part B. The instantiation (the advisor's wording, under the delegation of 2026-11-13; not a quotation)

- **(i) What this section replaces.** From the merge of the piece that adds this section, §16 and Appendix A3's part on the Telegram mirror of question rounds no longer govern. Neither is edited. Both stay as the record of what was ruled then.
- **(ii) What is read under this section.** §3's steps 2 and 4, where they name a Telegram message; §4, where it has the custodian ask the human through `AskUserQuestion` and mirror the round to Telegram; §24's clause on the human-blocked Telegram notice; §28; and `governance/AI_DEVELOPMENT.md` §L. Where one of them differs from this section, this section governs. None of them is edited here.
- **(iii) The transport is unchanged.** `scripts/hooks/telegram.mjs` sends with Node's `https` module only. The bot token and the chat id come from the environment variables `CUSTODIAN_TELEGRAM_BOT_TOKEN` and `CUSTODIAN_TELEGRAM_CHAT_ID` only. They are never read from a file and never logged. When either is unset, nothing is sent.
- **(iv) The usage-limit alarm.** The `Notification` entry of `.claude/settings.json` has the matcher `quota_auto_resume_stale|quota_auto_resume_disabled`, which names the two quota notification types and no other type. It runs `scripts/hooks/notify-telegram.mjs`, which sends the notification as one message. A repeat with the same type and the same first 80 characters of its message within ten minutes is not sent.
- **(v) The halt alarm.** At a stop where the Stop hook (`scripts/hooks/stop-queue.mjs`) finds the halt switch (§18), it sends `HALT: <the file's first line>`, or `HALT: stop-hook halted` when that line is empty. It sends this whether or not a node waits on the human, and the message lists nothing. A repeat of the same text within ten minutes is not sent.
- **(vi) The advisor's two hours of silence.** Nothing sends this alarm yet. PLAN node `advisor-silence-two-hour-alarm` builds its sender. Until that node merges, no text says that it is sent.
- **(vii) Nothing else is sent.** The Stop hook sends no message when only human-blocked nodes remain. `.claude/settings.json` has no `PreToolUse` entry: no entry in it writes a question round or mirrors one to Telegram. `scripts/hooks/questions-mirror.mjs` stays in the tree with its test and its fixture. No settings entry runs it, and under item 1 the custodian does not run it.
- **(viii) The custodian's part.** It does not call `AskUserQuestion` (item 1). It writes each round file itself and sends the advisor its path by session message (item 2). When only human-blocked nodes remain, it tells the advisor what waits and for how long (item 2).
```

6. OPEN-6, section L of `governance/AI_DEVELOPMENT.md`: (a).
(a) The file is not touched in this piece. §38 (ii) names the section as read under it.
(b) Its appended pointer goes into the follow-up node of item 4, which completes the three alarms, and not into `advisor-session-merges-under-the-humans-rule`.

7. OPEN-7, the sample payloads in the tests: (a). They stay. They are data for the message's format, and they claim nothing about the matcher.

8. OPEN-8, a type allowlist in `scripts/hooks/notify-telegram.mjs`: (a), none.
(a) The human named the matcher as the place, and the script's code stays unchanged, which keeps this piece small.
(b) What brings it back: the form's falsification. If an idle alert reaches the human from a session that has loaded the merged file, you tell me, and I place the allowlist then.

9. The budget. The node's budget becomes 180 minutes before the form is committed. The 60 was set for a small docs piece, before the full form and both gates were ruled, and your note 5 says the whole piece does not fit it. This replaces ADV-2026-11-14-23 item 4 (c). §10's rule then applies at twice 180.

10. What you do now.
(a) Commit the form on main with these answers recorded, each named as the advisor's ruling under the delegation, and with this ruling cited at its filed path beside ADV-2026-11-14-23.
(b) The form's section 8 item 12 holds under (a′) as it did under (a). Its test T8 row and its OPEN-3 text follow item 3. Its section 2.6 and OPEN-5 text follow item 5.
(c) Re-list rule (00) at the form's commit, as your note 6 says, and brief the worker.
(d) ADV-2026-11-14-23 items 5 and 6 stand: my merge check compares the settings file's two places with ADV-2026-11-13-04 by script, and after the merge you restart nothing and tell me when your main checkout holds the merged file.
