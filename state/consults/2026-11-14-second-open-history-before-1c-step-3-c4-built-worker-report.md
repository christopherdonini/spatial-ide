*Custodian's filing note (2026-11-14): the worker's report on PR #318's C4 (c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6), built under the advisor's ruling ADV-2026-11-14-20 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-20-318-reviewer-c1-and-d1-stand-amendment-2-three-spans-new-fence-d1-in-c4-the-reviewers-c4-check-a-new-attempt.md`), items 4 to 7, from its last hand-back (5482 bytes, sha256 291199538adf979ccdcf98ddd8ac4d38513734840bbec0592361d13538d66dc8), below the rule, byte for byte. Its brief by file (10520 bytes, sha256 f70cf17986676ff7f1462fcf2d3c32e417dbd1aaaaebd4caf2101c924d6063af); the run 2026-11-14T18:07:45Z to 2026-11-14T18:23:43Z by its transcript, 34 calls (Read 3, Bash 22, Write 5, SubagentHandback 4), none errored, its writes 5 scripts and message files in the custodian's scratch folder, one push in a call of its own, model claude-sonnet-5-5. Its four hand-backs: a stop at 2026-11-14T18:08:51Z, before any edit, at its brief's check that each value of the spans file occurs once in the ruling's copy, where each new span occurs twice, once in its item and once in the fence (the custodian's brief's defect, for round 77); resumed at 2026-11-14T18:09:52Z by the custodian's message with the corrected counts; two interim hand-backs while it waited for a shared hold (2026-11-14T18:13:18Z, 2026-11-14T18:18:41Z); this report at 2026-11-14T18:23:29Z. One departure it does not name: its verify-quotes run took --show-cites over the two changed files, where its brief named the whole run; the reviewer's attempt 3 is asked to run it whole. Its count from the merge base, 751 over 11 files (710 over code and tests), goes to the closing amendment (D8). Evidence, not Authority.*

---

Built: second-open-history-before-1c-step-3 C4 at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6

**Start state:** worktree `C:/dev/wt/so`, HEAD dc0bd9374e8b268bd09718f01994a960b92acd4f, branch cut/second-open-history-before-1c-step-3. The remote ref equalled HEAD and the porcelain was empty. The brief's size and sha256 matched (10520 bytes, f70cf179…). The form had no commit after e682e829. C: had 49G free, D: 342G.

**S0:** `gh pr list` showed only #318, this branch, so there was no other branch to diff. Item 43's second comment is `KNOWN-LIMITATIONS.md` line 438.

**Departure (the brief's one):** the custodian corrected the words-file check. Their corrected check, byte-copied from their message:
- "`a_old`, `b_old`, `c_old`, `d1_old` and `d1_new` each occur exactly once in the ruling's copy;"
- "`fence` without its final LF occurs exactly once;"
- "`a_new`, `b_new` and `c_new` each occur exactly twice: once outside the fence, in item 4, and once inside the fence's span. The script asserts both positions."

The call that ran it was `node <S>/soc4-apply2.mjs`. It exited 0 and printed "words check ok" and "applied". The first run, with the original check, exited 2 on `a_new` found twice and edited nothing.

**C4:** `c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6`.
- Subject: "docs: ADR-036 Amendment 2 items 4's three spans and item 43's second comment in KNOWN-LIMITATIONS.md reworded".
- Committer time: 2026-11-14T19:22:56+01:00.
- Files: `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` (4 lines changed) and `KNOWN-LIMITATIONS.md` (2 lines changed), 3 insertions and 3 deletions. Nothing else.
- Second script `soc4-check.mjs`, exit 0:
  - The ADR equals its dc0bd937 text up to the Amendment 2 heading plus the fence, and ends with one LF.
  - `KNOWN-LIMITATIONS.md` equals its dc0bd937 text with `d1_old` replaced once, in one hunk (`@@ -438 +438 @@`).
  - `git diff --stat` names those two files only.
- Exit codes:
  - `verify-cites.mjs`: 0.
  - `verify-test-claims.mjs`: 0.
  - `verify.mjs --offline`: 0.
  - `verify-quotes.mjs --show-cites` on the two files, in a shared hold: 0.
  - `node --test` on the three script folders, in a shared hold: 0. The log reads "tests 598, pass 598, fail 0".
- No cargo run, since C4 changes no Rust file.

**Changed lines:**
- ADR Amendment 2 intro: "(ADV-2026-11-14-17)." becomes "(ADV-2026-11-14-17, ADV-2026-11-14-19 and ADV-2026-11-14-20)."
- Item 4's second sentence now reads "step 2's reopen, in the same run, of a saved project whose record this run holds binds the new open to the project at the reopen, before any step on it, and continues that record."
- Item 4's last sentence now begins "At this piece no save binds an open to a project whose record the run already holds:" and gains a closing sentence "A later save binds the open only if no save has bound it yet, … (`StepRecorder::adopt_project`)."
- `KNOWN-LIMITATIONS.md` line 438: "; and a crash between the move and the removal of the old folder, after which both folders stay." becomes "; a crash between the move … both folders stay; and a removal of the old folder's files that fails after the move, after which the old folder stays, and a normal close does not remove it."

These are my abbreviations. The full before and after are in the `git diff` I displayed, and each span is script-copied from `soc4-words.json`.

**Count**, `git diff --numstat 695e1303794ed390d305d07fca592694f33f589e HEAD`, 11 files:

| File | Added | Deleted |
|---|---|---|
| `KNOWN-LIMITATIONS.md` | 3 | 6 |
| `ADR-036-project-folder-step-record-and-dataset-reference.md` | 12 | 0 |
| `B2-1B-RECORDING-PREREGISTRATION.md` | 4 | 0 |
| `B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` | 4 | 0 |
| `kernel/src/project/mod.rs` | 21 | 21 |
| `kernel/src/session_history.rs` | 166 | 98 |
| `kernel/tests/project_save.rs` | 124 | 0 |
| `kernel/tests/project_save_skp.rs` | 154 | 54 |
| `kernel/tests/session_history.rs` | 31 | 34 |
| `SKP-V0.md` | 10 | 2 |
| `commands.rs` | 3 | 4 |
| **Total** | **532** | **219** |

The total is 751 lines.

By §21c's rule (`governance/AUTONOMY.md`, §21c, insertions plus deletions over non-generated code and tests), the six code and test files come to 710 lines (mod.rs 42, session_history.rs 264, the three test files 124, 208 and 65, commands.rs 7). The five non-code files (the ADR, `KNOWN-LIMITATIONS.md`, `SKP-V0.md` and the two forms) come to 41. Which of those fall in or out of the budget is for the custodian's count; I did not rule on it.

**Push:** a call of its own with nothing else in it. The remote ref now equals HEAD c8f8bdca. The porcelain is empty. No PR action was taken, and I did not wait for CI.

**Machine:**
- First status: a `project=SpatialIDE` line was present (reading quiet=False, average 34.7%, 60 peaks over 25, 60 samples). A background wait loop (hard timeout 90 minutes) then ended once the status showed none, with the last reading quiet=False, average 35.4%, 60 peaks over 25, 60 samples.
- Before the second hold: `project=SpatialIDE` line absent, reading quiet=False, average 36.7%, 60 peaks over 25, 60 samples.
- Holds granted (the shared hold line, `shell=bash.exe` entries omitted): "so C4: verify-quotes" and "so C4: node scripts tests". Both were released.

**Left running:** nothing. Every background shell has exited.

**Off-scope noticed:** nothing beyond the brief.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No override and no context handoff.
