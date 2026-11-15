Reviewed: PR #323 at 917f66c86cab91597947dc1b7ba699fdf4e4d435 (the custodian's filing note, 2026-11-15: the reviewer, PLAN node advisor-questions-and-telegram-three-alarms, under its form (`governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`), one of its two gates from dispatch; its brief by file (11937 bytes, sha256 7443e5fa0b286a9805ee2ca15c40e533a2da12f0221913bf89abfb756e0ffcd3); the run 2026-11-15T01:29:05Z to 2026-11-15T01:54:40Z by its transcript, 83 calls (Bash 80, Read 2, SubagentHandback 1), model claude-opus-5-5; one Bash call exited 1, its rule (00) listing of port-2's and PR B's branches sent at 2026-11-15T01:42:53Z, whose last grep counted no match, as its check 9 gives; its outputs went to its scratch files, as it says, and the mutations it applied were reverted in the worktree, by its checks 6 and 12; the report gives no count of its calls; the report below, byte for byte, from its hand-back of 22969 bytes, sha256 06577caaa591e8e7c585689722656d3810f0c62a3c8b838910b9c49c36e880df, with this note added in its first line; its C-1 goes to the advisor with the architect's D1 to D4), gate reviewer
cut/advisor-questions-and-telegram-three-alarms @ 917f66c86cab91597947dc1b7ba699fdf4e4d435
Verdict: PASS WITH NOTES

Note marker: WORDS-ONLY (Part 1, item 2 of the 2026-11-05 directive). The one blocking finding is a single code-comment sentence. It is not the human's wording, and my replacement words are given below. The code's Correctness and Evidence are otherwise closed.

Brief: 11937 bytes, sha256 7443e5fa0b286a9805ee2ca15c40e533a2da12f0221913bf89abfb756e0ffcd3, both checked by script and matching. Packet: 3432 bytes, sha256 f646b54b821815149ebe313f30773b94ce9350b1f0d2f0a09d7072d373b09f17, both matching.

