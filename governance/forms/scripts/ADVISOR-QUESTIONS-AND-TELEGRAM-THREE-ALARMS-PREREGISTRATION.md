# Questions to the advisor; Telegram keeps three alarms — full preregistration (PLAN node `advisor-questions-and-telegram-three-alarms`)

**Authority.**
- The human's message of 2026-11-13 (06:57Z), items 1 to 4: `state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md:9-15 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:5e85522264e5332e8e1215d7b205d6b5a0624445045d7e23368bccbacf28f8ff`.
- ADV-2026-11-13-04, approved by the human, so its words are the human's by that approval: `state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:7 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:4ea80876f27260594e3841bbcac12532d8da1f359e2c05cf05fc3b24087f0053` and `state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:19-26 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:b64de5c937cd695670640bf68f8b18817fdb1879007eb10caa0d267483621608`.
- The grant, items 4 (c) and 5: `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:19-33 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:d915eb4bf40282d996724ac77fee160e583e08457e734e9b75a1da8ddf3a4f4c`.
- The placement, ADV-2026-11-14-23, items 1 to 6. It is the advisor's ruling under the delegation of 2026-11-13, never the human's words: `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-23-the-notifications-piece-starts-now-in-the-docs-lane-ahead-of-advisor-session-merges-full-form-both-gates-open-items-to-the-advisor.md`.
- The answers to the draft's eight OPEN items, ADV-2026-11-14-24, items 1 to 10. It is the advisor's ruling under the delegation of 2026-11-13, never the human's words: `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-24-the-notifications-forms-eight-open-items-answered-halt-line-alone-literal-command-section-38-text-follow-up-node-budget-180.md`.
- Reuse index (`node tools/reuse.mjs`, run by the custodian in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c): three misses, each with exit 1, for "claude code hooks settings notification matcher", "telegram alert notification hook" and "stop hook queue message". No prior art is recorded.

**Rulings on the OPEN items.** Each line records the advisor's ruling ADV-2026-11-14-24, under the delegation of 2026-11-13. None of it is the human's words. The OPEN items are those of the architect's draft, `state/consults/2026-11-14-advisor-questions-and-telegram-three-alarms-form-architect-draft.md`, section "OPEN ITEMS". The summaries are my words. Each backtick span is copied from the ruling byte for byte.
- **OPEN-1, the halt message: (a), item 1.** At every stop where the Stop hook finds the halt switch, it sends main's HALT headline alone, unchanged, whether or not a node waits on the human. It reads no plan for this.
- **OPEN-2, the halt dedupe: (a) in this piece and (b) in the follow-up, item 2.** This piece keeps the existing ten-minute primitive, keyed on the halt line, and adds no state. One message per halt, until the file is removed, is built by PLAN node `advisor-silence-two-hour-alarm` (item 2 (c)). §1 carries item 2 (b)'s sentence.
- **OPEN-3, the mirror script, its test and its fixture: (a′), item 3.** All three stay, and no deletion piece is placed. The settings-command test keeps its name, no longer reads the settings file, and holds the command as a literal: `node "$CLAUDE_PROJECT_DIR/scripts/hooks/questions-mirror.mjs" --hook`. The reviewer checks that literal once (item 3 (d)). The old recorded-mutation comments keep what they recorded (item 3 (e)).
- **OPEN-4, the two-hour alarm: split off, item 4.** Nothing in this piece sends it, and this piece does not wait for it. PLAN node `advisor-silence-two-hour-alarm` is added with the draft's node text and item 4 (b)'s three changes. Its title ends `split from advisor-questions-and-telegram-three-alarms by ADV-2026-11-14-23 item 3 (d) and ADV-2026-11-14-24 item 4`. Its summary gains `The halt alarm becomes one message per halt, until the file is removed (ADV-2026-11-14-24 item 2).` and `governance/AI_DEVELOPMENT.md section L gains an appended pointer to AUTONOMY section 38 (ADV-2026-11-14-24 item 6).` Its budget is 180 minutes. Its trigger is ruled in item 4 (d): option (ii) is out and option (iii) is reserved. The doubt under the grant's item 4 (c) goes to the human as the advisor's draft (item 4 (e)).
- **OPEN-5, the shape of §38: (a), item 5.** §38 is appended after the pointer line that follows §37. Its text is item 5's fence, with `<PIN>` and `<THE BYTE COPY>` filled by the custodian's script. Part B is the advisor's wording and replaces the draft's instantiation.
- **OPEN-6, `governance/AI_DEVELOPMENT.md` §L: (a), item 6.** The file is not touched here, and §38 (ii) names §L as read under it. Its appended pointer goes to PLAN node `advisor-silence-two-hour-alarm` (item 6 (b)).
- **OPEN-7, the sample payloads: (a), item 7.** They stay.
- **OPEN-8, a type allowlist in `scripts/hooks/notify-telegram.mjs`: (a), none, item 8.** The form's falsification is what brings it back (item 8 (b)).

