*Custodian's filing note (2026-11-15): the worker's report on PR #323 (the branch cut/advisor-questions-and-telegram-three-alarms at 917f66c86cab91597947dc1b7ba699fdf4e4d435), built under the form `governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`, from its hand-back (8727 bytes, sha256 d5e989f4999e91a1fd8740cae929c2266a279d5935a41e2248f92a065df51085), below the rule, byte for byte. Its brief by file (11036 bytes, sha256 ab2251433994879fdef1ee3404f7d9fab8fd00496c9bb6a251ad365ed23e6175); the run 2026-11-14T23:58:30Z to 2026-11-15T00:37:07Z by its transcript, 108 calls (Read 15, Bash 48, Grep 2, Edit 36, Write 6, SubagentHandback 1), model claude-sonnet-5-5. One call errored, not named in its report: an Edit of `scripts/hooks/questions-mirror.mjs` sent at 2026-11-15T00:01:08Z was refused at 00:01:10Z because the file had not been read in that run; it read the file at 00:01:13Z and made the Edit at 00:01:20Z. Its report's items 1 to 8, departures and observations, go to both gates.*

---

Built: advisor-questions-and-telegram-three-alarms at 917f66c86cab91597947dc1b7ba699fdf4e4d435

**Start state**
- HEAD bd5bcd09da885661266b3b7b46b707b3b46cb5fc, branch cut/advisor-questions-and-telegram-three-alarms, porcelain empty, ls-remote empty.
- `df -h /c`: 50G free on C:.
- The form on origin/main is 30685 bytes with sha256 bb2004529b53bdf3fdc77b464e91a10d8d329e4f3159397e82d34dc7cbfac14f, matching the brief. Its `git log` shows only bd5bcd09, so no later amendment.
- S0: `gh pr list --state open` returned `[]`. There were no branches to diff.
- Section 38 file `<S>/s38-nta.md`: 4377 bytes, sha256 fa5aaa81e820fa6a74e9e5408442b15c38904f4be895aba3a8f613a1bc15d759. Matches.

**Commits** (each has one Signed-off-by from `-s`; the message files were shown before commit)
- A: bcc20bba1f634b64632e0d2d6cd685e0ae4edb15, `feat: the Stop hook sends only the halt alarm; the Notification hook matches the two quota types`, committed 2026-11-15T01:09:13+01:00.
  - Files: `.claude/settings.json`, `governance/AUTONOMY.md`, `scripts/hooks/README.md`, `scripts/hooks/hooks.test.mjs`, `scripts/hooks/notify-telegram.mjs`, `scripts/hooks/questions-mirror.mjs`, `scripts/hooks/questions-mirror.test.mjs`, `scripts/hooks/stop-queue.mjs`.
- B: 917f66c86cab91597947dc1b7ba699fdf4e4d435, `test: record the mutation each new hook test was observed to fail on`, committed 2026-11-15T01:12:25+01:00.
  - Files: `scripts/hooks/hooks.test.mjs` and `scripts/hooks/questions-mirror.test.mjs` only. +8 comment lines, naming bcc20bba.

**What was built**
- `settings.json`: two Edit calls, both accepted. The PreToolUse key is removed, and the matcher is `quota_auto_resume_stale|quota_auto_resume_disabled`.
- `stop-queue.mjs`:
  - The step-6 send is gone.
  - `waitingSummary`, `waitingSetKey`, `notifyWaiting` and the `node:crypto` import are removed.
  - New `notifyHalt(projectRoot, text)`, deduped on `halt:${text}`; it is the default for the `notify` option.
  - The halt branch calls `notify(projectRoot, \`HALT: ...\`)` and reads no plan.
  - The halt stderr line, `checkHalt`, `leaseHeldBy`, `judgeContinuity` and `accountContinuation` are untouched.
- `AUTONOMY.md`: section 38 is appended by a Write-tool script, `<S>/nta-work/nta-append-s38.mjs`. It asserted the worktree file equals the origin/main blob and ends with one LF, then wrote those bytes, one LF, and the section file's bytes.
- The T8 command is the single-quoted literal of ruling item 3 (b).
- Comments or README only: `notify-telegram.mjs`, `questions-mirror.mjs`, `scripts/hooks/README.md`.
- New tests T1-T7 are in `hooks.test.mjs`, under the names the form's section 4 gives. T8 keeps its name in `questions-mirror.test.mjs`; M14 and M11 are unchanged and its own line sits beside them.
- Everything ran in dry run, with `env -u CUSTODIAN_TELEGRAM_BOT_TOKEN -u CUSTODIAN_TELEGRAM_CHAT_ID` before each `node --test`. Nothing was sent for real. No halt file was made outside a temp folder under `<S>`.