**A commit arrived during the gate (Part 1 item 5).** I fetched once, at the start. When I read it in check 2, origin/main was 92520343. By 01:34Z it read 87fb4a37 (the merge of #322), from a fetch at 01:33:12Z that I did not run, by the reflog. Its impact: `git diff --name-only 92520343 87fb4a37` names only `kernel/README.md`. The merge base of 87fb4a37 and HEAD is still bd5bcd09. The settings file and the form are the same at both commits, so C1 against origin/main holds at either one. The item-6 overlap, recomputed against 87fb4a37, is 0.

## Findings

### Correctness (blocking, words only)
**C-1. A comment claims a guarantee the code does not hold.** It is at `scripts/hooks/notify-telegram.mjs` lines 20-21 at H. The sentence reads (byte-copied): "A failed send" / "never changes anything: this hook's exit code and stderr are ignored."
- What is true: `sendTelegramDeduped` writes the dedupe key before it sends (`scripts/hooks/telegram.mjs:262-268`), and nothing undoes that write when the send fails.
- So after a failed send (an HTTP error, a network error or a timeout), a repeat of the same quota notification within ten minutes is not sent (`telegram.mjs:258-261`).
- An operator can see this in ordinary use: a network blip during a usage-limit alert holds back the next one for ten minutes.
- This is the worker's sentence, not the human's. It was added to keep the file at 79 lines (report item 1). The worker applies the replacement with no re-gate, and the PR body lists it.

Replacement for line 21 only. Line 20 stays as it is, so the file keeps 79 lines and the `notify-telegram.mjs:76-79` cites stay in range. The new line is 94 columns, measured by awk:
`// changes no decision, and its key is still recorded: a repeat within the window is not sent.`

Clause check against the code:
1. "A failed send changes no decision": the hook decides nothing. `main()` exits 0 on every path (`notify-telegram.mjs:63, 73`), and the quoted contract says its exit code and stderr are ignored (lines 8-10).
2. "its key is still recorded": `telegram.mjs:264` writes `{ ...sent, [key]: now }` before `sendTelegram` at :268, and nothing writes after the send.
3. "a repeat within the window is not sent": `telegram.mjs:258-261`. `notify-telegram.mjs:68` passes no `windowMs`, so `DEDUPE_WINDOW_MS` (10 min, `telegram.mjs:36`) applies.
- Case for the source comment, not blocking: if the dedupe write itself fails (`telegram.mjs:265-267`, "sending anyway"), no key is recorded. That needs a disk-write failure, not ordinary use.

### Evidence
None.

### Documentation (must-fix before the merge)
None.

### Observation (not findings)
- **O-1. T7 and §4's row.** §4's T7 row says the mutation alters the command's path "in a scratch copy of the settings". The worker's script instead edited the worktree's tracked `.claude/settings.json` (`nta-mutate.mjs` T7 entry). T7 reads the repository file, so a scratch copy could not fail it. This is a branch worktree, not the main checkout, so §8 item 2 is not touched. The report does not name this departure.
- **O-2. The T3 mutation is synthetic.** It appends a constant text (`\nWaiting on you (1 item(s), 10 min total)`) rather than a list derived from the plan. T3 still fails on any appended text.
- **O-3. T2 does not test a plan that loads with nobody waiting.** T2 drives "nothing waits" with no plan at all, as S2 declares. A loaded plan with an empty waiting set is not driven. T4 also has no plan.
- **O-4. The comment marker differs from the form.** The eight new comments use `// RECORDED MUTATION, observed at …` (comma). §4 names `// RECORDED MUTATION:` (colon). The repository already has 5 comma-form comments, and no tool keys on either form.
- **O-5. For the advisor, on Part B (iv) and (v), not an untrue clause.** "A repeat … within ten minutes is not sent" holds per project root: the dedupe file is `<CLAUDE_PROJECT_DIR>/.claude/state/telegram-sent.json` (`telegram.mjs:230`). Two sessions with different project roots would each send an origin/main halt once.
- **O-6. "It adds no state."** The comment at `stop-queue.mjs:167` matches the sense of ruling item 2(a): no new state mechanism. Each distinct halt text still adds a key to the existing `telegram-sent.json`.
- **O-7. README "fires for every session, lease or not".** The README step 2 sentence (`scripts/hooks/README.md` lines 63-65 at H) excludes `CUSTODIAN_STOP_HOOK=off` and cloud sessions only by context: step 1 and the cloud paragraph, both in the same README.

## Checks

**1. Start.**
- HEAD is 917f66c8…, the branch is `cut/advisor-questions-and-telegram-three-alarms`, and the porcelain is 0 bytes. Each command exited 0.
- `ls-remote` gives 917f66c86cab91597947dc1b7ba699fdf4e4d435 (rc 0).
- `df`: C: 51G available (90% used), D: 376G available.
- `git fetch -q origin` rc 0.

**Read first.**
- The form at origin/main: 30685 bytes, sha256 bb2004529b53bdf3fdc77b464e91a10d8d329e4f3159397e82d34dc7cbfac14f. It is identical at H.
- ADV-2026-11-14-24: 13818 bytes, sha256 e4ae2c74…a79c. ADV-2026-11-14-23: 5898 bytes, sha256 599cffea…bc9d.
- ADV-2026-11-13-04: the form's two Authority pins recompute (:7 → 4ea80876…0053; :19-26 → b64de5c9…1608 @ f47a2ad9).
- I read the worker report on main (9767 bytes) and Part 1 items 1-9.

**2. The diff.**
- `git diff B′...H` is 33533 bytes, sha256 baa33261…b748, equal to the packet's patch.
- Numstat (rc 0): settings 1/13, AUTONOMY 25/0, README 21/18, hooks.test 136/16, notify-telegram 6/6, questions-mirror 2/2, questions-mirror.test 2/8, stop-queue 9/36. These are the eight files of §7 and nothing else. The commits are A (parent B′), then H (parent A).
- §7's own command (rc 0): 276 lines in all (bound 300); 237 without the README (bound 240).
- ADV-2026-11-14-21 item 6: the PR's paths changed on main since B′, by `comm -12`: 0, both at 92520343 (15 names) and at 87fb4a37 (16 names).

**3. C1, C2, C3.** Each was extracted from the form's §9 lines 190, 195 and 199 by `sed` and run from `<W>`.
- C1 on the merge base: rc 0, `TWO-PLACES-OK`.
- C1 with `'origin/main'` in place of the merge-base expression: rc 0, `TWO-PLACES-OK`.
- Hunks `@@ -3,12 +2,0 @@` and `@@ -92 +80 @@`. Numstat `1	13	.claude/settings.json`, the same against origin/main.
- C2: rc 0, `LITERAL-OK`.
- C3: rc 0, `S38-OK`, with `<S>/s38-nta.md` as its argument (4377 bytes, sha256 fa5aaa81…5e759, LF endings; equal to §2.6).
- I also compared the section file with the ruling's fence:
  - lines 1-4 equal fence lines 45-48;
  - lines 14-24 equal fence lines 52-62;
  - the byte copy (lines 8-12) is `cmp`-equal to the directive's lines 9-13 at 3fe9f97d, the commit that added it (`git log --diff-filter=A`);
  - the span hash recomputes to 21a0a580b45670e600d34357a6890593d5f308d8d09d27721fa612d85f53010b, as Part A's pin states.

**4. The code at H.**
- §2.1: holds, by C1. Settings at H has 91 lines, Notification at lines 78-89.
- §2.2, all holding:
  - (a) the step-6 call is gone; the stderr line stays at :337;
  - (b) the three functions and the `node:crypto` import are gone (grep count 0);
  - (c) `notifyHalt` at :168-174, the key `halt:${text}`, with try/catch;
  - (d) the halt stderr line :287 is unchanged, and :289 is `await notify(projectRoot, \`HALT: ${halt.message || 'stop-hook halted'}\`)` with no plan read;
  - (e) `notify = notifyHalt` at :273;
  - (f) the step-6 header at :28-30 and the reason clause at :56;
  - (g) no hunk touches `checkHalt`, `leaseHeldBy`, `judgeContinuity`, `accountContinuation`, steps 4/5/7/8, `main` or the cloud guard.
- §2.3: comments only; 79 lines before and after; lines 76-79 are byte-equal to B′'s.
- §2.4: comments only in the mirror. T8 holds the literal at `questions-mirror.test.mjs:299`. M14 and M11 are unchanged.
- §2.5: the four passages reworded. §2.6: holds, by C3.
- §2.7: `telegram.mjs`, the fixture, `cloud.test.mjs`, `PLAN.yaml` and AI_DEVELOPMENT are unchanged (empty diff stat).
- §2.8 seams:
  - stop-queue → `sendTelegramDeduped(key, text, {projectRoot, windowMs})` matches `telegram.mjs:251`, proven end to end by T4 through the CLI;
  - settings Notification → stdin `notification_type`/`message`: T7;
  - the `notify` spy in `rotate-cut-state.test.mjs:211, 233, 249` is unedited and passes (in the suite);
  - `leaseHeldBy` is still exported and the mirror suite passes;
  - `notifyHalt` is not exported, and its product caller is `main()` → `decide` (:388).

Scenarios against tests (lines at H in `hooks.test.mjs`):
- T1/S1 (:413-428): drives `decide` with a held lease and the human-only plan. It asserts allow, `/waiting on human/`, no dry-run line, and no `telegram-sent.json`. It fails if a send is restored (observed).
- T2/S2 (:433-444): a local halt `drill halt\n`, no plan, a spy `notify`. It asserts allow, stderr `HALT: drill halt`, and exactly one call `[projectRoot,'HALT: drill halt']`. Observed failing.
- T3/S3 (:447-461): the halt plus the human-only plan, the default notify. It asserts exactly one dry-run line equal to the HALT line, and no `Waiting on you`. Observed failing.
- T4/S4 (:474-482): the shipped CLI, spawned with dry run. It asserts status 0, empty stdout, exactly one dry-run line, and the HALT line on stderr. Observed failing.
- T5/S5 (:486-495): the CLI with a held lease and the plan. It asserts status 0, empty stdout, waiting on human, and no dry-run text. Observed failing.
- T6/S6 (:1431-1441): the key order, no PreToolUse, one Notification entry, the matcher, the hooks array deepEqual (the command unchanged, timeout 15), and no `questions-mirror.mjs`. It fails by the worker's logs.
- T7/S7 (:1444-1464): the settings command through Git's bash in a temp project with copies of `scripts/hooks/*.mjs`, the quota payload, dry run. It asserts status 0, one dry-run line, and the type in the line. It fails by the worker's log.
- T8/S8 (`questions-mirror.test.mjs:298-321`): the literal command, the hook shell, the fixture. `assertQuiet`, round-7/round-8, the body and one dry-run line are unchanged from f47a2ad9. It reads neither settings nor a commit: its only git call is `git --exec-path`, to locate bash. Observed failing.

§8 items:
1. Holds, by C1 on both bases.
2. Holds. The diff's only `.claude/` path is `settings.json`. The main checkout's `.claude/` porcelain is 0 bytes and its working settings equal origin/main (`git diff --quiet` rc 0). No Guardian or mod path is in the diff.
3. Holds: :287 and `checkHalt` :115-146 are unchanged, and the order of override then halt is kept (:282-286).
4. Holds: :336-340, with T1 and T5.
5. Holds: :289, with T2 and T4.
6. Holds. The Telegram senders in `scripts/` are only stop-queue (halt), notify-telegram (quota, by the matcher) and questions-mirror (no settings entry).
7. Holds: no hunk touches those functions.
8. Holds: :273.
9. Holds. The only added two-hour text is Part A's byte copy (the human's rule) and (vi) "Nothing sends this alarm yet".
10. Holds: the AUTONOMY hunk is `@@ -709,3 +709,28 @@`, a pure append, proven by C3.
11. Holds: Part A is pinned and hash-recomputed, and no other added line is marked verbatim.
12. Holds: the script, its test and its fixture are present at H (`git ls-tree`).
13. Holds: CI is all green (check 11).
14. Holds, by C2 and the T8 code.
15. Holds, by C3.

