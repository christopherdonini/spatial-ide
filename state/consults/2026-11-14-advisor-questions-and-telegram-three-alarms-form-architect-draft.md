*Custodian's filing note (2026-11-14): the architect's draft of the full form for the docs lane's `advisor-questions-and-telegram-three-alarms`, placed by the advisor's ruling ADV-2026-11-14-23 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-23-the-notifications-piece-starts-now-in-the-docs-lane-ahead-of-advisor-session-merges-full-form-both-gates-open-items-to-the-advisor.md`), from its brief by file (9469 bytes, sha256 dc860094426213ce8826e3043d5b14675188bde90ed79ef55f74dab4b017ff40), read only at main f47a2ad9. Dispatched at 2026-11-14T21:37:12Z by its transcript; handed back at 2026-11-14T21:50:32Z (claude-opus-5-5; calls Read 43, Grep 34, Glob 6 and the hand-back, 84 in all; none errored; no write). The draft below was extracted by script from the hand-back in that transcript (39641 bytes, sha256 0e53d6ef68cab3db68ad51ae16040c36ef809679570312d91350ed27bf93136f) and is unchanged. Its `sha256:<custodian>` placeholders are filled by script when the form is committed, not here. The custodian's notes, not the draft: under ADV-2026-11-14-23 item 3 (b) its OPEN items go to the advisor in one packet and none is taken on the drafter's recommendation; the parts the draft marks reserved come back, if at all, as drafts for the human.*

Draft: advisor-questions-and-telegram-three-alarms, full form, architect — read at main @ f47a2ad90f69dfa02f63636887d0402862c03edd

I read the main checkout's working tree. The session-start status showed HEAD at f47a2ad9 with no tracked file modified; I could not run git to confirm it. I have no shell, so this report gives no sha256 anywhere: every `sha256:<custodian>` below is for the custodian to compute. I leave no background shell. Below, F stands for f47a2ad90f69dfa02f63636887d0402862c03edd only inside my own prose. Every cite is written out in full. A code block marked "copied" is text copied from the Read tool's output at F, not hashed. Everything else is my own words.

---

## THE FORM (template shape; path `governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`)

# Questions to the advisor; Telegram keeps three alarms — full preregistration (PLAN node `advisor-questions-and-telegram-three-alarms`)

**Authority.**
- The human's message of 2026-11-13 (06:57Z), items 1 to 4: `state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md:9-15 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
- ADV-2026-11-13-04, approved by the human and the human's words by that approval: `state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:7 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>` and `…:19-26 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
- The grant, items 4 (c) and 5: `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:19-33 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
- The placement is the advisor's ruling ADV-2026-11-14-23, items 1 to 6, under the delegation of 2026-11-13. It is never the human's words, and it is cited at its filed path under `state/directives/` (custodian: file it first; see note N1).
- Reuse index (`node tools/reuse.mjs`, run by the custodian in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c): three misses, each exit 1, for "claude code hooks settings notification matcher", "telegram alert notification hook" and "stop hook queue message". No prior art is recorded.

**Drafted by** the architect agent, read only, on the custodian's brief, at main f47a2ad90f69dfa02f63636887d0402862c03edd. Nothing was run and no hash was computed.

**Committed before any code**, on main by the custodian. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full, from dispatch** (§21a, the security-posture head: `governance/AUTONOMY.md:321-322 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`; ADV-2026-11-14-23 item 3 (a)). The piece is also over §21c's bound (§7). Both gates apply: the architect and the reviewer must each reach an affirmative PASS. §25 (e) means no five-line form is used. §36 does not apply: the piece is a docs-lane piece and is not on the filler queue.

### §0. Disclosure
- **Reasoned from code at f47a2ad9; nothing was run.** The piece relies on these parts of the code:
  - The settings file, whole: `.claude/settings.json:1-103 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
  - The Stop hook's halt branch: `scripts/hooks/stop-queue.mjs:305-319 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
  - Its waiting-list sender: `scripts/hooks/stop-queue.mjs:168-194 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
  - Its step 6: `scripts/hooks/stop-queue.mjs:361-367 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
  - Its injectable `notify` option: `scripts/hooks/stop-queue.mjs:293 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
  - The send primitive and its dedupe: `scripts/hooks/telegram.mjs:39-54 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>` and `scripts/hooks/telegram.mjs:251-270 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
  - The Notification script's input and message: `scripts/hooks/notify-telegram.mjs:30-40 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>` and `scripts/hooks/notify-telegram.mjs:56-74 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
  - The mirror's import of the lease reader: `scripts/hooks/questions-mirror.mjs:31 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`.
