# Consult — the architect's draft for round-mirror-pretooluse-hook (2026-10-02)

*Custodian's filing note: one hand-back from the architect agent on the custodian's brief (a drafting consult, not a gate), read at main 9cb272e, recorded verbatim below with the harness's report indentation removed. The harness prefixed the hand-back with a note that it matched an instruction-shaped pattern (settings-json), because the draft plans an edit to `.claude/settings.json`. That edit is the piece's own adopted scope (round 33, item 3), not an instruction to the custodian. The harness note is not part of the agent's text and is not reproduced. The draft is kept here whole. When it is committed as `scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md`, the form's header lists the custodian's edits. On (c)'s second routed item: AUTONOMY.md §4's typed-text rule for red-line items was in fact broken in round 33 (items 1 and 8). It was corrected in the round 33 RULED block and re-asked in round 34, whose items 1 to 3 were answered typed.*

---

Drafting consult, not a gate: main @ 9cb272e (read only; nothing was run, and no hash was computed).

```markdown
# The round mirror as a PreToolUse hook on AskUserQuestion, one call per round (PLAN node `round-mirror-pretooluse-hook`) — preregistration

**Authority:** question round 33, item 3 (RULED 2026-10-02 — question round 33), cited by round and item and not reproduced. The binding words are that item's option label. The shape it adopted is the custodian's proposal, `state/drafts/weekly-window-2026-10-02.md:96-144` @ 9cb272e sha256:<custodian>. The item as asked is `state/questions/round-33.md:18-21` @ 9cb272e sha256:<custodian>. The origin is `state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md:25-28` @ 9cb272e sha256:<custodian> (item 6(a)). The one-call-per-round recommendation is `state/directives/2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md:28-30` @ 9cb272e sha256:<custodian> (item 3). The draft and the question are not the human's words, and nothing below quotes them. Node: `PLAN.yaml:3450-3466` @ 9cb272e sha256:<custodian>.
**Drafted by** the architect agent on the custodian's brief, read at `main` 9cb272e (the consult: <custodian>). Shape model: `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** <custodian>.
**Gating:** full, under two §21a/§21c heads, each enough on its own:
- **A property currently under test, and a stated invariant on the answer path.** The new settings command falls under the cloud-inert test that every settings command must pass (`scripts/hooks/cloud.test.mjs:48-59` @ 9cb272e sha256:<custodian>). The piece exports and reuses §24's lease reader (`scripts/hooks/stop-queue.mjs:143-155` @ 9cb272e sha256:<custodian>). The hook runs on every AskUserQuestion call, the channel that §4 keeps as the sole answer channel (`AUTONOMY.md:108-118` @ 9cb272e sha256:<custodian>).
- **Size.** The piece is over §21c's bound (§7).

No new exposure surface is claimed. The outbound channel, its transport and its content class are §16's existing round mirror (`AUTONOMY.md:278-288` @ 9cb272e sha256:<custodian>), and the content is the same round text that is committed to the public repository. The architect confirms this reading or adds the security head. Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- **Reasoned from code at 9cb272e. Nothing was run.** These parts of the code are relied on:
  - `mirrorRound`, its injected senders, and its message-or-document split on the 4096-code-point boundary: `scripts/hooks/questions-mirror.mjs:60-78` @ 9cb272e sha256:<custodian>;
  - the CLI entry, which treats `argv[2]` as a file, and its exit 1 on a failed send: `scripts/hooks/questions-mirror.mjs:80-114` @ 9cb272e sha256:<custodian>;
  - `countItems` and `buildSummary`: `scripts/hooks/questions-mirror.mjs:41-51` @ 9cb272e sha256:<custodian>. These count `---` rules plus one, so a round file with a header rule is counted one item high on the document path. That defect is routed and not fixed here (§1, may not claim);
  - the dry-run path and the missing-credentials no-op, both of which resolve without network I/O: `scripts/hooks/telegram.mjs:39-54` @ 9cb272e sha256:<custodian> and `scripts/hooks/telegram.mjs:148-162` @ 9cb272e sha256:<custodian>;
  - the 8-second per-send timeout: `scripts/hooks/telegram.mjs:35` @ 9cb272e sha256:<custodian>;
  - the project-root resolution and the lease reader: `scripts/hooks/stop-queue.mjs:58-60` @ 9cb272e sha256:<custodian> and `scripts/hooks/stop-queue.mjs:143-155` @ 9cb272e sha256:<custodian>;
  - the cloud marker: `scripts/hooks/cloud.mjs:11-15` @ 9cb272e sha256:<custodian>. Its entry-guard pattern is in `scripts/hooks/notify-telegram.mjs:76-79` @ 9cb272e sha256:<custodian>;
  - the hook-shell helper, and the settings-wide cloud test whose recorded mutation names `questions-mirror.mjs` as an unguarded script: `scripts/hooks/cloud.test.mjs:43-59` @ 9cb272e sha256:<custodian>;
  - the test file's Telegram stubs: `scripts/hooks/questions-mirror.test.mjs:15-17` @ 9cb272e sha256:<custodian>;
  - the existing hook wiring and the notifier's timeout: `.claude/settings.json:78-89` at 9cb272e, sha256 <custodian>.