**Drafted by** the architect agent, read only, on the custodian's brief, at main f47a2ad90f69dfa02f63636887d0402862c03edd. It was revised read only for ADV-2026-11-14-24. Nothing was run and no hash was computed.

**Committed before any code**, on main, by the custodian. The form is append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full, from dispatch** (§21a, the security-posture head: `governance/AUTONOMY.md:321-322 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:61906e9c90498d10e7b265806962434fde6ac701e9b3fdbdd542377ec624e962`; ADV-2026-11-14-23 item 3 (a)). The piece is also over §21c's bound (§7). Both gates apply: the architect and the reviewer must each reach an affirmative PASS. Under §25 (e), no five-line form is used. §36 does not apply: this is a docs-lane piece and is not on the filler queue.

### §0. Disclosure
- **Reasoned from the code at f47a2ad9; nothing was run.** The piece relies on these parts of the code:
  - The settings file, whole: `.claude/settings.json:1-103 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:f9d1737718899fa8e9d1ae4384f0cad7372ae58e2124f94c9b1130fccb6ebf66`.
  - The Stop hook's halt branch: `scripts/hooks/stop-queue.mjs:305-319 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:9f6ff5e4607a0bd74e2d900d3f834236e9c5bd743261e9be4c3aa2ad8c0a574b`.
  - Its waiting-list sender: `scripts/hooks/stop-queue.mjs:168-194 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:0ca69914d626edf3c8eed8eb01c6bd7df89f0b2aae8a255f38441c0c7e306ede`.
  - Its step 6: `scripts/hooks/stop-queue.mjs:361-367 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:7c9d794b57d915e134a8c32503a6731016b271ac01676f53770fffb70d099b59`.
  - Its injectable `notify` option: `scripts/hooks/stop-queue.mjs:293 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:3cc977221de5ae6d437b4aee4f5cc7af79bbfde875f0537c9cea0911f920cb61`.
  - The send primitive and its dedupe: `scripts/hooks/telegram.mjs:39-54 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:70b36257ccfe1c0cb13daaf5af6bba6751f32123eabc69bcc3dd22f29daae75e` and `scripts/hooks/telegram.mjs:251-270 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:b6bdbb031730bb208ffb9a76d2c28b2c9e19f907d45fa398ab665fad04e9f86a`.
  - The Notification script's input and message: `scripts/hooks/notify-telegram.mjs:30-40 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:23395612ad09ce0d0fa32e0a6999d6f90a4045e0ed6f47b01b2d88819aa07a61` and `scripts/hooks/notify-telegram.mjs:56-74 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:9310533e1aeeed9af0107da1c686f74ff48fa77b61428d494360ea15bc5fafe8`.
  - The mirror's import of the lease reader: `scripts/hooks/questions-mirror.mjs:31 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:0d060d20cc6d8c48512ccf7ee7741deb703241fc3d817aca85a177e5203fba00`.
  - The settings-command test: `scripts/hooks/questions-mirror.test.mjs:295-327 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:a05b442c2073d9c20fcb5d05f7384f56445925a8f5066b8ab7ff345e7bd99ccc`.
