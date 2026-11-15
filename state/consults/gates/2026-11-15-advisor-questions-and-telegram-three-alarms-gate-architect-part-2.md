Reviewed: PR #323 at bb341a7294846b19bef3085b7acccd3a44a52b4a (the custodian's filing note, 2026-11-15: the gate, the architect, at C, the second part of its gate (ADV-2026-11-15-05 item 8 (a); `state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-05-323-the-reviewers-line-21-the-architects-halt-comment-t7-record-section-38-three-sentences-one-correction-commit.md`), its first part `state/consults/gates/2026-11-15-advisor-questions-and-telegram-three-alarms-gate-architect.md`, together the gate's attempt 1, gate-log row 757, which stands, with no new row, since item 8 asks for no new attempt and no new verdict; under the form `governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`, its section 9 and Amendment 1, PLAN node advisor-questions-and-telegram-three-alarms, the docs lane; its message sent at 2026-11-15T03:27:38Z by the custodian's transcript to the same run, whose resumed prompt at 2026-11-15T03:27:54Z holds it byte for byte (2878 bytes, sha256 5a12c3591e5a49b12dd278bd5e41677e2acd7347a813f59b258ba397594210ed); this part 2026-11-15T03:27:54Z to 2026-11-15T03:28:46Z by its transcript, 11 calls (Read 9, Grep 1, SubagentHandback 1), none errored by the transcript, no file written outside the scratch folder, model claude-opus-5-5; it has no shell and gives no hash, as it says; below, the hand-back byte for byte (4817 bytes, sha256 42b4507f341b6c61b3eb4cf44a8af679677295214a3188b4d90a946f9f45840d), with this note in its first line. Nothing else is changed.), gate architect at C, the second part of its gate
Verdict: PASS WITH NOTES

Correction commit C closes D1 to D4 from the first part, and all five changed lines are true against the code at C. I found no untrue clause, so nothing goes to the advisor under item 8 (c). Nothing I read in this part changes the first part's verdict: D1 and D2 are closed by items 1 and 2 of the ruling, D3 by Amendment 1 item 3, and D4 by the new first sentence of (vii). My O1 to O8 stand as observations (item 11). All paraphrase below is mine; backtick spans are byte-copied from the file named.

**What I read first.**
- The ruling `<S>/adv-2026-11-15-05.copy.md`, whole.
- The diff `<S>/c323-diff.patch`, whole. C changes three files and five lines: `governance/AUTONOMY.md` at lines 732, 733 and 735, `scripts/hooks/notify-telegram.mjs:21` and `scripts/hooks/stop-queue.mjs:167`. Each file keeps its line count (3/3, 1/1 and 1/1 in the diff).
- The form's Amendment 1, in the main checkout, lines 213 to 247.
- The worker's report `<S>/rep-c323.md`, as evidence.

**Check 1. D1, as closed by item 1.**
- Line 21 at C reads `// changes no decision, and its key is still recorded: a repeat within the window is not sent.`
- "changes no decision": `main()` exits 0 on every path (`notify-telegram.mjs:63` and `73`).
- "its key is still recorded": `sendTelegramDeduped` writes the key through `writeSentMap` before it calls `sendTelegram`, whatever the send's result (`telegram.mjs:262-268`).
- "a repeat within the window is not sent": the same key inside `windowMs` returns `deduped: true` (`telegram.mjs:258-261`). The call at `notify-telegram.mjs:68` passes no `windowMs`, so the window is `DEDUPE_WINDOW_MS`, ten minutes (`telegram.mjs:36` and `251`).
- The one exception is a failed write of the dedupe file. Then no key is recorded and the hook sends anyway (`telegram.mjs:263-267`). Amendment 1 item 4 states this correctly and records it under §31 (c) as outside ordinary use.
- Result: true; D1 is closed.

**Check 2. D2, as closed by item 2.**
- Line 167 at C reads `// The halt alarm: the HALT headline alone, deduped on its own text (one key in .claude/state/telegram-sent.json).`
- "the HALT headline alone": the halt branch passes only the `HALT: …` text (`stop-queue.mjs:289`).
- "deduped on its own text": `notifyHalt` uses the key `halt:${text}` (`stop-queue.mjs:170`).
- "one key in .claude/state/telegram-sent.json": the state file is `<projectRoot>/.claude/state/telegram-sent.json` (`telegram.mjs:229-231`), and one key is written per text (`telegram.mjs:264`).
- Result: true; D2 is closed.

**Check 3. The three changed sentences of §38 Part B, in `governance/AUTONOMY.md` at C.**
- **(iv), last sentence (line 732):** `A repeat with the same type and the same first 80 characters of its message, within ten minutes and under the same project root, is not sent.`
  - The key is the type plus the first 80 characters of the message (`notify-telegram.mjs:28` and `37-40`).
  - The window is ten minutes by default (`telegram.mjs:36` and `251`).
  - The project root is `CLAUDE_PROJECT_DIR`, else the input's `cwd`, else `process.cwd()` (`notify-telegram.mjs:42-44`). The dedupe file sits under that root (`telegram.mjs:230`).
  - Result: true. The only exception is the failed-write case of check 1, already recorded.
- **(v), last sentence (line 733):** `A repeat of the same text, within ten minutes and under the same project root, is not sent.`
  - The key is `halt:${text}`, and the window is `TELEGRAM_DEDUPE_WINDOW_MS`, ten minutes (`stop-queue.mjs:170` and `56`).
  - The project root is found by `resolveProjectRoot` (`stop-queue.mjs:68-70`) and passed through `decide` (`385`, `388`).
  - Result: true.
- **(vii), first sentence (line 735):** `The Stop hook sends no waiting-list message: when no halt is found and only human-blocked nodes remain, it sends nothing.`
  - The only send in the hook is `notify` inside the halt branch (`stop-queue.mjs:286-293`).
  - When no halt is found and only human-blocked nodes remain, step 6 pushes its stderr line and returns with no send (`335-340`).
  - No waiting-list sender remains in the file (`167-174` is the halt sender only).
  - Result: true; D4 is closed.

**Findings.**
- Correctness: none.
- Evidence: none.
- Documentation: none new.
- Observation: I did not recompute any hash, so I give none. Amendment 1 item 2's section-file figures, and check C3 with the new section file, are the reviewer's by script (item 8 (b)). The worker's report gives `S38-OK` at C, along with the suite and verify runs, all rc 0.

**Calls in this part.** Read 9, Grep 1, SubagentHandback 1. I wrote no file and left no background shell.

**Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it.
