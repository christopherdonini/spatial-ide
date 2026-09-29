*Custodian's filing note (2026-09-29): gate 1 (reviewer) of PR #142, the A2-1 ADR texts, for PLAN node `b1-close-nul-column-names`. Reviewed: docs/a2-1-adr-texts @ f15b869715901d93f2233f1f702cdc3910a5122f (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. On its suggestion: Amendment 12 is the first commit of the code branch, before any code. Profile paths redacted at filing: none.*

---

Reviewed: docs/a2-1-adr-texts @ f15b869

Verdict: PASS. Reviewed docs/a2-1-adr-texts @ f15b869715901d93f2233f1f702cdc3910a5122f (PR #142, base main @ 834b2e7e0a8e97268997723e60947efe3c653e33, which is also the merge-base). Reviewer gate, attempt 1, PLAN node `b1-close-nul-column-names`, full gating (AUTONOMY §21a: an ADR amendment).

## Blocking

None.

## Checks

1. PASS: only the two ADR files change, and the diff adds lines only.
   `git diff --numstat 834b2e7...f15b869`
   ```
   7	0	docs/adr/ADR-021-row-filter-on-viewport-query.md
   22	0	docs/adr/ADR-023-attribute-projection-on-viewport-query.md
   ```
   `git log --oneline 834b2e7..HEAD` shows one commit, f15b869. Counting removed lines with `grep -c '^-[^-]'` gives 0 for each file. The hunks are `@@ -159,3 +159,25 @@` (ADR-023) and `@@ -233,3 +233,10 @@` (ADR-021). Both start at the old end of the file, so each text is appended at the end.

2. PASS: both recomputed hashes match the custodian's recorded values.
   `git show 834b2e7:state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md | sed -n 253,273p | sha256sum` gives `26655b47ae617b78df7373f522fb12e173d6f33dd640936754f328f1bf56122b`.
   The same command with `285,290p` gives `2ef0e6ec8537b3557d3e8ef559171ce706d0ec7854febbd9cdab0604e02c4bc3`.
   For each file I took the added lines (`git diff -U0 834b2e7...f15b869 -- <file> | grep '^+' | grep -v '^+++' | sed 's/^+//'`). In both files the first added byte is `\n`, which is the single blank line. I hashed the rest with `tail -n +2 | sha256sum`:
   - ADR-023: `26655b47ae617b78df7373f522fb12e173d6f33dd640936754f328f1bf56122b`. That is 21 lines, the same as 253-273.
   - ADR-021: `2ef0e6ec8537b3557d3e8ef559171ce706d0ec7854febbd9cdab0604e02c4bc3`. That is 6 lines, the same as 285-290.

3. PASS: no Status line changes, and both files end in one newline with LF endings.
   - **Status lines.** `git show <rev>:<file> | grep -n '^\*\*Status:\*\*'` returns one hit at line 3 in each file, identical at 834b2e7 and at f15b869. In the diff, the only added line containing "Status" is the ADR-021 note's italic line ("...the Status line included."), which is not a `**Status:**` line.
   - **Line endings.** `file` reports "Unicode text, UTF-8 text, with very long lines" for both files, with no CRLF. `grep -c $'\r'` gives 0 (rc=1). `git ls-files --eol` gives `i/lf w/lf attr/text=auto eol=lf` for both.
   - **Final newline.** `tail -c 2 | od -c` gives `.  \n` for both, so each ends with exactly one newline.

4. PASS: every governance check exits 0 in the worktree (health.mjs was not run).
   - `node scripts/plan/verify-cites.mjs`: rc=0. "verify:cites PASS — every rooted (in-tree) path:line reference across 912 file(s) resolves. (32 loose reference(s) advised above.)" The advisories are pre-existing and not in this diff.
   - `node scripts/plan/verify-quotes.mjs`: rc=0. "verify:quotes PASS — 112 checked, 81 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors."
   - `node scripts/plan/verify-test-claims.mjs`: rc=0. "verify:test-claims PASS — all 364 claimed test(s) across 94 file(s) exist or are planned, superseded or withdrawn (18 planned, 3 superseded, 17 withdrawn, advisory)."
   - `node scripts/plan/verify.mjs`: rc=0. "verify:plan PASS — ...PLAN.yaml agrees with the repository."
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, with tests 353, pass 353, fail 0.
   - `gh pr checks 142` (rc=0): "every commit is signed off" pass; "test · verify:plan · queue/site drift" pass (two runs). The PR head is f15b869715901d93f2233f1f702cdc3910a5122f, base main, OPEN, not a draft.
   - The worktree porcelain is clean after the runs.

5. PASS: the commit carries a DCO sign-off.
   `git log -1 --format='%B' f15b869` ends with `Signed-off-by: Christopher Donini <donini.christopher@gmail.com>`, and CI's sign-off check passes.

## Standing checklist (docs-only diff)

- **Untracked Authority (round 14):** every path the two texts cite is tracked at f15b869: `state/directives/2026-09-28-after-wave-s1-batch.md`, `state/directives/2026-09-29-a2-1-clarification.md`, `state/cloud/wave2/W2-A2.md`, `engine/B1-PROJECTION-PREREGISTRATION.md` and `state/drafts/a2-1-p0/`.
- **Verbatim quotes (rounds 10-12):** neither added text presents a passage as verbatim, so nothing needs resolving against a source.
- **Line cites:** neither text contains a bare `:line` cite or a hash reference.
- **Discharge claims (round 7):** neither text contains a "discharged" or "done" clause.
- **Class 9:** no code is in this diff, so nothing lands ahead of the amendment that declares it.
- **Rules 1-7 (correctness, blocking, JSON on a data path, CRS, perf claims, float precision, tests):** not applicable. There is no code, no perf claim and no CRS content.

## Suggestions

- The ADR-023 amendment's line "Implementation: `engine/B1-PROJECTION-PREREGISTRATION.md` §10, Amendment 12." points to an amendment that does not exist yet at f15b869. That file's last amendment is Amendment 11, and Amendment 12 exists so far only in the draft (`state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md`, its heading "### Amendment 12 — 2026-09-29, post-result"). The reference is part of the sighted byte-copy, so this does not block. However, the `b1-close-nul-column-names` gate should confirm that Amendment 12 lands in `engine/B1-PROJECTION-PREREGISTRATION.md` before any code of the piece. That is the class-9 rule.

## Nits

None.
