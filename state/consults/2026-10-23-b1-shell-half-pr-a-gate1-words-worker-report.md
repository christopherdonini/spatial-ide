*Custodian's filing note (2026-10-23): #246's gate 1 words, entries 1 to 10 of the architect's reconciled set, applied by a worker at 0ed4b305 with no re-gate. The run 13:09:42Z to 13:19:53Z by its transcript (Bash 12); its claims were read against that transcript's calls before filing: one commit and one push, origin's branch equal to the head, the porcelain empty, no force push, rebase or PR call, only the six files changed since the head both gates read, its Edit and Write calls only on its own scratch files; its npm run verify ran. Its one departure, as it says: its shared-hold call exported the environment before the hold, not after cd; the hold was granted and released. Section 7 over the merge base stays 51 files and 1,900 lines. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is cf9a42b39128fd367463c4e610a1e9461da9330f6cfae744a37416f57af81622.*

---

Applied: #246 gate 1 words at 0ed4b305b6e5573355ce0610f9227a7d03a806f6

Commit (one, signed off, pushed): "docs(shell): milestone 4 PR A, gate 1 words: items 51 and 52, rows AC1, AC9 and AC10, the PA-E3 entry, two comments and one P6 mark". Parent is 35085072. The Co-Authored-By and Claude-Session trailers are in the message.

Method: a script read the consult and took each target and each final block from it, so nothing was retyped. Entries 1 and 3 take their target from the fenced block after "Target". The other targets were string literals in the script, copied from the entries' byte-copied spans. The script showed each target occurs exactly once (rc=0, no STOP) before every edit, and showed each final text occurs once after it. Entry 7 inserts after the sentence, so the old sentence still occurs once inside the new text, as expected. All six files had LF endings.

Per entry, once-before / once-after:
- 1 (`KNOWN-LIMITATIONS.md` item 51): 1 / 1.
- 2 (`KNOWN-LIMITATIONS.md` line 413): 1 / 1. The words go in between "FeatureTab.tsx." and " -->".
- 3 (`KNOWN-LIMITATIONS.md` item 52): 1 / 1.
- 4 (`App.tsx` line 817): 1 / 1. The sentence is replaced on its own line and no line is added.
- 5 (row AC1): 1 / 1.
- 6 (row AC9): 1 / 1.
- 7 (row AC10): 1 / 1. A leading space starts the insertion.
- 8 (`e2e/README.md`, PA-E3): 1 / 1.
- 9 (`values.ts` line 48): 1 / 1. The `[P6 placeholder]` mark is added.
- 10 (`client.ts` line 98): 1 / 1. The whole line is replaced and line 99 is untouched.

Diff of each file: `KNOWN-LIMITATIONS.md` 5 lines changed, `MANUAL-WALKTHROUGH.md` 3, and one line each in the other four. In total 12 insertions and 12 deletions. No test file changed.

Checks:
- `git diff --stat 35085072...HEAD`: rc=0. It names the six files only.
- §7 command over `c1f782db...HEAD`: rc=0, 51 rows.
  - `App.tsx` 37 added and 5 deleted.
  - `values.ts` 98 and 0.
  - `client.ts` 7 and 7.
  - Outside the count (checked separately): `KNOWN-LIMITATIONS.md` 8 and 0, `MANUAL-WALKTHROUGH.md` 29 and 0, `e2e/README.md` 12 and 0.
  - Last row is `renderer/tests/style_shell_agreement.rs`, 1 and 3.
- §4 text checks: rc=0. The script ran over 222 files in `frontends/shell/src` and `renderer/tests`, plus `viewTransitions.ts` for "Proposed, so it binds nothing". Line by line: 0. Joined with leading whitespace, comment marker and following whitespace stripped: 0. The self-test of the joined reading is positive.
- `npx tsc --noEmit`: rc=0, no output.
- `node scripts/plan/verify-cites.mjs`: rc=0, PASS. `verify-quotes.mjs`: rc=0, PASS. `verify-test-claims.mjs`: rc=0, PASS. `verify.mjs`: rc=0, PASS.
- `npm run verify` in `frontends/shell`, inside a shared hold: rc=0. 104 test files and 1413 tests passed. `noticeDeterminism.test.ts` passed in that run, so no separate run was needed.
- Push: rc=0. After a fetch, HEAD and origin/cut/b1-shell-half-pr-a are both 0ed4b305b6e5573355ce0610f9227a7d03a806f6.
- `git status --porcelain` is empty.
- No process I started is still running.

Pre-gate self-check:
- Cross-module code: none changed.
- Every completion claim points to evidence: each claim above has a script output or exit code behind it.
- User-facing messages: all text is the architect's words, applied as given. The `readCell` message gains only a mark.
- Required tests reaching their assertions: no test was added or changed.

Departures: the shared-hold call set the environment variables with an `export` before the hold, instead of putting `cd` first as the machine paragraph prescribes. The hold was granted, and the release printed. I needed no word the entries did not give, and I touched nothing outside the six files.

Model: claude-sonnet-5-5 (Sonnet 5.5), no override and no context handoff.

State: branch `cut/b1-shell-half-pr-a` at 0ed4b305, pushed, clean. My scratch files are `m4a-w1-*` in the session scratchpad folder.
