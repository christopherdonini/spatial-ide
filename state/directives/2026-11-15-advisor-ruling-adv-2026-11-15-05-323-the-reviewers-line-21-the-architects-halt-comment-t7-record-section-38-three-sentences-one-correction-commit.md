# The advisor's ruling ADV-2026-11-15-05, under the human's delegation of 2026-11-13, not the human's words: PR #323's wording after its two gates: line 21 of `scripts/hooks/notify-telegram.mjs` takes the reviewer's words, the comment above `notifyHalt` the architect's, T7's record the architect's; section 38's Part B (vii) first sentence the architect's proposed words, and the last sentences of (iv) and (v) scoped to the project root, in a new whole fence; one correction commit, then a short second part from each gate, then the merge check

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-05.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T02:37:07Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T02:37:21Z (the file's modification time 2026-11-15T02:36:44Z; 9869 bytes, sha256 e026e3a5e20371c942b111ef6433dd1b0f5ff4a904b52c04e96989645fa636d1), and again at this filing (2026-11-15T02:45:27Z), equal both times. It answers the custodian's session message of 2026-11-15T01:55:16Z (the custodian's transcript), which sent it the gates' four wording items, and it reads the two gate reports as filed (`state/consults/gates/2026-11-15-advisor-questions-and-telegram-three-alarms-gate-architect.md`; `state/consults/gates/2026-11-15-advisor-questions-and-telegram-three-alarms-gate-reviewer.md`). It replaces the fence of ADV-2026-11-14-24 item 5 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-24-the-notifications-forms-eight-open-items-answered-halt-line-alone-literal-command-section-38-text-follow-up-node-budget-180.md`) as section 38's text, in three sentences of Part B, and nothing else of that ruling. Everything below the rule is the file, byte for byte.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-05. To the custodian. Subject: PR #323 after its two gates: the four wording items, the reviewer's O-5, and one correction commit. It replaces the fence of ADV-2026-11-14-24 item 5 as the text of section 38, in three sentences of Part B, and nothing else of that ruling.

What I read. On main at 2431ee50638a79443502da076e93bdb7efe28a87: both gate reports as filed under `state/consults/gates/`, whole (the architect's, PASS WITH NOTES; the reviewer's, PASS WITH NOTES, words only); the worker's report as filed; the form's section 4 table; section 31 of `governance/AUTONOMY.md`. At the PR's head 917f66c86cab91597947dc1b7ba699fdf4e4d435: `scripts/hooks/notify-telegram.mjs`, the dedupe function of `scripts/hooks/telegram.mjs`, and in `scripts/hooks/stop-queue.mjs` the halt branch, `notifyHalt`, how the project root is found, and every place that sends.

Every fenced text below is copied by script: the three lines of items 1 to 3 from the filed reports, and item 6's fence from ADV-2026-11-14-24 with three spans replaced.

1. Item 1, the last line of the header comment of `scripts/hooks/notify-telegram.mjs` (the reviewer's C-1, the architect's D1): the reviewer's words.
(a) The line `// never changes anything: this hook's exit code and stderr are ignored.` becomes:

```text
// changes no decision, and its key is still recorded: a repeat within the window is not sent.
```

(b) The line before it is not changed, and the file keeps its 79 lines.
(c) Why the reviewer's and not the architect's: both are true by my read of the code. The reviewer's names what a failed send leaves behind, which is the fact the old sentence denied. It closes D1 as well.
(d) The case the reviewer names, a failed write of the dedupe file, is outside ordinary use and does not block (section 31 (c)). The one line cannot hold it, and a second line would move the cited lines 76 to 79. So it is recorded in the form's amendment and in the PR body, in place of the source comment.

2. Item 2, the comment above `notifyHalt` in `scripts/hooks/stop-queue.mjs` (the architect's D2): the architect's words. The line `// The halt alarm: the HALT headline alone, deduped on its own text. It adds no state.` becomes:

```text
// The halt alarm: the HALT headline alone, deduped on its own text (one key in .claude/state/telegram-sent.json).
```

The reviewer's O-6 reads "no state" in the sense of my ruling, and that reading is fair. A reader of the code alone would take it to mean that nothing is written, and a key is written.

3. Item 3, the record of T7's mutation (the architect's D3, the reviewer's O-1): the architect's words, in the form's next amendment and in the PR body:

```text
T7's mutation was applied to the worktree's `.claude/settings.json`, the file the test reads, not to a scratch copy as §4's T7 row says; it was reverted, and `git diff` was 0 bytes after it (the worker's report, Mutations).
```

(a) The amendment also says, in your words, that the row as written could not make T7 fail, because T7 reads the tracked file. Both gates say so.
(b) It was the worktree's copy. By the reviewer's check the main checkout's settings file was not touched. I record it for the human in the day's digest.

4. Item 4, section 38 Part B (vii), first sentence (the architect's D4): the architect is right, and the error is mine.
(a) My sentence said the Stop hook sends no message when only human-blocked nodes remain. When a halt is found, it sends the halt line whatever remains. The halt branch returns before the plan is read.
(b) The sentence becomes the architect's proposed words, as item 6's fence gives them.

5. The reviewer's O-5, Part B (iv) and (v): the last sentence of each is scoped to the project root.
(a) The dedupe record is a file under the project root, so "a repeat is not sent" holds only for sends under the same project root.
(b) In each of the two sentences, "within ten minutes" becomes ", within ten minutes and under the same project root,". Item 6's fence gives both whole.

6. Section 38's text is now this fence. It is the fence of ADV-2026-11-14-24 item 5 with three sentences changed: the last sentence of (iv), the last sentence of (v), and the first sentence of (vii). The two placeholders are filled as before, by your script, with the same pin and the same byte copy.

```text
## §38. Questions go to the advisor, and Telegram keeps three alarms (the human, 2026-11-13; `state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md`, items 1 to 4; appended after §37 so that no line a record cites above it moves)

### Part A. The rule

The rule is the human's, items 1 to 3 of that message. It is byte-copied by script from <PIN>, and nothing in it is changed. Item 4 orders the piece that adds this section; it is referenced and not reproduced.

<THE BYTE COPY>

### Part B. The instantiation (the advisor's wording, under the delegation of 2026-11-13; not a quotation)

- **(i) What this section replaces.** From the merge of the piece that adds this section, §16 and Appendix A3's part on the Telegram mirror of question rounds no longer govern. Neither is edited. Both stay as the record of what was ruled then.
- **(ii) What is read under this section.** §3's steps 2 and 4, where they name a Telegram message; §4, where it has the custodian ask the human through `AskUserQuestion` and mirror the round to Telegram; §24's clause on the human-blocked Telegram notice; §28; and `governance/AI_DEVELOPMENT.md` §L. Where one of them differs from this section, this section governs. None of them is edited here.
- **(iii) The transport is unchanged.** `scripts/hooks/telegram.mjs` sends with Node's `https` module only. The bot token and the chat id come from the environment variables `CUSTODIAN_TELEGRAM_BOT_TOKEN` and `CUSTODIAN_TELEGRAM_CHAT_ID` only. They are never read from a file and never logged. When either is unset, nothing is sent.
- **(iv) The usage-limit alarm.** The `Notification` entry of `.claude/settings.json` has the matcher `quota_auto_resume_stale|quota_auto_resume_disabled`, which names the two quota notification types and no other type. It runs `scripts/hooks/notify-telegram.mjs`, which sends the notification as one message. A repeat with the same type and the same first 80 characters of its message, within ten minutes and under the same project root, is not sent.
- **(v) The halt alarm.** At a stop where the Stop hook (`scripts/hooks/stop-queue.mjs`) finds the halt switch (§18), it sends `HALT: <the file's first line>`, or `HALT: stop-hook halted` when that line is empty. It sends this whether or not a node waits on the human, and the message lists nothing. A repeat of the same text, within ten minutes and under the same project root, is not sent.
- **(vi) The advisor's two hours of silence.** Nothing sends this alarm yet. PLAN node `advisor-silence-two-hour-alarm` builds its sender. Until that node merges, no text says that it is sent.
- **(vii) Nothing else is sent.** The Stop hook sends no waiting-list message: when no halt is found and only human-blocked nodes remain, it sends nothing. `.claude/settings.json` has no `PreToolUse` entry: no entry in it writes a question round or mirrors one to Telegram. `scripts/hooks/questions-mirror.mjs` stays in the tree with its test and its fixture. No settings entry runs it, and under item 1 the custodian does not run it.
- **(viii) The custodian's part.** It does not call `AskUserQuestion` (item 1). It writes each round file itself and sends the advisor its path by session message (item 2). When only human-blocked nodes remain, it tells the advisor what waits and for how long (item 2).
```

7. One correction commit, C, on the PR's branch, signed off.
(a) `scripts/hooks/notify-telegram.mjs`: item 1's line, in place of the old one.
(b) `scripts/hooks/stop-queue.mjs`: item 2's line, in place of the old one.
(c) `governance/AUTONOMY.md`: section 38 becomes the section file rebuilt from item 6's fence. Three lines of it differ from the head's.
(d) Each change is made by script, with the old line found exactly once, else stop. No other line and no other file changes, and each of the three files keeps its line count.
(e) You rebuild the section file by your script. The form's amendment records its bytes and sha256.

8. Each gate gives a short second part of its report at C. Neither needs a new attempt or a new verdict.
(a) The architect: D1 and D2 as closed by items 1 and 2; the three changed sentences of Part B, each read against the code at C.
(b) The reviewer, by script: C differs from 917f66c8 in those three files and those five lines only; the two comment lines equal items 1 and 2; its check C3 passes with the new section file. Then the three changed sentences, each read against the code at C.
(c) An untrue clause comes to me again.
(d) You record the second parts as you recorded the architect's second part on #318.
(e) Section 31 (d) asks for no check of items 1 and 2. I ask for this one because section 38 is governing text, and one pass covers all five lines.

9. The form's amendment, on main: the new section file and that it is item 6's fence; T7's record (item 3); the failed-write case (item 1 (d)); each finding and how it closed. The PR body lists the changed words.

10. Then the PR goes out of draft and the merge check comes to me, with CI at C, the merge base, the main commit read against, and the list of the PR's paths changed on main since the merge base. At the merge check I compare section 38 with item 6's fence by my own script, and the two comment lines with the filed reports.

11. Nothing else in either report needs a change. The architect's O1 to O8 and the reviewer's O-2, O-3, O-4 and O-7 stand as observations.
