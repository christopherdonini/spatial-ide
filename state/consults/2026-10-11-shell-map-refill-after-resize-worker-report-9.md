*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 9, the human's second ruling on item 39 and gate 3's D1 under the form's Amendment 5, head 66cc80de5bdc711bb448deac212d373835356519, published; the two doc comments are the worker's words (the worker run 09:50:38Z to 09:53:46Z by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 80cdc799a962bdfc0f80d444190f2358ce89e5f4db408dd3aeec06ad1deb909d.*

---

Commit 66cc80de5bdc711bb448deac212d373835356519 on cut/shell-map-refill-after-resize: "docs: item 39 carries the human's two sentences; D1's two doc comments state the arms". It is signed off and carries the Co-Authored-By trailer. Pushed (58967ff4..66cc80de). No PR opened and the PR body is untouched.

**Changed lines** (the replacements are by script from the directive's line 13 and the form's Amendment 5 item 2; no sentence was typed)
- KNOWN-LIMITATIONS.md line 367 (item 39) now carries the ruling's line 13, three leading spaces removed, in place of the span "One exception:" to "Zoom to layer.". That span occurred exactly once in the file.
  - old sha256 eba80c9a1ec861011e801e09070d030f910d0e4f090480ad930340f535461fab
  - new sha256 66583495debf29d19cfe8cc88fd0163c5c3f7b7fc553874802f3ced3b97332d7
  - The new line equals the old one with exactly that span replaced (script check true).
  - sha256 of the inserted ruling text: ddac64c3e9856b4df2eda08519eafbb9b69f0fd95196f1025d7caafa8d4ada0b
- KNOWN-LIMITATIONS.md line 368 (the source comment) has Amendment 4's clause replaced by Amendment 5 item 2's quoted clause. Nothing else in the comment changed (script check true).
  - old sha256 4308eec70f97cd81b51ce2a19475869f28f0e73290c095bac767b6f54ff9d81d
  - new sha256 9fb8d5da87e3bf79d38c7d432873efb6aa66113a30e303ed810d6f7996d05c26
  - sha256 of the clause: 60853b94d777af79db62828b4db1be2dca9f38e8b7897bc3934b4a4e3a542c8b
- WorkingCanvas.tsx, doc comment on `resetFitForNewGeneration` at lines 133-135. Old text: "called whenever a new FILTER GENERATION begins (`App.tsx`'s `applyFilter`, on any Apply or Clear / that actually issues)." New text, written by me: "called at the start of every reissue of the filter query (`App.tsx`'s `applyFilter`): on the / candidate residency arm whatever the outcome of the Apply or Clear, on the baseline arm on an / issued outcome." The new text is 3 lines where the old was 2.
- WorkingCanvas.tsx line 1020 (was 1019). The old "(a new filter generation) clear it." is now "(run at the start of a filter reissue) clear it."
- Both doc-comment rewordings are mine, not byte-copied. No RF7 or RF10 token was added.

**Checks**
- `git diff 58967ff4 HEAD --stat` touches only KNOWN-LIMITATIONS.md (2 lines) and WorkingCanvas.tsx (7 lines changed, 4 inserted and 3 deleted).
- With comments stripped from both revisions of WorkingCanvas.tsx, the code is identical (script check true).
- `npx vitest run src/canvas/WorkingCanvas.test.ts`: 41 of 41 passed, exit 0.
- `npx tsc --noEmit -p .`: exit 0.
- `node scripts/plan/verify-cites.mjs`: PASS, exit 0. It printed 49 loose-reference advisories, all in state/drafts.
- `node scripts/plan/verify-quotes.mjs`: PASS, exit 0. It reports 2 hash-baselined failures, both in engine/LOD-PREREGISTRATION.md, which are pre-existing.
- §7 at base 4fd3259a, using `git diff --numstat 4fd3259a...HEAD`:
  - KNOWN-LIMITATIONS.md: 2 insertions and 3 deletions, 5 in all, against 8. Within.
  - WorkingCanvas.tsx: 50 insertions and 10 deletions, 60 in all, against 90. Within.
  - The form's whole-shell command, with its three exclusions, totals 439. I did not compare that figure to a ceiling.

**State:** the worktree's `git status --porcelain` is empty. HEAD is 66cc80de5bdc711bb448deac212d373835356519, published to origin.

Self-check:
- The change is documentation and comments only; no cross-module code was written.
- Every completion claim above points to a script or run result from this session.
- No user-facing message was added.
- The test run reached its assertions (41 of 41).
- I ran as Sonnet 5.5 with no model override and no context handoff.