- **The lease id.** `AI_DEVELOPMENT.md:725` @ 9cb272e sha256:<custodian> and §24 (`AUTONOMY.md:472-474` @ 9cb272e sha256:<custodian>) define it as the value that hooks receive on stdin as `session_id`. This piece reads that field, through the shipped reader, and does not read the environment variable.
- **The format.** The hand-written rounds' layout is `state/questions/round-33.md:1-8` @ 9cb272e sha256:<custodian>. The ledger's round-33 RULED block discloses that call 1's question texts condensed the mirror's wording, and that every option was asked as a short label with the mirror's text as its description (round 33, the RULED block's preamble). A hand-written file and the call it mirrors therefore differ in fact. §2 item 9 is built on that.
- **Appendix B is a historical pin** (Claude Code 2.1.270, fetched 2026-09-13). Each pin below is authoritative for what was verified then, and E2 tests the running version:
  - matcher evaluation: a letters-only matcher takes the exact-string path (`AUTONOMY.md:453` @ 9cb272e sha256:<custodian>);
  - the default timeout (`AUTONOMY.md:427` @ 9cb272e sha256:<custodian>);
  - routing on exit 0: stdout to the debug log for every event except the four named ones, and stderr to the debug log only (`AUTONOMY.md:429` @ 9cb272e sha256:<custodian>);
  - Git Bash as the command shell on Windows (`AUTONOMY.md:425` @ 9cb272e sha256:<custodian>).

  Appendix B carries **no** PreToolUse fact. The draft's hook-contract quotes come from a web page of 2026-09-29, an untracked source. None is relied on as Authority, and each one used is a hypothesis below.
- **H1 (hypothesis):** PreToolUse fires for `AskUserQuestion` under the matcher `AskUserQuestion`. Discriminator: E2.
- **H2 (hypothesis):** the event's stdin carries the call under `tool_input`, with `questions[]` keyed as the session transcript recorded the tool input: per question `question`, `header`, `multiSelect`, `options`; per option `label`, `description`. Discriminator: E2. E1 proves the hook against this shape, and does not prove that the event delivers it.
- **H3 (hypothesis):** the PreToolUse `session_id` equals the lease id, as it does for Stop. Discriminator: E2. If they differ, the hook is silent in the custodian's session, and that is I1.
- **H4 (hypothesis):** inside a subagent the stdin carries `agent_id`. No discriminator is run (§1, may not claim).
- **H5 (hypothesis):** exit 0 with empty stdout leaves the call unaltered and unblocked. Discriminator: E2.
- **H6 (hypothesis):** the hook completes before the question is processed. Discriminator: E2, which shows only that the outcome line precedes the answer.
- **H7 (hypothesis):** a hook cancelled at its timeout leaves the call to proceed. Not discriminated. §7's timeout exceeds the worst case of two 8-second sends, so no declared path relies on H7.
- **Untracked inputs.** The fixture's `tool_input` (§3) is byte-copied by the custodian from this session's transcript, an untracked file. It is evidence of the shape and not Authority, and the transcript's path is never recorded.
- **Fixture drive:** nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. In a session that holds the lease, outside a subagent and outside a cloud session, each AskUserQuestion call writes exactly one new file, `state/questions/round-<n>.md`, where n is one more than the highest existing round number. The file is that call's own questions and options in §7's format, and it is sent once by `mirrorRound`: one message, or a summary followed by the document above 4096 code points (T1 to T4, T11, T13).
  2. The hook exits 0 with empty stdout on every path: a silent case, malformed input, a write failure, a failed send, an unexpected error (T5 to T10). It never returns a decision, `permissionDecision` or `updatedInput`, and never exits 2.
  3. In the three silent cases the hook writes nothing, sends nothing and prints nothing (T5 to T7).
  4. The repository's real settings command, run through the hook shell with a recorded payload, produces claim 1's file and send (T11, E1).
