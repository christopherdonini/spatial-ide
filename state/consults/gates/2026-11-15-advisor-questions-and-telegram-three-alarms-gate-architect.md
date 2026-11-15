Reviewed: PR #323 at 917f66c86cab91597947dc1b7ba699fdf4e4d435 (the custodian's filing note, 2026-11-15: the architect, PLAN node advisor-questions-and-telegram-three-alarms, under its form (`governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`), one of its two gates from dispatch; its brief by file (5529 bytes, sha256 01b1c149b15c1be7ab830b7e2ecec6efea0cb268ef530d19893df287e9ca9c52); the run 2026-11-15T01:29:05Z to 2026-11-15T01:34:40Z by its transcript, 40 calls (Read 27, Grep 10, Glob 2, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; the report below, byte for byte, from its hand-back of 11804 bytes, sha256 49339b7966aecfed483fe533ad340feaa7e5c3afb38e60530cf3727e52af1915, with this note added in its first line; its D1 to D4 go to the advisor with the reviewer's C-1, which gives other words for the line D1 names), gate architect
Verdict: PASS WITH NOTES
Branch: cut/advisor-questions-and-telegram-three-alarms @ 917f66c86cab91597947dc1b7ba699fdf4e4d435 (merge base B′ bd5bcd09da885661266b3b7b46b707b3b46cb5fc; main 925203430d1fe0f7dd7b761165e04e679f5458aa)

The three Documentation findings below are worded by the worker, so the worker applies the replacement words and the PR body lists them, with no re-gate (§31). D4 is the advisor's wording and goes to the advisor. No finding is Correctness or Evidence. All paraphrase in this report is mine; backtick spans are byte-copied from the files named.

## Correctness
None. The code at H matches §2.2 (a) to (g) and the rulings.

## Evidence
None. Each test T1 to T8 would fail if its claim were false, and each mutation log matches its comment (check 5).

## Documentation (fix before the merge; no re-gate)

**D1. `scripts/hooks/notify-telegram.mjs:21`, the worker's wording.**
- Now: `// never changes anything: this hook's exit code and stderr are ignored.`
- Why it is wrong (my words): a failed send does change something. `sendTelegramDeduped` writes the dedupe key before it sends, whatever the send's result (`telegram.mjs:262-268`). So after a failed send, a repeat inside ten minutes is not sent (`telegram.mjs:258-261`).
- Replacement for line 21, one line, so the file stays at 79 lines and the cites `notify-telegram.mjs:76-79` still resolve: `// decides nothing (this hook's exit code and stderr are ignored), and it is not retried inside the window.`
- Clause check:
  - "decides nothing": `main()` exits 0 on every path (lines 63 and 73).
  - "exit code and stderr are ignored": the contract quoted at lines 8-9.
  - "not retried inside the window": `telegram.mjs:262-268` and `258-261`.

**D2. `scripts/hooks/stop-queue.mjs:167`, the worker's wording.**
- Now: `// The halt alarm: the HALT headline alone, deduped on its own text. It adds no state.`
- Why it is wrong (my words): each new halt text adds the key `halt:<text>` to `.claude/state/telegram-sent.json` (line 170; `telegram.mjs:229-231` and `264`).
- Replacement, one line, so no line below it moves: `// The halt alarm: the HALT headline alone, deduped on its own text (one key in .claude/state/telegram-sent.json).`
- Clause check:
  - "headline alone": line 289 passes only the `HALT: …` text.
  - "deduped on its own text" and "one key": line 170 and `telegram.mjs:264`.

**D3. The record of T7's mutation (the form's §10 amendment, or the PR body).**
- The problem (my words): §4's T7 row says the command's script path is altered "in a scratch copy of the settings". T7 reads the tracked `.claude/settings.json` (`hooks.test.mjs`, `readSettings`), so a scratch copy could not make it fail. The `RECORDED MUTATION` comment says the path was altered `in the settings file`. The log `<S>/nta-work/nta-mut-T7.txt` agrees with the comment. The worker's report does not name this as a departure.
- Words for the record: "T7's mutation was applied to the worktree's `.claude/settings.json`, the file the test reads, not to a scratch copy as §4's T7 row says; it was reverted, and `git diff` was 0 bytes after it (the worker's report, Mutations)."
- Clause check: the test reads the repository file through `readSettings`; the log shows the failure; the worker's report gives the revert.
- This touches only the worktree copy, not the main checkout, so it does not trigger §8 item 2.