**5. §38 Part B, clause by clause at H.**
- (i) True. §16 (AUTONOMY:274) and Appendix A3 (:458) are unedited; the diff only appends.
- (ii) True. The named passages exist: §3 steps 2 and 4 name Telegram (:89, :91), §4 (:99), §24's notice clause (:474), §28 (:502), and AI_DEVELOPMENT §L (its line 664). None is edited.
- (iii) True.
  - `telegram.mjs` imports `node:https` and sends by `https.request`.
  - Token and chat id are read from `process.env` only (:40-41 and in `sendDocument`), never logged.
  - When either is unset it returns `skipped` (:49-54), and `sendDocument` does the same.
- (iv) True.
  - The matcher at settings:80.
  - The command at :84 runs `notify-telegram.mjs`: one `sendTelegramDeduped` call (:68).
  - The key is the type plus `message.slice(0, 80)` (:37-40), and the window is 10 min. For scope, see O-5.
- (v) True.
  - The text comes from `firstLineOf` (trimmed) of the local file or the origin/main file (:120, :142), or `stop-hook halted` when it is empty (:289).
  - No plan is read and nothing is appended.
  - The key is `halt:${text}`, with a 600000 ms window (:56, :170).
- (vi) True: no code sends it. PLAN node `advisor-silence-two-hour-alarm` exists on origin/main and on the branch.
- (vii) True.
  - Step 6 sends nothing (:336-340).
  - Settings has no `PreToolUse`, and its commands are stop-queue, precompact-flush, session-resume and notify-telegram.
  - The mirror, its test and its fixture are in the tree. "The custodian does not run it" is about conduct and is not checkable against code.