- **May not claim:**
  - **Live behaviour before E2:** H1 to H3, H5 and H6.
  - **The subagent case live** (H4). It is unit-tested only.
  - **No delay.** The question can wait for up to two Telegram sends, each bounded at 8 s, before it shows.
  - **Parallel AskUserQuestion calls in one message.** The second write may find its number taken. It then writes nothing and sends nothing (`wx`, §2 item 8), and the custodian's check (§2 item 15) catches it.
  - **A call that is never displayed.** If the call is rejected after the hook runs, the hook has already written and sent its round.
  - **Telegram delivery.** `ok` is the HTTP result.
  - **The document path's item count.** `buildSummary` counts one high on every file with a header rule (§0; routed).
  - **Any scan of the round text for profile paths before the send.** The committed file still passes the pre-commit scan.
  - **macOS:** no run (R5).
  - **Any `docs/08` figure.**
- **Unchanged:**
  - `mirrorRound`, `buildSummary`, `countItems`, `extractRoundNumber`;
  - the file-argument CLI, including its exit codes;
  - `telegram.mjs` and `cloud.mjs`;
  - every line of `stop-queue.mjs` except one `export` token;
  - every other hook entry in `.claude/settings.json`;
  - every existing test and its recorded mutation, including `scripts/hooks/cloud.test.mjs:48-50` @ 9cb272e sha256:<custodian>, which stays true because the file-argument CLI stays unguarded;
  - Telegram stays read-and-copy, and AskUserQuestion stays the sole answer channel;
  - no dependency, no `package.json`.

  ADR-006 does not apply: this is repository tooling, not a product operation. No ADR is cited or amended.