**D4. §38 Part B (vii), first sentence. This is the advisor's wording under the delegation; it is a finding for the advisor, not mine to reword.**
- The sentence, byte-copied (`governance/AUTONOMY.md:735` at H): `The Stop hook sends no message when only human-blocked nodes remain.`
- What is true (my words): if a halt is found while only human-blocked nodes remain, the hook does send the HALT line. The halt branch (`stop-queue.mjs:285-293`) returns before the plan is read (`324-333`), and T3 asserts exactly this case. Only the step-6 path (`335-340`) sends nothing.
- Why it does not block (my judgement): the heading "Nothing else is sent" and (v)'s `whether or not a node waits on the human` limit the sentence, so no operator is misled.
- Proposed words, if the advisor wants a change: "The Stop hook sends no waiting-list message: when no halt is found and only human-blocked nodes remain, it sends nothing."
- Clause check: `stop-queue.mjs:289` is the only send; `335-340` has none.

## Observations (no fix required)
- **O1 (flag 1, item 3):** a throwing injected `notify` now reaches `main()`'s catch (`stop-queue.mjs:389-392`).
  - The decision is unchanged (allow, exit 0). Only the HALT stderr line gives way to the unexpected-error line.
  - No product caller throws: the default `notifyHalt` catches (`171-173`), and `sendTelegramDeduped` never throws.
  - The seam row holds: `rotate-cut-state.test.mjs:211, 233, 249, 252` uses a spy that does not throw, asserts `notified` is `[]`, and passes unedited.
  - The call shape is exactly §2.2 (d) and (e).
- **O2 (flag 1, item 1):** 79 lines, a net loss of 0, which is within §2.3's "at most 3". §7's list of highest cited lines leaves out `notify-telegram.mjs:76-79`. D1 keeps that count.
- **O3 (flag 1, item 2):** the README's sentence at line 222 is the sentence of ruling item 2 (b), except that it reads `sends again` where the ruling reads `sends again at each later stop`. It states the limit that §1 rules may not be claimed away, and it claims nothing §1 rules out.
- **O4 (flag 1, item 4):** T2 sets no `CUSTODIAN_PLAN_PATH`, and there is no plan under its temp root, so it is S2 as declared. S3 (a plan present) is T3.
- **O5 (flag 1, items 5 and 6, and flag 2):**
  - Commit A's body says two scripts where three were edited. It is pushed history; it may be named in the closing amendment.
  - The verify runs that count are those at H, by the worker's report.
  - The refused Edit at 00:01:08Z had no effect at H: the Edit landed at 00:01:20Z, after the read. The custodian's filing note discloses it.
- **O6:** unchanged README lines 246-247 (`` `AskUserQuestion` stays the answer channel``) and 276-277 (the matcher hypothesis H1) are written in the present tense. The retirement paragraph at 232-234 governs that section. Rewording them is optional.
- **O7:** (v)'s ten-minute halt dedupe is supported by the code (line 170 with `telegram.mjs:258-261`) but has no halt-specific test. It is not among §1's may-claims.
- **O8:** content shifts under unpinned cites into `hooks.test.mjs` and `stop-queue.mjs`. They still resolve in range, as §7 declares.

## Checks
1. **Settings.** I read B′'s file (the same as main's) and H's file, whole.
   - Lines 3-14 (the PreToolUse key) are removed, and the line-92 matcher became `quota_auto_resume_stale|quota_auto_resume_disabled`.
   - The Stop, PreCompact and SessionStart entries, the Notification command and its timeout 15 are byte-equal.
   - That is ADV-2026-11-13-04's two places only. C1 is the reviewer's.
2. **`stop-queue.mjs`.**
   - (a) Step 6 has no send.
   - (b) `waitingSummary`, `waitingSetKey`, `notifyWaiting` and the `node:crypto` import are gone.
   - (c) `notifyHalt` is at 168-174.
   - (d) The halt stderr line (287) is unchanged; the call at 289 reads no plan.
   - (e) The default is `notify = notifyHalt` (273).
   - (f) The header lines 28-30 and the reason clause at 56 are reworded.
   - (g) `checkHalt`, the override order, `leaseHeldBy` (still exported), `judgeContinuity`, `accountContinuation`, steps 4, 5, 7 and 8, `main` and the cloud guard are all outside the diff.
   - Packet flag 1, item 3: see O1.