- (viii) About custodian conduct; no code to check it against.
- No clause is untrue.

**6. Mutations, each applied by `node <S>/mut-323.mjs T<n>`.**
- That script is 1317 bytes, sha256 f13ff64a…bd7d. It wraps `nta-mutate.mjs` (sha256 8bc8487e…119e).
- Each apply exited 0 and printed `APPLIED T<n> <file>`.
- Each test was run alone with `env -u CUSTODIAN_TELEGRAM_BOT_TOKEN -u CUSTODIAN_TELEGRAM_CHAT_ID node --test --test-name-pattern …`.
- After each revert I ran the test again; the diff was 0 bytes each time.

- **T1.** The diff adds `+    await notify(projectRoot, 'Only human-blocked nodes remain.');` after the step-6 stderr push in `stop-queue.mjs`. That matches §4's row (the step-6 send restored).
  - Test rc 1, tests 1, fail 1: only `stop-queue: the human-blocked-only allow sends no Telegram message`.
  - First failure, at `hooks.test.mjs:425:12`: `AssertionError [ERR_ASSERTION]: no send was made` / `+   '[telegram dry-run] would send: Only human-blocked nodes remain.'` / `- []`.
  - Revert: `git checkout -- scripts/hooks/stop-queue.mjs` rc 0; rerun rc 0 (pass 1); diff 0 bytes.
- **T2.** The diff replaces line 289 with `try { const { waitingOnHuman } = deriveStates(loadPlan(resolvePlanPath(projectRoot))); if (waitingOnHuman.length > 0) await notify(…) } catch { // plan unavailable }`. That matches the row (the shape at main).
  - Test rc 1, fail 1: only `stop-queue: a halt sends the HALT line once when nothing waits on the human`.
  - First failure, at `hooks.test.mjs:443:10`: `AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:` / `+ []` / `-   [` `'<tmp>\\stop-halt-send-9n2Xlv',` `'HALT: drill halt'` `]`. I masked the temp path.
  - Revert rc 0; rerun rc 0 (pass 1); diff 0 bytes.
