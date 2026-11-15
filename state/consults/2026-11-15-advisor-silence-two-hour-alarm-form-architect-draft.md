*Custodian's filing note (2026-11-15): the architect's draft of the form for PLAN node `advisor-silence-two-hour-alarm`, read only, under the advisor's ruling ADV-2026-11-14-24 item 4 (c) and (d), from its hand-back (39573 bytes, sha256 8b99b98e5964767517a5f42285a734448d4766a083d272a0ebc2ebed118d1bdc) below the rule. Its brief by file (12520 bytes, sha256 ae210fd94b2f2f04836b85bca464aa3c25dd0d4b51a8923b9161bb30e5b54fd7); the run 2026-11-15T00:18:47Z to 2026-11-15T00:28:32Z by its transcript, 59 calls (Read 37, Glob 5, Grep 16, SubagentHandback 1), no write, model claude-opus-5-5; one call errored, its Read of `state/questions/README.md`, which does not exist, as the report says. One change, the custodian's: the report's last line named the documentation report by its full scratch path; it is written `<S>/rep-wake-docs.md` below, as the report's section 0 item [D] writes it. That report is filed at `state/consults/2026-11-15-advisor-silence-two-hour-alarm-wake-docs-report.md`; item [D]'s cite is left as the architect wrote it, for the form to replace. Nothing else is changed. Its ten OPEN items and its facts for item 4 (e) go to the advisor in one packet; no word of it is the advisor's or the human's.*

---

Draft: advisor-silence-two-hour-alarm, full form, architect

I read main @ bd5bcd09da885661266b3b7b46b707b3b46cb5fc, through the main checkout's working tree. The session snapshot gives that tree's HEAD as bd5bcd09. I have no shell, so I could not confirm that with git, and I give no sha256 anywhere in this report. The custodian's script fills every pin. I leave no background shell, because I started none. The only file I read outside the repository is `<S>/rep-wake-docs.md`. Everything outside a marked quotation is my own wording.

One thing the brief expects does not exist at bd5bcd09: `state/questions/README.md`. The Read call answered "File does not exist". I read `round-75.md` and `round-76.md` whole instead.

---

## THE FORM (to be placed at `governance/forms/scripts/ADVISOR-SILENCE-TWO-HOUR-ALARM-PREREGISTRATION.md`)

# The advisor's two hours of silence; one halt message per halt — full preregistration (PLAN node `advisor-silence-two-hour-alarm`)

**Authority.**
- The human's message of 2026-11-13 (06:57Z). Items 1 to 3 are the rule, and item 3 names this alarm: `state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md:9-13 @ bd5bcd09da885661266b3b7b46b707b3b46cb5fc sha256:<custodian's script>`.
- The grant, item 4, and item 4 (c) in particular: `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:19-26 @ bd5bcd09da885661266b3b7b46b707b3b46cb5fc sha256:<script>`.
- ADV-2026-11-14-23, item 3 (d), the split. It is the advisor's ruling under the delegation of 2026-11-13, never the human's words: `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-23-the-notifications-piece-starts-now-in-the-docs-lane-ahead-of-advisor-session-merges-full-form-both-gates-open-items-to-the-advisor.md`.
- ADV-2026-11-14-24, items 2 (c), 4, 6 (b) and 9. It is the advisor's ruling under the delegation, never the human's words: `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-24-the-notifications-forms-eight-open-items-answered-halt-line-alone-literal-command-section-38-text-follow-up-node-budget-180.md`.
- The advisor's answers to this form's OPEN items: `<to be filled from the advisor's packet ruling>`. The human's answer on item 4 (e): `<to be filled; the trigger rows of §2 hold until then>`.
- The reuse index (`node tools/reuse.mjs`, run by the custodian in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-15) gave three misses, each with exit 1: "session timed wake schedule cron", "idle silence alarm two hours" and "telegram alert notification hook". No prior art is recorded.

**Drafted by** the architect agent, read only, on the custodian's brief, at main bd5bcd09da885661266b3b7b46b707b3b46cb5fc. The draft works from main plus the declared changes of `governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`. That piece is not merged; §0 lists the pins that wait for its merge. Nothing was run, and no hash was computed.

**Committed before any code**, on main, by the custodian, and only after the human answers ADV-2026-11-14-24 item 4 (e) (OPEN-5). The form is append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full, from dispatch.** Three reasons:
- §21a: the piece adds a process that holds the Telegram credential. That is security posture: `governance/AUTONOMY.md:315-332 @ bd5bcd09da885661266b3b7b46b707b3b46cb5fc`.
- The piece is over §21c's bound (§7): `governance/AUTONOMY.md:347-357 @ bd5bcd09da885661266b3b7b46b707b3b46cb5fc`.
- Under §25 (e), no five-line form is used.

Both gates must reach an affirmative PASS. §36 does not apply, because this is a docs-lane piece and is not on the filler queue.