- **A finding at main.** The halt alarm is not sent when nothing waits on the human. The halt branch passes its headline to the waiting-list sender, which returns at once on an empty list. When it does send, it appends the waiting list. `governance/AUTONOMY.md:89 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>` promises "one Telegram message (§16)" on every halt. This piece closes that gap under OPEN-1.
- **Hypotheses, each with its discriminator:**
  - H1: Claude Code runs the Notification hook only for the types its matcher lists (Appendix B, `governance/AUTONOMY.md:449 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>` and `:453 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`). Discriminator: the human receives no `idle_prompt`, `permission_prompt` or `agent_needs_input` alert in a session that has loaded the merged file.
  - H2: `quota_auto_resume_stale` and `quota_auto_resume_disabled` are the notifications sent when a usage limit stops a session. The human's item 3 names them that way; Appendix B lists the names without a description. Discriminator: the first live usage limit after the merge.
  - H3: a running session picks up the changed file. Appendix B is silent on this. ADV-2026-11-14-23 item 6 (a) has the advisor answer the human; item 6 (b) has the custodian report what its session showed.
- **Not read:** user-level settings, which are outside the repository. `.claude/settings.local.json` was grepped and not read whole: it holds none of `hooks`, `Notification`, `PreToolUse`, `telegram` or `idle_prompt` (count 0).

### §1. What this preregistration may and may not claim
- **May claim:**
  - the settings text differs from main in ADV-2026-11-13-04's two places only;
  - the Stop hook sends no waiting-list message;
  - the Stop hook sends the halt line on every halt;
  - the quota command forwards a quota payload once (dry run);
  - the governing text in §38.
- **May not claim:**
  - that idle alerts stopped (H1), until the human observes it after the merge;
  - that a usage limit raises the quota alarm (H2);
  - that the custodian's session has loaded the new entries (H3);
  - that the two-hour alarm is sent. Nothing sends it at the merge (§2.7).
- No ADR is cited or amended. Nothing touches the wire or `docs/08`. No user-visible app string changes.

### §2. The change
- **2.1 `.claude/settings.json`: ADV-2026-11-13-04 item 1, exactly.**
  - The PreToolUse key and its single entry, lines 3-14, are removed.
  - Line 92's matcher becomes `quota_auto_resume_stale|quota_auto_resume_disabled`.
  - Nothing else in the file changes. The worker edits it in its worktree only, never in the main checkout.
- **2.2 `scripts/hooks/stop-queue.mjs`:**
  - (a) The step-6 call `await notify(projectRoot, waitingOnHuman, 'Only human-blocked nodes remain.');` is removed. The stderr line `allow: no unblocked node is ready; <n> waiting on human.` stays.
  - (b) `waitingSummary`, `waitingSetKey` and `notifyWaiting` are removed, and so is the `node:crypto` import, whose only use is `waitingSetKey`.
  - (c) A new `notifyHalt(projectRoot, text)` calls `sendTelegramDeduped(\`halt:${text}\`, text, { projectRoot, windowMs: TELEGRAM_DEDUPE_WINDOW_MS })` and catches as `notifyWaiting` did.
  - (d) The halt branch keeps its stderr line byte for byte and calls `await notify(projectRoot, \`HALT: ${halt.message || 'stop-hook halted'}\`)`, with no plan read. The headline text is main's, byte for byte.
  - (e) `decide`'s option keeps the name `notify`, with `notifyHalt` as the default (see the seam row in §2.8).
  - (f) The header comment for step 6 and `TELEGRAM_DEDUPE_WINDOW_MS`'s reason clause are reworded to match.
  - (g) The following are not touched: `checkHalt`, the order of the override and the halt check, `leaseHeldBy` (still exported, because `questions-mirror.mjs:31` imports it), `judgeContinuity`, `accountContinuation`, steps 4, 5, 7 and 8, `main`, and the cloud guard.
- **2.3 `scripts/hooks/notify-telegram.mjs`:** comments only. Lines 12-14 name the two quota types and §38. Lines 18-21 drop "the same primitive the Stop hook's own waiting-items notice uses". The net line loss is at most 3, so that `notify-telegram.mjs:76` stays in range for verify-cites. The code is unchanged (OPEN-8).
- **2.4 `scripts/hooks/questions-mirror.mjs`:** comments only. Lines 20-21 say that no settings entry runs hook mode since this piece, citing §38. The code is unchanged (OPEN-3).
- **2.5 `scripts/hooks/README.md`:** these passages are reworded to say what the code does after the change:
  - Stop step 2's notice sentence (lines 63-65);
  - step 6 (lines 84-86);
  - the Notification matcher paragraph and the dedupe sentence (lines 196-207);
  - the Question round mirror section (lines 232-286): its obligation is retired by §38, and its PreToolUse entry no longer exists.