- **T3.** The diff changes `notifyHalt`'s text argument to `` `${text}\nWaiting on you (1 item(s), 10 min total)` `` (see O-2).
  - Test rc 1, fail 1: only `stop-queue: a halt with human-blocked nodes sends the HALT line without the waiting list`.
  - First failure, at :457:12: `+   '[telegram dry-run] would send: HALT: drill halt\n' +` / `+     'Waiting on you (1 item(s), 10 min total)'` / `-   '[telegram dry-run] would send: HALT: drill halt'`.
  - Revert rc 0; rerun rc 0; diff 0 bytes.
- **T4.** The diff removes `-    await notify(projectRoot, \`HALT: ${halt.message || 'stop-hook halted'}\`);`. That matches the row.
  - Test rc 1, fail 1: only `stop-queue CLI: a halt sends one HALT message through the shipped entry`.
  - First failure, at :481:10: `+ []` / `- [` `-   '[telegram dry-run] would send: HALT: drill halt'`.
  - Revert rc 0; rerun rc 0; diff 0 bytes.
- **T5.** The diff adds `+    await sendTelegramDeduped('waiting:x', 'Only human-blocked nodes remain.', { projectRoot, windowMs: TELEGRAM_DEDUPE_WINDOW_MS });` at step 6. That matches the row.
  - Test rc 1, fail 1: only `stop-queue CLI: the human-blocked-only allow sends nothing through the shipped entry`.
  - First failure, at :494:10: `AssertionError [ERR_ASSERTION]: [telegram dry-run] would send: Only human-blocked nodes remain.` … `true !== false`.
  - Revert rc 0; rerun rc 0; diff 0 bytes.
- **T8.** The diff in `questions-mirror.mjs` is `-  if (process.argv[2] === '--hook') {` / `+  if (process.argv[2] !== '--hook') {`. That matches the row.
  - Test rc 1, fail 1: only `the_settings_command_mirrors_a_recorded_askuserquestion_payload`.
  - First failure, at `assertQuiet` (`questions-mirror.test.mjs:136:35`, called from :315:3): `+   status: 1,` / `-   status: 0,`.
  - Revert rc 0; rerun rc 0; diff 0 bytes.
- **No mutation survived.**

**T6a, T6b, T7: judged from the worker's logs, read only.** Each log shows a 1-test run, fail 1.
- T6a fails at :1430 (`+ 'idle_prompt|quota_auto_resume_stale|quota_auto_resume_disabled'`).
- T6b fails at :1427 (`+   'PreToolUse',`).
- T7 fails at :1453 (`Cannot find module '…\scripts\hooks\notify-telegramx.mjs'`, `1 !== 0`).
- Their failure lines (1425/1437 for the test starts) are commit A's numbering; at H the tests start at 1431/1444. The logs' mtimes (00:10:44Z-00:11:07Z) fall between A (00:09:13Z) and H (00:12:25Z). So the runs were at A, where `HEAD~1` = B′, and T6b's restore was a real mutation. Run at H, the same script would restore A's file, a no-op (packet flag 5).
- What the logs do not show:
  - the applied diff (it went to the worker's console, not the log);
  - the revert, and the empty diff after it;
  - that the test code then equalled H's apart from comments (it does, by H's diff: comment lines only).

**7. The RECORDED MUTATION comments** at H: `hooks.test.mjs` :387, :421, :435, :462, :474 and :496, the T6 and T7 comment lines, and `questions-mirror.test.mjs:297`.
- Each names bcc20bba, the change and the first failing assertion.
- For T1-T5 and T8 they match what I observed at H.
- For T6 and T7 they match the worker's logs.
- T3's comment omits the `[telegram dry-run] would send: ` prefix in its paraphrase; it is not marked verbatim.

**8. Suites, from `<W>`.**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, in a shared hold: rc 0, tests 604, pass 604, fail 0. The eight piece tests and the rotate-cut-state, guardian-parity and cloud tests all pass.
- verify-cites: rc 0, PASS, 3055 files, 197 loose advisories. None names a PR path.
- verify-quotes, in a shared hold: rc 0, PASS, 156 checked, 125 verified, 30 baselined, 1 advisory, 933 ruling cites resolved.
- verify-test-claims: rc 0, PASS, 808 claimed tests across 266 files.
- `verify.mjs --offline`: rc 0, PASS.
- forms-layout: rc 0, PASS, 230 files.

