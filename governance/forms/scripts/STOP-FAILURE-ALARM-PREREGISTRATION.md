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

### Amendment 3 — 2026-11-21 — the gate, attempt 1: FAIL on words only; the findings to the advisor

*Written by the custodian after the gate, before any correction. References only; nothing below is a quotation.*

1. **The gate.** The reviewer read cut/stop-failure-alarm at 1d944d84 and ended FAIL (state/consults/gates/2026-11-21-stop-failure-alarm-gate-reviewer.md). Its checks found the scope and the budget, check (c), check (a) with both mutations caught, check (d) by the custodian's run, and the approval's items 1 to 4 met by the code. No finding is on the code, and none on the evidence.

2. **Blocking, on words only** (AUTONOMY section 31). F1: the Matcher paragraph of the hooks README's Notification section names two quota types, untrue once the matcher names three; the reviewer's words are a paragraph appended to the new section. F2: Part B (vii) of section 38 says that nothing else is sent, untrue once the StopFailure message is sent; the reviewer's words replace the branch's own (xii) bullet, and no line of Part A or Part B is edited. Neither sentence is the human's wording.

3. **Documentation, must-fix.** N1: the first line of the README's new section is undated and does not name the approval's file. N2: the comment line above the one hook test says what changed and by whose approval, but not that the name stays because an earlier form claims it by name, as the human's approval of ADV-2026-11-18-25 asks; Amendment 1 item 3 gave the worker only the words saying why, so the gap is the custodian's. N3: the custodian's suite file records neither its command nor its exit code; the closing run records both. N4: the header comment of notify-telegram.mjs names two quota types; that file is blocked on sight (ADV-2026-11-18-22 item 3), so it goes to the advisor, and F1's words record it meanwhile. N5: input with no error field sends the word unknown, which no record states.

4. **Next.** The findings go to the advisor for a ruling on how they close: who applies the words, in how many commits, and whether a gate reads them again. Live check (b) waits for that ruling. Nothing on the branch changes before it.

Read the last amendment first.

Nothing above is edited.

### Amendment 4 — 2026-11-21 — the words in one commit; the gate, attempt 2, PASS; a class 1 departure; the four live checks as they stand

*Written by the custodian after attempt 2 and before the TEST message. References only; nothing below is a quotation.*

1. **The ruling.** The advisor's ruling ADV-2026-11-21-19, under the human's delegation of 2026-11-13, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-19-the-stop-alarm-a-gate-reads-the-words-one-commit-then-the-reviewers-second-attempt-then-live-check-b-n5-in-the-advisors-sentence.md: a gate reads the words; one commit of the report's words and one sentence of the advisor's; the hooks suite at the new head; the reviewer's second attempt, limited to that commit; then live check (b). The advisor's ruling ADV-2026-11-21-20, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-20-the-humans-message-to-the-advisor-in-force-to-2026-11-28-documentation-findings-no-fail-an-evidence-checklist-five-figures.md, leaves it standing as sent by its item 6: the commit already held the advisor's sentence, and attempt 2 had run and ended, before that ruling arrived.

2. **The commit.** 2039dfb1e6e7636a0d405955675b2eeeb66cb7ff over 1d944d84, by the standard worker, by script (state/consults/2026-11-21-stop-failure-alarm-gate-words-worker-report.md): F1's paragraph and the advisor's sentence for N5 appended at the end of the README's new section, each a paragraph of its own; N1's line in place of that section's first line, nothing reflowed; F2's bullet in place of the (xii) bullet of section 38's Part C, Parts A and B untouched; N2's line in place of the comment line above the hook test, still one line. 7 lines added and 3 removed in three files. The settings file, the script, its test, its fixture and notify-telegram.mjs are byte-equal to 1d944d84.

3. **A class 1 departure.** Amendment 1 item 3 named one commit on hooks.test.mjs; this is a second, by the ruling's item 2. Its cause is the custodian's: Amendment 1 item 3 gave the worker words saying why the expected values changed, not that the name stays because an earlier form claims it, so the gate's N2 asked for the line again.

4. **The suite at the new head** (the ruling's item 3, the gate's N3). The hooks suite, run once at 2039dfb1, its head, command and exit code recorded in a file beside its output: exit 0; 198 tests, 198 pass, none failed, cancelled, skipped or left to do, as at 1d944d84.

5. **The gate, attempt 2.** The reviewer alone read the commit and ended PASS (state/consults/gates/2026-11-21-stop-failure-alarm-gate-reviewer-attempt-2.md): each text byte-equal to its source and where the ruling puts it; every clause true against the code and the approvals; the byte-equal check exit 0; the suite's record reused. Its N1 is this amendment. Its N2, not blocking, for the advisor: the advisor's sentence is true and says less than the code, which also writes the word unknown for an error field that is null and puts it in the dedupe key; and an input whose cwd is not a string sends nothing, reached only by malformed input from the app.

6. **N4 stays** (the ruling's item 5). notify-telegram.mjs is unchanged; its correction is on the human's list.

7. **The four live checks as they stand.** (a) The new tests pass, 5 of 5, and both mutations were caught (attempt 1). (c) The settings file differs from main by the StopFailure block and the third matcher type alone (attempt 1), byte-equal since. (d) Every other hook test passes unchanged: 198 of 198 at 2039dfb1 (item 4). (b) Next: the one TEST message, sent by the custodian with the script at its final text; its time goes to the advisor, and the human's line is filed before the merge request.

8. **Next.** The TEST message; the human's line; then the pull request, and the merge request with section 38's and the README's words.

Read the last amendment first.

Nothing above is edited.

### Amendment 5 — 2026-11-21 — live check (b): the one TEST message

*Written by the custodian after the message was sent. References only; nothing below is a quotation.*

1. **The message.** Sent once by the custodian at 2026-11-21T14:48:53Z, ended at 2026-11-21T14:48:54Z: the script at 2039dfb1, its final text, in its worktree, reading a scratch copy of the fixture whose error field alone was changed to begin with TEST (sha256 b1d6009962851e2ce49cde4d16558b221e1d99617931b05b908669278046cd03). Exit 0, nothing on stderr; the dedupe state written in the worktree's ignored folder under the key stop-failure:rate_limit; the worktree's tracked files unchanged.

2. **The four live checks.** (a), (c) and (d) as Amendment 4 item 7 records them; (b) is this message. The time went to the advisor, who asks the human for their line, filed before the merge request (ADV-2026-11-18-22 item 6).

Read the last amendment first.

Nothing above is edited.

### Amendment 6 — 2026-11-21 — the human's line for live check (b)

*Written by the custodian. References only; nothing below is a quotation.*

1. **Their line.** The human typed in the custodian's session at 2026-11-21T15:32:03Z the TEST message's text as it reached them, the second line of their message filed at state/directives/2026-11-21-the-humans-message-adv-2026-11-21-21-approved-and-the-alarm-test-line.md. The advisor's ruling ADV-2026-11-21-23, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-23-the-humans-second-line-is-the-alarm-line.md, items 1 and 2: it is their line for live check (b), and it shows the message arrived. Amendment 5 records the message, its time and the script's commit, 2039dfb1; this amendment adds their line by its directive, since nothing above is edited.

2. **The script since.** Unchanged since the TEST message: the branch head is still 2039dfb1, in its worktree and on GitHub. If it changes before the merge, check (b) is made again (ADV-2026-11-18-22 item 6 (c)).

3. **Next.** The pull request and the merge request, with section 38's and the README's words, the four live checks as this form shows them, and the settings diff (ADV-2026-11-21-23 item 3).

Read the last amendment first.

Nothing above is edited.