### §0. Disclosure
- **Reasoned from the code at bd5bcd09 and the notifications form's declared §2; nothing was run.** The parts of the code it relies on:
  - The send primitive, which reads the environment, handles dry run and no-ops when the variables are unset: `scripts/hooks/telegram.mjs:39-54 @ bd5bcd09…`. Its dedupe state file: `telegram.mjs:229-245 @ bd5bcd09…`. Its deduped send: `telegram.mjs:251-270 @ bd5bcd09…`.
  - The Stop hook's halt branch, `scripts/hooks/stop-queue.mjs:305-319 @ bd5bcd09…`, is replaced by the notifications form's §2.2 (c) to (e), `governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md:65-72 @ bd5bcd09…`. **Pins into `stop-queue.mjs`, `hooks.test.mjs`, `scripts/hooks/README.md` and AUTONOMY §38 wait for that piece's merge.** Every line number below in those four files is main's at bd5bcd09 and will move.
  - `checkHalt`'s three results (halted, not halted, unknown): `stop-queue.mjs:116-147 @ bd5bcd09…`.
  - The background-tasks allow: `stop-queue.mjs:344-347 @ bd5bcd09…`. The Stop input carries `background_tasks` and `session_crons` (Appendix B, `governance/AUTONOMY.md:433 @ bd5bcd09…`).
  - The test environment: `scripts/hooks/hooks.test.mjs:20-25 @ bd5bcd09…`. The halt test: `hooks.test.mjs:290-304 @ bd5bcd09…`.
  - The hook tests' CI step: `.github/workflows/governance-ci.yml:149-150 @ bd5bcd09…`. It runs on `ubuntu-latest`, and its glob picks up a new `scripts/hooks/*.test.mjs` file.
  - `.claude/state/` is gitignored: `.gitignore:44 @ bd5bcd09…`.
- **The trigger facts come from three sources, each marked where used:**
  - [D] the documentation report `<S>/rep-wake-docs.md` (14821 bytes; the custodian files it and replaces this cite). Its caveats, as the brief gives them:
    - its quotations are the fetch tool's model-extracted text, not the pages' raw bytes;
    - it records no fetch times;
    - some tools-reference rows were not seen. Its own caveats add that the docs list features newer than 2.1.314.
  - [N3] the custodian's note 3 to the advisor, 2026-11-14T22:28:47Z.
  - [B] the custodian's Bash tool description at Claude Code 2.1.314. It is not a documentation page.
- **A finding on the clock (it bears on OPEN-3).** `state/questions/round-76.md @ bd5bcd09…` carries no answers paragraph, though the filed ruling ADV-2026-11-13-11 names round 76 in its file name. `round-75.md:61 @ bd5bcd09…` does carry one. A clock that read answers from the tracked round files would already have alarmed falsely on round 76.
- **Hypotheses, each with its discriminator:**
  - H1: the custodian session's Bash tool environment carries `CUSTODIAN_TELEGRAM_BOT_TOKEN` and `CUSTODIAN_TELEGRAM_CHAT_ID`. The hooks' environment carries them: idle alerts reach the human (ADV-2026-11-14-23, its subject). No source states it for the Bash tool. Discriminator: the live check E1 (§9).
  - H2: a one-shot CronCreate task fires its prompt into the same idle session at its time [D, "CronCreate, CronList, CronDelete" (a) and (b)]. The cron's time zone is not in the pages read. Discriminator: E1.
  - H3 (OPEN-4 (b) only): a `run_in_background` shell appears in the Stop input's `background_tasks`. If it does, every stop allows at step 4 while the shell runs. No source states it. Discriminator: a stop logged while such a shell runs.
- **Not read:** user-level settings; the advisory folder; any transcript.

### §1. What this preregistration may and may not claim
- **May claim:**
  - `advisor-silence.mjs` records a sent item, records its answer, and on `check` sends one message per unanswered item at least two hours old, at most once per item (dry run);
  - it reads no Telegram variable itself, and with both variables unset it sends nothing;
  - the Stop hook sends the halt line once per halt, until a stop finds the switch absent;
  - the governing text of §2.6 and §2.7.
- **May not claim:**
  - that the alarm reaches the human while the custodian's session is closed or stopped by a usage limit;
  - that a one-shot task whose time passed while the session was closed is caught up. [D] says such a task is not restored. The custodian's `check` on resume catches it late (§2.6 (v));
  - that a failed send is retried;
  - that the advisor did not answer. The CLI knows only what the custodian recorded;
  - H1 and H2 before E1.
- No ADR is cited or amended. Nothing touches the wire or `docs/08`. No app string changes.