- **A finding at main.** When nothing waits on the human, the halt alarm is not sent. The halt branch passes its headline to the waiting-list sender, and that sender returns at once on an empty list. When it does send, it appends the waiting list. `governance/AUTONOMY.md:89 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:4a43bdd96b1346c5a619bc0c5e10592940fe2e8769cb0a9398726b03dcf37c72` promises "one Telegram message (§16)" on every halt. This piece closes that gap under ADV-2026-11-14-24 item 1 (a), and item 1 (b) keeps this finding.
- **Hypotheses, each with its discriminator:**
  - H1: Claude Code runs the Notification hook only for the types its matcher lists (Appendix B, `governance/AUTONOMY.md:449 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:dded69dd04906ce2b98dd4f43fc5fa5527cb6d8e7c68e99385d04406f9134ad8` and `governance/AUTONOMY.md:453 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:e5e10d1bb0d77a57e5e84efad187a0547823dd8e0c68177a953b8c64bed523d0`). Discriminator: the human receives no `idle_prompt`, `permission_prompt` or `agent_needs_input` alert from a session that has loaded the merged file.
  - H2: `quota_auto_resume_stale` and `quota_auto_resume_disabled` are the notifications sent when a usage limit stops a session. The human's item 3 names them that way, and Appendix B lists the names without a description. Discriminator: the first live usage limit after the merge.
  - H3: a running session picks up the changed file. Appendix B is silent on this. Under ADV-2026-11-14-23 item 6 (a) the advisor answers the human; under item 6 (b) the custodian reports what its session showed.
- **Not read:** user-level settings, which are outside the repository. `.claude/settings.local.json` was grepped but not read whole. It holds none of `hooks`, `Notification`, `PreToolUse`, `telegram` or `idle_prompt` (count 0).

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
  - that the two-hour alarm is sent. Nothing sends it at the merge; PLAN node `advisor-silence-two-hour-alarm` builds its sender (ADV-2026-11-14-24 item 4; §2.7);
  - (ADV-2026-11-14-24 item 2 (b), copied from the ruling:) that a halt sends one message only: a halt left in place sends again at a stop more than ten minutes after its last message.
- No ADR is cited or amended. Nothing touches the wire or `docs/08`. No user-visible app string changes.

### §2. The change
- **2.1 `.claude/settings.json`: exactly ADV-2026-11-13-04 item 1.**
  - The PreToolUse key and its single entry, lines 3-14, are removed.
  - Line 92's matcher becomes `quota_auto_resume_stale|quota_auto_resume_disabled`.
  - Nothing else in the file changes. The worker edits it in its worktree only, never in the main checkout.
- **2.2 `scripts/hooks/stop-queue.mjs`** (ADV-2026-11-14-24 items 1 (a) and 2 (a)):
  - (a) The step-6 call `await notify(projectRoot, waitingOnHuman, 'Only human-blocked nodes remain.');` is removed. The stderr line `allow: no unblocked node is ready; <n> waiting on human.` stays.
  - (b) `waitingSummary`, `waitingSetKey` and `notifyWaiting` are removed. So is the `node:crypto` import, whose only use is `waitingSetKey`.
  - (c) A new `notifyHalt(projectRoot, text)` calls `sendTelegramDeduped(\`halt:${text}\`, text, { projectRoot, windowMs: TELEGRAM_DEDUPE_WINDOW_MS })` and catches errors the way `notifyWaiting` did. It adds no state (item 2 (a)).
  - (d) The halt branch keeps its stderr line byte for byte. It calls `await notify(projectRoot, \`HALT: ${halt.message || 'stop-hook halted'}\`)` and reads no plan. The headline text is main's, byte for byte.
  - (e) `decide`'s option keeps the name `notify`, with `notifyHalt` as its default (see the seam row in §2.8).
  - (f) The header comment for step 6 and the reason clause of `TELEGRAM_DEDUPE_WINDOW_MS` are reworded to match.
  - (g) These are not touched: `checkHalt`, the order of the override and the halt check, `leaseHeldBy` (still exported, because `questions-mirror.mjs:31` imports it), `judgeContinuity`, `accountContinuation`, steps 4, 5, 7 and 8, `main`, and the cloud guard.
