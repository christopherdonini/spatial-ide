*Custodian's filing note (2026-10-23): the human's C1 and D1 answers applied to #244 by a worker on `cut/walkthrough-row-f7-cli-refusal` (its form's Amendment 6). The run 17:36:04Z to 17:52:07Z by its transcript (Bash 20, Monitor 1, Read 1, Write 1); its claims were read against that transcript's calls before filing: one commit and one push, origin's branch equal to the head, the porcelain empty, no force push, rebase, amend or PR call; its Edit and Write calls only on the walkthrough and its `f7-c1w-` scratch files; only the walkthrough changed since abc900f2. Its scripts suite was red in a shared run on the guardian parity family and one stop-queue test, each green alone, as it says; the PR's CI and the custodian's gate run read the suite. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder, and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is aef17c33560a191fd32461041779d46fe7261538a91454ccf394acfd3f1c53d4.*

---

Applied: #244 C1 and D1 at 76f4b9225f1e9fc091570112a4855a6f0543967c

Commit: `docs(shell): OPEN-4's parenthetical in the reviewer's words with code spans, and G7's serve-bundle.mjs marked (#244, the form's Amendment 6; the human's C1 and D1)`. It is signed off, with the two trailer lines. One file changed, 5 insertions and 4 deletions.

Recomputation: my own script took the clause from the reviewer's gate 2 report (the line after `Replacement words`) and kept line 279 up to and including `); `. It backticked the four spans, each checked to occur exactly once, and wrapped greedily at 100 columns with code spans unbreakable. The result matched the custodian's file byte for byte. The new lines were 91, 78, 95 and 12 columns. The three old lines matched `oldLines`, and the G7 `g7new` matched too. No difference, so no STOP.

Once-before and once-after:
- Before: the old three-line block occurred once, and `g7old` occurred once.
- After: the new four-line block occurs once, `g7new` occurs once, and `g7old` occurs 0 times.

Diff:
- OPEN-4's three lines became four, with the C1 parenthetical `(the shell's build copies that record for its publish, and stops without it)` and the code spans.
- G7 gained the `serve-bundle.mjs` code span and stays one line.
- Hunks, `git diff -U0 fd47e6cf`, rc=0: lines 259 and 274 (earlier commits, unchanged by me), 279 (-2 +4), and 330 to 332 (G7).
- These are the spans §4 item 1 names. I did not re-read §11 for the hunk ranges.

§7: `git diff --numstat fd47e6cf...HEAD` gives 8 added and 6 removed, 14 in all, at the ceiling. `git diff --name-only` gives the one file. rc=0 for both.

§4 item 2 at B, then at my head:
- Each pattern was positive at B first. At B, `publish-bundle.exe --data` matched 1 line.
- At my head, `publish-bundle.exe --data` matches 0.
- `viewer/NOTICE.txt` matches exactly 1 line, line 274, the F7 line.
- `kernel/src/bin/publish-bundle.rs` matches 1 line, the F7 line.
- The `cargo build -p spatial-kernel --bin` sentence hashes identically at B and at my head.
- Every new line is at most 100 columns. The only changed lines over 100 are the existing F7 and G7 table rows.

Checks:
- `verify-cites`: rc=0, PASS (2202 files).
- `verify-quotes`: rc=0, PASS (130 checked).
- `verify-test-claims`: rc=0, PASS (613 tests).
- `verify`: rc=0, PASS (PLAN agrees with the repository).
- Scripts suite, first run inside a shared hold: rc=1, 523 of 527 pass.
  - Four failed: the `guardian parity` test, PS9, PS10 and `stop-queue: the caps end the turn on a stale block`. PS10 read `not judged`. PS9 read stale where fresh was expected. The parity test took 151 s.
  - Re-run alone, each in its own hold: `guardian-continuity-parity.test.mjs` rc=0 with 15 of 15 pass, and `hooks.test.mjs` rc=0 with 66 of 66 pass (that file holds the stop-queue test).
  - Only the parity-family failures matched the pattern your brief named. The stop-queue failure is outside the instruction, and it passed alone too.
  - I did not run the whole suite a second time, so there is no single green full-suite run.

Hold lines, SpatialIDE only: `MACHINE_HOLD shared project=SpatialIDE ...` appeared three times, once per heavy run. Each was followed by `MACHINE_RELEASED project=SpatialIDE`.

Push: `git push origin cut/walkthrough-row-f7-cli-refusal` rc=0 (`abc900f2..76f4b922`). `git ls-remote` shows origin's branch at 76f4b9225f1e9fc091570112a4855a6f0543967c, equal to HEAD. `git status --porcelain` is empty.

No process I started still runs. The hold-wrapped commands and the verify loop all exited, and each hold was released. No PR action. Scratch files are all named `f7-c1w-*`.

Model: Sonnet 5.5, ID claude-sonnet-5-5, as the harness reports it. No override and no context handoff.

Self-check on the four failure classes:
- Interface: no cross-module code was touched.
- Completion claims: each points to a command in this transcript.
- User-facing messages: only walkthrough prose changed. It describes the shell's build copying the record and stopping without it, per the reviewer's C1 facts, which I did not re-derive.
- Required tests: none were added.