3. **Comments and docs.** I checked each changed sentence clause by clause:
   - `notify-telegram.mjs` 12-14 and 18-20 hold; 21 does not (D1).
   - `questions-mirror.mjs:20-21` holds.
   - `stop-queue.mjs` 28-30, 56 and 288 hold; 167 does not (D2).
   - The tests' comments at 229, 253 and 312 hold.
   - The README passages of §2.5 (lines 63-65, 84-85, 195-205, 220-222, 232-234, 236 and 267-269) hold.
4. **§38.**
   - The AUTONOMY hunk is `@@ -709,3 +709,28 @@`: only added lines, with no context after them, so nothing above changes.
   - Part A matches the directive's lines 9-13 as I read them. I have no shell, so I recomputed no hash; C3 and verify-quotes are the reviewer's.
   - Part B against the code:
     - (iii) holds: `telegram.mjs:30`, `40-54`, `51`.
     - (iv) holds: settings:80, `notify-telegram.mjs:37-40`, `DEDUPE_WINDOW_MS`.
     - (v) holds: `stop-queue.mjs:120`, `286-292`, `170`.
     - (vi) holds: there is no sender, and the PLAN node exists at `governance/PLAN.yaml:7263`.
     - (vii) is true except for its first sentence (D4); the fixture, test and script are present, and no settings command names the mirror.
     - (i), (ii) and (viii) are rules, not code. The sections that (ii) names all exist: AUTONOMY lines 89 and 91 (§3 steps 2 and 4), §4, the clause at line 474 (§24), §28, and `AI_DEVELOPMENT.md:664` (§L).
5. **Tests T1 to T8 against S1 to S8.**
   - Each asserts its scenario's declared outcome and would fail if that outcome were false.
   - Each mutation is designed to break exactly its test's claim.
   - The `RECORDED MUTATION` comments match the worker's report and the logs I read (T2, T5, T6a, T6b, T7, T8).
   - T8 holds the literal at `questions-mirror.test.mjs:299`. It equals ADV-2026-11-13-04 item 1 (a) and B′'s settings line 9. It reads no settings file and no commit; its only git call is `--exec-path`.
6. **§1 and §8 item 9.** No text at H says the two-hour alarm is sent ((vi) says nothing sends it), says idle alerts stopped, says a usage limit raises the alarm, or says a halt sends one message only.
7. **Scope and size.**
   - Eight files, the §7 list.
   - I recounted stop-queue at 9/36, which matches the packet. The totals are 276 lines (bound 300) and 237 without the README (bound 240), from the packet.
   - Route: the full form, both gates.
8. **The packet's flags.**
   - Flag 1: O1 to O5.
   - Flag 2: O5.
   - Flag 3: check 4 and D4.
   - Flag 4, §8 items 1 to 15:
     - 1: holds by my read; C1 is the reviewer's.
     - 2: holds; the main checkout's settings file is still the old one.
     - 3 to 8 and 10: hold.
     - 9: holds (check 6).
     - 11: Part A matches by my read; the hash is the reviewer's.
     - 12: holds; the script, its test and its fixture are present.
     - 13: CI is not observed by me; it is a merge condition.
     - 14: holds.
     - 15: C3 is the reviewer's.
   - Flag 5:
     - The T6b log's extra `'PreToolUse'` key exists only in B′'s file, and the logs' line numbers (1425, 1437) are A's, before B's comments. So at the time of the run, `HEAD~1` was B′.
     - Judging T6a, T6b and T7 from the logs leaves no claim of the form unproven: S6 and S7 are proven by the tests passing at H, which the reviewer runs.
   - Flag 6: I did not check it; I have no shell. The `git diff --name-only` runs are the reviewer's.

## Calls
Read 27, Grep 10, Glob 2, SubagentHandback 1. I wrote no file and started no background shell.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.

Files I relied on, at H in `C:/dev/wt/nta`: `scripts/hooks/stop-queue.mjs`, `scripts/hooks/notify-telegram.mjs`, `scripts/hooks/telegram.mjs`, `scripts/hooks/questions-mirror.mjs`, `scripts/hooks/questions-mirror.test.mjs`, `scripts/hooks/hooks.test.mjs`, `scripts/hooks/README.md`, `.claude/settings.json`, `governance/AUTONOMY.md`, `scripts/plan/rotate-cut-state.test.mjs`. On main in `C:/dev/spatial-ide`: the form, both rulings, both 2026-11-13 directives, Part 1 of the 2026-11-05 directive, the worker's report and `governance/PLAN.yaml`. In the scratchpad: `<S>/packet-323.md`, `<S>/nta-323-diff.patch` and `<S>/nta-work/nta-mut-*.txt`.