- **Seams** (each written against the other side's interface as cited in §0):
  - **Claude Code's PreToolUse stdin into the hook:** H1 to H4. The real shape is proven by E2, and E1 runs the shape the transcript recorded.
  - **`.claude/settings.json` into the script:** proven by T11, which runs the command string read from the file and never retyped.
  - **The hook into `mirrorRound`:** the existing export, called with its real signature.
  - **The hook into `leaseHeldBy`:** gains `export`. Its product caller is the hook mode, which lands in the same PR.
  - **The hook into `isCloudSession`.**
  - **The hook to the custodian:** the round file and the outcome line (§2 items 10 and 15).
  - **No other new export.** Every new test spawns the shipped CLI.

## §2. The change
1. **CLI:** `node scripts/hooks/questions-mirror.mjs --hook` reads one JSON object from stdin. When `argv[2]` is exactly `--hook`, the entry dispatches to the hook mode. Otherwise `main()` runs unchanged.
2. **Cloud guard:** the first statement of the hook branch, before stdin is read. When `isCloudSession()` is true it exits 0 with no output. The guard is placed in the hook branch only, so the file-argument CLI is unchanged.
3. **Fields read:**
   - `session_id`, `agent_id` and `cwd`;
   - `tool_input.questions[]`, and from each question `question` and `options[]` with each option's `label` and `description`.

   Nothing else is read: no `header`, `multiSelect`, `tool_name`, `prompt_id` or `tool_use_id`. Project root: `CLAUDE_PROJECT_DIR`, else `cwd`, else `process.cwd()`, as in `stop-queue.mjs`.
4. **Silent cases, in this order, after parsing.** A silent case means exit 0, no stdout, no stderr, no file and no send:
   - (a) `agent_id` is present and is neither null nor an empty string;
   - (b) `leaseHeldBy(projectRoot, session_id)` is not held. That covers no `session_id`, a lease file that is absent or unreadable, a relinquished or malformed lease, and another session's lease.
5. **Malformed input:** one stderr fact line (§7), exit 0, nothing written and nothing sent. It covers:
   - stdin that is not JSON;
   - `questions` that is not a non-empty array;
   - a question whose `question` is not a non-empty string;
   - `options` that is not an array;
   - an option whose `label` is not a non-empty string;
   - a `description` that is present but not a string.
6. **Numbering:** list `<root>/state/questions`, keep the names matching `^round-(\d+)\.md$`, and take the base-10 maximum plus 1, or 1 when none matches. No git call is made. A missing directory gives a stderr fact line, and nothing is written.
7. **Rendering:** §7's format, in the call's order. Each `question`, `label` and `description` is copied byte for byte. The hook adds only the header line, the item numbers, the option numbers, the ` — ` joiner and the separators. A question whose text begins with `RED LINE` is listed in the header. The item text carries its own marker, and the hook inserts none.
8. **Write:** UTF-8 with no BOM, LF line endings, flag `wx`. On failure the hook prints a stderr fact line and sends nothing.
9. **One writer per call.** In the lease session the hook is the only writer of a round file for an AskUserQuestion call (§2 item 15). The hook does not look for, adopt or skip on a hand-written file. Each call is its own round, numbered by call. No grouping and no dedupe are applied, since `sendTelegramDeduped` would collapse a second call.
10. **Send:** `mirrorRound({ file: <absolute path of the written file>, sendMessage, sendDocument, readFile })`. Then one JSON line is appended to `<root>/.claude/state/round-mirror.jsonl` (gitignored, under the existing `.claude/state/` entry): `{"at": <ISO UTC>, "round": <n>, "file": "state/questions/round-<n>.md", "mode": <mode>, "ok": <bool>}`. The line carries no question text and no session id. A failed send prints a stderr fact line and still exits 0.
11. **Never throws:** the whole branch is wrapped. An unexpected error prints one stderr fact line and exits 0, and nothing is ever written to stdout.
12. **`scripts/hooks/stop-queue.mjs`:** `function leaseHeldBy` becomes `export function leaseHeldBy`. Nothing else changes.
13. **`.claude/settings.json`:** one `PreToolUse` entry, with matcher `AskUserQuestion`, `type: command`, command `node "$CLAUDE_PROJECT_DIR/scripts/hooks/questions-mirror.mjs" --hook` and `timeout: 20`.
14. **`scripts/hooks/README.md`:** the round-mirror section gains the hook mode, its fields read (with H1 to H4 labelled as hypotheses), the silent cases, the outcome line and the single-writer rule. It quotes nothing. `questions-mirror.mjs`'s header comment gains one sentence naming the hook mode and this form, and quotes nothing.
15. **`AUTONOMY.md`:** one dated section, appended at the end at the next free section number. It is the human's ruling's record (round 33, item 3), cited by round and item. It edits neither §4 nor §16 in place, and says:
    - from the merge, in the lease session, the hook carries §4's round mirror for every AskUserQuestion call; the proof is T11, with the live record at this form's E2;
    - each call is its own round: a batch of more than four questions is consecutive rounds, and the digest's "question set n of m" stays;
    - the custodian writes no round file by hand for a call and runs no CLI before one. Context goes in the question text or in a `state/drafts/` file that the text names;
    - after each call the custodian checks for the new file and the last outcome line. A missing file, or `ok: false`, is mirrored or re-sent by hand with the file-argument CLI, and the ledger records it;
    - a round answered without a call (round 32's shape) is still filed by hand;
    - the custodian commits each hook-written file with its RULED record.
16. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65` @ 9cb272e sha256:<custodian>):
    - **R1:** one rendering and numbering rule on every platform. Paths are built with `path.join`, and the file is written with LF line endings.
    - **R2:** no OS-conditional code in the script. The tests' hook-shell helper keeps its existing win32 branch, copied from `cloud.test.mjs`, and test code is outside R2.
    - **R3:** Windows is supported and tested locally; it is the custodian's machine, and E2 runs there. Linux is supported and tested in governance-ci, where E1 runs through `/bin/sh`. macOS: no run and no claim.
    - **R4:** temp paths come from `os.tmpdir()`, children are spawned with `process.execPath`, the hook shell is spawned only by T11 (as `cloud.test.mjs` does), and no drive letter appears.
    - **R5:** L1 only.
    - **R6:** no test is ignored on any platform.

## §3. Fixtures and predicted outcomes
- **The fixture** is `scripts/hooks/fixtures/pretooluse-askuserquestion.json`:
  - `tool_input` is byte-copied by the custodian at dispatch from round 33's second recorded call (items 5 to 8; item 8 is RED LINE);
  - the envelope keys are those the hooks page lists for PreToolUse (H2), with invented values: `session_id` `fixture-session`, a relative invented `transcript_path` and `cwd`, and `hook_event_name` `PreToolUse`;
  - it holds no user-profile path, token or chat id.
- **The test project.** Every test project is a fresh `os.tmpdir()` directory holding `state/questions/` and, where the lease is held, `CUSTODIAN-LEASE` with `lease: fixture-session …`. It is removed with `t.after`.
- **Telegram in the tests.**
  - The child's environment is built explicitly, with no token, no chat id and no `CLAUDE_CODE_REMOTE`, and with `CUSTODIAN_TELEGRAM_DRY_RUN=1` except in S8 and S12.
  - S8 and S12 omit dry-run as well, so `sendTelegram` returns its skipped result before any request is made.

| # | Input and project | Exit / stdout | Files | Stderr |
|---|---|---|---|---|
| S1 | the fixture; `round-7.md` present; lease held | 0 / empty | `round-8.md` is §7's header line followed by the literal expected body, written by hand in the test from the fixture | one dry-run send line |
| S2 | a two-question call; question 2 begins `RED LINE` | 0 / empty | header reads `RED LINE items: 2.` | — |
| S3 | `round-2.md`, `round-9.md`, `round-10.md`, `round-3-draft.md`, `.gitkeep` | 0 / empty | `round-11.md` | — |
| S4 | S1's call run twice in sequence | 0, 0 / empty | `round-8.md` and `round-9.md` | one dry-run send line per run |
| S5 | S1 plus `agent_id: "a1"` | 0 / empty | none | empty |
| S6 | S1 with the lease absent; then another session's lease; then `relinquished: …` | 0 / empty, each | none | empty |
| S7 | S1 with `CLAUDE_CODE_REMOTE=true` | 0 / empty | none | empty |
| S8 | S1 with no dry-run and no credentials | 0 / empty | `round-8.md` | the telegram no-op line, then the send-failed fact line |
| S9 | stdin `not json` | 0 / empty | none | the not-JSON fact line |
| S10 | `questions: []`; a question with no `question`; an option with no `label`; a numeric `description` | 0 / empty, each | none | the malformed fact line |
| S11 | the real settings command through the hook shell, S1's stdin, `CLAUDE_PROJECT_DIR` set to the test project | 0 / empty | as S1 | as S1 |
| S12 | S8, then S1 in dry-run | — | outcome lines `{round 8, mode message, ok false}`, then `{round 9, mode message, ok true}` | — |
| S13 | one question whose description makes the file longer than 4096 code points | 0 / empty | `round-8.md` | a dry-run summary line naming round 8, then a dry-run document line naming the file |

## §4. Tests, one mutation each (`scripts/hooks/questions-mirror.test.mjs`)
- **No timing.** No sleep, timeout or timing assertion is used. S1's header date is matched by `\d{4}-\d{2}-\d{2}`, and the body is compared exactly.
- **How a mutation is observed:** apply it, run the named test, record the first failing assertion in the test's `// RECORDED MUTATION:` comment, then revert. The commit the mutation was observed at is named in the closing record. A `verify-mutation` run is not an observation.

| # | Test | Scenario | Mutation |
|---|---|---|---|
| T1 | `the_hook_writes_the_calls_own_questions_and_options_as_the_round_file` | S1 | M1: the option descriptions dropped from the render |
| T2 | `the_header_lists_the_red_line_items_by_number` | S2 | M2: the `RED LINE` test removed, so the header always reads `none` |
| T3 | `the_next_round_number_is_one_more_than_the_highest_round_file` | S3 | M3: the numbers compared as strings |
| T4 | `a_second_call_writes_a_second_round_and_sends_a_second_message` | S4 | M4: the send routed through `sendTelegramDeduped`, keyed on `session_id` |
| T5 | `a_call_inside_a_subagent_writes_and_sends_nothing` | S5 | M5: the `agent_id` case removed |
| T6 | `a_session_without_the_lease_writes_and_sends_nothing` | S6 | M6: the lease case removed |
| T7 | `a_cloud_session_call_writes_and_sends_nothing` | S7 | M7: the hook branch's cloud guard removed |
| T8 | `a_failed_send_still_exits_zero_with_empty_stdout` | S8 | M8: the hook exits 1 when the outcome is not ok, as the file-argument CLI does |
| T9 | `a_hook_input_that_is_not_json_exits_zero_and_writes_nothing` | S9 | M9: the parse error rethrown |
| T10 | `a_call_with_a_malformed_question_writes_no_round_file` | S10 | M10: validation removed |
| T11 | `the_settings_command_mirrors_a_recorded_askuserquestion_payload` | S11; it also asserts exactly one PreToolUse entry, matcher `AskUserQuestion`, timeout 20 | M11: `--hook` dropped from the settings command |
| T12 | `the_outcome_line_records_the_round_the_mode_and_the_send_result` | S12 | M12: `ok` written as `true` regardless of the outcome |
| T13 | `a_round_over_4096_characters_is_sent_as_a_document_from_the_hook` | S13 | M13: the hook calls `sendMessage` with the text directly, bypassing `mirrorRound` |

- **End-to-end runs from the real shape (the seam rule).**
  - **E1:** T11, in the suite on Windows and in governance-ci. It proves that the settings command, the hook shell, the script, the file and the send compose. It does not prove that Claude Code delivers that payload.
  - **E2:** the first AskUserQuestion call in the lease session after the merge, on a round the custodian raises anyway, so it costs the human no extra question. The custodian records it as a class 1 row on main, with:
    - `claude --version`;
    - n, and that n is one more than the prior maximum;
    - the file's sha256 at the commit that adds it;
    - that its items and options equal the call's `tool_input` as the custodian reads it in the transcript (whose path is not recorded);
    - that exactly one new round file appeared;
    - the outcome line;
    - that the question was displayed and answered (its RULED block).

    Predicted: all as declared. Only a live call can prove H1, H2's delivery, H3, H5 and H6.
  - **E3:** if E2's window raises a second call, that call is recorded the same way and must give n+1. If no second call is raised, E3 is not run, and the record says which happened.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - T1 to T13 pass at the fix, and each fails under its own mutation;
  - every existing test in `scripts/hooks/` and `scripts/plan/` passes unchanged, the settings-wide cloud test included with the new command;
  - E2, and E3 if run, come out as §4 predicts.
- **Declared unchanged:** §1's Unchanged list.
- **Invalidators:**
  - **I1 (stop, to the custodian; §4's hand mirror resumes until it is resolved):** at E2 the live call writes no file, writes two files, or is displayed altered or blocked (H1, H2, H3, H5).
  - **I2 (stop):** the change needs any edit to `mirrorRound`, `telegram.mjs`, `cloud.mjs`, the file-argument CLI, or `stop-queue.mjs` beyond the one export.
  - **I3 (stop):** a test needs a real Telegram send, network access, a timing assertion, or a platform ignore.
  - **I4 (stop):** T11 cannot run the real command through Git Bash on Windows.
  - **I5 (stop):** an existing test fails.
  - **I6 (stop):** the file count goes past §7's.
- **Falsification:** any of the following.
  - Any hook-mode path exits non-zero or writes to stdout.
  - A silent case writes, sends or prints.
  - One call yields two round files or two sends of one file.
  - A round file's text differs from the call's text beyond §7's added parts.

## §6. Instruments
Assertions only:
1. Exit status, exact stdout and stderr, file presence, and the file's bytes.
2. Dry-run send lines counted on stderr.
3. The outcome line, parsed.
4. E2's record items (§4).
5. `git --version`, `node --version` and `claude --version` (E2), each recorded (round 15 (c)).
6. `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`, each named with the tool's commit.

## §7. Declared values and ceilings
- **CLI flag:** `--hook`. **Settings:** event `PreToolUse`, matcher `AskUserQuestion`, `timeout: 20`. The timeout covers two sends at `telegram.mjs`'s 8 s each, plus process start.
- **Header line:** `Question round <n> — <YYYY-MM-DD UTC> (custodian → human; written by the round-mirror hook from the AskUserQuestion call). <k> item(s), asked in one call. RED LINE items: <comma-separated item numbers, or none>. AskUserQuestion is the answer channel; this mirror is read-and-copy.` Here `<k> item(s)` is `1 item` or `<k> items`.
- **Item line:** `<i>. <question>`.
- **Option line:** `  (<j>) <label>`, followed by ` — <description>` when `description` is a non-empty string.
- **Separators:** `\n\n---\n\n` after the header and between items. The file ends with one `\n`.
- **Numbering:** `^round-(\d+)\.md$`, base 10, the maximum plus 1, or 1 when there is none.
- **Write:** flag `wx`, UTF-8 with no BOM, LF.
- **Outcome line:** `.claude/state/round-mirror.jsonl`, with the keys `at`, `round`, `file`, `mode`, `ok`.
- **Stderr fact lines.** Each states the hook's own fact and its own consequence (round 7, operator-visible text):
  - `questions-mirror: hook input is not JSON; no round written.`
  - `questions-mirror: hook input carries no well-formed questions; no round written.`
  - `questions-mirror: no state/questions directory under the project root; no round written.`
  - `questions-mirror: round-<n>.md could not be written (<code>); nothing sent.`
  - `questions-mirror: round <n> send failed (mode=<mode>); the round file is kept for a re-send.`
  - `questions-mirror: hook error (<message>); exiting 0.`
- **Size budget:** ≤ 700 changed lines, insertions plus deletions, over ≤ 7 files:
  - `scripts/hooks/questions-mirror.mjs`;
  - `scripts/hooks/questions-mirror.test.mjs`;
  - `scripts/hooks/fixtures/pretooluse-askuserquestion.json`;
  - `scripts/hooks/stop-queue.mjs`;
  - `.claude/settings.json`;
  - `scripts/hooks/README.md`;
  - `AUTONOMY.md`.
  - Counting command: `git diff --numstat <merge-base>...<head> -- . ':!scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: about 130 script lines, 330 test lines, 45 fixture lines, 2 in stop-queue, 12 in settings, 30 in the README and 12 in AUTONOMY.md.
- **Minutes:** 150 (the custodian's check under AUTONOMY.md §10).

## §8. Block-on-sight
1. In the hook mode: any stdout; any exit status other than 0; `decision`, `permissionDecision` or `updatedInput` anywhere; exit 2 anywhere.
2. Any read from Telegram, or any path that takes Telegram as input.
3. A git call, network access other than through `mirrorRound`, or a write outside `state/questions/round-<n>.md` and `.claude/state/round-mirror.jsonl`.
4. Dedupe on the send, grouping by `prompt_id` or by turn, or adopting or skipping on an existing round file.
5. A change §5's I2 names.
6. Output in a silent case, or a cloud guard placed anywhere but the start of the hook branch.
7. A test that:
   - can reach the network;
   - inherits the developer's Telegram environment;
   - leaves its temp directory behind;
   - is ignored on a platform;
   - lacks its `RECORDED MUTATION`.
8. A user-profile path, token or chat id in the fixture, a test, a comment or a commit message.
9. `AUTONOMY.md` edited anywhere but the appended section, or §4 or §16 edited in place.
10. A quotation in the new code comments, the README text or the appended section.
11. A file outside §7's seven, apart from this form and the custodian's generated set.
12. A record that calls a `verify-mutation` run an observation, or a mutation recorded without its commit in the closing record.
13. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class 9 amendment.
14. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - reproduced text without its path:line and hash;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so;
    - a pin read as current.
15. A squash or rebase merge.

## §9. Gates
- **Architect:**
  - the Gating line's heads, and the no-new-exposure reading;
  - round 33, item 3 against §2, the single-writer rule included;
  - the seam reading and the caller rule (§1);
  - H1 to H7 against §0's pins;
  - round 7 on operator-visible text (§7's lines);
  - R1 to R6;
  - the appended section against §2 item 15;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - M1 to M13 observed;
  - T11 run on Windows;
  - the fixture's envelope checked against §3, and that it carries no profile path;
  - §7 recounted.
- **Suites, green before either gate:**
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` on Windows, and governance-ci on ubuntu-latest;
  - the §6 item 6 tools, each with its commit;
  - branch CI read before gating.
- **Operator:** none. E2 is the custodian's record of a round the custodian raises anyway.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)
```

**(a) Open points, each with my recommended reading**

1. **Hand-written file vs hook file (settle item 3).** I recommend the single-writer rule in §2 items 9 and 15. I rejected "skip when an uncommitted round file matches the call's question texts" for three reasons:
   - Round 33's RULED preamble records that call 1's question texts were condensed from the mirror, so a text match would have failed and produced two files.
   - Telling uncommitted from committed needs a git call.
   - The skip leaves a lapse path open: the custodian writes the file by hand and then forgets the CLI.
2. **The round-34 transition.** `state/questions/round-34.md` is hand-written and untracked at 9cb272e. Ask it before this piece merges, or delete it before E2. Otherwise the hook would write round 35 for the round-34 call.
3. **`header` and `multiSelect` are not rendered.** §4's content list names neither. If you want them, the cheapest additions are `[<header>]` after the item number and ` (multi-select)` at the end of the item line, with one more test.
4. **The label/description joiner is ` — `.** The hand-written rounds join the two with `. `, which inserts a character that is not in the call. Since the calls now carry short labels with long descriptions, ` — ` keeps the boundary visible.
5. **Timeout 20, not draft D's 15.** The document path is two sequential sends at 8 s each.
6. **The lease is read from stdin `session_id` through the exported `leaseHeldBy`, not from the environment variable.** That is the shipped reader's interface, and AI_DEVELOPMENT.md:725 equates the two values. E2 is the discriminator (H3).
7. **The outcome line in `.claude/state/round-mirror.jsonl`.** It is not in draft D. Without it the custodian cannot see a failed send, because hook stderr on exit 0 goes to the debug log only (AUTONOMY.md:429). I recommend keeping it.
8. **A hook mode of `questions-mirror.mjs` (as draft D.1 says), not a new file.** The cloud guard sits in the hook branch only, so the recorded mutation at cloud.test.mjs:48-50 stays true.
9. **Budget: 150 minutes.** The node carries 120. The custodian sets `gate:` to this form in the commit that adds it.
10. **E2 timing.** E2 shows only that the outcome line precedes the answer. Whether the message arrives before the question is displayed is not observable without asking the human. I recommend not asking.

**(b) Record text that contradicts the adopted shape**

- **Draft D.7** (`state/drafts/weekly-window-2026-10-02.md:135`) still allows "a round the custodian writes by hand for context". Under the ruled label, each call is its own round file, so such a file would make two files for one call. The form moves that context into the question text or a `state/drafts/` file.
- **Draft D.1's timeout of 15** is below the document path's worst case (point 5 above).
- **§4's multi-call round** (AUTONOMY.md:107-109): "question set n of m" within one round, with the full round written before the first call. That is superseded for calls by the appended section. §4 itself is not edited.
- **The RULED block's "Applied" says "its own Telegram message".** Above 4096 code points, §16 sends a summary message plus a document. I read "message" as §16's send.

**(c) Routed items that belong to another node**

- **`countItems`/`buildSummary` (questions-mirror.mjs:41-51) count one item high** on every round file with a header rule. Round 33's 11 rules give 12. This affects the document path today and through the hook. It should be a small fix node, since changing it here would break I2 and an existing assertion.
- **The AUTONOMY.md:104 rule** (red-line items accept typed text only, with no preset option beyond hold) does not match round 33. Items 1 and 8 there were RULED by preset labels. That is the custodian's or the human's to raise; the hook renders whatever the call carries.
- **The `.claude/settings.json` span cannot be pinned** in the `@ sha256:` grammar. That gap is already on `governance-hash-grammar-shared`.
- **Appendix B carries no PreToolUse facts.** A refreshed, tracked byte-copy of the hooks page's PreToolUse sections would turn H1 to H5 into pins. That is a custodian or record item, not this node.
- **Scanning round text for profile paths before the send** belongs to `exposure-scan-followups` if anyone wants it.

Files:
- C:\dev\spatial-ide\scripts\hooks\questions-mirror.mjs
- C:\dev\spatial-ide\scripts\hooks\stop-queue.mjs
- C:\dev\spatial-ide\scripts\hooks\cloud.test.mjs
- C:\dev\spatial-ide\.claude\settings.json
- C:\dev\spatial-ide\AUTONOMY.md
- C:\dev\spatial-ide\state\drafts\weekly-window-2026-10-02.md
- C:\dev\spatial-ide\state\questions\round-33.md
- C:\dev\spatial-ide\PLAN.yaml