- **2.3 `scripts/hooks/notify-telegram.mjs`:** comments only. Lines 12-14 name the two quota types and §38. Lines 18-21 drop "the same primitive the Stop hook's own waiting-items notice uses". The net loss is at most 3 lines, so that `notify-telegram.mjs:76` stays in range for verify-cites. The code is unchanged: there is no type allowlist (ADV-2026-11-14-24 item 8 (a)).
- **2.4 The mirror script, its test and its fixture stay (ADV-2026-11-14-24 item 3 (a′)).** Nothing is deleted.
  - (a) `scripts/hooks/questions-mirror.mjs`: comments only. Lines 20-21 say that, since this piece, no settings entry runs hook mode, and cite §38. The code is unchanged.
  - (b) `scripts/hooks/questions-mirror.test.mjs`: the test `the_settings_command_mirrors_a_recorded_askuserquestion_payload` keeps its name. It no longer reads `.claude/settings.json`. The lines that read that file and assert the entry's shape (`scripts/hooks/questions-mirror.test.mjs:298-305 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:388ca9ad99d4c7b9438a5459678475d71754ec1698541b6b4301213cd07eb9b6`) give way to one declaration. Its string value is the command of item 3 (b), byte for byte, written as a single-quoted literal: `const command = 'node "$CLAUDE_PROJECT_DIR/scripts/hooks/questions-mirror.mjs" --hook';`. The rest of the test is unchanged. The test reads no commit through git (item 3 (c)).
  - (c) The test's two recorded-mutation comments, M14 and M11, keep what they recorded. The test gains its own recorded mutation (§4, T8). If a tool refuses the old comments as they stand, the worker says so in its report, and a comment gains words and loses none (item 3 (e)).
- **2.5 `scripts/hooks/README.md`:** these passages are reworded to say what the code does after the change:
  - Stop step 2's notice sentence (lines 63-65);
  - step 6 (lines 84-86);
  - the Notification matcher paragraph and the dedupe sentence (lines 196-207);
  - the Question round mirror section (lines 232-286): §38 retires its obligation, and its PreToolUse entry no longer exists.
- **2.6 `governance/AUTONOMY.md`: §38, appended (ADV-2026-11-14-24 item 5).** This form does not reproduce the section's text.
  - §38 goes at the end of the file, after the pointer line that follows §37 (item 5 (a)). Nothing above it changes.
  - Its text is item 5's fence, byte for byte, from the filed ruling at `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-24-the-notifications-forms-eight-open-items-answered-halt-line-alone-literal-command-section-38-text-follow-up-node-budget-180.md`.
  - `<PIN>` and `<THE BYTE COPY>` are filled by the custodian's script, as item 5 (b) defines them. `<PIN>` is the pinned cite of lines 9 to 13 of the 06:57Z directive, at the commit that added it, with the span's sha256, in the form §36 and §37 use. `<THE BYTE COPY>` is a text fence holding those five lines, byte-copied. Item 5 (b) names a commit for the script to confirm.
  - The custodian gives the worker the resulting section by file. The file starts at its `## §38.` heading line, ends with one LF, and uses LF line endings throughout. It is 4377 bytes, `sha256:fa5aaa81e820fa6a74e9e5408442b15c38904f4be895aba3a8f613a1bc15d759`, values recorded here at this form's commit.
  - The worker appends one empty line and then that file, byte for byte. The reviewer compares the appended section with the file by script (§9, C3).
  - Part B is the advisor's wording, under the delegation of 2026-11-13. Both gates clause-check it (§9).
- **2.7 These stay unchanged:**
  - `scripts/hooks/telegram.mjs`;
  - `scripts/hooks/fixtures/pretooluse-askuserquestion.json`;
  - `scripts/hooks/cloud.test.mjs`;
  - the sample payloads `scripts/hooks/hooks.test.mjs:1333 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:7beca08f027a60d69233c50c5528ffe7db0dcc53d08bcaab015c35dd34a6655b`, `scripts/hooks/hooks.test.mjs:1342 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:93af6c89f60961a3debbcd8e0596011b38516a26b0f76ad27d2114ce8895efa3` and `scripts/hooks/cloud.test.mjs:104 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:2fb92fdff180e5e61a937ce3ff18302507088b34096cc89997ff20ecf40f5a1a` (ADV-2026-11-14-24 item 7);
  - every other hook script;
  - §16, Appendix A3, §4 and §28, in place;
  - `governance/AI_DEVELOPMENT.md` (ADV-2026-11-14-24 item 6 (a)). Its pointer goes to PLAN node `advisor-silence-two-hour-alarm` (item 6 (b));
  - `PLAN.yaml` on the branch (the custodian makes the PLAN edits on main).
  - The two-hour alarm has no sender in this piece. PLAN node `advisor-silence-two-hour-alarm` builds it, and this piece does not wait for it (ADV-2026-11-14-24 item 4 (a)).