- **2.6 `governance/AUTONOMY.md`:** one section, §38, appended after line 711. Nothing above it changes. The draft text is under OPEN-5.
- **2.7 Stays, unchanged:**
  - `scripts/hooks/telegram.mjs`;
  - `scripts/hooks/fixtures/pretooluse-askuserquestion.json`;
  - `scripts/hooks/cloud.test.mjs`;
  - every other hook script;
  - §16, Appendix A3, §4 and §28 in place;
  - `governance/AI_DEVELOPMENT.md` (OPEN-6);
  - `PLAN.yaml` on the branch (the custodian's PLAN edits are made on main).
  - The two-hour alarm has no sender in this piece. It goes to a follow-up (OPEN-4).
- **2.8 Seams (each consumer's interface as it is at f47a2ad9):**

| Seam | Consumer's real interface | End-to-end proof |
|---|---|---|
| stop-queue → telegram | `sendTelegramDeduped(key, text, {projectRoot, windowMs})` (telegram.mjs:251) | T4 |
| settings Notification command → notify-telegram | stdin `notification_type`, `message`, `title`, `cwd` (notify-telegram.mjs:30-34) | T7 |
| `decide`'s `notify` option → `scripts/plan/rotate-cut-state.test.mjs` | a spy `async (...a)`; asserts no call on non-halt paths (`scripts/plan/rotate-cut-state.test.mjs:211 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>` and `:252 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:<custodian>`) | that file passes unedited |
| questions-mirror → `leaseHeldBy` | named export | questions-mirror.test.mjs passes |

The `notify` option's product caller is its default, which `main()` reaches by calling `decide` without the option. The spy is the only other caller, and it is a test caller.

### §3. Fixtures / scenarios (outcomes declared before the run)
- **S1:** a held lease and `two-nodes-human-only.yaml`. Outcome: allow, the stderr says "waiting on human", no `telegram-sent.json` is written and no dry-run send happens.
- **S2:** a local `state/CUSTODIAN-HALT` holding `drill halt` and no plan. Outcome: allow; stderr `HALT: drill halt`; one send of exactly `HALT: drill halt`.
- **S3:** S2 plus `CUSTODIAN_PLAN_PATH=two-nodes-human-only.yaml`. Outcome: one send of exactly `HALT: drill halt`, with no `Waiting on you`.
- **S4:** S2 through the shipped CLI in dry run. Outcome: exactly one stderr line `[telegram dry-run] would send: HALT: drill halt`, and empty stdout.
- **S5:** S1 through the shipped CLI in dry run. Outcome: no `[telegram dry-run]` line.
- **S6:** the merged settings file. Outcome: the keys are `Stop`, `PreCompact`, `SessionStart` and `Notification`, in that order; no `PreToolUse`; one Notification entry, with the matcher of §2.1, the command unchanged and timeout 15; no command names `questions-mirror.mjs`.
- **S7:** the settings' Notification command run through the hook shell, in a temporary project holding copies of `scripts/hooks/*.mjs`, so that nothing is written to the real `.claude/state/`. The payload is `{notification_type: "quota_auto_resume_stale", message: "<test text>"}`, in dry run. Outcome: exit 0 and one dry-run line naming the type.

### §4. Tests, one mutation each
A mutation is observed by applying it, running the named test, recording the first failing assertion in a `// RECORDED MUTATION:` comment with its commit, and reverting it. A `verify-mutation` run is not an observation (round 25, item 2 (c)).

| # | Test (file) | Scenario | Mutation that fails it by name |
|---|---|---|---|
| T1 | `stop-queue: the human-blocked-only allow sends no Telegram message` (hooks.test.mjs; replaces `stop-queue: notifies on the human-blocked-only allow, deduped on the waiting set`) | S1 | The step-6 send restored |
| T2 | `stop-queue: a halt sends the HALT line once when nothing waits on the human` (hooks.test.mjs; spy `notify`) | S2 | The send put back behind a `waitingOnHuman.length` guard, as at main |
| T3 | `stop-queue: a halt with human-blocked nodes sends the HALT line without the waiting list` (hooks.test.mjs) | S3 | The waiting list appended to the halt text |
| T4 | `stop-queue CLI: a halt sends one HALT message through the shipped entry` (hooks.test.mjs) | S4 | The halt send removed |
| T5 | `stop-queue CLI: the human-blocked-only allow sends nothing through the shipped entry` (hooks.test.mjs) | S5 | The step-6 send restored through `sendTelegramDeduped` |
| T6 | `the_notification_hook_matches_only_the_two_quota_types` (hooks.test.mjs) | S6 | `idle_prompt` restored in the matcher; separately, the PreToolUse entry restored |
| T7 | `the_notification_settings_command_forwards_a_quota_notification_once` (hooks.test.mjs) | S7 | The command's script path altered in a scratch copy of the settings |
| T8 | `the_settings_command_mirrors_a_recorded_askuserquestion_payload` (questions-mirror.test.mjs; changed per OPEN-3) | its S11 | Its `--hook` branch test in questions-mirror.mjs inverted |

- Must pass unedited: `scripts/plan/rotate-cut-state.test.mjs`, `scripts/hooks/guardian-continuity-parity.test.mjs`, `scripts/hooks/cloud.test.mjs` (its command count is `>= 4`; 8 after the change), and every other test in the CI line.

### §5. Predictions · declared unchanged · invalidators · falsification
- **Predicted:** every scenario in §3 as declared; CI green; verify-cites, verify-quotes, verify-test-claims, verify:plan and forms-layout each exit 0.
- **Declared unchanged:**
  - the Stop, PreCompact and SessionStart entries;
  - the halt switch, its stderr line and its 60-second probe cache;
  - the lease and continuity steps (the Guardian parity test);
  - `telegram.mjs`;
  - the Notification script's code;
  - every other hook script;
  - the Guardian and the mods.
- **Invalidators** (the piece stops and queues):
  - I1: a test outside Scope fails;
  - I2: any place beyond ADV-2026-11-13-04's two places is needed in a settings file (split off under ADV-2026-11-14-23 item 3 (d));
  - I3: a Guardian refusal;
  - I4: verify-cites or verify-test-claims fails because of a path the piece touches.
- **Falsification:** after the merge, an idle alert reaches the human from a session that has loaded the merged file. H1 is then false, and the alert's source is elsewhere.

### §6. Instruments
Assertions only. There is no measurement and no `docs/08` row.

### §7. Declared values and ceilings
- `TELEGRAM_DEDUPE_WINDOW_MS` stays 600000 ms; it now bounds the repeat of one halt line.
- The halt path within the Stop entry's 20 s: the 5 s fetch plus one 8 s send, 13 s in all.
- Files: at most 8, the form excluded (settings.json, stop-queue.mjs, hooks.test.mjs, questions-mirror.test.mjs, notify-telegram.mjs, questions-mirror.mjs, README.md, AUTONOMY.md).
- Lines: at most 300 changed lines by `git diff --numstat $(git merge-base origin/main HEAD)..HEAD -- . ':!governance/AUTONOMY.md' ':!governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md'`, insertions plus deletions, with README counted. Code and tests alone: at most 240. An overrun is class 8.
- Every unpinned in-tree cite into an edited file still resolves (verify-cites exit 0). The highest cited lines at f47a2ad9: `stop-queue.mjs:355`, `hooks.test.mjs:1314`, `settings.json:78` (the new length is 91), `notify-telegram.mjs:76`, `hooks/README.md:164`.

### §8. Block-on-sight
1. `.claude/settings.json` differs from the merge base, or from origin/main at gate time, other than in ADV-2026-11-13-04's two places (check C1 in §9).
2. Any other settings file, the Guardian or a mod is touched, or the main checkout's `.claude/settings.json` is edited before the merge.
3. The halt stderr line, `checkHalt`, or the override and halt order is changed.
4. Any Telegram send remains on the human-blocked-only path.
5. A halt that sends nothing when nothing waits (if OPEN-1 (a) is taken).
6. Any Telegram message beyond the three alarms.
7. `leaseHeldBy`'s export, `judgeContinuity` or `accountContinuation` is changed.
8. `decide`'s `notify` option is removed or renamed.
9. Any text claims the two-hour alarm is sent before its follow-up merges.
10. AUTONOMY.md is edited anywhere above its end, or §16 or Appendix A3 is edited in place.
11. A passage marked verbatim is not byte-copied by script with its pin.
12. `questions-mirror.mjs`, its test file or its fixture is deleted (under OPEN-3 (a)).
13. Any CI step is red.

### §9. Gates
- **Architect and reviewer**, each to an affirmative PASS. Reports go under `state/consults/gates/` (§25 (b)).
- **Reviewer check C1** (the two places):
  - `git diff -U0 $(git merge-base origin/main HEAD)..HEAD -- .claude/settings.json` shows exactly two hunks, `@@ -3,12 +2,0 @@` and `@@ -92 +80 @@`.
  - `git diff --numstat` reads `1	13	.claude/settings.json`.
  - The script in note N4 exits 0, on blobs rather than working files (eol-safe).
- **Suites** (expected exit 0 for each):
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`;
  - `node scripts/plan/verify-cites.mjs`;
  - `node scripts/plan/verify-quotes.mjs`;
  - `node scripts/plan/verify-test-claims.mjs`;
  - `node scripts/plan/verify.mjs --offline`;
  - `node scripts/plan/forms-layout.mjs`.
  All are light node runs, so no hold is needed. Anything heavy goes inside `hold shared -Project SpatialIDE`.
- **Operator:** none before the merge. After the merge (ADV-2026-11-14-23 item 6), the custodian restarts nothing, changes no setting, and reports that the main checkout holds the merged file, with the time, and whether its session showed any notice about changed hooks or settings. The human's Telegram over the following day is H1's discriminator.

### §10. Amendments — opens empty, append-only

---

## NOTES

- **N1. Untracked Authority.** ADV-2026-11-14-23 exists only at `<S>`. "nothing tracked may cite an untracked file as Authority" (round 14). The custodian files it under `state/directives/` before committing the form, and the form cites it there.
- **N2. PLAN at main.** The node still reads `status: blocked` and `depends_on: [advisor-session-merges-under-the-humans-rule]` (`governance/PLAN.yaml:7251-7253 @ f47a2ad90f69dfa02f63636887d0402862c03edd`), and `advisor-session-merges-under-the-humans-rule` has `depends_on: []` (`governance/PLAN.yaml:7236 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). ADV-2026-11-14-23 item 1 (b) reverses this, and the node's `gate:` takes the form's path. These are the custodian's edits on main, before dispatch. Rule (00) holds: on the brief's lists, none of the three branches in flight touches these paths.
- **N3. Settings item 1, copied** (`state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:19-22 @ f47a2ad90f69dfa02f63636887d0402862c03edd`):
```
1. The notifications piece (advisor-questions-and-telegram-three-alarms) changes `.claude/settings.json` in the repository in two places and nowhere else.
(a) The PreToolUse entry whose matcher is "AskUserQuestion" is removed whole. It is the entry whose command is `node "$CLAUDE_PROJECT_DIR/scripts/hooks/questions-mirror.mjs" --hook`. It is the only PreToolUse entry, so the "PreToolUse" key goes with it.
(b) The Notification entry's matcher changes from "permission_prompt|idle_prompt|agent_needs_input|quota_auto_resume_stale|quota_auto_resume_disabled" to "quota_auto_resume_stale|quota_auto_resume_disabled". Its command and its timeout stay.
The Stop, PreCompact and SessionStart entries stay as they are.
```
  - Against the file at f47a2ad9: (a) is `.claude/settings.json:3-14 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, the only PreToolUse entry, whose command is at :9. (b) is :92, and its command and timeout are at :96-97.
  - **The file after the two edits** (my construction from the Read output: lines 1-2, then 15-103 with :92 changed; 91 lines):
```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/stop-queue.mjs\"",
            "timeout": 20
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "matcher": "manual",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/precompact-flush.mjs\"",
            "timeout": 20
          }
        ]
      },
      {
        "matcher": "auto",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/precompact-flush.mjs\"",
            "timeout": 20
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/session-resume.mjs\"",
            "timeout": 10
          }
        ]
      },
      {
        "matcher": "resume",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/session-resume.mjs\"",
            "timeout": 10
          }
        ]
      },
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/session-resume.mjs\"",
            "timeout": 10
          }
        ]
      },
      {
        "matcher": "clear",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/session-resume.mjs\"",
            "timeout": 10
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "quota_auto_resume_stale|quota_auto_resume_disabled",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/hooks/notify-telegram.mjs\"",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```
  - **What names or depends on the removed entry:**
    - `scripts/hooks/questions-mirror.test.mjs:297-327 @ f47a2ad90f69dfa02f63636887d0402862c03edd`. It reads `settings.hooks.PreToolUse` and will throw after the edit (OPEN-3).
    - `governance/AUTONOMY.md:506 @ f47a2ad90f69dfa02f63636887d0402862c03edd` (§28).
    - `scripts/hooks/README.md:263-286 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - `scripts/hooks/questions-mirror.mjs:20-21 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - `scripts/hooks/cloud.test.mjs:51-59 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, which iterates every command and survives.
  - **What names the five-type matcher:**
    - `scripts/hooks/notify-telegram.mjs:12-14 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - `scripts/hooks/README.md:196-201 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - `governance/AUTONOMY.md:276 @ f47a2ad90f69dfa02f63636887d0402862c03edd` (§16, not edited).
    - Sample payloads that use `idle_prompt` or `permission_prompt` as test data: `scripts/hooks/hooks.test.mjs:1333 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, `:1342 @ f47a2ad90f69dfa02f63636887d0402862c03edd` and `scripts/hooks/cloud.test.mjs:104 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - Nothing else in the file depends on either place.
  - **Grep counts** (outside `state/` and `governance/forms/`; the pattern is the brief's six names; the tool's per-file counts; 90 in total across 14 files): `.claude/settings.json` 3, `governance/AUTONOMY.md` 6, `governance/CUSTODIAN-QUEUE.md` 1, `governance/DECISIONS-PENDING.md` 6, `governance/PRECEDENTS.md` 1, `governance/PLAN.yaml` 11, `scripts/hooks/cloud.test.mjs` 6, `scripts/hooks/hooks.test.mjs` 9, `scripts/hooks/notify-telegram.mjs` 6, `scripts/hooks/questions-mirror.mjs` 14, `scripts/hooks/questions-mirror.test.mjs` 15, `scripts/hooks/README.md` 9, `scripts/hooks/stop-queue.mjs` 1, `scripts/hooks/telegram.mjs` 2. `.github/workflows/` names none of them. CI runs the hook tests at `.github/workflows/governance-ci.yml:149-150 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, with path filters for `.claude/settings.json` and `scripts/hooks/**` at :88, :94, :106 and :112.
- **N4. The reviewer's C1 script** (my words):
```
node -e "const {execFileSync:x}=require('child_process');const b=x('git',['merge-base','origin/main','HEAD']).toString().trim();const m=x('git',['show',b+':.claude/settings.json']).toString(),h=x('git',['show','HEAD:.claude/settings.json']).toString();const L=m.split('\n');const e=[...L.slice(0,2),...L.slice(14)];const i=e.findIndex(l=>l.includes('\"matcher\": \"permission_prompt|idle_prompt|agent_needs_input|quota_auto_resume_stale|quota_auto_resume_disabled\"'));if(i<0)process.exit(3);e[i]=e[i].replace('permission_prompt|idle_prompt|agent_needs_input|','');if(e.join('\n')!==h){console.error('DIFFERS');process.exit(1)}if('PreToolUse' in JSON.parse(h).hooks)process.exit(2);console.log('TWO-PLACES-OK')"
```
  Repeat it with `origin/main` in place of the merge base. Expected: exit 0 and `TWO-PLACES-OK`.
- **N5. The Stop hook's messages at main, copied.**
  - The waiting-list message, `scripts/hooks/stop-queue.mjs:185 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, `:187 @ f47a2ad90f69dfa02f63636887d0402862c03edd` and `:364 @ f47a2ad90f69dfa02f63636887d0402862c03edd`:
```
  if (waitingOnHuman.length === 0) return;
  const text = `${headline}\nWaiting on you (${waitingOnHuman.length} item(s), ${total} min total):\n${lines.join('\n')}`;
    await notify(projectRoot, waitingOnHuman, 'Only human-blocked nodes remain.');
```
  - The halt message, `scripts/hooks/stop-queue.mjs:307 @ f47a2ad90f69dfa02f63636887d0402862c03edd` (stderr) and `:312 @ f47a2ad90f69dfa02f63636887d0402862c03edd` (Telegram):
```
    stderrLines.push(`HALT: ${halt.message || '(state/CUSTODIAN-HALT present, no message)'}`);
      await notify(projectRoot, waitingOnHuman, `HALT: ${halt.message || 'stop-hook halted'}`);
```
  - The change is §2.2, and the tests that follow are T1 to T5. The test this replaces is `scripts/hooks/hooks.test.mjs:391-414 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
- **N6. §16 and Appendix A3.**
  - A3 is headed "verbatim as received" (`governance/AUTONOMY.md:458 @ f47a2ad90f69dfa02f63636887d0402862c03edd`) and is "the source text" (`:460 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). Every human ruling is in the immutable class (`:385 @ f47a2ad90f69dfa02f63636887d0402862c03edd`).
  - So "replaced" is done the way §28 did it (`:504 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, "§4 and §16 are not edited in place"). An appended §38 states the new rule and says that §16 and A3's Telegram paragraph (`:462 @ f47a2ad90f69dfa02f63636887d0402862c03edd`) no longer govern from the merge. Both stay as written history.
  - Other places that point at them, and are read under §38:
    - §3 steps 2 and 4's Telegram clauses (`:89 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, `:91 @ f47a2ad90f69dfa02f63636887d0402862c03edd`);
    - §4's mirror bullet (`:108-118 @ f47a2ad90f69dfa02f63636887d0402862c03edd`);
    - §24's notice clause (`:474 @ f47a2ad90f69dfa02f63636887d0402862c03edd`);
    - §28 (`:502-511 @ f47a2ad90f69dfa02f63636887d0402862c03edd`);
    - the header's §16 mention (`:5 @ f47a2ad90f69dfa02f63636887d0402862c03edd`);
    - `governance/AI_DEVELOPMENT.md` §L (`governance/AI_DEVELOPMENT.md:664-675 @ f47a2ad90f69dfa02f63636887d0402862c03edd`), which says AskUserQuestion stays the only ruling channel (OPEN-6).
  - The mechanics that bind the edit:
    - Append at the end only. Every section since §23 is headed "appended … so that no line a record cites above it moves" (`governance/AUTONOMY.md:468 @ f47a2ad90f69dfa02f63636887d0402862c03edd` through `:698 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). §38 goes after `:711 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - A reproduction is byte-copied by script, with a pin at a main commit (round 12 (b), round 15 (d) and (e)).
    - No bare `:line` into a file the same commit edits (round 14 (a′)).
- **N7. The Guardian, read only.**
  - G8's path side refuses the user's Claude folder and the main checkout's `.claude/settings.local.json` only (`tools/mods/spatial-guardian/hooks/register.js:674-696 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). Its own tests pass an edit of a repository's `.claude/settings.json` (`tools/mods/spatial-guardian/test/guardian.test.ts:1353 @ f47a2ad90f69dfa02f63636887d0402862c03edd`, `:1876 @ f47a2ad90f69dfa02f63636887d0402862c03edd`).
  - G3 covers accepted ADRs and filed `*preregistration.md` (append-only: `register.js:552-590 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). G2 covers docs/01, and G4 covers `state/directives/`.
  - So a worker's edit of each file in Scope is not refused. The form's own later amendments must use the Edit append form (G3).
- **N8. The two other alarms.**
  - The quota alarm: at main, the Notification entry forwards five types. After the change it forwards only the two quota types, through the same command and script, deduped for 10 minutes on the type plus the first 80 characters of the message (`scripts/hooks/notify-telegram.mjs:36-40 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). That is one message per notification. T7 proves it end to end in dry run.
  - The halt alarm: at main it is sent only with a waiting list, and carries that list. After the change it is always the HALT line alone, deduped for 10 minutes on its text per project folder (T2 to T4).
  - The halt alarm is not sent when `CUSTODIAN_STOP_HOOK=off` (step 1 returns first), as at main.
- **N9. Route and budget.**
  - About 8 files. Estimates of changed lines: settings 14, stop-queue about 56, hooks.test about 140, questions-mirror.test about 10, notify about 8, questions-mirror.mjs about 4, README about 40; about 272 in all, about 232 without the README. §38 and the form are exempt (§21c, `governance/AUTONOMY.md:357 @ f47a2ad90f69dfa02f63636887d0402862c03edd`).
  - §21b's single gate is closed: §21a security posture, and the size. §36 does not apply. Both gates are taken.
  - The worker's share fits the 60-minute estimate once the OPEN packet is answered. The whole piece (the packet, two gates and the merge check) does not. §10's 2× rule governs the node.
- **N10. The form's path.** It goes under `governance/forms/scripts/`. Its folder is the first segment of the code (`governance/README.md:23 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). `.claude/` is configuration that names `scripts/hooks/`, and AUTONOMY is governance text. The precedent is `governance/forms/scripts/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md`, which edited the same two places. `scripts/plan/forms-layout.mjs:37 @ f47a2ad90f69dfa02f63636887d0402862c03edd` accepts any path under `governance/forms/`.

---

## OPEN ITEMS (one packet to the advisor; none taken on my recommendation)

- **OPEN-1. The halt message.**
  - (a) The `HALT: <line>` headline alone (main's text, byte for byte), sent on every halt. **Recommended**: it meets item 3's alarm and item 4's "waiting-list message goes", and closes the gap against §3 step 2.
  - (b) Keep main's behaviour: sent only when a node waits, with the list appended. This contradicts both.
  - Not reserved (grant item 2).
- **OPEN-2. The halt dedupe.**
  - (a) 10 minutes, keyed on the halt line. **Recommended**: it uses the existing primitive. A halt that stays in place across stops more than 10 minutes apart re-alerts.
  - (b) Once per distinct halt until the file is removed. This needs new state.
  - Not reserved.
- **OPEN-3. The mirror script, its test and its fixture.**
  - (a) All stay. Header comments say that no hook calls the script. T8 keeps its name and reads the command from `git show f47a2ad90f69dfa02f63636887d0402862c03edd:.claude/settings.json` (CI uses fetch-depth 0), with its M11 and M14 comments rewritten. **Recommended**: deletion fails the tools.
    - verify-cites resolves only cites to files that exist (`scripts/plan/verify-cites.mjs:9-14 @ f47a2ad90f69dfa02f63636887d0402862c03edd`). Rooted, unpinned cites sit in gated filed records, for example `state/consults/2026-10-11-pilot-v2-table-and-section-6-measures.md:162 @ f47a2ad90f69dfa02f63636887d0402862c03edd` and `state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-1.md:18 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - verify-test-claims makes the 13 claims at `governance/forms/scripts/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:154-166 @ f47a2ad90f69dfa02f63636887d0402862c03edd` binding, plus `governance/forms/scripts/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md:316 @ f47a2ad90f69dfa02f63636887d0402862c03edd`.
    - A `withdrawn-test` row needs a `ruling:` that resolves in the ruling set (`scripts/plan/verify-test-claims.mjs:554-569 @ f47a2ad90f69dfa02f63636887d0402862c03edd`), and DECISIONS-PENDING.md has no RULED block for 2026-11-13.
  - (a′) As (a), but with the command as a literal copied from ADV-2026-11-13-04 item 1 (a).
  - (b) Delete them in a follow-up records piece: ledger entries, withdrawn rows and a verify-cites change.
  - (c) Withdraw T8 alone, with the same rider problem.
  - Not reserved.
- **OPEN-4. The two-hour alarm.** Nothing at main can send it. No hook observes advisor messages, and a waiting session runs no Stop hook. It needs more than item 2's files, so it is split off (ADV-2026-11-14-23 item 3 (d)) and does not hold this piece. §38 says it has no sender until the follow-up merges. Node text:
```
  - id: advisor-silence-two-hour-alarm
    title: "Telegram's third alarm: one message when the advisor has not answered the custodian for two hours (the human's item 3 of 2026-11-13, 06:57Z); split from advisor-questions-and-telegram-three-alarms by ADV-2026-11-14-23 item 3 (d)"
    kind: task
    lane: governance
    phase: prototype
    status: proposed
    order: null
    depends_on: [advisor-questions-and-telegram-three-alarms]
    needs_human: {kind: none, minutes: 0}
    gate: none
    evidence: null
    budget_minutes: 60
    generation: 1
    felt_verdict: false
    entries: []
    summary: "PROPOSED: a sent-time and answer marker recorded against state/questions/round-<n>.md; a small CLI under scripts/hooks/ sending one deduped message through telegram.mjs; a trigger that runs while the session waits, checked against the installed Claude Code documentation before it is designed; AUTONOMY section 38 gains the sender. Reserved under the grant's item 4 (c), as drafts for the human: any settings entry or permission, any scheduled task or other process holding the Telegram token, any credential; item 4 (e) if the machine's rules are touched."
    dates: {opened: <date>, done: null}
```
  - Trigger options: (i) the session's own timed wake plus the CLI, with no settings change; **recommended if the installed version provides such a wake**, which Appendix B does not show; (ii) a Stop-hook step, which cannot time an idle wait and is not recommended; (iii) a scheduled task, which is **reserved** (4 (c), 4 (e)).
  - The placement is not reserved; the parts named in the summary are.
- **OPEN-5. §38's shape.**
  - (a) Appended. The human's items 1 to 3 are byte-copied by script (`…on-notifications….md:9-13 @ <the main commit that added it> sha256:<custodian>`), followed by the instantiation below. **Recommended**: item 4 says the sections are "replaced by this rule", so the rule must live there.
  - (b) A reference only, with no reproduction.
  - (c) Edit §16 in place. This breaks `governance/AUTONOMY.md:504 @ f47a2ad90f69dfa02f63636887d0402862c03edd`'s practice.
  - Not reserved.
  - Draft instantiation (my words, not the human's; each clause is checked against §2):
    - From the merge, §16 and Appendix A3's first paragraph no longer govern, and neither is edited.
    - §3 steps 2 and 4's Telegram clauses, §4's mirror bullet, §24's notice clause and §28 are read under this section. [§2.6]
    - The quota alarm is the Notification entry of `.claude/settings.json`, matcher `quota_auto_resume_stale|quota_auto_resume_disabled`, running `scripts/hooks/notify-telegram.mjs`. [§2.1; T6, T7]
    - The halt alarm is the Stop hook's message `HALT: <the file's first line>`, deduped for ten minutes on its text in each project folder. The Stop hook sends no other message. [§2.2; T1 to T5]
    - No hook writes or mirrors a question round. The custodian writes `state/questions/round-<n>.md` and sends its path to the advisor. `scripts/hooks/questions-mirror.mjs` stays in the tree, and no settings entry runs it. [§2.1, §2.4]
    - Before a stop in which only human-blocked nodes remain, the custodian tells the advisor what waits and for how long. [the human's item 2; no code]
    - The two-hour alarm has no sender until PLAN node `advisor-silence-two-hour-alarm` merges. [OPEN-4]
    - The custodian calls no AskUserQuestion (ADV-2026-11-14-23 item 6 (c)).
- **OPEN-6. `governance/AI_DEVELOPMENT.md` §L.**
  - (a) Untouched here. §38 names it as read under it, and its pointer goes in a follow-up or in `advisor-session-merges-under-the-humans-rule`. **Recommended**: the file is outside item 2.
  - (b) An appended pointer in this piece. That is a ninth file, split off under item 3 (d).
  - Not reserved.
- **OPEN-7. Sample payloads** at hooks.test.mjs:1333 and :1342 and cloud.test.mjs:104.
  - (a) Left as they are. They are formatting data, not matcher claims. **Recommended**.
  - (b) Switched to quota types.
  - Not reserved.
- **OPEN-8. A type allowlist inside `notify-telegram.mjs`.**
  - (a) None. The human named the matcher, and ADV-2026-11-13-04 keeps the command. **Recommended**.
  - (b) Add one, as defence in depth.
  - Not reserved.

---

## WHAT I COULD NOT SETTLE
- Every sha256, and the commit that added the 06:57Z directive (needed for §38's pin).
- Whether verify-cites and verify-test-claims fail on a deletion. I reasoned from their headers and code at f47a2ad9 and ran neither.
- H1 to H3.
- User-level settings hooks, which I did not read and which could also send idle alerts.
- Whether the installed Claude Code offers a timed wake (OPEN-4).
- `scripts/hooks/hooks.test.mjs`: I read lines 1-130, 230-529, 750-779 and 1320-1399, and bounded the rest by a grep for telegram, notify, HALT and the hook names. I did not read it whole.
- `.claude/settings.local.json`: grepped, not read.