### §2. The change
- **2.1 `scripts/hooks/advisor-silence.mjs`, new.** Node's standard library and `./telegram.mjs` only.
  - (a) `sent <id>` records the item. `<id>` is `round-<n>` (`/^round-\d+$/`) or `PR-<number>-<12 hex>` (`/^PR-\d+-[0-9a-f]{12}$/`), the MERGE-CHECKS name of grant item 5 (b). It records `{sentAt: <ISO now>}` under `<id>` in `<project root>/.claude/state/advisor-wait.json`. A second `sent` for an item that is still open keeps its first `sentAt`; for an item already answered, it opens it again with a new `sentAt`.
  - (b) `answered <id>` records `answeredAt: <ISO now>` on the item. It exits 0 when the item is unknown, with one stderr line.
  - (c) `check` reads the file. For each item with no `answeredAt` and no `alarmedAt` whose `sentAt` is at least `SILENCE_MS` = 7200000 ms before now, it first writes `alarmedAt`, then sends `ADVISOR SILENT: no answer recorded for <id> since <sentAt> (two hours).` through `sendTelegram`, and then records `alarmOk` (true, false, or "skipped" when unset). The text is mine; the advisor rules it (OPEN-7).
    - When open items that are not yet due remain, it prints one stdout line `next-due <ISO>` for the earliest of them, so that the trigger's prompt can re-arm (OPEN-4 (a)).
    - It exits 0.
  - (d) Bad usage exits 2 with one usage line on stderr.
  - (e) The project root is `CLAUDE_PROJECT_DIR`, else `process.cwd()`, as the hooks resolve it.
  - (f) It never reads or prints a `CUSTODIAN_TELEGRAM_*` variable. The transport stays `telegram.mjs`'s, which gives three guarantees:
    - environment only, `telegram.mjs:40-41`;
    - never logged: no line there prints the token;
    - unset means no send, `telegram.mjs:49-54`.
  - (g) It has no cloud guard and no time option. Neither would have a product caller. The tests set `sentAt` by writing the state file.
- **2.2 `scripts/hooks/stop-queue.mjs`: the halt episode (ADV-2026-11-14-24 item 2 (c); OPEN-6 (a)).** This edits the notifications piece's merged text.
  - (a) Episode state is `<root>/.claude/state/halt-episode.json`, `{openedAt}`. It is per project, not per session, because the halt notice fires for every session (§24).
  - (b) In the halt branch: if the file exists, `notify` is not called. Otherwise the file is written, and then `notify` is called as the notifications piece left it. If the write fails, one stderr line is written and the send goes ahead, as `telegram.mjs:263-267` does.
  - (c) After `checkHalt`, a result of `halted: false` with no `unknown` removes the file if it exists. An `unknown` result (a failed fetch) neither opens nor closes an episode.
  - (d) Unchanged: `checkHalt`, the order of the override and the halt check, the halt stderr line, `notifyHalt` and its ten-minute dedupe, `TELEGRAM_DEDUPE_WINDOW_MS`, `decide`'s `notify` option and default, and every later step.
