Reviewed: cut/stop-failure-alarm at 1d944d84528962ac1550ec6992918a1de646316a (the custodian's filing note, 2026-11-21: the stop alarm's single gate, attempt 1 (ADV-2026-11-18-22 item 2, ADV-2026-11-21-13 item 5); Bash 19, Read 11, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-21T11:45:47Z to 2026-11-21T11:52:03Z by its transcript; the report below byte for byte from its hand-back of 15674 bytes, sha256 a5dea27e8c2d236616648836ea586fc8549408e8d1d381a2a83fe2558b7fe3b9, with the scratch folder's path written as <S> by the custodian, with this note in its first line and one final newline; its findings went to the advisor), gate, reviewer
Verdict: FAIL, cut/stop-failure-alarm @ 1d944d84528962ac1550ec6992918a1de646316a. The code, tests, mutations and settings diff all pass, but the merged tree would keep two older sentences saying nothing else is sent, which this diff makes untrue. Both are fixed by words alone: the replacement words are in F1 and F2, the worker can apply them with no re-gate, and the PR body lists them (the wording-blocks rule).

Reviewer model: Opus 5.5 (claude-opus-5-5). The scratch files named below are in <S>/.

**Preflight.** Every command returned rc=0.
- `rev-parse HEAD` gave 1d944d84528962ac1550ec6992918a1de646316a.
- The porcelain was empty.
- `ls-remote` gave 1d944d84… refs/heads/cut/stop-failure-alarm.
- `origin/main` is b7c3ad68f330ac72017d43fc625b32761376e0a6.
- The log shows four commits, the settings commit first and the test commit last: 1d944d84 test, 74ba9d35 docs, c756afab feat, 321719cd chore.
- I read the records from origin/main: the approval items 1 to 7, ADV-2026-11-18-22, -26, the 2026-11-21 approval of ADV-2026-11-18-25, ADV-2026-11-21-13, and the form with Amendments 1 and 2.

## Checks

**1. Scope.** `git diff --numstat origin/main...HEAD` (rc=0) shows these seven files and no other:

| File | Added | Removed |
|---|---|---|
| .claude/settings.json | 12 | 1 |
| governance/AUTONOMY.md | 8 | 0 |
| scripts/hooks/README.md | 16 | 0 |
| scripts/hooks/fixtures/stop-failure-input.json | 9 | 0 |
| scripts/hooks/hooks.test.mjs | 3 | 2 |
| scripts/hooks/notify-stop-failure.mjs | 70 | 0 |
| scripts/hooks/notify-stop-failure.test.mjs | 65 | 0 |

- **Budget:** 183 added and 3 removed, against ≤250 added and ≤4 removed plus Amendment 1's 3 changed lines. Inside the budget, and it matches Amendment 2 item 1.
- **Per commit (`git show --numstat`):**
  - 321719cd holds `.claude/settings.json` alone (12/1).
  - c756afab holds the script, the test and the fixture.
  - 74ba9d35 holds AUTONOMY.md and README.md.
  - 1d944d84 holds hooks.test.mjs alone (3/2).
  - No file is touched in two commits.

**2. Check (c).** `git diff origin/main -- .claude/settings.json` (rc=0) shows exactly two hunks:
```
-        "matcher": "quota_auto_resume_stale|quota_auto_resume_disabled",
+        "matcher": "quota_auto_resume_stale|quota_auto_resume_disabled|quota_auto_resume_fired",
...
+    ],
+    "StopFailure": [
+      {
+        "hooks": [
+          {
+            "type": "command",
+            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/notify-stop-failure.mjs\"",
+            "timeout": 15
+          }
+        ]
+      }
```
- There is no `matcher` key in the new block and nothing else changes.
- Parsed, the hook keys are `Stop,PreCompact,SessionStart,Notification,StopFailure`. Check (c) passes.

**3. Check (a).** `node --test scripts/hooks/notify-stop-failure.test.mjs` on Node v24.18.1 (sfarev-a.txt): exit 0; tests 5, pass 5, fail 0, cancelled 0, skipped 0, todo 0. The porcelain was empty afterwards. Each property is covered as follows:
- **The message's text:** test `stop-failure: the message holds the error type, the error details and the folder basename` (test file :30–37). It checks the exact text of the child's dry-run send and the exact `buildMessage(fixture)`.
- **The dedupe key:** test `stop-failure: the dedupe key holds the error type` (:39–42).
- **No leak:** test `stop-failure: no text the script sends holds last_assistant_message` (:44–52). It is not vacuous: `last_assistant_message.length > 0` and `sends.length === 1`, and it checks the send, `buildMessage` and `dedupeKey`.
- **Exit 0 on bad input:** test `stop-failure: bad stdin exits 0 and sends nothing` (:54–58).
- **No send in a cloud session:** test `stop-failure: in a cloud session the child exits 0 and prints no dry-run line` (:60–65).
- **Every send is a dry run, and no token is read:** every spawned run goes through `run()` (:18–28).
  - It sets `CUSTODIAN_TELEGRAM_DRY_RUN: '1'` and deletes `CUSTODIAN_TELEGRAM_BOT_TOKEN` and `CUSTODIAN_TELEGRAM_CHAT_ID` from the child's env. No test passes an `extraEnv` that overrides the dry run. `telegram.mjs:42-47` returns before any request when the dry run is on.
  - `CLAUDE_PROJECT_DIR` is a temp dir, so the dedupe state never touches the repo's `.claude/state`.
  - The direct `buildMessage` and `dedupeKey` calls send nothing. The import does not run `main` (guard at script :67).
  - Neither the test nor the script reads a token's value. A grep for `process.env|TOKEN|CHAT_ID|https|fetch(` finds only `CLAUDE_PROJECT_DIR` (script :34) and the two `delete`s (test :22–23).

**4. Mutations.** Each was one anchored `node -e` that checks the anchor occurs exactly once, replaces it and writes the file.
- **M1:** `${details} (${cwdBase})\`;` became `${details} (${cwdBase}) ${input.last_assistant_message}\`;` (sfarev-m1-diff.txt). Run: rc=1, pass 3, fail 2.
  - `stop-failure: no text the script sends holds last_assistant_message` fails first at `notify-stop-failure.test.mjs:49:33`, the `for (const s of sends) assert.equal(s.includes(...), false, s)`. Actual: `Session stopped on an error: rate_limit — 429 Too Many Requests (...) API Error: Rate limit reached`.
  - The message-text test also fails, at :35:10.
  - Reverted with `git checkout -- scripts/hooks/notify-stop-failure.mjs` (rc=0). The porcelain was empty (0 bytes).
- **M2:** `an error: ${input.error ?? 'unknown'}${details}` became `an error:${details}` (sfarev-m2-diff.txt). Run: rc=1, pass 4, fail 1.
  - `stop-failure: the message holds the error type, the error details and the folder basename` fails at `notify-stop-failure.test.mjs:35:10`. Actual is `'Session stopped on an error: — 429 Too Many Requests (spatial-ide)'`; expected is `'… error: rate_limit — 429 …'`.
  - Reverted (rc=0). The porcelain was empty and HEAD is still 1d944d84….
- Both mutations are caught.

**5. Check (d).** I reused the custodian's run and did not re-run it, because the files are consistent.
- `sfa-suite-c.head` = 1d944d84528962ac1550ec6992918a1de646316a.
- `sfa-suite-c.porc` is 0 bytes.
- `sfa-suite-c.txt` ends: tests 198, pass 198, fail 0, cancelled 0, skipped 0, todo 0. It has no lines starting with ✖. It contains `✔ the_notification_hook_matches_only_the_two_quota_types` and the five stop-failure tests.
- From the diff, the only existing test file changed is `scripts/hooks/hooks.test.mjs`, in the hunk at 1428.
  - One comment line is added (:1431).
  - The keys `deepEqual` gains `'StopFailure'` (:1434).
  - The matcher `equal` gains `|quota_auto_resume_fired` (:1437).
  - The name and the other assertions are unchanged. This is Amendment 1 item 3's change alone.
- The run file does not record the command or the exit code (see N3).

**6. Approval items 1 to 4 against the code.** Script lines are in `scripts/hooks/notify-stop-failure.mjs` at H.
- **Item 1:**
  - The StopFailure hook in `.claude/settings.json` is at :90–100, with no matcher.
  - It runs the new script at :95.
- **Item 2, what it sends:**
  - One message through `telegram.mjs`: imported at :20 and sent with `sendTelegramDeduped` at :60.
  - The ten-minute window: :60 passes no `windowMs`, so the default `DEDUPE_WINDOW_MS` applies (telegram.mjs:36, :251).
  - Keyed on the error type: `dedupeKey` at :29–31 is `stop-failure:<error>`.
  - "Stopped on an error", the error type, the error details and the folder name: `buildMessage` at :22–26.
- **Item 2, what it never sends or does:**
  - No last assistant message: `buildMessage` reads only `cwd`, `error_details` and `error`, and `dedupeKey` reads only `error`. The field appears only in comments.
  - Reads no token and prints none: the script makes no token env access (the only env read is `CLAUDE_PROJECT_DIR`, :34). Its stderr lines :54 and :62 print only `e.message`. I probed two malformed inputs that hold the field (sfarev-bad2-out.txt, sfarev-trunc-out.txt): Node 24's parse message echoes none of the input.
  - Nothing in a cloud session: :68 exits before reading stdin.
  - Always exits 0: :55, :64 and :68. `sendTelegramDeduped` never throws, and it is caught anyway at :61–63. A `buildMessage` throw on a non-string `cwd` is inside that try.
  - Its only other side effect is the module's dedupe file `<root>/.claude/state/telegram-sent.json` (telegram.mjs:241–245), which the window needs.
- **Item 3:**
  - The matcher is at settings.json:80.
  - Nothing else in the settings file changes (check 2).
- **Item 4:** AUTONOMY.md :737–744 (Part C) and README.md :331–346.

**7. The words.**
- **Appended at the end:**
  - `head -n 736 AUTONOMY.md | cmp - <main's AUTONOMY.md>` gave 0, and main's AUTONOMY.md is 736 lines.
  - `head -n 330 README.md | cmp - <main's README.md>` gave 0, and main's README.md is 330 lines.
  - Both files are LF with a final newline.
  - No line above moves.
- **§38 Part C:** it is dated 2026-11-18, cites the approval's file and says the words are the worker's.
  - (ix), (x), (xi) and (xiii) each match the code (lines in check 6). (xiii) says less than item 6, but item 6 asks only that the form say so, and the form does.
  - (xii) reconciles (iv), but nothing reconciles Part B (vii). See F2.
- **README section:**
  - Every clause matches the code.
  - It is not dated and does not cite the approval's file (N1).
  - It leaves the Notification section's line 195–196 untrue (F1).

**8. Out of scope.**
- `git diff --name-only` holds no `.github/`, package, lock or Cargo file (grep count 0).
- `git diff --stat origin/main...HEAD -- telegram.mjs cloud.mjs notify-telegram.mjs` is empty. The only existing hook file in the diff is hooks.test.mjs, and only by the exempted change.
- No token is read or printed, and no test sends (check 3).
- The fixture parses as JSON. Its keys are `session_id, transcript_path, cwd, hook_event_name, error, error_details, last_assistant_message`, and the four the script reads are strings. Its source is recorded in the form.

**9. What is not proven.** The form quotes the approval's item 6. `cmp` of form line 22 (without its `> `) against approval line 31 gave 0: byte for byte (sha256 of the line dfbfe176…d81a).

## Findings

All findings are sorted by `governance/AUTONOMY.md` §22's three verdicts.

### Correctness (blocking; words only, code otherwise closed)

**F1. `scripts/hooks/README.md:195-196`.** The current text reads `` `quota_auto_resume_stale|quota_auto_resume_disabled` — the two quota notification types and no other (AUTONOMY.md §38 (iv)) ``.
- After the merge this limit is untrue: settings.json:80 names three types.
- The appended section says nothing about the matcher.
- The line was written by a worker, not the human, so the worker can apply the words below with no re-gate.
- The Scope allows only an append to README, so the fix is an appended paragraph at the end of the new section, after :346:

  > The same approval (item 3) adds `quota_auto_resume_fired` to the Notification hook's matcher: it is now `quota_auto_resume_stale|quota_auto_resume_disabled|quota_auto_resume_fired`, three quota types. The **Matcher** paragraph of the Notification section above, which names two, reads so from this section's merge; it is not edited. Nor is the header comment of `notify-telegram.mjs`, which also names two: this piece changes no existing hook script (ADV-2026-11-18-22 item 3).

- Each clause checked:
  - The matcher value is settings.json:80.
  - "Names two": README:195 and notify-telegram.mjs:12–13.
  - "Not edited": cmpR=0, and the diff stat of notify-telegram.mjs is empty.
  - The ruling: ADV-2026-11-18-22 item 3 blocks a change to any existing hook script.

**F2. `governance/AUTONOMY.md:735`, Part B (vii).** The heading `**(vii) Nothing else is sent.**` is untrue once StopFailure sends (x).
- Part C (xii) reconciles (iv) but not (vii).
- Part B is the advisor's wording and Part C is the worker's draft. Neither is the human's, so the worker can apply the replacement with no re-gate.
- Replace AUTONOMY.md:743, the (xii) bullet, whole:

  > - **(xii) The third quota type, and what (iv) and (vii) now read.** The `Notification` entry's matcher is `quota_auto_resume_stale|quota_auto_resume_disabled|quota_auto_resume_fired`, so the human also hears when the app goes on by itself after a reset (approval item 3). From this part's merge, (iv)'s "the two quota notification types and no other type" reads as these three types, and (vii)'s "Nothing else is sent" excepts the StopFailure message of (x); neither line is edited.

- Each clause checked:
  - The matcher is settings.json:80.
  - Forwarding: notify-telegram.mjs:13–14 forwards whatever the matcher passes.
  - Both quoted spans are substrings of main's AUTONOMY.md :732 and :735. They quote the advisor's wording, not the human's; byte-check them before committing.
  - "Not edited": cmpA=0.
- Do not edit Part A: it is the human's rule.

### Evidence

None. Checks (a), (c) and (d) and both mutations are closed (checks 3 to 5).

### Documentation (must-fix before the merge)

**N1. `scripts/hooks/README.md:59` of the diff (README :333).** `Added by the human's approval of ADV-2026-11-18-06 (items 1 to 3; `AUTONOMY.md` §38 Part C). The` is undated and does not cite the approval's file. Your check 7 asks for both. ADV-2026-11-18-22 item 5 binds only §38, so this does not block. Replacement:

  > Added 2026-11-18 by the human's approval of ADV-2026-11-18-06 (items 1 to 3; `state/directives/2026-11-18-the-humans-message-adv-2026-11-18-06-approved-a-stop-failure-hook-that-tells-the-human-when-a-turn-ends-on-a-service-error.md`; `AUTONOMY.md` §38 Part C). The

  Reflow the rest of the paragraph as needed. The file is tracked on main.

**N2. `scripts/hooks/hooks.test.mjs:1431`.** The current comment reads `// The stop alarm (the human's approval of ADV-2026-11-18-25): the hook keys gain StopFailure and the matcher gains quota_auto_resume_fired.`
- The human's words (ADV-2026-11-18-25 item 1) are "Its name stays, because an earlier form claims it by name, with one comment line above it saying so."
- The comment says why the values changed, not why the name, which now says "two", stays.
- The comment is the worker's wording. Replacement, still one line:

  > `// The stop alarm (the human's approval of ADV-2026-11-18-25): the hook keys gain StopFailure and the matcher gains quota_auto_resume_fired; the name stays, though three quota types now match, because an earlier form claims this test by name.`

- Each clause checked: the keys at :1434, the matcher at :1437, and the earlier form's claim per ADV-2026-11-18-26 (row T6 of the three-alarms form).
- Procedure, for the custodian or advisor to decide: this is a second commit on that file, and Amendment 1 item 3 names one.

**N3. Check (d)'s evidence file.** `sfa-suite-c.txt` does not record the command or the exit code. The form's Amendment 2 asserts exit 0, which the counts (fail 0) agree with. For the closing amendment's head run, record `$?` in a file beside the run.

**N4. `scripts/hooks/notify-telegram.mjs:12-13`.** The comment "the two quota types only" becomes untrue at merge. The block on sight forbids the edit here, so this goes to the advisor. F1's words record it in the tree meanwhile.

**N5. Input without an `error` field.** Valid JSON that is not an object (`null`, `[]`), or an object without `error`, sends "Session stopped on an error: unknown (<basename>)". That is fail-safe and allowed by the approval, but neither the form nor the README states it. Add it to the README section if you want it recorded. It does not block.