- **2.8 Seams (each consumer's interface as it is at f47a2ad9):**

| Seam | Consumer's real interface | End-to-end proof |
|---|---|---|
| stop-queue → telegram | `sendTelegramDeduped(key, text, {projectRoot, windowMs})` (telegram.mjs:251) | T4 |
| settings Notification command → notify-telegram | stdin `notification_type`, `message`, `title`, `cwd` (notify-telegram.mjs:30-34) | T7 |
| `decide`'s `notify` option → `scripts/plan/rotate-cut-state.test.mjs` | a spy `async (...a)`; asserts no call on non-halt paths (`scripts/plan/rotate-cut-state.test.mjs:211 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:36406149f86b606b945da8861377ffd7d17fd53b3f41418fa490edf7628b2894` and `scripts/plan/rotate-cut-state.test.mjs:252 @ f47a2ad90f69dfa02f63636887d0402862c03edd sha256:78e25826c4918bd58f2e1ce50d4ad6dbfb9e187f511d54b66dd4fea127ef65ac`) | that file passes unedited |
| questions-mirror → `leaseHeldBy` | named export | questions-mirror.test.mjs passes |

The `notify` option's product caller is its default: `main()` reaches it by calling `decide` without the option. The spy is the only other caller, and it is a test caller.

### §3. Fixtures and scenarios (outcomes declared before the run)
- **S1:** a held lease and `two-nodes-human-only.yaml`. Outcome: allow; the stderr says "waiting on human"; no `telegram-sent.json` is written and no dry-run send happens.
- **S2:** a local `state/CUSTODIAN-HALT` holding `drill halt`, and no plan. Outcome: allow; stderr `HALT: drill halt`; one send of exactly `HALT: drill halt`.
- **S3:** S2 plus `CUSTODIAN_PLAN_PATH=two-nodes-human-only.yaml`. Outcome: one send of exactly `HALT: drill halt`, with no `Waiting on you`.
- **S4:** S2 through the shipped CLI, in dry run. Outcome: exactly one stderr line `[telegram dry-run] would send: HALT: drill halt`, and empty stdout.
- **S5:** S1 through the shipped CLI, in dry run. Outcome: no `[telegram dry-run]` line.
- **S6:** the merged settings file. Outcome: the keys are `Stop`, `PreCompact`, `SessionStart` and `Notification`, in that order; there is no `PreToolUse`; there is one Notification entry, with the matcher of §2.1, the command unchanged and timeout 15; no command names `questions-mirror.mjs`.
- **S7:** the settings' Notification command, run through the hook shell in a temporary project that holds copies of `scripts/hooks/*.mjs`, so that nothing is written to the real `.claude/state/`. The payload is `{notification_type: "quota_auto_resume_stale", message: "<test text>"}`, in dry run. Outcome: exit 0 and one dry-run line naming the type.
- **S8:** the literal command of ADV-2026-11-14-24 item 3 (b), run through the hook shell in a temporary project that holds copies of `scripts/hooks/*.mjs` and `scripts/plan/*.mjs`. Its stdin is the recorded fixture `scripts/hooks/fixtures/pretooluse-askuserquestion.json`, in dry run. Outcome: `assertQuiet` passes; the round files are `round-7.md` and `round-8.md`; `round-8.md` holds the recorded body; there is one dry-run line. These are the test's assertions as they stand at f47a2ad9.

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
| T8 | `the_settings_command_mirrors_a_recorded_askuserquestion_payload` (questions-mirror.test.mjs; keeps its name; its command is the literal of ADV-2026-11-14-24 item 3 (b); it reads neither the settings file nor a commit) | S8 | The `--hook` branch test in questions-mirror.mjs (`if (process.argv[2] === '--hook')`) inverted, recorded as the test's own comment beside M14 and M11 (item 3 (e)) |

- These must pass unedited: `scripts/plan/rotate-cut-state.test.mjs`, `scripts/hooks/guardian-continuity-parity.test.mjs`, `scripts/hooks/cloud.test.mjs` (its command count is `>= 4`; 8 after the change), and every other test in the CI line.

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
  - I2: a settings file needs a change beyond ADV-2026-11-13-04's two places (that change is split off under ADV-2026-11-14-23 item 3 (d));
  - I3: a Guardian refusal;
  - I4: verify-cites or verify-test-claims fails because of a path the piece touches.
- **Falsification:** after the merge, an idle alert reaches the human from a session that has loaded the merged file. H1 is then false, and the alert comes from somewhere else. The custodian tells the advisor, who places the allowlist then (ADV-2026-11-14-24 item 8 (b)).

### §6. Instruments
Assertions only. There is no measurement and no `docs/08` row.

### §7. Declared values and ceilings
- Budget: 180 minutes (ADV-2026-11-14-24 item 9, which replaces ADV-2026-11-14-23 item 4 (c)). `governance/AUTONOMY.md` §10's rule applies at twice 180 minutes.
- `TELEGRAM_DEDUPE_WINDOW_MS` stays 600000 ms. It now bounds the repeat of one halt line.
- The halt path within the Stop entry's 20 s: the 5 s fetch plus one 8 s send, 13 s in all.
- Files: at most 8, not counting the form (settings.json, stop-queue.mjs, hooks.test.mjs, questions-mirror.test.mjs, notify-telegram.mjs, questions-mirror.mjs, README.md, AUTONOMY.md).
- Lines: at most 300 changed lines by `git diff --numstat $(git merge-base origin/main HEAD)..HEAD -- . ':!governance/AUTONOMY.md' ':!governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md'`, counting insertions plus deletions, README included. Code and tests alone: at most 240. An overrun is class 8.
- Every unpinned in-tree cite into an edited file still resolves (verify-cites exit 0). The highest cited lines at f47a2ad9 are `stop-queue.mjs:355`, `hooks.test.mjs:1314`, `settings.json:78` (its new length is 91), `notify-telegram.mjs:76` and `hooks/README.md:164`.

### §8. Block-on-sight
1. `.claude/settings.json` differs from the merge base, or from origin/main at gate time, anywhere other than ADV-2026-11-13-04's two places (check C1 in §9).
2. Any other settings file, the Guardian or a mod is touched, or the main checkout's `.claude/settings.json` is edited before the merge.
3. The halt stderr line, `checkHalt`, or the order of the override and the halt check is changed.
4. Any Telegram send remains on the human-blocked-only path.
5. A halt sends nothing when nothing waits (ADV-2026-11-14-24 item 1 (a)).
6. Any Telegram message is sent beyond the three alarms.
7. `leaseHeldBy`'s export, `judgeContinuity` or `accountContinuation` is changed.
8. `decide`'s `notify` option is removed or renamed.
9. Any text claims the two-hour alarm is sent before PLAN node `advisor-silence-two-hour-alarm` merges (ADV-2026-11-14-24 item 4).
10. AUTONOMY.md is edited anywhere above its end, or §16 or Appendix A3 is edited in place.
11. A passage marked verbatim is not byte-copied by script with its pin.
12. `questions-mirror.mjs`, its test file or its fixture is deleted (ADV-2026-11-14-24 item 3 (a′), as under (a)).
13. Any CI step is red.
14. T8 reads `.claude/settings.json` or a commit through git, or its literal differs from the command of ADV-2026-11-14-24 item 3 (b) (check C2).
15. §38 differs from the custodian's section file (check C3).

### §9. Gates
- **Architect and reviewer**, each to an affirmative PASS. The reports go under `state/consults/gates/` (§25 (b)).
- **Part B of §38** (ADV-2026-11-14-24 item 5 (d)): both gates clause-check Part B against the code at the head they review. An untrue clause goes to the advisor, as for any ruled wording.
- **Reviewer check C1** (the two places):
  - `git diff -U0 $(git merge-base origin/main HEAD)..HEAD -- .claude/settings.json` shows exactly two hunks, `@@ -3,12 +2,0 @@` and `@@ -92 +80 @@`.
  - `git diff --numstat` reads `1	13	.claude/settings.json`.
  - The script below exits 0. It works on blobs rather than working files, so line endings do not affect it. It is copied byte for byte from the draft's note N4:
```
node -e "const {execFileSync:x}=require('child_process');const b=x('git',['merge-base','origin/main','HEAD']).toString().trim();const m=x('git',['show',b+':.claude/settings.json']).toString(),h=x('git',['show','HEAD:.claude/settings.json']).toString();const L=m.split('\n');const e=[...L.slice(0,2),...L.slice(14)];const i=e.findIndex(l=>l.includes('\"matcher\": \"permission_prompt|idle_prompt|agent_needs_input|quota_auto_resume_stale|quota_auto_resume_disabled\"'));if(i<0)process.exit(3);e[i]=e[i].replace('permission_prompt|idle_prompt|agent_needs_input|','');if(e.join('\n')!==h){console.error('DIFFERS');process.exit(1)}if('PreToolUse' in JSON.parse(h).hooks)process.exit(2);console.log('TWO-PLACES-OK')"
```
  - Repeat it with `origin/main` in place of the merge base. Expected: exit 0 and `TWO-PLACES-OK`.
- **Reviewer check C2, run once** (ADV-2026-11-14-24 item 3 (d)): the literal in the test equals the command of the `PreToolUse` entry in the settings file at main f47a2ad90f69dfa02f63636887d0402862c03edd. Expected: exit 0 and `LITERAL-OK`.
```
node -e "const {execFileSync:x}=require('child_process');const c=JSON.parse(x('git',['show','f47a2ad90f69dfa02f63636887d0402862c03edd:.claude/settings.json']).toString()).hooks.PreToolUse[0].hooks[0].command;const t=x('git',['show','HEAD:scripts/hooks/questions-mirror.test.mjs']).toString();const n=t.split(\"'\"+c+\"'\").length-1;if(n!==1){console.error('LITERAL-COUNT '+n);process.exit(1)}console.log('LITERAL-OK')"
```
- **Reviewer check C3** (§2.6): the head's AUTONOMY.md is the merge base's bytes, then one LF, then the custodian's section file, byte for byte. The file's path is the argument. Expected: exit 0 and `S38-OK`.
```
node -e "const {execFileSync:x}=require('child_process');const o={maxBuffer:1<<26};const b=x('git',['merge-base','origin/main','HEAD']).toString().trim();const m=x('git',['show',b+':governance/AUTONOMY.md'],o),h=x('git',['show','HEAD:governance/AUTONOMY.md'],o),s=require('fs').readFileSync(process.argv[1]);if(m[m.length-1]!==10)process.exit(3);if(!h.equals(Buffer.concat([m,Buffer.from('\n'),s]))){console.error('DIFFERS');process.exit(1)}console.log('S38-OK')" "<the custodian's section file>"
```
- **Suites** (each expected to exit 0):
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`;
  - `node scripts/plan/verify-cites.mjs`;
  - `node scripts/plan/verify-quotes.mjs`;
  - `node scripts/plan/verify-test-claims.mjs`;
  - `node scripts/plan/verify.mjs --offline`;
  - `node scripts/plan/forms-layout.mjs`.
  All of these are light node runs, so no hold is needed. Anything heavy goes inside `hold shared -Project SpatialIDE`.
- **Operator:** none before the merge. At the merge check, the advisor compares the settings file's two places with ADV-2026-11-13-04, and §38 with item 5's fence, by script (ADV-2026-11-14-24 items 5 (d) and 10 (d)). After the merge (ADV-2026-11-14-23 item 6), the custodian restarts nothing and changes no setting. It reports that the main checkout holds the merged file, with the time, and whether its session showed any notice about changed hooks or settings. The human's Telegram over the following day is H1's discriminator.

### §10. Amendments — opens empty, append-only
