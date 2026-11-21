# The stop alarm: a StopFailure hook, so that the human is told when a turn of the custodian ends on an error from the service — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline.

- **The approval.** The human approved the advisor's draft ADV-2026-11-18-06 by typed message. It is filed at `state/directives/2026-11-18-the-humans-message-adv-2026-11-18-06-approved-a-stop-failure-hook-that-tells-the-human-when-a-turn-ends-on-a-service-error.md` ("the approval"). By the approval, the draft's text is the human's words.
- **Class, place and procedure.** These are the advisor's ruling ADV-2026-11-18-22, under the human's delegation of 2026-11-13, not the human's words. It is filed at `state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-22-the-stop-alarm-a-five-line-form-the-reviewer-alone-the-sonnet-worker-its-place-under-the-cap-its-live-check-last.md`.
  - The piece takes a five-line form, the reviewer alone and the Sonnet worker.
  - Its PLAN node is new, named by the custodian: `stop-failure-alarm`. It is not added to what v0.2 waits for.
- **Prior art.** The reuse index records none: `reuse.mjs` of the reuse clone, run on 2026-11-18, gave a miss. The piece reuses this repository's `scripts/hooks/telegram.mjs` and the shape of `scripts/hooks/notify-telegram.mjs`.
- **The event's input.** It is taken from the hooks reference's StopFailure section, read from `https://code.claude.com/docs/en/hooks.md` at 2026-11-18T22:44:52Z: 1770 bytes, sha256 5325b89dd320aeb2410d7feb2c695e5bf19e268194d8dcfb85a588f7ba3c9849. The section's example input is the test fixture, byte for byte.

```
Authority: PLAN node stop-failure-alarm; the approval (items 1 to 7) and the advisor's ruling ADV-2026-11-18-22 (items 2 to 9), filed as named above.
Scope: .claude/settings.json (the approval's items 1 and 3; the custodian's own commit, holding that file alone, in the pull request's worktree); scripts/hooks/notify-stop-failure.mjs (new); scripts/hooks/notify-stop-failure.test.mjs (new); scripts/hooks/fixtures/stop-failure-input.json (new); governance/AUTONOMY.md (words appended at the end of §38, which is the file's end, dated 2026-11-18, citing the approval's file, so that no line above them moves); scripts/hooks/README.md (a section appended at its end); 6 files; declared line budget <= 250 added and <= 4 removed in all.
Change: what is built is the approval's items 1 to 4, cited here and not reworded: item 1 (the hook and its script), item 2 (what the script sends, and what it never sends or does), item 3 (the matcher value) and item 4 (§38 and the README). The worker drafts §38's and the README's words from the approval's items 1 to 3 and the built script; the reviewer checks each clause against the code and the approval; the words go to the advisor with the merge request (the ruling's item 5).
Tests+mutation: the approval's live checks, each shown where named. (a) The new test file, with the fixture, under node --test: the message's text and dedupe key; that no text the script sends holds the fixture's last_assistant_message; exit 0 on bad input; no send in a cloud session. Every send in a test is a dry run, and no token is read. Mutations, each run and reverted by the reviewer: the message carries last_assistant_message, and the no-leak test fails; the error type is dropped from the message, and its test fails. Shown in the reviewer's report. (b) After the reviewer's PASS, with the script at its final text, the custodian sends the one TEST message at the laptop: the script reads a scratch copy of the fixture whose error_details begins with TEST. The advisor is told the time. The human's line is filed before the merge request, and check (b) is made again if the script changes after it (the ruling's item 6). (c) The settings file differs from main by the one new StopFailure block, with no matcher, and by quota_auto_resume_fired added to the Notification matcher, and by nothing else: git diff origin/main -- .claude/settings.json, in the closing amendment. (d) The hooks' existing tests pass unchanged: node --test "scripts/hooks/*.test.mjs" at the head, its counts in the closing amendment, with no existing test file in the diff.
Out-of-scope: block on sight (the ruling's item 3): any other file; a CI workflow, a dependency or a lockfile; a change to telegram.mjs or to any existing hook script or test; a second change in the settings file; a token read or printed; a Telegram message sent by a test or by an agent, check (b)'s one message by the custodian apart. If the script cannot be built inside this list, the piece stops and goes to the advisor. No ADR, wire, product file or guarantee is touched.
```