- **2.3 `scripts/hooks/README.md`:** a section for `advisor-silence.mjs`, and the halt-episode sentence in Stop step 1. The state-directory list gains the two files.
- **2.4 Tests:** a new `scripts/hooks/advisor-silence.test.mjs`, and §4's H-rows in `scripts/hooks/hooks.test.mjs`.
- **2.5 The trigger (held for the human's answer; OPEN-4).** Under (a), no file changes. The custodian, in the turn that sends, calls CronCreate for one one-shot task at `sentAt` plus 121 minutes, with the prompt `Run node scripts/hooks/advisor-silence.mjs check; if it prints next-due, create one one-shot task for that time with this same prompt.` Under (b), (d) or (e), §2 is redrafted by amendment before any code.
- **2.6 `governance/AUTONOMY.md`: §39 appended** after §38 and its trailing lines, the file's end at the merge base (OPEN-8). The text is in "Governing text", below. The advisor rules its words, and the custodian gives the worker the final section by file with its bytes and sha256 recorded here, as §2.6 of the notifications form did.
- **2.7 `governance/AI_DEVELOPMENT.md`: one pointer line appended at the file's end** (main's last line is `governance/AI_DEVELOPMENT.md:751 @ bd5bcd09…`). It is not inserted after §L (`:664-675`), because that would move every cited line below it.
- **2.8 These stay unchanged:** `telegram.mjs`; `notify-telegram.mjs`; `.claude/settings.json`; every other hook script; the Guardian and the mods; AUTONOMY above its end; AI_DEVELOPMENT above its end; `state/questions/`; and every line the notifications piece and `advisor-session-merges-under-the-humans-rule` claim.
- **2.9 Seams (the consumer's interface as it really is):**

| Seam | The consumer's real interface | End-to-end proof |
|---|---|---|
| advisor-silence → telegram | `sendTelegram(text)` resolves `{ok, dryRun}` or `{ok:false, skipped:true}` and never throws (`telegram.mjs:38-54 @ bd5bcd09…`) | A2, A6 through the shipped CLI |
| custodian's Bash → advisor-silence | argv `sent|answered <id>`, `check`; exit 0/2; `next-due` on stdout | A1–A5, A8 |
| CronCreate prompt → `check` | a prompt run by the model in the session [D] | E1 only (live; H2) |
| stop-queue halt branch → `notify` | the notifications piece's `notify(projectRoot, text)` default `notifyHalt` (its form §2.2 (c)–(e)); **re-read at its merge commit before code** | H1–H4; that form's T2–T4 pass unedited |

  The product callers are the custodian (`sent` and `answered`, under §39 (ii)) and the trigger (`check`, plus its `next-due` output). There is no test-only path.

### §3. Fixtures and scenarios (outcomes declared before the run)
Each scenario runs in a temporary project root, with `CLAUDE_PROJECT_DIR` set to it and `CUSTODIAN_TELEGRAM_DRY_RUN=1`, and with both Telegram variables unset unless the row says otherwise.
- **S1:** `sent round-90`, then `check`. Expected: no dry-run line, and stdout `next-due <sentAt+2h>`.
- **S2:** the state holds `round-90` with `sentAt` two hours and one second ago; `check`. Expected: exactly one stderr line `[telegram dry-run] would send: ADVISOR SILENT: no answer recorded for round-90 since <sentAt> (two hours).`, and `alarmedAt` written.
- **S3:** S2, then `check` again. Expected: no dry-run line.
- **S4:** S2's state with `answeredAt` set; `check`. Expected: no dry-run line.
- **S5:** `sent PR-318-63d66887aaaa` twice. Expected: `sentAt` equals the first.
- **S6:** S2's state, dry run off, both variables unset. Expected: exit 0, and exactly one stderr line, `telegram.mjs`'s no-op line.
- **S7:** `sent bogus`. Expected: exit 2 and one usage line.
- **S8 (halt):** a local `state/CUSTODIAN-HALT` holding `drill halt`, then two stops eleven minutes apart. Expected: one send.
- **S9 (halt):** S8, the file removed, a stop in a repository whose origin/main has no halt file, the file made again, a stop. Expected: two sends in all.
- **S10 (halt):** S8, the file removed and made again with no stop in between, a stop. Expected: one send in all.
- **S11 (halt):** S8, the file removed, a stop in a root that is not a repository (`unknown`), the file made again, a stop. Expected: one send in all.

### §4. Tests, one mutation each
A mutation is observed by applying it, running the named test, recording the first failing assertion in a `// RECORDED MUTATION:` comment with its commit, and reverting it. A `verify-mutation` run is not an observation (round 25, item 2 (c)).

| # | Test (file) | S | Mutation that fails it by name |
|---|---|---|---|
| A1 | `advisor-silence: check before two hours sends nothing and names the next due time` (advisor-silence.test.mjs) | S1 | `SILENCE_MS` set to 0 |
| A2 | `advisor-silence: an unanswered item past two hours sends one message through the shipped CLI` | S2 | the `sendTelegram` call removed |
| A3 | `advisor-silence: an item already alarmed is not sent again` | S3 | the `alarmedAt` write removed |
| A4 | `advisor-silence: an answered item past two hours sends nothing` | S4 | the `answeredAt` test removed |
| A5 | `advisor-silence: a second sent for an open item keeps its first sent time` | S5 | `sentAt` overwritten on every `sent` |
| A6 | `advisor-silence: with both Telegram variables unset, check sends nothing and exits 0` | S6 | the send replaced by `console.error(text)` |
| A7 | `advisor-silence: the CLI names no Telegram environment variable and sends only through telegram.mjs` (static read of the source) | — | a `process.env.CUSTODIAN_TELEGRAM_BOT_TOKEN` read added |
| A8 | `advisor-silence: bad usage exits 2 with one usage line` | S7 | the usage branch exits 0 |
| H1 | `stop-queue: a halt left in place sends one message across stops more than ten minutes apart` (hooks.test.mjs) | S8 | the episode-file write removed |
| H2 | `stop-queue: a halt made again after a stop that found it absent sends again` | S9 | the clear on `halted: false` removed |
| H3 | `stop-queue: a halt removed and made again between two stops sends nothing new` | S10 | the episode keyed on the file's first line |
| H4 | `stop-queue: a failed origin probe neither ends nor starts a halt` | S11 | `unknown` treated as absent |

These must pass unedited: the notifications form's T1 to T8, `scripts/plan/rotate-cut-state.test.mjs`, `scripts/hooks/guardian-continuity-parity.test.mjs`, `scripts/hooks/cloud.test.mjs`, and the rest of the CI line.

### §5. Predictions · declared unchanged · invalidators · falsification
- **Predicted:** every scenario of §3; CI green; verify-cites, verify-quotes, verify-test-claims, verify:plan and forms-layout each exit 0.
- **Declared unchanged:** the usage-limit alarm (the Notification entry and `notify-telegram.mjs`); the halt switch, its stderr line, the halt line's text and its 60-second probe cache; the lease and continuity steps; `telegram.mjs`; `.claude/settings.json`; the Guardian and the mods.
- **Invalidators** (the piece stops and queues):
  - I1: the notifications piece's merged `decide` differs from its form's §2.2;
  - I2: a settings entry or permission is needed;
  - I3: a Guardian refusal;
  - I4: a test outside Scope fails;
  - I5: the human's answer on item 4 (e) reserves the trigger the form names.
- **Falsification:** after E1, an item recorded `sent` and never `answered` passes two hours in an idle, open session, and no alarm, `alarmOk` or `next-due` follows. H2 is then false.

### §6. Instruments
Assertions only. There is no measurement and no `docs/08` row.

### §7. Declared values and ceilings
- `SILENCE_MS` = 7200000 ms bounds the wait before the alarm (the human's item 3, "two hours").
- The trigger offset is 121 minutes: the cron runs at minute granularity [D], plus one minute of margin.
- The budget is 180 minutes (ADV-2026-11-14-24 items 4 (b) and 9). §10's rule applies at twice that. See OPEN-9.
- Files: at most 7, not counting the form: `advisor-silence.mjs`, `advisor-silence.test.mjs`, `stop-queue.mjs`, `hooks.test.mjs`, `scripts/hooks/README.md`, `AUTONOMY.md`, `AI_DEVELOPMENT.md`.
- Lines: at most 540 changed lines, by `git diff --numstat $(git merge-base origin/main HEAD)..HEAD -- . ':!governance/AUTONOMY.md' ':!governance/AI_DEVELOPMENT.md' ':!governance/forms/scripts/ADVISOR-SILENCE-TWO-HOUR-ALARM-PREREGISTRATION.md'`, counting insertions plus deletions, README included. Code and tests alone: at most 480. An overrun is class 8.
- Every unpinned in-tree cite into an edited file still resolves (verify-cites exit 0).

### §8. Block-on-sight
1. Any settings file, the Guardian or a mod is touched.
2. `advisor-silence.mjs` reads or prints a `CUSTODIAN_TELEGRAM_*` variable, or sends other than through `telegram.mjs`.
3. A message beyond the three alarms is sent.
4. The halt line's text, `checkHalt`, the override and halt order, or `notifyHalt` is changed.
5. AUTONOMY or AI_DEVELOPMENT is edited anywhere above its end.
6. Any text says the alarm is sent while the custodian's session is closed or usage-limited.
7. Code lands before the human's answer on item 4 (e), or with a trigger that answer reserves.
8. A test-only option or path lands in the CLI.
9. Any CI step is red.
10. A passage marked verbatim is not byte-copied by script with its pin.

### §9. Gates
- **Architect and reviewer**, each to an affirmative PASS. The reports go under `state/consults/gates/`. Both clause-check §39 against the code at the head they review.
- **Reviewer check C1:** the head's AUTONOMY.md is the merge base's bytes, then one LF, then the custodian's §39 file. The script is the notifications form's C3, with the path argument changed. C1′ is the same for AI_DEVELOPMENT.md against the pointer file.
- **Suites** (each expected to exit 0; light node runs, no hold), each preceded by `env -u CUSTODIAN_TELEGRAM_BOT_TOKEN -u CUSTODIAN_TELEGRAM_CHAT_ID`:
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`;
  - `node scripts/plan/verify-cites.mjs`;
  - `node scripts/plan/verify-quotes.mjs`;
  - `node scripts/plan/verify-test-claims.mjs`;
  - `node scripts/plan/verify.mjs --offline`;
  - `node scripts/plan/forms-layout.mjs`.
- **E1 (live, after the merge, OPEN-10):** the custodian runs a dry-run drill in its own session. The item is `round-0` with `sentAt` two hours ago, written by script. A one-shot task two minutes ahead uses the §2.5 prompt with `CUSTODIAN_TELEGRAM_DRY_RUN=1` inline. The drill passes when the prompt fires in the idle session and the dry-run line appears. Without printing them, it also checks whether the Bash environment holds the two variables (H1). The drill item is then removed.

### §10. Amendments — opens empty, append-only

---

## Governing text (proposed; my wording; the advisor rules the words)

**§39, appended after §38.** There is no blank line inside the heading line. It is written for OPEN-4 (a), and under another trigger, item (ii) is redrafted.

> ## §39. The advisor's two hours of silence, and one halt message per halt (ADV-2026-11-14-24, items 2, 4 and 6, under the delegation of 2026-11-13; appended after §38 so that no line a record cites above it moves)
>
> - **(i) What this adds to §38.** From the merge of the piece that adds this section, §38 Part B (vi) is read as (ii) to (iv) below, and Part B (v) gains (v) below. §38 is not edited.
> - **(ii) The clock.** When the custodian sends the advisor a round file's path or a merge check, it runs `node scripts/hooks/advisor-silence.mjs sent <id>` in the same turn, where `<id>` is `round-<n>` or `PR-<number>-<first 12 of the head>`. In that turn it also creates one one-shot scheduled task with CronCreate, 121 minutes ahead, whose prompt runs `node scripts/hooks/advisor-silence.mjs check` and re-arms on a `next-due` line. When the advisor's session message answering the item arrives, the custodian's first act is `node scripts/hooks/advisor-silence.mjs answered <id>`.
> - **(iii) What is sent.** `check` sends one message for each item recorded as sent at least two hours earlier with no answer recorded, at most once per item, through `scripts/hooks/telegram.mjs` (§38 (iii)). A failed send is not retried. The record is `.claude/state/advisor-wait.json`, on this machine only; the round file stays the tracked record (item 2 of the human's message).
> - **(iv) What it does not cover.** No alarm is sent while the custodian's session is closed or stopped by a usage limit. On resuming, the custodian runs `check` once and re-creates the task for each open item. The script reads no transcript and no file of the advisory folder.
> - **(v) The halt alarm.** After a stop that sent the halt line, no stop sends it again until a stop finds the halt switch absent, locally and on `origin/main`. A stop whose `origin/main` probe fails neither ends nor starts a halt.
> - **(vi)** `governance/AI_DEVELOPMENT.md` §L is read under §38 and this section.

Clause check against §2:
- (ii) holds by §2.1 (a)–(b) and §2.5.
- (iii) holds by §2.1 (c) and (f).
- (iv)'s first sentence holds by [D]'s Limitations rows and §1. Its "on resuming" sentence is an obligation on the custodian; no code proves it.
- (v) holds by §2.2 (b)–(c).
- (i) leaves §38 (v)'s ten-minute sentence still true, because `notifyHalt` is unchanged.

**The AI_DEVELOPMENT.md pointer** is appended after line 751, with one blank line before it:

> *Pointer (<date>; ADV-2026-11-14-24 item 6 (b)): §L above, Telegram alerts, is read under `governance/AUTONOMY.md` §38 and §39; where §L differs from them, they govern. §L is not edited.*

**The mechanics,** for both: an append only, so no cited line moves; the custodian's file is given to the worker; the reviewer runs C1 and C1′. The section number is §39 if this piece merges before `advisor-session-merges-under-the-humans-rule`, otherwise §40. The heading's number is filled at form commit.

---

## Notes

**N1. The clock (step 1).**
- A script on this machine cannot see a session message without reading a transcript, which is barred. It can see only two things:
  - a marker the custodian writes, at the send and at the receipt;
  - files in the advisory folder. A MERGE-CHECKS verdict is named `PR-<n>-<head12>.md` (grant item 5 (b), `…grant…md:30 @ bd5bcd09…`). PASTES ruling files are named by ADV id and do not name their round. The folder's path is not in the tree.
- So the draft's marker is written by the custodian, through the CLI:
  - **when:** `sent` in the sending turn; `answered` as the first act on the reply;
  - **format:** a JSON map `<id>` → `{sentAt, answeredAt?, alarmedAt?, alarmOk?}`, ISO UTC;
  - **where:** `.claude/state/advisor-wait.json`, on the machine only, matching `telegram-sent.json`'s convention (`telegram.mjs:17-20 @ bd5bcd09…`).
- The round file stays the tracked record, and nothing in it is added by script. The round-76 finding in §0 is why the clock does not read the tracked file.

**N2. The trigger, tool by tool (step 2).** I could not settle Monitor: no source describes it beyond [B]'s one clause.

| Tool | Wakes the same session | Runs while the session waits | Shortest / longest delay | Needs | Outlives session/restart | Ends on its own | Runs `telegram.mjs` with the env token |
|---|---|---|---|---|---|---|---|
| CronCreate | yes, session-scoped [D] | yes: "Tasks only fire while Claude Code is running and idle." [D] | 1 minute [D]; one-shot maximum not found [D]; recurring expires after 7 days [D]; 50 tasks [D] | no setting; `CLAUDE_CODE_DISABLE_CRON=1` disables it [D]; plan/permission/network: not found [D]; changelog 2.1.325 (after 2.1.314) asks before a skill with `allowed-tools` [D] | restored on `--resume`/`--continue` "except recurring tasks that have expired and one-shot tasks whose scheduled time has passed" [D]; with fetching off, kept in the project's `.claude/scheduled_tasks.json` [D], a path not in `.gitignore` (`.gitignore:33,44 @ bd5bcd09…` list only `settings.local.json` and `state/`) | one-shot: "deletes itself after running" [D] | only through a model turn that runs Bash; the token in the Bash environment is H1 (no source) |
| CronList / CronDelete | management only [D] | — | — | as CronCreate | — | — | no |
| ScheduleWakeup | within a `/loop` in the open session [D]; explicit statement not found [D] | `/loop` "Requires open session" [D] | 1 minute to 1 hour, self-paced [D]: one wake cannot reach 2 h; at 2.1.314 a 20-minute fallback probably applies (the report's own inference) | the `/loop` skill [D]; "for /loop only" [N3] | "A self-paced `/loop` isn't restored" [D] | `stop: true` [D] | as CronCreate |
| RemoteTrigger | no: "Each run opens as a full session, a new one for each run." [D] | yes, in the cloud; the machine may be off [D] | minimum 1 hour [D]; maximum not found [D] | Pro/Max/Ultra/Team/Enterprise plan, claude.ai login, organization toggle, cloud environment [D] | yes [D] | one-off: yes [D] | no: the cloud session cannot read this machine's `.claude/state/`, the hooks are inert there (`cloud.mjs`), and the token would have to sit in a cloud environment |
| Background shell (`run_in_background`) | yes: "re-invokes you when it exits" [B]; that is a wake, barred by item 4 (e) | yes: "it keeps running across turns" [B] | not stated [B]; foreground `sleep` is blocked [B] | none stated [B] | not stated in any source | yes, when its command exits [B] | the shell itself could run node; the token is H1 (no source). H3: it may make every stop allow at step 4 (`stop-queue.mjs:344-347 @ bd5bcd09…`) |
| Monitor | not in [D]; [B] says only "use Monitor with an until-loop to wait on a condition" | unknown | unknown | unknown | unknown | unknown | unknown |

Option (ii) is out. The ruling's reason, a waiting session ends no turn, agrees with [D]: "Stop hooks fire whenever Claude finishes responding". [D] also says "Command hooks ... can't trigger `/` commands or tool calls."

**When the session itself is stopped:**
- **By a usage limit.** Nothing in [D] says whether a cron prompt runs then. My inference: the prompt needs a model turn, so `check` does not run. A background shell's process is not stated either way. The quota alarm (§38 (iv)) is the alarm for that case.
- **By a closed window.** Cron tasks stop firing [D]. A one-shot task whose time passed is not restored [D]. Nothing is stated for a background shell.

**Which options are reserved:**
- (iii), the Windows scheduled task, is reserved by item 4 (d) of the ruling, under the grant's 4 (c) (credentials and keys; settings) and 4 (e) (the machine's rules).
- RemoteTrigger is reserved under 4 (c), credentials and keys, because the token would leave the machine. It may also fall under 4 (d), anything that costs money, if the human's plan bills for it.
- CronCreate, ScheduleWakeup, Monitor and the background shell are the doubt of item 4 (e). Until the human answers, none is loaded [N3] (ruling item 4 (e)).

**N3. The halt dedupe (step 5).** The rule is per project and per episode, as §2.2 sets out:
- A removed and re-made file is a new halt only if some stop saw it absent in between.
- A fetch failure is not "absent".
- With `CUSTODIAN_STOP_HOOK=off`, `checkHalt` is not called (`stop-queue.mjs:302-304 @ bd5bcd09…`), so no episode closes.

**N4. The route (step 7).** My estimates are 130 lines for the CLI, 200 for its tests, +30/−4 in stop-queue, +90 in hooks.test and +40/−4 in the README: about 500 in all, which is over §21c. Full gating applies (§21a security posture and §21c), and §36 does not.

180 minutes is tight. One worker build is about 90–120 minutes, plus two gates and any correction round. The 2× stop falls at 360 minutes (`governance/AUTONOMY.md:199 @ bd5bcd09…`). See OPEN-9.

**N5. Guardian (read only; `tools/mods/spatial-guardian/README.md:11-23 @ bd5bcd09…`).** A worker's Write or Edit of any Scope file is not refused:
- G3 covers only filed `*PREREGISTRATION.md` files and accepted ADRs;
- G4 covers only `state/directives/`;
- G8 allows "the repository's other `.claude` files" (`:19`);
- both new files sit in an existing folder (`:82`, the new-folder over-refusal, does not apply).

Two more facts:
- No rule reads CronCreate or the other session tools: Guardian registers on Write, Edit, NotebookEdit, Bash and PowerShell only (`:23`, `:88-90`).
- AUTONOMY's append-only rule is not enforced by Guardian, so check C1 is the guard.

**N6. Rule (00) at bd5bcd09.** This piece touches:
- `scripts/hooks/advisor-silence.mjs`, `advisor-silence.test.mjs`, `stop-queue.mjs`, `hooks.test.mjs` and `README.md`;
- `governance/AUTONOMY.md` and `governance/AI_DEVELOPMENT.md`.

Overlaps:
- With the notifications piece: `stop-queue.mjs`, `hooks.test.mjs`, the README and AUTONOMY. It is a dependency already.
- With `advisor-session-merges-under-the-humans-rule`: AUTONOMY, and possibly AI_DEVELOPMENT. Whichever form is committed first runs first (ADV-2026-11-14-24 item 4 (c)).
- None with the branches of port-2, PR B or #322, by the brief's lists. None touches `protocol/`.

**N7. §37 (`governance/AUTONOMY.md:698-709 @ bd5bcd09…`).**
- Under OPEN-4 (a), the task is not a shell. A one-shot task ends on its own [D], and the closing checklist needs no change.
- Under (b), the alarm shell is a background shell started for a round or merge check, and the checklist's item 1 would kill it at a piece's closing record. The form would have to say which piece owns it.

---

## OPEN ITEMS (one packet to the advisor)

- **OPEN-1. Which messages start the clock.**
  - Options: (a) rounds only; (b) rounds and merge checks; (c) any question.
  - Recommended: (b). Each has a named artifact for `<id>` and a defined answer. Under (c), "any question" has no key.
  - Not reserved.
- **OPEN-2. What counts as the advisor's answer.**
  - Options: (a) the advisor's session message replying to the item (a ruling id, a verdict, or a request for time), recorded by `answered` as the custodian's first act; (b) only the PASTES or MERGE-CHECKS file, once read; (c) a script watching the advisory folder.
  - Recommended: (a). The human's words are "has not answered you".
  - Not reserved, except that (c) would need the folder's path in an environment variable or session setting. That may fall under the grant's item 4 (c) (any session's settings), and the advisor says whether it does.
- **OPEN-3. Where the marker lives.**
  - Options: (a) the machine only, `.claude/state/advisor-wait.json`; (b) tracked lines in the round file; (c) both.
  - Recommended: (a). The round-76 finding (§0) applies, and a tracked marker needs a commit while the session waits.
  - Not reserved.
- **OPEN-4. The trigger.**
  - Options: (a) a CronCreate one-shot per item at +121 minutes; (b) a background shell; (c) ScheduleWakeup, which does not fit (1 hour at most, `/loop` only); (d) RemoteTrigger; (e) a Windows scheduled task; (f) none: the custodian runs `check` at each turn's start, which does not alarm while it waits and so does not meet item 3.
  - Recommended: (a), if the human's answer allows it. It ends on its own, leaves the Stop hook as it is, and wakes only at the due time.
  - Reserved: (a), (b) and (c) wait on the human's answer to item 4 (e). (d) is reserved under grant 4 (c), credentials, and possibly 4 (d), money. (e) is reserved by the ruling's item 4 (d), under grant 4 (c) and (e).
- **OPEN-5. Order.**
  - Options: (a) this form is committed only after the human answers, and `advisor-session-merges-under-the-humans-rule` runs meanwhile; (b) commit now and build without a trigger; (c) split the halt dedupe into a piece of its own now.
  - Recommended: (a). Under (b), `check` and `next-due` would land with no product caller, which the caller rule blocks by name. (c) adds a third AUTONOMY appender under rule (00).
  - Not reserved.
- **OPEN-6. A removed and re-made halt.**
  - Options: (a) it is new only after a stop saw the switch absent; (b) it is new when its first line changes.
  - Recommended: (a). The human's words are "until the file is removed".
  - Not reserved.
- **OPEN-7. The alarm's text.**
  - Options: (a) `ADVISOR SILENT: no answer recorded for <id> since <sentAt> (two hours).`, which is mine and states the CLI's own fact, as the engine-facts rule asks; (b) the advisor's words.
  - Recommended: (a).
  - Not reserved.
- **OPEN-8. The shape of the governing text.**
  - Options: (a) a §39 with the text above; (b) one amendment line after §38.
  - Recommended: (a). It carries mechanics, as §36 and §37 do.
  - Not reserved.
- **OPEN-9. The budget.**
  - Options: (a) 180 minutes, stopping at 360 under §10; (b) 300 minutes.
  - Recommended: (b), on N4's estimate. This is an estimate, not a measure.
  - Not reserved.
- **OPEN-10. The live check E1.**
  - Options: (a) the dry-run drill of §9; (b) none, so the first real silence is the evidence; (c) a real-send drill.
  - Recommended: (a).
  - Reserved: (a) creates a schedule, so it falls under the human's answer on item 4 (e). (c) would send a Telegram message beyond the three alarms, which item 3 of the human's message does not allow, so it is the human's alone.

---

## Facts for item 4 (e) (neutral; the advisor writes the draft)

The grant's words are "any session's permissions or settings" (`…grant…md:22 @ bd5bcd09…`).

1. [D]: CronCreate tasks are "session-scoped". Creating one needs no slash command. The pages read name no setting, permission or plan for it. The scheduler is disabled by the environment variable `CLAUDE_CODE_DISABLE_CRON=1`, which the session does not set.
2. [D]: with fetching off, a task the human asked to keep across sessions is stored in the project's `.claude/scheduled_tasks.json`. That file is not among the settings files Appendix B lists (`governance/AUTONOMY.md:423 @ bd5bcd09…`, at 2.1.270), and it is not in `.gitignore` at bd5bcd09.
3. [D], changelog 2.1.325, which is later than the installed 2.1.314: scheduled tasks ask before running a skill that declares `allowed-tools` or hooks, and `permissions.allow` lets it run unattended. At that build, scheduled tasks meet the permission settings.
4. [D]: a fired task re-runs a prompt in the session, so each firing is a model turn on the human's account. Whether that costs money is a billing fact the tree does not hold (the grant's item 4 (d)).
5. The PLAN node's summary already reserves, as drafts for the human, "any scheduled task or other process holding the Telegram token" (`governance/PLAN.yaml:7278 @ bd5bcd09…`). Under OPEN-4 (a), the process that holds the token is `check`, run by the session's Bash tool. Whether that tool's environment holds the token is H1 and is unknown.
6. [B]: a background shell is not a schedule object. It is a process that re-invokes the session when it exits.
7. Guardian reads none of these tools (N5). The custodian has loaded none of them [N3].
8. The settings file holds no `permissions` key at bd5bcd09 (`.claude/settings.json:1-103 @ bd5bcd09…`).

---

## What I could not settle

- Monitor's behaviour; ScheduleWakeup's and CronCreate's tools-reference rows; the cron time zone; the longest one-shot delay. None is in [D].
- H1, whether the Bash environment holds the token, and H3, whether a background shell appears in `background_tasks`.
- The notifications piece's merged `decide`, `notifyHalt` and §38 line numbers. Every pin into `stop-queue.mjs`, `hooks.test.mjs`, `scripts/hooks/README.md` and AUTONOMY §38–§39 waits for that merge, and so do §7's line figures.
- Whether this piece's §39 or the merge-rule piece's section comes first, so the section number.
- Overlap: the title of `advisor-session-merges-under-the-humans-rule` (`governance/PLAN.yaml:7230 @ bd5bcd09…`) names "the two-hour fallback to the human". That is a second two-hour clock, and its form is undrafted. Whether it reuses this piece's marker is not designed.
- `state/questions/README.md` does not exist at bd5bcd09.

Files: `C:/dev/spatial-ide/governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`, `C:/dev/spatial-ide/scripts/hooks/telegram.mjs`, `C:/dev/spatial-ide/scripts/hooks/stop-queue.mjs`, `C:/dev/spatial-ide/governance/AUTONOMY.md`, `C:/dev/spatial-ide/governance/AI_DEVELOPMENT.md`, `C:/dev/spatial-ide/governance/PLAN.yaml`, `C:/dev/spatial-ide/state/questions/round-76.md`, `<S>/rep-wake-docs.md`.