**9. Rule (00).**
- `C:/dev/wt/p2` (branch `cut/port-2-macos-l1-and-app-dirs`, 83d2ecef): 15 names, 0 under `.claude/`, `scripts/hooks/` or `governance/AUTONOMY.md`.
- `C:/dev/wt/m4b` (`cut/b1-shell-half-pr-b`, 31cf0e22): 49 names, 0.
- The same two branches by origin ref: 0 each.

**10. The packet's flags.**
1. The report's items 1-8:
   - (1) This is within §2.3: "at most 3" includes 0. Lines 76-79 are byte-equal to B′'s, so the two cites still resolve. The added padding sentence is C-1.
   - (2) The README sentence is true of the code (`telegram.mjs:258-268`, `stop-queue.mjs:289`). It restates ruling item 2(b)'s words without quotation marks and is not presented as a quote. That is acceptable.
   - (3) A thrown error now escapes `decide` only when a test injects a throwing `notify`. `main()` never injects one, and `notifyHalt` catches (:169-173). If one did escape, `main()`'s catch still allows (:389-392). The `rotate-cut-state` spy never throws and passes unedited. This is not a defect, and §2.2(d) asks for this call shape.
   - (4) This is consistent with S2 ("no plan"); S3 is T3's scenario, which still sets the plan (O-3).
   - (5) "the comments of the two edited scripts" can be read as the two comment-only scripts. The message is pushed, and nothing is to be done.
   - (6) Both tools pass at H (check 8).
   - (7) Agreed (check 5).
   - (8) Noted.
2. The refused Edit was the harness's read-before-edit precondition. It was not a Guardian refusal, so it is not invalidator I3. The report does not claim zero errors, and the filing note discloses it.
3. See check 5: no untrue clause.
4. See check 4: all 15 hold.
5. See check 6.
6. See check 9.

**11. CI**, read at 2026-11-15T01:44:24Z by `date -u`. `gh pr checks 323` rc 0, all pass. Each run's head sha, by `gh run view`:
- 43659023367 (Governance CI, push): 917f66c8, success;
- 43660461301 (Governance CI, pull_request): 917f66c8, success;
- 43660461319 (DCO, pull_request): 917f66c8, success;
- 43660461287 (Exposure scan, pull_request): 917f66c8, success;
- 43659023369 (Ported notices, push): 917f66c8, success;
- 43660461285 (Ported notices, pull_request): 917f66c8, success.
The jobs: the cfg boundary job twice, signed-off, no profile path, ported-notices twice, and the test · verify:plan · queue/site drift job twice.

**12. End.** HEAD 917f66c86cab91597947dc1b7ba699fdf4e4d435; porcelain 0 bytes; `df`: C: 51G available, D: 376G available.

## Machine
- Status 1: no `project=SpatialIDE` line; quiet=False average=35.2% peaks-over-25=60.
- Hold 1 (node --test): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> …`, then `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`. The wrapper exited 0.
- Status 2: no `project=SpatialIDE` line; quiet=False average=32.7% peaks-over-25=60.
- Hold 2 (verify-quotes): `MACHINE_HOLD shared project=SpatialIDE … also=<m> …`, then `MACHINE_RELEASED …`. Exit 0.
- No exit code 96-99, and no MACHINE_WAITING or MACHINE_ERROR line.

## Background shells
I started three, and all have exited, by their completion notifications:
- buna3t4cb (hold 1);
- b1wd80pe1 (hold 2);
- ba3xfw5s8 (a bounded wait loop of 120 turns × 2 s that the harness moved to the background; it ended on its own).
None is still running and none needed killing.

## Model
Claude Opus 5.5 (claude-opus-5-5), as the harness reports it.

Files I read for this gate: `C:/dev/wt/nta/scripts/hooks/notify-telegram.mjs`, `C:/dev/wt/nta/scripts/hooks/telegram.mjs`, `C:/dev/wt/nta/scripts/hooks/stop-queue.mjs`, `C:/dev/wt/nta/scripts/hooks/hooks.test.mjs`, `C:/dev/wt/nta/scripts/hooks/questions-mirror.test.mjs`. My scratch outputs are `<S>/g323r-*` (for example `<S>/g323r-suite.txt`, `<S>/g323r-quotes.txt`, `<S>/g323r-mut-T1.txt` … `<S>/g323r-mut-T8.txt`).