What is not proven: the approval's item 6, quoted byte for byte:

> 6. What is not proven: that the app raises this event when a usage limit is reached. Its documentation lists the error type `rate_limit` for the event, and the records of 2026-11-16 carry that type, but only the next limit will show it. The form says so.

The closing amendment records checks (a) to (d) with their evidence, the reviewer's gate, the human's line for check (b), and the session from which the merged hook acts (the ruling's item 9).

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-11-21 — the human's approval of ADV-2026-11-18-25: check (d) in its new words, the seventh file; the piece resumes

*Written by the custodian before the test's change is made. References only; nothing below is a quotation.*

1. **The approval.** The human's typed message of 2026-11-21 at 09:45Z approves ADV-2026-11-18-25 by its id, filed at state/directives/2026-11-21-the-humans-message-four-drafts-approved-s8s-words-to-the-advisor-the-ci-change-v0-2-without-the-console-and-mint-window-nodes-the-stop-alarms-check-d.md. By the approval, its text below its rule is the human's words. It keeps the approval of ADV-2026-11-18-06 and changes check (d).

2. **Class, place and procedure** are the advisor's ruling ADV-2026-11-21-13 item 5, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-13-the-humans-four-approvals-placed-the-ci-piece-in-slot-1-the-stop-alarm-resumes-item-68-meets-the-limitation-s8-joins-p6.md: the piece is not paused, and what follows is ADV-2026-11-18-26 item 4 (a) to (e), then ADV-2026-11-18-22 items 5, 6 and 8. It runs beside the CI piece and P6, under the cap, and never takes a place that a merge request, a stop, the CI piece or a P6 group waits for.

3. **The seventh file.** Scope gains scripts/hooks/hooks.test.mjs, for one change and no other: in the test the_notification_hook_matches_only_the_two_quota_types, the two expected values (the hook keys gain StopFailure; the Notification matcher gains quota_auto_resume_fired) and one comment line above the test saying why. The test keeps its name. It is a commit of its own, by the worker, on cut/stop-failure-alarm (ADV-2026-11-18-26 item 4 (a)). The block on sight for an existing hook test excepts this one change and no other (item 4 (e)). The files are 7 and the declared line budget gains 3 changed lines.

4. **Check (d) in its new words.** Every other hook test passes unchanged. The one test of item 3 changes in its two expected values alone. The whole hooks suite, node --test over scripts/hooks with its test files, is run at the test's commit, and its count is shown in this form by the next amendment (item 4 (c)). The same run at the head goes in the closing amendment.

5. **The merge.** By ADV-2026-11-21-13 item 5 (d), the approval of ADV-2026-11-18-06 as changed by ADV-2026-11-18-25 is the human's typed approval naming the live checks. Before the merge request, each of the four checks is shown in this form, and the human's line for check (b) is filed.

6. **Superseded:** the words of check (d) in the five lines, by item 4; nothing else.

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — 2026-11-21 — check (d)'s count at the test's commit (ADV-2026-11-18-26 item 4 (c))

*Written by the custodian after the test's commit. References and hashes only; nothing below is a quotation.*

1. **The test's commit.** 1d944d84528962ac1550ec6992918a1de646316a on cut/stop-failure-alarm, by the worker, over 74ba9d352fe0101c14136769a9c46718d8cef125. It holds scripts/hooks/hooks.test.mjs alone, 3 lines added and 2 removed: the change of Amendment 1 item 3 and nothing else. The branch differs from main by 7 files, 183 lines added and 3 removed, inside Amendment 1 item 3's budget.

2. **The count (item 4 (c)).** The whole hooks suite, node --test over scripts/hooks with its test files, run by the custodian in the branch's worktree at 1d944d84528962ac1550ec6992918a1de646316a with an empty porcelain, on Node v24.18.1, ended at 2026-11-21T11:05:57Z: exit 0; tests 198, pass 198, fail 0, cancelled 0, skipped 0, todo 0. The worker's run on the same tree before its commit gave the same count. The same run at the head goes in the closing amendment (Amendment 1 item 4).

3. **Next.** The reviewer reads the branch whole, the test's commit with the rest (item 4 (d)); then ADV-2026-11-18-22 items 5, 6 and 8, in that order.

Read the last amendment first.

Nothing above is edited.