**Mutations**
Each was applied against A, run with `--test-name-pattern`, then reverted with `git checkout -- <file>`. `git diff` was 0 bytes after each revert. The first failing assertion is byte-copied from the test output.
- T1, the step-6 send restored. `AssertionError [ERR_ASSERTION]: no send was made`; the actual list held `[telegram dry-run] would send: Only human-blocked nodes remain.`.
- T2, the halt send behind a `waitingOnHuman.length` guard (old shape). `Expected values to be strictly deep-equal:` at `assert.deepEqual(calls, ...)`, `+ []` where `[[projectRoot, 'HALT: drill halt']]` was expected.
- T3, the waiting list appended to the halt text. `+ '[telegram dry-run] would send: HALT: drill halt\n' + 'Waiting on you (1 item(s), 10 min total)'` where `'[telegram dry-run] would send: HALT: drill halt'` was expected.
- T4, the halt send removed. `+ []` where `[ '[telegram dry-run] would send: HALT: drill halt' ]` was expected.
- T5, the step-6 send restored through `sendTelegramDeduped`. `AssertionError [ERR_ASSERTION]: [telegram dry-run] would send: Only human-blocked nodes remain.`. That is the stderr used as the message of the last `assert.equal(result.stderr.includes(DRY), false, ...)`.
- T6, run twice, each alone:
  - `idle_prompt` added to the matcher: `+ 'idle_prompt|quota_auto_resume_stale|quota_auto_resume_disabled'` where `'quota_auto_resume_stale|quota_auto_resume_disabled'` was expected.
  - The merge base's settings file restored (PreToolUse back): `+   'PreToolUse',` as an extra first key at the keys `deepEqual`.
- T7, the command's script path changed to `notify-telegramx.mjs`. `assert.equal(r.status, 0, r.stderr)` with message `Error: Cannot find module '...\scripts\hooks\notify-telegramx.mjs'`.
- T8, the `--hook` branch test inverted to `!==`. `Expected values to be strictly deep-equal:` at `assertQuiet`, `+ status: 1, - status: 0,`.

**Checks** (all exit 0; outputs under `<S>/nta-work/`)
- C1 run on the merge base: `TWO-PLACES-OK`, rc 0. C1 run on origin/main: `TWO-PLACES-OK`, rc 0. The hunks are `@@ -3,12 +2,0 @@` and `@@ -92 +80 @@`; numstat reads `1	13	.claude/settings.json`.
- C2: `LITERAL-OK`, rc 0. C3 with `<S>/s38-nta.md` as its argument: `S38-OK`, rc 0.
- Section 7 count, by its command and including README:
  - settings.json 14, README 39, hooks.test.mjs 152, notify-telegram.mjs 12, questions-mirror.mjs 4, questions-mirror.test.mjs 10, stop-queue.mjs 45. Total **276**, at most 300.
  - Code and tests, README excluded, settings.json included: **237**, at most 240.
  - AUTONOMY.md is +25 and outside the count; 8 files in all.
- Suites after B:
  - `verify-cites` rc 0 (PASS, 197 advisory).
  - `verify-quotes` rc 0, in a shared hold (PASS, 156 checked).
  - `verify-test-claims` rc 0 (808 claimed tests).
  - `verify.mjs --offline` rc 0 (PASS).
  - `forms-layout` rc 0 (PASS).
  - The `node --test` line rc 0, in a shared hold: 604 tests, 604 pass, 0 fail.

**Push and state**
- The push was a call of its own and succeeded as a new branch. origin's branch is 917f66c8, equal to HEAD, and porcelain is empty.
- Nothing is left running. My two background shells (the wait loop and the holds) exited on their own, and the holds were released.
- No PR action and no CI wait.

**Machine readings** (masked)
- Status 1: no `project=SpatialIDE` line; quiet=False average=34.1% peaks-over-25=51.
- verify-quotes hold: granted.
- Status 2: a `project=SpatialIDE` line was present; quiet=False average=43.8% peaks-over-25=60.
- I waited with a background loop, 60 s per turn, 90 minute timeout. It cleared after 1 turn: no `project=SpatialIDE` line; quiet=False average=31.6% peaks-over-25=60.
- node --test hold: granted.
- No exit 96-99.

**Departures and observations**
1. `notify-telegram.mjs` keeps its 79 lines. The form's section 2.3 allows a net loss of up to 3 lines to keep `:76` in range. But `ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:20` and `state/consults/2026-10-02-round-mirror-hook-architect-draft.md:29` cite `notify-telegram.mjs:76-79`. At 77 lines `verify-cites` failed with exactly those two. I added two comment lines so the file stays at 79, a net loss of 0. This is not invalidator I4. The form's section 7 list of highest cited lines omits that range.
2. `README.md` step 2 now also says what the halt alarm sends. The dedupe paragraph gains the sentence "A halt left in place sends again at a stop more than ten minutes after its last message."
3. In the halt branch, the old code swallowed any error from `notify`; now a throwing injected `notify` would propagate to `main()`'s catch. The production default `notifyHalt` catches its own errors. The form (2.2 (d)) asks for exactly this call shape.
4. T2 no longer touches `CUSTODIAN_PLAN_PATH`, since a halt reads no plan. This was done to fit the 240-line code-and-tests bound.
5. Commit A's body says "the comments of the two edited scripts", but three scripts had comment edits (stop-queue too). It is in a pushed message, so I left it.
6. I did not run `verify-cites` or `verify-quotes` between A and B. I ran `verify-cites` once before A, which showed the failure in item 1. The after-B run is the reported one.
7. Section 38 Part B, clause-checked by me against the code at 917f66c8; the gates still own this. (iv) the 80-character, ten-minute dedupe, (v) the halt text with no list, and (vii) no PreToolUse entry plus the mirror staying all match the code.
8. The harness reports my model as Sonnet 5.5 (claude-sonnet-5-5). I received and produced no context handoff.

Key paths:
- Worktree: C:/dev/wt/nta
- Form: C:/dev/wt/nta/governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md
- Mutation logs: `<S>/nta-work/nta-mut-T1.txt` to `nta-mut-T8.txt` (T6a, T6b)
